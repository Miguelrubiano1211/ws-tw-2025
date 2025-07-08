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

# 🤖 Instrucciones GitHub Copilot - Entrenamiento WorldSkills React/Express.js

## 📋 Contexto del Proyecto

Este es un **programa de entrenamiento Zero to Hero React/Express.js** diseñado para llevar a estudiantes desde principiante hasta nivel competitivo WorldSkills en 20 días. El proyecto se enfoca en aprendizaje intensivo y práctico con aplicaciones del mundo real.

### Estructura del Proyecto

- **Estrategia de Entrenamiento**: Niveles progresivos desde conceptos básicos HTML/CSS hasta React/Express.js avanzado
- **Audiencia Objetivo**: Estudiantes con conocimientos de HTML/CSS y JavaScript básico
- **Meta**: Preparación competitiva para WorldSkills en desarrollo Full-Stack JavaScript
- **Duración**: 20 días de entrenamiento intensivo (200 horas)
- **Entorno**: Desarrollo React + Express.js basado en Docker con VS Code
- **Stack Tecnológico**:
  - **Frontend**: React.js con hooks modernos
  - **Backend**: Express.js con Node.js
  - **Base de Datos**: PostgreSQL o MongoDB
  - **Styling**: CSS3, Bootstrap o Tailwind CSS

## 🎯 Pautas para Generación de Código

### **Estándares de Desarrollo React**

Al generar código React, siempre sigue estas convenciones:

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

### **Comandos Docker para React/Express.js**

```bash
# Comandos Docker para desarrollo
docker compose up -d
docker compose exec frontend pnpm start
docker compose exec backend pnpm run dev
docker compose logs -f frontend
docker compose logs -f backend

# Para instalación de dependencias
docker compose exec frontend pnpm install
docker compose exec backend pnpm install
```

### **Docker Compose React/Express.js**

```yaml
# docker-compose.yml - Configuración para React + Express + MongoDB
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - '3000:3000'
    volumes:
      - ./frontend:/app
      - /app/node_modules
    environment:
      - REACT_APP_API_URL=http://localhost:3001
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - '3001:3001'
    volumes:
      - ./backend:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - MONGODB_URI=mongodb://mongo:27017/worldskills
      - JWT_SECRET=tu_jwt_secret_aqui
    depends_on:
      - mongo

  mongo:
    image: mongo:latest
    ports:
      - '27017:27017'
    volumes:
      - mongo_data:/data/db
    environment:
      - MONGO_INITDB_DATABASE=worldskills

volumes:
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
