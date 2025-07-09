/**
 * ⚡ Ejercicio 3: Async/Await
 *
 * Objetivo: Dominar la sintaxis async/await y conversión de promesas
 * Conceptos: async functions, await keyword, try/catch, conversión de promises
 *
 * Instrucciones:
 * 1. Estudia la conversión de promises a async/await
 * 2. Practica con diferentes patrones de async/await
 * 3. Completa los ejercicios de conversión
 */

console.log('⚡ Ejercicio 3: Async/Await');

// =============================================================================
// 1. SINTAXIS BÁSICA ASYNC/AWAIT
// =============================================================================

// Funciones helper de los ejercicios anteriores
function obtenerUsuario(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const usuarios = {
        1: { id: 1, nombre: 'Juan', email: 'juan@ejemplo.com' },
        2: { id: 2, nombre: 'María', email: 'maria@ejemplo.com' },
        3: { id: 3, nombre: 'Pedro', email: 'pedro@ejemplo.com' },
      };

      const usuario = usuarios[id];
      if (usuario) {
        resolve(usuario);
      } else {
        reject(new Error(`Usuario ${id} no encontrado`));
      }
    }, 500);
  });
}

function obtenerPosts(userId) {
  return new Promise(resolve => {
    setTimeout(() => {
      const posts = {
        1: [{ id: 1, titulo: 'Post 1', contenido: 'Contenido 1' }],
        2: [{ id: 2, titulo: 'Post 2', contenido: 'Contenido 2' }],
        3: [{ id: 3, titulo: 'Post 3', contenido: 'Contenido 3' }],
      };
      resolve(posts[userId] || []);
    }, 700);
  });
}

// Función tradicional con promises
function obtenerDatosUsuarioPromises(id) {
  return obtenerUsuario(id)
    .then(usuario => {
      console.log('📄 Usuario obtenido:', usuario.nombre);
      return obtenerPosts(usuario.id);
    })
    .then(posts => {
      console.log('📄 Posts obtenidos:', posts.length);
      return { usuario, posts };
    })
    .catch(error => {
      console.error('❌ Error:', error.message);
      throw error;
    });
}

// Misma función con async/await
async function obtenerDatosUsuarioAsync(id) {
  try {
    const usuario = await obtenerUsuario(id);
    console.log('⚡ Usuario obtenido:', usuario.nombre);

    const posts = await obtenerPosts(usuario.id);
    console.log('⚡ Posts obtenidos:', posts.length);

    return { usuario, posts };
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

// Ejemplo de uso
console.log('\n📝 Ejemplo 1: Sintaxis básica');

// Usando promises
obtenerDatosUsuarioPromises(1)
  .then(resultado => {
    console.log('✅ Resultado con promises:', resultado);
  })
  .catch(error => {
    console.error('❌ Error con promises:', error.message);
  });

// Usando async/await
(async () => {
  try {
    const resultado = await obtenerDatosUsuarioAsync(1);
    console.log('✅ Resultado con async/await:', resultado);
  } catch (error) {
    console.error('❌ Error con async/await:', error.message);
  }
})();

// =============================================================================
// 2. MANEJO DE ERRORES CON TRY/CATCH
// =============================================================================

/**
 * Función que puede fallar aleatoriamente
 */
function operacionInestable(nombre) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.3) {
        resolve(`✅ ${nombre} completada`);
      } else {
        reject(new Error(`❌ ${nombre} falló`));
      }
    }, 500);
  });
}

// Manejo de errores con promises
function manejarErroresPromises() {
  return operacionInestable('Operación A')
    .then(resultado => {
      console.log('📄 Resultado A:', resultado);
      return operacionInestable('Operación B');
    })
    .then(resultado => {
      console.log('📄 Resultado B:', resultado);
      return operacionInestable('Operación C');
    })
    .then(resultado => {
      console.log('📄 Resultado C:', resultado);
      return 'Todas las operaciones completadas';
    })
    .catch(error => {
      console.error('📄 Error en cadena:', error.message);
      throw error;
    });
}

// Manejo de errores con async/await
async function manejarErroresAsync() {
  try {
    const resultadoA = await operacionInestable('Operación A');
    console.log('⚡ Resultado A:', resultadoA);

    const resultadoB = await operacionInestable('Operación B');
    console.log('⚡ Resultado B:', resultadoB);

    const resultadoC = await operacionInestable('Operación C');
    console.log('⚡ Resultado C:', resultadoC);

    return 'Todas las operaciones completadas';
  } catch (error) {
    console.error('⚡ Error en async/await:', error.message);
    throw error;
  }
}

// Ejemplo de uso
console.log('\n📝 Ejemplo 2: Manejo de errores');

// Con promises
manejarErroresPromises()
  .then(resultado => {
    console.log('✅ Éxito con promises:', resultado);
  })
  .catch(error => {
    console.error('❌ Error final con promises:', error.message);
  });

// Con async/await
(async () => {
  try {
    const resultado = await manejarErroresAsync();
    console.log('✅ Éxito con async/await:', resultado);
  } catch (error) {
    console.error('❌ Error final con async/await:', error.message);
  }
})();

// =============================================================================
// 3. EJECUCIÓN PARALELA CON ASYNC/AWAIT
// =============================================================================

// ❌ Ejecución secuencial (lenta)
async function ejecucionSecuencial() {
  console.log('🐌 Iniciando ejecución secuencial...');
  const inicio = Date.now();

  const usuario1 = await obtenerUsuario(1);
  const usuario2 = await obtenerUsuario(2);
  const usuario3 = await obtenerUsuario(3);

  const fin = Date.now();
  console.log(`🐌 Ejecución secuencial completada en ${fin - inicio}ms`);

  return [usuario1, usuario2, usuario3];
}

// ✅ Ejecución paralela (rápida)
async function ejecucionParalela() {
  console.log('🚀 Iniciando ejecución paralela...');
  const inicio = Date.now();

  const [usuario1, usuario2, usuario3] = await Promise.all([
    obtenerUsuario(1),
    obtenerUsuario(2),
    obtenerUsuario(3),
  ]);

  const fin = Date.now();
  console.log(`🚀 Ejecución paralela completada en ${fin - inicio}ms`);

  return [usuario1, usuario2, usuario3];
}

// Ejemplo de uso
console.log('\n📝 Ejemplo 3: Ejecución paralela');

// Comparar tiempos
(async () => {
  console.log('⏱️ Comparando tiempos de ejecución:');

  await ejecucionSecuencial();
  await ejecucionParalela();
})();

// =============================================================================
// 4. ASYNC/AWAIT CON LOOPS
// =============================================================================

const userIds = [1, 2, 3];

// Procesamiento secuencial con for...of
async function procesarUsuariosSecuencial(ids) {
  console.log('🔄 Procesando usuarios secuencialmente:');
  const resultados = [];

  for (const id of ids) {
    try {
      const usuario = await obtenerUsuario(id);
      const posts = await obtenerPosts(id);

      resultados.push({
        usuario,
        posts,
        totalPosts: posts.length,
      });

      console.log(`✅ Usuario ${id} procesado`);
    } catch (error) {
      console.error(`❌ Error procesando usuario ${id}:`, error.message);
    }
  }

  return resultados;
}

// Procesamiento paralelo con Promise.all
async function procesarUsuariosParalelo(ids) {
  console.log('🚀 Procesando usuarios en paralelo:');

  const promesas = ids.map(async id => {
    try {
      const usuario = await obtenerUsuario(id);
      const posts = await obtenerPosts(id);

      console.log(`✅ Usuario ${id} procesado`);

      return {
        usuario,
        posts,
        totalPosts: posts.length,
      };
    } catch (error) {
      console.error(`❌ Error procesando usuario ${id}:`, error.message);
      return null;
    }
  });

  const resultados = await Promise.all(promesas);
  return resultados.filter(resultado => resultado !== null);
}

// Ejemplo de uso
console.log('\n📝 Ejemplo 4: Async/await con loops');

(async () => {
  console.log('⏱️ Comparando procesamiento:');

  const inicioSecuencial = Date.now();
  const resultadosSecuencial = await procesarUsuariosSecuencial(userIds);
  const finSecuencial = Date.now();

  const inicioParalelo = Date.now();
  const resultadosParalelo = await procesarUsuariosParalelo(userIds);
  const finParalelo = Date.now();

  console.log(`🐌 Secuencial: ${finSecuencial - inicioSecuencial}ms`);
  console.log(`🚀 Paralelo: ${finParalelo - inicioParalelo}ms`);
  console.log(
    `📊 Resultados: ${resultadosSecuencial.length} vs ${resultadosParalelo.length}`
  );
})();

// =============================================================================
// 5. FINALLY CON ASYNC/AWAIT
// =============================================================================

/**
 * Simula conexión a base de datos
 */
async function conectarBaseDatos() {
  console.log('🔌 Conectando a la base de datos...');
  await new Promise(resolve => setTimeout(resolve, 500));
  return { conectado: true, id: Math.random() };
}

/**
 * Simula operación en base de datos
 */
async function operacionBaseDatos(conexion) {
  console.log('💾 Realizando operación en BD...');
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (Math.random() > 0.3) {
    return { resultado: 'Operación exitosa', datos: [1, 2, 3] };
  } else {
    throw new Error('Error en la operación de BD');
  }
}

/**
 * Simula cerrar conexión
 */
async function cerrarConexion(conexion) {
  console.log('🔒 Cerrando conexión a BD...');
  await new Promise(resolve => setTimeout(resolve, 200));
  console.log('✅ Conexión cerrada');
}

// Ejemplo con finally
async function operacionCompletaConFinally() {
  let conexion;

  try {
    conexion = await conectarBaseDatos();
    console.log('✅ Conexión establecida');

    const resultado = await operacionBaseDatos(conexion);
    console.log('✅ Operación completada:', resultado);

    return resultado;
  } catch (error) {
    console.error('❌ Error en operación:', error.message);
    throw error;
  } finally {
    if (conexion) {
      await cerrarConexion(conexion);
    }
  }
}

// Ejemplo de uso
console.log('\n📝 Ejemplo 5: Finally con async/await');

(async () => {
  try {
    const resultado = await operacionCompletaConFinally();
    console.log('🎉 Operación final exitosa:', resultado);
  } catch (error) {
    console.error('💥 Error final:', error.message);
  }
})();

// =============================================================================
// 6. EJERCICIOS DE CONVERSIÓN
// =============================================================================

console.log('\n🎯 Ejercicios de conversión de promises a async/await:');

// EJERCICIO A: Convierte esta función de promises a async/await
function cadenaPromises(userId) {
  return obtenerUsuario(userId)
    .then(usuario => {
      return obtenerPosts(usuario.id)
        .then(posts => {
          return Promise.all(
            posts.map(
              post =>
                new Promise(resolve => {
                  setTimeout(() => {
                    resolve({ ...post, procesado: true });
                  }, 200);
                })
            )
          );
        })
        .then(postsProcessados => {
          return {
            usuario: usuario,
            posts: postsProcessados,
            resumen: {
              totalPosts: postsProcessados.length,
              usuario: usuario.nombre,
              procesadoEn: new Date().toISOString(),
            },
          };
        });
    })
    .catch(error => {
      console.error('Error en cadena:', error.message);
      throw error;
    });
}

// TODO: Convierte cadenaPromises a async/await
async function cadenaAsyncAwait(userId) {
  try {
    const usuario = await obtenerUsuario(userId);
    const posts = await obtenerPosts(usuario.id);

    const promesasProcesamiento = posts.map(
      post =>
        new Promise(resolve => {
          setTimeout(() => {
            resolve({ ...post, procesado: true });
          }, 200);
        })
    );

    const postsProcessados = await Promise.all(promesasProcesamiento);

    return {
      usuario: usuario,
      posts: postsProcessados,
      resumen: {
        totalPosts: postsProcessados.length,
        usuario: usuario.nombre,
        procesadoEn: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error('Error en cadena:', error.message);
    throw error;
  }
}

// EJERCICIO B: Convierte este sistema de retry a async/await
function retryPromises(operacion, maxIntentos = 3) {
  return new Promise((resolve, reject) => {
    let intentos = 0;

    function intentar() {
      intentos++;

      operacion()
        .then(resultado => {
          resolve(resultado);
        })
        .catch(error => {
          if (intentos < maxIntentos) {
            console.log(`Reintentando... (${intentos}/${maxIntentos})`);
            setTimeout(intentar, 1000);
          } else {
            reject(error);
          }
        });
    }

    intentar();
  });
}

// TODO: Convierte retryPromises a async/await
async function retryAsyncAwait(operacion, maxIntentos = 3) {
  let ultimoError;

  for (let intento = 1; intento <= maxIntentos; intento++) {
    try {
      const resultado = await operacion();
      return resultado;
    } catch (error) {
      ultimoError = error;
      console.log(`Reintentando... (${intento}/${maxIntentos})`);

      if (intento < maxIntentos) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  throw ultimoError;
}

// EJERCICIO C: Convierte este sistema de cache a async/await
function cachePromises(key, factory, ttl = 60000) {
  const cache = cachePromises.cache || (cachePromises.cache = new Map());

  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < ttl) {
    return Promise.resolve(cached.value);
  }

  return factory()
    .then(value => {
      cache.set(key, {
        value: value,
        timestamp: Date.now(),
      });
      return value;
    })
    .catch(error => {
      console.error('Error en cache:', error.message);
      throw error;
    });
}

// TODO: Convierte cachePromises a async/await
async function cacheAsyncAwait(key, factory, ttl = 60000) {
  const cache = cacheAsyncAwait.cache || (cacheAsyncAwait.cache = new Map());

  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.value;
  }

  try {
    const value = await factory();
    cache.set(key, {
      value: value,
      timestamp: Date.now(),
    });
    return value;
  } catch (error) {
    console.error('Error en cache:', error.message);
    throw error;
  }
}

// Prueba de conversiones
console.log('\n🧪 Probando conversiones:');

// Prueba ejercicio A
(async () => {
  try {
    const resultadoPromises = await cadenaPromises(1);
    console.log('✅ Cadena promises:', resultadoPromises.resumen);

    const resultadoAsync = await cadenaAsyncAwait(1);
    console.log('✅ Cadena async/await:', resultadoAsync.resumen);
  } catch (error) {
    console.error('❌ Error en conversión A:', error.message);
  }
})();

// Prueba ejercicio B
const operacionFallaAleatoria = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.7) {
        resolve('¡Éxito!');
      } else {
        reject(new Error('Operación falló'));
      }
    }, 300);
  });
};

(async () => {
  try {
    const resultadoPromises = await retryPromises(operacionFallaAleatoria, 3);
    console.log('✅ Retry promises:', resultadoPromises);
  } catch (error) {
    console.error('❌ Error retry promises:', error.message);
  }

  try {
    const resultadoAsync = await retryAsyncAwait(operacionFallaAleatoria, 3);
    console.log('✅ Retry async/await:', resultadoAsync);
  } catch (error) {
    console.error('❌ Error retry async/await:', error.message);
  }
})();

// =============================================================================
// 7. PATRONES AVANZADOS CON ASYNC/AWAIT
// =============================================================================

// Patrón: Async Iterator
async function* generadorUsuarios(userIds) {
  for (const id of userIds) {
    try {
      const usuario = await obtenerUsuario(id);
      yield usuario;
    } catch (error) {
      console.error(`Error obteniendo usuario ${id}:`, error.message);
    }
  }
}

// Patrón: Async Throttle
async function throttleAsync(funciones, limite = 2) {
  const resultados = [];

  for (let i = 0; i < funciones.length; i += limite) {
    const batch = funciones.slice(i, i + limite);
    const resultadosBatch = await Promise.all(batch);
    resultados.push(...resultadosBatch);

    // Pequeña pausa entre batches
    if (i + limite < funciones.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  return resultados;
}

// Patrón: Async Queue
class AsyncQueue {
  constructor(concurrencia = 3) {
    this.concurrencia = concurrencia;
    this.cola = [];
    this.ejecutando = 0;
  }

  async agregar(tarea) {
    return new Promise((resolve, reject) => {
      this.cola.push({ tarea, resolve, reject });
      this.procesar();
    });
  }

  async procesar() {
    if (this.ejecutando >= this.concurrencia || this.cola.length === 0) {
      return;
    }

    this.ejecutando++;
    const { tarea, resolve, reject } = this.cola.shift();

    try {
      const resultado = await tarea();
      resolve(resultado);
    } catch (error) {
      reject(error);
    } finally {
      this.ejecutando--;
      this.procesar();
    }
  }
}

// Ejemplo de patrones avanzados
console.log('\n📝 Ejemplo 6: Patrones avanzados');

// Async Iterator
(async () => {
  console.log('🔄 Usando async iterator:');

  for await (const usuario of generadorUsuarios([1, 2, 3])) {
    console.log('👤 Usuario generado:', usuario.nombre);
  }
})();

// Async Throttle
(async () => {
  console.log('🚦 Usando async throttle:');

  const funciones = [1, 2, 3, 1, 2, 3].map(id => () => obtenerUsuario(id));
  const usuarios = await throttleAsync(funciones, 2);

  console.log('✅ Usuarios obtenidos con throttle:', usuarios.length);
})();

// Async Queue
(async () => {
  console.log('📋 Usando async queue:');

  const queue = new AsyncQueue(2);

  const promesas = [1, 2, 3, 1, 2, 3].map(id =>
    queue.agregar(() => obtenerUsuario(id))
  );

  const usuarios = await Promise.all(promesas);
  console.log('✅ Usuarios obtenidos con queue:', usuarios.length);
})();

// =============================================================================
// 8. EJERCICIOS PRÁCTICOS AVANZADOS
// =============================================================================

console.log('\n🎯 Ejercicios prácticos avanzados:');

// EJERCICIO D: Implementa un sistema de pipeline asíncrono
async function pipelineAsincrono(entrada, ...funciones) {
  // TODO: Implementar pipeline que ejecute funciones secuencialmente
  // Cada función debe recibir el resultado de la anterior

  let resultado = entrada;

  for (const funcion of funciones) {
    resultado = await funcion(resultado);
  }

  return resultado;
}

// Funciones para el pipeline
const procesarNombre = async usuario => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return { ...usuario, nombreProcesado: usuario.nombre.toUpperCase() };
};

const obtenerPostsUsuario = async usuario => {
  const posts = await obtenerPosts(usuario.id);
  return { ...usuario, posts };
};

const calcularEstadisticas = async usuario => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return {
    ...usuario,
    estadisticas: {
      totalPosts: usuario.posts.length,
      procesadoEn: new Date().toISOString(),
    },
  };
};

// EJERCICIO E: Implementa un sistema de circuit breaker
class CircuitBreaker {
  constructor(umbralFallos = 5, tiempoEspera = 30000) {
    this.umbralFallos = umbralFallos;
    this.tiempoEspera = tiempoEspera;
    this.fallos = 0;
    this.estado = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.ultimoFallo = null;
  }

  async ejecutar(operacion) {
    if (this.estado === 'OPEN') {
      const tiempoPasado = Date.now() - this.ultimoFallo;

      if (tiempoPasado >= this.tiempoEspera) {
        this.estado = 'HALF_OPEN';
        console.log('🔄 Circuit breaker: HALF_OPEN');
      } else {
        throw new Error('Circuit breaker está OPEN');
      }
    }

    try {
      const resultado = await operacion();

      if (this.estado === 'HALF_OPEN') {
        this.estado = 'CLOSED';
        this.fallos = 0;
        console.log('✅ Circuit breaker: CLOSED');
      }

      return resultado;
    } catch (error) {
      this.fallos++;
      this.ultimoFallo = Date.now();

      if (this.fallos >= this.umbralFallos) {
        this.estado = 'OPEN';
        console.log('🚨 Circuit breaker: OPEN');
      }

      throw error;
    }
  }
}

// Prueba de ejercicios avanzados
console.log('\n🧪 Probando ejercicios avanzados:');

// Prueba ejercicio D
(async () => {
  try {
    const usuario = await obtenerUsuario(1);
    const resultado = await pipelineAsincrono(
      usuario,
      procesarNombre,
      obtenerPostsUsuario,
      calcularEstadisticas
    );

    console.log('✅ Pipeline completado:', resultado.estadisticas);
  } catch (error) {
    console.error('❌ Error en pipeline:', error.message);
  }
})();

// Prueba ejercicio E
(async () => {
  const breaker = new CircuitBreaker(3, 5000);

  const operacionInestable = async () => {
    if (Math.random() > 0.6) {
      return 'Operación exitosa';
    } else {
      throw new Error('Operación falló');
    }
  };

  // Simular múltiples llamadas
  for (let i = 0; i < 8; i++) {
    try {
      const resultado = await breaker.ejecutar(operacionInestable);
      console.log(`✅ Intento ${i + 1}: ${resultado}`);
    } catch (error) {
      console.error(`❌ Intento ${i + 1}: ${error.message}`);
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
  }
})();

// =============================================================================
// 9. RESUMEN Y CONCLUSIONES
// =============================================================================

setTimeout(() => {
  console.log('\n📚 Resumen del Ejercicio 3:');
  console.log('✅ Dominaste la sintaxis async/await');
  console.log('✅ Convertiste promises a async/await');
  console.log('✅ Manejaste errores con try/catch/finally');
  console.log('✅ Implementaste ejecución paralela');
  console.log('✅ Creaste patrones avanzados asíncronos');
  console.log('✅ Desarrollaste pipeline y circuit breaker');
  console.log('\n🎯 Conceptos dominados:');
  console.log('- Función async y keyword await');
  console.log('- Try/catch/finally con código asíncrono');
  console.log('- Ejecución secuencial vs paralela');
  console.log('- Async/await con loops y arrays');
  console.log('- Async generators e iterators');
  console.log('- Patrones avanzados de concurrencia');
  console.log('\n🚀 ¡Listo para manejo avanzado de errores!');
}, 12000);
