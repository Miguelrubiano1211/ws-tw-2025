# 🛡️ Proyecto Integrador: TechStore Security Hardening

## 📋 Información del Proyecto

**Duración:** 90 minutos  
**Dificultad:** ⭐⭐⭐⭐⭐  
**Tipo:** Proyecto integrador de seguridad  
**Modalidad:** Individual con validación grupal

---

## 🎯 Objetivo General

Implementar un proceso completo de security hardening en la aplicación TechStore, aplicando todas las técnicas de seguridad aprendidas durante el día para crear una aplicación web robusta y segura según estándares WorldSkills.

---

## 📚 Competencias a Evaluar

### **Técnicas:**

- ✅ Implementación de Multi-Factor Authentication (MFA)
- ✅ Security vulnerability assessment y remediation
- ✅ Input validation y sanitización avanzada
- ✅ Configuración de security headers comprehensivos
- ✅ API security y rate limiting inteligente
- ✅ Security monitoring y alerting systems

### **Transversales:**

- ✅ Análisis de riesgos de seguridad
- ✅ Documentación de security policies
- ✅ Testing de security features
- ✅ Incident response planning

---

## 🏗️ Arquitectura del Proyecto

```
techstore-security/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── MFASetup.jsx
│   │   │   │   ├── MFAVerification.jsx
│   │   │   │   └── BackupCodes.jsx
│   │   │   ├── security/
│   │   │   │   ├── SecurityDashboard.jsx
│   │   │   │   ├── SecurityAlerts.jsx
│   │   │   │   └── AuditLog.jsx
│   │   │   └── forms/
│   │   │       ├── SecureForm.jsx
│   │   │       └── ValidationMessage.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useMFA.js
│   │   │   └── useSecurityMonitoring.js
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   ├── mfaService.js
│   │   │   └── securityService.js
│   │   └── utils/
│   │       ├── validation.js
│   │       ├── sanitization.js
│   │       └── securityHelpers.js
│   └── public/
│       └── security.txt
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── mfaController.js
│   │   │   ├── securityController.js
│   │   │   └── auditController.js
│   │   ├── middleware/
│   │   │   ├── security.js
│   │   │   ├── rateLimiting.js
│   │   │   ├── validation.js
│   │   │   ├── monitoring.js
│   │   │   └── mfa.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── SecurityEvent.js
│   │   │   ├── AuditLog.js
│   │   │   └── MFADevice.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── mfa.js
│   │   │   ├── security.js
│   │   │   └── audit.js
│   │   ├── services/
│   │   │   ├── mfaService.js
│   │   │   ├── securityService.js
│   │   │   ├── auditService.js
│   │   │   └── notificationService.js
│   │   └── utils/
│   │       ├── encryption.js
│   │       ├── tokenUtils.js
│   │       ├── securityUtils.js
│   │       └── validators.js
│   ├── config/
│   │   ├── security.js
│   │   ├── database.js
│   │   └── monitoring.js
│   └── tests/
│       ├── security/
│       ├── auth/
│       └── integration/
├── docker/
│   ├── docker-compose.security.yml
│   ├── nginx/
│   │   └── security.conf
│   └── monitoring/
│       ├── prometheus.yml
│       └── grafana/
├── docs/
│   ├── SECURITY_POLICY.md
│   ├── INCIDENT_RESPONSE.md
│   ├── SECURITY_CHECKLIST.md
│   └── VULNERABILITY_ASSESSMENT.md
└── scripts/
    ├── security-audit.sh
    ├── vulnerability-scan.sh
    └── security-test.sh
```

---

## 🚀 Fases de Implementación

### **Fase 1: Security Foundation (20 min)**

#### **1.1 Configuración Inicial de Seguridad**

```javascript
// backend/src/config/security.js
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const securityConfig = {
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

  // HSTS Configuration
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },

  // Rate Limiting
  rateLimiting: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
      error: 'Demasiadas solicitudes desde esta IP',
      retryAfter: '15 minutos',
    },
    standardHeaders: true,
    legacyHeaders: false,
  },
};

module.exports = securityConfig;
```

#### **1.2 Security Middleware Setup**

```javascript
// backend/src/middleware/security.js
const helmet = require('helmet');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');
const securityConfig = require('../config/security');

const setupSecurity = app => {
  // Helmet configuration
  app.use(
    helmet({
      contentSecurityPolicy: securityConfig.csp,
      hsts: securityConfig.hsts,
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );

  // CORS configuration
  app.use(
    cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
      optionsSuccessStatus: 200,
    })
  );

  // Sanitization middlewares
  app.use(mongoSanitize()); // NoSQL injection prevention
  app.use(xss()); // XSS protection
  app.use(hpp()); // HTTP Parameter Pollution prevention

  // Compression
  app.use(compression());

  // Security headers
  app.use((req, res, next) => {
    res.setHeader('X-Powered-By', 'TechStore Security');
    res.setHeader('Server', 'TechStore');
    next();
  });
};

module.exports = setupSecurity;
```

### **Fase 2: Multi-Factor Authentication (25 min)**

#### **2.1 MFA Service Implementation**

```javascript
// backend/src/services/mfaService.js
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const crypto = require('crypto');
const MFADevice = require('../models/MFADevice');
const User = require('../models/User');

class MFAService {
  /**
   * Generar secreto y QR code para configuración MFA
   */
  async generateMFASecret(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const secret = speakeasy.generateSecret({
      name: `TechStore (${user.email})`,
      issuer: 'TechStore Security',
      length: 32,
    });

    // Generar QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    // Guardar secret temporalmente (no confirmado)
    await MFADevice.findOneAndUpdate(
      { userId, confirmed: false },
      {
        userId,
        secret: this.encrypt(secret.base32),
        confirmed: false,
        createdAt: new Date(),
      },
      { upsert: true }
    );

    return {
      secret: secret.base32,
      qrCode: qrCodeUrl,
      manualEntry: secret.base32,
    };
  }

  /**
   * Verificar código TOTP y confirmar MFA
   */
  async verifyAndConfirmMFA(userId, token) {
    const mfaDevice = await MFADevice.findOne({
      userId,
      confirmed: false,
    });

    if (!mfaDevice) {
      throw new Error('No hay configuración MFA pendiente');
    }

    const secret = this.decrypt(mfaDevice.secret);
    const verified = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 2, // Tolerancia de 60 segundos
    });

    if (!verified) {
      throw new Error('Código MFA inválido');
    }

    // Confirmar dispositivo MFA
    mfaDevice.confirmed = true;
    mfaDevice.confirmedAt = new Date();
    await mfaDevice.save();

    // Generar backup codes
    const backupCodes = this.generateBackupCodes();
    mfaDevice.backupCodes = backupCodes.map(code => this.hashBackupCode(code));
    await mfaDevice.save();

    // Actualizar usuario
    await User.findByIdAndUpdate(userId, {
      mfaEnabled: true,
      mfaEnabledAt: new Date(),
    });

    return {
      success: true,
      backupCodes,
    };
  }

  /**
   * Verificar código MFA en login
   */
  async verifyMFALogin(userId, token, isBackupCode = false) {
    const mfaDevice = await MFADevice.findOne({
      userId,
      confirmed: true,
    });

    if (!mfaDevice) {
      throw new Error('MFA no configurado para este usuario');
    }

    if (isBackupCode) {
      return this.verifyBackupCode(mfaDevice, token);
    }

    const secret = this.decrypt(mfaDevice.secret);
    const verified = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 2,
    });

    if (!verified) {
      throw new Error('Código MFA inválido');
    }

    // Registrar uso exitoso
    mfaDevice.lastUsed = new Date();
    await mfaDevice.save();

    return { success: true };
  }

  /**
   * Verificar backup code
   */
  async verifyBackupCode(mfaDevice, code) {
    const hashedCode = this.hashBackupCode(code);
    const codeIndex = mfaDevice.backupCodes.indexOf(hashedCode);

    if (codeIndex === -1) {
      throw new Error('Código de respaldo inválido');
    }

    // Remover código usado
    mfaDevice.backupCodes.splice(codeIndex, 1);
    mfaDevice.lastUsed = new Date();
    await mfaDevice.save();

    return {
      success: true,
      remainingCodes: mfaDevice.backupCodes.length,
    };
  }

  /**
   * Generar códigos de respaldo
   */
  generateBackupCodes(count = 10) {
    const codes = [];
    for (let i = 0; i < count; i++) {
      codes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
    }
    return codes;
  }

  /**
   * Hash backup code
   */
  hashBackupCode(code) {
    return crypto.createHash('sha256').update(code).digest('hex');
  }

  /**
   * Encriptar secret
   */
  encrypt(text) {
    const cipher = crypto.createCipher(
      'aes-256-cbc',
      process.env.MFA_SECRET_KEY
    );
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  /**
   * Desencriptar secret
   */
  decrypt(encryptedText) {
    const decipher = crypto.createDecipher(
      'aes-256-cbc',
      process.env.MFA_SECRET_KEY
    );
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}

module.exports = new MFAService();
```

#### **2.2 MFA React Component**

```jsx
// frontend/src/components/auth/MFASetup.jsx
import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { mfaService } from '../../services/mfaService';
import { useAuth } from '../../hooks/useAuth';

const MFASetup = ({ onComplete }) => {
  const [step, setStep] = useState('generate'); // generate, verify, backup
  const [mfaData, setMfaData] = useState(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    generateMFASecret();
  }, []);

  const generateMFASecret = async () => {
    try {
      setLoading(true);
      const data = await mfaService.generateSecret();
      setMfaData(data);
    } catch (err) {
      setError('Error al generar código MFA: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyMFA = async () => {
    try {
      setLoading(true);
      setError('');

      const result = await mfaService.verifyAndConfirm(verificationCode);

      if (result.success) {
        setBackupCodes(result.backupCodes);
        setStep('backup');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const completeMFASetup = () => {
    onComplete?.();
  };

  const downloadBackupCodes = () => {
    const content = `TechStore - Códigos de Respaldo MFA
Usuario: ${user.email}
Fecha: ${new Date().toLocaleDateString()}

IMPORTANTE: Guarda estos códigos en un lugar seguro.
Cada código solo se puede usar una vez.

${backupCodes.join('\n')}

¡Mantén estos códigos seguros y accesibles!`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `techstore-backup-codes-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading && !mfaData) {
    return (
      <div className="text-center">
        <div
          className="spinner-border text-primary"
          role="status">
          <span className="visually-hidden">
            Generando configuración MFA...
          </span>
        </div>
        <p className="mt-2">Generando configuración MFA...</p>
      </div>
    );
  }

  return (
    <div className="mfa-setup">
      {step === 'generate' && mfaData && (
        <div className="step-generate">
          <h4 className="mb-4">🔐 Configurar Autenticación de Dos Factores</h4>

          <div className="row">
            <div className="col-md-6">
              <h5>1. Escanea el código QR</h5>
              <div className="text-center bg-white p-3 rounded border">
                <QRCodeSVG
                  value={mfaData.qrCode}
                  size={200}
                  level="H"
                />
              </div>
            </div>

            <div className="col-md-6">
              <h5>2. O ingresa manualmente:</h5>
              <div className="bg-light p-3 rounded">
                <label className="form-label fw-bold">Clave secreta:</label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control font-monospace"
                    value={mfaData.secret}
                    readOnly
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() =>
                      navigator.clipboard.writeText(mfaData.secret)
                    }>
                    📋 Copiar
                  </button>
                </div>
              </div>

              <div className="mt-3">
                <h6>Aplicaciones compatibles:</h6>
                <ul className="list-unstyled">
                  <li>📱 Google Authenticator</li>
                  <li>📱 Microsoft Authenticator</li>
                  <li>📱 Authy</li>
                  <li>📱 1Password</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h5>3. Verifica la configuración</h5>
            <div className="row align-items-end">
              <div className="col-md-8">
                <label className="form-label">
                  Ingresa el código de 6 dígitos de tu aplicación:
                </label>
                <input
                  type="text"
                  className={`form-control ${error ? 'is-invalid' : ''}`}
                  value={verificationCode}
                  onChange={e =>
                    setVerificationCode(
                      e.target.value.replace(/\D/g, '').slice(0, 6)
                    )
                  }
                  placeholder="000000"
                  maxLength="6"
                />
                {error && <div className="invalid-feedback">{error}</div>}
              </div>
              <div className="col-md-4">
                <button
                  className="btn btn-primary w-100"
                  onClick={verifyMFA}
                  disabled={loading || verificationCode.length !== 6}>
                  {loading ? 'Verificando...' : 'Verificar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 'backup' && (
        <div className="step-backup">
          <h4 className="mb-4">✅ ¡MFA Configurado Exitosamente!</h4>

          <div className="alert alert-warning">
            <h5>⚠️ Códigos de Respaldo Importantes</h5>
            <p>
              Guarda estos códigos de respaldo en un lugar seguro. Los
              necesitarás si pierdes acceso a tu dispositivo MFA.
            </p>
          </div>

          <div className="bg-light p-4 rounded">
            <h6>Tus códigos de respaldo:</h6>
            <div className="row">
              {backupCodes.map((code, index) => (
                <div
                  key={index}
                  className="col-md-6 col-lg-4 mb-2">
                  <code className="d-block p-2 bg-white rounded text-center">
                    {code}
                  </code>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 d-flex gap-2">
            <button
              className="btn btn-outline-primary"
              onClick={downloadBackupCodes}>
              📥 Descargar Códigos
            </button>
            <button
              className="btn btn-success"
              onClick={completeMFASetup}>
              ✅ Completar Configuración
            </button>
          </div>

          <div className="mt-3">
            <small className="text-muted">
              💡 <strong>Consejo:</strong> Imprime estos códigos y guárdalos en
              un lugar seguro diferente a donde guardas tu dispositivo móvil.
            </small>
          </div>
        </div>
      )}
    </div>
  );
};

export default MFASetup;
```

### **Fase 3: Security Monitoring Dashboard (25 min)**

#### **3.1 Security Monitoring Service**

```javascript
// backend/src/services/securityService.js
const SecurityEvent = require('../models/SecurityEvent');
const AuditLog = require('../models/AuditLog');
const User = require('../models/User');
const rateLimit = require('express-rate-limit');

class SecurityService {
  constructor() {
    this.alertThresholds = {
      loginAttempts: 5,
      mfaFailures: 3,
      apiCallsPerMinute: 100,
      suspiciousActivities: 10,
    };
  }

  /**
   * Registrar evento de seguridad
   */
  async logSecurityEvent(eventData) {
    try {
      const securityEvent = new SecurityEvent({
        type: eventData.type,
        severity: eventData.severity || 'medium',
        userId: eventData.userId,
        ip: eventData.ip,
        userAgent: eventData.userAgent,
        details: eventData.details,
        metadata: eventData.metadata || {},
        timestamp: new Date(),
      });

      await securityEvent.save();

      // Verificar si requiere alerta inmediata
      if (eventData.severity === 'high' || eventData.severity === 'critical') {
        await this.triggerSecurityAlert(securityEvent);
      }

      // Verificar patrones sospechosos
      await this.analyzeSuspiciousPatterns(eventData);

      return securityEvent;
    } catch (error) {
      console.error('Error logging security event:', error);
      throw error;
    }
  }

  /**
   * Registrar en audit log
   */
  async logAuditEvent(auditData) {
    try {
      const auditLog = new AuditLog({
        action: auditData.action,
        resource: auditData.resource,
        resourceId: auditData.resourceId,
        userId: auditData.userId,
        ip: auditData.ip,
        userAgent: auditData.userAgent,
        oldValues: auditData.oldValues,
        newValues: auditData.newValues,
        timestamp: new Date(),
      });

      await auditLog.save();
      return auditLog;
    } catch (error) {
      console.error('Error logging audit event:', error);
      throw error;
    }
  }

  /**
   * Obtener métricas de seguridad
   */
  async getSecurityMetrics(timeframe = '24h') {
    const timeAgo = new Date();

    switch (timeframe) {
      case '1h':
        timeAgo.setHours(timeAgo.getHours() - 1);
        break;
      case '24h':
        timeAgo.setDate(timeAgo.getDate() - 1);
        break;
      case '7d':
        timeAgo.setDate(timeAgo.getDate() - 7);
        break;
      case '30d':
        timeAgo.setDate(timeAgo.getDate() - 30);
        break;
    }

    const [
      totalEvents,
      criticalEvents,
      loginAttempts,
      mfaFailures,
      apiCalls,
      uniqueIPs,
      topThreats,
    ] = await Promise.all([
      SecurityEvent.countDocuments({ timestamp: { $gte: timeAgo } }),
      SecurityEvent.countDocuments({
        timestamp: { $gte: timeAgo },
        severity: { $in: ['high', 'critical'] },
      }),
      SecurityEvent.countDocuments({
        timestamp: { $gte: timeAgo },
        type: 'login_attempt',
      }),
      SecurityEvent.countDocuments({
        timestamp: { $gte: timeAgo },
        type: 'mfa_failure',
      }),
      SecurityEvent.countDocuments({
        timestamp: { $gte: timeAgo },
        type: 'api_call',
      }),
      SecurityEvent.distinct('ip', { timestamp: { $gte: timeAgo } }),
      SecurityEvent.aggregate([
        { $match: { timestamp: { $gte: timeAgo } } },
        { $group: { _id: '$type', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),
    ]);

    return {
      timeframe,
      totalEvents,
      criticalEvents,
      loginAttempts,
      mfaFailures,
      apiCalls,
      uniqueIPs: uniqueIPs.length,
      topThreats: topThreats.map(threat => ({
        type: threat._id,
        count: threat.count,
      })),
    };
  }

  /**
   * Obtener eventos de seguridad recientes
   */
  async getRecentSecurityEvents(limit = 50, filters = {}) {
    const query = {};

    if (filters.severity) {
      query.severity = filters.severity;
    }

    if (filters.type) {
      query.type = filters.type;
    }

    if (filters.userId) {
      query.userId = filters.userId;
    }

    const events = await SecurityEvent.find(query)
      .populate('userId', 'email name')
      .sort({ timestamp: -1 })
      .limit(limit);

    return events;
  }

  /**
   * Analizar patrones sospechosos
   */
  async analyzeSuspiciousPatterns(eventData) {
    const timeWindow = new Date(Date.now() - 5 * 60 * 1000); // 5 minutos

    // Verificar múltiples intentos de login fallidos
    if (eventData.type === 'login_failure') {
      const failedAttempts = await SecurityEvent.countDocuments({
        type: 'login_failure',
        ip: eventData.ip,
        timestamp: { $gte: timeWindow },
      });

      if (failedAttempts >= this.alertThresholds.loginAttempts) {
        await this.logSecurityEvent({
          type: 'suspicious_login_pattern',
          severity: 'high',
          ip: eventData.ip,
          details: `${failedAttempts} intentos de login fallidos en 5 minutos`,
          metadata: { failedAttempts, timeWindow: '5min' },
        });
      }
    }

    // Verificar múltiples fallos MFA
    if (eventData.type === 'mfa_failure') {
      const mfaFailures = await SecurityEvent.countDocuments({
        type: 'mfa_failure',
        userId: eventData.userId,
        timestamp: { $gte: timeWindow },
      });

      if (mfaFailures >= this.alertThresholds.mfaFailures) {
        await this.logSecurityEvent({
          type: 'suspicious_mfa_pattern',
          severity: 'high',
          userId: eventData.userId,
          ip: eventData.ip,
          details: `${mfaFailures} fallos MFA en 5 minutos`,
          metadata: { mfaFailures, timeWindow: '5min' },
        });
      }
    }
  }

  /**
   * Disparar alerta de seguridad
   */
  async triggerSecurityAlert(securityEvent) {
    // En un entorno real, aquí se enviarían emails, SMS, webhooks, etc.
    console.log(
      `🚨 ALERTA DE SEGURIDAD - ${securityEvent.severity.toUpperCase()}`
    );
    console.log(`Tipo: ${securityEvent.type}`);
    console.log(`Detalles: ${securityEvent.details}`);
    console.log(`IP: ${securityEvent.ip}`);
    console.log(`Timestamp: ${securityEvent.timestamp}`);

    // Log para tracking de alertas
    await this.logAuditEvent({
      action: 'security_alert_triggered',
      resource: 'security_system',
      resourceId: securityEvent._id,
      details: {
        eventType: securityEvent.type,
        severity: securityEvent.severity,
      },
    });
  }

  /**
   * Obtener estadísticas de seguridad por usuario
   */
  async getUserSecurityStats(userId, days = 7) {
    const timeAgo = new Date();
    timeAgo.setDate(timeAgo.getDate() - days);

    const stats = await SecurityEvent.aggregate([
      {
        $match: {
          userId: userId,
          timestamp: { $gte: timeAgo },
        },
      },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          lastOccurrence: { $max: '$timestamp' },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    return {
      userId,
      period: `${days} días`,
      events: stats,
    };
  }

  /**
   * Verificar salud del sistema de seguridad
   */
  async getSystemSecurityHealth() {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    const [recentCriticalEvents, systemErrors, activeUsers, mfaAdoption] =
      await Promise.all([
        SecurityEvent.countDocuments({
          severity: 'critical',
          timestamp: { $gte: oneHourAgo },
        }),
        SecurityEvent.countDocuments({
          type: 'system_error',
          timestamp: { $gte: oneHourAgo },
        }),
        User.countDocuments({
          lastActive: { $gte: oneHourAgo },
        }),
        User.countDocuments({ mfaEnabled: true }),
      ]);

    const totalUsers = await User.countDocuments({});
    const mfaAdoptionRate =
      totalUsers > 0 ? (mfaAdoption / totalUsers) * 100 : 0;

    let healthStatus = 'healthy';
    const issues = [];

    if (recentCriticalEvents > 0) {
      healthStatus = 'critical';
      issues.push(`${recentCriticalEvents} eventos críticos en la última hora`);
    }

    if (systemErrors > 5) {
      healthStatus = healthStatus === 'healthy' ? 'warning' : healthStatus;
      issues.push(`${systemErrors} errores de sistema en la última hora`);
    }

    if (mfaAdoptionRate < 80) {
      healthStatus = healthStatus === 'healthy' ? 'warning' : healthStatus;
      issues.push(`Adopción MFA baja: ${mfaAdoptionRate.toFixed(1)}%`);
    }

    return {
      status: healthStatus,
      timestamp: now,
      metrics: {
        criticalEvents: recentCriticalEvents,
        systemErrors,
        activeUsers,
        mfaAdoptionRate: Math.round(mfaAdoptionRate),
      },
      issues,
    };
  }
}

module.exports = new SecurityService();
```

### **Fase 4: Integración y Testing (20 min)**

#### **4.1 Security Testing Suite**

```javascript
// backend/tests/security/security.test.js
const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/User');
const SecurityEvent = require('../../src/models/SecurityEvent');

describe('Security Tests', () => {
  describe('Rate Limiting', () => {
    it('debe bloquear después de muchas solicitudes', async () => {
      const agent = request.agent(app);

      // Hacer muchas solicitudes rápidas
      const promises = Array(105)
        .fill()
        .map(() => agent.get('/api/test-endpoint'));

      const responses = await Promise.all(promises);
      const blockedResponses = responses.filter(res => res.status === 429);

      expect(blockedResponses.length).toBeGreaterThan(0);
    });
  });

  describe('Input Validation', () => {
    it('debe rechazar input malicioso XSS', async () => {
      const maliciousInput = '<script>alert("xss")</script>';

      const response = await request(app).post('/api/productos').send({
        nombre: maliciousInput,
        descripcion: 'Producto test',
        precio: 100,
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Invalid input');
    });

    it('debe rechazar SQL injection attempts', async () => {
      const sqlInjection = "'; DROP TABLE users; --";

      const response = await request(app).post('/api/auth/login').send({
        email: sqlInjection,
        password: 'password',
      });

      expect(response.status).toBe(400);
    });
  });

  describe('Security Headers', () => {
    it('debe incluir security headers importantes', async () => {
      const response = await request(app).get('/');

      expect(response.headers['x-frame-options']).toBeDefined();
      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-xss-protection']).toBeDefined();
      expect(response.headers['content-security-policy']).toBeDefined();
    });
  });

  describe('Authentication Security', () => {
    it('debe requerir MFA para acciones sensibles', async () => {
      const user = await User.create({
        email: 'test@test.com',
        password: 'password123',
        mfaEnabled: true,
      });

      const token = user.generateAuthToken();

      const response = await request(app)
        .delete('/api/account/delete')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('MFA required');
    });
  });

  describe('Security Monitoring', () => {
    it('debe loggear eventos de seguridad', async () => {
      await request(app).post('/api/auth/login').send({
        email: 'invalid@test.com',
        password: 'wrongpassword',
      });

      const securityEvent = await SecurityEvent.findOne({
        type: 'login_failure',
      });

      expect(securityEvent).toBeTruthy();
      expect(securityEvent.ip).toBeDefined();
    });
  });
});
```

#### **4.2 Security Dashboard React Component**

```jsx
// frontend/src/components/security/SecurityDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';
import { securityService } from '../../services/securityService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

const SecurityDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [recentEvents, setRecentEvents] = useState([]);
  const [systemHealth, setSystemHealth] = useState(null);
  const [timeframe, setTimeframe] = useState('24h');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();

    // Auto-refresh cada 30 segundos
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, [timeframe]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const [metricsData, eventsData, healthData] = await Promise.all([
        securityService.getMetrics(timeframe),
        securityService.getRecentEvents(20),
        securityService.getSystemHealth(),
      ]);

      setMetrics(metricsData);
      setRecentEvents(eventsData);
      setSystemHealth(healthData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getHealthStatusColor = status => {
    switch (status) {
      case 'healthy':
        return 'success';
      case 'warning':
        return 'warning';
      case 'critical':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const getSeverityBadge = severity => {
    const colors = {
      low: 'success',
      medium: 'warning',
      high: 'danger',
      critical: 'dark',
    };
    return colors[severity] || 'secondary';
  };

  const threatDistributionData = {
    labels: metrics?.topThreats?.map(threat => threat.type) || [],
    datasets: [
      {
        data: metrics?.topThreats?.map(threat => threat.count) || [],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
        ],
      },
    ],
  };

  if (loading && !metrics) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: '400px' }}>
        <div
          className="spinner-border text-primary"
          role="status">
          <span className="visually-hidden">Cargando dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="security-dashboard">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>🛡️ Dashboard de Seguridad</h2>
        <div className="d-flex gap-2">
          <select
            className="form-select"
            value={timeframe}
            onChange={e => setTimeframe(e.target.value)}
            style={{ width: 'auto' }}>
            <option value="1h">Última hora</option>
            <option value="24h">Últimas 24 horas</option>
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
          </select>
          <button
            className="btn btn-outline-primary"
            onClick={loadDashboardData}
            disabled={loading}>
            🔄 Actualizar
          </button>
        </div>
      </div>

      {/* System Health */}
      {systemHealth && (
        <div className="row mb-4">
          <div className="col-12">
            <div
              className={`alert alert-${getHealthStatusColor(
                systemHealth.status
              )} d-flex align-items-center`}>
              <div className="flex-grow-1">
                <h5 className="alert-heading mb-1">
                  Estado del Sistema:{' '}
                  <span className="text-capitalize">{systemHealth.status}</span>
                </h5>
                {systemHealth.issues.length > 0 && (
                  <ul className="mb-0">
                    {systemHealth.issues.map((issue, index) => (
                      <li key={index}>{issue}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="text-end">
                <small className="text-muted">
                  Última actualización:{' '}
                  {new Date(systemHealth.timestamp).toLocaleTimeString()}
                </small>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Cards */}
      {metrics && (
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title text-primary">
                  {metrics.totalEvents}
                </h5>
                <p className="card-text">Eventos Totales</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title text-danger">
                  {metrics.criticalEvents}
                </h5>
                <p className="card-text">Eventos Críticos</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title text-warning">
                  {metrics.loginAttempts}
                </h5>
                <p className="card-text">Intentos de Login</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title text-info">{metrics.uniqueIPs}</h5>
                <p className="card-text">IPs Únicas</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row">
        {/* Threat Distribution Chart */}
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Distribución de Amenazas</h5>
            </div>
            <div className="card-body">
              {metrics?.topThreats?.length > 0 ? (
                <Doughnut
                  data={threatDistributionData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                    },
                  }}
                />
              ) : (
                <p className="text-muted text-center">
                  No hay datos de amenazas
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Security Events */}
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Eventos Recientes</h5>
            </div>
            <div
              className="card-body"
              style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {recentEvents.length > 0 ? (
                <div className="list-group list-group-flush">
                  {recentEvents.map(event => (
                    <div
                      key={event._id}
                      className="list-group-item px-0 py-2">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center gap-2 mb-1">
                            <span
                              className={`badge bg-${getSeverityBadge(
                                event.severity
                              )}`}>
                              {event.severity}
                            </span>
                            <strong>{event.type.replace(/_/g, ' ')}</strong>
                          </div>
                          <p className="mb-1 small">{event.details}</p>
                          <small className="text-muted">
                            IP: {event.ip} |{' '}
                            {new Date(event.timestamp).toLocaleString()}
                          </small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted text-center">
                  No hay eventos recientes
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Security Metrics Summary */}
      {systemHealth && (
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  Resumen de Métricas de Seguridad
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3 text-center">
                    <h6>Usuarios Activos</h6>
                    <span className="h4 text-primary">
                      {systemHealth.metrics.activeUsers}
                    </span>
                  </div>
                  <div className="col-md-3 text-center">
                    <h6>Adopción MFA</h6>
                    <span className="h4 text-success">
                      {systemHealth.metrics.mfaAdoptionRate}%
                    </span>
                  </div>
                  <div className="col-md-3 text-center">
                    <h6>Errores Sistema</h6>
                    <span className="h4 text-warning">
                      {systemHealth.metrics.systemErrors}
                    </span>
                  </div>
                  <div className="col-md-3 text-center">
                    <h6>Eventos Críticos</h6>
                    <span className="h4 text-danger">
                      {systemHealth.metrics.criticalEvents}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityDashboard;
```

---

## 📊 Criterios de Evaluación

### **Funcionalidad (40%)**

- ✅ MFA completamente funcional (10%)
- ✅ Security headers configurados correctamente (10%)
- ✅ Input validation y sanitización (10%)
- ✅ Security monitoring dashboard (10%)

### **Seguridad (30%)**

- ✅ Vulnerabilidades identificadas y remediadas (10%)
- ✅ Rate limiting implementado (10%)
- ✅ Security event logging (10%)

### **Código y Arquitectura (20%)**

- ✅ Código limpio y bien documentado (5%)
- ✅ Arquitectura de seguridad sólida (5%)
- ✅ Testing de seguridad comprehensivo (5%)
- ✅ Manejo de errores de seguridad (5%)

### **Documentación (10%)**

- ✅ Security policy documentada (3%)
- ✅ Incident response plan (3%)
- ✅ Security checklist (4%)

---

## 🎯 Entregables

### **Técnicos:**

1. **Aplicación TechStore hardened** con todas las funcionalidades de seguridad
2. **Security Dashboard** funcional con métricas en tiempo real
3. **Test suite de seguridad** con cobertura comprehensiva
4. **Docker configuration** con security best practices

### **Documentación:**

1. **SECURITY_POLICY.md** - Políticas de seguridad de la aplicación
2. **INCIDENT_RESPONSE.md** - Plan de respuesta a incidentes
3. **VULNERABILITY_ASSESSMENT.md** - Reporte de evaluación de vulnerabilidades
4. **SECURITY_CHECKLIST.md** - Checklist de validación de seguridad

### **Presentación:**

- **Demo de 10 minutos** mostrando todas las funcionalidades de seguridad
- **Explicación del security hardening process**
- **Demostración de incident response** con un escenario simulado

---

## 🏆 Bonus Points

### **Implementaciones Avanzadas (+15%):**

- 🌟 **Threat intelligence integration** con APIs externas
- 🌟 **Automated security scanning** en CI/CD pipeline
- 🌟 **Advanced anomaly detection** con machine learning
- 🌟 **Zero-trust architecture** implementation
- 🌟 **Security compliance reports** (SOC2, ISO27001)

### **Innovación (+10%):**

- 🎯 **Custom security middleware** desarrollado desde cero
- 🎯 **Real-time threat visualization** con mapas interactivos
- 🎯 **Security chatbot** para incident reporting
- 🎯 **Blockchain-based audit logging**

---

## 📝 Notas de Implementación

### **Consideraciones de Rendimiento:**

- Rate limiting debe ser configurable por entorno
- Security logging no debe impactar performance
- Monitoring dashboard debe cargar rápidamente

### **Escalabilidad:**

- Security events deben ser indexados para búsquedas rápidas
- Dashboard debe paginar resultados largos
- Alerting system debe ser asíncrono

### **Mantenibilidad:**

- Security policies deben ser configurables via environment variables
- Threat rules deben ser actualizables sin deployment
- Security tests deben correr en CI/CD pipeline

---

¡Demuestra tu expertise en seguridad web y crea una aplicación verdaderamente robusta y segura! 🛡️🚀
