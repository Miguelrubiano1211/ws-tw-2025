# 🔄 Guía Completa de Asincronismo en JavaScript

## 📋 Índice

1. [Introducción al Asincronismo](#introducción-al-asincronismo)
2. [Event Loop](#event-loop)
3. [Callbacks](#callbacks)
4. [Promises](#promises)
5. [Async/Await](#asyncawait)
6. [Patrones de Asincronismo](#patrones-de-asincronismo)
7. [Manejo de Errores](#manejo-de-errores)
8. [Optimización y Rendimiento](#optimización-y-rendimiento)
9. [Debugging Asíncrono](#debugging-asíncrono)
10. [Tips para WorldSkills](#tips-para-worldskills)

---

## 🎯 Introducción al Asincronismo

### ¿Qué es el Asincronismo?

El asincronismo en JavaScript permite que el código se ejecute sin bloquear el hilo principal, permitiendo que otras operaciones continúen mientras se espera el resultado de operaciones lentas.

```javascript
// Código síncrono (bloquea)
console.log('Inicio');
for (let i = 0; i < 1000000000; i++) {
  // Bloquea la ejecución
}
console.log('Fin');

// Código asíncrono (no bloquea)
console.log('Inicio');
setTimeout(() => {
  console.log('Operación asíncrona');
}, 0);
console.log('Fin');
```

### Ventajas del Asincronismo

1. **No bloquea el hilo principal**
2. **Mejora la experiencia del usuario**
3. **Permite concurrencia**
4. **Optimiza el rendimiento**

---

## ⚙️ Event Loop

### Conceptos Fundamentales

El Event Loop es el mecanismo que permite a JavaScript manejar operaciones asíncronas en un entorno de un solo hilo.

```javascript
// Ejemplo de Event Loop
console.log('1'); // Call Stack

setTimeout(() => {
  console.log('2'); // Task Queue
}, 0);

Promise.resolve().then(() => {
  console.log('3'); // Microtask Queue
});

console.log('4'); // Call Stack

// Salida: 1, 4, 3, 2
```

### Componentes del Event Loop

1. **Call Stack**: Donde se ejecuta el código
2. **Web APIs**: setTimeout, fetch, DOM events
3. **Task Queue**: Callbacks de APIs
4. **Microtask Queue**: Promises, queueMicrotask
5. **Event Loop**: Coordina todo

### Prioridades de Ejecución

```javascript
// Orden de ejecución
console.log('1'); // Inmediato

setTimeout(() => console.log('2'), 0); // Task Queue

Promise.resolve().then(() => console.log('3')); // Microtask Queue

queueMicrotask(() => console.log('4')); // Microtask Queue

console.log('5'); // Inmediato

// Salida: 1, 5, 3, 4, 2
```

---

## 📞 Callbacks

### Callbacks Básicos

```javascript
// Callback simple
function procesarDatos(datos, callback) {
  // Simular procesamiento asíncrono
  setTimeout(() => {
    const resultado = datos.map(d => d * 2);
    callback(null, resultado);
  }, 1000);
}

procesarDatos([1, 2, 3], (error, resultado) => {
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Resultado:', resultado);
  }
});
```

### Callback Hell

```javascript
// Problema: Callback Hell
obtenerUsuario(id, (error, usuario) => {
  if (error) {
    console.error(error);
  } else {
    obtenerPedidos(usuario.id, (error, pedidos) => {
      if (error) {
        console.error(error);
      } else {
        obtenerDetalles(pedidos[0].id, (error, detalles) => {
          if (error) {
            console.error(error);
          } else {
            console.log('Detalles:', detalles);
          }
        });
      }
    });
  }
});
```

### Solución con Funciones Nombradas

```javascript
// Solución: Funciones nombradas
function manejarError(error) {
  console.error('Error:', error);
}

function manejarDetalles(error, detalles) {
  if (error) return manejarError(error);
  console.log('Detalles:', detalles);
}

function manejarPedidos(error, pedidos) {
  if (error) return manejarError(error);
  obtenerDetalles(pedidos[0].id, manejarDetalles);
}

function manejarUsuario(error, usuario) {
  if (error) return manejarError(error);
  obtenerPedidos(usuario.id, manejarPedidos);
}

obtenerUsuario(id, manejarUsuario);
```

---

## 🤝 Promises

### Creación de Promises

```javascript
// Promise básica
const miPromise = new Promise((resolve, reject) => {
  const exito = Math.random() > 0.5;

  setTimeout(() => {
    if (exito) {
      resolve('Operación exitosa');
    } else {
      reject('Error en la operación');
    }
  }, 1000);
});

// Uso de la promise
miPromise
  .then(resultado => console.log(resultado))
  .catch(error => console.error(error));
```

### Encadenamiento de Promises

```javascript
// Encadenamiento
function obtenerUsuario(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id > 0) {
        resolve({ id, nombre: `Usuario ${id}` });
      } else {
        reject('ID inválido');
      }
    }, 500);
  });
}

function obtenerPedidos(usuarioId) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { id: 1, usuarioId, total: 100 },
        { id: 2, usuarioId, total: 200 },
      ]);
    }, 300);
  });
}

// Uso encadenado
obtenerUsuario(1)
  .then(usuario => {
    console.log('Usuario:', usuario);
    return obtenerPedidos(usuario.id);
  })
  .then(pedidos => {
    console.log('Pedidos:', pedidos);
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

### Promise.all y Promise.race

```javascript
// Promise.all - Todas las promises deben resolverse
const promesas = [
  fetch('/api/usuarios'),
  fetch('/api/productos'),
  fetch('/api/categorias'),
];

Promise.all(promesas)
  .then(responses => {
    // Todas las requests terminaron
    return Promise.all(responses.map(r => r.json()));
  })
  .then(datos => {
    console.log('Todos los datos:', datos);
  })
  .catch(error => {
    console.error('Error en alguna request:', error);
  });

// Promise.race - La primera en resolverse
const timeoutPromise = new Promise((_, reject) => {
  setTimeout(() => reject('Timeout'), 5000);
});

Promise.race([fetch('/api/datos'), timeoutPromise])
  .then(response => response.json())
  .then(datos => console.log('Datos:', datos))
  .catch(error => console.error('Error o timeout:', error));
```

---

## 🚀 Async/Await

### Sintaxis Básica

```javascript
// Async/Await básico
async function obtenerDatosUsuario(id) {
  try {
    const usuario = await obtenerUsuario(id);
    const pedidos = await obtenerPedidos(usuario.id);
    const detalles = await obtenerDetalles(pedidos[0].id);

    return {
      usuario,
      pedidos,
      detalles,
    };
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Uso
obtenerDatosUsuario(1)
  .then(datos => console.log('Datos completos:', datos))
  .catch(error => console.error('Error final:', error));
```

### Async/Await con Loops

```javascript
// Procesamiento secuencial
async function procesarSecuencial(ids) {
  const resultados = [];

  for (const id of ids) {
    try {
      const usuario = await obtenerUsuario(id);
      resultados.push(usuario);
    } catch (error) {
      console.error(`Error con usuario ${id}:`, error);
    }
  }

  return resultados;
}

// Procesamiento paralelo
async function procesarParalelo(ids) {
  const promesas = ids.map(id => obtenerUsuario(id));

  try {
    const resultados = await Promise.all(promesas);
    return resultados;
  } catch (error) {
    console.error('Error en procesamiento paralelo:', error);
    throw error;
  }
}
```

### Async/Await con Manejo de Errores

```javascript
// Manejo de errores avanzado
async function operacionCompleja() {
  let conexion;

  try {
    conexion = await conectarBaseDatos();
    const datos = await obtenerDatos(conexion);
    const procesados = await procesarDatos(datos);
    await guardarResultados(procesados);

    return procesados;
  } catch (error) {
    console.error('Error en operación:', error);

    // Manejo específico por tipo de error
    if (error.code === 'ECONNREFUSED') {
      throw new Error('No se puede conectar a la base de datos');
    } else if (error.code === 'INVALID_DATA') {
      throw new Error('Los datos están corruptos');
    }

    throw error;
  } finally {
    // Limpieza
    if (conexion) {
      await cerrarConexion(conexion);
    }
  }
}
```

---

## 🔄 Patrones de Asincronismo

### Patrón Observer Asíncrono

```javascript
class EventEmitterAsync {
  constructor() {
    this.eventos = new Map();
  }

  on(evento, callback) {
    if (!this.eventos.has(evento)) {
      this.eventos.set(evento, []);
    }
    this.eventos.get(evento).push(callback);
  }

  async emit(evento, datos) {
    const callbacks = this.eventos.get(evento) || [];

    for (const callback of callbacks) {
      try {
        await callback(datos);
      } catch (error) {
        console.error(`Error en callback de ${evento}:`, error);
      }
    }
  }
}

// Uso
const emitter = new EventEmitterAsync();

emitter.on('datos-procesados', async datos => {
  console.log('Procesando:', datos);
  await guardarEnBaseDatos(datos);
});

emitter.on('datos-procesados', async datos => {
  await enviarNotificacion(datos);
});
```

### Patrón Queue Asíncrono

```javascript
class ColaAsincrona {
  constructor(concurrencia = 1) {
    this.cola = [];
    this.ejecutando = 0;
    this.concurrencia = concurrencia;
  }

  async agregar(tarea) {
    return new Promise((resolve, reject) => {
      this.cola.push({
        tarea,
        resolve,
        reject,
      });

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

// Uso
const cola = new ColaAsincrona(3); // 3 tareas concurrentes

for (let i = 0; i < 10; i++) {
  cola
    .agregar(() => procesarItem(i))
    .then(resultado => console.log(`Item ${i} procesado:`, resultado))
    .catch(error => console.error(`Error en item ${i}:`, error));
}
```

### Patrón Circuit Breaker

```javascript
class CircuitBreaker {
  constructor(umbralFallos = 5, tiempoEspera = 60000) {
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
      } else {
        throw new Error('Circuit breaker está OPEN');
      }
    }

    try {
      const resultado = await operacion();

      if (this.estado === 'HALF_OPEN') {
        this.estado = 'CLOSED';
        this.fallos = 0;
      }

      return resultado;
    } catch (error) {
      this.fallos++;
      this.ultimoFallo = Date.now();

      if (this.fallos >= this.umbralFallos) {
        this.estado = 'OPEN';
      }

      throw error;
    }
  }
}

// Uso
const breaker = new CircuitBreaker(3, 30000);

async function operacionConBreaker() {
  try {
    const resultado = await breaker.ejecutar(() => fetch('/api/datos'));
    return resultado.json();
  } catch (error) {
    console.error('Operación falló:', error);
    // Usar datos de cache o valor por defecto
    return obtenerDatosCache();
  }
}
```

---

## 🚨 Manejo de Errores

### Try/Catch con Async/Await

```javascript
// Manejo de errores específicos
async function manejarOperacion() {
  try {
    const datos = await obtenerDatos();
    const procesados = await procesarDatos(datos);
    return procesados;
  } catch (error) {
    // Manejo específico por tipo
    if (error instanceof TypeError) {
      console.error('Error de tipo:', error.message);
    } else if (error.code === 'NETWORK_ERROR') {
      console.error('Error de red:', error.message);
    } else {
      console.error('Error desconocido:', error);
    }

    // Re-throw si es necesario
    throw error;
  }
}
```

### Timeout para Operaciones

```javascript
// Timeout wrapper
function conTimeout(promesa, tiempo) {
  return Promise.race([
    promesa,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout')), tiempo);
    }),
  ]);
}

// Uso
try {
  const resultado = await conTimeout(fetch('/api/datos-lentos'), 5000);
  console.log('Datos obtenidos:', resultado);
} catch (error) {
  if (error.message === 'Timeout') {
    console.error('La operación tardó demasiado');
  } else {
    console.error('Error:', error);
  }
}
```

### Retry Pattern

```javascript
// Patrón de reintentos
async function conReintentos(operacion, intentos = 3, delay = 1000) {
  for (let i = 0; i < intentos; i++) {
    try {
      return await operacion();
    } catch (error) {
      console.warn(`Intento ${i + 1} falló:`, error.message);

      if (i === intentos - 1) {
        throw error;
      }

      // Delay exponencial
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
}

// Uso
try {
  const resultado = await conReintentos(
    () => fetch('/api/datos-inestables'),
    3,
    500
  );
  console.log('Datos obtenidos:', resultado);
} catch (error) {
  console.error('Falló después de todos los intentos:', error);
}
```

---

## ⚡ Optimización y Rendimiento

### Debounce y Throttle

```javascript
// Debounce
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// Throttle
function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Uso en eventos
const buscarDebounced = debounce(async query => {
  const resultados = await buscarEnAPI(query);
  mostrarResultados(resultados);
}, 300);

const scrollThrottled = throttle(() => {
  console.log('Scroll event');
}, 100);
```

### Lazy Loading

```javascript
// Lazy loading de módulos
const cargadorModulos = {
  cache: new Map(),

  async cargar(nombreModulo) {
    if (this.cache.has(nombreModulo)) {
      return this.cache.get(nombreModulo);
    }

    const modulo = await import(`./modules/${nombreModulo}.js`);
    this.cache.set(nombreModulo, modulo);
    return modulo;
  },
};

// Uso
async function usarModulo(nombre) {
  const modulo = await cargadorModulos.cargar(nombre);
  return modulo.procesar();
}
```

### Batching de Operaciones

```javascript
// Batch processing
class BatchProcessor {
  constructor(procesador, tamanoBatch = 10, delay = 100) {
    this.procesador = procesador;
    this.tamanoBatch = tamanoBatch;
    this.delay = delay;
    this.cola = [];
    this.timeoutId = null;
  }

  agregar(item) {
    this.cola.push(item);

    if (this.cola.length >= this.tamanoBatch) {
      this.procesar();
    } else {
      this.programarProcesamiento();
    }
  }

  programarProcesamiento() {
    if (this.timeoutId) return;

    this.timeoutId = setTimeout(() => {
      this.procesar();
    }, this.delay);
  }

  async procesar() {
    if (this.cola.length === 0) return;

    clearTimeout(this.timeoutId);
    this.timeoutId = null;

    const batch = this.cola.splice(0, this.tamanoBatch);

    try {
      await this.procesador(batch);
    } catch (error) {
      console.error('Error en batch:', error);
    }

    if (this.cola.length > 0) {
      this.procesar();
    }
  }
}
```

---

## 🐛 Debugging Asíncrono

### Logging Asíncrono

```javascript
// Logger asíncrono
class Logger {
  constructor() {
    this.logs = [];
  }

  log(nivel, mensaje, contexto = {}) {
    const entry = {
      timestamp: new Date().toISOString(),
      nivel,
      mensaje,
      contexto,
      stack: new Error().stack,
    };

    this.logs.push(entry);
    console.log(`[${entry.timestamp}] ${nivel}: ${mensaje}`, contexto);
  }

  async flush() {
    if (this.logs.length === 0) return;

    const logsToSend = [...this.logs];
    this.logs = [];

    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logsToSend),
      });
    } catch (error) {
      console.error('Error enviando logs:', error);
      // Restaurar logs si falla
      this.logs.unshift(...logsToSend);
    }
  }
}

const logger = new Logger();

// Uso en operaciones asíncronas
async function operacionConLogs() {
  logger.log('INFO', 'Iniciando operación');

  try {
    const resultado = await operacionCompleja();
    logger.log('INFO', 'Operación completada', { resultado });
    return resultado;
  } catch (error) {
    logger.log('ERROR', 'Error en operación', { error: error.message });
    throw error;
  }
}
```

### Tracing de Promesas

```javascript
// Wrapper para tracing
function trazarPromise(promesa, nombre) {
  console.log(`🟡 Iniciando: ${nombre}`);

  return promesa
    .then(resultado => {
      console.log(`🟢 Completado: ${nombre}`, resultado);
      return resultado;
    })
    .catch(error => {
      console.error(`🔴 Error: ${nombre}`, error);
      throw error;
    });
}

// Uso
const usuario = await trazarPromise(obtenerUsuario(1), 'obtenerUsuario');

const pedidos = await trazarPromise(
  obtenerPedidos(usuario.id),
  'obtenerPedidos'
);
```

---

## 🏆 Tips para WorldSkills

### 1. Manejo de Tiempo

```javascript
// Patrón rápido para operaciones asíncronas
const operacionRapida = async datos => {
  const [resultado1, resultado2] = await Promise.all([
    operacion1(datos),
    operacion2(datos),
  ]);

  return combinarResultados(resultado1, resultado2);
};
```

### 2. Error Handling Eficiente

```javascript
// Wrapper de error handling
const seguro =
  fn =>
  async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      console.error(`Error en ${fn.name}:`, error);
      return null;
    }
  };

// Uso
const obtenerUsuarioSeguro = seguro(obtenerUsuario);
```

### 3. Patrones Reutilizables

```javascript
// Factory de operaciones asíncronas
const crearOperacion = endpoint => {
  return async id => {
    const response = await fetch(`/api/${endpoint}/${id}`);
    if (!response.ok) throw new Error(`Error en ${endpoint}`);
    return response.json();
  };
};

const obtenerUsuario = crearOperacion('usuarios');
const obtenerProducto = crearOperacion('productos');
```

### 4. Testing Asíncrono

```javascript
// Testing con Jest
describe('Operaciones asíncronas', () => {
  test('debe obtener usuario', async () => {
    const usuario = await obtenerUsuario(1);
    expect(usuario).toHaveProperty('id', 1);
  });

  test('debe manejar errores', async () => {
    await expect(obtenerUsuario(-1)).rejects.toThrow('ID inválido');
  });
});
```

### 5. Optimización de Performance

```javascript
// Memoización asíncrona
const memoAsync = fn => {
  const cache = new Map();

  return async (...args) => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const resultado = await fn(...args);
    cache.set(key, resultado);
    return resultado;
  };
};

const obtenerUsuarioMemo = memoAsync(obtenerUsuario);
```

## 🎯 Ejercicios Recomendados

1. **Implementar un sistema de notificaciones asíncronas**
2. **Crear un client HTTP con retry y timeout**
3. **Desarrollar un sistema de cache asíncrono**
4. **Implementar un worker pool para tareas pesadas**
5. **Crear un sistema de eventos asíncronos**

## 📚 Recursos Adicionales

- [MDN - Asynchronous JavaScript](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous)
- [JavaScript.info - Async/Await](https://javascript.info/async-await)
- [Event Loop Visualizer](http://latentflip.com/loupe/)
- [Promise A+ Specification](https://promisesaplus.com/)

---

_Esta guía cubre los conceptos fundamentales y avanzados del asincronismo en JavaScript, preparándote para competencias WorldSkills y desarrollo profesional._
