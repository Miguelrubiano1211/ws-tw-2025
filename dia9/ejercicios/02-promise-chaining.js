/**
 * 🔗 Ejercicio 2: Promise Chaining
 *
 * Objetivo: Dominar el encadenamiento de promesas y ejecución paralela
 * Conceptos: then chaining, Promise.all, Promise.race, transformación de datos
 *
 * Instrucciones:
 * 1. Estudia cada ejemplo de encadenamiento
 * 2. Completa los ejercicios marcados como TODO
 * 3. Experimenta con Promise.all y Promise.race
 */

console.log('🔗 Ejercicio 2: Promise Chaining');

// =============================================================================
// 1. ENCADENAMIENTO BÁSICO
// =============================================================================

/**
 * Simula obtener datos de usuario
 * @param {number} id - ID del usuario
 * @returns {Promise<object>} Promise con datos del usuario
 */
function obtenerUsuario(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id <= 0) {
        reject(new Error('ID de usuario inválido'));
        return;
      }

      const usuarios = {
        1: {
          id: 1,
          nombre: 'Juan',
          email: 'juan@ejemplo.com',
          departamento: 'IT',
        },
        2: {
          id: 2,
          nombre: 'María',
          email: 'maria@ejemplo.com',
          departamento: 'Marketing',
        },
        3: {
          id: 3,
          nombre: 'Pedro',
          email: 'pedro@ejemplo.com',
          departamento: 'Ventas',
        },
      };

      const usuario = usuarios[id];
      if (usuario) {
        resolve(usuario);
      } else {
        reject(new Error(`Usuario con ID ${id} no encontrado`));
      }
    }, 500);
  });
}

/**
 * Simula obtener posts de un usuario
 * @param {number} userId - ID del usuario
 * @returns {Promise<array>} Promise con posts del usuario
 */
function obtenerPosts(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const posts = {
        1: [
          {
            id: 1,
            titulo: 'Mi primer post',
            contenido: 'Contenido del post 1',
          },
          { id: 2, titulo: 'Segundo post', contenido: 'Contenido del post 2' },
        ],
        2: [
          { id: 3, titulo: 'Post de María', contenido: 'Contenido de María' },
        ],
        3: [
          { id: 4, titulo: 'Post de Pedro', contenido: 'Contenido de Pedro' },
          { id: 5, titulo: 'Otro post', contenido: 'Más contenido' },
        ],
      };

      resolve(posts[userId] || []);
    }, 700);
  });
}

/**
 * Simula obtener comentarios de un post
 * @param {number} postId - ID del post
 * @returns {Promise<array>} Promise con comentarios del post
 */
function obtenerComentarios(postId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const comentarios = {
        1: [
          { id: 1, autor: 'Ana', comentario: '¡Excelente post!' },
          { id: 2, autor: 'Luis', comentario: 'Muy interesante' },
        ],
        2: [{ id: 3, autor: 'Carlos', comentario: 'Buen contenido' }],
        3: [{ id: 4, autor: 'Sofia', comentario: 'Me gustó mucho' }],
      };

      resolve(comentarios[postId] || []);
    }, 300);
  });
}

// Ejemplo de encadenamiento básico
console.log('\n📝 Ejemplo 1: Encadenamiento básico');

obtenerUsuario(1)
  .then(usuario => {
    console.log('✅ Usuario obtenido:', usuario);
    return obtenerPosts(usuario.id);
  })
  .then(posts => {
    console.log('✅ Posts obtenidos:', posts);
    if (posts.length > 0) {
      return obtenerComentarios(posts[0].id);
    }
    return [];
  })
  .then(comentarios => {
    console.log('✅ Comentarios obtenidos:', comentarios);
  })
  .catch(error => {
    console.error('❌ Error en la cadena:', error.message);
  });

// =============================================================================
// 2. TRANSFORMACIÓN DE DATOS EN CADENA
// =============================================================================

/**
 * Procesa y transforma datos de usuario
 * @param {number} userId - ID del usuario
 * @returns {Promise<object>} Promise con datos procesados
 */
function procesarDatosUsuario(userId) {
  return obtenerUsuario(userId)
    .then(usuario => {
      console.log('🔄 Procesando usuario:', usuario.nombre);

      // Transformar datos del usuario
      return {
        ...usuario,
        nombreCompleto: usuario.nombre.toUpperCase(),
        esAdmin: usuario.departamento === 'IT',
      };
    })
    .then(usuarioTransformado => {
      console.log('🔄 Obteniendo posts del usuario');

      // Obtener posts y mantener datos del usuario
      return obtenerPosts(usuarioTransformado.id).then(posts => ({
        usuario: usuarioTransformado,
        posts: posts,
      }));
    })
    .then(({ usuario, posts }) => {
      console.log('🔄 Procesando posts');

      // Transformar posts
      const postsTransformados = posts.map(post => ({
        ...post,
        resumen: post.contenido.substring(0, 50) + '...',
        autor: usuario.nombre,
        fechaCreacion: new Date().toISOString(),
      }));

      return {
        usuario: usuario,
        posts: postsTransformados,
        estadisticas: {
          totalPosts: postsTransformados.length,
          departamento: usuario.departamento,
          procesamientoCompleto: true,
        },
      };
    });
}

// Ejemplo de transformación de datos
console.log('\n📝 Ejemplo 2: Transformación de datos');

procesarDatosUsuario(1)
  .then(resultado => {
    console.log('✅ Procesamiento completo:', resultado);
  })
  .catch(error => {
    console.error('❌ Error procesando datos:', error.message);
  });

// =============================================================================
// 3. PROMISE.ALL - EJECUCIÓN PARALELA
// =============================================================================

/**
 * Obtiene datos de múltiples usuarios en paralelo
 * @param {array} userIds - Array de IDs de usuarios
 * @returns {Promise<array>} Promise con datos de todos los usuarios
 */
function obtenerMultiplesUsuarios(userIds) {
  console.log('🚀 Obteniendo usuarios en paralelo:', userIds);

  const promesasUsuarios = userIds.map(id => obtenerUsuario(id));

  return Promise.all(promesasUsuarios).then(usuarios => {
    console.log('✅ Todos los usuarios obtenidos');
    return usuarios;
  });
}

/**
 * Obtiene estadísticas completas de múltiples usuarios
 * @param {array} userIds - Array de IDs de usuarios
 * @returns {Promise<object>} Promise con estadísticas
 */
function obtenerEstadisticasCompletas(userIds) {
  return Promise.all([
    obtenerMultiplesUsuarios(userIds),
    ...userIds.map(id => obtenerPosts(id)),
  ]).then(([usuarios, ...postsArrays]) => {
    const estadisticas = {
      totalUsuarios: usuarios.length,
      usuariosPorDepartamento: {},
      totalPosts: 0,
      postsPorUsuario: {},
    };

    // Procesar usuarios
    usuarios.forEach(usuario => {
      if (!estadisticas.usuariosPorDepartamento[usuario.departamento]) {
        estadisticas.usuariosPorDepartamento[usuario.departamento] = 0;
      }
      estadisticas.usuariosPorDepartamento[usuario.departamento]++;
    });

    // Procesar posts
    postsArrays.forEach((posts, index) => {
      const usuario = usuarios[index];
      estadisticas.totalPosts += posts.length;
      estadisticas.postsPorUsuario[usuario.nombre] = posts.length;
    });

    return estadisticas;
  });
}

// Ejemplo de Promise.all
console.log('\n📝 Ejemplo 3: Promise.all');

obtenerEstadisticasCompletas([1, 2, 3])
  .then(estadisticas => {
    console.log('✅ Estadísticas completas:', estadisticas);
  })
  .catch(error => {
    console.error('❌ Error obteniendo estadísticas:', error.message);
  });

// =============================================================================
// 4. PROMISE.RACE - TIMEOUT Y COMPETENCIA
// =============================================================================

/**
 * Crea una promise que se rechaza después de un timeout
 * @param {number} tiempo - Tiempo en milisegundos
 * @returns {Promise} Promise que se rechaza por timeout
 */
function crearTimeout(tiempo) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Timeout después de ${tiempo}ms`));
    }, tiempo);
  });
}

/**
 * Obtiene datos de usuario con timeout
 * @param {number} userId - ID del usuario
 * @param {number} timeout - Tiempo límite en ms
 * @returns {Promise} Promise con datos o timeout
 */
function obtenerUsuarioConTimeout(userId, timeout = 3000) {
  return Promise.race([obtenerUsuario(userId), crearTimeout(timeout)]);
}

/**
 * Obtiene datos del servidor más rápido
 * @param {number} userId - ID del usuario
 * @returns {Promise} Promise con datos del servidor más rápido
 */
function obtenerDeServidorMasRapido(userId) {
  const servidor1 = new Promise(resolve => {
    setTimeout(() => {
      resolve({
        servidor: 'Servidor 1',
        datos: `Usuario ${userId} desde servidor 1`,
      });
    }, Math.random() * 2000);
  });

  const servidor2 = new Promise(resolve => {
    setTimeout(() => {
      resolve({
        servidor: 'Servidor 2',
        datos: `Usuario ${userId} desde servidor 2`,
      });
    }, Math.random() * 2000);
  });

  const servidor3 = new Promise(resolve => {
    setTimeout(() => {
      resolve({
        servidor: 'Servidor 3',
        datos: `Usuario ${userId} desde servidor 3`,
      });
    }, Math.random() * 2000);
  });

  return Promise.race([servidor1, servidor2, servidor3]);
}

// Ejemplo de Promise.race
console.log('\n📝 Ejemplo 4: Promise.race');

obtenerUsuarioConTimeout(1, 2000)
  .then(usuario => {
    console.log('✅ Usuario obtenido dentro del timeout:', usuario);
  })
  .catch(error => {
    console.error('❌ Error o timeout:', error.message);
  });

obtenerDeServidorMasRapido(1)
  .then(resultado => {
    console.log('✅ Respuesta del servidor más rápido:', resultado);
  })
  .catch(error => {
    console.error('❌ Error:', error.message);
  });

// =============================================================================
// 5. PROMISE.ALLSETTLED - MANEJO DE FALLOS MIXTOS
// =============================================================================

/**
 * Operación que puede fallar aleatoriamente
 * @param {string} operacion - Nombre de la operación
 * @param {number} probabilidadFallo - Probabilidad de fallo (0-1)
 * @returns {Promise} Promise que puede resolver o rechazar
 */
function operacionInestable(operacion, probabilidadFallo = 0.3) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < probabilidadFallo) {
        reject(new Error(`Falló la operación: ${operacion}`));
      } else {
        resolve(`Éxito en operación: ${operacion}`);
      }
    }, 500 + Math.random() * 1000);
  });
}

/**
 * Ejecuta múltiples operaciones y maneja fallos mixtos
 * @param {array} operaciones - Array de nombres de operaciones
 * @returns {Promise<object>} Promise con resultados y estadísticas
 */
function ejecutarOperacionesConFallos(operaciones) {
  const promesas = operaciones.map(op => operacionInestable(op, 0.4));

  return Promise.allSettled(promesas).then(resultados => {
    const exitosas = resultados.filter(r => r.status === 'fulfilled');
    const fallidas = resultados.filter(r => r.status === 'rejected');

    return {
      total: resultados.length,
      exitosas: exitosas.length,
      fallidas: fallidas.length,
      resultadosExitosos: exitosas.map(r => r.value),
      errores: fallidas.map(r => r.reason.message),
      porcentajeExito: (exitosas.length / resultados.length) * 100,
    };
  });
}

// Ejemplo de Promise.allSettled
console.log('\n📝 Ejemplo 5: Promise.allSettled');

const operaciones = [
  'Enviar email',
  'Actualizar base de datos',
  'Generar reporte',
  'Crear backup',
  'Sincronizar cache',
];

ejecutarOperacionesConFallos(operaciones)
  .then(estadisticas => {
    console.log('✅ Estadísticas de operaciones:', estadisticas);
  })
  .catch(error => {
    console.error('❌ Error:', error.message);
  });

// =============================================================================
// 6. EJERCICIOS PRÁCTICOS
// =============================================================================

console.log('\n🎯 Ejercicios para completar:');

// EJERCICIO A: Crear un pipeline de procesamiento de datos
// Debe procesar un array de usuarios y obtener información completa de cada uno
function procesarPipelineUsuarios(userIds) {
  // TODO: Implementar pipeline que:
  // 1. Obtenga todos los usuarios en paralelo
  // 2. Para cada usuario, obtenga sus posts
  // 3. Para cada post, obtenga sus comentarios
  // 4. Combine todo en un objeto estructurado

  return Promise.all(userIds.map(obtenerUsuario))
    .then(usuarios => {
      console.log('✅ Usuarios obtenidos:', usuarios.length);

      // Obtener posts para cada usuario
      const promesasPosts = usuarios.map(usuario =>
        obtenerPosts(usuario.id).then(posts => ({ usuario, posts }))
      );

      return Promise.all(promesasPosts);
    })
    .then(usuariosConPosts => {
      console.log('✅ Posts obtenidos para todos los usuarios');

      // Obtener comentarios para cada post
      const promesasComentarios = usuariosConPosts.map(({ usuario, posts }) => {
        const promesasComentariosPosts = posts.map(post =>
          obtenerComentarios(post.id).then(comentarios => ({
            ...post,
            comentarios,
          }))
        );

        return Promise.all(promesasComentariosPosts).then(
          postsConComentarios => ({ usuario, posts: postsConComentarios })
        );
      });

      return Promise.all(promesasComentarios);
    })
    .then(datosCompletos => {
      // Calcular estadísticas
      const estadisticas = {
        totalUsuarios: datosCompletos.length,
        totalPosts: datosCompletos.reduce((sum, u) => sum + u.posts.length, 0),
        totalComentarios: datosCompletos.reduce(
          (sum, u) =>
            sum +
            u.posts.reduce((postSum, p) => postSum + p.comentarios.length, 0),
          0
        ),
        promedioPostsPorUsuario: 0,
        promedioComentariosPorPost: 0,
      };

      estadisticas.promedioPostsPorUsuario =
        estadisticas.totalPosts / estadisticas.totalUsuarios;
      estadisticas.promedioComentariosPorPost =
        estadisticas.totalComentarios / estadisticas.totalPosts;

      return {
        usuarios: datosCompletos,
        estadisticas: estadisticas,
      };
    });
}

// EJERCICIO B: Sistema de reintentos con Promise.race
function operacionConReintentos(operacion, maxIntentos = 3, timeoutMs = 2000) {
  // TODO: Implementar sistema que:
  // 1. Intente la operación
  // 2. Si falla, reintente hasta maxIntentos veces
  // 3. Use timeout para cada intento
  // 4. Retorne el resultado exitoso o el último error

  return new Promise((resolve, reject) => {
    let intentos = 0;

    function intentar() {
      intentos++;
      console.log(`🔄 Intento ${intentos}/${maxIntentos}`);

      Promise.race([operacion(), crearTimeout(timeoutMs)])
        .then(resultado => {
          console.log(`✅ Éxito en intento ${intentos}`);
          resolve(resultado);
        })
        .catch(error => {
          console.log(`❌ Falló intento ${intentos}: ${error.message}`);

          if (intentos < maxIntentos) {
            setTimeout(intentar, 1000);
          } else {
            reject(
              new Error(
                `Falló después de ${maxIntentos} intentos. Último error: ${error.message}`
              )
            );
          }
        });
    }

    intentar();
  });
}

// EJERCICIO C: Sistema de cache con expiración
class CachePromises {
  constructor(ttl = 60000) {
    this.cache = new Map();
    this.ttl = ttl;
  }

  async get(key, factory) {
    // TODO: Implementar cache que:
    // 1. Verifique si el key existe y no ha expirado
    // 2. Si existe, retorne el valor cacheado
    // 3. Si no existe, use factory() para obtener nuevo valor
    // 4. Guarde el nuevo valor en cache con timestamp

    const ahora = Date.now();
    const cached = this.cache.get(key);

    if (cached && ahora - cached.timestamp < this.ttl) {
      console.log(`💾 Cache hit para: ${key}`);
      return cached.value;
    }

    console.log(`🌐 Cache miss para: ${key}, obteniendo datos...`);
    const valor = await factory();

    this.cache.set(key, {
      value: valor,
      timestamp: ahora,
    });

    return valor;
  }

  clear() {
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }
}

// Prueba de ejercicios
console.log('\n🧪 Probando ejercicios:');

// Prueba ejercicio A
procesarPipelineUsuarios([1, 2])
  .then(resultado => {
    console.log('✅ Pipeline completado:', resultado.estadisticas);
  })
  .catch(error => {
    console.error('❌ Error en pipeline:', error.message);
  });

// Prueba ejercicio B
const operacionFallaAleatoria = () =>
  operacionInestable('Operación crítica', 0.7);

operacionConReintentos(operacionFallaAleatoria, 3, 1500)
  .then(resultado => {
    console.log('✅ Operación con reintentos exitosa:', resultado);
  })
  .catch(error => {
    console.error('❌ Operación con reintentos falló:', error.message);
  });

// Prueba ejercicio C
const cache = new CachePromises(5000); // 5 segundos TTL

cache
  .get('usuario-1', () => obtenerUsuario(1))
  .then(usuario => {
    console.log('✅ Usuario del cache:', usuario);

    // Segunda llamada (debería usar cache)
    return cache.get('usuario-1', () => obtenerUsuario(1));
  })
  .then(usuario => {
    console.log('✅ Usuario del cache (segunda llamada):', usuario);
  })
  .catch(error => {
    console.error('❌ Error con cache:', error.message);
  });

// =============================================================================
// 7. DESAFÍO AVANZADO: RATE LIMITER
// =============================================================================

/**
 * Rate limiter que controla la frecuencia de ejecución de promesas
 */
class RateLimiter {
  constructor(maxConcurrent = 3, delayMs = 1000) {
    this.maxConcurrent = maxConcurrent;
    this.delayMs = delayMs;
    this.running = 0;
    this.queue = [];
  }

  async execute(promiseFactory) {
    return new Promise((resolve, reject) => {
      this.queue.push({ promiseFactory, resolve, reject });
      this.process();
    });
  }

  async process() {
    if (this.running >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }

    this.running++;
    const { promiseFactory, resolve, reject } = this.queue.shift();

    try {
      const result = await promiseFactory();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      this.running--;

      // Esperar antes de procesar siguiente
      setTimeout(() => {
        this.process();
      }, this.delayMs);
    }
  }
}

// Ejemplo de uso del rate limiter
console.log('\n🔥 Desafío: Rate Limiter');

const rateLimiter = new RateLimiter(2, 500); // Máximo 2 concurrentes, 500ms entre ejecuciones

const usuarios = [1, 2, 3, 1, 2, 3]; // Simular múltiples requests

Promise.all(
  usuarios.map(userId => rateLimiter.execute(() => obtenerUsuario(userId)))
)
  .then(resultados => {
    console.log('✅ Todas las operaciones completadas:', resultados.length);
  })
  .catch(error => {
    console.error('❌ Error en rate limiter:', error.message);
  });

// =============================================================================
// 8. RESUMEN Y CONCLUSIONES
// =============================================================================

setTimeout(() => {
  console.log('\n📚 Resumen del Ejercicio 2:');
  console.log('✅ Dominaste el encadenamiento de promesas');
  console.log('✅ Usaste Promise.all para ejecución paralela');
  console.log('✅ Implementaste timeouts con Promise.race');
  console.log('✅ Manejaste fallos mixtos con Promise.allSettled');
  console.log('✅ Creaste pipelines de procesamiento de datos');
  console.log('✅ Implementaste cache con TTL');
  console.log('✅ Desarrollaste rate limiter avanzado');
  console.log('\n🎯 Conceptos dominados:');
  console.log('- Encadenamiento de promesas (then chaining)');
  console.log('- Transformación de datos en cadena');
  console.log('- Promise.all para paralelización');
  console.log('- Promise.race para timeouts y competencia');
  console.log('- Promise.allSettled para manejo de fallos');
  console.log('- Patrones avanzados de concurrencia');
  console.log('\n🚀 ¡Listo para async/await!');
}, 8000);
