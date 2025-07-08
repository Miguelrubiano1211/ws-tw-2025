# 📅 Día 3 - JavaScript ES6+ Fundamentals - Cronograma Detallado

## 🎯 Objetivo General

Dominar las características modernas de JavaScript ES6+ y aplicarlas en proyectos prácticos, preparando a los estudiantes para desarrollo frontend avanzado y algoritmos de programación competitiva.

---

## 🕐 12:00-12:25 | Variables, const, let, template literals

### 📋 Objetivos Específicos

- Entender las diferencias entre `var`, `let`, y `const`
- Aplicar template literals para interpolación de strings
- Dominar el scope y hoisting en ES6+

### 📚 Contenido Teórico (10 minutos)

```javascript
// Diferencias entre var, let, const
var oldWay = 'function scoped';
let newWay = 'block scoped';
const constant = 'immutable binding';

// Template literals
const name = 'Juan';
const message = `Hola, ${name}! Bienvenido al bootcamp.`;

// Hoisting behavior
console.log(hoistedVar); // undefined
var hoistedVar = 'I am hoisted';
```

### 🛠️ Actividad Práctica (15 minutos)

**Ejercicio**: Convertir código ES5 a ES6+

- Refactorizar variables de `var` a `let`/`const`
- Convertir concatenación a template literals
- Implementar destructuring assignment

### 🎯 Resultados Esperados

- Código ES6+ funcional
- Comprensión de scope moderno
- Template literals aplicados correctamente

---

## 🕐 12:25-12:50 | Functions, arrow functions, destructuring

### 📋 Objetivos Específicos

- Dominar arrow functions y sus diferencias con funciones tradicionales
- Aplicar destructuring en arrays y objects
- Utilizar rest y spread operators

### 📚 Contenido Teórico (10 minutos)

```javascript
// Arrow functions
const add = (a, b) => a + b;
const multiply = (a, b) => {
  return a * b;
};

// Destructuring
const user = { name: 'Ana', age: 25 };
const { name, age } = user;

const numbers = [1, 2, 3, 4, 5];
const [first, second, ...rest] = numbers;

// Rest y spread
const sum = (...args) => args.reduce((a, b) => a + b, 0);
const newArray = [...numbers, 6, 7, 8];
```

### 🛠️ Actividad Práctica (15 minutos)

**Ejercicio**: Refactorizar funciones con arrow functions

- Convertir function declarations a arrow functions
- Implementar destructuring en parámetros
- Usar spread operator para arrays

### 🎯 Resultados Esperados

- Funciones modernas y concisas
- Destructuring aplicado correctamente
- Manejo fluido de rest/spread

---

## 🕐 12:50-13:15 | Arrays methods (map, filter, reduce)

### 📋 Objetivos Específicos

- Dominar métodos funcionales de arrays
- Aplicar programación funcional en JavaScript
- Optimizar manipulación de datos

### 📚 Contenido Teórico (10 minutos)

```javascript
const products = [
  { id: 1, name: 'Laptop', price: 999, category: 'electronics' },
  { id: 2, name: 'Book', price: 15, category: 'education' },
  { id: 3, name: 'Phone', price: 699, category: 'electronics' },
];

// Map - Transform data
const productNames = products.map(product => product.name);

// Filter - Select items
const electronics = products.filter(
  product => product.category === 'electronics'
);

// Reduce - Aggregate data
const totalPrice = products.reduce((sum, product) => sum + product.price, 0);

// Chaining methods
const expensiveElectronics = products
  .filter(p => p.category === 'electronics')
  .filter(p => p.price > 500)
  .map(p => p.name);
```

### 🛠️ Actividad Práctica (15 minutos)

**Ejercicio**: Procesamiento de datos con array methods

- Procesar un dataset de productos
- Aplicar filtros y transformaciones
- Calcular estadísticas con reduce

### 🎯 Resultados Esperados

- Manejo fluido de array methods
- Código funcional y declarativo
- Optimización de performance

---

## 🍽️ DESCANSO (13:15-13:30)

---

## 🕐 13:30-13:55 | Objects, classes, modules

### 📋 Objetivos Específicos

- Implementar ES6 classes y inheritance
- Aplicar módulos ES6 (import/export)
- Crear sistemas orientados a objetos

### 📚 Contenido Teórico (10 minutos)

```javascript
// ES6 Classes
class Product {
  constructor(name, price) {
    this.name = name;
    this.price = price;
  }

  getInfo() {
    return `${this.name}: $${this.price}`;
  }

  static comparePrice(a, b) {
    return a.price - b.price;
  }
}

// Inheritance
class Electronics extends Product {
  constructor(name, price, warranty) {
    super(name, price);
    this.warranty = warranty;
  }

  getWarranty() {
    return `${this.warranty} months warranty`;
  }
}

// Modules
// utils.js
export const formatPrice = price => `$${price.toFixed(2)}`;
export default class Calculator {
  add(a, b) {
    return a + b;
  }
}

// main.js
import Calculator, { formatPrice } from './utils.js';
```

### 🛠️ Actividad Práctica (15 minutos)

**Ejercicio**: Sistema de clases para e-commerce

- Crear jerarquía de clases de productos
- Implementar métodos estáticos
- Configurar módulos ES6

### 🎯 Resultados Esperados

- Sistema OOP funcional
- Módulos organizados
- Inheritance aplicado correctamente

---

## 🕐 13:55-14:20 | Async/await y Promises

### 📋 Objetivos Específicos

- Dominar Promises y async/await
- Manejar operaciones asíncronas
- Implementar error handling robusto

### 📚 Contenido Teórico (10 minutos)

```javascript
// Promises
const fetchData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const data = { id: 1, name: 'User' };
      resolve(data);
    }, 1000);
  });
};

// Async/await
const loadUserData = async () => {
  try {
    const user = await fetchData();
    console.log('User loaded:', user);
    return user;
  } catch (error) {
    console.error('Error loading user:', error);
    throw error;
  }
};

// Promise.all for parallel operations
const loadAllData = async () => {
  const [users, products, orders] = await Promise.all([
    fetchUsers(),
    fetchProducts(),
    fetchOrders(),
  ]);

  return { users, products, orders };
};
```

### 🛠️ Actividad Práctica (15 minutos)

**Ejercicio**: API calls con async/await

- Implementar fetch con async/await
- Manejar errores con try/catch
- Usar Promise.all para operaciones paralelas

### 🎯 Resultados Esperados

- Manejo fluido de async/await
- Error handling robusto
- Operaciones paralelas optimizadas

---

## 🕐 14:20-14:45 | Error handling y debugging

### 📋 Objetivos Específicos

- Implementar manejo de errores comprehensivo
- Dominar técnicas de debugging
- Crear sistemas de logging

### 📚 Contenido Teórico (10 minutos)

```javascript
// Custom Error Classes
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

// Comprehensive error handling
const validateUser = user => {
  if (!user.email) {
    throw new ValidationError('Email is required', 'email');
  }
  if (!user.password || user.password.length < 6) {
    throw new ValidationError(
      'Password must be at least 6 characters',
      'password'
    );
  }
};

// Debugging utilities
const debug = {
  log: (message, data) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEBUG] ${message}`, data);
    }
  },
  error: (message, error) => {
    console.error(`[ERROR] ${message}`, error);
  },
};
```

### 🛠️ Actividad Práctica (15 minutos)

**Ejercicio**: Sistema de logging robusto

- Crear custom error classes
- Implementar debugging utilities
- Configurar error boundaries

### 🎯 Resultados Esperados

- Sistema de errores robusto
- Debugging eficiente
- Logging comprehensivo

---

## 🍽️ DESCANSO (14:45-15:00)

---

## 🕐 15:00-15:25 | DOM manipulation moderna

### 📋 Objetivos Específicos

- Dominar modern DOM API
- Implementar dynamic content loading
- Aplicar Intersection Observer

### 📚 Contenido Teórico (10 minutos)

```javascript
// Modern DOM API
const createElement = (tag, className, textContent) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (textContent) element.textContent = textContent;
  return element;
};

// Query selectors
const products = document.querySelectorAll('.product');
const activeProduct = document.querySelector('.product.active');

// Dataset API
const productId = element.dataset.productId;
element.dataset.status = 'active';

// Intersection Observer
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
});

document.querySelectorAll('.animate-on-scroll').forEach(el => {
  observer.observe(el);
});
```

### 🛠️ Actividad Práctica (15 minutos)

**Ejercicio**: Dynamic content loader

- Crear elements dinámicamente
- Implementar lazy loading
- Usar Intersection Observer

### 🎯 Resultados Esperados

- DOM manipulation fluida
- Content loading optimizado
- Intersection Observer aplicado

---

## 🕐 15:25-15:50 | Event handling y delegation

### 📋 Objetivos Específicos

- Implementar event delegation
- Crear custom events
- Optimizar event listeners

### 📚 Contenido Teórico (10 minutos)

```javascript
// Event delegation
const container = document.querySelector('.products-container');
container.addEventListener('click', e => {
  if (e.target.classList.contains('add-to-cart')) {
    const productId = e.target.dataset.productId;
    addToCart(productId);
  }
});

// Custom events
const productAddedEvent = new CustomEvent('productAdded', {
  detail: { productId: 123, quantity: 2 },
});

document.addEventListener('productAdded', e => {
  console.log('Product added:', e.detail);
});

document.dispatchEvent(productAddedEvent);

// Passive event listeners
document.addEventListener('scroll', handleScroll, { passive: true });
```

### 🛠️ Actividad Práctica (15 minutos)

**Ejercicio**: Interactive dashboard

- Implementar event delegation
- Crear custom events
- Optimizar performance

### 🎯 Resultados Esperados

- Event handling optimizado
- Custom events funcionando
- Performance mejorado

---

## 🕐 15:50-16:15 | Práctica: Reloj digital interactivo

### 📋 Objetivos Específicos

- Integrar todos los conceptos aprendidos
- Crear proyecto completo
- Implementar múltiples funcionalidades

### 🛠️ Proyecto Completo (25 minutos)

**Características del Reloj**:

- Múltiples zonas horarias
- Formato 12/24 horas
- Cronómetro y temporizador
- Alarmas programables
- Tema oscuro/claro

```javascript
class WorldClock {
  constructor() {
    this.timezones = [
      { name: 'Local', offset: 0 },
      { name: 'New York', offset: -5 },
      { name: 'London', offset: 0 },
      { name: 'Tokyo', offset: 9 },
    ];
    this.is24Hour = true;
    this.init();
  }

  init() {
    this.createClockElements();
    this.startClock();
    this.bindEvents();
  }

  createClockElements() {
    // Create DOM elements for each timezone
  }

  startClock() {
    setInterval(() => {
      this.updateTime();
    }, 1000);
  }

  updateTime() {
    // Update all clock displays
  }
}
```

### 🎯 Resultados Esperados

- Reloj completamente funcional
- Múltiples funcionalidades integradas
- Código limpio y organizado

---

## 🕐 16:15-17:00 | Challenge: Algoritmos de palindromos y rotación

### 📋 Objetivos Específicos

- Resolver algoritmos de programación competitiva
- Aplicar técnicas de optimización
- Practicar bajo presión de tiempo

### 🏆 Algoritmos a Resolver (45 minutos)

#### Algoritmo 1: Palindrome Detection

```javascript
// Determine if a string is a palindrome
const isPalindrome = str => {
  // Your solution here
};

// Test cases
console.log(isPalindrome('racecar')); // true
console.log(isPalindrome('hello')); // false
```

#### Algoritmo 2: String Rotation

```javascript
// Check if string s2 is a rotation of s1
const isRotation = (s1, s2) => {
  // Your solution here
};

// Test cases
console.log(isRotation('waterbottle', 'erbottlewat')); // true
console.log(isRotation('hello', 'world')); // false
```

#### Algoritmo 3: Array Rotation

```javascript
// Rotate array to the right k steps
const rotateArray = (nums, k) => {
  // Your solution here
};

// Test cases
console.log(rotateArray([1, 2, 3, 4, 5, 6, 7], 3)); // [5,6,7,1,2,3,4]
```

#### Algoritmo 4: Longest Palindromic Substring

```javascript
// Find the longest palindromic substring
const longestPalindrome = s => {
  // Your solution here
};

// Test cases
console.log(longestPalindrome('babad')); // "bab" or "aba"
```

#### Algoritmo 5: Rotate Matrix

```javascript
// Rotate NxN matrix 90 degrees clockwise
const rotateMatrix = matrix => {
  // Your solution here
};

// Test case
const matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];
console.log(rotateMatrix(matrix)); // [[7,4,1],[8,5,2],[9,6,3]]
```

### 🎯 Criterios de Evaluación

- **Correctitud**: Solución funciona para todos los casos
- **Eficiencia**: Complejidad temporal y espacial óptima
- **Legibilidad**: Código claro y bien estructurado
- **Velocidad**: Tiempo de resolución

---

## 📊 Evaluación Final del Día

### Rubrica de Evaluación

#### Competencias Técnicas (70%)

- **JavaScript ES6+ Syntax** (20%)
  - Variables, funciones, destructuring
  - Template literals y arrow functions
- **Programación Asíncrona** (20%)
  - Promises y async/await
  - Error handling asíncrono
- **DOM Manipulation** (15%)
  - Modern DOM API
  - Event handling y delegation
- **Resolución de Algoritmos** (15%)
  - Approach de problem-solving
  - Eficiencia del código

#### Competencias Blandas (30%)

- **Problem Solving** (10%)
  - Pensamiento analítico
  - Habilidades de debugging
- **Calidad de Código** (10%)
  - Prácticas de clean code
  - Documentación
- **Gestión del Tiempo** (10%)
  - Cumplimiento de deadlines
  - Workflow eficiente

### Entregables Finales

1. **Ejercicios completados** con código funcional
2. **Reloj digital interactivo** completamente funcional
3. **Al menos 3 algoritmos resueltos** correctamente
4. **Documentación** clara y completa
5. **Git commits** organizados y descriptivos

---

## 🎯 Preparación para el Día 4

### Temas a Revisar

- Regular expressions (RegExp)
- Form validation
- Security fundamentals
- Input sanitization

### Recursos Recomendados

- MDN JavaScript Guide
- RegExp101.com para práctica
- OWASP security guidelines
- JavaScript security best practices

---

**¡Excelente trabajo en el Día 3! Has dado un gran paso hacia el dominio de JavaScript moderno.** 🚀✨
