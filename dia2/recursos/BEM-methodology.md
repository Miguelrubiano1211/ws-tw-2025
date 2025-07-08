# 🎨 Guía de Metodología BEM

## ¿Qué es BEM?

BEM (Block Element Modifier) es una metodología de nomenclatura para CSS que hace que el código sea más legible, mantenible y escalable.

## Estructura BEM

### Block (Bloque)

Componente independiente y reutilizable.

```css
.card {
}
.button {
}
.header {
}
.navigation {
}
```

### Element (Elemento)

Parte de un bloque que no puede existir por sí sola.

```css
.card__header {
}
.card__body {
}
.card__footer {
}
.button__text {
}
.button__icon {
}
```

### Modifier (Modificador)

Variación de un bloque o elemento.

```css
.card--featured {
}
.card--large {
}
.button--primary {
}
.button--disabled {
}
.card__header--dark {
}
```

## Ejemplos Prácticos

### Ejemplo 1: Componente Card

```html
<div class="card card--featured">
  <div class="card__header">
    <h3 class="card__title">Título de la tarjeta</h3>
    <span class="card__subtitle card__subtitle--muted">Subtítulo</span>
  </div>
  <div class="card__body">
    <p class="card__text">Contenido de la tarjeta...</p>
  </div>
  <div class="card__footer">
    <button class="button button--primary">
      <span class="button__text">Leer más</span>
      <i class="button__icon fas fa-arrow-right"></i>
    </button>
  </div>
</div>
```

```css
/* Block */
.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  background: white;
}

/* Modifier */
.card--featured {
  border-color: #007bff;
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.1);
}

/* Elements */
.card__header {
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.card__title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.card__subtitle {
  font-size: 0.875rem;
  color: #666;
}

.card__subtitle--muted {
  color: #999;
}

.card__body {
  padding: 1rem;
}

.card__text {
  margin: 0;
  line-height: 1.6;
}

.card__footer {
  padding: 1rem;
  background: #f8f9fa;
}
```

### Ejemplo 2: Componente Button

```html
<button class="button button--primary button--large">
  <i class="button__icon fas fa-download"></i>
  <span class="button__text">Descargar</span>
</button>

<button class="button button--secondary button--small button--disabled">
  <span class="button__text">Cancelar</span>
</button>
```

```css
/* Block */
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 2px solid transparent;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

/* Modifiers */
.button--primary {
  background: #007bff;
  color: white;
}

.button--primary:hover {
  background: #0056b3;
}

.button--secondary {
  background: #6c757d;
  color: white;
}

.button--large {
  padding: 1rem 2rem;
  font-size: 1.125rem;
}

.button--small {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.button--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Elements */
.button__icon {
  font-size: 1em;
}

.button__text {
  /* Estilos específicos para el texto del botón */
}
```

### Ejemplo 3: Componente Navigation

```html
<nav class="navigation navigation--horizontal">
  <ul class="navigation__list">
    <li class="navigation__item">
      <a
        href="#"
        class="navigation__link navigation__link--active">
        <i class="navigation__icon fas fa-home"></i>
        <span class="navigation__text">Inicio</span>
      </a>
    </li>
    <li class="navigation__item">
      <a
        href="#"
        class="navigation__link">
        <i class="navigation__icon fas fa-user"></i>
        <span class="navigation__text">Perfil</span>
      </a>
    </li>
    <li class="navigation__item navigation__item--dropdown">
      <a
        href="#"
        class="navigation__link">
        <i class="navigation__icon fas fa-cog"></i>
        <span class="navigation__text">Configuración</span>
        <i class="navigation__dropdown-icon fas fa-chevron-down"></i>
      </a>
      <ul class="navigation__dropdown">
        <li class="navigation__dropdown-item">
          <a
            href="#"
            class="navigation__dropdown-link"
            >General</a
          >
        </li>
        <li class="navigation__dropdown-item">
          <a
            href="#"
            class="navigation__dropdown-link"
            >Cuenta</a
          >
        </li>
      </ul>
    </li>
  </ul>
</nav>
```

```css
/* Block */
.navigation {
  background: #343a40;
}

/* Modifiers */
.navigation--horizontal {
  /* Estilos para navegación horizontal */
}

.navigation--vertical {
  /* Estilos para navegación vertical */
}

/* Elements */
.navigation__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
}

.navigation__item {
  position: relative;
}

.navigation__item--dropdown:hover .navigation__dropdown {
  display: block;
}

.navigation__link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.2s ease;
}

.navigation__link:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.navigation__link--active {
  color: white;
  background: rgba(255, 255, 255, 0.2);
}

.navigation__icon {
  font-size: 1.125rem;
}

.navigation__text {
  /* Estilos específicos para el texto */
}

.navigation__dropdown-icon {
  margin-left: auto;
  font-size: 0.875rem;
}

.navigation__dropdown {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 200px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.navigation__dropdown-item {
  /* Estilos para items del dropdown */
}

.navigation__dropdown-link {
  display: block;
  padding: 0.75rem 1rem;
  color: #333;
  text-decoration: none;
  transition: background 0.2s ease;
}

.navigation__dropdown-link:hover {
  background: #f8f9fa;
}
```

## Ventajas de BEM

### 1. Claridad

- Los nombres de clase son autodescriptivos
- Fácil de entender la estructura del componente

### 2. Modularidad

- Componentes independientes y reutilizables
- Fácil de mantener y modificar

### 3. Escalabilidad

- Funciona bien en proyectos grandes
- Reduce conflictos de nombres

### 4. Especificidad

- Evita problemas de especificidad CSS
- Reduce la necesidad de `!important`

## Consejos y Mejores Prácticas

### 1. Nomenclatura Consistente

```css
/* ✅ Correcto */
.search-form__input--large {
}

/* ❌ Incorrecto */
.searchForm__input_large {
}
```

### 2. Un Modificador por Vez

```css
/* ✅ Correcto */
.button--primary {
}
.button--large {
}

/* ❌ Incorrecto */
.button--primary-large {
}
```

### 3. Evitar Anidación Profunda

```css
/* ✅ Correcto */
.card__header {
}
.card__title {
}

/* ❌ Incorrecto */
.card__header__title {
}
```

### 4. Usar Modificadores Booleanos

```css
/* ✅ Correcto */
.button--disabled {
}
.modal--open {
}

/* ❌ Incorrecto */
.button--enabled {
}
.modal--closed {
}
```

## Herramientas y Recursos

### Preprocesadores CSS

```scss
// SASS/SCSS
.card {
  border: 1px solid #ddd;

  &--featured {
    border-color: #007bff;
  }

  &__header {
    padding: 1rem;

    &--dark {
      background: #333;
    }
  }

  &__title {
    margin: 0;
    font-size: 1.25rem;
  }
}
```

### Validadores BEM

- **BEM Validator**: Extensiones de VS Code
- **Linters**: ESLint y stylelint con reglas BEM

### Generadores de Componentes

```bash
# Ejemplo de estructura de archivos BEM
components/
├── card/
│   ├── card.html
│   ├── card.css
│   └── card.js
├── button/
│   ├── button.html
│   ├── button.css
│   └── button.js
└── navigation/
    ├── navigation.html
    ├── navigation.css
    └── navigation.js
```

## Ejercicios Prácticos

### Ejercicio 1: Crear un Modal

Implementa un modal usando BEM con:

- `.modal` (bloque)
- `.modal__overlay` (elemento)
- `.modal__content` (elemento)
- `.modal__header` (elemento)
- `.modal__body` (elemento)
- `.modal__footer` (elemento)
- `.modal--large` (modificador)
- `.modal--centered` (modificador)

### Ejercicio 2: Crear una Tarjeta de Producto

Diseña una tarjeta de producto con:

- Imagen del producto
- Título y descripción
- Precio
- Botón de compra
- Estado (nuevo, oferta, agotado)

### Ejercicio 3: Crear un Formulario

Implementa un formulario con:

- Diferentes tipos de inputs
- Validación visual
- Estados de error y éxito
- Layouts responsivos

¡Recuerda que BEM es una herramienta para mejorar la organización y mantenibilidad de tu CSS, no una regla rígida!
