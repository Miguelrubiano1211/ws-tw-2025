/**
 * 🔐 Ejercicio 06: Input Validation y Sanitization
 *
 * Conceptos fundamentales:
 * - Validación: Verificar que los datos cumplan criterios
 * - Sanitización: Limpiar y normalizar datos de entrada
 * - XSS Prevention: Prevenir Cross-Site Scripting
 * - Injection Prevention: Prevenir inyecciones maliciosas
 *
 * Objetivos:
 * - Implementar validación robusta con Joi
 * - Sanitizar datos con express-validator
 * - Prevenir ataques XSS y de inyección
 * - Crear middleware de validación reutilizable
 */

const express = require('express');
const Joi = require('joi');
const { body, validationResult, param, query } = require('express-validator');
const validator = require('validator');
const DOMPurify = require('isomorphic-dompurify');
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Estadísticas de validación
const estadisticasValidacion = {
  requestsValidadas: 0,
  erroresValidacion: 0,
  intentosXSS: 0,
  datosSanitizados: 0,
};

// 1. VALIDACIÓN CON JOI

/**
 * Esquemas de validación con Joi
 */
const esquemas = {
  usuario: Joi.object({
    nombre: Joi.string()
      .min(2)
      .max(50)
      .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      .required()
      .messages({
        'string.min': 'El nombre debe tener al menos 2 caracteres',
        'string.max': 'El nombre no puede exceder 50 caracteres',
        'string.pattern.base':
          'El nombre solo puede contener letras y espacios',
        'any.required': 'El nombre es requerido',
      }),

    email: Joi.string().email().lowercase().required().messages({
      'string.email': 'Debe ser un email válido',
      'any.required': 'El email es requerido',
    }),

    edad: Joi.number().integer().min(13).max(120).required().messages({
      'number.min': 'La edad mínima es 13 años',
      'number.max': 'La edad máxima es 120 años',
      'any.required': 'La edad es requerida',
    }),

    password: Joi.string()
      .min(8)
      .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
      )
      .required()
      .messages({
        'string.min': 'El password debe tener al menos 8 caracteres',
        'string.pattern.base':
          'El password debe contener al menos: 1 minúscula, 1 mayúscula, 1 número y 1 símbolo',
        'any.required': 'El password es requerido',
      }),

    telefono: Joi.string()
      .pattern(/^[0-9+\-\s()]+$/)
      .min(10)
      .max(15)
      .optional()
      .messages({
        'string.pattern.base':
          'El teléfono solo puede contener números, espacios y símbolos +, -, (, )',
        'string.min': 'El teléfono debe tener al menos 10 caracteres',
        'string.max': 'El teléfono no puede exceder 15 caracteres',
      }),

    website: Joi.string()
      .uri({ scheme: ['http', 'https'] })
      .optional()
      .messages({
        'string.uri': 'Debe ser una URL válida (http o https)',
      }),

    biografia: Joi.string().max(500).optional().messages({
      'string.max': 'La biografía no puede exceder 500 caracteres',
    }),

    fechaNacimiento: Joi.date()
      .max('now')
      .min('1900-01-01')
      .optional()
      .messages({
        'date.max': 'La fecha de nacimiento no puede ser futura',
        'date.min': 'La fecha de nacimiento no puede ser anterior a 1900',
      }),
  }),

  producto: Joi.object({
    nombre: Joi.string().min(3).max(100).required(),

    precio: Joi.number().positive().precision(2).max(999999.99).required(),

    categoria: Joi.string()
      .valid('electronica', 'ropa', 'hogar', 'deportes', 'libros')
      .required(),

    descripcion: Joi.string().max(1000).optional(),

    tags: Joi.array().items(Joi.string().min(2).max(20)).max(5).optional(),
  }),
};

/**
 * Middleware de validación con Joi
 */
const validarConJoi = esquema => {
  return (req, res, next) => {
    const { error, value } = esquema.validate(req.body, {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true,
    });

    if (error) {
      estadisticasValidacion.erroresValidacion++;

      const errores = error.details.map(detail => ({
        campo: detail.path.join('.'),
        mensaje: detail.message,
        valorRecibido: detail.context.value,
      }));

      console.log(`❌ Validación Joi fallida: ${errores.length} errores`);

      return res.status(400).json({
        error: 'Datos de entrada inválidos',
        errores,
        timestamp: new Date(),
      });
    }

    // Reemplazar body con valores validados y sanitizados
    req.body = value;
    estadisticasValidacion.requestsValidadas++;

    console.log(`✅ Validación Joi exitosa`);
    next();
  };
};

// 2. VALIDACIÓN CON EXPRESS-VALIDATOR

/**
 * Validaciones con express-validator
 */
const validacionesUsuario = [
  body('nombre')
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El nombre solo puede contener letras y espacios')
    .trim()
    .escape(),

  body('email')
    .isEmail()
    .withMessage('Debe ser un email válido')
    .normalizeEmail()
    .custom(async value => {
      // Validación personalizada - verificar dominio
      const dominiosPermitidos = [
        'gmail.com',
        'hotmail.com',
        'outlook.com',
        'yahoo.com',
      ];
      const dominio = value.split('@')[1];

      if (!dominiosPermitidos.includes(dominio)) {
        throw new Error('El dominio del email no está permitido');
      }

      return true;
    }),

  body('edad')
    .isInt({ min: 13, max: 120 })
    .withMessage('La edad debe ser un número entero entre 13 y 120')
    .toInt(),

  body('password')
    .isLength({ min: 8 })
    .withMessage('El password debe tener al menos 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .withMessage(
      'El password debe contener al menos: 1 minúscula, 1 mayúscula, 1 número y 1 símbolo'
    ),

  body('telefono')
    .optional()
    .isMobilePhone('es-CO')
    .withMessage('El teléfono debe ser válido para Colombia'),

  body('website')
    .optional()
    .isURL({ protocols: ['http', 'https'] })
    .withMessage('Debe ser una URL válida'),

  body('biografia')
    .optional()
    .isLength({ max: 500 })
    .withMessage('La biografía no puede exceder 500 caracteres')
    .trim()
    .escape(),
];

/**
 * Middleware para manejar errores de express-validator
 */
const manejarErroresValidacion = (req, res, next) => {
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    estadisticasValidacion.erroresValidacion++;

    const erroresFormateados = errores.array().map(error => ({
      campo: error.path,
      mensaje: error.msg,
      valorRecibido: error.value,
    }));

    console.log(
      `❌ Validación express-validator fallida: ${erroresFormateados.length} errores`
    );

    return res.status(400).json({
      error: 'Datos de entrada inválidos',
      errores: erroresFormateados,
      timestamp: new Date(),
    });
  }

  estadisticasValidacion.requestsValidadas++;
  console.log(`✅ Validación express-validator exitosa`);
  next();
};

// 3. SANITIZACIÓN AVANZADA

/**
 * Middleware de sanitización personalizada
 */
const sanitizarDatos = (req, res, next) => {
  const datosOriginales = JSON.stringify(req.body);

  // Función recursiva para sanitizar objeto
  const sanitizarObjeto = obj => {
    if (typeof obj === 'string') {
      // Sanitizar strings
      let valor = obj;

      // Detectar posibles ataques XSS
      if (/<script|javascript:|onload|onerror|onclick/i.test(valor)) {
        estadisticasValidacion.intentosXSS++;
        console.log(`🚨 Intento XSS detectado: ${valor}`);
      }

      // Limpiar HTML y scripts
      valor = DOMPurify.sanitize(valor, {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
      });

      // Escapar caracteres especiales
      valor = validator.escape(valor);

      // Normalizar espacios
      valor = valor.replace(/\s+/g, ' ').trim();

      return valor;
    } else if (Array.isArray(obj)) {
      return obj.map(sanitizarObjeto);
    } else if (typeof obj === 'object' && obj !== null) {
      const objetoSanitizado = {};
      for (const [clave, valor] of Object.entries(obj)) {
        objetoSanitizado[clave] = sanitizarObjeto(valor);
      }
      return objetoSanitizado;
    }

    return obj;
  };

  req.body = sanitizarObjeto(req.body);

  if (datosOriginales !== JSON.stringify(req.body)) {
    estadisticasValidacion.datosSanitizados++;
    console.log(`🧹 Datos sanitizados`);
  }

  next();
};

// 4. VALIDACIÓN DE PARÁMETROS Y QUERY

/**
 * Validación de parámetros de URL
 */
const validarParametros = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID debe ser un número entero positivo')
    .toInt(),

  param('slug')
    .isSlug()
    .withMessage('El slug debe ser válido (solo letras, números y guiones)')
    .isLength({ min: 3, max: 50 })
    .withMessage('El slug debe tener entre 3 y 50 caracteres'),
];

/**
 * Validación de query parameters
 */
const validarQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La página debe ser un número entero positivo')
    .toInt(),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('El límite debe ser un número entre 1 y 100')
    .toInt(),

  query('sort')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('El orden debe ser "asc" o "desc"'),

  query('search')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('La búsqueda debe tener entre 1 y 100 caracteres')
    .trim()
    .escape(),
];

// 5. VALIDACIÓN DE ARCHIVOS

/**
 * Validación de uploads (simulado)
 */
const validarArchivo = (req, res, next) => {
  const archivo = req.body.archivo; // En realidad sería req.file con multer

  if (!archivo) {
    return res.status(400).json({
      error: 'Archivo requerido',
      mensaje: 'Debe proporcionar un archivo',
    });
  }

  // Validar tipo de archivo
  const tiposPermitidos = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
  ];
  if (!tiposPermitidos.includes(archivo.mimetype)) {
    return res.status(400).json({
      error: 'Tipo de archivo no permitido',
      mensaje: 'Solo se permiten imágenes (JPEG, PNG, GIF) y PDF',
      tipoRecibido: archivo.mimetype,
    });
  }

  // Validar tamaño (5MB máximo)
  const tamanioMaximo = 5 * 1024 * 1024; // 5MB
  if (archivo.size > tamanioMaximo) {
    return res.status(400).json({
      error: 'Archivo muy grande',
      mensaje: 'El archivo no puede exceder 5MB',
      tamanioRecibido: `${(archivo.size / 1024 / 1024).toFixed(2)}MB`,
    });
  }

  // Validar nombre del archivo
  if (!/^[a-zA-Z0-9._-]+$/.test(archivo.filename)) {
    return res.status(400).json({
      error: 'Nombre de archivo inválido',
      mensaje:
        'El nombre solo puede contener letras, números, puntos, guiones y guiones bajos',
    });
  }

  next();
};

// 6. RUTAS CON VALIDACIÓN

/**
 * Ruta para crear usuario con Joi
 */
app.post(
  '/usuarios/joi',
  sanitizarDatos,
  validarConJoi(esquemas.usuario),
  (req, res) => {
    res.json({
      mensaje: 'Usuario creado exitosamente con validación Joi',
      usuario: req.body,
      timestamp: new Date(),
    });
  }
);

/**
 * Ruta para crear usuario con express-validator
 */
app.post(
  '/usuarios/validator',
  sanitizarDatos,
  validacionesUsuario,
  manejarErroresValidacion,
  (req, res) => {
    res.json({
      mensaje: 'Usuario creado exitosamente con express-validator',
      usuario: req.body,
      timestamp: new Date(),
    });
  }
);

/**
 * Ruta para crear producto
 */
app.post(
  '/productos',
  sanitizarDatos,
  validarConJoi(esquemas.producto),
  (req, res) => {
    res.json({
      mensaje: 'Producto creado exitosamente',
      producto: req.body,
      timestamp: new Date(),
    });
  }
);

/**
 * Ruta con validación de parámetros
 */
app.get(
  '/usuarios/:id',
  validarParametros,
  manejarErroresValidacion,
  (req, res) => {
    res.json({
      mensaje: 'Usuario encontrado',
      id: req.params.id,
      usuario: {
        id: req.params.id,
        nombre: 'Usuario de ejemplo',
        email: 'usuario@ejemplo.com',
      },
      timestamp: new Date(),
    });
  }
);

/**
 * Ruta con validación de query parameters
 */
app.get('/productos', validarQuery, manejarErroresValidacion, (req, res) => {
  const { page = 1, limit = 10, sort = 'asc', search } = req.query;

  res.json({
    mensaje: 'Lista de productos',
    parametros: {
      page,
      limit,
      sort,
      search,
    },
    productos: [
      { id: 1, nombre: 'Producto 1', precio: 100 },
      { id: 2, nombre: 'Producto 2', precio: 200 },
    ],
    timestamp: new Date(),
  });
});

/**
 * Ruta con validación de archivos
 */
app.post('/upload', validarArchivo, (req, res) => {
  res.json({
    mensaje: 'Archivo subido exitosamente',
    archivo: req.body.archivo,
    timestamp: new Date(),
  });
});

// 7. RUTAS DE TESTING

/**
 * Ruta para probar XSS
 */
app.post('/test-xss', sanitizarDatos, (req, res) => {
  res.json({
    mensaje: 'Datos procesados',
    datosOriginales: req.body,
    timestamp: new Date(),
    nota: 'Los datos han sido sanitizados para prevenir XSS',
  });
});

/**
 * Ruta para estadísticas de validación
 */
app.get('/admin/validation-stats', (req, res) => {
  res.json({
    mensaje: 'Estadísticas de validación',
    estadisticas: estadisticasValidacion,
    timestamp: new Date(),
  });
});

// 8. TESTING Y DEMOSTRACIÓN
const PORT = 3006;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🔐 Servidor de validación ejecutándose en puerto ${PORT}`);
    console.log('\n📋 Pruebas sugeridas:');
    console.log('1. Usuario con Joi: POST http://localhost:3006/usuarios/joi');
    console.log(
      '   Body: { "nombre": "Juan", "email": "juan@gmail.com", "edad": 25, "password": "MiPass123!" }'
    );
    console.log(
      '2. Usuario con express-validator: POST http://localhost:3006/usuarios/validator'
    );
    console.log(
      '   Body: { "nombre": "Ana", "email": "ana@hotmail.com", "edad": 30, "password": "Pass123@" }'
    );
    console.log('3. Producto: POST http://localhost:3006/productos');
    console.log(
      '   Body: { "nombre": "Laptop", "precio": 999.99, "categoria": "electronica" }'
    );
    console.log('4. Test XSS: POST http://localhost:3006/test-xss');
    console.log(
      '   Body: { "contenido": "<script>alert(\\"XSS\\")</script>Hola" }'
    );
    console.log('5. Parámetros: GET http://localhost:3006/usuarios/123');
    console.log(
      '6. Query: GET http://localhost:3006/productos?page=1&limit=5&sort=desc&search=laptop'
    );
    console.log(
      '7. Estadísticas: GET http://localhost:3006/admin/validation-stats'
    );
    console.log('\n🎯 Conceptos clave:');
    console.log('- Joi: Validación con esquemas declarativos');
    console.log('- Express-validator: Validación con middleware');
    console.log('- Sanitización: Limpieza de datos de entrada');
    console.log('- XSS Prevention: Prevención de scripts maliciosos');
    console.log('\n💡 Prueba con datos inválidos:');
    console.log('- Emails inválidos, passwords débiles');
    console.log('- Números fuera de rango');
    console.log('- Caracteres especiales y scripts');
    console.log('- Parámetros faltantes o incorrectos');
  });
}

module.exports = {
  app,
  validarConJoi,
  sanitizarDatos,
  validacionesUsuario,
  manejarErroresValidacion,
  esquemas,
};

// 🎪 Mini Reto: Implementa un validador dinámico que genere esquemas basados en configuración
const crearValidadorDinamico = configuracion => {
  const generarEsquemaJoi = config => {
    const esquema = {};

    for (const [campo, reglas] of Object.entries(config)) {
      let validador = Joi.string();

      if (reglas.type === 'number') {
        validador = Joi.number();
      } else if (reglas.type === 'boolean') {
        validador = Joi.boolean();
      } else if (reglas.type === 'array') {
        validador = Joi.array();
      }

      if (reglas.required) {
        validador = validador.required();
      } else {
        validador = validador.optional();
      }

      if (reglas.min) {
        validador = validador.min(reglas.min);
      }

      if (reglas.max) {
        validador = validador.max(reglas.max);
      }

      if (reglas.pattern) {
        validador = validador.pattern(new RegExp(reglas.pattern));
      }

      if (reglas.valid) {
        validador = validador.valid(...reglas.valid);
      }

      esquema[campo] = validador;
    }

    return Joi.object(esquema);
  };

  const esquemaJoi = generarEsquemaJoi(configuracion);

  return (req, res, next) => {
    const { error, value } = esquemaJoi.validate(req.body);

    if (error) {
      return res.status(400).json({
        error: 'Validación dinámica fallida',
        detalles: error.details.map(d => d.message),
      });
    }

    req.body = value;
    next();
  };
};

// Ejemplo de uso
const configFormulario = {
  titulo: { type: 'string', required: true, min: 5, max: 100 },
  contenido: { type: 'string', required: true, min: 10, max: 1000 },
  categoria: {
    type: 'string',
    required: true,
    valid: ['noticia', 'blog', 'tutorial'],
  },
  puntuacion: { type: 'number', required: false, min: 1, max: 5 },
  publicado: { type: 'boolean', required: false },
};

app.post(
  '/formulario-dinamico',
  crearValidadorDinamico(configFormulario),
  (req, res) => {
    res.json({
      mensaje: 'Formulario procesado con validación dinámica',
      datos: req.body,
      timestamp: new Date(),
    });
  }
);
