/**
 * DÍA 10: JAVASCRIPT MODERNO (ES6+)
 * EJERCICIO 5: CLASES Y HERENCIA
 *
 * Descripción:
 * Dominar el uso de clases ES6, herencia, métodos estáticos,
 * getters/setters y patrones de diseño orientado a objetos.
 *
 * Objetivos:
 * - Crear clases con constructor y métodos
 * - Implementar herencia con extends y super
 * - Usar métodos estáticos y de instancia
 * - Aplicar encapsulación con campos privados
 * - Implementar patrones de diseño con clases
 *
 * Tiempo estimado: 55 minutos
 *
 * Instrucciones:
 * 1. Estudia cada ejemplo y completa los ejercicios
 * 2. Experimenta con herencia y polimorfismo
 * 3. Aplica principios de programación orientada a objetos
 * 4. Completa los desafíos de patrones de diseño
 *
 * Nota: Los campos privados (#) son ES2022, usa _ para compatibilidad
 */

console.log('=== DÍA 10 - EJERCICIO 5: CLASES Y HERENCIA ===\n');

// ====================================
// 1. CLASES BÁSICAS
// ====================================

console.log('1. CLASES BÁSICAS');
console.log('--------------------------------');

// Clase básica con constructor
class Persona {
  constructor(nombre, edad) {
    this.nombre = nombre;
    this.edad = edad;
  }

  // Método de instancia
  saludar() {
    return `Hola, soy ${this.nombre} y tengo ${this.edad} años`;
  }

  // Método getter
  get info() {
    return `${this.nombre} (${this.edad} años)`;
  }

  // Método setter
  set edad(nuevaEdad) {
    if (nuevaEdad >= 0) {
      this._edad = nuevaEdad;
    }
  }

  get edad() {
    return this._edad;
  }

  // Método estático
  static crearAdulto(nombre) {
    return new Persona(nombre, 18);
  }
}

// Crear instancias
const persona1 = new Persona('Ana', 25);
const persona2 = Persona.crearAdulto('Carlos');

console.log('Persona 1:', persona1.saludar());
console.log('Persona 2:', persona2.saludar());
console.log('Info persona 1:', persona1.info);

// EJERCICIO 1.1: Crear clase Producto
class Producto {
  constructor(nombre, precio, categoria) {
    this.nombre = nombre;
    this.precio = precio;
    this.categoria = categoria;
    this.disponible = true;
  }

  // TODO: Implementar getter para precio con formato
  get precioFormateado() {
    return `$${this.precio.toFixed(2)}`;
  }

  // TODO: Implementar setter para precio con validación
  set precio(nuevoPrecio) {
    if (nuevoPrecio >= 0) {
      this._precio = nuevoPrecio;
    } else {
      throw new Error('El precio debe ser positivo');
    }
  }

  get precio() {
    return this._precio;
  }

  // TODO: Método para aplicar descuento
  aplicarDescuento(porcentaje) {
    if (porcentaje >= 0 && porcentaje <= 100) {
      this.precio = this.precio * (1 - porcentaje / 100);
    }
  }

  // TODO: Método estático para crear producto gratuito
  static crearGratuito(nombre, categoria) {
    return new Producto(nombre, 0, categoria);
  }
}

const laptop = new Producto('Laptop Gaming', 1500, 'Electrónicos');
console.log('Laptop:', laptop.precioFormateado);

laptop.aplicarDescuento(10);
console.log('Laptop con descuento:', laptop.precioFormateado);

const regalo = Producto.crearGratuito('Muestra', 'Promocional');
console.log('Regalo:', regalo.precioFormateado);

console.log('\n');

// ====================================
// 2. HERENCIA CON EXTENDS
// ====================================

console.log('2. HERENCIA CON EXTENDS');
console.log('--------------------------------');

// Clase base
class Animal {
  constructor(nombre, especie) {
    this.nombre = nombre;
    this.especie = especie;
  }

  hacerSonido() {
    return `${this.nombre} hace un sonido`;
  }

  moverse() {
    return `${this.nombre} se mueve`;
  }

  get descripcion() {
    return `${this.nombre} es un ${this.especie}`;
  }
}

// Clase derivada
class Perro extends Animal {
  constructor(nombre, raza) {
    super(nombre, 'perro'); // Llamar al constructor padre
    this.raza = raza;
  }

  // Sobrescribir método padre
  hacerSonido() {
    return `${this.nombre} ladra: ¡Guau!`;
  }

  // Método específico de la clase
  buscarPelota() {
    return `${this.nombre} busca la pelota`;
  }

  // Getter que usa super
  get descripcion() {
    return `${super.descripcion} de raza ${this.raza}`;
  }
}

// Otra clase derivada
class Gato extends Animal {
  constructor(nombre, color) {
    super(nombre, 'gato');
    this.color = color;
  }

  hacerSonido() {
    return `${this.nombre} maúlla: ¡Miau!`;
  }

  trepar() {
    return `${this.nombre} trepa al árbol`;
  }

  get descripcion() {
    return `${super.descripcion} de color ${this.color}`;
  }
}

// Crear instancias
const perro = new Perro('Rex', 'Labrador');
const gato = new Gato('Whiskers', 'naranja');

console.log('Perro:', perro.descripcion);
console.log('Sonido perro:', perro.hacerSonido());
console.log('Acción perro:', perro.buscarPelota());

console.log('Gato:', gato.descripcion);
console.log('Sonido gato:', gato.hacerSonido());
console.log('Acción gato:', gato.trepar());

// EJERCICIO 2.1: Crear jerarquía de empleados
class Empleado {
  constructor(nombre, salario) {
    this.nombre = nombre;
    this.salario = salario;
  }

  calcularSalarioAnual() {
    return this.salario * 12;
  }

  get info() {
    return `${this.nombre} - Salario: $${this.salario}`;
  }
}

class Desarrollador extends Empleado {
  constructor(nombre, salario, lenguajes) {
    super(nombre, salario);
    this.lenguajes = lenguajes;
  }

  // TODO: Método para agregar lenguaje
  aprenderLenguaje(lenguaje) {
    if (!this.lenguajes.includes(lenguaje)) {
      this.lenguajes.push(lenguaje);
    }
  }

  // TODO: Sobrescribir calcularSalarioAnual con bono
  calcularSalarioAnual() {
    const salarioBase = super.calcularSalarioAnual();
    const bonoPorLenguaje = this.lenguajes.length * 1000;
    return salarioBase + bonoPorLenguaje;
  }

  get info() {
    return `${super.info} - Lenguajes: ${this.lenguajes.join(', ')}`;
  }
}

class Gerente extends Empleado {
  constructor(nombre, salario, equipoSize) {
    super(nombre, salario);
    this.equipoSize = equipoSize;
  }

  // TODO: Sobrescribir calcularSalarioAnual con bono de gestión
  calcularSalarioAnual() {
    const salarioBase = super.calcularSalarioAnual();
    const bonoGestion = this.equipoSize * 2000;
    return salarioBase + bonoGestion;
  }

  get info() {
    return `${super.info} - Equipo: ${this.equipoSize} personas`;
  }
}

const dev = new Desarrollador('Ana', 5000, ['JavaScript', 'Python']);
const gerente = new Gerente('Carlos', 7000, 8);

console.log('Desarrollador:', dev.info);
console.log('Salario anual dev:', dev.calcularSalarioAnual());

dev.aprenderLenguaje('TypeScript');
console.log('Desarrollador actualizado:', dev.info);
console.log('Nuevo salario anual:', dev.calcularSalarioAnual());

console.log('Gerente:', gerente.info);
console.log('Salario anual gerente:', gerente.calcularSalarioAnual());

console.log('\n');

// ====================================
// 3. MÉTODOS ESTÁTICOS Y DE INSTANCIA
// ====================================

console.log('3. MÉTODOS ESTÁTICOS Y DE INSTANCIA');
console.log('--------------------------------');

class Matematicas {
  constructor(valor) {
    this.valor = valor;
  }

  // Métodos de instancia
  sumar(numero) {
    this.valor += numero;
    return this;
  }

  multiplicar(numero) {
    this.valor *= numero;
    return this;
  }

  obtenerValor() {
    return this.valor;
  }

  // Métodos estáticos
  static sumar(a, b) {
    return a + b;
  }

  static multiplicar(a, b) {
    return a * b;
  }

  static factorial(n) {
    if (n <= 1) return 1;
    return n * Matematicas.factorial(n - 1);
  }

  static esPar(numero) {
    return numero % 2 === 0;
  }

  static max(...numeros) {
    return Math.max(...numeros);
  }
}

// Usar métodos estáticos
console.log('Suma estática:', Matematicas.sumar(5, 3));
console.log('Factorial de 5:', Matematicas.factorial(5));
console.log('Es par 4:', Matematicas.esPar(4));
console.log('Máximo:', Matematicas.max(1, 5, 3, 9, 2));

// Usar métodos de instancia (fluent interface)
const calc = new Matematicas(10);
const resultado = calc.sumar(5).multiplicar(2).obtenerValor();
console.log('Resultado fluent:', resultado);

// EJERCICIO 3.1: Crear clase Utilidades
class Utilidades {
  // TODO: Métodos estáticos para validaciones
  static validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  static validarTelefono(telefono) {
    const regex = /^\+?[\d\s-()]{10,}$/;
    return regex.test(telefono);
  }

  // TODO: Métodos estáticos para formateo
  static formatearFecha(fecha) {
    return fecha.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  static formatearMoneda(cantidad, moneda = 'COP') {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: moneda,
    }).format(cantidad);
  }

  // TODO: Método estático para generar IDs
  static generarId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

console.log('Email válido:', Utilidades.validarEmail('test@email.com'));
console.log('Teléfono válido:', Utilidades.validarTelefono('+57 300 123 4567'));
console.log('Fecha formateada:', Utilidades.formatearFecha(new Date()));
console.log('Moneda formateada:', Utilidades.formatearMoneda(150000));
console.log('ID generado:', Utilidades.generarId());

console.log('\n');

// ====================================
// 4. ENCAPSULACIÓN (CAMPOS PRIVADOS)
// ====================================

console.log('4. ENCAPSULACIÓN (CAMPOS PRIVADOS)');
console.log('--------------------------------');

// Usando convención _ para campos privados (compatible)
class CuentaBancaria {
  constructor(numeroCuenta, saldoInicial = 0) {
    this.numeroCuenta = numeroCuenta;
    this._saldo = saldoInicial;
    this._historial = [];
  }

  // Getter para saldo (solo lectura)
  get saldo() {
    return this._saldo;
  }

  // Método público para depositar
  depositar(cantidad) {
    if (cantidad > 0) {
      this._saldo += cantidad;
      this._registrarTransaccion('DEPÓSITO', cantidad);
      return true;
    }
    return false;
  }

  // Método público para retirar
  retirar(cantidad) {
    if (cantidad > 0 && cantidad <= this._saldo) {
      this._saldo -= cantidad;
      this._registrarTransaccion('RETIRO', cantidad);
      return true;
    }
    return false;
  }

  // Método privado (convención)
  _registrarTransaccion(tipo, cantidad) {
    this._historial.push({
      tipo,
      cantidad,
      fecha: new Date(),
      saldoResultante: this._saldo,
    });
  }

  // Método público para ver historial
  obtenerHistorial() {
    return [...this._historial]; // Copia para evitar mutación
  }

  // Método público para ver resumen
  obtenerResumen() {
    const totalDepositos = this._historial
      .filter(t => t.tipo === 'DEPÓSITO')
      .reduce((sum, t) => sum + t.cantidad, 0);

    const totalRetiros = this._historial
      .filter(t => t.tipo === 'RETIRO')
      .reduce((sum, t) => sum + t.cantidad, 0);

    return {
      numeroCuenta: this.numeroCuenta,
      saldoActual: this._saldo,
      totalDepositos,
      totalRetiros,
      cantidadTransacciones: this._historial.length,
    };
  }
}

// Usar la clase
const cuenta = new CuentaBancaria('123456789', 1000);

console.log('Saldo inicial:', cuenta.saldo);

cuenta.depositar(500);
console.log('Después de depósito:', cuenta.saldo);

cuenta.retirar(200);
console.log('Después de retiro:', cuenta.saldo);

console.log('Resumen:', cuenta.obtenerResumen());

// EJERCICIO 4.1: Crear clase Usuario con encapsulación
class Usuario {
  constructor(username, email) {
    this.username = username;
    this.email = email;
    this._password = null;
    this._intentosLogin = 0;
    this._bloqueado = false;
    this._ultimoLogin = null;
  }

  // TODO: Método para establecer password con validación
  establecerPassword(password) {
    if (this._validarPassword(password)) {
      this._password = this._hashPassword(password);
      return true;
    }
    return false;
  }

  // TODO: Método para intentar login
  login(password) {
    if (this._bloqueado) {
      return { exitoso: false, mensaje: 'Cuenta bloqueada' };
    }

    if (this._verificarPassword(password)) {
      this._intentosLogin = 0;
      this._ultimoLogin = new Date();
      return { exitoso: true, mensaje: 'Login exitoso' };
    } else {
      this._intentosLogin++;
      if (this._intentosLogin >= 3) {
        this._bloqueado = true;
        return {
          exitoso: false,
          mensaje: 'Cuenta bloqueada por intentos fallidos',
        };
      }
      return { exitoso: false, mensaje: 'Password incorrecto' };
    }
  }

  // Métodos privados
  _validarPassword(password) {
    return (
      password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)
    );
  }

  _hashPassword(password) {
    // Simulación de hash - en producción usar bcrypt
    return btoa(password);
  }

  _verificarPassword(password) {
    return this._password === this._hashPassword(password);
  }

  // TODO: Método público para desbloquear (solo admin)
  desbloquear() {
    this._bloqueado = false;
    this._intentosLogin = 0;
  }

  // Getter para información pública
  get info() {
    return {
      username: this.username,
      email: this.email,
      ultimoLogin: this._ultimoLogin,
      bloqueado: this._bloqueado,
    };
  }
}

const usuario = new Usuario('ana123', 'ana@email.com');
console.log('Usuario creado:', usuario.info);

console.log(
  'Establecer password:',
  usuario.establecerPassword('MiPassword123')
);

console.log('Login correcto:', usuario.login('MiPassword123'));
console.log('Info después login:', usuario.info);

console.log('Login incorrecto:', usuario.login('wrong'));
console.log('Login incorrecto 2:', usuario.login('wrong'));
console.log('Login incorrecto 3:', usuario.login('wrong'));

console.log('\n');

// ====================================
// 5. POLIMORFISMO
// ====================================

console.log('5. POLIMORFISMO');
console.log('--------------------------------');

// Clase base abstracta
class Forma {
  constructor(nombre) {
    this.nombre = nombre;
  }

  // Método que debe ser sobrescrito
  calcularArea() {
    throw new Error('Método calcularArea debe ser implementado');
  }

  calcularPerimetro() {
    throw new Error('Método calcularPerimetro debe ser implementado');
  }

  // Método común
  describir() {
    return `${
      this.nombre
    } - Área: ${this.calcularArea()}, Perímetro: ${this.calcularPerimetro()}`;
  }
}

// Implementaciones específicas
class Rectangulo extends Forma {
  constructor(ancho, alto) {
    super('Rectángulo');
    this.ancho = ancho;
    this.alto = alto;
  }

  calcularArea() {
    return this.ancho * this.alto;
  }

  calcularPerimetro() {
    return 2 * (this.ancho + this.alto);
  }
}

class Circulo extends Forma {
  constructor(radio) {
    super('Círculo');
    this.radio = radio;
  }

  calcularArea() {
    return Math.PI * this.radio * this.radio;
  }

  calcularPerimetro() {
    return 2 * Math.PI * this.radio;
  }
}

class Triangulo extends Forma {
  constructor(base, altura, lado1, lado2) {
    super('Triángulo');
    this.base = base;
    this.altura = altura;
    this.lado1 = lado1;
    this.lado2 = lado2;
  }

  calcularArea() {
    return (this.base * this.altura) / 2;
  }

  calcularPerimetro() {
    return this.base + this.lado1 + this.lado2;
  }
}

// Usar polimorfismo
const formas = [
  new Rectangulo(10, 5),
  new Circulo(7),
  new Triangulo(8, 6, 10, 10),
];

console.log('=== POLIMORFISMO EN ACCIÓN ===');
formas.forEach(forma => {
  console.log(forma.describir());
});

// Función que usa polimorfismo
function compararAreas(forma1, forma2) {
  const area1 = forma1.calcularArea();
  const area2 = forma2.calcularArea();

  if (area1 > area2) {
    return `${forma1.nombre} tiene mayor área (${area1.toFixed(2)})`;
  } else if (area2 > area1) {
    return `${forma2.nombre} tiene mayor área (${area2.toFixed(2)})`;
  } else {
    return 'Ambas formas tienen la misma área';
  }
}

console.log('\n=== COMPARACIÓN ===');
console.log(compararAreas(formas[0], formas[1]));

console.log('\n');

// ====================================
// 6. PATRONES DE DISEÑO CON CLASES
// ====================================

console.log('6. PATRONES DE DISEÑO CON CLASES');
console.log('--------------------------------');

// PATRÓN SINGLETON
class Logger {
  constructor() {
    if (Logger.instance) {
      return Logger.instance;
    }

    this.logs = [];
    Logger.instance = this;
  }

  log(nivel, mensaje) {
    const logEntry = {
      timestamp: new Date(),
      nivel,
      mensaje,
    };

    this.logs.push(logEntry);
    console.log(`[${nivel.toUpperCase()}] ${mensaje}`);
  }

  obtenerLogs() {
    return [...this.logs];
  }

  static getInstance() {
    return new Logger();
  }
}

// PATRÓN FACTORY
class VehiculoFactory {
  static crearVehiculo(tipo, marca, modelo) {
    switch (tipo.toLowerCase()) {
      case 'carro':
        return new Carro(marca, modelo);
      case 'moto':
        return new Moto(marca, modelo);
      case 'bicicleta':
        return new Bicicleta(marca, modelo);
      default:
        throw new Error(`Tipo de vehículo no soportado: ${tipo}`);
    }
  }
}

// Clases de vehículos
class Vehiculo {
  constructor(marca, modelo) {
    this.marca = marca;
    this.modelo = modelo;
  }

  arrancar() {
    return `${this.marca} ${this.modelo} arrancó`;
  }

  detener() {
    return `${this.marca} ${this.modelo} se detuvo`;
  }
}

class Carro extends Vehiculo {
  constructor(marca, modelo) {
    super(marca, modelo);
    this.tipo = 'Carro';
    this.ruedas = 4;
  }

  arrancar() {
    return `${super.arrancar()} el motor`;
  }
}

class Moto extends Vehiculo {
  constructor(marca, modelo) {
    super(marca, modelo);
    this.tipo = 'Moto';
    this.ruedas = 2;
  }

  arrancar() {
    return `${super.arrancar()} con kick`;
  }
}

class Bicicleta extends Vehiculo {
  constructor(marca, modelo) {
    super(marca, modelo);
    this.tipo = 'Bicicleta';
    this.ruedas = 2;
  }

  arrancar() {
    return `${this.marca} ${this.modelo} se puso en movimiento pedaleando`;
  }
}

// PATRÓN OBSERVER
class Observable {
  constructor() {
    this.observadores = [];
  }

  agregar(observador) {
    this.observadores.push(observador);
  }

  remover(observador) {
    const index = this.observadores.indexOf(observador);
    if (index > -1) {
      this.observadores.splice(index, 1);
    }
  }

  notificar(evento, datos) {
    this.observadores.forEach(observador => {
      observador.actualizar(evento, datos);
    });
  }
}

class CarritoCompras extends Observable {
  constructor() {
    super();
    this.items = [];
  }

  agregar(producto) {
    this.items.push(producto);
    this.notificar('ITEM_AGREGADO', { producto, total: this.items.length });
  }

  remover(index) {
    if (index >= 0 && index < this.items.length) {
      const producto = this.items.splice(index, 1)[0];
      this.notificar('ITEM_REMOVIDO', { producto, total: this.items.length });
    }
  }

  obtenerTotal() {
    return this.items.reduce((total, item) => total + item.precio, 0);
  }
}

class NotificadorCarrito {
  actualizar(evento, datos) {
    switch (evento) {
      case 'ITEM_AGREGADO':
        console.log(
          `✅ Producto agregado: ${datos.producto.nombre} (Total items: ${datos.total})`
        );
        break;
      case 'ITEM_REMOVIDO':
        console.log(
          `❌ Producto removido: ${datos.producto.nombre} (Total items: ${datos.total})`
        );
        break;
    }
  }
}

// Usar patrones
console.log('=== PATRÓN SINGLETON ===');
const logger1 = Logger.getInstance();
const logger2 = Logger.getInstance();
console.log('Misma instancia:', logger1 === logger2);

logger1.log('info', 'Aplicación iniciada');
logger1.log('error', 'Error de conexión');

console.log('\n=== PATRÓN FACTORY ===');
const vehiculos = [
  VehiculoFactory.crearVehiculo('carro', 'Toyota', 'Corolla'),
  VehiculoFactory.crearVehiculo('moto', 'Yamaha', 'R1'),
  VehiculoFactory.crearVehiculo('bicicleta', 'Trek', 'Mountain'),
];

vehiculos.forEach(vehiculo => {
  console.log(vehiculo.arrancar());
});

console.log('\n=== PATRÓN OBSERVER ===');
const carrito = new CarritoCompras();
const notificador = new NotificadorCarrito();

carrito.agregar(notificador);

carrito.agregar({ nombre: 'Laptop', precio: 1000 });
carrito.agregar({ nombre: 'Mouse', precio: 50 });
carrito.remover(0);

console.log('\n');

// ====================================
// 7. EJERCICIOS AVANZADOS
// ====================================

console.log('7. EJERCICIOS AVANZADOS');
console.log('--------------------------------');

// EJERCICIO 1: Sistema de gestión de biblioteca
class Libro {
  constructor(titulo, autor, isbn) {
    this.titulo = titulo;
    this.autor = autor;
    this.isbn = isbn;
    this.disponible = true;
    this.fechaPrestamo = null;
  }

  prestar() {
    if (this.disponible) {
      this.disponible = false;
      this.fechaPrestamo = new Date();
      return true;
    }
    return false;
  }

  devolver() {
    this.disponible = true;
    this.fechaPrestamo = null;
  }

  get info() {
    return `${this.titulo} - ${this.autor} (${
      this.disponible ? 'Disponible' : 'Prestado'
    })`;
  }
}

class Biblioteca {
  constructor() {
    this.libros = [];
    this.miembros = [];
  }

  agregarLibro(libro) {
    this.libros.push(libro);
  }

  buscarLibro(criterio) {
    return this.libros.filter(
      libro =>
        libro.titulo.toLowerCase().includes(criterio.toLowerCase()) ||
        libro.autor.toLowerCase().includes(criterio.toLowerCase())
    );
  }

  prestarLibro(isbn, miembro) {
    const libro = this.libros.find(l => l.isbn === isbn);
    if (libro && libro.prestar()) {
      miembro.agregarPrestamo(libro);
      return true;
    }
    return false;
  }

  devolverLibro(isbn, miembro) {
    const libro = this.libros.find(l => l.isbn === isbn);
    if (libro && !libro.disponible) {
      libro.devolver();
      miembro.devolverLibro(isbn);
      return true;
    }
    return false;
  }

  obtenerEstadisticas() {
    const total = this.libros.length;
    const disponibles = this.libros.filter(l => l.disponible).length;
    const prestados = total - disponibles;

    return { total, disponibles, prestados };
  }
}

class Miembro {
  constructor(nombre, id) {
    this.nombre = nombre;
    this.id = id;
    this.prestamos = [];
  }

  agregarPrestamo(libro) {
    this.prestamos.push(libro);
  }

  devolverLibro(isbn) {
    const index = this.prestamos.findIndex(l => l.isbn === isbn);
    if (index > -1) {
      this.prestamos.splice(index, 1);
    }
  }

  get librosActuales() {
    return this.prestamos.length;
  }
}

// Probar sistema de biblioteca
const biblioteca = new Biblioteca();
const libro1 = new Libro('1984', 'George Orwell', '978-0-452-28423-4');
const libro2 = new Libro(
  'Cien años de soledad',
  'Gabriel García Márquez',
  '978-0-06-088328-7'
);

biblioteca.agregarLibro(libro1);
biblioteca.agregarLibro(libro2);

const miembro = new Miembro('Ana García', 'M001');

console.log('=== SISTEMA DE BIBLIOTECA ===');
console.log('Estadísticas iniciales:', biblioteca.obtenerEstadisticas());

console.log(
  'Prestar libro:',
  biblioteca.prestarLibro('978-0-452-28423-4', miembro)
);
console.log(
  'Estadísticas después del préstamo:',
  biblioteca.obtenerEstadisticas()
);
console.log('Libros del miembro:', miembro.librosActuales);

console.log('\n=== EJERCICIO 5 COMPLETADO ===');

// ====================================
// NOTAS PEDAGÓGICAS
// ====================================
/*
PUNTOS CLAVE A RECORDAR:

1. SINTAXIS DE CLASES:
   - constructor() para inicialización
   - Métodos sin function keyword
   - get/set para propiedades computadas
   - static para métodos de clase

2. HERENCIA:
   - extends para heredar de otra clase
   - super() para llamar constructor padre
   - super.método() para llamar método padre
   - Sobrescribir métodos en clases hijas

3. ENCAPSULACIÓN:
   - Convención _ para "privado"
   - Campos privados # (ES2022)
   - Getters/setters para controlar acceso
   - Métodos privados para lógica interna

4. POLIMORFISMO:
   - Misma interfaz, diferentes implementaciones
   - Útil para colecciones heterogéneas
   - Permite código más flexible

5. PATRONES DE DISEÑO:
   - Singleton: Una sola instancia
   - Factory: Crear objetos dinámicamente
   - Observer: Notificar cambios
   - Strategy: Algoritmos intercambiables

ERRORES COMUNES:
- Olvidar super() en constructor
- No bind de métodos en callbacks
- Modificar propiedades "privadas" desde fuera
- No usar getters/setters apropiadamente

WORLDSKILLS TIPS:
- Dominar herencia y polimorfismo
- Aplicar principios SOLID
- Usar patrones de diseño apropiados
- Escribir código orientado a objetos limpio
- Entender cuándo usar clases vs funciones

COMPARACIÓN CON PROTOTIPOS:
- Clases son "syntactic sugar"
- Internamente usan prototipos
- Más legible y familiar para otros lenguajes
- Mejor para herencia compleja
*/
