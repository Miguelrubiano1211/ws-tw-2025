# 📚 Recursos del Día 11 - APIs REST y Database Integration

## 🎯 Materiales de Referencia

### **Documentación Oficial**

- [Express.js Documentation](https://expressjs.com/)
- [Better-SQLite3 Documentation](https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md)
- [Joi Validation Documentation](https://joi.dev/api/)
- [Swagger UI Documentation](https://swagger.io/docs/open-source-tools/swagger-ui/)

### **Tutoriales Recomendados**

- [REST API Design Best Practices](https://restfulapi.net/)
- [SQLite Tutorial](https://www.sqlitetutorial.net/)
- [Express.js Tutorial](https://developer.mozilla.org/es/docs/Learn/Server-side/Express_Nodejs)

## 🛠️ Herramientas Utilizadas

### **Desarrollo**

- **Node.js 18+** - Runtime de JavaScript
- **Express.js** - Framework web para Node.js
- **better-sqlite3** - Driver SQLite para Node.js
- **Joi** - Validación de schemas
- **Swagger** - Documentación de APIs

### **Testing**

- **Jest** - Framework de testing
- **Supertest** - Testing HTTP
- **Postman** - Testing manual y automatizado
- **Newman** - CLI para Postman

### **Seguridad**

- **Helmet** - Headers de seguridad
- **CORS** - Cross-Origin Resource Sharing
- **Rate Limiting** - Limitación de peticiones

## 📊 Comandos Útiles

### **Desarrollo**

```bash
# Iniciar en modo desarrollo
pnpm run dev

# Inicializar base de datos
pnpm run db:init

# Ejecutar tests
pnpm test

# Tests con cobertura
pnpm test:coverage

# Abrir documentación
pnpm run docs
```

### **SQLite**

```bash
# Acceder a la base de datos
sqlite3 database/productos.db

# Comandos útiles en SQLite
.tables          # Listar tablas
.schema          # Ver esquema
.exit            # Salir
```

### **Postman/Newman**

```bash
# Ejecutar collection
newman run postman/collection.json

# Con environment
newman run postman/collection.json -e postman/environment.json

# Generar reporte
newman run postman/collection.json -r html
```

## 🎯 Ejercicios Complementarios

### **Ejercicio Extra 1: Paginación Avanzada**

Implementa paginación con cursors y metadata completa:

```javascript
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10,
    "hasNext": true,
    "hasPrev": false,
    "next": "/api/productos?page=2",
    "prev": null
  }
}
```

### **Ejercicio Extra 2: Búsqueda Full-Text**

Implementa búsqueda full-text con SQLite FTS:

```sql
-- Crear tabla FTS
CREATE VIRTUAL TABLE productos_fts USING fts5(
    nombre, descripcion, content='productos'
);

-- Trigger para mantener sincronizado
CREATE TRIGGER productos_fts_insert AFTER INSERT ON productos
BEGIN
    INSERT INTO productos_fts(rowid, nombre, descripcion)
    VALUES (new.id, new.nombre, new.descripcion);
END;
```

### **Ejercicio Extra 3: Soft Deletes**

Implementa eliminación lógica:

```javascript
// Agregar campo deleted_at a todas las tablas
ALTER TABLE productos ADD COLUMN deleted_at DATETIME;

// Modificar consultas para excluir eliminados
SELECT * FROM productos WHERE deleted_at IS NULL;

// Endpoint para restaurar
PUT /api/productos/:id/restore
```

### **Ejercicio Extra 4: Versionado de API**

Implementa versionado de la API:

```javascript
// v1/routes/productos.js
app.use('/api/v1/productos', require('./v1/routes/productos'));

// v2/routes/productos.js
app.use('/api/v2/productos', require('./v2/routes/productos'));
```

## 🔧 Snippets de Código Útiles

### **Middleware de Validación Genérico**

```javascript
const validate = schema => (req, res, next) => {
  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: 'Datos inválidos',
      details: error.details.map(d => d.message),
    });
  }
  req.body = value;
  next();
};
```

### **Wrapper para Async/Await**

```javascript
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Uso
app.get(
  '/api/productos',
  asyncHandler(async (req, res) => {
    const productos = await ProductoModel.findAll();
    res.json(productos);
  })
);
```

### **Response Helper**

```javascript
const sendResponse = (res, statusCode, data, message) => {
  res.status(statusCode).json({
    success: statusCode < 400,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};
```

## 📋 Checklist de Mejores Prácticas

### **API Design**

- [ ] Usar nombres de recursos en plural
- [ ] Métodos HTTP apropiados
- [ ] Status codes correctos
- [ ] Estructura de respuesta consistente
- [ ] Versionado de API

### **Seguridad**

- [ ] Validación de entrada
- [ ] Sanitización de datos
- [ ] Rate limiting
- [ ] Headers de seguridad
- [ ] Error handling seguro

### **Performance**

- [ ] Índices en columnas consultadas
- [ ] Paginación implementada
- [ ] Consultas optimizadas
- [ ] Prepared statements
- [ ] Caching apropiado

### **Documentación**

- [ ] Swagger/OpenAPI completo
- [ ] Ejemplos de requests/responses
- [ ] Códigos de error documentados
- [ ] README detallado

### **Testing**

- [ ] Tests unitarios
- [ ] Tests de integración
- [ ] Casos de error cubiertos
- [ ] Mocks apropiados
- [ ] Cobertura > 80%

## 📚 Recursos Adicionales

### **Libros Recomendados**

- "REST API Design Handbook" - George Reese
- "Building APIs with Node.js" - Caio Ribeiro Pereira
- "Express.js Guide" - Azat Mardan

### **Cursos Online**

- [REST API Design Course](https://restfulapi.net/)
- [Node.js API Development](https://nodejs.org/en/learn/)
- [SQLite Masterclass](https://www.sqlitetutorial.net/)

### **Tools y Extensiones**

- **Postman** - Testing de APIs
- **Insomnia** - Cliente REST alternativo
- **SQLite Browser** - GUI para SQLite
- **Thunder Client** - Extensión VS Code

## 🎯 Próximos Pasos

### **Día 12 Preview: Security y Authentication**

- JWT tokens
- Password hashing
- OAuth 2.0
- API Keys
- Role-based access

### **Preparación Recomendada**

1. Revisar conceptos de criptografía básica
2. Entender JSON Web Tokens
3. Estudiar OAuth 2.0 flows
4. Practicar con bcrypt
5. Investigar rate limiting avanzado

¡Excelente trabajo dominando APIs REST! 🚀
