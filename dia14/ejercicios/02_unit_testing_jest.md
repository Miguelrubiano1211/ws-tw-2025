# 🔬 Ejercicio 2: Unit Testing con Jest

## 📝 Descripción

Implementar tests unitarios para funciones puras, utilidades y lógica de negocio usando Jest. Practicar técnicas de mocking y testing de casos edge.

## 🎯 Objetivos

- Escribir tests unitarios efectivos con Jest
- Dominar matchers y assertions
- Implementar mocks y spies
- Testear casos edge y error handling
- Configurar tests parameterizados

## 📋 Instrucciones

### Paso 1: Crear funciones utilitarias para testear

```javascript
// src/utils/math.js
export const sum = (a, b) => {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new Error('Los parámetros deben ser números');
  }
  return a + b;
};

export const multiply = (a, b) => a * b;

export const divide = (a, b) => {
  if (b === 0) {
    throw new Error('División por cero no permitida');
  }
  return a / b;
};

export const factorial = n => {
  if (n < 0)
    throw new Error('No se puede calcular factorial de números negativos');
  if (n === 0 || n === 1) return 1;
  return n * factorial(n - 1);
};

export const isPrime = num => {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};
```

### Paso 2: Crear utilidades de validación

```javascript
// src/utils/validation.js
export const validateEmail = email => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = password => {
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return {
    isValid:
      hasMinLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasSpecialChar,
    errors: {
      minLength: !hasMinLength,
      upperCase: !hasUpperCase,
      lowerCase: !hasLowerCase,
      numbers: !hasNumbers,
      specialChar: !hasSpecialChar,
    },
  };
};

export const sanitizeInput = input => {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[<>]/g, '');
};

export const formatPrice = price => {
  if (typeof price !== 'number' || price < 0) {
    throw new Error('El precio debe ser un número positivo');
  }
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
  }).format(price);
};
```

### Paso 3: Crear utilidades de array

```javascript
// src/utils/arrayUtils.js
export const removeDuplicates = arr => {
  if (!Array.isArray(arr)) {
    throw new Error('El parámetro debe ser un array');
  }
  return [...new Set(arr)];
};

export const sortBy = (arr, key) => {
  if (!Array.isArray(arr)) {
    throw new Error('El primer parámetro debe ser un array');
  }
  return [...arr].sort((a, b) => {
    if (a[key] < b[key]) return -1;
    if (a[key] > b[key]) return 1;
    return 0;
  });
};

export const groupBy = (arr, key) => {
  if (!Array.isArray(arr)) {
    throw new Error('El primer parámetro debe ser un array');
  }
  return arr.reduce((groups, item) => {
    const group = item[key];
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {});
};

export const paginate = (arr, page, pageSize) => {
  if (!Array.isArray(arr)) {
    throw new Error('El primer parámetro debe ser un array');
  }
  if (page < 1 || pageSize < 1) {
    throw new Error('Page y pageSize deben ser mayores a 0');
  }

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  return {
    data: arr.slice(startIndex, endIndex),
    total: arr.length,
    page,
    pageSize,
    totalPages: Math.ceil(arr.length / pageSize),
  };
};
```

### Paso 4: Crear utilidades de fecha

```javascript
// src/utils/dateUtils.js
export const formatDate = (date, format = 'YYYY-MM-DD') => {
  if (!(date instanceof Date) || isNaN(date)) {
    throw new Error('Parámetro debe ser una fecha válida');
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  switch (format) {
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`;
    case 'DD/MM/YYYY':
      return `${day}/${month}/${year}`;
    case 'MM/DD/YYYY':
      return `${month}/${day}/${year}`;
    default:
      throw new Error('Formato de fecha no soportado');
  }
};

export const addDays = (date, days) => {
  if (!(date instanceof Date) || isNaN(date)) {
    throw new Error('Parámetro debe ser una fecha válida');
  }
  if (typeof days !== 'number') {
    throw new Error('Days debe ser un número');
  }

  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const daysBetween = (date1, date2) => {
  if (!(date1 instanceof Date) || !(date2 instanceof Date)) {
    throw new Error('Ambos parámetros deben ser fechas válidas');
  }

  const timeDiff = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};
```

### Paso 5: Escribir tests unitarios para matemáticas

```javascript
// src/utils/__tests__/math.test.js
import { sum, multiply, divide, factorial, isPrime } from '../math';

describe('Utilidades Matemáticas', () => {
  describe('sum', () => {
    test('debe sumar dos números correctamente', () => {
      expect(sum(2, 3)).toBe(5);
      expect(sum(-1, 1)).toBe(0);
      expect(sum(0, 0)).toBe(0);
    });

    test('debe manejar números decimales', () => {
      expect(sum(0.1, 0.2)).toBeCloseTo(0.3);
      expect(sum(1.5, 2.5)).toBe(4);
    });

    test('debe lanzar error con parámetros inválidos', () => {
      expect(() => sum('2', 3)).toThrow('Los parámetros deben ser números');
      expect(() => sum(2, null)).toThrow('Los parámetros deben ser números');
      expect(() => sum(undefined, 3)).toThrow(
        'Los parámetros deben ser números'
      );
    });
  });

  describe('multiply', () => {
    test('debe multiplicar dos números correctamente', () => {
      expect(multiply(2, 3)).toBe(6);
      expect(multiply(-2, 3)).toBe(-6);
      expect(multiply(0, 5)).toBe(0);
    });

    test('debe manejar números decimales', () => {
      expect(multiply(2.5, 4)).toBe(10);
      expect(multiply(0.1, 0.2)).toBeCloseTo(0.02);
    });
  });

  describe('divide', () => {
    test('debe dividir dos números correctamente', () => {
      expect(divide(10, 2)).toBe(5);
      expect(divide(7, 2)).toBe(3.5);
      expect(divide(-10, 2)).toBe(-5);
    });

    test('debe lanzar error al dividir por cero', () => {
      expect(() => divide(10, 0)).toThrow('División por cero no permitida');
    });

    test('debe manejar división que resulta en cero', () => {
      expect(divide(0, 5)).toBe(0);
    });
  });

  describe('factorial', () => {
    test('debe calcular factorial correctamente', () => {
      expect(factorial(0)).toBe(1);
      expect(factorial(1)).toBe(1);
      expect(factorial(5)).toBe(120);
      expect(factorial(3)).toBe(6);
    });

    test('debe lanzar error con números negativos', () => {
      expect(() => factorial(-1)).toThrow(
        'No se puede calcular factorial de números negativos'
      );
      expect(() => factorial(-5)).toThrow(
        'No se puede calcular factorial de números negativos'
      );
    });
  });

  describe('isPrime', () => {
    test('debe identificar números primos correctamente', () => {
      expect(isPrime(2)).toBe(true);
      expect(isPrime(3)).toBe(true);
      expect(isPrime(5)).toBe(true);
      expect(isPrime(7)).toBe(true);
      expect(isPrime(11)).toBe(true);
    });

    test('debe identificar números no primos correctamente', () => {
      expect(isPrime(1)).toBe(false);
      expect(isPrime(4)).toBe(false);
      expect(isPrime(6)).toBe(false);
      expect(isPrime(8)).toBe(false);
      expect(isPrime(9)).toBe(false);
    });

    test('debe manejar casos edge', () => {
      expect(isPrime(0)).toBe(false);
      expect(isPrime(-1)).toBe(false);
      expect(isPrime(100)).toBe(false);
    });
  });
});
```

### Paso 6: Escribir tests para validación

```javascript
// src/utils/__tests__/validation.test.js
import {
  validateEmail,
  validatePassword,
  sanitizeInput,
  formatPrice,
} from '../validation';

describe('Utilidades de Validación', () => {
  describe('validateEmail', () => {
    test('debe validar emails correctos', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('usuario@dominio.co')).toBe(true);
      expect(validateEmail('nombre.apellido@empresa.com.co')).toBe(true);
    });

    test('debe invalidar emails incorrectos', () => {
      expect(validateEmail('email-invalido')).toBe(false);
      expect(validateEmail('@dominio.com')).toBe(false);
      expect(validateEmail('usuario@')).toBe(false);
      expect(validateEmail('usuario@dominio')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    test('debe validar contraseñas seguras', () => {
      const result = validatePassword('MiPassword123!');
      expect(result.isValid).toBe(true);
      expect(result.errors.minLength).toBe(false);
      expect(result.errors.upperCase).toBe(false);
      expect(result.errors.lowerCase).toBe(false);
      expect(result.errors.numbers).toBe(false);
      expect(result.errors.specialChar).toBe(false);
    });

    test('debe invalidar contraseñas débiles', () => {
      const result = validatePassword('123');
      expect(result.isValid).toBe(false);
      expect(result.errors.minLength).toBe(true);
      expect(result.errors.upperCase).toBe(true);
      expect(result.errors.lowerCase).toBe(true);
      expect(result.errors.specialChar).toBe(true);
    });

    test('debe detectar cada tipo de error', () => {
      expect(validatePassword('password').errors.upperCase).toBe(true);
      expect(validatePassword('PASSWORD').errors.lowerCase).toBe(true);
      expect(validatePassword('Password').errors.numbers).toBe(true);
      expect(validatePassword('Password123').errors.specialChar).toBe(true);
    });
  });

  describe('sanitizeInput', () => {
    test('debe limpiar input correctamente', () => {
      expect(sanitizeInput('  hello world  ')).toBe('hello world');
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe(
        'scriptalert("xss")/script'
      );
      expect(sanitizeInput('normal text')).toBe('normal text');
    });

    test('debe manejar inputs no válidos', () => {
      expect(sanitizeInput(null)).toBe('');
      expect(sanitizeInput(undefined)).toBe('');
      expect(sanitizeInput(123)).toBe('');
    });
  });

  describe('formatPrice', () => {
    test('debe formatear precios correctamente', () => {
      expect(formatPrice(1000)).toBe('$1.000');
      expect(formatPrice(1500.5)).toBe('$1.501');
      expect(formatPrice(0)).toBe('$0');
    });

    test('debe lanzar error con valores inválidos', () => {
      expect(() => formatPrice(-100)).toThrow(
        'El precio debe ser un número positivo'
      );
      expect(() => formatPrice('1000')).toThrow(
        'El precio debe ser un número positivo'
      );
      expect(() => formatPrice(null)).toThrow(
        'El precio debe ser un número positivo'
      );
    });
  });
});
```

### Paso 7: Tests con mocks y spies

```javascript
// src/utils/__tests__/arrayUtils.test.js
import { removeDuplicates, sortBy, groupBy, paginate } from '../arrayUtils';

describe('Utilidades de Arrays', () => {
  describe('removeDuplicates', () => {
    test('debe remover duplicados correctamente', () => {
      expect(removeDuplicates([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
      expect(removeDuplicates(['a', 'b', 'b', 'c'])).toEqual(['a', 'b', 'c']);
      expect(removeDuplicates([])).toEqual([]);
    });

    test('debe lanzar error con input inválido', () => {
      expect(() => removeDuplicates('not an array')).toThrow(
        'El parámetro debe ser un array'
      );
      expect(() => removeDuplicates(null)).toThrow(
        'El parámetro debe ser un array'
      );
    });
  });

  describe('sortBy', () => {
    const mockData = [
      { id: 3, name: 'Charlie' },
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ];

    test('debe ordenar por clave correctamente', () => {
      const sortedById = sortBy(mockData, 'id');
      expect(sortedById[0].id).toBe(1);
      expect(sortedById[1].id).toBe(2);
      expect(sortedById[2].id).toBe(3);
    });

    test('debe ordenar por nombre', () => {
      const sortedByName = sortBy(mockData, 'name');
      expect(sortedByName[0].name).toBe('Alice');
      expect(sortedByName[1].name).toBe('Bob');
      expect(sortedByName[2].name).toBe('Charlie');
    });

    test('no debe mutar el array original', () => {
      const original = [...mockData];
      sortBy(mockData, 'id');
      expect(mockData).toEqual(original);
    });
  });

  describe('groupBy', () => {
    const mockData = [
      { category: 'A', value: 1 },
      { category: 'B', value: 2 },
      { category: 'A', value: 3 },
      { category: 'C', value: 4 },
    ];

    test('debe agrupar por clave correctamente', () => {
      const grouped = groupBy(mockData, 'category');
      expect(grouped.A).toHaveLength(2);
      expect(grouped.B).toHaveLength(1);
      expect(grouped.C).toHaveLength(1);
    });

    test('debe mantener objetos originales', () => {
      const grouped = groupBy(mockData, 'category');
      expect(grouped.A[0]).toBe(mockData[0]);
      expect(grouped.A[1]).toBe(mockData[2]);
    });
  });

  describe('paginate', () => {
    const mockData = Array.from({ length: 25 }, (_, i) => ({ id: i + 1 }));

    test('debe paginar correctamente', () => {
      const result = paginate(mockData, 1, 10);
      expect(result.data).toHaveLength(10);
      expect(result.total).toBe(25);
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(10);
      expect(result.totalPages).toBe(3);
    });

    test('debe manejar última página', () => {
      const result = paginate(mockData, 3, 10);
      expect(result.data).toHaveLength(5);
      expect(result.totalPages).toBe(3);
    });

    test('debe lanzar errores con parámetros inválidos', () => {
      expect(() => paginate('not array', 1, 10)).toThrow(
        'El primer parámetro debe ser un array'
      );
      expect(() => paginate(mockData, 0, 10)).toThrow(
        'Page y pageSize deben ser mayores a 0'
      );
      expect(() => paginate(mockData, 1, 0)).toThrow(
        'Page y pageSize deben ser mayores a 0'
      );
    });
  });
});
```

### Paso 8: Tests parameterizados

```javascript
// src/utils/__tests__/dateUtils.test.js
import { formatDate, addDays, daysBetween } from '../dateUtils';

describe('Utilidades de Fecha', () => {
  // Mock de fecha para tests consistentes
  const mockDate = new Date('2023-06-15T10:30:00Z');

  describe('formatDate', () => {
    test.each([
      ['YYYY-MM-DD', '2023-06-15'],
      ['DD/MM/YYYY', '15/06/2023'],
      ['MM/DD/YYYY', '06/15/2023'],
    ])('debe formatear fecha en formato %s', (format, expected) => {
      expect(formatDate(mockDate, format)).toBe(expected);
    });

    test('debe usar formato por defecto', () => {
      expect(formatDate(mockDate)).toBe('2023-06-15');
    });

    test('debe lanzar error con fecha inválida', () => {
      expect(() => formatDate('not a date')).toThrow(
        'Parámetro debe ser una fecha válida'
      );
      expect(() => formatDate(new Date('invalid'))).toThrow(
        'Parámetro debe ser una fecha válida'
      );
    });

    test('debe lanzar error con formato no soportado', () => {
      expect(() => formatDate(mockDate, 'INVALID')).toThrow(
        'Formato de fecha no soportado'
      );
    });
  });

  describe('addDays', () => {
    test('debe agregar días correctamente', () => {
      const result = addDays(mockDate, 5);
      expect(result.getDate()).toBe(20);
      expect(result.getMonth()).toBe(5); // Junio = 5
      expect(result.getFullYear()).toBe(2023);
    });

    test('debe manejar números negativos', () => {
      const result = addDays(mockDate, -10);
      expect(result.getDate()).toBe(5);
    });

    test('debe lanzar error con parámetros inválidos', () => {
      expect(() => addDays('not a date', 5)).toThrow(
        'Parámetro debe ser una fecha válida'
      );
      expect(() => addDays(mockDate, 'not a number')).toThrow(
        'Days debe ser un número'
      );
    });
  });

  describe('daysBetween', () => {
    test('debe calcular días entre fechas', () => {
      const date1 = new Date('2023-06-15');
      const date2 = new Date('2023-06-20');
      expect(daysBetween(date1, date2)).toBe(5);
    });

    test('debe funcionar con fechas en orden inverso', () => {
      const date1 = new Date('2023-06-20');
      const date2 = new Date('2023-06-15');
      expect(daysBetween(date1, date2)).toBe(5);
    });

    test('debe retornar 0 para fechas iguales', () => {
      const date = new Date('2023-06-15');
      expect(daysBetween(date, date)).toBe(0);
    });
  });
});
```

## 📊 Verificación

### Ejecutar todos los tests

```bash
npm test
```

### Ejecutar tests específicos

```bash
npm test -- --testNamePattern="math"
npm test -- --testPathPattern="validation"
```

### Ejecutar con coverage

```bash
npm run test:coverage
```

### Ejecutar en modo watch

```bash
npm run test:watch
```

## 🎯 Criterios de Evaluación

### Tests Básicos (30 puntos)

- [ ] Tests para funciones matemáticas (10 pts)
- [ ] Tests para validación (10 pts)
- [ ] Tests para utilidades de arrays (10 pts)

### Tests Avanzados (40 puntos)

- [ ] Manejo de casos edge (10 pts)
- [ ] Tests de error handling (10 pts)
- [ ] Tests parameterizados (10 pts)
- [ ] Mocks y spies (10 pts)

### Coverage y Calidad (30 puntos)

- [ ] Coverage > 90% (15 pts)
- [ ] Tests bien organizados (10 pts)
- [ ] Nombres descriptivos (5 pts)

## 📚 Recursos Adicionales

- [Jest Expect API](https://jestjs.io/docs/expect)
- [Jest Mock Functions](https://jestjs.io/docs/mock-functions)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [Jest Parameterized Tests](https://jestjs.io/docs/api#testeachtablename-fn-timeout)
