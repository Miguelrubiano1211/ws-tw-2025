// 🚀 Reloj Digital Interactivo - JavaScript ES6+
// Día 3 - JavaScript ES6+ Fundamentals

class RelojDigital {
  constructor() {
    this.formato24h = false;
    this.zonaHoraria = 'America/Bogota';
    this.tema = 'light';
    this.configuraciones = this.cargarConfiguraciones();
    this.intervalos = new Map();

    this.inicializar();
  }

  inicializar() {
    this.aplicarConfiguraciones();
    this.configurarEventos();
    this.iniciarReloj();
    this.solicitarPermisoNotificaciones();
  }

  // =============================================
  // Configuración y Persistencia
  // =============================================

  cargarConfiguraciones() {
    const configuracionesPredeterminadas = {
      formato24h: false,
      zonaHoraria: 'America/Bogota',
      tema: 'light',
      sonidoActivado: true,
      notificacionesActivadas: true,
    };

    const configuracionesGuardadas = localStorage.getItem(
      'reloj-configuraciones'
    );
    return configuracionesGuardadas
      ? {
          ...configuracionesPredeterminadas,
          ...JSON.parse(configuracionesGuardadas),
        }
      : configuracionesPredeterminadas;
  }

  guardarConfiguraciones() {
    localStorage.setItem(
      'reloj-configuraciones',
      JSON.stringify(this.configuraciones)
    );
  }

  aplicarConfiguraciones() {
    this.formato24h = this.configuraciones.formato24h;
    this.zonaHoraria = this.configuraciones.zonaHoraria;
    this.cambiarTema(this.configuraciones.tema);

    // Actualizar controles UI
    document.getElementById('format-24h').checked = this.formato24h;
    document.getElementById('timezone').value = this.zonaHoraria;
    document.getElementById('theme-select').value = this.configuraciones.tema;
    document.getElementById('sound-enabled').checked =
      this.configuraciones.sonidoActivado;
    document.getElementById('notifications-enabled').checked =
      this.configuraciones.notificacionesActivadas;
  }

  // =============================================
  // Reloj Principal
  // =============================================

  iniciarReloj() {
    this.actualizarReloj();
    this.establecerIntervalo(
      'reloj-principal',
      () => this.actualizarReloj(),
      1000
    );
  }

  actualizarReloj() {
    const ahora = new Date();
    const opciones = {
      timeZone: this.zonaHoraria,
      hour12: !this.formato24h,
    };

    // Formatear tiempo
    const formatoHora = this.formato24h ? 'HH:mm:ss' : 'hh:mm:ss';
    const horas = ahora.toLocaleString('es-ES', {
      ...opciones,
      hour: '2-digit',
    });
    const minutos = ahora.toLocaleString('es-ES', {
      ...opciones,
      minute: '2-digit',
    });
    const segundos = ahora.toLocaleString('es-ES', {
      ...opciones,
      second: '2-digit',
    });

    // Actualizar display
    document.getElementById('hours').textContent = horas;
    document.getElementById('minutes').textContent = minutos;
    document.getElementById('seconds').textContent = segundos;

    // AM/PM
    const ampmElement = document.getElementById('ampm');
    if (this.formato24h) {
      ampmElement.style.display = 'none';
    } else {
      ampmElement.style.display = 'inline';
      ampmElement.textContent = ahora.getHours() >= 12 ? 'PM' : 'AM';
    }

    // Fecha
    const nombreDia = ahora.toLocaleDateString('es-ES', {
      weekday: 'long',
      timeZone: this.zonaHoraria,
    });
    const fecha = ahora.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: this.zonaHoraria,
    });

    document.getElementById('day-name').textContent =
      nombreDia.charAt(0).toUpperCase() + nombreDia.slice(1);
    document.getElementById('date').textContent = fecha;
  }

  // =============================================
  // Gestión de Intervalos
  // =============================================

  establecerIntervalo(id, callback, delay) {
    this.limpiarIntervalo(id);
    this.intervalos.set(id, setInterval(callback, delay));
  }

  limpiarIntervalo(id) {
    if (this.intervalos.has(id)) {
      clearInterval(this.intervalos.get(id));
      this.intervalos.delete(id);
    }
  }

  // =============================================
  // Cronómetro
  // =============================================

  inicializarCronometro() {
    this.cronometro = {
      tiempoInicio: 0,
      tiempoPausa: 0,
      corriendo: false,
      pausado: false,
      vueltas: [],
    };

    this.actualizarDisplayCronometro();
  }

  iniciarCronometro() {
    if (!this.cronometro.corriendo) {
      this.cronometro.tiempoInicio = Date.now() - this.cronometro.tiempoPausa;
      this.cronometro.corriendo = true;
      this.cronometro.pausado = false;

      this.establecerIntervalo(
        'cronometro',
        () => this.actualizarDisplayCronometro(),
        10
      );
      this.actualizarBotonesCronometro();
    }
  }

  pausarCronometro() {
    if (this.cronometro.corriendo) {
      this.cronometro.corriendo = false;
      this.cronometro.pausado = true;
      this.cronometro.tiempoPausa = Date.now() - this.cronometro.tiempoInicio;

      this.limpiarIntervalo('cronometro');
      this.actualizarBotonesCronometro();
    }
  }

  reiniciarCronometro() {
    this.cronometro.corriendo = false;
    this.cronometro.pausado = false;
    this.cronometro.tiempoInicio = 0;
    this.cronometro.tiempoPausa = 0;
    this.cronometro.vueltas = [];

    this.limpiarIntervalo('cronometro');
    this.actualizarDisplayCronometro();
    this.actualizarBotonesCronometro();
    this.actualizarVueltas();
  }

  registrarVuelta() {
    if (this.cronometro.corriendo) {
      const tiempoActual = Date.now() - this.cronometro.tiempoInicio;
      const tiempoVuelta =
        this.cronometro.vueltas.length > 0
          ? tiempoActual -
            this.cronometro.vueltas[this.cronometro.vueltas.length - 1]
              .tiempoTotal
          : tiempoActual;

      this.cronometro.vueltas.push({
        numero: this.cronometro.vueltas.length + 1,
        tiempoVuelta,
        tiempoTotal: tiempoActual,
      });

      this.actualizarVueltas();
    }
  }

  actualizarDisplayCronometro() {
    const tiempoTranscurrido = this.cronometro.corriendo
      ? Date.now() - this.cronometro.tiempoInicio
      : this.cronometro.tiempoPausa;

    const minutos = Math.floor(tiempoTranscurrido / 60000);
    const segundos = Math.floor((tiempoTranscurrido % 60000) / 1000);
    const milisegundos = Math.floor((tiempoTranscurrido % 1000) / 10);

    document.getElementById('stopwatch-minutes').textContent = minutos
      .toString()
      .padStart(2, '0');
    document.getElementById('stopwatch-seconds').textContent = segundos
      .toString()
      .padStart(2, '0');
    document.getElementById('stopwatch-milliseconds').textContent = milisegundos
      .toString()
      .padStart(2, '0');
  }

  actualizarBotonesCronometro() {
    const btnIniciar = document.getElementById('stopwatch-start');
    const btnPausar = document.getElementById('stopwatch-pause');
    const btnVuelta = document.getElementById('stopwatch-lap');

    btnIniciar.disabled = this.cronometro.corriendo;
    btnPausar.disabled = !this.cronometro.corriendo;
    btnVuelta.disabled = !this.cronometro.corriendo;
  }

  actualizarVueltas() {
    const contenedorVueltas = document.getElementById('lap-times');
    contenedorVueltas.innerHTML = '';

    this.cronometro.vueltas.forEach(vuelta => {
      const elementoVuelta = document.createElement('div');
      elementoVuelta.className = 'lap-time';
      elementoVuelta.innerHTML = `
                <span>Vuelta ${vuelta.numero}</span>
                <span>${this.formatearTiempo(vuelta.tiempoVuelta)}</span>
                <span>${this.formatearTiempo(vuelta.tiempoTotal)}</span>
            `;
      contenedorVueltas.appendChild(elementoVuelta);
    });
  }

  // =============================================
  // Temporizador
  // =============================================

  inicializarTemporizador() {
    this.temporizador = {
      duracionTotal: 300000, // 5 minutos por defecto
      tiempoRestante: 300000,
      corriendo: false,
      tiempoInicio: 0,
    };

    this.actualizarDisplayTemporizador();
  }

  configurarTemporizador() {
    const horas = parseInt(document.getElementById('timer-hours').value) || 0;
    const minutos =
      parseInt(document.getElementById('timer-minutes').value) || 0;
    const segundos =
      parseInt(document.getElementById('timer-seconds').value) || 0;

    const duracionTotal = (horas * 3600 + minutos * 60 + segundos) * 1000;

    if (duracionTotal > 0) {
      this.temporizador.duracionTotal = duracionTotal;
      this.temporizador.tiempoRestante = duracionTotal;
      this.actualizarDisplayTemporizador();
    }
  }

  iniciarTemporizador() {
    if (!this.temporizador.corriendo && this.temporizador.tiempoRestante > 0) {
      this.temporizador.corriendo = true;
      this.temporizador.tiempoInicio = Date.now();

      this.establecerIntervalo(
        'temporizador',
        () => this.actualizarTemporizador(),
        100
      );
      this.actualizarBotonesTemporizador();
    }
  }

  pausarTemporizador() {
    if (this.temporizador.corriendo) {
      this.temporizador.corriendo = false;
      this.limpiarIntervalo('temporizador');
      this.actualizarBotonesTemporizador();
    }
  }

  reiniciarTemporizador() {
    this.temporizador.corriendo = false;
    this.temporizador.tiempoRestante = this.temporizador.duracionTotal;

    this.limpiarIntervalo('temporizador');
    this.actualizarDisplayTemporizador();
    this.actualizarBotonesTemporizador();
  }

  actualizarTemporizador() {
    const tiempoTranscurrido = Date.now() - this.temporizador.tiempoInicio;
    this.temporizador.tiempoRestante = Math.max(
      0,
      this.temporizador.duracionTotal - tiempoTranscurrido
    );

    if (this.temporizador.tiempoRestante === 0) {
      this.temporizadorCompletado();
    }

    this.actualizarDisplayTemporizador();
  }

  actualizarDisplayTemporizador() {
    const tiempoRestante = this.temporizador.tiempoRestante;
    const horas = Math.floor(tiempoRestante / 3600000);
    const minutos = Math.floor((tiempoRestante % 3600000) / 60000);
    const segundos = Math.floor((tiempoRestante % 60000) / 1000);

    document.getElementById('timer-display-hours').textContent = horas
      .toString()
      .padStart(2, '0');
    document.getElementById('timer-display-minutes').textContent = minutos
      .toString()
      .padStart(2, '0');
    document.getElementById('timer-display-seconds').textContent = segundos
      .toString()
      .padStart(2, '0');

    // Actualizar barra de progreso
    const progreso =
      ((this.temporizador.duracionTotal - tiempoRestante) /
        this.temporizador.duracionTotal) *
      100;
    document.getElementById('timer-progress').style.width = `${progreso}%`;
  }

  actualizarBotonesTemporizador() {
    const btnIniciar = document.getElementById('timer-start');
    const btnPausar = document.getElementById('timer-pause');

    btnIniciar.disabled = this.temporizador.corriendo;
    btnPausar.disabled = !this.temporizador.corriendo;
  }

  temporizadorCompletado() {
    this.temporizador.corriendo = false;
    this.limpiarIntervalo('temporizador');
    this.actualizarBotonesTemporizador();

    this.reproducirSonido('timer-complete');
    this.mostrarNotificacion('⏰ Temporizador', 'El tiempo ha terminado!');
  }

  // =============================================
  // Sistema de Alarmas
  // =============================================

  inicializarAlarmas() {
    this.alarmas = this.cargarAlarmas();
    this.renderizarAlarmas();
    this.verificarAlarmas();
  }

  cargarAlarmas() {
    const alarmasGuardadas = localStorage.getItem('reloj-alarmas');
    return alarmasGuardadas ? JSON.parse(alarmasGuardadas) : [];
  }

  guardarAlarmas() {
    localStorage.setItem('reloj-alarmas', JSON.stringify(this.alarmas));
  }

  agregarAlarma() {
    const tiempo = document.getElementById('alarm-time').value;
    const etiqueta = document.getElementById('alarm-label').value || 'Alarma';
    const sonido = document.getElementById('alarm-sound').value;

    if (!tiempo) {
      alert('Por favor selecciona una hora para la alarma');
      return;
    }

    const diasSeleccionados = Array.from(
      document.querySelectorAll('.alarm-days input:checked')
    ).map(checkbox => parseInt(checkbox.value));

    const alarma = {
      id: Date.now(),
      tiempo,
      etiqueta,
      sonido,
      dias: diasSeleccionados.length > 0 ? diasSeleccionados : [1, 2, 3, 4, 5], // Por defecto días laborables
      activa: true,
      repetir: diasSeleccionados.length > 0,
    };

    this.alarmas.push(alarma);
    this.guardarAlarmas();
    this.renderizarAlarmas();

    // Limpiar formulario
    document.getElementById('alarm-time').value = '';
    document.getElementById('alarm-label').value = '';
    document
      .querySelectorAll('.alarm-days input')
      .forEach(checkbox => (checkbox.checked = false));
  }

  renderizarAlarmas() {
    const contenedor = document.getElementById('alarm-list');
    contenedor.innerHTML = '';

    if (this.alarmas.length === 0) {
      contenedor.innerHTML =
        '<p style="text-align: center; color: var(--text-secondary);">No hay alarmas configuradas</p>';
      return;
    }

    this.alarmas.forEach(alarma => {
      const elemento = document.createElement('div');
      elemento.className = `alarm-item ${alarma.activa ? 'active' : ''}`;
      elemento.innerHTML = `
                <div class="alarm-info">
                    <div class="alarm-time">${alarma.tiempo}</div>
                    <div class="alarm-label">${alarma.etiqueta}</div>
                    <div class="alarm-days-display">
                        ${
                          alarma.repetir
                            ? this.formatearDias(alarma.dias)
                            : 'Una vez'
                        }
                    </div>
                </div>
                <div class="alarm-actions">
                    <button class="alarm-toggle ${
                      alarma.activa ? 'active' : ''
                    }" 
                            onclick="reloj.toggleAlarma(${alarma.id})"></button>
                    <button class="btn btn-danger btn-sm" 
                            onclick="reloj.eliminarAlarma(${
                              alarma.id
                            })">🗑️</button>
                </div>
            `;
      contenedor.appendChild(elemento);
    });
  }

  toggleAlarma(id) {
    const alarma = this.alarmas.find(a => a.id === id);
    if (alarma) {
      alarma.activa = !alarma.activa;
      this.guardarAlarmas();
      this.renderizarAlarmas();
    }
  }

  eliminarAlarma(id) {
    this.alarmas = this.alarmas.filter(a => a.id !== id);
    this.guardarAlarmas();
    this.renderizarAlarmas();
  }

  verificarAlarmas() {
    this.establecerIntervalo(
      'verificar-alarmas',
      () => {
        const ahora = new Date();
        const tiempoActual = ahora.toTimeString().slice(0, 5);
        const diaActual = ahora.getDay();

        this.alarmas.forEach(alarma => {
          if (alarma.activa && alarma.tiempo === tiempoActual) {
            if (!alarma.repetir || alarma.dias.includes(diaActual)) {
              this.activarAlarma(alarma);
            }
          }
        });
      },
      1000
    );
  }

  activarAlarma(alarma) {
    this.mostrarModalAlarma(alarma);
    this.reproducirSonido(alarma.sonido);
    this.mostrarNotificacion('🔔 Alarma', alarma.etiqueta);

    // Desactivar alarma si no es repetitiva
    if (!alarma.repetir) {
      alarma.activa = false;
      this.guardarAlarmas();
      this.renderizarAlarmas();
    }
  }

  mostrarModalAlarma(alarma) {
    const modal = document.getElementById('alarm-modal');
    const mensaje = document.getElementById('alarm-message');

    mensaje.textContent = alarma.etiqueta;
    modal.style.display = 'block';

    // Auto-cerrar después de 1 minuto
    setTimeout(() => {
      if (modal.style.display === 'block') {
        this.cerrarModalAlarma();
      }
    }, 60000);
  }

  cerrarModalAlarma() {
    document.getElementById('alarm-modal').style.display = 'none';
    this.detenerSonido();
  }

  repetirAlarma() {
    this.cerrarModalAlarma();

    // Crear nueva alarma en 5 minutos
    const ahora = new Date();
    ahora.setMinutes(ahora.getMinutes() + 5);
    const tiempoRepetir = ahora.toTimeString().slice(0, 5);

    const alarmaRepetir = {
      id: Date.now(),
      tiempo: tiempoRepetir,
      etiqueta: 'Repetir alarma',
      sonido: 'beep',
      dias: [],
      activa: true,
      repetir: false,
    };

    this.alarmas.push(alarmaRepetir);
    this.guardarAlarmas();
    this.renderizarAlarmas();
  }

  // =============================================
  // Utilidades
  // =============================================

  formatearTiempo(milisegundos) {
    const minutos = Math.floor(milisegundos / 60000);
    const segundos = Math.floor((milisegundos % 60000) / 1000);
    const ms = Math.floor((milisegundos % 1000) / 10);

    return `${minutos.toString().padStart(2, '0')}:${segundos
      .toString()
      .padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  }

  formatearDias(dias) {
    const nombresDias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return dias.map(dia => nombresDias[dia]).join(', ');
  }

  // =============================================
  // Temas y Configuración
  // =============================================

  cambiarTema(tema) {
    document.body.setAttribute('data-theme', tema);
    this.configuraciones.tema = tema;
    this.guardarConfiguraciones();

    // Actualizar icono del botón de tema
    const iconoTema = document.getElementById('toggle-theme');
    const iconos = {
      light: '☀️',
      dark: '🌙',
      blue: '🔵',
      green: '🟢',
    };
    iconoTema.textContent = iconos[tema] || '🎨';
  }

  toggleTema() {
    const temas = ['light', 'dark', 'blue', 'green'];
    const indiceActual = temas.indexOf(this.configuraciones.tema);
    const siguienteTema = temas[(indiceActual + 1) % temas.length];
    this.cambiarTema(siguienteTema);
  }

  // =============================================
  // Sonidos y Notificaciones
  // =============================================

  reproducirSonido(tipo) {
    if (!this.configuraciones.sonidoActivado) return;

    // Crear contexto de audio
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Configurar sonido según tipo
    const configuracionesSonido = {
      beep: { frequency: 800, duration: 200 },
      bell: { frequency: 1000, duration: 500 },
      chime: { frequency: 600, duration: 300 },
      'timer-complete': { frequency: 1200, duration: 1000 },
    };

    const config = configuracionesSonido[tipo] || configuracionesSonido.beep;

    oscillator.frequency.value = config.frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + config.duration / 1000
    );

    oscillator.start();
    oscillator.stop(audioContext.currentTime + config.duration / 1000);
  }

  detenerSonido() {
    // Implementar lógica para detener sonidos si es necesario
  }

  async solicitarPermisoNotificaciones() {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  }

  mostrarNotificacion(titulo, mensaje) {
    if (!this.configuraciones.notificacionesActivadas) return;

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(titulo, {
        body: mensaje,
        icon: '⏰',
        tag: 'reloj-digital',
      });
    }
  }

  // =============================================
  // Exportar/Importar Configuraciones
  // =============================================

  exportarConfiguraciones() {
    const datos = {
      configuraciones: this.configuraciones,
      alarmas: this.alarmas,
      version: '1.0',
    };

    const blob = new Blob([JSON.stringify(datos, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'reloj-configuraciones.json';
    a.click();

    URL.revokeObjectURL(url);
  }

  importarConfiguraciones() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = e => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = e => {
          try {
            const datos = JSON.parse(e.target.result);

            if (datos.configuraciones) {
              this.configuraciones = {
                ...this.configuraciones,
                ...datos.configuraciones,
              };
              this.guardarConfiguraciones();
              this.aplicarConfiguraciones();
            }

            if (datos.alarmas) {
              this.alarmas = datos.alarmas;
              this.guardarAlarmas();
              this.renderizarAlarmas();
            }

            alert('Configuraciones importadas exitosamente');
          } catch (error) {
            alert('Error al importar configuraciones');
          }
        };
        reader.readAsText(file);
      }
    };

    input.click();
  }

  resetearConfiguraciones() {
    if (
      confirm(
        '¿Estás seguro de que quieres resetear todas las configuraciones?'
      )
    ) {
      localStorage.removeItem('reloj-configuraciones');
      localStorage.removeItem('reloj-alarmas');
      location.reload();
    }
  }

  // =============================================
  // Configuración de Eventos
  // =============================================

  configurarEventos() {
    // Inicializar componentes
    this.inicializarCronometro();
    this.inicializarTemporizador();
    this.inicializarAlarmas();

    // Eventos del reloj principal
    document
      .getElementById('toggle-theme')
      .addEventListener('click', () => this.toggleTema());
    document.getElementById('format-toggle').addEventListener('click', () => {
      this.configuraciones.formato24h = !this.configuraciones.formato24h;
      this.guardarConfiguraciones();
      this.aplicarConfiguraciones();
    });

    document.getElementById('timezone').addEventListener('change', e => {
      this.configuraciones.zonaHoraria = e.target.value;
      this.guardarConfiguraciones();
      this.aplicarConfiguraciones();
    });

    // Eventos de pestañas
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const tabId = e.target.dataset.tab;
        this.cambiarPestana(tabId);
      });
    });

    // Eventos del cronómetro
    document
      .getElementById('stopwatch-start')
      .addEventListener('click', () => this.iniciarCronometro());
    document
      .getElementById('stopwatch-pause')
      .addEventListener('click', () => this.pausarCronometro());
    document
      .getElementById('stopwatch-reset')
      .addEventListener('click', () => this.reiniciarCronometro());
    document
      .getElementById('stopwatch-lap')
      .addEventListener('click', () => this.registrarVuelta());

    // Eventos del temporizador
    document.getElementById('timer-start').addEventListener('click', () => {
      this.configurarTemporizador();
      this.iniciarTemporizador();
    });
    document
      .getElementById('timer-pause')
      .addEventListener('click', () => this.pausarTemporizador());
    document
      .getElementById('timer-reset')
      .addEventListener('click', () => this.reiniciarTemporizador());

    // Eventos de presets del temporizador
    document.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const segundos = parseInt(e.target.dataset.time);
        const horas = Math.floor(segundos / 3600);
        const minutos = Math.floor((segundos % 3600) / 60);
        const segs = segundos % 60;

        document.getElementById('timer-hours').value = horas;
        document.getElementById('timer-minutes').value = minutos;
        document.getElementById('timer-seconds').value = segs;

        this.configurarTemporizador();
      });
    });

    // Eventos de alarmas
    document
      .getElementById('add-alarm')
      .addEventListener('click', () => this.agregarAlarma());

    // Eventos de configuraciones
    document.getElementById('settings').addEventListener('click', () => {
      document.getElementById('settings-modal').style.display = 'block';
    });

    document.querySelector('.close').addEventListener('click', () => {
      document.getElementById('settings-modal').style.display = 'none';
    });

    document.getElementById('theme-select').addEventListener('change', e => {
      this.cambiarTema(e.target.value);
    });

    document.getElementById('sound-enabled').addEventListener('change', e => {
      this.configuraciones.sonidoActivado = e.target.checked;
      this.guardarConfiguraciones();
    });

    document
      .getElementById('notifications-enabled')
      .addEventListener('change', e => {
        this.configuraciones.notificacionesActivadas = e.target.checked;
        this.guardarConfiguraciones();
      });

    document.getElementById('format-24h').addEventListener('change', e => {
      this.configuraciones.formato24h = e.target.checked;
      this.guardarConfiguraciones();
      this.aplicarConfiguraciones();
    });

    document
      .getElementById('export-settings')
      .addEventListener('click', () => this.exportarConfiguraciones());
    document
      .getElementById('import-settings')
      .addEventListener('click', () => this.importarConfiguraciones());
    document
      .getElementById('reset-settings')
      .addEventListener('click', () => this.resetearConfiguraciones());

    // Eventos de modal de alarma
    document
      .getElementById('dismiss-alarm')
      .addEventListener('click', () => this.cerrarModalAlarma());
    document
      .getElementById('snooze-alarm')
      .addEventListener('click', () => this.repetirAlarma());

    // Cerrar modales al hacer clic fuera
    window.addEventListener('click', e => {
      if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
      }
    });
  }

  cambiarPestana(tabId) {
    // Actualizar botones
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');

    // Actualizar contenido
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
  }
}

// Inicializar la aplicación
const reloj = new RelojDigital();

// Exponer funciones globales necesarias
window.reloj = reloj;
