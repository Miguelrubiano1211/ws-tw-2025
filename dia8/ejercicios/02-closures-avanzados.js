/**
 * Ejercicio 2: Closures Avanzados
 * Día 8 - JavaScript Avanzado II
 *
 * Objetivo: Aplicar closures en patrones avanzados como módulos, memoización y observers
 * Conceptos: IIFE, patrón módulo, memoización, callbacks con estado
 */

console.log('=== EJERCICIO 2: CLOSURES AVANZADOS ===\n');

// ================================
// PARTE 1: PATRÓN MÓDULO CON IIFE
// ================================

console.log('--- PARTE 1: Patrón Módulo con IIFE ---');

/**
 * Crear un módulo de biblioteca usando IIFE que permita:
 * - Agregar libros
 * - Buscar libros
 * - Prestar y devolver libros
 * - Mantener registro de préstamos
 */

const Biblioteca = (function () {
  // Estado privado
  let libros = [];
  let prestamos = [];
  let proximoId = 1;

  // Funciones privadas
  function buscarLibroPorId(id) {
    return libros.find(libro => libro.id === id);
  }

  function generarReporte() {
    const totalLibros = libros.length;
    const librosPrestados = prestamos.filter(p => !p.fechaDevolucion).length;
    const librosDisponibles = totalLibros - librosPrestados;

    return {
      totalLibros,
      librosPrestados,
      librosDisponibles,
      prestamosHistoricos: prestamos.length,
    };
  }

  function validarLibro(libro) {
    if (!libro.titulo || !libro.autor) {
      throw new Error('El libro debe tener título y autor');
    }
    if (typeof libro.titulo !== 'string' || typeof libro.autor !== 'string') {
      throw new Error('Título y autor deben ser strings');
    }
  }

  // API pública
  return {
    agregarLibro: function (titulo, autor, isbn, categoria = 'general') {
      const libro = { titulo, autor, isbn, categoria };
      validarLibro(libro);

      libro.id = proximoId++;
      libro.fechaAdicion = new Date().toISOString();
      libro.disponible = true;

      libros.push(libro);
      return libro;
    },

    buscarLibros: function (criterio, valor) {
      if (!criterio || !valor) {
        return [...libros]; // Retorna todos los libros
      }

      return libros.filter(libro => {
        switch (criterio) {
          case 'titulo':
            return libro.titulo.toLowerCase().includes(valor.toLowerCase());
          case 'autor':
            return libro.autor.toLowerCase().includes(valor.toLowerCase());
          case 'categoria':
            return libro.categoria.toLowerCase() === valor.toLowerCase();
          case 'isbn':
            return libro.isbn === valor;
          default:
            return false;
        }
      });
    },

    prestarLibro: function (idLibro, nombreUsuario) {
      const libro = buscarLibroPorId(idLibro);
      if (!libro) {
        throw new Error('Libro no encontrado');
      }
      if (!libro.disponible) {
        throw new Error('El libro no está disponible');
      }

      const prestamo = {
        id: prestamos.length + 1,
        idLibro,
        nombreUsuario,
        fechaPrestamo: new Date().toISOString(),
        fechaDevolucion: null,
      };

      libro.disponible = false;
      prestamos.push(prestamo);

      return prestamo;
    },

    devolverLibro: function (idLibro) {
      const libro = buscarLibroPorId(idLibro);
      if (!libro) {
        throw new Error('Libro no encontrado');
      }

      const prestamo = prestamos.find(
        p => p.idLibro === idLibro && !p.fechaDevolucion
      );

      if (!prestamo) {
        throw new Error('No hay préstamo activo para este libro');
      }

      prestamo.fechaDevolucion = new Date().toISOString();
      libro.disponible = true;

      return prestamo;
    },

    obtenerReporte: function () {
      return generarReporte();
    },

    obtenerHistorialPrestamos: function (nombreUsuario) {
      if (nombreUsuario) {
        return prestamos.filter(
          p => p.nombreUsuario.toLowerCase() === nombreUsuario.toLowerCase()
        );
      }
      return [...prestamos];
    },
  };
})();

// Pruebas del módulo Biblioteca
console.log('Agregando libros...');
const libro1 = Biblioteca.agregarLibro(
  'El Quijote',
  'Cervantes',
  '978-84-376-0494-7',
  'clásico'
);
const libro2 = Biblioteca.agregarLibro(
  'Cien años de soledad',
  'García Márquez',
  '978-84-376-0495-8',
  'ficción'
);

console.log('Libros agregados:', Biblioteca.buscarLibros());

console.log('Prestando libro...');
const prestamo = Biblioteca.prestarLibro(libro1.id, 'Ana García');
console.log('Préstamo realizado:', prestamo);

console.log('Reporte:', Biblioteca.obtenerReporte());

// ================================
// PARTE 2: MEMOIZACIÓN AVANZADA
// ================================

console.log('\n--- PARTE 2: Memoización Avanzada ---');

/**
 * Crear función de memoización que:
 * - Cache resultados de funciones costosas
 * - Soporte funciones con múltiples argumentos
 * - Permita limpiar cache
 * - Tenga TTL (tiempo de vida) para entradas
 */

function crearMemoizador(opciones = {}) {
  const cache = new Map();
  const {
    maxSize = 100,
    ttl = 300000, // 5 minutos por defecto
    keyGenerator = JSON.stringify,
  } = opciones;

  function limpiarExpirados() {
    const ahora = Date.now();
    for (const [key, entrada] of cache.entries()) {
      if (ahora - entrada.timestamp > ttl) {
        cache.delete(key);
      }
    }
  }

  return function memoizar(fn) {
    return function (...args) {
      limpiarExpirados();

      const key = keyGenerator(args);

      if (cache.has(key)) {
        console.log(`Cache hit para: ${key}`);
        return cache.get(key).value;
      }

      console.log(`Cache miss para: ${key}`);
      const resultado = fn.apply(this, args);

      // Limpiar cache si está lleno
      if (cache.size >= maxSize) {
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
      }

      cache.set(key, {
        value: resultado,
        timestamp: Date.now(),
      });

      return resultado;
    };
  };
}

// Función costosa para probar memoización
function operacionCostosa(n) {
  console.log(`Calculando factorial de ${n}...`);
  if (n <= 1) return 1;
  return n * operacionCostosa(n - 1);
}

// Crear memoizador y aplicar a función
const memoizador = crearMemoizador({ maxSize: 10, ttl: 10000 });
const factorialMemoizado = memoizador(operacionCostosa);

// Pruebas
console.log('Primera llamada:', factorialMemoizado(5));
console.log('Segunda llamada (desde cache):', factorialMemoizado(5));
console.log('Tercera llamada con otro valor:', factorialMemoizado(6));

// ================================
// PARTE 3: SISTEMA DE EVENTOS (OBSERVER PATTERN)
// ================================

console.log('\n--- PARTE 3: Sistema de Eventos ---');

/**
 * Crear un sistema de eventos que use closures para:
 * - Suscribir listeners a eventos
 * - Emitir eventos con datos
 * - Desuscribir listeners
 * - Manejar eventos una sola vez
 * - Espacios de nombres para eventos
 */

function crearEmuladorEventos() {
  const eventos = new Map();
  const eventosUnaVez = new Set();

  function obtenerEventos(nombreEvento) {
    if (!eventos.has(nombreEvento)) {
      eventos.set(nombreEvento, []);
    }
    return eventos.get(nombreEvento);
  }

  return {
    on: function (nombreEvento, callback, opciones = {}) {
      if (typeof callback !== 'function') {
        throw new Error('El callback debe ser una función');
      }

      const listeners = obtenerEventos(nombreEvento);
      const listener = {
        callback,
        id: Date.now() + Math.random(),
        ...opciones,
      };

      listeners.push(listener);
      return listener.id;
    },

    once: function (nombreEvento, callback) {
      const listenerId = this.on(nombreEvento, (...args) => {
        callback(...args);
        this.off(nombreEvento, listenerId);
      });
      eventosUnaVez.add(listenerId);
      return listenerId;
    },

    emit: function (nombreEvento, ...datos) {
      const listeners = eventos.get(nombreEvento);
      if (!listeners) return false;

      let ejecutados = 0;

      // Crear copia para evitar problemas si se modifica durante iteración
      [...listeners].forEach(listener => {
        try {
          listener.callback(...datos);
          ejecutados++;
        } catch (error) {
          console.error(`Error en listener de ${nombreEvento}:`, error);
        }
      });

      return ejecutados > 0;
    },

    off: function (nombreEvento, listenerId) {
      const listeners = eventos.get(nombreEvento);
      if (!listeners) return false;

      const index = listeners.findIndex(l => l.id === listenerId);
      if (index !== -1) {
        listeners.splice(index, 1);
        eventosUnaVez.delete(listenerId);
        return true;
      }
      return false;
    },

    removeAllListeners: function (nombreEvento) {
      if (nombreEvento) {
        eventos.delete(nombreEvento);
      } else {
        eventos.clear();
        eventosUnaVez.clear();
      }
    },

    listenerCount: function (nombreEvento) {
      const listeners = eventos.get(nombreEvento);
      return listeners ? listeners.length : 0;
    },

    eventNames: function () {
      return Array.from(eventos.keys());
    },
  };
}

// Pruebas del sistema de eventos
const emitter = crearEmuladorEventos();

console.log('Configurando listeners...');

// Listener persistente
emitter.on('usuario-login', usuario => {
  console.log(`Usuario ${usuario.nombre} se ha conectado`);
});

// Listener que se ejecuta una sola vez
emitter.once('aplicacion-iniciada', () => {
  console.log('¡Aplicación iniciada por primera vez!');
});

// Emitir eventos
console.log('Emitiendo eventos...');
emitter.emit('aplicacion-iniciada');
emitter.emit('aplicacion-iniciada'); // No se ejecutará

emitter.emit('usuario-login', { nombre: 'Ana', id: 1 });
emitter.emit('usuario-login', { nombre: 'Carlos', id: 2 });

console.log('Eventos registrados:', emitter.eventNames());
console.log(
  'Listeners para usuario-login:',
  emitter.listenerCount('usuario-login')
);

// ================================
// PARTE 4: FACTORY CON MÚLTIPLES CLOSURES
// ================================

console.log('\n--- PARTE 4: Factory con Múltiples Closures ---');

/**
 * Crear una factory de cuentas bancarias que use múltiples closures para:
 * - Mantener saldo privado
 * - Historial de transacciones
 * - Validaciones
 * - Notificaciones
 */

function crearCuentaBancaria(titular, saldoInicial = 0) {
  // Estado privado
  let saldo = saldoInicial;
  let transacciones = [];
  let bloqueada = false;
  let limiteDiario = 1000;

  // Funciones privadas con closures
  const validaciones = {
    montoPositivo: monto => {
      if (typeof monto !== 'number' || monto <= 0) {
        throw new Error('El monto debe ser un número positivo');
      }
    },

    cuentaDesbloqueada: () => {
      if (bloqueada) {
        throw new Error('La cuenta está bloqueada');
      }
    },

    limiteDiario: monto => {
      const hoy = new Date().toDateString();
      const transaccionesHoy = transacciones.filter(
        t => new Date(t.fecha).toDateString() === hoy && t.tipo === 'retiro'
      );
      const retirosDiarios = transaccionesHoy.reduce(
        (total, t) => total + t.monto,
        0
      );

      if (retirosDiarios + monto > limiteDiario) {
        throw new Error(
          `Límite diario excedido. Límite: ${limiteDiario}, ya retirado: ${retirosDiarios}`
        );
      }
    },
  };

  const registrarTransaccion = (tipo, monto, descripcion = '') => {
    const transaccion = {
      id: transacciones.length + 1,
      tipo,
      monto,
      descripcion,
      fecha: new Date().toISOString(),
      saldoAnterior: tipo === 'deposito' ? saldo - monto : saldo + monto,
      saldoNuevo: saldo,
    };
    transacciones.push(transaccion);
    return transaccion;
  };

  // API pública
  return {
    obtenerTitular: () => titular,

    obtenerSaldo: () => saldo,

    depositar: function (monto, descripcion = 'Depósito') {
      validaciones.montoPositivo(monto);
      validaciones.cuentaDesbloqueada();

      saldo += monto;
      return registrarTransaccion('deposito', monto, descripcion);
    },

    retirar: function (monto, descripcion = 'Retiro') {
      validaciones.montoPositivo(monto);
      validaciones.cuentaDesbloqueada();
      validaciones.limiteDiario(monto);

      if (monto > saldo) {
        throw new Error('Saldo insuficiente');
      }

      saldo -= monto;
      return registrarTransaccion('retiro', monto, descripcion);
    },

    transferir: function (otraCuenta, monto, descripcion = 'Transferencia') {
      if (!otraCuenta || typeof otraCuenta.depositar !== 'function') {
        throw new Error('Cuenta destino inválida');
      }

      // Retirar de esta cuenta
      const retiro = this.retirar(
        monto,
        `${descripcion} a ${otraCuenta.obtenerTitular()}`
      );

      try {
        // Depositar en otra cuenta
        otraCuenta.depositar(monto, `${descripcion} de ${titular}`);
        return retiro;
      } catch (error) {
        // Si falla el depósito, revertir el retiro
        this.depositar(monto, 'Reversión de transferencia fallida');
        throw error;
      }
    },

    obtenerHistorial: function (filtro = {}) {
      let resultado = [...transacciones];

      if (filtro.tipo) {
        resultado = resultado.filter(t => t.tipo === filtro.tipo);
      }

      if (filtro.fechaDesde) {
        resultado = resultado.filter(
          t => new Date(t.fecha) >= new Date(filtro.fechaDesde)
        );
      }

      if (filtro.fechaHasta) {
        resultado = resultado.filter(
          t => new Date(t.fecha) <= new Date(filtro.fechaHasta)
        );
      }

      return resultado;
    },

    bloquear: function () {
      bloqueada = true;
      registrarTransaccion('bloqueo', 0, 'Cuenta bloqueada');
    },

    desbloquear: function () {
      bloqueada = false;
      registrarTransaccion('desbloqueo', 0, 'Cuenta desbloqueada');
    },

    cambiarLimiteDiario: function (nuevoLimite) {
      if (typeof nuevoLimite !== 'number' || nuevoLimite <= 0) {
        throw new Error('El límite debe ser un número positivo');
      }
      limiteDiario = nuevoLimite;
    },

    obtenerEstadisticas: function () {
      const depositos = transacciones.filter(t => t.tipo === 'deposito');
      const retiros = transacciones.filter(t => t.tipo === 'retiro');

      return {
        saldoActual: saldo,
        totalTransacciones: transacciones.length,
        totalDepositos: depositos.reduce((sum, t) => sum + t.monto, 0),
        totalRetiros: retiros.reduce((sum, t) => sum + t.monto, 0),
        cuentaBloqueada: bloqueada,
        limiteDiario,
      };
    },
  };
}

// Pruebas de la cuenta bancaria
console.log('Creando cuentas bancarias...');
const cuentaAna = crearCuentaBancaria('Ana García', 1000);
const cuentaCarlos = crearCuentaBancaria('Carlos López', 500);

console.log('Saldo inicial Ana:', cuentaAna.obtenerSaldo()); // 1000
console.log('Saldo inicial Carlos:', cuentaCarlos.obtenerSaldo()); // 500

console.log('Realizando transacciones...');
cuentaAna.depositar(200, 'Salario');
cuentaAna.retirar(150, 'Compras');
cuentaAna.transferir(cuentaCarlos, 100, 'Pago de deuda');

console.log('Saldo final Ana:', cuentaAna.obtenerSaldo()); // 950
console.log('Saldo final Carlos:', cuentaCarlos.obtenerSaldo()); // 600

console.log('Estadísticas Ana:', cuentaAna.obtenerEstadisticas());
console.log(
  'Historial de retiros Ana:',
  cuentaAna.obtenerHistorial({ tipo: 'retiro' })
);

// ================================
// PARTE 5: CLOSURE CON GENERADORES SIMULADOS
// ================================

console.log('\n--- PARTE 5: Closure con Generadores Simulados ---');

/**
 * Simular generadores usando closures para crear
 * secuencias infinitas o finitas de valores
 */

function crearGeneradorFibonacci() {
  let a = 0,
    b = 1;

  return {
    next: function () {
      const value = a;
      [a, b] = [b, a + b];
      return { value, done: false };
    },

    reset: function () {
      a = 0;
      b = 1;
    },

    take: function (n) {
      const resultado = [];
      for (let i = 0; i < n; i++) {
        resultado.push(this.next().value);
      }
      return resultado;
    },
  };
}

function crearGeneradorRango(inicio, fin, paso = 1) {
  let actual = inicio;

  return {
    next: function () {
      if (actual > fin) {
        return { value: undefined, done: true };
      }
      const value = actual;
      actual += paso;
      return { value, done: false };
    },

    hasNext: function () {
      return actual <= fin;
    },

    toArray: function () {
      const resultado = [];
      let item = this.next();
      while (!item.done) {
        resultado.push(item.value);
        item = this.next();
      }
      return resultado;
    },
  };
}

// Pruebas de generadores
const fib = crearGeneradorFibonacci();
console.log('Primeros 10 números de Fibonacci:', fib.take(10));

const rango = crearGeneradorRango(1, 10, 2);
console.log('Números impares del 1 al 10:', rango.toArray());

console.log('\n✅ Ejercicio 2 completado!');
console.log(
  '📚 Conceptos aplicados: IIFE, patrón módulo, memoización, observer pattern, generadores simulados'
);
console.log('🎯 Próximo: Ejercicio 3 - Prototipos Básicos');
