/**
 * COMPONENTE ProductForm - Formulario de Producto
 *
 * Formulario para crear y editar productos
 * con validación en tiempo real
 *
 * Características ES6+:
 * - Clases ES6 con métodos privados
 * - Map para manejar validaciones
 * - Destructuring en parámetros
 * - Template literals para HTML
 * - Arrow functions para eventos
 * - Spread operator para estado
 */

import { debounce } from '../utils/Helpers.js';
import { validateProduct } from '../utils/Validators.js';

export class ProductForm {
  constructor(container, { onSubmit, onCancel, product = null } = {}) {
    this.container = container;
    this.onSubmit = onSubmit;
    this.onCancel = onCancel;
    this.product = product;

    // Estado del formulario
    this.formData = {
      id: product?.id || null,
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price || '',
      category: product?.category || '',
      stock: product?.stock || 0,
      imageUrl: product?.imageUrl || '',
      status: product?.status || 'active',
    };

    // Mapa de validaciones
    this.validations = new Map();
    this.errors = new Map();

    // Referencias de elementos
    this.elements = new Map();

    // Configuración
    this.isEditing = !!product;
    this.isSubmitting = false;

    this.init();
  }

  /**
   * Inicializa el formulario
   */
  init() {
    this.render();
    this.bindEvents();
    this.setupValidations();

    // Auto-focus en el primer campo
    setTimeout(() => {
      this.elements.get('name')?.focus();
    }, 100);
  }

  /**
   * Renderiza el formulario
   */
  render() {
    const { name, description, price, category, stock, imageUrl, status } =
      this.formData;

    this.container.innerHTML = `
            <div class="product-form">
                <div class="form-header">
                    <h3 class="form-title">
                        ${this.isEditing ? 'Editar Producto' : 'Nuevo Producto'}
                    </h3>
                    <button class="btn btn-ghost btn-close" type="button" data-action="cancel">
                        <i class="icon-close"></i>
                    </button>
                </div>
                
                <form class="form" id="productForm" novalidate>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="name" class="form-label required">
                                Nombre del Producto
                            </label>
                            <input 
                                type="text" 
                                id="name" 
                                name="name" 
                                class="form-input" 
                                value="${name}"
                                placeholder="Ingresa el nombre del producto"
                                required
                                maxlength="100"
                            >
                            <div class="form-error" data-field="name"></div>
                        </div>
                        
                        <div class="form-group">
                            <label for="category" class="form-label required">
                                Categoría
                            </label>
                            <select id="category" name="category" class="form-select" required>
                                <option value="">Selecciona una categoría</option>
                                <option value="electronics" ${
                                  category === 'electronics' ? 'selected' : ''
                                }>
                                    Electrónicos
                                </option>
                                <option value="clothing" ${
                                  category === 'clothing' ? 'selected' : ''
                                }>
                                    Ropa
                                </option>
                                <option value="books" ${
                                  category === 'books' ? 'selected' : ''
                                }>
                                    Libros
                                </option>
                                <option value="home" ${
                                  category === 'home' ? 'selected' : ''
                                }>
                                    Hogar
                                </option>
                                <option value="sports" ${
                                  category === 'sports' ? 'selected' : ''
                                }>
                                    Deportes
                                </option>
                            </select>
                            <div class="form-error" data-field="category"></div>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="description" class="form-label">
                            Descripción
                        </label>
                        <textarea 
                            id="description" 
                            name="description" 
                            class="form-textarea" 
                            placeholder="Describe el producto..."
                            rows="4"
                            maxlength="500"
                        >${description}</textarea>
                        <div class="form-helper">
                            <span class="char-count" data-field="description">
                                ${description.length}/500
                            </span>
                        </div>
                        <div class="form-error" data-field="description"></div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="price" class="form-label required">
                                Precio
                            </label>
                            <div class="input-group">
                                <span class="input-prefix">$</span>
                                <input 
                                    type="number" 
                                    id="price" 
                                    name="price" 
                                    class="form-input" 
                                    value="${price}"
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                    required
                                >
                            </div>
                            <div class="form-error" data-field="price"></div>
                        </div>
                        
                        <div class="form-group">
                            <label for="stock" class="form-label required">
                                Stock
                            </label>
                            <input 
                                type="number" 
                                id="stock" 
                                name="stock" 
                                class="form-input" 
                                value="${stock}"
                                placeholder="0"
                                min="0"
                                required
                            >
                            <div class="form-error" data-field="stock"></div>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="imageUrl" class="form-label">
                            URL de Imagen
                        </label>
                        <input 
                            type="url" 
                            id="imageUrl" 
                            name="imageUrl" 
                            class="form-input" 
                            value="${imageUrl}"
                            placeholder="https://ejemplo.com/imagen.jpg"
                        >
                        <div class="form-error" data-field="imageUrl"></div>
                        ${
                          imageUrl
                            ? `
                            <div class="image-preview">
                                <img src="${imageUrl}" alt="Vista previa" onerror="this.style.display='none'">
                            </div>
                        `
                            : ''
                        }
                    </div>
                    
                    <div class="form-group">
                        <label for="status" class="form-label">
                            Estado
                        </label>
                        <div class="radio-group">
                            <label class="radio-label">
                                <input 
                                    type="radio" 
                                    name="status" 
                                    value="active" 
                                    ${status === 'active' ? 'checked' : ''}
                                >
                                <span class="radio-custom"></span>
                                Activo
                            </label>
                            <label class="radio-label">
                                <input 
                                    type="radio" 
                                    name="status" 
                                    value="inactive" 
                                    ${status === 'inactive' ? 'checked' : ''}
                                >
                                <span class="radio-custom"></span>
                                Inactivo
                            </label>
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" data-action="cancel">
                            Cancelar
                        </button>
                        <button type="submit" class="btn btn-primary" data-action="submit">
                            <span class="btn-text">
                                ${
                                  this.isEditing ? 'Actualizar' : 'Crear'
                                } Producto
                            </span>
                            <div class="btn-loading" style="display: none;">
                                <i class="icon-spinner"></i>
                                Guardando...
                            </div>
                        </button>
                    </div>
                </form>
            </div>
        `;

    this.cacheElements();
  }

  /**
   * Cachea referencias de elementos DOM
   */
  cacheElements() {
    const form = this.container.querySelector('#productForm');

    // Cachear elementos usando Map
    this.elements.set('form', form);
    this.elements.set('name', form.querySelector('#name'));
    this.elements.set('description', form.querySelector('#description'));
    this.elements.set('price', form.querySelector('#price'));
    this.elements.set('category', form.querySelector('#category'));
    this.elements.set('stock', form.querySelector('#stock'));
    this.elements.set('imageUrl', form.querySelector('#imageUrl'));
    this.elements.set('status', form.querySelectorAll('[name="status"]'));
    this.elements.set(
      'submitBtn',
      form.querySelector('[data-action="submit"]')
    );
    this.elements.set(
      'cancelBtn',
      form.querySelector('[data-action="cancel"]')
    );
  }

  /**
   * Vincula eventos del formulario
   */
  bindEvents() {
    const form = this.elements.get('form');

    // Evento submit del formulario
    form.addEventListener('submit', this.handleSubmit);

    // Evento input para validación en tiempo real
    form.addEventListener('input', this.handleInput);

    // Evento change para selects y radios
    form.addEventListener('change', this.handleChange);

    // Eventos de botones
    this.elements.get('cancelBtn').addEventListener('click', this.handleCancel);

    // Validación de imagen en tiempo real
    this.elements
      .get('imageUrl')
      .addEventListener('blur', this.validateImageUrl);

    // Contador de caracteres para descripción
    this.elements
      .get('description')
      .addEventListener('input', this.updateCharCount);
  }

  /**
   * Configura validaciones usando Map
   */
  setupValidations() {
    this.validations.set('name', {
      required: true,
      minLength: 3,
      maxLength: 100,
      pattern: /^[a-zA-Z0-9\s\-_.]+$/,
    });

    this.validations.set('category', {
      required: true,
    });

    this.validations.set('price', {
      required: true,
      min: 0,
      type: 'number',
    });

    this.validations.set('stock', {
      required: true,
      min: 0,
      type: 'number',
    });

    this.validations.set('imageUrl', {
      required: false,
      type: 'url',
    });

    this.validations.set('description', {
      required: false,
      maxLength: 500,
    });
  }

  /**
   * Maneja el envío del formulario
   */
  handleSubmit = async event => {
    event.preventDefault();

    if (this.isSubmitting) return;

    // Validar todos los campos
    const isValid = this.validateForm();

    if (!isValid) {
      this.showValidationErrors();
      return;
    }

    this.setSubmitting(true);

    try {
      const productData = this.getFormData();

      if (this.onSubmit) {
        await this.onSubmit(productData);
      }

      this.showSuccessMessage();
      this.reset();
    } catch (error) {
      this.showErrorMessage(error.message);
    } finally {
      this.setSubmitting(false);
    }
  };

  /**
   * Maneja cambios en inputs
   */
  handleInput = debounce(event => {
    const { name, value } = event.target;

    // Actualizar estado
    this.formData[name] = value;

    // Validar campo individual
    this.validateField(name, value);

    // Actualizar vista previa de imagen
    if (name === 'imageUrl') {
      this.updateImagePreview(value);
    }
  }, 300);

  /**
   * Maneja cambios en selects y radios
   */
  handleChange = event => {
    const { name, value } = event.target;

    // Actualizar estado
    this.formData[name] = value;

    // Validar campo
    this.validateField(name, value);
  };

  /**
   * Maneja cancelación del formulario
   */
  handleCancel = () => {
    if (this.hasUnsavedChanges()) {
      const confirmed = confirm(
        '¿Estás seguro de cancelar? Se perderán los cambios no guardados.'
      );

      if (!confirmed) return;
    }

    if (this.onCancel) {
      this.onCancel();
    }
  };

  /**
   * Valida una URL de imagen
   */
  validateImageUrl = event => {
    const url = event.target.value;

    if (!url) return;

    // Crear imagen temporal para validar
    const img = new Image();

    img.onload = () => {
      this.clearFieldError('imageUrl');
      this.updateImagePreview(url);
    };

    img.onerror = () => {
      this.setFieldError('imageUrl', 'La URL de imagen no es válida');
      this.updateImagePreview('');
    };

    img.src = url;
  };

  /**
   * Actualiza contador de caracteres
   */
  updateCharCount = event => {
    const { value } = event.target;
    const counter = this.container.querySelector('[data-field="description"]');

    if (counter) {
      counter.textContent = `${value.length}/500`;
    }
  };

  /**
   * Actualiza vista previa de imagen
   */
  updateImagePreview(url) {
    let preview = this.container.querySelector('.image-preview');

    if (!url) {
      preview?.remove();
      return;
    }

    if (!preview) {
      preview = document.createElement('div');
      preview.className = 'image-preview';
      this.elements.get('imageUrl').parentNode.appendChild(preview);
    }

    preview.innerHTML = `
            <img src="${url}" alt="Vista previa" onerror="this.style.display='none'">
        `;
  }

  /**
   * Valida todo el formulario
   */
  validateForm() {
    let isValid = true;

    // Limpiar errores anteriores
    this.errors.clear();

    // Validar cada campo
    for (const [fieldName, rules] of this.validations) {
      const value = this.formData[fieldName];
      const fieldValid = this.validateField(fieldName, value);

      if (!fieldValid) {
        isValid = false;
      }
    }

    return isValid;
  }

  /**
   * Valida un campo específico
   */
  validateField(fieldName, value) {
    const rules = this.validations.get(fieldName);

    if (!rules) return true;

    const errors = validateProduct({ [fieldName]: value }, rules);

    if (errors.length > 0) {
      this.setFieldError(fieldName, errors[0]);
      return false;
    }

    this.clearFieldError(fieldName);
    return true;
  }

  /**
   * Establece error en un campo
   */
  setFieldError(fieldName, message) {
    this.errors.set(fieldName, message);

    const errorElement = this.container.querySelector(
      `[data-field="${fieldName}"]`
    );
    const inputElement = this.elements.get(fieldName);

    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
    }

    if (inputElement) {
      inputElement.classList.add('error');
    }
  }

  /**
   * Limpia error de un campo
   */
  clearFieldError(fieldName) {
    this.errors.delete(fieldName);

    const errorElement = this.container.querySelector(
      `[data-field="${fieldName}"]`
    );
    const inputElement = this.elements.get(fieldName);

    if (errorElement) {
      errorElement.textContent = '';
      errorElement.style.display = 'none';
    }

    if (inputElement) {
      inputElement.classList.remove('error');
    }
  }

  /**
   * Muestra todos los errores de validación
   */
  showValidationErrors() {
    for (const [fieldName, message] of this.errors) {
      this.setFieldError(fieldName, message);
    }
  }

  /**
   * Obtiene datos del formulario
   */
  getFormData() {
    const data = { ...this.formData };

    // Convertir tipos
    data.price = parseFloat(data.price) || 0;
    data.stock = parseInt(data.stock) || 0;

    return data;
  }

  /**
   * Verifica si hay cambios sin guardar
   */
  hasUnsavedChanges() {
    if (!this.product)
      return Object.values(this.formData).some(
        value => value !== '' && value !== 0
      );

    const currentData = this.getFormData();

    return Object.keys(currentData).some(
      key => currentData[key] !== this.product[key]
    );
  }

  /**
   * Establece estado de envío
   */
  setSubmitting(isSubmitting) {
    this.isSubmitting = isSubmitting;

    const submitBtn = this.elements.get('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');

    if (isSubmitting) {
      submitBtn.disabled = true;
      btnText.style.display = 'none';
      btnLoading.style.display = 'flex';
    } else {
      submitBtn.disabled = false;
      btnText.style.display = 'block';
      btnLoading.style.display = 'none';
    }
  }

  /**
   * Muestra mensaje de éxito
   */
  showSuccessMessage() {
    // Implementar notificación de éxito
    console.log('Producto guardado exitosamente');
  }

  /**
   * Muestra mensaje de error
   */
  showErrorMessage(message) {
    // Implementar notificación de error
    console.error('Error al guardar producto:', message);
  }

  /**
   * Resetea el formulario
   */
  reset() {
    this.formData = {
      id: null,
      name: '',
      description: '',
      price: '',
      category: '',
      stock: 0,
      imageUrl: '',
      status: 'active',
    };

    this.errors.clear();
    this.render();
  }

  /**
   * Destruye el componente
   */
  destroy() {
    const form = this.elements.get('form');

    if (form) {
      form.removeEventListener('submit', this.handleSubmit);
      form.removeEventListener('input', this.handleInput);
      form.removeEventListener('change', this.handleChange);
    }

    this.elements.clear();
    this.validations.clear();
    this.errors.clear();
    this.container.innerHTML = '';
  }
}

/* 
📚 NOTAS PEDAGÓGICAS:

1. **Map para Estados**: Uso de Map para validaciones y errores
2. **Destructuring**: En parámetros de constructor y métodos
3. **Template Literals**: Para generar HTML complejo
4. **Arrow Functions**: Para mantener contexto en event handlers
5. **Spread Operator**: Para actualizar estado inmutablemente
6. **Debouncing**: Para optimizar validación en tiempo real
7. **Event Delegation**: Para manejar múltiples eventos
8. **Validación Asíncrona**: Para URLs de imágenes
9. **Estado Encapsulado**: Manejo de estado interno del componente
10. **Métodos Privados**: Usando arrow functions para binding

🎯 EJERCICIOS SUGERIDOS:
- Agregar validación de archivos locales
- Implementar autocompletado en categorías
- Agregar preview de producto en tiempo real
- Implementar guardado automático (draft)
*/
