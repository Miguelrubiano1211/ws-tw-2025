# 🔐 API Segura - Proyecto Final Día 12

## 📋 Descripción del Proyecto

Este proyecto implementa una API REST completa con todas las medidas de seguridad aprendidas durante el día 12. Es una demostración práctica de cómo aplicar autenticación, autorización, validación, sanitización y protecciones contra ataques comunes.

## 🎯 Objetivos del Proyecto

- ✅ Implementar autenticación JWT completa
- ✅ Sistema de autorización basado en roles
- ✅ Password hashing con bcrypt
- ✅ Rate limiting y protección DDoS
- ✅ Configuración CORS apropiada
- ✅ Validación y sanitización robusta
- ✅ Prevención de SQL injection
- ✅ Headers de seguridad con Helmet
- ✅ Logging y monitoreo de seguridad

## 🏗️ Arquitectura del Proyecto

```
api-segura/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   ├── jwt.js
│   │   └── security.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   └── productController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── validation.js
│   │   ├── security.js
│   │   └── rateLimiting.js
│   ├── models/
│   │   ├── User.js
│   │   └── Product.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   └── products.js
│   ├── utils/
│   │   ├── logger.js
│   │   └── helpers.js
│   └── app.js
├── tests/
│   ├── auth.test.js
│   ├── security.test.js
│   └── integration.test.js
├── package.json
├── server.js
└── README.md
```

## 📦 Dependencias Principales

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "helmet": "^7.0.0",
    "cors": "^2.8.5",
    "express-rate-limit": "^6.8.1",
    "express-validator": "^7.0.1",
    "express-mongo-sanitize": "^2.2.0",
    "sqlite3": "^5.1.6",
    "winston": "^3.10.0",
    "joi": "^17.9.2",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "jest": "^29.6.1",
    "supertest": "^6.3.3",
    "nodemon": "^3.0.1"
  }
}
```

## 🚀 Características Implementadas

### 1. **Autenticación JWT**

- Login y registro seguros
- Tokens con expiración
- Refresh tokens
- Logout con invalidación

### 2. **Autorización por Roles**

- Roles: `admin`, `user`, `moderator`
- Middleware de verificación de roles
- Endpoints protegidos por permisos

### 3. **Password Security**

- Hashing con bcrypt (12 salt rounds)
- Validación de fuerza de password
- Historial de passwords
- Políticas de cambio

### 4. **Rate Limiting**

- Límites generales y específicos
- Protección contra ataques de fuerza bruta
- Detección de patrones sospechosos
- Blacklist automática

### 5. **CORS Security**

- Whitelist de dominios
- Configuración por ambiente
- Manejo de preflight requests
- Headers de seguridad

### 6. **Input Validation**

- Validación con Joi y express-validator
- Sanitización de datos
- Prevención XSS
- Validación de tipos

### 7. **SQL Injection Prevention**

- Prepared statements
- Detección de patrones maliciosos
- Sanitización SQL
- Logging de intentos

### 8. **Security Headers**

- Helmet configurado
- CSP personalizado
- HSTS implementado
- Headers adicionales

## 🔧 Configuración e Instalación

### 1. Instalación de dependencias:

```bash
cd api-segura
pnpm install
```

### 2. Configuración del entorno:

```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

### 3. Inicialización de la base de datos:

```bash
pnpm run init-db
```

### 4. Ejecución en desarrollo:

```bash
pnpm run dev
```

### 5. Ejecución en producción:

```bash
pnpm start
```

## 📊 Endpoints Disponibles

### **Autenticación**

- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Renovar token
- `POST /api/auth/logout` - Logout

### **Usuarios**

- `GET /api/users` - Listar usuarios (admin)
- `GET /api/users/:id` - Obtener usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario (admin)

### **Productos**

- `GET /api/products` - Listar productos
- `POST /api/products` - Crear producto (admin)
- `GET /api/products/:id` - Obtener producto
- `PUT /api/products/:id` - Actualizar producto (admin)
- `DELETE /api/products/:id` - Eliminar producto (admin)

### **Administración**

- `GET /api/admin/stats` - Estadísticas de seguridad
- `GET /api/admin/logs` - Logs de seguridad
- `POST /api/admin/blacklist` - Gestionar blacklist

## 🧪 Testing

### Ejecutar tests:

```bash
# Todos los tests
pnpm test

# Tests específicos
pnpm test auth
pnpm test security
pnpm test integration
```

### Tests de seguridad:

```bash
# Test de autenticación
pnpm test:auth

# Test de rate limiting
pnpm test:rate-limit

# Test de validación
pnpm test:validation

# Test de SQL injection
pnpm test:sql-injection
```

## 🔍 Monitoreo y Logging

### Logs disponibles:

- `logs/app.log` - Logs generales
- `logs/security.log` - Logs de seguridad
- `logs/error.log` - Logs de errores

### Métricas de seguridad:

- Intentos de autenticación fallidos
- Violaciones de rate limiting
- Intentos de SQL injection
- Violaciones CSP
- Accesos no autorizados

## 🛡️ Mejores Prácticas Implementadas

### 1. **Seguridad de Passwords**

```javascript
// Ejemplo de configuración
const BCRYPT_ROUNDS = 12;
const PASSWORD_POLICY = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSymbols: true,
};
```

### 2. **Rate Limiting**

```javascript
// Configuración por endpoint
const rateLimits = {
  login: { windowMs: 15 * 60 * 1000, max: 5 },
  register: { windowMs: 60 * 60 * 1000, max: 3 },
  api: { windowMs: 60 * 1000, max: 100 },
};
```

### 3. **Headers de Seguridad**

```javascript
// Configuración CSP
const cspConfig = {
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'"],
  styleSrc: ["'self'", "'unsafe-inline'"],
  imgSrc: ["'self'", 'data:', 'https:'],
};
```

## 🎯 Casos de Uso

### 1. **Registro de Usuario**

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "usuario123",
    "email": "usuario@ejemplo.com",
    "password": "MiPassword123!"
  }'
```

### 2. **Login con JWT**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "usuario123",
    "password": "MiPassword123!"
  }'
```

### 3. **Acceso Protegido**

```bash
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer <tu_token_jwt>"
```

## 📈 Métricas de Rendimiento

### Objetivos de rendimiento:

- Tiempo de respuesta < 200ms
- Rate limiting efectivo
- Validación rápida < 50ms
- Autenticación < 100ms

### Monitoreo:

- Requests por segundo
- Tiempo de respuesta promedio
- Errores de seguridad
- Utilización de recursos

## 🔐 Configuración de Seguridad

### Variables de entorno:

```env
# JWT
JWT_SECRET=tu_clave_secreta_super_segura
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# Base de datos
DB_PATH=./database.sqlite

# Seguridad
BCRYPT_ROUNDS=12
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000

# CORS
CORS_ORIGIN=http://localhost:3000,https://mi-app.com
CORS_CREDENTIALS=true

# Ambiente
NODE_ENV=development
PORT=3000
```

## 🚨 Alertas de Seguridad

### Alertas implementadas:

- Múltiples intentos de login fallidos
- Patrones de SQL injection detectados
- Violaciones de rate limiting
- Accesos no autorizados
- User agents sospechosos

### Respuestas automáticas:

- Blacklist temporal de IPs
- Incremento de rate limiting
- Notificaciones de seguridad
- Logging detallado

## 📚 Documentación Adicional

### Guías de seguridad:

- [Autenticación JWT](./docs/jwt-auth.md)
- [Rate Limiting](./docs/rate-limiting.md)
- [Validación de Entrada](./docs/input-validation.md)
- [Headers de Seguridad](./docs/security-headers.md)

### Ejemplos de uso:

- [Postman Collection](./docs/postman_collection.json)
- [Casos de prueba](./docs/test-cases.md)
- [Configuración de producción](./docs/production-setup.md)

## 🏆 Evaluación WorldSkills

### Criterios evaluados:

- ✅ Implementación correcta de autenticación
- ✅ Sistema de autorización funcional
- ✅ Validación y sanitización efectiva
- ✅ Protección contra ataques comunes
- ✅ Configuración de seguridad apropiada
- ✅ Logging y monitoreo implementado
- ✅ Código limpio y documentado
- ✅ Tests de seguridad completos

### Puntuación esperada:

- **Funcionalidad**: 25/25 puntos
- **Seguridad**: 25/25 puntos
- **Calidad de código**: 20/20 puntos
- **Documentación**: 15/15 puntos
- **Testing**: 15/15 puntos

**Total: 100/100 puntos** 🏆

## 🔄 Próximos Pasos

Después de completar este proyecto, estarás listo para:

- Implementar APIs seguras en producción
- Configurar sistemas de monitoreo
- Manejar certificados SSL/TLS
- Implementar OAuth2 y OpenID Connect
- Configurar WAF (Web Application Firewall)

¡Conviértete en un experto en seguridad de APIs! 🛡️
