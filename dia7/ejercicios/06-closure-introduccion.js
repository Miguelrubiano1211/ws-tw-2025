/**
 * 🎯 Ejercicio 6: Introducción a Closures
 *
 * Objetivo: Entender el concepto fundamental de closures en JavaScript
 * Tiempo estimado: 40 minutos
 * Dificultad: ⭐⭐⭐⭐
 */

console.log('=== EJERCICIO 6: INTRODUCCIÓN A CLOSURES ===');

// =============================================================================
// PARTE 1: CONCEPTOS BÁSICOS DE CLOSURES
// =============================================================================

console.log('\n--- PARTE 1: CONCEPTOS BÁSICOS ---');

/**
 * 1.1 Closure Simple
 *
 * Comprende qué es un closure.
 */

console.log('\n1.1 - Closure Simple:');

function funcionExterna() {
  let variableExterna = 'Soy de la función externa';

  function funcionInterna() {
    console.log(variableExterna); // Accede a variable del scope externo
  }

  return funcionInterna;
}

const miClosure = funcionExterna();
miClosure(); // Ejecuta la función interna

// TODO: Crea tu propio closure
function crearSaludo(nombre) {
  // Tu código aquí
  return function () {
    // Tu código aquí
  };
}

const saludarAna = crearSaludo('Ana');
const saludarCarlos = crearSaludo('Carlos');

saludarAna();
saludarCarlos();

/**
 * 1.2 Closure con Parámetros
 *
 * Closures que reciben parámetros.
 */

console.log('\n1.2 - Closure con Parámetros:');

function crearMultiplicador(factor) {
  return function (numero) {
    return numero * factor;
  };
}

const duplicar = crearMultiplicador(2);
const triplicar = crearMultiplicador(3);

console.log('Duplicar 5:', duplicar(5));
console.log('Triplicar 4:', triplicar(4));

// TODO: Crea un closure que sume un valor fijo
function crearSumador(valorFijo) {
  // Tu código aquí
}

const sumar10 = crearSumador(10);
const sumar5 = crearSumador(5);

console.log('Sumar 10 a 7:', sumar10(7));
console.log('Sumar 5 a 3:', sumar5(3));

/**
 * 1.3 Múltiples Closures
 *
 * Función que retorna múltiples closures.
 */

console.log('\n1.3 - Múltiples Closures:');

function crearOperaciones(valor) {
  return {
    sumar: function (x) {
      return valor + x;
    },
    restar: function (x) {
      return valor - x;
    },
    multiplicar: function (x) {
      return valor * x;
    },
    dividir: function (x) {
      return valor / x;
    },
  };
}

const operacionesCon10 = crearOperaciones(10);

console.log('10 + 5 =', operacionesCon10.sumar(5));
console.log('10 - 3 =', operacionesCon10.restar(3));
console.log('10 * 2 =', operacionesCon10.multiplicar(2));
console.log('10 / 5 =', operacionesCon10.dividir(5));

// =============================================================================
// PARTE 2: CLOSURES CON ESTADO
// =============================================================================

console.log('\n--- PARTE 2: CLOSURES CON ESTADO ---');

/**
 * 2.1 Contador con Closure
 *
 * Mantiene estado privado usando closure.
 */

console.log('\n2.1 - Contador con Closure:');

function crearContador() {
  let count = 0;

  return {
    incrementar: function () {
      count++;
      return count;
    },
    decrementar: function () {
      count--;
      return count;
    },
    obtenerValor: function () {
      return count;
    },
    resetear: function () {
      count = 0;
      return count;
    },
  };
}

const contador1 = crearContador();
const contador2 = crearContador();

console.log('Contador 1 incrementar:', contador1.incrementar());
console.log('Contador 1 incrementar:', contador1.incrementar());
console.log('Contador 2 incrementar:', contador2.incrementar());
console.log('Contador 1 valor:', contador1.obtenerValor());
console.log('Contador 2 valor:', contador2.obtenerValor());

/**
 * 2.2 Banco con Closure
 *
 * Simula cuenta bancaria con saldo privado.
 */

console.log('\n2.2 - Banco con Closure:');

function crearCuenta(saldoInicial = 0) {
  let saldo = saldoInicial;

  return {
    depositar: function (monto) {
      if (monto > 0) {
        saldo += monto;
        return `Depósito exitoso. Saldo: $${saldo}`;
      }
      return 'Monto inválido';
    },

    retirar: function (monto) {
      if (monto > 0 && monto <= saldo) {
        saldo -= monto;
        return `Retiro exitoso. Saldo: $${saldo}`;
      }
      return 'Monto inválido o saldo insuficiente';
    },

    consultarSaldo: function () {
      return saldo;
    },
  };
}

// TODO: Crea cuentas y realiza operaciones
const cuentaJuan = crearCuenta(100);
const cuentaAna = crearCuenta(50);

console.log(cuentaJuan.depositar(50));
console.log(cuentaJuan.retirar(30));
console.log('Saldo Juan:', cuentaJuan.consultarSaldo());

console.log(cuentaAna.depositar(25));
console.log('Saldo Ana:', cuentaAna.consultarSaldo());

/**
 * 2.3 Historial con Closure
 *
 * Mantiene historial de operaciones.
 */

console.log('\n2.3 - Historial con Closure:');

function crearCalculadoraConHistorial() {
  let historial = [];

  function agregarAlHistorial(operacion, resultado) {
    historial.push({
      operacion,
      resultado,
      timestamp: new Date().toISOString(),
    });
  }

  return {
    sumar: function (a, b) {
      const resultado = a + b;
      agregarAlHistorial(`${a} + ${b}`, resultado);
      return resultado;
    },

    restar: function (a, b) {
      const resultado = a - b;
      agregarAlHistorial(`${a} - ${b}`, resultado);
      return resultado;
    },

    multiplicar: function (a, b) {
      const resultado = a * b;
      agregarAlHistorial(`${a} * ${b}`, resultado);
      return resultado;
    },

    obtenerHistorial: function () {
      return [...historial]; // Copia para evitar mutación
    },

    limpiarHistorial: function () {
      historial = [];
    },
  };
}

// TODO: Usa la calculadora con historial
const calc = crearCalculadoraConHistorial();

console.log('5 + 3 =', calc.sumar(5, 3));
console.log('10 - 4 =', calc.restar(10, 4));
console.log('7 * 2 =', calc.multiplicar(7, 2));
console.log('Historial:', calc.obtenerHistorial());

// =============================================================================
// PARTE 3: CLOSURES EN LOOPS
// =============================================================================

console.log('\n--- PARTE 3: CLOSURES EN LOOPS ---');

/**
 * 3.1 Problema Clásico del Loop
 *
 * Demuestra el problema común con closures en loops.
 */

console.log('\n3.1 - Problema del Loop:');

// Problema: todos los callbacks imprimen 3
for (var i = 0; i < 3; i++) {
  setTimeout(function () {
    console.log('Problema - i:', i); // Imprime 3, 3, 3
  }, 100);
}

// TODO: Solución usando closure
for (var i = 0; i < 3; i++) {
  (function (index) {
    setTimeout(function () {
      console.log('Solución closure - index:', index);
    }, 200);
  })(i);
}

// TODO: Solución usando let
for (let i = 0; i < 3; i++) {
  setTimeout(function () {
    console.log('Solución let - i:', i);
  }, 300);
}

/**
 * 3.2 Creación de Funciones en Loop
 *
 * Crea múltiples funciones usando closures.
 */

console.log('\n3.2 - Funciones en Loop:');

function crearFunciones() {
  const funciones = [];

  for (let i = 0; i < 5; i++) {
    funciones.push(function () {
      return i * i;
    });
  }

  return funciones;
}

const funcionesArray = crearFunciones();

// TODO: Ejecuta las funciones
funcionesArray.forEach((fn, index) => {
  console.log(`Función ${index}:`, fn());
});

/**
 * 3.3 Event Handlers con Closures
 *
 * Simula event handlers que mantienen contexto.
 */

console.log('\n3.3 - Event Handlers:');

function crearEventHandlers() {
  const handlers = [];

  for (let i = 0; i < 3; i++) {
    handlers.push(function (event) {
      console.log(`Handler ${i} ejecutado con evento:`, event);
    });
  }

  return handlers;
}

const handlers = crearEventHandlers();

// Simula eventos
handlers.forEach((handler, index) => {
  handler(`evento-${index}`);
});

// =============================================================================
// PARTE 4: CLOSURES Y MÓDULOS
// =============================================================================

console.log('\n--- PARTE 4: CLOSURES Y MÓDULOS ---');

/**
 * 4.1 Patrón Módulo con Closure
 *
 * Crea módulos con propiedades privadas.
 */

console.log('\n4.1 - Patrón Módulo:');

const modulo = (function () {
  // Variables privadas
  let variablePrivada = 'Soy privada';
  let contador = 0;

  // Función privada
  function funcionPrivada() {
    contador++;
    console.log('Función privada ejecutada');
  }

  // API pública
  return {
    metodoPublico: function () {
      funcionPrivada();
      return `Variable privada: ${variablePrivada}, Contador: ${contador}`;
    },

    establecerVariable: function (valor) {
      variablePrivada = valor;
    },

    obtenerContador: function () {
      return contador;
    },
  };
})();

// TODO: Usa el módulo
console.log(modulo.metodoPublico());
modulo.establecerVariable('Nuevo valor');
console.log(modulo.metodoPublico());

/**
 * 4.2 Factory de Módulos
 *
 * Crea múltiples instancias de módulos.
 */

console.log('\n4.2 - Factory de Módulos:');

function crearModuloUsuario(nombre) {
  let configuracion = {
    tema: 'claro',
    idioma: 'es',
  };

  let sesion = {
    loginTime: new Date(),
    activo: true,
  };

  return {
    obtenerNombre: function () {
      return nombre;
    },

    configurar: function (opciones) {
      configuracion = { ...configuracion, ...opciones };
    },

    obtenerConfiguracion: function () {
      return { ...configuracion };
    },

    iniciarSesion: function () {
      sesion.loginTime = new Date();
      sesion.activo = true;
    },

    cerrarSesion: function () {
      sesion.activo = false;
    },

    estaActivo: function () {
      return sesion.activo;
    },
  };
}

// TODO: Crea usuarios y configura
const usuario1 = crearModuloUsuario('Juan');
const usuario2 = crearModuloUsuario('Ana');

usuario1.configurar({ tema: 'oscuro' });
usuario2.configurar({ idioma: 'en' });

console.log(
  'Usuario 1:',
  usuario1.obtenerNombre(),
  usuario1.obtenerConfiguracion()
);
console.log(
  'Usuario 2:',
  usuario2.obtenerNombre(),
  usuario2.obtenerConfiguracion()
);

// =============================================================================
// PARTE 5: CLOSURES AVANZADOS
// =============================================================================

console.log('\n--- PARTE 5: CLOSURES AVANZADOS ---');

/**
 * 5.1 Memoización con Closures
 *
 * Implementa cache usando closures.
 */

console.log('\n5.1 - Memoización:');

function memoize(fn) {
  const cache = {};

  return function (...args) {
    const key = JSON.stringify(args);

    if (cache[key]) {
      console.log('Cache hit para:', key);
      return cache[key];
    }

    console.log('Calculando para:', key);
    const resultado = fn.apply(this, args);
    cache[key] = resultado;
    return resultado;
  };
}

// TODO: Aplica memoización a función costosa
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const fibonacciMemo = memoize(fibonacci);

console.log('Fibonacci(10):', fibonacciMemo(10));
console.log('Fibonacci(10) segunda vez:', fibonacciMemo(10));

/**
 * 5.2 Throttling con Closures
 *
 * Limita frecuencia de ejecución.
 */

console.log('\n5.2 - Throttling:');

function throttle(fn, limit) {
  let inThrottle;

  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// TODO: Aplica throttling
function logMensaje(mensaje) {
  console.log('Mensaje:', mensaje);
}

const logThrottled = throttle(logMensaje, 1000);

// Simula llamadas rápidas
logThrottled('Mensaje 1');
logThrottled('Mensaje 2');
logThrottled('Mensaje 3');

/**
 * 5.3 Debouncing con Closures
 *
 * Retrasa ejecución hasta que pare la actividad.
 */

console.log('\n5.3 - Debouncing:');

function debounce(fn, delay) {
  let timeoutId;

  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

// TODO: Aplica debouncing
function buscar(termino) {
  console.log('Buscando:', termino);
}

const buscarDebounced = debounce(buscar, 300);

// Simula escritura rápida
buscarDebounced('j');
buscarDebounced('ja');
buscarDebounced('jav');
buscarDebounced('java');

// =============================================================================
// PARTE 6: EJERCICIOS PRÁCTICOS
// =============================================================================

console.log('\n--- PARTE 6: EJERCICIOS PRÁCTICOS ---');

/**
 * 6.1 Sistema de Permisos
 *
 * Crea sistema de permisos con closures.
 */

console.log('\n6.1 - Sistema de Permisos:');

function crearSistemaPermisos() {
  const permisos = new Set();

  return {
    agregarPermiso: function (permiso) {
      permisos.add(permiso);
    },

    removerPermiso: function (permiso) {
      permisos.delete(permiso);
    },

    crearVerificador: function (permiso) {
      return function (accion) {
        if (permisos.has(permiso)) {
          console.log(`Acción permitida: ${accion}`);
          return true;
        } else {
          console.log(`Acción denegada: ${accion}`);
          return false;
        }
      };
    },

    listarPermisos: function () {
      return Array.from(permisos);
    },
  };
}

// TODO: Usa el sistema de permisos
const sistema = crearSistemaPermisos();
sistema.agregarPermiso('leer');
sistema.agregarPermiso('escribir');

const verificarLectura = sistema.crearVerificador('leer');
const verificarEliminacion = sistema.crearVerificador('eliminar');

verificarLectura('leer archivo');
verificarEliminacion('eliminar archivo');

/**
 * 6.2 Cache con Expiración
 *
 * Implementa cache con tiempo de vida.
 */

console.log('\n6.2 - Cache con Expiración:');

function crearCacheConExpiracion() {
  const cache = new Map();

  return {
    set: function (key, value, ttl = 5000) {
      const expiracion = Date.now() + ttl;
      cache.set(key, { value, expiracion });
    },

    get: function (key) {
      const item = cache.get(key);

      if (!item) {
        return null;
      }

      if (Date.now() > item.expiracion) {
        cache.delete(key);
        return null;
      }

      return item.value;
    },

    has: function (key) {
      return this.get(key) !== null;
    },

    clear: function () {
      cache.clear();
    },

    size: function () {
      // Limpia elementos expirados
      for (const [key, item] of cache) {
        if (Date.now() > item.expiracion) {
          cache.delete(key);
        }
      }
      return cache.size;
    },
  };
}

// TODO: Usa el cache con expiración
const cache = crearCacheConExpiracion();

cache.set('usuario1', { nombre: 'Juan', edad: 25 }, 2000);
console.log('Inmediatamente:', cache.get('usuario1'));

setTimeout(() => {
  console.log('Después de 3 segundos:', cache.get('usuario1'));
}, 3000);

/**
 * 6.3 State Machine Simple
 *
 * Implementa máquina de estados usando closures.
 */

console.log('\n6.3 - State Machine:');

function crearStateMachine(estadoInicial, estados) {
  let estadoActual = estadoInicial;

  return {
    obtenerEstado: function () {
      return estadoActual;
    },

    transicion: function (accion) {
      const estadoDefinicion = estados[estadoActual];
      const nuevoEstado = estadoDefinicion[accion];

      if (nuevoEstado) {
        console.log(
          `Transición: ${estadoActual} -> ${nuevoEstado} (${accion})`
        );
        estadoActual = nuevoEstado;
        return true;
      } else {
        console.log(`Transición inválida: ${accion} desde ${estadoActual}`);
        return false;
      }
    },

    puedeTransicionar: function (accion) {
      return estados[estadoActual][accion] !== undefined;
    },
  };
}

// TODO: Crea una máquina de estados
const semaforo = crearStateMachine('rojo', {
  rojo: {
    cambiar: 'verde',
  },
  verde: {
    cambiar: 'amarillo',
  },
  amarillo: {
    cambiar: 'rojo',
  },
});

console.log('Estado inicial:', semaforo.obtenerEstado());
semaforo.transicion('cambiar');
console.log('Estado actual:', semaforo.obtenerEstado());
semaforo.transicion('cambiar');
console.log('Estado actual:', semaforo.obtenerEstado());

// =============================================================================
// PARTE 7: PREGUNTAS DE REFLEXIÓN
// =============================================================================

console.log('\n--- PARTE 7: PREGUNTAS DE REFLEXIÓN ---');

/**
 * Responde estas preguntas con comentarios:
 *
 * 1. ¿Qué es un closure y por qué es importante en JavaScript?
 * // Tu respuesta aquí
 *
 * 2. ¿Cuáles son las ventajas de usar closures para datos privados?
 * // Tu respuesta aquí
 *
 * 3. ¿Qué problemas comunes surgen con closures en loops?
 * // Tu respuesta aquí
 *
 * 4. ¿Cómo se relacionan closures con el patrón módulo?
 * // Tu respuesta aquí
 *
 * 5. ¿Cuándo usar closures vs clases para encapsulación?
 * // Tu respuesta aquí
 */

// =============================================================================
// RESPUESTAS Y SOLUCIONES
// =============================================================================

/**
 * Puntos clave a recordar:
 * - Closures mantienen acceso a variables del scope externo
 * - Permiten crear datos privados sin clases
 * - Son fundamentales para el patrón módulo
 * - Pueden causar memory leaks si no se gestionan correctamente
 * - Son la base de muchos patrones avanzados en JavaScript
 * - Útiles para memoización, throttling y debouncing
 */

console.log('\n=== FIN DEL EJERCICIO 6 ===');
