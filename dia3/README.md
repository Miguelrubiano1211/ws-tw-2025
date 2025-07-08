# 🚀 Día 3 - JavaScript ES6+ Fundamentals

## 🎯 Bienvenidos al Día 3

¡Hoy damos el gran salto hacia el JavaScript moderno! En este día transformaremos tu comprensión de JavaScript desde lo básico hasta las características más avanzadas de ES6+. Prepárate para escribir código más limpio, eficiente y moderno.

## 📋 Agenda del Día

### 🌅 Mañana (12:00 - 13:15)

- **12:00-12:25**: Variables, const, let, template literals
- **12:25-12:50**: Functions, arrow functions, destructuring
- **12:50-13:15**: Array methods (map, filter, reduce)

### 🌟 Tarde (13:30 - 17:00)

- **13:30-13:55**: Objects, classes, modules
- **13:55-14:20**: Async/await y Promises
- **14:20-14:45**: Error handling y debugging
- **15:00-15:25**: DOM manipulation moderna
- **15:25-15:50**: Event handling y delegation
- **15:50-16:15**: Práctica: Reloj digital interactivo
- **16:15-17:00**: Challenge: Algoritmos de palindromos y rotación

## 🎯 Objetivos de Aprendizaje

Al finalizar este día, serás capaz de:

### 💡 Conceptos Fundamentales

- ✅ Utilizar variables modernas (`let`, `const`) con scope correcto
- ✅ Aplicar template literals para interpolación de strings
- ✅ Dominar arrow functions y sus diferencias con funciones tradicionales
- ✅ Implementar destructuring para arrays y objetos

### 🔧 Técnicas Avanzadas

- ✅ Crear y consumir Promises con async/await
- ✅ Manejar errores asíncronos robustamente
- ✅ Manipular el DOM con APIs modernas
- ✅ Implementar event delegation para performance

### 🏗️ Programación Orientada a Objetos

- ✅ Crear clases ES6 con inheritance
- ✅ Organizar código con módulos ES6
- ✅ Aplicar patrones de diseño modernos

### 🧠 Resolución de Problemas

- ✅ Resolver algoritmos de programación competitiva
- ✅ Optimizar código para performance
- ✅ Debuggear efectivamente con DevTools

## 📚 Recursos del Día

### 📁 Estructura de Archivos

```
dia3/
├── index.html              # Página principal
├── css/
│   └── styles.css          # Estilos base
├── js/
│   ├── main.js            # JavaScript principal
│   ├── utils.js           # Utilidades comunes
│   ├── clock.js           # Reloj digital
│   └── algorithms.js      # Algoritmos challenge
├── ejercicios/
│   ├── 01-variables.js    # Variables y template literals
│   ├── 02-functions.js    # Arrow functions y destructuring
│   ├── 03-arrays.js       # Array methods
│   ├── 04-classes.js      # Classes y modules
│   ├── 05-async.js        # Async/await
│   └── 06-dom.js          # DOM manipulation
└── proyectos/
    ├── reloj-digital/     # Proyecto principal
    └── algoritmos/        # Challenge algorithms
```

### 🛠️ Herramientas Necesarias

- **VS Code** con extensiones de JavaScript
- **Chrome DevTools** para debugging
- **Node.js** (opcional, para módulos)
- **Git** para control de versiones

### 📖 Referencias Importantes

- [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [ES6 Features](https://github.com/lukehoban/es6features)
- [JavaScript.info](https://javascript.info/)
- [You Don't Know JS](https://github.com/getify/You-Dont-Know-JS)

## 🎮 Ejercicios Prácticos

### Ejercicio 1: Variables y Template Literals

```javascript
// Convertir este código ES5 a ES6+
var userName = 'Juan';
var userAge = 25;
var userMessage = 'Hola, ' + userName + '! Tienes ' + userAge + ' años.';
console.log(userMessage);

// Tu solución aquí...
```

### Ejercicio 2: Arrow Functions

```javascript
// Convertir a arrow functions
function calculateArea(width, height) {
  return width * height;
}

function processNumbers(numbers) {
  return numbers.map(function (num) {
    return num * 2;
  });
}

// Tu solución aquí...
```

### Ejercicio 3: Array Methods

```javascript
const students = [
  { name: 'Ana', grade: 85, subject: 'Math' },
  { name: 'Luis', grade: 92, subject: 'Science' },
  { name: 'María', grade: 78, subject: 'Math' },
  { name: 'Carlos', grade: 88, subject: 'Science' },
];

// Tareas:
// 1. Obtener solo los nombres de los estudiantes
// 2. Filtrar estudiantes con nota > 80
// 3. Calcular la nota promedio
// 4. Agrupar por materia

// Tu solución aquí...
```

## 🏆 Proyecto Principal: Reloj Digital Interactivo

### Características Requeridas

- **Múltiples zonas horarias**: Local, Nueva York, Londres, Tokio
- **Formato flexible**: 12/24 horas
- **Cronómetro**: Con lap times
- **Temporizador**: Countdown con alertas
- **Alarmas**: Múltiples alarmas programables
- **Temas**: Modo oscuro/claro
- **Responsive**: Adaptable a móviles

### Tecnologías a Usar

- **JavaScript ES6+**: Classes, modules, async/await
- **DOM API**: Modern manipulation
- **CSS3**: Animations y transitions
- **LocalStorage**: Persistencia de configuración

### Estructura del Proyecto

```javascript
class WorldClock {
  constructor() {
    this.timezones = [];
    this.alarms = [];
    this.theme = 'light';
    this.format24h = true;
    this.init();
  }

  init() {
    this.loadSettings();
    this.createInterface();
    this.startClock();
    this.bindEvents();
  }

  // Más métodos...
}
```

## 🧠 Challenge: Algoritmos de Programación

### Algoritmos a Resolver (45 minutos)

#### 1. Palindrome Detection

```javascript
/**
 * Determinar si una string es un palíndromo
 * @param {string} str - String a verificar
 * @return {boolean} - true si es palíndromo
 */
const isPalindrome = str => {
  // Tu implementación aquí
};
```

#### 2. String Rotation

```javascript
/**
 * Verificar si s2 es una rotación de s1
 * @param {string} s1 - String original
 * @param {string} s2 - String a verificar
 * @return {boolean} - true si s2 es rotación de s1
 */
const isRotation = (s1, s2) => {
  // Tu implementación aquí
};
```

#### 3. Array Rotation

```javascript
/**
 * Rotar array k posiciones a la derecha
 * @param {number[]} nums - Array a rotar
 * @param {number} k - Posiciones a rotar
 * @return {number[]} - Array rotado
 */
const rotateArray = (nums, k) => {
  // Tu implementación aquí
};
```

## 📊 Evaluación

### Criterios de Evaluación

- **Funcionalidad** (40%): Código que funciona correctamente
- **Calidad** (30%): Clean code, documentación, organización
- **Eficiencia** (20%): Performance y optimización
- **Creatividad** (10%): Soluciones innovadoras

### Entregables

1. **Ejercicios completados** con código funcional
2. **Reloj digital** completamente funcional
3. **Mínimo 3 algoritmos** resueltos correctamente
4. **Documentación** clara en README
5. **Git repository** con commits organizados

### Niveles de Logro

- **Básico (70-79%)**: Completa ejercicios básicos
- **Intermedio (80-89%)**: Proyecto funcional + 3 algoritmos
- **Avanzado (90-100%)**: Proyecto optimizado + 5 algoritmos

## 🎯 Preparación para el Día 4

### Próximos Temas

- **Regular Expressions**: Validación avanzada
- **Form Validation**: Técnicas robustas
- **Security**: XSS, CSRF prevention
- **Input Sanitization**: Prácticas seguras

### Recomendaciones

- Practicar RegExp en [RegExp101](https://regex101.com/)
- Leer sobre [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- Revisar validación de formularios
- Investigar Content Security Policy (CSP)

## 💡 Tips para el Éxito

### 🚀 Estrategias de Aprendizaje

- **Práctica inmediata**: Codifica cada concepto al momento
- **Experimenta**: Prueba variaciones del código
- **Debugging activo**: Usa console.log y DevTools
- **Pregunta**: No dudes en pedir ayuda

### ⏰ Gestión del Tiempo

- **Pomodoro**: 25 minutos código, 5 minutos descanso
- **Checkpoints**: Revisa progreso cada hora
- **Priorización**: Enfócate en objetivos principales
- **Flexibilidad**: Ajusta según tu ritmo

### 🏆 Preparación WorldSkills

- **Velocidad**: Practica shortcuts de teclado
- **Precisión**: Código sin errores desde el inicio
- **Organización**: Estructura clara de archivos
- **Testing**: Verifica funcionalidad constantemente

## 📞 Soporte y Recursos

### Durante el Día

- **Instructor**: Disponible para consultas
- **Compañeros**: Colaboración permitida
- **Documentación**: MDN, Stack Overflow
- **Tools**: Chrome DevTools, VS Code

### Recursos Adicionales

- [JavaScript30](https://javascript30.com/) - Ejercicios prácticos
- [Eloquent JavaScript](https://eloquentjavascript.net/) - Libro gratuito
- [freeCodeCamp](https://www.freecodecamp.org/) - Cursos interactivos
- [LeetCode](https://leetcode.com/) - Algoritmos y estructuras

---

## 🎉 ¡Vamos a Crear Código Increíble!

El Día 3 es tu oportunidad de dominar JavaScript moderno y dar un salto cuántico en tus habilidades de programación. Cada concepto que aprendas hoy será fundamental para React, Node.js y desarrollo web avanzado.

**¡Estás preparado para convertirte en un desarrollador JavaScript excepcional!** 🚀✨

---

### 📅 Cronograma Rápido

```
12:00-12:25  Variables y template literals
12:25-12:50  Arrow functions y destructuring
12:50-13:15  Array methods (map, filter, reduce)
13:15-13:30  🍽️ DESCANSO
13:30-13:55  Objects, classes, modules
13:55-14:20  Async/await y Promises
14:20-14:45  Error handling y debugging
14:45-15:00  🍽️ DESCANSO
15:00-15:25  DOM manipulation moderna
15:25-15:50  Event handling y delegation
15:50-16:15  Práctica: Reloj digital interactivo
16:15-17:00  Challenge: Algoritmos
```

**¡Que comience la aventura JavaScript!** 🎯🔥
