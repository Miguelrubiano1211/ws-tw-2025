# ✅ Checklist Día 6: DOM y Eventos

## 📋 Información de Control

**Fecha**: ******\_\_\_******
**Estudiante**: ******\_\_\_******
**Instructor**: ******\_\_\_******
**Inicio**: ******\_\_\_******
**Fin**: ******\_\_\_******

---

## 🎯 Objetivos del Día

### 📚 Conceptos Fundamentales

- [ ] **DOM (Document Object Model)**

  - [ ] Comprende qué es el DOM y cómo funciona
  - [ ] Entiende la estructura de árbol del HTML
  - [ ] Conoce la relación entre HTML, CSS y JavaScript
  - [ ] Puede explicar cómo los navegadores crean el DOM

- [ ] **Selección de Elementos**

  - [ ] Domina `document.getElementById()`
  - [ ] Usa `document.querySelector()` correctamente
  - [ ] Maneja `document.querySelectorAll()`
  - [ ] Conoce `getElementsByClassName()` y `getElementsByTagName()`
  - [ ] Comprende las diferencias entre métodos

- [ ] **Manipulación de Contenido**
  - [ ] Diferencia entre `innerHTML` y `textContent`
  - [ ] Modifica contenido de elementos dinámicamente
  - [ ] Maneja atributos con `setAttribute()` y `getAttribute()`
  - [ ] Distingue entre propiedades y atributos

### 🎨 Manipulación de Estilos

- [ ] **Estilos CSS**

  - [ ] Modifica estilos usando `element.style`
  - [ ] Comprende las limitaciones de estilos inline
  - [ ] Sabe cuándo usar CSS vs JavaScript para estilos

- [ ] **Clases CSS**
  - [ ] Usa `classList.add()` y `classList.remove()`
  - [ ] Implementa `classList.toggle()` efectivamente
  - [ ] Verifica clases con `classList.contains()`
  - [ ] Comprende ventajas de `classList` sobre `className`

### 🔄 Creación y Eliminación de Elementos

- [ ] **Creación de Elementos**

  - [ ] Crea elementos con `document.createElement()`
  - [ ] Configura propiedades y contenido de elementos nuevos
  - [ ] Añade elementos al DOM con `appendChild()`
  - [ ] Usa `insertBefore()` para posicionamiento específico

- [ ] **Eliminación de Elementos**

  - [ ] Elimina elementos con `remove()`
  - [ ] Usa `removeChild()` cuando es necesario
  - [ ] Comprende las diferencias entre métodos de eliminación

- [ ] **Navegación DOM**
  - [ ] Navega con `parentNode`, `parentElement`
  - [ ] Accede a hijos con `childNodes`, `children`
  - [ ] Usa `nextSibling`, `previousSibling`
  - [ ] Comprende diferencias entre Node y Element

### ⚡ Eventos

- [ ] **Conceptos Básicos**

  - [ ] Comprende qué son los eventos
  - [ ] Conoce tipos de eventos: mouse, keyboard, form, window
  - [ ] Diferencia entre event handlers y event listeners
  - [ ] Prefiere JavaScript events sobre inline events

- [ ] **Event Listeners**

  - [ ] Implementa `addEventListener()` correctamente
  - [ ] Usa `removeEventListener()` cuando necesario
  - [ ] Maneja múltiples listeners en un elemento
  - [ ] Prefiere named functions para mejor debugging

- [ ] **Objeto Event**
  - [ ] Usa propiedades del objeto event
  - [ ] Comprende `event.target` vs `event.currentTarget`
  - [ ] Implementa `event.preventDefault()` apropiadamente
  - [ ] Usa `event.stopPropagation()` cuando necesario

### 🎯 Eventos Avanzados

- [ ] **Propagación de Eventos**

  - [ ] Comprende event bubbling (burbujeo)
  - [ ] Entiende event capturing (captura)
  - [ ] Conoce la fase de targeting
  - [ ] Usa `stopPropagation()` estratégicamente

- [ ] **Event Delegation**

  - [ ] Implementa event delegation correctamente
  - [ ] Comprende las ventajas del event delegation
  - [ ] Maneja elementos dinámicos eficientemente
  - [ ] Optimiza performance con delegation

- [ ] **Eventos de Formularios**
  - [ ] Maneja evento `submit` en formularios
  - [ ] Usa eventos `input`, `change`, `focus`, `blur`
  - [ ] Accede a valores de formularios
  - [ ] Implementa validación básica

---

## 🛠️ Ejercicios Prácticos

### 📝 Ejercicio 1: Selección DOM

- [ ] **Archivo**: `01-seleccion-dom.html`
- [ ] **Objetivos**:

  - [ ] Seleccionar elementos por ID
  - [ ] Seleccionar elementos por clase
  - [ ] Usar selectores CSS avanzados
  - [ ] Comparar diferentes métodos de selección

- [ ] **Funcionalidades Implementadas**:

  - [ ] Selección por ID funciona correctamente
  - [ ] Selección por clase funciona correctamente
  - [ ] QuerySelector funciona con selectores complejos
  - [ ] Manejo de elementos no existentes

- [ ] **Calidad del Código**:
  - [ ] Código limpio y bien comentado
  - [ ] Manejo de errores básico
  - [ ] Nombres de variables descriptivos

### 📝 Ejercicio 2: Manipulación de Contenido

- [ ] **Archivo**: `02-manipulacion-contenido.html`
- [ ] **Objetivos**:

  - [ ] Modificar contenido de elementos
  - [ ] Cambiar atributos dinámicamente
  - [ ] Distinguir entre innerHTML y textContent
  - [ ] Manipular propiedades de elementos

- [ ] **Funcionalidades Implementadas**:

  - [ ] Cambio de contenido funciona
  - [ ] Modificación de atributos funciona
  - [ ] Uso correcto de innerHTML vs textContent
  - [ ] Manipulación de propiedades (src, href, etc.)

- [ ] **Calidad del Código**:
  - [ ] Uso apropiado de cada método
  - [ ] Código bien estructurado
  - [ ] Comentarios explicativos

### 📝 Ejercicio 3: Estilos y Clases

- [ ] **Archivo**: `03-estilos-clases.html`
- [ ] **Objetivos**:

  - [ ] Modificar estilos con JavaScript
  - [ ] Agregar y remover clases CSS
  - [ ] Implementar toggle de clases
  - [ ] Verificar presencia de clases

- [ ] **Funcionalidades Implementadas**:

  - [ ] Cambio de estilos funciona
  - [ ] Agregar/remover clases funciona
  - [ ] Toggle de clases funciona
  - [ ] Verificación de clases funciona

- [ ] **Calidad del Código**:
  - [ ] Separación apropiada de CSS y JavaScript
  - [ ] Uso eficiente de classList
  - [ ] Estilos bien organizados

### 📝 Ejercicio 4: Crear y Eliminar Elementos

- [ ] **Archivo**: `04-crear-eliminar.html`
- [ ] **Objetivos**:

  - [ ] Crear elementos dinámicamente
  - [ ] Agregar elementos al DOM
  - [ ] Eliminar elementos del DOM
  - [ ] Clonar elementos existentes

- [ ] **Funcionalidades Implementadas**:

  - [ ] Creación de elementos funciona
  - [ ] Agregar al DOM funciona
  - [ ] Eliminación de elementos funciona
  - [ ] Clonación de elementos funciona

- [ ] **Calidad del Código**:
  - [ ] Gestión apropiada de memoria
  - [ ] Código eficiente
  - [ ] Manejo de casos edge

### 📝 Ejercicio 5: Eventos Básicos

- [ ] **Archivo**: `05-eventos-basicos.html`
- [ ] **Objetivos**:

  - [ ] Implementar event listeners básicos
  - [ ] Manejar diferentes tipos de eventos
  - [ ] Usar objeto event correctamente
  - [ ] Prevenir comportamientos por defecto

- [ ] **Funcionalidades Implementadas**:

  - [ ] Event listeners funcionan correctamente
  - [ ] Manejo de diferentes tipos de eventos
  - [ ] Uso correcto del objeto event
  - [ ] preventDefault() implementado apropiadamente

- [ ] **Calidad del Código**:
  - [ ] Event listeners bien organizados
  - [ ] Manejo de errores
  - [ ] Código reutilizable

### 📝 Ejercicio 6: Eventos Avanzados

- [ ] **Archivo**: `06-eventos-avanzados.html`
- [ ] **Objetivos**:

  - [ ] Implementar event delegation
  - [ ] Manejar propagación de eventos
  - [ ] Trabajar con elementos dinámicos
  - [ ] Optimizar performance de eventos

- [ ] **Funcionalidades Implementadas**:

  - [ ] Event delegation funciona
  - [ ] Propagación de eventos controlada
  - [ ] Elementos dinámicos manejados correctamente
  - [ ] Performance optimizada

- [ ] **Calidad del Código**:
  - [ ] Código escalable
  - [ ] Eficiencia en manejo de eventos
  - [ ] Arquitectura bien pensada

### 📝 Ejercicio 7: Validación de Formularios

- [ ] **Archivo**: `07-validacion-formularios.html`
- [ ] **Objetivos**:

  - [ ] Validar formularios con JavaScript
  - [ ] Mostrar mensajes de error
  - [ ] Manejar diferentes tipos de input
  - [ ] Implementar validación en tiempo real

- [ ] **Funcionalidades Implementadas**:

  - [ ] Validación de formularios funciona
  - [ ] Mensajes de error apropiados
  - [ ] Diferentes tipos de validación
  - [ ] Validación en tiempo real

- [ ] **Calidad del Código**:
  - [ ] Validaciones robustas
  - [ ] UX bien pensada
  - [ ] Código mantenible

---

## 🎯 Proyecto Principal: Lista de Tareas

### 📁 Estructura del Proyecto

- [ ] **Archivos Base**:
  - [ ] `index.html` - Estructura HTML correcta
  - [ ] `styles.css` - Estilos CSS bien organizados
  - [ ] `script.js` - Lógica JavaScript funcional
  - [ ] `README.md` - Documentación del proyecto

### 🎯 Funcionalidades Básicas

- [ ] **Agregar Tareas**:

  - [ ] Formulario para agregar tareas funciona
  - [ ] Validación de input no vacío
  - [ ] Limpieza de formulario después de agregar
  - [ ] Feedback visual al usuario

- [ ] **Mostrar Tareas**:

  - [ ] Lista de tareas se muestra correctamente
  - [ ] Cada tarea tiene estructura HTML apropiada
  - [ ] Estilos CSS aplicados correctamente
  - [ ] Responsive design implementado

- [ ] **Marcar como Completadas**:

  - [ ] Click en tarea la marca como completada
  - [ ] Estilos visuales cambian apropiadamente
  - [ ] Estado se mantiene consistente
  - [ ] Toggle funciona correctamente

- [ ] **Eliminar Tareas**:
  - [ ] Botón de eliminar funciona
  - [ ] Confirmación antes de eliminar
  - [ ] Elemento se remueve del DOM
  - [ ] Lista se actualiza correctamente

### 🎯 Funcionalidades Avanzadas

- [ ] **Editar Tareas**:

  - [ ] Doble click permite editar
  - [ ] Input de edición funciona
  - [ ] Guardar cambios funciona
  - [ ] Cancelar edición funciona

- [ ] **Filtrar Tareas**:

  - [ ] Filtro "Todas" funciona
  - [ ] Filtro "Completadas" funciona
  - [ ] Filtro "Pendientes" funciona
  - [ ] Transiciones suaves entre filtros

- [ ] **Contador de Tareas**:

  - [ ] Contador de tareas totales
  - [ ] Contador de tareas completadas
  - [ ] Contador de tareas pendientes
  - [ ] Actualización automática

- [ ] **Persistencia**:
  - [ ] Datos se guardan en localStorage
  - [ ] Datos se cargan al iniciar aplicación
  - [ ] Sincronización automática
  - [ ] Manejo de errores de storage

### 🎨 Calidad de Interfaz

- [ ] **Diseño**:

  - [ ] Interfaz intuitiva y atractiva
  - [ ] Colores y tipografía apropiados
  - [ ] Espaciado y alineación correctos
  - [ ] Responsive en diferentes dispositivos

- [ ] **Experiencia de Usuario**:

  - [ ] Navegación fluida
  - [ ] Feedback visual apropiado
  - [ ] Estados de loading/error
  - [ ] Accesibilidad básica

- [ ] **Animaciones**:
  - [ ] Transiciones suaves
  - [ ] Efectos de hover
  - [ ] Animaciones de entrada/salida
  - [ ] Performance optimizada

### 💻 Calidad Técnica

- [ ] **Código JavaScript**:

  - [ ] Código bien estructurado
  - [ ] Funciones pequeñas y enfocadas
  - [ ] Variables con nombres descriptivos
  - [ ] Comentarios explicativos

- [ ] **Manejo de Eventos**:

  - [ ] Event delegation implementado
  - [ ] Eventos optimizados
  - [ ] Manejo de errores
  - [ ] Cleanup apropiado

- [ ] **Performance**:
  - [ ] Manipulaciones DOM optimizadas
  - [ ] Eventos eficientes
  - [ ] Memoria bien gestionada
  - [ ] Código escalable

---

## 🏆 Evaluación Final

### 📊 Criterios de Evaluación

#### ✅ Conocimiento Básico (40%)

- [ ] **Selección DOM**: Usa métodos apropiados para seleccionar elementos
- [ ] **Manipulación**: Modifica contenido, atributos y estilos correctamente
- [ ] **Eventos**: Implementa event listeners básicos funcionales
- [ ] **Formularios**: Maneja validación básica de formularios

**Puntuación**: **\_** / 40

#### ⭐ Conocimiento Intermedio (35%)

- [ ] **Creación Dinámica**: Crea y elimina elementos eficientemente
- [ ] **Eventos Avanzados**: Maneja propagación y delegation
- [ ] **Validación**: Implementa validación robusta y UX apropiada
- [ ] **Optimización**: Código eficiente y bien estructurado

**Puntuación**: **\_** / 35

#### 🚀 Conocimiento Avanzado (25%)

- [ ] **Arquitectura**: Código escalable y mantenible
- [ ] **Performance**: Optimizaciones avanzadas implementadas
- [ ] **UX**: Experiencia de usuario excepcional
- [ ] **Best Practices**: Siguiendo estándares de la industria

**Puntuación**: **\_** / 25

### 🎯 Puntuación Total

**Total**: **\_** / 100

### 📈 Nivel Alcanzado

- [ ] **Principiante** (0-59): Necesita refuerzo en conceptos básicos
- [ ] **Intermedio** (60-79): Domina conceptos básicos, trabajar en avanzados
- [ ] **Avanzado** (80-89): Excelente dominio, listo para desafíos mayores
- [ ] **Experto** (90-100): Dominio completo, puede mentorear a otros

---

## 📝 Observaciones del Instructor

### 🎯 Fortalezas Identificadas

```
_________________________________________________
_________________________________________________
_________________________________________________
_________________________________________________
```

### 🔧 Áreas de Mejora

```
_________________________________________________
_________________________________________________
_________________________________________________
_________________________________________________
```

### 🚀 Recomendaciones para el Siguiente Día

```
_________________________________________________
_________________________________________________
_________________________________________________
_________________________________________________
```

### 🏆 Comentarios Adicionales

```
_________________________________________________
_________________________________________________
_________________________________________________
_________________________________________________
```

---

## 📋 Firma de Verificación

**Estudiante**: ************\_************ **Fecha**: ******\_******

**Instructor**: ************\_************ **Fecha**: ******\_******

---

## 🔗 Recursos para Práctica Adicional

### 📚 Documentación

- [ ] [MDN DOM Reference](https://developer.mozilla.org/es/docs/Web/API/Document_Object_Model)
- [ ] [MDN Event Reference](https://developer.mozilla.org/es/docs/Web/Events)
- [ ] [W3Schools DOM Tutorial](https://www.w3schools.com/js/js_htmldom.asp)

### 🎯 Ejercicios Adicionales

- [ ] Crear un carousel de imágenes
- [ ] Implementar un modal dinámico
- [ ] Desarrollar un sistema de tabs
- [ ] Crear un formulario de múltiples pasos

### 🛠️ Proyectos Sugeridos

- [ ] Calculadora interactiva
- [ ] Juego de memoria
- [ ] Lista de compras
- [ ] Reproductor de música básico

---

_Recuerda: La práctica constante es la clave para dominar DOM y eventos. ¡Cada interacción que programes te acerca más a ser un desarrollador experto!_
