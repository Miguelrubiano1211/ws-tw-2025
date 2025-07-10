/**
 * 🛡️ Día 12B - Ejercicio 5: Security Headers y Mejores Prácticas
 *
 * Objetivos:
 * - Implementar security headers esenciales
 * - Configurar Content Security Policy (CSP)
 * - Aplicar protecciones contra clickjacking
 * - Configurar HTTPS y seguridad de transporte
 * - Implementar mejores prácticas de seguridad
 */

const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const crypto = require('crypto');
const path = require('path');

const app = express();

// Configuración de logging
app.use(morgan('combined'));

// Configuración de compresión
app.use(compression());

// Configuración de CORS segura
const corsOptions = {
  origin: function (origin, callback) {
    // Lista de dominios permitidos
    const allowedOrigins = [
      'https://miapp.com',
      'https://www.miapp.com',
      'https://app.miapp.com',
      'http://localhost:3000',
      'http://localhost:5000',
    ];

    // Permitir requests sin origen (aplicaciones móviles, Postman, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true, // Permitir cookies
  optionsSuccessStatus: 200, // Para IE11
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

app.use(cors(corsOptions));

// Rate limiting global
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requests por IP por ventana
  message: {
    error: 'Demasiadas peticiones desde esta IP',
    retryAfter: '15 minutos',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Demasiadas peticiones desde esta IP',
      retryAfter: '15 minutos',
    });
  },
});

app.use(globalLimiter);

// Rate limiting específico para auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 intentos por IP
  skipSuccessfulRequests: true, // No contar requests exitosos
  message: {
    error: 'Demasiados intentos de autenticación',
    retryAfter: '15 minutos',
  },
});

// Slow down para requests sospechosos
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutos
  delayAfter: 50, // Permitir 50 requests rápidos
  delayMs: 500, // Agregar 500ms de delay por request adicional
  maxDelayMs: 20000, // Máximo 20 segundos de delay
});

app.use(speedLimiter);

// Configuración avanzada de Helmet
app.use(
  helmet({
    // Content Security Policy
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: [
          "'self'",
          "'unsafe-inline'", // Solo para desarrollo
          'https://fonts.googleapis.com',
          'https://cdnjs.cloudflare.com',
        ],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'", // Solo para desarrollo
          'https://cdnjs.cloudflare.com',
        ],
        imgSrc: [
          "'self'",
          'data:',
          'https://images.unsplash.com',
          'https://via.placeholder.com',
        ],
        fontSrc: [
          "'self'",
          'https://fonts.gstatic.com',
          'https://cdnjs.cloudflare.com',
        ],
        connectSrc: ["'self'", 'https://api.miapp.com'],
        frameSrc: ["'none'"], // Prevenir clickjacking
        objectSrc: ["'none'"], // Prevenir plugins inseguros
        mediaSrc: ["'self'"],
        manifestSrc: ["'self'"],
        workerSrc: ["'self'"],
        childSrc: ["'none'"],
        frameAncestors: ["'none'"], // Prevenir embedding
        baseUri: ["'self'"],
        formAction: ["'self'"],
      },
      reportOnly: false, // Cambiar a true para modo reporte
    },

    // HTTP Strict Transport Security
    hsts: {
      maxAge: 31536000, // 1 año
      includeSubDomains: true,
      preload: true,
    },

    // Prevenir clickjacking
    frameguard: {
      action: 'deny',
    },

    // Prevenir MIME sniffing
    noSniff: true,

    // Prevenir XSS
    xssFilter: true,

    // Referrer Policy
    referrerPolicy: {
      policy: 'strict-origin-when-cross-origin',
    },

    // Permissions Policy
    permissionsPolicy: {
      features: {
        camera: ['self'],
        microphone: ['self'],
        geolocation: ['self'],
        fullscreen: ['self'],
        payment: ['self'],
        accelerometer: [],
        gyroscope: [],
        magnetometer: [],
        usb: [],
        bluetooth: [],
      },
    },
  })
);

// Headers adicionales de seguridad
app.use((req, res, next) => {
  // Ocultar tecnología del servidor
  res.removeHeader('X-Powered-By');

  // Prevenir caching de contenido sensible
  res.set(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, proxy-revalidate'
  );
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.set('Surrogate-Control', 'no-store');

  // Headers adicionales de seguridad
  res.set('X-Content-Type-Options', 'nosniff');
  res.set('X-Frame-Options', 'DENY');
  res.set('X-XSS-Protection', '1; mode=block');
  res.set('X-Robots-Tag', 'noindex, nofollow, nosnippet, noarchive');

  // Prevenir información de versión
  res.set('Server', 'WebServer');

  // Nonce para CSP dinámico
  res.locals.nonce = crypto.randomBytes(16).toString('hex');

  next();
});

// Middleware de parsing seguro
app.use(
  express.json({
    limit: '10mb',
    verify: (req, res, buf, encoding) => {
      // Verificar que el JSON sea válido
      try {
        JSON.parse(buf);
      } catch (err) {
        throw new Error('JSON inválido');
      }
    },
  })
);

app.use(
  express.urlencoded({
    limit: '10mb',
    extended: true,
    parameterLimit: 1000,
  })
);

// Servir archivos estáticos con headers de seguridad
app.use(
  '/static',
  express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, path, stat) => {
      // Headers para archivos estáticos
      res.set('X-Content-Type-Options', 'nosniff');
      res.set('Cache-Control', 'public, max-age=31536000'); // 1 año para estáticos

      // CSP específico para archivos estáticos
      if (path.endsWith('.js')) {
        res.set('Content-Type', 'application/javascript');
      } else if (path.endsWith('.css')) {
        res.set('Content-Type', 'text/css');
      }
    },
  })
);

// Middleware para logging de seguridad
const securityLogger = (req, res, next) => {
  const start = Date.now();

  // Log de request
  console.log(
    `🔍 ${req.method} ${req.url} - IP: ${req.ip} - User-Agent: ${req.get(
      'User-Agent'
    )}`
  );

  // Detectar patrones sospechosos
  const suspicious = [
    'eval(',
    'javascript:',
    '<script',
    'onerror=',
    'onload=',
    'alert(',
    'document.cookie',
    'union select',
    'drop table',
    '../../../',
    '..\\..\\..\\',
    'cmd.exe',
    '/etc/passwd',
    'null',
    'undefined',
  ];

  const requestString =
    JSON.stringify(req.body) + req.url + (req.get('User-Agent') || '');
  const foundSuspicious = suspicious.filter(pattern =>
    requestString.toLowerCase().includes(pattern.toLowerCase())
  );

  if (foundSuspicious.length > 0) {
    console.warn(`🚨 ACTIVIDAD SOSPECHOSA detectada en ${req.ip}:`);
    console.warn(`   Patrones: ${foundSuspicious.join(', ')}`);
    console.warn(`   URL: ${req.url}`);
    console.warn(`   User-Agent: ${req.get('User-Agent')}`);
  }

  // Log de respuesta
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `✅ ${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`
    );
  });

  next();
};

app.use(securityLogger);

// Rutas de ejemplo
app.get('/', (req, res) => {
  res.json({
    mensaje: '🛡️ Servidor seguro funcionando',
    timestamp: new Date().toISOString(),
    headers: {
      'Content-Security-Policy': 'Configurado',
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'Configurado',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
  });
});

// Ruta para mostrar headers de seguridad
app.get('/api/security-headers', (req, res) => {
  res.json({
    mensaje: 'Headers de seguridad aplicados',
    headers: {
      'Content-Security-Policy': res.get('Content-Security-Policy'),
      'X-Frame-Options': res.get('X-Frame-Options'),
      'X-Content-Type-Options': res.get('X-Content-Type-Options'),
      'X-XSS-Protection': res.get('X-XSS-Protection'),
      'Strict-Transport-Security': res.get('Strict-Transport-Security'),
      'Referrer-Policy': res.get('Referrer-Policy'),
      'Permissions-Policy': res.get('Permissions-Policy'),
    },
    recomendaciones: {
      HTTPS: 'Usar HTTPS en producción',
      CSP: 'Ajustar CSP según necesidades específicas',
      HSTS: 'Configurar HSTS con preload',
      Cookies: 'Usar flags Secure y HttpOnly',
      Headers: 'Ocultar información del servidor',
    },
  });
});

// Ruta de login con protección adicional
app.post('/api/auth/login', authLimiter, (req, res) => {
  const { username, password } = req.body;

  // Simulación de autenticación
  if (username === 'admin' && password === 'admin123') {
    // En producción, usar JWT seguros
    const token = crypto.randomBytes(32).toString('hex');

    // Configurar cookie segura
    res.cookie('authToken', token, {
      httpOnly: true, // Prevenir acceso desde JavaScript
      secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
      sameSite: 'strict', // Prevenir CSRF
      maxAge: 60 * 60 * 1000, // 1 hora
    });

    res.json({
      mensaje: 'Login exitoso',
      token: token,
      usuario: {
        id: 1,
        username: 'admin',
        role: 'admin',
      },
    });
  } else {
    res.status(401).json({
      error: 'Credenciales inválidas',
    });
  }
});

// Ruta para testear CSP
app.get('/api/test-csp', (req, res) => {
  res.json({
    mensaje: 'Test de Content Security Policy',
    nonce: res.locals.nonce,
    csp: res.get('Content-Security-Policy'),
    instrucciones: [
      'Esta respuesta incluye un nonce único para scripts',
      'El CSP bloquea scripts inline sin nonce',
      'Imágenes solo pueden cargarse desde dominios permitidos',
      'Frames están completamente bloqueados',
    ],
  });
});

// Ruta para simulación de error
app.get('/api/error', (req, res) => {
  throw new Error('Error simulado para testing');
});

// Ruta para health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    security: {
      headers: 'enabled',
      rateLimiting: 'enabled',
      cors: 'configured',
      csp: 'enforced',
    },
  });
});

// Middleware para manejar errores de CORS
app.use((err, req, res, next) => {
  if (err.message === 'No permitido por CORS') {
    return res.status(403).json({
      error: 'Acceso no permitido por CORS',
      origin: req.get('Origin') || 'desconocido',
    });
  }
  next(err);
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err.message);

  // No exponer detalles del error en producción
  const isDevelopment = process.env.NODE_ENV === 'development';

  res.status(500).json({
    error: 'Error interno del servidor',
    ...(isDevelopment && { details: err.message, stack: err.stack }),
  });
});

// Manejar rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.originalUrl,
    method: req.method,
  });
});

// Configuración del servidor
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🛡️ Servidor seguro ejecutándose en puerto ${PORT}`);
  console.log('\n🔒 Configuraciones de seguridad habilitadas:');
  console.log('✅ Helmet con CSP estricto');
  console.log('✅ Rate limiting global y específico');
  console.log('✅ CORS configurado');
  console.log('✅ Security headers');
  console.log('✅ Logging de seguridad');
  console.log('✅ Cookies seguras');
  console.log('✅ Detección de actividad sospechosa');
  console.log('\n📋 Rutas disponibles:');
  console.log('GET / - Información del servidor');
  console.log('GET /api/security-headers - Headers de seguridad');
  console.log('POST /api/auth/login - Login con protección');
  console.log('GET /api/test-csp - Test de CSP');
  console.log('GET /health - Health check');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Cerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor cerrado correctamente');
    process.exit(0);
  });
});

// Exportar para testing
module.exports = app;

/* 
🧪 INSTRUCCIONES DE PRUEBA:

1. Instalar dependencias:
   npm install express helmet express-rate-limit express-slow-down cors compression morgan

2. Ejecutar el servidor:
   node 05-security-headers.js

3. Probar headers de seguridad:
   curl -I http://localhost:3000/

4. Ver headers específicos:
   curl http://localhost:3000/api/security-headers

5. Probar rate limiting (hacer múltiples requests):
   for i in {1..10}; do curl http://localhost:3000/; done

6. Probar CORS desde otro dominio:
   curl -H "Origin: https://sitio-malicioso.com" http://localhost:3000/

7. Probar login con protección:
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username": "admin", "password": "admin123"}'

8. Probar CSP:
   curl http://localhost:3000/api/test-csp

9. Ver health check:
   curl http://localhost:3000/health

10. Probar detección de actividad sospechosa:
    curl "http://localhost:3000/api/test?query=<script>alert('xss')</script>"
    curl "http://localhost:3000/api/test?query='; DROP TABLE users; --"

💡 CONCEPTOS CLAVE:
- Content Security Policy (CSP): Controla qué recursos pueden cargar las páginas
- HSTS: Fuerza conexiones HTTPS
- X-Frame-Options: Previene clickjacking
- X-Content-Type-Options: Previene MIME sniffing
- Referrer-Policy: Controla información de referrer
- Permissions-Policy: Controla APIs del navegador
- Rate limiting: Previene ataques DDoS
- CORS: Controla acceso desde otros dominios
- Logging de seguridad: Detecta actividad sospechosa

🔒 HEADERS DE SEGURIDAD ESENCIALES:
1. Content-Security-Policy
2. Strict-Transport-Security
3. X-Frame-Options
4. X-Content-Type-Options
5. X-XSS-Protection
6. Referrer-Policy
7. Permissions-Policy
8. Cache-Control (para contenido sensible)

🚨 ACTIVIDAD SOSPECHOSA DETECTADA:
- Patrones de XSS
- Intentos de SQL injection
- Path traversal
- Comandos del sistema
- Acceso a archivos del sistema
*/
