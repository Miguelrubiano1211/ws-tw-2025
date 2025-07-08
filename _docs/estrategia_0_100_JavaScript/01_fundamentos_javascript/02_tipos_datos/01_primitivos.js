// 📊 Ejercicio 1: Tipos Primitivos
// Objetivo: Dominar los 6 tipos primitivos de JavaScript

console.log('=== EJERCICIO 1: TIPOS PRIMITIVOS ===');

// TODO: Declara variables para cada tipo primitivo

// 1. STRING - Cadenas de texto
const miNombre = 'Tu nombre aquí';
const miApellido = "Tu apellido aquí";
const presentacion = `Hola, soy ${miNombre} ${miApellido}`;

console.log('📝 STRINGS:');
console.log('Nombre:', miNombre, '- Tipo:', typeof miNombre);
console.log('Apellido:', miApellido, '- Tipo:', typeof miApellido);
console.log('Presentación:', presentacion, '- Tipo:', typeof presentacion);

// 2. NUMBER - Números (enteros y decimales)
const miEdad = 25;
const miPeso = 65.5;
const temperatura = -5;
const infinito = Infinity;
const noEsNumero = NaN;

console.log('\n🔢 NUMBERS:');
console.log('Edad:', miEdad, '- Tipo:', typeof miEdad);
console.log('Peso:', miPeso, '- Tipo:', typeof miPeso);
console.log('Temperatura:', temperatura, '- Tipo:', typeof temperatura);
console.log('Infinito:', infinito, '- Tipo:', typeof infinito);
console.log('NaN:', noEsNumero, '- Tipo:', typeof noEsNumero);

// 3. BOOLEAN - Verdadero o falso
const esEstudiante = true;
const tieneTrabajo = false;

console.log('\n✅ BOOLEANS:');
console.log('Es estudiante:', esEstudiante, '- Tipo:', typeof esEstudiante);
console.log('Tiene trabajo:', tieneTrabajo, '- Tipo:', typeof tieneTrabajo);

// 4. UNDEFINED - Variable sin valor asignado
let variableSinValor;
let otraVariable;

console.log('\n❓ UNDEFINED:');
console.log('Variable sin valor:', variableSinValor, '- Tipo:', typeof variableSinValor);
console.log('Otra variable:', otraVariable, '- Tipo:', typeof otraVariable);

// 5. NULL - Valor nulo intencionalmente
const valorNulo = null;
const datoVacio = null;

console.log('\n🚫 NULL:');
console.log('Valor nulo:', valorNulo, '- Tipo:', typeof valorNulo);
console.log('Dato vacío:', datoVacio, '- Tipo:', typeof datoVacio);

// Nota: typeof null retorna 'object' - es un bug histórico de JavaScript

// 6. SYMBOL - Identificadores únicos (ES6)
const simbolo1 = Symbol('id');
const simbolo2 = Symbol('id');
const simboloDescripcion = Symbol('usuario');

console.log('\n🔐 SYMBOLS:');
console.log('Símbolo 1:', simbolo1, '- Tipo:', typeof simbolo1);
console.log('Símbolo 2:', simbolo2, '- Tipo:', typeof simbolo2);
console.log('Son iguales:', simbolo1 === simbolo2); // false - cada Symbol es único
console.log('Descripción:', simboloDescripcion, '- Tipo:', typeof simboloDescripcion);

// 🧪 EXPERIMENTOS CON TIPOS

console.log('\n🧪 EXPERIMENTOS:');

// Concatenación vs suma
console.log('Concatenación:', '5' + 3); // '53'
console.log('Suma:', 5 + 3); // 8

// Comparaciones
console.log('5 == "5":', 5 == "5"); // true (conversión automática)
console.log('5 === "5":', 5 === "5"); // false (sin conversión)

// Valores truthy y falsy
console.log('Boolean(""):', Boolean("")); // false
console.log('Boolean(0):', Boolean(0)); // false
console.log('Boolean(null):', Boolean(null)); // false
console.log('Boolean(undefined):', Boolean(undefined)); // false
console.log('Boolean(NaN):', Boolean(NaN)); // false

// TODO: Experimenta con tus propios valores
// Crea al menos 2 variables de cada tipo primitivo
// Muestra su valor y tipo usando console.log

// 🚀 DESAFÍO: Crea una función que identifique el tipo de dato
function identificarTipo(valor) {
  // TODO: Implementa esta función
  // Debe retornar el tipo de dato de manera descriptiva
  // Maneja el caso especial de null
}

// Prueba tu función
console.log('\n🚀 DESAFÍO - IDENTIFICAR TIPOS:');
// console.log(identificarTipo('hola'));
// console.log(identificarTipo(42));
// console.log(identificarTipo(true));
// console.log(identificarTipo(null));
// console.log(identificarTipo(undefined));
// console.log(identificarTipo(Symbol('test')));

/* 
📚 NOTAS IMPORTANTES:
- JavaScript es un lenguaje de tipado dinámico
- Las variables pueden cambiar de tipo
- typeof null === 'object' es un error histórico
- Los Symbols son únicos aunque tengan la misma descripción
- '' (string vacío), 0, false, null, undefined y NaN son "falsy"
*/
