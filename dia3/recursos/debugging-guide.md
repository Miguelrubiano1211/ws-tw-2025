# 🐛 Guía de Debugging JavaScript

## 🎯 Técnicas y Herramientas para Debugging Efectivo

### 1. **Console Methods**

```javascript
// Console básico
console.log('Valor:', variable);
console.error('Error encontrado:', error);
console.warn('Advertencia:', mensaje);
console.info('Información:', datos);

// Console avanzado
console.table(arrayDeObjetos); // Muestra en tabla
console.group('Grupo de logs'); // Agrupa logs
console.groupEnd(); // Termina grupo
console.time('operacion'); // Inicia timer
console.timeEnd('operacion'); // Termina timer
console.count('contador'); // Cuenta llamadas
console.trace(); // Muestra stack trace
```

### 2. **Debugging con Debugger**

```javascript
function procesarDatos(datos) {
  debugger; // Pausa ejecución aquí

  const resultado = datos.map(item => {
    debugger; // Pausa en cada iteración
    return item * 2;
  });

  return resultado;
}

// Conditional breakpoint
function validarUsuario(usuario) {
  if (usuario.edad < 0) {
    debugger; // Solo se ejecuta si la condición es verdadera
  }
  return usuario.edad >= 18;
}
```

### 3. **Error Handling Strategies**

```javascript
// Try/catch básico
try {
  const datos = JSON.parse(jsonString);
  procesarDatos(datos);
} catch (error) {
  console.error('Error parseando JSON:', error.message);
  console.error('Stack trace:', error.stack);
}

// Async/await error handling
async function obtenerDatos() {
  try {
    const response = await fetch('/api/datos');

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const datos = await response.json();
    return datos;
  } catch (error) {
    console.error('Error en obtenerDatos:', error);
    throw error; // Re-lanzar para manejar en nivel superior
  }
}

// Error personalizado
class ValidationError extends Error {
  constructor(field, value) {
    super(`Validación fallida para ${field}: ${value}`);
    this.name = 'ValidationError';
    this.field = field;
    this.value = value;
  }
}
```

### 4. **Debugging DOM**

```javascript
// Verificar existencia de elementos
const elemento = document.getElementById('miElemento');
if (!elemento) {
  console.error('Elemento no encontrado: #miElemento');
  return;
}

// Debugging event listeners
elemento.addEventListener('click', function (event) {
  console.log('Event:', event);
  console.log('Target:', event.target);
  console.log('Current target:', event.currentTarget);

  // Verificar si el elemento existe
  if (event.target.classList.contains('activo')) {
    console.log("Elemento tiene clase 'activo'");
  }
});

// Debugging estilos
const estilos = window.getComputedStyle(elemento);
console.log('Color:', estilos.color);
console.log('Display:', estilos.display);
```

### 5. **Debugging Asíncrono**

```javascript
// Promise debugging
function operacionAsincrona() {
  return new Promise((resolve, reject) => {
    console.log('Iniciando operación asíncrona');

    setTimeout(() => {
      const exito = Math.random() > 0.5;

      if (exito) {
        console.log('Operación exitosa');
        resolve('Datos obtenidos');
      } else {
        console.log('Operación fallida');
        reject(new Error('Fallo en la operación'));
      }
    }, 1000);
  });
}

// Debugging async/await
async function procesarOperacion() {
  try {
    console.log('Iniciando proceso');
    const resultado = await operacionAsincrona();
    console.log('Resultado:', resultado);
    return resultado;
  } catch (error) {
    console.error('Error capturado:', error);
    throw error;
  }
}
```

### 6. **Debugging Tools en Browser**

#### **Chrome DevTools**

```javascript
// Inspect element
console.log('Elemento:', $0); // Último elemento seleccionado
console.log('Elementos:', $$('.clase')); // Todos los elementos con clase

// Network debugging
fetch('/api/datos')
  .then(response => {
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    return response.json();
  })
  .then(data => console.log('Data:', data));

// Performance debugging
console.time('operacion-lenta');
operacionLenta();
console.timeEnd('operacion-lenta');

// Memory debugging
const memoriaAntes = performance.memory.usedJSHeapSize;
crearObjetos();
const memoriaDespues = performance.memory.usedJSHeapSize;
console.log('Memoria usada:', memoriaDespues - memoriaAntes);
```

### 7. **Debugging Patterns**

#### **Logging Wrapper**

```javascript
const logger = {
  debug: (message, data) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEBUG] ${message}`, data);
    }
  },

  error: (message, error) => {
    console.error(`[ERROR] ${message}`, error);
    // Enviar a servicio de logging en producción
  },

  performance: (label, fn) => {
    console.time(label);
    const result = fn();
    console.timeEnd(label);
    return result;
  },
};

// Uso
logger.debug('Procesando usuario', { usuario: userData });
logger.error('Error en API', error);
const resultado = logger.performance('Cálculo complejo', () => {
  return realizarCalculoComplejo();
});
```

#### **Assertion Debugging**

```javascript
function assert(condition, message) {
  if (!condition) {
    const error = new Error(message || 'Assertion failed');
    console.error(error);
    throw error;
  }
}

// Uso
function dividir(a, b) {
  assert(typeof a === 'number', 'a debe ser un número');
  assert(typeof b === 'number', 'b debe ser un número');
  assert(b !== 0, 'No se puede dividir por cero');

  return a / b;
}
```

### 8. **Debugging Variables**

```javascript
// Verificar tipos
function debugTipo(variable, nombre) {
  console.log(`${nombre}:`, {
    valor: variable,
    tipo: typeof variable,
    esArray: Array.isArray(variable),
    esNull: variable === null,
    esUndefined: variable === undefined,
    constructor: variable?.constructor?.name,
  });
}

// Clonar objetos para debugging
function debugObjeto(objeto, nombre) {
  console.log(`${nombre}:`, JSON.parse(JSON.stringify(objeto)));
}

// Verificar propiedades
function debugPropiedades(objeto, nombre) {
  console.log(`${nombre} propiedades:`, Object.keys(objeto));
  console.log(`${nombre} valores:`, Object.values(objeto));
  console.log(`${nombre} entradas:`, Object.entries(objeto));
}
```

### 9. **Debugging de Funciones**

```javascript
// Wrapper para debugging funciones
function debugFunction(fn, nombre) {
  return function (...args) {
    console.log(`[${nombre}] Llamada con argumentos:`, args);

    try {
      const resultado = fn.apply(this, args);
      console.log(`[${nombre}] Resultado:`, resultado);
      return resultado;
    } catch (error) {
      console.error(`[${nombre}] Error:`, error);
      throw error;
    }
  };
}

// Uso
const sumarDebug = debugFunction((a, b) => a + b, 'sumar');
sumarDebug(5, 3); // [sumar] Llamada con argumentos: [5, 3]
// [sumar] Resultado: 8
```

### 10. **Debugging en Producción**

```javascript
// Error boundary para React (concepto)
class ErrorBoundary {
  constructor() {
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error capturado:', error, errorInfo);
    // Enviar error a servicio de logging
    this.logErrorToService(error, errorInfo);
  }

  logErrorToService(error, errorInfo) {
    // Implementar logging a servicio externo
    fetch('/api/logs', {
      method: 'POST',
      body: JSON.stringify({
        error: error.message,
        stack: error.stack,
        info: errorInfo,
      }),
    });
  }
}

// Global error handler
window.addEventListener('error', event => {
  console.error('Error global:', event.error);
  // Enviar a servicio de logging
});

window.addEventListener('unhandledrejection', event => {
  console.error('Promise rechazada:', event.reason);
  // Enviar a servicio de logging
});
```

## 🔧 Herramientas de Desarrollo

### **VS Code Extensions**

- **JavaScript Debugger**: Built-in debugging
- **Error Lens**: Muestra errores inline
- **Console Ninja**: Mejor experiencia de console.log
- **Quokka.js**: Evaluación en tiempo real

### **Browser DevTools**

- **Elements**: Inspeccionar HTML/CSS
- **Console**: Ejecutar JavaScript
- **Sources**: Debugging con breakpoints
- **Network**: Monitorear requests
- **Performance**: Analizar rendimiento
- **Memory**: Detectar memory leaks

### **Online Tools**

- **CodePen**: Debugging rápido
- **JSFiddle**: Pruebas aisladas
- **CodeSandbox**: Entorno completo
- **Repl.it**: Ejecución inmediata

## 🎯 Estrategias de Debugging

### **1. Reproducir el Error**

```javascript
// Crear casos de prueba específicos
function testCaso(entrada, esperado) {
  const resultado = funcionProblematica(entrada);
  if (resultado !== esperado) {
    console.error(`Error: esperado ${esperado}, obtenido ${resultado}`);
    debugger;
  }
}
```

### **2. Dividir y Conquistar**

```javascript
// Separar la lógica en pasos
function procesoComplejo(datos) {
  console.log('Paso 1: Validar datos');
  const datosValidos = validarDatos(datos);
  console.log('Datos válidos:', datosValidos);

  console.log('Paso 2: Transformar datos');
  const datosTransformados = transformarDatos(datosValidos);
  console.log('Datos transformados:', datosTransformados);

  console.log('Paso 3: Procesar resultado');
  const resultado = procesarResultado(datosTransformados);
  console.log('Resultado final:', resultado);

  return resultado;
}
```

### **3. Logging Estructurado**

```javascript
const debugLog = {
  entrada: (funcionNombre, argumentos) => {
    console.log(`→ ${funcionNombre}`, argumentos);
  },

  salida: (funcionNombre, resultado) => {
    console.log(`← ${funcionNombre}`, resultado);
  },

  error: (funcionNombre, error) => {
    console.error(`✗ ${funcionNombre}`, error);
  },
};
```

## 🏆 Tips para WorldSkills

1. **Usa console.log estratégicamente** - No solo para valores, sino para flujo de ejecución
2. **Implementa validaciones tempranas** - Falla rápido con mensajes claros
3. **Usa herramientas del navegador** - DevTools son tu mejor amigo
4. **Crea funciones de debugging reutilizables** - Ahorra tiempo en competencia
5. **Practica debugging bajo presión** - Simula condiciones de competencia

---

💡 **Recuerda**: El debugging efectivo es una habilidad clave en WorldSkills. Practica estas técnicas regularmente.
