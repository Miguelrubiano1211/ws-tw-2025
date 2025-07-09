/**
 * DÍA 9: PROMISES Y ASYNC/AWAIT
 * Ejercicio 5: Ejecución Paralela y Optimización
 *
 * Objetivos:
 * - Dominar Promise.all, Promise.allSettled, Promise.race
 * - Optimizar operaciones paralelas
 * - Implementar control de concurrencia
 * - Manejar timeouts y cancelaciones
 *
 * Instrucciones:
 * 1. Ejecuta cada ejercicio paso a paso
 * 2. Observa los tiempos de ejecución
 * 3. Experimenta con diferentes enfoques
 * 4. Completa los retos al final
 */

// ========================================
// 1. PROMISE.ALL - EJECUCIÓN PARALELA
// ========================================

// Simulador de API con diferentes tiempos de respuesta
const simularApiCall = (endpoint, delay) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.9) {
        reject(new Error(`Error en ${endpoint}`));
      } else {
        resolve({
          endpoint,
          data: `Datos de ${endpoint}`,
          timestamp: new Date().toISOString(),
        });
      }
    }, delay);
  });
};

// Ejemplo básico de Promise.all
const ejemploPromiseAll = async () => {
  console.log('=== PROMISE.ALL BÁSICO ===');

  const startTime = Date.now();

  try {
    // Ejecución paralela - todas las promesas se ejecutan simultáneamente
    const resultados = await Promise.all([
      simularApiCall('usuarios', 1000),
      simularApiCall('productos', 1500),
      simularApiCall('pedidos', 800),
    ]);

    const endTime = Date.now();
    console.log(`✅ Todas las APIs respondieron en ${endTime - startTime}ms`);
    console.log('Resultados:', resultados);
  } catch (error) {
    console.error('❌ Error en Promise.all:', error.message);
  }
};

// Comparación: secuencial vs paralelo
const compararEjecucion = async () => {
  console.log('\n=== COMPARACIÓN: SECUENCIAL VS PARALELO ===');

  // Ejecución secuencial
  console.log('🔄 Ejecución secuencial...');
  const startSequential = Date.now();

  try {
    const usuario = await simularApiCall('usuarios', 1000);
    const producto = await simularApiCall('productos', 1500);
    const pedido = await simularApiCall('pedidos', 800);

    const endSequential = Date.now();
    console.log(`⏱️  Secuencial: ${endSequential - startSequential}ms`);
  } catch (error) {
    console.error('❌ Error secuencial:', error.message);
  }

  // Ejecución paralela
  console.log('🔄 Ejecución paralela...');
  const startParallel = Date.now();

  try {
    const [usuario, producto, pedido] = await Promise.all([
      simularApiCall('usuarios', 1000),
      simularApiCall('productos', 1500),
      simularApiCall('pedidos', 800),
    ]);

    const endParallel = Date.now();
    console.log(`⚡ Paralelo: ${endParallel - startParallel}ms`);
  } catch (error) {
    console.error('❌ Error paralelo:', error.message);
  }
};

// ========================================
// 2. PROMISE.ALLSETTLED - MANEJO RESILIENTE
// ========================================

const ejemploPromiseAllSettled = async () => {
  console.log('\n=== PROMISE.ALLSETTLED ===');

  // Promise.allSettled nunca falla, siempre retorna resultados
  const resultados = await Promise.allSettled([
    simularApiCall('usuarios', 500),
    simularApiCall('productos', 800),
    Promise.reject(new Error('API de comentarios caída')),
    simularApiCall('categorias', 600),
  ]);

  console.log('📊 Resultados de Promise.allSettled:');
  resultados.forEach((resultado, index) => {
    if (resultado.status === 'fulfilled') {
      console.log(`✅ Promesa ${index}: ${resultado.value.endpoint}`);
    } else {
      console.log(`❌ Promesa ${index}: ${resultado.reason.message}`);
    }
  });

  // Filtrar solo los exitosos
  const exitosos = resultados
    .filter(result => result.status === 'fulfilled')
    .map(result => result.value);

  console.log(`✅ ${exitosos.length} APIs respondieron correctamente`);
};

// ========================================
// 3. PROMISE.RACE - PRIMERA RESPUESTA
// ========================================

const ejemploPromiseRace = async () => {
  console.log('\n=== PROMISE.RACE ===');

  try {
    // Promise.race retorna el primer resultado (exitoso o fallo)
    const ganador = await Promise.race([
      simularApiCall('servidor-1', 1200),
      simularApiCall('servidor-2', 800),
      simularApiCall('servidor-3', 1000),
    ]);

    console.log('🏆 Ganador de la carrera:', ganador);
  } catch (error) {
    console.error('❌ El más rápido falló:', error.message);
  }
};

// Timeout con Promise.race
const conTimeout = async (promesa, tiempoLimite) => {
  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Timeout')), tiempoLimite);
  });

  return Promise.race([promesa, timeout]);
};

const ejemploTimeout = async () => {
  console.log('\n=== TIMEOUT CON PROMISE.RACE ===');

  try {
    const resultado = await conTimeout(
      simularApiCall('api-lenta', 3000),
      2000 // Timeout de 2 segundos
    );

    console.log('✅ Respuesta a tiempo:', resultado);
  } catch (error) {
    console.error('⏰ Error:', error.message);
  }
};

// ========================================
// 4. CONTROL DE CONCURRENCIA
// ========================================

class ControlConcurrencia {
  constructor(limite = 3) {
    this.limite = limite;
    this.enEjecucion = 0;
    this.cola = [];
  }

  async ejecutar(promesaFn) {
    return new Promise((resolve, reject) => {
      this.cola.push({ promesaFn, resolve, reject });
      this.procesarCola();
    });
  }

  async procesarCola() {
    if (this.enEjecucion >= this.limite || this.cola.length === 0) {
      return;
    }

    this.enEjecucion++;
    const { promesaFn, resolve, reject } = this.cola.shift();

    try {
      const resultado = await promesaFn();
      resolve(resultado);
    } catch (error) {
      reject(error);
    } finally {
      this.enEjecucion--;
      this.procesarCola();
    }
  }
}

const ejemploControlConcurrencia = async () => {
  console.log('\n=== CONTROL DE CONCURRENCIA ===');

  const controlador = new ControlConcurrencia(2); // Máximo 2 simultáneas

  const tareas = Array.from(
    { length: 6 },
    (_, i) => () => simularApiCall(`tarea-${i + 1}`, 1000)
  );

  console.log('🔄 Ejecutando 6 tareas con máximo 2 simultáneas...');
  const startTime = Date.now();

  try {
    const promesasControladas = tareas.map(tarea =>
      controlador.ejecutar(tarea)
    );

    const resultados = await Promise.all(promesasControladas);

    const endTime = Date.now();
    console.log(`✅ Todas las tareas completadas en ${endTime - startTime}ms`);
    console.log(`📊 Resultados: ${resultados.length} tareas exitosas`);
  } catch (error) {
    console.error('❌ Error en control de concurrencia:', error.message);
  }
};

// ========================================
// 5. BATCH PROCESSING - PROCESAMIENTO EN LOTES
// ========================================

const procesarEnLotes = async (items, procesarItem, tamañoLote = 3) => {
  console.log(`\n=== PROCESAMIENTO EN LOTES (${tamañoLote} por lote) ===`);

  const resultados = [];

  for (let i = 0; i < items.length; i += tamañoLote) {
    const lote = items.slice(i, i + tamañoLote);

    console.log(`🔄 Procesando lote ${Math.floor(i / tamañoLote) + 1}...`);

    try {
      const resultadosLote = await Promise.all(
        lote.map(item => procesarItem(item))
      );

      resultados.push(...resultadosLote);
      console.log(`✅ Lote completado: ${resultadosLote.length} items`);
    } catch (error) {
      console.error(`❌ Error en lote: ${error.message}`);
    }
  }

  return resultados;
};

const ejemploBatchProcessing = async () => {
  const items = Array.from({ length: 10 }, (_, i) => `item-${i + 1}`);

  const procesarItem = async item => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return `Procesado: ${item}`;
  };

  const resultados = await procesarEnLotes(items, procesarItem, 3);
  console.log(`📊 Total procesado: ${resultados.length} items`);
};

// ========================================
// 6. PATRÓN RETRY CON BACKOFF EXPONENCIAL
// ========================================

const retryConBackoff = async (promesaFn, maxIntentos = 3) => {
  for (let intento = 1; intento <= maxIntentos; intento++) {
    try {
      return await promesaFn();
    } catch (error) {
      if (intento === maxIntentos) {
        throw error;
      }

      const delay = Math.pow(2, intento - 1) * 1000; // Backoff exponencial
      console.log(`⏳ Intento ${intento} falló, reintentando en ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

const ejemploRetryBackoff = async () => {
  console.log('\n=== RETRY CON BACKOFF EXPONENCIAL ===');

  const apiInestable = () => {
    return new Promise((resolve, reject) => {
      if (Math.random() > 0.6) {
        resolve('✅ API respondió correctamente');
      } else {
        reject(new Error('API temporalmente no disponible'));
      }
    });
  };

  try {
    const resultado = await retryConBackoff(apiInestable, 3);
    console.log(resultado);
  } catch (error) {
    console.error('❌ Falló después de todos los intentos:', error.message);
  }
};

// ========================================
// 7. PROMISE POOL - POOL DE PROMESAS
// ========================================

class PromisePool {
  constructor(concurrencia = 3) {
    this.concurrencia = concurrencia;
    this.activas = 0;
    this.cola = [];
    this.resultados = [];
  }

  async agregar(promesaFn) {
    return new Promise((resolve, reject) => {
      this.cola.push({ promesaFn, resolve, reject });
      this.procesar();
    });
  }

  async procesar() {
    if (this.activas >= this.concurrencia || this.cola.length === 0) {
      return;
    }

    this.activas++;
    const { promesaFn, resolve, reject } = this.cola.shift();

    try {
      const resultado = await promesaFn();
      this.resultados.push(resultado);
      resolve(resultado);
    } catch (error) {
      reject(error);
    } finally {
      this.activas--;
      this.procesar();
    }
  }

  async ejecutarTodas(promesasFn) {
    const promesas = promesasFn.map(fn => this.agregar(fn));
    return Promise.all(promesas);
  }
}

const ejemploPromisePool = async () => {
  console.log('\n=== PROMISE POOL ===');

  const pool = new PromisePool(2);

  const tareas = Array.from(
    { length: 5 },
    (_, i) => () => simularApiCall(`pool-tarea-${i + 1}`, 1000)
  );

  console.log('🔄 Ejecutando 5 tareas con pool de 2...');
  const startTime = Date.now();

  try {
    const resultados = await pool.ejecutarTodas(tareas);

    const endTime = Date.now();
    console.log(`✅ Pool completado en ${endTime - startTime}ms`);
    console.log(`📊 Resultados: ${resultados.length} tareas exitosas`);
  } catch (error) {
    console.error('❌ Error en promise pool:', error.message);
  }
};

// ========================================
// FUNCIÓN PRINCIPAL
// ========================================

const ejecutarEjemplos = async () => {
  console.log('🚀 EJERCICIO 5: EJECUCIÓN PARALELA Y OPTIMIZACIÓN\n');

  try {
    await ejemploPromiseAll();
    await compararEjecucion();
    await ejemploPromiseAllSettled();
    await ejemploPromiseRace();
    await ejemploTimeout();
    await ejemploControlConcurrencia();
    await ejemploBatchProcessing();
    await ejemploRetryBackoff();
    await ejemploPromisePool();
  } catch (error) {
    console.error('❌ Error en ejemplos:', error);
  }
};

// ========================================
// RETOS PRÁCTICOS
// ========================================

console.log(`
🎯 RETOS PARA PRACTICAR:

1. **Sistema de Monitoreo**
   - Crea un sistema que monitoree 5 APIs diferentes
   - Usa Promise.allSettled para obtener el estado de todas
   - Implementa alertas para APIs que fallen

2. **Descarga de Archivos Paralela**
   - Simula la descarga de 10 archivos
   - Limita a máximo 3 descargas simultáneas
   - Muestra progreso en tiempo real

3. **Cache con Timeout**
   - Implementa un sistema de cache que expire después de 5 segundos
   - Usa Promise.race para manejar timeouts
   - Actualiza automáticamente datos expirados

4. **Procesador de Imágenes**
   - Simula el procesamiento de 20 imágenes
   - Procesa en lotes de 4 imágenes
   - Implementa reintentos para fallos temporales

5. **Load Balancer Simulado**
   - Crea 3 servidores simulados con diferentes latencias
   - Usa Promise.race para obtener la respuesta más rápida
   - Implementa fallback a otros servidores si el primero falla

6. **Sistema de Notificaciones**
   - Envía notificaciones a múltiples canales (email, SMS, push)
   - Usa Promise.allSettled para manejar fallos individuales
   - Implementa reintentos con backoff exponencial

7. **Agregador de Datos**
   - Obtén datos de 5 APIs diferentes
   - Combina y transforma los resultados
   - Maneja diferentes tiempos de respuesta

8. **Worker Pool Avanzado**
   - Crea un pool de workers que procese tareas
   - Implementa prioridades para las tareas
   - Maneja fallos y redistribución de trabajo

💡 TIPS PARA LOS RETOS:
- Usa console.time() y console.timeEnd() para medir performance
- Implementa logs detallados para debugging
- Prueba con diferentes números de concurrencia
- Simula condiciones de red reales (latencia, fallos)
- Considera el uso de memory para optimizar rendimiento
`);

// Ejecutar ejemplos si es llamado directamente
if (require.main === module) {
  ejecutarEjemplos();
}

// Exportar para uso en otros módulos
module.exports = {
  simularApiCall,
  ControlConcurrencia,
  procesarEnLotes,
  retryConBackoff,
  PromisePool,
};
