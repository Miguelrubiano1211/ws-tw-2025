# 📚 Recursos del Día 12: Security y Authentication

## 🎯 Objetivo de los Recursos

Esta sección contiene material complementario, referencias y herramientas para profundizar en los conceptos de seguridad y autenticación vistos durante el día 12.

## � Documentación de Referencia

### **JWT (JSON Web Tokens)**

- [JWT.io](https://jwt.io/) - Decodificador y documentación oficial
- [RFC 7519](https://tools.ietf.org/html/rfc7519) - Especificación JWT
- [JWT Security Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)

### **Password Hashing**

- [bcrypt npm package](https://www.npmjs.com/package/bcrypt)
- [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [Salt and Hash Passwords](https://auth0.com/blog/hashing-passwords-one-way-road-to-security/)

### **API Security**

- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/)

## 🛡️ Herramientas de Seguridad

### **NPM Packages Recomendados**

```bash
# Autenticación y autorización
pnpm install jsonwebtoken bcryptjs

# Rate limiting y protección
pnpm install express-rate-limit helmet cors

# Validación y sanitización
pnpm install joi express-validator

# Monitoreo y logging
pnpm install winston morgan

# Testing de seguridad
pnpm install -D supertest jest
```

### **Configuración de Variables de Entorno**

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-256-bits-minimum
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Rate Limiting
RATE_LIMIT_WINDOW=15 # minutos
RATE_LIMIT_MAX=100 # requests por ventana

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
CORS_CREDENTIALS=true

# Security Headers
HELMET_CSP_ENABLED=true
HELMET_HSTS_ENABLED=true
```

## 🧪 Comandos de Testing

### **Pruebas de Seguridad**

```bash
# Ejecutar tests de seguridad
pnpm test security

# Análisis de vulnerabilidades
pnpm audit
pnpm audit fix

# Linting de seguridad
pnpm run lint:security
```

### **Testeo Manual con cURL**

```bash
# Test de autenticación
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'

# Test de endpoint protegido
curl -X GET http://localhost:3001/api/protected \
  -H "Authorization: Bearer your-jwt-token"

# Test de rate limiting
for i in {1..110}; do curl http://localhost:3001/api/test; done
```

## 🔍 Checklist de Seguridad

### **Antes de Deployment**

- [ ] Todas las credenciales en variables de entorno
- [ ] JWT secrets seguros (mínimo 256 bits)
- [ ] Rate limiting configurado
- [ ] CORS apropiadamente configurado
- [ ] Headers de seguridad implementados
- [ ] Validación en todos los endpoints
- [ ] Error handling sin exposición de datos sensibles
- [ ] Logging de eventos de seguridad
- [ ] Testing de vulnerabilidades completado

### **Monitoring en Producción**

- [ ] Logs de intentos de login fallidos
- [ ] Monitoreo de rate limiting
- [ ] Alertas de JWT tokens inválidos
- [ ] Tracking de endpoints más atacados
- [ ] Análisis de patrones de tráfico sospechoso

## 🎯 Retos Adicionales

### **Reto Intermedio: Token Blacklisting**

Implementar un sistema de blacklist para tokens JWT revocados.

### **Reto Avanzado: Multi-Factor Authentication**

Agregar autenticación de dos factores con códigos SMS o TOTP.

### **Reto Experto: OAuth2 Integration**

Integrar autenticación con Google/GitHub OAuth2.

## 🚨 Vulnerabilidades Comunes

### **JWT Vulnerabilities**

- [ ] Algoritmo "none" attack
- [ ] Weak signing keys
- [ ] Token exposure en URLs
- [ ] Lack of token expiration
- [ ] JWT confusion attacks

### **Password Attacks**

- [ ] Brute force attacks
- [ ] Rainbow table attacks
- [ ] Timing attacks
- [ ] Weak password policies
- [ ] Password reuse

### **API Vulnerabilities**

- [ ] SQL injection
- [ ] Cross-site scripting (XSS)
- [ ] Cross-site request forgery (CSRF)
- [ ] Server-side request forgery (SSRF)
- [ ] Insecure direct object references

## 📖 Lecturas Complementarias

### **Artículos Técnicos**

- [The Ultimate Guide to handling JWTs on frontend clients](https://hasura.io/blog/best-practices-of-using-jwt-with-graphql/)
- [Node.js Security Checklist](https://blog.sqreen.com/nodejs-security-checklist/)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

### **Libros Recomendados**

- "Web Application Security" by Andrew Hoffman
- "Node.js Secure Coding" by Deepal Jayasekara
- "OAuth 2 in Action" by Justin Richer

### **Cursos Online**

- [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [Node.js Security Course](https://github.com/lirantal/nodejs-security-course)
- [JWT Security Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)

## 🎪 Ejercicios Prácticos Adicionales

### **Ejercicio 1: Security Headers Analysis**

Analizar y mejorar los headers de seguridad de una aplicación existente.

### **Ejercicio 2: Rate Limiting Strategies**

Implementar diferentes estrategias de rate limiting (IP, usuario, endpoint).

### **Ejercicio 3: JWT Attack Simulation**

Simular ataques comunes contra JWT y implementar contramedidas.

### **Ejercicio 4: SQL Injection Prevention**

Identificar y corregir vulnerabilidades de SQL injection en código existente.

## 🏆 Criterios de Evaluación WorldSkills

### **Técnico (60%)**

- Implementación correcta de JWT
- Password hashing seguro
- Rate limiting funcional
- CORS configurado apropiadamente
- Validación robusta
- SQL injection prevention
- Security headers implementados

### **Calidad del Código (25%)**

- Estructura y organización
- Manejo de errores
- Comentarios y documentación
- Mejores prácticas seguidas

### **Funcionalidad (15%)**

- Autenticación funcional
- Autorización por roles
- API endpoints protegidos
- Testing implementado

---

## 🎯 Tips para el Éxito

1. **Prioriza la seguridad desde el diseño** - No la agregues después
2. **Usa librerías probadas** - No reinventes la rueda
3. **Testa constantemente** - Seguridad es un proceso continuo
4. **Documenta todo** - Otros desarrolladores necesitan entender
5. **Mantente actualizado** - Vulnerabilidades surgen constantemente

¡Recuerda: La seguridad no es opcional, es fundamental! 🛡️

#### ⚡ **Rate Limiting**

- [OWASP Rate Limiting](https://owasp.org/www-community/controls/Blocking_Brute_Force_Attacks)
- [Express Rate Limit](https://express-rate-limit.mintlify.app/)
- [DDoS Protection Strategies](https://www.cloudflare.com/learning/ddos/ddos-mitigation/)

#### 🌐 **CORS Security**

- [MDN CORS Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [OWASP CORS Guide](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Origin_Resource_Sharing_Cheat_Sheet.html)

#### ✅ **Input Validation**

- [OWASP Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)
- [Joi Documentation](https://joi.dev/api/)
- [Express Validator Guide](https://express-validator.github.io/docs/)

#### 🛡️ **SQL Injection Prevention**

- [OWASP SQL Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
- [SQLite Prepared Statements](https://www.sqlite.org/lang_expr.html)

#### 🔒 **Security Headers**

- [OWASP Secure Headers Project](https://owasp.org/www-project-secure-headers/)
- [Helmet.js Documentation](https://helmetjs.github.io/)
- [CSP Guide](https://content-security-policy.com/)

## 🛠️ Herramientas Recomendadas

### **Testing de Seguridad**

- [OWASP ZAP](https://owasp.org/www-project-zap/) - Proxy de seguridad
- [Postman](https://www.postman.com/) - Testing de APIs
- [Burp Suite](https://portswigger.net/burp) - Herramienta de pentesting web
- [SQLMap](https://sqlmap.org/) - Testing de SQL injection (solo para pruebas)

### **Análisis de Código**

- [ESLint Security](https://github.com/nodesecurity/eslint-plugin-security)
- [Snyk](https://snyk.io/) - Análisis de vulnerabilidades
- [SonarQube](https://www.sonarqube.org/) - Calidad y seguridad de código

### **Monitoreo y Logging**

- [Winston](https://github.com/winstonjs/winston) - Logging para Node.js
- [Morgan](https://github.com/expressjs/morgan) - HTTP request logger
- [Elastic Stack](https://www.elastic.co/) - Análisis de logs

## 📚 Librerías y Frameworks

### **Autenticación y Autorización**

```bash
# JWT
pnpm install jsonwebtoken
pnpm install @types/jsonwebtoken

# OAuth2
pnpm install passport passport-oauth2
pnpm install passport-google-oauth20

# Session Management
pnpm install express-session
pnpm install connect-redis
```

### **Password Security**

```bash
# Hashing
pnpm install bcryptjs
pnpm install argon2
pnpm install scrypt

# Password validation
pnpm install joi
pnpm install validator
```

### **Rate Limiting**

```bash
# Basic rate limiting
pnpm install express-rate-limit
pnpm install express-slow-down

# Advanced rate limiting
pnpm install rate-limiter-flexible
pnpm install redis
```

### **Input Validation**

```bash
# Validation libraries
pnpm install joi
pnpm install express-validator
pnpm install ajv

# Sanitization
pnpm install dompurify
pnpm install express-mongo-sanitize
pnpm install xss
```

### **Security Headers**

```bash
# Helmet and security
pnpm install helmet
pnpm install cors
pnpm install hpp

# CSP and reporting
pnpm install content-security-policy-builder
```

## 🎓 Recursos de Aprendizaje

### **Cursos Online**

- [OWASP WebGoat](https://owasp.org/www-project-webgoat/) - Aplicación vulnerable para aprender
- [DVWA](https://dvwa.co.uk/) - Damn Vulnerable Web Application
- [PortSwigger Web Security Academy](https://portswigger.net/web-security)

### **Libros Recomendados**

- "Web Application Security" by Andrew Hoffman
- "The Web Application Hacker's Handbook" by Dafydd Stuttard
- "OWASP Top 10" - Lista de vulnerabilidades más críticas

### **Certificaciones**

- OWASP Foundation Courses
- Certified Ethical Hacker (CEH)
- CISSP - Certified Information Systems Security Professional

## 🔧 Configuraciones de Producción

### **Environment Variables**

```env
# Producción
NODE_ENV=production
JWT_SECRET=clave-de-256-bits-generada-aleatoriamente
BCRYPT_ROUNDS=12

# Base de datos
DB_HOST=tu-servidor-db
DB_USER=usuario-limitado
DB_PASS=password-fuerte

# Rate limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000

# CORS
CORS_ORIGIN=https://tu-dominio.com
CORS_CREDENTIALS=false
```

### **Nginx Configuration**

```nginx
# Rate limiting
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

server {
    listen 443 ssl http2;
    server_name tu-api.com;

    # SSL configuration
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/private.key;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";

    # Rate limiting
    limit_req zone=api burst=20 nodelay;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### **Docker Security**

```dockerfile
# Dockerfile seguro
FROM node:18-alpine AS builder

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodeuser -u 1001

# Copiar y instalar dependencias
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copiar código
COPY . .

# Cambiar a usuario no-root
USER nodeuser

EXPOSE 3000

CMD ["node", "server.js"]
```

## 🚨 Security Checklist

### **Pre-Deployment**

- [ ] Variables de entorno configuradas
- [ ] Secrets no están en el código
- [ ] Rate limiting implementado
- [ ] Input validation completa
- [ ] SQL injection protegido
- [ ] XSS prevention activo
- [ ] CORS configurado restrictivamente
- [ ] Headers de seguridad aplicados
- [ ] Logging de seguridad activo
- [ ] SSL/TLS configurado
- [ ] Tests de seguridad ejecutados

### **Post-Deployment**

- [ ] Monitoreo de logs activo
- [ ] Alertas de seguridad configuradas
- [ ] Backups automatizados
- [ ] Actualizaciones de seguridad programadas
- [ ] Penetration testing ejecutado
- [ ] Incident response plan documentado

## 🎪 Ejercicios Adicionales

### **Ejercicio Avanzado 1: OAuth2 Implementation**

Implementar autenticación con Google OAuth2:

```javascript
// passport-config.js
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      // Implementar lógica de usuario
    }
  )
);
```

### **Ejercicio Avanzado 2: Rate Limiting con Redis**

Implementar rate limiting distribuido:

```javascript
const RedisStore = require('rate-limit-redis');
const redis = require('redis');

const redisClient = redis.createClient();

const rateLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:',
  }),
  windowMs: 15 * 60 * 1000,
  max: 100,
});
```

### **Ejercicio Avanzado 3: CSP Reporting**

Implementar reporte de violaciones CSP:

```javascript
app.post(
  '/csp-report',
  express.json({ type: 'application/csp-report' }),
  (req, res) => {
    console.log('CSP Violation:', req.body);
    // Enviar a sistema de monitoreo
    res.status(204).send();
  }
);
```

## 🏆 Retos WorldSkills

### **Reto 1: Security Audit**

- Realizar auditoría completa de seguridad
- Identificar al menos 10 vulnerabilidades potenciales
- Proponer soluciones específicas
- Documentar hallazgos

### **Reto 2: Penetration Testing**

- Usar OWASP ZAP para testing automatizado
- Ejecutar tests manuales de SQL injection
- Verificar protecciones XSS
- Generar reporte de vulnerabilidades

### **Reto 3: Security Monitoring**

- Implementar dashboard de seguridad
- Configurar alertas automáticas
- Crear métricas de seguridad
- Establecer SLAs de respuesta

## 📞 Soporte y Comunidad

### **Comunidades**

- [OWASP Community](https://owasp.org/membership/)
- [Node.js Security Working Group](https://github.com/nodejs/security-wg)
- [Information Security Stack Exchange](https://security.stackexchange.com/)

### **Reportar Vulnerabilidades**

- [Node.js Security](https://nodejs.org/en/security/)
- [HackerOne](https://hackerone.com/)
- [CVE Database](https://cve.mitre.org/)

¡Mantente siempre actualizado con las últimas prácticas de seguridad! 🛡️
