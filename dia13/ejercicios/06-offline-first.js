/**
 * 🌐 Día 13: Offline-First Approaches
 *
 * Implementación de estrategias offline-first
 * para crear aplicaciones que funcionen sin conexión
 *
 * Conceptos clave:
 * - Service Workers
 * - Cache API
 * - Background Sync
 * - Offline strategies
 * - Network detection
 */

// 1. Service Worker registration
const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('✅ Service Worker registrado:', registration);

      // Escuchar actualizaciones
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        console.log('🔄 Nueva versión del SW disponible');

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // Hay una nueva versión
              showUpdateNotification();
            }
          }
        });
      });

      return registration;
    } catch (error) {
      console.error('❌ Error al registrar Service Worker:', error);
    }
  }
};

// 2. Offline Detection
class OfflineDetector {
  constructor() {
    this.isOnline = navigator.onLine;
    this.listeners = new Set();

    this.setupEventListeners();
  }

  setupEventListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.notifyListeners('online');
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.notifyListeners('offline');
    });
  }

  addListener(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners(status) {
    this.listeners.forEach(callback => {
      try {
        callback(status, this.isOnline);
      } catch (error) {
        console.error('Error in offline listener:', error);
      }
    });
  }

  // Verificar conectividad real (no solo el flag del navegador)
  async checkRealConnectivity() {
    try {
      const response = await fetch('/api/ping', {
        method: 'HEAD',
        cache: 'no-cache',
        timeout: 3000,
      });

      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

// 3. Offline Storage Manager
class OfflineStorageManager {
  constructor() {
    this.dbName = 'offlineAppDB';
    this.version = 1;
    this.db = null;
  }

  async initialize() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = event => {
        const db = event.target.result;

        // Crear stores para diferentes tipos de datos
        if (!db.objectStoreNames.contains('products')) {
          const productStore = db.createObjectStore('products', {
            keyPath: 'id',
          });
          productStore.createIndex('category', 'category', { unique: false });
        }

        if (!db.objectStoreNames.contains('pendingSync')) {
          const syncStore = db.createObjectStore('pendingSync', {
            keyPath: 'id',
            autoIncrement: true,
          });
          syncStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  async save(storeName, data) {
    if (!this.db) await this.initialize();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);

      const request = store.put(data);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async get(storeName, key) {
    if (!this.db) await this.initialize();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);

      const request = store.get(key);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAll(storeName) {
    if (!this.db) await this.initialize();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);

      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async delete(storeName, key) {
    if (!this.db) await this.initialize();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);

      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

// 4. Offline API Client
class OfflineApiClient {
  constructor() {
    this.storage = new OfflineStorageManager();
    this.detector = new OfflineDetector();
    this.syncQueue = [];

    this.initialize();
  }

  async initialize() {
    await this.storage.initialize();

    // Cargar cola de sincronización pendiente
    this.syncQueue = await this.storage.getAll('pendingSync');

    // Configurar sync automático cuando se conecte
    this.detector.addListener(status => {
      if (status === 'online') {
        this.processSyncQueue();
      }
    });
  }

  async get(url, options = {}) {
    const cacheKey = this.generateCacheKey(url, options.params);

    if (this.detector.isOnline) {
      try {
        // Intentar obtener datos frescos
        const response = await fetch(url, {
          ...options,
          cache: 'no-cache',
        });

        if (response.ok) {
          const data = await response.json();

          // Guardar en cache offline
          await this.storage.save('products', {
            id: cacheKey,
            data,
            timestamp: Date.now(),
          });

          return data;
        }
      } catch (error) {
        console.warn('Error en petición online, usando cache:', error);
      }
    }

    // Fallback a datos offline
    console.log('📱 Usando datos offline');
    const cached = await this.storage.get('products', cacheKey);

    if (cached) {
      return cached.data;
    }

    throw new Error('No hay datos disponibles offline');
  }

  async post(url, data, options = {}) {
    const operation = {
      method: 'POST',
      url,
      data,
      options,
      timestamp: Date.now(),
      id: Date.now() + Math.random(),
    };

    if (this.detector.isOnline) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          return await response.json();
        }
      } catch (error) {
        console.warn('Error en POST online, guardando para sync:', error);
      }
    }

    // Guardar para sincronización posterior
    await this.storage.save('pendingSync', operation);
    this.syncQueue.push(operation);

    // Retornar respuesta optimista
    return {
      success: true,
      id: operation.id,
      pending: true,
      message: 'Operación guardada para sincronización',
    };
  }

  async processSyncQueue() {
    console.log('🔄 Procesando cola de sincronización...');

    const queue = [...this.syncQueue];

    for (const operation of queue) {
      try {
        const response = await fetch(operation.url, {
          method: operation.method,
          headers: {
            'Content-Type': 'application/json',
            ...operation.options.headers,
          },
          body: JSON.stringify(operation.data),
        });

        if (response.ok) {
          // Eliminar de la cola
          await this.storage.delete('pendingSync', operation.id);
          this.syncQueue = this.syncQueue.filter(
            item => item.id !== operation.id
          );

          console.log(`✅ Sincronizado: ${operation.url}`);
        }
      } catch (error) {
        console.error(`❌ Error sincronizando ${operation.url}:`, error);
      }
    }
  }

  generateCacheKey(url, params = {}) {
    const paramString = Object.keys(params || {})
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');

    return `${url}${paramString ? `?${paramString}` : ''}`;
  }
}

// 5. React Hook para modo offline
const useOfflineMode = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingOperations, setPendingOperations] = useState([]);

  const detector = useMemo(() => new OfflineDetector(), []);
  const apiClient = useMemo(() => new OfflineApiClient(), []);

  useEffect(() => {
    const unsubscribe = detector.addListener((status, online) => {
      setIsOnline(online);

      if (online) {
        // Actualizar operaciones pendientes
        loadPendingOperations();
      }
    });

    return unsubscribe;
  }, [detector]);

  const loadPendingOperations = async () => {
    try {
      const pending = await apiClient.storage.getAll('pendingSync');
      setPendingOperations(pending);
    } catch (error) {
      console.error('Error loading pending operations:', error);
    }
  };

  useEffect(() => {
    loadPendingOperations();
  }, []);

  return {
    isOnline,
    pendingOperations,
    apiClient,
    syncPendingOperations: () => apiClient.processSyncQueue(),
  };
};

// 6. Componente React para estado offline
const OfflineIndicator = () => {
  const { isOnline, pendingOperations, syncPendingOperations } =
    useOfflineMode();

  if (isOnline && pendingOperations.length === 0) {
    return null;
  }

  return (
    <div className={`offline-indicator ${isOnline ? 'online' : 'offline'}`}>
      {!isOnline && (
        <div className="offline-status">
          <span className="indicator-icon">📱</span>
          <span>Modo offline</span>
        </div>
      )}

      {pendingOperations.length > 0 && (
        <div className="pending-sync">
          <span className="indicator-icon">⏳</span>
          <span>{pendingOperations.length} operaciones pendientes</span>
          {isOnline && (
            <button
              onClick={syncPendingOperations}
              className="sync-button">
              Sincronizar
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// 7. Ejemplo de Service Worker (sw.js)
const serviceWorkerCode = `
// Service Worker para estrategia offline-first
const CACHE_NAME = 'offline-app-v1';
const STATIC_ASSETS = [
  '/',
  '/static/css/main.css',
  '/static/js/main.js',
  '/offline.html'
];

// Instalar Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activar Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Interceptar peticiones
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then((response) => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        }).catch(() => {
          // Network failed, return offline page
          return caches.match('/offline.html');
        });
      })
  );
});

// Background Sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Procesar operaciones pendientes
      processPendingOperations()
    );
  }
});

async function processPendingOperations() {
  // Lógica para procesar operaciones pendientes
  console.log('Processing background sync...');
}
`;

// 8. Ejemplo de uso completo
const OfflineApp = () => {
  const { isOnline, pendingOperations, apiClient } = useOfflineMode();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await apiClient.get('/api/products');
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async productData => {
    try {
      const result = await apiClient.post('/api/products', productData);

      if (result.pending) {
        // Mostrar feedback de operación pendiente
        alert('Producto guardado. Se sincronizará cuando haya conexión.');
      } else {
        // Actualizar lista inmediatamente
        setProducts(prev => [...prev, result]);
      }
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="offline-app">
      <OfflineIndicator />

      <header>
        <h1>Productos {!isOnline && '(Offline)'}</h1>
        <button
          onClick={loadProducts}
          disabled={loading}>
          {loading ? 'Cargando...' : 'Recargar'}
        </button>
      </header>

      <div className="products-grid">
        {products.map(product => (
          <div
            key={product.id}
            className="product-card">
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p className="price">${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// 9. Ejercicios prácticos
const ejerciciosPracticos = [
  {
    titulo: 'Implementar Cache Strategies',
    descripcion: 'Diferentes estrategias de cache en SW',
    codigo: `
      // Cache First Strategy
      self.addEventListener('fetch', (event) => {
        event.respondWith(
          caches.match(event.request).then((response) => {
            return response || fetch(event.request);
          })
        );
      });

      // Network First Strategy
      self.addEventListener('fetch', (event) => {
        event.respondWith(
          fetch(event.request).catch(() => {
            return caches.match(event.request);
          })
        );
      });
    `,
  },
  {
    titulo: 'Offline Form Handling',
    descripcion: 'Manejo de formularios offline',
    codigo: `
      const handleOfflineForm = async (formData) => {
        if (!navigator.onLine) {
          // Guardar en IndexedDB
          await saveOfflineForm(formData);
          showOfflineMessage();
        } else {
          // Enviar inmediatamente
          await submitForm(formData);
        }
      };
    `,
  },
];

console.log('🌐 Ejercicio 6: Offline-First Approaches');
console.log('📝 Conceptos cubiertos:', [
  'Service Workers',
  'Cache API',
  'Background Sync',
  'Offline strategies',
  'Network detection',
]);

export {
  OfflineApiClient,
  OfflineDetector,
  OfflineIndicator,
  OfflineStorageManager,
  useOfflineMode,
};
export default OfflineApiClient;
