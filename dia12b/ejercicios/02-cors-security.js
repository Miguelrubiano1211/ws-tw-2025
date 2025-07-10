/**
 * Ejercicio 2: CORS Security
 *
 * Objetivo: Configurar CORS dinámico y seguro para diferentes endpoints
 *
 * Conceptos cubiertos:
 * - CORS básico y avanzado
 * - Configuración dinámica por endpoint
 * - Preflight requests
 * - Validación de orígenes
 * - Políticas de credentials
 *
 * Tiempo estimado: 15 minutos
 */

const express = require('express');
const cors = require('cors');
const app = express();

// Middleware para parsing JSON
app.use(express.json());

// Función de logging para eventos de seguridad
const logSecurityEvent = (event, details) => {
  console.log(`🚨 EVENTO DE SEGURIDAD: ${event}`, details);
};

// ==========================================
// EJERCICIO 2.1: CORS Básico
// ==========================================

// Lista de orígenes permitidos
const allowedOrigins = [
  'http://localhost:3000',
  'https://mi-app.com',
  'https://www.mi-app.com',
  'https://admin.mi-app.com',
  'https://api.mi-app.com',
];

// Configuración CORS básica
const basicCorsOptions = {
  origin: (origin, callback) => {
    // Permitir requests sin origin (como aplicaciones móviles)
    if (!origin) {
      return callback(null, true);
    }

    // Verificar si el origin está en la lista permitida
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // Loggear violación de CORS
      logSecurityEvent('CORS_VIOLATION', {
        origin,
        timestamp: new Date().toISOString(),
        userAgent: 'N/A', // Se obtendrá en el middleware
      });

      callback(new Error('No permitido por política CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-API-Key',
    'X-Client-Version',
  ],
  exposedHeaders: [
    'X-Total-Count',
    'X-Page-Count',
    'X-Rate-Limit-Remaining',
    'X-Rate-Limit-Reset',
  ],
  maxAge: 86400, // 24 horas - tiempo de cache para preflight
};

// ==========================================
// EJERCICIO 2.2: CORS Dinámico por Endpoint
// ==========================================

const dynamicCorsMiddleware = (req, res, next) => {
  const origin = req.headers.origin;
  const path = req.path;

  // Loggear información del request
  console.log(
    `📝 CORS Request: ${req.method} ${path} from ${origin || 'no-origin'}`
  );

  // Configuración específica por endpoint
  if (path.startsWith('/api/public')) {
    // Endpoints públicos: más permisivo
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    // No credentials para endpoints públicos
  } else if (path.startsWith('/api/admin')) {
    // Endpoints de administración: muy restrictivo
    const adminOrigins = [
      'https://admin.mi-app.com',
      'http://localhost:3001', // Solo para desarrollo
    ];

    if (adminOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, OPTIONS'
      );
      res.header(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, X-Admin-Token'
      );
    } else {
      logSecurityEvent('ADMIN_CORS_VIOLATION', {
        origin,
        path,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString(),
      });

      return res.status(403).json({
        error:
          'Acceso denegado: origen no autorizado para endpoints de administración',
      });
    }
  } else if (path.startsWith('/api/protected')) {
    // Endpoints protegidos: configuración estándar
    const protectedOrigins = [
      'http://localhost:3000',
      'https://mi-app.com',
      'https://www.mi-app.com',
    ];

    if (protectedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, OPTIONS'
      );
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    } else {
      logSecurityEvent('PROTECTED_CORS_VIOLATION', {
        origin,
        path,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString(),
      });

      return res.status(403).json({
        error: 'Acceso denegado: origen no autorizado',
      });
    }
  } else {
    // Otros endpoints: configuración por defecto
    if (allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, OPTIONS'
      );
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
  }

  // Manejar preflight requests
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Max-Age', '86400'); // 24 horas
    return res.status(200).end();
  }

  next();
};

// ==========================================
// EJERCICIO 2.3: Validación Avanzada de Orígenes
// ==========================================

const advancedOriginValidator = (req, res, next) => {
  const origin = req.headers.origin;
  const referer = req.headers.referer;

  // Verificar origen sospechoso
  const suspiciousPatterns = [
    /localhost:\d{4}/, // Puertos no estándar (excepto desarrollo)
    /\.onion$/, // Dominios Tor
    /\d+\.\d+\.\d+\.\d+/, // IPs directas
    /[^a-zA-Z0-9.-]/, // Caracteres especiales
  ];

  // Solo aplicar en producción
  if (process.env.NODE_ENV === 'production' && origin) {
    const isSuspicious = suspiciousPatterns.some(pattern =>
      pattern.test(origin)
    );

    if (isSuspicious) {
      logSecurityEvent('SUSPICIOUS_ORIGIN', {
        origin,
        referer,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString(),
      });

      return res.status(403).json({
        error: 'Origen sospechoso detectado',
      });
    }
  }

  // Verificar consistencia entre Origin y Referer
  if (origin && referer) {
    try {
      const originUrl = new URL(origin);
      const refererUrl = new URL(referer);

      if (originUrl.hostname !== refererUrl.hostname) {
        logSecurityEvent('ORIGIN_REFERER_MISMATCH', {
          origin,
          referer,
          ip: req.ip,
          timestamp: new Date().toISOString(),
        });

        // En desarrollo, solo advertir
        if (process.env.NODE_ENV !== 'production') {
          console.warn('⚠️  Origin y Referer no coinciden');
        } else {
          return res.status(403).json({
            error: 'Inconsistencia en headers de origen',
          });
        }
      }
    } catch (error) {
      logSecurityEvent('INVALID_ORIGIN_FORMAT', {
        origin,
        referer,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  next();
};

// ==========================================
// EJERCICIO 2.4: CORS con Autenticación
// ==========================================

const corsWithAuth = (req, res, next) => {
  const origin = req.headers.origin;
  const authHeader = req.headers.authorization;

  // Para requests autenticados, ser más restrictivo
  if (authHeader) {
    const authenticatedOrigins = [
      'https://mi-app.com',
      'https://www.mi-app.com',
      'http://localhost:3000', // Solo para desarrollo
    ];

    if (authenticatedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Credentials', 'true');
    } else {
      logSecurityEvent('AUTHENTICATED_CORS_VIOLATION', {
        origin,
        hasAuth: !!authHeader,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString(),
      });

      return res.status(403).json({
        error: 'Origen no autorizado para requests autenticados',
      });
    }
  }

  next();
};

// ==========================================
// EJERCICIO 2.5: Monitoreo de CORS
// ==========================================

const corsMonitoring = (req, res, next) => {
  const origin = req.headers.origin;

  // Estadísticas de CORS
  if (!global.corsStats) {
    global.corsStats = {
      totalRequests: 0,
      allowedRequests: 0,
      blockedRequests: 0,
      originCounts: {},
    };
  }

  global.corsStats.totalRequests++;

  if (origin) {
    global.corsStats.originCounts[origin] =
      (global.corsStats.originCounts[origin] || 0) + 1;
  }

  // Interceptar respuesta para contar requests permitidos/bloqueados
  const originalJson = res.json;
  res.json = function (data) {
    if (res.statusCode === 403) {
      global.corsStats.blockedRequests++;
    } else {
      global.corsStats.allowedRequests++;
    }

    return originalJson.call(this, data);
  };

  next();
};

// ==========================================
// CONFIGURACIÓN DE MIDDLEWARES
// ==========================================

// Aplicar middlewares en orden
app.use(corsMonitoring);
app.use(advancedOriginValidator);
app.use(dynamicCorsMiddleware);
app.use(corsWithAuth);

// ==========================================
// RUTAS DE EJEMPLO
// ==========================================

// Ruta pública (CORS permisivo)
app.get('/api/public/info', (req, res) => {
  res.json({
    message: 'Información pública',
    timestamp: new Date().toISOString(),
    origin: req.headers.origin || 'no-origin',
  });
});

// Ruta protegida (CORS restrictivo)
app.get('/api/protected/data', (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: 'Token de autorización requerido',
    });
  }

  res.json({
    message: 'Datos protegidos',
    user: 'usuario-autenticado',
    timestamp: new Date().toISOString(),
    origin: req.headers.origin || 'no-origin',
  });
});

// Ruta de administración (CORS muy restrictivo)
app.get('/api/admin/stats', (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.includes('admin-token')) {
    return res.status(401).json({
      error: 'Token de administrador requerido',
    });
  }

  res.json({
    message: 'Estadísticas de administración',
    corsStats: global.corsStats,
    timestamp: new Date().toISOString(),
  });
});

// Ruta para obtener estadísticas de CORS
app.get('/api/cors-stats', (req, res) => {
  res.json({
    message: 'Estadísticas de CORS',
    stats: global.corsStats || {
      totalRequests: 0,
      allowedRequests: 0,
      blockedRequests: 0,
      originCounts: {},
    },
    timestamp: new Date().toISOString(),
  });
});

// Ruta para probar preflight
app.post('/api/test-preflight', (req, res) => {
  res.json({
    message: 'Preflight test exitoso',
    data: req.body,
    timestamp: new Date().toISOString(),
  });
});

// ==========================================
// MANEJO DE ERRORES
// ==========================================

app.use((err, req, res, next) => {
  console.error('Error CORS:', err.message);

  if (err.message.includes('CORS')) {
    logSecurityEvent('CORS_ERROR', {
      error: err.message,
      origin: req.headers.origin,
      ip: req.ip,
      timestamp: new Date().toISOString(),
    });

    return res.status(403).json({
      error: 'Acceso denegado por política CORS',
    });
  }

  res.status(500).json({
    error: 'Error interno del servidor',
  });
});

// ==========================================
// SERVIDOR
// ==========================================

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`🚀 Servidor CORS corriendo en puerto ${PORT}`);
  console.log(`📋 Endpoints disponibles:`);
  console.log(`   GET  /api/public/info (CORS permisivo)`);
  console.log(`   GET  /api/protected/data (CORS restrictivo)`);
  console.log(`   GET  /api/admin/stats (CORS muy restrictivo)`);
  console.log(`   GET  /api/cors-stats`);
  console.log(`   POST /api/test-preflight`);
  console.log(`\n🧪 Comandos de prueba:`);
  console.log(
    `   curl -H "Origin: https://mi-app.com" http://localhost:${PORT}/api/public/info`
  );
  console.log(
    `   curl -H "Origin: https://malicious-site.com" http://localhost:${PORT}/api/protected/data`
  );
  console.log(
    `   curl -X OPTIONS -H "Origin: https://mi-app.com" http://localhost:${PORT}/api/test-preflight`
  );
});

// ==========================================
// EJERCICIOS PARA EL ESTUDIANTE
// ==========================================

/*
EJERCICIO 1: Configurar CORS para diferentes ambientes
1. Crear configuración diferente para desarrollo, staging y producción
2. En desarrollo: permitir localhost con cualquier puerto
3. En producción: solo dominios específicos con HTTPS

EJERCICIO 2: Implementar whitelist dinámica
1. Crear endpoint para agregar/remover orígenes permitidos
2. Implementar autenticación de administrador
3. Persistir cambios en base de datos

EJERCICIO 3: Crear dashboard de monitoreo CORS
1. Mostrar estadísticas de requests permitidos/bloqueados
2. Listar orígenes más frecuentes
3. Mostrar alertas de seguridad

EJERCICIO 4: Testing de CORS
1. Escribir tests para verificar políticas CORS
2. Probar diferentes orígenes y métodos
3. Verificar que preflight requests funcionan correctamente
*/

module.exports = app;
