# 🌐 Configuración de Idioma

**IMPORTANTE**: Todas las respuestas, explicaciones y comentarios de código deben estar en **ESPAÑOL**.

- Las explicaciones de código deben ser en español
- Los comentarios en el código deben estar en español
- Los mensajes de error y validación deben estar en español
- La documentación generada debe estar en español

## 💬 Configuración de GitHub Copilot Chat

Para configurar GitHub Copilot Chat en español:

1. **VS Code Settings**: Agrega a `.vscode/settings.json`:

   ```json
   {
     "github.copilot.chat.localeOverride": "es"
   }
   ```

2. **Prompt en Chat**: Siempre inicia con:
   ```
   Por favor, responde en español. Todas las explicaciones deben estar en español.
   ```

---

# 🤖 Instrucciones GitHub Copilot - Entrenamiento WorldSkills 2025

## 📋 Contexto del Proyecto

Este es un **programa de entrenamiento intensivo WorldSkills 2025** diseñado para preparar competidores de élite para la competencia del 28-29 de julio de 2025. El proyecto se enfoca en las tecnologías específicas de la competencia con entrenamiento práctico intensivo.

### Estructura de la Competencia WorldSkills 2025

- **Fecha de Competencia**: 28-29 Julio 2025
- **Día 1 (28 julio)**: HTML/CSS Responsive + React.js
- **Día 2 (29 julio)**: PHP/Laravel + SQLite
- **Audiencia Objetivo**: Competidores nivel intermedio-avanzado
- **Meta**: Excelencia técnica para medalla WorldSkills
- **Duración Entrenamiento**: 12 días intensivos (72 horas)
- **Entorno**: VS Code con extensiones especializadas

### **Stack Tecnológico Específico**

#### **Día 1 - Frontend Stack:**

- **HTML5** semántico y accesible
- **CSS3** Grid + Flexbox + Animations
- **JavaScript ES6+** moderno
- **React 18+** con Vite
- **React Hooks** (useState, useEffect, useContext, custom hooks)
- **React Router** para SPA
- **Responsive Design** mobile-first

#### **Día 2 - Backend Stack:**

- **PHP 8.2+** con features modernas
- **Laravel 10+** framework
- **SQLite** database
- **Composer** package manager
- **Blade** templating engine
- **Eloquent ORM** y migrations
- **Laravel Sanctum** authentication

## 🎯 METODOLOGÍA MVP - OBLIGATORIA EN TODO EL ENTRENAMIENTO

### **IMPORTANTE: Enfoque MVP en Cada Generación de Código**

**SIEMPRE** aplicar la metodología MVP (Minimum Viable Product) en tres fases:

#### **🔧 FASE CORE (40% del tiempo) - LO ESENCIAL**

- ✅ **Funcionalidad básica operativa sin errores**
- ✅ **Estructura mínima pero correcta y semántica**
- ✅ **Resultado inmediatamente evaluable y funcional**
- ✅ **Sin dependencias complejas ni optimizaciones prematuras**

#### **⚡ FASE ENHANCED (35% del tiempo) - FUNCIONALIDADES ADICIONALES**

- ⚡ **Mejoras en experiencia del usuario**
- ⚡ **Validaciones y manejo robusto de errores**
- ⚡ **Funcionalidades secundarias importantes**
- ⚡ **Interactividad y responsividad completa**

#### **✨ FASE POLISH (25% del tiempo) - REFINAMIENTO**

- ✨ **Optimizaciones de rendimiento**
- ✨ **Mejoras visuales y microinteracciones**
- ✨ **Funcionalidades avanzadas y testing**
- ✨ **Documentación y accesibilidad completa**

### **🏆 Reglas de Oro MVP para Copilot**

1. **NUNCA** generar código que no sea inmediatamente funcional
2. **SIEMPRE** priorizar funcionalidad sobre perfección visual
3. **INCLUIR** comentarios explicando la fase MVP de cada sección
4. **ESTRUCTURAR** el código para permitir iteración y mejora incremental
5. **TIMEBOXING**: Estimar tiempo de desarrollo por fase
6. **VALIDACIÓN**: Cada fase debe ser testeable independientemente

### **📋 Estructura de Respuesta MVP**

Cuando generes código, SIEMPRE usar esta estructura:

```markdown
## 🎯 [Nombre del Componente/Feature] - Implementación MVP

### FASE CORE ✅ (Tiempo estimado: X minutos)

[Código básico funcional]

### FASE ENHANCED ⚡ (Tiempo estimado: X minutos)

[Mejoras y funcionalidades adicionales]

### FASE POLISH ✨ (Tiempo estimado: X minutos)

[Optimizaciones y refinamientos]

### 📝 Notas de Implementación MVP

- **Prioridad 1**: [Funcionalidad más crítica]
- **Prioridad 2**: [Segunda funcionalidad importante]
- **Prioridad 3**: [Mejoras opcionales]
```

## 🎯 Pautas para Generación de Código

### **Estándares HTML/CSS para Competencia WorldSkills**

Al generar código HTML/CSS, siempre sigue estas convenciones competitivas:

#### **1. HTML5 Semántico y Accesible**

```html
<!-- Siempre usa HTML5 semántico con ARIA labels -->
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0" />
    <title>Título Descriptivo - WorldSkills 2025</title>
    <link
      rel="stylesheet"
      href="styles.css" />
  </head>
  <body>
    <header role="banner">
      <nav
        role="navigation"
        aria-label="Navegación principal">
        <ul>
          <li>
            <a
              href="#inicio"
              aria-current="page"
              >Inicio</a
            >
          </li>
          <li><a href="#productos">Productos</a></li>
          <li><a href="#contacto">Contacto</a></li>
        </ul>
      </nav>
    </header>

    <main
      role="main"
      id="contenido-principal">
      <section aria-labelledby="titulo-seccion">
        <h1 id="titulo-seccion">Productos Destacados</h1>
        <div
          class="grid-productos"
          role="grid">
          <!-- Contenido de productos -->
        </div>
      </section>
    </main>

    <footer role="contentinfo">
      <p>&copy; 2025 Empresa. Todos los derechos reservados.</p>
    </footer>
  </body>
</html>
```

#### **2. CSS Grid y Flexbox Avanzado**

```css
/* Mobile-first responsive design con CSS Grid */
.grid-container {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-areas:
    'header'
    'nav'
    'main'
    'footer';
  gap: 1rem;
  min-height: 100vh;
}

.header {
  grid-area: header;
}
.nav {
  grid-area: nav;
}
.main {
  grid-area: main;
}
.footer {
  grid-area: footer;
}

/* Tablet breakpoint */
@media (min-width: 768px) {
  .grid-container {
    grid-template-columns: 250px 1fr;
    grid-template-areas:
      'header header'
      'nav main'
      'footer footer';
  }
}

/* Desktop breakpoint */
@media (min-width: 1024px) {
  .grid-container {
    grid-template-columns: 250px 1fr 200px;
    grid-template-areas:
      'header header header'
      'nav main aside'
      'footer footer footer';
  }
}

/* Flexbox para componentes internos */
.producto-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: var(--color-blanco);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.producto-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}
```

#### **3. CSS Animations y Microinteractions**

```css
/* Animaciones de carga */
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

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* Loading spinner */
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--color-gris-claro);
  border-top: 4px solid var(--color-primario);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Botones interactivos */
.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: left 0.5s;
}

.btn:hover::before {
  left: 100%;
}
```

### **Estándares de Desarrollo React para WorldSkills**

Al generar código React, siempre sigue estas convenciones competitivas aplicando el enfoque MVP:

#### **1. Ejemplo MVP: ProductoCard Component**

```jsx
// 🎯 ProductoCard - Implementación MVP

// ========== FASE CORE ✅ (15 minutos) ==========
// Funcionalidad: Mostrar información básica del producto
import React, { useState } from 'react';

const ProductoCard = ({ producto }) => {
  // Estado mínimo necesario
  const [isLoading, setIsLoading] = useState(false);

  // Funcionalidad básica: agregar al carrito
  const handleAddToCart = () => {
    setIsLoading(true);
    // Simulación básica - sin manejo de errores complejo
    setTimeout(() => {
      alert(`${producto.nombre} agregado al carrito`);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="producto-card">
      <img
        src={producto.imagen}
        alt={producto.nombre}
      />
      <h3>{producto.nombre}</h3>
      <p>${producto.precio}</p>
      <button
        onClick={handleAddToCart}
        disabled={isLoading}>
        {isLoading ? 'Agregando...' : 'Agregar al Carrito'}
      </button>
    </div>
  );
};

// ========== FASE ENHANCED ⚡ (20 minutos) ==========
// Mejoras: Estado avanzado, manejo de errores, validaciones
import React, { useState, useCallback } from 'react';

const ProductoCardEnhanced = ({ producto, onAddToCart, onFavorite }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(producto.isFavorite);
  const [error, setError] = useState(null);

  // Manejo robusto de errores
  const handleAddToCart = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await onAddToCart(producto.id);
    } catch (err) {
      setError('Error al agregar al carrito');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [producto.id, onAddToCart]);

  const handleFavoriteToggle = useCallback(async () => {
    try {
      await onFavorite(producto.id, !isFavorite);
      setIsFavorite(!isFavorite);
    } catch (err) {
      setError('Error al marcar como favorito');
    }
  }, [producto.id, isFavorite, onFavorite]);

  return (
    <article className="producto-card">
      <div className="producto-imagen">
        <img
          src={producto.imagen}
          alt={`Imagen de ${producto.nombre}`}
        />
        <button
          className={`btn-favorito ${isFavorite ? 'activo' : ''}`}
          onClick={handleFavoriteToggle}
          aria-label={
            isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'
          }>
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>

      <div className="producto-contenido">
        <h3>{producto.nombre}</h3>
        <p className="descripcion">{producto.descripcion}</p>
        <p className="precio">${producto.precio}</p>

        {error && <div className="error-message">{error}</div>}

        <button
          className="btn btn-primario"
          onClick={handleAddToCart}
          disabled={isLoading}>
          {isLoading ? 'Agregando...' : 'Agregar al Carrito'}
        </button>
      </div>
    </article>
  );
};

// ========== FASE POLISH ✨ (15 minutos) ==========
// Optimizaciones: useMemo, useCallback, accesibilidad completa
import React, { useState, useEffect, useCallback, useMemo } from 'react';

const ProductoCardOptimized = ({ producto, onAddToCart, onFavorite }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(producto.isFavorite);
  const [imageError, setImageError] = useState(false);

  // Memoización para performance - SOLO en fase POLISH
  const precioFormateado = useMemo(() => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
    }).format(producto.precio);
  }, [producto.precio]);

  // Callbacks optimizados
  const handleAddToCart = useCallback(async () => {
    setIsLoading(true);
    try {
      await onAddToCart(producto.id);
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
    } finally {
      setIsLoading(false);
    }
  }, [producto.id, onAddToCart]);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  return (
    <article
      className="producto-card"
      role="article"
      aria-labelledby={`producto-${producto.id}`}>
      <div className="producto-imagen">
        {!imageError ? (
          <img
            src={producto.imagen}
            alt={`Imagen de ${producto.nombre}`}
            loading="lazy"
            onError={handleImageError}
          />
        ) : (
          <div
            className="imagen-placeholder"
            aria-label="Imagen no disponible">
            📦
          </div>
        )}
      </div>

      <div className="producto-contenido">
        <header>
          <h3 id={`producto-${producto.id}`}>{producto.nombre}</h3>
          <p className="precio">{precioFormateado}</p>
        </header>

        <p className="descripcion">{producto.descripcion}</p>

        <footer className="producto-acciones">
          <button
            className={`btn btn-favorito ${isFavorite ? 'activo' : ''}`}
            onClick={handleFavoriteToggle}
            aria-label={
              isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'
            }>
            {isFavorite ? '❤️' : '🤍'}
          </button>

          <button
            className="btn btn-primario"
            onClick={handleAddToCart}
            disabled={isLoading}
            aria-label="Agregar al carrito de compras">
            {isLoading ? 'Agregando...' : 'Agregar al Carrito'}
          </button>
        </footer>
      </div>
    </article>
  );
};

// 📝 Notas de Implementación MVP:
// - Prioridad 1: Renderizar producto y agregar al carrito (CORE)
// - Prioridad 2: Favoritos y manejo de errores (ENHANCED)
// - Prioridad 3: Optimización y accesibilidad (POLISH)

export default React.memo(ProductoCardOptimized);
```

      role="article">
      <div className="producto-imagen">
        {!imageError ? (
          <img
            src={producto.imagen}
            alt={`Imagen de ${producto.nombre}`}
            loading="lazy"
            onError={handleImageError}
          />
        ) : (
          <div
            className="imagen-placeholder"
            aria-label="Imagen no disponible">
            📦
          </div>
        )}
      </div>

      <div className="producto-contenido">
        <header>
          <h3>{producto.nombre}</h3>
          <p className="precio">{precioFormateado}</p>
        </header>

        <p className="descripcion">{producto.descripcion}</p>

        <footer className="producto-acciones">
          <button
            className={`btn btn-favorito ${isFavorite ? 'activo' : ''}`}
            onClick={handleFavoriteToggle}
            aria-label={
              isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'
            }>
            {isFavorite ? '❤️' : '🤍'}
          </button>

          <button
            className="btn btn-primario"
            onClick={handleAddToCart}
            disabled={isLoading}
            aria-label="Agregar al carrito de compras">
            {isLoading ? 'Agregando...' : 'Agregar al Carrito'}
          </button>
        </footer>
      </div>
    </article>

);
};

export default React.memo(ProductoCard);

````

#### **2. Custom Hooks Reutilizables**

```jsx
// hooks/useApi.js - Hook personalizado para llamadas API
import { useState, useEffect, useCallback } from 'react';

const useApi = (url, options = {}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
                ...options,
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            setData(result);
        } catch (err) {
            setError(err.message);
            console.error('Error en API:', err);
        } finally {
            setLoading(false);
        }
    }, [url, options]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const refetch = useCallback(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch };
};

export default useApi;

// hooks/useLocalStorage.js - Hook para LocalStorage
import { useState, useEffect } from 'react';

const useLocalStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Error al leer ${key} de localStorage:`, error);
            return initialValue;
        }
    });

    const setValue = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(`Error al guardar ${key} en localStorage:`, error);
        }
    };

    return [storedValue, setValue];
};

export default useLocalStorage;
````

### **Estándares de Desarrollo PHP/Laravel para WorldSkills**

Al generar código PHP/Laravel, siempre sigue estas convenciones competitivas aplicando el enfoque MVP:

#### **1. Ejemplo MVP: Modelo Producto**

```php
<?php
// 🎯 Modelo Producto - Implementación MVP

// ========== FASE CORE ✅ (20 minutos) ==========
// Funcionalidad: Modelo básico con campos esenciales
// app/Models/Producto.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    protected $table = 'productos';

    // Campos mínimos necesarios
    protected $fillable = [
        'nombre',
        'precio',
        'categoria_id'
    ];

    // Relación básica
    public function categoria()
    {
        return $this->belongsTo(Categoria::class);
    }

    // Funcionalidad básica
    public function getPrecioFormateadoAttribute()
    {
        return '$' . number_format($this->precio, 2);
    }
}

// ========== FASE ENHANCED ⚡ (25 minutos) ==========
// Mejoras: Validaciones, más campos, funcionalidades adicionales
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductoEnhanced extends Model
{
    use HasFactory;

    protected $table = 'productos';

    protected $fillable = [
        'nombre',
        'descripcion',
        'precio',
        'categoria_id',
        'imagen',
        'stock',
        'activo'
    ];

    protected $casts = [
        'precio' => 'decimal:2',
        'activo' => 'boolean',
        'stock' => 'integer',
    ];

    // Relaciones mejoradas
    public function categoria()
    {
        return $this->belongsTo(Categoria::class);
    }

    public function pedidos()
    {
        return $this->belongsToMany(Pedido::class, 'pedido_productos')
                    ->withPivot('cantidad', 'precio_unitario');
    }

    // Accessors y Mutators
    public function getPrecioFormateadoAttribute()
    {
        return '$' . number_format($this->precio, 2, ',', '.');
    }

    public function setNombreAttribute($value)
    {
        $this->attributes['nombre'] = ucwords(strtolower($value));
    }

    // Scopes básicos
    public function scopeActivos($query)
    {
        return $query->where('activo', true);
    }

    public function scopeEnStock($query)
    {
        return $query->where('stock', '>', 0);
    }

    // Métodos de negocio
    public function estaDisponible()
    {
        return $this->activo && $this->stock > 0;
    }
}

// ========== FASE POLISH ✨ (15 minutos) ==========
// Optimizaciones: SoftDeletes, Factory, métodos avanzados, índices
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductoOptimized extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'productos';

    protected $fillable = [
        'nombre',
        'descripcion',
        'precio',
        'categoria_id',
        'imagen',
        'stock',
        'activo'
    ];

    protected $casts = [
        'precio' => 'decimal:2',
        'activo' => 'boolean',
        'stock' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $hidden = [
        'deleted_at'
    ];

    // Relaciones optimizadas con eager loading
    public function categoria()
    {
        return $this->belongsTo(Categoria::class);
    }

    public function pedidos()
    {
        return $this->belongsToMany(Pedido::class, 'pedido_productos')
                    ->withPivot('cantidad', 'precio_unitario')
                    ->withTimestamps();
    }

    // Accessors avanzados
    public function getPrecioFormateadoAttribute()
    {
        return '$' . number_format($this->precio, 2, ',', '.');
    }

    public function getImagenUrlAttribute()
    {
        return $this->imagen ? asset('storage/' . $this->imagen) : asset('images/no-imagen.png');
    }

    // Mutators con validación
    public function setNombreAttribute($value)
    {
        $this->attributes['nombre'] = ucwords(strtolower(trim($value)));
    }

    // Scopes avanzados
    public function scopeActivos($query)
    {
        return $query->where('activo', true);
    }

    public function scopeEnStock($query)
    {
        return $query->where('stock', '>', 0);
    }

    public function scopePorCategoria($query, $categoriaId)
    {
        return $query->where('categoria_id', $categoriaId);
    }

    public function scopeBuscarPorNombre($query, $nombre)
    {
        return $query->where('nombre', 'like', '%' . $nombre . '%');
    }

    // Métodos de negocio avanzados
    public function reducirStock($cantidad)
    {
        if ($this->stock >= $cantidad) {
            $this->stock -= $cantidad;
            $this->save();
            return true;
        }
        throw new \Exception('Stock insuficiente');
    }

    public function estaDisponible()
    {
        return $this->activo && $this->stock > 0;
    }

    public function calcularDescuento($porcentaje)
    {
        return $this->precio * (1 - $porcentaje / 100);
    }
}

// 📝 Notas de Implementación MVP:
// - Prioridad 1: Modelo funcional con campos básicos (CORE)
// - Prioridad 2: Relaciones, scopes y métodos de negocio (ENHANCED)
// - Prioridad 3: SoftDeletes, Factory, optimizaciones (POLISH)
```

    // Relaciones
    public function categoria()
    {
        return $this->belongsTo(Categoria::class);
    }

    public function pedidos()
    {
        return $this->belongsToMany(Pedido::class, 'pedido_productos')
                    ->withPivot('cantidad', 'precio_unitario')
                    ->withTimestamps();
    }

    // Accessors
    public function getPrecioFormateadoAttribute()
    {
        return '$' . number_format($this->precio, 2, ',', '.');
    }

    public function getImagenUrlAttribute()
    {
        return $this->imagen ? asset('storage/' . $this->imagen) : asset('images/no-imagen.png');
    }

    // Mutators
    public function setNombreAttribute($value)
    {
        $this->attributes['nombre'] = ucwords(strtolower($value));
    }

    // Scopes
    public function scopeActivos($query)
    {
        return $query->where('activo', true);
    }

    public function scopeEnStock($query)
    {
        return $query->where('stock', '>', 0);
    }

    public function scopePorCategoria($query, $categoriaId)
    {
        return $query->where('categoria_id', $categoriaId);
    }

    // Métodos de negocio
    public function reducirStock($cantidad)
    {
        if ($this->stock >= $cantidad) {
            $this->stock -= $cantidad;
            $this->save();
            return true;
        }
        return false;
    }

    public function estaDisponible()
    {
        return $this->activo && $this->stock > 0;
    }

}

````

#### **2. Controladores Resource Completos**

```php
<?php
// app/Http/Controllers/ProductoController.php
namespace App\Http\Controllers;

use App\Http\Requests\ProductoRequest;
use App\Models\Producto;
use App\Models\Categoria;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductoController extends Controller
{
    /**
     * Mostrar lista de productos
     */
    public function index(Request $request)
    {
        $query = Producto::with('categoria');

        // Filtros
        if ($request->filled('categoria')) {
            $query->porCategoria($request->categoria);
        }

        if ($request->filled('buscar')) {
            $query->where('nombre', 'like', '%' . $request->buscar . '%');
        }

        if ($request->filled('activo')) {
            $query->where('activo', $request->activo);
        }

        // Ordenamiento
        $ordenPor = $request->get('orden_por', 'nombre');
        $direccion = $request->get('direccion', 'asc');
        $query->orderBy($ordenPor, $direccion);

        // Paginación
        $productos = $query->paginate(12);
        $categorias = Categoria::activas()->get();

        return view('productos.index', compact('productos', 'categorias'));
    }

    /**
     * Mostrar producto individual
     */
    public function show(Producto $producto)
    {
        $producto->load('categoria');
        $productosRelacionados = Producto::activos()
            ->porCategoria($producto->categoria_id)
            ->where('id', '!=', $producto->id)
            ->limit(4)
            ->get();

        return view('productos.show', compact('producto', 'productosRelacionados'));
    }

    /**
     * Mostrar formulario de creación
     */
    public function create()
    {
        $categorias = Categoria::activas()->orderBy('nombre')->get();
        return view('productos.create', compact('categorias'));
    }

    /**
     * Guardar nuevo producto
     */
    public function store(ProductoRequest $request)
    {
        try {
            $datosProducto = $request->validated();

            // Manejar subida de imagen
            if ($request->hasFile('imagen')) {
                $datosProducto['imagen'] = $request->file('imagen')->store('productos', 'public');
            }

            $producto = Producto::create($datosProducto);

            return redirect()
                ->route('productos.show', $producto)
                ->with('success', 'Producto creado exitosamente.');

        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->with('error', 'Error al crear el producto: ' . $e->getMessage());
        }
    }

    /**
     * Mostrar formulario de edición
     */
    public function edit(Producto $producto)
    {
        $categorias = Categoria::activas()->orderBy('nombre')->get();
        return view('productos.edit', compact('producto', 'categorias'));
    }

    /**
     * Actualizar producto
     */
    public function update(ProductoRequest $request, Producto $producto)
    {
        try {
            $datosProducto = $request->validated();

            // Manejar nueva imagen
            if ($request->hasFile('imagen')) {
                // Eliminar imagen anterior
                if ($producto->imagen) {
                    Storage::disk('public')->delete($producto->imagen);
                }
                $datosProducto['imagen'] = $request->file('imagen')->store('productos', 'public');
            }

            $producto->update($datosProducto);

            return redirect()
                ->route('productos.show', $producto)
                ->with('success', 'Producto actualizado exitosamente.');

        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->with('error', 'Error al actualizar el producto: ' . $e->getMessage());
        }
    }

    /**
     * Eliminar producto
     */
    public function destroy(Producto $producto)
    {
        try {
            // Verificar si tiene pedidos asociados
            if ($producto->pedidos()->count() > 0) {
                return back()->with('error', 'No se puede eliminar el producto porque tiene pedidos asociados.');
            }

            // Eliminar imagen
            if ($producto->imagen) {
                Storage::disk('public')->delete($producto->imagen);
            }

            $producto->delete();

            return redirect()
                ->route('productos.index')
                ->with('success', 'Producto eliminado exitosamente.');

        } catch (\Exception $e) {
            return back()->with('error', 'Error al eliminar el producto: ' . $e->getMessage());
        }
    }
}
````

#### **3. Form Requests con Validaciones Avanzadas**

```php
<?php
// app/Http/Requests/ProductoRequest.php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProductoRequest extends FormRequest
{
    /**
     * Determinar si el usuario está autorizado para esta request
     */
    public function authorize()
    {
        return true; // Ajustar según lógica de autorización
    }

    /**
     * Reglas de validación
     */
    public function rules()
    {
        $productoId = $this->route('producto')?->id;

        return [
            'nombre' => [
                'required',
                'string',
                'min:3',
                'max:255',
                Rule::unique('productos', 'nombre')->ignore($productoId)
            ],
            'descripcion' => 'required|string|min:10|max:1000',
            'precio' => 'required|numeric|min:0|max:999999.99',
            'categoria_id' => 'required|exists:categorias,id',
            'imagen' => [
                'nullable',
                'image',
                'mimes:jpeg,png,jpg,gif',
                'max:2048' // 2MB máximo
            ],
            'stock' => 'required|integer|min:0|max:9999',
            'activo' => 'boolean'
        ];
    }

    /**
     * Mensajes de validación personalizados
     */
    public function messages()
    {
        return [
            'nombre.required' => 'El nombre del producto es obligatorio.',
            'nombre.unique' => 'Ya existe un producto con este nombre.',
            'nombre.min' => 'El nombre debe tener al menos 3 caracteres.',
            'descripcion.required' => 'La descripción es obligatoria.',
            'descripcion.min' => 'La descripción debe tener al menos 10 caracteres.',
            'precio.required' => 'El precio es obligatorio.',
            'precio.numeric' => 'El precio debe ser un número válido.',
            'precio.min' => 'El precio no puede ser negativo.',
            'categoria_id.required' => 'Debes seleccionar una categoría.',
            'categoria_id.exists' => 'La categoría seleccionada no existe.',
            'imagen.image' => 'El archivo debe ser una imagen.',
            'imagen.mimes' => 'La imagen debe ser de tipo: jpeg, png, jpg o gif.',
            'imagen.max' => 'La imagen no puede ser mayor a 2MB.',
            'stock.required' => 'El stock es obligatorio.',
            'stock.integer' => 'El stock debe ser un número entero.',
            'stock.min' => 'El stock no puede ser negativo.'
        ];
    }

    /**
     * Atributos personalizados para errores
     */
    public function attributes()
    {
        return [
            'categoria_id' => 'categoría',
            'activo' => 'estado'
        ];
    }

    /**
     * Preparar datos antes de validación
     */
    protected function prepareForValidation()
    {
        $this->merge([
            'activo' => $this->boolean('activo', true),
            'precio' => $this->input('precio') ? (float) str_replace(',', '.', $this->input('precio')) : null
        ]);
    }
}
```

#### **4. Migraciones y Seeders Profesionales**

```php
<?php
// database/migrations/2025_01_01_000001_create_productos_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('productos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre')->unique();
            $table->text('descripcion');
            $table->decimal('precio', 10, 2);
            $table->foreignId('categoria_id')->constrained()->onDelete('cascade');
            $table->string('imagen')->nullable();
            $table->integer('stock')->default(0);
            $table->boolean('activo')->default(true);
            $table->timestamps();
            $table->softDeletes();

            // Índices para optimización
            $table->index('activo');
            $table->index('categoria_id');
            $table->index(['activo', 'stock']); // Índice compuesto
        });
    }

    public function down()
    {
        Schema::dropIfExists('productos');
    }
};

// database/seeders/ProductoSeeder.php
namespace Database\Seeders;

use App\Models\Producto;
use App\Models\Categoria;
use Illuminate\Database\Seeder;

class ProductoSeeder extends Seeder
{
    public function run()
    {
        $categorias = Categoria::all();

        $productos = [
            [
                'nombre' => 'iPhone 15 Pro',
                'descripcion' => 'El último iPhone con chip A17 Pro y cámara profesional',
                'precio' => 4999000,
                'stock' => 25,
                'categoria_id' => $categorias->where('nombre', 'Smartphones')->first()->id
            ],
            [
                'nombre' => 'MacBook Air M3',
                'descripcion' => 'Laptop ultradelgada con chip M3 y pantalla Retina',
                'precio' => 5499000,
                'stock' => 15,
                'categoria_id' => $categorias->where('nombre', 'Laptops')->first()->id
            ],
            // ... más productos
        ];

        foreach ($productos as $producto) {
            Producto::create($producto);
        }

        // También crear productos usando Factory
        Producto::factory(50)->create();
    }
}
```

- usar pnpm (No npm)

#### **1. Componentes Funcionales con Hooks**

```jsx
// Siempre usa componentes funcionales con hooks modernos
import React, { useState, useEffect } from 'react';

const Producto = ({ id }) => {
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarProducto = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/productos/${id}`);
        if (!response.ok) throw new Error('Error al cargar producto');
        const data = await response.json();
        setProducto(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarProducto();
  }, [id]);

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!producto) return <div>Producto no encontrado</div>;

  return (
    <div className="producto">
      <h2>{producto.nombre}</h2>
      <p>{producto.descripcion}</p>
      <span className="precio">${producto.precio}</span>
    </div>
  );
};

export default Producto;
```

#### **2. Manejo de Estado con Hooks**

```jsx
// Custom hook para manejar formularios
import { useState } from 'react';

const useForm = initialValues => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = e => {
    const { name, value } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: value,
    }));
    // Limpiar error del campo al cambiar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validate = validationRules => {
    const newErrors = {};
    Object.keys(validationRules).forEach(field => {
      const rule = validationRules[field];
      const value = values[field];

      if (rule.required && !value) {
        newErrors[field] = `${field} es requerido`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return {
    values,
    errors,
    handleChange,
    validate,
    setValues,
    setErrors,
  };
};

export default useForm;
```

### **Estándares de Desarrollo Express.js**

Al generar código Express.js, siempre sigue estas convenciones:

#### **1. Estructura de Rutas**

```javascript
// routes/productos.js
const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');

// GET /api/productos - Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const productos = await Producto.find().populate('categoria');
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/productos - Crear nuevo producto
router.post('/', async (req, res) => {
  try {
    const { nombre, descripcion, precio, categoriaId } = req.body;

    // Validaciones
    if (!nombre || !precio) {
      return res.status(400).json({
        error: 'Nombre y precio son requeridos',
      });
    }

    const producto = new Producto({
      nombre,
      descripcion,
      precio,
      categoria: categoriaId,
    });

    await producto.save();
    res.status(201).json(producto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/productos/:id - Actualizar producto
router.put('/:id', async (req, res) => {
  try {
    const producto = await Producto.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(producto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/productos/:id - Eliminar producto
router.delete('/:id', async (req, res) => {
  try {
    const producto = await Producto.findByIdAndDelete(req.params.id);

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ mensaje: 'Producto eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

#### **2. Controladores**

```javascript
// controllers/productosController.js
const Producto = require('../models/Producto');

const productosController = {
  // Obtener todos los productos
  obtenerTodos: async (req, res) => {
    try {
      const { page = 1, limit = 10, search = '' } = req.query;

      const query = search ? { nombre: { $regex: search, $options: 'i' } } : {};

      const productos = await Producto.find(query)
        .populate('categoria')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });

      const total = await Producto.countDocuments(query);

      res.json({
        productos,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Crear producto
  crear: async (req, res) => {
    try {
      const producto = new Producto(req.body);
      await producto.save();
      res.status(201).json(producto);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Obtener producto por ID
  obtenerPorId: async (req, res) => {
    try {
      const producto = await Producto.findById(req.params.id).populate(
        'categoria'
      );

      if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      res.json(producto);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Actualizar producto
  actualizar: async (req, res) => {
    try {
      const producto = await Producto.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      res.json(producto);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Eliminar producto
  eliminar: async (req, res) => {
    try {
      const producto = await Producto.findByIdAndDelete(req.params.id);

      if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      res.json({ mensaje: 'Producto eliminado exitosamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = productosController;
```

#### **3. Modelos (MongoDB/Mongoose)**

```javascript
// models/Producto.js
const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es requerido'],
      trim: true,
      maxlength: [255, 'El nombre no puede exceder 255 caracteres'],
    },
    descripcion: {
      type: String,
      trim: true,
    },
    precio: {
      type: Number,
      required: [true, 'El precio es requerido'],
      min: [0, 'El precio no puede ser negativo'],
    },
    categoria: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Categoria',
      required: [true, 'La categoría es requerida'],
    },
    estado: {
      type: Boolean,
      default: true,
    },
    imagen: {
      type: String,
      default: null,
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, 'El stock no puede ser negativo'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual para precio formateado
productoSchema.virtual('precioFormateado').get(function () {
  return `$${this.precio.toFixed(2)}`;
});

// Middleware pre-save
productoSchema.pre('save', function (next) {
  if (this.nombre) {
    this.nombre = this.nombre.charAt(0).toUpperCase() + this.nombre.slice(1);
  }
  next();
});

// Métodos estáticos
productoSchema.statics.buscarPorNombre = function (nombre) {
  return this.find({ nombre: { $regex: nombre, $options: 'i' } });
};

// Métodos de instancia
productoSchema.methods.aplicarDescuento = function (porcentaje) {
  this.precio = this.precio * (1 - porcentaje / 100);
  return this.save();
};

module.exports = mongoose.model('Producto', productoSchema);
```

### **4. Middlewares de Express.js**

```javascript
// middleware/auth.js - Middleware de autenticación
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const verificarToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Token de acceso requerido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.findById(decoded.id);

    if (!usuario) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

// middleware/validation.js - Middleware de validación
const validarProducto = (req, res, next) => {
  const { nombre, precio } = req.body;
  const errores = [];

  if (!nombre || nombre.trim().length === 0) {
    errores.push('El nombre es requerido');
  }

  if (!precio || precio <= 0) {
    errores.push('El precio debe ser mayor a 0');
  }

  if (errores.length > 0) {
    return res.status(400).json({ errores });
  }

  next();
};

module.exports = { verificarToken, validarProducto };
```

### **5. Componentes React Reutilizables**

```jsx
// components/ProductoCard.jsx - Componente reutilizable
import React from 'react';
import { Link } from 'react-router-dom';

const ProductoCard = ({ producto, onDelete }) => {
  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      await onDelete(producto._id);
    }
  };

  return (
    <div className="card h-100">
      <div className="card-body">
        <h5 className="card-title">{producto.nombre}</h5>
        <p className="card-text">{producto.descripcion}</p>
        <p className="h6 text-primary">${producto.precio.toFixed(2)}</p>
      </div>
      <div className="card-footer">
        <Link
          to={`/productos/${producto._id}`}
          className="btn btn-sm btn-outline-primary me-2">
          Ver
        </Link>
        <Link
          to={`/productos/${producto._id}/edit`}
          className="btn btn-sm btn-warning me-2">
          Editar
        </Link>
        <button
          onClick={handleDelete}
          className="btn btn-sm btn-danger">
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default ProductoCard;
```

```jsx
// components/FormularioProducto.jsx - Formulario reutilizable
import React from 'react';
import useForm from '../hooks/useForm';

const FormularioProducto = ({ producto = {}, onSubmit, loading = false }) => {
  const { values, errors, handleChange, validate } = useForm({
    nombre: producto.nombre || '',
    descripcion: producto.descripcion || '',
    precio: producto.precio || '',
    categoria: producto.categoria || '',
  });

  const handleSubmit = async e => {
    e.preventDefault();

    const validationRules = {
      nombre: { required: true },
      precio: { required: true },
    };

    if (validate(validationRules)) {
      await onSubmit(values);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="needs-validation"
      noValidate>
      <div className="mb-3">
        <label
          htmlFor="nombre"
          className="form-label">
          Nombre del Producto
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={values.nombre}
          onChange={handleChange}
          className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
          required
        />
        {errors.nombre && (
          <div className="invalid-feedback">{errors.nombre}</div>
        )}
      </div>

      <div className="mb-3">
        <label
          htmlFor="descripcion"
          className="form-label">
          Descripción
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={values.descripcion}
          onChange={handleChange}
          className="form-control"
          rows="3"
        />
      </div>

      <div className="mb-3">
        <label
          htmlFor="precio"
          className="form-label">
          Precio
        </label>
        <input
          type="number"
          id="precio"
          name="precio"
          value={values.precio}
          onChange={handleChange}
          className={`form-control ${errors.precio ? 'is-invalid' : ''}`}
          step="0.01"
          min="0"
          required
        />
        {errors.precio && (
          <div className="invalid-feedback">{errors.precio}</div>
        )}
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={loading}>
        {loading ? 'Guardando...' : 'Guardar Producto'}
      </button>
    </form>
  );
};

export default FormularioProducto;
```

## 🧪 Estándares de Testing

### **Testing con Jest y Supertest**

```javascript
// tests/auth.test.js - Testing de rutas con Supertest
const request = require('supertest');
const app = require('../app');
const Usuario = require('../models/Usuario');

describe('Autenticación', () => {
  beforeEach(async () => {
    await Usuario.deleteMany({});
  });

  test('debe registrar un nuevo usuario', async () => {
    const response = await request(app).post('/api/auth/register').send({
      nombre: 'Juan Pérez',
      email: 'juan@test.com',
      password: 'password123',
    });

    expect(response.status).toBe(201);
    expect(response.body.usuario).toHaveProperty('email', 'juan@test.com');
    expect(response.body).toHaveProperty('token');
  });

  test('debe autenticar usuario existente', async () => {
    const usuario = new Usuario({
      nombre: 'Juan Pérez',
      email: 'juan@test.com',
      password: 'password123',
    });
    await usuario.save();

    const response = await request(app).post('/api/auth/login').send({
      email: 'juan@test.com',
      password: 'password123',
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});
```

### **Testing de Componentes React**

```javascript
// tests/ProductoCard.test.js - Testing con React Testing Library
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductoCard from '../components/ProductoCard';

const mockProducto = {
  _id: '1',
  nombre: 'Producto Test',
  descripcion: 'Descripción test',
  precio: 19.99,
};

const ProductoCardWrapper = ({ producto, onDelete }) => (
  <BrowserRouter>
    <ProductoCard
      producto={producto}
      onDelete={onDelete}
    />
  </BrowserRouter>
);

describe('ProductoCard', () => {
  test('debe renderizar información del producto', () => {
    render(
      <ProductoCardWrapper
        producto={mockProducto}
        onDelete={jest.fn()}
      />
    );

    expect(screen.getByText('Producto Test')).toBeInTheDocument();
    expect(screen.getByText('Descripción test')).toBeInTheDocument();
    expect(screen.getByText('$19.99')).toBeInTheDocument();
  });

  test('debe llamar onDelete cuando se hace clic en eliminar', () => {
    const mockOnDelete = jest.fn();
    window.confirm = jest.fn(() => true);

    render(
      <ProductoCardWrapper
        producto={mockProducto}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.click(screen.getByText('Eliminar'));

    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });
});
```

### **Unit Tests para Funciones**

```javascript
// tests/utils.test.js - Testing de funciones utilitarias
const { formatearPrecio, validarEmail } = require('../utils/helpers');

describe('Utilidades', () => {
  test('debe formatear precio correctamente', () => {
    expect(formatearPrecio(19.99)).toBe('$19.99');
    expect(formatearPrecio(100)).toBe('$100.00');
    expect(formatearPrecio(0)).toBe('$0.00');
  });

  test('debe validar email correctamente', () => {
    expect(validarEmail('test@test.com')).toBe(true);
    expect(validarEmail('invalid-email')).toBe(false);
    expect(validarEmail('')).toBe(false);
  });
});
```

## 🎨 Guías Frontend

### **Uso de Bootstrap 5**

```html
<!-- Usar HTML semántico con clases Bootstrap -->
<div class="card">
  <div class="card-header">
    <h5 class="card-title">Información del Producto</h5>
  </div>
  <div class="card-body">
    <form
      onSubmit="{handleSubmit}"
      className="row g-3">
      <div className="col-md-6">
        <label
          htmlFor="nombre"
          className="form-label">
          Nombre del Producto
        </label>
        <input type="text" className={`form-control ${errors.nombre ?
        'is-invalid' : ''}`} id="nombre" name="nombre" value={values.nombre}
        onChange={handleChange} required /> {errors.nombre && (
        <div className="invalid-feedback">{errors.nombre}</div>
        )}
      </div>
      <div className="col-md-6">
        <label
          htmlFor="precio"
          className="form-label">
          Precio
        </label>
        <input type="number" className={`form-control ${errors.precio ?
        'is-invalid' : ''}`} id="precio" name="precio" value={values.precio}
        onChange={handleChange} step="0.01" min="0" required /> {errors.precio
        && (
        <div className="invalid-feedback">{errors.precio}</div>
        )}
      </div>
      <div className="col-12">
        <button
          type="submit"
          className="btn btn-primary">
          {loading ? 'Guardando...' : 'Guardar Producto'}
        </button>
      </div>
    </form>
  </div>
</div>
```

### **JavaScript con React Hooks**

```javascript
// hooks/useApi.js - Custom hook para API calls
import { useState, useEffect } from 'react';

const useApi = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
          ...options,
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

export default useApi;
```

### **JavaScript Moderno (ES6+)**

```javascript
// utils/helpers.js - Funciones utilitarias
export const formatearPrecio = precio => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
  }).format(precio);
};

export const validarEmail = email => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// services/api.js - Servicio para llamadas a la API
class ApiService {
  constructor(baseURL = '/api') {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  get(endpoint) {
    return this.request(endpoint);
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }
}

export default new ApiService();
```

## 🗄️ Convenciones de Base de Datos

### **Nomenclatura MongoDB/PostgreSQL**

- **MongoDB**: Usar camelCase para nombres de campos: `productos`, `categoriaId`, `fechaCreacion`
- **PostgreSQL**: Usar snake_case: `productos`, `categoria_id`, `fecha_creacion`
- Documentos/Tablas en plural: `productos`, `usuarios`, `categorias`
- Referencias: `usuario_id`, `categoria_id`

### **Esquemas MongoDB (Mongoose)**

```javascript
// models/Producto.js - Ejemplo de esquema optimizado
const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es requerido'],
      trim: true,
      maxlength: [255, 'El nombre no puede exceder 255 caracteres'],
      index: true, // Para búsquedas rápidas
    },
    descripcion: {
      type: String,
      trim: true,
    },
    precio: {
      type: Number,
      required: [true, 'El precio es requerido'],
      min: [0, 'El precio no puede ser negativo'],
      get: v => Math.round(v * 100) / 100, // Redondear a 2 decimales
    },
    categoria: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Categoria',
      required: [true, 'La categoría es requerida'],
      index: true,
    },
    estado: {
      type: Boolean,
      default: true,
      index: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    fechaCreacion: {
      type: Date,
      default: Date.now,
    },
    fechaActualizacion: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Índices compuestos para consultas optimizadas
productoSchema.index({ categoria: 1, estado: 1 });
productoSchema.index({ precio: 1, estado: 1 });

module.exports = mongoose.model('Producto', productoSchema);
```

## 🐳 Uso de Docker

### **Comandos Docker para React/Laravel**

```bash
# Comandos Docker para desarrollo
docker compose up -d
docker compose exec frontend pnpm run dev
docker compose exec backend php artisan serve
docker compose logs -f frontend
docker compose logs -f backend

# Para instalación de dependencias
docker compose exec frontend pnpm install
docker compose exec backend composer install

# Comandos Laravel específicos
docker compose exec backend php artisan migrate
docker compose exec backend php artisan db:seed
docker compose exec backend php artisan make:model Producto -mc
docker compose exec backend php artisan tinker
```

### **Docker Compose React/Laravel**

```yaml
# docker-compose.yml - Configuración para React + Laravel + SQLite
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - '5173:5173' # Vite dev server
    volumes:
      - ./frontend:/app
      - /app/node_modules
    environment:
      - VITE_API_URL=http://localhost:8000
    depends_on:
      - backend

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - '8000:8000'
    volumes:
      - ./backend:/var/www/html
      - ./backend/storage:/var/www/html/storage
      - ./backend/bootstrap/cache:/var/www/html/bootstrap/cache
    environment:
      - APP_ENV=local
      - APP_DEBUG=true
      - APP_KEY=base64:YOUR_APP_KEY_HERE
      - DB_CONNECTION=sqlite
      - DB_DATABASE=/var/www/html/database/database.sqlite
      - CACHE_DRIVER=file
      - SESSION_DRIVER=file
      - QUEUE_DRIVER=sync

volumes:
  laravel_storage:
  mongo_data:
```

## 📚 Contexto Educativo

### **Para Ejercicios de Principiantes**

- Incluir comentarios detallados explicando cada paso
- Usar nombres de variables simples y claros
- Mostrar validación de entrada y manejo de errores
- Demostrar mejores prácticas desde el inicio

### **Para Proyectos Intermedios**

- Enfocarse en arquitectura de componentes React
- Implementar relaciones apropiadas en MongoDB/Express
- Incluir testing básico con Jest y React Testing Library
- Mostrar convenciones React/Express.js

### **Para Desafíos Avanzados**

- Optimizar para rendimiento con React.memo y useMemo
- Incluir testing comprensivo (unit, integration, e2e)
- Seguir principios SOLID en componentes y servicios
- Preparar para escenarios de competencia WorldSkills

## 🏆 WorldSkills Específico

### **Preparación de Competencia**

```javascript
// Patrón de generación CRUD rápido para React
const useCrud = apiEndpoint => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/${apiEndpoint}`);
      const data = await response.json();
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createItem = async item => {
    const response = await fetch(`/api/${apiEndpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    return response.json();
  };

  const updateItem = async (id, item) => {
    const response = await fetch(`/api/${apiEndpoint}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    return response.json();
  };

  const deleteItem = async id => {
    await fetch(`/api/${apiEndpoint}/${id}`, {
      method: 'DELETE',
    });
  };

  return {
    items,
    loading,
    error,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
  };
};
```

### **Patrones de Ahorro de Tiempo**

```jsx
// Componente genérico para formularios
const GenericForm = ({ fields, onSubmit, initialValues = {} }) => {
  const { values, handleChange, errors, validate } = useForm(initialValues);

  const handleSubmit = e => {
    e.preventDefault();
    if (validate(fields)) {
      onSubmit(values);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {fields.map(field => (
        <FormField
          key={field.name}
          {...field}
          value={values[field.name] || ''}
          onChange={handleChange}
          error={errors[field.name]}
        />
      ))}
      <button
        type="submit"
        className="btn btn-primary">
        Guardar
      </button>
    </form>
  );
};
```

## 🎯 Estándares de Calidad de Código

### **Siempre Incluir**

1. **Validación de entrada** en cada formulario
2. **Manejo de errores** para operaciones de base de datos
3. **Protección CSRF** en formularios
4. **Códigos de estado HTTP apropiados** en respuestas API
5. **Nombres de variables significativos** en inglés
6. **Comentarios** para lógica compleja

### **Evitar**

1. Vulnerabilidades de inyección SQL
2. Vulnerabilidades XSS
3. Credenciales hardcodeadas
4. HTML no semántico
5. Estilos en línea (usar clases)
6. Números mágicos (usar constantes)

## 🔧 Herramientas de Desarrollo

### **Comandos pnpm para React/Express**

```bash
# Más frecuentemente usados en entrenamiento
pnpm create react-app frontend
pnpm create react-app frontend --template typescript
pnpm init -y
pnpm install express mongoose cors dotenv
pnpm install -D nodemon jest supertest
pnpm install react-router-dom bootstrap
pnpm run dev
pnpm test
pnpm run build
```

## 📖 Estilo de Documentación

### **Comentarios de Código**

```javascript
/**
 * Crear un nuevo producto en la base de datos
 *
 * @param {Object} data Datos del producto validados
 * @returns {Promise<Object>} La instancia del producto creado
 * @throws {Error} Si la creación falla
 */
const crearProducto = async data => {
  // Validar campos requeridos
  validarDatosProducto(data);

  // Crear y retornar el producto
  const producto = new Producto(data);
  return await producto.save();
};
```

## 🚨 Seguridad Primero

### **Siempre Implementar**

- Tokens CSRF en formularios
- Validación y sanitización de entrada
- Prevención de inyección SQL (declaraciones preparadas)
- Prevención XSS (escape apropiado)
- Verificaciones de autenticación
- Middleware de autorización

### **Ejemplo de Formulario Seguro**

```jsx
// Componente con validación y sanitización
const FormularioSeguro = ({ onSubmit }) => {
  const { values, errors, handleChange, validate } = useForm({
    nombre: '',
    email: '',
    password: '',
  });

  const handleSubmit = async e => {
    e.preventDefault();

    // Validar en frontend
    const validationRules = {
      nombre: { required: true, minLength: 3 },
      email: { required: true, email: true },
      password: { required: true, minLength: 8 },
    };

    if (validate(validationRules)) {
      // Sanitizar datos antes de enviar
      const sanitizedData = {
        nombre: DOMPurify.sanitize(values.nombre),
        email: values.email.toLowerCase().trim(),
        password: values.password,
      };

      await onSubmit(sanitizedData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="nombre"
        value={values.nombre}
        onChange={handleChange}
        className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
        required
      />
      {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
    </form>
  );
};
```

---

## 💡 Recuerda

Este proyecto se enfoca en **aprendizaje práctico para competencia WorldSkills**. El código debe ser:

- **Listo para competencia**: Rápido de escribir, confiable para ejecutar
- **Educativo**: Claro y bien comentado para el aprendizaje
- **Profesional**: Siguiendo mejores prácticas de la industria
- **Eficiente**: Optimizado para velocidad de desarrollo sin sacrificar calidad

**Prioridad**: Funcionalidad > Optimización perfecta\*\*  
**Meta**: ¡Preparar estudiantes para competir y ganar a nivel WorldSkills! 🏆\*\*
