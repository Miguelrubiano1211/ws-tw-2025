# 🎯 Ejercicios Día 1 - HTML5 Semántico y Accesibilidad

## 📋 Ejercicio 1: Estructura HTML5 Semántica

### Objetivo

Crear la estructura básica de un documento HTML5 semántico.

### Instrucciones

1. Crear un archivo `ejercicio1.html`
2. Implementar la estructura semántica completa
3. Incluir todos los elementos semánticos aprendidos

### Código Base

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0" />
    <title>Ejercicio 1 - HTML5 Semántico</title>
  </head>
  <body>
    <!-- Completar la estructura semántica -->
  </body>
</html>
```

### Elementos Requeridos

- [ ] `<header>` con navegación
- [ ] `<nav>` con lista de enlaces
- [ ] `<main>` con contenido principal
- [ ] `<section>` para diferentes secciones
- [ ] `<article>` para contenido independiente
- [ ] `<aside>` para contenido lateral
- [ ] `<footer>` con información de contacto
- [ ] `<figure>` y `<figcaption>` para imágenes
- [ ] `<time>` para fechas
- [ ] `<address>` para información de contacto

---

## 📋 Ejercicio 2: Formulario con Validaciones

### Objetivo

Crear un formulario de registro con validaciones HTML5 nativas.

### Instrucciones

1. Crear un archivo `ejercicio2.html`
2. Implementar formulario con diferentes tipos de input
3. Aplicar validaciones nativas

### Elementos Requeridos

- [ ] `<form>` con método POST
- [ ] `<fieldset>` y `<legend>` para agrupar campos
- [ ] Input tipo `email` con validación
- [ ] Input tipo `password` con requisitos
- [ ] Input tipo `tel` con pattern
- [ ] Input tipo `date` para fecha de nacimiento
- [ ] Input tipo `number` con min/max
- [ ] Input tipo `range` con valor por defecto
- [ ] `<select>` con opciones
- [ ] `<textarea>` con límite de caracteres
- [ ] Radio buttons agrupados
- [ ] Checkboxes con validación
- [ ] Botón de envío y reset

---

## 📋 Ejercicio 3: Accesibilidad Web

### Objetivo

Mejorar la accesibilidad de una página web existente.

### Instrucciones

1. Tomar el código del ejercicio 1
2. Agregar atributos de accesibilidad
3. Verificar navegación por teclado

### Atributos ARIA Requeridos

- [ ] `role` attributes apropiados
- [ ] `aria-label` para elementos sin texto
- [ ] `aria-describedby` para descripciones
- [ ] `aria-expanded` para elementos expandibles
- [ ] `aria-current` para navegación actual
- [ ] `aria-live` para actualizaciones dinámicas
- [ ] `tabindex` para orden de navegación

### Elementos de Accesibilidad

- [ ] Skip link para navegación
- [ ] Estructura de headings jerárquica
- [ ] Alt text descriptivo para imágenes
- [ ] Labels asociados con inputs
- [ ] Focus styles visibles
- [ ] Contraste de colores adecuado

---

## 📋 Ejercicio 4: CSS Grid Layout

### Objetivo

Crear un layout responsive usando CSS Grid.

### Instrucciones

1. Crear archivo `ejercicio4.html` y `ejercicio4.css`
2. Implementar layout con CSS Grid
3. Hacer responsive para móvil y desktop

### Layout Requerido

```
Header (grid-column: 1 / -1)
Nav (grid-column: 1 / 2)
Main (grid-column: 2 / 3)
Aside (grid-column: 3 / 4)
Footer (grid-column: 1 / -1)
```

### CSS Grid Properties

- [ ] `display: grid`
- [ ] `grid-template-columns`
- [ ] `grid-template-rows`
- [ ] `grid-template-areas`
- [ ] `grid-gap` / `gap`
- [ ] `grid-column`
- [ ] `grid-row`

---

## 📋 Ejercicio 5: JavaScript Interactivo

### Objetivo

Agregar interactividad básica con JavaScript.

### Instrucciones

1. Crear archivo `ejercicio5.html` y `ejercicio5.js`
2. Implementar funcionalidades interactivas
3. Usar JavaScript ES6+ moderno

### Funcionalidades Requeridas

- [ ] Validación de formulario en tiempo real
- [ ] Navegación suave (smooth scrolling)
- [ ] Menú hamburguesa responsivo
- [ ] Contador de caracteres en textarea
- [ ] Mostrar/ocultar contenido
- [ ] Cambio de tema (modo oscuro/claro)
- [ ] Confirmación antes de envío

### JavaScript Concepts

- [ ] `document.querySelector()`
- [ ] `addEventListener()`
- [ ] `preventDefault()`
- [ ] `classList.toggle()`
- [ ] `template literals`
- [ ] `arrow functions`
- [ ] `const` y `let`

---

## 📋 Ejercicio 6: Script de Automatización

### Objetivo

Crear un script bash para automatizar tareas de desarrollo.

### Instrucciones

1. Crear archivo `ejercicio6.sh`
2. Implementar funcionalidades de automatización
3. Hacer el script ejecutable

### Funcionalidades Requeridas

- [ ] Crear estructura de proyecto
- [ ] Validar archivos HTML/CSS
- [ ] Optimizar imágenes
- [ ] Generar reporte de métricas
- [ ] Backup automático de archivos
- [ ] Deploy a servidor local

### Bash Scripting Concepts

- [ ] Variables y arrays
- [ ] Condicionales (if/else)
- [ ] Loops (for/while)
- [ ] Funciones
- [ ] Parámetros de línea de comandos
- [ ] Manejo de errores
- [ ] Colored output

---

## 📋 Ejercicio 7: Git Workflow

### Objetivo

Practicar workflow completo con Git.

### Instrucciones

1. Inicializar repositorio Git
2. Crear branches para diferentes features
3. Hacer commits siguiendo convenciones

### Git Commands Practice

```bash
# Inicializar repo
git init
git remote add origin [URL]

# Crear branch
git checkout -b feature/ejercicio-1

# Hacer commits
git add .
git commit -m "feat: agregar estructura HTML5 semántica"

# Merge branch
git checkout main
git merge feature/ejercicio-1

# Push changes
git push origin main
```

### Git Best Practices

- [ ] Conventional commits
- [ ] Branch naming conventions
- [ ] Descriptive commit messages
- [ ] Regular commits (no grandes cambios)
- [ ] .gitignore apropiado

---

## 📋 Ejercicio 8: Testing y Validación

### Objetivo

Validar y testear el código desarrollado.

### Instrucciones

1. Validar HTML con W3C Validator
2. Validar CSS con CSS Validator
3. Testear accesibilidad con axe

### Validation Tools

- [ ] W3C HTML Validator
- [ ] W3C CSS Validator
- [ ] axe DevTools
- [ ] Lighthouse audit
- [ ] Wave accessibility tool

### Testing Checklist

- [ ] HTML válido (sin errores)
- [ ] CSS válido (sin errores)
- [ ] Accesibilidad 100% (axe)
- [ ] Performance 90+ (Lighthouse)
- [ ] SEO 100% (Lighthouse)
- [ ] Responsive en diferentes dispositivos

---

## 🎯 Proyecto Final del Día

### Objetivo

Integrar todos los conceptos aprendidos en un proyecto completo.

### Descripción

Crear un sitio web completo para un restaurante local con:

- Página principal (index.html)
- Página de menú (menu.html)
- Página de contacto (contact.html)
- Página de reservas (booking.html)

### Requisitos Técnicos

- [ ] HTML5 semántico en todas las páginas
- [ ] CSS Grid y Flexbox para layout
- [ ] Formularios con validaciones
- [ ] Accesibilidad WCAG 2.1 AA
- [ ] JavaScript para interactividad
- [ ] Responsive design
- [ ] Git con commits convencionales

### Estructura del Proyecto

```
restaurante/
├── index.html
├── menu.html
├── contact.html
├── booking.html
├── styles.css
├── script.js
├── images/
│   └── (imágenes del restaurante)
└── README.md
```

### Criterios de Evaluación

- **HTML Semántico (25%)**: Uso correcto de elementos semánticos
- **CSS Moderno (25%)**: Grid, Flexbox, variables CSS
- **Accesibilidad (25%)**: Cumplimiento WCAG 2.1
- **JavaScript (15%)**: Funcionalidades interactivas
- **Git Workflow (10%)**: Commits y documentación

---

## 📚 Recursos de Apoyo

### Documentación

- [MDN HTML Reference](https://developer.mozilla.org/en-US/docs/Web/HTML)
- [MDN CSS Reference](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### Herramientas

- [W3C Validator](https://validator.w3.org/)
- [CSS Validator](https://jigsaw.w3.org/css-validator/)
- [axe DevTools](https://www.deque.com/axe/devtools/)

### Ejemplos

- [HTML5 Boilerplate](https://html5boilerplate.com/)
- [CSS Grid Examples](https://gridbyexample.com/)
- [Accessible Components](https://inclusive-components.design/)

---

## ✅ Entregables

1. **Archivos HTML** - Todos los ejercicios completados
2. **Archivos CSS** - Estilos modernos y responsive
3. **Archivos JavaScript** - Funcionalidades interactivas
4. **Scripts Bash** - Automatización completada
5. **Repositorio Git** - Con historial de commits
6. **Documentación** - README.md completo
7. **Proyecto Final** - Sitio web del restaurante

**Fecha de entrega:** Final del día 1  
**Método de entrega:** Repositorio GitHub + presentación en clase

¡Éxito en los ejercicios! 🚀
