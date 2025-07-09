# 📚 RECURSOS DÍA 10 - JAVASCRIPT MODERNO (ES6+)

## 📖 Índice de Recursos

- [🎯 Guía Completa ES6+](#guía-completa-es6)
- [🔧 Patrones Modernos](#patrones-modernos)
- [✨ Mejores Prácticas](#mejores-prácticas)
- [🚀 Optimización y Rendimiento](#optimización-y-rendimiento)
- [🧪 Testing con ES6+](#testing-con-es6)
- [🔗 Enlaces y Referencias](#enlaces-y-referencias)

---

## 🎯 Guía Completa ES6+

### 1. Variables: let, const vs var

```javascript
// ❌ Problemas con var
function ejemploVar() {
  console.log(x); // undefined (hoisting)
  var x = 1;

  if (true) {
    var x = 2; // Misma variable
  }
  console.log(x); // 2
}

// ✅ Solución con let/const
function ejemploLet() {
  // console.log(x); // ReferenceError
  let x = 1;

  if (true) {
    let x = 2; // Variable diferente
    console.log(x); // 2
  }
  console.log(x); // 1
}

// ✅ Constantes para valores inmutables
const API_URL = 'https://api.ejemplo.com';
const config = { debug: true }; // Objeto mutable
// config = {}; // ❌ Error
config.debug = false; // ✅ OK
```

### 2. Arrow Functions

```javascript
// Sintaxis básica
const sumar = (a, b) => a + b;
const saludar = nombre => `Hola, ${nombre}`;
const obtenerUsuario = () => ({ nombre: 'Ana', edad: 25 });

// Diferencias con function
const objeto = {
  nombre: 'Test',

  // Function tradicional: tiene su propio 'this'
  metodoTradicional: function () {
    setTimeout(function () {
      console.log(this.nombre); // undefined
    }, 100);
  },

  // Arrow function: hereda 'this' del contexto
  metodoArrow: function () {
    setTimeout(() => {
      console.log(this.nombre); // 'Test'
    }, 100);
  },
};

// Casos de uso apropiados
const numeros = [1, 2, 3, 4, 5];
const duplicados = numeros.map(n => n * 2);
const pares = numeros.filter(n => n % 2 === 0);
const suma = numeros.reduce((acc, n) => acc + n, 0);
```

### 3. Template Literals

```javascript
// Sintaxis básica
const nombre = 'Carlos';
const edad = 30;
const mensaje = `Hola, soy ${nombre} y tengo ${edad} años`;

// Multilínea
const html = `
    <div class="usuario">
        <h2>${nombre}</h2>
        <p>Edad: ${edad}</p>
    </div>
`;

// Expresiones complejas
const usuario = { nombre: 'Ana', admin: true };
const saludo = `Bienvenido${usuario.admin ? ' Administrador' : ''} ${
  usuario.nombre
}`;

// Tagged templates
function highlight(strings, ...values) {
  return strings.reduce((result, string, i) => {
    const value = values[i] ? `<mark>${values[i]}</mark>` : '';
    return result + string + value;
  }, '');
}

const texto = highlight`El usuario ${nombre} tiene ${edad} años`;
```

### 4. Destructuring Avanzado

```javascript
// Array destructuring
const colores = ['rojo', 'verde', 'azul'];
const [primero, segundo, ...resto] = colores;
const [, , tercero] = colores; // Saltar elementos

// Object destructuring
const usuario = { nombre: 'Ana', edad: 25, email: 'ana@test.com' };
const { nombre, edad, trabajo = 'Desarrollador' } = usuario;
const { email: correo } = usuario; // Alias

// Destructuring anidado
const respuesta = {
  data: {
    usuario: { nombre: 'Carlos', perfil: { tema: 'oscuro' } },
  },
};
const {
  data: {
    usuario: {
      nombre: nombreUsuario,
      perfil: { tema },
    },
  },
} = respuesta;

// En parámetros de función
function procesarUsuario({ nombre, edad, email, activo = true }) {
  return { nombre, edad, email, activo };
}

// En loops
const usuarios = [
  { id: 1, nombre: 'Ana' },
  { id: 2, nombre: 'Carlos' },
];

for (const { id, nombre } of usuarios) {
  console.log(`${id}: ${nombre}`);
}
```

### 5. Spread y Rest Operators

```javascript
// Spread con arrays
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combinado = [...arr1, ...arr2];
const conElementos = [0, ...arr1, 4, ...arr2, 7];

// Spread con objetos
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };
const combinado = { ...obj1, ...obj2 };
const actualizado = { ...obj1, b: 20, e: 5 };

// Rest parameters
function sumar(...numeros) {
  return numeros.reduce((sum, n) => sum + n, 0);
}

function procesarDatos(primero, segundo, ...resto) {
  console.log('Primero:', primero);
  console.log('Segundo:', segundo);
  console.log('Resto:', resto);
}

// Rest en destructuring
const [head, ...tail] = [1, 2, 3, 4, 5];
const { nombre, ...otrosDatos } = {
  nombre: 'Ana',
  edad: 25,
  email: 'ana@test.com',
};
```

### 6. Clases ES6

```javascript
class Vehiculo {
  constructor(marca, modelo) {
    this.marca = marca;
    this.modelo = modelo;
    this._velocidad = 0; // "Privado" por convención
  }

  // Getter
  get velocidad() {
    return this._velocidad;
  }

  // Setter
  set velocidad(valor) {
    if (valor >= 0) {
      this._velocidad = valor;
    }
  }

  // Método de instancia
  acelerar(incremento = 10) {
    this._velocidad += incremento;
  }

  // Método estático
  static compararVelocidades(v1, v2) {
    return v1.velocidad - v2.velocidad;
  }
}

class Auto extends Vehiculo {
  constructor(marca, modelo, puertas) {
    super(marca, modelo);
    this.puertas = puertas;
  }

  // Sobrescribir método
  acelerar(incremento = 15) {
    super.acelerar(incremento);
    console.log(`Auto acelerando a ${this.velocidad} km/h`);
  }
}

// Campos privados (ES2022)
class CuentaBancaria {
  #saldo = 0;
  #pin;

  constructor(pin) {
    this.#pin = pin;
  }

  #validarPin(pin) {
    return pin === this.#pin;
  }

  retirar(cantidad, pin) {
    if (this.#validarPin(pin) && cantidad <= this.#saldo) {
      this.#saldo -= cantidad;
      return true;
    }
    return false;
  }

  get saldo() {
    return this.#saldo;
  }
}
```

### 7. Módulos ES6

```javascript
// math.js - Exports
export const PI = 3.14159;
export const E = 2.71828;

export function sumar(a, b) {
  return a + b;
}

export class Calculadora {
  constructor() {
    this.resultado = 0;
  }

  sumar(n) {
    this.resultado += n;
    return this;
  }
}

// Default export
export default function multiplicar(a, b) {
  return a * b;
}

// Alternativa - exports al final
function restar(a, b) {
  return a - b;
}

function dividir(a, b) {
  return b !== 0 ? a / b : null;
}

export { restar, dividir };

// main.js - Imports
import multiplicar from './math.js'; // Default import
import { PI, sumar, Calculadora } from './math.js'; // Named imports
import { restar as resta, dividir } from './math.js'; // Alias
import * as math from './math.js'; // Namespace import

// Uso
console.log(multiplicar(5, 3));
console.log(sumar(10, 5));
console.log(math.PI);

const calc = new Calculadora();
calc.sumar(10).sumar(5);
```

---

## 🔧 Patrones Modernos

### 1. Patrón Module (ES6)

```javascript
// userService.js
class UserService {
  constructor() {
    this.users = [];
  }

  async fetchUsers() {
    // Simulación de API call
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(this.users);
      }, 1000);
    });
  }

  createUser(userData) {
    const user = {
      id: Date.now(),
      ...userData,
      createdAt: new Date(),
    };
    this.users.push(user);
    return user;
  }
}

// Named export
export const userService = new UserService();

// Default export
export default UserService;
```

### 2. Patrón Factory con ES6

```javascript
// Abstract Factory
class DatabaseFactory {
  static create(type, config) {
    switch (type) {
      case 'mysql':
        return new MySQLConnection(config);
      case 'postgres':
        return new PostgreSQLConnection(config);
      case 'mongodb':
        return new MongoConnection(config);
      default:
        throw new Error(`Database type ${type} not supported`);
    }
  }
}

// Base class
class DatabaseConnection {
  constructor(config) {
    this.config = config;
  }

  connect() {
    throw new Error('connect() must be implemented');
  }
}

// Concrete implementations
class MySQLConnection extends DatabaseConnection {
  connect() {
    console.log('Connecting to MySQL...');
    return Promise.resolve();
  }

  query(sql) {
    return Promise.resolve(`MySQL result for: ${sql}`);
  }
}

class PostgreSQLConnection extends DatabaseConnection {
  connect() {
    console.log('Connecting to PostgreSQL...');
    return Promise.resolve();
  }

  query(sql) {
    return Promise.resolve(`PostgreSQL result for: ${sql}`);
  }
}

// Usage
const db = DatabaseFactory.create('mysql', { host: 'localhost' });
```

### 3. Patrón Observer/PubSub

```javascript
class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  on(event, listener) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event).push(listener);
    return this;
  }

  off(event, listener) {
    if (this.events.has(event)) {
      const listeners = this.events.get(event);
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
    return this;
  }

  emit(event, ...args) {
    if (this.events.has(event)) {
      this.events.get(event).forEach(listener => {
        listener(...args);
      });
    }
    return this;
  }

  once(event, listener) {
    const wrapper = (...args) => {
      listener(...args);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
    return this;
  }
}

// Usage
const emitter = new EventEmitter();

emitter.on('user:login', user => {
  console.log(`User ${user.name} logged in`);
});

emitter.on('user:login', user => {
  console.log(`Updating last login for ${user.name}`);
});

emitter.emit('user:login', { name: 'Ana', id: 123 });
```

### 4. Patrón Command

```javascript
class Command {
  execute() {
    throw new Error('execute() must be implemented');
  }

  undo() {
    throw new Error('undo() must be implemented');
  }
}

class CreateUserCommand extends Command {
  constructor(userService, userData) {
    super();
    this.userService = userService;
    this.userData = userData;
    this.createdUser = null;
  }

  execute() {
    this.createdUser = this.userService.createUser(this.userData);
    return this.createdUser;
  }

  undo() {
    if (this.createdUser) {
      this.userService.deleteUser(this.createdUser.id);
    }
  }
}

class CommandManager {
  constructor() {
    this.history = [];
    this.currentIndex = -1;
  }

  execute(command) {
    // Remove commands after current index
    this.history = this.history.slice(0, this.currentIndex + 1);

    // Execute command
    const result = command.execute();

    // Add to history
    this.history.push(command);
    this.currentIndex++;

    return result;
  }

  undo() {
    if (this.currentIndex >= 0) {
      const command = this.history[this.currentIndex];
      command.undo();
      this.currentIndex--;
    }
  }

  redo() {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
      const command = this.history[this.currentIndex];
      command.execute();
    }
  }
}
```

### 5. Patrón Strategy

```javascript
// Strategy interface
class SortStrategy {
  sort(array) {
    throw new Error('sort() must be implemented');
  }
}

// Concrete strategies
class BubbleSort extends SortStrategy {
  sort(array) {
    const arr = [...array];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        }
      }
    }
    return arr;
  }
}

class QuickSort extends SortStrategy {
  sort(array) {
    if (array.length <= 1) return array;

    const pivot = array[Math.floor(array.length / 2)];
    const left = array.filter(x => x < pivot);
    const middle = array.filter(x => x === pivot);
    const right = array.filter(x => x > pivot);

    return [...this.sort(left), ...middle, ...this.sort(right)];
  }
}

// Context
class ArraySorter {
  constructor(strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  sort(array) {
    return this.strategy.sort(array);
  }
}

// Usage
const sorter = new ArraySorter(new BubbleSort());
console.log(sorter.sort([64, 34, 25, 12, 22, 11, 90]));

sorter.setStrategy(new QuickSort());
console.log(sorter.sort([64, 34, 25, 12, 22, 11, 90]));
```

---

## ✨ Mejores Prácticas

### 1. Principios SOLID en JavaScript

```javascript
// S - Single Responsibility Principle
class UserValidator {
  validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  validatePassword(password) {
    return password.length >= 8;
  }
}

class UserRepository {
  constructor(database) {
    this.database = database;
  }

  async save(user) {
    return this.database.save('users', user);
  }

  async findById(id) {
    return this.database.findById('users', id);
  }
}

// O - Open/Closed Principle
class Shape {
  area() {
    throw new Error('area() must be implemented');
  }
}

class Rectangle extends Shape {
  constructor(width, height) {
    super();
    this.width = width;
    this.height = height;
  }

  area() {
    return this.width * this.height;
  }
}

class Circle extends Shape {
  constructor(radius) {
    super();
    this.radius = radius;
  }

  area() {
    return Math.PI * this.radius * this.radius;
  }
}

// L - Liskov Substitution Principle
class Bird {
  fly() {
    console.log('Flying...');
  }
}

class Duck extends Bird {
  fly() {
    console.log('Duck flying...');
  }

  swim() {
    console.log('Duck swimming...');
  }
}

// I - Interface Segregation Principle
class Readable {
  read() {
    throw new Error('read() must be implemented');
  }
}

class Writable {
  write(data) {
    throw new Error('write() must be implemented');
  }
}

class File {
  constructor(filename) {
    this.filename = filename;
  }
}

class ReadOnlyFile extends File {
  read() {
    return `Reading ${this.filename}`;
  }
}

class ReadWriteFile extends File {
  read() {
    return `Reading ${this.filename}`;
  }

  write(data) {
    console.log(`Writing to ${this.filename}: ${data}`);
  }
}

// D - Dependency Inversion Principle
class EmailService {
  send(to, subject, body) {
    console.log(`Sending email to ${to}: ${subject}`);
  }
}

class SMSService {
  send(to, message) {
    console.log(`Sending SMS to ${to}: ${message}`);
  }
}

class NotificationService {
  constructor(service) {
    this.service = service;
  }

  notify(to, message) {
    this.service.send(to, message);
  }
}
```

### 2. Functional Programming Patterns

```javascript
// Pure functions
const add = (a, b) => a + b;
const multiply = (a, b) => a * b;

// Higher-order functions
const createMultiplier = factor => number => number * factor;
const double = createMultiplier(2);
const triple = createMultiplier(3);

// Function composition
const compose =
  (...functions) =>
  input =>
    functions.reduceRight((acc, fn) => fn(acc), input);

const addOne = x => x + 1;
const square = x => x * x;
const addOneAndSquare = compose(square, addOne);

// Currying
const curry = fn => {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return function (...nextArgs) {
      return curried.apply(this, args.concat(nextArgs));
    };
  };
};

const sum = (a, b, c) => a + b + c;
const curriedSum = curry(sum);
const sumWith5 = curriedSum(5);
const sumWith5And10 = sumWith5(10);

// Immutability helpers
const updateObject = (obj, updates) => ({ ...obj, ...updates });
const updateArray = (arr, index, newValue) => [
  ...arr.slice(0, index),
  newValue,
  ...arr.slice(index + 1),
];

// Monads (Maybe/Optional pattern)
class Maybe {
  constructor(value) {
    this.value = value;
  }

  static of(value) {
    return new Maybe(value);
  }

  map(fn) {
    return this.value == null ? Maybe.of(null) : Maybe.of(fn(this.value));
  }

  flatMap(fn) {
    return this.value == null ? Maybe.of(null) : fn(this.value);
  }

  getOrElse(defaultValue) {
    return this.value == null ? defaultValue : this.value;
  }
}

// Usage
const result = Maybe.of('hello')
  .map(str => str.toUpperCase())
  .map(str => str + '!')
  .getOrElse('default');
```

### 3. Error Handling Patterns

```javascript
// Custom error classes
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

class NetworkError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'NetworkError';
    this.status = status;
  }
}

// Result pattern
class Result {
  constructor(success, value, error) {
    this.success = success;
    this.value = value;
    this.error = error;
  }

  static ok(value) {
    return new Result(true, value, null);
  }

  static error(error) {
    return new Result(false, null, error);
  }

  map(fn) {
    return this.success ? Result.ok(fn(this.value)) : this;
  }

  flatMap(fn) {
    return this.success ? fn(this.value) : this;
  }

  getOrElse(defaultValue) {
    return this.success ? this.value : defaultValue;
  }
}

// Async error handling
class AsyncResult {
  constructor(promise) {
    this.promise = promise;
  }

  static from(promise) {
    return new AsyncResult(promise);
  }

  async map(fn) {
    try {
      const value = await this.promise;
      return AsyncResult.from(Promise.resolve(fn(value)));
    } catch (error) {
      return AsyncResult.from(Promise.reject(error));
    }
  }

  async catch(fn) {
    try {
      const value = await this.promise;
      return AsyncResult.from(Promise.resolve(value));
    } catch (error) {
      return AsyncResult.from(Promise.resolve(fn(error)));
    }
  }
}

// Usage
async function fetchUserData(id) {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      throw new NetworkError('Failed to fetch user', response.status);
    }
    const data = await response.json();
    return Result.ok(data);
  } catch (error) {
    return Result.error(error);
  }
}
```

---

## 🚀 Optimización y Rendimiento

### 1. Memoización

```javascript
// Simple memoization
function memoize(fn) {
  const cache = new Map();

  return function (...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// Advanced memoization with TTL
function memoizeWithTTL(fn, ttl = 60000) {
  const cache = new Map();

  return function (...args) {
    const key = JSON.stringify(args);
    const cached = cache.get(key);

    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.value;
    }

    const result = fn.apply(this, args);
    cache.set(key, {
      value: result,
      timestamp: Date.now(),
    });

    return result;
  };
}

// Fibonacci with memoization
const fibonacci = memoize(function (n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
});
```

### 2. Lazy Loading

```javascript
// Lazy property
function lazy(fn) {
  let cached = false;
  let result;

  return function () {
    if (!cached) {
      result = fn.apply(this, arguments);
      cached = true;
    }
    return result;
  };
}

class ExpensiveResource {
  constructor() {
    this.getData = lazy(() => {
      console.log('Computing expensive data...');
      return { data: 'expensive computation result' };
    });
  }
}

// Lazy module loading
const lazyModule = {
  _module: null,

  async load() {
    if (!this._module) {
      this._module = await import('./heavy-module.js');
    }
    return this._module;
  },
};
```

### 3. Debouncing y Throttling

```javascript
// Debounce
function debounce(func, wait) {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle
function throttle(func, limit) {
  let inThrottle;

  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Usage
const searchInput = document.getElementById('search');
const debouncedSearch = debounce(performSearch, 300);
searchInput.addEventListener('input', debouncedSearch);

const scrollHandler = throttle(handleScroll, 100);
window.addEventListener('scroll', scrollHandler);
```

### 4. Object Pooling

```javascript
class ObjectPool {
  constructor(createFn, resetFn, maxSize = 100) {
    this.createFn = createFn;
    this.resetFn = resetFn;
    this.maxSize = maxSize;
    this.pool = [];
  }

  acquire() {
    if (this.pool.length > 0) {
      return this.pool.pop();
    }
    return this.createFn();
  }

  release(obj) {
    if (this.pool.length < this.maxSize) {
      this.resetFn(obj);
      this.pool.push(obj);
    }
  }
}

// Usage
const particlePool = new ObjectPool(
  () => ({ x: 0, y: 0, vx: 0, vy: 0 }),
  particle => {
    particle.x = 0;
    particle.y = 0;
    particle.vx = 0;
    particle.vy = 0;
  }
);
```

---

## 🧪 Testing con ES6+

### 1. Unit Tests con Jest

```javascript
// math.test.js
import { sum, multiply, divide } from './math.js';

describe('Math utilities', () => {
  test('sum should add two numbers', () => {
    expect(sum(2, 3)).toBe(5);
    expect(sum(-1, 1)).toBe(0);
  });

  test('multiply should multiply two numbers', () => {
    expect(multiply(3, 4)).toBe(12);
    expect(multiply(0, 5)).toBe(0);
  });

  test('divide should divide two numbers', () => {
    expect(divide(10, 2)).toBe(5);
    expect(divide(1, 0)).toBeNull();
  });
});

// userService.test.js
import UserService from './userService.js';

describe('UserService', () => {
  let userService;

  beforeEach(() => {
    userService = new UserService();
  });

  test('should create a user', () => {
    const userData = { name: 'John', email: 'john@test.com' };
    const user = userService.createUser(userData);

    expect(user).toMatchObject(userData);
    expect(user.id).toBeDefined();
    expect(user.createdAt).toBeInstanceOf(Date);
  });

  test('should find user by id', () => {
    const userData = { name: 'Jane', email: 'jane@test.com' };
    const createdUser = userService.createUser(userData);

    const foundUser = userService.findById(createdUser.id);
    expect(foundUser).toEqual(createdUser);
  });
});
```

### 2. Mocking con ES6

```javascript
// apiClient.test.js
import ApiClient from './apiClient.js';

// Mock fetch
global.fetch = jest.fn();

describe('ApiClient', () => {
  let apiClient;

  beforeEach(() => {
    apiClient = new ApiClient('https://api.test.com');
    fetch.mockClear();
  });

  test('should make GET request', async () => {
    const mockResponse = { data: 'test' };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await apiClient.get('/users');

    expect(fetch).toHaveBeenCalledWith(
      'https://api.test.com/users',
      expect.objectContaining({
        method: 'GET',
      })
    );
    expect(result).toEqual(mockResponse);
  });
});

// Mock class
class MockDatabase {
  constructor() {
    this.data = new Map();
  }

  save(table, data) {
    const id = Date.now().toString();
    this.data.set(`${table}:${id}`, { ...data, id });
    return { ...data, id };
  }

  findById(table, id) {
    return this.data.get(`${table}:${id}`);
  }
}
```

### 3. Integration Tests

```javascript
// app.integration.test.js
import App from './app.js';
import { MockDatabase } from './mocks/database.js';

describe('App Integration', () => {
  let app;
  let mockDb;

  beforeEach(() => {
    mockDb = new MockDatabase();
    app = new App(mockDb);
  });

  test('should create user and store in database', async () => {
    const userData = { name: 'Test User', email: 'test@example.com' };

    const result = await app.createUser(userData);

    expect(result.success).toBe(true);
    expect(result.user.name).toBe(userData.name);

    const storedUser = mockDb.findById('users', result.user.id);
    expect(storedUser).toMatchObject(userData);
  });
});
```

---

## 🔗 Enlaces y Referencias

### Documentación Oficial

- [MDN JavaScript](https://developer.mozilla.org/es/docs/Web/JavaScript)
- [ECMAScript Specifications](https://tc39.es/ecma262/)
- [Node.js Documentation](https://nodejs.org/docs/)

### Herramientas de Desarrollo

- [Babel](https://babeljs.io/) - Transpilador ES6+
- [ESLint](https://eslint.org/) - Linting para JavaScript
- [Prettier](https://prettier.io/) - Formateo de código
- [Jest](https://jestjs.io/) - Framework de testing

### Librerías Útiles

- [Lodash](https://lodash.com/) - Utilidades funcionales
- [Ramda](https://ramdajs.com/) - Programación funcional
- [Immutable.js](https://immutable-js.github.io/immutable-js/) - Estructuras inmutables
- [RxJS](https://rxjs.dev/) - Programación reactiva

### Patrones y Arquitectura

- [JavaScript Patterns](https://addyosmani.com/resources/essentialjsdesignpatterns/book/)
- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)
- [You Don't Know JS](https://github.com/getify/You-Dont-Know-JS)

### Recursos de Aprendizaje

- [ES6 Features](https://github.com/lukehoban/es6features)
- [JavaScript.info](https://javascript.info/)
- [ExploringJS](https://exploringjs.com/)

---

## 📝 Notas Adicionales

### Compatibilidad de Navegadores

- Verificar soporte en [Can I Use](https://caniuse.com/)
- Usar [Babel](https://babeljs.io/) para transpilación
- Configurar polyfills cuando sea necesario

### Mejores Prácticas de Código

- Usar `const` por defecto, `let` cuando sea necesario
- Preferir arrow functions para funciones cortas
- Usar template literals para strings complejos
- Aplicar destructuring cuando mejore la legibilidad
- Mantener funciones pequeñas y enfocadas

### Performance

- Evitar mutaciones innecesarias
- Usar Object.freeze() para inmutabilidad
- Implementar lazy loading para recursos pesados
- Aplicar memoización para cálculos costosos

¡Estos recursos te ayudarán a dominar JavaScript moderno y estar preparado para cualquier desafío WorldSkills! 🚀
