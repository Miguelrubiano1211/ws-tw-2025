# 🛡️ Ejercicios Día 4: Validaciones y Seguridad Frontend

## 🎯 Objetivos de los Ejercicios

Estos ejercicios te ayudarán a dominar:

1. **Regular Expressions avanzadas** para validaciones complejas
2. **Validaciones de formularios** robustas y user-friendly
3. **Prevención de XSS** y técnicas de sanitización
4. **Protección CSRF** en aplicaciones web
5. **Content Security Policy** para mayor seguridad
6. **Secure coding practices** en desarrollo frontend

## 📋 Lista de Ejercicios

### **1. RegExp Mastery** (`01-regexp-mastery.js`)

- Dominar sintaxis avanzada de expresiones regulares
- Implementar validaciones complejas
- Optimizar performance de RegExp

### **2. Form Validation** (`02-form-validation.js`)

- Crear validaciones robustas para formularios
- Combinar HTML5 validation con JavaScript
- Implementar feedback efectivo al usuario

### **3. XSS Prevention** (`03-xss-prevention.js`)

- Prevenir ataques XSS efectivamente
- Implementar sanitización de input
- Usar DOMPurify para limpieza segura

### **4. CSRF Protection** (`04-csrf-protection.js`)

- Implementar protección contra CSRF
- Configurar tokens de seguridad
- Usar cookies seguras

### **5. CSP Implementation** (`05-csp-implementation.js`)

- Configurar Content Security Policy
- Implementar directivas de seguridad
- Debuggear violaciones de CSP

### **6. Secure Coding** (`06-secure-coding.js`)

- Aplicar mejores prácticas de seguridad
- Implementar validación y sanitización completa
- Crear sistema robusto de validaciones

## 🚀 Cómo Usar los Ejercicios

### **Orden Recomendado**

1. **Comenzar con 01-regexp-mastery.js** - Base fundamental
2. **Continuar con 02-form-validation.js** - Aplicación práctica
3. **Seguir con 03-xss-prevention.js** - Seguridad básica
4. **Proceder con 04-csrf-protection.js** - Protección avanzada
5. **Avanzar con 05-csp-implementation.js** - Políticas de seguridad
6. **Finalizar con 06-secure-coding.js** - Integración completa

### **Metodología de Trabajo**

1. **Leer la teoría** en cada archivo
2. **Estudiar los ejemplos** proporcionados
3. **Completar los desafíos** paso a paso
4. **Probar tu código** con casos de prueba
5. **Optimizar y refactorizar** cuando sea necesario

### **Testing**

- Cada ejercicio incluye casos de prueba
- Usa `console.log()` para debugging
- Prueba con casos extremos (edge cases)
- Valida que la seguridad sea efectiva

## 🔧 Herramientas y Librerías

### **Herramientas Principales**

- **VS Code**: Editor con extensiones de seguridad
- **Browser DevTools**: Para debugging y testing
- **RegExr**: Testing de expresiones regulares online
- **Jest**: Framework de testing (opcional)

### **Librerías Recomendadas**

```javascript
// DOMPurify para sanitización XSS
import DOMPurify from 'dompurify';

// Validator.js para validaciones predefinidas
import validator from 'validator';

// Crypto para tokens seguros
import crypto from 'crypto';
```

### **Instalación**

```bash
# Si usas npm
npm install dompurify validator

# Si usas yarn
yarn add dompurify validator
```

## 📚 Conceptos Clave

### **Regular Expressions**

- **Metacaracteres**: `.`, `*`, `+`, `?`, `^`, `$`, `[]`, `()`
- **Quantifiers**: `{n}`, `{n,}`, `{n,m}`
- **Character classes**: `\d`, `\w`, `\s`, `\b`
- **Flags**: `g`, `i`, `m`, `s`

### **Validación de Formularios**

- **Client-side validation**: Inmediata, UX friendly
- **Server-side validation**: Segura, nunca omitir
- **Progressive enhancement**: Funcionar sin JavaScript
- **Accessibility**: ARIA labels y mensajes claros

### **Seguridad Frontend**

- **XSS Prevention**: Sanitización y escape
- **CSRF Protection**: Tokens y cookies SameSite
- **Input Validation**: Whitelist approach
- **Output Encoding**: Context-aware escaping

## 🎯 Patrones de Validación Comunes

### **Email Validation**

```javascript
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
```

### **Password Validation**

```javascript
// Mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número, 1 especial
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
```

### **Phone Validation**

```javascript
const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
```

### **URL Validation**

```javascript
const urlRegex =
  /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
```

## 🧪 Testing de Seguridad

### **Test Cases Esenciales**

```javascript
// Testing XSS prevention
const xssPayloads = [
  '<script>alert("XSS")</script>',
  'javascript:alert("XSS")',
  '<img src=x onerror=alert("XSS")>',
  '"><script>alert("XSS")</script>',
];

// Testing CSRF protection
const csrfTests = [
  'Valid token should pass',
  'Invalid token should fail',
  'Missing token should fail',
  'Expired token should fail',
];
```

### **Performance Testing**

```javascript
// Testing RegExp performance
console.time('RegExp test');
for (let i = 0; i < 10000; i++) {
  emailRegex.test('test@example.com');
}
console.timeEnd('RegExp test');
```

## 🚨 Errores Comunes a Evitar

### **RegExp Errors**

- **Catastrophic backtracking**: RegExp mal optimizado
- **Overly permissive**: Validaciones demasiado amplias
- **Not escaping special chars**: Caracteres especiales sin escape

### **Validation Errors**

- **Client-side only**: Nunca confiar solo en frontend
- **Poor user feedback**: Mensajes de error confusos
- **Blocking legitimate users**: Validaciones demasiado estrictas

### **Security Errors**

- **Incomplete sanitization**: Sanitización parcial
- **Trusting user input**: Nunca confiar en input del usuario
- **Missing CSRF protection**: Formularios sin protección

## 📖 Recursos Adicionales

### **Documentación Oficial**

- [MDN Regular Expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)
- [OWASP XSS Prevention](https://owasp.org/www-project-cheat-sheets/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet)
- [OWASP CSRF Prevention](https://owasp.org/www-project-cheat-sheets/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet)

### **Herramientas Online**

- [RegExr](https://regexr.com/) - Testing de RegExp
- [RegExp101](https://regex101.com/) - Validación de expresiones
- [DOMPurify Demo](https://cure53.de/purify) - Testing de sanitización

### **Lecturas Recomendadas**

- "Regular Expressions Cookbook" por O'Reilly
- "Web Security Testing Cookbook" por Paco Hope
- "Secure Coding Practices" por OWASP

## 🏆 Criterios de Evaluación

### **Funcionalidad (40%)**

- Validaciones funcionan correctamente
- Manejo adecuado de errores
- User experience fluida

### **Seguridad (30%)**

- XSS prevention efectiva
- CSRF protection implementada
- Input sanitization robusta

### **Código (20%)**

- RegExp optimizado
- Clean code practices
- Documentación clara

### **Testing (10%)**

- Edge cases cubiertos
- Performance adecuada
- Automated testing

## 🎯 Tips para WorldSkills

1. **Memoriza patrones comunes**: Email, phone, password RegExp
2. **Practica velocidad**: Implementación rápida pero segura
3. **Usa snippets**: Tener código reutilizable listo
4. **Testea siempre**: Validar contra ataques comunes
5. **Documenta decisiones**: Explicar por qué es seguro

## 🚀 ¡Comienza Ahora!

1. **Abre el primer ejercicio**: `01-regexp-mastery.js`
2. **Lee la teoría**: Entiende los conceptos
3. **Estudia los ejemplos**: Analiza el código
4. **Completa los desafíos**: Paso a paso
5. **Testa tu código**: Verifica que funcione
6. **Continúa al siguiente**: Mantén el momentum

---

💡 **Recuerda**: La seguridad no es opcional en desarrollo web moderno. Cada validación que implementes protege tanto a usuarios como a aplicaciones.

¡Buena suerte con los ejercicios!

---

_Ejercicios Día 4 - Bootcamp Tecnologías Web WorldSkills 2025_
