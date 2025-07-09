/**
 * DÍA 10: JAVASCRIPT MODERNO (ES6+)
 * EJERCICIO 3: SPREAD/REST OPERATOR
 *
 * Descripción:
 * Dominar el uso del spread operator (...) y rest parameters
 * para manipular arrays, objetos y funciones de manera eficiente.
 *
 * Objetivos:
 * - Entender la diferencia entre spread y rest
 * - Usar spread con arrays y objetos
 * - Implementar rest parameters en funciones
 * - Aplicar patrones avanzados de manipulación de datos
 * - Optimizar código con operadores modernos
 *
 * Tiempo estimado: 45 minutos
 *
 * Instrucciones:
 * 1. Completa cada sección paso a paso
 * 2. Ejecuta el código y verifica los resultados
 * 3. Realiza las modificaciones propuestas
 * 4. Completa los desafíos adicionales
 *
 * Nota: Usa console.log() para verificar tus resultados
 */

console.log('=== DÍA 10 - EJERCICIO 3: SPREAD/REST OPERATOR ===\n');

// ====================================
// 1. SPREAD OPERATOR CON ARRAYS
// ====================================

console.log('1. SPREAD OPERATOR CON ARRAYS');
console.log('--------------------------------');

// Ejemplo básico: Copiar arrays
const numeros = [1, 2, 3];
const numerosCopiados = [...numeros];
console.log('Array original:', numeros);
console.log('Array copiado:', numerosCopiados);

// Concatenar arrays
const frutas = ['manzana', 'pera'];
const verduras = ['lechuga', 'tomate'];
const alimentos = [...frutas, ...verduras];
console.log('Alimentos combinados:', alimentos);

// Agregar elementos
const numerosExtendidos = [0, ...numeros, 4, 5];
console.log('Números extendidos:', numerosExtendidos);

// Encontrar máximo/mínimo
const valores = [10, 5, 8, 3, 12];
const maximo = Math.max(...valores);
const minimo = Math.min(...valores);
console.log('Máximo:', maximo, 'Mínimo:', minimo);

// EJERCICIO 1.1: Crear función que combine múltiples arrays
function combinarArrays(...arrays) {
  // TODO: Implementar usando spread operator
  return [].concat(...arrays);
}

const array1 = [1, 2];
const array2 = [3, 4];
const array3 = [5, 6];
const resultado1 = combinarArrays(array1, array2, array3);
console.log('Arrays combinados:', resultado1);

// EJERCICIO 1.2: Función para eliminar duplicados
function eliminarDuplicados(array) {
  // TODO: Usar spread con Set
  return [...new Set(array)];
}

const conDuplicados = [1, 2, 2, 3, 3, 4];
const sinDuplicados = eliminarDuplicados(conDuplicados);
console.log('Sin duplicados:', sinDuplicados);

console.log('\n');

// ====================================
// 2. SPREAD OPERATOR CON OBJETOS
// ====================================

console.log('2. SPREAD OPERATOR CON OBJETOS');
console.log('--------------------------------');

// Copiar objetos
const persona = { nombre: 'Ana', edad: 25 };
const personaCopia = { ...persona };
console.log('Persona original:', persona);
console.log('Persona copia:', personaCopia);

// Combinar objetos
const direccion = { ciudad: 'Bogotá', pais: 'Colombia' };
const personaCompleta = { ...persona, ...direccion };
console.log('Persona completa:', personaCompleta);

// Sobrescribir propiedades
const personaActualizada = { ...persona, edad: 26, trabajo: 'Desarrolladora' };
console.log('Persona actualizada:', personaActualizada);

// EJERCICIO 2.1: Función para actualizar configuración
function actualizarConfiguracion(configBase, nuevaConfig) {
  // TODO: Combinar configuraciones usando spread
  return { ...configBase, ...nuevaConfig };
}

const configPorDefecto = {
  tema: 'claro',
  idioma: 'es',
  notificaciones: true,
  sonido: true,
};

const configUsuario = {
  tema: 'oscuro',
  sonido: false,
};

const configFinal = actualizarConfiguracion(configPorDefecto, configUsuario);
console.log('Configuración final:', configFinal);

// EJERCICIO 2.2: Función para crear perfil de usuario
function crearPerfil(datosBasicos, ...otrosObjetos) {
  // TODO: Combinar datos básicos con otros objetos
  return otrosObjetos.reduce(
    (perfil, objeto) => {
      return { ...perfil, ...objeto };
    },
    { ...datosBasicos }
  );
}

const usuario = { nombre: 'Carlos', email: 'carlos@email.com' };
const preferencias = { tema: 'oscuro', idioma: 'es' };
const configuracion = { notificaciones: true, privacidad: 'alta' };

const perfilCompleto = crearPerfil(usuario, preferencias, configuracion);
console.log('Perfil completo:', perfilCompleto);

console.log('\n');

// ====================================
// 3. REST PARAMETERS EN FUNCIONES
// ====================================

console.log('3. REST PARAMETERS EN FUNCIONES');
console.log('--------------------------------');

// Función con parámetros ilimitados
function sumar(...numeros) {
  return numeros.reduce((total, numero) => total + numero, 0);
}

console.log('Suma de números:', sumar(1, 2, 3, 4, 5));
console.log('Suma de más números:', sumar(10, 20, 30, 40, 50, 60));

// Función con parámetros mixtos
function presentar(nombre, ...hobbies) {
  console.log(`Hola, soy ${nombre}`);
  if (hobbies.length > 0) {
    console.log(`Mis hobbies son: ${hobbies.join(', ')}`);
  }
}

presentar('María', 'leer', 'nadar', 'cocinar');

// EJERCICIO 3.1: Función para calcular estadísticas
function calcularEstadisticas(nombre, ...puntuaciones) {
  // TODO: Calcular promedio, máximo y mínimo
  const promedio =
    puntuaciones.reduce((sum, p) => sum + p, 0) / puntuaciones.length;
  const maximo = Math.max(...puntuaciones);
  const minimo = Math.min(...puntuaciones);

  return {
    estudiante: nombre,
    promedio: promedio.toFixed(2),
    maximo,
    minimo,
    total: puntuaciones.length,
  };
}

const estadisticas = calcularEstadisticas('Pedro', 85, 92, 78, 95, 88);
console.log('Estadísticas:', estadisticas);

// EJERCICIO 3.2: Función para crear logger
function crearLogger(nivel, ...mensajes) {
  // TODO: Crear función que formatee mensajes según el nivel
  const timestamp = new Date().toISOString();
  const mensaje = mensajes.join(' ');

  return `[${timestamp}] ${nivel.toUpperCase()}: ${mensaje}`;
}

console.log(crearLogger('info', 'Usuario', 'conectado', 'correctamente'));
console.log(crearLogger('error', 'Fallo', 'en', 'la', 'conexión'));

console.log('\n');

// ====================================
// 4. DESTRUCTURING CON REST
// ====================================

console.log('4. DESTRUCTURING CON REST');
console.log('--------------------------------');

// Rest en arrays
const colores = ['rojo', 'verde', 'azul', 'amarillo', 'violeta'];
const [primero, segundo, ...resto] = colores;
console.log('Primero:', primero);
console.log('Segundo:', segundo);
console.log('Resto:', resto);

// Rest en objetos
const producto = {
  id: 1,
  nombre: 'Laptop',
  precio: 1000,
  categoria: 'Electrónicos',
  stock: 50,
  descripcion: 'Laptop de alta gama',
};

const { id, nombre, ...detalles } = producto;
console.log('ID:', id);
console.log('Nombre:', nombre);
console.log('Detalles:', detalles);

// EJERCICIO 4.1: Función para procesar datos de usuario
function procesarUsuario({ nombre, email, ...configuracion }) {
  // TODO: Procesar datos básicos y configuración por separado
  return {
    datosBasicos: { nombre, email },
    configuracion,
    esValido: nombre && email,
  };
}

const datosUsuario = {
  nombre: 'Ana',
  email: 'ana@email.com',
  tema: 'oscuro',
  idioma: 'es',
  notificaciones: true,
};

const usuarioProcesado = procesarUsuario(datosUsuario);
console.log('Usuario procesado:', usuarioProcesado);

console.log('\n');

// ====================================
// 5. PATRONES AVANZADOS
// ====================================

console.log('5. PATRONES AVANZADOS');
console.log('--------------------------------');

// Patrón: Immutable updates
class GestorEstado {
  constructor(estadoInicial = {}) {
    this.estado = estadoInicial;
  }

  actualizar(cambios) {
    // TODO: Actualizar estado de forma inmutable
    this.estado = { ...this.estado, ...cambios };
    return this.estado;
  }

  obtener() {
    return { ...this.estado };
  }
}

const gestor = new GestorEstado({ contador: 0, usuario: null });
console.log('Estado inicial:', gestor.obtener());

gestor.actualizar({ contador: 1 });
gestor.actualizar({ usuario: 'Ana' });
console.log('Estado actualizado:', gestor.obtener());

// Patrón: Función curry con rest
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return function (...nextArgs) {
      return curried.apply(this, [...args, ...nextArgs]);
    };
  };
}

const multiplicar = (a, b, c) => a * b * c;
const multiplicarCurry = curry(multiplicar);

console.log('Curry completo:', multiplicarCurry(2, 3, 4));
console.log('Curry parcial:', multiplicarCurry(2)(3)(4));

// EJERCICIO 5.1: Implementar función pipe
function pipe(valor, ...funciones) {
  // TODO: Aplicar funciones en secuencia
  return funciones.reduce((resultado, fn) => fn(resultado), valor);
}

const duplicar = x => x * 2;
const sumar5 = x => x + 5;
const elevarAlCuadrado = x => x * x;

const resultado2 = pipe(3, duplicar, sumar5, elevarAlCuadrado);
console.log('Resultado pipe:', resultado2); // ((3 * 2) + 5)^2 = 121

console.log('\n');

// ====================================
// 6. CASOS PRÁCTICOS
// ====================================

console.log('6. CASOS PRÁCTICOS');
console.log('--------------------------------');

// Caso 1: Fusionar arrays de objetos
function fusionarColecciones(...colecciones) {
  // TODO: Fusionar múltiples colecciones eliminando duplicados por ID
  const fusionada = [].concat(...colecciones);
  const sinDuplicados = fusionada.filter(
    (item, index, array) => array.findIndex(i => i.id === item.id) === index
  );
  return sinDuplicados;
}

const productos1 = [
  { id: 1, nombre: 'Laptop', precio: 1000 },
  { id: 2, nombre: 'Mouse', precio: 25 },
];

const productos2 = [
  { id: 2, nombre: 'Mouse', precio: 30 }, // Duplicado con precio diferente
  { id: 3, nombre: 'Teclado', precio: 50 },
];

const productosFusionados = fusionarColecciones(productos1, productos2);
console.log('Productos fusionados:', productosFusionados);

// Caso 2: Función para crear API cliente
function crearApiCliente(baseUrl, ...middlewares) {
  // TODO: Crear cliente con middlewares aplicados
  return {
    baseUrl,
    middlewares,
    request: async (endpoint, options = {}) => {
      const url = `${baseUrl}${endpoint}`;

      // Aplicar middlewares
      const finalOptions = middlewares.reduce((opts, middleware) => {
        return middleware(opts);
      }, options);

      console.log(`Haciendo petición a: ${url}`);
      console.log('Opciones:', finalOptions);

      return { url, options: finalOptions };
    },
  };
}

const addAuth = options => ({
  ...options,
  headers: { ...options.headers, Authorization: 'Bearer token123' },
});

const addContentType = options => ({
  ...options,
  headers: { ...options.headers, 'Content-Type': 'application/json' },
});

const apiClient = crearApiCliente(
  'https://api.ejemplo.com',
  addAuth,
  addContentType
);
apiClient.request('/usuarios', { method: 'POST', body: { nombre: 'Ana' } });

console.log('\n');

// ====================================
// 7. DESAFÍOS ADICIONALES
// ====================================

console.log('7. DESAFÍOS ADICIONALES');
console.log('--------------------------------');

// DESAFÍO 1: Implementar función memoize con spread/rest
function memoize(fn) {
  const cache = new Map();

  return function (...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      console.log('Resultado desde cache para:', args);
      return cache.get(key);
    }

    const resultado = fn.apply(this, args);
    cache.set(key, resultado);
    console.log('Calculado y cacheado para:', args);
    return resultado;
  };
}

const fibonacciMemo = memoize(function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
});

console.log('Fibonacci(10):', fibonacciMemo(10));
console.log('Fibonacci(10) segunda vez:', fibonacciMemo(10));

// DESAFÍO 2: Crear función de validación flexible
function validar(objeto, ...validadores) {
  // TODO: Aplicar múltiples validadores a un objeto
  const errores = [];

  validadores.forEach(validador => {
    const resultado = validador(objeto);
    if (resultado !== true) {
      errores.push(resultado);
    }
  });

  return errores.length === 0 ? true : errores;
}

const validarNombre = obj =>
  obj.nombre && obj.nombre.length >= 3
    ? true
    : 'Nombre debe tener al menos 3 caracteres';
const validarEmail = obj =>
  obj.email && obj.email.includes('@')
    ? true
    : 'Email debe tener formato válido';
const validarEdad = obj =>
  obj.edad && obj.edad >= 18 ? true : 'Edad debe ser mayor a 18';

const usuario1 = { nombre: 'Ana', email: 'ana@test.com', edad: 25 };
const usuario2 = { nombre: 'Bo', email: 'bo', edad: 16 };

console.log(
  'Validación usuario1:',
  validar(usuario1, validarNombre, validarEmail, validarEdad)
);
console.log(
  'Validación usuario2:',
  validar(usuario2, validarNombre, validarEmail, validarEdad)
);

// DESAFÍO 3: Implementar sistema de plugins
class SistemaPlugins {
  constructor() {
    this.plugins = [];
  }

  usar(...plugins) {
    // TODO: Agregar múltiples plugins
    this.plugins.push(...plugins);
    return this;
  }

  ejecutar(datos) {
    // TODO: Ejecutar todos los plugins en secuencia
    return this.plugins.reduce((resultado, plugin) => {
      return plugin(resultado);
    }, datos);
  }
}

const mayusculas = texto => texto.toUpperCase();
const agregarPrefijo = texto => `[INFO] ${texto}`;
const agregarTimestamp = texto => `${new Date().toISOString()} - ${texto}`;

const sistema = new SistemaPlugins().usar(
  mayusculas,
  agregarPrefijo,
  agregarTimestamp
);

const mensaje = sistema.ejecutar('hola mundo');
console.log('Mensaje procesado:', mensaje);

console.log('\n');

// ====================================
// 8. MEJORES PRÁCTICAS
// ====================================

console.log('8. MEJORES PRÁCTICAS');
console.log('--------------------------------');

// ✅ Buena práctica: Usar spread para copiar arrays/objetos
const arrayOriginal = [1, 2, 3];
const arrayCopiado = [...arrayOriginal]; // ✅ Correcto
// const arrayCopiado = arrayOriginal; // ❌ Incorrecto - referencia

// ✅ Buena práctica: Usar rest para funciones flexibles
function registrarEvento(tipo, ...detalles) {
  console.log(`Evento ${tipo}:`, detalles);
}

// ✅ Buena práctica: Combinar destructuring con rest
function procesarRespuesta({ status, data, ...metadatos }) {
  return { status, data, metadatos };
}

// ✅ Buena práctica: Usar spread para pasar argumentos
const numeros2 = [1, 2, 3, 4, 5];
console.log('Máximo con spread:', Math.max(...numeros2));

console.log('\n=== EJERCICIO 3 COMPLETADO ===');

// ====================================
// NOTAS PEDAGÓGICAS
// ====================================
/*
PUNTOS CLAVE A RECORDAR:

1. SPREAD OPERATOR (...):
   - Expande elementos de arrays/objetos
   - Útil para copiar, concatenar, pasar argumentos
   - Crea copias superficiales

2. REST PARAMETERS (...):
   - Recolecta múltiples argumentos en un array
   - Debe ser el último parámetro
   - Útil para funciones flexibles

3. CASOS DE USO COMUNES:
   - Copiar arrays/objetos inmutablemente
   - Combinar estructuras de datos
   - Funciones con parámetros variables
   - Destructuring con resto

4. RENDIMIENTO:
   - Spread crea nuevas estructuras
   - Considerar el impacto en objetos grandes
   - Usar apropiadamente en loops

5. COMPATIBILIDAD:
   - ES6+ (2015)
   - Verificar soporte en navegadores objetivo
   - Usar babel para transpilación si es necesario

ERRORES COMUNES:
- Confundir spread con rest
- Usar spread en objetos muy anidados
- No considerar el rendimiento en loops
- Mutar datos cuando se quiere inmutabilidad

WORLDSKILLS TIPS:
- Dominar ambos operadores
- Practicar casos de uso comunes
- Combinar con destructuring
- Entender cuándo usar cada uno
*/
