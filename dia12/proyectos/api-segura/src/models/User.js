// models/User.js
// Modelo de usuario con validaciones y métodos de seguridad

const bcrypt = require('bcrypt');
const database = require('../config/database');

/**
 * Modelo de Usuario
 * - Validaciones de datos
 * - Métodos de autenticación
 * - Gestión de contraseñas
 * - Métodos de consulta seguros
 */

class User {
  constructor(data) {
    this.id = data.id || null;
    this.username = data.username || null;
    this.email = data.email || null;
    this.password = data.password || null;
    this.role = data.role || 'user';
    this.active = data.active !== undefined ? data.active : true;
    this.created_at = data.created_at || null;
    this.updated_at = data.updated_at || null;
  }

  /**
   * Crear nuevo usuario
   * @param {Object} userData - Datos del usuario
   * @returns {Promise<User>} - Usuario creado
   */
  static async create(userData) {
    const { username, email, password, role = 'user' } = userData;

    // Validar datos requeridos
    if (!username || !email || !password) {
      throw new Error('Username, email y password son requeridos');
    }

    // Hash de la contraseña
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insertar usuario
    const result = await database.run(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email.toLowerCase(), hashedPassword, role]
    );

    // Retornar usuario creado
    return await User.findById(result.id);
  }

  /**
   * Buscar usuario por ID
   * @param {number} id - ID del usuario
   * @returns {Promise<User|null>} - Usuario encontrado o null
   */
  static async findById(id) {
    const userData = await database.get(
      'SELECT id, username, email, role, active, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );

    return userData ? new User(userData) : null;
  }

  /**
   * Buscar usuario por username
   * @param {string} username - Username del usuario
   * @returns {Promise<User|null>} - Usuario encontrado o null
   */
  static async findByUsername(username) {
    const userData = await database.get(
      'SELECT id, username, email, role, active, created_at, updated_at FROM users WHERE username = ?',
      [username]
    );

    return userData ? new User(userData) : null;
  }

  /**
   * Buscar usuario por email
   * @param {string} email - Email del usuario
   * @returns {Promise<User|null>} - Usuario encontrado o null
   */
  static async findByEmail(email) {
    const userData = await database.get(
      'SELECT id, username, email, role, active, created_at, updated_at FROM users WHERE email = ?',
      [email.toLowerCase()]
    );

    return userData ? new User(userData) : null;
  }

  /**
   * Buscar usuario por username o email (para login)
   * @param {string} credential - Username o email
   * @returns {Promise<User|null>} - Usuario encontrado o null
   */
  static async findByCredential(credential) {
    const userData = await database.get(
      'SELECT id, username, email, password, role, active, created_at, updated_at FROM users WHERE username = ? OR email = ?',
      [credential, credential.toLowerCase()]
    );

    return userData ? new User(userData) : null;
  }

  /**
   * Obtener todos los usuarios con paginación
   * @param {Object} options - Opciones de paginación
   * @returns {Promise<Object>} - Usuarios paginados
   */
  static async findAll(options = {}) {
    const { page = 1, limit = 10, role = null, active = null } = options;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const offset = (pageNum - 1) * limitNum;

    let query =
      'SELECT id, username, email, role, active, created_at FROM users WHERE 1=1';
    let countQuery = 'SELECT COUNT(*) as total FROM users WHERE 1=1';
    let params = [];

    // Filtro por rol
    if (role) {
      query += ' AND role = ?';
      countQuery += ' AND role = ?';
      params.push(role);
    }

    // Filtro por estado activo
    if (active !== null) {
      query += ' AND active = ?';
      countQuery += ' AND active = ?';
      params.push(active);
    }

    // Agregar ordenamiento y paginación
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';

    // Ejecutar queries
    const [users, totalResult] = await Promise.all([
      database.all(query, [...params, limitNum, offset]),
      database.get(countQuery, params),
    ]);

    const total = totalResult.total;
    const totalPages = Math.ceil(total / limitNum);

    return {
      users: users.map(userData => new User(userData)),
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
   * Verificar si existe un usuario con el username o email
   * @param {string} username - Username a verificar
   * @param {string} email - Email a verificar
   * @param {number} excludeId - ID a excluir de la búsqueda
   * @returns {Promise<boolean>} - True si existe
   */
  static async exists(username, email, excludeId = null) {
    let query = 'SELECT id FROM users WHERE (username = ? OR email = ?)';
    let params = [username, email.toLowerCase()];

    if (excludeId) {
      query += ' AND id != ?';
      params.push(excludeId);
    }

    const existing = await database.get(query, params);
    return !!existing;
  }

  /**
   * Verificar contraseña
   * @param {string} password - Contraseña a verificar
   * @returns {Promise<boolean>} - True si la contraseña es correcta
   */
  async verifyPassword(password) {
    if (!this.password) {
      throw new Error('Usuario no cargado completamente');
    }

    return await bcrypt.compare(password, this.password);
  }

  /**
   * Actualizar contraseña
   * @param {string} newPassword - Nueva contraseña
   * @returns {Promise<boolean>} - True si se actualizó correctamente
   */
  async updatePassword(newPassword) {
    if (!this.id) {
      throw new Error('Usuario no válido');
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await database.run(
      'UPDATE users SET password = ?, updated_at = datetime("now") WHERE id = ?',
      [hashedPassword, this.id]
    );

    return true;
  }

  /**
   * Actualizar datos del usuario
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<User>} - Usuario actualizado
   */
  async update(updateData) {
    if (!this.id) {
      throw new Error('Usuario no válido');
    }

    const allowedFields = ['username', 'email', 'role', 'active'];
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

    // Preparar query de actualización
    const setClause = Object.keys(updates)
      .map(key => `${key} = ?`)
      .join(', ');
    const values = Object.values(updates);

    await database.run(
      `UPDATE users SET ${setClause}, updated_at = datetime("now") WHERE id = ?`,
      [...values, this.id]
    );

    // Retornar usuario actualizado
    return await User.findById(this.id);
  }

  /**
   * Desactivar usuario
   * @returns {Promise<boolean>} - True si se desactivó correctamente
   */
  async deactivate() {
    if (!this.id) {
      throw new Error('Usuario no válido');
    }

    await database.run(
      'UPDATE users SET active = 0, updated_at = datetime("now") WHERE id = ?',
      [this.id]
    );

    this.active = false;
    return true;
  }

  /**
   * Activar usuario
   * @returns {Promise<boolean>} - True si se activó correctamente
   */
  async activate() {
    if (!this.id) {
      throw new Error('Usuario no válido');
    }

    await database.run(
      'UPDATE users SET active = 1, updated_at = datetime("now") WHERE id = ?',
      [this.id]
    );

    this.active = true;
    return true;
  }

  /**
   * Eliminar usuario
   * @returns {Promise<boolean>} - True si se eliminó correctamente
   */
  async delete() {
    if (!this.id) {
      throw new Error('Usuario no válido');
    }

    await database.run('DELETE FROM users WHERE id = ?', [this.id]);
    return true;
  }

  /**
   * Obtener productos del usuario
   * @param {Object} options - Opciones de consulta
   * @returns {Promise<Array>} - Productos del usuario
   */
  async getProducts(options = {}) {
    if (!this.id) {
      throw new Error('Usuario no válido');
    }

    const { page = 1, limit = 10 } = options;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const offset = (pageNum - 1) * limitNum;

    const products = await database.all(
      'SELECT id, name, description, price, category, stock, created_at FROM products WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [this.id, limitNum, offset]
    );

    return products;
  }

  /**
   * Convertir a objeto JSON (sin contraseña)
   * @returns {Object} - Objeto JSON seguro
   */
  toJSON() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      role: this.role,
      active: this.active,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }

  /**
   * Verificar si el usuario tiene un rol específico
   * @param {string} role - Rol a verificar
   * @returns {boolean} - True si tiene el rol
   */
  hasRole(role) {
    return this.role === role;
  }

  /**
   * Verificar si el usuario es admin
   * @returns {boolean} - True si es admin
   */
  isAdmin() {
    return this.role === 'admin';
  }

  /**
   * Verificar si el usuario está activo
   * @returns {boolean} - True si está activo
   */
  isActive() {
    return this.active === true || this.active === 1;
  }
}

module.exports = User;
