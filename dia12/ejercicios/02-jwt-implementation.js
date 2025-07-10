/**
 * 🔐 Ejercicio 02: JWT Implementation
 *
 * Conceptos fundamentales:
 * - JSON Web Token (JWT): Formato de token seguro
 * - Header: Algoritmo y tipo de token
 * - Payload: Claims (datos del usuario)
 * - Signature: Verificación de integridad
 *
 * Objetivos:
 * - Implementar generación de tokens JWT
 * - Verificar y decodificar tokens
 * - Manejar expiración de tokens
 * - Implementar refresh tokens
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Configuración JWT
const JWT_SECRET = process.env.JWT_SECRET || 'mi-clave-secreta-super-segura';
const JWT_EXPIRES_IN = '15m'; // 15 minutos
const REFRESH_TOKEN_EXPIRES_IN = '7d'; // 7 días

// Base de datos simulada
const usuarios = [
  {
    id: 1,
    username: 'admin',
    password: '123456',
    rol: 'admin',
    email: 'admin@ejemplo.com',
    activo: true,
  },
  {
    id: 2,
    username: 'user',
    password: '123456',
    rol: 'user',
    email: 'user@ejemplo.com',
    activo: true,
  },
];

// Tokens refresh válidos (en producción usar base de datos)
let refreshTokens = [];

// 1. GENERACIÓN DE TOKENS JWT

/**
 * Generar token de acceso JWT
 * @param {Object} usuario - Datos del usuario
 * @returns {string} Token JWT
 */
const generarTokenAcceso = usuario => {
  // Payload: datos que queremos incluir en el token
  const payload = {
    id: usuario.id,
    username: usuario.username,
    rol: usuario.rol,
    email: usuario.email,
  };

  // Opciones del token
  const opciones = {
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'worldskills-bootcamp',
    audience: 'worldskills-students',
    subject: usuario.id.toString(),
  };

  // Generar token
  const token = jwt.sign(payload, JWT_SECRET, opciones);

  console.log('✅ Token de acceso generado para:', usuario.username);
  return token;
};

/**
 * Generar refresh token
 * @param {Object} usuario - Datos del usuario
 * @returns {string} Refresh token
 */
const generarRefreshToken = usuario => {
  const payload = {
    id: usuario.id,
    username: usuario.username,
    type: 'refresh',
  };

  const opciones = {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    issuer: 'worldskills-bootcamp',
    audience: 'worldskills-students',
    subject: usuario.id.toString(),
  };

  const refreshToken = jwt.sign(payload, JWT_SECRET, opciones);

  // Guardar refresh token en la "base de datos"
  refreshTokens.push({
    token: refreshToken,
    userId: usuario.id,
    createdAt: new Date(),
  });

  console.log('✅ Refresh token generado para:', usuario.username);
  return refreshToken;
};

// 2. VERIFICACIÓN DE TOKENS JWT

/**
 * Middleware para verificar token JWT
 */
const verificarTokenJWT = (req, res, next) => {
  // Obtener token del header Authorization
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: 'Token requerido',
      mensaje: 'Proporciona el token en el header Authorization',
    });
  }

  // Verificar formato: "Bearer <token>"
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: 'Formato de token inválido',
      mensaje: 'Usa el formato: Bearer <token>',
    });
  }

  try {
    // Verificar y decodificar token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Verificar que el usuario todavía existe y está activo
    const usuario = usuarios.find(u => u.id === decoded.id && u.activo);

    if (!usuario) {
      return res.status(401).json({
        error: 'Usuario no válido',
        mensaje: 'El usuario del token no existe o está inactivo',
      });
    }

    // Agregar información del usuario al request
    req.usuario = usuario;
    req.tokenPayload = decoded;

    console.log(`✅ Token verificado para: ${usuario.username}`);
    next();
  } catch (error) {
    console.error('❌ Error verificando token:', error.message);

    // Manejar diferentes tipos de errores JWT
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expirado',
        mensaje: 'El token ha expirado, solicita uno nuevo',
        expiredAt: error.expiredAt,
      });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Token inválido',
        mensaje: 'El token proporcionado no es válido',
      });
    } else if (error.name === 'NotBeforeError') {
      return res.status(401).json({
        error: 'Token no válido aún',
        mensaje: 'El token no es válido todavía',
      });
    }

    return res.status(401).json({
      error: 'Error de verificación',
      mensaje: 'Error al verificar el token',
    });
  }
};

// 3. RUTAS DE AUTENTICACIÓN

/**
 * Ruta de login - Generar tokens JWT
 */
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Validar entrada
  if (!username || !password) {
    return res.status(400).json({
      error: 'Credenciales requeridas',
      mensaje: 'Proporciona username y password',
    });
  }

  // Buscar usuario
  const usuario = usuarios.find(u => u.username === username);

  if (!usuario) {
    return res.status(401).json({
      error: 'Usuario no encontrado',
      mensaje: 'El usuario no existe',
    });
  }

  // Verificar password (en producción usar bcrypt)
  if (usuario.password !== password) {
    return res.status(401).json({
      error: 'Credenciales inválidas',
      mensaje: 'Password incorrecto',
    });
  }

  // Verificar que el usuario esté activo
  if (!usuario.activo) {
    return res.status(401).json({
      error: 'Usuario inactivo',
      mensaje: 'La cuenta está desactivada',
    });
  }

  // Generar tokens
  const tokenAcceso = generarTokenAcceso(usuario);
  const refreshToken = generarRefreshToken(usuario);

  res.json({
    mensaje: 'Login exitoso',
    usuario: {
      id: usuario.id,
      username: usuario.username,
      rol: usuario.rol,
      email: usuario.email,
    },
    tokens: {
      access_token: tokenAcceso,
      refresh_token: refreshToken,
      token_type: 'Bearer',
      expires_in: JWT_EXPIRES_IN,
    },
  });
});

/**
 * Ruta para renovar token usando refresh token
 */
app.post('/refresh', (req, res) => {
  const { refresh_token } = req.body;

  if (!refresh_token) {
    return res.status(400).json({
      error: 'Refresh token requerido',
      mensaje: 'Proporciona el refresh token',
    });
  }

  // Verificar que el refresh token esté en nuestra lista
  const tokenInfo = refreshTokens.find(rt => rt.token === refresh_token);

  if (!tokenInfo) {
    return res.status(401).json({
      error: 'Refresh token inválido',
      mensaje: 'El refresh token no es válido',
    });
  }

  try {
    // Verificar refresh token
    const decoded = jwt.verify(refresh_token, JWT_SECRET);

    // Verificar que es un refresh token
    if (decoded.type !== 'refresh') {
      return res.status(401).json({
        error: 'Tipo de token inválido',
        mensaje: 'Este no es un refresh token',
      });
    }

    // Buscar usuario
    const usuario = usuarios.find(u => u.id === decoded.id && u.activo);

    if (!usuario) {
      return res.status(401).json({
        error: 'Usuario no válido',
        mensaje: 'El usuario no existe o está inactivo',
      });
    }

    // Generar nuevo token de acceso
    const nuevoTokenAcceso = generarTokenAcceso(usuario);

    res.json({
      mensaje: 'Token renovado exitosamente',
      tokens: {
        access_token: nuevoTokenAcceso,
        token_type: 'Bearer',
        expires_in: JWT_EXPIRES_IN,
      },
    });
  } catch (error) {
    console.error('❌ Error renovando token:', error.message);

    if (error.name === 'TokenExpiredError') {
      // Eliminar refresh token expirado
      refreshTokens = refreshTokens.filter(rt => rt.token !== refresh_token);

      return res.status(401).json({
        error: 'Refresh token expirado',
        mensaje: 'El refresh token ha expirado, inicia sesión nuevamente',
      });
    }

    return res.status(401).json({
      error: 'Error renovando token',
      mensaje: 'Error al renovar el token',
    });
  }
});

/**
 * Ruta de logout - Invalidar tokens
 */
app.post('/logout', verificarTokenJWT, (req, res) => {
  const { refresh_token } = req.body;

  // Eliminar refresh token si se proporciona
  if (refresh_token) {
    refreshTokens = refreshTokens.filter(rt => rt.token !== refresh_token);
  }

  // En una implementación real, también podrías añadir el access token
  // a una blacklist hasta que expire

  res.json({
    mensaje: 'Logout exitoso',
    usuario: req.usuario.username,
  });
});

// 4. RUTAS PROTEGIDAS

/**
 * Ruta protegida - Perfil del usuario
 */
app.get('/perfil', verificarTokenJWT, (req, res) => {
  res.json({
    mensaje: 'Perfil del usuario',
    usuario: {
      id: req.usuario.id,
      username: req.usuario.username,
      rol: req.usuario.rol,
      email: req.usuario.email,
    },
    tokenInfo: {
      issuedAt: new Date(req.tokenPayload.iat * 1000),
      expiresAt: new Date(req.tokenPayload.exp * 1000),
      issuer: req.tokenPayload.iss,
      audience: req.tokenPayload.aud,
    },
  });
});

/**
 * Ruta protegida - Dashboard
 */
app.get('/dashboard', verificarTokenJWT, (req, res) => {
  res.json({
    mensaje: 'Dashboard del usuario',
    usuario: req.usuario.username,
    rol: req.usuario.rol,
    timestamp: new Date(),
    stats: {
      totalUsuarios: usuarios.length,
      refreshTokensActivos: refreshTokens.length,
    },
  });
});

// 5. UTILIDADES PARA DEBUGGING

/**
 * Ruta para decodificar token (sin verificar)
 */
app.post('/decode', (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      error: 'Token requerido',
      mensaje: 'Proporciona el token a decodificar',
    });
  }

  try {
    // Decodificar sin verificar (solo para debugging)
    const decoded = jwt.decode(token, { complete: true });

    res.json({
      mensaje: 'Token decodificado',
      header: decoded.header,
      payload: decoded.payload,
      nota: 'Esta decodificación NO verifica la firma del token',
    });
  } catch (error) {
    res.status(400).json({
      error: 'Error decodificando token',
      mensaje: error.message,
    });
  }
});

/**
 * Ruta para ver información del servidor
 */
app.get('/info', (req, res) => {
  res.json({
    mensaje: 'Información del servidor JWT',
    configuracion: {
      jwt_expires_in: JWT_EXPIRES_IN,
      refresh_token_expires_in: REFRESH_TOKEN_EXPIRES_IN,
      issuer: 'worldskills-bootcamp',
      audience: 'worldskills-students',
    },
    estadisticas: {
      usuarios_registrados: usuarios.length,
      refresh_tokens_activos: refreshTokens.length,
    },
  });
});

// 6. TESTING Y DEMOSTRACIÓN
const PORT = 3002;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🔐 Servidor JWT ejecutándose en puerto ${PORT}`);
    console.log('\n📋 Pruebas sugeridas:');
    console.log('1. Login: POST http://localhost:3002/login');
    console.log('   Body: { "username": "admin", "password": "123456" }');
    console.log('2. Acceder a perfil: GET http://localhost:3002/perfil');
    console.log('   Header: Authorization: Bearer <token>');
    console.log('3. Renovar token: POST http://localhost:3002/refresh');
    console.log('   Body: { "refresh_token": "<refresh_token>" }');
    console.log('4. Logout: POST http://localhost:3002/logout');
    console.log('   Header: Authorization: Bearer <token>');
    console.log('5. Decodificar token: POST http://localhost:3002/decode');
    console.log('   Body: { "token": "<token>" }');
    console.log('\n🎯 Conceptos clave:');
    console.log('- JWT: Header + Payload + Signature');
    console.log('- Access Token: Corta duración (15 min)');
    console.log('- Refresh Token: Larga duración (7 días)');
    console.log('- Verificación: Integridad y validez');
  });
}

module.exports = {
  app,
  generarTokenAcceso,
  generarRefreshToken,
  verificarTokenJWT,
};

// 🎪 Mini Reto: Implementa un middleware que verifique roles usando JWT
const verificarRolJWT = rolesPermitidos => {
  return (req, res, next) => {
    // Primero verificar el token JWT
    verificarTokenJWT(req, res, err => {
      if (err) return next(err);

      // Luego verificar el rol del payload
      const rolUsuario = req.tokenPayload.rol;

      if (!rolesPermitidos.includes(rolUsuario)) {
        return res.status(403).json({
          error: 'Acceso denegado',
          mensaje: `Se requiere rol: ${rolesPermitidos.join(
            ' o '
          )}. Tu rol: ${rolUsuario}`,
        });
      }

      next();
    });
  };
};

// Ejemplo de uso
app.get('/admin-jwt', verificarRolJWT(['admin']), (req, res) => {
  res.json({
    mensaje: 'Área admin protegida con JWT',
    usuario: req.usuario.username,
    rol: req.tokenPayload.rol,
  });
});
