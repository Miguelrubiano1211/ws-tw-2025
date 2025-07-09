/**
 * Sistema de Inventario - Día 5: Objetos y Propiedades
 * Descripción: Aplicación completa para gestionar inventario con objetos JavaScript
 * Autor: Entrenamiento WorldSkills
 */

// ===============================
// CONFIGURACIÓN Y CONSTANTES
// ===============================

const CONFIG = {
  STORAGE_KEY: 'inventario_productos',
  CATEGORIAS: [
    'Electrónicos',
    'Ropa',
    'Hogar',
    'Deportes',
    'Libros',
    'Juguetes',
  ],
  STOCK_MINIMO: 10,
  MONEDA: 'COP',
  LOCALE: 'es-CO',
};

// ===============================
// CLASES Y CONSTRUCTORES
// ===============================

/**
 * Clase Producto - Representa un producto del inventario
 */
class Producto {
  constructor(datos) {
    this.id = datos.id || this.generarId();
    this.nombre = datos.nombre;
    this.categoria = datos.categoria;
    this.precio = parseFloat(datos.precio);
    this.stock = parseInt(datos.stock);
    this.descripcion = datos.descripcion || '';
    this.fechaCreacion = datos.fechaCreacion || new Date().toISOString();
    this.fechaActualizacion = new Date().toISOString();
    this.proveedor = datos.proveedor || '';
    this.imagen = datos.imagen || '';
    this.activo = datos.activo !== undefined ? datos.activo : true;
  }

  /**
   * Genera un ID único para el producto
   */
  generarId() {
    return 'prod_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Obtiene el estado del stock
   */
  obtenerEstadoStock() {
    if (this.stock === 0) return 'agotado';
    if (this.stock <= CONFIG.STOCK_MINIMO) return 'bajo';
    return 'normal';
  }

  /**
   * Actualiza el stock del producto
   */
  actualizarStock(nuevoStock) {
    this.stock = parseInt(nuevoStock);
    this.fechaActualizacion = new Date().toISOString();
  }

  /**
   * Valida los datos del producto
   */
  validar() {
    const errores = [];

    if (!this.nombre || this.nombre.trim().length < 2) {
      errores.push('El nombre debe tener al menos 2 caracteres');
    }

    if (!this.categoria || !CONFIG.CATEGORIAS.includes(this.categoria)) {
      errores.push('Debe seleccionar una categoría válida');
    }

    if (isNaN(this.precio) || this.precio <= 0) {
      errores.push('El precio debe ser un número mayor a 0');
    }

    if (isNaN(this.stock) || this.stock < 0) {
      errores.push('El stock debe ser un número mayor o igual a 0');
    }

    return errores;
  }

  /**
   * Convierte el producto a objeto plano para almacenamiento
   */
  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      categoria: this.categoria,
      precio: this.precio,
      stock: this.stock,
      descripcion: this.descripcion,
      fechaCreacion: this.fechaCreacion,
      fechaActualizacion: this.fechaActualizacion,
      proveedor: this.proveedor,
      imagen: this.imagen,
      activo: this.activo,
    };
  }
}

/**
 * Clase GestorInventario - Gestiona la colección de productos
 */
class GestorInventario {
  constructor() {
    this.productos = new Map();
    this.cargarDesdeStorage();
  }

  /**
   * Agrega un nuevo producto al inventario
   */
  agregarProducto(datosProducto) {
    const producto = new Producto(datosProducto);
    const errores = producto.validar();

    if (errores.length > 0) {
      throw new Error(errores.join(', '));
    }

    // Verificar si ya existe un producto con el mismo nombre
    if (this.existeProductoConNombre(producto.nombre, producto.id)) {
      throw new Error('Ya existe un producto con este nombre');
    }

    this.productos.set(producto.id, producto);
    this.guardarEnStorage();

    return producto;
  }

  /**
   * Actualiza un producto existente
   */
  actualizarProducto(id, datosActualizados) {
    const producto = this.productos.get(id);
    if (!producto) {
      throw new Error('Producto no encontrado');
    }

    // Actualizar propiedades
    Object.assign(producto, datosActualizados);
    producto.fechaActualizacion = new Date().toISOString();

    const errores = producto.validar();
    if (errores.length > 0) {
      throw new Error(errores.join(', '));
    }

    // Verificar nombres duplicados
    if (this.existeProductoConNombre(producto.nombre, id)) {
      throw new Error('Ya existe un producto con este nombre');
    }

    this.guardarEnStorage();
    return producto;
  }

  /**
   * Elimina un producto del inventario
   */
  eliminarProducto(id) {
    if (!this.productos.has(id)) {
      throw new Error('Producto no encontrado');
    }

    this.productos.delete(id);
    this.guardarEnStorage();
    return true;
  }

  /**
   * Busca productos por nombre
   */
  buscarProductos(termino) {
    if (!termino) return Array.from(this.productos.values());

    const terminoLower = termino.toLowerCase();
    return Array.from(this.productos.values()).filter(
      producto =>
        producto.nombre.toLowerCase().includes(terminoLower) ||
        producto.categoria.toLowerCase().includes(terminoLower) ||
        producto.proveedor.toLowerCase().includes(terminoLower)
    );
  }

  /**
   * Filtra productos por categoría
   */
  filtrarPorCategoria(categoria) {
    if (!categoria || categoria === 'todas') {
      return Array.from(this.productos.values());
    }

    return Array.from(this.productos.values()).filter(
      producto => producto.categoria === categoria
    );
  }

  /**
   * Obtiene estadísticas del inventario
   */
  obtenerEstadisticas() {
    const productos = Array.from(this.productos.values());

    return {
      totalProductos: productos.length,
      valorTotal: productos.reduce(
        (total, producto) => total + producto.precio * producto.stock,
        0
      ),
      productosActivos: productos.filter(p => p.activo).length,
      productosAgotados: productos.filter(p => p.stock === 0).length,
      productosStockBajo: productos.filter(
        p => p.stock > 0 && p.stock <= CONFIG.STOCK_MINIMO
      ).length,
      categorias: this.obtenerEstadisticasCategorias(),
      ultimaActualizacion: new Date().toLocaleString(CONFIG.LOCALE),
    };
  }

  /**
   * Obtiene estadísticas por categoría
   */
  obtenerEstadisticasCategorias() {
    const productos = Array.from(this.productos.values());
    const estadisticas = {};

    CONFIG.CATEGORIAS.forEach(categoria => {
      const productosCategoria = productos.filter(
        p => p.categoria === categoria
      );
      estadisticas[categoria] = {
        cantidad: productosCategoria.length,
        valor: productosCategoria.reduce(
          (total, producto) => total + producto.precio * producto.stock,
          0
        ),
      };
    });

    return estadisticas;
  }

  /**
   * Verifica si existe un producto con el mismo nombre (excluyendo el ID dado)
   */
  existeProductoConNombre(nombre, excluirId = null) {
    const nombreLower = nombre.toLowerCase();
    return Array.from(this.productos.values()).some(
      producto =>
        producto.nombre.toLowerCase() === nombreLower &&
        producto.id !== excluirId
    );
  }

  /**
   * Carga productos desde localStorage
   */
  cargarDesdeStorage() {
    try {
      const data = localStorage.getItem(CONFIG.STORAGE_KEY);
      if (data) {
        const productosData = JSON.parse(data);
        productosData.forEach(productoData => {
          const producto = new Producto(productoData);
          this.productos.set(producto.id, producto);
        });
      }
    } catch (error) {
      console.error('Error al cargar productos desde storage:', error);
    }
  }

  /**
   * Guarda productos en localStorage
   */
  guardarEnStorage() {
    try {
      const productosArray = Array.from(this.productos.values()).map(producto =>
        producto.toJSON()
      );
      localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(productosArray));
    } catch (error) {
      console.error('Error al guardar productos en storage:', error);
    }
  }

  /**
   * Obtiene un producto por ID
   */
  obtenerProducto(id) {
    return this.productos.get(id);
  }

  /**
   * Obtiene todos los productos
   */
  obtenerTodosLosProductos() {
    return Array.from(this.productos.values());
  }
}

// ===============================
// GESTOR DE INTERFAZ DE USUARIO
// ===============================

class GestorUI {
  constructor() {
    this.inventario = new GestorInventario();
    this.productoEditando = null;
    this.filtroCategoria = 'todas';
    this.terminoBusqueda = '';

    this.inicializar();
  }

  /**
   * Inicializa la interfaz de usuario
   */
  inicializar() {
    this.configurarEventos();
    this.cargarCategorias();
    this.actualizarEstadisticas();
    this.renderizarInventario();
  }

  /**
   * Configura todos los eventos de la interfaz
   */
  configurarEventos() {
    // Formulario de productos
    document.getElementById('productoForm').addEventListener('submit', e => {
      e.preventDefault();
      this.manejarSubmitFormulario();
    });

    // Búsqueda
    document.getElementById('busqueda').addEventListener('input', e => {
      this.terminoBusqueda = e.target.value;
      this.renderizarInventario();
    });

    // Filtro por categoría
    document.getElementById('filtroCategoria').addEventListener('change', e => {
      this.filtroCategoria = e.target.value;
      this.renderizarInventario();
    });

    // Validación en tiempo real
    this.configurarValidacionTiempoReal();
  }

  /**
   * Configura la validación en tiempo real de los campos
   */
  configurarValidacionTiempoReal() {
    const campos = ['nombre', 'categoria', 'precio', 'stock'];

    campos.forEach(campo => {
      const input = document.getElementById(campo);
      if (input) {
        input.addEventListener('blur', () => this.validarCampo(campo));
        input.addEventListener('input', () => this.limpiarError(campo));
      }
    });
  }

  /**
   * Valida un campo específico
   */
  validarCampo(campo) {
    const input = document.getElementById(campo);
    const valor = input.value.trim();
    let error = '';

    switch (campo) {
      case 'nombre':
        if (!valor || valor.length < 2) {
          error = 'El nombre debe tener al menos 2 caracteres';
        }
        break;
      case 'categoria':
        if (!valor || !CONFIG.CATEGORIAS.includes(valor)) {
          error = 'Debe seleccionar una categoría válida';
        }
        break;
      case 'precio':
        if (!valor || isNaN(valor) || parseFloat(valor) <= 0) {
          error = 'El precio debe ser un número mayor a 0';
        }
        break;
      case 'stock':
        if (!valor || isNaN(valor) || parseInt(valor) < 0) {
          error = 'El stock debe ser un número mayor o igual a 0';
        }
        break;
    }

    this.mostrarError(campo, error);
    return error === '';
  }

  /**
   * Muestra un error en un campo específico
   */
  mostrarError(campo, mensaje) {
    const input = document.getElementById(campo);
    const errorElement = document.getElementById(`error-${campo}`);

    if (mensaje) {
      input.classList.add('error');
      errorElement.textContent = mensaje;
      errorElement.classList.add('show');
    } else {
      input.classList.remove('error');
      errorElement.classList.remove('show');
    }
  }

  /**
   * Limpia el error de un campo
   */
  limpiarError(campo) {
    const input = document.getElementById(campo);
    const errorElement = document.getElementById(`error-${campo}`);

    input.classList.remove('error');
    errorElement.classList.remove('show');
  }

  /**
   * Carga las categorías en el select
   */
  cargarCategorias() {
    const selectCategoria = document.getElementById('categoria');
    const selectFiltro = document.getElementById('filtroCategoria');

    // Limpiar opciones existentes
    selectCategoria.innerHTML =
      '<option value="">Seleccionar categoría</option>';
    selectFiltro.innerHTML =
      '<option value="todas">Todas las categorías</option>';

    // Agregar categorías
    CONFIG.CATEGORIAS.forEach(categoria => {
      selectCategoria.innerHTML += `<option value="${categoria}">${categoria}</option>`;
      selectFiltro.innerHTML += `<option value="${categoria}">${categoria}</option>`;
    });
  }

  /**
   * Maneja el submit del formulario
   */
  manejarSubmitFormulario() {
    try {
      const datosProducto = this.obtenerDatosFormulario();

      if (this.productoEditando) {
        // Actualizar producto existente
        this.inventario.actualizarProducto(
          this.productoEditando,
          datosProducto
        );
        this.mostrarNotificacion(
          'Producto actualizado exitosamente',
          'success'
        );
      } else {
        // Crear nuevo producto
        this.inventario.agregarProducto(datosProducto);
        this.mostrarNotificacion('Producto agregado exitosamente', 'success');
      }

      this.limpiarFormulario();
      this.actualizarEstadisticas();
      this.renderizarInventario();
    } catch (error) {
      this.mostrarNotificacion(error.message, 'error');
    }
  }

  /**
   * Obtiene los datos del formulario
   */
  obtenerDatosFormulario() {
    return {
      nombre: document.getElementById('nombre').value.trim(),
      categoria: document.getElementById('categoria').value,
      precio: parseFloat(document.getElementById('precio').value),
      stock: parseInt(document.getElementById('stock').value),
      descripcion: document.getElementById('descripcion').value.trim(),
      proveedor: document.getElementById('proveedor').value.trim(),
    };
  }

  /**
   * Limpia el formulario
   */
  limpiarFormulario() {
    document.getElementById('productoForm').reset();
    this.productoEditando = null;
    document.getElementById('btnSubmit').textContent = 'Agregar Producto';
    document.getElementById('btnCancelar').style.display = 'none';

    // Limpiar errores
    ['nombre', 'categoria', 'precio', 'stock'].forEach(campo => {
      this.limpiarError(campo);
    });
  }

  /**
   * Actualiza las estadísticas en la interfaz
   */
  actualizarEstadisticas() {
    const stats = this.inventario.obtenerEstadisticas();

    document.getElementById('totalProductos').textContent =
      stats.totalProductos;
    document.getElementById('valorTotal').textContent = this.formatearPrecio(
      stats.valorTotal
    );
    document.getElementById('productosActivos').textContent =
      stats.productosActivos;
    document.getElementById('productosAgotados').textContent =
      stats.productosAgotados;
    document.getElementById('productosStockBajo').textContent =
      stats.productosStockBajo;
  }

  /**
   * Renderiza la tabla de inventario
   */
  renderizarInventario() {
    const tbody = document.getElementById('inventarioBody');
    let productos = this.inventario.obtenerTodosLosProductos();

    // Aplicar filtros
    if (this.filtroCategoria !== 'todas') {
      productos = productos.filter(p => p.categoria === this.filtroCategoria);
    }

    if (this.terminoBusqueda) {
      productos = this.inventario.buscarProductos(this.terminoBusqueda);
      if (this.filtroCategoria !== 'todas') {
        productos = productos.filter(p => p.categoria === this.filtroCategoria);
      }
    }

    // Ordenar por nombre
    productos.sort((a, b) => a.nombre.localeCompare(b.nombre));

    if (productos.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="text-center">
            <div class="empty-inventory">
              <i class="fas fa-box-open"></i>
              <p>No hay productos que mostrar</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = productos
      .map(producto => this.crearFilaProducto(producto))
      .join('');
  }

  /**
   * Crea una fila de producto para la tabla
   */
  crearFilaProducto(producto) {
    const estadoStock = producto.obtenerEstadoStock();
    const claseEstado =
      estadoStock === 'agotado'
        ? 'status-out'
        : estadoStock === 'bajo'
        ? 'status-low'
        : 'status-active';
    const textoEstado =
      estadoStock === 'agotado'
        ? 'Agotado'
        : estadoStock === 'bajo'
        ? 'Stock Bajo'
        : 'Normal';

    return `
      <tr>
        <td>${producto.nombre}</td>
        <td>${producto.categoria}</td>
        <td>${this.formatearPrecio(producto.precio)}</td>
        <td>${producto.stock}</td>
        <td><span class="status-badge ${claseEstado}">${textoEstado}</span></td>
        <td>${producto.proveedor || 'N/A'}</td>
        <td class="actions">
          <button class="btn btn-sm btn-warning" onclick="ui.editarProducto('${
            producto.id
          }')">
            Editar
          </button>
          <button class="btn btn-sm btn-danger" onclick="ui.eliminarProducto('${
            producto.id
          }')">
            Eliminar
          </button>
        </td>
      </tr>
    `;
  }

  /**
   * Inicia la edición de un producto
   */
  editarProducto(id) {
    const producto = this.inventario.obtenerProducto(id);
    if (!producto) {
      this.mostrarNotificacion('Producto no encontrado', 'error');
      return;
    }

    // Llenar formulario con datos del producto
    document.getElementById('nombre').value = producto.nombre;
    document.getElementById('categoria').value = producto.categoria;
    document.getElementById('precio').value = producto.precio;
    document.getElementById('stock').value = producto.stock;
    document.getElementById('descripcion').value = producto.descripcion;
    document.getElementById('proveedor').value = producto.proveedor;

    this.productoEditando = id;
    document.getElementById('btnSubmit').textContent = 'Actualizar Producto';
    document.getElementById('btnCancelar').style.display = 'inline-block';

    // Scroll al formulario
    document
      .getElementById('productoForm')
      .scrollIntoView({ behavior: 'smooth' });
  }

  /**
   * Elimina un producto
   */
  eliminarProducto(id) {
    const producto = this.inventario.obtenerProducto(id);
    if (!producto) {
      this.mostrarNotificacion('Producto no encontrado', 'error');
      return;
    }

    if (
      confirm(`¿Estás seguro de que quieres eliminar "${producto.nombre}"?`)
    ) {
      try {
        this.inventario.eliminarProducto(id);
        this.mostrarNotificacion('Producto eliminado exitosamente', 'success');
        this.actualizarEstadisticas();
        this.renderizarInventario();
      } catch (error) {
        this.mostrarNotificacion(error.message, 'error');
      }
    }
  }

  /**
   * Formatea un precio para mostrar
   */
  formatearPrecio(precio) {
    return new Intl.NumberFormat(CONFIG.LOCALE, {
      style: 'currency',
      currency: CONFIG.MONEDA,
    }).format(precio);
  }

  /**
   * Muestra una notificación
   */
  mostrarNotificacion(mensaje, tipo = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${tipo}`;
    notification.textContent = mensaje;

    document.body.appendChild(notification);

    // Mostrar notificación
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);

    // Ocultar notificación después de 3 segundos
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }
}

// ===============================
// DATOS DE EJEMPLO
// ===============================

/**
 * Carga datos de ejemplo si el inventario está vacío
 */
function cargarDatosEjemplo() {
  const inventario = new GestorInventario();

  if (inventario.obtenerTodosLosProductos().length === 0) {
    const productosEjemplo = [
      {
        nombre: 'Smartphone Samsung Galaxy',
        categoria: 'Electrónicos',
        precio: 850000,
        stock: 15,
        descripcion: 'Smartphone con pantalla AMOLED y cámara de 108MP',
        proveedor: 'Samsung Colombia',
      },
      {
        nombre: 'Camiseta Polo',
        categoria: 'Ropa',
        precio: 65000,
        stock: 25,
        descripcion: 'Camiseta polo 100% algodón',
        proveedor: 'Textiles Nacional',
      },
      {
        nombre: 'Licuadora Oster',
        categoria: 'Hogar',
        precio: 180000,
        stock: 8,
        descripcion: 'Licuadora de 3 velocidades con vaso de vidrio',
        proveedor: 'Oster Colombia',
      },
      {
        nombre: 'Balón de Fútbol',
        categoria: 'Deportes',
        precio: 45000,
        stock: 20,
        descripcion: 'Balón oficial FIFA tamaño 5',
        proveedor: 'Deportes Extremos',
      },
      {
        nombre: 'Libro "El Principito"',
        categoria: 'Libros',
        precio: 25000,
        stock: 5,
        descripcion: 'Clásico de la literatura universal',
        proveedor: 'Editorial Santillana',
      },
      {
        nombre: 'Tablet Apple iPad',
        categoria: 'Electrónicos',
        precio: 1200000,
        stock: 0,
        descripcion: 'Tablet con pantalla Retina de 10.2 pulgadas',
        proveedor: 'Apple Colombia',
      },
    ];

    productosEjemplo.forEach(producto => {
      try {
        inventario.agregarProducto(producto);
      } catch (error) {
        console.error('Error al cargar producto de ejemplo:', error);
      }
    });
  }
}

// ===============================
// INICIALIZACIÓN
// ===============================

let ui; // Variable global para el gestor de UI

/**
 * Inicializa la aplicación cuando el DOM está listo
 */
document.addEventListener('DOMContentLoaded', () => {
  cargarDatosEjemplo();
  ui = new GestorUI();

  // Configurar botón de cancelar
  document.getElementById('btnCancelar').addEventListener('click', () => {
    ui.limpiarFormulario();
  });

  console.log('🚀 Sistema de Inventario inicializado correctamente');
});

// ===============================
// UTILIDADES ADICIONALES
// ===============================

/**
 * Exporta los datos del inventario a JSON
 */
function exportarDatos() {
  const inventario = new GestorInventario();
  const datos = {
    productos: inventario.obtenerTodosLosProductos(),
    estadisticas: inventario.obtenerEstadisticas(),
    fechaExportacion: new Date().toISOString(),
  };

  const dataStr = JSON.stringify(datos, null, 2);
  const dataUri =
    'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

  const exportFileDefaultName = `inventario_${
    new Date().toISOString().split('T')[0]
  }.json`;

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}

/**
 * Importa datos desde un archivo JSON
 */
function importarDatos(archivo) {
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const datos = JSON.parse(e.target.result);
      const inventario = new GestorInventario();

      if (datos.productos && Array.isArray(datos.productos)) {
        datos.productos.forEach(producto => {
          inventario.agregarProducto(producto);
        });

        ui.actualizarEstadisticas();
        ui.renderizarInventario();
        ui.mostrarNotificacion('Datos importados exitosamente', 'success');
      }
    } catch (error) {
      ui.mostrarNotificacion(
        'Error al importar datos: ' + error.message,
        'error'
      );
    }
  };
  reader.readAsText(archivo);
}

// ===============================
// EVENTOS GLOBALES
// ===============================

// Prevenir envío accidental del formulario
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
    e.preventDefault();
  }
});

// Confirmación antes de cerrar si hay cambios sin guardar
window.addEventListener('beforeunload', e => {
  if (ui && ui.productoEditando) {
    e.preventDefault();
    e.returnValue = '';
  }
});
