# 🌐 Guía de Patrones de Integración con APIs

## 📑 Índice

1. [Fundamentos](#fundamentos)
2. [Fetch API Avanzado](#fetch-api-avanzado)
3. [Cliente HTTP Robusto](#cliente-http-robusto)
4. [Manejo de Autenticación](#manejo-de-autenticación)
5. [Caching Inteligente](#caching-inteligente)
6. [Rate Limiting](#rate-limiting)
7. [Retry y Resilencia](#retry-y-resilencia)
8. [Optimización de Performance](#optimización-de-performance)
9. [Patrones Avanzados](#patrones-avanzados)
10. [Mejores Prácticas](#mejores-prácticas)

## 🎯 Fundamentos

### ¿Por qué son Importantes los Patrones de API?

Los patrones de integración con APIs son cruciales para:

- **Reliability**: Manejar fallos de red y servicios
- **Performance**: Optimizar velocidad y uso de recursos
- **User Experience**: Proporcionar feedback apropiado
- **Maintainability**: Código reutilizable y escalable

### Anatomía de una Llamada API

```javascript
// Estructura básica
async function llamadaAPI() {
  try {
    // 1. Preparar request
    const url = 'https://api.ejemplo.com/datos';
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token',
      },
    };

    // 2. Realizar request
    const response = await fetch(url, options);

    // 3. Validar response
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // 4. Procesar datos
    const data = await response.json();

    // 5. Retornar resultado
    return data;
  } catch (error) {
    // 6. Manejar errores
    console.error('Error en API:', error);
    throw error;
  }
}
```

## 🚀 Fetch API Avanzado

### Configuración Avanzada

```javascript
// Configuración completa de fetch
async function fetchAvanzado(url, options = {}) {
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers,
    },
    // Configuraciones adicionales
    cache: 'no-cache',
    credentials: 'same-origin',
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    ...options,
  };

  // Agregar body si es POST/PUT/PATCH
  if (['POST', 'PUT', 'PATCH'].includes(config.method) && options.data) {
    config.body = JSON.stringify(options.data);
  }

  try {
    const response = await fetch(url, config);

    // Manejar diferentes tipos de respuesta
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else if (contentType && contentType.includes('text/')) {
      return await response.text();
    } else {
      return await response.blob();
    }
  } catch (error) {
    throw new Error(`Network error: ${error.message}`);
  }
}
```

### Manejo de Diferentes Tipos de Respuesta

```javascript
class ResponseHandler {
  static async handleResponse(response) {
    const contentType = response.headers.get('content-type');

    if (!response.ok) {
      const error = await this.handleError(response);
      throw error;
    }

    if (contentType?.includes('application/json')) {
      return await response.json();
    }

    if (contentType?.includes('text/')) {
      return await response.text();
    }

    if (contentType?.includes('application/octet-stream')) {
      return await response.blob();
    }

    if (contentType?.includes('multipart/form-data')) {
      return await response.formData();
    }

    return await response.text();
  }

  static async handleError(response) {
    const contentType = response.headers.get('content-type');

    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    let errorDetails = null;

    try {
      if (contentType?.includes('application/json')) {
        errorDetails = await response.json();
        errorMessage = errorDetails.message || errorMessage;
      } else {
        errorDetails = await response.text();
      }
    } catch (parseError) {
      // Si no se puede parsear, usar mensaje por defecto
    }

    const error = new Error(errorMessage);
    error.status = response.status;
    error.details = errorDetails;
    error.response = response;

    return error;
  }
}

// Uso
async function ejemploManejo() {
  try {
    const response = await fetch('/api/datos');
    const data = await ResponseHandler.handleResponse(response);
    return data;
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Status:', error.status);
    console.error('Details:', error.details);
    throw error;
  }
}
```

### Request Interceptors

```javascript
class RequestInterceptor {
  constructor() {
    this.beforeRequest = [];
    this.afterResponse = [];
  }

  addBeforeRequest(interceptor) {
    this.beforeRequest.push(interceptor);
  }

  addAfterResponse(interceptor) {
    this.afterResponse.push(interceptor);
  }

  async fetch(url, options = {}) {
    // Ejecutar interceptors de request
    let requestOptions = options;
    for (const interceptor of this.beforeRequest) {
      requestOptions = await interceptor(url, requestOptions);
    }

    // Realizar request
    const response = await fetch(url, requestOptions);

    // Ejecutar interceptors de response
    let processedResponse = response;
    for (const interceptor of this.afterResponse) {
      processedResponse = await interceptor(processedResponse);
    }

    return processedResponse;
  }
}

// Configurar interceptors
const interceptor = new RequestInterceptor();

// Agregar token automáticamente
interceptor.addBeforeRequest(async (url, options) => {
  const token = await getAuthToken();
  return {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  };
});

// Log de requests
interceptor.addBeforeRequest(async (url, options) => {
  console.log(`Request: ${options.method || 'GET'} ${url}`);
  return options;
});

// Log de responses
interceptor.addAfterResponse(async response => {
  console.log(`Response: ${response.status} ${response.url}`);
  return response;
});
```

## 🏗️ Cliente HTTP Robusto

### Clase Base

```javascript
class HttpClient {
  constructor(baseURL = '', options = {}) {
    this.baseURL = baseURL;
    this.defaultOptions = {
      timeout: 10000,
      retries: 3,
      retryDelay: 1000,
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    this.interceptors = {
      request: [],
      response: [],
    };
  }

  // Interceptors
  addRequestInterceptor(interceptor) {
    this.interceptors.request.push(interceptor);
  }

  addResponseInterceptor(interceptor) {
    this.interceptors.response.push(interceptor);
  }

  // Método principal
  async request(endpoint, options = {}) {
    const url = this.baseURL + endpoint;
    let config = {
      ...this.defaultOptions,
      ...options,
      headers: {
        ...this.defaultOptions.headers,
        ...options.headers,
      },
    };

    // Aplicar interceptors de request
    for (const interceptor of this.interceptors.request) {
      config = await interceptor(config);
    }

    // Realizar request con retry
    const response = await this.requestWithRetry(url, config);

    // Aplicar interceptors de response
    let processedResponse = response;
    for (const interceptor of this.interceptors.response) {
      processedResponse = await interceptor(processedResponse);
    }

    return processedResponse;
  }

  async requestWithRetry(url, config) {
    const { retries, retryDelay, timeout } = config;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        // Aplicar timeout
        const response = await this.withTimeout(fetch(url, config), timeout);

        if (response.ok) {
          return response;
        }

        // Si es el último intento o error no recuperable
        if (attempt === retries || !this.shouldRetry(response.status)) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        if (attempt === retries) {
          throw error;
        }

        console.log(`Intento ${attempt + 1} falló, reintentando...`);
        await this.delay(retryDelay * Math.pow(2, attempt));
      }
    }
  }

  async withTimeout(promise, timeout) {
    return Promise.race([
      promise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), timeout)
      ),
    ]);
  }

  shouldRetry(status) {
    // Retry en errores 5xx y algunos 4xx
    return status >= 500 || status === 429 || status === 408;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Métodos de conveniencia
  async get(endpoint, params = {}) {
    const url = new URL(endpoint, this.baseURL);
    Object.keys(params).forEach(key =>
      url.searchParams.append(key, params[key])
    );

    return this.request(url.pathname + url.search);
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }
}
```

### Uso del Cliente

```javascript
// Crear instancia
const apiClient = new HttpClient('https://api.ejemplo.com', {
  timeout: 15000,
  retries: 5,
});

// Configurar interceptors
apiClient.addRequestInterceptor(async config => {
  // Agregar timestamp
  config.headers['X-Request-Time'] = Date.now();
  return config;
});

apiClient.addResponseInterceptor(async response => {
  // Log de response
  const responseTime = Date.now() - response.headers.get('X-Request-Time');
  console.log(`Response time: ${responseTime}ms`);
  return response;
});

// Usar el cliente
async function ejemploUso() {
  try {
    // GET con parámetros
    const usuarios = await apiClient.get('/usuarios', {
      page: 1,
      limit: 10,
    });

    // POST con datos
    const nuevoUsuario = await apiClient.post('/usuarios', {
      nombre: 'Juan',
      email: 'juan@ejemplo.com',
    });

    // PUT para actualizar
    const usuarioActualizado = await apiClient.put('/usuarios/123', {
      nombre: 'Juan Actualizado',
    });

    // DELETE
    await apiClient.delete('/usuarios/123');

    return { usuarios, nuevoUsuario, usuarioActualizado };
  } catch (error) {
    console.error('Error en operaciones:', error);
    throw error;
  }
}
```

## 🔐 Manejo de Autenticación

### JWT Token Management

```javascript
class TokenManager {
  constructor() {
    this.token = localStorage.getItem('authToken');
    this.refreshToken = localStorage.getItem('refreshToken');
    this.tokenExpiry = localStorage.getItem('tokenExpiry');
  }

  setTokens(token, refreshToken, expiresIn) {
    this.token = token;
    this.refreshToken = refreshToken;
    this.tokenExpiry = Date.now() + expiresIn * 1000;

    localStorage.setItem('authToken', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('tokenExpiry', this.tokenExpiry);
  }

  clearTokens() {
    this.token = null;
    this.refreshToken = null;
    this.tokenExpiry = null;

    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpiry');
  }

  isTokenExpired() {
    return Date.now() >= this.tokenExpiry;
  }

  async getValidToken() {
    if (!this.token) {
      throw new Error('No token available');
    }

    if (this.isTokenExpired()) {
      await this.refreshTokens();
    }

    return this.token;
  }

  async refreshTokens() {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken: this.refreshToken,
        }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const { token, refreshToken, expiresIn } = await response.json();
      this.setTokens(token, refreshToken, expiresIn);
    } catch (error) {
      this.clearTokens();
      throw error;
    }
  }
}

// Integrar con cliente HTTP
class AuthenticatedHttpClient extends HttpClient {
  constructor(baseURL, options = {}) {
    super(baseURL, options);
    this.tokenManager = new TokenManager();

    // Agregar interceptor de autenticación
    this.addRequestInterceptor(async config => {
      try {
        const token = await this.tokenManager.getValidToken();
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        // Redirigir a login si no hay token válido
        window.location.href = '/login';
        throw error;
      }

      return config;
    });

    // Interceptor para manejar 401
    this.addResponseInterceptor(async response => {
      if (response.status === 401) {
        this.tokenManager.clearTokens();
        window.location.href = '/login';
      }

      return response;
    });
  }

  async login(credentials) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const { token, refreshToken, expiresIn } = await response.json();
      this.tokenManager.setTokens(token, refreshToken, expiresIn);

      return true;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  logout() {
    this.tokenManager.clearTokens();
    window.location.href = '/login';
  }
}
```

## 💾 Caching Inteligente

### HTTP Cache Implementation

```javascript
class HttpCache {
  constructor() {
    this.cache = new Map();
    this.timestamps = new Map();
    this.defaultTTL = 5 * 60 * 1000; // 5 minutos
  }

  generateKey(url, options) {
    const method = options.method || 'GET';
    const headers = JSON.stringify(options.headers || {});
    const body = options.body || '';

    return `${method}:${url}:${headers}:${body}`;
  }

  set(key, data, ttl = this.defaultTTL) {
    this.cache.set(key, data);
    this.timestamps.set(key, Date.now() + ttl);
  }

  get(key) {
    const timestamp = this.timestamps.get(key);

    if (!timestamp || Date.now() > timestamp) {
      this.cache.delete(key);
      this.timestamps.delete(key);
      return null;
    }

    return this.cache.get(key);
  }

  clear() {
    this.cache.clear();
    this.timestamps.clear();
  }

  delete(key) {
    this.cache.delete(key);
    this.timestamps.delete(key);
  }

  // Limpiar entradas expiradas
  cleanup() {
    const now = Date.now();

    for (const [key, timestamp] of this.timestamps) {
      if (now > timestamp) {
        this.cache.delete(key);
        this.timestamps.delete(key);
      }
    }
  }
}

// Cliente con cache
class CachedHttpClient extends HttpClient {
  constructor(baseURL, options = {}) {
    super(baseURL, options);
    this.cache = new HttpCache();

    // Limpiar cache periódicamente
    setInterval(() => this.cache.cleanup(), 60000); // Cada minuto
  }

  async request(endpoint, options = {}) {
    const method = options.method || 'GET';

    // Solo cachear GET requests
    if (method !== 'GET') {
      return super.request(endpoint, options);
    }

    const url = this.baseURL + endpoint;
    const cacheKey = this.cache.generateKey(url, options);

    // Verificar cache
    const cachedResponse = this.cache.get(cacheKey);
    if (cachedResponse) {
      console.log('Cache hit:', url);
      return cachedResponse;
    }

    // Realizar request
    const response = await super.request(endpoint, options);

    // Cachear respuesta
    this.cache.set(cacheKey, response, options.cacheTTL);
    console.log('Cache miss:', url);

    return response;
  }

  // Método para invalidar cache
  invalidateCache(pattern) {
    const keys = Array.from(this.cache.cache.keys());

    keys.forEach(key => {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    });
  }
}
```

### Cache con Storage Persistence

```javascript
class PersistentCache {
  constructor(prefix = 'api-cache') {
    this.prefix = prefix;
    this.storage = localStorage;
  }

  generateKey(url, options) {
    const method = options.method || 'GET';
    const params = JSON.stringify(options.params || {});
    return `${this.prefix}:${method}:${url}:${params}`;
  }

  set(key, data, ttl = 300000) {
    // 5 minutos por defecto
    const item = {
      data,
      timestamp: Date.now(),
      ttl,
    };

    try {
      this.storage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.warn('Failed to cache data:', error);
    }
  }

  get(key) {
    try {
      const item = this.storage.getItem(key);
      if (!item) return null;

      const parsed = JSON.parse(item);

      if (Date.now() - parsed.timestamp > parsed.ttl) {
        this.storage.removeItem(key);
        return null;
      }

      return parsed.data;
    } catch (error) {
      console.warn('Failed to get cached data:', error);
      return null;
    }
  }

  clear() {
    const keys = [];

    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key.startsWith(this.prefix)) {
        keys.push(key);
      }
    }

    keys.forEach(key => this.storage.removeItem(key));
  }

  cleanup() {
    const keys = [];

    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key.startsWith(this.prefix)) {
        const item = this.get(key);
        if (!item) {
          keys.push(key);
        }
      }
    }

    keys.forEach(key => this.storage.removeItem(key));
  }
}
```

## 🚦 Rate Limiting

### Client-Side Rate Limiter

```javascript
class RateLimiter {
  constructor(maxRequests = 100, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = [];
  }

  async waitForSlot() {
    const now = Date.now();

    // Limpiar requests antiguos
    this.requests = this.requests.filter(
      timestamp => now - timestamp < this.windowMs
    );

    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = Math.min(...this.requests);
      const waitTime = this.windowMs - (now - oldestRequest);

      console.log(`Rate limit reached, waiting ${waitTime}ms`);
      await this.delay(waitTime);

      return this.waitForSlot();
    }

    this.requests.push(now);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Cliente con rate limiting
class RateLimitedHttpClient extends HttpClient {
  constructor(baseURL, options = {}) {
    super(baseURL, options);
    this.rateLimiter = new RateLimiter(
      options.maxRequests || 100,
      options.windowMs || 60000
    );
  }

  async request(endpoint, options = {}) {
    // Esperar slot disponible
    await this.rateLimiter.waitForSlot();

    // Realizar request
    return super.request(endpoint, options);
  }
}
```

### Adaptive Rate Limiting

```javascript
class AdaptiveRateLimiter {
  constructor(initialRate = 100, windowMs = 60000) {
    this.initialRate = initialRate;
    this.currentRate = initialRate;
    this.windowMs = windowMs;
    this.requests = [];
    this.successCount = 0;
    this.errorCount = 0;
  }

  async waitForSlot() {
    const now = Date.now();

    // Limpiar requests antiguos
    this.requests = this.requests.filter(
      req => now - req.timestamp < this.windowMs
    );

    if (this.requests.length >= this.currentRate) {
      const oldestRequest = Math.min(...this.requests.map(r => r.timestamp));
      const waitTime = this.windowMs - (now - oldestRequest);

      await this.delay(waitTime);
      return this.waitForSlot();
    }

    this.requests.push({ timestamp: now });
  }

  onSuccess() {
    this.successCount++;
    this.adaptRate();
  }

  onError(error) {
    this.errorCount++;

    // Si es error 429, reducir rate inmediatamente
    if (error.status === 429) {
      this.currentRate = Math.max(1, this.currentRate * 0.5);
      console.log(`Rate limit hit, reducing to ${this.currentRate} requests`);
    }

    this.adaptRate();
  }

  adaptRate() {
    const totalRequests = this.successCount + this.errorCount;

    if (totalRequests > 0) {
      const errorRate = this.errorCount / totalRequests;

      if (errorRate > 0.1) {
        // Muchos errores, reducir rate
        this.currentRate = Math.max(1, this.currentRate * 0.8);
      } else if (errorRate < 0.05) {
        // Pocos errores, aumentar rate gradualmente
        this.currentRate = Math.min(this.initialRate, this.currentRate * 1.1);
      }
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

## 🔄 Retry y Resilencia

### Retry con Jitter

```javascript
class RetryHandler {
  constructor(options = {}) {
    this.maxRetries = options.maxRetries || 3;
    this.baseDelay = options.baseDelay || 1000;
    this.maxDelay = options.maxDelay || 30000;
    this.jitter = options.jitter || 0.1;
    this.backoffFactor = options.backoffFactor || 2;
  }

  async execute(operation, retryCondition = this.defaultRetryCondition) {
    let lastError;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;

        if (attempt === this.maxRetries || !retryCondition(error)) {
          throw error;
        }

        const delay = this.calculateDelay(attempt);
        console.log(`Retry ${attempt + 1}/${this.maxRetries} after ${delay}ms`);

        await this.sleep(delay);
      }
    }

    throw lastError;
  }

  calculateDelay(attempt) {
    const exponentialDelay =
      this.baseDelay * Math.pow(this.backoffFactor, attempt);
    const jitterRange = exponentialDelay * this.jitter;
    const jitter = (Math.random() - 0.5) * 2 * jitterRange;

    return Math.min(this.maxDelay, exponentialDelay + jitter);
  }

  defaultRetryCondition(error) {
    // Retry en errores de red y 5xx
    return (
      error.name === 'TypeError' ||
      (error.status && error.status >= 500) ||
      error.status === 429
    );
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

### Circuit Breaker para APIs

```javascript
class ApiCircuitBreaker {
  constructor(options = {}) {
    this.failureThreshold = options.failureThreshold || 5;
    this.timeout = options.timeout || 60000;
    this.resetTimeout = options.resetTimeout || 30000;
    this.state = 'CLOSED';
    this.failureCount = 0;
    this.lastFailureTime = null;
    this.successCount = 0;
    this.stats = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
    };
  }

  async execute(operation) {
    this.stats.totalRequests++;

    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.resetTimeout) {
        this.state = 'HALF_OPEN';
        console.log('Circuit breaker: OPEN -> HALF_OPEN');
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.failureCount = 0;
    this.successCount++;
    this.stats.successfulRequests++;

    if (this.state === 'HALF_OPEN') {
      this.state = 'CLOSED';
      console.log('Circuit breaker: HALF_OPEN -> CLOSED');
    }
  }

  onFailure() {
    this.failureCount++;
    this.stats.failedRequests++;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
      console.log('Circuit breaker: CLOSED -> OPEN');
    }
  }

  getStats() {
    return {
      ...this.stats,
      state: this.state,
      successRate:
        this.stats.totalRequests > 0
          ? (
              (this.stats.successfulRequests / this.stats.totalRequests) *
              100
            ).toFixed(2) + '%'
          : '0%',
    };
  }
}
```

## ⚡ Optimización de Performance

### Request Batching

```javascript
class RequestBatcher {
  constructor(options = {}) {
    this.batchSize = options.batchSize || 10;
    this.batchDelay = options.batchDelay || 100;
    this.queue = [];
    this.timer = null;
  }

  async add(request) {
    return new Promise((resolve, reject) => {
      this.queue.push({ request, resolve, reject });

      if (this.queue.length >= this.batchSize) {
        this.flush();
      } else if (!this.timer) {
        this.timer = setTimeout(() => this.flush(), this.batchDelay);
      }
    });
  }

  flush() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    if (this.queue.length === 0) return;

    const batch = this.queue.splice(0, this.batchSize);
    this.processBatch(batch);
  }

  async processBatch(batch) {
    try {
      // Procesar requests en paralelo
      const results = await Promise.allSettled(
        batch.map(({ request }) => request())
      );

      // Resolver promesas individuales
      results.forEach((result, index) => {
        const { resolve, reject } = batch[index];

        if (result.status === 'fulfilled') {
          resolve(result.value);
        } else {
          reject(result.reason);
        }
      });
    } catch (error) {
      // Rechazar todas las promesas
      batch.forEach(({ reject }) => reject(error));
    }
  }
}

// Cliente con batching
class BatchedHttpClient extends HttpClient {
  constructor(baseURL, options = {}) {
    super(baseURL, options);
    this.batcher = new RequestBatcher(options);
  }

  async get(endpoint, params = {}) {
    return this.batcher.add(() => super.get(endpoint, params));
  }
}
```

### Response Compression

```javascript
class CompressedHttpClient extends HttpClient {
  constructor(baseURL, options = {}) {
    super(baseURL, options);

    // Agregar headers de compresión
    this.defaultOptions.headers = {
      ...this.defaultOptions.headers,
      'Accept-Encoding': 'gzip, deflate, br',
    };
  }

  async request(endpoint, options = {}) {
    const response = await super.request(endpoint, options);

    // Log de compresión
    const contentEncoding = response.headers.get('content-encoding');
    if (contentEncoding) {
      console.log(`Response compressed with: ${contentEncoding}`);
    }

    return response;
  }
}
```

## 🎨 Patrones Avanzados

### GraphQL Client

```javascript
class GraphQLClient {
  constructor(endpoint, options = {}) {
    this.endpoint = endpoint;
    this.headers = options.headers || {};
    this.httpClient = new HttpClient();
  }

  async query(query, variables = {}) {
    const response = await this.httpClient.post(this.endpoint, {
      query,
      variables,
    });

    if (response.errors) {
      throw new Error(`GraphQL Error: ${response.errors[0].message}`);
    }

    return response.data;
  }

  async mutation(mutation, variables = {}) {
    return this.query(mutation, variables);
  }

  // Query builder helper
  buildQuery(fields, conditions = {}) {
    const conditionStr =
      Object.keys(conditions).length > 0
        ? `(${Object.entries(conditions)
            .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
            .join(', ')})`
        : '';

    return `{
            ${fields.join('\n')}
        }${conditionStr}`;
  }
}
```

### WebSocket API Client

```javascript
class WebSocketApiClient {
  constructor(url, options = {}) {
    this.url = url;
    this.options = options;
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = options.maxReconnectAttempts || 5;
    this.reconnectDelay = options.reconnectDelay || 1000;
    this.listeners = new Map();
    this.messageId = 0;
    this.pendingMessages = new Map();
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
        resolve();
      };

      this.ws.onmessage = event => {
        this.handleMessage(JSON.parse(event.data));
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.reconnect();
      };

      this.ws.onerror = error => {
        console.error('WebSocket error:', error);
        reject(error);
      };
    });
  }

  async send(type, data) {
    const messageId = ++this.messageId;
    const message = {
      id: messageId,
      type,
      data,
    };

    return new Promise((resolve, reject) => {
      this.pendingMessages.set(messageId, { resolve, reject });
      this.ws.send(JSON.stringify(message));
    });
  }

  handleMessage(message) {
    const { id, type, data } = message;

    if (id && this.pendingMessages.has(id)) {
      const { resolve } = this.pendingMessages.get(id);
      this.pendingMessages.delete(id);
      resolve(data);
    }

    // Notificar listeners
    if (this.listeners.has(type)) {
      this.listeners.get(type).forEach(callback => callback(data));
    }
  }

  on(type, callback) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }

    this.listeners.get(type).push(callback);
  }

  off(type, callback) {
    if (this.listeners.has(type)) {
      const callbacks = this.listeners.get(type);
      const index = callbacks.indexOf(callback);

      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  async reconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    console.log(
      `Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`
    );

    setTimeout(() => {
      this.connect();
    }, delay);
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
```

## ✅ Mejores Prácticas

### 1. Manejo de Estados de Carga

```javascript
class LoadingStateManager {
  constructor() {
    this.loadingStates = new Map();
    this.callbacks = new Map();
  }

  setLoading(key, isLoading) {
    this.loadingStates.set(key, isLoading);

    if (this.callbacks.has(key)) {
      this.callbacks.get(key).forEach(callback => callback(isLoading));
    }
  }

  isLoading(key) {
    return this.loadingStates.get(key) || false;
  }

  onLoadingChange(key, callback) {
    if (!this.callbacks.has(key)) {
      this.callbacks.set(key, []);
    }

    this.callbacks.get(key).push(callback);
  }

  async withLoading(key, operation) {
    this.setLoading(key, true);

    try {
      const result = await operation();
      return result;
    } finally {
      this.setLoading(key, false);
    }
  }
}

// Uso
const loadingManager = new LoadingStateManager();

loadingManager.onLoadingChange('users', isLoading => {
  document.getElementById('loading-spinner').style.display = isLoading
    ? 'block'
    : 'none';
});

async function cargarUsuarios() {
  return loadingManager.withLoading('users', async () => {
    return await apiClient.get('/usuarios');
  });
}
```

### 2. Validación de Datos

```javascript
class DataValidator {
  static validate(data, schema) {
    const errors = [];

    for (const [field, rules] of Object.entries(schema)) {
      const value = data[field];

      if (rules.required && !value) {
        errors.push(`${field} es requerido`);
        continue;
      }

      if (value && rules.type && typeof value !== rules.type) {
        errors.push(`${field} debe ser de tipo ${rules.type}`);
      }

      if (value && rules.pattern && !rules.pattern.test(value)) {
        errors.push(`${field} no tiene el formato correcto`);
      }

      if (value && rules.min && value.length < rules.min) {
        errors.push(`${field} debe tener al menos ${rules.min} caracteres`);
      }

      if (value && rules.max && value.length > rules.max) {
        errors.push(`${field} debe tener máximo ${rules.max} caracteres`);
      }
    }

    return errors;
  }
}

// Cliente con validación
class ValidatedHttpClient extends HttpClient {
  async post(endpoint, data, schema) {
    if (schema) {
      const errors = DataValidator.validate(data, schema);
      if (errors.length > 0) {
        throw new Error(`Errores de validación: ${errors.join(', ')}`);
      }
    }

    return super.post(endpoint, data);
  }
}
```

### 3. Paginación Automática

```javascript
class PaginatedApiClient {
  constructor(httpClient) {
    this.httpClient = httpClient;
  }

  async getAll(endpoint, options = {}) {
    const {
      pageSize = 20,
      maxPages = 10,
      pageParam = 'page',
      sizeParam = 'limit',
    } = options;

    const results = [];
    let currentPage = 1;
    let hasMore = true;

    while (hasMore && currentPage <= maxPages) {
      const params = {
        [pageParam]: currentPage,
        [sizeParam]: pageSize,
      };

      const response = await this.httpClient.get(endpoint, params);

      if (response.data && response.data.length > 0) {
        results.push(...response.data);
        currentPage++;
        hasMore = response.hasMore || response.data.length === pageSize;
      } else {
        hasMore = false;
      }
    }

    return results;
  }

  async *getAllGenerator(endpoint, options = {}) {
    const {
      pageSize = 20,
      maxPages = 10,
      pageParam = 'page',
      sizeParam = 'limit',
    } = options;

    let currentPage = 1;
    let hasMore = true;

    while (hasMore && currentPage <= maxPages) {
      const params = {
        [pageParam]: currentPage,
        [sizeParam]: pageSize,
      };

      const response = await this.httpClient.get(endpoint, params);

      if (response.data && response.data.length > 0) {
        yield response.data;
        currentPage++;
        hasMore = response.hasMore || response.data.length === pageSize;
      } else {
        hasMore = false;
      }
    }
  }
}
```

## 🏆 Consejos para WorldSkills

### Plantillas Rápidas

```javascript
// 1. Cliente básico rápido
const quickClient = {
  baseURL: 'https://api.ejemplo.com',

  async request(endpoint, options = {}) {
    const response = await fetch(this.baseURL + endpoint, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return response.json();
  },

  get: endpoint => quickClient.request(endpoint),
  post: (endpoint, data) =>
    quickClient.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// 2. Wrapper con loading
const withLoading = element => async fn => {
  element.classList.add('loading');
  try {
    return await fn();
  } finally {
    element.classList.remove('loading');
  }
};

// 3. Retry rápido
const quickRetry =
  (fn, times = 3) =>
  async (...args) => {
    for (let i = 0; i < times; i++) {
      try {
        return await fn(...args);
      } catch (error) {
        if (i === times - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  };
```

### Debugging Helpers

```javascript
// Request logger
const logRequest = (url, options) => {
  console.log(`🔄 ${options.method || 'GET'} ${url}`);
  return fetch(url, options).then(response => {
    console.log(`✅ ${response.status} ${url}`);
    return response;
  });
};

// Error logger
const logError = (error, context) => {
  console.error('API Error:', {
    message: error.message,
    status: error.status,
    url: error.url,
    context,
  });
};
```

¡Domina estos patrones y serás un experto en integración de APIs! 🌐
