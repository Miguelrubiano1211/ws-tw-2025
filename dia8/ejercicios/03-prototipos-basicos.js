/**
 * 📚 DÍA 8: JavaScript Avanzado II - Ejercicios de Prototipos Básicos
 *
 * Objetivos:
 * - Comprender el sistema de prototipos en JavaScript
 * - Trabajar con Object.create() y prototype
 * - Implementar métodos en prototipos
 * - Entender la cadena de prototipos
 */

console.log('🧬 === EJERCICIOS DE PROTOTIPOS BÁSICOS ===');

// =====================================================
// 1. CONCEPTO BÁSICO DE PROTOTIPOS
// =====================================================

console.log('\n1. 🎯 Concepto Básico de Prototipos');

// Función constructora tradicional
function Persona(nombre, edad) {
  this.nombre = nombre;
  this.edad = edad;
}

// Agregar método al prototipo
Persona.prototype.saludar = function () {
  return `Hola, soy ${this.nombre} y tengo ${this.edad} años`;
};

Persona.prototype.esAdulto = function () {
  return this.edad >= 18;
};

// Crear instancias
const persona1 = new Persona('Ana', 25);
const persona2 = new Persona('Luis', 16);

console.log(persona1.saludar());
console.log(`Ana es adulta: ${persona1.esAdulto()}`);
console.log(persona2.saludar());
console.log(`Luis es adulto: ${persona2.esAdulto()}`);

// Verificar prototipo
console.log(
  `¿persona1 es instancia de Persona? ${persona1 instanceof Persona}`
);
console.log(
  `¿persona1 tiene constructor Persona? ${persona1.constructor === Persona}`
);

// =====================================================
// 2. OBJECT.CREATE() Y HERENCIA BÁSICA
// =====================================================

console.log('\n2. 🏗️ Object.create() y Herencia Básica');

// Objeto base con Object.create()
const animal = {
  especie: 'Genérico',
  dormir: function () {
    return `${this.nombre} está durmiendo`;
  },
  comer: function () {
    return `${this.nombre} está comiendo`;
  },
};

// Crear objeto que hereda de animal
const perro = Object.create(animal);
perro.nombre = 'Max';
perro.especie = 'Canino';
perro.ladrar = function () {
  return `${this.nombre} está ladrando: ¡Guau!`;
};

console.log(perro.dormir());
console.log(perro.comer());
console.log(perro.ladrar());

// Verificar la cadena de prototipos
console.log(
  `¿perro tiene la propiedad 'dormir'? ${perro.hasOwnProperty('dormir')}`
);
console.log(`¿perro puede acceder a 'dormir'? ${'dormir' in perro}`);

// =====================================================
// 3. MODIFICACIÓN DINÁMICA DE PROTOTIPOS
// =====================================================

console.log('\n3. 🔄 Modificación Dinámica de Prototipos');

function Vehiculo(marca, modelo) {
  this.marca = marca;
  this.modelo = modelo;
}

Vehiculo.prototype.acelerar = function () {
  return `${this.marca} ${this.modelo} está acelerando`;
};

const auto1 = new Vehiculo('Toyota', 'Corolla');
const auto2 = new Vehiculo('Honda', 'Civic');

console.log(auto1.acelerar());

// Agregar método dinámicamente al prototipo
Vehiculo.prototype.frenar = function () {
  return `${this.marca} ${this.modelo} está frenando`;
};

// Ambas instancias ahora tienen el método
console.log(auto1.frenar());
console.log(auto2.frenar());

// =====================================================
// 4. CADENA DE PROTOTIPOS COMPLEJA
// =====================================================

console.log('\n4. 🔗 Cadena de Prototipos Compleja');

// Nivel 1: Ser vivo
function SerVivo(nombre) {
  this.nombre = nombre;
  this.vivo = true;
}

SerVivo.prototype.respirar = function () {
  return `${this.nombre} está respirando`;
};

// Nivel 2: Animal (hereda de SerVivo)
function Animal(nombre, especie) {
  SerVivo.call(this, nombre);
  this.especie = especie;
}

Animal.prototype = Object.create(SerVivo.prototype);
Animal.prototype.constructor = Animal;

Animal.prototype.moverse = function () {
  return `${this.nombre} se está moviendo`;
};

// Nivel 3: Mamífero (hereda de Animal)
function Mamifero(nombre, especie, pelaje) {
  Animal.call(this, nombre, especie);
  this.pelaje = pelaje;
}

Mamifero.prototype = Object.create(Animal.prototype);
Mamifero.prototype.constructor = Mamifero;

Mamifero.prototype.amamantar = function () {
  return `${this.nombre} está amamantando`;
};

// Crear instancia
const gato = new Mamifero('Miau', 'Felino', 'Suave');

console.log(gato.respirar()); // De SerVivo
console.log(gato.moverse()); // De Animal
console.log(gato.amamantar()); // De Mamifero

// Verificar cadena de prototipos
console.log(`¿gato es instancia de Mamifero? ${gato instanceof Mamifero}`);
console.log(`¿gato es instancia de Animal? ${gato instanceof Animal}`);
console.log(`¿gato es instancia de SerVivo? ${gato instanceof SerVivo}`);

// =====================================================
// 5. PROTOTYPE VS __PROTO__
// =====================================================

console.log('\n5. ⚡ Prototype vs __proto__');

function Producto(nombre, precio) {
  this.nombre = nombre;
  this.precio = precio;
}

Producto.prototype.mostrarInfo = function () {
  return `${this.nombre}: $${this.precio}`;
};

const laptop = new Producto('Laptop', 1200);

// Comparar prototype y __proto__
console.log(
  `Producto.prototype === laptop.__proto__: ${
    Producto.prototype === laptop.__proto__
  }`
);
console.log(
  `laptop.constructor === Producto: ${laptop.constructor === Producto}`
);

// Mostrar la cadena de prototipos
let proto = laptop.__proto__;
let nivel = 1;

while (proto) {
  console.log(`Nivel ${nivel}: ${proto.constructor.name}`);
  proto = proto.__proto__;
  nivel++;
}

// =====================================================
// 6. POLYFILLS Y EXTENSIÓN DE PROTOTIPOS NATIVOS
// =====================================================

console.log('\n6. 🛠️ Polyfills y Extensión de Prototipos');

// Polyfill para Array.prototype.includes (ejemplo educativo)
if (!Array.prototype.miIncludes) {
  Array.prototype.miIncludes = function (elementoBuscado) {
    for (let i = 0; i < this.length; i++) {
      if (this[i] === elementoBuscado) {
        return true;
      }
    }
    return false;
  };
}

const frutas = ['manzana', 'banana', 'naranja'];
console.log(`¿Incluye 'banana'? ${frutas.miIncludes('banana')}`);
console.log(`¿Incluye 'uva'? ${frutas.miIncludes('uva')}`);

// Extensión personalizada para String
String.prototype.toCamelCase = function () {
  return this.replace(/[-_\s]+(.)?/g, function (match, chr) {
    return chr ? chr.toUpperCase() : '';
  });
};

const texto = 'hola-mundo_hermoso';
console.log(`CamelCase: ${texto.toCamelCase()}`);

// =====================================================
// 7. MIXIN PATTERN CON PROTOTIPOS
// =====================================================

console.log('\n7. 🎨 Mixin Pattern con Prototipos');

// Mixin para funcionalidad de eventos
const EventMixin = {
  on: function (evento, callback) {
    this._eventos = this._eventos || {};
    this._eventos[evento] = this._eventos[evento] || [];
    this._eventos[evento].push(callback);
  },

  emit: function (evento, ...args) {
    if (this._eventos && this._eventos[evento]) {
      this._eventos[evento].forEach(callback => {
        callback.apply(this, args);
      });
    }
  },

  off: function (evento, callback) {
    if (this._eventos && this._eventos[evento]) {
      this._eventos[evento] = this._eventos[evento].filter(
        cb => cb !== callback
      );
    }
  },
};

// Función constructora
function Notificador(nombre) {
  this.nombre = nombre;
}

// Agregar mixin al prototipo
Object.assign(Notificador.prototype, EventMixin);

// Usar el mixin
const notificador = new Notificador('Sistema');

notificador.on('mensaje', function (texto) {
  console.log(`${this.nombre} recibió: ${texto}`);
});

notificador.emit('mensaje', 'Hola desde el sistema de eventos');

// =====================================================
// 8. EJERCICIO PRÁCTICO: SISTEMA DE FORMAS GEOMÉTRICAS
// =====================================================

console.log('\n8. 🎯 Ejercicio Práctico: Sistema de Formas Geométricas');

// Clase base
function Forma(color) {
  this.color = color;
}

Forma.prototype.describir = function () {
  return `Una forma de color ${this.color}`;
};

// Círculo
function Circulo(color, radio) {
  Forma.call(this, color);
  this.radio = radio;
}

Circulo.prototype = Object.create(Forma.prototype);
Circulo.prototype.constructor = Circulo;

Circulo.prototype.calcularArea = function () {
  return Math.PI * this.radio * this.radio;
};

Circulo.prototype.calcularPerimetro = function () {
  return 2 * Math.PI * this.radio;
};

// Rectángulo
function Rectangulo(color, ancho, alto) {
  Forma.call(this, color);
  this.ancho = ancho;
  this.alto = alto;
}

Rectangulo.prototype = Object.create(Forma.prototype);
Rectangulo.prototype.constructor = Rectangulo;

Rectangulo.prototype.calcularArea = function () {
  return this.ancho * this.alto;
};

Rectangulo.prototype.calcularPerimetro = function () {
  return 2 * (this.ancho + this.alto);
};

// Crear instancias
const circulo = new Circulo('rojo', 5);
const rectangulo = new Rectangulo('azul', 4, 6);

console.log(circulo.describir());
console.log(`Área del círculo: ${circulo.calcularArea().toFixed(2)}`);
console.log(`Perímetro del círculo: ${circulo.calcularPerimetro().toFixed(2)}`);

console.log(rectangulo.describir());
console.log(`Área del rectángulo: ${rectangulo.calcularArea()}`);
console.log(`Perímetro del rectángulo: ${rectangulo.calcularPerimetro()}`);

// =====================================================
// 9. VERIFICACIÓN DE PROTOTIPOS Y HERENCIA
// =====================================================

console.log('\n9. 🔍 Verificación de Prototipos y Herencia');

// Función para mostrar información detallada
function analizarObjeto(objeto, nombre) {
  console.log(`\n--- Análisis de ${nombre} ---`);
  console.log(`Constructor: ${objeto.constructor.name}`);
  console.log(`Prototipo: ${objeto.__proto__.constructor.name}`);

  // Mostrar propiedades propias
  console.log('Propiedades propias:');
  for (let prop in objeto) {
    if (objeto.hasOwnProperty(prop)) {
      console.log(`  ${prop}: ${objeto[prop]}`);
    }
  }

  // Mostrar métodos disponibles
  console.log('Métodos disponibles:');
  let proto = objeto.__proto__;
  while (proto && proto !== Object.prototype) {
    Object.getOwnPropertyNames(proto).forEach(prop => {
      if (typeof proto[prop] === 'function' && prop !== 'constructor') {
        console.log(`  ${prop} (desde ${proto.constructor.name})`);
      }
    });
    proto = proto.__proto__;
  }
}

analizarObjeto(circulo, 'círculo');
analizarObjeto(rectangulo, 'rectángulo');

console.log('\n✅ Ejercicios de Prototipos Básicos completados!');
console.log('💡 Conceptos practicados:');
console.log('   - Sistema de prototipos');
console.log('   - Object.create()');
console.log('   - Herencia prototípica');
console.log('   - Cadena de prototipos');
console.log('   - Mixin pattern');
console.log('   - Polyfills');
