# 🛡️ Recursos del Día 17 - Security & Best Practices

## 📋 Contenido de Recursos

### **1. Templates de Configuración**

- [Security Configuration Templates](#security-config)
- [Docker Security Configuration](#docker-security)
- [Nginx Security Headers](#nginx-security)
- [Environment Variables Template](#env-template)

### **2. Scripts de Automatización**

- [Security Audit Script](#security-audit)
- [Vulnerability Scanner](#vulnerability-scanner)
- [Security Test Runner](#security-tests)

### **3. Documentación de Referencia**

- [OWASP Top 10 Checklist](#owasp-checklist)
- [Security Headers Reference](#headers-reference)
- [MFA Implementation Guide](#mfa-guide)

### **4. Herramientas y Utilidades**

- [Security Monitoring Tools](#monitoring-tools)
- [Testing Tools](#testing-tools)
- [Development Tools](#dev-tools)

---

## 🔧 Security Configuration Templates {#security-config}

### **Backend Security Configuration**

```javascript
// config/security.js - Template de configuración de seguridad
const securityConfig = {
  // Configuración de autenticación
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiration: '24h',
    refreshTokenExpiration: '7d',
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireLowercase: true,
    passwordRequireNumbers: true,
    passwordRequireSymbols: true,
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutos
  },

  // Configuración MFA
  mfa: {
    issuer: 'TechStore',
    windowTolerance: 2,
    backupCodesCount: 10,
    secretLength: 32,
    qrCodeSize: 200,
  },

  // Rate Limiting
  rateLimiting: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // límite de requests por ventana
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
    keyGenerator: req => req.ip,
    handler: (req, res) => {
      res.status(429).json({
        error: 'Demasiadas solicitudes',
        retryAfter: Math.round(req.rateLimit.resetTime / 1000),
      });
    },
  },

  // Content Security Policy
  csp: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
      fontSrc: ["'self'", 'fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https:'],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", 'ws:', 'wss:'],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },

  // CORS Configuration
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  },

  // Session Configuration
  session: {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 horas
      sameSite: 'strict',
    },
  },

  // Security Monitoring
  monitoring: {
    enableSecurityEvents: true,
    enableAuditLog: true,
    maxEventsPerQuery: 1000,
    eventRetentionDays: 90,
    alertThresholds: {
      loginFailures: 5,
      mfaFailures: 3,
      suspiciousActivity: 10,
      criticalErrors: 1,
    },
  },
};

module.exports = securityConfig;
```

### **Frontend Security Configuration**

```javascript
// src/config/security.js - Configuración de seguridad frontend
const securityConfig = {
  // API Configuration
  api: {
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001',
    timeout: 10000,
    retryAttempts: 3,
    retryDelay: 1000,
  },

  // Authentication
  auth: {
    tokenKey: 'techstore_token',
    refreshTokenKey: 'techstore_refresh_token',
    tokenExpiration: 24 * 60 * 60 * 1000, // 24 horas
    autoRefreshThreshold: 5 * 60 * 1000, // 5 minutos
  },

  // Input Validation
  validation: {
    maxInputLength: 1000,
    allowedFileTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
    ],
    maxFileSize: 5 * 1024 * 1024, // 5MB
    sanitizeHTML: true,
    escapeSpecialChars: true,
  },

  // Security Headers para requests
  defaultHeaders: {
    'X-Requested-With': 'XMLHttpRequest',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache',
  },

  // Content Security Policy para desarrollo
  devCSP: {
    'script-src': ["'self'", "'unsafe-eval'", "'unsafe-inline'"],
    'style-src': ["'self'", "'unsafe-inline'"],
    'connect-src': ["'self'", 'ws:', 'wss:'],
  },
};

export default securityConfig;
```

Ver archivos completos en los siguientes enlaces:

- [security-config.js](./templates/security-config.js)
- [docker-compose.security.yml](./templates/docker-compose.security.yml)
- [nginx-security.conf](./templates/nginx-security.conf)
- [.env.security.template](./templates/.env.security.template)

---

## 📜 Scripts de Automatización

### **Security Audit Script**

- [security-audit.sh](./scripts/security-audit.sh) - Script comprehensivo de auditoría de seguridad
- [vulnerability-scan.sh](./scripts/vulnerability-scan.sh) - Scanner de vulnerabilidades automatizado
- [security-test-runner.sh](./scripts/security-test-runner.sh) - Ejecutor de tests de seguridad

### **Monitoring Scripts**

- [health-check.sh](./scripts/health-check.sh) - Verificación de salud del sistema
- [log-analyzer.sh](./scripts/log-analyzer.sh) - Analizador de logs de seguridad
- [alert-sender.sh](./scripts/alert-sender.sh) - Sistema de alertas automático

---

## 📚 Documentación de Referencia

### **Security Checklists**

- [OWASP_TOP_10_CHECKLIST.md](./docs/OWASP_TOP_10_CHECKLIST.md) - Checklist completo OWASP Top 10
- [SECURITY_HEADERS_GUIDE.md](./docs/SECURITY_HEADERS_GUIDE.md) - Guía de security headers
- [MFA_IMPLEMENTATION_GUIDE.md](./docs/MFA_IMPLEMENTATION_GUIDE.md) - Guía de implementación MFA

### **Best Practices**

- [SECURE_CODING_PRACTICES.md](./docs/SECURE_CODING_PRACTICES.md) - Prácticas de código seguro
- [INCIDENT_RESPONSE_PLAN.md](./docs/INCIDENT_RESPONSE_PLAN.md) - Plan de respuesta a incidentes
- [SECURITY_POLICIES.md](./docs/SECURITY_POLICIES.md) - Políticas de seguridad

---

## 🔍 Herramientas de Testing

### **Automated Security Testing**

```bash
# Ejecutar tests de seguridad
./scripts/run-security-tests.sh

# Scan de vulnerabilidades
./scripts/vulnerability-scan.sh --target localhost:3000

# Audit de dependencias
npm audit --audit-level moderate

# Test de penetración básico
./scripts/basic-pentest.sh
```

### **Security Monitoring Tools**

- **Security Dashboard** - Dashboard en tiempo real de eventos de seguridad
- **Vulnerability Scanner** - Scanner automatizado de vulnerabilidades
- **Log Analyzer** - Analizador de logs con detección de patrones
- **Alert System** - Sistema de alertas configurable

---

## 📊 Métricas y Reporting

### **Security Metrics Dashboard**

- Eventos de seguridad en tiempo real
- Métricas de autenticación y autorización
- Análisis de vulnerabilidades
- Adopción de MFA
- Patrones de tráfico sospechoso

### **Automated Reports**

- Reporte diario de seguridad
- Análisis semanal de vulnerabilidades
- Reporte mensual de incidentes
- Auditoría trimestral de seguridad

---

## 🎯 Quick Start Guide

### **1. Configuración Inicial**

```bash
# Copiar templates de configuración
cp recursos/templates/.env.security.template .env
cp recursos/templates/docker-compose.security.yml docker-compose.yml

# Generar secrets seguros
./scripts/generate-secrets.sh

# Configurar security headers
cp recursos/templates/nginx-security.conf nginx/security.conf
```

### **2. Ejecutar Security Audit**

```bash
# Ejecutar auditoría completa
./recursos/scripts/security-audit.sh

# Ver resultados
open ./security-reports/latest/SECURITY_AUDIT_SUMMARY.md
```

### **3. Configurar Monitoring**

```bash
# Iniciar servicios de monitoreo
docker-compose -f docker-compose.security.yml up -d

# Verificar salud del sistema
./recursos/scripts/health-check.sh
```

---

## 📞 Soporte y Documentación

### **Enlaces Útiles**

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Mozilla Security Guidelines](https://infosec.mozilla.org/guidelines/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)

### **Herramientas Recomendadas**

- **OWASP ZAP** - Proxy de seguridad para testing
- **npm audit** - Auditoría de dependencias Node.js
- **Snyk** - Scanner de vulnerabilidades
- **SonarQube** - Análisis de calidad y seguridad de código

---

¡Utiliza estos recursos para implementar una seguridad robusta en tu aplicación TechStore! 🛡️
