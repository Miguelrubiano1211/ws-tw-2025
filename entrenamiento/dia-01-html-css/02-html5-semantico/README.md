# 02. HTML5 Semántico Avanzado

**⏰ Tiempo:** 12:30-13:00 (30 minutos)  
**🎯 Objetivo:** Dominar elementos semánticos modernos y estructura de documentos para competencia WorldSkills  
**🚀 Enfoque MVP:** Estructura semántica → Accesibilidad → SEO optimizado

## 🎯 Implementación MVP

### **FASE CORE ✅ (18 minutos) - Estructura Semántica Básica**

#### **1. Elementos Semánticos Principales (8 minutos)**

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Empresa Tech - Innovación Digital</title>
    <meta name="description" content="Soluciones tecnológicas innovadoras para empresas modernas">
</head>
<body>
    <!-- Header principal con navegación -->
    <header class="header-principal">
        <div class="container">
            <div class="logo">
                <img src="images/logo.svg" alt="Logo Empresa Tech">
            </div>
            <nav class="navegacion-principal">
                <ul>
                    <li><a href="#inicio">Inicio</a></li>
                    <li><a href="#servicios">Servicios</a></li>
                    <li><a href="#proyectos">Proyectos</a></li>
                    <li><a href="#contacto">Contacto</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <!-- Contenido principal -->
    <main class="contenido-principal">
        <!-- Sección hero -->
        <section class="hero" id="inicio">
            <div class="container">
                <h1>Transformamos Ideas en Soluciones Digitales</h1>
                <p>Desarrollamos aplicaciones web y móviles que impulsan el crecimiento de tu negocio</p>
                <a href="#contacto" class="btn btn-primario">Comenzar Proyecto</a>
            </div>
        </section>

        <!-- Sección servicios -->
        <section class="servicios" id="servicios">
            <div class="container">
                <h2>Nuestros Servicios</h2>
                <div class="grid-servicios">
                    <article class="servicio">
                        <h3>Desarrollo Web</h3>
                        <p>Sitios web modernos y responsive</p>
                    </article>
                    <article class="servicio">
                        <h3>Apps Móviles</h3>
                        <p>Aplicaciones nativas y híbridas</p>
                    </article>
                    <article class="servicio">
                        <h3>E-commerce</h3>
                        <p>Tiendas online optimizadas</p>
                    </article>
                </div>
            </div>
        </section>
    </main>

    <!-- Pie de página -->
    <footer class="footer">
        <div class="container">
            <p>&copy; 2025 Empresa Tech. Todos los derechos reservados.</p>
        </div>
    </footer>
</body>
</html>
```

#### **2. Elementos de Contenido Semánticos (10 minutos)**

```html
<!-- Article con elementos semánticos internos -->
<article class="proyecto-destacado">
    <header class="proyecto-header">
        <h3>Sistema de Gestión Empresarial</h3>
        <time datetime="2025-07-01">1 de Julio, 2025</time>
    </header>
    
    <figure class="proyecto-imagen">
        <img src="images/proyecto1.jpg" alt="Dashboard del sistema de gestión">
        <figcaption>Interface principal del sistema desarrollado con React y Laravel</figcaption>
    </figure>
    
    <div class="proyecto-contenido">
        <p>Sistema completo de gestión empresarial desarrollado con tecnologías modernas.</p>
        
        <details class="proyecto-detalles">
            <summary>Tecnologías utilizadas</summary>
            <ul>
                <li>Frontend: React.js con TypeScript</li>
                <li>Backend: Laravel con PHP 8</li>
                <li>Base de datos: MySQL</li>
                <li>Deployment: Docker + AWS</li>
            </ul>
        </details>
    </div>
    
    <footer class="proyecto-footer">
        <a href="#" class="btn">Ver Proyecto</a>
        <a href="#" class="btn btn-secundario">Demo en Vivo</a>
    </footer>
</article>
```

### **FASE ENHANCED ⚡ (8 minutos) - Accesibilidad y ARIA**

#### **3. Atributos ARIA y Accesibilidad (8 minutos)**

```html
<!-- Navegación con ARIA -->
<nav class="navegacion-principal" role="navigation" aria-label="Navegación principal del sitio">
    <button class="menu-toggle" 
            aria-expanded="false" 
            aria-controls="menu-principal"
            aria-label="Abrir menú de navegación">
        <span></span>
        <span></span>
        <span></span>
    </button>
    
    <ul id="menu-principal" class="menu" aria-hidden="false">
        <li><a href="#inicio" aria-current="page">Inicio</a></li>
        <li><a href="#servicios">Servicios</a></li>
        <li>
            <a href="#proyectos" 
               aria-expanded="false" 
               aria-haspopup="true">Proyectos</a>
            <ul class="submenu" aria-label="Submenu de proyectos">
                <li><a href="#web">Desarrollo Web</a></li>
                <li><a href="#mobile">Apps Móviles</a></li>
                <li><a href="#ecommerce">E-commerce</a></li>
            </ul>
        </li>
        <li><a href="#contacto">Contacto</a></li>
    </ul>
</nav>

<!-- Formulario con labels y validaciones -->
<form class="formulario-contacto" novalidate>
    <fieldset>
        <legend>Información de Contacto</legend>
        
        <div class="campo">
            <label for="nombre">Nombre completo *</label>
            <input type="text" 
                   id="nombre" 
                   name="nombre" 
                   required 
                   aria-describedby="nombre-error"
                   aria-invalid="false">
            <span id="nombre-error" class="error" aria-live="polite"></span>
        </div>
        
        <div class="campo">
            <label for="email">Correo electrónico *</label>
            <input type="email" 
                   id="email" 
                   name="email" 
                   required 
                   aria-describedby="email-error email-ayuda"
                   aria-invalid="false">
            <span id="email-ayuda" class="ayuda">Formato: usuario@dominio.com</span>
            <span id="email-error" class="error" aria-live="polite"></span>
        </div>
        
        <div class="campo">
            <label for="mensaje">Mensaje *</label>
            <textarea id="mensaje" 
                      name="mensaje" 
                      required 
                      rows="5"
                      aria-describedby="mensaje-contador mensaje-error"
                      maxlength="500"></textarea>
            <span id="mensaje-contador" class="contador">0/500 caracteres</span>
            <span id="mensaje-error" class="error" aria-live="polite"></span>
        </div>
    </fieldset>
    
    <button type="submit" class="btn btn-primario">
        <span>Enviar Mensaje</span>
        <span class="loading" aria-hidden="true">Enviando...</span>
    </button>
</form>

<!-- Sección con landmarks ARIA -->
<section class="testimonios" 
         aria-labelledby="titulo-testimonios"
         role="region">
    <h2 id="titulo-testimonios">Lo que Dicen Nuestros Clientes</h2>
    
    <div class="carousel-testimonios" 
         role="region" 
         aria-label="Carrusel de testimonios"
         aria-roledescription="carrusel">
        
        <div class="testimonio" 
             role="group" 
             aria-roledescription="testimonio"
             aria-label="Testimonio 1 de 3">
            <blockquote>
                <p>"Excelente trabajo, superaron nuestras expectativas completamente."</p>
                <cite>
                    <strong>María García</strong>
                    <span>CEO, TechStart</span>
                </cite>
            </blockquote>
        </div>
        
        <!-- Controles del carrusel -->
        <div class="carousel-controles" role="group" aria-label="Controles del carrusel">
            <button aria-label="Testimonio anterior">‹</button>
            <button aria-label="Testimonio siguiente">›</button>
        </div>
        
        <!-- Indicadores -->
        <div class="carousel-indicadores" role="tablist" aria-label="Seleccionar testimonio">
            <button role="tab" aria-selected="true" aria-controls="testimonio-1">1</button>
            <button role="tab" aria-selected="false" aria-controls="testimonio-2">2</button>
            <button role="tab" aria-selected="false" aria-controls="testimonio-3">3</button>
        </div>
    </div>
</section>
```

### **FASE POLISH ✨ (4 minutos) - SEO y Microdata**

#### **4. SEO Avanzado y Structured Data (4 minutos)**

```html
<head>
    <!-- SEO Meta Tags -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Empresa Tech - Desarrollo Web y Apps Móviles | WorldSkills 2025</title>
    <meta name="description" content="Desarrollo de aplicaciones web y móviles con React, Laravel y tecnologías modernas. Servicios profesionales para empresas en Colombia.">
    <meta name="keywords" content="desarrollo web, apps móviles, React, Laravel, WorldSkills, Colombia">
    <meta name="author" content="Empresa Tech">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="https://empresatech.com">
    
    <!-- Open Graph -->
    <meta property="og:title" content="Empresa Tech - Innovación Digital">
    <meta property="og:description" content="Transformamos ideas en soluciones digitales modernas">
    <meta property="og:image" content="https://empresatech.com/images/og-image.jpg">
    <meta property="og:url" content="https://empresatech.com">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Empresa Tech">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Empresa Tech - Innovación Digital">
    <meta name="twitter:description" content="Desarrollo web y móvil profesional">
    <meta name="twitter:image" content="https://empresatech.com/images/twitter-card.jpg">
    
    <!-- Structured Data - Organization -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Empresa Tech",
        "url": "https://empresatech.com",
        "logo": "https://empresatech.com/images/logo.png",
        "description": "Empresa especializada en desarrollo web y aplicaciones móviles",
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "CO",
            "addressLocality": "Bogotá"
        },
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+57-1-234-5678",
            "contactType": "customer service"
        }
    }
    </script>
</head>

<!-- Microdata en contenido -->
<article class="proyecto" itemscope itemtype="https://schema.org/CreativeWork">
    <h3 itemprop="name">Sistema de Gestión Empresarial</h3>
    <time itemprop="dateCreated" datetime="2025-07-01">1 de Julio, 2025</time>
    <p itemprop="description">Sistema completo de gestión empresarial desarrollado con tecnologías modernas.</p>
    <span itemprop="author" itemscope itemtype="https://schema.org/Organization">
        <span itemprop="name">Empresa Tech</span>
    </span>
</article>
```

## 📋 Checklist de Verificación

### **✅ FASE CORE**
- [ ] Elementos semánticos principales (header, nav, main, section, article, footer)
- [ ] Estructura de headings jerárquica (h1 > h2 > h3)
- [ ] Formularios con labels asociados
- [ ] Imágenes con alt descriptivo

### **⚡ FASE ENHANCED**
- [ ] Atributos ARIA implementados
- [ ] Navegación accesible con teclado
- [ ] Formularios con validación accesible
- [ ] Landmarks y roles apropiados

### **✨ FASE POLISH**
- [ ] Meta tags SEO completos
- [ ] Open Graph y Twitter Cards
- [ ] Structured Data (JSON-LD)
- [ ] URLs canónicas

## 🎯 Ejercicio Práctico (Últimos 5 minutos)

Crear estructura HTML semántica para una página de empresa tecnológica que incluya:

1. **Header** con logo y navegación principal
2. **Section hero** con título y call-to-action
3. **Section servicios** con cards de servicios
4. **Section proyectos** con testimonios
5. **Footer** con información de contacto

**Aplicar metodología MVP:**
- **Core:** Estructura semántica básica
- **Enhanced:** ARIA labels básicos
- **Polish:** Meta tags SEO

## 📝 Recursos Adicionales

- [MDN HTML Elements Reference](https://developer.mozilla.org/es/docs/Web/HTML/Element)
- [W3C WAI ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Schema.org Documentation](https://schema.org/)

**¡HTML semántico dominado! Siguiente: CSS Grid Layout Mastery 🚀**
