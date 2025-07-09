// 🔍 Ejercicio 3: SQL Queries y Data Modeling
// Objetivo: Implementar consultas SQL complejas y modelado de datos

console.log('🎯 Ejercicio 3: SQL Queries y Data Modeling');

const Database = require('better-sqlite3');
const path = require('path');

// Usar la base de datos del ejercicio anterior
const dbPath = path.join(__dirname, 'tienda.db');
const db = new Database(dbPath);

// 1. Consultas de agregación
console.log('\n📊 Consultas de Agregación');

// TODO: Implementar consulta de ventas por categoría
function ventasPorCategoria() {
  const query = `
        SELECT 
            c.nombre as categoria,
            COUNT(dp.id) as total_ventas,
            SUM(dp.cantidad) as productos_vendidos,
            SUM(dp.subtotal) as ingresos_totales,
            AVG(dp.precio_unitario) as precio_promedio
        FROM categorias c
        LEFT JOIN productos p ON c.id = p.categoria_id
        LEFT JOIN detalle_pedidos dp ON p.id = dp.producto_id
        GROUP BY c.id, c.nombre
        ORDER BY ingresos_totales DESC
    `;

  try {
    const stmt = db.prepare(query);
    const resultados = stmt.all();

    console.log('\n💰 Ventas por categoría:');
    resultados.forEach(row => {
      console.log(`   ${row.categoria}:`);
      console.log(`      Ventas: ${row.total_ventas}`);
      console.log(`      Productos vendidos: ${row.productos_vendidos || 0}`);
      console.log(`      Ingresos: $${(row.ingresos_totales || 0).toFixed(2)}`);
      console.log(
        `      Precio promedio: $${(row.precio_promedio || 0).toFixed(2)}`
      );
    });

    return resultados;
  } catch (error) {
    console.error('❌ Error en ventasPorCategoria:', error);
    return [];
  }
}

// TODO: Implementar consulta de clientes top
function clientesTop() {
  const query = `
        SELECT 
            c.nombre,
            c.email,
            COUNT(p.id) as total_pedidos,
            SUM(p.total) as total_gastado,
            AVG(p.total) as promedio_por_pedido,
            MAX(p.fecha_pedido) as ultimo_pedido
        FROM clientes c
        LEFT JOIN pedidos p ON c.id = p.cliente_id
        GROUP BY c.id, c.nombre, c.email
        HAVING COUNT(p.id) > 0
        ORDER BY total_gastado DESC
        LIMIT 5
    `;

  try {
    const stmt = db.prepare(query);
    const resultados = stmt.all();

    console.log('\n🏆 Top 5 clientes:');
    resultados.forEach((cliente, index) => {
      console.log(`   ${index + 1}. ${cliente.nombre} (${cliente.email})`);
      console.log(`      Pedidos: ${cliente.total_pedidos}`);
      console.log(`      Total gastado: $${cliente.total_gastado.toFixed(2)}`);
      console.log(
        `      Promedio por pedido: $${cliente.promedio_por_pedido.toFixed(2)}`
      );
      console.log(`      Último pedido: ${cliente.ultimo_pedido}`);
    });

    return resultados;
  } catch (error) {
    console.error('❌ Error en clientesTop:', error);
    return [];
  }
}

// 2. Consultas con JOINs complejos
console.log('\n🔗 Consultas con JOINs');

// TODO: Implementar consulta de productos más vendidos
function productosMasVendidos() {
  const query = `
        SELECT 
            p.nombre,
            p.precio,
            c.nombre as categoria,
            COALESCE(SUM(dp.cantidad), 0) as total_vendido,
            COALESCE(SUM(dp.subtotal), 0) as ingresos_generados,
            p.stock as stock_actual
        FROM productos p
        JOIN categorias c ON p.categoria_id = c.id
        LEFT JOIN detalle_pedidos dp ON p.id = dp.producto_id
        GROUP BY p.id, p.nombre, p.precio, c.nombre, p.stock
        ORDER BY total_vendido DESC
        LIMIT 10
    `;

  try {
    const stmt = db.prepare(query);
    const resultados = stmt.all();

    console.log('\n🎯 Top 10 productos más vendidos:');
    resultados.forEach((producto, index) => {
      console.log(
        `   ${index + 1}. ${producto.nombre} (${producto.categoria})`
      );
      console.log(`      Precio: $${producto.precio}`);
      console.log(`      Vendido: ${producto.total_vendido} unidades`);
      console.log(`      Ingresos: $${producto.ingresos_generados.toFixed(2)}`);
      console.log(`      Stock actual: ${producto.stock_actual}`);
    });

    return resultados;
  } catch (error) {
    console.error('❌ Error en productosMasVendidos:', error);
    return [];
  }
}

// TODO: Implementar consulta de pedidos completos
function pedidosCompletos() {
  const query = `
        SELECT 
            p.id as pedido_id,
            c.nombre as cliente,
            p.total as total_pedido,
            p.estado,
            p.fecha_pedido,
            GROUP_CONCAT(
                prod.nombre || ' (x' || dp.cantidad || ')',
                ', '
            ) as productos
        FROM pedidos p
        JOIN clientes c ON p.cliente_id = c.id
        JOIN detalle_pedidos dp ON p.id = dp.pedido_id
        JOIN productos prod ON dp.producto_id = prod.id
        GROUP BY p.id, c.nombre, p.total, p.estado, p.fecha_pedido
        ORDER BY p.fecha_pedido DESC
        LIMIT 5
    `;

  try {
    const stmt = db.prepare(query);
    const resultados = stmt.all();

    console.log('\n📋 Últimos 5 pedidos completos:');
    resultados.forEach(pedido => {
      console.log(`   Pedido #${pedido.pedido_id} - ${pedido.cliente}`);
      console.log(`      Total: $${pedido.total_pedido}`);
      console.log(`      Estado: ${pedido.estado}`);
      console.log(`      Fecha: ${pedido.fecha_pedido}`);
      console.log(`      Productos: ${pedido.productos}`);
    });

    return resultados;
  } catch (error) {
    console.error('❌ Error en pedidosCompletos:', error);
    return [];
  }
}

// 3. Consultas con subconsultas
console.log('\n🔄 Consultas con Subconsultas');

// TODO: Implementar consulta de productos sin ventas
function productosSinVentas() {
  const query = `
        SELECT 
            p.nombre,
            p.precio,
            c.nombre as categoria,
            p.stock
        FROM productos p
        JOIN categorias c ON p.categoria_id = c.id
        WHERE p.id NOT IN (
            SELECT DISTINCT producto_id 
            FROM detalle_pedidos
        )
        ORDER BY p.precio DESC
    `;

  try {
    const stmt = db.prepare(query);
    const resultados = stmt.all();

    console.log('\n🚫 Productos sin ventas:');
    if (resultados.length === 0) {
      console.log('   ¡Excelente! Todos los productos han tenido ventas.');
    } else {
      resultados.forEach(producto => {
        console.log(`   ${producto.nombre} (${producto.categoria})`);
        console.log(`      Precio: $${producto.precio}`);
        console.log(`      Stock: ${producto.stock}`);
      });
    }

    return resultados;
  } catch (error) {
    console.error('❌ Error en productosSinVentas:', error);
    return [];
  }
}

// TODO: Implementar consulta de clientes con compras superiores al promedio
function clientesSuperioresPromedio() {
  const query = `
        SELECT 
            c.nombre,
            c.email,
            SUM(p.total) as total_gastado,
            COUNT(p.id) as total_pedidos
        FROM clientes c
        JOIN pedidos p ON c.id = p.cliente_id
        GROUP BY c.id, c.nombre, c.email
        HAVING SUM(p.total) > (
            SELECT AVG(total_por_cliente)
            FROM (
                SELECT SUM(total) as total_por_cliente
                FROM pedidos
                GROUP BY cliente_id
            )
        )
        ORDER BY total_gastado DESC
    `;

  try {
    const stmt = db.prepare(query);
    const resultados = stmt.all();

    console.log('\n📈 Clientes con compras superiores al promedio:');
    resultados.forEach(cliente => {
      console.log(`   ${cliente.nombre} (${cliente.email})`);
      console.log(`      Total gastado: $${cliente.total_gastado.toFixed(2)}`);
      console.log(`      Total pedidos: ${cliente.total_pedidos}`);
    });

    return resultados;
  } catch (error) {
    console.error('❌ Error en clientesSuperioresPromedio:', error);
    return [];
  }
}

// 4. Consultas con funciones de ventana (Window Functions)
console.log('\n🪟 Consultas con Window Functions');

// TODO: Implementar ranking de productos por categoría
function rankingProductosPorCategoria() {
  const query = `
        SELECT 
            p.nombre,
            c.nombre as categoria,
            p.precio,
            COALESCE(SUM(dp.cantidad), 0) as total_vendido,
            RANK() OVER (
                PARTITION BY c.id 
                ORDER BY COALESCE(SUM(dp.cantidad), 0) DESC
            ) as ranking_en_categoria
        FROM productos p
        JOIN categorias c ON p.categoria_id = c.id
        LEFT JOIN detalle_pedidos dp ON p.id = dp.producto_id
        GROUP BY p.id, p.nombre, c.id, c.nombre, p.precio
        ORDER BY c.nombre, ranking_en_categoria
    `;

  try {
    const stmt = db.prepare(query);
    const resultados = stmt.all();

    console.log('\n🏅 Ranking de productos por categoría:');
    let categoriaActual = '';
    resultados.forEach(producto => {
      if (producto.categoria !== categoriaActual) {
        categoriaActual = producto.categoria;
        console.log(`\n   📂 ${categoriaActual}:`);
      }
      console.log(`      ${producto.ranking_en_categoria}. ${producto.nombre}`);
      console.log(
        `         Precio: $${producto.precio} | Vendidos: ${producto.total_vendido}`
      );
    });

    return resultados;
  } catch (error) {
    console.error('❌ Error en rankingProductosPorCategoria:', error);
    return [];
  }
}

// 5. Consultas de análisis temporal
console.log('\n📅 Análisis Temporal');

// TODO: Implementar análisis de ventas mensuales
function ventasMensuales() {
  const query = `
        SELECT 
            strftime('%Y-%m', p.fecha_pedido) as mes,
            COUNT(p.id) as total_pedidos,
            SUM(p.total) as ingresos_totales,
            AVG(p.total) as promedio_pedido,
            COUNT(DISTINCT p.cliente_id) as clientes_unicos
        FROM pedidos p
        WHERE p.fecha_pedido >= date('now', '-12 months')
        GROUP BY strftime('%Y-%m', p.fecha_pedido)
        ORDER BY mes DESC
    `;

  try {
    const stmt = db.prepare(query);
    const resultados = stmt.all();

    console.log('\n📊 Ventas mensuales (últimos 12 meses):');
    resultados.forEach(mes => {
      console.log(`   ${mes.mes}:`);
      console.log(`      Pedidos: ${mes.total_pedidos}`);
      console.log(`      Ingresos: $${mes.ingresos_totales.toFixed(2)}`);
      console.log(
        `      Promedio por pedido: $${mes.promedio_pedido.toFixed(2)}`
      );
      console.log(`      Clientes únicos: ${mes.clientes_unicos}`);
    });

    return resultados;
  } catch (error) {
    console.error('❌ Error en ventasMensuales:', error);
    return [];
  }
}

// 6. Consultas de inventario
console.log('\n📦 Análisis de Inventario');

// TODO: Implementar análisis de stock
function analisisStock() {
  const queries = {
    stockBajo: `
            SELECT p.nombre, p.stock, c.nombre as categoria
            FROM productos p
            JOIN categorias c ON p.categoria_id = c.id
            WHERE p.stock < 10
            ORDER BY p.stock ASC
        `,
    stockAlto: `
            SELECT p.nombre, p.stock, c.nombre as categoria
            FROM productos p
            JOIN categorias c ON p.categoria_id = c.id
            WHERE p.stock > 50
            ORDER BY p.stock DESC
        `,
    valorInventario: `
            SELECT 
                c.nombre as categoria,
                SUM(p.stock * p.precio) as valor_inventario,
                COUNT(p.id) as total_productos,
                SUM(p.stock) as unidades_totales
            FROM productos p
            JOIN categorias c ON p.categoria_id = c.id
            GROUP BY c.id, c.nombre
            ORDER BY valor_inventario DESC
        `,
  };

  try {
    // Stock bajo
    const stockBajo = db.prepare(queries.stockBajo).all();
    console.log('\n⚠️  Productos con stock bajo (< 10):');
    stockBajo.forEach(p => {
      console.log(`   ${p.nombre} (${p.categoria}): ${p.stock} unidades`);
    });

    // Stock alto
    const stockAlto = db.prepare(queries.stockAlto).all();
    console.log('\n📈 Productos con stock alto (> 50):');
    stockAlto.forEach(p => {
      console.log(`   ${p.nombre} (${p.categoria}): ${p.stock} unidades`);
    });

    // Valor del inventario
    const valorInventario = db.prepare(queries.valorInventario).all();
    console.log('\n💰 Valor del inventario por categoría:');
    valorInventario.forEach(cat => {
      console.log(`   ${cat.categoria}:`);
      console.log(`      Valor: $${cat.valor_inventario.toFixed(2)}`);
      console.log(`      Productos: ${cat.total_productos}`);
      console.log(`      Unidades: ${cat.unidades_totales}`);
    });

    return { stockBajo, stockAlto, valorInventario };
  } catch (error) {
    console.error('❌ Error en analisisStock:', error);
    return null;
  }
}

// 7. Consultas de optimización
console.log('\n⚡ Consultas de Optimización');

// TODO: Implementar función para crear índices
function crearIndices() {
  const indices = [
    'CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos(categoria_id)',
    'CREATE INDEX IF NOT EXISTS idx_productos_precio ON productos(precio)',
    'CREATE INDEX IF NOT EXISTS idx_pedidos_cliente ON pedidos(cliente_id)',
    'CREATE INDEX IF NOT EXISTS idx_pedidos_fecha ON pedidos(fecha_pedido)',
    'CREATE INDEX IF NOT EXISTS idx_detalle_pedido ON detalle_pedidos(pedido_id)',
    'CREATE INDEX IF NOT EXISTS idx_detalle_producto ON detalle_pedidos(producto_id)',
    'CREATE INDEX IF NOT EXISTS idx_clientes_email ON clientes(email)',
  ];

  try {
    indices.forEach(sql => {
      db.exec(sql);
    });
    console.log('✅ Índices creados para optimizar consultas');
  } catch (error) {
    console.error('❌ Error al crear índices:', error);
  }
}

// TODO: Implementar función para analizar performance
function analizarPerformance() {
  const queries = [
    {
      nombre: 'Productos por categoría',
      sql: 'SELECT COUNT(*) FROM productos GROUP BY categoria_id',
    },
    {
      nombre: 'Pedidos por cliente',
      sql: 'SELECT COUNT(*) FROM pedidos GROUP BY cliente_id',
    },
    { nombre: 'Ventas totales', sql: 'SELECT SUM(total) FROM pedidos' },
  ];

  console.log('\n📊 Análisis de performance:');
  queries.forEach(q => {
    const start = process.hrtime();
    try {
      const result = db.prepare(q.sql).all();
      const end = process.hrtime(start);
      const timeMs = (end[0] * 1000 + end[1] / 1000000).toFixed(2);
      console.log(`   ${q.nombre}: ${timeMs}ms (${result.length} resultados)`);
    } catch (error) {
      console.log(`   ${q.nombre}: Error - ${error.message}`);
    }
  });
}

// 8. Funciones de utilidad para modelado
function obtenerEsquemaTabla(tabla) {
  try {
    const schema = db.prepare(`PRAGMA table_info(${tabla})`).all();
    console.log(`\n📋 Esquema de la tabla ${tabla}:`);
    schema.forEach(col => {
      console.log(
        `   ${col.name}: ${col.type}${col.notnull ? ' NOT NULL' : ''}${
          col.pk ? ' PRIMARY KEY' : ''
        }`
      );
    });
    return schema;
  } catch (error) {
    console.error(`❌ Error al obtener esquema de ${tabla}:`, error);
    return null;
  }
}

// 9. Generar datos de prueba para pedidos
function generarPedidosPrueba() {
  console.log('\n🔄 Generando pedidos de prueba...');

  try {
    // Obtener clientes y productos
    const clientes = db.prepare('SELECT id FROM clientes').all();
    const productos = db.prepare('SELECT id, precio FROM productos').all();

    if (clientes.length === 0 || productos.length === 0) {
      console.log('❌ No hay suficientes datos para generar pedidos');
      return;
    }

    const insertPedido = db.prepare(`
            INSERT INTO pedidos (cliente_id, total, estado, fecha_pedido) 
            VALUES (?, ?, ?, ?)
        `);

    const insertDetalle = db.prepare(`
            INSERT INTO detalle_pedidos (pedido_id, producto_id, cantidad, precio_unitario, subtotal)
            VALUES (?, ?, ?, ?, ?)
        `);

    // Generar 10 pedidos aleatorios
    const transaction = db.transaction(() => {
      for (let i = 0; i < 10; i++) {
        const cliente = clientes[Math.floor(Math.random() * clientes.length)];
        const fechaPedido = new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
        );

        let totalPedido = 0;

        // Crear pedido
        const pedido = insertPedido.run(
          cliente.id,
          0, // Se actualizará después
          'completado',
          fechaPedido.toISOString()
        );

        // Agregar 1-5 productos al pedido
        const numProductos = Math.floor(Math.random() * 5) + 1;
        for (let j = 0; j < numProductos; j++) {
          const producto =
            productos[Math.floor(Math.random() * productos.length)];
          const cantidad = Math.floor(Math.random() * 3) + 1;
          const precioUnitario = producto.precio;
          const subtotal = cantidad * precioUnitario;

          insertDetalle.run(
            pedido.lastInsertRowid,
            producto.id,
            cantidad,
            precioUnitario,
            subtotal
          );

          totalPedido += subtotal;
        }

        // Actualizar total del pedido
        db.prepare('UPDATE pedidos SET total = ? WHERE id = ?').run(
          totalPedido,
          pedido.lastInsertRowid
        );
      }
    });

    transaction();
    console.log('✅ 10 pedidos de prueba generados exitosamente');
  } catch (error) {
    console.error('❌ Error al generar pedidos de prueba:', error);
  }
}

// 10. Función principal para ejecutar todas las consultas
async function ejecutarTodasConsultas() {
  console.log('\n🚀 Ejecutando todas las consultas...');

  // Crear índices primero
  crearIndices();

  // Generar datos de prueba
  generarPedidosPrueba();

  // Ejecutar consultas
  ventasPorCategoria();
  clientesTop();
  productosMasVendidos();
  pedidosCompletos();
  productosSinVentas();
  clientesSuperioresPromedio();
  rankingProductosPorCategoria();
  ventasMensuales();
  analisisStock();
  analizarPerformance();

  // Mostrar esquemas
  ['productos', 'categorias', 'clientes', 'pedidos', 'detalle_pedidos'].forEach(
    tabla => {
      obtenerEsquemaTabla(tabla);
    }
  );

  console.log('\n🎉 Todas las consultas ejecutadas exitosamente');
}

// Exportar funciones
module.exports = {
  ventasPorCategoria,
  clientesTop,
  productosMasVendidos,
  pedidosCompletos,
  productosSinVentas,
  clientesSuperioresPromedio,
  rankingProductosPorCategoria,
  ventasMensuales,
  analisisStock,
  crearIndices,
  analizarPerformance,
  obtenerEsquemaTabla,
  generarPedidosPrueba,
  ejecutarTodasConsultas,
};

// Ejecutar si es el archivo principal
if (require.main === module) {
  ejecutarTodasConsultas();
}

/* 
🎯 RETO ADICIONAL:
1. Implementa consultas con CTEs (Common Table Expressions)
2. Crea consultas para análisis de cohorts
3. Implementa consultas de forecasting básico
4. Agrega consultas para detección de patrones
5. Implementa consultas de análisis de sesiones

📝 NOTAS:
- Usa índices para optimizar consultas complejas
- Implementa paginación para consultas con muchos resultados
- Considera usar vistas para consultas frecuentes
- Monitorea el performance de las consultas
- Usa transacciones para operaciones críticas
*/
