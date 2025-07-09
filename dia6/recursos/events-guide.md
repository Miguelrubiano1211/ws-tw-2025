# 🎯 Guía Completa de Eventos JavaScript

## Tipos de Eventos

### 1. Eventos de Mouse 🖱️

```javascript
// Eventos básicos de click
elemento.addEventListener('click', function (e) {
  console.log('Click simple');
});

elemento.addEventListener('dblclick', function (e) {
  console.log('Doble click');
});

// Eventos de hover
elemento.addEventListener('mouseenter', function (e) {
  console.log('Mouse entró al elemento');
});

elemento.addEventListener('mouseleave', function (e) {
  console.log('Mouse salió del elemento');
});

// Diferencia entre mouseover/mouseout y mouseenter/mouseleave
elemento.addEventListener('mouseover', function (e) {
  // Se dispara también en elementos hijos
});

elemento.addEventListener('mouseenter', function (e) {
  // Solo se dispara en el elemento actual
});

// Eventos de botón del mouse
elemento.addEventListener('mousedown', function (e) {
  console.log('Botón presionado:', e.button);
  // 0 = izquierdo, 1 = medio, 2 = derecho
});

elemento.addEventListener('mouseup', function (e) {
  console.log('Botón soltado');
});

// Movimiento del mouse
elemento.addEventListener('mousemove', function (e) {
  console.log('Posición:', e.clientX, e.clientY);
});
```

### 2. Eventos de Teclado ⌨️

```javascript
// Eventos de teclado
elemento.addEventListener('keydown', function (e) {
  console.log('Tecla presionada:', e.key);
  console.log('Código de tecla:', e.keyCode);

  // Verificar teclas especiales
  if (e.key === 'Enter') {
    console.log('Enter presionado');
  }

  if (e.key === 'Escape') {
    console.log('Escape presionado');
  }

  // Verificar modificadores
  if (e.ctrlKey && e.key === 's') {
    e.preventDefault();
    console.log('Ctrl+S presionado');
  }
});

elemento.addEventListener('keyup', function (e) {
  console.log('Tecla soltada:', e.key);
});

// Evento de entrada de texto
elemento.addEventListener('input', function (e) {
  console.log('Texto ingresado:', e.target.value);
});
```

### 3. Eventos de Formulario 📝

```javascript
// Evento submit
formulario.addEventListener('submit', function (e) {
  e.preventDefault(); // Prevenir envío por defecto

  // Validar formulario
  if (validarFormulario()) {
    console.log('Formulario válido, enviando...');
    enviarFormulario();
  } else {
    console.log('Formulario inválido');
  }
});

// Eventos de campos de entrada
input.addEventListener('focus', function (e) {
  console.log('Campo enfocado');
  e.target.classList.add('enfocado');
});

input.addEventListener('blur', function (e) {
  console.log('Campo desenfocado');
  e.target.classList.remove('enfocado');
});

input.addEventListener('change', function (e) {
  console.log('Valor cambiado:', e.target.value);
});

// Validación en tiempo real
input.addEventListener('input', function (e) {
  validarCampo(e.target);
});

// Eventos de selección
select.addEventListener('change', function (e) {
  console.log('Opción seleccionada:', e.target.value);
});

// Eventos de checkbox/radio
checkbox.addEventListener('change', function (e) {
  console.log('Checkbox:', e.target.checked);
});
```

### 4. Eventos de Ventana 🪟

```javascript
// Carga de la página
window.addEventListener('load', function (e) {
  console.log('Página completamente cargada');
});

// DOM listo
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('DOM listo');
});

// Redimensionamiento
window.addEventListener('resize', function (e) {
  console.log('Ventana redimensionada:', window.innerWidth, window.innerHeight);
});

// Scroll
window.addEventListener('scroll', function (e) {
  console.log('Scroll Y:', window.scrollY);
});

// Antes de cerrar/recargar
window.addEventListener('beforeunload', function (e) {
  e.preventDefault();
  e.returnValue = '¿Estás seguro de salir?';
});
```

### 5. Eventos Táctiles 📱

```javascript
// Eventos touch para móviles
elemento.addEventListener('touchstart', function (e) {
  console.log('Toque iniciado');
  e.preventDefault(); // Prevenir comportamiento por defecto
});

elemento.addEventListener('touchmove', function (e) {
  console.log('Deslizando');
  const touch = e.touches[0];
  console.log('Posición:', touch.clientX, touch.clientY);
});

elemento.addEventListener('touchend', function (e) {
  console.log('Toque terminado');
});
```

## Objeto Event

### Propiedades Importantes

```javascript
function manejarEvento(e) {
  // Información del evento
  console.log('Tipo de evento:', e.type);
  console.log('Elemento target:', e.target);
  console.log('Elemento currentTarget:', e.currentTarget);

  // Posición del mouse
  console.log('Posición cliente:', e.clientX, e.clientY);
  console.log('Posición página:', e.pageX, e.pageY);
  console.log('Posición pantalla:', e.screenX, e.screenY);

  // Teclas modificadoras
  console.log('Ctrl:', e.ctrlKey);
  console.log('Alt:', e.altKey);
  console.log('Shift:', e.shiftKey);
  console.log('Meta:', e.metaKey);

  // Información de teclado
  console.log('Tecla:', e.key);
  console.log('Código:', e.keyCode);
  console.log('Código cual:', e.which);
}
```

### Métodos del Evento

```javascript
function manejarEvento(e) {
  // Prevenir comportamiento por defecto
  e.preventDefault();

  // Detener propagación
  e.stopPropagation();

  // Detener propagación inmediata
  e.stopImmediatePropagation();
}
```

## Propagación de Eventos

### Fase de Captura y Burbuja

```javascript
// Fase de captura (capture: true)
document.addEventListener(
  'click',
  function (e) {
    console.log('Documento - Captura');
  },
  true
);

contenedor.addEventListener(
  'click',
  function (e) {
    console.log('Contenedor - Captura');
  },
  true
);

// Fase de burbuja (por defecto)
boton.addEventListener('click', function (e) {
  console.log('Botón - Target');
});

contenedor.addEventListener('click', function (e) {
  console.log('Contenedor - Burbuja');
});

document.addEventListener('click', function (e) {
  console.log('Documento - Burbuja');
});
```

### Delegación de Eventos

```javascript
// Delegación eficiente
document.addEventListener('click', function (e) {
  // Botones de eliminar
  if (e.target.classList.contains('btn-eliminar')) {
    eliminarElemento(e.target.closest('.item'));
  }

  // Botones de editar
  if (e.target.classList.contains('btn-editar')) {
    editarElemento(e.target.closest('.item'));
  }

  // Enlaces de navegación
  if (e.target.matches('a[data-navegacion]')) {
    e.preventDefault();
    navegarA(e.target.dataset.navegacion);
  }
});

// Delegación con múltiples selectores
document.addEventListener('click', function (e) {
  const target = e.target.closest('.clickable, .boton, .enlace');
  if (target) {
    manejarClick(target);
  }
});
```

## Patrones Avanzados

### 1. Throttling (Limitación de Frecuencia)

```javascript
function throttle(func, delay) {
  let timeoutId;
  let lastExecTime = 0;

  return function (...args) {
    const currentTime = Date.now();

    if (currentTime - lastExecTime > delay) {
      func.apply(this, args);
      lastExecTime = currentTime;
    }
  };
}

// Uso para scroll
window.addEventListener(
  'scroll',
  throttle(function () {
    console.log('Scroll:', window.scrollY);
  }, 100)
);
```

### 2. Debouncing (Retraso de Ejecución)

```javascript
function debounce(func, delay) {
  let timeoutId;

  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// Uso para búsqueda
input.addEventListener(
  'input',
  debounce(function (e) {
    buscar(e.target.value);
  }, 300)
);
```

### 3. Eventos Personalizados

```javascript
// Crear evento personalizado
const eventoPersonalizado = new CustomEvent('miEvento', {
  detail: { mensaje: 'Hola mundo' },
  bubbles: true,
  cancelable: true,
});

// Disparar evento
elemento.dispatchEvent(eventoPersonalizado);

// Escuchar evento personalizado
elemento.addEventListener('miEvento', function (e) {
  console.log('Evento personalizado:', e.detail.mensaje);
});
```

### 4. Gestión de Múltiples Eventos

```javascript
// Múltiples eventos en un elemento
const eventos = ['click', 'touchstart'];
eventos.forEach(evento => {
  elemento.addEventListener(evento, manejarClick);
});

// Objeto para gestionar listeners
class EventManager {
  constructor() {
    this.listeners = new Map();
  }

  addListener(element, event, handler) {
    if (!this.listeners.has(element)) {
      this.listeners.set(element, new Map());
    }

    this.listeners.get(element).set(event, handler);
    element.addEventListener(event, handler);
  }

  removeListener(element, event) {
    if (this.listeners.has(element)) {
      const handler = this.listeners.get(element).get(event);
      if (handler) {
        element.removeEventListener(event, handler);
        this.listeners.get(element).delete(event);
      }
    }
  }

  cleanup() {
    this.listeners.forEach((events, element) => {
      events.forEach((handler, event) => {
        element.removeEventListener(event, handler);
      });
    });
    this.listeners.clear();
  }
}
```

## Casos de Uso Comunes

### 1. Modal/Popup

```javascript
// Abrir modal
function abrirModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = 'block';

  // Cerrar con Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      cerrarModal(modalId);
    }
  });
}

// Cerrar modal al hacer click fuera
modal.addEventListener('click', function (e) {
  if (e.target === modal) {
    cerrarModal(modalId);
  }
});
```

### 2. Drag and Drop

```javascript
elemento.addEventListener('dragstart', function (e) {
  e.dataTransfer.setData('text/plain', e.target.id);
});

destino.addEventListener('dragover', function (e) {
  e.preventDefault();
});

destino.addEventListener('drop', function (e) {
  e.preventDefault();
  const id = e.dataTransfer.getData('text/plain');
  const elemento = document.getElementById(id);
  e.target.appendChild(elemento);
});
```

### 3. Validación de Formularios

```javascript
formulario.addEventListener('submit', function (e) {
  e.preventDefault();

  const errores = [];

  // Validar campos
  const campos = formulario.querySelectorAll('[required]');
  campos.forEach(campo => {
    if (!campo.value.trim()) {
      errores.push(`${campo.name} es requerido`);
    }
  });

  // Mostrar errores o enviar
  if (errores.length > 0) {
    mostrarErrores(errores);
  } else {
    enviarFormulario();
  }
});
```

### 4. Navegación por Teclado

```javascript
// Navegación con flechas
document.addEventListener('keydown', function (e) {
  const elementos = document.querySelectorAll('.navegable');
  let indiceActual = Array.from(elementos).indexOf(document.activeElement);

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      indiceActual = (indiceActual + 1) % elementos.length;
      elementos[indiceActual].focus();
      break;

    case 'ArrowUp':
      e.preventDefault();
      indiceActual = (indiceActual - 1 + elementos.length) % elementos.length;
      elementos[indiceActual].focus();
      break;
  }
});
```

## Optimización y Mejores Prácticas

### 1. Uso de AbortController

```javascript
const controller = new AbortController();
const signal = controller.signal;

elemento.addEventListener(
  'click',
  function (e) {
    console.log('Click');
  },
  { signal }
);

// Remover listener
controller.abort();
```

### 2. Lazy Loading de Listeners

```javascript
// Agregar listener solo cuando sea necesario
function activarFuncionalidad() {
  if (!elemento.dataset.listenerActivo) {
    elemento.addEventListener('click', manejarClick);
    elemento.dataset.listenerActivo = 'true';
  }
}
```

### 3. Memoria y Cleanup

```javascript
// Limpieza al cambiar de página
window.addEventListener('beforeunload', function () {
  // Remover listeners
  // Cancelar timers
  // Limpiar referencias
});
```

## Debugging de Eventos

### Herramientas de Desarrollo

```javascript
// Mostrar todos los listeners de un elemento
function mostrarListeners(elemento) {
  console.log('Listeners de:', elemento);
  console.log(getEventListeners(elemento));
}

// Debugging de propagación
function debugPropagacion(e) {
  console.log('Fase:', e.eventPhase);
  console.log('Target:', e.target);
  console.log('CurrentTarget:', e.currentTarget);
}
```

---

## 🎯 Consejos WorldSkills

1. **Domina la delegación de eventos** - Eficiencia y menos código
2. **Conoce todos los tipos de eventos** - Mouse, teclado, formulario, ventana
3. **Entiende la propagación** - Captura vs burbuja
4. **Usa preventDefault() correctamente** - Evita comportamientos no deseados
5. **Implementa validación robusta** - Tiempo real y en envío
6. **Optimiza con throttling/debouncing** - Mejor rendimiento
7. **Limpia listeners** - Evita memory leaks
8. **Practica eventos táctiles** - Compatibilidad móvil

### Errores Comunes a Evitar

- No remover event listeners
- Confundir target con currentTarget
- Usar addEventListener sin cleanup
- No considerar la propagación
- Olvidar preventDefault() en formularios
