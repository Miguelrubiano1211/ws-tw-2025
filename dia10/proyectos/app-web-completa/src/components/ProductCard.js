/**
 * COMPONENTE ProductCard - Tarjeta de Producto
 *
 * Muestra información de un producto en formato tarjeta
 * con acciones para editar y eliminar
 *
 * Características ES6+:
 * - Clases ES6
 * - Template literals
 * - Arrow functions
 * - Destructuring
 * - Spread operator
 */

import { formatDate, formatPrice } from '../utils/Helpers.js';

export class ProductCard {
  constructor(product, onEdit, onDelete) {
    this.product = product;
    this.onEdit = onEdit;
    this.onDelete = onDelete;
    this.element = null;

    this.render();
  }

  /**
   * Renderiza la tarjeta del producto
   */
  render() {
    const {
      id,
      name,
      description,
      price,
      category,
      stock,
      imageUrl,
      createdAt,
      status = 'active',
    } = this.product;

    this.element = document.createElement('div');
    this.element.className = `product-card ${status}`;
    this.element.dataset.productId = id;

    this.element.innerHTML = `
            <div class="product-card__image">
                <img src="${imageUrl || '/images/placeholder.jpg'}" 
                     alt="${name}" 
                     onerror="this.src='/images/placeholder.jpg'">
                <div class="product-card__status ${status}">
                    ${status === 'active' ? 'Activo' : 'Inactivo'}
                </div>
            </div>
            
            <div class="product-card__content">
                <div class="product-card__header">
                    <h3 class="product-card__title">${name}</h3>
                    <span class="product-card__category">${category}</span>
                </div>
                
                <p class="product-card__description">
                    ${description || 'Sin descripción disponible'}
                </p>
                
                <div class="product-card__details">
                    <div class="product-card__price">
                        ${formatPrice(price)}
                    </div>
                    <div class="product-card__stock ${
                      stock <= 5 ? 'low-stock' : ''
                    }">
                        Stock: ${stock}
                    </div>
                </div>
                
                <div class="product-card__meta">
                    <small class="product-card__date">
                        Creado: ${formatDate(createdAt)}
                    </small>
                </div>
            </div>
            
            <div class="product-card__actions">
                <button class="btn btn-primary btn-edit" 
                        data-action="edit"
                        title="Editar producto">
                    <i class="icon-edit"></i>
                    Editar
                </button>
                <button class="btn btn-danger btn-delete" 
                        data-action="delete"
                        title="Eliminar producto">
                    <i class="icon-delete"></i>
                    Eliminar
                </button>
            </div>
        `;

    this.bindEvents();
  }

  /**
   * Vincula eventos a los elementos de la tarjeta
   */
  bindEvents() {
    // Usar event delegation para manejar clicks
    this.element.addEventListener('click', this.handleClick);

    // Agregar efecto hover usando arrow functions
    this.element.addEventListener('mouseenter', () => {
      this.element.classList.add('hover');
    });

    this.element.addEventListener('mouseleave', () => {
      this.element.classList.remove('hover');
    });
  }

  /**
   * Maneja clicks en la tarjeta
   * Usa arrow function para mantener el contexto
   */
  handleClick = event => {
    const action = event.target.dataset.action;

    if (!action) return;

    event.preventDefault();
    event.stopPropagation();

    switch (action) {
      case 'edit':
        this.handleEdit();
        break;
      case 'delete':
        this.handleDelete();
        break;
    }
  };

  /**
   * Maneja la acción de editar
   */
  handleEdit() {
    if (this.onEdit) {
      this.onEdit(this.product);
    }
  }

  /**
   * Maneja la acción de eliminar
   */
  handleDelete() {
    if (this.onDelete) {
      const confirmed = confirm(
        `¿Estás seguro de eliminar "${this.product.name}"?`
      );

      if (confirmed) {
        this.onDelete(this.product.id);
      }
    }
  }

  /**
   * Actualiza la tarjeta con nueva información
   */
  updateProduct(newProduct) {
    this.product = { ...this.product, ...newProduct };
    this.render();
  }

  /**
   * Actualiza el estado del producto
   */
  updateStatus(newStatus) {
    this.product.status = newStatus;
    this.element.className = `product-card ${newStatus}`;

    const statusElement = this.element.querySelector('.product-card__status');
    statusElement.textContent = newStatus === 'active' ? 'Activo' : 'Inactivo';
    statusElement.className = `product-card__status ${newStatus}`;
  }

  /**
   * Actualiza el stock del producto
   */
  updateStock(newStock) {
    this.product.stock = newStock;

    const stockElement = this.element.querySelector('.product-card__stock');
    stockElement.textContent = `Stock: ${newStock}`;
    stockElement.className = `product-card__stock ${
      newStock <= 5 ? 'low-stock' : ''
    }`;
  }

  /**
   * Resalta la tarjeta (útil para búsquedas)
   */
  highlight(searchTerm = '') {
    this.element.classList.add('highlighted');

    if (searchTerm) {
      this.highlightText(searchTerm);
    }

    setTimeout(() => {
      this.element.classList.remove('highlighted');
    }, 2000);
  }

  /**
   * Resalta texto específico en la tarjeta
   */
  highlightText(searchTerm) {
    const textElements = this.element.querySelectorAll(
      '.product-card__title, .product-card__description'
    );

    textElements.forEach(element => {
      const text = element.textContent;
      const regex = new RegExp(`(${searchTerm})`, 'gi');

      if (regex.test(text)) {
        element.innerHTML = text.replace(regex, '<mark>$1</mark>');
      }
    });
  }

  /**
   * Muestra/oculta la tarjeta con animación
   */
  toggle(show = true) {
    if (show) {
      this.element.style.display = 'block';
      this.element.classList.add('fade-in');
    } else {
      this.element.classList.add('fade-out');

      setTimeout(() => {
        this.element.style.display = 'none';
        this.element.classList.remove('fade-out');
      }, 300);
    }
  }

  /**
   * Limpia eventos y referencias
   */
  destroy() {
    if (this.element) {
      this.element.removeEventListener('click', this.handleClick);
      this.element.remove();
    }

    this.element = null;
    this.product = null;
    this.onEdit = null;
    this.onDelete = null;
  }

  /**
   * Getter para el elemento DOM
   */
  get domElement() {
    return this.element;
  }
}

/* 
📚 NOTAS PEDAGÓGICAS:

1. **Clases ES6**: Uso de class syntax con constructor y métodos
2. **Template Literals**: Para generar HTML dinámico
3. **Arrow Functions**: Para mantener contexto en event handlers
4. **Destructuring**: Para extraer propiedades del producto
5. **Spread Operator**: Para actualizar objetos inmutablemente
6. **Event Delegation**: Para manejar múltiples eventos eficientemente
7. **Métodos Privados**: Uso de arrow functions para binding automático
8. **Encapsulación**: Métodos públicos y privados bien definidos

🎯 EJERCICIOS SUGERIDOS:
- Agregar más animaciones CSS
- Implementar drag & drop para reordenar
- Agregar lazy loading para imágenes
- Crear variantes de tarjeta (lista, grid, etc.)
*/
