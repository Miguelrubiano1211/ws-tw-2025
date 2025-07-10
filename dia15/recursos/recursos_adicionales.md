# 📚 Recursos Adicionales - Día 15: Performance Optimization

## 🔗 Enlaces Esenciales

### **Web Performance**
- [Web.dev Performance](https://web.dev/performance/) - Guía completa de Google
- [Core Web Vitals](https://web.dev/vitals/) - Métricas esenciales
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Herramienta de auditoría
- [WebPageTest](https://webpagetest.org/) - Testing avanzado de performance

### **React Performance**
- [React Performance](https://react.dev/learn/render-and-commit) - Documentación oficial
- [React Profiler](https://react.dev/blog/2018/09/10/introducing-the-react-profiler) - Herramienta de profiling
- [React.memo y useMemo](https://react.dev/reference/react/memo) - Optimización de re-renders

### **Bundle Optimization**
- [Webpack Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)
- [Code Splitting](https://webpack.js.org/guides/code-splitting/) - Documentación Webpack
- [Tree Shaking](https://webpack.js.org/guides/tree-shaking/) - Eliminación de código muerto

### **Image Optimization**
- [Next.js Image Component](https://nextjs.org/docs/api-reference/next/image) - Referencia
- [Sharp](https://sharp.pixelplumbing.com/) - Librería de procesamiento de imágenes
- [WebP vs AVIF](https://web.dev/compress-images-avif/) - Comparación de formatos

### **Caching Strategies**
- [HTTP Caching](https://web.dev/http-cache/) - Guía completa
- [Service Worker Caching](https://developers.google.com/web/ilt/pwa/caching-files-with-service-worker)
- [Redis Caching](https://redis.io/docs/manual/patterns/) - Patrones de caching

### **Backend Performance**
- [Express.js Performance](https://expressjs.com/en/advanced/best-practice-performance.html)
- [MongoDB Performance](https://docs.mongodb.com/manual/administration/analyzing-mongodb-performance/)
- [Node.js Performance](https://nodejs.org/en/docs/guides/simple-profiling/)

---

## 🛠️ Herramientas de Desarrollo

### **Performance Analysis**
```bash
# Lighthouse CLI
npm install -g lighthouse
lighthouse https://example.com --view

# WebPageTest API
npm install -g webpagetest
webpagetest test https://example.com

# Bundle Analyzer
npm install -g webpack-bundle-analyzer
webpack-bundle-analyzer build/static/js/*.js
```

### **Load Testing**
```bash
# Artillery
npm install -g artillery
artillery quick --count 10 --num 100 https://api.example.com

# K6
brew install k6
k6 run load-test.js

# Apache Bench
ab -n 1000 -c 10 https://example.com/
```

### **Monitoring Tools**
```bash
# New Relic
npm install newrelic

# DataDog
npm install dd-trace

# Prometheus + Grafana
npm install prom-client
```

---

## 📖 Guías de Referencia Rápida

### **Core Web Vitals - Valores Objetivo**

| Métrica | Bueno | Mejorable | Pobre |
|---------|-------|-----------|-------|
| **LCP (Largest Contentful Paint)** | ≤2.5s | 2.5s-4.0s | >4.0s |
| **FID (First Input Delay)** | ≤100ms | 100ms-300ms | >300ms |
| **CLS (Cumulative Layout Shift)** | ≤0.1 | 0.1-0.25 | >0.25 |
| **TTFB (Time to First Byte)** | ≤800ms | 800ms-1.8s | >1.8s |
| **TTI (Time to Interactive)** | ≤3.8s | 3.8s-7.3s | >7.3s |
| **FCP (First Contentful Paint)** | ≤1.8s | 1.8s-3.0s | >3.0s |

### **HTTP Cache Headers**

```http
# Assets estáticos (1 año)
Cache-Control: public, max-age=31536000, immutable
ETag: "abc123"

# API dinámicas (5 minutos)
Cache-Control: public, max-age=300, s-maxage=600
Vary: Accept-Encoding

# Contenido privado
Cache-Control: private, max-age=60, must-revalidate

# Sin cache
Cache-Control: no-cache, no-store, must-revalidate
```

### **Image Optimization Checklist**

- [ ] **Formatos modernos**: WebP, AVIF para navegadores compatibles
- [ ] **Responsive images**: `srcset` y `sizes` attributes
- [ ] **Lazy loading**: `loading="lazy"` para imágenes below-the-fold
- [ ] **Preload críticas**: `<link rel="preload" as="image">` para hero images
- [ ] **Dimensiones explícitas**: width/height para evitar CLS
- [ ] **Compresión optimizada**: Quality 80-85% para JPEG
- [ ] **CDN delivery**: Servir desde CDN geográficamente cercano

### **Bundle Optimization Checklist**

- [ ] **Code splitting**: Lazy loading de rutas y componentes
- [ ] **Tree shaking**: Eliminar código no utilizado
- [ ] **Chunk optimization**: Separar vendor, common y app bundles
- [ ] **Dynamic imports**: `import()` para cargas condicionales
- [ ] **Preloading**: `<link rel="modulepreload">` para chunks críticos
- [ ] **Minification**: Minificar JS, CSS y HTML
- [ ] **Compression**: Gzip/Brotli en servidor

### **React Performance Patterns**

```javascript
// 1. Memoización de componentes
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* render logic */}</div>;
});

// 2. Memoización de valores computados
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// 3. Memoización de callbacks
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);

// 4. Lazy loading de componentes
const LazyComponent = React.lazy(() => import('./LazyComponent'));

// 5. Virtual scrolling para listas grandes
import { FixedSizeList } from 'react-window';

// 6. Debouncing de inputs
const debouncedValue = useDebounce(value, 300);
```

---

## 🧪 Scripts de Testing

### **Performance Testing Script**

```bash
#!/bin/bash
# performance-test.sh

echo "🚀 Starting Performance Tests..."

# Build production
npm run build

# Lighthouse audit
lighthouse http://localhost:3000 \
  --output json \
  --output html \
  --output-path ./reports/lighthouse

# Bundle analysis
npx webpack-bundle-analyzer build/static/js/*.js \
  --report \
  --mode static \
  --output-directory ./reports/bundle

# Load testing
artillery run load-test.yml \
  --output ./reports/load-test.json

# Generate report
node scripts/generate-performance-report.js

echo "✅ Performance tests completed!"
```

### **Automated Performance Monitoring**

```javascript
// scripts/performance-monitor.js
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

const runPerformanceAudit = async (url) => {
  const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
  const options = {
    logLevel: 'info',
    output: 'json',
    onlyCategories: ['performance'],
    port: chrome.port,
  };

  const runnerResult = await lighthouse(url, options);
  await chrome.kill();

  const { lhr } = runnerResult;
  const { score } = lhr.categories.performance;

  return {
    score: Math.round(score * 100),
    metrics: {
      fcp: lhr.audits['first-contentful-paint'].numericValue,
      lcp: lhr.audits['largest-contentful-paint'].numericValue,
      cls: lhr.audits['cumulative-layout-shift'].numericValue,
      tti: lhr.audits['interactive'].numericValue,
      tbt: lhr.audits['total-blocking-time'].numericValue,
    }
  };
};

// Run and save results
runPerformanceAudit('http://localhost:3000')
  .then(results => {
    console.log('Performance Score:', results.score);
    console.log('Metrics:', results.metrics);
    
    // Save to file or send to monitoring service
    require('fs').writeFileSync(
      'performance-results.json', 
      JSON.stringify(results, null, 2)
    );
  });
```

---

## 📊 Métricas y KPIs

### **Business Impact Metrics**

| Optimización | Mejora Esperada | Impacto Business |
|--------------|-----------------|------------------|
| **LCP -50%** | 2.1s → 1.05s | +12% conversión |
| **Bundle -40%** | 2.8MB → 1.7MB | +8% mobile users |
| **API -60%** | 800ms → 320ms | +15% engagement |
| **Cache Hit 80%** | 15% → 80% | -65% server load |

### **Monitoring Dashboards**

```javascript
// Métricas para dashboard
const performanceKPIs = {
  // Core Web Vitals
  lcp: { target: 2500, current: 0, trend: [] },
  fid: { target: 100, current: 0, trend: [] },
  cls: { target: 0.1, current: 0, trend: [] },
  
  // Business Metrics
  bounceRate: { target: 0.3, current: 0, trend: [] },
  conversionRate: { target: 0.05, current: 0, trend: [] },
  averageSessionDuration: { target: 180, current: 0, trend: [] },
  
  // Technical Metrics
  bundleSize: { target: 1500000, current: 0, trend: [] },
  apiResponseTime: { target: 200, current: 0, trend: [] },
  cacheHitRatio: { target: 0.8, current: 0, trend: [] },
  errorRate: { target: 0.01, current: 0, trend: [] }
};
```

---

## 🏗️ Arquitectura de Referencia

### **Frontend Architecture**

```
src/
├── components/
│   ├── ui/                 # Componentes base optimizados
│   ├── optimized/          # Componentes con lazy loading
│   └── virtual/            # Virtual scrolling components
├── hooks/
│   ├── useOptimizedApi.ts  # API con cache
│   ├── useIntersection.ts  # Intersection Observer
│   └── useDebounce.ts      # Debouncing utilities
├── services/
│   ├── cacheManager.ts     # Client-side caching
│   ├── imageOptimizer.ts   # Image optimization
│   └── performanceTracker.ts # Performance monitoring
├── utils/
│   ├── lazyLoading.ts      # Lazy loading utilities
│   ├── bundleOptimizer.ts  # Bundle optimization
│   └── webVitals.ts        # Web Vitals tracking
└── workers/
    ├── sw.js               # Service Worker
    └── imageWorker.js      # Image processing worker
```

### **Backend Architecture**

```
backend/
├── middleware/
│   ├── compression.js      # Response compression
│   ├── caching.js          # HTTP caching headers
│   ├── rateLimit.js        # Rate limiting
│   └── monitoring.js       # Performance monitoring
├── services/
│   ├── cacheService.js     # Redis caching
│   ├── cdnService.js       # CDN integration
│   └── imageService.js     # Image optimization
├── models/
│   └── optimized/          # Optimized database models
├── controllers/
│   └── optimized/          # Cached controllers
└── utils/
    ├── queryOptimizer.js   # Database query optimization
    ├── compressionUtils.js # Compression utilities
    └── metricsCollector.js # Metrics collection
```

---

## 🎯 Checklist de Optimización

### **Pre-Deployment Checklist**

#### **Frontend**
- [ ] Bundle size < 1.5MB total
- [ ] Code splitting implementado
- [ ] Lazy loading para rutas
- [ ] Image optimization (WebP/AVIF)
- [ ] Service Worker configurado
- [ ] Performance monitoring activo
- [ ] Error boundaries implementados

#### **Backend**
- [ ] Database queries optimizadas
- [ ] Redis caching configurado
- [ ] Response compression activada
- [ ] Rate limiting implementado
- [ ] CDN configurado
- [ ] Monitoring y métricas activas
- [ ] Health checks funcionando

#### **Infrastructure**
- [ ] CDN configurado correctamente
- [ ] Gzip/Brotli habilitado
- [ ] HTTP/2 activado
- [ ] SSL/TLS optimizado
- [ ] DNS optimization
- [ ] Server-side caching

### **Post-Deployment Validation**

- [ ] Lighthouse score > 90
- [ ] Core Web Vitals en verde
- [ ] Load testing passed
- [ ] Monitoring alerts configurados
- [ ] Performance budget definido
- [ ] Regression testing setup

---

## 📈 Roadmap de Mejoras Continuas

### **Semana 1-2: Métricas Base**
- Implementar monitoring completo
- Establecer baseline de performance
- Configurar alertas

### **Semana 3-4: Optimizaciones Core**
- Bundle optimization
- Image optimization
- Caching strategies

### **Semana 5-6: Advanced Features**
- Service Workers
- Edge-side includes
- Advanced monitoring

### **Semana 7-8: Fine-tuning**
- Performance budget enforcement
- A/B testing de optimizaciones
- Documentation y training

---

## 🔧 Troubleshooting Common Issues

### **Bundle Size Issues**
```bash
# Analizar dependencias grandes
npx webpack-bundle-analyzer build/static/js/*.js

# Verificar tree shaking
npm ls --depth=0

# Check for duplicate packages
npx duplicate-package-checker-webpack-plugin
```

### **Image Loading Issues**
```javascript
// Debug lazy loading
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    console.log('Image intersection:', entry.isIntersecting);
  });
});
```

### **Cache Issues**
```bash
# Verificar headers de cache
curl -I https://example.com/api/data

# Check Service Worker cache
# DevTools > Application > Cache Storage
```

---

## 🏆 Recursos para Competencia WorldSkills

### **Preparation Tips**
1. **Practice timing**: Todas las optimizaciones en 60 minutos
2. **Know your tools**: Lighthouse, DevTools, Bundle Analyzer
3. **Memorize patterns**: Component optimization patterns
4. **Speed shortcuts**: CLI commands y snippets
5. **Testing strategy**: Automated validation scripts

### **Common Competition Tasks**
- Optimize existing slow application
- Implement caching strategies
- Reduce bundle size by X%
- Achieve specific Lighthouse scores
- Fix Core Web Vitals issues

### **Time Management**
- **15 min**: Analysis y planning
- **30 min**: Core optimizations
- **10 min**: Testing y validation
- **5 min**: Documentation y cleanup

---

¡Estos recursos te ayudarán a dominar la optimización de performance a nivel competitivo WorldSkills! 🚀
