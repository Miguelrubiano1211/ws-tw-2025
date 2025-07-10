/**
 * 🔐 Ejercicio 04: Rate Limiting y DDoS Protection
 *
 * Conceptos fundamentales:
 * - Rate Limiting: Limitar número de solicitudes por tiempo
 * - DDoS Protection: Protección contra ataques distribuidos
 * - Sliding Window: Ventana deslizante de tiempo
 * - Exponential Backoff: Incremento exponencial del tiempo
 *
 * Objetivos:
 * - Implementar rate limiting básico y avanzado
 * - Proteger rutas críticas contra ataques
 * - Configurar diferentes límites por endpoint
 * - Monitorear y registrar intentos de ataque
 */

const express = require('express');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Base de datos simulada para tracking
const intentosLogin = new Map();
const ipsSospechosas = new Set();
const estadisticasLimites = {
  requestsRechazadas: 0,
  ipsBloquedas: 0,
  ataquesDDoS: 0,
};

// 1. RATE LIMITING BÁSICO

/**
 * Rate limit general para todas las rutas
 */
const limitGeneral = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por ventana
  message: {
    error: 'Demasiadas solicitudes',
    mensaje: 'Has excedido el límite de 100 requests por 15 minutos',
    reintentoEn: '15 minutos',
  },
  standardHeaders: true, // Incluir headers de rate limit
  legacyHeaders: false, // Deshabilitar headers antiguos
  handler: (req, res) => {
    estadisticasLimites.requestsRechazadas++;

    console.log(`⚠️  Rate limit excedido - IP: ${req.ip}, Ruta: ${req.path}`);

    res.status(429).json({
      error: 'Rate limit excedido',
      mensaje: 'Demasiadas solicitudes desde tu IP',
      limite: 100,
      ventana: '15 minutos',
      reintentoEn: new Date(Date.now() + 15 * 60 * 1000),
      ip: req.ip,
    });
  },
});

// Aplicar rate limiting general
app.use(limitGeneral);

// 2. RATE LIMITING ESPECÍFICO POR ENDPOINT

/**
 * Rate limit estricto para login (prevenir ataques de fuerza bruta)
 */
const limitLogin = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 intentos de login por IP
  skipSuccessfulRequests: true, // No contar logins exitosos
  message: {
    error: 'Demasiados intentos de login',
    mensaje: 'Has excedido el límite de 5 intentos de login por 15 minutos',
    consejo: 'Espera 15 minutos antes de intentar nuevamente',
  },
  handler: (req, res) => {
    // Marcar IP como sospechosa después de múltiples intentos fallidos
    ipsSospechosas.add(req.ip);
    estadisticasLimites.ataquesDDoS++;

    console.log(`🚨 Posible ataque de fuerza bruta - IP: ${req.ip}`);

    res.status(429).json({
      error: 'Límite de login excedido',
      mensaje: 'Demasiados intentos de login fallidos',
      bloqueadoHasta: new Date(Date.now() + 15 * 60 * 1000),
      ip: req.ip,
      advertencia: 'Tu IP ha sido marcada como sospechosa',
    });
  },
});

/**
 * Rate limit para registro de usuarios
 */
const limitRegistro = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // máximo 3 registros por IP por hora
  message: {
    error: 'Límite de registro excedido',
    mensaje: 'Solo puedes registrar 3 cuentas por hora',
    reintentoEn: '1 hora',
  },
});

/**
 * Rate limit para rutas de API críticas
 */
const limitAPI = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 20, // máximo 20 requests por minuto
  message: {
    error: 'Límite de API excedido',
    mensaje: 'Máximo 20 requests por minuto a la API',
  },
});

// 3. SLOW DOWN MIDDLEWARE (ralentizar en lugar de bloquear)

/**
 * Slow down progresivo para búsquedas
 */
const slowDownBusqueda = slowDown({
  windowMs: 60 * 1000, // 1 minuto
  delayAfter: 10, // Después de 10 requests, empezar a ralentizar
  delayMs: 200, // Incrementar 200ms por cada request adicional
  maxDelayMs: 5000, // Máximo 5 segundos de delay
  onLimitReached: (req, res, options) => {
    console.log(
      `🐌 Slow down activado - IP: ${req.ip}, Delay: ${options.delay}ms`
    );
  },
});

// 4. MIDDLEWARE PERSONALIZADO DE RATE LIMITING

/**
 * Rate limiting personalizado con almacenamiento en memoria
 */
const rateLimitPersonalizado = opciones => {
  const {
    ventana = 60 * 1000, // 1 minuto por defecto
    limite = 10,
    mensaje = 'Límite personalizado excedido',
  } = opciones;

  const clientes = new Map();

  return (req, res, next) => {
    const clienteId = req.ip;
    const ahora = Date.now();

    // Limpiar registros antiguos
    if (clientes.has(clienteId)) {
      const registrosCliente = clientes.get(clienteId);
      const registrosValidos = registrosCliente.filter(
        tiempo => ahora - tiempo < ventana
      );
      clientes.set(clienteId, registrosValidos);
    }

    // Obtener registros actuales del cliente
    const registros = clientes.get(clienteId) || [];

    // Verificar límite
    if (registros.length >= limite) {
      return res.status(429).json({
        error: 'Límite personalizado excedido',
        mensaje,
        limite,
        ventana: `${ventana / 1000} segundos`,
        requestsActuales: registros.length,
        reintentoEn: new Date(registros[0] + ventana),
      });
    }

    // Registrar nueva request
    registros.push(ahora);
    clientes.set(clienteId, registros);

    // Agregar headers informativos
    res.set({
      'X-RateLimit-Limit': limite,
      'X-RateLimit-Remaining': limite - registros.length,
      'X-RateLimit-Reset': new Date(ahora + ventana),
    });

    next();
  };
};

// 5. MIDDLEWARE DE DETECCIÓN DE ATAQUES

/**
 * Middleware para detectar patrones de ataque
 */
const detectarAtaques = (req, res, next) => {
  const ip = req.ip;
  const userAgent = req.get('User-Agent') || '';
  const ahora = Date.now();

  // Detección de bots maliciosos por User-Agent
  const userAgentsSospechosos = [
    'bot',
    'crawler',
    'spider',
    'scraper',
    'curl',
    'wget',
  ];

  const esBotSospechoso = userAgentsSospechosos.some(bot =>
    userAgent.toLowerCase().includes(bot)
  );

  if (esBotSospechoso) {
    console.log(
      `🤖 Bot sospechoso detectado - IP: ${ip}, User-Agent: ${userAgent}`
    );
    ipsSospechosas.add(ip);
  }

  // Detección de requests muy rápidas (posible script)
  if (!intentosLogin.has(ip)) {
    intentosLogin.set(ip, []);
  }

  const intentosIP = intentosLogin.get(ip);
  intentosIP.push(ahora);

  // Limpiar intentos antiguos (últimos 10 segundos)
  const intentosRecientes = intentosIP.filter(tiempo => ahora - tiempo < 10000);
  intentosLogin.set(ip, intentosRecientes);

  // Si hay más de 20 requests en 10 segundos, es sospechoso
  if (intentosRecientes.length > 20) {
    console.log(
      `🚨 Posible ataque automatizado - IP: ${ip}, Requests: ${intentosRecientes.length}`
    );
    ipsSospechosas.add(ip);
    estadisticasLimites.ataquesDDoS++;

    return res.status(429).json({
      error: 'Actividad sospechosa detectada',
      mensaje:
        'Tu IP ha sido marcada como sospechosa debido a actividad anormal',
      ip,
      razon: 'Demasiadas requests en poco tiempo',
    });
  }

  next();
};

// 6. MIDDLEWARE DE BLACKLIST

/**
 * Middleware para bloquear IPs marcadas como sospechosas
 */
const verificarBlacklist = (req, res, next) => {
  const ip = req.ip;

  if (ipsSospechosas.has(ip)) {
    console.log(`🛑 IP bloqueada intentando acceder - IP: ${ip}`);
    estadisticasLimites.ipsBloquedas++;

    return res.status(403).json({
      error: 'IP bloqueada',
      mensaje: 'Tu IP ha sido bloqueada debido a actividad sospechosa',
      ip,
      contacto: 'Contacta al administrador si crees que es un error',
    });
  }

  next();
};

// 7. APLICAR MIDDLEWARES Y RUTAS

// Aplicar middleware de detección
app.use(detectarAtaques);
app.use(verificarBlacklist);

// Rutas públicas
app.get('/', (req, res) => {
  res.json({
    mensaje: 'Servidor con rate limiting activo',
    ip: req.ip,
    timestamp: new Date(),
    headers: {
      'X-RateLimit-Limit': res.get('X-RateLimit-Limit'),
      'X-RateLimit-Remaining': res.get('X-RateLimit-Remaining'),
      'X-RateLimit-Reset': res.get('X-RateLimit-Reset'),
    },
  });
});

// Rutas con rate limiting específico
app.post('/login', limitLogin, (req, res) => {
  const { username, password } = req.body;

  // Simulación de autenticación
  if (username === 'admin' && password === '123456') {
    res.json({
      mensaje: 'Login exitoso',
      usuario: username,
      token: 'fake-jwt-token',
    });
  } else {
    res.status(401).json({
      error: 'Credenciales inválidas',
      mensaje: 'Username o password incorrecto',
    });
  }
});

app.post('/register', limitRegistro, (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      error: 'Datos incompletos',
      mensaje: 'Proporciona username, email y password',
    });
  }

  res.status(201).json({
    mensaje: 'Usuario registrado exitosamente',
    usuario: { username, email },
  });
});

// Rutas de API con rate limiting
app.get('/api/users', limitAPI, (req, res) => {
  res.json({
    mensaje: 'Lista de usuarios',
    usuarios: ['admin', 'user1', 'user2'],
    timestamp: new Date(),
  });
});

app.get('/api/buscar', slowDownBusqueda, (req, res) => {
  const { q } = req.query;

  // Simular búsqueda
  setTimeout(() => {
    res.json({
      mensaje: 'Resultados de búsqueda',
      query: q,
      resultados: ['resultado1', 'resultado2', 'resultado3'],
      timestamp: new Date(),
    });
  }, 100);
});

// Ruta con rate limiting personalizado
app.get(
  '/api/custom',
  rateLimitPersonalizado({
    ventana: 30 * 1000, // 30 segundos
    limite: 5,
    mensaje: 'Límite personalizado de 5 requests por 30 segundos',
  }),
  (req, res) => {
    res.json({
      mensaje: 'Endpoint con rate limiting personalizado',
      timestamp: new Date(),
    });
  }
);

// 8. RUTAS DE ADMINISTRACIÓN

/**
 * Ruta para ver estadísticas (solo para debugging)
 */
app.get('/admin/stats', (req, res) => {
  res.json({
    mensaje: 'Estadísticas del servidor',
    estadisticas: estadisticasLimites,
    ipsSospechosas: Array.from(ipsSospechosas),
    intentosLogin: Object.fromEntries(intentosLogin),
    timestamp: new Date(),
  });
});

/**
 * Ruta para desbloquear IP (solo para debugging)
 */
app.post('/admin/unblock', (req, res) => {
  const { ip } = req.body;

  if (!ip) {
    return res.status(400).json({
      error: 'IP requerida',
      mensaje: 'Proporciona la IP a desbloquear',
    });
  }

  ipsSospechosas.delete(ip);
  intentosLogin.delete(ip);

  res.json({
    mensaje: 'IP desbloqueada exitosamente',
    ip,
    timestamp: new Date(),
  });
});

/**
 * Ruta para limpiar todas las estadísticas
 */
app.post('/admin/reset', (req, res) => {
  ipsSospechosas.clear();
  intentosLogin.clear();
  estadisticasLimites.requestsRechazadas = 0;
  estadisticasLimites.ipsBloquedas = 0;
  estadisticasLimites.ataquesDDoS = 0;

  res.json({
    mensaje: 'Estadísticas limpiadas exitosamente',
    timestamp: new Date(),
  });
});

// 9. TESTING Y DEMOSTRACIÓN
const PORT = 3004;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🔐 Servidor con rate limiting ejecutándose en puerto ${PORT}`);
    console.log('\n📋 Pruebas sugeridas:');
    console.log('1. Requests normales: GET http://localhost:3004/');
    console.log(
      '2. Test rate limit login: POST http://localhost:3004/login (5 veces rápido)'
    );
    console.log(
      '3. Test rate limit API: GET http://localhost:3004/api/users (20 veces rápido)'
    );
    console.log(
      '4. Test slow down: GET http://localhost:3004/api/buscar?q=test (10+ veces)'
    );
    console.log('5. Ver estadísticas: GET http://localhost:3004/admin/stats');
    console.log('6. Desbloquear IP: POST http://localhost:3004/admin/unblock');
    console.log('   Body: { "ip": "tu-ip" }');
    console.log('\n🎯 Conceptos clave:');
    console.log('- Rate Limiting: Prevenir abuso de recursos');
    console.log('- Sliding Window: Ventana deslizante de tiempo');
    console.log('- Slow Down: Ralentizar en lugar de bloquear');
    console.log('- Blacklist: Bloquear IPs sospechosas');
    console.log('\n💡 Monitoreo:');
    console.log('- Observa los logs para detectar ataques');
    console.log('- Revisa headers X-RateLimit-*');
    console.log('- Usa /admin/stats para ver estadísticas');
  });
}

module.exports = {
  app,
  limitGeneral,
  limitLogin,
  limitRegistro,
  limitAPI,
  rateLimitPersonalizado,
  detectarAtaques,
  verificarBlacklist,
};

// 🎪 Mini Reto: Implementa un rate limiter adaptativo que ajuste límites según la carga
const rateLimitAdaptativo = configuracionBase => {
  const {
    limiteInicial = 10,
    ventana = 60 * 1000,
    factorAdaptacion = 0.8,
  } = configuracionBase;

  let limiteActual = limiteInicial;
  const clientes = new Map();
  let cargaServidor = 0;

  // Simular monitoreo de carga del servidor
  setInterval(() => {
    cargaServidor = Math.random(); // 0-1 (0 = baja carga, 1 = alta carga)

    if (cargaServidor > 0.8) {
      // Alta carga - reducir límites
      limiteActual = Math.max(Math.floor(limiteInicial * factorAdaptacion), 1);
    } else if (cargaServidor < 0.3) {
      // Baja carga - aumentar límites
      limiteActual = Math.min(
        Math.floor(limiteInicial * 1.2),
        limiteInicial * 2
      );
    }
  }, 10000); // Revisar cada 10 segundos

  return (req, res, next) => {
    const clienteId = req.ip;
    const ahora = Date.now();

    // Tu implementación aquí
    // Pista: Usa limiteActual en lugar de un límite fijo

    const registros = clientes.get(clienteId) || [];
    const registrosValidos = registros.filter(
      tiempo => ahora - tiempo < ventana
    );

    if (registrosValidos.length >= limiteActual) {
      return res.status(429).json({
        error: 'Límite adaptativo excedido',
        limite: limiteActual,
        cargaServidor: Math.round(cargaServidor * 100) + '%',
        mensaje: 'El límite se ajusta según la carga del servidor',
      });
    }

    registrosValidos.push(ahora);
    clientes.set(clienteId, registrosValidos);

    res.set({
      'X-RateLimit-Limit': limiteActual,
      'X-RateLimit-Remaining': limiteActual - registrosValidos.length,
      'X-RateLimit-Adaptive': true,
      'X-Server-Load': Math.round(cargaServidor * 100) + '%',
    });

    next();
  };
};

// Ejemplo de uso
app.get(
  '/api/adaptive',
  rateLimitAdaptativo({
    limiteInicial: 15,
    ventana: 60 * 1000,
    factorAdaptacion: 0.6,
  }),
  (req, res) => {
    res.json({
      mensaje: 'Endpoint con rate limiting adaptativo',
      limite: res.get('X-RateLimit-Limit'),
      carga: res.get('X-Server-Load'),
      timestamp: new Date(),
    });
  }
);
