# 01. Configuración del Entorno de Desarrollo

**⏰ Tiempo:** 12:00-12:30 (30 minutos)  
**🎯 Objetivo:** Configurar VS Code y herramientas para máxima productividad en competencia

## 🚀 Checklist de Configuración

### **1. Extensiones VS Code Obligatorias (10 minutos)**

```bash
# Extensiones esenciales para WorldSkills
code --install-extension ritwickdey.LiveServer
code --install-extension bradlc.vscode-tailwindcss
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension esbenp.prettier-vscode
code --install-extension ms-vscode.vscode-css-peek
code --install-extension formulahendry.auto-rename-tag
code --install-extension bradlc.vscode-tailwindcss
code --install-extension ms-vscode.vscode-json
```

### **2. Configuración VS Code Settings (5 minutos)**

Crear archivo `.vscode/settings.json`:

```json
{
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  },
  "emmet.triggerExpansionOnTab": true,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll": true
  },
  "css.validate": true,
  "html.validate.scripts": true,
  "html.validate.styles": true,
  "liveServer.settings.donotShowInfoMsg": true,
  "editor.minimap.enabled": false,
  "editor.wordWrap": "on",
  "editor.tabSize": 2,
  "editor.insertSpaces": true
}
```

### **3. Estructura de Proyecto Base (10 minutos)**

```
proyecto-worldskills/
├── index.html
├── css/
│   ├── style.css
│   ├── reset.css
│   └── variables.css
├── js/
│   └── main.js
├── images/
├── assets/
└── .vscode/
    └── settings.json
```

### **4. Plantilla HTML5 Base (5 minutos)**

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WorldSkills 2025 - Proyecto</title>
    <link rel="stylesheet" href="css/reset.css">
    <link rel="stylesheet" href="css/variables.css">
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <header>
        <nav>
            <!-- Navegación principal -->
        </nav>
    </header>
    
    <main>
        <!-- Contenido principal -->
    </main>
    
    <footer>
        <!-- Pie de página -->
    </footer>
    
    <script src="js/main.js"></script>
</body>
</html>
```

## 📝 Archivos Base

### **reset.css** - CSS Reset Competitivo
```css
/* Reset CSS para competencia WorldSkills */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  line-height: 1.15;
  -webkit-text-size-adjust: 100%;
}

body {
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  line-height: 1.6;
}

img, picture, video, canvas, svg {
  display: block;
  max-width: 100%;
}

input, button, textarea, select {
  font: inherit;
}

p, h1, h2, h3, h4, h5, h6 {
  overflow-wrap: break-word;
}
```

### **variables.css** - CSS Custom Properties
```css
:root {
  /* Colores primarios */
  --color-primario: #007bff;
  --color-secundario: #6c757d;
  --color-exito: #28a745;
  --color-peligro: #dc3545;
  --color-advertencia: #ffc107;
  
  /* Colores neutros */
  --color-blanco: #ffffff;
  --color-negro: #000000;
  --color-gris-claro: #f8f9fa;
  --color-gris: #6c757d;
  --color-gris-oscuro: #343a40;
  
  /* Tipografía */
  --fuente-primaria: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  --fuente-monospace: 'SF Mono', Monaco, 'Cascadia Code', monospace;
  
  /* Espaciado */
  --espacio-xs: 0.25rem;
  --espacio-sm: 0.5rem;
  --espacio-md: 1rem;
  --espacio-lg: 1.5rem;
  --espacio-xl: 3rem;
  
  /* Sombras */
  --sombra-sm: 0 1px 3px rgba(0,0,0,0.12);
  --sombra-md: 0 4px 6px rgba(0,0,0,0.12);
  --sombra-lg: 0 10px 25px rgba(0,0,0,0.15);
  
  /* Bordes */
  --radio-sm: 0.25rem;
  --radio-md: 0.5rem;
  --radio-lg: 1rem;
  
  /* Breakpoints */
  --bp-sm: 576px;
  --bp-md: 768px;
  --bp-lg: 992px;
  --bp-xl: 1200px;
}
```

### **style.css** - Estilos Base
```css
/* Estilos base para competencia WorldSkills */
body {
  font-family: var(--fuente-primaria);
  color: var(--color-gris-oscuro);
  background-color: var(--color-blanco);
}

/* Utilities Classes */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--espacio-md);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

/* Grid & Flexbox Utilities */
.grid {
  display: grid;
}

.flex {
  display: flex;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Responsive Utilities */
.hidden {
  display: none;
}

@media (max-width: 768px) {
  .hidden-mobile {
    display: none;
  }
}

@media (min-width: 769px) {
  .hidden-desktop {
    display: none;
  }
}
```

## ✅ Verificación de Configuración

1. **Live Server funcionando** - Abrir con clic derecho "Open with Live Server"
2. **Emmet activado** - Probar `html:5` + Tab
3. **Prettier formateando** - Guardar archivo y verificar formato
4. **CSS Peek funcionando** - Ctrl+clic en clase CSS
5. **Auto Rename Tag** - Cambiar tag y verificar cierre automático

## 🎯 Entregables

- [ ] VS Code configurado con todas las extensiones
- [ ] Proyecto base creado con estructura correcta
- [ ] Archivos CSS base funcionando
- [ ] Live Server ejecutándose
- [ ] Git inicializado (opcional pero recomendado)

**¡Entorno listo para comenzar el entrenamiento! 🚀**
