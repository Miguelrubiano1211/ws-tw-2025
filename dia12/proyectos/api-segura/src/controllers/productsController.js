// controllers/productsController.js
// Controlador de productos con validaciones de seguridad

const database = require('../config/database');
const { validateProductData, sanitizeInput } = require('../utils/validation');
const { logSecurityEvent } = require('../utils/logger');

/**
 * Controlador de productos
 * - CRUD completo con validaciones
 * - Sanitización de entradas
 * - Control de acceso por roles
 * - Logging de actividades
 */

class ProductsController {
  /**
   * Obtener todos los productos con paginación y filtros
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async getAllProducts(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        category,
        search,
        sortBy = 'created_at',
        sortOrder = 'DESC',
      } = req.query;

      // Validar parámetros de paginación
      const pageNum = Math.max(1, parseInt(page));
      const limitNum = Math.min(50, Math.max(1, parseInt(limit))); // Máximo 50 items por página
      const offset = (pageNum - 1) * limitNum;

      // Validar campo de ordenamiento
      const validSortFields = ['id', 'name', 'price', 'category', 'created_at'];
      const validSortOrder = ['ASC', 'DESC'];

      const sortField = validSortFields.includes(sortBy)
        ? sortBy
        : 'created_at';
      const sortDirection = validSortOrder.includes(sortOrder.toUpperCase())
        ? sortOrder.toUpperCase()
        : 'DESC';

      // Construir query base
      let query =
        'SELECT id, name, description, price, category, stock, created_at FROM products WHERE 1=1';
      let countQuery = 'SELECT COUNT(*) as total FROM products WHERE 1=1';
      let params = [];

      // Filtro por categoría
      if (category) {
        query += ' AND category = ?';
        countQuery += ' AND category = ?';
        params.push(sanitizeInput(category));
      }

      // Filtro por búsqueda
      if (search) {
        query += ' AND (name LIKE ? OR description LIKE ?)';
        countQuery += ' AND (name LIKE ? OR description LIKE ?)';
        const searchTerm = `%${sanitizeInput(search)}%`;
        params.push(searchTerm, searchTerm);
      }

      // Agregar ordenamiento y paginación
      query += ` ORDER BY ${sortField} ${sortDirection} LIMIT ? OFFSET ?`;

      // Ejecutar queries
      const [products, totalResult] = await Promise.all([
        database.all(query, [...params, limitNum, offset]),
        database.get(countQuery, params),
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
      console.error('Error al obtener productos:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'Error al obtener productos',
      });
    }
  }

  /**
   * Obtener producto por ID
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async getProductById(req, res) {
    try {
      const { id } = req.params;

      // Validar ID
      if (!id || isNaN(id)) {
        return res.status(400).json({
          error: 'ID inválido',
          message: 'El ID del producto debe ser un número válido',
        });
      }

      const product = await database.get(
        'SELECT id, name, description, price, category, stock, created_at FROM products WHERE id = ?',
        [id]
      );

      if (!product) {
        return res.status(404).json({
          error: 'Producto no encontrado',
          message: 'No se encontró un producto con ese ID',
        });
      }

      res.json({
        success: true,
        data: product,
      });
    } catch (error) {
      console.error('Error al obtener producto:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'Error al obtener producto',
      });
    }
  }

  /**
   * Crear nuevo producto
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async createProduct(req, res) {
    try {
      const { name, description, price, category, stock = 0 } = req.body;
      const userId = req.user.id;

      // Validar datos del producto
      const validation = validateProductData({
        name,
        description,
        price,
        category,
        stock,
      });
      if (!validation.isValid) {
        return res.status(400).json({
          error: 'Datos inválidos',
          message: 'Los datos del producto no son válidos',
          errors: validation.errors,
        });
      }

      // Sanitizar datos
      const sanitizedData = {
        name: sanitizeInput(name),
        description: description ? sanitizeInput(description) : null,
        price: parseFloat(price),
        category: sanitizeInput(category),
        stock: parseInt(stock),
      };

      // Verificar que no exista un producto con el mismo nombre
      const existingProduct = await database.get(
        'SELECT id FROM products WHERE name = ?',
        [sanitizedData.name]
      );

      if (existingProduct) {
        return res.status(409).json({
          error: 'Producto existente',
          message: 'Ya existe un producto con ese nombre',
        });
      }

      // Crear producto
      const result = await database.run(
        'INSERT INTO products (name, description, price, category, stock, user_id) VALUES (?, ?, ?, ?, ?, ?)',
        [
          sanitizedData.name,
          sanitizedData.description,
          sanitizedData.price,
          sanitizedData.category,
          sanitizedData.stock,
          userId,
        ]
      );

      // Obtener producto creado
      const newProduct = await database.get(
        'SELECT id, name, description, price, category, stock, created_at FROM products WHERE id = ?',
        [result.id]
      );

      // Log del evento
      logSecurityEvent('PRODUCT_CREATED', {
        userId: userId,
        productId: newProduct.id,
        productName: newProduct.name,
        ip: req.ip,
      });

      res.status(201).json({
        success: true,
        message: 'Producto creado exitosamente',
        data: newProduct,
      });
    } catch (error) {
      console.error('Error al crear producto:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'Error al crear producto',
      });
    }
  }

  /**
   * Actualizar producto
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const { name, description, price, category, stock } = req.body;
      const userId = req.user.id;
      const userRole = req.user.role;

      // Validar ID
      if (!id || isNaN(id)) {
        return res.status(400).json({
          error: 'ID inválido',
          message: 'El ID del producto debe ser un número válido',
        });
      }

      // Verificar que el producto existe
      const existingProduct = await database.get(
        'SELECT id, user_id FROM products WHERE id = ?',
        [id]
      );

      if (!existingProduct) {
        return res.status(404).json({
          error: 'Producto no encontrado',
          message: 'No se encontró un producto con ese ID',
        });
      }

      // Verificar permisos (solo el creador o admin puede editar)
      if (userRole !== 'admin' && existingProduct.user_id !== userId) {
        return res.status(403).json({
          error: 'Sin permisos',
          message: 'No tienes permisos para editar este producto',
        });
      }

      // Validar datos si se proporcionan
      const updateData = {};
      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (price !== undefined) updateData.price = price;
      if (category !== undefined) updateData.category = category;
      if (stock !== undefined) updateData.stock = stock;

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
          error: 'Sin datos',
          message: 'No se proporcionaron datos para actualizar',
        });
      }

      const validation = validateProductData(updateData, true); // true para actualización parcial
      if (!validation.isValid) {
        return res.status(400).json({
          error: 'Datos inválidos',
          message: 'Los datos del producto no son válidos',
          errors: validation.errors,
        });
      }

      // Sanitizar datos
      const sanitizedData = {};
      if (updateData.name) sanitizedData.name = sanitizeInput(updateData.name);
      if (updateData.description)
        sanitizedData.description = sanitizeInput(updateData.description);
      if (updateData.price) sanitizedData.price = parseFloat(updateData.price);
      if (updateData.category)
        sanitizedData.category = sanitizeInput(updateData.category);
      if (updateData.stock !== undefined)
        sanitizedData.stock = parseInt(updateData.stock);

      // Construir query de actualización
      const setClause = Object.keys(sanitizedData)
        .map(key => `${key} = ?`)
        .join(', ');
      const values = Object.values(sanitizedData);

      await database.run(
        `UPDATE products SET ${setClause}, updated_at = datetime("now") WHERE id = ?`,
        [...values, id]
      );

      // Obtener producto actualizado
      const updatedProduct = await database.get(
        'SELECT id, name, description, price, category, stock, created_at FROM products WHERE id = ?',
        [id]
      );

      // Log del evento
      logSecurityEvent('PRODUCT_UPDATED', {
        userId: userId,
        productId: id,
        productName: updatedProduct.name,
        updatedFields: Object.keys(sanitizedData),
        ip: req.ip,
      });

      res.json({
        success: true,
        message: 'Producto actualizado exitosamente',
        data: updatedProduct,
      });
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'Error al actualizar producto',
      });
    }
  }

  /**
   * Eliminar producto
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRole = req.user.role;

      // Validar ID
      if (!id || isNaN(id)) {
        return res.status(400).json({
          error: 'ID inválido',
          message: 'El ID del producto debe ser un número válido',
        });
      }

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

      // Verificar permisos (solo el creador o admin puede eliminar)
      if (userRole !== 'admin' && existingProduct.user_id !== userId) {
        return res.status(403).json({
          error: 'Sin permisos',
          message: 'No tienes permisos para eliminar este producto',
        });
      }

      // Eliminar producto
      await database.run('DELETE FROM products WHERE id = ?', [id]);

      // Log del evento
      logSecurityEvent('PRODUCT_DELETED', {
        userId: userId,
        productId: id,
        productName: existingProduct.name,
        ip: req.ip,
      });

      res.json({
        success: true,
        message: 'Producto eliminado exitosamente',
      });
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'Error al eliminar producto',
      });
    }
  }

  /**
   * Obtener productos por categoría
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async getProductsByCategory(req, res) {
    try {
      const { category } = req.params;
      const { page = 1, limit = 10 } = req.query;

      // Validar categoría
      if (!category) {
        return res.status(400).json({
          error: 'Categoría requerida',
          message: 'La categoría es requerida',
        });
      }

      const pageNum = Math.max(1, parseInt(page));
      const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
      const offset = (pageNum - 1) * limitNum;

      const sanitizedCategory = sanitizeInput(category);

      // Obtener productos y total
      const [products, totalResult] = await Promise.all([
        database.all(
          'SELECT id, name, description, price, category, stock, created_at FROM products WHERE category = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
          [sanitizedCategory, limitNum, offset]
        ),
        database.get(
          'SELECT COUNT(*) as total FROM products WHERE category = ?',
          [sanitizedCategory]
        ),
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
      console.error('Error al obtener productos por categoría:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'Error al obtener productos por categoría',
      });
    }
  }

  /**
   * Obtener estadísticas de productos (solo admin)
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async getProductStats(req, res) {
    try {
      // Verificar que el usuario sea admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          error: 'Sin permisos',
          message: 'Solo los administradores pueden ver las estadísticas',
        });
      }

      const [totalProducts, productsByCategory, averagePrice] =
        await Promise.all([
          database.get('SELECT COUNT(*) as total FROM products'),
          database.all(
            'SELECT category, COUNT(*) as count FROM products GROUP BY category'
          ),
          database.get('SELECT AVG(price) as average FROM products'),
        ]);

      res.json({
        success: true,
        data: {
          totalProducts: totalProducts.total,
          productsByCategory: productsByCategory,
          averagePrice: averagePrice.average || 0,
        },
      });
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'Error al obtener estadísticas',
      });
    }
  }
}

module.exports = new ProductsController();
