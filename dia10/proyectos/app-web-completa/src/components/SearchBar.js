/**
 * COMPONENTE SearchBar - Barra de Búsqueda
 *
 * Componente de búsqueda avanzada con autocompletado,
 * filtros rápidos y sugerencias
 *
 * Características ES6+:
 * - Clases ES6 con métodos estáticos
 * - Async/await para búsquedas
 * - Destructuring y spread operator
 * - Template literals
 * - Arrow functions
 * - Set para sugerencias únicas
 * - Debouncing para optimización
 */

import { debounce } from '../utils/Helpers.js';

export class SearchBar {
  constructor(container, { onSearch, onFilterChange, products = [] } = {}) {
    this.container = container;
    this.onSearch = onSearch;
    this.onFilterChange = onFilterChange;
    this.products = products;

    // Estado del componente
    this.searchTerm = '';
    this.isOpen = false;
    this.selectedIndex = -1;
    this.suggestions = [];
    this.quickFilters = new Set();

    // Configuración
    this.maxSuggestions = 8;
    this.minSearchLength = 2;
    this.searchDelay = 300;

    // Referencias de elementos
    this.elements = {
      input: null,
      dropdown: null,
      suggestions: null,
      quickFilters: null,
    };

    // Crear búsqueda debounced
    this.debouncedSearch = debounce(this.performSearch, this.searchDelay);

    this.init();
  }

  /**
   * Inicializa el componente
   */
  init() {
    this.render();
    this.bindEvents();
    this.generateQuickFilters();
  }

  /**
   * Renderiza la barra de búsqueda
   */
  render() {
    this.container.innerHTML = `
            <div class="search-bar">
                <div class="search-input-wrapper">
                    <div class="search-input-container">
                        <input 
                            type="text" 
                            class="search-input" 
                            placeholder="Buscar productos..." 
                            value="${this.searchTerm}"
                            autocomplete="off"
                            spellcheck="false"
                        >
                        <div class="search-icons">
                            <i class="icon-search search-icon"></i>
                            <button class="clear-search" style="display: none;">
                                <i class="icon-close"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="search-dropdown" style="display: none;">
                        <div class="search-suggestions">
                            <!-- Sugerencias se insertan aquí -->
                        </div>
                        
                        <div class="search-actions">
                            <button class="search-action" data-action="search-all">
                                <i class="icon-search"></i>
                                Buscar en todos los productos
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="search-filters">
                    <div class="quick-filters">
                        <!-- Filtros rápidos se insertan aquí -->
                    </div>
                    
                    <div class="search-stats" style="display: none;">
                        <span class="results-count">0 resultados</span>
                        <button class="clear-all" data-action="clear-all">
                            Limpiar todo
                        </button>
                    </div>
                </div>
            </div>
        `;

    this.cacheElements();
  }

  /**
   * Cachea referencias de elementos
   */
  cacheElements() {
    this.elements.input = this.container.querySelector('.search-input');
    this.elements.dropdown = this.container.querySelector('.search-dropdown');
    this.elements.suggestions = this.container.querySelector(
      '.search-suggestions'
    );
    this.elements.quickFilters = this.container.querySelector('.quick-filters');
    this.elements.clearBtn = this.container.querySelector('.clear-search');
    this.elements.stats = this.container.querySelector('.search-stats');
    this.elements.resultsCount = this.container.querySelector('.results-count');
  }

  /**
   * Vincula eventos
   */
  bindEvents() {
    // Eventos del input
    this.elements.input.addEventListener('input', this.handleInput);
    this.elements.input.addEventListener('focus', this.handleFocus);
    this.elements.input.addEventListener('blur', this.handleBlur);
    this.elements.input.addEventListener('keydown', this.handleKeydown);

    // Eventos del dropdown
    this.elements.dropdown.addEventListener('click', this.handleDropdownClick);

    // Eventos de filtros rápidos
    this.elements.quickFilters.addEventListener(
      'click',
      this.handleQuickFilterClick
    );

    // Evento de limpiar búsqueda
    this.elements.clearBtn.addEventListener('click', this.clearSearch);

    // Evento de limpiar todo
    this.container.addEventListener('click', this.handleActionClick);

    // Cerrar dropdown al hacer click fuera
    document.addEventListener('click', this.handleDocumentClick);
  }

  /**
   * Maneja entrada en el input
   */
  handleInput = event => {
    const value = event.target.value;
    this.searchTerm = value;

    this.updateClearButton();

    if (value.length >= this.minSearchLength) {
      this.debouncedSearch(value);
      this.generateSuggestions(value);
    } else {
      this.hideSuggestions();
    }
  };

  /**
   * Maneja focus en el input
   */
  handleFocus = () => {
    if (this.searchTerm.length >= this.minSearchLength) {
      this.showSuggestions();
    }
  };

  /**
   * Maneja blur en el input
   */
  handleBlur = event => {
    // Delay para permitir clicks en el dropdown
    setTimeout(() => {
      if (!this.container.contains(document.activeElement)) {
        this.hideSuggestions();
      }
    }, 100);
  };

  /**
   * Maneja teclas en el input
   */
  handleKeydown = event => {
    const { key } = event;

    switch (key) {
      case 'ArrowDown':
        event.preventDefault();
        this.navigateSuggestions(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.navigateSuggestions(-1);
        break;
      case 'Enter':
        event.preventDefault();
        this.selectSuggestion();
        break;
      case 'Escape':
        this.hideSuggestions();
        this.elements.input.blur();
        break;
    }
  };

  /**
   * Maneja clicks en el dropdown
   */
  handleDropdownClick = event => {
    const suggestion = event.target.closest('.search-suggestion');
    const action = event.target.closest('[data-action]');

    if (suggestion) {
      const text = suggestion.dataset.text;
      this.selectSuggestionByText(text);
    }

    if (action) {
      const actionType = action.dataset.action;
      this.handleAction(actionType);
    }
  };

  /**
   * Maneja clicks en filtros rápidos
   */
  handleQuickFilterClick = event => {
    const filter = event.target.closest('.quick-filter');

    if (filter) {
      const filterType = filter.dataset.filter;
      const isActive = filter.classList.contains('active');

      this.toggleQuickFilter(filterType, !isActive);
    }
  };

  /**
   * Maneja clicks en acciones
   */
  handleActionClick = event => {
    const action = event.target.closest('[data-action]');

    if (action) {
      const actionType = action.dataset.action;
      this.handleAction(actionType);
    }
  };

  /**
   * Maneja clicks fuera del componente
   */
  handleDocumentClick = event => {
    if (!this.container.contains(event.target)) {
      this.hideSuggestions();
    }
  };

  /**
   * Maneja acciones
   */
  handleAction(actionType) {
    switch (actionType) {
      case 'search-all':
        this.performSearch(this.searchTerm);
        this.hideSuggestions();
        break;
      case 'clear-all':
        this.clearAll();
        break;
    }
  }

  /**
   * Realiza búsqueda
   */
  performSearch = searchTerm => {
    if (this.onSearch) {
      this.onSearch(searchTerm);
    }

    this.updateStats();
  };

  /**
   * Genera sugerencias
   */
  generateSuggestions(searchTerm) {
    if (!searchTerm || searchTerm.length < this.minSearchLength) {
      this.suggestions = [];
      return;
    }

    const term = searchTerm.toLowerCase();
    const suggestions = new Set();

    // Buscar en nombres de productos
    this.products.forEach(product => {
      const name = product.name.toLowerCase();

      if (name.includes(term)) {
        suggestions.add({
          type: 'product',
          text: product.name,
          category: product.category,
          icon: 'icon-package',
        });
      }
    });

    // Buscar en categorías
    const categories = [...new Set(this.products.map(p => p.category))];
    categories.forEach(category => {
      if (category.toLowerCase().includes(term)) {
        suggestions.add({
          type: 'category',
          text: category,
          icon: 'icon-category',
        });
      }
    });

    // Buscar en descripciones
    this.products.forEach(product => {
      if (
        product.description &&
        product.description.toLowerCase().includes(term)
      ) {
        suggestions.add({
          type: 'description',
          text: product.name,
          description: product.description,
          icon: 'icon-info',
        });
      }
    });

    this.suggestions = Array.from(suggestions).slice(0, this.maxSuggestions);
    this.renderSuggestions();
    this.showSuggestions();
  }

  /**
   * Renderiza sugerencias
   */
  renderSuggestions() {
    if (this.suggestions.length === 0) {
      this.elements.suggestions.innerHTML = `
                <div class="no-suggestions">
                    <i class="icon-search"></i>
                    <span>No se encontraron sugerencias</span>
                </div>
            `;
      return;
    }

    this.elements.suggestions.innerHTML = this.suggestions
      .map((suggestion, index) => {
        const isSelected = index === this.selectedIndex;

        return `
                <div class="search-suggestion ${isSelected ? 'selected' : ''}" 
                     data-text="${suggestion.text}"
                     data-type="${suggestion.type}">
                    <div class="suggestion-icon">
                        <i class="${suggestion.icon}"></i>
                    </div>
                    <div class="suggestion-content">
                        <div class="suggestion-text">${this.highlightText(
                          suggestion.text,
                          this.searchTerm
                        )}</div>
                        ${
                          suggestion.description
                            ? `
                            <div class="suggestion-description">${this.highlightText(
                              suggestion.description,
                              this.searchTerm
                            )}</div>
                        `
                            : ''
                        }
                        ${
                          suggestion.category
                            ? `
                            <div class="suggestion-category">${suggestion.category}</div>
                        `
                            : ''
                        }
                    </div>
                </div>
            `;
      })
      .join('');
  }

  /**
   * Resalta texto en sugerencias
   */
  highlightText(text, searchTerm) {
    if (!searchTerm) return text;

    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  /**
   * Navega por sugerencias
   */
  navigateSuggestions(direction) {
    const maxIndex = this.suggestions.length - 1;

    if (direction > 0) {
      this.selectedIndex =
        this.selectedIndex < maxIndex ? this.selectedIndex + 1 : 0;
    } else {
      this.selectedIndex =
        this.selectedIndex > 0 ? this.selectedIndex - 1 : maxIndex;
    }

    this.renderSuggestions();
    this.scrollToSelected();
  }

  /**
   * Selecciona sugerencia actual
   */
  selectSuggestion() {
    if (
      this.selectedIndex >= 0 &&
      this.selectedIndex < this.suggestions.length
    ) {
      const suggestion = this.suggestions[this.selectedIndex];
      this.selectSuggestionByText(suggestion.text);
    }
  }

  /**
   * Selecciona sugerencia por texto
   */
  selectSuggestionByText(text) {
    this.searchTerm = text;
    this.elements.input.value = text;
    this.hideSuggestions();
    this.performSearch(text);
  }

  /**
   * Desplaza a sugerencia seleccionada
   */
  scrollToSelected() {
    const selected = this.elements.suggestions.querySelector('.selected');

    if (selected) {
      selected.scrollIntoView({
        block: 'nearest',
        inline: 'nearest',
      });
    }
  }

  /**
   * Muestra sugerencias
   */
  showSuggestions() {
    this.isOpen = true;
    this.elements.dropdown.style.display = 'block';
    this.container.classList.add('search-active');
  }

  /**
   * Oculta sugerencias
   */
  hideSuggestions() {
    this.isOpen = false;
    this.selectedIndex = -1;
    this.elements.dropdown.style.display = 'none';
    this.container.classList.remove('search-active');
  }

  /**
   * Actualiza botón de limpiar
   */
  updateClearButton() {
    if (this.searchTerm.length > 0) {
      this.elements.clearBtn.style.display = 'block';
    } else {
      this.elements.clearBtn.style.display = 'none';
    }
  }

  /**
   * Genera filtros rápidos
   */
  generateQuickFilters() {
    if (this.products.length === 0) return;

    const categories = [...new Set(this.products.map(p => p.category))];
    const filters = [
      { type: 'status', label: 'Activos', value: 'active' },
      { type: 'status', label: 'Inactivos', value: 'inactive' },
      { type: 'stock', label: 'Stock bajo', value: 'low' },
      ...categories.map(cat => ({
        type: 'category',
        label: this.getCategoryLabel(cat),
        value: cat,
      })),
    ];

    this.elements.quickFilters.innerHTML = filters
      .map(
        filter => `
            <button class="quick-filter" 
                    data-filter="${filter.type}:${filter.value}"
                    title="Filtrar por ${filter.label}">
                ${filter.label}
            </button>
        `
      )
      .join('');
  }

  /**
   * Alterna filtro rápido
   */
  toggleQuickFilter(filterKey, isActive) {
    const filterElement = this.elements.quickFilters.querySelector(
      `[data-filter="${filterKey}"]`
    );

    if (isActive) {
      filterElement.classList.add('active');
      this.quickFilters.add(filterKey);
    } else {
      filterElement.classList.remove('active');
      this.quickFilters.delete(filterKey);
    }

    this.applyQuickFilters();
  }

  /**
   * Aplica filtros rápidos
   */
  applyQuickFilters() {
    const filters = Array.from(this.quickFilters).reduce((acc, filter) => {
      const [type, value] = filter.split(':');
      acc[type] = value;
      return acc;
    }, {});

    if (this.onFilterChange) {
      this.onFilterChange(filters);
    }

    this.updateStats();
  }

  /**
   * Actualiza estadísticas
   */
  updateStats() {
    // Esta función sería implementada por el componente padre
    // Para mostrar número de resultados
    this.elements.stats.style.display = 'block';
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
   * Establece productos
   */
  setProducts(products) {
    this.products = products;
    this.generateQuickFilters();
  }

  /**
   * Establece término de búsqueda
   */
  setSearchTerm(searchTerm) {
    this.searchTerm = searchTerm;
    this.elements.input.value = searchTerm;
    this.updateClearButton();

    if (searchTerm.length >= this.minSearchLength) {
      this.generateSuggestions(searchTerm);
    }
  }

  /**
   * Actualiza contador de resultados
   */
  updateResultsCount(count) {
    this.elements.resultsCount.textContent = `${count} resultado${
      count !== 1 ? 's' : ''
    }`;
  }

  /**
   * Limpia búsqueda
   */
  clearSearch = () => {
    this.searchTerm = '';
    this.elements.input.value = '';
    this.elements.input.focus();
    this.hideSuggestions();
    this.updateClearButton();
    this.performSearch('');
  };

  /**
   * Limpia todo
   */
  clearAll() {
    this.clearSearch();
    this.quickFilters.clear();

    // Limpiar filtros rápidos visuales
    this.elements.quickFilters
      .querySelectorAll('.quick-filter')
      .forEach(filter => {
        filter.classList.remove('active');
      });

    this.applyQuickFilters();
    this.elements.stats.style.display = 'none';
  }

  /**
   * Enfoca el input
   */
  focus() {
    this.elements.input.focus();
  }

  /**
   * Destruye el componente
   */
  destroy() {
    this.elements.input.removeEventListener('input', this.handleInput);
    this.elements.input.removeEventListener('focus', this.handleFocus);
    this.elements.input.removeEventListener('blur', this.handleBlur);
    this.elements.input.removeEventListener('keydown', this.handleKeydown);
    this.elements.dropdown.removeEventListener(
      'click',
      this.handleDropdownClick
    );
    this.elements.quickFilters.removeEventListener(
      'click',
      this.handleQuickFilterClick
    );
    this.elements.clearBtn.removeEventListener('click', this.clearSearch);
    document.removeEventListener('click', this.handleDocumentClick);

    this.container.innerHTML = '';
    this.quickFilters.clear();
    this.suggestions = [];
  }
}

/* 
📚 NOTAS PEDAGÓGICAS:

1. **Set para Filtros**: Uso de Set para manejar filtros únicos
2. **Debouncing**: Optimización de búsquedas en tiempo real
3. **Async/Await**: Para búsquedas asíncronas (futuras)
4. **Event Delegation**: Para manejar múltiples elementos
5. **Template Literals**: Para generar HTML dinámico
6. **Arrow Functions**: Para mantener contexto
7. **Destructuring**: En event handlers y parámetros
8. **Map/Filter/Reduce**: Para procesamiento de datos
9. **Keyboard Navigation**: Accesibilidad con teclado
10. **Highlighting**: Resaltado de texto en sugerencias

🎯 EJERCICIOS SUGERIDOS:
- Agregar búsqueda por voz
- Implementar historial de búsquedas
- Agregar filtros por rango de fechas
- Crear búsqueda avanzada con operadores
*/
