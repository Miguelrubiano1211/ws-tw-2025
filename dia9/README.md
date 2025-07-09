# 🚀 Día 9: Promises y Async/Await

## 📋 Objetivos del Día

### 🎯 Objetivo Principal

Dominar la programación asíncrona en JavaScript utilizando Promises y async/await para crear aplicaciones modernas y eficientes.

### 📚 Objetivos Específicos

- **Dominar Promises**: Crear, manejar y encadenar promesas
- **Implementar Async/Await**: Sintaxis moderna para código asíncrono
- **Gestionar Errores Asíncronos**: Try/catch y manejo de errores
- **Crear Cliente de API**: Aplicación práctica con fetch y APIs
- **Optimizar Rendimiento**: Paralelización y gestión eficiente

---

## 🏗️ Estructura del Día

### 📁 Carpetas y Archivos

```
dia9/
├── README.md                    # Este archivo
├── DIA9_DETALLADO.md           # Cronograma detallado
├── CHECKLIST_DIA9.md           # Lista de verificación
├── ejercicios/
│   ├── README.md               # Guía de ejercicios
│   ├── 01-promises-basicas.js  # Fundamentos de Promises
│   ├── 02-promise-chaining.js  # Encadenamiento de promesas
│   ├── 03-async-await.js       # Async/await básico
│   ├── 04-error-handling.js    # Manejo de errores
│   ├── 05-parallel-execution.js # Ejecución paralela
│   └── 06-advanced-patterns.js # Patrones avanzados
├── proyectos/
│   └── cliente-api/            # Proyecto principal
│       ├── README.md           # Documentación del proyecto
│       ├── index.html          # Interfaz de usuario
│       ├── styles.css          # Estilos de la aplicación
│       └── script.js           # Lógica principal
└── recursos/
    ├── README.md               # Índice de recursos
    ├── promises-guide.md       # Guía completa de Promises
    ├── async-await-guide.md    # Guía de async/await
    ├── error-handling-guide.md # Guía de manejo de errores
    └── api-patterns.md         # Patrones con APIs
```

---

## ⏰ Cronograma del Día

### 🌅 Sesión 1: Promises (09:00-10:30)

- **09:00-09:30**: Introducción a Promises
- **09:30-10:00**: Creación y manejo básico
- **10:00-10:30**: Métodos then, catch, finally

### 🌅 Sesión 2: Encadenamiento (10:45-12:15)

- **10:45-11:15**: Promise chaining
- **11:15-11:45**: Promise.all y Promise.race
- **11:45-12:15**: Ejercicios prácticos

### 🌅 Sesión 3: Async/Await (13:30-15:00)

- **13:30-14:00**: Sintaxis async/await
- **14:00-14:30**: Conversión de Promises
- **14:30-15:00**: Manejo de errores con try/catch

### 🌅 Sesión 4: Proyecto Cliente API (15:15-16:45)

- **15:15-15:45**: Diseño de la aplicación
- **15:45-16:15**: Implementación con fetch
- **16:15-16:45**: Testing y optimización

---

## 📝 Conceptos Clave

### 1. **Promises**

```javascript
// Creación de Promise
const miPromise = new Promise((resolve, reject) => {
  // Lógica asíncrona
  if (exito) {
    resolve(resultado);
  } else {
    reject(error);
  }
});
```

### 2. **Async/Await**

```javascript
// Sintaxis moderna
async function obtenerDatos() {
  try {
    const resultado = await miPromise;
    return resultado;
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### 3. **Manejo de Errores**

```javascript
// Try/catch con async/await
async function operacionSegura() {
  try {
    const datos = await fetch('/api/datos');
    const json = await datos.json();
    return json;
  } catch (error) {
    console.error('Error en operación:', error);
    throw error;
  }
}
```

---

## 🎯 Metas de Aprendizaje

### Al finalizar este día, serás capaz de:

#### 🔵 Nivel Básico

- [ ] Crear Promises básicas
- [ ] Usar then/catch/finally
- [ ] Implementar async/await
- [ ] Manejar errores asíncronos

#### 🟡 Nivel Intermedio

- [ ] Encadenar promesas complejas
- [ ] Usar Promise.all y Promise.race
- [ ] Crear funciones asíncronas reutilizables
- [ ] Implementar retry patterns

#### 🔴 Nivel Avanzado

- [ ] Optimizar rendimiento asíncrono
- [ ] Crear patrones de concurrencia
- [ ] Implementar timeout y cancelación
- [ ] Desarrollar sistemas robustos

---

## 🛠️ Herramientas y Recursos

### 📚 Recursos de Estudio

- [Promises Guide](./recursos/promises-guide.md)
- [Async/Await Guide](./recursos/async-await-guide.md)
- [Error Handling Guide](./recursos/error-handling-guide.md)
- [API Patterns](./recursos/api-patterns.md)

### 🔧 Herramientas de Desarrollo

- **Navegador**: Chrome DevTools para debugging
- **Editor**: VS Code con extensiones JavaScript
- **APIs**: JSONPlaceholder, REST Countries API
- **Testing**: Console.log y DevTools Network

---

## 🚀 Proyecto Principal: Cliente de API

### 📱 Descripción

Desarrollar una aplicación web que consume múltiples APIs para mostrar información de usuarios, posts y comentarios con interfaz moderna y manejo robusto de errores.

### 🎯 Funcionalidades

- **Búsqueda de usuarios** con autocomplete
- **Visualización de posts** con paginación
- **Comentarios dinámicos** con carga asíncrona
- **Sistema de notificaciones** para errores
- **Modo offline** con cache
- **Indicadores de carga** para UX

### 🏆 Criterios de Evaluación

- **Funcionalidad**: Todas las APIs funcionan correctamente
- **Manejo de Errores**: Errores manejados graciosamente
- **UX**: Interfaz intuitiva y responsive
- **Performance**: Optimización de requests
- **Código**: Clean code y patrones asíncronos

---

## 📊 Evaluación del Día

### 🎯 Criterios de Evaluación

#### Técnicos (70%)

- **Promises**: Creación y manejo correcto
- **Async/Await**: Implementación eficiente
- **Error Handling**: Manejo robusto de errores
- **API Integration**: Integración correcta con APIs

#### Prácticos (30%)

- **Proyecto Funcional**: Aplicación completa
- **UX Design**: Interfaz usuario amigable
- **Code Quality**: Código limpio y documentado
- **Problem Solving**: Resolución de problemas

### 📈 Indicadores de Éxito

- [ ] Proyecto cliente API completamente funcional
- [ ] Manejo correcto de todos los estados asíncronos
- [ ] Implementación de patrones de error handling
- [ ] Código optimizado y bien estructurado

---

## 🎓 Preparación WorldSkills

### 🏆 Competencias Clave

- **Programación Asíncrona**: Dominio completo
- **API Integration**: Integración eficiente
- **Error Handling**: Manejo robusto
- **Performance**: Optimización avanzada

### 📝 Tips para Competencia

1. **Memorizar patrones** comunes de async/await
2. **Practicar manejo de errores** en diferentes scenarios
3. **Conocer APIs fetch** y sus opciones
4. **Dominar Promise.all** para paralelización
5. **Implementar timeout** y cancelación

### ⚡ Snippets de Velocidad

```javascript
// Fetch con timeout
const fetchWithTimeout = (url, timeout = 5000) => {
  return Promise.race([
    fetch(url),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), timeout)
    ),
  ]);
};
```

---

## 📚 Recursos Adicionales

### 📖 Lecturas Recomendadas

- [MDN - Promises](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [MDN - Async/Await](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Statements/async_function)
- [JavaScript.info - Promises](https://javascript.info/promise-basics)

### 🎥 Videos Útiles

- Promises en JavaScript (conceptos básicos)
- Async/Await vs Promises (comparación)
- Error handling en JavaScript asíncrono

### 🔧 Herramientas Online

- [Promisees Visualizer](https://bevacqua.github.io/promisees/)
- [JSONPlaceholder](https://jsonplaceholder.typicode.com/)
- [REST Countries API](https://restcountries.com/)

---

## 🎯 Siguientes Pasos

### 📅 Preparación para Día 10

- Revisar conceptos ES6+ básicos
- Practicar destructuring y spread
- Preparar entorno para módulos
- Estudiar template literals

### 🚀 Proyecto Continuación

- Añadir autenticación con JWT
- Implementar WebSockets
- Integrar con bases de datos
- Deployment en producción

---

_¡Prepárate para dominar la programación asíncrona y crear aplicaciones modernas con JavaScript!_ 🌟
