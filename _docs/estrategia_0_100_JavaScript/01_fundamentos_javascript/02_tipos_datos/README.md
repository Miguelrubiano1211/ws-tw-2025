# 📊 Tema 2: Tipos de Datos en JavaScript

## 🎯 Objetivos

- Dominar los tipos de datos primitivos
- Comprender tipos de datos no primitivos
- Aprender conversiones entre tipos
- Usar typeof y métodos de verificación

## 📚 Conceptos Clave

### Tipos Primitivos

```javascript
// String (cadena de texto)
let nombre = 'Juan';
let apellido = "Pérez";
let saludo = `Hola, ${nombre}`;

// Number (números)
let edad = 25;
let precio = 99.99;
let negativo = -10;

// Boolean (verdadero/falso)
let esEstudiante = true;
let tieneWork = false;

// Undefined (sin valor asignado)
let sinValor;
console.log(sinValor); // undefined

// Null (valor nulo intencionalmente)
let valorNulo = null;

// Symbol (único e inmutable)
let simbolo = Symbol('id');
```

### Tipos No Primitivos

```javascript
// Object (objeto)
let persona = {
    nombre: 'Ana',
    edad: 30,
    ciudad: 'Bogotá'
};

// Array (arreglo)
let numeros = [1, 2, 3, 4, 5];
let frutas = ['manzana', 'banana', 'naranja'];

// Function (función)
function saludar() {
    return 'Hola!';
}
```

### Verificación de Tipos

```javascript
typeof 'hola';          // 'string'
typeof 42;              // 'number'
typeof true;            // 'boolean'
typeof undefined;       // 'undefined'
typeof null;            // 'object' (peculiaridad de JS)
typeof [];              // 'object'
typeof {};              // 'object'
typeof function() {};   // 'function'
```

## 🏋️ Ejercicios Prácticos

### Ejercicio 1: Tipos Primitivos

Crea variables de cada tipo primitivo y muestra su tipo usando `typeof`.

### Ejercicio 2: Conversiones

Practica convertir entre diferentes tipos de datos.

### Ejercicio 3: Verificaciones

Crea funciones para verificar tipos de datos específicos.

### Ejercicio 4: Objetos y Arrays

Trabaja con estructuras de datos complejas.

## 🚀 Desafío Adicional

Crea un sistema de inventario que maneje diferentes tipos de datos.

## 📁 Archivos para Completar

- `01_primitivos.js`
- `02_no_primitivos.js`
- `03_conversiones.js`
- `04_verificaciones.js`
- `05_desafio_inventario.js`

## ✅ Criterios de Evaluación

- [ ] Identificar correctamente todos los tipos
- [ ] Usar typeof apropiadamente
- [ ] Realizar conversiones seguras
- [ ] Manejar casos especiales (null, undefined)
