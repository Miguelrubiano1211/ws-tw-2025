# 🧠 Ejemplos de Algoritmos Comunes

## 🎯 Algoritmos Fundamentales para JavaScript

### 1. **Algoritmos de Búsqueda**

#### **Búsqueda Lineal**

```javascript
function busquedaLineal(array, objetivo) {
  for (let i = 0; i < array.length; i++) {
    if (array[i] === objetivo) {
      return i; // Retorna índice si encuentra
    }
  }
  return -1; // No encontrado
}

// Ejemplo de uso
const numeros = [3, 7, 1, 9, 2, 8];
const indice = busquedaLineal(numeros, 9);
console.log(indice); // 3
```

#### **Búsqueda Binaria**

```javascript
function busquedaBinaria(array, objetivo) {
  let inicio = 0;
  let fin = array.length - 1;

  while (inicio <= fin) {
    const medio = Math.floor((inicio + fin) / 2);

    if (array[medio] === objetivo) {
      return medio;
    } else if (array[medio] < objetivo) {
      inicio = medio + 1;
    } else {
      fin = medio - 1;
    }
  }

  return -1; // No encontrado
}

// Ejemplo de uso (array debe estar ordenado)
const numerosOrdenados = [1, 3, 5, 7, 9, 11, 13];
const indice = busquedaBinaria(numerosOrdenados, 7);
console.log(indice); // 3
```

### 2. **Algoritmos de Ordenamiento**

#### **Bubble Sort**

```javascript
function bubbleSort(array) {
  const arr = [...array]; // Copia para no mutar original
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Intercambiar elementos
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }

  return arr;
}

// Ejemplo de uso
const numerosDesordenados = [64, 34, 25, 12, 22, 11, 90];
const ordenados = bubbleSort(numerosDesordenados);
console.log(ordenados); // [11, 12, 22, 25, 34, 64, 90]
```

#### **Quick Sort**

```javascript
function quickSort(array) {
  if (array.length <= 1) {
    return array;
  }

  const pivote = array[array.length - 1];
  const izquierda = [];
  const derecha = [];

  for (let i = 0; i < array.length - 1; i++) {
    if (array[i] < pivote) {
      izquierda.push(array[i]);
    } else {
      derecha.push(array[i]);
    }
  }

  return [...quickSort(izquierda), pivote, ...quickSort(derecha)];
}

// Ejemplo de uso
const numeros = [3, 6, 8, 10, 1, 2, 1];
const ordenados = quickSort(numeros);
console.log(ordenados); // [1, 1, 2, 3, 6, 8, 10]
```

### 3. **Algoritmos de Manipulación de Arrays**

#### **Encontrar el Máximo**

```javascript
function encontrarMaximo(array) {
  if (array.length === 0) return null;

  let maximo = array[0];
  for (let i = 1; i < array.length; i++) {
    if (array[i] > maximo) {
      maximo = array[i];
    }
  }
  return maximo;
}

// Versión funcional
const encontrarMaximoFuncional = array => {
  return array.reduce((max, actual) => (actual > max ? actual : max));
};

// Ejemplo de uso
const numeros = [3, 7, 1, 9, 2, 8];
console.log(encontrarMaximo(numeros)); // 9
```

#### **Remover Duplicados**

```javascript
function removerDuplicados(array) {
  return [...new Set(array)];
}

// Versión manual
function removerDuplicadosManual(array) {
  const resultado = [];
  for (let i = 0; i < array.length; i++) {
    if (!resultado.includes(array[i])) {
      resultado.push(array[i]);
    }
  }
  return resultado;
}

// Ejemplo de uso
const conDuplicados = [1, 2, 2, 3, 4, 4, 5];
console.log(removerDuplicados(conDuplicados)); // [1, 2, 3, 4, 5]
```

### 4. **Algoritmos de Strings**

#### **Palíndromo**

```javascript
function esPalindromo(str) {
  const limpio = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return limpio === limpio.split('').reverse().join('');
}

// Versión optimizada
function esPalindromoOptimizado(str) {
  const limpio = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  let inicio = 0;
  let fin = limpio.length - 1;

  while (inicio < fin) {
    if (limpio[inicio] !== limpio[fin]) {
      return false;
    }
    inicio++;
    fin--;
  }

  return true;
}

// Ejemplo de uso
console.log(esPalindromo('A man, a plan, a canal: Panama')); // true
console.log(esPalindromo('race a car')); // false
```

#### **Contar Caracteres**

```javascript
function contarCaracteres(str) {
  const contador = {};

  for (let char of str) {
    contador[char] = (contador[char] || 0) + 1;
  }

  return contador;
}

// Versión funcional
function contarCaracteresFuncional(str) {
  return str.split('').reduce((contador, char) => {
    contador[char] = (contador[char] || 0) + 1;
    return contador;
  }, {});
}

// Ejemplo de uso
console.log(contarCaracteres('hello')); // {h: 1, e: 1, l: 2, o: 1}
```

### 5. **Algoritmos de Números**

#### **Factorial**

```javascript
// Versión iterativa
function factorial(n) {
  if (n < 0) return null;
  if (n === 0 || n === 1) return 1;

  let resultado = 1;
  for (let i = 2; i <= n; i++) {
    resultado *= i;
  }
  return resultado;
}

// Versión recursiva
function factorialRecursivo(n) {
  if (n < 0) return null;
  if (n === 0 || n === 1) return 1;
  return n * factorialRecursivo(n - 1);
}

// Ejemplo de uso
console.log(factorial(5)); // 120
console.log(factorialRecursivo(5)); // 120
```

#### **Fibonacci**

```javascript
// Versión iterativa
function fibonacci(n) {
  if (n < 0) return null;
  if (n === 0) return 0;
  if (n === 1) return 1;

  let a = 0,
    b = 1;
  for (let i = 2; i <= n; i++) {
    const temp = a + b;
    a = b;
    b = temp;
  }
  return b;
}

// Versión recursiva con memoización
function fibonacciMemo(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n < 0) return null;
  if (n === 0) return 0;
  if (n === 1) return 1;

  memo[n] = fibonacciMemo(n - 1, memo) + fibonacciMemo(n - 2, memo);
  return memo[n];
}

// Ejemplo de uso
console.log(fibonacci(10)); // 55
console.log(fibonacciMemo(10)); // 55
```

### 6. **Algoritmos de Validación**

#### **Validar Email**

```javascript
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Versión más robusta
function validarEmailCompleto(email) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email) && email.length <= 254;
}

// Ejemplo de uso
console.log(validarEmail('test@example.com')); // true
console.log(validarEmail('invalid-email')); // false
```

#### **Validar Contraseña**

```javascript
function validarPassword(password) {
  const criterios = {
    longitudMinima: password.length >= 8,
    tieneMayuscula: /[A-Z]/.test(password),
    tieneMinuscula: /[a-z]/.test(password),
    tieneNumero: /\d/.test(password),
    tieneEspecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const esValida = Object.values(criterios).every(criterio => criterio);

  return {
    esValida,
    criterios,
  };
}

// Ejemplo de uso
const resultado = validarPassword('MiPassword123!');
console.log(resultado.esValida); // true
console.log(resultado.criterios); // Objeto con todos los criterios
```

### 7. **Algoritmos de Estructura de Datos**

#### **Stack (Pila)**

```javascript
class Stack {
  constructor() {
    this.items = [];
  }

  push(elemento) {
    this.items.push(elemento);
  }

  pop() {
    return this.items.pop();
  }

  peek() {
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }
}

// Ejemplo de uso
const pila = new Stack();
pila.push(1);
pila.push(2);
pila.push(3);
console.log(pila.pop()); // 3
console.log(pila.peek()); // 2
```

#### **Queue (Cola)**

```javascript
class Queue {
  constructor() {
    this.items = [];
  }

  enqueue(elemento) {
    this.items.push(elemento);
  }

  dequeue() {
    return this.items.shift();
  }

  front() {
    return this.items[0];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }
}

// Ejemplo de uso
const cola = new Queue();
cola.enqueue(1);
cola.enqueue(2);
cola.enqueue(3);
console.log(cola.dequeue()); // 1
console.log(cola.front()); // 2
```

### 8. **Algoritmos de Optimización**

#### **Memoización**

```javascript
function memoize(fn) {
  const cache = {};

  return function (...args) {
    const key = JSON.stringify(args);

    if (key in cache) {
      return cache[key];
    }

    const resultado = fn.apply(this, args);
    cache[key] = resultado;
    return resultado;
  };
}

// Ejemplo de uso
const fibonacciMemoizado = memoize(n => {
  if (n <= 1) return n;
  return fibonacciMemoizado(n - 1) + fibonacciMemoizado(n - 2);
});

console.log(fibonacciMemoizado(40)); // Mucho más rápido
```

#### **Throttling**

```javascript
function throttle(func, delay) {
  let timeoutId;
  let lastExecTime = 0;

  return function (...args) {
    const currentTime = Date.now();

    if (currentTime - lastExecTime > delay) {
      func.apply(this, args);
      lastExecTime = currentTime;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
}

// Ejemplo de uso
const busquedaThrottled = throttle(query => {
  console.log('Buscando:', query);
}, 300);
```

### 9. **Algoritmos de Transformación**

#### **Aplanar Array**

```javascript
function aplanarArray(array) {
  const resultado = [];

  for (let elemento of array) {
    if (Array.isArray(elemento)) {
      resultado.push(...aplanarArray(elemento));
    } else {
      resultado.push(elemento);
    }
  }

  return resultado;
}

// Versión moderna
const aplanarModerno = array => array.flat(Infinity);

// Ejemplo de uso
const anidado = [1, [2, 3], [4, [5, 6]]];
console.log(aplanarArray(anidado)); // [1, 2, 3, 4, 5, 6]
```

#### **Agrupar por Propiedad**

```javascript
function agruparPor(array, propiedad) {
  return array.reduce((grupos, elemento) => {
    const clave = elemento[propiedad];
    if (!grupos[clave]) {
      grupos[clave] = [];
    }
    grupos[clave].push(elemento);
    return grupos;
  }, {});
}

// Ejemplo de uso
const personas = [
  { nombre: 'Ana', edad: 25, ciudad: 'Madrid' },
  { nombre: 'Luis', edad: 30, ciudad: 'Barcelona' },
  { nombre: 'María', edad: 25, ciudad: 'Madrid' },
];

const porEdad = agruparPor(personas, 'edad');
console.log(porEdad);
// {
//   "25": [{nombre: "Ana", ...}, {nombre: "María", ...}],
//   "30": [{nombre: "Luis", ...}]
// }
```

## 🎯 Complejidad Temporal

### **Notación Big O**

```javascript
// O(1) - Constante
const obtenerPrimerElemento = array => array[0];

// O(n) - Lineal
const sumarTodos = array => array.reduce((sum, num) => sum + num, 0);

// O(n²) - Cuadrática
const bubbleSort = array => {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
      }
    }
  }
  return array;
};

// O(log n) - Logarítmica
const busquedaBinaria = (array, objetivo) => {
  let inicio = 0;
  let fin = array.length - 1;

  while (inicio <= fin) {
    const medio = Math.floor((inicio + fin) / 2);
    if (array[medio] === objetivo) return medio;
    if (array[medio] < objetivo) inicio = medio + 1;
    else fin = medio - 1;
  }
  return -1;
};
```

## 🏆 Tips para WorldSkills

1. **Practica algoritmos comunes** - Sorting, searching, validation
2. **Optimiza para legibilidad** - Código claro es mejor que código "inteligente"
3. **Usa métodos nativos** - map, filter, reduce son más eficientes
4. **Maneja casos edge** - Arrays vacíos, null, undefined
5. **Implementa validación** - Siempre valida inputs
6. **Usa ES6+ features** - Destructuring, spread, arrow functions

## 📚 Recursos para Practicar

- **LeetCode**: Problemas de algoritmos
- **HackerRank**: Challenges de programación
- **Codewars**: Katas de diferentes niveles
- **freeCodeCamp**: Algoritmos y estructuras de datos

---

💡 **Recuerda**: La práctica constante de algoritmos mejora tu capacidad de resolución de problemas y velocidad en competencias.
