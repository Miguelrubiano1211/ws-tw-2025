/**
 * Módulo de Gestión de UI
 * Maneja todas las interacciones y actualizaciones de la interfaz de usuario
 */

/**
 * Clase para gestionar la interfaz de usuario
 */
class UIManager {
  constructor() {
    this.currentView = 'cards';
    this.isLoading = false;
    this.loadingTimeout = null;
    this.alertTimeout = null;
    this.metrics = {
      responseTime: 0,
      dataSize: 0,
      cacheHits: 0,
      totalRequests: 0,
    };

    // Inicializar elementos DOM
    this.initializeElements();

    // Configurar event listeners
    this.setupEventListeners();
  }

  /**
   * Inicializar referencias a elementos DOM
   */
  initializeElements() {
    // Contenedores principales
    this.loadingContainer = document.getElementById('loading-container');
    this.errorContainer = document.getElementById('error-container');
    this.successContainer = document.getElementById('success-container');
    this.metricsContainer = document.getElementById('metrics-container');

    // Elementos de datos
    this.cardsView = document.getElementById('cards-view');
    this.tableView = document.getElementById('table-view');
    this.jsonView = document.getElementById('json-view');
    this.dataCards = document.getElementById('data-cards');
    this.dataTable = document.getElementById('data-table');
    this.tableHeader = document.getElementById('table-header');
    this.tableBody = document.getElementById('table-body');
    this.jsonContent = document.getElementById('json-content');

    // Elementos de métricas
    this.responseTimeEl = document.getElementById('response-time');
    this.dataSizeEl = document.getElementById('data-size');
    this.cacheHitsEl = document.getElementById('cache-hits');
    this.totalRequestsEl = document.getElementById('total-requests');

    // Elementos de estado
    this.connectionStatus = document.getElementById('connection-status');
    this.cacheStatus = document.getElementById('cache-status');
    this.progressBar = document.getElementById('progress-bar');

    // Mensajes
    this.errorMessage = document.getElementById('error-message');
    this.successMessage = document.getElementById('success-message');

    // Botones de vista
    this.viewTableBtn = document.getElementById('view-table');
    this.viewCardsBtn = document.getElementById('view-cards');
    this.viewJsonBtn = document.getElementById('view-json');
  }

  /**
   * Configurar event listeners
   */
  setupEventListeners() {
    // Botones de vista
    this.viewTableBtn?.addEventListener('click', () =>
      this.switchView('table')
    );
    this.viewCardsBtn?.addEventListener('click', () =>
      this.switchView('cards')
    );
    this.viewJsonBtn?.addEventListener('click', () => this.switchView('json'));

    // Cerrar alerts automáticamente
    document.addEventListener('click', e => {
      if (e.target.classList.contains('btn-close')) {
        this.hideAlert(e.target.closest('.alert').parentElement);
      }
    });
  }

  /**
   * Mostrar indicador de carga
   * @param {string} message - Mensaje de carga
   * @param {boolean} showProgress - Mostrar barra de progreso
   */
  showLoading(message = 'Cargando datos...', showProgress = true) {
    this.isLoading = true;

    // Actualizar mensaje
    const loadingText = this.loadingContainer?.querySelector('.text-primary');
    if (loadingText) {
      loadingText.textContent = message;
    }

    // Mostrar/ocultar barra de progreso
    if (this.progressBar) {
      this.progressBar.style.display = showProgress ? 'block' : 'none';
      this.progressBar.style.width = '0%';
    }

    // Mostrar contenedor de carga
    this.show(this.loadingContainer);

    // Ocultar otros contenedores
    this.hide(this.errorContainer);
    this.hide(this.successContainer);

    // Simular progreso
    if (showProgress) {
      this.simulateProgress();
    }
  }

  /**
   * Ocultar indicador de carga
   */
  hideLoading() {
    this.isLoading = false;
    this.hide(this.loadingContainer);

    // Limpiar timeout de progreso
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
      this.loadingTimeout = null;
    }
  }

  /**
   * Simular progreso de carga
   */
  simulateProgress() {
    let progress = 0;
    const increment = Math.random() * 15 + 5; // 5-20%

    const updateProgress = () => {
      progress = Math.min(progress + increment, 95);

      if (this.progressBar) {
        this.progressBar.style.width = `${progress}%`;
      }

      if (progress < 95 && this.isLoading) {
        this.loadingTimeout = setTimeout(
          updateProgress,
          200 + Math.random() * 300
        );
      }
    };

    updateProgress();
  }

  /**
   * Completar progreso de carga
   */
  completeProgress() {
    if (this.progressBar) {
      this.progressBar.style.width = '100%';
    }

    setTimeout(() => {
      this.hideLoading();
    }, 300);
  }

  /**
   * Mostrar mensaje de error
   * @param {string} message - Mensaje de error
   * @param {number} duration - Duración en milisegundos
   */
  showError(message, duration = 5000) {
    this.hideLoading();

    if (this.errorMessage) {
      this.errorMessage.textContent = message;
    }

    this.show(this.errorContainer);
    this.hide(this.successContainer);

    // Auto-ocultar después de la duración especificada
    if (duration > 0) {
      this.alertTimeout = setTimeout(() => {
        this.hideAlert(this.errorContainer);
      }, duration);
    }
  }

  /**
   * Mostrar mensaje de éxito
   * @param {string} message - Mensaje de éxito
   * @param {number} duration - Duración en milisegundos
   */
  showSuccess(message, duration = 3000) {
    this.hideLoading();

    if (this.successMessage) {
      this.successMessage.textContent = message;
    }

    this.show(this.successContainer);
    this.hide(this.errorContainer);

    // Auto-ocultar después de la duración especificada
    if (duration > 0) {
      this.alertTimeout = setTimeout(() => {
        this.hideAlert(this.successContainer);
      }, duration);
    }
  }

  /**
   * Ocultar alert
   * @param {HTMLElement} container - Contenedor del alert
   */
  hideAlert(container) {
    this.hide(container);

    if (this.alertTimeout) {
      clearTimeout(this.alertTimeout);
      this.alertTimeout = null;
    }
  }

  /**
   * Cambiar vista de datos
   * @param {string} view - Vista a mostrar (cards, table, json)
   */
  switchView(view) {
    this.currentView = view;

    // Ocultar todas las vistas
    this.hide(this.cardsView);
    this.hide(this.tableView);
    this.hide(this.jsonView);

    // Actualizar botones
    this.viewTableBtn?.classList.remove('active');
    this.viewCardsBtn?.classList.remove('active');
    this.viewJsonBtn?.classList.remove('active');

    // Mostrar vista seleccionada
    switch (view) {
      case 'table':
        this.show(this.tableView);
        this.viewTableBtn?.classList.add('active');
        break;
      case 'json':
        this.show(this.jsonView);
        this.viewJsonBtn?.classList.add('active');
        break;
      default:
        this.show(this.cardsView);
        this.viewCardsBtn?.classList.add('active');
    }
  }

  /**
   * Mostrar datos en formato de cards
   * @param {Array} data - Datos a mostrar
   * @param {string} apiType - Tipo de API
   */
  showDataAsCards(data, apiType) {
    if (!this.dataCards) return;

    this.dataCards.innerHTML = '';

    if (!data || data.length === 0) {
      this.dataCards.innerHTML = `
                <div class="col-12 text-center text-muted py-5">
                    <i class="fas fa-inbox fa-3x mb-3"></i>
                    <p>No hay datos disponibles</p>
                </div>
            `;
      return;
    }

    data.forEach((item, index) => {
      const cardHtml = this.createCardHTML(item, apiType, index);
      this.dataCards.innerHTML += cardHtml;
    });

    // Animar entrada de las cards
    this.animateCards();
  }

  /**
   * Crear HTML para una card
   * @param {Object} item - Elemento de datos
   * @param {string} apiType - Tipo de API
   * @param {number} index - Índice del elemento
   * @returns {string} - HTML de la card
   */
  createCardHTML(item, apiType, index) {
    const delay = index * 50; // Delay progresivo para animación

    switch (apiType) {
      case 'users':
        return `
                    <div class="col-md-6 col-lg-4 mb-3">
                        <div class="card data-card fade-in" style="animation-delay: ${delay}ms">
                            <div class="card-body">
                                <div class="d-flex align-items-center mb-3">
                                    <i class="fas fa-user fa-2x text-primary me-3"></i>
                                    <div>
                                        <h5 class="card-title mb-0">${
                                          item.name || 'N/A'
                                        }</h5>
                                        <small class="text-muted">ID: ${
                                          item.id || 'N/A'
                                        }</small>
                                    </div>
                                </div>
                                <p class="card-text">
                                    <i class="fas fa-envelope me-2"></i>
                                    ${item.email || 'N/A'}
                                </p>
                                <p class="card-text">
                                    <i class="fas fa-phone me-2"></i>
                                    ${item.phone || 'N/A'}
                                </p>
                                ${
                                  item.website
                                    ? `
                                    <p class="card-text">
                                        <i class="fas fa-globe me-2"></i>
                                        <a href="http://${item.website}" target="_blank" class="text-decoration-none">
                                            ${item.website}
                                        </a>
                                    </p>
                                `
                                    : ''
                                }
                            </div>
                        </div>
                    </div>
                `;

      case 'posts':
        return `
                    <div class="col-md-6 col-lg-4 mb-3">
                        <div class="card data-card fade-in" style="animation-delay: ${delay}ms">
                            <div class="card-body">
                                <div class="d-flex align-items-center mb-3">
                                    <i class="fas fa-file-alt fa-2x text-info me-3"></i>
                                    <div>
                                        <small class="text-muted">Post ID: ${
                                          item.id || 'N/A'
                                        }</small>
                                    </div>
                                </div>
                                <h5 class="card-title text-truncate-2">${
                                  item.title || 'Sin título'
                                }</h5>
                                <p class="card-text text-truncate-3">${
                                  item.body || 'Sin contenido'
                                }</p>
                                <span class="badge bg-primary">
                                    <i class="fas fa-user me-1"></i>
                                    Usuario ${item.userId || 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>
                `;

      case 'todos':
        return `
                    <div class="col-md-6 col-lg-4 mb-3">
                        <div class="card data-card fade-in" style="animation-delay: ${delay}ms">
                            <div class="card-body">
                                <div class="d-flex align-items-center mb-3">
                                    <i class="fas fa-${
                                      item.completed
                                        ? 'check-circle text-success'
                                        : 'clock text-warning'
                                    } fa-2x me-3"></i>
                                    <div>
                                        <small class="text-muted">Tarea ID: ${
                                          item.id || 'N/A'
                                        }</small>
                                    </div>
                                </div>
                                <h5 class="card-title text-truncate-2">${
                                  item.title || 'Sin título'
                                }</h5>
                                <div class="d-flex justify-content-between align-items-center">
                                    <span class="badge bg-${
                                      item.completed ? 'success' : 'warning'
                                    }">
                                        <i class="fas fa-${
                                          item.completed ? 'check' : 'clock'
                                        } me-1"></i>
                                        ${
                                          item.completed
                                            ? 'Completada'
                                            : 'Pendiente'
                                        }
                                    </span>
                                    <span class="badge bg-primary">
                                        <i class="fas fa-user me-1"></i>
                                        Usuario ${item.userId || 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

      default:
        return `
                    <div class="col-md-6 col-lg-4 mb-3">
                        <div class="card data-card fade-in" style="animation-delay: ${delay}ms">
                            <div class="card-body">
                                <div class="d-flex align-items-center mb-3">
                                    <i class="fas fa-database fa-2x text-secondary me-3"></i>
                                    <div>
                                        <small class="text-muted">Elemento</small>
                                    </div>
                                </div>
                                <pre class="small">${JSON.stringify(
                                  item,
                                  null,
                                  2
                                )}</pre>
                            </div>
                        </div>
                    </div>
                `;
    }
  }

  /**
   * Mostrar datos en formato de tabla
   * @param {Array} data - Datos a mostrar
   * @param {string} apiType - Tipo de API
   */
  showDataAsTable(data, apiType) {
    if (!this.tableHeader || !this.tableBody) return;

    this.tableHeader.innerHTML = '';
    this.tableBody.innerHTML = '';

    if (!data || data.length === 0) {
      this.tableBody.innerHTML = `
                <tr>
                    <td colspan="100%" class="text-center text-muted py-5">
                        <i class="fas fa-inbox fa-2x mb-3"></i>
                        <br>No hay datos disponibles
                    </td>
                </tr>
            `;
      return;
    }

    // Crear headers
    const headers = this.getTableHeaders(data[0], apiType);
    headers.forEach(header => {
      const th = document.createElement('th');
      th.textContent = header.label;
      th.className = 'text-center';
      this.tableHeader.appendChild(th);
    });

    // Crear filas
    data.forEach((item, index) => {
      const row = document.createElement('tr');
      row.className = 'fade-in';
      row.style.animationDelay = `${index * 20}ms`;

      headers.forEach(header => {
        const td = document.createElement('td');
        td.className = 'text-center';

        let value = item[header.key];
        if (header.format) {
          value = header.format(value, item);
        }

        td.innerHTML = value || '-';
        row.appendChild(td);
      });

      this.tableBody.appendChild(row);
    });
  }

  /**
   * Obtener headers de tabla según el tipo de API
   * @param {Object} sampleItem - Elemento de muestra
   * @param {string} apiType - Tipo de API
   * @returns {Array} - Array de headers
   */
  getTableHeaders(sampleItem, apiType) {
    switch (apiType) {
      case 'users':
        return [
          { key: 'id', label: 'ID' },
          { key: 'name', label: 'Nombre' },
          { key: 'email', label: 'Email' },
          { key: 'phone', label: 'Teléfono' },
          {
            key: 'website',
            label: 'Sitio Web',
            format: value =>
              value
                ? `<a href="http://${value}" target="_blank">${value}</a>`
                : '-',
          },
        ];

      case 'posts':
        return [
          { key: 'id', label: 'ID' },
          {
            key: 'title',
            label: 'Título',
            format: value =>
              value
                ? `<span class="text-truncate d-inline-block" style="max-width: 200px;">${value}</span>`
                : '-',
          },
          { key: 'userId', label: 'Usuario ID' },
          {
            key: 'body',
            label: 'Contenido',
            format: value =>
              value
                ? `<span class="text-truncate d-inline-block" style="max-width: 300px;">${value}</span>`
                : '-',
          },
        ];

      case 'todos':
        return [
          { key: 'id', label: 'ID' },
          {
            key: 'title',
            label: 'Título',
            format: value =>
              value
                ? `<span class="text-truncate d-inline-block" style="max-width: 250px;">${value}</span>`
                : '-',
          },
          {
            key: 'completed',
            label: 'Estado',
            format: value =>
              value
                ? '<span class="badge bg-success"><i class="fas fa-check"></i> Completada</span>'
                : '<span class="badge bg-warning"><i class="fas fa-clock"></i> Pendiente</span>',
          },
          { key: 'userId', label: 'Usuario ID' },
        ];

      default:
        return Object.keys(sampleItem).map(key => ({
          key,
          label: key.charAt(0).toUpperCase() + key.slice(1),
        }));
    }
  }

  /**
   * Mostrar datos en formato JSON
   * @param {Array} data - Datos a mostrar
   */
  showDataAsJson(data) {
    if (!this.jsonContent) return;

    if (!data || data.length === 0) {
      this.jsonContent.textContent = 'No hay datos disponibles';
      return;
    }

    this.jsonContent.textContent = JSON.stringify(data, null, 2);
    this.jsonContent.className = 'fade-in';
  }

  /**
   * Actualizar métricas de rendimiento
   * @param {Object} metrics - Métricas a mostrar
   */
  updateMetrics(metrics) {
    this.metrics = { ...this.metrics, ...metrics };

    if (this.responseTimeEl) {
      this.responseTimeEl.textContent = `${this.metrics.responseTime}ms`;
    }

    if (this.dataSizeEl) {
      this.dataSizeEl.textContent = this.formatBytes(this.metrics.dataSize);
    }

    if (this.cacheHitsEl) {
      this.cacheHitsEl.textContent = this.metrics.cacheHits;
    }

    if (this.totalRequestsEl) {
      this.totalRequestsEl.textContent = this.metrics.totalRequests;
    }

    // Mostrar contenedor de métricas
    this.show(this.metricsContainer);
  }

  /**
   * Formatear bytes a formato legible
   * @param {number} bytes - Bytes a formatear
   * @returns {string} - Formato legible
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Animar entrada de cards
   */
  animateCards() {
    const cards = this.dataCards?.querySelectorAll('.data-card');
    if (!cards) return;

    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('fade-in');
      }, index * 50);
    });
  }

  /**
   * Limpiar datos mostrados
   */
  clearData() {
    if (this.dataCards) {
      this.dataCards.innerHTML = `
                <div class="col-12 text-center text-muted py-5">
                    <i class="fas fa-cloud-download-alt fa-3x mb-3"></i>
                    <p>Haz clic en "Obtener Datos" para comenzar</p>
                </div>
            `;
    }

    if (this.tableHeader) this.tableHeader.innerHTML = '';
    if (this.tableBody) this.tableBody.innerHTML = '';
    if (this.jsonContent) this.jsonContent.textContent = '';

    this.hide(this.metricsContainer);
    this.hide(this.errorContainer);
    this.hide(this.successContainer);
  }

  /**
   * Actualizar estado de conexión
   * @param {boolean} connected - Estado de conexión
   */
  updateConnectionStatus(connected) {
    if (this.connectionStatus) {
      this.connectionStatus.textContent = connected
        ? 'Conectado'
        : 'Desconectado';
      this.connectionStatus.className = connected
        ? 'text-success'
        : 'text-danger';
    }
  }

  /**
   * Actualizar estado de cache
   * @param {boolean} active - Estado del cache
   */
  updateCacheStatus(active) {
    if (this.cacheStatus) {
      this.cacheStatus.textContent = active ? 'Activo' : 'Inactivo';
      this.cacheStatus.className = active ? 'text-success' : 'text-warning';
    }
  }

  /**
   * Mostrar elemento DOM
   * @param {HTMLElement} element - Elemento a mostrar
   */
  show(element) {
    if (element) {
      element.style.display = 'block';
      element.classList.add('fade-in');
    }
  }

  /**
   * Ocultar elemento DOM
   * @param {HTMLElement} element - Elemento a ocultar
   */
  hide(element) {
    if (element) {
      element.style.display = 'none';
      element.classList.remove('fade-in');
    }
  }

  /**
   * Obtener vista actual
   * @returns {string} - Vista actual
   */
  getCurrentView() {
    return this.currentView;
  }

  /**
   * Mostrar datos según la vista actual
   * @param {Array} data - Datos a mostrar
   * @param {string} apiType - Tipo de API
   */
  showData(data, apiType) {
    switch (this.currentView) {
      case 'table':
        this.showDataAsTable(data, apiType);
        break;
      case 'json':
        this.showDataAsJson(data);
        break;
      default:
        this.showDataAsCards(data, apiType);
    }
  }
}

// Instancia singleton del manager de UI
const uiManager = new UIManager();

// Exportar la clase y la instancia
export { UIManager, uiManager };
