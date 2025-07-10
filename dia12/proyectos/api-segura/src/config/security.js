// config/security.js
// Configuración de seguridad general para la API

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');

/**
 * Configuración de seguridad
 * - Headers de seguridad
 * - Rate limiting
 * - CORS
 * - Configuraciones de producción
 */

class SecurityConfig {
  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
    this.allowedOrigins = process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',')
      : ['http://localhost:3000', 'http://localhost:3001'];
  }

  /**
   * Configuración de Helmet para headers de seguridad
   * @returns {Object} - Configuración de Helmet
   */
  getHelmetConfig() {
    return {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", 'https:'],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'"],
          fontSrc: ["'self'", 'https:'],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'none'"],
        },
      },
      crossOriginEmbedderPolicy: false,
      hsts: {
        maxAge: 31536000, // 1 año
        includeSubDomains: true,
        preload: true,
      },
      noSniff: true,
      xssFilter: true,
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    };
  }

  /**
   * Configuración de CORS
   * @returns {Object} - Configuración de CORS
   */
  getCorsConfig() {
    return {
      origin: (origin, callback) => {
        // Permitir requests sin origin (mobile apps, postman, etc.)
        if (!origin) return callback(null, true);

        if (this.allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('No permitido por CORS'));
        }
      },
      credentials: true,
      optionsSuccessStatus: 200,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization',
        'X-API-Key',
      ],
    };
  }

  /**
   * Rate limiting general
   * @returns {Object} - Configuración de rate limiting
   */
  getGeneralRateLimit() {
    return rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 100, // 100 requests por IP por ventana
      message: {
        error: 'Demasiadas solicitudes, intenta de nuevo más tarde',
        retryAfter: 15 * 60, // segundos
      },
      standardHeaders: true,
      legacyHeaders: false,
      handler: (req, res) => {
        res.status(429).json({
          error: 'Demasiadas solicitudes',
          message: 'Has excedido el límite de solicitudes por minuto',
          retryAfter: Math.ceil(req.rateLimit.resetTime / 1000),
        });
      },
    });
  }

  /**
   * Rate limiting para autenticación
   * @returns {Object} - Configuración de rate limiting para auth
   */
  getAuthRateLimit() {
    return rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 5, // 5 intentos de login por IP
      message: {
        error: 'Demasiados intentos de login',
        retryAfter: 15 * 60,
      },
      standardHeaders: true,
      legacyHeaders: false,
      skipSuccessfulRequests: true, // No contar requests exitosos
      handler: (req, res) => {
        res.status(429).json({
          error: 'Demasiados intentos de login',
          message: 'Has excedido el límite de intentos de autenticación',
          retryAfter: Math.ceil(req.rateLimit.resetTime / 1000),
        });
      },
    });
  }

  /**
   * Slow down para requests intensivos
   * @returns {Object} - Configuración de slow down
   */
  getSlowDown() {
    return slowDown({
      windowMs: 15 * 60 * 1000, // 15 minutos
      delayAfter: 50, // Aplicar delay después de 50 requests
      delayMs: 500, // Incrementar delay en 500ms por request
      maxDelayMs: 20000, // Máximo delay de 20 segundos
      headers: true,
    });
  }

  /**
   * Configuración de sesiones (si se usa express-session)
   * @returns {Object} - Configuración de sesiones
   */
  getSessionConfig() {
    return {
      secret:
        process.env.SESSION_SECRET ||
        'fallback-session-secret-change-in-production',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: this.isProduction, // HTTPS en producción
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 horas
        sameSite: 'strict',
      },
      name: 'sessionId', // Cambiar nombre por defecto
    };
  }

  /**
   * Configuración de cookies seguras
   * @returns {Object} - Configuración de cookies
   */
  getCookieConfig() {
    return {
      secure: this.isProduction,
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    };
  }

  /**
   * Middleware para validar API Key
   * @returns {Function} - Middleware de validación
   */
  validateApiKey() {
    return (req, res, next) => {
      const apiKey = req.headers['x-api-key'];
      const validApiKey = process.env.API_KEY;

      if (!validApiKey) {
        return next(); // Si no hay API key configurada, continuar
      }

      if (!apiKey || apiKey !== validApiKey) {
        return res.status(401).json({
          error: 'API Key inválida',
          message: 'Se requiere una API Key válida',
        });
      }

      next();
    };
  }

  /**
   * Middleware para logging de seguridad
   * @returns {Function} - Middleware de logging
   */
  securityLogger() {
    return (req, res, next) => {
      const startTime = Date.now();

      res.on('finish', () => {
        const duration = Date.now() - startTime;
        const logData = {
          timestamp: new Date().toISOString(),
          method: req.method,
          url: req.url,
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          statusCode: res.statusCode,
          duration: `${duration}ms`,
        };

        // Log requests sospechosos
        if (
          res.statusCode === 401 ||
          res.statusCode === 403 ||
          res.statusCode === 429
        ) {
          console.warn('🚨 Actividad sospechosa:', logData);
        }

        // Log errores del servidor
        if (res.statusCode >= 500) {
          console.error('💥 Error del servidor:', logData);
        }
      });

      next();
    };
  }

  /**
   * Configuración de headers de seguridad personalizados
   * @returns {Function} - Middleware de headers
   */
  customSecurityHeaders() {
    return (req, res, next) => {
      // Remover headers que revelan información del servidor
      res.removeHeader('X-Powered-By');
      res.removeHeader('Server');

      // Headers de seguridad adicionales
      res.set({
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
        'X-API-Version': '1.0',
        'Cache-Control': 'no-store, no-cache, must-revalidate, private',
      });

      next();
    };
  }

  /**
   * Configuración completa de seguridad
   * @returns {Object} - Todas las configuraciones
   */
  getAllConfigs() {
    return {
      helmet: this.getHelmetConfig(),
      cors: this.getCorsConfig(),
      generalRateLimit: this.getGeneralRateLimit(),
      authRateLimit: this.getAuthRateLimit(),
      slowDown: this.getSlowDown(),
      session: this.getSessionConfig(),
      cookie: this.getCookieConfig(),
    };
  }
}

// Crear instancia singleton
const securityConfig = new SecurityConfig();

module.exports = securityConfig;
