// middleware/rateLimit.js
// Middleware de rate limiting avanzado

const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const { logSecurityEvent } = require('../utils/logger');

/**
 * Middleware de rate limiting
 * - Rate limiting por IP
 * - Rate limiting por usuario
 * - Rate limiting por rol
 * - Slow down para requests intensivos
 */

/**
 * Rate limiting básico por IP
 * @param {Object} options - Opciones de configuración
 * @returns {Function} - Middleware function
 */
const basicRateLimit = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutos
    max = 100, // 100 requests por ventana
    message = 'Demasiadas solicitudes desde esta IP',
    skipSuccessfulRequests = false,
    skipFailedRequests = false,
  } = options;

  return rateLimit({
    windowMs,
    max,
    message: {
      error: 'Rate limit excedido',
      message: message,
      retryAfter: Math.ceil(windowMs / 1000),
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests,
    skipFailedRequests,
    handler: (req, res) => {
      logSecurityEvent('RATE_LIMIT_EXCEEDED', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        endpoint: req.originalUrl,
        method: req.method,
      });

      res.status(429).json({
        error: 'Rate limit excedido',
        message: message,
        retryAfter: Math.ceil(req.rateLimit.resetTime / 1000),
      });
    },
  });
};

/**
 * Rate limiting por usuario autenticado
 * @param {Object} options - Opciones de configuración
 * @returns {Function} - Middleware function
 */
const userRateLimit = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutos
    max = 200, // 200 requests por ventana por usuario
    message = 'Demasiadas solicitudes para este usuario',
  } = options;

  return rateLimit({
    windowMs,
    max,
    keyGenerator: req => {
      // Usar ID de usuario si está autenticado, sino usar IP
      return req.user ? `user:${req.user.id}` : req.ip;
    },
    message: {
      error: 'Rate limit de usuario excedido',
      message: message,
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      logSecurityEvent('USER_RATE_LIMIT_EXCEEDED', {
        userId: req.user?.id,
        username: req.user?.username,
        ip: req.ip,
        endpoint: req.originalUrl,
        method: req.method,
      });

      res.status(429).json({
        error: 'Rate limit de usuario excedido',
        message: message,
        retryAfter: Math.ceil(req.rateLimit.resetTime / 1000),
      });
    },
  });
};

/**
 * Rate limiting diferenciado por rol
 * @param {Object} roleOptions - Opciones por rol
 * @returns {Function} - Middleware function
 */
const rateLimitByRole = (roleOptions = {}) => {
  const defaultOptions = {
    windowMs: 15 * 60 * 1000,
    max: 100,
  };

  const options = {
    user: { ...defaultOptions, max: 50, ...roleOptions.user },
    admin: { ...defaultOptions, max: 500, ...roleOptions.admin },
    guest: { ...defaultOptions, max: 20, ...roleOptions.guest },
  };

  return rateLimit({
    windowMs: options.user.windowMs,
    max: req => {
      const userRole = req.user?.role || 'guest';
      return options[userRole]?.max || options.guest.max;
    },
    keyGenerator: req => {
      const userRole = req.user?.role || 'guest';
      const userId = req.user?.id || 'anonymous';
      return `${userRole}:${userId}:${req.ip}`;
    },
    message: {
      error: 'Rate limit por rol excedido',
      message: 'Has excedido el límite de solicitudes para tu rol',
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      logSecurityEvent('ROLE_RATE_LIMIT_EXCEEDED', {
        userId: req.user?.id,
        username: req.user?.username,
        role: req.user?.role || 'guest',
        ip: req.ip,
        endpoint: req.originalUrl,
        method: req.method,
      });

      res.status(429).json({
        error: 'Rate limit por rol excedido',
        message: 'Has excedido el límite de solicitudes para tu rol',
        retryAfter: Math.ceil(req.rateLimit.resetTime / 1000),
      });
    },
  });
};

/**
 * Rate limiting estricto para endpoints sensibles
 * @param {Object} options - Opciones de configuración
 * @returns {Function} - Middleware function
 */
const strictRateLimit = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutos
    max = 5, // Solo 5 intentos por ventana
    message = 'Demasiados intentos en endpoint sensible',
  } = options;

  return rateLimit({
    windowMs,
    max,
    skipSuccessfulRequests: true, // No contar requests exitosos
    message: {
      error: 'Rate limit estricto excedido',
      message: message,
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      logSecurityEvent('STRICT_RATE_LIMIT_EXCEEDED', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        endpoint: req.originalUrl,
        method: req.method,
        severity: 'high',
      });

      res.status(429).json({
        error: 'Rate limit estricto excedido',
        message: message,
        retryAfter: Math.ceil(req.rateLimit.resetTime / 1000),
      });
    },
  });
};

/**
 * Slow down para requests intensivos
 * @param {Object} options - Opciones de configuración
 * @returns {Function} - Middleware function
 */
const slowDownRequests = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutos
    delayAfter = 50, // Aplicar delay después de 50 requests
    delayMs = 500, // Incrementar delay en 500ms por request
    maxDelayMs = 20000, // Máximo delay de 20 segundos
  } = options;

  return slowDown({
    windowMs,
    delayAfter,
    delayMs,
    maxDelayMs,
    headers: true,
    onLimitReached: req => {
      logSecurityEvent('SLOW_DOWN_ACTIVATED', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        endpoint: req.originalUrl,
      });
    },
  });
};

/**
 * Rate limiting para uploads
 * @param {Object} options - Opciones de configuración
 * @returns {Function} - Middleware function
 */
const uploadRateLimit = (options = {}) => {
  const {
    windowMs = 60 * 60 * 1000, // 1 hora
    max = 10, // 10 uploads por hora
    message = 'Límite de uploads excedido',
  } = options;

  return rateLimit({
    windowMs,
    max,
    keyGenerator: req => {
      return req.user ? `upload:${req.user.id}` : `upload:${req.ip}`;
    },
    message: {
      error: 'Rate limit de uploads excedido',
      message: message,
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      logSecurityEvent('UPLOAD_RATE_LIMIT_EXCEEDED', {
        userId: req.user?.id,
        ip: req.ip,
        endpoint: req.originalUrl,
      });

      res.status(429).json({
        error: 'Rate limit de uploads excedido',
        message: message,
        retryAfter: Math.ceil(req.rateLimit.resetTime / 1000),
      });
    },
  });
};

/**
 * Rate limiting para APIs externas
 * @param {Object} options - Opciones de configuración
 * @returns {Function} - Middleware function
 */
const apiRateLimit = (options = {}) => {
  const {
    windowMs = 60 * 1000, // 1 minuto
    max = 60, // 60 requests por minuto
    message = 'Límite de API excedido',
  } = options;

  return rateLimit({
    windowMs,
    max,
    keyGenerator: req => {
      const apiKey = req.headers['x-api-key'] || req.query.apiKey;
      return apiKey ? `api:${apiKey}` : `api:${req.ip}`;
    },
    message: {
      error: 'Rate limit de API excedido',
      message: message,
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      logSecurityEvent('API_RATE_LIMIT_EXCEEDED', {
        apiKey: req.headers['x-api-key'] || req.query.apiKey,
        ip: req.ip,
        endpoint: req.originalUrl,
      });

      res.status(429).json({
        error: 'Rate limit de API excedido',
        message: message,
        retryAfter: Math.ceil(req.rateLimit.resetTime / 1000),
      });
    },
  });
};

/**
 * Rate limiting adaptivo basado en carga del servidor
 * @param {Object} options - Opciones de configuración
 * @returns {Function} - Middleware function
 */
const adaptiveRateLimit = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000,
    baseMax = 100,
    loadThreshold = 0.8, // 80% de carga CPU
  } = options;

  return rateLimit({
    windowMs,
    max: req => {
      // En un entorno real, aquí se verificaría la carga del servidor
      const serverLoad = process.cpuUsage().system / 1000000; // Simulación
      const loadFactor = serverLoad > loadThreshold ? 0.5 : 1;
      return Math.floor(baseMax * loadFactor);
    },
    message: {
      error: 'Rate limit adaptivo excedido',
      message: 'Servidor bajo alta carga, límite reducido temporalmente',
    },
    handler: (req, res) => {
      logSecurityEvent('ADAPTIVE_RATE_LIMIT_EXCEEDED', {
        ip: req.ip,
        endpoint: req.originalUrl,
        serverLoad: process.cpuUsage(),
      });

      res.status(429).json({
        error: 'Rate limit adaptivo excedido',
        message: 'Servidor bajo alta carga, intenta más tarde',
        retryAfter: Math.ceil(req.rateLimit.resetTime / 1000),
      });
    },
  });
};

module.exports = {
  basicRateLimit,
  userRateLimit,
  rateLimitByRole,
  strictRateLimit,
  slowDownRequests,
  uploadRateLimit,
  apiRateLimit,
  adaptiveRateLimit,
};
