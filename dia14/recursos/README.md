# 📚 Recursos - Día 14: Testing y Quality Assurance

## 🎯 Recursos Esenciales

### **📖 Documentación Oficial**

#### **Testing Frameworks**

- **Jest**: [https://jestjs.io/docs/getting-started](https://jestjs.io/docs/getting-started)
- **React Testing Library**: [https://testing-library.com/docs/react-testing-library/intro](https://testing-library.com/docs/react-testing-library/intro)
- **Playwright**: [https://playwright.dev/docs/intro](https://playwright.dev/docs/intro)
- **Supertest**: [https://github.com/visionmedia/supertest](https://github.com/visionmedia/supertest)

#### **Quality Assurance Tools**

- **ESLint**: [https://eslint.org/docs/user-guide/getting-started](https://eslint.org/docs/user-guide/getting-started)
- **Prettier**: [https://prettier.io/docs/en/index.html](https://prettier.io/docs/en/index.html)
- **Husky**: [https://typicode.github.io/husky/](https://typicode.github.io/husky/)
- **SonarQube**: [https://docs.sonarqube.org/latest/](https://docs.sonarqube.org/latest/)

#### **Performance & Accessibility**

- **Lighthouse**: [https://developers.google.com/web/tools/lighthouse](https://developers.google.com/web/tools/lighthouse)
- **Web Vitals**: [https://web.dev/vitals/](https://web.dev/vitals/)
- **axe-core**: [https://github.com/dequelabs/axe-core](https://github.com/dequelabs/axe-core)
- **WCAG Guidelines**: [https://www.w3.org/WAI/WCAG21/quickref/](https://www.w3.org/WAI/WCAG21/quickref/)

---

## 🛠️ Herramientas de Testing

### **Testing Frameworks**

#### **Jest - Framework Principal**

```bash
# Instalación
npm install --save-dev jest

# Configuración básica
npm install --save-dev @testing-library/jest-dom
```

**Características:**

- Zero configuration
- Snapshot testing
- Mocking y spying
- Code coverage
- Parallel testing

#### **React Testing Library**

```bash
# Instalación
npm install --save-dev @testing-library/react @testing-library/user-event
```

**Filosofía:**

- Test behavior, not implementation
- Accessible queries
- User-centric testing
- No shallow rendering

#### **Playwright - E2E Testing**

```bash
# Instalación
npm install --save-dev @playwright/test

# Configuración inicial
npx playwright install
```

**Ventajas:**

- Multi-browser support
- Auto-wait functionality
- Network interception
- Visual comparisons

### **Mocking y Stubbing**

#### **MSW (Mock Service Worker)**

```bash
# Instalación
npm install --save-dev msw
```

**Ejemplo de configuración:**

```javascript
// src/mocks/handlers.js
import { rest } from 'msw';

export const handlers = [
  rest.get('/api/products', (req, res, ctx) => {
    return res(
      ctx.json({
        products: [
          { id: '1', name: 'Product 1', price: 99.99 },
          { id: '2', name: 'Product 2', price: 149.99 },
        ],
      })
    );
  }),
];
```

#### **Sinon.js - Spies y Stubs**

```bash
# Instalación
npm install --save-dev sinon
```

**Uso:**

```javascript
import sinon from 'sinon';

// Spy en función
const spy = sinon.spy(console, 'log');

// Stub con retorno específico
const stub = sinon
  .stub(apiService, 'getData')
  .returns(Promise.resolve(mockData));
```

---

## 📊 Code Coverage

### **Coverage Tools**

#### **Istanbul/NYC**

```bash
# Instalación
npm install --save-dev nyc
```

**Configuración:**

```json
{
  "nyc": {
    "reporter": ["html", "text", "lcov"],
    "exclude": ["**/*.test.js", "**/*.spec.js"],
    "threshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

#### **Codecov Integration**

```yaml
# .github/workflows/ci.yml
- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v3
  with:
    token: ${{ secrets.CODECOV_TOKEN }}
    file: ./coverage/lcov.info
```

### **Coverage Metrics**

#### **Tipos de Coverage**

- **Statement Coverage**: Porcentaje de declaraciones ejecutadas
- **Branch Coverage**: Porcentaje de ramas ejecutadas
- **Function Coverage**: Porcentaje de funciones llamadas
- **Line Coverage**: Porcentaje de líneas ejecutadas

#### **Thresholds Recomendados**

```javascript
// jest.config.js
module.exports = {
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
    './src/components/': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
};
```

---

## 🔍 Quality Assurance

### **Linting y Formatting**

#### **ESLint Configuration**

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:testing-library/react',
  ],
  rules: {
    'react/prop-types': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'jsx-a11y/anchor-is-valid': 'error',
    'testing-library/no-debugging-utils': 'warn',
  },
};
```

#### **Prettier Integration**

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

### **Pre-commit Hooks**

#### **Husky + lint-staged**

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{js,jsx}": [
      "eslint --fix",
      "prettier --write",
      "jest --findRelatedTests --bail"
    ]
  }
}
```

#### **Commitizen**

```bash
# Instalación
npm install --save-dev commitizen cz-conventional-changelog

# Configuración
npx commitizen init cz-conventional-changelog --save-dev --save-exact
```

---

## 🚀 Performance Testing

### **Lighthouse CI**

#### **Configuración**

```javascript
// lighthouserc.js
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
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 4000 }],
      },
    },
  },
};
```

#### **GitHub Actions Integration**

```yaml
- name: Run Lighthouse CI
  run: |
    npm install -g @lhci/cli
    lhci autorun
  env:
    LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

### **Web Vitals Monitoring**

#### **Implementation**

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
```

#### **Testing Web Vitals**

```javascript
// tests/performance/web-vitals.test.js
import { test, expect } from '@playwright/test';

test('should meet Core Web Vitals thresholds', async ({ page }) => {
  await page.goto('/');

  const vitals = await page.evaluate(() => {
    return new Promise(resolve => {
      // Web Vitals collection logic
    });
  });

  expect(vitals.LCP).toBeLessThan(2500);
  expect(vitals.FID).toBeLessThan(100);
  expect(vitals.CLS).toBeLessThan(0.1);
});
```

---

## ♿ Accessibility Testing

### **Automated Testing**

#### **axe-core Integration**

```bash
# Instalación
npm install --save-dev jest-axe
```

**Configuración:**

```javascript
// src/setupTests.js
import { toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);
```

**Uso:**

```javascript
// Component.test.js
import { axe } from 'jest-axe';

test('should be accessible', async () => {
  const { container } = render(<Component />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### **Manual Testing**

#### **Screen Reader Testing**

- **NVDA** (Windows): [https://www.nvaccess.org/](https://www.nvaccess.org/)
- **JAWS** (Windows): [https://www.freedomscientific.com/products/software/jaws/](https://www.freedomscientific.com/products/software/jaws/)
- **VoiceOver** (macOS): Built-in accessibility feature

#### **Keyboard Navigation Testing**

```javascript
// tests/accessibility/keyboard-navigation.test.js
test('should support keyboard navigation', async () => {
  const user = userEvent.setup();
  render(<NavigationMenu />);

  // Test Tab navigation
  await user.tab();
  expect(screen.getByRole('button', { name: 'Home' })).toHaveFocus();

  // Test Arrow keys
  await user.keyboard('{ArrowRight}');
  expect(screen.getByRole('button', { name: 'Products' })).toHaveFocus();
});
```

### **WCAG Compliance**

#### **WCAG 2.1 AA Requirements**

- **Color Contrast**: 4.5:1 for normal text, 3:1 for large text
- **Keyboard Navigation**: All interactive elements accessible via keyboard
- **Focus Management**: Visible focus indicators
- **Alternative Text**: Descriptive alt text for images
- **Semantic HTML**: Proper use of headings, landmarks, etc.

#### **Testing Checklist**

```javascript
// Accessibility test checklist
const a11yChecklist = {
  colorContrast: 'Test color contrast ratios',
  keyboardNavigation: 'Test keyboard-only navigation',
  focusManagement: 'Test focus indicators and management',
  alternativeText: 'Test image alt text',
  semanticHTML: 'Test proper heading structure',
  ariaLabels: 'Test ARIA labels and roles',
  formLabels: 'Test form field labels',
  errorMessages: 'Test error message accessibility',
};
```

---

## 🔄 CI/CD Integration

### **GitHub Actions**

#### **Complete Workflow**

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
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linting
        run: npm run lint

      - name: Run unit tests
        run: npm run test:ci

      - name: Run E2E tests
        run: |
          npx playwright install --with-deps
          npm run test:e2e

      - name: Run accessibility tests
        run: npm run test:a11y

      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
```

### **Quality Gates**

#### **Branch Protection Rules**

```yaml
# Quality gates configuration
branch_protection:
  required_status_checks:
    - 'test'
    - 'lint'
    - 'e2e-tests'
    - 'accessibility-tests'
    - 'lighthouse-ci'
  required_pull_request_reviews:
    required_approving_review_count: 1
  enforce_admins: true
  dismiss_stale_reviews: true
```

---

## 📚 Learning Resources

### **Books and Guides**

#### **Testing**

- **"Testing JavaScript Applications"** by Lucas da Costa
- **"Effective JavaScript Testing"** by Gleb Bahmutov
- **"React Testing Library Documentation"** - testing-library.com

#### **Quality Assurance**

- **"Clean Code"** by Robert C. Martin
- **"Refactoring"** by Martin Fowler
- **"The Pragmatic Programmer"** by Andrew Hunt

### **Online Courses**

#### **Testing Courses**

- **Kent C. Dodds - Testing JavaScript** (testingjavascript.com)
- **Pluralsight - Testing React Applications**
- **Udemy - Jest and React Testing Library**

#### **Accessibility Courses**

- **Web Accessibility by Google** (web.dev)
- **Accessibility Fundamentals** (accessibility.deque.com)
- **WCAG Guidelines** (w3.org)

### **Community Resources**

#### **Blogs and Articles**

- **Kent C. Dodds Blog** (kentcdodds.com)
- **Martin Fowler** (martinfowler.com)
- **Web.dev** (web.dev)
- **A11y Project** (a11yproject.com)

#### **YouTube Channels**

- **Kent C. Dodds** - Testing best practices
- **Academind** - React testing tutorials
- **The Net Ninja** - Testing fundamentals

---

## 🛠️ Tools and Extensions

### **VS Code Extensions**

#### **Testing Extensions**

- **Jest**: Syntax highlighting and IntelliSense
- **Jest Runner**: Run tests directly from editor
- **Test Explorer**: Visual test runner
- **Coverage Gutters**: Code coverage visualization

#### **Quality Extensions**

- **ESLint**: Real-time linting
- **Prettier**: Code formatting
- **SonarLint**: Code quality analysis
- **GitLens**: Git integration

### **Browser Extensions**

#### **Accessibility Tools**

- **axe DevTools**: Accessibility testing
- **WAVE**: Web accessibility evaluation
- **Lighthouse**: Performance and accessibility audits
- **Accessibility Insights**: Microsoft accessibility tool

#### **Performance Tools**

- **Chrome DevTools**: Performance profiling
- **WebPageTest**: Performance testing
- **GTmetrix**: Website speed testing

---

## 🔧 Debugging and Troubleshooting

### **Common Issues**

#### **Jest Issues**

```javascript
// Mock modules that cause issues
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

// Fix async issues
await waitFor(() => {
  expect(screen.getByText('Expected text')).toBeInTheDocument();
});
```

#### **Playwright Issues**

```javascript
// Wait for network requests
await page.waitForLoadState('networkidle');

// Handle timeouts
await page.waitForSelector('[data-testid="element"]', { timeout: 10000 });
```

### **Debugging Techniques**

#### **Jest Debugging**

```javascript
// Use screen.debug() to see DOM
import { screen } from '@testing-library/react';

test('debug test', () => {
  render(<Component />);
  screen.debug(); // Prints DOM to console
});
```

#### **Playwright Debugging**

```javascript
// Use page.pause() for interactive debugging
await page.pause();

// Enable headed mode for visual debugging
npx playwright test --headed
```

---

## 📈 Metrics and Reporting

### **Testing Metrics**

#### **Key Metrics**

- **Test Coverage**: Lines, branches, functions
- **Test Execution Time**: Performance of test suite
- **Test Reliability**: Flaky test detection
- **Defect Detection Rate**: Tests catching bugs

#### **Reporting Tools**

- **Allure**: Test reporting framework
- **Mochawesome**: Mocha test reporter
- **Jest HTML Reporter**: HTML reports for Jest

### **Quality Metrics**

#### **Code Quality**

- **Cyclomatic Complexity**: Code complexity measurement
- **Technical Debt**: SonarQube analysis
- **Code Duplication**: Duplicate code detection
- **Maintainability Index**: Code maintainability score

---

## 🎯 Best Practices Summary

### **Testing Best Practices**

1. **Write tests first** (TDD approach)
2. **Test behavior, not implementation**
3. **Use descriptive test names**
4. **Keep tests simple and focused**
5. **Mock external dependencies**
6. **Test edge cases and error scenarios**

### **Quality Assurance Best Practices**

1. **Enforce consistent code style**
2. **Use pre-commit hooks**
3. **Implement continuous integration**
4. **Monitor code coverage**
5. **Regular code reviews**
6. **Automated quality gates**

### **Performance Best Practices**

1. **Monitor Core Web Vitals**
2. **Regular performance audits**
3. **Optimize images and assets**
4. **Implement lazy loading**
5. **Use performance budgets**
6. **Monitor real user metrics**

### **Accessibility Best Practices**

1. **Use semantic HTML**
2. **Provide alternative text**
3. **Ensure keyboard navigation**
4. **Maintain proper contrast**
5. **Test with screen readers**
6. **Follow WCAG guidelines**

¡Estos recursos proporcionan una base sólida para implementar testing y quality assurance de nivel profesional!
