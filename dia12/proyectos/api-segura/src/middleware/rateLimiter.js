const rateLimit = require('express-rate-limit');
const { logSecurityEvent } = require('../utils/logger');

// Rate limiting general para toda la API
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requests por IP por ventana
  message: {
    error:
      'Demasiadas solicitudes desde esta IP, intenta de nuevo en 15 minutos',
  },
  standardHeaders: true, // Incluir rate limit info en headers
  legacyHeaders: false, // Desactivar headers legacy
  handler: (req, res) => {
    logSecurityEvent('RATE_LIMIT_EXCEEDED', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.url,
    });

    res.status(429).json({
      error:
        'Demasiadas solicitudes desde esta IP, intenta de nuevo en 15 minutos',
    });
  },
});

// Rate limiting estricto para autenticación
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 intentos de login por IP por ventana
  message: {
    error:
      'Demasiados intentos de autenticación, intenta de nuevo en 15 minutos',
  },
  skipSuccessfulRequests: true, // No contar requests exitosos
  handler: (req, res) => {
    logSecurityEvent('AUTH_RATE_LIMIT_EXCEEDED', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      email: req.body.email,
    });

    res.status(429).json({
      error:
        'Demasiados intentos de autenticación, intenta de nuevo en 15 minutos',
    });
  },
});

// Rate limiting para registro de usuarios
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // 3 registros por IP por hora
  message: {
    error: 'Demasiados registros desde esta IP, intenta de nuevo en 1 hora',
  },
  handler: (req, res) => {
    logSecurityEvent('REGISTER_RATE_LIMIT_EXCEEDED', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      email: req.body.email,
    });

    res.status(429).json({
      error: 'Demasiados registros desde esta IP, intenta de nuevo en 1 hora',
    });
  },
});

// Rate limiting para cambio de password
const passwordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 3, // 3 intentos por IP por ventana
  message: {
    error:
      'Demasiados intentos de cambio de password, intenta de nuevo en 15 minutos',
  },
  handler: (req, res) => {
    logSecurityEvent('PASSWORD_CHANGE_RATE_LIMIT_EXCEEDED', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: req.user?.id,
    });

    res.status(429).json({
      error:
        'Demasiados intentos de cambio de password, intenta de nuevo en 15 minutos',
    });
  },
});

// Rate limiting para endpoints de API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 200, // 200 requests por IP por ventana
  message: {
    error: 'Límite de API alcanzado, intenta de nuevo en 15 minutos',
  },
  handler: (req, res) => {
    logSecurityEvent('API_RATE_LIMIT_EXCEEDED', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.url,
      method: req.method,
    });

    res.status(429).json({
      error: 'Límite de API alcanzado, intenta de nuevo en 15 minutos',
    });
  },
});

module.exports = {
  generalLimiter,
  authLimiter,
  registerLimiter,
  passwordLimiter,
  apiLimiter,
};
