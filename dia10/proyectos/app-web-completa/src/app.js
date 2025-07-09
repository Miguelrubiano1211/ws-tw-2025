/**
 * APLICACIÓN PRINCIPAL - GESTIÓN DE PRODUCTOS
 *
 * Esta es la aplicación principal que integra todos los conceptos ES6+
 * aprendidos durante el Día 10: JavaScript Moderno
 *
 * Características implementadas:
 * - Clases ES6 y herencia
 * - Módulos ES6 (import/export)
 * - Arrow functions y template literals
 * - Destructuring y spread/rest operators
 * - Async/await y Promises
 * - Map, Set y otras estructuras modernas
 * - Patrones de diseño (Observer, Factory, etc.)
 */

// Importaciones de módulos
import { Modal } from './components/Modal.js';
import { ProductForm } from './components/ProductForm.js';
import { ProductList } from './components/ProductList.js';
import { SearchBar } from './components/SearchBar.js';
import config from './config.js';
import { ApiClient } from './services/ApiClient.js';
import { ProductService } from './services/ProductService.js';
import { Storage } from './services/Storage.js';
import { EventEmitter } from './utils/EventEmitter.js';
import { debounce, formatDate } from './utils/Helpers.js';
import { validateProduct } from './utils/Validators.js';

/**
 * Clase principal de la aplicación
 * Implementa el patrón Observer para manejo de eventos
 */
class App extends EventEmitter {
  constructor() {
    super();

    // Inicializar servicios
    this.apiClient = new ApiClient(config.API_CONFIG.baseUrl);
    this.storage = new Storage();
    this.productService = new ProductService(this.apiClient, this.storage);

    // Inicializar componentes
    this.components = new Map();
    this.modal = new Modal();

    // Estado de la aplicación
    this.state = {
      products: [],
      filteredProducts: [],
      categories: [...config.DEFAULT_CATEGORIES],
      currentPage: 1,
      itemsPerPage: config.PAGINATION_CONFIG.itemsPerPage,
      filters: {
        search: '',
        category: '',
        sort: 'name',
        direction: 'asc',
      },
      ui: {
        loading: false,
        view: 'grid',
      },
    };

    // Inicializar aplicación
    this.init();
  }

  /**
   * Inicializar la aplicación
   */
  async init() {
    try {
      console.log('🚀 Inicializando aplicación...');

      // Configurar elementos DOM
      this.setupDOM();

      // Inicializar componentes
      this.initComponents();

      // Configurar eventos
      this.setupEventListeners();

      // Cargar datos iniciales
      await this.loadInitialData();

      // Renderizar interfaz
      this.render();

      console.log('✅ Aplicación inicializada correctamente');
      this.showNotification('Aplicación cargada exitosamente', 'success');
    } catch (error) {
      console.error('❌ Error inicializando aplicación:', error);
      this.showNotification('Error al cargar la aplicación', 'error');
    }
  }

  /**
   * Configurar referencias DOM
   */
  setupDOM() {
    // Elementos principales
    this.elements = {
      searchInput: document.getElementById('searchInput'),
      categoryFilter: document.getElementById('categoryFilter'),
      sortFilter: document.getElementById('sortFilter'),
      addProductBtn: document.getElementById('addProductBtn'),
      productsGrid: document.getElementById('productsGrid'),
      loadingState: document.getElementById('loadingState'),
      emptyState: document.getElementById('emptyState'),
      pagination: document.getElementById('pagination'),
      prevBtn: document.getElementById('prevBtn'),
      nextBtn: document.getElementById('nextBtn'),
      currentPage: document.getElementById('currentPage'),
      totalPages: document.getElementById('totalPages'),
      viewButtons: document.querySelectorAll('.view-button'),
      navButtons: document.querySelectorAll('.nav-button'),
      toast: document.getElementById('toast'),
      toastMessage: document.getElementById('toastMessage'),
      toastIcon: document.getElementById('toastIcon'),
      toastClose: document.getElementById('toastClose'),
    };
  }

  /**
   * Inicializar componentes
   */
  initComponents() {
    // Crear instancias de componentes
    this.components.set(
      'productList',
      new ProductList(this.elements.productsGrid)
    );
    this.components.set('searchBar', new SearchBar(this.elements.searchInput));
    this.components.set('productForm', new ProductForm());

    // Configurar eventos de componentes
    this.components.get('productList').on('product:edit', product => {
      this.editProduct(product);
    });

    this.components.get('productList').on('product:delete', product => {
      this.deleteProduct(product);
    });

    this.components.get('searchBar').on(
      'search:change',
      debounce(query => {
        this.handleSearch(query);
      }, config.SEARCH_CONFIG.debounceTime)
    );

    this.components.get('productForm').on('product:save', productData => {
      this.saveProduct(productData);
    });
  }

  /**
   * Configurar event listeners
   */
  setupEventListeners() {
    // Botón agregar producto
    this.elements.addProductBtn?.addEventListener('click', () => {
      this.showProductForm();
    });

    // Filtros
    this.elements.categoryFilter?.addEventListener('change', e => {
      this.handleCategoryFilter(e.target.value);
    });

    this.elements.sortFilter?.addEventListener('change', e => {
      this.handleSort(e.target.value);
    });

    // Paginación
    this.elements.prevBtn?.addEventListener('click', () => {
      this.goToPreviousPage();
    });

    this.elements.nextBtn?.addEventListener('click', () => {
      this.goToNextPage();
    });

    // Cambio de vista
    this.elements.viewButtons?.forEach(button => {
      button.addEventListener('click', e => {
        this.changeView(e.target.dataset.view);
      });
    });

    // Navegación
    this.elements.navButtons?.forEach(button => {
      button.addEventListener('click', e => {
        this.handleNavigation(e.target.dataset.section);
      });
    });

    // Cerrar toast
    this.elements.toastClose?.addEventListener('click', () => {
      this.hideNotification();
    });

    // Atajos de teclado
    document.addEventListener('keydown', e => {
      this.handleKeyboardShortcuts(e);
    });
  }

  /**
   * Cargar datos iniciales
   */
  async loadInitialData() {
    try {
      this.setState({ ui: { ...this.state.ui, loading: true } });

      // Cargar productos
      const products = await this.productService.getAll();

      // Actualizar estado
      this.setState({
        products,
        filteredProducts: products,
        ui: { ...this.state.ui, loading: false },
      });

      // Poblar filtros
      this.populateFilters();
    } catch (error) {
      console.error('Error cargando datos:', error);
      this.setState({ ui: { ...this.state.ui, loading: false } });
      this.showNotification('Error cargando productos', 'error');
    }
  }

  /**
   * Actualizar estado de la aplicación
   */
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.emit('state:change', this.state);
  }

  /**
   * Renderizar la interfaz
   */
  render() {
    // Mostrar/ocultar loading
    if (this.state.ui.loading) {
      this.elements.loadingState?.style.setProperty('display', 'flex');
      this.elements.productsGrid?.style.setProperty('display', 'none');
      this.elements.emptyState?.style.setProperty('display', 'none');
    } else {
      this.elements.loadingState?.style.setProperty('display', 'none');

      // Mostrar productos o estado vacío
      if (this.state.filteredProducts.length > 0) {
        this.elements.productsGrid?.style.setProperty('display', 'grid');
        this.elements.emptyState?.style.setProperty('display', 'none');

        // Renderizar productos
        this.renderProducts();
      } else {
        this.elements.productsGrid?.style.setProperty('display', 'none');
        this.elements.emptyState?.style.setProperty('display', 'flex');
      }
    }

    // Actualizar paginación
    this.updatePagination();

    // Actualizar vista
    this.updateView();
  }

  /**
   * Renderizar productos
   */
  renderProducts() {
    const startIndex = (this.state.currentPage - 1) * this.state.itemsPerPage;
    const endIndex = startIndex + this.state.itemsPerPage;
    const productsToShow = this.state.filteredProducts.slice(
      startIndex,
      endIndex
    );

    // Usar componente ProductList
    this.components.get('productList').render(productsToShow);
  }

  /**
   * Actualizar paginación
   */
  updatePagination() {
    const totalPages = Math.ceil(
      this.state.filteredProducts.length / this.state.itemsPerPage
    );

    // Actualizar elementos
    if (this.elements.currentPage) {
      this.elements.currentPage.textContent = this.state.currentPage;
    }

    if (this.elements.totalPages) {
      this.elements.totalPages.textContent = totalPages;
    }

    // Habilitar/deshabilitar botones
    if (this.elements.prevBtn) {
      this.elements.prevBtn.disabled = this.state.currentPage <= 1;
    }

    if (this.elements.nextBtn) {
      this.elements.nextBtn.disabled = this.state.currentPage >= totalPages;
    }
  }

  /**
   * Actualizar vista
   */
  updateView() {
    // Actualizar botones de vista
    this.elements.viewButtons?.forEach(button => {
      button.classList.toggle(
        'active',
        button.dataset.view === this.state.ui.view
      );
    });

    // Actualizar clase del grid
    this.elements.productsGrid?.classList.toggle(
      'list-view',
      this.state.ui.view === 'list'
    );
    this.elements.productsGrid?.classList.toggle(
      'grid-view',
      this.state.ui.view === 'grid'
    );
  }

  /**
   * Poblar filtros
   */
  populateFilters() {
    // Poblar categorías
    if (this.elements.categoryFilter) {
      this.elements.categoryFilter.innerHTML =
        '<option value="">Todas las categorías</option>';

      this.state.categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = `${category.icon} ${category.name}`;
        this.elements.categoryFilter.appendChild(option);
      });
    }
  }

  /**
   * Manejar búsqueda
   */
  handleSearch(query) {
    this.setState({
      filters: { ...this.state.filters, search: query },
      currentPage: 1,
    });

    this.applyFilters();
  }

  /**
   * Manejar filtro de categoría
   */
  handleCategoryFilter(categoryId) {
    this.setState({
      filters: { ...this.state.filters, category: categoryId },
      currentPage: 1,
    });

    this.applyFilters();
  }

  /**
   * Manejar ordenamiento
   */
  handleSort(sortValue) {
    const [field, direction] = sortValue.split(':');

    this.setState({
      filters: {
        ...this.state.filters,
        sort: field,
        direction: direction || 'asc',
      },
      currentPage: 1,
    });

    this.applyFilters();
  }

  /**
   * Aplicar filtros
   */
  applyFilters() {
    let filtered = [...this.state.products];

    // Filtro de búsqueda
    if (this.state.filters.search) {
      const searchTerm = this.state.filters.search.toLowerCase();
      filtered = filtered.filter(
        product =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm)
      );
    }

    // Filtro de categoría
    if (this.state.filters.category) {
      filtered = filtered.filter(
        product => product.category === this.state.filters.category
      );
    }

    // Ordenamiento
    filtered.sort((a, b) => {
      const { sort, direction } = this.state.filters;
      let aValue = a[sort];
      let bValue = b[sort];

      // Convertir a números si es necesario
      if (sort === 'price' || sort === 'stock') {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }

      // Convertir a fechas si es necesario
      if (sort === 'date') {
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
      }

      let comparison = 0;
      if (aValue > bValue) comparison = 1;
      if (aValue < bValue) comparison = -1;

      return direction === 'desc' ? -comparison : comparison;
    });

    this.setState({ filteredProducts: filtered });
    this.render();
  }

  /**
   * Mostrar formulario de producto
   */
  showProductForm(product = null) {
    const form = this.components.get('productForm');
    const title = product ? 'Editar Producto' : 'Agregar Producto';

    form.setData(product);
    this.modal.show(title, form.render());
  }

  /**
   * Editar producto
   */
  editProduct(product) {
    this.showProductForm(product);
  }

  /**
   * Eliminar producto
   */
  async deleteProduct(product) {
    if (confirm(`¿Estás seguro de que quieres eliminar "${product.name}"?`)) {
      try {
        await this.productService.delete(product.id);

        // Actualizar estado
        const updatedProducts = this.state.products.filter(
          p => p.id !== product.id
        );
        this.setState({ products: updatedProducts });

        // Reaplicar filtros
        this.applyFilters();

        this.showNotification('Producto eliminado exitosamente', 'success');
      } catch (error) {
        console.error('Error eliminando producto:', error);
        this.showNotification('Error eliminando producto', 'error');
      }
    }
  }

  /**
   * Guardar producto
   */
  async saveProduct(productData) {
    try {
      // Validar datos
      const validation = validateProduct(productData);
      if (!validation.valid) {
        this.showNotification(validation.errors.join(', '), 'error');
        return;
      }

      let savedProduct;

      if (productData.id) {
        // Actualizar producto existente
        savedProduct = await this.productService.update(
          productData.id,
          productData
        );

        // Actualizar en el estado
        const updatedProducts = this.state.products.map(p =>
          p.id === productData.id ? savedProduct : p
        );
        this.setState({ products: updatedProducts });

        this.showNotification('Producto actualizado exitosamente', 'success');
      } else {
        // Crear nuevo producto
        savedProduct = await this.productService.create(productData);

        // Agregar al estado
        const updatedProducts = [...this.state.products, savedProduct];
        this.setState({ products: updatedProducts });

        this.showNotification('Producto creado exitosamente', 'success');
      }

      // Cerrar modal
      this.modal.hide();

      // Reaplicar filtros
      this.applyFilters();
    } catch (error) {
      console.error('Error guardando producto:', error);
      this.showNotification('Error guardando producto', 'error');
    }
  }

  /**
   * Navegar a la página anterior
   */
  goToPreviousPage() {
    if (this.state.currentPage > 1) {
      this.setState({ currentPage: this.state.currentPage - 1 });
      this.render();
    }
  }

  /**
   * Navegar a la página siguiente
   */
  goToNextPage() {
    const totalPages = Math.ceil(
      this.state.filteredProducts.length / this.state.itemsPerPage
    );
    if (this.state.currentPage < totalPages) {
      this.setState({ currentPage: this.state.currentPage + 1 });
      this.render();
    }
  }

  /**
   * Cambiar vista
   */
  changeView(view) {
    this.setState({ ui: { ...this.state.ui, view } });
    this.render();
  }

  /**
   * Manejar navegación
   */
  handleNavigation(section) {
    // Actualizar botones activos
    this.elements.navButtons?.forEach(button => {
      button.classList.toggle('active', button.dataset.section === section);
    });

    // Lógica de navegación
    switch (section) {
      case 'products':
        // Ya estamos en productos
        break;
      case 'categories':
        this.showNotification(
          'Funcionalidad de categorías en desarrollo',
          'info'
        );
        break;
      case 'stats':
        this.showNotification(
          'Funcionalidad de estadísticas en desarrollo',
          'info'
        );
        break;
    }
  }

  /**
   * Manejar atajos de teclado
   */
  handleKeyboardShortcuts(event) {
    const { key, ctrlKey, metaKey } = event;
    const modifier = ctrlKey || metaKey;

    switch (true) {
      case modifier && key === 'n':
        event.preventDefault();
        this.showProductForm();
        break;
      case modifier && key === 'f':
        event.preventDefault();
        this.elements.searchInput?.focus();
        break;
      case key === 'Escape':
        this.modal.hide();
        break;
    }
  }

  /**
   * Mostrar notificación
   */
  showNotification(message, type = 'info') {
    const typeConfig = config.NOTIFICATION_CONFIG.types[type];

    if (this.elements.toastIcon) {
      this.elements.toastIcon.textContent = typeConfig.icon;
    }

    if (this.elements.toastMessage) {
      this.elements.toastMessage.textContent = message;
    }

    if (this.elements.toast) {
      this.elements.toast.className = `toast ${typeConfig.className} show`;

      // Auto-hide después de un tiempo
      setTimeout(() => {
        this.hideNotification();
      }, config.NOTIFICATION_CONFIG.duration);
    }
  }

  /**
   * Ocultar notificación
   */
  hideNotification() {
    if (this.elements.toast) {
      this.elements.toast.classList.remove('show');
    }
  }

  /**
   * Exportar datos
   */
  async exportData() {
    try {
      const dataToExport = {
        products: this.state.products,
        categories: this.state.categories,
        exportDate: new Date().toISOString(),
      };

      const dataStr = JSON.stringify(dataToExport, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `productos_${formatDate(new Date(), 'YYYY-MM-DD')}.json`;
      link.click();

      URL.revokeObjectURL(url);

      this.showNotification('Datos exportados exitosamente', 'success');
    } catch (error) {
      console.error('Error exportando datos:', error);
      this.showNotification('Error exportando datos', 'error');
    }
  }

  /**
   * Obtener estadísticas
   */
  getStats() {
    const products = this.state.products;

    return {
      total: products.length,
      totalValue: products.reduce((sum, p) => sum + p.price * p.stock, 0),
      averagePrice:
        products.reduce((sum, p) => sum + p.price, 0) / products.length,
      totalStock: products.reduce((sum, p) => sum + p.stock, 0),
      lowStock: products.filter(p => p.stock < 10).length,
      categories: this.state.categories.length,
      outOfStock: products.filter(p => p.stock === 0).length,
    };
  }
}

// Inicializar aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});

// Exportar para uso en otros módulos
export default App;
