# 🛡️ Ejercicio 3: Input Validation & Sanitization

## 📋 Información del Ejercicio

**Duración:** 45 minutos  
**Dificultad:** ⭐⭐⭐  
**Prerequisitos:** Express.js API funcionando  
**Objetivos:** Implementar validación y sanitización robusta contra injection attacks

---

## 🎯 Objetivos de Aprendizaje

Al completar este ejercicio, el estudiante será capaz de:

- Implementar input validation comprehensiva con Joi
- Configurar sanitización de datos de entrada
- Prevenir SQL injection y NoSQL injection
- Proteger contra XSS attacks
- Implementar rate limiting y data size limits
- Crear middleware de validación reutilizable

---

## 📚 Conceptos Clave

### **Input Validation**

- **Server-side validation:** Validación en el servidor (obligatoria)
- **Client-side validation:** Validación en el cliente (UX)
- **Sanitization:** Limpieza de datos de entrada
- **Whitelisting:** Permitir solo valores conocidos
- **Blacklisting:** Rechazar valores conocidos como maliciosos

### **Common Injection Attacks**

- **SQL Injection:** Manipulación de queries SQL
- **NoSQL Injection:** Manipulación de queries NoSQL
- **XSS (Cross-Site Scripting):** Inyección de scripts maliciosos
- **Command Injection:** Ejecución de comandos del sistema
- **LDAP Injection:** Manipulación de queries LDAP

---

## 🛠️ Tecnologías Utilizadas

- **joi** - Schema validation
- **express-validator** - Express middleware validation
- **dompurify** - HTML sanitization
- **express-rate-limit** - Rate limiting
- **express-mongo-sanitize** - MongoDB injection prevention
- **helmet** - Security headers

---

## 📝 Instrucciones Paso a Paso

### **Paso 1: Instalación y Configuración (5 minutos)**

```bash
# Instalar dependencias de validación y sanitización
pnpm install joi express-validator dompurify express-rate-limit express-mongo-sanitize helmet

# Instalar dependencias adicionales para testing
pnpm install -D supertest
```

### **Paso 2: Crear Middleware de Validación (15 minutos)**

#### **2.1 Configurar Joi Validation Schemas**

```javascript
// validation/schemas.js
const Joi = require('joi');

// Schema para registro de usuario
const userRegistrationSchema = Joi.object({
  nombre: Joi.string().alphanum().min(2).max(50).required().messages({
    'string.alphanum': 'El nombre solo puede contener caracteres alfanuméricos',
    'string.min': 'El nombre debe tener al menos 2 caracteres',
    'string.max': 'El nombre no puede exceder 50 caracteres',
    'any.required': 'El nombre es requerido',
  }),

  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'org', 'edu', 'gov'] },
    })
    .required()
    .messages({
      'string.email': 'Debe ser un email válido',
      'any.required': 'El email es requerido',
    }),

  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])'))
    .required()
    .messages({
      'string.min': 'La contraseña debe tener al menos 8 caracteres',
      'string.max': 'La contraseña no puede exceder 128 caracteres',
      'string.pattern.base':
        'La contraseña debe contener al menos: 1 minúscula, 1 mayúscula, 1 número y 1 símbolo especial',
      'any.required': 'La contraseña es requerida',
    }),

  telefono: Joi.string()
    .pattern(new RegExp('^[+]?[0-9]{10,15}$'))
    .optional()
    .messages({
      'string.pattern.base': 'El teléfono debe tener entre 10 y 15 dígitos',
    }),
});

// Schema para login
const userLoginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Debe ser un email válido',
    'any.required': 'El email es requerido',
  }),

  password: Joi.string().min(1).required().messages({
    'any.required': 'La contraseña es requerida',
  }),
});

// Schema para productos
const productSchema = Joi.object({
  nombre: Joi.string().min(2).max(100).required().messages({
    'string.min': 'El nombre del producto debe tener al menos 2 caracteres',
    'string.max': 'El nombre del producto no puede exceder 100 caracteres',
    'any.required': 'El nombre del producto es requerido',
  }),

  descripcion: Joi.string().max(1000).optional().allow('').messages({
    'string.max': 'La descripción no puede exceder 1000 caracteres',
  }),

  precio: Joi.number()
    .positive()
    .precision(2)
    .max(999999.99)
    .required()
    .messages({
      'number.positive': 'El precio debe ser un número positivo',
      'number.max': 'El precio no puede exceder $999,999.99',
      'any.required': 'El precio es requerido',
    }),

  categoria: Joi.string()
    .pattern(new RegExp('^[0-9a-fA-F]{24}$'))
    .required()
    .messages({
      'string.pattern.base': 'ID de categoría inválido',
      'any.required': 'La categoría es requerida',
    }),

  stock: Joi.number()
    .integer()
    .min(0)
    .max(9999)
    .optional()
    .default(0)
    .messages({
      'number.integer': 'El stock debe ser un número entero',
      'number.min': 'El stock no puede ser negativo',
      'number.max': 'El stock no puede exceder 9999',
    }),
});

// Schema para filtros de búsqueda
const searchFiltersSchema = Joi.object({
  page: Joi.number().integer().min(1).max(1000).default(1),

  limit: Joi.number().integer().min(1).max(100).default(10),

  sortBy: Joi.string()
    .valid('nombre', 'precio', 'createdAt', 'stock')
    .default('createdAt'),

  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),

  search: Joi.string().max(100).optional().allow(''),

  categoria: Joi.string().pattern(new RegExp('^[0-9a-fA-F]{24}$')).optional(),

  minPrecio: Joi.number().positive().optional(),

  maxPrecio: Joi.number().positive().optional(),
});

module.exports = {
  userRegistrationSchema,
  userLoginSchema,
  productSchema,
  searchFiltersSchema,
};
```

#### **2.2 Crear Middleware de Validación**

```javascript
// middleware/validation.js
const Joi = require('joi');
const mongoSanitize = require('express-mongo-sanitize');
const DOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

// Configurar DOMPurify para Node.js
const window = new JSDOM('').window;
const purify = DOMPurify(window);

// Middleware general de validación
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false, // Mostrar todos los errores
      stripUnknown: true, // Remover campos no definidos en el schema
      allowUnknown: false, // No permitir campos no definidos
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context.value,
      }));

      return res.status(400).json({
        error: 'Errores de validación',
        details: errors,
      });
    }

    // Reemplazar req[property] con valores validados y sanitizados
    req[property] = value;
    next();
  };
};

// Middleware de sanitización
const sanitize = (req, res, next) => {
  // Sanitizar MongoDB injection
  mongoSanitize.sanitize(req.body, {
    replaceWith: '_',
  });

  mongoSanitize.sanitize(req.query, {
    replaceWith: '_',
  });

  mongoSanitize.sanitize(req.params, {
    replaceWith: '_',
  });

  // Sanitizar HTML en campos de texto
  if (req.body) {
    sanitizeHtmlFields(req.body);
  }

  if (req.query) {
    sanitizeHtmlFields(req.query);
  }

  next();
};

// Función para sanitizar campos HTML
const sanitizeHtmlFields = obj => {
  const textFields = [
    'nombre',
    'descripcion',
    'search',
    'comentario',
    'mensaje',
  ];

  for (const field of textFields) {
    if (obj[field] && typeof obj[field] === 'string') {
      // Sanitizar HTML manteniendo solo texto plano
      obj[field] = purify.sanitize(obj[field], {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
      });

      // Escapar caracteres especiales adicionales
      obj[field] = obj[field]
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
    }
  }
};

// Middleware para validar ObjectId de MongoDB
const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;

    if (!objectIdPattern.test(id)) {
      return res.status(400).json({
        error: `ID inválido: ${paramName}`,
        details: 'El ID debe ser un ObjectId válido de MongoDB',
      });
    }

    next();
  };
};

// Middleware para limitar tamaño de archivos
const limitFileSize = (maxSize = 5 * 1024 * 1024) => {
  // 5MB por defecto
  return (req, res, next) => {
    if (
      req.headers['content-length'] &&
      parseInt(req.headers['content-length']) > maxSize
    ) {
      return res.status(413).json({
        error: 'Archivo demasiado grande',
        details: `El tamaño máximo permitido es ${maxSize / (1024 * 1024)}MB`,
      });
    }
    next();
  };
};

// Middleware para validar tipos de archivo
const validateFileType = (
  allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
) => {
  return (req, res, next) => {
    if (req.file && !allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        error: 'Tipo de archivo no permitido',
        details: `Tipos permitidos: ${allowedTypes.join(', ')}`,
      });
    }
    next();
  };
};

// Middleware para validar headers requeridos
const validateHeaders = (requiredHeaders = []) => {
  return (req, res, next) => {
    const missing = requiredHeaders.filter(
      header => !req.headers[header.toLowerCase()]
    );

    if (missing.length > 0) {
      return res.status(400).json({
        error: 'Headers requeridos faltantes',
        details: `Headers faltantes: ${missing.join(', ')}`,
      });
    }

    next();
  };
};

module.exports = {
  validate,
  sanitize,
  validateObjectId,
  limitFileSize,
  validateFileType,
  validateHeaders,
};
```

### **Paso 3: Configurar Rate Limiting y Protecciones (10 minutos)**

#### **3.1 Configurar Rate Limiting**

```javascript
// middleware/rateLimiting.js
const rateLimit = require('express-rate-limit');

// Rate limiting general
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo 100 requests por ventana
  message: {
    error: 'Demasiadas solicitudes',
    details:
      'Has excedido el límite de solicitudes. Intenta de nuevo en 15 minutos.',
    retryAfter: 15 * 60,
  },
  standardHeaders: true, // Enviar info en headers `RateLimit-*`
  legacyHeaders: false, // Deshabilitar headers `X-RateLimit-*`

  // Función personalizada para generar key
  keyGenerator: req => {
    return req.ip + ':' + (req.user?.id || 'anonymous');
  },

  // Skip successful requests para usuarios autenticados
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
});

// Rate limiting estricto para login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Máximo 5 intentos de login
  message: {
    error: 'Demasiados intentos de login',
    details:
      'Has excedido el límite de intentos de login. Intenta de nuevo en 15 minutos.',
    retryAfter: 15 * 60,
  },
  skipSuccessfulRequests: true, // No contar logins exitosos
});

// Rate limiting para registro
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // Máximo 3 registros por hora por IP
  message: {
    error: 'Demasiados registros',
    details: 'Has excedido el límite de registros por hora.',
    retryAfter: 60 * 60,
  },
});

// Rate limiting para API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 1000, // Más permisivo para API general
  message: {
    error: 'Límite de API excedido',
    details: 'Has excedido el límite de solicitudes de API.',
    retryAfter: 15 * 60,
  },
});

// Rate limiting para búsquedas
const searchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 20, // Máximo 20 búsquedas por minuto
  message: {
    error: 'Demasiadas búsquedas',
    details: 'Has excedido el límite de búsquedas por minuto.',
    retryAfter: 60,
  },
});

module.exports = {
  generalLimiter,
  loginLimiter,
  registerLimiter,
  apiLimiter,
  searchLimiter,
};
```

#### **3.2 Configurar Security Headers**

```javascript
// middleware/security.js
const helmet = require('helmet');

// Configuración básica de seguridad
const basicSecurity = helmet({
  // Content Security Policy
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https:'],
      scriptSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },

  // Strict Transport Security
  hsts: {
    maxAge: 31536000, // 1 año
    includeSubDomains: true,
    preload: true,
  },

  // X-Frame-Options
  frameguard: {
    action: 'deny',
  },

  // X-Content-Type-Options
  noSniff: true,

  // Referrer Policy
  referrerPolicy: {
    policy: 'same-origin',
  },
});

// Middleware personalizado para headers adicionales
const additionalSecurityHeaders = (req, res, next) => {
  // Deshabilitar X-Powered-By header
  res.removeHeader('X-Powered-By');

  // Headers personalizados de seguridad
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );
  res.setHeader('Referrer-Policy', 'same-origin');
  res.setHeader(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=()'
  );

  next();
};

module.exports = {
  basicSecurity,
  additionalSecurityHeaders,
};
```

### **Paso 4: Implementar Validaciones en Rutas (10 minutos)**

#### **4.1 Aplicar validaciones en rutas de usuario**

```javascript
// routes/auth.js - Rutas de autenticación con validación
const express = require('express');
const router = express.Router();
const {
  userRegistrationSchema,
  userLoginSchema,
} = require('../validation/schemas');
const { validate, sanitize } = require('../middleware/validation');
const { loginLimiter, registerLimiter } = require('../middleware/rateLimiting');

// POST /api/auth/register - Registro con validación completa
router.post(
  '/register',
  registerLimiter,
  sanitize,
  validate(userRegistrationSchema),
  async (req, res) => {
    try {
      const { nombre, email, password, telefono } = req.body;

      // Verificar si el usuario ya existe
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({
          error: 'Usuario ya existe',
          details: 'Ya existe un usuario registrado con este email',
        });
      }

      // Crear nuevo usuario
      const user = new User({
        nombre,
        email,
        password, // Se hasheará automáticamente por el pre-save hook
        telefono,
      });

      await user.save();

      // Generar token JWT
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        message: 'Usuario registrado exitosamente',
        user: {
          id: user._id,
          nombre: user.nombre,
          email: user.email,
        },
        token,
      });
    } catch (error) {
      console.error('Error en registro:', error);

      // Manejar errores de duplicación de MongoDB
      if (error.code === 11000) {
        return res.status(409).json({
          error: 'Email ya registrado',
          details: 'Este email ya está en uso',
        });
      }

      res.status(500).json({
        error: 'Error interno del servidor',
      });
    }
  }
);

// POST /api/auth/login - Login con validación y rate limiting
router.post(
  '/login',
  loginLimiter,
  sanitize,
  validate(userLoginSchema),
  async (req, res) => {
    try {
      const { email, password } = req.body;

      // Buscar usuario y incluir password para comparación
      const user = await User.findOne({ email }).select('+password');

      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({
          error: 'Credenciales inválidas',
          details: 'Email o contraseña incorrectos',
        });
      }

      // Verificar si el usuario está activo
      if (!user.activo) {
        return res.status(403).json({
          error: 'Cuenta desactivada',
          details: 'Tu cuenta ha sido desactivada. Contacta al administrador.',
        });
      }

      // Verificar si requiere MFA
      if (user.mfaEnabled) {
        return res.json({
          requiresMFA: true,
          message: 'Se requiere autenticación de segundo factor',
          userId: user._id,
        });
      }

      // Login exitoso
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        message: 'Login exitoso',
        user: {
          id: user._id,
          nombre: user.nombre,
          email: user.email,
        },
        token,
      });
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
      });
    }
  }
);

module.exports = router;
```

#### **4.2 Aplicar validaciones en rutas de productos**

```javascript
// routes/productos.js - Productos con validación completa
const express = require('express');
const router = express.Router();
const { productSchema, searchFiltersSchema } = require('../validation/schemas');
const {
  validate,
  sanitize,
  validateObjectId,
} = require('../middleware/validation');
const { apiLimiter, searchLimiter } = require('../middleware/rateLimiting');
const { authenticateToken } = require('../middleware/auth');

// GET /api/productos - Búsqueda con validación de filtros
router.get(
  '/',
  searchLimiter,
  sanitize,
  validate(searchFiltersSchema, 'query'),
  async (req, res) => {
    try {
      const {
        page,
        limit,
        sortBy,
        sortOrder,
        search,
        categoria,
        minPrecio,
        maxPrecio,
      } = req.query;

      // Construir query de búsqueda
      const query = {};

      if (search) {
        query.$or = [
          { nombre: { $regex: search, $options: 'i' } },
          { descripcion: { $regex: search, $options: 'i' } },
        ];
      }

      if (categoria) {
        query.categoria = categoria;
      }

      if (minPrecio || maxPrecio) {
        query.precio = {};
        if (minPrecio) query.precio.$gte = minPrecio;
        if (maxPrecio) query.precio.$lte = maxPrecio;
      }

      // Ejecutar búsqueda con paginación
      const productos = await Producto.find(query)
        .populate('categoria', 'nombre')
        .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
        .limit(limit)
        .skip((page - 1) * limit);

      const total = await Producto.countDocuments(query);

      res.json({
        productos,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
        filters: {
          search,
          categoria,
          minPrecio,
          maxPrecio,
          sortBy,
          sortOrder,
        },
      });
    } catch (error) {
      console.error('Error en búsqueda de productos:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
      });
    }
  }
);

// POST /api/productos - Crear producto con validación completa
router.post(
  '/',
  apiLimiter,
  authenticateToken,
  sanitize,
  validate(productSchema),
  async (req, res) => {
    try {
      const { nombre, descripcion, precio, categoria, stock } = req.body;

      // Verificar que la categoría existe
      const categoriaExists = await Categoria.findById(categoria);
      if (!categoriaExists) {
        return res.status(400).json({
          error: 'Categoría inválida',
          details: 'La categoría especificada no existe',
        });
      }

      // Crear producto
      const producto = new Producto({
        nombre,
        descripcion,
        precio,
        categoria,
        stock,
        creadoPor: req.user.id,
      });

      await producto.save();
      await producto.populate('categoria', 'nombre');

      res.status(201).json({
        message: 'Producto creado exitosamente',
        producto,
      });
    } catch (error) {
      console.error('Error creando producto:', error);

      if (error.code === 11000) {
        return res.status(409).json({
          error: 'Producto duplicado',
          details: 'Ya existe un producto con este nombre',
        });
      }

      res.status(500).json({
        error: 'Error interno del servidor',
      });
    }
  }
);

// PUT /api/productos/:id - Actualizar producto
router.put(
  '/:id',
  apiLimiter,
  authenticateToken,
  validateObjectId('id'),
  sanitize,
  validate(productSchema),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, descripcion, precio, categoria, stock } = req.body;

      // Verificar que el producto existe
      const producto = await Producto.findById(id);
      if (!producto) {
        return res.status(404).json({
          error: 'Producto no encontrado',
        });
      }

      // Verificar que la categoría existe
      const categoriaExists = await Categoria.findById(categoria);
      if (!categoriaExists) {
        return res.status(400).json({
          error: 'Categoría inválida',
          details: 'La categoría especificada no existe',
        });
      }

      // Actualizar producto
      const productoActualizado = await Producto.findByIdAndUpdate(
        id,
        { nombre, descripcion, precio, categoria, stock },
        { new: true, runValidators: true }
      ).populate('categoria', 'nombre');

      res.json({
        message: 'Producto actualizado exitosamente',
        producto: productoActualizado,
      });
    } catch (error) {
      console.error('Error actualizando producto:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
      });
    }
  }
);

module.exports = router;
```

### **Paso 5: Testing de Validaciones (5 minutos)**

#### **5.1 Crear tests de validación**

```javascript
// tests/validation.test.js
const request = require('supertest');
const app = require('../app');

describe('Input Validation Tests', () => {
  describe('User Registration Validation', () => {
    test('should reject invalid email format', async () => {
      const response = await request(app).post('/api/auth/register').send({
        nombre: 'TestUser',
        email: 'invalid-email',
        password: 'ValidPass123!',
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Errores de validación');
      expect(response.body.details[0].field).toBe('email');
    });

    test('should reject weak password', async () => {
      const response = await request(app).post('/api/auth/register').send({
        nombre: 'TestUser',
        email: 'test@example.com',
        password: '123',
      });

      expect(response.status).toBe(400);
      expect(response.body.details[0].field).toBe('password');
    });

    test('should sanitize HTML in name field', async () => {
      const response = await request(app).post('/api/auth/register').send({
        nombre: '<script>alert("xss")</script>TestUser',
        email: 'test@example.com',
        password: 'ValidPass123!',
      });

      // Should not contain script tags in any error or success response
      expect(JSON.stringify(response.body)).not.toContain('<script>');
    });
  });

  describe('Product Validation', () => {
    test('should reject negative price', async () => {
      const response = await request(app)
        .post('/api/productos')
        .set('Authorization', 'Bearer valid-token')
        .send({
          nombre: 'Test Product',
          precio: -10,
          categoria: '507f1f77bcf86cd799439011',
        });

      expect(response.status).toBe(400);
      expect(response.body.details[0].field).toBe('precio');
    });

    test('should reject invalid ObjectId', async () => {
      const response = await request(app)
        .put('/api/productos/invalid-id')
        .set('Authorization', 'Bearer valid-token')
        .send({
          nombre: 'Test Product',
          precio: 10,
          categoria: '507f1f77bcf86cd799439011',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('ID inválido');
    });
  });

  describe('SQL/NoSQL Injection Prevention', () => {
    test('should sanitize MongoDB injection attempts', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: { $gt: '' },
          password: { $gt: '' },
        });

      expect(response.status).toBe(400);
      // The injection attempt should be sanitized and cause validation error
    });
  });
});
```

---

## ✅ Criterios de Validación

### **Input Validation Implementation**

- ✅ Joi schemas configurados para todos los endpoints
- ✅ Server-side validation funcionando
- ✅ Error messages informativos pero seguros
- ✅ Sanitización de HTML implementada
- ✅ MongoDB injection prevention activa

### **Security Measures**

- ✅ Rate limiting configurado por endpoint
- ✅ Security headers implementados
- ✅ File upload validation (si aplica)
- ✅ ObjectId validation funcionando
- ✅ Input size limits configurados

### **Error Handling**

- ✅ Error messages no revelan información sensible
- ✅ Proper HTTP status codes utilizados
- ✅ Validation errors están estructurados
- ✅ Stack traces no se exponen en producción

---

## 🧪 Pruebas de Validación

### **1. Test básico de validation**

```bash
# Test registro con datos inválidos
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid","password":"123"}'
```

### **2. Test injection attempts**

```bash
# Test MongoDB injection
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":{"$gt":""},"password":{"$gt":""}}'
```

### **3. Test XSS protection**

```bash
# Test XSS en campos de texto
curl -X POST http://localhost:3001/api/productos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"nombre":"<script>alert(\"xss\")</script>Product"}'
```

---

## 📚 Recursos Adicionales

### **Validation Libraries**

- [Joi Documentation](https://joi.dev/api/)
- [Express Validator](https://express-validator.github.io/docs/)
- [DOMPurify](https://github.com/cure53/DOMPurify)

### **Security Best Practices**

- [OWASP Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)
- [OWASP Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Injection_Prevention_Cheat_Sheet.html)

---

## 🎯 Entregables

1. **Validation Schemas:** Schemas Joi para todos los modelos
2. **Validation Middleware:** Middleware reutilizable de validación
3. **Rate Limiting:** Configuración por endpoint
4. **Security Headers:** Headers de seguridad configurados
5. **Test Suite:** Tests para validation y security
6. **Documentation:** Guía de validation rules

---

**¡Validación completada! La aplicación ahora está protegida contra los ataques de injection más comunes.**
