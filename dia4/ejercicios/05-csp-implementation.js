/**
 * 🔐 DÍA 4 - EJERCICIO 5: IMPLEMENTACIÓN CSP (Content Security Policy)
 *
 * Objetivos:
 * - Implementar Content Security Policy
 * - Configurar directivas CSP
 * - Monitorear violaciones CSP
 * - Crear políticas dinámicas
 * - Optimizar rendimiento con CSP
 *
 * Competencias WorldSkills:
 * - Políticas de seguridad web
 * - Prevención de ataques de inyección
 * - Monitoreo de seguridad
 * - Configuración de headers HTTP
 */

// ========================================
// 📚 TEORÍA: CONTENT SECURITY POLICY
// ========================================

/**
 * CSP (Content Security Policy):
 *
 * PROPÓSITO:
 * - Prevenir ataques XSS
 * - Controlar recursos cargados
 * - Detectar violaciones de seguridad
 * - Reducir superficie de ataque
 *
 * DIRECTIVAS PRINCIPALES:
 * - default-src: Fuente por defecto
 * - script-src: Scripts JavaScript
 * - style-src: Hojas de estilo
 * - img-src: Imágenes
 * - connect-src: Conexiones AJAX/WebSocket
 * - font-src: Fuentes
 * - object-src: Objetos embebidos
 * - media-src: Audio/Video
 * - frame-src: Marcos/iframes
 * - base-uri: URI base
 * - form-action: Destinos de formularios
 *
 * VALORES ESPECIALES:
 * - 'none': Bloquear todo
 * - 'self': Solo mismo origen
 * - 'unsafe-inline': Permitir inline
 * - 'unsafe-eval': Permitir eval()
 * - 'strict-dynamic': Modo estricto dinámico
 * - 'nonce-value': Usar nonce específico
 * - 'sha256-hash': Usar hash SHA256
 */

// ========================================
// 🛠️ GENERADOR DE POLÍTICAS CSP
// ========================================

class CSPPolicyGenerator {
  constructor() {
    this.policy = {
      'default-src': ["'self'"],
      'script-src': ["'self'"],
      'style-src': ["'self'", "'unsafe-inline'"],
      'img-src': ["'self'", 'data:', 'https:'],
      'connect-src': ["'self'"],
      'font-src': ["'self'"],
      'object-src': ["'none'"],
      'media-src': ["'self'"],
      'frame-src': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"],
      'frame-ancestors': ["'none'"],
      'upgrade-insecure-requests': true,
      'block-all-mixed-content': true,
    };

    this.reportUri = null;
    this.reportOnly = false;
    this.nonces = new Map();
  }

  // Configurar política por defecto
  setDefaultPolicy(level = 'strict') {
    const policies = {
      basic: {
        'default-src': ["'self'"],
        'script-src': ["'self'"],
        'style-src': ["'self'", "'unsafe-inline'"],
        'img-src': ["'self'", 'data:', 'https:'],
        'object-src': ["'none'"],
      },

      moderate: {
        'default-src': ["'self'"],
        'script-src': ["'self'", "'unsafe-inline'"],
        'style-src': ["'self'", "'unsafe-inline'"],
        'img-src': ["'self'", 'data:', 'https:'],
        'connect-src': ["'self'", 'https:'],
        'font-src': ["'self'", 'https:'],
        'object-src': ["'none'"],
        'media-src': ["'self'", 'https:'],
        'frame-src': ["'self'"],
        'base-uri': ["'self'"],
        'form-action': ["'self'"],
      },

      strict: {
        'default-src': ["'none'"],
        'script-src': ["'self'", "'strict-dynamic'"],
        'style-src': ["'self'"],
        'img-src': ["'self'", 'data:'],
        'connect-src': ["'self'"],
        'font-src': ["'self'"],
        'object-src': ["'none'"],
        'media-src': ["'self'"],
        'frame-src': ["'none'"],
        'base-uri': ["'self'"],
        'form-action': ["'self'"],
        'frame-ancestors': ["'none'"],
        'upgrade-insecure-requests': true,
        'block-all-mixed-content': true,
      },
    };

    this.policy = { ...this.policy, ...policies[level] };
  }

  // Agregar fuente a directiva
  addSource(directive, source) {
    if (!this.policy[directive]) {
      this.policy[directive] = [];
    }

    if (!this.policy[directive].includes(source)) {
      this.policy[directive].push(source);
    }
  }

  // Remover fuente de directiva
  removeSource(directive, source) {
    if (this.policy[directive]) {
      this.policy[directive] = this.policy[directive].filter(s => s !== source);
    }
  }

  // Generar nonce
  generateNonce() {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    const nonce = btoa(String.fromCharCode(...array));

    // Almacenar nonce con timestamp
    this.nonces.set(nonce, Date.now());

    return nonce;
  }

  // Agregar nonce a directiva
  addNonce(directive, nonce = null) {
    if (!nonce) {
      nonce = this.generateNonce();
    }

    const nonceSource = `'nonce-${nonce}'`;
    this.addSource(directive, nonceSource);

    return nonce;
  }

  // Generar hash SHA256
  generateSHA256Hash(content) {
    return crypto.subtle
      .digest('SHA-256', new TextEncoder().encode(content))
      .then(buffer => {
        const hashArray = Array.from(new Uint8Array(buffer));
        const hashHex = hashArray
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
        return btoa(hashHex);
      });
  }

  // Agregar hash a directiva
  async addHash(directive, content, algorithm = 'sha256') {
    const hash = await this.generateSHA256Hash(content);
    const hashSource = `'${algorithm}-${hash}'`;
    this.addSource(directive, hashSource);

    return hash;
  }

  // Configurar reporte
  setReportUri(uri) {
    this.reportUri = uri;
  }

  // Configurar modo report-only
  setReportOnly(enabled) {
    this.reportOnly = enabled;
  }

  // Generar header CSP
  generateHeader() {
    const directives = [];

    // Procesar directivas con valores
    Object.entries(this.policy).forEach(([directive, sources]) => {
      if (Array.isArray(sources) && sources.length > 0) {
        directives.push(`${directive} ${sources.join(' ')}`);
      } else if (typeof sources === 'boolean' && sources) {
        directives.push(directive);
      }
    });

    // Agregar report-uri si está configurado
    if (this.reportUri) {
      directives.push(`report-uri ${this.reportUri}`);
    }

    const headerName = this.reportOnly
      ? 'Content-Security-Policy-Report-Only'
      : 'Content-Security-Policy';

    return {
      name: headerName,
      value: directives.join('; '),
    };
  }

  // Generar meta tag
  generateMetaTag() {
    const header = this.generateHeader();

    if (this.reportOnly) {
      console.warn('Report-Only mode no es compatible con meta tags');
      return null;
    }

    return `<meta http-equiv="Content-Security-Policy" content="${header.value}">`;
  }

  // Limpiar nonces expirados
  cleanupNonces(maxAge = 3600000) {
    // 1 hora
    const now = Date.now();
    const expired = [];

    for (const [nonce, timestamp] of this.nonces) {
      if (now - timestamp > maxAge) {
        expired.push(nonce);
      }
    }

    expired.forEach(nonce => this.nonces.delete(nonce));
    return expired.length;
  }

  // Validar nonce
  isValidNonce(nonce) {
    return this.nonces.has(nonce);
  }
}

// ========================================
// 📊 MONITOR DE VIOLACIONES CSP
// ========================================

class CSPViolationMonitor {
  constructor() {
    this.violations = [];
    this.listeners = [];
    this.config = {
      maxViolations: 1000,
      enableLogging: true,
      enableAnalytics: true,
      reportEndpoint: null,
    };

    this.init();
  }

  // Inicializar monitor
  init() {
    this.setupViolationListener();
    this.setupPeriodicCleanup();
  }

  // Configurar listener de violaciones
  setupViolationListener() {
    document.addEventListener('securitypolicyviolation', event => {
      this.handleViolation(event);
    });
  }

  // Manejar violación
  handleViolation(event) {
    const violation = {
      timestamp: new Date().toISOString(),
      directive: event.violatedDirective,
      blockedURI: event.blockedURI,
      documentURI: event.documentURI,
      referrer: event.referrer,
      statusCode: event.statusCode,
      sourceFile: event.sourceFile,
      lineNumber: event.lineNumber,
      columnNumber: event.columnNumber,
      sample: event.sample || '',
      disposition: event.disposition || 'enforce',
    };

    // Almacenar violación
    this.violations.push(violation);

    // Mantener límite de violaciones
    if (this.violations.length > this.config.maxViolations) {
      this.violations.shift();
    }

    // Logging
    if (this.config.enableLogging) {
      this.logViolation(violation);
    }

    // Reportar al endpoint
    if (this.config.reportEndpoint) {
      this.reportViolation(violation);
    }

    // Notificar listeners
    this.notifyListeners(violation);
  }

  // Log de violación
  logViolation(violation) {
    console.warn('🚨 CSP Violation:', {
      directive: violation.directive,
      blockedURI: violation.blockedURI,
      sourceFile: violation.sourceFile,
      line: violation.lineNumber,
      sample: violation.sample,
    });
  }

  // Reportar violación
  async reportViolation(violation) {
    try {
      await fetch(this.config.reportEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'csp-report': violation,
        }),
      });
    } catch (error) {
      console.error('Error reporting CSP violation:', error);
    }
  }

  // Agregar listener
  addListener(callback) {
    this.listeners.push(callback);
  }

  // Notificar listeners
  notifyListeners(violation) {
    this.listeners.forEach(callback => {
      try {
        callback(violation);
      } catch (error) {
        console.error('Error in CSP listener:', error);
      }
    });
  }

  // Obtener violaciones
  getViolations(filter = {}) {
    let filtered = this.violations;

    if (filter.directive) {
      filtered = filtered.filter(v => v.directive === filter.directive);
    }

    if (filter.since) {
      const since = new Date(filter.since);
      filtered = filtered.filter(v => new Date(v.timestamp) > since);
    }

    if (filter.blockedURI) {
      filtered = filtered.filter(v => v.blockedURI.includes(filter.blockedURI));
    }

    return filtered;
  }

  // Generar estadísticas
  generateStats() {
    const stats = {
      totalViolations: this.violations.length,
      violationsByDirective: {},
      violationsBySource: {},
      recentViolations: 0,
      topBlockedURIs: {},
      timeRange: {
        earliest: null,
        latest: null,
      },
    };

    // Procesar violaciones
    this.violations.forEach(violation => {
      // Por directiva
      const directive = violation.directive;
      stats.violationsByDirective[directive] =
        (stats.violationsByDirective[directive] || 0) + 1;

      // Por fuente
      const source = violation.sourceFile || 'inline';
      stats.violationsBySource[source] =
        (stats.violationsBySource[source] || 0) + 1;

      // URIs bloqueadas
      const blockedURI = violation.blockedURI;
      stats.topBlockedURIs[blockedURI] =
        (stats.topBlockedURIs[blockedURI] || 0) + 1;

      // Rango de tiempo
      const timestamp = new Date(violation.timestamp);
      if (!stats.timeRange.earliest || timestamp < stats.timeRange.earliest) {
        stats.timeRange.earliest = timestamp;
      }
      if (!stats.timeRange.latest || timestamp > stats.timeRange.latest) {
        stats.timeRange.latest = timestamp;
      }

      // Violaciones recientes (última hora)
      if (Date.now() - timestamp.getTime() < 3600000) {
        stats.recentViolations++;
      }
    });

    // Ordenar top URIs
    stats.topBlockedURIs = Object.entries(stats.topBlockedURIs)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .reduce((obj, [uri, count]) => {
        obj[uri] = count;
        return obj;
      }, {});

    return stats;
  }

  // Configurar cleanup periódico
  setupPeriodicCleanup() {
    setInterval(() => {
      this.cleanupOldViolations();
    }, 3600000); // Cada hora
  }

  // Limpiar violaciones antiguas
  cleanupOldViolations(maxAge = 86400000) {
    // 24 horas
    const cutoff = Date.now() - maxAge;
    const initialCount = this.violations.length;

    this.violations = this.violations.filter(violation => {
      const timestamp = new Date(violation.timestamp).getTime();
      return timestamp > cutoff;
    });

    const removed = initialCount - this.violations.length;
    if (removed > 0) {
      console.log(`🧹 Cleaned up ${removed} old CSP violations`);
    }

    return removed;
  }

  // Exportar violaciones
  exportViolations(format = 'json') {
    const data = {
      violations: this.violations,
      stats: this.generateStats(),
      exportedAt: new Date().toISOString(),
    };

    switch (format) {
      case 'json':
        return JSON.stringify(data, null, 2);

      case 'csv':
        return this.generateCSV(data.violations);

      default:
        return data;
    }
  }

  // Generar CSV
  generateCSV(violations) {
    const headers = [
      'timestamp',
      'directive',
      'blockedURI',
      'documentURI',
      'sourceFile',
      'lineNumber',
      'columnNumber',
      'sample',
    ];

    const rows = violations.map(violation =>
      headers.map(header => violation[header] || '').join(',')
    );

    return [headers.join(','), ...rows].join('\n');
  }
}

// ========================================
// 🔧 CONFIGURADOR CSP DINÁMICO
// ========================================

class DynamicCSPConfigurator {
  constructor() {
    this.generator = new CSPPolicyGenerator();
    this.monitor = new CSPViolationMonitor();
    this.currentPolicy = null;
    this.autoAdjust = false;
    this.learningMode = false;
    this.trustedSources = new Set();
  }

  // Configurar política dinámica
  setupDynamicPolicy(options = {}) {
    this.autoAdjust = options.autoAdjust || false;
    this.learningMode = options.learningMode || false;

    // Configurar política inicial
    this.generator.setDefaultPolicy(options.level || 'moderate');

    // Configurar monitor
    this.monitor.config = {
      ...this.monitor.config,
      ...options.monitoring,
    };

    // Configurar auto-ajuste
    if (this.autoAdjust) {
      this.setupAutoAdjustment();
    }

    // Aplicar política
    this.applyPolicy();
  }

  // Configurar auto-ajuste
  setupAutoAdjustment() {
    this.monitor.addListener(violation => {
      if (this.learningMode) {
        this.learnFromViolation(violation);
      }
    });

    // Revisar y ajustar cada 10 minutos
    setInterval(() => {
      this.reviewAndAdjust();
    }, 600000);
  }

  // Aprender de violación
  learnFromViolation(violation) {
    // Agregar fuente confiable si es repetitiva
    const recentViolations = this.monitor.getViolations({
      directive: violation.directive,
      blockedURI: violation.blockedURI,
      since: new Date(Date.now() - 3600000), // Última hora
    });

    if (recentViolations.length >= 5) {
      this.suggestTrustedSource(violation);
    }
  }

  // Sugerir fuente confiable
  suggestTrustedSource(violation) {
    const suggestion = {
      directive: violation.directive,
      source: this.extractDomain(violation.blockedURI),
      reason: 'Repeated violations',
      violationCount: this.monitor.getViolations({
        directive: violation.directive,
        blockedURI: violation.blockedURI,
      }).length,
    };

    console.log('💡 CSP Suggestion:', suggestion);

    // Auto-agregar si está en modo aprendizaje
    if (this.learningMode) {
      this.addTrustedSource(suggestion.directive, suggestion.source);
    }
  }

  // Extraer dominio
  extractDomain(uri) {
    try {
      const url = new URL(uri);
      return url.origin;
    } catch {
      return uri;
    }
  }

  // Agregar fuente confiable
  addTrustedSource(directive, source) {
    this.generator.addSource(directive, source);
    this.trustedSources.add(`${directive}:${source}`);
    this.applyPolicy();

    console.log(`✅ Added trusted source: ${directive} ${source}`);
  }

  // Revisar y ajustar política
  reviewAndAdjust() {
    const stats = this.monitor.generateStats();

    // Ajustar basado en violaciones frecuentes
    Object.entries(stats.violationsByDirective).forEach(
      ([directive, count]) => {
        if (count > 50) {
          // Umbral alto de violaciones
          console.log(`🔄 High violation count for ${directive}: ${count}`);
          this.relaxDirective(directive);
        }
      }
    );

    // Ajustar basado en URIs bloqueadas frecuentemente
    Object.entries(stats.topBlockedURIs).forEach(([uri, count]) => {
      if (count > 20) {
        console.log(`🔄 Frequently blocked URI: ${uri} (${count} times)`);
        this.analyzeBlockedURI(uri);
      }
    });
  }

  // Relajar directiva
  relaxDirective(directive) {
    switch (directive) {
      case 'script-src':
        if (!this.generator.policy[directive].includes("'unsafe-inline'")) {
          this.generator.addSource(directive, "'unsafe-inline'");
          console.log(`⚠️ Relaxed ${directive} to allow inline scripts`);
        }
        break;

      case 'style-src':
        if (!this.generator.policy[directive].includes("'unsafe-inline'")) {
          this.generator.addSource(directive, "'unsafe-inline'");
          console.log(`⚠️ Relaxed ${directive} to allow inline styles`);
        }
        break;
    }

    this.applyPolicy();
  }

  // Analizar URI bloqueada
  analyzeBlockedURI(uri) {
    const domain = this.extractDomain(uri);

    // Determinar directiva apropiada
    let directive = 'default-src';

    if (uri.includes('.js')) {
      directive = 'script-src';
    } else if (uri.includes('.css')) {
      directive = 'style-src';
    } else if (uri.match(/\.(jpg|jpeg|png|gif|svg|webp)$/)) {
      directive = 'img-src';
    }

    // Sugerir agregar dominio
    console.log(`💡 Consider adding ${domain} to ${directive}`);
  }

  // Aplicar política
  applyPolicy() {
    const header = this.generator.generateHeader();
    this.currentPolicy = header.value;

    // Aplicar via meta tag (solo para desarrollo)
    if (typeof document !== 'undefined') {
      this.updateMetaTag(header.value);
    }

    return header;
  }

  // Actualizar meta tag
  updateMetaTag(policy) {
    // Remover meta tag anterior
    const existingMeta = document.querySelector(
      'meta[http-equiv="Content-Security-Policy"]'
    );
    if (existingMeta) {
      existingMeta.remove();
    }

    // Agregar nuevo meta tag
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = policy;
    document.head.appendChild(meta);

    console.log('🔄 CSP Policy updated:', policy);
  }

  // Generar reporte
  generateReport() {
    return {
      currentPolicy: this.currentPolicy,
      trustedSources: Array.from(this.trustedSources),
      violations: this.monitor.generateStats(),
      settings: {
        autoAdjust: this.autoAdjust,
        learningMode: this.learningMode,
      },
      timestamp: new Date().toISOString(),
    };
  }

  // Exportar configuración
  exportConfig() {
    return {
      policy: this.generator.policy,
      trustedSources: Array.from(this.trustedSources),
      settings: {
        autoAdjust: this.autoAdjust,
        learningMode: this.learningMode,
      },
    };
  }

  // Importar configuración
  importConfig(config) {
    this.generator.policy = config.policy;
    this.trustedSources = new Set(config.trustedSources);
    this.autoAdjust = config.settings.autoAdjust;
    this.learningMode = config.settings.learningMode;

    this.applyPolicy();
  }
}

// ========================================
// 🎯 DESAFÍO: SISTEMA CSP AVANZADO
// ========================================

class AdvancedCSPSystem {
  constructor() {
    this.configurator = new DynamicCSPConfigurator();
    this.monitor = new CSPViolationMonitor();
    this.generator = new CSPPolicyGenerator();
    this.profiles = new Map();
    this.currentProfile = 'default';
    this.isInitialized = false;
  }

  // Inicializar sistema
  initialize(options = {}) {
    // Configurar perfil por defecto
    this.createProfile('default', {
      level: 'moderate',
      autoAdjust: false,
      learningMode: false,
    });

    // Configurar perfil de desarrollo
    this.createProfile('development', {
      level: 'basic',
      autoAdjust: true,
      learningMode: true,
    });

    // Configurar perfil de producción
    this.createProfile('production', {
      level: 'strict',
      autoAdjust: false,
      learningMode: false,
    });

    // Activar perfil
    this.activateProfile(options.profile || 'default');

    // Configurar monitor avanzado
    this.setupAdvancedMonitoring();

    this.isInitialized = true;
    console.log('🚀 Advanced CSP System initialized');
  }

  // Crear perfil
  createProfile(name, config) {
    this.profiles.set(name, {
      name: name,
      config: config,
      createdAt: new Date().toISOString(),
    });
  }

  // Activar perfil
  activateProfile(name) {
    if (!this.profiles.has(name)) {
      throw new Error(`Profile ${name} not found`);
    }

    this.currentProfile = name;
    const profile = this.profiles.get(name);

    this.configurator.setupDynamicPolicy(profile.config);

    console.log(`🔄 Activated CSP profile: ${name}`);
  }

  // Configurar monitoreo avanzado
  setupAdvancedMonitoring() {
    this.monitor.addListener(violation => {
      this.analyzeViolation(violation);
    });

    // Configurar alertas
    this.setupAlerts();
  }

  // Analizar violación
  analyzeViolation(violation) {
    const analysis = {
      severity: this.calculateSeverity(violation),
      category: this.categorizeViolation(violation),
      recommendation: this.generateRecommendation(violation),
      timestamp: new Date().toISOString(),
    };

    // Log análisis
    console.log('🔍 CSP Violation Analysis:', analysis);

    // Tomar acción basada en severidad
    if (analysis.severity === 'critical') {
      this.handleCriticalViolation(violation, analysis);
    }
  }

  // Calcular severidad
  calculateSeverity(violation) {
    if (violation.directive === 'script-src') {
      return 'high';
    }

    if (violation.directive === 'object-src') {
      return 'critical';
    }

    if (violation.blockedURI.includes('eval')) {
      return 'critical';
    }

    return 'medium';
  }

  // Categorizar violación
  categorizeViolation(violation) {
    if (violation.directive.includes('script')) {
      return 'script-injection';
    }

    if (violation.directive.includes('style')) {
      return 'style-injection';
    }

    if (violation.directive.includes('img')) {
      return 'resource-loading';
    }

    return 'other';
  }

  // Generar recomendación
  generateRecommendation(violation) {
    const recommendations = {
      'script-injection': 'Review and validate all script sources',
      'style-injection': 'Use external stylesheets instead of inline styles',
      'resource-loading':
        'Verify resource origins and add to whitelist if trusted',
    };

    const category = this.categorizeViolation(violation);
    return recommendations[category] || 'Review CSP policy for this directive';
  }

  // Manejar violación crítica
  handleCriticalViolation(violation, analysis) {
    console.error('🚨 CRITICAL CSP VIOLATION:', {
      violation: violation,
      analysis: analysis,
    });

    // Notificar sistemas de seguridad
    this.notifySecuritySystems(violation, analysis);
  }

  // Notificar sistemas de seguridad
  notifySecuritySystems(violation, analysis) {
    // Implementar integración con sistemas de monitoreo
    console.log('📢 Security notification sent');
  }

  // Configurar alertas
  setupAlerts() {
    setInterval(() => {
      const recentViolations = this.monitor.getViolations({
        since: new Date(Date.now() - 300000), // Últimos 5 minutos
      });

      if (recentViolations.length > 10) {
        console.warn('⚠️ High violation rate detected');
        this.handleHighViolationRate(recentViolations);
      }
    }, 300000); // Cada 5 minutos
  }

  // Manejar alta tasa de violaciones
  handleHighViolationRate(violations) {
    console.log('🔄 Adjusting CSP due to high violation rate');

    // Temporalmente relajar política
    this.activateProfile('development');

    // Restaurar después de 30 minutos
    setTimeout(() => {
      this.activateProfile('production');
    }, 1800000);
  }

  // Generar reporte completo
  generateComprehensiveReport() {
    return {
      system: {
        initialized: this.isInitialized,
        currentProfile: this.currentProfile,
        profiles: Array.from(this.profiles.keys()),
      },
      policy: this.configurator.generateReport(),
      violations: this.monitor.generateStats(),
      recommendations: this.generateRecommendations(),
      timestamp: new Date().toISOString(),
    };
  }

  // Generar recomendaciones
  generateRecommendations() {
    const stats = this.monitor.generateStats();
    const recommendations = [];

    // Recomendaciones basadas en violaciones
    if (stats.recentViolations > 50) {
      recommendations.push({
        type: 'policy',
        message: 'Consider relaxing CSP policy due to high violation rate',
        priority: 'high',
      });
    }

    // Recomendaciones basadas en directivas
    Object.entries(stats.violationsByDirective).forEach(
      ([directive, count]) => {
        if (count > 20) {
          recommendations.push({
            type: 'directive',
            message: `Review ${directive} sources - ${count} violations`,
            priority: 'medium',
          });
        }
      }
    );

    return recommendations;
  }
}

// ========================================
// 🧪 SISTEMA DE TESTING CSP
// ========================================

class CSPTestSuite {
  constructor() {
    this.results = [];
    this.testPolicies = {
      basic: "default-src 'self'; script-src 'self'",
      strict: "default-src 'none'; script-src 'self'; style-src 'self'",
      permissive: "default-src 'self' 'unsafe-inline' 'unsafe-eval'",
    };
  }

  // Test generación de política
  testPolicyGeneration() {
    const generator = new CSPPolicyGenerator();
    generator.setDefaultPolicy('strict');

    const header = generator.generateHeader();
    const passed =
      header.name === 'Content-Security-Policy' &&
      header.value.includes("default-src 'none'");

    this.results.push({
      test: 'Policy Generation',
      passed: passed,
      details: header,
    });
  }

  // Test generación de nonce
  testNonceGeneration() {
    const generator = new CSPPolicyGenerator();
    const nonce1 = generator.generateNonce();
    const nonce2 = generator.generateNonce();

    const passed = nonce1 !== nonce2 && nonce1.length > 0;

    this.results.push({
      test: 'Nonce Generation',
      passed: passed,
      details: { nonce1, nonce2 },
    });
  }

  // Test monitor de violaciones
  testViolationMonitor() {
    const monitor = new CSPViolationMonitor();

    // Simular violación
    const mockViolation = {
      violatedDirective: 'script-src',
      blockedURI: 'https://evil.com/script.js',
      documentURI: 'https://example.com/',
      sourceFile: 'https://example.com/app.js',
      lineNumber: 10,
      columnNumber: 5,
    };

    monitor.handleViolation(mockViolation);

    const violations = monitor.getViolations();
    const passed =
      violations.length === 1 && violations[0].directive === 'script-src';

    this.results.push({
      test: 'Violation Monitor',
      passed: passed,
      details: violations[0],
    });
  }

  // Test configurador dinámico
  testDynamicConfigurator() {
    const configurator = new DynamicCSPConfigurator();
    configurator.setupDynamicPolicy({ level: 'moderate' });

    const report = configurator.generateReport();
    const passed = report.currentPolicy && report.currentPolicy.length > 0;

    this.results.push({
      test: 'Dynamic Configurator',
      passed: passed,
      details: report,
    });
  }

  // Ejecutar todos los tests
  runAllTests() {
    this.results = [];

    this.testPolicyGeneration();
    this.testNonceGeneration();
    this.testViolationMonitor();
    this.testDynamicConfigurator();

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

// Inicializar sistema CSP avanzado
const cspSystem = new AdvancedCSPSystem();

// Configurar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  cspSystem.initialize({
    profile: 'development', // Cambiar a 'production' para producción
  });
});

// Ejemplo de uso manual
const generator = new CSPPolicyGenerator();
generator.setDefaultPolicy('strict');
generator.addSource('script-src', 'https://cdn.example.com');
const header = generator.generateHeader();
console.log('CSP Header:', header);

// Configurar monitor
const monitor = new CSPViolationMonitor();
monitor.addListener(violation => {
  console.log('Nueva violación CSP:', violation);
});

// Ejecutar tests
const testSuite = new CSPTestSuite();
const testReport = testSuite.runAllTests();
console.log('Reporte de tests CSP:', testReport);

// ========================================
// 📝 TAREAS PARA COMPLETAR
// ========================================

/**
 * TODO: Implementar las siguientes funcionalidades:
 *
 * 1. Integración con frameworks populares (React, Vue, Angular)
 * 2. Sistema de plantillas CSP para diferentes tipos de aplicaciones
 * 3. Herramienta de análisis de compatibilidad de navegadores
 * 4. Sistema de rotación automática de nonces
 * 5. Dashboard web para gestión de políticas CSP
 * 6. Integración con sistemas de CI/CD
 * 7. Análisis de rendimiento con CSP habilitado
 * 8. Sistema de backup y restauración de políticas
 * 9. Alertas en tiempo real para violaciones críticas
 * 10. Machine learning para optimización automática de políticas
 */

console.log('🔐 Sistema CSP Avanzado - Cargado y Listo');
