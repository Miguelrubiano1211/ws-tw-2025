# 📊 Dashboard Responsive

## 🎯 Objetivo

Crear un dashboard administrativo completo y responsive usando CSS Grid y Flexbox, aplicando todas las técnicas aprendidas en el Día 2.

## 📋 Requisitos

### Funcionalidades Principales

- [x] Layout responsive con sidebar y main content
- [x] Grid de widgets/cards con información
- [x] Gráficos simulados con CSS
- [x] Navegación lateral colapsable
- [x] Header con user profile y notificaciones
- [x] Footer con información adicional
- [x] Tema claro/oscuro

### Tecnologías Utilizadas

- **CSS Grid**: Layout principal y grid de widgets
- **Flexbox**: Navegación, header, cards internas
- **Variables CSS**: Sistema de colores y espaciado
- **Media Queries**: Responsive design mobile-first
- **Animations**: Transiciones y micro-interactions

## 🎨 Diseño

### Layout Principal

```
┌─────────────────────────────────────────────────┐
│                   HEADER                        │
├─────────────┬───────────────────────────────────┤
│             │                                   │
│   SIDEBAR   │           MAIN CONTENT           │
│             │                                   │
├─────────────┼───────────────────────────────────┤
│             │              FOOTER               │
└─────────────┴───────────────────────────────────┘
```

### Responsive Behavior

- **Desktop (1024px+)**: Sidebar visible, grid 4 columnas
- **Tablet (768px-1023px)**: Sidebar colapsable, grid 2 columnas
- **Mobile (320px-767px)**: Sidebar overlay, grid 1 columna

## 🏗️ Estructura de Archivos

```
dashboard/
├── index.html          # Página principal
├── styles.css          # Estilos principales
├── script.js           # Funcionalidad JavaScript
├── README.md           # Esta documentación
└── assets/
    ├── icons/          # Iconos SVG
    └── images/         # Imágenes del dashboard
```

## 📱 Características Responsive

### Breakpoints

- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

### Adaptaciones por Dispositivo

- Sidebar colapsable en tablet/móvil
- Grid adaptativo de widgets
- Tipografía escalable
- Navegación touch-friendly

## 🎯 Criterios de Evaluación

### Técnico (70%)

- Layout Grid correcto: 25%
- Responsive design funcional: 25%
- Código limpio y organizado: 20%

### Diseño (20%)

- Usabilidad: 15%
- Estética: 5%

### Documentación (10%)

- README completo: 5%
- Comentarios en código: 5%

## 🚀 Instrucciones de Uso

### Instalación

1. Clona o descarga los archivos
2. Abre `index.html` en tu navegador
3. O usa Live Server para desarrollo

### Desarrollo

1. Modifica `styles.css` para cambiar estilos
2. Edita `script.js` para nueva funcionalidad
3. Actualiza `index.html` para más contenido

## 🛠️ Personalización

### Colores

Modifica las variables CSS en `:root`:

```css
:root {
  --primary-color: #3498db;
  --secondary-color: #2c3e50;
  /* ... más colores */
}
```

### Layout

Ajusta el grid principal:

```css
.dashboard-grid {
  grid-template-columns: 250px 1fr;
  grid-template-rows: auto 1fr auto;
}
```

## 📈 Funcionalidades Implementadas

### ✅ Completadas

- Layout responsive con Grid
- Sidebar colapsable
- Grid de widgets adaptativos
- Tema claro/oscuro
- Animaciones suaves
- Performance optimizada

### 🔄 En Progreso

- Gráficos interactivos
- Filtros de datos
- Notificaciones en tiempo real

### 📋 Por Implementar

- Exportar datos
- Configuración avanzada
- Modo offline

## 🎯 Tips de Desarrollo

### CSS Grid

- Usa `grid-template-areas` para layouts claros
- Implementa `auto-fit` para widgets adaptativos
- Aprovecha `gap` para espaciado consistente

### Flexbox

- Úsalo para alineación dentro de componentes
- Perfecto para navigation bars
- Ideal para distribuir espacio disponible

### Performance

- Usa `will-change` para animaciones
- Minimiza reflow/repaint
- Optimiza selectores CSS

## 🚨 Problemas Comunes

### Grid Issues

- **Problema**: Elementos que no se alinean
- **Solución**: Verificar `grid-template-areas`

### Responsive Issues

- **Problema**: Layout quebrado en móvil
- **Solución**: Revisar media queries y grid

### Performance Issues

- **Problema**: Animaciones lentas
- **Solución**: Usar `transform` en lugar de `top/left`

## 📚 Recursos Utilizados

- [CSS Grid Layout - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
- [Flexbox Guide - CSS-Tricks](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [Dashboard Design Inspiration](https://dribbble.com/tags/dashboard)

---

**Tiempo estimado**: 45 minutos  
**Dificultad**: Intermedia  
**Prerrequisitos**: Conocimientos de Grid y Flexbox
