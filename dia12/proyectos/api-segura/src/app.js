// src/app.js
// Aplicación principal con todas las configuraciones de seguridad

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// Importar configuraciones
const database = require('./config/database');
const securityConfig = require('./config/security');
const { requestLogger, errorLogger } = require('./utils/logger');

// Importar rutas
const apiRoutes = require('./routes/index');

// Crear aplicación Express
const app = express();

/**
 * Configuración de seguridad
 */

// Headers de seguridad con Helmet
app.use(helmet(securityConfig.getHelmetConfig()));

// CORS configurado
app.use(cors(securityConfig.getCorsConfig()));

// Headers de seguridad personalizados
app.use(securityConfig.customSecurityHeaders());

// Rate limiting general
app.use(securityConfig.getGeneralRateLimit());

// Slow down para requests intensivos
app.use(securityConfig.getSlowDown());

/**
 * Middleware de aplicación
 */

// Logging de requests
app.use(requestLogger);

// Compresión de respuestas
app.use(compression());

// Morgan para logging HTTP
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// Parser de JSON con límite de tamaño
app.use(
  express.json({
    limit: '10mb',
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);

// Parser de URL encoded
app.use(
  express.urlencoded({
    extended: true,
    limit: '10mb',
  })
);

// Logging de seguridad
app.use(securityConfig.securityLogger());

/**
 * Rutas de la aplicación
 */

// Rutas de la API
app.use('/api', apiRoutes);

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🔐 API Segura - WorldSkills 2025',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    documentation: '/api/docs',
    endpoints: {
      api: '/api',
      auth: '/api/auth',
      products: '/api/products',
      health: '/api/health',
    },
    timestamp: new Date().toISOString(),
  });
});

/**
 * Manejo de errores
 */

// Error 404 - Ruta no encontrada
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada',
    message: `La ruta ${req.originalUrl} no existe`,
    suggestion: 'Revisa la documentación en /api/docs',
  });
});

// Middleware de manejo de errores
app.use(errorLogger);

// Manejo de errores general
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);

  // Error de validación de JSON
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      error: 'JSON inválido',
      message: 'El formato JSON no es válido',
    });
  }

  // Error de payload muy grande
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      success: false,
      error: 'Payload muy grande',
      message: 'El tamaño de la solicitud excede el límite permitido',
    });
  }

  // Error interno del servidor
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor',
    message:
      process.env.NODE_ENV === 'production'
        ? 'Algo salió mal en el servidor'
        : err.message,
  });
});

/**
 * Inicialización de la aplicación
 */

const initializeApp = async () => {
  try {
    // Conectar a la base de datos
    await database.connect();
    await database.initTables();

    // Crear usuario admin por defecto
    await database.createDefaultAdmin();

    console.log('✅ Aplicación inicializada correctamente');
  } catch (error) {
    console.error('❌ Error al inicializar la aplicación:', error);
    process.exit(1);
  }
};

// Inicializar solo si no es un test
if (process.env.NODE_ENV !== 'test') {
  initializeApp();
}

// Manejo de cierre graceful
process.on('SIGINT', async () => {
  console.log('\n🔄 Cerrando aplicación...');

  try {
    await database.close();
    console.log('✅ Aplicación cerrada correctamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al cerrar la aplicación:', error);
    process.exit(1);
  }
});

module.exports = app;

// Crear aplicación Express
const app = express();

// 1. CONFIGURACIÓN BÁSICA

// Trust proxy para obtener IP real (importante para rate limiting)
app.set('trust proxy', 1);

// Middleware para parsear JSON con límite de tamaño
app.use(
  express.json({
    limit: '10mb',
    verify: (req, res, buf) => {
      // Verificar que el JSON no sea malicioso
      try {
        JSON.parse(buf);
      } catch (error) {
        const err = new Error('JSON inválido');
        err.status = 400;
        throw err;
      }
    },
  })
);

// Middleware para parsear URL encoded
app.use(
  express.urlencoded({
    extended: true,
    limit: '10mb',
  })
);

// Compresión de respuestas
app.use(compression());

// 2. LOGGING Y MONITOREO

// Morgan para logging de requests HTTP
app.use(
  morgan('combined', {
    stream: {
      write: message => {
        logger.info(message.trim());
      },
    },
  })
);

// Middleware personalizado para logging de seguridad
app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString(),
    };

    // Log de seguridad para requests sospechosos
    if (res.statusCode >= 400) {
      logger.warn('Request sospechoso:', logData);
    }
  });

  next();
});

// 3. MIDDLEWARES DE SEGURIDAD

// Helmet para headers de seguridad
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
        childSrc: ["'none'"],
        workerSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        reportUri: ['/api/security/csp-report'],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  })
);

// CORS configurado de forma segura
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = (process.env.CORS_ORIGIN || '').split(',');

    // Permitir requests sin origin (aplicaciones móviles, Postman)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn(`CORS bloqueado para origen: ${origin}`);
      callback(new Error('No permitido por política CORS'));
    }
  },
  credentials: process.env.CORS_CREDENTIALS === 'true',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count', 'X-Rate-Limit-Remaining'],
  maxAge: 86400, // 24 horas
};

app.use(cors(corsOptions));

// Middleware de seguridad personalizado
app.use(securityMiddleware.detectMaliciousPatterns);
app.use(securityMiddleware.sanitizeInput);
app.use(securityMiddleware.preventXSS);

// 4. RATE LIMITING

// Rate limiting general
const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 1000, // 1000 requests por IP
  message: {
    error: 'Demasiadas solicitudes',
    mensaje: 'Has excedido el límite de requests. Intenta más tarde.',
    reintentoEn: new Date(Date.now() + 15 * 60 * 1000),
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Rate limit excedido para IP: ${req.ip}`);
    res.status(429).json({
      error: 'Rate limit excedido',
      mensaje: 'Demasiadas solicitudes desde tu IP',
      reintentoEn: new Date(Date.now() + 15 * 60 * 1000),
    });
  },
});

app.use(generalRateLimit);

// Rate limiting específico por ruta
app.use('/api/auth', rateLimitingMiddleware.authRateLimit);
app.use('/api/admin', rateLimitingMiddleware.adminRateLimit);

// 5. RUTAS PRINCIPALES

// Ruta de salud del sistema
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});

// Ruta raíz con información de la API
app.get('/', (req, res) => {
  res.json({
    mensaje: 'API Segura v1.0.0',
    descripcion:
      'API REST con autenticación JWT y medidas de seguridad completas',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      products: '/api/products',
      admin: '/api/admin',
    },
    documentacion: '/api-docs',
    salud: '/health',
    timestamp: new Date().toISOString(),
  });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);

// 6. MANEJO DE ERRORES

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
  logger.warn(
    `Ruta no encontrada: ${req.method} ${req.originalUrl} - IP: ${req.ip}`
  );

  res.status(404).json({
    error: 'Ruta no encontrada',
    mensaje: `La ruta ${req.method} ${req.originalUrl} no existe`,
    timestamp: new Date().toISOString(),
  });
});

// Middleware global de manejo de errores
app.use((err, req, res, next) => {
  // Log del error
  logger.error('Error en la aplicación:', {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  // Respuestas de error seguras (no exponer información sensible)
  let statusCode = err.status || err.statusCode || 500;
  let message = 'Error interno del servidor';

  // Errores específicos que podemos mostrar
  if (err.message === 'No permitido por política CORS') {
    statusCode = 403;
    message = 'Origen no permitido por política CORS';
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Datos de entrada inválidos';
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Token de acceso inválido';
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token JWT inválido';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token JWT expirado';
  }

  // En desarrollo, mostrar más información
  const errorResponse = {
    error: message,
    timestamp: new Date().toISOString(),
    path: req.url,
    method: req.method,
  };

  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
    errorResponse.details = err.message;
  }

  res.status(statusCode).json(errorResponse);
});

// 7. CONFIGURACIÓN DE SEGURIDAD ADICIONAL

// Remover header X-Powered-By para no exponer tecnología
app.disable('x-powered-by');

// Headers de seguridad adicionales
app.use((req, res, next) => {
  res.setHeader('X-API-Version', '1.0.0');
  res.setHeader('X-Security-Level', 'HIGH');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Cache control para contenido sensible
  if (req.path.includes('/admin') || req.path.includes('/auth')) {
    res.setHeader(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, private'
    );
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }

  next();
});

module.exports = app;
