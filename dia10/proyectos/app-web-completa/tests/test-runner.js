#!/usr/bin/env node

/**
 * 🧪 TEST RUNNER - Ejecutor de tests desde línea de comandos
 *
 * Este script permite ejecutar los tests desde la terminal
 * sin necesidad de abrir el navegador
 */

import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configurar globals para Node.js
global.window = undefined;
global.document = {
  createElement: tag => ({
    tagName: tag,
    innerHTML: '',
    textContent: '',
    className: '',
    style: {},
    children: [],
    addEventListener: () => {},
    appendChild: () => {},
    querySelector: () => null,
    querySelectorAll: () => [],
  }),
  querySelector: () => null,
  querySelectorAll: () => [],
  body: {
    appendChild: () => {},
  },
};

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

global.fetch = async function (url, options = {}) {
  // Mock de fetch para testing
  return {
    ok: true,
    status: 200,
    json: async () => [],
    text: async () => '[]',
  };
};

global.Event = class Event {
  constructor(type) {
    this.type = type;
  }
};

global.performance = {
  now: () => Date.now(),
};

/**
 * Función principal para ejecutar tests
 */
async function runTestsFromCLI() {
  console.log('🧪 Ejecutando tests desde línea de comandos...\n');

  try {
    // Importar y ejecutar tests
    const { runTests } = await import('./example-tests.js');
    const { runComponentTests } = await import('./component-tests.js');

    console.log('📋 Ejecutando tests unitarios...');
    await runTests();

    console.log('\n🎨 Ejecutando tests de componentes...');
    await runComponentTests();

    console.log('\n✅ Todos los tests completados!');
  } catch (error) {
    console.error('❌ Error ejecutando tests:', error.message);
    process.exit(1);
  }
}

/**
 * Función para ejecutar tests específicos
 */
async function runSpecificTests(testType) {
  console.log(`🧪 Ejecutando tests de tipo: ${testType}\n`);

  try {
    switch (testType) {
      case 'unit':
        const { runTests } = await import('./example-tests.js');
        await runTests();
        break;

      case 'component':
        const { runComponentTests } = await import('./component-tests.js');
        await runComponentTests();
        break;

      default:
        console.error('❌ Tipo de test no válido. Usa: unit, component');
        process.exit(1);
    }

    console.log('\n✅ Tests completados!');
  } catch (error) {
    console.error('❌ Error ejecutando tests:', error.message);
    process.exit(1);
  }
}

/**
 * Mostrar ayuda
 */
function showHelp() {
  console.log(`
🧪 TEST RUNNER - Ejecutor de tests

Uso:
    node test-runner.js [tipo]

Tipos de tests disponibles:
    unit       - Ejecutar solo tests unitarios
    component  - Ejecutar solo tests de componentes
    all        - Ejecutar todos los tests (por defecto)

Ejemplos:
    node test-runner.js
    node test-runner.js unit
    node test-runner.js component
    node test-runner.js all

Opciones:
    -h, --help    Mostrar esta ayuda
    -v, --version Mostrar versión
    `);
}

/**
 * Mostrar versión
 */
function showVersion() {
  try {
    const packageJson = JSON.parse(
      readFileSync(join(__dirname, '..', 'package.json'), 'utf8')
    );
    console.log(`Test Runner v${packageJson.version}`);
  } catch (error) {
    console.log('Test Runner v1.0.0');
  }
}

/**
 * Procesar argumentos de línea de comandos
 */
function processArguments() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    return runTestsFromCLI();
  }

  const firstArg = args[0].toLowerCase();

  switch (firstArg) {
    case '-h':
    case '--help':
      showHelp();
      break;

    case '-v':
    case '--version':
      showVersion();
      break;

    case 'unit':
    case 'component':
      runSpecificTests(firstArg);
      break;

    case 'all':
      runTestsFromCLI();
      break;

    default:
      console.error(`❌ Argumento no válido: ${firstArg}`);
      showHelp();
      process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  processArguments();
}

export { runSpecificTests, runTestsFromCLI };
