/**
 * 🔒 DÍA 4 - EJERCICIO 3: PREVENCIÓN XSS (Cross-Site Scripting)
 *
 * Objetivos:
 * - Comprender tipos de ataques XSS
 * - Implementar mecanismos de prevención
 * - Sanitizar entrada de usuario
 * - Escapar salida de datos
 * - Validar y filtrar contenido HTML
 *
 * Competencias WorldSkills:
 * - Seguridad web frontend
 * - Sanitización de datos
 * - Prevención de vulnerabilidades
 * - Validación de entrada
 */

// ========================================
// 📚 TEORÍA: TIPOS DE ATAQUES XSS
// ========================================

/**
 * TIPOS DE XSS:
 *
 * 1. REFLECTED XSS (No persistente)
 * - Script malicioso reflejado desde servidor
 * - Ejecutado inmediatamente
 *
 * 2. STORED XSS (Persistente)
 * - Script almacenado en base de datos
 * - Ejecutado cada vez que se muestra
 *
 * 3. DOM-based XSS
 * - Script ejecutado por manipulación DOM
 * - Sin involucrar servidor
 *
 * 4. BLIND XSS
 * - Script ejecutado en área no visible
 * - Difícil de detectar
 */

// ========================================
// 🛡️ CLASE XSS PROTECTOR
// ========================================

class XSSProtector {
  constructor() {
    this.allowedTags = ['b', 'i', 'em', 'strong', 'u', 'br', 'p'];
    this.allowedAttributes = ['class', 'id'];
    this.dangerousPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
      /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
      /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
      /<link\b[^<]*(?:(?!<\/link>)<[^<]*)*<\/link>/gi,
      /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi,
    ];
  }

  // Sanitizar HTML básico
  sanitizeHtml(html) {
    if (!html || typeof html !== 'string') return '';

    let sanitized = html;

    // Remover patrones peligrosos
    this.dangerousPatterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '');
    });

    // Escapar caracteres especiales
    sanitized = this.escapeHtml(sanitized);

    return sanitized;
  }

  // Escapar caracteres HTML
  escapeHtml(text) {
    if (!text || typeof text !== 'string') return '';

    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#47;',
    };

    return text.replace(/[&<>"'/]/g, match => map[match]);
  }

  // Sanitizar atributos
  sanitizeAttributes(element) {
    if (!element || !element.attributes) return;

    const attrs = Array.from(element.attributes);
    attrs.forEach(attr => {
      // Remover atributos de eventos
      if (attr.name.startsWith('on')) {
        element.removeAttribute(attr.name);
      }

      // Validar atributos permitidos
      if (!this.allowedAttributes.includes(attr.name)) {
        element.removeAttribute(attr.name);
      }

      // Sanitizar valores de atributos
      if (attr.value) {
        const cleanValue = this.escapeHtml(attr.value);
        element.setAttribute(attr.name, cleanValue);
      }
    });
  }

  // Filtrar tags HTML
  filterHtmlTags(html) {
    if (!html || typeof html !== 'string') return '';

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const walker = document.createTreeWalker(
      tempDiv,
      NodeFilter.SHOW_ELEMENT,
      null,
      false
    );

    const nodesToRemove = [];
    let node;

    while ((node = walker.nextNode())) {
      if (!this.allowedTags.includes(node.tagName.toLowerCase())) {
        nodesToRemove.push(node);
      } else {
        this.sanitizeAttributes(node);
      }
    }

    nodesToRemove.forEach(node => {
      node.parentNode.removeChild(node);
    });

    return tempDiv.innerHTML;
  }

  // Validar URL segura
  isSecureUrl(url) {
    if (!url || typeof url !== 'string') return false;

    const dangerousProtocols = [
      'javascript:',
      'data:',
      'vbscript:',
      'about:',
      'file:',
    ];

    return !dangerousProtocols.some(protocol =>
      url.toLowerCase().startsWith(protocol)
    );
  }

  // Sanitizar CSS
  sanitizeCss(css) {
    if (!css || typeof css !== 'string') return '';

    const dangerousCssPatterns = [
      /expression\s*\(/gi,
      /javascript:/gi,
      /vbscript:/gi,
      /data:/gi,
      /import/gi,
      /@import/gi,
      /url\s*\(/gi,
    ];

    let sanitized = css;
    dangerousCssPatterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '');
    });

    return sanitized;
  }

  // Proteger formularios
  protectForm(form) {
    if (!form || !form.elements) return;

    Array.from(form.elements).forEach(element => {
      if (element.type === 'text' || element.type === 'textarea') {
        element.addEventListener('input', e => {
          e.target.value = this.sanitizeHtml(e.target.value);
        });
      }
    });
  }
}

// ========================================
// 🔒 DESAFÍO 1: SANITIZADOR DE COMENTARIOS
// ========================================

class CommentSanitizer {
  constructor() {
    this.xssProtector = new XSSProtector();
    this.maxLength = 500;
    this.allowedTags = ['b', 'i', 'em', 'strong', 'u'];
  }

  sanitizeComment(comment) {
    if (!comment || typeof comment !== 'string') {
      return { isValid: false, error: 'Comentario inválido' };
    }

    if (comment.length > this.maxLength) {
      return {
        isValid: false,
        error: `Comentario muy largo (máximo ${this.maxLength} caracteres)`,
      };
    }

    // Sanitizar contenido
    const sanitized = this.xssProtector.sanitizeHtml(comment);
    const filtered = this.xssProtector.filterHtmlTags(sanitized);

    // Validar que no esté vacío después de sanitizar
    if (!filtered.trim()) {
      return { isValid: false, error: 'Comentario vacío' };
    }

    return {
      isValid: true,
      sanitized: filtered,
      original: comment,
    };
  }

  // Detectar intentos de XSS
  detectXssAttempt(input) {
    const xssPatterns = [
      /<script/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe/gi,
      /eval\(/gi,
      /alert\(/gi,
      /document\.cookie/gi,
      /window\.location/gi,
    ];

    return xssPatterns.some(pattern => pattern.test(input));
  }

  // Generar reporte de seguridad
  generateSecurityReport(input) {
    const report = {
      input: input,
      timestamp: new Date().toISOString(),
      threats: [],
      risk: 'low',
    };

    // Analizar amenazas
    if (this.detectXssAttempt(input)) {
      report.threats.push('XSS attempt detected');
      report.risk = 'high';
    }

    if (input.includes('eval(')) {
      report.threats.push('Code injection attempt');
      report.risk = 'critical';
    }

    if (input.includes('document.cookie')) {
      report.threats.push('Cookie access attempt');
      report.risk = 'high';
    }

    return report;
  }
}

// ========================================
// 🛡️ DESAFÍO 2: SISTEMA DE FILTRADO AVANZADO
// ========================================

class AdvancedContentFilter {
  constructor() {
    this.xssProtector = new XSSProtector();
    this.blacklistedWords = [];
    this.whitelist = {
      protocols: ['http:', 'https:', 'mailto:'],
      domains: [],
      fileTypes: ['.jpg', '.jpeg', '.png', '.gif', '.svg'],
    };
  }

  // Filtrar contenido rico
  filterRichContent(content) {
    if (!content) return '';

    // Parsear HTML de forma segura
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;

    // Procesar todos los elementos
    this.processElements(tempDiv);

    return tempDiv.innerHTML;
  }

  processElements(container) {
    const elements = container.querySelectorAll('*');

    elements.forEach(element => {
      // Validar tag
      if (!this.isAllowedTag(element.tagName)) {
        element.remove();
        return;
      }

      // Procesar atributos
      this.processAttributes(element);

      // Procesar contenido de texto
      if (element.textContent) {
        element.textContent = this.filterText(element.textContent);
      }
    });
  }

  isAllowedTag(tagName) {
    const allowedTags = [
      'P',
      'DIV',
      'SPAN',
      'B',
      'I',
      'EM',
      'STRONG',
      'U',
      'H1',
      'H2',
      'H3',
      'H4',
      'H5',
      'H6',
      'UL',
      'OL',
      'LI',
      'BR',
      'HR',
      'A',
      'IMG',
      'BLOCKQUOTE',
    ];

    return allowedTags.includes(tagName.toUpperCase());
  }

  processAttributes(element) {
    const attrs = Array.from(element.attributes);

    attrs.forEach(attr => {
      switch (attr.name.toLowerCase()) {
        case 'href':
          if (!this.isSecureUrl(attr.value)) {
            element.removeAttribute(attr.name);
          }
          break;

        case 'src':
          if (!this.isSecureImageUrl(attr.value)) {
            element.removeAttribute(attr.name);
          }
          break;

        case 'style':
          attr.value = this.xssProtector.sanitizeCss(attr.value);
          break;

        default:
          if (
            attr.name.startsWith('on') ||
            !this.isAllowedAttribute(attr.name)
          ) {
            element.removeAttribute(attr.name);
          }
      }
    });
  }

  isSecureUrl(url) {
    if (!url) return false;

    try {
      const urlObj = new URL(url);
      return this.whitelist.protocols.includes(urlObj.protocol);
    } catch {
      return false;
    }
  }

  isSecureImageUrl(url) {
    if (!this.isSecureUrl(url)) return false;

    const hasValidExtension = this.whitelist.fileTypes.some(ext =>
      url.toLowerCase().endsWith(ext)
    );

    return hasValidExtension;
  }

  isAllowedAttribute(attrName) {
    const allowedAttributes = [
      'class',
      'id',
      'title',
      'alt',
      'href',
      'src',
      'width',
      'height',
      'style',
    ];

    return allowedAttributes.includes(attrName.toLowerCase());
  }

  filterText(text) {
    let filtered = text;

    // Remover palabras de la blacklist
    this.blacklistedWords.forEach(word => {
      const regex = new RegExp(word, 'gi');
      filtered = filtered.replace(regex, '***');
    });

    return filtered;
  }
}

// ========================================
// 🔒 DESAFÍO 3: VALIDADOR DE ENTRADA EN TIEMPO REAL
// ========================================

class RealTimeXSSValidator {
  constructor() {
    this.xssProtector = new XSSProtector();
    this.threatLevel = 0;
    this.maxThreatLevel = 10;
    this.listeners = [];
  }

  // Validar entrada en tiempo real
  validateInput(input, element) {
    const analysis = this.analyzeInput(input);

    // Actualizar UI según nivel de amenaza
    this.updateThreatIndicator(element, analysis);

    // Notificar listeners
    this.notifyListeners(analysis);

    return analysis;
  }

  analyzeInput(input) {
    const analysis = {
      input: input,
      threatLevel: 0,
      threats: [],
      sanitized: '',
      timestamp: Date.now(),
    };

    // Detectar scripts
    if (/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(input)) {
      analysis.threats.push('Script tag detected');
      analysis.threatLevel += 5;
    }

    // Detectar eventos inline
    if (/on\w+\s*=/gi.test(input)) {
      analysis.threats.push('Inline event handler detected');
      analysis.threatLevel += 3;
    }

    // Detectar JavaScript URLs
    if (/javascript:/gi.test(input)) {
      analysis.threats.push('JavaScript URL detected');
      analysis.threatLevel += 4;
    }

    // Detectar iframes
    if (/<iframe/gi.test(input)) {
      analysis.threats.push('Iframe detected');
      analysis.threatLevel += 3;
    }

    // Detectar eval y similares
    if (/eval\(|setTimeout\(|setInterval\(/gi.test(input)) {
      analysis.threats.push('Code execution function detected');
      analysis.threatLevel += 6;
    }

    // Sanitizar entrada
    analysis.sanitized = this.xssProtector.sanitizeHtml(input);

    return analysis;
  }

  updateThreatIndicator(element, analysis) {
    const indicator = this.getOrCreateIndicator(element);

    // Actualizar color según nivel de amenaza
    indicator.className = `threat-indicator ${this.getThreatClass(
      analysis.threatLevel
    )}`;

    // Actualizar mensaje
    if (analysis.threats.length > 0) {
      indicator.textContent = `⚠️ ${analysis.threats.join(', ')}`;
      indicator.style.display = 'block';
    } else {
      indicator.style.display = 'none';
    }
  }

  getOrCreateIndicator(element) {
    let indicator = element.parentNode.querySelector('.threat-indicator');

    if (!indicator) {
      indicator = document.createElement('div');
      indicator.className = 'threat-indicator';
      element.parentNode.appendChild(indicator);
    }

    return indicator;
  }

  getThreatClass(level) {
    if (level >= 8) return 'critical';
    if (level >= 5) return 'high';
    if (level >= 3) return 'medium';
    if (level >= 1) return 'low';
    return 'safe';
  }

  // Sistema de listeners
  addListener(callback) {
    this.listeners.push(callback);
  }

  notifyListeners(analysis) {
    this.listeners.forEach(callback => {
      try {
        callback(analysis);
      } catch (error) {
        console.error('Error in XSS listener:', error);
      }
    });
  }

  // Generar reporte de seguridad
  generateReport(analyses) {
    const report = {
      totalInputs: analyses.length,
      threatsDetected: analyses.filter(a => a.threats.length > 0).length,
      averageThreatLevel:
        analyses.reduce((sum, a) => sum + a.threatLevel, 0) / analyses.length,
      commonThreats: this.getCommonThreats(analyses),
      timestamp: new Date().toISOString(),
    };

    return report;
  }

  getCommonThreats(analyses) {
    const threatCounts = {};

    analyses.forEach(analysis => {
      analysis.threats.forEach(threat => {
        threatCounts[threat] = (threatCounts[threat] || 0) + 1;
      });
    });

    return Object.entries(threatCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([threat, count]) => ({ threat, count }));
  }
}

// ========================================
// 🎯 DESAFÍO AVANZADO: SISTEMA DE PROTECCIÓN COMPLETO
// ========================================

class ComprehensiveXSSProtection {
  constructor() {
    this.xssProtector = new XSSProtector();
    this.validator = new RealTimeXSSValidator();
    this.contentFilter = new AdvancedContentFilter();
    this.logger = new SecurityLogger();
    this.config = {
      enableRealTimeValidation: true,
      enableContentFiltering: true,
      enableSecurityLogging: true,
      enableCSPEnforcement: true,
    };
  }

  // Inicializar protección
  initialize() {
    if (this.config.enableRealTimeValidation) {
      this.setupRealTimeValidation();
    }

    if (this.config.enableContentFiltering) {
      this.setupContentFiltering();
    }

    if (this.config.enableCSPEnforcement) {
      this.setupCSPEnforcement();
    }

    this.setupGlobalErrorHandling();
  }

  setupRealTimeValidation() {
    document.addEventListener('input', e => {
      if (e.target.matches('input[type="text"], textarea')) {
        const analysis = this.validator.validateInput(e.target.value, e.target);

        if (analysis.threatLevel > 0) {
          this.logger.logThreat(analysis);
        }
      }
    });
  }

  setupContentFiltering() {
    // Interceptar innerHTML assignments
    const originalInnerHTML = Object.getOwnPropertyDescriptor(
      Element.prototype,
      'innerHTML'
    );

    Object.defineProperty(Element.prototype, 'innerHTML', {
      set: function (value) {
        const filtered = this.contentFilter.filterRichContent(value);
        originalInnerHTML.set.call(this, filtered);
      },
      get: originalInnerHTML.get,
    });
  }

  setupCSPEnforcement() {
    // Detectar violaciones CSP
    document.addEventListener('securitypolicyviolation', e => {
      this.logger.logCSPViolation({
        directive: e.violatedDirective,
        blockedURI: e.blockedURI,
        documentURI: e.documentURI,
        timestamp: new Date().toISOString(),
      });
    });
  }

  setupGlobalErrorHandling() {
    window.addEventListener('error', e => {
      // Detectar errores relacionados con XSS
      if (this.isXSSRelatedError(e)) {
        this.logger.logXSSError({
          message: e.message,
          source: e.filename,
          line: e.lineno,
          column: e.colno,
          timestamp: new Date().toISOString(),
        });
      }
    });
  }

  isXSSRelatedError(error) {
    const xssKeywords = [
      'script',
      'eval',
      'innerHTML',
      'document.write',
      'createElement',
      'appendChild',
      'insertAdjacentHTML',
    ];

    return xssKeywords.some(keyword =>
      error.message.toLowerCase().includes(keyword)
    );
  }

  // Generar reporte de seguridad completo
  generateSecurityReport() {
    return {
      xssThreats: this.logger.getXSSThreats(),
      cspViolations: this.logger.getCSPViolations(),
      filteredContent: this.logger.getFilteredContent(),
      totalEvents: this.logger.getTotalEvents(),
      riskLevel: this.calculateRiskLevel(),
      recommendations: this.generateRecommendations(),
      timestamp: new Date().toISOString(),
    };
  }

  calculateRiskLevel() {
    const threats = this.logger.getXSSThreats();
    const violations = this.logger.getCSPViolations();

    if (threats.length > 10 || violations.length > 5) return 'high';
    if (threats.length > 5 || violations.length > 2) return 'medium';
    if (threats.length > 0 || violations.length > 0) return 'low';
    return 'safe';
  }

  generateRecommendations() {
    const recommendations = [];

    if (this.logger.getXSSThreats().length > 0) {
      recommendations.push('Implement stricter input validation');
      recommendations.push('Consider using a Content Security Policy');
    }

    if (this.logger.getCSPViolations().length > 0) {
      recommendations.push('Review and tighten CSP directives');
    }

    return recommendations;
  }
}

// ========================================
// 📊 LOGGER DE SEGURIDAD
// ========================================

class SecurityLogger {
  constructor() {
    this.logs = {
      xssThreats: [],
      cspViolations: [],
      filteredContent: [],
      errors: [],
    };
  }

  logThreat(analysis) {
    this.logs.xssThreats.push({
      ...analysis,
      timestamp: new Date().toISOString(),
    });
  }

  logCSPViolation(violation) {
    this.logs.cspViolations.push(violation);
  }

  logFilteredContent(content) {
    this.logs.filteredContent.push({
      original: content.original,
      filtered: content.filtered,
      timestamp: new Date().toISOString(),
    });
  }

  logXSSError(error) {
    this.logs.errors.push(error);
  }

  getXSSThreats() {
    return this.logs.xssThreats;
  }

  getCSPViolations() {
    return this.logs.cspViolations;
  }

  getFilteredContent() {
    return this.logs.filteredContent;
  }

  getTotalEvents() {
    return Object.values(this.logs).reduce(
      (total, log) => total + log.length,
      0
    );
  }

  exportLogs() {
    return {
      ...this.logs,
      summary: {
        totalThreats: this.logs.xssThreats.length,
        totalViolations: this.logs.cspViolations.length,
        totalFiltered: this.logs.filteredContent.length,
        totalErrors: this.logs.errors.length,
      },
      exportedAt: new Date().toISOString(),
    };
  }
}

// ========================================
// 🧪 SISTEMA DE TESTING
// ========================================

class XSSTestSuite {
  constructor() {
    this.tests = [];
    this.results = [];
  }

  // Test básico de sanitización
  testBasicSanitization() {
    const protector = new XSSProtector();
    const testCases = [
      {
        input: '<script>alert("XSS")</script>',
        expected: '&lt;script&gt;alert("XSS")&lt;/script&gt;',
      },
      {
        input: '<img src="x" onerror="alert(1)">',
        expected: '&lt;img src="x" onerror="alert(1)"&gt;',
      },
      {
        input: 'javascript:alert("XSS")',
        expected: 'javascript:alert("XSS")',
      },
    ];

    testCases.forEach((testCase, index) => {
      const result = protector.sanitizeHtml(testCase.input);
      const passed = result === testCase.expected;

      this.results.push({
        test: `Basic Sanitization ${index + 1}`,
        input: testCase.input,
        expected: testCase.expected,
        actual: result,
        passed: passed,
      });
    });
  }

  // Test de filtrado de contenido
  testContentFiltering() {
    const filter = new AdvancedContentFilter();
    const testCases = [
      {
        input: '<p>Safe content</p><script>alert("XSS")</script>',
        shouldContain: 'Safe content',
        shouldNotContain: 'script',
      },
      {
        input: '<div onclick="alert(1)">Click me</div>',
        shouldContain: 'Click me',
        shouldNotContain: 'onclick',
      },
    ];

    testCases.forEach((testCase, index) => {
      const result = filter.filterRichContent(testCase.input);
      const containsRequired = result.includes(testCase.shouldContain);
      const excludesForbidden = !result.includes(testCase.shouldNotContain);
      const passed = containsRequired && excludesForbidden;

      this.results.push({
        test: `Content Filtering ${index + 1}`,
        input: testCase.input,
        result: result,
        passed: passed,
      });
    });
  }

  // Test de validación en tiempo real
  testRealTimeValidation() {
    const validator = new RealTimeXSSValidator();
    const testCases = [
      {
        input: '<script>alert("XSS")</script>',
        expectedThreatLevel: 5,
      },
      {
        input: '<div onclick="alert(1)">',
        expectedThreatLevel: 3,
      },
      {
        input: 'Safe content',
        expectedThreatLevel: 0,
      },
    ];

    testCases.forEach((testCase, index) => {
      const analysis = validator.analyzeInput(testCase.input);
      const passed = analysis.threatLevel === testCase.expectedThreatLevel;

      this.results.push({
        test: `Real-time Validation ${index + 1}`,
        input: testCase.input,
        expectedThreatLevel: testCase.expectedThreatLevel,
        actualThreatLevel: analysis.threatLevel,
        passed: passed,
      });
    });
  }

  // Ejecutar todos los tests
  runAllTests() {
    this.results = [];

    this.testBasicSanitization();
    this.testContentFiltering();
    this.testRealTimeValidation();

    return this.generateReport();
  }

  generateReport() {
    const total = this.results.length;
    const passed = this.results.filter(r => r.passed).length;
    const failed = total - passed;

    return {
      summary: {
        total: total,
        passed: passed,
        failed: failed,
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

// Inicializar sistema de protección
const xssProtection = new ComprehensiveXSSProtection();
xssProtection.initialize();

// Ejemplo de uso del sanitizador
const sanitizer = new CommentSanitizer();
const userComment = '<script>alert("XSS")</script>Hello <b>World</b>!';
const result = sanitizer.sanitizeComment(userComment);
console.log('Resultado sanitización:', result);

// Ejemplo de filtrado avanzado
const filter = new AdvancedContentFilter();
const richContent = '<p>Safe content</p><script>alert("XSS")</script>';
const filtered = filter.filterRichContent(richContent);
console.log('Contenido filtrado:', filtered);

// Ejecutar tests
const testSuite = new XSSTestSuite();
const testReport = testSuite.runAllTests();
console.log('Reporte de tests:', testReport);

// ========================================
// 📝 TAREAS PARA COMPLETAR
// ========================================

/**
 * TODO: Implementar las siguientes funcionalidades:
 *
 * 1. Crear un sistema de whitelist para dominios seguros
 * 2. Implementar detección de ataques DOM-based XSS
 * 3. Crear un sistema de alertas en tiempo real
 * 4. Implementar rate limiting para prevenir ataques
 * 5. Crear un dashboard de seguridad con métricas
 * 6. Implementar logging a servidor remoto
 * 7. Crear tests de penetración automatizados
 * 8. Implementar Content Security Policy dinámico
 * 9. Crear sistema de reputación para usuarios
 * 10. Implementar machine learning para detección de amenazas
 */

console.log('🔒 Sistema de Prevención XSS - Cargado y Listo');
