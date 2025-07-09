/**
 * 🎯 Ejercicio 3: Callbacks Básicos
 * 
 * Objetivo: Dominar el uso de callbacks en JavaScript
 * Tiempo estimado: 40 minutos
 * Dificultad: ⭐⭐⭐
 */

console.log("=== EJERCICIO 3: CALLBACKS BÁSICOS ===");

// =============================================================================
// PARTE 1: CONCEPTOS BÁSICOS DE CALLBACKS
// =============================================================================

console.log("\n--- PARTE 1: CONCEPTOS BÁSICOS ---");

/**
 * 1.1 Callback Simple
 * 
 * Comprende qué es un callback y cómo funciona.
 */

console.log("\n1.1 - Callback Simple:");

// Función que acepta un callback
function saludar(nombre, callback) {
    console.log(`Hola ${nombre}`);
    callback();
}

// TODO: Pasa una función como callback
saludar("Ana", function() {
    console.log("Callback ejecutado");
});

// TODO: Usa arrow function como callback
saludar("Carlos", /* tu código aquí */);

/**
 * 1.2 Callback con Parámetros
 * 
 * Pasa datos al callback.
 */

console.log("\n1.2 - Callback con Parámetros:");

function procesarNumeros(numeros, callback) {
    const resultado = numeros.map(x => x * 2);
    callback(resultado);
}

// TODO: Implementa callback que reciba resultado
procesarNumeros([1, 2, 3, 4], /* tu código aquí */);

/**
 * 1.3 Múltiples Callbacks
 * 
 * Usa diferentes callbacks para diferentes situaciones.
 */

console.log("\n1.3 - Múltiples Callbacks:");

function operacionMatematica(a, b, operacion, callback) {
    let resultado;
    
    switch(operacion) {
        case 'suma':
            resultado = a + b;
            break;
        case 'resta':
            resultado = a - b;
            break;
        case 'multiplicacion':
            resultado = a * b;
            break;
        case 'division':
            resultado = a / b;
            break;
        default:
            resultado = 0;
    }
    
    callback(resultado);
}

// TODO: Crea diferentes callbacks para diferentes casos
const mostrarResultado = /* tu código aquí */;
const validarResultado = /* tu código aquí */;

operacionMatematica(10, 5, 'suma', mostrarResultado);
operacionMatematica(10, 0, 'division', validarResultado);

// =============================================================================
// PARTE 2: CALLBACKS SÍNCRONOS
// =============================================================================

console.log("\n--- PARTE 2: CALLBACKS SÍNCRONOS ---");

/**
 * 2.1 Array Methods con Callbacks
 * 
 * Usa callbacks con métodos de array.
 */

console.log("\n2.1 - Array Methods con Callbacks:");

const estudiantes = [
    { nombre: "Ana", edad: 20, nota: 85 },
    { nombre: "Carlos", edad: 22, nota: 92 },
    { nombre: "María", edad: 19, nota: 78 },
    { nombre: "José", edad: 21, nota: 88 }
];

// TODO: Usa callbacks para filtrar estudiantes aprobados (nota >= 80)
const aprobados = estudiantes.filter(/* tu código aquí */);

// TODO: Usa callbacks para obtener solo nombres
const nombres = estudiantes.map(/* tu código aquí */);

// TODO: Usa callbacks para calcular promedio de notas
const promedioNotas = estudiantes.reduce(/* tu código aquí */);

console.log("Estudiantes aprobados:", aprobados);
console.log("Nombres:", nombres);
console.log("Promedio de notas:", promedioNotas);

/**
 * 2.2 Event Simulation con Callbacks
 * 
 * Simula sistema de eventos usando callbacks.
 */

console.log("\n2.2 - Event Simulation:");

function EventEmitter() {
    this.eventos = {};
}

EventEmitter.prototype.on = function(evento, callback) {
    if (!this.eventos[evento]) {
        this.eventos[evento] = [];
    }
    this.eventos[evento].push(callback);
};

EventEmitter.prototype.emit = function(evento, datos) {
    if (this.eventos[evento]) {
        this.eventos[evento].forEach(callback => callback(datos));
    }
};

// TODO: Crea un EventEmitter y registra callbacks
const emisor = new EventEmitter();

// TODO: Registra callbacks para diferentes eventos
emisor.on('usuario-creado', /* tu código aquí */);
emisor.on('usuario-creado', /* tu código aquí */);

// TODO: Emite eventos
emisor.emit('usuario-creado', { nombre: "Juan", id: 1 });

/**
 * 2.3 Validación con Callbacks
 * 
 * Implementa sistema de validación usando callbacks.
 */

console.log("\n2.3 - Validación con Callbacks:");

function validarCampo(valor, validaciones, callback) {
    const errores = [];
    
    validaciones.forEach(validacion => {
        const resultado = validacion(valor);
        if (resultado !== true) {
            errores.push(resultado);
        }
    });
    
    callback(errores.length === 0 ? null : errores);
}

// TODO: Crea funciones de validación
const esRequerido = valor => /* tu código aquí */;
const longitudMinima = longitud => valor => /* tu código aquí */;
const esEmail = valor => /* tu código aquí */;

// TODO: Valida diferentes campos
validarCampo("", [esRequerido], (errores) => {
    console.log("Validación campo vacío:", errores);
});

validarCampo("test@email.com", [esRequerido, esEmail], (errores) => {
    console.log("Validación email:", errores);
});

// =============================================================================
// PARTE 3: CALLBACKS ASÍNCRONOS
// =============================================================================

console.log("\n--- PARTE 3: CALLBACKS ASÍNCRONOS ---");

/**
 * 3.1 setTimeout con Callbacks
 * 
 * Usa callbacks con operaciones asíncronas.
 */

console.log("\n3.1 - setTimeout con Callbacks:");

function esperarYEjecutar(tiempo, callback) {
    console.log(`Esperando ${tiempo}ms...`);
    setTimeout(() => {
        callback("¡Tiempo terminado!");
    }, tiempo);
}

// TODO: Usa callback con setTimeout
esperarYEjecutar(1000, /* tu código aquí */);

/**
 * 3.2 Simulación de API con Callbacks
 * 
 * Simula llamadas a API usando callbacks.
 */

console.log("\n3.2 - Simulación de API:");

function obtenerUsuario(id, callback) {
    // Simula demora de red
    setTimeout(() => {
        const usuarios = {
            1: { id: 1, nombre: "Ana", email: "ana@email.com" },
            2: { id: 2, nombre: "Carlos", email: "carlos@email.com" },
            3: { id: 3, nombre: "María", email: "maria@email.com" }
        };
        
        const usuario = usuarios[id];
        if (usuario) {
            callback(null, usuario);
        } else {
            callback("Usuario no encontrado", null);
        }
    }, 500);
}

// TODO: Usa callback para manejar éxito y error
obtenerUsuario(1, /* tu código aquí */);
obtenerUsuario(999, /* tu código aquí */);

/**
 * 3.3 Cadena de Callbacks
 * 
 * Encadena múltiples operaciones asíncronas.
 */

console.log("\n3.3 - Cadena de Callbacks:");

function obtenerPerfil(userId, callback) {
    obtenerUsuario(userId, (error, usuario) => {
        if (error) {
            callback(error, null);
            return;
        }
        
        // Simula obtener datos adicionales
        setTimeout(() => {
            const perfil = {
                ...usuario,
                edad: 25,
                ciudad: "Madrid"
            };
            callback(null, perfil);
        }, 300);
    });
}

function obtenerPublicaciones(userId, callback) {
    setTimeout(() => {
        const publicaciones = [
            { id: 1, titulo: "Mi primera publicación", autor: userId },
            { id: 2, titulo: "Aprendiendo JavaScript", autor: userId }
        ];
        callback(null, publicaciones);
    }, 400);
}

// TODO: Encadena callbacks para obtener perfil completo
obtenerPerfil(1, (error, perfil) => {
    if (error) {
        console.log("Error obteniendo perfil:", error);
        return;
    }
    
    console.log("Perfil obtenido:", perfil);
    
    // TODO: Obtén publicaciones del usuario
    obtenerPublicaciones(perfil.id, /* tu código aquí */);
});

// =============================================================================
// PARTE 4: MANEJO DE ERRORES
// =============================================================================

console.log("\n--- PARTE 4: MANEJO DE ERRORES ---");

/**
 * 4.1 Error-First Callbacks
 * 
 * Implementa el patrón error-first callback.
 */

console.log("\n4.1 - Error-First Callbacks:");

function operacionConError(exito, callback) {
    setTimeout(() => {
        if (exito) {
            callback(null, "Operación exitosa");
        } else {
            callback(new Error("Algo salió mal"), null);
        }
    }, 100);
}

// TODO: Maneja error y éxito apropiadamente
operacionConError(true, /* tu código aquí */);
operacionConError(false, /* tu código aquí */);

/**
 * 4.2 Try-Catch con Callbacks
 * 
 * Maneja errores síncronos en callbacks.
 */

console.log("\n4.2 - Try-Catch con Callbacks:");

function procesarDatos(datos, callback) {
    try {
        const resultado = datos.map(item => {
            if (typeof item !== 'number') {
                throw new Error(`Tipo inválido: ${typeof item}`);
            }
            return item * 2;
        });
        callback(null, resultado);
    } catch (error) {
        callback(error, null);
    }
}

// TODO: Testa con datos válidos e inválidos
procesarDatos([1, 2, 3], /* tu código aquí */);
procesarDatos([1, "texto", 3], /* tu código aquí */);

// =============================================================================
// PARTE 5: EJERCICIOS PRÁCTICOS
// =============================================================================

console.log("\n--- PARTE 5: EJERCICIOS PRÁCTICOS ---");

/**
 * 5.1 Sistema de Autenticación
 * 
 * Implementa un sistema de autenticación con callbacks.
 */

console.log("\n5.1 - Sistema de Autenticación:");

const usuarios = [
    { username: "admin", password: "123456", rol: "admin" },
    { username: "usuario", password: "password", rol: "user" }
];

function autenticar(username, password, callback) {
    // TODO: Implementa autenticación
    setTimeout(() => {
        const usuario = usuarios.find(u => u.username === username);
        
        if (!usuario) {
            callback("Usuario no encontrado", null);
            return;
        }
        
        if (usuario.password !== password) {
            callback("Contraseña incorrecta", null);
            return;
        }
        
        callback(null, { username: usuario.username, rol: usuario.rol });
    }, 200);
}

// TODO: Testa el sistema de autenticación
autenticar("admin", "123456", /* tu código aquí */);
autenticar("admin", "wrong", /* tu código aquí */);

/**
 * 5.2 Procesador de Archivos
 * 
 * Simula procesamiento de archivos con callbacks.
 */

console.log("\n5.2 - Procesador de Archivos:");

function leerArchivo(nombreArchivo, callback) {
    // Simula lectura de archivo
    setTimeout(() => {
        const archivos = {
            "datos.txt": "Contenido del archivo de datos",
            "config.json": '{"tema": "oscuro", "idioma": "es"}',
            "log.txt": "2024-01-01 10:00:00 - Aplicación iniciada"
        };
        
        const contenido = archivos[nombreArchivo];
        if (contenido) {
            callback(null, contenido);
        } else {
            callback("Archivo no encontrado", null);
        }
    }, 150);
}

function procesarArchivo(nombreArchivo, callback) {
    // TODO: Lee archivo y procesa contenido
    leerArchivo(nombreArchivo, (error, contenido) => {
        if (error) {
            callback(error, null);
            return;
        }
        
        // TODO: Procesa contenido según tipo de archivo
        if (nombreArchivo.endsWith('.json')) {
            try {
                const datos = JSON.parse(contenido);
                callback(null, datos);
            } catch (e) {
                callback("Error parsing JSON", null);
            }
        } else {
            callback(null, contenido.toUpperCase());
        }
    });
}

// TODO: Procesa diferentes tipos de archivos
procesarArchivo("config.json", /* tu código aquí */);
procesarArchivo("datos.txt", /* tu código aquí */);

/**
 * 5.3 Sistema de Notificaciones
 * 
 * Crea un sistema de notificaciones con callbacks.
 */

console.log("\n5.3 - Sistema de Notificaciones:");

function SistemaNotificaciones() {
    this.suscriptores = {};
}

SistemaNotificaciones.prototype.suscribir = function(evento, callback) {
    // TODO: Implementa suscripción
    if (!this.suscriptores[evento]) {
        this.suscriptores[evento] = [];
    }
    this.suscriptores[evento].push(callback);
};

SistemaNotificaciones.prototype.notificar = function(evento, datos) {
    // TODO: Implementa notificación
    if (this.suscriptores[evento]) {
        this.suscriptores[evento].forEach(callback => {
            setTimeout(() => callback(datos), 0);
        });
    }
};

// TODO: Crea sistema y suscribe callbacks
const notificaciones = new SistemaNotificaciones();

notificaciones.suscribir('pedido-creado', /* tu código aquí */);
notificaciones.suscribir('usuario-registrado', /* tu código aquí */);

// TODO: Envía notificaciones
notificaciones.notificar('pedido-creado', { id: 123, total: 99.99 });
notificaciones.notificar('usuario-registrado', { nombre: "Juan", email: "juan@email.com" });

// =============================================================================
// PARTE 6: CALLBACK HELL Y SOLUCIONES
// =============================================================================

console.log("\n--- PARTE 6: CALLBACK HELL ---");

/**
 * 6.1 Ejemplo de Callback Hell
 * 
 * Muestra el problema del callback hell.
 */

console.log("\n6.1 - Callback Hell:");

function operacionA(callback) {
    setTimeout(() => callback(null, "Resultado A"), 100);
}

function operacionB(data, callback) {
    setTimeout(() => callback(null, data + " -> Resultado B"), 100);
}

function operacionC(data, callback) {
    setTimeout(() => callback(null, data + " -> Resultado C"), 100);
}

// TODO: Muestra callback hell
operacionA((errorA, resultadoA) => {
    if (errorA) {
        console.log("Error A:", errorA);
        return;
    }
    
    operacionB(resultadoA, (errorB, resultadoB) => {
        if (errorB) {
            console.log("Error B:", errorB);
            return;
        }
        
        operacionC(resultadoB, (errorC, resultadoC) => {
            if (errorC) {
                console.log("Error C:", errorC);
                return;
            }
            
            console.log("Resultado final:", resultadoC);
        });
    });
});

/**
 * 6.2 Solución con Funciones Nombradas
 * 
 * Mejora el código usando funciones nombradas.
 */

console.log("\n6.2 - Solución con Funciones Nombradas:");

function manejarA(error, resultado) {
    if (error) {
        console.log("Error A:", error);
        return;
    }
    operacionB(resultado, manejarB);
}

function manejarB(error, resultado) {
    if (error) {
        console.log("Error B:", error);
        return;
    }
    operacionC(resultado, manejarC);
}

function manejarC(error, resultado) {
    if (error) {
        console.log("Error C:", error);
        return;
    }
    console.log("Resultado final (mejorado):", resultado);
}

// TODO: Usa funciones nombradas
operacionA(manejarA);

// =============================================================================
// PARTE 7: PREGUNTAS DE REFLEXIÓN
// =============================================================================

console.log("\n--- PARTE 7: PREGUNTAS DE REFLEXIÓN ---");

/**
 * Responde estas preguntas con comentarios:
 * 
 * 1. ¿Qué es un callback y cuándo es útil?
 * // Tu respuesta aquí
 * 
 * 2. ¿Cuál es la diferencia entre callbacks síncronos y asíncronos?
 * // Tu respuesta aquí
 * 
 * 3. ¿Qué es el callback hell y cómo se puede evitar?
 * // Tu respuesta aquí
 * 
 * 4. ¿Cuándo usar error-first callbacks?
 * // Tu respuesta aquí
 * 
 * 5. ¿Qué alternativas existen a los callbacks?
 * // Tu respuesta aquí
 */

// =============================================================================
// RESPUESTAS Y SOLUCIONES
// =============================================================================

/**
 * Puntos clave a recordar:
 * - Callbacks son funciones pasadas como argumentos
 * - Pueden ser síncronos o asíncronos
 * - Error-first callbacks son un patrón común
 * - Callback hell es un problema real
 * - Usar funciones nombradas mejora legibilidad
 * - Promises y async/await son alternativas modernas
 */

console.log("\n=== FIN DEL EJERCICIO 3 ===");
