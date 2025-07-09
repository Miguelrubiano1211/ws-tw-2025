// 🛠️ Ejercicio 4: ORM Basics (better-sqlite3)
// Objetivo: Crear modelos con better-sqlite3 y patrones ORM

console.log('🎯 Ejercicio 4: ORM Basics con better-sqlite3');

const Database = require('better-sqlite3');
const path = require('path');

// Configuración de la base de datos
const dbPath = path.join(__dirname, 'tienda.db');
const db = new Database(dbPath);

// Configurar para mejor rendimiento
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// 1. Clase base para modelos (BaseModel)
class BaseModel {
  constructor(tableName) {
    this.tableName = tableName;
    this.db = db;
    this.preparedStatements = {};
  }

  // Método para preparar statements (mejora performance)
  prepareStatement(key, sql) {
    if (!this.preparedStatements[key]) {
      this.preparedStatements[key] = this.db.prepare(sql);
    }
    return this.preparedStatements[key];
  }

  // TODO: Implementar findAll con filtros y paginación
  findAll(filters = {}, options = {}) {
    try {
      const { limit = 50, offset = 0, orderBy = 'id', order = 'ASC' } = options;

      let sql = `SELECT * FROM ${this.tableName}`;
      let params = [];

      // Agregar filtros WHERE
      if (Object.keys(filters).length > 0) {
        const whereConditions = Object.keys(filters).map(key => {
          params.push(filters[key]);
          return `${key} = ?`;
        });
        sql += ` WHERE ${whereConditions.join(' AND ')}`;
      }

      // Agregar ORDER BY
      sql += ` ORDER BY ${orderBy} ${order}`;

      // Agregar LIMIT y OFFSET
      sql += ` LIMIT ? OFFSET ?`;
      params.push(limit, offset);

      const stmt = this.prepareStatement(
        `findAll_${JSON.stringify(filters)}_${JSON.stringify(options)}`,
        sql
      );
      return stmt.all(params);
    } catch (error) {
      console.error(`❌ Error en findAll de ${this.tableName}:`, error);
      return [];
    }
  }

  // TODO: Implementar findById
  findById(id) {
    try {
      const stmt = this.prepareStatement(
        'findById',
        `SELECT * FROM ${this.tableName} WHERE id = ?`
      );
      return stmt.get(id);
    } catch (error) {
      console.error(`❌ Error en findById de ${this.tableName}:`, error);
      return null;
    }
  }

  // TODO: Implementar findOne con filtros
  findOne(filters = {}) {
    try {
      const whereConditions = Object.keys(filters).map(key => `${key} = ?`);
      const sql = `SELECT * FROM ${this.tableName} WHERE ${whereConditions.join(
        ' AND '
      )} LIMIT 1`;

      const stmt = this.prepareStatement(
        `findOne_${JSON.stringify(filters)}`,
        sql
      );
      return stmt.get(Object.values(filters));
    } catch (error) {
      console.error(`❌ Error en findOne de ${this.tableName}:`, error);
      return null;
    }
  }

  // TODO: Implementar create
  create(data) {
    try {
      const keys = Object.keys(data);
      const placeholders = keys.map(() => '?').join(', ');
      const sql = `INSERT INTO ${this.tableName} (${keys.join(
        ', '
      )}) VALUES (${placeholders})`;

      const stmt = this.prepareStatement('create', sql);
      const result = stmt.run(Object.values(data));

      // Devolver el registro creado
      return this.findById(result.lastInsertRowid);
    } catch (error) {
      console.error(`❌ Error en create de ${this.tableName}:`, error);
      return null;
    }
  }

  // TODO: Implementar update
  update(id, data) {
    try {
      const keys = Object.keys(data);
      const setClause = keys.map(key => `${key} = ?`).join(', ');
      const sql = `UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`;

      const stmt = this.prepareStatement('update', sql);
      const result = stmt.run([...Object.values(data), id]);

      return result.changes > 0;
    } catch (error) {
      console.error(`❌ Error en update de ${this.tableName}:`, error);
      return false;
    }
  }

  // TODO: Implementar delete
  delete(id) {
    try {
      const stmt = this.prepareStatement(
        'delete',
        `DELETE FROM ${this.tableName} WHERE id = ?`
      );
      const result = stmt.run(id);

      return result.changes > 0;
    } catch (error) {
      console.error(`❌ Error en delete de ${this.tableName}:`, error);
      return false;
    }
  }

  // TODO: Implementar count
  count(filters = {}) {
    try {
      let sql = `SELECT COUNT(*) as total FROM ${this.tableName}`;
      let params = [];

      if (Object.keys(filters).length > 0) {
        const whereConditions = Object.keys(filters).map(key => {
          params.push(filters[key]);
          return `${key} = ?`;
        });
        sql += ` WHERE ${whereConditions.join(' AND ')}`;
      }

      const stmt = this.prepareStatement(
        `count_${JSON.stringify(filters)}`,
        sql
      );
      const result = stmt.get(params);
      return result.total;
    } catch (error) {
      console.error(`❌ Error en count de ${this.tableName}:`, error);
      return 0;
    }
  }

  // TODO: Implementar exists
  exists(filters = {}) {
    return this.count(filters) > 0;
  }

  // TODO: Implementar transaction wrapper
  transaction(callback) {
    const transaction = this.db.transaction(callback);
    return transaction();
  }
}

// 2. Modelo para Categorías
class CategoriaModel extends BaseModel {
  constructor() {
    super('categorias');
  }

  // TODO: Implementar métodos específicos para categorías

  // Encontrar categorías activas
  findActivas() {
    return this.findAll({ activa: 1 });
  }

  // Encontrar categoría por nombre
  findByNombre(nombre) {
    return this.findOne({ nombre });
  }

  // Crear categoría con validación
  createCategoria(data) {
    // Validar datos
    if (!data.nombre || data.nombre.trim().length === 0) {
      throw new Error('El nombre de la categoría es requerido');
    }

    // Verificar que no exista
    const existente = this.findByNombre(data.nombre);
    if (existente) {
      throw new Error('Ya existe una categoría con ese nombre');
    }

    return this.create({
      nombre: data.nombre.trim(),
      descripcion: data.descripcion?.trim() || null,
      activa: data.activa !== undefined ? data.activa : 1,
    });
  }

  // Obtener productos por categoría
  getProductos(categoriaId) {
    try {
      const stmt = this.prepareStatement(
        'getProductos',
        `
                SELECT p.* FROM productos p 
                WHERE p.categoria_id = ? AND p.activo = 1
                ORDER BY p.nombre
            `
      );
      return stmt.all(categoriaId);
    } catch (error) {
      console.error('❌ Error al obtener productos de categoría:', error);
      return [];
    }
  }

  // Estadísticas de categoría
  getEstadisticas(categoriaId) {
    try {
      const stmt = this.prepareStatement(
        'getEstadisticas',
        `
                SELECT 
                    c.nombre as categoria,
                    COUNT(p.id) as total_productos,
                    SUM(p.stock) as stock_total,
                    AVG(p.precio) as precio_promedio,
                    MIN(p.precio) as precio_minimo,
                    MAX(p.precio) as precio_maximo
                FROM categorias c
                LEFT JOIN productos p ON c.id = p.categoria_id AND p.activo = 1
                WHERE c.id = ?
                GROUP BY c.id, c.nombre
            `
      );
      return stmt.get(categoriaId);
    } catch (error) {
      console.error('❌ Error al obtener estadísticas de categoría:', error);
      return null;
    }
  }
}

// 3. Modelo para Productos
class ProductoModel extends BaseModel {
  constructor() {
    super('productos');
  }

  // TODO: Implementar métodos específicos para productos

  // Encontrar productos activos
  findActivos() {
    return this.findAll({ activo: 1 });
  }

  // Buscar productos por nombre
  searchByNombre(termino) {
    try {
      const stmt = this.prepareStatement(
        'searchByNombre',
        `
                SELECT p.*, c.nombre as categoria_nombre
                FROM productos p
                LEFT JOIN categorias c ON p.categoria_id = c.id
                WHERE p.nombre LIKE ? AND p.activo = 1
                ORDER BY p.nombre
            `
      );
      return stmt.all(`%${termino}%`);
    } catch (error) {
      console.error('❌ Error en búsqueda de productos:', error);
      return [];
    }
  }

  // Filtrar productos
  filter(filters = {}) {
    try {
      let sql = `
                SELECT p.*, c.nombre as categoria_nombre
                FROM productos p
                LEFT JOIN categorias c ON p.categoria_id = c.id
                WHERE p.activo = 1
            `;
      let params = [];

      // Filtro por categoría
      if (filters.categoria_id) {
        sql += ` AND p.categoria_id = ?`;
        params.push(filters.categoria_id);
      }

      // Filtro por rango de precios
      if (filters.precio_min) {
        sql += ` AND p.precio >= ?`;
        params.push(filters.precio_min);
      }

      if (filters.precio_max) {
        sql += ` AND p.precio <= ?`;
        params.push(filters.precio_max);
      }

      // Filtro por stock
      if (filters.en_stock) {
        sql += ` AND p.stock > 0`;
      }

      // Filtro por nombre
      if (filters.nombre) {
        sql += ` AND p.nombre LIKE ?`;
        params.push(`%${filters.nombre}%`);
      }

      // Ordenamiento
      const orderBy = filters.orderBy || 'nombre';
      const order = filters.order || 'ASC';
      sql += ` ORDER BY p.${orderBy} ${order}`;

      // Paginación
      if (filters.limit) {
        sql += ` LIMIT ?`;
        params.push(filters.limit);

        if (filters.offset) {
          sql += ` OFFSET ?`;
          params.push(filters.offset);
        }
      }

      const stmt = this.prepareStatement(
        `filter_${JSON.stringify(filters)}`,
        sql
      );
      return stmt.all(params);
    } catch (error) {
      console.error('❌ Error al filtrar productos:', error);
      return [];
    }
  }

  // Crear producto con validación
  createProducto(data) {
    // Validaciones
    if (!data.nombre || data.nombre.trim().length === 0) {
      throw new Error('El nombre del producto es requerido');
    }

    if (!data.precio || data.precio <= 0) {
      throw new Error('El precio debe ser mayor a 0');
    }

    if (data.stock && data.stock < 0) {
      throw new Error('El stock no puede ser negativo');
    }

    // Verificar que la categoría existe
    if (data.categoria_id) {
      const categoriaModel = new CategoriaModel();
      const categoria = categoriaModel.findById(data.categoria_id);
      if (!categoria) {
        throw new Error('La categoría especificada no existe');
      }
    }

    return this.create({
      nombre: data.nombre.trim(),
      descripcion: data.descripcion?.trim() || null,
      precio: parseFloat(data.precio),
      stock: parseInt(data.stock) || 0,
      categoria_id: data.categoria_id || null,
      activo: data.activo !== undefined ? data.activo : 1,
    });
  }

  // Actualizar stock
  updateStock(id, nuevoStock) {
    if (nuevoStock < 0) {
      throw new Error('El stock no puede ser negativo');
    }

    return this.update(id, {
      stock: nuevoStock,
      updated_at: new Date().toISOString(),
    });
  }

  // Reducir stock (para ventas)
  reducirStock(id, cantidad) {
    const producto = this.findById(id);
    if (!producto) {
      throw new Error('Producto no encontrado');
    }

    if (producto.stock < cantidad) {
      throw new Error('Stock insuficiente');
    }

    return this.updateStock(id, producto.stock - cantidad);
  }

  // Obtener productos con stock bajo
  getStockBajo(limite = 10) {
    try {
      const stmt = this.prepareStatement(
        'getStockBajo',
        `
                SELECT p.*, c.nombre as categoria_nombre
                FROM productos p
                LEFT JOIN categorias c ON p.categoria_id = c.id
                WHERE p.stock < ? AND p.activo = 1
                ORDER BY p.stock ASC
            `
      );
      return stmt.all(limite);
    } catch (error) {
      console.error('❌ Error al obtener productos con stock bajo:', error);
      return [];
    }
  }

  // Obtener productos más vendidos
  getMasVendidos(limite = 10) {
    try {
      const stmt = this.prepareStatement(
        'getMasVendidos',
        `
                SELECT 
                    p.*,
                    c.nombre as categoria_nombre,
                    COALESCE(SUM(dp.cantidad), 0) as total_vendido
                FROM productos p
                LEFT JOIN categorias c ON p.categoria_id = c.id
                LEFT JOIN detalle_pedidos dp ON p.id = dp.producto_id
                WHERE p.activo = 1
                GROUP BY p.id, p.nombre, c.nombre
                ORDER BY total_vendido DESC
                LIMIT ?
            `
      );
      return stmt.all(limite);
    } catch (error) {
      console.error('❌ Error al obtener productos más vendidos:', error);
      return [];
    }
  }
}

// 4. Modelo para Clientes
class ClienteModel extends BaseModel {
  constructor() {
    super('clientes');
  }

  // TODO: Implementar métodos específicos para clientes

  // Encontrar cliente por email
  findByEmail(email) {
    return this.findOne({ email });
  }

  // Crear cliente con validación
  createCliente(data) {
    // Validaciones
    if (!data.nombre || data.nombre.trim().length === 0) {
      throw new Error('El nombre es requerido');
    }

    if (!data.email || !this.isValidEmail(data.email)) {
      throw new Error('Email válido es requerido');
    }

    // Verificar email único
    const existente = this.findByEmail(data.email);
    if (existente) {
      throw new Error('Ya existe un cliente con ese email');
    }

    return this.create({
      nombre: data.nombre.trim(),
      email: data.email.toLowerCase().trim(),
      telefono: data.telefono?.trim() || null,
      direccion: data.direccion?.trim() || null,
      activo: data.activo !== undefined ? data.activo : 1,
    });
  }

  // Validar email
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Obtener pedidos del cliente
  getPedidos(clienteId) {
    try {
      const stmt = this.prepareStatement(
        'getPedidos',
        `
                SELECT p.*, 
                       COUNT(dp.id) as total_items,
                       SUM(dp.cantidad) as total_productos
                FROM pedidos p
                LEFT JOIN detalle_pedidos dp ON p.id = dp.pedido_id
                WHERE p.cliente_id = ?
                GROUP BY p.id
                ORDER BY p.fecha_pedido DESC
            `
      );
      return stmt.all(clienteId);
    } catch (error) {
      console.error('❌ Error al obtener pedidos del cliente:', error);
      return [];
    }
  }

  // Estadísticas del cliente
  getEstadisticas(clienteId) {
    try {
      const stmt = this.prepareStatement(
        'getEstadisticas',
        `
                SELECT 
                    c.nombre,
                    c.email,
                    COUNT(p.id) as total_pedidos,
                    COALESCE(SUM(p.total), 0) as total_gastado,
                    COALESCE(AVG(p.total), 0) as promedio_pedido,
                    MAX(p.fecha_pedido) as ultimo_pedido,
                    MIN(p.fecha_pedido) as primer_pedido
                FROM clientes c
                LEFT JOIN pedidos p ON c.id = p.cliente_id
                WHERE c.id = ?
                GROUP BY c.id, c.nombre, c.email
            `
      );
      return stmt.get(clienteId);
    } catch (error) {
      console.error('❌ Error al obtener estadísticas del cliente:', error);
      return null;
    }
  }
}

// 5. Modelo para Pedidos
class PedidoModel extends BaseModel {
  constructor() {
    super('pedidos');
  }

  // TODO: Implementar métodos específicos para pedidos

  // Crear pedido completo con detalles
  createPedidoCompleto(clienteId, productos) {
    return this.transaction(() => {
      // Validar cliente
      const clienteModel = new ClienteModel();
      const cliente = clienteModel.findById(clienteId);
      if (!cliente) {
        throw new Error('Cliente no encontrado');
      }

      // Validar productos y calcular total
      const productoModel = new ProductoModel();
      let total = 0;
      const productosValidados = [];

      for (const item of productos) {
        const producto = productoModel.findById(item.producto_id);
        if (!producto) {
          throw new Error(`Producto con ID ${item.producto_id} no encontrado`);
        }

        if (producto.stock < item.cantidad) {
          throw new Error(`Stock insuficiente para ${producto.nombre}`);
        }

        const subtotal = item.cantidad * producto.precio;
        total += subtotal;

        productosValidados.push({
          producto_id: item.producto_id,
          cantidad: item.cantidad,
          precio_unitario: producto.precio,
          subtotal: subtotal,
        });
      }

      // Crear pedido
      const pedido = this.create({
        cliente_id: clienteId,
        total: total,
        estado: 'pendiente',
        fecha_pedido: new Date().toISOString(),
      });

      // Crear detalles del pedido
      const detalleModel = new DetallePedidoModel();
      for (const item of productosValidados) {
        detalleModel.create({
          pedido_id: pedido.id,
          ...item,
        });

        // Reducir stock
        productoModel.reducirStock(item.producto_id, item.cantidad);
      }

      return pedido;
    });
  }

  // Obtener pedido completo con detalles
  getPedidoCompleto(pedidoId) {
    try {
      const pedido = this.findById(pedidoId);
      if (!pedido) {
        return null;
      }

      // Obtener cliente
      const clienteModel = new ClienteModel();
      const cliente = clienteModel.findById(pedido.cliente_id);

      // Obtener detalles
      const detalles = this.getDetalles(pedidoId);

      return {
        ...pedido,
        cliente,
        detalles,
      };
    } catch (error) {
      console.error('❌ Error al obtener pedido completo:', error);
      return null;
    }
  }

  // Obtener detalles del pedido
  getDetalles(pedidoId) {
    try {
      const stmt = this.prepareStatement(
        'getDetalles',
        `
                SELECT 
                    dp.*,
                    p.nombre as producto_nombre,
                    p.descripcion as producto_descripcion
                FROM detalle_pedidos dp
                JOIN productos p ON dp.producto_id = p.id
                WHERE dp.pedido_id = ?
                ORDER BY dp.id
            `
      );
      return stmt.all(pedidoId);
    } catch (error) {
      console.error('❌ Error al obtener detalles del pedido:', error);
      return [];
    }
  }

  // Actualizar estado del pedido
  updateEstado(pedidoId, nuevoEstado) {
    const estadosValidos = [
      'pendiente',
      'procesando',
      'enviado',
      'entregado',
      'cancelado',
    ];
    if (!estadosValidos.includes(nuevoEstado)) {
      throw new Error('Estado no válido');
    }

    return this.update(pedidoId, { estado: nuevoEstado });
  }

  // Obtener pedidos por estado
  getPorEstado(estado) {
    return this.findAll({ estado });
  }

  // Obtener pedidos del día
  getPedidosHoy() {
    try {
      const stmt = this.prepareStatement(
        'getPedidosHoy',
        `
                SELECT p.*, c.nombre as cliente_nombre
                FROM pedidos p
                JOIN clientes c ON p.cliente_id = c.id
                WHERE DATE(p.fecha_pedido) = DATE('now')
                ORDER BY p.fecha_pedido DESC
            `
      );
      return stmt.all();
    } catch (error) {
      console.error('❌ Error al obtener pedidos de hoy:', error);
      return [];
    }
  }
}

// 6. Modelo para Detalle de Pedidos
class DetallePedidoModel extends BaseModel {
  constructor() {
    super('detalle_pedidos');
  }

  // Obtener detalles por pedido
  getByPedido(pedidoId) {
    return this.findAll({ pedido_id: pedidoId });
  }

  // Obtener detalles por producto
  getByProducto(productoId) {
    return this.findAll({ producto_id: productoId });
  }
}

// 7. Factory para crear modelos
class ModelFactory {
  static create(modelName) {
    switch (modelName.toLowerCase()) {
      case 'categoria':
        return new CategoriaModel();
      case 'producto':
        return new ProductoModel();
      case 'cliente':
        return new ClienteModel();
      case 'pedido':
        return new PedidoModel();
      case 'detallepedido':
        return new DetallePedidoModel();
      default:
        throw new Error(`Modelo ${modelName} no encontrado`);
    }
  }
}

// 8. Tests para los modelos
function testModelos() {
  console.log('\n🧪 Ejecutando tests de modelos...');

  try {
    // Test Categoria Model
    const categoriaModel = new CategoriaModel();
    const categorias = categoriaModel.findAll();
    console.log(
      `✅ CategoriaModel: ${categorias.length} categorías encontradas`
    );

    // Test Producto Model
    const productoModel = new ProductoModel();
    const productos = productoModel.findActivos();
    console.log(`✅ ProductoModel: ${productos.length} productos activos`);

    // Test Cliente Model
    const clienteModel = new ClienteModel();
    const clientes = clienteModel.findAll();
    console.log(`✅ ClienteModel: ${clientes.length} clientes encontrados`);

    // Test Pedido Model
    const pedidoModel = new PedidoModel();
    const pedidos = pedidoModel.findAll();
    console.log(`✅ PedidoModel: ${pedidos.length} pedidos encontrados`);

    // Test búsqueda
    const busqueda = productoModel.searchByNombre('laptop');
    console.log(`✅ Búsqueda 'laptop': ${busqueda.length} resultados`);

    // Test filtros
    const filtros = productoModel.filter({
      categoria_id: 1,
      precio_min: 50,
      limit: 5,
    });
    console.log(`✅ Filtros: ${filtros.length} productos`);

    console.log('\n🎉 Todos los tests de modelos completados');
  } catch (error) {
    console.error('❌ Error en tests de modelos:', error);
  }
}

// Exportar modelos
module.exports = {
  BaseModel,
  CategoriaModel,
  ProductoModel,
  ClienteModel,
  PedidoModel,
  DetallePedidoModel,
  ModelFactory,
  testModelos,
};

// Ejecutar si es el archivo principal
if (require.main === module) {
  testModelos();
}

/* 
🎯 RETO ADICIONAL:
1. Implementa validaciones más robustas en los modelos
2. Agrega métodos de bulk operations (crear/actualizar múltiples)
3. Implementa soft deletes en todos los modelos
4. Agrega caching a nivel de modelo
5. Implementa hooks (beforeCreate, afterUpdate, etc.)

📝 NOTAS:
- Los prepared statements mejoran significativamente el performance
- Usa transacciones para operaciones que afectan múltiples tablas
- Implementa validaciones tanto en crear como en actualizar
- Considera usar un pool de conexiones para aplicaciones grandes
- Mantén los modelos simples y enfocados en una responsabilidad
*/
