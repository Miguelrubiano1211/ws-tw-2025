/**
 * 📚 DÍA 8: JavaScript Avanzado II - Ejercicios de Herencia Prototípica
 *
 * Objetivos:
 * - Dominar patrones de herencia en JavaScript
 * - Implementar herencia múltiple y mixins
 * - Comprender super() y llamadas a métodos padre
 * - Trabajar con composition over inheritance
 */

console.log('🧬 === EJERCICIOS DE HERENCIA PROTOTÍPICA ===');

// =====================================================
// 1. HERENCIA CLÁSICA CON PROTOTYPE
// =====================================================

console.log('\n1. 🏗️ Herencia Clásica con Prototype');

// Clase padre
function Empleado(nombre, salario) {
  this.nombre = nombre;
  this.salario = salario;
}

Empleado.prototype.trabajar = function () {
  return `${this.nombre} está trabajando`;
};

Empleado.prototype.obtenerSalario = function () {
  return `${this.nombre} gana $${this.salario}`;
};

// Clase hija - Desarrollador
function Desarrollador(nombre, salario, lenguaje) {
  Empleado.call(this, nombre, salario); // Llamar al constructor padre
  this.lenguaje = lenguaje;
}

// Establecer herencia
Desarrollador.prototype = Object.create(Empleado.prototype);
Desarrollador.prototype.constructor = Desarrollador;

// Métodos específicos del desarrollador
Desarrollador.prototype.programar = function () {
  return `${this.nombre} está programando en ${this.lenguaje}`;
};

Desarrollador.prototype.trabajar = function () {
  return `${this.nombre} está desarrollando software`;
};

// Clase hija - Diseñador
function Diseñador(nombre, salario, herramienta) {
  Empleado.call(this, nombre, salario);
  this.herramienta = herramienta;
}

Diseñador.prototype = Object.create(Empleado.prototype);
Diseñador.prototype.constructor = Diseñador;

Diseñador.prototype.diseñar = function () {
  return `${this.nombre} está diseñando con ${this.herramienta}`;
};

Diseñador.prototype.trabajar = function () {
  return `${this.nombre} está creando diseños`;
};

// Crear instancias
const dev = new Desarrollador('Carlos', 3000, 'JavaScript');
const diseñador = new Diseñador('María', 2500, 'Figma');

console.log(dev.trabajar());
console.log(dev.programar());
console.log(dev.obtenerSalario());

console.log(diseñador.trabajar());
console.log(diseñador.diseñar());
console.log(diseñador.obtenerSalario());

// =====================================================
// 2. HERENCIA CON MÉTODO SUPER SIMULADO
// =====================================================

console.log('\n2. 🔄 Herencia con Método Super Simulado');

function Animal(nombre) {
  this.nombre = nombre;
}

Animal.prototype.hacerSonido = function () {
  return `${this.nombre} hace un sonido`;
};

Animal.prototype.dormir = function () {
  return `${this.nombre} está durmiendo`;
};

function Gato(nombre, raza) {
  Animal.call(this, nombre);
  this.raza = raza;
}

Gato.prototype = Object.create(Animal.prototype);
Gato.prototype.constructor = Gato;

// Sobrescribir método con acceso al método padre
Gato.prototype.hacerSonido = function () {
  const sonidoBase = Animal.prototype.hacerSonido.call(this);
  return `${sonidoBase} - específicamente miau`;
};

Gato.prototype.dormir = function () {
  const dormirBase = Animal.prototype.dormir.call(this);
  return `${dormirBase} en una caja`;
};

Gato.prototype.ronronear = function () {
  return `${this.nombre} está ronroneando`;
};

const gato = new Gato('Whiskers', 'Siamés');
console.log(gato.hacerSonido());
console.log(gato.dormir());
console.log(gato.ronronear());

// =====================================================
// 3. HERENCIA MÚLTIPLE CON MIXINS
// =====================================================

console.log('\n3. 🎨 Herencia Múltiple con Mixins');

// Mixin para funcionalidad de vuelo
const VoladorMixin = {
  volar: function () {
    return `${this.nombre} está volando`;
  },
  aterrizar: function () {
    return `${this.nombre} ha aterrizado`;
  },
};

// Mixin para funcionalidad de natación
const NadadorMixin = {
  nadar: function () {
    return `${this.nombre} está nadando`;
  },
  sumergirse: function () {
    return `${this.nombre} se ha sumergido`;
  },
};

// Mixin para funcionalidad de caminar
const CaminadorMixin = {
  caminar: function () {
    return `${this.nombre} está caminando`;
  },
  correr: function () {
    return `${this.nombre} está corriendo`;
  },
};

// Función auxiliar para aplicar mixins
function aplicarMixins(constructor, ...mixins) {
  mixins.forEach(mixin => {
    Object.assign(constructor.prototype, mixin);
  });
}

// Ave (puede volar y caminar)
function Ave(nombre, envergadura) {
  this.nombre = nombre;
  this.envergadura = envergadura;
}

aplicarMixins(Ave, VoladorMixin, CaminadorMixin);

// Pez (puede nadar)
function Pez(nombre, profundidad) {
  this.nombre = nombre;
  this.profundidadMaxima = profundidad;
}

aplicarMixins(Pez, NadadorMixin);

// Pato (puede volar, nadar y caminar)
function Pato(nombre) {
  this.nombre = nombre;
}

aplicarMixins(Pato, VoladorMixin, NadadorMixin, CaminadorMixin);

// Crear instancias
const aguila = new Ave('Águila', 2.5);
const salmon = new Pez('Salmón', 200);
const pato = new Pato('Donald');

console.log(aguila.volar());
console.log(aguila.caminar());

console.log(salmon.nadar());
console.log(salmon.sumergirse());

console.log(pato.volar());
console.log(pato.nadar());
console.log(pato.caminar());

// =====================================================
// 4. COMPOSITION OVER INHERITANCE
// =====================================================

console.log('\n4. 🧱 Composition Over Inheritance');

// Comportamientos como objetos
function crearComportamientoMovimiento() {
  return {
    mover: function (direccion) {
      return `${this.nombre} se mueve hacia ${direccion}`;
    },
    parar: function () {
      return `${this.nombre} se ha detenido`;
    },
  };
}

function crearComportamientoSonido() {
  return {
    hacerRuido: function (sonido) {
      return `${this.nombre} hace: ${sonido}`;
    },
    silencio: function () {
      return `${this.nombre} está en silencio`;
    },
  };
}

function crearComportamientoAlimentacion() {
  return {
    comer: function (comida) {
      return `${this.nombre} está comiendo ${comida}`;
    },
    beber: function (liquido) {
      return `${this.nombre} está bebiendo ${liquido}`;
    },
  };
}

// Factory function usando composition
function crearAnimal(nombre, comportamientos = []) {
  const animal = {
    nombre: nombre,
  };

  // Componer comportamientos
  comportamientos.forEach(comportamiento => {
    Object.assign(animal, comportamiento);
  });

  return animal;
}

// Crear diferentes tipos de animales
const perro = crearAnimal('Rex', [
  crearComportamientoMovimiento(),
  crearComportamientoSonido(),
  crearComportamientoAlimentacion(),
]);

const robot = crearAnimal('R2D2', [
  crearComportamientoMovimiento(),
  crearComportamientoSonido(),
]);

console.log(perro.mover('el parque'));
console.log(perro.hacerRuido('guau'));
console.log(perro.comer('croquetas'));

console.log(robot.mover('la nave'));
console.log(robot.hacerRuido('beep beep'));
// robot.comer no existe, evitamos el error

// =====================================================
// 5. FACTORY PATTERN CON HERENCIA
// =====================================================

console.log('\n5. 🏭 Factory Pattern con Herencia');

// Factory para crear diferentes tipos de vehículos
function VehiculoFactory() {
  this.crearVehiculo = function (tipo, propiedades) {
    switch (tipo) {
      case 'auto':
        return new Auto(propiedades);
      case 'moto':
        return new Moto(propiedades);
      case 'camion':
        return new Camion(propiedades);
      default:
        throw new Error('Tipo de vehículo no válido');
    }
  };
}

// Clase base
function Vehiculo(propiedades) {
  this.marca = propiedades.marca;
  this.modelo = propiedades.modelo;
  this.año = propiedades.año;
}

Vehiculo.prototype.arrancar = function () {
  return `${this.marca} ${this.modelo} está arrancando`;
};

Vehiculo.prototype.acelerar = function () {
  return `${this.marca} ${this.modelo} está acelerando`;
};

// Clases derivadas
function Auto(propiedades) {
  Vehiculo.call(this, propiedades);
  this.puertas = propiedades.puertas || 4;
}

Auto.prototype = Object.create(Vehiculo.prototype);
Auto.prototype.constructor = Auto;

Auto.prototype.abrirPuertas = function () {
  return `Abriendo ${this.puertas} puertas del auto`;
};

function Moto(propiedades) {
  Vehiculo.call(this, propiedades);
  this.cilindrada = propiedades.cilindrada || 250;
}

Moto.prototype = Object.create(Vehiculo.prototype);
Moto.prototype.constructor = Moto;

Moto.prototype.hacerWhelie = function () {
  return `La moto ${this.marca} está haciendo wheelie`;
};

function Camion(propiedades) {
  Vehiculo.call(this, propiedades);
  this.capacidad = propiedades.capacidad || 1000;
}

Camion.prototype = Object.create(Vehiculo.prototype);
Camion.prototype.constructor = Camion;

Camion.prototype.cargar = function () {
  return `Cargando ${this.capacidad}kg en el camión`;
};

// Usar el factory
const factory = new VehiculoFactory();

const auto = factory.crearVehiculo('auto', {
  marca: 'Toyota',
  modelo: 'Corolla',
  año: 2023,
  puertas: 4,
});

const moto = factory.crearVehiculo('moto', {
  marca: 'Yamaha',
  modelo: 'YZF',
  año: 2022,
  cilindrada: 600,
});

console.log(auto.arrancar());
console.log(auto.abrirPuertas());

console.log(moto.acelerar());
console.log(moto.hacerWhelie());

// =====================================================
// 6. POLIMORFISMO Y DUCK TYPING
// =====================================================

console.log('\n6. 🦆 Polimorfismo y Duck Typing');

// Diferentes objetos con la misma interfaz
function crearReproductor(tipo) {
  const reproductores = {
    audio: {
      reproducir: function () {
        return 'Reproduciendo audio...';
      },
      pausar: function () {
        return 'Audio pausado';
      },
    },
    video: {
      reproducir: function () {
        return 'Reproduciendo video con audio...';
      },
      pausar: function () {
        return 'Video pausado';
      },
    },
    streaming: {
      reproducir: function () {
        return 'Transmitiendo en vivo...';
      },
      pausar: function () {
        return 'Transmisión pausada';
      },
    },
  };

  return reproductores[tipo];
}

// Función que trabaja con cualquier objeto que tenga los métodos necesarios
function controlarReproductor(reproductor) {
  console.log(reproductor.reproducir());
  console.log(reproductor.pausar());
}

// Duck typing: si camina como pato y grazna como pato, es un pato
const reproductorAudio = crearReproductor('audio');
const reproductorVideo = crearReproductor('video');
const reproductorStreaming = crearReproductor('streaming');

controlarReproductor(reproductorAudio);
controlarReproductor(reproductorVideo);
controlarReproductor(reproductorStreaming);

// =====================================================
// 7. MÉTODO INSTANCEOF PERSONALIZADO
// =====================================================

console.log('\n7. 🔍 Método instanceof Personalizado');

// Función para verificar herencia personalizada
function esInstanciaDe(objeto, constructor) {
  let proto = objeto.__proto__;

  while (proto !== null) {
    if (proto === constructor.prototype) {
      return true;
    }
    proto = proto.__proto__;
  }

  return false;
}

// Probar con nuestros objetos anteriores
console.log(
  `¿dev es instancia de Desarrollador? ${esInstanciaDe(dev, Desarrollador)}`
);
console.log(`¿dev es instancia de Empleado? ${esInstanciaDe(dev, Empleado)}`);
console.log(`¿dev es instancia de Diseñador? ${esInstanciaDe(dev, Diseñador)}`);

// =====================================================
// 8. EJERCICIO PRÁCTICO: SISTEMA DE VIDEOJUEGOS
// =====================================================

console.log('\n8. 🎮 Ejercicio Práctico: Sistema de Videojuegos');

// Clase base para personajes
function Personaje(nombre, vida, ataque) {
  this.nombre = nombre;
  this.vida = vida;
  this.ataqueBase = ataque;
}

Personaje.prototype.atacar = function (objetivo) {
  const daño = this.ataqueBase;
  objetivo.recibirDaño(daño);
  return `${this.nombre} ataca a ${objetivo.nombre} causando ${daño} de daño`;
};

Personaje.prototype.recibirDaño = function (daño) {
  this.vida -= daño;
  if (this.vida <= 0) {
    this.vida = 0;
    return `${this.nombre} ha sido derrotado`;
  }
  return `${this.nombre} tiene ${this.vida} de vida restante`;
};

// Guerrero
function Guerrero(nombre, vida, ataque, armadura) {
  Personaje.call(this, nombre, vida, ataque);
  this.armadura = armadura;
}

Guerrero.prototype = Object.create(Personaje.prototype);
Guerrero.prototype.constructor = Guerrero;

Guerrero.prototype.recibirDaño = function (daño) {
  const dañoReducido = Math.max(1, daño - this.armadura);
  this.vida -= dañoReducido;
  if (this.vida <= 0) {
    this.vida = 0;
    return `${this.nombre} ha sido derrotado`;
  }
  return `${this.nombre} bloquea ${this.armadura} daño, recibe ${dañoReducido}. Vida: ${this.vida}`;
};

Guerrero.prototype.ataqueEspecial = function (objetivo) {
  const daño = this.ataqueBase * 2;
  objetivo.recibirDaño(daño);
  return `${this.nombre} usa GOLPE DEVASTADOR en ${objetivo.nombre} causando ${daño} de daño`;
};

// Mago
function Mago(nombre, vida, ataque, mana) {
  Personaje.call(this, nombre, vida, ataque);
  this.mana = mana;
}

Mago.prototype = Object.create(Personaje.prototype);
Mago.prototype.constructor = Mago;

Mago.prototype.hechizo = function (objetivo) {
  if (this.mana >= 20) {
    this.mana -= 20;
    const daño = this.ataqueBase * 1.5;
    objetivo.recibirDaño(daño);
    return `${this.nombre} lanza BOLA DE FUEGO en ${objetivo.nombre} causando ${daño} de daño. Mana: ${this.mana}`;
  }
  return `${this.nombre} no tiene suficiente mana`;
};

// Crear personajes
const guerrero = new Guerrero('Arthas', 100, 25, 5);
const mago = new Mago('Gandalf', 80, 20, 100);

console.log(guerrero.atacar(mago));
console.log(mago.hechizo(guerrero));
console.log(guerrero.ataqueEspecial(mago));

// =====================================================
// 9. ANÁLISIS DE HERENCIA Y PERFORMANCE
// =====================================================

console.log('\n9. 📊 Análisis de Herencia y Performance');

// Función para medir tiempo de ejecución
function medirTiempo(fn, nombre) {
  const inicio = performance.now();
  fn();
  const fin = performance.now();
  console.log(`${nombre}: ${(fin - inicio).toFixed(4)}ms`);
}

// Comparar acceso a métodos en diferentes niveles de herencia
function Nivel1() {}
Nivel1.prototype.metodo = function () {
  return 'nivel1';
};

function Nivel2() {}
Nivel2.prototype = Object.create(Nivel1.prototype);
Nivel2.prototype.constructor = Nivel2;

function Nivel3() {}
Nivel3.prototype = Object.create(Nivel2.prototype);
Nivel3.prototype.constructor = Nivel3;

function Nivel4() {}
Nivel4.prototype = Object.create(Nivel3.prototype);
Nivel4.prototype.constructor = Nivel4;

const obj1 = new Nivel1();
const obj4 = new Nivel4();

medirTiempo(() => {
  for (let i = 0; i < 1000000; i++) {
    obj1.metodo();
  }
}, 'Acceso directo');

medirTiempo(() => {
  for (let i = 0; i < 1000000; i++) {
    obj4.metodo();
  }
}, 'Acceso con herencia profunda');

console.log('\n✅ Ejercicios de Herencia Prototípica completados!');
console.log('💡 Conceptos practicados:');
console.log('   - Herencia clásica con prototype');
console.log('   - Método super simulado');
console.log('   - Herencia múltiple con mixins');
console.log('   - Composition over inheritance');
console.log('   - Factory pattern con herencia');
console.log('   - Polimorfismo y duck typing');
console.log('   - Análisis de performance');
