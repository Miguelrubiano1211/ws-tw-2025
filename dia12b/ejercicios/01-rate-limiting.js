/**
 * Ejercicio 1: Rate Limiting Avanzado
 *
 * Objetivo: Implementar rate limiting por IP y usuario con diferentes estrategias
 *
 * Conceptos cubiertos:
 * - Rate limiting por IP
 * - Rate limiting por usuario autenticado
 * - Rate limiting por endpoint
 * - Whitelist de IPs
 * - Alertas de seguridad
 *
 * Tiempo estimado: 20 minutos
 */

const express = require('express');
const rateLimit = require('express-rate-limit');
const app = express();

// Middleware para parsing JSON
app.use(express.json());

// Simulación de función de logging
const logSecurityEvent = (event, details) => {
  console.log(`🚨 EVENTO DE SEGURIDAD: ${event}`, details);
};

// ==========================================
// EJERCICIO 1.1: Rate Limiting General
// ==========================================

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requests por IP por ventana
  message: {
    error: 'Demasiadas solicitudes desde esta IP',
    resetTime: '15 minutos',
  },
  standardHeaders: true, // Incluir rate limit info en headers
  legacyHeaders: false, // Desactivar headers legacy
  handler: (req, res) => {
    logSecurityEvent('RATE_LIMIT_EXCEEDED', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.url,
      timestamp: new Date().toISOString(),
    });

    res.status(429).json({
      error: 'Demasiadas solicitudes desde esta IP',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000),
      limit: req.rateLimit.limit,
      remaining: req.rateLimit.remaining,
    });
  },
});

// ==========================================
// EJERCICIO 1.2: Rate Limiting por Endpoint
// ==========================================

// Rate limiting estricto para autenticación
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Solo 5 intentos de login por IP
  skipSuccessfulRequests: true, // No contar requests exitosos
  message: {
    error: 'Demasiados intentos de autenticación',
  },
  handler: (req, res) => {
    logSecurityEvent('AUTH_RATE_LIMIT_EXCEEDED', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      email: req.body.email,
      timestamp: new Date().toISOString(),
    });

    res.status(429).json({
      error: 'Demasiados intentos de autenticación',
      message: 'Intenta de nuevo en 15 minutos',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000),
    });
  },
});

// Rate limiting para API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 200, // 200 requests por IP por ventana
  message: {
    error: 'Límite de API alcanzado',
  },
  handler: (req, res) => {
    logSecurityEvent('API_RATE_LIMIT_EXCEEDED', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.url,
      method: req.method,
      timestamp: new Date().toISOString(),
    });

    res.status(429).json({
      error: 'Límite de API alcanzado',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000),
    });
  },
});

// ==========================================
// EJERCICIO 1.3: Rate Limiting por Usuario
// ==========================================

// Simulación de middleware de autenticación
const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  // Simulación de verificación de token
  if (authHeader === 'Bearer user-token') {
    req.user = { id: 'user123', role: 'user' };
  } else if (authHeader === 'Bearer admin-token') {
    req.user = { id: 'admin123', role: 'admin' };
  } else if (authHeader === 'Bearer premium-token') {
    req.user = { id: 'premium123', role: 'premium' };
  } else {
    return res.status(401).json({ error: 'Token inválido' });
  }

  next();
};

// Rate limiting basado en usuario
const userBasedLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: req => {
    // Diferentes límites según el rol del usuario
    if (req.user?.role === 'admin') return 1000;
    if (req.user?.role === 'premium') return 500;
    return 100; // Usuario básico
  },
  keyGenerator: req => {
    // Usar ID de usuario si está autenticado, sino IP
    return req.user?.id || req.ip;
  },
  message: {
    error: 'Límite de usuario alcanzado',
  },
  handler: (req, res) => {
    logSecurityEvent('USER_RATE_LIMIT_EXCEEDED', {
      userId: req.user?.id,
      role: req.user?.role,
      ip: req.ip,
      timestamp: new Date().toISOString(),
    });

    res.status(429).json({
      error: 'Límite de usuario alcanzado',
      userRole: req.user?.role,
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000),
    });
  },
});

// ==========================================
// EJERCICIO 1.4: Whitelist de IPs
// ==========================================

const createWhitelistMiddleware = whitelistedIPs => {
  return (req, res, next) => {
    const clientIP = req.ip;

    if (whitelistedIPs.includes(clientIP)) {
      req.isWhitelisted = true;
      logSecurityEvent('WHITELISTED_IP_ACCESS', {
        ip: clientIP,
        url: req.url,
        timestamp: new Date().toISOString(),
      });
      return next();
    }

    // Aplicar rate limiting normal para IPs no whitelisteadas
    generalLimiter(req, res, next);
  };
};

// ==========================================
// EJERCICIO 1.5: Detección de Actividad Sospechosa
// ==========================================

const suspiciousActivityDetector = (req, res, next) => {
  const ip = req.ip;
  const userAgent = req.get('User-Agent');

  // Detectar User-Agent sospechoso
  const suspiciousUAs = [
    'curl',
    'wget',
    'python-requests',
    'Go-http-client',
    'libwww-perl',
    'PHP/',
    'Java/',
    'Apache-HttpClient',
  ];

  const isSuspiciousUA = suspiciousUAs.some(ua =>
    userAgent?.toLowerCase().includes(ua.toLowerCase())
  );

  if (isSuspiciousUA) {
    logSecurityEvent('SUSPICIOUS_USER_AGENT', {
      ip,
      userAgent,
      url: req.url,
      timestamp: new Date().toISOString(),
    });

    // Aplicar rate limiting más estricto
    const strictLimiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 10, // Límite muy bajo para actividad sospechosa
      message: {
        error: 'Actividad sospechosa detectada',
      },
    });

    return strictLimiter(req, res, next);
  }

  next();
};

// ==========================================
// CONFIGURACIÓN DE RUTAS
// ==========================================

// Configurar whitelist de IPs
const whitelist = ['127.0.0.1', '::1', '192.168.1.100'];

// Aplicar middlewares
app.use(createWhitelistMiddleware(whitelist));
app.use(suspiciousActivityDetector);

// Rutas de autenticación con rate limiting estricto
app.use('/auth', authLimiter);

// Rutas de API con rate limiting moderado
app.use('/api', apiLimiter);

// Rutas protegidas con rate limiting por usuario
app.use('/api/protected', authenticateUser, userBasedLimiter);

// ==========================================
// RUTAS DE EJEMPLO
// ==========================================

// Ruta pública
app.get('/api/public', (req, res) => {
  res.json({
    message: 'Endpoint público',
    ip: req.ip,
    isWhitelisted: req.isWhitelisted || false,
    rateLimit: {
      limit: req.rateLimit?.limit,
      remaining: req.rateLimit?.remaining,
      resetTime: req.rateLimit?.resetTime,
    },
  });
});

// Ruta de autenticación
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;

  // Simulación de autenticación
  if (email === 'admin@test.com' && password === 'password') {
    res.json({
      message: 'Login exitoso',
      token: 'admin-token',
    });
  } else {
    res.status(401).json({
      error: 'Credenciales inválidas',
    });
  }
});

// Ruta protegida
app.get('/api/protected/data', (req, res) => {
  res.json({
    message: 'Datos protegidos',
    user: req.user,
    rateLimit: {
      limit: req.rateLimit?.limit,
      remaining: req.rateLimit?.remaining,
      resetTime: req.rateLimit?.resetTime,
    },
  });
});

// Ruta de información del rate limit
app.get('/api/rate-limit-info', (req, res) => {
  res.json({
    message: 'Información de rate limiting',
    ip: req.ip,
    isWhitelisted: req.isWhitelisted || false,
    userAgent: req.get('User-Agent'),
    rateLimit: req.rateLimit
      ? {
          limit: req.rateLimit.limit,
          remaining: req.rateLimit.remaining,
          resetTime: new Date(req.rateLimit.resetTime).toISOString(),
          totalHits: req.rateLimit.totalHits,
        }
      : null,
  });
});

// ==========================================
// MANEJO DE ERRORES
// ==========================================

app.use((err, req, res, next) => {
  console.error('Error:', err.message);

  if (err.message.includes('CORS')) {
    return res.status(403).json({
      error: 'Acceso denegado por CORS',
    });
  }

  res.status(500).json({
    error: 'Error interno del servidor',
  });
});

// ==========================================
// SERVIDOR
// ==========================================

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📋 Endpoints disponibles:`);
  console.log(`   GET  /api/public`);
  console.log(`   POST /auth/login`);
  console.log(`   GET  /api/protected/data (requiere auth)`);
  console.log(`   GET  /api/rate-limit-info`);
  console.log(`\n🧪 Comandos de prueba:`);
  console.log(`   curl http://localhost:${PORT}/api/public`);
  console.log(
    `   curl -X POST http://localhost:${PORT}/auth/login -H "Content-Type: application/json" -d '{"email":"admin@test.com","password":"password"}'`
  );
  console.log(
    `   curl http://localhost:${PORT}/api/protected/data -H "Authorization: Bearer admin-token"`
  );
  console.log(
    `\n⚠️  Para probar rate limiting, ejecuta múltiples requests rápidamente`
  );
});

// ==========================================
// EJERCICIOS PARA EL ESTUDIANTE
// ==========================================

/*
EJERCICIO 1: Implementar rate limiting personalizado
1. Crea un rate limiter que permita 10 requests por minuto para usuarios normales
2. Permite 100 requests por minuto para usuarios premium
3. Permite requests ilimitados para administradores

EJERCICIO 2: Implementar detección de ataques
1. Detecta cuando una IP hace más de 50 requests en 1 minuto
2. Bloquea temporalmente la IP por 30 minutos
3. Envía una alerta al sistema de monitoreo

EJERCICIO 3: Configurar alertas avanzadas
1. Envía notificación cuando se excede el rate limit 3 veces seguidas
2. Crea un dashboard para monitorear el rate limiting
3. Implementa métricas de uso por endpoint

EJERCICIO 4: Testing del rate limiting
1. Escribe tests para verificar que el rate limiting funciona
2. Testa diferentes escenarios (usuarios normales, premium, admin)
3. Verifica que las alertas se envían correctamente
*/

module.exports = app;
