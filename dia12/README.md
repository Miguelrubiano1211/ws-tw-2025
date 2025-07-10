# 🔐 Día 12A: Fundamentos de Seguridad Web

## 🎯 Objetivos del Día

- Distinguir entre Authentication y Authorization
- Implementar JWT tokens y autenticación robusta
- Aplicar password hashing con bcrypt
- Crear sistema de autenticación completo
- Implementar middleware de autenticación
- Configurar tokens de refresh

## 🗓️ Cronograma

### **12:00-12:45** - Authentication vs Authorization

- Conceptos fundamentales de seguridad
- Diferencias entre autenticación y autorización
- Tipos de autenticación (Basic, Bearer, OAuth)
- Flujos de autorización y control de acceso
- **Ejercicio práctico:** Análisis de diferentes sistemas de auth

### **12:45-13:45** - JWT Tokens y Implementation

- Estructura de JSON Web Tokens
- Firma y verificación de tokens
- Implementación completa con Node.js
- Refresh tokens y gestión de sesiones
- **Ejercicio práctico:** Implementación de JWT completa

### **13:45-14:00** - 🛑 DESCANSO

### **14:00-15:00** - Password Hashing (bcrypt)

- Conceptos de hashing criptográfico
- Implementación con bcrypt
- Salt rounds y performance
- Verificación y políticas de passwords
- **Ejercicio práctico:** Sistema de registro y login seguro

### **15:00-16:00** - Autenticación Completa

- Integración de JWT + bcrypt
- Middleware de autenticación
- Manejo de errores de autenticación
- Testing del sistema de auth
- **Ejercicio práctico:** API con autenticación completa

### **16:00-16:15** - 🛑 DESCANSO

### **16:15-17:45** - Proyecto Final: Sistema de Autenticación

- Desarrollo de API con autenticación robusta
- Registro, login y gestión de usuarios
- Endpoints protegidos por autenticación
- Testing y validación completa

### **17:45-18:00** - Revisión y Preparación para Día 12B

- Seguridad en CORS

### **14:45-15:15** - Input Validation y Sanitization

- Validación robusta de entrada
- Sanitización de datos
- Prevención de XSS
- Validation con Joi avanzado

### **15:15-15:30** - 🛑 DESCANSO

### **15:30-16:00** - SQL Injection Prevention

- Conceptos de SQL injection
- Prepared statements
- Parametrized queries
- Buenas prácticas

### **16:00-16:30** - Security Headers y Best Practices

- Headers de seguridad esenciales
- Configuración con Helmet
- CSP (Content Security Policy)
- Mejores prácticas generales

### **16:30-17:00** - Segunda Evaluación Práctica (API Segura)

- **Proyecto:** Implementar autenticación completa
- Sistema de login/registro
- Protección de endpoints
- Aplicación de todas las medidas de seguridad

## 📚 Recursos del Día

### **Dependencias a Instalar:**

```bash
pnpm install jsonwebtoken bcryptjs
pnpm install express-rate-limit express-slow-down
pnpm install express-validator dompurify
pnpm install helmet express-mongo-sanitize
pnpm install -D jest supertest
```

### **Estructura del Proyecto:**

```
dia12/
├── ejercicios/
│   ├── 01-auth-vs-authz/
│   ├── 02-jwt-implementation/
│   ├── 03-password-hashing/
│   ├── 04-rate-limiting/
│   ├── 05-cors-config/
│   ├── 06-input-validation/
│   ├── 07-sql-injection/
│   └── 08-security-headers/
├── proyectos/
│   └── api-segura/
└── recursos/
    ├── security-checklist.md
    ├── jwt-best-practices.md
    └── owasp-guidelines.md
```

## 🎯 Competencias WorldSkills

- **Seguridad:** Implementación de medidas de protección
- **Autenticación:** Sistemas de login robustos
- **Autorización:** Control de acceso granular
- **Validación:** Protección contra ataques
- **Monitoring:** Detección de amenazas
- **Best Practices:** Estándares de la industria

## 🚀 Resultado Esperado

Al final del día tendrás:

- ✅ Sistema de autenticación JWT completo
- ✅ Password hashing implementado
- ✅ Rate limiting configurado
- ✅ CORS apropiadamente configurado
- ✅ Validación y sanitización robusta
- ✅ Protección contra SQL injection
- ✅ Headers de seguridad implementados
- ✅ API completamente segura

## 🎪 Mini Reto del Día

**🎯 MR-12: El Guardian Digital**

- **Tiempo:** 15 minutos
- **Problema:** Crear middleware que verifique token JWT y role de usuario
- **Divide:**
  1. Extraer token del header Authorization
  2. Verificar y decodificar token
  3. Validar rol requerido
- **Pista:** Usa middleware factory pattern para roles dinámicos

¡Fortificemos nuestras APIs contra todas las amenazas! 🛡️
