// routes/products.js
// Rutas de productos con control de acceso y validaciones

const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { validateInput } = require('../middleware/validation');
const { rateLimitByRole } = require('../middleware/rateLimit');

/**
 * Rutas de productos
 * - CRUD completo con validaciones
 * - Control de acceso por roles
 * - Rate limiting diferenciado
 * - Validaciones de entrada
 */

// Aplicar rate limiting diferenciado por rol
router.use(
  rateLimitByRole({
    user: { windowMs: 15 * 60 * 1000, max: 50 },
    admin: { windowMs: 15 * 60 * 1000, max: 200 },
  })
);

/**
 * @route   GET /api/products
 * @desc    Obtener todos los productos con paginación y filtros
 * @access  Public
 */
router.get('/', productsController.getAllProducts);

/**
 * @route   GET /api/products/stats
 * @desc    Obtener estadísticas de productos
 * @access  Private (Admin only)
 */
router.get(
  '/stats',
  [authenticateToken, requireRole('admin')],
  productsController.getProductStats
);

/**
 * @route   GET /api/products/category/:category
 * @desc    Obtener productos por categoría
 * @access  Public
 */
router.get('/category/:category', productsController.getProductsByCategory);

/**
 * @route   GET /api/products/:id
 * @desc    Obtener producto por ID
 * @access  Public
 */
router.get('/:id', productsController.getProductById);

/**
 * @route   POST /api/products
 * @desc    Crear nuevo producto
 * @access  Private
 */
router.post(
  '/',
  [
    authenticateToken,
    validateInput([
      { field: 'name', type: 'string', required: true, min: 3, max: 100 },
      { field: 'description', type: 'string', required: false, max: 500 },
      { field: 'price', type: 'number', required: true, min: 0.01 },
      { field: 'category', type: 'string', required: true, min: 3, max: 50 },
      { field: 'stock', type: 'number', required: false, min: 0 },
    ]),
  ],
  productsController.createProduct
);

/**
 * @route   PUT /api/products/:id
 * @desc    Actualizar producto
 * @access  Private (Owner or Admin)
 */
router.put(
  '/:id',
  [
    authenticateToken,
    validateInput([
      { field: 'name', type: 'string', required: false, min: 3, max: 100 },
      { field: 'description', type: 'string', required: false, max: 500 },
      { field: 'price', type: 'number', required: false, min: 0.01 },
      { field: 'category', type: 'string', required: false, min: 3, max: 50 },
      { field: 'stock', type: 'number', required: false, min: 0 },
    ]),
  ],
  productsController.updateProduct
);

/**
 * @route   DELETE /api/products/:id
 * @desc    Eliminar producto
 * @access  Private (Owner or Admin)
 */
router.delete('/:id', authenticateToken, productsController.deleteProduct);

/**
 * @route   PATCH /api/products/:id/stock
 * @desc    Actualizar stock de producto
 * @access  Private (Owner or Admin)
 */
router.patch(
  '/:id/stock',
  [
    authenticateToken,
    validateInput([{ field: 'stock', type: 'number', required: true, min: 0 }]),
  ],
  async (req, res) => {
    try {
      const { id } = req.params;
      const { stock } = req.body;
      const userId = req.user.id;
      const userRole = req.user.role;

      // Validar ID
      if (!id || isNaN(id)) {
        return res.status(400).json({
          error: 'ID inválido',
          message: 'El ID del producto debe ser un número válido',
        });
      }

      const database = require('../config/database');

      // Verificar que el producto existe
      const existingProduct = await database.get(
        'SELECT id, name, user_id FROM products WHERE id = ?',
        [id]
      );

      if (!existingProduct) {
        return res.status(404).json({
          error: 'Producto no encontrado',
          message: 'No se encontró un producto con ese ID',
        });
      }

      // Verificar permisos
      if (userRole !== 'admin' && existingProduct.user_id !== userId) {
        return res.status(403).json({
          error: 'Sin permisos',
          message: 'No tienes permisos para modificar este producto',
        });
      }

      // Actualizar stock
      await database.run(
        'UPDATE products SET stock = ?, updated_at = datetime("now") WHERE id = ?',
        [stock, id]
      );

      // Obtener producto actualizado
      const updatedProduct = await database.get(
        'SELECT id, name, description, price, category, stock, created_at FROM products WHERE id = ?',
        [id]
      );

      res.json({
        success: true,
        message: 'Stock actualizado exitosamente',
        data: updatedProduct,
      });
    } catch (error) {
      console.error('Error al actualizar stock:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'Error al actualizar stock',
      });
    }
  }
);

/**
 * @route   GET /api/products/user/:userId
 * @desc    Obtener productos de un usuario específico
 * @access  Private (Self or Admin)
 */
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const requestUserId = req.user.id;
    const userRole = req.user.role;

    // Validar ID
    if (!userId || isNaN(userId)) {
      return res.status(400).json({
        error: 'ID inválido',
        message: 'El ID del usuario debe ser un número válido',
      });
    }

    // Verificar permisos (solo puede ver sus propios productos o admin)
    if (userRole !== 'admin' && parseInt(userId) !== requestUserId) {
      return res.status(403).json({
        error: 'Sin permisos',
        message: 'No tienes permisos para ver productos de otro usuario',
      });
    }

    const { page = 1, limit = 10 } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const offset = (pageNum - 1) * limitNum;

    const database = require('../config/database');

    // Obtener productos del usuario
    const [products, totalResult] = await Promise.all([
      database.all(
        'SELECT id, name, description, price, category, stock, created_at FROM products WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
        [userId, limitNum, offset]
      ),
      database.get('SELECT COUNT(*) as total FROM products WHERE user_id = ?', [
        userId,
      ]),
    ]);

    const total = totalResult.total;
    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: products,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalItems: total,
        itemsPerPage: limitNum,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1,
      },
    });
  } catch (error) {
    console.error('Error al obtener productos del usuario:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al obtener productos del usuario',
    });
  }
});

/**
 * @route   GET /api/products/search/:term
 * @desc    Buscar productos por término
 * @access  Public
 */
router.get('/search/:term', async (req, res) => {
  try {
    const { term } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Validar término de búsqueda
    if (!term || term.trim().length < 2) {
      return res.status(400).json({
        error: 'Término inválido',
        message: 'El término de búsqueda debe tener al menos 2 caracteres',
      });
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const offset = (pageNum - 1) * limitNum;

    const database = require('../config/database');
    const { sanitizeInput } = require('../utils/validation');

    const sanitizedTerm = sanitizeInput(term);
    const searchTerm = `%${sanitizedTerm}%`;

    // Buscar productos
    const [products, totalResult] = await Promise.all([
      database.all(
        'SELECT id, name, description, price, category, stock, created_at FROM products WHERE name LIKE ? OR description LIKE ? OR category LIKE ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
        [searchTerm, searchTerm, searchTerm, limitNum, offset]
      ),
      database.get(
        'SELECT COUNT(*) as total FROM products WHERE name LIKE ? OR description LIKE ? OR category LIKE ?',
        [searchTerm, searchTerm, searchTerm]
      ),
    ]);

    const total = totalResult.total;
    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: products,
      searchTerm: sanitizedTerm,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalItems: total,
        itemsPerPage: limitNum,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1,
      },
    });
  } catch (error) {
    console.error('Error en búsqueda:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al buscar productos',
    });
  }
});

module.exports = router;
