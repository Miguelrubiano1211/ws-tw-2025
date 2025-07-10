/**
 * 🔐 Ejercicio 03: Password Hashing con bcrypt
 *
 * Conceptos fundamentales:
 * - Hashing: Función irreversible de transformación
 * - Salt: Valor aleatorio para prevenir rainbow tables
 * - Bcrypt: Algoritmo de hashing adaptativo
 * - Cost Factor: Número de rondas de procesamiento
 *
 * Objetivos:
 * - Implementar hashing seguro de passwords
 * - Verificar passwords hasheados
 * - Entender salt rounds y rendimiento
 * - Migrar de passwords en texto plano
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Configuración de bcrypt
const SALT_ROUNDS = 12; // Número de rondas de salt (mayor = más seguro pero más lento)

// Base de datos simulada con algunos usuarios ya hasheados
const usuarios = [
  {
    id: 1,
    username: 'admin',
    // Password hasheado de '123456' con 12 salt rounds
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LTvEOtqOPIBHDGaXi',
    rol: 'admin',
    email: 'admin@ejemplo.com',
    passwordChanged: new Date('2024-01-01'),
  },
  {
    id: 2,
    username: 'user',
    // Password en texto plano (MAL - solo para demostración)
    password: '123456',
    rol: 'user',
    email: 'user@ejemplo.com',
    passwordChanged: new Date('2024-01-01'),
  },
];

// Historial de passwords (para prevenir reutilización)
const historialPasswords = [];

// 1. FUNCIONES DE HASHING

/**
 * Hashear password con bcrypt
 * @param {string} passwordTextoPlano - Password en texto plano
 * @returns {Promise<string>} Password hasheado
 */
const hashearPassword = async passwordTextoPlano => {
  try {
    console.log('🔐 Iniciando proceso de hash...');

    // Generar salt y hashear password
    const inicio = Date.now();
    const passwordHasheado = await bcrypt.hash(passwordTextoPlano, SALT_ROUNDS);
    const tiempo = Date.now() - inicio;

    console.log(
      `✅ Password hasheado en ${tiempo}ms con ${SALT_ROUNDS} salt rounds`
    );
    console.log(`📝 Hash generado: ${passwordHasheado}`);

    return passwordHasheado;
  } catch (error) {
    console.error('❌ Error hasheando password:', error.message);
    throw new Error('Error al hashear password');
  }
};

/**
 * Verificar password contra hash
 * @param {string} passwordTextoPlano - Password en texto plano
 * @param {string} passwordHasheado - Password hasheado
 * @returns {Promise<boolean>} True si coinciden
 */
const verificarPassword = async (passwordTextoPlano, passwordHasheado) => {
  try {
    console.log('🔍 Verificando password...');

    const inicio = Date.now();
    const esValido = await bcrypt.compare(passwordTextoPlano, passwordHasheado);
    const tiempo = Date.now() - inicio;

    console.log(`${esValido ? '✅' : '❌'} Password verificado en ${tiempo}ms`);

    return esValido;
  } catch (error) {
    console.error('❌ Error verificando password:', error.message);
    throw new Error('Error al verificar password');
  }
};

/**
 * Verificar la fuerza de un password
 * @param {string} password - Password a verificar
 * @returns {Object} Información sobre la fuerza
 */
const verificarFuerzaPassword = password => {
  const criterios = {
    longitud: password.length >= 8,
    minusculas: /[a-z]/.test(password),
    mayusculas: /[A-Z]/.test(password),
    numeros: /\d/.test(password),
    simbolos: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    noComun: !['123456', 'password', 'qwerty', 'abc123'].includes(
      password.toLowerCase()
    ),
  };

  const puntuacion = Object.values(criterios).filter(Boolean).length;

  let nivel = 'Muy débil';
  if (puntuacion >= 5) nivel = 'Fuerte';
  else if (puntuacion >= 4) nivel = 'Moderado';
  else if (puntuacion >= 3) nivel = 'Débil';

  return {
    puntuacion,
    nivel,
    criterios,
    recomendaciones: [
      !criterios.longitud && 'Usar al menos 8 caracteres',
      !criterios.minusculas && 'Incluir letras minúsculas',
      !criterios.mayusculas && 'Incluir letras mayúsculas',
      !criterios.numeros && 'Incluir números',
      !criterios.simbolos && 'Incluir símbolos especiales',
      !criterios.noComun && 'Evitar passwords comunes',
    ].filter(Boolean),
  };
};

// 2. MIDDLEWARE DE AUTENTICACIÓN CON BCRYPT

/**
 * Middleware para autenticar usuario con password hasheado
 */
const autenticarConBcrypt = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      error: 'Credenciales requeridas',
      mensaje: 'Proporciona username y password',
    });
  }

  try {
    // Buscar usuario
    const usuario = usuarios.find(u => u.username === username);

    if (!usuario) {
      return res.status(401).json({
        error: 'Usuario no encontrado',
        mensaje: 'El usuario no existe',
      });
    }

    // Verificar password
    let passwordValido = false;

    // Verificar si el password está hasheado o en texto plano
    if (
      usuario.password.startsWith('$2a$') ||
      usuario.password.startsWith('$2b$')
    ) {
      // Password hasheado - usar bcrypt
      passwordValido = await verificarPassword(password, usuario.password);
    } else {
      // Password en texto plano - comparación directa (INSEGURO)
      passwordValido = password === usuario.password;

      // Advertir sobre password inseguro
      console.warn('⚠️  Password en texto plano detectado para:', username);
    }

    if (!passwordValido) {
      return res.status(401).json({
        error: 'Credenciales inválidas',
        mensaje: 'Password incorrecto',
      });
    }

    // Verificar si necesita actualizar el hash (rehashing)
    if (
      !usuario.password.startsWith('$2a$') &&
      !usuario.password.startsWith('$2b$')
    ) {
      console.log('🔄 Usuario necesita migración de password:', username);
      req.necesitaMigracion = true;
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    console.error('❌ Error en autenticación:', error.message);
    res.status(500).json({
      error: 'Error de servidor',
      mensaje: 'Error interno durante la autenticación',
    });
  }
};

// 3. RUTAS DE AUTENTICACIÓN

/**
 * Ruta de login con bcrypt
 */
app.post('/login', autenticarConBcrypt, async (req, res) => {
  try {
    // Si el usuario necesita migración de password, hacerlo automáticamente
    if (req.necesitaMigracion) {
      const nuevoHash = await hashearPassword(req.body.password);
      req.usuario.password = nuevoHash;
      req.usuario.passwordChanged = new Date();

      console.log(
        '✅ Password migrado automáticamente para:',
        req.usuario.username
      );
    }

    res.json({
      mensaje: 'Login exitoso',
      usuario: {
        id: req.usuario.id,
        username: req.usuario.username,
        rol: req.usuario.rol,
        email: req.usuario.email,
      },
      security: {
        passwordHasheado:
          req.usuario.password.startsWith('$2a$') ||
          req.usuario.password.startsWith('$2b$'),
        ultimoCambio: req.usuario.passwordChanged,
      },
    });
  } catch (error) {
    console.error('❌ Error en login:', error.message);
    res.status(500).json({
      error: 'Error de servidor',
      mensaje: 'Error interno',
    });
  }
});

/**
 * Ruta para registrar nuevo usuario
 */
app.post('/register', async (req, res) => {
  const { username, password, email, rol = 'user' } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({
      error: 'Datos requeridos',
      mensaje: 'Proporciona username, password y email',
    });
  }

  try {
    // Verificar si el usuario ya existe
    const usuarioExistente = usuarios.find(u => u.username === username);

    if (usuarioExistente) {
      return res.status(400).json({
        error: 'Usuario ya existe',
        mensaje: 'El nombre de usuario ya está en uso',
      });
    }

    // Verificar fuerza del password
    const fuerzaPassword = verificarFuerzaPassword(password);

    if (fuerzaPassword.puntuacion < 3) {
      return res.status(400).json({
        error: 'Password muy débil',
        mensaje: 'El password no cumple con los requisitos mínimos',
        fuerza: fuerzaPassword,
      });
    }

    // Hashear password
    const passwordHasheado = await hashearPassword(password);

    // Crear nuevo usuario
    const nuevoUsuario = {
      id: usuarios.length + 1,
      username,
      password: passwordHasheado,
      email,
      rol,
      passwordChanged: new Date(),
    };

    usuarios.push(nuevoUsuario);

    // Guardar en historial de passwords
    historialPasswords.push({
      userId: nuevoUsuario.id,
      passwordHash: passwordHasheado,
      createdAt: new Date(),
    });

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      usuario: {
        id: nuevoUsuario.id,
        username: nuevoUsuario.username,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol,
      },
      security: {
        fuerzaPassword: fuerzaPassword.nivel,
        saltRounds: SALT_ROUNDS,
      },
    });
  } catch (error) {
    console.error('❌ Error en registro:', error.message);
    res.status(500).json({
      error: 'Error de servidor',
      mensaje: 'Error interno durante el registro',
    });
  }
});

/**
 * Ruta para cambiar password
 */
app.post('/cambiar-password', autenticarConBcrypt, async (req, res) => {
  const { passwordActual, passwordNuevo } = req.body;

  if (!passwordActual || !passwordNuevo) {
    return res.status(400).json({
      error: 'Passwords requeridos',
      mensaje: 'Proporciona passwordActual y passwordNuevo',
    });
  }

  try {
    // Verificar que el password actual es correcto (ya verificado en middleware)

    // Verificar que el nuevo password es diferente
    if (passwordActual === passwordNuevo) {
      return res.status(400).json({
        error: 'Password idéntico',
        mensaje: 'El nuevo password debe ser diferente al actual',
      });
    }

    // Verificar fuerza del nuevo password
    const fuerzaPassword = verificarFuerzaPassword(passwordNuevo);

    if (fuerzaPassword.puntuacion < 3) {
      return res.status(400).json({
        error: 'Password muy débil',
        mensaje: 'El nuevo password no cumple con los requisitos mínimos',
        fuerza: fuerzaPassword,
      });
    }

    // Verificar que no sea uno de los últimos 3 passwords
    const historialUsuario = historialPasswords
      .filter(h => h.userId === req.usuario.id)
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 3);

    for (const historial of historialUsuario) {
      const esReutilizado = await verificarPassword(
        passwordNuevo,
        historial.passwordHash
      );
      if (esReutilizado) {
        return res.status(400).json({
          error: 'Password reutilizado',
          mensaje: 'No puedes usar uno de tus últimos 3 passwords',
        });
      }
    }

    // Hashear nuevo password
    const nuevoHash = await hashearPassword(passwordNuevo);

    // Actualizar usuario
    req.usuario.password = nuevoHash;
    req.usuario.passwordChanged = new Date();

    // Agregar al historial
    historialPasswords.push({
      userId: req.usuario.id,
      passwordHash: nuevoHash,
      createdAt: new Date(),
    });

    res.json({
      mensaje: 'Password cambiado exitosamente',
      usuario: req.usuario.username,
      security: {
        fuerzaPassword: fuerzaPassword.nivel,
        fechaCambio: req.usuario.passwordChanged,
      },
    });
  } catch (error) {
    console.error('❌ Error cambiando password:', error.message);
    res.status(500).json({
      error: 'Error de servidor',
      mensaje: 'Error interno al cambiar password',
    });
  }
});

// 4. RUTAS UTILITARIAS

/**
 * Ruta para verificar fuerza de password
 */
app.post('/verificar-fuerza', (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({
      error: 'Password requerido',
      mensaje: 'Proporciona el password a verificar',
    });
  }

  const fuerza = verificarFuerzaPassword(password);

  res.json({
    mensaje: 'Análisis de fuerza de password',
    password: password.replace(/./g, '*'), // Ocultar password
    fuerza,
  });
});

/**
 * Ruta para generar hash de password
 */
app.post('/generar-hash', async (req, res) => {
  const { password, saltRounds = SALT_ROUNDS } = req.body;

  if (!password) {
    return res.status(400).json({
      error: 'Password requerido',
      mensaje: 'Proporciona el password a hashear',
    });
  }

  try {
    const hash = await bcrypt.hash(password, saltRounds);

    res.json({
      mensaje: 'Hash generado exitosamente',
      hash,
      saltRounds,
      longitud: hash.length,
    });
  } catch (error) {
    console.error('❌ Error generando hash:', error.message);
    res.status(500).json({
      error: 'Error de servidor',
      mensaje: 'Error al generar hash',
    });
  }
});

/**
 * Ruta para comparar password con hash
 */
app.post('/comparar-hash', async (req, res) => {
  const { password, hash } = req.body;

  if (!password || !hash) {
    return res.status(400).json({
      error: 'Datos requeridos',
      mensaje: 'Proporciona password y hash',
    });
  }

  try {
    const coincide = await bcrypt.compare(password, hash);

    res.json({
      mensaje: 'Comparación completada',
      coincide,
      hash,
      password: password.replace(/./g, '*'),
    });
  } catch (error) {
    console.error('❌ Error comparando hash:', error.message);
    res.status(500).json({
      error: 'Error de servidor',
      mensaje: 'Error al comparar hash',
    });
  }
});

// 5. BENCHMARKING Y TESTING

/**
 * Ruta para benchmarking de salt rounds
 */
app.post('/benchmark', async (req, res) => {
  const { password = 'test123456', maxRounds = 15 } = req.body;

  const resultados = [];

  try {
    for (let rounds = 8; rounds <= maxRounds; rounds++) {
      const inicio = Date.now();
      const hash = await bcrypt.hash(password, rounds);
      const tiempo = Date.now() - inicio;

      resultados.push({
        saltRounds: rounds,
        tiempo: `${tiempo}ms`,
        hash: hash.substring(0, 20) + '...',
      });
    }

    res.json({
      mensaje: 'Benchmark completado',
      resultados,
      recomendacion: 'Usa salt rounds que tomen entre 250-500ms',
    });
  } catch (error) {
    console.error('❌ Error en benchmark:', error.message);
    res.status(500).json({
      error: 'Error de servidor',
      mensaje: 'Error durante el benchmark',
    });
  }
});

// 6. TESTING Y DEMOSTRACIÓN
const PORT = 3003;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🔐 Servidor bcrypt ejecutándose en puerto ${PORT}`);
    console.log('\n📋 Pruebas sugeridas:');
    console.log('1. Registrar usuario: POST http://localhost:3003/register');
    console.log(
      '   Body: { "username": "nuevo", "password": "MiPassword123!", "email": "test@ejemplo.com" }'
    );
    console.log('2. Login: POST http://localhost:3003/login');
    console.log('   Body: { "username": "admin", "password": "123456" }');
    console.log(
      '3. Verificar fuerza: POST http://localhost:3003/verificar-fuerza'
    );
    console.log('   Body: { "password": "MiPassword123!" }');
    console.log(
      '4. Cambiar password: POST http://localhost:3003/cambiar-password'
    );
    console.log(
      '   Body: { "username": "admin", "password": "123456", "passwordActual": "123456", "passwordNuevo": "NuevoPassword123!" }'
    );
    console.log('5. Benchmark: POST http://localhost:3003/benchmark');
    console.log('\n🎯 Conceptos clave:');
    console.log('- Salt Rounds: Mayor número = más seguro pero más lento');
    console.log('- Hashing: Irreversible, ideal para passwords');
    console.log('- Verificación: Comparar hash, no descifrar');
    console.log('- Migración: Actualizar hashes antiguos');
  });
}

module.exports = {
  app,
  hashearPassword,
  verificarPassword,
  verificarFuerzaPassword,
  autenticarConBcrypt,
};

// 🎪 Mini Reto: Implementa una función que determine si un hash necesita ser actualizado
const necesitaRehash = (hash, saltRoundsDeseados = SALT_ROUNDS) => {
  try {
    // Extraer salt rounds del hash
    const saltRoundsActuales = parseInt(hash.split('$')[2]);

    return {
      necesitaActualizacion: saltRoundsActuales < saltRoundsDeseados,
      saltRoundsActuales,
      saltRoundsDeseados,
      razon:
        saltRoundsActuales < saltRoundsDeseados
          ? 'Hash tiene menos salt rounds que el estándar actual'
          : 'Hash está actualizado',
    };
  } catch (error) {
    return {
      necesitaActualizacion: true,
      razon: 'Hash no válido o formato no reconocido',
    };
  }
};

// Ejemplo de uso
app.post('/verificar-hash', (req, res) => {
  const { hash } = req.body;

  if (!hash) {
    return res.status(400).json({
      error: 'Hash requerido',
    });
  }

  const resultado = necesitaRehash(hash);

  res.json({
    mensaje: 'Verificación de hash',
    hash: hash.substring(0, 20) + '...',
    resultado,
  });
});
