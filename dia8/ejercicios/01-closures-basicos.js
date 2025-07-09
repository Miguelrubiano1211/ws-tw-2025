/**
 * Ejercicio 1: Closures Básicos
 * Día 8 - JavaScript Avanzado II
 *
 * Objetivo: Comprender y aplicar closures básicos para encapsulación
 * Conceptos: Lexical scoping, variables privadas, factory functions
 */

console.log('=== EJERCICIO 1: CLOSURES BÁSICOS ===\n');

// ================================
// PARTE 1: CONTADOR PRIVADO
// ================================

console.log('--- PARTE 1: Contador Privado ---');

/**
 * Crea una función que retorne un contador privado
 * El contador debe:
 * - Incrementar en 1 cada vez que se llama
 * - No permitir acceso directo a la variable count
 * - Mantener el estado entre llamadas
 */

function crearContador() {
  let count = 0;

  return function () {
    count++;
    return count;
  };
}

// Pruebas
const contador1 = crearContador();
const contador2 = crearContador();

console.log('Contador 1:', contador1()); // 1
console.log('Contador 1:', contador1()); // 2
console.log('Contador 1:', contador1()); // 3

console.log('Contador 2:', contador2()); // 1
console.log('Contador 2:', contador2()); // 2

// Verificar que count es privada
console.log('count es privada:', typeof count === 'undefined'); // true

// ================================
// PARTE 2: CONTADOR AVANZADO
// ================================

console.log('\n--- PARTE 2: Contador Avanzado ---');

/**
 * Crea un contador que permita:
 * - Incrementar
 * - Decrementar
 * - Resetear
 * - Obtener valor actual
 * - Establecer valor específico
 */

function crearContadorAvanzado(valorInicial = 0) {
  let count = valorInicial;

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
      count = valorInicial;
      return count;
    },
    establecerValor: function (nuevoValor) {
      if (typeof nuevoValor === 'number') {
        count = nuevoValor;
        return count;
      }
      throw new Error('El valor debe ser un número');
    },
  };
}

// Pruebas
const contadorAvanzado = crearContadorAvanzado(10);

console.log('Valor inicial:', contadorAvanzado.obtenerValor()); // 10
console.log('Incrementar:', contadorAvanzado.incrementar()); // 11
console.log('Incrementar:', contadorAvanzado.incrementar()); // 12
console.log('Decrementar:', contadorAvanzado.decrementar()); // 11
console.log('Resetear:', contadorAvanzado.resetear()); // 10
console.log('Establecer 50:', contadorAvanzado.establecerValor(50)); // 50

// ================================
// PARTE 3: FACTORY DE CALCULADORAS
// ================================

console.log('\n--- PARTE 3: Factory de Calculadoras ---');

/**
 * Crea una factory function que produzca calculadoras
 * Cada calculadora debe:
 * - Mantener un valor actual privado
 * - Tener métodos: sumar, restar, multiplicar, dividir
 * - Tener método para obtener resultado
 * - Tener método para resetear
 * - Mantener historial de operaciones
 */

function crearCalculadora(valorInicial = 0) {
  let valor = valorInicial;
  let historial = [];

  function agregarAlHistorial(operacion, operando, resultado) {
    historial.push({
      operacion,
      operando,
      resultado,
      timestamp: new Date().toISOString(),
    });
  }

  return {
    sumar: function (num) {
      if (typeof num !== 'number') {
        throw new Error('El operando debe ser un número');
      }
      const resultado = valor + num;
      agregarAlHistorial('suma', num, resultado);
      valor = resultado;
      return this; // Para encadenamiento
    },

    restar: function (num) {
      if (typeof num !== 'number') {
        throw new Error('El operando debe ser un número');
      }
      const resultado = valor - num;
      agregarAlHistorial('resta', num, resultado);
      valor = resultado;
      return this;
    },

    multiplicar: function (num) {
      if (typeof num !== 'number') {
        throw new Error('El operando debe ser un número');
      }
      const resultado = valor * num;
      agregarAlHistorial('multiplicación', num, resultado);
      valor = resultado;
      return this;
    },

    dividir: function (num) {
      if (typeof num !== 'number') {
        throw new Error('El operando debe ser un número');
      }
      if (num === 0) {
        throw new Error('No se puede dividir por cero');
      }
      const resultado = valor / num;
      agregarAlHistorial('división', num, resultado);
      valor = resultado;
      return this;
    },

    obtenerResultado: function () {
      return valor;
    },

    resetear: function () {
      valor = valorInicial;
      historial = [];
      return this;
    },

    obtenerHistorial: function () {
      return [...historial]; // Retorna copia para evitar mutación
    },

    mostrarHistorial: function () {
      console.log('Historial de operaciones:');
      historial.forEach((entrada, index) => {
        console.log(
          `${index + 1}. ${entrada.operacion} ${entrada.operando} = ${
            entrada.resultado
          }`
        );
      });
      return this;
    },
  };
}

// Pruebas
const calc = crearCalculadora(10);

console.log('Resultado inicial:', calc.obtenerResultado()); // 10

// Encadenamiento de operaciones
calc.sumar(5).multiplicar(2).restar(10).dividir(2);

console.log('Resultado final:', calc.obtenerResultado()); // 10
calc.mostrarHistorial();

// ================================
// PARTE 4: MÓDULO DE CONFIGURACIÓN
// ================================

console.log('\n--- PARTE 4: Módulo de Configuración ---');

/**
 * Crea un módulo de configuración usando closures
 * Debe permitir:
 * - Establecer configuraciones
 * - Obtener configuraciones
 * - Validar configuraciones
 * - Resetear a valores por defecto
 */

const moduloConfiguracion = (function () {
  // Configuración privada
  const configuracionPorDefecto = {
    tema: 'claro',
    idioma: 'es',
    notificaciones: true,
    timeout: 5000,
  };

  let configuracionActual = { ...configuracionPorDefecto };

  // Validadores privados
  const validadores = {
    tema: valor => ['claro', 'oscuro'].includes(valor),
    idioma: valor => ['es', 'en', 'fr'].includes(valor),
    notificaciones: valor => typeof valor === 'boolean',
    timeout: valor => typeof valor === 'number' && valor > 0,
  };

  // Funciones privadas
  function validarConfiguracion(clave, valor) {
    const validador = validadores[clave];
    if (!validador) {
      throw new Error(`Configuración desconocida: ${clave}`);
    }
    if (!validador(valor)) {
      throw new Error(`Valor inválido para ${clave}: ${valor}`);
    }
  }

  // API pública
  return {
    establecer: function (clave, valor) {
      validarConfiguracion(clave, valor);
      configuracionActual[clave] = valor;
      return this;
    },

    obtener: function (clave) {
      if (clave) {
        return configuracionActual[clave];
      }
      return { ...configuracionActual };
    },

    establecerMultiples: function (configuraciones) {
      for (const [clave, valor] of Object.entries(configuraciones)) {
        validarConfiguracion(clave, valor);
      }

      Object.assign(configuracionActual, configuraciones);
      return this;
    },

    resetear: function () {
      configuracionActual = { ...configuracionPorDefecto };
      return this;
    },

    exportar: function () {
      return JSON.stringify(configuracionActual, null, 2);
    },

    importar: function (jsonString) {
      try {
        const configuraciones = JSON.parse(jsonString);
        this.establecerMultiples(configuraciones);
      } catch (error) {
        throw new Error('JSON inválido para importar configuración');
      }
      return this;
    },
  };
})();

// Pruebas
console.log('Configuración inicial:', moduloConfiguracion.obtener());

moduloConfiguracion.establecer('tema', 'oscuro').establecer('timeout', 10000);

console.log('Tema actual:', moduloConfiguracion.obtener('tema')); // 'oscuro'
console.log('Configuración completa:', moduloConfiguracion.obtener());

// Probar validación
try {
  moduloConfiguracion.establecer('tema', 'invalido');
} catch (error) {
  console.log('Error capturado:', error.message);
}

// ================================
// PARTE 5: CLOSURE CON MÚLTIPLES FUNCIONES
// ================================

console.log('\n--- PARTE 5: Closure con Múltiples Funciones ---');

/**
 * Crea un closure que maneje una lista de tareas
 * Debe tener funciones para:
 * - Agregar tarea
 * - Completar tarea
 * - Eliminar tarea
 * - Listar tareas
 * - Filtrar tareas
 */

function crearGestorTareas() {
  let tareas = [];
  let proximoId = 1;

  return {
    agregar: function (descripcion, prioridad = 'normal') {
      const tarea = {
        id: proximoId++,
        descripcion,
        prioridad,
        completada: false,
        fechaCreacion: new Date().toISOString(),
      };
      tareas.push(tarea);
      return tarea;
    },

    completar: function (id) {
      const tarea = tareas.find(t => t.id === id);
      if (tarea) {
        tarea.completada = true;
        tarea.fechaCompletacion = new Date().toISOString();
        return tarea;
      }
      throw new Error(`Tarea con ID ${id} no encontrada`);
    },

    eliminar: function (id) {
      const index = tareas.findIndex(t => t.id === id);
      if (index !== -1) {
        return tareas.splice(index, 1)[0];
      }
      throw new Error(`Tarea con ID ${id} no encontrada`);
    },

    listar: function () {
      return tareas.map(t => ({ ...t })); // Retorna copia
    },

    filtrar: function (criterio) {
      switch (criterio) {
        case 'completadas':
          return tareas.filter(t => t.completada);
        case 'pendientes':
          return tareas.filter(t => !t.completada);
        case 'alta':
          return tareas.filter(t => t.prioridad === 'alta');
        case 'normal':
          return tareas.filter(t => t.prioridad === 'normal');
        case 'baja':
          return tareas.filter(t => t.prioridad === 'baja');
        default:
          return tareas;
      }
    },

    obtenerEstadisticas: function () {
      const total = tareas.length;
      const completadas = tareas.filter(t => t.completada).length;
      const pendientes = total - completadas;

      return {
        total,
        completadas,
        pendientes,
        porcentajeCompletado:
          total > 0 ? ((completadas / total) * 100).toFixed(2) : 0,
      };
    },
  };
}

// Pruebas
const gestor = crearGestorTareas();

console.log('Agregando tareas...');
gestor.agregar('Estudiar closures', 'alta');
gestor.agregar('Hacer ejercicios', 'normal');
gestor.agregar('Revisar código', 'baja');

console.log('Tareas creadas:', gestor.listar());

console.log('Completando tarea 1...');
gestor.completar(1);

console.log('Tareas pendientes:', gestor.filtrar('pendientes'));
console.log('Tareas completadas:', gestor.filtrar('completadas'));
console.log('Estadísticas:', gestor.obtenerEstadisticas());

// ================================
// DESAFÍO: CLOSURE CON TIMEOUT
// ================================

console.log('\n--- DESAFÍO: Closure con Timeout ---');

/**
 * Crea una función que use closures para implementar
 * un sistema de rate limiting (limitar frecuencia de llamadas)
 */

function crearRateLimiter(maxLlamadas, ventanaTiempo) {
  let llamadas = [];

  return function (callback) {
    const ahora = Date.now();

    // Limpiar llamadas antiguas
    llamadas = llamadas.filter(tiempo => ahora - tiempo < ventanaTiempo);

    if (llamadas.length >= maxLlamadas) {
      console.log('Rate limit excedido. Intenta más tarde.');
      return false;
    }

    llamadas.push(ahora);
    callback();
    return true;
  };
}

// Pruebas
const rateLimiter = crearRateLimiter(3, 5000); // 3 llamadas por 5 segundos

console.log('Probando rate limiter...');
rateLimiter(() => console.log('Llamada 1')); // OK
rateLimiter(() => console.log('Llamada 2')); // OK
rateLimiter(() => console.log('Llamada 3')); // OK
rateLimiter(() => console.log('Llamada 4')); // Rate limit excedido

// ================================
// EJERCICIOS ADICIONALES
// ================================

console.log('\n=== EJERCICIOS ADICIONALES ===');

/**
 * Ejercicio Extra 1: Implementa un cache con closures
 * Ejercicio Extra 2: Crea un sistema de eventos con closures
 * Ejercicio Extra 3: Implementa un patrón singleton con closures
 */

// Ejercicio Extra 1: Cache con closures
function crearCache(maxSize = 10) {
  const cache = new Map();

  return {
    get: function (key) {
      return cache.get(key);
    },

    set: function (key, value) {
      if (cache.size >= maxSize && !cache.has(key)) {
        // Eliminar el primer elemento (FIFO)
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
      }
      cache.set(key, value);
    },

    has: function (key) {
      return cache.has(key);
    },

    delete: function (key) {
      return cache.delete(key);
    },

    clear: function () {
      cache.clear();
    },

    size: function () {
      return cache.size;
    },
  };
}

const cache = crearCache(3);
cache.set('a', 1);
cache.set('b', 2);
cache.set('c', 3);
console.log('Cache size:', cache.size()); // 3

cache.set('d', 4); // Elimina 'a'
console.log('Tiene "a":', cache.has('a')); // false
console.log('Tiene "d":', cache.has('d')); // true

console.log('\n✅ Ejercicio 1 completado!');
console.log(
  '📚 Conceptos aplicados: Closures, lexical scoping, encapsulación, factory functions'
);
console.log('🎯 Próximo: Ejercicio 2 - Closures Avanzados');
