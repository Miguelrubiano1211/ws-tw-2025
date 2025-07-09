/**
 * COMPONENTE Modal - Modal Reutilizable
 *
 * Componente modal flexible que puede mostrar diferentes tipos de contenido
 * con animaciones y gestión de foco para accesibilidad
 *
 * Características ES6+:
 * - Clases ES6 con métodos estáticos
 * - Promises para controlar flujo
 * - Destructuring en parámetros
 * - Template literals
 * - Arrow functions
 * - Map para almacenar referencias
 * - Event delegation
 */

export class Modal {
  constructor(options = {}) {
    this.options = {
      className: '',
      closable: true,
      backdrop: true,
      keyboard: true,
      focus: true,
      animation: true,
      size: 'medium', // small, medium, large, fullscreen
      ...options,
    };

    // Estado del modal
    this.isOpen = false;
    this.element = null;
    this.backdrop = null;
    this.content = null;
    this.previousFocus = null;

    // Callbacks
    this.onShow = null;
    this.onHide = null;
    this.onShown = null;
    this.onHidden = null;

    // Referencias para cleanup
    this.eventListeners = new Map();

    this.init();
  }

  /**
   * Inicializa el modal
   */
  init() {
    this.createModal();
    this.bindEvents();
  }

  /**
   * Crea la estructura del modal
   */
  createModal() {
    this.element = document.createElement('div');
    this.element.className = `modal ${this.options.className}`;
    this.element.setAttribute('role', 'dialog');
    this.element.setAttribute('aria-modal', 'true');
    this.element.setAttribute('tabindex', '-1');

    this.element.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-dialog ${this.options.size}">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title"></h4>
                        <button class="modal-close" aria-label="Cerrar">
                            <i class="icon-close"></i>
                        </button>
                    </div>
                    <div class="modal-body"></div>
                    <div class="modal-footer"></div>
                </div>
            </div>
        `;

    // Cachear referencias
    this.backdrop = this.element.querySelector('.modal-backdrop');
    this.content = this.element.querySelector('.modal-content');
    this.header = this.element.querySelector('.modal-header');
    this.title = this.element.querySelector('.modal-title');
    this.body = this.element.querySelector('.modal-body');
    this.footer = this.element.querySelector('.modal-footer');
    this.closeBtn = this.element.querySelector('.modal-close');

    // Ocultar por defecto
    this.element.style.display = 'none';

    // Agregar al DOM
    document.body.appendChild(this.element);
  }

  /**
   * Vincula eventos del modal
   */
  bindEvents() {
    // Cerrar con botón X
    this.closeBtn.addEventListener('click', () => this.hide());

    // Cerrar con backdrop
    if (this.options.backdrop) {
      this.backdrop.addEventListener('click', () => this.hide());
    }

    // Cerrar con ESC
    if (this.options.keyboard) {
      const escapeHandler = event => {
        if (event.key === 'Escape' && this.isOpen) {
          this.hide();
        }
      };

      document.addEventListener('keydown', escapeHandler);
      this.eventListeners.set('escape', escapeHandler);
    }

    // Gestión de foco
    if (this.options.focus) {
      this.element.addEventListener('keydown', this.handleFocusTrap);
    }

    // Prevenir scroll del body
    const preventScroll = event => {
      if (this.isOpen && !this.element.contains(event.target)) {
        event.preventDefault();
      }
    };

    document.addEventListener('touchmove', preventScroll, { passive: false });
    this.eventListeners.set('preventScroll', preventScroll);
  }

  /**
   * Muestra el modal
   */
  show(config = {}) {
    return new Promise((resolve, reject) => {
      if (this.isOpen) {
        reject(new Error('Modal ya está abierto'));
        return;
      }

      // Configurar contenido
      this.setContent(config);

      // Callbacks
      this.onShow = config.onShow;
      this.onHide = config.onHide;
      this.onShown = config.onShown;
      this.onHidden = config.onHidden;

      // Guardar foco anterior
      this.previousFocus = document.activeElement;

      // Mostrar modal
      this.element.style.display = 'flex';
      document.body.classList.add('modal-open');

      // Callback onShow
      if (this.onShow) {
        this.onShow();
      }

      // Animación
      if (this.options.animation) {
        this.element.classList.add('fade-in');

        setTimeout(() => {
          this.element.classList.remove('fade-in');
          this.isOpen = true;

          // Enfocar modal
          if (this.options.focus) {
            this.focusModal();
          }

          // Callback onShown
          if (this.onShown) {
            this.onShown();
          }

          resolve();
        }, 150);
      } else {
        this.isOpen = true;

        if (this.options.focus) {
          this.focusModal();
        }

        if (this.onShown) {
          this.onShown();
        }

        resolve();
      }
    });
  }

  /**
   * Oculta el modal
   */
  hide() {
    return new Promise(resolve => {
      if (!this.isOpen) {
        resolve();
        return;
      }

      // Callback onHide
      if (this.onHide) {
        this.onHide();
      }

      // Animación
      if (this.options.animation) {
        this.element.classList.add('fade-out');

        setTimeout(() => {
          this.hideModal();
          resolve();
        }, 150);
      } else {
        this.hideModal();
        resolve();
      }
    });
  }

  /**
   * Oculta el modal (función auxiliar)
   */
  hideModal() {
    this.element.style.display = 'none';
    this.element.classList.remove('fade-out');
    document.body.classList.remove('modal-open');
    this.isOpen = false;

    // Restaurar foco
    if (this.previousFocus && this.options.focus) {
      this.previousFocus.focus();
    }

    // Callback onHidden
    if (this.onHidden) {
      this.onHidden();
    }
  }

  /**
   * Establece el contenido del modal
   */
  setContent({ title, body, footer, actions = [] }) {
    // Título
    if (title) {
      this.title.textContent = title;
      this.header.style.display = 'flex';
    } else {
      this.header.style.display = 'none';
    }

    // Cuerpo
    if (body) {
      if (typeof body === 'string') {
        this.body.innerHTML = body;
      } else if (body instanceof HTMLElement) {
        this.body.innerHTML = '';
        this.body.appendChild(body);
      } else if (body instanceof DocumentFragment) {
        this.body.innerHTML = '';
        this.body.appendChild(body);
      }
    }

    // Footer
    if (footer) {
      this.footer.innerHTML = footer;
      this.footer.style.display = 'flex';
    } else if (actions.length > 0) {
      this.footer.innerHTML = this.generateActions(actions);
      this.footer.style.display = 'flex';
    } else {
      this.footer.style.display = 'none';
    }
  }

  /**
   * Genera botones de acción
   */
  generateActions(actions) {
    return actions
      .map(action => {
        const {
          label,
          className = 'btn-secondary',
          onClick,
          disabled = false,
          ...attrs
        } = action;

        const attrsString = Object.entries(attrs)
          .map(([key, value]) => `${key}="${value}"`)
          .join(' ');

        return `
                <button class="btn ${className}" 
                        ${disabled ? 'disabled' : ''} 
                        ${attrsString}
                        data-action="${action.action || 'custom'}">
                    ${label}
                </button>
            `;
      })
      .join('');
  }

  /**
   * Maneja trap de foco
   */
  handleFocusTrap = event => {
    if (event.key !== 'Tab') return;

    const focusableElements = this.getFocusableElements();
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  };

  /**
   * Obtiene elementos enfocables
   */
  getFocusableElements() {
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'textarea:not([disabled])',
      'select:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
    ];

    return Array.from(
      this.element.querySelectorAll(focusableSelectors.join(', '))
    );
  }

  /**
   * Enfoca el modal
   */
  focusModal() {
    const focusableElements = this.getFocusableElements();

    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    } else {
      this.element.focus();
    }
  }

  /**
   * Métodos estáticos para mostrar modales comunes
   */
  static alert(message, title = 'Aviso') {
    const modal = new Modal();

    return modal.show({
      title,
      body: `<p>${message}</p>`,
      actions: [
        {
          label: 'Aceptar',
          className: 'btn-primary',
          action: 'accept',
        },
      ],
    });
  }

  static confirm(message, title = 'Confirmación') {
    return new Promise(resolve => {
      const modal = new Modal();

      const handleAction = event => {
        const action = event.target.dataset.action;

        if (action === 'accept') {
          resolve(true);
        } else if (action === 'cancel') {
          resolve(false);
        }

        modal.hide();
      };

      modal.show({
        title,
        body: `<p>${message}</p>`,
        actions: [
          {
            label: 'Cancelar',
            className: 'btn-secondary',
            action: 'cancel',
          },
          {
            label: 'Aceptar',
            className: 'btn-primary',
            action: 'accept',
          },
        ],
        onShown: () => {
          modal.footer.addEventListener('click', handleAction);
        },
      });
    });
  }

  static prompt(message, defaultValue = '', title = 'Entrada') {
    return new Promise(resolve => {
      const modal = new Modal();

      const inputId = `prompt-input-${Date.now()}`;
      const bodyHTML = `
                <div class="prompt-content">
                    <p>${message}</p>
                    <input type="text" 
                           id="${inputId}" 
                           class="form-input" 
                           value="${defaultValue}"
                           placeholder="Ingresa tu respuesta...">
                </div>
            `;

      const handleAction = event => {
        const action = event.target.dataset.action;
        const input = modal.element.querySelector(`#${inputId}`);

        if (action === 'accept') {
          resolve(input.value);
        } else if (action === 'cancel') {
          resolve(null);
        }

        modal.hide();
      };

      modal.show({
        title,
        body: bodyHTML,
        actions: [
          {
            label: 'Cancelar',
            className: 'btn-secondary',
            action: 'cancel',
          },
          {
            label: 'Aceptar',
            className: 'btn-primary',
            action: 'accept',
          },
        ],
        onShown: () => {
          const input = modal.element.querySelector(`#${inputId}`);
          input.focus();
          input.select();

          // Enter para aceptar
          input.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
              resolve(input.value);
              modal.hide();
            }
          });

          modal.footer.addEventListener('click', handleAction);
        },
      });
    });
  }

  static loading(message = 'Cargando...') {
    const modal = new Modal({
      closable: false,
      backdrop: false,
      keyboard: false,
    });

    const loadingHTML = `
            <div class="loading-content">
                <div class="spinner"></div>
                <p>${message}</p>
            </div>
        `;

    modal.show({
      body: loadingHTML,
    });

    return modal;
  }

  /**
   * Actualiza el contenido del modal
   */
  updateContent(newContent) {
    this.setContent(newContent);
  }

  /**
   * Actualiza el título
   */
  updateTitle(newTitle) {
    this.title.textContent = newTitle;
  }

  /**
   * Actualiza el cuerpo
   */
  updateBody(newBody) {
    if (typeof newBody === 'string') {
      this.body.innerHTML = newBody;
    } else if (newBody instanceof HTMLElement) {
      this.body.innerHTML = '';
      this.body.appendChild(newBody);
    }
  }

  /**
   * Actualiza el footer
   */
  updateFooter(newFooter) {
    if (typeof newFooter === 'string') {
      this.footer.innerHTML = newFooter;
    } else if (Array.isArray(newFooter)) {
      this.footer.innerHTML = this.generateActions(newFooter);
    }
  }

  /**
   * Cambia el tamaño del modal
   */
  setSize(size) {
    const dialog = this.element.querySelector('.modal-dialog');
    dialog.className = `modal-dialog ${size}`;
    this.options.size = size;
  }

  /**
   * Habilita/deshabilita el cierre
   */
  setClosable(closable) {
    this.options.closable = closable;

    if (closable) {
      this.closeBtn.style.display = 'block';
    } else {
      this.closeBtn.style.display = 'none';
    }
  }

  /**
   * Toggle del modal
   */
  toggle(config = {}) {
    return this.isOpen ? this.hide() : this.show(config);
  }

  /**
   * Verifica si el modal está abierto
   */
  get isVisible() {
    return this.isOpen;
  }

  /**
   * Destruye el modal
   */
  destroy() {
    // Ocultar si está abierto
    if (this.isOpen) {
      this.hide();
    }

    // Limpiar event listeners
    this.eventListeners.forEach((handler, event) => {
      if (event === 'escape') {
        document.removeEventListener('keydown', handler);
      } else if (event === 'preventScroll') {
        document.removeEventListener('touchmove', handler);
      }
    });

    // Limpiar referencias
    this.eventListeners.clear();

    // Remover del DOM
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }

    this.element = null;
    this.backdrop = null;
    this.content = null;
    this.previousFocus = null;
  }
}

/* 
📚 NOTAS PEDAGÓGICAS:

1. **Promises**: Para controlar flujo asíncrono de show/hide
2. **Static Methods**: Para crear modales comunes (alert, confirm, prompt)
3. **Event Delegation**: Para manejar eventos dinámicos
4. **Focus Management**: Para accesibilidad y UX
5. **Template Literals**: Para generar HTML dinámico
6. **Destructuring**: En parámetros y configuración
7. **Map**: Para almacenar referencias de eventos
8. **Arrow Functions**: Para mantener contexto
9. **Accessibility**: ARIA attributes y keyboard navigation
10. **Animations**: CSS transitions con JavaScript

🎯 EJERCICIOS SUGERIDOS:
- Agregar diferentes tipos de animación
- Implementar modal stack (múltiples modales)
- Agregar soporte para componentes React/Vue
- Crear modal responsive para móviles
*/
