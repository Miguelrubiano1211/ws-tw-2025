# 📅 Día 8: JavaScript Avanzado II - Cronograma Detallado

## 🎯 Información General

- **Fecha**: Día 8 del programa intensivo
- **Duración**: 10 horas (09:00 - 18:00)
- **Temas**: Closures, Prototipos, Asincronismo
- **Proyecto**: Temporizador Avanzado

---

## 🌅 BLOQUE 1: Closures y Factory Functions (09:00-10:30)

### 📋 Objetivos del Bloque

- Comprender el concepto de closures
- Implementar factory functions
- Aplicar encapsulación con closures

### ⏰ 09:00-09:15 | Introducción al Día

**Actividad**: Presentación y objetivos

- Repaso rápido del Día 7
- Introducción a conceptos del Día 8
- Expectativas y metodología

**Instructor**:

- Conectar con conceptos previos
- Motivar la importancia de closures
- Mostrar ejemplos reales de uso

### ⏰ 09:15-09:45 | Concepto de Closures

**Actividad**: Teoría y ejemplos básicos

- Lexical scoping explicado
- Primer ejemplo de closure
- Casos de uso comunes

**Contenido**:

```javascript
// Ejemplo básico de closure
function externa() {
  let variable = 'Soy privada';

  return function interna() {
    console.log(variable);
  };
}

const funcionClosure = externa();
funcionClosure(); // "Soy privada"
```

**Instructor**:

- Usar debugger para mostrar scope
- Explicar por qué se mantiene la variable
- Comparar con variables globales

### ⏰ 09:45-10:15 | Factory Functions

**Actividad**: Implementación práctica

- Crear objetos con factory functions
- Métodos privados y públicos
- Ventajas sobre constructores

**Contenido**:

```javascript
function crearCoche(marca, modelo) {
  let kilometraje = 0;

  return {
    marca,
    modelo,
    conducir(km) {
      kilometraje += km;
      return `Has conducido ${km} km`;
    },
    obtenerKilometraje() {
      return kilometraje;
    },
  };
}
```

**Instructor**:

- Mostrar encapsulación real
- Comparar con objetos literales
- Explicar cuándo usar cada patrón

### ⏰ 10:15-10:30 | Ejercicios Prácticos

**Actividad**: Ejercicio 1 - Closures Básicos

- Crear contador privado
- Implementar factory de calculadoras
- Resolver problemas comunes

**Evaluación**:

- Verificar comprensión de closures
- Revisar implementación de factory
- Resolver dudas individuales

---

## ☕ DESCANSO (10:30-10:45)

---

## 🧬 BLOQUE 2: Prototipos y Herencia (10:45-12:15)

### 📋 Objetivos del Bloque

- Entender sistema de prototipos
- Implementar herencia prototípica
- Usar Object.create() y métodos relacionados

### ⏰ 10:45-11:15 | Sistema de Prototipos

**Actividad**: Exploración del prototipo

- Explicar [[Prototype]] y **proto**
- Función constructora y .prototype
- Cadena de prototipos

**Contenido**:

```javascript
function Persona(nombre) {
  this.nombre = nombre;
}

Persona.prototype.saludar = function () {
  return `Hola, soy ${this.nombre}`;
};

const juan = new Persona('Juan');
console.log(juan.saludar()); // "Hola, soy Juan"
```

**Instructor**:

- Usar herramientas de desarrollo
- Mostrar prototype chain visualmente
- Explicar diferencia con clases

### ⏰ 11:15-11:45 | Herencia Prototípica

**Actividad**: Implementar herencia

- Crear jerarquía de objetos
- Usar Object.create()
- Polimorfismo básico

**Contenido**:

```javascript
function Empleado(nombre, puesto) {
  Persona.call(this, nombre);
  this.puesto = puesto;
}

Empleado.prototype = Object.create(Persona.prototype);
Empleado.prototype.constructor = Empleado;

Empleado.prototype.trabajar = function () {
  return `${this.nombre} está trabajando como ${this.puesto}`;
};
```

**Instructor**:

- Explicar cada paso de la herencia
- Mostrar call() y apply()
- Comparar con herencia clásica

### ⏰ 11:45-12:15 | Métodos de Prototipo

**Actividad**: Ejercicios 3 y 4

- Object.create(), Object.getPrototypeOf()
- hasOwnProperty() y instanceof
- Ejercicios prácticos

**Evaluación**:

- Verificar comprensión de prototipos
- Revisar implementación de herencia
- Resolver problemas comunes

---

## 🍽️ ALMUERZO (12:15-13:30)

---

## ⏰ BLOQUE 3: Introducción al Asincronismo (13:30-15:00)

### 📋 Objetivos del Bloque

- Comprender programación asíncrona
- Usar setTimeout y setInterval
- Entender event loop básico

### ⏰ 13:30-14:00 | setTimeout y setInterval

**Actividad**: Timers en JavaScript

- Sintaxis y parámetros
- Callback asíncronos
- Cancelación de timers

**Contenido**:

```javascript
// setTimeout
const timer = setTimeout(() => {
  console.log('Ejecutado después de 2 segundos');
}, 2000);

// setInterval
const intervalo = setInterval(() => {
  console.log('Ejecutado cada segundo');
}, 1000);

// Cancelar
clearTimeout(timer);
clearInterval(intervalo);
```

**Instructor**:

- Demostrar asincronismo real
- Explicar diferencia con código síncrono
- Mostrar casos de uso comunes

### ⏰ 14:00-14:30 | Callbacks Asíncronos

**Actividad**: Patrones de callback

- Callback hell introducción
- Manejo de errores en callbacks
- Patrones para evitar anidación

**Contenido**:

```javascript
function operacionAsincrona(datos, callback) {
  setTimeout(() => {
    if (datos) {
      callback(null, `Procesado: ${datos}`);
    } else {
      callback(new Error('Datos inválidos'));
    }
  }, 1000);
}

operacionAsincrona('test', (error, resultado) => {
  if (error) {
    console.error(error);
  } else {
    console.log(resultado);
  }
});
```

**Instructor**:

- Mostrar patrón error-first
- Explicar callback hell
- Preparar para promesas

### ⏰ 14:30-15:00 | Event Loop y Stack

**Actividad**: Comprensión del event loop

- Call stack explicado
- Task queue y microtask queue
- Ejercicio 5 - Asincronismo

**Evaluación**:

- Verificar comprensión de asincronismo
- Revisar uso de timers
- Resolver dudas conceptuales

---

## ☕ DESCANSO (15:00-15:15)

---

## 🛠️ BLOQUE 4: Proyecto - Temporizador Avanzado (15:15-16:45)

### 📋 Objetivos del Bloque

- Aplicar todos los conceptos aprendidos
- Construir aplicación funcional
- Implementar patrones avanzados

### ⏰ 15:15-15:45 | Diseño y Estructura

**Actividad**: Planificación del proyecto

- Análisis de requerimientos
- Diseño de arquitectura
- Definición de clases/factories

**Estructura**:

```
temporizador-avanzado/
├── index.html
├── styles.css
├── script.js
└── README.md
```

**Instructor**:

- Guiar en decisiones de diseño
- Explicar separación de responsabilidades
- Mostrar mejores prácticas

### ⏰ 15:45-16:15 | Implementación Core

**Actividad**: Desarrollo principal

- Factory function para timers
- Closures para estado privado
- Prototipos para funcionalidad compartida

**Características**:

- Múltiples temporizadores
- Persistencia de estado
- Eventos y notificaciones
- Interfaz dinámica

**Instructor**:

- Ayudar con implementación
- Revisar código en tiempo real
- Sugerir mejoras

### ⏰ 16:15-16:45 | Funcionalidades Avanzadas

**Actividad**: Características adicionales

- Sistema de notificaciones
- Persistencia con localStorage
- Animaciones y transiciones
- Testing básico

**Evaluación**:

- Revisar implementación completa
- Verificar uso de conceptos
- Preparar para presentación

---

## 📊 BLOQUE 5: Revisión y Evaluación (16:45-18:00)

### 📋 Objetivos del Bloque

- Evaluar comprensión de conceptos
- Presentar proyectos
- Preparar siguiente día

### ⏰ 16:45-17:15 | Presentación de Proyectos

**Actividad**: Demos individuales

- Presentación de 3 minutos por estudiante
- Demostración de funcionalidades
- Explicación de conceptos aplicados

**Criterios de Evaluación**:

- Funcionalidad completa
- Uso de closures
- Implementación de prototipos
- Asincronismo aplicado

### ⏰ 17:15-17:45 | Evaluación Práctica

**Actividad**: Quiz y ejercicios

- Preguntas conceptuales
- Ejercicios de código
- Debugging de problemas

**Temas Evaluados**:

- Closures y lexical scope
- Prototipos y herencia
- Asincronismo básico
- Patrones de diseño

### ⏰ 17:45-18:00 | Preparación Día 9

**Actividad**: Introducción al siguiente día

- Conexión con conceptos actuales
- Introducción a Promises
- Asignación de preparación

---

## 🎯 Puntos Clave para el Instructor

### 🔧 Herramientas Recomendadas

- **Chrome DevTools**: Para mostrar prototype chain
- **VS Code**: Con extensiones para debugging
- **Codepen/JSBin**: Para demos rápidas
- **Git**: Para versioning del proyecto

### 📚 Recursos de Apoyo

- Diagramas de closure scope
- Visualizaciones de prototype chain
- Ejemplos de callback hell
- Patrones de diseño comunes

### ⚠️ Errores Comunes

- Confundir closure con scope global
- No entender this en prototipos
- Callback hell sin control
- Mezclar patrones inconsistentemente

### 💡 Tips para Explicar

- Usar analogías reales para closures
- Dibujar prototype chain en pizarra
- Demostrar asincronismo con timers reales
- Mostrar debugging paso a paso

### 🎯 Indicadores de Éxito

- Estudiantes implementan closures sin ayuda
- Comprenden herencia prototípica
- Usan asincronismo apropiadamente
- Aplican patrones en proyecto real

---

## 📝 Recursos Adicionales

### 📖 Lecturas Complementarias

- "Understanding JavaScript Closures" - MDN
- "Prototypal Inheritance in JavaScript" - JavaScript.info
- "The Event Loop" - Philip Roberts

### 🎥 Videos Recomendados

- "What the heck is the event loop anyway?" - Philip Roberts
- "JavaScript Closures Explained" - Fun Fun Function
- "Prototypes in JavaScript" - MPJ

### 🏋️ Ejercicios Extra

- Implementar módulo con closures
- Crear sistema de herencia complejo
- Simular Promise con callbacks

---

**🎯 Objetivo del día**: Al finalizar, los estudiantes dominarán closures, prototipos y asincronismo básico, preparándolos para conceptos avanzados de programación asíncrona.

**📊 Métrica de éxito**: 80% de estudiantes completan el proyecto usando todos los conceptos apropiadamente.
