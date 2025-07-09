# Guía de Métodos de Objetos en JavaScript

## 📋 Métodos Fundamentales de Object

### Object.keys()

Devuelve un array con las claves (propiedades) de un objeto.

```javascript
const producto = {
  nombre: 'Laptop',
  precio: 1000000,
  stock: 5,
};

const propiedades = Object.keys(producto);
console.log(propiedades); // ['nombre', 'precio', 'stock']

// Uso práctico: Iterar sobre propiedades
Object.keys(producto).forEach(propiedad => {
  console.log(`${propiedad}: ${producto[propiedad]}`);
});
```

### Object.values()

Devuelve un array con los valores de un objeto.

```javascript
const producto = {
  nombre: 'Laptop',
  precio: 1000000,
  stock: 5,
};

const valores = Object.values(producto);
console.log(valores); // ['Laptop', 1000000, 5]

// Uso práctico: Sumar valores numéricos
const valoresNumericos = Object.values(producto).filter(
  v => typeof v === 'number'
);
const suma = valoresNumericos.reduce((total, valor) => total + valor, 0);
```

### Object.entries()

Devuelve un array de arrays, donde cada sub-array contiene [clave, valor].

```javascript
const producto = {
  nombre: 'Laptop',
  precio: 1000000,
  stock: 5,
};

const entradas = Object.entries(producto);
console.log(entradas);
// [['nombre', 'Laptop'], ['precio', 1000000], ['stock', 5]]

// Uso práctico: Crear objeto filtrado
const productoFiltrado = Object.fromEntries(
  Object.entries(producto).filter(([clave, valor]) => typeof valor === 'number')
);
```

### Object.assign()

Copia propiedades de uno o más objetos fuente a un objeto destino.

```javascript
const base = { nombre: 'Producto', activo: true };
const detalles = { precio: 50000, stock: 10 };
const extras = { descuento: 0.1 };

// Método 1: Modificar objeto existente
const resultado1 = Object.assign(base, detalles, extras);

// Método 2: Crear nuevo objeto (recomendado)
const resultado2 = Object.assign({}, base, detalles, extras);

// Método 3: Spread operator (ES6+)
const resultado3 = { ...base, ...detalles, ...extras };
```

### Object.create()

Crea un nuevo objeto con el prototipo especificado.

```javascript
const prototipo = {
  mostrarInfo() {
    return `${this.nombre} - $${this.precio}`;
  },
};

const producto = Object.create(prototipo);
producto.nombre = 'Tablet';
producto.precio = 500000;

console.log(producto.mostrarInfo()); // 'Tablet - $500000'
```

## 🔍 Métodos de Verificación

### Object.hasOwnProperty()

Verifica si un objeto tiene una propiedad específica.

```javascript
const producto = {
  nombre: 'Smartphone',
  precio: 800000,
};

console.log(producto.hasOwnProperty('nombre')); // true
console.log(producto.hasOwnProperty('stock')); // false

// Uso seguro con bracket notation
console.log(Object.prototype.hasOwnProperty.call(producto, 'nombre')); // true
```

### Object.getOwnPropertyNames()

Devuelve todas las propiedades de un objeto (incluidas las no enumerables).

```javascript
const producto = {
  nombre: 'Laptop',
  precio: 1000000,
};

Object.defineProperty(producto, 'id', {
  value: 'prod_001',
  enumerable: false,
});

console.log(Object.keys(producto)); // ['nombre', 'precio']
console.log(Object.getOwnPropertyNames(producto)); // ['nombre', 'precio', 'id']
```

### Object.getOwnPropertyDescriptors()

Devuelve descriptores de todas las propiedades de un objeto.

```javascript
const producto = {
  nombre: 'Tablet',
  precio: 600000,
};

const descriptores = Object.getOwnPropertyDescriptors(producto);
console.log(descriptores);
/*
{
  nombre: { value: 'Tablet', writable: true, enumerable: true, configurable: true },
  precio: { value: 600000, writable: true, enumerable: true, configurable: true }
}
*/
```

## 🔒 Métodos de Control de Propiedades

### Object.defineProperty()

Define una nueva propiedad o modifica una existente con control específico.

```javascript
const producto = {};

Object.defineProperty(producto, 'precio', {
  value: 100000,
  writable: false, // No se puede modificar
  enumerable: true, // Aparece en loops
  configurable: false, // No se puede eliminar
});

Object.defineProperty(producto, 'calcularDescuento', {
  value: function (porcentaje) {
    return this.precio * (1 - porcentaje / 100);
  },
  enumerable: false, // No aparece en Object.keys()
});

console.log(producto.precio); // 100000
console.log(producto.calcularDescuento(10)); // 90000
```

### Object.defineProperties()

Define múltiples propiedades a la vez.

```javascript
const producto = {};

Object.defineProperties(producto, {
  nombre: {
    value: 'Smartphone',
    writable: true,
    enumerable: true,
  },
  precio: {
    value: 800000,
    writable: false,
    enumerable: true,
  },
  id: {
    value: 'prod_001',
    writable: false,
    enumerable: false,
  },
});
```

## 🛡️ Métodos de Protección de Objetos

### Object.freeze()

Congela un objeto completamente (no se pueden agregar, eliminar o modificar propiedades).

```javascript
const producto = {
  nombre: 'Laptop',
  precio: 1000000,
  especificaciones: {
    ram: '8GB',
    almacenamiento: '256GB',
  },
};

Object.freeze(producto);

// Estos cambios no tendrán efecto
producto.precio = 900000; // No funciona
producto.stock = 5; // No funciona
delete producto.nombre; // No funciona

console.log(producto.precio); // 1000000 (sin cambios)

// IMPORTANTE: freeze es superficial
producto.especificaciones.ram = '16GB'; // ¡Esto SÍ funciona!

// Para congelado profundo:
function deepFreeze(obj) {
  Object.freeze(obj);
  Object.values(obj).forEach(value => {
    if (typeof value === 'object' && value !== null) {
      deepFreeze(value);
    }
  });
  return obj;
}
```

### Object.seal()

Sella un objeto (se pueden modificar propiedades existentes pero no agregar/eliminar).

```javascript
const producto = {
  nombre: 'Tablet',
  precio: 500000,
};

Object.seal(producto);

producto.precio = 450000; // ✅ Funciona
producto.stock = 10; // ❌ No funciona
delete producto.nombre; // ❌ No funciona

console.log(producto.precio); // 450000
```

### Object.preventExtensions()

Previene que se agreguen nuevas propiedades al objeto.

```javascript
const producto = {
  nombre: 'Smartphone',
  precio: 800000,
};

Object.preventExtensions(producto);

producto.precio = 750000; // ✅ Funciona
producto.stock = 15; // ❌ No funciona
delete producto.nombre; // ✅ Funciona

console.log(producto); // { precio: 750000 }
```

## 🔍 Métodos de Verificación de Estado

### Object.isFrozen()

Verifica si un objeto está congelado.

```javascript
const producto = { nombre: 'Laptop', precio: 1000000 };

console.log(Object.isFrozen(producto)); // false

Object.freeze(producto);
console.log(Object.isFrozen(producto)); // true
```

### Object.isSealed()

Verifica si un objeto está sellado.

```javascript
const producto = { nombre: 'Tablet', precio: 500000 };

console.log(Object.isSealed(producto)); // false

Object.seal(producto);
console.log(Object.isSealed(producto)); // true
```

### Object.isExtensible()

Verifica si se pueden agregar propiedades al objeto.

```javascript
const producto = { nombre: 'Smartphone', precio: 800000 };

console.log(Object.isExtensible(producto)); // true

Object.preventExtensions(producto);
console.log(Object.isExtensible(producto)); // false
```

## 📊 Ejemplos Prácticos para Sistema de Inventario

### 1. Validación de Propiedades Requeridas

```javascript
function validarProducto(producto) {
  const propiedades = Object.keys(producto);
  const requeridas = ['nombre', 'precio', 'stock'];

  const faltantes = requeridas.filter(prop => !propiedades.includes(prop));

  if (faltantes.length > 0) {
    throw new Error(`Propiedades faltantes: ${faltantes.join(', ')}`);
  }

  return true;
}
```

### 2. Clonado Profundo de Objetos

```javascript
function clonarProducto(producto) {
  return Object.assign({}, producto, {
    especificaciones: Object.assign({}, producto.especificaciones),
  });
}

// O usando spread operator
function clonarProductoModerno(producto) {
  return {
    ...producto,
    especificaciones: { ...producto.especificaciones },
  };
}
```

### 3. Filtrado de Propiedades

```javascript
function filtrarPropiedadesProducto(producto, propiedadesPermitidas) {
  return Object.fromEntries(
    Object.entries(producto).filter(([clave]) =>
      propiedadesPermitidas.includes(clave)
    )
  );
}

const producto = {
  id: 'prod_001',
  nombre: 'Laptop',
  precio: 1000000,
  stock: 5,
  proveedor: 'TechCorp',
  fechaCreacion: '2024-01-15',
};

const productoPublico = filtrarPropiedadesProducto(producto, [
  'nombre',
  'precio',
  'stock',
]);
```

### 4. Transformación de Datos

```javascript
function transformarProductoParaAPI(producto) {
  return Object.entries(producto).reduce((acc, [clave, valor]) => {
    // Convertir camelCase a snake_case
    const claveAPI = clave.replace(
      /[A-Z]/g,
      letra => `_${letra.toLowerCase()}`
    );
    acc[claveAPI] = valor;
    return acc;
  }, {});
}

const producto = {
  nombreProducto: 'Laptop',
  precioVenta: 1000000,
  stockDisponible: 5,
};

const productoAPI = transformarProductoParaAPI(producto);
// { nombre_producto: 'Laptop', precio_venta: 1000000, stock_disponible: 5 }
```

### 5. Calculadora de Estadísticas

```javascript
function calcularEstadisticasInventario(productos) {
  return Object.fromEntries(
    Object.entries({
      totalProductos: productos.length,
      valorTotal: productos.reduce((total, p) => total + p.precio * p.stock, 0),
      stockTotal: productos.reduce((total, p) => total + p.stock, 0),
      precioPromedio:
        productos.reduce((total, p) => total + p.precio, 0) / productos.length,
      productosActivos: productos.filter(p => p.activo).length,
      categorias: [...new Set(productos.map(p => p.categoria))].length,
    }).map(([clave, valor]) => [
      clave,
      typeof valor === 'number' ? Math.round(valor) : valor,
    ])
  );
}
```

## 💡 Consejos y Mejores Prácticas

### 1. Usa Object.hasOwnProperty() de forma segura

```javascript
// ❌ Problemático si el objeto no tiene el método
if (producto.hasOwnProperty('nombre')) { ... }

// ✅ Seguro siempre
if (Object.prototype.hasOwnProperty.call(producto, 'nombre')) { ... }

// ✅ Moderno (ES2022+)
if (Object.hasOwn(producto, 'nombre')) { ... }
```

### 2. Evita modificar Object.prototype

```javascript
// ❌ Nunca hagas esto
Object.prototype.miMetodo = function() { ... };

// ✅ Usa Object.create() o clases
const MiObjeto = Object.create(Object.prototype);
MiObjeto.miMetodo = function() { ... };
```

### 3. Usa spread operator para clonar objetos simples

```javascript
// ✅ Para objetos simples
const copia = { ...original };

// ✅ Para objetos complejos
const copia = JSON.parse(JSON.stringify(original)); // Pierde funciones y fechas
```

### 4. Combina métodos para operaciones complejas

```javascript
// Ejemplo: Filtrar y transformar productos
const productosDescuento = Object.fromEntries(
  Object.entries(inventario)
    .filter(([id, producto]) => producto.categoria === 'Electrónicos')
    .map(([id, producto]) => [
      id,
      { ...producto, precio: producto.precio * 0.9 },
    ])
);
```

## 🎯 Ejercicios Prácticos

1. **Validador de Esquemas**: Crea una función que valide si un objeto cumple con un esquema específico
2. **Conversor de Formatos**: Transforma objetos entre diferentes formatos (camelCase ↔ snake_case)
3. **Sistema de Permisos**: Implementa un sistema que controle qué propiedades se pueden leer/escribir
4. **Auditoría de Cambios**: Crea un sistema que registre todos los cambios realizados en un objeto
5. **Calculadora de Diferencias**: Compara dos objetos y muestra las diferencias entre ellos

---

_Esta guía forma parte del entrenamiento WorldSkills - Día 5: Objetos y Propiedades_
