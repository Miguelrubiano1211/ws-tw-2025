# 🔐 Ejercicios Día 12: Security y Authentication

## 📋 Lista de Ejercicios

### **Ejercicio 01: Authentication vs Authorization**

- **Archivo:** `01-auth-vs-authz.js`
- **Concepto:** Diferencias entre autenticación y autorización
- **Objetivo:** Implementar middleware de autenticación básica

### **Ejercicio 02: JWT Implementation**

- **Archivo:** `02-jwt-implementation.js`
- **Concepto:** Implementación completa de JWT
- **Objetivo:** Crear y verificar tokens JWT

### **Ejercicio 03: Password Hashing**

- **Archivo:** `03-password-hashing.js`
- **Concepto:** Hashing seguro con bcrypt
- **Objetivo:** Hash y verificación de passwords

### **Ejercicio 04: Rate Limiting**

- **Archivo:** `04-rate-limiting.js`
- **Concepto:** Limitación de solicitudes
- **Objetivo:** Protección contra ataques DDoS

### **Ejercicio 05: CORS Configuration**

- **Archivo:** `05-cors-config.js`
- **Concepto:** Configuración de CORS
- **Objetivo:** Políticas de origen cruzado

### **Ejercicio 06: Input Validation**

- **Archivo:** `06-input-validation.js`
- **Concepto:** Validación y sanitización
- **Objetivo:** Protección contra XSS e inyección

### **Ejercicio 07: SQL Injection Prevention**

- **Archivo:** `07-sql-injection.js`
- **Concepto:** Prevención de inyección SQL
- **Objetivo:** Consultas parametrizadas

### **Ejercicio 08: Security Headers**

- **Archivo:** `08-security-headers.js`
- **Concepto:** Headers de seguridad
- **Objetivo:** Implementación con Helmet

## 🎯 Instrucciones Generales

1. **Orden de ejecución:** Los ejercicios deben realizarse en orden
2. **Dependencias:** Ejecuta `pnpm install` antes de empezar
3. **Testing:** Cada ejercicio incluye tests básicos
4. **Documentación:** Lee los comentarios para entender cada concepto

## 📦 Dependencias Necesarias

```bash
pnpm install jsonwebtoken bcryptjs express-rate-limit express-validator helmet
```

## 🚀 Cómo Ejecutar

```bash
# Navegar a la carpeta de ejercicios
cd dia12/ejercicios

# Ejecutar ejercicio específico
node 01-auth-vs-authz.js
node 02-jwt-implementation.js
# ... y así sucesivamente
```

## 🎪 Mini Reto del Día

**🎯 MR-12: El Guardian Digital**

Después de completar todos los ejercicios, implementa un middleware que:

1. Extraiga el token del header Authorization
2. Verifique y decodifique el token JWT
3. Valide que el usuario tiene el rol necesario
4. Permita acceso dinámico basado en roles

```javascript
// Ejemplo de uso esperado:
app.get('/admin', authenticateJWT(['admin']), (req, res) => {
  res.json({ mensaje: 'Acceso de admin autorizado' });
});

app.get('/user', authenticateJWT(['user', 'admin']), (req, res) => {
  res.json({ mensaje: 'Acceso de usuario autorizado' });
});
```

¡Protege tu API como un verdadero guardian digital! 🛡️
