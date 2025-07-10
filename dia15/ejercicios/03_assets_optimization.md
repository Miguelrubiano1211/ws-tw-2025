# 🖼️ Ejercicio 3: Assets & Image Optimization

## 🎯 Objetivo
Optimizar la carga de assets e imágenes mediante formatos modernos, lazy loading, responsive images y estrategias de preloading para mejorar significativamente los Core Web Vitals.

## ⏱️ Duración
45 minutos

## 🔧 Dificultad
⭐⭐ (Intermedio)

## 📋 Prerrequisitos
- Conocimiento de formatos de imagen
- Experiencia con responsive design
- Comprensión de lazy loading

---

## 🚀 Instrucciones

### Paso 1: Configuración de Formatos Modernos (15 minutos)

```javascript
// src/components/OptimizedImage.js
import React, { useState, useEffect } from 'react';

const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  width, 
  height,
  priority = false,
  sizes = '100vw',
  placeholder = '/images/placeholder.jpg'
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [imageRef, setImageRef] = useState();
  const [loaded, setLoaded] = useState(false);

  // Generar versiones de imagen optimizadas
  const generateSrcSet = (baseSrc) => {
    const formats = ['webp', 'avif'];
    const sizes = [480, 768, 1024, 1440, 1920];
    
    const srcSet = sizes.map(size => {
      const webpSrc = baseSrc.replace(/\.(jpg|jpeg|png)$/i, `_${size}.webp`);
      const avifSrc = baseSrc.replace(/\.(jpg|jpeg|png)$/i, `_${size}.avif`);
      return {
        webp: `${webpSrc} ${size}w`,
        avif: `${avifSrc} ${size}w`,
        fallback: `${baseSrc.replace(/\.(jpg|jpeg|png)$/i, `_${size}.$1`)} ${size}w`
      };
    });

    return srcSet;
  };

  // Intersection Observer para lazy loading
  useEffect(() => {
    if (!imageRef || priority) {
      setImageSrc(src);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImageSrc(src);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    observer.observe(imageRef);

    return () => observer.disconnect();
  }, [imageRef, src, priority]);

  const handleLoad = () => {
    setLoaded(true);
  };

  const srcSet = generateSrcSet(src);

  return (
    <div 
      ref={setImageRef}
      className={`image-container ${className}`}
      style={{ 
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : 'auto',
        position: 'relative'
      }}
    >
      <picture>
        {/* AVIF - Formato más moderno */}
        <source
          srcSet={srcSet.map(s => s.avif).join(', ')}
          sizes={sizes}
          type="image/avif"
        />
        
        {/* WebP - Amplio soporte */}
        <source
          srcSet={srcSet.map(s => s.webp).join(', ')}
          sizes={sizes}
          type="image/webp"
        />
        
        {/* Fallback - JPEG/PNG */}
        <img
          src={imageSrc}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={handleLoad}
          className={`responsive-image ${loaded ? 'loaded' : 'loading'}`}
          style={{
            width: '100%',
            height: 'auto',
            transition: 'opacity 0.3s ease',
            opacity: loaded ? 1 : 0.7
          }}
        />
      </picture>
      
      {!loaded && (
        <div className="image-placeholder">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando imagen...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
```

### Paso 2: CSS para Performance de Imágenes (10 minutos)

```css
/* src/styles/image-optimization.css */

/* Container para imágenes optimizadas */
.image-container {
  position: relative;
  overflow: hidden;
  background-color: #f8f9fa;
}

/* Estilos para imágenes responsive */
.responsive-image {
  display: block;
  max-width: 100%;
  height: auto;
  object-fit: cover;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

/* Estados de carga */
.responsive-image.loading {
  opacity: 0.7;
  filter: blur(2px);
}

.responsive-image.loaded {
  opacity: 1;
  filter: none;
}

/* Placeholder durante carga */
.image-placeholder {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}

/* Optimización para hero images */
.hero-image {
  aspect-ratio: 16/9;
  object-fit: cover;
  width: 100%;
  height: auto;
}

/* Grid de imágenes optimizado */
.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.image-grid-item {
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.2s ease;
}

.image-grid-item:hover {
  transform: scale(1.02);
}

/* Optimización para diferentes viewports */
@media (max-width: 768px) {
  .image-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 0.5rem;
    padding: 0.5rem;
  }
}

/* Critical CSS para above-the-fold images */
.critical-image {
  display: block;
  width: 100%;
  height: auto;
  max-width: 100%;
}

/* Progressive enhancement para mejor UX */
@supports (aspect-ratio: 1) {
  .aspect-ratio-container {
    aspect-ratio: var(--aspect-ratio, 16/9);
  }
}
```

### Paso 3: Implementar Asset Preloading (10 minutos)

```javascript
// src/utils/assetPreloader.js
class AssetPreloader {
  constructor() {
    this.preloadedAssets = new Set();
    this.loadingPromises = new Map();
  }

  // Preload imágenes críticas
  preloadImages(imageUrls, priority = 'high') {
    const promises = imageUrls.map(url => this.preloadImage(url, priority));
    return Promise.allSettled(promises);
  }

  // Preload imagen individual
  preloadImage(url, priority = 'high') {
    if (this.preloadedAssets.has(url)) {
      return Promise.resolve();
    }

    if (this.loadingPromises.has(url)) {
      return this.loadingPromises.get(url);
    }

    const promise = new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = url;
      link.fetchPriority = priority;
      
      link.onload = () => {
        this.preloadedAssets.add(url);
        resolve();
      };
      
      link.onerror = reject;
      
      document.head.appendChild(link);
    });

    this.loadingPromises.set(url, promise);
    return promise;
  }

  // Preload recursos CSS críticos
  preloadCSS(cssUrls) {
    cssUrls.forEach(url => {
      if (!this.preloadedAssets.has(url)) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = url;
        link.onload = () => {
          link.rel = 'stylesheet';
          this.preloadedAssets.add(url);
        };
        document.head.appendChild(link);
      }
    });
  }

  // Prefetch para rutas futuras
  prefetchRoute(routeUrl) {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = routeUrl;
    document.head.appendChild(link);
  }

  // Preconnect a dominios externos
  preconnectDomain(domains) {
    domains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }
}

export default new AssetPreloader();
```

### Paso 4: Implementar Gallery Optimizada (10 minutos)

```javascript
// src/components/OptimizedGallery.js
import React, { useState, useCallback, useMemo } from 'react';
import OptimizedImage from './OptimizedImage';
import assetPreloader from '../utils/assetPreloader';

const OptimizedGallery = ({ images, columns = 3 }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [loadedImages, setLoadedImages] = useState(new Set());

  // Preload imágenes críticas (primeras 6)
  const criticalImages = useMemo(() => images.slice(0, 6), [images]);
  
  React.useEffect(() => {
    const criticalUrls = criticalImages.map(img => img.src);
    assetPreloader.preloadImages(criticalUrls, 'high');
  }, [criticalImages]);

  // Preload imagen al hacer hover
  const handleImageHover = useCallback((imageSrc) => {
    assetPreloader.preloadImage(imageSrc, 'low');
  }, []);

  // Manejar carga de imagen
  const handleImageLoad = useCallback((imageSrc) => {
    setLoadedImages(prev => new Set([...prev, imageSrc]));
  }, []);

  return (
    <div className="optimized-gallery">
      <div 
        className="image-grid"
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: '1rem'
        }}
      >
        {images.map((image, index) => (
          <div 
            key={image.id}
            className="gallery-item"
            onMouseEnter={() => handleImageHover(image.src)}
            onClick={() => setSelectedImage(image)}
          >
            <OptimizedImage
              src={image.src}
              alt={image.alt}
              priority={index < 6} // Primeras 6 imágenes son priority
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="gallery-image"
            />
            <div className="image-overlay">
              <h4>{image.title}</h4>
              <p>{image.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal optimizado para imagen seleccionada */}
      {selectedImage && (
        <div className="image-modal" onClick={() => setSelectedImage(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <OptimizedImage
              src={selectedImage.fullSize || selectedImage.src}
              alt={selectedImage.alt}
              priority={true}
              className="modal-image"
            />
            <button 
              className="modal-close"
              onClick={() => setSelectedImage(null)}
              aria-label="Cerrar modal"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedGallery;
```

---

## 🧪 Pruebas y Validación

### Comandos de Testing

```bash
# Herramientas para validar optimización
npx lighthouse http://localhost:3000 --view
npx @lhci/cli autorun

# Verificar formatos de imagen
curl -H "Accept: image/avif,image/webp,image/*" -I http://localhost:3000/images/hero.jpg

# Testing responsive images
# DevTools > Network > Img > Filtrar por size
```

### Métricas Objetivo

- **LCP mejorado:** < 2.5 segundos
- **CLS reducido:** < 0.1
- **Imágenes WebP/AVIF:** 90% cobertura
- **Lazy loading:** 100% imágenes below-the-fold

---

## ✅ Criterios de Evaluación

### **Técnico (70 puntos)**
- [ ] Formatos modernos implementados (20 pts)
- [ ] Lazy loading funcional (15 pts)
- [ ] Responsive images correctas (15 pts)
- [ ] Preloading strategies (20 pts)

### **Performance (20 puntos)**
- [ ] LCP mejorado significativamente (10 pts)
- [ ] Tamaño de imágenes reducido ≥50% (10 pts)

### **UX y Accesibilidad (10 puntos)**
- [ ] Alt text descriptivo (5 pts)
- [ ] Progressive loading smooth (5 pts)

---

## 📊 Entregables

1. **Componente OptimizedImage** funcional
2. **Gallery con lazy loading** implementada
3. **CSS de optimización** documentado
4. **Reporte de métricas** antes/después

---

## 🎯 Desafío Extra

Implementar **blur placeholder** para mejor UX:

```javascript
// src/hooks/useBlurPlaceholder.js
import { useState, useEffect } from 'react';

export const useBlurPlaceholder = (imageSrc) => {
  const [placeholder, setPlaceholder] = useState('');

  useEffect(() => {
    // Generar tiny placeholder base64
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 10;
    canvas.height = 10;
    
    // Generar gradiente suave
    const gradient = ctx.createLinearGradient(0, 0, 10, 10);
    gradient.addColorStop(0, '#f0f0f0');
    gradient.addColorStop(1, '#e0e0e0');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 10, 10);
    
    setPlaceholder(canvas.toDataURL());
  }, [imageSrc]);

  return placeholder;
};
```

---

## 🔗 Recursos Adicionales

- [Web.dev Image Optimization](https://web.dev/fast/#optimize-your-images)
- [AVIF vs WebP Performance](https://web.dev/compress-images-avif/)
- [Responsive Images Guide](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)
