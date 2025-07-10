/**
 * 🔐 API Segura - Servidor Principal
 *
 * Punto de entrada principal para la aplicación API segura.
 * Configura el servidor Express con todas las medidas de seguridad.
 */

const dotenv = require('dotenv');
const app = require('./src/app');
const logger = require('./src/utils/logger');

// Cargar variables de entorno
dotenv.config();

// Configuración del servidor
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Inicializar servidor
const server = app.listen(PORT, () => {
  logger.info(`🚀 Servidor ejecutándose en puerto ${PORT}`);
  logger.info(`🌍 Ambiente: ${NODE_ENV}`);
  logger.info(`🔐 API Segura v1.0.0`);

  if (NODE_ENV === 'development') {
    console.log('\n📋 Endpoints disponibles:');
    console.log('🔓 POST /api/auth/register - Registro de usuario');
    console.log('🔓 POST /api/auth/login - Login');
    console.log('🔓 POST /api/auth/refresh - Renovar token');
    console.log('🔓 POST /api/auth/logout - Logout');
    console.log('🔒 GET /api/users - Listar usuarios (admin)');
    console.log('🔒 GET /api/users/:id - Obtener usuario');
    console.log('🔒 PUT /api/users/:id - Actualizar usuario');
    console.log('🔒 DELETE /api/users/:id - Eliminar usuario (admin)');
    console.log('🔓 GET /api/products - Listar productos');
    console.log('🔒 POST /api/products - Crear producto (admin)');
    console.log('🔓 GET /api/products/:id - Obtener producto');
    console.log('🔒 PUT /api/products/:id - Actualizar producto (admin)');
    console.log('🔒 DELETE /api/products/:id - Eliminar producto (admin)');
    console.log('🔒 GET /api/admin/stats - Estadísticas de seguridad');
    console.log('🔒 GET /api/admin/logs - Logs de seguridad');
    console.log('\n💡 Leyenda: 🔓 = Público, 🔒 = Requiere autenticación');
    console.log('\n🧪 Testing:');
    console.log('- Ejecuta: pnpm test');
    console.log('- Postman: Importar collection desde docs/');
    console.log('- Logs: Revisa logs/ directory');
  }
});

// Manejo de errores no capturados
process.on('uncaughtException', error => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  server.close(() => {
    process.exit(1);
  });
});

// Manejo de cierre graceful
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, cerrando servidor...');
  server.close(() => {
    logger.info('Servidor cerrado');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, cerrando servidor...');
  server.close(() => {
    logger.info('Servidor cerrado');
    process.exit(0);
  });
});

module.exports = server;
