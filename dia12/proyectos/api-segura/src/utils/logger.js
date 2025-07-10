// utils/logger.js
// Sistema de logging para eventos de seguridad

const fs = require('fs');
const path = require('path');

/**
 * Sistema de logging
 * - Eventos de seguridad
 * - Errores del sistema
 * - Actividad de usuarios
 * - Métricas de rendimiento
 */

class Logger {
  constructor() {
    this.logDir = path.join(__dirname, '../../logs');
    this.ensureLogDirectory();
  }

  /**
   * Asegurar que el directorio de logs existe
   */
  ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  /**
   * Formatear mensaje de log
   * @param {string} level - Nivel del log
   * @param {string} message - Mensaje
   * @param {Object} data - Datos adicionales
   * @returns {string} - Mensaje formateado
   */
  formatMessage(level, message, data = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...data,
    };

    return JSON.stringify(logEntry) + '\n';
  }

  /**
   * Escribir log a archivo
   * @param {string} filename - Nombre del archivo
   * @param {string} content - Contenido a escribir
   */
  writeToFile(filename, content) {
    const filePath = path.join(this.logDir, filename);

    try {
      fs.appendFileSync(filePath, content);
    } catch (error) {
      console.error('Error escribiendo log:', error);
    }
  }

  /**
   * Log de información general
   * @param {string} message - Mensaje
   * @param {Object} data - Datos adicionales
   */
  info(message, data = {}) {
    const logMessage = this.formatMessage('INFO', message, data);
    console.log(logMessage.trim());
    this.writeToFile('app.log', logMessage);
  }

  /**
   * Log de advertencias
   * @param {string} message - Mensaje
   * @param {Object} data - Datos adicionales
   */
  warn(message, data = {}) {
    const logMessage = this.formatMessage('WARN', message, data);
    console.warn(logMessage.trim());
    this.writeToFile('app.log', logMessage);
  }

  /**
   * Log de errores
   * @param {string} message - Mensaje
   * @param {Object} data - Datos adicionales
   */
  error(message, data = {}) {
    const logMessage = this.formatMessage('ERROR', message, data);
    console.error(logMessage.trim());
    this.writeToFile('error.log', logMessage);
    this.writeToFile('app.log', logMessage);
  }

  /**
   * Log de depuración
   * @param {string} message - Mensaje
   * @param {Object} data - Datos adicionales
   */
  debug(message, data = {}) {
    if (process.env.NODE_ENV === 'development') {
      const logMessage = this.formatMessage('DEBUG', message, data);
      console.debug(logMessage.trim());
      this.writeToFile('debug.log', logMessage);
    }
  }

  /**
   * Log de eventos de seguridad
   * @param {string} eventType - Tipo de evento
   * @param {Object} data - Datos del evento
   */
  security(eventType, data = {}) {
    const logMessage = this.formatMessage('SECURITY', eventType, {
      eventType,
      ...data,
    });

    console.warn(`🔐 SECURITY: ${logMessage.trim()}`);
    this.writeToFile('security.log', logMessage);
    this.writeToFile('app.log', logMessage);
  }

  /**
   * Log de métricas de rendimiento
   * @param {string} metric - Nombre de la métrica
   * @param {number} value - Valor de la métrica
   * @param {Object} data - Datos adicionales
   */
  metric(metric, value, data = {}) {
    const logMessage = this.formatMessage('METRIC', metric, {
      metric,
      value,
      ...data,
    });

    this.writeToFile('metrics.log', logMessage);
  }

  /**
   * Log de auditoría
   * @param {string} action - Acción realizada
   * @param {Object} data - Datos de la acción
   */
  audit(action, data = {}) {
    const logMessage = this.formatMessage('AUDIT', action, {
      action,
      ...data,
    });

    console.log(`📋 AUDIT: ${logMessage.trim()}`);
    this.writeToFile('audit.log', logMessage);
  }
}

// Crear instancia singleton
const logger = new Logger();

/**
 * Función helper para logging de eventos de seguridad
 * @param {string} eventType - Tipo de evento
 * @param {Object} data - Datos del evento
 */
const logSecurityEvent = (eventType, data = {}) => {
  logger.security(eventType, data);
};

/**
 * Función helper para logging de errores
 * @param {string} message - Mensaje de error
 * @param {Error} error - Objeto de error
 * @param {Object} context - Contexto adicional
 */
const logError = (message, error, context = {}) => {
  logger.error(message, {
    error: error.message,
    stack: error.stack,
    ...context,
  });
};

/**
 * Función helper para logging de auditoría
 * @param {string} action - Acción realizada
 * @param {Object} data - Datos de la acción
 */
const logAudit = (action, data = {}) => {
  logger.audit(action, data);
};

/**
 * Middleware para logging de requests
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware
 */
const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  // Log del request
  logger.info('Request received', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    contentLength: req.get('Content-Length'),
    userId: req.user?.id,
    username: req.user?.username,
  });

  // Interceptar el final de la respuesta
  const originalEnd = res.end;
  res.end = function (chunk, encoding) {
    const duration = Date.now() - startTime;

    // Log de la respuesta
    logger.info('Request completed', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      contentLength: res.get('Content-Length'),
      userId: req.user?.id,
      username: req.user?.username,
    });

    // Log de métricas
    logger.metric('request_duration', duration, {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
    });

    // Llamar al método original
    originalEnd.call(this, chunk, encoding);
  };

  next();
};

/**
 * Middleware para logging de errores
 * @param {Error} err - Error object
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware
 */
const errorLogger = (err, req, res, next) => {
  logError('Unhandled error', err, {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id,
    username: req.user?.username,
    body: req.body,
    params: req.params,
    query: req.query,
  });

  next(err);
};

/**
 * Función para limpiar logs antiguos
 * @param {number} daysToKeep - Días a mantener
 */
const cleanOldLogs = (daysToKeep = 30) => {
  const logFiles = [
    'app.log',
    'error.log',
    'security.log',
    'audit.log',
    'metrics.log',
    'debug.log',
  ];
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

  logFiles.forEach(filename => {
    const filePath = path.join(logger.logDir, filename);

    try {
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        if (stats.mtime < cutoffDate) {
          fs.unlinkSync(filePath);
          logger.info(`Deleted old log file: ${filename}`);
        }
      }
    } catch (error) {
      logger.error(`Error cleaning log file ${filename}:`, error);
    }
  });
};

/**
 * Función para generar reporte de seguridad
 * @param {number} hours - Horas a revisar
 * @returns {Object} - Reporte de seguridad
 */
const generateSecurityReport = (hours = 24) => {
  const securityLogPath = path.join(logger.logDir, 'security.log');

  if (!fs.existsSync(securityLogPath)) {
    return { events: [], total: 0 };
  }

  const cutoffTime = new Date();
  cutoffTime.setHours(cutoffTime.getHours() - hours);

  try {
    const logContent = fs.readFileSync(securityLogPath, 'utf8');
    const lines = logContent.trim().split('\n');

    const events = lines
      .filter(line => line.trim())
      .map(line => {
        try {
          return JSON.parse(line);
        } catch {
          return null;
        }
      })
      .filter(event => event && new Date(event.timestamp) > cutoffTime);

    // Agrupar por tipo de evento
    const eventTypes = events.reduce((acc, event) => {
      const type = event.eventType || 'unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    return {
      events: events.slice(0, 100), // Últimos 100 eventos
      total: events.length,
      eventTypes: eventTypes,
      timeRange: `${hours} hours`,
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    logger.error('Error generating security report:', error);
    return { events: [], total: 0, error: error.message };
  }
};

module.exports = {
  logger,
  logSecurityEvent,
  logError,
  logAudit,
  requestLogger,
  errorLogger,
  cleanOldLogs,
  generateSecurityReport,
};
