# 📞 Guía Completa: Callbacks y Higher-Order Functions

## 📚 Introducción

Los **callbacks** y las **funciones de orden superior** (Higher-Order Functions) son conceptos fundamentales en JavaScript que permiten escribir código más modular, reutilizable y expresivo. Son la base de la programación funcional en JavaScript.

## 🎯 ¿Qué son los Callbacks?

Un **callback** es una función que se pasa como argumento a otra función y se ejecuta después de que ocurra algún evento o se complete alguna operación.

### Ejemplo Básico

```javascript
function saludar(nombre, callback) {
  console.log(`Hola, ${nombre}`);
  callback();
}

function despedirse() {
  console.log('¡Adiós!');
}

saludar('Juan', despedirse);
// Salida:
// Hola, Juan
// ¡Adiós!
```

### Callbacks Anónimos

```javascript
function procesarDatos(datos, callback) {
  console.log('Procesando datos...');
  const resultado = datos.map(item => item * 2);
  callback(resultado);
}

procesarDatos([1, 2, 3], function (resultado) {
  console.log('Resultado:', resultado);
});

// Con arrow function
procesarDatos([1, 2, 3], resultado => {
  console.log('Resultado:', resultado);
});
```

## 🔄 Funciones de Orden Superior

Una **función de orden superior** es una función que:

- Recibe otra función como parámetro, o
- Retorna una función como resultado

### Ejemplo 1: Función que Recibe Otra Función

```javascript
function ejecutarOperacion(a, b, operacion) {
  return operacion(a, b);
}

function sumar(x, y) {
  return x + y;
}

function multiplicar(x, y) {
  return x * y;
}

console.log(ejecutarOperacion(5, 3, sumar)); // 8
console.log(ejecutarOperacion(5, 3, multiplicar)); // 15
```

### Ejemplo 2: Función que Retorna Otra Función

```javascript
function crearMultiplicador(factor) {
  return function (numero) {
    return numero * factor;
  };
}

const doblar = crearMultiplicador(2);
const triplicar = crearMultiplicador(3);

console.log(doblar(5)); // 10
console.log(triplicar(5)); // 15
```

### Ejemplo 3: Combinando Ambos Conceptos

```javascript
function crearProcesador(transformacion) {
  return function (array, callback) {
    const resultado = array.map(transformacion);
    callback(resultado);
  };
}

const procesarNumeros = crearProcesador(x => x * x);

procesarNumeros([1, 2, 3, 4], resultado => {
  console.log('Cuadrados:', resultado); // [1, 4, 9, 16]
});
```

## 📝 Métodos de Array como Higher-Order Functions

JavaScript incluye muchos métodos de array que son funciones de orden superior:

### 1. map()

```javascript
const numeros = [1, 2, 3, 4, 5];

// Doblar cada número
const dobles = numeros.map(num => num * 2);
console.log(dobles); // [2, 4, 6, 8, 10]

// Transformar objetos
const usuarios = [
  { nombre: 'Ana', edad: 25 },
  { nombre: 'Juan', edad: 30 },
];

const nombres = usuarios.map(usuario => usuario.nombre);
console.log(nombres); // ['Ana', 'Juan']
```

### 2. filter()

```javascript
const numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Filtrar números pares
const pares = numeros.filter(num => num % 2 === 0);
console.log(pares); // [2, 4, 6, 8, 10]

// Filtrar usuarios por edad
const usuarios = [
  { nombre: 'Ana', edad: 17 },
  { nombre: 'Juan', edad: 25 },
  { nombre: 'María', edad: 30 },
];

const adultos = usuarios.filter(usuario => usuario.edad >= 18);
console.log(adultos); // [{ nombre: 'Juan', edad: 25 }, { nombre: 'María', edad: 30 }]
```

### 3. reduce()

```javascript
const numeros = [1, 2, 3, 4, 5];

// Sumar todos los números
const suma = numeros.reduce((acc, num) => acc + num, 0);
console.log(suma); // 15

// Encontrar el máximo
const maximo = numeros.reduce((max, num) => (num > max ? num : max));
console.log(maximo); // 5

// Agrupar por categoría
const productos = [
  { nombre: 'Laptop', categoria: 'tecnologia' },
  { nombre: 'Mouse', categoria: 'tecnologia' },
  { nombre: 'Silla', categoria: 'muebles' },
];

const agrupados = productos.reduce((acc, producto) => {
  if (!acc[producto.categoria]) {
    acc[producto.categoria] = [];
  }
  acc[producto.categoria].push(producto);
  return acc;
}, {});

console.log(agrupados);
// {
//   tecnologia: [{ nombre: 'Laptop', categoria: 'tecnologia' }, { nombre: 'Mouse', categoria: 'tecnologia' }],
//   muebles: [{ nombre: 'Silla', categoria: 'muebles' }]
// }
```

### 4. forEach()

```javascript
const usuarios = ['Ana', 'Juan', 'Pedro'];

// Imprimir cada usuario
usuarios.forEach(usuario => console.log(`Hola, ${usuario}`));

// Con índice
usuarios.forEach((usuario, indice) => {
  console.log(`${indice + 1}. ${usuario}`);
});
```

### 5. some() y every()

```javascript
const numeros = [2, 4, 6, 8, 10];

// ¿Algún número es par?
const algunPar = numeros.some(num => num % 2 === 0);
console.log(algunPar); // true

// ¿Todos los números son pares?
const todosPares = numeros.every(num => num % 2 === 0);
console.log(todosPares); // true

// ¿Algún número es mayor que 5?
const mayorQue5 = numeros.some(num => num > 5);
console.log(mayorQue5); // true
```

## 🔗 Encadenamiento de Métodos

```javascript
const productos = [
  { nombre: 'Laptop', precio: 1000, categoria: 'tecnologia' },
  { nombre: 'Mouse', precio: 25, categoria: 'tecnologia' },
  { nombre: 'Silla', precio: 150, categoria: 'muebles' },
  { nombre: 'Mesa', precio: 300, categoria: 'muebles' },
  { nombre: 'Teclado', precio: 80, categoria: 'tecnologia' },
];

// Encadenamiento: filtrar tecnología, mapear nombres, convertir a mayúsculas
const productosTecnologia = productos
  .filter(producto => producto.categoria === 'tecnologia')
  .map(producto => producto.nombre.toUpperCase())
  .sort();

console.log(productosTecnologia); // ['LAPTOP', 'MOUSE', 'TECLADO']

// Calcular precio promedio de productos de tecnología
const precioPromedio =
  productos
    .filter(producto => producto.categoria === 'tecnologia')
    .map(producto => producto.precio)
    .reduce((acc, precio) => acc + precio, 0) /
  productos.filter(producto => producto.categoria === 'tecnologia').length;

console.log(precioPromedio); // 368.33...
```

## 🎯 Callbacks en Operaciones Asíncronas

### setTimeout y setInterval

```javascript
// Callback con setTimeout
function mostrarMensaje(mensaje, callback) {
  console.log(mensaje);
  setTimeout(callback, 2000);
}

mostrarMensaje('Procesando...', () => {
  console.log('¡Proceso completado!');
});

// Callback con setInterval
function contador(limite, callback) {
  let count = 0;
  const interval = setInterval(() => {
    count++;
    console.log(count);

    if (count >= limite) {
      clearInterval(interval);
      callback();
    }
  }, 1000);
}

contador(5, () => {
  console.log('¡Contador terminado!');
});
```

### Simulación de Operaciones Asíncronas

```javascript
// Simulación de una petición HTTP
function obtenerDatos(callback) {
  console.log('Obteniendo datos...');

  setTimeout(() => {
    const datos = { id: 1, nombre: 'Usuario', email: 'usuario@email.com' };
    callback(null, datos); // null indica que no hay error
  }, 2000);
}

// Simulación con posible error
function obtenerDatosConError(callback) {
  console.log('Obteniendo datos...');

  setTimeout(() => {
    const exito = Math.random() > 0.5;

    if (exito) {
      const datos = { id: 1, nombre: 'Usuario' };
      callback(null, datos);
    } else {
      callback(new Error('Error al obtener datos'));
    }
  }, 1000);
}

// Uso
obtenerDatosConError((error, datos) => {
  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log('Datos obtenidos:', datos);
  }
});
```

## 🔧 Patrones Avanzados

### 1. Curry (Currying)

```javascript
// Función que suma tres números
function sumar(a, b, c) {
  return a + b + c;
}

// Versión curry
function sumarCurry(a) {
  return function (b) {
    return function (c) {
      return a + b + c;
    };
  };
}

// Uso
const sumar5 = sumarCurry(5);
const sumar5y3 = sumar5(3);
const resultado = sumar5y3(2); // 10

// Versión con arrow functions
const sumarCurryArrow = a => b => c => a + b + c;

console.log(sumarCurryArrow(5)(3)(2)); // 10
```

### 2. Composición de Funciones

```javascript
// Funciones simples
const doblar = x => x * 2;
const sumar3 = x => x + 3;
const elevarAlCuadrado = x => x * x;

// Composición manual
const componer = (f, g) => x => f(g(x));

const doblarYSumar3 = componer(sumar3, doblar);
console.log(doblarYSumar3(5)); // 13 (5 * 2 + 3)

// Composición múltiple
const componerMultiple =
  (...funciones) =>
  x =>
    funciones.reduce((acc, fn) => fn(acc), x);

const operacionCompleja = componerMultiple(doblar, sumar3, elevarAlCuadrado);
console.log(operacionCompleja(2)); // 49 ((2 * 2) + 3)^2
```

### 3. Memoización

```javascript
function memoizar(fn) {
  const cache = {};

  return function (...args) {
    const key = JSON.stringify(args);

    if (cache[key]) {
      console.log('Resultado desde cache');
      return cache[key];
    }

    const resultado = fn.apply(this, args);
    cache[key] = resultado;
    return resultado;
  };
}

// Función costosa
function factorial(n) {
  console.log(`Calculando factorial de ${n}`);
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

const factorialMemoizado = memoizar(factorial);

console.log(factorialMemoizado(5)); // Calcula
console.log(factorialMemoizado(5)); // Desde cache
console.log(factorialMemoizado(6)); // Calcula solo 6, usa cache para 5
```

## 🚨 Errores Comunes

### 1. Callback Hell

```javascript
// ❌ Callback Hell
obtenerUsuario(id, (error, usuario) => {
  if (error) {
    console.error(error);
  } else {
    obtenerPedidos(usuario.id, (error, pedidos) => {
      if (error) {
        console.error(error);
      } else {
        obtenerDetalles(pedidos[0].id, (error, detalles) => {
          if (error) {
            console.error(error);
          } else {
            console.log(detalles);
          }
        });
      }
    });
  }
});

// ✅ Mejor con funciones separadas
function manejarError(error) {
  console.error(error);
}

function procesarUsuario(error, usuario) {
  if (error) return manejarError(error);
  obtenerPedidos(usuario.id, procesarPedidos);
}

function procesarPedidos(error, pedidos) {
  if (error) return manejarError(error);
  obtenerDetalles(pedidos[0].id, procesarDetalles);
}

function procesarDetalles(error, detalles) {
  if (error) return manejarError(error);
  console.log(detalles);
}

obtenerUsuario(id, procesarUsuario);
```

### 2. Perder el Contexto `this`

```javascript
// ❌ Problema con this
const objeto = {
  nombre: 'Mi Objeto',
  metodo: function () {
    [1, 2, 3].forEach(function (num) {
      console.log(this.nombre, num); // undefined
    });
  },
};

// ✅ Solución con arrow function
const objeto = {
  nombre: 'Mi Objeto',
  metodo: function () {
    [1, 2, 3].forEach(num => {
      console.log(this.nombre, num); // 'Mi Objeto'
    });
  },
};

// ✅ Solución con bind
const objeto = {
  nombre: 'Mi Objeto',
  metodo: function () {
    [1, 2, 3].forEach(
      function (num) {
        console.log(this.nombre, num);
      }.bind(this)
    );
  },
};
```

## 🧪 Ejercicios Prácticos

### Ejercicio 1: Crear Utilidades con Higher-Order Functions

```javascript
// Crear una función que genere validadores
function crearValidador(tipo) {
  switch (tipo) {
    case 'email':
      return value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    case 'telefono':
      return value => /^\d{10}$/.test(value);
    case 'requerido':
      return value => value && value.trim().length > 0;
    default:
      return () => true;
  }
}

// Uso
const validarEmail = crearValidador('email');
const validarTelefono = crearValidador('telefono');

console.log(validarEmail('test@email.com')); // true
console.log(validarTelefono('1234567890')); // true
```

### Ejercicio 2: Sistema de Eventos

```javascript
// Crear un sistema de eventos simple
function crearEventos() {
  const eventos = {};

  return {
    on: function (evento, callback) {
      if (!eventos[evento]) {
        eventos[evento] = [];
      }
      eventos[evento].push(callback);
    },

    emit: function (evento, ...args) {
      if (eventos[evento]) {
        eventos[evento].forEach(callback => callback(...args));
      }
    },

    off: function (evento, callback) {
      if (eventos[evento]) {
        eventos[evento] = eventos[evento].filter(cb => cb !== callback);
      }
    },
  };
}

// Uso
const emisor = crearEventos();

emisor.on('usuario-creado', usuario => {
  console.log('Usuario creado:', usuario);
});

emisor.on('usuario-creado', usuario => {
  console.log('Enviando email de bienvenida a:', usuario.email);
});

emisor.emit('usuario-creado', { nombre: 'Juan', email: 'juan@email.com' });
```

### Ejercicio 3: Pipeline de Procesamiento

```javascript
// Crear una función pipeline
function pipeline(...funciones) {
  return function (valor) {
    return funciones.reduce((acc, fn) => fn(acc), valor);
  };
}

// Funciones de procesamiento
const limpiarTexto = text => text.trim();
const convertirMayusculas = text => text.toUpperCase();
const agregarPrefijo = text => `PROCESADO: ${text}`;

// Crear pipeline
const procesarTexto = pipeline(
  limpiarTexto,
  convertirMayusculas,
  agregarPrefijo
);

console.log(procesarTexto('  hola mundo  ')); // "PROCESADO: HOLA MUNDO"
```

## 📖 Recursos Adicionales

- [MDN - Callback function](https://developer.mozilla.org/en-US/docs/Glossary/Callback_function)
- [MDN - Higher-order functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions#higher-order_functions)
- [Functional Programming in JavaScript](https://mostly-adequate.gitbooks.io/mostly-adequate-guide/)
- [JavaScript.info - Callbacks](https://javascript.info/callbacks)

## 🎯 Puntos Clave para Recordar

1. **Callbacks** son funciones pasadas como argumentos a otras funciones
2. **Higher-order functions** reciben o retornan otras funciones
3. **Array methods** como map, filter, reduce son HOF muy útiles
4. **Encadenar métodos** permite procesamiento fluido de datos
5. **Evita callback hell** usando funciones nombradas o promesas
6. **Arrow functions** mantienen el contexto `this`
7. **Composición** permite crear funciones complejas desde simples
8. **Memoización** optimiza funciones costosas con cache
