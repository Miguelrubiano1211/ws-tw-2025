/**
 * Tests para el Cliente de API
 * Pruebas unitarias y de integración usando Jest
 */

// Mock del fetch para testing
global.fetch = jest.fn();

// Mock de elementos DOM
const mockElement = {
  style: { display: 'block' },
  classList: { add: jest.fn(), remove: jest.fn() },
  addEventListener: jest.fn(),
  innerHTML: '',
  textContent: '',
};

Object.defineProperty(window, 'document', {
  value: {
    getElementById: jest.fn(() => mockElement),
    addEventListener: jest.fn(),
    createElement: jest.fn(() => mockElement),
    querySelectorAll: jest.fn(() => []),
  },
});

// Mock de navigator
Object.defineProperty(window, 'navigator', {
  value: { onLine: true },
});

// Mock de performance
Object.defineProperty(window, 'performance', {
  value: { now: jest.fn(() => Date.now()) },
});

// Importar módulos a testear
import { ApiClient } from '../modules/api-client.js';
import { CacheManager, MemoryCache } from '../modules/cache.js';
import { ApiError, ErrorHandler } from '../modules/error-handler.js';
import { UIManager } from '../modules/ui-manager.js';

describe('ApiClient', () => {
  let apiClient;

  beforeEach(() => {
    apiClient = new ApiClient();
    fetch.mockClear();
  });

  describe('request', () => {
    test('debe realizar petición exitosa', async () => {
      const mockData = { id: 1, name: 'Test' };
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => mockData,
      });

      const result = await apiClient.request('https://api.test.com/data');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockData);
      expect(result.metadata.status).toBe(200);
      expect(result.metadata.responseTime).toBeGreaterThan(0);
    });

    test('debe manejar error HTTP', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      const result = await apiClient.request('https://api.test.com/notfound');

      expect(result.success).toBe(false);
      expect(result.error).toContain('404');
    });

    test('debe manejar error de red', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await apiClient.request('https://api.test.com/data');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Network error');
    });
  });

  describe('fetchWithTimeout', () => {
    test('debe abortar petición por timeout', async () => {
      // Simular petición que nunca se resuelve
      fetch.mockImplementationOnce(
        () => new Promise(() => {}) // Nunca se resuelve
      );

      const options = { timeout: 100 };

      await expect(
        apiClient.fetchWithTimeout('https://api.test.com/slow', options)
      ).rejects.toThrow('Timeout');
    });
  });

  describe('requestWithRetry', () => {
    test('debe reintentar en caso de error', async () => {
      fetch
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          statusText: 'OK',
          json: async () => ({ success: true }),
        });

      const result = await apiClient.requestWithRetry(
        'https://api.test.com/data'
      );

      expect(result.success).toBe(true);
      expect(fetch).toHaveBeenCalledTimes(3);
    });

    test('debe fallar después de máximo de reintentos', async () => {
      fetch.mockRejectedValue(new Error('Persistent error'));

      await expect(
        apiClient.requestWithRetry('https://api.test.com/data')
      ).rejects.toThrow('Error después de 3 intentos');
    });
  });

  describe('getData', () => {
    test('debe obtener datos de usuarios', async () => {
      const mockUsers = [
        { id: 1, name: 'Usuario 1', email: 'user1@test.com' },
        { id: 2, name: 'Usuario 2', email: 'user2@test.com' },
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => mockUsers,
      });

      const result = await apiClient.getData('users', { limit: 2 });

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(fetch).toHaveBeenCalledWith(
        'https://jsonplaceholder.typicode.com/users?_limit=2',
        expect.any(Object)
      );
    });

    test('debe aplicar delay si se especifica', async () => {
      const startTime = Date.now();

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => [],
      });

      await apiClient.getData('users', { delay: 100 });

      const elapsed = Date.now() - startTime;
      expect(elapsed).toBeGreaterThanOrEqual(100);
    });
  });

  describe('parallelRequests', () => {
    test('debe ejecutar peticiones en paralelo', async () => {
      const mockData = [
        { id: 1, name: 'Test 1' },
        { id: 2, name: 'Test 2' },
      ];

      fetch.mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => mockData,
      });

      const requests = [
        { id: 'req1', type: 'users', params: { limit: 1 } },
        { id: 'req2', type: 'posts', params: { limit: 1 } },
      ];

      const result = await apiClient.parallelRequests(requests);

      expect(result.success).toBe(true);
      expect(result.results).toHaveLength(2);
      expect(result.metadata.totalRequests).toBe(2);
    });
  });

  describe('simulateError', () => {
    test('debe simular error de red', async () => {
      const result = await apiClient.simulateError('network');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Error de red');
      expect(result.metadata.errorType).toBe('network');
    });
  });

  describe('getStats', () => {
    test('debe retornar estadísticas de uso', () => {
      const stats = apiClient.getStats();

      expect(stats).toHaveProperty('totalRequests');
      expect(stats).toHaveProperty('successCount');
      expect(stats).toHaveProperty('errorCount');
      expect(stats).toHaveProperty('successRate');
    });
  });
});

describe('MemoryCache', () => {
  let cache;

  beforeEach(() => {
    cache = new MemoryCache(5); // Cache pequeño para testing
  });

  describe('set y get', () => {
    test('debe guardar y recuperar datos', () => {
      const key = 'test-key';
      const data = { id: 1, name: 'Test' };

      cache.set(key, data);
      const retrieved = cache.get(key);

      expect(retrieved).toEqual(data);
    });

    test('debe retornar null para clave inexistente', () => {
      const result = cache.get('nonexistent-key');
      expect(result).toBeNull();
    });

    test('debe retornar null para datos expirados', () => {
      const key = 'expired-key';
      const data = { id: 1, name: 'Test' };
      const shortTtl = 1; // 1ms

      cache.set(key, data, shortTtl);

      // Esperar a que expire
      return new Promise(resolve => {
        setTimeout(() => {
          const result = cache.get(key);
          expect(result).toBeNull();
          resolve();
        }, 10);
      });
    });
  });

  describe('eviction', () => {
    test('debe eliminar entrada menos reciente cuando el cache está lleno', () => {
      // Llenar el cache
      for (let i = 0; i < 5; i++) {
        cache.set(`key-${i}`, { id: i });
      }

      // Agregar una más para trigger eviction
      cache.set('key-new', { id: 'new' });

      // La primera entrada debe haber sido eliminada
      expect(cache.get('key-0')).toBeNull();
      expect(cache.get('key-new')).not.toBeNull();
    });
  });

  describe('cleanup', () => {
    test('debe eliminar entradas expiradas', () => {
      cache.set('expired-1', { id: 1 }, 1);
      cache.set('expired-2', { id: 2 }, 1);
      cache.set('valid', { id: 3 }, 10000);

      // Esperar a que expiren
      return new Promise(resolve => {
        setTimeout(() => {
          const cleaned = cache.cleanup();
          expect(cleaned).toBe(2);
          expect(cache.get('valid')).not.toBeNull();
          resolve();
        }, 10);
      });
    });
  });

  describe('stats', () => {
    test('debe calcular estadísticas correctamente', () => {
      cache.set('key1', { id: 1 });
      cache.get('key1'); // hit
      cache.get('key2'); // miss

      const stats = cache.getStats();
      expect(stats.hits).toBe(1);
      expect(stats.misses).toBe(1);
      expect(stats.hitRate).toBe(50);
    });
  });
});

describe('CacheManager', () => {
  let cacheManager;

  beforeEach(() => {
    cacheManager = new CacheManager('memory');
  });

  describe('getOrSet', () => {
    test('debe ejecutar fetcher si no está en cache', async () => {
      const fetcher = jest
        .fn()
        .mockResolvedValue({ success: true, data: 'test' });
      const key = 'test-key';

      const result = await cacheManager.getOrSet(key, fetcher);

      expect(fetcher).toHaveBeenCalled();
      expect(result.data).toBe('test');
    });

    test('debe retornar datos del cache sin ejecutar fetcher', async () => {
      const fetcher = jest
        .fn()
        .mockResolvedValue({ success: true, data: 'test' });
      const key = 'test-key';

      // Primera llamada
      await cacheManager.getOrSet(key, fetcher);

      // Segunda llamada debe usar cache
      const result = await cacheManager.getOrSet(key, fetcher);

      expect(fetcher).toHaveBeenCalledTimes(1);
      expect(result.data).toBe('test');
    });
  });
});

describe('ErrorHandler', () => {
  let errorHandler;

  beforeEach(() => {
    errorHandler = new ErrorHandler();
  });

  describe('processError', () => {
    test('debe procesar ApiError correctamente', () => {
      const apiError = new ApiError('Test error', 'TEST_TYPE', 400);
      const processed = errorHandler.processError(apiError);

      expect(processed).toBe(apiError);
    });

    test('debe convertir Error nativo a ApiError', () => {
      const nativeError = new Error('Native error');
      const processed = errorHandler.processError(nativeError);

      expect(processed).toBeInstanceOf(ApiError);
      expect(processed.message).toBe('Native error');
    });

    test('debe procesar string error', () => {
      const processed = errorHandler.processError('String error');

      expect(processed).toBeInstanceOf(ApiError);
      expect(processed.message).toBe('String error');
    });
  });

  describe('logError', () => {
    test('debe agregar error al log', () => {
      const error = new Error('Test error');
      errorHandler.logError(error);

      const stats = errorHandler.getErrorStats();
      expect(stats.totalErrors).toBe(1);
    });

    test('debe mantener límite de tamaño del log', () => {
      // Cambiar maxLogSize para testing
      errorHandler.maxLogSize = 3;

      // Agregar más errores que el límite
      for (let i = 0; i < 5; i++) {
        errorHandler.logError(new Error(`Error ${i}`));
      }

      const stats = errorHandler.getErrorStats();
      expect(stats.totalErrors).toBe(3);
    });
  });

  describe('withRetry', () => {
    test('debe ejecutar operación exitosa sin reintentos', async () => {
      const operation = jest.fn().mockResolvedValue('success');

      const result = await errorHandler.withRetry(operation);

      expect(operation).toHaveBeenCalledTimes(1);
      expect(result).toBe('success');
    });

    test('debe reintentar operación fallida', async () => {
      const operation = jest
        .fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValue('success');

      const result = await errorHandler.withRetry(operation);

      expect(operation).toHaveBeenCalledTimes(2);
      expect(result).toBe('success');
    });

    test('debe fallar después de máximo de reintentos', async () => {
      const operation = jest
        .fn()
        .mockRejectedValue(new Error('Persistent error'));

      await expect(
        errorHandler.withRetry(operation, { maxRetries: 2 })
      ).rejects.toThrow('Persistent error');

      expect(operation).toHaveBeenCalledTimes(3); // 1 inicial + 2 reintentos
    });
  });

  describe('isRetryable', () => {
    test('debe identificar errores retryables', () => {
      const networkError = new ApiError('Network error', 'NETWORK_ERROR');
      const clientError = new ApiError('Client error', 'CLIENT_ERROR');

      expect(errorHandler.isRetryable(networkError)).toBe(true);
      expect(errorHandler.isRetryable(clientError)).toBe(false);
    });
  });
});

describe('ApiError', () => {
  test('debe crear error con propiedades correctas', () => {
    const error = new ApiError('Test message', 'TEST_TYPE', 400, {
      custom: 'data',
    });

    expect(error.message).toBe('Test message');
    expect(error.type).toBe('TEST_TYPE');
    expect(error.statusCode).toBe(400);
    expect(error.details).toEqual({ custom: 'data' });
    expect(error.timestamp).toBeDefined();
  });

  test('debe generar mensaje amigable para el usuario', () => {
    const networkError = new ApiError('Network error', 'NETWORK_ERROR');
    const message = networkError.getUserMessage();

    expect(message).toContain('conexión');
  });

  test('debe convertir a JSON correctamente', () => {
    const error = new ApiError('Test error', 'TEST_TYPE', 400);
    const json = error.toJSON();

    expect(json).toHaveProperty('name', 'ApiError');
    expect(json).toHaveProperty('message', 'Test error');
    expect(json).toHaveProperty('type', 'TEST_TYPE');
    expect(json).toHaveProperty('statusCode', 400);
    expect(json).toHaveProperty('timestamp');
  });
});

describe('UIManager', () => {
  let uiManager;

  beforeEach(() => {
    uiManager = new UIManager();
  });

  describe('showLoading', () => {
    test('debe mostrar indicador de carga', () => {
      uiManager.showLoading('Cargando...');
      expect(uiManager.isLoading).toBe(true);
    });
  });

  describe('hideLoading', () => {
    test('debe ocultar indicador de carga', () => {
      uiManager.showLoading('Cargando...');
      uiManager.hideLoading();
      expect(uiManager.isLoading).toBe(false);
    });
  });

  describe('switchView', () => {
    test('debe cambiar vista actual', () => {
      uiManager.switchView('table');
      expect(uiManager.getCurrentView()).toBe('table');
    });
  });

  describe('formatBytes', () => {
    test('debe formatear bytes correctamente', () => {
      expect(uiManager.formatBytes(0)).toBe('0 B');
      expect(uiManager.formatBytes(1024)).toBe('1 KB');
      expect(uiManager.formatBytes(1048576)).toBe('1 MB');
    });
  });

  describe('createCardHTML', () => {
    test('debe crear HTML para usuario', () => {
      const user = { id: 1, name: 'Test User', email: 'test@example.com' };
      const html = uiManager.createCardHTML(user, 'users', 0);

      expect(html).toContain('Test User');
      expect(html).toContain('test@example.com');
      expect(html).toContain('fa-user');
    });

    test('debe crear HTML para post', () => {
      const post = {
        id: 1,
        title: 'Test Post',
        body: 'Test content',
        userId: 1,
      };
      const html = uiManager.createCardHTML(post, 'posts', 0);

      expect(html).toContain('Test Post');
      expect(html).toContain('Test content');
      expect(html).toContain('fa-file-alt');
    });
  });

  describe('getTableHeaders', () => {
    test('debe generar headers para usuarios', () => {
      const user = { id: 1, name: 'Test', email: 'test@example.com' };
      const headers = uiManager.getTableHeaders(user, 'users');

      expect(headers).toContainEqual({ key: 'name', label: 'Nombre' });
      expect(headers).toContainEqual({ key: 'email', label: 'Email' });
    });
  });
});

// Tests de integración
describe('Integración', () => {
  let apiClient, cacheManager, errorHandler;

  beforeEach(() => {
    apiClient = new ApiClient();
    cacheManager = new CacheManager('memory');
    errorHandler = new ErrorHandler();
  });

  test('debe integrar API client con cache', async () => {
    const mockData = { id: 1, name: 'Test' };

    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => mockData,
    });

    const key = 'test-integration';
    const fetcher = () => apiClient.getData('users');

    // Primera llamada debe ir a la API
    const result1 = await cacheManager.getOrSet(key, fetcher);
    expect(result1.data).toEqual(mockData);

    // Segunda llamada debe usar cache
    const result2 = await cacheManager.getOrSet(key, fetcher);
    expect(result2.data).toEqual(mockData);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  test('debe integrar error handler con retry', async () => {
    fetch
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => ({ success: true }),
      });

    const operation = () => apiClient.getData('users');
    const result = await errorHandler.withRetry(operation);

    expect(result.success).toBe(true);
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});

// Configuración de Jest
const jestConfig = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'modules/**/*.js',
    '!modules/**/index.js',
    '!**/node_modules/**',
  ],
  coverageReporters: ['text', 'html', 'lcov'],
  testMatch: ['**/*.test.js'],
  verbose: true,
  testTimeout: 10000,
};

module.exports = jestConfig;
