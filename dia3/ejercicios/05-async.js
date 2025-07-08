// 📝 Ejercicio 5: Async/Await y Promises
// Día 3 - JavaScript ES6+ Fundamentals

console.log('🚀 Ejercicio 5: Async/Await y Promises');

// ============================================
// Ejercicio 5.1: Entendiendo las Promises
// ============================================
console.log('\n--- Ejercicio 5.1: Entendiendo las Promises ---');

// Promise básica
const promesaBasica = new Promise((resolve, reject) => {
  const exito = Math.random() > 0.5;

  setTimeout(() => {
    if (exito) {
      resolve('¡Operación exitosa!');
    } else {
      reject('Error en la operación');
    }
  }, 1000);
});

// Usando then/catch
promesaBasica
  .then(resultado => console.log('Then:', resultado))
  .catch(error => console.log('Catch:', error));

// Simulando una API call
const simularApiCall = (url, delay = 1000) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (url.includes('error')) {
        reject(new Error(`Error al acceder a ${url}`));
      } else {
        resolve({
          url,
          data: `Datos de ${url}`,
          timestamp: new Date().toISOString(),
        });
      }
    }, delay);
  });
};

// TODO: Crea una promise que simule descargar un archivo
// Debe resolver con el nombre del archivo y el tamaño después de 2 segundos
const descargarArchivo = nombreArchivo => {
  return new Promise((resolve, reject) => {
    if (!nombreArchivo) {
      reject(new Error('Nombre de archivo requerido'));
      return;
    }

    setTimeout(() => {
      const tamano = Math.floor(Math.random() * 1000) + 100;
      resolve({
        nombre: nombreArchivo,
        tamano: `${tamano}KB`,
        fechaDescarga: new Date().toISOString(),
      });
    }, 2000);
  });
};

// Prueba tu promise
descargarArchivo('documento.pdf')
  .then(archivo => console.log('Archivo descargado:', archivo))
  .catch(error => console.log('Error descarga:', error));

// ============================================
// Ejercicio 5.2: Async/Await
// ============================================
console.log('\n--- Ejercicio 5.2: Async/Await ---');

// Función async básica
const operacionAsincrona = async () => {
  try {
    console.log('Iniciando operación...');
    const resultado = await simularApiCall('/api/usuarios');
    console.log('Resultado:', resultado);
    return resultado;
  } catch (error) {
    console.log('Error capturado:', error.message);
    throw error;
  }
};

// Ejecutar función async
operacionAsincrona();

// TODO: Convierte esta función con then/catch a async/await
const obtenerDatosConThen = () => {
  return simularApiCall('/api/productos')
    .then(productos => {
      console.log('Productos obtenidos:', productos);
      return simularApiCall('/api/categorias');
    })
    .then(categorias => {
      console.log('Categorías obtenidas:', categorias);
      return { productos: 'datos', categorias: 'datos' };
    })
    .catch(error => {
      console.log('Error:', error.message);
    });
};

// Tu solución con async/await:
const obtenerDatosConAsync = async () => {
  try {
    console.log('Obteniendo datos con async/await...');
    const productos = await simularApiCall('/api/productos');
    console.log('Productos obtenidos:', productos);

    const categorias = await simularApiCall('/api/categorias');
    console.log('Categorías obtenidas:', categorias);

    return { productos, categorias };
  } catch (error) {
    console.log('Error:', error.message);
    throw error;
  }
};

// Ejecutar ambas versiones
obtenerDatosConThen();
obtenerDatosConAsync();

// ============================================
// Ejercicio 5.3: Promise.all y Promise.allSettled
// ============================================
console.log('\n--- Ejercicio 5.3: Promise.all y Promise.allSettled ---');

// Múltiples operaciones concurrentes
const operacionesConcurrentes = async () => {
  console.log('Iniciando operaciones concurrentes...');

  const urls = ['/api/usuarios', '/api/productos', '/api/pedidos'];

  try {
    // Promise.all - Todas deben resolverse exitosamente
    const resultados = await Promise.all(
      urls.map(url => simularApiCall(url, 500))
    );

    console.log('Todos los resultados:', resultados);
  } catch (error) {
    console.log('Error en Promise.all:', error.message);
  }
};

// Promise.allSettled - Obtener todos los resultados independientemente
const operacionesConAllSettled = async () => {
  console.log('Iniciando operaciones con allSettled...');

  const urls = ['/api/usuarios', '/api/error', '/api/productos'];

  const resultados = await Promise.allSettled(
    urls.map(url => simularApiCall(url, 300))
  );

  resultados.forEach((resultado, index) => {
    if (resultado.status === 'fulfilled') {
      console.log(`Resultado ${index}:`, resultado.value);
    } else {
      console.log(`Error ${index}:`, resultado.reason.message);
    }
  });
};

// Ejecutar ejemplos
operacionesConcurrentes();
operacionesConAllSettled();

// TODO: Crea una función que descargue múltiples archivos en paralelo
const descargarMultiplesArchivos = async archivos => {
  console.log('Descargando múltiples archivos...');

  try {
    const descargas = await Promise.all(
      archivos.map(archivo => descargarArchivo(archivo))
    );

    console.log('Todas las descargas completadas:', descargas);
    return descargas;
  } catch (error) {
    console.log('Error en descargas:', error.message);
    throw error;
  }
};

// Prueba tu función
descargarMultiplesArchivos(['archivo1.pdf', 'archivo2.doc', 'archivo3.jpg']);

// ============================================
// Ejercicio 5.4: Manejo de Errores Avanzado
// ============================================
console.log('\n--- Ejercicio 5.4: Manejo de Errores Avanzado ---');

// Clase de error personalizada
class ErrorAPI extends Error {
  constructor(message, status, endpoint) {
    super(message);
    this.name = 'ErrorAPI';
    this.status = status;
    this.endpoint = endpoint;
    this.timestamp = new Date().toISOString();
  }
}

// Función con manejo de errores robusto
const operacionRobusta = async endpoint => {
  const maxReintentos = 3;
  let reintentos = 0;

  while (reintentos < maxReintentos) {
    try {
      console.log(`Intento ${reintentos + 1} para ${endpoint}`);
      const resultado = await simularApiCall(endpoint);
      return resultado;
    } catch (error) {
      reintentos++;

      if (reintentos === maxReintentos) {
        throw new ErrorAPI(
          `Error después de ${maxReintentos} intentos`,
          500,
          endpoint
        );
      }

      // Esperar antes del siguiente intento
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
};

// Prueba con endpoint que puede fallar
operacionRobusta('/api/error')
  .then(resultado => console.log('Operación exitosa:', resultado))
  .catch(error => {
    if (error instanceof ErrorAPI) {
      console.log('Error API:', {
        message: error.message,
        status: error.status,
        endpoint: error.endpoint,
        timestamp: error.timestamp,
      });
    } else {
      console.log('Error desconocido:', error.message);
    }
  });

// ============================================
// Ejercicio 5.5: Timeout y Cancelación
// ============================================
console.log('\n--- Ejercicio 5.5: Timeout y Cancelación ---');

// Función con timeout
const conTimeout = (promise, timeout) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Timeout después de ${timeout}ms`));
      }, timeout);
    }),
  ]);
};

// Usar timeout
const operacionConTimeout = async () => {
  try {
    const resultado = await conTimeout(
      simularApiCall('/api/lenta', 3000),
      2000
    );
    console.log('Resultado con timeout:', resultado);
  } catch (error) {
    console.log('Error timeout:', error.message);
  }
};

operacionConTimeout();

// TODO: Implementa un sistema de cache para evitar llamadas repetidas
class CacheAPI {
  constructor() {
    this.cache = new Map();
    this.timeouts = new Map();
  }

  async get(url, ttl = 5000) {
    // Verificar si está en cache
    if (this.cache.has(url)) {
      console.log(`Cache hit para ${url}`);
      return this.cache.get(url);
    }

    // Hacer llamada a API
    console.log(`Cache miss para ${url}, haciendo llamada...`);
    try {
      const resultado = await simularApiCall(url);

      // Guardar en cache
      this.cache.set(url, resultado);

      // Configurar expiración
      const timeoutId = setTimeout(() => {
        this.cache.delete(url);
        this.timeouts.delete(url);
        console.log(`Cache expirado para ${url}`);
      }, ttl);

      this.timeouts.set(url, timeoutId);

      return resultado;
    } catch (error) {
      throw error;
    }
  }

  clear() {
    this.cache.clear();
    this.timeouts.forEach(timeout => clearTimeout(timeout));
    this.timeouts.clear();
  }
}

// Prueba del cache
const cache = new CacheAPI();

const probarCache = async () => {
  console.log('Probando sistema de cache...');

  // Primera llamada
  await cache.get('/api/usuarios');

  // Segunda llamada (debería usar cache)
  await cache.get('/api/usuarios');

  // Esperar expiración y probar nuevamente
  setTimeout(async () => {
    await cache.get('/api/usuarios');
  }, 6000);
};

probarCache();

// ============================================
// Desafío: Sistema de Gestión de Tareas
// ============================================
console.log('\n--- 🎯 Desafío: Sistema de Gestión de Tareas ---');

class GestorTareas {
  constructor() {
    this.tareas = [];
    this.ejecutandose = false;
  }

  // Agregar tarea
  agregarTarea(nombre, funcion, prioridad = 1) {
    const tarea = {
      id: Date.now() + Math.random(),
      nombre,
      funcion,
      prioridad,
      estado: 'pendiente',
      fechaCreacion: new Date(),
    };

    this.tareas.push(tarea);
    console.log(`Tarea agregada: ${nombre}`);
    return tarea.id;
  }

  // Ejecutar tareas por prioridad
  async ejecutarTareas() {
    if (this.ejecutandose) {
      console.log('Ya hay tareas ejecutándose...');
      return;
    }

    this.ejecutandose = true;

    // Ordenar por prioridad
    const tareasOrdenadas = this.tareas
      .filter(tarea => tarea.estado === 'pendiente')
      .sort((a, b) => b.prioridad - a.prioridad);

    console.log(`Ejecutando ${tareasOrdenadas.length} tareas...`);

    for (const tarea of tareasOrdenadas) {
      try {
        tarea.estado = 'ejecutando';
        console.log(`Ejecutando: ${tarea.nombre}`);

        const resultado = await tarea.funcion();

        tarea.estado = 'completada';
        tarea.resultado = resultado;
        tarea.fechaCompletion = new Date();

        console.log(`Completada: ${tarea.nombre}`);
      } catch (error) {
        tarea.estado = 'error';
        tarea.error = error.message;
        console.log(`Error en ${tarea.nombre}:`, error.message);
      }
    }

    this.ejecutandose = false;
    console.log('Todas las tareas procesadas');
  }

  // Obtener estado de tareas
  obtenerEstado() {
    const estado = {
      total: this.tareas.length,
      pendientes: this.tareas.filter(t => t.estado === 'pendiente').length,
      completadas: this.tareas.filter(t => t.estado === 'completada').length,
      errores: this.tareas.filter(t => t.estado === 'error').length,
    };

    return estado;
  }

  // Limpiar tareas completadas
  limpiarCompletadas() {
    this.tareas = this.tareas.filter(t => t.estado !== 'completada');
    console.log('Tareas completadas eliminadas');
  }
}

// Crear gestor y agregar tareas
const gestor = new GestorTareas();

// Tareas de ejemplo
gestor.agregarTarea(
  'Procesar pedidos',
  async () => {
    await simularApiCall('/api/pedidos', 1000);
    return 'Pedidos procesados';
  },
  3
);

gestor.agregarTarea(
  'Enviar emails',
  async () => {
    await simularApiCall('/api/emails', 500);
    return 'Emails enviados';
  },
  2
);

gestor.agregarTarea(
  'Generar reportes',
  async () => {
    await simularApiCall('/api/reportes', 1500);
    return 'Reportes generados';
  },
  1
);

gestor.agregarTarea(
  'Tarea con error',
  async () => {
    await simularApiCall('/api/error', 300);
    return 'No debería llegar aquí';
  },
  2
);

// Ejecutar tareas
setTimeout(async () => {
  await gestor.ejecutarTareas();
  console.log('Estado final:', gestor.obtenerEstado());
}, 1000);

// ============================================
// 🎯 Puntos Clave para WorldSkills
// ============================================
console.log('\n🎯 Puntos Clave para WorldSkills:');
console.log('✅ async/await hace el código asíncrono más legible');
console.log('✅ Promise.all ejecuta operaciones en paralelo');
console.log('✅ Promise.allSettled maneja errores individualmente');
console.log('✅ El manejo de errores es crucial en operaciones asíncronas');
console.log('✅ Los timeouts evitan que las operaciones se cuelguen');
console.log('✅ El cache mejora la performance y reduce llamadas a API');
console.log('✅ Siempre usar try/catch con async/await');
