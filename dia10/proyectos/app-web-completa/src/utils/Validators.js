/**
 * VALIDADORES - Validación de Datos
 *
 * Sistema de validación flexible para formularios y datos
 * con reglas personalizables y mensajes de error
 *
 * Características ES6+:
 * - Clases ES6 con métodos estáticos
 * - Map para almacenar validadores
 * - RegExp para validaciones de patrones
 * - Destructuring en parámetros
 * - Template literals para mensajes
 * - Arrow functions para validadores
 * - Spread operator para reglas
 */

export class Validator {
  constructor() {
    // Map de validadores personalizados
    this.customValidators = new Map();

    // Configuración por defecto
    this.config = {
      language: 'es',
      stopOnFirstError: false,
      trimStrings: true,
    };

    // Registrar validadores base
    this.registerBaseValidators();
  }

  /**
   * Registra validadores base
   */
  registerBaseValidators() {
    // Validador requerido
    this.customValidators.set('required', (value, options = true) => {
      if (!options) return true;

      if (value === null || value === undefined) {
        return 'Este campo es requerido';
      }

      if (typeof value === 'string' && value.trim() === '') {
        return 'Este campo es requerido';
      }

      if (Array.isArray(value) && value.length === 0) {
        return 'Este campo es requerido';
      }

      return true;
    });

    // Validador de longitud mínima
    this.customValidators.set('minLength', (value, minLength) => {
      if (value === null || value === undefined) return true;

      const length =
        typeof value === 'string' ? value.length : String(value).length;

      if (length < minLength) {
        return `Debe tener al menos ${minLength} caracteres`;
      }

      return true;
    });

    // Validador de longitud máxima
    this.customValidators.set('maxLength', (value, maxLength) => {
      if (value === null || value === undefined) return true;

      const length =
        typeof value === 'string' ? value.length : String(value).length;

      if (length > maxLength) {
        return `No puede tener más de ${maxLength} caracteres`;
      }

      return true;
    });

    // Validador de valor mínimo
    this.customValidators.set('min', (value, min) => {
      if (value === null || value === undefined) return true;

      const numValue = Number(value);

      if (isNaN(numValue) || numValue < min) {
        return `El valor debe ser mayor o igual a ${min}`;
      }

      return true;
    });

    // Validador de valor máximo
    this.customValidators.set('max', (value, max) => {
      if (value === null || value === undefined) return true;

      const numValue = Number(value);

      if (isNaN(numValue) || numValue > max) {
        return `El valor debe ser menor o igual a ${max}`;
      }

      return true;
    });

    // Validador de patrón
    this.customValidators.set('pattern', (value, pattern) => {
      if (value === null || value === undefined) return true;

      const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;

      if (!regex.test(String(value))) {
        return 'El formato no es válido';
      }

      return true;
    });

    // Validador de email
    this.customValidators.set('email', value => {
      if (value === null || value === undefined) return true;

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(String(value))) {
        return 'El email no es válido';
      }

      return true;
    });

    // Validador de URL
    this.customValidators.set('url', value => {
      if (value === null || value === undefined) return true;

      try {
        new URL(value);
        return true;
      } catch {
        return 'La URL no es válida';
      }
    });

    // Validador de número
    this.customValidators.set('number', value => {
      if (value === null || value === undefined) return true;

      if (isNaN(Number(value))) {
        return 'Debe ser un número válido';
      }

      return true;
    });

    // Validador de entero
    this.customValidators.set('integer', value => {
      if (value === null || value === undefined) return true;

      const numValue = Number(value);

      if (isNaN(numValue) || !Number.isInteger(numValue)) {
        return 'Debe ser un número entero';
      }

      return true;
    });

    // Validador de fecha
    this.customValidators.set('date', value => {
      if (value === null || value === undefined) return true;

      const date = new Date(value);

      if (isNaN(date.getTime())) {
        return 'Debe ser una fecha válida';
      }

      return true;
    });

    // Validador de confirmación
    this.customValidators.set('confirm', (value, targetField, allValues) => {
      if (value === null || value === undefined) return true;

      const targetValue = allValues[targetField];

      if (value !== targetValue) {
        return 'Los valores no coinciden';
      }

      return true;
    });

    // Validador de opciones
    this.customValidators.set('in', (value, options) => {
      if (value === null || value === undefined) return true;

      if (!options.includes(value)) {
        return `Debe ser uno de: ${options.join(', ')}`;
      }

      return true;
    });

    // Validador de exclusión
    this.customValidators.set('notIn', (value, options) => {
      if (value === null || value === undefined) return true;

      if (options.includes(value)) {
        return `No puede ser: ${options.join(', ')}`;
      }

      return true;
    });

    // Validador de función personalizada
    this.customValidators.set('custom', (value, validator) => {
      if (typeof validator !== 'function') {
        throw new Error('Custom validator must be a function');
      }

      return validator(value);
    });
  }

  /**
   * Valida un valor contra un conjunto de reglas
   */
  validate(value, rules = {}, allValues = {}) {
    const errors = [];

    // Procesar valor
    let processedValue = value;

    if (this.config.trimStrings && typeof value === 'string') {
      processedValue = value.trim();
    }

    // Aplicar validadores
    for (const [ruleName, ruleValue] of Object.entries(rules)) {
      const validator = this.customValidators.get(ruleName);

      if (!validator) {
        console.warn(`Validator "${ruleName}" not found`);
        continue;
      }

      try {
        const result = validator(processedValue, ruleValue, allValues);

        if (result !== true) {
          errors.push(result);

          if (this.config.stopOnFirstError) {
            break;
          }
        }
      } catch (error) {
        errors.push(`Error en validación: ${error.message}`);
      }
    }

    return errors;
  }

  /**
   * Valida un objeto completo
   */
  validateObject(data, schema) {
    const errors = {};
    let hasErrors = false;

    // Validar cada campo
    for (const [fieldName, fieldRules] of Object.entries(schema)) {
      const fieldValue = data[fieldName];
      const fieldErrors = this.validate(fieldValue, fieldRules, data);

      if (fieldErrors.length > 0) {
        errors[fieldName] = fieldErrors;
        hasErrors = true;
      }
    }

    return {
      isValid: !hasErrors,
      errors,
      data: hasErrors ? null : data,
    };
  }

  /**
   * Registra un validador personalizado
   */
  register(name, validator) {
    if (typeof validator !== 'function') {
      throw new Error('Validator must be a function');
    }

    this.customValidators.set(name, validator);
  }

  /**
   * Remueve un validador
   */
  unregister(name) {
    this.customValidators.delete(name);
  }

  /**
   * Obtiene lista de validadores disponibles
   */
  getValidators() {
    return Array.from(this.customValidators.keys());
  }

  /**
   * Configura el validador
   */
  configure(options) {
    this.config = { ...this.config, ...options };
  }
}

/**
 * Instancia global del validador
 */
const validator = new Validator();

/**
 * Función conveniente para validar productos
 */
export function validateProduct(product, isCreating = true) {
  const schema = {
    name: {
      required: true,
      minLength: 3,
      maxLength: 100,
      pattern: /^[a-zA-Z0-9\s\-_.áéíóúüñ]+$/,
    },
    price: {
      required: true,
      number: true,
      min: 0,
    },
    stock: {
      required: true,
      integer: true,
      min: 0,
    },
    category: {
      required: true,
      in: ['electronics', 'clothing', 'books', 'home', 'sports'],
    },
    description: {
      maxLength: 500,
    },
    imageUrl: {
      url: true,
    },
    status: {
      in: ['active', 'inactive'],
    },
  };

  // Si es actualización, hacer campos opcionales
  if (!isCreating) {
    Object.keys(schema).forEach(key => {
      if (schema[key].required && product[key] === undefined) {
        delete schema[key].required;
      }
    });
  }

  const result = validator.validateObject(product, schema);

  // Retornar solo errores como array para compatibilidad
  const errors = [];

  for (const [field, fieldErrors] of Object.entries(result.errors || {})) {
    errors.push(...fieldErrors.map(error => `${field}: ${error}`));
  }

  return errors;
}

/**
 * Función conveniente para validar usuarios
 */
export function validateUser(user, isCreating = true) {
  const schema = {
    name: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-Z\s]+$/,
    },
    email: {
      required: true,
      email: true,
    },
    password: {
      required: isCreating,
      minLength: 8,
      pattern:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    },
    confirmPassword: {
      required: isCreating && user.password,
      confirm: 'password',
    },
    phone: {
      pattern: /^\+?[\d\s\-\(\)]+$/,
    },
    age: {
      integer: true,
      min: 13,
      max: 120,
    },
  };

  const result = validator.validateObject(user, schema);

  const errors = [];

  for (const [field, fieldErrors] of Object.entries(result.errors || {})) {
    errors.push(...fieldErrors.map(error => `${field}: ${error}`));
  }

  return errors;
}

/**
 * Validadores específicos para formularios
 */
export const FormValidators = {
  /**
   * Validador de contraseña fuerte
   */
  strongPassword: value => {
    if (!value) return true;

    const checks = [
      { test: value.length >= 8, message: 'Mínimo 8 caracteres' },
      { test: /[a-z]/.test(value), message: 'Al menos una minúscula' },
      { test: /[A-Z]/.test(value), message: 'Al menos una mayúscula' },
      { test: /\d/.test(value), message: 'Al menos un número' },
      {
        test: /[@$!%*?&]/.test(value),
        message: 'Al menos un carácter especial',
      },
    ];

    const failures = checks.filter(check => !check.test);

    if (failures.length > 0) {
      return failures.map(f => f.message).join(', ');
    }

    return true;
  },

  /**
   * Validador de tarjeta de crédito
   */
  creditCard: value => {
    if (!value) return true;

    // Algoritmo de Luhn
    const number = value.replace(/\D/g, '');

    if (number.length < 13 || number.length > 19) {
      return 'Número de tarjeta inválido';
    }

    let sum = 0;
    let alternate = false;

    for (let i = number.length - 1; i >= 0; i--) {
      let digit = parseInt(number[i]);

      if (alternate) {
        digit *= 2;
        if (digit > 9) digit = (digit % 10) + 1;
      }

      sum += digit;
      alternate = !alternate;
    }

    return sum % 10 === 0 ? true : 'Número de tarjeta inválido';
  },

  /**
   * Validador de código postal
   */
  postalCode: (value, country = 'US') => {
    if (!value) return true;

    const patterns = {
      US: /^\d{5}(-\d{4})?$/,
      CA: /^[A-Z]\d[A-Z] \d[A-Z]\d$/,
      UK: /^[A-Z]{1,2}\d[A-Z\d]? \d[A-Z]{2}$/,
      ES: /^\d{5}$/,
      FR: /^\d{5}$/,
      DE: /^\d{5}$/,
    };

    const pattern = patterns[country.toUpperCase()];

    if (!pattern) {
      return 'País no soportado';
    }

    return pattern.test(value) ? true : 'Código postal inválido';
  },

  /**
   * Validador de archivo
   */
  file: (file, options = {}) => {
    if (!file) return true;

    const {
      maxSize = 5 * 1024 * 1024, // 5MB
      allowedTypes = ['image/jpeg', 'image/png', 'image/gif'],
      allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'],
    } = options;

    // Validar tamaño
    if (file.size > maxSize) {
      return `El archivo es demasiado grande. Máximo: ${Math.round(
        maxSize / 1024 / 1024
      )}MB`;
    }

    // Validar tipo
    if (!allowedTypes.includes(file.type)) {
      return `Tipo de archivo no permitido. Permitidos: ${allowedTypes.join(
        ', '
      )}`;
    }

    // Validar extensión
    const extension = '.' + file.name.split('.').pop().toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      return `Extensión no permitida. Permitidas: ${allowedExtensions.join(
        ', '
      )}`;
    }

    return true;
  },
};

/**
 * Registrar validadores adicionales
 */
validator.register('strongPassword', FormValidators.strongPassword);
validator.register('creditCard', FormValidators.creditCard);
validator.register('postalCode', FormValidators.postalCode);
validator.register('file', FormValidators.file);

/**
 * Función para validación en tiempo real
 */
export function createRealTimeValidator(schema) {
  return (fieldName, value, allValues = {}) => {
    const fieldRules = schema[fieldName];

    if (!fieldRules) {
      return [];
    }

    return validator.validate(value, fieldRules, allValues);
  };
}

/**
 * Función para validación condicional
 */
export function conditionalValidator(condition, rules) {
  return (value, _, allValues) => {
    const shouldValidate =
      typeof condition === 'function' ? condition(value, allValues) : condition;

    if (!shouldValidate) {
      return true;
    }

    return validator.validate(value, rules, allValues);
  };
}

/**
 * Exportar instancia del validador
 */
export { validator };
export default validator;

/* 
📚 NOTAS PEDAGÓGICAS:

1. **Map**: Para almacenar validadores dinámicos
2. **RegExp**: Para validaciones de patrones
3. **Template Literals**: Para mensajes de error dinámicos
4. **Destructuring**: En parámetros y configuración
5. **Spread Operator**: Para combinar reglas
6. **Arrow Functions**: Para validadores concisos
7. **Error Handling**: Manejo robusto de errores
8. **Functional Programming**: Validadores como funciones puras
9. **Composition**: Combinación de validadores
10. **Internationalization**: Soporte para múltiples idiomas

🎯 EJERCICIOS SUGERIDOS:
- Implementar validación asíncrona
- Agregar soporte para i18n completo
- Crear validadores para tipos de datos complejos
- Implementar validación cross-field avanzada
*/
