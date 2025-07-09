/**
 * HELPERS - Funciones de Utilidad
 *
 * Colección de funciones de utilidad para manipulación
 * de datos, formateo, DOM y operaciones comunes
 *
 * Características ES6+:
 * - Arrow functions para funciones puras
 * - Destructuring en parámetros
 * - Rest/spread operators
 * - Template literals
 * - Map/Set para operaciones
 * - Async/await para utilidades asíncronas
 * - Closures para funciones especializadas
 */

/**
 * UTILIDADES DE FORMATO
 */

/**
 * Formatea precio en moneda local
 */
export const formatPrice = (price, currency = 'USD', locale = 'es-ES') => {
  if (price === null || price === undefined || isNaN(price)) {
    return '---';
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

/**
 * Formatea fecha en formato local
 */
export const formatDate = (date, options = {}) => {
  if (!date) return '---';

  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  const formatOptions = { ...defaultOptions, ...options };

  try {
    const dateObj = date instanceof Date ? date : new Date(date);

    if (isNaN(dateObj.getTime())) {
      return '---';
    }

    return new Intl.DateTimeFormat('es-ES', formatOptions).format(dateObj);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '---';
  }
};

/**
 * Formatea fecha relativa (hace X tiempo)
 */
export const formatRelativeDate = date => {
  if (!date) return '---';

  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    const now = new Date();
    const diffInSeconds = Math.floor((now - dateObj) / 1000);

    const intervals = [
      { label: 'año', seconds: 31536000 },
      { label: 'mes', seconds: 2592000 },
      { label: 'día', seconds: 86400 },
      { label: 'hora', seconds: 3600 },
      { label: 'minuto', seconds: 60 },
      { label: 'segundo', seconds: 1 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(diffInSeconds / interval.seconds);

      if (count > 0) {
        return `hace ${count} ${interval.label}${count > 1 ? 's' : ''}`;
      }
    }

    return 'ahora mismo';
  } catch (error) {
    console.error('Error formatting relative date:', error);
    return '---';
  }
};

/**
 * Formatea números con separadores de miles
 */
export const formatNumber = (num, decimals = 0) => {
  if (num === null || num === undefined || isNaN(num)) {
    return '---';
  }

  return new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

/**
 * Formatea tamaño de archivo
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Formatea porcentaje
 */
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '---';
  }

  return new Intl.NumberFormat('es-ES', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * UTILIDADES DE STRINGS
 */

/**
 * Capitaliza primera letra
 */
export const capitalize = str => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Convierte a title case
 */
export const toTitleCase = str => {
  if (!str) return '';

  return str.replace(
    /\w\S*/g,
    txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

/**
 * Convierte a camelCase
 */
export const toCamelCase = str => {
  if (!str) return '';

  return str.replace(/[-_\s]+(.)?/g, (_, char) =>
    char ? char.toUpperCase() : ''
  );
};

/**
 * Convierte a kebab-case
 */
export const toKebabCase = str => {
  if (!str) return '';

  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
};

/**
 * Trunca texto con elipsis
 */
export const truncate = (str, maxLength = 100, suffix = '...') => {
  if (!str) return '';

  if (str.length <= maxLength) {
    return str;
  }

  return str.substring(0, maxLength - suffix.length) + suffix;
};

/**
 * Genera slug para URLs
 */
export const slugify = str => {
  if (!str) return '';

  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

/**
 * Escapa HTML
 */
export const escapeHtml = str => {
  if (!str) return '';

  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
};

/**
 * Desescapa HTML
 */
export const unescapeHtml = str => {
  if (!str) return '';

  const div = document.createElement('div');
  div.innerHTML = str;
  return div.textContent || div.innerText || '';
};

/**
 * UTILIDADES DE ARRAYS
 */

/**
 * Agrupa elementos por una propiedad
 */
export const groupBy = (array, key) => {
  if (!Array.isArray(array)) return {};

  return array.reduce((groups, item) => {
    const groupKey = typeof key === 'function' ? key(item) : item[key];

    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }

    groups[groupKey].push(item);
    return groups;
  }, {});
};

/**
 * Ordena array por múltiples criterios
 */
export const sortBy = (array, ...keys) => {
  if (!Array.isArray(array)) return [];

  return [...array].sort((a, b) => {
    for (const key of keys) {
      let aValue,
        bValue,
        reverse = false;

      if (typeof key === 'string') {
        if (key.startsWith('-')) {
          reverse = true;
          aValue = a[key.slice(1)];
          bValue = b[key.slice(1)];
        } else {
          aValue = a[key];
          bValue = b[key];
        }
      } else if (typeof key === 'function') {
        aValue = key(a);
        bValue = key(b);
      }

      if (aValue < bValue) return reverse ? 1 : -1;
      if (aValue > bValue) return reverse ? -1 : 1;
    }

    return 0;
  });
};

/**
 * Elimina duplicados de array
 */
export const unique = (array, key = null) => {
  if (!Array.isArray(array)) return [];

  if (key) {
    const seen = new Set();
    return array.filter(item => {
      const value = typeof key === 'function' ? key(item) : item[key];

      if (seen.has(value)) {
        return false;
      }

      seen.add(value);
      return true;
    });
  }

  return [...new Set(array)];
};

/**
 * Divide array en chunks
 */
export const chunk = (array, size) => {
  if (!Array.isArray(array) || size <= 0) return [];

  const chunks = [];

  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }

  return chunks;
};

/**
 * Aplana array anidado
 */
export const flatten = (array, depth = Infinity) => {
  if (!Array.isArray(array)) return [];

  return depth > 0
    ? array.reduce(
        (acc, val) =>
          acc.concat(Array.isArray(val) ? flatten(val, depth - 1) : val),
        []
      )
    : array.slice();
};

/**
 * Shuffle array (Fisher-Yates)
 */
export const shuffle = array => {
  if (!Array.isArray(array)) return [];

  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
};

/**
 * UTILIDADES DE OBJETOS
 */

/**
 * Clona objeto profundamente
 */
export const deepClone = obj => {
  if (obj === null || typeof obj !== 'object') return obj;

  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (obj instanceof Set) return new Set([...obj].map(item => deepClone(item)));
  if (obj instanceof Map)
    return new Map([...obj].map(([key, value]) => [key, deepClone(value)]));

  const cloned = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }

  return cloned;
};

/**
 * Compara objetos profundamente
 */
export const deepEqual = (obj1, obj2) => {
  if (obj1 === obj2) return true;

  if (obj1 == null || obj2 == null) return false;

  if (typeof obj1 !== typeof obj2) return false;

  if (typeof obj1 !== 'object') return obj1 === obj2;

  if (obj1 instanceof Date && obj2 instanceof Date) {
    return obj1.getTime() === obj2.getTime();
  }

  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    if (obj1.length !== obj2.length) return false;

    for (let i = 0; i < obj1.length; i++) {
      if (!deepEqual(obj1[i], obj2[i])) return false;
    }

    return true;
  }

  if (Array.isArray(obj1) || Array.isArray(obj2)) return false;

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
};

/**
 * Obtiene valor anidado de objeto
 */
export const get = (obj, path, defaultValue = undefined) => {
  if (!obj || !path) return defaultValue;

  const keys = path.split('.');
  let current = obj;

  for (const key of keys) {
    if (current == null || typeof current !== 'object') {
      return defaultValue;
    }

    current = current[key];
  }

  return current !== undefined ? current : defaultValue;
};

/**
 * Establece valor anidado en objeto
 */
export const set = (obj, path, value) => {
  if (!obj || !path) return obj;

  const keys = path.split('.');
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    if (current[key] == null || typeof current[key] !== 'object') {
      current[key] = {};
    }

    current = current[key];
  }

  current[keys[keys.length - 1]] = value;
  return obj;
};

/**
 * Omite propiedades de objeto
 */
export const omit = (obj, keys) => {
  if (!obj) return {};

  const keysToOmit = Array.isArray(keys) ? keys : [keys];
  const result = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key) && !keysToOmit.includes(key)) {
      result[key] = obj[key];
    }
  }

  return result;
};

/**
 * Selecciona propiedades de objeto
 */
export const pick = (obj, keys) => {
  if (!obj) return {};

  const keysToPick = Array.isArray(keys) ? keys : [keys];
  const result = {};

  for (const key of keysToPick) {
    if (obj.hasOwnProperty(key)) {
      result[key] = obj[key];
    }
  }

  return result;
};

/**
 * UTILIDADES DE PERFORMANCE
 */

/**
 * Debounce function
 */
export const debounce = (func, delay = 300) => {
  let timeoutId;

  return function debounced(...args) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

/**
 * Throttle function
 */
export const throttle = (func, limit = 100) => {
  let inThrottle;

  return function throttled(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;

      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

/**
 * Memoización simple
 */
export const memoize = (func, keyGenerator = JSON.stringify) => {
  const cache = new Map();

  return function memoized(...args) {
    const key = keyGenerator(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = func.apply(this, args);
    cache.set(key, result);

    return result;
  };
};

/**
 * UTILIDADES ASÍNCRONAS
 */

/**
 * Sleep function
 */
export const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Timeout para promises
 */
export const timeout = (promise, ms) => {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Promise timeout')), ms);
  });

  return Promise.race([promise, timeoutPromise]);
};

/**
 * Retry function
 */
export const retry = async (func, maxAttempts = 3, delay = 1000) => {
  let lastError;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await func();
    } catch (error) {
      lastError = error;

      if (attempt < maxAttempts - 1) {
        await sleep(delay * Math.pow(2, attempt));
      }
    }
  }

  throw lastError;
};

/**
 * UTILIDADES DE VALIDACIÓN
 */

/**
 * Verifica si es email válido
 */
export const isValidEmail = email => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Verifica si es URL válida
 */
export const isValidUrl = url => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Verifica si es número válido
 */
export const isValidNumber = value => {
  return !isNaN(value) && isFinite(value);
};

/**
 * UTILIDADES DE DOM
 */

/**
 * Obtiene elemento por selector
 */
export const $ = (selector, parent = document) => {
  return parent.querySelector(selector);
};

/**
 * Obtiene elementos por selector
 */
export const $$ = (selector, parent = document) => {
  return Array.from(parent.querySelectorAll(selector));
};

/**
 * Crea elemento con atributos
 */
export const createElement = (tag, attributes = {}, content = '') => {
  const element = document.createElement(tag);

  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'className') {
      element.className = value;
    } else if (key === 'dataset') {
      Object.entries(value).forEach(([dataKey, dataValue]) => {
        element.dataset[dataKey] = dataValue;
      });
    } else {
      element.setAttribute(key, value);
    }
  });

  if (content) {
    element.innerHTML = content;
  }

  return element;
};

/**
 * UTILIDADES VARIAS
 */

/**
 * Genera ID único
 */
export const generateId = (prefix = 'id') => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Genera color hexadecimal aleatorio
 */
export const randomColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
};

/**
 * Calcula hash simple de string
 */
export const simpleHash = str => {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  return hash;
};

/**
 * Convierte a base64
 */
export const toBase64 = str => {
  return btoa(unescape(encodeURIComponent(str)));
};

/**
 * Convierte desde base64
 */
export const fromBase64 = str => {
  return decodeURIComponent(escape(atob(str)));
};

/* 
📚 NOTAS PEDAGÓGICAS:

1. **Arrow Functions**: Para funciones puras y concisas
2. **Destructuring**: En parámetros y asignaciones
3. **Rest/Spread**: Para manipulación de arrays y objetos
4. **Template Literals**: Para strings dinámicos
5. **Intl API**: Para formateo internacional
6. **Set/Map**: Para operaciones eficientes
7. **Closures**: Para funciones especializadas
8. **Async/Await**: Para utilidades asíncronas
9. **Regular Expressions**: Para validaciones
10. **Functional Programming**: Composición de funciones

🎯 EJERCICIOS SUGERIDOS:
- Crear más utilidades de fecha/hora
- Implementar algoritmos de sorting avanzados
- Agregar utilidades de criptografía
- Crear helpers para animaciones
*/
