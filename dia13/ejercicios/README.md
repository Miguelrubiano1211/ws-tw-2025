# 🔗 Día 13: Ejercicios de Frontend-Backend Integration

## 📋 Lista de Ejercicios

### **Ejercicio 1: Fetch API y Async Data Loading** ⭐⭐⭐

- **Archivo:** `01-fetch-async-data.js`
- **Objetivo:** Implementar cliente REST con Fetch API
- **Conceptos:** Fetch API, async/await, manejo de respuestas
- **Duración:** 30 minutos
- **Dependencias:** `None (vanilla JavaScript)`

### **Ejercicio 2: Error Handling en Peticiones HTTP** ⭐⭐⭐⭐

- **Archivo:** `02-error-handling-http.js`
- **Objetivo:** Sistema robusto de manejo de errores
- **Conceptos:** HTTP status codes, retry strategies, user feedback
- **Duración:** 30 minutos
- **Dependencias:** `None (vanilla JavaScript)`

### **Ejercicio 3: Loading States y UX Patterns** ⭐⭐⭐

- **Archivo:** `03-loading-states-ux.jsx`
- **Objetivo:** Implementar estados de carga en React
- **Conceptos:** Loading states, skeleton screens, optimistic UI
- **Duración:** 30 minutos
- **Dependencias:** `react react-dom`

### **Ejercicio 4: Axios Setup y Interceptors** ⭐⭐⭐⭐

- **Archivo:** `04-axios-interceptors.js`
- **Objetivo:** Configurar Axios con interceptors
- **Conceptos:** Axios configuration, interceptors, auth handling
- **Duración:** 30 minutos
- **Dependencias:** `axios`

### **Ejercicio 5: Cache Strategies** ⭐⭐⭐⭐⭐

- **Archivo:** `05-cache-strategies.js`
- **Objetivo:** Sistema de cache inteligente
- **Conceptos:** localStorage, sessionStorage, TTL, invalidation
- **Duración:** 30 minutos
- **Dependencias:** `None (vanilla JavaScript)`

### **Ejercicio 6: Offline-First Approaches** ⭐⭐⭐⭐

- **Archivo:** `06-offline-first.js`
- **Objetivo:** Aplicación que funciona offline
- **Conceptos:** Service Workers, Cache API, offline strategies
- **Duración:** 30 minutos
- **Dependencias:** `None (Service Worker)`

### **Ejercicio 7: Real-time Updates (WebSockets)** ⭐⭐⭐⭐⭐

- **Archivo:** `07-websockets-realtime.jsx`
- **Objetivo:** Chat en tiempo real
- **Conceptos:** WebSockets, real-time communication, React hooks
- **Duración:** 30 minutos
- **Dependencias:** `react react-dom ws`

### **Ejercicio 8: API Pagination y Infinite Scroll** ⭐⭐⭐⭐⭐

- **Archivo:** `08-pagination-infinite-scroll.jsx`
- **Objetivo:** Lista con infinite scroll
- **Conceptos:** Pagination, infinite scroll, Intersection Observer
- **Duración:** 30 minutos
- **Dependencias:** `react react-dom`

## 🚀 Instrucciones Generales

### **Instalación de Dependencias**

```bash
# Para ejercicios React
npm install react react-dom

# Para ejercicios con Axios
npm install axios

# Para ejercicios WebSocket (servidor)
npm install ws express

# Para desarrollo
npm install --save-dev @babel/core @babel/preset-react webpack webpack-cli webpack-dev-server
```

### **Estructura de Archivos**

```
ejercicios/
├── 01-fetch-async-data.js
├── 02-error-handling-http.js
├── 03-loading-states-ux.jsx
├── 04-axios-interceptors.js
├── 05-cache-strategies.js
├── 06-offline-first.js
├── 07-websockets-realtime.jsx
├── 08-pagination-infinite-scroll.jsx
├── utils/
│   ├── api.js
│   └── cache.js
├── components/
│   ├── LoadingSpinner.jsx
│   ├── ErrorMessage.jsx
│   └── SkeletonLoader.jsx
├── package.json
└── README.md
```

### **Ejecución de Ejercicios**

```bash
# Ejercicios JavaScript (Node.js)
node 01-fetch-async-data.js
node 02-error-handling-http.js
node 04-axios-interceptors.js
node 05-cache-strategies.js

# Ejercicios React (necesitan servidor de desarrollo)
npm start

# Ejercicios WebSocket (servidor)
node server.js
```

### **Herramientas de Prueba**

- **Browser DevTools** para debugging
- **Network tab** para análisis de requests
- **Postman** para testing de APIs
- **React DevTools** para componentes React

## 🎯 Objetivos de Aprendizaje

### **Al completar estos ejercicios, serás capaz de:**

- ✅ Implementar comunicación HTTP eficiente con Fetch API
- ✅ Manejar errores robustamente en peticiones HTTP
- ✅ Crear estados de carga profesionales en React
- ✅ Configurar Axios con interceptors avanzados
- ✅ Implementar estrategias de cache inteligentes
- ✅ Desarrollar aplicaciones offline-first
- ✅ Crear comunicación en tiempo real con WebSockets
- ✅ Implementar paginación e infinite scroll

## 📊 Progreso Recomendado

1. **Principiantes:** Ejercicios 1, 2, 3
2. **Intermedio:** Ejercicios 1, 2, 3, 4, 5
3. **Avanzado:** Todos los ejercicios
4. **Competencia:** Enfoque en ejercicios 4, 5, 7, 8

## 🔍 Conceptos Clave

### **HTTP Communication**

- **Fetch API:** Método moderno para peticiones HTTP
- **Axios:** Biblioteca popular con funcionalidades avanzadas
- **Error Handling:** Manejo robusto de errores de red y servidor
- **Interceptors:** Manejo centralizado de requests y responses

### **User Experience**

- **Loading States:** Feedback visual durante operaciones asíncronas
- **Skeleton Screens:** Placeholders que mejoran percepción de velocidad
- **Optimistic UI:** Actualizaciones anticipadas para mejor UX
- **Error Messages:** Mensajes claros y accionables para usuarios

### **Performance Optimization**

- **Caching:** Almacenamiento local para reducir requests
- **TTL:** Time-To-Live para invalidación automática
- **Offline-First:** Estrategias para funcionalidad sin conexión
- **Lazy Loading:** Carga diferida de contenido

### **Real-time Communication**

- **WebSockets:** Comunicación bidireccional en tiempo real
- **Event Handling:** Manejo de eventos de conexión y mensajes
- **Reconnection:** Estrategias de reconexión automática
- **State Synchronization:** Sincronización de estado en tiempo real

## ⚠️ Notas Importantes

- Todos los ejercicios incluyen **testing completo** con ejemplos
- Los ejercicios **React** necesitan servidor de desarrollo
- Los ejercicios **WebSocket** incluyen servidor de prueba
- Usa **Node.js 16+** para mejor compatibilidad
- Los ejercicios están diseñados para **entrenamiento WorldSkills**
- Cada ejercicio es **independiente** y **ejecutable**

## 🏆 Preparación WorldSkills

Estos ejercicios están específicamente diseñados para:

- **Velocidad de implementación:** Patrones optimizados para competencia
- **Mejores prácticas:** Siguiendo estándares de la industria
- **Casos reales:** Problemas comunes en desarrollo full-stack
- **Testing completo:** Validación rápida de funcionamiento
- **Documentación clara:** Fácil referencia durante competencia

### **Patrones de Código Reutilizables**

- **API Client:** Configuración base de Axios
- **Error Handler:** Manejo centralizado de errores
- **Cache Manager:** Sistema de cache con TTL
- **WebSocket Hook:** Hook reutilizable para WebSockets
- **Infinite Scroll:** Componente genérico de scroll infinito

### **Técnicas de Optimización**

- **Request Batching:** Agrupación de peticiones
- **Response Caching:** Cache inteligente de respuestas
- **Lazy Loading:** Carga diferida de componentes
- **Memoization:** Optimización de renders en React
- **Debouncing:** Optimización de búsquedas en tiempo real

## 📋 Lista de Verificación

### **Antes de Empezar**

- [ ] Node.js instalado (versión 16+)
- [ ] Editor de código configurado
- [ ] Dependencias instaladas
- [ ] Servidor de desarrollo funcionando

### **Durante los Ejercicios**

- [ ] Leer completamente cada ejercicio
- [ ] Implementar paso a paso
- [ ] Probar funcionamiento
- [ ] Revisar comentarios y documentación

### **Al Finalizar**

- [ ] Todos los ejercicios funcionan correctamente
- [ ] Comprensión de conceptos clave
- [ ] Código limpio y bien documentado
- [ ] Preparación para proyecto integrador

---

¡Prepárate para conectar el frontend con el backend y crear experiencias de usuario excepcionales! 🌟
