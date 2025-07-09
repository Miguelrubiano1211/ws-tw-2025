# 📡 Día 11: APIs REST y Database Integration

## 🎯 Objetivos del Día

- Dominar los principios REST y métodos HTTP
- Implementar base de datos SQLite con ORM
- Crear operaciones CRUD completas
- Validar datos en el backend
- Documentar APIs con Swagger
- Automatizar testing con Postman

## 🗓️ Cronograma

### **12:00-12:30** - REST Principles y HTTP Methods

- Principios fundamentales REST
- HTTP methods: GET, POST, PUT, DELETE, PATCH
- Status codes y responses
- RESTful URL design

### **12:30-13:00** - SQLite Setup y Básico

- Instalación y configuración SQLite
- Creación de base de datos
- Comandos básicos SQL
- Conexión desde Node.js

### **13:00-13:30** - SQL Queries y Data Modeling

- SELECT, INSERT, UPDATE, DELETE
- Relaciones entre tablas
- Constraints y validaciones
- Índices y optimización

### **13:30-13:45** - 🛑 DESCANSO

### **13:45-14:15** - ORM Basics (mejor3 o similar para SQLite)

- Introducción a ORMs
- Configuración better-sqlite3
- Modelos y esquemas
- Migraciones básicas

### **14:15-14:45** - CRUD Operations Implementation

- Create (POST)
- Read (GET)
- Update (PUT/PATCH)
- Delete (DELETE)

### **14:45-15:15** - Data Validation en Backend

- Validation middleware
- Schema validation
- Error handling
- Sanitización de datos

### **15:15-15:30** - 🛑 DESCANSO

### **15:30-16:00** - API Documentation con Swagger

- Swagger UI setup
- OpenAPI specification
- Documentación automática
- Testing desde UI

### **16:00-16:30** - Postman Testing y Automation

- Postman collections
- Environment variables
- Automated tests
- CI/CD integration

### **16:30-17:00** - Práctica: API Completa con Database

- **Proyecto:** Sistema de gestión de productos
- API REST completa
- Base de datos SQLite
- Documentación Swagger
- Testing automatizado

## 📚 Recursos del Día

### **Dependencias a Instalar:**

```bash
pnpm install express cors helmet morgan
pnpm install better-sqlite3
pnpm install joi express-rate-limit
pnpm install swagger-ui-express swagger-jsdoc
pnpm install -D jest supertest nodemon
```

### **Estructura del Proyecto:**

```
dia11/
├── ejercicios/
│   ├── 01-rest-principles/
│   ├── 02-sqlite-setup/
│   ├── 03-sql-queries/
│   ├── 04-orm-basics/
│   ├── 05-crud-operations/
│   ├── 06-data-validation/
│   ├── 07-swagger-docs/
│   └── 08-postman-testing/
├── proyectos/
│   └── api-productos/
└── recursos/
    ├── database-schema.sql
    ├── postman-collection.json
    └── swagger-config.js
```

## 🎯 Competencias WorldSkills

- **Diseño de APIs:** Principios REST y arquitectura
- **Base de Datos:** Modelado y optimización
- **Validación:** Seguridad y integridad de datos
- **Documentación:** APIs profesionales
- **Testing:** Automatización y calidad
- **Performance:** Optimización de consultas

## 🚀 Resultado Esperado

Al final del día tendrás:

- ✅ API REST completa y funcional
- ✅ Base de datos SQLite con relaciones
- ✅ Validación robusta de datos
- ✅ Documentación automática Swagger
- ✅ Testing automatizado con Postman
- ✅ Arquitectura escalable y mantenible

## 🎪 Mini Reto del Día

**🎯 MR-11: El Catálogo Dinámico**

- **Tiempo:** 15 minutos
- **Problema:** Crear endpoint que devuelva productos filtrados por categoría
- **Divide:**
  1. Endpoint GET /api/productos/categoria/:categoria
  2. Query SQL con WHERE
  3. Validar parámetro categoria
- **Pista:** Usa params de Express y SQL prepared statements

¡Comencemos a construir APIs de nivel profesional! 🚀
