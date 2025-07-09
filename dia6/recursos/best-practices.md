# 🚀 Mejores Prácticas - DOM y Eventos

## Principios Fundamentales

### 1. Principio de Separación de Responsabilidades

```javascript
// ❌ Malo: Mezclar HTML, CSS y JavaScript
elemento.innerHTML =
  '<div style="color: red;" onclick="alert(\'Hola\')">Click</div>';

// ✅ Bueno: Separar responsabilidades
elemento.classList.add('mensaje-error');
elemento.addEventListener('click', mostrarMensaje);
```

### 2. Principio DRY (Don't Repeat Yourself)

```javascript
// ❌ Malo: Repetir código
document.getElementById('btn1').addEventListener('click', function () {
  console.log('Botón clickeado');
  this.classList.add('clicked');
});

document.getElementById('btn2').addEventListener('click', function () {
  console.log('Botón clickeado');
  this.classList.add('clicked');
});

// ✅ Bueno: Reutilizar código
function manejarClick(e) {
  console.log('Botón clickeado');
  e.target.classList.add('clicked');
}

document.querySelectorAll('.boton').forEach(btn => {
  btn.addEventListener('click', manejarClick);
});
```

### 3. Principio de Responsabilidad Única

```javascript
// ❌ Malo: Función que hace demasiado
function manejarFormulario(e) {
  e.preventDefault();
  const datos = new FormData(e.target);
  const nombre = datos.get('nombre');
  const email = datos.get('email');

  // Validar
  if (!nombre) alert('Nombre requerido');
  if (!email) alert('Email requerido');

  // Enviar
  fetch('/api/usuarios', {
    method: 'POST',
    body: JSON.stringify({ nombre, email }),
  });

  // Limpiar
  e.target.reset();

  // Mostrar mensaje
  document.getElementById('mensaje').textContent = 'Usuario creado';
}

// ✅ Bueno: Separar responsabilidades
function validarFormulario(datos) {
  const errores = [];
  if (!datos.nombre) errores.push('Nombre requerido');
  if (!datos.email) errores.push('Email requerido');
  return errores;
}

function enviarDatos(datos) {
  return fetch('/api/usuarios', {
    method: 'POST',
    body: JSON.stringify(datos),
  });
}

function mostrarMensaje(mensaje) {
  document.getElementById('mensaje').textContent = mensaje;
}

async function manejarFormulario(e) {
  e.preventDefault();
  const datos = Object.fromEntries(new FormData(e.target));

  const errores = validarFormulario(datos);
  if (errores.length > 0) {
    mostrarErrores(errores);
    return;
  }

  try {
    await enviarDatos(datos);
    e.target.reset();
    mostrarMensaje('Usuario creado');
  } catch (error) {
    mostrarMensaje('Error al crear usuario');
  }
}
```

## Mejores Prácticas de Selección DOM

### 1. Cachear Elementos

```javascript
// ❌ Malo: Consultar DOM repetidamente
function actualizarContador() {
  const contador = document.getElementById('contador');
  const valor = parseInt(contador.textContent);
  contador.textContent = valor + 1;
}

// ✅ Bueno: Cachear elementos
const contador = document.getElementById('contador');
function actualizarContador() {
  const valor = parseInt(contador.textContent);
  contador.textContent = valor + 1;
}
```

### 2. Usar Selectores Eficientes

```javascript
// ❌ Malo: Selectores lentos
const elementos = document.querySelectorAll('div.item.active');

// ✅ Bueno: Selectores optimizados
const elementos = document.querySelectorAll('.item.active');

// ✅ Mejor: Usar ID cuando sea único
const elemento = document.getElementById('lista-principal');
```

### 3. Limitar Scope de Consultas

```javascript
// ❌ Malo: Buscar en todo el documento
const items = document.querySelectorAll('.item');

// ✅ Bueno: Buscar dentro de un contenedor
const contenedor = document.getElementById('lista');
const items = contenedor.querySelectorAll('.item');
```

## Mejores Prácticas de Eventos

### 1. Delegación de Eventos

```javascript
// ❌ Malo: Agregar listener a cada elemento
document.querySelectorAll('.boton').forEach(btn => {
  btn.addEventListener('click', manejarClick);
});

// ✅ Bueno: Usar delegación
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('boton')) {
    manejarClick(e);
  }
});
```

### 2. Usar addEventListener en lugar de onclick

```javascript
// ❌ Malo: Usar propiedades de evento
elemento.onclick = function () {
  console.log('Click');
};

// ✅ Bueno: Usar addEventListener
elemento.addEventListener('click', function () {
  console.log('Click');
});
```

### 3. Remover Event Listeners

```javascript
// ❌ Malo: No remover listeners
function agregarListener() {
  elemento.addEventListener('click', manejarClick);
}

// ✅ Bueno: Remover cuando no se necesiten
function agregarListener() {
  elemento.addEventListener('click', manejarClick);
}

function removerListener() {
  elemento.removeEventListener('click', manejarClick);
}

// ✅ Mejor: Usar AbortController
const controller = new AbortController();
elemento.addEventListener('click', manejarClick, {
  signal: controller.signal,
});

// Remover todos los listeners
controller.abort();
```

## Manipulación del DOM

### 1. Minimizar Reflows y Repaints

```javascript
// ❌ Malo: Múltiples manipulaciones
elemento.style.width = '100px';
elemento.style.height = '100px';
elemento.style.backgroundColor = 'red';

// ✅ Bueno: Cambios en lote
elemento.style.cssText = 'width: 100px; height: 100px; background-color: red;';

// ✅ Mejor: Usar clases CSS
elemento.className = 'box-rojo';
```

### 2. Usar DocumentFragment para Inserción Múltiple

```javascript
// ❌ Malo: Múltiples appendChild
const lista = document.getElementById('lista');
items.forEach(item => {
  const li = document.createElement('li');
  li.textContent = item.nombre;
  lista.appendChild(li); // Reflow en cada inserción
});

// ✅ Bueno: Usar DocumentFragment
const lista = document.getElementById('lista');
const fragment = document.createDocumentFragment();

items.forEach(item => {
  const li = document.createElement('li');
  li.textContent = item.nombre;
  fragment.appendChild(li);
});

lista.appendChild(fragment); // Un solo reflow
```

### 3. Evitar innerHTML para Contenido Dinámico

```javascript
// ❌ Malo: innerHTML con datos dinámicos
elemento.innerHTML = `<p>Hola ${nombre}</p>`;

// ✅ Bueno: Usar textContent o crear elementos
const p = document.createElement('p');
p.textContent = `Hola ${nombre}`;
elemento.appendChild(p);
```

## Gestión de Estados

### 1. Usar Data Attributes

```javascript
// ❌ Malo: Variables globales
let estadoModal = false;

// ✅ Bueno: Data attributes
modal.dataset.abierto = 'true';

// Verificar estado
if (modal.dataset.abierto === 'true') {
  // Modal está abierto
}
```

### 2. Patrón State Machine Simple

```javascript
class EstadoComponente {
  constructor(elemento) {
    this.elemento = elemento;
    this.estado = 'inactivo';
    this.estados = {
      inactivo: {
        activar: 'activo',
        cargar: 'cargando',
      },
      activo: {
        desactivar: 'inactivo',
        cargar: 'cargando',
      },
      cargando: {
        completar: 'activo',
        error: 'error',
      },
      error: {
        reintentar: 'cargando',
        cancelar: 'inactivo',
      },
    };
  }

  transicion(accion) {
    const nuevoEstado = this.estados[this.estado][accion];
    if (nuevoEstado) {
      this.estado = nuevoEstado;
      this.elemento.className = `componente ${nuevoEstado}`;
      this.elemento.dataset.estado = nuevoEstado;
    }
  }
}
```

## Validación y Sanitización

### 1. Validar Entrada de Usuario

```javascript
// ❌ Malo: Confiar en datos sin validar
function procesarDatos(datos) {
  elemento.innerHTML = datos.mensaje;
}

// ✅ Bueno: Validar y sanitizar
function procesarDatos(datos) {
  if (!datos || typeof datos.mensaje !== 'string') {
    throw new Error('Datos inválidos');
  }

  elemento.textContent = datos.mensaje;
}
```

### 2. Escapar HTML

```javascript
// ❌ Malo: HTML sin escapar
elemento.innerHTML = textoUsuario;

// ✅ Bueno: Escapar HTML
function escaparHTML(texto) {
  const div = document.createElement('div');
  div.textContent = texto;
  return div.innerHTML;
}

elemento.innerHTML = escaparHTML(textoUsuario);
```

## Optimización de Rendimiento

### 1. Throttling y Debouncing

```javascript
// Throttling para scroll
const throttle = (func, limit) => {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

window.addEventListener(
  'scroll',
  throttle(function () {
    console.log('Scroll');
  }, 100)
);

// Debouncing para búsqueda
const debounce = (func, delay) => {
  let timeoutId;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(context, args), delay);
  };
};

input.addEventListener(
  'input',
  debounce(function () {
    buscar(this.value);
  }, 300)
);
```

### 2. Lazy Loading

```javascript
// Lazy loading de componentes
class LazyComponent {
  constructor(elemento) {
    this.elemento = elemento;
    this.cargado = false;
    this.observador = new IntersectionObserver(this.cargarSiVisible.bind(this));
    this.observador.observe(elemento);
  }

  cargarSiVisible(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting && !this.cargado) {
        this.cargar();
        this.cargado = true;
        this.observador.unobserve(this.elemento);
      }
    });
  }

  cargar() {
    // Cargar contenido del componente
    this.elemento.innerHTML = this.generarContenido();
    this.inicializarEventos();
  }
}
```

## Manejo de Errores

### 1. Try-Catch para Operaciones DOM

```javascript
// ❌ Malo: No manejar errores
const elemento = document.getElementById('inexistente');
elemento.textContent = 'Texto';

// ✅ Bueno: Manejar errores
try {
  const elemento = document.getElementById('mi-elemento');
  if (elemento) {
    elemento.textContent = 'Texto';
  } else {
    console.warn('Elemento no encontrado');
  }
} catch (error) {
  console.error('Error al manipular DOM:', error);
}
```

### 2. Validación de Existencia

```javascript
// ❌ Malo: Asumir que elementos existen
document.getElementById('boton').addEventListener('click', handler);

// ✅ Bueno: Verificar existencia
const boton = document.getElementById('boton');
if (boton) {
  boton.addEventListener('click', handler);
}

// ✅ Mejor: Usar optional chaining (ES2020)
document.getElementById('boton')?.addEventListener('click', handler);
```

## Accesibilidad

### 1. Usar Atributos ARIA

```javascript
// Actualizar estados ARIA
function toggleMenu(boton, menu) {
  const expandido = boton.getAttribute('aria-expanded') === 'true';
  boton.setAttribute('aria-expanded', !expandido);
  menu.setAttribute('aria-hidden', expandido);
}
```

### 2. Gestión de Foco

```javascript
// Gestionar foco en modales
function abrirModal(modal) {
  modal.style.display = 'block';

  // Enfocar primer elemento focusable
  const elementosFocusables = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  if (elementosFocusables.length > 0) {
    elementosFocusables[0].focus();
  }
}
```

## Testing y Debugging

### 1. Funciones de Debugging

```javascript
// Utilidades de debugging
const Debug = {
  elemento: selector => {
    const elemento = document.querySelector(selector);
    console.log('Elemento:', elemento);
    console.log('Eventos:', getEventListeners(elemento));
    return elemento;
  },

  eventos: elemento => {
    return getEventListeners(elemento);
  },

  estilos: elemento => {
    return getComputedStyle(elemento);
  },
};
```

### 2. Assertions para Testing

```javascript
// Assertions simples
function assert(condicion, mensaje) {
  if (!condicion) {
    throw new Error(mensaje);
  }
}

// Tests básicos
function testSeleccionElemento() {
  const elemento = document.getElementById('test');
  assert(elemento !== null, 'Elemento debe existir');
  assert(elemento.tagName === 'DIV', 'Elemento debe ser div');
}
```

## Patrones de Diseño

### 1. Patrón Observer Simple

```javascript
class EventEmitter {
  constructor() {
    this.eventos = {};
  }

  on(evento, callback) {
    if (!this.eventos[evento]) {
      this.eventos[evento] = [];
    }
    this.eventos[evento].push(callback);
  }

  emit(evento, datos) {
    if (this.eventos[evento]) {
      this.eventos[evento].forEach(callback => callback(datos));
    }
  }

  off(evento, callback) {
    if (this.eventos[evento]) {
      this.eventos[evento] = this.eventos[evento].filter(cb => cb !== callback);
    }
  }
}
```

### 2. Patrón Module

```javascript
const MiModulo = (function () {
  // Variables privadas
  let contador = 0;
  const elementos = new Map();

  // Métodos privados
  function incrementar() {
    contador++;
  }

  // API pública
  return {
    init: function (selector) {
      const elemento = document.querySelector(selector);
      elementos.set(selector, elemento);
      return this;
    },

    obtenerElemento: function (selector) {
      return elementos.get(selector);
    },

    obtenerContador: function () {
      return contador;
    },
  };
})();
```

## Checklist de Mejores Prácticas

### ✅ Selección DOM

- [ ] Cachear elementos que se usan repetidamente
- [ ] Usar selectores eficientes
- [ ] Limitar scope de consultas
- [ ] Verificar existencia antes de usar

### ✅ Eventos

- [ ] Usar addEventListener en lugar de onclick
- [ ] Implementar delegación cuando sea apropiado
- [ ] Remover listeners cuando no se necesiten
- [ ] Usar preventDefault() y stopPropagation() correctamente

### ✅ Manipulación DOM

- [ ] Minimizar reflows y repaints
- [ ] Usar DocumentFragment para inserción múltiple
- [ ] Evitar innerHTML con datos dinámicos
- [ ] Usar clases CSS en lugar de estilos inline

### ✅ Rendimiento

- [ ] Implementar throttling/debouncing cuando sea necesario
- [ ] Usar lazy loading para componentes pesados
- [ ] Optimizar loops y operaciones repetitivas
- [ ] Profiling de rendimiento en DevTools

### ✅ Seguridad

- [ ] Validar entrada de usuario
- [ ] Escapar HTML dinámico
- [ ] Usar textContent en lugar de innerHTML
- [ ] Implementar Content Security Policy

### ✅ Accesibilidad

- [ ] Usar atributos ARIA apropiados
- [ ] Gestionar foco correctamente
- [ ] Soportar navegación por teclado
- [ ] Proporcionar alternativas para contenido visual

### ✅ Mantenibilidad

- [ ] Separar responsabilidades
- [ ] Usar nombres descriptivos
- [ ] Documentar código complejo
- [ ] Implementar error handling

---

## 🎯 Consejos WorldSkills

1. **Memoriza los patrones comunes** - Delegación, throttling, validación
2. **Practica debugging** - Usa DevTools efectivamente
3. **Conoce los estándares** - HTML5, ES6+, accesibilidad
4. **Optimiza desde el inicio** - No como una idea tardía
5. **Piensa en la experiencia del usuario** - Responsive, accesible, rápido
6. **Mantén código limpio** - Legible, mantenible, testeable
7. **Usa las herramientas modernas** - Pero conoce los fundamentos

### Errores Críticos a Evitar

- Manipular DOM en loops sin optimización
- No validar entrada del usuario
- Memoria leaks por listeners no removidos
- Usar innerHTML con datos no confiables
- Ignorar accesibilidad y responsive design
