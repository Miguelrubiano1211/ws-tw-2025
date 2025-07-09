/**
 * SERVICIO ProductService - Gestión de Productos
 *
 * Servicio principal para el manejo de productos
 * con patrón Repository y caché local
 *
 * Características ES6+:
 * - Clases ES6 con métodos privados
 * - Async/await para operaciones asíncronas
 * - Map para caché local
 * - Destructuring y spread operator
 * - Template literals para logs
 * - Arrow functions para callbacks
 * - Promises para control de flujo
 */

import { EventEmitter } from '../utils/EventEmitter.js';
import { validateProduct } from '../utils/Validators.js';

export class ProductService extends EventEmitter {
  constructor(apiClient, storage) {
    super();

    this.apiClient = apiClient;
    this.storage = storage;

    // Caché local usando Map
    this.cache = new Map();
    this.cacheExpiry = new Map();

    // Configuración
    this.config = {
      cacheTimeout: 5 * 60 * 1000, // 5 minutos
      maxCacheSize: 1000,
      retryAttempts: 3,
      retryDelay: 1000,
    };

    // Estado del servicio
    this.isOnline = navigator.onLine;
    this.pendingRequests = new Map();

    // Inicializar
    this.init();
  }

  /**
   * Inicializa el servicio
   */
  init() {
    this.setupEventListeners();
    this.loadFromStorage();
  }

  /**
   * Configura event listeners
   */
  setupEventListeners() {
    // Detectar cambios de conectividad
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.emit('online');
      this.syncPendingChanges();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.emit('offline');
    });

    // Limpiar caché periódicamente
    setInterval(() => {
      this.cleanExpiredCache();
    }, 60000); // Cada minuto
  }

  /**
   * Carga datos desde el almacenamiento local
   */
  async loadFromStorage() {
    try {
      const cachedProducts = await this.storage.getItem('products');

      if (cachedProducts) {
        cachedProducts.forEach(product => {
          this.cache.set(product.id, product);
        });

        this.emit('productsLoaded', cachedProducts);
      }
    } catch (error) {
      console.error('Error loading from storage:', error);
    }
  }

  /**
   * Obtiene todos los productos
   */
  async getProducts(options = {}) {
    const {
      page = 1,
      limit = 50,
      search = '',
      category = '',
      status = '',
      sortBy = 'name',
      sortOrder = 'asc',
      useCache = true,
    } = options;

    // Generar clave de caché
    const cacheKey = `products_${JSON.stringify(options)}`;

    // Verificar caché
    if (useCache && this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      // Verificar si hay una petición pendiente
      if (this.pendingRequests.has(cacheKey)) {
        return await this.pendingRequests.get(cacheKey);
      }

      // Crear petición
      const requestPromise = this.fetchProducts(options);
      this.pendingRequests.set(cacheKey, requestPromise);

      const result = await requestPromise;

      // Actualizar caché
      this.updateCache(cacheKey, result);

      // Limpiar petición pendiente
      this.pendingRequests.delete(cacheKey);

      // Emitir evento
      this.emit('productsLoaded', result);

      return result;
    } catch (error) {
      this.pendingRequests.delete(cacheKey);

      // Si estamos offline, intentar obtener desde caché
      if (!this.isOnline) {
        return this.getProductsFromCache(options);
      }

      throw error;
    }
  }

  /**
   * Obtiene productos desde la API
   */
  async fetchProducts(options) {
    const params = new URLSearchParams({
      page: options.page || 1,
      limit: options.limit || 50,
      search: options.search || '',
      category: options.category || '',
      status: options.status || '',
      sortBy: options.sortBy || 'name',
      sortOrder: options.sortOrder || 'asc',
    });

    const response = await this.apiClient.get(`/products?${params}`);

    return {
      products: response.data || [],
      total: response.total || 0,
      page: response.page || 1,
      limit: response.limit || 50,
      totalPages: response.totalPages || 1,
    };
  }

  /**
   * Obtiene productos desde caché (modo offline)
   */
  getProductsFromCache(options) {
    const cachedProducts = Array.from(this.cache.values()).filter(
      product => product.id
    ); // Solo productos, no queries

    let filtered = cachedProducts;

    // Aplicar filtros
    if (options.search) {
      const searchLower = options.search.toLowerCase();
      filtered = filtered.filter(
        product =>
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower)
      );
    }

    if (options.category) {
      filtered = filtered.filter(
        product => product.category === options.category
      );
    }

    if (options.status) {
      filtered = filtered.filter(product => product.status === options.status);
    }

    // Aplicar ordenamiento
    filtered.sort((a, b) => {
      const aValue = a[options.sortBy || 'name'];
      const bValue = b[options.sortBy || 'name'];

      if (options.sortOrder === 'desc') {
        return bValue > aValue ? 1 : -1;
      }

      return aValue > bValue ? 1 : -1;
    });

    // Aplicar paginación
    const page = options.page || 1;
    const limit = options.limit || 50;
    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      products: filtered.slice(start, end),
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit),
    };
  }

  /**
   * Obtiene un producto por ID
   */
  async getProduct(id) {
    // Verificar caché
    if (this.cache.has(id)) {
      return this.cache.get(id);
    }

    try {
      const product = await this.apiClient.get(`/products/${id}`);

      // Actualizar caché
      this.updateCache(id, product);

      return product;
    } catch (error) {
      // Si estamos offline, intentar obtener desde storage
      if (!this.isOnline) {
        return await this.storage.getItem(`product_${id}`);
      }

      throw error;
    }
  }

  /**
   * Crea un nuevo producto
   */
  async createProduct(productData) {
    // Validar datos
    const validationErrors = validateProduct(productData);

    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }

    // Generar ID temporal para modo offline
    const tempId = `temp_${Date.now()}`;
    const productWithId = { ...productData, id: tempId };

    try {
      let savedProduct;

      if (this.isOnline) {
        // Crear en el servidor
        savedProduct = await this.apiClient.post('/products', productData);
      } else {
        // Guardar temporalmente
        savedProduct = { ...productWithId, _pendingSync: true };
        await this.storage.setItem(`pending_create_${tempId}`, savedProduct);
      }

      // Actualizar caché
      this.updateCache(savedProduct.id, savedProduct);

      // Invalidar caché de consultas
      this.invalidateQueryCache();

      // Emitir evento
      this.emit('productCreated', savedProduct);

      return savedProduct;
    } catch (error) {
      // En caso de error, guardar para sincronización posterior
      if (this.isOnline) {
        await this.storage.setItem(`pending_create_${tempId}`, productWithId);
      }

      throw error;
    }
  }

  /**
   * Actualiza un producto existente
   */
  async updateProduct(id, updates) {
    // Validar actualizaciones
    const validationErrors = validateProduct(updates, false);

    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }

    // Obtener producto actual
    const currentProduct = await this.getProduct(id);

    if (!currentProduct) {
      throw new Error('Product not found');
    }

    // Crear producto actualizado
    const updatedProduct = { ...currentProduct, ...updates };

    try {
      let savedProduct;

      if (this.isOnline) {
        // Actualizar en el servidor
        savedProduct = await this.apiClient.put(`/products/${id}`, updates);
      } else {
        // Guardar temporalmente
        savedProduct = { ...updatedProduct, _pendingSync: true };
        await this.storage.setItem(`pending_update_${id}`, savedProduct);
      }

      // Actualizar caché
      this.updateCache(id, savedProduct);

      // Invalidar caché de consultas
      this.invalidateQueryCache();

      // Emitir evento
      this.emit('productUpdated', savedProduct);

      return savedProduct;
    } catch (error) {
      // En caso de error, guardar para sincronización posterior
      if (this.isOnline) {
        await this.storage.setItem(`pending_update_${id}`, updatedProduct);
      }

      throw error;
    }
  }

  /**
   * Elimina un producto
   */
  async deleteProduct(id) {
    try {
      if (this.isOnline) {
        // Eliminar del servidor
        await this.apiClient.delete(`/products/${id}`);
      } else {
        // Marcar para eliminación
        await this.storage.setItem(`pending_delete_${id}`, { id });
      }

      // Remover del caché
      this.cache.delete(id);
      this.cacheExpiry.delete(id);

      // Invalidar caché de consultas
      this.invalidateQueryCache();

      // Emitir evento
      this.emit('productDeleted', id);

      return true;
    } catch (error) {
      // En caso de error, marcar para sincronización posterior
      if (this.isOnline) {
        await this.storage.setItem(`pending_delete_${id}`, { id });
      }

      throw error;
    }
  }

  /**
   * Búsqueda de productos
   */
  async searchProducts(query, options = {}) {
    const searchOptions = {
      ...options,
      search: query,
      useCache: false, // Siempre buscar en servidor para resultados actualizados
    };

    return await this.getProducts(searchOptions);
  }

  /**
   * Obtiene estadísticas de productos
   */
  async getProductStats() {
    const cacheKey = 'product_stats';

    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const stats = await this.apiClient.get('/products/stats');

      // Actualizar caché
      this.updateCache(cacheKey, stats);

      return stats;
    } catch (error) {
      // Calcular estadísticas desde caché
      if (!this.isOnline) {
        return this.calculateStatsFromCache();
      }

      throw error;
    }
  }

  /**
   * Calcula estadísticas desde caché
   */
  calculateStatsFromCache() {
    const products = Array.from(this.cache.values()).filter(
      product => product.id && !product.id.startsWith('temp_')
    );

    const stats = {
      total: products.length,
      active: products.filter(p => p.status === 'active').length,
      inactive: products.filter(p => p.status === 'inactive').length,
      categories: {},
      lowStock: products.filter(p => p.stock <= 5).length,
      totalValue: products.reduce((sum, p) => sum + p.price * p.stock, 0),
    };

    // Estadísticas por categoría
    products.forEach(product => {
      if (stats.categories[product.category]) {
        stats.categories[product.category]++;
      } else {
        stats.categories[product.category] = 1;
      }
    });

    return stats;
  }

  /**
   * Sincroniza cambios pendientes
   */
  async syncPendingChanges() {
    if (!this.isOnline) return;

    try {
      const pendingItems = await this.storage.getKeys();

      for (const key of pendingItems) {
        if (key.startsWith('pending_')) {
          const [action, id] = key.split('_').slice(1);
          const data = await this.storage.getItem(key);

          try {
            switch (action) {
              case 'create':
                await this.syncCreateProduct(data);
                break;
              case 'update':
                await this.syncUpdateProduct(id, data);
                break;
              case 'delete':
                await this.syncDeleteProduct(id);
                break;
            }

            // Limpiar item pendiente
            await this.storage.removeItem(key);
          } catch (error) {
            console.error(`Error syncing ${key}:`, error);
          }
        }
      }

      this.emit('syncCompleted');
    } catch (error) {
      console.error('Error during sync:', error);
      this.emit('syncError', error);
    }
  }

  /**
   * Sincroniza creación de producto
   */
  async syncCreateProduct(productData) {
    const { _pendingSync, ...cleanData } = productData;
    const savedProduct = await this.apiClient.post('/products', cleanData);

    // Actualizar caché con ID real
    this.cache.delete(productData.id);
    this.updateCache(savedProduct.id, savedProduct);

    this.emit('productSynced', savedProduct);
  }

  /**
   * Sincroniza actualización de producto
   */
  async syncUpdateProduct(id, productData) {
    const { _pendingSync, ...cleanData } = productData;
    const savedProduct = await this.apiClient.put(`/products/${id}`, cleanData);

    this.updateCache(id, savedProduct);
    this.emit('productSynced', savedProduct);
  }

  /**
   * Sincroniza eliminación de producto
   */
  async syncDeleteProduct(id) {
    await this.apiClient.delete(`/products/${id}`);
    this.cache.delete(id);
    this.emit('productSynced', { id, action: 'delete' });
  }

  /**
   * Actualiza el caché
   */
  updateCache(key, value) {
    // Verificar límite de caché
    if (this.cache.size >= this.config.maxCacheSize) {
      this.cleanOldestCache();
    }

    this.cache.set(key, value);
    this.cacheExpiry.set(key, Date.now() + this.config.cacheTimeout);

    // Guardar en storage
    this.storage.setItem(key, value);
  }

  /**
   * Verifica si el caché es válido
   */
  isCacheValid(key) {
    const expiry = this.cacheExpiry.get(key);
    return expiry && Date.now() < expiry;
  }

  /**
   * Limpia caché expirado
   */
  cleanExpiredCache() {
    const now = Date.now();

    for (const [key, expiry] of this.cacheExpiry) {
      if (now >= expiry) {
        this.cache.delete(key);
        this.cacheExpiry.delete(key);
      }
    }
  }

  /**
   * Limpia el caché más antiguo
   */
  cleanOldestCache() {
    let oldestKey = null;
    let oldestTime = Infinity;

    for (const [key, expiry] of this.cacheExpiry) {
      if (expiry < oldestTime) {
        oldestTime = expiry;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
      this.cacheExpiry.delete(oldestKey);
    }
  }

  /**
   * Invalida caché de consultas
   */
  invalidateQueryCache() {
    for (const key of this.cache.keys()) {
      if (key.startsWith('products_')) {
        this.cache.delete(key);
        this.cacheExpiry.delete(key);
      }
    }
  }

  /**
   * Limpia todo el caché
   */
  clearCache() {
    this.cache.clear();
    this.cacheExpiry.clear();
  }

  /**
   * Reintenta una operación
   */
  async retryOperation(operation, maxRetries = this.config.retryAttempts) {
    let lastError;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;

        if (attempt < maxRetries - 1) {
          await new Promise(resolve =>
            setTimeout(resolve, this.config.retryDelay * Math.pow(2, attempt))
          );
        }
      }
    }

    throw lastError;
  }

  /**
   * Destruye el servicio
   */
  destroy() {
    this.clearCache();
    this.pendingRequests.clear();
    this.removeAllListeners();
  }
}

/* 
📚 NOTAS PEDAGÓGICAS:

1. **Repository Pattern**: Abstracción de la capa de datos
2. **Map para Caché**: Uso de Map para caché eficiente
3. **Async/Await**: Manejo de operaciones asíncronas
4. **Event Emitter**: Comunicación entre componentes
5. **Offline Support**: Funcionalidad sin conexión
6. **Retry Logic**: Reintento de operaciones fallidas
7. **Validation**: Validación de datos consistente
8. **Memory Management**: Limpieza de caché y memoria
9. **Error Handling**: Manejo robusto de errores
10. **Synchronization**: Sincronización offline/online

🎯 EJERCICIOS SUGERIDOS:
- Implementar paginación infinita
- Agregar soporte para bulk operations
- Implementar optimistic updates
- Crear sistema de versionado de datos
*/
