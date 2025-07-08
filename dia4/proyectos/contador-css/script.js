/**
 * 🔢 CONTADOR CSS AVANZADO - JAVASCRIPT
 * Día 4: Validaciones y Seguridad Frontend
 *
 * Implementación de contador con validaciones robustas,
 * seguridad frontend y experiencia de usuario avanzada.
 */

class ContadorSeguroAvanzado {
  constructor() {
    // 🔧 Configuración inicial
    this.valor = 0;
    this.min = 0;
    this.max = 100;
    this.historia = [];
    this.tema = 'light';
    this.cambiosCount = 0;
    this.isInitialized = false;

    // 🛡️ Configuración de seguridad
    this.maxHistoryItems = 50;
    this.maxValue = 9999;
    this.minValue = -999;
    this.debounceTime = 300;

    // 🎯 Inicialización
    this.init();
  }

  /**
   * 🚀 Inicialización del contador
   */
  async init() {
    try {
      this.initElementos();
      this.initEventListeners();
      this.initKeyboardShortcuts();
      await this.cargarEstado();
      this.actualizarUI();
      this.isInitialized = true;

      this.mostrarNotificacion('Contador inicializado', 'success', '✅');
    } catch (error) {
      console.error('Error inicializando contador:', error);
      this.mostrarNotificacion('Error al inicializar', 'error', '❌');
    }
  }

  /**
   * 🎯 Inicializar elementos DOM
   */
  initElementos() {
    // Elementos principales
    this.displayElement = document.querySelector('.display-value');
    this.btnIncrement = document.querySelector('.btn-increment');
    this.btnDecrement = document.querySelector('.btn-decrement');
    this.btnReset = document.querySelector('.btn-reset');
    this.btnTheme = document.querySelector('.btn-theme');
    this.btnSave = document.querySelector('.btn-save');

    // Elementos de configuración
    this.inputMin = document.getElementById('min-value');
    this.inputMax = document.getElementById('max-value');

    // Elementos de historial
    this.historyList = document.querySelector('.history-list');
    this.btnClearHistory = document.querySelector('.btn-clear-history');
    this.btnExportHistory = document.querySelector('.btn-export-history');

    // Elementos de estadísticas
    this.currentValueStat = document.getElementById('current-value');
    this.rangeValueStat = document.getElementById('range-value');
    this.changesCountStat = document.getElementById('changes-count');

    // Contenedor de notificaciones
    this.notificationsContainer = document.getElementById(
      'notifications-container'
    );

    // Validar que todos los elementos existan
    this.validateElements();
  }

  /**
   * ✅ Validar que todos los elementos DOM existan
   */
  validateElements() {
    const requiredElements = [
      'displayElement',
      'btnIncrement',
      'btnDecrement',
      'btnReset',
      'btnTheme',
      'btnSave',
      'inputMin',
      'inputMax',
      'historyList',
    ];

    for (const element of requiredElements) {
      if (!this[element]) {
        throw new Error(`Elemento requerido no encontrado: ${element}`);
      }
    }
  }

  /**
   * 🎧 Inicializar event listeners
   */
  initEventListeners() {
    // Botones principales
    this.btnIncrement.addEventListener('click', () => this.incrementar());
    this.btnDecrement.addEventListener('click', () => this.decrementar());
    this.btnReset.addEventListener('click', () => this.reset());
    this.btnTheme.addEventListener('click', () => this.cambiarTema());
    this.btnSave.addEventListener('click', () => this.guardarEstado());

    // Botones de historial
    this.btnClearHistory?.addEventListener('click', () =>
      this.limpiarHistorial()
    );
    this.btnExportHistory?.addEventListener('click', () =>
      this.exportarHistorial()
    );

    // Inputs de configuración con debounce
    this.inputMin.addEventListener(
      'input',
      this.debounce(e => {
        this.validarYActualizarLimite('min', e.target.value);
      }, this.debounceTime)
    );

    this.inputMax.addEventListener(
      'input',
      this.debounce(e => {
        this.validarYActualizarLimite('max', e.target.value);
      }, this.debounceTime)
    );

    // Validación en tiempo real
    this.inputMin.addEventListener('blur', e => {
      this.validarEntrada(e.target, 'min');
    });

    this.inputMax.addEventListener('blur', e => {
      this.validarEntrada(e.target, 'max');
    });

    // Prevenir envío de formulario
    document.addEventListener('keydown', e => {
      if (
        e.key === 'Enter' &&
        (e.target === this.inputMin || e.target === this.inputMax)
      ) {
        e.preventDefault();
        e.target.blur();
      }
    });
  }

  /**
   * ⌨️ Configurar atajos de teclado
   */
  initKeyboardShortcuts() {
    document.addEventListener('keydown', e => {
      // Solo procesar si no estamos en un input
      if (e.target.tagName === 'INPUT') return;

      switch (e.key.toLowerCase()) {
        case 'arrowup':
          e.preventDefault();
          this.incrementar();
          break;
        case 'arrowdown':
          e.preventDefault();
          this.decrementar();
          break;
        case 'r':
          e.preventDefault();
          this.reset();
          break;
        case 't':
          e.preventDefault();
          this.cambiarTema();
          break;
        case 's':
          e.preventDefault();
          this.guardarEstado();
          break;
      }
    });
  }

  /**
   * 🛡️ Validar y actualizar límites
   */
  validarYActualizarLimite(tipo, valor) {
    const numeroLimpio = this.sanitizarNumero(valor);

    if (numeroLimpio === null) {
      this.mostrarError(
        tipo === 'min' ? this.inputMin : this.inputMax,
        'Debe ser un número válido'
      );
      return;
    }

    if (numeroLimpio < this.minValue || numeroLimpio > this.maxValue) {
      this.mostrarError(
        tipo === 'min' ? this.inputMin : this.inputMax,
        `Debe estar entre ${this.minValue} y ${this.maxValue}`
      );
      return;
    }

    if (tipo === 'min') {
      if (numeroLimpio >= this.max) {
        this.mostrarError(this.inputMin, 'Debe ser menor que el máximo');
        return;
      }
      this.min = numeroLimpio;
    } else {
      if (numeroLimpio <= this.min) {
        this.mostrarError(this.inputMax, 'Debe ser mayor que el mínimo');
        return;
      }
      this.max = numeroLimpio;
    }

    this.limpiarError(tipo === 'min' ? this.inputMin : this.inputMax);
    this.ajustarValorAlRango();
    this.actualizarUI();
  }

  /**
   * 🔄 Validar entrada de usuario
   */
  validarEntrada(input, tipo) {
    const valor = input.value.trim();

    if (valor === '') {
      this.mostrarError(input, 'Este campo es requerido');
      return false;
    }

    const numero = this.sanitizarNumero(valor);

    if (numero === null) {
      this.mostrarError(input, 'Debe ser un número válido');
      return false;
    }

    if (numero < this.minValue || numero > this.maxValue) {
      this.mostrarError(
        input,
        `Debe estar entre ${this.minValue} y ${this.maxValue}`
      );
      return false;
    }

    if (tipo === 'min' && numero >= this.max) {
      this.mostrarError(input, 'Debe ser menor que el máximo');
      return false;
    }

    if (tipo === 'max' && numero <= this.min) {
      this.mostrarError(input, 'Debe ser mayor que el mínimo');
      return false;
    }

    this.limpiarError(input);
    return true;
  }

  /**
   * 🧹 Sanitizar entrada numérica
   */
  sanitizarNumero(valor) {
    // Remover todos los caracteres no numéricos excepto signo negativo
    const limpio = String(valor).replace(/[^-0-9]/g, '');

    // Asegurar que el signo negativo solo esté al inicio
    const conSigno = limpio
      .replace(/-/g, '')
      .replace(/^/, limpio.charAt(0) === '-' ? '-' : '');

    const numero = parseInt(conSigno);
    return isNaN(numero) ? null : numero;
  }

  /**
   * 📈 Incrementar contador
   */
  incrementar() {
    if (!this.isInitialized) return;

    if (this.valor < this.max) {
      this.valor++;
      this.cambiosCount++;
      this.agregarHistoria('incremento', this.valor);
      this.actualizarUI();
      this.animarCambio();
      this.reproducirSonido('increment');
    } else {
      this.mostrarNotificacion('Valor máximo alcanzado', 'warning', '⚠️');
      this.animarLimite();
    }
  }

  /**
   * 📉 Decrementar contador
   */
  decrementar() {
    if (!this.isInitialized) return;

    if (this.valor > this.min) {
      this.valor--;
      this.cambiosCount++;
      this.agregarHistoria('decremento', this.valor);
      this.actualizarUI();
      this.animarCambio();
      this.reproducirSonido('decrement');
    } else {
      this.mostrarNotificacion('Valor mínimo alcanzado', 'warning', '⚠️');
      this.animarLimite();
    }
  }

  /**
   * 🔄 Reiniciar contador
   */
  reset() {
    if (!this.isInitialized) return;

    const valorAnterior = this.valor;
    this.valor = Math.floor((this.min + this.max) / 2);
    this.cambiosCount++;
    this.agregarHistoria('reset', this.valor, valorAnterior);
    this.actualizarUI();
    this.animarCambio();
    this.reproducirSonido('reset');
    this.mostrarNotificacion('Contador reiniciado', 'success', '🔄');
  }

  /**
   * 🎨 Cambiar tema
   */
  cambiarTema() {
    this.tema = this.tema === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', this.tema);

    // Actualizar icono del botón
    const icon = this.btnTheme.querySelector('.btn-icon');
    if (icon) {
      icon.textContent = this.tema === 'light' ? '🌙' : '☀️';
    }

    this.mostrarNotificacion(`Tema ${this.tema} activado`, 'info', '🎨');
    this.reproducirSonido('theme');
  }

  /**
   * 🔧 Ajustar valor al rango permitido
   */
  ajustarValorAlRango() {
    const valorAnterior = this.valor;

    if (this.valor < this.min) {
      this.valor = this.min;
    } else if (this.valor > this.max) {
      this.valor = this.max;
    }

    if (valorAnterior !== this.valor) {
      this.agregarHistoria('ajuste', this.valor, valorAnterior);
      this.mostrarNotificacion('Valor ajustado al rango', 'info', 'ℹ️');
    }
  }

  /**
   * 🎯 Actualizar toda la interfaz
   */
  actualizarUI() {
    this.actualizarDisplay();
    this.actualizarBotones();
    this.actualizarEstadisticas();
    this.actualizarHistorial();
  }

  /**
   * 📺 Actualizar display principal
   */
  actualizarDisplay() {
    if (!this.displayElement) return;

    // Formatear número con ceros a la izquierda
    const valorFormateado = this.valor.toString().padStart(4, '0');
    this.displayElement.textContent = valorFormateado;

    // Actualizar clases según estado
    this.displayElement.classList.remove('at-min', 'at-max', 'normal');

    if (this.valor <= this.min) {
      this.displayElement.classList.add('at-min');
    } else if (this.valor >= this.max) {
      this.displayElement.classList.add('at-max');
    } else {
      this.displayElement.classList.add('normal');
    }
  }

  /**
   * 🔘 Actualizar estado de botones
   */
  actualizarBotones() {
    if (this.btnIncrement) {
      this.btnIncrement.disabled = this.valor >= this.max;
    }

    if (this.btnDecrement) {
      this.btnDecrement.disabled = this.valor <= this.min;
    }
  }

  /**
   * 📊 Actualizar estadísticas
   */
  actualizarEstadisticas() {
    if (this.currentValueStat) {
      this.currentValueStat.textContent = this.valor;
    }

    if (this.rangeValueStat) {
      this.rangeValueStat.textContent = `${this.min} - ${this.max}`;
    }

    if (this.changesCountStat) {
      this.changesCountStat.textContent = this.cambiosCount;
    }
  }

  /**
   * 🎬 Animación de cambio
   */
  animarCambio() {
    if (!this.displayElement) return;

    this.displayElement.classList.add('updating');
    setTimeout(() => {
      this.displayElement.classList.remove('updating');
    }, 300);
  }

  /**
   * ⚡ Animación de límite alcanzado
   */
  animarLimite() {
    if (!this.displayElement) return;

    this.displayElement.classList.add('pulse');
    setTimeout(() => {
      this.displayElement.classList.remove('pulse');
    }, 600);
  }

  /**
   * 📝 Agregar entrada al historial
   */
  agregarHistoria(accion, valor, valorAnterior = null) {
    const entrada = {
      id: Date.now(),
      accion,
      valor,
      valorAnterior,
      timestamp: new Date().toLocaleTimeString('es-ES'),
      fecha: new Date().toLocaleDateString('es-ES'),
    };

    this.historia.unshift(entrada);

    // Limitar tamaño del historial
    if (this.historia.length > this.maxHistoryItems) {
      this.historia = this.historia.slice(0, this.maxHistoryItems);
    }
  }

  /**
   * 📜 Actualizar display del historial
   */
  actualizarHistorial() {
    if (!this.historyList) return;

    this.historyList.innerHTML = '';

    if (this.historia.length === 0) {
      const emptyMessage = document.createElement('div');
      emptyMessage.className = 'history-empty';
      emptyMessage.textContent = 'No hay cambios en el historial';
      emptyMessage.style.textAlign = 'center';
      emptyMessage.style.color = 'var(--text-secondary)';
      emptyMessage.style.padding = 'var(--spacing-md)';
      this.historyList.appendChild(emptyMessage);
      return;
    }

    this.historia.forEach(entrada => {
      const item = document.createElement('div');
      item.className = 'history-item';
      item.innerHTML = `
                <span class="history-action">${this.getActionIcon(
                  entrada.accion
                )} ${entrada.accion}</span>
                <span class="history-value">${entrada.valor}</span>
                <span class="history-time">${entrada.timestamp}</span>
            `;
      this.historyList.appendChild(item);
    });
  }

  /**
   * 🎭 Obtener icono para acción
   */
  getActionIcon(accion) {
    const iconos = {
      incremento: '⬆️',
      decremento: '⬇️',
      reset: '🔄',
      ajuste: '⚖️',
      carga: '📥',
    };
    return iconos[accion] || '📝';
  }

  /**
   * 🗑️ Limpiar historial
   */
  limpiarHistorial() {
    if (this.historia.length === 0) {
      this.mostrarNotificacion('El historial ya está vacío', 'info', 'ℹ️');
      return;
    }

    if (confirm('¿Estás seguro de que quieres limpiar el historial?')) {
      this.historia = [];
      this.actualizarHistorial();
      this.mostrarNotificacion('Historial limpiado', 'success', '🗑️');
    }
  }

  /**
   * 📤 Exportar historial
   */
  exportarHistorial() {
    if (this.historia.length === 0) {
      this.mostrarNotificacion(
        'No hay historial para exportar',
        'warning',
        '⚠️'
      );
      return;
    }

    try {
      const datos = {
        exportDate: new Date().toISOString(),
        contador: {
          valor: this.valor,
          min: this.min,
          max: this.max,
          cambiosCount: this.cambiosCount,
        },
        historial: this.historia,
      };

      const blob = new Blob([JSON.stringify(datos, null, 2)], {
        type: 'application/json',
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `contador-historial-${
        new Date().toISOString().split('T')[0]
      }.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      this.mostrarNotificacion('Historial exportado', 'success', '📤');
    } catch (error) {
      console.error('Error exportando historial:', error);
      this.mostrarNotificacion('Error al exportar', 'error', '❌');
    }
  }

  /**
   * 💾 Guardar estado
   */
  guardarEstado() {
    try {
      const estado = {
        valor: this.valor,
        min: this.min,
        max: this.max,
        tema: this.tema,
        cambiosCount: this.cambiosCount,
        historia: this.historia,
        timestamp: new Date().toISOString(),
      };

      localStorage.setItem('contador-estado-avanzado', JSON.stringify(estado));
      this.mostrarNotificacion('Estado guardado', 'success', '💾');
    } catch (error) {
      console.error('Error guardando estado:', error);
      this.mostrarNotificacion('Error al guardar', 'error', '❌');
    }
  }

  /**
   * 📥 Cargar estado
   */
  async cargarEstado() {
    try {
      const estadoGuardado = localStorage.getItem('contador-estado-avanzado');
      if (estadoGuardado) {
        const estado = JSON.parse(estadoGuardado);

        if (this.validarEstado(estado)) {
          this.valor = estado.valor;
          this.min = estado.min;
          this.max = estado.max;
          this.tema = estado.tema;
          this.cambiosCount = estado.cambiosCount || 0;
          this.historia = estado.historia || [];

          // Actualizar interfaz
          this.inputMin.value = this.min;
          this.inputMax.value = this.max;
          document.documentElement.setAttribute('data-theme', this.tema);

          // Actualizar icono del tema
          const icon = this.btnTheme.querySelector('.btn-icon');
          if (icon) {
            icon.textContent = this.tema === 'light' ? '🌙' : '☀️';
          }

          this.agregarHistoria('carga', this.valor);
          this.mostrarNotificacion('Estado cargado', 'success', '📥');
        }
      }
    } catch (error) {
      console.error('Error cargando estado:', error);
      this.mostrarNotificacion('Error al cargar estado', 'error', '❌');
    }
  }

  /**
   * ✅ Validar estado cargado
   */
  validarEstado(estado) {
    return (
      estado &&
      typeof estado.valor === 'number' &&
      typeof estado.min === 'number' &&
      typeof estado.max === 'number' &&
      estado.min < estado.max &&
      estado.valor >= estado.min &&
      estado.valor <= estado.max &&
      ['light', 'dark'].includes(estado.tema) &&
      Array.isArray(estado.historia || [])
    );
  }

  /**
   * 🔴 Mostrar error en input
   */
  mostrarError(input, mensaje) {
    input.classList.add('error');

    // Remover mensaje anterior
    const errorAnterior = input.parentNode.querySelector('.error-message');
    if (errorAnterior) {
      errorAnterior.remove();
    }

    // Agregar nuevo mensaje
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = mensaje;
    input.parentNode.appendChild(errorDiv);
  }

  /**
   * 🧹 Limpiar error de input
   */
  limpiarError(input) {
    input.classList.remove('error');
    const errorMessage = input.parentNode.querySelector('.error-message');
    if (errorMessage) {
      errorMessage.remove();
    }
  }

  /**
   * 🔔 Mostrar notificación
   */
  mostrarNotificacion(mensaje, tipo = 'info', icono = 'ℹ️') {
    const notificacion = document.createElement('div');
    notificacion.className = `notification ${tipo}`;
    notificacion.innerHTML = `
            <span class="notification-icon">${icono}</span>
            <span>${mensaje}</span>
        `;

    this.notificationsContainer.appendChild(notificacion);

    // Animar entrada
    setTimeout(() => {
      notificacion.classList.add('show');
    }, 100);

    // Remover después de 4 segundos
    setTimeout(() => {
      notificacion.classList.remove('show');
      setTimeout(() => {
        if (notificacion.parentNode) {
          notificacion.parentNode.removeChild(notificacion);
        }
      }, 300);
    }, 4000);
  }

  /**
   * 🔊 Reproducir sonido (simulado)
   */
  reproducirSonido(tipo) {
    // En una implementación real, aquí se reproducirían sonidos
    console.log(`🔊 Sonido: ${tipo}`);
  }

  /**
   * ⏱️ Utilidad de debounce
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// 🚀 Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  try {
    window.contador = new ContadorSeguroAvanzado();
    console.log('✅ Contador inicializado exitosamente');
  } catch (error) {
    console.error('❌ Error inicializando contador:', error);
  }
});

// 🔧 Exportar para uso externo
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ContadorSeguroAvanzado;
}
