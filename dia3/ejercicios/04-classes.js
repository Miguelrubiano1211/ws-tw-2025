// 📝 Ejercicio 4: Classes y Programación Orientada a Objetos
// Día 3 - JavaScript ES6+ Fundamentals

console.log('🚀 Ejercicio 4: Classes y Programación Orientada a Objetos');

// ============================================
// Ejercicio 4.1: Crear una Clase Básica
// ============================================
console.log('\n--- Ejercicio 4.1: Crear una Clase Básica ---');

class Producto {
  constructor(nombre, precio, categoria) {
    this.nombre = nombre;
    this.precio = precio;
    this.categoria = categoria;
    this.fechaCreacion = new Date();
  }

  // Método para obtener información
  obtenerInfo() {
    return `${this.nombre} - $${this.precio} (${this.categoria})`;
  }

  // Método para aplicar descuento
  aplicarDescuento(porcentaje) {
    this.precio = this.precio * (1 - porcentaje / 100);
    return this.precio;
  }

  // Getter para precio formateado
  get precioFormateado() {
    return `$${this.precio.toFixed(2)}`;
  }

  // Setter para precio con validación
  set nuevoPrecio(precio) {
    if (precio > 0) {
      this.precio = precio;
    } else {
      console.log('Error: El precio debe ser mayor a 0');
    }
  }
}

// Crear instancias
const laptop = new Producto('Laptop Gaming', 1200, 'Electrónicos');
const mouse = new Producto('Mouse Inalámbrico', 35, 'Accesorios');

console.log('Producto 1:', laptop.obtenerInfo());
console.log('Producto 2:', mouse.obtenerInfo());

// Aplicar descuento
console.log('Precio original laptop:', laptop.precioFormateado);
laptop.aplicarDescuento(10);
console.log('Precio con descuento:', laptop.precioFormateado);

// Usar setter
laptop.nuevoPrecio = 1000;
console.log('Nuevo precio:', laptop.precioFormateado);

// TODO: Crea una clase Estudiante con nombre, edad y materias
// Debe tener métodos para agregar materias y calcular promedio
class Estudiante {
  constructor(nombre, edad) {
    this.nombre = nombre;
    this.edad = edad;
    this.materias = [];
  }

  agregarMateria(materia, nota) {
    this.materias.push({ materia, nota });
  }

  calcularPromedio() {
    if (this.materias.length === 0) return 0;
    const suma = this.materias.reduce(
      (total, materia) => total + materia.nota,
      0
    );
    return suma / this.materias.length;
  }

  obtenerInfo() {
    return `${this.nombre} (${
      this.edad
    } años) - Promedio: ${this.calcularPromedio().toFixed(2)}`;
  }
}

// Prueba tu clase
const estudiante = new Estudiante('Ana', 20);
estudiante.agregarMateria('Matemáticas', 85);
estudiante.agregarMateria('Historia', 92);
estudiante.agregarMateria('Ciencias', 78);
console.log('Estudiante:', estudiante.obtenerInfo());

// ============================================
// Ejercicio 4.2: Herencia
// ============================================
console.log('\n--- Ejercicio 4.2: Herencia ---');

class ProductoDigital extends Producto {
  constructor(nombre, precio, categoria, formato, tamano) {
    super(nombre, precio, categoria);
    this.formato = formato;
    this.tamano = tamano;
    this.descargado = false;
  }

  descargar() {
    this.descargado = true;
    return `${this.nombre} descargado exitosamente`;
  }

  // Sobrescribir método padre
  obtenerInfo() {
    const infoBase = super.obtenerInfo();
    return `${infoBase} [${this.formato}, ${this.tamano}MB]`;
  }
}

class ProductoFisico extends Producto {
  constructor(nombre, precio, categoria, peso, dimensiones) {
    super(nombre, precio, categoria);
    this.peso = peso;
    this.dimensiones = dimensiones;
    this.enviado = false;
  }

  enviar() {
    this.enviado = true;
    return `${this.nombre} enviado exitosamente`;
  }

  calcularCostoEnvio() {
    return this.peso * 0.5; // $0.5 por kg
  }

  obtenerInfo() {
    const infoBase = super.obtenerInfo();
    return `${infoBase} [${this.peso}kg, ${this.dimensiones}]`;
  }
}

// Crear productos específicos
const ebook = new ProductoDigital(
  'Curso JavaScript',
  49.99,
  'Educación',
  'PDF',
  15
);
const libro = new ProductoFisico(
  'Libro JavaScript',
  29.99,
  'Educación',
  0.5,
  '20x15x2cm'
);

console.log('Ebook:', ebook.obtenerInfo());
console.log('Libro:', libro.obtenerInfo());
console.log('Costo envío libro:', libro.calcularCostoEnvio());

// TODO: Crea una clase Empleado y dos subclases: EmpleadoTiempoCompleto y EmpleadoMedioTiempo
// Cada una debe calcular el salario de manera diferente
class Empleado {
  constructor(nombre, salarioBase) {
    this.nombre = nombre;
    this.salarioBase = salarioBase;
  }

  calcularSalario() {
    return this.salarioBase;
  }

  obtenerInfo() {
    return `${this.nombre} - Salario: $${this.calcularSalario()}`;
  }
}

class EmpleadoTiempoCompleto extends Empleado {
  constructor(nombre, salarioBase, bonificacion = 0) {
    super(nombre, salarioBase);
    this.bonificacion = bonificacion;
  }

  calcularSalario() {
    return this.salarioBase + this.bonificacion;
  }
}

class EmpleadoMedioTiempo extends Empleado {
  constructor(nombre, tarifaHora, horasTrabajadas) {
    super(nombre, 0);
    this.tarifaHora = tarifaHora;
    this.horasTrabajadas = horasTrabajadas;
  }

  calcularSalario() {
    return this.tarifaHora * this.horasTrabajadas;
  }
}

// Pruebas
const empleado1 = new EmpleadoTiempoCompleto('Carlos', 3000, 500);
const empleado2 = new EmpleadoMedioTiempo('Ana', 15, 80);

console.log('Empleado tiempo completo:', empleado1.obtenerInfo());
console.log('Empleado medio tiempo:', empleado2.obtenerInfo());

// ============================================
// Ejercicio 4.3: Métodos Estáticos
// ============================================
console.log('\n--- Ejercicio 4.3: Métodos Estáticos ---');

class Utilidades {
  static formatearMoneda(cantidad) {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
    }).format(cantidad);
  }

  static validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  static calcularImpuesto(precio, porcentaje = 19) {
    return precio * (porcentaje / 100);
  }

  static generarId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

// Usar métodos estáticos
console.log('Moneda formateada:', Utilidades.formatearMoneda(150000));
console.log('Email válido:', Utilidades.validarEmail('test@example.com'));
console.log('Impuesto:', Utilidades.calcularImpuesto(100));
console.log('ID generado:', Utilidades.generarId());

// TODO: Crea una clase Calculadora con métodos estáticos para operaciones básicas
class Calculadora {
  static sumar(a, b) {
    return a + b;
  }

  static restar(a, b) {
    return a - b;
  }

  static multiplicar(a, b) {
    return a * b;
  }

  static dividir(a, b) {
    if (b === 0) {
      throw new Error('División por cero no permitida');
    }
    return a / b;
  }

  static potencia(base, exponente) {
    return Math.pow(base, exponente);
  }
}

// Pruebas
console.log('Suma:', Calculadora.sumar(10, 5));
console.log('Resta:', Calculadora.restar(10, 5));
console.log('Multiplicación:', Calculadora.multiplicar(10, 5));
console.log('División:', Calculadora.dividir(10, 5));
console.log('Potencia:', Calculadora.potencia(2, 3));

// ============================================
// Ejercicio 4.4: Encapsulación con Propiedades Privadas
// ============================================
console.log('\n--- Ejercicio 4.4: Encapsulación con Propiedades Privadas ---');

class CuentaBancaria {
  #saldo = 0;
  #pin = null;

  constructor(titular, pinInicial) {
    this.titular = titular;
    this.#pin = pinInicial;
    this.historial = [];
  }

  #validarPin(pin) {
    return pin === this.#pin;
  }

  #registrarTransaccion(tipo, monto) {
    this.historial.push({
      tipo,
      monto,
      fecha: new Date(),
      saldoResultante: this.#saldo,
    });
  }

  depositar(monto, pin) {
    if (!this.#validarPin(pin)) {
      return 'PIN incorrecto';
    }

    if (monto <= 0) {
      return 'El monto debe ser positivo';
    }

    this.#saldo += monto;
    this.#registrarTransaccion('depósito', monto);
    return `Depósito exitoso. Saldo actual: $${this.#saldo}`;
  }

  retirar(monto, pin) {
    if (!this.#validarPin(pin)) {
      return 'PIN incorrecto';
    }

    if (monto <= 0) {
      return 'El monto debe ser positivo';
    }

    if (monto > this.#saldo) {
      return 'Saldo insuficiente';
    }

    this.#saldo -= monto;
    this.#registrarTransaccion('retiro', monto);
    return `Retiro exitoso. Saldo actual: $${this.#saldo}`;
  }

  consultarSaldo(pin) {
    if (!this.#validarPin(pin)) {
      return 'PIN incorrecto';
    }

    return `Saldo actual: $${this.#saldo}`;
  }

  cambiarPin(pinActual, pinNuevo) {
    if (!this.#validarPin(pinActual)) {
      return 'PIN actual incorrecto';
    }

    this.#pin = pinNuevo;
    return 'PIN cambiado exitosamente';
  }
}

// Prueba la cuenta bancaria
const cuenta = new CuentaBancaria('Juan Pérez', '1234');

console.log(cuenta.depositar(1000, '1234'));
console.log(cuenta.retirar(200, '1234'));
console.log(cuenta.consultarSaldo('1234'));
console.log(cuenta.retirar(200, '5678')); // PIN incorrecto
console.log('Historial:', cuenta.historial);

// ============================================
// Desafío: Sistema de Gestión de Inventario
// ============================================
console.log('\n--- 🎯 Desafío: Sistema de Gestión de Inventario ---');

class Inventario {
  constructor() {
    this.productos = [];
    this.siguienteId = 1;
  }

  agregarProducto(nombre, precio, categoria, cantidad = 0) {
    const producto = {
      id: this.siguienteId++,
      nombre,
      precio,
      categoria,
      cantidad,
      fechaCreacion: new Date(),
    };

    this.productos.push(producto);
    return `Producto ${nombre} agregado con ID: ${producto.id}`;
  }

  buscarProducto(id) {
    return this.productos.find(p => p.id === id);
  }

  actualizarStock(id, cantidad) {
    const producto = this.buscarProducto(id);
    if (!producto) {
      return 'Producto no encontrado';
    }

    producto.cantidad += cantidad;
    return `Stock actualizado. Cantidad actual: ${producto.cantidad}`;
  }

  obtenerProductosPorCategoria(categoria) {
    return this.productos.filter(p => p.categoria === categoria);
  }

  obtenerValorTotal() {
    return this.productos.reduce((total, producto) => {
      return total + producto.precio * producto.cantidad;
    }, 0);
  }

  obtenerProductosBajoStock(limite = 10) {
    return this.productos.filter(p => p.cantidad < limite);
  }

  generarReporte() {
    return {
      totalProductos: this.productos.length,
      valorTotal: this.obtenerValorTotal(),
      categorias: [...new Set(this.productos.map(p => p.categoria))],
      productosBajoStock: this.obtenerProductosBajoStock().length,
    };
  }
}

// Prueba del sistema
const inventario = new Inventario();

console.log(inventario.agregarProducto('Laptop', 1200, 'Electrónicos', 5));
console.log(inventario.agregarProducto('Mouse', 25, 'Accesorios', 20));
console.log(inventario.agregarProducto('Teclado', 80, 'Accesorios', 15));
console.log(inventario.agregarProducto('Monitor', 300, 'Electrónicos', 3));

console.log('Stock actualizado:', inventario.actualizarStock(1, 10));
console.log(
  'Productos electrónicos:',
  inventario.obtenerProductosPorCategoria('Electrónicos')
);
console.log('Valor total inventario:', inventario.obtenerValorTotal());
console.log('Productos bajo stock:', inventario.obtenerProductosBajoStock(8));
console.log('Reporte general:', inventario.generarReporte());

// ============================================
// 🎯 Puntos Clave para WorldSkills
// ============================================
console.log('\n🎯 Puntos Clave para WorldSkills:');
console.log('✅ Las clases organizan el código de manera clara y reutilizable');
console.log('✅ La herencia permite reutilizar código y crear jerarquías');
console.log('✅ Los métodos estáticos son útiles para utilidades');
console.log('✅ La encapsulación protege los datos importantes');
console.log(
  '✅ Los getters y setters permiten controlar el acceso a propiedades'
);
console.log('✅ super() es crucial para trabajar con herencia');
console.log('✅ Las propiedades privadas (#) aumentan la seguridad del código');
