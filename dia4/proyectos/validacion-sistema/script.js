/**
 * ============================================
 * SISTEMA DE VALIDACIÓN AVANZADO - SCRIPT PRINCIPAL
 * ============================================
 *
 * Este archivo contiene la lógica principal del sistema de validación
 * con seguridad avanzada, incluyendo validación en tiempo real,
 * prevención XSS, protección CSRF y monitoreo de amenazas.
 *
 * Autor: WorldSkills Training Program
 * Fecha: 2025
 * Versión: 1.0.0
 */

// ========================================
// CONFIGURACIÓN GLOBAL
// ========================================

const CONFIG = {
  security: {
    xssProtection: true,
    csrfProtection: true,
    realTimeValidation: true,
    threatMonitoring: true,
  },
  validation: {
    debounceTime: 300,
    showSuccess: true,
    showErrors: true,
    realTimeThreshold: 2,
  },
  dashboard: {
    updateInterval: 5000,
    maxLogEntries: 100,
    chartUpdateInterval: 2000,
  },
};

// ========================================
// CLASES PRINCIPALES
// ========================================

/**
 * Clase principal del sistema de validación
 */
class ValidationSystem {
  constructor() {
    this.validator = new AdvancedValidator();
    this.security = new SecurityManager();
    this.dashboard = new DashboardManager();
    this.ui = new UIManager();

    this.metrics = {
      validValidations: 0,
      failedValidations: 0,
      securityThreats: 0,
      avgResponseTime: 0,
      responseTimeSum: 0,
      responseTimeCount: 0,
    };

    this.activityLog = [];
    this.isInitialized = false;

    this.init();
  }

  /**
   * Inicializar el sistema
   */
  init() {
    this.setupEventListeners();
    this.initializeSecurity();
    this.initializeDashboard();
    this.startMetricsCollection();

    this.isInitialized = true;
    this.log('Sistema de validación inicializado', 'success');
  }

  /**
   * Configurar event listeners
   */
  setupEventListeners() {
    // Formularios
    document.addEventListener('DOMContentLoaded', () => {
      this.initializeForms();
      this.initializePasswordToggle();
      this.initializeCharacterCounter();
      this.setupSecurityForm();
    });

    // Validación en tiempo real
    document.addEventListener('input', e => {
      if (CONFIG.security.realTimeValidation) {
        this.handleRealTimeValidation(e);
      }
    });

    // Envío de formularios
    document.addEventListener('submit', e => {
      this.handleFormSubmit(e);
    });

    // Tabs
    document.querySelectorAll('[data-bs-toggle="tab"]').forEach(tab => {
      tab.addEventListener('shown.bs.tab', e => {
        this.handleTabChange(e);
      });
    });
  }

  /**
   * Inicializar formularios
   */
  initializeForms() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      this.security.protectForm(form);
      this.addFormValidation(form);
    });
  }

  /**
   * Agregar validación a formulario
   */
  addFormValidation(form) {
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      this.validator.addField(input);
    });
  }

  /**
   * Manejar validación en tiempo real
   */
  handleRealTimeValidation(e) {
    const input = e.target;
    if (!input.matches('input, select, textarea')) return;

    const startTime = performance.now();

    // Debounce
    clearTimeout(input.validationTimeout);
    input.validationTimeout = setTimeout(() => {
      const validation = this.validator.validateField(input);
      const endTime = performance.now();

      this.updateMetrics(validation, endTime - startTime);
      this.ui.showValidation(input, validation);

      if (validation.threats.length > 0) {
        this.security.handleThreat(validation.threats, input);
      }
    }, CONFIG.validation.debounceTime);
  }

  /**
   * Manejar envío de formulario
   */
  handleFormSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const startTime = performance.now();

    // Validar CSRF
    if (!this.security.validateCSRF(form)) {
      this.ui.showAlert('Error de seguridad CSRF', 'danger');
      return;
    }

    // Validar formulario completo
    const validation = this.validator.validateForm(form);
    const endTime = performance.now();

    this.updateMetrics(validation, endTime - startTime);

    if (validation.isValid) {
      this.handleSuccessfulSubmit(form, validation);
    } else {
      this.handleFailedSubmit(form, validation);
    }
  }

  /**
   * Manejar envío exitoso
   */
  handleSuccessfulSubmit(form, validation) {
    this.ui.showAlert('Formulario enviado exitosamente', 'success');
    this.log(`Formulario ${form.id} enviado exitosamente`, 'success');

    // Simular envío al servidor
    setTimeout(() => {
      form.reset();
      this.clearFormValidation(form);
    }, 1000);
  }

  /**
   * Manejar envío fallido
   */
  handleFailedSubmit(form, validation) {
    this.ui.showAlert(
      'Por favor corrija los errores en el formulario',
      'danger'
    );
    this.log(`Validación fallida en formulario ${form.id}`, 'error');

    // Mostrar errores
    Object.keys(validation.errors).forEach(fieldName => {
      const field = form.querySelector(`[name="${fieldName}"]`);
      if (field) {
        this.ui.showValidation(field, {
          isValid: false,
          errors: validation.errors[fieldName],
        });
      }
    });
  }

  /**
   * Actualizar métricas
   */
  updateMetrics(validation, responseTime) {
    if (validation.isValid) {
      this.metrics.validValidations++;
    } else {
      this.metrics.failedValidations++;
    }

    if (validation.threats && validation.threats.length > 0) {
      this.metrics.securityThreats += validation.threats.length;
    }

    this.metrics.responseTimeSum += responseTime;
    this.metrics.responseTimeCount++;
    this.metrics.avgResponseTime =
      this.metrics.responseTimeSum / this.metrics.responseTimeCount;

    this.dashboard.updateMetrics(this.metrics);
  }

  /**
   * Inicializar seguridad
   */
  initializeSecurity() {
    this.security.init();
  }

  /**
   * Inicializar dashboard
   */
  initializeDashboard() {
    this.dashboard.init();
    this.dashboard.updateMetrics(this.metrics);
  }

  /**
   * Inicializar toggle de contraseña
   */
  initializePasswordToggle() {
    const toggleButtons = document.querySelectorAll('#togglePassword');
    toggleButtons.forEach(button => {
      button.addEventListener('click', e => {
        const input = e.target.closest('.input-group').querySelector('input');
        const icon = e.target.closest('button').querySelector('i');

        if (input.type === 'password') {
          input.type = 'text';
          icon.classList.remove('fa-eye');
          icon.classList.add('fa-eye-slash');
        } else {
          input.type = 'password';
          icon.classList.remove('fa-eye-slash');
          icon.classList.add('fa-eye');
        }
      });
    });
  }

  /**
   * Inicializar contador de caracteres
   */
  initializeCharacterCounter() {
    const textareas = document.querySelectorAll('textarea[maxlength]');
    textareas.forEach(textarea => {
      const counter = document.querySelector(
        `#${textarea.id.replace(textarea.id.split('').pop(), '')}Count`
      );
      if (counter) {
        textarea.addEventListener('input', e => {
          counter.textContent = e.target.value.length;
        });
      }
    });
  }

  /**
   * Configurar formulario de seguridad
   */
  setupSecurityForm() {
    const securityForm = document.getElementById('securityForm');
    if (securityForm) {
      securityForm.addEventListener('submit', e => {
        e.preventDefault();
        this.updateSecuritySettings(new FormData(securityForm));
      });
    }
  }

  /**
   * Actualizar configuración de seguridad
   */
  updateSecuritySettings(formData) {
    CONFIG.security.xssProtection = formData.has('enableXSSProtection');
    CONFIG.security.csrfProtection = formData.has('enableCSRFProtection');
    CONFIG.security.realTimeValidation = formData.has(
      'enableRealTimeValidation'
    );
    CONFIG.security.threatMonitoring = formData.has('enableThreatMonitoring');

    this.ui.showAlert('Configuración de seguridad actualizada', 'success');
    this.log('Configuración de seguridad actualizada', 'info');
  }

  /**
   * Limpiar validación de formulario
   */
  clearFormValidation(form) {
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.classList.remove('is-valid', 'is-invalid');
      const feedback = input.parentNode.querySelector(
        '.invalid-feedback, .valid-feedback'
      );
      if (feedback) {
        feedback.textContent = '';
      }
    });
  }

  /**
   * Manejar cambio de tab
   */
  handleTabChange(e) {
    const tabId = e.target.getAttribute('data-bs-target');
    if (tabId === '#dashboard') {
      this.dashboard.refresh();
    }
  }

  /**
   * Iniciar recolección de métricas
   */
  startMetricsCollection() {
    setInterval(() => {
      this.dashboard.updateCharts();
    }, CONFIG.dashboard.chartUpdateInterval);
  }

  /**
   * Log de actividad
   */
  log(message, type = 'info') {
    const logEntry = {
      timestamp: new Date().toISOString(),
      message: message,
      type: type,
      id: Date.now(),
    };

    this.activityLog.unshift(logEntry);

    if (this.activityLog.length > CONFIG.dashboard.maxLogEntries) {
      this.activityLog.pop();
    }

    this.dashboard.updateActivityLog(this.activityLog);
  }
}

/**
 * Validador avanzado
 */
class AdvancedValidator {
  constructor() {
    this.fields = new Map();
    this.patterns = {
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      username: /^[a-zA-Z0-9_]{3,20}$/,
      password:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      phone: /^\+?[\d\s\-\(\)]{7,15}$/,
      url: /^https?:\/\/([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
      alphanumeric: /^[a-zA-Z0-9]+$/,
      numeric: /^\d+$/,
      alpha: /^[a-zA-Z]+$/,
    };

    this.threatPatterns = {
      xss: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      sql: /(\b(ALTER|CREATE|DELETE|DROP|EXEC(UTE)?|INSERT|SELECT|UNION|UPDATE)\b)|('|(\\\\)?;)|(--|\*\/)/gi,
      javascript: /javascript:/gi,
      vbscript: /vbscript:/gi,
      onEvents: /on\w+\s*=/gi,
    };
  }

  /**
   * Agregar campo para validación
   */
  addField(field) {
    const config = this.getFieldConfig(field);
    this.fields.set(field.name, config);
  }

  /**
   * Obtener configuración del campo
   */
  getFieldConfig(field) {
    return {
      element: field,
      type: field.getAttribute('data-validation') || this.inferType(field),
      required: field.hasAttribute('required'),
      minLength: field.getAttribute('minlength'),
      maxLength: field.getAttribute('maxlength'),
      pattern: field.getAttribute('pattern'),
      customValidation: field.getAttribute('data-custom-validation'),
    };
  }

  /**
   * Inferir tipo de campo
   */
  inferType(field) {
    const type = field.type || field.tagName.toLowerCase();
    const name = field.name.toLowerCase();

    if (type === 'email' || name.includes('email')) return 'email';
    if (type === 'password' || name.includes('password')) return 'password';
    if (type === 'tel' || name.includes('phone')) return 'phone';
    if (type === 'url' || name.includes('url')) return 'url';
    if (name.includes('username')) return 'username';

    return 'text';
  }

  /**
   * Validar campo individual
   */
  validateField(field) {
    const config = this.fields.get(field.name);
    if (!config) return { isValid: true, errors: [], threats: [] };

    const value = field.value;
    const validation = {
      isValid: true,
      errors: [],
      threats: [],
      warnings: [],
    };

    // Validar requerido
    if (config.required && !value.trim()) {
      validation.isValid = false;
      validation.errors.push('Este campo es requerido');
    }

    // Validar longitud
    if (value.length > 0) {
      if (config.minLength && value.length < config.minLength) {
        validation.isValid = false;
        validation.errors.push(`Mínimo ${config.minLength} caracteres`);
      }

      if (config.maxLength && value.length > config.maxLength) {
        validation.isValid = false;
        validation.errors.push(`Máximo ${config.maxLength} caracteres`);
      }
    }

    // Validar patrón
    if (value.length > 0 && config.type && this.patterns[config.type]) {
      if (!this.patterns[config.type].test(value)) {
        validation.isValid = false;
        validation.errors.push(this.getPatternError(config.type));
      }
    }

    // Validar amenazas de seguridad
    const threats = this.detectThreats(value);
    if (threats.length > 0) {
      validation.threats = threats;
      validation.isValid = false;
      validation.errors.push('Contenido no seguro detectado');
    }

    // Validación personalizada
    if (config.customValidation) {
      const customResult = this.runCustomValidation(
        value,
        config.customValidation
      );
      if (!customResult.isValid) {
        validation.isValid = false;
        validation.errors.push(...customResult.errors);
      }
    }

    // Validación especial para contraseñas
    if (config.type === 'password') {
      const strength = this.checkPasswordStrength(value);
      validation.strength = strength;
      if (strength.score < 3) {
        validation.warnings.push('Contraseña débil');
      }
    }

    // Validación de confirmación de contraseña
    if (field.name === 'confirmPassword') {
      const passwordField = document.querySelector('[name="password"]');
      if (passwordField && value !== passwordField.value) {
        validation.isValid = false;
        validation.errors.push('Las contraseñas no coinciden');
      }
    }

    return validation;
  }

  /**
   * Validar formulario completo
   */
  validateForm(form) {
    const validation = {
      isValid: true,
      errors: {},
      threats: [],
      fieldResults: {},
    };

    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      const fieldValidation = this.validateField(input);
      validation.fieldResults[input.name] = fieldValidation;

      if (!fieldValidation.isValid) {
        validation.isValid = false;
        validation.errors[input.name] = fieldValidation.errors;
      }

      if (fieldValidation.threats.length > 0) {
        validation.threats.push(...fieldValidation.threats);
      }
    });

    return validation;
  }

  /**
   * Detectar amenazas de seguridad
   */
  detectThreats(value) {
    const threats = [];

    Object.keys(this.threatPatterns).forEach(threatType => {
      if (this.threatPatterns[threatType].test(value)) {
        threats.push({
          type: threatType,
          description: this.getThreatDescription(threatType),
          severity: this.getThreatSeverity(threatType),
        });
      }
    });

    return threats;
  }

  /**
   * Obtener descripción de amenaza
   */
  getThreatDescription(threatType) {
    const descriptions = {
      xss: 'Posible ataque XSS detectado',
      sql: 'Posible inyección SQL detectada',
      javascript: 'URL JavaScript detectada',
      vbscript: 'Código VBScript detectado',
      onEvents: 'Eventos JavaScript inline detectados',
    };

    return descriptions[threatType] || 'Amenaza desconocida';
  }

  /**
   * Obtener severidad de amenaza
   */
  getThreatSeverity(threatType) {
    const severities = {
      xss: 'high',
      sql: 'critical',
      javascript: 'high',
      vbscript: 'high',
      onEvents: 'medium',
    };

    return severities[threatType] || 'low';
  }

  /**
   * Verificar fortaleza de contraseña
   */
  checkPasswordStrength(password) {
    const strength = {
      score: 0,
      feedback: [],
    };

    if (password.length >= 8) strength.score++;
    else strength.feedback.push('Use al menos 8 caracteres');

    if (/[a-z]/.test(password)) strength.score++;
    else strength.feedback.push('Incluya letras minúsculas');

    if (/[A-Z]/.test(password)) strength.score++;
    else strength.feedback.push('Incluya letras mayúsculas');

    if (/\d/.test(password)) strength.score++;
    else strength.feedback.push('Incluya números');

    if (/[@$!%*?&]/.test(password)) strength.score++;
    else strength.feedback.push('Incluya caracteres especiales');

    return strength;
  }

  /**
   * Obtener error de patrón
   */
  getPatternError(type) {
    const errors = {
      email: 'Formato de email inválido',
      username: 'Usuario debe tener 3-20 caracteres alfanuméricos',
      password:
        'Contraseña debe tener al menos 8 caracteres con mayúsculas, minúsculas, números y símbolos',
      phone: 'Formato de teléfono inválido',
      url: 'Formato de URL inválido',
    };

    return errors[type] || 'Formato inválido';
  }

  /**
   * Ejecutar validación personalizada
   */
  runCustomValidation(value, validationType) {
    // Implementar validaciones personalizadas aquí
    return { isValid: true, errors: [] };
  }
}

/**
 * Gestor de seguridad
 */
class SecurityManager {
  constructor() {
    this.csrfTokens = new Map();
    this.threats = [];
    this.xssProtector = new XSSProtector();
  }

  /**
   * Inicializar seguridad
   */
  init() {
    this.generateCSRFTokens();
    this.setupCSPViolationListener();
  }

  /**
   * Generar tokens CSRF
   */
  generateCSRFTokens() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      const token = this.generateCSRFToken();
      this.addCSRFTokenToForm(form, token);
    });
  }

  /**
   * Generar token CSRF
   */
  generateCSRFToken() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join(
      ''
    );
  }

  /**
   * Agregar token CSRF a formulario
   */
  addCSRFTokenToForm(form, token) {
    const tokenInput = document.createElement('input');
    tokenInput.type = 'hidden';
    tokenInput.name = '_csrf_token';
    tokenInput.value = token;
    form.appendChild(tokenInput);

    this.csrfTokens.set(form.id, token);
  }

  /**
   * Validar token CSRF
   */
  validateCSRF(form) {
    if (!CONFIG.security.csrfProtection) return true;

    const tokenInput = form.querySelector('[name="_csrf_token"]');
    if (!tokenInput) return false;

    const expectedToken = this.csrfTokens.get(form.id);
    return tokenInput.value === expectedToken;
  }

  /**
   * Proteger formulario
   */
  protectForm(form) {
    if (CONFIG.security.xssProtection) {
      this.addXSSProtection(form);
    }
  }

  /**
   * Agregar protección XSS
   */
  addXSSProtection(form) {
    const inputs = form.querySelectorAll('input[type="text"], textarea');
    inputs.forEach(input => {
      input.addEventListener('input', e => {
        if (CONFIG.security.xssProtection) {
          e.target.value = this.xssProtector.sanitize(e.target.value);
        }
      });
    });
  }

  /**
   * Manejar amenaza
   */
  handleThreat(threats, element) {
    if (!CONFIG.security.threatMonitoring) return;

    threats.forEach(threat => {
      const threatEntry = {
        ...threat,
        timestamp: new Date().toISOString(),
        element: element.name,
        value: element.value.substring(0, 50) + '...',
      };

      this.threats.unshift(threatEntry);
      this.logThreat(threatEntry);
    });

    // Mantener solo las últimas 50 amenazas
    if (this.threats.length > 50) {
      this.threats = this.threats.slice(0, 50);
    }
  }

  /**
   * Log de amenaza
   */
  logThreat(threat) {
    console.warn('🚨 Amenaza de seguridad detectada:', threat);

    // Actualizar UI de amenazas
    this.updateThreatUI();
  }

  /**
   * Actualizar UI de amenazas
   */
  updateThreatUI() {
    const threatHistory = document.getElementById('threatHistory');
    if (!threatHistory) return;

    threatHistory.innerHTML = '';

    this.threats.slice(0, 10).forEach(threat => {
      const threatElement = document.createElement('div');
      threatElement.className = `threat-item ${threat.severity}`;
      threatElement.innerHTML = `
                <h6>${threat.description}</h6>
                <p>Elemento: ${threat.element}</p>
                <p>Valor: ${threat.value}</p>
                <div class="time">${new Date(
                  threat.timestamp
                ).toLocaleString()}</div>
            `;
      threatHistory.appendChild(threatElement);
    });
  }

  /**
   * Configurar listener de violaciones CSP
   */
  setupCSPViolationListener() {
    document.addEventListener('securitypolicyviolation', e => {
      const violation = {
        type: 'csp',
        description: 'Violación de Content Security Policy',
        severity: 'high',
        directive: e.violatedDirective,
        blockedURI: e.blockedURI,
        timestamp: new Date().toISOString(),
      };

      this.threats.unshift(violation);
      this.logThreat(violation);
    });
  }
}

/**
 * Protector XSS simple
 */
class XSSProtector {
  constructor() {
    this.dangerousPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
    ];
  }

  /**
   * Sanitizar entrada
   */
  sanitize(input) {
    if (!input) return input;

    let sanitized = input;

    this.dangerousPatterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '');
    });

    return sanitized;
  }
}

/**
 * Gestor de dashboard
 */
class DashboardManager {
  constructor() {
    this.charts = {};
    this.chartData = {
      validation: {
        labels: [],
        valid: [],
        invalid: [],
      },
      threats: {
        labels: ['XSS', 'SQL', 'JavaScript', 'VBScript', 'Otros'],
        data: [0, 0, 0, 0, 0],
      },
    };
  }

  /**
   * Inicializar dashboard
   */
  init() {
    this.initializeCharts();
    this.startDataCollection();
  }

  /**
   * Inicializar gráficos
   */
  initializeCharts() {
    this.initValidationChart();
    this.initThreatChart();
  }

  /**
   * Inicializar gráfico de validaciones
   */
  initValidationChart() {
    const ctx = document.getElementById('validationChart');
    if (!ctx) return;

    this.charts.validation = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.chartData.validation.labels,
        datasets: [
          {
            label: 'Válidas',
            data: this.chartData.validation.valid,
            borderColor: '#28a745',
            backgroundColor: 'rgba(40, 167, 69, 0.1)',
            tension: 0.4,
          },
          {
            label: 'Inválidas',
            data: this.chartData.validation.invalid,
            borderColor: '#dc3545',
            backgroundColor: 'rgba(220, 53, 69, 0.1)',
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  /**
   * Inicializar gráfico de amenazas
   */
  initThreatChart() {
    const ctx = document.getElementById('threatChart');
    if (!ctx) return;

    this.charts.threats = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.chartData.threats.labels,
        datasets: [
          {
            data: this.chartData.threats.data,
            backgroundColor: [
              '#dc3545',
              '#ffc107',
              '#fd7e14',
              '#6f42c1',
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

  /**
   * Actualizar métricas
   */
  updateMetrics(metrics) {
    // Actualizar cards de métricas
    this.updateMetricCard('validValidations', metrics.validValidations);
    this.updateMetricCard('failedValidations', metrics.failedValidations);
    this.updateMetricCard('securityThreats', metrics.securityThreats);
    this.updateMetricCard(
      'avgResponseTime',
      Math.round(metrics.avgResponseTime) + 'ms'
    );
  }

  /**
   * Actualizar card de métrica
   */
  updateMetricCard(id, value) {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = value;
    }
  }

  /**
   * Actualizar gráficos
   */
  updateCharts() {
    this.updateValidationChart();
    this.updateThreatChart();
  }

  /**
   * Actualizar gráfico de validaciones
   */
  updateValidationChart() {
    const now = new Date().toLocaleTimeString();

    this.chartData.validation.labels.push(now);
    this.chartData.validation.valid.push(Math.floor(Math.random() * 10));
    this.chartData.validation.invalid.push(Math.floor(Math.random() * 5));

    // Mantener solo los últimos 10 puntos
    if (this.chartData.validation.labels.length > 10) {
      this.chartData.validation.labels.shift();
      this.chartData.validation.valid.shift();
      this.chartData.validation.invalid.shift();
    }

    if (this.charts.validation) {
      this.charts.validation.update();
    }
  }

  /**
   * Actualizar gráfico de amenazas
   */
  updateThreatChart() {
    // Simular datos de amenazas
    this.chartData.threats.data = [
      Math.floor(Math.random() * 5),
      Math.floor(Math.random() * 3),
      Math.floor(Math.random() * 2),
      Math.floor(Math.random() * 2),
      Math.floor(Math.random() * 3),
    ];

    if (this.charts.threats) {
      this.charts.threats.update();
    }
  }

  /**
   * Actualizar log de actividad
   */
  updateActivityLog(activityLog) {
    const logTable = document.getElementById('activityLog');
    if (!logTable) return;

    logTable.innerHTML = '';

    activityLog.slice(0, 10).forEach(entry => {
      const row = document.createElement('tr');
      row.innerHTML = `
                <td>${new Date(entry.timestamp).toLocaleString()}</td>
                <td><span class="badge bg-${this.getTypeColor(entry.type)}">${
        entry.type
      }</span></td>
                <td>${entry.message}</td>
                <td>${this.getStatusIcon(entry.type)}</td>
            `;
      logTable.appendChild(row);
    });
  }

  /**
   * Obtener color de tipo
   */
  getTypeColor(type) {
    const colors = {
      success: 'success',
      error: 'danger',
      warning: 'warning',
      info: 'info',
    };
    return colors[type] || 'secondary';
  }

  /**
   * Obtener icono de estado
   */
  getStatusIcon(type) {
    const icons = {
      success: '<i class="fas fa-check text-success"></i>',
      error: '<i class="fas fa-times text-danger"></i>',
      warning: '<i class="fas fa-exclamation-triangle text-warning"></i>',
      info: '<i class="fas fa-info-circle text-info"></i>',
    };
    return icons[type] || '<i class="fas fa-circle text-secondary"></i>';
  }

  /**
   * Iniciar recolección de datos
   */
  startDataCollection() {
    setInterval(() => {
      // Simular recolección de datos en tiempo real
      this.collectMetrics();
    }, CONFIG.dashboard.updateInterval);
  }

  /**
   * Recolectar métricas
   */
  collectMetrics() {
    // Implementar recolección de métricas reales
  }

  /**
   * Refrescar dashboard
   */
  refresh() {
    this.updateCharts();
  }
}

/**
 * Gestor de UI
 */
class UIManager {
  constructor() {
    this.alertContainer = document.getElementById('alertContainer');
  }

  /**
   * Mostrar alerta
   */
  showAlert(message, type = 'info', duration = 5000) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

    this.alertContainer.appendChild(alert);

    // Auto-dismiss
    setTimeout(() => {
      alert.remove();
    }, duration);
  }

  /**
   * Mostrar validación
   */
  showValidation(field, validation) {
    // Limpiar estado anterior
    field.classList.remove('is-valid', 'is-invalid');

    // Obtener o crear feedback element
    let feedback = field.parentNode.querySelector('.invalid-feedback');
    if (!feedback) {
      feedback = document.createElement('div');
      feedback.className = 'invalid-feedback';
      field.parentNode.appendChild(feedback);
    }

    if (validation.isValid) {
      field.classList.add('is-valid');
      feedback.textContent = '';
    } else {
      field.classList.add('is-invalid');
      feedback.textContent = validation.errors.join(', ');
    }

    // Actualizar fortaleza de contraseña
    if (validation.strength) {
      this.updatePasswordStrength(field, validation.strength);
    }
  }

  /**
   * Actualizar fortaleza de contraseña
   */
  updatePasswordStrength(field, strength) {
    const container =
      field.parentNode.parentNode.querySelector('.password-strength');
    if (!container) return;

    const progressBar = container.querySelector('.progress-bar');
    const text = container.querySelector('.form-text');

    const strengthClasses = ['weak', 'fair', 'good', 'strong'];
    const strengthTexts = ['Muy débil', 'Débil', 'Buena', 'Fuerte'];

    // Limpiar clases anteriores
    container.classList.remove(...strengthClasses);

    if (strength.score > 0) {
      const strengthClass = strengthClasses[Math.min(strength.score - 1, 3)];
      container.classList.add(strengthClass);

      progressBar.style.width = `${(strength.score / 5) * 100}%`;
      text.textContent = `Fortaleza: ${
        strengthTexts[Math.min(strength.score - 1, 3)]
      }`;
    } else {
      progressBar.style.width = '0%';
      text.textContent = 'Fortaleza de la contraseña';
    }
  }
}

// ========================================
// INICIALIZACIÓN
// ========================================

// Inicializar sistema cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.validationSystem = new ValidationSystem();
});

// Exportar para uso global
window.ValidationSystem = ValidationSystem;
window.CONFIG = CONFIG;
