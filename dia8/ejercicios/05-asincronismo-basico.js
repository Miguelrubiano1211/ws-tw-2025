/**
 * 📚 DÍA 8: JavaScript Avanzado II - Ejercicios de Asincronismo Básico
 *
 * Objetivos:
 * - Comprender el Event Loop y la naturaleza asíncrona de JavaScript
 * - Trabajar con setTimeout, setInterval y clearTimeout
 * - Manejar callbacks asíncronos
 * - Entender la diferencia entre síncrono y asíncrono
 * - Implementar patrones básicos de asincronismo
 */

console.log('⏰ === EJERCICIOS DE ASINCRONISMO BÁSICO ===');

// =====================================================
// 1. CONCEPTOS BÁSICOS DE ASINCRONISMO
// =====================================================

console.log('\n1. 🎯 Conceptos Básicos de Asincronismo');

// Demostración del comportamiento asíncrono
console.log('Inicio del programa');

setTimeout(() => {
  console.log('Ejecutado después de 1 segundo');
}, 1000);

console.log('Esta línea se ejecuta inmediatamente');

// Demostración del orden de ejecución
console.log('1. Código síncrono');

setTimeout(() => {
  console.log('3. Callback de setTimeout');
}, 0);

console.log('2. Más código síncrono');

// =====================================================
// 2. TRABAJANDO CON SETTIMEOUT Y SETINTERVAL
// =====================================================

console.log('\n2. ⏱️ Trabajando con setTimeout y setInterval');

// setTimeout básico
function saludarDespues(nombre, delay) {
  console.log(`Programando saludo para ${nombre} en ${delay}ms`);

  setTimeout(() => {
    console.log(`¡Hola ${nombre}! (después de ${delay}ms)`);
  }, delay);
}

saludarDespues('Ana', 1500);
saludarDespues('Luis', 2000);

// setInterval básico
let contador = 0;
const intervalo = setInterval(() => {
  contador++;
  console.log(`Contador: ${contador}`);

  if (contador >= 3) {
    clearInterval(intervalo);
    console.log('Intervalo detenido');
  }
}, 500);

// =====================================================
// 3. CALLBACKS ASÍNCRONOS
// =====================================================

console.log('\n3. 🔄 Callbacks Asíncronos');

// Función que simula una operación asíncrona
function operacionAsincrona(datos, callback) {
  console.log('Iniciando operación asíncrona...');

  setTimeout(() => {
    const resultado = datos.map(item => item * 2);
    callback(null, resultado);
  }, 1000);
}

// Usar el callback
operacionAsincrona([1, 2, 3, 4, 5], (error, resultado) => {
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Resultado:', resultado);
  }
});

// =====================================================
// 4. MANEJO DE ERRORES EN CALLBACKS
// =====================================================

console.log('\n4. 🚨 Manejo de Errores en Callbacks');

// Función que puede fallar
function operacionConError(datos, callback) {
  setTimeout(() => {
    if (!Array.isArray(datos)) {
      callback(new Error('Los datos deben ser un array'));
      return;
    }

    if (datos.length === 0) {
      callback(new Error('El array no puede estar vacío'));
      return;
    }

    const resultado = datos.reduce((sum, num) => sum + num, 0);
    callback(null, resultado);
  }, 800);
}

// Caso exitoso
operacionConError([10, 20, 30], (error, resultado) => {
  if (error) {
    console.error('Error en operación exitosa:', error.message);
  } else {
    console.log('Suma exitosa:', resultado);
  }
});

// Caso con error
operacionConError([], (error, resultado) => {
  if (error) {
    console.error('Error esperado:', error.message);
  } else {
    console.log('Resultado:', resultado);
  }
});

// =====================================================
// 5. CALLBACK HELL Y CÓMO EVITARLO
// =====================================================

console.log('\n5. 🔥 Callback Hell y Cómo Evitarlo');

// Ejemplo de callback hell
function obtenerUsuario(id, callback) {
  setTimeout(() => {
    callback(null, { id, nombre: 'Usuario ' + id });
  }, 500);
}

function obtenerPedidos(usuario, callback) {
  setTimeout(() => {
    callback(null, [
      { id: 1, usuario: usuario.id, producto: 'Laptop' },
      { id: 2, usuario: usuario.id, producto: 'Mouse' },
    ]);
  }, 500);
}

function obtenerDetalles(pedido, callback) {
  setTimeout(() => {
    callback(null, {
      ...pedido,
      precio: pedido.producto === 'Laptop' ? 1200 : 25,
      estado: 'Procesando',
    });
  }, 500);
}

// Callback hell (evitar esto)
obtenerUsuario(1, (error, usuario) => {
  if (error) {
    console.error('Error:', error);
    return;
  }

  obtenerPedidos(usuario, (error, pedidos) => {
    if (error) {
      console.error('Error:', error);
      return;
    }

    obtenerDetalles(pedidos[0], (error, detalles) => {
      if (error) {
        console.error('Error:', error);
        return;
      }

      console.log('Detalles del pedido:', detalles);
    });
  });
});

// Solución 1: Funciones nombradas
function manejarUsuario(error, usuario) {
  if (error) {
    console.error('Error:', error);
    return;
  }
  obtenerPedidos(usuario, manejarPedidos);
}

function manejarPedidos(error, pedidos) {
  if (error) {
    console.error('Error:', error);
    return;
  }
  obtenerDetalles(pedidos[0], manejarDetalles);
}

function manejarDetalles(error, detalles) {
  if (error) {
    console.error('Error:', error);
    return;
  }
  console.log('Detalles organizados:', detalles);
}

// Usar funciones nombradas
obtenerUsuario(2, manejarUsuario);

// =====================================================
// 6. DEBOUNCE Y THROTTLE
// =====================================================

console.log('\n6. 🎛️ Debounce y Throttle');

// Implementación de debounce
function debounce(func, delay) {
  let timeoutId;

  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// Implementación de throttle
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

// Función de ejemplo
function buscarDatos(termino) {
  console.log(`Buscando: ${termino}`);
}

// Crear versiones con debounce y throttle
const buscarConDebounce = debounce(buscarDatos, 300);
const buscarConThrottle = throttle(buscarDatos, 300);

// Simular búsquedas rápidas
console.log('--- Prueba de Debounce ---');
buscarConDebounce('a');
buscarConDebounce('ab');
buscarConDebounce('abc');
buscarConDebounce('abcd');

setTimeout(() => {
  console.log('--- Prueba de Throttle ---');
  buscarConThrottle('x');
  buscarConThrottle('xy');
  buscarConThrottle('xyz');
  buscarConThrottle('xyzw');
}, 1000);

// =====================================================
// 7. TEMPORIZADORES Y ANIMACIONES
// =====================================================

console.log('\n7. 🎨 Temporizadores y Animaciones');

// Simulador de animación
function animarPorcentaje(desde, hasta, duracion, callback) {
  const inicio = Date.now();
  const diferencia = hasta - desde;

  function frame() {
    const ahora = Date.now();
    const transcurrido = ahora - inicio;
    const progreso = Math.min(transcurrido / duracion, 1);

    const valorActual = desde + diferencia * progreso;
    callback(Math.round(valorActual));

    if (progreso < 1) {
      setTimeout(frame, 16); // ~60fps
    }
  }

  frame();
}

// Usar el animador
animarPorcentaje(0, 100, 2000, valor => {
  console.log(`Progreso: ${valor}%`);
});

// =====================================================
// 8. QUEUE DE TAREAS ASÍNCRONAS
// =====================================================

console.log('\n8. 📋 Queue de Tareas Asíncronas');

// Implementación de una cola de tareas
class ColaAsincrona {
  constructor() {
    this.tareas = [];
    this.ejecutando = false;
  }

  agregar(tarea) {
    this.tareas.push(tarea);
    this.procesar();
  }

  async procesar() {
    if (this.ejecutando || this.tareas.length === 0) {
      return;
    }

    this.ejecutando = true;

    while (this.tareas.length > 0) {
      const tarea = this.tareas.shift();
      try {
        await new Promise((resolve, reject) => {
          tarea(resolve, reject);
        });
      } catch (error) {
        console.error('Error en tarea:', error);
      }
    }

    this.ejecutando = false;
  }
}

// Usar la cola
const cola = new ColaAsincrona();

cola.agregar(resolve => {
  setTimeout(() => {
    console.log('Tarea 1 completada');
    resolve();
  }, 500);
});

cola.agregar(resolve => {
  setTimeout(() => {
    console.log('Tarea 2 completada');
    resolve();
  }, 300);
});

cola.agregar(resolve => {
  setTimeout(() => {
    console.log('Tarea 3 completada');
    resolve();
  }, 700);
});

// =====================================================
// 9. SIMULADOR DE PETICIONES HTTP
// =====================================================

console.log('\n9. 🌐 Simulador de Peticiones HTTP');

// Simulador de API
class SimuladorAPI {
  constructor() {
    this.latencia = 800;
    this.tasaError = 0.2; // 20% de errores
    this.datos = {
      usuarios: [
        { id: 1, nombre: 'Ana', email: 'ana@test.com' },
        { id: 2, nombre: 'Luis', email: 'luis@test.com' },
        { id: 3, nombre: 'María', email: 'maria@test.com' },
      ],
    };
  }

  obtenerUsuarios(callback) {
    setTimeout(() => {
      if (Math.random() < this.tasaError) {
        callback(new Error('Error de conexión'));
        return;
      }

      callback(null, this.datos.usuarios);
    }, this.latencia);
  }

  obtenerUsuario(id, callback) {
    setTimeout(() => {
      if (Math.random() < this.tasaError) {
        callback(new Error('Usuario no encontrado'));
        return;
      }

      const usuario = this.datos.usuarios.find(u => u.id === id);
      callback(null, usuario);
    }, this.latencia);
  }
}

// Usar el simulador
const api = new SimuladorAPI();

api.obtenerUsuarios((error, usuarios) => {
  if (error) {
    console.error('Error obteniendo usuarios:', error.message);
  } else {
    console.log('Usuarios obtenidos:', usuarios);
  }
});

api.obtenerUsuario(1, (error, usuario) => {
  if (error) {
    console.error('Error obteniendo usuario:', error.message);
  } else {
    console.log('Usuario obtenido:', usuario);
  }
});

// =====================================================
// 10. EJERCICIO PRÁCTICO: SISTEMA DE NOTIFICACIONES
// =====================================================

console.log('\n10. 🔔 Ejercicio Práctico: Sistema de Notificaciones');

class SistemaNotificaciones {
  constructor() {
    this.notificaciones = [];
    this.suscriptores = [];
  }

  suscribir(callback) {
    this.suscriptores.push(callback);
  }

  desuscribir(callback) {
    this.suscriptores = this.suscriptores.filter(sub => sub !== callback);
  }

  enviarNotificacion(mensaje, tipo = 'info', retraso = 0) {
    setTimeout(() => {
      const notificacion = {
        id: Date.now(),
        mensaje,
        tipo,
        timestamp: new Date().toISOString(),
      };

      this.notificaciones.push(notificacion);

      // Notificar a todos los suscriptores
      this.suscriptores.forEach(callback => {
        callback(notificacion);
      });

      // Auto-eliminación después de 5 segundos
      setTimeout(() => {
        this.eliminarNotificacion(notificacion.id);
      }, 5000);
    }, retraso);
  }

  eliminarNotificacion(id) {
    this.notificaciones = this.notificaciones.filter(n => n.id !== id);
    console.log(`Notificación ${id} eliminada automáticamente`);
  }

  obtenerNotificaciones() {
    return this.notificaciones;
  }
}

// Usar el sistema de notificaciones
const sistema = new SistemaNotificaciones();

// Suscribir manejadores
sistema.suscribir(notificacion => {
  console.log(`📧 EMAIL: ${notificacion.mensaje}`);
});

sistema.suscribir(notificacion => {
  console.log(
    `📱 PUSH: [${notificacion.tipo.toUpperCase()}] ${notificacion.mensaje}`
  );
});

// Enviar notificaciones
sistema.enviarNotificacion('Bienvenido al sistema', 'success');
sistema.enviarNotificacion('Tienes un nuevo mensaje', 'info', 1000);
sistema.enviarNotificacion('Error en el proceso', 'error', 2000);

// =====================================================
// 11. MEDICIÓN DE RENDIMIENTO ASÍNCRONO
// =====================================================

console.log('\n11. 📊 Medición de Rendimiento Asíncrono');

// Función para medir tiempo de operaciones asíncronas
function medirTiempoAsincrono(operacion, nombre) {
  const inicio = performance.now();

  operacion((error, resultado) => {
    const fin = performance.now();
    const tiempo = fin - inicio;

    if (error) {
      console.log(
        `${nombre}: ERROR (${tiempo.toFixed(2)}ms) - ${error.message}`
      );
    } else {
      console.log(`${nombre}: ÉXITO (${tiempo.toFixed(2)}ms)`);
    }
  });
}

// Operación rápida
medirTiempoAsincrono(callback => {
  setTimeout(() => callback(null, 'Operación rápida'), 100);
}, 'Operación rápida');

// Operación lenta
medirTiempoAsincrono(callback => {
  setTimeout(() => callback(null, 'Operación lenta'), 1000);
}, 'Operación lenta');

// =====================================================
// 12. PATRÓN OBSERVER CON CALLBACKS
// =====================================================

console.log('\n12. 👁️ Patrón Observer con Callbacks');

class EventManager {
  constructor() {
    this.eventos = {};
  }

  on(evento, callback) {
    if (!this.eventos[evento]) {
      this.eventos[evento] = [];
    }
    this.eventos[evento].push(callback);
  }

  off(evento, callback) {
    if (this.eventos[evento]) {
      this.eventos[evento] = this.eventos[evento].filter(cb => cb !== callback);
    }
  }

  emit(evento, datos) {
    if (this.eventos[evento]) {
      this.eventos[evento].forEach(callback => {
        setTimeout(() => callback(datos), 0);
      });
    }
  }
}

// Usar el Event Manager
const eventManager = new EventManager();

eventManager.on('usuario-conectado', datos => {
  console.log(`Usuario conectado: ${datos.nombre}`);
});

eventManager.on('usuario-conectado', datos => {
  console.log(`Registrando conexión de ${datos.nombre} en logs`);
});

eventManager.emit('usuario-conectado', { nombre: 'Juan', id: 123 });

console.log('\n✅ Ejercicios de Asincronismo Básico completados!');
console.log('💡 Conceptos practicados:');
console.log('   - Event Loop y naturaleza asíncrona');
console.log('   - setTimeout y setInterval');
console.log('   - Callbacks asíncronos');
console.log('   - Manejo de errores en callbacks');
console.log('   - Debounce y throttle');
console.log('   - Colas de tareas asíncronas');
console.log('   - Patrón Observer con callbacks');
console.log('   - Medición de rendimiento asíncrono');
