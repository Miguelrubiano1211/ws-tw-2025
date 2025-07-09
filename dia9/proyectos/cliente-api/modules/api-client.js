/**
 * Módulo Cliente de API
 * Maneja todas las operaciones relacionadas con llamadas a APIs
 */

// Configuración de APIs disponibles
const API_CONFIG = {
  users: {
    url: 'https://jsonplaceholder.typicode.com/users',
    name: 'Usuarios',
    fields: ['id', 'name', 'email', 'phone', 'website'],
  },
  posts: {
    url: 'https://jsonplaceholder.typicode.com/posts',
    name: 'Posts',
    fields: ['id', 'title', 'body', 'userId'],
  },
  todos: {
    url: 'https://jsonplaceholder.typicode.com/todos',
    name: 'Tareas',
    fields: ['id', 'title', 'completed', 'userId'],
  },
  weather: {
    url: 'https://api.openweathermap.org/data/2.5/weather',
    name: 'Clima',
    fields: ['name', 'main', 'weather', 'wind'],
  },
};

// Clase principal para manejar operaciones de API
class ApiClient {
  constructor() {
    this.baseTimeout = 10000; // 10 segundos
    this.maxRetries = 3;
    this.retryDelay = 1000; // 1 segundo
    this.requestCount = 0;
    this.successCount = 0;
    this.errorCount = 0;
  }

  /**
   * Realiza una petición HTTP con manejo de errores y reintentos
   * @param {string} url - URL de la API
   * @param {Object} options - Opciones de la petición
   * @returns {Promise<Object>} - Respuesta de la API
   */
  async request(url, options = {}) {
    const startTime = performance.now();

    // Configuración por defecto
    const defaultOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      timeout: this.baseTimeout,
    };

    const finalOptions = { ...defaultOptions, ...options };

    // Incrementar contador de peticiones
    this.requestCount++;

    try {
      const response = await this.fetchWithTimeout(url, finalOptions);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const endTime = performance.now();

      // Registrar éxito
      this.successCount++;

      return {
        success: true,
        data,
        metadata: {
          status: response.status,
          statusText: response.statusText,
          responseTime: Math.round(endTime - startTime),
          size: JSON.stringify(data).length,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      this.errorCount++;

      return {
        success: false,
        error: error.message,
        metadata: {
          responseTime: Math.round(performance.now() - startTime),
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  /**
   * Fetch con timeout personalizado
   * @param {string} url - URL de la petición
   * @param {Object} options - Opciones de la petición
   * @returns {Promise<Response>} - Respuesta de la petición
   */
  async fetchWithTimeout(url, options) {
    const { timeout } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        throw new Error(`Timeout: La petición tardó más de ${timeout}ms`);
      }

      throw error;
    }
  }

  /**
   * Realizar petición con reintentos automáticos
   * @param {string} url - URL de la API
   * @param {Object} options - Opciones de la petición
   * @returns {Promise<Object>} - Respuesta de la API
   */
  async requestWithRetry(url, options = {}) {
    let lastError;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const result = await this.request(url, options);

        if (result.success) {
          return result;
        }

        lastError = result.error;
      } catch (error) {
        lastError = error.message;
      }

      // Esperar antes del siguiente intento (excepto en el último)
      if (attempt < this.maxRetries) {
        await this.delay(this.retryDelay * attempt);
      }
    }

    throw new Error(
      `Error después de ${this.maxRetries} intentos: ${lastError}`
    );
  }

  /**
   * Obtener datos de una API específica
   * @param {string} apiType - Tipo de API (users, posts, todos, weather)
   * @param {Object} params - Parámetros adicionales
   * @returns {Promise<Object>} - Datos de la API
   */
  async getData(apiType, params = {}) {
    const apiConfig = API_CONFIG[apiType];

    if (!apiConfig) {
      throw new Error(`Tipo de API no válido: ${apiType}`);
    }

    let url = apiConfig.url;

    // Agregar parámetros de query
    if (params.limit) {
      url += `?_limit=${params.limit}`;
    }

    // Simular delay si se especifica
    if (params.delay && params.delay > 0) {
      await this.delay(params.delay);
    }

    const result = await this.requestWithRetry(url);

    // Filtrar campos si se especifica
    if (result.success && params.fields) {
      result.data = this.filterFields(result.data, params.fields);
    }

    return result;
  }

  /**
   * Realizar múltiples peticiones en paralelo
   * @param {Array} requests - Array de configuraciones de petición
   * @returns {Promise<Array>} - Array de resultados
   */
  async parallelRequests(requests) {
    const startTime = performance.now();

    try {
      const promises = requests.map(async req => {
        try {
          const result = await this.getData(req.type, req.params);
          return { ...result, requestId: req.id };
        } catch (error) {
          return {
            success: false,
            error: error.message,
            requestId: req.id,
          };
        }
      });

      const results = await Promise.all(promises);
      const endTime = performance.now();

      return {
        success: true,
        results,
        metadata: {
          totalTime: Math.round(endTime - startTime),
          totalRequests: requests.length,
          successCount: results.filter(r => r.success).length,
          errorCount: results.filter(r => !r.success).length,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        metadata: {
          totalTime: Math.round(performance.now() - startTime),
        },
      };
    }
  }

  /**
   * Realizar múltiples peticiones en secuencia
   * @param {Array} requests - Array de configuraciones de petición
   * @returns {Promise<Array>} - Array de resultados
   */
  async sequentialRequests(requests) {
    const startTime = performance.now();
    const results = [];

    for (const req of requests) {
      try {
        const result = await this.getData(req.type, req.params);
        results.push({ ...result, requestId: req.id });
      } catch (error) {
        results.push({
          success: false,
          error: error.message,
          requestId: req.id,
        });
      }
    }

    const endTime = performance.now();

    return {
      success: true,
      results,
      metadata: {
        totalTime: Math.round(endTime - startTime),
        totalRequests: requests.length,
        successCount: results.filter(r => r.success).length,
        errorCount: results.filter(r => !r.success).length,
      },
    };
  }

  /**
   * Filtrar campos específicos de los datos
   * @param {Array|Object} data - Datos a filtrar
   * @param {Array} fields - Campos a mantener
   * @returns {Array|Object} - Datos filtrados
   */
  filterFields(data, fields) {
    if (Array.isArray(data)) {
      return data.map(item => this.filterObjectFields(item, fields));
    } else {
      return this.filterObjectFields(data, fields);
    }
  }

  /**
   * Filtrar campos de un objeto específico
   * @param {Object} obj - Objeto a filtrar
   * @param {Array} fields - Campos a mantener
   * @returns {Object} - Objeto filtrado
   */
  filterObjectFields(obj, fields) {
    const filtered = {};
    fields.forEach(field => {
      if (obj.hasOwnProperty(field)) {
        filtered[field] = obj[field];
      }
    });
    return filtered;
  }

  /**
   * Simular un error para testing
   * @param {string} errorType - Tipo de error a simular
   * @returns {Promise<Object>} - Promesa que se rechaza
   */
  async simulateError(errorType = 'network') {
    await this.delay(1000); // Simular demora

    const errorMessages = {
      network: 'Error de red: No se pudo conectar al servidor',
      timeout: 'Error de timeout: La petición tardó demasiado',
      server: 'Error del servidor: Error interno del servidor (500)',
      notFound: 'Error 404: Recurso no encontrado',
      unauthorized: 'Error 401: No autorizado',
      forbidden: 'Error 403: Acceso prohibido',
      badRequest: 'Error 400: Petición incorrecta',
    };

    const error = errorMessages[errorType] || 'Error desconocido';

    return {
      success: false,
      error,
      metadata: {
        errorType,
        timestamp: new Date().toISOString(),
      },
    };
  }

  /**
   * Obtener estadísticas de uso del cliente
   * @returns {Object} - Estadísticas de uso
   */
  getStats() {
    return {
      totalRequests: this.requestCount,
      successCount: this.successCount,
      errorCount: this.errorCount,
      successRate:
        this.requestCount > 0
          ? Math.round((this.successCount / this.requestCount) * 100)
          : 0,
    };
  }

  /**
   * Resetear estadísticas
   */
  resetStats() {
    this.requestCount = 0;
    this.successCount = 0;
    this.errorCount = 0;
  }

  /**
   * Utilidad para crear delays
   * @param {number} ms - Milisegundos a esperar
   * @returns {Promise<void>} - Promesa que se resuelve después del delay
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Instancia singleton del cliente
const apiClient = new ApiClient();

// Exportar la clase y la instancia
export { API_CONFIG, ApiClient, apiClient };
