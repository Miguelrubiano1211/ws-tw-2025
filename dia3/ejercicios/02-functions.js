// 📝 Ejercicio 2: Functions y Arrow Functions
// Día 3 - JavaScript ES6+ Fundamentals

console.log('🚀 Ejercicio 2: Functions y Arrow Functions');

// ============================================
// Ejercicio 2.1: Convertir a Arrow Functions
// ============================================
console.log('\n--- Ejercicio 2.1: Convertir a Arrow Functions ---');

// Funciones tradicionales
function suma(a, b) {
  return a + b;
}

function saludar(nombre) {
  return `Hola, ${nombre}!`;
}

function procesarNumeros(numeros) {
  return numeros.map(function (num) {
    return num * 2;
  });
}

console.log('Función tradicional:', suma(5, 3));
console.log('Función tradicional:', saludar('Ana'));
console.log('Función tradicional:', procesarNumeros([1, 2, 3, 4]));

// TODO: Convierte las funciones anteriores a arrow functions
// Tu solución aquí:
const sumaArrow = (a, b) => a + b;
const saludarArrow = nombre => `Hola, ${nombre}!`;
const procesarNumerosArrow = numeros => numeros.map(num => num * 2);

console.log('Arrow function:', sumaArrow(5, 3));
console.log('Arrow function:', saludarArrow('Ana'));
console.log('Arrow function:', procesarNumerosArrow([1, 2, 3, 4]));

// ============================================
// Ejercicio 2.2: Contexto (this) en Arrow Functions
// ============================================
console.log('\n--- Ejercicio 2.2: Contexto (this) en Arrow Functions ---');

const persona = {
  nombre: 'Carlos',
  edad: 30,

  // Método tradicional
  saludarTradicional: function () {
    console.log(`Hola, soy ${this.nombre} y tengo ${this.edad} años`);
  },

  // Arrow function (problema potencial)
  saludarArrow: () => {
    console.log(`Hola, soy ${this.nombre} y tengo ${this.edad} años`);
  },

  // Método que usa setTimeout
  saludarDespues: function () {
    setTimeout(function () {
      console.log(`Timeout tradicional: ${this.nombre}`);
    }, 100);

    setTimeout(() => {
      console.log(`Timeout arrow: ${this.nombre}`);
    }, 200);
  },
};

persona.saludarTradicional();
persona.saludarArrow(); // ¿Qué pasa aquí?
persona.saludarDespues();

// ============================================
// Ejercicio 2.3: Parámetros por Defecto
// ============================================
console.log('\n--- Ejercicio 2.3: Parámetros por Defecto ---');

// Función con parámetros por defecto
const crearUsuario = (nombre = 'Anónimo', edad = 0, activo = true) => {
  return {
    nombre,
    edad,
    activo,
    info: `Usuario: ${nombre}, Edad: ${edad}, Activo: ${activo}`,
  };
};

console.log(crearUsuario());
console.log(crearUsuario('María'));
console.log(crearUsuario('Juan', 25));
console.log(crearUsuario('Ana', 30, false));

// TODO: Crea una función calculadora que acepte dos números y una operación
// La operación debe ser 'suma' por defecto
// Tu solución aquí:
const calculadora = (num1, num2, operacion = 'suma') => {
  switch (operacion) {
    case 'suma':
      return num1 + num2;
    case 'resta':
      return num1 - num2;
    case 'multiplicacion':
      return num1 * num2;
    case 'division':
      return num2 !== 0 ? num1 / num2 : 'Error: División por cero';
    default:
      return 'Operación no válida';
  }
};

console.log('Calculadora:', calculadora(10, 5)); // suma por defecto
console.log('Calculadora:', calculadora(10, 5, 'resta'));
console.log('Calculadora:', calculadora(10, 5, 'multiplicacion'));
console.log('Calculadora:', calculadora(10, 5, 'division'));

// ============================================
// Ejercicio 2.4: Rest Parameters
// ============================================
console.log('\n--- Ejercicio 2.4: Rest Parameters ---');

// Función que suma números variables
const sumarTodos = (...numeros) => {
  return numeros.reduce((total, num) => total + num, 0);
};

console.log('Suma todos:', sumarTodos(1, 2, 3, 4, 5));
console.log('Suma todos:', sumarTodos(10, 20));
console.log('Suma todos:', sumarTodos(1));

// TODO: Crea una función que reciba un nombre y múltiples hobbies
// Debe retornar un objeto con el nombre y un array de hobbies
// Tu solución aquí:
const crearPerfil = (nombre, ...hobbies) => {
  return {
    nombre,
    hobbies,
    cantidadHobbies: hobbies.length,
    descripcion: `${nombre} tiene ${hobbies.length} hobbies: ${hobbies.join(
      ', '
    )}`,
  };
};

console.log(crearPerfil('Ana', 'leer', 'correr', 'cocinar'));
console.log(crearPerfil('Carlos', 'programar', 'videojuegos'));

// ============================================
// Ejercicio 2.5: Destructuring
// ============================================
console.log('\n--- Ejercicio 2.5: Destructuring ---');

// Destructuring de arrays
const colores = ['rojo', 'verde', 'azul', 'amarillo'];
const [primario, secundario, ...otros] = colores;
console.log('Primario:', primario);
console.log('Secundario:', secundario);
console.log('Otros:', otros);

// Destructuring de objetos
const producto = {
  id: 1,
  nombre: 'Laptop',
  precio: 1200,
  categoria: 'Electrónicos',
  disponible: true,
};

const { nombre, precio, disponible = false } = producto;
console.log('Producto:', nombre, precio, disponible);

// Destructuring con renombramiento
const { nombre: nombreProducto, precio: precioProducto } = producto;
console.log('Renombrado:', nombreProducto, precioProducto);

// TODO: Crea una función que reciba un objeto usuario y use destructuring
// para extraer nombre, email y edad (con valor por defecto 18)
// Tu solución aquí:
const procesarUsuario = ({ nombre, email, edad = 18 }) => {
  return `Usuario: ${nombre}, Email: ${email}, Edad: ${edad}`;
};

const usuario1 = { nombre: 'María', email: 'maria@test.com', edad: 25 };
const usuario2 = { nombre: 'Pedro', email: 'pedro@test.com' };

console.log(procesarUsuario(usuario1));
console.log(procesarUsuario(usuario2));

// ============================================
// Ejercicio 2.6: Spread Operator
// ============================================
console.log('\n--- Ejercicio 2.6: Spread Operator ---');

// Spread con arrays
const numeros1 = [1, 2, 3];
const numeros2 = [4, 5, 6];
const combinados = [...numeros1, ...numeros2];
console.log('Arrays combinados:', combinados);

// Spread con objetos
const configuracionBase = {
  tema: 'oscuro',
  idioma: 'es',
  notificaciones: true,
};

const configuracionUsuario = {
  ...configuracionBase,
  idioma: 'en',
  usuario: 'Juan',
};

console.log('Configuración:', configuracionUsuario);

// TODO: Crea una función que clone un array y le agregue un elemento al final
// Tu solución aquí:
const agregarElemento = (array, elemento) => {
  return [...array, elemento];
};

const frutas = ['manzana', 'banana'];
const frutasConNueva = agregarElemento(frutas, 'naranja');
console.log('Array original:', frutas);
console.log('Array con nuevo elemento:', frutasConNueva);

// ============================================
// Desafío: Calculadora Avanzada
// ============================================
console.log('\n--- 🎯 Desafío: Calculadora Avanzada ---');

// TODO: Crea una calculadora que:
// 1. Use arrow functions
// 2. Tenga operaciones básicas (suma, resta, multiplicación, división)
// 3. Maneje errores (división por cero)
// 4. Tenga un historial de operaciones
// 5. Pueda procesar múltiples operaciones

class CalculadoraAvanzada {
  constructor() {
    this.historial = [];
  }

  // Operaciones básicas
  suma = (a, b) => a + b;
  resta = (a, b) => a - b;
  multiplicacion = (a, b) => a * b;
  division = (a, b) => (b !== 0 ? a / b : null);

  // Método principal
  calcular = (operacion, ...numeros) => {
    if (numeros.length < 2) {
      return 'Error: Se necesitan al menos 2 números';
    }

    let resultado;
    const [a, b] = numeros;

    switch (operacion) {
      case 'suma':
        resultado = this.suma(a, b);
        break;
      case 'resta':
        resultado = this.resta(a, b);
        break;
      case 'multiplicacion':
        resultado = this.multiplicacion(a, b);
        break;
      case 'division':
        resultado = this.division(a, b);
        if (resultado === null) {
          return 'Error: División por cero';
        }
        break;
      default:
        return 'Error: Operación no válida';
    }

    // Agregar al historial
    this.historial.push({
      operacion,
      numeros,
      resultado,
      fecha: new Date().toLocaleString(),
    });

    return resultado;
  };

  // Obtener historial
  obtenerHistorial = () => this.historial;

  // Limpiar historial
  limpiarHistorial = () => {
    this.historial = [];
  };
}

// Prueba de la calculadora
const calc = new CalculadoraAvanzada();
console.log('Calculadora avanzada:');
console.log('Suma:', calc.calcular('suma', 10, 5));
console.log('Resta:', calc.calcular('resta', 10, 5));
console.log('Multiplicación:', calc.calcular('multiplicacion', 10, 5));
console.log('División:', calc.calcular('division', 10, 5));
console.log('División por cero:', calc.calcular('division', 10, 0));
console.log('Historial:', calc.obtenerHistorial());

// ============================================
// 🎯 Puntos Clave para WorldSkills
// ============================================
console.log('\n🎯 Puntos Clave para WorldSkills:');
console.log('✅ Arrow functions son más concisas pero no siempre apropiadas');
console.log('✅ Destructuring facilita el trabajo con objetos complejos');
console.log('✅ Spread operator es fundamental para inmutabilidad');
console.log('✅ Rest parameters permiten funciones flexibles');
console.log('✅ Parámetros por defecto mejoran la robustez del código');
