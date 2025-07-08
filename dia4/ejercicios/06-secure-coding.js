/**
 * 🛡️ DÍA 4 - EJERCICIO 6: CODING SEGURO (Secure Coding Practices)
 *
 * Objetivos:
 * - Implementar prácticas de codificación segura
 * - Prevenir vulnerabilidades comunes
 * - Validar entrada y salida de datos
 * - Implementar autenticación y autorización
 * - Manejar errores de forma segura
 *
 * Competencias WorldSkills:
 * - Desarrollo seguro de aplicaciones
 * - Prevención de vulnerabilidades OWASP
 * - Validación y sanitización de datos
 * - Gestión segura de sesiones
 */

// ========================================
// 📚 TEORÍA: PRINCIPIOS DE CODIFICACIÓN SEGURA
// ========================================

/**
 * PRINCIPIOS FUNDAMENTALES:
 *
 * 1. DEFENSA EN PROFUNDIDAD (Defense in Depth)
 * - Múltiples capas de seguridad
 * - Redundancia de controles
 * - Fallos seguros
 *
 * 2. PRINCIPIO DE MENOR PRIVILEGIO
 * - Acceso mínimo necesario
 * - Elevación temporal de privilegios
 * - Separación de responsabilidades
 *
 * 3. VALIDACIÓN DE ENTRADA
 * - Whitelist sobre blacklist
 * - Validación en cliente y servidor
 * - Sanitización de datos
 *
 * 4. FAIL SECURE
 * - Fallos seguros por defecto
 * - Manejo explícito de errores
 * - No exposición de información sensible
 *
 * 5. NO CONFIAR EN DATOS EXTERNOS
 * - Validar todos los inputs
 * - Verificar autenticidad
 * - Codificar/escapar outputs
 *
 * VULNERABILIDADES OWASP TOP 10:
 * 1. Injection (SQL, NoSQL, OS, LDAP)
 * 2. Broken Authentication
 * 3. Sensitive Data Exposure
 * 4. XML External Entities (XXE)
 * 5. Broken Access Control
 * 6. Security Misconfiguration
 * 7. Cross-Site Scripting (XSS)
 * 8. Insecure Deserialization
 * 9. Using Components with Known Vulnerabilities
 * 10. Insufficient Logging & Monitoring
 */

// ========================================
// 🔐 VALIDADOR DE ENTRADA SEGURO
// ========================================

class SecureInputValidator {
  constructor() {
    this.patterns = {
      email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      phone: /^\+?[\d\s\-\(\)]{7,15}$/,
      url: /^https?:\/\/([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
      alphanumeric: /^[a-zA-Z0-9]+$/,
      password:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      sqlInjection:
        /(\b(ALTER|CREATE|DELETE|DROP|EXEC(UTE)?|INSERT|SELECT|UNION|UPDATE)\b)|('|(\\\\)?;)|(--|\*\/)/gi,
      xss: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      path: /^[a-zA-Z0-9\._\-\/]+$/,
      filename: /^[a-zA-Z0-9\._\-]+$/,
      hexColor: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
      ipAddress:
        /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    };

    this.maxLengths = {
      email: 254,
      password: 128,
      username: 50,
      name: 100,
      description: 1000,
      url: 2048,
      phone: 20,
    };

    this.blacklistedKeywords = [
      'script',
      'javascript',
      'vbscript',
      'onload',
      'onerror',
      'onclick',
      'eval',
      'document.cookie',
      'window.location',
      'alert',
      'confirm',
      'prompt',
      'setTimeout',
      'setInterval',
      'Function',
      'constructor',
    ];
  }

  // Validar entrada principal
  validateInput(input, type, options = {}) {
    const validation = {
      isValid: true,
      errors: [],
      sanitized: input,
      warnings: [],
    };

    // Verificar si es requerido
    if (options.required && this.isEmpty(input)) {
      validation.isValid = false;
      validation.errors.push('Campo requerido');
      return validation;
    }

    // Si está vacío y no es requerido, es válido
    if (this.isEmpty(input) && !options.required) {
      return validation;
    }

    // Validar longitud
    if (!this.validateLength(input, type, options)) {
      validation.isValid = false;
      validation.errors.push(`Longitud inválida para ${type}`);
    }

    // Validar patrón
    if (!this.validatePattern(input, type)) {
      validation.isValid = false;
      validation.errors.push(`Formato inválido para ${type}`);
    }

    // Detectar inyección SQL
    if (this.detectSQLInjection(input)) {
      validation.isValid = false;
      validation.errors.push('Posible intento de inyección SQL');
    }

    // Detectar XSS
    if (this.detectXSS(input)) {
      validation.isValid = false;
      validation.errors.push('Posible intento de XSS');
    }

    // Detectar palabras clave peligrosas
    const dangerousKeywords = this.detectDangerousKeywords(input);
    if (dangerousKeywords.length > 0) {
      validation.warnings.push(
        `Palabras clave sospechosas: ${dangerousKeywords.join(', ')}`
      );
    }

    // Sanitizar entrada
    validation.sanitized = this.sanitizeInput(input, type);

    return validation;
  }

  // Verificar si está vacío
  isEmpty(input) {
    return !input || input.toString().trim().length === 0;
  }

  // Validar longitud
  validateLength(input, type, options) {
    const maxLength = options.maxLength || this.maxLengths[type] || 255;
    const minLength = options.minLength || 0;
    const length = input.toString().length;

    return length >= minLength && length <= maxLength;
  }

  // Validar patrón
  validatePattern(input, type) {
    const pattern = this.patterns[type];
    if (!pattern) return true;

    return pattern.test(input);
  }

  // Detectar inyección SQL
  detectSQLInjection(input) {
    return this.patterns.sqlInjection.test(input);
  }

  // Detectar XSS
  detectXSS(input) {
    return this.patterns.xss.test(input);
  }

  // Detectar palabras clave peligrosas
  detectDangerousKeywords(input) {
    const inputLower = input.toLowerCase();
    return this.blacklistedKeywords.filter(keyword =>
      inputLower.includes(keyword.toLowerCase())
    );
  }

  // Sanitizar entrada
  sanitizeInput(input, type) {
    let sanitized = input.toString();

    // Eliminar caracteres de control
    sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '');

    // Trim whitespace
    sanitized = sanitized.trim();

    // Escapar caracteres especiales según tipo
    switch (type) {
      case 'html':
        sanitized = this.escapeHtml(sanitized);
        break;
      case 'sql':
        sanitized = this.escapeSql(sanitized);
        break;
      case 'javascript':
        sanitized = this.escapeJavaScript(sanitized);
        break;
      case 'css':
        sanitized = this.escapeCss(sanitized);
        break;
      case 'url':
        sanitized = encodeURIComponent(sanitized);
        break;
      default:
        sanitized = this.escapeHtml(sanitized);
    }

    return sanitized;
  }

  // Escapar HTML
  escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;',
    };

    return text.replace(/[&<>"'/]/g, match => map[match]);
  }

  // Escapar SQL
  escapeSql(text) {
    return text.replace(/'/g, "''");
  }

  // Escapar JavaScript
  escapeJavaScript(text) {
    return text
      .replace(/[\\'"]/g, '\\$&')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t');
  }

  // Escapar CSS
  escapeCss(text) {
    return text.replace(/[<>"']/g, '\\$&');
  }

  // Validar múltiples campos
  validateMultiple(data, schema) {
    const results = {};
    let isValid = true;

    Object.keys(schema).forEach(field => {
      const fieldSchema = schema[field];
      const value = data[field];

      const validation = this.validateInput(
        value,
        fieldSchema.type,
        fieldSchema.options || {}
      );

      results[field] = validation;

      if (!validation.isValid) {
        isValid = false;
      }
    });

    return {
      isValid: isValid,
      fields: results,
      sanitized: this.extractSanitizedData(results),
    };
  }

  // Extraer datos sanitizados
  extractSanitizedData(results) {
    const sanitized = {};

    Object.keys(results).forEach(field => {
      sanitized[field] = results[field].sanitized;
    });

    return sanitized;
  }

  // Validar archivo subido
  validateFileUpload(file, options = {}) {
    const validation = {
      isValid: true,
      errors: [],
      warnings: [],
    };

    // Validar tipo de archivo
    if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
      validation.isValid = false;
      validation.errors.push('Tipo de archivo no permitido');
    }

    // Validar tamaño
    if (options.maxSize && file.size > options.maxSize) {
      validation.isValid = false;
      validation.errors.push(
        `Archivo muy grande (máximo: ${options.maxSize} bytes)`
      );
    }

    // Validar extensión
    if (options.allowedExtensions) {
      const extension = file.name.split('.').pop().toLowerCase();
      if (!options.allowedExtensions.includes(extension)) {
        validation.isValid = false;
        validation.errors.push('Extensión de archivo no permitida');
      }
    }

    // Validar nombre de archivo
    if (!this.patterns.filename.test(file.name)) {
      validation.isValid = false;
      validation.errors.push('Nombre de archivo inválido');
    }

    return validation;
  }

  // Generar token de validación
  generateValidationToken(data) {
    const timestamp = Date.now();
    const dataHash = this.hashData(JSON.stringify(data));
    const token = `${timestamp}.${dataHash}`;

    return btoa(token);
  }

  // Validar token de validación
  validateToken(token, data, maxAge = 3600000) {
    // 1 hora
    try {
      const decoded = atob(token);
      const [timestamp, hash] = decoded.split('.');

      const age = Date.now() - parseInt(timestamp);
      if (age > maxAge) {
        return { valid: false, error: 'Token expirado' };
      }

      const expectedHash = this.hashData(JSON.stringify(data));
      if (hash !== expectedHash) {
        return { valid: false, error: 'Token inválido' };
      }

      return { valid: true };
    } catch (error) {
      return { valid: false, error: 'Token corrupto' };
    }
  }

  // Hash de datos
  hashData(data) {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }
}

// ========================================
// 🔒 GESTOR DE AUTENTICACIÓN SEGURA
// ========================================

class SecureAuthManager {
  constructor() {
    this.sessions = new Map();
    this.failedAttempts = new Map();
    this.config = {
      maxFailedAttempts: 5,
      lockoutTime: 900000, // 15 minutos
      sessionTimeout: 1800000, // 30 minutos
      tokenExpiry: 3600000, // 1 hora
      passwordMinLength: 8,
      requireMFA: false,
    };

    this.tokenSecret = this.generateSecret();
  }

  // Generar secreto
  generateSecret() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join(
      ''
    );
  }

  // Registrar usuario
  async registerUser(userData) {
    const validator = new SecureInputValidator();

    // Validar datos de entrada
    const validation = validator.validateMultiple(userData, {
      username: {
        type: 'alphanumeric',
        options: { required: true, minLength: 3, maxLength: 50 },
      },
      email: { type: 'email', options: { required: true } },
      password: { type: 'password', options: { required: true } },
      confirmPassword: { type: 'password', options: { required: true } },
    });

    if (!validation.isValid) {
      return {
        success: false,
        errors: validation.fields,
        message: 'Datos de registro inválidos',
      };
    }

    // Verificar que las contraseñas coincidan
    if (userData.password !== userData.confirmPassword) {
      return {
        success: false,
        message: 'Las contraseñas no coinciden',
      };
    }

    // Verificar fortaleza de contraseña
    const passwordStrength = this.checkPasswordStrength(userData.password);
    if (passwordStrength.score < 3) {
      return {
        success: false,
        message: 'Contraseña muy débil',
        suggestions: passwordStrength.suggestions,
      };
    }

    // Hash de contraseña
    const hashedPassword = await this.hashPassword(userData.password);

    // Crear usuario
    const user = {
      id: this.generateUserId(),
      username: validation.sanitized.username,
      email: validation.sanitized.email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      isActive: true,
      lastLogin: null,
      failedAttempts: 0,
      isLocked: false,
    };

    return {
      success: true,
      user: user,
      message: 'Usuario registrado exitosamente',
    };
  }

  // Autenticar usuario
  async authenticateUser(username, password) {
    // Verificar bloqueo por intentos fallidos
    const lockStatus = this.checkLockStatus(username);
    if (lockStatus.isLocked) {
      return {
        success: false,
        message: `Usuario bloqueado. Intente en ${lockStatus.remainingTime} minutos`,
      };
    }

    // Simular búsqueda de usuario (en producción sería desde BD)
    const user = this.findUser(username);
    if (!user) {
      this.recordFailedAttempt(username);
      return {
        success: false,
        message: 'Credenciales inválidas',
      };
    }

    // Verificar contraseña
    const isPasswordValid = await this.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      this.recordFailedAttempt(username);
      return {
        success: false,
        message: 'Credenciales inválidas',
      };
    }

    // Limpiar intentos fallidos
    this.clearFailedAttempts(username);

    // Crear sesión
    const session = this.createSession(user);

    return {
      success: true,
      user: user,
      session: session,
      token: this.generateAuthToken(user),
      message: 'Autenticación exitosa',
    };
  }

  // Verificar estado de bloqueo
  checkLockStatus(username) {
    const attempts = this.failedAttempts.get(username);
    if (!attempts) {
      return { isLocked: false };
    }

    const now = Date.now();
    const timeSinceLastAttempt = now - attempts.lastAttempt;

    if (attempts.count >= this.config.maxFailedAttempts) {
      if (timeSinceLastAttempt < this.config.lockoutTime) {
        return {
          isLocked: true,
          remainingTime: Math.ceil(
            (this.config.lockoutTime - timeSinceLastAttempt) / 60000
          ),
        };
      } else {
        // Resetear intentos si ha pasado el tiempo de bloqueo
        this.failedAttempts.delete(username);
        return { isLocked: false };
      }
    }

    return { isLocked: false };
  }

  // Registrar intento fallido
  recordFailedAttempt(username) {
    const attempts = this.failedAttempts.get(username) || {
      count: 0,
      lastAttempt: 0,
    };

    attempts.count++;
    attempts.lastAttempt = Date.now();

    this.failedAttempts.set(username, attempts);
  }

  // Limpiar intentos fallidos
  clearFailedAttempts(username) {
    this.failedAttempts.delete(username);
  }

  // Verificar fortaleza de contraseña
  checkPasswordStrength(password) {
    const strength = {
      score: 0,
      suggestions: [],
    };

    // Longitud mínima
    if (password.length >= 8) strength.score++;
    else strength.suggestions.push('Use al menos 8 caracteres');

    // Minúsculas
    if (/[a-z]/.test(password)) strength.score++;
    else strength.suggestions.push('Incluya letras minúsculas');

    // Mayúsculas
    if (/[A-Z]/.test(password)) strength.score++;
    else strength.suggestions.push('Incluya letras mayúsculas');

    // Números
    if (/\d/.test(password)) strength.score++;
    else strength.suggestions.push('Incluya números');

    // Caracteres especiales
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength.score++;
    else strength.suggestions.push('Incluya caracteres especiales');

    return strength;
  }

  // Hash de contraseña
  async hashPassword(password) {
    // Simulación de hash seguro (en producción usar bcrypt)
    const salt = this.generateSalt();
    const hash = await this.pbkdf2(password, salt, 100000, 32);
    return `${salt}:${hash}`;
  }

  // Verificar contraseña
  async verifyPassword(password, hashedPassword) {
    const [salt, hash] = hashedPassword.split(':');
    const computedHash = await this.pbkdf2(password, salt, 100000, 32);
    return computedHash === hash;
  }

  // Generar sal
  generateSalt() {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join(
      ''
    );
  }

  // PBKDF2 (simulación)
  async pbkdf2(password, salt, iterations, keyLength) {
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password + salt);

    let hash = passwordBuffer;
    for (let i = 0; i < iterations; i++) {
      hash = await crypto.subtle.digest('SHA-256', hash);
    }

    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
      .substring(0, keyLength);
  }

  // Crear sesión
  createSession(user) {
    const sessionId = this.generateSessionId();
    const session = {
      id: sessionId,
      userId: user.id,
      username: user.username,
      createdAt: Date.now(),
      lastActivity: Date.now(),
      ipAddress: this.getClientIP(),
      userAgent: this.getUserAgent(),
      isActive: true,
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  // Generar ID de sesión
  generateSessionId() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join(
      ''
    );
  }

  // Generar token de autenticación
  generateAuthToken(user) {
    const header = {
      alg: 'HS256',
      typ: 'JWT',
    };

    const payload = {
      sub: user.id,
      username: user.username,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor((Date.now() + this.config.tokenExpiry) / 1000),
    };

    const encodedHeader = btoa(JSON.stringify(header));
    const encodedPayload = btoa(JSON.stringify(payload));
    const signature = this.signToken(`${encodedHeader}.${encodedPayload}`);

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  // Firmar token
  signToken(data) {
    const signature = this.hmacSHA256(data, this.tokenSecret);
    return btoa(signature);
  }

  // HMAC SHA256 (simulación)
  hmacSHA256(data, secret) {
    return secret + data; // Simulación simple
  }

  // Validar token
  validateToken(token) {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return { valid: false, error: 'Token inválido' };
      }

      const [header, payload, signature] = parts;
      const expectedSignature = this.signToken(`${header}.${payload}`);

      if (signature !== expectedSignature) {
        return { valid: false, error: 'Firma inválida' };
      }

      const decodedPayload = JSON.parse(atob(payload));
      const now = Math.floor(Date.now() / 1000);

      if (decodedPayload.exp < now) {
        return { valid: false, error: 'Token expirado' };
      }

      return { valid: true, payload: decodedPayload };
    } catch (error) {
      return { valid: false, error: 'Token corrupto' };
    }
  }

  // Validar sesión
  validateSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return { valid: false, error: 'Sesión no encontrada' };
    }

    const now = Date.now();
    if (now - session.lastActivity > this.config.sessionTimeout) {
      this.sessions.delete(sessionId);
      return { valid: false, error: 'Sesión expirada' };
    }

    // Actualizar última actividad
    session.lastActivity = now;
    return { valid: true, session: session };
  }

  // Cerrar sesión
  logout(sessionId) {
    const session = this.sessions.get(sessionId);
    if (session) {
      this.sessions.delete(sessionId);
      return { success: true, message: 'Sesión cerrada exitosamente' };
    }
    return { success: false, message: 'Sesión no encontrada' };
  }

  // Obtener IP del cliente (simulación)
  getClientIP() {
    return '127.0.0.1';
  }

  // Obtener User Agent (simulación)
  getUserAgent() {
    return typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown';
  }

  // Buscar usuario (simulación)
  findUser(username) {
    // En producción sería consulta a base de datos
    return null;
  }

  // Generar ID de usuario
  generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Limpiar sesiones expiradas
  cleanupExpiredSessions() {
    const now = Date.now();
    let cleaned = 0;

    for (const [sessionId, session] of this.sessions) {
      if (now - session.lastActivity > this.config.sessionTimeout) {
        this.sessions.delete(sessionId);
        cleaned++;
      }
    }

    return cleaned;
  }
}

// ========================================
// 🔐 GESTOR DE AUTORIZACIÓN
// ========================================

class SecureAuthorizationManager {
  constructor() {
    this.roles = new Map();
    this.permissions = new Map();
    this.userRoles = new Map();
    this.resources = new Map();

    this.initializeDefaultRoles();
  }

  // Inicializar roles por defecto
  initializeDefaultRoles() {
    this.createRole('admin', 'Administrador', ['*']);
    this.createRole('user', 'Usuario', [
      'read',
      'create_own',
      'update_own',
      'delete_own',
    ]);
    this.createRole('guest', 'Invitado', ['read_public']);
    this.createRole('moderator', 'Moderador', [
      'read',
      'create',
      'update',
      'delete_reported',
    ]);
  }

  // Crear rol
  createRole(name, description, permissions) {
    this.roles.set(name, {
      name: name,
      description: description,
      permissions: permissions,
      createdAt: new Date().toISOString(),
    });
  }

  // Asignar rol a usuario
  assignRole(userId, roleName) {
    if (!this.roles.has(roleName)) {
      return { success: false, message: 'Rol no encontrado' };
    }

    const userRoles = this.userRoles.get(userId) || [];
    if (!userRoles.includes(roleName)) {
      userRoles.push(roleName);
      this.userRoles.set(userId, userRoles);
    }

    return { success: true, message: 'Rol asignado exitosamente' };
  }

  // Verificar permiso
  checkPermission(userId, permission, resource = null) {
    const userRoles = this.userRoles.get(userId) || [];

    // Verificar cada rol del usuario
    for (const roleName of userRoles) {
      const role = this.roles.get(roleName);
      if (!role) continue;

      // Verificar permiso general
      if (
        role.permissions.includes('*') ||
        role.permissions.includes(permission)
      ) {
        return { allowed: true, reason: `Permitted by role: ${roleName}` };
      }

      // Verificar permiso específico del recurso
      if (
        resource &&
        this.checkResourcePermission(userId, permission, resource, role)
      ) {
        return {
          allowed: true,
          reason: `Permitted by resource access: ${roleName}`,
        };
      }
    }

    return { allowed: false, reason: 'Insufficient permissions' };
  }

  // Verificar permiso de recurso
  checkResourcePermission(userId, permission, resource, role) {
    // Verificar permisos de "propio" (own)
    if (permission.endsWith('_own')) {
      const basePermission = permission.replace('_own', '');
      if (role.permissions.includes(basePermission + '_own')) {
        return resource.ownerId === userId;
      }
    }

    // Verificar permisos públicos
    if (permission === 'read_public') {
      return resource.isPublic === true;
    }

    return false;
  }

  // Middleware de autorización
  requirePermission(permission, resourceKey = null) {
    return (req, res, next) => {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
      }

      let resource = null;
      if (resourceKey && req.params[resourceKey]) {
        resource = this.resources.get(req.params[resourceKey]);
      }

      const authResult = this.checkPermission(userId, permission, resource);
      if (!authResult.allowed) {
        return res.status(403).json({
          error: 'Acceso denegado',
          reason: authResult.reason,
        });
      }

      next();
    };
  }

  // Crear recurso
  createResource(id, data) {
    this.resources.set(id, {
      id: id,
      ownerId: data.ownerId,
      isPublic: data.isPublic || false,
      createdAt: new Date().toISOString(),
      ...data,
    });
  }

  // Obtener roles de usuario
  getUserRoles(userId) {
    return this.userRoles.get(userId) || [];
  }

  // Obtener permisos de usuario
  getUserPermissions(userId) {
    const userRoles = this.getUserRoles(userId);
    const permissions = new Set();

    userRoles.forEach(roleName => {
      const role = this.roles.get(roleName);
      if (role) {
        role.permissions.forEach(permission => {
          permissions.add(permission);
        });
      }
    });

    return Array.from(permissions);
  }

  // Verificar múltiples permisos
  checkMultiplePermissions(userId, permissions) {
    const results = {};

    permissions.forEach(permission => {
      results[permission] = this.checkPermission(userId, permission);
    });

    return results;
  }

  // Auditar acceso
  auditAccess(userId, action, resource, result) {
    const audit = {
      userId: userId,
      action: action,
      resource: resource,
      result: result,
      timestamp: new Date().toISOString(),
      userAgent: this.getUserAgent(),
      ipAddress: this.getClientIP(),
    };

    // En producción: guardar en base de datos
    console.log('🔍 Access Audit:', audit);
  }

  // Obtener User Agent
  getUserAgent() {
    return typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown';
  }

  // Obtener IP del cliente
  getClientIP() {
    return '127.0.0.1';
  }
}

// ========================================
// 🛡️ MANEJO SEGURO DE ERRORES
// ========================================

class SecureErrorHandler {
  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.errorLog = [];
    this.sensitivePatterns = [
      /password/gi,
      /token/gi,
      /secret/gi,
      /key/gi,
      /credential/gi,
      /auth/gi,
      /session/gi,
    ];
  }

  // Manejar error de forma segura
  handleError(error, context = {}) {
    const errorInfo = {
      id: this.generateErrorId(),
      timestamp: new Date().toISOString(),
      message: error.message,
      stack: error.stack,
      context: context,
      type: error.constructor.name,
    };

    // Log completo en desarrollo
    if (this.isDevelopment) {
      console.error('🚨 Error:', errorInfo);
    }

    // Log sanitizado en producción
    const sanitizedError = this.sanitizeError(errorInfo);
    this.logError(sanitizedError);

    return {
      id: errorInfo.id,
      message: this.getUserFriendlyMessage(error),
      timestamp: errorInfo.timestamp,
    };
  }

  // Sanitizar error
  sanitizeError(errorInfo) {
    const sanitized = { ...errorInfo };

    // Remover stack trace en producción
    if (!this.isDevelopment) {
      delete sanitized.stack;
    }

    // Sanitizar contexto
    if (sanitized.context) {
      sanitized.context = this.sanitizeContext(sanitized.context);
    }

    return sanitized;
  }

  // Sanitizar contexto
  sanitizeContext(context) {
    const sanitized = {};

    Object.keys(context).forEach(key => {
      const value = context[key];

      // Verificar si la clave es sensible
      const isSensitive = this.sensitivePatterns.some(pattern =>
        pattern.test(key)
      );

      if (isSensitive) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'string') {
        sanitized[key] = this.sanitizeString(value);
      } else {
        sanitized[key] = value;
      }
    });

    return sanitized;
  }

  // Sanitizar string
  sanitizeString(str) {
    // Remover información sensible
    let sanitized = str;

    this.sensitivePatterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '[REDACTED]');
    });

    return sanitized;
  }

  // Obtener mensaje amigable
  getUserFriendlyMessage(error) {
    const friendlyMessages = {
      ValidationError: 'Los datos proporcionados son inválidos',
      UnauthorizedError: 'No tiene permisos para realizar esta acción',
      NotFoundError: 'El recurso solicitado no fue encontrado',
      RateLimitError: 'Demasiadas peticiones. Intente más tarde',
      DatabaseError: 'Error interno del servidor',
      NetworkError: 'Error de conexión. Intente más tarde',
    };

    return (
      friendlyMessages[error.constructor.name] ||
      'Ha ocurrido un error. Intente más tarde'
    );
  }

  // Generar ID de error
  generateErrorId() {
    return 'ERR_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Log de error
  logError(error) {
    this.errorLog.push(error);

    // Mantener solo últimos 1000 errores
    if (this.errorLog.length > 1000) {
      this.errorLog.shift();
    }

    // En producción: enviar a servicio de logging
    if (!this.isDevelopment) {
      this.sendToLoggingService(error);
    }
  }

  // Enviar a servicio de logging
  sendToLoggingService(error) {
    // Implementar integración con servicio de logging
    console.log('📝 Error logged to service:', error.id);
  }

  // Obtener estadísticas de errores
  getErrorStats() {
    const stats = {
      total: this.errorLog.length,
      byType: {},
      recent: 0,
    };

    const hourAgo = Date.now() - 3600000;

    this.errorLog.forEach(error => {
      // Por tipo
      const type = error.type || 'Unknown';
      stats.byType[type] = (stats.byType[type] || 0) + 1;

      // Recientes
      if (new Date(error.timestamp).getTime() > hourAgo) {
        stats.recent++;
      }
    });

    return stats;
  }
}

// ========================================
// 🚀 EJEMPLO DE USO
// ========================================

// Inicializar sistemas de seguridad
const inputValidator = new SecureInputValidator();
const authManager = new SecureAuthManager();
const authzManager = new SecureAuthorizationManager();
const errorHandler = new SecureErrorHandler();

// Ejemplo de validación
const userData = {
  username: 'john_doe',
  email: 'john@example.com',
  password: 'SecurePass123!',
  confirmPassword: 'SecurePass123!',
};

const validation = inputValidator.validateMultiple(userData, {
  username: { type: 'alphanumeric', options: { required: true } },
  email: { type: 'email', options: { required: true } },
  password: { type: 'password', options: { required: true } },
});

console.log('Validación:', validation);

// Ejemplo de registro
authManager.registerUser(userData).then(result => {
  console.log('Registro:', result);
});

// Ejemplo de autorización
authzManager.assignRole('user123', 'user');
const permission = authzManager.checkPermission('user123', 'read');
console.log('Permiso:', permission);

// Ejemplo de manejo de errores
try {
  throw new Error('Test error');
} catch (error) {
  const handled = errorHandler.handleError(error, { user: 'john_doe' });
  console.log('Error manejado:', handled);
}

// ========================================
// 📝 TAREAS PARA COMPLETAR
// ========================================

/**
 * TODO: Implementar las siguientes funcionalidades:
 *
 * 1. Sistema de rate limiting por IP y usuario
 * 2. Implementar 2FA (autenticación de dos factores)
 * 3. Sistema de auditoría completo
 * 4. Integración con OAuth 2.0 y OpenID Connect
 * 5. Sistema de recuperación de contraseña seguro
 * 6. Implementar session hijacking protection
 * 7. Sistema de detección de fraude
 * 8. Implementar password rotation policies
 * 9. Sistema de alertas de seguridad en tiempo real
 * 10. Implementar secure headers middleware
 */

console.log('🛡️ Sistema de Codificación Segura - Cargado y Listo');
