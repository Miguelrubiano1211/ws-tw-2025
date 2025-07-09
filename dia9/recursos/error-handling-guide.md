# 🛡️ Guía Completa de Manejo de Errores Asíncronos

## 📑 Índice

1. [Fundamentos](#fundamentos)
2. [Tipos de Errores](#tipos-de-errores)
3. [Manejo con Promises](#manejo-con-promises)
4. [Manejo con Async/Await](#manejo-con-async-await)
5. [Errores Personalizados](#errores-personalizados)
6. [Patrones de Recuperación](#patrones-de-recuperación)
7. [Estrategias de Resilencia](#estrategias-de-resilencia)
8. [Logging y Monitoreo](#logging-y-monitoreo)
9. [Mejores Prácticas](#mejores-prácticas)
10. [Casos de Uso Avanzados](#casos-de-uso-avanzados)

## 🎯 Fundamentos

### ¿Por qué es Importante el Manejo de Errores?

El manejo adecuado de errores es crucial para:

- **Experiencia del Usuario**: Evitar que la aplicación se rompa
- **Debugging**: Identificar y solucionar problemas rápidamente
- **Resilencia**: Recuperarse de fallos temporales
- **Mantenibilidad**: Código más robusto y predecible

### Filosofía del Manejo de Errores

```javascript
// ❌ Malo: Ignorar errores
async function malo() {
  const datos = await fetch('/api/datos');
  return datos.json();
}

// ✅ Bueno: Manejar errores apropiadamente
async function bueno() {
  try {
    const response = await fetch('/api/datos');

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error obteniendo datos:', error);

    // Decidir qué hacer: re-lanzar, retornar valor por defecto, etc.
    throw error;
  }
}
```

## 🔍 Tipos de Errores

### 1. Errores de Sintaxis

```javascript
// SyntaxError - Detectado en tiempo de compilación
async function errorSintaxis() {
  // return await fetch('/api/datos'; // Falta paréntesis
}
```

### 2. Errores de Tiempo de Ejecución

```javascript
// ReferenceError
async function errorReferencia() {
  return await variableNoDefinida.fetch('/api/datos');
}

// TypeError
async function errorTipo() {
  const datos = null;
  return await datos.fetch('/api/datos'); // null.fetch()
}
```

### 3. Errores de Red

```javascript
async function manejarErroresRed() {
  try {
    const response = await fetch('/api/datos');

    // Error HTTP (4xx, 5xx)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      // Error de red (no conectividad)
      console.error('Error de conectividad:', error);
      throw new Error('No hay conexión a internet');
    }

    // Re-lanzar otros errores
    throw error;
  }
}
```

### 4. Errores de Validación

```javascript
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

async function validarDatos(datos) {
  if (!datos.email) {
    throw new ValidationError('Email es requerido', 'email');
  }

  if (!datos.email.includes('@')) {
    throw new ValidationError('Email inválido', 'email');
  }

  // Validación asíncrona
  const emailExiste = await verificarEmailExiste(datos.email);
  if (emailExiste) {
    throw new ValidationError('Email ya está registrado', 'email');
  }
}
```

### 5. Errores de Negocio

```javascript
class BusinessError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'BusinessError';
    this.code = code;
  }
}

async function procesarPedido(pedido) {
  // Validar stock
  const stock = await verificarStock(pedido.productId);
  if (stock < pedido.cantidad) {
    throw new BusinessError('Stock insuficiente', 'INSUFFICIENT_STOCK');
  }

  // Validar límite de crédito
  const creditoDisponible = await verificarCredito(pedido.usuarioId);
  if (creditoDisponible < pedido.total) {
    throw new BusinessError(
      'Límite de crédito excedido',
      'CREDIT_LIMIT_EXCEEDED'
    );
  }
}
```

## 🔧 Manejo con Promises

### Catch Básico

```javascript
// Catch simple
fetch('/api/datos')
  .then(response => response.json())
  .then(datos => console.log(datos))
  .catch(error => {
    console.error('Error:', error);
  });

// Catch con recovery
fetch('/api/datos')
  .then(response => response.json())
  .catch(error => {
    console.error('Error obteniendo datos:', error);
    return []; // Valor por defecto
  })
  .then(datos => {
    console.log('Datos (con fallback):', datos);
  });
```

### Catch en Cadenas

```javascript
// Manejo de errores en diferentes puntos
fetch('/api/datos')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
  })
  .catch(error => {
    console.error('Error en fetch:', error);
    throw error; // Re-lanzar para el siguiente catch
  })
  .then(datos => {
    return procesarDatos(datos);
  })
  .catch(error => {
    console.error('Error procesando datos:', error);
    return datosVacios; // Valor por defecto
  })
  .then(datos => {
    console.log('Datos finales:', datos);
  });
```

### Promise.all con Manejo de Errores

```javascript
// Problema: Si una falla, todas fallan
Promise.all([
  fetch('/api/usuarios'),
  fetch('/api/productos'),
  fetch('/api/pedidos'),
])
  .then(responses => {
    // Solo se ejecuta si todas son exitosas
    return Promise.all(responses.map(r => r.json()));
  })
  .catch(error => {
    console.error('Una API falló:', error);
  });

// Solución: Promise.allSettled
Promise.allSettled([
  fetch('/api/usuarios').then(r => r.json()),
  fetch('/api/productos').then(r => r.json()),
  fetch('/api/pedidos').then(r => r.json()),
]).then(resultados => {
  const exitosos = resultados
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value);

  const fallidos = resultados
    .filter(r => r.status === 'rejected')
    .map(r => r.reason);

  console.log('Exitosos:', exitosos);
  console.log('Fallidos:', fallidos);
});
```

## 🎯 Manejo con Async/Await

### Try/Catch Básico

```javascript
async function operacionBasica() {
  try {
    const response = await fetch('/api/datos');
    const datos = await response.json();
    return datos;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

### Try/Catch con Finally

```javascript
async function operacionConLimpieza() {
  let recurso;

  try {
    recurso = await adquirirRecurso();
    const resultado = await procesar(recurso);
    return resultado;
  } catch (error) {
    console.error('Error procesando:', error);
    throw error;
  } finally {
    // Siempre se ejecuta
    if (recurso) {
      await liberarRecurso(recurso);
    }
  }
}
```

### Manejo Granular de Errores

```javascript
async function operacionCompleja() {
  try {
    // Paso 1: Autenticación
    const token = await autenticar();

    // Paso 2: Obtener datos
    let datos;
    try {
      datos = await obtenerDatos(token);
    } catch (error) {
      if (error.status === 401) {
        // Token expirado, renovar
        const nuevoToken = await renovarToken();
        datos = await obtenerDatos(nuevoToken);
      } else {
        throw error;
      }
    }

    // Paso 3: Procesar datos
    const resultado = await procesarDatos(datos);

    return resultado;
  } catch (error) {
    console.error('Error en operación compleja:', error);

    // Manejo específico por tipo de error
    if (error instanceof ValidationError) {
      return { error: 'Datos inválidos', field: error.field };
    }

    if (error instanceof BusinessError) {
      return { error: error.message, code: error.code };
    }

    // Error genérico
    return { error: 'Error interno del servidor' };
  }
}
```

### Wrapper para Manejo de Errores

```javascript
// Wrapper genérico
const safeAsync = fn => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      console.error(`Error en ${fn.name}:`, error);
      throw error;
    }
  };
};

// Uso
const obtenerDatosSeguro = safeAsync(async id => {
  const response = await fetch(`/api/datos/${id}`);
  return response.json();
});

// Wrapper con resultado
const asyncResult = fn => {
  return async (...args) => {
    try {
      const result = await fn(...args);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
};

// Uso
const resultado = await asyncResult(obtenerDatos)(123);
if (resultado.success) {
  console.log('Datos:', resultado.data);
} else {
  console.error('Error:', resultado.error);
}
```

## 🏗️ Errores Personalizados

### Jerarquía de Errores

```javascript
// Error base
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();

    // Mantener stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

// Errores específicos
class ValidationError extends AppError {
  constructor(message, field) {
    super(message, 400);
    this.field = field;
  }
}

class NotFoundError extends AppError {
  constructor(resource) {
    super(`${resource} no encontrado`, 404);
    this.resource = resource;
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'No autorizado') {
    super(message, 401);
  }
}

class BusinessError extends AppError {
  constructor(message, code) {
    super(message, 422);
    this.code = code;
  }
}

class ExternalServiceError extends AppError {
  constructor(service, originalError) {
    super(`Error en servicio ${service}`, 503);
    this.service = service;
    this.originalError = originalError;
  }
}
```

### Factory de Errores

```javascript
class ErrorFactory {
  static validation(message, field) {
    return new ValidationError(message, field);
  }

  static notFound(resource) {
    return new NotFoundError(resource);
  }

  static unauthorized(message) {
    return new UnauthorizedError(message);
  }

  static business(message, code) {
    return new BusinessError(message, code);
  }

  static external(service, originalError) {
    return new ExternalServiceError(service, originalError);
  }

  static fromHttpStatus(status, message) {
    switch (status) {
      case 400:
        return new ValidationError(message);
      case 401:
        return new UnauthorizedError(message);
      case 404:
        return new NotFoundError(message);
      case 422:
        return new BusinessError(message);
      case 503:
        return new ExternalServiceError('API', new Error(message));
      default:
        return new AppError(message, status);
    }
  }
}

// Uso
async function obtenerUsuario(id) {
  try {
    const response = await fetch(`/api/usuarios/${id}`);

    if (!response.ok) {
      throw ErrorFactory.fromHttpStatus(
        response.status,
        `Error obteniendo usuario ${id}`
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw ErrorFactory.external('API de usuarios', error);
  }
}
```

## 🔄 Patrones de Recuperación

### Patrón Retry

```javascript
async function retry(
  operacion,
  maxIntentos = 3,
  delay = 1000,
  backoffFactor = 2
) {
  let ultimoError;

  for (let intento = 1; intento <= maxIntentos; intento++) {
    try {
      return await operacion();
    } catch (error) {
      ultimoError = error;

      // No reintentar ciertos errores
      if (
        error instanceof ValidationError ||
        error instanceof UnauthorizedError
      ) {
        throw error;
      }

      if (intento < maxIntentos) {
        const tiempoEspera = delay * Math.pow(backoffFactor, intento - 1);
        console.log(
          `Intento ${intento} falló, reintentando en ${tiempoEspera}ms`
        );
        await new Promise(resolve => setTimeout(resolve, tiempoEspera));
      }
    }
  }

  throw ultimoError;
}

// Uso
async function operacionConRetry() {
  return await retry(
    async () => {
      const response = await fetch('/api/datos');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
    },
    5, // 5 intentos
    1000, // 1 segundo inicial
    2 // Backoff exponencial
  );
}
```

### Patrón Fallback

```javascript
async function conFallback(operacionPrincipal, operacionFallback) {
  try {
    return await operacionPrincipal();
  } catch (error) {
    console.log('Operación principal falló, usando fallback');
    return await operacionFallback();
  }
}

// Múltiples fallbacks
async function conMultiplesFallbacks(...operaciones) {
  let ultimoError;

  for (const operacion of operaciones) {
    try {
      return await operacion();
    } catch (error) {
      ultimoError = error;
      console.log('Operación falló, intentando siguiente...');
    }
  }

  throw ultimoError;
}

// Uso
async function obtenerDatosConFallback() {
  return await conMultiplesFallbacks(
    () => fetch('/api/datos-principales').then(r => r.json()),
    () => fetch('/api/datos-backup').then(r => r.json()),
    () => Promise.resolve([]) // Valor por defecto
  );
}
```

### Patrón Timeout

```javascript
async function conTimeout(operacion, timeout = 5000) {
  return await Promise.race([
    operacion(),
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout')), timeout);
    }),
  ]);
}

// Timeout con cleanup
async function conTimeoutYCleanup(operacion, timeout = 5000) {
  let timeoutId;

  try {
    return await Promise.race([
      operacion(),
      new Promise((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error('Timeout')), timeout);
      }),
    ]);
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}
```

## 🛠️ Estrategias de Resilencia

### Circuit Breaker

```javascript
class CircuitBreaker {
  constructor(threshold = 5, timeout = 60000, resetTimeout = 30000) {
    this.threshold = threshold;
    this.timeout = timeout;
    this.resetTimeout = resetTimeout;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.failures = 0;
    this.lastFailureTime = null;
    this.stats = {
      requests: 0,
      successes: 0,
      failures: 0,
    };
  }

  async execute(operation) {
    this.stats.requests++;

    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.resetTimeout) {
        this.state = 'HALF_OPEN';
        console.log('Circuit breaker: OPEN -> HALF_OPEN');
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.failures = 0;
    this.stats.successes++;

    if (this.state === 'HALF_OPEN') {
      this.state = 'CLOSED';
      console.log('Circuit breaker: HALF_OPEN -> CLOSED');
    }
  }

  onFailure() {
    this.failures++;
    this.stats.failures++;
    this.lastFailureTime = Date.now();

    if (this.failures >= this.threshold) {
      this.state = 'OPEN';
      console.log('Circuit breaker: CLOSED -> OPEN');
    }
  }

  getStats() {
    return {
      ...this.stats,
      state: this.state,
      failures: this.failures,
      successRate:
        this.stats.requests > 0
          ? ((this.stats.successes / this.stats.requests) * 100).toFixed(2) +
            '%'
          : '0%',
    };
  }
}

// Uso
const circuitBreaker = new CircuitBreaker(3, 60000, 10000);

async function operacionConCircuitBreaker() {
  return await circuitBreaker.execute(async () => {
    const response = await fetch('/api/datos');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
  });
}
```

### Bulkhead Pattern

```javascript
class Bulkhead {
  constructor(name, limit = 10) {
    this.name = name;
    this.limit = limit;
    this.active = 0;
    this.queue = [];
    this.stats = {
      accepted: 0,
      rejected: 0,
      completed: 0,
    };
  }

  async execute(operation) {
    if (this.active >= this.limit) {
      this.stats.rejected++;
      throw new Error(`Bulkhead ${this.name} at capacity`);
    }

    this.active++;
    this.stats.accepted++;

    try {
      const result = await operation();
      this.stats.completed++;
      return result;
    } finally {
      this.active--;
    }
  }

  getStats() {
    return {
      name: this.name,
      active: this.active,
      limit: this.limit,
      ...this.stats,
    };
  }
}

// Uso con múltiples bulkheads
const databaseBulkhead = new Bulkhead('Database', 5);
const apiBulkhead = new Bulkhead('External API', 3);

async function operacionDatabase() {
  return await databaseBulkhead.execute(async () => {
    // Operación de base de datos
    return await queryDatabase();
  });
}

async function operacionAPI() {
  return await apiBulkhead.execute(async () => {
    // Llamada a API externa
    return await fetch('/api/external');
  });
}
```

### Rate Limiting

```javascript
class RateLimiter {
  constructor(maxRequests, windowMs) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = [];
  }

  async execute(operation) {
    const now = Date.now();

    // Limpiar requests antiguos
    this.requests = this.requests.filter(
      timestamp => now - timestamp < this.windowMs
    );

    if (this.requests.length >= this.maxRequests) {
      throw new Error('Rate limit exceeded');
    }

    this.requests.push(now);
    return await operation();
  }

  getStats() {
    return {
      currentRequests: this.requests.length,
      maxRequests: this.maxRequests,
      windowMs: this.windowMs,
    };
  }
}

// Uso
const rateLimiter = new RateLimiter(10, 60000); // 10 requests per minute

async function operacionConRateLimit() {
  return await rateLimiter.execute(async () => {
    return await fetch('/api/datos');
  });
}
```

## 📊 Logging y Monitoreo

### Logger Estructurado

```javascript
class Logger {
  constructor(service) {
    this.service = service;
  }

  log(level, message, meta = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      service: this.service,
      message,
      ...meta,
    };

    console.log(JSON.stringify(logEntry));
  }

  error(message, error, meta = {}) {
    this.log('ERROR', message, {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      ...meta,
    });
  }

  warn(message, meta = {}) {
    this.log('WARN', message, meta);
  }

  info(message, meta = {}) {
    this.log('INFO', message, meta);
  }

  debug(message, meta = {}) {
    this.log('DEBUG', message, meta);
  }
}

// Uso
const logger = new Logger('UserService');

async function operacionConLogging(userId) {
  logger.info('Obteniendo datos de usuario', { userId });

  try {
    const usuario = await fetch(`/api/usuarios/${userId}`);
    logger.info('Usuario obtenido exitosamente', { userId });
    return usuario;
  } catch (error) {
    logger.error('Error obteniendo usuario', error, { userId });
    throw error;
  }
}
```

### Métricas de Error

```javascript
class ErrorMetrics {
  constructor() {
    this.metrics = {
      totalErrors: 0,
      errorsByType: {},
      errorsByService: {},
      errorsByTime: {},
    };
  }

  recordError(error, service = 'unknown') {
    this.metrics.totalErrors++;

    // Por tipo
    const errorType = error.constructor.name;
    this.metrics.errorsByType[errorType] =
      (this.metrics.errorsByType[errorType] || 0) + 1;

    // Por servicio
    this.metrics.errorsByService[service] =
      (this.metrics.errorsByService[service] || 0) + 1;

    // Por hora
    const hour = new Date().getHours();
    this.metrics.errorsByTime[hour] =
      (this.metrics.errorsByTime[hour] || 0) + 1;
  }

  getMetrics() {
    return { ...this.metrics };
  }

  reset() {
    this.metrics = {
      totalErrors: 0,
      errorsByType: {},
      errorsByService: {},
      errorsByTime: {},
    };
  }
}

// Singleton global
const errorMetrics = new ErrorMetrics();

// Wrapper para capturar métricas
const withMetrics = service => fn => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      errorMetrics.recordError(error, service);
      throw error;
    }
  };
};
```

## ✅ Mejores Prácticas

### 1. Fail Fast

```javascript
// ❌ Malo: Validar tarde
async function malo(datos) {
  const resultado = await operacionCostosa(datos);

  if (!datos.email) {
    throw new Error('Email requerido');
  }

  return resultado;
}

// ✅ Bueno: Validar temprano
async function bueno(datos) {
  if (!datos.email) {
    throw new ValidationError('Email requerido', 'email');
  }

  return await operacionCostosa(datos);
}
```

### 2. Información Contextual

```javascript
// ❌ Malo: Error sin contexto
async function malo(userId) {
  const usuario = await obtenerUsuario(userId);

  if (!usuario) {
    throw new Error('No encontrado');
  }

  return usuario;
}

// ✅ Bueno: Error con contexto
async function bueno(userId) {
  try {
    const usuario = await obtenerUsuario(userId);

    if (!usuario) {
      throw new NotFoundError(`Usuario ${userId}`);
    }

    return usuario;
  } catch (error) {
    logger.error('Error obteniendo usuario', error, { userId });
    throw error;
  }
}
```

### 3. Manejo Granular

```javascript
// ❌ Malo: Manejo genérico
async function malo() {
  try {
    return await operacionCompleja();
  } catch (error) {
    console.log('Error');
    return null;
  }
}

// ✅ Bueno: Manejo específico
async function bueno() {
  try {
    return await operacionCompleja();
  } catch (error) {
    if (error instanceof ValidationError) {
      // Manejar error de validación
      return { error: error.message, field: error.field };
    }

    if (error instanceof UnauthorizedError) {
      // Redirigir a login
      redirectToLogin();
      return null;
    }

    if (error instanceof ExternalServiceError) {
      // Usar fallback
      return await operacionFallback();
    }

    // Error no manejado
    throw error;
  }
}
```

### 4. Limpieza de Recursos

```javascript
// Siempre limpiar recursos
async function operacionConRecursos() {
  let conexion;
  let archivo;

  try {
    conexion = await abrirConexion();
    archivo = await abrirArchivo();

    const resultado = await procesar(conexion, archivo);
    return resultado;
  } catch (error) {
    logger.error('Error en operación', error);
    throw error;
  } finally {
    // Limpiar en orden inverso
    if (archivo) {
      await cerrarArchivo(archivo);
    }

    if (conexion) {
      await cerrarConexion(conexion);
    }
  }
}
```

## 🎯 Casos de Uso Avanzados

### 1. Sistema de Manejo de Errores Global

```javascript
class GlobalErrorHandler {
  constructor() {
    this.handlers = new Map();
    this.logger = new Logger('GlobalErrorHandler');
    this.metrics = new ErrorMetrics();
  }

  register(errorType, handler) {
    this.handlers.set(errorType, handler);
  }

  async handle(error, context = {}) {
    this.logger.error('Error global', error, context);
    this.metrics.recordError(error, context.service);

    const handler = this.handlers.get(error.constructor.name);

    if (handler) {
      return await handler(error, context);
    }

    // Handler por defecto
    return await this.defaultHandler(error, context);
  }

  async defaultHandler(error, context) {
    // Notificar a sistema de monitoreo
    await this.notifyMonitoring(error, context);

    // Retornar respuesta genérica
    return {
      error: 'Error interno del servidor',
      requestId: context.requestId,
    };
  }

  async notifyMonitoring(error, context) {
    // Implementar notificación a Slack, email, etc.
    console.log('Notificando monitoreo:', error.message);
  }
}

// Configurar handlers
const errorHandler = new GlobalErrorHandler();

errorHandler.register('ValidationError', async (error, context) => {
  return {
    error: error.message,
    field: error.field,
    code: 'VALIDATION_ERROR',
  };
});

errorHandler.register('UnauthorizedError', async (error, context) => {
  return {
    error: 'No autorizado',
    code: 'UNAUTHORIZED',
  };
});

// Uso
async function operacionConManejadorGlobal() {
  try {
    return await operacionRiesgosa();
  } catch (error) {
    return await errorHandler.handle(error, {
      service: 'UserService',
      requestId: 'req-123',
    });
  }
}
```

### 2. Health Check System

```javascript
class HealthChecker {
  constructor() {
    this.checks = new Map();
    this.cache = new Map();
    this.cacheTTL = 30000; // 30 segundos
  }

  register(name, checkFn, options = {}) {
    this.checks.set(name, {
      fn: checkFn,
      timeout: options.timeout || 5000,
      critical: options.critical || false,
    });
  }

  async check(name) {
    const cached = this.cache.get(name);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.result;
    }

    const check = this.checks.get(name);
    if (!check) {
      throw new Error(`Check ${name} not found`);
    }

    try {
      const result = await conTimeout(check.fn, check.timeout);

      const healthResult = {
        name,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        responseTime: Date.now() - start,
        details: result,
      };

      this.cache.set(name, {
        result: healthResult,
        timestamp: Date.now(),
      });

      return healthResult;
    } catch (error) {
      const healthResult = {
        name,
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message,
        critical: check.critical,
      };

      return healthResult;
    }
  }

  async checkAll() {
    const checkNames = Array.from(this.checks.keys());
    const results = await Promise.all(checkNames.map(name => this.check(name)));

    const overallStatus = results.every(r => r.status === 'healthy')
      ? 'healthy'
      : 'unhealthy';

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      checks: results,
    };
  }
}

// Configurar health checks
const healthChecker = new HealthChecker();

healthChecker.register(
  'database',
  async () => {
    await queryDatabase('SELECT 1');
    return { message: 'Database connected' };
  },
  { timeout: 3000, critical: true }
);

healthChecker.register(
  'external-api',
  async () => {
    const response = await fetch('/api/health');
    return { status: response.status };
  },
  { timeout: 5000, critical: false }
);

// Uso
async function healthEndpoint() {
  try {
    const health = await healthChecker.checkAll();
    return health;
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
}
```

## 🏆 Consejos para WorldSkills

### Patrones Rápidos para Competencias

```javascript
// 1. Error handler universal
const safe =
  fn =>
  async (...args) => {
    try {
      return { data: await fn(...args), error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  };

// 2. Retry rápido
const retry =
  (fn, times = 3) =>
  async (...args) => {
    for (let i = 0; i < times; i++) {
      try {
        return await fn(...args);
      } catch (error) {
        if (i === times - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  };

// 3. Timeout rápido
const timeout =
  (fn, ms = 5000) =>
  async (...args) => {
    return Promise.race([
      fn(...args),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), ms)
      ),
    ]);
  };

// 4. Fallback rápido
const fallback =
  (fn, fallbackFn) =>
  async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      return await fallbackFn(...args);
    }
  };
```

### Debugging Rápido

```javascript
// Error con contexto
const errorWithContext = (message, context) => {
  const error = new Error(message);
  error.context = context;
  return error;
};

// Log wrapper
const logError = (error, context) => {
  console.error('ERROR:', {
    message: error.message,
    stack: error.stack,
    context,
  });
};
```

¡Domina el manejo de errores y tu código será robusto y confiable! 🛡️
