/**
 * 🔐 Ejercicio 08: Security Headers y Best Practices
 *
 * Conceptos fundamentales:
 * - Security Headers: Headers HTTP para protección
 * - CSP: Content Security Policy
 * - HSTS: HTTP Strict Transport Security
 * - Helmet: Middleware de seguridad para Express
 *
 * Objetivos:
 * - Implementar headers de seguridad esenciales
 * - Configurar CSP (Content Security Policy)
 * - Aplicar HSTS y otras protecciones
 * - Crear middleware de seguridad personalizado
 */

const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Estadísticas de seguridad
const estadisticasSeguridad = {
  requestsSecuros: 0,
  headersAplicados: 0,
  violacionesCSP: 0,
  intentosXSS: 0,
  requestsHTTPS: 0,
};

// 1. CONFIGURACIÓN BÁSICA DE HELMET

/**
 * Configuración básica de Helmet con todos los headers de seguridad
 */
app.use(
  helmet({
    // Content Security Policy
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: [],
      },
      reportOnly: false,
    },

    // HTTP Strict Transport Security
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

    // X-XSS-Protection
    xssFilter: true,

    // Referrer-Policy
    referrerPolicy: {
      policy: 'same-origin',
    },

    // Permissions-Policy
    permissionsPolicy: {
      camera: [],
      microphone: [],
      geolocation: [],
      payment: [],
    },
  })
);

// 2. MIDDLEWARE DE SEGURIDAD PERSONALIZADO

/**
 * Middleware para headers de seguridad adicionales
 */
const headersSeguridad = (req, res, next) => {
  // Server header (ocultar información del servidor)
  res.removeHeader('X-Powered-By');

  // Headers personalizados de seguridad
  res.setHeader('X-API-Version', '1.0');
  res.setHeader('X-Security-Level', 'HIGH');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Download-Options', 'noopen');
  res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');

  // Cache control para contenido sensible
  if (req.path.includes('/admin') || req.path.includes('/private')) {
    res.setHeader(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, private'
    );
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }

  // HTTPS enforcement
  if (
    req.headers['x-forwarded-proto'] !== 'https' &&
    process.env.NODE_ENV === 'production'
  ) {
    return res.redirect(301, `https://${req.headers.host}${req.url}`);
  }

  estadisticasSeguridad.headersAplicados++;

  if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
    estadisticasSeguridad.requestsHTTPS++;
  }

  next();
};

// 3. CONTENT SECURITY POLICY AVANZADO

/**
 * CSP personalizado por ruta
 */
const cspPorRuta = {
  '/admin': {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:'],
      connectSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'none'"],
      frameSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
    },
  },

  '/api': {
    directives: {
      defaultSrc: ["'none'"],
      connectSrc: ["'self'"],
      frameAncestors: ["'none'"],
    },
  },

  '/public': {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        'https://fonts.googleapis.com',
        'https://cdn.jsdelivr.net',
      ],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      scriptSrc: ["'self'", 'https://cdn.jsdelivr.net'],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
    },
  },
};

/**
 * Middleware para aplicar CSP específico por ruta
 */
const aplicarCSPPorRuta = (req, res, next) => {
  const ruta = Object.keys(cspPorRuta).find(path => req.path.startsWith(path));

  if (ruta) {
    const csp = cspPorRuta[ruta];
    const directivas = Object.entries(csp.directives)
      .map(
        ([key, values]) =>
          `${key.replace(/([A-Z])/g, '-$1').toLowerCase()} ${values.join(' ')}`
      )
      .join('; ');

    res.setHeader('Content-Security-Policy', directivas);
    console.log(`🛡️  CSP aplicado para ${ruta}: ${directivas}`);
  }

  next();
};

// 4. MIDDLEWARE DE MONITOREO DE SEGURIDAD

/**
 * Middleware para monitorear violaciones de seguridad
 */
const monitorearSeguridad = (req, res, next) => {
  const ip = req.ip;
  const userAgent = req.get('User-Agent') || '';
  const referer = req.get('Referer') || '';

  // Detectar posibles ataques XSS en headers
  const headersRiesgosos = ['user-agent', 'referer', 'x-forwarded-for'];

  for (const header of headersRiesgosos) {
    const valor = req.get(header);
    if (valor && /<script|javascript:|onload|onerror|onclick/i.test(valor)) {
      estadisticasSeguridad.intentosXSS++;

      console.log(`🚨 Posible XSS en header ${header}: ${valor}`);

      return res.status(400).json({
        error: 'Contenido malicioso detectado',
        mensaje: 'Se detectó contenido potencialmente malicioso en los headers',
        codigo: 'SECURITY_VIOLATION',
      });
    }
  }

  // Detectar user agents sospechosos
  const userAgentsSospechosos = [
    'sqlmap',
    'nikto',
    'nmap',
    'masscan',
    'nessus',
    'openvas',
    'w3af',
    'skipfish',
    'gobuster',
    'dirb',
    'dirbuster',
  ];

  if (userAgentsSospechosos.some(ua => userAgent.toLowerCase().includes(ua))) {
    console.log(`🤖 User agent sospechoso detectado: ${userAgent}`);

    return res.status(403).json({
      error: 'Acceso denegado',
      mensaje:
        'Tu user agent ha sido identificado como herramienta de seguridad',
      codigo: 'SUSPICIOUS_USER_AGENT',
    });
  }

  // Log de request para auditoría
  console.log(
    `📊 Request: ${req.method} ${
      req.path
    } - IP: ${ip} - UA: ${userAgent.substring(0, 50)}...`
  );

  estadisticasSeguridad.requestsSecuros++;
  next();
};

// 5. ENDPOINTS DE REPORTE CSP

/**
 * Endpoint para recibir reportes de violaciones CSP
 */
app.post(
  '/csp-report',
  express.json({ type: 'application/csp-report' }),
  (req, res) => {
    const report = req.body;

    estadisticasSeguridad.violacionesCSP++;

    console.log('🚨 Violación CSP reportada:', JSON.stringify(report, null, 2));

    // En producción, aquí enviarías el reporte a un sistema de monitoreo

    res.status(204).send();
  }
);

/**
 * Endpoint para reportes de violaciones de seguridad
 */
app.post('/security-report', (req, res) => {
  const { tipo, detalles, url, userAgent } = req.body;

  console.log(`🔒 Reporte de seguridad: ${tipo} - ${detalles}`);

  // Registrar en sistema de monitoreo
  const reporte = {
    tipo,
    detalles,
    url,
    userAgent,
    ip: req.ip,
    timestamp: new Date(),
  };

  res.json({
    mensaje: 'Reporte de seguridad recibido',
    id: Date.now(),
    timestamp: new Date(),
  });
});

// 6. APLICAR MIDDLEWARES

app.use(headersSeguridad);
app.use(aplicarCSPPorRuta);
app.use(monitorearSeguridad);

// 7. RUTAS DE EJEMPLO

/**
 * Ruta principal con headers de seguridad
 */
app.get('/', (req, res) => {
  res.json({
    mensaje: 'API con headers de seguridad',
    security: {
      headers: Object.keys(res.getHeaders()),
      https: req.secure || req.headers['x-forwarded-proto'] === 'https',
      csp: res.get('Content-Security-Policy')
        ? 'Configurado'
        : 'No configurado',
    },
    timestamp: new Date(),
  });
});

/**
 * Ruta pública con CSP relajado
 */
app.get('/public/page', (req, res) => {
  res.json({
    mensaje: 'Página pública',
    csp: 'CSP relajado para contenido público',
    headers: {
      'Content-Security-Policy': res.get('Content-Security-Policy'),
    },
    timestamp: new Date(),
  });
});

/**
 * Ruta de administración con CSP estricto
 */
app.get('/admin/dashboard', (req, res) => {
  res.json({
    mensaje: 'Dashboard de administración',
    csp: 'CSP estricto para área administrativa',
    security: {
      level: 'HIGH',
      headers: Object.keys(res.getHeaders()),
      cacheControl: res.get('Cache-Control'),
    },
    timestamp: new Date(),
  });
});

/**
 * Ruta de API con CSP mínimo
 */
app.get('/api/data', (req, res) => {
  res.json({
    mensaje: 'Datos de API',
    csp: 'CSP mínimo para API REST',
    data: {
      items: [1, 2, 3, 4, 5],
      total: 5,
    },
    timestamp: new Date(),
  });
});

// 8. RUTAS DE TESTING DE SEGURIDAD

/**
 * Ruta para probar headers de seguridad
 */
app.get('/test-headers', (req, res) => {
  const headers = res.getHeaders();
  const securityHeaders = {};

  // Filtrar solo headers de seguridad
  const headersSeguridad = [
    'content-security-policy',
    'strict-transport-security',
    'x-frame-options',
    'x-content-type-options',
    'x-xss-protection',
    'referrer-policy',
    'permissions-policy',
  ];

  headersSeguridad.forEach(header => {
    securityHeaders[header] = headers[header] || 'No configurado';
  });

  res.json({
    mensaje: 'Test de headers de seguridad',
    headers: securityHeaders,
    total: Object.keys(securityHeaders).length,
    timestamp: new Date(),
  });
});

/**
 * Ruta para probar CSP
 */
app.get('/test-csp', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Test CSP</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .alert { background: #f8d7da; border: 1px solid #f5c6cb; padding: 10px; border-radius: 4px; }
      </style>
    </head>
    <body>
      <h1>Test de Content Security Policy</h1>
      <div class="alert">
        <strong>Nota:</strong> Este script debería ser bloqueado por CSP:
        <script>console.log('Este script debería ser bloqueado por CSP')</script>
      </div>
      <p>Si CSP está funcionando correctamente, verás errores en la consola del navegador.</p>
      <script>
        // Este script inline debería ser bloqueado
        alert('Si ves esta alerta, CSP no está funcionando correctamente');
      </script>
    </body>
    </html>
  `);
});

// 9. RUTAS DE ADMINISTRACIÓN Y ESTADÍSTICAS

/**
 * Ruta para ver estadísticas de seguridad
 */
app.get('/admin/security-stats', (req, res) => {
  res.json({
    mensaje: 'Estadísticas de seguridad',
    estadisticas: estadisticasSeguridad,
    porcentajes: {
      httpsUsage:
        estadisticasSeguridad.requestsHTTPS > 0
          ? (
              (estadisticasSeguridad.requestsHTTPS /
                estadisticasSeguridad.requestsSecuros) *
              100
            ).toFixed(2) + '%'
          : '0%',
      cspViolationRate:
        estadisticasSeguridad.violacionesCSP > 0
          ? (
              (estadisticasSeguridad.violacionesCSP /
                estadisticasSeguridad.requestsSecuros) *
              100
            ).toFixed(2) + '%'
          : '0%',
    },
    timestamp: new Date(),
  });
});

/**
 * Ruta para configurar headers de seguridad dinámicamente
 */
app.post(
  '/admin/configure-security',
  [
    body('csp').optional().isObject(),
    body('hsts').optional().isBoolean(),
    body('xssProtection').optional().isBoolean(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Datos inválidos',
        errores: errors.array(),
      });
    }

    const { csp, hsts, xssProtection } = req.body;

    // Aplicar configuración dinámica
    if (csp) {
      console.log('📝 Configuración CSP actualizada');
    }

    if (hsts !== undefined) {
      console.log(`📝 HSTS ${hsts ? 'activado' : 'desactivado'}`);
    }

    if (xssProtection !== undefined) {
      console.log(
        `📝 XSS Protection ${xssProtection ? 'activado' : 'desactivado'}`
      );
    }

    res.json({
      mensaje: 'Configuración de seguridad actualizada',
      configuracion: { csp, hsts, xssProtection },
      timestamp: new Date(),
    });
  }
);

// 10. RATE LIMITING PARA PROTECCIÓN ADICIONAL

const limiteSeguridad = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 1000, // 1000 requests por IP
  message: {
    error: 'Límite de seguridad excedido',
    mensaje: 'Demasiadas solicitudes desde tu IP',
  },
  standardHeaders: true,
});

app.use('/admin', limiteSeguridad);

// 11. TESTING Y DEMOSTRACIÓN
const PORT = 3008;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(
      `🔐 Servidor con headers de seguridad ejecutándose en puerto ${PORT}`
    );
    console.log('\n📋 Pruebas sugeridas:');
    console.log('1. Headers principales: GET http://localhost:3008/');
    console.log('2. Test headers: GET http://localhost:3008/test-headers');
    console.log(
      '3. Test CSP: GET http://localhost:3008/test-csp (abrir en navegador)'
    );
    console.log('4. Página pública: GET http://localhost:3008/public/page');
    console.log(
      '5. Admin dashboard: GET http://localhost:3008/admin/dashboard'
    );
    console.log('6. API data: GET http://localhost:3008/api/data');
    console.log(
      '7. Estadísticas: GET http://localhost:3008/admin/security-stats'
    );
    console.log('8. Reporte CSP: POST http://localhost:3008/csp-report');
    console.log('\n🎯 Conceptos clave:');
    console.log('- CSP: Content Security Policy para prevenir XSS');
    console.log('- HSTS: HTTP Strict Transport Security');
    console.log('- X-Frame-Options: Prevenir clickjacking');
    console.log('- X-Content-Type-Options: Prevenir MIME sniffing');
    console.log('\n💡 Inspeccionar headers:');
    console.log('- Usa DevTools > Network para ver headers');
    console.log('- Revisa la consola para violaciones CSP');
    console.log('- Prueba con diferentes user agents');
    console.log('- Verifica HTTPS redirects');
  });
}

module.exports = {
  app,
  headersSeguridad,
  aplicarCSPPorRuta,
  monitorearSeguridad,
  estadisticasSeguridad,
};

// 🎪 Mini Reto: Implementa un sistema de security headers adaptativos
class SecurityHeadersAdapter {
  constructor() {
    this.profiles = {
      strict: {
        csp: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'"],
          imgSrc: ["'self'", 'data:'],
          connectSrc: ["'self'"],
          objectSrc: ["'none'"],
          frameSrc: ["'none'"],
        },
        hsts: { maxAge: 31536000, includeSubDomains: true },
        frameOptions: 'DENY',
      },

      moderate: {
        csp: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'"],
          objectSrc: ["'none'"],
          frameSrc: ["'self'"],
        },
        hsts: { maxAge: 86400, includeSubDomains: false },
        frameOptions: 'SAMEORIGIN',
      },

      relaxed: {
        csp: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          styleSrc: ["'self'", "'unsafe-inline'", 'https:'],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'", 'https:'],
          objectSrc: ["'self'"],
          frameSrc: ["'self'", 'https:'],
        },
        hsts: { maxAge: 0 },
        frameOptions: 'SAMEORIGIN',
      },
    };
  }

  getMiddleware(profileName = 'moderate') {
    const profile = this.profiles[profileName];

    if (!profile) {
      throw new Error(`Perfil de seguridad no encontrado: ${profileName}`);
    }

    return (req, res, next) => {
      // Aplicar CSP
      const cspDirectives = Object.entries(profile.csp)
        .map(
          ([key, values]) =>
            `${key.replace(/([A-Z])/g, '-$1').toLowerCase()} ${values.join(
              ' '
            )}`
        )
        .join('; ');

      res.setHeader('Content-Security-Policy', cspDirectives);

      // Aplicar HSTS
      if (profile.hsts.maxAge > 0) {
        let hstsValue = `max-age=${profile.hsts.maxAge}`;
        if (profile.hsts.includeSubDomains) {
          hstsValue += '; includeSubDomains';
        }
        res.setHeader('Strict-Transport-Security', hstsValue);
      }

      // Aplicar X-Frame-Options
      res.setHeader('X-Frame-Options', profile.frameOptions);

      // Headers adicionales
      res.setHeader('X-Security-Profile', profileName.toUpperCase());
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-XSS-Protection', '1; mode=block');

      console.log(`🛡️  Perfil de seguridad aplicado: ${profileName}`);
      next();
    };
  }

  createCustomProfile(name, config) {
    this.profiles[name] = config;
    return this.getMiddleware(name);
  }
}

// Ejemplo de uso
const securityAdapter = new SecurityHeadersAdapter();

app.get(
  '/strict-security',
  securityAdapter.getMiddleware('strict'),
  (req, res) => {
    res.json({
      mensaje: 'Endpoint con seguridad estricta',
      profile: 'strict',
      timestamp: new Date(),
    });
  }
);

app.get(
  '/relaxed-security',
  securityAdapter.getMiddleware('relaxed'),
  (req, res) => {
    res.json({
      mensaje: 'Endpoint con seguridad relajada',
      profile: 'relaxed',
      timestamp: new Date(),
    });
  }
);

// Crear perfil personalizado
const customProfile = securityAdapter.createCustomProfile('api-only', {
  csp: {
    defaultSrc: ["'none'"],
    connectSrc: ["'self'"],
  },
  hsts: { maxAge: 3600, includeSubDomains: true },
  frameOptions: 'DENY',
});

app.get('/api-only', customProfile, (req, res) => {
  res.json({
    mensaje: 'API con perfil de seguridad personalizado',
    profile: 'api-only',
    timestamp: new Date(),
  });
});
