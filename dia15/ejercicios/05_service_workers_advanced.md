# ⚙️ Ejercicio 5: Service Workers Avanzados

## 🎯 Objetivo
Desarrollar un Service Worker avanzado con background sync, offline-first functionality, push notifications y performance caching strategies para crear una Progressive Web App completamente funcional.

## ⏱️ Duración
45 minutos

## 🔧 Dificultad
⭐⭐⭐⭐ (Avanzado)

## 📋 Prerrequisitos
- Service Workers básicos
- Promesas y async/await
- IndexedDB o similar
- Conceptos de PWA

---

## 🚀 Instrucciones

### Paso 1: Service Worker Core con Background Sync (15 minutos)

```javascript
// public/sw-advanced.js
const CACHE_NAME = 'pwa-cache-v2';
const API_CACHE = 'api-cache-v2';
const OFFLINE_CACHE = 'offline-cache-v2';
const BACKGROUND_SYNC_TAG = 'background-sync';

// Recursos offline esenciales
const OFFLINE_ESSENTIALS = [
  '/',
  '/offline.html',
  '/static/css/main.css',
  '/static/js/main.js',
  '/static/images/logo.svg',
  '/manifest.json'
];

// URLs que funcionan offline
const OFFLINE_FALLBACKS = {
  '/products': '/offline-products.html',
  '/dashboard': '/offline-dashboard.html',
  '/api/': '/api/offline'
};

// Base de datos para queue de sync
let syncQueue = [];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  console.log('SW: Installing Advanced Service Worker...');
  
  event.waitUntil(
    Promise.all([
      // Cache recursos esenciales
      caches.open(OFFLINE_CACHE).then(cache => {
        return cache.addAll(OFFLINE_ESSENTIALS);
      }),
      
      // Inicializar IndexedDB para sync queue
      initSyncDatabase(),
      
      // Skip waiting para activar inmediatamente
      self.skipWaiting()
    ])
  );
});

// Activación con limpieza inteligente
self.addEventListener('activate', (event) => {
  console.log('SW: Activating...');
  
  event.waitUntil(
    Promise.all([
      // Limpiar caches obsoletos
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (!cacheName.includes('v2')) {
              console.log('SW: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Tomar control de todos los clients
      self.clients.claim(),
      
      // Restaurar queue de sync pendiente
      restoreSyncQueue()
    ])
  );
});

// Interceptar fetch con estrategias avanzadas
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Solo manejar requests de la misma origin
  if (url.origin !== location.origin) {
    return;
  }
  
  event.respondWith(
    handleAdvancedFetch(request)
  );
});

// Background Sync para operaciones diferidas
self.addEventListener('sync', (event) => {
  console.log('SW: Background sync triggered:', event.tag);
  
  if (event.tag === BACKGROUND_SYNC_TAG) {
    event.waitUntil(
      processSyncQueue()
    );
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  console.log('SW: Push received:', event);
  
  const options = {
    body: event.data ? event.data.text() : 'Nueva notificación',
    icon: '/static/images/icon-192x192.png',
    badge: '/static/images/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver',
        icon: '/static/images/checkmark.png'
      },
      {
        action: 'close',
        title: 'Cerrar',
        icon: '/static/images/xmark.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Mi PWA', options)
  );
});

// Manejar clicks en notificaciones
self.addEventListener('notificationclick', (event) => {
  console.log('SW: Notification click:', event);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Función principal de manejo de fetch
const handleAdvancedFetch = async (request) => {
  const url = new URL(request.url);
  
  // POST requests - queue para background sync
  if (request.method === 'POST') {
    return handlePostRequest(request);
  }
  
  // API requests - network first con offline fallback
  if (url.pathname.startsWith('/api/')) {
    return handleApiRequest(request);
  }
  
  // Assets estáticos - cache first
  if (isStaticAsset(request)) {
    return handleStaticAsset(request);
  }
  
  // HTML pages - network first con offline fallback
  if (request.destination === 'document') {
    return handleDocumentRequest(request);
  }
  
  // Default - network first
  return handleDefaultRequest(request);
};

// Manejar POST requests con background sync
const handlePostRequest = async (request) => {
  try {
    // Intentar enviar inmediatamente
    const response = await fetch(request.clone());
    if (response.ok) {
      return response;
    }
    throw new Error('Network failed');
  } catch (error) {
    // Guardar en queue para background sync
    await addToSyncQueue(request);
    
    // Retornar respuesta simulada para UX
    return new Response(
      JSON.stringify({ 
        success: true, 
        queued: true,
        message: 'Guardado. Se sincronizará cuando haya conexión.' 
      }),
      { 
        status: 202,
        statusText: 'Accepted',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};

// Manejar requests a API
const handleApiRequest = async (request) => {
  const cache = await caches.open(API_CACHE);
  
  try {
    // Network first
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      // Cachear respuestas exitosas
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    throw new Error('Network failed');
  } catch (error) {
    // Fallback a cache
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      // Agregar header para indicar que es cached
      const response = cachedResponse.clone();
      response.headers.set('X-From-Cache', 'true');
      return response;
    }
    
    // Offline fallback
    return createOfflineResponse(request.url);
  }
};

// Manejar assets estáticos
const handleStaticAsset = async (request) => {
  const cache = await caches.open(CACHE_NAME);
  
  // Cache first para assets
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
    // No fallback para assets
    return new Response('Asset no disponible offline', { status: 404 });
  }
};

// Manejar documentos HTML
const handleDocumentRequest = async (request) => {
  try {
    // Network first para HTML
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    // Fallback a página offline personalizada
    const url = new URL(request.url);
    const offlineFallback = findOfflineFallback(url.pathname);
    
    const cache = await caches.open(OFFLINE_CACHE);
    const fallbackResponse = await cache.match(offlineFallback);
    
    return fallbackResponse || await cache.match('/offline.html');
  }
};

// Encontrar fallback offline para ruta
const findOfflineFallback = (pathname) => {
  for (const [route, fallback] of Object.entries(OFFLINE_FALLBACKS)) {
    if (pathname.startsWith(route)) {
      return fallback;
    }
  }
  return '/offline.html';
};

// Verificar si es asset estático
const isStaticAsset = (request) => {
  return request.destination === 'script' ||
         request.destination === 'style' ||
         request.destination === 'image' ||
         request.destination === 'font' ||
         request.url.includes('/static/');
};

// Crear respuesta offline personalizada
const createOfflineResponse = (url) => {
  const offlineData = {
    error: 'No hay conexión a internet',
    offline: true,
    url: url,
    timestamp: new Date().toISOString()
  };
  
  return new Response(
    JSON.stringify(offlineData),
    {
      status: 503,
      statusText: 'Service Unavailable',
      headers: {
        'Content-Type': 'application/json',
        'X-Offline': 'true'
      }
    }
  );
};

// Inicializar base de datos para sync
const initSyncDatabase = async () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('SyncDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('syncQueue')) {
        const store = db.createObjectStore('syncQueue', { autoIncrement: true });
        store.createIndex('timestamp', 'timestamp');
      }
    };
  });
};

// Agregar request a queue de sync
const addToSyncQueue = async (request) => {
  const db = await initSyncDatabase();
  const transaction = db.transaction(['syncQueue'], 'readwrite');
  const store = transaction.objectStore('syncQueue');
  
  const requestData = {
    url: request.url,
    method: request.method,
    headers: Object.fromEntries(request.headers.entries()),
    body: await request.text(),
    timestamp: Date.now()
  };
  
  store.add(requestData);
  
  // Registrar background sync
  self.registration.sync.register(BACKGROUND_SYNC_TAG);
};

// Procesar queue de sync en background
const processSyncQueue = async () => {
  const db = await initSyncDatabase();
  const transaction = db.transaction(['syncQueue'], 'readonly');
  const store = transaction.objectStore('syncQueue');
  
  const requests = await new Promise((resolve) => {
    const allRequests = [];
    const cursor = store.openCursor();
    
    cursor.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        allRequests.push({ id: cursor.primaryKey, ...cursor.value });
        cursor.continue();
      } else {
        resolve(allRequests);
      }
    };
  });
  
  // Procesar cada request en queue
  for (const requestData of requests) {
    try {
      const response = await fetch(requestData.url, {
        method: requestData.method,
        headers: requestData.headers,
        body: requestData.body
      });
      
      if (response.ok) {
        // Eliminar de queue si fue exitoso
        await removeFromSyncQueue(requestData.id);
        console.log('SW: Sync completed for:', requestData.url);
      }
    } catch (error) {
      console.log('SW: Sync failed for:', requestData.url, error);
      // Mantener en queue para retry
    }
  }
};

// Remover item de sync queue
const removeFromSyncQueue = async (id) => {
  const db = await initSyncDatabase();
  const transaction = db.transaction(['syncQueue'], 'readwrite');
  const store = transaction.objectStore('syncQueue');
  store.delete(id);
};

// Restaurar queue de sync al activar
const restoreSyncQueue = async () => {
  try {
    const db = await initSyncDatabase();
    const transaction = db.transaction(['syncQueue'], 'readonly');
    const store = transaction.objectStore('syncQueue');
    
    const count = await new Promise((resolve) => {
      const countRequest = store.count();
      countRequest.onsuccess = () => resolve(countRequest.result);
    });
    
    if (count > 0) {
      // Registrar sync si hay items pendientes
      self.registration.sync.register(BACKGROUND_SYNC_TAG);
      console.log(`SW: Restored ${count} items in sync queue`);
    }
  } catch (error) {
    console.log('SW: Error restoring sync queue:', error);
  }
};
```

### Paso 2: Registro y Configuración del SW (10 minutos)

```javascript
// src/services/swManager.js
class ServiceWorkerManager {
  constructor() {
    this.registration = null;
    this.isSupported = 'serviceWorker' in navigator;
    this.isOnline = navigator.onLine;
    this.listeners = new Map();
  }

  // Registrar Service Worker
  async register() {
    if (!this.isSupported) {
      console.warn('Service Workers no soportados');
      return false;
    }

    try {
      this.registration = await navigator.serviceWorker.register('/sw-advanced.js', {
        scope: '/'
      });

      console.log('SW: Registrado exitosamente');

      // Configurar listeners
      this.setupEventListeners();

      // Verificar actualizaciones
      this.checkForUpdates();

      return true;
    } catch (error) {
      console.error('SW: Error en registro:', error);
      return false;
    }
  }

  // Configurar event listeners
  setupEventListeners() {
    // Estado de conexión
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.emit('online');
      this.triggerBackgroundSync();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.emit('offline');
    });

    // Mensajes del Service Worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      this.handleSWMessage(event.data);
    });

    // Actualizaciones del SW
    if (this.registration) {
      this.registration.addEventListener('updatefound', () => {
        this.handleSWUpdate();
      });
    }
  }

  // Manejar mensajes del SW
  handleSWMessage(data) {
    const { type, payload } = data;

    switch (type) {
      case 'SYNC_COMPLETED':
        this.emit('syncCompleted', payload);
        break;
      case 'CACHE_UPDATED':
        this.emit('cacheUpdated', payload);
        break;
      case 'OFFLINE_FALLBACK':
        this.emit('offlineFallback', payload);
        break;
    }
  }

  // Manejar actualización del SW
  handleSWUpdate() {
    const installingWorker = this.registration.installing;

    installingWorker.addEventListener('statechange', () => {
      if (installingWorker.state === 'installed') {
        if (navigator.serviceWorker.controller) {
          // Hay una actualización disponible
          this.emit('updateAvailable');
        } else {
          // Primera instalación
          this.emit('firstInstall');
        }
      }
    });
  }

  // Verificar actualizaciones
  async checkForUpdates() {
    if (this.registration) {
      await this.registration.update();
    }
  }

  // Forzar actualización
  async forceUpdate() {
    if (this.registration && this.registration.waiting) {
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  }

  // Triggear background sync
  async triggerBackgroundSync() {
    if (this.registration && this.registration.sync) {
      try {
        await this.registration.sync.register('background-sync');
        console.log('SW: Background sync triggered');
      } catch (error) {
        console.error('SW: Background sync failed:', error);
      }
    }
  }

  // Suscribirse a push notifications
  async subscribeToPush() {
    if (!this.registration) {
      throw new Error('Service Worker no registrado');
    }

    try {
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(process.env.REACT_APP_VAPID_PUBLIC_KEY)
      });

      // Enviar subscription al servidor
      await this.sendSubscriptionToServer(subscription);

      return subscription;
    } catch (error) {
      console.error('SW: Error en push subscription:', error);
      throw error;
    }
  }

  // Enviar subscription al servidor
  async sendSubscriptionToServer(subscription) {
    const response = await fetch('/api/push-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(subscription)
    });

    if (!response.ok) {
      throw new Error('Error enviando subscription al servidor');
    }
  }

  // Utilidad para convertir VAPID key
  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Sistema de eventos
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  emit(event, data = null) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => callback(data));
    }
  }

  // Obtener estado del SW
  getStatus() {
    return {
      isSupported: this.isSupported,
      isRegistered: !!this.registration,
      isOnline: this.isOnline,
      registration: this.registration
    };
  }
}

export default new ServiceWorkerManager();
```

### Paso 3: React Integration y UI Feedback (10 minutos)

```javascript
// src/components/PWAStatus.js
import React, { useState, useEffect } from 'react';
import swManager from '../services/swManager';

const PWAStatus = () => {
  const [status, setStatus] = useState({
    isOnline: navigator.onLine,
    swRegistered: false,
    updateAvailable: false,
    syncInProgress: false
  });

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Registrar Service Worker
    const initSW = async () => {
      const registered = await swManager.register();
      setStatus(prev => ({ ...prev, swRegistered: registered }));
    };

    initSW();

    // Event listeners
    swManager.on('online', () => {
      setStatus(prev => ({ ...prev, isOnline: true }));
      addNotification('Conexión restaurada', 'success');
    });

    swManager.on('offline', () => {
      setStatus(prev => ({ ...prev, isOnline: false }));
      addNotification('Sin conexión - Modo offline activado', 'warning');
    });

    swManager.on('updateAvailable', () => {
      setStatus(prev => ({ ...prev, updateAvailable: true }));
      addNotification('Actualización disponible', 'info');
    });

    swManager.on('syncCompleted', () => {
      setStatus(prev => ({ ...prev, syncInProgress: false }));
      addNotification('Datos sincronizados', 'success');
    });

    swManager.on('offlineFallback', (data) => {
      addNotification(`Usando versión offline: ${data.url}`, 'warning');
    });

  }, []);

  const addNotification = (message, type) => {
    const id = Date.now();
    const notification = { id, message, type };
    
    setNotifications(prev => [...prev, notification]);
    
    // Auto-remove después de 5 segundos
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleUpdate = async () => {
    await swManager.forceUpdate();
  };

  const handleEnablePush = async () => {
    try {
      await swManager.subscribeToPush();
      addNotification('Notificaciones push activadas', 'success');
    } catch (error) {
      addNotification('Error activando notificaciones: ' + error.message, 'error');
    }
  };

  return (
    <div className="pwa-status">
      {/* Status bar */}
      <div className={`status-bar ${status.isOnline ? 'online' : 'offline'}`}>
        <div className="status-indicator">
          <span className={`indicator ${status.isOnline ? 'green' : 'red'}`}></span>
          {status.isOnline ? 'Conectado' : 'Sin conexión'}
        </div>
        
        {status.swRegistered && (
          <div className="sw-status">
            <span className="indicator green"></span>
            PWA Activa
          </div>
        )}
        
        {status.updateAvailable && (
          <button 
            className="btn btn-sm btn-primary"
            onClick={handleUpdate}
          >
            Actualizar
          </button>
        )}
        
        <button 
          className="btn btn-sm btn-outline-primary"
          onClick={handleEnablePush}
        >
          🔔 Notificaciones
        </button>
      </div>

      {/* Notifications */}
      <div className="notifications-container">
        {notifications.map(notification => (
          <div 
            key={notification.id}
            className={`notification notification-${notification.type}`}
          >
            <span>{notification.message}</span>
            <button 
              className="notification-close"
              onClick={() => removeNotification(notification.id)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PWAStatus;
```

### Paso 4: Páginas Offline y Testing (10 minutos)

```html
<!-- public/offline.html -->
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Offline - Mi PWA</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .offline-container {
            text-align: center;
            max-width: 400px;
            padding: 2rem;
        }
        .offline-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
        }
        .btn {
            background: rgba(255,255,255,0.2);
            border: 2px solid white;
            color: white;
            padding: 12px 24px;
            border-radius: 25px;
            cursor: pointer;
            margin-top: 1rem;
            transition: all 0.3s ease;
        }
        .btn:hover {
            background: white;
            color: #667eea;
        }
    </style>
</head>
<body>
    <div class="offline-container">
        <div class="offline-icon">📱</div>
        <h1>Estás Offline</h1>
        <p>No hay conexión a internet, pero puedes seguir usando las funciones guardadas de la aplicación.</p>
        <button class="btn" onclick="window.location.reload()">
            Intentar de nuevo
        </button>
        <button class="btn" onclick="window.history.back()">
            Volver
        </button>
    </div>

    <script>
        // Recargar cuando vuelva la conexión
        window.addEventListener('online', () => {
            window.location.reload();
        });
    </script>
</body>
</html>
```

```css
/* src/styles/pwa.css */
.pwa-status {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.status-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.status-bar.online {
  background: #d4edda;
  color: #155724;
  border-bottom: 1px solid #c3e6cb;
}

.status-bar.offline {
  background: #f8d7da;
  color: #721c24;
  border-bottom: 1px solid #f5c6cb;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.indicator.green {
  background: #28a745;
  box-shadow: 0 0 6px rgba(40, 167, 69, 0.6);
}

.indicator.red {
  background: #dc3545;
  box-shadow: 0 0 6px rgba(220, 53, 69, 0.6);
}

.notifications-container {
  position: fixed;
  top: 60px;
  right: 1rem;
  z-index: 1001;
  max-width: 350px;
}

.notification {
  background: white;
  padding: 1rem;
  margin-bottom: 0.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  display: flex;
  justify-content: space-between;
  align-items: center;
  animation: slideIn 0.3s ease;
}

.notification-success {
  border-left: 4px solid #28a745;
}

.notification-warning {
  border-left: 4px solid #ffc107;
}

.notification-error {
  border-left: 4px solid #dc3545;
}

.notification-info {
  border-left: 4px solid #17a2b8;
}

.notification-close {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #6c757d;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
```

---

## 🧪 Pruebas y Validación

### Comandos de Testing

```bash
# PWA Audit
npx lighthouse http://localhost:3000 --view

# Testing offline functionality
# DevTools > Network > Offline

# Background sync testing
# DevTools > Application > Background Sync
```

### Escenarios de Prueba

1. **Offline functionality**: Desconectar red y navegar
2. **Background sync**: Enviar datos offline y reconectar
3. **Push notifications**: Probar notificaciones
4. **Cache strategies**: Verificar diferentes estrategias
5. **PWA installation**: Probar "Add to Home Screen"

---

## ✅ Criterios de Evaluación

### **Técnico (70 puntos)**
- [ ] Background sync funcional (20 pts)
- [ ] Offline-first implementado (20 pts)
- [ ] Push notifications (15 pts)
- [ ] Cache strategies avanzadas (15 pts)

### **PWA Compliance (20 puntos)**
- [ ] Lighthouse PWA score >90 (10 pts)
- [ ] Installable PWA (10 pts)

### **UX y Usabilidad (10 puntos)**
- [ ] Feedback offline claro (5 pts)
- [ ] Transiciones suaves (5 pts)

---

## 📊 Entregables

1. **Service Worker avanzado** con todas las funcionalidades
2. **PWA completamente funcional** offline
3. **UI components** para status y notificaciones
4. **Páginas offline** personalizadas
5. **Lighthouse PWA audit** con score >90

---

## 🎯 Desafío Extra

Implementar **Periodic Background Sync**:

```javascript
// En el Service Worker
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'content-sync') {
    event.waitUntil(doPeriodicSync());
  }
});

// Registrar periodic sync
navigator.serviceWorker.ready.then(registration => {
  registration.periodicSync.register('content-sync', {
    minInterval: 24 * 60 * 60 * 1000 // 24 horas
  });
});
```

---

## 🔗 Recursos Adicionales

- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Background Sync](https://developers.google.com/web/updates/2015/12/background-sync)
- [Push Notifications](https://developers.google.com/web/fundamentals/push-notifications)
- [PWA Checklist](https://web.dev/pwa-checklist/)
