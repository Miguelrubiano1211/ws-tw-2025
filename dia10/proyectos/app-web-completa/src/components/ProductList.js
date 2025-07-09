/**
 * COMPONENTE ProductList - Lista de Productos
 *
 * Componente que maneja la visualización de productos
 * con funcionalidades de filtrado, ordenamiento y paginación
 *
 * Características ES6+:
 * - Clases ES6 con métodos estáticos
 * - Map y Set para optimización
 * - Array methods modernos (filter, sort, map)
 * - Destructuring y spread operator
 * - Template literals
 * - Arrow functions
 */

import { debounce } from '../utils/Helpers.js';
import { ProductCard } from './ProductCard.js';

export class ProductList {
  constructor(container, { onEdit, onDelete, onSelectionChange } = {}) {
    this.container = container;
    this.onEdit = onEdit;
    this.onDelete = onDelete;
    this.onSelectionChange = onSelectionChange;

    // Estado de la lista
    this.products = [];
    this.filteredProducts = [];
    this.currentPage = 1;
    this.itemsPerPage = 12;
    this.totalPages = 0;

    // Filtros y ordenamiento
    this.filters = {
      search: '',
      category: '',
      status: '',
      priceRange: { min: 0, max: Infinity },
    };

    this.sorting = {
      field: 'name',
      direction: 'asc',
    };

    // Componentes de tarjetas (Map para optimización)
    this.cards = new Map();

    // Productos seleccionados (Set para unicidad)
    this.selectedProducts = new Set();

    // Configuración de vista
    this.viewMode = 'grid'; // 'grid' | 'list'
    this.showFilters = true;

    this.init();
  }

  /**
   * Inicializa el componente
   */
  init() {
    this.render();
    this.bindEvents();
  }

  /**
   * Renderiza la lista completa
   */
  render() {
    this.container.innerHTML = `
            <div class="product-list">
                ${this.renderHeader()}
                ${this.renderFilters()}
                ${this.renderContent()}
                ${this.renderPagination()}
            </div>
        `;

    this.bindEvents();
  }

  /**
   * Renderiza el header de la lista
   */
  renderHeader() {
    const selectedCount = this.selectedProducts.size;
    const totalCount = this.products.length;
    const filteredCount = this.filteredProducts.length;

    return `
            <div class="product-list__header">
                <div class="list-info">
                    <h2 class="list-title">
                        Productos 
                        <span class="count">(${filteredCount}${
      filteredCount !== totalCount ? ` de ${totalCount}` : ''
    })</span>
                    </h2>
                    
                    ${
                      selectedCount > 0
                        ? `
                        <div class="selection-info">
                            <span class="selected-count">${selectedCount} seleccionado${
                            selectedCount > 1 ? 's' : ''
                          }</span>
                            <button class="btn btn-sm btn-ghost" data-action="clear-selection">
                                Limpiar selección
                            </button>
                        </div>
                    `
                        : ''
                    }
                </div>
                
                <div class="list-actions">
                    <div class="view-controls">
                        <button class="btn btn-icon ${
                          this.viewMode === 'grid' ? 'active' : ''
                        }" 
                                data-action="view-grid" 
                                title="Vista en cuadrícula">
                            <i class="icon-grid"></i>
                        </button>
                        <button class="btn btn-icon ${
                          this.viewMode === 'list' ? 'active' : ''
                        }" 
                                data-action="view-list" 
                                title="Vista en lista">
                            <i class="icon-list"></i>
                        </button>
                    </div>
                    
                    <button class="btn btn-icon" 
                            data-action="toggle-filters" 
                            title="Mostrar/Ocultar filtros">
                        <i class="icon-filter"></i>
                    </button>
                    
                    <div class="sort-controls">
                        <select class="form-select" data-action="sort-change">
                            <option value="name:asc" ${
                              this.sorting.field === 'name' &&
                              this.sorting.direction === 'asc'
                                ? 'selected'
                                : ''
                            }>
                                Nombre A-Z
                            </option>
                            <option value="name:desc" ${
                              this.sorting.field === 'name' &&
                              this.sorting.direction === 'desc'
                                ? 'selected'
                                : ''
                            }>
                                Nombre Z-A
                            </option>
                            <option value="price:asc" ${
                              this.sorting.field === 'price' &&
                              this.sorting.direction === 'asc'
                                ? 'selected'
                                : ''
                            }>
                                Precio menor
                            </option>
                            <option value="price:desc" ${
                              this.sorting.field === 'price' &&
                              this.sorting.direction === 'desc'
                                ? 'selected'
                                : ''
                            }>
                                Precio mayor
                            </option>
                            <option value="stock:asc" ${
                              this.sorting.field === 'stock' &&
                              this.sorting.direction === 'asc'
                                ? 'selected'
                                : ''
                            }>
                                Stock menor
                            </option>
                            <option value="stock:desc" ${
                              this.sorting.field === 'stock' &&
                              this.sorting.direction === 'desc'
                                ? 'selected'
                                : ''
                            }>
                                Stock mayor
                            </option>
                            <option value="createdAt:desc" ${
                              this.sorting.field === 'createdAt' &&
                              this.sorting.direction === 'desc'
                                ? 'selected'
                                : ''
                            }>
                                Más reciente
                            </option>
                        </select>
                    </div>
                </div>
            </div>
        `;
  }

  /**
   * Renderiza los filtros
   */
  renderFilters() {
    if (!this.showFilters) return '';

    const categories = [...new Set(this.products.map(p => p.category))];
    const { search, category, status, priceRange } = this.filters;

    return `
            <div class="product-list__filters">
                <div class="filters-row">
                    <div class="filter-group">
                        <label class="filter-label">Buscar:</label>
                        <input 
                            type="text" 
                            class="form-input" 
                            placeholder="Buscar productos..."
                            value="${search}"
                            data-filter="search"
                        >
                    </div>
                    
                    <div class="filter-group">
                        <label class="filter-label">Categoría:</label>
                        <select class="form-select" data-filter="category">
                            <option value="">Todas las categorías</option>
                            ${categories
                              .map(
                                cat => `
                                <option value="${cat}" ${
                                  category === cat ? 'selected' : ''
                                }>
                                    ${this.getCategoryLabel(cat)}
                                </option>
                            `
                              )
                              .join('')}
                        </select>
                    </div>
                    
                    <div class="filter-group">
                        <label class="filter-label">Estado:</label>
                        <select class="form-select" data-filter="status">
                            <option value="">Todos los estados</option>
                            <option value="active" ${
                              status === 'active' ? 'selected' : ''
                            }>Activo</option>
                            <option value="inactive" ${
                              status === 'inactive' ? 'selected' : ''
                            }>Inactivo</option>
                        </select>
                    </div>
                    
                    <div class="filter-group">
                        <label class="filter-label">Precio:</label>
                        <div class="price-range">
                            <input 
                                type="number" 
                                class="form-input" 
                                placeholder="Min"
                                value="${priceRange.min || ''}"
                                data-filter="price-min"
                            >
                            <span class="separator">-</span>
                            <input 
                                type="number" 
                                class="form-input" 
                                placeholder="Max"
                                value="${
                                  priceRange.max === Infinity
                                    ? ''
                                    : priceRange.max
                                }"
                                data-filter="price-max"
                            >
                        </div>
                    </div>
                    
                    <div class="filter-group">
                        <button class="btn btn-secondary" data-action="clear-filters">
                            Limpiar filtros
                        </button>
                    </div>
                </div>
            </div>
        `;
  }

  /**
   * Renderiza el contenido principal
   */
  renderContent() {
    const isEmpty = this.filteredProducts.length === 0;
    const paginatedProducts = this.getPaginatedProducts();

    return `
            <div class="product-list__content ${this.viewMode}">
                ${isEmpty ? this.renderEmptyState() : ''}
                
                <div class="products-grid ${
                  this.viewMode
                }" data-container="products">
                    ${paginatedProducts
                      .map(
                        product =>
                          `<div class="product-container" data-product-id="${product.id}"></div>`
                      )
                      .join('')}
                </div>
                
                ${
                  this.selectedProducts.size > 0 ? this.renderBulkActions() : ''
                }
            </div>
        `;
  }

  /**
   * Renderiza estado vacío
   */
  renderEmptyState() {
    const hasFilters = this.hasActiveFilters();

    return `
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="icon-package"></i>
                </div>
                <h3 class="empty-title">
                    ${
                      hasFilters
                        ? 'No se encontraron productos'
                        : 'No hay productos'
                    }
                </h3>
                <p class="empty-description">
                    ${
                      hasFilters
                        ? 'Intenta ajustar los filtros para ver más resultados'
                        : 'Comienza agregando tu primer producto'
                    }
                </p>
                ${
                  hasFilters
                    ? `
                    <button class="btn btn-primary" data-action="clear-filters">
                        Limpiar filtros
                    </button>
                `
                    : ''
                }
            </div>
        `;
  }

  /**
   * Renderiza acciones masivas
   */
  renderBulkActions() {
    return `
            <div class="bulk-actions">
                <div class="bulk-actions__info">
                    ${this.selectedProducts.size} producto${
      this.selectedProducts.size > 1 ? 's' : ''
    } seleccionado${this.selectedProducts.size > 1 ? 's' : ''}
                </div>
                
                <div class="bulk-actions__buttons">
                    <button class="btn btn-secondary" data-action="bulk-activate">
                        Activar
                    </button>
                    <button class="btn btn-secondary" data-action="bulk-deactivate">
                        Desactivar
                    </button>
                    <button class="btn btn-danger" data-action="bulk-delete">
                        Eliminar
                    </button>
                </div>
            </div>
        `;
  }

  /**
   * Renderiza paginación
   */
  renderPagination() {
    if (this.totalPages <= 1) return '';

    const pages = this.generatePageNumbers();

    return `
            <div class="product-list__pagination">
                <div class="pagination-info">
                    Página ${this.currentPage} de ${this.totalPages}
                    (${this.filteredProducts.length} productos)
                </div>
                
                <div class="pagination-controls">
                    <button class="btn btn-icon" 
                            data-action="page-first" 
                            ${this.currentPage === 1 ? 'disabled' : ''}
                            title="Primera página">
                        <i class="icon-first"></i>
                    </button>
                    
                    <button class="btn btn-icon" 
                            data-action="page-prev" 
                            ${this.currentPage === 1 ? 'disabled' : ''}
                            title="Página anterior">
                        <i class="icon-prev"></i>
                    </button>
                    
                    ${pages
                      .map(
                        page => `
                        <button class="btn btn-page ${
                          page === this.currentPage ? 'active' : ''
                        }" 
                                data-action="page-goto" 
                                data-page="${page}">
                            ${page}
                        </button>
                    `
                      )
                      .join('')}
                    
                    <button class="btn btn-icon" 
                            data-action="page-next" 
                            ${
                              this.currentPage === this.totalPages
                                ? 'disabled'
                                : ''
                            }
                            title="Página siguiente">
                        <i class="icon-next"></i>
                    </button>
                    
                    <button class="btn btn-icon" 
                            data-action="page-last" 
                            ${
                              this.currentPage === this.totalPages
                                ? 'disabled'
                                : ''
                            }
                            title="Última página">
                        <i class="icon-last"></i>
                    </button>
                </div>
                
                <div class="pagination-size">
                    <select class="form-select" data-action="page-size-change">
                        <option value="12" ${
                          this.itemsPerPage === 12 ? 'selected' : ''
                        }>12 por página</option>
                        <option value="24" ${
                          this.itemsPerPage === 24 ? 'selected' : ''
                        }>24 por página</option>
                        <option value="48" ${
                          this.itemsPerPage === 48 ? 'selected' : ''
                        }>48 por página</option>
                        <option value="96" ${
                          this.itemsPerPage === 96 ? 'selected' : ''
                        }>96 por página</option>
                    </select>
                </div>
            </div>
        `;
  }

  /**
   * Vincula eventos del componente
   */
  bindEvents() {
    this.container.addEventListener('click', this.handleClick);
    this.container.addEventListener('input', debounce(this.handleInput, 300));
    this.container.addEventListener('change', this.handleChange);
  }

  /**
   * Maneja clicks en el componente
   */
  handleClick = event => {
    const action = event.target.dataset.action;

    if (!action) return;

    event.preventDefault();

    switch (action) {
      case 'view-grid':
        this.setViewMode('grid');
        break;
      case 'view-list':
        this.setViewMode('list');
        break;
      case 'toggle-filters':
        this.toggleFilters();
        break;
      case 'clear-filters':
        this.clearFilters();
        break;
      case 'clear-selection':
        this.clearSelection();
        break;
      case 'sort-change':
        this.handleSortChange(event.target.value);
        break;
      case 'page-first':
        this.goToPage(1);
        break;
      case 'page-prev':
        this.goToPage(this.currentPage - 1);
        break;
      case 'page-next':
        this.goToPage(this.currentPage + 1);
        break;
      case 'page-last':
        this.goToPage(this.totalPages);
        break;
      case 'page-goto':
        this.goToPage(parseInt(event.target.dataset.page));
        break;
      case 'page-size-change':
        this.setItemsPerPage(parseInt(event.target.value));
        break;
      case 'bulk-activate':
        this.bulkAction('activate');
        break;
      case 'bulk-deactivate':
        this.bulkAction('deactivate');
        break;
      case 'bulk-delete':
        this.bulkAction('delete');
        break;
    }
  };

  /**
   * Maneja cambios en inputs
   */
  handleInput = event => {
    const filter = event.target.dataset.filter;

    if (!filter) return;

    this.handleFilterChange(filter, event.target.value);
  };

  /**
   * Maneja cambios en selects
   */
  handleChange = event => {
    const filter = event.target.dataset.filter;

    if (filter) {
      this.handleFilterChange(filter, event.target.value);
    }
  };

  /**
   * Maneja cambios en filtros
   */
  handleFilterChange(filterType, value) {
    switch (filterType) {
      case 'search':
        this.filters.search = value;
        break;
      case 'category':
        this.filters.category = value;
        break;
      case 'status':
        this.filters.status = value;
        break;
      case 'price-min':
        this.filters.priceRange.min = value ? parseFloat(value) : 0;
        break;
      case 'price-max':
        this.filters.priceRange.max = value ? parseFloat(value) : Infinity;
        break;
    }

    this.applyFilters();
  }

  /**
   * Maneja cambios en ordenamiento
   */
  handleSortChange(sortValue) {
    const [field, direction] = sortValue.split(':');

    this.sorting = { field, direction };
    this.applySorting();
  }

  /**
   * Establece productos
   */
  setProducts(products) {
    this.products = [...products];
    this.applyFilters();
  }

  /**
   * Agrega un producto
   */
  addProduct(product) {
    this.products.push(product);
    this.applyFilters();
  }

  /**
   * Actualiza un producto
   */
  updateProduct(productId, updates) {
    const index = this.products.findIndex(p => p.id === productId);

    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...updates };
      this.applyFilters();

      // Actualizar tarjeta si existe
      const card = this.cards.get(productId);
      if (card) {
        card.updateProduct(updates);
      }
    }
  }

  /**
   * Elimina un producto
   */
  removeProduct(productId) {
    this.products = this.products.filter(p => p.id !== productId);
    this.selectedProducts.delete(productId);

    // Limpiar tarjeta
    const card = this.cards.get(productId);
    if (card) {
      card.destroy();
      this.cards.delete(productId);
    }

    this.applyFilters();
  }

  /**
   * Aplica filtros a los productos
   */
  applyFilters() {
    const { search, category, status, priceRange } = this.filters;

    this.filteredProducts = this.products.filter(product => {
      // Filtro de búsqueda
      if (
        search &&
        !product.name.toLowerCase().includes(search.toLowerCase()) &&
        !product.description.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }

      // Filtro de categoría
      if (category && product.category !== category) {
        return false;
      }

      // Filtro de estado
      if (status && product.status !== status) {
        return false;
      }

      // Filtro de precio
      if (product.price < priceRange.min || product.price > priceRange.max) {
        return false;
      }

      return true;
    });

    this.applySorting();
  }

  /**
   * Aplica ordenamiento
   */
  applySorting() {
    const { field, direction } = this.sorting;

    this.filteredProducts.sort((a, b) => {
      let aValue = a[field];
      let bValue = b[field];

      // Manejar fechas
      if (field === 'createdAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      // Manejar strings
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      let comparison = 0;

      if (aValue < bValue) {
        comparison = -1;
      } else if (aValue > bValue) {
        comparison = 1;
      }

      return direction === 'desc' ? comparison * -1 : comparison;
    });

    this.updatePagination();
    this.renderProducts();
  }

  /**
   * Actualiza la paginación
   */
  updatePagination() {
    this.totalPages = Math.ceil(
      this.filteredProducts.length / this.itemsPerPage
    );

    // Ajustar página actual si es necesario
    if (this.currentPage > this.totalPages) {
      this.currentPage = Math.max(1, this.totalPages);
    }
  }

  /**
   * Obtiene productos paginados
   */
  getPaginatedProducts() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;

    return this.filteredProducts.slice(start, end);
  }

  /**
   * Renderiza productos
   */
  renderProducts() {
    const productsContainer = this.container.querySelector(
      '[data-container="products"]'
    );

    if (!productsContainer) return;

    // Limpiar tarjetas existentes
    this.cards.forEach(card => card.destroy());
    this.cards.clear();

    // Renderizar contenido actualizado
    const contentDiv = this.container.querySelector('.product-list__content');
    contentDiv.innerHTML = this.renderContent();

    // Crear nuevas tarjetas
    const paginatedProducts = this.getPaginatedProducts();
    const newContainer = this.container.querySelector(
      '[data-container="products"]'
    );

    paginatedProducts.forEach(product => {
      const cardContainer = newContainer.querySelector(
        `[data-product-id="${product.id}"]`
      );

      if (cardContainer) {
        const card = new ProductCard(product, this.onEdit, this.onDelete);

        cardContainer.appendChild(card.domElement);
        this.cards.set(product.id, card);
      }
    });

    // Actualizar paginación
    const paginationDiv = this.container.querySelector(
      '.product-list__pagination'
    );
    if (paginationDiv) {
      paginationDiv.outerHTML = this.renderPagination();
    }
  }

  /**
   * Genera números de página
   */
  generatePageNumbers() {
    const pages = [];
    const maxVisible = 5;

    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);

    // Ajustar si estamos cerca del final
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  /**
   * Va a una página específica
   */
  goToPage(page) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.renderProducts();
    }
  }

  /**
   * Establece items por página
   */
  setItemsPerPage(itemsPerPage) {
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
    this.updatePagination();
    this.renderProducts();
  }

  /**
   * Establece modo de vista
   */
  setViewMode(mode) {
    this.viewMode = mode;
    this.render();
  }

  /**
   * Alterna filtros
   */
  toggleFilters() {
    this.showFilters = !this.showFilters;
    this.render();
  }

  /**
   * Limpia filtros
   */
  clearFilters() {
    this.filters = {
      search: '',
      category: '',
      status: '',
      priceRange: { min: 0, max: Infinity },
    };

    this.applyFilters();
  }

  /**
   * Limpia selección
   */
  clearSelection() {
    this.selectedProducts.clear();
    this.render();
  }

  /**
   * Verifica si hay filtros activos
   */
  hasActiveFilters() {
    return (
      this.filters.search ||
      this.filters.category ||
      this.filters.status ||
      this.filters.priceRange.min > 0 ||
      this.filters.priceRange.max < Infinity
    );
  }

  /**
   * Obtiene etiqueta de categoría
   */
  getCategoryLabel(category) {
    const labels = {
      electronics: 'Electrónicos',
      clothing: 'Ropa',
      books: 'Libros',
      home: 'Hogar',
      sports: 'Deportes',
    };

    return labels[category] || category;
  }

  /**
   * Acciones masivas
   */
  bulkAction(action) {
    if (this.selectedProducts.size === 0) return;

    const productIds = Array.from(this.selectedProducts);

    switch (action) {
      case 'activate':
        productIds.forEach(id => this.updateProduct(id, { status: 'active' }));
        break;
      case 'deactivate':
        productIds.forEach(id =>
          this.updateProduct(id, { status: 'inactive' })
        );
        break;
      case 'delete':
        const confirmed = confirm(
          `¿Estás seguro de eliminar ${productIds.length} producto${
            productIds.length > 1 ? 's' : ''
          }?`
        );
        if (confirmed) {
          productIds.forEach(id => this.removeProduct(id));
        }
        break;
    }

    this.clearSelection();
  }

  /**
   * Destruye el componente
   */
  destroy() {
    this.cards.forEach(card => card.destroy());
    this.cards.clear();
    this.selectedProducts.clear();

    this.container.removeEventListener('click', this.handleClick);
    this.container.removeEventListener('input', this.handleInput);
    this.container.removeEventListener('change', this.handleChange);

    this.container.innerHTML = '';
  }
}

/* 
📚 NOTAS PEDAGÓGICAS:

1. **Map y Set**: Uso de Map para tarjetas y Set para selección
2. **Array Methods**: filter, map, sort para manipulación de datos
3. **Destructuring**: En parámetros y asignaciones
4. **Spread Operator**: Para inmutabilidad en actualizaciones
5. **Template Literals**: Para generar HTML complejo
6. **Arrow Functions**: Para event handlers y callbacks
7. **Debouncing**: Para optimizar filtros en tiempo real
8. **Paginación**: Implementación completa con cálculos
9. **Event Delegation**: Para manejar múltiples eventos
10. **Componente Complejo**: Manejo de estado y sub-componentes

🎯 EJERCICIOS SUGERIDOS:
- Agregar filtros avanzados (fecha, rango de stock)
- Implementar ordenamiento por múltiples campos
- Agregar búsqueda con highlighting
- Implementar lazy loading para grandes datasets
*/
