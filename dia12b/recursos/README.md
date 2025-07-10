# 📚 Recursos Día 12B - Protecciones Avanzadas

## 🎯 Objetivo de los Recursos

Material complementario para implementar protecciones avanzadas de seguridad en APIs.

## 🛡️ Documentación de Referencia

### **Rate Limiting**

- [Express Rate Limit](https://www.npmjs.com/package/express-rate-limit)
- [Rate Limiting Strategies](https://blog.logrocket.com/rate-limiting-node-js/)
- [DDoS Protection Best Practices](https://www.cloudflare.com/learning/ddos/ddos-mitigation/)

### **CORS Security**

- [CORS MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Express CORS](https://www.npmjs.com/package/cors)
- [CORS Security Best Practices](https://blog.detectify.com/2018/04/26/cors-misconfigurations-explained/)

### **Input Validation**

- [Joi Documentation](https://joi.dev/)
- [Express Validator](https://express-validator.github.io/)
- [Input Validation Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)

### **SQL Injection Prevention**

- [OWASP SQL Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
- [Parameterized Queries](https://www.w3schools.com/sql/sql_injection.asp)
- [Node.js SQL Security](https://blog.risingstack.com/node-js-security-checklist/)

### **Security Headers**

- [Helmet.js Documentation](https://helmetjs.github.io/)
- [Security Headers Guide](https://securityheaders.com/)
- [Content Security Policy](https://content-security-policy.com/)

## 🧪 Herramientas de Testing

### **Security Testing Tools**

```bash
# Análisis de vulnerabilidades
pnpm audit
npm audit fix

# Testing de seguridad
pnpm install -D jest supertest
```

### **Comandos de Testing Manual**

```bash
# Test de rate limiting
curl -X GET http://localhost:3001/api/test

# Test de CORS
curl -X GET http://localhost:3001/api/test \
  -H "Origin: https://malicious-site.com"

# Test de SQL injection
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -d '{"nombre":"'; DROP TABLE users; --"}'

# Test de XSS
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -d '{"nombre":"<script>alert('XSS')</script>"}'
```

## 📊 Métricas de Seguridad

### **Indicadores Clave**

- Requests bloqueados por rate limiting
- Violaciones de CORS detectadas
- Intentos de SQL injection bloqueados
- Ataques XSS prevenidos
- Headers de seguridad implementados

### **Logs de Seguridad**

```javascript
// Ejemplo de estructura de logs
{
  timestamp: "2025-07-09T12:00:00Z",
  level: "WARN",
  event: "SECURITY_VIOLATION",
  type: "SQL_INJECTION_ATTEMPT",
  ip: "192.168.1.100",
  userAgent: "Mozilla/5.0...",
  payload: "malicious_input_here"
}
```

## 🎯 Checklist de Implementación

### **Rate Limiting**

- [ ] Configurar límites por IP
- [ ] Implementar límites por usuario
- [ ] Configurar límites por endpoint
- [ ] Implementar whitelist de IPs
- [ ] Configurar mensajes de error apropiados

### **CORS**

- [ ] Configurar orígenes permitidos
- [ ] Implementar preflight handling
- [ ] Configurar headers permitidos
- [ ] Implementar credentials policy
- [ ] Configurar métodos permitidos

### **Input Validation**

- [ ] Implementar validación con Joi
- [ ] Sanitizar todos los inputs
- [ ] Validar tipos de datos
- [ ] Implementar límites de longitud
- [ ] Validar formatos específicos

### **SQL Injection Prevention**

- [ ] Usar consultas parametrizadas
- [ ] Validar inputs SQL
- [ ] Implementar escape de caracteres
- [ ] Usar ORM/Query Builder
- [ ] Auditar consultas existentes

### **Security Headers**

- [ ] Implementar Helmet middleware
- [ ] Configurar CSP headers
- [ ] Implementar HSTS
- [ ] Configurar X-Frame-Options
- [ ] Implementar X-Content-Type-Options

## 🚨 Vulnerabilidades Comunes

### **Rate Limiting Bypass**

- Rotar IPs (IP rotation)
- Usar proxies distribuidos
- Explotar inconsistencias en límites

### **CORS Misconfigurations**

- Wildcard con credentials
- Orígenes dinámicos mal validados
- Preflight bypass

### **Input Validation Bypass**

- Encoding bypass
- Double encoding
- Unicode normalization

### **SQL Injection Variants**

- Blind SQL injection
- Time-based SQL injection
- Second-order SQL injection

### **Header Bypass**

- Missing security headers
- Weak CSP policies
- Inadequate HSTS configuration

## 🔧 Configuración de Producción

### **Variables de Entorno**

```env
# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
RATE_LIMIT_AUTH_MAX=5

# CORS
CORS_ORIGIN=https://mi-app.com
CORS_CREDENTIALS=true

# Security
HELMET_CSP_ENABLED=true
HELMET_HSTS_ENABLED=true
HELMET_HSTS_MAX_AGE=31536000

# Monitoring
SECURITY_MONITORING_ENABLED=true
SECURITY_ALERT_EMAIL=admin@mi-app.com
```

### **Configuración de Logs**

```javascript
// winston.config.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: 'logs/security.log',
      level: 'warn',
    }),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
  ],
});
```

## 🎪 Retos Adicionales

### **Reto 1: Security Dashboard**

Crear un dashboard para monitorear eventos de seguridad en tiempo real.

### **Reto 2: Automated Response**

Implementar respuestas automáticas a amenazas detectadas.

### **Reto 3: Threat Intelligence**

Integrar feeds de inteligencia de amenazas para mejorar la detección.

### **Reto 4: Compliance Validation**

Validar cumplimiento con estándares como OWASP Top 10.

## 📖 Lecturas Complementarias

### **Artículos Especializados**

- [API Security Best Practices](https://owasp.org/www-project-api-security/)
- [Node.js Security Best Practices](https://blog.risingstack.com/node-js-security-checklist/)
- [Express.js Security Guide](https://expressjs.com/en/advanced/best-practice-security.html)

### **Libros Recomendados**

- "Web Application Security" by Andrew Hoffman
- "API Security in Action" by Neil Madden
- "Node.js Security" by Deepal Jayasekara

## 🏆 Criterios de Evaluación WorldSkills

### **Técnico (60%)**

- Implementación correcta de todas las protecciones
- Configuración apropiada de cada componente
- Manejo seguro de errores y excepciones
- Logging y monitoreo implementado

### **Calidad (25%)**

- Código bien estructurado y documentado
- Mejores prácticas aplicadas
- Manejo de errores robusto
- Testing de seguridad implementado

### **Funcionalidad (15%)**

- Todas las protecciones funcionando
- API completamente segura
- Rendimiento no degradado
- Configuración de producción lista

---

## 🎯 Tips para el Éxito

1. **Implementa por capas** - Agrega protecciones gradualmente
2. **Testa constantemente** - Verifica cada protección implementada
3. **Documenta todo** - Explica cada configuración de seguridad
4. **Piensa como atacante** - Intenta romper tu propia seguridad
5. **Mantente actualizado** - Vulnerabilidades evolucionan constantemente

¡La seguridad es un proceso continuo, no un destino! 🛡️
