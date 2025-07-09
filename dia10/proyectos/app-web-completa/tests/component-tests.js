/**
 * 🧪 TESTS DE COMPONENTES
 *
 * Tests específicos para los componentes de la aplicación
 * Incluye tests de renderizado, interacción y estado
 */

import { Modal } from '../src/components/Modal.js';
import { ProductCard } from '../src/components/ProductCard.js';
import { ProductForm } from '../src/components/ProductForm.js';
import { SearchBar } from '../src/components/SearchBar.js';
import {
  cleanupTestEnvironment,
  setupTestEnvironment,
  testConfig,
  testUtils,
} from './test-config.js';

// ===============================================
// SETUP DE TESTS DE COMPONENTES
// ===============================================

/**
 * Crear un contenedor de prueba en el DOM
 */
function createTestContainer() {
  const container = document.createElement('div');
  container.id = 'test-container';
  document.body.appendChild(container);
  return container;
}

/**
 * Limpiar el contenedor de prueba
 */
function cleanupTestContainer() {
  const container = document.getElementById('test-container');
  if (container) {
    container.remove();
  }
}

/**
 * Sistema de testing para componentes
 */
class ComponentTestRunner {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
    this.container = null;
  }

  async runAll() {
    setupTestEnvironment();
    console.log('🧪 Ejecutando tests de componentes...\n');

    for (const { name, testFn } of this.tests) {
      this.container = createTestContainer();

      try {
        await testFn(this.container);
        console.log(`✅ ${name}`);
        this.passed++;
      } catch (error) {
        console.error(`❌ ${name}: ${error.message}`);
        console.error(error.stack);
        this.failed++;
      } finally {
        cleanupTestContainer();
      }
    }

    cleanupTestEnvironment();
    console.log(
      `\n📊 Resultados: ${this.passed} pasaron, ${this.failed} fallaron`
    );
  }

  test(name, testFn) {
    this.tests.push({ name, testFn });
  }

  assert(condition, message) {
    if (!condition) {
      throw new Error(message || 'Assertion failed');
    }
  }

  assertEqual(actual, expected, message) {
    if (actual !== expected) {
      throw new Error(message || `Expected '${expected}', got '${actual}'`);
    }
  }
}

// ===============================================
// TESTS DE PRODUCTCARD
// ===============================================

const componentTests = new ComponentTestRunner();

componentTests.test('ProductCard - Renderizado básico', async container => {
  const producto = testConfig.testData.productos[0];
  const productCard = new ProductCard(producto);

  const element = productCard.render();
  container.appendChild(element);

  // Verificar que se renderizó correctamente
  componentTests.assert(
    element.querySelector('.card'),
    'Debería tener clase card'
  );
  componentTests.assert(
    element.querySelector('.card-title'),
    'Debería tener título'
  );
  componentTests.assert(
    element.querySelector('.card-text'),
    'Debería tener descripción'
  );
  componentTests.assert(
    element.querySelector('.price'),
    'Debería tener precio'
  );

  // Verificar contenido
  const title = element.querySelector('.card-title').textContent;
  componentTests.assertEqual(
    title,
    producto.nombre,
    'Título debería coincidir'
  );

  const price = element.querySelector('.price').textContent;
  componentTests.assert(price.includes('$'), 'Precio debería tener símbolo $');
});

componentTests.test('ProductCard - Eventos de botones', async container => {
  const producto = testConfig.testData.productos[0];
  let editClicked = false;
  let deleteClicked = false;

  const productCard = new ProductCard(producto, {
    onEdit: () => {
      editClicked = true;
    },
    onDelete: () => {
      deleteClicked = true;
    },
  });

  const element = productCard.render();
  container.appendChild(element);

  // Simular click en editar
  const editButton = element.querySelector('.btn-edit');
  componentTests.assert(editButton, 'Debería tener botón de editar');
  editButton.click();

  componentTests.assert(editClicked, 'Callback de editar debería ejecutarse');

  // Simular click en eliminar
  const deleteButton = element.querySelector('.btn-delete');
  componentTests.assert(deleteButton, 'Debería tener botón de eliminar');
  deleteButton.click();

  componentTests.assert(
    deleteClicked,
    'Callback de eliminar debería ejecutarse'
  );
});

// ===============================================
// TESTS DE PRODUCTFORM
// ===============================================

componentTests.test(
  'ProductForm - Renderizado de formulario',
  async container => {
    const productForm = new ProductForm();
    const element = productForm.render();
    container.appendChild(element);

    // Verificar campos del formulario
    componentTests.assert(
      element.querySelector('form'),
      'Debería tener formulario'
    );
    componentTests.assert(
      element.querySelector('input[name="nombre"]'),
      'Debería tener campo nombre'
    );
    componentTests.assert(
      element.querySelector('input[name="precio"]'),
      'Debería tener campo precio'
    );
    componentTests.assert(
      element.querySelector('select[name="categoria"]'),
      'Debería tener campo categoría'
    );
    componentTests.assert(
      element.querySelector('textarea[name="descripcion"]'),
      'Debería tener campo descripción'
    );
    componentTests.assert(
      element.querySelector('button[type="submit"]'),
      'Debería tener botón submit'
    );
  }
);

componentTests.test('ProductForm - Validación de campos', async container => {
  const productForm = new ProductForm();
  const element = productForm.render();
  container.appendChild(element);

  const form = element.querySelector('form');
  const nombreInput = element.querySelector('input[name="nombre"]');
  const precioInput = element.querySelector('input[name="precio"]');

  // Intentar enviar formulario vacío
  let validationFailed = false;

  productForm.onSubmit = data => {
    // No debería ejecutarse con datos inválidos
    validationFailed = false;
  };

  // Simular envío con campos vacíos
  nombreInput.value = '';
  precioInput.value = '';

  const submitEvent = new Event('submit');
  form.dispatchEvent(submitEvent);

  // Verificar que hay errores de validación
  const errorMessages = element.querySelectorAll('.error-message');
  componentTests.assert(
    errorMessages.length > 0,
    'Debería mostrar errores de validación'
  );
});

componentTests.test('ProductForm - Envío exitoso', async container => {
  const productForm = new ProductForm();
  const element = productForm.render();
  container.appendChild(element);

  let submittedData = null;
  productForm.onSubmit = data => {
    submittedData = data;
  };

  // Llenar formulario con datos válidos
  const form = element.querySelector('form');
  const nombreInput = element.querySelector('input[name="nombre"]');
  const precioInput = element.querySelector('input[name="precio"]');
  const categoriaSelect = element.querySelector('select[name="categoria"]');
  const descripcionTextarea = element.querySelector(
    'textarea[name="descripcion"]'
  );

  nombreInput.value = 'Producto Test';
  precioInput.value = '99.99';
  categoriaSelect.value = 'Electrónicos';
  descripcionTextarea.value = 'Descripción test';

  // Simular envío
  const submitEvent = new Event('submit');
  form.dispatchEvent(submitEvent);

  // Verificar que se envió correctamente
  componentTests.assert(submittedData, 'Debería haber datos enviados');
  componentTests.assertEqual(
    submittedData.nombre,
    'Producto Test',
    'Nombre debería coincidir'
  );
  componentTests.assertEqual(
    submittedData.precio,
    99.99,
    'Precio debería coincidir'
  );
});

// ===============================================
// TESTS DE SEARCHBAR
// ===============================================

componentTests.test('SearchBar - Renderizado básico', async container => {
  const searchBar = new SearchBar();
  const element = searchBar.render();
  container.appendChild(element);

  // Verificar elementos básicos
  componentTests.assert(
    element.querySelector('input[type="search"]'),
    'Debería tener input de búsqueda'
  );
  componentTests.assert(
    element.querySelector('select'),
    'Debería tener selector de categoría'
  );
  componentTests.assert(
    element.querySelector('button'),
    'Debería tener botón de limpiar'
  );
});

componentTests.test(
  'SearchBar - Funcionalidad de búsqueda',
  async container => {
    const searchBar = new SearchBar();
    const element = searchBar.render();
    container.appendChild(element);

    let searchTerm = null;
    searchBar.onSearch = term => {
      searchTerm = term;
    };

    const searchInput = element.querySelector('input[type="search"]');

    // Simular búsqueda
    searchInput.value = 'laptop';
    searchInput.dispatchEvent(new Event('input'));

    // Esperar un poco para el debounce
    await testUtils.wait(100);

    componentTests.assertEqual(
      searchTerm,
      'laptop',
      'Término de búsqueda debería coincidir'
    );
  }
);

componentTests.test('SearchBar - Filtro por categoría', async container => {
  const searchBar = new SearchBar();
  const element = searchBar.render();
  container.appendChild(element);

  let selectedCategory = null;
  searchBar.onCategoryChange = category => {
    selectedCategory = category;
  };

  const categorySelect = element.querySelector('select');

  // Simular cambio de categoría
  categorySelect.value = 'Electrónicos';
  categorySelect.dispatchEvent(new Event('change'));

  componentTests.assertEqual(
    selectedCategory,
    'Electrónicos',
    'Categoría debería coincidir'
  );
});

// ===============================================
// TESTS DE MODAL
// ===============================================

componentTests.test('Modal - Mostrar y ocultar', async container => {
  const modal = new Modal();
  const element = modal.render();
  container.appendChild(element);

  // Inicialmente debería estar oculto
  componentTests.assert(
    element.style.display === 'none',
    'Modal debería estar oculto inicialmente'
  );

  // Mostrar modal
  modal.show('Título Test', 'Contenido Test');
  componentTests.assert(
    element.style.display === 'block',
    'Modal debería mostrarse'
  );

  // Verificar contenido
  const title = element.querySelector('.modal-title').textContent;
  const content = element.querySelector('.modal-body').textContent;

  componentTests.assertEqual(title, 'Título Test', 'Título debería coincidir');
  componentTests.assertEqual(
    content,
    'Contenido Test',
    'Contenido debería coincidir'
  );

  // Ocultar modal
  modal.hide();
  componentTests.assert(
    element.style.display === 'none',
    'Modal debería ocultarse'
  );
});

componentTests.test('Modal - Cerrar con botón X', async container => {
  const modal = new Modal();
  const element = modal.render();
  container.appendChild(element);

  // Mostrar modal
  modal.show('Test', 'Test');

  // Simular click en botón cerrar
  const closeButton = element.querySelector('.modal-close');
  componentTests.assert(closeButton, 'Debería tener botón cerrar');

  closeButton.click();
  componentTests.assert(
    element.style.display === 'none',
    'Modal debería cerrarse'
  );
});

// ===============================================
// TESTS DE INTEGRACIÓN DE COMPONENTES
// ===============================================

componentTests.test('Integración - ProductCard con Modal', async container => {
  const producto = testConfig.testData.productos[0];
  const modal = new Modal();
  const modalElement = modal.render();
  container.appendChild(modalElement);

  const productCard = new ProductCard(producto, {
    onEdit: () => {
      modal.show('Editar Producto', 'Formulario de edición');
    },
  });

  const cardElement = productCard.render();
  container.appendChild(cardElement);

  // Simular click en editar
  const editButton = cardElement.querySelector('.btn-edit');
  editButton.click();

  // Verificar que el modal se abrió
  componentTests.assert(
    modalElement.style.display === 'block',
    'Modal debería abrirse'
  );

  const modalTitle = modalElement.querySelector('.modal-title').textContent;
  componentTests.assertEqual(
    modalTitle,
    'Editar Producto',
    'Título del modal debería coincidir'
  );
});

componentTests.test(
  'Integración - SearchBar con ProductList',
  async container => {
    const searchBar = new SearchBar();
    const searchElement = searchBar.render();
    container.appendChild(searchElement);

    const productos = testConfig.testData.productos;
    let filteredProducts = productos;

    searchBar.onSearch = term => {
      filteredProducts = productos.filter(p =>
        p.nombre.toLowerCase().includes(term.toLowerCase())
      );
    };

    // Simular búsqueda
    const searchInput = searchElement.querySelector('input[type="search"]');
    searchInput.value = 'laptop';
    searchInput.dispatchEvent(new Event('input'));

    await testUtils.wait(100);

    componentTests.assert(
      filteredProducts.length < productos.length,
      'Debería filtrar productos'
    );
    componentTests.assert(
      filteredProducts.some(p => p.nombre.toLowerCase().includes('laptop')),
      'Debería incluir productos con "laptop"'
    );
  }
);

// ===============================================
// EXPORT PARA EJECUCIÓN
// ===============================================

export { componentTests };

// Función principal para ejecutar todos los tests de componentes
export async function runComponentTests() {
  await componentTests.runAll();
}

// Si se ejecuta directamente
if (typeof window !== 'undefined') {
  window.runComponentTests = runComponentTests;
  console.log(
    'Tests de componentes cargados. Ejecuta runComponentTests() para ejecutar.'
  );
}

/**
 * 📋 INSTRUCCIONES PARA TESTS DE COMPONENTES
 *
 * 1. Estos tests verifican el comportamiento de los componentes UI
 * 2. Incluyen tests de renderizado, interacción y estado
 * 3. Usan un DOM mock para simular el navegador
 * 4. Verifican la integración entre componentes
 *
 * 🎯 PARA AÑADIR MÁS TESTS:
 *
 * componentTests.test('Nombre del test', async (container) => {
 *     // Tu código de test aquí
 *     // Usar container para añadir elementos al DOM
 * });
 *
 * 💡 MEJORES PRÁCTICAS:
 *
 * - Limpiar el DOM después de cada test
 * - Usar datos de prueba consistentes
 * - Verificar tanto el comportamiento como la presentación
 * - Simular eventos de usuario realistas
 * - Testear casos edge de la UI
 */
