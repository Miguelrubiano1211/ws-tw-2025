/**
 * 🎯 Ejercicio 1: Scope y Hoisting
 *
 * Objetivo: Dominar el concepto de scope (ámbito) y hoisting en JavaScript
 * Tiempo estimado: 45 minutos
 * Dificultad: ⭐⭐⭐
 */

console.log('=== EJERCICIO 1: SCOPE Y HOISTING ===');

// =============================================================================
// PARTE 1: SCOPE (ÁMBITO DE VARIABLES)
// =============================================================================

console.log('\n--- PARTE 1: SCOPE ---');

/**
 * 1.1 Scope Global vs Local
 *
 * Analiza y predice qué imprimirá el siguiente código.
 * Ejecuta y verifica tu predicción.
 */

// Ejercicio 1.1a: Scope básico
console.log('\n1.1a - Scope básico:');
// Tu predicción: ¿Qué imprimirá?

var global = 'Soy global';

function testScope() {
  var local = 'Soy local';
  console.log('Dentro de función - global:', global);
  console.log('Dentro de función - local:', local);
}

testScope();
console.log('Fuera de función - global:', global);
// console.log("Fuera de función - local:", local); // ¿Qué pasará?

/**
 * 1.2 Function Scope vs Block Scope
 *
 * Completa los espacios en blanco para que el código funcione correctamente.
 */

console.log('\n1.2 - Function vs Block Scope:');

function scopeExample() {
  // Completa con var, let o const según sea apropiado
  /* _____ */ functionScoped = 'Disponible en toda la función';

  if (true) {
    /* _____ */ blockScoped = 'Solo disponible en este bloque';
    /* _____ */ alsoBlockScoped = 'También solo en este bloque';

    console.log('Dentro del bloque:', blockScoped);
    console.log('Dentro del bloque:', functionScoped);
  }

  console.log('Fuera del bloque:', functionScoped);
  // console.log("Fuera del bloque:", blockScoped); // ¿Funcionará?
}

scopeExample();

/**
 * 1.3 Variable Shadowing
 *
 * Explica qué es el shadowing y resuelve el siguiente problema.
 */

console.log('\n1.3 - Variable Shadowing:');

let nombre = 'Juan';

function saludar() {
  let nombre = 'María'; // ¿Qué hace esto?
  console.log('Hola ' + nombre);
}

saludar();
console.log('Nombre global:', nombre);

// TODO: Modifica la función para que use ambos nombres
function saludarAmbos() {
  let nombreLocal = 'María';
  // Tu código aquí: imprimir tanto el nombre global como el local
}

saludarAmbos();

/**
 * 1.4 Lexical Scoping
 *
 * Completa la función para demostrar lexical scoping.
 */

console.log('\n1.4 - Lexical Scoping:');

function exterior() {
  let variableExterior = 'Desde función exterior';

  function interior() {
    // TODO: Accede a variableExterior desde aquí
    console.log('Función interior accede:' /* tu código aquí */);
  }

  interior();
}

exterior();

// =============================================================================
// PARTE 2: HOISTING
// =============================================================================

console.log('\n--- PARTE 2: HOISTING ---');

/**
 * 2.1 Hoisting de Variables (var)
 *
 * Predice qué imprimirá cada console.log ANTES de ejecutar.
 */

console.log('\n2.1 - Hoisting de var:');

// Predicción: ¿Qué imprimirá?
console.log('valor antes de declarar:', valor);

var valor = 'Hola mundo';

console.log('valor después de declarar:', valor);

/**
 * 2.2 Hoisting de let y const (Temporal Dead Zone)
 *
 * Explica por qué algunos de estos funcionan y otros no.
 */

console.log('\n2.2 - Temporal Dead Zone:');

// TODO: Comenta las líneas que causen error y explica por qué

// console.log("miLet antes de declarar:", miLet);
// console.log("miConst antes de declarar:", miConst);

let miLet = 'Declarada con let';
const miConst = 'Declarada con const';

console.log('miLet después de declarar:', miLet);
console.log('miConst después de declarar:', miConst);

/**
 * 2.3 Hoisting de Funciones
 *
 * Compara el hoisting de function declarations vs function expressions.
 */

console.log('\n2.3 - Hoisting de Funciones:');

// TODO: Predice qué funcionará y qué no

// ¿Funcionará?
// funcionDeclarada();

// ¿Funcionará?
// funcionExpresion();

// ¿Funcionará?
// funcionFlecha();

function funcionDeclarada() {
  console.log('Soy una función declarada');
}

var funcionExpresion = function () {
  console.log('Soy una función expresión');
};

var funcionFlecha = () => {
  console.log('Soy una función flecha');
};

// Ahora las llamamos
funcionDeclarada();
funcionExpresion();
funcionFlecha();

/**
 * 2.4 Hoisting Complejo
 *
 * Analiza este código complejo y predice su salida.
 */

console.log('\n2.4 - Hoisting Complejo:');

var x = 1;

function hoistingComplejo() {
  console.log('x al inicio de función:', x);

  if (true) {
    var x = 2; // ¿Qué efecto tiene esto?
    console.log('x dentro del if:', x);
  }

  console.log('x al final de función:', x);
}

hoistingComplejo();
console.log('x global:', x);

// =============================================================================
// PARTE 3: EJERCICIOS PRÁCTICOS
// =============================================================================

console.log('\n--- PARTE 3: EJERCICIOS PRÁCTICOS ---');

/**
 * 3.1 Contador con Closure
 *
 * Crea un contador que use scope correctamente.
 */

console.log('\n3.1 - Contador con Closure:');

function crearContador() {
  // TODO: Crea una variable contador local

  return function () {
    // TODO: Incrementa y retorna el contador
  };
}

const contador1 = crearContador();
const contador2 = crearContador();

// TODO: Testa los contadores
console.log('Contador 1:', contador1()); // Debería imprimir 1
console.log('Contador 1:', contador1()); // Debería imprimir 2
console.log('Contador 2:', contador2()); // Debería imprimir 1

/**
 * 3.2 Sistema de Configuración
 *
 * Crea un sistema que evite contaminar el scope global.
 */

console.log('\n3.2 - Sistema de Configuración:');

// TODO: Crea una función autoinvocada que evite variables globales
(function () {
  // Tu código aquí
  let configuracion = {
    tema: 'oscuro',
    idioma: 'español',
  };

  // TODO: Crea funciones para obtener y establecer configuración
  window.getConfig = function (clave) {
    // Tu código aquí
  };

  window.setConfig = function (clave, valor) {
    // Tu código aquí
  };
})();

// Testa el sistema
setConfig('tema', 'claro');
console.log('Tema actual:', getConfig('tema'));

/**
 * 3.3 Depuración de Scope
 *
 * Encuentra y corrige los errores en este código.
 */

console.log('\n3.3 - Depuración de Scope:');

// TODO: Encuentra y corrige los errores de scope
function procesarUsuarios() {
  const usuarios = ['Ana', 'Carlos', 'María'];

  for (let i = 0; i < usuarios.length; i++) {
    // Error: usando var en lugar de let
    var procesarUsuario = function (usuario) {
      setTimeout(() => {
        console.log(`Procesando usuario: ${usuario}`);
      }, 100);
    };

    procesarUsuario(usuarios[i]);
  }
}

procesarUsuarios();

/**
 * 3.4 Optimización de Scope
 *
 * Optimiza este código para mejor rendimiento y mantenibilidad.
 */

console.log('\n3.4 - Optimización de Scope:');

// TODO: Optimiza este código
function calcularEstadisticas() {
  var numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  var suma = 0;
  var promedio = 0;
  var maximo = 0;
  var minimo = 0;

  // Calcular suma
  for (var i = 0; i < numeros.length; i++) {
    suma += numeros[i];
  }

  // Calcular promedio
  promedio = suma / numeros.length;

  // Encontrar máximo
  for (var i = 0; i < numeros.length; i++) {
    if (numeros[i] > maximo) {
      maximo = numeros[i];
    }
  }

  // Encontrar mínimo
  minimo = numeros[0];
  for (var i = 1; i < numeros.length; i++) {
    if (numeros[i] < minimo) {
      minimo = numeros[i];
    }
  }

  return {
    suma: suma,
    promedio: promedio,
    maximo: maximo,
    minimo: minimo,
  };
}

const estadisticas = calcularEstadisticas();
console.log('Estadísticas:', estadisticas);

// =============================================================================
// PARTE 4: PREGUNTAS DE REFLEXIÓN
// =============================================================================

console.log('\n--- PARTE 4: PREGUNTAS DE REFLEXIÓN ---');

/**
 * Responde estas preguntas con comentarios:
 *
 * 1. ¿Cuál es la diferencia entre var, let y const en términos de scope?
 * // Tu respuesta aquí
 *
 * 2. ¿Qué es el hoisting y cómo afecta el comportamiento del código?
 * // Tu respuesta aquí
 *
 * 3. ¿Cuándo es útil el hoisting y cuándo puede causar problemas?
 * // Tu respuesta aquí
 *
 * 4. ¿Cómo evitar problemas comunes relacionados con scope?
 * // Tu respuesta aquí
 *
 * 5. ¿Qué es el Temporal Dead Zone y cómo afecta a let y const?
 * // Tu respuesta aquí
 */

// =============================================================================
// PARTE 5: DESAFÍOS ADICIONALES
// =============================================================================

console.log('\n--- PARTE 5: DESAFÍOS ADICIONALES ---');

/**
 * 5.1 Desafío: Scope Chain
 *
 * Crea una función que demuestre cómo funciona la cadena de scope.
 */

console.log('\n5.1 - Desafío Scope Chain:');

// TODO: Crea una función que demuestre scope chain con múltiples niveles
function nivelUno() {
  const variable1 = 'Nivel 1';

  function nivelDos() {
    const variable2 = 'Nivel 2';

    function nivelTres() {
      const variable3 = 'Nivel 3';

      // TODO: Accede a las tres variables aquí
      console.log('Acceso desde nivel 3:' /* tu código aquí */);
    }

    nivelTres();
  }

  nivelDos();
}

nivelUno();

/**
 * 5.2 Desafío: Hoisting Quiz
 *
 * Sin ejecutar, predice qué imprimirá este código.
 */

console.log('\n5.2 - Desafío Hoisting Quiz:');

// TODO: Predice la salida antes de ejecutar
function hoistingQuiz() {
  console.log('1:', typeof foo);
  console.log('2:', typeof bar);

  var foo = 'Hola';
  let bar = 'Mundo';

  console.log('3:', foo);
  console.log('4:', bar);
}

hoistingQuiz();

/**
 * 5.3 Desafío: Módulo Privado
 *
 * Crea un módulo que tenga variables privadas y métodos públicos.
 */

console.log('\n5.3 - Desafío Módulo Privado:');

// TODO: Crea un módulo con variables privadas
const calculadora = (function () {
  // Variables privadas
  let historial = [];

  // Métodos públicos
  return {
    sumar: function (a, b) {
      // TODO: Implementa suma y guarda en historial
    },

    restar: function (a, b) {
      // TODO: Implementa resta y guarda en historial
    },

    obtenerHistorial: function () {
      // TODO: Retorna copia del historial
    },
  };
})();

// Testa el módulo
console.log('Suma:', calculadora.sumar(5, 3));
console.log('Resta:', calculadora.restar(10, 4));
console.log('Historial:', calculadora.obtenerHistorial());

// =============================================================================
// RESPUESTAS Y SOLUCIONES
// =============================================================================

/**
 * Una vez que completes todos los ejercicios, compara tus respuestas con las
 * soluciones en el archivo de respuestas del instructor.
 *
 * Puntos clave a recordar:
 * - var tiene function scope, let y const tienen block scope
 * - Hoisting mueve declaraciones al inicio de su scope
 * - Temporal Dead Zone previene acceso a let/const antes de su declaración
 * - Scope chain permite acceso a variables de scopes superiores
 * - Usar const por defecto, let cuando necesites reasignar, evitar var
 */

console.log('\n=== FIN DEL EJERCICIO 1 ===');
