// config/database.js
// Configuración de la base de datos SQLite para el proyecto API Segura

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

/**
 * Configuración de la base de datos SQLite
 * - Usar WAL mode para mejor rendimiento
 * - Configurar foreign keys
 * - Manejo de errores apropiado
 */

class Database {
  constructor() {
    this.db = null;
    this.dbPath = path.join(__dirname, '../../database.sqlite');
  }

  /**
   * Conectar a la base de datos
   * @returns {Promise<void>}
   */
  async connect() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, err => {
        if (err) {
          console.error('Error al conectar con la base de datos:', err.message);
          reject(err);
        } else {
          console.log('✅ Conectado a la base de datos SQLite');

          // Habilitar foreign keys
          this.db.run('PRAGMA foreign_keys = ON');

          // Configurar WAL mode para mejor rendimiento
          this.db.run('PRAGMA journal_mode = WAL');

          resolve();
        }
      });
    });
  }

  /**
   * Inicializar las tablas de la base de datos
   * @returns {Promise<void>}
   */
  async initTables() {
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user' CHECK(role IN ('user', 'admin')),
        active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const createProductsTable = `
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL CHECK(price > 0),
        category TEXT NOT NULL,
        stock INTEGER DEFAULT 0 CHECK(stock >= 0),
        user_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;

    const createTokensTable = `
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        token TEXT UNIQUE NOT NULL,
        user_id INTEGER NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;

    const createLoginAttemptsTable = `
      CREATE TABLE IF NOT EXISTS login_attempts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ip_address TEXT NOT NULL,
        username TEXT,
        successful BOOLEAN DEFAULT 0,
        attempted_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    try {
      await this.run(createUsersTable);
      await this.run(createProductsTable);
      await this.run(createTokensTable);
      await this.run(createLoginAttemptsTable);

      console.log('✅ Tablas inicializadas correctamente');
    } catch (error) {
      console.error('❌ Error al inicializar tablas:', error);
      throw error;
    }
  }

  /**
   * Ejecutar una query con parámetros (prepared statement)
   * @param {string} sql - Query SQL
   * @param {Array} params - Parámetros para la query
   * @returns {Promise<Object>}
   */
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
    });
  }

  /**
   * Obtener una sola fila
   * @param {string} sql - Query SQL
   * @param {Array} params - Parámetros para la query
   * @returns {Promise<Object|null>}
   */
  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row || null);
        }
      });
    });
  }

  /**
   * Obtener múltiples filas
   * @param {string} sql - Query SQL
   * @param {Array} params - Parámetros para la query
   * @returns {Promise<Array>}
   */
  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows || []);
        }
      });
    });
  }

  /**
   * Cerrar la conexión a la base de datos
   * @returns {Promise<void>}
   */
  close() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.close(err => {
          if (err) {
            reject(err);
          } else {
            console.log('✅ Conexión a la base de datos cerrada');
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }

  /**
   * Crear usuario administrador por defecto
   * @returns {Promise<void>}
   */
  async createDefaultAdmin() {
    const bcrypt = require('bcrypt');

    try {
      // Verificar si ya existe un admin
      const existingAdmin = await this.get(
        'SELECT * FROM users WHERE role = ?',
        ['admin']
      );

      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash('admin123', 10);

        await this.run(
          'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
          ['admin', 'admin@example.com', hashedPassword, 'admin']
        );

        console.log(
          '✅ Usuario administrador creado - usuario: admin, contraseña: admin123'
        );
      }
    } catch (error) {
      console.error('❌ Error al crear usuario administrador:', error);
    }
  }
}

// Crear instancia singleton
const database = new Database();

module.exports = database;
