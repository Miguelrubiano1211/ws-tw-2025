# 📚 Ejercicios Día 9: Promises y Async/Await

## 🎯 Objetivos de Aprendizaje

Al completar estos ejercicios, serás capaz de:

- ✅ Crear y manejar Promises de manera efectiva
- ✅ Dominar async/await para código asíncrono limpio
- ✅ Implementar manejo robusto de errores
- ✅ Optimizar operaciones paralelas y concurrentes
- ✅ Aplicar patrones avanzados de programación asíncrona
- ✅ Desarrollar aplicaciones resilientes y escalables

## 📁 Estructura de Ejercicios

### 01. Promises Básicas

**Archivo:** `01-promises-basicas.js`
**Tiempo:** 45 minutos
**Conceptos:**

- Creación de Promises
- Estados: pending, fulfilled, rejected
- then(), catch(), finally()
- Manejo de errores básico

### 02. Encadenamiento de Promises

**Archivo:** `02-promise-chaining.js`
**Tiempo:** 60 minutos
**Conceptos:**

- Encadenamiento con then()
- Transformación de datos
- Promise.all(), Promise.race()
- Manejo de múltiples promesas

### 03. Async/Await

**Archivo:** `03-async-await.js`
**Tiempo:** 75 minutos
**Conceptos:**

- Sintaxis async/await
- Conversión de promises
- Manejo de errores con try/catch
- Ejecución paralela con await

### 04. Manejo de Errores

**Archivo:** `04-error-handling.js`
**Tiempo:** 90 minutos
**Conceptos:**

- Errores personalizados
- Propagación de errores
- Patrones de recuperación
- Sistemas resilientes

### 05. Ejecución Paralela

**Archivo:** `05-parallel-execution.js`
**Tiempo:** 75 minutos
**Conceptos:**

- Promise.all vs Promise.allSettled
- Control de concurrencia
- Batch processing
- Optimización de rendimiento

### 06. Patrones Avanzados

**Archivo:** `06-advanced-patterns.js`
**Tiempo:** 120 minutos
**Conceptos:**

- Circuit breakers
- Bulkheads
- Sagas
- Decoradores async

## 🚀 Cómo Ejecutar los Ejercicios

### Preparación del Entorno

```bash
# Navegar al directorio del día 9
cd dia9/ejercicios

# Verificar que Node.js está instalado
node --version

# Instalar dependencias si es necesario
pnpm install
```

### Ejecución Individual

```bash
# Ejecutar ejercicio específico
node 01-promises-basicas.js

# Con output detallado
node 01-promises-basicas.js --verbose

# Con debugging
node --inspect 01-promises-basicas.js
```

### Ejecución en Secuencia

```bash
# Ejecutar todos los ejercicios
for file in *.js; do
    echo "=== Ejecutando $file ==="
    node "$file"
    echo ""
done
```

### Ejecución con Nodemon (Desarrollo)

```bash
# Instalar nodemon si no está instalado
npm install -g nodemon

# Ejecutar con auto-reload
nodemon 01-promises-basicas.js
```

## 🛠️ Herramientas de Debugging

### Console Methods

```javascript
// Timing
console.time('operacion');
console.timeEnd('operacion');

// Grouping
console.group('Grupo de operaciones');
console.log('Operación 1');
console.groupEnd();

// Debugging
console.debug('Información de debug');
console.trace('Stack trace');
```

### Node.js Debugging

```bash
# Iniciar con debugger
node --inspect-brk 01-promises-basicas.js

# Abrir en Chrome
# chrome://inspect
```

### Performance Monitoring

```javascript
// Medir memoria
const used = process.memoryUsage();
console.log('Memoria:', used);

// Medir tiempo de CPU
const inicio = process.hrtime();
// ... operación ...
const [seconds, nanoseconds] = process.hrtime(inicio);
console.log(`Tiempo: ${seconds}s ${nanoseconds / 1000000}ms`);
```

## 📊 Criterios de Evaluación

### Ejercicio 1: Promises Básicas (25 puntos)

- ✅ Creación correcta de promises (5pts)
- ✅ Manejo de resolve/reject (5pts)
- ✅ Uso de then/catch/finally (5pts)
- ✅ Validaciones y transformaciones (5pts)
- ✅ Completar todos los retos (5pts)

### Ejercicio 2: Encadenamiento (25 puntos)

- ✅ Encadenamiento correcto (5pts)
- ✅ Transformación de datos (5pts)
- ✅ Promise.all y Promise.race (5pts)
- ✅ Manejo de errores en cadena (5pts)
- ✅ Optimización de pipelines (5pts)

### Ejercicio 3: Async/Await (25 puntos)

- ✅ Sintaxis async/await correcta (5pts)
- ✅ Conversión de promises (5pts)
- ✅ Manejo de errores con try/catch (5pts)
- ✅ Ejecución paralela (5pts)
- ✅ Patrones avanzados (5pts)

### Ejercicio 4: Manejo de Errores (25 puntos)

- ✅ Errores personalizados (5pts)
- ✅ Propagación correcta (5pts)
- ✅ Recuperación automática (5pts)
- ✅ Circuit breakers (5pts)
- ✅ Sistemas resilientes (5pts)

### Ejercicio 5: Ejecución Paralela (25 puntos)

- ✅ Promise.all vs allSettled (5pts)
- ✅ Control de concurrencia (5pts)
- ✅ Batch processing (5pts)
- ✅ Timeouts y cancelaciones (5pts)
- ✅ Optimización de performance (5pts)

### Ejercicio 6: Patrones Avanzados (25 puntos)

- ✅ Implementación de patrones (5pts)
- ✅ Decoradores async (5pts)
- ✅ Composición de operaciones (5pts)
- ✅ Abstracciones reutilizables (5pts)
- ✅ Arquitectura escalable (5pts)

## 💡 Tips para el Éxito

### Mejores Prácticas

1. **Siempre maneja errores** - Nunca dejes promises sin catch
2. **Usa async/await** - Más limpio que then/catch
3. **Evita callback hell** - Usa promises o async/await
4. **Paralela cuando sea posible** - Usa Promise.all para operaciones independientes
5. **Timeout para operaciones largas** - Evita cuelgues indefinidos

### Patrones Comunes

```javascript
// Patrón retry
const retry = async (fn, maxIntentos = 3) => {
  for (let i = 0; i < maxIntentos; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxIntentos - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
};

// Patrón timeout
const conTimeout = (promise, ms) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), ms)
    ),
  ]);
};

// Patrón cache
const cache = new Map();
const conCache = async (key, fn) => {
  if (cache.has(key)) return cache.get(key);
  const result = await fn();
  cache.set(key, result);
  return result;
};
```

### Debugging Async Code

```javascript
// Usar labels para identificar promises
const operacion = async () => {
  console.log('Iniciando operación...');
  try {
    const resultado = await fetch('/api/datos');
    console.log('Operación exitosa');
    return resultado;
  } catch (error) {
    console.error('Error en operación:', error);
    throw error;
  }
};

// Usar Promise.allSettled para debugging
const resultados = await Promise.allSettled([
  operacion1(),
  operacion2(),
  operacion3(),
]);

resultados.forEach((resultado, index) => {
  if (resultado.status === 'rejected') {
    console.error(`Operación ${index} falló:`, resultado.reason);
  }
});
```

## 🎯 Retos Adicionales

### Reto 1: API Client Resiliente

Implementa un cliente de API que maneje:

- Reintentos automáticos
- Circuit breakers
- Cache con TTL
- Rate limiting

### Reto 2: Sistema de Notificaciones

Crea un sistema que envíe notificaciones a múltiples canales:

- Email, SMS, Push notifications
- Manejo de fallos individuales
- Prioridades y delays
- Estadísticas de entrega

### Reto 3: Pipeline de Datos

Implementa un pipeline que procese datos en etapas:

- Validación
- Transformación
- Enriquecimiento
- Persistencia

### Reto 4: Load Balancer Simulado

Crea un load balancer que:

- Distribuja requests entre servidores
- Maneje fallos de servidores
- Implemente health checks
- Balancee la carga

## 📚 Recursos Adicionales

### Documentación

- [MDN - Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [MDN - async/await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
- [Node.js Async Programming](https://nodejs.org/en/docs/guides/blocking-vs-non-blocking/)

### Videos Recomendados

- "JavaScript Promises in 100 Seconds"
- "Async/Await vs Promises"
- "Error Handling in JavaScript"

### Librerías Útiles

```bash
# Para testing
pnpm install jest supertest

# Para debugging
pnpm install debug

# Para performance
pnpm install clinic
```

## 🏆 Preparación WorldSkills

### Competencias Clave

- **Velocidad**: Implementa patrones rápidamente
- **Calidad**: Código limpio y mantenible
- **Robustez**: Manejo completo de errores
- **Optimización**: Performance y escalabilidad

### Tiempo de Práctica Recomendado

- **Principiante**: 8-10 horas
- **Intermedio**: 6-8 horas
- **Avanzado**: 4-6 horas

### Checklist Final

- [ ] Todos los ejercicios completados
- [ ] Retos implementados
- [ ] Código revisado y optimizado
- [ ] Errores manejados correctamente
- [ ] Performance validada
- [ ] Documentación actualizada

¡Éxito en tu aprendizaje! 🚀
