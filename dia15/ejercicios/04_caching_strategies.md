# 🗄️ Ejercicio 4: Caching Strategies

## 🎯 Objetivo
Implementar una estrategia de caching multi-layer que incluya HTTP headers, Service Worker caching, y optimización de browser storage para maximizar la velocidad de carga y minimizar las requests de red.

## ⏱️ Duración
45 minutos

## 🔧 Dificultad
⭐⭐⭐ (Intermedio-Avanzado)

## 📋 Prerrequisitos
- Conocimiento de HTTP headers
- Experiencia con Service Workers
- Comprensión de browser storage APIs

---

## 🚀 Instrucciones

### Paso 1: Configuración de HTTP Headers (10 minutos)

```javascript
// backend/middleware/cacheHeaders.js
const setCacheHeaders = (req, res, next) => {
  const path = req.path;
  
  // Assets estáticos (JS, CSS, imágenes)
  if (path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$/)) {
    // Cache por 1 año con fingerprinting
    res.set({
      'Cache-Control': 'public, max-age=31536000, immutable',
      'ETag': generateETag(path),
      'Vary': 'Accept-Encoding'
    });
  }
  
  // API responses
  else if (path.startsWith('/api/')) {
    const cacheStrategy = getCacheStrategy(path);
    res.set(cacheStrategy);
  }
  
  // HTML pages
  else if (path.match(/\.html$/) || path === '/') {
    res.set({
      'Cache-Control': 'public, max-age=3600, must-revalidate',
      'ETag': generateETag(path),
      'Last-Modified': new Date().toUTCString()
    });
  }
  
  next();
};

// Estrategias de cache por endpoint
const getCacheStrategy = (path) => {
  const strategies = {
    '/api/products': {
      'Cache-Control': 'public, max-age=300, s-maxage=600',
      'Vary': 'Accept, Accept-Encoding'
    },
    '/api/users/profile': {
      'Cache-Control': 'private, max-age=60, must-revalidate'
    },
    '/api/analytics': {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  };
  
  // Buscar estrategia específica o usar default
  for (const [route, headers] of Object.entries(strategies)) {
    if (path.startsWith(route)) {
      return headers;
    }
  }
  
  // Default para APIs
  return {
    'Cache-Control': 'public, max-age=180',
    'Vary': 'Accept-Encoding'
  };
};

// Generar ETag simple
const generateETag = (path) => {
  const crypto = require('crypto');
  return crypto.createHash('md5')
    .update(path + Date.now())
    .digest('hex')
    .substr(0, 8);
};

module.exports = setCacheHeaders;
```

```javascript
// backend/app.js - Aplicar middleware
const express = require('express');
const setCacheHeaders = require('./middleware/cacheHeaders');
const compression = require('compression');

const app = express();

// Middleware de compresión
app.use(compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

// Aplicar headers de cache
app.use(setCacheHeaders);

// Servir archivos estáticos con cache optimizado
app.use('/static', express.static('public', {
  maxAge: '1y',
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    if (path.includes('sw.js')) {
      // Service Worker nunca debe cachear
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
  }
}));

module.exports = app;
```

### Paso 2: Service Worker para Caching (15 minutos)

```javascript
// public/sw.js - Service Worker avanzado
const CACHE_NAME = 'app-cache-v1';
const API_CACHE = 'api-cache-v1';
const IMAGE_CACHE = 'image-cache-v1';

// Recursos críticos para cache inmediato
const CRITICAL_RESOURCES = [
  '/',
  '/static/css/main.css',
  '/static/js/main.js',
  '/manifest.json'
];

// URLs de API para cache
const API_URLS = [
  '/api/products',
  '/api/categories',
  '/api/config'
];

// Estrategias de cache
const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
  NETWORK_ONLY: 'network-only',
  CACHE_ONLY: 'cache-only'
};

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  console.log('SW: Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache de recursos críticos
      caches.open(CACHE_NAME).then(cache => {
        return cache.addAll(CRITICAL_RESOURCES);
      }),
      
      // Pre-cache APIs importantes
      caches.open(API_CACHE).then(cache => {
        return Promise.allSettled(
          API_URLS.map(url => 
            fetch(url).then(response => {
              if (response.ok) {
                return cache.put(url, response.clone());
              }
            }).catch(() => {
              // Silenciar errores en pre-cache
            })
          )
        );
      })
    ]).then(() => {
      // Activar inmediatamente
      return self.skipWaiting();
    })
  );
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  console.log('SW: Activating...');
  
  event.waitUntil(
    Promise.all([
      // Limpiar caches antiguos
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME && 
                cacheName !== API_CACHE && 
                cacheName !== IMAGE_CACHE) {
              console.log('SW: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Tomar control inmediato
      self.clients.claim()
    ])
  );
});

// Interceptar fetch requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Determinar estrategia de cache
  const strategy = getCacheStrategy(request);
  
  event.respondWith(
    handleRequest(request, strategy)
  );
});

// Determinar estrategia de cache según el request
const getCacheStrategy = (request) => {
  const url = new URL(request.url);
  
  // Assets estáticos - Cache First
  if (request.destination === 'script' || 
      request.destination === 'style' ||
      url.pathname.match(/\.(js|css|woff2?)$/)) {
    return CACHE_STRATEGIES.CACHE_FIRST;
  }
  
  // Imágenes - Stale While Revalidate
  if (request.destination === 'image') {
    return CACHE_STRATEGIES.STALE_WHILE_REVALIDATE;
  }
  
  // APIs dinámicas - Network First
  if (url.pathname.startsWith('/api/users') ||
      url.pathname.includes('real-time')) {
    return CACHE_STRATEGIES.NETWORK_FIRST;
  }
  
  // APIs estáticas - Stale While Revalidate
  if (url.pathname.startsWith('/api/')) {
    return CACHE_STRATEGIES.STALE_WHILE_REVALIDATE;
  }
  
  // HTML pages - Network First
  if (request.destination === 'document') {
    return CACHE_STRATEGIES.NETWORK_FIRST;
  }
  
  // Default
  return CACHE_STRATEGIES.NETWORK_FIRST;
};

// Manejar request según estrategia
const handleRequest = async (request, strategy) => {
  const cacheName = getCacheName(request);
  
  switch (strategy) {
    case CACHE_STRATEGIES.CACHE_FIRST:
      return cacheFirst(request, cacheName);
      
    case CACHE_STRATEGIES.NETWORK_FIRST:
      return networkFirst(request, cacheName);
      
    case CACHE_STRATEGIES.STALE_WHILE_REVALIDATE:
      return staleWhileRevalidate(request, cacheName);
      
    default:
      return networkFirst(request, cacheName);
  }
};

// Estrategia: Cache First
const cacheFirst = async (request, cacheName) => {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('SW: Network failed, no cache available');
    return new Response('Offline', { status: 503 });
  }
};

// Estrategia: Network First
const networkFirst = async (request, cacheName) => {
  const cache = await caches.open(cacheName);
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return new Response('Offline', { status: 503 });
  }
};

// Estrategia: Stale While Revalidate
const staleWhileRevalidate = async (request, cacheName) => {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  // Revalidar en background
  const networkPromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => {
    // Silenciar errores de red en background
  });
  
  // Retornar cache inmediatamente si existe
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Si no hay cache, esperar red
  return networkPromise;
};

// Determinar nombre de cache
const getCacheName = (request) => {
  if (request.destination === 'image') {
    return IMAGE_CACHE;
  }
  if (new URL(request.url).pathname.startsWith('/api/')) {
    return API_CACHE;
  }
  return CACHE_NAME;
};
```

### Paso 3: Client-side Cache Management (10 minutos)

```javascript
// src/services/cacheManager.js
class CacheManager {
  constructor() {
    this.memoryCache = new Map();
    this.maxMemoryItems = 100;
    this.defaultTTL = 5 * 60 * 1000; // 5 minutos
  }

  // Cache en memoria con TTL
  setMemoryCache(key, data, ttl = this.defaultTTL) {
    // Limpiar cache si está lleno
    if (this.memoryCache.size >= this.maxMemoryItems) {
      const firstKey = this.memoryCache.keys().next().value;
      this.memoryCache.delete(firstKey);
    }

    const expiry = Date.now() + ttl;
    this.memoryCache.set(key, { data, expiry });
  }

  // Obtener de memoria cache
  getMemoryCache(key) {
    const item = this.memoryCache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.memoryCache.delete(key);
      return null;
    }

    return item.data;
  }

  // Cache en localStorage con compresión
  setLocalCache(key, data, ttl = this.defaultTTL) {
    try {
      const item = {
        data: this.compress(data),
        expiry: Date.now() + ttl,
        timestamp: Date.now()
      };
      localStorage.setItem(`cache_${key}`, JSON.stringify(item));
    } catch (error) {
      console.warn('LocalStorage cache failed:', error);
    }
  }

  // Obtener de localStorage
  getLocalCache(key) {
    try {
      const item = JSON.parse(localStorage.getItem(`cache_${key}`));
      if (!item) return null;

      if (Date.now() > item.expiry) {
        localStorage.removeItem(`cache_${key}`);
        return null;
      }

      return this.decompress(item.data);
    } catch (error) {
      return null;
    }
  }

  // Compresión simple para localStorage
  compress(data) {
    if (typeof data === 'string') {
      return data;
    }
    return JSON.stringify(data);
  }

  // Descompresión
  decompress(data) {
    try {
      return JSON.parse(data);
    } catch {
      return data;
    }
  }

  // Invalidar cache específico
  invalidate(pattern) {
    // Memory cache
    for (const key of this.memoryCache.keys()) {
      if (key.includes(pattern)) {
        this.memoryCache.delete(key);
      }
    }

    // LocalStorage cache
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith('cache_') && key.includes(pattern)) {
        localStorage.removeItem(key);
      }
    }
  }

  // Limpiar cache expirado
  cleanup() {
    const now = Date.now();

    // Memory cache
    for (const [key, item] of this.memoryCache.entries()) {
      if (now > item.expiry) {
        this.memoryCache.delete(key);
      }
    }

    // LocalStorage cache
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith('cache_')) {
        try {
          const item = JSON.parse(localStorage.getItem(key));
          if (now > item.expiry) {
            localStorage.removeItem(key);
          }
        } catch {
          localStorage.removeItem(key);
        }
      }
    }
  }

  // Estadísticas de cache
  getStats() {
    return {
      memoryItems: this.memoryCache.size,
      localStorageItems: Object.keys(localStorage).filter(k => k.startsWith('cache_')).length,
      memorySize: this.calculateMemorySize(),
      localStorageSize: this.calculateLocalStorageSize()
    };
  }

  calculateMemorySize() {
    let size = 0;
    for (const item of this.memoryCache.values()) {
      size += JSON.stringify(item).length;
    }
    return size;
  }

  calculateLocalStorageSize() {
    let size = 0;
    for (const key in localStorage) {
      if (key.startsWith('cache_')) {
        size += localStorage.getItem(key).length;
      }
    }
    return size;
  }
}

export default new CacheManager();
```

### Paso 4: React Hook para Cache-Aware API (10 minutos)

```javascript
// src/hooks/useCachedApi.js
import { useState, useEffect, useCallback } from 'react';
import cacheManager from '../services/cacheManager';

const useCachedApi = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    ttl = 5 * 60 * 1000, // 5 minutos default
    useMemoryCache = true,
    useLocalCache = true,
    staleWhileRevalidate = false,
    dependencies = []
  } = options;

  const fetchData = useCallback(async (forceRefresh = false) => {
    const cacheKey = url + JSON.stringify(options);

    if (!forceRefresh) {
      // Intentar memoria cache primero
      if (useMemoryCache) {
        const memoryData = cacheManager.getMemoryCache(cacheKey);
        if (memoryData) {
          setData(memoryData);
          setLoading(false);
          
          // Si es stale-while-revalidate, actualizar en background
          if (staleWhileRevalidate) {
            fetchData(true);
          }
          return;
        }
      }

      // Intentar localStorage cache
      if (useLocalCache) {
        const localData = cacheManager.getLocalCache(cacheKey);
        if (localData) {
          setData(localData);
          setLoading(false);
          
          if (staleWhileRevalidate) {
            fetchData(true);
          }
          return;
        }
      }
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Guardar en caches
      if (useMemoryCache) {
        cacheManager.setMemoryCache(cacheKey, result, ttl);
      }
      if (useLocalCache) {
        cacheManager.setLocalCache(cacheKey, result, ttl);
      }

      setData(result);
    } catch (err) {
      setError(err.message);
      console.error('API fetch failed:', err);
    } finally {
      setLoading(false);
    }
  }, [url, ttl, useMemoryCache, useLocalCache, staleWhileRevalidate, ...dependencies]);

  // Invalidar cache manualmente
  const invalidateCache = useCallback(() => {
    cacheManager.invalidate(url);
    fetchData(true);
  }, [fetchData, url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: () => fetchData(true),
    invalidateCache
  };
};

export default useCachedApi;
```

---

## 🧪 Pruebas y Validación

### Comandos de Testing

```bash
# Verificar Service Worker
npx lighthouse http://localhost:3000 --view

# Testing de cache headers
curl -I http://localhost:3000/static/css/main.css

# Monitorear cache performance
# DevTools > Application > Storage > Cache Storage
```

### Métricas Objetivo

- **Cache Hit Ratio:** >80%
- **Repeat visit load time:** <1 segundo
- **API response time:** <200ms (cached)
- **Lighthouse PWA score:** >90

---

## ✅ Criterios de Evaluación

### **Técnico (70 puntos)**
- [ ] HTTP headers correctos (20 pts)
- [ ] Service Worker funcional (25 pts)
- [ ] Client-side caching (15 pts)
- [ ] Cache invalidation (10 pts)

### **Performance (20 puntos)**
- [ ] Cache hit ratio alto (10 pts)
- [ ] Load time mejorado (10 pts)

### **Implementación (10 puntos)**
- [ ] Código limpio y documentado (5 pts)
- [ ] Error handling robusto (5 pts)

---

## 📊 Entregables

1. **Service Worker** configurado y funcional
2. **Cache headers** implementados en backend
3. **Client-side cache manager** con TTL
4. **Hook React** para API caching
5. **Reporte de métricas** de cache performance

---

## 🎯 Desafío Extra

Implementar **cache warming** automático:

```javascript
// src/services/cacheWarmer.js
class CacheWarmer {
  constructor() {
    this.criticalUrls = [
      '/api/products?featured=true',
      '/api/categories',
      '/api/user/preferences'
    ];
  }

  async warmupCache() {
    const promises = this.criticalUrls.map(url =>
      fetch(url).catch(() => {
        // Silenciar errores en warmup
      })
    );

    await Promise.allSettled(promises);
    console.log('Cache warmed up');
  }
}
```

---

## 🔗 Recursos Adicionales

- [HTTP Caching Guide](https://web.dev/http-cache/)
- [Service Worker Strategies](https://developers.google.com/web/ilt/pwa/caching-files-with-service-worker)
- [Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache)
