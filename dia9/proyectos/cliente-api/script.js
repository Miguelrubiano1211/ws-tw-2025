/**
 * Script Principal - Cliente de API
 * Controla la lógica principal y las interacciones de la aplicación
 */

// Importar módulos
import { API_CONFIG, apiClient } from './modules/api-client.js';
import { cacheManager, withCache } from './modules/cache.js';
import { errorHandler } from './modules/error-handler.js';
import { uiManager } from './modules/ui-manager.js';

/**
 * Clase principal de la aplicación
 */
class ApiClientApp {
  constructor() {
    this.currentApiType = 'users';
    this.currentLimit = 10;
    this.currentDelay = 0;
    this.totalRequests = 0;
    this.cacheEnabled = true;

    // Inicializar aplicación
    this.init();
  }

  /**
   * Inicializar la aplicación
   */
  init() {
    this.setupEventListeners();
    this.updateUI();
    this.checkConnectionStatus();

    // Configurar limpieza automática de cache
    setInterval(() => {
      cacheManager.cleanup();
    }, 60000); // Cada minuto

    console.log('🚀 Cliente de API inicializado correctamente');
  }

  /**
   * Configurar event listeners
   */
  setupEventListeners() {
    // Controles de formulario
    document.getElementById('api-select')?.addEventListener('change', e => {
      this.currentApiType = e.target.value;
    });

    document.getElementById('limit-input')?.addEventListener('change', e => {
      this.currentLimit = parseInt(e.target.value) || 10;
    });

    document.getElementById('delay-input')?.addEventListener('change', e => {
      this.currentDelay = parseInt(e.target.value) || 0;
    });

    // Botones de acción
    document.getElementById('fetch-btn')?.addEventListener('click', () => {
      this.fetchData();
    });

    document.getElementById('parallel-btn')?.addEventListener('click', () => {
      this.fetchParallelData();
    });

    document.getElementById('sequential-btn')?.addEventListener('click', () => {
      this.fetchSequentialData();
    });

    document.getElementById('cache-btn')?.addEventListener('click', () => {
      this.toggleCache();
    });

    document.getElementById('clear-btn')?.addEventListener('click', () => {
      this.clearData();
    });

    document.getElementById('test-error-btn')?.addEventListener('click', () => {
      this.testError();
    });

    // Shortcuts de teclado
    document.addEventListener('keydown', e => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'Enter':
            e.preventDefault();
            this.fetchData();
            break;
          case 'r':
            e.preventDefault();
            this.clearData();
            break;
        }
      }
    });
  }

  /**
   * Obtener datos simples
   */
  async fetchData() {
    try {
      uiManager.showLoading(
        `Obteniendo datos de ${API_CONFIG[this.currentApiType].name}...`
      );

      const params = {
        limit: this.currentLimit,
        delay: this.currentDelay,
      };

      let result;

      if (this.cacheEnabled) {
        // Usar cache
        const cacheKey = `${this.currentApiType}_${JSON.stringify(params)}`;
        result = await withCache(cacheKey, () =>
          apiClient.getData(this.currentApiType, params)
        );
      } else {
        // Sin cache
        result = await apiClient.getData(this.currentApiType, params);
      }

      if (result.success) {
        this.handleSuccess(result, 'single');
      } else {
        this.handleError(result.error);
      }
    } catch (error) {
      this.handleError(error);
    } finally {
      uiManager.completeProgress();
    }
  }

  /**
   * Obtener datos en paralelo
   */
  async fetchParallelData() {
    try {
      uiManager.showLoading('Obteniendo datos en paralelo...', true);

      const requests = [
        { id: 'users', type: 'users', params: { limit: 5 } },
        { id: 'posts', type: 'posts', params: { limit: 5 } },
        { id: 'todos', type: 'todos', params: { limit: 5 } },
      ];

      const result = await apiClient.parallelRequests(requests);

      if (result.success) {
        this.handleParallelSuccess(result);
      } else {
        this.handleError(result.error);
      }
    } catch (error) {
      this.handleError(error);
    } finally {
      uiManager.completeProgress();
    }
  }

  /**
   * Obtener datos en secuencia
   */
  async fetchSequentialData() {
    try {
      uiManager.showLoading('Obteniendo datos en secuencia...', true);

      const requests = [
        { id: 'users', type: 'users', params: { limit: 3 } },
        { id: 'posts', type: 'posts', params: { limit: 3 } },
        { id: 'todos', type: 'todos', params: { limit: 3 } },
      ];

      const result = await apiClient.sequentialRequests(requests);

      if (result.success) {
        this.handleSequentialSuccess(result);
      } else {
        this.handleError(result.error);
      }
    } catch (error) {
      this.handleError(error);
    } finally {
      uiManager.completeProgress();
    }
  }

  /**
   * Alternar cache
   */
  toggleCache() {
    this.cacheEnabled = !this.cacheEnabled;

    const cacheBtn = document.getElementById('cache-btn');
    if (cacheBtn) {
      cacheBtn.innerHTML = this.cacheEnabled
        ? '<i class="fas fa-memory me-1"></i> Cache Activo'
        : '<i class="fas fa-memory me-1"></i> Cache Inactivo';
      cacheBtn.className = this.cacheEnabled
        ? 'btn btn-success me-2'
        : 'btn btn-outline-secondary me-2';
    }

    uiManager.updateCacheStatus(this.cacheEnabled);
    uiManager.showSuccess(
      this.cacheEnabled ? 'Cache activado' : 'Cache desactivado',
      2000
    );
  }

  /**
   * Limpiar datos
   */
  clearData() {
    uiManager.clearData();
    cacheManager.clear();
    errorHandler.clearErrorLog();

    this.totalRequests = 0;
    this.updateMetrics();

    uiManager.showSuccess('Datos limpiados correctamente', 2000);
  }

  /**
   * Probar manejo de errores
   */
  async testError() {
    try {
      uiManager.showLoading('Simulando error...', false);

      // Simular diferentes tipos de errores
      const errorTypes = ['network', 'timeout', 'server', 'notFound'];
      const randomType =
        errorTypes[Math.floor(Math.random() * errorTypes.length)];

      const result = await apiClient.simulateError(randomType);
      this.handleError(result.error);
    } catch (error) {
      this.handleError(error);
    } finally {
      uiManager.hideLoading();
    }
  }

  /**
   * Manejar éxito en petición simple
   * @param {Object} result - Resultado de la petición
   * @param {string} type - Tipo de operación
   */
  handleSuccess(result, type = 'single') {
    const { data, metadata } = result;

    // Actualizar UI con los datos
    uiManager.showData(data, this.currentApiType);

    // Actualizar métricas
    this.totalRequests++;
    this.updateMetrics({
      responseTime: metadata.responseTime,
      dataSize: metadata.size,
      totalRequests: this.totalRequests,
    });

    // Mostrar mensaje de éxito
    const count = Array.isArray(data) ? data.length : 1;
    uiManager.showSuccess(
      `${count} elemento${count !== 1 ? 's' : ''} cargado${
        count !== 1 ? 's' : ''
      } correctamente`,
      3000
    );
  }

  /**
   * Manejar éxito en peticiones paralelas
   * @param {Object} result - Resultado de las peticiones
   */
  handleParallelSuccess(result) {
    const { results, metadata } = result;

    // Combinar todos los datos exitosos
    const allData = [];
    results.forEach(res => {
      if (res.success && res.data) {
        const dataArray = Array.isArray(res.data) ? res.data : [res.data];
        allData.push(...dataArray);
      }
    });

    // Mostrar datos combinados
    uiManager.showData(allData, 'mixed');

    // Actualizar métricas
    this.totalRequests += metadata.totalRequests;
    this.updateMetrics({
      responseTime: metadata.totalTime,
      dataSize: JSON.stringify(allData).length,
      totalRequests: this.totalRequests,
    });

    // Mostrar mensaje de éxito
    uiManager.showSuccess(
      `Carga paralela completada: ${metadata.successCount}/${metadata.totalRequests} exitosas`,
      3000
    );
  }

  /**
   * Manejar éxito en peticiones secuenciales
   * @param {Object} result - Resultado de las peticiones
   */
  handleSequentialSuccess(result) {
    const { results, metadata } = result;

    // Combinar todos los datos exitosos
    const allData = [];
    results.forEach(res => {
      if (res.success && res.data) {
        const dataArray = Array.isArray(res.data) ? res.data : [res.data];
        allData.push(...dataArray);
      }
    });

    // Mostrar datos combinados
    uiManager.showData(allData, 'mixed');

    // Actualizar métricas
    this.totalRequests += metadata.totalRequests;
    this.updateMetrics({
      responseTime: metadata.totalTime,
      dataSize: JSON.stringify(allData).length,
      totalRequests: this.totalRequests,
    });

    // Mostrar mensaje de éxito
    uiManager.showSuccess(
      `Carga secuencial completada: ${metadata.successCount}/${metadata.totalRequests} exitosas`,
      3000
    );
  }

  /**
   * Manejar errores
   * @param {Error|string} error - Error a manejar
   */
  handleError(error) {
    // Procesar error con el handler
    const processedError = errorHandler.processError(error);

    // Log del error
    errorHandler.logError(processedError);

    // Mostrar error en UI
    uiManager.showError(processedError.getUserMessage(), 0);

    // Log en consola para desarrollo
    console.error('Error en la aplicación:', processedError);
  }

  /**
   * Actualizar métricas en la UI
   * @param {Object} newMetrics - Nuevas métricas
   */
  updateMetrics(newMetrics = {}) {
    const cacheStats = cacheManager.getStats();
    const errorStats = errorHandler.getErrorStats();

    const metrics = {
      responseTime: newMetrics.responseTime || 0,
      dataSize: newMetrics.dataSize || 0,
      cacheHits: cacheStats.hits || 0,
      totalRequests: newMetrics.totalRequests || this.totalRequests,
    };

    uiManager.updateMetrics(metrics);
  }

  /**
   * Actualizar estado de la UI
   */
  updateUI() {
    uiManager.updateConnectionStatus(navigator.onLine);
    uiManager.updateCacheStatus(this.cacheEnabled);
    this.updateMetrics();
  }

  /**
   * Verificar estado de conexión
   */
  checkConnectionStatus() {
    // Verificar conexión inicial
    uiManager.updateConnectionStatus(navigator.onLine);

    // Listeners para cambios de conexión
    window.addEventListener('online', () => {
      uiManager.updateConnectionStatus(true);
      uiManager.showSuccess('Conexión restaurada', 2000);
    });

    window.addEventListener('offline', () => {
      uiManager.updateConnectionStatus(false);
      uiManager.showError('Sin conexión a internet', 0);
    });
  }

  /**
   * Obtener estadísticas de la aplicación
   * @returns {Object} - Estadísticas completas
   */
  getAppStats() {
    return {
      app: {
        totalRequests: this.totalRequests,
        cacheEnabled: this.cacheEnabled,
        currentApiType: this.currentApiType,
      },
      cache: cacheManager.getStats(),
      errors: errorHandler.getErrorStats(),
      api: apiClient.getStats(),
    };
  }

  /**
   * Resetear estadísticas
   */
  resetStats() {
    this.totalRequests = 0;
    cacheManager.clear();
    errorHandler.clearErrorLog();
    apiClient.resetStats();
    this.updateMetrics();
  }
}

// Inicializar aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Crear instancia de la aplicación
  window.apiApp = new ApiClientApp();

  // Exponer utilidades para debugging
  window.debug = {
    getStats: () => window.apiApp.getAppStats(),
    resetStats: () => window.apiApp.resetStats(),
    cache: cacheManager,
    errorHandler,
    apiClient,
    uiManager,
  };

  console.log('🎉 Aplicación lista para usar');
  console.log('💡 Usa window.debug para acceder a utilidades de debugging');
});

// Manejar errores no capturados
window.addEventListener('error', event => {
  console.error('Error no capturado:', event.error);
  errorHandler.logError(event.error, {
    type: 'uncaught',
    filename: event.filename,
    lineno: event.lineno,
  });
});

// Manejar promesas rechazadas no capturadas
window.addEventListener('unhandledrejection', event => {
  console.error('Promesa rechazada no capturada:', event.reason);
  errorHandler.logError(event.reason, { type: 'unhandled-promise-rejection' });
});

// Exportar para testing
export { ApiClientApp };
