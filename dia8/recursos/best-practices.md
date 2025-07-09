# 🌟 Mejores Prácticas JavaScript Avanzado

## 📋 Índice

1. [Principios Fundamentales](#principios-fundamentales)
2. [Patrones de Diseño](#patrones-de-diseño)
3. [Optimización de Rendimiento](#optimización-de-rendimiento)
4. [Manejo de Errores](#manejo-de-errores)
5. [Testing y Debugging](#testing-y-debugging)
6. [Seguridad](#seguridad)
7. [Estándares de Código](#estándares-de-código)
8. [Tips WorldSkills](#tips-worldskills)
9. [Herramientas y Recursos](#herramientas-y-recursos)

---

## 🎯 Principios Fundamentales

### 1. SOLID en JavaScript

#### Single Responsibility Principle (SRP)

```javascript
// ❌ Mal: Clase con múltiples responsabilidades
class Usuario {
  constructor(nombre, email) {
    this.nombre = nombre;
    this.email = email;
  }

  // Responsabilidad 1: Gestión de datos
  obtenerDatos() {
    return { nombre: this.nombre, email: this.email };
  }

  // Responsabilidad 2: Validación
  validarEmail() {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
  }

  // Responsabilidad 3: Persistencia
  guardarEnBaseDatos() {
    // Lógica de guardado
  }

  // Responsabilidad 4: Notificaciones
  enviarEmailBienvenida() {
    // Lógica de email
  }
}

// ✅ Bien: Separación de responsabilidades
class Usuario {
  constructor(nombre, email) {
    this.nombre = nombre;
    this.email = email;
  }

  obtenerDatos() {
    return { nombre: this.nombre, email: this.email };
  }
}

class ValidadorUsuario {
  static validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

class RepositorioUsuario {
  async guardar(usuario) {
    // Lógica de persistencia
  }
}

class ServicioNotificaciones {
  async enviarBienvenida(usuario) {
    // Lógica de notificaciones
  }
}
```

#### Open/Closed Principle (OCP)

```javascript
// ✅ Extensible sin modificar código existente
class CalculadoraDescuento {
  constructor() {
    this.estrategias = new Map();
  }

  registrarEstrategia(tipo, estrategia) {
    this.estrategias.set(tipo, estrategia);
  }

  calcular(precio, tipo) {
    const estrategia = this.estrategias.get(tipo);
    if (!estrategia) throw new Error(`Estrategia ${tipo} no encontrada`);
    return estrategia.calcular(precio);
  }
}

// Estrategias extensibles
class DescuentoEstudiante {
  calcular(precio) {
    return precio * 0.1; // 10% descuento
  }
}

class DescuentoSenior {
  calcular(precio) {
    return precio * 0.15; // 15% descuento
  }
}

// Uso
const calculadora = new CalculadoraDescuento();
calculadora.registrarEstrategia('estudiante', new DescuentoEstudiante());
calculadora.registrarEstrategia('senior', new DescuentoSenior());
```

### 2. DRY (Don't Repeat Yourself)

```javascript
// ❌ Mal: Código repetitivo
function procesarUsuarios(usuarios) {
  const resultado = [];
  for (const usuario of usuarios) {
    if (usuario.activo && usuario.email && usuario.nombre) {
      resultado.push({
        id: usuario.id,
        nombre: usuario.nombre.trim(),
        email: usuario.email.toLowerCase(),
      });
    }
  }
  return resultado;
}

function procesarProductos(productos) {
  const resultado = [];
  for (const producto of productos) {
    if (producto.activo && producto.nombre && producto.precio) {
      resultado.push({
        id: producto.id,
        nombre: producto.nombre.trim(),
        precio: parseFloat(producto.precio),
      });
    }
  }
  return resultado;
}

// ✅ Bien: Función reutilizable
function procesarElementos(elementos, validador, transformador) {
  return elementos.filter(validador).map(transformador);
}

// Validadores específicos
const validarUsuario = usuario =>
  usuario.activo && usuario.email && usuario.nombre;

const validarProducto = producto =>
  producto.activo && producto.nombre && producto.precio;

// Transformadores específicos
const transformarUsuario = usuario => ({
  id: usuario.id,
  nombre: usuario.nombre.trim(),
  email: usuario.email.toLowerCase(),
});

const transformarProducto = producto => ({
  id: producto.id,
  nombre: producto.nombre.trim(),
  precio: parseFloat(producto.precio),
});

// Uso
const usuariosProcesados = procesarElementos(
  usuarios,
  validarUsuario,
  transformarUsuario
);
```

### 3. KISS (Keep It Simple, Stupid)

```javascript
// ❌ Mal: Complejidad innecesaria
function calcularDescuentoComplejo(
  precio,
  tipoUsuario,
  fechaRegistro,
  comprasAnteriores
) {
  const ahora = new Date();
  const registroEnMeses = (ahora - fechaRegistro) / (1000 * 60 * 60 * 24 * 30);

  if (tipoUsuario === 'premium') {
    if (registroEnMeses > 12) {
      if (comprasAnteriores.length > 10) {
        return precio * 0.25;
      } else if (comprasAnteriores.length > 5) {
        return precio * 0.2;
      } else {
        return precio * 0.15;
      }
    } else {
      return precio * 0.1;
    }
  } else if (tipoUsuario === 'regular') {
    if (registroEnMeses > 6) {
      return precio * 0.05;
    } else {
      return precio * 0.02;
    }
  }
  return 0;
}

// ✅ Bien: Simple y claro
const descuentos = {
  premium: {
    base: 0.1,
    veterano: 0.15, // > 12 meses
    frecuente: 0.2, // > 5 compras
    vip: 0.25, // > 10 compras
  },
  regular: {
    base: 0.02,
    veterano: 0.05, // > 6 meses
  },
};

function calcularDescuento(precio, tipoUsuario, esVeterano, comprasAnteriores) {
  const config = descuentos[tipoUsuario];
  if (!config) return 0;

  let porcentaje = config.base;

  if (tipoUsuario === 'premium' && esVeterano) {
    if (comprasAnteriores > 10) porcentaje = config.vip;
    else if (comprasAnteriores > 5) porcentaje = config.frecuente;
    else porcentaje = config.veterano;
  } else if (tipoUsuario === 'regular' && esVeterano) {
    porcentaje = config.veterano;
  }

  return precio * porcentaje;
}
```

---

## 🏗️ Patrones de Diseño

### 1. Module Pattern

```javascript
// Módulo con encapsulación
const GestorTareas = (function () {
  // Variables privadas
  let tareas = [];
  let contadorId = 0;

  // Métodos privados
  function generarId() {
    return ++contadorId;
  }

  function validarTarea(tarea) {
    return tarea && typeof tarea.titulo === 'string' && tarea.titulo.trim();
  }

  // API pública
  return {
    agregar(tarea) {
      if (!validarTarea(tarea)) {
        throw new Error('Tarea inválida');
      }

      const nuevaTarea = {
        id: generarId(),
        titulo: tarea.titulo.trim(),
        completada: false,
        fechaCreacion: new Date(),
      };

      tareas.push(nuevaTarea);
      return nuevaTarea;
    },

    obtener(id) {
      return tareas.find(t => t.id === id);
    },

    listar() {
      return [...tareas]; // Copia defensiva
    },

    completar(id) {
      const tarea = this.obtener(id);
      if (tarea) {
        tarea.completada = true;
        tarea.fechaCompletada = new Date();
      }
      return tarea;
    },
  };
})();
```

### 2. Observer Pattern

```javascript
// Sistema de eventos eficiente
class EventBus {
  constructor() {
    this.eventos = new Map();
  }

  on(evento, callback, opciones = {}) {
    if (!this.eventos.has(evento)) {
      this.eventos.set(evento, new Set());
    }

    const handler = {
      callback,
      once: opciones.once || false,
    };

    this.eventos.get(evento).add(handler);

    // Retornar función para unsubscribe
    return () => this.off(evento, handler);
  }

  once(evento, callback) {
    return this.on(evento, callback, { once: true });
  }

  off(evento, handler) {
    const handlers = this.eventos.get(evento);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.eventos.delete(evento);
      }
    }
  }

  emit(evento, datos) {
    const handlers = this.eventos.get(evento);
    if (!handlers) return;

    const handlersToRemove = [];

    handlers.forEach(handler => {
      try {
        handler.callback(datos);
        if (handler.once) {
          handlersToRemove.push(handler);
        }
      } catch (error) {
        console.error(`Error en handler de ${evento}:`, error);
      }
    });

    // Limpiar handlers de "once"
    handlersToRemove.forEach(handler => {
      handlers.delete(handler);
    });
  }
}

// Uso del EventBus
const eventBus = new EventBus();

// Suscripción
const unsub = eventBus.on('usuario-creado', usuario => {
  console.log('Nuevo usuario:', usuario);
});

// Emisión
eventBus.emit('usuario-creado', { id: 1, nombre: 'Juan' });

// Desuscripción
unsub();
```

### 3. Strategy Pattern

```javascript
// Estrategias de ordenamiento
class EstrategiaOrdenamiento {
  ordenar(array) {
    throw new Error('Método debe ser implementado');
  }
}

class OrdenamientoBurbuja extends EstrategiaOrdenamiento {
  ordenar(array) {
    const arr = [...array];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        }
      }
    }
    return arr;
  }
}

class OrdenamientoRapido extends EstrategiaOrdenamiento {
  ordenar(array) {
    if (array.length <= 1) return array;

    const pivot = array[Math.floor(array.length / 2)];
    const menores = array.filter(x => x < pivot);
    const iguales = array.filter(x => x === pivot);
    const mayores = array.filter(x => x > pivot);

    return [...this.ordenar(menores), ...iguales, ...this.ordenar(mayores)];
  }
}

// Contexto que usa estrategias
class Ordenador {
  constructor(estrategia) {
    this.estrategia = estrategia;
  }

  setEstrategia(estrategia) {
    this.estrategia = estrategia;
  }

  ordenar(array) {
    return this.estrategia.ordenar(array);
  }
}

// Uso
const ordenador = new Ordenador(new OrdenamientoRapido());
const resultado = ordenador.ordenar([3, 1, 4, 1, 5, 9, 2, 6]);
```

---

## ⚡ Optimización de Rendimiento

### 1. Memoización Avanzada

```javascript
// Memoización con TTL y límite de cache
class MemoizacionAvanzada {
  constructor(opciones = {}) {
    this.cache = new Map();
    this.tiempos = new Map();
    this.ttl = opciones.ttl || 5 * 60 * 1000; // 5 minutos
    this.maxSize = opciones.maxSize || 100;
  }

  memoizar(fn) {
    return (...args) => {
      const key = JSON.stringify(args);
      const ahora = Date.now();

      // Verificar si está en cache y no ha expirado
      if (this.cache.has(key)) {
        const tiempoCache = this.tiempos.get(key);
        if (ahora - tiempoCache < this.ttl) {
          return this.cache.get(key);
        } else {
          this.cache.delete(key);
          this.tiempos.delete(key);
        }
      }

      // Limpiar cache si está lleno
      if (this.cache.size >= this.maxSize) {
        this.limpiarCache();
      }

      const resultado = fn(...args);
      this.cache.set(key, resultado);
      this.tiempos.set(key, ahora);

      return resultado;
    };
  }

  limpiarCache() {
    const ahora = Date.now();
    const keysToDelete = [];

    this.tiempos.forEach((tiempo, key) => {
      if (ahora - tiempo >= this.ttl) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => {
      this.cache.delete(key);
      this.tiempos.delete(key);
    });

    // Si aún está lleno, eliminar los más antiguos
    if (this.cache.size >= this.maxSize) {
      const entries = Array.from(this.tiempos.entries())
        .sort((a, b) => a[1] - b[1])
        .slice(0, Math.floor(this.maxSize * 0.3));

      entries.forEach(([key]) => {
        this.cache.delete(key);
        this.tiempos.delete(key);
      });
    }
  }
}

// Uso
const memo = new MemoizacionAvanzada({ ttl: 60000, maxSize: 50 });
const fibonacciMemo = memo.memoizar(fibonacci);
```

### 2. Lazy Loading de Funciones

```javascript
// Lazy loading de funciones pesadas
function crearCargadorLazy() {
  const cache = new Map();

  return function lazy(clave, factory) {
    if (cache.has(clave)) {
      return cache.get(clave);
    }

    let resultado;
    const getter = () => {
      if (!resultado) {
        resultado = factory();
      }
      return resultado;
    };

    cache.set(clave, getter);
    return getter;
  };
}

const lazy = crearCargadorLazy();

// Definir funciones pesadas
const procesadorComplejo = lazy('procesador', () => {
  console.log('Inicializando procesador complejo...');
  return {
    procesar: datos => {
      // Procesamiento pesado
      return datos.map(d => d * 2);
    },
  };
});

// Solo se inicializa cuando se usa
const resultado = procesadorComplejo().procesar([1, 2, 3]);
```

### 3. Virtual Scrolling

```javascript
// Virtual scrolling para listas grandes
class VirtualScroll {
  constructor(contenedor, configuracion) {
    this.contenedor = contenedor;
    this.altoItem = configuracion.altoItem;
    this.items = configuracion.items;
    this.renderItem = configuracion.renderItem;
    this.itemsVisibles = Math.ceil(contenedor.clientHeight / this.altoItem) + 2;

    this.inicializar();
  }

  inicializar() {
    this.contenedor.innerHTML = `
      <div class="virtual-scroll-container" style="height: ${
        this.items.length * this.altoItem
      }px">
        <div class="virtual-scroll-viewport"></div>
      </div>
    `;

    this.container = this.contenedor.querySelector('.virtual-scroll-container');
    this.viewport = this.contenedor.querySelector('.virtual-scroll-viewport');

    this.contenedor.addEventListener('scroll', () => this.actualizar());
    this.actualizar();
  }

  actualizar() {
    const scrollTop = this.contenedor.scrollTop;
    const indiceInicio = Math.floor(scrollTop / this.altoItem);
    const indiceFin = Math.min(
      indiceInicio + this.itemsVisibles,
      this.items.length
    );

    this.viewport.style.transform = `translateY(${
      indiceInicio * this.altoItem
    }px)`;

    let html = '';
    for (let i = indiceInicio; i < indiceFin; i++) {
      html += this.renderItem(this.items[i], i);
    }

    this.viewport.innerHTML = html;
  }
}

// Uso
const virtualScroll = new VirtualScroll(document.getElementById('lista'), {
  altoItem: 50,
  items: Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    texto: `Item ${i}`,
  })),
  renderItem: (item, index) => `
    <div class="item" style="height: 50px; padding: 10px;">
      ${item.texto}
    </div>
  `,
});
```

---

## 🚨 Manejo de Errores

### 1. Error Handling Centralizado

```javascript
// Sistema de manejo de errores
class ErrorHandler {
  constructor() {
    this.handlers = new Map();
    this.logger = console;
  }

  registrar(tipoError, handler) {
    if (!this.handlers.has(tipoError)) {
      this.handlers.set(tipoError, []);
    }
    this.handlers.get(tipoError).push(handler);
  }

  manejar(error, contexto = {}) {
    const tipoError = error.constructor.name;
    const handlers = this.handlers.get(tipoError) || [];

    // Log del error
    this.logger.error(`Error ${tipoError}:`, error.message, contexto);

    // Ejecutar handlers específicos
    handlers.forEach(handler => {
      try {
        handler(error, contexto);
      } catch (handlerError) {
        this.logger.error('Error en handler:', handlerError);
      }
    });

    // Handler genérico
    if (handlers.length === 0) {
      this.manejarGenerico(error, contexto);
    }
  }

  manejarGenerico(error, contexto) {
    // Notificar al usuario
    this.notificarUsuario(error);

    // Reportar error
    this.reportarError(error, contexto);
  }

  notificarUsuario(error) {
    // Mostrar mensaje amigable al usuario
    const mensaje = this.obtenerMensajeUsuario(error);
    // Implementar sistema de notificaciones
  }

  reportarError(error, contexto) {
    // Enviar error a servicio de monitoreo
    // fetch('/api/errores', { ... })
  }

  obtenerMensajeUsuario(error) {
    const mensajes = {
      TypeError: 'Error en el procesamiento de datos',
      NetworkError: 'Error de conexión',
      ValidationError: 'Los datos ingresados no son válidos',
    };

    return (
      mensajes[error.constructor.name] || 'Ha ocurrido un error inesperado'
    );
  }
}

// Uso
const errorHandler = new ErrorHandler();

errorHandler.registrar('ValidationError', (error, contexto) => {
  // Resaltar campos con errores
  if (contexto.formulario) {
    marcarCamposInvalidos(contexto.formulario, error.campos);
  }
});

// Wrapper para funciones
function conManejoErrores(fn) {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      errorHandler.manejar(error, { funcion: fn.name, argumentos: args });
      throw error;
    }
  };
}
```

### 2. Validación Robusta

```javascript
// Sistema de validación
class ValidadorEsquema {
  constructor() {
    this.reglas = new Map();
  }

  agregarRegla(nombre, validador) {
    this.reglas.set(nombre, validador);
  }

  validar(datos, esquema) {
    const errores = [];

    for (const [campo, reglas] of Object.entries(esquema)) {
      const valor = datos[campo];

      for (const regla of reglas) {
        const resultado = this.aplicarRegla(valor, regla, campo);
        if (!resultado.valido) {
          errores.push({
            campo,
            regla: regla.tipo,
            mensaje: resultado.mensaje,
          });
        }
      }
    }

    return {
      valido: errores.length === 0,
      errores,
    };
  }

  aplicarRegla(valor, regla, campo) {
    const validador = this.reglas.get(regla.tipo);
    if (!validador) {
      throw new Error(`Regla ${regla.tipo} no encontrada`);
    }

    return validador(valor, regla.opciones, campo);
  }
}

// Validadores predefinidos
const validador = new ValidadorEsquema();

validador.agregarRegla('requerido', (valor, opciones, campo) => {
  const valido = valor !== undefined && valor !== null && valor !== '';
  return {
    valido,
    mensaje: valido ? null : `${campo} es requerido`,
  };
});

validador.agregarRegla('email', (valor, opciones, campo) => {
  if (!valor) return { valido: true };

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const valido = regex.test(valor);

  return {
    valido,
    mensaje: valido ? null : `${campo} debe ser un email válido`,
  };
});

validador.agregarRegla('minimo', (valor, opciones, campo) => {
  if (!valor) return { valido: true };

  const valido = valor.length >= opciones.valor;

  return {
    valido,
    mensaje: valido
      ? null
      : `${campo} debe tener al menos ${opciones.valor} caracteres`,
  };
});

// Uso
const esquemaUsuario = {
  nombre: [{ tipo: 'requerido' }, { tipo: 'minimo', opciones: { valor: 3 } }],
  email: [{ tipo: 'requerido' }, { tipo: 'email' }],
};

const datosUsuario = {
  nombre: 'Juan',
  email: 'juan@ejemplo.com',
};

const resultado = validador.validar(datosUsuario, esquemaUsuario);
```

---

## 🧪 Testing y Debugging

### 1. Unit Testing

```javascript
// Test utilities
class TestUtils {
  static async expectAsync(promesa, esperado) {
    try {
      const resultado = await promesa;
      return this.assertEquals(resultado, esperado);
    } catch (error) {
      throw new Error(`Promesa falló: ${error.message}`);
    }
  }

  static assertEquals(actual, esperado) {
    if (JSON.stringify(actual) !== JSON.stringify(esperado)) {
      throw new Error(
        `Esperado: ${JSON.stringify(esperado)}, Actual: ${JSON.stringify(
          actual
        )}`
      );
    }
    return true;
  }

  static assertThrows(fn, expectedError) {
    try {
      fn();
      throw new Error('Se esperaba que la función lanzara un error');
    } catch (error) {
      if (expectedError && !error.message.includes(expectedError)) {
        throw new Error(
          `Error esperado: ${expectedError}, Error actual: ${error.message}`
        );
      }
    }
    return true;
  }
}

// Tests para closures
function testClosures() {
  console.log('🧪 Testing Closures...');

  // Test contador
  const contador = crearContador();
  TestUtils.assertEquals(contador(), 1);
  TestUtils.assertEquals(contador(), 2);

  // Test factory
  const calculadora = crearCalculadora();
  TestUtils.assertEquals(calculadora.sumar(2, 3), 5);
  TestUtils.assertEquals(calculadora.obtenerHistorial().length, 1);

  console.log('✅ Closures tests passed');
}

// Tests para prototipos
function testPrototipos() {
  console.log('🧪 Testing Prototipos...');

  const animal = new Animal('Perro');
  const perro = new Perro('Fido', 'Labrador');

  TestUtils.assertEquals(animal.tipo, 'Perro');
  TestUtils.assertEquals(perro.hablar(), 'Fido dice: Woof!');

  console.log('✅ Prototipos tests passed');
}

// Ejecutar tests
function ejecutarTests() {
  try {
    testClosures();
    testPrototipos();
    console.log('🎉 Todos los tests pasaron');
  } catch (error) {
    console.error('❌ Test falló:', error.message);
  }
}
```

### 2. Debugging Avanzado

```javascript
// Debugging utilities
class Debugger {
  constructor() {
    this.activo = false;
    this.logs = [];
    this.tiempos = new Map();
  }

  activar() {
    this.activo = true;
    console.log('🐛 Debugging activado');
  }

  desactivar() {
    this.activo = false;
    console.log('🐛 Debugging desactivado');
  }

  log(mensaje, datos = {}) {
    if (!this.activo) return;

    const entrada = {
      timestamp: new Date().toISOString(),
      mensaje,
      datos,
      stack: new Error().stack,
    };

    this.logs.push(entrada);
    console.log(`🐛 ${entrada.timestamp}: ${mensaje}`, datos);
  }

  tiempo(etiqueta) {
    if (!this.activo) return;

    this.tiempos.set(etiqueta, performance.now());
    console.time(etiqueta);
  }

  tiempoFin(etiqueta) {
    if (!this.activo) return;

    const inicio = this.tiempos.get(etiqueta);
    if (inicio) {
      const duracion = performance.now() - inicio;
      console.log(`⏱️ ${etiqueta}: ${duracion.toFixed(2)}ms`);
      this.tiempos.delete(etiqueta);
    }
    console.timeEnd(etiqueta);
  }

  trazar(fn, nombre) {
    if (!this.activo) return fn;

    return (...args) => {
      this.log(`Ejecutando ${nombre}`, { argumentos: args });
      const inicio = performance.now();

      try {
        const resultado = fn(...args);
        const duracion = performance.now() - inicio;
        this.log(`${nombre} completado`, {
          resultado,
          duracion: `${duracion.toFixed(2)}ms`,
        });
        return resultado;
      } catch (error) {
        this.log(`Error en ${nombre}`, { error: error.message });
        throw error;
      }
    };
  }

  exportarLogs() {
    return JSON.stringify(this.logs, null, 2);
  }
}

// Uso
const debug = new Debugger();
debug.activar();

// Trazar funciones
const sumaDebug = debug.trazar((a, b) => a + b, 'suma');
const resultado = sumaDebug(5, 3);
```

---

## 🔒 Seguridad

### 1. Sanitización de Datos

```javascript
// Sanitizador de datos
class SanitizadorDatos {
  static sanitizarHTML(html) {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
  }

  static sanitizarURL(url) {
    try {
      const urlObj = new URL(url);
      // Solo permitir protocolos seguros
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        throw new Error('Protocolo no permitido');
      }
      return urlObj.toString();
    } catch (error) {
      throw new Error('URL inválida');
    }
  }

  static sanitizarSQL(input) {
    if (typeof input !== 'string') return input;

    // Escapar caracteres peligrosos
    return input
      .replace(/'/g, "''")
      .replace(/;/g, '\\;')
      .replace(/--/g, '\\-\\-')
      .replace(/\/\*/g, '\\/\\*')
      .replace(/\*\//g, '\\*\\/');
  }

  static validarEntrada(entrada, tipo) {
    const validadores = {
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      telefono: /^\+?[\d\s-()]+$/,
      alfanumerico: /^[a-zA-Z0-9]+$/,
      entero: /^\d+$/,
      decimal: /^\d+(\.\d+)?$/,
    };

    const regex = validadores[tipo];
    if (!regex) throw new Error(`Tipo ${tipo} no válido`);

    return regex.test(entrada);
  }
}

// Uso
const datosUsuario = {
  nombre: SanitizadorDatos.sanitizarHTML(entrada.nombre),
  email: entrada.email,
  website: SanitizadorDatos.sanitizarURL(entrada.website),
};

// Validar antes de usar
if (!SanitizadorDatos.validarEntrada(datosUsuario.email, 'email')) {
  throw new Error('Email inválido');
}
```

### 2. Rate Limiting

```javascript
// Rate limiter
class RateLimiter {
  constructor(maxRequests, ventanaTiempo) {
    this.maxRequests = maxRequests;
    this.ventanaTiempo = ventanaTiempo;
    this.requests = new Map();
  }

  permitir(clave) {
    const ahora = Date.now();
    const ventanaInicio = ahora - this.ventanaTiempo;

    if (!this.requests.has(clave)) {
      this.requests.set(clave, []);
    }

    const requestsUsuario = this.requests.get(clave);

    // Limpiar requests antiguos
    const requestsValidos = requestsUsuario.filter(
      timestamp => timestamp > ventanaInicio
    );

    if (requestsValidos.length >= this.maxRequests) {
      return {
        permitido: false,
        tiempoEspera: requestsValidos[0] - ventanaInicio,
      };
    }

    requestsValidos.push(ahora);
    this.requests.set(clave, requestsValidos);

    return {
      permitido: true,
      requestsRestantes: this.maxRequests - requestsValidos.length,
    };
  }
}

// Uso
const rateLimiter = new RateLimiter(10, 60000); // 10 requests por minuto

function procesarRequest(usuarioId, accion) {
  const resultado = rateLimiter.permitir(usuarioId);

  if (!resultado.permitido) {
    throw new Error(`Rate limit excedido. Espera ${resultado.tiempoEspera}ms`);
  }

  // Procesar request
  console.log(`Procesando ${accion} para usuario ${usuarioId}`);
  return resultado;
}
```

---

## 📏 Estándares de Código

### 1. Convenciones de Nomenclatura

```javascript
// ✅ Buenas prácticas de nomenclatura

// Constantes en UPPER_CASE
const API_BASE_URL = 'https://api.ejemplo.com';
const MAX_RETRY_ATTEMPTS = 3;
const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de red',
  VALIDATION_ERROR: 'Error de validación',
};

// Funciones en camelCase con verbos
function obtenerUsuario(id) {}
function crearProducto(datos) {}
function validarEmail(email) {}

// Clases en PascalCase con sustantivos
class GestorUsuarios {}
class ValidadorFormularios {}
class ServicioAutenticacion {}

// Variables en camelCase descriptivas
const datosUsuario = {};
const configuracionAPI = {};
const resultadoValidacion = {};

// Funciones de predicado con is/has/can
function isValidEmail(email) {}
function hasPermission(usuario, permiso) {}
function canDelete(usuario, recurso) {}

// Eventos en past tense
const eventos = {
  USER_CREATED: 'user-created',
  DATA_LOADED: 'data-loaded',
  FORM_SUBMITTED: 'form-submitted',
};
```

### 2. Documentación JSDoc

```javascript
/**
 * Gestiona la autenticación de usuarios
 * @class
 */
class GestorAutenticacion {
  /**
   * Crea una instancia del gestor de autenticación
   * @param {Object} configuracion - Configuración del gestor
   * @param {string} configuracion.apiUrl - URL de la API
   * @param {number} configuracion.timeout - Timeout en milisegundos
   */
  constructor(configuracion) {
    this.apiUrl = configuracion.apiUrl;
    this.timeout = configuracion.timeout || 5000;
  }

  /**
   * Autentica un usuario con email y contraseña
   * @async
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Promise<Object>} Objeto con datos del usuario y token
   * @throws {Error} Si las credenciales son inválidas
   * @example
   * const gestor = new GestorAutenticacion({ apiUrl: 'https://api.com' });
   * const usuario = await gestor.autenticar('juan@ejemplo.com', 'password123');
   */
  async autenticar(email, password) {
    // Implementación...
  }

  /**
   * Verifica si un token es válido
   * @param {string} token - Token a verificar
   * @returns {boolean} True si el token es válido
   */
  verificarToken(token) {
    // Implementación...
  }
}
```

---

## 🏆 Tips WorldSkills

### 1. Patrones de Velocidad

```javascript
// Template rápido para CRUD
const crearCRUD = (entidad, apiUrl) => ({
  async obtener(id) {
    const response = await fetch(`${apiUrl}/${id}`);
    return response.json();
  },

  async listar(filtros = {}) {
    const params = new URLSearchParams(filtros);
    const response = await fetch(`${apiUrl}?${params}`);
    return response.json();
  },

  async crear(datos) {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });
    return response.json();
  },

  async actualizar(id, datos) {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });
    return response.json();
  },

  async eliminar(id) {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: 'DELETE',
    });
    return response.ok;
  },
});

// Uso rápido
const usuariosAPI = crearCRUD('usuarios', '/api/usuarios');
const productosAPI = crearCRUD('productos', '/api/productos');
```

### 2. Utilities de Competencia

```javascript
// Utilidades para competencias
const CompetenceUtils = {
  // Debounce rápido
  debounce: (fn, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  },

  // Formateo de datos
  formatear: {
    fecha: fecha => new Date(fecha).toLocaleDateString(),
    moneda: valor => `$${valor.toFixed(2)}`,
    porcentaje: valor => `${(valor * 100).toFixed(1)}%`,
  },

  // Validadores rápidos
  validar: {
    email: email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    telefono: tel => /^\+?[\d\s-()]+$/.test(tel),
    requerido: valor => valor !== null && valor !== undefined && valor !== '',
  },

  // Helpers de DOM
  dom: {
    crear: (tag, props = {}, hijos = []) => {
      const elemento = document.createElement(tag);
      Object.assign(elemento, props);
      hijos.forEach(hijo => elemento.appendChild(hijo));
      return elemento;
    },

    buscar: selector => document.querySelector(selector),
    buscarTodos: selector => document.querySelectorAll(selector),
  },
};
```

### 3. Checklist de Optimización

```javascript
// Checklist de optimización para competencias
const OptimizationChecklist = {
  // 1. Minimizar redraws
  batchDOMUpdates: (elemento, actualizaciones) => {
    elemento.style.display = 'none';
    actualizaciones.forEach(update => update());
    elemento.style.display = '';
  },

  // 2. Usar requestAnimationFrame para animaciones
  animar: callback => {
    let frame;
    const animate = () => {
      callback();
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  },

  // 3. Lazy loading
  lazyLoad: (selector, callback) => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          callback(entry.target);
          observer.unobserve(entry.target);
        }
      });
    });

    document.querySelectorAll(selector).forEach(el => {
      observer.observe(el);
    });
  },

  // 4. Gestión de memoria
  limpiarEventos: elemento => {
    elemento.removeEventListener?.();
    elemento.innerHTML = '';
  },
};
```

---

## 🛠️ Herramientas y Recursos

### 1. Configuración de Desarrollo

```javascript
// .eslintrc.js
module.exports = {
  extends: ['eslint:recommended'],
  rules: {
    'no-console': 'warn',
    'no-unused-vars': 'error',
    'prefer-const': 'error',
    'no-var': 'error'
  }
};

// package.json scripts
{
  "scripts": {
    "dev": "live-server --open=index.html",
    "test": "jest",
    "lint": "eslint .",
    "format": "prettier --write ."
  }
}
```

### 2. Snippets Útiles

```javascript
// Snippet para manejo de errores
function tryCatch(fn, errorHandler = console.error) {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      errorHandler(error);
      throw error;
    }
  };
}

// Snippet para crear elementos
function h(tag, props = {}, ...children) {
  const element = document.createElement(tag);
  Object.assign(element, props);
  children.forEach(child => {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else {
      element.appendChild(child);
    }
  });
  return element;
}
```

## 📚 Recursos Recomendados

- **MDN Web Docs**: Referencia completa de JavaScript
- **JavaScript.info**: Tutorial moderno y completo
- **ESLint**: Linter para código JavaScript
- **Prettier**: Formateador de código
- **Jest**: Framework de testing

---

_Esta guía recopila las mejores prácticas para desarrollo JavaScript avanzado, optimizada para competencias WorldSkills y desarrollo profesional._
