/**
 * 🎯 Ejercicio 2: Propiedades y Métodos
 *
 * Objetivo: Aprender a implementar métodos en objetos y manejar el contexto de 'this'
 *
 * Conceptos cubiertos:
 * - Definición de métodos
 * - Uso de 'this'
 * - Arrow functions vs function expressions
 * - Contexto y binding
 * - Métodos dinámicos
 */

console.log('🎯 Ejercicio 2: Propiedades y Métodos');
console.log('=====================================');

// ================================================
// 1. DEFINICIÓN BÁSICA DE MÉTODOS
// ================================================

console.log('\n1. Definición Básica de Métodos');
console.log('-------------------------------');

// Objeto con métodos usando function expression
const calculadora = {
  resultado: 0,

  // Método para sumar
  sumar: function (a, b) {
    this.resultado = a + b;
    return this.resultado;
  },

  // Método para restar
  restar: function (a, b) {
    this.resultado = a - b;
    return this.resultado;
  },

  // Método para multiplicar
  multiplicar: function (a, b) {
    this.resultado = a * b;
    return this.resultado;
  },

  // Método para dividir
  dividir: function (a, b) {
    if (b === 0) {
      console.log('Error: No se puede dividir por cero');
      return null;
    }
    this.resultado = a / b;
    return this.resultado;
  },

  // Método para obtener resultado
  obtenerResultado: function () {
    return this.resultado;
  },

  // Método para limpiar
  limpiar: function () {
    this.resultado = 0;
    return 'Calculadora limpia';
  },
};

// Usar la calculadora
console.log('Suma 5 + 3:', calculadora.sumar(5, 3));
console.log('Resta 10 - 4:', calculadora.restar(10, 4));
console.log('Multiplicación 7 * 8:', calculadora.multiplicar(7, 8));
console.log('División 15 / 3:', calculadora.dividir(15, 3));
console.log('Resultado actual:', calculadora.obtenerResultado());
console.log('Limpiar:', calculadora.limpiar());

// ================================================
// 2. MÉTODOS CON SINTAXIS ABREVIADA ES6
// ================================================

console.log('\n2. Métodos con Sintaxis Abreviada ES6');
console.log('-------------------------------------');

const estudiante = {
  nombre: 'Ana García',
  edad: 20,
  materias: ['JavaScript', 'HTML', 'CSS'],
  notas: [4.5, 4.8, 4.2],

  // Método abreviado ES6
  presentarse() {
    return `Hola, soy ${this.nombre} y tengo ${this.edad} años`;
  },

  // Método para agregar materia
  agregarMateria(materia, nota) {
    this.materias.push(materia);
    this.notas.push(nota);
    return `Materia ${materia} agregada con nota ${nota}`;
  },

  // Método para calcular promedio
  calcularPromedio() {
    const suma = this.notas.reduce((acc, nota) => acc + nota, 0);
    return suma / this.notas.length;
  },

  // Método para obtener estado
  obtenerEstado() {
    const promedio = this.calcularPromedio();
    if (promedio >= 4.0) {
      return 'Aprobado';
    } else {
      return 'Reprobado';
    }
  },

  // Método para mostrar información completa
  mostrarInformacion() {
    return {
      nombre: this.nombre,
      edad: this.edad,
      materias: this.materias,
      promedio: this.calcularPromedio(),
      estado: this.obtenerEstado(),
    };
  },
};

// Usar el objeto estudiante
console.log('Presentación:', estudiante.presentarse());
console.log('Agregar materia:', estudiante.agregarMateria('React', 4.9));
console.log('Promedio:', estudiante.calcularPromedio());
console.log('Estado:', estudiante.obtenerEstado());
console.log('Información completa:', estudiante.mostrarInformacion());

// ================================================
// 3. DIFERENCIA ENTRE ARROW FUNCTIONS Y FUNCTION EXPRESSIONS
// ================================================

console.log('\n3. Arrow Functions vs Function Expressions');
console.log('------------------------------------------');

const objetoConMetodos = {
  nombre: 'Objeto de Prueba',
  valor: 100,

  // ✅ Function expression - 'this' se refiere al objeto
  metodoTradicional: function () {
    return `${this.nombre} tiene valor ${this.valor}`;
  },

  // ❌ Arrow function - 'this' NO se refiere al objeto
  metodoFlecha: () => {
    // 'this' aquí se refiere al contexto global, no al objeto
    return `${this.nombre} tiene valor ${this.valor}`;
  },

  // ✅ Método abreviado ES6 - 'this' se refiere al objeto
  metodoAbreviado() {
    return `${this.nombre} tiene valor ${this.valor}`;
  },

  // ✅ Uso correcto de arrow function dentro de un método
  procesarDatos() {
    const datos = [1, 2, 3, 4, 5];

    // Arrow function aquí es apropiada porque hereda 'this' del método padre
    return datos.map(item => item * this.valor);
  },
};

console.log('Método tradicional:', objetoConMetodos.metodoTradicional());
console.log('Método flecha:', objetoConMetodos.metodoFlecha()); // undefined
console.log('Método abreviado:', objetoConMetodos.metodoAbreviado());
console.log('Procesar datos:', objetoConMetodos.procesarDatos());

// ================================================
// 4. CONTEXTO Y BINDING
// ================================================

console.log('\n4. Contexto y Binding');
console.log('---------------------');

const persona = {
  nombre: 'Carlos López',
  edad: 30,

  saludar() {
    return `Hola, soy ${this.nombre}`;
  },

  despedir() {
    return `Adiós, fue un placer. Soy ${this.nombre}`;
  },
};

// Uso normal - 'this' funciona correctamente
console.log('Saludo normal:', persona.saludar());

// Problema de contexto - 'this' se pierde
const saludarSeparado = persona.saludar;
console.log('Saludo separado:', saludarSeparado()); // undefined

// Solución 1: bind()
const saludarBindeado = persona.saludar.bind(persona);
console.log('Saludo bindeado:', saludarBindeado());

// Solución 2: call()
console.log('Saludo con call:', persona.saludar.call(persona));

// Solución 3: apply()
console.log('Saludo con apply:', persona.saludar.apply(persona));

// ================================================
// 5. MÉTODOS DINÁMICOS
// ================================================

console.log('\n5. Métodos Dinámicos');
console.log('--------------------');

const operacionesMatematicas = {
  // Método para agregar operaciones dinámicamente
  agregarOperacion(nombre, funcion) {
    this[nombre] = funcion;
  },

  // Método para listar operaciones disponibles
  listarOperaciones() {
    const operaciones = [];
    for (let propiedad in this) {
      if (
        typeof this[propiedad] === 'function' &&
        propiedad !== 'agregarOperacion' &&
        propiedad !== 'listarOperaciones'
      ) {
        operaciones.push(propiedad);
      }
    }
    return operaciones;
  },
};

// Agregar operaciones dinámicamente
operacionesMatematicas.agregarOperacion('potencia', function (base, exponente) {
  return Math.pow(base, exponente);
});

operacionesMatematicas.agregarOperacion('raizCuadrada', function (numero) {
  return Math.sqrt(numero);
});

operacionesMatematicas.agregarOperacion('factorial', function (n) {
  if (n === 0 || n === 1) return 1;
  return n * this.factorial(n - 1);
});

// Usar operaciones dinámicas
console.log(
  'Operaciones disponibles:',
  operacionesMatematicas.listarOperaciones()
);
console.log('Potencia 2^3:', operacionesMatematicas.potencia(2, 3));
console.log('Raíz cuadrada de 16:', operacionesMatematicas.raizCuadrada(16));
console.log('Factorial de 5:', operacionesMatematicas.factorial(5));

// ================================================
// 6. MÉTODOS ANIDADOS Y CONTEXTO
// ================================================

console.log('\n6. Métodos Anidados y Contexto');
console.log('------------------------------');

const empresa = {
  nombre: 'TechCorp',
  empleados: [
    { nombre: 'Ana', cargo: 'Desarrolladora', salario: 3500000 },
    { nombre: 'Carlos', cargo: 'Diseñador', salario: 3200000 },
    { nombre: 'María', cargo: 'Gerente', salario: 4500000 },
  ],

  // Método que usa función anidada
  calcularNomina() {
    let totalNomina = 0;
    const empresa = this; // Guardar referencia a 'this'

    this.empleados.forEach(function (empleado) {
      // Aquí 'this' sería undefined en modo estricto
      totalNomina += empleado.salario;
    });

    return {
      empresa: empresa.nombre,
      totalEmpleados: this.empleados.length,
      totalNomina: totalNomina,
    };
  },

  // Método usando arrow function (mantiene contexto)
  calcularNominaFlecha() {
    let totalNomina = 0;

    this.empleados.forEach(empleado => {
      // Arrow function mantiene 'this' del método padre
      totalNomina += empleado.salario;
    });

    return {
      empresa: this.nombre,
      totalEmpleados: this.empleados.length,
      totalNomina: totalNomina,
    };
  },

  // Método para encontrar empleado por cargo
  encontrarPorCargo(cargo) {
    return this.empleados.find(empleado => empleado.cargo === cargo);
  },

  // Método para obtener estadísticas
  obtenerEstadisticas() {
    const salarios = this.empleados.map(emp => emp.salario);
    const salarioMinimo = Math.min(...salarios);
    const salarioMaximo = Math.max(...salarios);
    const salarioPromedio =
      salarios.reduce((acc, sal) => acc + sal, 0) / salarios.length;

    return {
      totalEmpleados: this.empleados.length,
      salarioMinimo,
      salarioMaximo,
      salarioPromedio,
    };
  },
};

console.log('Nómina (función tradicional):', empresa.calcularNomina());
console.log('Nómina (arrow function):', empresa.calcularNominaFlecha());
console.log('Gerente:', empresa.encontrarPorCargo('Gerente'));
console.log('Estadísticas:', empresa.obtenerEstadisticas());

// ================================================
// 7. MÉTODOS GETTER Y SETTER
// ================================================

console.log('\n7. Métodos Getter y Setter');
console.log('--------------------------');

const producto = {
  _nombre: '',
  _precio: 0,
  _categoria: '',

  // Getter para nombre
  get nombre() {
    return this._nombre;
  },

  // Setter para nombre
  set nombre(valor) {
    if (typeof valor === 'string' && valor.length > 0) {
      this._nombre = valor;
    } else {
      console.log('Error: El nombre debe ser una cadena no vacía');
    }
  },

  // Getter para precio
  get precio() {
    return this._precio;
  },

  // Setter para precio
  set precio(valor) {
    if (typeof valor === 'number' && valor > 0) {
      this._precio = valor;
    } else {
      console.log('Error: El precio debe ser un número positivo');
    }
  },

  // Getter para precio formateado
  get precioFormateado() {
    return `$${this._precio.toLocaleString('es-CO')}`;
  },

  // Método para mostrar información completa
  mostrarInfo() {
    return {
      nombre: this.nombre,
      precio: this.precioFormateado,
      categoria: this._categoria,
    };
  },
};

// Usar getters y setters
producto.nombre = 'Laptop Gaming';
producto.precio = 2500000;
producto._categoria = 'Electrónicos';

console.log('Nombre:', producto.nombre);
console.log('Precio:', producto.precio);
console.log('Precio formateado:', producto.precioFormateado);
console.log('Información completa:', producto.mostrarInfo());

// Probar validaciones
producto.nombre = ''; // Error
producto.precio = -100; // Error

// ================================================
// 8. MÉTODOS DE CADENA (METHOD CHAINING)
// ================================================

console.log('\n8. Métodos de Cadena (Method Chaining)');
console.log('--------------------------------------');

const procesadorTexto = {
  texto: '',

  // Método para establecer texto
  establecerTexto(nuevoTexto) {
    this.texto = nuevoTexto;
    return this; // Retorna 'this' para permitir encadenamiento
  },

  // Método para convertir a mayúsculas
  aMayusculas() {
    this.texto = this.texto.toUpperCase();
    return this;
  },

  // Método para convertir a minúsculas
  aMinusculas() {
    this.texto = this.texto.toLowerCase();
    return this;
  },

  // Método para remover espacios
  removerEspacios() {
    this.texto = this.texto.replace(/\s+/g, '');
    return this;
  },

  // Método para agregar prefijo
  agregarPrefijo(prefijo) {
    this.texto = prefijo + this.texto;
    return this;
  },

  // Método para agregar sufijo
  agregarSufijo(sufijo) {
    this.texto = this.texto + sufijo;
    return this;
  },

  // Método para obtener resultado
  obtenerResultado() {
    return this.texto;
  },
};

// Usar encadenamiento de métodos
const resultado = procesadorTexto
  .establecerTexto('  Hola Mundo  ')
  .removerEspacios()
  .aMayusculas()
  .agregarPrefijo('>>> ')
  .agregarSufijo(' <<<')
  .obtenerResultado();

console.log('Resultado procesado:', resultado);

// ================================================
// 9. EJERCICIOS PRÁCTICOS
// ================================================

console.log('\n9. Ejercicios Prácticos');
console.log('-----------------------');

// Ejercicio A: Crear un objeto cuenta bancaria
const cuentaBancaria = {
  titular: 'Juan Pérez',
  numero: '123456789',
  saldo: 1000000,

  // Método para consultar saldo
  consultarSaldo() {
    return `Saldo actual: $${this.saldo.toLocaleString('es-CO')}`;
  },

  // Método para depositar
  depositar(cantidad) {
    if (cantidad > 0) {
      this.saldo += cantidad;
      return `Depósito exitoso. ${this.consultarSaldo()}`;
    } else {
      return 'Error: La cantidad debe ser positiva';
    }
  },

  // Método para retirar
  retirar(cantidad) {
    if (cantidad > 0 && cantidad <= this.saldo) {
      this.saldo -= cantidad;
      return `Retiro exitoso. ${this.consultarSaldo()}`;
    } else if (cantidad > this.saldo) {
      return 'Error: Saldo insuficiente';
    } else {
      return 'Error: La cantidad debe ser positiva';
    }
  },

  // Método para transferir
  transferir(cantidad, cuentaDestino) {
    if (cantidad > 0 && cantidad <= this.saldo) {
      this.saldo -= cantidad;
      cuentaDestino.saldo += cantidad;
      return `Transferencia exitosa. ${this.consultarSaldo()}`;
    } else {
      return 'Error: No se puede realizar la transferencia';
    }
  },
};

// Crear segunda cuenta para pruebas
const cuentaBancaria2 = {
  titular: 'María García',
  numero: '987654321',
  saldo: 500000,

  consultarSaldo() {
    return `Saldo actual: $${this.saldo.toLocaleString('es-CO')}`;
  },
};

// Copiar métodos a la segunda cuenta
cuentaBancaria2.depositar = cuentaBancaria.depositar;
cuentaBancaria2.retirar = cuentaBancaria.retirar;
cuentaBancaria2.transferir = cuentaBancaria.transferir;

// Probar operaciones
console.log('Cuenta 1 - Consultar:', cuentaBancaria.consultarSaldo());
console.log('Cuenta 1 - Depositar:', cuentaBancaria.depositar(200000));
console.log('Cuenta 1 - Retirar:', cuentaBancaria.retirar(50000));
console.log('Cuenta 2 - Saldo inicial:', cuentaBancaria2.consultarSaldo());
console.log(
  'Cuenta 1 - Transferir:',
  cuentaBancaria.transferir(100000, cuentaBancaria2)
);
console.log('Cuenta 2 - Saldo final:', cuentaBancaria2.consultarSaldo());

// ================================================
// 10. CASOS DE USO AVANZADOS
// ================================================

console.log('\n10. Casos de Uso Avanzados');
console.log('--------------------------');

// Sistema de gestión de tareas
const gestorTareas = {
  tareas: [],

  // Método para agregar tarea
  agregarTarea(descripcion, prioridad = 'media') {
    const nuevaTarea = {
      id: Date.now(),
      descripcion: descripcion,
      prioridad: prioridad,
      completada: false,
      fechaCreacion: new Date(),
    };

    this.tareas.push(nuevaTarea);
    return `Tarea agregada: ${descripcion}`;
  },

  // Método para completar tarea
  completarTarea(id) {
    const tarea = this.tareas.find(t => t.id === id);
    if (tarea) {
      tarea.completada = true;
      tarea.fechaCompletada = new Date();
      return `Tarea completada: ${tarea.descripcion}`;
    } else {
      return 'Error: Tarea no encontrada';
    }
  },

  // Método para filtrar tareas
  filtrarTareas(filtro) {
    switch (filtro) {
      case 'completadas':
        return this.tareas.filter(t => t.completada);
      case 'pendientes':
        return this.tareas.filter(t => !t.completada);
      case 'alta':
        return this.tareas.filter(t => t.prioridad === 'alta');
      default:
        return this.tareas;
    }
  },

  // Método para obtener estadísticas
  obtenerEstadisticas() {
    const total = this.tareas.length;
    const completadas = this.tareas.filter(t => t.completada).length;
    const pendientes = total - completadas;

    return {
      total,
      completadas,
      pendientes,
      porcentajeCompletado:
        total > 0 ? ((completadas / total) * 100).toFixed(1) : 0,
    };
  },
};

// Usar gestor de tareas
gestorTareas.agregarTarea('Estudiar JavaScript', 'alta');
gestorTareas.agregarTarea('Hacer ejercicios', 'media');
gestorTareas.agregarTarea('Revisar código', 'baja');

console.log(
  'Tarea agregada:',
  gestorTareas.agregarTarea('Documentar proyecto', 'alta')
);
console.log(
  'Completar tarea:',
  gestorTareas.completarTarea(gestorTareas.tareas[0].id)
);
console.log('Tareas pendientes:', gestorTareas.filtrarTareas('pendientes'));
console.log('Estadísticas:', gestorTareas.obtenerEstadisticas());

console.log('\n✅ Ejercicio 2 completado exitosamente!');
console.log('📚 Conceptos aprendidos:');
console.log('   - Definición de métodos en objetos');
console.log('   - Uso correcto de "this"');
console.log('   - Diferencias entre arrow functions y function expressions');
console.log('   - Contexto y binding');
console.log('   - Métodos dinámicos');
console.log('   - Getters y setters');
console.log('   - Method chaining');
console.log('   - Casos de uso prácticos');

// ================================================
// 🎯 DESAFÍO EXTRA
// ================================================

console.log('\n🎯 Desafío Extra');
console.log('================');

// Crear un objeto que simule un carrito de compras
const carritoCompras = {
  items: [],
  descuento: 0,

  // Método para agregar item
  agregarItem(producto, cantidad = 1) {
    const itemExistente = this.items.find(
      item => item.producto.id === producto.id
    );

    if (itemExistente) {
      itemExistente.cantidad += cantidad;
    } else {
      this.items.push({
        producto: producto,
        cantidad: cantidad,
      });
    }

    return this; // Para permitir encadenamiento
  },

  // Método para remover item
  removerItem(idProducto) {
    this.items = this.items.filter(item => item.producto.id !== idProducto);
    return this;
  },

  // Método para calcular subtotal
  calcularSubtotal() {
    return this.items.reduce((total, item) => {
      return total + item.producto.precio * item.cantidad;
    }, 0);
  },

  // Método para aplicar descuento
  aplicarDescuento(porcentaje) {
    this.descuento = porcentaje;
    return this;
  },

  // Método para calcular total
  calcularTotal() {
    const subtotal = this.calcularSubtotal();
    const descuentoAplicado = subtotal * (this.descuento / 100);
    return subtotal - descuentoAplicado;
  },

  // Método para mostrar resumen
  mostrarResumen() {
    return {
      items: this.items,
      subtotal: this.calcularSubtotal(),
      descuento: this.descuento,
      total: this.calcularTotal(),
    };
  },
};

// Productos de ejemplo
const productos = [
  { id: 1, nombre: 'Laptop', precio: 1200000 },
  { id: 2, nombre: 'Mouse', precio: 45000 },
  { id: 3, nombre: 'Teclado', precio: 120000 },
];

// Usar carrito con encadenamiento
carritoCompras
  .agregarItem(productos[0], 1)
  .agregarItem(productos[1], 2)
  .agregarItem(productos[2], 1)
  .aplicarDescuento(10);

console.log('Resumen del carrito:', carritoCompras.mostrarResumen());

console.log(
  '\n🎉 ¡Excelente trabajo! Has dominado los métodos de objetos en JavaScript.'
);
