// models/Product.js
// Modelo de producto con validaciones y métodos de consulta

const database = require('../config/database');

/**
 * Modelo de Producto
 * - Validaciones de datos
 * - Métodos de consulta
 * - Gestión de stock
 * - Métodos de búsqueda
 */

class Product {
  constructor(data) {
    this.id = data.id || null;
    this.name = data.name || null;
    this.description = data.description || null;
    this.price = data.price || null;
    this.category = data.category || null;
    this.stock = data.stock || 0;
    this.user_id = data.user_id || null;
    this.created_at = data.created_at || null;
    this.updated_at = data.updated_at || null;
  }

  /**
   * Crear nuevo producto
   * @param {Object} productData - Datos del producto
   * @returns {Promise<Product>} - Producto creado
   */
  static async create(productData) {
    const {
      name,
      description,
      price,
      category,
      stock = 0,
      user_id,
    } = productData;

    // Validar datos requeridos
    if (!name || !price || !category) {
      throw new Error('Name, price y category son requeridos');
    }

    if (price <= 0) {
      throw new Error('El precio debe ser mayor a 0');
    }

    if (stock < 0) {
      throw new Error('El stock no puede ser negativo');
    }

    // Insertar producto
    const result = await database.run(
      'INSERT INTO products (name, description, price, category, stock, user_id) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, parseFloat(price), category, parseInt(stock), user_id]
    );

    // Retornar producto creado
    return await Product.findById(result.id);
  }

  /**
   * Buscar producto por ID
   * @param {number} id - ID del producto
   * @returns {Promise<Product|null>} - Producto encontrado o null
   */
  static async findById(id) {
    const productData = await database.get(
      'SELECT id, name, description, price, category, stock, user_id, created_at, updated_at FROM products WHERE id = ?',
      [id]
    );

    return productData ? new Product(productData) : null;
  }

  /**
   * Buscar producto por nombre
   * @param {string} name - Nombre del producto
   * @returns {Promise<Product|null>} - Producto encontrado o null
   */
  static async findByName(name) {
    const productData = await database.get(
      'SELECT id, name, description, price, category, stock, user_id, created_at, updated_at FROM products WHERE name = ?',
      [name]
    );

    return productData ? new Product(productData) : null;
  }

  /**
   * Obtener todos los productos con paginación y filtros
   * @param {Object} options - Opciones de consulta
   * @returns {Promise<Object>} - Productos paginados
   */
  static async findAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      category = null,
      search = null,
      sortBy = 'created_at',
      sortOrder = 'DESC',
      user_id = null,
    } = options;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const offset = (pageNum - 1) * limitNum;

    // Validar campo de ordenamiento
    const validSortFields = [
      'id',
      'name',
      'price',
      'category',
      'stock',
      'created_at',
    ];
    const validSortOrder = ['ASC', 'DESC'];

    const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at';
    const sortDirection = validSortOrder.includes(sortOrder.toUpperCase())
      ? sortOrder.toUpperCase()
      : 'DESC';

    let query =
      'SELECT id, name, description, price, category, stock, user_id, created_at, updated_at FROM products WHERE 1=1';
    let countQuery = 'SELECT COUNT(*) as total FROM products WHERE 1=1';
    let params = [];

    // Filtro por categoría
    if (category) {
      query += ' AND category = ?';
      countQuery += ' AND category = ?';
      params.push(category);
    }

    // Filtro por usuario
    if (user_id) {
      query += ' AND user_id = ?';
      countQuery += ' AND user_id = ?';
      params.push(user_id);
    }

    // Filtro por búsqueda
    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ?)';
      countQuery += ' AND (name LIKE ? OR description LIKE ?)';
      const searchTerm = `%${search}%`;
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

    return {
      products: products.map(productData => new Product(productData)),
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalItems: total,
        itemsPerPage: limitNum,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1,
      },
    };
  }

  /**
   * Buscar productos por categoría
   * @param {string} category - Categoría de productos
   * @param {Object} options - Opciones de consulta
   * @returns {Promise<Object>} - Productos paginados
   */
  static async findByCategory(category, options = {}) {
    return await Product.findAll({
      ...options,
      category: category,
    });
  }

  /**
   * Buscar productos por texto
   * @param {string} searchTerm - Término de búsqueda
   * @param {Object} options - Opciones de consulta
   * @returns {Promise<Object>} - Productos paginados
   */
  static async search(searchTerm, options = {}) {
    return await Product.findAll({
      ...options,
      search: searchTerm,
    });
  }

  /**
   * Obtener productos por usuario
   * @param {number} userId - ID del usuario
   * @param {Object} options - Opciones de consulta
   * @returns {Promise<Object>} - Productos paginados
   */
  static async findByUser(userId, options = {}) {
    return await Product.findAll({
      ...options,
      user_id: userId,
    });
  }

  /**
   * Obtener categorías disponibles
   * @returns {Promise<Array>} - Lista de categorías
   */
  static async getCategories() {
    const categories = await database.all(
      'SELECT category, COUNT(*) as count FROM products GROUP BY category ORDER BY category'
    );

    return categories;
  }

  /**
   * Obtener estadísticas de productos
   * @returns {Promise<Object>} - Estadísticas
   */
  static async getStats() {
    const [totalProducts, totalValue, avgPrice, categoryStats] =
      await Promise.all([
        database.get('SELECT COUNT(*) as total FROM products'),
        database.get('SELECT SUM(price * stock) as total FROM products'),
        database.get('SELECT AVG(price) as average FROM products'),
        database.all(
          'SELECT category, COUNT(*) as count, AVG(price) as avgPrice FROM products GROUP BY category'
        ),
      ]);

    return {
      totalProducts: totalProducts.total,
      totalValue: totalValue.total || 0,
      averagePrice: avgPrice.average || 0,
      categoryStats: categoryStats,
    };
  }

  /**
   * Verificar si existe un producto con el mismo nombre
   * @param {string} name - Nombre del producto
   * @param {number} excludeId - ID a excluir de la búsqueda
   * @returns {Promise<boolean>} - True si existe
   */
  static async exists(name, excludeId = null) {
    let query = 'SELECT id FROM products WHERE name = ?';
    let params = [name];

    if (excludeId) {
      query += ' AND id != ?';
      params.push(excludeId);
    }

    const existing = await database.get(query, params);
    return !!existing;
  }

  /**
   * Actualizar producto
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<Product>} - Producto actualizado
   */
  async update(updateData) {
    if (!this.id) {
      throw new Error('Producto no válido');
    }

    const allowedFields = ['name', 'description', 'price', 'category', 'stock'];
    const updates = {};

    // Solo permitir campos válidos
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        updates[field] = updateData[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      throw new Error('No hay campos válidos para actualizar');
    }

    // Validar datos si se actualizan
    if (updates.price !== undefined && updates.price <= 0) {
      throw new Error('El precio debe ser mayor a 0');
    }

    if (updates.stock !== undefined && updates.stock < 0) {
      throw new Error('El stock no puede ser negativo');
    }

    // Preparar query de actualización
    const setClause = Object.keys(updates)
      .map(key => `${key} = ?`)
      .join(', ');
    const values = Object.values(updates);

    await database.run(
      `UPDATE products SET ${setClause}, updated_at = datetime("now") WHERE id = ?`,
      [...values, this.id]
    );

    // Retornar producto actualizado
    return await Product.findById(this.id);
  }

  /**
   * Eliminar producto
   * @returns {Promise<boolean>} - True si se eliminó correctamente
   */
  async delete() {
    if (!this.id) {
      throw new Error('Producto no válido');
    }

    await database.run('DELETE FROM products WHERE id = ?', [this.id]);
    return true;
  }

  /**
   * Actualizar stock
   * @param {number} newStock - Nuevo stock
   * @returns {Promise<Product>} - Producto actualizado
   */
  async updateStock(newStock) {
    if (newStock < 0) {
      throw new Error('El stock no puede ser negativo');
    }

    return await this.update({ stock: newStock });
  }

  /**
   * Reducir stock
   * @param {number} quantity - Cantidad a reducir
   * @returns {Promise<Product>} - Producto actualizado
   */
  async reduceStock(quantity) {
    if (quantity <= 0) {
      throw new Error('La cantidad debe ser mayor a 0');
    }

    if (this.stock < quantity) {
      throw new Error('Stock insuficiente');
    }

    return await this.updateStock(this.stock - quantity);
  }

  /**
   * Aumentar stock
   * @param {number} quantity - Cantidad a aumentar
   * @returns {Promise<Product>} - Producto actualizado
   */
  async increaseStock(quantity) {
    if (quantity <= 0) {
      throw new Error('La cantidad debe ser mayor a 0');
    }

    return await this.updateStock(this.stock + quantity);
  }

  /**
   * Obtener información del usuario propietario
   * @returns {Promise<Object|null>} - Datos del usuario
   */
  async getOwner() {
    if (!this.user_id) {
      return null;
    }

    const User = require('./User');
    return await User.findById(this.user_id);
  }

  /**
   * Verificar si el producto pertenece a un usuario
   * @param {number} userId - ID del usuario
   * @returns {boolean} - True si pertenece al usuario
   */
  belongsToUser(userId) {
    return this.user_id === userId;
  }

  /**
   * Verificar si el producto está disponible
   * @returns {boolean} - True si hay stock
   */
  isAvailable() {
    return this.stock > 0;
  }

  /**
   * Obtener precio formateado
   * @returns {string} - Precio formateado
   */
  getFormattedPrice() {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
    }).format(this.price);
  }

  /**
   * Convertir a objeto JSON
   * @returns {Object} - Objeto JSON
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      price: this.price,
      category: this.category,
      stock: this.stock,
      user_id: this.user_id,
      created_at: this.created_at,
      updated_at: this.updated_at,
      isAvailable: this.isAvailable(),
      formattedPrice: this.getFormattedPrice(),
    };
  }
}

module.exports = Product;
