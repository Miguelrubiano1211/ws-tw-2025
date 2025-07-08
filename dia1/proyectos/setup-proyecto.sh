#!/bin/bash

# =============================================================================
# SCRIPT DE CONFIGURACIÓN - PROYECTO RESTAURANTE
# Bootcamp WorldSkills - Día 1
# =============================================================================

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Mostrar banner
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  SETUP PROYECTO RESTAURANTE${NC}"
echo -e "${BLUE}  Bootcamp WorldSkills - Día 1${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Crear estructura de carpetas
echo -e "${YELLOW}📁 Creando estructura de carpetas...${NC}"
mkdir -p restaurante-sabores-mundo/{css,js,images/{platos,gallery},docs}

# Crear archivos HTML
echo -e "${YELLOW}📄 Creando archivos HTML...${NC}"
touch restaurante-sabores-mundo/{index.html,menu.html,reservas.html,contacto.html}

# Crear archivos CSS
echo -e "${YELLOW}🎨 Creando archivos CSS...${NC}"
touch restaurante-sabores-mundo/css/{styles.css,responsive.css}

# Crear archivos JavaScript
echo -e "${YELLOW}⚡ Creando archivos JavaScript...${NC}"
touch restaurante-sabores-mundo/js/{main.js,reservas.js}

# Crear archivos de documentación
echo -e "${YELLOW}📚 Creando documentación...${NC}"
touch restaurante-sabores-mundo/docs/{README.md,DEPLOY.md}

# Crear .gitignore
echo -e "${YELLOW}🔧 Creando .gitignore...${NC}"
cat > restaurante-sabores-mundo/.gitignore << 'EOF'
# Archivos del sistema
.DS_Store
Thumbs.db

# Archivos temporales
*.tmp
*.temp
*.swp
*.swo

# Carpetas de dependencias
node_modules/
bower_components/

# Archivos de configuración local
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Archivos de IDE
.vscode/
.idea/
*.sublime-project
*.sublime-workspace

# Archivos de build
dist/
build/
.cache/

# Archivos de backup
*.backup
*.bak
EOF

# Crear estructura HTML básica para index.html
echo -e "${YELLOW}🏗️ Creando estructura base...${NC}"
cat > restaurante-sabores-mundo/index.html << 'EOF'
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Sabores del Mundo - Restaurante de cocina internacional en Bogotá">
    <meta name="keywords" content="restaurante, cocina internacional, Bogotá, comida">
    <meta name="author" content="Tu Nombre">
    <title>Sabores del Mundo - Restaurante de Cocina Internacional</title>
    <link rel="stylesheet" href="css/styles.css">
    <link rel="stylesheet" href="css/responsive.css">
</head>
<body>
    <!-- Skip to main content -->
    <a href="#main-content" class="skip-link">Saltar al contenido principal</a>
    
    <!-- Header -->
    <header class="main-header">
        <div class="container">
            <div class="logo">
                <img src="images/logo.png" alt="Sabores del Mundo Logo">
                <h1>Sabores del Mundo</h1>
            </div>
            
            <nav class="main-nav" role="navigation" aria-label="Navegación principal">
                <button class="nav-toggle" aria-label="Abrir menú">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                
                <ul class="nav-menu">
                    <li><a href="#inicio" aria-current="page">Inicio</a></li>
                    <li><a href="menu.html">Menú</a></li>
                    <li><a href="reservas.html">Reservas</a></li>
                    <li><a href="contacto.html">Contacto</a></li>
                </ul>
            </nav>
        </div>
    </header>
    
    <!-- Main content -->
    <main id="main-content">
        <!-- Hero section -->
        <section class="hero" id="inicio">
            <div class="hero-content">
                <h2>Bienvenido a una experiencia culinaria única</h2>
                <p>Descubre sabores del mundo en el corazón de Bogotá</p>
                <a href="reservas.html" class="cta-button">Reservar Mesa</a>
            </div>
        </section>
        
        <!-- About section -->
        <section class="about">
            <div class="container">
                <h2>Nuestra Historia</h2>
                <p>
                    Desde 2010, Sabores del Mundo ha sido el destino favorito para los amantes 
                    de la buena comida que buscan explorar la diversidad culinaria internacional.
                </p>
            </div>
        </section>
        
        <!-- Featured dishes -->
        <section class="featured-dishes">
            <div class="container">
                <h2>Platos Destacados</h2>
                <div class="dishes-grid">
                    <!-- Platos serán agregados aquí -->
                </div>
            </div>
        </section>
        
        <!-- Testimonials -->
        <section class="testimonials">
            <div class="container">
                <h2>Lo que dicen nuestros clientes</h2>
                <div class="testimonials-grid">
                    <!-- Testimonios serán agregados aquí -->
                </div>
            </div>
        </section>
    </main>
    
    <!-- Footer -->
    <footer class="main-footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>Contacto</h3>
                    <p>Calle 123 #45-67<br>Bogotá, Colombia</p>
                    <p>Tel: +57 1 234 5678</p>
                </div>
                
                <div class="footer-section">
                    <h3>Horarios</h3>
                    <p>Lunes - Domingo<br>12:00 PM - 10:00 PM</p>
                </div>
                
                <div class="footer-section">
                    <h3>Síguenos</h3>
                    <div class="social-links">
                        <a href="#" aria-label="Facebook">Facebook</a>
                        <a href="#" aria-label="Instagram">Instagram</a>
                        <a href="#" aria-label="Twitter">Twitter</a>
                    </div>
                </div>
            </div>
            
            <div class="footer-bottom">
                <p>&copy; 2024 Sabores del Mundo. Todos los derechos reservados.</p>
            </div>
        </div>
    </footer>
    
    <script src="js/main.js"></script>
</body>
</html>
EOF

# Crear CSS básico
cat > restaurante-sabores-mundo/css/styles.css << 'EOF'
/* =============================================================================
   SABORES DEL MUNDO - ESTILOS PRINCIPALES
   Bootcamp WorldSkills - Día 1
   ============================================================================= */

/* Variables CSS */
:root {
    --primary-color: #d4682a;
    --secondary-color: #8b4513;
    --accent-color: #ffd700;
    --text-dark: #2c3e50;
    --text-light: #7f8c8d;
    --background: #f8f9fa;
    --white: #ffffff;
    --success: #27ae60;
    --warning: #f39c12;
    --error: #e74c3c;
    
    --font-primary: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    --font-secondary: Georgia, serif;
    
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 2rem;
    --spacing-2xl: 3rem;
    
    --border-radius: 0.375rem;
    --box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    --transition: all 0.3s ease;
}

/* Reset básico */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: var(--font-primary);
    line-height: 1.6;
    color: var(--text-dark);
    background-color: var(--background);
}

/* Skip link */
.skip-link {
    position: absolute;
    top: -40px;
    left: 6px;
    background: var(--primary-color);
    color: var(--white);
    padding: 8px;
    text-decoration: none;
    border-radius: var(--border-radius);
    z-index: 1000;
    transition: var(--transition);
}

.skip-link:focus {
    top: 6px;
}

/* Container */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--spacing-md);
}

/* Header */
.main-header {
    background: var(--white);
    box-shadow: var(--box-shadow);
    position: sticky;
    top: 0;
    z-index: 100;
}

.main-header .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-md);
}

.logo {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
}

.logo img {
    width: 40px;
    height: 40px;
}

.logo h1 {
    color: var(--primary-color);
    font-size: 1.5rem;
}

/* Navigation */
.main-nav ul {
    display: flex;
    list-style: none;
    gap: var(--spacing-xl);
}

.main-nav a {
    color: var(--text-dark);
    text-decoration: none;
    font-weight: 500;
    transition: var(--transition);
}

.main-nav a:hover,
.main-nav a[aria-current="page"] {
    color: var(--primary-color);
}

.nav-toggle {
    display: none;
    flex-direction: column;
    background: none;
    border: none;
    cursor: pointer;
}

.nav-toggle span {
    width: 25px;
    height: 3px;
    background: var(--text-dark);
    margin: 3px 0;
    transition: var(--transition);
}

/* Hero section */
.hero {
    background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('../images/hero-bg.jpg');
    background-size: cover;
    background-position: center;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: var(--white);
}

.hero-content h2 {
    font-size: 3rem;
    margin-bottom: var(--spacing-lg);
    font-family: var(--font-secondary);
}

.hero-content p {
    font-size: 1.2rem;
    margin-bottom: var(--spacing-xl);
}

.cta-button {
    display: inline-block;
    background: var(--primary-color);
    color: var(--white);
    padding: var(--spacing-md) var(--spacing-xl);
    text-decoration: none;
    border-radius: var(--border-radius);
    font-weight: 600;
    transition: var(--transition);
}

.cta-button:hover {
    background: var(--secondary-color);
    transform: translateY(-2px);
}

/* Sections */
section {
    padding: var(--spacing-2xl) 0;
}

section h2 {
    font-size: 2.5rem;
    text-align: center;
    margin-bottom: var(--spacing-xl);
    color: var(--primary-color);
    font-family: var(--font-secondary);
}

/* About section */
.about {
    background: var(--white);
}

.about p {
    font-size: 1.1rem;
    text-align: center;
    max-width: 800px;
    margin: 0 auto;
    line-height: 1.8;
}

/* Featured dishes */
.featured-dishes {
    background: var(--background);
}

.dishes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--spacing-xl);
    margin-top: var(--spacing-xl);
}

/* Testimonials */
.testimonials {
    background: var(--white);
}

.testimonials-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--spacing-xl);
    margin-top: var(--spacing-xl);
}

/* Footer */
.main-footer {
    background: var(--text-dark);
    color: var(--white);
    padding: var(--spacing-2xl) 0 var(--spacing-md);
}

.footer-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--spacing-xl);
    margin-bottom: var(--spacing-xl);
}

.footer-section h3 {
    color: var(--accent-color);
    margin-bottom: var(--spacing-md);
}

.social-links {
    display: flex;
    gap: var(--spacing-md);
}

.social-links a {
    color: var(--white);
    text-decoration: none;
    transition: var(--transition);
}

.social-links a:hover {
    color: var(--accent-color);
}

.footer-bottom {
    text-align: center;
    padding-top: var(--spacing-md);
    border-top: 1px solid var(--text-light);
    color: var(--text-light);
}

/* Responsive design será agregado en responsive.css */
EOF

# Crear JavaScript básico
cat > restaurante-sabores-mundo/js/main.js << 'EOF'
// =============================================================================
// SABORES DEL MUNDO - JAVASCRIPT PRINCIPAL
// Bootcamp WorldSkills - Día 1
// =============================================================================

document.addEventListener('DOMContentLoaded', function() {
    // Navegación móvil
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('nav-menu-active');
        });
    }
    
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Agregar más funcionalidades aquí
    console.log('Sabores del Mundo - JavaScript cargado');
});
EOF

# Inicializar Git
echo -e "${YELLOW}🔧 Inicializando repositorio Git...${NC}"
cd restaurante-sabores-mundo
git init
git add .
git commit -m "feat: configuración inicial del proyecto restaurante"

# Mostrar estructura creada
echo -e "${GREEN}✅ Proyecto creado exitosamente!${NC}"
echo ""
echo -e "${BLUE}📁 Estructura del proyecto:${NC}"
tree . 2>/dev/null || find . -type f -name "*.html" -o -name "*.css" -o -name "*.js" -o -name "*.md" | sort

echo ""
echo -e "${YELLOW}🚀 Próximos pasos:${NC}"
echo "1. cd restaurante-sabores-mundo"
echo "2. Editar los archivos HTML, CSS y JS"
echo "3. Agregar imágenes a la carpeta images/"
echo "4. Probar el sitio con Live Server"
echo "5. Hacer commits frecuentes"
echo ""
echo -e "${GREEN}¡Éxito en tu proyecto! 🍽️${NC}"
EOF
