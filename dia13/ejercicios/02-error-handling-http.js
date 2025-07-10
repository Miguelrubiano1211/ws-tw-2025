/**
 * 🔗 Día 13 - Ejercicio 2: Error Handling en Peticiones HTTP
 *
 * Objetivos:
 * - Implementar manejo robusto de errores HTTP
 * - Crear estrategias de retry y recuperación
 * - Proporcionar feedback efectivo al usuario
 * - Implementar logging y debugging de errores
 */

// Simulación de servidor con diferentes tipos de errores
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Middleware para simular errores aleatorios
const simulateRandomErrors = (req, res, next) => {
  const errorChance = Math.random();

  // 10% de probabilidad de error de servidor
  if (errorChance < 0.1) {
    return res.status(500).json({
      error: 'Error interno del servidor',
      code: 'INTERNAL_ERROR',
      timestamp: new Date().toISOString(),
    });
  }

  // 5% de probabilidad de timeout
  if (errorChance < 0.15) {
    setTimeout(() => {
      res.status(408).json({
        error: 'Tiempo de espera agotado',
        code: 'REQUEST_TIMEOUT',
        timestamp: new Date().toISOString(),
      });
    }, 5000);
    return;
  }

  next();
};

// Rutas con diferentes tipos de errores
app.get('/api/datos-estables', (req, res) => {
  res.json({
    success: true,
    data: 'Datos que siempre funcionan',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/datos-inestables', simulateRandomErrors, (req, res) => {
  res.json({
    success: true,
    data: 'Datos que a veces fallan',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/datos-lentos', (req, res) => {
  // Simular respuesta lenta
  setTimeout(() => {
    res.json({
      success: true,
      data: 'Datos que tardan en cargar',
      timestamp: new Date().toISOString(),
    });
  }, 3000);
});

app.get('/api/error-400', (req, res) => {
  res.status(400).json({
    error: 'Solicitud incorrecta',
    code: 'BAD_REQUEST',
    details: 'Los parámetros enviados son inválidos',
  });
});

app.get('/api/error-401', (req, res) => {
  res.status(401).json({
    error: 'No autorizado',
    code: 'UNAUTHORIZED',
    details: 'Token de acceso requerido',
  });
});

app.get('/api/error-403', (req, res) => {
  res.status(403).json({
    error: 'Acceso prohibido',
    code: 'FORBIDDEN',
    details: 'No tienes permisos para acceder a este recurso',
  });
});

app.get('/api/error-404', (req, res) => {
  res.status(404).json({
    error: 'Recurso no encontrado',
    code: 'NOT_FOUND',
    details: 'El recurso solicitado no existe',
  });
});

app.get('/api/error-500', (req, res) => {
  res.status(500).json({
    error: 'Error interno del servidor',
    code: 'INTERNAL_ERROR',
    details: 'Algo salió mal en el servidor',
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`🚀 Servidor de errores ejecutándose en puerto ${PORT}`);
});

// ============================================================================
// SISTEMA DE MANEJO DE ERRORES
// ============================================================================

/**
 * Tipos de errores customizados
 */
class HTTPError extends Error {
  constructor(message, status, code, details) {
    super(message);
    this.name = 'HTTPError';
    this.status = status;
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

class NetworkError extends Error {
  constructor(message, originalError) {
    super(message);
    this.name = 'NetworkError';
    this.originalError = originalError;
    this.timestamp = new Date().toISOString();
  }
}

class TimeoutError extends Error {
  constructor(message, timeout) {
    super(message);
    this.name = 'TimeoutError';
    this.timeout = timeout;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Logger de errores
 */
class ErrorLogger {
  constructor() {
    this.errorHistory = [];
  }

  log(error, context = {}) {
    const errorLog = {
      timestamp: new Date().toISOString(),
      type: error.name || 'Unknown',
      message: error.message,
      status: error.status || null,
      code: error.code || null,
      url: context.url || null,
      method: context.method || null,
      retryCount: context.retryCount || 0,
      stack: error.stack,
    };

    this.errorHistory.push(errorLog);

    // Log en consola con colores
    console.error(
      `❌ [${errorLog.timestamp}] ${errorLog.type}: ${errorLog.message}`
    );
    if (errorLog.status) {
      console.error(`   Status: ${errorLog.status} | Code: ${errorLog.code}`);
    }
    if (errorLog.url) {
      console.error(`   URL: ${errorLog.method} ${errorLog.url}`);
    }
    if (errorLog.retryCount > 0) {
      console.error(`   Retry attempt: ${errorLog.retryCount}`);
    }
  }

  getErrorHistory() {
    return this.errorHistory;
  }

  clearHistory() {
    this.errorHistory = [];
  }
}

/**
 * Cliente HTTP con manejo robusto de errores
 */
class RobustHTTPClient {
  constructor(baseURL = 'http://localhost:3002') {
    this.baseURL = baseURL;
    this.errorLogger = new ErrorLogger();
    this.defaultTimeout = 10000; // 10 segundos
    this.maxRetries = 3;
  }

  /**
   * Función para crear timeout controller
   */
  createTimeoutController(timeout = this.defaultTimeout) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeout);

    return { controller, timeoutId };
  }

  /**
   * Función para hacer retry con exponential backoff
   */
  async withRetry(fn, maxRetries = this.maxRetries, baseDelay = 1000) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn(attempt);
      } catch (error) {
        // Si es el último intento, lanzar el error
        if (attempt === maxRetries) {
          throw error;
        }

        // Si es un error que no debe reintentarse, lanzar inmediatamente
        if (this.isNonRetryableError(error)) {
          throw error;
        }

        // Calcular delay con exponential backoff
        const delay = baseDelay * Math.pow(2, attempt);
        console.log(
          `🔄 Reintentando en ${delay}ms (intento ${attempt + 1}/${maxRetries})`
        );

        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  /**
   * Determinar si un error no debe reintentarse
   */
  isNonRetryableError(error) {
    // Errores 4xx generalmente no deben reintentarse
    if (error.status >= 400 && error.status < 500) {
      return true;
    }

    // Errores específicos que no deben reintentarse
    const nonRetryableCodes = ['UNAUTHORIZED', 'FORBIDDEN', 'NOT_FOUND'];
    if (nonRetryableCodes.includes(error.code)) {
      return true;
    }

    return false;
  }

  /**
   * Método principal para hacer peticiones
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const method = options.method || 'GET';
    const timeout = options.timeout || this.defaultTimeout;

    const context = {
      url,
      method,
      retryCount: 0,
    };

    return this.withRetry(async attempt => {
      context.retryCount = attempt;

      const { controller, timeoutId } = this.createTimeoutController(timeout);

      try {
        const config = {
          method,
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...options.headers,
          },
          signal: controller.signal,
          ...options,
        };

        if (options.body) {
          config.body = JSON.stringify(options.body);
        }

        console.log(`📡 [Intento ${attempt + 1}] ${method} ${url}`);

        const response = await fetch(url, config);
        clearTimeout(timeoutId);

        // Procesar respuesta
        const contentType = response.headers.get('content-type');
        let data;

        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          data = await response.text();
        }

        // Verificar si la respuesta fue exitosa
        if (!response.ok) {
          const error = new HTTPError(
            data.error || `HTTP Error: ${response.status}`,
            response.status,
            data.code || 'HTTP_ERROR',
            data.details || response.statusText
          );

          this.errorLogger.log(error, context);
          throw error;
        }

        console.log(`✅ [Intento ${attempt + 1}] Respuesta exitosa`);
        return data;
      } catch (error) {
        clearTimeout(timeoutId);

        // Manejar diferentes tipos de errores
        if (error.name === 'AbortError') {
          const timeoutError = new TimeoutError(
            `Request timeout after ${timeout}ms`,
            timeout
          );
          this.errorLogger.log(timeoutError, context);
          throw timeoutError;
        }

        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          const networkError = new NetworkError(
            'Network error or server unavailable',
            error
          );
          this.errorLogger.log(networkError, context);
          throw networkError;
        }

        // Si ya es un error conocido, solo logearlo
        if (error instanceof HTTPError) {
          throw error;
        }

        // Error desconocido
        this.errorLogger.log(error, context);
        throw error;
      }
    });
  }

  /**
   * Método GET con manejo de errores
   */
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  /**
   * Método POST con manejo de errores
   */
  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: data,
    });
  }

  /**
   * Obtener historial de errores
   */
  getErrorHistory() {
    return this.errorLogger.getErrorHistory();
  }

  /**
   * Limpiar historial de errores
   */
  clearErrorHistory() {
    this.errorLogger.clearHistory();
  }
}

// ============================================================================
// MANEJADOR DE ERRORES PARA UI
// ============================================================================

/**
 * Manejador de errores para interfaces de usuario
 */
class UIErrorHandler {
  constructor() {
    this.errorMessages = {
      // Errores de red
      NetworkError: 'Error de conexión. Verifica tu conexión a internet.',
      TimeoutError: 'La solicitud tardó demasiado. Intenta nuevamente.',

      // Errores HTTP
      400: 'Solicitud incorrecta. Revisa los datos enviados.',
      401: 'No autorizado. Necesitas iniciar sesión.',
      403: 'Acceso prohibido. No tienes permisos para esta acción.',
      404: 'Recurso no encontrado.',
      500: 'Error del servidor. Intenta nuevamente más tarde.',

      // Errores por código
      BAD_REQUEST: 'Los datos enviados son incorrectos.',
      UNAUTHORIZED: 'Tu sesión ha expirado. Inicia sesión nuevamente.',
      FORBIDDEN: 'No tienes permisos para realizar esta acción.',
      NOT_FOUND: 'El recurso que buscas no existe.',
      INTERNAL_ERROR: 'Error interno del servidor.',

      // Error genérico
      default: 'Ha ocurrido un error inesperado. Intenta nuevamente.',
    };
  }

  /**
   * Obtener mensaje de error user-friendly
   */
  getUserFriendlyMessage(error) {
    // Buscar por tipo de error
    if (this.errorMessages[error.name]) {
      return this.errorMessages[error.name];
    }

    // Buscar por código de error
    if (error.code && this.errorMessages[error.code]) {
      return this.errorMessages[error.code];
    }

    // Buscar por status HTTP
    if (error.status && this.errorMessages[error.status]) {
      return this.errorMessages[error.status];
    }

    // Mensaje por defecto
    return this.errorMessages.default;
  }

  /**
   * Mostrar error en consola (simulación de UI)
   */
  displayError(error, context = {}) {
    const userMessage = this.getUserFriendlyMessage(error);
    const isRetryable = this.isRetryableError(error);

    console.log('\n🚨 ERROR PARA EL USUARIO:');
    console.log(`Mensaje: ${userMessage}`);
    console.log(`Reintentar: ${isRetryable ? 'Sí' : 'No'}`);

    if (context.action) {
      console.log(`Acción: ${context.action}`);
    }

    if (error.details) {
      console.log(`Detalles técnicos: ${error.details}`);
    }

    return {
      message: userMessage,
      retryable: isRetryable,
      error: error,
    };
  }

  /**
   * Determinar si un error es reintentar
   */
  isRetryableError(error) {
    // Errores de red y timeout son reintentar
    if (error.name === 'NetworkError' || error.name === 'TimeoutError') {
      return true;
    }

    // Errores 5xx son reintentar
    if (error.status >= 500) {
      return true;
    }

    // Errores específicos reintentar
    const retryableCodes = ['INTERNAL_ERROR', 'REQUEST_TIMEOUT'];
    if (retryableCodes.includes(error.code)) {
      return true;
    }

    return false;
  }
}

// ============================================================================
// DEMOSTRACIONES DE MANEJO DE ERRORES
// ============================================================================

/**
 * Demostración de diferentes tipos de errores
 */
async function demostrarManejoErrores() {
  console.log('\n🔍 DEMOSTRACIÓN DE MANEJO DE ERRORES');
  console.log('====================================');

  const client = new RobustHTTPClient();
  const uiHandler = new UIErrorHandler();

  const endpoints = [
    {
      url: '/api/datos-estables',
      description: 'Datos estables (debería funcionar)',
    },
    {
      url: '/api/datos-inestables',
      description: 'Datos inestables (puede fallar)',
    },
    { url: '/api/error-400', description: 'Error 400 - Bad Request' },
    { url: '/api/error-401', description: 'Error 401 - Unauthorized' },
    { url: '/api/error-404', description: 'Error 404 - Not Found' },
    { url: '/api/error-500', description: 'Error 500 - Internal Server Error' },
    { url: '/api/inexistente', description: 'Endpoint inexistente' },
  ];

  for (const endpoint of endpoints) {
    console.log(`\n🧪 Probando: ${endpoint.description}`);
    console.log(`URL: ${endpoint.url}`);

    try {
      const result = await client.get(endpoint.url);
      console.log('✅ Éxito:', result);
    } catch (error) {
      const errorInfo = uiHandler.displayError(error, {
        action: `Obtener datos de ${endpoint.url}`,
      });

      console.log('❌ Error capturado y manejado correctamente');
    }
  }
}

/**
 * Demostración de retry con datos inestables
 */
async function demostrarRetry() {
  console.log('\n🔄 DEMOSTRACIÓN DE RETRY AUTOMÁTICO');
  console.log('==================================');

  const client = new RobustHTTPClient();

  // Intentar obtener datos inestables múltiples veces
  for (let i = 1; i <= 3; i++) {
    console.log(`\n🎯 Intento ${i} de obtener datos inestables:`);

    try {
      const result = await client.get('/api/datos-inestables');
      console.log('✅ Éxito:', result);
      break;
    } catch (error) {
      console.log(`❌ Intento ${i} falló: ${error.message}`);

      if (i === 3) {
        console.log('🚫 Todos los intentos fallaron');
      }
    }
  }
}

/**
 * Demostración de timeout
 */
async function demostrarTimeout() {
  console.log('\n⏱️ DEMOSTRACIÓN DE TIMEOUT');
  console.log('==========================');

  const client = new RobustHTTPClient();

  try {
    console.log(
      '🐌 Intentando obtener datos lentos con timeout de 2 segundos...'
    );

    const result = await client.get('/api/datos-lentos', {
      timeout: 2000, // 2 segundos
    });

    console.log('✅ Datos obtenidos:', result);
  } catch (error) {
    console.log(`❌ Error de timeout: ${error.message}`);
  }
}

/**
 * Demostración de historial de errores
 */
async function demostrarHistorialErrores() {
  console.log('\n📊 DEMOSTRACIÓN DE HISTORIAL DE ERRORES');
  console.log('=======================================');

  const client = new RobustHTTPClient();

  // Generar varios errores
  const endpoints = ['/api/error-400', '/api/error-404', '/api/error-500'];

  for (const endpoint of endpoints) {
    try {
      await client.get(endpoint);
    } catch (error) {
      // Ignorar errores para la demostración
    }
  }

  // Mostrar historial
  const history = client.getErrorHistory();
  console.log(`\n📋 Historial de errores (${history.length} entradas):`);

  history.forEach((entry, index) => {
    console.log(
      `${index + 1}. [${entry.timestamp}] ${entry.type}: ${entry.message}`
    );
    if (entry.status) {
      console.log(
        `   Status: ${entry.status} | URL: ${entry.method} ${entry.url}`
      );
    }
  });
}

// ============================================================================
// EJECUCIÓN DE DEMOSTRACIONES
// ============================================================================

/**
 * Función principal
 */
async function ejecutarDemostraciones() {
  console.log('🚀 INICIANDO DEMOSTRACIONES DE ERROR HANDLING');
  console.log('==============================================');

  // Esperar que el servidor se inicie
  await new Promise(resolve => setTimeout(resolve, 2000));

  try {
    await demostrarManejoErrores();
    await demostrarRetry();
    await demostrarTimeout();
    await demostrarHistorialErrores();

    console.log('\n🎉 TODAS LAS DEMOSTRACIONES COMPLETADAS');
  } catch (error) {
    console.error('Error en demostraciones:', error);
  }
}

// Ejecutar demostraciones
setTimeout(ejecutarDemostraciones, 3000);

/* 
🧪 INSTRUCCIONES DE PRUEBA:

1. Instalar dependencias:
   npm install express cors

2. Ejecutar el ejercicio:
   node 02-error-handling-http.js

3. El servidor simulará diferentes tipos de errores y demostrará el manejo

4. Para probar manualmente:
   curl http://localhost:3002/api/datos-estables
   curl http://localhost:3002/api/error-400
   curl http://localhost:3002/api/error-500

💡 CONCEPTOS CLAVE:
- Error Types: Diferentes tipos de errores HTTP y de red
- Retry Strategies: Estrategias de reintento con exponential backoff
- Timeout Handling: Manejo de timeouts con AbortController
- User Feedback: Mensajes de error user-friendly
- Error Logging: Registro de errores para debugging
- Non-retryable Errors: Errores que no deben reintentarse

🔧 PATRONES AVANZADOS:
- Custom Error Classes: Clases de error personalizadas
- Exponential Backoff: Reintento con delay exponencial
- Circuit Breaker: Patrón de circuit breaker básico
- Error Categorization: Categorización de errores para UI
- Retry Policies: Políticas de reintento configurables
- Error History: Historial de errores para análisis

📊 MÉTRICAS DE CALIDAD:
- Error Rate: Tasa de errores por endpoint
- Retry Success Rate: Tasa de éxito de reintentos
- Average Response Time: Tiempo promedio de respuesta
- Timeout Frequency: Frecuencia de timeouts
- Error Distribution: Distribución de tipos de errores
*/
