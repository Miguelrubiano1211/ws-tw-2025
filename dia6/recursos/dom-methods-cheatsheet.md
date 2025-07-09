# 🔍 DOM Methods Cheat Sheet - Guía de Referencia Rápida

## Selección de Elementos

### Métodos de Selección Básicos

```javascript
// Selección por ID
const elemento = document.getElementById('miId');

// Selección por clase (primer elemento)
const elemento = document.getElementsByClassName('miClase')[0];
const elemento = document.querySelector('.miClase');

// Selección por etiqueta
const elementos = document.getElementsByTagName('div');
const elementos = document.querySelectorAll('div');

// Selección por atributo
const elemento = document.querySelector('[data-id="123"]');
const elementos = document.querySelectorAll('[type="text"]');
```

### Métodos de Selección Avanzados

```javascript
// Selección múltiple
const elementos = document.querySelectorAll('.item, .active');

// Selección por pseudo-clases
const primer = document.querySelector('li:first-child');
const ultimo = document.querySelector('li:last-child');
const par = document.querySelectorAll('li:nth-child(even)');

// Selección por relación
const padre = elemento.parentElement;
const hijos = elemento.children;
const hermanos = elemento.nextElementSibling;
const anterior = elemento.previousElementSibling;
```

## Manipulación de Contenido

### Contenido de Texto

```javascript
// Obtener/establecer texto
const texto = elemento.textContent;
elemento.textContent = 'Nuevo texto';

// Obtener/establecer HTML
const html = elemento.innerHTML;
elemento.innerHTML = '<strong>Texto en negrita</strong>';

// Texto visible (sin elementos ocultos)
const textoVisible = elemento.innerText;
elemento.innerText = 'Texto visible';
```

### Manipulación de Atributos

```javascript
// Obtener atributo
const valor = elemento.getAttribute('src');

// Establecer atributo
elemento.setAttribute('src', 'imagen.jpg');

// Eliminar atributo
elemento.removeAttribute('disabled');

// Verificar existencia
if (elemento.hasAttribute('data-active')) {
  // Hacer algo
}

// Atributos data
elemento.dataset.userId = '123';
const userId = elemento.dataset.userId;
```

## Manipulación de Estilos

### CSS Styles

```javascript
// Estilo inline
elemento.style.color = 'red';
elemento.style.backgroundColor = 'blue';
elemento.style.fontSize = '16px';

// Múltiples estilos
elemento.style.cssText = 'color: red; background: blue; font-size: 16px;';

// Obtener estilos computados
const estilos = getComputedStyle(elemento);
const color = estilos.getPropertyValue('color');
```

### Clases CSS

```javascript
// Agregar clase
elemento.classList.add('nueva-clase');

// Remover clase
elemento.classList.remove('vieja-clase');

// Alternar clase
elemento.classList.toggle('activo');

// Verificar clase
if (elemento.classList.contains('activo')) {
  // Hacer algo
}

// Reemplazar clase
elemento.classList.replace('vieja', 'nueva');
```

## Creación y Eliminación de Elementos

### Crear Elementos

```javascript
// Crear elemento
const nuevoDiv = document.createElement('div');
nuevoDiv.textContent = 'Contenido';
nuevoDiv.className = 'mi-clase';

// Crear elemento con HTML
const contenedor = document.createElement('div');
contenedor.innerHTML = '<p>Párrafo</p>';

// Clonar elemento
const clon = elemento.cloneNode(true); // true = clonar contenido
```

### Insertar Elementos

```javascript
// Agregar al final
padre.appendChild(nuevoElemento);

// Insertar en posición específica
padre.insertBefore(nuevoElemento, elementoReferencia);

// Métodos modernos
elemento.insertAdjacentHTML('beforebegin', '<p>Antes del elemento</p>');
elemento.insertAdjacentHTML('afterbegin', '<p>Al inicio del elemento</p>');
elemento.insertAdjacentHTML('beforeend', '<p>Al final del elemento</p>');
elemento.insertAdjacentHTML('afterend', '<p>Después del elemento</p>');
```

### Eliminar Elementos

```javascript
// Eliminar elemento
elemento.remove();

// Eliminar desde el padre
padre.removeChild(elemento);

// Reemplazar elemento
padre.replaceChild(nuevoElemento, elementoViejo);
```

## Navegación del DOM

### Relaciones de Elementos

```javascript
// Padre
const padre = elemento.parentElement;
const contenedor = elemento.closest('.contenedor');

// Hijos
const hijos = elemento.children;
const primerHijo = elemento.firstElementChild;
const ultimoHijo = elemento.lastElementChild;

// Hermanos
const siguiente = elemento.nextElementSibling;
const anterior = elemento.previousElementSibling;
```

### Propiedades de Posición

```javascript
// Dimensiones
const ancho = elemento.offsetWidth;
const alto = elemento.offsetHeight;

// Posición
const left = elemento.offsetLeft;
const top = elemento.offsetTop;

// Scroll
const scrollTop = elemento.scrollTop;
const scrollLeft = elemento.scrollLeft;
```

## Eventos del DOM

### Agregar Event Listeners

```javascript
// Método recomendado
elemento.addEventListener('click', function (e) {
  console.log('Elemento clickeado');
});

// Con función de flecha
elemento.addEventListener('click', e => {
  console.log('Elemento clickeado');
});

// Con opciones
elemento.addEventListener('click', handler, {
  once: true, // Solo ejecutar una vez
  passive: true, // No llamar preventDefault
  capture: true, // Capturar en fase de captura
});
```

### Eventos Comunes

```javascript
// Eventos de mouse
elemento.addEventListener('click', handler);
elemento.addEventListener('mouseenter', handler);
elemento.addEventListener('mouseleave', handler);
elemento.addEventListener('mouseover', handler);

// Eventos de teclado
elemento.addEventListener('keydown', handler);
elemento.addEventListener('keyup', handler);
elemento.addEventListener('keypress', handler);

// Eventos de formulario
formulario.addEventListener('submit', handler);
input.addEventListener('input', handler);
input.addEventListener('change', handler);
input.addEventListener('focus', handler);
input.addEventListener('blur', handler);
```

### Objeto Event

```javascript
function manejarEvento(e) {
  e.preventDefault(); // Prevenir comportamiento por defecto
  e.stopPropagation(); // Detener propagación
  e.stopImmediatePropagation(); // Detener otros listeners

  console.log('Tipo:', e.type);
  console.log('Target:', e.target);
  console.log('Current Target:', e.currentTarget);
  console.log('Posición:', e.clientX, e.clientY);
}
```

## Formularios

### Acceso a Valores

```javascript
// Por name
const valor = formulario.elements['nombre'].value;

// Por índice
const valor = formulario.elements[0].value;

// Directo
const valor = formulario.querySelector('[name="email"]').value;
```

### Validación

```javascript
// Validez del campo
if (input.checkValidity()) {
  console.log('Campo válido');
} else {
  console.log('Mensaje de error:', input.validationMessage);
}

// Validez del formulario
if (formulario.checkValidity()) {
  console.log('Formulario válido');
}

// Validación personalizada
input.setCustomValidity('Este campo es requerido');
```

## Útiles de Desarrollo

### Debugging

```javascript
// Inspeccionar elemento
console.log(elemento);
console.dir(elemento); // Propiedades del objeto

// Verificar existencia
if (elemento) {
  // Elemento existe
}

// Contar elementos
const cantidad = document.querySelectorAll('.item').length;
```

### Optimización

```javascript
// Cache de elementos
const elementos = document.querySelectorAll('.item');

// Fragmento de documento para inserción múltiple
const fragmento = document.createDocumentFragment();
elementos.forEach(item => fragmento.appendChild(item));
contenedor.appendChild(fragmento);

// Evitar reflow/repaint
elemento.style.display = 'none';
// Múltiples cambios...
elemento.style.display = 'block';
```

## Patrones Comunes

### Delegación de Eventos

```javascript
// En lugar de agregar evento a cada elemento
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('boton')) {
    manejarClick(e);
  }
});
```

### Throttling y Debouncing

```javascript
// Throttling (limitar frecuencia)
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

// Debouncing (retrasar ejecución)
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}
```

### Gestión de Múltiples Eventos

```javascript
// Múltiples eventos en un elemento
['click', 'touchstart'].forEach(event => {
  elemento.addEventListener(event, handler);
});

// Cleanup de eventos
function cleanup() {
  elemento.removeEventListener('click', handler);
}
```

## Consideraciones de Rendimiento

### Mejores Prácticas

- Usar `querySelectorAll` en lugar de `getElementsByClassName` para consultas complejas
- Cachear elementos DOM que se usan repetidamente
- Minimizar manipulaciones del DOM en loops
- Usar `DocumentFragment` para inserción múltiple
- Remover event listeners cuando no se necesiten

### Evitar

- Consultas DOM excesivas en loops
- Modificaciones de estilo repetitivas
- Event listeners sin cleanup
- Uso de `innerHTML` para simples cambios de texto

---

## 🎯 Consejos WorldSkills

1. **Memoriza los métodos más comunes**: `querySelector`, `addEventListener`, `classList`
2. **Practica la delegación de eventos** para optimización
3. **Conoce las diferencias** entre `textContent` e `innerHTML`
4. **Domina la validación de formularios** con HTML5 y JavaScript
5. **Usa herramientas del navegador** para debugging efectivo
