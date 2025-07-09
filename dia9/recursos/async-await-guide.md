# 🎯 Guía Completa de Async/Await

## 📑 Índice

1. [Introducción](#introducción)
2. [Sintaxis Básica](#sintaxis-básica)
3. [Conversión de Promises](#conversión-de-promises)
4. [Manejo de Errores](#manejo-de-errores)
5. [Ejecución Paralela](#ejecución-paralela)
6. [Patrones Avanzados](#patrones-avanzados)
7. [Mejores Prácticas](#mejores-prácticas)
8. [Errores Frecuentes](#errores-frecuentes)
9. [Debugging](#debugging)
10. [Casos de Uso Prácticos](#casos-de-uso-prácticos)

## 🚀 Introducción

**Async/await** es una sintaxis que hace que el código asíncrono se vea y se comporte más como código síncrono, eliminando la complejidad de las cadenas de `.then()`.

### Antes y Después

```javascript
// ❌ Con Promises (funciona, pero verbose)
function obtenerDatosUsuario(id) {
  return fetch(`/api/usuarios/${id}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Usuario no encontrado');
      }
      return response.json();
    })
    .then(usuario => {
      return fetch(`/api/usuarios/${id}/pedidos`);
    })
    .then(response => response.json())
    .then(pedidos => {
      return {
        usuario: usuario,
        pedidos: pedidos,
      };
    })
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
}

// ✅ Con Async/Await (limpio y legible)
async function obtenerDatosUsuario(id) {
  try {
    const response = await fetch(`/api/usuarios/${id}`);

    if (!response.ok) {
      throw new Error('Usuario no encontrado');
    }

    const usuario = await response.json();
    const pedidosResponse = await fetch(`/api/usuarios/${id}/pedidos`);
    const pedidos = await pedidosResponse.json();

    return {
      usuario,
      pedidos,
    };
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

## 📖 Sintaxis Básica

### Declaración de Funciones Async

```javascript
// 1. Function declaration
async function miFuncion() {
  return 'Hola mundo';
}

// 2. Function expression
const miFuncion = async function () {
  return 'Hola mundo';
};

// 3. Arrow function
const miFuncion = async () => {
  return 'Hola mundo';
};

// 4. Método de clase
class MiClase {
  async miMetodo() {
    return 'Hola mundo';
  }
}

// 5. Método de objeto
const miObjeto = {
  async miMetodo() {
    return 'Hola mundo';
  },
};
```

### Uso de Await

```javascript
// Await solo funciona dentro de funciones async
async function ejemplo() {
    // ✅ Correcto: await dentro de async
    const resultado = await miFuncionAsincrona();

    // ✅ Correcto: await con expresiones
    const suma = await Promise.resolve(5) + await Promise.resolve(3);

    // ✅ Correcto: await con funciones que retornan promises
    const datos = await fetch('/api/datos').then(r => r.json());

    return resultado;
}

// ❌ Incorrecto: await fuera de async
function ejemplo() {
    const resultado = await miFuncionAsincrona(); // SyntaxError
}
```

### Valores de Retorno

```javascript
async function ejemplosRetorno() {
  // 1. Retornar valor directo
  return 'Hola'; // Se convierte en Promise.resolve('Hola')

  // 2. Retornar promise
  return Promise.resolve('Hola'); // Se mantiene como promise

  // 3. Lanzar error
  throw new Error('Algo salió mal'); // Se convierte en Promise.reject()

  // 4. No retornar nada
  // Retorna Promise.resolve(undefined)
}

// Todas las funciones async retornan promises
ejemplosRetorno().then(resultado => console.log(resultado));
```

## 🔄 Conversión de Promises

### De Promises a Async/Await

```javascript
// Promesas anidadas
function obtenerPerfilCompleto(userId) {
  return fetch(`/api/usuarios/${userId}`)
    .then(response => response.json())
    .then(usuario => {
      return fetch(`/api/usuarios/${userId}/posts`)
        .then(response => response.json())
        .then(posts => {
          return fetch(`/api/usuarios/${userId}/amigos`)
            .then(response => response.json())
            .then(amigos => {
              return {
                usuario,
                posts,
                amigos,
              };
            });
        });
    });
}

// Convertido a async/await
async function obtenerPerfilCompleto(userId) {
  const usuarioResponse = await fetch(`/api/usuarios/${userId}`);
  const usuario = await usuarioResponse.json();

  const postsResponse = await fetch(`/api/usuarios/${userId}/posts`);
  const posts = await postsResponse.json();

  const amigosResponse = await fetch(`/api/usuarios/${userId}/amigos`);
  const amigos = await amigosResponse.json();

  return {
    usuario,
    posts,
    amigos,
  };
}
```

### Convertir Callbacks a Async/Await

```javascript
// Callback hell
function leerArchivo(nombre, callback) {
  fs.readFile(nombre, 'utf8', (err, data) => {
    if (err) {
      callback(err);
    } else {
      callback(null, data);
    }
  });
}

// Promisificar
const leerArchivoPromise = nombre => {
  return new Promise((resolve, reject) => {
    fs.readFile(nombre, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

// Usar con async/await
async function procesarArchivo(nombre) {
  try {
    const contenido = await leerArchivoPromise(nombre);
    const procesado = contenido.toUpperCase();
    return procesado;
  } catch (error) {
    console.error('Error leyendo archivo:', error);
    throw error;
  }
}

// Usando util.promisify (Node.js)
const util = require('util');
const leerArchivoAsync = util.promisify(fs.readFile);

async function procesarArchivoSimple(nombre) {
  const contenido = await leerArchivoAsync(nombre, 'utf8');
  return contenido.toUpperCase();
}
```

## 🛡️ Manejo de Errores

### Try/Catch Básico

```javascript
async function operacionRiesgosa() {
  try {
    const resultado = await operacionQuePuedeFallar();
    console.log('Éxito:', resultado);
    return resultado;
  } catch (error) {
    console.error('Error capturado:', error.message);
    throw error; // Re-lanzar si es necesario
  }
}

// Múltiples operaciones
async function operacionesMultiples() {
  try {
    const resultado1 = await operacion1();
    const resultado2 = await operacion2(resultado1);
    const resultado3 = await operacion3(resultado2);

    return resultado3;
  } catch (error) {
    console.error('Error en la cadena:', error);

    // Manejo específico por tipo de error
    if (error instanceof TypeError) {
      console.error('Error de tipo');
    } else if (error instanceof ReferenceError) {
      console.error('Error de referencia');
    }

    throw error;
  }
}
```

### Try/Catch con Finally

```javascript
async function operacionConLimpieza() {
  let recurso;

  try {
    recurso = await adquirirRecurso();
    const resultado = await procesar(recurso);
    return resultado;
  } catch (error) {
    console.error('Error procesando:', error);
    throw error;
  } finally {
    // Siempre se ejecuta
    if (recurso) {
      await liberarRecurso(recurso);
    }
  }
}
```

### Errores Específicos

```javascript
// Crear errores personalizados
class ErrorApi extends Error {
  constructor(message, status, endpoint) {
    super(message);
    this.name = 'ErrorApi';
    this.status = status;
    this.endpoint = endpoint;
  }
}

class ErrorValidacion extends Error {
  constructor(message, campo) {
    super(message);
    this.name = 'ErrorValidacion';
    this.campo = campo;
  }
}

// Uso
async function llamadaApi(endpoint) {
  try {
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new ErrorApi(
        `Error en API: ${response.statusText}`,
        response.status,
        endpoint
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ErrorApi) {
      console.error(`Error ${error.status} en ${error.endpoint}`);
    } else {
      console.error('Error de red:', error);
    }
    throw error;
  }
}

// Validación con errores específicos
async function validarUsuario(usuario) {
  if (!usuario.email) {
    throw new ErrorValidacion('Email es requerido', 'email');
  }

  if (!usuario.nombre) {
    throw new ErrorValidacion('Nombre es requerido', 'nombre');
  }

  // Validación asíncrona
  const emailExiste = await verificarEmail(usuario.email);
  if (emailExiste) {
    throw new ErrorValidacion('Email ya existe', 'email');
  }

  return true;
}
```

## ⚡ Ejecución Paralela

### Secuencial vs Paralelo

```javascript
// ❌ Secuencial (lento)
async function operacionesSecuenciales() {
  console.time('secuencial');

  const resultado1 = await operacion1(); // 1 segundo
  const resultado2 = await operacion2(); // 1 segundo
  const resultado3 = await operacion3(); // 1 segundo

  console.timeEnd('secuencial'); // ~3 segundos

  return [resultado1, resultado2, resultado3];
}

// ✅ Paralelo (rápido)
async function operacionesParalelas() {
  console.time('paralelo');

  const [resultado1, resultado2, resultado3] = await Promise.all([
    operacion1(), // Se ejecutan
    operacion2(), // al mismo
    operacion3(), // tiempo
  ]);

  console.timeEnd('paralelo'); // ~1 segundo

  return [resultado1, resultado2, resultado3];
}
```

### Patrones de Ejecución Paralela

```javascript
// 1. Promise.all con async/await
async function todasLasOperaciones() {
  try {
    const resultados = await Promise.all([
      fetch('/api/usuarios').then(r => r.json()),
      fetch('/api/productos').then(r => r.json()),
      fetch('/api/pedidos').then(r => r.json()),
    ]);

    const [usuarios, productos, pedidos] = resultados;
    return { usuarios, productos, pedidos };
  } catch (error) {
    console.error('Una operación falló:', error);
    throw error;
  }
}

// 2. Promise.allSettled con async/await
async function operacionesIndependientes() {
  const resultados = await Promise.allSettled([
    fetch('/api/servicio1').then(r => r.json()),
    fetch('/api/servicio2').then(r => r.json()),
    fetch('/api/servicio3').then(r => r.json()),
  ]);

  const exitosos = resultados
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value);

  const fallidos = resultados
    .filter(r => r.status === 'rejected')
    .map(r => r.reason);

  return { exitosos, fallidos };
}

// 3. Procesamiento en lotes
async function procesarEnLotes(items, procesador, tamañoLote = 5) {
  const resultados = [];

  for (let i = 0; i < items.length; i += tamañoLote) {
    const lote = items.slice(i, i + tamañoLote);

    const resultadosLote = await Promise.all(
      lote.map(item => procesador(item))
    );

    resultados.push(...resultadosLote);
  }

  return resultados;
}
```

### Ejecución Condicional

```javascript
async function operacionesCondicionales(usuario) {
  // Operación base
  const perfil = await obtenerPerfil(usuario.id);

  // Operaciones condicionales paralelas
  const operacionesOpcionales = [];

  if (usuario.esAdmin) {
    operacionesOpcionales.push(obtenerEstadisticas());
  }

  if (usuario.tienePremium) {
    operacionesOpcionales.push(obtenerContenidoPremium());
  }

  if (usuario.notificacionesActivas) {
    operacionesOpcionales.push(obtenerNotificaciones(usuario.id));
  }

  // Ejecutar todas las operaciones opcionales en paralelo
  const resultadosOpcionales = await Promise.all(operacionesOpcionales);

  return {
    perfil,
    ...resultadosOpcionales,
  };
}
```

## 🎨 Patrones Avanzados

### Patrón Retry con Async/Await

```javascript
async function retry(operacion, maxIntentos = 3, delay = 1000) {
  let ultimoError;

  for (let intento = 1; intento <= maxIntentos; intento++) {
    try {
      return await operacion();
    } catch (error) {
      ultimoError = error;

      if (intento < maxIntentos) {
        console.log(`Intento ${intento} falló, reintentando en ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Backoff exponencial
      }
    }
  }

  throw ultimoError;
}

// Uso
async function operacionConRetry() {
  return await retry(
    async () => {
      const response = await fetch('/api/datos');
      if (!response.ok) {
        throw new Error('API no disponible');
      }
      return response.json();
    },
    5,
    1000
  );
}
```

### Patrón Timeout

```javascript
async function conTimeout(operacion, tiempoLimite) {
  return await Promise.race([
    operacion(),
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout')), tiempoLimite);
    }),
  ]);
}

// Uso
async function operacionConTimeout() {
  try {
    const resultado = await conTimeout(() => fetch('/api/datos-lentos'), 5000);

    return await resultado.json();
  } catch (error) {
    if (error.message === 'Timeout') {
      console.error('Operación muy lenta');
      return null;
    }
    throw error;
  }
}
```

### Patrón Cache con TTL

```javascript
class CacheAsync {
  constructor() {
    this.cache = new Map();
  }

  async get(clave, operacion, ttl = 60000) {
    const entrada = this.cache.get(clave);

    if (entrada && Date.now() - entrada.timestamp < ttl) {
      return entrada.valor;
    }

    const valor = await operacion();
    this.cache.set(clave, {
      valor,
      timestamp: Date.now(),
    });

    return valor;
  }

  invalidar(clave) {
    this.cache.delete(clave);
  }

  limpiar() {
    this.cache.clear();
  }
}

// Uso
const cache = new CacheAsync();

async function obtenerUsuarioConCache(id) {
  return await cache.get(
    `usuario-${id}`,
    async () => {
      const response = await fetch(`/api/usuarios/${id}`);
      return response.json();
    },
    30000
  ); // 30 segundos TTL
}
```

### Patrón Queue con Async/Await

```javascript
class AsyncQueue {
  constructor(concurrencia = 1) {
    this.concurrencia = concurrencia;
    this.activos = 0;
    this.cola = [];
  }

  async add(operacion) {
    return new Promise((resolve, reject) => {
      this.cola.push({ operacion, resolve, reject });
      this.procesar();
    });
  }

  async procesar() {
    if (this.activos >= this.concurrencia || this.cola.length === 0) {
      return;
    }

    this.activos++;
    const { operacion, resolve, reject } = this.cola.shift();

    try {
      const resultado = await operacion();
      resolve(resultado);
    } catch (error) {
      reject(error);
    } finally {
      this.activos--;
      this.procesar();
    }
  }
}

// Uso
const queue = new AsyncQueue(3);

async function procesarTareas(tareas) {
  const resultados = await Promise.all(
    tareas.map(tarea => queue.add(() => procesarTarea(tarea)))
  );

  return resultados;
}
```

## ✅ Mejores Prácticas

### 1. Usar Async/Await en lugar de Promises

```javascript
// ❌ Malo: Mezclar promises y async/await
async function malo() {
  return fetch('/api/datos')
    .then(response => response.json())
    .then(datos => {
      return procesarDatos(datos);
    });
}

// ✅ Bueno: Usar async/await consistentemente
async function bueno() {
  const response = await fetch('/api/datos');
  const datos = await response.json();
  return procesarDatos(datos);
}
```

### 2. Manejar Errores Apropiadamente

```javascript
// ❌ Malo: No manejar errores
async function malo() {
  const datos = await fetch('/api/datos');
  return datos.json();
}

// ✅ Bueno: Manejar errores con try/catch
async function bueno() {
  try {
    const response = await fetch('/api/datos');

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error obteniendo datos:', error);
    throw error;
  }
}
```

### 3. Usar Paralelo Cuando es Apropiado

```javascript
// ❌ Malo: Secuencial innecesario
async function malo(ids) {
  const resultados = [];

  for (const id of ids) {
    const resultado = await obtenerDatos(id);
    resultados.push(resultado);
  }

  return resultados;
}

// ✅ Bueno: Paralelo cuando es posible
async function bueno(ids) {
  const promesas = ids.map(id => obtenerDatos(id));
  return await Promise.all(promesas);
}
```

### 4. Evitar Async/Await en Callbacks

```javascript
// ❌ Malo: Async en callbacks
const malo = [1, 2, 3].map(async num => {
  return await procesar(num);
}); // Retorna array de promises

// ✅ Bueno: Usar Promise.all con map
const bueno = await Promise.all(
  [1, 2, 3].map(async num => {
    return await procesar(num);
  })
);
```

### 5. Usar Finally para Limpieza

```javascript
async function operacionConRecursos() {
  let recurso;

  try {
    recurso = await adquirirRecurso();
    const resultado = await procesar(recurso);
    return resultado;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    if (recurso) {
      await liberarRecurso(recurso);
    }
  }
}
```

## ⚠️ Errores Frecuentes

### 1. Olvidar Await

```javascript
// ❌ Malo: Olvidar await
async function malo() {
  const resultado = operacionAsincrona(); // Retorna promise
  console.log(resultado); // [object Promise]
  return resultado;
}

// ✅ Bueno: Usar await
async function bueno() {
  const resultado = await operacionAsincrona();
  console.log(resultado); // Valor actual
  return resultado;
}
```

### 2. Await en Loops Secuenciales

```javascript
// ❌ Malo: Loop secuencial
async function malo(items) {
  for (const item of items) {
    await procesar(item); // Uno por uno
  }
}

// ✅ Bueno: Procesamiento paralelo
async function bueno(items) {
  await Promise.all(items.map(item => procesar(item)));
}

// ✅ Bueno: Control de concurrencia
async function buenoConControl(items, concurrencia = 3) {
  for (let i = 0; i < items.length; i += concurrencia) {
    const lote = items.slice(i, i + concurrencia);
    await Promise.all(lote.map(item => procesar(item)));
  }
}
```

### 3. No Manejar Errores en Promise.all

```javascript
// ❌ Malo: Promise.all sin manejo
async function malo() {
  const [a, b, c] = await Promise.all([
    operacion1(),
    operacion2(),
    operacion3(),
  ]); // Si una falla, todas fallan
}

// ✅ Bueno: Usar Promise.allSettled
async function bueno() {
  const resultados = await Promise.allSettled([
    operacion1(),
    operacion2(),
    operacion3(),
  ]);

  const exitosos = resultados
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value);

  return exitosos;
}
```

### 4. Async/Await con forEach

```javascript
// ❌ Malo: forEach con async/await
async function malo(items) {
  items.forEach(async item => {
    await procesar(item); // No espera
  });

  console.log('Terminado'); // Se ejecuta antes
}

// ✅ Bueno: for...of con async/await
async function bueno(items) {
  for (const item of items) {
    await procesar(item);
  }

  console.log('Terminado'); // Se ejecuta después
}
```

## 🔍 Debugging

### Herramientas de Debugging

```javascript
// 1. Debugging con console.log
async function debugConLog(id) {
  console.log('Iniciando operación para:', id);

  try {
    const datos = await obtenerDatos(id);
    console.log('Datos obtenidos:', datos);

    const procesados = await procesar(datos);
    console.log('Datos procesados:', procesados);

    return procesados;
  } catch (error) {
    console.error('Error en operación:', error);
    throw error;
  }
}

// 2. Debugging con timing
async function debugConTiming(id) {
  console.time(`operacion-${id}`);

  try {
    const resultado = await operacionCompleja(id);
    console.timeEnd(`operacion-${id}`);
    return resultado;
  } catch (error) {
    console.timeEnd(`operacion-${id}`);
    throw error;
  }
}

// 3. Debugging con stack traces
async function debugConStack() {
  try {
    await operacionRiesgosa();
  } catch (error) {
    console.error('Stack trace:', error.stack);
    throw error;
  }
}
```

### Debugging en Node.js

```javascript
// Usar debugger statement
async function debugConDebugger(id) {
  debugger; // Pausa aquí

  const datos = await obtenerDatos(id);

  debugger; // Pausa aquí también

  return datos;
}

// Ejecutar con: node --inspect-brk script.js
```

## 🎯 Casos de Uso Prácticos

### 1. API Client con Async/Await

```javascript
class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error en ${endpoint}:`, error);
      throw error;
    }
  }

  async get(endpoint) {
    return this.request(endpoint);
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }
}

// Uso
const api = new ApiClient('https://api.ejemplo.com');

async function gestionarUsuarios() {
  try {
    const usuarios = await api.get('/usuarios');
    console.log('Usuarios:', usuarios);

    const nuevoUsuario = await api.post('/usuarios', {
      nombre: 'Juan',
      email: 'juan@ejemplo.com',
    });
    console.log('Usuario creado:', nuevoUsuario);
  } catch (error) {
    console.error('Error gestionando usuarios:', error);
  }
}
```

### 2. Procesador de Archivos

```javascript
const fs = require('fs').promises;
const path = require('path');

class ProcesadorArchivos {
  async procesarDirectorio(directorio) {
    try {
      const archivos = await fs.readdir(directorio);

      const resultados = await Promise.all(
        archivos.map(archivo =>
          this.procesarArchivo(path.join(directorio, archivo))
        )
      );

      return resultados.filter(Boolean);
    } catch (error) {
      console.error('Error procesando directorio:', error);
      throw error;
    }
  }

  async procesarArchivo(rutaArchivo) {
    try {
      const stats = await fs.stat(rutaArchivo);

      if (!stats.isFile()) {
        return null;
      }

      const contenido = await fs.readFile(rutaArchivo, 'utf8');
      const procesado = await this.transformarContenido(contenido);

      const rutaSalida = rutaArchivo.replace('.txt', '.procesado.txt');
      await fs.writeFile(rutaSalida, procesado);

      return {
        archivo: rutaArchivo,
        tamaño: stats.size,
        procesado: rutaSalida,
      };
    } catch (error) {
      console.error(`Error procesando ${rutaArchivo}:`, error);
      return null;
    }
  }

  async transformarContenido(contenido) {
    // Simular procesamiento asíncrono
    await new Promise(resolve => setTimeout(resolve, 100));

    return contenido.toUpperCase().replace(/\s+/g, ' ').trim();
  }
}

// Uso
async function main() {
  const procesador = new ProcesadorArchivos();

  try {
    const resultados = await procesador.procesarDirectorio('./documentos');
    console.log('Archivos procesados:', resultados);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### 3. Sistema de Notificaciones

```javascript
class SistemaNotificaciones {
  constructor() {
    this.canales = {
      email: this.enviarEmail.bind(this),
      sms: this.enviarSMS.bind(this),
      push: this.enviarPush.bind(this),
    };
  }

  async enviarNotificacion(usuario, mensaje, canales = ['email']) {
    const promesas = canales.map(canal =>
      this.enviarPorCanal(canal, usuario, mensaje)
    );

    const resultados = await Promise.allSettled(promesas);

    return {
      exitosos: resultados.filter(r => r.status === 'fulfilled'),
      fallidos: resultados.filter(r => r.status === 'rejected'),
    };
  }

  async enviarPorCanal(canal, usuario, mensaje) {
    const enviar = this.canales[canal];

    if (!enviar) {
      throw new Error(`Canal ${canal} no soportado`);
    }

    return await enviar(usuario, mensaje);
  }

  async enviarEmail(usuario, mensaje) {
    // Simular envío de email
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (Math.random() > 0.9) {
      throw new Error('Error enviando email');
    }

    return {
      canal: 'email',
      destinatario: usuario.email,
      enviado: true,
    };
  }

  async enviarSMS(usuario, mensaje) {
    // Simular envío de SMS
    await new Promise(resolve => setTimeout(resolve, 800));

    if (Math.random() > 0.95) {
      throw new Error('Error enviando SMS');
    }

    return {
      canal: 'sms',
      destinatario: usuario.telefono,
      enviado: true,
    };
  }

  async enviarPush(usuario, mensaje) {
    // Simular envío de push
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      canal: 'push',
      destinatario: usuario.id,
      enviado: true,
    };
  }
}

// Uso
async function notificarUsuarios() {
  const sistema = new SistemaNotificaciones();

  const usuarios = [
    { id: 1, email: 'juan@ejemplo.com', telefono: '123456789' },
    { id: 2, email: 'maria@ejemplo.com', telefono: '987654321' },
  ];

  for (const usuario of usuarios) {
    try {
      const resultado = await sistema.enviarNotificacion(
        usuario,
        'Mensaje importante',
        ['email', 'sms', 'push']
      );

      console.log(`Usuario ${usuario.id}:`, resultado);
    } catch (error) {
      console.error(`Error notificando usuario ${usuario.id}:`, error);
    }
  }
}
```

## 🏆 Consejos para WorldSkills

### Patrones Rápidos

```javascript
// 1. Wrapper rápido para promesas
const wrap =
  fn =>
  async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

// 2. Delay helper
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// 3. Retry helper
const retry = async (fn, times = 3) => {
  for (let i = 0; i < times; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === times - 1) throw error;
      await delay(1000 * i);
    }
  }
};

// 4. Batch processor
const batch = async (items, fn, size = 10) => {
  const results = [];
  for (let i = 0; i < items.length; i += size) {
    const chunk = items.slice(i, i + size);
    const chunkResults = await Promise.all(chunk.map(fn));
    results.push(...chunkResults);
  }
  return results;
};
```

### Debugging Rápido

```javascript
// Console wrapper
const log = label => value => {
  console.log(`${label}:`, value);
  return value;
};

// Usar en cadenas
const resultado = await operacion1()
  .then(log('Paso 1'))
  .then(operacion2)
  .then(log('Paso 2'));
```

¡Domina async/await y tu código será más limpio y mantenible! 🚀
