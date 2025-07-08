# 🎨 Día 2: CSS3 Avanzado y Responsive Design

## 🎯 Bienvenido al Día 2 del Bootcamp WorldSkills

Hoy nos sumergimos en el mundo del CSS avanzado, donde aprenderás a crear layouts profesionales, animaciones impresionantes y diseños responsive que funcionan en cualquier dispositivo.

## 📋 Resumen del Día

### 🎨 Lo que aprenderás:

- **CSS Grid Layout**: Crear layouts complejos en 2D
- **Flexbox Mastery**: Alineación perfecta y distribución flexible
- **Responsive Design**: Mobile-first approach y breakpoints inteligentes
- **CSS Animations**: Efectos visuales y transiciones profesionales
- **Variables CSS**: Sistemas de temas y tokens de diseño
- **Metodología BEM**: Organización y nomenclatura de CSS escalable

### ⏰ Horario: 12:00 PM - 5:00 PM (5 horas)

## 🗂️ Estructura de Archivos

```
dia2/
├── README.md                 # Esta guía
├── CHECKLIST_DIA2.md        # Lista de verificación completa
├── DIA2_DETALLADO.md        # Cronograma detallado
├── ejercicios/              # Ejercicios prácticos
│   ├── README.md
│   ├── grid-basic.html
│   ├── flexbox-navbar.html
│   ├── responsive-gallery.html
│   ├── animated-cards.html
│   └── theme-system.html
├── proyectos/               # Proyectos integradores
│   ├── README.md
│   ├── dashboard/
│   ├── animated-gallery/
│   └── worldskills-challenge/
├── recursos/                # Recursos y archivos de soporte
│   ├── images/
│   ├── sprites/
│   └── references/
└── styles/                  # Archivos CSS principales
    ├── grid-fundamentals.css
    ├── flexbox-mastery.css
    ├── responsive-design.css
    ├── animations.css
    ├── variables-theme.css
    └── bem-methodology.css
```

## 🚀 Cómo Empezar

### 1. Preparación del Entorno

```bash
# Navegar al directorio del día 2
cd dia2

# Instalar Live Server si no lo tienes
npm install -g live-server

# Iniciar servidor local
live-server .
```

### 2. Orden de Estudio Recomendado

1. 📊 **CSS Grid Layout** → `ejercicios/grid-basic.html`
2. 🔧 **Flexbox Mastery** → `ejercicios/flexbox-navbar.html`
3. 📱 **Responsive Design** → `ejercicios/responsive-gallery.html`
4. ✨ **CSS Animations** → `ejercicios/animated-cards.html`
5. 🎨 **Variables CSS** → `ejercicios/theme-system.html`
6. 🏆 **Challenge Final** → `proyectos/worldskills-challenge/`

## 📊 CSS Grid Layout

### 🎯 Conceptos Clave

- **Grid Container**: El elemento padre que define el contexto grid
- **Grid Items**: Los elementos hijos que se posicionan en el grid
- **Grid Lines**: Las líneas que dividen el grid (horizontal y vertical)
- **Grid Tracks**: Las filas y columnas del grid
- **Grid Cells**: Las intersecciones entre filas y columnas
- **Grid Areas**: Áreas rectangulares formadas por múltiples cells

### 💡 Ejemplo Básico

```css
.grid-container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-rows: auto 1fr auto;
  gap: 20px;
  height: 100vh;
}

.header {
  grid-area: 1 / 1 / 2 / 4;
}
.sidebar {
  grid-area: 2 / 1 / 3 / 2;
}
.main {
  grid-area: 2 / 2 / 3 / 3;
}
.aside {
  grid-area: 2 / 3 / 3 / 4;
}
.footer {
  grid-area: 3 / 1 / 4 / 4;
}
```

### 📱 Grid Responsive

```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}
```

## 🔧 Flexbox Mastery

### 🎯 Conceptos Clave

- **Flex Container**: El elemento padre con `display: flex`
- **Flex Items**: Los elementos hijos que se alinean
- **Main Axis**: El eje principal (horizontal por defecto)
- **Cross Axis**: El eje transversal (vertical por defecto)

### 💡 Centering Perfecto

```css
.center {
  display: flex;
  justify-content: center; /* Centrar horizontalmente */
  align-items: center; /* Centrar verticalmente */
  height: 100vh;
}
```

### 📱 Navbar Responsive

```css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    gap: 1rem;
  }
}
```

## 📱 Responsive Design

### 🎯 Mobile-First Approach

```css
/* Estilos base para móvil */
.container {
  width: 100%;
  padding: 1rem;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    max-width: 750px;
    margin: 0 auto;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
  }
}
```

### 🔧 Breakpoints Estratégicos

```css
/* Variables para breakpoints */
:root {
  --mobile: 320px;
  --tablet: 768px;
  --desktop: 1024px;
  --large: 1200px;
}

/* Uso en media queries */
@media (min-width: 768px) {
  /* Estilos para tablet y superior */
}
```

## ✨ CSS Animations

### 🎭 Transitions Suaves

```css
.button {
  background: #007bff;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.button:hover {
  background: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
```

### 🎨 Keyframe Animations

```css
@keyframes slideIn {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.slide-in {
  animation: slideIn 0.5s ease-out;
}
```

### 🎮 Loading Spinner

```css
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
```

## 🎨 Variables CSS

### 🌈 Sistema de Colores

```css
:root {
  /* Colores primarios */
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --success-color: #28a745;
  --warning-color: #ffc107;
  --danger-color: #dc3545;

  /* Colores de fondo */
  --bg-light: #f8f9fa;
  --bg-dark: #343a40;

  /* Tipografía */
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;
  --font-size-base: 1rem;
  --line-height-base: 1.5;
}
```

### 🌙 Theme Switcher

```css
/* Tema claro (por defecto) */
:root {
  --bg-color: #ffffff;
  --text-color: #333333;
  --border-color: #e0e0e0;
}

/* Tema oscuro */
[data-theme='dark'] {
  --bg-color: #1a1a1a;
  --text-color: #ffffff;
  --border-color: #404040;
}

body {
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: background-color 0.3s ease, color 0.3s ease;
}
```

## 🏗️ Metodología BEM

### 📝 Naming Convention

```css
/* Block */
.card {
}

/* Element */
.card__header {
}
.card__body {
}
.card__footer {
}

/* Modifier */
.card--featured {
}
.card--small {
}
.card__header--dark {
}
```

### 🎯 Ejemplo Práctico

```html
<div class="card card--featured">
  <div class="card__header card__header--dark">
    <h3 class="card__title">Título de la tarjeta</h3>
  </div>
  <div class="card__body">
    <p class="card__text">Contenido de la tarjeta</p>
  </div>
  <div class="card__footer">
    <button class="card__button card__button--primary">Acción</button>
  </div>
</div>
```

## 🏆 Challenge WorldSkills

### 🎯 Objetivo

Recrear un layout complejo similar a los utilizados en competencias WorldSkills, aplicando todos los conceptos aprendidos.

### 📋 Requisitos

- Layout responsive con Grid y Flexbox
- Animaciones CSS profesionales
- Sistema de variables para temas
- Código organizado con BEM
- Optimización para performance

### ⏰ Tiempo: 45 minutos

## 🧪 Ejercicios Prácticos

### 1. Grid Layout Básico

**Archivo**: `ejercicios/grid-basic.html`
**Objetivo**: Crear un layout 3x3 con Grid
**Tiempo**: 15 minutos

### 2. Flexbox Navbar

**Archivo**: `ejercicios/flexbox-navbar.html`
**Objetivo**: Navbar responsive con Flexbox
**Tiempo**: 20 minutos

### 3. Galería Responsive

**Archivo**: `ejercicios/responsive-gallery.html`
**Objetivo**: Galería de imágenes adaptativa
**Tiempo**: 25 minutos

### 4. Tarjetas Animadas

**Archivo**: `ejercicios/animated-cards.html`
**Objetivo**: Cards con hover animations
**Tiempo**: 20 minutos

### 5. Sistema de Temas

**Archivo**: `ejercicios/theme-system.html`
**Objetivo**: Theme switcher con variables CSS
**Tiempo**: 25 minutos

## 📚 Recursos y Referencias

### 🔗 Enlaces Útiles

- [CSS Grid Layout - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
- [A Complete Guide to Flexbox - CSS-Tricks](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [BEM Methodology](http://getbem.com/)
- [Can I Use](https://caniuse.com/) - Compatibilidad de browsers

### 🛠️ Herramientas

- [CSS Grid Generator](https://cssgrid-generator.netlify.app/)
- [Flexbox Froggy](https://flexboxfroggy.com/) - Juego para aprender Flexbox
- [Grid Garden](https://cssgridgarden.com/) - Juego para aprender Grid
- [Animista](https://animista.net/) - Generador de animaciones CSS

## 📊 Evaluación

### 🎯 Criterios de Evaluación

1. **Implementación técnica** (40%)

   - Uso correcto de Grid y Flexbox
   - Responsive design funcional
   - Animaciones smooth

2. **Creatividad y diseño** (30%)

   - Layouts atractivos
   - Animaciones innovadoras
   - Atención al detalle

3. **Código limpio** (20%)

   - Organización con BEM
   - Comentarios explicativos
   - Performance optimizada

4. **Documentación** (10%)
   - README completo
   - Instrucciones claras

### 🏆 Niveles de Logro

- **Principiante**: Completa ejercicios básicos
- **Intermedio**: Completa todos los ejercicios
- **Avanzado**: Supera el challenge WorldSkills
- **Experto**: Implementa funcionalidades extra

## 🎯 Próximos Pasos

### 🔜 Día 3: JavaScript ES6+ Fundamentals

- Variables, const, let, template literals
- Functions, arrow functions, destructuring
- Arrays methods (map, filter, reduce)
- Async/await y Promises

### 📈 Preparación Recomendada

1. Revisar conceptos básicos de JavaScript
2. Practicar con DevTools del navegador
3. Instalar extensiones de VS Code para JavaScript

---

## 💡 Tips para el Éxito

### 🎯 Durante el Día

- Practica con DevTools constantemente
- Experimenta con diferentes valores
- Haz preguntas y colabora con compañeros
- Documenta tu aprendizaje

### 🚀 Después del Día

- Refactoriza ejercicios anteriores con nuevos conocimientos
- Explora recursos adicionales
- Practica con proyectos personales
- Prepárate para JavaScript del día siguiente

---

**¡Que tengas un excelente día de aprendizaje!** 🎨✨
