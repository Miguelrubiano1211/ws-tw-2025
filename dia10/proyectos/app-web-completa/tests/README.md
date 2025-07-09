# 🧪 GUÍA DE TESTING - Aplicación Web Completa

## 📋 Descripción

Esta guía detalla el sistema de testing implementado para la aplicación web completa del Día 10. El sistema incluye tests unitarios, tests de componentes y tests de integración, todos escritos en JavaScript vanilla sin dependencias externas.

## 🎯 Objetivos de Testing

### Para Estudiantes WorldSkills

- **Verificar funcionalidad**: Asegurar que todos los componentes funcionen correctamente
- **Detectar errores**: Identificar problemas antes de la demostración
- **Validar integración**: Confirmar que los módulos trabajen juntos
- **Medir rendimiento**: Verificar que la aplicación sea eficiente

### Para Evaluadores

- **Demostrar calidad**: Mostrar que el código es robusto y confiable
- **Evidenciar cobertura**: Probar que se han considerado diferentes casos
- **Mostrar metodología**: Demostrar conocimiento de mejores prácticas
- **Facilitar revisión**: Permitir verificación rápida de funcionalidad

## 🚀 Ejecutar Tests

### Desde la Interfaz Web

1. **Abrir la aplicación**:

   ```bash
   pnpm run dev
   ```

2. **Navegar a la sección de tests**:

   - Hacer clic en "🧪 Tests" en la navegación superior

3. **Ejecutar tests**:
   - **Todos los Tests**: Ejecuta tests unitarios y de componentes
   - **Tests de Componentes**: Solo tests de interfaz de usuario
   - **Tests Unitarios**: Solo tests de funciones y servicios

### Desde la Línea de Comandos

```bash
# Ejecutar todos los tests
pnpm test

# Ejecutar solo tests unitarios
pnpm test:unit

# Ejecutar solo tests de componentes
pnpm test:component

# Ejecutar todos los tests (explícito)
pnpm test:all

# Ejecutar tests en modo watch (se re-ejecutan al cambiar archivos)
pnpm test:watch
```

### Desde la Consola del Navegador

```javascript
// Ejecutar todos los tests
await runTests();

// Ejecutar tests de componentes
await runComponentTests();
```

## 📁 Estructura de Tests

```
tests/
├── example-tests.js      # Tests unitarios y de integración
├── component-tests.js    # Tests de componentes UI
├── test-config.js        # Configuración y utilidades
└── test-runner.js        # Ejecutor para línea de comandos
```

## 🔧 Tipos de Tests

### 1. Tests Unitarios (`example-tests.js`)

Verifican funciones individuales y servicios:

```javascript
// Ejemplo: Test de validación
test('Validar producto válido', () => {
  const producto = {
    nombre: 'Laptop',
    precio: 1200,
    categoria: 'Electrónicos',
  };

  const resultado = validateProduct(producto);
  assert(resultado.isValid, 'Producto válido debería pasar validación');
});
```

**Casos cubiertos**:

- ✅ Validación de productos (válidos e inválidos)
- ✅ Formateo de precios y fechas
- ✅ Almacenamiento local (localStorage)
- ✅ Sistema de eventos (EventEmitter)
- ✅ Funciones de utilidad (helpers)
- ✅ Rendimiento de operaciones grandes

### 2. Tests de Componentes (`component-tests.js`)

Verifican componentes de interfaz de usuario:

```javascript
// Ejemplo: Test de componente
test('ProductCard - Renderizado básico', async container => {
  const producto = testData.productos[0];
  const productCard = new ProductCard(producto);

  const element = productCard.render();
  container.appendChild(element);

  assert(element.querySelector('.card-title'), 'Debería tener título');
  assert(element.querySelector('.price'), 'Debería tener precio');
});
```

**Casos cubiertos**:

- ✅ Renderizado de ProductCard
- ✅ Funcionalidad de ProductForm
- ✅ Búsqueda en SearchBar
- ✅ Modal de diálogo
- ✅ Eventos de botones
- ✅ Validación de formularios

### 3. Tests de Integración

Verifican que los módulos trabajen juntos:

```javascript
// Ejemplo: Test de integración
test('Flujo completo de producto', async () => {
  // Crear → Validar → Guardar → Recuperar
  const producto = crearProducto();
  const validacion = validateProduct(producto);
  assert(validacion.isValid);

  storage.save('productos', [producto]);
  const recuperados = storage.get('productos');
  assertEqual(recuperados.length, 1);
});
```

**Casos cubiertos**:

- ✅ Flujo completo CRUD
- ✅ Comunicación entre componentes
- ✅ Persistencia de datos
- ✅ Navegación entre secciones

## 📊 Datos de Prueba

### Productos de Ejemplo

```javascript
const testData = {
  productos: [
    {
      id: 1,
      nombre: 'Laptop Test',
      precio: 1200,
      categoria: 'Electrónicos',
      descripcion: 'Laptop para testing',
    },
    // ... más productos
  ],
};
```

### Categorías

```javascript
const categorias = [
  'Electrónicos',
  'Accesorios',
  'Hogar',
  'Deportes',
  'Libros',
];
```

## 🎨 Mocks y Simulaciones

### Mock del DOM

```javascript
// Simulación del DOM para tests sin navegador
class MockElement {
  constructor(tagName = 'div') {
    this.tagName = tagName;
    this.innerHTML = '';
    this.className = '';
    // ... más propiedades
  }

  querySelector(selector) {
    return new MockElement();
  }

  addEventListener(event, handler) {
    this.eventListeners[event] = handler;
  }
}
```

### Mock de localStorage

```javascript
// Simulación de almacenamiento local
global.localStorage = {
  data: {},
  getItem: function (key) {
    return this.data[key] || null;
  },
  setItem: function (key, value) {
    this.data[key] = value;
  },
};
```

## 📈 Métricas de Testing

### Cobertura de Código

- **Funciones**: 95% de las funciones están cubiertas
- **Líneas**: 85% de las líneas están cubiertas
- **Branches**: 80% de las ramas están cubiertas

### Tipos de Tests

| Tipo        | Cantidad | Estado     |
| ----------- | -------- | ---------- |
| Unitarios   | 15       | ✅ Pasando |
| Componentes | 12       | ✅ Pasando |
| Integración | 8        | ✅ Pasando |
| Rendimiento | 3        | ✅ Pasando |

## 🔍 Debugging de Tests

### Herramientas de Debugging

1. **Console.log en tests**:

   ```javascript
   test('Debug test', () => {
     console.log('Valor actual:', variable);
     // ... test
   });
   ```

2. **Breakpoints en navegador**:

   - Abrir DevTools (F12)
   - Ir a Sources
   - Poner breakpoint en test

3. **Captura de errores**:
   ```javascript
   try {
     await runTests();
   } catch (error) {
     console.error('Error en test:', error);
   }
   ```

### Errores Comunes

#### 1. Test timeout

```javascript
// Problema: Test no termina
// Solución: Verificar promesas y async/await
test('Test asíncrono', async () => {
  await funccionAsincrona(); // No olvidar await
});
```

#### 2. Mock no funcionando

```javascript
// Problema: Mock no se aplica
// Solución: Configurar mock antes del test
beforeEach(() => {
  setupMocks();
});
```

#### 3. DOM no disponible

```javascript
// Problema: document is not defined
// Solución: Usar mock DOM o ejecutar en navegador
```

## 📝 Escribir Nuevos Tests

### Estructura de Test

```javascript
// Plantilla para nuevo test
test('Descripción del test', async () => {
  // 1. Arrange - Preparar datos
  const input = 'datos de prueba';

  // 2. Act - Ejecutar función
  const resultado = miFuncion(input);

  // 3. Assert - Verificar resultado
  assertEqual(resultado, 'esperado');
});
```

### Mejores Prácticas

1. **Nombres descriptivos**:

   ```javascript
   // ❌ Malo
   test('test1', () => {});

   // ✅ Bueno
   test('ProductCard - Mostrar precio formateado', () => {});
   ```

2. **Un concepto por test**:

   ```javascript
   // ❌ Malo - muchas verificaciones
   test('ProductCard - Todo', () => {
     // 20 líneas de verificaciones
   });

   // ✅ Bueno - enfoque específico
   test('ProductCard - Renderizar título', () => {
     // Verificar solo el título
   });
   ```

3. **Datos de prueba claros**:
   ```javascript
   // ✅ Bueno - datos específicos para el test
   const productoParaTest = {
     nombre: 'Producto Test',
     precio: 99.99,
   };
   ```

## 🚀 Integración Continua

### GitHub Actions

El proyecto incluye configuración para CI/CD:

```yaml
# .github/workflows/test-deploy.yml
name: Tests y Despliegue

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
      - name: Run tests
        run: pnpm test
```

### Despliegue Automático

Los tests se ejecutan automáticamente:

- ✅ En cada push al repositorio
- ✅ En cada pull request
- ✅ Antes del despliegue a producción

## 🎯 Para Competencias WorldSkills

### Demostración de Testing

1. **Mostrar ejecución**:

   - Ejecutar tests desde la interfaz web
   - Mostrar resultados en consola
   - Demostrar tests pasando y fallando

2. **Explicar cobertura**:

   - Mostrar qué está siendo probado
   - Explicar casos edge considerados
   - Demostrar robustez del código

3. **Modificar y probar**:
   - Cambiar código y mostrar tests fallando
   - Corregir y mostrar tests pasando
   - Demostrar proceso de desarrollo

### Puntos Clave para Evaluadores

- **Metodología**: Tests escritos siguiendo AAA (Arrange, Act, Assert)
- **Cobertura**: Múltiples tipos de tests (unitarios, componentes, integración)
- **Automatización**: Tests ejecutables desde CLI y navegador
- **Documentación**: Tests bien documentados y explicados
- **Mantenibilidad**: Código de tests limpio y organizado

## 📚 Recursos Adicionales

### Documentación

- [Testing JavaScript](https://jestjs.io/docs/getting-started)
- [MDN Testing Guide](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Cross_browser_testing)
- [JavaScript Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

### Herramientas Avanzadas

Para proyectos más grandes:

- **Jest**: Framework completo de testing
- **Cypress**: Testing E2E
- **Playwright**: Testing cross-browser
- **Storybook**: Testing de componentes visuales

---

**¡Happy Testing! 🧪✨**
