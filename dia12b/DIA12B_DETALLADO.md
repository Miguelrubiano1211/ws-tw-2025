# 🛡️ Día 12B: Protecciones Avanzadas de Seguridad - Guía Detallada

## 🎯 Transformación del Día

**De:** API con autenticación básica → **A:** API completamente fortificada con múltiples capas de protección

## 🗓️ Cronograma Detallado

---

## **12:00-12:45** - Rate Limiting y DDoS Protection

### **Conceptos Fundamentales**

#### **¿Qué es Rate Limiting?**

Rate limiting es una técnica para controlar el número de solicitudes que un cliente puede hacer a una API en un período determinado.

#### **Tipos de Rate Limiting:**

1. **Por IP Address**
2. **Por Usuario Autenticado**
3. **Por Endpoint**
4. **Por Recurso**
5. **Global**

#### **Implementación con Express Rate Limit**

```javascript
const rateLimit = require('express-rate-limit');

// Rate limiting general
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requests por IP
  message: {
    error: 'Demasiadas solicitudes desde esta IP',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logSecurityEvent('RATE_LIMIT_EXCEEDED', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.url,
    });

    res.status(429).json({
      error: 'Demasiadas solicitudes desde esta IP, intenta en 15 minutos',
    });
  },
});

// Rate limiting estricto para autenticación
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Solo 5 intentos de login
  skipSuccessfulRequests: true,
  message: {
    error: 'Demasiados intentos de login',
  },
});
```

#### **Rate Limiting Avanzado por Usuario**

```javascript
const userBasedLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: req => {
    // Diferentes límites según el rol del usuario
    if (req.user?.role === 'premium') return 1000;
    if (req.user?.role === 'admin') return 5000;
    return 100; // Usuario básico
  },
  keyGenerator: req => {
    // Usar ID de usuario si está autenticado, sino IP
    return req.user?.id || req.ip;
  },
});
```

#### **Configuración con Redis para Clustering**

```javascript
const RedisStore = require('rate-limit-redis');
const redis = require('redis');

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
});

const distributedLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:',
  }),
  windowMs: 15 * 60 * 1000,
  max: 100,
});
```

### **Protección DDoS Avanzada**

#### **Detección de Patrones de Ataque**

```javascript
const suspiciousActivityDetector = (req, res, next) => {
  const ip = req.ip;
  const userAgent = req.get('User-Agent');

  // Detectar User-Agent sospechoso
  const suspiciousUAs = ['curl', 'wget', 'python-requests', 'Go-http-client'];

  if (suspiciousUAs.some(ua => userAgent?.includes(ua))) {
    logSecurityEvent('SUSPICIOUS_USER_AGENT', {
      ip,
      userAgent,
      url: req.url,
    });

    // Aplicar rate limiting más estricto
    return strictLimiter(req, res, next);
  }

  next();
};
```

#### **Implementación de Whitelist**

```javascript
const createWhitelistMiddleware = whitelistedIPs => {
  return (req, res, next) => {
    const clientIP = req.ip;

    if (whitelistedIPs.includes(clientIP)) {
      req.isWhitelisted = true;
      return next();
    }

    // Aplicar rate limiting normal
    generalLimiter(req, res, next);
  };
};

// Uso
const whitelist = ['192.168.1.100', '10.0.0.1'];
app.use('/api', createWhitelistMiddleware(whitelist));
```

---

## **12:45-13:15** - CORS Configuration

### **Conceptos de CORS**

#### **¿Qué es CORS?**

Cross-Origin Resource Sharing (CORS) es un mecanismo que permite que recursos restringidos en una página web sean solicitados desde otro dominio.

#### **Problemas que Resuelve CORS:**

1. **Same-Origin Policy**: Restricción del navegador
2. **Cross-Domain Requests**: Solicitudes entre dominios
3. **Preflight Requests**: Verificación previa de solicitudes complejas

#### **Configuración Básica**

```javascript
const cors = require('cors');

// Configuración básica
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
```

#### **Configuración Avanzada**

```javascript
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:3000',
      'https://mi-app.com',
      'https://www.mi-app.com',
    ];

    // Permitir requests sin origin (como apps móviles)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logSecurityEvent('CORS_VIOLATION', {
        origin,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
      });
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-API-Key',
  ],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
  maxAge: 86400, // 24 horas
};
```

#### **CORS Dinámico por Endpoint**

```javascript
const dynamicCors = (req, res, next) => {
  const origin = req.headers.origin;

  // Diferentes políticas según el endpoint
  if (req.path.startsWith('/api/public')) {
    // Endpoints públicos: más permisivo
    res.header('Access-Control-Allow-Origin', '*');
  } else if (req.path.startsWith('/api/admin')) {
    // Endpoints de admin: muy restrictivo
    const adminOrigins = ['https://admin.mi-app.com'];
    if (adminOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
    }
  } else {
    // Endpoints normales: configuración estándar
    const allowedOrigins = ['http://localhost:3000', 'https://mi-app.com'];
    if (allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
    }
  }

  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  next();
};
```

---

## **13:15-14:00** - Input Validation y Sanitización

### **Validación Robusta con Joi**

#### **Esquemas de Validación Complejos**

```javascript
const joi = require('joi');

const userRegistrationSchema = joi.object({
  nombre: joi
    .string()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .required()
    .messages({
      'string.pattern.base': 'El nombre solo puede contener letras',
    }),

  email: joi
    .string()
    .email({ tlds: { allow: false } })
    .required()
    .custom((value, helpers) => {
      // Validación adicional personalizada
      if (value.includes('+')) {
        return helpers.error('any.invalid');
      }
      return value;
    }),

  password: joi
    .string()
    .min(8)
    .max(100)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      'string.pattern.base':
        'Password debe incluir mayúsculas, minúsculas, números y símbolos',
    }),

  edad: joi.number().integer().min(13).max(120).required(),

  telefono: joi
    .string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .optional(),

  direccion: joi
    .object({
      calle: joi.string().max(100).required(),
      ciudad: joi.string().max(50).required(),
      codigoPostal: joi
        .string()
        .pattern(/^\d{5}$/)
        .required(),
    })
    .optional(),
});
```

#### **Validación Condicional**

```javascript
const productSchema = joi.object({
  nombre: joi.string().min(2).max(100).required(),
  precio: joi.number().positive().precision(2).required(),
  categoria: joi
    .string()
    .valid('electronica', 'ropa', 'hogar', 'libros')
    .required(),

  // Validación condicional basada en categoría
  especificaciones: joi.when('categoria', {
    is: 'electronica',
    then: joi
      .object({
        marca: joi.string().required(),
        modelo: joi.string().required(),
        garantia: joi.number().min(1).max(60).required(),
      })
      .required(),
    otherwise: joi.object().optional(),
  }),

  // Validación basada en precio
  descuento: joi.when('precio', {
    is: joi.number().greater(100),
    then: joi.number().min(0).max(50).optional(),
    otherwise: joi.forbidden(),
  }),
});
```

#### **Sanitización de Inputs**

```javascript
const DOMPurify = require('isomorphic-dompurify');
const validator = require('validator');

const sanitizeInput = input => {
  if (typeof input === 'string') {
    // Escape HTML
    input = validator.escape(input);

    // Limpiar XSS
    input = DOMPurify.sanitize(input);

    // Normalizar espacios
    input = input.trim().replace(/\s+/g, ' ');

    // Remover caracteres de control
    input = input.replace(/[\x00-\x1F\x7F]/g, '');
  }

  return input;
};

const sanitizeObject = obj => {
  const sanitized = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'string') {
        sanitized[key] = sanitizeInput(obj[key]);
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitized[key] = sanitizeObject(obj[key]);
      } else {
        sanitized[key] = obj[key];
      }
    }
  }

  return sanitized;
};

// Middleware de sanitización
const sanitizeMiddleware = (req, res, next) => {
  req.body = sanitizeObject(req.body);
  req.query = sanitizeObject(req.query);
  req.params = sanitizeObject(req.params);
  next();
};
```

### **Prevención de XSS Avanzada**

#### **Content Security Policy (CSP)**

```javascript
const helmet = require('helmet');

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", 'https://api.mi-app.com'],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  })
);
```

---

## **14:15-15:00** - SQL Injection Prevention

### **Consultas Parametrizadas**

#### **SQLite con Parámetros**

```javascript
const sqlite3 = require('sqlite3').verbose();

class UserModel {
  // ❌ Vulnerable a SQL injection
  static async findUserBad(email) {
    const query = `SELECT * FROM users WHERE email = '${email}'`;
    return db.get(query);
  }

  // ✅ Seguro con parámetros
  static async findUserSafe(email) {
    const query = `SELECT * FROM users WHERE email = ?`;
    return db.get(query, [email]);
  }

  // ✅ Consulta compleja con múltiples parámetros
  static async searchUsers(filters) {
    let query = `
      SELECT id, nombre, email, role, created_at
      FROM users
      WHERE active = 1
    `;
    const params = [];

    if (filters.nombre) {
      query += ` AND nombre LIKE ?`;
      params.push(`%${filters.nombre}%`);
    }

    if (filters.role) {
      query += ` AND role = ?`;
      params.push(filters.role);
    }

    if (filters.dateFrom) {
      query += ` AND created_at >= ?`;
      params.push(filters.dateFrom);
    }

    query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    params.push(filters.limit || 10, filters.offset || 0);

    return db.all(query, params);
  }
}
```

#### **Validación de Inputs SQL**

```javascript
const validateSQLInput = input => {
  if (typeof input !== 'string') return true;

  // Patrones peligrosos
  const dangerousPatterns = [
    /('|(\\'))/i, // Comillas simples
    /("|(\\\"))/i, // Comillas dobles
    /(\-\-)/i, // Comentarios SQL
    /\/\*/i, // Comentarios de bloque
    /\*\//i, // Fin de comentarios
    /(\bunion\b)/i, // UNION attacks
    /(\bselect\b)/i, // SELECT statements
    /(\binsert\b)/i, // INSERT statements
    /(\bupdate\b)/i, // UPDATE statements
    /(\bdelete\b)/i, // DELETE statements
    /(\bdrop\b)/i, // DROP statements
    /(\bcreate\b)/i, // CREATE statements
    /(\balter\b)/i, // ALTER statements
    /(\bexec\b)/i, // EXEC statements
    /(\bexecute\b)/i, // EXECUTE statements
    /(\bsp_\b)/i, // Stored procedures
    /(\bxp_\b)/i, // Extended procedures
    /(;)/i, // Multiple statements
    /(\|\|)/i, // String concatenation
    /(\+)/i, // String concatenation
    /(\bor\b\s+\b1\b\s*=\s*\b1\b)/i, // OR 1=1
    /(\band\b\s+\b1\b\s*=\s*\b1\b)/i, // AND 1=1
  ];

  return !dangerousPatterns.some(pattern => pattern.test(input));
};

// Middleware de validación SQL
const sqlInjectionProtection = (req, res, next) => {
  const checkObject = obj => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'string') {
          if (!validateSQLInput(obj[key])) {
            logSecurityEvent('SQL_INJECTION_ATTEMPT', {
              ip: req.ip,
              userAgent: req.get('User-Agent'),
              field: key,
              value: obj[key],
              url: req.url,
            });

            return res.status(400).json({
              error: 'Input contiene caracteres no permitidos',
            });
          }
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          if (!checkObject(obj[key])) return false;
        }
      }
    }
    return true;
  };

  if (
    !checkObject(req.body) ||
    !checkObject(req.query) ||
    !checkObject(req.params)
  ) {
    return;
  }

  next();
};
```

#### **ORM y Query Builders Seguros**

```javascript
// Ejemplo con Knex.js (Query Builder)
const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './database.sqlite',
  },
});

class ProductModel {
  static async findAll(filters = {}) {
    let query = knex('products').select('*').where('active', true);

    // Filtros seguros con query builder
    if (filters.categoria) {
      query = query.where('categoria', filters.categoria);
    }

    if (filters.precio_min) {
      query = query.where('precio', '>=', filters.precio_min);
    }

    if (filters.precio_max) {
      query = query.where('precio', '<=', filters.precio_max);
    }

    if (filters.search) {
      query = query.where('nombre', 'like', `%${filters.search}%`);
    }

    return query.orderBy('created_at', 'desc').limit(filters.limit || 10);
  }

  static async create(productData) {
    const [id] = await knex('products').insert(productData);
    return this.findById(id);
  }

  static async update(id, updateData) {
    await knex('products').where('id', id).update(updateData);
    return this.findById(id);
  }
}
```

---

## **15:00-15:30** - Security Headers

### **Implementación con Helmet**

#### **Configuración Básica**

```javascript
const helmet = require('helmet');

// Configuración básica
app.use(helmet());

// Configuración personalizada
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", 'https://api.mi-app.com'],
      },
    },
    hsts: {
      maxAge: 31536000, // 1 año
      includeSubDomains: true,
      preload: true,
    },
  })
);
```

#### **Headers Personalizados**

```javascript
const customSecurityHeaders = (req, res, next) => {
  // Prevenir clickjacking
  res.setHeader('X-Frame-Options', 'DENY');

  // Prevenir MIME sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Activar XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions policy
  res.setHeader(
    'Permissions-Policy',
    'geolocation=(), camera=(), microphone=()'
  );

  // Prevenir información del servidor
  res.removeHeader('X-Powered-By');

  // Custom security header
  res.setHeader('X-Security-Version', '1.0');

  next();
};

app.use(customSecurityHeaders);
```

#### **Content Security Policy Avanzada**

```javascript
const advancedCSP = helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],

    // Scripts
    scriptSrc: [
      "'self'",
      // Solo permitir hashes específicos
      "'sha256-xyz123...'",
      // Solo dominios específicos
      'https://cdn.jsdelivr.net',
      // Nonce para scripts dinámicos
      (req, res) => `'nonce-${res.locals.nonce}'`,
    ],

    // Estilos
    styleSrc: [
      "'self'",
      "'unsafe-inline'", // Solo para desarrollo
      'https://fonts.googleapis.com',
    ],

    // Imágenes
    imgSrc: [
      "'self'",
      'data:',
      'https://images.unsplash.com',
      'https://cdn.mi-app.com',
    ],

    // Fuentes
    fontSrc: ["'self'", 'https://fonts.gstatic.com'],

    // Conexiones
    connectSrc: ["'self'", 'https://api.mi-app.com', 'wss://socket.mi-app.com'],

    // Media
    mediaSrc: ["'self'", 'https://media.mi-app.com'],

    // Objetos
    objectSrc: ["'none'"],

    // Frames
    frameSrc: ["'none'"],

    // Base URI
    baseUri: ["'self'"],

    // Formularios
    formAction: ["'self'"],

    // Upgrade insecure requests
    upgradeInsecureRequests: [],
  },

  // Reportar violaciones
  reportUri: '/api/security/csp-report',
});

// Endpoint para recibir reportes CSP
app.post('/api/security/csp-report', express.json(), (req, res) => {
  const report = req.body;

  logSecurityEvent('CSP_VIOLATION', {
    report,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString(),
  });

  res.status(204).send();
});
```

---

## **15:45-17:30** - Proyecto Final: API Completamente Segura

### **Estructura del Proyecto Final**

```
api-segura-completa/
├── src/
│   ├── app.js                 # Aplicación principal
│   ├── config/
│   │   ├── database.js        # Configuración BD
│   │   ├── security.js        # Configuración seguridad
│   │   └── jwt.js             # Configuración JWT
│   ├── middleware/
│   │   ├── auth.js            # Autenticación
│   │   ├── rateLimiter.js     # Rate limiting
│   │   ├── validation.js      # Validación
│   │   ├── cors.js            # CORS
│   │   └── security.js        # Headers seguridad
│   ├── models/
│   │   ├── User.js            # Modelo usuario
│   │   └── Product.js         # Modelo producto
│   ├── controllers/
│   │   ├── authController.js  # Controlador auth
│   │   └── productController.js # Controlador productos
│   ├── routes/
│   │   ├── auth.js            # Rutas auth
│   │   ├── products.js        # Rutas productos
│   │   └── index.js           # Rutas principales
│   └── utils/
│       ├── logger.js          # Sistema logging
│       ├── validation.js      # Utilidades validación
│       └── security.js        # Utilidades seguridad
├── tests/
│   ├── security.test.js       # Tests seguridad
│   ├── auth.test.js           # Tests autenticación
│   └── integration.test.js    # Tests integración
├── logs/                      # Directorio logs
├── .env.example              # Variables entorno
├── package.json              # Dependencias
└── README.md                 # Documentación
```

### **Implementación del Sistema Completo**

#### **1. Configuración de Seguridad Multicapa**

```javascript
// src/config/security.js
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');

const securityConfig = {
  // Rate limiting por endpoint
  rateLimits: {
    general: {
      windowMs: 15 * 60 * 1000,
      max: 100,
    },
    auth: {
      windowMs: 15 * 60 * 1000,
      max: 5,
    },
    api: {
      windowMs: 15 * 60 * 1000,
      max: 200,
    },
  },

  // Configuración CORS
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:3000',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  },

  // Configuración Helmet
  helmet: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", process.env.API_URL],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  },
};

module.exports = securityConfig;
```

#### **2. Middleware de Seguridad Integrado**

```javascript
// src/middleware/security.js
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const securityConfig = require('../config/security');
const { logSecurityEvent } = require('../utils/logger');

// Aplicar todos los middlewares de seguridad
const applySecurityMiddleware = app => {
  // Helmet para headers de seguridad
  app.use(helmet(securityConfig.helmet));

  // CORS
  app.use(cors(securityConfig.cors));

  // Rate limiting general
  const generalLimiter = rateLimit({
    ...securityConfig.rateLimits.general,
    handler: (req, res) => {
      logSecurityEvent('RATE_LIMIT_EXCEEDED', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        url: req.url,
      });
      res.status(429).json({
        error: 'Demasiadas solicitudes',
      });
    },
  });

  app.use('/api', generalLimiter);

  // Headers personalizados
  app.use((req, res, next) => {
    res.setHeader('X-API-Version', '1.0');
    res.setHeader('X-Security-Enabled', 'true');
    next();
  });
};

module.exports = { applySecurityMiddleware };
```

#### **3. Testing de Seguridad**

```javascript
// tests/security.test.js
const request = require('supertest');
const app = require('../src/app');

describe('Security Tests', () => {
  describe('Rate Limiting', () => {
    test('should block requests after limit exceeded', async () => {
      // Hacer múltiples requests rápidamente
      const promises = Array(10)
        .fill()
        .map(() => request(app).get('/api/test'));

      const responses = await Promise.all(promises);

      // Algunos deberían ser bloqueados
      const blockedResponses = responses.filter(res => res.status === 429);
      expect(blockedResponses.length).toBeGreaterThan(0);
    });
  });

  describe('CORS', () => {
    test('should allow requests from allowed origins', async () => {
      const response = await request(app)
        .get('/api/test')
        .set('Origin', 'http://localhost:3000');

      expect(response.headers['access-control-allow-origin']).toBe(
        'http://localhost:3000'
      );
    });

    test('should block requests from disallowed origins', async () => {
      const response = await request(app)
        .get('/api/test')
        .set('Origin', 'https://malicious-site.com');

      expect(response.status).toBe(500);
    });
  });

  describe('SQL Injection Protection', () => {
    test('should block malicious SQL inputs', async () => {
      const maliciousInput = "'; DROP TABLE users; --";

      const response = await request(app)
        .post('/api/products')
        .send({ nombre: maliciousInput })
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(400);
      expect(response.body.error).toContain(
        'Input contiene caracteres no permitidos'
      );
    });
  });

  describe('XSS Protection', () => {
    test('should sanitize XSS attempts', async () => {
      const xssInput = '<script>alert("XSS")</script>';

      const response = await request(app)
        .post('/api/products')
        .send({ nombre: xssInput })
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(201);
      expect(response.body.nombre).not.toContain('<script>');
    });
  });

  describe('Security Headers', () => {
    test('should include security headers', async () => {
      const response = await request(app).get('/api/test');

      expect(response.headers['x-frame-options']).toBe('DENY');
      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-xss-protection']).toBe('1; mode=block');
    });
  });
});
```

#### **4. Monitoreo y Logging**

```javascript
// src/utils/securityMonitor.js
const { logSecurityEvent } = require('./logger');

class SecurityMonitor {
  constructor() {
    this.suspiciousIPs = new Map();
    this.attackPatterns = new Map();
    this.alertThresholds = {
      failedLogins: 5,
      rateLimitExceeded: 3,
      sqlInjectionAttempts: 1,
      xssAttempts: 1,
    };
  }

  recordSecurityEvent(type, details) {
    const ip = details.ip;
    const now = Date.now();

    // Incrementar contador para esta IP
    if (!this.suspiciousIPs.has(ip)) {
      this.suspiciousIPs.set(ip, {
        events: [],
        score: 0,
      });
    }

    const ipData = this.suspiciousIPs.get(ip);
    ipData.events.push({ type, timestamp: now, details });

    // Incrementar score basado en el tipo de evento
    switch (type) {
      case 'FAILED_LOGIN':
        ipData.score += 1;
        break;
      case 'RATE_LIMIT_EXCEEDED':
        ipData.score += 2;
        break;
      case 'SQL_INJECTION_ATTEMPT':
        ipData.score += 10;
        break;
      case 'XSS_ATTEMPT':
        ipData.score += 10;
        break;
    }

    // Verificar si necesita alertas
    this.checkAlerts(ip, type, ipData);

    // Limpiar eventos antiguos (más de 1 hora)
    const hourAgo = now - 60 * 60 * 1000;
    ipData.events = ipData.events.filter(event => event.timestamp > hourAgo);
  }

  checkAlerts(ip, type, ipData) {
    const recentEvents = ipData.events.filter(
      event => event.timestamp > Date.now() - 15 * 60 * 1000
    );

    // Alertar si hay demasiados eventos recientes
    if (recentEvents.length >= this.alertThresholds[type.toLowerCase()]) {
      this.sendAlert(ip, type, ipData);
    }

    // Alertar si el score es muy alto
    if (ipData.score >= 20) {
      this.sendAlert(ip, 'HIGH_THREAT_SCORE', ipData);
    }
  }

  sendAlert(ip, type, data) {
    const alert = {
      type: 'SECURITY_ALERT',
      ip,
      alertType: type,
      score: data.score,
      recentEvents: data.events.slice(-10),
      timestamp: new Date().toISOString(),
    };

    logSecurityEvent('SECURITY_ALERT', alert);

    // Aquí podrías enviar notificaciones por email, Slack, etc.
    console.log(`🚨 ALERTA DE SEGURIDAD: ${type} desde IP ${ip}`);
  }

  isIPSuspicious(ip) {
    const ipData = this.suspiciousIPs.get(ip);
    return ipData && ipData.score >= 10;
  }
}

const securityMonitor = new SecurityMonitor();
module.exports = securityMonitor;
```

### **Evaluación del Proyecto Final**

#### **Criterios de Evaluación:**

1. **Seguridad (40%)**

   - Todas las protecciones implementadas
   - Sin vulnerabilidades detectadas
   - Logging y monitoreo funcional

2. **Funcionalidad (30%)**

   - API completamente funcional
   - Todas las rutas protegidas
   - Manejo de errores apropiado

3. **Código (20%)**

   - Estructura organizada
   - Mejores prácticas aplicadas
   - Documentación clara

4. **Testing (10%)**
   - Tests de seguridad implementados
   - Cobertura de casos críticos
   - Validación de protecciones

---

## 🎯 Siguiente Día

**Día 13: Frontend-Backend Integration**

- Integración completa React + Express
- Manejo de autenticación en frontend
- Error handling y UX patterns
- Interceptors y middleware de frontend

¡Excelente trabajo creando APIs verdaderamente seguras y robustas! 🛡️
