# 🧪 Testing Básico en JavaScript

## 🎯 Introducción al Testing Fundamental

### 1. **¿Por qué Testing?**

```javascript
// Ejemplo de función sin testing
function calcularDescuento(precio, descuento) {
  return precio * (1 - descuento / 100);
}

// ¿Qué pasa si...?
// - precio es negativo?
// - descuento es mayor a 100?
// - los parámetros son strings?
// - los parámetros son undefined?

// Con testing podemos validar todos estos casos
```

### 2. **Testing Manual Básico**

```javascript
// Función a testear
function sumar(a, b) {
  return a + b;
}

// Testing manual simple
function testSumar() {
  const resultado1 = sumar(2, 3);
  const esperado1 = 5;
  console.assert(
    resultado1 === esperado1,
    `Error: esperado ${esperado1}, obtenido ${resultado1}`
  );

  const resultado2 = sumar(-1, 1);
  const esperado2 = 0;
  console.assert(
    resultado2 === esperado2,
    `Error: esperado ${esperado2}, obtenido ${resultado2}`
  );

  console.log('Todos los tests pasaron');
}

// Ejecutar tests
testSumar();
```

### 3. **Framework de Testing Simple**

```javascript
// Mini framework de testing
class TestRunner {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
  }

  test(description, testFn) {
    this.tests.push({ description, testFn });
  }

  expect(actual) {
    return {
      toBe: expected => {
        if (actual === expected) {
          this.passed++;
          console.log(`✓ Test passed`);
        } else {
          this.failed++;
          console.error(`✗ Test failed: expected ${expected}, got ${actual}`);
        }
      },

      toEqual: expected => {
        if (JSON.stringify(actual) === JSON.stringify(expected)) {
          this.passed++;
          console.log(`✓ Test passed`);
        } else {
          this.failed++;
          console.error(
            `✗ Test failed: expected ${JSON.stringify(
              expected
            )}, got ${JSON.stringify(actual)}`
          );
        }
      },
    };
  }

  run() {
    console.log('Running tests...\n');

    this.tests.forEach(({ description, testFn }) => {
      console.log(`Testing: ${description}`);
      try {
        testFn();
      } catch (error) {
        this.failed++;
        console.error(`✗ Test failed with error: ${error.message}`);
      }
      console.log('');
    });

    console.log(`\n--- Results ---`);
    console.log(`Passed: ${this.passed}`);
    console.log(`Failed: ${this.failed}`);
    console.log(`Total: ${this.passed + this.failed}`);
  }
}

// Uso del framework
const runner = new TestRunner();

runner.test('sumar dos números positivos', () => {
  const resultado = sumar(2, 3);
  runner.expect(resultado).toBe(5);
});

runner.test('sumar números negativos', () => {
  const resultado = sumar(-2, -3);
  runner.expect(resultado).toBe(-5);
});

runner.run();
```

### 4. **Testing con Jest (Sintaxis)**

```javascript
// Instalación: npm install --save-dev jest

// archivo: math.js
function sumar(a, b) {
  return a + b;
}

function multiplicar(a, b) {
  return a * b;
}

function dividir(a, b) {
  if (b === 0) {
    throw new Error('No se puede dividir por cero');
  }
  return a / b;
}

module.exports = { sumar, multiplicar, dividir };

// archivo: math.test.js
const { sumar, multiplicar, dividir } = require('./math');

describe('Operaciones matemáticas', () => {
  test('sumar dos números', () => {
    expect(sumar(2, 3)).toBe(5);
    expect(sumar(-1, 1)).toBe(0);
    expect(sumar(0, 0)).toBe(0);
  });

  test('multiplicar dos números', () => {
    expect(multiplicar(3, 4)).toBe(12);
    expect(multiplicar(-2, 3)).toBe(-6);
    expect(multiplicar(0, 5)).toBe(0);
  });

  test('dividir dos números', () => {
    expect(dividir(10, 2)).toBe(5);
    expect(dividir(-8, 4)).toBe(-2);
  });

  test('dividir por cero debe lanzar error', () => {
    expect(() => dividir(10, 0)).toThrow('No se puede dividir por cero');
  });
});
```

### 5. **Testing de Funciones Asíncronas**

```javascript
// Función asíncrona
async function obtenerUsuario(id) {
  const response = await fetch(`/api/usuarios/${id}`);
  if (!response.ok) {
    throw new Error('Usuario no encontrado');
  }
  return response.json();
}

// Testing con async/await
test('obtener usuario existente', async () => {
  // Mock del fetch
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ id: 1, nombre: 'Juan' }),
    })
  );

  const usuario = await obtenerUsuario(1);
  expect(usuario).toEqual({ id: 1, nombre: 'Juan' });
});

// Testing de errores asíncronos
test('obtener usuario inexistente', async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: false,
      status: 404,
    })
  );

  await expect(obtenerUsuario(999)).rejects.toThrow('Usuario no encontrado');
});
```

### 6. **Testing de Arrays y Objetos**

```javascript
// Funciones para testear
function filtrarPares(numeros) {
  return numeros.filter(n => n % 2 === 0);
}

function crearUsuario(nombre, email) {
  return {
    id: Date.now(),
    nombre,
    email,
    activo: true,
    fechaCreacion: new Date(),
  };
}

// Tests
describe('Manipulación de datos', () => {
  test('filtrar números pares', () => {
    const numeros = [1, 2, 3, 4, 5, 6];
    const resultado = filtrarPares(numeros);
    expect(resultado).toEqual([2, 4, 6]);
    expect(resultado).toHaveLength(3);
  });

  test('crear usuario', () => {
    const usuario = crearUsuario('Ana', 'ana@email.com');

    expect(usuario).toHaveProperty('id');
    expect(usuario).toHaveProperty('nombre', 'Ana');
    expect(usuario).toHaveProperty('email', 'ana@email.com');
    expect(usuario).toHaveProperty('activo', true);
    expect(usuario).toHaveProperty('fechaCreacion');
    expect(usuario.fechaCreacion).toBeInstanceOf(Date);
  });
});
```

### 7. **Testing de Clases**

```javascript
// Clase para testear
class Calculadora {
  constructor() {
    this.resultado = 0;
  }

  sumar(valor) {
    this.resultado += valor;
    return this;
  }

  restar(valor) {
    this.resultado -= valor;
    return this;
  }

  multiplicar(valor) {
    this.resultado *= valor;
    return this;
  }

  obtenerResultado() {
    return this.resultado;
  }

  limpiar() {
    this.resultado = 0;
    return this;
  }
}

// Tests
describe('Calculadora', () => {
  let calculadora;

  beforeEach(() => {
    calculadora = new Calculadora();
  });

  test('debe inicializar con resultado 0', () => {
    expect(calculadora.obtenerResultado()).toBe(0);
  });

  test('debe sumar correctamente', () => {
    calculadora.sumar(5);
    expect(calculadora.obtenerResultado()).toBe(5);
  });

  test('debe permitir encadenar operaciones', () => {
    const resultado = calculadora
      .sumar(10)
      .restar(3)
      .multiplicar(2)
      .obtenerResultado();

    expect(resultado).toBe(14);
  });

  test('debe limpiar el resultado', () => {
    calculadora.sumar(5).limpiar();
    expect(calculadora.obtenerResultado()).toBe(0);
  });
});
```

### 8. **Mocking y Spies**

```javascript
// Servicio para testear
class EmailService {
  async enviarEmail(email, mensaje) {
    // Lógica real de envío
    const response = await fetch('/api/emails', {
      method: 'POST',
      body: JSON.stringify({ email, mensaje }),
    });

    if (!response.ok) {
      throw new Error('Error enviando email');
    }

    return response.json();
  }
}

class NotificationService {
  constructor(emailService) {
    this.emailService = emailService;
  }

  async notificarUsuario(usuario, mensaje) {
    try {
      await this.emailService.enviarEmail(usuario.email, mensaje);
      return { success: true, message: 'Email enviado' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

// Tests con mocking
describe('NotificationService', () => {
  let emailService;
  let notificationService;

  beforeEach(() => {
    emailService = new EmailService();
    notificationService = new NotificationService(emailService);
  });

  test('debe enviar email exitosamente', async () => {
    // Mock del método
    emailService.enviarEmail = jest.fn().mockResolvedValue({ id: 1 });

    const usuario = { email: 'test@example.com' };
    const resultado = await notificationService.notificarUsuario(
      usuario,
      'Hola'
    );

    expect(emailService.enviarEmail).toHaveBeenCalledWith(
      'test@example.com',
      'Hola'
    );
    expect(resultado).toEqual({ success: true, message: 'Email enviado' });
  });

  test('debe manejar errores de envío', async () => {
    // Mock que falla
    emailService.enviarEmail = jest
      .fn()
      .mockRejectedValue(new Error('Error enviando email'));

    const usuario = { email: 'test@example.com' };
    const resultado = await notificationService.notificarUsuario(
      usuario,
      'Hola'
    );

    expect(resultado).toEqual({
      success: false,
      error: 'Error enviando email',
    });
  });
});
```

### 9. **Testing de DOM**

```javascript
// Función que manipula DOM
function crearElementoTarea(texto) {
  const li = document.createElement('li');
  li.className = 'tarea';
  li.innerHTML = `
        <span class="texto">${texto}</span>
        <button class="btn-eliminar">Eliminar</button>
    `;
  return li;
}

function agregarTarea(contenedor, texto) {
  const elemento = crearElementoTarea(texto);
  contenedor.appendChild(elemento);
  return elemento;
}

// Tests (con jsdom)
describe('DOM manipulation', () => {
  let contenedor;

  beforeEach(() => {
    document.body.innerHTML = '<ul id="lista-tareas"></ul>';
    contenedor = document.getElementById('lista-tareas');
  });

  test('debe crear elemento de tarea', () => {
    const elemento = crearElementoTarea('Hacer compras');

    expect(elemento.tagName).toBe('LI');
    expect(elemento.className).toBe('tarea');
    expect(elemento.querySelector('.texto').textContent).toBe('Hacer compras');
    expect(elemento.querySelector('.btn-eliminar')).toBeTruthy();
  });

  test('debe agregar tarea al contenedor', () => {
    const elemento = agregarTarea(contenedor, 'Nueva tarea');

    expect(contenedor.children.length).toBe(1);
    expect(contenedor.contains(elemento)).toBe(true);
  });
});
```

### 10. **Test Driven Development (TDD)**

```javascript
// Paso 1: Escribir test que falle
describe('Validador de contraseña', () => {
  test('debe requerir al menos 8 caracteres', () => {
    expect(validarPassword('123')).toBe(false);
    expect(validarPassword('12345678')).toBe(true);
  });

  test('debe requerir al menos una mayúscula', () => {
    expect(validarPassword('minuscula123')).toBe(false);
    expect(validarPassword('Mayuscula123')).toBe(true);
  });

  test('debe requerir al menos un número', () => {
    expect(validarPassword('SinNumeros')).toBe(false);
    expect(validarPassword('ConNumero1')).toBe(true);
  });
});

// Paso 2: Implementar función mínima
function validarPassword(password) {
  if (password.length < 8) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/\d/.test(password)) return false;
  return true;
}

// Paso 3: Refactorizar si es necesario
function validarPassword(password) {
  const reglas = [
    { test: p => p.length >= 8, mensaje: 'Mínimo 8 caracteres' },
    { test: p => /[A-Z]/.test(p), mensaje: 'Requiere mayúscula' },
    { test: p => /\d/.test(p), mensaje: 'Requiere número' },
  ];

  return reglas.every(regla => regla.test(password));
}
```

### 11. **Testing de Errores**

```javascript
// Función que puede fallar
function procesarDatos(datos) {
  if (!datos) {
    throw new Error('Datos requeridos');
  }

  if (!Array.isArray(datos)) {
    throw new TypeError('Datos debe ser un array');
  }

  if (datos.length === 0) {
    throw new Error('Array no puede estar vacío');
  }

  return datos.map(item => item.toUpperCase());
}

// Tests de errores
describe('procesarDatos', () => {
  test('debe lanzar error si no hay datos', () => {
    expect(() => procesarDatos()).toThrow('Datos requeridos');
    expect(() => procesarDatos(null)).toThrow('Datos requeridos');
  });

  test('debe lanzar TypeError si no es array', () => {
    expect(() => procesarDatos('no es array')).toThrow(TypeError);
    expect(() => procesarDatos({})).toThrow(TypeError);
  });

  test('debe lanzar error si array está vacío', () => {
    expect(() => procesarDatos([])).toThrow('Array no puede estar vacío');
  });

  test('debe procesar datos correctamente', () => {
    const resultado = procesarDatos(['hello', 'world']);
    expect(resultado).toEqual(['HELLO', 'WORLD']);
  });
});
```

### 12. **Coverage y Reporting**

```javascript
// package.json
{
    "scripts": {
        "test": "jest",
        "test:watch": "jest --watch",
        "test:coverage": "jest --coverage"
    },
    "jest": {
        "collectCoverageFrom": [
            "src/**/*.js",
            "!src/index.js"
        ],
        "coverageThreshold": {
            "global": {
                "branches": 80,
                "functions": 80,
                "lines": 80,
                "statements": 80
            }
        }
    }
}
```

## 🎯 Mejores Prácticas

### **1. Organización**

```javascript
// Estructura clara
describe('ComponenteNombre', () => {
  describe('método1', () => {
    test('debe hacer X cuando Y', () => {
      // Test específico
    });
  });

  describe('método2', () => {
    // Tests del método2
  });
});
```

### **2. Nombres Descriptivos**

```javascript
// ✅ Bueno
test('debe retornar true para email válido', () => {});

// ❌ Malo
test('validar email', () => {});
```

### **3. Arrange, Act, Assert (AAA)**

```javascript
test('debe calcular precio con descuento', () => {
  // Arrange
  const precio = 100;
  const descuento = 20;

  // Act
  const resultado = calcularPrecioConDescuento(precio, descuento);

  // Assert
  expect(resultado).toBe(80);
});
```

### **4. Un Assert por Test**

```javascript
// ✅ Bueno
test('debe crear usuario con nombre', () => {
  const usuario = crearUsuario('Ana');
  expect(usuario.nombre).toBe('Ana');
});

test('debe crear usuario activo', () => {
  const usuario = crearUsuario('Ana');
  expect(usuario.activo).toBe(true);
});

// ❌ Malo (múltiples assertions)
test('debe crear usuario correctamente', () => {
  const usuario = crearUsuario('Ana');
  expect(usuario.nombre).toBe('Ana');
  expect(usuario.activo).toBe(true);
  expect(usuario.id).toBeDefined();
});
```

## 🔧 Configuración Jest

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom', // Para testing de DOM
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js',
    '!src/serviceWorker.js',
  ],
};
```

## 🏆 Tips para WorldSkills

1. **Escribe tests antes de implementar** - TDD te ayuda a pensar en los casos edge
2. **Usa nombres descriptivos** - Los tests son documentación
3. **Testea casos límite** - null, undefined, arrays vacíos
4. **Mock dependencias externas** - APIs, servicios, etc.
5. **Mantén tests simples** - Un test, una responsabilidad
6. **Usa setup/teardown** - beforeEach, afterEach para limpieza

---

💡 **Recuerda**: El testing es una habilidad fundamental para desarrolladores profesionales y es valorado en competencias WorldSkills.
