/**
 * Día 6: DOM y Eventos - Ejercicio 6
 * Tema: Eventos avanzados y propagación
 * Dificultad: Intermedia-Avanzada
 * Tiempo estimado: 35 minutos
 */

// ================================
// EVENTOS AVANZADOS Y PROPAGACIÓN
// ================================

console.log('=== Ejercicio 6: Eventos avanzados y propagación ===');

// 1. Propagación de eventos (bubbling y capturing)
function demostrarPropagacion() {
  console.log('\n1. Demostrando propagación de eventos:');

  const contenedorExterno = document.querySelector('.contenedor-externo');
  const contenedorInterno = document.querySelector('.contenedor-interno');
  const botonPropagacion = document.querySelector('#btn-propagacion');

  if (contenedorExterno && contenedorInterno && botonPropagacion) {
    // Fase de captura (capturing)
    contenedorExterno.addEventListener(
      'click',
      function (e) {
        console.log('📥 Contenedor externo - Fase de captura');

        // Mostrar información del evento
        const info = document.querySelector('#info-propagacion');
        if (info) {
          info.innerHTML += '<div>📥 Contenedor externo - Captura</div>';
        }
      },
      true
    ); // true = capturing phase

    contenedorInterno.addEventListener(
      'click',
      function (e) {
        console.log('📥 Contenedor interno - Fase de captura');

        const info = document.querySelector('#info-propagacion');
        if (info) {
          info.innerHTML += '<div>📥 Contenedor interno - Captura</div>';
        }
      },
      true
    );

    // Fase de burbujeo (bubbling)
    botonPropagacion.addEventListener('click', function (e) {
      console.log('🎯 Botón - Evento target');

      const info = document.querySelector('#info-propagacion');
      if (info) {
        info.innerHTML += '<div>🎯 Botón - Target</div>';
      }

      // Opcional: detener propagación
      // e.stopPropagation();
    });

    contenedorInterno.addEventListener('click', function (e) {
      console.log('📤 Contenedor interno - Fase de burbujeo');

      const info = document.querySelector('#info-propagacion');
      if (info) {
        info.innerHTML += '<div>📤 Contenedor interno - Burbujeo</div>';
      }
    });

    contenedorExterno.addEventListener('click', function (e) {
      console.log('📤 Contenedor externo - Fase de burbujeo');

      const info = document.querySelector('#info-propagacion');
      if (info) {
        info.innerHTML += '<div>📤 Contenedor externo - Burbujeo</div>';
      }
    });

    // Botón para limpiar log
    const botonLimpiar = document.querySelector('#btn-limpiar-log');
    if (botonLimpiar) {
      botonLimpiar.addEventListener('click', function (e) {
        e.stopPropagation();
        const info = document.querySelector('#info-propagacion');
        if (info) {
          info.innerHTML = '';
        }
      });
    }
  }

  console.log('Propagación de eventos configurada');
}

// 2. Delegación de eventos
function configurarDelegacion() {
  console.log('\n2. Configurando delegación de eventos:');

  const contenedorLista = document.querySelector('#lista-dinamica');
  if (contenedorLista) {
    // Delegación: Un solo listener para todos los elementos
    contenedorLista.addEventListener('click', function (e) {
      const elemento = e.target;

      // Verificar que sea un elemento de lista
      if (elemento.classList.contains('item-lista')) {
        console.log(`Item clickeado: ${elemento.textContent}`);

        // Alternar estado activo
        elemento.classList.toggle('activo');

        // Efecto visual
        elemento.style.backgroundColor = elemento.classList.contains('activo')
          ? '#007bff'
          : '';
        elemento.style.color = elemento.classList.contains('activo')
          ? 'white'
          : '';
      }

      // Manejar botón eliminar
      if (elemento.classList.contains('btn-eliminar')) {
        console.log('Botón eliminar clickeado');
        const item = elemento.closest('.item-lista');
        if (item) {
          item.remove();
          console.log('Item eliminado');
        }
      }

      // Manejar botón editar
      if (elemento.classList.contains('btn-editar')) {
        console.log('Botón editar clickeado');
        const item = elemento.closest('.item-lista');
        if (item) {
          const nuevoTexto = prompt('Nuevo texto:', item.textContent);
          if (nuevoTexto) {
            item.firstChild.textContent = nuevoTexto;
            console.log(`Item editado: ${nuevoTexto}`);
          }
        }
      }
    });

    // Función para añadir nuevos elementos
    window.añadirItemLista = function (texto) {
      const item = document.createElement('div');
      item.className = 'item-lista';
      item.innerHTML = `
                <span>${texto}</span>
                <button class="btn-editar">Editar</button>
                <button class="btn-eliminar">Eliminar</button>
            `;
      contenedorLista.appendChild(item);
      console.log(`Nuevo item añadido: ${texto}`);
    };

    // Añadir algunos elementos iniciales
    ['Elemento 1', 'Elemento 2', 'Elemento 3'].forEach(texto => {
      window.añadirItemLista(texto);
    });
  }

  console.log('Delegación de eventos configurada');
}

// 3. Eventos personalizados
function crearEventosPersonalizados() {
  console.log('\n3. Creando eventos personalizados:');

  // Definir eventos personalizados
  const eventos = {
    usuarioAutenticado: new CustomEvent('usuarioAutenticado', {
      detail: {
        usuario: 'Juan Pérez',
        timestamp: Date.now(),
        permisos: ['read', 'write'],
      },
    }),

    datosActualizados: new CustomEvent('datosActualizados', {
      detail: {
        tabla: 'usuarios',
        accion: 'actualizar',
        cantidad: 5,
      },
    }),

    errorRed: new CustomEvent('errorRed', {
      detail: {
        mensaje: 'Error de conexión',
        codigo: 500,
        reintentos: 3,
      },
    }),
  };

  // Escuchar eventos personalizados
  document.addEventListener('usuarioAutenticado', function (e) {
    console.log('✅ Usuario autenticado:', e.detail);

    // Actualizar UI
    const infoUsuario = document.querySelector('#info-usuario');
    if (infoUsuario) {
      infoUsuario.innerHTML = `
                <strong>Usuario:</strong> ${e.detail.usuario}<br>
                <strong>Permisos:</strong> ${e.detail.permisos.join(', ')}
            `;
    }

    // Mostrar mensaje de bienvenida
    mostrarNotificacion(`¡Bienvenido ${e.detail.usuario}!`, 'success');
  });

  document.addEventListener('datosActualizados', function (e) {
    console.log('🔄 Datos actualizados:', e.detail);

    mostrarNotificacion(
      `${e.detail.cantidad} registros actualizados en ${e.detail.tabla}`,
      'info'
    );
  });

  document.addEventListener('errorRed', function (e) {
    console.log('❌ Error de red:', e.detail);

    mostrarNotificacion(
      `Error: ${e.detail.mensaje} (Código: ${e.detail.codigo})`,
      'error'
    );
  });

  // Función para disparar eventos
  window.dispararEvento = function (tipoEvento) {
    if (eventos[tipoEvento]) {
      document.dispatchEvent(eventos[tipoEvento]);
    }
  };

  // Configurar botones para disparar eventos
  const botones = document.querySelectorAll('[data-evento]');
  botones.forEach(boton => {
    boton.addEventListener('click', function (e) {
      const tipoEvento = this.dataset.evento;
      window.dispararEvento(tipoEvento);
    });
  });

  console.log('Eventos personalizados configurados');
}

// 4. Eventos de medios y touch
function configurarEventosAvanzados() {
  console.log('\n4. Configurando eventos avanzados:');

  // Eventos de medios
  const video = document.querySelector('#video-ejemplo');
  if (video) {
    video.addEventListener('loadstart', () =>
      console.log('🎥 Video: Iniciando carga')
    );
    video.addEventListener('loadedmetadata', () =>
      console.log('🎥 Video: Metadatos cargados')
    );
    video.addEventListener('canplay', () =>
      console.log('🎥 Video: Listo para reproducir')
    );
    video.addEventListener('play', () =>
      console.log('🎥 Video: Reproduciendo')
    );
    video.addEventListener('pause', () => console.log('🎥 Video: Pausado'));
    video.addEventListener('ended', () => console.log('🎥 Video: Terminado'));

    video.addEventListener('timeupdate', function (e) {
      const progreso = (this.currentTime / this.duration) * 100;
      const barraProgreso = document.querySelector('#progreso-video');
      if (barraProgreso) {
        barraProgreso.style.width = `${progreso}%`;
      }
    });
  }

  // Eventos touch para dispositivos móviles
  const areaTouch = document.querySelector('#area-touch');
  if (areaTouch) {
    let touchInicial = null;

    areaTouch.addEventListener('touchstart', function (e) {
      console.log('👆 Touch start');
      touchInicial = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };

      this.style.backgroundColor = '#e9ecef';
    });

    areaTouch.addEventListener('touchmove', function (e) {
      e.preventDefault(); // Prevenir scroll

      if (touchInicial) {
        const touchActual = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };

        const deltaX = touchActual.x - touchInicial.x;
        const deltaY = touchActual.y - touchInicial.y;

        console.log(`👆 Touch move: ${deltaX}, ${deltaY}`);

        // Cambiar color basado en dirección
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          this.style.backgroundColor = deltaX > 0 ? '#d4edda' : '#f8d7da';
        } else {
          this.style.backgroundColor = deltaY > 0 ? '#fff3cd' : '#d1ecf1';
        }
      }
    });

    areaTouch.addEventListener('touchend', function (e) {
      console.log('👆 Touch end');
      this.style.backgroundColor = '';
      touchInicial = null;
    });
  }

  // Eventos de intersección (Intersection Observer)
  const elementosObservados = document.querySelectorAll(
    '.observar-interseccion'
  );
  if (elementosObservados.length > 0) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            console.log(`👁️ Elemento visible: ${entry.target.id}`);
            entry.target.style.backgroundColor = '#d4edda';
            entry.target.style.transform = 'scale(1.05)';
          } else {
            console.log(`👁️ Elemento oculto: ${entry.target.id}`);
            entry.target.style.backgroundColor = '';
            entry.target.style.transform = 'scale(1)';
          }
        });
      },
      {
        threshold: 0.5, // 50% del elemento visible
      }
    );

    elementosObservados.forEach(elemento => {
      observer.observe(elemento);
    });
  }

  console.log('Eventos avanzados configurados');
}

// ================================
// EJERCICIOS PRÁCTICOS
// ================================

console.log('\n=== EJERCICIOS PRÁCTICOS ===');

// Ejercicio 1: Crear un sistema de arrastrar y soltar
function crearDragAndDrop() {
  console.log('\n--- Configurando drag and drop ---');

  const elementosArrastrables = document.querySelectorAll('.arrastrable');
  const zonasDestino = document.querySelectorAll('.zona-destino');

  elementosArrastrables.forEach(elemento => {
    elemento.addEventListener('dragstart', function (e) {
      console.log(`🚀 Arrastrando: ${this.textContent}`);

      e.dataTransfer.setData('text/plain', this.textContent);
      e.dataTransfer.setData('text/html', this.outerHTML);
      e.dataTransfer.setData('elemento-id', this.id);

      this.style.opacity = '0.5';
    });

    elemento.addEventListener('dragend', function (e) {
      console.log(`🏁 Terminó arrastre: ${this.textContent}`);
      this.style.opacity = '1';
    });
  });

  zonasDestino.forEach(zona => {
    zona.addEventListener('dragover', function (e) {
      e.preventDefault(); // Permitir drop
      this.style.backgroundColor = '#e9ecef';
    });

    zona.addEventListener('dragleave', function (e) {
      this.style.backgroundColor = '';
    });

    zona.addEventListener('drop', function (e) {
      e.preventDefault();

      const textoElemento = e.dataTransfer.getData('text/plain');
      const htmlElemento = e.dataTransfer.getData('text/html');
      const elementoId = e.dataTransfer.getData('elemento-id');

      console.log(`📦 Elemento soltado: ${textoElemento}`);

      // Crear nuevo elemento o mover existente
      const elementoOriginal = document.getElementById(elementoId);
      if (elementoOriginal) {
        this.appendChild(elementoOriginal);
      } else {
        this.innerHTML += htmlElemento;
      }

      this.style.backgroundColor = '';

      // Disparar evento personalizado
      const eventoSoltar = new CustomEvent('elementoSoltado', {
        detail: {
          elemento: textoElemento,
          zona: this.id,
          timestamp: Date.now(),
        },
      });

      document.dispatchEvent(eventoSoltar);
    });
  });

  // Escuchar evento personalizado
  document.addEventListener('elementoSoltado', function (e) {
    console.log('✅ Elemento soltado exitosamente:', e.detail);
    mostrarNotificacion(
      `"${e.detail.elemento}" movido a ${e.detail.zona}`,
      'success'
    );
  });
}

// Ejercicio 2: Crear un sistema de gestos
function crearSistemaGestos() {
  console.log('\n--- Configurando sistema de gestos ---');

  const areaGestos = document.querySelector('#area-gestos');
  if (!areaGestos) return;

  let puntoInicial = null;
  let tiempoInicial = null;

  // Eventos de mouse
  areaGestos.addEventListener('mousedown', function (e) {
    puntoInicial = { x: e.clientX, y: e.clientY };
    tiempoInicial = Date.now();

    console.log('🖱️ Gesto iniciado');
  });

  areaGestos.addEventListener('mouseup', function (e) {
    if (!puntoInicial) return;

    const puntoFinal = { x: e.clientX, y: e.clientY };
    const tiempoFinal = Date.now();

    const deltaX = puntoFinal.x - puntoInicial.x;
    const deltaY = puntoFinal.y - puntoInicial.y;
    const distancia = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const duracion = tiempoFinal - tiempoInicial;

    console.log(
      `🖱️ Gesto completado: distancia=${distancia}, duración=${duracion}ms`
    );

    // Interpretar gesto
    if (distancia < 10 && duracion < 200) {
      console.log('👆 Gesto: Toque rápido');
      this.style.backgroundColor = '#d4edda';
    } else if (distancia < 10 && duracion > 500) {
      console.log('👆 Gesto: Toque largo');
      this.style.backgroundColor = '#f8d7da';
    } else if (distancia > 50) {
      const angulo = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;

      if (angulo > -45 && angulo < 45) {
        console.log('👉 Gesto: Deslizar derecha');
        this.style.backgroundColor = '#fff3cd';
      } else if (angulo > 45 && angulo < 135) {
        console.log('👇 Gesto: Deslizar abajo');
        this.style.backgroundColor = '#d1ecf1';
      } else if (angulo > 135 || angulo < -135) {
        console.log('👈 Gesto: Deslizar izquierda');
        this.style.backgroundColor = '#e2e3e5';
      } else {
        console.log('👆 Gesto: Deslizar arriba');
        this.style.backgroundColor = '#d0d1e5';
      }
    }

    // Limpiar después de 1 segundo
    setTimeout(() => {
      this.style.backgroundColor = '';
    }, 1000);

    puntoInicial = null;
    tiempoInicial = null;
  });
}

// Ejercicio 3: Crear un sistema de notificaciones avanzado
function crearSistemaNotificaciones() {
  console.log('\n--- Configurando sistema de notificaciones ---');

  const contenedorNotificaciones = document.createElement('div');
  contenedorNotificaciones.id = 'contenedor-notificaciones';
  contenedorNotificaciones.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        max-width: 300px;
    `;

  document.body.appendChild(contenedorNotificaciones);

  window.mostrarNotificacion = function (
    mensaje,
    tipo = 'info',
    duracion = 5000
  ) {
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion notificacion-${tipo}`;

    const colores = {
      info: '#d1ecf1',
      success: '#d4edda',
      warning: '#fff3cd',
      error: '#f8d7da',
    };

    notificacion.style.cssText = `
            background-color: ${colores[tipo]};
            border: 1px solid ${colores[tipo]};
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            animation: slideIn 0.3s ease-out;
            cursor: pointer;
        `;

    notificacion.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span>${mensaje}</span>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: none;
                    border: none;
                    font-size: 18px;
                    cursor: pointer;
                    color: #666;
                ">×</button>
            </div>
        `;

    // Añadir animación CSS
    if (!document.getElementById('notificaciones-css')) {
      const style = document.createElement('style');
      style.id = 'notificaciones-css';
      style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
      document.head.appendChild(style);
    }

    contenedorNotificaciones.appendChild(notificacion);

    // Auto-eliminar
    setTimeout(() => {
      if (notificacion.parentNode) {
        notificacion.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
          notificacion.remove();
        }, 300);
      }
    }, duracion);

    console.log(`Notificación mostrada: ${mensaje} (${tipo})`);
  };
}

// ================================
// FUNCIONES DE UTILIDAD
// ================================

// Función para crear observador de mutaciones
function crearObservadorMutaciones() {
  const observer = new MutationObserver(function (mutaciones) {
    mutaciones.forEach(mutacion => {
      if (mutacion.type === 'childList') {
        console.log(
          '🔄 Nodos añadidos/eliminados:',
          mutacion.addedNodes,
          mutacion.removedNodes
        );
      } else if (mutacion.type === 'attributes') {
        console.log(
          '🔄 Atributo cambiado:',
          mutacion.attributeName,
          mutacion.target
        );
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeOldValue: true,
  });

  return observer;
}

// Función para manejar errores globales
function configurarManejadorErrores() {
  window.addEventListener('error', function (e) {
    console.error('❌ Error global:', e.error);
    mostrarNotificacion(`Error: ${e.message}`, 'error');
  });

  window.addEventListener('unhandledrejection', function (e) {
    console.error('❌ Promesa rechazada:', e.reason);
    mostrarNotificacion(`Error en promesa: ${e.reason}`, 'error');
  });
}

// ================================
// EJECUCIÓN DE EJERCICIOS
// ================================

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function () {
  console.log('\n🚀 DOM listo, configurando eventos avanzados...');

  // Configurar eventos avanzados
  demostrarPropagacion();
  configurarDelegacion();
  crearEventosPersonalizados();
  configurarEventosAvanzados();

  // Ejercicios prácticos
  crearDragAndDrop();
  crearSistemaGestos();
  crearSistemaNotificaciones();

  // Utilidades
  crearObservadorMutaciones();
  configurarManejadorErrores();

  console.log('\n✅ Eventos avanzados configurados!');
});

// ================================
// RETOS ADICIONALES
// ================================

/**
 * RETO 1: Crear un sistema de atajos de teclado contextual
 */
function crearAtajosContextuales() {
  const contextos = {
    formulario: {
      'ctrl+s': () => console.log('Guardar formulario'),
      'ctrl+r': () => console.log('Reiniciar formulario'),
      escape: () => console.log('Cancelar formulario'),
    },
    tabla: {
      'ctrl+a': () => console.log('Seleccionar todas las filas'),
      delete: () => console.log('Eliminar filas seleccionadas'),
      f2: () => console.log('Editar celda'),
    },
  };

  let contextoActual = null;

  document.addEventListener('focusin', function (e) {
    const elemento = e.target;
    if (elemento.closest('form')) {
      contextoActual = 'formulario';
    } else if (elemento.closest('table')) {
      contextoActual = 'tabla';
    } else {
      contextoActual = null;
    }
  });

  document.addEventListener('keydown', function (e) {
    if (!contextoActual) return;

    const atajos = contextos[contextoActual];
    const tecla = `${e.ctrlKey ? 'ctrl+' : ''}${e.key.toLowerCase()}`;

    if (atajos[tecla]) {
      e.preventDefault();
      atajos[tecla]();
    }
  });
}

/**
 * RETO 2: Crear un sistema de eventos de rendimiento
 */
function monitorearRendimiento() {
  const observer = new PerformanceObserver(function (lista) {
    lista.getEntries().forEach(entrada => {
      console.log('📊 Métrica de rendimiento:', entrada.name, entrada.duration);
    });
  });

  observer.observe({ entryTypes: ['measure', 'navigation'] });

  // Crear medidas personalizadas
  performance.mark('inicio-operacion');

  setTimeout(() => {
    performance.mark('fin-operacion');
    performance.measure(
      'operacion-completa',
      'inicio-operacion',
      'fin-operacion'
    );
  }, 1000);
}

/**
 * RETO 3: Crear un sistema de eventos de visibilidad
 */
function configurarVisibilidad() {
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      console.log('🙈 Página oculta');
      // Pausar animaciones, timers, etc.
    } else {
      console.log('👁️ Página visible');
      // Reanudar operaciones
    }
  });

  window.addEventListener('focus', function () {
    console.log('🎯 Ventana enfocada');
  });

  window.addEventListener('blur', function () {
    console.log('😴 Ventana desenfocada');
  });
}

// Ejemplos de uso de los retos:
// crearAtajosContextuales();
// monitorearRendimiento();
// configurarVisibilidad();
