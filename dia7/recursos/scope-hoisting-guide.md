# 🔍 Guía Completa: Scope y Hoisting en JavaScript

## 📚 Introducción

El **scope** (ámbito) y **hoisting** (elevación) son conceptos fundamentales en JavaScript que determinan cómo y dónde se pueden acceder a las variables y funciones en tu código.

## 🎯 Scope (Ámbito)

### ¿Qué es el Scope?

El scope determina la accesibilidad de variables, funciones y objetos en alguna parte particular de tu código durante el tiempo de ejecución.

### Tipos de Scope

#### 1. Global Scope

```javascript
// Variable global
var mensajeGlobal = 'Soy global';
let numeroGlobal = 42;

function mostrarGlobal() {
  console.log(mensajeGlobal); // ✅ Accesible
  console.log(numeroGlobal); // ✅ Accesible
}

mostrarGlobal();
```

#### 2. Function Scope

```javascript
function miFuncion() {
  var variableFuncion = 'Solo dentro de la función';

  function funcionInterna() {
    console.log(variableFuncion); // ✅ Accesible
  }

  funcionInterna();
}

miFuncion();
// console.log(variableFuncion); // ❌ Error: no está definida
```

#### 3. Block Scope (ES6+)

```javascript
if (true) {
  var varVariable = 'var no respeta block scope';
  let letVariable = 'let respeta block scope';
  const constVariable = 'const respeta block scope';
}

console.log(varVariable); // ✅ Accesible
// console.log(letVariable);    // ❌ Error: no está definida
// console.log(constVariable);  // ❌ Error: no está definida
```

### Cadena de Scope (Scope Chain)

```javascript
var global = 'Global';

function exterior() {
  var exterior = 'Exterior';

  function interior() {
    var interior = 'Interior';

    console.log(interior); // "Interior"
    console.log(exterior); // "Exterior"
    console.log(global); // "Global"
  }

  interior();
}

exterior();
```

## 🔄 Hoisting

### ¿Qué es el Hoisting?

El hoisting es un comportamiento de JavaScript donde las declaraciones de variables y funciones se "elevan" al inicio de su scope.

### Hoisting de Variables

#### var

```javascript
console.log(miVariable); // undefined (no error)
var miVariable = 'Hola';
console.log(miVariable); // "Hola"

// Equivalente a:
var miVariable;
console.log(miVariable); // undefined
miVariable = 'Hola';
console.log(miVariable); // "Hola"
```

#### let y const

```javascript
console.log(miLet); // ❌ ReferenceError: Cannot access before initialization
let miLet = 'Hola';

console.log(miConst); // ❌ ReferenceError: Cannot access before initialization
const miConst = 'Mundo';
```

### Hoisting de Funciones

#### Function Declarations

```javascript
miFuncion(); // ✅ Funciona - "Hola desde la función"

function miFuncion() {
  console.log('Hola desde la función');
}
```

#### Function Expressions

```javascript
// miFuncion(); // ❌ TypeError: miFuncion is not a function

var miFuncion = function () {
  console.log('Hola desde la función');
};

miFuncion(); // ✅ Funciona
```

#### Arrow Functions

```javascript
// miFuncion(); // ❌ ReferenceError: Cannot access before initialization

const miFuncion = () => {
  console.log('Hola desde la función');
};

miFuncion(); // ✅ Funciona
```

## 📝 Ejemplos Prácticos

### Ejemplo 1: Scope y Closures

```javascript
function contador() {
  var count = 0;

  return function () {
    count++;
    return count;
  };
}

const miContador = contador();
console.log(miContador()); // 1
console.log(miContador()); // 2
console.log(miContador()); // 3
```

### Ejemplo 2: Hoisting y Loops

```javascript
// Problema común con var
for (var i = 0; i < 3; i++) {
  setTimeout(function () {
    console.log(i); // 3, 3, 3
  }, 100);
}

// Solución con let
for (let i = 0; i < 3; i++) {
  setTimeout(function () {
    console.log(i); // 0, 1, 2
  }, 100);
}
```

### Ejemplo 3: Temporal Dead Zone

```javascript
function temporalDeadZone() {
  console.log(typeof miVar); // undefined
  console.log(typeof miLet); // ❌ ReferenceError

  var miVar = 1;
  let miLet = 2;
}
```

## 🎯 Mejores Prácticas

### 1. Usar let y const en lugar de var

```javascript
// ❌ Evitar
var nombre = 'Juan';
var edad = 25;

// ✅ Preferir
const nombre = 'Juan';
let edad = 25;
```

### 2. Declarar variables antes de usarlas

```javascript
// ❌ Evitar
console.log(mensaje);
var mensaje = 'Hola';

// ✅ Preferir
const mensaje = 'Hola';
console.log(mensaje);
```

### 3. Evitar el scope global

```javascript
// ❌ Evitar
var configuracion = {
  api: 'https://api.ejemplo.com',
  timeout: 5000,
};

// ✅ Preferir
(function () {
  const configuracion = {
    api: 'https://api.ejemplo.com',
    timeout: 5000,
  };

  // Código de la aplicación
})();
```

### 4. Usar IIFE para evitar contaminación

```javascript
// Immediately Invoked Function Expression
(function () {
  const variablePrivada = 'No contamina el scope global';

  // Lógica de la aplicación
})();
```

## 🚨 Errores Comunes

### 1. Redeclaración con var

```javascript
var nombre = 'Juan';
var nombre = 'Pedro'; // No error, pero problemático
console.log(nombre); // "Pedro"
```

### 2. Acceso antes de inicialización

```javascript
console.log(miVariable); // undefined
var miVariable = 'Hola';

console.log(miLet); // ❌ ReferenceError
let miLet = 'Mundo';
```

### 3. Modificación accidental de variables globales

```javascript
function procesarDatos() {
  // Sin var/let/const, se crea una variable global
  resultado = 'Datos procesados';
  return resultado;
}

procesarDatos();
console.log(resultado); // "Datos procesados" (global)
```

## 🔧 Herramientas de Debugging

### 1. Usar console.log para verificar scope

```javascript
function debugScope() {
  const exterior = 'Exterior';

  function interior() {
    const interior = 'Interior';
    console.log('Desde interior:', { exterior, interior });
  }

  interior();
  console.log('Desde exterior:', { exterior });
}
```

### 2. Usar debugger para inspeccionar

```javascript
function investigarScope() {
  const variable1 = 'Valor 1';

  function anidada() {
    const variable2 = 'Valor 2';
    debugger; // Pausa aquí para inspeccionar
    console.log(variable1, variable2);
  }

  anidada();
}
```

## 🧪 Ejercicios de Práctica

### Ejercicio 1: Identificar Scope

```javascript
var a = 1;

function outer() {
  var b = 2;

  function inner() {
    var c = 3;
    // ¿Qué variables son accesibles aquí?
  }

  inner();
  // ¿Qué variables son accesibles aquí?
}

outer();
// ¿Qué variables son accesibles aquí?
```

### Ejercicio 2: Predecir Hoisting

```javascript
console.log(a); // ¿Qué imprime?
console.log(b); // ¿Qué imprime?
console.log(c); // ¿Qué imprime?

var a = 1;
let b = 2;
const c = 3;
```

### Ejercicio 3: Resolver Problemas de Scope

```javascript
// Problema: ¿Por qué imprime 3 tres veces?
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}

// Solución 1: usar let
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}

// Solución 2: usar closure
for (var i = 0; i < 3; i++) {
  (function (j) {
    setTimeout(() => console.log(j), 100);
  })(i);
}
```

## 📖 Recursos Adicionales

- [MDN - Scope](https://developer.mozilla.org/es/docs/Glossary/Scope)
- [MDN - Hoisting](https://developer.mozilla.org/es/docs/Glossary/Hoisting)
- [JavaScript.info - Variable scope, closure](https://javascript.info/closure)
- [You Don't Know JS - Scope & Closures](https://github.com/getify/You-Dont-Know-JS/tree/2nd-ed/scope-closures)

## 🎯 Puntos Clave para Recordar

1. **var** tiene function scope, **let** y **const** tienen block scope
2. El hoisting "eleva" las declaraciones pero no las inicializaciones
3. Las function declarations se elevan completamente
4. Las arrow functions no se elevan
5. La Temporal Dead Zone afecta a let y const
6. Siempre declara variables antes de usarlas
7. Evita el scope global cuando sea posible
8. Usa const por defecto, let cuando necesites reasignar
