/**
 * SERVICIO Storage - Almacenamiento Local
 *
 * Servicio para manejo de almacenamiento local con soporte
 * para diferentes tipos de storage y serialización
 *
 * Características ES6+:
 * - Clases ES6 con métodos estáticos
 * - Async/await para operaciones asíncronas
 * - Map para caché en memoria
 * - Destructuring en configuración
 * - Template literals para claves
 * - Arrow functions para callbacks
 * - Promises para IndexedDB
 */

export class Storage {
  constructor(options = {}) {
    this.config = {
      prefix: 'app_',
      storage: 'localStorage', // 'localStorage' | 'sessionStorage' | 'indexedDB'
      encryption: false,
      compression: false,
      maxSize: 5 * 1024 * 1024, // 5MB
      ttl: null, // Sin expiración por defecto
      ...options,
    };

    // Caché en memoria para acceso rápido
    this.memoryCache = new Map();

    // Configurar storage backend
    this.setupStorage();

    // Configurar limpieza automática
    this.setupCleanup();
  }

  /**
   * Configura el backend de almacenamiento
   */
  setupStorage() {
    switch (this.config.storage) {
      case 'localStorage':
        this.backend = window.localStorage;
        break;
      case 'sessionStorage':
        this.backend = window.sessionStorage;
        break;
      case 'indexedDB':
        this.setupIndexedDB();
        break;
      default:
        throw new Error(`Unsupported storage type: ${this.config.storage}`);
    }
  }

  /**
   * Configura IndexedDB
   */
  async setupIndexedDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('AppStorage', 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.indexedDB = request.result;
        resolve();
      };

      request.onupgradeneeded = event => {
        const db = event.target.result;

        if (!db.objectStoreNames.contains('storage')) {
          db.createObjectStore('storage', { keyPath: 'key' });
        }
      };
    });
  }

  /**
   * Configura limpieza automática
   */
  setupCleanup() {
    // Limpiar elementos expirados cada 5 minutos
    setInterval(() => {
      this.cleanExpired();
    }, 5 * 60 * 1000);
  }

  /**
   * Almacena un valor
   */
  async setItem(key, value, options = {}) {
    const finalKey = this.buildKey(key);
    const itemOptions = { ...this.config, ...options };

    // Crear objeto de almacenamiento
    const item = {
      key: finalKey,
      value,
      timestamp: Date.now(),
      ttl: itemOptions.ttl,
      compressed: itemOptions.compression,
      encrypted: itemOptions.encryption,
    };

    // Procesar valor
    let processedValue = await this.processValue(value, itemOptions);

    // Verificar tamaño
    if (this.getSize(processedValue) > itemOptions.maxSize) {
      throw new Error('Value exceeds maximum size');
    }

    // Almacenar según backend
    switch (this.config.storage) {
      case 'localStorage':
      case 'sessionStorage':
        this.backend.setItem(
          finalKey,
          JSON.stringify({
            ...item,
            value: processedValue,
          })
        );
        break;
      case 'indexedDB':
        await this.setIndexedDBItem(finalKey, {
          ...item,
          value: processedValue,
        });
        break;
    }

    // Actualizar caché en memoria
    this.memoryCache.set(finalKey, {
      ...item,
      value: processedValue,
    });

    return true;
  }

  /**
   * Obtiene un valor
   */
  async getItem(key, defaultValue = null) {
    const finalKey = this.buildKey(key);

    // Verificar caché en memoria
    if (this.memoryCache.has(finalKey)) {
      const cached = this.memoryCache.get(finalKey);

      if (this.isExpired(cached)) {
        this.memoryCache.delete(finalKey);
        await this.removeItem(key);
        return defaultValue;
      }

      return this.unprocessValue(cached.value, cached);
    }

    // Obtener desde backend
    let item;

    switch (this.config.storage) {
      case 'localStorage':
      case 'sessionStorage':
        const stored = this.backend.getItem(finalKey);
        if (!stored) return defaultValue;
        item = JSON.parse(stored);
        break;
      case 'indexedDB':
        item = await this.getIndexedDBItem(finalKey);
        if (!item) return defaultValue;
        break;
    }

    // Verificar expiración
    if (this.isExpired(item)) {
      await this.removeItem(key);
      return defaultValue;
    }

    // Actualizar caché en memoria
    this.memoryCache.set(finalKey, item);

    return this.unprocessValue(item.value, item);
  }

  /**
   * Elimina un valor
   */
  async removeItem(key) {
    const finalKey = this.buildKey(key);

    // Eliminar del caché
    this.memoryCache.delete(finalKey);

    // Eliminar del backend
    switch (this.config.storage) {
      case 'localStorage':
      case 'sessionStorage':
        this.backend.removeItem(finalKey);
        break;
      case 'indexedDB':
        await this.removeIndexedDBItem(finalKey);
        break;
    }

    return true;
  }

  /**
   * Verifica si existe una clave
   */
  async hasItem(key) {
    const finalKey = this.buildKey(key);

    // Verificar caché
    if (this.memoryCache.has(finalKey)) {
      const cached = this.memoryCache.get(finalKey);

      if (this.isExpired(cached)) {
        this.memoryCache.delete(finalKey);
        await this.removeItem(key);
        return false;
      }

      return true;
    }

    // Verificar backend
    switch (this.config.storage) {
      case 'localStorage':
      case 'sessionStorage':
        return this.backend.getItem(finalKey) !== null;
      case 'indexedDB':
        const item = await this.getIndexedDBItem(finalKey);
        return item !== null;
    }

    return false;
  }

  /**
   * Obtiene todas las claves
   */
  async getKeys() {
    const keys = [];

    switch (this.config.storage) {
      case 'localStorage':
      case 'sessionStorage':
        for (let i = 0; i < this.backend.length; i++) {
          const key = this.backend.key(i);
          if (key.startsWith(this.config.prefix)) {
            keys.push(key.substring(this.config.prefix.length));
          }
        }
        break;
      case 'indexedDB':
        const indexedKeys = await this.getIndexedDBKeys();
        keys.push(
          ...indexedKeys
            .filter(key => key.startsWith(this.config.prefix))
            .map(key => key.substring(this.config.prefix.length))
        );
        break;
    }

    return keys;
  }

  /**
   * Obtiene información de almacenamiento
   */
  async getInfo() {
    const keys = await this.getKeys();
    let totalSize = 0;
    let expiredCount = 0;

    for (const key of keys) {
      const item = await this.getItem(key);
      if (item !== null) {
        totalSize += this.getSize(item);
      } else {
        expiredCount++;
      }
    }

    return {
      keys: keys.length,
      totalSize,
      expiredCount,
      memoryCache: this.memoryCache.size,
      backend: this.config.storage,
    };
  }

  /**
   * Limpia elementos expirados
   */
  async cleanExpired() {
    const keys = await this.getKeys();
    let cleanedCount = 0;

    for (const key of keys) {
      const item = await this.getItem(key);
      if (item === null) {
        cleanedCount++;
      }
    }

    console.log(`🧹 Cleaned ${cleanedCount} expired items`);
    return cleanedCount;
  }

  /**
   * Limpia todo el almacenamiento
   */
  async clear() {
    const keys = await this.getKeys();

    for (const key of keys) {
      await this.removeItem(key);
    }

    this.memoryCache.clear();
    return keys.length;
  }

  /**
   * Obtiene uso de almacenamiento
   */
  async getUsage() {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      return await navigator.storage.estimate();
    }

    return {
      quota: null,
      usage: null,
      usageDetails: null,
    };
  }

  /**
   * Operaciones con IndexedDB
   */
  async setIndexedDBItem(key, value) {
    return new Promise((resolve, reject) => {
      const transaction = this.indexedDB.transaction(['storage'], 'readwrite');
      const store = transaction.objectStore('storage');

      const request = store.put({ key, ...value });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getIndexedDBItem(key) {
    return new Promise((resolve, reject) => {
      const transaction = this.indexedDB.transaction(['storage'], 'readonly');
      const store = transaction.objectStore('storage');

      const request = store.get(key);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async removeIndexedDBItem(key) {
    return new Promise((resolve, reject) => {
      const transaction = this.indexedDB.transaction(['storage'], 'readwrite');
      const store = transaction.objectStore('storage');

      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getIndexedDBKeys() {
    return new Promise((resolve, reject) => {
      const transaction = this.indexedDB.transaction(['storage'], 'readonly');
      const store = transaction.objectStore('storage');

      const request = store.getAllKeys();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Procesa valor para almacenamiento
   */
  async processValue(value, options) {
    let processed = value;

    // Compresión
    if (options.compression) {
      processed = await this.compress(processed);
    }

    // Encriptación
    if (options.encryption) {
      processed = await this.encrypt(processed);
    }

    return processed;
  }

  /**
   * Desprocesa valor desde almacenamiento
   */
  async unprocessValue(value, item) {
    let processed = value;

    // Desencriptación
    if (item.encrypted) {
      processed = await this.decrypt(processed);
    }

    // Descompresión
    if (item.compressed) {
      processed = await this.decompress(processed);
    }

    return processed;
  }

  /**
   * Comprime un valor
   */
  async compress(value) {
    // Implementación básica - en producción usar una librería como pako
    return btoa(JSON.stringify(value));
  }

  /**
   * Descomprime un valor
   */
  async decompress(value) {
    // Implementación básica
    return JSON.parse(atob(value));
  }

  /**
   * Encripta un valor
   */
  async encrypt(value) {
    // Implementación básica - en producción usar Web Crypto API
    return btoa(JSON.stringify(value));
  }

  /**
   * Desencripta un valor
   */
  async decrypt(value) {
    // Implementación básica
    return JSON.parse(atob(value));
  }

  /**
   * Construye clave con prefijo
   */
  buildKey(key) {
    return `${this.config.prefix}${key}`;
  }

  /**
   * Verifica si un item está expirado
   */
  isExpired(item) {
    if (!item.ttl) return false;

    return Date.now() - item.timestamp > item.ttl;
  }

  /**
   * Obtiene tamaño aproximado de un valor
   */
  getSize(value) {
    return new Blob([JSON.stringify(value)]).size;
  }

  /**
   * Métodos estáticos para uso conveniente
   */
  static local(options = {}) {
    return new Storage({ ...options, storage: 'localStorage' });
  }

  static session(options = {}) {
    return new Storage({ ...options, storage: 'sessionStorage' });
  }

  static indexed(options = {}) {
    return new Storage({ ...options, storage: 'indexedDB' });
  }

  /**
   * Destruye el storage
   */
  destroy() {
    this.memoryCache.clear();

    if (this.indexedDB) {
      this.indexedDB.close();
    }
  }
}

/**
 * Instancia por defecto
 */
export default new Storage();

/* 
📚 NOTAS PEDAGÓGICAS:

1. **Storage APIs**: localStorage, sessionStorage, IndexedDB
2. **Promises**: Para operaciones asíncronas con IndexedDB
3. **Map**: Para caché en memoria
4. **Compression**: Compresión básica de datos
5. **Encryption**: Encriptación básica (usar Web Crypto API en producción)
6. **TTL**: Time to live para expiración automática
7. **Error Handling**: Manejo de errores de storage
8. **Memory Management**: Limpieza automática
9. **Size Limits**: Control de tamaño de datos
10. **Static Methods**: Factory methods para diferentes tipos

🎯 EJERCICIOS SUGERIDOS:
- Implementar sincronización entre tabs
- Agregar compresión real con pako
- Implementar encriptación con Web Crypto API
- Crear sistema de backup/restore
*/
