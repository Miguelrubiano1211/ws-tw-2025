/**
 * Día 6: DOM y Eventos - Ejercicio 1
 * Tema: Selección de elementos del DOM
 * Dificultad: Básica
 * Tiempo estimado: 15 minutos
 */

// ================================
// SELECCIÓN DE ELEMENTOS DEL DOM
// ================================

console.log('=== Ejercicio 1: Selección de elementos del DOM ===');

// 1. Seleccionar por ID
console.log('\n1. Selección por ID:');
const titulo = document.getElementById('titulo');
console.log('Título:', titulo);

// 2. Seleccionar por clase
console.log('\n2. Selección por clase:');
const botones = document.getElementsByClassName('btn');
console.log('Botones por clase:', botones);

// 3. Seleccionar por etiqueta
console.log('\n3. Selección por etiqueta:');
const parrafos = document.getElementsByTagName('p');
console.log('Párrafos:', parrafos);

// 4. Seleccionar con querySelector (CSS selector)
console.log('\n4. Selección con querySelector:');
const primerBoton = document.querySelector('.btn');
console.log('Primer botón:', primerBoton);

// 5. Seleccionar múltiples elementos con querySelectorAll
console.log('\n5. Selección múltiple con querySelectorAll:');
const todosLosBotones = document.querySelectorAll('.btn');
console.log('Todos los botones:', todosLosBotones);

// 6. Selecciones más específicas
console.log('\n6. Selecciones específicas:');
const inputEmail = document.querySelector('input[type="email"]');
console.log('Input email:', inputEmail);

const primerLi = document.querySelector('ul li:first-child');
console.log('Primer elemento de lista:', primerLi);

// ================================
// EJERCICIOS PRÁCTICOS
// ================================

console.log('\n=== EJERCICIOS PRÁCTICOS ===');

// Ejercicio 1: Contar elementos
function contarElementos() {
  console.log('\n--- Contando elementos ---');

  // TODO: Completa estos contadores
  const totalBotones = document.querySelectorAll('.btn').length;
  const totalParrafos = document.querySelectorAll('p').length;
  const totalInputs = document.querySelectorAll('input').length;

  console.log(`Total de botones: ${totalBotones}`);
  console.log(`Total de párrafos: ${totalParrafos}`);
  console.log(`Total de inputs: ${totalInputs}`);
}

// Ejercicio 2: Validar existencia de elementos
function validarElementos() {
  console.log('\n--- Validando existencia de elementos ---');

  // TODO: Verifica si estos elementos existen
  const existeTitulo = document.getElementById('titulo') !== null;
  const existeFormulario = document.querySelector('form') !== null;
  const existeNavbar = document.querySelector('.navbar') !== null;

  console.log(`¿Existe título?: ${existeTitulo}`);
  console.log(`¿Existe formulario?: ${existeFormulario}`);
  console.log(`¿Existe navbar?: ${existeNavbar}`);
}

// Ejercicio 3: Obtener información de elementos
function obtenerInformacion() {
  console.log('\n--- Obteniendo información de elementos ---');

  // TODO: Obtén información de los elementos
  const titulo = document.getElementById('titulo');
  if (titulo) {
    console.log(`Texto del título: ${titulo.textContent}`);
    console.log(`Clases del título: ${titulo.className}`);
    console.log(`ID del título: ${titulo.id}`);
  }

  // Información de todos los botones
  const botones = document.querySelectorAll('.btn');
  console.log(`\nInformación de ${botones.length} botones:`);
  botones.forEach((boton, index) => {
    console.log(
      `  Botón ${index + 1}: "${boton.textContent}" - Clases: ${
        boton.className
      }`
    );
  });
}

// ================================
// FUNCIONES DE UTILIDAD
// ================================

// Función para verificar si un elemento existe
function existeElemento(selector) {
  const elemento = document.querySelector(selector);
  return elemento !== null;
}

// Función para obtener elementos de forma segura
function obtenerElemento(selector) {
  const elemento = document.querySelector(selector);
  if (!elemento) {
    console.warn(`⚠️ No se encontró el elemento: ${selector}`);
    return null;
  }
  return elemento;
}

// Función para obtener múltiples elementos
function obtenerElementos(selector) {
  const elementos = document.querySelectorAll(selector);
  if (elementos.length === 0) {
    console.warn(`⚠️ No se encontraron elementos: ${selector}`);
  }
  return elementos;
}

// ================================
// EJECUCIÓN DE EJERCICIOS
// ================================

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function () {
  console.log('\n🚀 DOM listo, ejecutando ejercicios...');

  // Ejecutar ejercicios
  contarElementos();
  validarElementos();
  obtenerInformacion();

  console.log('\n✅ Ejercicios completados!');
});

// ================================
// RETOS ADICIONALES
// ================================

/**
 * RETO 1: Crear una función que encuentre todos los elementos
 * que contengan una clase específica y retorne sus textos
 */
function obtenerTextosPorClase(nombreClase) {
  // TODO: Implementa esta función
  const elementos = document.querySelectorAll(`.${nombreClase}`);
  return Array.from(elementos).map(elemento => elemento.textContent);
}

/**
 * RETO 2: Crear una función que cuente cuántos elementos
 * de cada tipo hay en la página
 */
function contarElementosPorTipo() {
  // TODO: Implementa esta función
  const tipos = ['div', 'p', 'span', 'button', 'input', 'h1', 'h2', 'h3'];
  const contador = {};

  tipos.forEach(tipo => {
    contador[tipo] = document.querySelectorAll(tipo).length;
  });

  return contador;
}

/**
 * RETO 3: Crear una función que verifique si un elemento
 * cumple con múltiples criterios
 */
function verificarCriterios(selector, criterios) {
  // TODO: Implementa esta función
  const elemento = document.querySelector(selector);
  if (!elemento) return false;

  return criterios.every(criterio => {
    switch (criterio.tipo) {
      case 'clase':
        return elemento.classList.contains(criterio.valor);
      case 'atributo':
        return elemento.hasAttribute(criterio.valor);
      case 'texto':
        return elemento.textContent.includes(criterio.valor);
      default:
        return false;
    }
  });
}

// Ejemplos de uso de los retos:
// console.log(obtenerTextosPorClase('btn'));
// console.log(contarElementosPorTipo());
// console.log(verificarCriterios('#titulo', [
//     { tipo: 'clase', valor: 'main-title' },
//     { tipo: 'texto', valor: 'Bienvenido' }
// ]));
