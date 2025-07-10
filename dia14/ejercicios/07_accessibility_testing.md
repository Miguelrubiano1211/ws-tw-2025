# ♿ Ejercicio 7: Accessibility Testing

## 📝 Descripción

Implementar testing de accesibilidad para garantizar que las aplicaciones web sean inclusivas y cumplan con estándares WCAG 2.1. Incluye testing automatizado, manual y herramientas de análisis.

## 🎯 Objetivos

- Implementar testing automático con axe-core
- Realizar auditorías de accesibilidad con herramientas
- Testear navegación por teclado
- Verificar compatibilidad con screen readers
- Implementar testing de contraste de colores
- Configurar CI/CD para accessibility testing

## 📋 Instrucciones

### Paso 1: Configurar axe-core para testing automático

```javascript
// src/utils/axe-testing.js
import axe from 'axe-core';

class AccessibilityTester {
  constructor(options = {}) {
    this.options = {
      includeTags: ['wcag2a', 'wcag2aa', 'wcag21aa'],
      excludeTags: [],
      rules: {},
      ...options,
    };

    this.results = null;
    this.violations = [];
  }

  // Configurar reglas personalizadas
  configure(config) {
    axe.configure(config);
  }

  // Ejecutar análisis de accesibilidad
  async analyze(context = document, options = {}) {
    const analysisOptions = {
      includeTags: this.options.includeTags,
      excludeTags: this.options.excludeTags,
      rules: this.options.rules,
      ...options,
    };

    try {
      this.results = await axe.run(context, analysisOptions);
      this.violations = this.results.violations;
      return this.results;
    } catch (error) {
      console.error('Error en análisis de accesibilidad:', error);
      throw error;
    }
  }

  // Obtener violaciones por severidad
  getViolationsBySeverity() {
    if (!this.violations) return {};

    return this.violations.reduce((acc, violation) => {
      const severity = violation.impact || 'unknown';
      if (!acc[severity]) {
        acc[severity] = [];
      }
      acc[severity].push(violation);
      return acc;
    }, {});
  }

  // Generar reporte de accesibilidad
  generateReport() {
    if (!this.results) {
      throw new Error('No hay resultados. Ejecute analyze() primero.');
    }

    const violationsBySeverity = this.getViolationsBySeverity();
    const totalViolations = this.violations.length;
    const totalNodes = this.violations.reduce(
      (sum, violation) => sum + violation.nodes.length,
      0
    );

    return {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      summary: {
        totalViolations,
        totalNodes,
        critical: violationsBySeverity.critical?.length || 0,
        serious: violationsBySeverity.serious?.length || 0,
        moderate: violationsBySeverity.moderate?.length || 0,
        minor: violationsBySeverity.minor?.length || 0,
        passed: this.results.passes.length,
      },
      violations: this.violations.map(violation => ({
        id: violation.id,
        impact: violation.impact,
        description: violation.description,
        help: violation.help,
        helpUrl: violation.helpUrl,
        tags: violation.tags,
        nodes: violation.nodes.map(node => ({
          html: node.html,
          target: node.target,
          failureSummary: node.failureSummary,
        })),
      })),
      passes: this.results.passes.map(pass => ({
        id: pass.id,
        description: pass.description,
        nodes: pass.nodes.length,
      })),
      score: this.calculateAccessibilityScore(),
      recommendations: this.generateRecommendations(),
    };
  }

  // Calcular puntuación de accesibilidad
  calculateAccessibilityScore() {
    if (!this.results) return 0;

    const violationsBySeverity = this.getViolationsBySeverity();
    const weights = {
      critical: 10,
      serious: 7,
      moderate: 4,
      minor: 1,
    };

    const totalDeductions = Object.entries(violationsBySeverity).reduce(
      (sum, [severity, violations]) => {
        const weight = weights[severity] || 1;
        return sum + violations.length * weight;
      },
      0
    );

    const baseScore = 100;
    const score = Math.max(0, baseScore - totalDeductions);

    return Math.round(score);
  }

  // Generar recomendaciones
  generateRecommendations() {
    const recommendations = [];
    const violationsBySeverity = this.getViolationsBySeverity();

    // Recomendaciones por severidad
    if (violationsBySeverity.critical?.length > 0) {
      recommendations.push({
        priority: 'critical',
        message: `${violationsBySeverity.critical.length} violaciones críticas encontradas`,
        actions: [
          'Corregir inmediatamente las violaciones críticas',
          'Verificar compatibilidad con screen readers',
          'Asegurar navegación por teclado',
        ],
      });
    }

    if (violationsBySeverity.serious?.length > 0) {
      recommendations.push({
        priority: 'high',
        message: `${violationsBySeverity.serious.length} violaciones serias encontradas`,
        actions: [
          'Revisar estructura semántica',
          'Verificar etiquetas ARIA',
          'Mejorar contraste de colores',
        ],
      });
    }

    // Recomendaciones por tipo de violación
    const commonViolations = this.violations.reduce((acc, violation) => {
      acc[violation.id] = (acc[violation.id] || 0) + 1;
      return acc;
    }, {});

    if (commonViolations['color-contrast']) {
      recommendations.push({
        priority: 'medium',
        message: 'Problemas de contraste de color detectados',
        actions: [
          'Usar herramientas de análisis de contraste',
          'Aplicar ratio mínimo 4.5:1 para texto normal',
          'Aplicar ratio mínimo 3:1 para texto grande',
        ],
      });
    }

    if (commonViolations['missing-alt'] || commonViolations['image-alt']) {
      recommendations.push({
        priority: 'medium',
        message: 'Imágenes sin texto alternativo',
        actions: [
          'Agregar atributos alt descriptivos',
          'Usar alt="" para imágenes decorativas',
          'Considerar longdesc para imágenes complejas',
        ],
      });
    }

    return recommendations;
  }

  // Obtener violaciones por categoría WCAG
  getViolationsByWCAG() {
    if (!this.violations) return {};

    const wcagCategories = {};

    this.violations.forEach(violation => {
      violation.tags.forEach(tag => {
        if (tag.startsWith('wcag')) {
          if (!wcagCategories[tag]) {
            wcagCategories[tag] = [];
          }
          wcagCategories[tag].push(violation);
        }
      });
    });

    return wcagCategories;
  }

  // Exportar resultados
  export(format = 'json') {
    const report = this.generateReport();

    switch (format) {
      case 'json':
        return JSON.stringify(report, null, 2);
      case 'csv':
        return this.generateCSV(report);
      case 'html':
        return this.generateHTML(report);
      default:
        throw new Error(`Formato no soportado: ${format}`);
    }
  }

  generateCSV(report) {
    const headers = ['ID', 'Impact', 'Description', 'Nodes', 'Tags'];
    const rows = report.violations.map(violation => [
      violation.id,
      violation.impact,
      violation.description,
      violation.nodes.length,
      violation.tags.join(';'),
    ]);

    return [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
  }

  generateHTML(report) {
    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reporte de Accesibilidad</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .summary { background: #f5f5f5; padding: 20px; border-radius: 5px; }
          .violation { border: 1px solid #ddd; margin: 10px 0; padding: 15px; }
          .critical { border-left: 5px solid #d32f2f; }
          .serious { border-left: 5px solid #f57c00; }
          .moderate { border-left: 5px solid #fbc02d; }
          .minor { border-left: 5px solid #388e3c; }
          .score { font-size: 24px; font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>Reporte de Accesibilidad</h1>
        <div class="summary">
          <h2>Resumen</h2>
          <p>Fecha: ${report.timestamp}</p>
          <p>URL: ${report.url}</p>
          <p class="score">Puntuación: ${report.score}/100</p>
          <p>Total de violaciones: ${report.summary.totalViolations}</p>
          <p>Críticas: ${report.summary.critical}</p>
          <p>Serias: ${report.summary.serious}</p>
          <p>Moderadas: ${report.summary.moderate}</p>
          <p>Menores: ${report.summary.minor}</p>
        </div>
        
        <h2>Violaciones</h2>
        ${report.violations
          .map(
            violation => `
          <div class="violation ${violation.impact}">
            <h3>${violation.description}</h3>
            <p><strong>Impacto:</strong> ${violation.impact}</p>
            <p><strong>Ayuda:</strong> <a href="${
              violation.helpUrl
            }" target="_blank">${violation.help}</a></p>
            <p><strong>Nodos afectados:</strong> ${violation.nodes.length}</p>
            <p><strong>Etiquetas:</strong> ${violation.tags.join(', ')}</p>
          </div>
        `
          )
          .join('')}
        
        <h2>Recomendaciones</h2>
        ${report.recommendations
          .map(
            rec => `
          <div class="recommendation">
            <h3>[${rec.priority.toUpperCase()}] ${rec.message}</h3>
            <ul>
              ${rec.actions.map(action => `<li>${action}</li>`).join('')}
            </ul>
          </div>
        `
          )
          .join('')}
      </body>
      </html>
    `;
  }
}

export default AccessibilityTester;
```

### Paso 2: Configurar testing de accesibilidad con Jest

```javascript
// src/utils/jest-axe.js
import { configureAxe } from 'jest-axe';

// Configurar jest-axe con reglas personalizadas
export const axe = configureAxe({
  rules: {
    // Deshabilitar reglas específicas si es necesario
    'color-contrast': { enabled: true },
    'landmark-one-main': { enabled: true },
    'page-has-heading-one': { enabled: true },
    region: { enabled: true },
  },
  tags: ['wcag2a', 'wcag2aa', 'wcag21aa'],
  // Configurar para diferentes idiomas
  locale: 'es',
});

// Helper para testing de accesibilidad
export const testAccessibility = async component => {
  const results = await axe(component);
  expect(results).toHaveNoViolations();
  return results;
};

// Matcher personalizado para Jest
expect.extend({
  toBeAccessible(received) {
    const pass = received.violations.length === 0;

    if (pass) {
      return {
        message: () => `expected component to have accessibility violations`,
        pass: true,
      };
    } else {
      const violations = received.violations
        .map(v => `${v.id}: ${v.description}`)
        .join('\n');
      return {
        message: () =>
          `expected component to be accessible but found violations:\n${violations}`,
        pass: false,
      };
    }
  },
});
```

### Paso 3: Crear componentes de testing de accesibilidad

```jsx
// src/components/AccessibilityTestComponent.jsx
import React from 'react';

// Componente con problemas de accesibilidad para testing
export const BadAccessibilityComponent = () => {
  return (
    <div>
      {/* Problema: imagen sin alt */}
      <img src="/test-image.jpg" />

      {/* Problema: contraste bajo */}
      <p style={{ color: '#999', backgroundColor: '#ccc' }}>
        Este texto tiene contraste bajo
      </p>

      {/* Problema: botón sin texto accesible */}
      <button onClick={() => alert('clicked')}>
        <span>🔍</span>
      </button>

      {/* Problema: input sin label */}
      <input
        type="text"
        placeholder="Ingrese su nombre"
      />

      {/* Problema: enlace sin texto descriptivo */}
      <a href="/more">Más información</a>

      {/* Problema: div clickeable sin rol */}
      <div onClick={() => alert('clicked')}>Hacer clic aquí</div>

      {/* Problema: heading fuera de orden */}
      <h1>Título principal</h1>
      <h3>Subtítulo (debería ser h2)</h3>

      {/* Problema: tabla sin headers */}
      <table>
        <tr>
          <td>Nombre</td>
          <td>Edad</td>
        </tr>
        <tr>
          <td>Juan</td>
          <td>25</td>
        </tr>
      </table>
    </div>
  );
};

// Componente con buena accesibilidad
export const GoodAccessibilityComponent = () => {
  return (
    <div>
      {/* Imagen con alt descriptivo */}
      <img
        src="/test-image.jpg"
        alt="Descripción de la imagen de prueba"
      />

      {/* Texto con contraste adecuado */}
      <p style={{ color: '#333', backgroundColor: '#fff' }}>
        Este texto tiene contraste adecuado
      </p>

      {/* Botón con texto accesible */}
      <button
        onClick={() => alert('clicked')}
        aria-label="Buscar">
        <span aria-hidden="true">🔍</span>
      </button>

      {/* Input con label asociado */}
      <label htmlFor="name-input">
        Nombre:
        <input
          id="name-input"
          type="text"
        />
      </label>

      {/* Enlace con texto descriptivo */}
      <a href="/more">Más información sobre el producto</a>

      {/* Div clickeable con rol y manejadores de teclado */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => alert('clicked')}
        onKeyPress={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            alert('clicked');
          }
        }}>
        Hacer clic aquí
      </div>

      {/* Headings en orden correcto */}
      <h1>Título principal</h1>
      <h2>Subtítulo</h2>
      <h3>Sub-subtítulo</h3>

      {/* Tabla con headers apropiados */}
      <table>
        <thead>
          <tr>
            <th scope="col">Nombre</th>
            <th scope="col">Edad</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Juan</td>
            <td>25</td>
          </tr>
        </tbody>
      </table>

      {/* Formulario accesible */}
      <form>
        <fieldset>
          <legend>Información personal</legend>

          <label htmlFor="email">
            Email:
            <input
              id="email"
              type="email"
              required
              aria-describedby="email-help"
            />
          </label>
          <div id="email-help">Ingrese su dirección de email válida</div>

          <label htmlFor="password">
            Contraseña:
            <input
              id="password"
              type="password"
              required
              aria-describedby="password-help"
            />
          </label>
          <div id="password-help">Mínimo 8 caracteres</div>

          <button type="submit">Enviar formulario</button>
        </fieldset>
      </form>
    </div>
  );
};

// Componente modal accesible
export const AccessibleModal = ({ isOpen, onClose, title, children }) => {
  const modalRef = React.useRef(null);

  React.useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  React.useEffect(() => {
    const handleEscape = event => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title">
      <div
        ref={modalRef}
        className="modal-content"
        onClick={e => e.stopPropagation()}
        tabIndex={-1}>
        <div className="modal-header">
          <h2 id="modal-title">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="modal-close">
            ×
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};
```

### Paso 4: Tests de accesibilidad con Jest

```javascript
// src/components/__tests__/accessibility.test.jsx
import React from 'react';
import { render } from '@testing-library/react';
import { axe, testAccessibility } from '../../utils/jest-axe';
import {
  BadAccessibilityComponent,
  GoodAccessibilityComponent,
  AccessibleModal,
} from '../AccessibilityTestComponent';

describe('Accessibility Testing', () => {
  describe('BadAccessibilityComponent', () => {
    test('debe tener violaciones de accesibilidad', async () => {
      const { container } = render(<BadAccessibilityComponent />);
      const results = await axe(container);

      expect(results.violations.length).toBeGreaterThan(0);

      // Verificar tipos específicos de violaciones
      const violationIds = results.violations.map(v => v.id);
      expect(violationIds).toContain('image-alt');
      expect(violationIds).toContain('color-contrast');
      expect(violationIds).toContain('button-name');
      expect(violationIds).toContain('label');
    });

    test('debe identificar problemas de contraste', async () => {
      const { container } = render(<BadAccessibilityComponent />);
      const results = await axe(container);

      const contrastViolations = results.violations.filter(
        v => v.id === 'color-contrast'
      );
      expect(contrastViolations.length).toBeGreaterThan(0);
    });

    test('debe identificar imágenes sin alt', async () => {
      const { container } = render(<BadAccessibilityComponent />);
      const results = await axe(container);

      const altViolations = results.violations.filter(
        v => v.id === 'image-alt'
      );
      expect(altViolations.length).toBeGreaterThan(0);
    });
  });

  describe('GoodAccessibilityComponent', () => {
    test('debe ser accesible', async () => {
      const { container } = render(<GoodAccessibilityComponent />);
      await testAccessibility(container);
    });

    test('no debe tener violaciones críticas', async () => {
      const { container } = render(<GoodAccessibilityComponent />);
      const results = await axe(container);

      const criticalViolations = results.violations.filter(
        v => v.impact === 'critical'
      );
      expect(criticalViolations).toHaveLength(0);
    });

    test('debe tener estructura de headings correcta', async () => {
      const { container } = render(<GoodAccessibilityComponent />);
      const results = await axe(container);

      const headingViolations = results.violations.filter(v =>
        v.id.includes('heading')
      );
      expect(headingViolations).toHaveLength(0);
    });
  });

  describe('AccessibleModal', () => {
    test('debe ser accesible cuando está abierto', async () => {
      const { container } = render(
        <AccessibleModal
          isOpen={true}
          onClose={() => {}}
          title="Test Modal">
          <p>Contenido del modal</p>
        </AccessibleModal>
      );

      await testAccessibility(container);
    });

    test('debe tener atributos ARIA correctos', async () => {
      const { container } = render(
        <AccessibleModal
          isOpen={true}
          onClose={() => {}}
          title="Test Modal">
          <p>Contenido del modal</p>
        </AccessibleModal>
      );

      const dialog = container.querySelector('[role="dialog"]');
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
    });

    test('no debe renderizar cuando está cerrado', () => {
      const { container } = render(
        <AccessibleModal
          isOpen={false}
          onClose={() => {}}
          title="Test Modal">
          <p>Contenido del modal</p>
        </AccessibleModal>
      );

      expect(container.firstChild).toBeNull();
    });
  });
});
```

### Paso 5: Testing de navegación por teclado

```javascript
// src/tests/keyboard-navigation.test.js
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Componente para testing de navegación por teclado
const KeyboardNavigationComponent = () => {
  const [currentFocus, setCurrentFocus] = React.useState(null);

  return (
    <div>
      <button
        onFocus={() => setCurrentFocus('button1')}
        data-testid="button1">
        Botón 1
      </button>

      <input
        type="text"
        onFocus={() => setCurrentFocus('input1')}
        data-testid="input1"
        placeholder="Input 1"
      />

      <a
        href="#"
        onFocus={() => setCurrentFocus('link1')}
        data-testid="link1">
        Enlace 1
      </a>

      <div
        role="button"
        tabIndex={0}
        onFocus={() => setCurrentFocus('div-button')}
        data-testid="div-button">
        Div clickeable
      </div>

      <button
        onFocus={() => setCurrentFocus('button2')}
        data-testid="button2">
        Botón 2
      </button>

      <div data-testid="focus-indicator">Foco actual: {currentFocus}</div>
    </div>
  );
};

describe('Keyboard Navigation Testing', () => {
  test('debe navegar con Tab', async () => {
    const user = userEvent.setup();
    render(<KeyboardNavigationComponent />);

    // Hacer Tab para navegar entre elementos
    await user.tab();
    expect(document.activeElement).toHaveAttribute('data-testid', 'button1');

    await user.tab();
    expect(document.activeElement).toHaveAttribute('data-testid', 'input1');

    await user.tab();
    expect(document.activeElement).toHaveAttribute('data-testid', 'link1');

    await user.tab();
    expect(document.activeElement).toHaveAttribute('data-testid', 'div-button');

    await user.tab();
    expect(document.activeElement).toHaveAttribute('data-testid', 'button2');
  });

  test('debe navegar hacia atrás con Shift+Tab', async () => {
    const user = userEvent.setup();
    render(<KeyboardNavigationComponent />);

    // Ir al último elemento
    await user.tab();
    await user.tab();
    await user.tab();
    await user.tab();
    await user.tab();

    expect(document.activeElement).toHaveAttribute('data-testid', 'button2');

    // Navegar hacia atrás
    await user.tab({ shift: true });
    expect(document.activeElement).toHaveAttribute('data-testid', 'div-button');

    await user.tab({ shift: true });
    expect(document.activeElement).toHaveAttribute('data-testid', 'link1');
  });

  test('debe activar elementos con Enter y Space', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(
      <div>
        <button
          onClick={handleClick}
          data-testid="button">
          Click me
        </button>
        <div
          role="button"
          tabIndex={0}
          onClick={handleClick}
          onKeyPress={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleClick();
            }
          }}
          data-testid="div-button">
          Div button
        </div>
      </div>
    );

    // Probar con botón normal
    await user.tab();
    await user.keyboard('[Enter]');
    expect(handleClick).toHaveBeenCalledTimes(1);

    await user.keyboard(' ');
    expect(handleClick).toHaveBeenCalledTimes(2);

    // Probar con div-button
    await user.tab();
    await user.keyboard('[Enter]');
    expect(handleClick).toHaveBeenCalledTimes(3);

    await user.keyboard(' ');
    expect(handleClick).toHaveBeenCalledTimes(4);
  });

  test('debe manejar escape en modales', async () => {
    const user = userEvent.setup();
    const handleClose = jest.fn();

    render(
      <div
        role="dialog"
        onKeyDown={e => {
          if (e.key === 'Escape') {
            handleClose();
          }
        }}
        tabIndex={-1}
        data-testid="modal">
        <button data-testid="modal-button">Botón en modal</button>
      </div>
    );

    // Enfocar el modal
    const modal = document.querySelector('[data-testid="modal"]');
    modal.focus();

    // Presionar Escape
    await user.keyboard('[Escape]');
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
```

### Paso 6: Testing de screen readers

```javascript
// src/tests/screen-reader.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';

// Componente para testing de screen readers
const ScreenReaderComponent = () => {
  const [announcements, setAnnouncements] = React.useState([]);

  const announce = message => {
    setAnnouncements(prev => [...prev, message]);
  };

  return (
    <div>
      <h1>Página de prueba</h1>

      {/* Región de anuncios para screen readers */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        data-testid="announcements">
        {announcements.map((announcement, index) => (
          <div key={index}>{announcement}</div>
        ))}
      </div>

      {/* Formulario con labels y descripciones */}
      <form>
        <label htmlFor="username">
          Nombre de usuario:
          <input
            id="username"
            type="text"
            required
            aria-describedby="username-help"
          />
        </label>
        <div id="username-help">
          Ingrese su nombre de usuario (mínimo 3 caracteres)
        </div>

        <label htmlFor="email">
          Email:
          <input
            id="email"
            type="email"
            required
            aria-describedby="email-help"
          />
        </label>
        <div id="email-help">Ingrese su dirección de email válida</div>

        <button
          type="button"
          onClick={() => announce('Formulario enviado exitosamente')}>
          Enviar
        </button>
      </form>

      {/* Lista con información semántica */}
      <ul aria-label="Lista de productos">
        <li>
          <h3>Producto 1</h3>
          <p>Descripción del producto 1</p>
          <span aria-label="Precio">$29.99</span>
        </li>
        <li>
          <h3>Producto 2</h3>
          <p>Descripción del producto 2</p>
          <span aria-label="Precio">$39.99</span>
        </li>
      </ul>

      {/* Botones con estados */}
      <button
        aria-pressed={false}
        aria-label="Activar modo oscuro"
        onClick={e => {
          const pressed = e.target.getAttribute('aria-pressed') === 'true';
          e.target.setAttribute('aria-pressed', !pressed);
          announce(
            pressed ? 'Modo oscuro desactivado' : 'Modo oscuro activado'
          );
        }}>
        🌙
      </button>

      {/* Región expandible */}
      <div>
        <button
          aria-expanded={false}
          aria-controls="details"
          onClick={e => {
            const expanded = e.target.getAttribute('aria-expanded') === 'true';
            e.target.setAttribute('aria-expanded', !expanded);
            document.getElementById('details').hidden = expanded;
          }}>
          Mostrar detalles
        </button>
        <div
          id="details"
          hidden>
          <p>Información adicional sobre el producto</p>
        </div>
      </div>
    </div>
  );
};

describe('Screen Reader Testing', () => {
  test('debe tener estructura semántica correcta', () => {
    render(<ScreenReaderComponent />);

    // Verificar headings
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(2);

    // Verificar formulario
    expect(screen.getByRole('form')).toBeInTheDocument();

    // Verificar lista
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  test('debe tener labels asociados correctamente', () => {
    render(<ScreenReaderComponent />);

    // Verificar que los inputs tienen labels
    expect(screen.getByLabelText('Nombre de usuario:')).toBeInTheDocument();
    expect(screen.getByLabelText('Email:')).toBeInTheDocument();

    // Verificar que los inputs tienen descripciones
    const usernameInput = screen.getByLabelText('Nombre de usuario:');
    expect(usernameInput).toHaveAttribute('aria-describedby', 'username-help');

    const emailInput = screen.getByLabelText('Email:');
    expect(emailInput).toHaveAttribute('aria-describedby', 'email-help');
  });

  test('debe tener atributos ARIA correctos', () => {
    render(<ScreenReaderComponent />);

    // Verificar aria-live region
    const announcements = screen.getByTestId('announcements');
    expect(announcements).toHaveAttribute('aria-live', 'polite');
    expect(announcements).toHaveAttribute('aria-atomic', 'true');

    // Verificar aria-label
    expect(screen.getByLabelText('Lista de productos')).toBeInTheDocument();
    expect(screen.getByLabelText('Activar modo oscuro')).toBeInTheDocument();

    // Verificar aria-pressed
    const toggleButton = screen.getByLabelText('Activar modo oscuro');
    expect(toggleButton).toHaveAttribute('aria-pressed', 'false');

    // Verificar aria-expanded y aria-controls
    const expandButton = screen.getByText('Mostrar detalles');
    expect(expandButton).toHaveAttribute('aria-expanded', 'false');
    expect(expandButton).toHaveAttribute('aria-controls', 'details');
  });

  test('debe anunciar cambios de estado', () => {
    render(<ScreenReaderComponent />);

    const submitButton = screen.getByText('Enviar');

    // Hacer clic en el botón
    submitButton.click();

    // Verificar que se agregó el anuncio
    const announcements = screen.getByTestId('announcements');
    expect(announcements).toHaveTextContent('Formulario enviado exitosamente');
  });

  test('debe tener información de precio accesible', () => {
    render(<ScreenReaderComponent />);

    const priceElements = screen.getAllByLabelText('Precio');
    expect(priceElements).toHaveLength(2);
    expect(priceElements[0]).toHaveTextContent('$29.99');
    expect(priceElements[1]).toHaveTextContent('$39.99');
  });
});
```

### Paso 7: Script de análisis de accesibilidad

```javascript
// scripts/accessibility-analysis.js
const puppeteer = require('puppeteer');
const axeCore = require('axe-core');
const fs = require('fs');

class AccessibilityAnalyzer {
  constructor(options = {}) {
    this.options = {
      url: options.url || 'http://localhost:3000',
      viewport: options.viewport || { width: 1280, height: 800 },
      output: options.output || 'accessibility-report.json',
      ...options,
    };
  }

  async analyze() {
    console.log('🔍 Iniciando análisis de accesibilidad...');

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
      await page.setViewport(this.options.viewport);
      await page.goto(this.options.url, { waitUntil: 'networkidle2' });

      // Inyectar axe-core
      await page.addScriptTag({ path: require.resolve('axe-core') });

      // Configurar y ejecutar axe
      const results = await page.evaluate(async () => {
        return await axe.run({
          includeTags: ['wcag2a', 'wcag2aa', 'wcag21aa'],
          rules: {
            'color-contrast': { enabled: true },
            'image-alt': { enabled: true },
            label: { enabled: true },
            'button-name': { enabled: true },
            'link-name': { enabled: true },
          },
        });
      });

      // Generar reporte
      const report = this.generateReport(results);

      // Guardar reporte
      fs.writeFileSync(this.options.output, JSON.stringify(report, null, 2));

      console.log(`📊 Reporte guardado en ${this.options.output}`);
      this.printSummary(report);

      return report;
    } catch (error) {
      console.error('❌ Error en análisis:', error);
      throw error;
    } finally {
      await browser.close();
    }
  }

  generateReport(results) {
    const violationsBySeverity = results.violations.reduce((acc, violation) => {
      const severity = violation.impact || 'unknown';
      if (!acc[severity]) acc[severity] = [];
      acc[severity].push(violation);
      return acc;
    }, {});

    const violationsByWCAG = results.violations.reduce((acc, violation) => {
      violation.tags.forEach(tag => {
        if (tag.startsWith('wcag')) {
          if (!acc[tag]) acc[tag] = [];
          acc[tag].push(violation);
        }
      });
      return acc;
    }, {});

    return {
      timestamp: new Date().toISOString(),
      url: this.options.url,
      summary: {
        violations: results.violations.length,
        passes: results.passes.length,
        critical: violationsBySeverity.critical?.length || 0,
        serious: violationsBySeverity.serious?.length || 0,
        moderate: violationsBySeverity.moderate?.length || 0,
        minor: violationsBySeverity.minor?.length || 0,
      },
      violations: results.violations,
      passes: results.passes,
      violationsBySeverity,
      violationsByWCAG,
      score: this.calculateScore(results),
      recommendations: this.generateRecommendations(results),
    };
  }

  calculateScore(results) {
    const weights = { critical: 10, serious: 7, moderate: 4, minor: 1 };
    const violationsBySeverity = results.violations.reduce((acc, violation) => {
      const severity = violation.impact || 'minor';
      acc[severity] = (acc[severity] || 0) + 1;
      return acc;
    }, {});

    const deductions = Object.entries(violationsBySeverity).reduce(
      (sum, [severity, count]) => {
        return sum + count * (weights[severity] || 1);
      },
      0
    );

    return Math.max(0, 100 - deductions);
  }

  generateRecommendations(results) {
    const recommendations = [];

    const commonIssues = results.violations.reduce((acc, violation) => {
      acc[violation.id] = (acc[violation.id] || 0) + 1;
      return acc;
    }, {});

    if (commonIssues['color-contrast']) {
      recommendations.push({
        priority: 'high',
        issue: 'Problemas de contraste de color',
        impact:
          'Los usuarios con discapacidades visuales pueden tener dificultades para leer el contenido',
        solution:
          'Asegurar un ratio de contraste mínimo de 4.5:1 para texto normal y 3:1 para texto grande',
      });
    }

    if (commonIssues['image-alt']) {
      recommendations.push({
        priority: 'high',
        issue: 'Imágenes sin texto alternativo',
        impact:
          'Los usuarios con screen readers no pueden acceder al contenido de las imágenes',
        solution:
          'Agregar atributos alt descriptivos a todas las imágenes significativas',
      });
    }

    if (commonIssues['label']) {
      recommendations.push({
        priority: 'critical',
        issue: 'Elementos de formulario sin etiquetas',
        impact:
          'Los usuarios no pueden identificar qué información se requiere en los campos',
        solution:
          'Asociar todas las entradas de formulario con etiquetas descriptivas',
      });
    }

    return recommendations;
  }

  printSummary(report) {
    console.log('\n' + '='.repeat(60));
    console.log('♿ REPORTE DE ACCESIBILIDAD');
    console.log('='.repeat(60));
    console.log(`🌐 URL: ${report.url}`);
    console.log(`📅 Fecha: ${report.timestamp}`);
    console.log(`🎯 Puntuación: ${report.score}/100`);
    console.log();

    console.log('📊 RESUMEN:');
    console.log(`   ✅ Pruebas pasadas: ${report.summary.passes}`);
    console.log(`   ❌ Violaciones: ${report.summary.violations}`);
    console.log(`   🔴 Críticas: ${report.summary.critical}`);
    console.log(`   🟠 Serias: ${report.summary.serious}`);
    console.log(`   🟡 Moderadas: ${report.summary.moderate}`);
    console.log(`   🔵 Menores: ${report.summary.minor}`);

    if (report.recommendations.length > 0) {
      console.log('\n💡 RECOMENDACIONES PRINCIPALES:');
      report.recommendations.slice(0, 3).forEach((rec, index) => {
        console.log(
          `   ${index + 1}. [${rec.priority.toUpperCase()}] ${rec.issue}`
        );
      });
    }

    console.log('\n' + '='.repeat(60));
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  const analyzer = new AccessibilityAnalyzer({
    url: process.argv[2] || 'http://localhost:3000',
  });

  analyzer.analyze().catch(error => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = AccessibilityAnalyzer;
```

### Paso 8: Configurar CI/CD para accessibility testing

```yaml
# .github/workflows/accessibility.yml
name: Accessibility Testing

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  accessibility-test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build

      - name: Start application
        run: |
          npm start &
          npx wait-on http://localhost:3000

      - name: Run accessibility tests
        run: |
          npm test -- --testNamePattern="accessibility"
          node scripts/accessibility-analysis.js

      - name: Upload accessibility report
        uses: actions/upload-artifact@v3
        with:
          name: accessibility-report
          path: accessibility-report.json

      - name: Comment PR with accessibility results
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const report = JSON.parse(fs.readFileSync('accessibility-report.json', 'utf8'));

            const comment = `
            ## ♿ Reporte de Accesibilidad

            **Puntuación:** ${report.score}/100
            **Violaciones:** ${report.summary.violations}
            **Críticas:** ${report.summary.critical}
            **Serias:** ${report.summary.serious}

            ${report.score < 80 ? '⚠️ La puntuación de accesibilidad está por debajo del umbral mínimo (80)' : '✅ La aplicación cumple con los estándares de accesibilidad'}

            ### Recomendaciones principales:
            ${report.recommendations.slice(0, 3).map((rec, i) => `${i + 1}. **${rec.issue}**: ${rec.solution}`).join('\n')}
            `;

            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: comment
            });
```

## 📊 Verificación

### Ejecutar análisis de accesibilidad

```bash
node scripts/accessibility-analysis.js
```

### Ejecutar tests de accesibilidad

```bash
npm test -- --testNamePattern="accessibility"
```

### Ejecutar tests de navegación por teclado

```bash
npm test -- --testNamePattern="keyboard"
```

### Ejecutar tests de screen reader

```bash
npm test -- --testNamePattern="screen-reader"
```

## 🎯 Criterios de Evaluación

### Testing Automático (30 puntos)

- [ ] Configuración de axe-core (10 pts)
- [ ] Tests de Jest con jest-axe (10 pts)
- [ ] Identificación de violaciones (10 pts)

### Testing Manual (25 puntos)

- [ ] Testing de navegación por teclado (15 pts)
- [ ] Testing de screen readers (10 pts)

### Herramientas y Análisis (25 puntos)

- [ ] Script de análisis automático (15 pts)
- [ ] Reportes detallados (10 pts)

### CI/CD y Automatización (20 puntos)

- [ ] Configuración de GitHub Actions (10 pts)
- [ ] Quality gates de accesibilidad (10 pts)

## 📚 Recursos Adicionales

- [Web Content Accessibility Guidelines (WCAG) 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [axe-core Documentation](https://github.com/dequelabs/axe-core)
- [jest-axe Documentation](https://github.com/nickcolley/jest-axe)
- [Accessibility Testing Guide](https://web.dev/accessibility-testing/)
- [Screen Reader Testing](https://webaim.org/articles/screenreader_testing/)
