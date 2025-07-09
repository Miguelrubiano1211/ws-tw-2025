# 🧬 Guía Completa de Prototipos en JavaScript

## 📋 Índice

1. [Conceptos Fundamentales](#conceptos-fundamentales)
2. [Sistema de Prototipos](#sistema-de-prototipos)
3. [Prototype vs **proto**](#prototype-vs-proto)
4. [Herencia Prototípica](#herencia-prototípica)
5. [Object.create()](#objectcreate)
6. [Métodos y Propiedades](#métodos-y-propiedades)
7. [Patrones Avanzados](#patrones-avanzados)
8. [Optimización y Rendimiento](#optimización-y-rendimiento)

## 📖 Conceptos Fundamentales

### ¿Qué es un Prototipo?

En JavaScript, cada objeto tiene un **prototipo** que es otro objeto del cual hereda métodos y propiedades. El sistema de prototipos es la base de la herencia en JavaScript.

```javascript
// Función constructora
function Persona(nombre, edad) {
  this.nombre = nombre;
  this.edad = edad;
}

// Agregar método al prototipo
Persona.prototype.saludar = function () {
  return `Hola, soy ${this.nombre}`;
};

// Crear instancia
const persona1 = new Persona('Ana', 25);
console.log(persona1.saludar()); // "Hola, soy Ana"

// Verificar la cadena de prototipos
console.log(persona1.__proto__ === Persona.prototype); // true
console.log(Persona.prototype.__proto__ === Object.prototype); // true
```

### Cadena de Prototipos

```javascript
// Crear objeto simple
const obj = {};

// Verificar la cadena de prototipos
console.log(obj.__proto__ === Object.prototype); // true
console.log(Object.prototype.__proto__ === null); // true

// Visualizar la cadena completa
function mostrarCadenaPrototipos(obj) {
  let actual = obj;
  let nivel = 0;

  while (actual) {
    console.log(`Nivel ${nivel}:`, actual.constructor.name);
    actual = actual.__proto__;
    nivel++;
  }
}

mostrarCadenaPrototipos(persona1);
// Nivel 0: Persona
// Nivel 1: Object
```

## 🔗 Sistema de Prototipos

### Prototype Property

```javascript
function Vehiculo(marca, modelo) {
  this.marca = marca;
  this.modelo = modelo;
}

// Agregar métodos al prototipo
Vehiculo.prototype.acelerar = function () {
  return `${this.marca} ${this.modelo} está acelerando`;
};

Vehiculo.prototype.frenar = function () {
  return `${this.marca} ${this.modelo} está frenando`;
};

// Propiedad compartida
Vehiculo.prototype.tipo = 'Terrestre';

// Crear instancias
const auto1 = new Vehiculo('Toyota', 'Corolla');
const auto2 = new Vehiculo('Honda', 'Civic');

console.log(auto1.acelerar()); // "Toyota Corolla está acelerando"
console.log(auto2.tipo); // "Terrestre"

// Modificar prototipo afecta a todas las instancias
Vehiculo.prototype.tipo = 'Automóvil';
console.log(auto1.tipo); // "Automóvil"
console.log(auto2.tipo); // "Automóvil"
```

### Constructor Property

```javascript
function Animal(especie) {
  this.especie = especie;
}

const gato = new Animal('Felino');

// Verificar constructor
console.log(gato.constructor === Animal); // true
console.log(gato.constructor.name); // "Animal"

// Crear nuevo objeto usando constructor
const perro = new gato.constructor('Canino');
console.log(perro.especie); // "Canino"
```

## ⚡ Prototype vs **proto**

### Diferencias Clave

```javascript
function Producto(nombre, precio) {
  this.nombre = nombre;
  this.precio = precio;
}

Producto.prototype.obtenerInfo = function () {
  return `${this.nombre}: $${this.precio}`;
};

const laptop = new Producto('Laptop', 1200);

// prototype vs __proto__
console.log(Producto.prototype); // Objeto con métodos
console.log(laptop.__proto__); // Referencia al prototipo

// Son el mismo objeto
console.log(Producto.prototype === laptop.__proto__); // true

// hasOwnProperty vs in
console.log(laptop.hasOwnProperty('nombre')); // true (propiedad propia)
console.log(laptop.hasOwnProperty('obtenerInfo')); // false (del prototipo)
console.log('obtenerInfo' in laptop); // true (accesible)
```

### Modificación de Prototipos

```javascript
// Agregar método después de crear instancias
function Empleado(nombre, salario) {
  this.nombre = nombre;
  this.salario = salario;
}

const emp1 = new Empleado('Juan', 3000);
const emp2 = new Empleado('María', 3500);

// Agregar método dinámicamente
Empleado.prototype.obtenerSalarioAnual = function () {
  return this.salario * 12;
};

// Ambas instancias tienen el nuevo método
console.log(emp1.obtenerSalarioAnual()); // 36000
console.log(emp2.obtenerSalarioAnual()); // 42000
```

## 🏗️ Herencia Prototípica

### Herencia Básica

```javascript
// Clase padre
function Animal(nombre) {
  this.nombre = nombre;
}

Animal.prototype.respirar = function () {
  return `${this.nombre} está respirando`;
};

Animal.prototype.dormir = function () {
  return `${this.nombre} está durmiendo`;
};

// Clase hija
function Perro(nombre, raza) {
  Animal.call(this, nombre); // Llamar constructor padre
  this.raza = raza;
}

// Establecer herencia
Perro.prototype = Object.create(Animal.prototype);
Perro.prototype.constructor = Perro;

// Métodos específicos de Perro
Perro.prototype.ladrar = function () {
  return `${this.nombre} está ladrando`;
};

// Sobrescribir método padre
Perro.prototype.dormir = function () {
  return `${this.nombre} está durmiendo en su cama`;
};

const miPerro = new Perro('Max', 'Labrador');
console.log(miPerro.respirar()); // "Max está respirando" (heredado)
console.log(miPerro.ladrar()); // "Max está ladrando" (propio)
console.log(miPerro.dormir()); // "Max está durmiendo en su cama" (sobrescrito)
```

### Herencia Multinivel

```javascript
// Nivel 1: Ser vivo
function SerVivo(nombre) {
  this.nombre = nombre;
  this.vivo = true;
}

SerVivo.prototype.existe = function () {
  return `${this.nombre} existe`;
};

// Nivel 2: Animal
function Animal(nombre, especie) {
  SerVivo.call(this, nombre);
  this.especie = especie;
}

Animal.prototype = Object.create(SerVivo.prototype);
Animal.prototype.constructor = Animal;

Animal.prototype.moverse = function () {
  return `${this.nombre} se está moviendo`;
};

// Nivel 3: Mamífero
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
const leon = new Mamifero('León', 'Felino', 'Melena');

console.log(leon.existe()); // De SerVivo
console.log(leon.moverse()); // De Animal
console.log(leon.amamantar()); // De Mamifero

// Verificar instanceof
console.log(leon instanceof Mamifero); // true
console.log(leon instanceof Animal); // true
console.log(leon instanceof SerVivo); // true
```

## 🎯 Object.create()

### Uso Básico

```javascript
// Crear objeto prototipo
const vehiculoProto = {
  acelerar: function () {
    return `${this.marca} está acelerando`;
  },
  frenar: function () {
    return `${this.marca} está frenando`;
  },
  obtenerInfo: function () {
    return `${this.marca} ${this.modelo} (${this.año})`;
  },
};

// Crear objeto que hereda del prototipo
const auto = Object.create(vehiculoProto);
auto.marca = 'Toyota';
auto.modelo = 'Corolla';
auto.año = 2023;

console.log(auto.acelerar()); // "Toyota está acelerando"
console.log(auto.obtenerInfo()); // "Toyota Corolla (2023)"
```

### Object.create() con Propiedades

```javascript
const personaProto = {
  saludar: function () {
    return `Hola, soy ${this.nombre}`;
  },
  cumplirAños: function () {
    this.edad++;
    return `Ahora tengo ${this.edad} años`;
  },
};

// Crear objeto con propiedades específicas
const estudiante = Object.create(personaProto, {
  nombre: {
    value: 'Ana',
    writable: true,
    enumerable: true,
    configurable: true,
  },
  edad: {
    value: 20,
    writable: true,
    enumerable: true,
    configurable: true,
  },
  carrera: {
    value: 'Ingeniería',
    writable: true,
    enumerable: true,
    configurable: true,
  },
});

console.log(estudiante.saludar()); // "Hola, soy Ana"
console.log(estudiante.cumplirAños()); // "Ahora tengo 21 años"
```

### Herencia con Object.create()

```javascript
// Objeto base
const formaGeometrica = {
  calcularArea: function () {
    throw new Error('Método debe ser implementado');
  },
  obtenerInfo: function () {
    return `Forma: ${this.tipo}, Color: ${this.color}`;
  },
};

// Crear círculo
const circulo = Object.create(formaGeometrica);
circulo.tipo = 'Círculo';
circulo.color = 'Rojo';
circulo.radio = 5;

circulo.calcularArea = function () {
  return Math.PI * this.radio * this.radio;
};

// Crear rectángulo
const rectangulo = Object.create(formaGeometrica);
rectangulo.tipo = 'Rectángulo';
rectangulo.color = 'Azul';
rectangulo.ancho = 10;
rectangulo.alto = 8;

rectangulo.calcularArea = function () {
  return this.ancho * this.alto;
};

console.log(circulo.obtenerInfo()); // "Forma: Círculo, Color: Rojo"
console.log(circulo.calcularArea()); // 78.54
console.log(rectangulo.calcularArea()); // 80
```

## 🔧 Métodos y Propiedades

### Métodos de Instancia vs Prototipo

```javascript
function Calculadora(nombre) {
  this.nombre = nombre;
  this.historial = [];

  // Método de instancia (cada objeto tiene su copia)
  this.agregarAlHistorial = function (operacion, resultado) {
    this.historial.push({ operacion, resultado, fecha: new Date() });
  };
}

// Método de prototipo (compartido por todas las instancias)
Calculadora.prototype.sumar = function (a, b) {
  const resultado = a + b;
  this.agregarAlHistorial(`${a} + ${b}`, resultado);
  return resultado;
};

Calculadora.prototype.restar = function (a, b) {
  const resultado = a - b;
  this.agregarAlHistorial(`${a} - ${b}`, resultado);
  return resultado;
};

Calculadora.prototype.obtenerHistorial = function () {
  return this.historial;
};

const calc1 = new Calculadora('Calc1');
const calc2 = new Calculadora('Calc2');

calc1.sumar(5, 3);
calc2.restar(10, 4);

console.log(calc1.obtenerHistorial()); // [{ operacion: "5 + 3", resultado: 8, fecha: ... }]
console.log(calc2.obtenerHistorial()); // [{ operacion: "10 - 4", resultado: 6, fecha: ... }]
```

### Propiedades Virtuales

```javascript
function Persona(nombre, apellido) {
  this.nombre = nombre;
  this.apellido = apellido;
}

// Propiedad virtual usando getter
Object.defineProperty(Persona.prototype, 'nombreCompleto', {
  get: function () {
    return `${this.nombre} ${this.apellido}`;
  },
  set: function (valor) {
    const partes = valor.split(' ');
    this.nombre = partes[0];
    this.apellido = partes[1] || '';
  },
  enumerable: true,
  configurable: true,
});

const persona = new Persona('Juan', 'Pérez');
console.log(persona.nombreCompleto); // "Juan Pérez"

persona.nombreCompleto = 'María González';
console.log(persona.nombre); // "María"
console.log(persona.apellido); // "González"
```

## 🎨 Patrones Avanzados

### Mixin Pattern

```javascript
// Mixin para funcionalidad de eventos
const EventosMixin = {
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

// Mixin para validación
const ValidacionMixin = {
  validar: function (reglas) {
    const errores = [];

    for (const [campo, validaciones] of Object.entries(reglas)) {
      const valor = this[campo];

      if (validaciones.requerido && !valor) {
        errores.push(`${campo} es requerido`);
      }

      if (validaciones.minLength && valor.length < validaciones.minLength) {
        errores.push(
          `${campo} debe tener al menos ${validaciones.minLength} caracteres`
        );
      }

      if (validaciones.patron && !validaciones.patron.test(valor)) {
        errores.push(`${campo} no tiene el formato correcto`);
      }
    }

    return errores;
  },
};

// Aplicar mixins a un constructor
function Usuario(nombre, email) {
  this.nombre = nombre;
  this.email = email;
}

// Agregar mixins al prototipo
Object.assign(Usuario.prototype, EventosMixin, ValidacionMixin);

// Método específico de Usuario
Usuario.prototype.actualizar = function (nuevosDatos) {
  const errores = this.validar({
    nombre: { requerido: true, minLength: 2 },
    email: { requerido: true, patron: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  });

  if (errores.length > 0) {
    this.emit('error', errores);
    return false;
  }

  Object.assign(this, nuevosDatos);
  this.emit('actualizado', this);
  return true;
};

// Usar el objeto con mixins
const usuario = new Usuario('Juan', 'juan@test.com');

usuario.on('actualizado', usuario => {
  console.log('Usuario actualizado:', usuario.nombre);
});

usuario.on('error', errores => {
  console.log('Errores de validación:', errores);
});

usuario.actualizar({ nombre: 'Juan Carlos', email: 'juan.carlos@test.com' });
```

### Factory Pattern con Prototipos

```javascript
function FactoryFormas() {
  // Prototipos para diferentes formas
  const prototipos = {
    circulo: {
      tipo: 'Círculo',
      calcularArea: function () {
        return Math.PI * this.radio * this.radio;
      },
      calcularPerimetro: function () {
        return 2 * Math.PI * this.radio;
      },
    },

    rectangulo: {
      tipo: 'Rectángulo',
      calcularArea: function () {
        return this.ancho * this.alto;
      },
      calcularPerimetro: function () {
        return 2 * (this.ancho + this.alto);
      },
    },

    triangulo: {
      tipo: 'Triángulo',
      calcularArea: function () {
        return (this.base * this.altura) / 2;
      },
      calcularPerimetro: function () {
        return this.lado1 + this.lado2 + this.lado3;
      },
    },
  };

  return {
    crear: function (tipo, propiedades) {
      const prototipo = prototipos[tipo];
      if (!prototipo) {
        throw new Error(`Tipo de forma no válido: ${tipo}`);
      }

      const forma = Object.create(prototipo);
      Object.assign(forma, propiedades);

      // Método común para todas las formas
      forma.obtenerInfo = function () {
        return `${this.tipo} - Área: ${this.calcularArea().toFixed(2)}`;
      };

      return forma;
    },
  };
}

// Usar el factory
const factory = new FactoryFormas();

const circulo = factory.crear('circulo', { radio: 5 });
const rectangulo = factory.crear('rectangulo', { ancho: 8, alto: 6 });
const triangulo = factory.crear('triangulo', {
  base: 10,
  altura: 8,
  lado1: 10,
  lado2: 8,
  lado3: 6,
});

console.log(circulo.obtenerInfo()); // "Círculo - Área: 78.54"
console.log(rectangulo.obtenerInfo()); // "Rectángulo - Área: 48.00"
console.log(triangulo.obtenerInfo()); // "Triángulo - Área: 40.00"
```

## 🚀 Optimización y Rendimiento

### Lazy Loading de Métodos

```javascript
function ComponenteUI() {
  this.elemento = document.createElement('div');
  this.inicializado = false;
}

ComponenteUI.prototype.inicializar = function () {
  if (this.inicializado) return;

  // Cargar métodos pesados solo cuando se necesiten
  this.animarEntrada = function () {
    console.log('Animando entrada...');
    // Lógica de animación compleja
  };

  this.animarSalida = function () {
    console.log('Animando salida...');
    // Lógica de animación compleja
  };

  this.inicializado = true;
};

// Solo cargar métodos cuando se necesiten
ComponenteUI.prototype.mostrar = function () {
  this.inicializar();
  this.animarEntrada();
};

const componente = new ComponenteUI();
// Los métodos de animación aún no están cargados
componente.mostrar(); // Ahora se cargan los métodos
```

### Pooling de Objetos

```javascript
function PoolObjetos(Constructor, resetFn) {
  const pool = [];

  this.obtener = function (...args) {
    if (pool.length > 0) {
      const objeto = pool.pop();
      resetFn.call(objeto, ...args);
      return objeto;
    }
    return new Constructor(...args);
  };

  this.liberar = function (objeto) {
    pool.push(objeto);
  };

  this.tamaño = function () {
    return pool.length;
  };
}

// Objeto reutilizable
function Particula(x, y, velocidad) {
  this.x = x || 0;
  this.y = y || 0;
  this.velocidad = velocidad || 0;
  this.activa = true;
}

Particula.prototype.actualizar = function () {
  this.x += this.velocidad;
  this.y += this.velocidad;
};

Particula.prototype.reset = function (x, y, velocidad) {
  this.x = x || 0;
  this.y = y || 0;
  this.velocidad = velocidad || 0;
  this.activa = true;
};

// Crear pool
const poolParticulas = new PoolObjetos(Particula, function (x, y, velocidad) {
  this.reset(x, y, velocidad);
});

// Usar el pool
const particula1 = poolParticulas.obtener(10, 20, 5);
particula1.actualizar();
poolParticulas.liberar(particula1);

const particula2 = poolParticulas.obtener(15, 25, 8);
// particula2 es la misma instancia que particula1, pero reutilizada
```

## 🎯 Tips para WorldSkills

### 1. Herencia Rápida

```javascript
// Función utilitaria para herencia rápida
function heredar(Hijo, Padre) {
  Hijo.prototype = Object.create(Padre.prototype);
  Hijo.prototype.constructor = Hijo;
}

// Uso
function Animal(nombre) {
  this.nombre = nombre;
}
Animal.prototype.hablar = function () {
  return `${this.nombre} hace ruido`;
};

function Perro(nombre, raza) {
  Animal.call(this, nombre);
  this.raza = raza;
}

heredar(Perro, Animal);

Perro.prototype.ladrar = function () {
  return `${this.nombre} ladra`;
};
```

### 2. Verificación de Tipos

```javascript
function esInstanciaDe(objeto, Constructor) {
  return objeto instanceof Constructor;
}

function obtenerTipo(objeto) {
  return objeto.constructor.name;
}

function tieneMetodo(objeto, nombreMetodo) {
  return typeof objeto[nombreMetodo] === 'function';
}

// Uso rápido
const perro = new Perro('Max', 'Labrador');
console.log(esInstanciaDe(perro, Animal)); // true
console.log(obtenerTipo(perro)); // "Perro"
console.log(tieneMetodo(perro, 'ladrar')); // true
```

### 3. Debugging de Prototipos

```javascript
function analizarPrototipo(objeto) {
  console.log('--- Análisis de Prototipo ---');
  console.log('Constructor:', objeto.constructor.name);

  // Mostrar propiedades propias
  console.log('Propiedades propias:');
  for (let prop in objeto) {
    if (objeto.hasOwnProperty(prop)) {
      console.log(`  ${prop}: ${objeto[prop]}`);
    }
  }

  // Mostrar cadena de prototipos
  console.log('Cadena de prototipos:');
  let proto = objeto.__proto__;
  let nivel = 1;
  while (proto && proto !== Object.prototype) {
    console.log(`  Nivel ${nivel}: ${proto.constructor.name}`);
    proto = proto.__proto__;
    nivel++;
  }
}

// Uso
analizarPrototipo(perro);
```

## 📚 Ejercicios Prácticos

### Ejercicio 1: Sistema de Empleados

```javascript
// Implementar jerarquía: Empleado -> Desarrollador -> SeniorDeveloper

function Empleado(nombre, salario) {
  this.nombre = nombre;
  this.salario = salario;
}

Empleado.prototype.trabajar = function () {
  return `${this.nombre} está trabajando`;
};

Empleado.prototype.obtenerSalario = function () {
  return this.salario;
};

function Desarrollador(nombre, salario, lenguaje) {
  Empleado.call(this, nombre, salario);
  this.lenguaje = lenguaje;
}

Desarrollador.prototype = Object.create(Empleado.prototype);
Desarrollador.prototype.constructor = Desarrollador;

Desarrollador.prototype.programar = function () {
  return `${this.nombre} está programando en ${this.lenguaje}`;
};

function SeniorDeveloper(nombre, salario, lenguaje, equipo) {
  Desarrollador.call(this, nombre, salario, lenguaje);
  this.equipo = equipo;
}

SeniorDeveloper.prototype = Object.create(Desarrollador.prototype);
SeniorDeveloper.prototype.constructor = SeniorDeveloper;

SeniorDeveloper.prototype.liderar = function () {
  return `${this.nombre} está liderando el equipo ${this.equipo}`;
};

// Prueba
const senior = new SeniorDeveloper('Ana', 5000, 'JavaScript', 'Frontend');
console.log(senior.trabajar()); // De Empleado
console.log(senior.programar()); // De Desarrollador
console.log(senior.liderar()); // De SeniorDeveloper
```

### Ejercicio 2: Sistema de Formas Geométricas

```javascript
// Implementar usando Object.create()

const formaBase = {
  inicializar: function (color) {
    this.color = color;
  },
  obtenerColor: function () {
    return this.color;
  },
};

const rectangulo = Object.create(formaBase);
rectangulo.crear = function (ancho, alto, color) {
  this.ancho = ancho;
  this.alto = alto;
  this.inicializar(color);
  return this;
};

rectangulo.area = function () {
  return this.ancho * this.alto;
};

const circulo = Object.create(formaBase);
circulo.crear = function (radio, color) {
  this.radio = radio;
  this.inicializar(color);
  return this;
};

circulo.area = function () {
  return Math.PI * this.radio * this.radio;
};

// Uso
const miRectangulo = Object.create(rectangulo).crear(5, 3, 'rojo');
const miCirculo = Object.create(circulo).crear(4, 'azul');

console.log(miRectangulo.area()); // 15
console.log(miCirculo.area()); // 50.27
```

## 📚 Recursos Adicionales

### Documentación

- [MDN - Object.prototype](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Object/prototype)
- [MDN - Object.create()](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Object/create)
- [MDN - instanceof](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/instanceof)

### Herramientas

- Chrome DevTools - Console
- [JavaScript Visualizer](https://pythontutor.com/javascript.html)
- [Prototype Chain Visualizer](https://codepen.io/alexdevero/pen/RXavPE)

### Libros

- "JavaScript: The Definitive Guide" - David Flanagan
- "Professional JavaScript" - Nicholas C. Zakas
- "JavaScript Patterns" - Stoyan Stefanov

---

¡Domina el sistema de prototipos y tendrás las bases sólidas para la programación orientada a objetos en JavaScript! 🚀
