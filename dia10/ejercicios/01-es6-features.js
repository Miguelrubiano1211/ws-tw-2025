/**
 * 📚 EJERCICIO 1: ES6 Features Básicas
 *
 * Objetivo: Dominar let/const, template literals y arrow functions
 * Nivel: Básico a Intermedio
 * Tiempo estimado: 30-45 minutos
 */

console.log('🚀 Ejercicio 1: ES6 Features Básicas');
console.log('=====================================');

// =====================================================
// 1. LET/CONST vs VAR
// =====================================================

console.log('\n1. 📌 Let/Const vs Var');
console.log('----------------------');

// PROBLEMA: Código con var que tiene problemas de scope
// TODO: Refactorizar usando let/const apropiadamente

// Código problemático con var
function exemploVar() {
  console.log('Antes del bucle:', i); // undefined (hoisting)

  for (var i = 0; i < 3; i++) {
    setTimeout(() => {
      console.log('Var en timeout:', i); // 3, 3, 3
    }, 100);
  }

  console.log('Después del bucle:', i); // 3 (leak del scope)
}

// EJERCICIO 1.1: Refactorizar exemploVar() usando let
function exemploLet() {
  // TODO: Implementar la misma funcionalidad pero con let
  // Debería mostrar 0, 1, 2 en los timeouts

  console.log('Antes del bucle:', typeof i); // ReferenceError si intentas acceder

  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      console.log('Let en timeout:', i); // 0, 1, 2
    }, 100);
  }

  // console.log('Después del bucle:', i); // ReferenceError
}

// EJERCICIO 1.2: Const con objetos y arrays
function exemploConst() {
  // TODO: Crear un objeto const que sea modificable
  const usuario = {
    nombre: 'Juan',
    edad: 25,
  };

  // TODO: Modificar propiedades del objeto (debe funcionar)
  usuario.nombre = 'Ana';
  usuario.edad = 30;

  console.log('Usuario modificado:', usuario);

  // TODO: Crear array const y modificar contenido
  const numeros = [1, 2, 3];
  numeros.push(4, 5);

  console.log('Array modificado:', numeros);

  // TODO: Intentar reasignar const (debe dar error)
  // usuario = {}; // TypeError: Assignment to constant variable.
}

// EJERCICIO 1.3: Temporal Dead Zone
function ejemploTDZ() {
  console.log('Temporal Dead Zone Example:');

  // TODO: Demostrar TDZ con let/const
  try {
    console.log('Intentando acceder a x antes de declarar:', x);
    let x = 10;
  } catch (error) {
    console.log('Error TDZ:', error.message);
  }

  // TODO: Comparar con var (no TDZ)
  console.log('Var antes de declarar:', y); // undefined
  var y = 20;
  console.log('Var después de declarar:', y); // 20
}

// =====================================================
// 2. TEMPLATE LITERALS
// =====================================================

console.log('\n2. 📌 Template Literals');
console.log('------------------------');

// EJERCICIO 2.1: Interpolación básica
function interpolacionBasica() {
  const nombre = 'María';
  const edad = 28;
  const ciudad = 'Bogotá';

  // TODO: Crear mensaje usando template literals
  const mensaje = `Hola, soy ${nombre}, tengo ${edad} años y vivo en ${ciudad}.`;

  console.log(mensaje);

  // TODO: Crear expresiones más complejas
  const precio = 1500;
  const descuento = 0.15;
  const mensajeDescuento = `Precio original: $${precio}
Descuento: ${descuento * 100}%
Precio final: $${precio * (1 - descuento)}`;

  console.log(mensajeDescuento);
}

// EJERCICIO 2.2: Multiline strings
function multilineStrings() {
  // TODO: Crear HTML template usando template literals
  const titulo = 'Mi Dashboard';
  const usuario = { nombre: 'Carlos', rol: 'Admin' };

  const htmlTemplate = `
        <div class="dashboard">
            <header>
                <h1>${titulo}</h1>
                <div class="user-info">
                    <span>Bienvenido, ${usuario.nombre}</span>
                    <span class="role">${usuario.rol}</span>
                </div>
            </header>
            <main>
                <p>Contenido del dashboard aquí...</p>
            </main>
        </div>
    `;

  console.log('HTML Template:', htmlTemplate);
}

// EJERCICIO 2.3: Tagged templates (avanzado)
function taggedTemplates() {
  // TODO: Crear función que procese template literals
  function destacar(strings, ...values) {
    let resultado = '';

    for (let i = 0; i < strings.length; i++) {
      resultado += strings[i];
      if (i < values.length) {
        resultado += `<strong>${values[i]}</strong>`;
      }
    }

    return resultado;
  }

  const nombre = 'Ana';
  const puntuacion = 95;

  const mensaje = destacar`El estudiante ${nombre} obtuvo ${puntuacion} puntos.`;
  console.log('Tagged template:', mensaje);
}

// EJERCICIO 2.4: Template literals vs concatenación
function comparacionRendimiento() {
  const datos = {
    nombre: 'Juan',
    apellido: 'Pérez',
    edad: 30,
    profesion: 'Desarrollador',
  };

  // TODO: Comparar rendimiento y legibilidad
  console.time('Concatenación tradicional');
  const concat =
    'Nombre: ' +
    datos.nombre +
    ' ' +
    datos.apellido +
    ', Edad: ' +
    datos.edad +
    ', Profesión: ' +
    datos.profesion;
  console.timeEnd('Concatenación tradicional');

  console.time('Template literals');
  const template = `Nombre: ${datos.nombre} ${datos.apellido}, Edad: ${datos.edad}, Profesión: ${datos.profesion}`;
  console.timeEnd('Template literals');

  console.log('Concatenación:', concat);
  console.log('Template:', template);
}

// =====================================================
// 3. ARROW FUNCTIONS
// =====================================================

console.log('\n3. 📌 Arrow Functions');
console.log('----------------------');

// EJERCICIO 3.1: Sintaxis básica
function sintaxisArrowFunctions() {
  // TODO: Convertir funciones tradicionales a arrow functions

  // Función tradicional
  function sumar(a, b) {
    return a + b;
  }

  // Arrow function equivalente
  const sumarArrow = (a, b) => a + b;

  // TODO: Diferentes variaciones de sintaxis
  const saludar = nombre => `Hola, ${nombre}!`; // Un parámetro
  const obtenerFecha = () => new Date(); // Sin parámetros
  const procesarDatos = datos => {
    // Múltiples líneas
    const procesados = datos.map(item => item * 2);
    return procesados.filter(item => item > 10);
  };

  console.log('Suma tradicional:', sumar(5, 3));
  console.log('Suma arrow:', sumarArrow(5, 3));
  console.log('Saludo:', saludar('María'));
  console.log('Fecha:', obtenerFecha());
  console.log('Datos procesados:', procesarDatos([1, 5, 8, 12, 3]));
}

// EJERCICIO 3.2: This binding
function thisBinding() {
  console.log('This binding con arrow functions:');

  const objeto = {
    nombre: 'TestObject',
    metodoTradicional: function () {
      console.log('Método tradicional - this.nombre:', this.nombre);

      // Callback tradicional - pierde this
      setTimeout(function () {
        console.log('Callback tradicional - this.nombre:', this.nombre); // undefined
      }, 100);

      // Arrow function - mantiene this
      setTimeout(() => {
        console.log('Arrow callback - this.nombre:', this.nombre); // TestObject
      }, 200);
    },

    metodoArrow: () => {
      // Arrow function no tiene su propio this
      console.log('Método arrow - this.nombre:', this.nombre); // undefined
    },
  };

  objeto.metodoTradicional();
  objeto.metodoArrow();
}

// EJERCICIO 3.3: Array methods con arrow functions
function arrayMethods() {
  const numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  // TODO: Usar arrow functions con métodos de array
  const pares = numeros.filter(num => num % 2 === 0);
  const cuadrados = numeros.map(num => num ** 2);
  const suma = numeros.reduce((acc, num) => acc + num, 0);

  console.log('Números originales:', numeros);
  console.log('Números pares:', pares);
  console.log('Cuadrados:', cuadrados);
  console.log('Suma total:', suma);

  // TODO: Chaining de métodos
  const resultado = numeros
    .filter(num => num > 5)
    .map(num => num * 2)
    .reduce((acc, num) => acc + num, 0);

  console.log('Resultado del chaining:', resultado);
}

// EJERCICIO 3.4: Casos donde NO usar arrow functions
function cuandoNoUsarArrow() {
  console.log('Casos donde NO usar arrow functions:');

  // TODO: Métodos de objeto que necesitan this
  const usuario = {
    nombre: 'Ana',
    edad: 25,

    // ❌ Malo: arrow function no tiene this
    saludarMal: () => {
      return `Hola, soy ${this.nombre}`;
    },

    // ✅ Bueno: función tradicional tiene this
    saludarBien: function () {
      return `Hola, soy ${this.nombre}`;
    },
  };

  console.log('Saludo mal:', usuario.saludarMal()); // undefined
  console.log('Saludo bien:', usuario.saludarBien()); // Ana

  // TODO: Constructores
  // ❌ Malo: arrow function no puede ser constructor
  // const PersonaMal = (nombre) => {
  //     this.nombre = nombre;
  // };

  // ✅ Bueno: función tradicional como constructor
  function PersonaBien(nombre) {
    this.nombre = nombre;
  }

  const persona = new PersonaBien('Carlos');
  console.log('Persona creada:', persona.nombre);
}

// =====================================================
// 4. INTEGRACIÓN Y REFACTORIZACIÓN
// =====================================================

console.log('\n4. 📌 Integración y Refactorización');
console.log('------------------------------------');

// EJERCICIO 4.1: Refactorizar código legacy
function refactorizarLegacy() {
  // TODO: Código legacy a refactorizar
  var usuarios = [
    { nombre: 'Juan', edad: 30, activo: true },
    { nombre: 'María', edad: 25, activo: false },
    { nombre: 'Carlos', edad: 35, activo: true },
  ];

  // Legacy code
  function procesarUsuariosLegacy() {
    var activos = [];
    var html = '';

    for (var i = 0; i < usuarios.length; i++) {
      if (usuarios[i].activo) {
        activos.push(usuarios[i]);
        html +=
          '<div>' + usuarios[i].nombre + ' (' + usuarios[i].edad + ')</div>';
      }
    }

    return { activos: activos, html: html };
  }

  // TODO: Refactorizar usando ES6+
  const procesarUsuariosModerno = () => {
    const activos = usuarios.filter(usuario => usuario.activo);

    const html = activos
      .map(usuario => `<div>${usuario.nombre} (${usuario.edad})</div>`)
      .join('');

    return { activos, html };
  };

  console.log('Legacy result:', procesarUsuariosLegacy());
  console.log('Modern result:', procesarUsuariosModerno());
}

// EJERCICIO 4.2: Utilidades con ES6+
function utilidadesES6() {
  // TODO: Crear utilidades usando ES6+
  const utils = {
    // Formatear texto
    formatearTexto: texto => texto.trim().toLowerCase().replace(/\s+/g, '-'),

    // Generar ID único
    generarId: () =>
      `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,

    // Validar email
    validarEmail: email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),

    // Formatear fecha
    formatearFecha: (fecha = new Date()) => {
      const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
      return fecha.toLocaleDateString('es-ES', opciones);
    },

    // Debounce function
    debounce: (func, delay) => {
      let timeoutId;
      return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
      };
    },
  };

  // TODO: Probar utilidades
  console.log(
    'Texto formateado:',
    utils.formatearTexto('  Mi Título Con Espacios  ')
  );
  console.log('ID generado:', utils.generarId());
  console.log('Email válido:', utils.validarEmail('test@example.com'));
  console.log('Fecha formateada:', utils.formatearFecha());

  // Probar debounce
  const buscarDebounced = utils.debounce(termino => {
    console.log('Buscando:', termino);
  }, 300);

  buscarDebounced('react');
  buscarDebounced('javascript');
  buscarDebounced('es6');
}

// =====================================================
// 5. EJERCICIOS DESAFÍO
// =====================================================

console.log('\n5. 📌 Ejercicios Desafío');
console.log('-------------------------');

// DESAFÍO 1: Sistema de configuración
function sistemaConfiguracion() {
  // TODO: Crear sistema de configuración con ES6+
  const configuracion = {
    api: {
      url: 'https://api.ejemplo.com',
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      },
    },
    ui: {
      theme: 'dark',
      language: 'es',
    },
  };

  const obtenerConfiguracion = path => {
    const keys = path.split('.');
    let valor = configuracion;

    for (const key of keys) {
      if (valor && valor[key] !== undefined) {
        valor = valor[key];
      } else {
        return null;
      }
    }

    return valor;
  };

  console.log('API URL:', obtenerConfiguracion('api.url'));
  console.log('Theme:', obtenerConfiguracion('ui.theme'));
  console.log('Inexistente:', obtenerConfiguracion('inexistente.key'));
}

// DESAFÍO 2: Template engine simple
function templateEngine() {
  // TODO: Crear template engine usando template literals
  const compilarTemplate = template => {
    return data => {
      return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        return data[key] || '';
      });
    };
  };

  const template =
    'Hola {{nombre}}, tienes {{edad}} años y vives en {{ciudad}}.';
  const compilado = compilarTemplate(template);

  const resultado = compilado({
    nombre: 'Ana',
    edad: 28,
    ciudad: 'Medellín',
  });

  console.log('Template compilado:', resultado);
}

// DESAFÍO 3: Proxy con arrow functions
function proxyAvanzado() {
  // TODO: Crear proxy que use arrow functions
  const crearObjetoObservado = (obj, callback) => {
    return new Proxy(obj, {
      set: (target, property, value) => {
        const oldValue = target[property];
        target[property] = value;
        callback(property, value, oldValue);
        return true;
      },
    });
  };

  const usuario = crearObjetoObservado(
    { nombre: 'Juan', edad: 30 },
    (prop, newVal, oldVal) => {
      console.log(`${prop} cambió de ${oldVal} a ${newVal}`);
    }
  );

  usuario.nombre = 'Carlos';
  usuario.edad = 35;
}

// =====================================================
// 6. EJECUCIÓN DE EJERCICIOS
// =====================================================

// Ejecutar todos los ejercicios
function ejecutarEjercicios() {
  try {
    // Ejercicios básicos
    exemploVar();
    setTimeout(() => exemploLet(), 500);

    exemploConst();
    ejemploTDZ();

    interpolacionBasica();
    multilineStrings();
    taggedTemplates();
    comparacionRendimiento();

    sintaxisArrowFunctions();
    thisBinding();
    arrayMethods();
    cuandoNoUsarArrow();

    // Integración
    refactorizarLegacy();
    utilidadesES6();

    // Desafíos
    sistemaConfiguracion();
    templateEngine();
    proxyAvanzado();

    console.log('\n✅ Todos los ejercicios completados!');
  } catch (error) {
    console.error('❌ Error en ejercicios:', error);
  }
}

// Ejecutar si es llamado directamente
if (typeof module === 'undefined') {
  ejecutarEjercicios();
}

// Exportar para testing
if (typeof module !== 'undefined') {
  module.exports = {
    exemploLet,
    exemploConst,
    interpolacionBasica,
    sintaxisArrowFunctions,
    refactorizarLegacy,
    utilidadesES6,
  };
}

// =====================================================
// 📝 NOTAS PARA EL ESTUDIANTE
// =====================================================

/*
🎯 OBJETIVOS DE APRENDIZAJE:

1. LET/CONST vs VAR
   - Temporal Dead Zone
   - Block scoping
   - Hoisting differences
   - Best practices

2. TEMPLATE LITERALS
   - String interpolation
   - Multiline strings
   - Tagged templates
   - HTML generation

3. ARROW FUNCTIONS
   - Sintaxis variations
   - This binding
   - Array methods
   - When NOT to use

4. REFACTORIZACIÓN
   - Legacy to modern
   - Code improvement
   - Performance considerations
   - Maintainability

🚀 PRÓXIMOS PASOS:
- Practicar con casos reales
- Experimentar con variaciones
- Refactorizar código existente
- Prepararse para destructuring

💡 CONSEJOS:
- Usa let/const por defecto
- Template literals para strings complejos
- Arrow functions para callbacks
- Refactoriza gradualmente
*/
