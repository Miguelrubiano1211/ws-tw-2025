# 🛠️ Guía de Herramientas - Día 15: Performance Optimization

## 🚀 Setup de Herramientas Esenciales

### **1. Lighthouse y DevTools**

```bash
# Lighthouse CLI Global
npm install -g lighthouse

# Lighthouse CI para integración continua
npm install -g @lhci/cli

# Uso básico
lighthouse https://example.com --view
lighthouse https://example.com --output json --output-path ./report.json

# Lighthouse CI config
# lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000'],
      numberOfRuns: 3
    },
    assert: {
      assertions: {
        'categories:performance': ['error', {minScore: 0.9}],
        'categories:accessibility': ['error', {minScore: 0.9}],
        'categories:best-practices': ['error', {minScore: 0.9}],
        'categories:seo': ['error', {minScore: 0.9}]
      }
    }
  }
};
```

### **2. Bundle Analysis Tools**

```bash
# Webpack Bundle Analyzer
npm install --save-dev webpack-bundle-analyzer

# Para Create React App con CRACO
npm install --save-dev @craco/craco
```

```javascript
// craco.config.js
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  webpack: {
    plugins: [
      ...(process.env.ANALYZE ? [new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        openAnalyzer: true
      })] : [])
    ]
  }
};
```

```json
// package.json scripts
{
  "scripts": {
    "analyze": "ANALYZE=true npm run build",
    "build:analyze": "npm run build && npx webpack-bundle-analyzer build/static/js/*.js"
  }
}
```

### **3. Performance Monitoring Tools**

```bash
# Web Vitals
npm install web-vitals

# Performance Observer polyfill
npm install perfmetrics

# React DevTools Profiler
# Available in React DevTools browser extension
```

```javascript
// src/utils/webVitals.js
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

const sendToAnalytics = (metric) => {
  console.log(metric);
  // Send to your analytics service
  fetch('/api/analytics', {
    method: 'POST',
    body: JSON.stringify(metric),
    headers: { 'Content-Type': 'application/json' }
  });
};

// Measure all Web Vitals
getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### **4. Load Testing Tools**

```bash
# Artillery - Modern load testing
npm install -g artillery

# K6 - Developer-centric load testing
brew install k6  # macOS
# or
sudo apt-get install k6  # Ubuntu/Debian
```

```yaml
# artillery-config.yml
config:
  target: 'http://localhost:3001'
  phases:
    - duration: 60
      arrivalRate: 10
    - duration: 120
      arrivalRate: 50
    - duration: 60
      arrivalRate: 100
scenarios:
  - name: "API Load Test"
    requests:
      - get:
          url: "/api/products"
      - post:
          url: "/api/products"
          json:
            name: "Test Product"
            price: 29.99
```

```javascript
// k6-load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 10, // Virtual users
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests under 500ms
    http_req_failed: ['rate<0.1'],    // Error rate under 10%
  },
};

export default function() {
  let response = http.get('http://localhost:3001/api/products');
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  sleep(1);
}
```

---

## 📊 Chrome DevTools Avanzado

### **Performance Tab Workflow**

```javascript
// 1. Marcar eventos personalizados
performance.mark('api-call-start');
fetch('/api/data').then(() => {
  performance.mark('api-call-end');
  performance.measure('api-call', 'api-call-start', 'api-call-end');
});

// 2. User Timing API para debugging
const measureRender = (componentName) => {
  return {
    start: () => performance.mark(`${componentName}-render-start`),
    end: () => {
      performance.mark(`${componentName}-render-end`);
      performance.measure(
        `${componentName}-render`,
        `${componentName}-render-start`,
        `${componentName}-render-end`
      );
    }
  };
};

// 3. Long Task Observer
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.warn('Long task detected:', entry.duration);
  }
});
observer.observe({ entryTypes: ['longtask'] });
```

### **Network Tab Optimization**

```javascript
// Headers para debugging de cache
const debugHeaders = {
  'X-Debug-Cache': 'enabled',
  'X-Request-ID': generateRequestId(),
  'X-Client-Time': Date.now().toString()
};

// Interceptar requests para análisis
const originalFetch = window.fetch;
window.fetch = function(...args) {
  const start = performance.now();
  return originalFetch.apply(this, args).then(response => {
    const end = performance.now();
    console.log(`Request to ${args[0]} took ${end - start}ms`);
    return response;
  });
};
```

### **Memory Tab Workflow**

```javascript
// 1. Memory leak detection
const trackMemory = () => {
  if (performance.memory) {
    console.log({
      used: Math.round(performance.memory.usedJSHeapSize / 1048576),
      total: Math.round(performance.memory.totalJSHeapSize / 1048576),
      limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
    });
  }
};

// 2. Cleanup tracking
const cleanupTrackers = new Set();
const trackCleanup = (cleanup) => {
  cleanupTrackers.add(cleanup);
  return () => {
    cleanup();
    cleanupTrackers.delete(cleanup);
  };
};

// 3. Component memory usage
const useMemoryTracker = (componentName) => {
  useEffect(() => {
    console.log(`${componentName} mounted`);
    trackMemory();
    
    return () => {
      console.log(`${componentName} unmounted`);
      trackMemory();
    };
  }, []);
};
```

---

## 🖼️ Image Optimization Tools

### **Sharp para Node.js**

```bash
npm install sharp
```

```javascript
// backend/utils/imageOptimizer.js
const sharp = require('sharp');
const path = require('path');

class ImageOptimizer {
  static async optimizeImage(inputBuffer, options = {}) {
    const {
      width = 1920,
      quality = 85,
      format = 'jpeg',
      progressive = true
    } = options;

    try {
      let processor = sharp(inputBuffer);

      // Resize si es necesario
      if (width) {
        processor = processor.resize(width, null, {
          withoutEnlargement: true,
          fit: 'inside'
        });
      }

      // Aplicar formato y calidad
      switch (format) {
        case 'webp':
          processor = processor.webp({ quality });
          break;
        case 'avif':
          processor = processor.avif({ quality });
          break;
        case 'jpeg':
        default:
          processor = processor.jpeg({ quality, progressive });
      }

      return await processor.toBuffer();
    } catch (error) {
      console.error('Image optimization failed:', error);
      throw error;
    }
  }

  static async generateResponsiveImages(inputBuffer) {
    const sizes = [480, 768, 1024, 1440, 1920];
    const formats = ['webp', 'jpeg'];
    const results = {};

    for (const size of sizes) {
      results[size] = {};
      for (const format of formats) {
        try {
          const optimized = await this.optimizeImage(inputBuffer, {
            width: size,
            format,
            quality: format === 'webp' ? 80 : 85
          });
          results[size][format] = optimized;
        } catch (error) {
          console.error(`Failed to generate ${format} at ${size}px:`, error);
        }
      }
    }

    return results;
  }
}

module.exports = ImageOptimizer;
```

### **Frontend Image Component**

```javascript
// src/components/OptimizedImage.js
import React, { useState, useEffect, useRef } from 'react';

const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  sizes = '100vw',
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [error, setError] = useState(false);
  const imgRef = useRef();

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || !imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );

    observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, [priority]);

  // Generate srcSet for responsive images
  const generateSrcSet = (baseSrc) => {
    const sizes = [480, 768, 1024, 1440, 1920];
    const ext = baseSrc.split('.').pop();
    const baseName = baseSrc.replace(`.${ext}`, '');

    return sizes.map(size => 
      `${baseName}_${size}.webp ${size}w`
    ).join(', ');
  };

  const generateFallbackSrcSet = (baseSrc) => {
    const sizes = [480, 768, 1024, 1440, 1920];
    const ext = baseSrc.split('.').pop();
    const baseName = baseSrc.replace(`.${ext}`, '');

    return sizes.map(size => 
      `${baseName}_${size}.${ext} ${size}w`
    ).join(', ');
  };

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setError(true);
    onError?.();
  };

  if (error) {
    return (
      <div className={`image-error ${className}`}>
        <span>Error loading image</span>
      </div>
    );
  }

  return (
    <div
      ref={imgRef}
      className={`optimized-image-container ${className}`}
      style={{ width, height }}
    >
      {isInView && (
        <picture>
          <source
            srcSet={generateSrcSet(src)}
            sizes={sizes}
            type="image/webp"
          />
          <img
            src={src}
            srcSet={generateFallbackSrcSet(src)}
            sizes={sizes}
            alt={alt}
            width={width}
            height={height}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            onLoad={handleLoad}
            onError={handleError}
            className={`responsive-image ${isLoaded ? 'loaded' : 'loading'}`}
          />
        </picture>
      )}
      
      {!isLoaded && !error && (
        <div className="image-placeholder">
          <div className="loading-spinner" />
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
```

---

## 🗄️ Caching Tools

### **Redis Setup para Development**

```bash
# Install Redis locally
brew install redis  # macOS
sudo apt-get install redis-server  # Ubuntu

# Start Redis
redis-server

# Redis CLI tools
npm install -g redis-cli
redis-cli ping
```

```javascript
// backend/services/redisCache.js
const Redis = require('ioredis');

class RedisCache {
  constructor() {
    this.client = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD,
      retryDelayOnFailover: 100,
      enableReadyCheck: false,
      maxRetriesPerRequest: null,
    });

    this.client.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    this.client.on('connect', () => {
      console.log('Connected to Redis');
    });
  }

  async get(key) {
    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Redis GET error:', error);
      return null;
    }
  }

  async set(key, value, ttl = 3600) {
    try {
      const stringValue = JSON.stringify(value);
      if (ttl) {
        await this.client.setex(key, ttl, stringValue);
      } else {
        await this.client.set(key, stringValue);
      }
      return true;
    } catch (error) {
      console.error('Redis SET error:', error);
      return false;
    }
  }

  async del(key) {
    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      console.error('Redis DEL error:', error);
      return false;
    }
  }

  async flush() {
    try {
      await this.client.flushall();
      return true;
    } catch (error) {
      console.error('Redis FLUSH error:', error);
      return false;
    }
  }

  async keys(pattern) {
    try {
      return await this.client.keys(pattern);
    } catch (error) {
      console.error('Redis KEYS error:', error);
      return [];
    }
  }

  // Cache with automatic invalidation
  async cacheWithTags(key, value, ttl, tags = []) {
    await this.set(key, value, ttl);
    
    // Store tag associations
    for (const tag of tags) {
      await this.client.sadd(`tag:${tag}`, key);
      await this.client.expire(`tag:${tag}`, ttl);
    }
  }

  // Invalidate by tag
  async invalidateByTag(tag) {
    const keys = await this.client.smembers(`tag:${tag}`);
    if (keys.length > 0) {
      await this.client.del(keys);
    }
    await this.client.del(`tag:${tag}`);
  }
}

module.exports = new RedisCache();
```

### **Service Worker Caching**

```javascript
// public/sw.js - Advanced Service Worker
const CACHE_NAME = 'app-v1';
const API_CACHE = 'api-v1';
const IMAGE_CACHE = 'images-v1';

// Cache strategies
const cacheStrategies = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate'
};

// Route-based caching rules
const cachingRules = [
  {
    matcher: /\/api\/products/,
    strategy: cacheStrategies.STALE_WHILE_REVALIDATE,
    cacheName: API_CACHE,
    maxAge: 5 * 60 * 1000 // 5 minutes
  },
  {
    matcher: /\.(png|jpg|jpeg|svg|gif|webp|avif)$/,
    strategy: cacheStrategies.CACHE_FIRST,
    cacheName: IMAGE_CACHE,
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  },
  {
    matcher: /\.(js|css)$/,
    strategy: cacheStrategies.CACHE_FIRST,
    cacheName: CACHE_NAME,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  }
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/static/css/main.css',
        '/static/js/main.js'
      ]);
    })
  );
});

// Fetch event with smart caching
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Find matching rule
  const rule = cachingRules.find(rule => rule.matcher.test(url.pathname));
  
  if (rule) {
    event.respondWith(handleCachedRequest(event.request, rule));
  } else {
    event.respondWith(fetch(event.request));
  }
});

async function handleCachedRequest(request, rule) {
  const cache = await caches.open(rule.cacheName);
  
  switch (rule.strategy) {
    case cacheStrategies.CACHE_FIRST:
      return cacheFirst(cache, request, rule);
    case cacheStrategies.NETWORK_FIRST:
      return networkFirst(cache, request, rule);
    case cacheStrategies.STALE_WHILE_REVALIDATE:
      return staleWhileRevalidate(cache, request, rule);
    default:
      return fetch(request);
  }
}

async function cacheFirst(cache, request, rule) {
  const cached = await cache.match(request);
  if (cached && !isExpired(cached, rule.maxAge)) {
    return cached;
  }
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return cached || new Response('Offline', { status: 503 });
  }
}
```

---

## 📈 Monitoring y Analytics

### **Performance Monitoring Setup**

```javascript
// src/utils/performanceMonitor.js
class PerformanceMonitor {
  constructor() {
    this.metrics = [];
    this.observers = [];
    this.setupObservers();
  }

  setupObservers() {
    // Long Task Observer
    if ('PerformanceObserver' in window) {
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric('long-task', {
            duration: entry.duration,
            startTime: entry.startTime,
            attribution: entry.attribution
          });
        }
      });

      longTaskObserver.observe({ entryTypes: ['longtask'] });
      this.observers.push(longTaskObserver);
    }

    // Layout Shift Observer
    if ('LayoutShift' in window) {
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            this.recordMetric('layout-shift', {
              value: entry.value,
              sources: entry.sources
            });
          }
        }
      });

      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);
    }
  }

  recordMetric(name, data) {
    const metric = {
      name,
      timestamp: Date.now(),
      url: window.location.href,
      ...data
    };

    this.metrics.push(metric);
    this.sendToAnalytics(metric);
  }

  async sendToAnalytics(metric) {
    try {
      await fetch('/api/analytics/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metric)
      });
    } catch (error) {
      console.warn('Failed to send performance metric:', error);
    }
  }

  getMetrics() {
    return this.metrics;
  }

  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

export default new PerformanceMonitor();
```

### **Backend Monitoring**

```javascript
// backend/middleware/performanceMiddleware.js
const prometheus = require('prom-client');

// Create metrics
const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10]
});

const httpRequestsTotal = new prometheus.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

// Register metrics
prometheus.register.registerMetric(httpRequestDuration);
prometheus.register.registerMetric(httpRequestsTotal);

const performanceMiddleware = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const labels = {
      method: req.method,
      route: req.route?.path || req.path,
      status_code: res.statusCode
    };
    
    httpRequestDuration.observe(labels, duration);
    httpRequestsTotal.inc(labels);
  });
  
  next();
};

module.exports = { performanceMiddleware, prometheus };
```

---

## 🚀 Automation Scripts

### **Performance CI/CD Pipeline**

```yaml
# .github/workflows/performance.yml
name: Performance Tests

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  performance:
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
    
    - name: Build application
      run: npm run build
    
    - name: Start application
      run: |
        npm start &
        sleep 30
    
    - name: Run Lighthouse CI
      run: |
        npm install -g @lhci/cli
        lhci autorun
    
    - name: Run bundle analysis
      run: npm run analyze
    
    - name: Performance regression check
      run: node scripts/performance-check.js
```

### **Automated Performance Testing**

```javascript
// scripts/performance-test.js
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');

const runPerformanceTest = async () => {
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--no-sandbox']
  });

  const options = {
    logLevel: 'info',
    output: 'json',
    onlyCategories: ['performance'],
    port: chrome.port,
  };

  console.log('Running Lighthouse audit...');
  const runnerResult = await lighthouse('http://localhost:3000', options);
  
  await chrome.kill();

  const { lhr } = runnerResult;
  const performanceScore = lhr.categories.performance.score * 100;

  const metrics = {
    score: performanceScore,
    fcp: lhr.audits['first-contentful-paint'].numericValue,
    lcp: lhr.audits['largest-contentful-paint'].numericValue,
    cls: lhr.audits['cumulative-layout-shift'].numericValue,
    tti: lhr.audits['interactive'].numericValue,
    tbt: lhr.audits['total-blocking-time'].numericValue,
  };

  console.log('Performance Metrics:', metrics);

  // Save results
  fs.writeFileSync('performance-results.json', JSON.stringify(metrics, null, 2));

  // Check thresholds
  const thresholds = {
    score: 90,
    fcp: 1800,
    lcp: 2500,
    cls: 0.1,
    tti: 3800,
    tbt: 300
  };

  const failures = [];
  
  Object.entries(thresholds).forEach(([metric, threshold]) => {
    const value = metrics[metric];
    const passed = metric === 'score' ? value >= threshold : value <= threshold;
    
    if (!passed) {
      failures.push(`${metric}: ${value} (threshold: ${threshold})`);
    }
  });

  if (failures.length > 0) {
    console.error('Performance test failed:');
    failures.forEach(failure => console.error(`  - ${failure}`));
    process.exit(1);
  } else {
    console.log('✅ All performance tests passed!');
  }
};

runPerformanceTest().catch(console.error);
```

---

## 📝 Quick Reference Commands

### **Development Workflow**

```bash
# 1. Start development with performance monitoring
npm run dev:perf

# 2. Analyze bundle during development
npm run analyze:dev

# 3. Run performance tests
npm run test:performance

# 4. Generate performance report
npm run report:performance

# 5. Clean caches
npm run clean:cache
```

### **Production Deployment**

```bash
# 1. Build with optimization
NODE_ENV=production npm run build

# 2. Validate performance
npm run validate:performance

# 3. Deploy with monitoring
npm run deploy:monitored

# 4. Post-deployment check
npm run check:production
```

### **Debugging Commands**

```bash
# Check bundle composition
npx webpack-bundle-analyzer build/static/js/*.js

# Lighthouse audit
lighthouse http://localhost:3000 --view

# Service Worker debugging
npx sw-precache --verbose

# Redis cache inspection
redis-cli monitor

# Load testing
artillery quick --count 10 --num 100 http://localhost:3000
```

---

¡Con estas herramientas tendrás todo lo necesario para optimizar performance a nivel profesional! 🛠️
