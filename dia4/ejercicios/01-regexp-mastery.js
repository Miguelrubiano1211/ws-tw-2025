/**
 * 🎯 Ejercicio 1: RegExp Mastery
 * Día 4: Validaciones y Seguridad Frontend
 *
 * Objetivos:
 * - Dominar sintaxis avanzada de Regular Expressions
 * - Implementar validaciones complejas y eficientes
 * - Optimizar performance de expresiones regulares
 * - Crear patrones reutilizables para validaciones comunes
 */

// =============================================================================
// 📚 TEORÍA: Regular Expressions Avanzadas
// =============================================================================

/**
 * METACARACTERES FUNDAMENTALES
 *
 * . (punto)     - Cualquier carácter excepto nueva línea
 * * (asterisco) - 0 o más repeticiones del carácter anterior
 * + (plus)      - 1 o más repeticiones del carácter anterior
 * ? (question)  - 0 o 1 repetición del carácter anterior
 * ^ (caret)     - Inicio de cadena
 * $ (dollar)    - Final de cadena
 * [] (brackets) - Conjunto de caracteres
 * () (parens)   - Grupos de captura
 * | (pipe)      - OR lógico
 * \ (backslash) - Escape de caracteres especiales
 */

/**
 * QUANTIFIERS (CUANTIFICADORES)
 *
 * {n}    - Exactamente n repeticiones
 * {n,}   - n o más repeticiones
 * {n,m}  - Entre n y m repeticiones
 * *      - {0,} (0 o más)
 * +      - {1,} (1 o más)
 * ?      - {0,1} (0 o 1)
 */

/**
 * CHARACTER CLASSES
 *
 * \d  - Dígitos [0-9]
 * \w  - Caracteres de palabra [a-zA-Z0-9_]
 * \s  - Espacios en blanco
 * \b  - Límite de palabra
 * \D  - No dígitos
 * \W  - No caracteres de palabra
 * \S  - No espacios en blanco
 */

/**
 * FLAGS
 *
 * g - Global (buscar todas las coincidencias)
 * i - Ignore case (ignorar mayúsculas/minúsculas)
 * m - Multiline (tratar ^ y $ como inicio/fin de línea)
 * s - Dotall (. incluye nueva línea)
 * u - Unicode (soporte completo Unicode)
 * y - Sticky (buscar desde lastIndex)
 */

// =============================================================================
// 🔧 EJEMPLOS PRÁCTICOS
// =============================================================================

// 1. Email Validation - Completa y robusta
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function validateEmail(email) {
  return emailRegex.test(email);
}

// Test cases
console.log('=== EMAIL VALIDATION ===');
console.log(validateEmail('usuario@dominio.com')); // true
console.log(validateEmail('test.email@sub.domain.co')); // true
console.log(validateEmail('invalid-email')); // false
console.log(validateEmail('@domain.com')); // false

// 2. Password Validation - Política de seguridad robusta
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

function validatePassword(password) {
  return passwordRegex.test(password);
}

// Test cases
console.log('\n=== PASSWORD VALIDATION ===');
console.log(validatePassword('Password123!')); // true
console.log(validatePassword('MiClave2024@')); // true
console.log(validatePassword('password')); // false (falta mayúscula, número, especial)
console.log(validatePassword('PASSWORD123!')); // false (falta minúscula)

// 3. Phone Number Validation - Internacional
const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;

function validatePhone(phone) {
  return phoneRegex.test(phone);
}

// Test cases
console.log('\n=== PHONE VALIDATION ===');
console.log(validatePhone('+57 300 123 4567')); // true
console.log(validatePhone('(300) 123-4567')); // true
console.log(validatePhone('3001234567')); // true
console.log(validatePhone('123')); // false (muy corto)

// 4. URL Validation - Completa con protocolo
const urlRegex =
  /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

function validateURL(url) {
  return urlRegex.test(url);
}

// Test cases
console.log('\n=== URL VALIDATION ===');
console.log(validateURL('https://www.example.com')); // true
console.log(validateURL('http://sub.domain.co/path')); // true
console.log(validateURL('https://site.com/page?id=123')); // true
console.log(validateURL('not-a-url')); // false

// 5. Date Validation - Formato ISO (YYYY-MM-DD)
const dateRegex = /^(\d{4})-(\d{2})-(\d{2})$/;

function validateDate(date) {
  const match = date.match(dateRegex);
  if (!match) return false;

  const [, year, month, day] = match;
  const dateObj = new Date(year, month - 1, day);

  return (
    dateObj.getFullYear() == year &&
    dateObj.getMonth() == month - 1 &&
    dateObj.getDate() == day
  );
}

// Test cases
console.log('\n=== DATE VALIDATION ===');
console.log(validateDate('2024-12-25')); // true
console.log(validateDate('2024-02-29')); // true (año bisiesto)
console.log(validateDate('2024-13-01')); // false (mes inválido)
console.log(validateDate('2024-02-30')); // false (día inválido)

// 6. Credit Card Validation - Formato básico
const creditCardRegex = /^(\d{4}[\s\-]?){3}\d{4}$/;

function validateCreditCard(cardNumber) {
  return creditCardRegex.test(cardNumber);
}

// Test cases
console.log('\n=== CREDIT CARD VALIDATION ===');
console.log(validateCreditCard('1234 5678 9012 3456')); // true
console.log(validateCreditCard('1234-5678-9012-3456')); // true
console.log(validateCreditCard('1234567890123456')); // true
console.log(validateCreditCard('1234 5678 9012 34')); // false

// =============================================================================
// 🎯 DESAFÍOS PRÁCTICOS
// =============================================================================

console.log('\n' + '='.repeat(50));
console.log('🎯 DESAFÍOS PRÁCTICOS - ¡Completa estos ejercicios!');
console.log('='.repeat(50));

// DESAFÍO 1: Validación de Nombre Completo
// Crear RegExp que valide:
// - Al menos 2 palabras
// - Solo letras y espacios
// - Primera letra de cada palabra en mayúscula
function validateFullName(name) {
  // TODO: Implementar validación de nombre completo
  // Pista: Usar ^[A-Z][a-z]+ [A-Z][a-z]+.*$

  const nameRegex = /^[A-Z][a-z]+(?: [A-Z][a-z]+)+$/;
  return nameRegex.test(name);
}

// Test cases
console.log('\n=== DESAFÍO 1: NOMBRE COMPLETO ===');
console.log(validateFullName('Juan Pérez')); // true
console.log(validateFullName('Ana María García')); // true
console.log(validateFullName('juan pérez')); // false
console.log(validateFullName('Juan')); // false

// DESAFÍO 2: Validación de Código Postal Colombiano
// Crear RegExp que valide:
// - Exactamente 6 dígitos
// - Formato: XXXXXX
function validatePostalCode(code) {
  // TODO: Implementar validación de código postal
  // Pista: Usar ^\d{6}$

  const postalRegex = /^\d{6}$/;
  return postalRegex.test(code);
}

// Test cases
console.log('\n=== DESAFÍO 2: CÓDIGO POSTAL ===');
console.log(validatePostalCode('110111')); // true
console.log(validatePostalCode('050001')); // true
console.log(validatePostalCode('11011')); // false
console.log(validatePostalCode('110111a')); // false

// DESAFÍO 3: Validación de Número de Cédula
// Crear RegExp que valide:
// - Entre 7 y 10 dígitos
// - Solo números
// - Opcionalmente separado por puntos cada 3 dígitos
function validateCedula(cedula) {
  // TODO: Implementar validación de cédula
  // Pista: Usar ^\d{1,3}(\.?\d{3})*$

  const cedulaRegex = /^\d{1,3}(?:\.?\d{3})*$/;
  const digitsOnly = cedula.replace(/\./g, '');
  return (
    cedulaRegex.test(cedula) &&
    digitsOnly.length >= 7 &&
    digitsOnly.length <= 10
  );
}

// Test cases
console.log('\n=== DESAFÍO 3: CÉDULA ===');
console.log(validateCedula('12345678')); // true
console.log(validateCedula('12.345.678')); // true
console.log(validateCedula('1234567890')); // true
console.log(validateCedula('123456')); // false
console.log(validateCedula('12345678901')); // false

// DESAFÍO 4: Validación de Hora (24h)
// Crear RegExp que valide:
// - Formato HH:MM
// - Horas: 00-23
// - Minutos: 00-59
function validateTime(time) {
  // TODO: Implementar validación de hora
  // Pista: Usar ^([01]?[0-9]|2[0-3]):[0-5][0-9]$

  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
}

// Test cases
console.log('\n=== DESAFÍO 4: HORA ===');
console.log(validateTime('14:30')); // true
console.log(validateTime('09:15')); // true
console.log(validateTime('23:59')); // true
console.log(validateTime('24:00')); // false
console.log(validateTime('14:60')); // false

// DESAFÍO 5: Validación de Contraseña Avanzada
// Crear RegExp que valide:
// - Mínimo 12 caracteres
// - Al menos 2 mayúsculas
// - Al menos 2 minúsculas
// - Al menos 2 números
// - Al menos 2 caracteres especiales
function validateAdvancedPassword(password) {
  // TODO: Implementar validación avanzada de contraseña
  // Pista: Usar múltiples lookaheads

  const hasLength = password.length >= 12;
  const hasUppercase = (password.match(/[A-Z]/g) || []).length >= 2;
  const hasLowercase = (password.match(/[a-z]/g) || []).length >= 2;
  const hasNumbers = (password.match(/\d/g) || []).length >= 2;
  const hasSpecial = (password.match(/[@$!%*?&]/g) || []).length >= 2;

  return hasLength && hasUppercase && hasLowercase && hasNumbers && hasSpecial;
}

// Test cases
console.log('\n=== DESAFÍO 5: CONTRASEÑA AVANZADA ===');
console.log(validateAdvancedPassword('MiSuperPassword123!!')); // true
console.log(validateAdvancedPassword('Password123!')); // false
console.log(validateAdvancedPassword('MYCLAVESUPER22@@')); // true

// DESAFÍO 6: Extractor de Información
// Crear función que extraiga información de un texto usando RegExp
function extractInfo(text) {
  // TODO: Implementar extractor de emails, teléfonos y URLs
  // Pista: Usar match() con flag global

  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const phonePattern = /\+?[\d\s\-\(\)]{10,}/g;
  const urlPattern = /https?:\/\/[^\s]+/g;

  return {
    emails: text.match(emailPattern) || [],
    phones: text.match(phonePattern) || [],
    urls: text.match(urlPattern) || [],
  };
}

// Test case
const sampleText = `
Contacta a Juan en juan@empresa.com o llama al +57 300 123 4567.
También puedes visitar https://www.empresa.com o escribir a soporte@empresa.com.
Número alternativo: (301) 456-7890.
`;

console.log('\n=== DESAFÍO 6: EXTRACTOR DE INFORMACIÓN ===');
console.log(extractInfo(sampleText));

// =============================================================================
// 🚀 OPTIMIZACIÓN DE PERFORMANCE
// =============================================================================

console.log('\n' + '='.repeat(50));
console.log('🚀 OPTIMIZACIÓN DE PERFORMANCE');
console.log('='.repeat(50));

// Crear objeto con RegExp compiladas para mejor performance
const ValidationPatterns = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  password:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  phone: /^\+?[\d\s\-\(\)]{10,}$/,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  date: /^(\d{4})-(\d{2})-(\d{2})$/,
  creditCard: /^(\d{4}[\s\-]?){3}\d{4}$/,
};

// Función universal de validación
function validateInput(input, type) {
  const pattern = ValidationPatterns[type];
  if (!pattern) {
    throw new Error(`Tipo de validación no soportado: ${type}`);
  }
  return pattern.test(input);
}

// Test de performance
console.log('\n=== TEST DE PERFORMANCE ===');

const testEmail = 'usuario@dominio.com';
const iterations = 100000;

// Test con RegExp compilada
console.time('RegExp Compilada');
for (let i = 0; i < iterations; i++) {
  ValidationPatterns.email.test(testEmail);
}
console.timeEnd('RegExp Compilada');

// Test con RegExp creada cada vez (menos eficiente)
console.time('RegExp Creada');
for (let i = 0; i < iterations; i++) {
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(testEmail);
}
console.timeEnd('RegExp Creada');

// =============================================================================
// 🎯 PROYECTO FINAL: Sistema de Validación Universal
// =============================================================================

console.log('\n' + '='.repeat(50));
console.log('🎯 PROYECTO FINAL: Sistema de Validación Universal');
console.log('='.repeat(50));

class UniversalValidator {
  constructor() {
    this.patterns = new Map();
    this.customValidators = new Map();

    // Cargar patrones predefinidos
    this.loadDefaultPatterns();
  }

  loadDefaultPatterns() {
    this.patterns.set(
      'email',
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    );
    this.patterns.set(
      'password',
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    );
    this.patterns.set('phone', /^\+?[\d\s\-\(\)]{10,}$/);
    this.patterns.set(
      'url',
      /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/
    );
    this.patterns.set('date', /^(\d{4})-(\d{2})-(\d{2})$/);
    this.patterns.set('creditCard', /^(\d{4}[\s\-]?){3}\d{4}$/);
  }

  addPattern(name, regex) {
    this.patterns.set(name, regex);
  }

  addCustomValidator(name, validatorFunction) {
    this.customValidators.set(name, validatorFunction);
  }

  validate(input, type) {
    // Intentar validador personalizado primero
    if (this.customValidators.has(type)) {
      return this.customValidators.get(type)(input);
    }

    // Usar patrón RegExp
    const pattern = this.patterns.get(type);
    if (!pattern) {
      throw new Error(`Tipo de validación no encontrado: ${type}`);
    }

    return pattern.test(input);
  }

  validateMultiple(data) {
    const results = {};
    const errors = {};

    for (const [field, value] of Object.entries(data)) {
      try {
        results[field] = this.validate(value.input, value.type);
        if (!results[field]) {
          errors[field] = `Formato inválido para ${field}`;
        }
      } catch (error) {
        errors[field] = error.message;
      }
    }

    return { results, errors, isValid: Object.keys(errors).length === 0 };
  }
}

// Uso del sistema universal
const validator = new UniversalValidator();

// Agregar validador personalizado
validator.addCustomValidator('cedula', cedula => {
  const cedulaRegex = /^\d{1,3}(?:\.?\d{3})*$/;
  const digitsOnly = cedula.replace(/\./g, '');
  return (
    cedulaRegex.test(cedula) &&
    digitsOnly.length >= 7 &&
    digitsOnly.length <= 10
  );
});

// Test del sistema
const testData = {
  email: { input: 'usuario@dominio.com', type: 'email' },
  password: { input: 'MiPassword123!', type: 'password' },
  phone: { input: '+57 300 123 4567', type: 'phone' },
  cedula: { input: '12.345.678', type: 'cedula' },
};

console.log('\n=== PRUEBA DEL SISTEMA UNIVERSAL ===');
const validationResult = validator.validateMultiple(testData);
console.log('Resultados:', validationResult.results);
console.log('Errores:', validationResult.errors);
console.log('Es válido:', validationResult.isValid);

// =============================================================================
// 📋 RESUMEN Y MEJORES PRÁCTICAS
// =============================================================================

console.log('\n' + '='.repeat(50));
console.log('📋 RESUMEN Y MEJORES PRÁCTICAS');
console.log('='.repeat(50));

/**
 * MEJORES PRÁCTICAS PARA REGEXP:
 *
 * 1. Compilar RegExp una sola vez y reutilizar
 * 2. Usar caracteres específicos en lugar de genéricos cuando sea posible
 * 3. Evitar quantifiers anidados que pueden causar backtracking
 * 4. Usar ^ y $ para validaciones completas
 * 5. Testear con casos extremos y entradas maliciosas
 * 6. Documentar RegExp complejas
 * 7. Considerar alternativas más legibles para lógica compleja
 * 8. Validar tanto en frontend como backend
 */

console.log(`
🎯 REGEXP MASTERY COMPLETADO!

Has dominado:
✅ Sintaxis avanzada de Regular Expressions
✅ Validaciones complejas y eficientes
✅ Optimización de performance
✅ Sistema universal de validación
✅ Mejores prácticas de seguridad

Siguiente paso: Implementar estas validaciones en formularios reales!
`);

// =============================================================================
// 🧪 TESTING Y VERIFICACIÓN
// =============================================================================

// Función para ejecutar todos los tests
function runAllTests() {
  console.log('\n' + '='.repeat(50));
  console.log('🧪 EJECUTANDO TODOS LOS TESTS');
  console.log('='.repeat(50));

  const tests = [
    {
      name: 'Email',
      func: validateEmail,
      input: 'test@example.com',
      expected: true,
    },
    {
      name: 'Password',
      func: validatePassword,
      input: 'Password123!',
      expected: true,
    },
    {
      name: 'Phone',
      func: validatePhone,
      input: '+57 300 123 4567',
      expected: true,
    },
    {
      name: 'URL',
      func: validateURL,
      input: 'https://www.example.com',
      expected: true,
    },
    { name: 'Date', func: validateDate, input: '2024-12-25', expected: true },
    {
      name: 'Credit Card',
      func: validateCreditCard,
      input: '1234 5678 9012 3456',
      expected: true,
    },
    {
      name: 'Full Name',
      func: validateFullName,
      input: 'Juan Pérez',
      expected: true,
    },
    {
      name: 'Postal Code',
      func: validatePostalCode,
      input: '110111',
      expected: true,
    },
    {
      name: 'Cedula',
      func: validateCedula,
      input: '12.345.678',
      expected: true,
    },
    { name: 'Time', func: validateTime, input: '14:30', expected: true },
  ];

  let passed = 0;
  let failed = 0;

  tests.forEach(test => {
    const result = test.func(test.input);
    if (result === test.expected) {
      console.log(`✅ ${test.name}: PASSED`);
      passed++;
    } else {
      console.log(
        `❌ ${test.name}: FAILED - Expected ${test.expected}, got ${result}`
      );
      failed++;
    }
  });

  console.log(`\n📊 RESULTADOS: ${passed} passed, ${failed} failed`);
  console.log(
    failed === 0
      ? '🎉 ¡TODOS LOS TESTS PASARON!'
      : '⚠️ Revisa los tests fallidos'
  );
}

// Ejecutar todos los tests
runAllTests();

/**
 * 🎯 EJERCICIO COMPLETADO
 *
 * Has completado con éxito el Ejercicio 1: RegExp Mastery
 *
 * Habilidades desarrolladas:
 * - Sintaxis avanzada de Regular Expressions
 * - Validaciones complejas y eficientes
 * - Optimización de performance
 * - Sistema universal de validación
 * - Testing y verificación
 *
 * Siguiente paso: Proceder con el Ejercicio 2 (Form Validation)
 */
