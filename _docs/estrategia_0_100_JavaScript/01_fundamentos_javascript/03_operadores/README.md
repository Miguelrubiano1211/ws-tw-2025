# ⚡ Tema 3: Operadores en JavaScript

## 🎯 Objetivos

- Dominar operadores aritméticos
- Comprender operadores de comparación
- Utilizar operadores lógicos
- Aplicar operadores de asignación
- Trabajar con precedencia de operadores

## 📚 Conceptos Clave

### Operadores Aritméticos

```javascript
let a = 10;
let b = 3;

console.log(a + b);  // 13 (suma)
console.log(a - b);  // 7 (resta)
console.log(a * b);  // 30 (multiplicación)
console.log(a / b);  // 3.333... (división)
console.log(a % b);  // 1 (módulo/resto)
console.log(a ** b); // 1000 (exponenciación)

// Incremento y decremento
console.log(++a);    // 11 (pre-incremento)
console.log(a++);    // 11 (post-incremento)
console.log(--b);    // 2 (pre-decremento)
console.log(b--);    // 2 (post-decremento)
```

### Operadores de Comparación

```javascript
console.log(5 == '5');   // true (igualdad con conversión)
console.log(5 === '5');  // false (igualdad estricta)
console.log(5 != '5');   // false (desigualdad con conversión)
console.log(5 !== '5');  // true (desigualdad estricta)
console.log(5 > 3);      // true (mayor que)
console.log(5 < 3);      // false (menor que)
console.log(5 >= 5);     // true (mayor o igual)
console.log(5 <= 4);     // false (menor o igual)
```

### Operadores Lógicos

```javascript
console.log(true && false);  // false (AND)
console.log(true || false);  // true (OR)
console.log(!true);          // false (NOT)
console.log(!!0);            // false (doble negación)
```

### Operadores de Asignación

```javascript
let x = 10;
x += 5;  // x = x + 5 → 15
x -= 3;  // x = x - 3 → 12
x *= 2;  // x = x * 2 → 24
x /= 4;  // x = x / 4 → 6
x %= 5;  // x = x % 5 → 1
```

## 🏋️ Ejercicios Prácticos

### Ejercicio 1: Operadores Aritméticos

Crea una calculadora básica con todos los operadores.

### Ejercicio 2: Comparaciones

Practica comparaciones entre diferentes tipos de datos.

### Ejercicio 3: Lógica Booleana

Implementa expresiones lógicas complejas.

### Ejercicio 4: Asignaciones

Usa operadores de asignación para modificar variables.

## 🚀 Desafío Adicional

Crea un sistema de evaluación de expresiones matemáticas.

## 📁 Archivos para Completar

- `01_aritmeticos.js`
- `02_comparacion.js`
- `03_logicos.js`
- `04_asignacion.js`
- `05_desafio_calculadora.js`

## ✅ Criterios de Evaluación

- [ ] Usar correctamente todos los operadores
- [ ] Entender precedencia de operadores
- [ ] Manejar conversiones automáticas
- [ ] Aplicar en situaciones prácticas
