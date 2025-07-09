# 📅 DÍA 10: JavaScript Moderno (ES6+) - Cronograma Detallado

## 🎯 Objetivo General

Dominar las características más importantes de JavaScript moderno (ES6+) y aplicarlas en un proyecto web completo, preparándose para frameworks como React y Express.js.

---

## ⏰ SESIÓN 1: ES6 Features Básicas (09:00-10:30)

### **📚 Teoría (09:00-09:30)**

#### **Let/const vs var**

- **Temporal Dead Zone**: comportamiento antes de la declaración
- **Block scoping**: diferencias con function scoping
- **Hoisting**: comportamiento de let/const vs var
- **Casos de uso**: cuándo usar cada uno

#### **Template Literals**

- **Interpolation**: ${expression} syntax
- **Multiline strings**: sin escape characters
- **Tagged templates**: procesamiento avanzado
- **Casos de uso**: HTML templates, logging

#### **Arrow Functions**

- **Sintaxis**: parámetros, return implícito
- **This binding**: diferencias con function
- **Casos de uso**: callbacks, array methods

### **💻 Práctica (09:30-10:15)**

- **Ejercicio 1**: Refactorización var → let/const
- **Ejercicio 2**: Template literals para HTML
- **Ejercicio 3**: Arrow functions en array methods
- **Ejercicio 4**: Comparación this binding

### **🎯 Actividad (10:15-10:30)**

- **Refactorización en vivo**: código legacy → ES6
- **Discusión**: mejores prácticas
- **Q&A**: dudas y casos especiales

---

## ⏰ SESIÓN 2: Destructuring y Spread/Rest (10:45-12:15)

### **📚 Teoría (10:45-11:15)**

#### **Destructuring Avanzado**

- **Array destructuring**: swapping, skipping elements
- **Object destructuring**: renaming, default values
- **Nested destructuring**: objetos/arrays complejos
- **Parameter destructuring**: funciones más limpias

#### **Spread/Rest Operators**

- **Spread syntax**: arrays, objects, function calls
- **Rest parameters**: funciones con argumentos variables
- **Object spread**: cloning, merging
- **Array spread**: concatenation, copying

### **💻 Práctica (11:15-12:00)**

- **Ejercicio 1**: Destructuring en diferentes contextos
- **Ejercicio 2**: Spread para manipulación de datos
- **Ejercicio 3**: Rest parameters en funciones
- **Ejercicio 4**: Combinación de patrones

### **🎯 Actividad (12:00-12:15)**

- **Code review**: patrones comunes
- **Optimización**: comparación con métodos tradicionales
- **Casos de uso**: ejemplos del mundo real

---

## ⏰ SESIÓN 3: Módulos ES6 y Clases (13:30-15:00)

### **📚 Teoría (13:30-14:00)**

#### **Módulos ES6**

- **Named exports**: export { name }
- **Default exports**: export default
- **Import variations**: destructuring imports
- **Module organization**: estructura de archivos
- **Circular dependencies**: cómo evitarlas

#### **Clases ES6**

- **Class declaration**: constructor, methods
- **Static methods**: utility functions
- **Inheritance**: extends, super()
- **Private fields**: # syntax (ES2022)
- **Getters/setters**: computed properties

### **💻 Práctica (14:00-14:45)**

- **Ejercicio 1**: Sistema de módulos organizados
- **Ejercicio 2**: Jerarquía de clases
- **Ejercicio 3**: Herencia y polimorfismo
- **Ejercicio 4**: Módulos con clases

### **🎯 Actividad (14:45-15:00)**

- **Arquitectura**: diseño de módulos
- **Patrones**: factory, singleton con ES6
- **Preparación proyecto**: estructura base

---

## ⏰ SESIÓN 4: Proyecto Final (15:15-16:45)

### **🚀 Desarrollo del Proyecto (15:15-16:30)**

#### **Dashboard de Gestión - Características**

- **Autenticación**: login/logout con LocalStorage
- **Dashboard**: métricas, gráficos, cards
- **Gestión usuarios**: CRUD completo
- **Responsive design**: móvil y desktop
- **Módulos ES6**: arquitectura organizada

#### **Flujo de Desarrollo**

1. **Estructura base** (15:15-15:30)

   - Setup HTML/CSS
   - Módulos principales
   - Configuración inicial

2. **Autenticación** (15:30-15:45)

   - Clase Auth
   - Login/logout
   - Persistencia datos

3. **Dashboard** (15:45-16:00)

   - Métricas en tiempo real
   - Gráficos interactivos
   - Responsive layout

4. **Gestión usuarios** (16:00-16:15)

   - CRUD operations
   - Validación datos
   - UI/UX fluida

5. **Integración** (16:15-16:30)
   - Conectar módulos
   - Testing funcional
   - Pulir detalles

### **🎤 Presentación (16:30-16:45)**

- **Demo en vivo**: funcionalidades principales
- **Code review**: patrones ES6+ utilizados
- **Q&A**: preguntas técnicas
- **Feedback**: mejoras sugeridas

---

## 📋 Checklist de Progreso

### **Sesión 1: ES6 Features ✅**

- [ ] Let/const: diferencias con var
- [ ] Template literals: interpolación
- [ ] Arrow functions: sintaxis y this
- [ ] Refactorización código legacy
- [ ] Ejercicios completados

### **Sesión 2: Destructuring/Spread ✅**

- [ ] Array destructuring: patrones básicos
- [ ] Object destructuring: renaming, defaults
- [ ] Spread operator: arrays y objetos
- [ ] Rest parameters: funciones variables
- [ ] Ejercicios completados

### **Sesión 3: Módulos/Clases ✅**

- [ ] Módulos ES6: import/export
- [ ] Clases: constructor, métodos
- [ ] Herencia: extends, super
- [ ] Organización modular
- [ ] Ejercicios completados

### **Sesión 4: Proyecto Final ✅**

- [ ] Estructura base creada
- [ ] Autenticación implementada
- [ ] Dashboard funcional
- [ ] Gestión usuarios completa
- [ ] Presentación realizada

---

## 🎯 Entregables del Día

### **Ejercicios Prácticos**

- `01-es6-features.js` - Refactorización y nuevas características
- `02-destructuring.js` - Patrones de destructuring
- `03-spread-rest.js` - Operadores spread/rest
- `04-modules.js` - Sistema de módulos
- `05-classes.js` - Clases y herencia
- `06-integration.js` - Integración de conceptos

### **Proyecto Final**

- Dashboard de gestión completo
- Arquitectura modular ES6+
- Documentación del código
- Demo funcional

### **Documentación**

- Patrones ES6+ utilizados
- Decisiones arquitectónicas
- Casos de uso identificados
- Mejores prácticas aplicadas

---

## 📊 Rúbrica de Evaluación

### **Conocimiento Técnico (40%)**

- **Excelente (90-100%)**: Domina ES6+ perfectamente
- **Bueno (80-89%)**: Aplica la mayoría de conceptos
- **Satisfactorio (70-79%)**: Conocimiento básico sólido
- **Necesita mejora (<70%)**: Conceptos fundamentales incompletos

### **Aplicación Práctica (35%)**

- **Excelente (90-100%)**: Código limpio, patrones modernos
- **Bueno (80-89%)**: Buena aplicación de conceptos
- **Satisfactorio (70-79%)**: Funcionalidad básica correcta
- **Necesita mejora (<70%)**: Implementación deficiente

### **Proyecto Final (25%)**

- **Excelente (90-100%)**: Aplicación completa y profesional
- **Bueno (80-89%)**: Funcionalidad sólida, buen diseño
- **Satisfactorio (70-79%)**: Requisitos básicos cumplidos
- **Necesita mejora (<70%)**: Funcionalidad incompleta

---

## 🚀 Preparación para React/Express

### **Conceptos Clave para React**

- **Módulos ES6**: import/export de componentes
- **Clases/Arrow functions**: componentes funcionales
- **Destructuring**: props y state
- **Spread operator**: props spreading
- **Template literals**: JSX similar

### **Conceptos Clave para Express**

- **Módulos ES6**: organización del backend
- **Clases**: models y services
- **Destructuring**: req/res handling
- **Arrow functions**: middleware y callbacks
- **Spread/rest**: parámetros de API

### **Habilidades Transferibles**

- **Arquitectura modular**: organización de proyectos
- **Código limpio**: mejores prácticas
- **Patrones modernos**: design patterns
- **Debugging**: herramientas modernas

---

## 💡 Recursos Adicionales

### **Documentación Oficial**

- [MDN ES6 Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [ES6 Features](https://es6-features.org/)
- [TC39 Proposals](https://github.com/tc39/proposals)

### **Práctica Adicional**

- [JavaScript30](https://javascript30.com/) - Proyectos ES6
- [ES6 Katas](http://es6katas.org/) - Ejercicios específicos
- [Babel REPL](https://babeljs.io/repl) - Transpilación en vivo

### **Herramientas Útiles**

- **ESLint**: mejores prácticas
- **Prettier**: formateo automático
- **Babel**: transpilación
- **Webpack**: bundling moderno

---

## 🏆 ¡Domina JavaScript Moderno!

Este día te prepara para el desarrollo profesional con JavaScript. Los conceptos aquí aprendidos son la base para cualquier framework moderno y te darán la confianza para enfrentar proyectos complejos.

**¡Es hora de escribir JavaScript del futuro!** 🌟
