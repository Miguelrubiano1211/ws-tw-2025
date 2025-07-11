# 🎯 MVP PRÁCTICA: Layout Complejo Responsive

**⏰ Tiempo Total:** 15:30-16:00 (30 minutos)  
**🎯 Objetivo:** Aplicar toda la teoría del día en un proyecto real con metodología MVP  
**🚀 Proyecto:** Website corporativo para empresa tecnológica

## ⏱️ Timeboxing MVP

- **Phase 1 CORE (20 minutos):** Layout funcional básico
- **Phase 2 ENHANCED (10 minutos):** Responsive + mejoras UX  
- **Phase 3 POLISH (5 minutos):** Microinteracciones + optimización

---

## 🔧 FASE CORE ✅ (20 minutos) - Layout Funcional Básico

### **Meta:** Tener una página web funcional y navegable

### **Estructura HTML (5 minutos)**

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TechSolutions - Innovación Digital</title>
    <link rel="stylesheet" href="css/reset.css">
    <link rel="stylesheet" href="css/variables.css">
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <!-- Layout principal con Grid Areas -->
    <div class="layout-principal">
        <header class="header">
            <div class="container">
                <div class="logo">
                    <h1>TechSolutions</h1>
                </div>
                <nav class="nav-principal">
                    <ul>
                        <li><a href="#inicio">Inicio</a></li>
                        <li><a href="#servicios">Servicios</a></li>
                        <li><a href="#proyectos">Proyectos</a></li>
                        <li><a href="#contacto">Contacto</a></li>
                    </ul>
                </nav>
            </div>
        </header>

        <main class="contenido-principal">
            <!-- Hero Section -->
            <section class="hero" id="inicio">
                <div class="container">
                    <h2>Transformamos Ideas en Soluciones Digitales</h2>
                    <p>Desarrollamos aplicaciones web y móviles que impulsan el crecimiento de tu negocio</p>
                    <a href="#contacto" class="btn btn-primario">Comenzar Proyecto</a>
                </div>
            </section>

            <!-- Servicios Grid -->
            <section class="servicios" id="servicios">
                <div class="container">
                    <h2>Nuestros Servicios</h2>
                    <div class="grid-servicios">
                        <div class="servicio-card">
                            <h3>Desarrollo Web</h3>
                            <p>Sitios web modernos y responsive con las últimas tecnologías</p>
                        </div>
                        <div class="servicio-card">
                            <h3>Apps Móviles</h3>
                            <p>Aplicaciones nativas y híbridas para iOS y Android</p>
                        </div>
                        <div class="servicio-card">
                            <h3>E-commerce</h3>
                            <p>Tiendas online optimizadas para conversión y ventas</p>
                        </div>
                        <div class="servicio-card">
                            <h3>Consultoría Tech</h3>
                            <p>Asesoría especializada en transformación digital</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Proyectos Section -->
            <section class="proyectos" id="proyectos">
                <div class="container">
                    <h2>Proyectos Destacados</h2>
                    <div class="grid-proyectos">
                        <article class="proyecto-card">
                            <div class="proyecto-imagen">
                                <div class="placeholder-imagen">Imagen del Proyecto</div>
                            </div>
                            <div class="proyecto-contenido">
                                <h3>Sistema de Gestión</h3>
                                <p>Plataforma completa para gestión empresarial</p>
                                <a href="#" class="btn btn-secundario">Ver Proyecto</a>
                            </div>
                        </article>
                        <article class="proyecto-card">
                            <div class="proyecto-imagen">
                                <div class="placeholder-imagen">Imagen del Proyecto</div>
                            </div>
                            <div class="proyecto-contenido">
                                <h3>App de Delivery</h3>
                                <p>Aplicación móvil para delivery de comida</p>
                                <a href="#" class="btn btn-secundario">Ver Proyecto</a>
                            </div>
                        </article>
                    </div>
                </div>
            </section>
        </main>

        <aside class="sidebar">
            <div class="widget">
                <h3>Últimas Noticias</h3>
                <ul>
                    <li><a href="#">Nueva versión de React lanzada</a></li>
                    <li><a href="#">Tendencias en desarrollo móvil</a></li>
                    <li><a href="#">WorldSkills 2025 se acerca</a></li>
                </ul>
            </div>
        </aside>

        <footer class="footer" id="contacto">
            <div class="container">
                <div class="footer-contenido">
                    <div class="footer-info">
                        <h3>TechSolutions</h3>
                        <p>Innovación digital para empresas modernas</p>
                    </div>
                    <div class="footer-contacto">
                        <h4>Contacto</h4>
                        <p>Email: info@techsolutions.com</p>
                        <p>Teléfono: +57 (1) 234-5678</p>
                    </div>
                </div>
            </div>
        </footer>
    </div>
</body>
</html>
```

### **CSS Core Layout (15 minutos)**

```css
/* Variables base ya definidas en variables.css */

/* Layout principal con Grid Areas */
.layout-principal {
    display: grid;
    grid-template-areas:
        "header header"
        "contenido sidebar"
        "footer footer";
    grid-template-columns: 1fr 300px;
    grid-template-rows: auto 1fr auto;
    min-height: 100vh;
    gap: 0;
}

.header { 
    grid-area: header; 
    background: var(--color-primario);
    color: var(--color-blanco);
    padding: 1rem 0;
}

.contenido-principal { 
    grid-area: contenido; 
    padding: 2rem 0;
}

.sidebar { 
    grid-area: sidebar; 
    background: var(--color-gris-claro);
    padding: 2rem 1rem;
}

.footer { 
    grid-area: footer; 
    background: var(--color-gris-oscuro);
    color: var(--color-blanco);
    padding: 2rem 0;
}

/* Container y utilidades */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
}

/* Header y navegación */
.header .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.nav-principal ul {
    display: flex;
    list-style: none;
    gap: 2rem;
}

.nav-principal a {
    color: var(--color-blanco);
    text-decoration: none;
    font-weight: 500;
}

/* Hero section */
.hero {
    background: linear-gradient(135deg, var(--color-primario), var(--color-secundario));
    color: var(--color-blanco);
    padding: 4rem 0;
    text-align: center;
}

.hero h2 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
}

.hero p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
}

/* Botones */
.btn {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    border-radius: var(--radio-md);
    text-decoration: none;
    font-weight: 600;
    text-align: center;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
}

.btn-primario {
    background: var(--color-blanco);
    color: var(--color-primario);
}

.btn-secundario {
    background: var(--color-primario);
    color: var(--color-blanco);
}

/* Grid de servicios */
.servicios {
    padding: 4rem 0;
}

.grid-servicios {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    margin-top: 2rem;
}

.servicio-card {
    background: var(--color-blanco);
    padding: 2rem;
    border-radius: var(--radio-md);
    box-shadow: var(--sombra-md);
    text-align: center;
}

.servicio-card h3 {
    color: var(--color-primario);
    margin-bottom: 1rem;
}

/* Grid de proyectos */
.proyectos {
    padding: 4rem 0;
    background: var(--color-gris-claro);
}

.grid-proyectos {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    margin-top: 2rem;
}

.proyecto-card {
    background: var(--color-blanco);
    border-radius: var(--radio-md);
    overflow: hidden;
    box-shadow: var(--sombra-md);
}

.placeholder-imagen {
    background: var(--color-gris);
    color: var(--color-blanco);
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
}

.proyecto-contenido {
    padding: 1.5rem;
}

.proyecto-contenido h3 {
    margin-bottom: 0.5rem;
    color: var(--color-primario);
}

.proyecto-contenido p {
    margin-bottom: 1rem;
}

/* Sidebar */
.widget {
    background: var(--color-blanco);
    padding: 1.5rem;
    border-radius: var(--radio-md);
    box-shadow: var(--sombra-sm);
}

.widget h3 {
    margin-bottom: 1rem;
    color: var(--color-primario);
}

.widget ul {
    list-style: none;
}

.widget li {
    margin-bottom: 0.5rem;
}

.widget a {
    color: var(--color-gris-oscuro);
    text-decoration: none;
}

/* Footer */
.footer-contenido {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 2rem;
}

.footer h3, .footer h4 {
    margin-bottom: 0.5rem;
}
```

### **✅ Verificación CORE (1 minuto)**
- [ ] Layout Grid funcional con áreas nombradas
- [ ] Header con navegación horizontal
- [ ] Sección hero con call-to-action
- [ ] Grid de servicios (2x2)
- [ ] Grid de proyectos funcional
- [ ] Sidebar con widget
- [ ] Footer con información básica

---

## ⚡ FASE ENHANCED (10 minutos) - Responsive + Mejoras UX

### **Meta:** Layout totalmente responsive y mejoradas de UX

### **CSS Responsive (8 minutos)**

```css
/* Responsive Design - Mobile First */

/* Tablet - 768px y abajo */
@media (max-width: 768px) {
    .layout-principal {
        grid-template-areas:
            "header"
            "contenido"
            "sidebar"
            "footer";
        grid-template-columns: 1fr;
    }
    
    .header .container {
        flex-direction: column;
        gap: 1rem;
    }
    
    .nav-principal ul {
        flex-direction: column;
        text-align: center;
        gap: 1rem;
    }
    
    .hero h2 {
        font-size: 2rem;
    }
    
    .grid-servicios {
        grid-template-columns: 1fr;
    }
    
    .grid-proyectos {
        grid-template-columns: 1fr;
    }
    
    .footer-contenido {
        grid-template-columns: 1fr;
        text-align: center;
    }
}

/* Desktop grande - 1200px y arriba */
@media (min-width: 1200px) {
    .grid-servicios {
        grid-template-columns: repeat(4, 1fr);
    }
    
    .layout-principal {
        grid-template-columns: 1fr 350px;
    }
}

/* Hover effects para desktop */
@media (hover: hover) {
    .btn:hover {
        transform: translateY(-2px);
        box-shadow: var(--sombra-lg);
    }
    
    .servicio-card:hover,
    .proyecto-card:hover {
        transform: translateY(-5px);
        box-shadow: var(--sombra-lg);
    }
    
    .nav-principal a:hover {
        text-decoration: underline;
    }
}
```

### **Mejoras UX (2 minutos)**

```css
/* Smooth scroll */
html {
    scroll-behavior: smooth;
}

/* Focus states para accesibilidad */
.btn:focus,
.nav-principal a:focus {
    outline: 2px solid var(--color-advertencia);
    outline-offset: 2px;
}

/* Loading state para imágenes */
.placeholder-imagen {
    position: relative;
    overflow: hidden;
}

.placeholder-imagen::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.4),
        transparent
    );
    animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
    to {
        left: 100%;
    }
}
```

### **✅ Verificación ENHANCED (1 minuto)**
- [ ] Layout responsive en 3 breakpoints
- [ ] Navegación mobile-friendly
- [ ] Hover effects funcionando
- [ ] Focus states para accesibilidad
- [ ] Animaciones suaves

---

## ✨ FASE POLISH (5 minutos) - Microinteracciones + Optimización

### **Meta:** Detalles finales que marcan la diferencia

### **Microinteracciones (3 minutos)**

```css
/* Entrada escalonada de servicios */
.servicio-card {
    animation: fadeInUp 0.6s ease forwards;
    opacity: 0;
}

.servicio-card:nth-child(1) { animation-delay: 0.1s; }
.servicio-card:nth-child(2) { animation-delay: 0.2s; }
.servicio-card:nth-child(3) { animation-delay: 0.3s; }
.servicio-card:nth-child(4) { animation-delay: 0.4s; }

/* Efecto paralaje sutil en hero */
.hero {
    background-attachment: fixed;
    position: relative;
}

/* Indicador de scroll */
.scroll-indicator {
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: var(--color-advertencia);
    z-index: 1000;
    transition: width 0.1s ease;
}

/* Botón scroll to top */
.scroll-top {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    background: var(--color-primario);
    color: var(--color-blanco);
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    cursor: pointer;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.3s ease;
}

.scroll-top.visible {
    opacity: 1;
    transform: translateY(0);
}
```

### **Optimización Final (2 minutos)**

```css
/* Performance optimizations */
* {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

.servicio-card,
.proyecto-card {
    will-change: transform;
    contain: layout style paint;
}

/* Print styles */
@media print {
    .sidebar,
    .nav-principal,
    .btn {
        display: none;
    }
    
    .layout-principal {
        grid-template-areas:
            "header"
            "contenido"
            "footer";
        grid-template-columns: 1fr;
    }
}
```

### **✅ Verificación POLISH (1 minuto)**
- [ ] Animaciones de entrada funcionando
- [ ] Scroll suave implementado
- [ ] Performance optimizada
- [ ] Print styles básicos

---

## 🎯 Entregables Finales

### **Al completar los 30 minutos debes tener:**

1. **✅ CORE:** Website funcional con layout Grid completo
2. **⚡ ENHANCED:** Completamente responsive (móvil, tablet, desktop)
3. **✨ POLISH:** Microinteracciones y optimizaciones

### **📊 Criterios de Evaluación:**

- **Funcionalidad (40%):** Todo funciona sin errores
- **Responsive (30%):** Se adapta a todos los dispositivos
- **Código limpio (20%):** HTML semántico y CSS organizado
- **Detalles (10%):** Microinteracciones y pulido

### **🚀 Siguientes Pasos:**

Este proyecto será la base para agregar:
- JavaScript interactivo (Día 3)
- React components (Día 4)
- Express.js API (Día 5)

**¡MVP Práctica completada! Tiempo para el Simulacro WorldSkills 🏆**
