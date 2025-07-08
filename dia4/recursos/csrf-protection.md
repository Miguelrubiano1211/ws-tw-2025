# 🛡️ Protección CSRF (Cross-Site Request Forgery)

## 📋 Índice

1. [¿Qué es CSRF?](#qué-es-csrf)
2. [Cómo Funciona un Ataque CSRF](#cómo-funciona-un-ataque-csrf)
3. [Técnicas de Protección](#técnicas-de-protección)
4. [Tokens CSRF](#tokens-csrf)
5. [Validación de Origen](#validación-de-origen)
6. [Cookies SameSite](#cookies-samesite)
7. [Implementación en Frontend](#implementación-en-frontend)
8. [Casos de Uso Específicos](#casos-de-uso-específicos)

---

## 🎯 ¿Qué es CSRF?

**Cross-Site Request Forgery (CSRF)** es un ataque que engaña a un usuario autenticado para que ejecute acciones no deseadas en una aplicación web en la que está autenticado. El atacante explota la confianza que la aplicación tiene en el usuario.

### **Características del Ataque CSRF**

- Aprovecha la autenticación existente del usuario
- No requiere acceso directo a la aplicación
- Puede ejecutar acciones en nombre del usuario
- Difícil de detectar por el usuario

---

## 🎯 Cómo Funciona un Ataque CSRF

### **Ejemplo de Ataque**

```html
<!-- Sitio malicioso (malicioso.com) -->
<html>
  <body>
    <!-- Formulario oculto que se envía automáticamente -->
    <form
      id="malicioso"
      action="https://banco.com/transferir"
      method="POST">
      <input
        type="hidden"
        name="destino"
        value="cuenta-atacante" />
      <input
        type="hidden"
        name="cantidad"
        value="1000" />
    </form>

    <script>
      // Se envía automáticamente cuando el usuario visita la página
      document.getElementById('malicioso').submit();
    </script>
  </body>
</html>
```

### **Flujo del Ataque**

1. Usuario está autenticado en `banco.com`
2. Usuario visita `malicioso.com` (por email, link, etc.)
3. `malicioso.com` envía petición POST a `banco.com`
4. `banco.com` recibe la petición con cookies válidas
5. Se ejecuta la transferencia sin conocimiento del usuario

---

## 🛡️ Técnicas de Protección

### **1. Principio de Defensa en Capas**

```javascript
class ProteccionCSRF {
  constructor() {
    this.protecciones = {
      token: true,
      origen: true,
      referer: true,
      sameSite: true,
      dobleSubmit: true,
    };
  }

  validarPeticion(peticion) {
    const resultados = [];

    if (this.protecciones.token) {
      resultados.push(this.validarToken(peticion));
    }

    if (this.protecciones.origen) {
      resultados.push(this.validarOrigen(peticion));
    }

    if (this.protecciones.referer) {
      resultados.push(this.validarReferer(peticion));
    }

    // Todos los controles deben pasar
    return resultados.every(resultado => resultado.esValido);
  }

  validarToken(peticion) {
    const tokenFormulario = peticion.body.csrfToken;
    const tokenSesion = peticion.session.csrfToken;

    return {
      esValido: tokenFormulario === tokenSesion,
      mensaje: 'Token CSRF válido',
    };
  }

  validarOrigen(peticion) {
    const origen = peticion.headers.origin;
    const origenesPermitidos = ['https://miapp.com', 'https://www.miapp.com'];

    return {
      esValido: origenesPermitidos.includes(origen),
      mensaje: 'Origen válido',
    };
  }

  validarReferer(peticion) {
    const referer = peticion.headers.referer;
    const dominioPermitido = 'https://miapp.com';

    return {
      esValido: referer && referer.startsWith(dominioPermitido),
      mensaje: 'Referer válido',
    };
  }
}
```

---

## 🔐 Tokens CSRF

### **1. Generación de Tokens**

```javascript
class GeneradorTokenCSRF {
  constructor() {
    this.algoritmo = 'sha256';
    this.secreto = process.env.CSRF_SECRET || 'secreto-super-seguro';
  }

  // Generar token único
  generarToken(sesionId) {
    const crypto = require('crypto');
    const timestamp = Date.now().toString();
    const data = `${sesionId}:${timestamp}`;

    const hash = crypto
      .createHmac(this.algoritmo, this.secreto)
      .update(data)
      .digest('hex');

    return {
      token: `${timestamp}:${hash}`,
      timestamp,
    };
  }

  // Validar token
  validarToken(token, sesionId) {
    try {
      const [timestamp, hash] = token.split(':');
      const data = `${sesionId}:${timestamp}`;

      const hashEsperado = crypto
        .createHmac(this.algoritmo, this.secreto)
        .update(data)
        .digest('hex');

      // Verificar hash
      if (hash !== hashEsperado) {
        return { esValido: false, mensaje: 'Token inválido' };
      }

      // Verificar expiración (30 minutos)
      const tiempoExpiracion = 30 * 60 * 1000; // 30 minutos
      if (Date.now() - parseInt(timestamp) > tiempoExpiracion) {
        return { esValido: false, mensaje: 'Token expirado' };
      }

      return { esValido: true, mensaje: 'Token válido' };
    } catch (error) {
      return { esValido: false, mensaje: 'Error al validar token' };
    }
  }
}

// Uso
const generador = new GeneradorTokenCSRF();
const { token } = generador.generarToken('sesion123');
const validacion = generador.validarToken(token, 'sesion123');
```

### **2. Implementación en Frontend**

```javascript
class ClienteCSRF {
  constructor() {
    this.token = null;
    this.inicializar();
  }

  async inicializar() {
    // Obtener token del servidor
    this.token = await this.obtenerToken();
    this.configurarFormularios();
    this.configurarAjax();
  }

  async obtenerToken() {
    try {
      const response = await fetch('/api/csrf-token', {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      return data.token;
    } catch (error) {
      console.error('Error al obtener token CSRF:', error);
      return null;
    }
  }

  configurarFormularios() {
    // Agregar token a todos los formularios
    const formularios = document.querySelectorAll('form');

    formularios.forEach(form => {
      // Solo formularios POST, PUT, DELETE
      if (['POST', 'PUT', 'DELETE'].includes(form.method.toUpperCase())) {
        this.agregarTokenAFormulario(form);
      }
    });
  }

  agregarTokenAFormulario(form) {
    // Verificar si ya existe
    let campoToken = form.querySelector('input[name="csrfToken"]');

    if (!campoToken) {
      campoToken = document.createElement('input');
      campoToken.type = 'hidden';
      campoToken.name = 'csrfToken';
      form.appendChild(campoToken);
    }

    campoToken.value = this.token;
  }

  configurarAjax() {
    // Interceptar peticiones fetch
    const fetchOriginal = window.fetch;
    const self = this;

    window.fetch = function (url, options = {}) {
      // Solo modificar peticiones POST, PUT, DELETE
      if (
        options.method &&
        ['POST', 'PUT', 'DELETE'].includes(options.method.toUpperCase())
      ) {
        // Agregar token a headers
        options.headers = options.headers || {};
        options.headers['X-CSRF-Token'] = self.token;

        // Si es FormData, agregar token
        if (options.body instanceof FormData) {
          options.body.append('csrfToken', self.token);
        }

        // Si es JSON, agregar token
        if (options.headers['Content-Type'] === 'application/json') {
          const body = JSON.parse(options.body || '{}');
          body.csrfToken = self.token;
          options.body = JSON.stringify(body);
        }
      }

      return fetchOriginal.apply(this, arguments);
    };
  }

  // Método para obtener token actual
  obtenerTokenActual() {
    return this.token;
  }

  // Método para refrescar token
  async refrescarToken() {
    this.token = await this.obtenerToken();
    this.configurarFormularios();
  }
}

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  window.csrfProtection = new ClienteCSRF();
});
```

---

## 🔍 Validación de Origen

### **1. Validador de Origen**

```javascript
class ValidadorOrigen {
  constructor(origenesPermitidos = []) {
    this.origenesPermitidos = origenesPermitidos;
    this.permitirLocal = false;
  }

  validar(peticion) {
    const origen = peticion.headers.origin;
    const referer = peticion.headers.referer;

    // Verificar Origin header
    if (origen) {
      return this.validarOrigen(origen);
    }

    // Fallback a Referer si no hay Origin
    if (referer) {
      return this.validarReferer(referer);
    }

    // Sin Origin ni Referer - posible ataque
    return {
      esValido: false,
      mensaje: 'Sin header Origin o Referer',
    };
  }

  validarOrigen(origen) {
    // Permitir desarrollo local
    if (this.permitirLocal && this.esLocal(origen)) {
      return { esValido: true, mensaje: 'Origen local permitido' };
    }

    // Verificar lista de orígenes permitidos
    const esPermitido = this.origenesPermitidos.includes(origen);

    return {
      esValido: esPermitido,
      mensaje: esPermitido ? 'Origen válido' : `Origen no permitido: ${origen}`,
    };
  }

  validarReferer(referer) {
    try {
      const url = new URL(referer);
      const origen = `${url.protocol}//${url.host}`;

      return this.validarOrigen(origen);
    } catch (error) {
      return {
        esValido: false,
        mensaje: 'Referer inválido',
      };
    }
  }

  esLocal(origen) {
    const patronesLocales = [
      'http://localhost',
      'https://localhost',
      'http://127.0.0.1',
      'https://127.0.0.1',
    ];

    return patronesLocales.some(patron => origen.startsWith(patron));
  }

  agregarOrigen(origen) {
    if (!this.origenesPermitidos.includes(origen)) {
      this.origenesPermitidos.push(origen);
    }
  }
}

// Uso
const validador = new ValidadorOrigen([
  'https://miapp.com',
  'https://www.miapp.com',
  'https://admin.miapp.com',
]);

// En el middleware del servidor
app.use((req, res, next) => {
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    const validacion = validador.validar(req);

    if (!validacion.esValido) {
      return res.status(403).json({
        error: 'CSRF: ' + validacion.mensaje,
      });
    }
  }

  next();
});
```

---

## 🍪 Cookies SameSite

### **1. Configuración de Cookies**

```javascript
class ConfiguradorCookies {
  constructor() {
    this.configuracionPorDefecto = {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 3600000, // 1 hora
    };
  }

  // Configurar cookie de sesión
  configurarCookieSesion(res, valor) {
    res.cookie('sessionId', valor, {
      ...this.configuracionPorDefecto,
      sameSite: 'strict',
    });
  }

  // Configurar cookie CSRF
  configurarCookieCSRF(res, token) {
    res.cookie('csrfToken', token, {
      ...this.configuracionPorDefecto,
      httpOnly: false, // Necesario para JavaScript
      sameSite: 'strict',
    });
  }

  // Configurar cookie para subdominios
  configurarCookieSubdominio(res, valor) {
    res.cookie('crossSubdomain', valor, {
      ...this.configuracionPorDefecto,
      sameSite: 'lax', // Permite subdominios
      domain: '.miapp.com',
    });
  }

  // Configurar cookie para APIs externas
  configurarCookieAPI(res, valor) {
    res.cookie('apiToken', valor, {
      ...this.configuracionPorDefecto,
      sameSite: 'none', // Permite peticiones cross-site
      secure: true, // Requerido con SameSite=None
    });
  }
}
```

### **2. Implementación en Cliente**

```javascript
class GestorCookies {
  // Leer cookie
  leerCookie(nombre) {
    const valor = `; ${document.cookie}`;
    const partes = valor.split(`; ${nombre}=`);

    if (partes.length === 2) {
      return partes.pop().split(';').shift();
    }

    return null;
  }

  // Escribir cookie
  escribirCookie(nombre, valor, opciones = {}) {
    const configuracion = {
      secure: true,
      sameSite: 'strict',
      ...opciones,
    };

    let cookieString = `${nombre}=${valor}`;

    Object.keys(configuracion).forEach(key => {
      cookieString += `; ${key}=${configuracion[key]}`;
    });

    document.cookie = cookieString;
  }

  // Eliminar cookie
  eliminarCookie(nombre) {
    document.cookie = `${nombre}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  // Verificar soporte SameSite
  soportaSameSite() {
    const userAgent = navigator.userAgent;

    // Verificar navegadores que no soportan SameSite
    const noSoporta = [
      /Chrome\/5[1-9]|Chrome\/6[0-6]/,
      /Safari\/[1-9]|Safari\/1[0-2]/,
      /UCBrowser\//,
    ];

    return !noSoporta.some(patron => patron.test(userAgent));
  }
}

// Uso
const gestor = new GestorCookies();

// Configurar cookie con SameSite
if (gestor.soportaSameSite()) {
  gestor.escribirCookie('miCookie', 'valor', {
    sameSite: 'strict',
    secure: true,
  });
} else {
  // Fallback para navegadores antiguos
  gestor.escribirCookie('miCookie', 'valor', {
    secure: true,
  });
}
```

---

## 🌐 Implementación en Frontend

### **1. Middleware de Protección**

```javascript
class MiddlewareCSRF {
  constructor() {
    this.excluir = ['/api/csrf-token', '/api/health'];
    this.metodos = ['POST', 'PUT', 'DELETE', 'PATCH'];
  }

  middleware() {
    return async (req, res, next) => {
      // Saltar rutas excluidas
      if (this.excluir.includes(req.path)) {
        return next();
      }

      // Solo verificar métodos específicos
      if (!this.metodos.includes(req.method)) {
        return next();
      }

      try {
        const esValido = await this.validarPeticion(req);

        if (!esValido) {
          return res.status(403).json({
            error: 'CSRF token inválido o faltante',
          });
        }

        next();
      } catch (error) {
        res.status(500).json({
          error: 'Error al validar CSRF',
        });
      }
    };
  }

  async validarPeticion(req) {
    // Obtener token del header o body
    const token = req.headers['x-csrf-token'] || req.body.csrfToken;

    if (!token) {
      return false;
    }

    // Validar token
    const generador = new GeneradorTokenCSRF();
    const resultado = generador.validarToken(token, req.sessionID);

    return resultado.esValido;
  }
}

// Uso en Express
const proteccionCSRF = new MiddlewareCSRF();
app.use(proteccionCSRF.middleware());
```

### **2. Componente React con CSRF**

```javascript
import React, { useState, useEffect } from 'react';

const FormularioSeguro = ({ onSubmit }) => {
  const [csrfToken, setCsrfToken] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
  });

  // Obtener token CSRF al montar
  useEffect(() => {
    const obtenerToken = async () => {
      try {
        const response = await fetch('/api/csrf-token', {
          credentials: 'include',
        });
        const data = await response.json();
        setCsrfToken(data.token);
      } catch (error) {
        console.error('Error al obtener token CSRF:', error);
      }
    };

    obtenerToken();
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const response = await fetch('/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          csrfToken,
        }),
      });

      if (response.ok) {
        onSubmit(formData);
      } else {
        throw new Error('Error al enviar formulario');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="hidden"
        name="csrfToken"
        value={csrfToken}
      />

      <input
        type="text"
        value={formData.nombre}
        onChange={e => setFormData({ ...formData, nombre: e.target.value })}
        placeholder="Nombre"
      />

      <input
        type="email"
        value={formData.email}
        onChange={e => setFormData({ ...formData, email: e.target.value })}
        placeholder="Email"
      />

      <button type="submit">Enviar</button>
    </form>
  );
};

export default FormularioSeguro;
```

---

## 🔧 Casos de Uso Específicos

### **1. API REST con CSRF**

```javascript
class APISecuraCSRF {
  constructor() {
    this.proteccionCSRF = new MiddlewareCSRF();
  }

  configurarRutas(app) {
    // Ruta para obtener token
    app.get('/api/csrf-token', (req, res) => {
      const generador = new GeneradorTokenCSRF();
      const { token } = generador.generarToken(req.sessionID);

      res.json({ token });
    });

    // Aplicar protección CSRF
    app.use(this.proteccionCSRF.middleware());

    // Rutas protegidas
    app.post('/api/usuarios', this.crearUsuario);
    app.put('/api/usuarios/:id', this.actualizarUsuario);
    app.delete('/api/usuarios/:id', this.eliminarUsuario);
  }

  crearUsuario(req, res) {
    // Lógica para crear usuario
    res.json({ mensaje: 'Usuario creado' });
  }

  actualizarUsuario(req, res) {
    // Lógica para actualizar usuario
    res.json({ mensaje: 'Usuario actualizado' });
  }

  eliminarUsuario(req, res) {
    // Lógica para eliminar usuario
    res.json({ mensaje: 'Usuario eliminado' });
  }
}
```

### **2. Sistema de Autenticación**

```javascript
class SistemaAutenticacion {
  constructor() {
    this.generadorCSRF = new GeneradorTokenCSRF();
  }

  async login(req, res) {
    const { email, password } = req.body;

    try {
      // Verificar credenciales
      const usuario = await this.verificarCredenciales(email, password);

      if (!usuario) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      // Crear sesión
      req.session.usuarioId = usuario.id;
      req.session.email = usuario.email;

      // Generar token CSRF
      const { token } = this.generadorCSRF.generarToken(req.sessionID);
      req.session.csrfToken = token;

      res.json({
        usuario: { id: usuario.id, email: usuario.email },
        csrfToken: token,
      });
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async logout(req, res) {
    // Destruir sesión
    req.session.destroy(err => {
      if (err) {
        return res.status(500).json({ error: 'Error al cerrar sesión' });
      }

      res.json({ mensaje: 'Sesión cerrada' });
    });
  }
}
```

### **3. Formulario de Subida de Archivos**

```javascript
class SubidaSegura {
  constructor() {
    this.clienteCSRF = new ClienteCSRF();
  }

  async subirArchivo(archivo) {
    const formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('csrfToken', this.clienteCSRF.obtenerTokenActual());

    try {
      const response = await fetch('/api/subir', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Error al subir archivo');
      }

      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
}

// Uso en formulario
document.getElementById('formSubida').addEventListener('submit', async e => {
  e.preventDefault();

  const archivo = document.getElementById('archivo').files[0];
  const subida = new SubidaSegura();

  try {
    const resultado = await subida.subirArchivo(archivo);
    console.log('Archivo subido:', resultado);
  } catch (error) {
    console.error('Error al subir:', error);
  }
});
```

---

## 🧪 Testing de Protección CSRF

### **1. Pruebas de Seguridad**

```javascript
class TestCSRF {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async probarSinToken() {
    try {
      const response = await fetch(`${this.baseURL}/api/usuarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: 'Test',
          email: 'test@test.com',
        }),
      });

      // Debe fallar (403)
      return response.status === 403;
    } catch (error) {
      return false;
    }
  }

  async probarTokenInvalido() {
    try {
      const response = await fetch(`${this.baseURL}/api/usuarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': 'token-invalido',
        },
        body: JSON.stringify({
          nombre: 'Test',
          email: 'test@test.com',
        }),
      });

      // Debe fallar (403)
      return response.status === 403;
    } catch (error) {
      return false;
    }
  }

  async probarTokenValido() {
    try {
      // Obtener token válido
      const tokenResponse = await fetch(`${this.baseURL}/api/csrf-token`);
      const { token } = await tokenResponse.json();

      // Usar token válido
      const response = await fetch(`${this.baseURL}/api/usuarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': token,
        },
        body: JSON.stringify({
          nombre: 'Test',
          email: 'test@test.com',
        }),
      });

      // Debe funcionar (200)
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  async ejecutarPruebas() {
    console.log('Ejecutando pruebas CSRF...');

    const resultados = {
      sinToken: await this.probarSinToken(),
      tokenInvalido: await this.probarTokenInvalido(),
      tokenValido: await this.probarTokenValido(),
    };

    console.log('Resultados:', resultados);
    return resultados;
  }
}

// Uso
const tester = new TestCSRF('https://miapp.com');
tester.ejecutarPruebas();
```

---

## 📋 Checklist de Protección CSRF

### **✅ Implementación**

- [ ] Generar tokens CSRF únicos por sesión
- [ ] Validar tokens en todas las peticiones mutantes
- [ ] Usar headers personalizados para AJAX
- [ ] Implementar validación de origen/referer
- [ ] Configurar cookies SameSite
- [ ] Usar métodos HTTP apropiados (POST, PUT, DELETE)

### **✅ Configuración**

- [ ] Configurar CORS correctamente
- [ ] Usar HTTPS en producción
- [ ] Configurar headers de seguridad
- [ ] Implementar expiración de tokens
- [ ] Configurar cookies httpOnly
- [ ] Usar CSP para prevenir inyección

### **✅ Testing**

- [ ] Probar sin token CSRF
- [ ] Probar con token inválido
- [ ] Probar con token expirado
- [ ] Probar desde origen diferente
- [ ] Verificar funcionamiento normal
- [ ] Probar con diferentes navegadores

---

## 🎓 Ejercicios Prácticos

### **Ejercicio 1: Implementar Token CSRF**

Crear un sistema completo de tokens CSRF para un formulario de contacto.

### **Ejercicio 2: Validación de Origen**

Implementar validación de origen para una API REST.

### **Ejercicio 3: Protección con SameSite**

Configurar cookies SameSite para prevenir CSRF.

### **Ejercicio 4: Testing de Seguridad**

Crear suite de pruebas para verificar protección CSRF.

---

## 🔗 Referencias

- **OWASP CSRF Prevention Cheat Sheet**
- **MDN SameSite Cookies**
- **RFC 6265 - HTTP State Management Mechanism**
- **Web Security Guidelines**

---

_Este documento es parte del programa de entrenamiento WorldSkills - Día 4: Validaciones y Seguridad Frontend_
