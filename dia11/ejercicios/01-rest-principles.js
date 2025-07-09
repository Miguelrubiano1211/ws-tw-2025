// 📡 Ejercicio 1: REST Principles y HTTP Methods
// Objetivo: Diseñar endpoints REST para diferentes recursos

console.log('🎯 Ejercicio 1: REST Principles y HTTP Methods');

// 1. Diseño de URLs RESTful
// Completa los endpoints siguiendo principios REST

const endpointsLibreria = {
  // Libros
  libros: {
    obtenerTodos: 'GET /api/libros',
    obtenerUno: 'GET /api/libros/:id',
    crear: 'POST /api/libros',
    actualizar: 'PUT /api/libros/:id',
    eliminar: 'DELETE /api/libros/:id',
    // TODO: Agregar endpoint para buscar libros por título
    buscarPorTitulo: '', // GET /api/libros/buscar?titulo=...
    // TODO: Agregar endpoint para libros por autor
    librosPorAutor: '', // GET /api/libros?autor=...
  },

  // Autores
  autores: {
    // TODO: Completar endpoints REST para autores
    obtenerTodos: '',
    obtenerUno: '',
    crear: '',
    actualizar: '',
    eliminar: '',
  },

  // Préstamos
  prestamos: {
    // TODO: Completar endpoints REST para préstamos
    obtenerTodos: '',
    obtenerUno: '',
    crear: '',
    actualizar: '',
    eliminar: '',
    // TODO: Agregar endpoint para préstamos activos
    prestamosActivos: '',
    // TODO: Agregar endpoint para devolver libro
    devolverLibro: '',
  },
};

// 2. Status Codes apropiados
// Asigna el status code correcto para cada situación

const statusCodes = {
  // TODO: Completar con el status code apropiado
  libroCreado: 0, // Respuesta: 201
  libroEncontrado: 0, // Respuesta: 200
  libroNoEncontrado: 0, // Respuesta: 404
  libroActualizado: 0, // Respuesta: 200
  libroEliminado: 0, // Respuesta: 200 o 204
  datosInvalidos: 0, // Respuesta: 400
  errorServidor: 0, // Respuesta: 500
  noAutorizado: 0, // Respuesta: 401
  prohibido: 0, // Respuesta: 403
  sinContenido: 0, // Respuesta: 204
};

// 3. Estructura de respuestas consistente
// Diseña la estructura de respuestas para la API

const respuestasAPI = {
  // Respuesta exitosa con datos
  exito: {
    // TODO: Completar estructura
    // Incluir: status, mensaje, datos
  },

  // Respuesta de error
  error: {
    // TODO: Completar estructura
    // Incluir: status, error, mensaje, detalles
  },

  // Respuesta de lista con paginación
  lista: {
    // TODO: Completar estructura
    // Incluir: datos, total, página, límite
  },

  // Respuesta de creación
  creacion: {
    // TODO: Completar estructura
    // Incluir: mensaje, datos creados, location
  },
};

// 4. Implementación práctica con Express
// Crea un servidor básico con endpoints REST

const express = require('express');
const app = express();

app.use(express.json());

// Datos de ejemplo
let libros = [
  { id: 1, titulo: 'El Quijote', autor: 'Cervantes', year: 1605 },
  {
    id: 2,
    titulo: 'Cien años de soledad',
    autor: 'García Márquez',
    year: 1967,
  },
  { id: 3, titulo: 'Pedro Páramo', autor: 'Juan Rulfo', year: 1955 },
];

let siguienteId = 4;

// TODO: Implementar endpoint GET /api/libros
app.get('/api/libros', (req, res) => {
  // Implementar:
  // - Devolver todos los libros
  // - Filtrar por autor si se proporciona query param
  // - Usar estructura de respuesta consistente
});

// TODO: Implementar endpoint GET /api/libros/:id
app.get('/api/libros/:id', (req, res) => {
  // Implementar:
  // - Buscar libro por ID
  // - Devolver 404 si no existe
  // - Usar estructura de respuesta consistente
});

// TODO: Implementar endpoint POST /api/libros
app.post('/api/libros', (req, res) => {
  // Implementar:
  // - Validar datos requeridos
  // - Crear nuevo libro
  // - Devolver 201 con el libro creado
  // - Manejar errores de validación
});

// TODO: Implementar endpoint PUT /api/libros/:id
app.put('/api/libros/:id', (req, res) => {
  // Implementar:
  // - Buscar libro por ID
  // - Actualizar campos proporcionados
  // - Devolver libro actualizado
  // - Manejar errores
});

// TODO: Implementar endpoint DELETE /api/libros/:id
app.delete('/api/libros/:id', (req, res) => {
  // Implementar:
  // - Buscar libro por ID
  // - Eliminar libro
  // - Devolver confirmación
  // - Manejar errores
});

// 5. Middleware para logging
// Implementa un middleware que registre todas las peticiones

const loggingMiddleware = (req, res, next) => {
  // TODO: Implementar logging
  // Registrar: método, URL, timestamp, IP
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};

app.use(loggingMiddleware);

// 6. Manejo de errores
// Implementa middleware de manejo de errores

const errorHandler = (err, req, res, next) => {
  // TODO: Implementar manejo de errores
  // - Registrar error
  // - Devolver respuesta de error consistente
  // - No exponer detalles internos
};

app.use(errorHandler);

// 7. Middleware 404
// Implementa middleware para rutas no encontradas

const notFoundHandler = (req, res) => {
  // TODO: Implementar handler 404
  // - Devolver respuesta 404 consistente
  // - Incluir información sobre la ruta solicitada
};

app.use(notFoundHandler);

// Tests básicos
function testEndpoints() {
  console.log('\n🧪 Ejecutando tests básicos...');

  // TODO: Implementar tests básicos
  // - Verificar que los endpoints respondan
  // - Verificar status codes correctos
  // - Verificar estructura de respuestas
}

// Exportar para testing
module.exports = {
  app,
  endpointsLibreria,
  statusCodes,
  respuestasAPI,
  testEndpoints,
};

// Ejecutar si es el archivo principal
if (require.main === module) {
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`📚 Endpoints disponibles:`);
    console.log(`   GET    /api/libros`);
    console.log(`   GET    /api/libros/:id`);
    console.log(`   POST   /api/libros`);
    console.log(`   PUT    /api/libros/:id`);
    console.log(`   DELETE /api/libros/:id`);

    // Ejecutar tests
    setTimeout(testEndpoints, 1000);
  });
}

/* 
🎯 RETO ADICIONAL:
1. Implementa endpoints para autores con relación a libros
2. Agrega paginación a la lista de libros
3. Implementa filtros por año de publicación
4. Agrega validación de datos más robusta
5. Implementa rate limiting básico

📝 NOTAS:
- Usa métodos HTTP apropiados
- Mantén consistencia en las respuestas
- Maneja errores adecuadamente
- Documenta cada endpoint
*/
