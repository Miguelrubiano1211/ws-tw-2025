# 📚 Día 13: Recursos y Documentación

## 📖 Documentación Oficial

### **JavaScript y APIs Web**

- [MDN Web Docs - Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [MDN Web Docs - WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
- [MDN Web Docs - Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [MDN Web Docs - Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [MDN Web Docs - IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)

### **React.js**

- [React Hooks Reference](https://reactjs.org/docs/hooks-reference.html)
- [React Performance Optimization](https://reactjs.org/docs/optimizing-performance.html)
- [React Error Boundaries](https://reactjs.org/docs/error-boundaries.html)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

### **Node.js y Express.js**

- [Express.js Official Guide](https://expressjs.com/en/guide/)
- [Node.js Best Practices](https://nodejs.org/en/docs/guides/best-practices/)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Node.js Error Handling](https://nodejs.org/en/docs/guides/error-handling/)

### **Bases de Datos**

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose ODM](https://mongoosejs.com/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Redis Documentation](https://redis.io/documentation)

---

## 🛠️ Herramientas de Desarrollo

### **HTTP Clients**

- [Axios Documentation](https://axios-http.com/docs/intro)
- [Fetch API Polyfill](https://github.com/github/fetch)
- [SWR - Data Fetching Library](https://swr.vercel.app/)
- [React Query](https://tanstack.com/query/latest)

### **Estado y Context**

- [React Context API](https://reactjs.org/docs/context.html)
- [useReducer Hook](https://reactjs.org/docs/hooks-reference.html#usereducer)
- [Zustand State Management](https://github.com/pmndrs/zustand)
- [Redux Toolkit](https://redux-toolkit.js.org/)

### **WebSockets y Real-time**

- [Socket.io Documentation](https://socket.io/docs/)
- [WebSocket MDN Guide](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications)
- [Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)

### **Testing**

- [Jest Testing Framework](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)
- [Supertest for API Testing](https://github.com/ladjs/supertest)
- [Cypress E2E Testing](https://docs.cypress.io/)

---

## 🔧 Configuración y Setup

### **Configuración de Axios**

```javascript
// axios.config.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
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
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### **Configuración de WebSocket**

```javascript
// websocket.config.js
class WebSocketService {
  constructor() {
    this.ws = null;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect(url) {
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = event => {
      const data = JSON.parse(event.data);
      this.emit(data.type, data);
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.handleReconnect();
    };
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => callback(data));
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        this.connect(this.url);
      }, Math.pow(2, this.reconnectAttempts) * 1000);
    }
  }
}

export default new WebSocketService();
```

### **Configuración de Service Worker**

```javascript
// sw.js
const CACHE_NAME = 'app-cache-v1';
const urlsToCache = [
  '/',
  '/static/css/main.css',
  '/static/js/main.js',
  '/offline.html',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});
```

---

## 🎯 Patrones y Best Practices

### **Error Handling Pattern**

```javascript
// Error handling utility
export const handleApiError = error => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;

    switch (status) {
      case 400:
        return { message: 'Solicitud inválida', details: data.errors };
      case 401:
        return { message: 'No autorizado', redirect: '/login' };
      case 403:
        return { message: 'Acceso denegado' };
      case 404:
        return { message: 'Recurso no encontrado' };
      case 500:
        return { message: 'Error interno del servidor' };
      default:
        return { message: 'Error desconocido' };
    }
  } else if (error.request) {
    // Network error
    return { message: 'Error de conexión', offline: true };
  } else {
    // Other error
    return { message: error.message || 'Error desconocido' };
  }
};
```

### **Loading States Pattern**

```javascript
// Loading states hook
export const useLoadingState = () => {
  const [loadingStates, setLoadingStates] = useState({});

  const setLoading = (key, isLoading) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: isLoading,
    }));
  };

  const isLoading = key => loadingStates[key] || false;

  const withLoading = (key, asyncFn) => {
    return async (...args) => {
      setLoading(key, true);
      try {
        const result = await asyncFn(...args);
        return result;
      } finally {
        setLoading(key, false);
      }
    };
  };

  return { setLoading, isLoading, withLoading };
};
```

### **Cache Strategy Pattern**

```javascript
// Cache strategy implementation
export class CacheStrategy {
  constructor(strategy = 'stale-while-revalidate', ttl = 300000) {
    this.strategy = strategy;
    this.ttl = ttl;
    this.cache = new Map();
  }

  async get(key, fetchFn) {
    const cached = this.cache.get(key);
    const now = Date.now();

    switch (this.strategy) {
      case 'cache-first':
        if (cached && now - cached.timestamp < this.ttl) {
          return cached.data;
        }
        break;

      case 'stale-while-revalidate':
        if (cached) {
          // Return cached data immediately
          if (now - cached.timestamp < this.ttl) {
            return cached.data;
          } else {
            // Background refresh
            this.refreshCache(key, fetchFn);
            return cached.data;
          }
        }
        break;
    }

    // Fetch fresh data
    const data = await fetchFn();
    this.cache.set(key, {
      data,
      timestamp: now,
    });

    return data;
  }

  async refreshCache(key, fetchFn) {
    try {
      const data = await fetchFn();
      this.cache.set(key, {
        data,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('Background refresh failed:', error);
    }
  }
}
```

---

## 🔍 Debugging y Herramientas

### **React DevTools**

```javascript
// Debug hook for development
export const useDebugValue = (value, formatFn) => {
  if (process.env.NODE_ENV === 'development') {
    React.useDebugValue(value, formatFn);
  }
};

// Performance monitoring
export const usePerformanceMonitor = componentName => {
  useEffect(() => {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      console.log(`${componentName} render time: ${endTime - startTime}ms`);
    };
  });
};
```

### **Network Monitoring**

```javascript
// Network status monitoring
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};
```

---

## 📊 Performance Optimization

### **Bundle Analysis**

```bash
# Analyze bundle size
npm install --save-dev webpack-bundle-analyzer
npm run build
npx webpack-bundle-analyzer build/static/js/*.js
```

### **Code Splitting**

```javascript
// Route-based code splitting
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./components/Dashboard'));
const Users = lazy(() => import('./components/Users'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />
        <Route
          path="/users"
          element={<Users />}
        />
      </Routes>
    </Suspense>
  );
}
```

### **Memoization**

```javascript
// React.memo for component memoization
export const ProductCard = React.memo(({ product, onEdit, onDelete }) => {
  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <div className="actions">
        <button onClick={() => onEdit(product.id)}>Edit</button>
        <button onClick={() => onDelete(product.id)}>Delete</button>
      </div>
    </div>
  );
});

// useMemo for expensive calculations
export const useFilteredProducts = (products, filter) => {
  return useMemo(() => {
    return products.filter(
      product =>
        product.name.toLowerCase().includes(filter.toLowerCase()) ||
        product.description.toLowerCase().includes(filter.toLowerCase())
    );
  }, [products, filter]);
};
```

---

## 🧪 Testing Examples

### **Component Testing**

```javascript
// ProductCard.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from './ProductCard';

describe('ProductCard', () => {
  const mockProduct = {
    id: 1,
    name: 'Test Product',
    description: 'Test Description',
    price: 99.99,
  };

  it('renders product information', () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    const mockOnEdit = jest.fn();
    render(
      <ProductCard
        product={mockProduct}
        onEdit={mockOnEdit}
      />
    );

    fireEvent.click(screen.getByText('Edit'));
    expect(mockOnEdit).toHaveBeenCalledWith(1);
  });
});
```

### **API Testing**

```javascript
// api.test.js
import request from 'supertest';
import app from '../src/app';

describe('Products API', () => {
  it('should get all products', async () => {
    const response = await request(app).get('/api/products').expect(200);

    expect(response.body).toHaveProperty('products');
    expect(Array.isArray(response.body.products)).toBe(true);
  });

  it('should create a new product', async () => {
    const newProduct = {
      name: 'New Product',
      description: 'New Description',
      price: 49.99,
    };

    const response = await request(app)
      .post('/api/products')
      .send(newProduct)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('New Product');
  });
});
```

---

## 🚀 Deployment

### **Environment Variables**

```bash
# .env.example
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_WS_URL=ws://localhost:8080
REACT_APP_ENVIRONMENT=development

# Backend .env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/dashboard
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:3000
```

### **Docker Configuration**

```dockerfile
# Dockerfile.frontend
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### **GitHub Actions CI/CD**

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Run build
        run: npm run build
```

---

## 📚 Recursos Adicionales

### **Librerías Útiles**

- [React Hook Form](https://react-hook-form.com/) - Manejo de formularios
- [React Router](https://reactrouter.com/) - Routing para React
- [Framer Motion](https://www.framer.com/motion/) - Animaciones
- [React Query](https://tanstack.com/query/latest) - Server state management
- [Formik](https://formik.org/) - Formularios avanzados

### **Blogs y Tutoriales**

- [React Best Practices](https://kentcdodds.com/blog/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [JavaScript Performance](https://web.dev/javascript/)
- [Modern Web Development](https://web.dev/)

### **Herramientas de Monitoreo**

- [Sentry](https://sentry.io/) - Error tracking
- [LogRocket](https://logrocket.com/) - Session replay
- [New Relic](https://newrelic.com/) - Performance monitoring
- [Datadog](https://www.datadoghq.com/) - Infrastructure monitoring

---

¡Estos recursos te ayudarán a dominar la integración Frontend-Backend! 🚀
