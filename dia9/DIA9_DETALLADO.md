# 📅 Cronograma Detallado - Día 9: Promises y Async/Await

## 🎯 Objetivo del Día

Dominar la programación asíncrona en JavaScript utilizando Promises y async/await para crear aplicaciones modernas y eficientes que interactúen con APIs.

---

## ⏰ Sesión 1: Promises (09:00-10:30)

### 📘 Introducción a Promises (09:00-09:30)

#### Conceptos Clave

- **¿Qué son las Promises?**
- **Estados de una Promise** (pending, fulfilled, rejected)
- **Ventajas sobre callbacks**
- **Sintaxis básica**

#### Actividades

- **09:00-09:10**: Explicación teórica de Promises
- **09:10-09:20**: Comparación callbacks vs Promises
- **09:20-09:30**: Primeros ejemplos prácticos

#### Código de Ejemplo

```javascript
// Estado básico de una Promise
const miPromise = new Promise((resolve, reject) => {
  const exito = Math.random() > 0.5;
  setTimeout(() => {
    if (exito) {
      resolve('¡Operación exitosa!');
    } else {
      reject('Error en la operación');
    }
  }, 1000);
});
```

### 🔧 Creación y Manejo Básico (09:30-10:00)

#### Conceptos Clave

- **Constructor Promise**
- **Executor function**
- **Resolve y reject**
- **Consumir promises**

#### Actividades

- **09:30-09:40**: Crear promises desde cero
- **09:40-09:50**: Manejar resolve y reject
- **09:50-10:00**: Ejercicios prácticos

#### Ejercicio Práctico

```javascript
// Crear promise que simule carga de datos
function cargarDatos(tiempo) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const datos = { id: 1, nombre: 'Usuario' };
      resolve(datos);
    }, tiempo);
  });
}
```

### 🎯 Métodos then, catch, finally (10:00-10:30)

#### Conceptos Clave

- **then() para success**
- **catch() para errores**
- **finally() para limpieza**
- **Chaining básico**

#### Actividades

- **10:00-10:10**: Método then() y sus variantes
- **10:10-10:20**: Manejo de errores con catch()
- **10:20-10:30**: Limpieza con finally()

#### Código de Ejemplo

```javascript
cargarDatos(1000)
  .then(datos => {
    console.log('Datos cargados:', datos);
    return datos.id;
  })
  .then(id => {
    console.log('ID del usuario:', id);
  })
  .catch(error => {
    console.error('Error:', error);
  })
  .finally(() => {
    console.log('Operación completada');
  });
```

---

## ⏰ Sesión 2: Encadenamiento (10:45-12:15)

### 🔗 Promise Chaining (10:45-11:15)

#### Conceptos Clave

- **Encadenamiento de promesas**
- **Transformación de datos**
- **Return values en then()**
- **Flattening de promises**

#### Actividades

- **10:45-10:55**: Encadenamiento básico
- **10:55-11:05**: Transformación de datos
- **11:05-11:15**: Ejercicios de encadenamiento

#### Ejemplo Práctico

```javascript
// Encadenamiento complejo
obtenerUsuario(1)
  .then(usuario => {
    console.log('Usuario:', usuario);
    return obtenerPosts(usuario.id);
  })
  .then(posts => {
    console.log('Posts:', posts);
    return obtenerComentarios(posts[0].id);
  })
  .then(comentarios => {
    console.log('Comentarios:', comentarios);
  })
  .catch(error => {
    console.error('Error en cadena:', error);
  });
```

### 🚀 Promise.all y Promise.race (11:15-11:45)

#### Conceptos Clave

- **Promise.all para paralelización**
- **Promise.race para timeout**
- **Promise.allSettled para resultados mixtos**
- **Manejo de errores en grupos**

#### Actividades

- **11:15-11:25**: Promise.all y su uso
- **11:25-11:35**: Promise.race para timeouts
- **11:35-11:45**: Promise.allSettled para robustez

#### Código de Ejemplo

```javascript
// Ejecución paralela
const promesas = [obtenerUsuario(1), obtenerUsuario(2), obtenerUsuario(3)];

Promise.all(promesas)
  .then(usuarios => {
    console.log('Todos los usuarios:', usuarios);
  })
  .catch(error => {
    console.error('Error en algún usuario:', error);
  });

// Timeout con Promise.race
const timeoutPromise = new Promise((_, reject) => {
  setTimeout(() => reject(new Error('Timeout')), 5000);
});

Promise.race([obtenerDatos(), timeoutPromise])
  .then(resultado => console.log('Resultado:', resultado))
  .catch(error => console.error('Error o timeout:', error));
```

### 💪 Ejercicios Prácticos (11:45-12:15)

#### Ejercicio 1: Sistema de Notificaciones

```javascript
// Implementar sistema que envíe múltiples notificaciones
async function enviarNotificaciones(usuarios) {
  const promesas = usuarios.map(usuario =>
    enviarNotificacion(usuario.email, '¡Bienvenido!')
  );

  const resultados = await Promise.allSettled(promesas);

  const exitosos = resultados.filter(r => r.status === 'fulfilled');
  const fallidos = resultados.filter(r => r.status === 'rejected');

  console.log(`Enviados: ${exitosos.length}, Fallidos: ${fallidos.length}`);
}
```

#### Ejercicio 2: Cache con Promises

```javascript
// Implementar cache que expire promesas
class PromiseCache {
  constructor(ttl = 60000) {
    this.cache = new Map();
    this.ttl = ttl;
  }

  async get(key, factory) {
    const cached = this.cache.get(key);

    if (cached && Date.now() - cached.timestamp < this.ttl) {
      return cached.promise;
    }

    const promise = factory();
    this.cache.set(key, {
      promise,
      timestamp: Date.now(),
    });

    return promise;
  }
}
```

---

## ⏰ Sesión 3: Async/Await (13:30-15:00)

### 🎯 Sintaxis Async/Await (13:30-14:00)

#### Conceptos Clave

- **async functions**
- **await keyword**
- **Return values implícitos**
- **Ventajas sobre promises**

#### Actividades

- **13:30-13:40**: Sintaxis básica de async/await
- **13:40-13:50**: Conversión de promises a async/await
- **13:50-14:00**: Ejercicios de conversión

#### Código de Ejemplo

```javascript
// Conversión de promises a async/await
// Antes (con promises)
function obtenerDatosUsuario(id) {
  return obtenerUsuario(id)
    .then(usuario => obtenerPosts(usuario.id))
    .then(posts => obtenerComentarios(posts[0].id))
    .then(comentarios => ({
      usuario,
      posts,
      comentarios,
    }));
}

// Después (con async/await)
async function obtenerDatosUsuario(id) {
  const usuario = await obtenerUsuario(id);
  const posts = await obtenerPosts(usuario.id);
  const comentarios = await obtenerComentarios(posts[0].id);

  return {
    usuario,
    posts,
    comentarios,
  };
}
```

### 🔄 Conversión de Promises (14:00-14:30)

#### Conceptos Clave

- **Refactoring de código**
- **Sequential vs parallel execution**
- **Optimización de performance**
- **Best practices**

#### Actividades

- **14:00-14:10**: Refactoring systematic
- **14:10-14:20**: Optimización de paralelismo
- **14:20-14:30**: Best practices y patterns

#### Ejemplo de Optimización

```javascript
// ❌ Ejecución secuencial (lenta)
async function obtenerDatosLento() {
  const usuario = await obtenerUsuario(1);
  const posts = await obtenerPosts(1);
  const comentarios = await obtenerComentarios(1);

  return { usuario, posts, comentarios };
}

// ✅ Ejecución paralela (rápida)
async function obtenerDatosRapido() {
  const [usuario, posts, comentarios] = await Promise.all([
    obtenerUsuario(1),
    obtenerPosts(1),
    obtenerComentarios(1),
  ]);

  return { usuario, posts, comentarios };
}
```

### 🚨 Manejo de Errores con Try/Catch (14:30-15:00)

#### Conceptos Clave

- **Try/catch básico**
- **Finally blocks**
- **Error propagation**
- **Custom error handling**

#### Actividades

- **14:30-14:40**: Try/catch básico
- **14:40-14:50**: Finally y limpieza
- **14:50-15:00**: Error handling avanzado

#### Código de Ejemplo

```javascript
// Manejo robusto de errores
async function operacionCompleja() {
  let conexion;

  try {
    conexion = await conectarBaseDatos();
    const datos = await obtenerDatos(conexion);
    const procesados = await procesarDatos(datos);

    return procesados;
  } catch (error) {
    console.error('Error en operación:', error);

    // Manejo específico por tipo de error
    if (error.code === 'ECONNREFUSED') {
      throw new Error('Base de datos no disponible');
    } else if (error.code === 'INVALID_DATA') {
      throw new Error('Datos corruptos');
    }

    throw error;
  } finally {
    if (conexion) {
      await cerrarConexion(conexion);
    }
  }
}
```

---

## ⏰ Sesión 4: Proyecto Cliente API (15:15-16:45)

### 🎨 Diseño de la Aplicación (15:15-15:45)

#### Conceptos Clave

- **Arquitectura de cliente API**
- **Separación de responsabilidades**
- **State management**
- **UI/UX considerations**

#### Actividades

- **15:15-15:25**: Diseño de arquitectura
- **15:25-15:35**: Estructura de archivos
- **15:35-15:45**: Mockup y wireframes

#### Estructura de la Aplicación

```
cliente-api/
├── index.html          # Interfaz principal
├── styles.css          # Estilos responsive
├── script.js           # Lógica principal
├── api/               # Módulos de API
│   ├── users.js       # API de usuarios
│   ├── posts.js       # API de posts
│   └── comments.js    # API de comentarios
└── utils/             # Utilidades
    ├── cache.js       # Sistema de cache
    ├── errors.js      # Manejo de errores
    └── ui.js          # Helpers de UI
```

### 🔧 Implementación con Fetch (15:45-16:15)

#### Conceptos Clave

- **Fetch API avanzado**
- **Headers y configuración**
- **Request/Response handling**
- **Error handling con fetch**

#### Actividades

- **15:45-15:55**: Configuración de fetch
- **15:55-16:05**: APIs múltiples
- **16:05-16:15**: Optimización y cache

#### Código de Ejemplo

```javascript
// Cliente API robusto
class APIClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.cache = new Map();
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error en ${endpoint}:`, error);
      throw error;
    }
  }

  async get(endpoint) {
    // Verificar cache
    if (this.cache.has(endpoint)) {
      const cached = this.cache.get(endpoint);
      if (Date.now() - cached.timestamp < 300000) {
        // 5 minutos
        return cached.data;
      }
    }

    const data = await this.request(endpoint);

    // Guardar en cache
    this.cache.set(endpoint, {
      data,
      timestamp: Date.now(),
    });

    return data;
  }
}
```

### 🧪 Testing y Optimización (16:15-16:45)

#### Conceptos Clave

- **Testing de código asíncrono**
- **Performance optimization**
- **Error handling testing**
- **User experience testing**

#### Actividades

- **16:15-16:25**: Testing manual
- **16:25-16:35**: Optimización de performance
- **16:35-16:45**: UX testing y mejoras

#### Testing de Código Asíncrono

```javascript
// Función de testing
async function testearAPI() {
  console.log('🧪 Iniciando tests...');

  try {
    // Test 1: Obtener usuarios
    console.log('Test 1: Obtener usuarios');
    const usuarios = await obtenerUsuarios();
    console.log('✅ Usuarios obtenidos:', usuarios.length);

    // Test 2: Obtener posts
    console.log('Test 2: Obtener posts');
    const posts = await obtenerPosts();
    console.log('✅ Posts obtenidos:', posts.length);

    // Test 3: Manejo de errores
    console.log('Test 3: Manejo de errores');
    try {
      await obtenerUsuario(999999);
    } catch (error) {
      console.log('✅ Error manejado correctamente:', error.message);
    }

    console.log('🎉 Todos los tests pasaron');
  } catch (error) {
    console.error('❌ Test falló:', error);
  }
}
```

---

## 📋 Checklist del Día

### ✅ Sesión 1: Promises (09:00-10:30)

- [ ] Entender qué son las Promises
- [ ] Crear Promises básicas
- [ ] Usar then/catch/finally
- [ ] Completar ejercicios de promises

### ✅ Sesión 2: Encadenamiento (10:45-12:15)

- [ ] Implementar promise chaining
- [ ] Usar Promise.all correctamente
- [ ] Implementar Promise.race
- [ ] Resolver ejercicios de paralelización

### ✅ Sesión 3: Async/Await (13:30-15:00)

- [ ] Dominar sintaxis async/await
- [ ] Convertir promises a async/await
- [ ] Implementar try/catch robusto
- [ ] Optimizar código asíncrono

### ✅ Sesión 4: Proyecto (15:15-16:45)

- [ ] Diseñar arquitectura de cliente API
- [ ] Implementar fetch con manejo de errores
- [ ] Crear interfaz de usuario funcional
- [ ] Optimizar performance y UX

---

## 🎯 Entregables del Día

### 📁 Ejercicios Completados

1. **01-promises-basicas.js** - Fundamentos de promises
2. **02-promise-chaining.js** - Encadenamiento de promesas
3. **03-async-await.js** - Sintaxis moderna
4. **04-error-handling.js** - Manejo de errores
5. **05-parallel-execution.js** - Ejecución paralela
6. **06-advanced-patterns.js** - Patrones avanzados

### 🚀 Proyecto Principal

- **Cliente API completo** con todas las funcionalidades
- **Interfaz responsiva** y user-friendly
- **Manejo robusto de errores** y estados de carga
- **Optimización de performance** y cache

### 📚 Conocimientos Adquiridos

- **Dominio completo de Promises** y async/await
- **Manejo avanzado de errores** asíncronos
- **Integración con APIs** reales
- **Optimización de rendimiento** asíncrono

---

## 📈 Evaluación y Retroalimentación

### 🎯 Criterios de Evaluación

- **Funcionalidad**: Código ejecuta correctamente
- **Manejo de Errores**: Errores manejados apropiadamente
- **Performance**: Optimización de requests asíncronos
- **UX**: Interfaz intuitiva y responsive
- **Código**: Limpio, documentado y bien estructurado

### 📊 Métricas de Éxito

- [ ] Proyecto funciona completamente
- [ ] Manejo de errores en todos los scenarios
- [ ] Performance optimizada (< 3s carga inicial)
- [ ] Interfaz responsive y accesible
- [ ] Código siguiendo best practices

---

## 🚀 Preparación para Día 10

### 📅 Temas del Siguiente Día

- **ES6+ Features**: let/const, template literals
- **Destructuring**: Arrays y objetos
- **Spread/Rest**: Operadores modernos
- **Modules**: Import/export

### 🎒 Materiales a Preparar

- Repaso de sintaxis ES6
- Ejemplos de destructuring
- Configuración de módulos
- Proyecto final integrado

---

_¡Excelente trabajo dominando la programación asíncrona! Estás preparado para crear aplicaciones modernas y eficientes._ 🌟
