// 🌐 Servidor Principal - API Productos
// Día 11: APIs REST y Database Integration

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

// Inicializar Express
const app = express();

// Configurar puerto
const PORT = process.env.PORT || 3000;

// Middlewares de seguridad
app.use(helmet());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS || 'http://localhost:3000',
    credentials: true,
  })
);

// Rate limiting - 100 requests por 15 minutos
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por ventana
  message: {
    error: 'Demasiadas peticiones desde esta IP',
    retry_after: '15 minutos',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Middlewares de parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use(morgan('combined'));

// Documentación Swagger
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'API Productos - Documentación',
  })
);

// Endpoint para obtener spec JSON
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Rutas principales
app.use('/api/categorias', require('./routes/categorias'));
app.use('/api/productos', require('./routes/productos'));

// Ruta raíz - redirect a documentación
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// Ruta de health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
  });
});

// Middleware para rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    message: `La ruta ${req.method} ${req.path} no existe`,
    available_endpoints: [
      'GET /api-docs - Documentación',
      'GET /api/productos - Listar productos',
      'GET /api/categorias - Listar categorías',
      'GET /health - Estado del servidor',
    ],
  });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error('Error en servidor:', err);

  // Error de validación
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Error de validación',
      message: err.message,
      details: err.details,
    });
  }

  // Error de base de datos
  if (err.code === 'SQLITE_ERROR') {
    return res.status(500).json({
      error: 'Error de base de datos',
      message: 'Error interno del servidor',
    });
  }

  // Error genérico
  res.status(500).json({
    error: 'Error interno del servidor',
    message:
      process.env.NODE_ENV === 'development'
        ? err.message
        : 'Ha ocurrido un error inesperado',
  });
});

// Inicializar servidor
const server = app.listen(PORT, () => {
  console.log(`
    🚀 Servidor API Productos iniciado exitosamente
    
    📡 Puerto: ${PORT}
    🌐 URL: http://localhost:${PORT}
    📚 Documentación: http://localhost:${PORT}/api-docs
    🔍 Health Check: http://localhost:${PORT}/health
    
    📋 Endpoints disponibles:
    • GET    /api/productos
    • POST   /api/productos
    • GET    /api/productos/:id
    • PUT    /api/productos/:id
    • DELETE /api/productos/:id
    
    • GET    /api/categorias
    • POST   /api/categorias
    • GET    /api/categorias/:id
    • PUT    /api/categorias/:id
    • DELETE /api/categorias/:id
    
    🎯 Presiona Ctrl+C para detener el servidor
    `);
});

// Manejo de cierre graceful
process.on('SIGINT', () => {
  console.log('\n🔄 Cerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor cerrado correctamente');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n🔄 Cerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor cerrado correctamente');
    process.exit(0);
  });
});

// Exportar para testing
module.exports = app;
