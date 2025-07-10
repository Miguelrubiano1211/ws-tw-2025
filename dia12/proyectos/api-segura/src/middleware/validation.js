// middleware/validation.js
// Middleware de validación de entrada

const { validationResult, body, param, query } = require('express-validator');
const {
  sanitizeInput,
  validateEmail,
  validatePassword,
} = require('../utils/validation');

/**
 * Middleware de validación
 * - Validación de tipos de datos
 * - Sanitización de entrada
 * - Validaciones personalizadas
 * - Manejo de errores de validación
 */

/**
 * Middleware para validar entrada usando express-validator
 * @param {Array} validations - Array de validaciones
 * @returns {Function} - Middleware function
 */
const validateInput = validations => {
  const validators = validations.map(validation => {
    const { field, type, required, min, max, custom } = validation;

    let validator;

    // Determinar el tipo de validador
    if (validation.in === 'params') {
      validator = param(field);
    } else if (validation.in === 'query') {
      validator = query(field);
    } else {
      validator = body(field);
    }

    // Aplicar validaciones según el tipo
    switch (type) {
      case 'string':
        validator = validator
          .isString()
          .withMessage(`${field} debe ser un string`);
        if (required) {
          validator = validator.notEmpty().withMessage(`${field} es requerido`);
        }
        if (min) {
          validator = validator
            .isLength({ min })
            .withMessage(`${field} debe tener al menos ${min} caracteres`);
        }
        if (max) {
          validator = validator
            .isLength({ max })
            .withMessage(`${field} no puede exceder ${max} caracteres`);
        }
        validator = validator.trim().escape();
        break;

      case 'email':
        validator = validator
          .isEmail()
          .withMessage(`${field} debe ser un email válido`);
        if (required) {
          validator = validator.notEmpty().withMessage(`${field} es requerido`);
        }
        validator = validator.normalizeEmail();
        break;

      case 'password':
        validator = validator
          .isString()
          .withMessage(`${field} debe ser un string`);
        if (required) {
          validator = validator.notEmpty().withMessage(`${field} es requerido`);
        }
        validator = validator
          .isLength({ min: 8 })
          .withMessage(`${field} debe tener al menos 8 caracteres`);
        validator = validator
          .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
          )
          .withMessage(
            `${field} debe contener al menos: 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial`
          );
        break;

      case 'number':
        validator = validator
          .isNumeric()
          .withMessage(`${field} debe ser un número`);
        if (required) {
          validator = validator.notEmpty().withMessage(`${field} es requerido`);
        }
        if (min !== undefined) {
          validator = validator
            .isFloat({ min })
            .withMessage(`${field} debe ser mayor o igual a ${min}`);
        }
        if (max !== undefined) {
          validator = validator
            .isFloat({ max })
            .withMessage(`${field} debe ser menor o igual a ${max}`);
        }
        validator = validator.toFloat();
        break;

      case 'integer':
        validator = validator
          .isInt()
          .withMessage(`${field} debe ser un entero`);
        if (required) {
          validator = validator.notEmpty().withMessage(`${field} es requerido`);
        }
        if (min !== undefined) {
          validator = validator
            .isInt({ min })
            .withMessage(`${field} debe ser mayor o igual a ${min}`);
        }
        if (max !== undefined) {
          validator = validator
            .isInt({ max })
            .withMessage(`${field} debe ser menor o igual a ${max}`);
        }
        validator = validator.toInt();
        break;

      case 'boolean':
        validator = validator
          .isBoolean()
          .withMessage(`${field} debe ser un booleano`);
        validator = validator.toBoolean();
        break;

      case 'array':
        validator = validator
          .isArray()
          .withMessage(`${field} debe ser un array`);
        if (min !== undefined) {
          validator = validator
            .isArray({ min })
            .withMessage(`${field} debe tener al menos ${min} elementos`);
        }
        if (max !== undefined) {
          validator = validator
            .isArray({ max })
            .withMessage(`${field} no puede tener más de ${max} elementos`);
        }
        break;

      case 'url':
        validator = validator
          .isURL()
          .withMessage(`${field} debe ser una URL válida`);
        if (required) {
          validator = validator.notEmpty().withMessage(`${field} es requerido`);
        }
        break;

      case 'date':
        validator = validator
          .isISO8601()
          .withMessage(`${field} debe ser una fecha válida`);
        if (required) {
          validator = validator.notEmpty().withMessage(`${field} es requerido`);
        }
        validator = validator.toDate();
        break;

      default:
        // Validación genérica
        if (required) {
          validator = validator.notEmpty().withMessage(`${field} es requerido`);
        }
    }

    // Aplicar validación personalizada si existe
    if (custom) {
      validator = validator.custom(custom);
    }

    return validator;
  });

  return [
    ...validators,
    (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Datos inválidos',
          message: 'Los datos proporcionados no son válidos',
          errors: errors.array().map(error => ({
            field: error.param,
            message: error.msg,
            value: error.value,
          })),
        });
      }

      next();
    },
  ];
};

/**
 * Middleware para sanitizar entrada manualmente
 * @param {Array} fields - Campos a sanitizar
 * @returns {Function} - Middleware function
 */
const sanitizeFields = fields => {
  return (req, res, next) => {
    fields.forEach(field => {
      if (req.body[field]) {
        req.body[field] = sanitizeInput(req.body[field]);
      }
      if (req.params[field]) {
        req.params[field] = sanitizeInput(req.params[field]);
      }
      if (req.query[field]) {
        req.query[field] = sanitizeInput(req.query[field]);
      }
    });

    next();
  };
};

/**
 * Middleware para validar paginación
 * @param {Object} options - Opciones de paginación
 * @returns {Function} - Middleware function
 */
const validatePagination = (options = {}) => {
  const { maxLimit = 50, defaultLimit = 10, defaultPage = 1 } = options;

  return (req, res, next) => {
    // Validar y sanitizar página
    let page = parseInt(req.query.page) || defaultPage;
    page = Math.max(1, page);
    req.query.page = page;

    // Validar y sanitizar límite
    let limit = parseInt(req.query.limit) || defaultLimit;
    limit = Math.max(1, Math.min(maxLimit, limit));
    req.query.limit = limit;

    // Validar ordenamiento
    if (req.query.sortBy) {
      req.query.sortBy = sanitizeInput(req.query.sortBy);
    }

    if (req.query.sortOrder) {
      const validOrder = ['ASC', 'DESC'];
      req.query.sortOrder = validOrder.includes(
        req.query.sortOrder.toUpperCase()
      )
        ? req.query.sortOrder.toUpperCase()
        : 'DESC';
    }

    next();
  };
};

/**
 * Middleware para validar IDs en parámetros
 * @param {Array} paramNames - Nombres de parámetros que deben ser IDs
 * @returns {Function} - Middleware function
 */
const validateIds = paramNames => {
  return (req, res, next) => {
    const errors = [];

    paramNames.forEach(paramName => {
      const value = req.params[paramName];

      if (!value) {
        errors.push(`${paramName} es requerido`);
      } else if (isNaN(value) || parseInt(value) <= 0) {
        errors.push(`${paramName} debe ser un número entero positivo`);
      } else {
        req.params[paramName] = parseInt(value);
      }
    });

    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Parámetros inválidos',
        message: 'Los parámetros proporcionados no son válidos',
        errors: errors,
      });
    }

    next();
  };
};

/**
 * Middleware para validar tipos de archivos
 * @param {Array} allowedTypes - Tipos de archivos permitidos
 * @returns {Function} - Middleware function
 */
const validateFileTypes = allowedTypes => {
  return (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return next();
    }

    const errors = [];

    Object.keys(req.files).forEach(fieldName => {
      const file = req.files[fieldName];
      const fileType = file.mimetype;

      if (!allowedTypes.includes(fileType)) {
        errors.push(
          `${fieldName}: Tipo de archivo no permitido. Tipos permitidos: ${allowedTypes.join(
            ', '
          )}`
        );
      }
    });

    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Archivos inválidos',
        message: 'Los archivos proporcionados no son válidos',
        errors: errors,
      });
    }

    next();
  };
};

/**
 * Middleware para validar límites de tamaño de archivos
 * @param {number} maxSize - Tamaño máximo en bytes
 * @returns {Function} - Middleware function
 */
const validateFileSize = maxSize => {
  return (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return next();
    }

    const errors = [];

    Object.keys(req.files).forEach(fieldName => {
      const file = req.files[fieldName];

      if (file.size > maxSize) {
        errors.push(
          `${fieldName}: Archivo muy grande. Tamaño máximo: ${Math.round(
            maxSize / 1024 / 1024
          )}MB`
        );
      }
    });

    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Archivos muy grandes',
        message: 'Los archivos exceden el tamaño máximo permitido',
        errors: errors,
      });
    }

    next();
  };
};

/**
 * Middleware para validar JSON
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware
 */
const validateJSON = (req, res, next) => {
  if (req.is('application/json')) {
    try {
      if (typeof req.body === 'string') {
        req.body = JSON.parse(req.body);
      }
    } catch (error) {
      return res.status(400).json({
        error: 'JSON inválido',
        message: 'El formato JSON no es válido',
      });
    }
  }

  next();
};

module.exports = {
  validateInput,
  sanitizeFields,
  validatePagination,
  validateIds,
  validateFileTypes,
  validateFileSize,
  validateJSON,
};
