# 03. CSS Grid Layout Mastery

**⏰ Tiempo:** 13:00-13:30 (30 minutos)  
**🎯 Objetivo:** Dominar CSS Grid para layouts complejos en competencia WorldSkills  
**🚀 Enfoque MVP:** Grid básico → Areas nombradas → Layouts complejos

## 🎯 Implementación MVP

### **FASE CORE ✅ (18 minutos) - Grid Básico Funcional**

#### **1. Grid Container y Propiedades Fundamentales (8 minutos)**

```css
/* Grid básico - Layout de página principal */
.layout-principal {
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
  gap: 1rem;
}

/* Grid items básicos */
.header {
  grid-column: 1 / -1; /* Ocupa toda la fila */
  background: var(--color-primario);
  padding: 1rem;
}

.sidebar {
  grid-column: 1;
  background: var(--color-gris-claro);
  padding: 1rem;
}

.contenido-principal {
  grid-column: 2;
  padding: 1rem;
}

.aside {
  grid-column: 3;
  background: var(--color-gris-claro);
  padding: 1rem;
}

.footer {
  grid-column: 1 / -1;
  background: var(--color-gris-oscuro);
  color: var(--color-blanco);
  padding: 1rem;
}

/* Grid para cards de servicios */
.grid-servicios {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.servicio-card {
  background: var(--color-blanco);
  border-radius: var(--radio-md);
  padding: 1.5rem;
  box-shadow: var(--sombra-md);
  border: 1px solid var(--color-gris-claro);
}

/* Grid para galería de imágenes */
.grid-galeria {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-auto-rows: 200px;
  gap: 1rem;
}

.imagen-item {
  background: var(--color-gris-claro);
  border-radius: var(--radio-sm);
  overflow: hidden;
  position: relative;
}

.imagen-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

#### **2. Grid Areas y Layout Específicos (10 minutos)**

```css
/* Layout con areas nombradas - más semántico y mantenible */
.layout-empresa {
  display: grid;
  grid-template-areas:
    "header header header"
    "nav contenido sidebar"
    "footer footer footer";
  grid-template-columns: 200px 1fr 250px;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
  gap: 1rem;
  padding: 1rem;
}

.header { grid-area: header; }
.navegacion { grid-area: nav; }
.contenido { grid-area: contenido; }
.sidebar { grid-area: sidebar; }
.footer { grid-area: footer; }

/* Layout dashboard - grid anidado */
.dashboard {
  display: grid;
  grid-template-areas:
    "stats stats stats"
    "grafico tabla recent"
    "activities activities activities";
  grid-template-columns: 2fr 2fr 1fr;
  grid-template-rows: auto 300px auto;
  gap: 1rem;
  padding: 1rem;
}

.estadisticas { 
  grid-area: stats;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.stat-card {
  background: var(--color-blanco);
  padding: 1.5rem;
  border-radius: var(--radio-md);
  box-shadow: var(--sombra-sm);
  text-align: center;
}

.grafico { grid-area: grafico; }
.tabla { grid-area: tabla; }
.actividades-recientes { grid-area: recent; }
.lista-actividades { grid-area: activities; }

/* Grid para productos - masonry effect */
.grid-productos {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  grid-auto-rows: auto;
  gap: 1.5rem;
  align-items: start; /* Evita que se estiren */
}

.producto-card {
  background: var(--color-blanco);
  border-radius: var(--radio-md);
  overflow: hidden;
  box-shadow: var(--sombra-md);
  transition: transform 0.3s ease;
}

.producto-card:hover {
  transform: translateY(-5px);
}

.producto-imagen {
  aspect-ratio: 16/9;
  overflow: hidden;
}

.producto-contenido {
  padding: 1.5rem;
}
```

### **FASE ENHANCED ⚡ (8 minutos) - Grid Responsive y Avanzado**

#### **3. Responsive Grid y Media Queries (8 minutos)**

```css
/* Grid responsive - mobile first */
.layout-responsive {
  display: grid;
  gap: 1rem;
  padding: 1rem;
}

/* Mobile - diseño en columna */
@media (max-width: 767px) {
  .layout-responsive {
    grid-template-areas:
      "header"
      "nav"
      "contenido"
      "sidebar"
      "footer";
    grid-template-columns: 1fr;
  }
  
  .navegacion ul {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }
  
  .grid-servicios {
    grid-template-columns: 1fr;
  }
  
  .estadisticas {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Tablet - layout intermedio */
@media (min-width: 768px) and (max-width: 1023px) {
  .layout-responsive {
    grid-template-areas:
      "header header"
      "nav contenido"
      "sidebar sidebar"
      "footer footer";
    grid-template-columns: 200px 1fr;
  }
  
  .grid-servicios {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .estadisticas {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop - layout completo */
@media (min-width: 1024px) {
  .layout-responsive {
    grid-template-areas:
      "header header header"
      "nav contenido sidebar"
      "footer footer footer";
    grid-template-columns: 200px 1fr 250px;
  }
  
  .grid-servicios {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .estadisticas {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Grid con subgrid (CSS moderno) */
.articulo-principal {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1rem;
}

.articulo-contenido {
  grid-column: 1 / 9;
  display: grid;
  grid-template-rows: subgrid;
  gap: inherit;
}

.articulo-sidebar {
  grid-column: 9 / -1;
}

/* Grid con auto-placement inteligente */
.grid-masonry {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-auto-rows: 10px; /* Filas pequeñas para simular masonry */
  gap: 1rem;
}

.masonry-item {
  grid-row: span var(--row-span, 20); /* Variable CSS para altura */
  background: var(--color-blanco);
  border-radius: var(--radio-md);
  padding: 1rem;
  box-shadow: var(--sombra-sm);
}

/* Diferentes alturas para efecto masonry */
.masonry-item.pequeño { --row-span: 15; }
.masonry-item.mediano { --row-span: 25; }
.masonry-item.grande { --row-span: 35; }
```

### **FASE POLISH ✨ (4 minutos) - Grid Animations y Optimización**

#### **4. Animaciones Grid y Performance (4 minutos)**

```css
/* Animaciones para grid items */
.grid-animado {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.grid-item {
  background: var(--color-blanco);
  border-radius: var(--radio-md);
  padding: 1rem;
  transition: all 0.3s ease;
  transform-origin: center;
}

/* Hover effects */
.grid-item:hover {
  transform: scale(1.05);
  box-shadow: var(--sombra-lg);
  z-index: 1;
}

/* Entrada escalonada */
.grid-item {
  animation: fadeInUp 0.6s ease forwards;
  opacity: 0;
}

.grid-item:nth-child(1) { animation-delay: 0.1s; }
.grid-item:nth-child(2) { animation-delay: 0.2s; }
.grid-item:nth-child(3) { animation-delay: 0.3s; }
.grid-item:nth-child(4) { animation-delay: 0.4s; }
.grid-item:nth-child(5) { animation-delay: 0.5s; }
.grid-item:nth-child(6) { animation-delay: 0.6s; }

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Grid con loading states */
.grid-loading {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.skeleton-item {
  background: linear-gradient(
    90deg,
    var(--color-gris-claro) 25%,
    var(--color-gris) 50%,
    var(--color-gris-claro) 75%
  );
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: var(--radio-md);
  height: 200px;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Grid responsivo con container queries (CSS moderno) */
@container (min-width: 400px) {
  .grid-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@container (min-width: 600px) {
  .grid-container {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Optimización para performance */
.grid-optimizado {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  contain: layout style paint; /* CSS Containment */
}

.grid-item-optimizado {
  will-change: transform; /* Solo en hover */
  backface-visibility: hidden;
  transform: translateZ(0); /* Force hardware acceleration */
}

.grid-item-optimizado:hover {
  will-change: auto; /* Remove after animation */
}
```

## 📋 Patrones Grid Comunes WorldSkills

### **1. Layout de Dashboard Empresarial**
```css
.dashboard-layout {
  display: grid;
  grid-template-areas:
    "header header header header"
    "sidebar main main aside"
    "footer footer footer footer";
  grid-template-columns: 250px 2fr 1fr 250px;
  grid-template-rows: 60px 1fr 40px;
  height: 100vh;
}
```

### **2. Grid de Productos E-commerce**
```css
.productos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
}
```

### **3. Layout de Blog/Noticias**
```css
.blog-layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  grid-template-rows: auto 1fr;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}
```

## 🎯 Ejercicio Práctico (Últimos 5 minutos)

**Crear un layout de empresa tecnológica con Grid:**

1. **Header** que ocupe toda la anchura
2. **Sidebar** para navegación (200px)
3. **Área principal** para contenido
4. **Aside** para información adicional (250px)  
5. **Footer** que ocupe toda la anchura
6. **Grid de servicios** responsive (3 columnas desktop, 2 tablet, 1 móvil)

**Aplicar metodología MVP:**
- **Core:** Layout básico con grid areas
- **Enhanced:** Responsive breakpoints
- **Polish:** Hover effects y transiciones

## 📝 Recursos Grid

- [CSS Grid Generator](https://cssgrid-generator.netlify.app/)
- [Grid by Example](https://gridbyexample.com/)
- [MDN CSS Grid](https://developer.mozilla.org/es/docs/Web/CSS/CSS_Grid_Layout)

## ✅ Checklist Verificación

- [ ] Grid container con areas nombradas
- [ ] Grid responsive con media queries
- [ ] Grid anidado para componentes
- [ ] Auto-fit y auto-fill implementados
- [ ] Gap y alineación correctos

**¡CSS Grid dominado! Siguiente: Flexbox Advanced Patterns 🚀**
