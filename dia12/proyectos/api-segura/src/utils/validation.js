// utils/validation.js
// Utilidades de validación y sanitización

const validator = require('validator');
const DOMPurify = require('isomorphic-dompurify');

/**
 * Utilidades de validación
 * - Validación de email
 * - Validación de contraseñas
 * - Sanitización de entrada
 * - Validación de datos de productos
 * - Validación de tipos de datos
 */

/**
 * Validar formato de email
 * @param {string} email - Email a validar
 * @returns {boolean} - True si el email es válido
 */
const validateEmail = email => {
  if (!email || typeof email !== 'string') {
    return false;
  }

  return validator.isEmail(email);
};

/**
 * Validar fortaleza de contraseña
 * @param {string} password - Contraseña a validar
 * @returns {Object} - Resultado de validación con detalles
 */
const validatePassword = password => {
  if (!password || typeof password !== 'string') {
    return {
      isValid: false,
      errors: ['Contraseña es requerida'],
      requirements: getPasswordRequirements(),
    };
  }

  const errors = [];
  const requirements = getPasswordRequirements();

  // Longitud mínima
  if (password.length < 8) {
    errors.push('Debe tener al menos 8 caracteres');
  }

  // Longitud máxima
  if (password.length > 128) {
    errors.push('No puede exceder 128 caracteres');
  }

  // Al menos una minúscula
  if (!/[a-z]/.test(password)) {
    errors.push('Debe contener al menos una letra minúscula');
  }

  // Al menos una mayúscula
  if (!/[A-Z]/.test(password)) {
    errors.push('Debe contener al menos una letra mayúscula');
  }

  // Al menos un número
  if (!/\d/.test(password)) {
    errors.push('Debe contener al menos un número');
  }

  // Al menos un carácter especial
  if (!/[@$!%*?&]/.test(password)) {
    errors.push('Debe contener al menos un carácter especial (@$!%*?&)');
  }

  // No debe contener espacios
  if (/\s/.test(password)) {
    errors.push('No puede contener espacios');
  }

  // Verificar patrones comunes débiles
  const commonPatterns = [
    /(.)\1{2,}/, // Caracteres repetidos
    /123456/, // Secuencias numéricas
    /abcdef/, // Secuencias alfabéticas
    /password/i, // Palabra "password"
    /qwerty/i, // Teclado QWERTY
  ];

  commonPatterns.forEach(pattern => {
    if (pattern.test(password)) {
      errors.push('No debe contener patrones comunes o predecibles');
    }
  });

  return {
    isValid: errors.length === 0,
    errors: errors,
    requirements: requirements,
    strength: calculatePasswordStrength(password),
  };
};

/**
 * Obtener requisitos de contraseña
 * @returns {Object} - Requisitos de contraseña
 */
const getPasswordRequirements = () => {
  return {
    minLength: 8,
    maxLength: 128,
    requireLowercase: true,
    requireUppercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    allowedSpecialChars: '@$!%*?&',
    noSpaces: true,
    noCommonPatterns: true,
  };
};

/**
 * Calcular fortaleza de contraseña
 * @param {string} password - Contraseña a evaluar
 * @returns {string} - Nivel de fortaleza (weak, medium, strong)
 */
const calculatePasswordStrength = password => {
  if (!password) return 'weak';

  let score = 0;

  // Longitud
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;

  // Variedad de caracteres
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[@$!%*?&]/.test(password)) score += 1;

  // Complejidad adicional
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\?]/.test(password)) score += 1;

  if (score < 4) return 'weak';
  if (score < 7) return 'medium';
  return 'strong';
};

/**
 * Sanitizar entrada de usuario
 * @param {string} input - Texto a sanitizar
 * @returns {string} - Texto sanitizado
 */
const sanitizeInput = input => {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Remover caracteres peligrosos
  let sanitized = input.trim();

  // Escapar HTML
  sanitized = DOMPurify.sanitize(sanitized, { ALLOWED_TAGS: [] });

  // Escapar caracteres especiales para SQL
  sanitized = sanitized.replace(/['";\\]/g, '');

  // Remover caracteres de control
  sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '');

  return sanitized;
};

/**
 * Validar datos de producto
 * @param {Object} productData - Datos del producto
 * @param {boolean} isUpdate - Si es una actualización (campos opcionales)
 * @returns {Object} - Resultado de validación
 */
const validateProductData = (productData, isUpdate = false) => {
  const errors = [];
  const { name, description, price, category, stock } = productData;

  // Validar nombre
  if (!isUpdate || name !== undefined) {
    if (!name || typeof name !== 'string') {
      errors.push('Nombre es requerido y debe ser texto');
    } else if (name.length < 3) {
      errors.push('Nombre debe tener al menos 3 caracteres');
    } else if (name.length > 100) {
      errors.push('Nombre no puede exceder 100 caracteres');
    }
  }

  // Validar descripción
  if (description !== undefined && description !== null) {
    if (typeof description !== 'string') {
      errors.push('Descripción debe ser texto');
    } else if (description.length > 500) {
      errors.push('Descripción no puede exceder 500 caracteres');
    }
  }

  // Validar precio
  if (!isUpdate || price !== undefined) {
    if (!price || isNaN(price)) {
      errors.push('Precio es requerido y debe ser un número');
    } else if (parseFloat(price) <= 0) {
      errors.push('Precio debe ser mayor a 0');
    } else if (parseFloat(price) > 999999.99) {
      errors.push('Precio no puede exceder 999,999.99');
    }
  }

  // Validar categoría
  if (!isUpdate || category !== undefined) {
    if (!category || typeof category !== 'string') {
      errors.push('Categoría es requerida y debe ser texto');
    } else if (category.length < 3) {
      errors.push('Categoría debe tener al menos 3 caracteres');
    } else if (category.length > 50) {
      errors.push('Categoría no puede exceder 50 caracteres');
    }
  }

  // Validar stock
  if (stock !== undefined && stock !== null) {
    if (isNaN(stock)) {
      errors.push('Stock debe ser un número');
    } else if (parseInt(stock) < 0) {
      errors.push('Stock no puede ser negativo');
    } else if (parseInt(stock) > 999999) {
      errors.push('Stock no puede exceder 999,999');
    }
  }

  return {
    isValid: errors.length === 0,
    errors: errors,
  };
};

/**
 * Validar URL
 * @param {string} url - URL a validar
 * @returns {boolean} - True si la URL es válida
 */
const validateUrl = url => {
  if (!url || typeof url !== 'string') {
    return false;
  }

  return validator.isURL(url, {
    protocols: ['http', 'https'],
    require_protocol: true,
  });
};

/**
 * Validar número de teléfono
 * @param {string} phone - Número de teléfono a validar
 * @returns {boolean} - True si el teléfono es válido
 */
const validatePhone = phone => {
  if (!phone || typeof phone !== 'string') {
    return false;
  }

  // Patrón básico para números colombianos
  const phonePattern = /^(\+57|57)?[13]\d{9}$/;
  return phonePattern.test(phone.replace(/\s+/g, ''));
};

/**
 * Validar fecha
 * @param {string} date - Fecha a validar
 * @returns {boolean} - True si la fecha es válida
 */
const validateDate = date => {
  if (!date || typeof date !== 'string') {
    return false;
  }

  return validator.isISO8601(date);
};

/**
 * Validar rango de números
 * @param {number} value - Valor a validar
 * @param {number} min - Valor mínimo
 * @param {number} max - Valor máximo
 * @returns {boolean} - True si está en rango
 */
const validateRange = (value, min, max) => {
  if (typeof value !== 'number' || isNaN(value)) {
    return false;
  }

  return value >= min && value <= max;
};

/**
 * Validar que una cadena solo contenga caracteres permitidos
 * @param {string} str - Cadena a validar
 * @param {string} allowedChars - Caracteres permitidos (regex)
 * @returns {boolean} - True si solo contiene caracteres permitidos
 */
const validateCharacters = (str, allowedChars) => {
  if (!str || typeof str !== 'string') {
    return false;
  }

  const pattern = new RegExp(`^[${allowedChars}]+$`);
  return pattern.test(str);
};

/**
 * Validar longitud de cadena
 * @param {string} str - Cadena a validar
 * @param {number} min - Longitud mínima
 * @param {number} max - Longitud máxima
 * @returns {boolean} - True si está en el rango de longitud
 */
const validateLength = (str, min, max) => {
  if (!str || typeof str !== 'string') {
    return false;
  }

  return str.length >= min && str.length <= max;
};

/**
 * Validar formato de nombre de usuario
 * @param {string} username - Nombre de usuario a validar
 * @returns {Object} - Resultado de validación
 */
const validateUsername = username => {
  if (!username || typeof username !== 'string') {
    return {
      isValid: false,
      errors: ['Nombre de usuario es requerido'],
    };
  }

  const errors = [];

  // Longitud
  if (username.length < 3) {
    errors.push('Debe tener al menos 3 caracteres');
  }
  if (username.length > 30) {
    errors.push('No puede exceder 30 caracteres');
  }

  // Caracteres permitidos
  if (!/^[a-zA-Z0-9_.-]+$/.test(username)) {
    errors.push(
      'Solo puede contener letras, números, guiones, puntos y guiones bajos'
    );
  }

  // No puede empezar o terminar con caracteres especiales
  if (/^[_.-]|[_.-]$/.test(username)) {
    errors.push('No puede empezar o terminar con caracteres especiales');
  }

  // No puede contener caracteres especiales consecutivos
  if (/[_.-]{2,}/.test(username)) {
    errors.push('No puede contener caracteres especiales consecutivos');
  }

  return {
    isValid: errors.length === 0,
    errors: errors,
  };
};

/**
 * Normalizar texto para búsqueda
 * @param {string} text - Texto a normalizar
 * @returns {string} - Texto normalizado
 */
const normalizeForSearch = text => {
  if (!text || typeof text !== 'string') {
    return '';
  }

  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^\w\s]/g, '') // Remover caracteres especiales
    .trim();
};

module.exports = {
  validateEmail,
  validatePassword,
  validateProductData,
  validateUrl,
  validatePhone,
  validateDate,
  validateRange,
  validateCharacters,
  validateLength,
  validateUsername,
  sanitizeInput,
  normalizeForSearch,
  getPasswordRequirements,
  calculatePasswordStrength,
};
