/**
 * 🎯 Temporizador Avanzado - Día 8: JavaScript Avanzado II
 *
 * Aplicación completa que demuestra:
 * - Closures para encapsulación de estado
 * - Prototipos y herencia para diferentes tipos de temporizadores
 * - Asincronismo con setTimeout y callbacks
 * - Patrones de diseño avanzados (Module, Observer, Factory)
 *
 * @author Día 8 - JavaScript Avanzado II
 * @version 1.0.0
 */

// =====================================================
// 1. MÓDULO PRINCIPAL DE LA APLICACIÓN
// =====================================================

const TemporizadorApp = (function () {
  'use strict';

  // Variables privadas del módulo
  let temporizadores = new Map();
  let idContador = 1;
  let configuracionActual = null;
  let tipoActual = null;
  let estadisticas = {
    activos: 0,
    completados: 0,
    tiempoTotal: 0,
  };

  // Referencias del DOM
  const elementos = {
    modal: null,
    contenedorTemporizadores: null,
    contenedorNotificaciones: null,
    formularioConfig: null,
    estadisticas: {
      activos: null,
      completados: null,
      tiempoTotal: null,
    },
  };

  // =====================================================
  // 2. CLASE BASE DE TEMPORIZADOR CON PROTOTIPOS
  // =====================================================

  function TemporizadorBase(configuracion) {
    this.id = idContador++;
    this.titulo = configuracion.titulo || 'Temporizador';
    this.estado = 'detenido'; // detenido, corriendo, pausado, terminado
    this.tiempoInicial = 0;
    this.tiempoActual = 0;
    this.intervalo = null;
    this.callbacks = {
      onTick: null,
      onComplete: null,
      onStateChange: null,
    };
    this.configuracion = configuracion;
    this.elementoDOM = null;
    this.laps = [];
    this.tiempoInicio = null;
    this.tiempoPausado = 0;
  }

  // Métodos del prototipo base
  TemporizadorBase.prototype.iniciar = function () {
    if (this.estado === 'corriendo') return;

    this.estado = 'corriendo';
    this.tiempoInicio = Date.now() - this.tiempoPausado;

    this.intervalo = setInterval(() => {
      this.tick();
    }, 100);

    this.disparar('onStateChange', this.estado);
    NotificationManager.mostrar(
      'Temporizador iniciado',
      `${this.titulo} está corriendo`,
      'success'
    );
  };

  TemporizadorBase.prototype.pausar = function () {
    if (this.estado !== 'corriendo') return;

    this.estado = 'pausado';
    this.tiempoPausado = Date.now() - this.tiempoInicio;
    clearInterval(this.intervalo);
    this.intervalo = null;

    this.disparar('onStateChange', this.estado);
    NotificationManager.mostrar(
      'Temporizador pausado',
      `${this.titulo} está pausado`,
      'warning'
    );
  };

  TemporizadorBase.prototype.detener = function () {
    if (this.estado === 'detenido') return;

    this.estado = 'detenido';
    clearInterval(this.intervalo);
    this.intervalo = null;
    this.tiempoActual = this.tiempoInicial;
    this.tiempoPausado = 0;

    this.disparar('onStateChange', this.estado);
    NotificationManager.mostrar(
      'Temporizador detenido',
      `${this.titulo} se ha detenido`,
      'info'
    );
  };

  TemporizadorBase.prototype.reiniciar = function () {
    this.detener();
    this.tiempoActual = this.tiempoInicial;
    this.laps = [];
    this.actualizar();
  };

  TemporizadorBase.prototype.tick = function () {
    // Implementar en clases derivadas
  };

  TemporizadorBase.prototype.actualizar = function () {
    if (this.elementoDOM) {
      this.actualizarDOM();
    }
  };

  TemporizadorBase.prototype.formatearTiempo = function (milisegundos) {
    const totalSegundos = Math.floor(milisegundos / 1000);
    const horas = Math.floor(totalSegundos / 3600);
    const minutos = Math.floor((totalSegundos % 3600) / 60);
    const segundos = totalSegundos % 60;

    return `${horas.toString().padStart(2, '0')}:${minutos
      .toString()
      .padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
  };

  TemporizadorBase.prototype.disparar = function (evento, datos) {
    if (this.callbacks[evento]) {
      this.callbacks[evento](datos);
    }
  };

  TemporizadorBase.prototype.on = function (evento, callback) {
    this.callbacks[evento] = callback;
  };

  TemporizadorBase.prototype.destruir = function () {
    this.detener();
    if (this.elementoDOM) {
      this.elementoDOM.remove();
    }
  };

  // =====================================================
  // 3. TEMPORIZADOR COUNTDOWN CON HERENCIA
  // =====================================================

  function TemporizadorCountdown(configuracion) {
    TemporizadorBase.call(this, configuracion);

    const horas = configuracion.horas || 0;
    const minutos = configuracion.minutos || 5;
    const segundos = configuracion.segundos || 0;

    this.tiempoInicial = (horas * 3600 + minutos * 60 + segundos) * 1000;
    this.tiempoActual = this.tiempoInicial;
    this.tipo = 'countdown';
    this.sonidoFinal = configuracion.sonido || false;
    this.notificacion = configuracion.notificacion || false;
  }

  // Configurar herencia
  TemporizadorCountdown.prototype = Object.create(TemporizadorBase.prototype);
  TemporizadorCountdown.prototype.constructor = TemporizadorCountdown;

  // Sobrescribir método tick
  TemporizadorCountdown.prototype.tick = function () {
    const tiempoTranscurrido = Date.now() - this.tiempoInicio;
    this.tiempoActual = Math.max(0, this.tiempoInicial - tiempoTranscurrido);

    if (this.tiempoActual <= 0) {
      this.completar();
    } else {
      this.actualizar();
    }
  };

  TemporizadorCountdown.prototype.completar = function () {
    this.estado = 'terminado';
    this.tiempoActual = 0;
    clearInterval(this.intervalo);
    this.intervalo = null;

    // Actualizar estadísticas
    estadisticas.completados++;
    actualizarEstadisticas();

    // Notificaciones
    if (this.notificacion) {
      NotificationManager.mostrar(
        '¡Tiempo terminado!',
        `${this.titulo} ha terminado`,
        'success'
      );
    }

    if (this.sonidoFinal) {
      AudioManager.reproducir('countdown-complete');
    }

    this.disparar('onComplete', this);
    this.disparar('onStateChange', this.estado);
    this.actualizar();
  };

  TemporizadorCountdown.prototype.actualizarDOM = function () {
    const tiempoDisplay = this.elementoDOM.querySelector('.time-display');
    const progresoBar = this.elementoDOM.querySelector('.progress-bar');
    const estado = this.elementoDOM.querySelector('.timer-status');

    tiempoDisplay.textContent = this.formatearTiempo(this.tiempoActual);

    const progreso =
      this.tiempoInicial > 0
        ? ((this.tiempoInicial - this.tiempoActual) / this.tiempoInicial) * 100
        : 0;
    progresoBar.style.width = `${progreso}%`;

    // Actualizar estado visual
    this.elementoDOM.className = `timer-card ${this.estado}`;

    switch (this.estado) {
      case 'corriendo':
        estado.textContent = 'Corriendo...';
        break;
      case 'pausado':
        estado.textContent = 'Pausado';
        break;
      case 'terminado':
        estado.textContent = '¡Terminado!';
        break;
      default:
        estado.textContent = 'Detenido';
    }
  };

  // =====================================================
  // 4. TEMPORIZADOR STOPWATCH CON HERENCIA
  // =====================================================

  function TemporizadorStopwatch(configuracion) {
    TemporizadorBase.call(this, configuracion);

    this.tiempoInicial = 0;
    this.tiempoActual = 0;
    this.tipo = 'stopwatch';
    this.lapsHabilitados = configuracion.laps || false;
    this.autoGuardado = configuracion.autoSave || false;
  }

  // Configurar herencia
  TemporizadorStopwatch.prototype = Object.create(TemporizadorBase.prototype);
  TemporizadorStopwatch.prototype.constructor = TemporizadorStopwatch;

  // Sobrescribir método tick
  TemporizadorStopwatch.prototype.tick = function () {
    const tiempoTranscurrido = Date.now() - this.tiempoInicio;
    this.tiempoActual = tiempoTranscurrido;
    this.actualizar();
  };

  TemporizadorStopwatch.prototype.agregarLap = function () {
    if (!this.lapsHabilitados || this.estado !== 'corriendo') return;

    const lap = {
      numero: this.laps.length + 1,
      tiempo: this.tiempoActual,
      timestamp: Date.now(),
    };

    this.laps.push(lap);
    this.actualizarLapsDOM();

    NotificationManager.mostrar(
      'Lap registrado',
      `Lap ${lap.numero}: ${this.formatearTiempo(lap.tiempo)}`,
      'info'
    );
  };

  TemporizadorStopwatch.prototype.actualizarDOM = function () {
    const tiempoDisplay = this.elementoDOM.querySelector('.time-display');
    const estado = this.elementoDOM.querySelector('.timer-status');

    tiempoDisplay.textContent = this.formatearTiempo(this.tiempoActual);

    // Actualizar estado visual
    this.elementoDOM.className = `timer-card ${this.estado}`;

    switch (this.estado) {
      case 'corriendo':
        estado.textContent = 'Corriendo...';
        break;
      case 'pausado':
        estado.textContent = 'Pausado';
        break;
      default:
        estado.textContent = 'Detenido';
    }
  };

  TemporizadorStopwatch.prototype.actualizarLapsDOM = function () {
    const lapsContainer = this.elementoDOM.querySelector('.timer-laps');
    if (!lapsContainer) return;

    lapsContainer.innerHTML = '';

    this.laps.forEach(lap => {
      const lapElement = document.createElement('div');
      lapElement.className = 'lap-item';
      lapElement.innerHTML = `
                <span>Lap ${lap.numero}</span>
                <span>${this.formatearTiempo(lap.tiempo)}</span>
            `;
      lapsContainer.appendChild(lapElement);
    });
  };

  // =====================================================
  // 5. TEMPORIZADOR POMODORO CON HERENCIA
  // =====================================================

  function TemporizadorPomodoro(configuracion) {
    TemporizadorBase.call(this, configuracion);

    this.tiempoTrabajo = (configuracion.tiempoTrabajo || 25) * 60 * 1000;
    this.tiempoDescanso = (configuracion.tiempoDescanso || 5) * 60 * 1000;
    this.tiempoDescansoLargo =
      (configuracion.tiempoDescansoLargo || 15) * 60 * 1000;
    this.totalCiclos = configuracion.ciclos || 4;

    this.cicloActual = 1;
    this.fase = 'trabajo'; // trabajo, descanso, descanso-largo
    this.sonidoCambioFase = configuracion.sonido || false;
    this.notificacion = configuracion.notificacion || false;

    this.tiempoInicial = this.tiempoTrabajo;
    this.tiempoActual = this.tiempoTrabajo;
    this.tipo = 'pomodoro';
  }

  // Configurar herencia
  TemporizadorPomodoro.prototype = Object.create(TemporizadorBase.prototype);
  TemporizadorPomodoro.prototype.constructor = TemporizadorPomodoro;

  // Sobrescribir método tick
  TemporizadorPomodoro.prototype.tick = function () {
    const tiempoTranscurrido = Date.now() - this.tiempoInicio;
    this.tiempoActual = Math.max(0, this.tiempoInicial - tiempoTranscurrido);

    if (this.tiempoActual <= 0) {
      this.siguienteFase();
    } else {
      this.actualizar();
    }
  };

  TemporizadorPomodoro.prototype.siguienteFase = function () {
    if (this.fase === 'trabajo') {
      // Cambiar a descanso
      if (this.cicloActual >= this.totalCiclos) {
        this.fase = 'descanso-largo';
        this.tiempoInicial = this.tiempoDescansoLargo;
      } else {
        this.fase = 'descanso';
        this.tiempoInicial = this.tiempoDescanso;
      }
    } else {
      // Cambiar a trabajo
      this.fase = 'trabajo';
      this.tiempoInicial = this.tiempoTrabajo;

      if (this.cicloActual < this.totalCiclos) {
        this.cicloActual++;
      } else {
        this.completarPomodoro();
        return;
      }
    }

    this.tiempoActual = this.tiempoInicial;
    this.tiempoInicio = Date.now();
    this.tiempoPausado = 0;

    // Notificaciones
    if (this.notificacion) {
      const mensaje =
        this.fase === 'trabajo'
          ? `Inicio del ciclo ${this.cicloActual}`
          : `Tiempo de ${this.fase.replace('-', ' ')}`;
      NotificationManager.mostrar('Cambio de fase', mensaje, 'info');
    }

    if (this.sonidoCambioFase) {
      AudioManager.reproducir('phase-change');
    }

    this.actualizar();
  };

  TemporizadorPomodoro.prototype.completarPomodoro = function () {
    this.estado = 'terminado';
    clearInterval(this.intervalo);
    this.intervalo = null;

    // Actualizar estadísticas
    estadisticas.completados++;
    actualizarEstadisticas();

    // Notificaciones
    if (this.notificacion) {
      NotificationManager.mostrar(
        '¡Pomodoro completo!',
        `${this.titulo} ha terminado todos los ciclos`,
        'success'
      );
    }

    if (this.sonidoCambioFase) {
      AudioManager.reproducir('pomodoro-complete');
    }

    this.disparar('onComplete', this);
    this.disparar('onStateChange', this.estado);
    this.actualizar();
  };

  TemporizadorPomodoro.prototype.actualizarDOM = function () {
    const tiempoDisplay = this.elementoDOM.querySelector('.time-display');
    const progresoBar = this.elementoDOM.querySelector('.progress-bar');
    const estado = this.elementoDOM.querySelector('.timer-status');
    const detalles = this.elementoDOM.querySelector('.timer-details');

    tiempoDisplay.textContent = this.formatearTiempo(this.tiempoActual);

    const progreso =
      this.tiempoInicial > 0
        ? ((this.tiempoInicial - this.tiempoActual) / this.tiempoInicial) * 100
        : 0;
    progresoBar.style.width = `${progreso}%`;

    // Actualizar estado visual
    this.elementoDOM.className = `timer-card ${this.estado}`;

    // Actualizar detalles
    const faseTexto =
      this.fase === 'trabajo'
        ? 'Trabajo'
        : this.fase === 'descanso'
        ? 'Descanso'
        : 'Descanso Largo';
    detalles.textContent = `${faseTexto} - Ciclo ${this.cicloActual}/${this.totalCiclos}`;

    switch (this.estado) {
      case 'corriendo':
        estado.textContent = `${faseTexto} en progreso...`;
        break;
      case 'pausado':
        estado.textContent = `${faseTexto} pausado`;
        break;
      case 'terminado':
        estado.textContent = '¡Pomodoro completo!';
        break;
      default:
        estado.textContent = 'Detenido';
    }
  };

  // =====================================================
  // 6. SISTEMA DE NOTIFICACIONES (OBSERVER PATTERN)
  // =====================================================

  const NotificationManager = (function () {
    const notificaciones = [];
    const maxNotificaciones = 5;
    const tiempoAutoCierre = 5000;

    function crear(titulo, mensaje, tipo = 'info') {
      const notificacion = {
        id: Date.now(),
        titulo,
        mensaje,
        tipo,
        timestamp: Date.now(),
      };

      return notificacion;
    }

    function renderizar(notificacion) {
      const template = document.getElementById('notificationTemplate');
      const elemento = template.content.cloneNode(true);

      const container = elemento.querySelector('.notification');
      container.id = `notification-${notificacion.id}`;
      container.className = `notification ${notificacion.tipo}`;

      const icono = elemento.querySelector('.notification-icon');
      const titulo = elemento.querySelector('.notification-title');
      const mensaje = elemento.querySelector('.notification-message');
      const cerrar = elemento.querySelector('.notification-close');

      // Configurar iconos por tipo
      const iconos = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️',
      };

      icono.textContent = iconos[notificacion.tipo] || iconos.info;
      titulo.textContent = notificacion.titulo;
      mensaje.textContent = notificacion.mensaje;

      // Evento de cierre
      cerrar.addEventListener('click', () => {
        remover(notificacion.id);
      });

      return container;
    }

    function mostrar(titulo, mensaje, tipo = 'info') {
      const notificacion = crear(titulo, mensaje, tipo);

      // Limitar número de notificaciones
      if (notificaciones.length >= maxNotificaciones) {
        remover(notificaciones[0].id);
      }

      notificaciones.push(notificacion);

      const elemento = renderizar(notificacion);
      elementos.contenedorNotificaciones.appendChild(elemento);

      // Auto-cierre
      setTimeout(() => {
        remover(notificacion.id);
      }, tiempoAutoCierre);
    }

    function remover(id) {
      const indice = notificaciones.findIndex(n => n.id === id);
      if (indice !== -1) {
        notificaciones.splice(indice, 1);
      }

      const elemento = document.getElementById(`notification-${id}`);
      if (elemento) {
        elemento.classList.add('removing');
        setTimeout(() => {
          elemento.remove();
        }, 300);
      }
    }

    return {
      mostrar,
      remover,
    };
  })();

  // =====================================================
  // 7. SISTEMA DE AUDIO
  // =====================================================

  const AudioManager = (function () {
    const sonidos = {
      'countdown-complete': {
        frecuencia: 800,
        duracion: 1000,
        tipo: 'sine',
      },
      'phase-change': {
        frecuencia: 600,
        duracion: 500,
        tipo: 'square',
      },
      'pomodoro-complete': {
        frecuencia: 1000,
        duracion: 1500,
        tipo: 'triangle',
      },
    };

    let audioContext = null;

    function inicializar() {
      if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }
    }

    function reproducir(nombre) {
      if (!sonidos[nombre]) return;

      try {
        inicializar();

        const sonido = sonidos[nombre];
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = sonido.frecuencia;
        oscillator.type = sonido.tipo;

        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + sonido.duracion / 1000
        );

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + sonido.duracion / 1000);
      } catch (error) {
        console.warn('Error reproduciendo sonido:', error);
      }
    }

    return {
      reproducir,
    };
  })();

  // =====================================================
  // 8. SISTEMA DE PERSISTENCIA CON CLOSURES
  // =====================================================

  const StorageManager = (function () {
    const STORAGE_KEY = 'temporizador-app-data';

    function guardar(datos) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(datos));
      } catch (error) {
        console.warn('Error guardando datos:', error);
      }
    }

    function cargar() {
      try {
        const datos = localStorage.getItem(STORAGE_KEY);
        return datos ? JSON.parse(datos) : null;
      } catch (error) {
        console.warn('Error cargando datos:', error);
        return null;
      }
    }

    function limpiar() {
      localStorage.removeItem(STORAGE_KEY);
    }

    return {
      guardar,
      cargar,
      limpiar,
    };
  })();

  // =====================================================
  // 9. GESTIÓN DE TEMPORIZADORES
  // =====================================================

  function crearTemporizador(tipo, configuracion) {
    let temporizador;

    switch (tipo) {
      case 'countdown':
        temporizador = new TemporizadorCountdown(configuracion);
        break;
      case 'stopwatch':
        temporizador = new TemporizadorStopwatch(configuracion);
        break;
      case 'pomodoro':
        temporizador = new TemporizadorPomodoro(configuracion);
        break;
      default:
        throw new Error(`Tipo de temporizador no válido: ${tipo}`);
    }

    // Configurar callbacks
    temporizador.on('onStateChange', estado => {
      actualizarEstadisticas();
      persistirEstado();
    });

    temporizador.on('onComplete', timer => {
      estadisticas.tiempoTotal += timer.tiempoInicial;
      actualizarEstadisticas();
    });

    // Crear elemento DOM
    temporizador.elementoDOM = crearElementoTemporizador(temporizador);

    // Agregar a la colección
    temporizadores.set(temporizador.id, temporizador);

    // Mostrar en el DOM
    mostrarTemporizador(temporizador);

    // Actualizar estadísticas
    actualizarEstadisticas();

    return temporizador;
  }

  function crearElementoTemporizador(temporizador) {
    const template = document.getElementById('timerTemplate');
    const elemento = template.content.cloneNode(true);

    const card = elemento.querySelector('.timer-card');
    card.id = `timer-${temporizador.id}`;

    const titulo = elemento.querySelector('.timer-title');
    const badge = elemento.querySelector('.timer-type-badge');
    const cerrar = elemento.querySelector('.timer-close-btn');

    titulo.textContent = temporizador.titulo;
    badge.textContent = temporizador.tipo.toUpperCase();

    // Configurar controles
    const iniciar = elemento.querySelector('.start-btn');
    const pausar = elemento.querySelector('.pause-btn');
    const detener = elemento.querySelector('.stop-btn');
    const reiniciar = elemento.querySelector('.reset-btn');

    iniciar.addEventListener('click', () => temporizador.iniciar());
    pausar.addEventListener('click', () => temporizador.pausar());
    detener.addEventListener('click', () => temporizador.detener());
    reiniciar.addEventListener('click', () => temporizador.reiniciar());

    cerrar.addEventListener('click', () => {
      eliminarTemporizador(temporizador.id);
    });

    // Botón de lap para stopwatch
    if (temporizador.tipo === 'stopwatch' && temporizador.lapsHabilitados) {
      const lapBtn = document.createElement('button');
      lapBtn.className = 'timer-btn lap-btn';
      lapBtn.textContent = '⏲️';
      lapBtn.addEventListener('click', () => temporizador.agregarLap());

      const controles = elemento.querySelector('.timer-controls');
      controles.appendChild(lapBtn);
    }

    return card;
  }

  function mostrarTemporizador(temporizador) {
    const container = elementos.contenedorTemporizadores;
    const emptyState = container.querySelector('.empty-state');

    if (emptyState) {
      emptyState.remove();
    }

    container.appendChild(temporizador.elementoDOM);
    temporizador.actualizar();
  }

  function eliminarTemporizador(id) {
    const temporizador = temporizadores.get(id);
    if (temporizador) {
      temporizador.destruir();
      temporizadores.delete(id);
      actualizarEstadisticas();

      // Mostrar empty state si no hay temporizadores
      if (temporizadores.size === 0) {
        mostrarEmptyState();
      }
    }
  }

  function mostrarEmptyState() {
    const container = elementos.contenedorTemporizadores;
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.innerHTML = `
            <div class="empty-icon">🎯</div>
            <h2>¡Crea tu primer temporizador!</h2>
            <p>Selecciona un tipo de temporizador en el panel de control</p>
        `;
    container.appendChild(emptyState);
  }

  // =====================================================
  // 10. GESTIÓN DE ESTADÍSTICAS
  // =====================================================

  function actualizarEstadisticas() {
    estadisticas.activos = Array.from(temporizadores.values()).filter(
      t => t.estado === 'corriendo' || t.estado === 'pausado'
    ).length;

    if (elementos.estadisticas.activos) {
      elementos.estadisticas.activos.textContent = estadisticas.activos;
    }

    if (elementos.estadisticas.completados) {
      elementos.estadisticas.completados.textContent = estadisticas.completados;
    }

    if (elementos.estadisticas.tiempoTotal) {
      elementos.estadisticas.tiempoTotal.textContent =
        TemporizadorBase.prototype.formatearTiempo(estadisticas.tiempoTotal);
    }
  }

  function persistirEstado() {
    const datos = {
      estadisticas,
      configuraciones: Array.from(temporizadores.values()).map(t => ({
        id: t.id,
        tipo: t.tipo,
        configuracion: t.configuracion,
        estado: t.estado,
      })),
    };

    StorageManager.guardar(datos);
  }

  // =====================================================
  // 11. GESTIÓN DE MODAL Y FORMULARIOS
  // =====================================================

  function mostrarModal(tipo) {
    tipoActual = tipo;

    // Ocultar todos los grupos de configuración
    const grupos = elementos.modal.querySelectorAll('.config-group');
    grupos.forEach(grupo => (grupo.style.display = 'none'));

    // Mostrar grupo correspondiente
    const grupoActivo = elementos.modal.querySelector(`#${tipo}Config`);
    if (grupoActivo) {
      grupoActivo.style.display = 'block';
    }

    // Actualizar título
    const titulo = elementos.modal.querySelector('#modalTitle');
    const titulos = {
      countdown: 'Configurar Countdown',
      stopwatch: 'Configurar Stopwatch',
      pomodoro: 'Configurar Pomodoro',
    };
    titulo.textContent = titulos[tipo] || 'Configurar Temporizador';

    elementos.modal.classList.add('active');
  }

  function ocultarModal() {
    elementos.modal.classList.remove('active');
    tipoActual = null;
    configuracionActual = null;
    elementos.formularioConfig.reset();
  }

  function procesarFormulario(evento) {
    evento.preventDefault();

    if (!tipoActual) return;

    const formData = new FormData(evento.target);

    let configuracion;

    switch (tipoActual) {
      case 'countdown':
        configuracion = {
          titulo:
            formData.get('titulo') ||
            document.getElementById('countdownTitle').value ||
            'Countdown',
          horas: parseInt(document.getElementById('countdownHours').value) || 0,
          minutos:
            parseInt(document.getElementById('countdownMinutes').value) || 5,
          segundos:
            parseInt(document.getElementById('countdownSeconds').value) || 0,
          sonido: document.getElementById('countdownSound').checked,
          notificacion: document.getElementById('countdownNotification')
            .checked,
        };
        break;

      case 'stopwatch':
        configuracion = {
          titulo:
            document.getElementById('stopwatchTitle').value || 'Stopwatch',
          laps: document.getElementById('stopwatchLaps').checked,
          autoSave: document.getElementById('stopwatchAutoSave').checked,
        };
        break;

      case 'pomodoro':
        configuracion = {
          titulo: document.getElementById('pomodoroTitle').value || 'Pomodoro',
          tiempoTrabajo:
            parseInt(document.getElementById('pomodoroWork').value) || 25,
          tiempoDescanso:
            parseInt(document.getElementById('pomodoroBreak').value) || 5,
          tiempoDescansoLargo:
            parseInt(document.getElementById('pomodoroLongBreak').value) || 15,
          ciclos:
            parseInt(document.getElementById('pomodoroCycles').value) || 4,
          sonido: document.getElementById('pomodoroSound').checked,
          notificacion: document.getElementById('pomodoroNotification').checked,
        };
        break;
    }

    if (configuracion) {
      try {
        crearTemporizador(tipoActual, configuracion);
        ocultarModal();
        NotificationManager.mostrar(
          'Temporizador creado',
          `${configuracion.titulo} está listo`,
          'success'
        );
      } catch (error) {
        NotificationManager.mostrar(
          'Error',
          `No se pudo crear el temporizador: ${error.message}`,
          'error'
        );
      }
    }
  }

  // =====================================================
  // 12. CONTROLES GLOBALES
  // =====================================================

  function pausarTodos() {
    temporizadores.forEach(temporizador => {
      if (temporizador.estado === 'corriendo') {
        temporizador.pausar();
      }
    });
  }

  function detenerTodos() {
    temporizadores.forEach(temporizador => {
      if (
        temporizador.estado === 'corriendo' ||
        temporizador.estado === 'pausado'
      ) {
        temporizador.detener();
      }
    });
  }

  function limpiarTodos() {
    if (
      confirm('¿Estás seguro de que quieres eliminar todos los temporizadores?')
    ) {
      temporizadores.forEach(temporizador => {
        temporizador.destruir();
      });
      temporizadores.clear();
      mostrarEmptyState();
      actualizarEstadisticas();
      NotificationManager.mostrar(
        'Limpieza completa',
        'Todos los temporizadores eliminados',
        'info'
      );
    }
  }

  // =====================================================
  // 13. GESTIÓN DE TEMAS
  // =====================================================

  function alternarTema() {
    const tema = document.documentElement.getAttribute('data-theme');
    const nuevoTema = tema === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', nuevoTema);

    const botonTema = document.getElementById('themeToggle');
    botonTema.textContent = nuevoTema === 'dark' ? '☀️' : '🌙';

    // Guardar preferencia
    localStorage.setItem('theme', nuevoTema);
  }

  function cargarTema() {
    const temaGuardado = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', temaGuardado);

    const botonTema = document.getElementById('themeToggle');
    botonTema.textContent = temaGuardado === 'dark' ? '☀️' : '🌙';
  }

  // =====================================================
  // 14. INICIALIZACIÓN
  // =====================================================

  function inicializar() {
    // Obtener referencias del DOM
    elementos.modal = document.getElementById('configModal');
    elementos.contenedorTemporizadores =
      document.getElementById('timersContainer');
    elementos.contenedorNotificaciones =
      document.getElementById('notifications');
    elementos.formularioConfig = document.getElementById('timerConfig');
    elementos.estadisticas.activos = document.getElementById('activeCount');
    elementos.estadisticas.completados =
      document.getElementById('completedCount');
    elementos.estadisticas.tiempoTotal = document.getElementById('totalTime');

    // Configurar event listeners

    // Botones de crear temporizador
    document
      .getElementById('createCountdown')
      .addEventListener('click', () => mostrarModal('countdown'));
    document
      .getElementById('createStopwatch')
      .addEventListener('click', () => mostrarModal('stopwatch'));
    document
      .getElementById('createPomodoro')
      .addEventListener('click', () => mostrarModal('pomodoro'));

    // Controles globales
    document.getElementById('pauseAll').addEventListener('click', pausarTodos);
    document.getElementById('stopAll').addEventListener('click', detenerTodos);
    document.getElementById('clearAll').addEventListener('click', limpiarTodos);

    // Modal
    document
      .getElementById('closeModal')
      .addEventListener('click', ocultarModal);
    document
      .getElementById('cancelConfig')
      .addEventListener('click', ocultarModal);
    elementos.formularioConfig.addEventListener('submit', procesarFormulario);

    // Cerrar modal al hacer clic fuera
    elementos.modal.addEventListener('click', evento => {
      if (evento.target === elementos.modal) {
        ocultarModal();
      }
    });

    // Tema
    document
      .getElementById('themeToggle')
      .addEventListener('click', alternarTema);

    // Cerrar modal con escape
    document.addEventListener('keydown', evento => {
      if (
        evento.key === 'Escape' &&
        elementos.modal.classList.contains('active')
      ) {
        ocultarModal();
      }
    });

    // Cargar tema
    cargarTema();

    // Mostrar empty state inicial
    mostrarEmptyState();

    // Actualizar estadísticas
    actualizarEstadisticas();

    // Cargar datos persistidos
    const datosGuardados = StorageManager.cargar();
    if (datosGuardados) {
      estadisticas = { ...estadisticas, ...datosGuardados.estadisticas };
      actualizarEstadisticas();
    }

    console.log('🎯 Temporizador Avanzado inicializado correctamente');
  }

  // =====================================================
  // 15. API PÚBLICA
  // =====================================================

  return {
    inicializar,
    crearTemporizador,
    eliminarTemporizador,
    pausarTodos,
    detenerTodos,
    limpiarTodos,
    mostrarModal,
    ocultarModal,
    // Exponer para debugging
    temporizadores,
    estadisticas,
    NotificationManager,
    AudioManager,
    StorageManager,
  };
})();

// =====================================================
// 16. INICIALIZACIÓN AUTOMÁTICA
// =====================================================

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  TemporizadorApp.inicializar();
});

// Exponer globalmente para debugging
window.TemporizadorApp = TemporizadorApp;
