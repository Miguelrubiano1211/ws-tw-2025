# 📅 Día 7: JavaScript Avanzado - Cronograma Detallado

## 🎯 Información General

- **Tema**: Conceptos Avanzados I (Scope, Hoisting, Arrow Functions, Callbacks)
- **Duración**: 10 horas intensivas
- **Metodología**: Teoría + Práctica + Proyecto
- **Evaluación**: Continua y proyecto final

---

## 🌅 BLOQUE 1: Scope y Hoisting (09:00-10:30)

### 09:00-09:15: Introducción y Objetivos

**Actividad**: Presentación del día

- Repaso rápido del día anterior
- Objetivos de aprendizaje
- Conexión con conceptos previos
- Motivación y relevancia

**Resultados esperados**:

- Estudiantes enfocados y motivados
- Comprensión del roadmap del día
- Conexión con conocimientos previos

### 09:15-09:45: Scope (Ámbito de Variables)

**Actividad**: Explicación teórica con ejemplos

**Conceptos clave**:

```javascript
// Global scope
var globalVar = 'Soy global';

function ejemploScope() {
  // Function scope
  var funcionVar = 'Soy de función';

  if (true) {
    // Block scope
    let blockVar = 'Soy de bloque';
    const blockConst = 'También soy de bloque';
  }
}
```

**Temas a cubrir**:

- Scope global vs local
- Function scope vs block scope
- Lexical scoping
- Shadowing de variables

**Ejercicio rápido**: Predecir salida de código con diferentes scopes

### 09:45-10:15: Hoisting

**Actividad**: Demostración interactiva

**Conceptos clave**:

```javascript
// Hoisting de variables
console.log(x); // undefined (no error)
var x = 5;

// Hoisting de funciones
miFuncion(); // "Funciona!"
function miFuncion() {
  console.log('Funciona!');
}

// Temporal Dead Zone
console.log(y); // ReferenceError
let y = 10;
```

**Temas a cubrir**:

- Hoisting de var vs let/const
- Hoisting de funciones
- Temporal Dead Zone
- Mejores prácticas

### 10:15-10:30: Ejercicios Prácticos

**Actividad**: Resolver ejercicios en parejas

- Ejercicio 1: Scope debugging
- Ejercicio 2: Hoisting quiz
- Ejercicio 3: Refactoring con let/const

**Tips para el instructor**:

- Circular por el aula ayudando
- Fomentar discusión entre estudiantes
- Aclarar dudas comunes

---

## ☕ DESCANSO (10:30-10:45)

---

## 🏹 BLOQUE 2: Arrow Functions (10:45-12:15)

### 10:45-11:15: Sintaxis de Arrow Functions

**Actividad**: Demostración paso a paso

**Conceptos clave**:

```javascript
// Función tradicional
function suma(a, b) {
  return a + b;
}

// Arrow function
const suma = (a, b) => a + b;

// Diferentes sintaxis
const saludar = nombre => `Hola ${nombre}`;
const obtenerNumero = () => 42;
const procesarArray = arr => arr.map(x => x * 2);
```

**Temas a cubrir**:

- Sintaxis básica
- Parámetros únicos sin paréntesis
- Return implícito
- Función sin parámetros

### 11:15-11:45: Diferencias con Funciones Tradicionales

**Actividad**: Comparación práctica

**Conceptos clave**:

```javascript
// Hoisting
console.log(funcionTradicional()); // "Funciona"
console.log(funcionFlecha()); // Error

function funcionTradicional() {
  return 'Funciona';
}

const funcionFlecha = () => 'También funciona';

// Arguments object
function tradicional() {
  console.log(arguments); // Funciona
}

const flecha = () => {
  console.log(arguments); // Error
};
```

**Temas a cubrir**:

- Hoisting differences
- Arguments object
- Cuándo usar cada una
- Legibilidad vs funcionalidad

### 11:45-12:15: Contexto `this` en Arrow Functions

**Actividad**: Ejercicios prácticos con `this`

**Conceptos clave**:

```javascript
const objeto = {
  nombre: 'Juan',

  // Función tradicional
  saludarTradicional: function () {
    console.log(`Hola, soy ${this.nombre}`);
  },

  // Arrow function
  saludarFlecha: () => {
    console.log(`Hola, soy ${this.nombre}`); // undefined
  },
};
```

**Temas a cubrir**:

- Binding de `this`
- Casos de uso apropiados
- Event handlers
- Métodos de objetos

**Ejercicio práctico**: Refactoring de funciones tradicionales a arrow functions

---

## 🍽️ ALMUERZO (12:15-13:30)

---

## 📞 BLOQUE 3: Callbacks y Funciones de Orden Superior (13:30-15:00)

### 13:30-14:00: Callbacks Básicos

**Actividad**: Implementación paso a paso

**Conceptos clave**:

```javascript
// Callback básico
function procesar(datos, callback) {
  const resultado = datos.map(x => x * 2);
  callback(resultado);
}

procesar([1, 2, 3], resultado => {
  console.log(resultado); // [2, 4, 6]
});

// Callback con error handling
function operacionAsincrona(callback) {
  setTimeout(() => {
    const error = null;
    const resultado = 'Operación exitosa';
    callback(error, resultado);
  }, 1000);
}
```

**Temas a cubrir**:

- Definición y uso
- Callback como parámetro
- Error-first callbacks
- Callback hell (introducción)

### 14:00-14:30: Funciones de Orden Superior

**Actividad**: Crear funciones que retornan funciones

**Conceptos clave**:

```javascript
// Función que retorna función
function crearMultiplicador(factor) {
  return function (numero) {
    return numero * factor;
  };
}

const duplicar = crearMultiplicador(2);
const triplicar = crearMultiplicador(3);

// Higher-order function avanzada
function decorador(funcion) {
  return function (...args) {
    console.log('Ejecutando función...');
    const resultado = funcion(...args);
    console.log('Función ejecutada');
    return resultado;
  };
}
```

**Temas a cubrir**:

- Funciones que retornan funciones
- Closure básico
- Decoradores simples
- Currying introducción

### 14:30-15:00: Métodos de Array Avanzados

**Actividad**: Práctica con map, filter, reduce

**Conceptos clave**:

```javascript
const numeros = [1, 2, 3, 4, 5];

// Map
const duplicados = numeros.map(x => x * 2);

// Filter
const pares = numeros.filter(x => x % 2 === 0);

// Reduce
const suma = numeros.reduce((acc, x) => acc + x, 0);

// Combinación
const resultado = numeros
  .filter(x => x > 2)
  .map(x => x * 2)
  .reduce((acc, x) => acc + x, 0);
```

**Temas a cubrir**:

- map, filter, reduce
- forEach vs map
- Chaining de métodos
- Casos de uso reales

---

## ☕ DESCANSO (15:00-15:15)

---

## 🎨 BLOQUE 4: Proyecto - Sistema de Filtros (15:15-18:00)

### 15:15-16:00: Análisis y Diseño del Proyecto

**Actividad**: Planificación del sistema de filtros

**Especificaciones del proyecto**:

- Sistema de filtros para productos
- Múltiples tipos de filtros (categoría, precio, rating)
- Filtros combinables
- Interfaz intuitiva
- Búsqueda en tiempo real

**Estructura del proyecto**:

```
sistema-filtros/
├── index.html          # Estructura HTML
├── styles.css          # Estilos responsive
├── script.js           # Lógica principal
└── data/
    └── productos.json  # Datos de ejemplo
```

**Funcionalidades clave**:

- Filtro por categoría
- Filtro por rango de precio
- Filtro por rating
- Búsqueda por texto
- Ordenamiento
- Reset de filtros

### 16:00-17:00: Implementación del Sistema

**Actividad**: Desarrollo guiado

**Fases de desarrollo**:

1. **Estructura HTML** (16:00-16:15)
2. **Estilos CSS** (16:15-16:30)
3. **Carga de datos** (16:30-16:40)
4. **Funciones de filtrado** (16:40-16:55)
5. **Interfaz de usuario** (16:55-17:00)

**Conceptos aplicados**:

- Arrow functions para callbacks
- Higher-order functions para filtros
- Scope adecuado para variables
- Callbacks para eventos

### 17:00-17:30: Testing y Refinamiento

**Actividad**: Pruebas y optimización

**Checklist de testing**:

- [ ] Todos los filtros funcionan individualmente
- [ ] Filtros se combinan correctamente
- [ ] Interfaz responde adecuadamente
- [ ] Performance es aceptable
- [ ] Código está bien estructurado

**Optimizaciones**:

- Debouncing para búsqueda
- Lazy loading si es necesario
- Mejoras de UX

### 17:30-18:00: Presentación y Evaluación

**Actividad**: Demo y feedback

**Estructura de presentación**:

- Demo del sistema (5 min/estudiante)
- Explicación del código clave
- Desafíos encontrados
- Soluciones implementadas

**Criterios de evaluación**:

- Funcionalidad correcta
- Uso apropiado de conceptos
- Calidad del código
- Creatividad en la solución

---

## 🎯 Objetivos de Aprendizaje por Bloque

### Bloque 1: Scope y Hoisting

- **Entender**: Cómo funciona el scope en JavaScript
- **Aplicar**: Mejores prácticas con let/const
- **Evitar**: Errores comunes de hoisting

### Bloque 2: Arrow Functions

- **Dominar**: Sintaxis y casos de uso
- **Diferenciar**: Cuándo usar arrow vs tradicional
- **Aplicar**: Correctamente el contexto `this`

### Bloque 3: Callbacks y Higher-Order

- **Implementar**: Callbacks efectivos
- **Crear**: Funciones de orden superior
- **Usar**: Métodos de array avanzados

### Bloque 4: Proyecto

- **Integrar**: Todos los conceptos del día
- **Desarrollar**: Sistema funcional completo
- **Demostrar**: Habilidades adquiridas

---

## 📚 Recursos de Apoyo

### Durante la Clase

- **Slides**: Conceptos clave visuales
- **Live coding**: Demostraciones en tiempo real
- **Ejercicios**: Práctica guiada
- **Proyecto**: Aplicación práctica

### Para Estudio

- **Documentación**: MDN y recursos oficiales
- **Ejercicios adicionales**: Práctica extra
- **Videos**: Explicaciones complementarias
- **Ejemplos**: Código de referencia

---

## 🎪 Tips para el Instructor

### Gestión del Tiempo

- **Ser flexible**: Ajustar según el ritmo del grupo
- **Priorizar**: Conceptos más importantes
- **Usar timers**: Para mantener el ritmo
- **Planificar breaks**: Mantener energía alta

### Técnicas de Enseñanza

- **Live coding**: Mostrar proceso de pensamiento
- **Preguntas guiadas**: Dirigir el aprendizaje
- **Pair programming**: Fomentar colaboración
- **Code review**: Mejorar calidad

### Manejo de Dificultades

- **Identificar**: Estudiantes con dificultades
- **Adaptar**: Explicaciones según necesidad
- **Motivar**: Mantener moral alta
- **Apoyar**: Proporcionar ayuda individual

---

## 🏆 Evaluación del Día

### Formativa (Durante el día)

- Participación en ejercicios
- Preguntas y respuestas
- Colaboración efectiva
- Comprensión demostrada

### Sumativa (Al final)

- Proyecto funcional
- Código limpio y comentado
- Uso correcto de conceptos
- Presentación clara

**¡Que tengas un día productivo y lleno de aprendizaje!** 🚀
