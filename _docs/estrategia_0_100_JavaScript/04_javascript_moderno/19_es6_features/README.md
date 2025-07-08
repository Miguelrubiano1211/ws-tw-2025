# ⚡ Características ES6+ Esenciales

## 🎯 Objetivos

- Dominar let/const vs var
- Usar template literals efectivamente
- Implementar arrow functions
- Trabajar con parámetros por defecto
- Usar spread/rest operators básicos

## 📚 Conceptos Clave

### let/const vs var

```javascript
// var - función scope, hoisting
var nombre = 'Juan';
var nombre = 'Pedro'; // Redeclaración permitida

// let - block scope, no hoisting
let edad = 25;
// let edad = 30; // Error: redeclaración no permitida

// const - block scope, inmutable
const PI = 3.14159;
// PI = 3.14; // Error: reasignación no permitida
```

### Template Literals

```javascript
const nombre = 'Ana';
const edad = 22;

// Forma antigua
const saludo1 = 'Hola, soy ' + nombre + ' y tengo ' + edad + ' años';

// Template literals (preferido)
const saludo2 = `Hola, soy ${nombre} y tengo ${edad} años`;

// Multilínea
const html = `
    <div>
        <h1>${nombre}</h1>
        <p>Edad: ${edad}</p>
    </div>
`;
```

### Arrow Functions

```javascript
// Función tradicional
function sumar(a, b) {
    return a + b;
}

// Arrow function
const sumar = (a, b) => a + b;

// Con un parámetro (paréntesis opcionales)
const cuadrado = x => x * x;

// Sin parámetros
const saludar = () => 'Hola!';

// Bloque de código
const procesarDatos = (datos) => {
    const procesados = datos.map(x => x * 2);
    return procesados;
};
```

## 🏋️ Ejercicios Prácticos

### Ejercicio 1: let/const

Refactoriza código usando let/const apropiadamente.

### Ejercicio 2: Template Literals

Crea plantillas de texto dinámicas.

### Ejercicio 3: Arrow Functions

Convierte funciones tradicionales a arrow functions.

### Ejercicio 4: Combinación

Usa todas las características juntas.

## 🚀 Proyecto Práctico

Crea un generador de tarjetas de presentación usando ES6+.

## 📁 Archivos para Completar

- `01_let_const.js`
- `02_template_literals.js`
- `03_arrow_functions.js`
- `04_proyecto_tarjetas.js`

## ✅ Criterios de Evaluación

- [ ] Usar let/const apropiadamente
- [ ] Dominar template literals
- [ ] Implementar arrow functions
- [ ] Combinar características ES6+
