/**
 * 🧪 TESTS DE EJEMPLO - APLICACIÓN WEB COMPLETA
 *
 * Estos tests muestran cómo probar los diferentes módulos y componentes
 * de la aplicación usando JavaScript vanilla sin frameworks de testing
 *
 * Para el entorno WorldSkills, es importante conocer testing básico
 */

// Importar módulos a testear
import { Storage } from '../src/services/Storage.js';
import { EventEmitter } from '../src/utils/EventEmitter.js';
import { formatDate, formatPrice } from '../src/utils/Helpers.js';
import { validateProduct } from '../src/utils/Validators.js';

// ===============================================
// SISTEMA DE TESTING SIMPLE
// ===============================================

/**
 * Clase simple para testing sin framework
 */
class TestRunner {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
  }

  /**
   * Registrar un test
   */
  test(name, testFn) {
    this.tests.push({ name, testFn });
  }

  /**
   * Ejecutar todos los tests
   */
  async run() {
    console.log('🧪 Ejecutando tests...\n');

    for (const { name, testFn } of this.tests) {
      try {
        await testFn();
        console.log(`✅ ${name}`);
        this.passed++;
      } catch (error) {
        console.error(`❌ ${name}: ${error.message}`);
        this.failed++;
      }
    }

    console.log(
      `\n📊 Resultados: ${this.passed} pasaron, ${this.failed} fallaron`
    );
  }

  /**
   * Assertion simple
   */
  assert(condition, message) {
    if (!condition) {
      throw new Error(message || 'Assertion failed');
    }
  }

  /**
   * Comparar valores
   */
  assertEqual(actual, expected, message) {
    if (actual !== expected) {
      throw new Error(message || `Expected ${expected}, got ${actual}`);
    }
  }

  /**
   * Verificar que una función lance error
   */
  assertThrows(fn, message) {
    try {
      fn();
      throw new Error(message || 'Expected function to throw');
    } catch (error) {
      if (error.message === message) {
        throw error;
      }
    }
  }
}

// ===============================================
// TESTS DE UTILIDADES
// ===============================================

const testRunner = new TestRunner();

// Test: Validación de productos
testRunner.test('Validar producto válido', () => {
  const producto = {
    nombre: 'Laptop',
    precio: 1200,
    categoria: 'Electrónicos',
    descripcion: 'Laptop gaming',
  };

  const resultado = validateProduct(producto);
  testRunner.assert(
    resultado.isValid,
    'Producto válido debería pasar validación'
  );
  testRunner.assertEqual(
    resultado.errors.length,
    0,
    'No debería tener errores'
  );
});

testRunner.test('Validar producto inválido', () => {
  const producto = {
    nombre: '', // Nombre vacío
    precio: -100, // Precio negativo
    categoria: 'Electrónicos',
  };

  const resultado = validateProduct(producto);
  testRunner.assert(!resultado.isValid, 'Producto inválido debería fallar');
  testRunner.assert(resultado.errors.length > 0, 'Debería tener errores');
});

// Test: Formateo de precio
testRunner.test('Formatear precio correctamente', () => {
  testRunner.assertEqual(formatPrice(1234.56), '$1,234.56');
  testRunner.assertEqual(formatPrice(100), '$100.00');
  testRunner.assertEqual(formatPrice(0), '$0.00');
});

// Test: Formateo de fecha
testRunner.test('Formatear fecha correctamente', () => {
  const fecha = new Date('2025-01-15T10:30:00');
  const resultado = formatDate(fecha);
  testRunner.assert(resultado.includes('2025'), 'Debería incluir el año');
  testRunner.assert(resultado.includes('Jan'), 'Debería incluir el mes');
});

// ===============================================
// TESTS DE SERVICIOS
// ===============================================

// Test: Storage Service
testRunner.test('Storage - Guardar y recuperar datos', () => {
  const storage = new Storage();
  const testData = { id: 1, nombre: 'Test' };

  storage.save('test-key', testData);
  const resultado = storage.get('test-key');

  testRunner.assertEqual(resultado.id, testData.id);
  testRunner.assertEqual(resultado.nombre, testData.nombre);
});

testRunner.test('Storage - Datos no existentes', () => {
  const storage = new Storage();
  const resultado = storage.get('clave-inexistente');
  testRunner.assertEqual(resultado, null);
});

// Test: EventEmitter
testRunner.test('EventEmitter - Emitir y escuchar eventos', () => {
  const emitter = new EventEmitter();
  let eventFired = false;

  emitter.on('test-event', () => {
    eventFired = true;
  });

  emitter.emit('test-event');
  testRunner.assert(eventFired, 'El evento debería haberse disparado');
});

testRunner.test('EventEmitter - Múltiples listeners', () => {
  const emitter = new EventEmitter();
  let count = 0;

  emitter.on('count-event', () => count++);
  emitter.on('count-event', () => count++);

  emitter.emit('count-event');
  testRunner.assertEqual(count, 2, 'Ambos listeners deberían ejecutarse');
});

// ===============================================
// TESTS DE COMPONENTES (MOCK DOM)
// ===============================================

// Mock simple del DOM para testing
class MockElement {
  constructor(tagName = 'div') {
    this.tagName = tagName;
    this.innerHTML = '';
    this.textContent = '';
    this.className = '';
    this.style = {};
    this.children = [];
    this.eventListeners = {};
  }

  querySelector(selector) {
    return new MockElement();
  }

  addEventListener(event, handler) {
    this.eventListeners[event] = handler;
  }

  appendChild(child) {
    this.children.push(child);
  }

  setAttribute(name, value) {
    this[name] = value;
  }

  getAttribute(name) {
    return this[name];
  }
}

// Mock del document
global.document = {
  createElement: tagName => new MockElement(tagName),
  querySelector: selector => new MockElement(),
  body: new MockElement('body'),
};

// Test: Crear elemento con helpers
testRunner.test('Crear elemento con propiedades', () => {
  const elemento = document.createElement('div');
  elemento.className = 'test-class';
  elemento.textContent = 'Test Content';

  testRunner.assertEqual(elemento.className, 'test-class');
  testRunner.assertEqual(elemento.textContent, 'Test Content');
});

// ===============================================
// TESTS DE INTEGRACIÓN
// ===============================================

testRunner.test('Integración - Flujo completo de producto', async () => {
  // Simular flujo completo: crear, validar, guardar
  const storage = new Storage();

  // Crear producto
  const producto = {
    id: Date.now(),
    nombre: 'Producto Test',
    precio: 99.99,
    categoria: 'Test',
    descripcion: 'Producto de prueba',
    fechaCreacion: new Date().toISOString(),
  };

  // Validar
  const validacion = validateProduct(producto);
  testRunner.assert(validacion.isValid, 'Producto debería ser válido');

  // Guardar
  storage.save('productos', [producto]);

  // Recuperar
  const productosGuardados = storage.get('productos');
  testRunner.assertEqual(productosGuardados.length, 1);
  testRunner.assertEqual(productosGuardados[0].nombre, producto.nombre);
});

// ===============================================
// TESTS DE RENDIMIENTO
// ===============================================

testRunner.test('Rendimiento - Operaciones con arrays grandes', () => {
  const productos = Array.from({ length: 1000 }, (_, i) => ({
    id: i,
    nombre: `Producto ${i}`,
    precio: Math.random() * 1000,
    categoria: 'Test',
  }));

  const inicio = performance.now();

  // Operaciones comunes
  const filtrados = productos.filter(p => p.precio > 500);
  const ordenados = filtrados.sort((a, b) => b.precio - a.precio);
  const transformados = ordenados.map(p => ({
    ...p,
    precioFormateado: formatPrice(p.precio),
  }));

  const fin = performance.now();
  const tiempo = fin - inicio;

  testRunner.assert(tiempo < 100, `Operación debería ser rápida (${tiempo}ms)`);
  testRunner.assert(transformados.length > 0, 'Debería haber resultados');
});

// ===============================================
// TESTS DE CASOS EDGE
// ===============================================

testRunner.test('Casos Edge - Valores nulos y undefined', () => {
  // Test con valores nulos
  const resultadoNull = validateProduct(null);
  testRunner.assert(!resultadoNull.isValid, 'Null debería ser inválido');

  // Test con undefined
  const resultadoUndefined = validateProduct(undefined);
  testRunner.assert(
    !resultadoUndefined.isValid,
    'Undefined debería ser inválido'
  );

  // Test con objeto vacío
  const resultadoVacio = validateProduct({});
  testRunner.assert(
    !resultadoVacio.isValid,
    'Objeto vacío debería ser inválido'
  );
});

testRunner.test('Casos Edge - Strings vacíos y números especiales', () => {
  // Test con strings vacíos
  testRunner.assertEqual(
    formatPrice(''),
    '$0.00',
    'String vacío debería ser $0.00'
  );

  // Test con números especiales
  testRunner.assertEqual(formatPrice(NaN), '$0.00', 'NaN debería ser $0.00');
  testRunner.assertEqual(
    formatPrice(Infinity),
    '$0.00',
    'Infinity debería ser $0.00'
  );
});

// ===============================================
// EJECUCIÓN DE TESTS
// ===============================================

// Función para ejecutar todos los tests
export async function runTests() {
  await testRunner.run();
}

// Si se ejecuta directamente
if (typeof window !== 'undefined') {
  // En el navegador
  window.runTests = runTests;
  console.log(
    'Tests cargados. Ejecuta runTests() para correr todos los tests.'
  );
} else {
  // En Node.js
  runTests();
}

// ===============================================
// INSTRUCCIONES PARA ESTUDIANTES
// ===============================================

/**
 * 📋 INSTRUCCIONES PARA USAR LOS TESTS
 *
 * 1. Incluir este archivo en tu HTML:
 *    <script type="module" src="tests/example-tests.js"></script>
 *
 * 2. Abrir las DevTools del navegador
 *
 * 3. Ejecutar: runTests()
 *
 * 4. Ver los resultados en la consola
 *
 * 🎯 EJERCICIOS ADICIONALES:
 *
 * 1. Añadir más tests para tus funciones
 * 2. Crear tests para casos edge específicos
 * 3. Implementar tests para componentes UI
 * 4. Añadir tests de rendimiento
 *
 * 💡 MEJORES PRÁCTICAS:
 *
 * - Escribir tests antes de implementar (TDD)
 * - Cubrir casos felices y casos edge
 * - Mantener tests simples y enfocados
 * - Usar nombres descriptivos para tests
 * - Agrupar tests relacionados
 * - Mockear dependencias externas
 */
