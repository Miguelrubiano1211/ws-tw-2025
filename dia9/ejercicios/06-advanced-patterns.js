/**
 * DÍA 9: PROMISES Y ASYNC/AWAIT
 * Ejercicio 6: Patrones Avanzados y Composición
 *
 * Objetivos:
 * - Implementar patrones avanzados de programación asíncrona
 * - Crear decoradores para funciones async
 * - Componer operaciones asíncronas complejas
 * - Desarrollar abstracciones reutilizables
 *
 * Instrucciones:
 * 1. Estudia cada patrón cuidadosamente
 * 2. Ejecuta los ejemplos paso a paso
 * 3. Modifica los parámetros para experimentar
 * 4. Implementa los retos al final
 */

// ========================================
// 1. DECORADORES ASYNC - FUNCIONALIDAD TRANSVERSAL
// ========================================

// Decorador para medir tiempo de ejecución
const medirTiempo = nombre => {
  return (target, propertyKey, descriptor) => {
    const metodoOriginal = descriptor.value;

    descriptor.value = async function (...args) {
      const inicio = Date.now();
      console.log(`⏱️  Iniciando ${nombre}...`);

      try {
        const resultado = await metodoOriginal.apply(this, args);
        const tiempo = Date.now() - inicio;
        console.log(`✅ ${nombre} completado en ${tiempo}ms`);
        return resultado;
      } catch (error) {
        const tiempo = Date.now() - inicio;
        console.log(`❌ ${nombre} falló después de ${tiempo}ms`);
        throw error;
      }
    };

    return descriptor;
  };
};

// Decorador para retry automático
const autoRetry = (maxIntentos = 3, delay = 1000) => {
  return (target, propertyKey, descriptor) => {
    const metodoOriginal = descriptor.value;

    descriptor.value = async function (...args) {
      let ultimoError;

      for (let intento = 1; intento <= maxIntentos; intento++) {
        try {
          return await metodoOriginal.apply(this, args);
        } catch (error) {
          ultimoError = error;

          if (intento < maxIntentos) {
            console.log(`⏳ Intento ${intento} falló, reintentando...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }

      throw ultimoError;
    };

    return descriptor;
  };
};

// Decorador para cache con TTL
const cacheConTTL = (ttl = 5000) => {
  const cache = new Map();

  return (target, propertyKey, descriptor) => {
    const metodoOriginal = descriptor.value;

    descriptor.value = async function (...args) {
      const clave = JSON.stringify(args);
      const entrada = cache.get(clave);

      if (entrada && Date.now() - entrada.timestamp < ttl) {
        console.log(`📦 Cache hit para ${propertyKey}`);
        return entrada.valor;
      }

      const resultado = await metodoOriginal.apply(this, args);
      cache.set(clave, {
        valor: resultado,
        timestamp: Date.now(),
      });

      console.log(`💾 Resultado cacheado para ${propertyKey}`);
      return resultado;
    };

    return descriptor;
  };
};

// Clase de ejemplo usando decoradores
class ApiClient {
  @medirTiempo('Búsqueda de usuario')
  @autoRetry(3, 1000)
  @cacheConTTL(10000)
  async buscarUsuario(id) {
    // Simular API call con posibles fallos
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (Math.random() > 0.7) {
      throw new Error('Error temporal de red');
    }

    return {
      id,
      nombre: `Usuario ${id}`,
      email: `usuario${id}@example.com`,
    };
  }
}

// ========================================
// 2. PATRÓN CIRCUIT BREAKER AVANZADO
// ========================================

class CircuitBreaker {
  constructor(threshold = 5, timeout = 60000, resetTimeout = 30000) {
    this.threshold = threshold;
    this.timeout = timeout;
    this.resetTimeout = resetTimeout;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.fallos = 0;
    this.ultimoFallo = null;
    this.estadisticas = {
      totalLlamadas: 0,
      exitosas: 0,
      fallidas: 0,
    };
  }

  async ejecutar(operacion) {
    this.estadisticas.totalLlamadas++;

    if (this.state === 'OPEN') {
      if (Date.now() - this.ultimoFallo < this.resetTimeout) {
        throw new Error('Circuit breaker OPEN - Servicio no disponible');
      }

      this.state = 'HALF_OPEN';
      console.log('🔧 Circuit breaker cambiado a HALF_OPEN');
    }

    try {
      const resultado = await operacion();

      if (this.state === 'HALF_OPEN') {
        this.state = 'CLOSED';
        this.fallos = 0;
        console.log('✅ Circuit breaker cambiado a CLOSED');
      }

      this.estadisticas.exitosas++;
      return resultado;
    } catch (error) {
      this.estadisticas.fallidas++;
      this.fallos++;
      this.ultimoFallo = Date.now();

      if (this.fallos >= this.threshold) {
        this.state = 'OPEN';
        console.log('⚠️  Circuit breaker cambiado a OPEN');
      }

      throw error;
    }
  }

  getEstadisticas() {
    return {
      ...this.estadisticas,
      state: this.state,
      fallos: this.fallos,
      tasaExito:
        this.estadisticas.totalLlamadas > 0
          ? (
              (this.estadisticas.exitosas / this.estadisticas.totalLlamadas) *
              100
            ).toFixed(2) + '%'
          : '0%',
    };
  }
}

// ========================================
// 3. PATRÓN BULKHEAD - AISLAMIENTO DE RECURSOS
// ========================================

class Bulkhead {
  constructor(nombre, limite = 5) {
    this.nombre = nombre;
    this.limite = limite;
    this.activos = 0;
    this.cola = [];
    this.estadisticas = {
      procesados: 0,
      rechazados: 0,
      tiempoEsperaProm: 0,
    };
  }

  async ejecutar(operacion) {
    if (this.activos >= this.limite) {
      this.estadisticas.rechazados++;
      throw new Error(`Bulkhead ${this.nombre} saturado`);
    }

    this.activos++;
    const inicioEspera = Date.now();

    try {
      const resultado = await operacion();

      this.estadisticas.procesados++;
      this.estadisticas.tiempoEsperaProm =
        (this.estadisticas.tiempoEsperaProm + (Date.now() - inicioEspera)) / 2;

      return resultado;
    } finally {
      this.activos--;
    }
  }

  getEstadisticas() {
    return {
      nombre: this.nombre,
      activos: this.activos,
      ...this.estadisticas,
    };
  }
}

// ========================================
// 4. PATRÓN SAGA - TRANSACCIONES DISTRIBUIDAS
// ========================================

class Saga {
  constructor() {
    this.pasos = [];
    this.compensaciones = [];
    this.ejecutados = [];
  }

  agregarPaso(ejecutar, compensar) {
    this.pasos.push(ejecutar);
    this.compensaciones.push(compensar);
    return this;
  }

  async ejecutar() {
    console.log('🔄 Iniciando saga...');

    try {
      // Ejecutar pasos secuencialmente
      for (let i = 0; i < this.pasos.length; i++) {
        console.log(`📋 Ejecutando paso ${i + 1}...`);
        const resultado = await this.pasos[i]();
        this.ejecutados.push(resultado);
        console.log(`✅ Paso ${i + 1} completado`);
      }

      console.log('✅ Saga completada exitosamente');
      return this.ejecutados;
    } catch (error) {
      console.error('❌ Error en saga, iniciando compensación...');
      await this.compensar();
      throw error;
    }
  }

  async compensar() {
    // Compensar en orden inverso
    for (let i = this.ejecutados.length - 1; i >= 0; i--) {
      try {
        console.log(`🔄 Compensando paso ${i + 1}...`);
        await this.compensaciones[i](this.ejecutados[i]);
        console.log(`✅ Paso ${i + 1} compensado`);
      } catch (error) {
        console.error(`❌ Error compensando paso ${i + 1}:`, error.message);
      }
    }
  }
}

// ========================================
// 5. PATRÓN COMMAND CON ASYNC
// ========================================

class AsyncCommand {
  constructor(ejecutar, deshacer = null) {
    this.ejecutar = ejecutar;
    this.deshacer = deshacer;
    this.ejecutado = false;
    this.resultado = null;
  }

  async invoke() {
    if (this.ejecutado) {
      throw new Error('Comando ya ejecutado');
    }

    this.resultado = await this.ejecutar();
    this.ejecutado = true;
    return this.resultado;
  }

  async undo() {
    if (!this.ejecutado || !this.deshacer) {
      throw new Error('No se puede deshacer el comando');
    }

    await this.deshacer(this.resultado);
    this.ejecutado = false;
    this.resultado = null;
  }
}

class AsyncCommandManager {
  constructor() {
    this.historial = [];
    this.posicion = -1;
  }

  async ejecutar(comando) {
    const resultado = await comando.invoke();

    // Limpiar historial hacia adelante
    this.historial = this.historial.slice(0, this.posicion + 1);
    this.historial.push(comando);
    this.posicion++;

    return resultado;
  }

  async deshacer() {
    if (this.posicion < 0) {
      throw new Error('No hay comandos para deshacer');
    }

    const comando = this.historial[this.posicion];
    await comando.undo();
    this.posicion--;

    return comando;
  }

  async rehacer() {
    if (this.posicion >= this.historial.length - 1) {
      throw new Error('No hay comandos para rehacer');
    }

    this.posicion++;
    const comando = this.historial[this.posicion];
    await comando.invoke();

    return comando;
  }
}

// ========================================
// 6. PATRÓN PIPELINE ASYNC
// ========================================

class AsyncPipeline {
  constructor() {
    this.pasos = [];
  }

  agregar(paso) {
    this.pasos.push(paso);
    return this;
  }

  async ejecutar(entrada) {
    console.log('🔄 Iniciando pipeline...');
    let resultado = entrada;

    for (let i = 0; i < this.pasos.length; i++) {
      console.log(`📋 Ejecutando paso ${i + 1}...`);
      resultado = await this.pasos[i](resultado);
      console.log(`✅ Paso ${i + 1} completado`);
    }

    console.log('✅ Pipeline completado');
    return resultado;
  }

  // Ejecutar pipeline con validación entre pasos
  async ejecutarConValidacion(entrada, validador) {
    let resultado = entrada;

    for (let i = 0; i < this.pasos.length; i++) {
      resultado = await this.pasos[i](resultado);

      if (!validador(resultado)) {
        throw new Error(`Validación falló en paso ${i + 1}`);
      }
    }

    return resultado;
  }
}

// ========================================
// 7. PATRÓN OBSERVER ASYNC
// ========================================

class AsyncEventEmitter {
  constructor() {
    this.listeners = new Map();
  }

  on(evento, listener) {
    if (!this.listeners.has(evento)) {
      this.listeners.set(evento, []);
    }

    this.listeners.get(evento).push(listener);
    return this;
  }

  off(evento, listener) {
    const listeners = this.listeners.get(evento);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
    return this;
  }

  async emit(evento, datos) {
    const listeners = this.listeners.get(evento) || [];

    if (listeners.length === 0) {
      return;
    }

    console.log(
      `📢 Emitiendo evento '${evento}' a ${listeners.length} listeners`
    );

    // Ejecutar listeners en paralelo
    const resultados = await Promise.allSettled(
      listeners.map(listener => listener(datos))
    );

    // Reportar fallos
    resultados.forEach((resultado, index) => {
      if (resultado.status === 'rejected') {
        console.error(`❌ Error en listener ${index + 1}:`, resultado.reason);
      }
    });

    return resultados;
  }
}

// ========================================
// EJEMPLOS DE USO
// ========================================

const ejemploDecoradoresAsync = async () => {
  console.log('=== DECORADORES ASYNC ===');

  const client = new ApiClient();

  // Primera llamada - miss en cache
  await client.buscarUsuario(1);

  // Segunda llamada - hit en cache
  await client.buscarUsuario(1);

  // Diferente ID - miss en cache
  await client.buscarUsuario(2);
};

const ejemploCircuitBreaker = async () => {
  console.log('\n=== CIRCUIT BREAKER ===');

  const breaker = new CircuitBreaker(3, 60000, 5000);

  // API inestable para demostración
  const apiInestable = () => {
    return new Promise((resolve, reject) => {
      if (Math.random() > 0.4) {
        reject(new Error('API falló'));
      } else {
        resolve('API funcionando');
      }
    });
  };

  // Realizar múltiples llamadas
  for (let i = 0; i < 10; i++) {
    try {
      const resultado = await breaker.ejecutar(apiInestable);
      console.log(`✅ Llamada ${i + 1}: ${resultado}`);
    } catch (error) {
      console.log(`❌ Llamada ${i + 1}: ${error.message}`);
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('📊 Estadísticas:', breaker.getEstadisticas());
};

const ejemploSaga = async () => {
  console.log('\n=== SAGA PATTERN ===');

  const saga = new Saga();

  // Simular transacciones distribuidas
  saga
    .agregarPaso(
      async () => {
        console.log('💳 Reservando fondos...');
        await new Promise(resolve => setTimeout(resolve, 500));
        return { transaccionId: 'tx001', monto: 100 };
      },
      async resultado => {
        console.log(`💸 Liberando fondos ${resultado.transaccionId}...`);
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    )
    .agregarPaso(
      async () => {
        console.log('📦 Reservando inventario...');
        await new Promise(resolve => setTimeout(resolve, 700));

        // Simular fallo ocasional
        if (Math.random() > 0.7) {
          throw new Error('Producto agotado');
        }

        return { inventarioId: 'inv001', cantidad: 1 };
      },
      async resultado => {
        console.log(`📦 Liberando inventario ${resultado.inventarioId}...`);
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    )
    .agregarPaso(
      async () => {
        console.log('🚚 Creando envío...');
        await new Promise(resolve => setTimeout(resolve, 400));
        return { envioId: 'env001', estado: 'programado' };
      },
      async resultado => {
        console.log(`🚚 Cancelando envío ${resultado.envioId}...`);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    );

  try {
    const resultados = await saga.ejecutar();
    console.log('✅ Transacción completada:', resultados);
  } catch (error) {
    console.error('❌ Transacción falló:', error.message);
  }
};

const ejemploPipeline = async () => {
  console.log('\n=== ASYNC PIPELINE ===');

  const pipeline = new AsyncPipeline();

  pipeline
    .agregar(async datos => {
      console.log('  📝 Validando datos...');
      await new Promise(resolve => setTimeout(resolve, 200));
      return { ...datos, validado: true };
    })
    .agregar(async datos => {
      console.log('  🔄 Transformando datos...');
      await new Promise(resolve => setTimeout(resolve, 300));
      return { ...datos, procesado: new Date().toISOString() };
    })
    .agregar(async datos => {
      console.log('  💾 Guardando en base de datos...');
      await new Promise(resolve => setTimeout(resolve, 400));
      return { ...datos, id: Math.random().toString(36) };
    })
    .agregar(async datos => {
      console.log('  📧 Enviando notificación...');
      await new Promise(resolve => setTimeout(resolve, 200));
      return { ...datos, notificado: true };
    });

  const entrada = { nombre: 'Juan', email: 'juan@example.com' };
  const resultado = await pipeline.ejecutar(entrada);

  console.log('📊 Resultado final:', resultado);
};

const ejemploAsyncObserver = async () => {
  console.log('\n=== ASYNC OBSERVER ===');

  const eventEmitter = new AsyncEventEmitter();

  // Registrar listeners
  eventEmitter.on('usuarioCreado', async datos => {
    console.log('  📧 Enviando email de bienvenida...');
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`  ✅ Email enviado a ${datos.email}`);
  });

  eventEmitter.on('usuarioCreado', async datos => {
    console.log('  📊 Actualizando estadísticas...');
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log('  ✅ Estadísticas actualizadas');
  });

  eventEmitter.on('usuarioCreado', async datos => {
    console.log('  🎁 Creando promoción de bienvenida...');
    await new Promise(resolve => setTimeout(resolve, 400));
    console.log('  ✅ Promoción creada');
  });

  // Emitir evento
  await eventEmitter.emit('usuarioCreado', {
    id: 1,
    nombre: 'Juan',
    email: 'juan@example.com',
  });
};

// ========================================
// FUNCIÓN PRINCIPAL
// ========================================

const ejecutarEjemplos = async () => {
  console.log('🚀 EJERCICIO 6: PATRONES AVANZADOS Y COMPOSICIÓN\n');

  try {
    await ejemploDecoradoresAsync();
    await ejemploCircuitBreaker();
    await ejemploSaga();
    await ejemploPipeline();
    await ejemploAsyncObserver();
  } catch (error) {
    console.error('❌ Error en ejemplos:', error);
  }
};

// ========================================
// RETOS AVANZADOS
// ========================================

console.log(`
🎯 RETOS AVANZADOS:

1. **Sistema de Microservicios**
   - Implementa un coordinador que maneje múltiples servicios
   - Usa circuit breakers para cada servicio
   - Implementa bulkheads para aislar recursos
   - Maneja fallos en cascada

2. **Sistema de Workflow**
   - Crea un motor de workflows usando sagas
   - Implementa pasos condicionales
   - Maneja rollbacks complejos
   - Persiste el estado del workflow

3. **Sistema de Comandos Distribuidos**
   - Implementa un sistema de comandos con undo/redo
   - Maneja comandos que afectan múltiples servicios
   - Implementa snapshots para rollbacks rápidos
   - Maneja conflictos concurrentes

4. **Event Sourcing Async**
   - Implementa un sistema de event sourcing
   - Maneja projections asíncronas
   - Implementa snapshots para optimización
   - Maneja eventos out-of-order

5. **Sistema de Rate Limiting Distribuido**
   - Implementa rate limiting con sliding window
   - Maneja múltiples ventanas de tiempo
   - Implementa backpressure
   - Maneja burst traffic

6. **Sistema de Caching Multinivel**
   - Implementa L1, L2, L3 cache
   - Maneja invalidación en cascada
   - Implementa write-through y write-behind
   - Maneja consistency

7. **Sistema de Retry Inteligente**
   - Implementa retry con jitter
   - Maneja diferentes tipos de errores
   - Implementa circuit breakers por error type
   - Maneja rate limiting del servidor

8. **Sistema de Monitoreo Distribuido**
   - Implementa health checks distribuidos
   - Maneja métricas en tiempo real
   - Implementa alertas inteligentes
   - Maneja dashboards dinámicos

💡 CONCEPTOS CLAVE PARA DOMINAR:
- Composición de patrones asincrónicos
- Manejo de estados complejos
- Tolerancia a fallos distribuidos
- Optimización de performance
- Observabilidad y debugging
- Escalabilidad horizontal
- Consistency patterns
- Error boundaries

🏆 TIPS PARA WORLDSKILLS:
- Practica implementación rápida de patrones
- Memoriza estructuras de código comunes
- Domina debugging de código asíncrono
- Entiende trade-offs de cada patrón
- Practica error handling robusto
- Implementa logging detallado
- Considera performance desde el inicio
- Documenta decisiones arquitectónicas
`);

// Ejecutar ejemplos si es llamado directamente
if (require.main === module) {
  ejecutarEjemplos();
}

// Exportar para uso en otros módulos
module.exports = {
  CircuitBreaker,
  Bulkhead,
  Saga,
  AsyncCommand,
  AsyncCommandManager,
  AsyncPipeline,
  AsyncEventEmitter,
};
