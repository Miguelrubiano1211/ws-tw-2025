/**
 * 📚 DÍA 8: JavaScript Avanzado II - Ejercicios de Patrones Avanzados
 *
 * Objetivos:
 * - Combinar closures, prototipos y asincronismo
 * - Implementar patrones de diseño avanzados
 * - Crear sistemas modulares y escalables
 * - Optimizar rendimiento con técnicas avanzadas
 * - Preparar para frameworks modernos
 */

console.log('🎯 === EJERCICIOS DE PATRONES AVANZADOS ===');

// =====================================================
// 1. PATRÓN MODULE CON CLOSURES Y PROTOTIPOS
// =====================================================

console.log('\n1. 🏗️ Patrón Module con Closures y Prototipos');

// Módulo avanzado que combina closures y prototipos
const ModuloBanco = (function () {
  // Variables privadas del módulo
  let cuentas = new Map();
  let contadorCuentas = 1000;

  // Constructor privado
  function Cuenta(titular, saldoInicial) {
    this.numero = ++contadorCuentas;
    this.titular = titular;
    this.saldo = saldoInicial;
    this.transacciones = [];
  }

  // Métodos del prototipo
  Cuenta.prototype.depositar = function (cantidad) {
    if (cantidad <= 0) {
      throw new Error('La cantidad debe ser positiva');
    }
    this.saldo += cantidad;
    this.transacciones.push({
      tipo: 'deposito',
      cantidad,
      fecha: new Date(),
      saldoAnterior: this.saldo - cantidad,
    });
  };

  Cuenta.prototype.retirar = function (cantidad) {
    if (cantidad <= 0) {
      throw new Error('La cantidad debe ser positiva');
    }
    if (cantidad > this.saldo) {
      throw new Error('Fondos insuficientes');
    }
    this.saldo -= cantidad;
    this.transacciones.push({
      tipo: 'retiro',
      cantidad,
      fecha: new Date(),
      saldoAnterior: this.saldo + cantidad,
    });
  };

  Cuenta.prototype.obtenerEstado = function () {
    return {
      numero: this.numero,
      titular: this.titular,
      saldo: this.saldo,
      transacciones: this.transacciones.length,
    };
  };

  // API pública del módulo
  return {
    crearCuenta: function (titular, saldoInicial = 0) {
      const cuenta = new Cuenta(titular, saldoInicial);
      cuentas.set(cuenta.numero, cuenta);
      return cuenta.numero;
    },

    obtenerCuenta: function (numero) {
      return cuentas.get(numero);
    },

    transferir: function (origen, destino, cantidad) {
      const cuentaOrigen = cuentas.get(origen);
      const cuentaDestino = cuentas.get(destino);

      if (!cuentaOrigen || !cuentaDestino) {
        throw new Error('Cuenta no encontrada');
      }

      cuentaOrigen.retirar(cantidad);
      cuentaDestino.depositar(cantidad);

      return {
        origen: cuentaOrigen.obtenerEstado(),
        destino: cuentaDestino.obtenerEstado(),
      };
    },

    obtenerReporte: function () {
      const totalCuentas = cuentas.size;
      const totalSaldos = Array.from(cuentas.values()).reduce(
        (total, cuenta) => total + cuenta.saldo,
        0
      );

      return {
        totalCuentas,
        totalSaldos,
        promedioPorCuenta: totalSaldos / totalCuentas,
      };
    },
  };
})();

// Usar el módulo banco
const cuenta1 = ModuloBanco.crearCuenta('Ana García', 1000);
const cuenta2 = ModuloBanco.crearCuenta('Luis Rodríguez', 500);

const cuentaAna = ModuloBanco.obtenerCuenta(cuenta1);
cuentaAna.depositar(200);
cuentaAna.retirar(50);

console.log('Estado cuenta Ana:', cuentaAna.obtenerEstado());
console.log('Transferencia:', ModuloBanco.transferir(cuenta1, cuenta2, 300));
console.log('Reporte del banco:', ModuloBanco.obtenerReporte());

// =====================================================
// 2. FACTORY PATTERN CON CLOSURES AVANZADOS
// =====================================================

console.log('\n2. 🏭 Factory Pattern con Closures Avanzados');

// Factory que crea diferentes tipos de conexiones
function crearConexionFactory() {
  // Configuración privada
  const configuraciones = {
    database: {
      host: 'localhost',
      port: 5432,
      timeout: 30000,
    },
    api: {
      host: 'api.ejemplo.com',
      port: 443,
      timeout: 10000,
    },
    cache: {
      host: 'cache.ejemplo.com',
      port: 6379,
      timeout: 5000,
    },
  };

  // Pool de conexiones
  const pools = new Map();

  // Función factory
  return function crearConexion(tipo, opciones = {}) {
    const config = { ...configuraciones[tipo], ...opciones };

    if (!config) {
      throw new Error(`Tipo de conexión no válido: ${tipo}`);
    }

    // Closure que mantiene el estado de la conexión
    let estado = 'desconectado';
    let intentosReconexion = 0;
    const maxIntentos = 3;

    const conexion = {
      conectar: function () {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            if (Math.random() > 0.8 && intentosReconexion < maxIntentos) {
              estado = 'error';
              intentosReconexion++;
              reject(
                new Error(`Error de conexión (intento ${intentosReconexion})`)
              );
            } else {
              estado = 'conectado';
              intentosReconexion = 0;
              resolve(`Conectado a ${config.host}:${config.port}`);
            }
          }, Math.random() * 1000);
        });
      },

      desconectar: function () {
        estado = 'desconectado';
        console.log(`Desconectado de ${config.host}:${config.port}`);
      },

      obtenerEstado: function () {
        return {
          tipo,
          estado,
          host: config.host,
          port: config.port,
          intentosReconexion,
        };
      },

      ejecutar: function (comando) {
        if (estado !== 'conectado') {
          return Promise.reject(new Error('No hay conexión activa'));
        }

        return new Promise(resolve => {
          setTimeout(() => {
            resolve(`Ejecutado: ${comando} en ${tipo}`);
          }, Math.random() * 500);
        });
      },
    };

    // Agregar al pool
    const poolKey = `${tipo}-${config.host}-${config.port}`;
    if (!pools.has(poolKey)) {
      pools.set(poolKey, []);
    }
    pools.get(poolKey).push(conexion);

    return conexion;
  };
}

// Usar el factory
const factory = crearConexionFactory();

const dbConexion = factory('database');
const apiConexion = factory('api');

dbConexion
  .conectar()
  .then(resultado => {
    console.log('DB:', resultado);
    return dbConexion.ejecutar('SELECT * FROM usuarios');
  })
  .then(resultado => {
    console.log('Consulta DB:', resultado);
  })
  .catch(error => {
    console.error('Error DB:', error.message);
  });

// =====================================================
// 3. OBSERVER PATTERN CON ASINCRONISMO
// =====================================================

console.log('\n3. 👁️ Observer Pattern con Asincronismo');

class EventManagerAsincrono {
  constructor() {
    this.eventos = new Map();
    this.middleware = [];
  }

  // Agregar middleware
  use(middleware) {
    this.middleware.push(middleware);
  }

  // Suscribir a evento
  on(evento, callback, opciones = {}) {
    if (!this.eventos.has(evento)) {
      this.eventos.set(evento, []);
    }

    this.eventos.get(evento).push({
      callback,
      opciones: {
        once: opciones.once || false,
        priority: opciones.priority || 0,
        async: opciones.async || false,
      },
    });

    // Ordenar por prioridad
    this.eventos
      .get(evento)
      .sort((a, b) => b.opciones.priority - a.opciones.priority);
  }

  // Emitir evento
  async emit(evento, datos = {}) {
    if (!this.eventos.has(evento)) {
      return;
    }

    // Ejecutar middleware
    for (const middleware of this.middleware) {
      datos = await middleware(evento, datos);
    }

    const suscriptores = this.eventos.get(evento);
    const promesas = [];

    for (let i = suscriptores.length - 1; i >= 0; i--) {
      const suscriptor = suscriptores[i];

      if (suscriptor.opciones.async) {
        promesas.push(this.ejecutarCallback(suscriptor.callback, datos));
      } else {
        await this.ejecutarCallback(suscriptor.callback, datos);
      }

      // Eliminar si es 'once'
      if (suscriptor.opciones.once) {
        suscriptores.splice(i, 1);
      }
    }

    // Esperar callbacks asíncronos
    await Promise.all(promesas);
  }

  // Ejecutar callback con manejo de errores
  async ejecutarCallback(callback, datos) {
    try {
      await callback(datos);
    } catch (error) {
      console.error('Error en callback:', error);
    }
  }
}

// Usar el event manager asíncrono
const eventManager = new EventManagerAsincrono();

// Middleware para logging
eventManager.use(async (evento, datos) => {
  console.log(`📊 Evento: ${evento} - ${new Date().toISOString()}`);
  return datos;
});

// Suscriptores con diferentes prioridades
eventManager.on(
  'usuario-accion',
  async datos => {
    console.log(`🔴 Alta prioridad: ${datos.accion}`);
  },
  { priority: 10 }
);

eventManager.on(
  'usuario-accion',
  async datos => {
    console.log(`🟡 Media prioridad: ${datos.accion}`);
  },
  { priority: 5 }
);

eventManager.on(
  'usuario-accion',
  async datos => {
    console.log(`🟢 Baja prioridad: ${datos.accion}`);
  },
  { priority: 1, async: true }
);

// Emitir eventos
eventManager.emit('usuario-accion', { accion: 'login' });

// =====================================================
// 4. CHAIN OF RESPONSIBILITY PATTERN
// =====================================================

console.log('\n4. 🔗 Chain of Responsibility Pattern');

// Patrón cadena de responsabilidad para validación
class ValidadorBase {
  constructor() {
    this.siguiente = null;
  }

  setSiguiente(validador) {
    this.siguiente = validador;
    return validador;
  }

  async validar(datos) {
    const resultado = await this.procesarValidacion(datos);

    if (resultado.esValido && this.siguiente) {
      return await this.siguiente.validar(datos);
    }

    return resultado;
  }

  async procesarValidacion(datos) {
    // Implementar en clases derivadas
    return { esValido: true, mensaje: 'Validación base' };
  }
}

// Validador de formato
class ValidadorFormato extends ValidadorBase {
  async procesarValidacion(datos) {
    if (!datos.email || !datos.email.includes('@')) {
      return { esValido: false, mensaje: 'Email inválido' };
    }

    if (!datos.password || datos.password.length < 6) {
      return { esValido: false, mensaje: 'Password muy corto' };
    }

    return { esValido: true, mensaje: 'Formato válido' };
  }
}

// Validador de negocio
class ValidadorNegocio extends ValidadorBase {
  constructor() {
    super();
    this.emailsProhibidos = ['admin@test.com', 'root@test.com'];
  }

  async procesarValidacion(datos) {
    await new Promise(resolve => setTimeout(resolve, 100)); // Simular async

    if (this.emailsProhibidos.includes(datos.email)) {
      return { esValido: false, mensaje: 'Email prohibido' };
    }

    return { esValido: true, mensaje: 'Reglas de negocio válidas' };
  }
}

// Validador de seguridad
class ValidadorSeguridad extends ValidadorBase {
  async procesarValidacion(datos) {
    await new Promise(resolve => setTimeout(resolve, 200)); // Simular async

    if (datos.password.toLowerCase().includes('password')) {
      return { esValido: false, mensaje: 'Password inseguro' };
    }

    return { esValido: true, mensaje: 'Seguridad validada' };
  }
}

// Configurar cadena de validación
const validadorFormato = new ValidadorFormato();
const validadorNegocio = new ValidadorNegocio();
const validadorSeguridad = new ValidadorSeguridad();

validadorFormato
  .setSiguiente(validadorNegocio)
  .setSiguiente(validadorSeguridad);

// Usar la cadena de validación
async function validarUsuario(datos) {
  const resultado = await validadorFormato.validar(datos);
  console.log('Resultado validación:', resultado);
  return resultado;
}

validarUsuario({ email: 'usuario@test.com', password: 'mi-password-123' });
validarUsuario({ email: 'admin@test.com', password: 'password123' });

// =====================================================
// 5. MEMOIZACIÓN AVANZADA CON EXPIRACIÓN
// =====================================================

console.log('\n5. 🧠 Memoización Avanzada con Expiración');

function memoizacionAvanzada(fn, opciones = {}) {
  const cache = new Map();
  const configuracion = {
    maxTamaño: opciones.maxTamaño || 100,
    expiracion: opciones.expiracion || 5000,
    keyGenerator: opciones.keyGenerator || ((...args) => JSON.stringify(args)),
  };

  return function (...args) {
    const key = configuracion.keyGenerator(...args);
    const ahora = Date.now();

    // Verificar si existe en cache y no ha expirado
    if (cache.has(key)) {
      const entrada = cache.get(key);
      if (ahora - entrada.timestamp < configuracion.expiracion) {
        console.log(`🟢 Cache hit para: ${key}`);
        return entrada.valor;
      } else {
        console.log(`🟡 Cache expirado para: ${key}`);
        cache.delete(key);
      }
    }

    // Ejecutar función
    console.log(`🔴 Ejecutando función para: ${key}`);
    const resultado = fn.apply(this, args);

    // Limpiar cache si está lleno
    if (cache.size >= configuracion.maxTamaño) {
      const primeraKey = cache.keys().next().value;
      cache.delete(primeraKey);
    }

    // Guardar en cache
    cache.set(key, {
      valor: resultado,
      timestamp: ahora,
    });

    return resultado;
  };
}

// Función costosa para memoizar
function operacionCostosa(numero, multiplicador) {
  // Simular operación costosa
  let resultado = 0;
  for (let i = 0; i < 1000000; i++) {
    resultado += numero * multiplicador;
  }
  return resultado;
}

// Crear versión memoizada
const operacionMemoizada = memoizacionAvanzada(operacionCostosa, {
  maxTamaño: 5,
  expiracion: 3000,
});

// Probar memoización
console.log('Resultado 1:', operacionMemoizada(5, 2));
console.log('Resultado 2:', operacionMemoizada(5, 2)); // Cache hit
console.log('Resultado 3:', operacionMemoizada(10, 3));

// =====================================================
// 6. PROXY PATTERN CON VALIDACIÓN
// =====================================================

console.log('\n6. 🛡️ Proxy Pattern con Validación');

// Crear proxy para validación automática
function crearProxyValidacion(objeto, validaciones) {
  return new Proxy(objeto, {
    set(target, propiedad, valor) {
      // Aplicar validaciones
      if (validaciones[propiedad]) {
        const validacion = validaciones[propiedad];

        if (validacion.requerido && (valor === undefined || valor === null)) {
          throw new Error(`${propiedad} es requerido`);
        }

        if (validacion.tipo && typeof valor !== validacion.tipo) {
          throw new Error(`${propiedad} debe ser de tipo ${validacion.tipo}`);
        }

        if (validacion.validador && !validacion.validador(valor)) {
          throw new Error(`${propiedad} no cumple con la validación`);
        }
      }

      // Establecer valor
      target[propiedad] = valor;
      console.log(`✅ ${propiedad} establecido a: ${valor}`);
      return true;
    },

    get(target, propiedad) {
      if (propiedad === 'validar') {
        return function () {
          const errores = [];

          for (const [prop, validacion] of Object.entries(validaciones)) {
            if (validacion.requerido && target[prop] === undefined) {
              errores.push(`${prop} es requerido`);
            }
          }

          return errores.length === 0
            ? { valido: true, errores: [] }
            : { valido: false, errores };
        };
      }

      return target[propiedad];
    },
  });
}

// Crear objeto con validaciones
const validacionesUsuario = {
  nombre: {
    requerido: true,
    tipo: 'string',
    validador: valor => valor.length >= 2,
  },
  email: {
    requerido: true,
    tipo: 'string',
    validador: valor => valor.includes('@'),
  },
  edad: {
    requerido: false,
    tipo: 'number',
    validador: valor => valor >= 0 && valor <= 120,
  },
};

const usuario = crearProxyValidacion({}, validacionesUsuario);

try {
  usuario.nombre = 'Juan';
  usuario.email = 'juan@test.com';
  usuario.edad = 25;

  console.log('Validación:', usuario.validar());
} catch (error) {
  console.error('Error de validación:', error.message);
}

// =====================================================
// 7. WORKER POOL SIMULATION
// =====================================================

console.log('\n7. 👷 Worker Pool Simulation');

class WorkerPool {
  constructor(maxWorkers = 3) {
    this.workers = [];
    this.cola = [];
    this.maxWorkers = maxWorkers;
    this.idCounter = 0;

    // Crear workers
    for (let i = 0; i < maxWorkers; i++) {
      this.workers.push(this.crearWorker());
    }
  }

  crearWorker() {
    return {
      id: ++this.idCounter,
      ocupado: false,
      ejecutar: async tarea => {
        console.log(`🔨 Worker ${this.id} ejecutando tarea`);

        // Simular trabajo
        await new Promise(resolve => setTimeout(resolve, tarea.tiempo || 1000));

        const resultado = tarea.fn();
        console.log(`✅ Worker ${this.id} completó tarea`);
        return resultado;
      },
    };
  }

  ejecutarTarea(tarea) {
    return new Promise((resolve, reject) => {
      this.cola.push({ tarea, resolve, reject });
      this.procesarCola();
    });
  }

  procesarCola() {
    if (this.cola.length === 0) return;

    const workerDisponible = this.workers.find(w => !w.ocupado);
    if (!workerDisponible) return;

    const { tarea, resolve, reject } = this.cola.shift();
    workerDisponible.ocupado = true;

    workerDisponible
      .ejecutar(tarea)
      .then(resultado => {
        workerDisponible.ocupado = false;
        resolve(resultado);
        this.procesarCola(); // Procesar siguiente tarea
      })
      .catch(error => {
        workerDisponible.ocupado = false;
        reject(error);
        this.procesarCola(); // Procesar siguiente tarea
      });
  }

  obtenerEstadisticas() {
    return {
      workersOcupados: this.workers.filter(w => w.ocupado).length,
      tareasEnCola: this.cola.length,
      totalWorkers: this.workers.length,
    };
  }
}

// Usar el worker pool
const pool = new WorkerPool(2);

// Crear tareas
const tareas = [
  { fn: () => 'Tarea 1 completada', tiempo: 500 },
  { fn: () => 'Tarea 2 completada', tiempo: 800 },
  { fn: () => 'Tarea 3 completada', tiempo: 300 },
  { fn: () => 'Tarea 4 completada', tiempo: 600 },
];

// Ejecutar tareas
tareas.forEach((tarea, index) => {
  pool
    .ejecutarTarea(tarea)
    .then(resultado => console.log(`Resultado ${index + 1}: ${resultado}`))
    .catch(error => console.error(`Error en tarea ${index + 1}:`, error));
});

// Monitorear estadísticas
setInterval(() => {
  const stats = pool.obtenerEstadisticas();
  console.log('📊 Estadísticas del pool:', stats);
}, 1000);

// =====================================================
// 8. SISTEMA DE CACHE DISTRIBUIDO SIMULADO
// =====================================================

console.log('\n8. 🌐 Sistema de Cache Distribuido Simulado');

class CacheDistribuido {
  constructor() {
    this.nodos = new Map();
    this.replicacion = 2;
  }

  agregarNodo(id, latencia = 100) {
    this.nodos.set(id, {
      id,
      latencia,
      datos: new Map(),
      activo: true,
    });
  }

  obtenerNodosPorKey(key) {
    const hash = this.hashKey(key);
    const nodosActivos = Array.from(this.nodos.values()).filter(n => n.activo);

    // Seleccionar nodos basado en hash
    const nodosPrimarios = nodosActivos
      .sort((a, b) => this.hashKey(key + a.id) - this.hashKey(key + b.id))
      .slice(0, this.replicacion);

    return nodosPrimarios;
  }

  hashKey(key) {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = ((hash << 5) - hash + key.charCodeAt(i)) & 0xffffffff;
    }
    return Math.abs(hash);
  }

  async set(key, valor, ttl = 300000) {
    const nodos = this.obtenerNodosPorKey(key);
    const promesas = nodos.map(nodo => this.setEnNodo(nodo, key, valor, ttl));

    const resultados = await Promise.allSettled(promesas);
    const exitosos = resultados.filter(r => r.status === 'fulfilled').length;

    return exitosos >= Math.ceil(this.replicacion / 2);
  }

  async setEnNodo(nodo, key, valor, ttl) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.1) {
          // 90% de éxito
          nodo.datos.set(key, {
            valor,
            expiracion: Date.now() + ttl,
          });
          resolve(true);
        } else {
          reject(new Error(`Error en nodo ${nodo.id}`));
        }
      }, nodo.latencia);
    });
  }

  async get(key) {
    const nodos = this.obtenerNodosPorKey(key);
    const promesas = nodos.map(nodo => this.getDeNodo(nodo, key));

    const resultados = await Promise.allSettled(promesas);
    const exitosos = resultados.filter(r => r.status === 'fulfilled');

    if (exitosos.length > 0) {
      return exitosos[0].value;
    }

    return null;
  }

  async getDeNodo(nodo, key) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const entrada = nodo.datos.get(key);

        if (!entrada) {
          reject(new Error('Clave no encontrada'));
          return;
        }

        if (Date.now() > entrada.expiracion) {
          nodo.datos.delete(key);
          reject(new Error('Clave expirada'));
          return;
        }

        resolve(entrada.valor);
      }, nodo.latencia);
    });
  }
}

// Usar el cache distribuido
const cache = new CacheDistribuido();

// Agregar nodos
cache.agregarNodo('nodo1', 50);
cache.agregarNodo('nodo2', 80);
cache.agregarNodo('nodo3', 120);

// Usar el cache
async function probarCache() {
  console.log('💾 Guardando en cache...');
  await cache.set('usuario:123', { nombre: 'Juan', email: 'juan@test.com' });

  console.log('📖 Leyendo del cache...');
  const usuario = await cache.get('usuario:123');
  console.log('Usuario obtenido:', usuario);
}

probarCache();

console.log('\n✅ Ejercicios de Patrones Avanzados completados!');
console.log('💡 Conceptos practicados:');
console.log('   - Patrón Module avanzado');
console.log('   - Factory Pattern con closures');
console.log('   - Observer Pattern asíncrono');
console.log('   - Chain of Responsibility');
console.log('   - Memoización avanzada');
console.log('   - Proxy Pattern con validación');
console.log('   - Worker Pool simulation');
console.log('   - Cache distribuido simulado');
