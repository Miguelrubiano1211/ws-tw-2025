# 📖 Guía Completa de Promises

## 🎯 Índice

1. [Conceptos Fundamentales](#conceptos-fundamentales)
2. [Anatomía de una Promise](#anatomía-de-una-promise)
3. [Estados de las Promises](#estados-de-las-promises)
4. [Métodos de Instancia](#métodos-de-instancia)
5. [Métodos Estáticos](#métodos-estáticos)
6. [Patrones Comunes](#patrones-comunes)
7. [Mejores Prácticas](#mejores-prácticas)
8. [Errores Frecuentes](#errores-frecuentes)
9. [Casos de Uso Avanzados](#casos-de-uso-avanzados)
10. [Debugging](#debugging)

## 📚 Conceptos Fundamentales

### ¿Qué es una Promise?

Una **Promise** es un objeto que representa la eventual terminación (o fallo) de una operación asíncrona y su valor resultante.

```javascript
// Analogía con el mundo real
const promesa = new Promise((resolve, reject) => {
  // "Te prometo que haré esta tarea"
  // Puede resolverse (cumplirse) o rechazarse (fallar)
});
```

### Antes de Promises: Callback Hell

```javascript
// ❌ Callback Hell - Difícil de leer y mantener
getData(function (a) {
  getMoreData(a, function (b) {
    getMoreData(b, function (c) {
      getMoreData(c, function (d) {
        // ... y así sucesivamente
      });
    });
  });
});

// ✅ Con Promises - Más limpio y legible
getData()
  .then(a => getMoreData(a))
  .then(b => getMoreData(b))
  .then(c => getMoreData(c))
  .then(d => {
    // resultado final
  });
```

## 🏗️ Anatomía de una Promise

### Estructura Básica

```javascript
const miPromise = new Promise((resolve, reject) => {
  // Executor function
  // Se ejecuta inmediatamente al crear la promise

  // Operación asíncrona
  setTimeout(() => {
    const exitoso = Math.random() > 0.5;

    if (exitoso) {
      resolve('¡Operación exitosa!'); // Cumplir la promesa
    } else {
      reject(new Error('Operación falló')); // Rechazar la promesa
    }
  }, 1000);
});
```

### Componentes Clave

1. **Executor**: Función que se ejecuta inmediatamente
2. **resolve**: Función para cumplir la promesa
3. **reject**: Función para rechazar la promesa
4. **then**: Método para manejar el éxito
5. **catch**: Método para manejar errores
6. **finally**: Método que siempre se ejecuta

## ⚡ Estados de las Promises

### Los Tres Estados

```javascript
// 1. PENDING (Pendiente)
const promesaPendiente = new Promise((resolve, reject) => {
  // Aún no se ha resuelto ni rechazado
  console.log('Estado: pending');
});

// 2. FULFILLED (Cumplida)
const promesaCumplida = Promise.resolve('Valor resuelto');
console.log('Estado: fulfilled');

// 3. REJECTED (Rechazada)
const promesaRechazada = Promise.reject(new Error('Error'));
console.log('Estado: rejected');
```

### Transiciones de Estado

```javascript
const promise = new Promise((resolve, reject) => {
  console.log('1. Estado inicial: pending');

  setTimeout(() => {
    if (Math.random() > 0.5) {
      console.log('2. Transición a: fulfilled');
      resolve('Éxito');
    } else {
      console.log('2. Transición a: rejected');
      reject(new Error('Fallo'));
    }
  }, 1000);
});

promise
  .then(resultado => console.log('3. Resultado:', resultado))
  .catch(error => console.log('3. Error:', error.message));
```

## 🔧 Métodos de Instancia

### then() - Manejo de Éxito

```javascript
const promesa = Promise.resolve('Datos importantes');

// Básico
promesa.then(datos => {
  console.log('Recibido:', datos);
});

// Con transformación
promesa
  .then(datos => {
    return datos.toUpperCase();
  })
  .then(datosTransformados => {
    console.log('Transformados:', datosTransformados);
  });

// Con dos argumentos (éxito y error)
promesa.then(
  datos => console.log('Éxito:', datos),
  error => console.log('Error:', error)
);
```

### catch() - Manejo de Errores

```javascript
const promesaRiesgosa = new Promise((resolve, reject) => {
  const aleatorio = Math.random();

  if (aleatorio > 0.5) {
    resolve('Todo bien');
  } else {
    reject(new Error('Algo salió mal'));
  }
});

promesaRiesgosa
  .then(resultado => console.log(resultado))
  .catch(error => {
    console.error('Error capturado:', error.message);
    // Manejar error gracefully
    return 'Valor por defecto';
  })
  .then(resultado => {
    console.log('Resultado final:', resultado);
  });
```

### finally() - Limpieza

```javascript
const operacionCompleja = new Promise((resolve, reject) => {
  console.log('🔄 Iniciando operación...');

  setTimeout(() => {
    Math.random() > 0.5 ? resolve('Éxito') : reject(new Error('Fallo'));
  }, 2000);
});

operacionCompleja
  .then(resultado => {
    console.log('✅ Operación exitosa:', resultado);
    return resultado;
  })
  .catch(error => {
    console.error('❌ Operación falló:', error.message);
    throw error; // Re-lanzar para que finally no interfiera
  })
  .finally(() => {
    console.log('🧹 Limpiando recursos...');
    // Liberar recursos, cerrar conexiones, etc.
  });
```

## 🚀 Métodos Estáticos

### Promise.resolve()

```javascript
// Crear promise resuelta inmediatamente
const promesaResuelta = Promise.resolve('Valor inmediato');

// Convertir valor a promise
const valor = 42;
const promesa = Promise.resolve(valor);

// Útil para APIs que pueden retornar valor o promise
function procesarDatos(datos) {
  return Promise.resolve(datos)
    .then(d => d.toUpperCase())
    .then(d => `Procesado: ${d}`);
}
```

### Promise.reject()

```javascript
// Crear promise rechazada inmediatamente
const promesaRechazada = Promise.reject(new Error('Error inmediato'));

// Útil para validaciones
function validarUsuario(usuario) {
  if (!usuario.email) {
    return Promise.reject(new Error('Email requerido'));
  }

  return Promise.resolve(usuario);
}
```

### Promise.all() - Todas deben resolverse

```javascript
const promesa1 = Promise.resolve('Primera');
const promesa2 = new Promise(resolve =>
  setTimeout(() => resolve('Segunda'), 1000)
);
const promesa3 = Promise.resolve('Tercera');

Promise.all([promesa1, promesa2, promesa3])
  .then(resultados => {
    console.log('Todos los resultados:', resultados);
    // ['Primera', 'Segunda', 'Tercera']
  })
  .catch(error => {
    console.error('Una falló:', error);
  });

// Ejemplo práctico: Cargar múltiples recursos
const cargarRecursos = async () => {
  try {
    const [usuarios, productos, categorias] = await Promise.all([
      fetch('/api/usuarios').then(r => r.json()),
      fetch('/api/productos').then(r => r.json()),
      fetch('/api/categorias').then(r => r.json()),
    ]);

    console.log('Todos los recursos cargados');
    return { usuarios, productos, categorias };
  } catch (error) {
    console.error('Error cargando recursos:', error);
  }
};
```

### Promise.allSettled() - Todas terminan

```javascript
const promesa1 = Promise.resolve('Éxito');
const promesa2 = Promise.reject(new Error('Fallo'));
const promesa3 = Promise.resolve('Otro éxito');

Promise.allSettled([promesa1, promesa2, promesa3]).then(resultados => {
  resultados.forEach((resultado, index) => {
    if (resultado.status === 'fulfilled') {
      console.log(`Promesa ${index} exitosa:`, resultado.value);
    } else {
      console.log(`Promesa ${index} falló:`, resultado.reason.message);
    }
  });
});

// Ejemplo práctico: Múltiples servicios independientes
const sincronizarDatos = async () => {
  const servicios = [
    fetch('/api/servicio1').then(r => r.json()),
    fetch('/api/servicio2').then(r => r.json()),
    fetch('/api/servicio3').then(r => r.json()),
  ];

  const resultados = await Promise.allSettled(servicios);

  const exitosos = resultados
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value);

  const fallidos = resultados
    .filter(r => r.status === 'rejected')
    .map(r => r.reason);

  console.log(`${exitosos.length} servicios funcionando`);
  console.log(`${fallidos.length} servicios fallaron`);

  return { exitosos, fallidos };
};
```

### Promise.race() - Primera en terminar

```javascript
const promesaRapida = new Promise(resolve =>
  setTimeout(() => resolve('Rápida'), 1000)
);

const promesaLenta = new Promise(resolve =>
  setTimeout(() => resolve('Lenta'), 3000)
);

Promise.race([promesaRapida, promesaLenta]).then(resultado => {
  console.log('Ganador:', resultado); // 'Rápida'
});

// Ejemplo práctico: Timeout
const conTimeout = (promesa, tiempoLimite) => {
  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Timeout')), tiempoLimite);
  });

  return Promise.race([promesa, timeout]);
};

const operacionLenta = new Promise(resolve =>
  setTimeout(() => resolve('Completado'), 5000)
);

conTimeout(operacionLenta, 3000)
  .then(resultado => console.log('Resultado:', resultado))
  .catch(error => console.error('Error:', error.message));
```

### Promise.any() - Primera exitosa

```javascript
const promesa1 = Promise.reject(new Error('Error 1'));
const promesa2 = Promise.reject(new Error('Error 2'));
const promesa3 = Promise.resolve('Éxito');

Promise.any([promesa1, promesa2, promesa3])
  .then(resultado => {
    console.log('Primera exitosa:', resultado); // 'Éxito'
  })
  .catch(error => {
    console.error('Todas fallaron:', error);
  });

// Ejemplo práctico: Múltiples fuentes de datos
const obtenerDatos = async () => {
  const fuentes = [
    fetch('/api/fuente1').then(r => r.json()),
    fetch('/api/fuente2').then(r => r.json()),
    fetch('/api/fuente3').then(r => r.json()),
  ];

  try {
    const datos = await Promise.any(fuentes);
    console.log('Datos obtenidos de primera fuente disponible');
    return datos;
  } catch (error) {
    console.error('Todas las fuentes fallaron');
    throw error;
  }
};
```

## 🎨 Patrones Comunes

### Patrón Retry

```javascript
const retry = async (operacion, maxIntentos = 3, delay = 1000) => {
  for (let intento = 1; intento <= maxIntentos; intento++) {
    try {
      return await operacion();
    } catch (error) {
      if (intento === maxIntentos) {
        throw error;
      }

      console.log(`Intento ${intento} falló, reintentando...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// Uso
const operacionInestable = () => {
  return new Promise((resolve, reject) => {
    if (Math.random() > 0.7) {
      resolve('Éxito');
    } else {
      reject(new Error('Fallo temporal'));
    }
  });
};

retry(operacionInestable, 5, 2000)
  .then(resultado => console.log('Operación exitosa:', resultado))
  .catch(error => console.error('Falló después de todos los intentos:', error));
```

### Patrón Cache

```javascript
const cache = new Map();

const conCache = (clave, operacion, ttl = 60000) => {
  const entrada = cache.get(clave);

  if (entrada && Date.now() - entrada.timestamp < ttl) {
    console.log('Cache hit');
    return Promise.resolve(entrada.valor);
  }

  console.log('Cache miss');
  return operacion().then(resultado => {
    cache.set(clave, {
      valor: resultado,
      timestamp: Date.now(),
    });
    return resultado;
  });
};

// Uso
const obtenerUsuario = id => {
  return conCache(`usuario-${id}`, async () => {
    const response = await fetch(`/api/usuarios/${id}`);
    return response.json();
  });
};
```

### Patrón Throttle/Debounce

```javascript
const throttle = (operacion, delay) => {
  let ultimaEjecucion = 0;

  return (...args) => {
    const ahora = Date.now();

    if (ahora - ultimaEjecucion >= delay) {
      ultimaEjecucion = ahora;
      return operacion(...args);
    }

    return Promise.reject(new Error('Throttled'));
  };
};

const debounce = (operacion, delay) => {
  let timeoutId;

  return (...args) => {
    clearTimeout(timeoutId);

    return new Promise((resolve, reject) => {
      timeoutId = setTimeout(async () => {
        try {
          const resultado = await operacion(...args);
          resolve(resultado);
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  };
};
```

### Patrón Queue

```javascript
class PromiseQueue {
  constructor(concurrencia = 1) {
    this.concurrencia = concurrencia;
    this.activos = 0;
    this.cola = [];
  }

  add(operacion) {
    return new Promise((resolve, reject) => {
      this.cola.push({ operacion, resolve, reject });
      this.procesar();
    });
  }

  async procesar() {
    if (this.activos >= this.concurrencia || this.cola.length === 0) {
      return;
    }

    this.activos++;
    const { operacion, resolve, reject } = this.cola.shift();

    try {
      const resultado = await operacion();
      resolve(resultado);
    } catch (error) {
      reject(error);
    } finally {
      this.activos--;
      this.procesar();
    }
  }
}

// Uso
const queue = new PromiseQueue(3);

for (let i = 0; i < 10; i++) {
  queue
    .add(() => {
      return new Promise(resolve => {
        setTimeout(() => resolve(`Tarea ${i}`), 1000);
      });
    })
    .then(resultado => console.log(resultado));
}
```

## ✅ Mejores Prácticas

### 1. Siempre Maneja Errores

```javascript
// ❌ Malo: Promise sin catch
fetch('/api/datos')
  .then(response => response.json())
  .then(datos => console.log(datos));

// ✅ Bueno: Con manejo de errores
fetch('/api/datos')
  .then(response => response.json())
  .then(datos => console.log(datos))
  .catch(error => console.error('Error:', error));
```

### 2. Evita el Callback Hell con Promises

```javascript
// ❌ Malo: Nesting innecesario
promise1().then(result1 => {
  promise2(result1).then(result2 => {
    promise3(result2).then(result3 => {
      console.log(result3);
    });
  });
});

// ✅ Bueno: Flat chaining
promise1()
  .then(result1 => promise2(result1))
  .then(result2 => promise3(result2))
  .then(result3 => console.log(result3))
  .catch(error => console.error(error));
```

### 3. Usa Promise.all para Operaciones Paralelas

```javascript
// ❌ Malo: Secuencial innecesario
const datos1 = await fetch('/api/datos1');
const datos2 = await fetch('/api/datos2');
const datos3 = await fetch('/api/datos3');

// ✅ Bueno: Paralelo
const [datos1, datos2, datos3] = await Promise.all([
  fetch('/api/datos1'),
  fetch('/api/datos2'),
  fetch('/api/datos3'),
]);
```

### 4. Retorna Promises en Funciones Async

```javascript
// ❌ Malo: Mezclar callbacks y promises
function obtenerDatos(callback) {
  fetch('/api/datos')
    .then(response => response.json())
    .then(datos => callback(null, datos))
    .catch(error => callback(error));
}

// ✅ Bueno: Retornar promise
function obtenerDatos() {
  return fetch('/api/datos').then(response => response.json());
}
```

### 5. Usa finally para Limpieza

```javascript
let loading = true;

operacionCompleja()
  .then(resultado => {
    console.log('Éxito:', resultado);
    procesarResultado(resultado);
  })
  .catch(error => {
    console.error('Error:', error);
    mostrarError(error);
  })
  .finally(() => {
    loading = false;
    ocultarSpinner();
  });
```

## ⚠️ Errores Frecuentes

### 1. Olvidar Retornar en then()

```javascript
// ❌ Malo: No retorna
promise
  .then(resultado => {
    const procesado = procesar(resultado);
    // Falta return
  })
  .then(resultado => {
    console.log(resultado); // undefined
  });

// ✅ Bueno: Retorna el valor
promise
  .then(resultado => {
    const procesado = procesar(resultado);
    return procesado;
  })
  .then(resultado => {
    console.log(resultado); // valor correcto
  });
```

### 2. No Manejar Errores en Promise.all

```javascript
// ❌ Malo: Una falla hace que todas fallen
Promise.all([operacion1(), operacion2(), operacion3()])
  .then(resultados => {
    // Solo se ejecuta si todas son exitosas
  })
  .catch(error => {
    // Se ejecuta si cualquiera falla
  });

// ✅ Bueno: Usar allSettled o manejar errores individuales
Promise.allSettled([operacion1(), operacion2(), operacion3()]).then(
  resultados => {
    // Siempre se ejecuta
    resultados.forEach((resultado, index) => {
      if (resultado.status === 'fulfilled') {
        console.log(`Operación ${index} exitosa`);
      } else {
        console.log(`Operación ${index} falló`);
      }
    });
  }
);
```

### 3. Promises en Loops

```javascript
// ❌ Malo: Ejecuta en secuencia
for (let i = 0; i < items.length; i++) {
  await procesarItem(items[i]);
}

// ✅ Bueno: Ejecuta en paralelo
await Promise.all(items.map(item => procesarItem(item)));

// ✅ Bueno: Control de concurrencia
const procesarEnLotes = async (items, tamañoLote = 5) => {
  for (let i = 0; i < items.length; i += tamañoLote) {
    const lote = items.slice(i, i + tamañoLote);
    await Promise.all(lote.map(item => procesarItem(item)));
  }
};
```

## 🔍 Debugging

### Herramientas de Debugging

```javascript
// 1. Logging detallado
const promesaConLog = new Promise((resolve, reject) => {
  console.log('Promise creada');

  setTimeout(() => {
    console.log('Promise resolviendo...');
    resolve('Valor');
  }, 1000);
});

promesaConLog
  .then(valor => {
    console.log('Then ejecutado:', valor);
    return valor;
  })
  .catch(error => {
    console.error('Catch ejecutado:', error);
  })
  .finally(() => {
    console.log('Finally ejecutado');
  });

// 2. Wrapper para debugging
const debug = (nombre, promesa) => {
  console.log(`[${nombre}] Iniciando...`);

  return promesa
    .then(resultado => {
      console.log(`[${nombre}] Exitoso:`, resultado);
      return resultado;
    })
    .catch(error => {
      console.error(`[${nombre}] Error:`, error);
      throw error;
    });
};

// Uso
debug('Operación API', fetch('/api/datos'))
  .then(response => debug('Parse JSON', response.json()))
  .then(datos => console.log('Datos finales:', datos));
```

### Stack Traces en Promises

```javascript
// Preservar stack traces
const operacionConStack = async () => {
  try {
    const resultado = await operacionRiesgosa();
    return resultado;
  } catch (error) {
    // Preservar stack trace original
    error.stack = `${error.stack}\n    at operacionConStack`;
    throw error;
  }
};

// Crear errores con contexto
const crearError = (mensaje, contexto) => {
  const error = new Error(mensaje);
  error.contexto = contexto;
  return error;
};
```

## 🎯 Casos de Uso Avanzados

### 1. Implementar Timeout

```javascript
const timeout = (promesa, ms) => {
  return Promise.race([
    promesa,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout')), ms);
    }),
  ]);
};

// Uso
timeout(fetch('/api/datos'), 5000)
  .then(response => response.json())
  .then(datos => console.log(datos))
  .catch(error => {
    if (error.message === 'Timeout') {
      console.error('Operación muy lenta');
    } else {
      console.error('Error:', error);
    }
  });
```

### 2. Implementar Retry con Backoff

```javascript
const retryConBackoff = async (
  operacion,
  maxIntentos = 3,
  delayBase = 1000
) => {
  for (let intento = 1; intento <= maxIntentos; intento++) {
    try {
      return await operacion();
    } catch (error) {
      if (intento === maxIntentos) {
        throw error;
      }

      const delay = delayBase * Math.pow(2, intento - 1);
      console.log(`Intento ${intento} falló, reintentando en ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};
```

### 3. Implementar Circuit Breaker

```javascript
class CircuitBreaker {
  constructor(threshold = 5, timeout = 60000) {
    this.threshold = threshold;
    this.timeout = timeout;
    this.failures = 0;
    this.lastFailureTime = null;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
  }

  async execute(operation) {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.failures = 0;
    this.state = 'CLOSED';
  }

  onFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();

    if (this.failures >= this.threshold) {
      this.state = 'OPEN';
    }
  }
}
```

## 🏆 Consejos para WorldSkills

### Patrones Rápidos de Implementar

```javascript
// 1. Promise factory
const createPromise = (valor, delay = 1000) => {
  return new Promise(resolve => {
    setTimeout(() => resolve(valor), delay);
  });
};

// 2. Batch processor
const processBatch = async (items, processor, batchSize = 5) => {
  const results = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(item => processor(item)));
    results.push(...batchResults);
  }

  return results;
};

// 3. Conditional execution
const executeIf = (condition, operation) => {
  return condition ? operation() : Promise.resolve(null);
};
```

### Debugging Rápido

```javascript
// Log wrapper
const log = (label, promise) => {
  return promise
    .then(result => {
      console.log(`✅ ${label}:`, result);
      return result;
    })
    .catch(error => {
      console.error(`❌ ${label}:`, error);
      throw error;
    });
};

// Performance monitoring
const measure = (label, promise) => {
  const start = Date.now();
  return promise.finally(() => {
    console.log(`⏱️ ${label}: ${Date.now() - start}ms`);
  });
};
```

¡Domina estas técnicas y serás imparable con Promises! 🚀
