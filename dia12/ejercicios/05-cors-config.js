/**
 * 🔐 Ejercicio 05: CORS Configuration
 *
 * Conceptos fundamentales:
 * - CORS: Cross-Origin Resource Sharing
 * - Same-Origin Policy: Política de mismo origen
 * - Preflight Request: Solicitud previa para métodos complejos
 * - Whitelist: Lista de dominios permitidos
 *
 * Objetivos:
 * - Configurar CORS básico y avanzado
 * - Manejar preflight requests
 * - Implementar whitelist de dominios
 * - Configurar headers específicos para seguridad
 */

const express = require('express');
const cors = require('cors');
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Lista de dominios permitidos (whitelist)
const dominiosPermitidos = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://mi-app.com',
  'https://www.mi-app.com',
  'https://admin.mi-app.com',
];

// Estadísticas de requests CORS
const estadisticasCORS = {
  requestsPermitidas: 0,
  requestsRechazadas: 0,
  preflightRequests: 0,
  origenesUnicos: new Set(),
};

// 1. CONFIGURACIÓN CORS BÁSICA

/**
 * CORS básico - Permite todos los orígenes (NO USAR EN PRODUCCIÓN)
 */
const corsBasico = cors({
  origin: true, // Permite cualquier origen
  credentials: true, // Permite cookies
});

/**
 * CORS restrictivo - Solo dominios específicos
 */
const corsRestrictivo = cors({
  origin: (origin, callback) => {
    // Permitir requests sin origin (como Postman, aplicaciones móviles)
    if (!origin) {
      return callback(null, true);
    }

    // Verificar si el origin está en la whitelist
    if (dominiosPermitidos.includes(origin)) {
      estadisticasCORS.requestsPermitidas++;
      estadisticasCORS.origenesUnicos.add(origin);
      console.log(`✅ CORS permitido para origen: ${origin}`);
      return callback(null, true);
    }

    // Rechazar origen no permitido
    estadisticasCORS.requestsRechazadas++;
    console.log(`❌ CORS rechazado para origen: ${origin}`);
    return callback(new Error('No permitido por política CORS'), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count', 'X-API-Version'],
});

// 2. CONFIGURACIÓN CORS AVANZADA

/**
 * CORS con configuración por ambiente
 */
const corsConfig = {
  desarrollo: {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
    maxAge: 86400, // Cache preflight por 24 horas
  },
  produccion: {
    origin: ['https://mi-app.com', 'https://www.mi-app.com'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 3600, // Cache preflight por 1 hora
  },
};

const ambiente = process.env.NODE_ENV || 'desarrollo';
const corsAmbiente = cors(corsConfig[ambiente]);

// 3. CORS PERSONALIZADO CON VALIDACIÓN AVANZADA

/**
 * CORS personalizado con validación por subdominio
 */
const corsPersonalizado = (req, res, next) => {
  const origin = req.headers.origin;

  // Función para validar subdominio
  const esSubdominioValido = origin => {
    const dominioBase = 'mi-app.com';
    if (!origin) return false;

    try {
      const url = new URL(origin);
      return (
        url.hostname === dominioBase || url.hostname.endsWith(`.${dominioBase}`)
      );
    } catch (error) {
      return false;
    }
  };

  // Validar origen
  if (
    origin &&
    !esSubdominioValido(origin) &&
    !dominiosPermitidos.includes(origin)
  ) {
    return res.status(403).json({
      error: 'CORS Error',
      mensaje: 'Origen no permitido por política CORS',
      origen: origin,
      dominiosPermitidos: dominiosPermitidos,
    });
  }

  // Configurar headers CORS
  res.header('Access-Control-Allow-Origin', origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-API-Key'
  );
  res.header('Access-Control-Expose-Headers', 'X-Total-Count, X-API-Version');
  res.header('Access-Control-Max-Age', '3600');

  // Manejar preflight request
  if (req.method === 'OPTIONS') {
    estadisticasCORS.preflightRequests++;
    console.log(`🚁 Preflight request para ${req.path} desde ${origin}`);
    return res.status(200).end();
  }

  estadisticasCORS.requestsPermitidas++;
  estadisticasCORS.origenesUnicos.add(origin);

  next();
};

// 4. CONFIGURACIÓN CORS POR RUTA

/**
 * CORS específico para rutas de API pública
 */
const corsPublico = cors({
  origin: '*', // Cualquier origen para APIs públicas
  credentials: false,
  methods: ['GET'],
  allowedHeaders: ['Content-Type'],
});

/**
 * CORS específico para rutas de administración
 */
const corsAdmin = cors({
  origin: ['https://admin.mi-app.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Admin-Token'],
});

// 5. MIDDLEWARE DE MONITOREO CORS

/**
 * Middleware para registrar todas las requests CORS
 */
const monitoreoCORS = (req, res, next) => {
  const origin = req.headers.origin;
  const method = req.method;
  const path = req.path;

  console.log(
    `📡 Request CORS: ${method} ${path} desde ${origin || 'sin origen'}`
  );

  // Registrar en estadísticas
  if (origin) {
    estadisticasCORS.origenesUnicos.add(origin);
  }

  next();
};

// 6. APLICAR CONFIGURACIONES CORS

// Aplicar monitoreo a todas las rutas
app.use(monitoreoCORS);

// Rutas públicas con CORS permisivo
app.use('/api/publico', corsPublico);

// Rutas de administración con CORS restrictivo
app.use('/api/admin', corsAdmin);

// 7. RUTAS DE EJEMPLO

/**
 * Ruta pública - CORS permisivo
 */
app.get('/api/publico/info', (req, res) => {
  res.json({
    mensaje: 'API pública',
    timestamp: new Date(),
    cors: 'Permitido para cualquier origen',
    headers: {
      origin: req.headers.origin,
      userAgent: req.headers['user-agent'],
    },
  });
});

/**
 * Ruta protegida - CORS restrictivo
 */
app.get('/api/protegido/data', corsRestrictivo, (req, res) => {
  res.json({
    mensaje: 'Datos protegidos',
    timestamp: new Date(),
    cors: 'Solo dominios autorizados',
    origen: req.headers.origin,
    usuario: 'datos sensibles',
  });
});

/**
 * Ruta con CORS personalizado
 */
app.get('/api/custom/info', corsPersonalizado, (req, res) => {
  res.json({
    mensaje: 'API con CORS personalizado',
    timestamp: new Date(),
    cors: 'Validación por subdominio',
    origen: req.headers.origin,
  });
});

/**
 * Ruta de administración
 */
app.get('/api/admin/usuarios', (req, res) => {
  res.json({
    mensaje: 'Lista de usuarios (admin)',
    timestamp: new Date(),
    cors: 'Solo admin.mi-app.com',
    usuarios: ['admin', 'user1', 'user2'],
  });
});

// 8. RUTAS POST CON CORS (PREFLIGHT)

/**
 * Ruta POST que requiere preflight
 */
app.post('/api/datos', corsRestrictivo, (req, res) => {
  const { datos } = req.body;

  res.json({
    mensaje: 'Datos recibidos',
    timestamp: new Date(),
    datosRecibidos: datos,
    cors: 'Preflight requerido para POST',
  });
});

/**
 * Ruta PUT con headers personalizados
 */
app.put('/api/usuario/:id', corsPersonalizado, (req, res) => {
  const { id } = req.params;
  const { nombre, email } = req.body;

  res.json({
    mensaje: 'Usuario actualizado',
    id,
    datosActualizados: { nombre, email },
    timestamp: new Date(),
  });
});

// 9. RUTAS DE TESTING Y DEBUGGING

/**
 * Ruta para probar diferentes configuraciones CORS
 */
app.get('/test-cors/:tipo', (req, res) => {
  const { tipo } = req.params;

  // Aplicar CORS según el tipo
  const corsMiddleware = {
    basico: corsBasico,
    restrictivo: corsRestrictivo,
    personalizado: corsPersonalizado,
    ambiente: corsAmbiente,
  };

  if (corsMiddleware[tipo]) {
    corsMiddleware[tipo](req, res, () => {
      res.json({
        mensaje: `Test CORS ${tipo}`,
        origen: req.headers.origin,
        timestamp: new Date(),
      });
    });
  } else {
    res.status(400).json({
      error: 'Tipo de CORS no válido',
      tiposDisponibles: Object.keys(corsMiddleware),
    });
  }
});

/**
 * Ruta para ver estadísticas CORS
 */
app.get('/admin/cors-stats', (req, res) => {
  res.json({
    mensaje: 'Estadísticas CORS',
    estadisticas: {
      requestsPermitidas: estadisticasCORS.requestsPermitidas,
      requestsRechazadas: estadisticasCORS.requestsRechazadas,
      preflightRequests: estadisticasCORS.preflightRequests,
      origenesUnicos: Array.from(estadisticasCORS.origenesUnicos),
    },
    configuracion: {
      dominiosPermitidos,
      ambiente,
    },
    timestamp: new Date(),
  });
});

/**
 * Ruta para resetear estadísticas
 */
app.post('/admin/reset-cors-stats', (req, res) => {
  estadisticasCORS.requestsPermitidas = 0;
  estadisticasCORS.requestsRechazadas = 0;
  estadisticasCORS.preflightRequests = 0;
  estadisticasCORS.origenesUnicos.clear();

  res.json({
    mensaje: 'Estadísticas CORS reseteadas',
    timestamp: new Date(),
  });
});

// 10. MANEJO DE ERRORES CORS

/**
 * Middleware para manejar errores CORS
 */
app.use((err, req, res, next) => {
  if (err.message === 'No permitido por política CORS') {
    return res.status(403).json({
      error: 'CORS Error',
      mensaje: 'Tu dominio no está autorizado para acceder a esta API',
      origen: req.headers.origin,
      solucion:
        'Contacta al administrador para agregar tu dominio a la whitelist',
    });
  }

  next(err);
});

// 11. TESTING Y DEMOSTRACIÓN
const PORT = 3005;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🔐 Servidor CORS ejecutándose en puerto ${PORT}`);
    console.log('\n📋 Pruebas sugeridas:');
    console.log('1. API pública: GET http://localhost:3005/api/publico/info');
    console.log(
      '2. API protegida: GET http://localhost:3005/api/protegido/data'
    );
    console.log('   Origin: http://localhost:3000');
    console.log('3. API custom: GET http://localhost:3005/api/custom/info');
    console.log(
      '4. Test CORS: GET http://localhost:3005/test-cors/restrictivo'
    );
    console.log('5. Estadísticas: GET http://localhost:3005/admin/cors-stats');
    console.log('6. POST con preflight: POST http://localhost:3005/api/datos');
    console.log('   Origin: http://localhost:3000');
    console.log('   Body: { "datos": "test" }');
    console.log('\n🎯 Conceptos clave:');
    console.log('- Origin: Protocolo + dominio + puerto');
    console.log('- Preflight: OPTIONS request antes de POST/PUT/DELETE');
    console.log('- Whitelist: Lista de dominios permitidos');
    console.log('- Credentials: Cookies y headers de autenticación');
    console.log('\n💡 Testing:');
    console.log('- Usa diferentes origins en headers');
    console.log('- Prueba con/sin credentials');
    console.log('- Observa preflight requests');
    console.log('- Verifica headers de respuesta');
  });
}

module.exports = {
  app,
  corsBasico,
  corsRestrictivo,
  corsPersonalizado,
  corsAmbiente,
  monitoreoCORS,
};

// 🎪 Mini Reto: Implementa un CORS dinámico que permita subdominios y valide tokens
const corsDinamico = configuracion => {
  const {
    dominioBase = 'mi-app.com',
    requiereToken = false,
    tokenHeader = 'X-API-Key',
    tokensValidos = ['abc123', 'def456'],
  } = configuracion;

  return (req, res, next) => {
    const origin = req.headers.origin;
    const token = req.headers[tokenHeader.toLowerCase()];

    // Validar token si es requerido
    if (requiereToken && !tokensValidos.includes(token)) {
      return res.status(401).json({
        error: 'Token inválido',
        mensaje: `Header ${tokenHeader} requerido con token válido`,
      });
    }

    // Validar origen (dominio base y subdominios)
    let origenPermitido = false;

    if (origin) {
      try {
        const url = new URL(origin);
        origenPermitido =
          url.hostname === dominioBase ||
          url.hostname.endsWith(`.${dominioBase}`);
      } catch (error) {
        origenPermitido = false;
      }
    }

    if (!origenPermitido) {
      return res.status(403).json({
        error: 'Origen no permitido',
        mensaje: `Solo se permite ${dominioBase} y sus subdominios`,
        origen: origin,
      });
    }

    // Configurar headers CORS
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS'
    );
    res.header(
      'Access-Control-Allow-Headers',
      `Content-Type, Authorization, ${tokenHeader}`
    );

    // Manejar preflight
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    console.log(
      `✅ CORS dinámico permitido para ${origin} con token ${
        token ? 'válido' : 'no requerido'
      }`
    );
    next();
  };
};

// Ejemplo de uso
app.get(
  '/api/dinamico/data',
  corsDinamico({
    dominioBase: 'mi-app.com',
    requiereToken: true,
    tokenHeader: 'X-API-Key',
    tokensValidos: ['abc123', 'def456'],
  }),
  (req, res) => {
    res.json({
      mensaje: 'API con CORS dinámico',
      origen: req.headers.origin,
      token: req.headers['x-api-key'],
      timestamp: new Date(),
    });
  }
);
