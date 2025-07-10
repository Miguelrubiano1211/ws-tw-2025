# 🔗 Ejercicio 4: API Integration Testing

## 📝 Descripción

Implementar testing de integración para APIs REST usando Supertest, mocking de servicios externos, y testing de endpoints con diferentes escenarios.

## 🎯 Objetivos

- Testear APIs REST con Supertest
- Mockear servicios externos y bases de datos
- Verificar códigos de estado HTTP
- Testear autenticación y autorización
- Validar schemas de respuesta
- Implementar tests de integración end-to-end

## 📋 Instrucciones

### Paso 1: Configurar servidor Express básico

```javascript
// src/server.js
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mock database
let users = [
  {
    id: 1,
    email: 'admin@test.com',
    password: bcrypt.hashSync('admin123', 10),
    role: 'admin',
  },
  {
    id: 2,
    email: 'user@test.com',
    password: bcrypt.hashSync('user123', 10),
    role: 'user',
  },
];

let products = [
  { id: 1, name: 'Producto 1', price: 29.99, stock: 10, userId: 1 },
  { id: 2, name: 'Producto 2', price: 19.99, stock: 5, userId: 2 },
];

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acceso requerido' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'test-secret', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// Routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: 'Email y contraseña son requeridos' });
    }

    const user = users.find(u => u.email === email);
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, role = 'user' } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: 'Email y contraseña son requeridos' });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }

    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(409).json({ error: 'El usuario ya existe' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = {
      id: users.length + 1,
      email,
      password: hashedPassword,
      role,
    };

    users.push(newUser);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '1h' }
    );

    res.status(201).json({
      token,
      user: { id: newUser.id, email: newUser.email, role: newUser.role },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.get('/api/products', (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    let filteredProducts = products;

    if (search) {
      filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    res.json({
      products: paginatedProducts,
      total: filteredProducts.length,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(filteredProducts.length / limit),
    });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.get('/api/products/:id', (req, res) => {
  try {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.post('/api/products', authenticateToken, (req, res) => {
  try {
    const { name, price, stock } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: 'Nombre y precio son requeridos' });
    }

    if (price < 0) {
      return res.status(400).json({ error: 'El precio debe ser positivo' });
    }

    const newProduct = {
      id: products.length + 1,
      name,
      price: parseFloat(price),
      stock: parseInt(stock) || 0,
      userId: req.user.id,
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.put('/api/products/:id', authenticateToken, (req, res) => {
  try {
    const productIndex = products.findIndex(
      p => p.id === parseInt(req.params.id)
    );

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const product = products[productIndex];

    // Solo el propietario o admin puede editar
    if (product.userId !== req.user.id && req.user.role !== 'admin') {
      return res
        .status(403)
        .json({ error: 'No tienes permisos para editar este producto' });
    }

    const { name, price, stock } = req.body;

    if (name) product.name = name;
    if (price !== undefined) {
      if (price < 0) {
        return res.status(400).json({ error: 'El precio debe ser positivo' });
      }
      product.price = parseFloat(price);
    }
    if (stock !== undefined) product.stock = parseInt(stock);

    products[productIndex] = product;
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.delete('/api/products/:id', authenticateToken, (req, res) => {
  try {
    const productIndex = products.findIndex(
      p => p.id === parseInt(req.params.id)
    );

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const product = products[productIndex];

    // Solo el propietario o admin puede eliminar
    if (product.userId !== req.user.id && req.user.role !== 'admin') {
      return res
        .status(403)
        .json({ error: 'No tienes permisos para eliminar este producto' });
    }

    products.splice(productIndex, 1);
    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

module.exports = app;
```

### Paso 2: Configurar test helpers

```javascript
// src/tests/helpers/testHelpers.js
const jwt = require('jsonwebtoken');

// Helper para generar tokens JWT
const generateToken = user => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'test-secret',
    { expiresIn: '1h' }
  );
};

// Mock users para testing
const mockUsers = {
  admin: { id: 1, email: 'admin@test.com', role: 'admin' },
  user: { id: 2, email: 'user@test.com', role: 'user' },
};

// Generar tokens para mock users
const tokens = {
  admin: generateToken(mockUsers.admin),
  user: generateToken(mockUsers.user),
};

// Helper para crear headers con auth
const createAuthHeader = token => ({
  Authorization: `Bearer ${token}`,
});

// Helper para crear producto mock
const createMockProduct = (overrides = {}) => ({
  name: 'Producto Test',
  price: 29.99,
  stock: 10,
  ...overrides,
});

// Helper para crear usuario mock
const createMockUser = (overrides = {}) => ({
  email: 'test@example.com',
  password: 'password123',
  role: 'user',
  ...overrides,
});

// Helper para validar estructura de respuesta
const validateProductStructure = product => {
  expect(product).toHaveProperty('id');
  expect(product).toHaveProperty('name');
  expect(product).toHaveProperty('price');
  expect(product).toHaveProperty('stock');
  expect(product).toHaveProperty('userId');
  expect(typeof product.id).toBe('number');
  expect(typeof product.name).toBe('string');
  expect(typeof product.price).toBe('number');
  expect(typeof product.stock).toBe('number');
  expect(typeof product.userId).toBe('number');
};

// Helper para validar estructura de usuario
const validateUserStructure = user => {
  expect(user).toHaveProperty('id');
  expect(user).toHaveProperty('email');
  expect(user).toHaveProperty('role');
  expect(typeof user.id).toBe('number');
  expect(typeof user.email).toBe('string');
  expect(typeof user.role).toBe('string');
  expect(user).not.toHaveProperty('password');
};

module.exports = {
  generateToken,
  mockUsers,
  tokens,
  createAuthHeader,
  createMockProduct,
  createMockUser,
  validateProductStructure,
  validateUserStructure,
};
```

### Paso 3: Tests de autenticación

```javascript
// src/tests/auth.test.js
const request = require('supertest');
const app = require('../server');
const {
  createMockUser,
  validateUserStructure,
} = require('./helpers/testHelpers');

describe('Authentication API', () => {
  describe('POST /api/auth/login', () => {
    test('debe autenticar usuario con credenciales válidas', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@test.com',
          password: 'admin123',
        })
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      validateUserStructure(response.body.user);
      expect(response.body.user.email).toBe('admin@test.com');
    });

    test('debe rechazar credenciales inválidas', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@test.com',
          password: 'wrongpassword',
        })
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Credenciales inválidas');
    });

    test('debe rechazar email inexistente', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@test.com',
          password: 'password123',
        })
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Credenciales inválidas');
    });

    test('debe requerir email y contraseña', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@test.com',
        })
        .expect(400);

      expect(response.body).toHaveProperty(
        'error',
        'Email y contraseña son requeridos'
      );
    });

    test('debe manejar request vacío', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty(
        'error',
        'Email y contraseña son requeridos'
      );
    });
  });

  describe('POST /api/auth/register', () => {
    test('debe registrar nuevo usuario', async () => {
      const newUser = createMockUser({
        email: 'newuser@test.com',
        password: 'password123',
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send(newUser)
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      validateUserStructure(response.body.user);
      expect(response.body.user.email).toBe('newuser@test.com');
    });

    test('debe rechazar email duplicado', async () => {
      const existingUser = createMockUser({
        email: 'admin@test.com',
        password: 'password123',
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send(existingUser)
        .expect(409);

      expect(response.body).toHaveProperty('error', 'El usuario ya existe');
    });

    test('debe requerir contraseña con mínimo 6 caracteres', async () => {
      const userWithWeakPassword = createMockUser({
        email: 'newuser2@test.com',
        password: '123',
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send(userWithWeakPassword)
        .expect(400);

      expect(response.body).toHaveProperty(
        'error',
        'La contraseña debe tener al menos 6 caracteres'
      );
    });

    test('debe asignar rol por defecto', async () => {
      const newUser = createMockUser({
        email: 'newuser3@test.com',
        password: 'password123',
      });
      delete newUser.role;

      const response = await request(app)
        .post('/api/auth/register')
        .send(newUser)
        .expect(201);

      expect(response.body.user.role).toBe('user');
    });
  });
});
```

### Paso 4: Tests de productos

```javascript
// src/tests/products.test.js
const request = require('supertest');
const app = require('../server');
const {
  tokens,
  createAuthHeader,
  createMockProduct,
  validateProductStructure,
} = require('./helpers/testHelpers');

describe('Products API', () => {
  describe('GET /api/products', () => {
    test('debe obtener lista de productos', async () => {
      const response = await request(app).get('/api/products').expect(200);

      expect(response.body).toHaveProperty('products');
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('limit');
      expect(response.body).toHaveProperty('totalPages');
      expect(Array.isArray(response.body.products)).toBe(true);

      if (response.body.products.length > 0) {
        validateProductStructure(response.body.products[0]);
      }
    });

    test('debe soportar búsqueda por nombre', async () => {
      const response = await request(app)
        .get('/api/products?search=Producto')
        .expect(200);

      expect(response.body.products.length).toBeGreaterThan(0);
      response.body.products.forEach(product => {
        expect(product.name.toLowerCase()).toContain('producto');
      });
    });

    test('debe soportar paginación', async () => {
      const response = await request(app)
        .get('/api/products?page=1&limit=1')
        .expect(200);

      expect(response.body.products.length).toBeLessThanOrEqual(1);
      expect(response.body.page).toBe(1);
      expect(response.body.limit).toBe(1);
    });

    test('debe manejar página vacía', async () => {
      const response = await request(app)
        .get('/api/products?page=999&limit=10')
        .expect(200);

      expect(response.body.products.length).toBe(0);
    });

    test('debe manejar búsqueda sin resultados', async () => {
      const response = await request(app)
        .get('/api/products?search=ProductoInexistente')
        .expect(200);

      expect(response.body.products.length).toBe(0);
      expect(response.body.total).toBe(0);
    });
  });

  describe('GET /api/products/:id', () => {
    test('debe obtener producto por ID', async () => {
      const response = await request(app).get('/api/products/1').expect(200);

      validateProductStructure(response.body);
      expect(response.body.id).toBe(1);
    });

    test('debe retornar 404 para producto inexistente', async () => {
      const response = await request(app).get('/api/products/999').expect(404);

      expect(response.body).toHaveProperty('error', 'Producto no encontrado');
    });

    test('debe manejar ID inválido', async () => {
      const response = await request(app).get('/api/products/abc').expect(404);

      expect(response.body).toHaveProperty('error', 'Producto no encontrado');
    });
  });

  describe('POST /api/products', () => {
    test('debe crear producto con token válido', async () => {
      const newProduct = createMockProduct({
        name: 'Producto Nuevo',
        price: 39.99,
        stock: 15,
      });

      const response = await request(app)
        .post('/api/products')
        .set(createAuthHeader(tokens.admin))
        .send(newProduct)
        .expect(201);

      validateProductStructure(response.body);
      expect(response.body.name).toBe('Producto Nuevo');
      expect(response.body.price).toBe(39.99);
      expect(response.body.stock).toBe(15);
    });

    test('debe rechazar request sin token', async () => {
      const newProduct = createMockProduct();

      const response = await request(app)
        .post('/api/products')
        .send(newProduct)
        .expect(401);

      expect(response.body).toHaveProperty(
        'error',
        'Token de acceso requerido'
      );
    });

    test('debe rechazar token inválido', async () => {
      const newProduct = createMockProduct();

      const response = await request(app)
        .post('/api/products')
        .set(createAuthHeader('invalid-token'))
        .send(newProduct)
        .expect(403);

      expect(response.body).toHaveProperty('error', 'Token inválido');
    });

    test('debe requerir nombre y precio', async () => {
      const response = await request(app)
        .post('/api/products')
        .set(createAuthHeader(tokens.admin))
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty(
        'error',
        'Nombre y precio son requeridos'
      );
    });

    test('debe rechazar precio negativo', async () => {
      const invalidProduct = createMockProduct({
        name: 'Producto Inválido',
        price: -10,
      });

      const response = await request(app)
        .post('/api/products')
        .set(createAuthHeader(tokens.admin))
        .send(invalidProduct)
        .expect(400);

      expect(response.body).toHaveProperty(
        'error',
        'El precio debe ser positivo'
      );
    });

    test('debe asignar stock por defecto', async () => {
      const productWithoutStock = {
        name: 'Producto Sin Stock',
        price: 19.99,
      };

      const response = await request(app)
        .post('/api/products')
        .set(createAuthHeader(tokens.admin))
        .send(productWithoutStock)
        .expect(201);

      expect(response.body.stock).toBe(0);
    });
  });

  describe('PUT /api/products/:id', () => {
    test('debe actualizar producto propio', async () => {
      const updates = {
        name: 'Producto Actualizado',
        price: 49.99,
        stock: 20,
      };

      const response = await request(app)
        .put('/api/products/1')
        .set(createAuthHeader(tokens.admin))
        .send(updates)
        .expect(200);

      expect(response.body.name).toBe('Producto Actualizado');
      expect(response.body.price).toBe(49.99);
      expect(response.body.stock).toBe(20);
    });

    test('debe rechazar actualización sin permisos', async () => {
      const updates = {
        name: 'Producto Actualizado',
        price: 49.99,
      };

      const response = await request(app)
        .put('/api/products/1')
        .set(createAuthHeader(tokens.user))
        .send(updates)
        .expect(403);

      expect(response.body).toHaveProperty(
        'error',
        'No tienes permisos para editar este producto'
      );
    });

    test('debe permitir actualización por admin', async () => {
      const updates = {
        name: 'Producto Actualizado por Admin',
        price: 59.99,
      };

      const response = await request(app)
        .put('/api/products/2')
        .set(createAuthHeader(tokens.admin))
        .send(updates)
        .expect(200);

      expect(response.body.name).toBe('Producto Actualizado por Admin');
    });

    test('debe retornar 404 para producto inexistente', async () => {
      const response = await request(app)
        .put('/api/products/999')
        .set(createAuthHeader(tokens.admin))
        .send({ name: 'Producto Inexistente' })
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Producto no encontrado');
    });
  });

  describe('DELETE /api/products/:id', () => {
    test('debe eliminar producto propio', async () => {
      const response = await request(app)
        .delete('/api/products/1')
        .set(createAuthHeader(tokens.admin))
        .expect(200);

      expect(response.body).toHaveProperty(
        'message',
        'Producto eliminado exitosamente'
      );
    });

    test('debe rechazar eliminación sin permisos', async () => {
      const response = await request(app)
        .delete('/api/products/2')
        .set(createAuthHeader(tokens.user))
        .expect(403);

      expect(response.body).toHaveProperty(
        'error',
        'No tienes permisos para eliminar este producto'
      );
    });

    test('debe retornar 404 para producto inexistente', async () => {
      const response = await request(app)
        .delete('/api/products/999')
        .set(createAuthHeader(tokens.admin))
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Producto no encontrado');
    });
  });
});
```

### Paso 5: Tests de integración end-to-end

```javascript
// src/tests/integration.test.js
const request = require('supertest');
const app = require('../server');
const { createMockUser, createMockProduct } = require('./helpers/testHelpers');

describe('Integration Tests', () => {
  let userToken;
  let productId;

  test('Flujo completo: registro -> login -> crear producto -> listar productos', async () => {
    // 1. Registrar usuario
    const newUser = createMockUser({
      email: 'integration@test.com',
      password: 'password123',
    });

    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send(newUser)
      .expect(201);

    expect(registerResponse.body).toHaveProperty('token');
    userToken = registerResponse.body.token;

    // 2. Login (opcional, pero verificamos que funciona)
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: newUser.email,
        password: newUser.password,
      })
      .expect(200);

    expect(loginResponse.body).toHaveProperty('token');

    // 3. Crear producto
    const newProduct = createMockProduct({
      name: 'Producto Integración',
      price: 99.99,
      stock: 50,
    });

    const createProductResponse = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${userToken}`)
      .send(newProduct)
      .expect(201);

    expect(createProductResponse.body.name).toBe('Producto Integración');
    productId = createProductResponse.body.id;

    // 4. Listar productos y verificar que aparece
    const listResponse = await request(app).get('/api/products').expect(200);

    const createdProduct = listResponse.body.products.find(
      p => p.id === productId
    );
    expect(createdProduct).toBeDefined();
    expect(createdProduct.name).toBe('Producto Integración');

    // 5. Obtener producto específico
    const getProductResponse = await request(app)
      .get(`/api/products/${productId}`)
      .expect(200);

    expect(getProductResponse.body.name).toBe('Producto Integración');

    // 6. Actualizar producto
    const updateResponse = await request(app)
      .put(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Producto Actualizado' })
      .expect(200);

    expect(updateResponse.body.name).toBe('Producto Actualizado');

    // 7. Eliminar producto
    await request(app)
      .delete(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    // 8. Verificar que fue eliminado
    await request(app).get(`/api/products/${productId}`).expect(404);
  });

  test('Flujo de error: credenciales inválidas -> crear producto sin auth', async () => {
    // 1. Intentar login con credenciales inválidas
    await request(app)
      .post('/api/auth/login')
      .send({
        email: 'invalid@test.com',
        password: 'wrongpassword',
      })
      .expect(401);

    // 2. Intentar crear producto sin token
    const newProduct = createMockProduct();
    await request(app).post('/api/products').send(newProduct).expect(401);

    // 3. Intentar crear producto con token inválido
    await request(app)
      .post('/api/products')
      .set('Authorization', 'Bearer invalid-token')
      .send(newProduct)
      .expect(403);
  });

  test('Flujo de búsqueda y paginación', async () => {
    // 1. Crear múltiples productos para testing
    const products = [
      { name: 'Laptop HP', price: 1200, stock: 5 },
      { name: 'Mouse Logitech', price: 25, stock: 20 },
      { name: 'Teclado Mecánico', price: 150, stock: 10 },
    ];

    for (const product of products) {
      await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${userToken}`)
        .send(product)
        .expect(201);
    }

    // 2. Buscar productos por nombre
    const searchResponse = await request(app)
      .get('/api/products?search=Laptop')
      .expect(200);

    expect(searchResponse.body.products.length).toBeGreaterThan(0);
    expect(searchResponse.body.products[0].name).toContain('Laptop');

    // 3. Probar paginación
    const paginationResponse = await request(app)
      .get('/api/products?page=1&limit=2')
      .expect(200);

    expect(paginationResponse.body.products.length).toBeLessThanOrEqual(2);
    expect(paginationResponse.body.page).toBe(1);
    expect(paginationResponse.body.limit).toBe(2);
  });
});
```

### Paso 6: Tests con mocks de servicios externos

```javascript
// src/tests/external-services.test.js
const request = require('supertest');
const nock = require('nock');
const app = require('../server');
const { tokens, createAuthHeader } = require('./helpers/testHelpers');

describe('External Services Integration', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  test('debe mockear servicio de validación de productos', async () => {
    // Mock del servicio externo
    nock('https://api.product-validator.com')
      .post('/validate')
      .reply(200, { valid: true, score: 95 });

    // Modificar temporalmente el servidor para incluir validación externa
    const originalCreate = app._router.stack.find(
      layer =>
        layer.route &&
        layer.route.path === '/api/products' &&
        layer.route.methods.post
    );

    // Este es un ejemplo conceptual - en práctica modificarías el código del servidor
    const mockProduct = {
      name: 'Producto Validado',
      price: 29.99,
      stock: 10,
    };

    const response = await request(app)
      .post('/api/products')
      .set(createAuthHeader(tokens.admin))
      .send(mockProduct)
      .expect(201);

    expect(response.body.name).toBe('Producto Validado');
  });

  test('debe manejar error en servicio externo', async () => {
    // Mock del servicio externo con error
    nock('https://api.product-validator.com')
      .post('/validate')
      .reply(500, { error: 'Service unavailable' });

    // En un escenario real, el servidor debería manejar este error
    const mockProduct = {
      name: 'Producto con Error',
      price: 29.99,
      stock: 10,
    };

    const response = await request(app)
      .post('/api/products')
      .set(createAuthHeader(tokens.admin))
      .send(mockProduct)
      .expect(201); // Debería crear el producto a pesar del error del servicio

    expect(response.body.name).toBe('Producto con Error');
  });
});
```

### Paso 7: Tests de performance y timeout

```javascript
// src/tests/performance.test.js
const request = require('supertest');
const app = require('../server');

describe('Performance Tests', () => {
  test('debe responder en menos de 1 segundo', async () => {
    const start = Date.now();

    await request(app).get('/api/products').expect(200);

    const duration = Date.now() - start;
    expect(duration).toBeLessThan(1000);
  });

  test('debe manejar múltiples requests concurrentes', async () => {
    const promises = Array(10)
      .fill()
      .map(() => request(app).get('/api/products').expect(200));

    const results = await Promise.all(promises);

    results.forEach(result => {
      expect(result.body).toHaveProperty('products');
    });
  });

  test('debe manejar timeout en requests largos', async () => {
    // Este test simula un timeout configurando un timeout corto
    const response = await request(app)
      .get('/api/products')
      .timeout(5000) // 5 segundos
      .expect(200);

    expect(response.body).toHaveProperty('products');
  }, 10000); // Jest timeout de 10 segundos
});
```

## 📊 Verificación

### Ejecutar tests de API

```bash
npm test -- --testPathPattern="tests"
```

### Ejecutar tests específicos

```bash
npm test -- --testNamePattern="auth"
npm test -- --testNamePattern="products"
npm test -- --testNamePattern="integration"
```

### Ejecutar con coverage

```bash
npm run test:coverage -- --testPathPattern="tests"
```

### Ejecutar tests en modo watch

```bash
npm run test:watch -- --testPathPattern="tests"
```

## 🎯 Criterios de Evaluación

### Tests de API Básicos (30 puntos)

- [ ] Tests de autenticación completos (15 pts)
- [ ] Tests de CRUD de productos (15 pts)

### Tests de Integración (30 puntos)

- [ ] Flujo end-to-end completo (15 pts)
- [ ] Tests de error handling (10 pts)
- [ ] Tests de autorización (5 pts)

### Tests Avanzados (25 puntos)

- [ ] Mocking de servicios externos (10 pts)
- [ ] Tests de performance (8 pts)
- [ ] Validación de schemas (7 pts)

### Calidad y Cobertura (15 puntos)

- [ ] Coverage > 85% (8 pts)
- [ ] Tests bien organizados (4 pts)
- [ ] Helpers y utilities (3 pts)

## 📚 Recursos Adicionales

- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Nock for HTTP Mocking](https://github.com/nock/nock)
- [Jest Async Testing](https://jestjs.io/docs/asynchronous)
- [API Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices#section-4-measuring-test-quality)
