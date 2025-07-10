/**
 * 🔒 Día 12B - Ejercicio 3: Validación de Entrada y Sanitización
 *
 * Objetivos:
 * - Implementar validación robusta de entrada
 * - Aplicar sanitización de datos
 * - Prevenir ataques XSS
 * - Usar Joi para validación
 */

const express = require('express');
const Joi = require('joi');
const validator = require('validator');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss');
const app = express();

// Middleware de seguridad
app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting específico para registro
const registroLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 intentos por IP
  message: {
    error: 'Demasiados intentos de registro. Intenta en 15 minutos.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Esquemas de validación con Joi
const esquemaUsuario = Joi.object({
  nombre: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .required()
    .messages({
      'string.min': 'El nombre debe tener al menos 2 caracteres',
      'string.max': 'El nombre no puede exceder 50 caracteres',
      'string.pattern.base': 'El nombre solo puede contener letras y espacios',
      'any.required': 'El nombre es requerido',
    }),

  email: Joi.string().email().required().messages({
    'string.email': 'Email inválido',
    'any.required': 'Email es requerido',
  }),

  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      'string.min': 'La contraseña debe tener al menos 8 caracteres',
      'string.pattern.base':
        'La contraseña debe contener al menos: 1 minúscula, 1 mayúscula, 1 número y 1 carácter especial',
      'any.required': 'La contraseña es requerida',
    }),

  edad: Joi.number().integer().min(13).max(120).required().messages({
    'number.min': 'Debes ser mayor de 13 años',
    'number.max': 'Edad máxima es 120 años',
    'any.required': 'La edad es requerida',
  }),

  telefono: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .optional()
    .messages({
      'string.pattern.base': 'El teléfono debe tener 10 dígitos',
    }),

  biografia: Joi.string().max(500).optional().messages({
    'string.max': 'La biografía no puede exceder 500 caracteres',
  }),
});

const esquemaProducto = Joi.object({
  nombre: Joi.string().min(2).max(100).required().messages({
    'string.min': 'El nombre debe tener al menos 2 caracteres',
    'string.max': 'El nombre no puede exceder 100 caracteres',
    'any.required': 'El nombre es requerido',
  }),

  descripcion: Joi.string().max(1000).optional().messages({
    'string.max': 'La descripción no puede exceder 1000 caracteres',
  }),

  precio: Joi.number().positive().precision(2).required().messages({
    'number.positive': 'El precio debe ser positivo',
    'any.required': 'El precio es requerido',
  }),

  categoria: Joi.string()
    .valid('tecnologia', 'hogar', 'deportes', 'moda', 'libros')
    .required()
    .messages({
      'any.only':
        'Categoría debe ser: tecnologia, hogar, deportes, moda o libros',
      'any.required': 'La categoría es requerida',
    }),

  disponible: Joi.boolean().default(true),
});

// Funciones de sanitización
const sanitizarEntrada = data => {
  const sanitizado = {};

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      // Sanitizar XSS
      sanitizado[key] = xss(value, {
        whiteList: {}, // No permitir ningún HTML
        stripIgnoreTag: true,
        stripIgnoreTagBody: ['script'],
      });

      // Limpiar caracteres especiales peligrosos
      sanitizado[key] = sanitizado[key]
        .replace(/[<>'"]/g, '') // Remover caracteres HTML peligrosos
        .trim(); // Eliminar espacios en blanco
    } else {
      sanitizado[key] = value;
    }
  }

  return sanitizado;
};

const validarEmail = email => {
  // Validación adicional más estricta
  if (!validator.isEmail(email)) {
    return false;
  }

  // Verificar dominios no permitidos
  const dominiosProhibidos = [
    'tempmail.com',
    '10minutemail.com',
    'mailinator.com',
  ];
  const dominio = email.split('@')[1];

  if (dominiosProhibidos.includes(dominio)) {
    return false;
  }

  return true;
};

const validarContenidoSeguro = texto => {
  // Buscar patrones sospechosos
  const patronesPeligrosos = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /eval\s*\(/i,
    /expression\s*\(/i,
    /vbscript:/i,
    /data:text\/html/i,
  ];

  return !patronesPeligrosos.some(patron => patron.test(texto));
};

// Middleware de validación
const validarEsquema = esquema => {
  return (req, res, next) => {
    const { error, value } = esquema.validate(req.body, {
      abortEarly: false, // Mostrar todos los errores
      stripUnknown: true, // Remover campos no definidos
    });

    if (error) {
      const errores = error.details.map(detalle => ({
        campo: detalle.path.join('.'),
        mensaje: detalle.message,
      }));

      return res.status(400).json({
        error: 'Datos de entrada inválidos',
        errores: errores,
      });
    }

    // Sanitizar datos validados
    req.body = sanitizarEntrada(value);
    next();
  };
};

// Middleware de validación adicional
const validacionesAdicionales = (req, res, next) => {
  const { email, biografia } = req.body;

  // Validar email con criterios adicionales
  if (email && !validarEmail(email)) {
    return res.status(400).json({
      error: 'Email inválido o de dominio no permitido',
    });
  }

  // Validar contenido seguro
  if (biografia && !validarContenidoSeguro(biografia)) {
    return res.status(400).json({
      error: 'Contenido potencialmente peligroso detectado',
    });
  }

  next();
};

// Rutas con validación
app.post(
  '/api/usuarios/registro',
  registroLimiter,
  validarEsquema(esquemaUsuario),
  validacionesAdicionales,
  async (req, res) => {
    try {
      console.log('Datos sanitizados recibidos:', req.body);

      // Aquí normalmente se guardaría en base de datos
      const nuevoUsuario = {
        id: Date.now(),
        ...req.body,
        fechaRegistro: new Date().toISOString(),
        activo: true,
      };

      // Remover password de la respuesta
      const { password, ...usuarioRespuesta } = nuevoUsuario;

      res.status(201).json({
        mensaje: 'Usuario registrado exitosamente',
        usuario: usuarioRespuesta,
      });
    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
      });
    }
  }
);

app.post(
  '/api/productos',
  validarEsquema(esquemaProducto),
  async (req, res) => {
    try {
      console.log('Producto validado:', req.body);

      const nuevoProducto = {
        id: Date.now(),
        ...req.body,
        fechaCreacion: new Date().toISOString(),
      };

      res.status(201).json({
        mensaje: 'Producto creado exitosamente',
        producto: nuevoProducto,
      });
    } catch (error) {
      console.error('Error creando producto:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
      });
    }
  }
);

// Ruta para probar validación XSS
app.post(
  '/api/comentarios',
  validarEsquema(
    Joi.object({
      contenido: Joi.string().max(500).required(),
      autor: Joi.string().max(50).required(),
    })
  ),
  (req, res) => {
    const { contenido, autor } = req.body;

    // Verificar si el contenido es seguro
    if (!validarContenidoSeguro(contenido)) {
      return res.status(400).json({
        error: 'Contenido no permitido por razones de seguridad',
      });
    }

    const comentario = {
      id: Date.now(),
      contenido,
      autor,
      fecha: new Date().toISOString(),
    };

    res.status(201).json({
      mensaje: 'Comentario agregado exitosamente',
      comentario,
    });
  }
);

// Ruta de prueba para demostrar prevención XSS
app.get('/api/demo-xss', (req, res) => {
  const ejemplosXSS = [
    '<script>alert("XSS")</script>',
    '<img src="x" onerror="alert(1)">',
    'javascript:alert("XSS")',
    '<body onload="alert(1)">',
    '<iframe src="javascript:alert(1)"></iframe>',
  ];

  const resultados = ejemplosXSS.map(ejemplo => ({
    original: ejemplo,
    sanitizado: xss(ejemplo, {
      whiteList: {},
      stripIgnoreTag: true,
      stripIgnoreTagBody: ['script'],
    }),
  }));

  res.json({
    mensaje: 'Ejemplos de sanitización XSS',
    ejemplos: resultados,
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: 'JSON mal formado',
    });
  }

  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      error: 'Payload demasiado grande',
    });
  }

  res.status(500).json({
    error: 'Error interno del servidor',
  });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🔒 Servidor de validación ejecutándose en puerto ${PORT}`);
  console.log('\n📋 Pruebas disponibles:');
  console.log('POST /api/usuarios/registro - Registro con validación completa');
  console.log('POST /api/productos - Creación de producto');
  console.log('POST /api/comentarios - Comentarios con sanitización XSS');
  console.log('GET /api/demo-xss - Demostración de sanitización XSS');
});

// Exportar para testing
module.exports = app;

/* 
🧪 INSTRUCCIONES DE PRUEBA:

1. Instalar dependencias:
   npm install express joi validator express-rate-limit helmet xss

2. Ejecutar el servidor:
   node 03-input-validation.js

3. Probar validación exitosa:
   curl -X POST http://localhost:3000/api/usuarios/registro \
     -H "Content-Type: application/json" \
     -d '{
       "nombre": "Juan Pérez",
       "email": "juan@ejemplo.com",
       "password": "MiPassword123!",
       "edad": 25,
       "telefono": "3001234567",
       "biografia": "Desarrollador web apasionado"
     }'

4. Probar validación con errores:
   curl -X POST http://localhost:3000/api/usuarios/registro \
     -H "Content-Type: application/json" \
     -d '{
       "nombre": "A",
       "email": "email-invalido",
       "password": "123",
       "edad": 5
     }'

5. Probar sanitización XSS:
   curl -X POST http://localhost:3000/api/comentarios \
     -H "Content-Type: application/json" \
     -d '{
       "contenido": "<script>alert(\"XSS\")</script>Comentario normal",
       "autor": "Atacante"
     }'

6. Ver demo de sanitización:
   curl http://localhost:3000/api/demo-xss

7. Probar rate limiting (hacer 6 requests rápidos):
   for i in {1..6}; do curl -X POST http://localhost:3000/api/usuarios/registro \
     -H "Content-Type: application/json" \
     -d '{"nombre":"Test","email":"test@test.com","password":"Test123!","edad":20}'; done

💡 CONCEPTOS CLAVE:
- Validación con Joi: Esquemas robustos y mensajes personalizados
- Sanitización XSS: Limpieza de contenido peligroso
- Rate limiting específico: Protección contra spam
- Validación en capas: Joi + validaciones adicionales
- Manejo de errores: Respuestas estructuradas
- Security headers: Helmet para protección adicional
*/
