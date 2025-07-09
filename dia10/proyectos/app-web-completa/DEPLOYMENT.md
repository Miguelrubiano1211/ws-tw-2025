# 📋 DOCUMENTACIÓN DE DESPLIEGUE Y TESTING

## 🚀 Instrucciones de Despliegue

### Requisitos del Sistema

- **Node.js**: 18.x o superior
- **pnpm**: 8.x o superior
- **Navegador**: Chrome, Firefox, Safari, Edge (últimas versiones)

### Instalación

1. **Clonar o descargar el proyecto**

   ```bash
   cd dia10/proyectos/app-web-completa
   ```

2. **Instalar dependencias**

   ```bash
   pnpm install
   ```

3. **Ejecutar en modo desarrollo**

   ```bash
   pnpm run dev
   ```

4. **Abrir en navegador**
   ```
   http://localhost:3000
   ```

### Estructura de Archivos

```
app-web-completa/
├── index.html              # Página principal
├── styles.css              # Estilos CSS
├── package.json            # Configuración del proyecto
├── README.md               # Documentación del proyecto
├── DEPLOYMENT.md           # Esta documentación
├── data/
│   └── products.json       # Datos de productos
├── src/
│   ├── app.js              # Aplicación principal
│   ├── config.js           # Configuración
│   ├── components/         # Componentes UI
│   ├── services/           # Servicios de negocio
│   └── utils/              # Utilidades
└── tests/
    ├── example-tests.js    # Tests de ejemplo
    ├── component-tests.js  # Tests de componentes
    └── test-config.js      # Configuración de tests
```

---

## 🧪 Guía de Testing

### Ejecución de Tests

#### Opción 1: Desde la Interfaz Web

1. Abrir la aplicación en el navegador
2. Hacer clic en "🧪 Tests" en la navegación
3. Seleccionar el tipo de test a ejecutar:
   - **Todos los Tests**: Ejecuta tests unitarios y de componentes
   - **Tests de Componentes**: Solo tests de UI
   - **Tests Unitarios**: Solo tests de funciones

#### Opción 2: Desde la Consola del Navegador

```javascript
// Ejecutar todos los tests
await runTests();

// Ejecutar solo tests de componentes
await runComponentTests();
```

### Tipos de Tests Incluidos

#### 1. Tests Unitarios (`tests/example-tests.js`)

- **Validación de datos**: Verificar que los productos se validen correctamente
- **Formateo**: Probar funciones de formateo de precio y fecha
- **Servicios**: Verificar almacenamiento y recuperación de datos
- **Eventos**: Probar el sistema de eventos personalizado
- **Rendimiento**: Verificar que las operaciones sean eficientes

#### 2. Tests de Componentes (`tests/component-tests.js`)

- **Renderizado**: Verificar que los componentes se rendericen correctamente
- **Interacción**: Probar eventos de usuario (clicks, formularios)
- **Estado**: Verificar que el estado se mantenga correctamente
- **Integración**: Probar comunicación entre componentes

#### 3. Tests de Integración

- **Flujo completo**: Crear, validar y guardar productos
- **Comunicación**: Verificar que los módulos funcionen juntos
- **Casos edge**: Probar situaciones límite

### Configuración de Tests

Los tests usan un sistema simple sin frameworks externos:

```javascript
// Ejemplo de test
testRunner.test('Nombre del test', () => {
  const resultado = miFuncion(parametro);
  testRunner.assertEqual(resultado, esperado, 'Mensaje de error');
});
```

### Mocks y Datos de Prueba

- **DOM Mock**: Simulación del DOM para tests sin navegador
- **localStorage Mock**: Simulación de almacenamiento local
- **Datos de prueba**: Productos y categorías predefinidos

---

## 🛠️ Comandos de Desarrollo

### Scripts Disponibles

```bash
# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm run dev

# Ejecutar tests (si tienes Node.js configurado)
pnpm test

# Construir para producción
pnpm run build

# Limpiar archivos generados
pnpm run clean
```

### Configuración del Servidor de Desarrollo

El archivo `package.json` incluye scripts para facilitar el desarrollo:

```json
{
  "scripts": {
    "dev": "serve -s . -l 3000",
    "test": "node --experimental-modules tests/example-tests.js",
    "build": "echo 'No build needed for vanilla JS'",
    "clean": "rm -rf node_modules"
  }
}
```

---

## 🔧 Configuración Avanzada

### Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
# API Configuration
API_BASE_URL=http://localhost:3001
API_TIMEOUT=5000

# Development Settings
NODE_ENV=development
DEBUG=true

# Testing Settings
RUN_TESTS_ON_LOAD=false
```

### Configuración de VS Code

Crear `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "javascript.preferences.importModuleSpecifier": "relative",
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  }
}
```

### Live Server Configuration

Para desarrollo local, usar Live Server de VS Code:

1. Instalar extensión "Live Server"
2. Hacer clic derecho en `index.html`
3. Seleccionar "Open with Live Server"

---

## 📊 Métricas y Análisis

### Rendimiento

La aplicación incluye tests de rendimiento básicos:

```javascript
// Ejemplo de test de rendimiento
testRunner.test('Rendimiento - Filtrar 1000 productos', () => {
  const inicio = performance.now();
  const resultados = filtrarProductos(productos, 'laptop');
  const tiempo = performance.now() - inicio;

  testRunner.assert(tiempo < 100, `Debería ser rápido (${tiempo}ms)`);
});
```

### Métricas de Código

- **Cobertura de tests**: Verificar que todas las funciones estén probadas
- **Complejidad**: Mantener funciones simples y enfocadas
- **Modularidad**: Cada archivo tiene una responsabilidad específica

### Análisis de Bundle

Para proyectos más grandes, considerar:

```bash
# Analizar tamaño de archivos
du -h src/

# Verificar dependencias
pnpm ls
```

---

## 🐛 Debugging

### Herramientas de Debugging

1. **Chrome DevTools**: F12 para abrir herramientas de desarrollador
2. **Console.log**: Logging en tiempo real
3. **Breakpoints**: Pausar ejecución en puntos específicos
4. **Network tab**: Monitorear peticiones HTTP

### Debugging de Tests

```javascript
// Ejemplo de debugging en tests
testRunner.test('Debug test', () => {
  console.log('Debugging información:', variable);
  debugger; // Pausa la ejecución
  // ... resto del test
});
```

### Errores Comunes

#### 1. Módulos no encontrados

```javascript
// Error: Cannot resolve module './components/ProductCard.js'
// Solución: Verificar rutas relativas
import { ProductCard } from './components/ProductCard.js';
```

#### 2. CORS en desarrollo

```javascript
// Error: CORS policy
// Solución: Usar servidor local
pnpm run dev
```

#### 3. Tests fallan en producción

```javascript
// Error: Tests only work in development
// Solución: Remover tests en build de producción
if (process.env.NODE_ENV === 'development') {
  import('./tests/example-tests.js');
}
```

---

## 🚀 Despliegue en Producción

### Preparación

1. **Remover código de desarrollo**

   ```bash
   # Comentar o remover imports de tests
   // import { runTests } from './tests/example-tests.js';
   ```

2. **Optimizar assets**

   ```bash
   # Minificar CSS y JS si es necesario
   pnpm run build
   ```

3. **Verificar configuración**
   ```javascript
   // Cambiar configuración para producción
   const config = {
     apiUrl: 'https://api.ejemplo.com',
     debug: false,
   };
   ```

### Opciones de Despliegue

#### 1. Hosting Estático (Netlify, Vercel)

```bash
# Subir directamente los archivos
netlify deploy --dir=.
```

#### 2. Servidor Web (Apache, Nginx)

```bash
# Copiar archivos al directorio web
cp -r * /var/www/html/
```

#### 3. CDN

```bash
# Usar CDN para assets estáticos
<script src="https://cdn.jsdelivr.net/npm/mi-app@1.0.0/src/app.js"></script>
```

---

## 📚 Recursos Adicionales

### Documentación

- [MDN Web Docs](https://developer.mozilla.org/es/)
- [ES6 Features](https://es6-features.org/)
- [JavaScript.info](https://javascript.info/)

### Herramientas

- [pnpm](https://pnpm.io/)
- [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)

### Testing

- [Jest](https://jestjs.io/) - Para proyectos más grandes
- [Testing Library](https://testing-library.com/) - Para componentes
- [Playwright](https://playwright.dev/) - Para E2E testing

---

## 🤝 Soporte y Contribución

### Reportar Problemas

1. Verificar que el problema no esté ya reportado
2. Incluir información del navegador y sistema operativo
3. Proporcionar pasos para reproducir el problema
4. Incluir logs de la consola si es relevante

### Contribuir al Código

1. Fork del proyecto
2. Crear branch para la feature
3. Añadir tests para nueva funcionalidad
4. Asegurar que todos los tests pasen
5. Crear pull request con descripción clara

### Mejoras Futuras

- [ ] Añadir autenticación de usuarios
- [ ] Implementar notificaciones push
- [ ] Añadir soporte para múltiples idiomas
- [ ] Integrar con APIs externas
- [ ] Implementar modo offline
- [ ] Añadir dashboard de analytics

---

**¡Feliz coding! 🎉**
