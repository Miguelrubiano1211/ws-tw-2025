/**
 * 🔧 Día 13: Axios Setup y Interceptors
 *
 * Configuración profesional de Axios con interceptors
 * para manejo automático de autenticación, errores y logging
 *
 * Conceptos clave:
 * - Axios configuration
 * - Request/Response interceptors
 * - Token management
 * - Error handling centralizado
 * - Logging y debugging
 */

import axios from 'axios';

// 1. Configuración base de Axios
const axiosConfig = {
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

// 2. Crear instancia de Axios
const apiClient = axios.create(axiosConfig);

// 3. Token management
class TokenManager {
  static getToken() {
    return localStorage.getItem('authToken');
  }

  static setToken(token) {
    localStorage.setItem('authToken', token);
  }

  static removeToken() {
    localStorage.removeItem('authToken');
  }

  static isTokenExpired(token) {
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp < Date.now() / 1000;
    } catch (error) {
      return true;
    }
  }
}

// 4. Request interceptor
apiClient.interceptors.request.use(
  config => {
    // Agregar token de autorización
    const token = TokenManager.getToken();
    if (token && !TokenManager.isTokenExpired(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Logging de requests (solo en desarrollo)
    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 Request intercepted:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        headers: config.headers,
        data: config.data,
      });
    }

    // Agregar timestamp para métricas
    config.metadata = { startTime: new Date() };

    return config;
  },
  error => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// 5. Response interceptor
apiClient.interceptors.response.use(
  response => {
    // Logging de responses exitosas
    if (process.env.NODE_ENV === 'development') {
      const duration = new Date() - response.config.metadata.startTime;
      console.log('✅ Response received:', {
        status: response.status,
        url: response.config.url,
        duration: `${duration}ms`,
        data: response.data,
      });
    }

    return response;
  },
  async error => {
    const originalRequest = error.config;

    // Manejo de errores específicos
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Token expirado o inválido
          TokenManager.removeToken();

          // Redirigir a login solo si no estamos ya en login
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
          break;

        case 403:
          // Acceso denegado
          console.error('🚫 Access denied:', data.message);
          break;

        case 404:
          // Recurso no encontrado
          console.error('🔍 Resource not found:', originalRequest.url);
          break;

        case 429:
          // Rate limiting
          console.error('⏰ Rate limit exceeded, retrying...');
          return retryRequest(originalRequest, error);

        case 500:
          // Error del servidor
          console.error('🔥 Server error:', data.message);
          break;

        default:
          console.error('❌ Request failed:', error.response);
      }
    } else if (error.request) {
      // Error de red
      console.error('🌐 Network error:', error.message);
    } else {
      // Error en configuración
      console.error('⚙️ Config error:', error.message);
    }

    return Promise.reject(error);
  }
);

// 6. Función para reintentos con backoff exponencial
const retryRequest = async (originalRequest, error) => {
  const maxRetries = 3;
  const retryCount = originalRequest.__retryCount || 0;

  if (retryCount >= maxRetries) {
    return Promise.reject(error);
  }

  originalRequest.__retryCount = retryCount + 1;

  // Backoff exponencial: 1s, 2s, 4s
  const delay = Math.pow(2, retryCount) * 1000;

  await new Promise(resolve => setTimeout(resolve, delay));

  return apiClient(originalRequest);
};

// 7. Servicio de API con métodos específicos
class ApiService {
  // Productos
  static async getProducts(params = {}) {
    try {
      const response = await apiClient.get('/productos', { params });
      return response.data;
    } catch (error) {
      throw new Error(`Error al obtener productos: ${error.message}`);
    }
  }

  static async getProduct(id) {
    try {
      const response = await apiClient.get(`/productos/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Error al obtener producto: ${error.message}`);
    }
  }

  static async createProduct(productData) {
    try {
      const response = await apiClient.post('/productos', productData);
      return response.data;
    } catch (error) {
      throw new Error(`Error al crear producto: ${error.message}`);
    }
  }

  static async updateProduct(id, productData) {
    try {
      const response = await apiClient.put(`/productos/${id}`, productData);
      return response.data;
    } catch (error) {
      throw new Error(`Error al actualizar producto: ${error.message}`);
    }
  }

  static async deleteProduct(id) {
    try {
      await apiClient.delete(`/productos/${id}`);
      return { success: true };
    } catch (error) {
      throw new Error(`Error al eliminar producto: ${error.message}`);
    }
  }

  // Autenticación
  static async login(credentials) {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      const { token } = response.data;

      if (token) {
        TokenManager.setToken(token);
      }

      return response.data;
    } catch (error) {
      throw new Error(`Error al iniciar sesión: ${error.message}`);
    }
  }

  static async logout() {
    try {
      await apiClient.post('/auth/logout');
      TokenManager.removeToken();
      return { success: true };
    } catch (error) {
      TokenManager.removeToken(); // Limpiar token local aunque falle
      throw new Error(`Error al cerrar sesión: ${error.message}`);
    }
  }

  // Upload de archivos
  static async uploadFile(file, onProgress = null) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: progressEvent => {
          if (onProgress) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(`Error al subir archivo: ${error.message}`);
    }
  }
}

// 8. Hook personalizado para usar el servicio
const useApiService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callApi = async (apiMethod, ...args) => {
    try {
      setLoading(true);
      setError(null);

      const result = await apiMethod(...args);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { callApi, loading, error };
};

// 9. Ejemplo de uso en componente React
const ProductComponent = () => {
  const [products, setProducts] = useState([]);
  const { callApi, loading, error } = useApiService();

  const loadProducts = async () => {
    try {
      const data = await callApi(ApiService.getProducts);
      setProducts(data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  };

  const handleCreateProduct = async productData => {
    try {
      const newProduct = await callApi(ApiService.createProduct, productData);
      setProducts(prev => [...prev, newProduct]);
    } catch (error) {
      console.error('Error al crear producto:', error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  if (loading) return <div>Cargando productos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Productos</h2>
      {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
};

// 10. Configuraciones avanzadas
const advancedConfigs = {
  // Configuración para diferentes entornos
  development: {
    baseURL: 'http://localhost:3001/api',
    timeout: 30000,
    headers: {
      'X-Environment': 'development',
    },
  },
  production: {
    baseURL: 'https://api.produccion.com/api',
    timeout: 10000,
    headers: {
      'X-Environment': 'production',
    },
  },

  // Configuración para mock durante testing
  test: {
    baseURL: 'http://localhost:3001/api',
    timeout: 5000,
    adapter: 'http', // Para usar con MSW
  },
};

// 11. Ejercicios prácticos
const ejerciciosPracticos = [
  {
    titulo: 'Implementar Cache con Interceptors',
    descripcion: 'Agregar cache automático a las respuestas',
    codigo: `
      const cacheInterceptor = axios.interceptors.response.use(
        response => {
          // Guardar en cache solo GET requests
          if (response.config.method === 'get') {
            const cacheKey = response.config.url + JSON.stringify(response.config.params);
            localStorage.setItem(cacheKey, JSON.stringify(response.data));
          }
          return response;
        }
      );
    `,
  },
  {
    titulo: 'Request Deduplication',
    descripción: 'Evitar requests duplicados',
    codigo: `
      const pendingRequests = new Map();
      
      const dedupeInterceptor = axios.interceptors.request.use(
        config => {
          const key = config.method + config.url + JSON.stringify(config.params);
          
          if (pendingRequests.has(key)) {
            return pendingRequests.get(key);
          }
          
          const request = axios(config);
          pendingRequests.set(key, request);
          
          request.finally(() => {
            pendingRequests.delete(key);
          });
          
          return request;
        }
      );
    `,
  },
];

console.log('🔧 Ejercicio 4: Axios Setup y Interceptors');
console.log('📝 Conceptos cubiertos:', [
  'Axios configuration',
  'Request/Response interceptors',
  'Token management',
  'Error handling centralizado',
  'Logging y debugging',
]);

export { ApiService, TokenManager, apiClient, useApiService };
export default apiClient;
