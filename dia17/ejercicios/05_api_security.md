# 🚦 Ejercicio 5: API Security Implementation

## 📋 Información del Ejercicio

**Duración:** 45 minutos  
**Dificultad:** ⭐⭐⭐⭐  
**Prerequisitos:** APIs RESTful funcionando, JWT implementado  
**Objetivos:** Implementar security avanzada para APIs incluyendo rate limiting, API keys y throttling

---

## 🎯 Objetivos de Aprendizaje

Al completar este ejercicio, el estudiante será capaz de:

- Implementar API key authentication y management
- Configurar rate limiting granular por endpoint y usuario
- Implementar request throttling y circuit breakers
- Configurar API versioning con security considerations
- Implementar API monitoring y analytics
- Crear dashboard de API security metrics

---

## 📚 Conceptos Clave

### **API Security Layers**

- **Authentication:** JWT tokens, API keys, OAuth 2.0
- **Authorization:** Role-based access control (RBAC)
- **Rate Limiting:** Controlar frequency de requests
- **Throttling:** Degradar performance en lugar de denegar
- **Circuit Breakers:** Proteger contra overload

### **API Key Management**

- **Generation:** Secure random key generation
- **Storage:** Hashed storage con metadata
- **Rotation:** Automatic key rotation policies
- **Scoping:** Keys con permisos específicos
- **Monitoring:** Usage tracking y analytics

---

## 🛠️ Tecnologías Utilizadas

- **express-rate-limit** - Rate limiting
- **express-slow-down** - Request throttling
- **ioredis** - Redis para rate limiting distribuido
- **uuid** - API key generation
- **crypto** - Cryptographic operations
- **joi** - API request validation

---

## 📝 Instrucciones Paso a Paso

### **Paso 1: Configuración de Rate Limiting Avanzado (10 minutos)**

#### **1.1 Instalar dependencias**

```bash
# Instalar dependencias para rate limiting avanzado
pnpm install express-slow-down ioredis uuid crypto-js

# Instalar dependencias de desarrollo
pnpm install -D redis-memory-server
```

#### **1.2 Configurar Redis para rate limiting distribuido**

```javascript
// config/redis.js
const Redis = require('ioredis');

let redisClient;

const createRedisClient = () => {
  if (redisClient) {
    return redisClient;
  }

  const redisConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    retryDelayOnFailover: 100,
    maxRetriesPerRequest: 3,
    lazyConnect: true,
    keepAlive: 30000,
  };

  redisClient = new Redis(redisConfig);

  redisClient.on('connect', () => {
    console.log('✅ Connected to Redis');
  });

  redisClient.on('error', err => {
    console.error('❌ Redis connection error:', err);
  });

  return redisClient;
};

// Rate limiting store using Redis
class RedisStore {
  constructor(options = {}) {
    this.redis = createRedisClient();
    this.prefix = options.prefix || 'rl:';
    this.expiry = options.expiry || 3600; // 1 hour default
  }

  async increment(key) {
    const prefixedKey = `${this.prefix}${key}`;

    const pipeline = this.redis.pipeline();
    pipeline.incr(prefixedKey);
    pipeline.expire(prefixedKey, this.expiry);

    const results = await pipeline.exec();
    const count = results[0][1];

    return {
      count,
      ttl: this.expiry,
    };
  }

  async get(key) {
    const prefixedKey = `${this.prefix}${key}`;
    const count = await this.redis.get(prefixedKey);
    return parseInt(count) || 0;
  }

  async reset(key) {
    const prefixedKey = `${this.prefix}${key}`;
    await this.redis.del(prefixedKey);
  }
}

module.exports = {
  createRedisClient,
  RedisStore,
};
```

#### **1.3 Crear rate limiting avanzado**

```javascript
// middleware/advanced-rate-limiting.js
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const { RedisStore } = require('../config/redis');

// Configuración de rate limiting por tiers
const rateLimitConfigs = {
  free: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // 100 requests
    message: {
      error: 'Rate limit exceeded',
      tier: 'free',
      limit: 100,
      window: '15 minutes',
    },
  },

  premium: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 1000, // 1000 requests
    message: {
      error: 'Rate limit exceeded',
      tier: 'premium',
      limit: 1000,
      window: '15 minutes',
    },
  },

  enterprise: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 10000, // 10000 requests
    message: {
      error: 'Rate limit exceeded',
      tier: 'enterprise',
      limit: 10000,
      window: '15 minutes',
    },
  },
};

// Rate limiting dinámico basado en usuario
const createDynamicRateLimit = () => {
  return rateLimit({
    store: new RedisStore({ prefix: 'api_rate:' }),

    // Key generator personalizado
    keyGenerator: req => {
      // Prioridad: API Key > User ID > IP
      if (req.apiKey) {
        return `apikey:${req.apiKey.id}`;
      }
      if (req.user) {
        return `user:${req.user.id}`;
      }
      return `ip:${req.ip}`;
    },

    // Límite dinámico basado en tier del usuario
    max: req => {
      const tier = req.user?.tier || req.apiKey?.tier || 'free';
      return rateLimitConfigs[tier].max;
    },

    windowMs: req => {
      const tier = req.user?.tier || req.apiKey?.tier || 'free';
      return rateLimitConfigs[tier].windowMs;
    },

    message: req => {
      const tier = req.user?.tier || req.apiKey?.tier || 'free';
      return rateLimitConfigs[tier].message;
    },

    // Headers informativos
    standardHeaders: true,
    legacyHeaders: false,

    // Skip requests exitosos para algunos endpoints
    skipSuccessfulRequests: false,

    // Handler personalizado para rate limit exceeded
    handler: (req, res) => {
      const tier = req.user?.tier || req.apiKey?.tier || 'free';
      const config = rateLimitConfigs[tier];

      // Log rate limit violation
      console.warn('Rate limit exceeded:', {
        key: req.rateLimit.key,
        tier: tier,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        endpoint: req.path,
      });

      res.status(429).json({
        error: 'Rate limit exceeded',
        details: config.message,
        retryAfter: Math.round(config.windowMs / 1000),
        remaining: 0,
        resetTime: new Date(Date.now() + config.windowMs).toISOString(),
      });
    },
  });
};

// Throttling (slow down) para requests frecuentes
const createSlowDown = () => {
  return slowDown({
    store: new RedisStore({ prefix: 'slowdown:' }),

    windowMs: 15 * 60 * 1000, // 15 minutos
    delayAfter: 50, // Comenzar delay después de 50 requests
    delayMs: 500, // Delay de 500ms por cada request adicional
    maxDelayMs: 10000, // Máximo delay de 10 segundos

    keyGenerator: req => {
      if (req.apiKey) return `apikey:${req.apiKey.id}`;
      if (req.user) return `user:${req.user.id}`;
      return `ip:${req.ip}`;
    },

    // Skip slowdown para usuarios premium
    skip: req => {
      const tier = req.user?.tier || req.apiKey?.tier || 'free';
      return tier === 'enterprise';
    },
  });
};

// Rate limiting específico por endpoint
const endpointRateLimits = {
  // Endpoints de autenticación más estrictos
  '/api/auth/login': rateLimit({
    store: new RedisStore({ prefix: 'login:' }),
    windowMs: 15 * 60 * 1000,
    max: 5,
    skipSuccessfulRequests: true,
    message: {
      error: 'Too many login attempts',
      retryAfter: 900,
    },
  }),

  // Endpoints de búsqueda con throttling
  '/api/productos/search': rateLimit({
    store: new RedisStore({ prefix: 'search:' }),
    windowMs: 1 * 60 * 1000, // 1 minuto
    max: 30,
    message: {
      error: 'Search rate limit exceeded',
      retryAfter: 60,
    },
  }),

  // Endpoints de upload más restrictivos
  '/api/upload': rateLimit({
    store: new RedisStore({ prefix: 'upload:' }),
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 10,
    message: {
      error: 'Upload rate limit exceeded',
      retryAfter: 3600,
    },
  }),
};

module.exports = {
  createDynamicRateLimit,
  createSlowDown,
  endpointRateLimits,
  rateLimitConfigs,
};
```

### **Paso 2: Sistema de API Keys (15 minutos)**

#### **2.1 Modelo de API Keys**

```javascript
// models/ApiKey.js
const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const apiKeySchema = new mongoose.Schema(
  {
    // Metadata de la API key
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    // Hash de la key (nunca almacenar la key real)
    keyHash: {
      type: String,
      required: true,
      unique: true,
    },

    // Prefijo visible (para identificación)
    keyPrefix: {
      type: String,
      required: true,
      length: 8,
    },

    // Owner de la API key
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Tier y permisos
    tier: {
      type: String,
      enum: ['free', 'premium', 'enterprise'],
      default: 'free',
    },

    scopes: [
      {
        type: String,
        enum: [
          'read:productos',
          'write:productos',
          'read:users',
          'write:users',
          'admin:all',
        ],
      },
    ],

    // Rate limiting específico para esta key
    rateLimit: {
      requests: {
        type: Number,
        default: 1000,
      },
      window: {
        type: Number,
        default: 3600, // 1 hora en segundos
      },
    },

    // Estado y metadata
    isActive: {
      type: Boolean,
      default: true,
    },

    lastUsed: {
      type: Date,
      default: null,
    },

    usageCount: {
      type: Number,
      default: 0,
    },

    // Restricciones de uso
    allowedOrigins: [
      {
        type: String,
      },
    ],

    allowedIPs: [
      {
        type: String,
      },
    ],

    // Fechas de expiración
    expiresAt: {
      type: Date,
      default: null, // null = nunca expira
    },

    // Rotación automática
    rotationSchedule: {
      enabled: {
        type: Boolean,
        default: false,
      },
      intervalDays: {
        type: Number,
        default: 90,
      },
      lastRotation: {
        type: Date,
        default: Date.now,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Índices
apiKeySchema.index({ keyHash: 1 });
apiKeySchema.index({ userId: 1 });
apiKeySchema.index({ keyPrefix: 1 });
apiKeySchema.index({ expiresAt: 1 });

// Método estático para generar nueva API key
apiKeySchema.statics.generateApiKey = function () {
  // Generar key segura de 32 bytes
  const keyBytes = crypto.randomBytes(32);
  const key = keyBytes.toString('hex');

  // Crear prefijo identificable
  const prefix = 'tk_' + crypto.randomBytes(4).toString('hex');

  // Key completa con prefijo
  const fullKey = `${prefix}.${key}`;

  return {
    key: fullKey,
    prefix: prefix,
    hash: bcrypt.hashSync(fullKey, 10),
  };
};

// Método para verificar API key
apiKeySchema.methods.verifyKey = function (providedKey) {
  return bcrypt.compareSync(providedKey, this.keyHash);
};

// Método para actualizar uso
apiKeySchema.methods.recordUsage = async function () {
  this.lastUsed = new Date();
  this.usageCount += 1;
  await this.save();
};

// Método para verificar scopes
apiKeySchema.methods.hasScope = function (requiredScope) {
  if (this.scopes.includes('admin:all')) {
    return true;
  }
  return this.scopes.includes(requiredScope);
};

// Método para verificar expiración
apiKeySchema.methods.isExpired = function () {
  if (!this.expiresAt) return false;
  return new Date() > this.expiresAt;
};

// Middleware pre-save para TTL
apiKeySchema.pre('save', function (next) {
  // Configurar TTL automático si hay fecha de expiración
  if (this.expiresAt && this.isNew) {
    this.collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  }
  next();
});

module.exports = mongoose.model('ApiKey', apiKeySchema);
```

#### **2.2 Middleware de autenticación API Key**

```javascript
// middleware/api-key-auth.js
const ApiKey = require('../models/ApiKey');
const rateLimit = require('express-rate-limit');
const { RedisStore } = require('../config/redis');

// Middleware para extraer y validar API key
const authenticateApiKey = async (req, res, next) => {
  try {
    // Extraer API key del header o query parameter
    let apiKey =
      req.headers['x-api-key'] ||
      req.headers['authorization']?.replace('Bearer ', '') ||
      req.query.api_key;

    if (!apiKey) {
      // API key no requerida para todos los endpoints
      return next();
    }

    // Validar formato básico
    if (!apiKey.startsWith('tk_') || !apiKey.includes('.')) {
      return res.status(401).json({
        error: 'Invalid API key format',
        details: 'API key must be in format: tk_xxxxxxxx.xxxxxxxx',
      });
    }

    // Extraer prefijo para búsqueda eficiente
    const prefix = apiKey.split('.')[0];

    // Buscar API key en base de datos
    const apiKeyDoc = await ApiKey.findOne({
      keyPrefix: prefix,
      isActive: true,
    }).populate('userId', 'nombre email tier');

    if (!apiKeyDoc) {
      return res.status(401).json({
        error: 'Invalid API key',
        details: 'API key not found or inactive',
      });
    }

    // Verificar que la key coincide con el hash
    if (!apiKeyDoc.verifyKey(apiKey)) {
      return res.status(401).json({
        error: 'Invalid API key',
        details: 'API key verification failed',
      });
    }

    // Verificar expiración
    if (apiKeyDoc.isExpired()) {
      return res.status(401).json({
        error: 'API key expired',
        details: 'Please generate a new API key',
        expiredAt: apiKeyDoc.expiresAt,
      });
    }

    // Verificar restricciones de origen
    if (apiKeyDoc.allowedOrigins.length > 0) {
      const origin = req.headers.origin || req.headers.referer;
      const isOriginAllowed = apiKeyDoc.allowedOrigins.some(
        allowedOrigin => origin && origin.includes(allowedOrigin)
      );

      if (!isOriginAllowed) {
        return res.status(403).json({
          error: 'Origin not allowed',
          details: 'API key not authorized for this origin',
        });
      }
    }

    // Verificar restricciones de IP
    if (apiKeyDoc.allowedIPs.length > 0) {
      const clientIP = req.ip;
      const isIPAllowed = apiKeyDoc.allowedIPs.includes(clientIP);

      if (!isIPAllowed) {
        return res.status(403).json({
          error: 'IP not allowed',
          details: 'API key not authorized for this IP address',
        });
      }
    }

    // Registrar uso de la API key (async, no bloquear request)
    apiKeyDoc.recordUsage().catch(console.error);

    // Adjuntar información a la request
    req.apiKey = {
      id: apiKeyDoc._id,
      name: apiKeyDoc.name,
      tier: apiKeyDoc.tier,
      scopes: apiKeyDoc.scopes,
      userId: apiKeyDoc.userId._id,
      user: apiKeyDoc.userId,
    };

    next();
  } catch (error) {
    console.error('API Key authentication error:', error);
    res.status(500).json({
      error: 'Authentication error',
      details: 'Internal server error during API key validation',
    });
  }
};

// Middleware para verificar scopes requeridos
const requireScope = requiredScope => {
  return (req, res, next) => {
    // Si no hay API key, verificar JWT user permissions
    if (!req.apiKey && req.user) {
      // Lógica para verificar permisos de usuario JWT
      return next();
    }

    if (!req.apiKey) {
      return res.status(401).json({
        error: 'Authentication required',
        details: 'API key or valid JWT token required',
      });
    }

    if (
      !req.apiKey.scopes.includes(requiredScope) &&
      !req.apiKey.scopes.includes('admin:all')
    ) {
      return res.status(403).json({
        error: 'Insufficient scope',
        details: `Required scope: ${requiredScope}`,
        availableScopes: req.apiKey.scopes,
      });
    }

    next();
  };
};

// Rate limiting específico para API keys
const apiKeyRateLimit = () => {
  return rateLimit({
    store: new RedisStore({ prefix: 'apikey_rate:' }),

    windowMs: req => {
      return (req.apiKey?.rateLimit?.window || 3600) * 1000;
    },

    max: req => {
      return req.apiKey?.rateLimit?.requests || 1000;
    },

    keyGenerator: req => {
      return req.apiKey ? `apikey:${req.apiKey.id}` : `ip:${req.ip}`;
    },

    message: req => ({
      error: 'API key rate limit exceeded',
      limit: req.apiKey?.rateLimit?.requests || 1000,
      window: req.apiKey?.rateLimit?.window || 3600,
      tier: req.apiKey?.tier || 'unknown',
    }),

    standardHeaders: true,
    legacyHeaders: false,
  });
};

module.exports = {
  authenticateApiKey,
  requireScope,
  apiKeyRateLimit,
};
```

### **Paso 3: Circuit Breaker Implementation (10 minutos)**

#### **3.1 Crear circuit breaker para protección de APIs**

```javascript
// middleware/circuit-breaker.js
const { createRedisClient } = require('../config/redis');

class CircuitBreaker {
  constructor(options = {}) {
    this.redis = createRedisClient();
    this.name = options.name || 'default';
    this.failureThreshold = options.failureThreshold || 5;
    this.successThreshold = options.successThreshold || 3;
    this.timeout = options.timeout || 60000; // 1 minuto
    this.resetTimeout = options.resetTimeout || 300000; // 5 minutos

    // Estados del circuit breaker
    this.states = {
      CLOSED: 'closed', // Normal operation
      OPEN: 'open', // Failing, reject requests
      HALF_OPEN: 'half_open', // Testing, limited requests
    };
  }

  async getKey(suffix) {
    return `circuit_breaker:${this.name}:${suffix}`;
  }

  async getState() {
    const stateKey = await this.getKey('state');
    const state = await this.redis.get(stateKey);
    return state || this.states.CLOSED;
  }

  async setState(state) {
    const stateKey = await this.getKey('state');
    await this.redis.setex(stateKey, this.resetTimeout / 1000, state);
  }

  async getFailureCount() {
    const failureKey = await this.getKey('failures');
    const count = await this.redis.get(failureKey);
    return parseInt(count) || 0;
  }

  async incrementFailures() {
    const failureKey = await this.getKey('failures');
    const count = await this.redis.incr(failureKey);
    await this.redis.expire(failureKey, this.resetTimeout / 1000);
    return count;
  }

  async resetFailures() {
    const failureKey = await this.getKey('failures');
    await this.redis.del(failureKey);
  }

  async getSuccessCount() {
    const successKey = await this.getKey('successes');
    const count = await this.redis.get(successKey);
    return parseInt(count) || 0;
  }

  async incrementSuccesses() {
    const successKey = await this.getKey('successes');
    const count = await this.redis.incr(successKey);
    await this.redis.expire(successKey, this.resetTimeout / 1000);
    return count;
  }

  async resetSuccesses() {
    const successKey = await this.getKey('successes');
    await this.redis.del(successKey);
  }

  async recordSuccess() {
    const state = await this.getState();

    if (state === this.states.HALF_OPEN) {
      const successCount = await this.incrementSuccesses();

      if (successCount >= this.successThreshold) {
        // Suficientes éxitos, cerrar circuit
        await this.setState(this.states.CLOSED);
        await this.resetFailures();
        await this.resetSuccesses();
        console.log(`Circuit breaker ${this.name}: CLOSED (recovered)`);
      }
    } else if (state === this.states.OPEN) {
      // Transition to half-open after timeout
      await this.setState(this.states.HALF_OPEN);
      await this.resetSuccesses();
      console.log(`Circuit breaker ${this.name}: HALF_OPEN (testing)`);
    }
  }

  async recordFailure() {
    const state = await this.getState();

    if (state === this.states.HALF_OPEN) {
      // Failure in half-open, back to open
      await this.setState(this.states.OPEN);
      await this.resetSuccesses();
      console.log(`Circuit breaker ${this.name}: OPEN (failure in half-open)`);
      return;
    }

    const failureCount = await this.incrementFailures();

    if (failureCount >= this.failureThreshold) {
      await this.setState(this.states.OPEN);
      console.log(
        `Circuit breaker ${this.name}: OPEN (threshold reached: ${failureCount})`
      );
    }
  }

  async canExecute() {
    const state = await this.getState();

    switch (state) {
      case this.states.CLOSED:
        return true;

      case this.states.OPEN:
        // Check if we should transition to half-open
        const stateKey = await this.getKey('state');
        const ttl = await this.redis.ttl(stateKey);

        if (ttl <= 0) {
          // Timeout reached, transition to half-open
          await this.setState(this.states.HALF_OPEN);
          await this.resetSuccesses();
          return true;
        }

        return false;

      case this.states.HALF_OPEN:
        // Allow limited requests in half-open state
        return true;

      default:
        return true;
    }
  }

  // Middleware factory
  middleware() {
    return async (req, res, next) => {
      const canExecute = await this.canExecute();

      if (!canExecute) {
        const state = await this.getState();
        const stateKey = await this.getKey('state');
        const ttl = await this.redis.ttl(stateKey);

        return res.status(503).json({
          error: 'Service temporarily unavailable',
          details: 'Circuit breaker is OPEN',
          circuitBreaker: {
            name: this.name,
            state: state,
            retryAfter: ttl > 0 ? ttl : this.resetTimeout / 1000,
          },
        });
      }

      // Override res.json to track success/failure
      const originalJson = res.json;
      const originalSend = res.send;

      const trackResponse = async () => {
        if (res.statusCode >= 200 && res.statusCode < 400) {
          await this.recordSuccess();
        } else if (res.statusCode >= 500) {
          await this.recordFailure();
        }
      };

      res.json = function (obj) {
        trackResponse();
        return originalJson.call(this, obj);
      };

      res.send = function (body) {
        trackResponse();
        return originalSend.call(this, body);
      };

      // Handle errors in middleware chain
      const originalNext = next;
      next = error => {
        if (error) {
          this.recordFailure();
        }
        originalNext(error);
      };

      next();
    };
  }
}

// Circuit breakers predefinidos para diferentes servicios
const circuitBreakers = {
  database: new CircuitBreaker({
    name: 'database',
    failureThreshold: 3,
    successThreshold: 2,
    resetTimeout: 30000, // 30 segundos
  }),

  externalAPI: new CircuitBreaker({
    name: 'external_api',
    failureThreshold: 5,
    successThreshold: 3,
    resetTimeout: 60000, // 1 minuto
  }),

  fileUpload: new CircuitBreaker({
    name: 'file_upload',
    failureThreshold: 2,
    successThreshold: 2,
    resetTimeout: 120000, // 2 minutos
  }),
};

module.exports = {
  CircuitBreaker,
  circuitBreakers,
};
```

### **Paso 4: API Monitoring y Analytics (5 minutos)**

#### **4.1 Crear sistema de monitoreo de APIs**

```javascript
// middleware/api-monitoring.js
const { createRedisClient } = require('../config/redis');

class APIMonitor {
  constructor() {
    this.redis = createRedisClient();
  }

  // Middleware para tracking de requests
  trackRequest() {
    return async (req, res, next) => {
      const startTime = Date.now();

      // Override res.end para capturar métricas
      const originalEnd = res.end;

      res.end = async function(chunk, encoding) {
        const endTime = Date.now();
        const duration = endTime - startTime;

        // Capturar métricas
        const metrics = {
          method: req.method,
          path: req.route?.path || req.path,
          statusCode: res.statusCode,
          duration: duration,
          userAgent: req.get('User-Agent'),
          ip: req.ip,
          apiKey: req.apiKey?.id || null,
          userId: req.user?.id || null,
          timestamp: new Date().toISOString()
        };

        // Almacenar métricas
        await this.recordMetrics(metrics);

        // Llamar al método original
        originalEnd.call(this, chunk, encoding);
      }.bind(this);

      next();
    }.bind(this);
  }

  async recordMetrics(metrics) {
    try {
      const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      const hour = new Date().getHours();

      // Keys para diferentes agregaciones
      const dailyKey = `api_metrics:daily:${date}`;
      const hourlyKey = `api_metrics:hourly:${date}:${hour}`;
      const endpointKey = `api_metrics:endpoint:${metrics.method}:${metrics.path}:${date}`;
      const statusKey = `api_metrics:status:${metrics.statusCode}:${date}`;

      // Pipeline para operaciones atómicas
      const pipeline = this.redis.pipeline();

      // Métricas diarias
      pipeline.hincrby(dailyKey, 'total_requests', 1);
      pipeline.hincrby(dailyKey, `status_${metrics.statusCode}`, 1);
      pipeline.hincrby(dailyKey, 'total_duration', metrics.duration);
      pipeline.expire(dailyKey, 30 * 24 * 3600); // 30 días

      // Métricas por hora
      pipeline.hincrby(hourlyKey, 'requests', 1);
      pipeline.hincrby(hourlyKey, 'duration', metrics.duration);
      pipeline.expire(hourlyKey, 7 * 24 * 3600); // 7 días

      // Métricas por endpoint
      pipeline.hincrby(endpointKey, 'requests', 1);
      pipeline.hincrby(endpointKey, 'total_duration', metrics.duration);
      pipeline.hincrby(endpointKey, `status_${metrics.statusCode}`, 1);
      pipeline.expire(endpointKey, 30 * 24 * 3600); // 30 días

      // Top IPs y User Agents
      if (metrics.ip) {
        pipeline.zincrby(`api_metrics:top_ips:${date}`, 1, metrics.ip);
        pipeline.expire(`api_metrics:top_ips:${date}`, 7 * 24 * 3600);
      }

      // API Key usage
      if (metrics.apiKey) {
        pipeline.hincrby(`api_metrics:apikey:${metrics.apiKey}:${date}`, 'requests', 1);
        pipeline.hincrby(`api_metrics:apikey:${metrics.apiKey}:${date}`, 'duration', metrics.duration);
        pipeline.expire(`api_metrics:apikey:${metrics.apiKey}:${date}`, 30 * 24 * 3600);
      }

      await pipeline.exec();

    } catch (error) {
      console.error('Error recording API metrics:', error);
    }
  }

  // Obtener métricas agregadas
  async getMetrics(period = 'daily', date = null) {
    date = date || new Date().toISOString().slice(0, 10);

    try {
      const key = `api_metrics:${period}:${date}`;
      const metrics = await this.redis.hgetall(key);

      if (Object.keys(metrics).length === 0) {
        return null;
      }

      // Convertir strings a números
      const processedMetrics = {};
      for (const [field, value] of Object.entries(metrics)) {
        processedMetrics[field] = parseInt(value) || 0;
      }

      // Calcular métricas derivadas
      const totalRequests = processedMetrics.total_requests || 0;
      const totalDuration = processedMetrics.total_duration || 0;

      return {
        date,
        period,
        totalRequests,
        averageResponseTime: totalRequests > 0 ? Math.round(totalDuration / totalRequests) : 0,
        statusCodeDistribution: {
          success: (processedMetrics.status_200 || 0) + (processedMetrics.status_201 || 0),
          clientError: Object.keys(processedMetrics)
            .filter(key => key.startsWith('status_4'))
            .reduce((sum, key) => sum + processedMetrics[key], 0),
          serverError: Object.keys(processedMetrics)
            .filter(key => key.startsWith('status_5'))
            .reduce((sum, key) => sum + processedMetrics[key], 0)
        },
        raw: processedMetrics
      };

    } catch (error) {
      console.error('Error retrieving API metrics:', error);
      return null;
    }
  }

  // Endpoint para métricas de dashboard
  async getDashboardMetrics() {
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    const [todayMetrics, yesterdayMetrics] = await Promise.all([
      this.getMetrics('daily', today),
      this.getMetrics('daily', yesterday)
    ]);

    return {
      today: todayMetrics || { totalRequests: 0, averageResponseTime: 0 },
      yesterday: yesterdayMetrics || { totalRequests: 0, averageResponseTime: 0 },
      growth: {
        requests: todayMetrics && yesterdayMetrics ?
          ((todayMetrics.totalRequests - yesterdayMetrics.totalRequests) / yesterdayMetrics.totalRequests * 100) : 0,
        responseTime: todayMetrics && yesterdayMetrics ?
          ((todayMetrics.averageResponseTime - yesterdayMetrics.averageResponseTime) / yesterdayMetrics.averageResponseTime * 100) : 0
      }
    };
  }
}

const apiMonitor = new APIMonitor();

module.exports = {
  APIMonitor,
  apiMonitor
};
```

### **Paso 5: Integración y Testing (5 minutos)**

#### **5.1 Integrar todos los middlewares en las rutas**

```javascript
// routes/api-secure.js - Ejemplo de rutas con security completa
const express = require('express');
const router = express.Router();

// Security middlewares
const {
  authenticateApiKey,
  requireScope,
  apiKeyRateLimit,
} = require('../middleware/api-key-auth');
const {
  createDynamicRateLimit,
} = require('../middleware/advanced-rate-limiting');
const { circuitBreakers } = require('../middleware/circuit-breaker');
const { apiMonitor } = require('../middleware/api-monitoring');

// Aplicar middlewares en orden
router.use(apiMonitor.trackRequest());
router.use(authenticateApiKey);
router.use(createDynamicRateLimit());
router.use(apiKeyRateLimit());

// Productos endpoints con security completa
router.get(
  '/productos',
  requireScope('read:productos'),
  circuitBreakers.database.middleware(),
  async (req, res) => {
    try {
      // Lógica para obtener productos
      const productos = await Producto.find({}).limit(50);

      res.json({
        success: true,
        data: productos,
        meta: {
          apiKey: req.apiKey?.name,
          tier: req.apiKey?.tier,
          rateLimit: {
            remaining: res.get('X-RateLimit-Remaining'),
            reset: res.get('X-RateLimit-Reset'),
          },
        },
      });
    } catch (error) {
      console.error('Error fetching productos:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to fetch productos',
      });
    }
  }
);

router.post(
  '/productos',
  requireScope('write:productos'),
  circuitBreakers.database.middleware(),
  async (req, res) => {
    try {
      // Validación y creación de producto
      const producto = new Producto(req.body);
      await producto.save();

      res.status(201).json({
        success: true,
        data: producto,
        meta: {
          apiKey: req.apiKey?.name,
        },
      });
    } catch (error) {
      console.error('Error creating producto:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to create producto',
      });
    }
  }
);

// Dashboard de métricas (solo admin)
router.get('/metrics', requireScope('admin:all'), async (req, res) => {
  try {
    const metrics = await apiMonitor.getDashboardMetrics();

    res.json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch metrics',
    });
  }
});

module.exports = router;
```

---

## ✅ Criterios de Validación

### **API Key Management**

- ✅ API keys generadas de forma segura
- ✅ Keys hasheadas en base de datos
- ✅ Scopes y permisos funcionando
- ✅ Rate limiting por API key tier
- ✅ Restricciones de IP y origen

### **Rate Limiting & Throttling**

- ✅ Rate limiting dinámico por usuario/tier
- ✅ Redis store para rate limiting distribuido
- ✅ Throttling antes de rate limiting
- ✅ Circuit breakers protegiendo servicios
- ✅ Headers informativos en responses

### **Monitoring & Analytics**

- ✅ Métricas de API en tiempo real
- ✅ Tracking de usage por API key
- ✅ Dashboard de métricas funcionando
- ✅ Alertas de circuit breaker
- ✅ Logs de security events

---

## 🧪 Pruebas de Validación

### **1. Test API key authentication**

```bash
# Test con API key válida
curl -H "X-API-Key: tk_abcd1234.xyz789..." http://localhost:3001/api/productos

# Test sin API key
curl http://localhost:3001/api/productos

# Test con API key inválida
curl -H "X-API-Key: invalid-key" http://localhost:3001/api/productos
```

### **2. Test rate limiting**

```bash
# Multiple requests para trigger rate limit
for i in {1..20}; do
  curl -H "X-API-Key: your-api-key" http://localhost:3001/api/productos
done
```

### **3. Test circuit breaker**

```bash
# Simular failures para activar circuit breaker
# (requiere endpoint que falle intencionalmente)
```

---

## 📚 Recursos Adicionales

### **API Security Best Practices**

- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [API Rate Limiting Patterns](https://nordicapis.com/everything-you-need-to-know-about-api-rate-limiting/)
- [Circuit Breaker Pattern](https://martinfowler.com/bliki/CircuitBreaker.html)

### **Tools & Libraries**

- [Express Rate Limit](https://github.com/nfriedly/express-rate-limit)
- [Redis Rate Limiting](https://redis.io/commands/incr#pattern-rate-limiter)

---

## 🎯 Entregables

1. **API Key System:** Sistema completo de generación y gestión
2. **Rate Limiting:** Configuración granular por tier y endpoint
3. **Circuit Breakers:** Protección contra overload de servicios
4. **Monitoring Dashboard:** Métricas de API en tiempo real
5. **Security Middleware:** Stack completo de security middlewares
6. **Testing Suite:** Tests para todas las funcionalidades de security

---

**¡API Security completada! Las APIs ahora tienen protección enterprise-level contra abuse y overload.**
