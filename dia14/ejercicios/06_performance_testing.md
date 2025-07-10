# 🚀 Ejercicio 6: Performance Testing

## 📝 Descripción

Implementar testing de performance para aplicaciones web, incluyendo métricas de Web Vitals, lighthouse auditing, load testing, y optimización de recursos.

## 🎯 Objetivos

- Medir Web Vitals (LCP, FID, CLS)
- Implementar Lighthouse auditing automatizado
- Realizar load testing con Artillery
- Testear performance de APIs
- Optimizar recursos y assets
- Configurar monitoreo de performance

## 📋 Instrucciones

### Paso 1: Configurar Web Vitals

```javascript
// src/utils/webVitals.js
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

class WebVitalsReporter {
  constructor() {
    this.metrics = {};
    this.observers = [];
  }

  // Función para reportar métricas
  reportMetric(metric) {
    this.metrics[metric.name] = metric;

    // Enviar a analytics (opcional)
    if (window.gtag) {
      window.gtag('event', metric.name, {
        event_category: 'Web Vitals',
        event_label: metric.id,
        value: Math.round(metric.value),
        non_interaction: true,
      });
    }

    // Enviar a consola en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Web Vitals] ${metric.name}:`, metric);
    }

    // Trigger custom events
    this.notifyObservers(metric);
  }

  // Obtener todas las métricas
  getMetrics() {
    return this.metrics;
  }

  // Agregar observador para cambios en métricas
  addObserver(callback) {
    this.observers.push(callback);
  }

  // Notificar observadores
  notifyObservers(metric) {
    this.observers.forEach(callback => callback(metric));
  }

  // Inicializar medición de todas las métricas
  init() {
    // Largest Contentful Paint (LCP)
    getLCP(this.reportMetric.bind(this));

    // First Input Delay (FID)
    getFID(this.reportMetric.bind(this));

    // Cumulative Layout Shift (CLS)
    getCLS(this.reportMetric.bind(this));

    // First Contentful Paint (FCP)
    getFCP(this.reportMetric.bind(this));

    // Time to First Byte (TTFB)
    getTTFB(this.reportMetric.bind(this));
  }

  // Evaluar si las métricas están dentro de los rangos recomendados
  evaluateMetrics() {
    const evaluation = {};

    // Thresholds recomendados por Google
    const thresholds = {
      LCP: { good: 2500, needsImprovement: 4000 },
      FID: { good: 100, needsImprovement: 300 },
      CLS: { good: 0.1, needsImprovement: 0.25 },
      FCP: { good: 1800, needsImprovement: 3000 },
      TTFB: { good: 800, needsImprovement: 1800 },
    };

    Object.keys(thresholds).forEach(metricName => {
      const metric = this.metrics[metricName];
      const threshold = thresholds[metricName];

      if (metric) {
        if (metric.value <= threshold.good) {
          evaluation[metricName] = 'good';
        } else if (metric.value <= threshold.needsImprovement) {
          evaluation[metricName] = 'needs-improvement';
        } else {
          evaluation[metricName] = 'poor';
        }
      }
    });

    return evaluation;
  }

  // Generar reporte de performance
  generateReport() {
    const evaluation = this.evaluateMetrics();
    const report = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      metrics: this.metrics,
      evaluation,
      score: this.calculateScore(evaluation),
    };

    return report;
  }

  // Calcular puntuación general
  calculateScore(evaluation) {
    const scores = {
      good: 100,
      'needs-improvement': 50,
      poor: 0,
    };

    const values = Object.values(evaluation);
    const totalScore = values.reduce((sum, rating) => sum + scores[rating], 0);

    return Math.round(totalScore / values.length);
  }
}

export default WebVitalsReporter;

// Función para inicializar en la aplicación
export const initWebVitals = () => {
  const reporter = new WebVitalsReporter();
  reporter.init();

  // Agregar observador para mostrar alertas en desarrollo
  if (process.env.NODE_ENV === 'development') {
    reporter.addObserver(metric => {
      const thresholds = {
        LCP: 2500,
        FID: 100,
        CLS: 0.1,
        FCP: 1800,
        TTFB: 800,
      };

      if (metric.value > thresholds[metric.name]) {
        console.warn(
          `⚠️ Performance issue: ${metric.name} is ${
            metric.value
          }ms (threshold: ${thresholds[metric.name]}ms)`
        );
      }
    });
  }

  return reporter;
};
```

### Paso 2: Crear componente de Performance Monitor

```jsx
// src/components/PerformanceMonitor.jsx
import React, { useState, useEffect } from 'react';
import WebVitalsReporter from '../utils/webVitals';

const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({});
  const [evaluation, setEvaluation] = useState({});
  const [reporter, setReporter] = useState(null);

  useEffect(() => {
    const vitalsReporter = new WebVitalsReporter();
    vitalsReporter.init();

    vitalsReporter.addObserver(metric => {
      setMetrics(prev => ({
        ...prev,
        [metric.name]: metric,
      }));

      setEvaluation(vitalsReporter.evaluateMetrics());
    });

    setReporter(vitalsReporter);
  }, []);

  const getMetricColor = metricName => {
    const rating = evaluation[metricName];
    switch (rating) {
      case 'good':
        return 'text-green-600';
      case 'needs-improvement':
        return 'text-yellow-600';
      case 'poor':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getMetricIcon = metricName => {
    const rating = evaluation[metricName];
    switch (rating) {
      case 'good':
        return '✅';
      case 'needs-improvement':
        return '⚠️';
      case 'poor':
        return '❌';
      default:
        return '⏱️';
    }
  };

  const formatMetricValue = metric => {
    if (!metric) return 'N/A';

    if (metric.name === 'CLS') {
      return metric.value.toFixed(3);
    }

    return `${Math.round(metric.value)}ms`;
  };

  const exportReport = () => {
    if (reporter) {
      const report = reporter.generateReport();
      const blob = new Blob([JSON.stringify(report, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `performance-report-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const refreshMetrics = () => {
    window.location.reload();
  };

  if (process.env.NODE_ENV === 'production') {
    return null; // No mostrar en producción
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 max-w-sm z-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">Performance Monitor</h3>
        <div className="flex gap-2">
          <button
            onClick={refreshMetrics}
            className="text-blue-600 hover:text-blue-800 text-sm">
            🔄
          </button>
          <button
            onClick={exportReport}
            className="text-green-600 hover:text-green-800 text-sm">
            📊
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {['LCP', 'FID', 'CLS', 'FCP', 'TTFB'].map(metricName => (
          <div
            key={metricName}
            className="flex justify-between items-center">
            <span className="text-sm font-medium">
              {getMetricIcon(metricName)} {metricName}
            </span>
            <span className={`text-sm ${getMetricColor(metricName)}`}>
              {formatMetricValue(metrics[metricName])}
            </span>
          </div>
        ))}
      </div>

      {evaluation && Object.keys(evaluation).length > 0 && (
        <div className="mt-3 pt-3 border-t">
          <div className="text-sm text-gray-600">
            Score: {reporter?.calculateScore(evaluation) || 0}/100
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceMonitor;
```

### Paso 3: Configurar Lighthouse CI

```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000'],
      numberOfRuns: 5,
      settings: {
        chromeFlags: '--no-sandbox',
        preset: 'desktop',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.8 }],
        'categories:seo': ['warn', { minScore: 0.8 }],
        'categories:pwa': ['warn', { minScore: 0.6 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
```

### Paso 4: Script de análisis con Lighthouse

```javascript
// scripts/lighthouse-analysis.js
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

class LighthouseAnalyzer {
  constructor(options = {}) {
    this.options = {
      url: options.url || 'http://localhost:3000',
      output: options.output || 'lighthouse-report.json',
      view: options.view || false,
      ...options,
    };
  }

  async launchChrome() {
    return await chromeLauncher.launch({
      chromeFlags: ['--headless', '--no-sandbox'],
      port: 0,
    });
  }

  async runLighthouse(chrome) {
    const config = {
      extends: 'lighthouse:default',
      settings: {
        formFactor: 'desktop',
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
          requestLatencyMs: 0,
          downloadThroughputKbps: 0,
          uploadThroughputKbps: 0,
        },
        screenEmulation: {
          mobile: false,
          width: 1350,
          height: 940,
          deviceScaleFactor: 1,
          disabled: false,
        },
        emulatedUserAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
    };

    const options = {
      logLevel: 'info',
      output: 'json',
      onlyCategories: [
        'performance',
        'accessibility',
        'best-practices',
        'seo',
        'pwa',
      ],
      port: chrome.port,
    };

    return await lighthouse(this.options.url, options, config);
  }

  analyzeResults(results) {
    const { lhr } = results;

    const analysis = {
      url: lhr.finalUrl,
      timestamp: new Date().toISOString(),
      scores: {
        performance: Math.round(lhr.categories.performance.score * 100),
        accessibility: Math.round(lhr.categories.accessibility.score * 100),
        bestPractices: Math.round(lhr.categories['best-practices'].score * 100),
        seo: Math.round(lhr.categories.seo.score * 100),
        pwa: Math.round(lhr.categories.pwa.score * 100),
      },
      metrics: {
        firstContentfulPaint: lhr.audits['first-contentful-paint'].numericValue,
        largestContentfulPaint:
          lhr.audits['largest-contentful-paint'].numericValue,
        firstInputDelay: lhr.audits['max-potential-fid'].numericValue,
        cumulativeLayoutShift:
          lhr.audits['cumulative-layout-shift'].numericValue,
        speedIndex: lhr.audits['speed-index'].numericValue,
        timeToInteractive: lhr.audits['interactive'].numericValue,
        totalBlockingTime: lhr.audits['total-blocking-time'].numericValue,
      },
      opportunities: lhr.audits,
      diagnostics: this.extractDiagnostics(lhr.audits),
    };

    return analysis;
  }

  extractDiagnostics(audits) {
    const diagnostics = {};

    // Oportunidades de mejora
    const opportunities = [
      'unused-css-rules',
      'unused-javascript',
      'modern-image-formats',
      'next-gen-formats',
      'offscreen-images',
      'render-blocking-resources',
      'unminified-css',
      'unminified-javascript',
      'efficient-animated-content',
      'duplicated-javascript',
      'legacy-javascript',
    ];

    opportunities.forEach(audit => {
      if (audits[audit] && audits[audit].score < 1) {
        diagnostics[audit] = {
          score: audits[audit].score,
          numericValue: audits[audit].numericValue,
          displayValue: audits[audit].displayValue,
          description: audits[audit].description,
        };
      }
    });

    return diagnostics;
  }

  generateRecommendations(analysis) {
    const recommendations = [];

    // Recomendaciones basadas en scores
    if (analysis.scores.performance < 90) {
      recommendations.push({
        category: 'Performance',
        priority: 'high',
        message:
          'El puntaje de performance es bajo. Considere optimizar imágenes, CSS y JavaScript.',
        actions: [
          'Comprimir imágenes',
          'Minificar CSS y JavaScript',
          'Implementar lazy loading',
          'Optimizar Critical Rendering Path',
        ],
      });
    }

    if (analysis.scores.accessibility < 95) {
      recommendations.push({
        category: 'Accessibility',
        priority: 'high',
        message: 'Mejorar la accesibilidad es crucial para todos los usuarios.',
        actions: [
          'Agregar alt text a imágenes',
          'Mejorar contraste de colores',
          'Implementar navegación por teclado',
          'Agregar etiquetas ARIA',
        ],
      });
    }

    // Recomendaciones basadas en métricas
    if (analysis.metrics.largestContentfulPaint > 2500) {
      recommendations.push({
        category: 'Performance',
        priority: 'medium',
        message: 'LCP está por encima del umbral recomendado (2.5s)',
        actions: [
          'Optimizar imágenes hero',
          'Implementar preload para recursos críticos',
          'Optimizar servidor y CDN',
        ],
      });
    }

    if (analysis.metrics.cumulativeLayoutShift > 0.1) {
      recommendations.push({
        category: 'Performance',
        priority: 'medium',
        message: 'CLS está por encima del umbral recomendado (0.1)',
        actions: [
          'Definir dimensiones para imágenes',
          'Reservar espacio para contenido dinámico',
          'Evitar insertar contenido encima del fold',
        ],
      });
    }

    return recommendations;
  }

  async run() {
    console.log('🚀 Iniciando análisis de Lighthouse...');

    let chrome;
    try {
      chrome = await this.launchChrome();
      console.log(`✅ Chrome launched on port ${chrome.port}`);

      console.log(`🔍 Analizando ${this.options.url}...`);
      const results = await this.runLighthouse(chrome);

      const analysis = this.analyzeResults(results);
      const recommendations = this.generateRecommendations(analysis);

      const report = {
        ...analysis,
        recommendations,
        rawResults: results.lhr,
      };

      // Guardar reporte
      fs.writeFileSync(this.options.output, JSON.stringify(report, null, 2));
      console.log(`📊 Reporte guardado en ${this.options.output}`);

      // Mostrar resumen
      this.printSummary(analysis, recommendations);

      return report;
    } catch (error) {
      console.error('❌ Error en análisis de Lighthouse:', error);
      throw error;
    } finally {
      if (chrome) {
        await chrome.kill();
      }
    }
  }

  printSummary(analysis, recommendations) {
    console.log('\n' + '='.repeat(60));
    console.log('📋 RESUMEN DE LIGHTHOUSE');
    console.log('='.repeat(60));
    console.log(`🌐 URL: ${analysis.url}`);
    console.log(`📅 Fecha: ${analysis.timestamp}`);
    console.log();

    console.log('🏆 PUNTUACIONES:');
    Object.entries(analysis.scores).forEach(([category, score]) => {
      const emoji = score >= 90 ? '✅' : score >= 80 ? '⚠️' : '❌';
      console.log(`   ${emoji} ${category}: ${score}/100`);
    });

    console.log('\n⚡ MÉTRICAS CORE WEB VITALS:');
    console.log(
      `   LCP: ${Math.round(analysis.metrics.largestContentfulPaint)}ms`
    );
    console.log(`   FID: ${Math.round(analysis.metrics.firstInputDelay)}ms`);
    console.log(`   CLS: ${analysis.metrics.cumulativeLayoutShift.toFixed(3)}`);

    if (recommendations.length > 0) {
      console.log('\n💡 RECOMENDACIONES:');
      recommendations.forEach((rec, index) => {
        console.log(
          `   ${index + 1}. [${rec.priority.toUpperCase()}] ${rec.message}`
        );
      });
    }

    console.log('\n' + '='.repeat(60));
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  const analyzer = new LighthouseAnalyzer({
    url: process.argv[2] || 'http://localhost:3000',
  });

  analyzer.run().catch(error => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = LighthouseAnalyzer;
```

### Paso 5: Configurar Artillery para Load Testing

```yaml
# artillery/load-test.yml
config:
  target: 'http://localhost:3001'
  phases:
    - duration: 60
      arrivalRate: 10
      name: 'Warm up'
    - duration: 120
      arrivalRate: 20
      name: 'Ramp up load'
    - duration: 180
      arrivalRate: 50
      name: 'Sustained load'
    - duration: 60
      arrivalRate: 100
      name: 'Peak load'
    - duration: 60
      arrivalRate: 10
      name: 'Cool down'
  defaults:
    headers:
      content-type: 'application/json'
  environments:
    production:
      target: 'https://api.example.com'
      phases:
        - duration: 300
          arrivalRate: 100
    staging:
      target: 'https://staging-api.example.com'
      phases:
        - duration: 120
          arrivalRate: 25

scenarios:
  - name: 'API Health Check'
    weight: 10
    flow:
      - get:
          url: '/health'
          expect:
            - statusCode: 200
            - hasHeader: 'content-type'

  - name: 'User Authentication'
    weight: 20
    flow:
      - post:
          url: '/api/auth/login'
          json:
            email: 'test@example.com'
            password: 'password123'
          capture:
            - json: '$.token'
              as: 'authToken'
          expect:
            - statusCode: 200
            - hasProperty: 'token'

  - name: 'Get Products'
    weight: 30
    flow:
      - get:
          url: '/api/products'
          qs:
            page: 1
            limit: 10
          expect:
            - statusCode: 200
            - hasProperty: 'products'
      - think: 2

  - name: 'Create Product'
    weight: 20
    flow:
      - post:
          url: '/api/auth/login'
          json:
            email: 'admin@test.com'
            password: 'admin123'
          capture:
            - json: '$.token'
              as: 'authToken'
      - post:
          url: '/api/products'
          headers:
            Authorization: 'Bearer {{ authToken }}'
          json:
            name: 'Test Product {{ $randomString() }}'
            price: '{{ $randomNumber(10, 100) }}'
            stock: '{{ $randomNumber(1, 50) }}'
          expect:
            - statusCode: 201

  - name: 'Update Product'
    weight: 15
    flow:
      - post:
          url: '/api/auth/login'
          json:
            email: 'admin@test.com'
            password: 'admin123'
          capture:
            - json: '$.token'
              as: 'authToken'
      - get:
          url: '/api/products'
          capture:
            - json: '$.products[0].id'
              as: 'productId'
      - put:
          url: '/api/products/{{ productId }}'
          headers:
            Authorization: 'Bearer {{ authToken }}'
          json:
            name: 'Updated Product {{ $randomString() }}'
            price: '{{ $randomNumber(10, 100) }}'
          expect:
            - statusCode: 200

  - name: 'Delete Product'
    weight: 5
    flow:
      - post:
          url: '/api/auth/login'
          json:
            email: 'admin@test.com'
            password: 'admin123'
          capture:
            - json: '$.token'
              as: 'authToken'
      - get:
          url: '/api/products'
          capture:
            - json: '$.products[0].id'
              as: 'productId'
      - delete:
          url: '/api/products/{{ productId }}'
          headers:
            Authorization: 'Bearer {{ authToken }}'
          expect:
            - statusCode: 200

functions:
  randomString:
    - Math.random().toString(36).substring(7)
  randomNumber:
    - (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
```

### Paso 6: Script de análisis de performance

```javascript
// scripts/performance-analysis.js
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class PerformanceAnalyzer {
  constructor() {
    this.results = {
      lighthouse: null,
      loadTest: null,
      bundleAnalysis: null,
      networkAnalysis: null,
    };
  }

  async runLighthouseAnalysis() {
    console.log('🔍 Ejecutando análisis de Lighthouse...');

    return new Promise((resolve, reject) => {
      const lighthouse = spawn('node', ['scripts/lighthouse-analysis.js'], {
        stdio: 'inherit',
      });

      lighthouse.on('close', code => {
        if (code === 0) {
          try {
            const report = JSON.parse(
              fs.readFileSync('lighthouse-report.json', 'utf8')
            );
            this.results.lighthouse = report;
            resolve(report);
          } catch (error) {
            reject(error);
          }
        } else {
          reject(new Error(`Lighthouse analysis failed with code ${code}`));
        }
      });
    });
  }

  async runLoadTest() {
    console.log('🚀 Ejecutando load test con Artillery...');

    return new Promise((resolve, reject) => {
      const artillery = spawn(
        'npx',
        [
          'artillery',
          'run',
          'artillery/load-test.yml',
          '--output',
          'load-test-results.json',
        ],
        {
          stdio: 'pipe',
        }
      );

      let stdout = '';
      let stderr = '';

      artillery.stdout.on('data', data => {
        stdout += data.toString();
        process.stdout.write(data);
      });

      artillery.stderr.on('data', data => {
        stderr += data.toString();
        process.stderr.write(data);
      });

      artillery.on('close', code => {
        if (code === 0) {
          try {
            const results = JSON.parse(
              fs.readFileSync('load-test-results.json', 'utf8')
            );
            this.results.loadTest = this.analyzeLoadTestResults(results);
            resolve(this.results.loadTest);
          } catch (error) {
            reject(error);
          }
        } else {
          reject(new Error(`Load test failed with code ${code}: ${stderr}`));
        }
      });
    });
  }

  analyzeLoadTestResults(results) {
    const summary = results.aggregate;

    return {
      summary: {
        scenarios: summary.scenariosCreated,
        requests: summary.requestsCompleted,
        errors: summary.errors,
        duration: summary.phases?.[0]?.duration || 0,
      },
      latency: {
        min: summary.latency?.min || 0,
        max: summary.latency?.max || 0,
        median: summary.latency?.median || 0,
        p95: summary.latency?.p95 || 0,
        p99: summary.latency?.p99 || 0,
      },
      throughput: {
        rps: summary.rps?.mean || 0,
        requestsPerSecond:
          summary.requestsCompleted / (summary.phases?.[0]?.duration || 1),
      },
      errors: {
        total: summary.errors || 0,
        rate: ((summary.errors || 0) / summary.requestsCompleted) * 100,
      },
    };
  }

  async analyzeBundleSize() {
    console.log('📦 Analizando tamaño del bundle...');

    try {
      const buildPath = path.join(process.cwd(), 'build');

      if (!fs.existsSync(buildPath)) {
        console.log('⚠️ Build folder not found, running build...');
        await this.runBuild();
      }

      const analysis = await this.getBundleAnalysis(buildPath);
      this.results.bundleAnalysis = analysis;

      return analysis;
    } catch (error) {
      console.error('❌ Error analyzing bundle:', error);
      throw error;
    }
  }

  async runBuild() {
    return new Promise((resolve, reject) => {
      const build = spawn('npm', ['run', 'build'], {
        stdio: 'inherit',
      });

      build.on('close', code => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Build failed with code ${code}`));
        }
      });
    });
  }

  async getBundleAnalysis(buildPath) {
    const staticPath = path.join(buildPath, 'static');
    const analysis = {
      totalSize: 0,
      jsFiles: [],
      cssFiles: [],
      mediaFiles: [],
      recommendations: [],
    };

    if (fs.existsSync(staticPath)) {
      const jsPath = path.join(staticPath, 'js');
      const cssPath = path.join(staticPath, 'css');
      const mediaPath = path.join(staticPath, 'media');

      if (fs.existsSync(jsPath)) {
        analysis.jsFiles = this.analyzeFiles(jsPath, '.js');
      }

      if (fs.existsSync(cssPath)) {
        analysis.cssFiles = this.analyzeFiles(cssPath, '.css');
      }

      if (fs.existsSync(mediaPath)) {
        analysis.mediaFiles = this.analyzeFiles(mediaPath, [
          '.png',
          '.jpg',
          '.jpeg',
          '.svg',
          '.gif',
        ]);
      }

      analysis.totalSize = [
        ...analysis.jsFiles,
        ...analysis.cssFiles,
        ...analysis.mediaFiles,
      ].reduce((sum, file) => sum + file.size, 0);

      analysis.recommendations = this.generateBundleRecommendations(analysis);
    }

    return analysis;
  }

  analyzeFiles(dirPath, extensions) {
    const files = [];
    const items = fs.readdirSync(dirPath);

    items.forEach(item => {
      const filePath = path.join(dirPath, item);
      const stats = fs.statSync(filePath);

      if (stats.isFile()) {
        const ext = path.extname(item);
        const shouldInclude = Array.isArray(extensions)
          ? extensions.includes(ext)
          : ext === extensions;

        if (shouldInclude) {
          files.push({
            name: item,
            size: stats.size,
            sizeKB: Math.round(stats.size / 1024),
            path: filePath,
          });
        }
      }
    });

    return files.sort((a, b) => b.size - a.size);
  }

  generateBundleRecommendations(analysis) {
    const recommendations = [];

    // Verificar tamaño total
    const totalSizeMB = analysis.totalSize / (1024 * 1024);
    if (totalSizeMB > 5) {
      recommendations.push({
        type: 'bundle-size',
        priority: 'high',
        message: `El bundle total (${totalSizeMB.toFixed(2)}MB) es muy grande`,
        actions: [
          'Implementar code splitting',
          'Usar lazy loading para componentes',
          'Optimizar imágenes',
          'Remover dependencias no utilizadas',
        ],
      });
    }

    // Verificar archivos JS grandes
    const largeJSFiles = analysis.jsFiles.filter(
      file => file.size > 500 * 1024
    );
    if (largeJSFiles.length > 0) {
      recommendations.push({
        type: 'js-optimization',
        priority: 'medium',
        message: `${largeJSFiles.length} archivos JS son muy grandes`,
        actions: [
          'Implementar tree shaking',
          'Dividir chunks por rutas',
          'Optimizar imports dinámicos',
        ],
      });
    }

    // Verificar imágenes grandes
    const largeImages = analysis.mediaFiles.filter(
      file => file.size > 1024 * 1024
    );
    if (largeImages.length > 0) {
      recommendations.push({
        type: 'image-optimization',
        priority: 'high',
        message: `${largeImages.length} imágenes son muy grandes`,
        actions: [
          'Comprimir imágenes',
          'Usar formatos modernos (WebP, AVIF)',
          'Implementar lazy loading',
          'Usar responsive images',
        ],
      });
    }

    return recommendations;
  }

  generatePerformanceReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        lighthouseScore: this.results.lighthouse?.scores?.performance || 0,
        loadTestPassed: this.results.loadTest?.errors?.rate < 5,
        bundleSizeOptimal:
          (this.results.bundleAnalysis?.totalSize || 0) < 5 * 1024 * 1024,
        overallGrade: this.calculateOverallGrade(),
      },
      details: this.results,
      recommendations: this.generateAllRecommendations(),
    };

    // Guardar reporte
    fs.writeFileSync(
      'performance-report.json',
      JSON.stringify(report, null, 2)
    );

    return report;
  }

  calculateOverallGrade() {
    let score = 0;
    let maxScore = 0;

    // Lighthouse (40 puntos)
    if (this.results.lighthouse) {
      maxScore += 40;
      score += (this.results.lighthouse.scores.performance / 100) * 40;
    }

    // Load Test (30 puntos)
    if (this.results.loadTest) {
      maxScore += 30;
      const errorRate = this.results.loadTest.errors.rate;
      if (errorRate < 1) score += 30;
      else if (errorRate < 5) score += 20;
      else if (errorRate < 10) score += 10;
    }

    // Bundle Analysis (30 puntos)
    if (this.results.bundleAnalysis) {
      maxScore += 30;
      const sizeMB = this.results.bundleAnalysis.totalSize / (1024 * 1024);
      if (sizeMB < 2) score += 30;
      else if (sizeMB < 5) score += 20;
      else if (sizeMB < 10) score += 10;
    }

    const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;

    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  }

  generateAllRecommendations() {
    const recommendations = [];

    if (this.results.lighthouse?.recommendations) {
      recommendations.push(...this.results.lighthouse.recommendations);
    }

    if (this.results.bundleAnalysis?.recommendations) {
      recommendations.push(...this.results.bundleAnalysis.recommendations);
    }

    if (this.results.loadTest?.errors?.rate > 5) {
      recommendations.push({
        type: 'load-test',
        priority: 'high',
        message: 'Alta tasa de errores en load test',
        actions: [
          'Optimizar queries de base de datos',
          'Implementar cache',
          'Mejorar gestión de memoria',
          'Configurar auto-scaling',
        ],
      });
    }

    return recommendations;
  }

  printReport(report) {
    console.log('\n' + '='.repeat(60));
    console.log('🚀 REPORTE DE PERFORMANCE');
    console.log('='.repeat(60));
    console.log(`📅 Fecha: ${report.timestamp}`);
    console.log(`🎯 Calificación: ${report.summary.overallGrade}`);
    console.log();

    if (report.details.lighthouse) {
      console.log('🏆 LIGHTHOUSE SCORES:');
      Object.entries(report.details.lighthouse.scores).forEach(
        ([category, score]) => {
          const emoji = score >= 90 ? '✅' : score >= 80 ? '⚠️' : '❌';
          console.log(`   ${emoji} ${category}: ${score}/100`);
        }
      );
    }

    if (report.details.loadTest) {
      console.log('\n🚀 LOAD TEST RESULTS:');
      const lt = report.details.loadTest;
      console.log(`   📊 Requests: ${lt.summary.requests}`);
      console.log(`   ⚡ RPS: ${lt.throughput.rps.toFixed(2)}`);
      console.log(`   📈 P95 Latency: ${lt.latency.p95}ms`);
      console.log(`   ❌ Error Rate: ${lt.errors.rate.toFixed(2)}%`);
    }

    if (report.details.bundleAnalysis) {
      console.log('\n📦 BUNDLE ANALYSIS:');
      const ba = report.details.bundleAnalysis;
      console.log(
        `   💾 Total Size: ${(ba.totalSize / (1024 * 1024)).toFixed(2)}MB`
      );
      console.log(`   📄 JS Files: ${ba.jsFiles.length}`);
      console.log(`   🎨 CSS Files: ${ba.cssFiles.length}`);
      console.log(`   🖼️ Media Files: ${ba.mediaFiles.length}`);
    }

    if (report.recommendations.length > 0) {
      console.log('\n💡 RECOMENDACIONES:');
      report.recommendations.forEach((rec, index) => {
        console.log(
          `   ${index + 1}. [${rec.priority.toUpperCase()}] ${rec.message}`
        );
      });
    }

    console.log('\n' + '='.repeat(60));
  }

  async run() {
    console.log('🚀 Iniciando análisis completo de performance...\n');

    try {
      await this.runLighthouseAnalysis();
      await this.runLoadTest();
      await this.analyzeBundleSize();

      const report = this.generatePerformanceReport();
      this.printReport(report);

      return report;
    } catch (error) {
      console.error('❌ Error en análisis de performance:', error);
      throw error;
    }
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  const analyzer = new PerformanceAnalyzer();
  analyzer.run().catch(error => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = PerformanceAnalyzer;
```

### Paso 7: Tests de performance

```javascript
// src/tests/performance.test.js
const PerformanceAnalyzer = require('../scripts/performance-analysis');
const LighthouseAnalyzer = require('../scripts/lighthouse-analysis');

describe('Performance Testing', () => {
  let analyzer;
  let lighthouseAnalyzer;

  beforeAll(() => {
    analyzer = new PerformanceAnalyzer();
    lighthouseAnalyzer = new LighthouseAnalyzer();
  });

  describe('Lighthouse Analysis', () => {
    test('debe tener puntaje de performance > 80', async () => {
      const report = await lighthouseAnalyzer.run();
      expect(report.scores.performance).toBeGreaterThan(80);
    }, 60000);

    test('debe tener puntaje de accessibility > 90', async () => {
      const report = await lighthouseAnalyzer.run();
      expect(report.scores.accessibility).toBeGreaterThan(90);
    }, 60000);

    test('LCP debe ser < 2.5s', async () => {
      const report = await lighthouseAnalyzer.run();
      expect(report.metrics.largestContentfulPaint).toBeLessThan(2500);
    }, 60000);

    test('CLS debe ser < 0.1', async () => {
      const report = await lighthouseAnalyzer.run();
      expect(report.metrics.cumulativeLayoutShift).toBeLessThan(0.1);
    }, 60000);
  });

  describe('Bundle Analysis', () => {
    test('bundle total debe ser < 5MB', async () => {
      const analysis = await analyzer.analyzeBundleSize();
      const sizeMB = analysis.totalSize / (1024 * 1024);
      expect(sizeMB).toBeLessThan(5);
    });

    test('no debe tener archivos JS > 1MB', async () => {
      const analysis = await analyzer.analyzeBundleSize();
      const largeFiles = analysis.jsFiles.filter(
        file => file.size > 1024 * 1024
      );
      expect(largeFiles.length).toBe(0);
    });

    test('no debe tener imágenes > 2MB', async () => {
      const analysis = await analyzer.analyzeBundleSize();
      const largeImages = analysis.mediaFiles.filter(
        file => file.size > 2 * 1024 * 1024
      );
      expect(largeImages.length).toBe(0);
    });
  });

  describe('Load Testing', () => {
    test('tasa de errores debe ser < 5%', async () => {
      const results = await analyzer.runLoadTest();
      expect(results.errors.rate).toBeLessThan(5);
    }, 300000); // 5 minutos

    test('P95 latency debe ser < 1000ms', async () => {
      const results = await analyzer.runLoadTest();
      expect(results.latency.p95).toBeLessThan(1000);
    }, 300000);

    test('debe manejar al menos 50 RPS', async () => {
      const results = await analyzer.runLoadTest();
      expect(results.throughput.rps).toBeGreaterThan(50);
    }, 300000);
  });

  describe('Web Vitals', () => {
    test('debe medir Core Web Vitals', () => {
      // Mock de window para testing
      global.window = {
        gtag: jest.fn(),
        location: { href: 'http://localhost:3000' },
      };

      const WebVitalsReporter = require('../utils/webVitals').default;
      const reporter = new WebVitalsReporter();

      expect(reporter).toBeDefined();
      expect(typeof reporter.init).toBe('function');
      expect(typeof reporter.getMetrics).toBe('function');
      expect(typeof reporter.evaluateMetrics).toBe('function');
    });

    test('debe evaluar métricas correctamente', () => {
      const WebVitalsReporter = require('../utils/webVitals').default;
      const reporter = new WebVitalsReporter();

      // Mock de métricas
      reporter.metrics = {
        LCP: { value: 2000 },
        FID: { value: 80 },
        CLS: { value: 0.05 },
      };

      const evaluation = reporter.evaluateMetrics();
      expect(evaluation.LCP).toBe('good');
      expect(evaluation.FID).toBe('good');
      expect(evaluation.CLS).toBe('good');
    });

    test('debe calcular score correctamente', () => {
      const WebVitalsReporter = require('../utils/webVitals').default;
      const reporter = new WebVitalsReporter();

      const evaluation = {
        LCP: 'good',
        FID: 'good',
        CLS: 'needs-improvement',
      };

      const score = reporter.calculateScore(evaluation);
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });
});
```

## 📊 Verificación

### Ejecutar análisis completo de performance

```bash
node scripts/performance-analysis.js
```

### Ejecutar solo Lighthouse

```bash
node scripts/lighthouse-analysis.js
```

### Ejecutar load test

```bash
npx artillery run artillery/load-test.yml
```

### Ejecutar tests de performance

```bash
npm test -- --testPathPattern="performance"
```

## 🎯 Criterios de Evaluación

### Web Vitals y Lighthouse (30 puntos)

- [ ] Configuración de Web Vitals (10 pts)
- [ ] Lighthouse score > 80 (10 pts)
- [ ] Core Web Vitals dentro de umbrales (10 pts)

### Load Testing (25 puntos)

- [ ] Configuración de Artillery (10 pts)
- [ ] Escenarios de prueba completos (10 pts)
- [ ] Análisis de resultados (5 pts)

### Bundle Analysis (25 puntos)

- [ ] Análisis de tamaño de bundle (15 pts)
- [ ] Recomendaciones de optimización (10 pts)

### Automatización y Reporting (20 puntos)

- [ ] Scripts de análisis automatizados (10 pts)
- [ ] Reportes comprensivos (10 pts)

## 📚 Recursos Adicionales

- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [Artillery Documentation](https://artillery.io/docs/)
- [Performance Best Practices](https://web.dev/fast/)
