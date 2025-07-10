# 📋 Día 14: Testing y Quality Assurance - Guía Detallada

## 🎯 Objetivo del Día

Implementar un sistema completo de testing y quality assurance para aplicaciones web, preparando a los estudiantes para mantener código de alta calidad en entornos de producción.

---

## 🏗️ Estructura del Día

### **Fase 1: Fundamentos de Testing (12:00 - 13:30)**

#### **12:00 - 12:30 | Introducción al Testing**

##### **Conceptos Clave:**

- **TDD (Test-Driven Development)**: Escribir tests antes que el código
- **BDD (Behavior-Driven Development)**: Tests basados en comportamiento
- **Pirámide de Testing**: Unit → Integration → E2E

##### **Filosofía del Testing:**

```javascript
// ❌ Código sin tests
function calcularDescuento(precio, porcentaje) {
  return precio * (1 - porcentaje / 100);
}

// ✅ Código con tests
function calcularDescuento(precio, porcentaje) {
  if (precio < 0) throw new Error('Precio no puede ser negativo');
  if (porcentaje < 0 || porcentaje > 100)
    throw new Error('Porcentaje inválido');
  return precio * (1 - porcentaje / 100);
}

// Test
test('calcular descuento correctamente', () => {
  expect(calcularDescuento(100, 20)).toBe(80);
  expect(() => calcularDescuento(-10, 20)).toThrow(
    'Precio no puede ser negativo'
  );
});
```

#### **12:30 - 13:00 | Unit Testing con Jest**

##### **Configuración Inicial:**

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapping: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/reportWebVitals.js',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

##### **Estructura de Tests:**

```javascript
// utils/helpers.test.js
import { formatearPrecio, validarEmail } from './helpers';

describe('Utilidades de Formato', () => {
  describe('formatearPrecio', () => {
    test('debe formatear precio correctamente', () => {
      expect(formatearPrecio(1000)).toBe('$1,000.00');
      expect(formatearPrecio(0)).toBe('$0.00');
      expect(formatearPrecio(99.99)).toBe('$99.99');
    });

    test('debe manejar valores inválidos', () => {
      expect(() => formatearPrecio(null)).toThrow();
      expect(() => formatearPrecio('invalid')).toThrow();
    });
  });

  describe('validarEmail', () => {
    test('debe validar emails correctos', () => {
      expect(validarEmail('user@example.com')).toBe(true);
      expect(validarEmail('test.email@domain.co')).toBe(true);
    });

    test('debe rechazar emails inválidos', () => {
      expect(validarEmail('invalid-email')).toBe(false);
      expect(validarEmail('user@')).toBe(false);
      expect(validarEmail('')).toBe(false);
    });
  });
});
```

#### **13:00 - 13:30 | React Component Testing**

##### **Configuración React Testing Library:**

```javascript
// src/setupTests.js
import '@testing-library/jest-dom';
import { server } from './mocks/server';

// Configurar MSW
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Mock de módulos problemáticos
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));
```

##### **Testing de Componentes:**

```javascript
// components/ProductoCard.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import ProductoCard from './ProductoCard';

const mockProducto = {
  id: '1',
  nombre: 'Producto Test',
  precio: 99.99,
  descripcion: 'Descripción de prueba',
  imagen: 'https://example.com/image.jpg',
};

const renderWithRouter = component => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('ProductoCard', () => {
  test('debe renderizar información del producto', () => {
    renderWithRouter(<ProductoCard producto={mockProducto} />);

    expect(screen.getByText('Producto Test')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByText('Descripción de prueba')).toBeInTheDocument();
  });

  test('debe manejar click en agregar al carrito', async () => {
    const user = userEvent.setup();
    const onAddToCart = jest.fn();

    renderWithRouter(
      <ProductoCard
        producto={mockProducto}
        onAddToCart={onAddToCart}
      />
    );

    const addButton = screen.getByRole('button', {
      name: /agregar al carrito/i,
    });
    await user.click(addButton);

    expect(onAddToCart).toHaveBeenCalledWith(mockProducto);
  });

  test('debe mostrar estado de loading', () => {
    renderWithRouter(
      <ProductoCard
        producto={mockProducto}
        loading={true}
      />
    );

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
});
```

### **Fase 2: Integration Testing (13:45 - 14:45)**

#### **13:45 - 14:15 | API Integration Testing**

##### **Configuración Supertest:**

```javascript
// tests/integration/productos.test.js
const request = require('supertest');
const app = require('../../src/app');
const { setupTestDB, cleanupTestDB } = require('../helpers/db');

describe('Productos API', () => {
  beforeAll(async () => {
    await setupTestDB();
  });

  afterAll(async () => {
    await cleanupTestDB();
  });

  describe('GET /api/productos', () => {
    test('debe retornar lista de productos', async () => {
      const response = await request(app).get('/api/productos').expect(200);

      expect(response.body).toHaveProperty('productos');
      expect(Array.isArray(response.body.productos)).toBe(true);
    });

    test('debe soportar paginación', async () => {
      const response = await request(app)
        .get('/api/productos?page=1&limit=5')
        .expect(200);

      expect(response.body.productos).toHaveLength(5);
      expect(response.body).toHaveProperty('totalPages');
      expect(response.body).toHaveProperty('currentPage', 1);
    });
  });

  describe('POST /api/productos', () => {
    test('debe crear nuevo producto', async () => {
      const nuevoProducto = {
        nombre: 'Producto Test',
        precio: 99.99,
        descripcion: 'Descripción test',
        categoria: 'electronics',
      };

      const response = await request(app)
        .post('/api/productos')
        .send(nuevoProducto)
        .expect(201);

      expect(response.body.nombre).toBe(nuevoProducto.nombre);
      expect(response.body.precio).toBe(nuevoProducto.precio);
      expect(response.body).toHaveProperty('id');
    });

    test('debe validar campos requeridos', async () => {
      const response = await request(app)
        .post('/api/productos')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('requeridos');
    });
  });
});
```

### **Fase 3: Quality Assurance (14:45 - 16:00)**

#### **14:45 - 15:15 | Code Quality Tools**

##### **ESLint Configuration:**

```javascript
// .eslintrc.js
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks', 'jsx-a11y', 'import'],
  rules: {
    'react/prop-types': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'jsx-a11y/anchor-is-valid': 'error',
    'no-unused-vars': 'error',
    'no-console': 'warn',
    'prefer-const': 'error',
    'no-var': 'error',
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx'],
      },
    },
  },
};
```

##### **Prettier Configuration:**

```javascript
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "jsxSingleQuote": true,
  "bracketSpacing": true,
  "jsxBracketSameLine": false,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

##### **Husky Pre-commit Hooks:**

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm test"
    }
  },
  "lint-staged": {
    "*.{js,jsx}": ["eslint --fix", "prettier --write", "git add"],
    "*.{css,scss,md}": ["prettier --write", "git add"]
  }
}
```

#### **15:30 - 16:00 | Performance Testing**

##### **Lighthouse CI:**

```javascript
// lighthouse.config.js
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000'],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.8 }],
        'categories:seo': ['error', { minScore: 0.8 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
```

##### **Web Vitals Measurement:**

```javascript
// src/utils/reportWebVitals.js
import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals';

const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    onCLS(onPerfEntry);
    onFID(onPerfEntry);
    onFCP(onPerfEntry);
    onLCP(onPerfEntry);
    onTTFB(onPerfEntry);
  }
};

export default reportWebVitals;

// Performance monitoring
export const logWebVitals = metric => {
  console.log(metric);

  // Enviar a analytics
  if (process.env.NODE_ENV === 'production') {
    // Google Analytics, DataDog, etc.
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.value),
      non_interaction: true,
    });
  }
};
```

### **Fase 4: Accessibility & E2E Testing (16:00 - 17:00)**

#### **16:00 - 16:30 | Accessibility Testing**

##### **axe-core Integration:**

```javascript
// tests/accessibility/a11y.test.js
import { axe, toHaveNoViolations } from 'jest-axe';
import { render } from '@testing-library/react';
import App from '../src/App';

expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  test('debe cumplir con WCAG', async () => {
    const { container } = render(<App />);
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });

  test('debe tener contraste adecuado', async () => {
    const { container } = render(<App />);
    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: true },
      },
    });

    expect(results).toHaveNoViolations();
  });
});
```

#### **16:30 - 17:00 | E2E Testing con Playwright**

##### **Configuración Playwright:**

```javascript
// playwright.config.js
module.exports = {
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    viewport: { width: 1280, height: 720 },
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
};
```

##### **E2E Test Example:**

```javascript
// tests/e2e/user-flow.spec.js
import { test, expect } from '@playwright/test';

test.describe('User Flow Completo', () => {
  test('debe completar proceso de compra', async ({ page }) => {
    // Navegar a la página
    await page.goto('/');

    // Buscar producto
    await page.fill('[data-testid="search-input"]', 'laptop');
    await page.click('[data-testid="search-button"]');

    // Seleccionar producto
    await page.click('[data-testid="product-card"]:first-child');

    // Agregar al carrito
    await page.click('[data-testid="add-to-cart"]');

    // Verificar carrito
    await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1');

    // Ir al checkout
    await page.click('[data-testid="cart-button"]');
    await page.click('[data-testid="checkout-button"]');

    // Completar formulario
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="address-input"]', '123 Test Street');

    // Confirmar compra
    await page.click('[data-testid="confirm-order"]');

    // Verificar confirmación
    await expect(
      page.locator('[data-testid="order-confirmation"]')
    ).toBeVisible();
  });
});
```

---

## 🎯 Puntos Clave del Día

### **1. Metodología de Testing**

- **Unit Tests**: Funciones individuales
- **Integration Tests**: Interacciones entre módulos
- **E2E Tests**: Flujos completos de usuario

### **2. Herramientas Esenciales**

- **Jest**: Framework principal de testing
- **React Testing Library**: Testing de componentes
- **Supertest**: Testing de APIs
- **Playwright**: E2E testing
- **axe-core**: Accessibility testing

### **3. Quality Assurance**

- **Linting**: ESLint para calidad de código
- **Formatting**: Prettier para consistencia
- **Pre-commit hooks**: Husky para automatización
- **Performance**: Lighthouse para auditorías

### **4. Métricas de Calidad**

- **Coverage**: Mínimo 80% de cobertura
- **Performance**: Core Web Vitals
- **Accessibility**: WCAG compliance
- **Best Practices**: Security & SEO

---

## 🚀 Preparación para Producción

### **CI/CD Pipeline Básico**

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      - name: Install dependencies
        run: npm ci
      - name: Run linting
        run: npm run lint
      - name: Run tests
        run: npm test -- --coverage
      - name: Run E2E tests
        run: npm run test:e2e
      - name: Performance audit
        run: npm run lighthouse
```

### **Quality Gates**

- Tests deben pasar al 100%
- Coverage mínimo del 80%
- Linting sin errores
- Performance score > 80
- Accessibility score > 90

---

## 📊 Evaluación del Día

### **Criterios de Evaluación**

1. **Tests Unitarios** (25%)
2. **Integration Tests** (25%)
3. **Quality Tools Setup** (20%)
4. **Performance Testing** (15%)
5. **Accessibility Testing** (15%)

### **Entregables**

- Suite de tests completa
- Configuración de quality tools
- Reporte de performance
- Documentación de testing

---

## 🎓 Competencias Desarrolladas

Al finalizar este día, los estudiantes habrán desarrollado:

- **Testing Expertise**: Capacidad para implementar testing completo
- **Quality Assurance**: Herramientas para mantener código de calidad
- **Performance Optimization**: Técnicas para optimizar aplicaciones
- **Accessibility Compliance**: Cumplimiento de estándares web
- **CI/CD Implementation**: Automatización de quality gates

---

## 🔄 Integración con Días Anteriores

Este día integra conocimientos de:

- **Día 13**: Testing de integración frontend-backend
- **Día 12**: Testing de seguridad y validaciones
- **Día 11**: Testing de autenticación y autorización
- **Día 10**: Testing de estado y context

---

## 📈 Preparación WorldSkills

### **Competencias WorldSkills Cubiertas**

- **Code Quality**: Estándares de calidad profesional
- **Testing Strategy**: Estrategia completa de testing
- **Performance Optimization**: Optimización de rendimiento
- **Accessibility**: Cumplimiento de estándares
- **CI/CD**: Automatización de procesos

### **Tiempo de Desarrollo**

- **Testing Setup**: 15 minutos
- **Unit Tests**: 30 minutos por módulo
- **Integration Tests**: 45 minutos
- **Quality Tools**: 20 minutos
- **Performance Audit**: 30 minutos

¡El Día 14 preparará a los estudiantes para mantener código de calidad profesional en cualquier entorno de desarrollo!
