/**
 * DÍA 10: JAVASCRIPT MODERNO (ES6+)
 * EJERCICIO 4: MÓDULOS ES6
 *
 * Descripción:
 * Dominar el sistema de módulos ES6 para crear código modular,
 * reutilizable y mantenible usando import/export.
 *
 * Objetivos:
 * - Entender la diferencia entre CommonJS y ES6 modules
 * - Usar export/import default y named exports
 * - Organizar código en módulos reutilizables
 * - Implementar patrones de módulos avanzados
 * - Manejar dependencias entre módulos
 *
 * Tiempo estimado: 50 minutos
 *
 * Instrucciones:
 * 1. Este ejercicio simula módulos ES6 usando comentarios y funciones
 * 2. En un proyecto real, cada "módulo" sería un archivo separado
 * 3. Presta atención a la organización y estructura del código
 * 4. Completa los ejercicios siguiendo las mejores prácticas
 *
 * Nota: Para usar módulos ES6 reales, necesitas configurar tu proyecto
 * con type: "module" en package.json o usar extensión .mjs
 */

console.log('=== DÍA 10 - EJERCICIO 4: MÓDULOS ES6 ===\n');

// ====================================
// 1. CONCEPTOS BÁSICOS DE MÓDULOS
// ====================================

console.log('1. CONCEPTOS BÁSICOS DE MÓDULOS');
console.log('--------------------------------');

// SIMULACIÓN DE MÓDULO: utils.js
// En un archivo real: export const formatearPrecio = (precio) => { ... }
const utils = {
  // Named export
  formatearPrecio: precio => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
    }).format(precio);
  },

  // Named export
  validarEmail: email => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  // Named export
  generarId: () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  // Default export (simulado)
  default: {
    version: '1.0.0',
    autor: 'Tu Nombre',
  },
};

// SIMULACIÓN DE IMPORT
// En un archivo real: import { formatearPrecio, validarEmail } from './utils.js'
const { formatearPrecio, validarEmail, generarId } = utils;

console.log('Precio formateado:', formatearPrecio(15000));
console.log('Email válido:', validarEmail('test@email.com'));
console.log('ID generado:', generarId());

console.log('\n');

// ====================================
// 2. EXPORT/IMPORT PATTERNS
// ====================================

console.log('2. EXPORT/IMPORT PATTERNS');
console.log('--------------------------------');

// SIMULACIÓN DE MÓDULO: matematicas.js
const matematicas = {
  // Named exports individuales
  sumar: (a, b) => a + b,
  restar: (a, b) => a - b,
  multiplicar: (a, b) => a * b,
  dividir: (a, b) => (b !== 0 ? a / b : null),

  // Named export agrupado
  operaciones: {
    suma: (a, b) => a + b,
    resta: (a, b) => a - b,
  },

  // Default export
  default: class Calculadora {
    constructor() {
      this.historial = [];
    }

    calcular(operacion, a, b) {
      let resultado;
      switch (operacion) {
        case 'suma':
          resultado = a + b;
          break;
        case 'resta':
          resultado = a - b;
          break;
        case 'multiplicacion':
          resultado = a * b;
          break;
        case 'division':
          resultado = b !== 0 ? a / b : null;
          break;
        default:
          resultado = null;
      }

      this.historial.push({ operacion, a, b, resultado });
      return resultado;
    }

    obtenerHistorial() {
      return [...this.historial];
    }
  },
};

// SIMULACIÓN DE IMPORTS
// import { sumar, restar } from './matematicas.js'
const { sumar, restar, multiplicar, dividir } = matematicas;

// import Calculadora from './matematicas.js'
const Calculadora = matematicas.default;

// import * as math from './matematicas.js'
const math = matematicas;

console.log('Suma:', sumar(5, 3));
console.log('Resta:', restar(10, 4));

const calc = new Calculadora();
console.log('Calculadora - División:', calc.calcular('division', 15, 3));
console.log('Historial:', calc.obtenerHistorial());

console.log('\n');

// ====================================
// 3. MÓDULOS DE CONFIGURACIÓN
// ====================================

console.log('3. MÓDULOS DE CONFIGURACIÓN');
console.log('--------------------------------');

// SIMULACIÓN DE MÓDULO: config.js
const config = {
  // Named exports de configuración
  API_BASE_URL: 'https://api.ejemplo.com',
  API_VERSION: 'v1',
  TIMEOUT: 5000,

  // Named export de configuración por ambiente
  development: {
    apiUrl: 'http://localhost:3000',
    debug: true,
    logLevel: 'verbose',
  },

  production: {
    apiUrl: 'https://api.produccion.com',
    debug: false,
    logLevel: 'error',
  },

  // Default export
  default: {
    obtenerConfig: (ambiente = 'development') => {
      return config[ambiente] || config.development;
    },

    obtenerApiUrl: endpoint => {
      const env = config.obtenerConfig();
      return `${env.apiUrl}/${endpoint}`;
    },
  },
};

// SIMULACIÓN DE IMPORT
// import { API_BASE_URL, TIMEOUT } from './config.js'
const { API_BASE_URL, TIMEOUT, development } = config;

// import configuracion from './config.js'
const configuracion = config.default;

console.log('API Base URL:', API_BASE_URL);
console.log('Timeout:', TIMEOUT);
console.log('Config desarrollo:', development);
console.log('URL completa:', configuracion.obtenerApiUrl('usuarios'));

console.log('\n');

// ====================================
// 4. MÓDULOS DE SERVICIOS
// ====================================

console.log('4. MÓDULOS DE SERVICIOS');
console.log('--------------------------------');

// SIMULACIÓN DE MÓDULO: apiService.js
const apiService = {
  // Named exports de métodos HTTP
  get: async endpoint => {
    console.log(`GET ${endpoint}`);
    return { data: `Datos de ${endpoint}`, status: 200 };
  },

  post: async (endpoint, data) => {
    console.log(`POST ${endpoint}`, data);
    return { data: `Creado en ${endpoint}`, status: 201 };
  },

  put: async (endpoint, data) => {
    console.log(`PUT ${endpoint}`, data);
    return { data: `Actualizado en ${endpoint}`, status: 200 };
  },

  delete: async endpoint => {
    console.log(`DELETE ${endpoint}`);
    return { data: `Eliminado de ${endpoint}`, status: 204 };
  },

  // Default export - Cliente API completo
  default: class ApiClient {
    constructor(baseUrl, token = null) {
      this.baseUrl = baseUrl;
      this.token = token;
    }

    setToken(token) {
      this.token = token;
    }

    async request(method, endpoint, data = null) {
      const url = `${this.baseUrl}${endpoint}`;
      const headers = {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      };

      console.log(`${method.toUpperCase()} ${url}`);
      if (data) console.log('Data:', data);

      // Simulación de respuesta
      return {
        data: `Respuesta de ${method.toUpperCase()} ${endpoint}`,
        status: 200,
        headers,
      };
    }
  },
};

// SIMULACIÓN DE IMPORT
// import { get, post } from './apiService.js'
const { get, post, put, delete: deleteRequest } = apiService;

// import ApiClient from './apiService.js'
const ApiClient = apiService.default;

// Usar named exports
await get('/usuarios');
await post('/usuarios', { nombre: 'Ana' });

// Usar default export
const client = new ApiClient('https://api.ejemplo.com');
client.setToken('token123');
await client.request('GET', '/perfil');

console.log('\n');

// ====================================
// 5. MÓDULOS DE COMPONENTES
// ====================================

console.log('5. MÓDULOS DE COMPONENTES');
console.log('--------------------------------');

// SIMULACIÓN DE MÓDULO: components.js
const components = {
  // Named export - Componente básico
  crearBoton: (texto, onClick) => {
    return {
      tipo: 'button',
      texto,
      onClick,
      render: () => `<button onclick="${onClick}">${texto}</button>`,
    };
  },

  // Named export - Componente con estado
  crearContador: (valorInicial = 0) => {
    let valor = valorInicial;

    return {
      tipo: 'contador',
      obtenerValor: () => valor,
      incrementar: () => ++valor,
      decrementar: () => --valor,
      resetear: () => (valor = valorInicial),
      render: () => `<div>Contador: ${valor}</div>`,
    };
  },

  // Named export - Componente de lista
  crearLista: (items = []) => {
    return {
      tipo: 'lista',
      items: [...items],
      agregar: item => items.push(item),
      remover: index => items.splice(index, 1),
      render: () =>
        `<ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>`,
    };
  },

  // Default export - Factory de componentes
  default: {
    crear: (tipo, props = {}) => {
      switch (tipo) {
        case 'button':
          return components.crearBoton(props.texto, props.onClick);
        case 'contador':
          return components.crearContador(props.valorInicial);
        case 'lista':
          return components.crearLista(props.items);
        default:
          throw new Error(`Tipo de componente desconocido: ${tipo}`);
      }
    },
  },
};

// SIMULACIÓN DE IMPORT
// import { crearBoton, crearContador } from './components.js'
const { crearBoton, crearContador, crearLista } = components;

// import ComponentFactory from './components.js'
const ComponentFactory = components.default;

// Usar named exports
const boton = crearBoton('Click me', 'alert("¡Hola!")');
const contador = crearContador(10);
const lista = crearLista(['Item 1', 'Item 2']);

console.log('Botón:', boton.render());
console.log('Contador inicial:', contador.render());
contador.incrementar();
console.log('Contador incrementado:', contador.render());

// Usar default export
const botonFactory = ComponentFactory.crear('button', {
  texto: 'Nuevo botón',
  onClick: 'console.log("Nuevo click")',
});
console.log('Botón desde factory:', botonFactory.render());

console.log('\n');

// ====================================
// 6. MÓDULOS CON DEPENDENCIAS
// ====================================

console.log('6. MÓDULOS CON DEPENDENCIAS');
console.log('--------------------------------');

// SIMULACIÓN DE MÓDULO: logger.js (dependencia)
const logger = {
  info: mensaje => console.log(`[INFO] ${mensaje}`),
  error: mensaje => console.log(`[ERROR] ${mensaje}`),
  warn: mensaje => console.log(`[WARN] ${mensaje}`),

  default: class Logger {
    constructor(nivel = 'info') {
      this.nivel = nivel;
    }

    log(nivel, mensaje) {
      if (this.debeLoguear(nivel)) {
        console.log(`[${nivel.toUpperCase()}] ${mensaje}`);
      }
    }

    debeLoguear(nivel) {
      const niveles = ['error', 'warn', 'info', 'debug'];
      return niveles.indexOf(nivel) <= niveles.indexOf(this.nivel);
    }
  },
};

// SIMULACIÓN DE MÓDULO: userService.js (usa logger)
const userService = {
  // Importa logger (simulado)
  _logger: logger.default,

  // Named exports que usan dependencias
  crearUsuario: userData => {
    const loggerInstance = new userService._logger('info');

    try {
      // Validar datos
      if (!userData.nombre || !userData.email) {
        loggerInstance.log('error', 'Datos de usuario inválidos');
        return null;
      }

      // Crear usuario
      const usuario = {
        id: Date.now(),
        ...userData,
        fechaCreacion: new Date(),
      };

      loggerInstance.log('info', `Usuario creado: ${usuario.nombre}`);
      return usuario;
    } catch (error) {
      loggerInstance.log('error', `Error al crear usuario: ${error.message}`);
      return null;
    }
  },

  obtenerUsuario: id => {
    const loggerInstance = new userService._logger('info');
    loggerInstance.log('info', `Buscando usuario con ID: ${id}`);

    // Simulación de búsqueda
    return {
      id,
      nombre: 'Usuario Test',
      email: 'test@email.com',
    };
  },

  // Default export
  default: class UserManager {
    constructor() {
      this.usuarios = [];
      this.logger = new logger.default('info');
    }

    agregar(userData) {
      const usuario = userService.crearUsuario(userData);
      if (usuario) {
        this.usuarios.push(usuario);
        this.logger.log(
          'info',
          `Usuario agregado al manager: ${usuario.nombre}`
        );
      }
      return usuario;
    }

    obtenerTodos() {
      this.logger.log('info', `Obteniendo ${this.usuarios.length} usuarios`);
      return [...this.usuarios];
    }
  },
};

// SIMULACIÓN DE IMPORT
// import { crearUsuario, obtenerUsuario } from './userService.js'
const { crearUsuario, obtenerUsuario } = userService;

// import UserManager from './userService.js'
const UserManager = userService.default;

// Usar el servicio
const nuevoUsuario = crearUsuario({ nombre: 'Ana', email: 'ana@test.com' });
const usuarioExistente = obtenerUsuario(123);

const manager = new UserManager();
manager.agregar({ nombre: 'Carlos', email: 'carlos@test.com' });
manager.agregar({ nombre: 'María', email: 'maria@test.com' });

console.log('Usuarios en manager:', manager.obtenerTodos());

console.log('\n');

// ====================================
// 7. PATRONES AVANZADOS DE MÓDULOS
// ====================================

console.log('7. PATRONES AVANZADOS DE MÓDULOS');
console.log('--------------------------------');

// PATRÓN: Módulo Singleton
const singleton = {
  _instance: null,

  default: class DatabaseConnection {
    constructor() {
      if (singleton._instance) {
        return singleton._instance;
      }

      this.isConnected = false;
      this.queries = [];
      singleton._instance = this;
    }

    connect() {
      if (!this.isConnected) {
        console.log('Conectando a la base de datos...');
        this.isConnected = true;
      }
      return this;
    }

    query(sql) {
      if (!this.isConnected) {
        throw new Error('Database not connected');
      }

      this.queries.push(sql);
      console.log(`Ejecutando query: ${sql}`);
      return `Resultado de: ${sql}`;
    }

    getStats() {
      return {
        connected: this.isConnected,
        totalQueries: this.queries.length,
      };
    }
  },
};

// PATRÓN: Factory Module
const factory = {
  // Named exports para diferentes tipos
  crearRepositorio: tipo => {
    const repositorios = {
      mysql: {
        tipo: 'mysql',
        connect: () => console.log('Conectando a MySQL'),
        query: sql => console.log(`MySQL: ${sql}`),
      },
      mongodb: {
        tipo: 'mongodb',
        connect: () => console.log('Conectando a MongoDB'),
        query: query => console.log(`MongoDB: ${JSON.stringify(query)}`),
      },
    };

    return repositorios[tipo] || repositorios.mysql;
  },

  // Default export
  default: {
    createService: config => {
      const { tipo, connectionString, options = {} } = config;

      return {
        tipo,
        connectionString,
        options,
        connect: () => console.log(`Conectando ${tipo} a ${connectionString}`),
        disconnect: () => console.log(`Desconectando ${tipo}`),
      };
    },
  },
};

// PATRÓN: Plugin System
const pluginSystem = {
  _plugins: [],

  // Named export para registrar plugins
  registrarPlugin: plugin => {
    pluginSystem._plugins.push(plugin);
    console.log(`Plugin registrado: ${plugin.name}`);
  },

  // Named export para ejecutar plugins
  ejecutarPlugins: (evento, datos) => {
    return pluginSystem._plugins.reduce((resultado, plugin) => {
      if (plugin.eventos.includes(evento)) {
        return plugin.ejecutar(evento, resultado);
      }
      return resultado;
    }, datos);
  },

  // Default export
  default: class PluginManager {
    constructor() {
      this.plugins = [];
    }

    usar(plugin) {
      this.plugins.push(plugin);
      console.log(`Plugin cargado: ${plugin.name}`);
      return this;
    }

    ejecutar(evento, datos) {
      return this.plugins.reduce((resultado, plugin) => {
        if (plugin.eventos && plugin.eventos.includes(evento)) {
          return plugin.ejecutar(evento, resultado);
        }
        return resultado;
      }, datos);
    }
  },
};

// Usar patrones avanzados
const db1 = new singleton.default();
const db2 = new singleton.default();
console.log('Misma instancia?', db1 === db2);

const repo = factory.crearRepositorio('mongodb');
repo.connect();

const plugin = {
  name: 'LoggerPlugin',
  eventos: ['beforeSave', 'afterSave'],
  ejecutar: (evento, datos) => {
    console.log(`Plugin ejecutado en ${evento}:`, datos);
    return { ...datos, timestamp: new Date() };
  },
};

const manager = new pluginSystem.default();
manager.usar(plugin);
const resultado = manager.ejecutar('beforeSave', { nombre: 'Test' });
console.log('Resultado con plugin:', resultado);

console.log('\n');

// ====================================
// 8. EJERCICIOS PRÁCTICOS
// ====================================

console.log('8. EJERCICIOS PRÁCTICOS');
console.log('--------------------------------');

// EJERCICIO 1: Crear módulo de validación
const validacion = {
  // Named exports para validadores específicos
  validarEmail: email => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  validarPassword: password => {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password)
    );
  },

  validarTelefono: telefono => {
    const regex = /^\+?[1-9]\d{1,14}$/;
    return regex.test(telefono);
  },

  // Default export - Validador completo
  default: class Validador {
    constructor() {
      this.reglas = {};
    }

    agregarRegla(campo, validador) {
      this.reglas[campo] = validador;
      return this;
    }

    validar(datos) {
      const errores = {};

      Object.keys(this.reglas).forEach(campo => {
        const validador = this.reglas[campo];
        const valor = datos[campo];

        if (!validador(valor)) {
          errores[campo] = `${campo} no es válido`;
        }
      });

      return {
        esValido: Object.keys(errores).length === 0,
        errores,
      };
    }
  },
};

// EJERCICIO 2: Crear módulo de estado (Store)
const store = {
  _estado: {},
  _listeners: [],

  // Named exports para manejo de estado
  getState: () => ({ ...store._estado }),

  setState: nuevoEstado => {
    store._estado = { ...store._estado, ...nuevoEstado };
    store._listeners.forEach(listener => listener(store._estado));
  },

  subscribe: listener => {
    store._listeners.push(listener);
    return () => {
      const index = store._listeners.indexOf(listener);
      if (index > -1) {
        store._listeners.splice(index, 1);
      }
    };
  },

  // Default export - Store completo
  default: class Store {
    constructor(estadoInicial = {}) {
      this.estado = estadoInicial;
      this.listeners = [];
      this.middleware = [];
    }

    getState() {
      return { ...this.estado };
    }

    dispatch(accion) {
      // Aplicar middleware
      let nuevaAccion = this.middleware.reduce((acc, mw) => {
        return mw(acc, this.estado);
      }, accion);

      // Actualizar estado
      this.estado = this.reducer(this.estado, nuevaAccion);

      // Notificar listeners
      this.listeners.forEach(listener => listener(this.estado));
    }

    subscribe(listener) {
      this.listeners.push(listener);
      return () => {
        const index = this.listeners.indexOf(listener);
        if (index > -1) {
          this.listeners.splice(index, 1);
        }
      };
    }

    useMiddleware(middleware) {
      this.middleware.push(middleware);
      return this;
    }

    reducer(estado, accion) {
      // Reducer básico
      switch (accion.tipo) {
        case 'INCREMENTAR':
          return { ...estado, contador: (estado.contador || 0) + 1 };
        case 'DECREMENTAR':
          return { ...estado, contador: (estado.contador || 0) - 1 };
        case 'SET_USUARIO':
          return { ...estado, usuario: accion.payload };
        default:
          return estado;
      }
    }
  },
};

// Probar ejercicios
console.log('=== EJERCICIO 1: VALIDACIÓN ===');
const { validarEmail, validarPassword } = validacion;
const Validador = validacion.default;

console.log('Email válido:', validarEmail('test@email.com'));
console.log('Password válido:', validarPassword('MiPassword123'));

const validador = new Validador()
  .agregarRegla('email', validarEmail)
  .agregarRegla('password', validarPassword);

const datosUsuario = {
  email: 'test@email.com',
  password: 'MiPassword123',
};

console.log('Validación completa:', validador.validar(datosUsuario));

console.log('\n=== EJERCICIO 2: STORE ===');
const { getState, setState, subscribe } = store;
const Store = store.default;

// Usar funciones de estado
const unsubscribe = subscribe(estado => {
  console.log('Estado actualizado:', estado);
});

setState({ usuario: 'Ana', contador: 5 });
setState({ contador: 10 });

// Usar clase Store
const miStore = new Store({ contador: 0 });
miStore.subscribe(estado => {
  console.log('Store actualizado:', estado);
});

miStore.dispatch({ tipo: 'INCREMENTAR' });
miStore.dispatch({ tipo: 'SET_USUARIO', payload: { nombre: 'Carlos' } });

console.log('\n');

// ====================================
// 9. MEJORES PRÁCTICAS
// ====================================

console.log('9. MEJORES PRÁCTICAS');
console.log('--------------------------------');

// ✅ Buenas prácticas para módulos

// 1. Usar named exports para múltiples utilidades
const utilidades = {
  formatearFecha: fecha => fecha.toLocaleDateString(),
  calcularEdad: fechaNacimiento => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    return hoy.getFullYear() - nacimiento.getFullYear();
  },
};

// 2. Usar default export para la funcionalidad principal
const clasePrincipal = {
  default: class GestorUsuarios {
    constructor() {
      this.usuarios = [];
    }

    agregarUsuario(usuario) {
      this.usuarios.push(usuario);
    }

    obtenerUsuarios() {
      return [...this.usuarios];
    }
  },
};

// 3. Organizar módulos por funcionalidad
const moduloAuth = {
  login: (usuario, password) => console.log(`Login: ${usuario}`),
  logout: () => console.log('Logout'),
  verificarToken: token => console.log(`Verificando: ${token}`),

  default: class AuthManager {
    constructor() {
      this.tokenActual = null;
    }

    autenticar(usuario, password) {
      // Lógica de autenticación
      this.tokenActual = `token_${usuario}`;
      return this.tokenActual;
    }
  },
};

// 4. Documentar exports claramente
/**
 * Módulo de notificaciones
 *
 * Named exports:
 * - mostrarNotificacion: Muestra una notificación
 * - ocultarNotificacion: Oculta una notificación
 *
 * Default export:
 * - NotificationManager: Gestor de notificaciones
 */
const notificaciones = {
  mostrarNotificacion: (mensaje, tipo = 'info') => {
    console.log(`[${tipo.toUpperCase()}] ${mensaje}`);
  },

  ocultarNotificacion: id => {
    console.log(`Ocultando notificación ${id}`);
  },

  default: class NotificationManager {
    constructor() {
      this.notificaciones = [];
    }

    crear(mensaje, tipo = 'info') {
      const notificacion = {
        id: Date.now(),
        mensaje,
        tipo,
        timestamp: new Date(),
      };

      this.notificaciones.push(notificacion);
      console.log(`Notificación creada: ${mensaje}`);
      return notificacion;
    }
  },
};

console.log('✅ Mejores prácticas aplicadas');
const NotificationManager = notificaciones.default;
const nm = new NotificationManager();
nm.crear('Bienvenido al sistema', 'success');

console.log('\n=== EJERCICIO 4 COMPLETADO ===');

// ====================================
// NOTAS PEDAGÓGICAS
// ====================================
/*
PUNTOS CLAVE A RECORDAR:

1. TIPOS DE EXPORTS:
   - Named exports: export const/function/class
   - Default export: export default
   - Re-exports: export { algo } from './modulo'
   - Namespace exports: export * as utils from './utils'

2. TIPOS DE IMPORTS:
   - Named imports: import { algo } from './modulo'
   - Default import: import Algo from './modulo'
   - Namespace import: import * as utils from './modulo'
   - Mixed imports: import Algo, { otro } from './modulo'

3. ORGANIZACIÓN:
   - Un módulo por archivo
   - Nombres descriptivos
   - Separar por funcionalidad
   - Evitar dependencias circulares

4. CONFIGURACIÓN:
   - type: "module" en package.json
   - Usar .mjs para módulos ES6
   - Configurar bundler (Webpack, Vite, etc.)

5. COMPATIBILIDAD:
   - ES6 modules vs CommonJS
   - Transpilación con Babel
   - Polyfills para navegadores antiguos

ERRORES COMUNES:
- Mezclar import/export con require/module.exports
- Dependencias circulares
- Imports innecesarios
- Exports mal organizados

WORLDSKILLS TIPS:
- Organizar código en módulos lógicos
- Usar patrones de diseño apropiados
- Documentar exports claramente
- Manejar dependencias correctamente
- Configurar proyecto para ES6 modules

ARCHIVOS TÍPICOS EN PROYECTO:
- package.json con type: "module"
- index.js como punto de entrada
- /src con módulos organizados
- /utils para utilidades
- /services para lógica de negocio
- /components para componentes
*/
