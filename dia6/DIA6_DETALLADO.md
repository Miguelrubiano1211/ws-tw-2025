# 📅 Cronograma Detallado - Día 6: DOM y Eventos

## 🎯 Información General

**Fecha**: Día 6 del entrenamiento intensivo
**Tema**: DOM y Eventos
**Duración**: 8 horas (09:00 - 17:00)
**Enfoque**: Manipulación del DOM y manejo de eventos

---

## 🌅 BLOQUE 1: Fundamentos DOM (09:00 - 10:30)

### 📋 Objetivos del Bloque

- Comprender qué es el DOM y cómo funciona
- Dominar métodos de selección de elementos
- Manipular contenido y atributos básicos

### ⏰ 09:00 - 09:20: Introducción al DOM

**Duración**: 20 minutos
**Modalidad**: Teoría + Demostración

**Contenido**:

- ¿Qué es el DOM? (Document Object Model)
- Estructura de árbol del HTML
- Relación entre HTML, CSS y JavaScript
- Navegadores y el DOM

**Actividades**:

```javascript
// Demostración básica
console.log(document); // Explorar el objeto document
console.log(document.documentElement); // Elemento raíz
console.log(document.body); // Cuerpo del documento
```

**Recursos**:

- DevTools: Inspeccionar elementos
- Console: Experimentar con document

### ⏰ 09:20 - 09:50: Métodos de Selección

**Duración**: 30 minutos
**Modalidad**: Teoría + Práctica

**Contenido**:

- `document.getElementById()`
- `document.querySelector()`
- `document.querySelectorAll()`
- `document.getElementsByClassName()`
- `document.getElementsByTagName()`

**Actividades**:

```javascript
// Ejercicio guiado
const titulo = document.getElementById('titulo');
const botones = document.querySelectorAll('.btn');
const primero = document.querySelector('.lista li:first-child');
```

**Ejercicio Práctico**:

- Crear HTML con diferentes elementos
- Seleccionar elementos usando todos los métodos
- Comparar diferencias y casos de uso

### ⏰ 09:50 - 10:30: Manipulación Básica

**Duración**: 40 minutos
**Modalidad**: Práctica intensiva

**Contenido**:

- `innerHTML` vs `textContent`
- `setAttribute()` y `getAttribute()`
- Modificar propiedades directamente
- Diferencias entre propiedades y atributos

**Actividades**:

```javascript
// Ejemplos prácticos
elemento.innerHTML = '<strong>Nuevo contenido</strong>';
elemento.textContent = 'Solo texto';
elemento.setAttribute('class', 'activo');
elemento.src = 'nueva-imagen.jpg';
```

**Ejercicio**: 01-seleccion-dom.html

- Seleccionar elementos de diferentes formas
- Modificar contenido y atributos
- Experimentar con propiedades

---

## 🌅 BLOQUE 2: Manipulación Avanzada (10:45 - 12:15)

### 📋 Objetivos del Bloque

- Modificar estilos y clases CSS
- Crear y eliminar elementos dinámicamente
- Navegar por el DOM eficientemente

### ⏰ 10:45 - 11:15: Estilos y Clases

**Duración**: 30 minutos
**Modalidad**: Demostración + Práctica

**Contenido**:

- `element.style` para estilos inline
- `classList.add()`, `classList.remove()`, `classList.toggle()`
- `classList.contains()` para verificar clases
- `className` vs `classList`

**Actividades**:

```javascript
// Manipulación de estilos
elemento.style.color = 'red';
elemento.style.backgroundColor = 'yellow';

// Manipulación de clases
elemento.classList.add('activo');
elemento.classList.toggle('oculto');
if (elemento.classList.contains('activo')) {
  console.log('Elemento activo');
}
```

**Ejercicio**: 02-manipulacion-contenido.html

- Cambiar estilos dinámicamente
- Agregar y remover clases
- Crear efectos visuales

### ⏰ 11:15 - 11:45: Navegación DOM

**Duración**: 30 minutos
**Modalidad**: Teoría + Práctica

**Contenido**:

- `parentNode`, `parentElement`
- `childNodes`, `children`
- `firstChild`, `lastChild`
- `nextSibling`, `previousSibling`
- `firstElementChild`, `lastElementChild`

**Actividades**:

```javascript
// Navegación por el DOM
const hijo = document.querySelector('.hijo');
const padre = hijo.parentElement;
const hermano = hijo.nextElementSibling;
const hijos = padre.children;
```

**Tips del Instructor**:

- Diferencia entre Node y Element
- Cuándo usar cada método de navegación
- Cuidado con espacios en blanco como nodos

### ⏰ 11:45 - 12:15: Crear y Eliminar Elementos

**Duración**: 30 minutos
**Modalidad**: Práctica intensiva

**Contenido**:

- `document.createElement()`
- `appendChild()`, `insertBefore()`
- `removeChild()`, `remove()`
- `cloneNode()`

**Actividades**:

```javascript
// Crear elementos
const nuevoDiv = document.createElement('div');
nuevoDiv.textContent = 'Nuevo elemento';
nuevoDiv.classList.add('nuevo');

// Agregar al DOM
document.body.appendChild(nuevoDiv);

// Eliminar elementos
elemento.remove();
// o
padre.removeChild(hijo);
```

**Ejercicio**: 03-estilos-clases.html

- Crear elementos dinámicamente
- Modificar estructura del DOM
- Implementar funcionalidad de agregar/eliminar

---

## 🌞 BLOQUE 3: Eventos Básicos (13:30 - 15:00)

### 📋 Objetivos del Bloque

- Entender el sistema de eventos de JavaScript
- Implementar event listeners básicos
- Manejar diferentes tipos de eventos

### ⏰ 13:30 - 14:00: Introducción a Eventos

**Duración**: 30 minutos
**Modalidad**: Teoría + Demostración

**Contenido**:

- ¿Qué son los eventos?
- Tipos de eventos: mouse, keyboard, form, window
- Event handlers vs Event listeners
- Inline events vs JavaScript events

**Actividades**:

```javascript
// Diferentes formas de manejar eventos
// 1. Inline (no recomendado)
// <button onclick="miFuncion()">Click</button>

// 2. Event handler
boton.onclick = function () {
  console.log('Clicked!');
};

// 3. Event listener (recomendado)
boton.addEventListener('click', function () {
  console.log('Clicked!');
});
```

**Demostración**:

- Crear botones con diferentes eventos
- Mostrar diferencias entre métodos
- Introducir DevTools para debugging

### ⏰ 14:00 - 14:30: Event Listeners

**Duración**: 30 minutos
**Modalidad**: Práctica guiada

**Contenido**:

- `addEventListener()` y `removeEventListener()`
- Parámetros del event listener
- Múltiples listeners en un elemento
- Named functions vs anonymous functions

**Actividades**:

```javascript
// Event listeners básicos
function manejarClick(evento) {
  console.log('Elemento clickeado:', evento.target);
}

boton.addEventListener('click', manejarClick);

// Remover listener
boton.removeEventListener('click', manejarClick);

// Múltiples listeners
boton.addEventListener('click', funcion1);
boton.addEventListener('click', funcion2);
```

**Ejercicio**: 04-crear-eliminar.html

- Implementar botones con funcionalidad
- Agregar múltiples event listeners
- Manejar eventos de diferentes tipos

### ⏰ 14:30 - 15:00: Objeto Event

**Duración**: 30 minutos
**Modalidad**: Práctica intensiva

**Contenido**:

- Propiedades del objeto event
- `event.target` vs `event.currentTarget`
- `event.preventDefault()`
- `event.stopPropagation()`

**Actividades**:

```javascript
// Objeto event
function manejarEvento(e) {
  console.log('Tipo de evento:', e.type);
  console.log('Elemento target:', e.target);
  console.log('Elemento currentTarget:', e.currentTarget);

  // Prevenir comportamiento por defecto
  e.preventDefault();

  // Detener propagación
  e.stopPropagation();
}
```

**Ejercicio**: 05-eventos-basicos.html

- Trabajar con diferentes tipos de eventos
- Usar propiedades del objeto event
- Implementar prevención de comportamientos

---

## 🌞 BLOQUE 4: Eventos Avanzados (15:15 - 16:45)

### 📋 Objetivos del Bloque

- Comprender la propagación de eventos
- Implementar event delegation
- Manejar eventos de formularios

### ⏰ 15:15 - 15:45: Propagación de Eventos

**Duración**: 30 minutos
**Modalidad**: Teoría + Demostración

**Contenido**:

- Event bubbling (burbujeo)
- Event capturing (captura)
- Fase de targeting
- `stopPropagation()` y `stopImmediatePropagation()`

**Actividades**:

```javascript
// Demostración de bubbling
document.getElementById('abuelo').addEventListener('click', () => {
  console.log('Abuelo clickeado');
});

document.getElementById('padre').addEventListener('click', () => {
  console.log('Padre clickeado');
});

document.getElementById('hijo').addEventListener('click', e => {
  console.log('Hijo clickeado');
  e.stopPropagation(); // Detener bubbling
});
```

**Demostración Visual**:

- Crear estructura HTML anidada
- Mostrar order de ejecución
- Experimentar con capturing

### ⏰ 15:45 - 16:15: Event Delegation

**Duración**: 30 minutos
**Modalidad**: Práctica guiada

**Contenido**:

- ¿Qué es event delegation?
- Ventajas del event delegation
- Implementación práctica
- Casos de uso comunes

**Actividades**:

```javascript
// Event delegation
document.getElementById('lista').addEventListener('click', function (e) {
  if (e.target.classList.contains('item')) {
    console.log('Item clickeado:', e.target.textContent);
  }

  if (e.target.classList.contains('boton-eliminar')) {
    e.target.parentElement.remove();
  }
});
```

**Ejercicio**: 06-eventos-avanzados.html

- Implementar event delegation
- Manejar elementos dinámicos
- Optimizar rendimiento de eventos

### ⏰ 16:15 - 16:45: Eventos de Formularios

**Duración**: 30 minutos
**Modalidad**: Práctica intensiva

**Contenido**:

- Evento `submit` en formularios
- Eventos `input`, `change`, `focus`, `blur`
- Acceder a valores de formularios
- Validación básica

**Actividades**:

```javascript
// Eventos de formularios
form.addEventListener('submit', function (e) {
  e.preventDefault(); // Prevenir envío

  const datos = new FormData(form);
  console.log('Datos del formulario:', Object.fromEntries(datos));
});

input.addEventListener('input', function (e) {
  console.log('Valor actual:', e.target.value);
});
```

**Ejercicio**: 07-validacion-formularios.html

- Crear formulario con validación
- Manejar diferentes eventos de input
- Mostrar mensajes de error

---

## 🌅 BLOQUE 5: Proyecto Lista de Tareas (16:45 - 17:00)

### 📋 Objetivos del Bloque

- Aplicar todos los conceptos aprendidos
- Desarrollar funcionalidad básica
- Preparar para trabajo individual

### ⏰ 16:45 - 17:00: Inicio del Proyecto

**Duración**: 15 minutos
**Modalidad**: Demostración + Setup

**Contenido**:

- Análisis de requerimientos
- Estructura HTML base
- Configuración inicial
- Planificación de funcionalidades

**Actividades**:

```html
<!-- Estructura base -->
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0" />
    <title>Lista de Tareas</title>
    <link
      rel="stylesheet"
      href="styles.css" />
  </head>
  <body>
    <div class="contenedor">
      <h1>Mi Lista de Tareas</h1>
      <form id="formulario-tarea">
        <input
          type="text"
          id="input-tarea"
          placeholder="Agregar nueva tarea..." />
        <button type="submit">Agregar</button>
      </form>
      <ul id="lista-tareas"></ul>
    </div>
    <script src="script.js"></script>
  </body>
</html>
```

**Funcionalidades a Implementar**:

- ✅ Agregar tareas
- ✅ Marcar como completadas
- ✅ Eliminar tareas
- ✅ Filtrar tareas
- ✅ Persistencia con localStorage

**Tarea para Casa**:

- Completar la funcionalidad básica
- Implementar estilos CSS
- Agregar validaciones
- Preparar para demostración mañana

---

## 📊 Evaluación del Día

### ✅ Ejercicios Completados (40%)

- [ ] 01-seleccion-dom.html
- [ ] 02-manipulacion-contenido.html
- [ ] 03-estilos-clases.html
- [ ] 04-crear-eliminar.html
- [ ] 05-eventos-basicos.html
- [ ] 06-eventos-avanzados.html
- [ ] 07-validacion-formularios.html

### 🎯 Conceptos Dominados (35%)

- [ ] Selección de elementos DOM
- [ ] Manipulación de contenido y atributos
- [ ] Manejo de eventos básicos
- [ ] Propagación de eventos
- [ ] Event delegation
- [ ] Validación de formularios

### 🚀 Habilidades Desarrolladas (25%)

- [ ] Debugging con DevTools
- [ ] Optimización de performance
- [ ] Código limpio y mantenible
- [ ] Pensamiento orientado a UX
- [ ] Resolución de problemas

---

## 🎯 Tips para el Instructor

### 💡 Puntos Clave a Enfatizar

1. **Separación de responsabilidades**: HTML para estructura, CSS para estilo, JS para comportamiento
2. **Event delegation**: Más eficiente que múltiples listeners
3. **Performance**: Minimizar manipulaciones DOM
4. **Debugging**: Usar DevTools efectivamente
5. **Accesibilidad**: Considerar usuarios con discapacidades

### 🚨 Errores Comunes

- Confundir `innerHTML` con `textContent`
- No entender la diferencia entre propiedades y atributos
- Olvidar `preventDefault()` en formularios
- No usar event delegation para elementos dinámicos
- Manipular DOM en loops sin optimización

### 🎯 Estrategias de Enseñanza

- **Demostración en vivo**: Mostrar errores y correcciones
- **Práctica guiada**: Resolver ejercicios juntos
- **Experimentos**: Probar diferentes métodos
- **Debugging conjunto**: Resolver problemas en grupo

### 📈 Indicadores de Progreso

- **Básico**: Selecciona elementos y modifica contenido
- **Intermedio**: Maneja eventos y crea elementos dinámicos
- **Avanzado**: Implementa event delegation y optimiza performance

---

## 🔗 Recursos Adicionales

### 📚 Documentación

- [MDN DOM Reference](https://developer.mozilla.org/es/docs/Web/API/Document_Object_Model)
- [MDN Event Reference](https://developer.mozilla.org/es/docs/Web/Events)
- [W3Schools DOM Tutorial](https://www.w3schools.com/js/js_htmldom.asp)

### 🛠️ Herramientas

- **Chrome DevTools**: Debugging y experimentación
- **Firefox Developer Tools**: Alternativa robusta
- **VS Code Extensions**: HTML CSS Support, Live Server

### 🎯 Preparación para Mañana

- Revisar funciones avanzadas
- Preparar ejemplos de callbacks
- Repasar scope y hoisting
- Planificar proyecto integrador

---

_¡Recuerda que la práctica hace al maestro! Cada manipulación DOM que practiques hoy te acerca más a ser un desarrollador competente._
