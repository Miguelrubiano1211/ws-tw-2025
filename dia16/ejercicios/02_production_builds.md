# 📦 Ejercicio 2: Production Build Pipeline

**Duración:** 45 minutos  
**Dificultad:** ⭐⭐⭐  
**Prerrequisitos:** Ejercicio 1 completado (Docker setup)

## 🎯 Objetivos

- Optimizar builds de producción para React y Express
- Implementar code splitting y lazy loading
- Configurar environment variables por entorno
- Minimizar bundle size y optimizar assets
- Implementar build caching estratégico

## 📋 Instrucciones

### **Paso 1: Optimizar Build de React (15 minutos)**

#### **1.1 Configurar Vite para Producción**
Actualizar `frontend/vite.config.js`:

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  
  // Configuración de build optimizada
  build: {
    // Directorio de salida
    outDir: 'dist',
    
    // Generar sourcemaps para debugging
    sourcemap: process.env.NODE_ENV !== 'production',
    
    // Minificación avanzada
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remover console.logs en producción
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug']
      }
    },
    
    // Code splitting optimizado
    rollupOptions: {
      output: {
        // Chunking strategy
        manualChunks: {
          // Vendor chunks
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@mui/material', '@emotion/react', '@emotion/styled'],
          
          // Utils chunks
          utils: ['lodash', 'axios', 'date-fns'],
          
          // Charts/visualization
          charts: ['recharts', 'd3']
        },
        
        // Asset naming
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: ({name}) => {
          if (/\.(gif|jpe?g|png|svg)$/.test(name ?? '')) {
            return 'assets/images/[name]-[hash][extname]';
          }
          if (/\.css$/.test(name ?? '')) {
            return 'assets/css/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    },
    
    // Chunk size warnings
    chunkSizeWarningLimit: 500,
    
    // Assets inline threshold
    assetsInlineLimit: 4096
  },
  
  // Optimización de dependencias
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: ['@vite/client', '@vite/env']
  },
  
  // Variables de entorno
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString())
  },
  
  // Alias para imports
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@services': resolve(__dirname, 'src/services'),
      '@assets': resolve(__dirname, 'src/assets')
    }
  }
});
```

#### **1.2 Implementar Code Splitting**
Crear `frontend/src/utils/LazyComponents.jsx`:

```jsx
import { lazy, Suspense } from 'react';
import LoadingSpinner from '@components/LoadingSpinner';

// HOC para lazy loading con error boundary
export const withLazyLoading = (Component, fallback = <LoadingSpinner />) => {
  return (props) => (
    <Suspense fallback={fallback}>
      <Component {...props} />
    </Suspense>
  );
};

// Lazy loaded pages
export const HomePage = lazy(() => 
  import('@pages/HomePage').then(module => ({
    default: module.HomePage
  }))
);

export const ProductsPage = lazy(() => 
  import('@pages/ProductsPage').then(module => ({
    default: module.ProductsPage
  }))
);

export const CartPage = lazy(() => 
  import('@pages/CartPage').then(module => ({
    default: module.CartPage
  }))
);

export const CheckoutPage = lazy(() => 
  import('@pages/CheckoutPage').then(module => ({
    default: module.CheckoutPage
  }))
);

export const AdminDashboard = lazy(() => 
  import('@pages/admin/Dashboard').then(module => ({
    default: module.AdminDashboard
  }))
);

// Lazy loaded components con preload
export const ProductModal = lazy(() => {
  const moduleImport = import('@components/ProductModal');
  // Preload después de 2 segundos
  setTimeout(() => moduleImport, 2000);
  return moduleImport;
});

// Utility para precargar rutas
export const preloadRoute = (routeComponent) => {
  routeComponent();
};

// Hook para preload en hover
export const usePreloadOnHover = (preloadFn) => {
  return {
    onMouseEnter: () => preloadFn(),
    onFocus: () => preloadFn()
  };
};
```

#### **1.3 Optimizar Assets y Images**
Crear `frontend/src/utils/imageOptimization.js`:

```javascript
// Utilidades para optimización de imágenes

// Lazy loading de imágenes
export const LazyImage = ({ src, alt, className, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className={`lazy-image ${className}`}>
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }}
          {...props}
        />
      )}
    </div>
  );
};

// Generar URLs de imágenes optimizadas
export const getOptimizedImageUrl = (originalUrl, options = {}) => {
  const {
    width = 'auto',
    height = 'auto',
    quality = 85,
    format = 'webp'
  } = options;

  // Usar servicio de optimización (Cloudinary, ImageKit, etc.)
  if (process.env.REACT_APP_IMAGE_CDN) {
    return `${process.env.REACT_APP_IMAGE_CDN}/w_${width},h_${height},q_${quality},f_${format}/${originalUrl}`;
  }

  return originalUrl;
};

// Preload de imágenes críticas
export const preloadImages = (imageUrls) => {
  imageUrls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
};

// WebP detection y fallback
export const supportsWebP = () => {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};
```

### **Paso 2: Optimizar Build de Express.js (10 minutos)**

#### **2.1 Configurar Build Script**
Crear `backend/scripts/build-production.js`:

```javascript
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔨 Iniciando build de producción...');

// 1. Limpiar directorio dist
const distDir = path.join(__dirname, '../dist');
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true });
}
fs.mkdirSync(distDir);

// 2. Copiar archivos necesarios
const filesToCopy = [
  'package.json',
  'pnpm-lock.yaml',
  '.env.production'
];

filesToCopy.forEach(file => {
  const srcPath = path.join(__dirname, '..', file);
  const destPath = path.join(distDir, file);
  
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`✅ Copiado: ${file}`);
  }
});

// 3. Copiar directorio src
const srcDir = path.join(__dirname, '../src');
const destSrcDir = path.join(distDir, 'src');
fs.cpSync(srcDir, destSrcDir, { recursive: true });
console.log('✅ Código fuente copiado');

// 4. Generar archivos de metadata
const buildInfo = {
  version: process.env.npm_package_version || '1.0.0',
  buildDate: new Date().toISOString(),
  nodeVersion: process.version,
  environment: 'production',
  commit: execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim()
};

fs.writeFileSync(
  path.join(distDir, 'build-info.json'),
  JSON.stringify(buildInfo, null, 2)
);

console.log('✅ Build de producción completado');
console.log(`📦 Archivos generados en: ${distDir}`);
```

#### **2.2 Script de Optimización**
Crear `backend/scripts/optimize-production.js`:

```javascript
const fs = require('fs');
const path = require('path');

// Configuración de optimización para producción
const productionConfig = {
  // Configuración de Express
  express: {
    'trust proxy': true,
    'x-powered-by': false,
    'etag': 'strong',
    'case sensitive routing': true,
    'strict routing': false
  },
  
  // Configuración de CORS
  cors: {
    origin: process.env.FRONTEND_URL || 'https://techstore.com',
    credentials: true,
    optionsSuccessStatus: 200,
    maxAge: 86400 // 24 horas
  },
  
  // Configuración de rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // límite por IP
    message: 'Demasiadas solicitudes desde esta IP',
    standardHeaders: true,
    legacyHeaders: false
  },
  
  // Configuración de compresión
  compression: {
    filter: (req, res) => {
      if (req.headers['x-no-compression']) {
        return false;
      }
      return true;
    },
    threshold: 1024,
    level: 6
  }
};

// Generar archivo de configuración
fs.writeFileSync(
  path.join(__dirname, '../config/production.json'),
  JSON.stringify(productionConfig, null, 2)
);

console.log('✅ Configuración de producción optimizada');
```

### **Paso 3: Environment Configuration (10 minutos)**

#### **3.1 Variables por Entorno**
Crear `frontend/.env.production`:

```env
# URL de la API en producción
VITE_API_URL=https://api.techstore.com

# Configuración de analytics
VITE_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
VITE_HOTJAR_ID=HOTJAR_SITE_ID

# CDN de imágenes
VITE_IMAGE_CDN=https://cdn.techstore.com

# Feature flags
VITE_ENABLE_PWA=true
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_TRACKING=true

# Configuración de caching
VITE_CACHE_VERSION=v1.0.0
VITE_API_CACHE_TTL=300000

# Debug (false en producción)
VITE_DEBUG_MODE=false
VITE_SHOW_PERFORMANCE_METRICS=false
```

Crear `backend/.env.production`:

```env
# Configuración del servidor
NODE_ENV=production
PORT=3001
HOST=0.0.0.0

# Base de datos
MONGODB_URI=mongodb://username:password@cluster.mongodb.net/techstore?retryWrites=true&w=majority
MONGODB_OPTIONS={"maxPoolSize":10,"serverSelectionTimeoutMS":5000}

# JWT y seguridad
JWT_SECRET=production-jwt-secret-256-bits-long
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=12

# CORS
CORS_ORIGIN=https://techstore.com,https://www.techstore.com
CORS_CREDENTIALS=true

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logs
LOG_LEVEL=info
LOG_FILE_PATH=/app/logs/app.log

# Monitoring
ENABLE_MONITORING=true
SENTRY_DSN=your-sentry-dsn-here

# Email (para notificaciones)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@techstore.com
SMTP_PASS=app-specific-password

# Redis (para caching)
REDIS_URL=redis://username:password@redis-host:6379
REDIS_TTL=3600

# File uploads
UPLOAD_MAX_SIZE=5242880
UPLOAD_ALLOWED_TYPES=image/jpeg,image/png,image/webp
```

#### **3.2 Config Manager**
Crear `backend/src/config/index.js`:

```javascript
const dotenv = require('dotenv');
const path = require('path');

// Cargar variables de entorno según el ambiente
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: path.join(__dirname, '../../', envFile) });

// Configuración centralizada
const config = {
  // Configuración del servidor
  server: {
    port: parseInt(process.env.PORT) || 3001,
    host: process.env.HOST || 'localhost',
    env: process.env.NODE_ENV || 'development'
  },
  
  // Base de datos
  database: {
    uri: process.env.MONGODB_URI,
    options: JSON.parse(process.env.MONGODB_OPTIONS || '{}')
  },
  
  // JWT
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  
  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    credentials: process.env.CORS_CREDENTIALS === 'true'
  },
  
  // Rate limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
  },
  
  // Logs
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    filePath: process.env.LOG_FILE_PATH
  },
  
  // Redis
  redis: {
    url: process.env.REDIS_URL,
    ttl: parseInt(process.env.REDIS_TTL) || 3600
  },
  
  // Uploads
  uploads: {
    maxSize: parseInt(process.env.UPLOAD_MAX_SIZE) || 5242880,
    allowedTypes: process.env.UPLOAD_ALLOWED_TYPES?.split(',') || ['image/jpeg', 'image/png']
  }
};

// Validar configuración crítica
const validateConfig = () => {
  const required = [
    'MONGODB_URI',
    'JWT_SECRET'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Variables de entorno requeridas faltantes: ${missing.join(', ')}`);
  }
};

if (process.env.NODE_ENV === 'production') {
  validateConfig();
}

module.exports = config;
```

### **Paso 4: Build Scripts y Automation (10 minutos)**

#### **4.1 Package.json Scripts**
Actualizar `package.json` (raíz):

```json
{
  "name": "techstore-production",
  "version": "1.0.0",
  "scripts": {
    "build": "npm run build:frontend && npm run build:backend",
    "build:frontend": "cd frontend && pnpm run build",
    "build:backend": "cd backend && node scripts/build-production.js",
    "build:optimize": "npm run build && npm run optimize:images && npm run optimize:bundle",
    "optimize:images": "cd frontend && imagemin src/assets/images/**/* --out-dir=dist/assets/images",
    "optimize:bundle": "cd frontend && pnpm run analyze",
    "prestart": "npm run build",
    "start": "docker-compose -f docker-compose.prod.yml up -d",
    "start:dev": "docker-compose up -d",
    "test:build": "npm run build && npm run test:production",
    "test:production": "cd backend && NODE_ENV=production npm test",
    "lint:all": "npm run lint:frontend && npm run lint:backend",
    "lint:frontend": "cd frontend && pnpm run lint",
    "lint:backend": "cd backend && pnpm run lint",
    "clean": "rm -rf frontend/dist backend/dist",
    "analyze": "cd frontend && pnpm run build && pnpm run analyze"
  }
}
```

#### **4.2 CI/CD Build Script**
Crear `scripts/ci-build.sh`:

```bash
#!/bin/bash
set -e

echo "🚀 Iniciando CI/CD Build Pipeline..."

# Variables
BUILD_ENV=${NODE_ENV:-production}
BUILD_VERSION=${BUILD_VERSION:-$(date +%Y%m%d%H%M%S)}

echo "📦 Build Environment: $BUILD_ENV"
echo "🏷️  Build Version: $BUILD_VERSION"

# 1. Limpiar builds anteriores
echo "🧹 Limpiando builds anteriores..."
npm run clean

# 2. Instalar dependencias
echo "📥 Instalando dependencias..."
cd frontend && pnpm install --frozen-lockfile
cd ../backend && pnpm install --only=production

# 3. Ejecutar tests
echo "🧪 Ejecutando tests..."
cd ../frontend && pnpm test:ci
cd ../backend && pnpm test:ci

# 4. Lint y quality checks
echo "🔍 Ejecutando lint y quality checks..."
npm run lint:all

# 5. Build de aplicaciones
echo "🔨 Construyendo aplicaciones..."
npm run build

# 6. Optimizaciones
echo "⚡ Ejecutando optimizaciones..."
npm run optimize:bundle

# 7. Security audit
echo "🔒 Ejecutando security audit..."
cd frontend && pnpm audit --audit-level moderate
cd ../backend && pnpm audit --audit-level moderate

# 8. Crear artifacts
echo "📦 Creando artifacts..."
tar -czf "techstore-$BUILD_VERSION.tar.gz" \
  frontend/dist \
  backend/dist \
  docker-compose.prod.yml \
  nginx/

# 9. Generar deployment info
echo "📋 Generando deployment info..."
cat > deployment-info.json << EOF
{
  "version": "$BUILD_VERSION",
  "buildDate": "$(date -Iseconds)",
  "environment": "$BUILD_ENV",
  "commit": "$(git rev-parse HEAD)",
  "branch": "$(git rev-parse --abbrev-ref HEAD)",
  "artifacts": ["techstore-$BUILD_VERSION.tar.gz"]
}
EOF

echo "✅ Build completado exitosamente!"
echo "📦 Artifact: techstore-$BUILD_VERSION.tar.gz"
```

## 🧪 Testing y Validación

### **1. Verificar Build Size (2 minutos)**

```bash
# Analizar bundle size frontend
cd frontend && pnpm run build && pnpm run analyze

# Verificar tamaño de assets
du -sh frontend/dist/*

# Verificar compresión
gzip -9 frontend/dist/assets/js/*.js
ls -lah frontend/dist/assets/js/
```

### **2. Test de Performance (3 minutos)**

```bash
# Build de producción
npm run build

# Test de carga
cd frontend/dist && python3 -m http.server 8080 &
curl -w "@curl-format.txt" http://localhost:8080

# Lighthouse CI (si está instalado)
lhci autorun --upload.target=temporary-public-storage
```

## ✅ Criterios de Éxito

- [ ] **Bundle size:** Frontend < 500KB gzipped
- [ ] **Build time:** < 3 minutos total
- [ ] **Code splitting:** Chunks apropados generados
- [ ] **Environment config:** Variables por entorno
- [ ] **Source maps:** Generados para debugging
- [ ] **Asset optimization:** Imágenes optimizadas

## 🎯 Métricas Objetivo

- **First Contentful Paint:** < 1.5s
- **Largest Contentful Paint:** < 2.5s
- **Time to Interactive:** < 3.5s
- **Bundle JavaScript:** < 250KB gzipped
- **Bundle CSS:** < 50KB gzipped

## 📝 Entregables

1. **Builds optimizados** para frontend y backend ✅
2. **Code splitting** implementado ✅
3. **Environment configuration** por entorno ✅
4. **Build scripts** automatizados ✅
5. **Performance analysis** completado ✅

**¡Pipeline de build de producción optimizado y listo para WorldSkills! 🏆**
