# 📅 Día 4 Detallado: Validaciones y Seguridad Frontend

## 🎯 Información General

**Fecha**: Día 4 del Bootcamp  
**Duración**: 6 horas (12:00 PM - 6:00 PM)  
**Tema**: Validaciones y Seguridad Frontend  
**Metodología**: Técnica Pomodoro progresiva  
**Modalidad**: Presencial con práctica hands-on

## 📋 Objetivos de Aprendizaje

Al finalizar este día, los estudiantes serán capaces de:

1. **Dominar Regular Expressions** para validaciones complejas
2. **Implementar prevención XSS** efectiva en aplicaciones web
3. **Configurar protección CSRF** en formularios
4. **Aplicar Content Security Policy** para mayor seguridad
5. **Desarrollar secure coding practices** para frontend
6. **Crear sistemas de testing** para validaciones de seguridad
7. **Construir contadores CSS puros** sin JavaScript

## 🕒 Cronograma Detallado

### **12:00 - 12:25 (25 min) - Regular Expressions (RegExp) Mastery**

#### **Objetivos**

- Dominar sintaxis avanzada de RegExp
- Implementar validaciones complejas
- Optimizar performance de expresiones regulares

#### **Contenido**

```javascript
// Metacaracteres fundamentales
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Grupos y cuantificadores
const dateRegex = /^(\d{4})-(\d{2})-(\d{2})$/;
const urlRegex =
  /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
```

#### **Actividades**

- **12:00-12:05**: Introducción a RegExp avanzado
- **12:05-12:15**: Práctica con metacaracteres
- **12:15-12:20**: Implementación de validaciones
- **12:20-12:25**: Ejercicio práctico

#### **Archivo de Trabajo**

- `ejercicios/01-regexp-mastery.js`

#### **Evaluación**

- ✅ Estudiantes pueden escribir RegExp para email, teléfono, contraseña
- ✅ Implementan validaciones con groups y quantifiers
- ✅ Optimizan performance de expresiones regulares

---

### **12:25 - 12:50 (25 min) - Form Validation con RegExp**

#### **Objetivos**

- Implementar validaciones robustas en formularios
- Combinar HTML5 validation con JavaScript
- Crear feedback efectivo para usuarios

#### **Contenido**

```javascript
// Validación combinada HTML5 + JavaScript
function validateForm(form) {
  const validators = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^\+?[\d\s\-\(\)]{10,}$/,
    password:
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  };

  const errors = {};

  for (const [field, regex] of Object.entries(validators)) {
    const value = form[field].value;
    if (!regex.test(value)) {
      errors[field] = `Invalid ${field} format`;
    }
  }

  return errors;
}
```

#### **Actividades**

- **12:25-12:30**: HTML5 validation attributes
- **12:30-12:40**: JavaScript validation con RegExp
- **12:40-12:45**: Manejo de errores y feedback
- **12:45-12:50**: Implementación completa

#### **Archivo de Trabajo**

- `ejercicios/02-form-validation.js`

#### **Evaluación**

- ✅ Formulario con validaciones múltiples funcionando
- ✅ Feedback efectivo al usuario
- ✅ Validaciones tanto client-side como preparadas para server-side

---

### **12:50 - 13:15 (25 min) - XSS Prevention y Sanitización**

#### **Objetivos**

- Prevenir ataques XSS efectivamente
- Implementar sanitización de input
- Usar DOMPurify para limpieza de HTML

#### **Contenido**

```javascript
// Prevención XSS básica
function sanitizeInput(input) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

// Usando DOMPurify
import DOMPurify from 'dompurify';

function sanitizeHTML(html) {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p'],
    ALLOWED_ATTR: [],
  });
}
```

#### **Actividades**

- **12:50-12:55**: Tipos de XSS (Reflected, Stored, DOM)
- **12:55-13:05**: Técnicas de sanitización
- **13:05-13:10**: Implementación con DOMPurify
- **13:10-13:15**: Testing de prevención XSS

#### **Archivo de Trabajo**

- `ejercicios/03-xss-prevention.js`

#### **Evaluación**

- ✅ Implementar sanitización que previene XSS
- ✅ Usar DOMPurify correctamente
- ✅ Testing contra ataques XSS comunes

---

### **13:15 - 13:30 (15 min) - DESCANSO**

#### **Actividades**

- Breve repaso de conceptos
- Resolver dudas individuales
- Preparar para siguientes temas
- Networking entre estudiantes

---

### **13:30 - 13:55 (25 min) - CSRF Protection Fundamentos**

#### **Objetivos**

- Entender y prevenir ataques CSRF
- Implementar CSRF tokens
- Configurar SameSite cookies

#### **Contenido**

```javascript
// Implementación básica de CSRF token
function generateCSRFToken() {
  return crypto.randomUUID();
}

function validateCSRFToken(token, sessionToken) {
  return token === sessionToken;
}

// Configuración de cookies SameSite
function setSecureCookie(name, value) {
  document.cookie = `${name}=${value}; SameSite=Strict; Secure; HttpOnly`;
}
```

#### **Actividades**

- **13:30-13:35**: Explicar qué es CSRF
- **13:35-13:45**: Implementar CSRF tokens
- **13:45-13:50**: SameSite cookie attribute
- **13:50-13:55**: Double submit cookies

#### **Archivo de Trabajo**

- `ejercicios/04-csrf-protection.js`

#### **Evaluación**

- ✅ Implementar protección CSRF básica
- ✅ Configurar cookies seguras
- ✅ Validar tokens correctamente

---

### **13:55 - 14:20 (25 min) - Content Security Policy (CSP)**

#### **Objetivos**

- Configurar CSP para prevenir ataques
- Implementar directivas de seguridad
- Debuggear violaciones de CSP

#### **Contenido**

```javascript
// Configuración CSP básica
const csp = {
  'default-src': "'self'",
  'script-src': "'self' 'unsafe-inline'",
  'style-src': "'self' 'unsafe-inline'",
  'img-src': "'self' data: https:",
  'connect-src': "'self' https://api.example.com",
};

// Implementación en header
function setCSPHeader(csp) {
  const cspString = Object.entries(csp)
    .map(([key, value]) => `${key} ${value}`)
    .join('; ');

  return `Content-Security-Policy: ${cspString}`;
}
```

#### **Actividades**

- **13:55-14:00**: Explicar qué es CSP
- **14:00-14:10**: Directivas principales
- **14:10-14:15**: Implementación en headers
- **14:15-14:20**: Debugging CSP violations

#### **Archivo de Trabajo**

- `ejercicios/05-csp-implementation.js`

#### **Evaluación**

- ✅ CSP configurado y funcionando
- ✅ Directivas apropiadas implementadas
- ✅ Debugging de violaciones efectivo

---

### **14:20 - 14:45 (25 min) - Input Validation y Sanitización**

#### **Objetivos**

- Implementar validación y sanitización completa
- Aplicar principios de whitelist
- Crear error handling robusto

#### **Contenido**

```javascript
// Sistema completo de validación
class InputValidator {
  constructor() {
    this.rules = new Map();
    this.sanitizers = new Map();
  }

  addRule(field, validator) {
    this.rules.set(field, validator);
  }

  addSanitizer(field, sanitizer) {
    this.sanitizers.set(field, sanitizer);
  }

  validate(data) {
    const errors = {};
    const sanitized = {};

    for (const [field, value] of Object.entries(data)) {
      // Sanitizar primero
      const sanitizer = this.sanitizers.get(field);
      const cleanValue = sanitizer ? sanitizer(value) : value;

      // Luego validar
      const validator = this.rules.get(field);
      if (validator && !validator(cleanValue)) {
        errors[field] = `Invalid ${field}`;
      } else {
        sanitized[field] = cleanValue;
      }
    }

    return { errors, sanitized };
  }
}
```

#### **Actividades**

- **14:20-14:25**: Principios de validación
- **14:25-14:35**: Whitelist vs blacklist
- **14:35-14:40**: Sanitización de diferentes tipos
- **14:40-14:45**: Error handling robusto

#### **Archivo de Trabajo**

- `ejercicios/06-secure-coding.js`

#### **Evaluación**

- ✅ Sistema de validación completo funcionando
- ✅ Sanitización efectiva implementada
- ✅ Error handling robusto

---

### **14:45 - 15:00 (15 min) - DESCANSO**

#### **Actividades**

- Revisar avances del día
- Resolver dudas técnicas
- Preparar para proyectos prácticos

---

### **15:00 - 15:25 (25 min) - Secure Coding Practices**

#### **Objetivos**

- Aplicar mejores prácticas de seguridad
- Realizar code review de seguridad
- Documentar decisiones de seguridad

#### **Contenido**

```javascript
// Secure coding checklist
const securityChecklist = {
  input: {
    validate: 'Always validate input on client AND server',
    sanitize: 'Sanitize all user input before processing',
    whitelist: 'Use whitelist approach for validation',
  },
  output: {
    escape: 'Escape output based on context',
    encode: 'Encode data for HTML, JS, CSS contexts',
    csp: 'Use Content Security Policy',
  },
  authentication: {
    csrf: 'Implement CSRF protection',
    session: 'Use secure session management',
    cookies: 'Configure secure cookies',
  },
};
```

#### **Actividades**

- **15:00-15:05**: Principios de secure coding
- **15:05-15:15**: Code review de seguridad
- **15:15-15:20**: Herramientas de análisis estático
- **15:20-15:25**: Documentación de seguridad

#### **Refactoring**

- Aplicar secure practices a ejercicios previos

#### **Evaluación**

- ✅ Código refactorizado con secure practices
- ✅ Documentación de seguridad completa
- ✅ Code review efectivo

---

### **15:25 - 15:50 (25 min) - Testing de Validaciones**

#### **Objetivos**

- Crear tests para validaciones de seguridad
- Implementar automated security testing
- Cubrir edge cases y ataques

#### **Contenido**

```javascript
// Testing de validaciones con Jest
describe('Security Validation Tests', () => {
  test('should prevent XSS attacks', () => {
    const maliciousInput = '<script>alert("XSS")</script>';
    const sanitized = sanitizeInput(maliciousInput);
    expect(sanitized).not.toContain('<script>');
  });

  test('should validate email format', () => {
    const validEmail = 'test@example.com';
    const invalidEmail = 'invalid-email';

    expect(validateEmail(validEmail)).toBe(true);
    expect(validateEmail(invalidEmail)).toBe(false);
  });

  test('should prevent CSRF attacks', () => {
    const validToken = 'abc123';
    const invalidToken = 'xyz789';

    expect(validateCSRFToken(validToken, validToken)).toBe(true);
    expect(validateCSRFToken(invalidToken, validToken)).toBe(false);
  });
});
```

#### **Actividades**

- **15:25-15:30**: Testing de validaciones con Jest
- **15:30-15:40**: Test cases para edge cases
- **15:40-15:45**: Mocking de ataques
- **15:45-15:50**: Automated security testing

#### **Evaluación**

- ✅ Tests de validación pasando
- ✅ Edge cases cubiertos
- ✅ Automated testing implementado

---

### **15:50 - 16:15 (25 min) - Proyecto: Sistema de Validación Robusto**

#### **Objetivos**

- Desarrollar sistema completo de validaciones
- Integrar todas las técnicas aprendidas
- Crear documentación comprehensiva

#### **Especificaciones del Proyecto**

```javascript
// Sistema de validación completo
class SecureValidationSystem {
  constructor() {
    this.validators = new Map();
    this.sanitizers = new Map();
    this.csrfTokens = new Map();
  }

  // Registro de formulario con validaciones múltiples
  registerForm(formId, config) {
    const form = document.getElementById(formId);

    // Implementar validaciones
    // Agregar protección CSRF
    // Configurar sanitización
    // Manejar errores
  }

  // Validación en tiempo real
  validateField(field, value) {
    // Implementar validación inmediata
  }

  // Prevención XSS
  sanitizeOutput(content) {
    // Implementar sanitización segura
  }
}
```

#### **Actividades**

- **15:50-15:55**: Analizar requirements del proyecto
- **15:55-16:05**: Implementar validaciones múltiples
- **16:05-16:10**: Integrar técnicas de seguridad
- **16:10-16:15**: Testing y documentación

#### **Archivo de Trabajo**

- `proyectos/validacion-sistema/`

#### **Evaluación**

- ✅ Sistema de validación funcionando completamente
- ✅ Todas las técnicas integradas
- ✅ Testing comprehensivo
- ✅ Documentación completa

---

### **16:15 - 17:00 (45 min) - Challenge: Contador CSS Puro**

#### **Objetivos**

- Crear contador avanzado solo con CSS
- Implementar animaciones complejas
- Dominar CSS counters y pseudo-elements

#### **Contenido**

```css
/* CSS Counters avanzado */
.counter-container {
  counter-reset: main-counter 0;
}

.counter-item {
  counter-increment: main-counter;
  position: relative;
}

.counter-item::before {
  content: counter(main-counter);
  display: inline-block;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  text-align: center;
  line-height: 30px;
  margin-right: 10px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

/* Contador interactivo */
.interactive-counter {
  counter-reset: click-counter 0;
}

.click-button:active {
  counter-increment: click-counter;
}

.click-button::after {
  content: 'Clicks: ' counter(click-counter);
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 5px 10px;
  border-radius: 3px;
  font-size: 12px;
}
```

#### **Actividades**

- **16:15-16:20**: Explicar CSS counters
- **16:20-16:30**: Implementar counter-reset y counter-increment
- **16:30-16:40**: Styling avanzado de contadores
- **16:40-16:50**: Animaciones CSS
- **16:50-17:00**: Crear contador interactivo

#### **Archivo de Trabajo**

- `proyectos/contador-css/`

#### **Evaluación**

- ✅ Contador CSS funcionando con animaciones
- ✅ Interactividad implementada
- ✅ Styling avanzado aplicado
- ✅ Código CSS optimizado

---

## 📊 Evaluación Final del Día

### **Competencias Técnicas Evaluadas**

- ✅ **RegExp Mastery**: Sintaxis avanzada y optimización
- ✅ **Form Validation**: Implementación robusta
- ✅ **XSS Prevention**: Sanitización efectiva
- ✅ **CSRF Protection**: Configuración correcta
- ✅ **CSP Implementation**: Directivas apropiadas
- ✅ **Secure Coding**: Mejores prácticas aplicadas
- ✅ **Security Testing**: Automated testing
- ✅ **CSS Counters**: Implementación avanzada

### **Entregables del Día**

1. **6 Ejercicios completados** con validaciones funcionando
2. **Sistema de validación robusto** implementado
3. **Contador CSS puro** con animaciones
4. **Tests de seguridad** pasando
5. **Documentación de seguridad** completa

### **Criterios de Evaluación**

- **Funcionalidad** (40%): Validaciones y seguridad funcionando
- **Seguridad** (30%): Prevención efectiva de vulnerabilidades
- **Código** (20%): Clean code y secure practices
- **Testing** (10%): Automated security testing

### **Preparación para Día 5**

- Validaciones consolidadas
- Conocimientos de seguridad aplicados
- Git básico funcionando
- Preparación para control de versiones avanzado

---

## 🎯 Recursos y Herramientas

### **Herramientas Utilizadas**

- **VS Code**: Editor principal
- **Browser DevTools**: Debugging y testing
- **Jest**: Testing framework
- **DOMPurify**: Sanitización XSS
- **RegExr**: Testing de expresiones regulares

### **Referencias**

- [MDN RegExp Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)
- [OWASP XSS Prevention](https://owasp.org/www-project-cheat-sheets/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet)
- [MDN Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

---

_Día 4 Detallado - Bootcamp Tecnologías Web WorldSkills 2025_
