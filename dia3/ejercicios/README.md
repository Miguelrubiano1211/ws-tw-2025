# 📝 Ejercicios Día 3 - JavaScript ES6+ Fundamentals

## 🎯 Objetivos de los Ejercicios

Los ejercicios están diseñados para aplicar progresivamente los conceptos aprendidos, desde variables básicas hasta manipulación avanzada del DOM. Cada ejercicio construye sobre el anterior.

---

## 📚 Ejercicio 1: Variables y Template Literals

### Objetivo

Dominar el uso de `let`, `const` y template literals para escribir código moderno y legible.

### Instrucciones

1. Abre `ejercicios/01-variables.js`
2. Convierte el código ES5 a ES6+
3. Aplica template literals para interpolación
4. Usa `const` para valores inmutables y `let` para variables

### Código Base

```javascript
// Ejercicio 1.1: Convertir a ES6+
var userName = 'Juan';
var userAge = 25;
var userEmail = 'juan@email.com';
var userMessage =
  'Hola, ' +
  userName +
  '! Tienes ' +
  userAge +
  ' años y tu email es ' +
  userEmail;
console.log(userMessage);

// Ejercicio 1.2: Scope y hoisting
function testScope() {
  var x = 1;
  if (true) {
    var x = 2;
    console.log(x); // ¿Qué imprime?
  }
  console.log(x); // ¿Qué imprime?
}

// Ejercicio 1.3: Template literals avanzados
var product = {
  name: 'Laptop',
  price: 999,
  discount: 0.1,
};

var productInfo =
  'Producto: ' +
  product.name +
  '\n' +
  'Precio: $' +
  product.price +
  '\n' +
  'Descuento: ' +
  product.discount * 100 +
  '%\n' +
  'Precio final: $' +
  product.price * (1 - product.discount);

console.log(productInfo);
```

### Solución Esperada

```javascript
// Tu solución aquí...
```

---

## 🎯 Ejercicio 2: Arrow Functions y Destructuring

### Objetivo

Refactorizar funciones tradicionales a arrow functions y aplicar destructuring para código más limpio.

### Instrucciones

1. Abre `ejercicios/02-functions.js`
2. Convierte functions a arrow functions
3. Aplica destructuring en parámetros
4. Usa rest y spread operators

### Código Base

```javascript
// Ejercicio 2.1: Arrow functions
function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

function greetUser(user) {
  return 'Hola, ' + user.name + '!';
}

// Ejercicio 2.2: Destructuring
function processUser(user) {
  var name = user.name;
  var age = user.age;
  var email = user.email;

  return {
    displayName: name,
    isAdult: age >= 18,
    contact: email,
  };
}

// Ejercicio 2.3: Rest parameters
function calculateAverage() {
  var numbers = Array.prototype.slice.call(arguments);
  var sum = 0;
  for (var i = 0; i < numbers.length; i++) {
    sum += numbers[i];
  }
  return sum / numbers.length;
}

// Ejercicio 2.4: Spread operator
function mergeArrays(arr1, arr2, arr3) {
  return arr1.concat(arr2).concat(arr3);
}
```

### Solución Esperada

```javascript
// Tu solución aquí...
```

---

## 🗂️ Ejercicio 3: Array Methods

### Objetivo

Dominar métodos funcionales de arrays para manipulación eficiente de datos.

### Instrucciones

1. Abre `ejercicios/03-arrays.js`
2. Usa map, filter, reduce para transformar datos
3. Aplica chaining de métodos
4. Crea funciones puras

### Código Base

```javascript
const products = [
  { id: 1, name: 'Laptop', price: 999, category: 'electronics', rating: 4.5 },
  { id: 2, name: 'Mouse', price: 25, category: 'electronics', rating: 4.0 },
  { id: 3, name: 'Keyboard', price: 75, category: 'electronics', rating: 4.2 },
  { id: 4, name: 'Monitor', price: 300, category: 'electronics', rating: 4.7 },
  { id: 5, name: 'Desk', price: 150, category: 'furniture', rating: 4.1 },
  { id: 6, name: 'Chair', price: 200, category: 'furniture', rating: 4.3 },
];

// Ejercicio 3.1: Obtener nombres de productos
// Solución con loop tradicional
function getProductNames(products) {
  var names = [];
  for (var i = 0; i < products.length; i++) {
    names.push(products[i].name);
  }
  return names;
}

// Ejercicio 3.2: Filtrar productos por categoría
function getElectronics(products) {
  var electronics = [];
  for (var i = 0; i < products.length; i++) {
    if (products[i].category === 'electronics') {
      electronics.push(products[i]);
    }
  }
  return electronics;
}

// Ejercicio 3.3: Calcular precio total
function getTotalPrice(products) {
  var total = 0;
  for (var i = 0; i < products.length; i++) {
    total += products[i].price;
  }
  return total;
}

// Ejercicio 3.4: Encontrar productos premium (rating >= 4.5)
function getPremiumProducts(products) {
  // Tu implementación aquí
}

// Ejercicio 3.5: Crear resumen de categorías
function getCategorySummary(products) {
  // Resultado esperado:
  // {
  //   electronics: { count: 4, totalPrice: 1399, avgRating: 4.35 },
  //   furniture: { count: 2, totalPrice: 350, avgRating: 4.2 }
  // }
}
```

### Solución Esperada

```javascript
// Tu solución aquí...
```

---

## 🏗️ Ejercicio 4: Classes y Modules

### Objetivo

Crear sistemas orientados a objetos con ES6 classes y organizar código con módulos.

### Instrucciones

1. Abre `ejercicios/04-classes.js`
2. Convierte functions a classes
3. Implementa inheritance
4. Usa static methods

### Código Base

```javascript
// Ejercicio 4.1: Convertir a ES6 Class
function Product(name, price, category) {
  this.name = name;
  this.price = price;
  this.category = category;
}

Product.prototype.getInfo = function () {
  return this.name + ' - $' + this.price;
};

Product.prototype.applyDiscount = function (discount) {
  this.price = this.price * (1 - discount);
};

// Ejercicio 4.2: Inheritance
function Electronics(name, price, warranty) {
  Product.call(this, name, price, 'electronics');
  this.warranty = warranty;
}

Electronics.prototype = Object.create(Product.prototype);
Electronics.prototype.constructor = Electronics;

Electronics.prototype.getWarrantyInfo = function () {
  return this.warranty + ' months warranty';
};

// Ejercicio 4.3: Static methods
Product.comparePrice = function (a, b) {
  return a.price - b.price;
};

// Ejercicio 4.4: Shopping Cart Class
function ShoppingCart() {
  this.items = [];
}

ShoppingCart.prototype.addItem = function (product, quantity) {
  // Implementar
};

ShoppingCart.prototype.removeItem = function (productId) {
  // Implementar
};

ShoppingCart.prototype.getTotal = function () {
  // Implementar
};

ShoppingCart.prototype.getItemCount = function () {
  // Implementar
};
```

### Solución Esperada

```javascript
// Tu solución aquí...
```

---

## ⚡ Ejercicio 5: Async/Await y Promises

### Objetivo

Manejar operaciones asíncronas con Promises y async/await de manera elegante.

### Instrucciones

1. Abre `ejercicios/05-async.js`
2. Convierte callbacks a Promises
3. Implementa async/await
4. Maneja errores con try/catch

### Código Base

```javascript
// Ejercicio 5.1: Convertir callback a Promise
function fetchUser(id, callback) {
  setTimeout(() => {
    if (id === 1) {
      callback(null, { id: 1, name: 'Juan', email: 'juan@email.com' });
    } else {
      callback(new Error('User not found'), null);
    }
  }, 1000);
}

// Ejercicio 5.2: Simular API calls
function fetchProducts(callback) {
  setTimeout(() => {
    const products = [
      { id: 1, name: 'Laptop', price: 999 },
      { id: 2, name: 'Mouse', price: 25 },
    ];
    callback(null, products);
  }, 800);
}

function fetchOrders(userId, callback) {
  setTimeout(() => {
    const orders = [
      { id: 1, userId: userId, product: 'Laptop', quantity: 1 },
      { id: 2, userId: userId, product: 'Mouse', quantity: 2 },
    ];
    callback(null, orders);
  }, 600);
}

// Ejercicio 5.3: Callback hell
function loadUserData(userId, callback) {
  fetchUser(userId, (err, user) => {
    if (err) {
      callback(err, null);
      return;
    }

    fetchOrders(userId, (err, orders) => {
      if (err) {
        callback(err, null);
        return;
      }

      fetchProducts((err, products) => {
        if (err) {
          callback(err, null);
          return;
        }

        callback(null, { user, orders, products });
      });
    });
  });
}

// Ejercicio 5.4: Implementar con Promises
function fetchUserPromise(id) {
  // Tu implementación aquí
}

function fetchProductsPromise() {
  // Tu implementación aquí
}

function fetchOrdersPromise(userId) {
  // Tu implementación aquí
}

// Ejercicio 5.5: Implementar con async/await
async function loadUserDataAsync(userId) {
  // Tu implementación aquí
}

// Ejercicio 5.6: Promise.all para operaciones paralelas
async function loadAllData() {
  // Cargar usuarios, productos y órdenes en paralelo
}
```

### Solución Esperada

```javascript
// Tu solución aquí...
```

---

## 🌐 Ejercicio 6: DOM Manipulation

### Objetivo

Manipular el DOM usando APIs modernas y event handling eficiente.

### Instrucciones

1. Abre `ejercicios/06-dom.js`
2. Usa query selectors modernos
3. Implementa event delegation
4. Crea elementos dinámicamente

### Código Base (HTML)

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0" />
    <title>DOM Manipulation</title>
    <style>
      .product-card {
        border: 1px solid #ddd;
        padding: 1rem;
        margin: 0.5rem;
        border-radius: 8px;
      }
      .product-card.featured {
        border-color: #007bff;
        background-color: #f0f8ff;
      }
      .hidden {
        display: none;
      }
    </style>
  </head>
  <body>
    <div id="app">
      <h1>Tienda Online</h1>

      <div class="filters">
        <input
          type="text"
          id="searchInput"
          placeholder="Buscar productos..." />
        <select id="categoryFilter">
          <option value="">Todas las categorías</option>
          <option value="electronics">Electrónicos</option>
          <option value="furniture">Muebles</option>
        </select>
        <button id="loadProducts">Cargar Productos</button>
      </div>

      <div id="productsContainer">
        <!-- Productos se cargarán aquí -->
      </div>

      <div id="cart">
        <h2>Carrito de Compras</h2>
        <div id="cartItems"></div>
        <div id="cartTotal">Total: $0.00</div>
      </div>
    </div>

    <script src="06-dom.js"></script>
  </body>
</html>
```

### Código Base (JavaScript)

```javascript
// Ejercicio 6.1: Selectors modernos
function initializeApp() {
  // Seleccionar elementos del DOM
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const loadButton = document.getElementById('loadProducts');
  const productsContainer = document.getElementById('productsContainer');

  // Tu implementación aquí
}

// Ejercicio 6.2: Crear elementos dinámicamente
function createProductCard(product) {
  // Crear card HTML para producto
  // Estructura esperada:
  // <div class="product-card" data-id="1">
  //   <h3>Laptop</h3>
  //   <p>$999</p>
  //   <button class="add-to-cart">Agregar al carrito</button>
  // </div>
}

// Ejercicio 6.3: Event delegation
function setupEventListeners() {
  const productsContainer = document.getElementById('productsContainer');

  // Usar event delegation para manejar clicks en botones
  productsContainer.addEventListener('click', e => {
    if (e.target.classList.contains('add-to-cart')) {
      // Obtener producto y agregarlo al carrito
    }
  });
}

// Ejercicio 6.4: Filtrado y búsqueda
function filterProducts(products, searchTerm, category) {
  // Filtrar productos por término de búsqueda y categoría
}

function displayProducts(products) {
  // Mostrar productos en el DOM
}

// Ejercicio 6.5: Carrito de compras
const cart = {
  items: [],

  addItem(product) {
    // Agregar producto al carrito
  },

  removeItem(productId) {
    // Remover producto del carrito
  },

  getTotal() {
    // Calcular total del carrito
  },

  updateDisplay() {
    // Actualizar display del carrito
  },
};

// Ejercicio 6.6: Intersection Observer
function setupLazyLoading() {
  // Implementar lazy loading para imágenes
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Cargar imagen o contenido
      }
    });
  });

  // Observar elementos
}

// Datos de ejemplo
const sampleProducts = [
  {
    id: 1,
    name: 'Laptop',
    price: 999,
    category: 'electronics',
    image: 'laptop.jpg',
  },
  {
    id: 2,
    name: 'Mouse',
    price: 25,
    category: 'electronics',
    image: 'mouse.jpg',
  },
  { id: 3, name: 'Desk', price: 150, category: 'furniture', image: 'desk.jpg' },
  {
    id: 4,
    name: 'Chair',
    price: 200,
    category: 'furniture',
    image: 'chair.jpg',
  },
];

// Inicializar aplicación
document.addEventListener('DOMContentLoaded', initializeApp);
```

### Solución Esperada

```javascript
// Tu solución aquí...
```

---

## 🎯 Instrucciones Generales

### Cómo Trabajar con los Ejercicios

1. **Estructura de archivos**: Cada ejercicio tiene su propio archivo JavaScript
2. **Orden progresivo**: Completa los ejercicios en orden, cada uno construye sobre el anterior
3. **Testing**: Verifica tu código en la consola del navegador
4. **Debugging**: Usa `console.log()` para debugging y Chrome DevTools

### Criterios de Evaluación

- **Funcionalidad** (40%): El código funciona correctamente
- **Sintaxis ES6+** (30%): Usa características modernas de JavaScript
- **Código limpio** (20%): Código legible y bien organizado
- **Creatividad** (10%): Soluciones innovadoras o mejoras adicionales

### Recursos de Ayuda

- [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [ES6 Features](https://github.com/lukehoban/es6features)
- [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools)

### Próximos Pasos

Una vez completados todos los ejercicios, estarás preparado para:

- Proyecto del reloj digital interactivo
- Challenge de algoritmos
- Día 4: Validaciones y seguridad

---

**¡Excelente trabajo! Estos ejercicios te darán una base sólida en JavaScript moderno.** 🚀✨
