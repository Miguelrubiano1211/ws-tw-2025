# 🔧 Ejercicio 5: Code Quality y Linting

## 📝 Descripción

Configurar y dominar herramientas de análisis de calidad de código, incluyendo ESLint, Prettier, SonarQube, y métricas de complejidad. Implementar pipelines de CI/CD para garantizar calidad automáticamente.

## 🎯 Objetivos

- Configurar ESLint con reglas personalizadas
- Implementar Prettier para formateo automático
- Configurar Husky para hooks de Git
- Analizar código con SonarQube
- Medir métricas de complejidad
- Implementar quality gates en CI/CD

## 📋 Instrucciones

### Paso 1: Configurar ESLint avanzado

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
    '@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: [
    'react',
    '@typescript-eslint',
    'react-hooks',
    'jsx-a11y',
    'import',
    'security',
    'sonarjs',
  ],
  rules: {
    // Errores que deben ser corregidos
    'no-unused-vars': 'error',
    'no-console': 'warn',
    'no-debugger': 'error',
    'no-alert': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    'no-duplicate-imports': 'error',

    // TypeScript específico
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    '@typescript-eslint/prefer-optional-chain': 'error',

    // React específico
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react/display-name': 'warn',
    'react/jsx-key': 'error',
    'react/jsx-no-duplicate-props': 'error',
    'react/jsx-no-undef': 'error',
    'react/jsx-uses-vars': 'error',
    'react/no-danger': 'warn',
    'react/no-deprecated': 'error',
    'react/no-direct-mutation-state': 'error',
    'react/no-unescaped-entities': 'warn',
    'react/self-closing-comp': 'error',

    // React Hooks
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // Accesibilidad
    'jsx-a11y/alt-text': 'error',
    'jsx-a11y/anchor-is-valid': 'error',
    'jsx-a11y/aria-props': 'error',
    'jsx-a11y/aria-proptypes': 'error',
    'jsx-a11y/aria-unsupported-elements': 'error',
    'jsx-a11y/click-events-have-key-events': 'warn',
    'jsx-a11y/heading-has-content': 'error',
    'jsx-a11y/img-redundant-alt': 'warn',
    'jsx-a11y/no-access-key': 'error',

    // Imports
    'import/no-unresolved': 'error',
    'import/no-absolute-path': 'error',
    'import/no-dynamic-require': 'warn',
    'import/no-self-import': 'error',
    'import/no-cycle': 'error',
    'import/no-useless-path-segments': 'error',
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],

    // Seguridad
    'security/detect-object-injection': 'warn',
    'security/detect-non-literal-regexp': 'warn',
    'security/detect-unsafe-regex': 'error',
    'security/detect-buffer-noassert': 'error',
    'security/detect-child-process': 'warn',
    'security/detect-disable-mustache-escape': 'error',
    'security/detect-eval-with-expression': 'error',
    'security/detect-no-csrf-before-method-override': 'error',
    'security/detect-pseudoRandomBytes': 'error',

    // SonarJS - Complejidad cognitiva
    'sonarjs/cognitive-complexity': ['error', 15],
    'sonarjs/max-switch-cases': ['error', 30],
    'sonarjs/no-all-duplicated-branches': 'error',
    'sonarjs/no-collapsible-if': 'error',
    'sonarjs/no-collection-size-mischeck': 'error',
    'sonarjs/no-duplicate-string': 'error',
    'sonarjs/no-duplicated-branches': 'error',
    'sonarjs/no-identical-conditions': 'error',
    'sonarjs/no-identical-expressions': 'error',
    'sonarjs/no-identical-functions': 'error',
    'sonarjs/no-inverted-boolean-check': 'error',
    'sonarjs/no-one-iteration-loop': 'error',
    'sonarjs/no-redundant-boolean': 'error',
    'sonarjs/no-redundant-jump': 'error',
    'sonarjs/no-same-line-conditional': 'error',
    'sonarjs/no-small-switch': 'error',
    'sonarjs/no-unused-collection': 'error',
    'sonarjs/no-use-of-empty-return-value': 'error',
    'sonarjs/no-useless-catch': 'error',
    'sonarjs/prefer-immediate-return': 'error',
    'sonarjs/prefer-object-literal': 'error',
    'sonarjs/prefer-single-boolean-return': 'error',
    'sonarjs/prefer-while': 'error',
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
    },
  },
  overrides: [
    {
      files: ['*.test.js', '*.test.jsx', '*.test.ts', '*.test.tsx'],
      rules: {
        'sonarjs/no-duplicate-string': 'off',
        'sonarjs/no-identical-functions': 'off',
      },
    },
  ],
};
```

### Paso 2: Configurar Prettier avanzado

```javascript
// .prettierrc.js
module.exports = {
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'avoid',
  endOfLine: 'lf',
  quoteProps: 'as-needed',
  jsxSingleQuote: true,
  proseWrap: 'preserve',
  htmlWhitespaceSensitivity: 'css',
  vueIndentScriptAndStyle: false,
  embeddedLanguageFormatting: 'auto',
  singleAttributePerLine: false,

  // Configuraciones específicas por tipo de archivo
  overrides: [
    {
      files: '*.json',
      options: {
        singleQuote: false,
      },
    },
    {
      files: '*.md',
      options: {
        proseWrap: 'always',
        printWidth: 100,
      },
    },
    {
      files: '*.yaml',
      options: {
        singleQuote: false,
        tabWidth: 2,
      },
    },
  ],
};
```

### Paso 3: Configurar EditorConfig

```ini
# .editorconfig
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false

[*.{yml,yaml}]
indent_size = 2

[*.py]
indent_size = 4

[*.go]
indent_style = tab

[*.{js,jsx,ts,tsx}]
indent_size = 2

[*.json]
indent_size = 2

[*.html]
indent_size = 2

[*.css]
indent_size = 2
```

### Paso 4: Configurar Husky para Git hooks

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm run test:ci && npm run build",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write", "git add"],
    "*.{json,md,yml,yaml}": ["prettier --write", "git add"],
    "*.{css,scss,less}": ["prettier --write", "stylelint --fix", "git add"]
  }
}
```

### Paso 5: Configurar Commitlint

```javascript
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // Nueva funcionalidad
        'fix', // Corrección de bug
        'docs', // Documentación
        'style', // Formato, punto y coma, etc.
        'refactor', // Refactorización
        'test', // Agregar tests
        'chore', // Tareas de mantenimiento
        'perf', // Mejoras de performance
        'ci', // Cambios en CI/CD
        'build', // Cambios en build
        'revert', // Revertir cambios
      ],
    ],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-case': [2, 'always', 'lower-case'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 100],
    'body-leading-blank': [1, 'always'],
    'footer-leading-blank': [1, 'always'],
  },
};
```

### Paso 6: Configurar SonarQube

```javascript
// sonar-project.properties
sonar.projectKey=worldskills-web-tech
sonar.projectName=WorldSkills Web Technologies
sonar.projectVersion=1.0
sonar.sources=src
sonar.exclusions=**/*.test.js,**/*.test.jsx,**/*.test.ts,**/*.test.tsx,**/node_modules/**,**/build/**,**/dist/**
sonar.tests=src
sonar.test.inclusions=**/*.test.js,**/*.test.jsx,**/*.test.ts,**/*.test.tsx
sonar.javascript.lcov.reportPaths=coverage/lcov.info
sonar.testExecutionReportPaths=coverage/test-reporter.xml
sonar.coverage.exclusions=**/*.test.js,**/*.test.jsx,**/*.test.ts,**/*.test.tsx,**/setupTests.js,**/reportWebVitals.js

# Configuración específica de calidad
sonar.coverage.minimum=80
sonar.duplication.minimum=3
sonar.maintainability.rating=A
sonar.reliability.rating=A
sonar.security.rating=A
```

### Paso 7: Crear script de análisis de calidad

```javascript
// scripts/quality-analysis.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class QualityAnalyzer {
  constructor() {
    this.results = {
      eslint: null,
      prettier: null,
      tests: null,
      coverage: null,
      complexity: null,
      security: null,
    };
  }

  async runESLint() {
    console.log('🔍 Ejecutando ESLint...');
    try {
      const result = execSync('npx eslint src/ --format=json', {
        encoding: 'utf8',
        stdio: 'pipe',
      });

      this.results.eslint = {
        success: true,
        issues: JSON.parse(result),
        summary: this.summarizeESLintResults(JSON.parse(result)),
      };
    } catch (error) {
      const errorOutput = JSON.parse(error.stdout);
      this.results.eslint = {
        success: false,
        issues: errorOutput,
        summary: this.summarizeESLintResults(errorOutput),
      };
    }
  }

  async runPrettier() {
    console.log('💅 Verificando formato con Prettier...');
    try {
      execSync('npx prettier --check src/', { stdio: 'pipe' });
      this.results.prettier = {
        success: true,
        message: 'Todos los archivos están correctamente formateados',
      };
    } catch (error) {
      this.results.prettier = {
        success: false,
        message: 'Algunos archivos necesitan formateo',
        files: this.extractPrettierFiles(error.stdout.toString()),
      };
    }
  }

  async runTests() {
    console.log('🧪 Ejecutando tests...');
    try {
      const result = execSync(
        'npm test -- --coverage --watchAll=false --testResultsProcessor=jest-sonar-reporter',
        {
          encoding: 'utf8',
          stdio: 'pipe',
        }
      );

      this.results.tests = {
        success: true,
        output: result,
      };
    } catch (error) {
      this.results.tests = {
        success: false,
        output: error.stdout,
      };
    }
  }

  async analyzeCoverage() {
    console.log('📊 Analizando cobertura de tests...');
    try {
      const coverageFile = path.join(
        process.cwd(),
        'coverage/coverage-summary.json'
      );

      if (fs.existsSync(coverageFile)) {
        const coverage = JSON.parse(fs.readFileSync(coverageFile, 'utf8'));

        this.results.coverage = {
          success: true,
          summary: coverage.total,
          passed: this.checkCoverageThresholds(coverage.total),
        };
      } else {
        this.results.coverage = {
          success: false,
          message: 'Archivo de cobertura no encontrado',
        };
      }
    } catch (error) {
      this.results.coverage = {
        success: false,
        error: error.message,
      };
    }
  }

  async analyzeComplexity() {
    console.log('🧮 Analizando complejidad del código...');
    try {
      const result = execSync('npx complexity-report --format=json src/', {
        encoding: 'utf8',
        stdio: 'pipe',
      });

      const complexity = JSON.parse(result);

      this.results.complexity = {
        success: true,
        data: complexity,
        summary: this.summarizeComplexity(complexity),
      };
    } catch (error) {
      this.results.complexity = {
        success: false,
        error: error.message,
      };
    }
  }

  async runSecurityAudit() {
    console.log('🔒 Ejecutando auditoría de seguridad...');
    try {
      const result = execSync('npm audit --json', {
        encoding: 'utf8',
        stdio: 'pipe',
      });

      const audit = JSON.parse(result);

      this.results.security = {
        success: true,
        vulnerabilities: audit.vulnerabilities,
        summary: this.summarizeSecurityAudit(audit),
      };
    } catch (error) {
      const errorOutput = JSON.parse(error.stdout);
      this.results.security = {
        success: false,
        vulnerabilities: errorOutput.vulnerabilities,
        summary: this.summarizeSecurityAudit(errorOutput),
      };
    }
  }

  summarizeESLintResults(results) {
    const totalFiles = results.length;
    const filesWithIssues = results.filter(
      file => file.errorCount > 0 || file.warningCount > 0
    ).length;
    const totalErrors = results.reduce((sum, file) => sum + file.errorCount, 0);
    const totalWarnings = results.reduce(
      (sum, file) => sum + file.warningCount,
      0
    );

    return {
      totalFiles,
      filesWithIssues,
      totalErrors,
      totalWarnings,
      passed: totalErrors === 0,
    };
  }

  extractPrettierFiles(output) {
    const lines = output.split('\n');
    return lines.filter(line => line.includes('src/')).map(line => line.trim());
  }

  checkCoverageThresholds(coverage) {
    const thresholds = {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    };

    return {
      statements: coverage.statements.pct >= thresholds.statements,
      branches: coverage.branches.pct >= thresholds.branches,
      functions: coverage.functions.pct >= thresholds.functions,
      lines: coverage.lines.pct >= thresholds.lines,
      overall: Object.values(coverage).every(metric => metric.pct >= 80),
    };
  }

  summarizeComplexity(complexity) {
    const files = complexity.reports || [];
    const highComplexityFiles = files.filter(
      file => file.complexity && file.complexity.cyclomatic > 10
    );

    return {
      totalFiles: files.length,
      highComplexityFiles: highComplexityFiles.length,
      averageComplexity:
        files.reduce(
          (sum, file) =>
            sum + (file.complexity ? file.complexity.cyclomatic : 0),
          0
        ) / files.length,
    };
  }

  summarizeSecurityAudit(audit) {
    const vulnerabilities = audit.vulnerabilities || {};
    const levels = ['critical', 'high', 'moderate', 'low'];
    const summary = {};

    levels.forEach(level => {
      summary[level] = Object.values(vulnerabilities).filter(
        vuln => vuln.severity === level
      ).length;
    });

    return {
      ...summary,
      total: Object.keys(vulnerabilities).length,
      hasCritical: summary.critical > 0,
      hasHigh: summary.high > 0,
    };
  }

  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        passed: this.overallPassed(),
        grade: this.calculateGrade(),
      },
      details: this.results,
    };

    const reportPath = path.join(process.cwd(), 'quality-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    this.printReport(report);
    return report;
  }

  overallPassed() {
    return (
      this.results.eslint?.success &&
      this.results.prettier?.success &&
      this.results.tests?.success &&
      this.results.coverage?.success &&
      this.results.coverage?.passed?.overall &&
      !this.results.security?.summary?.hasCritical
    );
  }

  calculateGrade() {
    let score = 0;
    let maxScore = 0;

    // ESLint (20 puntos)
    maxScore += 20;
    if (this.results.eslint?.success) {
      const { totalErrors, totalWarnings } = this.results.eslint.summary;
      score += Math.max(0, 20 - totalErrors * 2 - totalWarnings * 0.5);
    }

    // Prettier (10 puntos)
    maxScore += 10;
    if (this.results.prettier?.success) {
      score += 10;
    }

    // Tests (25 puntos)
    maxScore += 25;
    if (this.results.tests?.success) {
      score += 25;
    }

    // Coverage (25 puntos)
    maxScore += 25;
    if (
      this.results.coverage?.success &&
      this.results.coverage.passed?.overall
    ) {
      score += 25;
    }

    // Security (20 puntos)
    maxScore += 20;
    if (this.results.security?.success) {
      const { critical, high } = this.results.security.summary;
      score += Math.max(0, 20 - critical * 5 - high * 2);
    }

    const percentage = (score / maxScore) * 100;

    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  }

  printReport(report) {
    console.log('\n' + '='.repeat(50));
    console.log('📋 REPORTE DE CALIDAD DE CÓDIGO');
    console.log('='.repeat(50));
    console.log(`📅 Fecha: ${report.timestamp}`);
    console.log(
      `📈 Estado: ${report.summary.passed ? '✅ APROBADO' : '❌ RECHAZADO'}`
    );
    console.log(`🎯 Calificación: ${report.summary.grade}`);
    console.log();

    // ESLint
    if (report.details.eslint) {
      const eslint = report.details.eslint.summary;
      console.log(`🔍 ESLint: ${eslint.passed ? '✅' : '❌'}`);
      console.log(`   - Errores: ${eslint.totalErrors}`);
      console.log(`   - Advertencias: ${eslint.totalWarnings}`);
      console.log(
        `   - Archivos con problemas: ${eslint.filesWithIssues}/${eslint.totalFiles}`
      );
    }

    // Prettier
    if (report.details.prettier) {
      console.log(
        `💅 Prettier: ${report.details.prettier.success ? '✅' : '❌'}`
      );
      if (!report.details.prettier.success) {
        console.log(`   - ${report.details.prettier.message}`);
      }
    }

    // Tests
    if (report.details.tests) {
      console.log(`🧪 Tests: ${report.details.tests.success ? '✅' : '❌'}`);
    }

    // Coverage
    if (report.details.coverage?.success) {
      const coverage = report.details.coverage.summary;
      console.log(
        `📊 Cobertura: ${report.details.coverage.passed?.overall ? '✅' : '❌'}`
      );
      console.log(`   - Statements: ${coverage.statements.pct}%`);
      console.log(`   - Branches: ${coverage.branches.pct}%`);
      console.log(`   - Functions: ${coverage.functions.pct}%`);
      console.log(`   - Lines: ${coverage.lines.pct}%`);
    }

    // Security
    if (report.details.security?.success) {
      const security = report.details.security.summary;
      console.log(`🔒 Seguridad: ${security.hasCritical ? '❌' : '✅'}`);
      console.log(`   - Críticas: ${security.critical}`);
      console.log(`   - Altas: ${security.high}`);
      console.log(`   - Moderadas: ${security.moderate}`);
      console.log(`   - Bajas: ${security.low}`);
    }

    console.log('\n' + '='.repeat(50));
  }

  async run() {
    console.log('🚀 Iniciando análisis de calidad de código...\n');

    await this.runESLint();
    await this.runPrettier();
    await this.runTests();
    await this.analyzeCoverage();
    await this.analyzeComplexity();
    await this.runSecurityAudit();

    return this.generateReport();
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  const analyzer = new QualityAnalyzer();
  analyzer
    .run()
    .then(report => {
      process.exit(report.summary.passed ? 0 : 1);
    })
    .catch(error => {
      console.error('Error en análisis de calidad:', error);
      process.exit(1);
    });
}

module.exports = QualityAnalyzer;
```

### Paso 8: Configurar GitHub Actions para CI/CD

```yaml
# .github/workflows/quality-check.yml
name: Quality Check

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  quality-check:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [16.x, 18.x]

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

      - name: Check Prettier formatting
        run: npm run format:check

      - name: Run tests
        run: npm run test:ci

      - name: Generate coverage report
        run: npm run test:coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          flags: unittests
          name: codecov-umbrella

      - name: Run security audit
        run: npm audit --audit-level=high

      - name: Run quality analysis
        run: node scripts/quality-analysis.js

      - name: Upload quality report
        uses: actions/upload-artifact@v3
        with:
          name: quality-report-${{ matrix.node-version }}
          path: quality-report.json

      - name: Comment PR with quality results
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const report = JSON.parse(fs.readFileSync('quality-report.json', 'utf8'));

            const comment = `
            ## 📋 Reporte de Calidad de Código

            **Estado:** ${report.summary.passed ? '✅ APROBADO' : '❌ RECHAZADO'}
            **Calificación:** ${report.summary.grade}

            ### Detalles
            - **ESLint:** ${report.details.eslint?.summary.passed ? '✅' : '❌'} (${report.details.eslint?.summary.totalErrors || 0} errores)
            - **Prettier:** ${report.details.prettier?.success ? '✅' : '❌'}
            - **Tests:** ${report.details.tests?.success ? '✅' : '❌'}
            - **Cobertura:** ${report.details.coverage?.passed?.overall ? '✅' : '❌'}
            - **Seguridad:** ${report.details.security?.summary.hasCritical ? '❌' : '✅'}

            ${report.summary.passed ? '' : '⚠️ Por favor, corrija los problemas antes de hacer merge.'}
            `;

            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: comment
            });
```

### Paso 9: Crear archivos de ejemplo con problemas de calidad

```javascript
// src/examples/bad-code.js
var userName = 'Juan';
let userAge = 25;
const userEmail = 'juan@test.com';

function calculateAge(birthYear) {
  var currentYear = new Date().getFullYear();
  var age = currentYear - birthYear;
  if (age < 0) {
    console.log('Error: Año de nacimiento inválido');
    return -1;
  }
  if (age > 150) {
    console.log('Error: Edad muy alta');
    return -1;
  }
  return age;
}

function processUserData(userData) {
  if (userData.name) {
    if (userData.age) {
      if (userData.email) {
        if (userData.email.includes('@')) {
          // Nested hell
          return {
            name: userData.name,
            age: userData.age,
            email: userData.email,
            isValid: true,
          };
        } else {
          console.log('Email inválido');
          return null;
        }
      } else {
        console.log('Email requerido');
        return null;
      }
    } else {
      console.log('Edad requerida');
      return null;
    }
  } else {
    console.log('Nombre requerido');
    return null;
  }
}

// Código duplicado
function validateUserName(name) {
  if (!name || name.trim() === '') {
    return false;
  }
  if (name.length < 2) {
    return false;
  }
  return true;
}

function validateProductName(name) {
  if (!name || name.trim() === '') {
    return false;
  }
  if (name.length < 2) {
    return false;
  }
  return true;
}

// Función con alta complejidad ciclomática
function complexCalculation(a, b, c, d, e, f) {
  let result = 0;

  if (a > 0) {
    if (b > 0) {
      if (c > 0) {
        if (d > 0) {
          if (e > 0) {
            if (f > 0) {
              result = a + b + c + d + e + f;
            } else {
              result = a + b + c + d + e;
            }
          } else {
            result = a + b + c + d;
          }
        } else {
          result = a + b + c;
        }
      } else {
        result = a + b;
      }
    } else {
      result = a;
    }
  } else {
    result = 0;
  }

  return result;
}

// Uso inseguro de eval
function executeCode(code) {
  return eval(code);
}

module.exports = {
  calculateAge,
  processUserData,
  validateUserName,
  validateProductName,
  complexCalculation,
  executeCode,
};
```

### Paso 10: Crear archivos de ejemplo con buenas prácticas

```javascript
// src/examples/good-code.js
const MINIMUM_AGE = 0;
const MAXIMUM_AGE = 150;
const MINIMUM_NAME_LENGTH = 2;

/**
 * Calcula la edad basada en el año de nacimiento
 * @param {number} birthYear - Año de nacimiento
 * @returns {number} Edad calculada
 * @throws {Error} Si el año es inválido
 */
const calculateAge = birthYear => {
  const currentYear = new Date().getFullYear();
  const age = currentYear - birthYear;

  if (age < MINIMUM_AGE || age > MAXIMUM_AGE) {
    throw new Error(
      `Edad inválida: ${age}. Debe estar entre ${MINIMUM_AGE} y ${MAXIMUM_AGE}`
    );
  }

  return age;
};

/**
 * Valida los datos del usuario
 * @param {Object} userData - Datos del usuario
 * @returns {Object|null} Datos validados o null si son inválidos
 */
const processUserData = userData => {
  const validationErrors = [];

  if (!userData?.name) {
    validationErrors.push('Nombre requerido');
  }

  if (!userData?.age) {
    validationErrors.push('Edad requerida');
  }

  if (!userData?.email) {
    validationErrors.push('Email requerido');
  } else if (!userData.email.includes('@')) {
    validationErrors.push('Email inválido');
  }

  if (validationErrors.length > 0) {
    console.error('Errores de validación:', validationErrors);
    return null;
  }

  return {
    name: userData.name,
    age: userData.age,
    email: userData.email,
    isValid: true,
  };
};

/**
 * Valida un nombre (genérico)
 * @param {string} name - Nombre a validar
 * @returns {boolean} True si es válido
 */
const validateName = name => {
  return (
    name &&
    typeof name === 'string' &&
    name.trim() !== '' &&
    name.length >= MINIMUM_NAME_LENGTH
  );
};

/**
 * Validador específico para nombres de usuario
 * @param {string} name - Nombre del usuario
 * @returns {boolean} True si es válido
 */
const validateUserName = name => validateName(name);

/**
 * Validador específico para nombres de producto
 * @param {string} name - Nombre del producto
 * @returns {boolean} True si es válido
 */
const validateProductName = name => validateName(name);

/**
 * Calcula la suma de números positivos
 * @param {number[]} numbers - Array de números
 * @returns {number} Suma de los números positivos
 */
const calculateSum = numbers => {
  return numbers.filter(num => num > 0).reduce((sum, num) => sum + num, 0);
};

/**
 * Ejecuta código de manera segura usando Function constructor
 * @param {string} code - Código a ejecutar
 * @param {Object} context - Contexto de ejecución
 * @returns {any} Resultado de la ejecución
 */
const executeCodeSafely = (code, context = {}) => {
  try {
    const func = new Function(
      'context',
      `
      const { ${Object.keys(context).join(', ')} } = context;
      return ${code};
    `
    );

    return func(context);
  } catch (error) {
    console.error('Error ejecutando código:', error);
    throw new Error('Código inválido');
  }
};

module.exports = {
  calculateAge,
  processUserData,
  validateUserName,
  validateProductName,
  calculateSum,
  executeCodeSafely,
  // Constantes para testing
  MINIMUM_AGE,
  MAXIMUM_AGE,
  MINIMUM_NAME_LENGTH,
};
```

### Paso 11: Tests para análisis de calidad

```javascript
// src/examples/__tests__/code-quality.test.js
const goodCode = require('../good-code');
const badCode = require('../bad-code');

describe('Code Quality Analysis', () => {
  describe('Good Code Examples', () => {
    test('calculateAge debe manejar casos válidos', () => {
      expect(goodCode.calculateAge(1990)).toBe(new Date().getFullYear() - 1990);
      expect(goodCode.calculateAge(2000)).toBe(new Date().getFullYear() - 2000);
    });

    test('calculateAge debe lanzar error para edades inválidas', () => {
      expect(() => goodCode.calculateAge(1800)).toThrow('Edad inválida');
      expect(() => goodCode.calculateAge(2100)).toThrow('Edad inválida');
    });

    test('processUserData debe validar datos correctamente', () => {
      const validData = {
        name: 'Juan',
        age: 25,
        email: 'juan@test.com',
      };

      const result = goodCode.processUserData(validData);
      expect(result).toEqual({
        name: 'Juan',
        age: 25,
        email: 'juan@test.com',
        isValid: true,
      });
    });

    test('validateName debe funcionar correctamente', () => {
      expect(goodCode.validateUserName('Juan')).toBe(true);
      expect(goodCode.validateUserName('A')).toBe(false);
      expect(goodCode.validateUserName('')).toBe(false);
      expect(goodCode.validateUserName(null)).toBe(false);
    });

    test('calculateSum debe sumar solo números positivos', () => {
      expect(goodCode.calculateSum([1, 2, 3, -1, 4])).toBe(10);
      expect(goodCode.calculateSum([-1, -2, -3])).toBe(0);
      expect(goodCode.calculateSum([0, 1, 2])).toBe(3);
    });

    test('executeCodeSafely debe ejecutar código de manera segura', () => {
      const result = goodCode.executeCodeSafely('1 + 1');
      expect(result).toBe(2);

      const context = { x: 5, y: 10 };
      const result2 = goodCode.executeCodeSafely('x + y', context);
      expect(result2).toBe(15);
    });
  });

  describe('Bad Code Examples', () => {
    test('calculateAge en bad code debe funcionar básicamente', () => {
      const result = badCode.calculateAge(1990);
      expect(result).toBe(new Date().getFullYear() - 1990);
    });

    test('processUserData en bad code debe ser problemático', () => {
      // El código malo usa console.log y retorna null para casos inválidos
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const result = badCode.processUserData({});
      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    test('validateUserName y validateProductName son duplicados', () => {
      // Ambas funciones hacen exactamente lo mismo
      expect(badCode.validateUserName('Juan')).toBe(
        badCode.validateProductName('Juan')
      );
      expect(badCode.validateUserName('')).toBe(
        badCode.validateProductName('')
      );
    });

    test('complexCalculation tiene alta complejidad ciclomática', () => {
      // Esta función tiene muchos niveles de anidación
      expect(badCode.complexCalculation(1, 1, 1, 1, 1, 1)).toBe(6);
      expect(badCode.complexCalculation(1, 1, 1, 1, 1, 0)).toBe(5);
      expect(badCode.complexCalculation(0, 1, 1, 1, 1, 1)).toBe(0);
    });

    test('executeCode es inseguro pero funciona', () => {
      // Esta función usa eval que es inseguro
      const result = badCode.executeCode('1 + 1');
      expect(result).toBe(2);
    });
  });
});
```

## 📊 Verificación

### Ejecutar análisis completo

```bash
node scripts/quality-analysis.js
```

### Verificar ESLint

```bash
npm run lint
```

### Verificar Prettier

```bash
npm run format:check
```

### Ejecutar tests con coverage

```bash
npm run test:coverage
```

### Auditoría de seguridad

```bash
npm audit --audit-level=high
```

## 🎯 Criterios de Evaluación

### Configuración de Herramientas (25 puntos)

- [ ] ESLint configurado con reglas avanzadas (10 pts)
- [ ] Prettier configurado (5 pts)
- [ ] Husky y lint-staged funcionando (5 pts)
- [ ] EditorConfig configurado (5 pts)

### Análisis de Calidad (35 puntos)

- [ ] Script de análisis funcionando (15 pts)
- [ ] Métricas de complejidad (10 pts)
- [ ] Auditoría de seguridad (10 pts)

### CI/CD Pipeline (25 puntos)

- [ ] GitHub Actions configurado (15 pts)
- [ ] Quality gates implementados (10 pts)

### Ejemplos y Tests (15 puntos)

- [ ] Ejemplos de código bueno y malo (8 pts)
- [ ] Tests para análisis de calidad (7 pts)

## 📚 Recursos Adicionales

- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Configuration](https://prettier.io/docs/en/configuration.html)
- [Husky Documentation](https://typicode.github.io/husky/)
- [SonarQube Quality Gates](https://docs.sonarqube.org/latest/user-guide/quality-gates/)
- [GitHub Actions](https://docs.github.com/en/actions)
