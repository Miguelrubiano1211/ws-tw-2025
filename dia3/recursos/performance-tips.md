# ⚡ Tips de Performance JavaScript

## 🎯 Optimización y Mejores Prácticas

### 1. **Optimización de Variables**

```javascript
// ✅ Buena práctica - Usar const por defecto
const PI = 3.14159;
const usuarios = [];

// ✅ Usar let solo cuando necesites reasignar
let contador = 0;
let resultado;

// ❌ Evitar var (function scope)
var antiguoEstilo = 'evitar';

// ✅ Inicializar variables
let nombre = '';
let items = [];
let config = {};

// ❌ Variables no inicializadas
let nombre; // undefined
let items; // undefined
```

### 2. **Optimización de Funciones**

```javascript
// ✅ Arrow functions para callbacks simples
const numeros = [1, 2, 3, 4, 5];
const duplicados = numeros.map(n => n * 2);

// ✅ Funciones puras (sin efectos secundarios)
const calcularImpuesto = (precio, tasa) => precio * tasa;

// ❌ Funciones con efectos secundarios
let total = 0;
const sumarTotal = valor => {
  total += valor; // Modifica variable externa
  return total;
};

// ✅ Early returns para reducir anidamiento
function validarUsuario(usuario) {
  if (!usuario) return false;
  if (!usuario.email) return false;
  if (!usuario.nombre) return false;
  return true;
}

// ❌ Anidamiento excesivo
function validarUsuarioMal(usuario) {
  if (usuario) {
    if (usuario.email) {
      if (usuario.nombre) {
        return true;
      }
    }
  }
  return false;
}
```

### 3. **Optimización de Arrays**

```javascript
// ✅ Usar métodos nativos (más rápidos)
const numeros = [1, 2, 3, 4, 5];

// map - Transformar elementos
const duplicados = numeros.map(n => n * 2);

// filter - Filtrar elementos
const pares = numeros.filter(n => n % 2 === 0);

// reduce - Reducir a un valor
const suma = numeros.reduce((acc, n) => acc + n, 0);

// find - Encontrar primer elemento
const encontrado = numeros.find(n => n > 3);

// ❌ Loops manuales innecesarios
const duplicadosMal = [];
for (let i = 0; i < numeros.length; i++) {
  duplicadosMal.push(numeros[i] * 2);
}
```

### 4. **Optimización de Strings**

```javascript
// ✅ Template literals para concatenación
const nombre = 'Juan';
const edad = 25;
const mensaje = `Hola, soy ${nombre} y tengo ${edad} años`;

// ❌ Concatenación con +
const mensajeMal = 'Hola, soy ' + nombre + ' y tengo ' + edad + ' años';

// ✅ Usar includes para verificar existencia
const texto = 'JavaScript es genial';
if (texto.includes('JavaScript')) {
  console.log('Contiene JavaScript');
}

// ❌ Usar indexOf para verificar existencia
if (texto.indexOf('JavaScript') !== -1) {
  console.log('Contiene JavaScript');
}
```

### 5. **Optimización de Objetos**

```javascript
// ✅ Destructuring para extraer propiedades
const persona = { nombre: 'Ana', edad: 30, ciudad: 'Madrid' };
const { nombre, edad } = persona;

// ✅ Shorthand properties
const crearUsuario = (nombre, email) => ({
  nombre,
  email,
  activo: true,
  fechaCreacion: new Date(),
});

// ✅ Spread operator para clonar/combinar
const usuario1 = { nombre: 'Juan', edad: 25 };
const usuario2 = { ...usuario1, email: 'juan@email.com' };

// ❌ Object.assign innecesario
const usuario3 = Object.assign({}, usuario1, { email: 'juan@email.com' });
```

### 6. **Optimización de DOM**

```javascript
// ✅ Cachear elementos DOM
const boton = document.getElementById('miBoton');
const lista = document.querySelector('.lista');

// ✅ Usar DocumentFragment para múltiples inserciones
const fragment = document.createDocumentFragment();
for (let i = 0; i < 1000; i++) {
  const li = document.createElement('li');
  li.textContent = `Item ${i}`;
  fragment.appendChild(li);
}
lista.appendChild(fragment);

// ❌ Múltiples manipulaciones DOM
for (let i = 0; i < 1000; i++) {
  const li = document.createElement('li');
  li.textContent = `Item ${i}`;
  lista.appendChild(li); // Reflow en cada iteración
}

// ✅ Event delegation
document.addEventListener('click', event => {
  if (event.target.classList.contains('boton-eliminar')) {
    eliminarItem(event.target.closest('.item'));
  }
});

// ❌ Múltiples event listeners
document.querySelectorAll('.boton-eliminar').forEach(boton => {
  boton.addEventListener('click', eliminarItem);
});
```

### 7. **Optimización de Async/Await**

```javascript
// ✅ Paralelizar operaciones independientes
async function obtenerDatos() {
  const [usuarios, productos, categorias] = await Promise.all([
    fetch('/api/usuarios').then(r => r.json()),
    fetch('/api/productos').then(r => r.json()),
    fetch('/api/categorias').then(r => r.json()),
  ]);

  return { usuarios, productos, categorias };
}

// ❌ Operaciones secuenciales innecesarias
async function obtenerDatosMal() {
  const usuarios = await fetch('/api/usuarios').then(r => r.json());
  const productos = await fetch('/api/productos').then(r => r.json());
  const categorias = await fetch('/api/categorias').then(r => r.json());

  return { usuarios, productos, categorias };
}

// ✅ Manejar errores apropiadamente
async function operacionSegura() {
  try {
    const datos = await obtenerDatos();
    return procesarDatos(datos);
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}
```

### 8. **Evitar Memory Leaks**

```javascript
// ✅ Remover event listeners
class MiComponente {
  constructor() {
    this.handleClick = this.handleClick.bind(this);
  }

  mount() {
    document.addEventListener('click', this.handleClick);
  }

  unmount() {
    document.removeEventListener('click', this.handleClick);
  }

  handleClick(event) {
    console.log('Click!');
  }
}

// ✅ Limpiar timers
let timeoutId;
let intervalId;

function iniciarTimer() {
  timeoutId = setTimeout(() => {
    console.log('Timeout ejecutado');
  }, 1000);

  intervalId = setInterval(() => {
    console.log('Interval ejecutado');
  }, 5000);
}

function limpiarTimers() {
  clearTimeout(timeoutId);
  clearInterval(intervalId);
}

// ✅ Usar WeakMap para asociaciones débiles
const elementoMetadata = new WeakMap();

function agregarMetadata(elemento, metadata) {
  elementoMetadata.set(elemento, metadata);
}

// Se limpia automáticamente cuando el elemento es removido
```

### 9. **Optimización de Algoritmos**

```javascript
// ✅ Usar Set para verificar existencia
const items = new Set([1, 2, 3, 4, 5]);
const existe = items.has(3); // O(1)

// ❌ Usar array.includes
const itemsArray = [1, 2, 3, 4, 5];
const existeEnArray = itemsArray.includes(3); // O(n)

// ✅ Usar Map para lookups
const usuariosPorId = new Map();
usuariosPorId.set(1, { nombre: 'Ana', email: 'ana@email.com' });
const usuario = usuariosPorId.get(1); // O(1)

// ❌ Usar array.find
const usuarios = [
  { id: 1, nombre: 'Ana', email: 'ana@email.com' },
  { id: 2, nombre: 'Juan', email: 'juan@email.com' },
];
const usuarioEncontrado = usuarios.find(u => u.id === 1); // O(n)
```

### 10. **Lazy Loading y Memoización**

```javascript
// ✅ Lazy evaluation
class DataLoader {
  constructor() {
    this._data = null;
  }

  get data() {
    if (!this._data) {
      this._data = this.loadData();
    }
    return this._data;
  }

  loadData() {
    // Operación costosa
    return fetch('/api/data').then(r => r.json());
  }
}

// ✅ Memoización simple
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

// Uso
const fibonacciMemo = memoize(n => {
  if (n <= 1) return n;
  return fibonacciMemo(n - 1) + fibonacciMemo(n - 2);
});
```

### 11. **Optimización de Loops**

```javascript
// ✅ Cachear length en loops
const items = [...]; // Array grande
const len = items.length;
for (let i = 0; i < len; i++) {
    // Procesar items[i]
}

// ❌ Acceder a length en cada iteración
for (let i = 0; i < items.length; i++) {
    // Procesar items[i]
}

// ✅ Usar for...of para iteración simple
for (const item of items) {
    console.log(item);
}

// ✅ Usar for...in para objetos
const objeto = { a: 1, b: 2, c: 3 };
for (const key in objeto) {
    console.log(key, objeto[key]);
}
```

### 12. **Debouncing y Throttling**

```javascript
// ✅ Debounce para búsquedas
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

// Uso
const buscarProductos = debounce(query => {
  // Realizar búsqueda
  console.log('Buscando:', query);
}, 300);

// ✅ Throttle para scroll
function throttle(func, limit) {
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
}

// Uso
const handleScroll = throttle(() => {
  console.log('Scrolling...');
}, 100);

window.addEventListener('scroll', handleScroll);
```

### 13. **Optimización de Regex**

```javascript
// ✅ Compilar regex una vez
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validarEmail(email) {
  return EMAIL_REGEX.test(email);
}

// ❌ Crear regex en cada llamada
function validarEmailMal(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ✅ Usar métodos de string cuando sea posible
const texto = 'JavaScript es genial';
const contiene = texto.includes('JavaScript'); // Más rápido que regex

// ❌ Regex innecesaria
const contieneRegex = /JavaScript/.test(texto);
```

### 14. **Bundle Size Optimization**

```javascript
// ✅ Import específico
import { map, filter } from 'lodash';

// ❌ Import completo
import _ from 'lodash';

// ✅ Lazy loading de módulos
const cargarModulo = async () => {
  const { default: MiModulo } = await import('./MiModulo.js');
  return new MiModulo();
};

// ✅ Tree shaking friendly
export const utilidad1 = () => {
  /* ... */
};
export const utilidad2 = () => {
  /* ... */
};

// ❌ Export default de objeto grande
export default {
  utilidad1: () => {
    /* ... */
  },
  utilidad2: () => {
    /* ... */
  },
};
```

## 🔧 Herramientas de Performance

### **Browser DevTools**

```javascript
// Medir performance
console.time('operacion-costosa');
operacionCostosa();
console.timeEnd('operacion-costosa');

// Profiling
console.profile('mi-funcion');
miFuncion();
console.profileEnd('mi-funcion');

// Memory usage
console.log('Memoria usada:', performance.memory.usedJSHeapSize);
```

### **Performance API**

```javascript
// Marcar puntos de tiempo
performance.mark('inicio-proceso');
procesarDatos();
performance.mark('fin-proceso');

// Medir duración
performance.measure('duracion-proceso', 'inicio-proceso', 'fin-proceso');

// Obtener medidas
const medidas = performance.getEntriesByType('measure');
console.log(medidas[0].duration);
```

## 🎯 Checklist de Performance

### **Durante el Desarrollo**

- [ ] Usar const/let en lugar de var
- [ ] Implementar early returns
- [ ] Cachear elementos DOM
- [ ] Usar métodos nativos de arrays
- [ ] Evitar loops innecesarios
- [ ] Memoizar funciones costosas

### **Para Producción**

- [ ] Minificar código
- [ ] Comprimir assets
- [ ] Lazy loading de módulos
- [ ] Optimizar imágenes
- [ ] Usar CDN
- [ ] Implementar caching

### **Monitoring**

- [ ] Usar Performance API
- [ ] Monitorear memory leaks
- [ ] Analizar bundle size
- [ ] Medir First Paint
- [ ] Optimizar Critical Rendering Path

## 🏆 Tips para WorldSkills

1. **Prioriza legibilidad** - Código claro es mejor que código "optimizado"
2. **Usa herramientas nativas** - Métodos de Array, String, etc.
3. **Evita optimización prematura** - Optimiza solo cuando sea necesario
4. **Conoce los métodos modernos** - Map, Set, WeakMap, etc.
5. **Practica con DevTools** - Profiling y debugging
6. **Implementa lazy loading** - Solo carga lo necesario

---

💡 **Recuerda**: La performance es importante, pero la funcionalidad correcta es prioritaria. Optimiza después de que funcione.
