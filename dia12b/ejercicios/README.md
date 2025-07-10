# 🛡️ Día 12B: Ejercicios de Protecciones Avanzadas

## 📋 Lista de Ejercicios

### **Ejercicio 1: Rate Limiting y DDoS Protection** ⭐⭐⭐

- **Archivo:** `01-rate-limiting.js`
- **Objetivo:** Implementar rate limiting y protección contra DDoS
- **Conceptos:** express-rate-limit, slowDown, configuraciones por endpoint
- **Duración:** 45 minutos
- **Dependencias:** `express express-rate-limit express-slow-down`

### **Ejercicio 2: CORS Configuration** ⭐⭐

- **Archivo:** `02-cors-security.js`
- **Objetivo:** Configurar CORS de manera segura
- **Conceptos:** Whitelist de dominios, preflight requests, credenciales
- **Duración:** 30 minutos
- **Dependencias:** `express cors helmet`

### **Ejercicio 3: Input Validation y Sanitización** ⭐⭐⭐⭐

- **Archivo:** `03-input-validation.js`
- **Objetivo:** Validar y sanitizar entrada de usuario
- **Conceptos:** Joi, XSS prevention, data sanitization
- **Duración:** 45 minutos
- **Dependencias:** `express joi validator express-rate-limit helmet xss`

### **Ejercicio 4: SQL Injection Prevention** ⭐⭐⭐⭐⭐

- **Archivo:** `04-sql-injection.js`
- **Objetivo:** Prevenir ataques de SQL injection
- **Conceptos:** Consultas parametrizadas, ORM, input validation
- **Duración:** 45 minutos
- **Dependencias:** `express sqlite3 sqlite bcryptjs jsonwebtoken express-rate-limit helmet joi`

### **Ejercicio 5: Security Headers** ⭐⭐⭐

- **Archivo:** `05-security-headers.js`
- **Objetivo:** Implementar headers de seguridad
- **Conceptos:** CSP, HSTS, X-Frame-Options, Helmet
- **Duración:** 30 minutos
- **Dependencias:** `express helmet express-rate-limit express-slow-down cors compression morgan`

### **Ejercicio 6: Integración Completa** ⭐⭐⭐⭐⭐

- **Archivo:** `06-integracion-completa.js`
- **Objetivo:** Combinar todas las técnicas de seguridad
- **Conceptos:** API completamente securizada
- **Duración:** 60 minutos
- **Dependencias:** `express helmet express-rate-limit express-slow-down cors compression morgan bcryptjs jsonwebtoken joi xss sqlite3 sqlite`

## 🚀 Instrucciones Generales

### **Instalación de Dependencias**

```bash
# Para todos los ejercicios
npm install express helmet express-rate-limit express-slow-down cors compression morgan bcryptjs jsonwebtoken joi xss sqlite3 sqlite validator
```

### **Ejecución de Ejercicios**

```bash
# Ejecutar cualquier ejercicio
node 01-rate-limiting.js
node 02-cors-security.js
node 03-input-validation.js
node 04-sql-injection.js
node 05-security-headers.js
node 06-integracion-completa.js
```

### **Herramientas de Prueba**

- **cURL** para testing de API
- **Postman** para requests complejos
- **Browser DevTools** para verificar headers
- **Burp Suite** para auditoría de seguridad (opcional)

## 🎯 Objetivos de Aprendizaje

### **Al completar estos ejercicios, serás capaz de:**

- ✅ Implementar rate limiting efectivo contra DDoS
- ✅ Configurar CORS de manera segura
- ✅ Validar y sanitizar entrada de usuario
- ✅ Prevenir ataques de SQL injection
- ✅ Aplicar headers de seguridad esenciales
- ✅ Crear APIs completamente securizadas
- ✅ Implementar logging de auditoría
- ✅ Aplicar mejores prácticas de seguridad

## 📊 Progreso Recomendado

1. **Principiantes:** Ejercicios 1, 2, 5
2. **Intermedio:** Ejercicios 1, 2, 3, 5
3. **Avanzado:** Todos los ejercicios
4. **Competencia:** Enfoque en ejercicios 4 y 6

## 🔍 Conceptos Clave

- **Rate Limiting:** Prevenir abuso de recursos
- **CORS:** Control de acceso entre dominios
- **Validación:** Verificar entrada antes de procesarla
- **Sanitización:** Limpiar datos peligrosos
- **SQL Injection:** Prevenir inyección de código SQL
- **Security Headers:** Proteger el navegador
- **Auditoría:** Registrar actividades de seguridad
- **Defense in Depth:** Múltiples capas de protección

## ⚠️ Notas Importantes

- Todos los ejercicios incluyen ejemplos **vulnerables** y **seguros**
- Los ejercicios 4 y 6 crean archivos de base de datos SQLite
- Usa **Node.js 16+** para mejor compatibilidad
- Los ejercicios están diseñados para **entrenamiento WorldSkills**
- Incluye **testing completo** con comandos cURL
- Cada ejercicio es **independiente** y **ejecutable**

## 🏆 Preparación WorldSkills

Estos ejercicios están específicamente diseñados para:

- **Velocidad de implementación:** Código optimizado para competencia
- **Mejores prácticas:** Siguiendo estándares de la industria
- **Casos reales:** Problemas comunes en desarrollo web
- **Testing completo:** Validación rápida de funcionamiento
- **Documentación clara:** Fácil referencia durante competencia
- **Tiempo:** 30 minutos

## 🎯 Instrucciones Generales

1. **Completar en orden** - Cada ejercicio construye sobre el anterior
2. **Probar constantemente** - Ejecutar después de cada cambio
3. **Documentar** - Agregar comentarios explicativos
4. **Experimentar** - Probar diferentes configuraciones

## 📊 Criterios de Evaluación

- **Funcionalidad** (40%) - El código funciona correctamente
- **Seguridad** (35%) - Implementa protecciones apropiadas
- **Calidad** (25%) - Código limpio y bien documentado

## 🚀 Comandos Útiles

```bash
# Instalar dependencias
pnpm install express express-rate-limit helmet cors joi bcryptjs

# Ejecutar ejercicios
node ejercicios/01-rate-limiting.js
node ejercicios/02-cors-security.js

# Ejecutar tests
pnpm test
```

¡Vamos a fortalecer nuestras APIs! 🛡️
