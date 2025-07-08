// 📝 Ejercicio 1: Variables y Template Literals
// Día 3 - JavaScript ES6+ Fundamentals

console.log('🚀 Ejercicio 1: Variables y Template Literals');

// ============================================
// Ejercicio 1.1: Convertir a ES6+
// ============================================
console.log('\n--- Ejercicio 1.1: Convertir a ES6+ ---');

// Código ES5 (convertir a ES6+)
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
console.log('ES5:', userMessage);

// TODO: Convierte el código anterior a ES6+
// Usa const/let apropiadamente y template literals
// Tu solución aquí:
const userName_ES6 = 'Juan';
const userAge_ES6 = 25;
const userEmail_ES6 = 'juan@email.com';
const userMessage_ES6 = `Hola, ${userName_ES6}! Tienes ${userAge_ES6} años y tu email es ${userEmail_ES6}`;
console.log('ES6:', userMessage_ES6);

// ============================================
// Ejercicio 1.2: Scope y Hoisting
// ============================================
console.log('\n--- Ejercicio 1.2: Scope y Hoisting ---');

// Función con var (problema de scope)
function testScopeVar() {
  var x = 1;
  if (true) {
    var x = 2; // Redefine la misma variable
    console.log('Dentro del if (var):', x);
  }
  console.log('Fuera del if (var):', x);
}
testScopeVar();

// TODO: Reescribe la función usando let
// ¿Cuál es la diferencia en el comportamiento?
function testScopeLet() {
  let x = 1;
  if (true) {
    let x = 2; // Variable diferente en scope de bloque
    console.log('Dentro del if (let):', x);
  }
  console.log('Fuera del if (let):', x);
}
testScopeLet();

// ============================================
// Ejercicio 1.3: Template Literals Avanzados
// ============================================
console.log('\n--- Ejercicio 1.3: Template Literals Avanzados ---');

// Objeto producto
const product = {
  name: 'Laptop',
  price: 999,
  discount: 0.1,
  category: 'Electronics',
  inStock: true,
};

// Código ES5 (convertir a template literals)
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
  product.price * (1 - product.discount) +
  '\n' +
  'Categoría: ' +
  product.category +
  '\n' +
  'En stock: ' +
  (product.inStock ? 'Sí' : 'No');

console.log('ES5 Concatenation:');
console.log(productInfo);

// TODO: Convierte a template literals
// Incluye cálculos dentro de las interpolaciones
const productInfo_ES6 = `Producto: ${product.name}
Precio: $${product.price}
Descuento: ${product.discount * 100}%
Precio final: $${(product.price * (1 - product.discount)).toFixed(2)}
Categoría: ${product.category}
En stock: ${product.inStock ? 'Sí' : 'No'}`;

console.log('\nES6 Template Literals:');
console.log(productInfo_ES6);

// ============================================
// Ejercicio 1.4: Tagged Template Literals
// ============================================
console.log('\n--- Ejercicio 1.4: Tagged Template Literals ---');

// Función para procesar template literals
function formatPrice(strings, ...values) {
  return strings.reduce((result, string, i) => {
    const value = values[i];
    if (typeof value === 'number') {
      return result + string + `$${value.toFixed(2)}`;
    }
    return result + string + (value || '');
  }, '');
}

// TODO: Usa la función tagged template
const laptopPrice = 999.99;
const mousePrice = 25.5;
const formattedMessage = formatPrice`El precio de la laptop es ${laptopPrice} y el mouse cuesta ${mousePrice}`;
console.log(formattedMessage);

// ============================================
// Ejercicio 1.5: Const vs Let vs Var
// ============================================
console.log('\n--- Ejercicio 1.5: Const vs Let vs Var ---');

// Ejemplo de diferentes comportamientos
function demonstrateVariables() {
  console.log('Demostrando var, let, const:');

  // var - function scoped, hoisted
  console.log('var antes de declarar:', typeof varVariable); // undefined
  var varVariable = 'var value';

  // let - block scoped, temporal dead zone
  // console.log('let antes de declarar:', letVariable); // ReferenceError
  let letVariable = 'let value';

  // const - block scoped, must be initialized, immutable binding
  const constVariable = 'const value';

  if (true) {
    var varInBlock = 'var in block';
    let letInBlock = 'let in block';
    const constInBlock = 'const in block';

    console.log('Dentro del bloque:');
    console.log('var:', varInBlock);
    console.log('let:', letInBlock);
    console.log('const:', constInBlock);
  }

  console.log('Fuera del bloque:');
  console.log('var:', varInBlock); // Accesible
  // console.log('let:', letInBlock); // ReferenceError
  // console.log('const:', constInBlock); // ReferenceError
}

demonstrateVariables();

// ============================================
// Ejercicio 1.6: Const con Objetos y Arrays
// ============================================
console.log('\n--- Ejercicio 1.6: Const con Objetos y Arrays ---');

// const no significa inmutable, sino binding inmutable
const user = {
  name: 'Ana',
  age: 30,
  email: 'ana@email.com',
};

console.log('Usuario original:', user);

// TODO: Modifica las propiedades del objeto (esto está permitido)
user.age = 31;
user.email = 'ana.nueva@email.com';
user.city = 'Madrid';
console.log('Usuario modificado:', user);

// TODO: Intenta reasignar la variable (esto causará error)
// user = { name: 'Pedro' }; // TypeError: Assignment to constant variable

const numbers = [1, 2, 3];
console.log('Array original:', numbers);

// TODO: Modifica el array (esto está permitido)
numbers.push(4);
numbers[0] = 10;
console.log('Array modificado:', numbers);

// TODO: Intenta reasignar el array (esto causará error)
// numbers = [5, 6, 7]; // TypeError: Assignment to constant variable

// ============================================
// Ejercicio 1.7: Desafío Final
// ============================================
console.log('\n--- Ejercicio 1.7: Desafío Final ---');

// Crea una función que genere un reporte de ventas
// usando template literals y const/let apropiadamente

const salesData = [
  { product: 'Laptop', quantity: 5, price: 999 },
  { product: 'Mouse', quantity: 10, price: 25 },
  { product: 'Keyboard', quantity: 8, price: 75 },
  { product: 'Monitor', quantity: 3, price: 300 },
];

function generateSalesReport(data) {
  // TODO: Implementa la función usando ES6+ features
  let totalRevenue = 0;
  let totalItems = 0;

  const reportLines = data.map(item => {
    const itemTotal = item.quantity * item.price;
    totalRevenue += itemTotal;
    totalItems += item.quantity;

    return `${item.product}: ${item.quantity} unidades × $${item.price} = $${itemTotal}`;
  });

  const report = `📊 REPORTE DE VENTAS
================================
${reportLines.join('\n')}
================================
Total de artículos vendidos: ${totalItems}
Ingresos totales: $${totalRevenue.toFixed(2)}
Precio promedio por artículo: $${(totalRevenue / totalItems).toFixed(2)}`;

  return report;
}

const report = generateSalesReport(salesData);
console.log(report);

// ============================================
// Verificación de Aprendizaje
// ============================================
console.log('\n--- 🎯 Verificación de Aprendizaje ---');

// Pregunta 1: ¿Cuál es la diferencia entre let y const?
console.log('1. let permite reasignación, const no');
console.log('2. Ambos tienen block scope');
console.log('3. const debe ser inicializado en la declaración');

// Pregunta 2: ¿Cuándo usar var, let, o const?
console.log('\n¿Cuándo usar cada uno?');
console.log('- const: Por defecto, para valores que no cambiarán');
console.log('- let: Cuando necesites reasignar la variable');
console.log('- var: Evitar en código moderno (legacy support)');

// Pregunta 3: Template literals vs concatenación
console.log('\nVentajas de template literals:');
console.log('- Sintaxis más limpia y legible');
console.log('- Soporte nativo para multi-línea');
console.log('- Interpolación de expresiones');
console.log('- Tagged templates para procesamiento personalizado');

console.log('\n✅ Ejercicio 1 completado! Continúa con el Ejercicio 2.');
