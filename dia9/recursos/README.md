# 📚 Recursos Día 9: Promises y Async/Await

## 🎯 Índice de Recursos

Esta carpeta contiene guías completas y referencias para dominar la programación asíncrona en JavaScript. Cada recurso está diseñado para complementar los ejercicios prácticos y proporcionar conocimiento profundo.

### 📖 Guías Principales

| Recurso                                              | Descripción                                           | Tiempo de Estudio | Nivel                   |
| ---------------------------------------------------- | ----------------------------------------------------- | ----------------- | ----------------------- |
| [📜 Promises Guide](./promises-guide.md)             | Guía completa de Promises desde básico hasta avanzado | 60 minutos        | Principiante → Avanzado |
| [⚡ Async/Await Guide](./async-await-guide.md)       | Dominio total de async/await con ejemplos prácticos   | 45 minutos        | Intermedio → Avanzado   |
| [🛡️ Error Handling Guide](./error-handling-guide.md) | Manejo robusto de errores en código asíncrono         | 75 minutos        | Intermedio → Avanzado   |
| [🌐 API Patterns](./api-patterns.md)                 | Patrones profesionales para integración con APIs      | 90 minutos        | Avanzado                |

## 🚀 Cómo Usar estos Recursos

### Para Principiantes

1. **Comienza con [Promises Guide](./promises-guide.md)**

   - Lee los conceptos fundamentales
   - Practica con los ejemplos básicos
   - Completa los ejercicios 01 y 02

2. **Continúa con [Async/Await Guide](./async-await-guide.md)**

   - Aprende la sintaxis moderna
   - Convierte ejemplos de promises a async/await
   - Practica con el ejercicio 03

3. **Estudia [Error Handling Guide](./error-handling-guide.md)**
   - Implementa manejo básico de errores
   - Practica con try/catch
   - Completa el ejercicio 04

### Para Desarrolladores Intermedios

1. **Profundiza en patrones avanzados**

   - Estudia los patrones de cada guía
   - Implementa los ejemplos complejos
   - Practica con los ejercicios 05 y 06

2. **Explora [API Patterns](./api-patterns.md)**
   - Implementa clientes HTTP robustos
   - Practica con autenticación y cache
   - Desarrolla el proyecto cliente-api

### Para Desarrolladores Avanzados

1. **Domina todos los patrones**

   - Implementa sistemas resilientes
   - Crea abstracciones reutilizables
   - Optimiza para performance

2. **Prepárate para WorldSkills**
   - Memoriza patrones comunes
   - Practica implementación rápida
   - Domina debugging avanzado

## 📊 Mapa de Conocimiento

```
Programación Asíncrona
├── Fundamentos
│   ├── Callbacks vs Promises
│   ├── Event Loop
│   └── Estados de Promises
├── Promises
│   ├── Creación y uso básico
│   ├── Encadenamiento
│   ├── Métodos estáticos
│   └── Manejo de errores
├── Async/Await
│   ├── Sintaxis y conversión
│   ├── Try/catch
│   ├── Ejecución paralela
│   └── Patrones avanzados
├── Manejo de Errores
│   ├── Tipos de errores
│   ├── Errores personalizados
│   ├── Recuperación automática
│   └── Sistemas resilientes
└── Integración con APIs
    ├── Fetch API avanzado
    ├── Cliente HTTP robusto
    ├── Autenticación
    ├── Caching
    ├── Rate limiting
    └── Optimización
```

## 🛠️ Herramientas y Utilidades

### Scripts de Utilidad

```bash
# Ejecutar todos los ejemplos de las guías
find . -name "*.js" -exec node {} \;

# Validar sintaxis de todos los archivos
find . -name "*.js" -exec node --check {} \;

# Benchmark de performance
node --prof ejemplo.js
```

### Debugging Tools

```javascript
// Habilitar debug detallado
localStorage.setItem('debug', 'api:*');

// Monitorear performance
console.time('operacion');
// ... código asíncrono
console.timeEnd('operacion');

// Rastrear promises
window.addEventListener('unhandledrejection', event => {
  console.error('Unhandled promise rejection:', event.reason);
});
```

## 📈 Progresión de Aprendizaje

### Nivel 1: Fundamentos (2-3 horas)

- [ ] Conceptos básicos de Promises
- [ ] Sintaxis async/await
- [ ] Manejo básico de errores
- [ ] Ejercicios 01-03 completados

### Nivel 2: Intermedio (3-4 horas)

- [ ] Patrones de ejecución paralela
- [ ] Manejo avanzado de errores
- [ ] Retry y fallback patterns
- [ ] Ejercicios 04-05 completados

### Nivel 3: Avanzado (4-5 horas)

- [ ] Circuit breakers y bulkheads
- [ ] Sistemas resilientes
- [ ] Patrones arquitectónicos
- [ ] Ejercicio 06 y proyecto completados

### Nivel 4: Experto (2-3 horas)

- [ ] Optimización de performance
- [ ] Debugging avanzado
- [ ] Patrones de producción
- [ ] Preparación WorldSkills

## 🔧 Configuración del Entorno

### Dependencias Recomendadas

```bash
# Herramientas de desarrollo
pnpm install -D nodemon jest supertest

# Testing de APIs
pnpm install -D msw axios-mock-adapter

# Debugging
pnpm install -D debug why-is-node-running

# Performance
pnpm install -D clinic autocannon
```

### Configuración VS Code

```json
// .vscode/settings.json
{
  "javascript.suggest.autoImports": true,
  "javascript.suggest.includeAutomaticOptionalChainCompletions": true,
  "editor.codeActionsOnSave": {
    "source.fixAll": true
  }
}
```

### Snippets Útiles

```json
// .vscode/snippets/javascript.json
{
  "Async Function": {
    "prefix": "asyncfn",
    "body": [
      "async function ${1:functionName}(${2:params}) {",
      "  try {",
      "    ${3:// code here}",
      "    return result;",
      "  } catch (error) {",
      "    console.error('Error:', error);",
      "    throw error;",
      "  }",
      "}"
    ]
  },
  "Promise with timeout": {
    "prefix": "promtimeout",
    "body": [
      "Promise.race([",
      "  ${1:operation}(),",
      "  new Promise((_, reject) => ",
      "    setTimeout(() => reject(new Error('Timeout')), ${2:5000})",
      "  )",
      "])"
    ]
  }
}
```

## 📚 Referencias Externas

### Documentación Oficial

- [MDN - Promises](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [MDN - async/await](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Statements/async_function)
- [MDN - Fetch API](https://developer.mozilla.org/es/docs/Web/API/Fetch_API)

### Artículos Recomendados

- [You Don't Know JS - Async & Performance](https://github.com/getify/You-Dont-Know-JS/blob/2nd-ed/async-performance/README.md)
- [JavaScript Promises: An Introduction](https://web.dev/promises/)
- [Async/await best practices](https://blog.logrocket.com/async-await-best-practices/)

### Videos Educativos

- [JavaScript Promises In 10 Minutes](https://www.youtube.com/watch?v=DHvZLI7Db8E)
- [Async JS Crash Course](https://www.youtube.com/watch?v=PoRJizFvM7s)
- [Error Handling in JavaScript](https://www.youtube.com/watch?v=Jdf_ty-ZhEM)

### Librerías Útiles

```bash
# Para testing
pnpm install jest supertest nock

# Para HTTP clients
pnpm install axios got node-fetch

# Para retry logic
pnpm install p-retry p-timeout p-queue

# Para observabilidad
pnpm install debug pino winston
```

## 🎯 Casos de Uso Comunes

### 1. Consumo de APIs REST

```javascript
// Ejemplo básico
const usuario = await fetch('/api/usuarios/123').then(r => r.json());

// Con manejo de errores
try {
  const response = await fetch('/api/usuarios/123');
  if (!response.ok) throw new Error('Usuario no encontrado');
  const usuario = await response.json();
} catch (error) {
  console.error('Error:', error);
}
```

### 2. Operaciones Paralelas

```javascript
// Cargar múltiples recursos en paralelo
const [usuarios, productos, pedidos] = await Promise.all([
  fetch('/api/usuarios').then(r => r.json()),
  fetch('/api/productos').then(r => r.json()),
  fetch('/api/pedidos').then(r => r.json()),
]);
```

### 3. Procesamiento de Lotes

```javascript
// Procesar elementos en lotes
const procesarEnLotes = async (items, procesador, tamaño = 5) => {
  const resultados = [];
  for (let i = 0; i < items.length; i += tamaño) {
    const lote = items.slice(i, i + tamaño);
    const resultadosLote = await Promise.all(
      lote.map(item => procesador(item))
    );
    resultados.push(...resultadosLote);
  }
  return resultados;
};
```

### 4. Retry con Backoff

```javascript
// Reintentar operación con delay exponencial
const retry = async (operacion, maxIntentos = 3) => {
  for (let i = 0; i < maxIntentos; i++) {
    try {
      return await operacion();
    } catch (error) {
      if (i === maxIntentos - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
};
```

## 🏆 Preparación para WorldSkills

### Patrones que Debes Memorizar

1. **Fetch básico con error handling**
2. **Promise.all para operaciones paralelas**
3. **Retry con backoff exponencial**
4. **Timeout con Promise.race**
5. **Cache simple con Map**
6. **Rate limiting básico**

### Timing de Implementación

| Patrón       | Tiempo Objetivo | Dificultad |
| ------------ | --------------- | ---------- |
| Fetch básico | 2 minutos       | Fácil      |
| Promise.all  | 3 minutos       | Fácil      |
| Retry simple | 5 minutos       | Medio      |
| Timeout      | 3 minutos       | Fácil      |
| Cache básico | 8 minutos       | Medio      |
| Rate limiter | 10 minutos      | Difícil    |

### Checklist de Competencia

- [ ] Puedo implementar fetch con error handling en <2 minutos
- [ ] Domino Promise.all, allSettled, race sin consultar documentación
- [ ] Puedo convertir callbacks a promises y async/await
- [ ] Implemento retry patterns de memoria
- [ ] Manejo timeouts y cancelaciones
- [ ] Debugging de código asíncrono eficientemente
- [ ] Optimizo operaciones paralelas automáticamente

## 📝 Notas de Estudio

### Concepts Clave para Recordar

1. **Promises tienen 3 estados**: pending, fulfilled, rejected
2. **Async/await es syntactic sugar** sobre promises
3. **Try/catch captura errores** en async/await
4. **Promise.all falla si una falla**, usar allSettled si necesitas todas
5. **forEach no funciona con async/await**, usar for...of o map + Promise.all
6. **Siempre manejar errores** en código asíncrono

### Errores Comunes a Evitar

1. **Olvidar await** en funciones async
2. **No manejar errores** en promises
3. **Usar async/await secuencialmente** cuando podría ser paralelo
4. **No cancelar timers** en cleanup
5. **Memory leaks** con listeners no removidos
6. **Race conditions** en operaciones concurrentes

## 🎓 Evaluación y Certificación

### Criterios de Dominio

Para considerar que dominas este contenido, debes poder:

1. **Explicar** cómo funciona el event loop
2. **Implementar** cualquier patrón de las guías sin consultar
3. **Debuggear** código asíncrono eficientemente
4. **Optimizar** performance de operaciones async
5. **Manejar** errores robustamente
6. **Crear** abstracciones reutilizables

### Proyecto Final

Implementa un cliente de API completo que incluya:

- Autenticación JWT
- Retry con backoff
- Cache inteligente
- Rate limiting
- Error handling robusto
- Logging estructurado
- Testing comprehensivo

¡Éxito en tu aprendizaje de programación asíncrona! 🚀
