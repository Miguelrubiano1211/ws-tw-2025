/**
 * 💾 Día 13: Cache Strategies
 *
 * Implementación de estrategias de cache inteligentes
 * para mejorar performance y reducir peticiones redundantes
 *
 * Conceptos clave:
 * - Cache strategies (TTL, LRU, Write-through, Write-behind)
 * - Storage mechanisms (localStorage, sessionStorage, IndexedDB)
 * - Cache invalidation
 * - Memory management
 * - Cache warming
 */

// 1. Cache básico con TTL (Time To Live)
class TTLCache {
  constructor(defaultTTL = 300000) {
    // 5 minutos por defecto
    this.cache = new Map();
    this.timers = new Map();
    this.defaultTTL = defaultTTL;
  }

  set(key, value, ttl = this.defaultTTL) {
    // Limpiar timer anterior si existe
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
    }

    // Establecer valor
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl,
    });

    // Configurar auto-expiración
    const timer = setTimeout(() => {
      this.delete(key);
    }, ttl);

    this.timers.set(key, timer);
  }

  get(key) {
    const entry = this.cache.get(key);

    if (!entry) return null;

    // Verificar si ha expirado
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.delete(key);
      return null;
    }

    return entry.value;
  }

  delete(key) {
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
      this.timers.delete(key);
    }

    return this.cache.delete(key);
  }

  clear() {
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers.clear();
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }

  keys() {
    return Array.from(this.cache.keys());
  }
}

// 2. Cache LRU (Least Recently Used)
class LRUCache {
  constructor(capacity = 100) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return null;

    // Mover al final (más reciente)
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);

    return value;
  }

  set(key, value) {
    if (this.cache.has(key)) {
      // Actualizar valor existente
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // Eliminar el menos reciente (primero)
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, value);
  }

  delete(key) {
    return this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }
}

// 3. Cache Manager con múltiples estrategias
class CacheManager {
  constructor() {
    this.memoryCache = new TTLCache();
    this.lruCache = new LRUCache();
    this.storageCache = new StorageCache();
  }

  // Obtener con fallback en múltiples niveles
  async get(key, strategy = 'memory') {
    switch (strategy) {
      case 'memory':
        return this.memoryCache.get(key);

      case 'lru':
        return this.lruCache.get(key);

      case 'storage':
        return this.storageCache.get(key);

      case 'multi':
        // Buscar en orden: memoria -> LRU -> storage
        let value = this.memoryCache.get(key);
        if (value) return value;

        value = this.lruCache.get(key);
        if (value) {
          // Promover a memoria
          this.memoryCache.set(key, value);
          return value;
        }

        value = this.storageCache.get(key);
        if (value) {
          // Promover a LRU y memoria
          this.lruCache.set(key, value);
          this.memoryCache.set(key, value);
          return value;
        }

        return null;

      default:
        return null;
    }
  }

  // Establecer en múltiples niveles
  async set(key, value, options = {}) {
    const { strategy = 'memory', ttl, writeThrough = false } = options;

    switch (strategy) {
      case 'memory':
        this.memoryCache.set(key, value, ttl);
        break;

      case 'lru':
        this.lruCache.set(key, value);
        break;

      case 'storage':
        this.storageCache.set(key, value, ttl);
        break;

      case 'multi':
        // Escribir en todos los niveles
        this.memoryCache.set(key, value, ttl);
        this.lruCache.set(key, value);

        if (writeThrough) {
          this.storageCache.set(key, value, ttl);
        }
        break;
    }
  }

  // Invalidar cache
  async invalidate(key, strategy = 'all') {
    if (strategy === 'all' || strategy === 'memory') {
      this.memoryCache.delete(key);
    }

    if (strategy === 'all' || strategy === 'lru') {
      this.lruCache.delete(key);
    }

    if (strategy === 'all' || strategy === 'storage') {
      this.storageCache.delete(key);
    }
  }

  // Limpiar todo
  async clear() {
    this.memoryCache.clear();
    this.lruCache.clear();
    this.storageCache.clear();
  }
}

// 4. Storage Cache para persistencia
class StorageCache {
  constructor(storage = localStorage) {
    this.storage = storage;
    this.prefix = 'cache_';
  }

  generateKey(key) {
    return `${this.prefix}${key}`;
  }

  set(key, value, ttl) {
    const data = {
      value,
      timestamp: Date.now(),
      ttl: ttl || null,
    };

    try {
      this.storage.setItem(this.generateKey(key), JSON.stringify(data));
    } catch (error) {
      console.error('Error al guardar en storage:', error);
      // Manejar storage lleno
      this.cleanup();
    }
  }

  get(key) {
    try {
      const data = this.storage.getItem(this.generateKey(key));
      if (!data) return null;

      const parsed = JSON.parse(data);

      // Verificar expiración
      if (parsed.ttl && Date.now() - parsed.timestamp > parsed.ttl) {
        this.delete(key);
        return null;
      }

      return parsed.value;
    } catch (error) {
      console.error('Error al leer de storage:', error);
      return null;
    }
  }

  delete(key) {
    this.storage.removeItem(this.generateKey(key));
  }

  clear() {
    const keys = [];
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key?.startsWith(this.prefix)) {
        keys.push(key);
      }
    }

    keys.forEach(key => this.storage.removeItem(key));
  }

  // Limpiar entradas expiradas
  cleanup() {
    const keys = [];
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key?.startsWith(this.prefix)) {
        keys.push(key);
      }
    }

    keys.forEach(key => {
      try {
        const data = JSON.parse(this.storage.getItem(key));
        if (data.ttl && Date.now() - data.timestamp > data.ttl) {
          this.storage.removeItem(key);
        }
      } catch (error) {
        // Eliminar entradas corruptas
        this.storage.removeItem(key);
      }
    });
  }
}

// 5. API Client con cache integrado
class CachedApiClient {
  constructor() {
    this.cache = new CacheManager();
    this.baseURL = '/api';
  }

  generateCacheKey(url, params = {}) {
    const paramString = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');

    return `${url}${paramString ? `?${paramString}` : ''}`;
  }

  async get(url, options = {}) {
    const {
      cache = true,
      cacheStrategy = 'multi',
      cacheTTL = 300000, // 5 minutos
      params = {},
      forceRefresh = false,
    } = options;

    const cacheKey = this.generateCacheKey(url, params);

    // Intentar obtener de cache primero
    if (cache && !forceRefresh) {
      const cachedData = await this.cache.get(cacheKey, cacheStrategy);
      if (cachedData) {
        console.log(`📦 Cache hit: ${cacheKey}`);
        return cachedData;
      }
    }

    // Hacer petición a la API
    console.log(`🌐 Cache miss: ${cacheKey}`);

    try {
      const response = await fetch(
        `${this.baseURL}${url}${this.buildQueryString(params)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Guardar en cache
      if (cache) {
        await this.cache.set(cacheKey, data, {
          strategy: cacheStrategy,
          ttl: cacheTTL,
        });
      }

      return data;
    } catch (error) {
      console.error('Error en petición:', error);
      throw error;
    }
  }

  async post(url, data, options = {}) {
    const { invalidatePatterns = [] } = options;

    try {
      const response = await fetch(`${this.baseURL}${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      // Invalidar cache relacionado
      await this.invalidateCache(invalidatePatterns);

      return result;
    } catch (error) {
      console.error('Error en POST:', error);
      throw error;
    }
  }

  async invalidateCache(patterns = []) {
    for (const pattern of patterns) {
      // Invalidar por patrón (ejemplo: '/productos*')
      if (pattern.includes('*')) {
        const prefix = pattern.replace('*', '');
        // Buscar y eliminar todas las claves que coincidan
        const keys = await this.cache.memoryCache.keys();
        keys.forEach(key => {
          if (key.startsWith(prefix)) {
            this.cache.invalidate(key);
          }
        });
      } else {
        // Invalidar clave específica
        await this.cache.invalidate(pattern);
      }
    }
  }

  buildQueryString(params) {
    if (!params || Object.keys(params).length === 0) return '';

    const queryString = Object.keys(params)
      .map(
        key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
      )
      .join('&');

    return `?${queryString}`;
  }
}

// 6. Hook de React para cache
const useCachedApi = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiClient = useMemo(() => new CachedApiClient(), []);

  const fetchData = useCallback(
    async (forceRefresh = false) => {
      try {
        setLoading(true);
        setError(null);

        const result = await apiClient.get(url, {
          ...options,
          forceRefresh,
        });

        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [url, options, apiClient]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: () => fetchData(true),
    softRefetch: () => fetchData(false),
  };
};

// 7. Ejemplo de uso
const ProductListWithCache = () => {
  const {
    data: products,
    loading,
    error,
    refetch,
  } = useCachedApi('/productos', {
    cache: true,
    cacheStrategy: 'multi',
    cacheTTL: 300000, // 5 minutos
  });

  if (loading) return <div>Cargando productos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Productos (con cache)</h2>
      <button onClick={refetch}>Refrescar</button>
      {products?.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
};

// 8. Estrategias avanzadas
const advancedStrategies = {
  // Cache warming - precargar datos
  warmCache: async (apiClient, urls) => {
    console.log('🔥 Warming cache...');

    const promises = urls.map(url =>
      apiClient
        .get(url)
        .catch(err => console.error(`Error warming ${url}:`, err))
    );

    await Promise.all(promises);
    console.log('✅ Cache warmed');
  },

  // Cache stampede prevention
  requestDeduplication: (() => {
    const pendingRequests = new Map();

    return async (key, requestFn) => {
      if (pendingRequests.has(key)) {
        return pendingRequests.get(key);
      }

      const promise = requestFn();
      pendingRequests.set(key, promise);

      try {
        const result = await promise;
        return result;
      } finally {
        pendingRequests.delete(key);
      }
    };
  })(),

  // Background refresh
  backgroundRefresh: (apiClient, cacheKey, url, options) => {
    setTimeout(async () => {
      try {
        console.log(`🔄 Background refresh: ${cacheKey}`);
        await apiClient.get(url, { ...options, forceRefresh: true });
      } catch (error) {
        console.error('Error in background refresh:', error);
      }
    }, 1000); // 1 segundo después
  },
};

// 9. Ejercicios prácticos
const ejerciciosPracticos = [
  {
    titulo: 'Cache con Compression',
    descripcion: 'Implementar compresión de datos en cache',
    codigo: `
      const compressedCache = {
        set(key, value) {
          const compressed = LZString.compress(JSON.stringify(value));
          localStorage.setItem(key, compressed);
        },
        
        get(key) {
          const compressed = localStorage.getItem(key);
          if (!compressed) return null;
          
          const decompressed = LZString.decompress(compressed);
          return JSON.parse(decompressed);
        }
      };
    `,
  },
  {
    titulo: 'Cache Metrics',
    descripcion: 'Implementar métricas de cache',
    codigo: `
      class CacheMetrics {
        constructor() {
          this.hits = 0;
          this.misses = 0;
          this.errors = 0;
        }
        
        recordHit() { this.hits++; }
        recordMiss() { this.misses++; }
        recordError() { this.errors++; }
        
        getHitRate() {
          const total = this.hits + this.misses;
          return total > 0 ? (this.hits / total) * 100 : 0;
        }
      }
    `,
  },
];

console.log('💾 Ejercicio 5: Cache Strategies');
console.log('📝 Conceptos cubiertos:', [
  'Cache strategies (TTL, LRU)',
  'Storage mechanisms',
  'Cache invalidation',
  'Memory management',
  'Background refresh',
]);

export { CacheManager, CachedApiClient, LRUCache, TTLCache, useCachedApi };
export default CacheManager;
