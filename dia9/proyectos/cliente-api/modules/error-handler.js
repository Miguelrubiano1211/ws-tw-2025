/**
 * Módulo de Manejo de Errores
 * Proporciona utilidades para manejar errores de manera consistente
 */

// Tipos de errores comunes
const ERROR_TYPES = {
  NETWORK: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT_ERROR',
  SERVER: 'SERVER_ERROR',
  CLIENT: 'CLIENT_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  AUTHENTICATION: 'AUTHENTICATION_ERROR',
  AUTHORIZATION: 'AUTHORIZATION_ERROR',
  NOT_FOUND: 'NOT_FOUND_ERROR',
  RATE_LIMIT: 'RATE_LIMIT_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR',
};

// Códigos de estado HTTP y sus tipos de error
const HTTP_STATUS_ERRORS = {
  400: ERROR_TYPES.CLIENT,
  401: ERROR_TYPES.AUTHENTICATION,
  403: ERROR_TYPES.AUTHORIZATION,
  404: ERROR_TYPES.NOT_FOUND,
  408: ERROR_TYPES.TIMEOUT,
  429: ERROR_TYPES.RATE_LIMIT,
  500: ERROR_TYPES.SERVER,
  502: ERROR_TYPES.SERVER,
  503: ERROR_TYPES.SERVER,
  504: ERROR_TYPES.TIMEOUT,
};

/**
 * Clase para representar errores de API
 */
class ApiError extends Error {
  constructor(
    message,
    type = ERROR_TYPES.UNKNOWN,
    statusCode = null,
    details = null
  ) {
    super(message);
    this.name = 'ApiError';
    this.type = type;
    this.statusCode = statusCode;
    this.details = details;
    this.timestamp = new Date().toISOString();

    // Mantener el stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  /**
   * Convertir error a objeto JSON
   * @returns {Object} - Representación JSON del error
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      type: this.type,
      statusCode: this.statusCode,
      details: this.details,
      timestamp: this.timestamp,
      stack: this.stack,
    };
  }

  /**
   * Obtener mensaje de error amigable para el usuario
   * @returns {string} - Mensaje amigable
   */
  getUserMessage() {
    switch (this.type) {
      case ERROR_TYPES.NETWORK:
        return 'Problema de conexión. Verifica tu conexión a internet.';
      case ERROR_TYPES.TIMEOUT:
        return 'La operación tardó demasiado tiempo. Intenta nuevamente.';
      case ERROR_TYPES.SERVER:
        return 'Error en el servidor. Intenta más tarde.';
      case ERROR_TYPES.NOT_FOUND:
        return 'El recurso solicitado no fue encontrado.';
      case ERROR_TYPES.AUTHENTICATION:
        return 'Credenciales inválidas. Inicia sesión nuevamente.';
      case ERROR_TYPES.AUTHORIZATION:
        return 'No tienes permisos para realizar esta acción.';
      case ERROR_TYPES.RATE_LIMIT:
        return 'Has excedido el límite de peticiones. Espera un momento.';
      case ERROR_TYPES.VALIDATION:
        return 'Los datos proporcionados no son válidos.';
      default:
        return 'Ha ocurrido un error inesperado. Intenta nuevamente.';
    }
  }
}

/**
 * Clase para manejar errores de manera global
 */
class ErrorHandler {
  constructor() {
    this.errorLog = [];
    this.maxLogSize = 100;
    this.errorCounts = {};
    this.lastErrors = new Map();
    this.suppressDuplicates = true;
    this.suppressTimeframe = 5000; // 5 segundos
  }

  /**
   * Procesar y normalizar errores
   * @param {Error|Object|string} error - Error a procesar
   * @param {Object} context - Contexto adicional
   * @returns {ApiError} - Error normalizado
   */
  processError(error, context = {}) {
    let apiError;

    if (error instanceof ApiError) {
      apiError = error;
    } else if (error instanceof Error) {
      apiError = this.convertToApiError(error, context);
    } else if (typeof error === 'object' && error.message) {
      apiError = new ApiError(
        error.message,
        error.type || ERROR_TYPES.UNKNOWN,
        error.statusCode,
        error.details
      );
    } else if (typeof error === 'string') {
      apiError = new ApiError(error, ERROR_TYPES.UNKNOWN);
    } else {
      apiError = new ApiError('Error desconocido', ERROR_TYPES.UNKNOWN);
    }

    // Agregar contexto adicional
    if (context) {
      apiError.context = context;
    }

    return apiError;
  }

  /**
   * Convertir error nativo a ApiError
   * @param {Error} error - Error nativo
   * @param {Object} context - Contexto adicional
   * @returns {ApiError} - ApiError convertido
   */
  convertToApiError(error, context = {}) {
    let type = ERROR_TYPES.UNKNOWN;
    let statusCode = null;

    // Determinar tipo de error basado en el mensaje o nombre
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      type = ERROR_TYPES.NETWORK;
    } else if (
      error.name === 'AbortError' ||
      error.message.includes('timeout')
    ) {
      type = ERROR_TYPES.TIMEOUT;
    } else if (error.message.includes('HTTP')) {
      const match = error.message.match(/HTTP (\d+)/);
      if (match) {
        statusCode = parseInt(match[1]);
        type = HTTP_STATUS_ERRORS[statusCode] || ERROR_TYPES.SERVER;
      }
    } else if (error.message.includes('JSON')) {
      type = ERROR_TYPES.CLIENT;
    }

    return new ApiError(error.message, type, statusCode, {
      originalError: error.name,
      stack: error.stack,
      ...context,
    });
  }

  /**
   * Registrar error en el log
   * @param {ApiError} error - Error a registrar
   * @param {Object} context - Contexto adicional
   */
  logError(error, context = {}) {
    const processedError = this.processError(error, context);

    // Verificar si se debe suprimir duplicados
    if (this.suppressDuplicates && this.isDuplicate(processedError)) {
      return;
    }

    // Agregar al log
    this.errorLog.push({
      ...processedError.toJSON(),
      context,
      id: this.generateErrorId(),
    });

    // Mantener el tamaño del log
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog.shift();
    }

    // Actualizar contadores
    this.updateErrorCounts(processedError.type);

    // Registrar en lastErrors para detección de duplicados
    this.lastErrors.set(processedError.message, Date.now());

    // Log en consola para desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', processedError);
    }
  }

  /**
   * Verificar si un error es duplicado
   * @param {ApiError} error - Error a verificar
   * @returns {boolean} - True si es duplicado
   */
  isDuplicate(error) {
    const lastTime = this.lastErrors.get(error.message);
    return lastTime && Date.now() - lastTime < this.suppressTimeframe;
  }

  /**
   * Generar ID único para error
   * @returns {string} - ID único
   */
  generateErrorId() {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Actualizar contadores de errores
   * @param {string} errorType - Tipo de error
   */
  updateErrorCounts(errorType) {
    this.errorCounts[errorType] = (this.errorCounts[errorType] || 0) + 1;
  }

  /**
   * Manejar error con retry automático
   * @param {Function} operation - Operación a ejecutar
   * @param {Object} options - Opciones de retry
   * @returns {Promise<*>} - Resultado de la operación
   */
  async withRetry(operation, options = {}) {
    const {
      maxRetries = 3,
      baseDelay = 1000,
      maxDelay = 10000,
      backoffFactor = 2,
      retryCondition = error => this.isRetryable(error),
    } = options;

    let lastError;
    let delay = baseDelay;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await operation();
        return result;
      } catch (error) {
        lastError = this.processError(error, { attempt, maxRetries });

        // No reintentar si es el último intento o si no es un error retryable
        if (attempt === maxRetries || !retryCondition(lastError)) {
          this.logError(lastError, { finalAttempt: true });
          throw lastError;
        }

        // Log del intento fallido
        this.logError(lastError, { retryAttempt: attempt + 1 });

        // Esperar antes del siguiente intento
        await this.delay(Math.min(delay, maxDelay));
        delay *= backoffFactor;
      }
    }

    throw lastError;
  }

  /**
   * Determinar si un error es retryable
   * @param {ApiError} error - Error a evaluar
   * @returns {boolean} - True si es retryable
   */
  isRetryable(error) {
    const retryableTypes = [
      ERROR_TYPES.NETWORK,
      ERROR_TYPES.TIMEOUT,
      ERROR_TYPES.SERVER,
    ];

    const retryableStatusCodes = [500, 502, 503, 504];

    return (
      retryableTypes.includes(error.type) ||
      retryableStatusCodes.includes(error.statusCode)
    );
  }

  /**
   * Crear delay para retry
   * @param {number} ms - Milisegundos a esperar
   * @returns {Promise<void>} - Promesa que se resuelve después del delay
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Obtener estadísticas de errores
   * @returns {Object} - Estadísticas de errores
   */
  getErrorStats() {
    return {
      totalErrors: this.errorLog.length,
      errorsByType: { ...this.errorCounts },
      recentErrors: this.errorLog.slice(-10),
      topErrors: this.getTopErrors(),
    };
  }

  /**
   * Obtener errores más frecuentes
   * @returns {Array} - Array de errores más frecuentes
   */
  getTopErrors() {
    const errorFrequency = {};

    this.errorLog.forEach(error => {
      const key = error.message;
      errorFrequency[key] = (errorFrequency[key] || 0) + 1;
    });

    return Object.entries(errorFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([message, count]) => ({ message, count }));
  }

  /**
   * Limpiar log de errores
   */
  clearErrorLog() {
    this.errorLog = [];
    this.errorCounts = {};
    this.lastErrors.clear();
  }

  /**
   * Obtener errores por tipo
   * @param {string} type - Tipo de error
   * @returns {Array} - Array de errores del tipo especificado
   */
  getErrorsByType(type) {
    return this.errorLog.filter(error => error.type === type);
  }

  /**
   * Obtener errores recientes
   * @param {number} minutes - Minutos hacia atrás
   * @returns {Array} - Array de errores recientes
   */
  getRecentErrors(minutes = 10) {
    const cutoff = Date.now() - minutes * 60 * 1000;

    return this.errorLog.filter(
      error => new Date(error.timestamp).getTime() > cutoff
    );
  }

  /**
   * Crear handler de errores para promises
   * @param {Object} context - Contexto adicional
   * @returns {Function} - Handler de errores
   */
  createErrorHandler(context = {}) {
    return error => {
      const processedError = this.processError(error, context);
      this.logError(processedError, context);
      throw processedError;
    };
  }
}

// Instancia singleton del manejador de errores
const errorHandler = new ErrorHandler();

// Funciones utilitarias
function handleError(error, context = {}) {
  return errorHandler.processError(error, context);
}

function logError(error, context = {}) {
  errorHandler.logError(error, context);
}

function withErrorHandling(operation, context = {}) {
  return async (...args) => {
    try {
      return await operation(...args);
    } catch (error) {
      throw handleError(error, context);
    }
  };
}

// Exportar clases y utilidades
export {
  ApiError,
  ERROR_TYPES,
  ErrorHandler,
  HTTP_STATUS_ERRORS,
  errorHandler,
  handleError,
  logError,
  withErrorHandling,
};
