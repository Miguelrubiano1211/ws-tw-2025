/**
 * 🎯 Ejercicio 2: Arrow Functions
 * 
 * Objetivo: Dominar la sintaxis y comportamiento de las arrow functions
 * Tiempo estimado: 30 minutos
 * Dificultad: ⭐⭐
 */

console.log("=== EJERCICIO 2: ARROW FUNCTIONS ===");

// =============================================================================
// PARTE 1: SINTAXIS BÁSICA
// =============================================================================

console.log("\n--- PARTE 1: SINTAXIS BÁSICA ---");

/**
 * 1.1 Conversión de Funciones Tradicionales
 * 
 * Convierte las siguientes funciones tradicionales a arrow functions.
 */

console.log("\n1.1 - Conversión de Funciones:");

// Función tradicional
function suma(a, b) {
    return a + b;
}

// TODO: Convierte a arrow function
const sumaArrow = /* tu código aquí */;

// Función con un solo parámetro
function cuadrado(x) {
    return x * x;
}

// TODO: Convierte a arrow function (sin paréntesis para parámetro único)
const cuadradoArrow = /* tu código aquí */;

// Función sin parámetros
function obtenerFechaActual() {
    return new Date();
}

// TODO: Convierte a arrow function
const obtenerFechaActualArrow = /* tu código aquí */;

// Función con múltiples líneas
function procesarTexto(texto) {
    const textoLimpio = texto.trim();
    const textoMayusculas = textoLimpio.toUpperCase();
    return textoMayusculas;
}

// TODO: Convierte a arrow function
const procesarTextoArrow = /* tu código aquí */;

// Testa las conversiones
console.log("Suma tradicional:", suma(5, 3));
console.log("Suma arrow:", sumaArrow(5, 3));
console.log("Cuadrado tradicional:", cuadrado(4));
console.log("Cuadrado arrow:", cuadradoArrow(4));

/**
 * 1.2 Return Implícito
 * 
 * Aprovecha el return implícito cuando sea posible.
 */

console.log("\n1.2 - Return Implícito:");

// TODO: Simplifica estas arrow functions usando return implícito
const doble = (x) => {
    return x * 2;
};

const saludo = (nombre) => {
    return `Hola, ${nombre}!`;
};

const esMayor = (edad) => {
    return edad >= 18;
};

// Versiones simplificadas
const dobleSimple = /* tu código aquí */;
const saludoSimple = /* tu código aquí */;
const esMayorSimple = /* tu código aquí */;

console.log("Doble:", dobleSimple(5));
console.log("Saludo:", saludoSimple("Ana"));
console.log("Es mayor:", esMayorSimple(20));

/**
 * 1.3 Objetos con Return Implícito
 * 
 * Crea objetos usando return implícito (recuerda usar paréntesis).
 */

console.log("\n1.3 - Objetos con Return Implícito:");

// TODO: Crea arrow functions que retornen objetos
const crearPersona = (nombre, edad) => /* tu código aquí */;

const crearProducto = (nombre, precio) => /* tu código aquí */;

const crearCoordenadas = (x, y) => /* tu código aquí */;

// Testa las funciones
console.log("Persona:", crearPersona("Carlos", 25));
console.log("Producto:", crearProducto("Laptop", 999));
console.log("Coordenadas:", crearCoordenadas(10, 20));

// =============================================================================
// PARTE 2: DIFERENCIAS CON FUNCIONES TRADICIONALES
// =============================================================================

console.log("\n--- PARTE 2: DIFERENCIAS CON FUNCIONES TRADICIONALES ---");

/**
 * 2.1 Hoisting
 * 
 * Demuestra que las arrow functions no hacen hoisting.
 */

console.log("\n2.1 - Hoisting:");

// TODO: Predice qué funcionará y qué no
// funcionTradicional(); // ¿Funcionará?
// funcionArrow(); // ¿Funcionará?

function funcionTradicional() {
    console.log("Función tradicional llamada");
}

const funcionArrow = () => {
    console.log("Arrow function llamada");
};

// Ahora las llamamos
funcionTradicional();
funcionArrow();

/**
 * 2.2 Arguments Object
 * 
 * Demuestra que las arrow functions no tienen arguments object.
 */

console.log("\n2.2 - Arguments Object:");

function funcionConArguments() {
    console.log("Arguments en función tradicional:", arguments);
}

const arrowSinArguments = () => {
    // console.log("Arguments en arrow function:", arguments); // Error
    console.log("Arrow function no tiene arguments");
};

// TODO: Usa rest parameters en arrow function para reemplazar arguments
const arrowConRest = (/* tu código aquí */) => {
    console.log("Rest parameters en arrow function:", /* tu código aquí */);
};

funcionConArguments(1, 2, 3);
arrowSinArguments(1, 2, 3);
arrowConRest(1, 2, 3);

/**
 * 2.3 Contexto `this`
 * 
 * Demuestra cómo las arrow functions manejan `this` diferente.
 */

console.log("\n2.3 - Contexto this:");

const objeto = {
    nombre: "Mi Objeto",
    
    // Método tradicional
    metodoTradicional: function() {
        console.log("Método tradicional - this.nombre:", this.nombre);
    },
    
    // Arrow function como método
    metodoArrow: () => {
        console.log("Arrow function - this.nombre:", this.nombre); // undefined
    },
    
    // Método que usa arrow function internamente
    metodoConArrowInterna: function() {
        console.log("Método externo - this.nombre:", this.nombre);
        
        const arrowInterna = () => {
            console.log("Arrow interna - this.nombre:", this.nombre);
        };
        
        arrowInterna();
    }
};

objeto.metodoTradicional();
objeto.metodoArrow();
objeto.metodoConArrowInterna();

// =============================================================================
// PARTE 3: CASOS DE USO PRÁCTICOS
// =============================================================================

console.log("\n--- PARTE 3: CASOS DE USO PRÁCTICOS ---");

/**
 * 3.1 Array Methods
 * 
 * Usa arrow functions con métodos de array.
 */

console.log("\n3.1 - Array Methods:");

const numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// TODO: Usa arrow functions para estos métodos
const pares = numeros.filter(/* tu código aquí */);
const cuadrados = numeros.map(/* tu código aquí */);
const suma = numeros.reduce(/* tu código aquí */);

console.log("Números pares:", pares);
console.log("Cuadrados:", cuadrados);
console.log("Suma total:", suma);

/**
 * 3.2 Event Handlers
 * 
 * Crea event handlers usando arrow functions.
 */

console.log("\n3.2 - Event Handlers:");

// Simulación de evento (en navegador sería con addEventListener)
function simularEvento(handler) {
    const evento = { type: "click", target: "button" };
    handler(evento);
}

// TODO: Crea arrow functions para manejar eventos
const manejarClick = /* tu código aquí */;
const manejarHover = /* tu código aquí */;

simularEvento(manejarClick);
simularEvento(manejarHover);

/**
 * 3.3 Callbacks
 * 
 * Usa arrow functions como callbacks.
 */

console.log("\n3.3 - Callbacks:");

// Función que acepta callback
function procesar(datos, callback) {
    const resultado = datos.map(x => x * 2);
    callback(resultado);
}

// TODO: Usa arrow function como callback
procesar([1, 2, 3], /* tu código aquí */);

// Función con callback de error
function operacionAsincrona(exito, callback) {
    setTimeout(() => {
        if (exito) {
            callback(null, "Operación exitosa");
        } else {
            callback("Error en la operación", null);
        }
    }, 100);
}

// TODO: Usa arrow functions para manejar éxito y error
operacionAsincrona(true, /* tu código aquí */);
operacionAsincrona(false, /* tu código aquí */);

/**
 * 3.4 Functional Programming
 * 
 * Usa arrow functions en programación funcional.
 */

console.log("\n3.4 - Functional Programming:");

const productos = [
    { nombre: "Laptop", precio: 999, categoria: "electronics" },
    { nombre: "Camisa", precio: 25, categoria: "clothing" },
    { nombre: "Teléfono", precio: 599, categoria: "electronics" },
    { nombre: "Zapatos", precio: 75, categoria: "clothing" }
];

// TODO: Usa arrow functions para filtrar, mapear y reducir
const electronicos = productos.filter(/* tu código aquí */);
const nombres = productos.map(/* tu código aquí */);
const precioTotal = productos.reduce(/* tu código aquí */);

console.log("Productos electrónicos:", electronicos);
console.log("Nombres de productos:", nombres);
console.log("Precio total:", precioTotal);

// =============================================================================
// PARTE 4: EJERCICIOS AVANZADOS
// =============================================================================

console.log("\n--- PARTE 4: EJERCICIOS AVANZADOS ---");

/**
 * 4.1 Currying con Arrow Functions
 * 
 * Crea funciones curry usando arrow functions.
 */

console.log("\n4.1 - Currying:");

// TODO: Crea una función curry para multiplicar
const multiplicar = /* tu código aquí */;

const multiplicarPor2 = multiplicar(2);
const multiplicarPor3 = multiplicar(3);

console.log("5 * 2 =", multiplicarPor2(5));
console.log("4 * 3 =", multiplicarPor3(4));

/**
 * 4.2 Composición de Funciones
 * 
 * Compone funciones usando arrow functions.
 */

console.log("\n4.2 - Composición de Funciones:");

// Funciones básicas
const sumar1 = x => x + 1;
const multiplicarPor2 = x => x * 2;
const elevarAlCuadrado = x => x * x;

// TODO: Crea una función compose
const compose = (f, g) => /* tu código aquí */;

// TODO: Compone las funciones
const operacionCompuesta = compose(
    elevarAlCuadrado,
    compose(multiplicarPor2, sumar1)
);

console.log("Operación compuesta de 3:", operacionCompuesta(3)); // (3 + 1) * 2 ^ 2 = 64

/**
 * 4.3 Memoización
 * 
 * Implementa memoización usando arrow functions.
 */

console.log("\n4.3 - Memoización:");

// TODO: Crea una función memo que use arrow functions
const memoize = (fn) => {
    const cache = {};
    return (/* tu código aquí */) => {
        // Tu implementación aquí
    };
};

// Función costosa para memoizar
const fibonacci = memoize((n) => {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
});

console.log("Fibonacci(10):", fibonacci(10));
console.log("Fibonacci(10) segunda vez:", fibonacci(10)); // Debería ser más rápido

/**
 * 4.4 Patrones Avanzados
 * 
 * Implementa patrones avanzados con arrow functions.
 */

console.log("\n4.4 - Patrones Avanzados:");

// TODO: Crea un pipeline de transformaciones
const pipeline = (...fns) => /* tu código aquí */;

const procesarTexto = pipeline(
    str => str.toLowerCase(),
    str => str.trim(),
    str => str.replace(/\s+/g, '-'),
    str => str.substring(0, 20)
);

console.log("Texto procesado:", procesarTexto("  Hola Mundo JavaScript  "));

// =============================================================================
// PARTE 5: MEJORES PRÁCTICAS
// =============================================================================

console.log("\n--- PARTE 5: MEJORES PRÁCTICAS ---");

/**
 * 5.1 Cuándo Usar Arrow Functions
 * 
 * Evalúa cuándo es apropiado usar arrow functions.
 */

console.log("\n5.1 - Cuándo Usar Arrow Functions:");

// ✅ Bueno: Callbacks cortos
const numeros2 = [1, 2, 3, 4, 5];
const duplicados = numeros2.map(x => x * 2);

// ✅ Bueno: Funciones de una línea
const esPar = x => x % 2 === 0;

// ❌ Evitar: Métodos de objeto
const persona = {
    nombre: "Juan",
    // Mejor usar función tradicional
    saludar: function() {
        return `Hola, soy ${this.nombre}`;
    }
};

// ❌ Evitar: Constructores
// const Persona = (nombre) => {
//     this.nombre = nombre; // Error: arrow functions no pueden ser constructores
// };

/**
 * 5.2 Legibilidad vs Concisión
 * 
 * Balancea legibilidad con concisión.
 */

console.log("\n5.2 - Legibilidad vs Concisión:");

// Muy conciso pero menos legible
const procesarDatos = d => d.filter(x => x > 0).map(x => x * 2).reduce((a, b) => a + b, 0);

// Más legible
const procesarDatosMejor = datos => {
    return datos
        .filter(numero => numero > 0)
        .map(numero => numero * 2)
        .reduce((acumulador, numero) => acumulador + numero, 0);
};

// TODO: Refactoriza para mejor legibilidad
const calcularPromedio = arr => arr.reduce((a, b) => a + b, 0) / arr.length;

const calcularPromedioMejor = /* tu código aquí */;

// =============================================================================
// PARTE 6: PREGUNTAS DE REFLEXIÓN
// =============================================================================

console.log("\n--- PARTE 6: PREGUNTAS DE REFLEXIÓN ---");

/**
 * Responde estas preguntas con comentarios:
 * 
 * 1. ¿Cuándo preferirías usar arrow functions sobre funciones tradicionales?
 * // Tu respuesta aquí
 * 
 * 2. ¿Cuáles son las limitaciones de las arrow functions?
 * // Tu respuesta aquí
 * 
 * 3. ¿Cómo afecta el contexto `this` tu decisión de usar arrow functions?
 * // Tu respuesta aquí
 * 
 * 4. ¿Qué consideras al elegir entre concisión y legibilidad?
 * // Tu respuesta aquí
 * 
 * 5. ¿Cómo las arrow functions mejoran la programación funcional?
 * // Tu respuesta aquí
 */

// =============================================================================
// RESPUESTAS Y SOLUCIONES
// =============================================================================

/**
 * Puntos clave a recordar:
 * - Arrow functions son más concisas pero no siempre más legibles
 * - No hacen hoisting y no tienen arguments object
 * - Heredan `this` del contexto léxico
 * - Ideales para callbacks y programación funcional
 * - Evitar como métodos de objeto y constructores
 * - Usar paréntesis para retornar objetos: () => ({prop: value})
 */

console.log("\n=== FIN DEL EJERCICIO 2 ===");
