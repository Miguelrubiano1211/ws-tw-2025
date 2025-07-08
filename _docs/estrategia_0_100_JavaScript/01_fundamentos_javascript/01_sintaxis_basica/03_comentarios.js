// 📝 Ejercicio 3: Comentarios
// Objetivo: Aprender a documentar código efectivamente

console.log('=== EJERCICIO 3: COMENTARIOS ===');

// Este es un comentario de una línea
// Se usa para explicar qué hace la línea siguiente

const precioProducto = 25.99; // Precio en dólares

/* 
   Este es un comentario
   de múltiples líneas.
   Útil para explicaciones largas
*/

const descuento = 0.15; // 15% de descuento

// Calcular precio final
const precioFinal = precioProducto * (1 - descuento);

console.log(`Precio original: $${precioProducto}`);
console.log(`Descuento: ${descuento * 100}%`);
console.log(`Precio final: $${precioFinal.toFixed(2)}`);

// TODO: Agrega comentarios explicativos a este código
function calcularImpuesto(precio, impuesto) {
  return precio * impuesto;
}

const impuesto = calcularImpuesto(precioFinal, 0.19);
const precioConImpuesto = precioFinal + impuesto;

console.log(`Impuesto: $${impuesto.toFixed(2)}`);
console.log(`Precio total: $${precioConImpuesto.toFixed(2)}`);

/*
TODO: Documenta este bloque de código
Explica qué hace cada parte
*/
const productos = [
  { nombre: 'Laptop', precio: 800 },
  { nombre: 'Mouse', precio: 20 },
  { nombre: 'Teclado', precio: 50 }
];

let total = 0;
for (let producto of productos) {
  total += producto.precio;
}

console.log(`Total de la compra: $${total}`);

// 🚀 Desafío: Crea un sistema de comentarios para un mini-proyecto
// Incluye: descripción general, parámetros, valores de retorno, ejemplos
