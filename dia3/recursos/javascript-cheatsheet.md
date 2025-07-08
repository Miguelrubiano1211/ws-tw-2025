# 📋 JavaScript ES6+ Cheatsheet

## 🎯 Referencia Rápida de Sintaxis Moderna

### 1. **Variables y Declaraciones**

```javascript
// ES6+ - Recomendado
const nombre = 'Juan'; // Inmutable
let edad = 25; // Mutable
const PI = 3.14159; // Constante

// Evitar (ES5)
var antiguoEstilo = 'no usar'; // Función scope
```

### 2. **Arrow Functions**

```javascript
// ES6+ - Sintaxis concisa
const saludar = nombre => `Hola, ${nombre}!`;
const sumar = (a, b) => a + b;
const multiplicar = (x, y) => {
  const resultado = x * y;
  return resultado;
};

// ES5 - Sintaxis tradicional
function saludarTradicional(nombre) {
  return 'Hola, ' + nombre + '!';
}
```

### 3. **Template Literals**

```javascript
// ES6+ - Interpolación de strings
const nombre = 'Ana';
const edad = 30;
const mensaje = `Hola, soy ${nombre} y tengo ${edad} años`;

// Multilinea
const html = `
    <div>
        <h1>${nombre}</h1>
        <p>Edad: ${edad}</p>
    </div>
`;

// ES5 - Concatenación
var mensajeAntiguo = 'Hola, soy ' + nombre + ' y tengo ' + edad + ' años';
```

### 4. **Destructuring**

```javascript
// Array destructuring
const numeros = [1, 2, 3, 4, 5];
const [primero, segundo, ...resto] = numeros;
// primero = 1, segundo = 2, resto = [3, 4, 5]

// Object destructuring
const persona = { nombre: 'Luis', edad: 28, ciudad: 'Bogotá' };
const { nombre, edad } = persona;
const { ciudad: ubicacion } = persona; // Renombrar

// Parámetros de función
const presentar = ({ nombre, edad }) => {
  return `Soy ${nombre} y tengo ${edad} años`;
};
```

### 5. **Spread Operator**

```javascript
// Arrays
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combinado = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]

// Objects
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };
const objetoCombinado = { ...obj1, ...obj2 };

// Función con parámetros variables
const sumarTodos = (...numeros) => {
  return numeros.reduce((sum, num) => sum + num, 0);
};
```

### 6. **Array Methods**

```javascript
const numeros = [1, 2, 3, 4, 5];

// map - Transformar elementos
const duplicados = numeros.map(num => num * 2);

// filter - Filtrar elementos
const pares = numeros.filter(num => num % 2 === 0);

// reduce - Reducir a un valor
const suma = numeros.reduce((acc, num) => acc + num, 0);

// find - Encontrar elemento
const encontrado = numeros.find(num => num > 3);

// forEach - Iterar sin retorno
numeros.forEach(num => console.log(num));
```

### 7. **Promises y Async/Await**

```javascript
// Promise básica
const obtenerDatos = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('Datos obtenidos');
    }, 1000);
  });
};

// Usando async/await
const procesarDatos = async () => {
  try {
    const datos = await obtenerDatos();
    console.log(datos);
  } catch (error) {
    console.error(error);
  }
};

// Fetch API
const obtenerUsuario = async id => {
  try {
    const response = await fetch(`/api/users/${id}`);
    const usuario = await response.json();
    return usuario;
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### 8. **Classes**

```javascript
class Persona {
  constructor(nombre, edad) {
    this.nombre = nombre;
    this.edad = edad;
  }

  saludar() {
    return `Hola, soy ${this.nombre}`;
  }

  // Método estático
  static crearAdulto(nombre) {
    return new Persona(nombre, 18);
  }
}

class Estudiante extends Persona {
  constructor(nombre, edad, curso) {
    super(nombre, edad);
    this.curso = curso;
  }

  estudiar() {
    return `${this.nombre} está estudiando ${this.curso}`;
  }
}
```

### 9. **Modules (Import/Export)**

```javascript
// Exportar
export const PI = 3.14159;
export function calcularArea(radio) {
  return PI * radio * radio;
}

// Export default
export default class Calculadora {
  sumar(a, b) {
    return a + b;
  }
}

// Importar
import Calculadora, { PI, calcularArea } from './math.js';
import * as Math from './math.js';
```

### 10. **Default Parameters**

```javascript
// Parámetros por defecto
function saludar(nombre = 'Mundo', saludo = 'Hola') {
  return `${saludo}, ${nombre}!`;
}

// Arrow function con defaults
const multiplicar = (a, b = 1) => a * b;
```

### 11. **Object Enhancements**

```javascript
const nombre = 'Ana';
const edad = 25;

// Shorthand property
const persona = { nombre, edad };

// Computed property names
const clave = 'email';
const usuario = {
  [clave]: 'ana@email.com',
  [`${clave}Verificado`]: true,
};

// Method shorthand
const calculadora = {
  sumar(a, b) {
    return a + b;
  },
  restar(a, b) {
    return a - b;
  },
};
```

### 12. **Nuevos Métodos de Array**

```javascript
const arr = [1, 2, 3, 4, 5];

// includes - Verificar existencia
arr.includes(3); // true

// find/findIndex
const encontrado = arr.find(x => x > 3); // 4
const indice = arr.findIndex(x => x > 3); // 3

// some/every
const hayPares = arr.some(x => x % 2 === 0); // true
const todosPares = arr.every(x => x % 2 === 0); // false
```

### 13. **String Methods**

```javascript
const texto = 'JavaScript es genial';

// startsWith/endsWith
texto.startsWith('Java'); // true
texto.endsWith('genial'); // true

// includes
texto.includes('Script'); // true

// repeat
'Hola '.repeat(3); // "Hola Hola Hola "

// padStart/padEnd
'5'.padStart(3, '0'); // "005"
```

### 14. **Loops Modernos**

```javascript
const array = [1, 2, 3, 4, 5];
const objeto = { a: 1, b: 2, c: 3 };

// for...of (arrays)
for (const item of array) {
  console.log(item);
}

// for...in (objects)
for (const key in objeto) {
  console.log(key, objeto[key]);
}

// forEach
array.forEach((item, index) => {
  console.log(index, item);
});
```

### 15. **Error Handling**

```javascript
// Try/catch con async/await
const procesarDatos = async () => {
  try {
    const datos = await obtenerDatos();
    const resultado = await procesarDatos(datos);
    return resultado;
  } catch (error) {
    console.error('Error procesando datos:', error);
    throw error;
  } finally {
    console.log('Proceso completado');
  }
};

// Custom Error
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}
```

## 🔧 Patrones Comunes

### **Función Pura**

```javascript
// ✅ Buena práctica
const calcularTotal = (precio, impuesto) => precio * (1 + impuesto);

// ❌ Evitar (efectos secundarios)
let total = 0;
const calcularTotalMal = precio => {
  total += precio; // Modifica variable externa
  return total;
};
```

### **Inmutabilidad**

```javascript
// ✅ Crear nuevo array
const agregarItem = (array, item) => [...array, item];

// ✅ Crear nuevo objeto
const actualizarUsuario = (usuario, cambios) => ({
  ...usuario,
  ...cambios,
});
```

### **Currying**

```javascript
const multiplicarPor = factor => numero => numero * factor;
const duplicar = multiplicarPor(2);
const triplicar = multiplicarPor(3);
```

## 🎯 Tips de Performance

1. **Usa const por defecto**, let solo si necesitas reasignar
2. **Evita crear funciones en loops**
3. **Usa métodos de array apropiados** (map, filter, reduce)
4. **Implementa early returns** para evitar anidamiento
5. **Usa destructuring** para código más limpio

---

💡 **Recuerda**: Esta sintaxis ES6+ es estándar en desarrollo moderno y es lo que se espera en competencias WorldSkills.
