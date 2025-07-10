# 🔧 Ejercicio 6: Backend Performance Optimization

## 🎯 Objetivo
Optimizar el rendimiento del backend mediante database query optimization, API response compression, CDN configuration, y técnicas avanzadas de performance tuning para APIs Express.js.

## ⏱️ Duración
45 minutos

## 🔧 Dificultad
⭐⭐⭐ (Intermedio-Avanzado)

## 📋 Prerrequisitos
- Express.js intermedio
- MongoDB/PostgreSQL
- Conceptos de CDN y compresión
- Performance monitoring

---

## 🚀 Instrucciones

### Paso 1: Database Query Optimization (15 minutos)

```javascript
// models/optimizedProduct.js - MongoDB con Mongoose optimizado
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true, // Índice para búsquedas rápidas
    text: true // Full-text search
  },
  description: {
    type: String,
    text: true
  },
  price: {
    type: Number,
    required: true,
    index: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
    index: true // Índice para joins rápidos
  },
  tags: [{
    type: String,
    index: true
  }],
  stock: {
    type: Number,
    default: 0,
    index: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'discontinued'],
    default: 'active',
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  // Optimizaciones de schema
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      // Remover campos sensibles en respuesta
      delete ret.__v;
      return ret;
    }
  }
});

// Índices compuestos para consultas complejas
productSchema.index({ category: 1, status: 1, price: 1 });
productSchema.index({ createdAt: -1, status: 1 });
productSchema.index({ name: 'text', description: 'text' }, {
  weights: { name: 10, description: 5 }
});

// Middleware para actualizar updatedAt
productSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Métodos estáticos optimizados
productSchema.statics.findWithPagination = function(query, options = {}) {
  const {
    page = 1,
    limit = 10,
    sort = { createdAt: -1 },
    populate = []
  } = options;

  const skip = (page - 1) * limit;

  // Pipeline de agregación optimizada
  const pipeline = [
    { $match: query },
    { $sort: sort },
    {
      $facet: {
        data: [
          { $skip: skip },
          { $limit: parseInt(limit) }
        ],
        count: [
          { $count: "total" }
        ]
      }
    }
  ];

  return this.aggregate(pipeline);
};

productSchema.statics.findPopulated = function(query, populateFields = ['category']) {
  return this.find(query)
    .populate(populateFields.map(field => ({
      path: field,
      select: 'name description' // Solo campos necesarios
    })))
    .lean(); // Retornar objetos JavaScript simples
};

// Virtual para URL de imagen optimizada
productSchema.virtual('imageUrl').get(function() {
  return this.image ? `/api/images/optimized/${this.image}` : null;
});

module.exports = mongoose.model('Product', productSchema);
```

```javascript
// controllers/optimizedProductController.js
const Product = require('../models/optimizedProduct');
const Redis = require('redis');
const client = Redis.createClient();

class OptimizedProductController {
  // Cache de Redis para consultas frecuentes
  async getProducts(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        category,
        minPrice,
        maxPrice,
        search,
        sort = 'createdAt',
        order = 'desc'
      } = req.query;

      // Generar cache key basado en parámetros
      const cacheKey = `products:${JSON.stringify(req.query)}`;
      
      // Intentar obtener de cache primero
      const cached = await client.get(cacheKey);
      if (cached) {
        return res.json({
          ...JSON.parse(cached),
          fromCache: true
        });
      }

      // Construir query optimizada
      const query = { status: 'active' };
      
      if (category) query.category = category;
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = parseFloat(minPrice);
        if (maxPrice) query.price.$lte = parseFloat(maxPrice);
      }
      if (search) {
        query.$text = { $search: search };
      }

      const sortObj = { [sort]: order === 'desc' ? -1 : 1 };

      // Usar método optimizado con agregación
      const [result] = await Product.findWithPagination(query, {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: sortObj
      });

      const products = result.data;
      const total = result.count[0]?.total || 0;

      // Populate solo si es necesario
      const populatedProducts = await Product.populate(products, {
        path: 'category',
        select: 'name slug'
      });

      const response = {
        products: populatedProducts,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      };

      // Cachear resultado por 5 minutos
      await client.setex(cacheKey, 300, JSON.stringify(response));

      res.json(response);
    } catch (error) {
      console.error('Error getting products:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  // Búsqueda optimizada con full-text search
  async searchProducts(req, res) {
    try {
      const { q, limit = 10 } = req.query;
      
      if (!q || q.length < 2) {
        return res.status(400).json({ error: 'Query mínimo de 2 caracteres' });
      }

      const cacheKey = `search:${q}:${limit}`;
      const cached = await client.get(cacheKey);
      
      if (cached) {
        return res.json(JSON.parse(cached));
      }

      // Aggregation pipeline optimizada para búsqueda
      const pipeline = [
        {
          $match: {
            $text: { $search: q },
            status: 'active'
          }
        },
        {
          $addFields: {
            score: { $meta: "textScore" }
          }
        },
        {
          $sort: { score: { $meta: "textScore" } }
        },
        {
          $limit: parseInt(limit)
        },
        {
          $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: '_id',
            as: 'category',
            pipeline: [{ $project: { name: 1, slug: 1 } }]
          }
        },
        {
          $unwind: '$category'
        },
        {
          $project: {
            name: 1,
            description: 1,
            price: 1,
            category: 1,
            imageUrl: 1,
            score: 1
          }
        }
      ];

      const products = await Product.aggregate(pipeline);

      const response = { 
        query: q,
        results: products,
        count: products.length
      };

      // Cache por 2 minutos
      await client.setex(cacheKey, 120, JSON.stringify(response));

      res.json(response);
    } catch (error) {
      console.error('Error searching products:', error);
      res.status(500).json({ error: 'Error en búsqueda' });
    }
  }

  // Invalidar cache relacionado
  async invalidateProductCache(productId) {
    const pattern = 'products:*';
    const keys = await client.keys(pattern);
    
    if (keys.length > 0) {
      await client.del(keys);
    }
    
    // También invalidar cache de búsqueda
    const searchKeys = await client.keys('search:*');
    if (searchKeys.length > 0) {
      await client.del(searchKeys);
    }
  }

  // Crear producto con invalidación de cache
  async createProduct(req, res) {
    try {
      const product = new Product(req.body);
      await product.save();
      
      // Invalidar caches relevantes
      await this.invalidateProductCache();
      
      res.status(201).json(product);
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new OptimizedProductController();
```

### Paso 2: API Response Compression y Middleware (10 minutos)

```javascript
// middleware/performanceMiddleware.js
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');

// Compression middleware optimizado
const compressionMiddleware = compression({
  level: 6, // Balance entre speed y compression ratio
  threshold: 1024, // Solo comprimir responses > 1KB
  filter: (req, res) => {
    // No comprimir si el cliente no lo soporta
    if (req.headers['x-no-compression']) {
      return false;
    }
    
    // No comprimir imágenes o archivos ya comprimidos
    const contentType = res.getHeader('Content-Type');
    if (contentType && (
      contentType.includes('image/') ||
      contentType.includes('video/') ||
      contentType.includes('application/zip') ||
      contentType.includes('application/gzip')
    )) {
      return false;
    }
    
    return compression.filter(req, res);
  }
});

// Rate limiting por endpoints
const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: { error: message },
    standardHeaders: true,
    legacyHeaders: false,
    // Skip successful requests para APIs internas
    skip: (req, res) => res.statusCode < 400,
    // Key generator personalizado
    keyGenerator: (req) => {
      return req.ip + ':' + req.path;
    }
  });
};

// Rate limiters específicos
const apiLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutos
  100, // 100 requests por IP
  'Demasiadas requests, intenta más tarde'
);

const authLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutos
  5, // 5 intentos de login por IP
  'Demasiados intentos de login'
);

const searchLimiter = createRateLimiter(
  60 * 1000, // 1 minuto
  30, // 30 búsquedas por minuto
  'Demasiadas búsquedas, intenta más tarde'
);

// Response time middleware
const responseTimeMiddleware = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    res.setHeader('X-Response-Time', `${duration}ms`);
    
    // Log slow requests
    if (duration > 1000) {
      console.warn(`Slow request: ${req.method} ${req.path} - ${duration}ms`);
    }
  });
  
  next();
};

// Cache headers middleware
const cacheMiddleware = (maxAge = 3600, isPrivate = false) => {
  return (req, res, next) => {
    const cacheControl = isPrivate 
      ? `private, max-age=${maxAge}` 
      : `public, max-age=${maxAge}`;
    
    res.setHeader('Cache-Control', cacheControl);
    res.setHeader('ETag', generateETag(req.originalUrl));
    res.setHeader('Vary', 'Accept-Encoding');
    
    next();
  };
};

// ETag generation
const generateETag = (url) => {
  const crypto = require('crypto');
  return `"${crypto.createHash('md5').update(url + Date.now()).digest('hex')}"`;
};

// Security headers optimizados
const securityMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  },
  crossOriginEmbedderPolicy: false
});

// CORS optimizado
const corsMiddleware = cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://mi-dominio.com', 'https://www.mi-dominio.com']
    : true,
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
});

module.exports = {
  compressionMiddleware,
  apiLimiter,
  authLimiter,
  searchLimiter,
  responseTimeMiddleware,
  cacheMiddleware,
  securityMiddleware,
  corsMiddleware
};
```

### Paso 3: CDN Configuration y Asset Optimization (10 minutos)

```javascript
// services/cdnService.js
const AWS = require('aws-sdk');
const sharp = require('sharp');
const path = require('path');

class CDNService {
  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION
    });
    
    this.cloudfront = new AWS.CloudFront({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    });
    
    this.bucketName = process.env.AWS_S3_BUCKET;
    this.cdnDomain = process.env.CDN_DOMAIN;
  }

  // Optimizar y subir imagen a CDN
  async uploadOptimizedImage(file, folder = 'images') {
    try {
      const filename = `${Date.now()}-${file.originalname}`;
      const key = `${folder}/${filename}`;

      // Generar múltiples tamaños
      const sizes = [
        { width: 150, suffix: '_thumb' },
        { width: 300, suffix: '_small' },
        { width: 600, suffix: '_medium' },
        { width: 1200, suffix: '_large' },
        { width: 1920, suffix: '_xlarge' }
      ];

      const uploads = [];

      // Imagen original optimizada
      const originalOptimized = await sharp(file.buffer)
        .jpeg({ quality: 85, progressive: true })
        .toBuffer();

      uploads.push(this.uploadToS3(key, originalOptimized, 'image/jpeg'));

      // Generar WebP para navegadores modernos
      for (const size of sizes) {
        const webpBuffer = await sharp(file.buffer)
          .resize(size.width, null, { 
            withoutEnlargement: true,
            fit: 'inside'
          })
          .webp({ quality: 80 })
          .toBuffer();

        const webpKey = key.replace(/\.(jpg|jpeg|png)$/i, `${size.suffix}.webp`);
        uploads.push(this.uploadToS3(webpKey, webpBuffer, 'image/webp'));

        // También JPEG optimizado para fallback
        const jpegBuffer = await sharp(file.buffer)
          .resize(size.width, null, { 
            withoutEnlargement: true,
            fit: 'inside'
          })
          .jpeg({ quality: 85, progressive: true })
          .toBuffer();

        const jpegKey = key.replace(/\.(jpg|jpeg|png)$/i, `${size.suffix}.jpg`);
        uploads.push(this.uploadToS3(jpegKey, jpegBuffer, 'image/jpeg'));
      }

      await Promise.all(uploads);

      return {
        original: `${this.cdnDomain}/${key}`,
        sizes: sizes.reduce((acc, size) => {
          const baseName = key.replace(/\.(jpg|jpeg|png)$/i, '');
          acc[size.suffix.replace('_', '')] = {
            webp: `${this.cdnDomain}/${baseName}${size.suffix}.webp`,
            jpeg: `${this.cdnDomain}/${baseName}${size.suffix}.jpg`
          };
          return acc;
        }, {})
      };
    } catch (error) {
      console.error('Error uploading optimized image:', error);
      throw error;
    }
  }

  // Subir archivo a S3
  async uploadToS3(key, buffer, contentType) {
    const params = {
      Bucket: this.bucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000', // 1 año
      ACL: 'public-read'
    };

    return this.s3.upload(params).promise();
  }

  // Invalidar cache de CloudFront
  async invalidateCache(paths) {
    const params = {
      DistributionId: process.env.CLOUDFRONT_DISTRIBUTION_ID,
      InvalidationBatch: {
        CallerReference: Date.now().toString(),
        Paths: {
          Quantity: paths.length,
          Items: paths
        }
      }
    };

    return this.cloudfront.createInvalidation(params).promise();
  }

  // Generar URLs firmadas para contenido privado
  generateSignedUrl(key, expiresIn = 3600) {
    const params = {
      Bucket: this.bucketName,
      Key: key,
      Expires: expiresIn
    };

    return this.s3.getSignedUrl('getObject', params);
  }
}

// Middleware para servir imágenes optimizadas
const imageOptimizationMiddleware = (req, res, next) => {
  const { path: imagePath } = req.params;
  const acceptHeader = req.headers.accept || '';
  
  // Si el cliente soporta WebP, servir WebP
  if (acceptHeader.includes('image/webp')) {
    const webpPath = imagePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    req.url = req.url.replace(imagePath, webpPath);
  }
  
  // Cache headers para imágenes
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  res.setHeader('Vary', 'Accept');
  
  next();
};

module.exports = { CDNService, imageOptimizationMiddleware };
```

### Paso 4: Performance Monitoring y Métricas (10 minutos)

```javascript
// middleware/performanceMonitoring.js
const client = require('prom-client');

// Crear registry de métricas
const register = new client.Registry();

// Métricas personalizadas
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10]
});

const httpRequestTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status']
});

const activeConnections = new client.Gauge({
  name: 'http_active_connections',
  help: 'Number of active HTTP connections'
});

const databaseQueryDuration = new client.Histogram({
  name: 'database_query_duration_seconds',
  help: 'Duration of database queries in seconds',
  labelNames: ['operation', 'collection'],
  buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2]
});

// Registrar métricas
register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestTotal);
register.registerMetric(activeConnections);
register.registerMetric(databaseQueryDuration);

// Métricas por defecto del sistema
client.collectDefaultMetrics({ register });

// Middleware de monitoring
const performanceMonitoringMiddleware = (req, res, next) => {
  const start = Date.now();
  
  // Incrementar conexiones activas
  activeConnections.inc();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route ? req.route.path : req.path;
    const labels = {
      method: req.method,
      route: route,
      status: res.statusCode
    };
    
    // Registrar métricas
    httpRequestDuration.observe(labels, duration);
    httpRequestTotal.inc(labels);
    activeConnections.dec();
    
    // Log requests lentos
    if (duration > 1) {
      console.warn(`Slow request: ${req.method} ${req.path} - ${duration}s`);
    }
  });
  
  next();
};

// Database monitoring wrapper
const monitorDatabaseQuery = (operation, collection) => {
  return async (query) => {
    const start = Date.now();
    
    try {
      const result = await query;
      const duration = (Date.now() - start) / 1000;
      
      databaseQueryDuration.observe({
        operation,
        collection
      }, duration);
      
      return result;
    } catch (error) {
      const duration = (Date.now() - start) / 1000;
      
      databaseQueryDuration.observe({
        operation: `${operation}_error`,
        collection
      }, duration);
      
      throw error;
    }
  };
};

// Endpoint para métricas
const metricsEndpoint = async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
};

// Health check endpoint
const healthCheckEndpoint = (req, res) => {
  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version || '1.0.0'
  };
  
  res.json(healthData);
};

// Performance report
const getPerformanceReport = async () => {
  const metrics = await register.getMetricsAsJSON();
  
  return {
    timestamp: new Date().toISOString(),
    metrics: metrics.reduce((acc, metric) => {
      acc[metric.name] = {
        help: metric.help,
        type: metric.type,
        values: metric.values
      };
      return acc;
    }, {}),
    system: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage()
    }
  };
};

module.exports = {
  performanceMonitoringMiddleware,
  monitorDatabaseQuery,
  metricsEndpoint,
  healthCheckEndpoint,
  getPerformanceReport,
  register
};
```

```javascript
// app.js - Aplicar todos los middlewares
const express = require('express');
const {
  compressionMiddleware,
  apiLimiter,
  responseTimeMiddleware,
  cacheMiddleware,
  securityMiddleware,
  corsMiddleware
} = require('./middleware/performanceMiddleware');

const {
  performanceMonitoringMiddleware,
  metricsEndpoint,
  healthCheckEndpoint
} = require('./middleware/performanceMonitoring');

const app = express();

// Aplicar middlewares en orden óptimo
app.use(securityMiddleware);
app.use(corsMiddleware);
app.use(compressionMiddleware);
app.use(responseTimeMiddleware);
app.use(performanceMonitoringMiddleware);

// Rate limiting
app.use('/api/', apiLimiter);

// Health checks
app.get('/health', healthCheckEndpoint);
app.get('/metrics', metricsEndpoint);

// Cache para assets estáticos
app.use('/static', cacheMiddleware(31536000), express.static('public'));

// API routes con cache específico
app.use('/api/products', cacheMiddleware(300), require('./routes/products'));
app.use('/api/categories', cacheMiddleware(3600), require('./routes/categories'));

// Error handling
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    requestId: req.id 
  });
});

module.exports = app;
```

---

## 🧪 Pruebas y Validación

### Comandos de Testing

```bash
# Load testing con Artillery
npx artillery quick --count 10 --num 100 http://localhost:3000/api/products

# Monitoring de métricas
curl http://localhost:3000/metrics

# Health check
curl http://localhost:3000/health

# Testing de compresión
curl -H "Accept-Encoding: gzip" -I http://localhost:3000/api/products
```

### Métricas Objetivo

- **Response time:** <200ms (95th percentile)
- **Throughput:** >1000 requests/second
- **Database queries:** <50ms average
- **Cache hit ratio:** >80%
- **Compression ratio:** >60%

---

## ✅ Criterios de Evaluación

### **Técnico (70 puntos)**
- [ ] Database optimization implementada (20 pts)
- [ ] API compression configurada (15 pts)
- [ ] CDN integration funcional (15 pts)
- [ ] Performance monitoring (20 pts)

### **Performance (20 puntos)**
- [ ] Response time mejorado ≥50% (10 pts)
- [ ] Throughput incrementado ≥40% (10 pts)

### **Monitoring y Documentación (10 puntos)**
- [ ] Métricas configuradas (5 pts)
- [ ] Documentación de optimizaciones (5 pts)

---

## 📊 Entregables

1. **Backend optimizado** con todas las mejoras
2. **Database queries** optimizadas con índices
3. **CDN service** configurado y funcional
4. **Performance monitoring** implementado
5. **Load testing results** documentados

---

## 🎯 Desafío Extra

Implementar **connection pooling** y **database clustering**:

```javascript
// database/connectionPool.js
const mongoose = require('mongoose');

const connectWithPool = async () => {
  const options = {
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    bufferMaxEntries: 0, // Disable mongoose buffering
    bufferCommands: false, // Disable mongoose buffering
    maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
  };

  await mongoose.connect(process.env.MONGODB_URI, options);
};
```

---

## 🔗 Recursos Adicionales

- [Express.js Performance](https://expressjs.com/en/advanced/best-practice-performance.html)
- [MongoDB Performance](https://docs.mongodb.com/manual/administration/analyzing-mongodb-performance/)
- [Node.js Performance Monitoring](https://nodejs.org/en/docs/guides/simple-profiling/)
