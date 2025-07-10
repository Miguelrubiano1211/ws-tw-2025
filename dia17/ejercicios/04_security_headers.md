# 🔒 Ejercicio 4: Security Headers Configuration

## 📋 Información del Ejercicio

**Duración:** 45 minutos  
**Dificultad:** ⭐⭐⭐  
**Prerequisitos:** Express.js servidor funcionando  
**Objetivos:** Configurar security headers comprehensivos y Content Security Policy

---

## 🎯 Objetivos de Aprendizaje

Al completar este ejercicio, el estudiante será capaz de:

- Configurar Helmet.js para security headers básicos
- Implementar Content Security Policy (CSP) personalizada
- Configurar HTTP Strict Transport Security (HSTS)
- Implementar clickjacking protection
- Configurar referrer policy y permissions policy
- Testing de security headers con herramientas online

---

## 📚 Conceptos Clave

### **Security Headers Principales**

- **Content-Security-Policy (CSP):** Previene XSS y injection attacks
- **Strict-Transport-Security (HSTS):** Fuerza conexiones HTTPS
- **X-Frame-Options:** Previene clickjacking attacks
- **X-Content-Type-Options:** Previene MIME type sniffing
- **Referrer-Policy:** Controla información de referrer
- **Permissions-Policy:** Controla APIs del browser

### **Helmet.js Benefits**

- Configuración centralizada de security headers
- Defaults seguros out-of-the-box
- Fácil customización por aplicación
- Actualización automática con mejores prácticas

---

## 🛠️ Tecnologías Utilizadas

- **helmet** - Security headers middleware
- **express** - Web framework
- **cors** - Cross-origin resource sharing
- **express-rate-limit** - Rate limiting (ya configurado)

---

## 📝 Instrucciones Paso a Paso

### **Paso 1: Instalación y Configuración Básica (5 minutos)**

```bash
# Verificar que helmet está instalado (ya debería estarlo del ejercicio anterior)
pnpm list helmet

# Si no está instalado:
# pnpm install helmet

# Instalar herramientas adicionales para testing
pnpm install -D node-fetch
```

### **Paso 2: Configuración Avanzada de Helmet.js (15 minutos)**

#### **2.1 Crear configuración completa de security headers**

```javascript
// config/security-headers.js
const helmet = require('helmet');

// Configuración de Content Security Policy
const cspConfig = {
  directives: {
    defaultSrc: ["'self'"],

    // Scripts: solo desde mismo origen y CDNs confiables
    scriptSrc: [
      "'self'",
      "'unsafe-inline'", // Solo para desarrollo, remover en producción
      'https://cdn.jsdelivr.net',
      'https://unpkg.com',
      'https://cdnjs.cloudflare.com',
    ],

    // Estilos: permitir inline styles para frameworks CSS
    styleSrc: [
      "'self'",
      "'unsafe-inline'",
      'https://fonts.googleapis.com',
      'https://cdn.jsdelivr.net',
      'https://unpkg.com',
    ],

    // Fuentes: permitir Google Fonts y fuentes locales
    fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],

    // Imágenes: permitir desde mismo origen, data URIs y CDNs
    imgSrc: ["'self'", 'data:', 'https:', 'blob:'],

    // Media: solo desde mismo origen
    mediaSrc: ["'self'"],

    // Objects: no permitir plugins
    objectSrc: ["'none'"],

    // Base URI: solo mismo origen
    baseUri: ["'self'"],

    // Form actions: solo mismo origen
    formAction: ["'self'"],

    // Frame ancestors: no permitir embedding
    frameAncestors: ["'none'"],

    // Manifest: solo mismo origen
    manifestSrc: ["'self'"],

    // Workers: solo mismo origen
    workerSrc: ["'self'"],

    // Upgrade insecure requests en producción
    upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null,

    // Block all mixed content
    blockAllMixedContent: process.env.NODE_ENV === 'production' ? [] : null,

    // Report URI para violaciones CSP
    reportUri: process.env.CSP_REPORT_URI || null,
  },

  // Configuración adicional
  reportOnly: process.env.NODE_ENV === 'development' ? true : false,

  // Usar nonces para scripts dinámicos (opcional)
  useDefaults: false,
};

// Configuración de HSTS
const hstsConfig = {
  maxAge: 31536000, // 1 año en segundos
  includeSubDomains: true,
  preload: true,
};

// Configuración de X-Frame-Options
const frameGuardConfig = {
  action: 'deny', // Opciones: 'deny', 'sameorigin', 'allow-from'
};

// Configuración de Referrer Policy
const referrerPolicyConfig = {
  policy: ['no-referrer', 'no-referrer-when-downgrade', 'same-origin'],
};

// Configuración de Permissions Policy (Feature Policy)
const permissionsPolicyConfig = {
  features: {
    accelerometer: ["'none'"],
    ambientLightSensor: ["'none'"],
    autoplay: ["'self'"],
    battery: ["'none'"],
    camera: ["'none'"],
    displayCapture: ["'none'"],
    documentDomain: ["'none'"],
    encryptedMedia: ["'self'"],
    executionWhileNotRendered: ["'none'"],
    executionWhileOutOfViewport: ["'none'"],
    fullscreen: ["'self'"],
    geolocation: ["'none'"],
    gyroscope: ["'none'"],
    magnetometer: ["'none'"],
    microphone: ["'none'"],
    midi: ["'none'"],
    navigationOverride: ["'none'"],
    payment: ["'none'"],
    pictureInPicture: ["'none'"],
    publicKeyCredentialsGet: ["'self'"],
    screenWakeLock: ["'none'"],
    speakerSelection: ["'none'"],
    syncXhr: ["'none'"],
    usb: ["'none'"],
    webShare: ["'self'"],
    xrSpatialTracking: ["'none'"],
  },
};

// Función para crear configuración de Helmet según el entorno
const createHelmetConfig = (isDevelopment = false) => {
  const config = {
    // Content Security Policy
    contentSecurityPolicy: isDevelopment ? false : cspConfig,

    // Cross Origin Embedder Policy
    crossOriginEmbedderPolicy: false, // Puede causar problemas con algunos CDNs

    // Cross Origin Opener Policy
    crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },

    // Cross Origin Resource Policy
    crossOriginResourcePolicy: { policy: 'cross-origin' },

    // DNS Prefetch Control
    dnsPrefetchControl: { allow: false },

    // X-Frame-Options
    frameguard: frameGuardConfig,

    // Hide X-Powered-By header
    hidePoweredBy: true,

    // HTTP Strict Transport Security
    hsts: process.env.NODE_ENV === 'production' ? hstsConfig : false,

    // IE No Open
    ieNoOpen: true,

    // X-Content-Type-Options
    noSniff: true,

    // Origin Agent Cluster
    originAgentCluster: true,

    // X-Permitted-Cross-Domain-Policies
    permittedCrossDomainPolicies: false,

    // Referrer Policy
    referrerPolicy: referrerPolicyConfig,

    // X-XSS-Protection (legacy, CSP es mejor)
    xssFilter: true,
  };

  return config;
};

module.exports = {
  createHelmetConfig,
  cspConfig,
  hstsConfig,
  frameGuardConfig,
  referrerPolicyConfig,
  permissionsPolicyConfig,
};
```

#### **2.2 Implementar middleware de security headers**

```javascript
// middleware/security-headers.js
const helmet = require('helmet');
const {
  createHelmetConfig,
  permissionsPolicyConfig,
} = require('../config/security-headers');

// Middleware principal de security headers
const securityHeaders = (req, res, next) => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const helmetConfig = createHelmetConfig(isDevelopment);

  // Aplicar configuración de Helmet
  helmet(helmetConfig)(req, res, err => {
    if (err) return next(err);

    // Headers adicionales personalizados
    applyCustomHeaders(req, res);

    next();
  });
};

// Función para aplicar headers personalizados
const applyCustomHeaders = (req, res) => {
  // Server header personalizado (ocultar información del servidor)
  res.removeHeader('Server');
  res.removeHeader('X-Powered-By');

  // Permissions Policy (Feature Policy)
  const permissionsPolicy = Object.entries(permissionsPolicyConfig.features)
    .map(([feature, allowList]) => `${feature}=(${allowList.join(' ')})`)
    .join(', ');

  res.setHeader('Permissions-Policy', permissionsPolicy);

  // Headers de seguridad adicionales
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Clear Site Data header para logout completo
  if (req.path === '/api/auth/logout') {
    res.setHeader('Clear-Site-Data', '"cache", "cookies", "storage"');
  }

  // Expect-CT header para Certificate Transparency
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Expect-CT', 'max-age=86400, enforce');
  }

  // Cross-Origin headers personalizados
  if (req.headers.origin) {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:3000',
    ];

    if (allowedOrigins.includes(req.headers.origin)) {
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
  }
};

// Middleware específico para CSP reporting
const cspReporting = (req, res, next) => {
  // Endpoint para recibir reports de violaciones CSP
  if (req.path === '/api/security/csp-report') {
    console.log('CSP Violation Report:', req.body);

    // Log de violación para análisis
    logSecurityViolation('CSP', req.body, req);

    return res.status(204).end();
  }

  next();
};

// Función para logging de violaciones de seguridad
const logSecurityViolation = (type, violation, req) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    type: type,
    violation: violation,
    userAgent: req.headers['user-agent'],
    ip: req.ip,
    url: req.url,
    referer: req.headers.referer,
  };

  // En producción, enviar a sistema de logging
  if (process.env.NODE_ENV === 'production') {
    // Ejemplo: enviar a servicio de logging
    console.error('Security Violation:', logEntry);
  } else {
    console.warn('Security Violation (Dev):', logEntry);
  }
};

// Middleware para headers específicos de API
const apiSecurityHeaders = (req, res, next) => {
  // Headers específicos para endpoints de API
  res.setHeader(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, private'
  );
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  // Content type validation para APIs
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    const contentType = req.headers['content-type'];

    if (!contentType || !contentType.includes('application/json')) {
      return res.status(415).json({
        error: 'Content-Type no soportado',
        details: 'Se requiere application/json',
      });
    }
  }

  next();
};

// Middleware para headers específicos de assets estáticos
const staticAssetsHeaders = (req, res, next) => {
  // Headers de cache para assets estáticos
  const staticExtensions = [
    '.js',
    '.css',
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
    '.svg',
    '.ico',
    '.woff',
    '.woff2',
  ];
  const isStaticAsset = staticExtensions.some(ext => req.path.endsWith(ext));

  if (isStaticAsset) {
    // Cache largo para assets con hash en el nombre
    if (req.path.includes('.')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=3600');
    }

    // Headers adicionales para assets
    res.setHeader('X-Content-Type-Options', 'nosniff');
  }

  next();
};

module.exports = {
  securityHeaders,
  cspReporting,
  apiSecurityHeaders,
  staticAssetsHeaders,
  logSecurityViolation,
};
```

### **Paso 3: Integrar Security Headers en la Aplicación (10 minutos)**

#### **3.1 Actualizar app.js principal**

```javascript
// app.js - Integrar security headers
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Importar middleware de seguridad
const {
  securityHeaders,
  cspReporting,
  apiSecurityHeaders,
  staticAssetsHeaders
} = require('./middleware/security-headers');

const app = express();

// 1. Security headers PRIMERO (antes que cualquier otro middleware)
app.use(securityHeaders);

// 2. CSP reporting endpoint (antes del JSON parser)
app.use(cspReporting);

// 3. CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];

    // Permitir requests sin origin (ej: mobile apps, Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  maxAge: 86400 // Cache preflight por 24 horas
};

app.use(cors(corsOptions));

// 4. Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 5. Logging
app.use(morgan('combined'));

// 6. Headers específicos para assets estáticos
app.use(staticAssetsHeaders);

// 7. Headers específicos para API routes
app.use('/api', apiSecurityHeaders);

// 8. Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/productos', require('./routes/productos'));
app.use('/api/mfa', require('./routes/mfa'));

// 9. Endpoint específico para CSP reports
app.post('/api/security/csp-report', express.json(), (req, res) => {
  console.log('CSP Violation:', req.body);
  res.status(204).end();
});

// 10. Static files con headers de seguridad
app.use(express.static('public', {
  setHeaders: (res, path) => {
    // Headers específicos para archivos estáticos
    res.setHeader('X-Content-Type-Options', 'nosniff');

    // Cache apropiado según tipo de archivo
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    } else if (path.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000');
    }
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  // No exponer stack traces en producción
  const errorResponse = {
    error: 'Error interno del servidor'
  };

  if (process.env.NODE_ENV === 'development') {
    errorResponse.details = err.message;
    errorResponse.stack = err.stack;
  }

  console.error('Error:', err);
  res.status(500).json(errorResponse);
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint no encontrado',
    message: `La ruta ${req.method} ${req.originalUrl} no existe`
  });
});

module.exports = app;
```

#### **3.2 Crear variables de entorno para configuración**

```bash
# .env - Variables de configuración de seguridad
# Agregar estas variables al archivo .env

# Security Configuration
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,https://your-domain.com

# CSP Reporting
CSP_REPORT_URI=https://your-domain.com/api/security/csp-report

# HSTS Configuration (solo en producción)
HSTS_MAX_AGE=31536000
HSTS_INCLUDE_SUBDOMAINS=true
HSTS_PRELOAD=true

# Additional Security Settings
TRUST_PROXY=true
SECURE_COOKIES=true
```

### **Paso 4: Testing y Validación de Headers (10 minutos)**

#### **4.1 Crear script de testing de headers**

```javascript
// scripts/test-security-headers.js
const fetch = require('node-fetch');

class SecurityHeadersTester {
  constructor(baseUrl = 'http://localhost:3001') {
    this.baseUrl = baseUrl;
    this.results = {};
  }

  async testAllHeaders() {
    console.log('🔍 Testing Security Headers...\n');

    // Test endpoints principales
    const endpoints = [
      '/',
      '/api/auth/login',
      '/api/productos',
      '/api/security/csp-report',
    ];

    for (const endpoint of endpoints) {
      await this.testEndpoint(endpoint);
    }

    this.generateReport();
  }

  async testEndpoint(endpoint) {
    try {
      console.log(`Testing: ${endpoint}`);

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          'User-Agent': 'SecurityTester/1.0',
        },
      });

      const headers = response.headers;
      const results = this.analyzeHeaders(headers);

      this.results[endpoint] = {
        status: response.status,
        headers: Object.fromEntries(headers.entries()),
        analysis: results,
      };

      console.log(`  Status: ${response.status}`);
      console.log(`  Score: ${results.score}/100\n`);
    } catch (error) {
      console.error(`Error testing ${endpoint}:`, error.message);
    }
  }

  analyzeHeaders(headers) {
    const analysis = {
      score: 0,
      checks: [],
      issues: [],
    };

    // Check Content-Security-Policy
    if (headers.get('content-security-policy')) {
      analysis.score += 20;
      analysis.checks.push('✅ Content-Security-Policy present');
    } else {
      analysis.issues.push('❌ Missing Content-Security-Policy');
    }

    // Check Strict-Transport-Security
    if (headers.get('strict-transport-security')) {
      analysis.score += 15;
      analysis.checks.push('✅ HSTS header present');
    } else {
      analysis.issues.push('⚠️ Missing HSTS header (normal in development)');
    }

    // Check X-Frame-Options
    if (headers.get('x-frame-options')) {
      analysis.score += 10;
      analysis.checks.push('✅ X-Frame-Options present');
    } else {
      analysis.issues.push('❌ Missing X-Frame-Options');
    }

    // Check X-Content-Type-Options
    if (headers.get('x-content-type-options')) {
      analysis.score += 10;
      analysis.checks.push('✅ X-Content-Type-Options present');
    } else {
      analysis.issues.push('❌ Missing X-Content-Type-Options');
    }

    // Check Referrer-Policy
    if (headers.get('referrer-policy')) {
      analysis.score += 10;
      analysis.checks.push('✅ Referrer-Policy present');
    } else {
      analysis.issues.push('❌ Missing Referrer-Policy');
    }

    // Check Permissions-Policy
    if (headers.get('permissions-policy')) {
      analysis.score += 10;
      analysis.checks.push('✅ Permissions-Policy present');
    } else {
      analysis.issues.push('❌ Missing Permissions-Policy');
    }

    // Check X-XSS-Protection
    if (headers.get('x-xss-protection')) {
      analysis.score += 5;
      analysis.checks.push('✅ X-XSS-Protection present');
    } else {
      analysis.issues.push('⚠️ Missing X-XSS-Protection');
    }

    // Check if X-Powered-By is hidden
    if (!headers.get('x-powered-by')) {
      analysis.score += 10;
      analysis.checks.push('✅ X-Powered-By header hidden');
    } else {
      analysis.issues.push('❌ X-Powered-By header exposed');
    }

    // Check Server header
    if (!headers.get('server')) {
      analysis.score += 5;
      analysis.checks.push('✅ Server header hidden');
    } else {
      analysis.issues.push('⚠️ Server header exposed');
    }

    // Check Cache-Control for sensitive endpoints
    const cacheControl = headers.get('cache-control');
    if (cacheControl && cacheControl.includes('no-store')) {
      analysis.score += 5;
      analysis.checks.push('✅ Appropriate cache control');
    }

    return analysis;
  }

  generateReport() {
    console.log('\n📊 SECURITY HEADERS REPORT');
    console.log('===========================\n');

    let totalScore = 0;
    let endpointCount = 0;

    for (const [endpoint, result] of Object.entries(this.results)) {
      console.log(`📍 ${endpoint}`);
      console.log(`   Score: ${result.analysis.score}/100`);

      if (result.analysis.checks.length > 0) {
        console.log('   Checks passed:');
        result.analysis.checks.forEach(check => console.log(`     ${check}`));
      }

      if (result.analysis.issues.length > 0) {
        console.log('   Issues found:');
        result.analysis.issues.forEach(issue => console.log(`     ${issue}`));
      }

      console.log('');

      totalScore += result.analysis.score;
      endpointCount++;
    }

    const averageScore = totalScore / endpointCount;
    console.log(`🎯 Average Security Score: ${averageScore.toFixed(1)}/100`);

    if (averageScore >= 80) {
      console.log('✅ Excellent security headers configuration!');
    } else if (averageScore >= 60) {
      console.log('⚠️ Good security headers, but room for improvement');
    } else {
      console.log('❌ Security headers need significant improvement');
    }
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  const tester = new SecurityHeadersTester();
  tester.testAllHeaders().catch(console.error);
}

module.exports = SecurityHeadersTester;
```

#### **4.2 Crear script para testing con herramientas online**

```javascript
// scripts/security-headers-check.js
const open = require('open');

const checkSecurityHeaders = async () => {
  const domain = process.env.DOMAIN || 'localhost:3001';
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const url = `${protocol}://${domain}`;

  console.log('🔍 Checking security headers with online tools...\n');

  // Lista de herramientas online para verificar headers
  const tools = [
    {
      name: 'Security Headers',
      url: `https://securityheaders.com/?q=${encodeURIComponent(
        url
      )}&followRedirects=on`,
    },
    {
      name: 'Mozilla Observatory',
      url: `https://observatory.mozilla.org/analyze/${domain}`,
    },
    {
      name: 'SSL Labs SSL Test',
      url: `https://www.ssllabs.com/ssltest/analyze.html?d=${domain}`,
    },
    {
      name: 'HSTS Preload',
      url: `https://hstspreload.org/?domain=${domain}`,
    },
  ];

  console.log('Opening security testing tools in browser...\n');

  for (const tool of tools) {
    console.log(`📖 ${tool.name}: ${tool.url}`);

    if (process.env.AUTO_OPEN_BROWSER !== 'false') {
      try {
        await open(tool.url);
        // Pequeña pausa entre aperturas
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.log(`   Could not auto-open browser for ${tool.name}`);
      }
    }
  }

  console.log('\n✅ Security testing tools opened!');
  console.log('📝 Please review the results and address any issues found.');
};

if (require.main === module) {
  checkSecurityHeaders().catch(console.error);
}

module.exports = { checkSecurityHeaders };
```

### **Paso 5: Documentación y Testing (5 minutos)**

#### **5.1 Crear guía de configuración**

````markdown
# Security Headers Configuration Guide

## Headers Implementados

### 1. Content-Security-Policy (CSP)

Previene XSS y injection attacks controlando qué recursos puede cargar la página.

### 2. Strict-Transport-Security (HSTS)

Fuerza conexiones HTTPS en producción.

### 3. X-Frame-Options

Previene clickjacking attacks.

### 4. X-Content-Type-Options

Previene MIME type sniffing attacks.

### 5. Referrer-Policy

Controla qué información de referrer se envía.

### 6. Permissions-Policy

Controla qué APIs del browser puede usar la aplicación.

## Testing

```bash
# Test local de headers
node scripts/test-security-headers.js

# Check con herramientas online
node scripts/security-headers-check.js
```
````

## Configuración por Entorno

### Development

- CSP en modo report-only
- HSTS deshabilitado
- Logging detallado de violaciones

### Production

- CSP enforced
- HSTS habilitado
- Logging a servicios externos

````

---

## ✅ Criterios de Validación

### **Headers Configuration**
- ✅ Helmet.js configurado correctamente
- ✅ CSP personalizada implementada
- ✅ HSTS configurado para producción
- ✅ Todos los headers OWASP recomendados presentes
- ✅ Headers específicos por tipo de endpoint

### **Testing & Validation**
- ✅ Script de testing automatizado funcionando
- ✅ Score de seguridad > 80/100
- ✅ Sin headers que expongan información sensible
- ✅ CSP reporting endpoint funcionando
- ✅ Configuración diferente para dev/prod

### **Performance Impact**
- ✅ Headers no afectan performance significativamente
- ✅ Cache control apropiado para assets
- ✅ CORS configurado eficientemente

---

## 🧪 Pruebas de Validación

### **1. Test básico de headers**
```bash
# Verificar headers en respuesta
curl -I http://localhost:3001/

# Verificar headers específicos
curl -H "Origin: http://localhost:3000" -I http://localhost:3001/api/productos
````

### **2. Test CSP violations**

```html
<!-- Intentar cargar script externo no permitido -->
<script src="https://evil.com/malicious.js"></script>
```

### **3. Test rate limiting con headers**

```bash
# Múltiples requests rápidos
for i in {1..10}; do curl -I http://localhost:3001/api/auth/login; done
```

---

## 📚 Recursos Adicionales

### **Herramientas Online**

- [Security Headers](https://securityheaders.com/) - Análisis de headers
- [Mozilla Observatory](https://observatory.mozilla.org/) - Security assessment
- [CSP Evaluator](https://csp-evaluator.withgoogle.com/) - CSP analysis

### **Referencias**

- [OWASP Secure Headers Project](https://owasp.org/www-project-secure-headers/)
- [Helmet.js Documentation](https://helmetjs.github.io/)
- [MDN Security Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers#Security)

---

## 🎯 Entregables

1. **Security Headers Config:** Configuración completa con Helmet.js
2. **CSP Policy:** Content Security Policy personalizada
3. **Testing Scripts:** Automatización de verificación de headers
4. **Environment Config:** Configuración por entorno (dev/prod)
5. **Documentation:** Guía de headers implementados
6. **Validation Report:** Reporte de security score

---

**¡Security Headers completados! La aplicación ahora tiene protecciones robustas a nivel de headers HTTP.**
