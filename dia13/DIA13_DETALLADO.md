# 📖 Día 13 Detallado: Frontend-Backend Integration

## 🎯 Visión General del Día

El **Día 13** marca un punto crucial en la formación, donde los estudiantes aprenden a integrar efectivamente el frontend con el backend, creando aplicaciones web completas y funcionales. Este día se enfoca en la comunicación entre cliente y servidor, manejo de datos, estados de carga, y técnicas avanzadas de optimización.

## 🕐 Cronograma Detallado

### **12:00-12:30: Fetch API y Async Data Loading**

#### **Objetivos Específicos:**

- Dominar el uso de Fetch API para peticiones HTTP
- Implementar async/await para manejo asíncrono
- Aplicar patrones de carga de datos eficientes
- Manejar diferentes tipos de respuesta HTTP

#### **Contenido Teórico (10 min):**

- **Fetch API:** Introducción y ventajas sobre XMLHttpRequest
- **Promesas:** Conceptos y chain de promesas
- **Async/await:** Sintaxis moderna para código asíncrono
- **Response handling:** Manejo de respuestas HTTP

#### **Actividad Práctica (20 min):**

- **Ejercicio 1:** Cliente REST básico con Fetch
- Implementar GET, POST, PUT, DELETE
- Manejo de headers y body
- Conversión de respuestas JSON

#### **Puntos Clave:**

```javascript
// Ejemplo de implementación
const fetchData = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};
```

---

### **12:30-13:00: Error Handling en Peticiones HTTP**

#### **Objetivos Específicos:**

- Identificar y manejar diferentes tipos de errores HTTP
- Implementar strategies de retry y recuperación
- Proporcionar feedback efectivo al usuario
- Crear logging robusto para debugging

#### **Contenido Teórico (10 min):**

- **Tipos de errores:** Network, HTTP status, parsing
- **HTTP status codes:** 4xx vs 5xx y su manejo
- **Retry strategies:** Exponential backoff, circuit breaker
- **User feedback:** Mensajes de error efectivos

#### **Actividad Práctica (20 min):**

- **Ejercicio 2:** Sistema robusto de error handling
- Implementar retry automático
- Crear mensajes de error user-friendly
- Logging de errores para debugging

#### **Puntos Clave:**

```javascript
// Ejemplo de retry con exponential backoff
const fetchWithRetry = async (url, options = {}, maxRetries = 3) => {
  for (let i = 0; i <= maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;

      if (i === maxRetries) throw new Error('Max retries exceeded');

      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    } catch (error) {
      if (i === maxRetries) throw error;
    }
  }
};
```

---

### **13:00-13:30: Loading States y UX Patterns**

#### **Objetivos Específicos:**

- Implementar estados de carga en componentes React
- Crear skeleton screens y placeholders
- Aplicar patrones de UX para mejorar percepción de rendimiento
- Implementar optimistic UI updates

#### **Contenido Teórico (10 min):**

- **Loading states:** Importancia en UX
- **Skeleton screens:** Ventajas sobre spinners
- **Progressive loading:** Carga progresiva de contenido
- **Optimistic UI:** Actualizaciones anticipadas

#### **Actividad Práctica (20 min):**

- **Ejercicio 3:** Dashboard con estados de carga
- Implementar skeleton screens
- Crear loading indicators contextuales
- Aplicar optimistic updates

#### **Puntos Clave:**

```javascript
// Ejemplo de componente con loading states
const DataComponent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <SkeletonLoader />;
  if (error) return <ErrorMessage error={error} />;
  return <DataDisplay data={data} />;
};
```

---

### **13:30-13:45: 🛑 DESCANSO**

---

### **13:45-14:15: Axios Setup y Interceptors**

#### **Objetivos Específicos:**

- Configurar Axios como cliente HTTP principal
- Implementar interceptors para manejo centralizado
- Configurar autenticación automática
- Establecer base URL y configuración global

#### **Contenido Teórico (10 min):**

- **Axios vs Fetch:** Ventajas y diferencias
- **Interceptors:** Request y response interceptors
- **Instance configuration:** Configuración global
- **Authentication:** Manejo automático de tokens

#### **Actividad Práctica (20 min):**

- **Ejercicio 4:** Cliente HTTP con Axios
- Configurar instance con base URL
- Implementar interceptors de auth
- Manejo centralizado de errores

#### **Puntos Clave:**

```javascript
// Ejemplo de configuración Axios
const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 10000,
});

// Request interceptor
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

### **14:15-14:45: Cache Strategies**

#### **Objetivos Específicos:**

- Implementar estrategias de cache en frontend
- Utilizar localStorage y sessionStorage efectivamente
- Crear sistemas de cache expiration
- Optimizar rendimiento mediante cache inteligente

#### **Contenido Teórico (10 min):**

- **Cache types:** Memory, localStorage, sessionStorage
- **Cache strategies:** Cache-first, network-first, stale-while-revalidate
- **Expiration:** TTL y invalidation strategies
- **Performance impact:** Métricas y optimización

#### **Actividad Práctica (20 min):**

- **Ejercicio 5:** Sistema de cache inteligente
- Implementar cache con TTL
- Cache invalidation automática
- Métricas de hit/miss ratio

#### **Puntos Clave:**

```javascript
// Ejemplo de cache con TTL
class CacheManager {
  constructor(defaultTTL = 300000) {
    // 5 minutos
    this.cache = new Map();
    this.defaultTTL = defaultTTL;
  }

  set(key, value, ttl = this.defaultTTL) {
    const expiry = Date.now() + ttl;
    this.cache.set(key, { value, expiry });
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }
}
```

---

### **14:45-15:15: Offline-First Approaches**

#### **Objetivos Específicos:**

- Implementar estrategias offline-first
- Configurar Service Workers básicos
- Crear fallback strategies para funcionalidad offline
- Sincronizar datos al recuperar conexión

#### **Contenido Teórico (10 min):**

- **Offline-first:** Filosofía y beneficios
- **Service Workers:** Introducción y casos de uso
- **Cache API:** Cache programático
- **Background sync:** Sincronización en background

#### **Actividad Práctica (20 min):**

- **Ejercicio 6:** App que funciona offline
- Implementar Service Worker básico
- Cache de recursos estáticos
- Funcionalidad offline limitada

#### **Puntos Clave:**

```javascript
// Ejemplo de Service Worker básico
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('v1').then(cache => {
      return cache.addAll([
        '/',
        '/static/js/bundle.js',
        '/static/css/main.css',
        '/manifest.json',
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
```

---

### **15:15-15:30: 🛑 DESCANSO**

---

### **15:30-16:00: Real-time Updates (WebSockets básico)**

#### **Objetivos Específicos:**

- Establecer conexiones WebSocket
- Manejar eventos en tiempo real
- Implementar reconexión automática
- Integrar WebSockets con componentes React

#### **Contenido Teórico (10 min):**

- **WebSockets:** Conceptos y ventajas
- **Connection lifecycle:** Open, message, close, error
- **Reconnection strategies:** Automática y manual
- **React integration:** Hooks y componentes

#### **Actividad Práctica (20 min):**

- **Ejercicio 7:** Chat en tiempo real
- Establecer conexión WebSocket
- Enviar y recibir mensajes
- Manejo de desconexiones

#### **Puntos Clave:**

```javascript
// Ejemplo de hook WebSocket
const useWebSocket = url => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log('Connected to WebSocket');
      setSocket(ws);
    };

    ws.onmessage = event => {
      const message = JSON.parse(event.data);
      setMessages(prev => [...prev, message]);
    };

    ws.onclose = () => {
      console.log('Disconnected from WebSocket');
      setSocket(null);
    };

    return () => ws.close();
  }, [url]);

  const sendMessage = message => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  };

  return { messages, sendMessage, connected: !!socket };
};
```

---

### **16:00-16:30: API Pagination y Infinite Scroll**

#### **Objetivos Específicos:**

- Implementar paginación en APIs REST
- Crear infinite scroll eficiente
- Manejar estados de carga en paginación
- Optimizar rendimiento con virtualización

#### **Contenido Teórico (10 min):**

- **Pagination types:** Offset vs cursor-based
- **Infinite scroll:** Técnicas e implementación
- **Virtual scrolling:** Rendimiento con grandes listas
- **UX considerations:** Loading states y feedback

#### **Actividad Práctica (20 min):**

- **Ejercicio 8:** Lista con infinite scroll
- Implementar paginación con backend
- Infinite scroll con Intersection Observer
- Estados de carga y error

#### **Puntos Clave:**

```javascript
// Ejemplo de infinite scroll hook
const useInfiniteScroll = fetchMore => {
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1000
      ) {
        setIsFetching(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isFetching) return;

    fetchMore().then(() => {
      setIsFetching(false);
    });
  }, [isFetching, fetchMore]);

  return [isFetching, setIsFetching];
};
```

---

### **16:30-17:00: 🛑 PROYECTO INTEGRADOR**

#### **Objetivos del Proyecto:**

- Aplicar todas las técnicas aprendidas en el día
- Crear una aplicación full-stack completa
- Demostrar integración efectiva frontend-backend
- Implementar buenas prácticas de UX y rendimiento

#### **Especificaciones del Proyecto:**

- **Frontend:** React con todas las técnicas del día
- **Backend:** Express.js con API REST
- **Features:** CRUD completo, tiempo real, paginación
- **Requisitos:** Estados de carga, manejo de errores, cache

#### **Entregables:**

- Código fuente completo
- Documentación de APIs
- Instrucciones de instalación
- Demo funcional

## 🎯 Competencias Desarrolladas

### **Competencias Técnicas:**

1. **API Integration:** Integración efectiva con APIs REST
2. **State Management:** Manejo de estado del servidor
3. **Error Handling:** Manejo robusto de errores
4. **Performance:** Optimización de carga de datos
5. **Real-time:** Comunicación en tiempo real
6. **UX Design:** Patrones de experiencia de usuario

### **Competencias Blandas:**

1. **Problem Solving:** Resolución de problemas de integración
2. **Attention to Detail:** Atención a detalles de UX
3. **Communication:** Comunicación efectiva entre componentes
4. **Optimization:** Mentalidad de optimización
5. **User Focus:** Enfoque en experiencia del usuario

## 🏆 Criterios de Éxito

### **Criterios Técnicos:**

- **Funcionalidad:** 100% de funcionalidades implementadas
- **Integración:** Comunicación fluida frontend-backend
- **Performance:** Optimización efectiva de carga
- **Error Handling:** Manejo robusto de errores
- **Code Quality:** Código limpio y bien estructurado

### **Criterios de UX:**

- **Loading States:** Estados de carga claros
- **Error Messages:** Mensajes de error útiles
- **Responsiveness:** Aplicación responsive
- **Accessibility:** Consideraciones de accesibilidad
- **Performance:** Percepciones de velocidad

## 📚 Recursos Adicionales

### **Documentación:**

- [Fetch API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [Axios Documentation](https://axios-http.com/)
- [WebSocket API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

### **Herramientas:**

- React DevTools para debugging
- Network tab para análisis de requests
- Performance tab para optimización
- Application tab para cache y storage

### **Bibliotecas Recomendadas:**

- `react-query` para server state management
- `swr` para data fetching
- `socket.io-client` para WebSockets
- `react-intersection-observer` para infinite scroll

## 🎯 Preparación para el Día 14

### **Conexión con Testing:**

- El código desarrollado hoy será base para testing
- Patrones de error handling serán útiles para testing
- Componentes con estados de carga necesitarán testing
- Integración será testeada en el siguiente día

### **Conceptos a Repasar:**

- Debugging de aplicaciones integradas
- Análisis de performance de requests
- Testing de componentes con estado asíncrono
- Mocking de APIs para testing

¡El Día 13 sienta las bases para crear aplicaciones web profesionales y completamente integradas! 🚀
