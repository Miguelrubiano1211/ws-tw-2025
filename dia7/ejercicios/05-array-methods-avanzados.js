/**
 * 🎯 Ejercicio 5: Array Methods Avanzados
 * 
 * Objetivo: Dominar el uso avanzado de métodos de array (map, filter, reduce, etc.)
 * Tiempo estimado: 35 minutos
 * Dificultad: ⭐⭐⭐
 */

console.log("=== EJERCICIO 5: ARRAY METHODS AVANZADOS ===");

// =============================================================================
// PARTE 1: MÉTODOS BÁSICOS REVISIÓN
// =============================================================================

console.log("\n--- PARTE 1: MÉTODOS BÁSICOS REVISIÓN ---");

/**
 * 1.1 Map - Transformación de Elementos
 * 
 * Transforma cada elemento del array.
 */

console.log("\n1.1 - Map:");

const numeros = [1, 2, 3, 4, 5];

// TODO: Duplica cada número
const duplicados = numeros.map(/* tu código aquí */);

// TODO: Convierte números a strings
const strings = numeros.map(/* tu código aquí */);

// TODO: Crea objetos con el número y su cuadrado
const objetosNumeros = numeros.map(/* tu código aquí */);

console.log("Duplicados:", duplicados);
console.log("Strings:", strings);
console.log("Objetos números:", objetosNumeros);

/**
 * 1.2 Filter - Filtrado de Elementos
 * 
 * Filtra elementos que cumplan una condición.
 */

console.log("\n1.2 - Filter:");

const productos = [
    { nombre: "Laptop", precio: 999, categoria: "electronics", stock: 5 },
    { nombre: "Camisa", precio: 25, categoria: "clothing", stock: 0 },
    { nombre: "Teléfono", precio: 599, categoria: "electronics", stock: 3 },
    { nombre: "Zapatos", precio: 75, categoria: "clothing", stock: 8 },
    { nombre: "Tablet", precio: 299, categoria: "electronics", stock: 2 }
];

// TODO: Filtra productos con stock
const conStock = productos.filter(/* tu código aquí */);

// TODO: Filtra productos electrónicos
const electronicos = productos.filter(/* tu código aquí */);

// TODO: Filtra productos caros (precio > 500)
const caros = productos.filter(/* tu código aquí */);

console.log("Con stock:", conStock);
console.log("Electrónicos:", electronicos);
console.log("Caros:", caros);

/**
 * 1.3 Reduce - Acumulación de Valores
 * 
 * Reduce el array a un solo valor.
 */

console.log("\n1.3 - Reduce:");

// TODO: Suma todos los números
const suma = numeros.reduce(/* tu código aquí */);

// TODO: Encuentra el número máximo
const maximo = numeros.reduce(/* tu código aquí */);

// TODO: Calcula precio total de productos
const precioTotal = productos.reduce(/* tu código aquí */);

console.log("Suma:", suma);
console.log("Máximo:", maximo);
console.log("Precio total:", precioTotal);

// =============================================================================
// PARTE 2: CHAINING (ENCADENAMIENTO)
// =============================================================================

console.log("\n--- PARTE 2: CHAINING ---");

/**
 * 2.1 Chaining Básico
 * 
 * Combina múltiples operaciones en una cadena.
 */

console.log("\n2.1 - Chaining Básico:");

const estudiantes = [
    { nombre: "Ana", edad: 20, notas: [85, 90, 78] },
    { nombre: "Carlos", edad: 22, notas: [92, 88, 95] },
    { nombre: "María", edad: 19, notas: [78, 82, 85] },
    { nombre: "José", edad: 21, notas: [88, 91, 87] },
    { nombre: "Laura", edad: 23, notas: [95, 93, 97] }
];

// TODO: Encuentra estudiantes mayores de 20, obtén sus nombres y ordena alfabéticamente
const estudiantesMayores = estudiantes
    .filter(/* tu código aquí */)
    .map(/* tu código aquí */)
    .sort(/* tu código aquí */);

console.log("Estudiantes mayores de 20:", estudiantesMayores);

/**
 * 2.2 Chaining Complejo
 * 
 * Operaciones más complejas encadenadas.
 */

console.log("\n2.2 - Chaining Complejo:");

// TODO: Calcula promedio de cada estudiante, filtra aprobados (>= 80), ordena por promedio
const estudiantesAprobados = estudiantes
    .map(estudiante => ({
        ...estudiante,
        promedio: /* tu código aquí */
    }))
    .filter(/* tu código aquí */)
    .sort(/* tu código aquí */);

console.log("Estudiantes aprobados:", estudiantesAprobados);

/**
 * 2.3 Chaining con Reduce
 * 
 * Usa reduce en cadenas complejas.
 */

console.log("\n2.3 - Chaining con Reduce:");

// TODO: Agrupa productos por categoría
const productosPorCategoria = productos.reduce((acc, producto) => {
    // Tu código aquí
}, {});

console.log("Productos por categoría:", productosPorCategoria);

// =============================================================================
// PARTE 3: MÉTODOS AVANZADOS
// =============================================================================

console.log("\n--- PARTE 3: MÉTODOS AVANZADOS ---");

/**
 * 3.1 Find y FindIndex
 * 
 * Encuentra elementos específicos.
 */

console.log("\n3.1 - Find y FindIndex:");

// TODO: Encuentra el primer producto sin stock
const sinStock = productos.find(/* tu código aquí */);

// TODO: Encuentra el índice del primer producto caro
const indiceCaro = productos.findIndex(/* tu código aquí */);

// TODO: Encuentra el estudiante más joven
const masJoven = estudiantes.find(/* tu código aquí */);

console.log("Sin stock:", sinStock);
console.log("Índice caro:", indiceCaro);
console.log("Más joven:", masJoven);

/**
 * 3.2 Some y Every
 * 
 * Verifica condiciones en el array.
 */

console.log("\n3.2 - Some y Every:");

// TODO: Verifica si algún producto está sin stock
const hayProductosSinStock = productos.some(/* tu código aquí */);

// TODO: Verifica si todos los estudiantes son mayores de 18
const todosMayores = estudiantes.every(/* tu código aquí */);

// TODO: Verifica si hay algún estudiante con promedio perfecto
const hayPromedioPerfecto = estudiantes.some(estudiante => {
    const promedio = estudiante.notas.reduce((a, b) => a + b) / estudiante.notas.length;
    return promedio >= 95;
});

console.log("Hay productos sin stock:", hayProductosSinStock);
console.log("Todos mayores de 18:", todosMayores);
console.log("Hay promedio perfecto:", hayPromedioPerfecto);

/**
 * 3.3 FlatMap y Flat
 * 
 * Aplana arrays anidados.
 */

console.log("\n3.3 - FlatMap y Flat:");

// TODO: Obtén todas las notas de todos los estudiantes
const todasLasNotas = estudiantes.flatMap(/* tu código aquí */);

// TODO: Crea array de palabras de nombres completos
const palabrasNombres = estudiantes.flatMap(estudiante => 
    estudiante.nombre.split(' ')
);

console.log("Todas las notas:", todasLasNotas);
console.log("Palabras nombres:", palabrasNombres);

// Array anidado para flat
const arrayAnidado = [[1, 2], [3, 4], [5, [6, 7]]];
const arrayPlano = arrayAnidado.flat(2);

console.log("Array plano:", arrayPlano);

// =============================================================================
// PARTE 4: CASOS DE USO PRÁCTICOS
// =============================================================================

console.log("\n--- PARTE 4: CASOS DE USO PRÁCTICOS ---");

/**
 * 4.1 Análisis de Datos
 * 
 * Realiza análisis complejo de datos.
 */

console.log("\n4.1 - Análisis de Datos:");

const ventas = [
    { producto: "Laptop", cantidad: 2, precio: 999, fecha: "2024-01-15", vendedor: "Ana" },
    { producto: "Camisa", cantidad: 5, precio: 25, fecha: "2024-01-16", vendedor: "Carlos" },
    { producto: "Teléfono", cantidad: 1, precio: 599, fecha: "2024-01-15", vendedor: "Ana" },
    { producto: "Zapatos", cantidad: 3, precio: 75, fecha: "2024-01-17", vendedor: "María" },
    { producto: "Tablet", cantidad: 1, precio: 299, fecha: "2024-01-16", vendedor: "Carlos" }
];

// TODO: Calcula total de ventas por vendedor
const ventasPorVendedor = ventas.reduce((acc, venta) => {
    // Tu código aquí
}, {});

// TODO: Encuentra el producto más vendido (por cantidad)
const productoMasVendido = ventas.reduce((max, venta) => {
    // Tu código aquí
});

// TODO: Calcula estadísticas generales
const estadisticas = {
    totalVentas: ventas.reduce(/* tu código aquí */, 0),
    promedioVenta: 0, // Calcular después
    ventasUnicas: ventas.length,
    vendedoresUnicos: [...new Set(ventas.map(/* tu código aquí */))].length
};

estadisticas.promedioVenta = estadisticas.totalVentas / estadisticas.ventasUnicas;

console.log("Ventas por vendedor:", ventasPorVendedor);
console.log("Producto más vendido:", productoMasVendido);
console.log("Estadísticas:", estadisticas);

/**
 * 4.2 Transformación de Datos
 * 
 * Transforma datos para diferentes formatos.
 */

console.log("\n4.2 - Transformación de Datos:");

// TODO: Convierte array de objetos a objeto indexado por ID
const usuarios = [
    { id: 1, nombre: "Ana", email: "ana@email.com", activo: true },
    { id: 2, nombre: "Carlos", email: "carlos@email.com", activo: false },
    { id: 3, nombre: "María", email: "maria@email.com", activo: true }
];

const usuariosPorId = usuarios.reduce((acc, usuario) => {
    // Tu código aquí
}, {});

// TODO: Crea resumen de usuarios activos
const resumenUsuarios = usuarios
    .filter(/* tu código aquí */)
    .map(/* tu código aquí */)
    .reduce((acc, usuario) => {
        // Tu código aquí
    }, { total: 0, usuarios: [] });

console.log("Usuarios por ID:", usuariosPorId);
console.log("Resumen usuarios activos:", resumenUsuarios);

/**
 * 4.3 Validación de Datos
 * 
 * Valida conjuntos de datos.
 */

console.log("\n4.3 - Validación de Datos:");

const formularios = [
    { nombre: "Juan", email: "juan@email.com", edad: 25 },
    { nombre: "", email: "maria@email.com", edad: 30 },
    { nombre: "Carlos", email: "carlos@invalid", edad: 17 },
    { nombre: "Ana", email: "ana@email.com", edad: 22 }
];

// TODO: Valida cada formulario
const validarFormulario = formulario => {
    const errores = [];
    
    if (!formulario.nombre) errores.push("Nombre requerido");
    if (!formulario.email.includes("@")) errores.push("Email inválido");
    if (formulario.edad < 18) errores.push("Debe ser mayor de edad");
    
    return {
        ...formulario,
        esValido: errores.length === 0,
        errores
    };
};

const formulariosValidados = formularios.map(validarFormulario);

// TODO: Separa formularios válidos e inválidos
const validos = formulariosValidados.filter(/* tu código aquí */);
const invalidos = formulariosValidados.filter(/* tu código aquí */);

console.log("Formularios válidos:", validos);
console.log("Formularios inválidos:", invalidos);

// =============================================================================
// PARTE 5: OPTIMIZACIÓN Y PERFORMANCE
// =============================================================================

console.log("\n--- PARTE 5: OPTIMIZACIÓN Y PERFORMANCE ---");

/**
 * 5.1 Lazy Evaluation
 * 
 * Implementa evaluación perezosa.
 */

console.log("\n5.1 - Lazy Evaluation:");

class LazyArray {
    constructor(array) {
        this.array = array;
        this.operations = [];
    }
    
    map(fn) {
        this.operations.push({ type: 'map', fn });
        return this;
    }
    
    filter(fn) {
        this.operations.push({ type: 'filter', fn });
        return this;
    }
    
    take(n) {
        this.operations.push({ type: 'take', n });
        return this;
    }
    
    toArray() {
        let result = [...this.array];
        
        for (const operation of this.operations) {
            if (operation.type === 'map') {
                result = result.map(operation.fn);
            } else if (operation.type === 'filter') {
                result = result.filter(operation.fn);
            } else if (operation.type === 'take') {
                result = result.slice(0, operation.n);
            }
        }
        
        return result;
    }
}

// TODO: Usa LazyArray
const numerosGrandes = Array.from({ length: 1000000 }, (_, i) => i + 1);

const resultado = new LazyArray(numerosGrandes)
    .filter(x => x % 2 === 0)
    .map(x => x * 2)
    .take(5)
    .toArray();

console.log("Resultado lazy:", resultado);

/**
 * 5.2 Memoización de Operaciones
 * 
 * Cache resultados de operaciones costosas.
 */

console.log("\n5.2 - Memoización:");

function memoizeOperation(fn) {
    const cache = new Map();
    
    return function(array, operation) {
        const key = JSON.stringify({ array, operation: operation.toString() });
        
        if (cache.has(key)) {
            console.log("Cache hit");
            return cache.get(key);
        }
        
        console.log("Computing...");
        const result = fn(array, operation);
        cache.set(key, result);
        return result;
    };
}

const memoizedMap = memoizeOperation((array, operation) => array.map(operation));

// TODO: Testa memoización
const datos = [1, 2, 3, 4, 5];
const operacion = x => x * x;

console.log("Primera llamada:", memoizedMap(datos, operacion));
console.log("Segunda llamada:", memoizedMap(datos, operacion));

// =============================================================================
// PARTE 6: EJERCICIOS DESAFÍO
// =============================================================================

console.log("\n--- PARTE 6: EJERCICIOS DESAFÍO ---");

/**
 * 6.1 Implementa Map Personalizado
 * 
 * Crea tu propia versión de map.
 */

console.log("\n6.1 - Map Personalizado:");

Array.prototype.miMap = function(callback) {
    const resultado = [];
    for (let i = 0; i < this.length; i++) {
        resultado.push(callback(this[i], i, this));
    }
    return resultado;
};

// TODO: Testa tu implementación
const testMap = [1, 2, 3, 4, 5].miMap(x => x * 2);
console.log("Mi map:", testMap);

/**
 * 6.2 Implementa Reduce Personalizado
 * 
 * Crea tu propia versión de reduce.
 */

console.log("\n6.2 - Reduce Personalizado:");

Array.prototype.miReduce = function(callback, valorInicial) {
    let acumulador = valorInicial;
    let startIndex = 0;
    
    if (valorInicial === undefined) {
        acumulador = this[0];
        startIndex = 1;
    }
    
    for (let i = startIndex; i < this.length; i++) {
        acumulador = callback(acumulador, this[i], i, this);
    }
    
    return acumulador;
};

// TODO: Testa tu implementación
const testReduce = [1, 2, 3, 4, 5].miReduce((acc, x) => acc + x, 0);
console.log("Mi reduce:", testReduce);

/**
 * 6.3 Pipeline de Datos Complejo
 * 
 * Procesa datos complejos usando todos los métodos.
 */

console.log("\n6.3 - Pipeline Complejo:");

const transacciones = [
    { id: 1, tipo: "ingreso", monto: 1000, fecha: "2024-01-01", categoria: "salario" },
    { id: 2, tipo: "gasto", monto: 200, fecha: "2024-01-02", categoria: "comida" },
    { id: 3, tipo: "ingreso", monto: 500, fecha: "2024-01-03", categoria: "freelance" },
    { id: 4, tipo: "gasto", monto: 300, fecha: "2024-01-04", categoria: "transporte" },
    { id: 5, tipo: "gasto", monto: 150, fecha: "2024-01-05", categoria: "comida" }
];

// TODO: Crea análisis completo
const analisisCompleto = transacciones
    .map(transaccion => ({
        ...transaccion,
        montoReal: transaccion.tipo === "gasto" ? -transaccion.monto : transaccion.monto
    }))
    .reduce((acc, transaccion) => {
        // Agregar a balance
        acc.balance += transaccion.montoReal;
        
        // Agrupar por categoría
        if (!acc.porCategoria[transaccion.categoria]) {
            acc.porCategoria[transaccion.categoria] = 0;
        }
        acc.porCategoria[transaccion.categoria] += transaccion.montoReal;
        
        // Agrupar por tipo
        if (!acc.porTipo[transaccion.tipo]) {
            acc.porTipo[transaccion.tipo] = 0;
        }
        acc.porTipo[transaccion.tipo] += transaccion.monto;
        
        return acc;
    }, {
        balance: 0,
        porCategoria: {},
        porTipo: {}
    });

console.log("Análisis completo:", analisisCompleto);

// =============================================================================
// PARTE 7: PREGUNTAS DE REFLEXIÓN
// =============================================================================

console.log("\n--- PARTE 7: PREGUNTAS DE REFLEXIÓN ---");

/**
 * Responde estas preguntas con comentarios:
 * 
 * 1. ¿Cuándo usar map vs forEach?
 * // Tu respuesta aquí
 * 
 * 2. ¿Qué ventajas tiene el chaining de métodos?
 * // Tu respuesta aquí
 * 
 * 3. ¿Cómo afecta el performance el uso de múltiples métodos encadenados?
 * // Tu respuesta aquí
 * 
 * 4. ¿Cuándo usar reduce vs otros métodos?
 * // Tu respuesta aquí
 * 
 * 5. ¿Qué consideraciones hay para arrays muy grandes?
 * // Tu respuesta aquí
 */

// =============================================================================
// RESPUESTAS Y SOLUCIONES
// =============================================================================

/**
 * Puntos clave a recordar:
 * - Map transforma, filter filtra, reduce acumula
 * - Chaining permite operaciones fluidas
 * - Some/every verifican condiciones
 * - Find/findIndex buscan elementos específicos
 * - FlatMap/flat manejan arrays anidados
 * - Considerar performance con arrays grandes
 * - Immutabilidad es clave en programación funcional
 */

console.log("\n=== FIN DEL EJERCICIO 5 ===");
