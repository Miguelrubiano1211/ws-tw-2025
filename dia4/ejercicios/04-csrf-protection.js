/**
 * 🛡️ DÍA 4 - EJERCICIO 4: PROTECCIÓN CSRF (Cross-Site Request Forgery)
 *
 * Objetivos:
 * - Comprender ataques CSRF
 * - Implementar tokens CSRF
 * - Validar origen de peticiones
 * - Proteger formularios críticos
 * - Implementar SameSite cookies
 *
 * Competencias WorldSkills:
 * - Seguridad web avanzada
 * - Autenticación y autorización
 * - Protección de sesiones
 * - Validación de peticiones
 */

// ========================================
// 📚 TEORÍA: ATAQUES CSRF
// ========================================

/**
 * CSRF (Cross-Site Request Forgery):
 *
 * CÓMO FUNCIONA:
 * 1. Usuario autenticado visita sitio malicioso
 * 2. Sitio malicioso envía petición al sitio legítimo
 * 3. Browser incluye cookies automáticamente
 * 4. Servidor ejecuta acción no autorizada
 *
 * TIPOS DE ATAQUES:
 * - GET-based: Enlaces maliciosos
 * - POST-based: Formularios ocultos
 * - AJAX-based: Peticiones JavaScript
 *
 * MÉTODOS DE PREVENCIÓN:
 * - Tokens CSRF
 * - Validación de referrer
 * - SameSite cookies
 * - Verificación de origen
 * - Double Submit Cookie
 */

// ========================================
// 🔐 GENERADOR DE TOKENS CSRF
// ========================================

class CSRFTokenGenerator {
  constructor() {
    this.secretKey = this.generateSecretKey();
    this.tokenExpiry = 3600000; // 1 hora en millisegundos
    this.activeTokens = new Map();
  }

  // Generar clave secreta
  generateSecretKey() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join(
      ''
    );
  }

  // Generar token CSRF
  generateToken(sessionId = null) {
    const timestamp = Date.now();
    const randomBytes = new Uint8Array(16);
    crypto.getRandomValues(randomBytes);

    const tokenData = {
      sessionId: sessionId || this.generateSessionId(),
      timestamp: timestamp,
      random: Array.from(randomBytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join(''),
    };

    const token = this.encodeToken(tokenData);

    // Almacenar token activo
    this.activeTokens.set(token, {
      ...tokenData,
      expiresAt: timestamp + this.tokenExpiry,
    });

    return token;
  }

  // Codificar token
  encodeToken(tokenData) {
    const payload = JSON.stringify(tokenData);
    const encodedPayload = btoa(payload);
    const signature = this.generateSignature(encodedPayload);

    return `${encodedPayload}.${signature}`;
  }

  // Generar firma
  generateSignature(payload) {
    const data = payload + this.secretKey;
    return btoa(data).substring(0, 32);
  }

  // Validar token CSRF
  validateToken(token, sessionId = null) {
    if (!token || typeof token !== 'string') {
      return { valid: false, error: 'Token inválido' };
    }

    const parts = token.split('.');
    if (parts.length !== 2) {
      return { valid: false, error: 'Formato de token inválido' };
    }

    const [encodedPayload, signature] = parts;

    // Verificar firma
    const expectedSignature = this.generateSignature(encodedPayload);
    if (signature !== expectedSignature) {
      return { valid: false, error: 'Firma de token inválida' };
    }

    // Decodificar payload
    let tokenData;
    try {
      const payload = atob(encodedPayload);
      tokenData = JSON.parse(payload);
    } catch (error) {
      return { valid: false, error: 'Token corrupto' };
    }

    // Verificar expiración
    if (Date.now() > tokenData.timestamp + this.tokenExpiry) {
      this.activeTokens.delete(token);
      return { valid: false, error: 'Token expirado' };
    }

    // Verificar sesión
    if (sessionId && tokenData.sessionId !== sessionId) {
      return { valid: false, error: 'Sesión inválida' };
    }

    // Verificar token activo
    if (!this.activeTokens.has(token)) {
      return { valid: false, error: 'Token no encontrado' };
    }

    return { valid: true, tokenData: tokenData };
  }

  // Invalidar token
  invalidateToken(token) {
    return this.activeTokens.delete(token);
  }

  // Limpiar tokens expirados
  cleanupExpiredTokens() {
    const now = Date.now();
    const expiredTokens = [];

    for (const [token, data] of this.activeTokens) {
      if (now > data.expiresAt) {
        expiredTokens.push(token);
      }
    }

    expiredTokens.forEach(token => this.activeTokens.delete(token));
    return expiredTokens.length;
  }

  // Generar ID de sesión
  generateSessionId() {
    return (
      'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    );
  }

  // Obtener estadísticas
  getStats() {
    return {
      activeTokens: this.activeTokens.size,
      secretKeyLength: this.secretKey.length,
      tokenExpiry: this.tokenExpiry,
    };
  }
}

// ========================================
// 🛡️ PROTECTOR DE FORMULARIOS
// ========================================

class CSRFFormProtector {
  constructor() {
    this.tokenGenerator = new CSRFTokenGenerator();
    this.protectedForms = new Set();
    this.config = {
      tokenFieldName: '_csrf_token',
      autoProtect: true,
      validateOnSubmit: true,
      showErrors: true,
    };
  }

  // Proteger formulario
  protectForm(form, options = {}) {
    if (!form || !(form instanceof HTMLFormElement)) {
      throw new Error('Formulario inválido');
    }

    const config = { ...this.config, ...options };

    // Generar token
    const token = this.tokenGenerator.generateToken();

    // Crear campo oculto
    const tokenField = this.createTokenField(token, config.tokenFieldName);
    form.appendChild(tokenField);

    // Agregar validación en submit
    if (config.validateOnSubmit) {
      this.addSubmitValidation(form, config);
    }

    // Marcar formulario como protegido
    this.protectedForms.add(form);
    form.dataset.csrfProtected = 'true';
    form.dataset.csrfToken = token;

    return token;
  }

  // Crear campo de token
  createTokenField(token, fieldName) {
    const field = document.createElement('input');
    field.type = 'hidden';
    field.name = fieldName;
    field.value = token;
    field.classList.add('csrf-token');

    return field;
  }

  // Agregar validación en submit
  addSubmitValidation(form, config) {
    form.addEventListener('submit', e => {
      if (!this.validateFormSubmission(form, config)) {
        e.preventDefault();

        if (config.showErrors) {
          this.showError(form, 'Token CSRF inválido o expirado');
        }
      }
    });
  }

  // Validar envío de formulario
  validateFormSubmission(form, config) {
    const tokenField = form.querySelector(
      `input[name="${config.tokenFieldName}"]`
    );

    if (!tokenField) {
      return false;
    }

    const validation = this.tokenGenerator.validateToken(tokenField.value);

    if (!validation.valid) {
      console.warn('CSRF validation failed:', validation.error);
      return false;
    }

    // Invalidar token después de uso
    this.tokenGenerator.invalidateToken(tokenField.value);

    return true;
  }

  // Mostrar error
  showError(form, message) {
    // Remover error anterior
    const existingError = form.querySelector('.csrf-error');
    if (existingError) {
      existingError.remove();
    }

    // Crear nuevo error
    const errorDiv = document.createElement('div');
    errorDiv.className = 'csrf-error alert alert-danger';
    errorDiv.textContent = message;
    errorDiv.style.marginBottom = '15px';

    form.insertBefore(errorDiv, form.firstChild);

    // Remover después de 5 segundos
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.remove();
      }
    }, 5000);
  }

  // Proteger todos los formularios
  protectAllForms() {
    const forms = document.querySelectorAll('form');
    let protectedCount = 0;

    forms.forEach(form => {
      if (!form.dataset.csrfProtected) {
        this.protectForm(form);
        protectedCount++;
      }
    });

    return protectedCount;
  }

  // Renovar token de formulario
  renewFormToken(form) {
    if (!this.protectedForms.has(form)) {
      throw new Error('Formulario no está protegido');
    }

    const tokenField = form.querySelector('.csrf-token');
    if (tokenField) {
      const newToken = this.tokenGenerator.generateToken();
      tokenField.value = newToken;
      form.dataset.csrfToken = newToken;
    }
  }

  // Obtener token de formulario
  getFormToken(form) {
    return form.dataset.csrfToken;
  }
}

// ========================================
// 🔍 VALIDADOR DE ORIGEN
// ========================================

class OriginValidator {
  constructor() {
    this.allowedOrigins = new Set();
    this.allowedReferers = new Set();
    this.strictMode = false;
  }

  // Agregar origen permitido
  addAllowedOrigin(origin) {
    this.allowedOrigins.add(origin);
  }

  // Agregar referer permitido
  addAllowedReferer(referer) {
    this.allowedReferers.add(referer);
  }

  // Validar origen de petición
  validateOrigin(request) {
    const origin = this.getOrigin(request);
    const referer = this.getReferer(request);

    const validation = {
      valid: false,
      origin: origin,
      referer: referer,
      errors: [],
    };

    // Validar origen
    if (origin) {
      if (this.allowedOrigins.has(origin)) {
        validation.valid = true;
      } else {
        validation.errors.push('Origen no permitido');
      }
    } else if (this.strictMode) {
      validation.errors.push('Origen requerido');
    }

    // Validar referer
    if (referer) {
      if (!this.isAllowedReferer(referer)) {
        validation.errors.push('Referer no permitido');
        validation.valid = false;
      }
    } else if (this.strictMode) {
      validation.errors.push('Referer requerido');
      validation.valid = false;
    }

    return validation;
  }

  // Obtener origen
  getOrigin(request) {
    if (request.headers && request.headers.origin) {
      return request.headers.origin;
    }

    if (typeof window !== 'undefined' && window.location) {
      return window.location.origin;
    }

    return null;
  }

  // Obtener referer
  getReferer(request) {
    if (request.headers && request.headers.referer) {
      return request.headers.referer;
    }

    if (typeof document !== 'undefined') {
      return document.referrer;
    }

    return null;
  }

  // Verificar referer permitido
  isAllowedReferer(referer) {
    return Array.from(this.allowedReferers).some(allowed =>
      referer.startsWith(allowed)
    );
  }

  // Configurar modo estricto
  setStrictMode(enabled) {
    this.strictMode = enabled;
  }
}

// ========================================
// 🍪 GESTOR DE COOKIES SEGURAS
// ========================================

class SecureCookieManager {
  constructor() {
    this.defaultOptions = {
      secure: true,
      httpOnly: true,
      sameSite: 'Strict',
      maxAge: 3600, // 1 hora
    };
  }

  // Establecer cookie segura
  setSecureCookie(name, value, options = {}) {
    const finalOptions = { ...this.defaultOptions, ...options };

    let cookieString = `${name}=${value}`;

    if (finalOptions.maxAge) {
      cookieString += `; Max-Age=${finalOptions.maxAge}`;
    }

    if (finalOptions.secure) {
      cookieString += '; Secure';
    }

    if (finalOptions.httpOnly) {
      cookieString += '; HttpOnly';
    }

    if (finalOptions.sameSite) {
      cookieString += `; SameSite=${finalOptions.sameSite}`;
    }

    if (finalOptions.path) {
      cookieString += `; Path=${finalOptions.path}`;
    }

    if (finalOptions.domain) {
      cookieString += `; Domain=${finalOptions.domain}`;
    }

    document.cookie = cookieString;
  }

  // Obtener cookie
  getCookie(name) {
    const cookies = document.cookie.split(';');

    for (let cookie of cookies) {
      const [cookieName, cookieValue] = cookie.trim().split('=');
      if (cookieName === name) {
        return cookieValue;
      }
    }

    return null;
  }

  // Eliminar cookie
  deleteCookie(name, options = {}) {
    const deleteOptions = {
      ...options,
      maxAge: 0,
    };

    this.setSecureCookie(name, '', deleteOptions);
  }

  // Crear cookie de sesión CSRF
  createCSRFSessionCookie(token) {
    this.setSecureCookie('csrf_session', token, {
      sameSite: 'Strict',
      secure: true,
      httpOnly: false, // Necesario para acceso desde JavaScript
      maxAge: 3600,
    });
  }

  // Validar cookie de sesión CSRF
  validateCSRFSessionCookie(token) {
    const sessionToken = this.getCookie('csrf_session');
    return sessionToken === token;
  }
}

// ========================================
// 🎯 DESAFÍO: PROTECCIÓN AJAX
// ========================================

class CSRFAjaxProtector {
  constructor() {
    this.tokenGenerator = new CSRFTokenGenerator();
    this.cookieManager = new SecureCookieManager();
    this.originValidator = new OriginValidator();
    this.token = null;
    this.init();
  }

  // Inicializar protector
  init() {
    this.token = this.tokenGenerator.generateToken();
    this.cookieManager.createCSRFSessionCookie(this.token);
    this.setupXHRInterceptor();
    this.setupFetchInterceptor();
  }

  // Interceptar XMLHttpRequest
  setupXHRInterceptor() {
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;
    const self = this;

    XMLHttpRequest.prototype.open = function (
      method,
      url,
      async,
      user,
      password
    ) {
      this._method = method;
      this._url = url;
      return originalOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function (data) {
      if (this._method && this._method.toUpperCase() !== 'GET') {
        // Agregar token CSRF
        this.setRequestHeader('X-CSRF-Token', self.token);

        // Validar origen
        const validation = self.originValidator.validateOrigin({
          headers: { origin: window.location.origin },
        });

        if (!validation.valid) {
          console.warn('CSRF: Origen inválido', validation.errors);
        }
      }

      return originalSend.apply(this, arguments);
    };
  }

  // Interceptar Fetch API
  setupFetchInterceptor() {
    const originalFetch = window.fetch;
    const self = this;

    window.fetch = function (resource, options = {}) {
      const method = options.method || 'GET';

      if (method.toUpperCase() !== 'GET') {
        // Agregar headers CSRF
        options.headers = options.headers || {};
        options.headers['X-CSRF-Token'] = self.token;

        // Validar origen
        const validation = self.originValidator.validateOrigin({
          headers: { origin: window.location.origin },
        });

        if (!validation.valid) {
          console.warn('CSRF: Origen inválido', validation.errors);
        }
      }

      return originalFetch.apply(this, arguments);
    };
  }

  // Obtener token actual
  getToken() {
    return this.token;
  }

  // Renovar token
  renewToken() {
    this.token = this.tokenGenerator.generateToken();
    this.cookieManager.createCSRFSessionCookie(this.token);
    return this.token;
  }

  // Validar petición
  validateRequest(request) {
    const token =
      request.headers['X-CSRF-Token'] || request.headers['x-csrf-token'];

    if (!token) {
      return { valid: false, error: 'Token CSRF requerido' };
    }

    const validation = this.tokenGenerator.validateToken(token);

    if (!validation.valid) {
      return validation;
    }

    // Validar cookie de sesión
    if (!this.cookieManager.validateCSRFSessionCookie(token)) {
      return { valid: false, error: 'Cookie de sesión inválida' };
    }

    return { valid: true };
  }
}

// ========================================
// 🔒 SISTEMA DE PROTECCIÓN COMPLETO
// ========================================

class ComprehensiveCSRFProtection {
  constructor() {
    this.formProtector = new CSRFFormProtector();
    this.ajaxProtector = new CSRFAjaxProtector();
    this.originValidator = new OriginValidator();
    this.cookieManager = new SecureCookieManager();
    this.isInitialized = false;
    this.config = {
      protectForms: true,
      protectAjax: true,
      validateOrigin: true,
      strictMode: false,
      autoRenewTokens: true,
      renewInterval: 1800000, // 30 minutos
    };
  }

  // Inicializar protección completa
  initialize(config = {}) {
    this.config = { ...this.config, ...config };

    if (this.config.protectForms) {
      this.formProtector.protectAllForms();
    }

    if (this.config.validateOrigin) {
      this.setupOriginValidation();
    }

    if (this.config.autoRenewTokens) {
      this.setupAutoRenewal();
    }

    this.isInitialized = true;

    // Logging
    console.log('🛡️ CSRF Protection initialized');
  }

  // Configurar validación de origen
  setupOriginValidation() {
    this.originValidator.addAllowedOrigin(window.location.origin);
    this.originValidator.addAllowedReferer(window.location.origin);
    this.originValidator.setStrictMode(this.config.strictMode);
  }

  // Configurar renovación automática
  setupAutoRenewal() {
    setInterval(() => {
      this.renewAllTokens();
    }, this.config.renewInterval);
  }

  // Renovar todos los tokens
  renewAllTokens() {
    // Renovar token AJAX
    this.ajaxProtector.renewToken();

    // Renovar tokens de formularios
    this.formProtector.protectedForms.forEach(form => {
      this.formProtector.renewFormToken(form);
    });

    console.log('🔄 CSRF tokens renewed');
  }

  // Obtener token actual
  getToken() {
    return this.ajaxProtector.getToken();
  }

  // Validar petición
  validateRequest(request) {
    const tokenValidation = this.ajaxProtector.validateRequest(request);

    if (!tokenValidation.valid) {
      return tokenValidation;
    }

    const originValidation = this.originValidator.validateOrigin(request);

    if (!originValidation.valid) {
      return {
        valid: false,
        error: 'Origen inválido',
        details: originValidation.errors,
      };
    }

    return { valid: true };
  }

  // Generar reporte de seguridad
  generateSecurityReport() {
    return {
      isInitialized: this.isInitialized,
      protectedForms: this.formProtector.protectedForms.size,
      currentToken: this.getToken(),
      allowedOrigins: Array.from(this.originValidator.allowedOrigins),
      tokenStats: this.ajaxProtector.tokenGenerator.getStats(),
      config: this.config,
      timestamp: new Date().toISOString(),
    };
  }
}

// ========================================
// 🧪 SISTEMA DE TESTING
// ========================================

class CSRFTestSuite {
  constructor() {
    this.results = [];
  }

  // Test de generación de tokens
  testTokenGeneration() {
    const generator = new CSRFTokenGenerator();
    const token1 = generator.generateToken();
    const token2 = generator.generateToken();

    this.results.push({
      test: 'Token Generation',
      passed: token1 !== token2 && token1.length > 0,
      details: { token1, token2 },
    });
  }

  // Test de validación de tokens
  testTokenValidation() {
    const generator = new CSRFTokenGenerator();
    const validToken = generator.generateToken();
    const invalidToken = 'invalid.token';

    const validResult = generator.validateToken(validToken);
    const invalidResult = generator.validateToken(invalidToken);

    this.results.push({
      test: 'Token Validation',
      passed: validResult.valid && !invalidResult.valid,
      details: { validResult, invalidResult },
    });
  }

  // Test de protección de formularios
  testFormProtection() {
    const protector = new CSRFFormProtector();
    const form = document.createElement('form');
    document.body.appendChild(form);

    const token = protector.protectForm(form);
    const tokenField = form.querySelector('.csrf-token');

    const passed = tokenField && tokenField.value === token;

    this.results.push({
      test: 'Form Protection',
      passed: passed,
      details: { token, hasTokenField: !!tokenField },
    });

    // Limpiar
    document.body.removeChild(form);
  }

  // Test de validación de origen
  testOriginValidation() {
    const validator = new OriginValidator();
    validator.addAllowedOrigin('https://example.com');

    const validRequest = {
      headers: { origin: 'https://example.com' },
    };

    const invalidRequest = {
      headers: { origin: 'https://malicious.com' },
    };

    const validResult = validator.validateOrigin(validRequest);
    const invalidResult = validator.validateOrigin(invalidRequest);

    this.results.push({
      test: 'Origin Validation',
      passed: validResult.valid && !invalidResult.valid,
      details: { validResult, invalidResult },
    });
  }

  // Ejecutar todos los tests
  runAllTests() {
    this.results = [];

    this.testTokenGeneration();
    this.testTokenValidation();
    this.testFormProtection();
    this.testOriginValidation();

    return this.generateReport();
  }

  generateReport() {
    const total = this.results.length;
    const passed = this.results.filter(r => r.passed).length;

    return {
      summary: {
        total: total,
        passed: passed,
        failed: total - passed,
        passRate: ((passed / total) * 100).toFixed(2) + '%',
      },
      results: this.results,
      timestamp: new Date().toISOString(),
    };
  }
}

// ========================================
// 🚀 EJEMPLO DE USO
// ========================================

// Inicializar protección CSRF completa
const csrfProtection = new ComprehensiveCSRFProtection();

// Configurar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  csrfProtection.initialize({
    protectForms: true,
    protectAjax: true,
    validateOrigin: true,
    strictMode: false,
    autoRenewTokens: true,
  });
});

// Ejemplo de uso manual
const formProtector = new CSRFFormProtector();
const form = document.querySelector('#critical-form');
if (form) {
  formProtector.protectForm(form);
}

// Ejecutar tests
const testSuite = new CSRFTestSuite();
const testReport = testSuite.runAllTests();
console.log('Reporte de tests CSRF:', testReport);

// ========================================
// 📝 TAREAS PARA COMPLETAR
// ========================================

/**
 * TODO: Implementar las siguientes funcionalidades:
 *
 * 1. Implementar Double Submit Cookie pattern
 * 2. Crear sistema de logging de intentos CSRF
 * 3. Implementar rate limiting para tokens
 * 4. Crear dashboard de monitoreo CSRF
 * 5. Implementar integración con frameworks (React, Vue, etc.)
 * 6. Crear sistema de alertas en tiempo real
 * 7. Implementar rotación automática de claves
 * 8. Crear tests de penetración CSRF
 * 9. Implementar métricas de seguridad
 * 10. Crear documentación interactiva
 */

console.log('🛡️ Sistema de Protección CSRF - Cargado y Listo');
