# 📊 Ejercicio 1: Web Vitals Analysis

## 🎯 Objetivo
Medir, analizar y mejorar las Core Web Vitals de una aplicación web utilizando herramientas profesionales de performance.

**Duración:** 45 minutos  
**Dificultad:** ⭐⭐  
**Prerequisitos:** Conocimientos básicos de Chrome DevTools

---

## 📋 Tareas a Realizar

### **Parte 1: Setup y Medición (15 minutos)**

#### **1.1 Instalación de Herramientas**
```bash
# Instalar web-vitals library
npm install web-vitals

# Instalar lighthouse CLI (opcional)
npm install -g lighthouse
```

#### **1.2 Implementar Web Vitals Tracking**
```javascript
// src/utils/reportWebVitals.js
import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals';

const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    onCLS(onPerfEntry);
    onFID(onPerfEntry);
    onFCP(onPerfEntry);
    onLCP(onPerfEntry);
    onTTFB(onPerfEntry);
  }
};

// Función para enviar métricas a analytics
export const sendToAnalytics = (metric) => {
  // Mostrar en consola durante desarrollo
  console.log('📊 Web Vital:', {
    name: metric.name,
    value: metric.value,
    rating: getPerformanceRating(metric.name, metric.value),
    delta: metric.delta,
    id: metric.id,
  });

  // En producción, enviar a Google Analytics, DataDog, etc.
  if (window.gtag && process.env.NODE_ENV === 'production') {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.value),
      non_interaction: true,
    });
  }
};

// Función para clasificar performance
const getPerformanceRating = (metricName, value) => {
  const thresholds = {
    LCP: { good: 2500, needsImprovement: 4000 },
    FID: { good: 100, needsImprovement: 300 },
    CLS: { good: 0.1, needsImprovement: 0.25 },
    FCP: { good: 1800, needsImprovement: 3000 },
    TTFB: { good: 800, needsImprovement: 1800 },
  };

  const threshold = thresholds[metricName];
  if (!threshold) return 'unknown';

  if (value <= threshold.good) return 'good';
  if (value <= threshold.needsImprovement) return 'needs-improvement';
  return 'poor';
};

export default reportWebVitals;
```

#### **1.3 Integrar en la Aplicación**
```javascript
// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals, { sendToAnalytics } from './utils/reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// Medir Web Vitals
reportWebVitals(sendToAnalytics);
```

### **Parte 2: Análisis con Herramientas (15 minutos)**

#### **2.1 Lighthouse Audit**
```bash
# Ejecutar Lighthouse desde CLI
lighthouse http://localhost:3000 --output=html --output-path=./lighthouse-report.html

# O usar Chrome DevTools:
# 1. Abrir DevTools (F12)
# 2. Ir a pestaña "Lighthouse"
# 3. Seleccionar "Performance"
# 4. Ejecutar audit
```

#### **2.2 Chrome DevTools Performance**
```javascript
// src/components/PerformanceMonitor.jsx
import React, { useEffect, useState } from 'react';

const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({});
  const [performanceEntries, setPerformanceEntries] = useState([]);

  useEffect(() => {
    // Obtener métricas de Navigation Timing
    const navigation = performance.getEntriesByType('navigation')[0];
    
    if (navigation) {
      const calculatedMetrics = {
        // DNS Lookup Time
        dnsTime: navigation.domainLookupEnd - navigation.domainLookupStart,
        
        // TCP Connection Time
        tcpTime: navigation.connectEnd - navigation.connectStart,
        
        // Time to First Byte
        ttfb: navigation.responseStart - navigation.requestStart,
        
        // DOM Content Loaded
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,
        
        // Full Load Time
        loadTime: navigation.loadEventEnd - navigation.navigationStart,
        
        // DOM Processing Time
        domProcessing: navigation.domComplete - navigation.domLoading,
      };
      
      setMetrics(calculatedMetrics);
    }

    // Obtener Resource Timing
    const resources = performance.getEntriesByType('resource');
    setPerformanceEntries(resources);

    // Performance Observer para capturar métricas en tiempo real
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log('📊 Performance Entry:', entry);
        }
      });

      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });

      return () => observer.disconnect();
    }
  }, []);

  return (
    <div className="performance-monitor">
      <h3>📊 Performance Metrics</h3>
      
      <div className="metrics-grid">
        <div className="metric-card">
          <h4>⏱️ Timing Metrics</h4>
          <ul>
            <li>DNS Lookup: {metrics.dnsTime}ms</li>
            <li>TCP Connection: {metrics.tcpTime}ms</li>
            <li>TTFB: {metrics.ttfb}ms</li>
            <li>DOM Content Loaded: {metrics.domContentLoaded}ms</li>
            <li>Full Load: {metrics.loadTime}ms</li>
          </ul>
        </div>

        <div className="metric-card">
          <h4>🎯 Core Web Vitals Status</h4>
          <div id="web-vitals-display">
            {/* Los valores se mostrarán aquí via JavaScript */}
          </div>
        </div>

        <div className="metric-card">
          <h4>📈 Resource Analysis</h4>
          <p>Total Resources: {performanceEntries.length}</p>
          <p>Largest Resource: {
            performanceEntries.length > 0 
              ? Math.max(...performanceEntries.map(r => r.transferSize || 0)) + ' bytes'
              : 'N/A'
          }</p>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMonitor;
```

### **Parte 3: Análisis y Optimización (15 minutos)**

#### **3.1 Web Vitals Dashboard**
```javascript
// src/components/WebVitalsDashboard.jsx
import React, { useEffect, useState } from 'react';
import { onCLS, onFID, onLCP } from 'web-vitals';

const WebVitalsDashboard = () => {
  const [vitals, setVitals] = useState({
    LCP: null,
    FID: null,
    CLS: null,
  });

  useEffect(() => {
    // Capturar métricas
    onLCP((metric) => {
      setVitals(prev => ({ ...prev, LCP: metric }));
    });

    onFID((metric) => {
      setVitals(prev => ({ ...prev, FID: metric }));
    });

    onCLS((metric) => {
      setVitals(prev => ({ ...prev, CLS: metric }));
    });
  }, []);

  const getMetricStatus = (metricName, value) => {
    const thresholds = {
      LCP: { good: 2500, poor: 4000 },
      FID: { good: 100, poor: 300 },
      CLS: { good: 0.1, poor: 0.25 },
    };

    const threshold = thresholds[metricName];
    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  };

  const formatValue = (metricName, value) => {
    if (metricName === 'CLS') return value.toFixed(3);
    return `${Math.round(value)}ms`;
  };

  return (
    <div className="web-vitals-dashboard">
      <h2>🎯 Core Web Vitals</h2>
      
      <div className="vitals-grid">
        {Object.entries(vitals).map(([name, metric]) => (
          <div key={name} className={`vital-card ${metric ? getMetricStatus(name, metric.value) : 'loading'}`}>
            <h3>{name}</h3>
            <div className="vital-value">
              {metric ? formatValue(name, metric.value) : 'Measuring...'}
            </div>
            <div className="vital-status">
              {metric ? getMetricStatus(name, metric.value) : 'loading'}
            </div>
            
            {/* Descripción de la métrica */}
            <div className="vital-description">
              {name === 'LCP' && 'Largest Contentful Paint'}
              {name === 'FID' && 'First Input Delay'}
              {name === 'CLS' && 'Cumulative Layout Shift'}
            </div>
          </div>
        ))}
      </div>

      <div className="recommendations">
        <h3>💡 Recommendations</h3>
        <ul>
          {vitals.LCP && getMetricStatus('LCP', vitals.LCP.value) !== 'good' && (
            <li>🎯 Optimize LCP: Reduce server response time, eliminate render-blocking resources</li>
          )}
          {vitals.FID && getMetricStatus('FID', vitals.FID.value) !== 'good' && (
            <li>⚡ Optimize FID: Reduce JavaScript execution time, use web workers</li>
          )}
          {vitals.CLS && getMetricStatus('CLS', vitals.CLS.value) !== 'good' && (
            <li>🔧 Optimize CLS: Set dimensions for images, avoid dynamic content insertion</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default WebVitalsDashboard;
```

#### **3.2 CSS para Dashboard**
```css
/* src/components/WebVitalsDashboard.css */
.web-vitals-dashboard {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.vitals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.vital-card {
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.vital-card:hover {
  transform: translateY(-2px);
}

.vital-card.good {
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
}

.vital-card.needs-improvement {
  background: linear-gradient(135deg, #FF9800, #f57c00);
  color: white;
}

.vital-card.poor {
  background: linear-gradient(135deg, #f44336, #d32f2f);
  color: white;
}

.vital-card.loading {
  background: linear-gradient(135deg, #9E9E9E, #757575);
  color: white;
}

.vital-value {
  font-size: 2.5em;
  font-weight: bold;
  margin: 10px 0;
}

.vital-status {
  font-size: 0.9em;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.9;
}

.vital-description {
  font-size: 0.8em;
  margin-top: 10px;
  opacity: 0.8;
}

.performance-monitor {
  margin: 20px 0;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.metric-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.metric-card h4 {
  margin-top: 0;
  color: #333;
}

.metric-card ul {
  list-style: none;
  padding: 0;
}

.metric-card li {
  padding: 5px 0;
  border-bottom: 1px solid #eee;
}

.recommendations {
  margin-top: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.recommendations ul {
  list-style: none;
  padding: 0;
}

.recommendations li {
  padding: 10px;
  margin: 5px 0;
  background: white;
  border-radius: 4px;
  border-left: 4px solid #2196F3;
}
```

---

## 📊 Entregables

### **Archivo 1: reportWebVitals.js**
- Implementación completa de tracking de Web Vitals
- Función de clasificación de performance
- Integración con analytics

### **Archivo 2: PerformanceMonitor.jsx**
- Componente de monitoreo en tiempo real
- Análisis de Navigation y Resource Timing
- Performance Observer implementation

### **Archivo 3: WebVitalsDashboard.jsx**
- Dashboard visual de Core Web Vitals
- Recommendations engine
- Estado en tiempo real

### **Archivo 4: Lighthouse Report**
- Reporte HTML de Lighthouse
- Análisis de métricas
- Lista de optimizaciones sugeridas

---

## 🎯 Criterios de Evaluación

### **Implementación Técnica (60%)**
- [ ] **Web Vitals tracking** correctamente implementado
- [ ] **Performance Monitor** mostrando métricas reales
- [ ] **Dashboard** con visualización clara
- [ ] **Lighthouse audit** ejecutado correctamente

### **Análisis y Comprensión (40%)**
- [ ] **Interpretación correcta** de métricas
- [ ] **Identificación de problemas** de performance
- [ ] **Recommendations** relevantes y específicas
- [ ] **Documentation** clara del proceso

---

## 💡 Tips de Implementación

### **Best Practices**
- Usar `performance.mark()` para timing personalizado
- Implementar throttling para métricas en desarrollo
- Configurar thresholds apropiados para tu aplicación
- Documentar hallazgos y optimizaciones

### **Troubleshooting**
- Si no ves métricas, verifica que el componente esté montado
- FID solo se mide con interacción real del usuario
- CLS puede requerir navegación completa para medición
- Usa modo incógnito para mediciones limpias

¡Convierte los datos de performance en insights accionables! 📊
