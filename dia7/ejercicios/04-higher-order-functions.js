/**
 * 🎯 Ejercicio 4: Higher-Order Functions (Funciones de Orden Superior)
 * 
 * Objetivo: Dominar funciones que operan sobre otras funciones
 * Tiempo estimado: 50 minutos
 * Dificultad: ⭐⭐⭐⭐
 */

console.log("=== EJERCICIO 4: HIGHER-ORDER FUNCTIONS ===");

// =============================================================================
// PARTE 1: CONCEPTOS BÁSICOS
// =============================================================================

console.log("\n--- PARTE 1: CONCEPTOS BÁSICOS ---");

/**
 * 1.1 Funciones que Retornan Funciones
 * 
 * Crea funciones que generen otras funciones.
 */

console.log("\n1.1 - Funciones que Retornan Funciones:");

// TODO: Crea una función que genere multiplicadores
function crearMultiplicador(factor) {
    return function(numero) {
        return numero * factor;
    };
}

const duplicar = crearMultiplicador(2);
const triplicar = crearMultiplicador(3);

console.log("Duplicar 5:", duplicar(5));
console.log("Triplicar 4:", triplicar(4));

// TODO: Convierte a arrow function
const crearSumador = /* tu código aquí */;

const sumar10 = crearSumador(10);
const sumar5 = crearSumador(5);

console.log("Sumar 10 a 7:", sumar10(7));
console.log("Sumar 5 a 3:", sumar5(3));

/**
 * 1.2 Funciones que Aceptan Funciones
 * 
 * Crea funciones que operen sobre otras funciones.
 */

console.log("\n1.2 - Funciones que Aceptan Funciones:");

function aplicarOperacion(array, operacion) {
    return array.map(operacion);
}

// TODO: Crea diferentes operaciones
const elevarAlCuadrado = /* tu código aquí */;
const obtenerLongitud = /* tu código aquí */;

const numeros = [1, 2, 3, 4, 5];
const palabras = ["hola", "mundo", "javascript"];

console.log("Números al cuadrado:", aplicarOperacion(numeros, elevarAlCuadrado));
console.log("Longitud de palabras:", aplicarOperacion(palabras, obtenerLongitud));

/**
 * 1.3 Composición de Funciones
 * 
 * Combina múltiples funciones en una sola.
 */

console.log("\n1.3 - Composición de Funciones:");

// TODO: Implementa función compose
function compose(f, g) {
    return function(x) {
        return f(g(x));
    };
}

// Funciones básicas
const sumar1 = x => x + 1;
const multiplicarPor2 = x => x * 2;

// TODO: Compone las funciones
const sumarYMultiplicar = compose(/* tu código aquí */);

console.log("Componer funciones (3):", sumarYMultiplicar(3)); // (3 + 1) * 2 = 8

// TODO: Compose con múltiples funciones
function composeMultiple(...funciones) {
    return function(valor) {
        // Tu implementación aquí
    };
}

const operacionCompleja = composeMultiple(
    x => x * x,
    x => x + 1,
    x => x / 2
);

console.log("Composición múltiple (4):", operacionCompleja(4));

// =============================================================================
// PARTE 2: CURRYING
// =============================================================================

console.log("\n--- PARTE 2: CURRYING ---");

/**
 * 2.1 Currying Básico
 * 
 * Transforma funciones de múltiples argumentos en funciones de un argumento.
 */

console.log("\n2.1 - Currying Básico:");

// Función normal
function suma(a, b, c) {
    return a + b + c;
}

// TODO: Versión curry
function sumaCurry(a) {
    return function(b) {
        return function(c) {
            return a + b + c;
        };
    };
}

console.log("Suma normal:", suma(1, 2, 3));
console.log("Suma curry:", sumaCurry(1)(2)(3));

// TODO: Versión curry con arrow functions
const sumaCurryArrow = /* tu código aquí */;

console.log("Suma curry arrow:", sumaCurryArrow(2)(3)(4));

/**
 * 2.2 Curry Automático
 * 
 * Crea una función que currifique automáticamente.
 */

console.log("\n2.2 - Curry Automático:");

function curry(fn) {
    return function curried(...args) {
        if (args.length >= fn.length) {
            return fn.apply(this, args);
        } else {
            return function(...nextArgs) {
                return curried.apply(this, args.concat(nextArgs));
            };
        }
    };
}

// TODO: Aplica curry a diferentes funciones
const multiplicar = (a, b, c) => a * b * c;
const multiplicarCurry = curry(multiplicar);

console.log("Multiplicar curry:", multiplicarCurry(2)(3)(4));
console.log("Multiplicar curry parcial:", multiplicarCurry(2, 3)(4));

/**
 * 2.3 Aplicación Parcial
 * 
 * Crea funciones especializadas usando aplicación parcial.
 */

console.log("\n2.3 - Aplicación Parcial:");

function partial(fn, ...argsPreFijos) {
    return function(...argsSufijos) {
        return fn(...argsPreFijos, ...argsSufijos);
    };
}

// TODO: Crea funciones especializadas
const saludar = (saludo, nombre, apellido) => `${saludo} ${nombre} ${apellido}`;

const saludarFormal = partial(saludar, "Buenos días");
const saludarInformal = partial(saludar, "Hola");

console.log(saludarFormal("Juan", "Pérez"));
console.log(saludarInformal("Ana", "García"));

// =============================================================================
// PARTE 3: DECORADORES
// =============================================================================

console.log("\n--- PARTE 3: DECORADORES ---");

/**
 * 3.1 Decorador de Logging
 * 
 * Crea un decorador que registre llamadas a funciones.
 */

console.log("\n3.1 - Decorador de Logging:");

function conLogging(fn) {
    return function(...args) {
        console.log(`Llamando ${fn.name} con argumentos:`, args);
        const resultado = fn.apply(this, args);
        console.log(`${fn.name} retornó:`, resultado);
        return resultado;
    };
}

// TODO: Aplica decorador
const sumaConLogging = conLogging(function suma(a, b) {
    return a + b;
});

sumaConLogging(5, 3);

/**
 * 3.2 Decorador de Tiempo
 * 
 * Mide el tiempo de ejecución de funciones.
 */

console.log("\n3.2 - Decorador de Tiempo:");

function medirTiempo(fn) {
    return function(...args) {
        const inicio = performance.now();
        const resultado = fn.apply(this, args);
        const fin = performance.now();
        console.log(`${fn.name} tomó ${fin - inicio} milisegundos`);
        return resultado;
    };
}

// TODO: Crea función costosa y aplica decorador
function operacionCostosa(n) {
    let resultado = 0;
    for (let i = 0; i < n; i++) {
        resultado += Math.sqrt(i);
    }
    return resultado;
}

const operacionConTiempo = medirTiempo(operacionCostosa);
operacionConTiempo(1000000);

/**
 * 3.3 Decorador de Memoización
 * 
 * Cache resultados de funciones para optimizar rendimiento.
 */

console.log("\n3.3 - Decorador de Memoización:");

function memoize(fn) {
    const cache = new Map();
    
    return function(...args) {
        const key = JSON.stringify(args);
        
        if (cache.has(key)) {
            console.log("Cache hit para:", key);
            return cache.get(key);
        }
        
        console.log("Calculando para:", key);
        const resultado = fn.apply(this, args);
        cache.set(key, resultado);
        return resultado;
    };
}

// TODO: Aplica memoización a fibonacci
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

const fibonacciMemo = memoize(fibonacci);

console.log("Fibonacci(10):", fibonacciMemo(10));
console.log("Fibonacci(10) segunda vez:", fibonacciMemo(10));

// =============================================================================
// PARTE 4: FUNCIONES DE UTILIDAD
// =============================================================================

console.log("\n--- PARTE 4: FUNCIONES DE UTILIDAD ---");

/**
 * 4.1 Pipe Function
 * 
 * Crear pipeline de transformaciones.
 */

console.log("\n4.1 - Pipe Function:");

function pipe(...funciones) {
    return function(valor) {
        return funciones.reduce((resultado, fn) => fn(resultado), valor);
    };
}

// TODO: Crea pipeline de procesamiento de texto
const procesarTexto = pipe(
    texto => texto.toLowerCase(),
    texto => texto.trim(),
    texto => texto.replace(/\s+/g, '-'),
    texto => texto.substring(0, 20)
);

console.log("Texto procesado:", procesarTexto("  HOLA MUNDO JAVASCRIPT  "));

/**
 * 4.2 Debounce Function
 * 
 * Limita la frecuencia de ejecución de funciones.
 */

console.log("\n4.2 - Debounce Function:");

function debounce(fn, delay) {
    let timeoutId;
    
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
}

// TODO: Aplica debounce a función de búsqueda
function buscar(termino) {
    console.log("Buscando:", termino);
}

const buscarDebounced = debounce(buscar, 300);

// Simula escritura rápida
buscarDebounced("j");
buscarDebounced("ja");
buscarDebounced("jav");
buscarDebounced("java");
buscarDebounced("javascript");

/**
 * 4.3 Throttle Function
 * 
 * Limita la frecuencia máxima de ejecución.
 */

console.log("\n4.3 - Throttle Function:");

function throttle(fn, limit) {
    let inThrottle;
    
    return function(...args) {
        if (!inThrottle) {
            fn.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// TODO: Aplica throttle a función de scroll
function manejarScroll() {
    console.log("Scroll event handled");
}

const scrollThrottled = throttle(manejarScroll, 100);

// Simula eventos de scroll rápidos
for (let i = 0; i < 10; i++) {
    setTimeout(() => scrollThrottled(), i * 10);
}

// =============================================================================
// PARTE 5: EJERCICIOS PRÁCTICOS
// =============================================================================

console.log("\n--- PARTE 5: EJERCICIOS PRÁCTICOS ---");

/**
 * 5.1 Sistema de Validación
 * 
 * Crea un sistema de validación usando higher-order functions.
 */

console.log("\n5.1 - Sistema de Validación:");

// TODO: Crea funciones de validación
const crearValidadorRequerido = () => valor => 
    valor && valor.trim() ? null : "Campo requerido";

const crearValidadorLongitud = (min, max) => valor => 
    valor.length >= min && valor.length <= max ? null : 
    `Longitud debe estar entre ${min} y ${max}`;

const crearValidadorEmail = () => valor => 
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor) ? null : "Email inválido";

// TODO: Compone validadores
function validar(...validadores) {
    return function(valor) {
        for (const validador of validadores) {
            const error = validador(valor);
            if (error) return error;
        }
        return null;
    };
}

const validarEmail = validar(
    crearValidadorRequerido(),
    crearValidadorLongitud(5, 50),
    crearValidadorEmail()
);

console.log("Validar email vacío:", validarEmail(""));
console.log("Validar email válido:", validarEmail("test@example.com"));

/**
 * 5.2 Sistema de Filtros
 * 
 * Crea sistema de filtros componible.
 */

console.log("\n5.2 - Sistema de Filtros:");

const productos = [
    { nombre: "Laptop", precio: 999, categoria: "electronics", stock: 5 },
    { nombre: "Camisa", precio: 25, categoria: "clothing", stock: 0 },
    { nombre: "Teléfono", precio: 599, categoria: "electronics", stock: 3 },
    { nombre: "Zapatos", precio: 75, categoria: "clothing", stock: 8 }
];

// TODO: Crea funciones de filtro
const porCategoria = categoria => producto => producto.categoria === categoria;
const porPrecio = (min, max) => producto => producto.precio >= min && producto.precio <= max;
const conStock = () => producto => producto.stock > 0;

// TODO: Combina filtros
function filtrar(...filtros) {
    return function(array) {
        return array.filter(item => 
            filtros.every(filtro => filtro(item))
        );
    };
}

const filtrarElectronicos = filtrar(
    porCategoria("electronics"),
    porPrecio(500, 1000),
    conStock()
);

console.log("Electrónicos filtrados:", filtrarElectronicos(productos));

/**
 * 5.3 Sistema de Transformaciones
 * 
 * Crea pipeline de transformaciones de datos.
 */

console.log("\n5.3 - Sistema de Transformaciones:");

const datos = [
    { nombre: "juan pérez", edad: 25, salario: 50000 },
    { nombre: "ANA GARCÍA", edad: 30, salario: 60000 },
    { nombre: "carlos  lópez", edad: 28, salario: 55000 }
];

// TODO: Crea transformaciones
const normalizarNombre = persona => ({
    ...persona,
    nombre: persona.nombre
        .toLowerCase()
        .split(' ')
        .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
        .join(' ')
        .trim()
});

const calcularSalarioAnual = persona => ({
    ...persona,
    salarioAnual: persona.salario * 12
});

const agregarCategoria = persona => ({
    ...persona,
    categoria: persona.edad < 30 ? 'junior' : 'senior'
});

// TODO: Aplica transformaciones
const transformarPersona = pipe(
    normalizarNombre,
    calcularSalarioAnual,
    agregarCategoria
);

const datosTransformados = datos.map(transformarPersona);
console.log("Datos transformados:", datosTransformados);

// =============================================================================
// PARTE 6: PROGRAMACIÓN FUNCIONAL AVANZADA
// =============================================================================

console.log("\n--- PARTE 6: PROGRAMACIÓN FUNCIONAL AVANZADA ---");

/**
 * 6.1 Functors
 * 
 * Implementa un functor simple.
 */

console.log("\n6.1 - Functors:");

class Maybe {
    constructor(valor) {
        this.valor = valor;
    }
    
    static of(valor) {
        return new Maybe(valor);
    }
    
    isNothing() {
        return this.valor === null || this.valor === undefined;
    }
    
    map(fn) {
        return this.isNothing() ? Maybe.of(null) : Maybe.of(fn(this.valor));
    }
    
    getValue() {
        return this.valor;
    }
}

// TODO: Usa Maybe para operaciones seguras
const resultado = Maybe.of("  hello world  ")
    .map(str => str.trim())
    .map(str => str.toUpperCase())
    .map(str => str.split(' '))
    .getValue();

console.log("Resultado Maybe:", resultado);

/**
 * 6.2 Monads
 * 
 * Implementa un monad simple para manejo de errores.
 */

console.log("\n6.2 - Monads:");

class Result {
    constructor(valor, error = null) {
        this.valor = valor;
        this.error = error;
    }
    
    static ok(valor) {
        return new Result(valor);
    }
    
    static error(error) {
        return new Result(null, error);
    }
    
    isError() {
        return this.error !== null;
    }
    
    map(fn) {
        if (this.isError()) return this;
        try {
            return Result.ok(fn(this.valor));
        } catch (error) {
            return Result.error(error.message);
        }
    }
    
    flatMap(fn) {
        if (this.isError()) return this;
        try {
            return fn(this.valor);
        } catch (error) {
            return Result.error(error.message);
        }
    }
}

// TODO: Usa Result para operaciones que pueden fallar
function dividir(a, b) {
    return b === 0 ? Result.error("División por cero") : Result.ok(a / b);
}

const operacion = Result.ok(10)
    .flatMap(x => dividir(x, 2))
    .map(x => x * 3)
    .flatMap(x => dividir(x, 0));

console.log("Resultado operación:", operacion);

// =============================================================================
// PARTE 7: PREGUNTAS DE REFLEXIÓN
// =============================================================================

console.log("\n--- PARTE 7: PREGUNTAS DE REFLEXIÓN ---");

/**
 * Responde estas preguntas con comentarios:
 * 
 * 1. ¿Qué hace a una función ser de "orden superior"?
 * // Tu respuesta aquí
 * 
 * 2. ¿Cuáles son los beneficios del currying?
 * // Tu respuesta aquí
 * 
 * 3. ¿Cuándo usar decoradores en lugar de herencia?
 * // Tu respuesta aquí
 * 
 * 4. ¿Cómo mejoran las higher-order functions la reutilización de código?
 * // Tu respuesta aquí
 * 
 * 5. ¿Qué papel juegan en la programación funcional?
 * // Tu respuesta aquí
 */

// =============================================================================
// RESPUESTAS Y SOLUCIONES
// =============================================================================

/**
 * Puntos clave a recordar:
 * - Higher-order functions operan sobre otras funciones
 * - Permiten composición y reutilización de código
 * - Currying convierte funciones multi-argumento en funciones de un argumento
 * - Decoradores añaden funcionalidad sin modificar la función original
 * - Son fundamentales en programación funcional
 * - Mejoran testabilidad y mantenibilidad
 */

console.log("\n=== FIN DEL EJERCICIO 4 ===");
