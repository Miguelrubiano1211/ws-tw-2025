# 📡 Día 11: APIs REST y Database Integration - Guía Detallada

## 🎯 Transformación del Día

**De:** Lógica de negocio en frontend → **A:** APIs robustas con persistencia de datos

## 🗓️ Cronograma Detallado

---

## **12:00-12:30** - REST Principles y HTTP Methods

### **Conceptos Fundamentales**

#### **¿Qué es REST?**

- **RE**presentational **S**tate **T**ransfer
- Arquitectura para servicios web
- Principios para APIs escalables

#### **Principios REST:**

1. **Stateless** - Cada petición es independiente
2. **Client-Server** - Separación clara de responsabilidades
3. **Cacheable** - Respuestas pueden ser cacheadas
4. **Uniform Interface** - Interfaz consistente
5. **Layered System** - Arquitectura en capas

#### **HTTP Methods en REST:**

```javascript
// GET - Obtener recursos
GET / api / productos; // Obtener todos los productos
GET / api / productos / 1; // Obtener producto específico

// POST - Crear recursos
POST / api / productos; // Crear nuevo producto

// PUT - Actualizar completo
PUT / api / productos / 1; // Actualizar producto completo

// PATCH - Actualizar parcial
PATCH / api / productos / 1; // Actualizar campos específicos

// DELETE - Eliminar recursos
DELETE / api / productos / 1; // Eliminar producto
```

#### **Status Codes Importantes:**

```javascript
// 2xx - Success
200 OK                      // Éxito general
201 Created                 // Recurso creado
204 No Content             // Éxito sin contenido

// 4xx - Client Error
400 Bad Request            // Petición malformada
401 Unauthorized           // No autenticado
403 Forbidden              // Sin permisos
404 Not Found              // Recurso no encontrado
422 Unprocessable Entity   // Datos inválidos

// 5xx - Server Error
500 Internal Server Error  // Error del servidor
503 Service Unavailable    // Servicio no disponible
```

### **Ejercicio Práctico:**

```javascript
// Diseñar URLs RESTful para sistema de blog
// ✅ Correcto
GET /api/posts             // Obtener todos los posts
GET /api/posts/1           // Obtener post específico
POST /api/posts            // Crear nuevo post
PUT /api/posts/1           // Actualizar post
DELETE /api/posts/1        // Eliminar post

// ❌ Incorrecto
GET /api/getAllPosts       // No RESTful
POST /api/createPost       // Redundante
GET /api/posts/delete/1    // GET para eliminar
```

---

## **12:30-13:00** - SQLite Setup y Básico

### **¿Por qué SQLite?**

- Base de datos embebida
- Cero configuración
- Perfecta para desarrollo y testing
- Soporte completo SQL

### **Instalación y Configuración**

#### **Instalar dependencias:**

```bash
pnpm install better-sqlite3
pnpm install -D @types/better-sqlite3  # Si usas TypeScript
```

#### **Configuración básica:**

```javascript
// database/config.js
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'productos.db');
const db = new Database(dbPath);

// Habilitar foreign keys
db.pragma('foreign_keys = ON');

module.exports = db;
```

### **Comandos SQLite Básicos**

#### **Crear tablas:**

```sql
-- Crear tabla productos
CREATE TABLE productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    stock INTEGER DEFAULT 0,
    categoria_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

-- Crear tabla categorías
CREATE TABLE categorias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE,
    descripcion TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### **Operaciones básicas:**

```javascript
// database/init.js
const db = require('./config');

// Crear tablas
const createTables = () => {
  // Crear tabla categorías
  db.exec(`
        CREATE TABLE IF NOT EXISTS categorias (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL UNIQUE,
            descripcion TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

  // Crear tabla productos
  db.exec(`
        CREATE TABLE IF NOT EXISTS productos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            descripcion TEXT,
            precio DECIMAL(10,2) NOT NULL,
            stock INTEGER DEFAULT 0,
            categoria_id INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (categoria_id) REFERENCES categorias(id)
        )
    `);
};

// Insertar datos de prueba
const insertSampleData = () => {
  // Insertar categorías
  const insertCategoria = db.prepare(`
        INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)
    `);

  insertCategoria.run('Electrónicos', 'Dispositivos electrónicos');
  insertCategoria.run('Ropa', 'Prendas de vestir');
  insertCategoria.run('Hogar', 'Artículos para el hogar');

  // Insertar productos
  const insertProducto = db.prepare(`
        INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id) 
        VALUES (?, ?, ?, ?, ?)
    `);

  insertProducto.run('Laptop', 'Laptop gaming', 1299.99, 5, 1);
  insertProducto.run('Mouse', 'Mouse óptico', 29.99, 20, 1);
  insertProducto.run('Camisa', 'Camisa de algodón', 39.99, 15, 2);
};

createTables();
insertSampleData();

module.exports = { createTables, insertSampleData };
```

---

## **13:00-13:30** - SQL Queries y Data Modeling

### **Consultas SQL Fundamentales**

#### **SELECT - Leer datos:**

```sql
-- Obtener todos los productos
SELECT * FROM productos;

-- Obtener productos con categoría
SELECT
    p.id,
    p.nombre,
    p.precio,
    c.nombre as categoria
FROM productos p
JOIN categorias c ON p.categoria_id = c.id;

-- Filtrar y ordenar
SELECT * FROM productos
WHERE precio > 50
ORDER BY precio DESC
LIMIT 10;

-- Contar productos por categoría
SELECT
    c.nombre,
    COUNT(p.id) as total_productos
FROM categorias c
LEFT JOIN productos p ON c.id = p.categoria_id
GROUP BY c.id, c.nombre;
```

#### **INSERT - Crear datos:**

```sql
-- Insertar producto
INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id)
VALUES ('Teclado Mecánico', 'Teclado gaming RGB', 89.99, 10, 1);

-- Insertar múltiples registros
INSERT INTO productos (nombre, precio, categoria_id) VALUES
('Monitor 24"', 299.99, 1),
('Pantalón', 49.99, 2),
('Lámpara', 39.99, 3);
```

#### **UPDATE - Actualizar datos:**

```sql
-- Actualizar producto específico
UPDATE productos
SET precio = 79.99, stock = 15
WHERE id = 1;

-- Actualizar múltiples productos
UPDATE productos
SET precio = precio * 0.9
WHERE categoria_id = 2;
```

#### **DELETE - Eliminar datos:**

```sql
-- Eliminar producto específico
DELETE FROM productos WHERE id = 1;

-- Eliminar productos sin stock
DELETE FROM productos WHERE stock = 0;
```

### **Modelado de Datos**

#### **Relaciones entre tablas:**

```sql
-- Relación uno a muchos (categoría - productos)
CREATE TABLE categorias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE
);

CREATE TABLE productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    categoria_id INTEGER,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

-- Relación muchos a muchos (productos - etiquetas)
CREATE TABLE etiquetas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE
);

CREATE TABLE producto_etiquetas (
    producto_id INTEGER,
    etiqueta_id INTEGER,
    PRIMARY KEY (producto_id, etiqueta_id),
    FOREIGN KEY (producto_id) REFERENCES productos(id),
    FOREIGN KEY (etiqueta_id) REFERENCES etiquetas(id)
);
```

#### **Constraints y Validaciones:**

```sql
CREATE TABLE productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL CHECK(length(nombre) > 0),
    precio DECIMAL(10,2) NOT NULL CHECK(precio > 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK(stock >= 0),
    email TEXT UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## **13:30-13:45** - 🛑 DESCANSO

---

## **13:45-14:15** - ORM Basics (better-sqlite3)

### **¿Qué es un ORM?**

- **O**bject **R**elational **M**apping
- Mapea objetos a tablas de base de datos
- Abstrae consultas SQL complejas
- Facilita el mantenimiento

### **Configuración better-sqlite3**

#### **Estructura del proyecto:**

```
proyecto/
├── database/
│   ├── config.js          # Configuración de DB
│   ├── init.js            # Inicialización
│   └── models/            # Modelos de datos
│       ├── Producto.js
│       └── Categoria.js
├── routes/                # Rutas de API
└── server.js             # Servidor principal
```

#### **Modelo base:**

```javascript
// database/models/BaseModel.js
const db = require('../config');

class BaseModel {
  constructor(tableName) {
    this.tableName = tableName;
    this.db = db;
  }

  // Encontrar todos los registros
  findAll() {
    const stmt = this.db.prepare(`SELECT * FROM ${this.tableName}`);
    return stmt.all();
  }

  // Encontrar por ID
  findById(id) {
    const stmt = this.db.prepare(
      `SELECT * FROM ${this.tableName} WHERE id = ?`
    );
    return stmt.get(id);
  }

  // Crear nuevo registro
  create(data) {
    const keys = Object.keys(data);
    const placeholders = keys.map(() => '?').join(', ');
    const stmt = this.db.prepare(`
            INSERT INTO ${this.tableName} (${keys.join(', ')}) 
            VALUES (${placeholders})
        `);
    const result = stmt.run(Object.values(data));
    return this.findById(result.lastInsertRowid);
  }

  // Actualizar registro
  update(id, data) {
    const keys = Object.keys(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const stmt = this.db.prepare(`
            UPDATE ${this.tableName} 
            SET ${setClause} 
            WHERE id = ?
        `);
    const result = stmt.run([...Object.values(data), id]);
    return result.changes > 0;
  }

  // Eliminar registro
  delete(id) {
    const stmt = this.db.prepare(`DELETE FROM ${this.tableName} WHERE id = ?`);
    const result = stmt.run(id);
    return result.changes > 0;
  }
}

module.exports = BaseModel;
```

#### **Modelo específico:**

```javascript
// database/models/Producto.js
const BaseModel = require('./BaseModel');

class Producto extends BaseModel {
  constructor() {
    super('productos');
  }

  // Métodos específicos del modelo
  findByCategoria(categoriaId) {
    const stmt = this.db.prepare(`
            SELECT p.*, c.nombre as categoria_nombre 
            FROM productos p
            JOIN categorias c ON p.categoria_id = c.id
            WHERE p.categoria_id = ?
        `);
    return stmt.all(categoriaId);
  }

  findByPriceRange(min, max) {
    const stmt = this.db.prepare(`
            SELECT * FROM productos 
            WHERE precio BETWEEN ? AND ?
            ORDER BY precio ASC
        `);
    return stmt.all(min, max);
  }

  updateStock(id, cantidad) {
    const stmt = this.db.prepare(`
            UPDATE productos 
            SET stock = stock + ? 
            WHERE id = ?
        `);
    const result = stmt.run(cantidad, id);
    return result.changes > 0;
  }

  // Búsqueda con filtros
  search(filters = {}) {
    let query = `
            SELECT p.*, c.nombre as categoria_nombre 
            FROM productos p
            LEFT JOIN categorias c ON p.categoria_id = c.id
            WHERE 1=1
        `;
    const params = [];

    if (filters.nombre) {
      query += ` AND p.nombre LIKE ?`;
      params.push(`%${filters.nombre}%`);
    }

    if (filters.categoria_id) {
      query += ` AND p.categoria_id = ?`;
      params.push(filters.categoria_id);
    }

    if (filters.precio_min) {
      query += ` AND p.precio >= ?`;
      params.push(filters.precio_min);
    }

    if (filters.precio_max) {
      query += ` AND p.precio <= ?`;
      params.push(filters.precio_max);
    }

    query += ` ORDER BY p.created_at DESC`;

    if (filters.limit) {
      query += ` LIMIT ?`;
      params.push(filters.limit);
    }

    const stmt = this.db.prepare(query);
    return stmt.all(params);
  }
}

module.exports = new Producto();
```

---

## **14:15-14:45** - CRUD Operations Implementation

### **Estructura del API**

#### **Servidor básico:**

```javascript
// server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/productos', require('./routes/productos'));
app.use('/api/categorias', require('./routes/categorias'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Error interno del servidor',
    details: err.message,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
```

#### **Rutas CRUD completas:**

```javascript
// routes/productos.js
const express = require('express');
const router = express.Router();
const Producto = require('../database/models/Producto');

// CREATE - POST /api/productos
router.post('/', async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, categoria_id } = req.body;

    // Validaciones básicas
    if (!nombre || !precio) {
      return res.status(400).json({
        error: 'Nombre y precio son requeridos',
      });
    }

    if (precio <= 0) {
      return res.status(400).json({
        error: 'El precio debe ser mayor a 0',
      });
    }

    const producto = Producto.create({
      nombre: nombre.trim(),
      descripcion: descripcion?.trim(),
      precio: parseFloat(precio),
      stock: parseInt(stock) || 0,
      categoria_id: categoria_id || null,
    });

    res.status(201).json({
      mensaje: 'Producto creado exitosamente',
      producto,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error al crear producto',
      details: error.message,
    });
  }
});

// READ - GET /api/productos
router.get('/', async (req, res) => {
  try {
    const { categoria, precio_min, precio_max, buscar, limit } = req.query;

    const filters = {};
    if (categoria) filters.categoria_id = parseInt(categoria);
    if (precio_min) filters.precio_min = parseFloat(precio_min);
    if (precio_max) filters.precio_max = parseFloat(precio_max);
    if (buscar) filters.nombre = buscar;
    if (limit) filters.limit = parseInt(limit);

    const productos = Producto.search(filters);

    res.json({
      total: productos.length,
      productos,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error al obtener productos',
      details: error.message,
    });
  }
});

// READ - GET /api/productos/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const producto = Producto.findById(id);

    if (!producto) {
      return res.status(404).json({
        error: 'Producto no encontrado',
      });
    }

    res.json(producto);
  } catch (error) {
    res.status(500).json({
      error: 'Error al obtener producto',
      details: error.message,
    });
  }
});

// UPDATE - PUT /api/productos/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock, categoria_id } = req.body;

    // Verificar que el producto existe
    const productoExistente = Producto.findById(id);
    if (!productoExistente) {
      return res.status(404).json({
        error: 'Producto no encontrado',
      });
    }

    // Validaciones
    if (precio && precio <= 0) {
      return res.status(400).json({
        error: 'El precio debe ser mayor a 0',
      });
    }

    if (stock && stock < 0) {
      return res.status(400).json({
        error: 'El stock no puede ser negativo',
      });
    }

    const datosActualizar = {};
    if (nombre) datosActualizar.nombre = nombre.trim();
    if (descripcion !== undefined)
      datosActualizar.descripcion = descripcion?.trim();
    if (precio) datosActualizar.precio = parseFloat(precio);
    if (stock !== undefined) datosActualizar.stock = parseInt(stock);
    if (categoria_id !== undefined) datosActualizar.categoria_id = categoria_id;

    const actualizado = Producto.update(id, datosActualizar);

    if (!actualizado) {
      return res.status(400).json({
        error: 'No se pudo actualizar el producto',
      });
    }

    const producto = Producto.findById(id);
    res.json({
      mensaje: 'Producto actualizado exitosamente',
      producto,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error al actualizar producto',
      details: error.message,
    });
  }
});

// DELETE - DELETE /api/productos/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el producto existe
    const producto = Producto.findById(id);
    if (!producto) {
      return res.status(404).json({
        error: 'Producto no encontrado',
      });
    }

    const eliminado = Producto.delete(id);

    if (!eliminado) {
      return res.status(400).json({
        error: 'No se pudo eliminar el producto',
      });
    }

    res.json({
      mensaje: 'Producto eliminado exitosamente',
      producto,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error al eliminar producto',
      details: error.message,
    });
  }
});

module.exports = router;
```

---

## **14:45-15:15** - Data Validation en Backend

### **Middleware de Validación**

#### **Validación con Joi:**

```javascript
// middleware/validation.js
const Joi = require('joi');

// Esquema de validación para productos
const productoSchema = Joi.object({
  nombre: Joi.string().min(3).max(255).required().messages({
    'string.min': 'El nombre debe tener al menos 3 caracteres',
    'string.max': 'El nombre no puede exceder 255 caracteres',
    'any.required': 'El nombre es requerido',
  }),

  descripcion: Joi.string().max(1000).allow('').optional(),

  precio: Joi.number().positive().precision(2).required().messages({
    'number.positive': 'El precio debe ser mayor a 0',
    'any.required': 'El precio es requerido',
  }),

  stock: Joi.number().integer().min(0).default(0).messages({
    'number.min': 'El stock no puede ser negativo',
  }),

  categoria_id: Joi.number().integer().positive().optional(),
});

// Middleware de validación
const validarProducto = (req, res, next) => {
  const { error, value } = productoSchema.validate(req.body, {
    abortEarly: false, // Mostrar todos los errores
    stripUnknown: true, // Remover campos no definidos
  });

  if (error) {
    const errores = error.details.map(detail => ({
      campo: detail.path[0],
      mensaje: detail.message,
    }));

    return res.status(400).json({
      error: 'Datos de validación incorrectos',
      errores,
    });
  }

  // Reemplazar req.body con los datos validados
  req.body = value;
  next();
};

module.exports = { validarProducto };
```

#### **Validación personalizada:**

```javascript
// utils/validators.js
const validarEmail = email => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const validarTelefono = telefono => {
  const regex = /^[\+]?[0-9]{10,15}$/;
  return regex.test(telefono);
};

const validarPrecio = precio => {
  return typeof precio === 'number' && precio > 0;
};

const sanitizarTexto = texto => {
  if (!texto) return '';
  return texto.trim().replace(/[<>]/g, '');
};

module.exports = {
  validarEmail,
  validarTelefono,
  validarPrecio,
  sanitizarTexto,
};
```

#### **Middleware de sanitización:**

```javascript
// middleware/sanitization.js
const { sanitizarTexto } = require('../utils/validators');

const sanitizarProducto = (req, res, next) => {
  if (req.body.nombre) {
    req.body.nombre = sanitizarTexto(req.body.nombre);
  }

  if (req.body.descripcion) {
    req.body.descripcion = sanitizarTexto(req.body.descripcion);
  }

  // Convertir tipos de datos
  if (req.body.precio) {
    req.body.precio = parseFloat(req.body.precio);
  }

  if (req.body.stock) {
    req.body.stock = parseInt(req.body.stock);
  }

  if (req.body.categoria_id) {
    req.body.categoria_id = parseInt(req.body.categoria_id);
  }

  next();
};

module.exports = { sanitizarProducto };
```

#### **Integración en rutas:**

```javascript
// routes/productos.js (actualizado)
const express = require('express');
const router = express.Router();
const { validarProducto } = require('../middleware/validation');
const { sanitizarProducto } = require('../middleware/sanitization');
const Producto = require('../database/models/Producto');

// Aplicar middlewares de validación
router.post('/', sanitizarProducto, validarProducto, async (req, res) => {
  try {
    const producto = Producto.create(req.body);
    res.status(201).json({
      mensaje: 'Producto creado exitosamente',
      producto,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error al crear producto',
      details: error.message,
    });
  }
});

router.put('/:id', sanitizarProducto, validarProducto, async (req, res) => {
  try {
    const { id } = req.params;

    const productoExistente = Producto.findById(id);
    if (!productoExistente) {
      return res.status(404).json({
        error: 'Producto no encontrado',
      });
    }

    const actualizado = Producto.update(id, req.body);

    if (!actualizado) {
      return res.status(400).json({
        error: 'No se pudo actualizar el producto',
      });
    }

    const producto = Producto.findById(id);
    res.json({
      mensaje: 'Producto actualizado exitosamente',
      producto,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error al actualizar producto',
      details: error.message,
    });
  }
});

module.exports = router;
```

---

## **15:15-15:30** - 🛑 DESCANSO

---

## **15:30-16:00** - API Documentation con Swagger

### **Configuración Swagger**

#### **Instalación:**

```bash
pnpm install swagger-ui-express swagger-jsdoc
```

#### **Configuración básica:**

```javascript
// config/swagger.js
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API de Productos',
    version: '1.0.0',
    description: 'API REST para gestión de productos y categorías',
    contact: {
      name: 'Equipo de Desarrollo',
      email: 'dev@empresa.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor de desarrollo',
    },
  ],
  components: {
    schemas: {
      Producto: {
        type: 'object',
        required: ['nombre', 'precio'],
        properties: {
          id: {
            type: 'integer',
            description: 'ID único del producto',
          },
          nombre: {
            type: 'string',
            minLength: 3,
            maxLength: 255,
            description: 'Nombre del producto',
          },
          descripcion: {
            type: 'string',
            maxLength: 1000,
            description: 'Descripción del producto',
          },
          precio: {
            type: 'number',
            format: 'float',
            minimum: 0.01,
            description: 'Precio del producto',
          },
          stock: {
            type: 'integer',
            minimum: 0,
            description: 'Cantidad en stock',
          },
          categoria_id: {
            type: 'integer',
            description: 'ID de la categoría',
          },
          created_at: {
            type: 'string',
            format: 'date-time',
            description: 'Fecha de creación',
          },
          updated_at: {
            type: 'string',
            format: 'date-time',
            description: 'Fecha de última actualización',
          },
        },
      },
      Error: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            description: 'Mensaje de error',
          },
          details: {
            type: 'string',
            description: 'Detalles del error',
          },
        },
      },
    },
  },
};

const options = {
  definition: swaggerDefinition,
  apis: ['./routes/*.js'], // Rutas donde están los comentarios de Swagger
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
```

#### **Documentación en rutas:**

```javascript
// routes/productos.js (con documentación)
const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /api/productos:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Productos]
 *     parameters:
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: integer
 *         description: ID de la categoría para filtrar
 *       - in: query
 *         name: precio_min
 *         schema:
 *           type: number
 *         description: Precio mínimo
 *       - in: query
 *         name: precio_max
 *         schema:
 *           type: number
 *         description: Precio máximo
 *       - in: query
 *         name: buscar
 *         schema:
 *           type: string
 *         description: Texto para buscar en nombre
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Número máximo de resultados
 *     responses:
 *       200:
 *         description: Lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 productos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Producto'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', async (req, res) => {
  // Implementación...
});

/**
 * @swagger
 * /api/productos:
 *   post:
 *     summary: Crear un nuevo producto
 *     tags: [Productos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - precio
 *             properties:
 *               nombre:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 255
 *               descripcion:
 *                 type: string
 *                 maxLength: 1000
 *               precio:
 *                 type: number
 *                 minimum: 0.01
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *               categoria_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                 producto:
 *                   $ref: '#/components/schemas/Producto'
 *       400:
 *         description: Datos de validación incorrectos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 errores:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       campo:
 *                         type: string
 *                       mensaje:
 *                         type: string
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', async (req, res) => {
  // Implementación...
});

/**
 * @swagger
 * /api/productos/{id}:
 *   get:
 *     summary: Obtener un producto por ID
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Producto'
 *       404:
 *         description: Producto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', async (req, res) => {
  // Implementación...
});

module.exports = router;
```

#### **Integración en servidor:**

```javascript
// server.js (actualizado)
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const app = express();

// Middleware básico
app.use(express.json());

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Endpoint para obtener el spec JSON
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Rutas
app.use('/api/productos', require('./routes/productos'));

// Redireccionar raíz a documentación
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`Documentación disponible en: http://localhost:${PORT}/api-docs`);
});
```

---

## **16:00-16:30** - Postman Testing y Automation

### **Configuración de Postman**

#### **Collection estructura:**

```json
{
  "info": {
    "name": "API Productos",
    "description": "Collection para testing de API de productos",
    "version": "1.0.0"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000",
      "type": "string"
    },
    {
      "key": "productId",
      "value": "1",
      "type": "string"
    }
  ]
}
```

#### **Test para crear producto:**

```javascript
// POST {{baseUrl}}/api/productos
// Pre-request Script
pm.environment.set("timestamp", Date.now());
pm.environment.set("productName", "Producto Test " + pm.environment.get("timestamp"));

// Request Body
{
    "nombre": "{{productName}}",
    "descripcion": "Producto de prueba",
    "precio": 99.99,
    "stock": 10,
    "categoria_id": 1
}

// Tests
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Response has correct structure", function () {
    const responseJson = pm.response.json();
    pm.expect(responseJson).to.have.property("mensaje");
    pm.expect(responseJson).to.have.property("producto");
    pm.expect(responseJson.producto).to.have.property("id");
    pm.expect(responseJson.producto).to.have.property("nombre");
    pm.expect(responseJson.producto).to.have.property("precio");
});

pm.test("Product data is correct", function () {
    const responseJson = pm.response.json();
    pm.expect(responseJson.producto.nombre).to.equal(pm.environment.get("productName"));
    pm.expect(responseJson.producto.precio).to.equal(99.99);
    pm.expect(responseJson.producto.stock).to.equal(10);
});

// Save product ID for next requests
if (pm.response.code === 201) {
    const responseJson = pm.response.json();
    pm.environment.set("createdProductId", responseJson.producto.id);
}
```

#### **Test para obtener productos:**

```javascript
// GET {{baseUrl}}/api/productos
// Tests
pm.test('Status code is 200', function () {
  pm.response.to.have.status(200);
});

pm.test('Response has correct structure', function () {
  const responseJson = pm.response.json();
  pm.expect(responseJson).to.have.property('total');
  pm.expect(responseJson).to.have.property('productos');
  pm.expect(responseJson.productos).to.be.an('array');
});

pm.test('Products have required fields', function () {
  const responseJson = pm.response.json();
  if (responseJson.productos.length > 0) {
    const firstProduct = responseJson.productos[0];
    pm.expect(firstProduct).to.have.property('id');
    pm.expect(firstProduct).to.have.property('nombre');
    pm.expect(firstProduct).to.have.property('precio');
    pm.expect(firstProduct.precio).to.be.a('number');
    pm.expect(firstProduct.precio).to.be.above(0);
  }
});

pm.test('Response time is less than 1000ms', function () {
  pm.expect(pm.response.responseTime).to.be.below(1000);
});
```

#### **Test para actualizar producto:**

```javascript
// PUT {{baseUrl}}/api/productos/{{createdProductId}}
// Request Body
{
    "nombre": "Producto Actualizado",
    "precio": 149.99,
    "stock": 5
}

// Tests
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Product was updated correctly", function () {
    const responseJson = pm.response.json();
    pm.expect(responseJson).to.have.property("mensaje");
    pm.expect(responseJson).to.have.property("producto");
    pm.expect(responseJson.producto.nombre).to.equal("Producto Actualizado");
    pm.expect(responseJson.producto.precio).to.equal(149.99);
    pm.expect(responseJson.producto.stock).to.equal(5);
});
```

#### **Test para eliminar producto:**

```javascript
// DELETE {{baseUrl}}/api/productos/{{createdProductId}}
// Tests
pm.test('Status code is 200', function () {
  pm.response.to.have.status(200);
});

pm.test('Product was deleted', function () {
  const responseJson = pm.response.json();
  pm.expect(responseJson).to.have.property('mensaje');
  pm.expect(responseJson.mensaje).to.include('eliminado');
});

// Cleanup - remove the product ID from environment
pm.environment.unset('createdProductId');
```

#### **Test para manejo de errores:**

```javascript
// GET {{baseUrl}}/api/productos/999999
// Tests
pm.test('Status code is 404', function () {
  pm.response.to.have.status(404);
});

pm.test('Error message is correct', function () {
  const responseJson = pm.response.json();
  pm.expect(responseJson).to.have.property('error');
  pm.expect(responseJson.error).to.equal('Producto no encontrado');
});
```

### **Automatización con Newman**

#### **Instalación:**

```bash
pnpm install -g newman
```

#### **Ejecutar tests:**

```bash
# Ejecutar collection
newman run api-productos.postman_collection.json

# Con environment
newman run api-productos.postman_collection.json \
  -e environment.postman_environment.json

# Generar reporte HTML
newman run api-productos.postman_collection.json \
  -r html --reporter-html-export report.html
```

#### **Integración CI/CD:**

```yaml
# .github/workflows/api-tests.yml
name: API Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'

      - name: Install dependencies
        run: pnpm install

      - name: Start server
        run: pnpm start &

      - name: Wait for server
        run: sleep 10

      - name: Run Postman tests
        run: |
          npm install -g newman
          newman run postman/api-productos.postman_collection.json \
            -e postman/environment.postman_environment.json
```

---

## **16:30-17:00** - Práctica: API Completa con Database

### **Proyecto Final: Sistema de Gestión de Productos**

#### **Estructura del proyecto:**

```
api-productos/
├── package.json
├── server.js
├── config/
│   └── swagger.js
├── database/
│   ├── config.js
│   ├── init.js
│   └── models/
│       ├── BaseModel.js
│       ├── Producto.js
│       └── Categoria.js
├── routes/
│   ├── productos.js
│   └── categorias.js
├── middleware/
│   ├── validation.js
│   └── sanitization.js
├── utils/
│   └── validators.js
├── tests/
│   └── productos.test.js
└── postman/
    ├── collection.json
    └── environment.json
```

#### **Package.json:**

```json
{
  "name": "api-productos",
  "version": "1.0.0",
  "description": "API REST para gestión de productos",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "docs": "open http://localhost:3000/api-docs"
  },
  "dependencies": {
    "express": "^4.18.2",
    "better-sqlite3": "^8.7.0",
    "joi": "^17.9.2",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "morgan": "^1.10.0",
    "swagger-ui-express": "^5.0.0",
    "swagger-jsdoc": "^6.2.8"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "jest": "^29.6.2",
    "supertest": "^6.3.3"
  }
}
```

#### **Test unitarios:**

```javascript
// tests/productos.test.js
const request = require('supertest');
const app = require('../server');

describe('API Productos', () => {
  let productoId;

  beforeAll(() => {
    // Inicializar base de datos de prueba
  });

  afterAll(() => {
    // Limpiar base de datos de prueba
  });

  describe('POST /api/productos', () => {
    test('debe crear un producto válido', async () => {
      const nuevoProducto = {
        nombre: 'Producto Test',
        descripcion: 'Descripción test',
        precio: 99.99,
        stock: 10,
        categoria_id: 1,
      };

      const response = await request(app)
        .post('/api/productos')
        .send(nuevoProducto)
        .expect(201);

      expect(response.body).toHaveProperty('mensaje');
      expect(response.body).toHaveProperty('producto');
      expect(response.body.producto).toHaveProperty('id');
      expect(response.body.producto.nombre).toBe('Producto Test');
      expect(response.body.producto.precio).toBe(99.99);

      productoId = response.body.producto.id;
    });

    test('debe rechazar producto sin nombre', async () => {
      const productoInvalido = {
        descripcion: 'Sin nombre',
        precio: 99.99,
      };

      const response = await request(app)
        .post('/api/productos')
        .send(productoInvalido)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('nombre');
    });

    test('debe rechazar precio negativo', async () => {
      const productoInvalido = {
        nombre: 'Producto Inválido',
        precio: -10,
      };

      const response = await request(app)
        .post('/api/productos')
        .send(productoInvalido)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/productos', () => {
    test('debe obtener lista de productos', async () => {
      const response = await request(app).get('/api/productos').expect(200);

      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('productos');
      expect(Array.isArray(response.body.productos)).toBe(true);
    });

    test('debe filtrar productos por categoría', async () => {
      const response = await request(app)
        .get('/api/productos?categoria=1')
        .expect(200);

      expect(response.body).toHaveProperty('productos');
      // Verificar que todos los productos tienen categoria_id = 1
    });
  });

  describe('GET /api/productos/:id', () => {
    test('debe obtener producto por ID', async () => {
      const response = await request(app)
        .get(`/api/productos/${productoId}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', productoId);
      expect(response.body).toHaveProperty('nombre');
      expect(response.body).toHaveProperty('precio');
    });

    test('debe retornar 404 para producto inexistente', async () => {
      const response = await request(app)
        .get('/api/productos/999999')
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/productos/:id', () => {
    test('debe actualizar producto existente', async () => {
      const datosActualizar = {
        nombre: 'Producto Actualizado',
        precio: 149.99,
      };

      const response = await request(app)
        .put(`/api/productos/${productoId}`)
        .send(datosActualizar)
        .expect(200);

      expect(response.body).toHaveProperty('mensaje');
      expect(response.body.producto.nombre).toBe('Producto Actualizado');
      expect(response.body.producto.precio).toBe(149.99);
    });
  });

  describe('DELETE /api/productos/:id', () => {
    test('debe eliminar producto existente', async () => {
      const response = await request(app)
        .delete(`/api/productos/${productoId}`)
        .expect(200);

      expect(response.body).toHaveProperty('mensaje');
      expect(response.body.mensaje).toContain('eliminado');
    });

    test('debe retornar 404 al eliminar producto inexistente', async () => {
      const response = await request(app)
        .delete('/api/productos/999999')
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });
});
```

### **Scripts de desarrollo:**

```bash
# Inicializar proyecto
pnpm init
pnpm install

# Desarrollo
pnpm run dev

# Testing
pnpm test

# Documentación
pnpm run docs
```

---

## 🎯 Evaluación del Día

### **Criterios de Evaluación:**

1. **API REST (25 puntos)**

   - Endpoints implementados correctamente
   - Métodos HTTP apropiados
   - Status codes correctos
   - Estructura de respuestas consistente

2. **Base de Datos (25 puntos)**

   - Modelado de datos apropiado
   - Consultas SQL eficientes
   - Relaciones entre tablas
   - Manejo de transacciones

3. **Validación (20 puntos)**

   - Validación de entrada robusta
   - Sanitización de datos
   - Manejo de errores
   - Mensajes de error claros

4. **Documentación (15 puntos)**

   - Swagger completamente configurado
   - Documentación clara y precisa
   - Ejemplos útiles
   - Interfaz funcional

5. **Testing (15 puntos)**
   - Tests unitarios completos
   - Collection de Postman funcional
   - Automatización implementada
   - Cobertura de casos de error

### **Proyecto Final Evaluado:**

- ✅ API REST completa con CRUD
- ✅ Base de datos SQLite funcional
- ✅ Validación y sanitización
- ✅ Documentación Swagger
- ✅ Testing automatizado
- ✅ Código limpio y estructurado

---

## 🚀 Siguiente Día

**Día 12: Security y Authentication**

- JWT tokens y implementation
- Password hashing con bcrypt
- Rate limiting y DDoS protection
- CORS configuration
- Security headers y best practices

¡Excelente trabajo construyendo APIs robustas y escalables! 🎉
