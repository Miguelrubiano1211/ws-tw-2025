# 🧪 Ejercicio 1: Configuración de Testing

## 📝 Descripción

Configurar el entorno de testing completo para una aplicación React/Node.js, incluyendo Jest, React Testing Library, y herramientas de quality assurance.

## 🎯 Objetivos

- Configurar Jest para aplicaciones React y Node.js
- Instalar y configurar React Testing Library
- Configurar ESLint y Prettier
- Configurar coverage reports
- Preparar estructura de archivos de testing

## 📋 Instrucciones

### Paso 1: Crear proyecto base

```bash
# Crear aplicación React
npx create-react-app testing-app
cd testing-app

# Instalar dependencias adicionales
npm install --save-dev @testing-library/jest-dom @testing-library/user-event
npm install --save-dev supertest nock msw
```

### Paso 2: Configurar Jest

Crear `jest.config.js`:

```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/reportWebVitals.js',
    '!src/**/*.test.{js,jsx}',
    '!src/setupTests.js',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx}',
  ],
};
```

### Paso 3: Configurar setupTests.js

```javascript
// src/setupTests.js
import '@testing-library/jest-dom';

// Mock global fetch
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock console.error para tests limpios
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (typeof args[0] === 'string' && args[0].includes('Warning:')) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
```

### Paso 4: Configurar ESLint

Crear `.eslintrc.js`:

```javascript
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
    'plugin:testing-library/react',
    'plugin:jest-dom/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks', 'testing-library', 'jest-dom'],
  rules: {
    'react/prop-types': 'off',
    'no-unused-vars': 'warn',
    'no-console': 'warn',
    'testing-library/await-async-query': 'error',
    'testing-library/no-await-sync-query': 'error',
    'testing-library/no-debugging-utils': 'warn',
    'testing-library/no-dom-import': 'error',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
```

### Paso 5: Configurar Prettier

Crear `.prettierrc`:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "avoid"
}
```

### Paso 6: Crear utilidades de testing

```javascript
// src/utils/test-utils.js
import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Wrapper personalizado para testing
function render(ui, options = {}) {
  function Wrapper({ children }) {
    return <BrowserRouter>{children}</BrowserRouter>;
  }

  return rtlRender(ui, { wrapper: Wrapper, ...options });
}

// Factory para crear mocks de usuarios
export const createMockUser = (overrides = {}) => ({
  id: 1,
  nombre: 'Juan Pérez',
  email: 'juan@test.com',
  role: 'user',
  ...overrides,
});

// Factory para crear mocks de productos
export const createMockProduct = (overrides = {}) => ({
  id: 1,
  nombre: 'Producto Test',
  precio: 19.99,
  descripcion: 'Descripción de prueba',
  categoria: 'Electrónicos',
  ...overrides,
});

// Helper para simular delays
export const waitFor = ms => new Promise(resolve => setTimeout(resolve, ms));

// Re-export everything
export * from '@testing-library/react';
export { render };
```

### Paso 7: Configurar scripts en package.json

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --coverage --watchAll=false",
    "lint": "eslint src/**/*.{js,jsx}",
    "lint:fix": "eslint src/**/*.{js,jsx} --fix",
    "format": "prettier --write src/**/*.{js,jsx,json,css,md}"
  }
}
```

## 📊 Verificación

### Ejecutar tests

```bash
npm test
```

### Ejecutar con coverage

```bash
npm run test:coverage
```

### Verificar linting

```bash
npm run lint
```

### Formatear código

```bash
npm run format
```

## 🎯 Criterios de Evaluación

### Configuración (40 puntos)

- [ ] Jest configurado correctamente (10 pts)
- [ ] React Testing Library funcionando (10 pts)
- [ ] ESLint configurado con reglas apropiadas (10 pts)
- [ ] Prettier configurado (10 pts)

### Estructura (30 puntos)

- [ ] Archivos de configuración presentes (10 pts)
- [ ] setupTests.js configurado (10 pts)
- [ ] Utilidades de testing creadas (10 pts)

### Funcionalidad (30 puntos)

- [ ] Tests corren sin errores (10 pts)
- [ ] Coverage reports funcionando (10 pts)
- [ ] Linting y formatting funcionando (10 pts)

## 📚 Recursos Adicionales

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [ESLint Rules](https://eslint.org/docs/rules/)

## 🔧 Solución de Problemas

### Error: "Cannot find module 'react-scripts'"

```bash
npm install react-scripts
```

### Error: "Jest encountered an unexpected token"

Verificar que babel está configurado en package.json:

```json
{
  "babel": {
    "presets": ["react-app"]
  }
}
```

### Warning: "act(...) is not supported"

Usar `waitFor` de React Testing Library:

```javascript
import { waitFor } from '@testing-library/react';
```
