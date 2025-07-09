# 🔒 Guía Completa de Closures en JavaScript

## 📋 Índice

1. [Conceptos Fundamentales](#conceptos-fundamentales)
2. [Lexical Scoping](#lexical-scoping)
3. [Closures Básicos](#closures-básicos)
4. [Patrones con Closures](#patrones-con-closures)
5. [Casos de Uso Prácticos](#casos-de-uso-prácticos)
6. [Errores Comunes](#errores-comunes)
7. [Optimización y Rendimiento](#optimización-y-rendimiento)
8. [Ejemplos Avanzados](#ejemplos-avanzados)

## 📖 Conceptos Fundamentales

### ¿Qué es un Closure?

Un **closure** es una función que tiene acceso a variables de su ámbito externo (scope) incluso después de que la función externa haya terminado de ejecutarse.

```javascript
function exterior() {
  let variable = 'Soy del ámbito exterior';

  function interior() {
    console.log(variable); // Acceso a variable del ámbito exterior
  }

  return interior;
}

const miFuncion = exterior();
miFuncion(); // "Soy del ámbito exterior"
```

### Características Clave

1. **Persistencia**: Las variables del ámbito externo persisten
2. **Encapsulación**: Permite crear variables privadas
3. **Estado**: Mantiene el estado entre invocaciones
4. **Flexibilidad**: Permite patrones de diseño avanzados

## 🌐 Lexical Scoping

### Concepto Base

El lexical scoping determina dónde pueden ser accedidas las variables basándose en **dónde están declaradas** en el código.

```javascript
let global = 'Variable global';

function nivel1() {
  let local1 = 'Variable nivel 1';

  function nivel2() {
    let local2 = 'Variable nivel 2';

    function nivel3() {
      // Acceso a todas las variables de ámbitos superiores
      console.log(global); // ✅ Accesible
      console.log(local1); // ✅ Accesible
      console.log(local2); // ✅ Accesible
    }

    return nivel3;
  }

  return nivel2;
}

const ejecutar = nivel1()();
ejecutar(); // Imprime todas las variables
```

### Cadena de Scope

```javascript
function crearContadores() {
  let contador = 0;

  return {
    incrementar: function () {
      contador++;
      console.log(`Contador: ${contador}`);
    },
    decrementar: function () {
      contador--;
      console.log(`Contador: ${contador}`);
    },
    obtenerValor: function () {
      return contador;
    },
  };
}

const contador1 = crearContadores();
const contador2 = crearContadores();

contador1.incrementar(); // Contador: 1
contador2.incrementar(); // Contador: 1
contador1.incrementar(); // Contador: 2
```

## 🔐 Closures Básicos

### Variables Privadas

```javascript
function crearPersona(nombre) {
  let _nombre = nombre;
  let _edad = 0;

  return {
    obtenerNombre: function () {
      return _nombre;
    },
    establecerEdad: function (edad) {
      if (edad >= 0 && edad <= 150) {
        _edad = edad;
      }
    },
    obtenerEdad: function () {
      return _edad;
    },
    saludar: function () {
      return `Hola, soy ${_nombre} y tengo ${_edad} años`;
    },
  };
}

const persona = crearPersona('Juan');
persona.establecerEdad(25);
console.log(persona.saludar()); // "Hola, soy Juan y tengo 25 años"
console.log(persona._nombre); // undefined - variable privada
```

### Factory Functions

```javascript
function crearCalculadora(operacion) {
  return function (a, b) {
    switch (operacion) {
      case 'suma':
        return a + b;
      case 'resta':
        return a - b;
      case 'multiplicacion':
        return a * b;
      case 'division':
        return b !== 0 ? a / b : 'Error: División por cero';
      default:
        return 'Operación no válida';
    }
  };
}

const suma = crearCalculadora('suma');
const multiplicacion = crearCalculadora('multiplicacion');

console.log(suma(5, 3)); // 8
console.log(multiplicacion(4, 7)); // 28
```

## 🏗️ Patrones con Closures

### Module Pattern

```javascript
const ModuloCarro = (function () {
  // Variables privadas
  let velocidad = 0;
  let motor = false;

  // Funciones privadas
  function validarVelocidad(nuevaVelocidad) {
    return nuevaVelocidad >= 0 && nuevaVelocidad <= 200;
  }

  // API pública
  return {
    encender: function () {
      motor = true;
      console.log('Motor encendido');
    },
    apagar: function () {
      motor = false;
      velocidad = 0;
      console.log('Motor apagado');
    },
    acelerar: function (incremento) {
      if (!motor) {
        console.log('Debe encender el motor primero');
        return;
      }

      const nuevaVelocidad = velocidad + incremento;
      if (validarVelocidad(nuevaVelocidad)) {
        velocidad = nuevaVelocidad;
        console.log(`Velocidad: ${velocidad} km/h`);
      } else {
        console.log('Velocidad no válida');
      }
    },
    obtenerVelocidad: function () {
      return velocidad;
    },
    obtenerEstado: function () {
      return {
        motor: motor,
        velocidad: velocidad,
      };
    },
  };
})();

ModuloCarro.encender();
ModuloCarro.acelerar(50);
console.log(ModuloCarro.obtenerEstado()); // { motor: true, velocidad: 50 }
```

### Revealing Module Pattern

```javascript
const ModuloGestionUsuarios = (function () {
  let usuarios = [];
  let idContador = 1;

  function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function buscarPorId(id) {
    return usuarios.find(usuario => usuario.id === id);
  }

  function agregarUsuario(nombre, email) {
    if (!validarEmail(email)) {
      throw new Error('Email no válido');
    }

    const usuario = {
      id: idContador++,
      nombre,
      email,
      fechaCreacion: new Date(),
    };

    usuarios.push(usuario);
    return usuario;
  }

  function obtenerUsuarios() {
    return usuarios.map(usuario => ({ ...usuario })); // Copia profunda
  }

  function eliminarUsuario(id) {
    const indice = usuarios.findIndex(usuario => usuario.id === id);
    if (indice !== -1) {
      return usuarios.splice(indice, 1)[0];
    }
    return null;
  }

  function actualizarUsuario(id, datosNuevos) {
    const usuario = buscarPorId(id);
    if (usuario) {
      Object.assign(usuario, datosNuevos);
      return usuario;
    }
    return null;
  }

  // Revelar API pública
  return {
    crear: agregarUsuario,
    obtenerTodos: obtenerUsuarios,
    obtenerPorId: buscarPorId,
    actualizar: actualizarUsuario,
    eliminar: eliminarUsuario,
  };
})();

// Uso del módulo
const usuario1 = ModuloGestionUsuarios.crear('Ana', 'ana@test.com');
const usuario2 = ModuloGestionUsuarios.crear('Luis', 'luis@test.com');
console.log(ModuloGestionUsuarios.obtenerTodos());
```

## 🎯 Casos de Uso Prácticos

### 1. Memoización

```javascript
function memoizar(fn) {
  const cache = {};

  return function (...args) {
    const key = JSON.stringify(args);

    if (cache[key]) {
      console.log('Resultado desde cache');
      return cache[key];
    }

    console.log('Calculando resultado...');
    const resultado = fn.apply(this, args);
    cache[key] = resultado;

    return resultado;
  };
}

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const fibonacciMemoizado = memoizar(fibonacci);
console.log(fibonacciMemoizado(10)); // Calculando...
console.log(fibonacciMemoizado(10)); // Desde cache
```

### 2. Debounce

```javascript
function debounce(func, delay) {
  let timeoutId;

  return function (...args) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// Uso práctico
const buscarUsuarios = debounce(function (termino) {
  console.log(`Buscando usuarios con: ${termino}`);
  // Lógica de búsqueda...
}, 300);

// Simular escritura rápida
buscarUsuarios('j');
buscarUsuarios('ju');
buscarUsuarios('jua');
buscarUsuarios('juan'); // Solo esta búsqueda se ejecutará
```

### 3. Throttle

```javascript
function throttle(func, limit) {
  let inThrottle;

  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;

      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

// Uso práctico
const manejarScroll = throttle(function (evento) {
  console.log('Manejando scroll:', window.scrollY);
}, 100);

window.addEventListener('scroll', manejarScroll);
```

### 4. Currying

```javascript
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return function (...args2) {
        return curried.apply(this, args.concat(args2));
      };
    }
  };
}

// Función original
function multiplicar(a, b, c) {
  return a * b * c;
}

// Versión currificada
const multiplicarCurry = curry(multiplicar);

// Diferentes formas de usar
console.log(multiplicarCurry(2)(3)(4)); // 24
console.log(multiplicarCurry(2, 3)(4)); // 24
console.log(multiplicarCurry(2)(3, 4)); // 24

// Crear funciones especializadas
const multiplicarPor2 = multiplicarCurry(2);
const multiplicarPor2Y3 = multiplicarPor2(3);
console.log(multiplicarPor2Y3(4)); // 24
```

### 5. Event Emitter

```javascript
function crearEventEmitter() {
  const eventos = {};

  return {
    on: function (evento, callback) {
      if (!eventos[evento]) {
        eventos[evento] = [];
      }
      eventos[evento].push(callback);
    },

    emit: function (evento, ...args) {
      if (eventos[evento]) {
        eventos[evento].forEach(callback => {
          callback.apply(this, args);
        });
      }
    },

    off: function (evento, callback) {
      if (eventos[evento]) {
        eventos[evento] = eventos[evento].filter(cb => cb !== callback);
      }
    },

    once: function (evento, callback) {
      const onceCallback = (...args) => {
        callback.apply(this, args);
        this.off(evento, onceCallback);
      };
      this.on(evento, onceCallback);
    },
  };
}

// Uso
const emitter = crearEventEmitter();

emitter.on('usuario-conectado', usuario => {
  console.log(`${usuario} se conectó`);
});

emitter.once('sistema-iniciado', () => {
  console.log('Sistema iniciado por primera vez');
});

emitter.emit('usuario-conectado', 'Juan');
emitter.emit('sistema-iniciado'); // Solo se ejecuta una vez
```

## ⚠️ Errores Comunes

### 1. Closures en Bucles

```javascript
// ❌ Problema común
function crearBotones() {
  const botones = [];

  for (var i = 0; i < 5; i++) {
    botones.push(function () {
      console.log(`Botón ${i}`); // Siempre imprime "Botón 5"
    });
  }

  return botones;
}

// ✅ Solución con closure
function crearBotonesCorrecto() {
  const botones = [];

  for (let i = 0; i < 5; i++) {
    botones.push(
      (function (index) {
        return function () {
          console.log(`Botón ${index}`);
        };
      })(i)
    );
  }

  return botones;
}

// ✅ Solución moderna con let
function crearBotonesModerno() {
  const botones = [];

  for (let i = 0; i < 5; i++) {
    botones.push(function () {
      console.log(`Botón ${i}`); // let crea un nuevo scope
    });
  }

  return botones;
}
```

### 2. Memory Leaks

```javascript
// ❌ Potential memory leak
function crearManejadorProblematico() {
  const datosGrandes = new Array(1000000).fill('datos');

  return function () {
    // Solo usamos un elemento pero mantenemos todo el array
    console.log(datosGrandes[0]);
  };
}

// ✅ Solución optimizada
function crearManejadorOptimizado() {
  const datosGrandes = new Array(1000000).fill('datos');
  const primerElemento = datosGrandes[0];

  return function () {
    console.log(primerElemento);
  };
}
```

## 🚀 Optimización y Rendimiento

### 1. Lazy Evaluation

```javascript
function crearCalculadoraLazy() {
  let resultado = null;
  let calculado = false;

  function calcularComplejo() {
    // Simulación de cálculo costoso
    console.log('Realizando cálculo complejo...');
    let suma = 0;
    for (let i = 0; i < 1000000; i++) {
      suma += i;
    }
    return suma;
  }

  return {
    obtenerResultado: function () {
      if (!calculado) {
        resultado = calcularComplejo();
        calculado = true;
      }
      return resultado;
    },
    reiniciar: function () {
      resultado = null;
      calculado = false;
    },
  };
}

const calculadora = crearCalculadoraLazy();
console.log(calculadora.obtenerResultado()); // Se calcula
console.log(calculadora.obtenerResultado()); // Se reutiliza
```

### 2. Pool de Objetos

```javascript
function crearPoolObjetos(factoryFunction, resetFunction) {
  const pool = [];

  return {
    obtener: function () {
      if (pool.length > 0) {
        return pool.pop();
      }
      return factoryFunction();
    },

    liberar: function (objeto) {
      resetFunction(objeto);
      pool.push(objeto);
    },

    tamaño: function () {
      return pool.length;
    },
  };
}

// Uso del pool
const poolParticulas = crearPoolObjetos(
  () => ({ x: 0, y: 0, velocidad: 0 }),
  particula => {
    particula.x = 0;
    particula.y = 0;
    particula.velocidad = 0;
  }
);

const particula = poolParticulas.obtener();
particula.x = 100;
poolParticulas.liberar(particula);
```

## 🔬 Ejemplos Avanzados

### 1. State Machine

```javascript
function crearStateMachine(estadoInicial, transiciones) {
  let estadoActual = estadoInicial;

  return {
    obtenerEstado: function () {
      return estadoActual;
    },

    transicionar: function (accion) {
      const estadoTransiciones = transiciones[estadoActual];

      if (estadoTransiciones && estadoTransiciones[accion]) {
        const nuevoEstado = estadoTransiciones[accion];
        console.log(`Transición: ${estadoActual} -> ${nuevoEstado}`);
        estadoActual = nuevoEstado;
        return true;
      }

      console.log(`Transición no válida: ${accion} desde ${estadoActual}`);
      return false;
    },

    puedeTransicionar: function (accion) {
      const estadoTransiciones = transiciones[estadoActual];
      return estadoTransiciones && estadoTransiciones[accion];
    },
  };
}

// Definir states y transiciones
const transicionesLampara = {
  apagada: { encender: 'encendida' },
  encendida: { apagar: 'apagada', atenuar: 'atenuada' },
  atenuada: { encender: 'encendida', apagar: 'apagada' },
};

const lampara = crearStateMachine('apagada', transicionesLampara);

lampara.transicionar('encender'); // apagada -> encendida
lampara.transicionar('atenuar'); // encendida -> atenuada
lampara.transicionar('apagar'); // atenuada -> apagada
```

### 2. Middleware System

```javascript
function crearMiddlewareSystem() {
  const middlewares = [];

  return {
    use: function (middleware) {
      middlewares.push(middleware);
    },

    ejecutar: function (contexto, callback) {
      let indice = 0;

      function next() {
        if (indice < middlewares.length) {
          const middleware = middlewares[indice++];
          middleware(contexto, next);
        } else {
          callback(contexto);
        }
      }

      next();
    },
  };
}

// Uso del sistema de middleware
const sistema = crearMiddlewareSystem();

sistema.use((contexto, next) => {
  console.log('Middleware 1: Validación');
  if (contexto.usuario) {
    next();
  } else {
    console.log('Usuario no autenticado');
  }
});

sistema.use((contexto, next) => {
  console.log('Middleware 2: Logging');
  contexto.timestamp = Date.now();
  next();
});

sistema.use((contexto, next) => {
  console.log('Middleware 3: Transformación');
  contexto.datos = contexto.datos.toUpperCase();
  next();
});

sistema.ejecutar({ usuario: 'Juan', datos: 'hola mundo' }, contexto => {
  console.log('Resultado final:', contexto);
});
```

## 🎯 Tips para WorldSkills

### 1. Patrones Rápidos

```javascript
// Singleton rápido
const Singleton = (function () {
  let instancia;

  return {
    obtenerInstancia: function () {
      if (!instancia) {
        instancia = { id: Date.now() };
      }
      return instancia;
    },
  };
})();

// Factory rápido
const crearObjeto = tipo => {
  const tipos = {
    a: () => ({ tipo: 'A', metodo: () => 'Soy A' }),
    b: () => ({ tipo: 'B', metodo: () => 'Soy B' }),
  };
  return tipos[tipo] ? tipos[tipo]() : null;
};

// Observer rápido
const crearObservable = () => {
  const observadores = [];
  return {
    suscribir: fn => observadores.push(fn),
    notificar: data => observadores.forEach(fn => fn(data)),
  };
};
```

### 2. Debugging de Closures

```javascript
function debugClosure(fn) {
  return function (...args) {
    console.log('Argumentos:', args);
    console.log('Scope:', this);
    const resultado = fn.apply(this, args);
    console.log('Resultado:', resultado);
    return resultado;
  };
}

// Uso
const funcionDebug = debugClosure(function (x, y) {
  return x + y;
});

funcionDebug(2, 3); // Muestra información de debug
```

## 📚 Recursos Adicionales

### Libros Recomendados

- "You Don't Know JS: Scope & Closures" - Kyle Simpson
- "JavaScript: The Good Parts" - Douglas Crockford
- "Eloquent JavaScript" - Marijn Haverbeke

### Herramientas Útiles

- Chrome DevTools (Sources tab)
- [JavaScript Visualizer](https://pythontutor.com/javascript.html)
- [Closure Compiler](https://closure-compiler.appspot.com/)

### Conceptos Relacionados

- Hoisting
- Execution Context
- Scope Chain
- Garbage Collection
- Memory Management

---

¡Domina los closures y tendrás una herramienta poderosa para crear código JavaScript elegante y eficiente! 🚀
