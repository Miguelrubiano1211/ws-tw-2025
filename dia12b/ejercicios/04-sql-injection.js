/**
 * 🔒 Día 12B - Ejercicio 4: Prevención de SQL Injection
 *
 * Objetivos:
 * - Demostrar vulnerabilidades de SQL injection
 * - Implementar consultas parametrizadas
 * - Usar ORM para prevención de inyección
 * - Auditar y validar consultas SQL
 */

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const Joi = require('joi');

const app = express();

// Configuración de seguridad
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting para endpoints sensibles
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 intentos por IP
  message: { error: 'Demasiados intentos de autenticación' },
});

// Configuración de base de datos
let db;

// Inicializar base de datos
const initDB = async () => {
  try {
    db = await open({
      filename: './database.sqlite',
      driver: sqlite3.Database,
    });

    // Crear tablas de ejemplo
    await db.exec(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS productos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        descripcion TEXT,
        precio DECIMAL(10,2) NOT NULL,
        categoria TEXT NOT NULL,
        usuario_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
      );
      
      CREATE TABLE IF NOT EXISTS logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER,
        accion TEXT NOT NULL,
        ip_address TEXT,
        user_agent TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
      );
    `);

    console.log('✅ Base de datos inicializada');

    // Insertar datos de ejemplo si no existen
    const userCount = await db.get('SELECT COUNT(*) as count FROM usuarios');
    if (userCount.count === 0) {
      await insertSampleData();
    }
  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error);
  }
};

// Insertar datos de ejemplo
const insertSampleData = async () => {
  try {
    // Crear usuarios de ejemplo
    const adminHash = await bcrypt.hash('admin123', 10);
    const userHash = await bcrypt.hash('user123', 10);

    await db.run(
      `
      INSERT INTO usuarios (nombre, email, password_hash, role) 
      VALUES (?, ?, ?, ?)
    `,
      ['Administrador', 'admin@ejemplo.com', adminHash, 'admin']
    );

    await db.run(
      `
      INSERT INTO usuarios (nombre, email, password_hash, role) 
      VALUES (?, ?, ?, ?)
    `,
      ['Usuario Normal', 'user@ejemplo.com', userHash, 'user']
    );

    // Crear productos de ejemplo
    await db.run(
      `
      INSERT INTO productos (nombre, descripcion, precio, categoria, usuario_id) 
      VALUES (?, ?, ?, ?, ?)
    `,
      ['Laptop', 'Laptop gaming de alta gama', 1500.0, 'tecnologia', 1]
    );

    await db.run(
      `
      INSERT INTO productos (nombre, descripcion, precio, categoria, usuario_id) 
      VALUES (?, ?, ?, ?, ?)
    `,
      ['Mouse', 'Mouse ergonómico', 25.99, 'tecnologia', 2]
    );

    console.log('✅ Datos de ejemplo insertados');
  } catch (error) {
    console.error('❌ Error insertando datos de ejemplo:', error);
  }
};

// Función para log de auditoría
const logActivity = async (usuarioId, accion, ip, userAgent) => {
  try {
    await db.run(
      `
      INSERT INTO logs (usuario_id, accion, ip_address, user_agent) 
      VALUES (?, ?, ?, ?)
    `,
      [usuarioId, accion, ip, userAgent]
    );
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

// Esquemas de validación
const esquemaLogin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const esquemaBusqueda = Joi.object({
  termino: Joi.string().min(1).max(100).required(),
  categoria: Joi.string()
    .valid('tecnologia', 'hogar', 'deportes', 'moda', 'libros')
    .optional(),
  precio_min: Joi.number().min(0).optional(),
  precio_max: Joi.number().min(0).optional(),
});

// Middleware de validación
const validarEsquema = esquema => {
  return (req, res, next) => {
    const { error, value } = esquema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errores = error.details.map(detalle => ({
        campo: detalle.path.join('.'),
        mensaje: detalle.message,
      }));

      return res.status(400).json({
        error: 'Datos de entrada inválidos',
        errores: errores,
      });
    }

    req.body = value;
    next();
  };
};

// 🚨 VULNERABLE: Ejemplo de código vulnerable a SQL injection
app.post('/api/vulnerable/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    // ❌ VULNERABLE: Construcción de query con concatenación
    const query = `SELECT * FROM usuarios WHERE email = '${email}' AND password_hash = '${password}'`;

    console.log('🚨 Query vulnerable:', query);

    const user = await db.get(query);

    if (user) {
      // Log del intento de login
      await logActivity(
        user.id,
        'login_vulnerable',
        req.ip,
        req.get('User-Agent')
      );

      res.json({
        mensaje: '⚠️ Login exitoso (método vulnerable)',
        usuario: {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      res.status(401).json({
        error: 'Credenciales inválidas',
      });
    }
  } catch (error) {
    console.error('Error en login vulnerable:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
    });
  }
});

// ✅ SEGURO: Login con consultas parametrizadas
app.post(
  '/api/secure/login',
  authLimiter,
  validarEsquema(esquemaLogin),
  async (req, res) => {
    try {
      const { email, password } = req.body;

      // ✅ SEGURO: Consulta parametrizada
      const query = `SELECT * FROM usuarios WHERE email = ?`;
      const user = await db.get(query, [email]);

      console.log('✅ Query segura con parámetros');

      if (user && (await bcrypt.compare(password, user.password_hash))) {
        // Generar JWT
        const token = jwt.sign(
          {
            id: user.id,
            email: user.email,
            role: user.role,
          },
          'secret_key_muy_segura',
          { expiresIn: '1h' }
        );

        // Log del login exitoso
        await logActivity(
          user.id,
          'login_secure',
          req.ip,
          req.get('User-Agent')
        );

        res.json({
          mensaje: '✅ Login exitoso (método seguro)',
          token,
          usuario: {
            id: user.id,
            nombre: user.nombre,
            email: user.email,
            role: user.role,
          },
        });
      } else {
        // Log del intento fallido
        await logActivity(null, 'login_failed', req.ip, req.get('User-Agent'));

        res.status(401).json({
          error: 'Credenciales inválidas',
        });
      }
    } catch (error) {
      console.error('Error en login seguro:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
      });
    }
  }
);

// 🚨 VULNERABLE: Búsqueda con concatenación
app.get('/api/vulnerable/buscar', async (req, res) => {
  try {
    const { termino, categoria } = req.query;

    // ❌ VULNERABLE: Concatenación directa
    let query = `SELECT * FROM productos WHERE nombre LIKE '%${termino}%'`;

    if (categoria) {
      query += ` AND categoria = '${categoria}'`;
    }

    console.log('🚨 Query vulnerable:', query);

    const productos = await db.all(query);

    res.json({
      mensaje: '⚠️ Búsqueda realizada (método vulnerable)',
      productos: productos,
    });
  } catch (error) {
    console.error('Error en búsqueda vulnerable:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
    });
  }
});

// ✅ SEGURO: Búsqueda con parámetros
app.post(
  '/api/secure/buscar',
  validarEsquema(esquemaBusqueda),
  async (req, res) => {
    try {
      const { termino, categoria, precio_min, precio_max } = req.body;

      // ✅ SEGURO: Construir query con parámetros
      let query = `SELECT * FROM productos WHERE nombre LIKE ?`;
      let params = [`%${termino}%`];

      if (categoria) {
        query += ` AND categoria = ?`;
        params.push(categoria);
      }

      if (precio_min !== undefined) {
        query += ` AND precio >= ?`;
        params.push(precio_min);
      }

      if (precio_max !== undefined) {
        query += ` AND precio <= ?`;
        params.push(precio_max);
      }

      query += ` ORDER BY nombre ASC`;

      console.log('✅ Query segura:', query);
      console.log('✅ Parámetros:', params);

      const productos = await db.all(query, params);

      res.json({
        mensaje: '✅ Búsqueda realizada (método seguro)',
        productos: productos,
      });
    } catch (error) {
      console.error('Error en búsqueda segura:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
      });
    }
  }
);

// Ruta para mostrar logs de auditoría
app.get('/api/logs', async (req, res) => {
  try {
    const query = `
      SELECT 
        l.id,
        l.accion,
        l.ip_address,
        l.timestamp,
        u.nombre as usuario_nombre,
        u.email as usuario_email
      FROM logs l
      LEFT JOIN usuarios u ON l.usuario_id = u.id
      ORDER BY l.timestamp DESC
      LIMIT 50
    `;

    const logs = await db.all(query);

    res.json({
      mensaje: 'Logs de auditoría',
      logs: logs,
    });
  } catch (error) {
    console.error('Error obteniendo logs:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
    });
  }
});

// Ruta para mostrar usuarios (para testing)
app.get('/api/usuarios', async (req, res) => {
  try {
    const query = `
      SELECT 
        id, 
        nombre, 
        email, 
        role, 
        created_at 
      FROM usuarios
    `;

    const usuarios = await db.all(query);

    res.json({
      mensaje: 'Lista de usuarios',
      usuarios: usuarios,
    });
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
    });
  }
});

// Ruta para mostrar productos (para testing)
app.get('/api/productos', async (req, res) => {
  try {
    const query = `
      SELECT 
        p.*,
        u.nombre as creador_nombre
      FROM productos p
      LEFT JOIN usuarios u ON p.usuario_id = u.id
      ORDER BY p.created_at DESC
    `;

    const productos = await db.all(query);

    res.json({
      mensaje: 'Lista de productos',
      productos: productos,
    });
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
    });
  }
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({
    error: 'Error interno del servidor',
  });
});

// Inicializar base de datos y servidor
initDB().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(
      `🛡️ Servidor anti-SQL-injection ejecutándose en puerto ${PORT}`
    );
    console.log('\n📋 Rutas disponibles:');
    console.log('🚨 VULNERABLES (para demostración):');
    console.log('POST /api/vulnerable/login - Login vulnerable');
    console.log('GET /api/vulnerable/buscar - Búsqueda vulnerable');
    console.log('\n✅ SEGURAS:');
    console.log('POST /api/secure/login - Login seguro');
    console.log('POST /api/secure/buscar - Búsqueda segura');
    console.log('\n📊 UTILIDADES:');
    console.log('GET /api/usuarios - Lista de usuarios');
    console.log('GET /api/productos - Lista de productos');
    console.log('GET /api/logs - Logs de auditoría');
  });
});

// Exportar para testing
module.exports = app;

/* 
🧪 INSTRUCCIONES DE PRUEBA:

1. Instalar dependencias:
   npm install express sqlite3 sqlite bcryptjs jsonwebtoken express-rate-limit helmet joi

2. Ejecutar el servidor:
   node 04-sql-injection.js

3. Ver datos disponibles:
   curl http://localhost:3000/api/usuarios
   curl http://localhost:3000/api/productos

4. 🚨 PROBAR ATAQUE SQL INJECTION (vulnerable):
   curl -X POST http://localhost:3000/api/vulnerable/login \
     -H "Content-Type: application/json" \
     -d '{"email": "admin@ejemplo.com", "password": "cualquier_cosa"}'

   # Intento de bypass:
   curl -X POST http://localhost:3000/api/vulnerable/login \
     -H "Content-Type: application/json" \
     -d '{"email": "admin@ejemplo.com'\'' OR 1=1 --", "password": "cualquier_cosa"}'

5. ✅ PROBAR LOGIN SEGURO:
   curl -X POST http://localhost:3000/api/secure/login \
     -H "Content-Type: application/json" \
     -d '{"email": "admin@ejemplo.com", "password": "admin123"}'

6. 🚨 PROBAR BÚSQUEDA VULNERABLE:
   curl "http://localhost:3000/api/vulnerable/buscar?termino=Laptop&categoria=tecnologia"

   # Intento de inyección:
   curl "http://localhost:3000/api/vulnerable/buscar?termino=Laptop'; DROP TABLE usuarios; --"

7. ✅ PROBAR BÚSQUEDA SEGURA:
   curl -X POST http://localhost:3000/api/secure/buscar \
     -H "Content-Type: application/json" \
     -d '{"termino": "Laptop", "categoria": "tecnologia", "precio_min": 1000}'

8. Ver logs de auditoría:
   curl http://localhost:3000/api/logs

💡 CONCEPTOS CLAVE:
- Consultas parametrizadas: Usar ? placeholders
- Validación de entrada: Joi para validar antes de consultar
- Prepared statements: SQLite automáticamente los maneja
- Logging de auditoría: Rastrear intentos de acceso
- Rate limiting: Prevenir ataques de fuerza bruta
- Nunca concatenar input del usuario directamente en SQL

🔒 MEJORES PRÁCTICAS:
1. SIEMPRE usar consultas parametrizadas
2. Validar y sanitizar TODA entrada de usuario
3. Usar ORM cuando sea posible
4. Implementar logging de auditoría
5. Aplicar principle of least privilege
6. Escapar caracteres especiales si es necesario
7. Usar whitelist para valores permitidos
*/
