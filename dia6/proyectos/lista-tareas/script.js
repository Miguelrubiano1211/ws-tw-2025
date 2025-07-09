/**
 * Lista de Tareas - JavaScript Principal
 * Día 6: DOM y Eventos
 * WorldSkills Training
 *
 * Aplicación completa de gestión de tareas que demuestra:
 * - Manipulación avanzada del DOM
 * - Manejo completo de eventos
 * - Validación de formularios
 * - Persistencia de datos
 * - Experiencia de usuario interactiva
 */

// ================================
// ESTADO DE LA APLICACIÓN
// ================================

class EstadoApp {
  constructor() {
    this.tareas = [];
    this.filtroActual = 'todas';
    this.busquedaActual = '';
    this.ordenamientoActual = 'fecha-desc';
    this.tema = 'claro';
    this.configuracion = {
      animaciones: true,
      notificaciones: true,
      sonidos: false,
      autoguardado: true,
    };
    this.contadorId = 1;
    this.tareasSeleccionadas = new Set();
    this.historial = [];
    this.indiceHistorial = -1;

    this.cargarDatos();
    this.aplicarTema();
  }

  // Cargar datos desde localStorage
  cargarDatos() {
    try {
      const datosGuardados = localStorage.getItem('lista-tareas-datos');
      if (datosGuardados) {
        const datos = JSON.parse(datosGuardados);
        this.tareas = datos.tareas || [];
        this.configuracion = { ...this.configuracion, ...datos.configuracion };
        this.tema = datos.tema || 'claro';
        this.contadorId = datos.contadorId || 1;
        this.historial = datos.historial || [];
        this.indiceHistorial = datos.indiceHistorial || -1;
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      this.mostrarNotificacion('Error al cargar datos guardados', 'error');
    }
  }

  // Guardar datos en localStorage
  guardarDatos() {
    try {
      const datos = {
        tareas: this.tareas,
        configuracion: this.configuracion,
        tema: this.tema,
        contadorId: this.contadorId,
        historial: this.historial,
        indiceHistorial: this.indiceHistorial,
      };
      localStorage.setItem('lista-tareas-datos', JSON.stringify(datos));
    } catch (error) {
      console.error('Error al guardar datos:', error);
      this.mostrarNotificacion('Error al guardar datos', 'error');
    }
  }

  // Aplicar tema
  aplicarTema() {
    document.documentElement.setAttribute('data-theme', this.tema);
    const iconoTema = document.querySelector('#btn-theme i');
    if (iconoTema) {
      iconoTema.className =
        this.tema === 'claro' ? 'fas fa-moon' : 'fas fa-sun';
    }
  }

  // Mostrar notificación
  mostrarNotificacion(mensaje, tipo = 'info', duracion = 3000) {
    if (!this.configuracion.notificaciones) return;

    const contenedor = document.getElementById('notificaciones');
    if (!contenedor) return;

    const notificacion = document.createElement('div');
    notificacion.className = `notificacion ${tipo}`;
    notificacion.textContent = mensaje;

    contenedor.appendChild(notificacion);

    // Auto-remover
    setTimeout(() => {
      if (notificacion.parentNode) {
        notificacion.classList.add('animate-fade-out');
        setTimeout(() => notificacion.remove(), 300);
      }
    }, duracion);
  }

  // Agregar al historial
  agregarAlHistorial(accion, datos) {
    this.historial = this.historial.slice(0, this.indiceHistorial + 1);
    this.historial.push({
      accion,
      datos: JSON.parse(JSON.stringify(datos)),
      timestamp: Date.now(),
    });
    this.indiceHistorial = this.historial.length - 1;

    // Limitar historial a 50 acciones
    if (this.historial.length > 50) {
      this.historial.shift();
      this.indiceHistorial--;
    }

    this.guardarDatos();
  }
}

// ================================
// GESTIÓN DE TAREAS
// ================================

class GestorTareas {
  constructor(estado) {
    this.estado = estado;
  }

  // Crear nueva tarea
  crearTarea(texto, opciones = {}) {
    const tarea = {
      id: this.estado.contadorId++,
      texto: texto.trim(),
      completada: false,
      prioridad: opciones.prioridad || 'media',
      categoria: opciones.categoria || '',
      fechaCreacion: new Date().toISOString(),
      fechaLimite: opciones.fechaLimite || null,
      fechaCompletada: null,
      orden: this.estado.tareas.length,
      editada: false,
      notas: '',
    };

    this.estado.tareas.push(tarea);
    this.estado.agregarAlHistorial('crear', tarea);
    this.estado.guardarDatos();

    return tarea;
  }

  // Actualizar tarea
  actualizarTarea(id, cambios) {
    const indice = this.estado.tareas.findIndex(t => t.id === id);
    if (indice === -1) return null;

    const tareaAnterior = JSON.parse(
      JSON.stringify(this.estado.tareas[indice])
    );
    const tareaActualizada = { ...this.estado.tareas[indice], ...cambios };

    if (cambios.completada !== undefined) {
      tareaActualizada.fechaCompletada = cambios.completada
        ? new Date().toISOString()
        : null;
    }

    if (cambios.texto !== undefined) {
      tareaActualizada.editada = true;
    }

    this.estado.tareas[indice] = tareaActualizada;
    this.estado.agregarAlHistorial('actualizar', {
      anterior: tareaAnterior,
      actual: tareaActualizada,
    });
    this.estado.guardarDatos();

    return tareaActualizada;
  }

  // Eliminar tarea
  eliminarTarea(id) {
    const indice = this.estado.tareas.findIndex(t => t.id === id);
    if (indice === -1) return null;

    const tareaEliminada = this.estado.tareas.splice(indice, 1)[0];
    this.estado.agregarAlHistorial('eliminar', tareaEliminada);
    this.estado.guardarDatos();

    return tareaEliminada;
  }

  // Obtener tareas filtradas
  obtenerTareasFiltradas() {
    let tareas = [...this.estado.tareas];

    // Filtrar por estado
    if (this.estado.filtroActual === 'pendientes') {
      tareas = tareas.filter(t => !t.completada);
    } else if (this.estado.filtroActual === 'completadas') {
      tareas = tareas.filter(t => t.completada);
    }

    // Filtrar por búsqueda
    if (this.estado.busquedaActual) {
      const busqueda = this.estado.busquedaActual.toLowerCase();
      tareas = tareas.filter(
        t =>
          t.texto.toLowerCase().includes(busqueda) ||
          t.categoria.toLowerCase().includes(busqueda)
      );
    }

    // Ordenar
    tareas.sort((a, b) => {
      switch (this.estado.ordenamientoActual) {
        case 'fecha-desc':
          return new Date(b.fechaCreacion) - new Date(a.fechaCreacion);
        case 'fecha-asc':
          return new Date(a.fechaCreacion) - new Date(b.fechaCreacion);
        case 'prioridad-desc':
          return this.compararPrioridades(b.prioridad, a.prioridad);
        case 'prioridad-asc':
          return this.compararPrioridades(a.prioridad, b.prioridad);
        case 'alfabetico':
          return a.texto.localeCompare(b.texto);
        default:
          return 0;
      }
    });

    return tareas;
  }

  // Comparar prioridades
  compararPrioridades(a, b) {
    const prioridades = { alta: 3, media: 2, baja: 1 };
    return prioridades[a] - prioridades[b];
  }

  // Obtener estadísticas
  obtenerEstadisticas() {
    const total = this.estado.tareas.length;
    const completadas = this.estado.tareas.filter(t => t.completada).length;
    const pendientes = total - completadas;
    const progreso = total > 0 ? Math.round((completadas / total) * 100) : 0;

    // Estadísticas por categoría
    const categorias = {};
    this.estado.tareas.forEach(t => {
      const categoria = t.categoria || 'Sin categoría';
      if (!categorias[categoria]) {
        categorias[categoria] = { total: 0, completadas: 0 };
      }
      categorias[categoria].total++;
      if (t.completada) categorias[categoria].completadas++;
    });

    // Estadísticas por prioridad
    const prioridades = { alta: 0, media: 0, baja: 0 };
    this.estado.tareas.forEach(t => {
      prioridades[t.prioridad]++;
    });

    return {
      total,
      completadas,
      pendientes,
      progreso,
      categorias,
      prioridades,
    };
  }

  // Limpiar tareas completadas
  limpiarCompletadas() {
    const tareasEliminadas = this.estado.tareas.filter(t => t.completada);
    this.estado.tareas = this.estado.tareas.filter(t => !t.completada);
    this.estado.agregarAlHistorial('limpiar_completadas', tareasEliminadas);
    this.estado.guardarDatos();

    return tareasEliminadas.length;
  }

  // Duplicar tarea
  duplicarTarea(id) {
    const tareaOriginal = this.estado.tareas.find(t => t.id === id);
    if (!tareaOriginal) return null;

    const nuevaTarea = {
      ...tareaOriginal,
      id: this.estado.contadorId++,
      texto: `${tareaOriginal.texto} (copia)`,
      completada: false,
      fechaCreacion: new Date().toISOString(),
      fechaCompletada: null,
      orden: this.estado.tareas.length,
    };

    this.estado.tareas.push(nuevaTarea);
    this.estado.agregarAlHistorial('duplicar', nuevaTarea);
    this.estado.guardarDatos();

    return nuevaTarea;
  }

  // Reordenar tareas
  reordenarTareas(idOrigen, idDestino) {
    const indiceOrigen = this.estado.tareas.findIndex(t => t.id === idOrigen);
    const indiceDestino = this.estado.tareas.findIndex(t => t.id === idDestino);

    if (indiceOrigen === -1 || indiceDestino === -1) return;

    const tareaMovida = this.estado.tareas.splice(indiceOrigen, 1)[0];
    this.estado.tareas.splice(indiceDestino, 0, tareaMovida);

    // Actualizar orden
    this.estado.tareas.forEach((tarea, index) => {
      tarea.orden = index;
    });

    this.estado.guardarDatos();
  }
}

// ================================
// INTERFAZ DE USUARIO
// ================================

class InterfazUsuario {
  constructor(estado, gestorTareas) {
    this.estado = estado;
    this.gestorTareas = gestorTareas;
    this.elementosDOM = {};
    this.tareasEnEdicion = new Set();
    this.debounceTimers = {};

    this.inicializarElementos();
    this.configurarEventos();
    this.actualizarInterfaz();
  }

  // Inicializar elementos DOM
  inicializarElementos() {
    this.elementosDOM = {
      // Formulario
      formNuevaTarea: document.getElementById('form-nueva-tarea'),
      inputNuevaTarea: document.getElementById('input-nueva-tarea'),
      btnAgregar: document.getElementById('btn-agregar'),
      selectPrioridad: document.getElementById('select-prioridad'),
      inputCategoria: document.getElementById('input-categoria'),
      inputFecha: document.getElementById('input-fecha'),
      btnOpciones: document.getElementById('btn-opciones'),
      opcionesAvanzadas: document.getElementById('opciones-avanzadas'),

      // Controles
      filtros: document.querySelectorAll('.btn-filtro'),
      inputBusqueda: document.getElementById('input-busqueda'),
      btnClearBusqueda: document.getElementById('btn-clear-busqueda'),
      selectOrdenamiento: document.getElementById('select-ordenamiento'),

      // Lista
      listaTareas: document.getElementById('lista-tareas'),
      mensajeVacio: document.getElementById('mensaje-vacio'),
      mensajeSinResultados: document.getElementById('mensaje-sin-resultados'),

      // Estadísticas
      estadisticas: document.getElementById('estadisticas'),
      progresoCompletadas: document.getElementById('progreso-completadas'),
      progresoTotal: document.getElementById('progreso-total'),
      progresoFill: document.getElementById('progreso-fill'),

      // Botones
      btnTema: document.getElementById('btn-theme'),
      btnStats: document.getElementById('btn-stats'),
      btnExport: document.getElementById('btn-export'),
      btnLimpiarCompletadas: document.getElementById('btn-limpiar-completadas'),
      btnNuevaTareaFab: document.getElementById('btn-nueva-tarea-fab'),

      // Modales
      modalConfirmacion: document.getElementById('modal-confirmacion'),
      modalEstadisticas: document.getElementById('modal-estadisticas'),
      overlay: document.getElementById('overlay'),

      // Contadores
      countTodas: document.getElementById('count-todas'),
      countPendientes: document.getElementById('count-pendientes'),
      countCompletadas: document.getElementById('count-completadas'),

      // Notificaciones
      notificaciones: document.getElementById('notificaciones'),

      // Ayuda
      atajosAyuda: document.getElementById('atajos-ayuda'),
    };
  }

  // Configurar eventos
  configurarEventos() {
    // Formulario nueva tarea
    this.elementosDOM.formNuevaTarea.addEventListener('submit', e => {
      e.preventDefault();
      this.agregarTarea();
    });

    // Opciones avanzadas
    this.elementosDOM.btnOpciones.addEventListener('click', () => {
      this.toggleOpcionesAvanzadas();
    });

    // Filtros
    this.elementosDOM.filtros.forEach(btn => {
      btn.addEventListener('click', () => {
        this.cambiarFiltro(btn.dataset.filtro);
      });
    });

    // Búsqueda
    this.elementosDOM.inputBusqueda.addEventListener('input', e => {
      this.buscarTareas(e.target.value);
    });

    this.elementosDOM.btnClearBusqueda.addEventListener('click', () => {
      this.limpiarBusqueda();
    });

    // Ordenamiento
    this.elementosDOM.selectOrdenamiento.addEventListener('change', e => {
      this.cambiarOrdenamiento(e.target.value);
    });

    // Botones de acción
    this.elementosDOM.btnTema.addEventListener('click', () => {
      this.toggleTema();
    });

    this.elementosDOM.btnStats.addEventListener('click', () => {
      this.mostrarEstadisticas();
    });

    this.elementosDOM.btnExport.addEventListener('click', () => {
      this.exportarTareas();
    });

    this.elementosDOM.btnLimpiarCompletadas.addEventListener('click', () => {
      this.limpiarCompletadas();
    });

    this.elementosDOM.btnNuevaTareaFab.addEventListener('click', () => {
      this.elementosDOM.inputNuevaTarea.focus();
    });

    // Delegación de eventos para tareas
    this.elementosDOM.listaTareas.addEventListener('click', e => {
      this.manejarClickTarea(e);
    });

    this.elementosDOM.listaTareas.addEventListener('dblclick', e => {
      this.manejarDobleClickTarea(e);
    });

    // Drag and drop
    this.configurarDragAndDrop();

    // Atajos de teclado
    document.addEventListener('keydown', e => {
      this.manejarAtajosTeclado(e);
    });

    // Cerrar modales
    this.elementosDOM.overlay.addEventListener('click', () => {
      this.cerrarModales();
    });

    // Escape para cerrar modales
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        this.cerrarModales();
      }
    });
  }

  // Agregar nueva tarea
  agregarTarea() {
    const texto = this.elementosDOM.inputNuevaTarea.value.trim();
    if (!texto) return;

    const opciones = {
      prioridad: this.elementosDOM.selectPrioridad.value,
      categoria: this.elementosDOM.inputCategoria.value.trim(),
      fechaLimite: this.elementosDOM.inputFecha.value || null,
    };

    const tarea = this.gestorTareas.crearTarea(texto, opciones);

    // Limpiar formulario
    this.elementosDOM.formNuevaTarea.reset();
    this.elementosDOM.selectPrioridad.value = 'media';
    this.ocultarOpcionesAvanzadas();

    this.actualizarInterfaz();
    this.estado.mostrarNotificacion('Tarea agregada exitosamente', 'exito');

    // Animar nueva tarea
    setTimeout(() => {
      const elementoTarea = document.querySelector(`[data-id="${tarea.id}"]`);
      if (elementoTarea) {
        elementoTarea.classList.add('animate-bounce');
      }
    }, 100);
  }

  // Toggle opciones avanzadas
  toggleOpcionesAvanzadas() {
    const opciones = this.elementosDOM.opcionesAvanzadas;
    const isVisible = opciones.classList.contains('active');

    if (isVisible) {
      this.ocultarOpcionesAvanzadas();
    } else {
      this.mostrarOpcionesAvanzadas();
    }
  }

  mostrarOpcionesAvanzadas() {
    this.elementosDOM.opcionesAvanzadas.classList.add('active');
    this.elementosDOM.btnOpciones.textContent = 'Ocultar opciones';
  }

  ocultarOpcionesAvanzadas() {
    this.elementosDOM.opcionesAvanzadas.classList.remove('active');
    this.elementosDOM.btnOpciones.innerHTML =
      '<i class="fas fa-cog"></i> Opciones avanzadas';
  }

  // Cambiar filtro
  cambiarFiltro(filtro) {
    this.estado.filtroActual = filtro;

    // Actualizar botones
    this.elementosDOM.filtros.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filtro === filtro);
    });

    this.actualizarInterfaz();
  }

  // Buscar tareas
  buscarTareas(termino) {
    // Debounce para evitar búsquedas excesivas
    clearTimeout(this.debounceTimers.busqueda);
    this.debounceTimers.busqueda = setTimeout(() => {
      this.estado.busquedaActual = termino.trim();
      this.actualizarInterfaz();
    }, 300);
  }

  // Limpiar búsqueda
  limpiarBusqueda() {
    this.elementosDOM.inputBusqueda.value = '';
    this.estado.busquedaActual = '';
    this.actualizarInterfaz();
  }

  // Cambiar ordenamiento
  cambiarOrdenamiento(ordenamiento) {
    this.estado.ordenamientoActual = ordenamiento;
    this.actualizarInterfaz();
  }

  // Toggle tema
  toggleTema() {
    this.estado.tema = this.estado.tema === 'claro' ? 'oscuro' : 'claro';
    this.estado.aplicarTema();
    this.estado.guardarDatos();
    this.estado.mostrarNotificacion(
      `Tema ${this.estado.tema} aplicado`,
      'info'
    );
  }

  // Manejar click en tarea
  manejarClickTarea(e) {
    const elementoTarea = e.target.closest('.tarea');
    if (!elementoTarea) return;

    const id = parseInt(elementoTarea.dataset.id);
    const tarea = this.estado.tareas.find(t => t.id === id);
    if (!tarea) return;

    // Checkbox
    if (e.target.matches('.tarea-checkbox')) {
      this.toggleCompletarTarea(id);
      return;
    }

    // Botones de acción
    if (e.target.matches('.btn-eliminar')) {
      this.confirmarEliminarTarea(id);
      return;
    }

    if (e.target.matches('.btn-editar')) {
      this.editarTarea(id);
      return;
    }

    if (e.target.matches('.btn-duplicar')) {
      this.duplicarTarea(id);
      return;
    }
  }

  // Manejar doble click en tarea
  manejarDobleClickTarea(e) {
    const elementoTarea = e.target.closest('.tarea');
    if (!elementoTarea) return;

    const id = parseInt(elementoTarea.dataset.id);
    this.editarTarea(id);
  }

  // Toggle completar tarea
  toggleCompletarTarea(id) {
    const tarea = this.estado.tareas.find(t => t.id === id);
    if (!tarea) return;

    this.gestorTareas.actualizarTarea(id, { completada: !tarea.completada });
    this.actualizarInterfaz();

    const mensaje = tarea.completada
      ? 'Tarea marcada como pendiente'
      : 'Tarea completada';
    this.estado.mostrarNotificacion(mensaje, 'exito');
  }

  // Confirmar eliminar tarea
  confirmarEliminarTarea(id) {
    const tarea = this.estado.tareas.find(t => t.id === id);
    if (!tarea) return;

    this.mostrarConfirmacion(
      `¿Estás seguro de que quieres eliminar la tarea "${tarea.texto}"?`,
      () => {
        this.eliminarTarea(id);
      }
    );
  }

  // Eliminar tarea
  eliminarTarea(id) {
    const tarea = this.gestorTareas.eliminarTarea(id);
    if (tarea) {
      this.actualizarInterfaz();
      this.estado.mostrarNotificacion('Tarea eliminada', 'info');
    }
  }

  // Editar tarea
  editarTarea(id) {
    const elementoTarea = document.querySelector(`[data-id="${id}"]`);
    if (!elementoTarea || this.tareasEnEdicion.has(id)) return;

    const tarea = this.estado.tareas.find(t => t.id === id);
    if (!tarea) return;

    this.tareasEnEdicion.add(id);
    elementoTarea.classList.add('editando');

    const textoElemento = elementoTarea.querySelector('.tarea-texto');
    const textoOriginal = tarea.texto;

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'tarea-input';
    input.value = textoOriginal;
    input.maxLength = 200;

    textoElemento.replaceWith(input);
    input.focus();
    input.select();

    const guardarEdicion = () => {
      const nuevoTexto = input.value.trim();
      if (nuevoTexto && nuevoTexto !== textoOriginal) {
        this.gestorTareas.actualizarTarea(id, { texto: nuevoTexto });
        this.estado.mostrarNotificacion('Tarea actualizada', 'exito');
      }
      this.cancelarEdicion(id);
    };

    const cancelarEdicion = () => {
      this.cancelarEdicion(id);
    };

    input.addEventListener('blur', guardarEdicion);
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        guardarEdicion();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        cancelarEdicion();
      }
    });
  }

  // Cancelar edición
  cancelarEdicion(id) {
    this.tareasEnEdicion.delete(id);
    this.actualizarInterfaz();
  }

  // Duplicar tarea
  duplicarTarea(id) {
    const nuevaTarea = this.gestorTareas.duplicarTarea(id);
    if (nuevaTarea) {
      this.actualizarInterfaz();
      this.estado.mostrarNotificacion('Tarea duplicada', 'exito');
    }
  }

  // Limpiar tareas completadas
  limpiarCompletadas() {
    const completadas = this.estado.tareas.filter(t => t.completada);
    if (completadas.length === 0) {
      this.estado.mostrarNotificacion(
        'No hay tareas completadas para limpiar',
        'info'
      );
      return;
    }

    this.mostrarConfirmacion(
      `¿Estás seguro de que quieres eliminar ${completadas.length} tarea(s) completada(s)?`,
      () => {
        const cantidad = this.gestorTareas.limpiarCompletadas();
        this.actualizarInterfaz();
        this.estado.mostrarNotificacion(
          `${cantidad} tareas eliminadas`,
          'info'
        );
      }
    );
  }

  // Mostrar confirmación
  mostrarConfirmacion(mensaje, onConfirmar) {
    const modal = this.elementosDOM.modalConfirmacion;
    const overlay = this.elementosDOM.overlay;
    const mensajeElemento = document.getElementById('modal-mensaje');
    const btnConfirmar = document.getElementById('btn-confirmar');
    const btnCancelar = document.getElementById('btn-cancelar');
    const btnClose = document.getElementById('btn-close-modal');

    mensajeElemento.textContent = mensaje;

    // Mostrar modal
    modal.classList.add('active');
    overlay.classList.add('active');

    // Eventos
    const cerrarModal = () => {
      modal.classList.remove('active');
      overlay.classList.remove('active');
      btnConfirmar.removeEventListener('click', confirmarHandler);
      btnCancelar.removeEventListener('click', cancelarHandler);
      btnClose.removeEventListener('click', cancelarHandler);
    };

    const confirmarHandler = () => {
      onConfirmar();
      cerrarModal();
    };

    const cancelarHandler = () => {
      cerrarModal();
    };

    btnConfirmar.addEventListener('click', confirmarHandler);
    btnCancelar.addEventListener('click', cancelarHandler);
    btnClose.addEventListener('click', cancelarHandler);
  }

  // Mostrar estadísticas
  mostrarEstadisticas() {
    const modal = this.elementosDOM.modalEstadisticas;
    const overlay = this.elementosDOM.overlay;
    const estadisticas = this.gestorTareas.obtenerEstadisticas();

    // Actualizar estadísticas generales
    document.getElementById('stat-total').textContent = estadisticas.total;
    document.getElementById('stat-completadas').textContent =
      estadisticas.completadas;
    document.getElementById('stat-pendientes').textContent =
      estadisticas.pendientes;
    document.getElementById(
      'stat-progreso'
    ).textContent = `${estadisticas.progreso}%`;

    // Estadísticas por categoría
    const categoriasContainer = document.getElementById(
      'stats-categorias-lista'
    );
    categoriasContainer.innerHTML = '';

    Object.entries(estadisticas.categorias).forEach(([categoria, datos]) => {
      const div = document.createElement('div');
      div.className = 'categoria-stat';
      div.innerHTML = `
                <span>${categoria}</span>
                <span>${datos.completadas}/${datos.total}</span>
            `;
      categoriasContainer.appendChild(div);
    });

    // Estadísticas por prioridad
    const prioridadesContainer = document.getElementById(
      'stats-prioridades-lista'
    );
    prioridadesContainer.innerHTML = '';

    Object.entries(estadisticas.prioridades).forEach(
      ([prioridad, cantidad]) => {
        const div = document.createElement('div');
        div.className = 'prioridad-stat';
        const icono =
          prioridad === 'alta' ? '🔴' : prioridad === 'media' ? '🟡' : '🟢';
        div.innerHTML = `
                <span>${icono} ${
          prioridad.charAt(0).toUpperCase() + prioridad.slice(1)
        }</span>
                <span>${cantidad}</span>
            `;
        prioridadesContainer.appendChild(div);
      }
    );

    // Mostrar modal
    modal.classList.add('active');
    overlay.classList.add('active');

    // Eventos para cerrar
    const cerrarModal = () => {
      modal.classList.remove('active');
      overlay.classList.remove('active');
    };

    document
      .getElementById('btn-close-stats')
      .addEventListener('click', cerrarModal);
    document
      .getElementById('btn-cerrar-stats')
      .addEventListener('click', cerrarModal);
  }

  // Exportar tareas
  exportarTareas() {
    const datos = {
      tareas: this.estado.tareas,
      fechaExportacion: new Date().toISOString(),
      version: '1.0',
    };

    const blob = new Blob([JSON.stringify(datos, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `tareas-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
    this.estado.mostrarNotificacion('Tareas exportadas exitosamente', 'exito');
  }

  // Configurar drag and drop
  configurarDragAndDrop() {
    this.elementosDOM.listaTareas.addEventListener('dragstart', e => {
      const tarea = e.target.closest('.tarea');
      if (!tarea) return;

      e.dataTransfer.setData('text/plain', tarea.dataset.id);
      e.dataTransfer.effectAllowed = 'move';
      tarea.classList.add('dragging');
    });

    this.elementosDOM.listaTareas.addEventListener('dragend', e => {
      const tarea = e.target.closest('.tarea');
      if (tarea) {
        tarea.classList.remove('dragging');
      }
    });

    this.elementosDOM.listaTareas.addEventListener('dragover', e => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    });

    this.elementosDOM.listaTareas.addEventListener('drop', e => {
      e.preventDefault();

      const idOrigen = parseInt(e.dataTransfer.getData('text/plain'));
      const tareaDestino = e.target.closest('.tarea');

      if (tareaDestino) {
        const idDestino = parseInt(tareaDestino.dataset.id);
        if (idOrigen !== idDestino) {
          this.gestorTareas.reordenarTareas(idOrigen, idDestino);
          this.actualizarInterfaz();
          this.estado.mostrarNotificacion('Tarea reordenada', 'info');
        }
      }
    });
  }

  // Manejar atajos de teclado
  manejarAtajosTeclado(e) {
    // Ctrl+N: Nueva tarea
    if (e.ctrlKey && e.key === 'n') {
      e.preventDefault();
      this.elementosDOM.inputNuevaTarea.focus();
    }

    // Ctrl+F: Buscar
    if (e.ctrlKey && e.key === 'f') {
      e.preventDefault();
      this.elementosDOM.inputBusqueda.focus();
    }

    // Ctrl+T: Cambiar tema
    if (e.ctrlKey && e.key === 't') {
      e.preventDefault();
      this.toggleTema();
    }

    // Ctrl+S: Exportar
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      this.exportarTareas();
    }

    // F1: Ayuda
    if (e.key === 'F1') {
      e.preventDefault();
      this.toggleAyuda();
    }
  }

  // Toggle ayuda
  toggleAyuda() {
    const ayuda = this.elementosDOM.atajosAyuda;
    ayuda.classList.toggle('active');

    if (ayuda.classList.contains('active')) {
      setTimeout(() => {
        ayuda.classList.remove('active');
      }, 5000);
    }
  }

  // Cerrar modales
  cerrarModales() {
    document.querySelectorAll('.modal.active').forEach(modal => {
      modal.classList.remove('active');
    });
    this.elementosDOM.overlay.classList.remove('active');
  }

  // Actualizar interfaz completa
  actualizarInterfaz() {
    this.actualizarListaTareas();
    this.actualizarContadores();
    this.actualizarEstadisticas();
    this.actualizarFiltros();
  }

  // Actualizar lista de tareas
  actualizarListaTareas() {
    const tareas = this.gestorTareas.obtenerTareasFiltradas();
    const container = this.elementosDOM.listaTareas;

    container.innerHTML = '';

    if (tareas.length === 0) {
      const mensaje = this.estado.busquedaActual
        ? this.elementosDOM.mensajeSinResultados
        : this.elementosDOM.mensajeVacio;
      mensaje.style.display = 'block';
      this.elementosDOM.estadisticas.style.display = 'none';
      return;
    }

    this.elementosDOM.mensajeVacio.style.display = 'none';
    this.elementosDOM.mensajeSinResultados.style.display = 'none';
    this.elementosDOM.estadisticas.style.display = 'block';

    tareas.forEach(tarea => {
      const li = this.crearElementoTarea(tarea);
      container.appendChild(li);
    });
  }

  // Crear elemento tarea
  crearElementoTarea(tarea) {
    const li = document.createElement('li');
    li.className = `tarea ${tarea.completada ? 'completada' : ''} prioridad-${
      tarea.prioridad
    }`;
    li.dataset.id = tarea.id;
    li.draggable = true;

    const fechaLimite = tarea.fechaLimite ? new Date(tarea.fechaLimite) : null;
    const hoy = new Date();
    let clasesFecha = '';

    if (fechaLimite) {
      const diferenciaDias = Math.ceil(
        (fechaLimite - hoy) / (1000 * 60 * 60 * 24)
      );
      if (diferenciaDias < 0) {
        clasesFecha = 'vencida';
      } else if (diferenciaDias <= 3) {
        clasesFecha = 'proximo';
      }
    }

    li.innerHTML = `
            <div class="tarea-checkbox ${
              tarea.completada ? 'checked' : ''
            }"></div>
            <div class="tarea-contenido">
                <div class="tarea-texto">${this.escaparHTML(tarea.texto)}</div>
                <div class="tarea-meta">
                    ${
                      tarea.categoria
                        ? `<span class="tarea-categoria">${this.escaparHTML(
                            tarea.categoria
                          )}</span>`
                        : ''
                    }
                    ${
                      fechaLimite
                        ? `<span class="tarea-fecha ${clasesFecha}">
                        <i class="fas fa-calendar"></i>
                        ${this.formatearFecha(fechaLimite)}
                    </span>`
                        : ''
                    }
                </div>
            </div>
            <div class="tarea-acciones">
                <button class="btn-accion btn-editar" title="Editar tarea">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-accion btn-duplicar" title="Duplicar tarea">
                    <i class="fas fa-copy"></i>
                </button>
                <button class="btn-accion btn-eliminar btn-peligro" title="Eliminar tarea">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

    return li;
  }

  // Actualizar contadores
  actualizarContadores() {
    const todas = this.estado.tareas.length;
    const completadas = this.estado.tareas.filter(t => t.completada).length;
    const pendientes = todas - completadas;

    if (this.elementosDOM.countTodas) {
      this.elementosDOM.countTodas.textContent = todas;
    }
    if (this.elementosDOM.countCompletadas) {
      this.elementosDOM.countCompletadas.textContent = completadas;
    }
    if (this.elementosDOM.countPendientes) {
      this.elementosDOM.countPendientes.textContent = pendientes;
    }
  }

  // Actualizar estadísticas
  actualizarEstadisticas() {
    const estadisticas = this.gestorTareas.obtenerEstadisticas();

    if (this.elementosDOM.progresoCompletadas) {
      this.elementosDOM.progresoCompletadas.textContent =
        estadisticas.completadas;
    }
    if (this.elementosDOM.progresoTotal) {
      this.elementosDOM.progresoTotal.textContent = estadisticas.total;
    }
    if (this.elementosDOM.progresoFill) {
      this.elementosDOM.progresoFill.style.width = `${estadisticas.progreso}%`;
    }
  }

  // Actualizar filtros
  actualizarFiltros() {
    this.elementosDOM.filtros.forEach(btn => {
      btn.classList.toggle(
        'active',
        btn.dataset.filtro === this.estado.filtroActual
      );
    });

    this.elementosDOM.selectOrdenamiento.value = this.estado.ordenamientoActual;
    this.elementosDOM.inputBusqueda.value = this.estado.busquedaActual;
  }

  // Utilidades
  escaparHTML(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
  }

  formatearFecha(fecha) {
    return fecha.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}

// ================================
// INICIALIZACIÓN DE LA APLICACIÓN
// ================================

class AplicacionTareas {
  constructor() {
    this.estado = new EstadoApp();
    this.gestorTareas = new GestorTareas(this.estado);
    this.interfaz = new InterfazUsuario(this.estado, this.gestorTareas);

    this.configurarEventosGlobales();
    this.inicializarNotificaciones();

    console.log('✅ Aplicación Lista de Tareas iniciada correctamente');
  }

  configurarEventosGlobales() {
    // Guardar antes de cerrar
    window.addEventListener('beforeunload', () => {
      this.estado.guardarDatos();
    });

    // Manejar errores globales
    window.addEventListener('error', e => {
      console.error('Error global:', e.error);
      this.estado.mostrarNotificacion(
        'Ha ocurrido un error inesperado',
        'error'
      );
    });

    // Manejar promesas rechazadas
    window.addEventListener('unhandledrejection', e => {
      console.error('Promesa rechazada:', e.reason);
      this.estado.mostrarNotificacion('Error en operación asíncrona', 'error');
    });
  }

  inicializarNotificaciones() {
    // Verificar si hay tareas próximas a vencer
    const tareasProximas = this.estado.tareas.filter(tarea => {
      if (tarea.completada || !tarea.fechaLimite) return false;

      const fechaLimite = new Date(tarea.fechaLimite);
      const hoy = new Date();
      const diferenciaDias = Math.ceil(
        (fechaLimite - hoy) / (1000 * 60 * 60 * 24)
      );

      return diferenciaDias <= 3 && diferenciaDias >= 0;
    });

    if (tareasProximas.length > 0) {
      setTimeout(() => {
        this.estado.mostrarNotificacion(
          `Tienes ${tareasProximas.length} tarea(s) próxima(s) a vencer`,
          'advertencia',
          5000
        );
      }, 1000);
    }

    // Bienvenida
    if (this.estado.tareas.length === 0) {
      setTimeout(() => {
        this.estado.mostrarNotificacion(
          '¡Bienvenido! Agrega tu primera tarea',
          'info',
          3000
        );
      }, 500);
    }
  }
}

// ================================
// INICIALIZACIÓN CUANDO EL DOM ESTÉ LISTO
// ================================

document.addEventListener('DOMContentLoaded', () => {
  // Inicializar aplicación
  window.appTareas = new AplicacionTareas();

  // Mostrar mensaje de bienvenida
  console.log(`
    🎯 Lista de Tareas - Día 6: DOM y Eventos
    ==========================================
    
    Aplicación completamente funcional que demuestra:
    ✅ Manipulación avanzada del DOM
    ✅ Manejo completo de eventos
    ✅ Validación robusta de formularios
    ✅ Persistencia de datos local
    ✅ Interfaz de usuario interactiva
    ✅ Responsive design
    ✅ Accesibilidad web
    ✅ Optimización de rendimiento
    
    🚀 ¡Listo para usar!
    `);
});

// ================================
// FUNCIONES GLOBALES PARA DEBUGGING
// ================================

// Funciones expuestas para debugging y testing
window.debugTareas = {
  obtenerEstado: () => window.appTareas.estado,
  obtenerTareas: () => window.appTareas.estado.tareas,
  obtenerEstadisticas: () =>
    window.appTareas.gestorTareas.obtenerEstadisticas(),
  limpiarDatos: () => {
    localStorage.removeItem('lista-tareas-datos');
    location.reload();
  },
  exportarDatos: () => {
    console.log(JSON.stringify(window.appTareas.estado.tareas, null, 2));
  },
};

// Service Worker para PWA (opcional)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(registration => {
        console.log('SW registrado: ', registration);
      })
      .catch(registrationError => {
        console.log('SW falló: ', registrationError);
      });
  });
}
