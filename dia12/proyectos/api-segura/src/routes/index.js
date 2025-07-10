// routes/index.js
// Archivo principal de rutas que centraliza todas las rutas de la API

const express = require('express');
const router = express.Router();

// Importar rutas
const authRoutes = require('./auth');
const productRoutes = require('./products');

/**
 * Rutas principales de la API
 * - Autenticación
 * - Productos
 * - Health check
 * - Información de API
 */

/**
 * @route   GET /api/
 * @desc    Información básica de la API
 * @access  Public
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API Segura - WorldSkills 2025',
    version: '1.0.0',
    documentation: '/api/docs',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      health: '/api/health',
    },
    timestamp: new Date().toISOString(),
  });
});

/**
 * @route   GET /api/health
 * @desc    Health check de la API
 * @access  Public
 */
router.get('/health', async (req, res) => {
  try {
    const database = require('../config/database');

    // Verificar conexión a la base de datos
    const dbTest = await database.get('SELECT 1 as test');

    res.json({
      success: true,
      message: 'API funcionando correctamente',
      status: 'healthy',
      database: dbTest ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      environment: process.env.NODE_ENV || 'development',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error en health check',
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * @route   GET /api/docs
 * @desc    Documentación básica de la API
 * @access  Public
 */
router.get('/docs', (req, res) => {
  res.json({
    success: true,
    message: 'Documentación de API Segura',
    version: '1.0.0',
    endpoints: {
      auth: {
        'POST /api/auth/register': 'Registrar nuevo usuario',
        'POST /api/auth/login': 'Iniciar sesión',
        'POST /api/auth/logout': 'Cerrar sesión',
        'POST /api/auth/refresh': 'Renovar token de acceso',
        'GET /api/auth/profile': 'Obtener perfil del usuario',
        'PUT /api/auth/change-password': 'Cambiar contraseña',
        'GET /api/auth/verify': 'Verificar token',
        'POST /api/auth/forgot-password': 'Solicitar recuperación',
        'POST /api/auth/reset-password': 'Restablecer contraseña',
      },
      products: {
        'GET /api/products': 'Obtener todos los productos',
        'GET /api/products/:id': 'Obtener producto por ID',
        'POST /api/products': 'Crear nuevo producto',
        'PUT /api/products/:id': 'Actualizar producto',
        'DELETE /api/products/:id': 'Eliminar producto',
        'GET /api/products/category/:category': 'Productos por categoría',
        'GET /api/products/user/:userId': 'Productos de un usuario',
        'GET /api/products/search/:term': 'Buscar productos',
        'PATCH /api/products/:id/stock': 'Actualizar stock',
        'GET /api/products/stats': 'Estadísticas (Admin)',
      },
    },
    security: {
      authentication: 'Bearer Token (JWT)',
      rateLimit: 'Limitación de solicitudes por IP',
      validation: 'Validación de entrada en todos los endpoints',
      encryption: 'Contraseñas hasheadas con bcrypt',
      headers: 'Headers de seguridad configurados',
    },
  });
});

/**
 * @route   GET /api/status
 * @desc    Estado detallado del sistema
 * @access  Public
 */
router.get('/status', async (req, res) => {
  try {
    const database = require('../config/database');

    // Obtener estadísticas básicas
    const [userCount, productCount, categoryCount] = await Promise.all([
      database.get('SELECT COUNT(*) as total FROM users'),
      database.get('SELECT COUNT(*) as total FROM products'),
      database.get('SELECT COUNT(DISTINCT category) as total FROM products'),
    ]);

    res.json({
      success: true,
      message: 'Estado del sistema',
      statistics: {
        users: userCount.total,
        products: productCount.total,
        categories: categoryCount.total,
      },
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener estado del sistema',
      error: error.message,
    });
  }
});

// Configurar rutas
router.use('/auth', authRoutes);
router.use('/products', productRoutes);

/**
 * Middleware para rutas no encontradas
 */
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada',
    message: `La ruta ${req.originalUrl} no existe`,
    availableEndpoints: [
      '/api/',
      '/api/health',
      '/api/docs',
      '/api/status',
      '/api/auth/*',
      '/api/products/*',
    ],
  });
});

module.exports = router;
