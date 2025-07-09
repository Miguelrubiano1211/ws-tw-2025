/**
 * Día 6: DOM y Eventos - Ejercicio 5
 * Tema: Eventos básicos del DOM
 * Dificultad: Básica-Intermedia
 * Tiempo estimado: 25 minutos
 */

// ================================
// EVENTOS BÁSICOS DEL DOM
// ================================

console.log('=== Ejercicio 5: Eventos básicos del DOM ===');

// 1. Eventos de mouse
function configurarEventosMouse() {
  console.log('\n1. Configurando eventos de mouse:');

  // Click simple
  const botonClick = document.querySelector('#btn-click');
  if (botonClick) {
    botonClick.addEventListener('click', function (e) {
      console.log('Botón clickeado');
      this.textContent = 'Clickeado!';
      this.style.backgroundColor = '#28a745';
    });
  }

  // Doble click
  const botonDobleClick = document.querySelector('#btn-doble-click');
  if (botonDobleClick) {
    botonDobleClick.addEventListener('dblclick', function (e) {
      console.log('Doble click detectado');
      this.textContent = 'Doble Click!';
      this.style.backgroundColor = '#dc3545';
    });
  }

  // Mouse enter y leave
  const tarjetaHover = document.querySelector('.tarjeta-hover');
  if (tarjetaHover) {
    tarjetaHover.addEventListener('mouseenter', function (e) {
      console.log('Mouse entró en la tarjeta');
      this.style.backgroundColor = '#e9ecef';
      this.style.transform = 'scale(1.05)';
    });

    tarjetaHover.addEventListener('mouseleave', function (e) {
      console.log('Mouse salió de la tarjeta');
      this.style.backgroundColor = '';
      this.style.transform = 'scale(1)';
    });
  }

  // Mouse down y up
  const botonPresionar = document.querySelector('#btn-presionar');
  if (botonPresionar) {
    botonPresionar.addEventListener('mousedown', function (e) {
      console.log('Botón presionado');
      this.style.backgroundColor = '#6c757d';
      this.textContent = 'Presionado';
    });

    botonPresionar.addEventListener('mouseup', function (e) {
      console.log('Botón liberado');
      this.style.backgroundColor = '#007bff';
      this.textContent = 'Liberado';
    });
  }

  console.log('Eventos de mouse configurados');
}

// 2. Eventos de teclado
function configurarEventosTeclado() {
  console.log('\n2. Configurando eventos de teclado:');

  // Keydown
  const inputTeclado = document.querySelector('#input-teclado');
  if (inputTeclado) {
    inputTeclado.addEventListener('keydown', function (e) {
      console.log(`Tecla presionada: ${e.key} (Código: ${e.keyCode})`);

      // Prevenir ciertos caracteres
      if (e.key === 'Enter') {
        e.preventDefault();
        console.log('Enter bloqueado');
      }

      // Atajos de teclado
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        console.log('Ctrl+S detectado - Guardando...');
        alert('Guardado simulado');
      }
    });

    // Keyup
    inputTeclado.addEventListener('keyup', function (e) {
      console.log(`Tecla liberada: ${e.key}`);

      // Mostrar longitud del texto
      const contador = document.querySelector('#contador-caracteres');
      if (contador) {
        contador.textContent = `Caracteres: ${this.value.length}`;
      }
    });
  }

  // Evento global de teclado
  document.addEventListener('keydown', function (e) {
    // Detectar teclas especiales
    if (e.key === 'Escape') {
      console.log('Escape presionado - Cerrando modales');
      cerrarTodosLosModales();
    }

    if (e.key === 'F1') {
      e.preventDefault();
      console.log('F1 presionado - Mostrando ayuda');
      mostrarAyuda();
    }
  });

  console.log('Eventos de teclado configurados');
}

// 3. Eventos de formulario
function configurarEventosFormulario() {
  console.log('\n3. Configurando eventos de formulario:');

  const formulario = document.querySelector('#formulario-ejemplo');
  if (formulario) {
    // Submit
    formulario.addEventListener('submit', function (e) {
      e.preventDefault();
      console.log('Formulario enviado');

      // Obtener datos del formulario
      const formData = new FormData(this);
      const datos = {};

      formData.forEach((value, key) => {
        datos[key] = value;
      });

      console.log('Datos del formulario:', datos);

      // Simular envío
      mostrarMensaje('Formulario enviado exitosamente', 'success');
    });

    // Reset
    formulario.addEventListener('reset', function (e) {
      console.log('Formulario reiniciado');
      mostrarMensaje('Formulario reiniciado', 'info');
    });
  }

  // Eventos de inputs
  const inputs = document.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    // Focus
    input.addEventListener('focus', function (e) {
      console.log(`Input "${this.name}" enfocado`);
      this.style.boxShadow = '0 0 5px rgba(0,123,255,0.5)';
    });

    // Blur
    input.addEventListener('blur', function (e) {
      console.log(`Input "${this.name}" desenfocado`);
      this.style.boxShadow = '';

      // Validación básica
      if (this.required && !this.value) {
        this.style.borderColor = '#dc3545';
        mostrarMensaje(`${this.name} es requerido`, 'error');
      } else {
        this.style.borderColor = '';
      }
    });

    // Change
    input.addEventListener('change', function (e) {
      console.log(`Input "${this.name}" cambió a: ${this.value}`);
    });

    // Input (para cambios en tiempo real)
    input.addEventListener('input', function (e) {
      console.log(`Input en tiempo real: ${this.value}`);
    });
  });

  console.log('Eventos de formulario configurados');
}

// 4. Eventos de ventana
function configurarEventosVentana() {
  console.log('\n4. Configurando eventos de ventana:');

  // Load
  window.addEventListener('load', function (e) {
    console.log('Ventana completamente cargada');
    mostrarMensaje('Página cargada completamente', 'success');
  });

  // Resize
  window.addEventListener('resize', function (e) {
    console.log(
      `Ventana redimensionada: ${window.innerWidth}x${window.innerHeight}`
    );

    // Actualizar información de tamaño
    const infoTamaño = document.querySelector('#info-tamaño');
    if (infoTamaño) {
      infoTamaño.textContent = `${window.innerWidth}x${window.innerHeight}`;
    }
  });

  // Scroll
  window.addEventListener('scroll', function (e) {
    const scrollY = window.scrollY;
    console.log(`Scroll vertical: ${scrollY}px`);

    // Efecto de header fijo
    const header = document.querySelector('.header');
    if (header) {
      if (scrollY > 100) {
        header.classList.add('fixed-header');
      } else {
        header.classList.remove('fixed-header');
      }
    }

    // Mostrar progreso de scroll
    const progreso =
      (scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    const barraProgreso = document.querySelector('.barra-progreso');
    if (barraProgreso) {
      barraProgreso.style.width = `${progreso}%`;
    }
  });

  // Beforeunload
  window.addEventListener('beforeunload', function (e) {
    console.log('Usuario intentando salir de la página');
    e.preventDefault();
    e.returnValue = '¿Estás seguro de que quieres salir?';
  });

  console.log('Eventos de ventana configurados');
}

// ================================
// EJERCICIOS PRÁCTICOS
// ================================

console.log('\n=== EJERCICIOS PRÁCTICOS ===');

// Ejercicio 1: Contador de clicks
function crearContadorClicks() {
  console.log('\n--- Creando contador de clicks ---');

  let contador = 0;
  const botonContador = document.querySelector('#btn-contador');
  const displayContador = document.querySelector('#display-contador');

  if (botonContador && displayContador) {
    botonContador.addEventListener('click', function (e) {
      contador++;
      displayContador.textContent = contador;

      // Cambiar color según el número
      if (contador % 10 === 0) {
        this.style.backgroundColor = '#28a745';
        mostrarMensaje(`¡${contador} clicks!`, 'success');
      } else if (contador % 5 === 0) {
        this.style.backgroundColor = '#ffc107';
      } else {
        this.style.backgroundColor = '#007bff';
      }

      console.log(`Contador: ${contador}`);
    });

    // Botón reset
    const botonReset = document.querySelector('#btn-reset-contador');
    if (botonReset) {
      botonReset.addEventListener('click', function (e) {
        contador = 0;
        displayContador.textContent = contador;
        botonContador.style.backgroundColor = '#007bff';
        console.log('Contador reiniciado');
      });
    }
  }
}

// Ejercicio 2: Validación de formulario en tiempo real
function validacionTiempoReal() {
  console.log('\n--- Configurando validación en tiempo real ---');

  const camposValidacion = {
    email: {
      patron: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      mensaje: 'Ingresa un email válido',
    },
    telefono: {
      patron: /^[0-9]{10}$/,
      mensaje: 'Ingresa un teléfono de 10 dígitos',
    },
    password: {
      patron: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
      mensaje: 'Mínimo 8 caracteres, una mayúscula, una minúscula y un número',
    },
  };

  Object.keys(camposValidacion).forEach(campo => {
    const input = document.querySelector(`#${campo}`);
    if (input) {
      input.addEventListener('input', function (e) {
        const valor = this.value;
        const config = camposValidacion[campo];
        const esValido = config.patron.test(valor);

        // Aplicar estilos
        if (valor.length > 0) {
          if (esValido) {
            this.style.borderColor = '#28a745';
            this.style.backgroundColor = '#d4edda';
          } else {
            this.style.borderColor = '#dc3545';
            this.style.backgroundColor = '#f8d7da';
          }
        } else {
          this.style.borderColor = '';
          this.style.backgroundColor = '';
        }

        // Mostrar mensaje
        const mensaje = document.querySelector(`#mensaje-${campo}`);
        if (mensaje) {
          if (valor.length > 0 && !esValido) {
            mensaje.textContent = config.mensaje;
            mensaje.style.color = '#dc3545';
          } else {
            mensaje.textContent = '';
          }
        }

        console.log(`${campo}: ${esValido ? 'válido' : 'inválido'}`);
      });
    }
  });
}

// Ejercicio 3: Sistema de navegación por teclado
function navegacionTeclado() {
  console.log('\n--- Configurando navegación por teclado ---');

  const elementos = document.querySelectorAll('.navegable');
  let indiceActual = 0;

  // Resaltar elemento actual
  function resaltarElemento(indice) {
    elementos.forEach((el, i) => {
      if (i === indice) {
        el.style.backgroundColor = '#007bff';
        el.style.color = 'white';
        el.focus();
      } else {
        el.style.backgroundColor = '';
        el.style.color = '';
      }
    });
  }

  // Inicializar
  if (elementos.length > 0) {
    resaltarElemento(0);
  }

  // Eventos de teclado
  document.addEventListener('keydown', function (e) {
    if (elementos.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        indiceActual = (indiceActual + 1) % elementos.length;
        resaltarElemento(indiceActual);
        break;

      case 'ArrowUp':
        e.preventDefault();
        indiceActual = (indiceActual - 1 + elementos.length) % elementos.length;
        resaltarElemento(indiceActual);
        break;

      case 'Enter':
        e.preventDefault();
        elementos[indiceActual].click();
        break;

      case 'Home':
        e.preventDefault();
        indiceActual = 0;
        resaltarElemento(indiceActual);
        break;

      case 'End':
        e.preventDefault();
        indiceActual = elementos.length - 1;
        resaltarElemento(indiceActual);
        break;
    }
  });

  console.log(
    `Navegación por teclado configurada para ${elementos.length} elementos`
  );
}

// ================================
// FUNCIONES DE UTILIDAD
// ================================

// Función para mostrar mensajes
function mostrarMensaje(texto, tipo = 'info') {
  const mensaje = document.createElement('div');
  mensaje.className = `alert alert-${
    tipo === 'error' ? 'danger' : tipo
  } alert-dismissible fade show`;
  mensaje.innerHTML = `
        ${texto}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

  // Añadir al DOM
  const contenedor = document.querySelector('.container') || document.body;
  contenedor.insertBefore(mensaje, contenedor.firstChild);

  // Auto-remover después de 5 segundos
  setTimeout(() => {
    if (mensaje.parentNode) {
      mensaje.remove();
    }
  }, 5000);
}

// Función para cerrar modales
function cerrarTodosLosModales() {
  const modales = document.querySelectorAll('.modal');
  modales.forEach(modal => {
    modal.style.display = 'none';
  });
}

// Función para mostrar ayuda
function mostrarAyuda() {
  const ayuda = `
        Atajos de teclado:
        - Escape: Cerrar modales
        - F1: Mostrar ayuda
        - Ctrl+S: Guardar
        - Flechas: Navegar elementos
        - Enter: Seleccionar elemento
    `;

  alert(ayuda);
}

// Función para throttle (limitar frecuencia de ejecución)
function throttle(func, delay) {
  let timeoutId;
  let lastExecTime = 0;

  return function (...args) {
    const currentTime = Date.now();

    if (currentTime - lastExecTime > delay) {
      func.apply(this, args);
      lastExecTime = currentTime;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
}

// Función para debounce (retrasar ejecución)
function debounce(func, delay) {
  let timeoutId;

  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// ================================
// EJECUCIÓN DE EJERCICIOS
// ================================

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function () {
  console.log('\n🚀 DOM listo, configurando eventos básicos...');

  // Configurar eventos básicos
  configurarEventosMouse();
  configurarEventosTeclado();
  configurarEventosFormulario();
  configurarEventosVentana();

  // Ejecutar ejercicios prácticos
  crearContadorClicks();
  validacionTiempoReal();
  navegacionTeclado();

  console.log('\n✅ Eventos básicos configurados!');
});

// ================================
// RETOS ADICIONALES
// ================================

/**
 * RETO 1: Crear un sistema de gestos de mouse
 */
function configurarGestosMouse() {
  let mouseInicial = { x: 0, y: 0 };
  let mouseActual = { x: 0, y: 0 };

  document.addEventListener('mousedown', function (e) {
    mouseInicial = { x: e.clientX, y: e.clientY };
  });

  document.addEventListener('mousemove', function (e) {
    mouseActual = { x: e.clientX, y: e.clientY };
  });

  document.addEventListener('mouseup', function (e) {
    const deltaX = mouseActual.x - mouseInicial.x;
    const deltaY = mouseActual.y - mouseInicial.y;
    const distancia = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distancia > 100) {
      const angulo = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;

      if (angulo > -45 && angulo < 45) {
        console.log('Gesto: Deslizar derecha');
      } else if (angulo > 45 && angulo < 135) {
        console.log('Gesto: Deslizar abajo');
      } else if (angulo > 135 || angulo < -135) {
        console.log('Gesto: Deslizar izquierda');
      } else {
        console.log('Gesto: Deslizar arriba');
      }
    }
  });
}

/**
 * RETO 2: Crear un sistema de eventos personalizados
 */
function crearEventosPersonalizados() {
  // Crear evento personalizado
  const eventoPersonalizado = new CustomEvent('miEvento', {
    detail: { mensaje: 'Evento personalizado disparado' },
  });

  // Escuchar evento personalizado
  document.addEventListener('miEvento', function (e) {
    console.log('Evento personalizado recibido:', e.detail.mensaje);
  });

  // Disparar evento
  document.dispatchEvent(eventoPersonalizado);
}

/**
 * RETO 3: Crear un sistema de hotkeys
 */
function configurarHotkeys() {
  const hotkeys = {
    'ctrl+shift+d': () => console.log('Modo debug activado'),
    'ctrl+shift+t': () => console.log('Cambiar tema'),
    'ctrl+shift+r': () => console.log('Reiniciar aplicación'),
    'alt+h': () => mostrarAyuda(),
  };

  document.addEventListener('keydown', function (e) {
    const keys = [];

    if (e.ctrlKey) keys.push('ctrl');
    if (e.shiftKey) keys.push('shift');
    if (e.altKey) keys.push('alt');
    if (e.metaKey) keys.push('meta');

    if (
      e.key !== 'Control' &&
      e.key !== 'Shift' &&
      e.key !== 'Alt' &&
      e.key !== 'Meta'
    ) {
      keys.push(e.key.toLowerCase());
    }

    const combination = keys.join('+');

    if (hotkeys[combination]) {
      e.preventDefault();
      hotkeys[combination]();
    }
  });
}

// Ejemplos de uso de los retos:
// configurarGestosMouse();
// crearEventosPersonalizados();
// configurarHotkeys();
