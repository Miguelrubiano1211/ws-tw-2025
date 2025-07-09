# Patrones de Objetos en JavaScript

## 🏗️ Patrones de Creación de Objetos

### 1. Object Literal Pattern

El patrón más básico y común para crear objetos.

```javascript
// Patrón básico
const producto = {
  nombre: 'Laptop',
  precio: 1000000,
  categoria: 'Electrónicos',
  stock: 5,

  // Método
  obtenerInfo() {
    return `${this.nombre} - $${this.precio.toLocaleString()}`;
  },

  // Getter
  get disponible() {
    return this.stock > 0;
  },

  // Setter
  set precio(nuevoPrecio) {
    if (nuevoPrecio > 0) {
      this._precio = nuevoPrecio;
    }
  },
};

// Uso
console.log(producto.obtenerInfo()); // 'Laptop - $1,000,000'
console.log(producto.disponible); // true
```

### 2. Factory Pattern

Función que crea y retorna objetos.

```javascript
function crearProducto(nombre, precio, categoria, stock = 0) {
  return {
    nombre,
    precio,
    categoria,
    stock,
    activo: true,
    fechaCreacion: new Date(),

    // Métodos
    obtenerInfo() {
      return `${this.nombre} - ${
        this.categoria
      } - $${this.precio.toLocaleString()}`;
    },

    actualizarStock(nuevoStock) {
      this.stock = nuevoStock;
      this.fechaActualizacion = new Date();
    },

    aplicarDescuento(porcentaje) {
      this.precio = this.precio * (1 - porcentaje / 100);
      return this;
    },

    // Validaciones
    validar() {
      const errores = [];

      if (!this.nombre || this.nombre.length < 2) {
        errores.push('Nombre debe tener al menos 2 caracteres');
      }

      if (this.precio <= 0) {
        errores.push('Precio debe ser mayor a 0');
      }

      if (this.stock < 0) {
        errores.push('Stock no puede ser negativo');
      }

      return {
        valido: errores.length === 0,
        errores,
      };
    },
  };
}

// Uso
const laptop = crearProducto('Laptop Dell', 1200000, 'Electrónicos', 10);
const tablet = crearProducto('iPad', 800000, 'Electrónicos', 5);

console.log(laptop.obtenerInfo());
laptop.aplicarDescuento(10).actualizarStock(8);
```

### 3. Constructor Pattern

Función constructora para crear objetos.

```javascript
function Producto(nombre, precio, categoria, stock = 0) {
  this.nombre = nombre;
  this.precio = precio;
  this.categoria = categoria;
  this.stock = stock;
  this.activo = true;
  this.fechaCreacion = new Date();

  // Método interno (se crea en cada instancia)
  this.obtenerInfo = function () {
    return `${this.nombre} - ${
      this.categoria
    } - $${this.precio.toLocaleString()}`;
  };
}

// Métodos en el prototipo (compartidos por todas las instancias)
Producto.prototype.actualizarStock = function (nuevoStock) {
  this.stock = nuevoStock;
  this.fechaActualizacion = new Date();
};

Producto.prototype.aplicarDescuento = function (porcentaje) {
  this.precio = this.precio * (1 - porcentaje / 100);
  return this;
};

Producto.prototype.validar = function () {
  const errores = [];

  if (!this.nombre || this.nombre.length < 2) {
    errores.push('Nombre debe tener al menos 2 caracteres');
  }

  if (this.precio <= 0) {
    errores.push('Precio debe ser mayor a 0');
  }

  return {
    valido: errores.length === 0,
    errores,
  };
};

// Uso
const laptop = new Producto('Laptop HP', 1100000, 'Electrónicos', 8);
const mouse = new Producto('Mouse Logitech', 80000, 'Accesorios', 25);

console.log(laptop instanceof Producto); // true
```

### 4. Class Pattern (ES6+)

Sintaxis moderna para crear objetos.

```javascript
class Producto {
  constructor(nombre, precio, categoria, stock = 0) {
    this.nombre = nombre;
    this.precio = precio;
    this.categoria = categoria;
    this.stock = stock;
    this.activo = true;
    this.fechaCreacion = new Date();
  }

  // Métodos de instancia
  obtenerInfo() {
    return `${this.nombre} - ${
      this.categoria
    } - $${this.precio.toLocaleString()}`;
  }

  actualizarStock(nuevoStock) {
    this.stock = nuevoStock;
    this.fechaActualizacion = new Date();
    return this;
  }

  aplicarDescuento(porcentaje) {
    if (porcentaje > 0 && porcentaje <= 100) {
      this.precio = this.precio * (1 - porcentaje / 100);
    }
    return this;
  }

  validar() {
    const errores = [];

    if (!this.nombre || this.nombre.length < 2) {
      errores.push('Nombre debe tener al menos 2 caracteres');
    }

    if (this.precio <= 0) {
      errores.push('Precio debe ser mayor a 0');
    }

    if (this.stock < 0) {
      errores.push('Stock no puede ser negativo');
    }

    return {
      valido: errores.length === 0,
      errores,
    };
  }

  // Getter
  get disponible() {
    return this.stock > 0;
  }

  get valorTotal() {
    return this.precio * this.stock;
  }

  // Setter
  set precio(nuevoPrecio) {
    if (nuevoPrecio > 0) {
      this._precio = nuevoPrecio;
    }
  }

  get precio() {
    return this._precio;
  }

  // Método estático
  static compararPorPrecio(producto1, producto2) {
    return producto1.precio - producto2.precio;
  }

  static crearDesdeJSON(json) {
    const data = JSON.parse(json);
    return new Producto(data.nombre, data.precio, data.categoria, data.stock);
  }
}

// Uso
const laptop = new Producto('Laptop Lenovo', 1300000, 'Electrónicos', 12);
const tablet = new Producto('iPad Pro', 1500000, 'Electrónicos', 5);

console.log(laptop.obtenerInfo());
console.log(laptop.disponible); // true
console.log(laptop.valorTotal); // 15,600,000

// Método estático
const productos = [laptop, tablet].sort(Producto.compararPorPrecio);
```

## 🔄 Patrones de Composición

### 1. Mixin Pattern

Combina funcionalidades de múltiples objetos.

```javascript
// Mixins
const Auditable = {
  registrarCambio(accion, datos) {
    if (!this.historial) {
      this.historial = [];
    }

    this.historial.push({
      accion,
      datos,
      fecha: new Date(),
      usuario: this.usuario || 'Sistema',
    });
  },

  obtenerHistorial() {
    return this.historial || [];
  },
};

const Serializable = {
  toJSON() {
    return JSON.stringify(this);
  },

  fromJSON(json) {
    const data = JSON.parse(json);
    Object.assign(this, data);
    return this;
  },
};

const Validable = {
  validar() {
    const errores = [];

    if (this.reglas) {
      this.reglas.forEach(regla => {
        if (!regla.validador(this)) {
          errores.push(regla.mensaje);
        }
      });
    }

    return {
      valido: errores.length === 0,
      errores,
    };
  },
};

// Crear objeto con mixins
function crearProductoCompleto(nombre, precio, categoria, stock = 0) {
  const producto = {
    nombre,
    precio,
    categoria,
    stock,
    activo: true,
    fechaCreacion: new Date(),

    // Reglas de validación
    reglas: [
      {
        validador: obj => obj.nombre && obj.nombre.length >= 2,
        mensaje: 'Nombre debe tener al menos 2 caracteres',
      },
      {
        validador: obj => obj.precio > 0,
        mensaje: 'Precio debe ser mayor a 0',
      },
      {
        validador: obj => obj.stock >= 0,
        mensaje: 'Stock no puede ser negativo',
      },
    ],

    actualizarStock(nuevoStock) {
      const stockAnterior = this.stock;
      this.stock = nuevoStock;
      this.registrarCambio('actualizar_stock', {
        anterior: stockAnterior,
        nuevo: nuevoStock,
      });
      return this;
    },
  };

  // Aplicar mixins
  return Object.assign(producto, Auditable, Serializable, Validable);
}

// Uso
const laptop = crearProductoCompleto(
  'Laptop ASUS',
  1400000,
  'Electrónicos',
  15
);
laptop.actualizarStock(10);
laptop.actualizarStock(5);

console.log(laptop.obtenerHistorial());
console.log(laptop.validar());
```

### 2. Composition Pattern

Crear objetos complejos combinando objetos más simples.

```javascript
// Componentes básicos
function crearEspecificaciones(procesador, memoria, almacenamiento) {
  return {
    procesador,
    memoria,
    almacenamiento,

    obtenerResumen() {
      return `${this.procesador}, ${this.memoria} RAM, ${this.almacenamiento}`;
    },

    cumpleRequisitos(requisitos) {
      return Object.keys(requisitos).every(
        key => this[key] && this[key].includes(requisitos[key])
      );
    },
  };
}

function crearPrecio(valor, moneda = 'COP') {
  return {
    valor,
    moneda,

    formatear() {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: this.moneda,
      }).format(this.valor);
    },

    aplicarDescuento(porcentaje) {
      this.valor = this.valor * (1 - porcentaje / 100);
      return this;
    },

    compararCon(otroPrecio) {
      return this.valor - otroPrecio.valor;
    },
  };
}

function crearInventario(inicial = 0) {
  return {
    cantidad: inicial,
    reservado: 0,

    get disponible() {
      return this.cantidad - this.reservado;
    },

    agregar(cantidad) {
      this.cantidad += cantidad;
      return this;
    },

    reservar(cantidad) {
      if (cantidad <= this.disponible) {
        this.reservado += cantidad;
        return true;
      }
      return false;
    },

    liberar(cantidad) {
      this.reservado = Math.max(0, this.reservado - cantidad);
      return this;
    },
  };
}

// Producto compuesto
function crearProductoCompuesto(nombre, categoria) {
  return {
    nombre,
    categoria,
    fechaCreacion: new Date(),

    // Composición
    precio: null,
    especificaciones: null,
    inventario: null,

    // Métodos
    establecerPrecio(valor, moneda) {
      this.precio = crearPrecio(valor, moneda);
      return this;
    },

    establecerEspecificaciones(procesador, memoria, almacenamiento) {
      this.especificaciones = crearEspecificaciones(
        procesador,
        memoria,
        almacenamiento
      );
      return this;
    },

    establecerInventario(inicial) {
      this.inventario = crearInventario(inicial);
      return this;
    },

    obtenerResumen() {
      return {
        nombre: this.nombre,
        categoria: this.categoria,
        precio: this.precio ? this.precio.formatear() : 'Sin precio',
        especificaciones: this.especificaciones
          ? this.especificaciones.obtenerResumen()
          : 'Sin especificaciones',
        stock: this.inventario ? this.inventario.disponible : 0,
      };
    },
  };
}

// Uso
const laptop = crearProductoCompuesto('Laptop Gaming', 'Electrónicos')
  .establecerPrecio(2500000)
  .establecerEspecificaciones('Intel i7', '16GB', '1TB SSD')
  .establecerInventario(8);

console.log(laptop.obtenerResumen());
console.log(laptop.precio.formatear());
console.log(laptop.inventario.reservar(3)); // true
console.log(laptop.inventario.disponible); // 5
```

## 🏛️ Patrones Estructurales

### 1. Module Pattern

Encapsula funcionalidad en módulos reutilizables.

```javascript
const ModuloInventario = (function () {
  // Variables privadas
  let productos = new Map();
  let contadorId = 0;

  // Funciones privadas
  function generarId() {
    return `prod_${++contadorId}`;
  }

  function validarProducto(producto) {
    if (!producto.nombre || producto.nombre.length < 2) {
      throw new Error('Nombre debe tener al menos 2 caracteres');
    }

    if (!producto.precio || producto.precio <= 0) {
      throw new Error('Precio debe ser mayor a 0');
    }
  }

  // API pública
  return {
    agregar(datosProducto) {
      validarProducto(datosProducto);

      const id = generarId();
      const producto = {
        id,
        ...datosProducto,
        fechaCreacion: new Date(),
        activo: true,
      };

      productos.set(id, producto);
      return producto;
    },

    obtener(id) {
      return productos.get(id);
    },

    listar() {
      return Array.from(productos.values());
    },

    actualizar(id, datosActualizados) {
      const producto = productos.get(id);
      if (!producto) {
        throw new Error('Producto no encontrado');
      }

      const productoActualizado = {
        ...producto,
        ...datosActualizados,
        fechaActualizacion: new Date(),
      };

      validarProducto(productoActualizado);
      productos.set(id, productoActualizado);
      return productoActualizado;
    },

    eliminar(id) {
      return productos.delete(id);
    },

    buscar(termino) {
      const productos = this.listar();
      return productos.filter(
        producto =>
          producto.nombre.toLowerCase().includes(termino.toLowerCase()) ||
          producto.categoria.toLowerCase().includes(termino.toLowerCase())
      );
    },

    obtenerEstadisticas() {
      const productos = this.listar();
      return {
        total: productos.length,
        activos: productos.filter(p => p.activo).length,
        valorTotal: productos.reduce(
          (total, p) => total + p.precio * p.stock,
          0
        ),
      };
    },
  };
})();

// Uso
const laptop = ModuloInventario.agregar({
  nombre: 'Laptop Dell',
  precio: 1500000,
  categoria: 'Electrónicos',
  stock: 10,
});

const tablet = ModuloInventario.agregar({
  nombre: 'iPad',
  precio: 800000,
  categoria: 'Electrónicos',
  stock: 5,
});

console.log(ModuloInventario.obtenerEstadisticas());
```

### 2. Revealing Module Pattern

Variación del module pattern que expone métodos específicos.

```javascript
const GestorProductos = (function () {
  // Estado privado
  const productos = [];
  const configuracion = {
    moneda: 'COP',
    idioma: 'es-CO',
  };

  // Funciones privadas
  function formatearPrecio(precio) {
    return new Intl.NumberFormat(configuracion.idioma, {
      style: 'currency',
      currency: configuracion.moneda,
    }).format(precio);
  }

  function validarDatos(producto) {
    const errores = [];

    if (!producto.nombre) errores.push('Nombre es requerido');
    if (!producto.precio || producto.precio <= 0)
      errores.push('Precio debe ser mayor a 0');

    return errores;
  }

  function buscarPorId(id) {
    return productos.find(p => p.id === id);
  }

  function generarId() {
    return 'prod_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Funciones públicas
  function crearProducto(datosProducto) {
    const errores = validarDatos(datosProducto);
    if (errores.length > 0) {
      throw new Error(errores.join(', '));
    }

    const producto = {
      id: generarId(),
      ...datosProducto,
      fechaCreacion: new Date(),
      activo: true,
    };

    productos.push(producto);
    return producto;
  }

  function obtenerProducto(id) {
    return buscarPorId(id);
  }

  function listarProductos() {
    return productos.map(producto => ({
      ...producto,
      precioFormateado: formatearPrecio(producto.precio),
    }));
  }

  function eliminarProducto(id) {
    const index = productos.findIndex(p => p.id === id);
    if (index !== -1) {
      return productos.splice(index, 1)[0];
    }
    return null;
  }

  function obtenerResumen() {
    return {
      totalProductos: productos.length,
      valorTotal: formatearPrecio(
        productos.reduce((total, p) => total + p.precio * p.stock, 0)
      ),
      productosActivos: productos.filter(p => p.activo).length,
    };
  }

  // Revelar API pública
  return {
    crear: crearProducto,
    obtener: obtenerProducto,
    listar: listarProductos,
    eliminar: eliminarProducto,
    resumen: obtenerResumen,
  };
})();

// Uso
const laptop = GestorProductos.crear({
  nombre: 'Laptop HP',
  precio: 1200000,
  categoria: 'Electrónicos',
  stock: 8,
});

console.log(GestorProductos.listar());
console.log(GestorProductos.resumen());
```

## 🔄 Patrones de Comportamiento

### 1. Observer Pattern

Permite que objetos se suscriban a eventos de otros objetos.

```javascript
class EventoProducto {
  constructor() {
    this.observadores = new Map();
  }

  suscribir(evento, callback) {
    if (!this.observadores.has(evento)) {
      this.observadores.set(evento, []);
    }

    this.observadores.get(evento).push(callback);
  }

  desuscribir(evento, callback) {
    if (this.observadores.has(evento)) {
      const callbacks = this.observadores.get(evento);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  notificar(evento, datos) {
    if (this.observadores.has(evento)) {
      this.observadores.get(evento).forEach(callback => {
        callback(datos);
      });
    }
  }
}

class ProductoObservable extends EventoProducto {
  constructor(nombre, precio, categoria, stock = 0) {
    super();
    this.nombre = nombre;
    this.precio = precio;
    this.categoria = categoria;
    this._stock = stock;
    this.activo = true;
  }

  get stock() {
    return this._stock;
  }

  set stock(nuevoStock) {
    const stockAnterior = this._stock;
    this._stock = nuevoStock;

    // Notificar cambio de stock
    this.notificar('stock-cambiado', {
      producto: this,
      stockAnterior,
      stockNuevo: nuevoStock,
    });

    // Notificar si está agotado
    if (nuevoStock === 0) {
      this.notificar('producto-agotado', {
        producto: this,
      });
    }

    // Notificar si stock está bajo
    if (nuevoStock > 0 && nuevoStock <= 5) {
      this.notificar('stock-bajo', {
        producto: this,
        stock: nuevoStock,
      });
    }
  }

  actualizarPrecio(nuevoPrecio) {
    const precioAnterior = this.precio;
    this.precio = nuevoPrecio;

    this.notificar('precio-cambiado', {
      producto: this,
      precioAnterior,
      precioNuevo: nuevoPrecio,
    });
  }
}

// Uso
const laptop = new ProductoObservable(
  'Laptop Dell',
  1500000,
  'Electrónicos',
  10
);

// Suscribir a eventos
laptop.suscribir('stock-cambiado', datos => {
  console.log(`Stock cambiado: ${datos.stockAnterior} → ${datos.stockNuevo}`);
});

laptop.suscribir('producto-agotado', datos => {
  console.log(`¡ALERTA! Producto agotado: ${datos.producto.nombre}`);
});

laptop.suscribir('stock-bajo', datos => {
  console.log(
    `¡ADVERTENCIA! Stock bajo: ${datos.producto.nombre} (${datos.stock} restantes)`
  );
});

// Probar eventos
laptop.stock = 3; // Dispara 'stock-cambiado' y 'stock-bajo'
laptop.stock = 0; // Dispara 'stock-cambiado' y 'producto-agotado'
```

### 2. Strategy Pattern

Permite cambiar algoritmos dinámicamente.

```javascript
// Estrategias de descuento
const EstrategiasDescuento = {
  cliente_regular: {
    calcular: (precio, datos) => precio * 0.95, // 5% descuento
    descripcion: 'Descuento cliente regular (5%)',
  },

  cliente_premium: {
    calcular: (precio, datos) => precio * 0.9, // 10% descuento
    descripcion: 'Descuento cliente premium (10%)',
  },

  cliente_vip: {
    calcular: (precio, datos) => precio * 0.85, // 15% descuento
    descripcion: 'Descuento cliente VIP (15%)',
  },

  descuento_cantidad: {
    calcular: (precio, datos) => {
      const cantidad = datos.cantidad || 1;
      if (cantidad >= 10) return precio * 0.8; // 20% para 10+
      if (cantidad >= 5) return precio * 0.9; // 10% para 5+
      return precio;
    },
    descripcion: 'Descuento por cantidad',
  },

  descuento_temporal: {
    calcular: (precio, datos) => {
      const fechaVencimiento = new Date(datos.fechaVencimiento);
      const hoy = new Date();

      if (hoy > fechaVencimiento) {
        return precio; // Sin descuento si expiró
      }

      return precio * 0.85; // 15% descuento temporal
    },
    descripcion: 'Descuento temporal limitado (15%)',
  },
};

class CalculadoraPrecios {
  constructor() {
    this.estrategia = 'cliente_regular';
  }

  establecerEstrategia(nombreEstrategia) {
    if (EstrategiasDescuento[nombreEstrategia]) {
      this.estrategia = nombreEstrategia;
    } else {
      throw new Error(`Estrategia '${nombreEstrategia}' no encontrada`);
    }
  }

  calcularPrecio(precioBase, datos = {}) {
    const estrategia = EstrategiasDescuento[this.estrategia];
    const precioFinal = estrategia.calcular(precioBase, datos);

    return {
      precioBase,
      precioFinal,
      descuentoAplicado: precioBase - precioFinal,
      porcentajeDescuento: ((precioBase - precioFinal) / precioBase) * 100,
      estrategia: this.estrategia,
      descripcion: estrategia.descripcion,
    };
  }

  obtenerEstrategiasDisponibles() {
    return Object.keys(EstrategiasDescuento).map(key => ({
      nombre: key,
      descripcion: EstrategiasDescuento[key].descripcion,
    }));
  }
}

// Uso
const calculadora = new CalculadoraPrecios();

// Precio base
const precioLaptop = 1500000;

// Calcular con cliente regular
console.log(calculadora.calcularPrecio(precioLaptop));

// Cambiar a cliente premium
calculadora.establecerEstrategia('cliente_premium');
console.log(calculadora.calcularPrecio(precioLaptop));

// Descuento por cantidad
calculadora.establecerEstrategia('descuento_cantidad');
console.log(calculadora.calcularPrecio(precioLaptop, { cantidad: 8 }));

// Descuento temporal
calculadora.establecerEstrategia('descuento_temporal');
console.log(
  calculadora.calcularPrecio(precioLaptop, {
    fechaVencimiento: '2024-12-31T23:59:59',
  })
);
```

## 🎯 Patrones Aplicados al Sistema de Inventario

### Arquitectura Completa con Múltiples Patrones

```javascript
// Combinando múltiples patrones
const SistemaInventario = (function () {
  // Module Pattern para encapsulación

  // Observer Pattern para eventos
  class EventManager {
    constructor() {
      this.eventos = new Map();
    }

    on(evento, callback) {
      if (!this.eventos.has(evento)) {
        this.eventos.set(evento, []);
      }
      this.eventos.get(evento).push(callback);
    }

    emit(evento, datos) {
      if (this.eventos.has(evento)) {
        this.eventos.get(evento).forEach(callback => callback(datos));
      }
    }
  }

  // Factory Pattern para productos
  class ProductFactory {
    static crear(tipo, datos) {
      switch (tipo) {
        case 'electronico':
          return new ProductoElectronico(datos);
        case 'ropa':
          return new ProductoRopa(datos);
        case 'libro':
          return new ProductoLibro(datos);
        default:
          return new ProductoGenerico(datos);
      }
    }
  }

  // Strategy Pattern para validaciones
  const ValidacionStrategy = {
    electronico: {
      validar: producto => {
        const errores = [];
        if (!producto.garantia) errores.push('Garantía es requerida');
        if (!producto.marca) errores.push('Marca es requerida');
        return errores;
      },
    },
    ropa: {
      validar: producto => {
        const errores = [];
        if (!producto.talla) errores.push('Talla es requerida');
        if (!producto.material) errores.push('Material es requerido');
        return errores;
      },
    },
    libro: {
      validar: producto => {
        const errores = [];
        if (!producto.autor) errores.push('Autor es requerido');
        if (!producto.isbn) errores.push('ISBN es requerido');
        return errores;
      },
    },
  };

  // Composición de clases
  class ProductoGenerico {
    constructor(datos) {
      this.id = this.generarId();
      this.nombre = datos.nombre;
      this.precio = datos.precio;
      this.stock = datos.stock || 0;
      this.categoria = datos.categoria;
      this.activo = true;
      this.fechaCreacion = new Date();
    }

    generarId() {
      return (
        'prod_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      );
    }

    validar() {
      const errores = [];

      if (!this.nombre || this.nombre.length < 2) {
        errores.push('Nombre debe tener al menos 2 caracteres');
      }

      if (!this.precio || this.precio <= 0) {
        errores.push('Precio debe ser mayor a 0');
      }

      // Validación específica por tipo
      if (ValidacionStrategy[this.categoria]) {
        const erroresEspecificos =
          ValidacionStrategy[this.categoria].validar(this);
        errores.push(...erroresEspecificos);
      }

      return {
        valido: errores.length === 0,
        errores,
      };
    }
  }

  class ProductoElectronico extends ProductoGenerico {
    constructor(datos) {
      super(datos);
      this.marca = datos.marca;
      this.garantia = datos.garantia;
      this.especificaciones = datos.especificaciones || {};
    }
  }

  class ProductoRopa extends ProductoGenerico {
    constructor(datos) {
      super(datos);
      this.talla = datos.talla;
      this.material = datos.material;
      this.color = datos.color;
    }
  }

  class ProductoLibro extends ProductoGenerico {
    constructor(datos) {
      super(datos);
      this.autor = datos.autor;
      this.isbn = datos.isbn;
      this.editorial = datos.editorial;
    }
  }

  // Estado privado
  const productos = new Map();
  const eventManager = new EventManager();

  // API pública
  return {
    // Gestión de productos
    crear(tipo, datos) {
      const producto = ProductFactory.crear(tipo, datos);
      const validacion = producto.validar();

      if (!validacion.valido) {
        throw new Error(validacion.errores.join(', '));
      }

      productos.set(producto.id, producto);
      eventManager.emit('producto-creado', producto);

      return producto;
    },

    obtener(id) {
      return productos.get(id);
    },

    listar() {
      return Array.from(productos.values());
    },

    actualizar(id, datos) {
      const producto = productos.get(id);
      if (!producto) {
        throw new Error('Producto no encontrado');
      }

      Object.assign(producto, datos);
      producto.fechaActualizacion = new Date();

      const validacion = producto.validar();
      if (!validacion.valido) {
        throw new Error(validacion.errores.join(', '));
      }

      eventManager.emit('producto-actualizado', producto);
      return producto;
    },

    eliminar(id) {
      const producto = productos.get(id);
      if (producto) {
        productos.delete(id);
        eventManager.emit('producto-eliminado', producto);
        return true;
      }
      return false;
    },

    // Gestión de eventos
    on(evento, callback) {
      eventManager.on(evento, callback);
    },

    // Estadísticas
    obtenerEstadisticas() {
      const productos = this.listar();
      return {
        total: productos.length,
        porCategoria: productos.reduce((acc, p) => {
          acc[p.categoria] = (acc[p.categoria] || 0) + 1;
          return acc;
        }, {}),
        valorTotal: productos.reduce(
          (total, p) => total + p.precio * p.stock,
          0
        ),
      };
    },
  };
})();

// Uso del sistema completo
SistemaInventario.on('producto-creado', producto => {
  console.log(`Producto creado: ${producto.nombre}`);
});

SistemaInventario.on('producto-actualizado', producto => {
  console.log(`Producto actualizado: ${producto.nombre}`);
});

// Crear productos de diferentes tipos
const laptop = SistemaInventario.crear('electronico', {
  nombre: 'Laptop Gaming',
  precio: 2500000,
  categoria: 'electronico',
  stock: 5,
  marca: 'ASUS',
  garantia: '2 años',
  especificaciones: {
    procesador: 'Intel i7',
    memoria: '16GB',
    almacenamiento: '1TB SSD',
  },
});

const camiseta = SistemaInventario.crear('ropa', {
  nombre: 'Camiseta Polo',
  precio: 80000,
  categoria: 'ropa',
  stock: 20,
  talla: 'M',
  material: 'Algodón 100%',
  color: 'Azul',
});

const libro = SistemaInventario.crear('libro', {
  nombre: 'El Principito',
  precio: 35000,
  categoria: 'libro',
  stock: 15,
  autor: 'Antoine de Saint-Exupéry',
  isbn: '978-0-123456-78-9',
  editorial: 'Editorial Planeta',
});

console.log(SistemaInventario.obtenerEstadisticas());
```

## 💡 Mejores Prácticas para Patrones de Objetos

### 1. Elegir el Patrón Correcto

- **Object Literal**: Para objetos simples y únicos
- **Factory**: Para crear múltiples objetos similares
- **Constructor/Class**: Para objetos que requieren herencia
- **Module**: Para encapsular funcionalidad relacionada
- **Observer**: Para comunicación entre objetos
- **Strategy**: Para intercambiar algoritmos

### 2. Combinar Patrones Efectivamente

```javascript
// Ejemplo de combinación efectiva
const SistemaCompleto = (function() {
  // Module Pattern para encapsulación
  const EventManager = /* Observer Pattern */;
  const ProductFactory = /* Factory Pattern */;
  const ValidacionStrategy = /* Strategy Pattern */;

  // Combinar todos los patrones
  return {
    // API pública que utiliza todos los patrones
  };
})();
```

### 3. Mantener la Simplicidad

- No usar patrones innecesarios
- Elegir patrones que resuelvan problemas reales
- Documentar por qué se eligió cada patrón

### 4. Pensar en la Escalabilidad

- Diseñar para el crecimiento futuro
- Mantener bajo acoplamiento entre componentes
- Usar composición sobre herencia cuando sea posible

---

_Esta guía forma parte del entrenamiento WorldSkills - Día 5: Objetos y Propiedades_
