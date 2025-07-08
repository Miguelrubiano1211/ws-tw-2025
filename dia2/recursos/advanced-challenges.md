# 🎯 Retos CSS Avanzados - Día 2

## Reto 1: Navbar Responsive Avanzado

### Objetivo

Crear un navbar que se adapte perfectamente a diferentes tamaños de pantalla con animaciones suaves.

### Requisitos

- [x] Logo en el lado izquierdo
- [x] Menú colapsable para móvil
- [x] Dropdown menus
- [x] Animaciones de hamburguesa
- [x] Sticky navbar con efectos de scroll
- [x] Indicador de página activa

### Código Base

```html
<nav class="navbar">
  <div class="navbar__container">
    <div class="navbar__brand">
      <img
        src="logo.svg"
        alt="Logo"
        class="navbar__logo" />
      <span class="navbar__title">Tu Marca</span>
    </div>

    <button
      class="navbar__toggle"
      aria-label="Toggle navigation">
      <span class="navbar__hamburger"></span>
    </button>

    <ul class="navbar__menu">
      <li class="navbar__item">
        <a
          href="#"
          class="navbar__link navbar__link--active"
          >Inicio</a
        >
      </li>
      <li class="navbar__item navbar__item--dropdown">
        <a
          href="#"
          class="navbar__link"
          >Servicios</a
        >
        <ul class="navbar__dropdown">
          <li>
            <a
              href="#"
              class="navbar__dropdown-link"
              >Desarrollo Web</a
            >
          </li>
          <li>
            <a
              href="#"
              class="navbar__dropdown-link"
              >Diseño UI/UX</a
            >
          </li>
          <li>
            <a
              href="#"
              class="navbar__dropdown-link"
              >Consultoría</a
            >
          </li>
        </ul>
      </li>
      <li class="navbar__item">
        <a
          href="#"
          class="navbar__link"
          >Contacto</a
        >
      </li>
    </ul>
  </div>
</nav>
```

### Desafío Extra

- Agregar un breadcrumb dinámico
- Implementar búsqueda en tiempo real
- Añadir modo oscuro/claro

---

## Reto 2: Sistema de Grid Magazine

### Objetivo

Crear un layout de revista moderna usando CSS Grid con áreas complejas.

### Requisitos

- [x] Header principal que ocupe todo el ancho
- [x] Sidebar para navegación
- [x] Área de contenido principal
- [x] Área de anuncios
- [x] Footer que ocupe todo el ancho
- [x] Responsive breakpoints

### Estructura Grid

```css
.magazine-layout {
  display: grid;
  grid-template-columns: 250px 1fr 300px;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    'header header header'
    'sidebar content ads'
    'footer footer footer';
  min-height: 100vh;
  gap: 1rem;
}

.magazine__header {
  grid-area: header;
}

.magazine__sidebar {
  grid-area: sidebar;
}

.magazine__content {
  grid-area: content;
}

.magazine__ads {
  grid-area: ads;
}

.magazine__footer {
  grid-area: footer;
}
```

### Desafío Extra

- Implementar un sistema de filtros
- Añadir paginación infinita
- Crear un sistema de comentarios

---

## Reto 3: Animaciones CSS Avanzadas

### Objetivo

Crear un portfolio con animaciones impresionantes usando solo CSS.

### Requisitos

- [x] Hero section con partículas animadas
- [x] Cards con efecto 3D flip
- [x] Parallax scrolling
- [x] Loading animations
- [x] Hover effects complejos

### Animación de Partículas

```css
@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0px);
  }
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  animation: float 3s ease-in-out infinite;
}

.particle:nth-child(1) {
  left: 10%;
  animation-delay: 0s;
}
.particle:nth-child(2) {
  left: 20%;
  animation-delay: 0.5s;
}
.particle:nth-child(3) {
  left: 30%;
  animation-delay: 1s;
}
```

### Card 3D Flip

```css
.card-3d {
  perspective: 1000px;
  width: 300px;
  height: 200px;
}

.card-3d__inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
}

.card-3d:hover .card-3d__inner {
  transform: rotateY(180deg);
}

.card-3d__front,
.card-3d__back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-3d__back {
  transform: rotateY(180deg);
}
```

### Desafío Extra

- Implementar un sistema de transiciones de página
- Crear animaciones basadas en scroll
- Añadir efectos de cursor personalizado

---

## Reto 4: Dashboard Responsivo

### Objetivo

Crear un dashboard administrativo completo con gráficos y tablas responsivas.

### Requisitos

- [x] Sidebar colapsable
- [x] Área de estadísticas con cards
- [x] Gráficos responsivos
- [x] Tablas con scroll horizontal
- [x] Notificaciones y alertas
- [x] Tema oscuro/claro

### Estructura Base

```html
<div class="dashboard">
  <aside class="dashboard__sidebar">
    <div class="sidebar__header">
      <h2 class="sidebar__title">Admin Panel</h2>
      <button class="sidebar__toggle">☰</button>
    </div>
    <nav class="sidebar__nav">
      <ul class="sidebar__menu">
        <li class="sidebar__item">
          <a
            href="#"
            class="sidebar__link sidebar__link--active">
            <i class="sidebar__icon">📊</i>
            <span class="sidebar__text">Dashboard</span>
          </a>
        </li>
        <li class="sidebar__item">
          <a
            href="#"
            class="sidebar__link">
            <i class="sidebar__icon">👥</i>
            <span class="sidebar__text">Usuarios</span>
          </a>
        </li>
      </ul>
    </nav>
  </aside>

  <main class="dashboard__main">
    <header class="dashboard__header">
      <h1 class="dashboard__title">Dashboard</h1>
      <div class="dashboard__user">
        <img
          src="avatar.jpg"
          alt="Usuario"
          class="dashboard__avatar" />
        <span class="dashboard__username">Juan Pérez</span>
      </div>
    </header>

    <section class="dashboard__stats">
      <div class="stat-card">
        <div class="stat-card__icon">👥</div>
        <div class="stat-card__content">
          <h3 class="stat-card__title">Usuarios</h3>
          <p class="stat-card__value">1,234</p>
          <span class="stat-card__change stat-card__change--positive"
            >+12%</span
          >
        </div>
      </div>
    </section>

    <section class="dashboard__content">
      <div class="dashboard__grid">
        <div class="dashboard__chart">
          <h3>Gráfico de Ventas</h3>
          <div class="chart-placeholder">Gráfico aquí</div>
        </div>
        <div class="dashboard__table">
          <h3>Últimas Transacciones</h3>
          <table class="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Cantidad</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>001</td>
                <td>Juan Pérez</td>
                <td>$150.00</td>
                <td><span class="badge badge--success">Completado</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </main>
</div>
```

### Desafío Extra

- Implementar drag & drop para reorganizar elementos
- Añadir gráficos interactivos con CSS puro
- Crear un sistema de notificaciones en tiempo real

---

## Reto 5: E-commerce Product Page

### Objetivo

Crear una página de producto completa con galería de imágenes, opciones de compra y reviews.

### Requisitos

- [x] Galería de imágenes con zoom
- [x] Selector de variantes (color, talla)
- [x] Quantity selector
- [x] Tabs para descripción/reviews
- [x] Productos relacionados
- [x] Carrito floating

### Galería de Imágenes

```html
<div class="product-gallery">
  <div class="product-gallery__main">
    <img
      src="product-1.jpg"
      alt="Producto"
      class="product-gallery__image" />
    <div class="product-gallery__zoom-lens"></div>
    <div class="product-gallery__zoom-result"></div>
  </div>
  <div class="product-gallery__thumbnails">
    <img
      src="thumb-1.jpg"
      alt="Vista 1"
      class="product-gallery__thumb product-gallery__thumb--active" />
    <img
      src="thumb-2.jpg"
      alt="Vista 2"
      class="product-gallery__thumb" />
    <img
      src="thumb-3.jpg"
      alt="Vista 3"
      class="product-gallery__thumb" />
  </div>
</div>
```

### Selector de Variantes

```css
.variant-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.variant-option {
  width: 40px;
  height: 40px;
  border: 2px solid #ddd;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
}

.variant-option--color-red {
  background: #ff4444;
}

.variant-option--color-blue {
  background: #4444ff;
}

.variant-option:hover,
.variant-option--selected {
  border-color: #333;
  transform: scale(1.1);
}
```

### Desafío Extra

- Implementar un sistema de reviews con estrellas
- Añadir wishlist functionality
- Crear un sistema de recomendaciones

---

## 🎯 Criterios de Evaluación

### Funcionalidad (40%)

- [x] Todos los componentes funcionan correctamente
- [x] Responsive design implementado
- [x] Navegación fluida
- [x] Interactividad apropiada

### Diseño (30%)

- [x] Uso apropiado de colores y tipografía
- [x] Espaciado y proporciones correctas
- [x] Consistencia visual
- [x] Atractivo estético

### Código (30%)

- [x] HTML semántico
- [x] CSS bien estructurado
- [x] Metodología BEM aplicada
- [x] Código comentado y limpio

---

## 🚀 Bonus Challenges

### Challenge 1: Dark Mode Toggle

Implementar un sistema de tema oscuro/claro con:

- Toggle switch animado
- Persistencia en localStorage
- Transiciones suaves
- Paleta de colores coherente

### Challenge 2: CSS Art

Crear una ilustración completa usando solo CSS:

- Formas geométricas
- Gradientes complejos
- Animaciones
- Efectos visuales

### Challenge 3: Loading States

Diseñar diferentes tipos de loading:

- Skeleton screens
- Progress bars
- Spinners creativos
- Micro-interactions

### Challenge 4: Error States

Crear páginas de error creativas:

- 404 page
- Error de conexión
- Formularios con errores
- Estados vacíos

---

## 📝 Entrega

### Estructura de Carpetas

```
reto-css-avanzado/
├── index.html
├── css/
│   ├── main.css
│   ├── components/
│   │   ├── navbar.css
│   │   ├── cards.css
│   │   └── forms.css
│   └── layouts/
│       ├── grid.css
│       └── responsive.css
├── js/
│   └── main.js
├── assets/
│   ├── images/
│   └── icons/
└── README.md
```

### Checklist Final

- [ ] Código validado (HTML/CSS)
- [ ] Accesibilidad básica implementada
- [ ] Responsive en todos los breakpoints
- [ ] Animaciones suaves y purposeful
- [ ] Documentación clara
- [ ] Browser testing realizado

¡Recuerda que la práctica y la experimentación son clave para dominar CSS avanzado!
