# Mejores Prácticas para Objetos en JavaScript

## 🎯 Principios Fundamentales

### 1. SOLID Principles Aplicados a JavaScript

#### **S - Single Responsibility Principle**

Cada objeto debe tener una única responsabilidad.

```javascript
// ❌ Malo: Múltiples responsabilidades
class Producto {
  constructor(nombre, precio) {
    this.nombre = nombre;
    this.precio = precio;
  }

  // Responsabilidad 1: Gestión de datos
  obtenerInfo() {
    return `${this.nombre} - $${this.precio}`;
  }

  // Responsabilidad 2: Validación
  validar() {
    return this.precio > 0 && this.nombre.length > 0;
  }

  // Responsabilidad 3: Persistencia
  guardarEnBD() {
    // Lógica de base de datos
  }

  // Responsabilidad 4: Formateo
  formatearPrecio() {
    return new Intl.NumberFormat('es-CO').format(this.precio);
  }
}

// ✅ Bueno: Responsabilidades separadas
class Producto {
  constructor(nombre, precio) {
    this.nombre = nombre;
    this.precio = precio;
  }

  obtenerInfo() {
    return `${this.nombre} - $${this.precio}`;
  }
}

class ValidadorProducto {
  static validar(producto) {
    const errores = [];
    if (!producto.nombre || producto.nombre.length === 0) {
      errores.push('Nombre es requerido');
    }
    if (!producto.precio || producto.precio <= 0) {
      errores.push('Precio debe ser mayor a 0');
    }
    return {
      valido: errores.length === 0,
      errores,
    };
  }
}

class FormateadorPrecio {
  static formatear(precio, locale = 'es-CO') {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'COP',
    }).format(precio);
  }
}

class RepositorioProducto {
  static async guardar(producto) {
    // Lógica de persistencia
  }

  static async obtener(id) {
    // Lógica de recuperación
  }
}
```

#### **O - Open/Closed Principle**

Abierto para extensión, cerrado para modificación.

```javascript
// ✅ Bueno: Extensible sin modificar código existente
class CalculadoraDescuento {
  constructor() {
    this.estrategias = new Map();
  }

  agregarEstrategia(nombre, estrategia) {
    this.estrategias.set(nombre, estrategia);
  }

  calcular(precio, tipo, datos = {}) {
    const estrategia = this.estrategias.get(tipo);
    if (!estrategia) {
      throw new Error(`Estrategia '${tipo}' no encontrada`);
    }
    return estrategia.calcular(precio, datos);
  }
}

// Estrategias extensibles
const descuentoCliente = {
  calcular: (precio, datos) => precio * 0.95,
};

const descuentoEmpleado = {
  calcular: (precio, datos) => precio * 0.8,
};

const descuentoVIP = {
  calcular: (precio, datos) => precio * 0.75,
};

// Uso
const calculadora = new CalculadoraDescuento();
calculadora.agregarEstrategia('cliente', descuentoCliente);
calculadora.agregarEstrategia('empleado', descuentoEmpleado);
calculadora.agregarEstrategia('vip', descuentoVIP);

// Fácil agregar nuevas estrategias sin modificar el código existente
const descuentoEstudiante = {
  calcular: (precio, datos) => precio * 0.9,
};
calculadora.agregarEstrategia('estudiante', descuentoEstudiante);
```

#### **L - Liskov Substitution Principle**

Los objetos derivados deben ser sustituibles por sus objetos base.

```javascript
// ✅ Bueno: Herencia apropiada
class Producto {
  constructor(nombre, precio) {
    this.nombre = nombre;
    this.precio = precio;
  }

  obtenerInfo() {
    return `${this.nombre}: ${this.precio}`;
  }

  calcularPrecioConImpuesto(impuesto = 0.19) {
    return this.precio * (1 + impuesto);
  }
}

class ProductoElectronico extends Producto {
  constructor(nombre, precio, garantia) {
    super(nombre, precio);
    this.garantia = garantia;
  }

  // Sobreescribe pero mantiene el contrato
  obtenerInfo() {
    return `${super.obtenerInfo()} (Garantía: ${this.garantia})`;
  }

  // Mantiene el comportamiento esperado
  calcularPrecioConImpuesto(impuesto = 0.19) {
    return super.calcularPrecioConImpuesto(impuesto);
  }
}

// Función que trabaja con cualquier producto
function procesarProducto(producto) {
  console.log(producto.obtenerInfo());
  console.log(`Precio con impuesto: ${producto.calcularPrecioConImpuesto()}`);
}

// Ambos funcionan correctamente
const producto = new Producto('Libro', 25000);
const laptop = new ProductoElectronico('Laptop', 1500000, '2 años');

procesarProducto(producto); // Funciona
procesarProducto(laptop); // También funciona
```

#### **I - Interface Segregation Principle**

Los clientes no deben depender de interfaces que no usan.

```javascript
// ❌ Malo: Interfaz muy grande
class GestorProductoCompleto {
  // Operaciones CRUD
  crear(producto) {
    /* ... */
  }
  obtener(id) {
    /* ... */
  }
  actualizar(id, datos) {
    /* ... */
  }
  eliminar(id) {
    /* ... */
  }

  // Operaciones de búsqueda
  buscarPorNombre(nombre) {
    /* ... */
  }
  buscarPorCategoria(categoria) {
    /* ... */
  }
  buscarPorRango(min, max) {
    /* ... */
  }

  // Operaciones de reporte
  generarReporte() {
    /* ... */
  }
  exportarCSV() {
    /* ... */
  }
  exportarPDF() {
    /* ... */
  }

  // Operaciones de inventario
  actualizarStock(id, cantidad) {
    /* ... */
  }
  verificarDisponibilidad(id) {
    /* ... */
  }
}

// ✅ Bueno: Interfaces específicas
class RepositorioProducto {
  crear(producto) {
    /* ... */
  }
  obtener(id) {
    /* ... */
  }
  actualizar(id, datos) {
    /* ... */
  }
  eliminar(id) {
    /* ... */
  }
}

class BuscadorProducto {
  buscarPorNombre(nombre) {
    /* ... */
  }
  buscarPorCategoria(categoria) {
    /* ... */
  }
  buscarPorRango(min, max) {
    /* ... */
  }
}

class GeneradorReporte {
  generarReporte() {
    /* ... */
  }
  exportarCSV() {
    /* ... */
  }
  exportarPDF() {
    /* ... */
  }
}

class GestorInventario {
  actualizarStock(id, cantidad) {
    /* ... */
  }
  verificarDisponibilidad(id) {
    /* ... */
  }
}
```

#### **D - Dependency Inversion Principle**

Depender de abstracciones, no de concreciones.

```javascript
// ❌ Malo: Dependencia directa
class ServicioProducto {
  constructor() {
    this.baseDatos = new MySQL(); // Dependencia concreta
  }

  obtenerProducto(id) {
    return this.baseDatos.query(`SELECT * FROM productos WHERE id = ${id}`);
  }
}

// ✅ Bueno: Dependencia de abstracción
class ServicioProducto {
  constructor(repositorio) {
    this.repositorio = repositorio; // Dependencia abstracta
  }

  obtenerProducto(id) {
    return this.repositorio.obtener(id);
  }
}

// Implementaciones concretas
class RepositorioMySQL {
  obtener(id) {
    // Lógica específica de MySQL
  }
}

class RepositorioMongoDB {
  obtener(id) {
    // Lógica específica de MongoDB
  }
}

class RepositorioMemoria {
  obtener(id) {
    // Lógica en memoria para testing
  }
}

// Uso con inyección de dependencia
const servicioConMySQL = new ServicioProducto(new RepositorioMySQL());
const servicioConMongo = new ServicioProducto(new RepositorioMongoDB());
const servicioEnMemoria = new ServicioProducto(new RepositorioMemoria());
```

## 🏗️ Patrones de Construcción

### 1. Builder Pattern

Para construir objetos complejos paso a paso.

```javascript
class ProductoBuilder {
  constructor() {
    this.producto = {};
  }

  establecerNombre(nombre) {
    this.producto.nombre = nombre;
    return this;
  }

  establecerPrecio(precio) {
    this.producto.precio = precio;
    return this;
  }

  establecerCategoria(categoria) {
    this.producto.categoria = categoria;
    return this;
  }

  establecerStock(stock) {
    this.producto.stock = stock;
    return this;
  }

  establecerEspecificaciones(especificaciones) {
    this.producto.especificaciones = especificaciones;
    return this;
  }

  establecerProveedor(proveedor) {
    this.producto.proveedor = proveedor;
    return this;
  }

  build() {
    // Validaciones antes de construir
    if (!this.producto.nombre || !this.producto.precio) {
      throw new Error('Nombre y precio son requeridos');
    }

    return {
      ...this.producto,
      id: this.generarId(),
      fechaCreacion: new Date(),
      activo: true,
    };
  }

  generarId() {
    return 'prod_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}

// Uso
const laptop = new ProductoBuilder()
  .establecerNombre('Laptop Gaming ASUS')
  .establecerPrecio(2500000)
  .establecerCategoria('Electrónicos')
  .establecerStock(5)
  .establecerEspecificaciones({
    procesador: 'Intel i7',
    memoria: '16GB',
    almacenamiento: '1TB SSD',
  })
  .establecerProveedor('ASUS Colombia')
  .build();
```

### 2. Prototype Pattern

Para clonar objetos existentes.

```javascript
class ProductoPrototype {
  constructor(nombre, precio, categoria) {
    this.nombre = nombre;
    this.precio = precio;
    this.categoria = categoria;
    this.fechaCreacion = new Date();
    this.activo = true;
  }

  // Método para clonar
  clone() {
    const clonado = Object.create(Object.getPrototypeOf(this));

    // Copia superficial de propiedades primitivas
    Object.keys(this).forEach(key => {
      if (typeof this[key] !== 'object' || this[key] === null) {
        clonado[key] = this[key];
      } else {
        // Copia profunda de objetos
        clonado[key] = JSON.parse(JSON.stringify(this[key]));
      }
    });

    return clonado;
  }

  // Método para clonar con modificaciones
  cloneWith(modificaciones) {
    const clonado = this.clone();
    Object.assign(clonado, modificaciones);
    return clonado;
  }
}

// Uso
const productoBase = new ProductoPrototype(
  'Smartphone',
  800000,
  'Electrónicos'
);

// Clonar exacto
const productoClonado = productoBase.clone();

// Clonar con modificaciones
const productoVariante = productoBase.cloneWith({
  nombre: 'Smartphone Pro',
  precio: 1200000,
});
```

## 🎯 Mejores Prácticas de Nomenclatura

### 1. Nombres Descriptivos y Consistentes

```javascript
// ❌ Malo: Nombres ambiguos
class P {
  constructor(n, p) {
    this.n = n;
    this.p = p;
  }

  calc() {
    return this.p * 1.19;
  }
}

// ✅ Bueno: Nombres descriptivos
class Producto {
  constructor(nombre, precio) {
    this.nombre = nombre;
    this.precio = precio;
  }

  calcularPrecioConImpuesto() {
    return this.precio * 1.19;
  }
}
```

### 2. Convenciones de Nomenclatura

```javascript
// Clases: PascalCase
class GestorInventario {}
class ProductoElectronico {}

// Variables y funciones: camelCase
const nombreProducto = 'Laptop';
const precioConDescuento = 850000;
function calcularDescuento() {}

// Constantes: UPPER_SNAKE_CASE
const PRECIO_MINIMO = 1000;
const STOCK_MAXIMO = 999;
const CATEGORIAS_DISPONIBLES = ['Electrónicos', 'Ropa', 'Libros'];

// Propiedades privadas: _underscore
class Producto {
  constructor(nombre) {
    this._nombre = nombre;
    this._precio = 0;
  }

  get nombre() {
    return this._nombre;
  }

  set precio(valor) {
    this._precio = valor > 0 ? valor : 0;
  }
}
```

### 3. Nombres de Métodos Descriptivos

```javascript
class Producto {
  constructor(nombre, precio) {
    this.nombre = nombre;
    this.precio = precio;
  }

  // Verbos descriptivos
  obtenerInformacion() {}
  calcularDescuento() {}
  validarDatos() {}
  actualizarStock() {}

  // Predicados con is/has/can
  estaDisponible() {}
  tieneDescuento() {}
  puedeVenderse() {}

  // Getters sin 'get'
  get precioFormateado() {}
  get estadoStock() {}
}
```

## 🔒 Encapsulación y Privacidad

### 1. Propiedades Privadas con

```javascript
class Producto {
  // Propiedades privadas
  #id;
  #precio;
  #stock;

  constructor(nombre, precio, stock) {
    this.#id = this.#generarId();
    this.nombre = nombre;
    this.#precio = precio;
    this.#stock = stock;
  }

  // Método privado
  #generarId() {
    return 'prod_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Getters públicos
  get id() {
    return this.#id;
  }

  get precio() {
    return this.#precio;
  }

  get stock() {
    return this.#stock;
  }

  // Métodos públicos que controlan el acceso
  establecerPrecio(nuevoPrecio) {
    if (nuevoPrecio > 0) {
      this.#precio = nuevoPrecio;
    } else {
      throw new Error('El precio debe ser mayor a 0');
    }
  }

  actualizarStock(nuevoStock) {
    if (nuevoStock >= 0) {
      this.#stock = nuevoStock;
    } else {
      throw new Error('El stock no puede ser negativo');
    }
  }
}
```

### 2. Closure para Privacidad

```javascript
function crearProducto(nombre, precio) {
  // Variables privadas
  let _id = 'prod_' + Date.now();
  let _precio = precio;
  let _stock = 0;

  // Función privada
  function validarPrecio(precio) {
    return precio > 0;
  }

  // API pública
  return {
    nombre,

    get id() {
      return _id;
    },

    get precio() {
      return _precio;
    },

    set precio(nuevoPrecio) {
      if (validarPrecio(nuevoPrecio)) {
        _precio = nuevoPrecio;
      } else {
        throw new Error('Precio inválido');
      }
    },

    get stock() {
      return _stock;
    },

    actualizarStock(cantidad) {
      if (cantidad >= 0) {
        _stock = cantidad;
      }
    },
  };
}
```

## 🎨 Composición sobre Herencia

### 1. Usando Mixins

```javascript
// Comportamientos como mixins
const Auditable = {
  registrarCambio(accion, datos) {
    if (!this.historial) {
      this.historial = [];
    }
    this.historial.push({
      accion,
      datos,
      fecha: new Date(),
    });
  },
};

const Validable = {
  validar(reglas) {
    const errores = [];
    reglas.forEach(regla => {
      if (!regla.validador(this)) {
        errores.push(regla.mensaje);
      }
    });
    return {
      valido: errores.length === 0,
      errores,
    };
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

// Función para aplicar mixins
function aplicarMixins(objetivo, ...mixins) {
  mixins.forEach(mixin => {
    Object.assign(objetivo, mixin);
  });
  return objetivo;
}

// Uso
function crearProducto(nombre, precio) {
  const producto = {
    nombre,
    precio,
    fechaCreacion: new Date(),
  };

  return aplicarMixins(producto, Auditable, Validable, Serializable);
}

const laptop = crearProducto('Laptop', 1500000);
laptop.registrarCambio('creacion', { nombre: 'Laptop', precio: 1500000 });
```

### 2. Composición con Decoradores

```javascript
// Decoradores para agregar funcionalidad
function conValidacion(producto) {
  return {
    ...producto,

    validar() {
      const errores = [];

      if (!this.nombre || this.nombre.length < 2) {
        errores.push('Nombre debe tener al menos 2 caracteres');
      }

      if (!this.precio || this.precio <= 0) {
        errores.push('Precio debe ser mayor a 0');
      }

      return {
        valido: errores.length === 0,
        errores,
      };
    },
  };
}

function conAuditoria(producto) {
  return {
    ...producto,
    historial: [],

    registrarCambio(accion, datos) {
      this.historial.push({
        accion,
        datos,
        fecha: new Date(),
      });
    },
  };
}

function conFormato(producto) {
  return {
    ...producto,

    formatear() {
      return {
        nombre: this.nombre.toUpperCase(),
        precio: new Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP',
        }).format(this.precio),
      };
    },
  };
}

// Uso de decoradores
const productoBase = {
  nombre: 'Laptop',
  precio: 1500000,
};

const productoCompleto = conFormato(conAuditoria(conValidacion(productoBase)));

console.log(productoCompleto.validar());
console.log(productoCompleto.formatear());
productoCompleto.registrarCambio('creacion', { nombre: 'Laptop' });
```

## 🚀 Optimización y Rendimiento

### 1. Object.freeze() para Inmutabilidad

```javascript
class ProductoInmutable {
  constructor(nombre, precio) {
    this.nombre = nombre;
    this.precio = precio;
    this.fechaCreacion = new Date();

    // Hacer el objeto inmutable
    Object.freeze(this);
  }

  // Métodos que retornan nuevos objetos
  conPrecio(nuevoPrecio) {
    return new ProductoInmutable(this.nombre, nuevoPrecio);
  }

  conDescuento(porcentaje) {
    const nuevoPrecio = this.precio * (1 - porcentaje / 100);
    return new ProductoInmutable(this.nombre, nuevoPrecio);
  }
}

// Uso
const laptop = new ProductoInmutable('Laptop', 1500000);
const laptopConDescuento = laptop.conDescuento(10);

// laptop.precio = 1000000; // Error! El objeto está congelado
```

### 2. Lazy Loading para Propiedades Costosas

```javascript
class Producto {
  constructor(nombre, precio) {
    this.nombre = nombre;
    this.precio = precio;
    this._estadisticas = null; // Lazy loading
  }

  get estadisticas() {
    if (!this._estadisticas) {
      // Cálculo costoso solo cuando se necesita
      this._estadisticas = this.calcularEstadisticas();
    }
    return this._estadisticas;
  }

  calcularEstadisticas() {
    // Simulación de cálculo costoso
    console.log('Calculando estadísticas...');
    return {
      valorPromedio: this.precio,
      popularidad: Math.random() * 100,
      tendencia: 'estable',
    };
  }

  // Invalidar cache cuando sea necesario
  invalidarEstadisticas() {
    this._estadisticas = null;
  }
}
```

### 3. WeakMap para Propiedades Privadas

```javascript
const propiedadesPrivadas = new WeakMap();

class Producto {
  constructor(nombre, precio) {
    // Propiedades privadas en WeakMap
    propiedadesPrivadas.set(this, {
      id: this.generarId(),
      precio: precio,
      historial: [],
    });

    this.nombre = nombre;
  }

  generarId() {
    return 'prod_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  get id() {
    return propiedadesPrivadas.get(this).id;
  }

  get precio() {
    return propiedadesPrivadas.get(this).precio;
  }

  set precio(nuevoPrecio) {
    if (nuevoPrecio > 0) {
      const privadas = propiedadesPrivadas.get(this);
      privadas.precio = nuevoPrecio;
      privadas.historial.push({
        accion: 'cambio_precio',
        valor: nuevoPrecio,
        fecha: new Date(),
      });
    }
  }

  get historial() {
    return propiedadesPrivadas.get(this).historial;
  }
}
```

## 📊 Testing y Mantenibilidad

### 1. Diseño Testeable

```javascript
// Dependencias inyectadas para facilitar testing
class GestorProductos {
  constructor(repositorio, validador, logger) {
    this.repositorio = repositorio;
    this.validador = validador;
    this.logger = logger;
  }

  async crearProducto(datos) {
    try {
      // Validar
      const validacion = this.validador.validar(datos);
      if (!validacion.valido) {
        throw new Error(validacion.errores.join(', '));
      }

      // Crear
      const producto = await this.repositorio.crear(datos);

      // Log
      this.logger.info('Producto creado', { id: producto.id });

      return producto;
    } catch (error) {
      this.logger.error('Error al crear producto', error);
      throw error;
    }
  }
}

// Tests fáciles con mocks
describe('GestorProductos', () => {
  let gestor;
  let mockRepositorio;
  let mockValidador;
  let mockLogger;

  beforeEach(() => {
    mockRepositorio = {
      crear: jest.fn(),
    };
    mockValidador = {
      validar: jest.fn(),
    };
    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
    };

    gestor = new GestorProductos(mockRepositorio, mockValidador, mockLogger);
  });

  test('debe crear producto válido', async () => {
    mockValidador.validar.mockReturnValue({ valido: true });
    mockRepositorio.crear.mockResolvedValue({ id: 'prod_123' });

    const resultado = await gestor.crearProducto({ nombre: 'Test' });

    expect(resultado.id).toBe('prod_123');
    expect(mockLogger.info).toHaveBeenCalled();
  });
});
```

### 2. Documentación con JSDoc

```javascript
/**
 * Representa un producto en el sistema de inventario
 * @class
 */
class Producto {
  /**
   * Crea una instancia de Producto
   * @param {string} nombre - Nombre del producto
   * @param {number} precio - Precio del producto en COP
   * @param {string} categoria - Categoría del producto
   * @param {number} [stock=0] - Cantidad en stock
   * @throws {Error} Si los datos son inválidos
   * @example
   * const laptop = new Producto('Laptop Dell', 1500000, 'Electrónicos', 10);
   */
  constructor(nombre, precio, categoria, stock = 0) {
    this.nombre = nombre;
    this.precio = precio;
    this.categoria = categoria;
    this.stock = stock;
  }

  /**
   * Calcula el precio con descuento aplicado
   * @param {number} porcentaje - Porcentaje de descuento (0-100)
   * @returns {number} Precio con descuento
   * @throws {Error} Si el porcentaje es inválido
   * @example
   * const precioConDescuento = laptop.calcularDescuento(10); // 10% descuento
   */
  calcularDescuento(porcentaje) {
    if (porcentaje < 0 || porcentaje > 100) {
      throw new Error('Porcentaje debe estar entre 0 y 100');
    }
    return this.precio * (1 - porcentaje / 100);
  }

  /**
   * Verifica si el producto está disponible
   * @returns {boolean} True si hay stock disponible
   * @readonly
   */
  get disponible() {
    return this.stock > 0;
  }
}
```

## 🛡️ Seguridad

### 1. Validación Estricta

```javascript
class ProductoSeguro {
  constructor(datos) {
    this.nombre = this.validarNombre(datos.nombre);
    this.precio = this.validarPrecio(datos.precio);
    this.categoria = this.validarCategoria(datos.categoria);
  }

  validarNombre(nombre) {
    if (typeof nombre !== 'string') {
      throw new Error('Nombre debe ser una cadena');
    }

    if (nombre.length < 2 || nombre.length > 255) {
      throw new Error('Nombre debe tener entre 2 y 255 caracteres');
    }

    // Sanitizar para prevenir XSS
    return nombre.replace(/<[^>]*>/g, '');
  }

  validarPrecio(precio) {
    if (typeof precio !== 'number' || isNaN(precio)) {
      throw new Error('Precio debe ser un número');
    }

    if (precio <= 0 || precio > 999999999) {
      throw new Error('Precio debe estar entre 1 y 999,999,999');
    }

    return precio;
  }

  validarCategoria(categoria) {
    const categoriasPermitidas = [
      'Electrónicos',
      'Ropa',
      'Hogar',
      'Deportes',
      'Libros',
    ];

    if (!categoriasPermitidas.includes(categoria)) {
      throw new Error('Categoría no válida');
    }

    return categoria;
  }
}
```

### 2. Sanitización de Datos

```javascript
class SanitizadorDatos {
  static sanitizarTexto(texto) {
    if (typeof texto !== 'string') return '';

    return texto
      .replace(/<[^>]*>/g, '') // Remover HTML
      .replace(/[<>&"']/g, char => {
        // Escapar caracteres especiales
        const map = {
          '<': '&lt;',
          '>': '&gt;',
          '&': '&amp;',
          '"': '&quot;',
          "'": '&#x27;',
        };
        return map[char];
      })
      .trim()
      .substring(0, 255); // Limitar longitud
  }

  static sanitizarNumero(numero, min = 0, max = Number.MAX_SAFE_INTEGER) {
    const num = parseFloat(numero);

    if (isNaN(num)) return 0;

    return Math.max(min, Math.min(max, num));
  }

  static sanitizarEmail(email) {
    if (typeof email !== 'string') return '';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      throw new Error('Email inválido');
    }

    return email.toLowerCase().trim();
  }
}

// Uso
const datosProducto = {
  nombre: '<script>alert("XSS")</script>Laptop',
  precio: '1500000.50',
  email: 'ADMIN@EXAMPLE.COM',
};

const productoSeguro = {
  nombre: SanitizadorDatos.sanitizarTexto(datosProducto.nombre),
  precio: SanitizadorDatos.sanitizarNumero(datosProducto.precio),
  email: SanitizadorDatos.sanitizarEmail(datosProducto.email),
};
```

## 📈 Monitoring y Logging

### 1. Logging Integrado

```javascript
class ProductoConLogging {
  constructor(nombre, precio, logger) {
    this.nombre = nombre;
    this.precio = precio;
    this.logger = logger;
    this.fechaCreacion = new Date();

    this.logger.info('Producto creado', {
      nombre,
      precio,
      timestamp: this.fechaCreacion,
    });
  }

  actualizarPrecio(nuevoPrecio) {
    const precioAnterior = this.precio;
    this.precio = nuevoPrecio;

    this.logger.info('Precio actualizado', {
      producto: this.nombre,
      precioAnterior,
      precioNuevo: nuevoPrecio,
      timestamp: new Date(),
    });
  }

  aplicarDescuento(porcentaje) {
    const precioAnterior = this.precio;
    this.precio = this.precio * (1 - porcentaje / 100);

    this.logger.info('Descuento aplicado', {
      producto: this.nombre,
      porcentaje,
      precioAnterior,
      precioNuevo: this.precio,
      timestamp: new Date(),
    });
  }
}
```

## 🎯 Checklist de Mejores Prácticas

### ✅ Diseño de Clases

- [ ] Cada clase tiene una responsabilidad única
- [ ] Nombres descriptivos y consistentes
- [ ] Métodos pequeños y enfocados
- [ ] Propiedades privadas cuando sea necesario
- [ ] Validación de parámetros
- [ ] Documentación con JSDoc

### ✅ Rendimiento

- [ ] Lazy loading para propiedades costosas
- [ ] Reutilización de objetos cuando sea posible
- [ ] Evitar crear objetos innecesarios en loops
- [ ] Usar WeakMap para propiedades privadas
- [ ] Implementar toString() y valueOf() apropiadamente

### ✅ Mantenibilidad

- [ ] Código fácil de leer y entender
- [ ] Funciones puras cuando sea posible
- [ ] Evitar efectos secundarios
- [ ] Testing unitario completo
- [ ] Logging apropiado

### ✅ Seguridad

- [ ] Validación estricta de entrada
- [ ] Sanitización de datos
- [ ] Evitar eval() y funciones similares
- [ ] Manejo seguro de errores
- [ ] Principio de menor privilegio

---

_Esta guía forma parte del entrenamiento WorldSkills - Día 5: Objetos y Propiedades_
