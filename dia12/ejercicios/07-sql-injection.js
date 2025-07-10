/**
 * 🔐 Ejercicio 07: SQL Injection Prevention
 *
 * Conceptos fundamentales:
 * - SQL Injection: Inserción de código SQL malicioso
 * - Prepared Statements: Consultas parametrizadas
 * - Query Parameterization: Separación de código y datos
 * - Input Sanitization: Limpieza específica para SQL
 *
 * Objetivos:
 * - Identificar vulnerabilidades SQL injection
 * - Implementar consultas parametrizadas
 * - Crear middleware de sanitización SQL
 * - Demostrar ataques y defensas
 */

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const { body, validationResult } = require('express-validator');
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Crear base de datos en memoria para testing
const db = new sqlite3.Database(':memory:');

// Estadísticas de seguridad
const estadisticasSQL = {
  consultasSeguras: 0,
  intentosInyeccion: 0,
  consultasBloquedas: 0,
  patronesMaliciosos: [],
};

// 1. INICIALIZACIÓN DE LA BASE DE DATOS

/**
 * Crear tablas y datos de ejemplo
 */
const inicializarDB = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Crear tabla usuarios
      db.run(`CREATE TABLE usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        rol TEXT DEFAULT 'user',
        activo BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Crear tabla productos
      db.run(`CREATE TABLE productos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        descripcion TEXT,
        precio REAL NOT NULL,
        categoria TEXT NOT NULL,
        stock INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Crear tabla logs
      db.run(`CREATE TABLE logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        evento TEXT NOT NULL,
        detalles TEXT,
        ip TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Insertar datos de ejemplo
      const usuariosEjemplo = [
        ['admin', 'admin@ejemplo.com', 'admin123', 'admin'],
        ['usuario1', 'user1@ejemplo.com', 'password123', 'user'],
        ['usuario2', 'user2@ejemplo.com', 'password456', 'user'],
      ];

      const productosEjemplo = [
        ['Laptop Dell', 'Laptop para gaming', 999.99, 'electronica', 10],
        ['Camiseta Nike', 'Camiseta deportiva', 29.99, 'ropa', 50],
        ['Libro JavaScript', 'Guía completa de JS', 39.99, 'libros', 25],
      ];

      usuariosEjemplo.forEach(usuario => {
        db.run(
          'INSERT INTO usuarios (username, email, password, rol) VALUES (?, ?, ?, ?)',
          usuario
        );
      });

      productosEjemplo.forEach(producto => {
        db.run(
          'INSERT INTO productos (nombre, descripcion, precio, categoria, stock) VALUES (?, ?, ?, ?, ?)',
          producto
        );
      });

      resolve();
    });
  });
};

// 2. DETECCIÓN DE PATRONES MALICIOSOS

/**
 * Patrones comunes de SQL injection
 */
const patronesSQL = [
  /(\bUNION\b|\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b|\bCREATE\b|\bALTER\b)/i,
  /(\bOR\b|\bAND\b)\s+(\d+\s*=\s*\d+|\w+\s*=\s*\w+)/i,
  /['"`](\s*;\s*|\s*--|\s*\/\*|\s*\*\/)/i,
  /(\bEXEC\b|\bEXECUTE\b|\bSP_\w+)/i,
  /(\bINFORMATION_SCHEMA\b|\bSYS\.\w+)/i,
  /(\bSLEEP\b|\bWAITFOR\b|\bBENCHMARK\b)/i,
];

/**
 * Middleware para detectar intentos de SQL injection
 */
const detectarSQLInjection = (req, res, next) => {
  const verificarCampo = (valor, campo) => {
    if (typeof valor === 'string') {
      for (const patron of patronesSQL) {
        if (patron.test(valor)) {
          estadisticasSQL.intentosInyeccion++;
          estadisticasSQL.patronesMaliciosos.push({
            patron: patron.source,
            valor: valor,
            campo: campo,
            ip: req.ip,
            timestamp: new Date(),
          });

          console.log(`🚨 SQL Injection detectado en ${campo}: ${valor}`);

          // Registrar en logs
          db.run('INSERT INTO logs (evento, detalles, ip) VALUES (?, ?, ?)', [
            'SQL_INJECTION_ATTEMPT',
            `Campo: ${campo}, Valor: ${valor}`,
            req.ip,
          ]);

          return true;
        }
      }
    }
    return false;
  };

  // Verificar todos los campos del body
  const verificarObjeto = (obj, prefijo = '') => {
    for (const [clave, valor] of Object.entries(obj)) {
      const nombreCampo = prefijo ? `${prefijo}.${clave}` : clave;

      if (typeof valor === 'object' && valor !== null) {
        if (verificarObjeto(valor, nombreCampo)) {
          return true;
        }
      } else if (verificarCampo(valor, nombreCampo)) {
        return true;
      }
    }
    return false;
  };

  // Verificar query parameters
  for (const [clave, valor] of Object.entries(req.query)) {
    if (verificarCampo(valor, `query.${clave}`)) {
      estadisticasSQL.consultasBloquedas++;
      return res.status(400).json({
        error: 'Contenido malicioso detectado',
        mensaje: 'La consulta contiene patrones que podrían ser SQL injection',
        campo: clave,
        codigo: 'SQL_INJECTION_BLOCKED',
      });
    }
  }

  // Verificar body
  if (req.body && verificarObjeto(req.body)) {
    estadisticasSQL.consultasBloquedas++;
    return res.status(400).json({
      error: 'Contenido malicioso detectado',
      mensaje:
        'Los datos enviados contienen patrones que podrían ser SQL injection',
      codigo: 'SQL_INJECTION_BLOCKED',
    });
  }

  next();
};

// 3. CONSULTAS VULNERABLES (EJEMPLOS DE LO QUE NO HACER)

/**
 * ❌ VULNERABLE: Consulta con concatenación directa
 */
const consultaVulnerable = (req, res) => {
  const { username, password } = req.body;

  // ¡NUNCA HAGAS ESTO! Es vulnerable a SQL injection
  const query = `SELECT * FROM usuarios WHERE username = '${username}' AND password = '${password}'`;

  console.log(`⚠️  Consulta vulnerable: ${query}`);

  db.all(query, (err, rows) => {
    if (err) {
      console.error('Error en consulta vulnerable:', err.message);
      return res.status(500).json({
        error: 'Error de base de datos',
        mensaje: 'Error en la consulta',
      });
    }

    if (rows.length > 0) {
      res.json({
        mensaje: 'Login exitoso (método vulnerable)',
        usuario: rows[0],
        advertencia: 'Esta consulta es vulnerable a SQL injection',
      });
    } else {
      res.status(401).json({
        error: 'Credenciales inválidas',
        mensaje: 'Usuario o password incorrecto',
      });
    }
  });
};

/**
 * ❌ VULNERABLE: Búsqueda con concatenación
 */
const busquedaVulnerable = (req, res) => {
  const { termino } = req.query;

  // ¡NUNCA HAGAS ESTO!
  const query = `SELECT * FROM productos WHERE nombre LIKE '%${termino}%' OR descripcion LIKE '%${termino}%'`;

  console.log(`⚠️  Búsqueda vulnerable: ${query}`);

  db.all(query, (err, rows) => {
    if (err) {
      return res.status(500).json({
        error: 'Error en búsqueda',
        mensaje: err.message,
      });
    }

    res.json({
      mensaje: 'Resultados de búsqueda (método vulnerable)',
      resultados: rows,
      advertencia: 'Esta búsqueda es vulnerable a SQL injection',
    });
  });
};

// 4. CONSULTAS SEGURAS (PREPARED STATEMENTS)

/**
 * ✅ SEGURO: Login con prepared statement
 */
const loginSeguro = (req, res) => {
  const { username, password } = req.body;

  // Usar parámetros (?) para evitar SQL injection
  const query = 'SELECT * FROM usuarios WHERE username = ? AND password = ?';

  console.log(`✅ Consulta segura: ${query}`);
  console.log(`✅ Parámetros: [${username}, ${password}]`);

  db.all(query, [username, password], (err, rows) => {
    if (err) {
      console.error('Error en consulta segura:', err.message);
      return res.status(500).json({
        error: 'Error de base de datos',
        mensaje: 'Error interno',
      });
    }

    estadisticasSQL.consultasSeguras++;

    if (rows.length > 0) {
      res.json({
        mensaje: 'Login exitoso (método seguro)',
        usuario: {
          id: rows[0].id,
          username: rows[0].username,
          email: rows[0].email,
          rol: rows[0].rol,
        },
      });
    } else {
      res.status(401).json({
        error: 'Credenciales inválidas',
        mensaje: 'Usuario o password incorrecto',
      });
    }
  });
};

/**
 * ✅ SEGURO: Búsqueda con prepared statement
 */
const busquedaSegura = (req, res) => {
  const { termino, categoria, precio_min, precio_max } = req.query;

  let query = 'SELECT * FROM productos WHERE 1=1';
  const parametros = [];

  if (termino) {
    query += ' AND (nombre LIKE ? OR descripcion LIKE ?)';
    parametros.push(`%${termino}%`, `%${termino}%`);
  }

  if (categoria) {
    query += ' AND categoria = ?';
    parametros.push(categoria);
  }

  if (precio_min) {
    query += ' AND precio >= ?';
    parametros.push(parseFloat(precio_min));
  }

  if (precio_max) {
    query += ' AND precio <= ?';
    parametros.push(parseFloat(precio_max));
  }

  query += ' ORDER BY nombre';

  console.log(`✅ Búsqueda segura: ${query}`);
  console.log(`✅ Parámetros: [${parametros.join(', ')}]`);

  db.all(query, parametros, (err, rows) => {
    if (err) {
      return res.status(500).json({
        error: 'Error en búsqueda',
        mensaje: 'Error interno',
      });
    }

    estadisticasSQL.consultasSeguras++;

    res.json({
      mensaje: 'Resultados de búsqueda (método seguro)',
      filtros: { termino, categoria, precio_min, precio_max },
      total: rows.length,
      resultados: rows,
    });
  });
};

/**
 * ✅ SEGURO: Inserción con prepared statement
 */
const crearUsuarioSeguro = (req, res) => {
  const { username, email, password, rol = 'user' } = req.body;

  const query =
    'INSERT INTO usuarios (username, email, password, rol) VALUES (?, ?, ?, ?)';

  console.log(`✅ Inserción segura: ${query}`);

  db.run(query, [username, email, password, rol], function (err) {
    if (err) {
      if (err.code === 'SQLITE_CONSTRAINT') {
        return res.status(400).json({
          error: 'Usuario ya existe',
          mensaje: 'El username o email ya están en uso',
        });
      }

      return res.status(500).json({
        error: 'Error creando usuario',
        mensaje: 'Error interno',
      });
    }

    estadisticasSQL.consultasSeguras++;

    res.status(201).json({
      mensaje: 'Usuario creado exitosamente',
      usuario: {
        id: this.lastID,
        username,
        email,
        rol,
      },
    });
  });
};

/**
 * ✅ SEGURO: Actualización con prepared statement
 */
const actualizarUsuarioSeguro = (req, res) => {
  const { id } = req.params;
  const { username, email, rol } = req.body;

  const query =
    'UPDATE usuarios SET username = ?, email = ?, rol = ? WHERE id = ?';

  console.log(`✅ Actualización segura: ${query}`);

  db.run(query, [username, email, rol, id], function (err) {
    if (err) {
      return res.status(500).json({
        error: 'Error actualizando usuario',
        mensaje: 'Error interno',
      });
    }

    estadisticasSQL.consultasSeguras++;

    if (this.changes === 0) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
        mensaje: 'No se encontró un usuario con ese ID',
      });
    }

    res.json({
      mensaje: 'Usuario actualizado exitosamente',
      cambios: this.changes,
    });
  });
};

// 5. MIDDLEWARE DE VALIDACIÓN SQL

/**
 * Validaciones específicas para prevenir SQL injection
 */
const validacionesSQL = [
  body('username')
    .isAlphanumeric()
    .withMessage('El username solo puede contener letras y números')
    .isLength({ min: 3, max: 20 })
    .withMessage('El username debe tener entre 3 y 20 caracteres'),

  body('email')
    .isEmail()
    .withMessage('Debe ser un email válido')
    .normalizeEmail(),

  body('password')
    .isLength({ min: 8 })
    .withMessage('El password debe tener al menos 8 caracteres')
    .matches(/^[a-zA-Z0-9@$!%*?&]+$/)
    .withMessage('El password contiene caracteres no permitidos'),

  body('rol')
    .optional()
    .isIn(['admin', 'user', 'moderator'])
    .withMessage('El rol debe ser admin, user o moderator'),
];

// 6. APLICAR MIDDLEWARES Y RUTAS

// Aplicar detección de SQL injection a todas las rutas
app.use(detectarSQLInjection);

// Rutas vulnerables (solo para demostración)
app.post('/login-vulnerable', consultaVulnerable);
app.get('/buscar-vulnerable', busquedaVulnerable);

// Rutas seguras
app.post('/login-seguro', loginSeguro);
app.get('/buscar-seguro', busquedaSegura);
app.post('/usuarios-seguro', validacionesSQL, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Datos inválidos',
      errores: errors.array(),
    });
  }
  crearUsuarioSeguro(req, res);
});

app.put('/usuarios-seguro/:id', validacionesSQL, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Datos inválidos',
      errores: errors.array(),
    });
  }
  actualizarUsuarioSeguro(req, res);
});

// 7. RUTAS DE ADMINISTRACIÓN Y TESTING

/**
 * Ruta para ver estadísticas de seguridad
 */
app.get('/admin/sql-stats', (req, res) => {
  res.json({
    mensaje: 'Estadísticas de seguridad SQL',
    estadisticas: {
      consultasSeguras: estadisticasSQL.consultasSeguras,
      intentosInyeccion: estadisticasSQL.intentosInyeccion,
      consultasBloquedas: estadisticasSQL.consultasBloquedas,
      patronesMaliciosos: estadisticasSQL.patronesMaliciosos.slice(-10), // Últimos 10
    },
    timestamp: new Date(),
  });
});

/**
 * Ruta para ver logs de seguridad
 */
app.get('/admin/logs', (req, res) => {
  const query =
    'SELECT * FROM logs WHERE evento = ? ORDER BY timestamp DESC LIMIT 20';

  db.all(query, ['SQL_INJECTION_ATTEMPT'], (err, rows) => {
    if (err) {
      return res.status(500).json({
        error: 'Error obteniendo logs',
        mensaje: err.message,
      });
    }

    res.json({
      mensaje: 'Logs de intentos de SQL injection',
      total: rows.length,
      logs: rows,
    });
  });
});

/**
 * Ruta para limpiar estadísticas
 */
app.post('/admin/reset-stats', (req, res) => {
  estadisticasSQL.consultasSeguras = 0;
  estadisticasSQL.intentosInyeccion = 0;
  estadisticasSQL.consultasBloquedas = 0;
  estadisticasSQL.patronesMaliciosos = [];

  db.run('DELETE FROM logs', err => {
    if (err) {
      return res.status(500).json({
        error: 'Error limpiando logs',
        mensaje: err.message,
      });
    }

    res.json({
      mensaje: 'Estadísticas y logs limpiados exitosamente',
      timestamp: new Date(),
    });
  });
});

// 8. INICIALIZACIÓN Y TESTING
const PORT = 3007;

inicializarDB().then(() => {
  if (require.main === module) {
    app.listen(PORT, () => {
      console.log(
        `🔐 Servidor SQL Injection Prevention ejecutándose en puerto ${PORT}`
      );
      console.log('\n📋 Pruebas sugeridas:');
      console.log('1. Login seguro: POST http://localhost:3007/login-seguro');
      console.log('   Body: { "username": "admin", "password": "admin123" }');
      console.log(
        '2. Login vulnerable: POST http://localhost:3007/login-vulnerable'
      );
      console.log('   Body: { "username": "admin", "password": "admin123" }');
      console.log('3. Ataque SQL: POST http://localhost:3007/login-vulnerable');
      console.log(
        '   Body: { "username": "admin\' OR 1=1 --", "password": "cualquier" }'
      );
      console.log(
        '4. Búsqueda segura: GET http://localhost:3007/buscar-seguro?termino=Laptop'
      );
      console.log(
        '5. Búsqueda vulnerable: GET http://localhost:3007/buscar-vulnerable?termino=Laptop'
      );
      console.log(
        "6. Ataque búsqueda: GET http://localhost:3007/buscar-vulnerable?termino=' UNION SELECT * FROM usuarios --"
      );
      console.log('7. Estadísticas: GET http://localhost:3007/admin/sql-stats');
      console.log('8. Logs: GET http://localhost:3007/admin/logs');
      console.log('\n🎯 Conceptos clave:');
      console.log('- Prepared Statements: Separar código SQL de datos');
      console.log('- Parameterización: Usar ? para parámetros');
      console.log('- Validación: Validar tipos y formatos de entrada');
      console.log('- Detección: Identificar patrones maliciosos');
      console.log('\n💡 Prueba estos ataques comunes:');
      console.log("- ' OR 1=1 --");
      console.log("- ' UNION SELECT * FROM usuarios --");
      console.log("- '; DROP TABLE usuarios; --");
      console.log("- ' AND SLEEP(5) --");
    });
  }
});

module.exports = {
  app,
  detectarSQLInjection,
  loginSeguro,
  busquedaSegura,
  crearUsuarioSeguro,
  inicializarDB,
};

// 🎪 Mini Reto: Implementa un sistema de prepared statements con cache
class PreparedStatementCache {
  constructor() {
    this.cache = new Map();
    this.stats = {
      cacheHits: 0,
      cacheMisses: 0,
      totalQueries: 0,
    };
  }

  prepare(sql, params) {
    const cacheKey = sql;
    this.stats.totalQueries++;

    if (this.cache.has(cacheKey)) {
      this.stats.cacheHits++;
      console.log(`📚 Cache hit para query: ${sql.substring(0, 50)}...`);
    } else {
      this.stats.cacheMisses++;
      console.log(`📖 Cache miss para query: ${sql.substring(0, 50)}...`);

      // Validar SQL antes de cachear
      this.validateSQL(sql);

      this.cache.set(cacheKey, {
        sql: sql,
        cached: new Date(),
        usage: 0,
      });
    }

    const cached = this.cache.get(cacheKey);
    cached.usage++;

    return {
      sql: cached.sql,
      params: params,
      fromCache: this.stats.cacheHits > this.stats.cacheMisses,
    };
  }

  validateSQL(sql) {
    // Validar que sea un SQL seguro
    const prohibidoPatrones = [
      /;\s*(DROP|ALTER|CREATE|TRUNCATE)/i,
      /UNION.*SELECT/i,
      /INTO\s+OUTFILE/i,
    ];

    for (const patron of prohibidoPatrones) {
      if (patron.test(sql)) {
        throw new Error(`SQL prohibido detectado: ${patron.source}`);
      }
    }
  }

  getStats() {
    return {
      ...this.stats,
      cacheSize: this.cache.size,
      hitRate:
        ((this.stats.cacheHits / this.stats.totalQueries) * 100).toFixed(2) +
        '%',
    };
  }

  clear() {
    this.cache.clear();
    this.stats = { cacheHits: 0, cacheMisses: 0, totalQueries: 0 };
  }
}

// Ejemplo de uso del cache
const queryCache = new PreparedStatementCache();

const queryConCache = (sql, params, callback) => {
  try {
    const prepared = queryCache.prepare(sql, params);

    console.log(`🔒 Ejecutando query segura: ${prepared.sql}`);
    console.log(`🔒 Parámetros: [${prepared.params.join(', ')}]`);

    db.all(prepared.sql, prepared.params, callback);
  } catch (error) {
    console.error('❌ Error en query con cache:', error.message);
    callback(error);
  }
};

// Ruta con cache de prepared statements
app.get('/usuarios-cache', (req, res) => {
  const { rol } = req.query;

  let sql = 'SELECT id, username, email, rol FROM usuarios';
  let params = [];

  if (rol) {
    sql += ' WHERE rol = ?';
    params.push(rol);
  }

  queryConCache(sql, params, (err, rows) => {
    if (err) {
      return res.status(500).json({
        error: 'Error obteniendo usuarios',
        mensaje: err.message,
      });
    }

    res.json({
      mensaje: 'Usuarios obtenidos con cache',
      cacheStats: queryCache.getStats(),
      total: rows.length,
      usuarios: rows,
    });
  });
});

app.get('/admin/cache-stats', (req, res) => {
  res.json({
    mensaje: 'Estadísticas del cache de prepared statements',
    stats: queryCache.getStats(),
  });
});
