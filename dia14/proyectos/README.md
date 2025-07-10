# 🧪 Proyecto Integrador - Día 14: Testing y Quality Assurance

## 📋 Descripción del Proyecto

Implementar una **suite completa de testing y quality assurance** para una aplicación e-commerce, cubriendo desde unit tests hasta performance testing y accessibility compliance.

---

## 🎯 Objetivos del Proyecto

### **Objetivo Principal**

Desarrollar un sistema de testing robusto que garantice la calidad, rendimiento y accesibilidad de una aplicación web compleja.

### **Objetivos Específicos**

1. **Unit Testing**: Cobertura del 85% mínimo
2. **Integration Testing**: Tests de API y base de datos
3. **Component Testing**: Tests de componentes React
4. **E2E Testing**: Flujos críticos de usuario
5. **Performance Testing**: Web Vitals y Lighthouse
6. **Accessibility Testing**: WCAG 2.1 AA compliance
7. **Quality Tools**: Linting, formatting, y CI/CD

---

## 🏗️ Arquitectura del Proyecto

### **Estructura de Carpetas**

```
testing-ecommerce/
├── src/
│   ├── components/
│   │   ├── ProductCard/
│   │   ├── ShoppingCart/
│   │   ├── UserProfile/
│   │   └── SearchBar/
│   ├── services/
│   │   ├── api.js
│   │   ├── auth.js
│   │   └── cart.js
│   ├── utils/
│   │   ├── helpers.js
│   │   ├── validation.js
│   │   └── formatters.js
│   └── hooks/
│       ├── useCart.js
│       ├── useAuth.js
│       └── useProducts.js
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   └── accessibility/
├── coverage/
├── lighthouse/
└── config/
    ├── jest.config.js
    ├── playwright.config.js
    └── eslint.config.js
```

### **Stack Tecnológico**

- **Frontend**: React 18, React Router, Context API
- **Backend**: Express.js, MongoDB, JWT
- **Testing**: Jest, React Testing Library, Supertest, Playwright
- **Quality**: ESLint, Prettier, Husky, SonarQube
- **Performance**: Lighthouse, Web Vitals, Bundle Analyzer
- **Accessibility**: axe-core, jest-axe, NVDA/JAWS

---

## 📝 Especificaciones Técnicas

### **1. Unit Testing Requirements**

#### **Funciones Utilitarias**

```javascript
// src/utils/helpers.js
export const formatPrice = price => {
  if (typeof price !== 'number' || price < 0) {
    throw new Error('Price must be a positive number');
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

export const calculateDiscount = (price, discountPercent) => {
  if (price < 0 || discountPercent < 0 || discountPercent > 100) {
    throw new Error('Invalid price or discount percentage');
  }
  return price * (1 - discountPercent / 100);
};

export const validateEmail = email => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};
```

#### **Tests Unitarios Requeridos**

```javascript
// tests/unit/helpers.test.js
import {
  formatPrice,
  calculateDiscount,
  validateEmail,
  debounce,
} from '../../src/utils/helpers';

describe('Utility Functions', () => {
  describe('formatPrice', () => {
    test('should format valid prices correctly', () => {
      expect(formatPrice(99.99)).toBe('$99.99');
      expect(formatPrice(0)).toBe('$0.00');
      expect(formatPrice(1000)).toBe('$1,000.00');
    });

    test('should throw error for invalid prices', () => {
      expect(() => formatPrice(-1)).toThrow('Price must be a positive number');
      expect(() => formatPrice('invalid')).toThrow(
        'Price must be a positive number'
      );
    });
  });

  describe('calculateDiscount', () => {
    test('should calculate discounts correctly', () => {
      expect(calculateDiscount(100, 20)).toBe(80);
      expect(calculateDiscount(50, 0)).toBe(50);
      expect(calculateDiscount(200, 50)).toBe(100);
    });

    test('should handle edge cases', () => {
      expect(() => calculateDiscount(-10, 20)).toThrow();
      expect(() => calculateDiscount(100, -5)).toThrow();
      expect(() => calculateDiscount(100, 101)).toThrow();
    });
  });

  describe('validateEmail', () => {
    test('should validate correct emails', () => {
      expect(validateEmail('user@example.com')).toBe(true);
      expect(validateEmail('test.email+tag@domain.co.uk')).toBe(true);
    });

    test('should reject invalid emails', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('debounce', () => {
    jest.useFakeTimers();

    test('should debounce function calls', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });
});
```

### **2. React Component Testing**

#### **Componente ProductCard**

```javascript
// src/components/ProductCard/ProductCard.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { formatPrice } from '../../utils/helpers';

const ProductCard = ({
  product,
  onAddToCart,
  onViewDetails,
  loading = false,
}) => {
  const handleAddToCart = () => {
    if (loading) return;
    onAddToCart(product);
  };

  const handleViewDetails = () => {
    onViewDetails(product.id);
  };

  return (
    <div
      className="product-card"
      data-testid="product-card">
      <img
        src={product.image}
        alt={product.name}
        className="product-image"
      />
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-price">
          {product.originalPrice && product.originalPrice > product.price && (
            <span
              className="original-price"
              data-testid="original-price">
              {formatPrice(product.originalPrice)}
            </span>
          )}
          <span
            className="current-price"
            data-testid="current-price">
            {formatPrice(product.price)}
          </span>
        </div>
        <div className="product-actions">
          <button
            onClick={handleViewDetails}
            className="btn-secondary"
            data-testid="view-details-btn">
            Ver Detalles
          </button>
          <button
            onClick={handleAddToCart}
            disabled={loading}
            className="btn-primary"
            data-testid="add-to-cart-btn">
            {loading ? 'Agregando...' : 'Agregar al Carrito'}
          </button>
        </div>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    originalPrice: PropTypes.number,
    image: PropTypes.string.isRequired,
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired,
  onViewDetails: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default ProductCard;
```

#### **Tests de Componente**

```javascript
// tests/unit/ProductCard.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductCard from '../../src/components/ProductCard/ProductCard';

const mockProduct = {
  id: '1',
  name: 'Laptop Gaming',
  description: 'Laptop de alta gama para gaming',
  price: 999.99,
  originalPrice: 1199.99,
  image: 'https://example.com/laptop.jpg',
};

describe('ProductCard', () => {
  const mockOnAddToCart = jest.fn();
  const mockOnViewDetails = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render product information correctly', () => {
    render(
      <ProductCard
        product={mockProduct}
        onAddToCart={mockOnAddToCart}
        onViewDetails={mockOnViewDetails}
      />
    );

    expect(screen.getByText('Laptop Gaming')).toBeInTheDocument();
    expect(
      screen.getByText('Laptop de alta gama para gaming')
    ).toBeInTheDocument();
    expect(screen.getByTestId('current-price')).toHaveTextContent('$999.99');
    expect(screen.getByTestId('original-price')).toHaveTextContent('$1,199.99');
  });

  test('should handle add to cart click', async () => {
    const user = userEvent.setup();

    render(
      <ProductCard
        product={mockProduct}
        onAddToCart={mockOnAddToCart}
        onViewDetails={mockOnViewDetails}
      />
    );

    const addToCartBtn = screen.getByTestId('add-to-cart-btn');
    await user.click(addToCartBtn);

    expect(mockOnAddToCart).toHaveBeenCalledWith(mockProduct);
  });

  test('should handle view details click', async () => {
    const user = userEvent.setup();

    render(
      <ProductCard
        product={mockProduct}
        onAddToCart={mockOnAddToCart}
        onViewDetails={mockOnViewDetails}
      />
    );

    const viewDetailsBtn = screen.getByTestId('view-details-btn');
    await user.click(viewDetailsBtn);

    expect(mockOnViewDetails).toHaveBeenCalledWith(mockProduct.id);
  });

  test('should disable add to cart button when loading', () => {
    render(
      <ProductCard
        product={mockProduct}
        onAddToCart={mockOnAddToCart}
        onViewDetails={mockOnViewDetails}
        loading={true}
      />
    );

    const addToCartBtn = screen.getByTestId('add-to-cart-btn');
    expect(addToCartBtn).toBeDisabled();
    expect(addToCartBtn).toHaveTextContent('Agregando...');
  });

  test('should not show original price if not discounted', () => {
    const productWithoutDiscount = {
      ...mockProduct,
      originalPrice: undefined,
    };

    render(
      <ProductCard
        product={productWithoutDiscount}
        onAddToCart={mockOnAddToCart}
        onViewDetails={mockOnViewDetails}
      />
    );

    expect(screen.queryByTestId('original-price')).not.toBeInTheDocument();
  });
});
```

### **3. Integration Testing**

#### **API Testing con Supertest**

```javascript
// tests/integration/products.test.js
const request = require('supertest');
const app = require('../../src/app');
const { setupTestDB, cleanupTestDB } = require('../helpers/db');

describe('Products API', () => {
  beforeAll(async () => {
    await setupTestDB();
  });

  afterAll(async () => {
    await cleanupTestDB();
  });

  beforeEach(async () => {
    // Limpiar datos de prueba
    await request(app).delete('/api/test/cleanup');
  });

  describe('GET /api/products', () => {
    test('should return products with pagination', async () => {
      // Crear productos de prueba
      await request(app).post('/api/products').send({
        name: 'Test Product 1',
        price: 99.99,
        description: 'Test description',
      });

      const response = await request(app)
        .get('/api/products?page=1&limit=10')
        .expect(200);

      expect(response.body).toHaveProperty('products');
      expect(response.body).toHaveProperty('pagination');
      expect(response.body.pagination).toHaveProperty('page', 1);
      expect(response.body.pagination).toHaveProperty('limit', 10);
      expect(Array.isArray(response.body.products)).toBe(true);
    });

    test('should filter products by category', async () => {
      await request(app).post('/api/products').send({
        name: 'Electronics Product',
        price: 199.99,
        category: 'electronics',
      });

      const response = await request(app)
        .get('/api/products?category=electronics')
        .expect(200);

      expect(response.body.products).toHaveLength(1);
      expect(response.body.products[0].category).toBe('electronics');
    });

    test('should search products by name', async () => {
      await request(app).post('/api/products').send({
        name: 'Gaming Laptop',
        price: 999.99,
      });

      const response = await request(app)
        .get('/api/products?search=gaming')
        .expect(200);

      expect(response.body.products).toHaveLength(1);
      expect(response.body.products[0].name).toContain('Gaming');
    });
  });

  describe('POST /api/products', () => {
    test('should create new product', async () => {
      const newProduct = {
        name: 'New Product',
        price: 149.99,
        description: 'New product description',
        category: 'electronics',
      };

      const response = await request(app)
        .post('/api/products')
        .send(newProduct)
        .expect(201);

      expect(response.body.name).toBe(newProduct.name);
      expect(response.body.price).toBe(newProduct.price);
      expect(response.body).toHaveProperty('id');
    });

    test('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/products')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('required');
    });

    test('should validate price format', async () => {
      const response = await request(app)
        .post('/api/products')
        .send({
          name: 'Test Product',
          price: 'invalid-price',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('price');
    });
  });
});
```

### **4. E2E Testing con Playwright**

#### **User Journey Testing**

```javascript
// tests/e2e/shopping-flow.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Shopping Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Setup inicial
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('complete shopping journey', async ({ page }) => {
    // 1. Buscar producto
    await page.fill('[data-testid="search-input"]', 'laptop');
    await page.click('[data-testid="search-button"]');
    await page.waitForSelector('[data-testid="product-card"]');

    // 2. Seleccionar producto
    await page.click('[data-testid="product-card"]:first-child');
    await page.waitForSelector('[data-testid="product-details"]');

    // 3. Agregar al carrito
    await page.click('[data-testid="add-to-cart-btn"]');
    await expect(page.locator('[data-testid="cart-count"]')).toContainText('1');

    // 4. Ver carrito
    await page.click('[data-testid="cart-button"]');
    await page.waitForSelector('[data-testid="cart-items"]');

    // 5. Proceder al checkout
    await page.click('[data-testid="checkout-button"]');
    await page.waitForSelector('[data-testid="checkout-form"]');

    // 6. Completar información de envío
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="address-input"]', '123 Test Street');
    await page.fill('[data-testid="city-input"]', 'Test City');
    await page.fill('[data-testid="zip-input"]', '12345');

    // 7. Seleccionar método de pago
    await page.click('[data-testid="payment-method-card"]');
    await page.fill('[data-testid="card-number"]', '4111111111111111');
    await page.fill('[data-testid="card-expiry"]', '12/25');
    await page.fill('[data-testid="card-cvc"]', '123');

    // 8. Confirmar orden
    await page.click('[data-testid="place-order-button"]');
    await page.waitForSelector('[data-testid="order-confirmation"]');

    // 9. Verificar confirmación
    await expect(
      page.locator('[data-testid="order-confirmation"]')
    ).toBeVisible();
    await expect(page.locator('[data-testid="order-number"]')).toBeVisible();
  });

  test('should handle product filtering', async ({ page }) => {
    // Aplicar filtros
    await page.click('[data-testid="filter-category-electronics"]');
    await page.click('[data-testid="filter-price-100-500"]');
    await page.click('[data-testid="apply-filters"]');

    // Verificar resultados
    await page.waitForSelector('[data-testid="product-card"]');
    const productCards = await page
      .locator('[data-testid="product-card"]')
      .count();
    expect(productCards).toBeGreaterThan(0);

    // Verificar que los productos mostrados cumplen con los filtros
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await expect(firstProduct).toBeVisible();
  });

  test('should handle responsive design', async ({ page }) => {
    // Probar en mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();

    // Verificar que el menú móvil funciona
    await page.click('[data-testid="mobile-menu-toggle"]');
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();

    // Probar en tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();

    // Verificar layout de tablet
    await expect(page.locator('[data-testid="product-grid"]')).toBeVisible();
  });
});
```

### **5. Performance Testing**

#### **Lighthouse Configuration**

```javascript
// lighthouse.config.js
module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000',
        'http://localhost:3000/products',
        'http://localhost:3000/cart',
        'http://localhost:3000/checkout',
      ],
      numberOfRuns: 3,
      settings: {
        preset: 'desktop',
        chromeFlags: '--no-sandbox',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.8 }],
        'categories:seo': ['error', { minScore: 0.8 }],
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 4000 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
```

#### **Web Vitals Testing**

```javascript
// tests/performance/web-vitals.test.js
const { test, expect } = require('@playwright/test');

test.describe('Web Vitals Performance', () => {
  test('should meet Core Web Vitals thresholds', async ({ page }) => {
    // Navegar a la página
    await page.goto('/', { waitUntil: 'networkidle' });

    // Medir Web Vitals
    const webVitals = await page.evaluate(() => {
      return new Promise(resolve => {
        const vitals = {};

        // Importar web-vitals
        import('web-vitals').then(({ onCLS, onFID, onLCP, onFCP, onTTFB }) => {
          let metricsCollected = 0;
          const totalMetrics = 5;

          const collectMetric = metric => {
            vitals[metric.name] = metric.value;
            metricsCollected++;

            if (metricsCollected === totalMetrics) {
              resolve(vitals);
            }
          };

          onCLS(collectMetric);
          onFID(collectMetric);
          onLCP(collectMetric);
          onFCP(collectMetric);
          onTTFB(collectMetric);
        });
      });
    });

    // Verificar thresholds
    expect(webVitals.LCP).toBeLessThan(2500); // Good: < 2.5s
    expect(webVitals.FID).toBeLessThan(100); // Good: < 100ms
    expect(webVitals.CLS).toBeLessThan(0.1); // Good: < 0.1
    expect(webVitals.FCP).toBeLessThan(1800); // Good: < 1.8s
    expect(webVitals.TTFB).toBeLessThan(800); // Good: < 800ms
  });

  test('should load images efficiently', async ({ page }) => {
    await page.goto('/products');

    // Verificar lazy loading
    const images = await page.locator('img[loading="lazy"]').count();
    expect(images).toBeGreaterThan(0);

    // Verificar que las imágenes tienen atributos alt
    const imagesWithoutAlt = await page.locator('img:not([alt])').count();
    expect(imagesWithoutAlt).toBe(0);
  });
});
```

### **6. Accessibility Testing**

#### **WCAG Compliance Testing**

```javascript
// tests/accessibility/wcag.test.js
const { axe, toHaveNoViolations } = require('jest-axe');
const { render } = require('@testing-library/react');
const { BrowserRouter } = require('react-router-dom');
const App = require('../../src/App');

expect.extend(toHaveNoViolations);

describe('WCAG Compliance', () => {
  test('should have no accessibility violations on homepage', async () => {
    const { container } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('should have proper color contrast', async () => {
    const { container } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: true },
        'color-contrast-enhanced': { enabled: true },
      },
    });

    expect(results).toHaveNoViolations();
  });

  test('should have proper keyboard navigation', async () => {
    const { container } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    const results = await axe(container, {
      rules: {
        keyboard: { enabled: true },
        'focus-order-semantics': { enabled: true },
      },
    });

    expect(results).toHaveNoViolations();
  });

  test('should have proper ARIA labels', async () => {
    const { container } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    const results = await axe(container, {
      rules: {
        'aria-valid-attr': { enabled: true },
        'aria-required-attr': { enabled: true },
        'aria-roles': { enabled: true },
      },
    });

    expect(results).toHaveNoViolations();
  });
});
```

---

## 📊 Criterios de Evaluación

### **1. Unit Testing (25%)**

- **Cobertura de código**: Mínimo 85%
- **Calidad de tests**: Tests significativos, no solo para cobertura
- **Edge cases**: Manejo de casos límite y errores
- **Mocking**: Uso apropiado de mocks y spies

### **2. Integration Testing (25%)**

- **API Testing**: Cobertura completa de endpoints
- **Database Testing**: Tests de persistencia y queries
- **Error Handling**: Manejo de errores en integraciones
- **Performance**: Tests de rendimiento básicos

### **3. Component Testing (20%)**

- **React Testing Library**: Uso de best practices
- **User Interactions**: Testing de eventos y interacciones
- **Props Testing**: Validación de props y PropTypes
- **State Management**: Testing de estado local y global

### **4. E2E Testing (15%)**

- **Critical Paths**: Tests de flujos críticos
- **Cross-browser**: Compatibilidad entre navegadores
- **Mobile Testing**: Responsive design testing
- **Performance**: Tests de rendimiento en E2E

### **5. Quality Assurance (15%)**

- **Code Quality**: Setup de ESLint y Prettier
- **Pre-commit Hooks**: Configuración de Husky
- **CI/CD**: Pipeline básico implementado
- **Documentation**: Documentación de tests

---

## 🚀 Instrucciones de Implementación

### **Fase 1: Setup Initial (30 min)**

1. Crear estructura de carpetas
2. Instalar dependencias de testing
3. Configurar Jest y React Testing Library
4. Configurar ESLint y Prettier

### **Fase 2: Unit Testing (90 min)**

1. Implementar tests de utilidades
2. Tests de servicios y APIs
3. Tests de hooks personalizados
4. Alcanzar 85% de cobertura

### **Fase 3: Component Testing (60 min)**

1. Tests de componentes principales
2. Tests de interacciones de usuario
3. Tests de manejo de estado
4. Tests de error boundaries

### **Fase 4: Integration Testing (60 min)**

1. Tests de API endpoints
2. Tests de base de datos
3. Tests de autenticación
4. Tests de flujos completos

### **Fase 5: E2E Testing (45 min)**

1. Configurar Playwright
2. Implementar user journeys
3. Tests de responsive design
4. Tests de performance

### **Fase 6: Quality Assurance (45 min)**

1. Configurar quality tools
2. Implementar pre-commit hooks
3. Configurar CI/CD básico
4. Documentar estrategia de testing

---

## 📚 Recursos Adicionales

### **Documentación**

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [axe-core Rules](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)

### **Herramientas**

- **Coverage Reports**: Istanbul/NYC
- **Visual Testing**: Percy, Chromatic
- **Performance**: Lighthouse, WebPageTest
- **Accessibility**: WAVE, aXe DevTools

### **Best Practices**

- Write tests first (TDD approach)
- Test behavior, not implementation
- Use descriptive test names
- Keep tests simple and focused
- Mock external dependencies
- Test edge cases and error scenarios

---

## 🎯 Entregables

### **Entregables Obligatorios**

1. **Test Suite Completa** - Todos los tipos de tests implementados
2. **Coverage Report** - Reporte de cobertura ≥85%
3. **Performance Report** - Lighthouse audit results
4. **Accessibility Report** - WCAG compliance report
5. **Quality Configuration** - ESLint, Prettier, Husky setup
6. **CI/CD Pipeline** - GitHub Actions workflow
7. **Documentation** - README con estrategia de testing

### **Entregables Opcionales**

- Visual regression tests
- Load testing with Artillery
- Security testing with OWASP ZAP
- Cross-browser testing matrix
- Performance monitoring setup

---

## 🏆 Criterios de Éxito

### **Mínimo Viable**

- [ ] Unit tests con 80% cobertura
- [ ] Component tests para componentes principales
- [ ] Integration tests para API crítica
- [ ] E2E test para flujo principal
- [ ] Accessibility compliance básica

### **Competencia WorldSkills**

- [ ] Unit tests con 90% cobertura
- [ ] Component tests completos
- [ ] Integration tests exhaustivos
- [ ] E2E tests para todos los flujos
- [ ] Performance optimization
- [ ] Full accessibility compliance
- [ ] CI/CD pipeline funcional

¡Este proyecto prepara a los estudiantes para implementar testing de calidad profesional en cualquier aplicación web!
