/**
 * CLIENTE API - ApiClient
 *
 * Cliente HTTP para comunicación con APIs REST
 * con interceptores, caché y manejo de errores
 *
 * Características ES6+:
 * - Clases ES6 con métodos privados
 * - Async/await para requests
 * - Map para interceptores y caché
 * - Destructuring en configuración
 * - Template literals para URLs
 * - Arrow functions para callbacks
 * - Promises para control de flujo
 */

export class ApiClient {
  constructor(baseUrl = '', options = {}) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remover slash final

    this.config = {
      timeout: 30000,
      retries: 3,
      retryDelay: 1000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      ...options,
    };

    // Interceptores
    this.requestInterceptors = new Map();
    this.responseInterceptors = new Map();

    // Caché para requests
    this.cache = new Map();
    this.cacheConfig = {
      ttl: 5 * 60 * 1000, // 5 minutos
      maxSize: 100,
    };

    // Estado del cliente
    this.isOnline = navigator.onLine;

    // Configurar interceptores por defecto
    this.setupDefaultInterceptors();

    // Escuchar cambios de conectividad
    this.setupConnectivityListeners();
  }

  /**
   * Configura interceptores por defecto
   */
  setupDefaultInterceptors() {
    // Interceptor de request para autenticación
    this.addRequestInterceptor('auth', config => {
      const token = localStorage.getItem('authToken');

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    });

    // Interceptor de response para manejo de errores
    this.addResponseInterceptor('errorHandler', response => {
      if (!response.ok) {
        throw new ApiError(response);
      }

      return response;
    });

    // Interceptor para logs
    this.addRequestInterceptor('logger', config => {
      console.log(`🌐 ${config.method.toUpperCase()} ${config.url}`);
      return config;
    });
  }

  /**
   * Configura listeners de conectividad
   */
  setupConnectivityListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  /**
   * Agrega interceptor de request
   */
  addRequestInterceptor(name, interceptor) {
    this.requestInterceptors.set(name, interceptor);
  }

  /**
   * Agrega interceptor de response
   */
  addResponseInterceptor(name, interceptor) {
    this.responseInterceptors.set(name, interceptor);
  }

  /**
   * Remueve interceptor
   */
  removeInterceptor(type, name) {
    if (type === 'request') {
      this.requestInterceptors.delete(name);
    } else if (type === 'response') {
      this.responseInterceptors.delete(name);
    }
  }

  /**
   * Procesa interceptores de request
   */
  async processRequestInterceptors(config) {
    let processedConfig = { ...config };

    for (const interceptor of this.requestInterceptors.values()) {
      try {
        processedConfig = await interceptor(processedConfig);
      } catch (error) {
        console.error('Request interceptor error:', error);
      }
    }

    return processedConfig;
  }

  /**
   * Procesa interceptores de response
   */
  async processResponseInterceptors(response) {
    let processedResponse = response;

    for (const interceptor of this.responseInterceptors.values()) {
      try {
        processedResponse = await interceptor(processedResponse);
      } catch (error) {
        console.error('Response interceptor error:', error);
        throw error;
      }
    }

    return processedResponse;
  }

  /**
   * Realiza una petición HTTP
   */
  async request(url, options = {}) {
    // Verificar conectividad
    if (!this.isOnline && !options.offline) {
      throw new Error('No hay conexión a internet');
    }

    // Configuración de la petición
    const config = {
      method: 'GET',
      headers: { ...this.config.headers },
      timeout: this.config.timeout,
      ...options,
      url: this.buildUrl(url),
    };

    // Aplicar interceptores de request
    const processedConfig = await this.processRequestInterceptors(config);

    // Verificar caché para requests GET
    if (config.method === 'GET' && !options.skipCache) {
      const cached = this.getFromCache(config.url);
      if (cached) {
        console.log(`📦 Cache hit: ${config.url}`);
        return cached;
      }
    }

    // Realizar petición con reintentos
    const response = await this.requestWithRetry(processedConfig);

    // Aplicar interceptores de response
    const processedResponse = await this.processResponseInterceptors(response);

    // Parsear respuesta
    const data = await this.parseResponse(processedResponse);

    // Guardar en caché para requests GET
    if (config.method === 'GET' && !options.skipCache) {
      this.saveToCache(config.url, data);
    }

    return data;
  }

  /**
   * Construye URL completa
   */
  buildUrl(endpoint) {
    if (endpoint.startsWith('http')) {
      return endpoint;
    }

    const url = endpoint.startsWith('/')
      ? `${this.baseUrl}${endpoint}`
      : `${this.baseUrl}/${endpoint}`;

    return url;
  }

  /**
   * Realiza petición con reintentos
   */
  async requestWithRetry(config) {
    let lastError;

    for (let attempt = 0; attempt < this.config.retries; attempt++) {
      try {
        return await this.performRequest(config);
      } catch (error) {
        lastError = error;

        // No reintentar para ciertos errores
        if (error.status >= 400 && error.status < 500) {
          throw error;
        }

        // Calcular delay con backoff exponencial
        const delay = this.config.retryDelay * Math.pow(2, attempt);

        console.warn(
          `⚠️ Request failed (attempt ${attempt + 1}/${
            this.config.retries
          }). Retrying in ${delay}ms...`
        );

        if (attempt < this.config.retries - 1) {
          await this.sleep(delay);
        }
      }
    }

    throw lastError;
  }

  /**
   * Realiza la petición HTTP
   */
  async performRequest(config) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);

    try {
      const response = await fetch(config.url, {
        method: config.method,
        headers: config.headers,
        body: config.body,
        signal: controller.signal,
        ...config.fetchOptions,
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }

      throw error;
    }
  }

  /**
   * Parsea la respuesta
   */
  async parseResponse(response) {
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }

    if (contentType && contentType.includes('text/')) {
      return await response.text();
    }

    return await response.blob();
  }

  /**
   * Métodos HTTP convenientes
   */
  async get(url, options = {}) {
    return this.request(url, { ...options, method: 'GET' });
  }

  async post(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete(url, options = {}) {
    return this.request(url, { ...options, method: 'DELETE' });
  }

  /**
   * Upload de archivos
   */
  async upload(url, file, options = {}) {
    const formData = new FormData();
    formData.append('file', file);

    // Agregar campos adicionales
    if (options.fields) {
      Object.entries(options.fields).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    const config = {
      ...options,
      method: 'POST',
      headers: {
        // No establecer Content-Type para FormData
        ...this.config.headers,
        'Content-Type': undefined,
      },
      body: formData,
    };

    return this.request(url, config);
  }

  /**
   * Descarga de archivos
   */
  async download(url, filename, options = {}) {
    const response = await this.request(url, {
      ...options,
      skipCache: true,
    });

    // Crear blob y descargar
    const blob = new Blob([response]);
    const downloadUrl = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(downloadUrl);
  }

  /**
   * Request con stream (para datos grandes)
   */
  async stream(url, onChunk, options = {}) {
    const response = await fetch(this.buildUrl(url), {
      method: 'GET',
      headers: this.config.headers,
      ...options,
    });

    if (!response.ok) {
      throw new ApiError(response);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        await onChunk(chunk);
      }
    } finally {
      reader.releaseLock();
    }
  }

  /**
   * Batch de requests
   */
  async batch(requests) {
    const promises = requests.map(({ url, options }) =>
      this.request(url, options).catch(error => ({ error }))
    );

    return await Promise.all(promises);
  }

  /**
   * Request paralelos con límite de concurrencia
   */
  async parallel(requests, concurrency = 5) {
    const results = [];

    for (let i = 0; i < requests.length; i += concurrency) {
      const batch = requests.slice(i, i + concurrency);
      const batchResults = await this.batch(batch);
      results.push(...batchResults);
    }

    return results;
  }

  /**
   * Gestión de caché
   */
  getFromCache(url) {
    const cached = this.cache.get(url);

    if (!cached) return null;

    const { data, timestamp } = cached;
    const isExpired = Date.now() - timestamp > this.cacheConfig.ttl;

    if (isExpired) {
      this.cache.delete(url);
      return null;
    }

    return data;
  }

  saveToCache(url, data) {
    // Limpiar caché si está lleno
    if (this.cache.size >= this.cacheConfig.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(url, {
      data,
      timestamp: Date.now(),
    });
  }

  clearCache() {
    this.cache.clear();
  }

  /**
   * Configuración dinámica
   */
  setBaseUrl(baseUrl) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  setHeader(name, value) {
    this.config.headers[name] = value;
  }

  removeHeader(name) {
    delete this.config.headers[name];
  }

  setTimeout(timeout) {
    this.config.timeout = timeout;
  }

  /**
   * Utilidades
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Estado del cliente
   */
  get status() {
    return {
      isOnline: this.isOnline,
      cacheSize: this.cache.size,
      interceptors: {
        request: this.requestInterceptors.size,
        response: this.responseInterceptors.size,
      },
    };
  }

  /**
   * Destruye el cliente
   */
  destroy() {
    this.clearCache();
    this.requestInterceptors.clear();
    this.responseInterceptors.clear();
  }
}

/**
 * Clase de error personalizada para API
 */
export class ApiError extends Error {
  constructor(response) {
    super(`API Error: ${response.status} ${response.statusText}`);

    this.name = 'ApiError';
    this.status = response.status;
    this.statusText = response.statusText;
    this.response = response;
    this.timestamp = new Date().toISOString();
  }

  /**
   * Verifica si es un error específico
   */
  is(status) {
    return this.status === status;
  }

  /**
   * Verifica si es un error de cliente (4xx)
   */
  isClientError() {
    return this.status >= 400 && this.status < 500;
  }

  /**
   * Verifica si es un error de servidor (5xx)
   */
  isServerError() {
    return this.status >= 500;
  }

  /**
   * Verifica si es un error de red
   */
  isNetworkError() {
    return this.status === 0 || this.name === 'TypeError';
  }

  /**
   * Convierte a JSON
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      statusText: this.statusText,
      timestamp: this.timestamp,
    };
  }
}

/* 
📚 NOTAS PEDAGÓGICAS:

1. **Fetch API**: Uso moderno de fetch en lugar de XMLHttpRequest
2. **Interceptores**: Patrón para procesar requests/responses
3. **Error Handling**: Clase de error personalizada
4. **Retry Logic**: Reintentos con backoff exponencial
5. **Caching**: Sistema de caché con TTL
6. **AbortController**: Para cancelar requests
7. **FormData**: Para upload de archivos
8. **Streams**: Para datos grandes
9. **Batch/Parallel**: Procesamiento de múltiples requests
10. **Connectivity**: Manejo de estado online/offline

🎯 EJERCICIOS SUGERIDOS:
- Implementar queue de requests offline
- Agregar métricas de performance
- Crear mock server para testing
- Implementar GraphQL client
*/
