# 🔐 Día 12A: Fundamentos de Seguridad Web - Guía Detallada

## 🎯 Transformación del Día

**De:** Conceptos básicos de seguridad → **A:** Sistema de autenticación JWT robusto con bcrypt

## 🗓️ Cronograma Detallado

---

## **12:00-12:45** - Authentication vs Authorization

### **Conceptos Fundamentales**

#### **¿Qué es Authentication (Autenticación)?**

- **Verificar identidad** - "¿Quién eres?"
- Proceso de confirmar que alguien es quien dice ser
- Ejemplos: username/password, biometría, tokens

#### **¿Qué es Authorization (Autorización)?**

- **Verificar permisos** - "¿Qué puedes hacer?"
- Proceso de determinar qué acciones puede realizar un usuario autenticado
- Ejemplos: roles, permisos, ACL (Access Control Lists)

#### **Flujo Típico:**

```
1. Usuario hace login (Authentication)
2. Sistema verifica credenciales
3. Sistema emite token/sesión
4. Usuario accede a recurso (Authorization)
5. Sistema verifica permisos
6. Acceso permitido/denegado
```

### **Tipos de Autenticación**

#### **1. Basic Authentication**

```javascript
// Header: Authorization: Basic base64(username:password)
const credentials = Buffer.from('usuario:password').toString('base64');
// Authorization: Basic dXN1YXJpbzpwYXNzd29yZA==
```

#### **2. Bearer Token**

```javascript
// Header: Authorization: Bearer <token>
// Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### **3. API Key**

```javascript
// Header: X-API-Key: <api-key>
// Query: /api/productos?api_key=abc123
```

### **Sistemas de Autorización**

#### **Role-Based Access Control (RBAC)**

```javascript
const roles = {
  admin: ['create', 'read', 'update', 'delete'],
  editor: ['create', 'read', 'update'],
  viewer: ['read'],
};

const checkPermission = (userRole, action) => {
  return roles[userRole]?.includes(action);
};
```

#### **Attribute-Based Access Control (ABAC)**

```javascript
const canAccess = (user, resource, action, context) => {
  // Evaluar múltiples atributos
  return (
    user.department === resource.department &&
    user.level >= resource.minimumLevel &&
    context.time >= '09:00' &&
    context.time <= '17:00'
  );
};
```

---

## **12:45-13:45** - JWT Tokens y Implementation

### **¿Qué es JWT?**

JSON Web Token - Estándar abierto (RFC 7519) para transmitir información de forma segura

#### **Estructura JWT:**

```
Header.Payload.Signature
```

#### **Ejemplo Decodificado:**

```javascript
// Header
{
    "alg": "HS256",
    "typ": "JWT"
}

// Payload
{
    "sub": "1234567890",
    "name": "Juan Pérez",
    "role": "admin",
    "iat": 1516239022,
    "exp": 1516325422
}

// Signature
HMACSHA256(
    base64UrlEncode(header) + "." + base64UrlEncode(payload),
    secret
)
```

### **Implementación con Node.js**

#### **Instalación:**

```bash
pnpm install jsonwebtoken
```

#### **Generar Token:**

```javascript
const jwt = require('jsonwebtoken');

const generateToken = user => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const options = {
    expiresIn: '24h',
    issuer: 'mi-api',
    audience: 'mi-app',
  };

  return jwt.sign(payload, process.env.JWT_SECRET, options);
};
```

#### **Verificar Token:**

```javascript
const verifyToken = token => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { valid: true, user: decoded };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};
```

#### **Middleware de Autenticación:**

```javascript
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Token de acceso requerido',
    });
  }

  const token = authHeader.substring(7); // Remover 'Bearer '
  const result = verifyToken(token);

  if (!result.valid) {
    return res.status(401).json({
      error: 'Token inválido',
      details: result.error,
    });
  }

  req.user = result.user;
  next();
};
```

### **Buenas Prácticas JWT**

#### **1. Configuración Segura:**

```javascript
const jwtConfig = {
  secret: process.env.JWT_SECRET, // Mínimo 256 bits
  algorithm: 'HS256',
  expiresIn: '15m', // Tokens de corta duración
  refreshExpiresIn: '7d', // Refresh tokens más largos
};
```

#### **2. Refresh Token Pattern:**

```javascript
const generateTokenPair = user => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { id: user.id, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};
```

#### **3. Endpoint de Refresh:**

```javascript
app.post('/api/auth/refresh', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token requerido' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    if (decoded.type !== 'refresh') {
      throw new Error('Token inválido');
    }

    // Buscar usuario y generar nuevo access token
    const user = getUserById(decoded.id);
    const newAccessToken = generateToken(user);

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(401).json({ error: 'Refresh token inválido' });
  }
});
```

---

## **14:00-15:00** - Password Hashing (bcrypt)

### **¿Por qué Hash de Passwords?**

- **Nunca almacenar passwords en texto plano**
- Protección en caso de breach de datos
- Irreversibilidad criptográfica

#### **Funciones Hash vs Encryption:**

```javascript
// ❌ Encryption (reversible)
const encrypted = encrypt(password, key);
const decrypted = decrypt(encrypted, key); // password original

// ✅ Hash (irreversible)
const hashed = hash(password);
// No hay función para obtener password original
```

### **bcrypt - La Elección Correcta**

#### **¿Por qué bcrypt?**

- Función de hash adaptativa
- Salt automático incluido
- Resistance a ataques de timing
- Configuración de "rounds" para ajustar dificultad

#### **Instalación:**

```bash
pnpm install bcryptjs
```

#### **Hash de Password:**

```javascript
const bcrypt = require('bcryptjs');

const hashPassword = async plainPassword => {
  try {
    // Salt rounds: 10-12 es recomendado
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw new Error('Error al hashear password');
  }
};

// Ejemplo de uso
const password = 'miPasswordSeguro123!';
const hashed = await hashPassword(password);
console.log(hashed); // $2b$12$xyz...
```

#### **Verificar Password:**

```javascript
const verifyPassword = async (plainPassword, hashedPassword) => {
  try {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
  } catch (error) {
    throw new Error('Error al verificar password');
  }
};

// Ejemplo de uso
const isValid = await verifyPassword('miPasswordSeguro123!', hashed);
console.log(isValid); // true o false
```

### **Implementación Completa de Auth**

#### **Registro de Usuario:**

```javascript
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validar password fuerte
    if (!isStrongPassword(password)) {
      return res.status(400).json({
        error:
          'Password debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y símbolos',
      });
    }

    // Verificar si usuario existe
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        error: 'Usuario ya existe',
      });
    }

    // Hash del password
    const hashedPassword = await hashPassword(password);

    // Crear usuario
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });

    // Generar token
    const token = generateToken(user);

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error al registrar usuario',
      details: error.message,
    });
  }
};
```

#### **Login de Usuario:**

```javascript
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        error: 'Credenciales inválidas',
      });
    }

    // Verificar password
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Credenciales inválidas',
      });
    }

    // Actualizar último login
    await User.updateLastLogin(user.id);

    // Generar token
    const token = generateToken(user);

    res.json({
      message: 'Login exitoso',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error al hacer login',
      details: error.message,
    });
  }
};
```

#### **Validación de Password Fuerte:**

```javascript
const isStrongPassword = password => {
  const minLength = 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasNonalphas = /\W/.test(password);

  return (
    password.length >= minLength &&
    hasUpper &&
    hasLower &&
    hasNumbers &&
    hasNonalphas
  );
};
```

---

## **15:00-16:00** - Autenticación Completa

### **Integración JWT + bcrypt**

#### **Creación del Sistema Completo**

```javascript
// authController.js - Controlador completo de autenticación
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authController = {
  // Registro de usuario
  register: async (req, res) => {
    try {
      const { nombre, email, password } = req.body;

      // Validaciones
      if (!nombre || !email || !password) {
        return res.status(400).json({
          error: 'Todos los campos son requeridos',
        });
      }

      // Verificar si el usuario ya existe
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          error: 'El usuario ya existe',
        });
      }

      // Validar fortaleza de password
      if (!isStrongPassword(password)) {
        return res.status(400).json({
          error:
            'Password debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y símbolos',
        });
      }

      // Hash del password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Crear usuario
      const user = await User.create({
        nombre: nombre.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
      });

      // Generar tokens
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      res.status(201).json({
        mensaje: 'Usuario registrado exitosamente',
        usuario: {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
        },
        accessToken,
        refreshToken,
      });
    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
      });
    }
  },

  // Login de usuario
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validaciones
      if (!email || !password) {
        return res.status(400).json({
          error: 'Email y password son requeridos',
        });
      }

      // Buscar usuario
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          error: 'Credenciales inválidas',
        });
      }

      // Verificar password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          error: 'Credenciales inválidas',
        });
      }

      // Generar tokens
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      res.json({
        mensaje: 'Login exitoso',
        usuario: {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
        },
        accessToken,
        refreshToken,
      });
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
      });
    }
  },

  // Refresh token
  refreshToken: async (req, res) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(401).json({
          error: 'Refresh token requerido',
        });
      }

      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({
          error: 'Usuario no encontrado',
        });
      }

      const newAccessToken = generateAccessToken(user);

      res.json({
        accessToken: newAccessToken,
      });
    } catch (error) {
      res.status(401).json({
        error: 'Refresh token inválido',
      });
    }
  },

  // Obtener perfil
  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);

      res.json({
        usuario: {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          fechaCreacion: user.createdAt,
        },
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error al obtener perfil',
      });
    }
  },
};

// Funciones auxiliares
const generateAccessToken = user => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '15m',
      issuer: 'mi-api',
    }
  );
};

const generateRefreshToken = user => {
  return jwt.sign(
    {
      id: user.id,
      type: 'refresh',
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: '7d',
      issuer: 'mi-api',
    }
  );
};

const isStrongPassword = password => {
  const minLength = 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasNonalphas = /\W/.test(password);

  return (
    password.length >= minLength &&
    hasUpper &&
    hasLower &&
    hasNumbers &&
    hasNonalphas
  );
};

module.exports = authController;
```

#### **Middleware de Autenticación**

```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        error: 'Token de acceso requerido',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        error: 'Usuario no encontrado',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expirado',
      });
    }

    return res.status(401).json({
      error: 'Token inválido',
    });
  }
};

module.exports = { authenticateToken };
```

---

## **16:00-16:15** - 🛑 DESCANSO

---

## **16:15-17:45** - Proyecto Final: Sistema de Autenticación

### **Estructura del Proyecto**

```
auth-system/
├── src/
│   ├── app.js
│   ├── controllers/
│   │   └── authController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── auth.js
│   └── config/
│       └── database.js
├── tests/
│   └── auth.test.js
├── .env.example
├── package.json
└── README.md
```

### **Implementación del Proyecto**

#### **1. Configuración Principal (app.js)**

```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const { authenticateToken } = require('./middleware/auth');

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Rutas
app.use('/api/auth', authRoutes);

// Ruta protegida de ejemplo
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({
    mensaje: 'Acceso autorizado',
    usuario: req.user,
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Error interno del servidor',
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

module.exports = app;
```

#### **2. Rutas de Autenticación**

```javascript
// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// Rutas públicas
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refreshToken);

// Rutas protegidas
router.get('/profile', authenticateToken, authController.getProfile);

module.exports = router;
```

#### **3. Testing del Sistema**

```javascript
// tests/auth.test.js
const request = require('supertest');
const app = require('../src/app');

describe('Authentication System', () => {
  describe('POST /api/auth/register', () => {
    test('debe registrar un nuevo usuario', async () => {
      const userData = {
        nombre: 'Juan Pérez',
        email: 'juan@test.com',
        password: 'Password123!',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body.usuario).toHaveProperty('email', 'juan@test.com');
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
    });

    test('debe rechazar passwords débiles', async () => {
      const userData = {
        nombre: 'Juan Pérez',
        email: 'juan@test.com',
        password: '123456',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    test('debe autenticar usuario válido', async () => {
      const loginData = {
        email: 'juan@test.com',
        password: 'Password123!',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
    });

    test('debe rechazar credenciales inválidas', async () => {
      const loginData = {
        email: 'juan@test.com',
        password: 'wrongpassword',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/protected', () => {
    test('debe permitir acceso con token válido', async () => {
      // Primero hacer login
      const loginData = {
        email: 'juan@test.com',
        password: 'Password123!',
      };

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      const token = loginResponse.body.accessToken;

      // Luego acceder a ruta protegida
      const response = await request(app)
        .get('/api/protected')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.usuario).toHaveProperty('email', 'juan@test.com');
    });

    test('debe rechazar acceso sin token', async () => {
      const response = await request(app).get('/api/protected');

      expect(response.status).toBe(401);
    });
  });
});
```

### **Variables de Entorno**

```env
# .env.example
JWT_SECRET=your-super-secret-jwt-key-256-bits-minimum
JWT_REFRESH_SECRET=your-refresh-secret-key-different-from-jwt-secret
NODE_ENV=development
PORT=3000
```

### **Documentación del Sistema**

```markdown
# Sistema de Autenticación

## Endpoints Disponibles

### Registro de Usuario

- **POST** `/api/auth/register`
- Body: `{ nombre, email, password }`
- Respuesta: `{ usuario, accessToken, refreshToken }`

### Login

- **POST** `/api/auth/login`
- Body: `{ email, password }`
- Respuesta: `{ usuario, accessToken, refreshToken }`

### Refresh Token

- **POST** `/api/auth/refresh`
- Body: `{ refreshToken }`
- Respuesta: `{ accessToken }`

### Obtener Perfil

- **GET** `/api/auth/profile`
- Header: `Authorization: Bearer <token>`
- Respuesta: `{ usuario }`

## Seguridad Implementada

- ✅ Password hashing con bcrypt
- ✅ JWT tokens con expiración
- ✅ Refresh tokens
- ✅ Validación de passwords fuertes
- ✅ Middleware de autenticación
- ✅ Manejo de errores seguro
```

---

## **17:45-18:00** - Evaluación y Preparación para Día 12B

### **Autoevaluación**

**Verifica que has completado:**

1. ✅ Sistema de registro funcionando
2. ✅ Sistema de login funcionando
3. ✅ JWT tokens implementados
4. ✅ Refresh tokens funcionando
5. ✅ Password hashing con bcrypt
6. ✅ Middleware de autenticación
7. ✅ Rutas protegidas funcionando
8. ✅ Manejo de errores apropiado
9. ✅ Tests básicos implementados
10. ✅ Documentación del sistema

### **Preparación para Día 12B**

El **Día 12B** continuará con:

- **Rate Limiting** - Protección contra ataques masivos
- **CORS Configuration** - Políticas de origen seguras
- **Input Validation** - Sanitización robusta
- **SQL Injection Prevention** - Consultas seguras
- **Security Headers** - Protección adicional
- **Monitoreo de Seguridad** - Logging y alertas

¡Excelente trabajo implementando autenticación robusta! 🔐

---

## 🎯 Próximo Día

**Día 12B: Protecciones Avanzadas de Seguridad**

- Múltiples capas de protección
- Monitoreo y alertas
- API completamente segura
- Testing de seguridad

¡Continuemos fortificando nuestras aplicaciones! 🛡️
},
standardHeaders: true, // incluir info en headers
legacyHeaders: false, // deshabilitar headers legacy
});

app.use('/api/', generalLimiter);

````

#### **Rate Limiting Específico para Auth:**

```javascript
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 intentos de login
  skipSuccessfulRequests: true, // no contar requests exitosos
  message: {
    error: 'Demasiados intentos de login',
    retry_after: 'Intenta de nuevo en 15 minutos',
  },
});

app.post('/api/auth/login', authLimiter, loginUser);
````

#### **Rate Limiting Progresivo:**

```javascript
const createProgressiveLimiter = (baseMax, multiplier = 2) => {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    max: req => {
      // Aumentar límite para usuarios autenticados
      return req.user ? baseMax * multiplier : baseMax;
    },
    keyGenerator: req => {
      // Usar user ID si está autenticado, sino IP
      return req.user ? `user:${req.user.id}` : req.ip;
    },
  });
};

const apiLimiter = createProgressiveLimiter(60, 3);
app.use('/api/', apiLimiter);
```

### **Slow Down Protection**

#### **Implementación:**

```javascript
const slowDown = require('express-slow-down');

const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutos
  delayAfter: 2, // permitir 2 requests a velocidad normal
  delayMs: 500, // agregar 500ms de delay por cada request adicional
  maxDelayMs: 20000, // máximo delay de 20 segundos
});

app.use('/api/', speedLimiter);
```

### **Rate Limiting por Usuario**

#### **Implementación Avanzada:**

```javascript
const userRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: req => {
    // Límites diferentes por rol
    const limits = {
      admin: 10000,
      premium: 1000,
      basic: 100,
      free: 50,
    };

    const userRole = req.user?.role || 'free';
    return limits[userRole] || limits.free;
  },
  keyGenerator: req => {
    // Combinar user ID y endpoint
    const userId = req.user?.id || req.ip;
    const endpoint = req.route?.path || req.path;
    return `${userId}:${endpoint}`;
  },
  message: req => ({
    error: 'Límite de API excedido',
    limit: req.rateLimit.limit,
    remaining: req.rateLimit.remaining,
    reset: req.rateLimit.reset,
  }),
});
```

### **Configuración de Headers**

#### **Headers Informativos:**

```javascript
const limiterWithHeaders = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true, // Habilitar headers estándar
  handler: (req, res) => {
    res.status(429).json({
      error: 'Rate limit exceeded',
      limit: req.rateLimit.limit,
      remaining: req.rateLimit.remaining,
      reset: new Date(req.rateLimit.reset),
      retry_after: Math.round(req.rateLimit.reset - Date.now()) / 1000,
    });
  },
});
```

### **Store Personalizado (Redis)**

#### **Para aplicaciones distribuidas:**

```javascript
const RedisStore = require('rate-limit-redis');
const redis = require('redis');

const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

const distributedLimiter = rateLimit({
  store: new RedisStore({
    client: client,
    prefix: 'rl:', // prefijo para keys
  }),
  windowMs: 15 * 60 * 1000,
  max: 100,
});
```

---

## **14:15-14:45** - CORS Configuration

### **¿Qué es CORS?**

Cross-Origin Resource Sharing - Mecanismo que permite a una página web acceder a recursos de otro dominio

#### **Same-Origin Policy:**

```javascript
// Mismo origen ✅
https://miapp.com/api/productos
https://miapp.com/dashboard

// Diferente origen ❌
https://miapp.com (origen)
https://otherapp.com (diferente dominio)
http://miapp.com (diferente protocolo)
https://miapp.com:3000 (diferente puerto)
```

### **Implementación CORS**

#### **Instalación:**

```bash
pnpm install cors
```

#### **Configuración Básica:**

```javascript
const cors = require('cors');

// Permitir todos los orígenes (NO para producción)
app.use(cors());

// Configuración específica
const corsOptions = {
  origin: ['https://miapp.com', 'https://www.miapp.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // para cookies/auth
};

app.use(cors(corsOptions));
```

#### **Configuración Dinámica:**

```javascript
const dynamicCors = cors({
  origin: (origin, callback) => {
    // Lista de dominios permitidos
    const allowedOrigins = [
      'https://miapp.com',
      'https://admin.miapp.com',
      'https://mobile.miapp.com',
    ];

    // Permitir requests sin origen (apps móviles, Postman)
    if (!origin) return callback(null, true);

    // Verificar si el origen está permitido
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200, // para IE11
});

app.use(dynamicCors);
```

### **Preflight Requests**

#### **¿Qué son?**

Requests automáticos OPTIONS que el navegador envía antes de requests "complejos"

#### **Manejo de Preflight:**

```javascript
const corsConfig = {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'X-API-Key',
  ],
  exposedHeaders: [
    'X-Total-Count',
    'X-Rate-Limit-Limit',
    'X-Rate-Limit-Remaining',
  ],
  credentials: true,
  maxAge: 86400, // cache preflight por 24 horas
};

app.use(cors(corsConfig));
```

### **CORS por Ruta**

#### **Configuración Específica:**

```javascript
// CORS específico para rutas públicas
const publicCors = cors({
  origin: '*',
  methods: ['GET'],
  credentials: false,
});

// CORS restrictivo para rutas admin
const adminCors = cors({
  origin: 'https://admin.miapp.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
});

// Aplicar CORS específico
app.use('/api/public', publicCors);
app.use('/api/admin', adminCors);
```

### **Debugging CORS**

#### **Middleware de Debug:**

```javascript
const debugCors = (req, res, next) => {
  console.log('CORS Debug:', {
    origin: req.headers.origin,
    method: req.method,
    headers: req.headers,
  });
  next();
};

app.use(debugCors);
```

---

## **14:45-15:15** - Input Validation y Sanitization

### **¿Por qué Validar y Sanitizar?**

- **Seguridad:** Prevenir ataques de inyección
- **Integridad:** Mantener calidad de datos
- **Confiabilidad:** Evitar errores por datos malformados

### **Tipos de Ataques de Input**

#### **1. XSS (Cross-Site Scripting):**

```javascript
// Input malicioso
const input = '<script>alert("XSS")</script>';

// Sin sanitización ❌
document.innerHTML = input; // Ejecuta el script

// Con sanitización ✅
const clean = DOMPurify.sanitize(input); // '&lt;script&gt;alert("XSS")&lt;/script&gt;'
```

#### **2. SQL Injection:**

```javascript
// Input malicioso
const input = '1; DROP TABLE users; --';

// Query vulnerable ❌
const query = `SELECT * FROM products WHERE id = ${input}`;
// Resultado: SELECT * FROM products WHERE id = 1; DROP TABLE users; --

// Query segura ✅
const query = 'SELECT * FROM products WHERE id = ?';
db.prepare(query).get(input); // Input tratado como valor literal
```

### **Validación con Joi**

#### **Schemas Robustos:**

```javascript
const Joi = require('joi');

const userSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-ZÀ-ÿ\s]+$/) // Solo letras y espacios
    .required()
    .messages({
      'string.pattern.base': 'El nombre solo puede contener letras',
      'string.min': 'El nombre debe tener al menos 2 caracteres',
      'string.max': 'El nombre no puede exceder 50 caracteres',
    }),

  email: Joi.string()
    .email({ tlds: { allow: true } })
    .lowercase()
    .required()
    .messages({
      'string.email': 'Debe ser un email válido',
    }),

  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      'string.pattern.base':
        'Password debe incluir mayúscula, minúscula, número y símbolo',
    }),

  age: Joi.number().integer().min(13).max(120).optional(),

  phone: Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/) // Formato internacional
    .optional(),
});
```

#### **Middleware de Validación:**

```javascript
const validateSchema = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false, // Mostrar todos los errores
      stripUnknown: true, // Remover campos no definidos
      allowUnknown: false, // No permitir campos extra
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context.value,
      }));

      return res.status(400).json({
        error: 'Datos de validación incorrectos',
        errors,
      });
    }

    // Reemplazar con datos validados
    req[property] = value;
    next();
  };
};

// Uso
app.post('/api/users', validateSchema(userSchema), createUser);
```

### **Sanitización Avanzada**

#### **Instalación:**

```bash
pnpm install dompurify jsdom express-mongo-sanitize
```

#### **Sanitización XSS:**

```javascript
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

const sanitizeXSS = (req, res, next) => {
  const sanitizeValue = value => {
    if (typeof value === 'string') {
      return DOMPurify.sanitize(value, {
        ALLOWED_TAGS: [], // No permitir tags HTML
        ALLOWED_ATTR: [], // No permitir atributos
      });
    }
    if (typeof value === 'object' && value !== null) {
      Object.keys(value).forEach(key => {
        value[key] = sanitizeValue(value[key]);
      });
    }
    return value;
  };

  req.body = sanitizeValue(req.body);
  req.query = sanitizeValue(req.query);
  req.params = sanitizeValue(req.params);

  next();
};

app.use(sanitizeXSS);
```

#### **Sanitización NoSQL Injection:**

```javascript
const mongoSanitize = require('express-mongo-sanitize');

app.use(
  mongoSanitize({
    replaceWith: '_', // Reemplazar caracteres peligrosos
    onSanitize: ({ req, key }) => {
      console.warn(`Sanitized key: ${key}`);
    },
  })
);
```

### **Validación de Archivos**

#### **Upload Seguro:**

```javascript
const multer = require('multer');
const path = require('path');

const fileFilter = (req, file, callback) => {
  // Tipos de archivo permitidos
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

  if (allowedTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(new Error('Tipo de archivo no permitido'), false);
  }
};

const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB máximo
    files: 1, // Solo 1 archivo
  },
  fileFilter: fileFilter,
});

app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se proporcionó archivo' });
  }

  // Validar extensión del archivo
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
  const fileExtension = path.extname(req.file.originalname).toLowerCase();

  if (!allowedExtensions.includes(fileExtension)) {
    return res.status(400).json({ error: 'Extensión de archivo no permitida' });
  }

  res.json({ message: 'Archivo subido exitosamente', file: req.file });
});
```

---

## **15:15-15:30** - 🛑 DESCANSO

---

## **15:30-16:00** - SQL Injection Prevention

### **¿Qué es SQL Injection?**

Ataque donde código SQL malicioso es insertado en campos de entrada para manipular consultas de base de datos

#### **Ejemplo de Ataque:**

```javascript
// Input del usuario
const userId = '1; DROP TABLE users; --';

// Query vulnerable ❌
const query = `SELECT * FROM users WHERE id = ${userId}`;
// Resultado: SELECT * FROM users WHERE id = 1; DROP TABLE users; --
```

### **Tipos de SQL Injection**

#### **1. Union-Based Injection:**

```sql
-- Input: 1 UNION SELECT username, password FROM admin_users
SELECT * FROM products WHERE id = 1 UNION SELECT username, password FROM admin_users
```

#### **2. Boolean-Based Blind:**

```sql
-- Input: 1 AND 1=1 (true) vs 1 AND 1=2 (false)
SELECT * FROM products WHERE id = 1 AND 1=1  -- Retorna resultados
SELECT * FROM products WHERE id = 1 AND 1=2  -- No retorna resultados
```

#### **3. Time-Based Blind:**

```sql
-- Input: 1; WAITFOR DELAY '00:00:05'
SELECT * FROM products WHERE id = 1; WAITFOR DELAY '00:00:05'
```

### **Prevención con Prepared Statements**

#### **SQLite con better-sqlite3:**

```javascript
const Database = require('better-sqlite3');
const db = new Database('database.db');

// ❌ Vulnerable a SQL Injection
const getUser = id => {
  const query = `SELECT * FROM users WHERE id = ${id}`;
  return db.prepare(query).get();
};

// ✅ Seguro con prepared statements
const getUserSafe = id => {
  const query = 'SELECT * FROM users WHERE id = ?';
  return db.prepare(query).get(id);
};

// ✅ Múltiples parámetros
const getUserByEmailAndStatus = (email, status) => {
  const query = 'SELECT * FROM users WHERE email = ? AND status = ?';
  return db.prepare(query).get(email, status);
};
```

#### **Named Parameters:**

```javascript
const getUserByFilters = filters => {
  const query = `
        SELECT * FROM users 
        WHERE email = @email 
        AND age >= @minAge 
        AND status = @status
    `;

  return db.prepare(query).get({
    email: filters.email,
    minAge: filters.minAge,
    status: filters.status,
  });
};
```

### **Dynamic Queries Seguras**

#### **Query Builder Seguro:**

```javascript
class SafeQueryBuilder {
  constructor(tableName) {
    this.table = tableName;
    this.whereConditions = [];
    this.params = [];
  }

  where(column, operator, value) {
    // Validar columna permitida
    const allowedColumns = ['id', 'name', 'email', 'status', 'created_at'];
    if (!allowedColumns.includes(column)) {
      throw new Error(`Columna no permitida: ${column}`);
    }

    // Validar operador
    const allowedOperators = ['=', '!=', '>', '<', '>=', '<=', 'LIKE'];
    if (!allowedOperators.includes(operator)) {
      throw new Error(`Operador no permitido: ${operator}`);
    }

    this.whereConditions.push(`${column} ${operator} ?`);
    this.params.push(value);
    return this;
  }

  build() {
    let query = `SELECT * FROM ${this.table}`;

    if (this.whereConditions.length > 0) {
      query += ` WHERE ${this.whereConditions.join(' AND ')}`;
    }

    return { query, params: this.params };
  }
}

// Uso seguro
const builder = new SafeQueryBuilder('users');
const { query, params } = builder
  .where('email', 'LIKE', '%@example.com')
  .where('status', '=', 'active')
  .build();

const users = db.prepare(query).all(params);
```

### **Validación de Entrada para SQL**

#### **Whitelist de Caracteres:**

```javascript
const validateSQLInput = (input, type) => {
  const patterns = {
    id: /^\d+$/, // Solo números
    email: /^[a-zA-Z0-9@._-]+$/, // Caracteres de email
    name: /^[a-zA-ZÀ-ÿ\s'-]+$/, // Nombres (con acentos)
    alphanumeric: /^[a-zA-Z0-9]+$/, // Solo alfanumérico
  };

  const pattern = patterns[type];
  if (!pattern) {
    throw new Error(`Tipo de validación no válido: ${type}`);
  }

  if (!pattern.test(input)) {
    throw new Error(`Input no válido para tipo ${type}: ${input}`);
  }

  return input;
};

// Uso
const getUserById = id => {
  const validId = validateSQLInput(id, 'id');
  return db.prepare('SELECT * FROM users WHERE id = ?').get(validId);
};
```

### **Escape Functions (Último Recurso)**

#### **Solo cuando prepared statements no son posibles:**

```javascript
const escapeSQL = input => {
  if (typeof input !== 'string') {
    return input;
  }

  return input
    .replace(/'/g, "''") // Escapar comillas simples
    .replace(/\\/g, '\\\\') // Escapar backslashes
    .replace(/\x00/g, '\\0') // Escapar null bytes
    .replace(/\n/g, '\\n') // Escapar newlines
    .replace(/\r/g, '\\r') // Escapar carriage returns
    .replace(/\x1a/g, '\\Z'); // Escapar ctrl+Z
};

// ⚠️ Usar solo si no se pueden usar prepared statements
const buildDynamicQuery = (tableName, filters) => {
  // Validar nombre de tabla (whitelist)
  const allowedTables = ['users', 'products', 'orders'];
  if (!allowedTables.includes(tableName)) {
    throw new Error('Tabla no permitida');
  }

  let query = `SELECT * FROM ${tableName}`;

  if (filters.search) {
    const escapedSearch = escapeSQL(filters.search);
    query += ` WHERE name LIKE '%${escapedSearch}%'`;
  }

  return query;
};
```

### **Logging y Monitoreo**

#### **Detectar Intentos de Inyección:**

```javascript
const detectSQLInjection = (req, res, next) => {
  const suspiciousPatterns = [
    /(\s*(union|select|insert|update|delete|drop|create|alter)\s+)/i,
    /(\s*(or|and)\s+\d+\s*=\s*\d+)/i,
    /(\s*--\s*)/,
    /(\s*\/\*[\s\S]*?\*\/\s*)/,
    /(\s*;\s*)/,
  ];

  const checkInput = (obj, path = '') => {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;

      if (typeof value === 'string') {
        for (const pattern of suspiciousPatterns) {
          if (pattern.test(value)) {
            console.warn(`Posible SQL Injection detectado:`, {
              ip: req.ip,
              path: currentPath,
              value: value,
              url: req.originalUrl,
              userAgent: req.get('User-Agent'),
            });

            return res.status(400).json({
              error: 'Input no válido detectado',
            });
          }
        }
      } else if (typeof value === 'object' && value !== null) {
        checkInput(value, currentPath);
      }
    }
  };

  checkInput({ ...req.body, ...req.query, ...req.params });
  next();
};

app.use(detectSQLInjection);
```

---

## **16:00-16:30** - Security Headers y Best Practices

### **¿Por qué Security Headers?**

Headers HTTP que le dicen al navegador cómo comportarse para prevenir ataques comunes

### **Helmet.js - Configuración Completa**

#### **Instalación:**

```bash
pnpm install helmet
```

#### **Configuración Básica:**

```javascript
const helmet = require('helmet');

// Configuración básica (recomendada)
app.use(helmet());
```

#### **Configuración Avanzada:**

```javascript
app.use(
  helmet({
    // Content Security Policy
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https:'],
        scriptSrc: ["'self'"],
        connectSrc: ["'self'", 'https://api.miapp.com'],
        frameAncestors: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
      },
    },

    // HTTP Strict Transport Security
    hsts: {
      maxAge: 31536000, // 1 año
      includeSubDomains: true,
      preload: true,
    },

    // X-Frame-Options
    frameguard: {
      action: 'deny', // Prevenir clickjacking
    },

    // X-Content-Type-Options
    noSniff: true, // Prevenir MIME sniffing

    // Referrer Policy
    referrerPolicy: {
      policy: 'strict-origin-when-cross-origin',
    },

    // Permissions Policy (antes Feature Policy)
    permissionsPolicy: {
      features: {
        camera: ['none'],
        microphone: ['none'],
        geolocation: ['self'],
        notifications: ['self'],
      },
    },
  })
);
```

### **Headers de Seguridad Manuales**

#### **Headers Personalizados:**

```javascript
const securityHeaders = (req, res, next) => {
  // Remover header que expone tecnología
  res.removeHeader('X-Powered-By');

  // Headers personalizados
  res.setHeader('X-API-Version', '1.0.0');
  res.setHeader(
    'X-Request-ID',
    req.headers['x-request-id'] || generateRequestId()
  );

  // Seguridad adicional
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Download-Options', 'noopen');
  res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');

  next();
};

app.use(securityHeaders);
```

### **Content Security Policy (CSP)**

#### **CSP Granular:**

```javascript
const cspConfig = {
  directives: {
    // Fuentes por defecto
    defaultSrc: ["'self'"],

    // Scripts
    scriptSrc: [
      "'self'",
      "'unsafe-inline'", // Solo si es absolutamente necesario
      'https://cdn.jsdelivr.net',
      'https://cdnjs.cloudflare.com',
    ],

    // Estilos
    styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],

    // Imágenes
    imgSrc: ["'self'", 'data:', 'https:', 'blob:'],

    // Fuentes
    fontSrc: ["'self'", 'https://fonts.gstatic.com'],

    // Conexiones
    connectSrc: [
      "'self'",
      'https://api.miapp.com',
      'wss://websocket.miapp.com',
    ],

    // Multimedia
    mediaSrc: ["'self'", 'https://cdn.miapp.com'],

    // Trabajadores
    workerSrc: ["'self'", 'blob:'],

    // Frames
    frameSrc: ["'none'"],
    frameAncestors: ["'none'"],

    // Formularios
    formAction: ["'self'"],

    // Base URI
    baseUri: ["'self'"],

    // Reportes
    reportUri: '/api/csp-report',
  },
  reportOnly: false, // Cambiar a true para modo de reporte solamente
};

app.use(helmet.contentSecurityPolicy(cspConfig));
```

#### **Endpoint para Reportes CSP:**

```javascript
app.post(
  '/api/csp-report',
  express.raw({ type: 'application/csp-report' }),
  (req, res) => {
    try {
      const report = JSON.parse(req.body);
      console.warn('CSP Violation:', report);

      // Guardar en base de datos o servicio de logging
      logCSPViolation(report);

      res.status(204).end();
    } catch (error) {
      console.error('Error processing CSP report:', error);
      res.status(400).end();
    }
  }
);
```

### **Mejores Prácticas de Seguridad**

#### **1. Environment Variables:**

```javascript
// .env (nunca commitear)
JWT_SECRET=super_secret_key_that_is_very_long_and_random
JWT_REFRESH_SECRET=another_very_secret_key_for_refresh_tokens
DATABASE_URL=sqlite:///path/to/database.db
CORS_ORIGIN=https://miapp.com
RATE_LIMIT_MAX=100

// Validar variables de entorno
const requiredEnvVars = [
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
    'DATABASE_URL'
];

requiredEnvVars.forEach(envVar => {
    if (!process.env[envVar]) {
        console.error(`Variable de entorno requerida: ${envVar}`);
        process.exit(1);
    }
});
```

#### **2. Error Handling Seguro:**

```javascript
const safeErrorHandler = (err, req, res, next) => {
  // Log del error completo (solo en servidor)
  console.error('Error completo:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    user: req.user?.id || 'anonymous',
  });

  // Respuesta sanitizada al cliente
  const isDevelopment = process.env.NODE_ENV === 'development';

  let errorResponse = {
    error: 'Error interno del servidor',
    timestamp: new Date().toISOString(),
    request_id: req.headers['x-request-id'],
  };

  // Solo en desarrollo mostrar detalles
  if (isDevelopment) {
    errorResponse.details = err.message;
    errorResponse.stack = err.stack;
  }

  // Códigos de error específicos
  if (err.name === 'ValidationError') {
    errorResponse.error = 'Datos de validación incorrectos';
    errorResponse.details = err.details;
    return res.status(400).json(errorResponse);
  }

  if (err.name === 'UnauthorizedError') {
    errorResponse.error = 'No autorizado';
    return res.status(401).json(errorResponse);
  }

  res.status(500).json(errorResponse);
};

app.use(safeErrorHandler);
```

#### **3. Logging de Seguridad:**

```javascript
const securityLogger = {
  logFailedLogin: (ip, email, userAgent) => {
    console.warn('Failed login attempt:', {
      ip,
      email,
      userAgent,
      timestamp: new Date().toISOString(),
    });
  },

  logSuspiciousActivity: (ip, activity, details) => {
    console.warn('Suspicious activity:', {
      ip,
      activity,
      details,
      timestamp: new Date().toISOString(),
    });
  },

  logRateLimitExceeded: (ip, endpoint, limit) => {
    console.warn('Rate limit exceeded:', {
      ip,
      endpoint,
      limit,
      timestamp: new Date().toISOString(),
    });
  },
};
```

#### **4. Security Middleware Stack:**

```javascript
const securityStack = [
  helmet(), // Headers de seguridad
  cors(corsOptions), // CORS
  rateLimit(rateLimitOptions), // Rate limiting
  express.json({ limit: '10mb' }), // Límite de payload
  sanitizeInput, // Sanitización
  validateInput, // Validación
  authenticate, // Autenticación (para rutas protegidas)
  authorize, // Autorización (para rutas específicas)
  auditLog, // Logging de auditoría
];

// Aplicar a rutas protegidas
app.use('/api/admin', ...securityStack);
```

---

## **16:30-17:00** - Segunda Evaluación Práctica (API Segura)

### **Proyecto: Sistema de Autenticación Completo**

#### **Objetivos del Proyecto:**

- Implementar registro y login con JWT
- Aplicar todas las medidas de seguridad aprendidas
- Crear sistema de roles y permisos
- Documentar API con aspectos de seguridad

#### **Estructura del Proyecto:**

```
api-segura/
├── server.js
├── routes/
│   ├── auth.js
│   ├── users.js
│   └── admin.js
├── middleware/
│   ├── auth.js
│   ├── validation.js
│   └── security.js
├── models/
│   └── User.js
├── utils/
│   ├── jwt.js
│   ├── password.js
│   └── logger.js
└── tests/
    ├── auth.test.js
    └── security.test.js
```

#### **Características Requeridas:**

**1. Autenticación:**

- Registro de usuarios con validación
- Login con email/password
- JWT tokens con refresh
- Logout y blacklist de tokens

**2. Autorización:**

- Sistema de roles (admin, editor, user)
- Middleware de permisos
- Endpoints protegidos por rol

**3. Seguridad:**

- Password hashing con bcrypt
- Rate limiting en endpoints críticos
- Validación y sanitización robusta
- Headers de seguridad completos
- Logging de eventos de seguridad

**4. Endpoints Mínimos:**

```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
GET  /api/auth/profile
PUT  /api/auth/profile

GET  /api/users          (admin only)
GET  /api/users/:id      (admin/owner)
PUT  /api/users/:id      (admin/owner)
DELETE /api/users/:id    (admin only)

GET  /api/admin/stats    (admin only)
GET  /api/admin/logs     (admin only)
```

#### **Criterios de Evaluación:**

**Seguridad (40 puntos):**

- [ ] Passwords hasheados correctamente (10 pts)
- [ ] JWT implementado apropiadamente (10 pts)
- [ ] Rate limiting configurado (10 pts)
- [ ] Headers de seguridad implementados (10 pts)

**Funcionalidad (30 puntos):**

- [ ] Registro y login funcionando (10 pts)
- [ ] Sistema de roles implementado (10 pts)
- [ ] Endpoints protegidos correctamente (10 pts)

**Validación (20 puntos):**

- [ ] Validación de entrada robusta (10 pts)
- [ ] Sanitización implementada (10 pts)

**Código y Documentación (10 puntos):**

- [ ] Código limpio y bien estructurado (5 pts)
- [ ] Documentación de seguridad (5 pts)

---

## 🎯 Evaluación del Día

### **Rúbrica de Evaluación:**

**Excelente (90-100 pts):**

- Todas las medidas de seguridad implementadas
- Código siguiendo mejores prácticas
- Manejo de errores robusto
- Documentación completa

**Bueno (80-89 pts):**

- Mayoría de medidas implementadas
- Funcionalidad básica completa
- Algunas mejores prácticas aplicadas

**Satisfactorio (70-79 pts):**

- Autenticación básica funcionando
- Algunas medidas de seguridad implementadas
- Funcionalidad mínima cumplida

**Necesita Mejora (< 70 pts):**

- Funcionalidad incompleta
- Medidas de seguridad insuficientes
- Vulnerabilidades presentes

---

## 🚀 Siguiente Día

**Día 13: Frontend-Backend Integration**

- Fetch API y async data loading
- Error handling en peticiones HTTP
- Loading states y UX patterns
- Axios setup y interceptors

¡Excelente trabajo construyendo APIs seguras y robustas! 🛡️
