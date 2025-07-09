/**
 * Módulo de Cache
 * Implementa estrategias de cache para optimizar peticiones de API
 */

// Configuración del cache
const CACHE_CONFIG = {
  DEFAULT_TTL: 5 * 60 * 1000, // 5 minutos
  MAX_SIZE: 100, // Máximo 100 entradas
  STORAGE_KEY: 'api_cache_ws2025',
};

// Estrategias de cache disponibles
const CACHE_STRATEGIES = {
  MEMORY: 'memory',
  LOCAL_STORAGE: 'localStorage',
  SESSION_STORAGE: 'sessionStorage',
};

/**
 * Clase para manejar cache en memoria
 */
class MemoryCache {
  constructor(maxSize = CACHE_CONFIG.MAX_SIZE) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.hits = 0;
    this.misses = 0;
    this.sets = 0;
  }

  /**
   * Generar clave de cache
   * @param {string} url - URL de la petición
   * @param {Object} params - Parámetros de la petición
   * @returns {string} - Clave única para el cache
   */
  generateKey(url, params = {}) {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((result, key) => {
        result[key] = params[key];
        return result;
      }, {});

    return `${url}_${JSON.stringify(sortedParams)}`;
  }

  /**
   * Obtener valor del cache
   * @param {string} key - Clave del cache
   * @returns {Object|null} - Valor cacheado o null
   */
  get(key) {
    const entry = this.cache.get(key);

    if (!entry) {
      this.misses++;
      return null;
    }

    // Verificar si ha expirado
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      this.misses++;
      return null;
    }

    // Actualizar timestamp de último acceso
    entry.lastAccessed = Date.now();
    this.hits++;

    return entry.data;
  }

  /**
   * Guardar valor en el cache
   * @param {string} key - Clave del cache
   * @param {*} data - Datos a cachear
   * @param {number} ttl - Tiempo de vida en milisegundos
   */
  set(key, data, ttl = CACHE_CONFIG.DEFAULT_TTL) {
    // Si el cache está lleno, eliminar la entrada menos reciente
    if (this.cache.size >= this.maxSize) {
      this.evictLeastRecentlyUsed();
    }

    const entry = {
      data: data,
      created: Date.now(),
      expiry: Date.now() + ttl,
      lastAccessed: Date.now(),
      ttl: ttl,
    };

    this.cache.set(key, entry);
    this.sets++;
  }

  /**
   * Eliminar entrada del cache
   * @param {string} key - Clave a eliminar
   * @returns {boolean} - True si se eliminó exitosamente
   */
  delete(key) {
    return this.cache.delete(key);
  }

  /**
   * Limpiar todo el cache
   */
  clear() {
    this.cache.clear();
    this.resetStats();
  }

  /**
   * Verificar si una clave existe en el cache
   * @param {string} key - Clave a verificar
   * @returns {boolean} - True si existe y no ha expirado
   */
  has(key) {
    const entry = this.cache.get(key);

    if (!entry) {
      return false;
    }

    // Verificar si ha expirado
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Eliminar la entrada menos recientemente usada
   */
  evictLeastRecentlyUsed() {
    let oldestKey = null;
    let oldestTime = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccessed < oldestTime) {
        oldestTime = entry.lastAccessed;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  /**
   * Limpiar entradas expiradas
   */
  cleanup() {
    const now = Date.now();
    const expiredKeys = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        expiredKeys.push(key);
      }
    }

    expiredKeys.forEach(key => this.cache.delete(key));

    return expiredKeys.length;
  }

  /**
   * Obtener estadísticas del cache
   * @returns {Object} - Estadísticas de uso
   */
  getStats() {
    const totalRequests = this.hits + this.misses;
    const hitRate =
      totalRequests > 0 ? Math.round((this.hits / totalRequests) * 100) : 0;

    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hits: this.hits,
      misses: this.misses,
      sets: this.sets,
      hitRate: hitRate,
      totalRequests: totalRequests,
    };
  }

  /**
   * Resetear estadísticas
   */
  resetStats() {
    this.hits = 0;
    this.misses = 0;
    this.sets = 0;
  }

  /**
   * Obtener todas las claves del cache
   * @returns {Array} - Array de claves
   */
  keys() {
    return Array.from(this.cache.keys());
  }

  /**
   * Obtener información detallada de una entrada
   * @param {string} key - Clave de la entrada
   * @returns {Object|null} - Información de la entrada
   */
  getEntryInfo(key) {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    return {
      key,
      created: new Date(entry.created).toISOString(),
      expiry: new Date(entry.expiry).toISOString(),
      lastAccessed: new Date(entry.lastAccessed).toISOString(),
      ttl: entry.ttl,
      timeLeft: Math.max(0, entry.expiry - Date.now()),
      size: JSON.stringify(entry.data).length,
    };
  }
}

/**
 * Clase para manejar cache en localStorage/sessionStorage
 */
class StorageCache {
  constructor(storageType = 'localStorage') {
    this.storage = window[storageType];
    this.storageType = storageType;
    this.hits = 0;
    this.misses = 0;
    this.sets = 0;

    // Verificar soporte de storage
    if (!this.storage) {
      throw new Error(`${storageType} no está disponible`);
    }
  }

  /**
   * Generar clave de cache
   * @param {string} url - URL de la petición
   * @param {Object} params - Parámetros de la petición
   * @returns {string} - Clave única para el cache
   */
  generateKey(url, params = {}) {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((result, key) => {
        result[key] = params[key];
        return result;
      }, {});

    return `${CACHE_CONFIG.STORAGE_KEY}_${url}_${JSON.stringify(sortedParams)}`;
  }

  /**
   * Obtener valor del cache
   * @param {string} key - Clave del cache
   * @returns {Object|null} - Valor cacheado o null
   */
  get(key) {
    try {
      const cacheKey = this.generateKey(key);
      const cached = this.storage.getItem(cacheKey);

      if (!cached) {
        this.misses++;
        return null;
      }

      const entry = JSON.parse(cached);

      // Verificar si ha expirado
      if (Date.now() > entry.expiry) {
        this.storage.removeItem(cacheKey);
        this.misses++;
        return null;
      }

      this.hits++;
      return entry.data;
    } catch (error) {
      console.error('Error al obtener del cache:', error);
      this.misses++;
      return null;
    }
  }

  /**
   * Guardar valor en el cache
   * @param {string} key - Clave del cache
   * @param {*} data - Datos a cachear
   * @param {number} ttl - Tiempo de vida en milisegundos
   */
  set(key, data, ttl = CACHE_CONFIG.DEFAULT_TTL) {
    try {
      const cacheKey = this.generateKey(key);
      const entry = {
        data: data,
        created: Date.now(),
        expiry: Date.now() + ttl,
        ttl: ttl,
      };

      this.storage.setItem(cacheKey, JSON.stringify(entry));
      this.sets++;
    } catch (error) {
      console.error('Error al guardar en cache:', error);

      // Si es error de quota, limpiar cache antiguo
      if (error.name === 'QuotaExceededError') {
        this.cleanup();

        // Intentar guardar nuevamente
        try {
          const cacheKey = this.generateKey(key);
          const entry = {
            data: data,
            created: Date.now(),
            expiry: Date.now() + ttl,
            ttl: ttl,
          };

          this.storage.setItem(cacheKey, JSON.stringify(entry));
          this.sets++;
        } catch (retryError) {
          console.error('Error al reintentar guardar en cache:', retryError);
        }
      }
    }
  }

  /**
   * Eliminar entrada del cache
   * @param {string} key - Clave a eliminar
   */
  delete(key) {
    const cacheKey = this.generateKey(key);
    this.storage.removeItem(cacheKey);
  }

  /**
   * Limpiar todo el cache
   */
  clear() {
    const keys = [];

    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key && key.startsWith(CACHE_CONFIG.STORAGE_KEY)) {
        keys.push(key);
      }
    }

    keys.forEach(key => this.storage.removeItem(key));
    this.resetStats();
  }

  /**
   * Limpiar entradas expiradas
   */
  cleanup() {
    const now = Date.now();
    const expiredKeys = [];

    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);

      if (key && key.startsWith(CACHE_CONFIG.STORAGE_KEY)) {
        try {
          const cached = this.storage.getItem(key);
          if (cached) {
            const entry = JSON.parse(cached);
            if (now > entry.expiry) {
              expiredKeys.push(key);
            }
          }
        } catch (error) {
          // Si hay error al parsear, eliminar la entrada corrupta
          expiredKeys.push(key);
        }
      }
    }

    expiredKeys.forEach(key => this.storage.removeItem(key));
    return expiredKeys.length;
  }

  /**
   * Obtener estadísticas del cache
   * @returns {Object} - Estadísticas de uso
   */
  getStats() {
    const totalRequests = this.hits + this.misses;
    const hitRate =
      totalRequests > 0 ? Math.round((this.hits / totalRequests) * 100) : 0;

    // Contar entradas en storage
    let size = 0;
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key && key.startsWith(CACHE_CONFIG.STORAGE_KEY)) {
        size++;
      }
    }

    return {
      size: size,
      hits: this.hits,
      misses: this.misses,
      sets: this.sets,
      hitRate: hitRate,
      totalRequests: totalRequests,
      storageType: this.storageType,
    };
  }

  /**
   * Resetear estadísticas
   */
  resetStats() {
    this.hits = 0;
    this.misses = 0;
    this.sets = 0;
  }
}

/**
 * Manager de cache principal
 */
class CacheManager {
  constructor(strategy = CACHE_STRATEGIES.MEMORY) {
    this.strategy = strategy;
    this.cache = this.createCache(strategy);
  }

  /**
   * Crear instancia de cache según la estrategia
   * @param {string} strategy - Estrategia de cache
   * @returns {Object} - Instancia de cache
   */
  createCache(strategy) {
    switch (strategy) {
      case CACHE_STRATEGIES.MEMORY:
        return new MemoryCache();
      case CACHE_STRATEGIES.LOCAL_STORAGE:
        return new StorageCache('localStorage');
      case CACHE_STRATEGIES.SESSION_STORAGE:
        return new StorageCache('sessionStorage');
      default:
        throw new Error(`Estrategia de cache no válida: ${strategy}`);
    }
  }

  /**
   * Cambiar estrategia de cache
   * @param {string} newStrategy - Nueva estrategia
   */
  setStrategy(newStrategy) {
    if (this.strategy !== newStrategy) {
      this.strategy = newStrategy;
      this.cache = this.createCache(newStrategy);
    }
  }

  /**
   * Obtener datos del cache o ejecutar función si no existe
   * @param {string} key - Clave del cache
   * @param {Function} fetcher - Función para obtener datos si no están en cache
   * @param {number} ttl - Tiempo de vida del cache
   * @returns {Promise<*>} - Datos del cache o resultado de la función
   */
  async getOrSet(key, fetcher, ttl = CACHE_CONFIG.DEFAULT_TTL) {
    // Intentar obtener del cache
    const cached = this.cache.get(key);

    if (cached !== null) {
      return cached;
    }

    // No está en cache, ejecutar función
    try {
      const result = await fetcher();

      // Guardar en cache solo si la función fue exitosa
      if (result && result.success) {
        this.cache.set(key, result, ttl);
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Invalidar cache por patrón
   * @param {string} pattern - Patrón para buscar claves
   */
  invalidatePattern(pattern) {
    const keys = this.cache.keys ? this.cache.keys() : [];
    const regex = new RegExp(pattern);

    keys.forEach(key => {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    });
  }

  /**
   * Obtener todas las estadísticas del cache
   * @returns {Object} - Estadísticas completas
   */
  getStats() {
    return {
      ...this.cache.getStats(),
      strategy: this.strategy,
      config: CACHE_CONFIG,
    };
  }

  // Métodos proxy para el cache subyacente
  get(key) {
    return this.cache.get(key);
  }
  set(key, data, ttl) {
    return this.cache.set(key, data, ttl);
  }
  delete(key) {
    return this.cache.delete(key);
  }
  clear() {
    return this.cache.clear();
  }
  has(key) {
    return this.cache.has(key);
  }
  cleanup() {
    return this.cache.cleanup();
  }
}

// Instancia singleton del manager de cache
const cacheManager = new CacheManager();

// Función de utilidad para cache automático
async function withCache(key, fetcher, ttl = CACHE_CONFIG.DEFAULT_TTL) {
  return cacheManager.getOrSet(key, fetcher, ttl);
}

// Exportar clases y utilidades
export {
  CACHE_CONFIG,
  CACHE_STRATEGIES,
  CacheManager,
  MemoryCache,
  StorageCache,
  cacheManager,
  withCache,
};
