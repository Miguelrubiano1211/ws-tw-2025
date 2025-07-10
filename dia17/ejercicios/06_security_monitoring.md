# 📊 Ejercicio 6: Security Monitoring & Logging

## 📋 Información del Ejercicio

**Duración:** 45 minutos  
**Dificultad:** ⭐⭐⭐⭐  
**Prerequisitos:** Sistema de logging básico, security middleware implementado  
**Objetivos:** Implementar monitoring comprehensivo de security events y sistema de alertas

---

## 🎯 Objetivos de Aprendizaje

Al completar este ejercicio, el estudiante será capaz de:

- Implementar security event logging estructurado
- Configurar alertas automáticas para security incidents
- Crear dashboard de security metrics en tiempo real
- Implementar intrusion detection básico
- Configurar log aggregation y analysis
- Establecer incident response automation

---

## 📚 Conceptos Clave

### **Security Monitoring Components**

- **Event Logging:** Captura de security events
- **Real-time Monitoring:** Detección inmediata de threats
- **Alerting:** Notificaciones automáticas de incidents
- **Analytics:** Análisis de patterns y anomalías
- **Incident Response:** Automatización de respuestas

### **Types of Security Events**

- **Authentication Events:** Login attempts, failures, MFA
- **Authorization Events:** Access denials, privilege escalation
- **Input Validation Events:** Injection attempts, malformed requests
- **Rate Limiting Events:** Abuse patterns, DDoS attempts
- **System Events:** Errors, performance anomalies

---

## 🛠️ Tecnologías Utilizadas

- **winston** - Structured logging
- **pino** - High-performance logging
- **elasticsearch** - Log storage y search
- **grafana** - Dashboard y visualization
- **prometheus** - Metrics collection
- **nodemailer** - Email alerts
- **slack-webhook** - Slack notifications

---

## 📝 Instrucciones Paso a Paso

### **Paso 1: Configuración de Logging Estructurado (10 minutos)**

#### **1.1 Instalar dependencias de monitoring**

```bash
# Instalar dependencias de logging y monitoring
pnpm install winston pino pino-pretty prometheus-client nodemailer @slack/webhook

# Instalar dependencias de desarrollo
pnpm install -D supertest
```

#### **1.2 Configurar Winston para security logging**

```javascript
// config/security-logger.js
const winston = require('winston');
const path = require('path');

// Formato personalizado para security logs
const securityFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    return JSON.stringify({
      timestamp,
      level,
      message,
      ...meta,
      service: 'techstore-api',
      environment: process.env.NODE_ENV || 'development',
    });
  })
);

// Configuración de transports
const transports = [
  // Console transport para desarrollo
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
    level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
  }),

  // File transport para security events
  new winston.transports.File({
    filename: path.join(process.cwd(), 'logs', 'security.log'),
    format: securityFormat,
    level: 'info',
    maxsize: 50 * 1024 * 1024, // 50MB
    maxFiles: 10,
    tailable: true,
  }),

  // File transport para errores críticos
  new winston.transports.File({
    filename: path.join(process.cwd(), 'logs', 'security-errors.log'),
    format: securityFormat,
    level: 'error',
    maxsize: 10 * 1024 * 1024, // 10MB
    maxFiles: 5,
  }),
];

// Agregar transport para producción (ej: Elasticsearch)
if (process.env.NODE_ENV === 'production' && process.env.ELASTICSEARCH_URL) {
  const ElasticsearchTransport = require('winston-elasticsearch');

  transports.push(
    new ElasticsearchTransport({
      level: 'info',
      clientOpts: { node: process.env.ELASTICSEARCH_URL },
      index: 'security-logs',
      typeName: 'security-event',
      transformer: logData => {
        return {
          '@timestamp': new Date().toISOString(),
          severity: logData.level,
          message: logData.message,
          service: 'techstore-api',
          environment: process.env.NODE_ENV,
          ...logData.meta,
        };
      },
    })
  );
}

// Crear logger principal
const securityLogger = winston.createLogger({
  format: securityFormat,
  transports: transports,
  exitOnError: false,
});

// Crear loggers específicos por categoría
const loggers = {
  authentication: securityLogger.child({ category: 'authentication' }),
  authorization: securityLogger.child({ category: 'authorization' }),
  inputValidation: securityLogger.child({ category: 'input_validation' }),
  rateLimiting: securityLogger.child({ category: 'rate_limiting' }),
  systemSecurity: securityLogger.child({ category: 'system_security' }),
  incidents: securityLogger.child({ category: 'incidents' }),
};

module.exports = {
  securityLogger,
  loggers,
};
```

#### **1.3 Crear clase para Security Event Manager**

````javascript
// services/security-event-manager.js
const { loggers } = require('../config/security-logger');
const { IncomingWebhook } = require('@slack/webhook');
const nodemailer = require('nodemailer');
const { createRedisClient } = require('../config/redis');

class SecurityEventManager {
  constructor() {
    this.redis = createRedisClient();
    this.alertThresholds = {
      failedLogins: { count: 5, window: 300 }, // 5 in 5 minutes
      rateLimitViolations: { count: 10, window: 600 }, // 10 in 10 minutes
      suspiciousIPs: { count: 20, window: 1800 }, // 20 in 30 minutes
      injectionAttempts: { count: 3, window: 300 }, // 3 in 5 minutes
    };

    this.setupNotifications();
  }

  setupNotifications() {
    // Slack webhook si está configurado
    if (process.env.SLACK_WEBHOOK_URL) {
      this.slackWebhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL);
    }

    // Email transporter si está configurado
    if (process.env.SMTP_HOST) {
      this.emailTransporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    }
  }

  // Logging de eventos de autenticación
  async logAuthenticationEvent(eventType, details) {
    const event = {
      eventType,
      timestamp: new Date().toISOString(),
      ip: details.ip,
      userAgent: details.userAgent,
      email: details.email,
      success: details.success,
      reason: details.reason,
      mfaUsed: details.mfaUsed || false,
    };

    loggers.authentication.info('Authentication event', event);

    // Verificar si necesita alertas
    if (!details.success) {
      await this.checkFailedLoginThreshold(details.ip, details.email);
    }

    // Actualizar métricas
    await this.updateSecurityMetrics('authentication', eventType, event);
  }

  // Logging de eventos de autorización
  async logAuthorizationEvent(eventType, details) {
    const event = {
      eventType,
      timestamp: new Date().toISOString(),
      userId: details.userId,
      resource: details.resource,
      action: details.action,
      granted: details.granted,
      reason: details.reason,
      ip: details.ip,
    };

    loggers.authorization.info('Authorization event', event);

    // Alert para intentos de privilege escalation
    if (!details.granted && details.reason === 'insufficient_privileges') {
      await this.handleSuspiciousActivity('privilege_escalation', event);
    }

    await this.updateSecurityMetrics('authorization', eventType, event);
  }

  // Logging de eventos de validación de entrada
  async logInputValidationEvent(eventType, details) {
    const event = {
      eventType,
      timestamp: new Date().toISOString(),
      ip: details.ip,
      endpoint: details.endpoint,
      method: details.method,
      attackType: details.attackType, // sql_injection, xss, etc.
      payload: details.payload?.substring(0, 1000), // Limitar tamaño
      blocked: details.blocked,
      userAgent: details.userAgent,
    };

    loggers.inputValidation.warn('Input validation event', event);

    // Alert para injection attempts
    if (
      details.attackType &&
      ['sql_injection', 'nosql_injection', 'xss', 'command_injection'].includes(
        details.attackType
      )
    ) {
      await this.handleInjectionAttempt(details.ip, event);
    }

    await this.updateSecurityMetrics('input_validation', eventType, event);
  }

  // Logging de eventos de rate limiting
  async logRateLimitEvent(eventType, details) {
    const event = {
      eventType,
      timestamp: new Date().toISOString(),
      ip: details.ip,
      endpoint: details.endpoint,
      limit: details.limit,
      current: details.current,
      resetTime: details.resetTime,
      apiKey: details.apiKey || null,
    };

    loggers.rateLimiting.warn('Rate limit event', event);

    // Verificar patrones de abuse
    await this.checkRateLimitAbuse(details.ip, event);

    await this.updateSecurityMetrics('rate_limiting', eventType, event);
  }

  // Logging de eventos del sistema
  async logSystemSecurityEvent(eventType, details) {
    const event = {
      eventType,
      timestamp: new Date().toISOString(),
      severity: details.severity,
      component: details.component,
      message: details.message,
      metadata: details.metadata,
    };

    const logger =
      details.severity === 'critical'
        ? loggers.systemSecurity.error
        : loggers.systemSecurity.info;

    logger('System security event', event);

    // Alert para eventos críticos
    if (details.severity === 'critical') {
      await this.sendAlert('critical_system_event', event);
    }

    await this.updateSecurityMetrics('system_security', eventType, event);
  }

  // Verificar threshold de logins fallidos
  async checkFailedLoginThreshold(ip, email) {
    const threshold = this.alertThresholds.failedLogins;
    const key = `failed_logins:${ip}:${email}`;

    const count = await this.redis.incr(key);
    await this.redis.expire(key, threshold.window);

    if (count >= threshold.count) {
      await this.sendAlert('multiple_failed_logins', {
        ip,
        email,
        count,
        timeWindow: threshold.window,
      });
    }
  }

  // Manejar intentos de injection
  async handleInjectionAttempt(ip, event) {
    const threshold = this.alertThresholds.injectionAttempts;
    const key = `injection_attempts:${ip}`;

    const count = await this.redis.incr(key);
    await this.redis.expire(key, threshold.window);

    if (count >= threshold.count) {
      // Crear incident automático
      await this.createSecurityIncident('injection_attack', {
        ip,
        attempts: count,
        latestEvent: event,
      });
    }
  }

  // Verificar abuse de rate limiting
  async checkRateLimitAbuse(ip, event) {
    const threshold = this.alertThresholds.rateLimitViolations;
    const key = `rate_limit_violations:${ip}`;

    const count = await this.redis.incr(key);
    await this.redis.expire(key, threshold.window);

    if (count >= threshold.count) {
      await this.sendAlert('rate_limit_abuse', {
        ip,
        violations: count,
        latestEndpoint: event.endpoint,
      });
    }
  }

  // Manejar actividad sospechosa
  async handleSuspiciousActivity(activityType, details) {
    const incident = {
      type: activityType,
      timestamp: new Date().toISOString(),
      details,
      severity: 'medium',
      status: 'open',
    };

    loggers.incidents.warn('Suspicious activity detected', incident);
    await this.sendAlert('suspicious_activity', incident);
  }

  // Crear incident de seguridad
  async createSecurityIncident(incidentType, details) {
    const incident = {
      id: `INC-${Date.now()}`,
      type: incidentType,
      timestamp: new Date().toISOString(),
      severity: 'high',
      status: 'open',
      details,
      assignee: null,
      resolution: null,
    };

    loggers.incidents.error('Security incident created', incident);

    // Almacenar en Redis para tracking
    await this.redis.setex(
      `security_incident:${incident.id}`,
      7 * 24 * 3600, // 7 días
      JSON.stringify(incident)
    );

    await this.sendAlert('security_incident', incident);

    return incident;
  }

  // Enviar alertas
  async sendAlert(alertType, data) {
    const alert = {
      type: alertType,
      timestamp: new Date().toISOString(),
      data,
      severity: this.getAlertSeverity(alertType),
    };

    // Slack notification
    if (this.slackWebhook) {
      await this.sendSlackAlert(alert);
    }

    // Email notification para incidentes críticos
    if (alert.severity === 'critical' && this.emailTransporter) {
      await this.sendEmailAlert(alert);
    }

    loggers.incidents.warn('Security alert sent', alert);
  }

  async sendSlackAlert(alert) {
    try {
      const color = {
        low: 'good',
        medium: 'warning',
        high: 'danger',
        critical: '#ff0000',
      }[alert.severity];

      await this.slackWebhook.send({
        text: `🚨 Security Alert: ${alert.type}`,
        attachments: [
          {
            color,
            fields: [
              {
                title: 'Alert Type',
                value: alert.type,
                short: true,
              },
              {
                title: 'Severity',
                value: alert.severity.toUpperCase(),
                short: true,
              },
              {
                title: 'Timestamp',
                value: alert.timestamp,
                short: true,
              },
              {
                title: 'Details',
                value: '```' + JSON.stringify(alert.data, null, 2) + '```',
                short: false,
              },
            ],
          },
        ],
      });
    } catch (error) {
      console.error('Error sending Slack alert:', error);
    }
  }

  async sendEmailAlert(alert) {
    try {
      const subject = `🚨 Critical Security Alert: ${alert.type}`;
      const html = `
        <h2>Security Alert</h2>
        <p><strong>Type:</strong> ${alert.type}</p>
        <p><strong>Severity:</strong> ${alert.severity}</p>
        <p><strong>Timestamp:</strong> ${alert.timestamp}</p>
        <h3>Details:</h3>
        <pre>${JSON.stringify(alert.data, null, 2)}</pre>
      `;

      await this.emailTransporter.sendMail({
        from: process.env.ALERT_EMAIL_FROM,
        to: process.env.ALERT_EMAIL_TO,
        subject,
        html,
      });
    } catch (error) {
      console.error('Error sending email alert:', error);
    }
  }

  getAlertSeverity(alertType) {
    const severityMap = {
      multiple_failed_logins: 'medium',
      rate_limit_abuse: 'medium',
      suspicious_activity: 'medium',
      injection_attack: 'high',
      security_incident: 'high',
      critical_system_event: 'critical',
    };

    return severityMap[alertType] || 'low';
  }

  // Actualizar métricas de seguridad
  async updateSecurityMetrics(category, eventType, event) {
    const date = new Date().toISOString().slice(0, 10);
    const hour = new Date().getHours();

    const metricsKey = `security_metrics:${category}:${date}`;
    const hourlyKey = `security_metrics:${category}:${date}:${hour}`;

    const pipeline = this.redis.pipeline();

    // Métricas diarias
    pipeline.hincrby(metricsKey, 'total_events', 1);
    pipeline.hincrby(metricsKey, `event_${eventType}`, 1);
    pipeline.expire(metricsKey, 30 * 24 * 3600); // 30 días

    // Métricas por hora
    pipeline.hincrby(hourlyKey, 'events', 1);
    pipeline.expire(hourlyKey, 7 * 24 * 3600); // 7 días

    await pipeline.exec();
  }

  // Obtener dashboard de métricas
  async getSecurityMetrics(timeframe = 'daily') {
    const date = new Date().toISOString().slice(0, 10);

    const categories = [
      'authentication',
      'authorization',
      'input_validation',
      'rate_limiting',
      'system_security',
    ];
    const metrics = {};

    for (const category of categories) {
      const key = `security_metrics:${category}:${date}`;
      const categoryMetrics = await this.redis.hgetall(key);

      metrics[category] = {};
      for (const [field, value] of Object.entries(categoryMetrics)) {
        metrics[category][field] = parseInt(value) || 0;
      }
    }

    return {
      date,
      timeframe,
      metrics,
      summary: {
        totalEvents: Object.values(metrics).reduce(
          (sum, cat) => sum + (cat.total_events || 0),
          0
        ),
        criticalAlerts: await this.getCriticalAlertsCount(date),
        activeIncidents: await this.getActiveIncidentsCount(),
      },
    };
  }

  async getCriticalAlertsCount(date) {
    // Implementar conteo de alertas críticas
    return 0; // Placeholder
  }

  async getActiveIncidentsCount() {
    const keys = await this.redis.keys('security_incident:*');
    return keys.length;
  }
}

const securityEventManager = new SecurityEventManager();

module.exports = {
  SecurityEventManager,
  securityEventManager,
};
````

### **Paso 2: Integrar Monitoring en Middlewares (10 minutos)**

#### **2.1 Actualizar middleware de autenticación**

```javascript
// middleware/auth-with-monitoring.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { securityEventManager } = require('../services/security-event-manager');

const authenticateTokenWithMonitoring = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      await securityEventManager.logAuthenticationEvent('missing_token', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        endpoint: req.path,
        success: false,
        reason: 'no_token_provided',
      });

      return res.status(401).json({
        error: 'Token de acceso requerido',
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) {
        await securityEventManager.logAuthenticationEvent('invalid_token', {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          tokenPayload: { userId: decoded.id },
          success: false,
          reason: 'user_not_found',
        });

        return res.status(401).json({
          error: 'Token inválido',
        });
      }

      // Log successful authentication
      await securityEventManager.logAuthenticationEvent(
        'token_validation_success',
        {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          userId: user._id,
          email: user.email,
          success: true,
        }
      );

      req.user = user;
      next();
    } catch (jwtError) {
      await securityEventManager.logAuthenticationEvent(
        'token_validation_failed',
        {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          success: false,
          reason: jwtError.name,
          error: jwtError.message,
        }
      );

      return res.status(403).json({
        error: 'Token inválido',
      });
    }
  } catch (error) {
    await securityEventManager.logSystemSecurityEvent(
      'authentication_system_error',
      {
        severity: 'high',
        component: 'auth_middleware',
        message: 'Authentication system error',
        metadata: {
          error: error.message,
          stack: error.stack,
          ip: req.ip,
        },
      }
    );

    console.error('Authentication error:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
    });
  }
};

module.exports = {
  authenticateTokenWithMonitoring,
};
```

#### **2.2 Actualizar validation middleware con monitoring**

```javascript
// middleware/validation-with-monitoring.js
const { securityEventManager } = require('../services/security-event-manager');

const validateWithMonitoring = (schema, property = 'body') => {
  return async (req, res, next) => {
    try {
      const { error, value } = schema.validate(req[property], {
        abortEarly: false,
        stripUnknown: true,
        allowUnknown: false,
      });

      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message,
          value: detail.context.value,
        }));

        // Detectar posibles injection attempts
        const suspiciousPatterns = [
          /(<script|javascript:|vbscript:|onload=|onerror=)/i,
          /(union\s+select|drop\s+table|insert\s+into|delete\s+from)/i,
          /(\$ne|\$gt|\$lt|\$regex|\$where)/i,
          /(exec\s*\(|eval\s*\(|system\s*\()/i,
        ];

        let attackType = null;
        const payload = JSON.stringify(req[property]);

        for (const pattern of suspiciousPatterns) {
          if (pattern.test(payload)) {
            if (pattern.toString().includes('script|javascript')) {
              attackType = 'xss';
            } else if (pattern.toString().includes('union|select|drop')) {
              attackType = 'sql_injection';
            } else if (pattern.toString().includes('\\$ne|\\$gt')) {
              attackType = 'nosql_injection';
            } else if (pattern.toString().includes('exec|eval|system')) {
              attackType = 'command_injection';
            }
            break;
          }
        }

        if (attackType) {
          await securityEventManager.logInputValidationEvent(
            'injection_attempt_detected',
            {
              ip: req.ip,
              userAgent: req.get('User-Agent'),
              endpoint: req.path,
              method: req.method,
              attackType,
              payload,
              blocked: true,
            }
          );
        } else {
          await securityEventManager.logInputValidationEvent(
            'validation_failed',
            {
              ip: req.ip,
              endpoint: req.path,
              method: req.method,
              errors: errors.length,
              blocked: true,
            }
          );
        }

        return res.status(400).json({
          error: 'Errores de validación',
          details: errors,
        });
      }

      req[property] = value;
      next();
    } catch (validationError) {
      await securityEventManager.logSystemSecurityEvent(
        'validation_system_error',
        {
          severity: 'medium',
          component: 'validation_middleware',
          message: 'Validation system error',
          metadata: {
            error: validationError.message,
            endpoint: req.path,
          },
        }
      );

      console.error('Validation error:', validationError);
      res.status(500).json({
        error: 'Error interno del servidor',
      });
    }
  };
};

module.exports = {
  validateWithMonitoring,
};
```

### **Paso 3: Dashboard de Security Metrics (15 minutos)**

#### **3.1 Crear endpoint de dashboard**

```javascript
// routes/security-dashboard.js
const express = require('express');
const router = express.Router();
const { securityEventManager } = require('../services/security-event-manager');
const {
  authenticateTokenWithMonitoring,
} = require('../middleware/auth-with-monitoring');
const { requireScope } = require('../middleware/api-key-auth');

// Middleware de autenticación admin
const requireAdmin = (req, res, next) => {
  if (
    req.user?.role !== 'admin' &&
    !req.apiKey?.scopes?.includes('admin:all')
  ) {
    return res.status(403).json({
      error: 'Acceso denegado',
      details: 'Se requieren privilegios de administrador',
    });
  }
  next();
};

// GET /api/security/dashboard - Métricas principales
router.get(
  '/dashboard',
  authenticateTokenWithMonitoring,
  requireAdmin,
  async (req, res) => {
    try {
      const timeframe = req.query.timeframe || 'daily';
      const metrics = await securityEventManager.getSecurityMetrics(timeframe);

      res.json({
        success: true,
        data: metrics,
      });
    } catch (error) {
      console.error('Error fetching security dashboard:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
      });
    }
  }
);

// GET /api/security/incidents - Incidentes activos
router.get(
  '/incidents',
  authenticateTokenWithMonitoring,
  requireAdmin,
  async (req, res) => {
    try {
      const redis = securityEventManager.redis;
      const incidentKeys = await redis.keys('security_incident:*');

      const incidents = [];
      for (const key of incidentKeys) {
        const incidentData = await redis.get(key);
        if (incidentData) {
          incidents.push(JSON.parse(incidentData));
        }
      }

      // Ordenar por timestamp (más recientes primero)
      incidents.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      res.json({
        success: true,
        data: {
          incidents,
          total: incidents.length,
          open: incidents.filter(i => i.status === 'open').length,
        },
      });
    } catch (error) {
      console.error('Error fetching security incidents:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
      });
    }
  }
);

// POST /api/security/incidents/:id/resolve - Resolver incidente
router.post(
  '/incidents/:id/resolve',
  authenticateTokenWithMonitoring,
  requireAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { resolution } = req.body;

      const redis = securityEventManager.redis;
      const incidentKey = `security_incident:${id}`;
      const incidentData = await redis.get(incidentKey);

      if (!incidentData) {
        return res.status(404).json({
          error: 'Incidente no encontrado',
        });
      }

      const incident = JSON.parse(incidentData);
      incident.status = 'resolved';
      incident.resolution = resolution;
      incident.resolvedBy = req.user.id;
      incident.resolvedAt = new Date().toISOString();

      await redis.setex(incidentKey, 30 * 24 * 3600, JSON.stringify(incident)); // 30 días

      await securityEventManager.logSystemSecurityEvent('incident_resolved', {
        severity: 'info',
        component: 'incident_management',
        message: 'Security incident resolved',
        metadata: {
          incidentId: id,
          resolvedBy: req.user.email,
          resolution,
        },
      });

      res.json({
        success: true,
        data: incident,
      });
    } catch (error) {
      console.error('Error resolving security incident:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
      });
    }
  }
);

// GET /api/security/alerts/recent - Alertas recientes
router.get(
  '/alerts/recent',
  authenticateTokenWithMonitoring,
  requireAdmin,
  async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 50;
      const hours = parseInt(req.query.hours) || 24;

      // En un sistema real, esto vendría de una base de datos de logs
      // Por ahora simularemos con datos de ejemplo

      const alerts = [
        {
          id: 'alert-1',
          type: 'multiple_failed_logins',
          severity: 'medium',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          message: 'Multiple failed login attempts detected',
          details: { ip: '192.168.1.100', count: 7 },
        },
        {
          id: 'alert-2',
          type: 'rate_limit_abuse',
          severity: 'medium',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          message: 'Rate limit violations detected',
          details: { ip: '10.0.0.50', violations: 15 },
        },
      ];

      res.json({
        success: true,
        data: {
          alerts: alerts.slice(0, limit),
          total: alerts.length,
        },
      });
    } catch (error) {
      console.error('Error fetching recent alerts:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
      });
    }
  }
);

// GET /api/security/health - Health check del sistema de seguridad
router.get(
  '/health',
  authenticateTokenWithMonitoring,
  requireAdmin,
  async (req, res) => {
    try {
      const redis = securityEventManager.redis;

      // Verificar conectividad de componentes
      const checks = {
        redis: { status: 'unknown', message: '' },
        logging: { status: 'unknown', message: '' },
        alerting: { status: 'unknown', message: '' },
      };

      // Check Redis
      try {
        await redis.ping();
        checks.redis = { status: 'healthy', message: 'Redis connection OK' };
      } catch (error) {
        checks.redis = {
          status: 'unhealthy',
          message: 'Redis connection failed',
        };
      }

      // Check Logging
      try {
        await securityEventManager.logSystemSecurityEvent('health_check', {
          severity: 'info',
          component: 'health_monitor',
          message: 'Security system health check',
        });
        checks.logging = { status: 'healthy', message: 'Logging system OK' };
      } catch (error) {
        checks.logging = {
          status: 'unhealthy',
          message: 'Logging system failed',
        };
      }

      // Check Alerting
      checks.alerting = {
        status: process.env.SLACK_WEBHOOK_URL ? 'healthy' : 'warning',
        message: process.env.SLACK_WEBHOOK_URL
          ? 'Alerting configured'
          : 'No alerting configured',
      };

      const overallStatus = Object.values(checks).every(
        check => check.status === 'healthy'
      )
        ? 'healthy'
        : 'degraded';

      res.json({
        success: true,
        data: {
          status: overallStatus,
          timestamp: new Date().toISOString(),
          checks,
        },
      });
    } catch (error) {
      console.error('Error checking security health:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
      });
    }
  }
);

module.exports = router;
```

#### **3.2 Frontend simple para dashboard**

```html
<!-- public/security-dashboard.html -->
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0" />
    <title>Security Dashboard - TechStore</title>
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
      rel="stylesheet" />
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  </head>
  <body>
    <nav class="navbar navbar-dark bg-dark">
      <div class="container-fluid">
        <span class="navbar-brand mb-0 h1">🔒 Security Dashboard</span>
        <span class="navbar-text">
          <span
            id="status-indicator"
            class="badge bg-success"
            >System Healthy</span
          >
        </span>
      </div>
    </nav>

    <div class="container-fluid mt-4">
      <!-- Métricas principales -->
      <div class="row mb-4">
        <div class="col-md-3">
          <div class="card bg-primary text-white">
            <div class="card-body">
              <h5 class="card-title">Total Events Today</h5>
              <h2
                id="total-events"
                class="card-text">
                -
              </h2>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-warning text-white">
            <div class="card-body">
              <h5 class="card-title">Active Incidents</h5>
              <h2
                id="active-incidents"
                class="card-text">
                -
              </h2>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-danger text-white">
            <div class="card-body">
              <h5 class="card-title">Critical Alerts</h5>
              <h2
                id="critical-alerts"
                class="card-text">
                -
              </h2>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-info text-white">
            <div class="card-body">
              <h5 class="card-title">Auth Events</h5>
              <h2
                id="auth-events"
                class="card-text">
                -
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <!-- Gráfico de eventos por categoría -->
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5>Security Events by Category</h5>
            </div>
            <div class="card-body">
              <canvas id="events-chart"></canvas>
            </div>
          </div>
        </div>

        <!-- Incidentes recientes -->
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5>Recent Security Incidents</h5>
            </div>
            <div class="card-body">
              <div
                id="incidents-list"
                class="list-group">
                <!-- Incidents will be loaded here -->
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Alertas recientes -->
      <div class="row mt-4">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5>Recent Alerts</h5>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Type</th>
                      <th>Severity</th>
                      <th>Message</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody id="alerts-table">
                    <!-- Alerts will be loaded here -->
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <script>
      class SecurityDashboard {
        constructor() {
          this.token = localStorage.getItem('token');
          this.chart = null;
          this.refreshInterval = 30000; // 30 segundos

          this.init();
        }

        async init() {
          if (!this.token) {
            window.location.href = '/login.html';
            return;
          }

          await this.loadDashboard();
          this.setupAutoRefresh();
          this.initChart();
        }

        async loadDashboard() {
          try {
            const [metrics, incidents, alerts, health] = await Promise.all([
              this.fetchMetrics(),
              this.fetchIncidents(),
              this.fetchAlerts(),
              this.fetchHealth(),
            ]);

            this.updateMetrics(metrics);
            this.updateIncidents(incidents);
            this.updateAlerts(alerts);
            this.updateHealth(health);
          } catch (error) {
            console.error('Error loading dashboard:', error);
          }
        }

        async fetchMetrics() {
          const response = await fetch('/api/security/dashboard', {
            headers: { Authorization: `Bearer ${this.token}` },
          });

          if (!response.ok) throw new Error('Failed to fetch metrics');
          return response.json();
        }

        async fetchIncidents() {
          const response = await fetch('/api/security/incidents', {
            headers: { Authorization: `Bearer ${this.token}` },
          });

          if (!response.ok) throw new Error('Failed to fetch incidents');
          return response.json();
        }

        async fetchAlerts() {
          const response = await fetch('/api/security/alerts/recent', {
            headers: { Authorization: `Bearer ${this.token}` },
          });

          if (!response.ok) throw new Error('Failed to fetch alerts');
          return response.json();
        }

        async fetchHealth() {
          const response = await fetch('/api/security/health', {
            headers: { Authorization: `Bearer ${this.token}` },
          });

          if (!response.ok) throw new Error('Failed to fetch health');
          return response.json();
        }

        updateMetrics(data) {
          const metrics = data.data;

          document.getElementById('total-events').textContent =
            metrics.summary.totalEvents;
          document.getElementById('active-incidents').textContent =
            metrics.summary.activeIncidents;
          document.getElementById('critical-alerts').textContent =
            metrics.summary.criticalAlerts;

          const authEvents = metrics.metrics.authentication?.total_events || 0;
          document.getElementById('auth-events').textContent = authEvents;

          this.updateChart(metrics.metrics);
        }

        updateIncidents(data) {
          const incidentsList = document.getElementById('incidents-list');
          incidentsList.innerHTML = '';

          const incidents = data.data.incidents.slice(0, 5); // Mostrar últimos 5

          incidents.forEach(incident => {
            const item = document.createElement('div');
            item.className =
              'list-group-item d-flex justify-content-between align-items-center';

            const statusColor =
              incident.status === 'open' ? 'danger' : 'success';

            item.innerHTML = `
                        <div>
                            <h6 class="mb-1">${incident.type}</h6>
                            <small class="text-muted">${new Date(
                              incident.timestamp
                            ).toLocaleString()}</small>
                        </div>
                        <span class="badge bg-${statusColor}">${
              incident.status
            }</span>
                    `;

            incidentsList.appendChild(item);
          });
        }

        updateAlerts(data) {
          const alertsTable = document.getElementById('alerts-table');
          alertsTable.innerHTML = '';

          data.data.alerts.forEach(alert => {
            const row = document.createElement('tr');

            const severityClass = {
              low: 'success',
              medium: 'warning',
              high: 'danger',
              critical: 'dark',
            }[alert.severity];

            row.innerHTML = `
                        <td>${new Date(alert.timestamp).toLocaleString()}</td>
                        <td>${alert.type}</td>
                        <td><span class="badge bg-${severityClass}">${
              alert.severity
            }</span></td>
                        <td>${alert.message}</td>
                        <td><small>${JSON.stringify(alert.details)}</small></td>
                    `;

            alertsTable.appendChild(row);
          });
        }

        updateHealth(data) {
          const health = data.data;
          const indicator = document.getElementById('status-indicator');

          if (health.status === 'healthy') {
            indicator.className = 'badge bg-success';
            indicator.textContent = 'System Healthy';
          } else {
            indicator.className = 'badge bg-warning';
            indicator.textContent = 'System Degraded';
          }
        }

        initChart() {
          const ctx = document.getElementById('events-chart').getContext('2d');

          this.chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
              labels: [
                'Authentication',
                'Authorization',
                'Input Validation',
                'Rate Limiting',
                'System',
              ],
              datasets: [
                {
                  data: [0, 0, 0, 0, 0],
                  backgroundColor: [
                    '#007bff',
                    '#28a745',
                    '#ffc107',
                    '#dc3545',
                    '#6c757d',
                  ],
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
            },
          });
        }

        updateChart(metrics) {
          if (!this.chart) return;

          const data = [
            metrics.authentication?.total_events || 0,
            metrics.authorization?.total_events || 0,
            metrics.input_validation?.total_events || 0,
            metrics.rate_limiting?.total_events || 0,
            metrics.system_security?.total_events || 0,
          ];

          this.chart.data.datasets[0].data = data;
          this.chart.update();
        }

        setupAutoRefresh() {
          setInterval(() => {
            this.loadDashboard();
          }, this.refreshInterval);
        }
      }

      // Inicializar dashboard cuando la página carga
      document.addEventListener('DOMContentLoaded', () => {
        new SecurityDashboard();
      });
    </script>
  </body>
</html>
```

### **Paso 4: Configuración de Variables de Entorno (5 minutos)**

#### **4.1 Actualizar .env con configuración de monitoring**

```bash
# .env - Agregar configuración de security monitoring

# Security Monitoring
SECURITY_LOGGING_LEVEL=info
SECURITY_LOG_MAX_SIZE=50MB
SECURITY_LOG_MAX_FILES=10

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Alerting Configuration
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
ALERT_EMAIL_FROM=security@techstore.com
ALERT_EMAIL_TO=admin@techstore.com,security-team@techstore.com

# SMTP Configuration for Email Alerts
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Elasticsearch (if using in production)
ELASTICSEARCH_URL=http://localhost:9200

# Security Thresholds
FAILED_LOGIN_THRESHOLD=5
RATE_LIMIT_THRESHOLD=10
INJECTION_THRESHOLD=3
```

### **Paso 5: Testing del Sistema de Monitoring (5 minutos)**

#### **5.1 Script de testing**

```javascript
// scripts/test-security-monitoring.js
const { securityEventManager } = require('../services/security-event-manager');

async function testSecurityMonitoring() {
  console.log('🧪 Testing Security Monitoring System...\n');

  // Test 1: Authentication events
  console.log('1. Testing authentication events...');
  await securityEventManager.logAuthenticationEvent('login_attempt', {
    ip: '192.168.1.100',
    userAgent: 'Test-Agent/1.0',
    email: 'test@example.com',
    success: false,
    reason: 'invalid_password',
  });

  // Test 2: Input validation events
  console.log('2. Testing input validation events...');
  await securityEventManager.logInputValidationEvent(
    'injection_attempt_detected',
    {
      ip: '10.0.0.50',
      userAgent: 'Evil-Bot/1.0',
      endpoint: '/api/productos',
      method: 'POST',
      attackType: 'sql_injection',
      payload: "'; DROP TABLE users; --",
      blocked: true,
    }
  );

  // Test 3: Rate limiting events
  console.log('3. Testing rate limiting events...');
  await securityEventManager.logRateLimitEvent('rate_limit_exceeded', {
    ip: '203.0.113.0',
    endpoint: '/api/auth/login',
    limit: 5,
    current: 6,
    resetTime: new Date(Date.now() + 900000).toISOString(),
  });

  // Test 4: System security events
  console.log('4. Testing system security events...');
  await securityEventManager.logSystemSecurityEvent('suspicious_activity', {
    severity: 'high',
    component: 'file_upload',
    message: 'Potentially malicious file upload attempt',
    metadata: {
      filename: 'malware.exe',
      filesize: 1024000,
      ip: '198.51.100.0',
    },
  });

  // Test 5: Create security incident
  console.log('5. Testing security incident creation...');
  await securityEventManager.createSecurityIncident('injection_attack', {
    ip: '10.0.0.50',
    attempts: 5,
    attackType: 'sql_injection',
  });

  console.log('\n✅ Security monitoring tests completed!');
  console.log('Check logs/security.log for detailed logs');
  console.log('Check Slack/Email for alerts (if configured)');
}

if (require.main === module) {
  testSecurityMonitoring().catch(console.error);
}

module.exports = { testSecurityMonitoring };
```

---

## ✅ Criterios de Validación

### **Logging & Monitoring**

- ✅ Security events logging estructurado
- ✅ Categorización apropiada de eventos
- ✅ Real-time monitoring funcionando
- ✅ Log rotation y retention configurados
- ✅ Integration con systems externos (Slack, Email)

### **Alerting & Incidents**

- ✅ Alertas automáticas para thresholds
- ✅ Security incidents creation automática
- ✅ Notification channels funcionando
- ✅ Incident tracking y resolution
- ✅ Escalation procedures implementadas

### **Dashboard & Analytics**

- ✅ Security metrics dashboard funcionando
- ✅ Real-time data visualization
- ✅ Historical data y trends
- ✅ Health monitoring del sistema
- ✅ Admin controls para incident management

---

## 🧪 Pruebas de Validación

### **1. Test logging de eventos**

```bash
# Ejecutar test de monitoring
node scripts/test-security-monitoring.js

# Verificar logs generados
tail -f logs/security.log

# Verificar métricas en Redis
redis-cli keys "security_metrics:*"
```

### **2. Test alerting**

```bash
# Simular múltiples failed logins
for i in {1..6}; do
  curl -X POST http://localhost:3001/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"wrong"}'
done
```

### **3. Test dashboard**

```bash
# Acceder al dashboard
open http://localhost:3001/security-dashboard.html

# Verificar API endpoints
curl -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  http://localhost:3001/api/security/dashboard
```

---

## 📚 Recursos Adicionales

### **Security Monitoring Tools**

- [Winston](https://github.com/winstonjs/winston) - Structured logging
- [Grafana](https://grafana.com/) - Dashboards y visualization
- [Prometheus](https://prometheus.io/) - Metrics collection
- [ELK Stack](https://www.elastic.co/elk-stack) - Log aggregation

### **Best Practices**

- [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)
- [Security Incident Response](https://www.sans.org/white-papers/901/)

---

## 🎯 Entregables

1. **Security Event Logger:** Sistema completo de logging de eventos
2. **Alerting System:** Notificaciones automáticas de incidents
3. **Security Dashboard:** Dashboard web con métricas en tiempo real
4. **Incident Management:** Sistema de tracking y resolución
5. **Health Monitoring:** Monitoring del sistema de seguridad
6. **Documentation:** Guías de uso y configuración

---

**¡Security Monitoring completado! El sistema ahora tiene visibility completa de security events y capacidad de response automático.**
