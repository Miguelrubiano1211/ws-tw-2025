# 📦 Ejercicio 2: Bundle Optimization

## 🎯 Objetivo
Optimizar el bundle de una aplicación React reduciendo el tamaño en un 40% mediante técnicas de code splitting, tree shaking y eliminación de código muerto.

## ⏱️ Duración
45 minutos

## 🔧 Dificultad
⭐⭐⭐ (Intermedio-Avanzado)

## 📋 Prerrequisitos
- Conocimiento de Webpack y build tools
- Experiencia con React.lazy() y Suspense
- Comprensión de ES modules

---

## 🚀 Instrucciones

### Paso 1: Análisis del Bundle Actual (10 minutos)

Instala y configura el analizador de bundles:

```bash
# Instalar dependencias de análisis
pnpm install --save-dev webpack-bundle-analyzer
pnpm install --save-dev @craco/craco craco-webpack-bundle-analyzer
```

```javascript
// craco.config.js
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  webpack: {
    plugins: [
      new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        openAnalyzer: false,
        analyzerHost: '127.0.0.1',
        analyzerPort: 8888
      })
    ]
  }
};
```

```json
// package.json - Agregar script
{
  "scripts": {
    "analyze": "pnpm run build && npx webpack-bundle-analyzer build/static/js/*.js"
  }
}
```

### Paso 2: Implementar Code Splitting (15 minutos)

```javascript
// src/App.js - Implementar lazy loading
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoadingSpinner from './components/LoadingSpinner';

// Importaciones lazy
const Home = React.lazy(() => import('./pages/Home'));
const Products = React.lazy(() => import('./pages/Products'));
const ProductDetail = React.lazy(() => import('./pages/ProductDetail'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Reports = React.lazy(() => import('./pages/Reports'));

// Componente de Loading
const PageWrapper = ({ children }) => (
  <Suspense fallback={<LoadingSpinner />}>
    {children}
  </Suspense>
);

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={
              <PageWrapper>
                <Home />
              </PageWrapper>
            } 
          />
          <Route 
            path="/products" 
            element={
              <PageWrapper>
                <Products />
              </PageWrapper>
            } 
          />
          <Route 
            path="/products/:id" 
            element={
              <PageWrapper>
                <ProductDetail />
              </PageWrapper>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <PageWrapper>
                <Dashboard />
              </PageWrapper>
            } 
          />
          <Route 
            path="/reports" 
            element={
              <PageWrapper>
                <Reports />
              </PageWrapper>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
```

```javascript
// src/components/LoadingSpinner.js
import React from 'react';

const LoadingSpinner = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Cargando...</span>
    </div>
  </div>
);

export default LoadingSpinner;
```

### Paso 3: Optimización de Importaciones (10 minutos)

```javascript
// src/utils/optimizedImports.js - Importaciones específicas
// ❌ Malo - Importa toda la librería
import _ from 'lodash';
import * as dateFns from 'date-fns';

// ✅ Bueno - Importaciones específicas
import { debounce, throttle } from 'lodash';
import { format, parseISO } from 'date-fns';

// ✅ Mejor - Tree shaking friendly
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
```

```javascript
// src/hooks/useOptimizedHooks.js - Custom hooks optimizados
import { useMemo, useCallback } from 'react';
import debounce from 'lodash/debounce';

export const useOptimizedSearch = (searchFunction, delay = 300) => {
  const debouncedSearch = useMemo(
    () => debounce(searchFunction, delay),
    [searchFunction, delay]
  );

  return useCallback((query) => {
    if (query.trim().length > 2) {
      debouncedSearch(query);
    }
  }, [debouncedSearch]);
};

export const useOptimizedFilter = (data, filterCriteria) => {
  return useMemo(() => {
    if (!filterCriteria) return data;
    
    return data.filter(item => {
      return Object.entries(filterCriteria).every(([key, value]) => {
        if (!value) return true;
        return item[key]?.toLowerCase().includes(value.toLowerCase());
      });
    });
  }, [data, filterCriteria]);
};
```

### Paso 4: Configuración de Build Optimization (10 minutos)

```javascript
// craco.config.js - Configuración optimizada
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env }) => {
      if (env === 'production') {
        // Optimización de chunks
        webpackConfig.optimization = {
          ...webpackConfig.optimization,
          splitChunks: {
            chunks: 'all',
            cacheGroups: {
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendors',
                chunks: 'all',
                priority: 10
              },
              common: {
                name: 'common',
                minChunks: 2,
                chunks: 'all',
                priority: 5,
                reuseExistingChunk: true
              }
            }
          }
        };
      }
      return webpackConfig;
    },
    plugins: process.env.ANALYZE ? [
      new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        openAnalyzer: true
      })
    ] : []
  }
};
```

```json
// package.json - Scripts optimizados
{
  "scripts": {
    "build": "craco build",
    "build:analyze": "ANALYZE=true craco build",
    "build:production": "NODE_ENV=production craco build"
  }
}
```

---

## 🧪 Pruebas y Validación

### Comandos de Testing

```bash
# Generar build y analizar
pnpm run build:analyze

# Comparar tamaños antes y después
du -sh build/static/js/* | sort -h

# Verificar lazy loading en DevTools
# Network > Throttling > Slow 3G
```

### Métricas Objetivo

- **Bundle size reducido:** Mínimo 40%
- **Initial chunk:** < 150KB gzipped
- **Lazy chunks:** < 100KB cada uno
- **Time to Interactive:** < 3 segundos

---

## ✅ Criterios de Evaluación

### **Técnico (70 puntos)**
- [ ] Code splitting implementado correctamente (20 pts)
- [ ] Importaciones optimizadas (15 pts)
- [ ] Build configuration optimizada (15 pts)
- [ ] Lazy loading funcional (20 pts)

### **Performance (20 puntos)**
- [ ] Bundle size reducido ≥40% (10 pts)
- [ ] Initial load mejorado (10 pts)

### **Código y Documentación (10 puntos)**
- [ ] Código limpio y comentado (5 pts)
- [ ] README con métricas (5 pts)

---

## 📊 Entregables

1. **Aplicación optimizada** con lazy loading
2. **Reporte de bundle analysis** (antes/después)
3. **Configuración de build** documentada
4. **Screenshots** de métricas mejoradas

---

## 🎯 Desafío Extra

Implementar **preloading inteligente** para rutas críticas:

```javascript
// src/utils/routePreloader.js
const preloadRoute = (routeComponent) => {
  if (typeof routeComponent === 'function') {
    routeComponent();
  }
};

// Preload en hover
const handleLinkHover = (routeName) => {
  const routeMap = {
    products: () => import('../pages/Products'),
    dashboard: () => import('../pages/Dashboard')
  };
  
  if (routeMap[routeName]) {
    preloadRoute(routeMap[routeName]);
  }
};
```

---

## 🔗 Recursos Adicionales

- [Webpack Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)
- [React Code Splitting Guide](https://reactjs.org/docs/code-splitting.html)
- [Web.dev Bundle Optimization](https://web.dev/reduce-javascript-payloads-with-code-splitting/)
