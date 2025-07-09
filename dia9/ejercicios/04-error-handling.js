/**
 * 🚨 Ejercicio 4: Error Handling
 *
 * Objetivo: Dominar el manejo robusto de errores asíncronos
 * Conceptos: Try/catch avanzado, error propagation, custom errors, recovery
 *
 * Instrucciones:
 * 1. Estudia los diferentes tipos de errores asíncronos
 * 2. Implementa sistemas de recuperación de errores
 * 3. Practica con error handling en diferentes scenarios
 */

console.log('🚨 Ejercicio 4: Error Handling');

// =============================================================================
// 1. TIPOS DE ERRORES ASÍNCRONOS
// =============================================================================

// Custom Error Classes
class NetworkError extends Error {
  constructor(message, code = 'NETWORK_ERROR') {
    super(message);
    this.name = 'NetworkError';
    this.code = code;
    this.timestamp = new Date().toISOString();
  }
}

class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.timestamp = new Date().toISOString();
  }
}

class TimeoutError extends Error {
  constructor(message, timeout) {
    super(message);
    this.name = 'TimeoutError';
    this.timeout = timeout;
    this.timestamp = new Date().toISOString();
  }
}

// Simuladores de operaciones que pueden fallar
function simularOperacionRed(url, probabilidadFallo = 0.3) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < probabilidadFallo) {
        reject(
          new NetworkError(`No se pudo conectar a ${url}`, 'ECONNREFUSED')
        );
      } else {
        resolve({
          url: url,
          data: { mensaje: 'Datos obtenidos exitosamente' },
          status: 200,
        });
      }
    }, 500 + Math.random() * 1000);
  });
}

function validarDatos(datos) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!datos) {
        reject(new ValidationError('Datos son requeridos', 'data'));
      } else if (!datos.email) {
        reject(new ValidationError('Email es requerido', 'email'));
      } else if (!datos.email.includes('@')) {
        reject(new ValidationError('Email debe ser válido', 'email'));
      } else {
        resolve({ ...datos, validated: true });
      }
    }, 200);
  });
}

function operacionConTimeout(tiempo) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new TimeoutError(`Operación tardó más de ${tiempo}ms`, tiempo));
    }, tiempo);

    // Simular operación que puede tardar
    setTimeout(() => {
      clearTimeout(timeoutId);
      resolve('Operación completada');
    }, Math.random() * (tiempo * 2));
  });
}

// Ejemplo de manejo básico de errores
console.log('\n📝 Ejemplo 1: Tipos de errores');

async function manejarDiferentesErrores() {
  try {
    // Probar diferentes tipos de errores
    const resultado1 = await simularOperacionRed(
      'https://api.ejemplo.com/datos'
    );
    console.log('✅ Operación de red exitosa:', resultado1);

    const resultado2 = await validarDatos({ email: 'usuario@ejemplo.com' });
    console.log('✅ Validación exitosa:', resultado2);

    const resultado3 = await operacionConTimeout(1000);
    console.log('✅ Operación con timeout exitosa:', resultado3);
  } catch (error) {
    // Manejo específico por tipo de error
    if (error instanceof NetworkError) {
      console.error('🌐 Error de red:', error.message, 'Código:', error.code);
    } else if (error instanceof ValidationError) {
      console.error(
        '📋 Error de validación:',
        error.message,
        'Campo:',
        error.field
      );
    } else if (error instanceof TimeoutError) {
      console.error(
        '⏰ Error de timeout:',
        error.message,
        'Tiempo:',
        error.timeout
      );
    } else {
      console.error('❌ Error desconocido:', error.message);
    }
  }
}

manejarDiferentesErrores();

// =============================================================================
// 2. ERROR PROPAGATION Y CONTEXTO
// =============================================================================

/**
 * Sistema de manejo de errores con contexto
 */
class ErrorContext {
  constructor(operacion, usuario = null) {
    this.operacion = operacion;
    this.usuario = usuario;
    this.timestamp = new Date().toISOString();
    this.errores = [];
  }

  agregarError(error, contexto = {}) {
    this.errores.push({
      error: error,
      contexto: contexto,
      timestamp: new Date().toISOString(),
    });
  }

  tieneErrores() {
    return this.errores.length > 0;
  }

  obtenerResumen() {
    return {
      operacion: this.operacion,
      usuario: this.usuario,
      totalErrores: this.errores.length,
      tiposErrores: [...new Set(this.errores.map(e => e.error.name))],
      primerError: this.errores[0]?.error.message,
      ultimoError: this.errores[this.errores.length - 1]?.error.message,
    };
  }
}

// Función con propagación de errores
async function procesarPedidoConContexto(datosPedido) {
  const contexto = new ErrorContext(
    'Procesamiento de pedido',
    datosPedido.usuario
  );

  try {
    // Paso 1: Validar datos del pedido
    try {
      await validarDatos(datosPedido);
      console.log('✅ Datos del pedido validados');
    } catch (error) {
      contexto.agregarError(error, { paso: 'validacion', datos: datosPedido });
      throw new Error(`Error en validación: ${error.message}`);
    }

    // Paso 2: Verificar inventario
    try {
      await simularOperacionRed('https://api.inventario.com/verificar');
      console.log('✅ Inventario verificado');
    } catch (error) {
      contexto.agregarError(error, {
        paso: 'inventario',
        producto: datosPedido.producto,
      });
      throw new Error(`Error verificando inventario: ${error.message}`);
    }

    // Paso 3: Procesar pago
    try {
      await operacionConTimeout(2000);
      console.log('✅ Pago procesado');
    } catch (error) {
      contexto.agregarError(error, { paso: 'pago', monto: datosPedido.monto });
      throw new Error(`Error procesando pago: ${error.message}`);
    }

    return {
      exito: true,
      pedidoId: `PED-${Date.now()}`,
      contexto: contexto.obtenerResumen(),
    };
  } catch (error) {
    // Enriquecer error con contexto
    const errorEnriquecido = new Error(
      `Falló procesamiento de pedido: ${error.message}`
    );
    errorEnriquecido.contexto = contexto.obtenerResumen();
    errorEnriquecido.originalError = error;

    throw errorEnriquecido;
  }
}

// Ejemplo de uso con propagación
console.log('\n📝 Ejemplo 2: Error propagation');

async function manejarPedidoConContexto() {
  try {
    const resultado = await procesarPedidoConContexto({
      usuario: 'usuario123',
      email: 'usuario@ejemplo.com',
      producto: 'laptop',
      monto: 1000,
    });

    console.log('✅ Pedido procesado exitosamente:', resultado);
  } catch (error) {
    console.error('❌ Error procesando pedido:', error.message);

    if (error.contexto) {
      console.error('📋 Contexto del error:', error.contexto);
    }
  }
}

manejarPedidoConContexto();

// =============================================================================
// 3. RETRY Y RECOVERY PATTERNS
// =============================================================================

/**
 * Sistema de retry con backoff exponencial
 */
async function retryConBackoff(
  operacion,
  maxIntentos = 3,
  delayInicial = 1000
) {
  let ultimoError;

  for (let intento = 1; intento <= maxIntentos; intento++) {
    try {
      console.log(`🔄 Intento ${intento}/${maxIntentos}`);
      const resultado = await operacion();

      if (intento > 1) {
        console.log(`✅ Éxito después de ${intento} intentos`);
      }

      return resultado;
    } catch (error) {
      ultimoError = error;
      console.log(`❌ Intento ${intento} falló: ${error.message}`);

      if (intento < maxIntentos) {
        const delay = delayInicial * Math.pow(2, intento - 1);
        console.log(`⏳ Esperando ${delay}ms antes del siguiente intento...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw new Error(
    `Operación falló después de ${maxIntentos} intentos. Último error: ${ultimoError.message}`
  );
}

/**
 * Sistema de circuit breaker con recovery
 */
class CircuitBreakerAvanzado {
  constructor(umbralFallos = 5, tiempoEspera = 30000, umbralRecuperacion = 2) {
    this.umbralFallos = umbralFallos;
    this.tiempoEspera = tiempoEspera;
    this.umbralRecuperacion = umbralRecuperacion;
    this.fallos = 0;
    this.exitos = 0;
    this.estado = 'CLOSED';
    this.ultimoFallo = null;
    this.estadisticas = {
      totalIntentos: 0,
      totalExitos: 0,
      totalFallos: 0,
      tiemposTotales: { CLOSED: 0, OPEN: 0, HALF_OPEN: 0 },
    };
  }

  async ejecutar(operacion) {
    this.estadisticas.totalIntentos++;

    if (this.estado === 'OPEN') {
      const tiempoPasado = Date.now() - this.ultimoFallo;

      if (tiempoPasado >= this.tiempoEspera) {
        this.estado = 'HALF_OPEN';
        this.exitos = 0;
        console.log('🔄 Circuit breaker: HALF_OPEN');
      } else {
        this.estadisticas.totalFallos++;
        throw new Error(
          `Circuit breaker OPEN. Tiempo restante: ${
            this.tiempoEspera - tiempoPasado
          }ms`
        );
      }
    }

    try {
      const resultado = await operacion();
      this.exitos++;
      this.estadisticas.totalExitos++;

      if (this.estado === 'HALF_OPEN') {
        if (this.exitos >= this.umbralRecuperacion) {
          this.estado = 'CLOSED';
          this.fallos = 0;
          console.log('✅ Circuit breaker: CLOSED (recuperado)');
        }
      }

      return resultado;
    } catch (error) {
      this.fallos++;
      this.exitos = 0;
      this.ultimoFallo = Date.now();
      this.estadisticas.totalFallos++;

      if (this.estado === 'HALF_OPEN' || this.fallos >= this.umbralFallos) {
        this.estado = 'OPEN';
        console.log('🚨 Circuit breaker: OPEN');
      }

      throw error;
    }
  }

  obtenerEstadisticas() {
    return {
      ...this.estadisticas,
      estadoActual: this.estado,
      fallosConsecutivos: this.fallos,
      exitosConsecutivos: this.exitos,
      porcentajeExito:
        (this.estadisticas.totalExitos / this.estadisticas.totalIntentos) * 100,
    };
  }
}

// Ejemplo de retry y recovery
console.log('\n📝 Ejemplo 3: Retry y recovery');

async function operacionInestable() {
  return simularOperacionRed('https://api.inestable.com/datos', 0.6);
}

async function probarRetryYRecovery() {
  console.log('🔄 Probando retry con backoff:');

  try {
    const resultado = await retryConBackoff(operacionInestable, 4, 500);
    console.log('✅ Operación exitosa con retry:', resultado);
  } catch (error) {
    console.error('❌ Falló incluso con retry:', error.message);
  }

  console.log('\n🔄 Probando circuit breaker:');
  const breaker = new CircuitBreakerAvanzado(3, 5000, 2);

  // Simular múltiples operaciones
  for (let i = 1; i <= 10; i++) {
    try {
      const resultado = await breaker.ejecutar(operacionInestable);
      console.log(`✅ Operación ${i} exitosa`);
    } catch (error) {
      console.error(`❌ Operación ${i} falló: ${error.message}`);
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(
    '📊 Estadísticas del circuit breaker:',
    breaker.obtenerEstadisticas()
  );
}

probarRetryYRecovery();

// =============================================================================
// 4. GRACEFUL DEGRADATION
// =============================================================================

/**
 * Sistema que maneja degradación graceful
 */
class ServicioConDegradacion {
  constructor() {
    this.cache = new Map();
    this.estadoServicios = {
      principal: true,
      secundario: true,
      cache: true,
    };
  }

  async obtenerDatos(id) {
    // Intentar servicio principal
    if (this.estadoServicios.principal) {
      try {
        const datos = await simularOperacionRed(
          `https://api.principal.com/datos/${id}`,
          0.3
        );
        this.cache.set(id, datos);
        return { ...datos, origen: 'principal' };
      } catch (error) {
        console.log('⚠️ Servicio principal falló, intentando secundario...');
        this.estadoServicios.principal = false;

        // Reactivar después de un tiempo
        setTimeout(() => {
          this.estadoServicios.principal = true;
          console.log('✅ Servicio principal reactivado');
        }, 10000);
      }
    }

    // Intentar servicio secundario
    if (this.estadoServicios.secundario) {
      try {
        const datos = await simularOperacionRed(
          `https://api.secundario.com/datos/${id}`,
          0.5
        );
        this.cache.set(id, datos);
        return { ...datos, origen: 'secundario' };
      } catch (error) {
        console.log('⚠️ Servicio secundario falló, intentando cache...');
        this.estadoServicios.secundario = false;

        setTimeout(() => {
          this.estadoServicios.secundario = true;
          console.log('✅ Servicio secundario reactivado');
        }, 5000);
      }
    }

    // Intentar cache
    if (this.estadoServicios.cache && this.cache.has(id)) {
      console.log('💾 Sirviendo desde cache');
      const datos = this.cache.get(id);
      return { ...datos, origen: 'cache', stale: true };
    }

    // Datos por defecto como último recurso
    console.log('🔄 Usando datos por defecto');
    return {
      id: id,
      data: { mensaje: 'Datos no disponibles, usando respuesta por defecto' },
      origen: 'default',
      status: 503,
    };
  }
}

// Ejemplo de degradación graceful
console.log('\n📝 Ejemplo 4: Graceful degradation');

async function probarDegradacion() {
  const servicio = new ServicioConDegradacion();

  for (let i = 1; i <= 8; i++) {
    try {
      const datos = await servicio.obtenerDatos(i);
      console.log(`📄 Datos ${i}:`, datos.origen, '-', datos.data.mensaje);
    } catch (error) {
      console.error(`❌ Error obteniendo datos ${i}:`, error.message);
    }

    await new Promise(resolve => setTimeout(resolve, 1500));
  }
}

probarDegradacion();

// =============================================================================
// 5. EJERCICIOS PRÁCTICOS
// =============================================================================

console.log('\n🎯 Ejercicios prácticos:');

// EJERCICIO A: Sistema de notificaciones resiliente
class SistemaNotificaciones {
  constructor() {
    this.canales = ['email', 'sms', 'push'];
    this.fallos = new Map();
  }

  async enviarNotificacion(mensaje, usuario, preferencias = ['email', 'sms']) {
    // TODO: Implementar sistema que:
    // 1. Intente enviar por cada canal en orden de preferencia
    // 2. Si un canal falla, intente el siguiente
    // 3. Registre fallos y los evite temporalmente
    // 4. Retorne resultado indicando qué canales funcionaron

    const resultados = [];

    for (const canal of preferencias) {
      // Verificar si el canal ha fallado recientemente
      const falloCanal = this.fallos.get(canal);
      if (falloCanal && Date.now() - falloCanal < 30000) {
        console.log(`⚠️ Saltando canal ${canal} (falló recientemente)`);
        continue;
      }

      try {
        await this.enviarPorCanal(mensaje, usuario, canal);
        resultados.push({ canal, exitoso: true });
        console.log(`✅ Notificación enviada por ${canal}`);

        // Limpiar registro de fallos si funciona
        this.fallos.delete(canal);
        break; // Éxito, no necesitamos más canales
      } catch (error) {
        console.log(`❌ Falló envío por ${canal}: ${error.message}`);
        this.fallos.set(canal, Date.now());
        resultados.push({ canal, exitoso: false, error: error.message });
      }
    }

    return {
      exitoso: resultados.some(r => r.exitoso),
      resultados: resultados,
      mensaje: mensaje,
      usuario: usuario,
    };
  }

  async enviarPorCanal(mensaje, usuario, canal) {
    const probabilidadFallo = {
      email: 0.2,
      sms: 0.4,
      push: 0.3,
    };

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() < probabilidadFallo[canal]) {
          reject(new Error(`Servicio ${canal} no disponible`));
        } else {
          resolve({ canal, mensaje, usuario, timestamp: Date.now() });
        }
      }, 500);
    });
  }
}

// EJERCICIO B: Sistema de logs con buffer y retry
class SistemaLogs {
  constructor() {
    this.buffer = [];
    this.maxBufferSize = 100;
    this.enviandoLogs = false;
  }

  async log(nivel, mensaje, contexto = {}) {
    const entrada = {
      nivel,
      mensaje,
      contexto,
      timestamp: new Date().toISOString(),
      id: Math.random().toString(36).substr(2, 9),
    };

    this.buffer.push(entrada);

    if (this.buffer.length >= this.maxBufferSize) {
      await this.enviarLogs();
    }
  }

  async enviarLogs() {
    if (this.enviandoLogs || this.buffer.length === 0) return;

    this.enviandoLogs = true;
    const logsAEnviar = [...this.buffer];
    this.buffer = [];

    try {
      await retryConBackoff(
        async () => {
          await this.enviarLogsAServidor(logsAEnviar);
        },
        3,
        1000
      );

      console.log(`✅ Enviados ${logsAEnviar.length} logs`);
    } catch (error) {
      console.error('❌ Error enviando logs:', error.message);
      // Devolver logs al buffer
      this.buffer.unshift(...logsAEnviar);
    } finally {
      this.enviandoLogs = false;
    }
  }

  async enviarLogsAServidor(logs) {
    // Simular envío que puede fallar
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() < 0.3) {
          reject(new Error('Servidor de logs no disponible'));
        } else {
          resolve({ enviados: logs.length, timestamp: Date.now() });
        }
      }, 1000);
    });
  }
}

// EJERCICIO C: Sistema de transacciones con rollback
class TransactionManager {
  constructor() {
    this.operaciones = [];
    this.completadas = [];
  }

  async ejecutarTransaccion(operaciones) {
    // TODO: Implementar sistema que:
    // 1. Ejecute todas las operaciones
    // 2. Si alguna falla, haga rollback de las completadas
    // 3. Retorne resultado indicando éxito/fallo

    this.operaciones = operaciones;
    this.completadas = [];

    try {
      for (let i = 0; i < operaciones.length; i++) {
        const operacion = operaciones[i];
        console.log(`🔄 Ejecutando operación ${i + 1}: ${operacion.nombre}`);

        const resultado = await operacion.ejecutar();
        this.completadas.push({
          operacion: operacion,
          resultado: resultado,
          indice: i,
        });

        console.log(`✅ Operación ${i + 1} completada`);
      }

      return { exitoso: true, operacionesCompletadas: this.completadas.length };
    } catch (error) {
      console.error(`❌ Error en operación: ${error.message}`);
      console.log('🔄 Iniciando rollback...');

      await this.hacerRollback();

      throw new Error(`Transacción falló: ${error.message}`);
    }
  }

  async hacerRollback() {
    // Hacer rollback en orden inverso
    for (let i = this.completadas.length - 1; i >= 0; i--) {
      const { operacion, indice } = this.completadas[i];

      if (operacion.rollback) {
        try {
          console.log(
            `🔄 Rollback operación ${indice + 1}: ${operacion.nombre}`
          );
          await operacion.rollback();
          console.log(`✅ Rollback ${indice + 1} completado`);
        } catch (rollbackError) {
          console.error(
            `❌ Error en rollback ${indice + 1}:`,
            rollbackError.message
          );
        }
      }
    }
  }
}

// Prueba de ejercicios
console.log('\n🧪 Probando ejercicios:');

// Prueba ejercicio A
async function probarNotificaciones() {
  const sistema = new SistemaNotificaciones();

  for (let i = 1; i <= 5; i++) {
    const resultado = await sistema.enviarNotificacion(
      `Mensaje ${i}`,
      `usuario${i}`,
      ['email', 'sms', 'push']
    );

    console.log(
      `📱 Notificación ${i}:`,
      resultado.exitoso ? '✅ Enviada' : '❌ Falló'
    );
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

probarNotificaciones();

// Prueba ejercicio B
async function probarLogs() {
  const logger = new SistemaLogs();

  // Generar logs
  for (let i = 1; i <= 10; i++) {
    await logger.log('INFO', `Mensaje de log ${i}`, { usuario: `user${i}` });
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Forzar envío
  await logger.enviarLogs();
}

probarLogs();

// Prueba ejercicio C
async function probarTransacciones() {
  const manager = new TransactionManager();

  const operaciones = [
    {
      nombre: 'Crear usuario',
      ejecutar: async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return { userId: 123 };
      },
      rollback: async () => {
        await new Promise(resolve => setTimeout(resolve, 300));
        console.log('🔄 Usuario eliminado');
      },
    },
    {
      nombre: 'Crear perfil',
      ejecutar: async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        if (Math.random() < 0.5) {
          throw new Error('Error creando perfil');
        }
        return { profileId: 456 };
      },
      rollback: async () => {
        await new Promise(resolve => setTimeout(resolve, 300));
        console.log('🔄 Perfil eliminado');
      },
    },
    {
      nombre: 'Enviar bienvenida',
      ejecutar: async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return { emailSent: true };
      },
      rollback: async () => {
        console.log('🔄 Email de bienvenida cancelado');
      },
    },
  ];

  try {
    const resultado = await manager.ejecutarTransaccion(operaciones);
    console.log('✅ Transacción exitosa:', resultado);
  } catch (error) {
    console.error('❌ Transacción falló:', error.message);
  }
}

probarTransacciones();

// =============================================================================
// 6. RESUMEN Y CONCLUSIONES
// =============================================================================

setTimeout(() => {
  console.log('\n📚 Resumen del Ejercicio 4:');
  console.log('✅ Dominaste diferentes tipos de errores asíncronos');
  console.log('✅ Implementaste error propagation con contexto');
  console.log('✅ Creaste sistemas de retry y recovery');
  console.log('✅ Desarrollaste graceful degradation');
  console.log('✅ Implementaste sistemas resilientes');
  console.log('\n🎯 Conceptos dominados:');
  console.log('- Custom error classes');
  console.log('- Error propagation y contexto');
  console.log('- Retry patterns con backoff');
  console.log('- Circuit breaker avanzado');
  console.log('- Graceful degradation');
  console.log('- Sistemas resilientes y transacciones');
  console.log('\n🚀 ¡Listo para ejecución paralela!');
}, 15000);
