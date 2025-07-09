/**
 * 🔧 CONFIGURACIÓN DE TESTS
 *
 * Configuración centralizada para el sistema de testing
 * de la aplicación web completa
 */

export const testConfig = {
  // Configuración general
  timeout: 5000, // Timeout para tests asíncronos
  verbose: true, // Mostrar información detallada

  // Configuración de datos de prueba
  testData: {
    productos: [
      {
        id: 1,
        nombre: 'Laptop Test',
        precio: 1200,
        categoria: 'Electrónicos',
        descripcion: 'Laptop para testing',
        fechaCreacion: '2025-01-15T10:00:00Z',
      },
      {
        id: 2,
        nombre: 'Mouse Test',
        precio: 25.99,
        categoria: 'Accesorios',
        descripcion: 'Mouse para testing',
        fechaCreacion: '2025-01-15T10:01:00Z',
      },
      {
        id: 3,
        nombre: 'Teclado Test',
        precio: 85.5,
        categoria: 'Accesorios',
        descripcion: 'Teclado para testing',
        fechaCreacion: '2025-01-15T10:02:00Z',
      },
    ],

    categorias: ['Electrónicos', 'Accesorios', 'Hogar', 'Deportes', 'Libros'],

    usuarioTest: {
      nombre: 'Usuario Test',
      email: 'test@test.com',
      rol: 'admin',
    },
  },

  // Configuración de mocks
  mocks: {
    localStorage: true,
    fetch: true,
    dom: true,
  },

  // Configuración de reportes
  reports: {
    console: true,
    html: false,
    json: false,
  },
};

/**
 * Configurar el entorno de testing
 */
export function setupTestEnvironment() {
  // Mock de localStorage si no existe
  if (typeof localStorage === 'undefined') {
    global.localStorage = {
      data: {},
      getItem: function (key) {
        return this.data[key] || null;
      },
      setItem: function (key, value) {
        this.data[key] = value;
      },
      removeItem: function (key) {
        delete this.data[key];
      },
      clear: function () {
        this.data = {};
      },
    };
  }

  // Mock de fetch si no existe
  if (typeof fetch === 'undefined') {
    global.fetch = async function (url, options = {}) {
      // Simular respuesta exitosa
      return {
        ok: true,
        status: 200,
        json: async () => testConfig.testData.productos,
        text: async () => JSON.stringify(testConfig.testData.productos),
      };
    };
  }

  // Mock de performance si no existe
  if (typeof performance === 'undefined') {
    global.performance = {
      now: () => Date.now(),
    };
  }

  console.log('🔧 Entorno de testing configurado');
}

/**
 * Limpiar el entorno después de los tests
 */
export function cleanupTestEnvironment() {
  if (typeof localStorage !== 'undefined') {
    localStorage.clear();
  }

  console.log('🧹 Entorno de testing limpiado');
}

/**
 * Generar datos de prueba aleatorios
 */
export function generateTestData(count = 10) {
  const productos = [];
  const categorias = testConfig.testData.categorias;

  for (let i = 0; i < count; i++) {
    productos.push({
      id: Date.now() + i,
      nombre: `Producto ${i + 1}`,
      precio: Math.round((Math.random() * 1000 + 10) * 100) / 100,
      categoria: categorias[Math.floor(Math.random() * categorias.length)],
      descripcion: `Descripción del producto ${i + 1}`,
      fechaCreacion: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
    });
  }

  return productos;
}

/**
 * Utilidades para testing
 */
export const testUtils = {
  // Esperar un tiempo determinado
  wait: ms => new Promise(resolve => setTimeout(resolve, ms)),

  // Simular evento del DOM
  simulateEvent: (element, eventType, data = {}) => {
    const event = new Event(eventType);
    Object.assign(event, data);
    element.dispatchEvent(event);
  },

  // Crear elemento DOM mock
  createElement: (tag, props = {}) => {
    const element = document.createElement(tag);
    Object.assign(element, props);
    return element;
  },

  // Verificar que un elemento existe
  elementExists: selector => {
    return document.querySelector(selector) !== null;
  },

  // Obtener texto de un elemento
  getElementText: selector => {
    const element = document.querySelector(selector);
    return element ? element.textContent : null;
  },
};

export default testConfig;
