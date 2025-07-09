// 🗄️ Ejercicio 2: SQLite Setup y Básico
// Objetivo: Configurar base de datos SQLite y crear tablas

console.log('🎯 Ejercicio 2: SQLite Setup y Básico');

const Database = require('better-sqlite3');
const path = require('path');

// 1. Configuración de la base de datos
const dbPath = path.join(__dirname, 'tienda.db');

// TODO: Crear conexión a la base de datos
let db;

try {
  db = new Database(dbPath);
  console.log('✅ Conexión a SQLite establecida');
} catch (error) {
  console.error('❌ Error al conectar a SQLite:', error);
  process.exit(1);
}

// Configurar SQLite para mejor rendimiento
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// 2. Crear tablas
console.log('\n📋 Creando tablas...');

// TODO: Crear tabla categorías
const createCategoriasTable = `
    CREATE TABLE IF NOT EXISTS categorias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL UNIQUE,
        descripcion TEXT,
        activa BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`;

// TODO: Crear tabla productos
const createProductosTable = `
    CREATE TABLE IF NOT EXISTS productos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        descripcion TEXT,
        precio DECIMAL(10,2) NOT NULL CHECK(precio > 0),
        stock INTEGER NOT NULL DEFAULT 0 CHECK(stock >= 0),
        categoria_id INTEGER,
        activo BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (categoria_id) REFERENCES categorias(id)
    )
`;

// TODO: Crear tabla clientes
const createClientesTable = `
    CREATE TABLE IF NOT EXISTS clientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        telefono TEXT,
        direccion TEXT,
        activo BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`;

// TODO: Crear tabla pedidos
const createPedidosTable = `
    CREATE TABLE IF NOT EXISTS pedidos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cliente_id INTEGER NOT NULL,
        total DECIMAL(10,2) NOT NULL,
        estado TEXT DEFAULT 'pendiente',
        fecha_pedido DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (cliente_id) REFERENCES clientes(id)
    )
`;

// TODO: Crear tabla detalle_pedidos (relación muchos a muchos)
const createDetallePedidosTable = `
    CREATE TABLE IF NOT EXISTS detalle_pedidos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pedido_id INTEGER NOT NULL,
        producto_id INTEGER NOT NULL,
        cantidad INTEGER NOT NULL CHECK(cantidad > 0),
        precio_unitario DECIMAL(10,2) NOT NULL,
        subtotal DECIMAL(10,2) NOT NULL,
        FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
        FOREIGN KEY (producto_id) REFERENCES productos(id)
    )
`;

// Ejecutar creación de tablas
function crearTablas() {
  try {
    db.exec(createCategoriasTable);
    console.log('✅ Tabla categorías creada');

    db.exec(createProductosTable);
    console.log('✅ Tabla productos creada');

    db.exec(createClientesTable);
    console.log('✅ Tabla clientes creada');

    db.exec(createPedidosTable);
    console.log('✅ Tabla pedidos creada');

    db.exec(createDetallePedidosTable);
    console.log('✅ Tabla detalle_pedidos creada');

    console.log('\n🎉 Todas las tablas creadas exitosamente');
  } catch (error) {
    console.error('❌ Error al crear tablas:', error);
  }
}

// 3. Insertar datos de ejemplo
console.log('\n📝 Insertando datos de ejemplo...');

function insertarDatosEjemplo() {
  // TODO: Insertar categorías
  const insertCategoria = db.prepare(`
        INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)
    `);

  const categorias = [
    ['Electrónicos', 'Dispositivos electrónicos y gadgets'],
    ['Ropa', 'Prendas de vestir y accesorios'],
    ['Hogar', 'Artículos para el hogar'],
    ['Deportes', 'Artículos deportivos y fitness'],
    ['Libros', 'Libros y material de lectura'],
  ];

  // TODO: Insertar productos
  const insertProducto = db.prepare(`
        INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id) 
        VALUES (?, ?, ?, ?, ?)
    `);

  const productos = [
    ['Laptop Gaming', 'Laptop para gaming con RTX 4060', 1299.99, 5, 1],
    ['Mouse Inalámbrico', 'Mouse ergonómico inalámbrico', 29.99, 25, 1],
    ['Teclado Mecánico', 'Teclado mecánico RGB', 89.99, 15, 1],
    ['Camisa Polo', 'Camisa polo de algodón', 39.99, 30, 2],
    ['Jeans', 'Jeans de mezclilla azul', 59.99, 20, 2],
    ['Lámpara LED', 'Lámpara de escritorio LED', 49.99, 12, 3],
    ['Cojín', 'Cojín decorativo', 19.99, 40, 3],
  ];

  // TODO: Insertar clientes
  const insertCliente = db.prepare(`
        INSERT INTO clientes (nombre, email, telefono, direccion) 
        VALUES (?, ?, ?, ?)
    `);

  const clientes = [
    ['Juan Pérez', 'juan@email.com', '555-0001', 'Calle 123 #45-67'],
    ['María García', 'maria@email.com', '555-0002', 'Av. Principal 89'],
    ['Carlos López', 'carlos@email.com', '555-0003', 'Carrera 12 #34-56'],
    ['Ana Martínez', 'ana@email.com', '555-0004', 'Calle 78 #90-12'],
  ];

  try {
    // Usar transacción para insertar todos los datos
    const transaction = db.transaction(() => {
      // Insertar categorías
      categorias.forEach(categoria => {
        insertCategoria.run(categoria);
      });

      // Insertar productos
      productos.forEach(producto => {
        insertProducto.run(producto);
      });

      // Insertar clientes
      clientes.forEach(cliente => {
        insertCliente.run(cliente);
      });
    });

    transaction();
    console.log('✅ Datos de ejemplo insertados exitosamente');
  } catch (error) {
    console.error('❌ Error al insertar datos:', error);
  }
}

// 4. Consultas básicas
console.log('\n🔍 Ejecutando consultas básicas...');

function consultasBasicas() {
  try {
    // TODO: Contar productos por categoría
    const countProductsPorCategoria = db.prepare(`
            SELECT 
                c.nombre as categoria,
                COUNT(p.id) as total_productos
            FROM categorias c
            LEFT JOIN productos p ON c.id = p.categoria_id
            GROUP BY c.id, c.nombre
        `);

    console.log('\n📊 Productos por categoría:');
    const productsPorCategoria = countProductsPorCategoria.all();
    productsPorCategoria.forEach(row => {
      console.log(`   ${row.categoria}: ${row.total_productos} productos`);
    });

    // TODO: Productos con precio mayor a $50
    const productosCaros = db.prepare(`
            SELECT p.nombre, p.precio, c.nombre as categoria
            FROM productos p
            JOIN categorias c ON p.categoria_id = c.id
            WHERE p.precio > 50
            ORDER BY p.precio DESC
        `);

    console.log('\n💰 Productos con precio mayor a $50:');
    const caros = productosCaros.all();
    caros.forEach(producto => {
      console.log(
        `   ${producto.nombre} - $${producto.precio} (${producto.categoria})`
      );
    });

    // TODO: Stock bajo (menos de 20 unidades)
    const stockBajo = db.prepare(`
            SELECT nombre, stock
            FROM productos
            WHERE stock < 20
            ORDER BY stock ASC
        `);

    console.log('\n⚠️  Productos con stock bajo:');
    const bajo = stockBajo.all();
    bajo.forEach(producto => {
      console.log(`   ${producto.nombre}: ${producto.stock} unidades`);
    });

    // TODO: Últimos productos agregados
    const ultimosProductos = db.prepare(`
            SELECT nombre, created_at
            FROM productos
            ORDER BY created_at DESC
            LIMIT 3
        `);

    console.log('\n🆕 Últimos productos agregados:');
    const ultimos = ultimosProductos.all();
    ultimos.forEach(producto => {
      console.log(`   ${producto.nombre} - ${producto.created_at}`);
    });
  } catch (error) {
    console.error('❌ Error en consultas básicas:', error);
  }
}

// 5. Funciones de utilidad
function obtenerEstadisticasDB() {
  // TODO: Implementar función que devuelva estadísticas de la DB
  try {
    const stats = {
      totalCategorias: db
        .prepare('SELECT COUNT(*) as count FROM categorias')
        .get().count,
      totalProductos: db
        .prepare('SELECT COUNT(*) as count FROM productos')
        .get().count,
      totalClientes: db.prepare('SELECT COUNT(*) as count FROM clientes').get()
        .count,
      promedioPrecios: db
        .prepare('SELECT AVG(precio) as avg FROM productos')
        .get().avg,
      stockTotal: db.prepare('SELECT SUM(stock) as total FROM productos').get()
        .total,
    };

    console.log('\n📈 Estadísticas de la base de datos:');
    console.log(`   Total Categorías: ${stats.totalCategorias}`);
    console.log(`   Total Productos: ${stats.totalProductos}`);
    console.log(`   Total Clientes: ${stats.totalClientes}`);
    console.log(
      `   Precio Promedio: $${stats.promedioPrecios?.toFixed(2) || 0}`
    );
    console.log(`   Stock Total: ${stats.stockTotal} unidades`);

    return stats;
  } catch (error) {
    console.error('❌ Error al obtener estadísticas:', error);
    return null;
  }
}

// 6. Backup y restore
function crearBackup() {
  // TODO: Implementar función de backup
  try {
    const backupPath = path.join(__dirname, `backup_${Date.now()}.db`);
    const backup = new Database(backupPath);

    db.backup(backup);
    backup.close();

    console.log(`✅ Backup creado: ${backupPath}`);
    return backupPath;
  } catch (error) {
    console.error('❌ Error al crear backup:', error);
    return null;
  }
}

// 7. Cleanup y cierre
function cerrarDB() {
  if (db) {
    db.close();
    console.log('✅ Conexión a la base de datos cerrada');
  }
}

// Manejo de señales para cerrar DB correctamente
process.on('SIGINT', () => {
  console.log('\n🔄 Cerrando aplicación...');
  cerrarDB();
  process.exit(0);
});

// 8. Tests básicos
function ejecutarTests() {
  console.log('\n🧪 Ejecutando tests básicos...');

  try {
    // Test 1: Verificar que las tablas existen
    const tablas = db
      .prepare(
        `
            SELECT name FROM sqlite_master 
            WHERE type='table' AND name NOT LIKE 'sqlite_%'
        `
      )
      .all();

    console.log(`✅ Test 1: ${tablas.length} tablas creadas`);

    // Test 2: Verificar datos insertados
    const productos = db
      .prepare('SELECT COUNT(*) as count FROM productos')
      .get();
    console.log(`✅ Test 2: ${productos.count} productos insertados`);

    // Test 3: Verificar relaciones
    const productosConCategoria = db
      .prepare(
        `
            SELECT COUNT(*) as count FROM productos p
            JOIN categorias c ON p.categoria_id = c.id
        `
      )
      .get();
    console.log(
      `✅ Test 3: ${productosConCategoria.count} productos con categoría`
    );

    // Test 4: Verificar constraints
    try {
      db.prepare('INSERT INTO productos (nombre, precio) VALUES (?, ?)').run(
        'Test',
        -10
      );
      console.log('❌ Test 4: Constraint de precio no funcionó');
    } catch (error) {
      console.log('✅ Test 4: Constraint de precio funcionando');
    }

    console.log('\n🎉 Todos los tests completados');
  } catch (error) {
    console.error('❌ Error en tests:', error);
  }
}

// Ejecutar todo
async function main() {
  crearTablas();
  insertarDatosEjemplo();
  consultasBasicas();
  obtenerEstadisticasDB();
  ejecutarTests();

  // Crear backup
  const backupPath = crearBackup();
  if (backupPath) {
    console.log(`\n💾 Backup disponible en: ${backupPath}`);
  }
}

// Exportar para usar en otros archivos
module.exports = {
  db,
  crearTablas,
  insertarDatosEjemplo,
  consultasBasicas,
  obtenerEstadisticasDB,
  crearBackup,
  cerrarDB,
};

// Ejecutar si es el archivo principal
if (require.main === module) {
  main();
}

/* 
🎯 RETO ADICIONAL:
1. Implementa índices para optimizar consultas
2. Crea triggers para actualizar timestamps
3. Implementa stored procedures (funciones SQL)
4. Agrega más constraints y validaciones
5. Implementa soft deletes (eliminar lógico)

📝 NOTAS:
- SQLite es perfecta para desarrollo y prototipado
- Usa transacciones para operaciones múltiples
- Implementa proper error handling
- Considera performance para consultas complejas
- Siempre cierra conexiones correctamente
*/
