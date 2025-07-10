// utils/helpers.js
// Funciones de ayuda generales

const crypto = require('crypto');

/**
 * Utilidades generales
 * - Generación de tokens
 * - Formateo de datos
 * - Funciones de tiempo
 * - Utilidades de cadenas
 */

/**
 * Generar token aleatorio
 * @param {number} length - Longitud del token
 * @returns {string} - Token aleatorio
 */
const generateRandomToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Generar hash SHA-256
 * @param {string} data - Datos a hashear
 * @returns {string} - Hash SHA-256
 */
const generateSHA256 = data => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

/**
 * Generar UUID v4
 * @returns {string} - UUID v4
 */
const generateUUID = () => {
  return crypto.randomUUID();
};

/**
 * Formatear precio en pesos colombianos
 * @param {number} amount - Monto a formatear
 * @returns {string} - Precio formateado
 */
const formatCurrency = amount => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Formatear fecha en formato colombiano
 * @param {Date|string} date - Fecha a formatear
 * @returns {string} - Fecha formateada
 */
const formatDate = date => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
};

/**
 * Formatear fecha relativa (hace X tiempo)
 * @param {Date|string} date - Fecha a formatear
 * @returns {string} - Fecha relativa
 */
const formatRelativeDate = date => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now - dateObj;

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return 'hace un momento';
  if (diffMinutes < 60)
    return `hace ${diffMinutes} minuto${diffMinutes > 1 ? 's' : ''}`;
  if (diffHours < 24)
    return `hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
  if (diffDays < 7) return `hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;

  return formatDate(dateObj);
};

/**
 * Capitalizar primera letra
 * @param {string} str - Cadena a capitalizar
 * @returns {string} - Cadena capitalizada
 */
const capitalize = str => {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Convertir a Title Case
 * @param {string} str - Cadena a convertir
 * @returns {string} - Cadena en Title Case
 */
const toTitleCase = str => {
  if (!str || typeof str !== 'string') return '';

  return str.replace(/\w\S*/g, txt => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

/**
 * Truncar texto
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Longitud máxima
 * @param {string} suffix - Sufijo (por defecto "...")
 * @returns {string} - Texto truncado
 */
const truncateText = (text, maxLength, suffix = '...') => {
  if (!text || typeof text !== 'string') return '';

  if (text.length <= maxLength) return text;

  return text.substring(0, maxLength - suffix.length) + suffix;
};

/**
 * Generar slug a partir de texto
 * @param {string} text - Texto a convertir
 * @returns {string} - Slug generado
 */
const generateSlug = text => {
  if (!text || typeof text !== 'string') return '';

  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z0-9\s-]/g, '') // Solo letras, números, espacios y guiones
    .trim()
    .replace(/\s+/g, '-') // Reemplazar espacios con guiones
    .replace(/-+/g, '-'); // Remover guiones múltiples
};

/**
 * Validar si es un objeto vacío
 * @param {Object} obj - Objeto a validar
 * @returns {boolean} - True si está vacío
 */
const isEmpty = obj => {
  if (obj === null || obj === undefined) return true;
  if (typeof obj === 'string' || Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return false;
};

/**
 * Deep clone de objeto
 * @param {Object} obj - Objeto a clonar
 * @returns {Object} - Objeto clonado
 */
const deepClone = obj => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const cloned = {};
    Object.keys(obj).forEach(key => {
      cloned[key] = deepClone(obj[key]);
    });
    return cloned;
  }
  return obj;
};

/**
 * Mezclar objetos (merge)
 * @param {Object} target - Objeto target
 * @param {...Object} sources - Objetos fuente
 * @returns {Object} - Objeto mezclado
 */
const merge = (target, ...sources) => {
  if (!sources.length) return target;
  const source = sources.shift();

  if (
    target &&
    source &&
    typeof target === 'object' &&
    typeof source === 'object'
  ) {
    Object.keys(source).forEach(key => {
      if (typeof source[key] === 'object' && !Array.isArray(source[key])) {
        if (!target[key]) target[key] = {};
        merge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    });
  }

  return merge(target, ...sources);
};

/**
 * Debounce function
 * @param {Function} func - Función a debounce
 * @param {number} delay - Delay en milisegundos
 * @returns {Function} - Función debounced
 */
const debounce = (func, delay) => {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

/**
 * Throttle function
 * @param {Function} func - Función a throttle
 * @param {number} delay - Delay en milisegundos
 * @returns {Function} - Función throttled
 */
const throttle = (func, delay) => {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      return func.apply(this, args);
    }
  };
};

/**
 * Generar número aleatorio en rango
 * @param {number} min - Valor mínimo
 * @param {number} max - Valor máximo
 * @returns {number} - Número aleatorio
 */
const randomInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Convertir bytes a formato legible
 * @param {number} bytes - Bytes a convertir
 * @param {number} decimals - Decimales a mostrar
 * @returns {string} - Tamaño formateado
 */
const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Calcular tiempo transcurrido
 * @param {Date} start - Fecha de inicio
 * @param {Date} end - Fecha de fin (opcional, por defecto ahora)
 * @returns {Object} - Tiempo transcurrido desglosado
 */
const calculateElapsedTime = (start, end = new Date()) => {
  const startDate = typeof start === 'string' ? new Date(start) : start;
  const endDate = typeof end === 'string' ? new Date(end) : end;

  const diffMs = endDate - startDate;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  return {
    milliseconds: diffMs,
    seconds: diffSeconds,
    minutes: diffMinutes,
    hours: diffHours,
    days: diffDays,
    formatted: {
      seconds: diffSeconds % 60,
      minutes: diffMinutes % 60,
      hours: diffHours % 24,
      days: diffDays,
    },
  };
};

/**
 * Validar si es una fecha válida
 * @param {any} date - Valor a validar
 * @returns {boolean} - True si es fecha válida
 */
const isValidDate = date => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj instanceof Date && !isNaN(dateObj);
};

/**
 * Obtener información del navegador desde User-Agent
 * @param {string} userAgent - User-Agent header
 * @returns {Object} - Información del navegador
 */
const parseUserAgent = userAgent => {
  if (!userAgent) return { browser: 'unknown', os: 'unknown' };

  const browsers = {
    chrome: /chrome/i,
    firefox: /firefox/i,
    safari: /safari/i,
    edge: /edge/i,
    ie: /msie/i,
  };

  const os = {
    windows: /windows/i,
    mac: /macintosh|mac os x/i,
    linux: /linux/i,
    android: /android/i,
    ios: /iphone|ipad|ipod/i,
  };

  let browser = 'unknown';
  let operatingSystem = 'unknown';

  for (const [name, regex] of Object.entries(browsers)) {
    if (regex.test(userAgent)) {
      browser = name;
      break;
    }
  }

  for (const [name, regex] of Object.entries(os)) {
    if (regex.test(userAgent)) {
      operatingSystem = name;
      break;
    }
  }

  return { browser, os: operatingSystem };
};

module.exports = {
  generateRandomToken,
  generateSHA256,
  generateUUID,
  formatCurrency,
  formatDate,
  formatRelativeDate,
  capitalize,
  toTitleCase,
  truncateText,
  generateSlug,
  isEmpty,
  deepClone,
  merge,
  debounce,
  throttle,
  randomInRange,
  formatBytes,
  calculateElapsedTime,
  isValidDate,
  parseUserAgent,
};
