/**
 * 🚀 Ejercicio 1: Promises Básicas
 *
 * Objetivo: Dominar la creación y uso básico de Promises
 * Conceptos: Constructor Promise, resolve/reject, then/catch/finally
 *
 * Instrucciones:
 * 1. Completa cada función siguiendo los comentarios
 * 2. Ejecuta el código y verifica que funcione correctamente
 * 3. Experimenta con diferentes valores y tiempos
 */

console.log('🚀 Ejercicio 1: Promises Básicas');

// =============================================================================
// 1. CREACIÓN DE PROMISES BÁSICAS
// =============================================================================

/**
 * Crea una promise que resuelve después de un tiempo específico
 * @param {number} tiempo - Tiempo en milisegundos
 * @param {string} mensaje - Mensaje a resolver
 * @returns {Promise<string>} Promise que resuelve con el mensaje
 */
function crearPromiseTemporal(tiempo, mensaje) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(`⏰ Resolviendo después de ${tiempo}ms: ${mensaje}`);
      resolve(mensaje);
    }, tiempo);
  });
}

// Ejemplo de uso
console.log('\n📝 Ejemplo 1: Promise con tiempo');
crearPromiseTemporal(1000, '¡Hola desde el futuro!').then(resultado => {
  console.log('✅ Promise resuelta:', resultado);
});

// =============================================================================
// 2. PROMISE CON POSIBILIDAD DE ERROR
// =============================================================================

/**
 * Crea una promise que puede resolver o rechazar basado en una condición
 * @param {number} numero - Número para evaluar
 * @returns {Promise<string>} Promise que resuelve o rechaza
 */
function promiseCondicional(numero) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (numero > 5) {
        resolve(`✅ Número ${numero} es mayor que 5`);
      } else {
        reject(`❌ Número ${numero} es menor o igual a 5`);
      }
    }, 500);
  });
}

// Ejemplo de uso
console.log('\n📝 Ejemplo 2: Promise condicional');
promiseCondicional(8)
  .then(resultado => {
    console.log('Éxito:', resultado);
  })
  .catch(error => {
    console.error('Error:', error);
  });

promiseCondicional(3)
  .then(resultado => {
    console.log('Éxito:', resultado);
  })
  .catch(error => {
    console.error('Error:', error);
  });

// =============================================================================
// 3. PROMISE CON FINALLY
// =============================================================================

/**
 * Simula una operación de login que puede fallar
 * @param {string} usuario - Nombre de usuario
 * @param {string} password - Contraseña
 * @returns {Promise<object>} Promise con resultado del login
 */
function intentarLogin(usuario, password) {
  return new Promise((resolve, reject) => {
    console.log(`🔐 Intentando login para: ${usuario}`);

    setTimeout(() => {
      if (usuario === 'admin' && password === '123456') {
        resolve({
          usuario: usuario,
          token: 'abc123',
          timestamp: new Date().toISOString(),
        });
      } else {
        reject(new Error('Credenciales inválidas'));
      }
    }, 1000);
  });
}

// Ejemplo de uso con finally
console.log('\n📝 Ejemplo 3: Promise con finally');
intentarLogin('admin', '123456')
  .then(resultado => {
    console.log('✅ Login exitoso:', resultado);
  })
  .catch(error => {
    console.error('❌ Login falló:', error.message);
  })
  .finally(() => {
    console.log('🔄 Proceso de login completado');
  });

// =============================================================================
// 4. EJERCICIO PRÁCTICO: SIMULADOR DE DESCARGA
// =============================================================================

/**
 * Simula la descarga de un archivo con progreso
 * @param {string} archivo - Nombre del archivo
 * @param {number} tamaño - Tamaño en MB
 * @returns {Promise<object>} Promise con resultado de descarga
 */
function simularDescarga(archivo, tamaño) {
  return new Promise((resolve, reject) => {
    console.log(`📥 Iniciando descarga de ${archivo} (${tamaño}MB)`);

    const tiempoDescarga = tamaño * 100; // 100ms por MB
    let progreso = 0;

    const intervalo = setInterval(() => {
      progreso += 10;
      console.log(`📊 Progreso: ${progreso}%`);

      if (progreso >= 100) {
        clearInterval(intervalo);

        // Simular posible error (10% de probabilidad)
        if (Math.random() < 0.1) {
          reject(new Error('Error de red durante la descarga'));
        } else {
          resolve({
            archivo: archivo,
            tamaño: tamaño,
            completado: new Date().toISOString(),
          });
        }
      }
    }, tiempoDescarga / 10);
  });
}

// Ejemplo de uso
console.log('\n📝 Ejemplo 4: Simulador de descarga');
simularDescarga('documento.pdf', 5)
  .then(resultado => {
    console.log('✅ Descarga completada:', resultado);
  })
  .catch(error => {
    console.error('❌ Descarga falló:', error.message);
  })
  .finally(() => {
    console.log('🔄 Proceso de descarga terminado');
  });

// =============================================================================
// 5. EJERCICIO PRÁCTICO: VALIDADOR DE DATOS
// =============================================================================

/**
 * Valida un email de forma asíncrona
 * @param {string} email - Email a validar
 * @returns {Promise<boolean>} Promise que resuelve con validación
 */
function validarEmail(email) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (typeof email !== 'string') {
        reject(new Error('Email debe ser una cadena de texto'));
        return;
      }

      if (email.length === 0) {
        reject(new Error('Email no puede estar vacío'));
        return;
      }

      if (regexEmail.test(email)) {
        resolve(true);
      } else {
        resolve(false);
      }
    }, 300);
  });
}

/**
 * Valida un usuario completo
 * @param {object} usuario - Objeto con datos del usuario
 * @returns {Promise<object>} Promise con resultado de validación
 */
function validarUsuario(usuario) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const errores = [];

      if (!usuario.nombre || usuario.nombre.length < 2) {
        errores.push('Nombre debe tener al menos 2 caracteres');
      }

      if (!usuario.edad || usuario.edad < 18) {
        errores.push('Debe ser mayor de edad');
      }

      if (errores.length > 0) {
        reject(new Error(errores.join(', ')));
      } else {
        resolve({
          valido: true,
          usuario: usuario,
          validadoEn: new Date().toISOString(),
        });
      }
    }, 500);
  });
}

// Ejemplo de uso
console.log('\n📝 Ejemplo 5: Validador de datos');

// Validar email
validarEmail('usuario@ejemplo.com')
  .then(esValido => {
    console.log('✅ Email válido:', esValido);
  })
  .catch(error => {
    console.error('❌ Error validando email:', error.message);
  });

// Validar usuario completo
const usuarioTest = {
  nombre: 'Juan Pérez',
  edad: 25,
  email: 'juan@ejemplo.com',
};

validarUsuario(usuarioTest)
  .then(resultado => {
    console.log('✅ Usuario válido:', resultado);
  })
  .catch(error => {
    console.error('❌ Usuario inválido:', error.message);
  });

// =============================================================================
// 6. EJERCICIO PRÁCTICO: SISTEMA DE CACHE
// =============================================================================

/**
 * Simula obtener datos de una API con cache
 * @param {string} url - URL de la API
 * @returns {Promise<object>} Promise con datos
 */
function obtenerDatosAPI(url) {
  return new Promise((resolve, reject) => {
    console.log(`🌐 Obteniendo datos de: ${url}`);

    setTimeout(() => {
      // Simular diferentes respuestas basadas en la URL
      if (url.includes('usuarios')) {
        resolve({
          datos: [
            { id: 1, nombre: 'Juan' },
            { id: 2, nombre: 'María' },
          ],
          timestamp: new Date().toISOString(),
        });
      } else if (url.includes('productos')) {
        resolve({
          datos: [
            { id: 1, nombre: 'Laptop', precio: 1000 },
            { id: 2, nombre: 'Mouse', precio: 25 },
          ],
          timestamp: new Date().toISOString(),
        });
      } else {
        reject(new Error('URL no encontrada'));
      }
    }, 1000);
  });
}

// Sistema de cache simple
const cache = new Map();

/**
 * Obtiene datos con cache
 * @param {string} url - URL a consultar
 * @returns {Promise<object>} Promise con datos (cacheados o fresh)
 */
function obtenerConCache(url) {
  return new Promise((resolve, reject) => {
    // Verificar cache
    if (cache.has(url)) {
      console.log(`💾 Datos obtenidos del cache para: ${url}`);
      resolve(cache.get(url));
      return;
    }

    // Obtener de la API
    obtenerDatosAPI(url)
      .then(datos => {
        console.log(`💾 Guardando en cache: ${url}`);
        cache.set(url, datos);
        resolve(datos);
      })
      .catch(error => {
        reject(error);
      });
  });
}

// Ejemplo de uso
console.log('\n📝 Ejemplo 6: Sistema de cache');

// Primera llamada (sin cache)
obtenerConCache('https://api.ejemplo.com/usuarios')
  .then(datos => {
    console.log('✅ Datos obtenidos:', datos);

    // Segunda llamada (con cache)
    return obtenerConCache('https://api.ejemplo.com/usuarios');
  })
  .then(datos => {
    console.log('✅ Datos del cache:', datos);
  })
  .catch(error => {
    console.error('❌ Error:', error.message);
  });

// =============================================================================
// 7. EJERCICIO PRÁCTICO: PROMISIFY
// =============================================================================

/**
 * Función callback tradicional que queremos convertir a Promise
 * @param {string} mensaje - Mensaje a procesar
 * @param {function} callback - Callback tradicional
 */
function funcionCallback(mensaje, callback) {
  setTimeout(() => {
    if (mensaje.length > 0) {
      callback(null, `Procesado: ${mensaje}`);
    } else {
      callback(new Error('Mensaje vacío'));
    }
  }, 500);
}

/**
 * Convierte una función callback a Promise
 * @param {function} funcionCallback - Función que usa callbacks
 * @returns {function} Función que retorna Promise
 */
function promisify(funcionCallback) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      funcionCallback(...args, (error, resultado) => {
        if (error) {
          reject(error);
        } else {
          resolve(resultado);
        }
      });
    });
  };
}

// Convertir función callback a Promise
const funcionPromise = promisify(funcionCallback);

// Ejemplo de uso
console.log('\n📝 Ejemplo 7: Promisify');
funcionPromise('Hola mundo')
  .then(resultado => {
    console.log('✅ Resultado:', resultado);
  })
  .catch(error => {
    console.error('❌ Error:', error.message);
  });

// =============================================================================
// 8. EJERCICIOS PARA COMPLETAR
// =============================================================================

console.log('\n🎯 Ejercicios para completar:');

// EJERCICIO A: Crea una función que simule el procesamiento de un pedido
// Debe tomar un objeto pedido y retornar una Promise
// Si el pedido tiene todos los campos requeridos, debe resolver
// Si falta algún campo, debe rechazar
function procesarPedido(pedido) {
  // TODO: Implementar función que retorne una Promise
  return new Promise((resolve, reject) => {
    // Validar campos requeridos: id, producto, cantidad, precio
    const camposRequeridos = ['id', 'producto', 'cantidad', 'precio'];
    const camposFaltantes = [];

    for (const campo of camposRequeridos) {
      if (!pedido[campo]) {
        camposFaltantes.push(campo);
      }
    }

    setTimeout(() => {
      if (camposFaltantes.length > 0) {
        reject(new Error(`Campos faltantes: ${camposFaltantes.join(', ')}`));
      } else {
        resolve({
          pedidoId: pedido.id,
          estado: 'procesado',
          total: pedido.cantidad * pedido.precio,
          procesadoEn: new Date().toISOString(),
        });
      }
    }, 800);
  });
}

// EJERCICIO B: Crea una función que simule envío de notificación
// Debe tomar un mensaje y un tipo (email, sms, push)
// Debe fallar aleatoriamente 20% de las veces
function enviarNotificacion(mensaje, tipo) {
  // TODO: Implementar función que retorne una Promise
  return new Promise((resolve, reject) => {
    const tiposValidos = ['email', 'sms', 'push'];

    if (!tiposValidos.includes(tipo)) {
      reject(new Error(`Tipo de notificación inválido: ${tipo}`));
      return;
    }

    setTimeout(() => {
      // Simular fallo aleatorio 20% de las veces
      if (Math.random() < 0.2) {
        reject(new Error(`Error enviando notificación ${tipo}`));
      } else {
        resolve({
          mensaje: mensaje,
          tipo: tipo,
          enviado: true,
          timestamp: new Date().toISOString(),
        });
      }
    }, 600);
  });
}

// EJERCICIO C: Crea una función que combine procesarPedido y enviarNotificacion
// Debe procesar el pedido y luego enviar una notificación
// Usar encadenamiento de promises
function procesarPedidoCompleto(pedido) {
  // TODO: Implementar función que combine ambas operaciones
  return procesarPedido(pedido)
    .then(resultado => {
      console.log('✅ Pedido procesado:', resultado);

      // Enviar notificación de confirmación
      return enviarNotificacion(
        `Pedido ${resultado.pedidoId} procesado exitosamente`,
        'email'
      );
    })
    .then(notificacion => {
      console.log('✅ Notificación enviada:', notificacion);
      return {
        pedidoProcesado: true,
        notificacionEnviada: true,
      };
    });
}

// Prueba tus ejercicios
console.log('\n🧪 Probando ejercicios:');

// Prueba del ejercicio A
const pedidoTest = {
  id: 'PED001',
  producto: 'Laptop',
  cantidad: 2,
  precio: 1000,
};

procesarPedido(pedidoTest)
  .then(resultado => {
    console.log('✅ Pedido procesado:', resultado);
  })
  .catch(error => {
    console.error('❌ Error procesando pedido:', error.message);
  });

// Prueba del ejercicio B
enviarNotificacion('Pedido confirmado', 'email')
  .then(resultado => {
    console.log('✅ Notificación enviada:', resultado);
  })
  .catch(error => {
    console.error('❌ Error enviando notificación:', error.message);
  });

// Prueba del ejercicio C
procesarPedidoCompleto(pedidoTest)
  .then(resultado => {
    console.log('✅ Proceso completo:', resultado);
  })
  .catch(error => {
    console.error('❌ Error en proceso completo:', error.message);
  });

// =============================================================================
// 9. DESAFÍO AVANZADO
// =============================================================================

console.log('\n🔥 Desafío avanzado:');

/**
 * Crea un sistema de retry que intente una operación hasta 3 veces
 * @param {function} operacion - Función que retorna Promise
 * @param {number} maxIntentos - Número máximo de intentos
 * @returns {Promise} Promise con resultado o error final
 */
function conReintentos(operacion, maxIntentos = 3) {
  return new Promise((resolve, reject) => {
    let intentos = 0;

    function intentar() {
      intentos++;
      console.log(`🔄 Intento ${intentos} de ${maxIntentos}`);

      operacion()
        .then(resultado => {
          console.log(`✅ Éxito en intento ${intentos}`);
          resolve(resultado);
        })
        .catch(error => {
          console.log(`❌ Falló intento ${intentos}: ${error.message}`);

          if (intentos < maxIntentos) {
            setTimeout(intentar, 1000); // Esperar 1 segundo antes del siguiente intento
          } else {
            reject(
              new Error(
                `Falló después de ${maxIntentos} intentos: ${error.message}`
              )
            );
          }
        });
    }

    intentar();
  });
}

// Operación que falla 70% de las veces
function operacionInestable() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.3) {
        resolve('¡Operación exitosa!');
      } else {
        reject(new Error('Operación falló'));
      }
    }, 500);
  });
}

// Probar sistema de retry
conReintentos(operacionInestable, 3)
  .then(resultado => {
    console.log('🎉 Resultado final:', resultado);
  })
  .catch(error => {
    console.error('💥 Error final:', error.message);
  });

// =============================================================================
// 10. RESUMEN Y CONCLUSIONES
// =============================================================================

setTimeout(() => {
  console.log('\n📚 Resumen del Ejercicio 1:');
  console.log('✅ Creaste Promises básicas con resolve/reject');
  console.log('✅ Usaste then/catch/finally correctamente');
  console.log('✅ Implementaste validación y cache con Promises');
  console.log('✅ Convertiste funciones callback a Promises');
  console.log('✅ Creaste un sistema de retry avanzado');
  console.log('\n🎯 Conceptos dominados:');
  console.log('- Constructor Promise');
  console.log('- Estados de Promise (pending, fulfilled, rejected)');
  console.log('- Métodos then(), catch(), finally()');
  console.log('- Manejo de errores asíncronos');
  console.log('- Promisification de callbacks');
  console.log('\n🚀 ¡Listo para el siguiente ejercicio!');
}, 5000);
