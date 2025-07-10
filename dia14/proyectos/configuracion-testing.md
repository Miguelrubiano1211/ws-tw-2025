# 🧪 Configuración de Testing - E-commerce Project

## 📋 Archivos de Configuración

### **Jest Configuration**

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapping: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/reportWebVitals.js',
    '!src/setupTests.js',
    '!src/**/*.stories.{js,jsx}',
    '!src/**/index.js',
  ],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx}',
    '<rootDir>/tests/**/*.{test,spec}.{js,jsx}',
  ],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
  verbose: true,
};
```

### **React Testing Library Setup**

```javascript
// src/setupTests.js
import '@testing-library/jest-dom';
import { server } from './mocks/server';

// Configurar MSW
beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

// Mock de localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock de sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;

// Mock de fetch
global.fetch = jest.fn();

// Mock de IntersectionObserver
global.IntersectionObserver = jest.fn(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  unobserve: jest.fn(),
}));

// Mock de ResizeObserver
global.ResizeObserver = jest.fn(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  unobserve: jest.fn(),
}));

// Configurar console.error para tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
```

### **ESLint Configuration**

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
    'plugin:testing-library/react',
    'plugin:jest-dom/recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
    'react-hooks',
    'jsx-a11y',
    'import',
    'testing-library',
    'jest-dom',
  ],
  rules: {
    'react/prop-types': 'error',
    'react/react-in-jsx-scope': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'jsx-a11y/anchor-is-valid': 'error',
    'jsx-a11y/img-redundant-alt': 'error',
    'jsx-a11y/no-autofocus': 'error',
    'no-unused-vars': 'error',
    'no-console': 'warn',
    'prefer-const': 'error',
    'no-var': 'error',
    'testing-library/await-async-query': 'error',
    'testing-library/no-await-sync-query': 'error',
    'testing-library/no-debugging-utils': 'warn',
    'testing-library/no-dom-import': 'error',
    'jest-dom/prefer-checked': 'error',
    'jest-dom/prefer-enabled-disabled': 'error',
    'jest-dom/prefer-required': 'error',
    'jest-dom/prefer-to-have-attribute': 'error',
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
  overrides: [
    {
      files: ['**/*.test.js', '**/*.test.jsx', '**/*.spec.js', '**/*.spec.jsx'],
      env: {
        jest: true,
      },
      rules: {
        'testing-library/no-debugging-utils': 'off',
      },
    },
  ],
};
```

### **Prettier Configuration**

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "jsxSingleQuote": true,
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "avoid",
  "endOfLine": "lf",
  "quoteProps": "as-needed",
  "proseWrap": "preserve",
  "htmlWhitespaceSensitivity": "css",
  "insertPragma": false,
  "requirePragma": false
}
```

### **Playwright Configuration**

```javascript
// playwright.config.js
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html'], ['junit', { outputFile: 'test-results/results.xml' }]],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
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
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### **Package.json Scripts**

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --watchAll=false",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed",
    "test:a11y": "jest --testPathPattern=accessibility",
    "lint": "eslint src/ --ext .js,.jsx",
    "lint:fix": "eslint src/ --ext .js,.jsx --fix",
    "format": "prettier --write src/**/*.{js,jsx,css,md}",
    "format:check": "prettier --check src/**/*.{js,jsx,css,md}",
    "lighthouse": "lhci autorun",
    "build:analyze": "npm run build && npx webpack-bundle-analyzer build/static/js/*.js",
    "test:all": "npm run lint && npm run test:ci && npm run test:e2e && npm run lighthouse"
  }
}
```

### **Husky Configuration**

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm run test:ci"
    }
  },
  "lint-staged": {
    "*.{js,jsx}": [
      "eslint --fix",
      "prettier --write",
      "jest --findRelatedTests --bail"
    ],
    "*.{css,scss,md,json}": ["prettier --write"]
  }
}
```

### **GitHub Actions Workflow**

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

    strategy:
      matrix:
        node-version: [16.x, 18.x]

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linting
        run: npm run lint

      - name: Run unit tests
        run: npm run test:ci

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          file: ./coverage/lcov.info

      - name: Install Playwright Browsers
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload E2E test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30

      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli@0.11.x
          lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}

      - name: Build application
        run: npm run build

      - name: Deploy to staging
        if: github.ref == 'refs/heads/develop'
        run: |
          echo "Deploying to staging environment"
          # Add your deployment commands here

      - name: Deploy to production
        if: github.ref == 'refs/heads/main'
        run: |
          echo "Deploying to production environment"
          # Add your deployment commands here

  security:
    runs-on: ubuntu-latest
    needs: test

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Run security audit
        run: npm audit --audit-level moderate

      - name: Run OWASP ZAP Baseline Scan
        uses: zaproxy/action-baseline@v0.7.0
        with:
          target: 'http://localhost:3000'
```

### **Lighthouse CI Configuration**

```javascript
// lighthouserc.js
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
        chromeFlags: '--no-sandbox --disable-setuid-sandbox',
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
        'total-blocking-time': ['warn', { maxNumericValue: 500 }],
        'speed-index': ['warn', { maxNumericValue: 4000 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
```

### **MSW Mock Setup**

```javascript
// src/mocks/handlers.js
import { rest } from 'msw';

export const handlers = [
  // Products API
  rest.get('/api/products', (req, res, ctx) => {
    const page = parseInt(req.url.searchParams.get('page') || '1');
    const limit = parseInt(req.url.searchParams.get('limit') || '10');
    const search = req.url.searchParams.get('search') || '';

    const mockProducts = [
      {
        id: '1',
        name: 'Gaming Laptop',
        price: 999.99,
        originalPrice: 1199.99,
        description: 'High-performance gaming laptop',
        image: 'https://example.com/laptop.jpg',
        category: 'electronics',
      },
      {
        id: '2',
        name: 'Wireless Mouse',
        price: 29.99,
        description: 'Ergonomic wireless mouse',
        image: 'https://example.com/mouse.jpg',
        category: 'electronics',
      },
    ];

    let filteredProducts = mockProducts;

    if (search) {
      filteredProducts = mockProducts.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    return res(
      ctx.json({
        products: paginatedProducts,
        pagination: {
          page,
          limit,
          total: filteredProducts.length,
          totalPages: Math.ceil(filteredProducts.length / limit),
        },
      })
    );
  }),

  rest.post('/api/products', (req, res, ctx) => {
    const newProduct = req.body;

    if (!newProduct.name || !newProduct.price) {
      return res(
        ctx.status(400),
        ctx.json({
          error: 'Name and price are required',
        })
      );
    }

    return res(
      ctx.status(201),
      ctx.json({
        id: Date.now().toString(),
        ...newProduct,
      })
    );
  }),

  // Cart API
  rest.get('/api/cart', (req, res, ctx) => {
    return res(
      ctx.json({
        items: [
          {
            id: '1',
            productId: '1',
            quantity: 2,
            product: {
              id: '1',
              name: 'Gaming Laptop',
              price: 999.99,
              image: 'https://example.com/laptop.jpg',
            },
          },
        ],
        total: 1999.98,
      })
    );
  }),

  rest.post('/api/cart/add', (req, res, ctx) => {
    const { productId, quantity } = req.body;

    return res(
      ctx.json({
        message: 'Product added to cart',
        item: {
          id: Date.now().toString(),
          productId,
          quantity,
        },
      })
    );
  }),

  // Auth API
  rest.post('/api/auth/login', (req, res, ctx) => {
    const { email, password } = req.body;

    if (email === 'test@example.com' && password === 'password123') {
      return res(
        ctx.json({
          token: 'mock-jwt-token',
          user: {
            id: '1',
            email: 'test@example.com',
            name: 'Test User',
          },
        })
      );
    }

    return res(
      ctx.status(401),
      ctx.json({
        error: 'Invalid credentials',
      })
    );
  }),
];
```

```javascript
// src/mocks/server.js
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

```javascript
// src/mocks/browser.js
import { setupWorker } from 'msw';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);
```

### **Test Utilities**

```javascript
// tests/utils/test-utils.js
import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from '../../src/context/CartContext';
import { AuthProvider } from '../../src/context/AuthContext';

// Custom render function with providers
function render(ui, { route = '/', ...renderOptions } = {}) {
  window.history.pushState({}, 'Test page', route);

  function Wrapper({ children }) {
    return (
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </BrowserRouter>
    );
  }

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// Mock user for testing
export const mockUser = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  token: 'mock-jwt-token',
};

// Mock product for testing
export const mockProduct = {
  id: '1',
  name: 'Test Product',
  price: 99.99,
  originalPrice: 119.99,
  description: 'Test product description',
  image: 'https://example.com/product.jpg',
  category: 'electronics',
};

// Common test helpers
export const fillForm = async (user, formData) => {
  for (const [field, value] of Object.entries(formData)) {
    const input = screen.getByLabelText(new RegExp(field, 'i'));
    await user.clear(input);
    await user.type(input, value);
  }
};

export const waitForLoadingToFinish = async () => {
  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i), {
    timeout: 3000,
  });
};

// Re-export everything
export * from '@testing-library/react';
export { render };
```

### **Accessibility Test Helpers**

```javascript
// tests/utils/a11y-utils.js
import { axe } from 'jest-axe';

export const testA11y = async (component, rules = {}) => {
  const results = await axe(component, {
    rules: {
      // Disable some rules for testing if needed
      'color-contrast': { enabled: true },
      keyboard: { enabled: true },
      ...rules,
    },
  });

  expect(results).toHaveNoViolations();
};

export const testKeyboardNavigation = async (user, container) => {
  // Test Tab navigation
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  for (let i = 0; i < focusableElements.length; i++) {
    await user.tab();
    expect(focusableElements[i]).toHaveFocus();
  }
};

export const testAriaLabels = container => {
  // Check for missing aria-labels
  const elementsNeedingLabels = container.querySelectorAll(
    'button:not([aria-label]):not([aria-labelledby]), input:not([aria-label]):not([aria-labelledby])'
  );

  elementsNeedingLabels.forEach(element => {
    expect(element).toHaveAccessibleName();
  });
};
```

## 🎯 Uso de las Configuraciones

### **Comandos de Testing**

```bash
# Instalar dependencias
npm install

# Ejecutar todos los tests
npm run test:all

# Tests unitarios
npm test

# Tests con coverage
npm run test:coverage

# Tests E2E
npm run test:e2e

# Accessibility tests
npm run test:a11y

# Linting
npm run lint

# Formateo
npm run format

# Lighthouse audit
npm run lighthouse
```

### **Estructura de Archivos**

```
src/
├── components/
│   ├── ProductCard/
│   │   ├── ProductCard.jsx
│   │   ├── ProductCard.test.jsx
│   │   └── ProductCard.module.css
│   └── ...
├── services/
│   ├── api.js
│   ├── api.test.js
│   └── ...
├── utils/
│   ├── helpers.js
│   ├── helpers.test.js
│   └── ...
tests/
├── e2e/
│   ├── shopping-flow.spec.js
│   └── ...
├── integration/
│   ├── api.test.js
│   └── ...
├── accessibility/
│   ├── wcag.test.js
│   └── ...
└── utils/
    ├── test-utils.js
    └── a11y-utils.js
```

¡Esta configuración proporciona una base sólida para implementar testing de calidad profesional!
