# ✨ Mejores Prácticas: JavaScript Avanzado

## 📚 Introducción

Esta guía reúne las mejores prácticas para escribir código JavaScript avanzado de calidad, enfocándose en scope, hoisting, arrow functions, callbacks y funciones de orden superior.

## 🎯 Principios Fundamentales

### 1. Claridad sobre Brevedad

```javascript
// ❌ Muy conciso pero confuso
const p = d => d.filter(x => x.a > 18).map(x => x.n);

// ✅ Claro y expresivo
const obtenerNombresAdultos = personas =>
  personas.filter(persona => persona.edad > 18).map(persona => persona.nombre);
```

### 2. Consistencia en el Estilo

```javascript
// ✅ Estilo consistente con arrow functions
const procesarUsuarios = usuarios => {
  return usuarios
    .filter(usuario => usuario.activo)
    .map(usuario => ({
      id: usuario.id,
      nombre: usuario.nombre.toUpperCase(),
    }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre));
};
```

### 3. Inmutabilidad Cuando Sea Posible

```javascript
// ❌ Mutación del array original
function agregarElemento(array, elemento) {
  array.push(elemento);
  return array;
}

// ✅ Retorna nuevo array
const agregarElemento = (array, elemento) => [...array, elemento];
```

## 🔧 Mejores Prácticas por Tema

### 📍 Scope y Variables

#### 1. Preferir const, usar let, evitar var

```javascript
// ✅ Usar const por defecto
const CONFIG = {
  API_URL: 'https://api.ejemplo.com',
  TIMEOUT: 5000,
};

// ✅ Usar let para variables que cambiarán
let contador = 0;
for (let i = 0; i < 10; i++) {
  contador += i;
}

// ❌ Evitar var
var mensaje = 'Hola'; // puede causar problemas de scope
```

#### 2. Declarar Variables en el Scope Más Pequeño

```javascript
// ❌ Variable declarada demasiado pronto
function procesarDatos(datos) {
  let resultado;

  if (datos.length > 0) {
    resultado = datos.map(item => item.valor);
  }

  return resultado;
}

// ✅ Variable declarada cuando se necesita
function procesarDatos(datos) {
  if (datos.length > 0) {
    const resultado = datos.map(item => item.valor);
    return resultado;
  }

  return [];
}
```

#### 3. Usar IIFE para Evitar Contaminación Global

```javascript
// ✅ Módulo auto-ejecutable
(function () {
  const configuracionPrivada = {
    apiKey: 'clave-secreta',
    debug: true,
  };

  window.MiApp = {
    inicializar: function () {
      if (configuracionPrivada.debug) {
        console.log('Aplicación inicializada');
      }
    },
  };
})();
```

### 🏹 Arrow Functions

#### 1. Usar Arrow Functions para Callbacks

```javascript
// ✅ Perfecto para callbacks
const numeros = [1, 2, 3, 4, 5];
const pares = numeros.filter(num => num % 2 === 0);
const dobles = numeros.map(num => num * 2);

// ✅ Mantiene el contexto this
class Contador {
  constructor() {
    this.count = 0;
  }

  iniciar() {
    setInterval(() => {
      this.count++;
      console.log(this.count);
    }, 1000);
  }
}
```

#### 2. Usar Funciones Tradicionales para Métodos de Objeto

```javascript
// ✅ Función tradicional para métodos
const usuario = {
  nombre: 'Ana',
  edad: 25,

  saludar: function () {
    return `Hola, soy ${this.nombre}`;
  },

  // ✅ Arrow function para callbacks dentro del método
  inicializarEventos: function () {
    document.addEventListener('click', e => {
      console.log(`${this.nombre} detectó un click`);
    });
  },
};
```

#### 3. Paréntesis para Objetos de Retorno

```javascript
// ❌ Error de sintaxis
const crearUsuario = nombre => { nombre: nombre, activo: true };

// ✅ Paréntesis requeridos para objetos
const crearUsuario = nombre => ({ nombre: nombre, activo: true });

// ✅ Alternativa con return explícito
const crearUsuario = nombre => {
  return {
    nombre: nombre,
    activo: true
  };
};
```

### 📞 Callbacks y Higher-Order Functions

#### 1. Evitar Callback Hell

```javascript
// ❌ Callback Hell
function obtenerDatosUsuario(id, callback) {
  obtenerUsuario(id, (error, usuario) => {
    if (error) {
      callback(error);
    } else {
      obtenerPerfil(usuario.id, (error, perfil) => {
        if (error) {
          callback(error);
        } else {
          obtenerConfiguracion(perfil.id, (error, config) => {
            if (error) {
              callback(error);
            } else {
              callback(null, { usuario, perfil, config });
            }
          });
        }
      });
    }
  });
}

// ✅ Funciones separadas
function obtenerDatosUsuario(id, callback) {
  obtenerUsuario(id, (error, usuario) => {
    if (error) return callback(error);
    obtenerPerfilUsuario(usuario, callback);
  });
}

function obtenerPerfilUsuario(usuario, callback) {
  obtenerPerfil(usuario.id, (error, perfil) => {
    if (error) return callback(error);
    obtenerConfiguracionPerfil(usuario, perfil, callback);
  });
}

function obtenerConfiguracionPerfil(usuario, perfil, callback) {
  obtenerConfiguracion(perfil.id, (error, config) => {
    if (error) return callback(error);
    callback(null, { usuario, perfil, config });
  });
}
```

#### 2. Usar Promises para Operaciones Asíncronas

```javascript
// ✅ Promises en lugar de callbacks anidados
function obtenerDatosUsuario(id) {
  return obtenerUsuario(id)
    .then(usuario => obtenerPerfil(usuario.id))
    .then(perfil => obtenerConfiguracion(perfil.id))
    .then(config => ({ usuario, perfil, config }));
}

// ✅ Async/await para mayor claridad
async function obtenerDatosUsuario(id) {
  try {
    const usuario = await obtenerUsuario(id);
    const perfil = await obtenerPerfil(usuario.id);
    const config = await obtenerConfiguracion(perfil.id);
    return { usuario, perfil, config };
  } catch (error) {
    throw error;
  }
}
```

#### 3. Crear Funciones Puras

```javascript
// ✅ Función pura - mismo input, mismo output, sin efectos secundarios
const calcularImpuesto = (precio, porcentaje) => precio * (porcentaje / 100);

// ✅ Función pura para transformar datos
const formatearUsuario = usuario => ({
  id: usuario.id,
  nombre: usuario.nombre.toUpperCase(),
  email: usuario.email.toLowerCase(),
  fechaFormateada: new Date(usuario.fechaNacimiento).toLocaleDateString(),
});

// ❌ Función impura - modifica estado externo
let total = 0;
const sumarImpuro = valor => {
  total += valor; // Efecto secundario
  return total;
};

// ✅ Función pura alternativa
const sumar = (acumulador, valor) => acumulador + valor;
```

## 🛠️ Patrones de Diseño Útiles

### 1. Module Pattern

```javascript
const ModuloCarrito = (function () {
  // Variables privadas
  let items = [];
  let total = 0;

  // Métodos privados
  function calcularTotal() {
    total = items.reduce((acc, item) => acc + item.precio, 0);
  }

  // API pública
  return {
    agregar: function (item) {
      items.push(item);
      calcularTotal();
    },

    obtenerTotal: function () {
      return total;
    },

    obtenerItems: function () {
      return [...items]; // Retorna copia
    },

    vaciar: function () {
      items = [];
      total = 0;
    },
  };
})();
```

### 2. Factory Pattern

```javascript
// ✅ Factory para crear objetos similares
function crearUsuario(nombre, email, rol = 'usuario') {
  return {
    nombre,
    email,
    rol,
    activo: true,
    fechaCreacion: new Date(),

    activar: function () {
      this.activo = true;
    },

    desactivar: function () {
      this.activo = false;
    },

    cambiarRol: function (nuevoRol) {
      this.rol = nuevoRol;
    },
  };
}

// Uso
const admin = crearUsuario('Ana', 'ana@email.com', 'admin');
const usuario = crearUsuario('Juan', 'juan@email.com');
```

### 3. Observer Pattern

```javascript
// ✅ Patrón Observer para eventos
function crearObservador() {
  const observadores = {};

  return {
    suscribir: function (evento, callback) {
      if (!observadores[evento]) {
        observadores[evento] = [];
      }
      observadores[evento].push(callback);
    },

    desuscribir: function (evento, callback) {
      if (observadores[evento]) {
        observadores[evento] = observadores[evento].filter(
          cb => cb !== callback
        );
      }
    },

    notificar: function (evento, datos) {
      if (observadores[evento]) {
        observadores[evento].forEach(callback => callback(datos));
      }
    },
  };
}

// Uso
const eventos = crearObservador();

eventos.suscribir('usuario-creado', usuario => {
  console.log('Nuevo usuario:', usuario);
});

eventos.suscribir('usuario-creado', usuario => {
  enviarEmailBienvenida(usuario);
});

eventos.notificar('usuario-creado', {
  nombre: 'Juan',
  email: 'juan@email.com',
});
```

## 🔍 Debugging y Testing

### 1. Logging Efectivo

```javascript
// ✅ Logging estructurado
function procesarPedido(pedido) {
  console.log('Procesando pedido:', {
    id: pedido.id,
    usuario: pedido.usuario,
    items: pedido.items.length,
    total: pedido.total,
  });

  try {
    const resultado = validarPedido(pedido);
    console.log('Pedido validado:', resultado);
    return resultado;
  } catch (error) {
    console.error('Error al procesar pedido:', {
      pedidoId: pedido.id,
      error: error.message,
      stack: error.stack,
    });
    throw error;
  }
}
```

### 2. Funciones Testeable

```javascript
// ✅ Función fácil de testear
function calcularDescuento(precio, porcentaje, tipoCliente) {
  if (typeof precio !== 'number' || precio < 0) {
    throw new Error('Precio debe ser un número positivo');
  }

  if (typeof porcentaje !== 'number' || porcentaje < 0 || porcentaje > 100) {
    throw new Error('Porcentaje debe estar entre 0 y 100');
  }

  let descuento = precio * (porcentaje / 100);

  // Descuento adicional para clientes VIP
  if (tipoCliente === 'vip') {
    descuento *= 1.2;
  }

  return Math.min(descuento, precio); // El descuento no puede ser mayor al precio
}

// ✅ Test simple
function testCalcularDescuento() {
  console.assert(
    calcularDescuento(100, 10, 'regular') === 10,
    'Descuento regular'
  );
  console.assert(calcularDescuento(100, 10, 'vip') === 12, 'Descuento VIP');
  console.assert(
    calcularDescuento(100, 150, 'regular') === 100,
    'Descuento máximo'
  );
}
```

## 🚀 Optimización y Rendimiento

### 1. Memoización

```javascript
// ✅ Memoización para funciones costosas
function memoizar(fn) {
  const cache = new Map();

  return function (...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const resultado = fn.apply(this, args);
    cache.set(key, resultado);
    return resultado;
  };
}

// Uso
const fibonacciMemoizado = memoizar(function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
});
```

### 2. Debouncing

```javascript
// ✅ Debouncing para eventos frecuentes
function debounce(func, delay) {
  let timeoutId;

  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// Uso
const buscarDebounced = debounce(function (query) {
  console.log('Buscando:', query);
  // Lógica de búsqueda
}, 300);

document.getElementById('search').addEventListener('input', e => {
  buscarDebounced(e.target.value);
});
```

### 3. Lazy Loading

```javascript
// ✅ Carga perezosa de módulos
const moduloCarrito = (function () {
  let instancia = null;

  return {
    obtenerInstancia: function () {
      if (!instancia) {
        instancia = {
          items: [],
          agregar: function (item) {
            this.items.push(item);
          },
          obtenerTotal: function () {
            return this.items.reduce((total, item) => total + item.precio, 0);
          },
        };
      }
      return instancia;
    },
  };
})();
```

## 🔒 Seguridad y Validación

### 1. Validación de Entrada

```javascript
// ✅ Validación robusta
function validarEmail(email) {
  if (typeof email !== 'string') {
    throw new Error('Email debe ser una cadena');
  }

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validarEdad(edad) {
  if (typeof edad !== 'number' || !Number.isInteger(edad)) {
    throw new Error('Edad debe ser un número entero');
  }

  if (edad < 0 || edad > 150) {
    throw new Error('Edad debe estar entre 0 y 150');
  }

  return true;
}
```

### 2. Sanitización de Datos

```javascript
// ✅ Sanitización básica
function sanitizarTexto(texto) {
  if (typeof texto !== 'string') {
    return '';
  }

  return texto
    .trim()
    .replace(/[<>]/g, '') // Remover caracteres HTML básicos
    .substring(0, 1000); // Limitar longitud
}

function sanitizarNumero(numero) {
  const num = parseFloat(numero);
  return isNaN(num) ? 0 : num;
}
```

## 📋 Checklist de Mejores Prácticas

### ✅ Código Limpio

- [ ] Nombres de variables y funciones descriptivos
- [ ] Funciones pequeñas y enfocadas (una responsabilidad)
- [ ] Comentarios solo cuando sea necesario
- [ ] Consistencia en el estilo de código
- [ ] Evitar código duplicado

### ✅ Scope y Variables

- [ ] Usar const por defecto, let cuando sea necesario
- [ ] Evitar var completamente
- [ ] Declarar variables en el scope más pequeño posible
- [ ] Evitar variables globales

### ✅ Funciones

- [ ] Preferir arrow functions para callbacks
- [ ] Usar funciones tradicionales para métodos de objeto
- [ ] Crear funciones puras cuando sea posible
- [ ] Evitar funciones demasiado largas

### ✅ Asíncrono

- [ ] Usar Promises o async/await en lugar de callbacks anidados
- [ ] Manejar errores apropiadamente
- [ ] Usar debouncing para eventos frecuentes

### ✅ Rendimiento

- [ ] Memoizar funciones costosas
- [ ] Evitar operaciones en loops cuando sea posible
- [ ] Usar lazy loading para recursos grandes

### ✅ Seguridad

- [ ] Validar todas las entradas
- [ ] Sanitizar datos del usuario
- [ ] Evitar eval() y Function constructor

## 📖 Recursos Recomendados

- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [MDN JavaScript Best Practices](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [JavaScript: The Good Parts](https://www.oreilly.com/library/view/javascript-the-good/9780596517748/)

## 🎯 Puntos Clave

1. **Claridad** sobre brevedad - código legible es más valioso
2. **Consistencia** en el estilo y patrones
3. **Funciones pequeñas** con una sola responsabilidad
4. **Inmutabilidad** cuando sea posible
5. **Validación** de todas las entradas
6. **Manejo de errores** apropiado
7. **Testing** de funciones críticas
8. **Optimización** solo cuando sea necesario
