/**
 * 🔐 Ejercicio 01: Authentication vs Authorization
 *
 * Conceptos fundamentales:
 * - Authentication: ¿Quién eres? (Identificación)
 * - Authorization: ¿Qué puedes hacer? (Permisos)
 *
 * Objetivos:
 * - Implementar middleware de autenticación básica
 * - Distinguir entre autenticación y autorización
 * - Crear sistema de roles simple
 */

const express = require('express');
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Base de datos simulada de usuarios
const usuarios = [
  { id: 1, username: 'admin', password: '123456', rol: 'admin' },
  { id: 2, username: 'user', password: '123456', rol: 'user' },
  { id: 3, username: 'guest', password: '123456', rol: 'guest' },
];

// Sesiones activas simuladas
let sessionesActivas = [];

// 1. AUTHENTICATION - Middleware de autenticación
const authenticate = (req, res, next) => {
  const { username, password } = req.headers;

  // Verificar que las credenciales estén presentes
  if (!username || !password) {
    return res.status(401).json({
      error: 'Credenciales requeridas',
      mensaje: 'Proporciona username y password en los headers',
    });
  }

  // Buscar usuario en la "base de datos"
  const usuario = usuarios.find(u => u.username === username);

  if (!usuario) {
    return res.status(401).json({
      error: 'Usuario no encontrado',
      mensaje: 'El usuario no existe en el sistema',
    });
  }

  // Verificar password (en producción usarías bcrypt)
  if (usuario.password !== password) {
    return res.status(401).json({
      error: 'Credenciales inválidas',
      mensaje: 'Password incorrecto',
    });
  }

  // Crear sesión
  const sessionId = Date.now().toString();
  sessionesActivas.push({
    sessionId,
    userId: usuario.id,
    username: usuario.username,
    rol: usuario.rol,
    timestamp: new Date(),
  });

  // Agregar usuario autenticado al request
  req.usuario = usuario;
  req.sessionId = sessionId;

  console.log(`✅ Usuario autenticado: ${usuario.username} (${usuario.rol})`);
  next();
};

// 2. AUTHORIZATION - Middleware de autorización por roles
const authorize = rolesPermitidos => {
  return (req, res, next) => {
    // Verificar que el usuario esté autenticado
    if (!req.usuario) {
      return res.status(401).json({
        error: 'No autenticado',
        mensaje: 'Debes estar autenticado para acceder a este recurso',
      });
    }

    // Verificar que el usuario tenga el rol necesario
    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({
        error: 'Acceso denegado',
        mensaje: `Se requiere rol: ${rolesPermitidos.join(' o ')}. Tu rol: ${
          req.usuario.rol
        }`,
      });
    }

    console.log(
      `✅ Usuario autorizado: ${req.usuario.username} para rol ${req.usuario.rol}`
    );
    next();
  };
};

// 3. RUTAS PROTEGIDAS

// Ruta pública - NO requiere autenticación
app.get('/publico', (req, res) => {
  res.json({
    mensaje: 'Contenido público',
    timestamp: new Date(),
    nota: 'Esta ruta es accesible sin autenticación',
  });
});

// Ruta protegida - Solo requiere AUTENTICACIÓN
app.get('/protegido', authenticate, (req, res) => {
  res.json({
    mensaje: 'Contenido protegido',
    usuario: req.usuario.username,
    rol: req.usuario.rol,
    nota: 'Esta ruta requiere autenticación pero cualquier rol puede acceder',
  });
});

// Ruta admin - Requiere AUTENTICACIÓN + AUTORIZACIÓN (rol admin)
app.get('/admin', authenticate, authorize(['admin']), (req, res) => {
  res.json({
    mensaje: 'Panel de administración',
    usuario: req.usuario.username,
    usuarios: usuarios.map(u => ({
      id: u.id,
      username: u.username,
      rol: u.rol,
    })),
    nota: 'Solo administradores pueden acceder aquí',
  });
});

// Ruta user - Requiere AUTENTICACIÓN + AUTORIZACIÓN (rol user o admin)
app.get('/user', authenticate, authorize(['user', 'admin']), (req, res) => {
  res.json({
    mensaje: 'Dashboard de usuario',
    usuario: req.usuario.username,
    perfil: {
      id: req.usuario.id,
      username: req.usuario.username,
      rol: req.usuario.rol,
    },
    nota: 'Usuarios y administradores pueden acceder aquí',
  });
});

// Ruta para cerrar sesión
app.post('/logout', authenticate, (req, res) => {
  // Eliminar sesión activa
  sessionesActivas = sessionesActivas.filter(
    s => s.sessionId !== req.sessionId
  );

  res.json({
    mensaje: 'Sesión cerrada exitosamente',
    usuario: req.usuario.username,
  });
});

// Ruta para ver sesiones activas (solo admin)
app.get('/sesiones', authenticate, authorize(['admin']), (req, res) => {
  res.json({
    mensaje: 'Sesiones activas',
    sesiones: sessionesActivas,
    total: sessionesActivas.length,
  });
});

// 4. MIDDLEWARE DE MANEJO DE ERRORES
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({
    error: 'Error interno del servidor',
    mensaje: 'Algo salió mal en el servidor',
  });
});

// 5. TESTING Y DEMOSTRACIÓN
const PORT = 3001;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🔐 Servidor de demostración ejecutándose en puerto ${PORT}`);
    console.log('\n📋 Pruebas sugeridas:');
    console.log('1. Ruta pública: GET http://localhost:3001/publico');
    console.log(
      '2. Ruta protegida con admin: GET http://localhost:3001/protegido'
    );
    console.log('   Headers: username: admin, password: 123456');
    console.log('3. Ruta admin: GET http://localhost:3001/admin');
    console.log('   Headers: username: admin, password: 123456');
    console.log('4. Ruta user con usuario: GET http://localhost:3001/user');
    console.log('   Headers: username: user, password: 123456');
    console.log(
      '5. Intentar acceso no autorizado: GET http://localhost:3001/admin'
    );
    console.log('   Headers: username: user, password: 123456');
    console.log('\n🎯 Conceptos clave:');
    console.log('- Authentication: Verificar identidad (username/password)');
    console.log('- Authorization: Verificar permisos (roles)');
    console.log('- 401 Unauthorized: Credenciales inválidas o faltantes');
    console.log('- 403 Forbidden: Usuario válido pero sin permisos');
  });
}

module.exports = { app, authenticate, authorize };

// 🎪 Mini Reto: Implementa un middleware que combine ambos conceptos
// Crea una función que verifique tanto autenticación como autorización en un solo paso
const authenticateAndAuthorize = rolesPermitidos => {
  return (req, res, next) => {
    // Tu código aquí
    // Pista: Puedes combinar la lógica de authenticate y authorize

    // Primer paso: Autenticación
    const { username, password } = req.headers;

    if (!username || !password) {
      return res.status(401).json({
        error: 'Credenciales requeridas',
      });
    }

    const usuario = usuarios.find(u => u.username === username);

    if (!usuario || usuario.password !== password) {
      return res.status(401).json({
        error: 'Credenciales inválidas',
      });
    }

    // Segundo paso: Autorización
    if (!rolesPermitidos.includes(usuario.rol)) {
      return res.status(403).json({
        error: 'Acceso denegado',
        mensaje: `Se requiere rol: ${rolesPermitidos.join(' o ')}`,
      });
    }

    req.usuario = usuario;
    next();
  };
};

// Ejemplo de uso del middleware combinado
app.get('/vip', authenticateAndAuthorize(['admin']), (req, res) => {
  res.json({
    mensaje: 'Área VIP',
    usuario: req.usuario.username,
    nota: 'Autenticación y autorización verificadas en un solo paso',
  });
});
