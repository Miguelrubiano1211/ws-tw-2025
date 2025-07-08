# 🍽️ Proyecto Final - Sitio Web Restaurante "Sabores del Mundo"

## 📋 Descripción del Proyecto

Este es el proyecto final del **Día 1** del Bootcamp WorldSkills Tecnologías Web. El objetivo es crear un sitio web completo para un restaurante que integre todos los conceptos aprendidos durante el día.

## 🎯 Objetivos de Aprendizaje

- ✅ Aplicar HTML5 semántico en múltiples páginas
- ✅ Implementar CSS3 moderno con Grid y Flexbox
- ✅ Crear formularios accesibles con validaciones
- ✅ Aplicar principios de accesibilidad WCAG 2.1
- ✅ Desarrollar funcionalidades con JavaScript ES6+
- ✅ Implementar diseño responsive
- ✅ Utilizar Git con conventional commits

## 📁 Estructura del Proyecto

```
restaurante-sabores-mundo/
├── index.html              # Página principal
├── menu.html               # Carta del restaurante
├── reservas.html           # Sistema de reservas
├── contacto.html           # Información de contacto
├── css/
│   ├── styles.css          # Estilos principales
│   └── responsive.css      # Estilos responsive
├── js/
│   ├── main.js             # JavaScript principal
│   └── reservas.js         # Funcionalidad de reservas
├── images/
│   ├── logo.png            # Logo del restaurante
│   ├── hero-bg.jpg         # Imagen de fondo
│   └── platos/             # Imágenes de platos
├── docs/
│   ├── README.md           # Documentación
│   └── DEPLOY.md           # Guía de despliegue
└── .gitignore              # Archivos a ignorar
```

## 🍴 Información del Restaurante

**Nombre:** Sabores del Mundo  
**Concepto:** Restaurante de cocina internacional  
**Ubicación:** Bogotá, Colombia  
**Especialidad:** Fusión de sabores internacionales  
**Horario:** Lunes a Domingo, 12:00 PM - 10:00 PM

## 📄 Páginas Requeridas

### 1. **Página Principal (index.html)**

- Hero section con imagen de fondo
- Información sobre el restaurante
- Platos destacados
- Testimonios de clientes
- Call-to-action para reservas

### 2. **Menú (menu.html)**

- Categorías de platos (Entradas, Platos principales, Postres, Bebidas)
- Galería de imágenes de platos
- Precios y descripciones
- Filtros por categoría
- Información nutricional

### 3. **Reservas (reservas.html)**

- Formulario de reserva completo
- Validaciones HTML5 y JavaScript
- Calendario de disponibilidad
- Confirmación de reserva
- Información de políticas

### 4. **Contacto (contacto.html)**

- Información de contacto
- Formulario de contacto
- Mapa de ubicación
- Horarios de atención
- Redes sociales

## 🛠️ Requisitos Técnicos

### HTML5 Semántico

- [ ] Uso correcto de elementos semánticos
- [ ] Estructura jerárquica de headings
- [ ] Atributos de accesibilidad (ARIA)
- [ ] Meta tags optimizados para SEO
- [ ] Formularios con validaciones nativas

### CSS3 Moderno

- [ ] Variables CSS personalizadas
- [ ] CSS Grid para layouts principales
- [ ] Flexbox para componentes
- [ ] Responsive design mobile-first
- [ ] Animaciones y transiciones

### JavaScript ES6+

- [ ] Funcionalidades interactivas
- [ ] Validación de formularios
- [ ] Navegación suave
- [ ] Galería de imágenes
- [ ] Menú responsive

### Accesibilidad

- [ ] Cumplimiento WCAG 2.1 AA
- [ ] Navegación por teclado
- [ ] Lectores de pantalla
- [ ] Contraste de colores adecuado
- [ ] Skip links y landmarks

### Performance

- [ ] Optimización de imágenes
- [ ] CSS y JS minificados
- [ ] Lazy loading de imágenes
- [ ] Tiempo de carga < 3 segundos
- [ ] Lighthouse score > 90

## 🎨 Paleta de Colores

```css
:root {
  --primary-color: #d4682a; /* Naranja cálido */
  --secondary-color: #8b4513; /* Marrón chocolate */
  --accent-color: #ffd700; /* Dorado */
  --text-dark: #2c3e50; /* Azul oscuro */
  --text-light: #7f8c8d; /* Gris claro */
  --background: #f8f9fa; /* Fondo claro */
  --white: #ffffff; /* Blanco */
  --success: #27ae60; /* Verde éxito */
  --warning: #f39c12; /* Amarillo advertencia */
  --error: #e74c3c; /* Rojo error */
}
```

## 📱 Breakpoints Responsive

```css
/* Mobile First */
/* Base styles: 0px - 576px */

/* Small tablets */
@media (min-width: 576px) {
  ...;
}

/* Tablets */
@media (min-width: 768px) {
  ...;
}

/* Desktop */
@media (min-width: 992px) {
  ...;
}

/* Large desktop */
@media (min-width: 1200px) {
  ...;
}
```

## 🍽️ Contenido del Menú

### Entradas

- Bruschetta italiana - $8.000
- Ceviche peruano - $12.000
- Gyozas japonesas - $10.000
- Hummus árabe - $7.000

### Platos Principales

- Paella valenciana - $25.000
- Curry thai - $18.000
- Risotto de champiñones - $20.000
- Tacos mexicanos - $15.000

### Postres

- Tiramisú - $8.000
- Cheesecake de frutos rojos - $7.000
- Flan de coco - $6.000
- Helado artesanal - $5.000

### Bebidas

- Café colombiano - $3.000
- Té chai - $4.000
- Jugo natural - $5.000
- Agua con gas - $2.000

## 📝 Formulario de Reserva

### Campos Requeridos

- [ ] Nombre completo
- [ ] Teléfono
- [ ] Email
- [ ] Fecha de reserva
- [ ] Hora de reserva
- [ ] Número de personas
- [ ] Ocasión especial (opcional)
- [ ] Comentarios especiales (opcional)

### Validaciones

- [ ] Fecha no puede ser en el pasado
- [ ] Hora dentro del horario de atención
- [ ] Número de personas entre 1 y 12
- [ ] Formato de email válido
- [ ] Teléfono con formato correcto

## 🔧 Funcionalidades JavaScript

### Navegación

- [ ] Menú hamburguesa responsive
- [ ] Smooth scrolling
- [ ] Highlight de sección activa
- [ ] Sticky navigation

### Galería

- [ ] Lightbox para imágenes
- [ ] Filtros por categoría
- [ ] Lazy loading
- [ ] Responsive images

### Formularios

- [ ] Validación en tiempo real
- [ ] Mensaje de confirmación
- [ ] Cálculo automático (si aplica)
- [ ] Envío por email (simulado)

### Interactividad

- [ ] Animaciones on scroll
- [ ] Tooltips informativos
- [ ] Modales para información
- [ ] Contador de visitas

## 🌟 Características Adicionales

### SEO

- [ ] Meta tags optimizados
- [ ] Structured data (Schema.org)
- [ ] Sitemap.xml
- [ ] Robots.txt

### Accesibilidad

- [ ] Skip links
- [ ] Focus management
- [ ] Color contrast AA
- [ ] Screen reader support

### Performance

- [ ] Image optimization
- [ ] Code minification
- [ ] Caching strategies
- [ ] CDN setup (opcional)

## 📋 Lista de Verificación Final

### Desarrollo

- [ ] Código HTML válido (W3C)
- [ ] CSS válido (W3C)
- [ ] JavaScript sin errores
- [ ] Responsive en todos los dispositivos
- [ ] Funcionalidades probadas

### Contenido

- [ ] Textos revisados (ortografía)
- [ ] Imágenes optimizadas
- [ ] Enlaces funcionando
- [ ] Formularios operativos
- [ ] Información actualizada

### Accesibilidad

- [ ] Test con axe DevTools
- [ ] Navegación por teclado
- [ ] Test con screen reader
- [ ] Contraste verificado
- [ ] ARIA labels correctos

### Performance

- [ ] Lighthouse audit > 90
- [ ] Tiempo de carga < 3s
- [ ] Optimización móvil
- [ ] Imágenes comprimidas
- [ ] Código minificado

## 📊 Métricas de Éxito

### Lighthouse Scores (Objetivos)

- **Performance:** 90+
- **Accessibility:** 100
- **Best Practices:** 95+
- **SEO:** 100

### Métricas de Carga

- **First Contentful Paint:** < 1.5s
- **Speed Index:** < 2.5s
- **Largest Contentful Paint:** < 2.5s
- **Time to Interactive:** < 3.5s

## 🚀 Despliegue

### Pasos para Deployment

1. Validar todo el código
2. Optimizar imágenes
3. Minificar CSS/JS
4. Configurar GitHub Pages
5. Probar en producción

### URLs de Producción

- **Sitio principal:** https://[usuario].github.io/restaurante-sabores-mundo/
- **Repositorio:** https://github.com/[usuario]/restaurante-sabores-mundo

## 📚 Recursos Utilizados

### Imágenes

- [Unsplash](https://unsplash.com/) - Imágenes gratuitas
- [Pexels](https://www.pexels.com/) - Fotografías de comida
- [Flaticon](https://www.flaticon.com/) - Iconos

### Fuentes

- [Google Fonts](https://fonts.google.com/) - Tipografías
- [Font Awesome](https://fontawesome.com/) - Iconos

### Herramientas

- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Auditoría
- [axe DevTools](https://www.deque.com/axe/devtools/) - Accesibilidad
- [W3C Validator](https://validator.w3.org/) - Validación HTML

## 🎯 Entregables

1. **Código fuente completo** en repositorio GitHub
2. **Documentación** (README.md detallado)
3. **Sitio desplegado** en GitHub Pages
4. **Reporte de métricas** (Lighthouse, axe)
5. **Presentación** (5 minutos en clase)

## 🏆 Criterios de Evaluación

| Criterio              | Peso | Descripción                          |
| --------------------- | ---- | ------------------------------------ |
| **HTML Semántico**    | 25%  | Uso correcto de elementos semánticos |
| **CSS Moderno**       | 25%  | Grid, Flexbox, responsive design     |
| **JavaScript**        | 20%  | Funcionalidades interactivas         |
| **Accesibilidad**     | 20%  | Cumplimiento WCAG 2.1                |
| **Git/Documentación** | 10%  | Commits y README                     |

## 🎉 ¡Manos a la Obra!

Este proyecto integra todo lo aprendido en el Día 1 del bootcamp. Es tu oportunidad de demostrar dominio de:

- HTML5 semántico
- CSS3 moderno
- JavaScript ES6+
- Accesibilidad web
- Git workflow
- Documentación técnica

**Tiempo estimado:** 4-5 horas  
**Fecha límite:** Final del Día 1  
**Presentación:** 5 minutos por estudiante

¡Que disfrutes creando tu primer proyecto completo del bootcamp! 🚀✨
