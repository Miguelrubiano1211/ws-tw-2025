# 📝 Guía de Validación de Formularios con JavaScript

## Fundamentos de Validación

### Tipos de Validación

```javascript
// 1. Validación HTML5 (nativa)
// 2. Validación JavaScript (personalizada)
// 3. Validación en tiempo real
// 4. Validación al enviar formulario
```

## Validación HTML5

### Atributos de Validación

```html
<!-- Campos requeridos -->
<input
  type="text"
  name="nombre"
  required />

<!-- Patrones con regex -->
<input
  type="text"
  name="telefono"
  pattern="[0-9]{10}"
  title="10 dígitos" />

<!-- Longitud mínima/máxima -->
<input
  type="text"
  name="password"
  minlength="8"
  maxlength="20" />

<!-- Valores numéricos -->
<input
  type="number"
  name="edad"
  min="18"
  max="99" />

<!-- Tipos específicos -->
<input
  type="email"
  name="email"
  required />
<input
  type="url"
  name="website" />
<input
  type="tel"
  name="telefono" />
```

### Mensajes Personalizados

```javascript
// Personalizar mensajes de validación
input.addEventListener('invalid', function (e) {
  if (e.target.validity.valueMissing) {
    e.target.setCustomValidity('Este campo es obligatorio');
  } else if (e.target.validity.patternMismatch) {
    e.target.setCustomValidity('Formato inválido');
  } else if (e.target.validity.tooShort) {
    e.target.setCustomValidity('Muy corto');
  } else if (e.target.validity.tooLong) {
    e.target.setCustomValidity('Muy largo');
  }
});

// Limpiar mensaje al corregir
input.addEventListener('input', function (e) {
  e.target.setCustomValidity('');
});
```

## Validación JavaScript Personalizada

### Clase ValidadorFormulario

```javascript
class ValidadorFormulario {
  constructor(formulario) {
    this.formulario = formulario;
    this.errores = {};
    this.reglas = {};
    this.inicializar();
  }

  inicializar() {
    // Validación en tiempo real
    this.formulario.addEventListener('input', e => {
      this.validarCampo(e.target);
    });

    // Validación al enviar
    this.formulario.addEventListener('submit', e => {
      e.preventDefault();
      this.validarFormulario();
    });
  }

  agregarRegla(campo, reglas) {
    this.reglas[campo] = reglas;
  }

  validarCampo(campo) {
    const nombre = campo.name;
    const valor = campo.value;
    const reglas = this.reglas[nombre];

    if (!reglas) return true;

    const errores = [];

    // Validar cada regla
    for (const regla of reglas) {
      const resultado = regla.validar(valor);
      if (!resultado.valido) {
        errores.push(resultado.mensaje);
      }
    }

    // Mostrar/ocultar errores
    if (errores.length > 0) {
      this.errores[nombre] = errores;
      this.mostrarError(campo, errores[0]);
    } else {
      delete this.errores[nombre];
      this.ocultarError(campo);
    }

    return errores.length === 0;
  }

  validarFormulario() {
    const campos = this.formulario.querySelectorAll('[name]');
    let formularioValido = true;

    campos.forEach(campo => {
      const valido = this.validarCampo(campo);
      if (!valido) formularioValido = false;
    });

    if (formularioValido) {
      this.onExito();
    } else {
      this.onError();
    }
  }

  mostrarError(campo, mensaje) {
    campo.classList.add('error');

    let errorDiv = campo.parentNode.querySelector('.error-message');
    if (!errorDiv) {
      errorDiv = document.createElement('div');
      errorDiv.className = 'error-message';
      campo.parentNode.appendChild(errorDiv);
    }

    errorDiv.textContent = mensaje;
  }

  ocultarError(campo) {
    campo.classList.remove('error');

    const errorDiv = campo.parentNode.querySelector('.error-message');
    if (errorDiv) {
      errorDiv.remove();
    }
  }

  onExito() {
    console.log('Formulario válido');
    // Enviar formulario
  }

  onError() {
    console.log('Formulario inválido');
    // Enfocar primer campo con error
    const primerError = this.formulario.querySelector('.error');
    if (primerError) {
      primerError.focus();
    }
  }
}
```

### Reglas de Validación

```javascript
// Reglas predefinidas
const Reglas = {
  requerido: {
    validar: valor => ({
      valido: valor.trim().length > 0,
      mensaje: 'Este campo es requerido',
    }),
  },

  email: {
    validar: valor => ({
      valido: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor),
      mensaje: 'Email inválido',
    }),
  },

  telefono: {
    validar: valor => ({
      valido: /^[0-9]{10}$/.test(valor),
      mensaje: 'Teléfono debe tener 10 dígitos',
    }),
  },

  longitudMinima: min => ({
    validar: valor => ({
      valido: valor.length >= min,
      mensaje: `Mínimo ${min} caracteres`,
    }),
  }),

  longitudMaxima: max => ({
    validar: valor => ({
      valido: valor.length <= max,
      mensaje: `Máximo ${max} caracteres`,
    }),
  }),

  numero: {
    validar: valor => ({
      valido: /^[0-9]+$/.test(valor),
      mensaje: 'Solo números',
    }),
  },

  letras: {
    validar: valor => ({
      valido: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor),
      mensaje: 'Solo letras',
    }),
  },

  password: {
    validar: valor => ({
      valido: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/.test(
        valor
      ),
      mensaje: 'Mínimo 8 caracteres, una mayúscula, una minúscula y un número',
    }),
  },

  confirmarPassword: passwordCampo => ({
    validar: valor => ({
      valido: valor === passwordCampo.value,
      mensaje: 'Las contraseñas no coinciden',
    }),
  }),
};
```

## Uso Práctico

### Configuración de Formulario

```javascript
// Inicializar validador
const validador = new ValidadorFormulario(
  document.getElementById('formulario')
);

// Configurar reglas
validador.agregarRegla('nombre', [
  Reglas.requerido,
  Reglas.letras,
  Reglas.longitudMinima(2),
]);

validador.agregarRegla('email', [Reglas.requerido, Reglas.email]);

validador.agregarRegla('telefono', [Reglas.requerido, Reglas.telefono]);

validador.agregarRegla('password', [Reglas.requerido, Reglas.password]);

validador.agregarRegla('confirmarPassword', [
  Reglas.requerido,
  Reglas.confirmarPassword(document.querySelector('[name="password"]')),
]);
```

### Validación Específica por Contexto

```javascript
// Validador para formulario de login
class ValidadorLogin {
  constructor(formulario) {
    this.formulario = formulario;
    this.inicializar();
  }

  inicializar() {
    this.formulario.addEventListener('submit', e => {
      e.preventDefault();
      this.validarLogin();
    });
  }

  validarLogin() {
    const email = this.formulario.querySelector('[name="email"]').value;
    const password = this.formulario.querySelector('[name="password"]').value;

    const errores = [];

    if (!email) {
      errores.push('Email es requerido');
    } else if (!this.validarEmail(email)) {
      errores.push('Email inválido');
    }

    if (!password) {
      errores.push('Contraseña es requerida');
    } else if (password.length < 6) {
      errores.push('Contraseña muy corta');
    }

    if (errores.length > 0) {
      this.mostrarErrores(errores);
    } else {
      this.enviarLogin(email, password);
    }
  }

  validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  mostrarErrores(errores) {
    const errorDiv = document.getElementById('errores');
    errorDiv.innerHTML = errores.map(error => `<p>${error}</p>`).join('');
    errorDiv.style.display = 'block';
  }

  enviarLogin(email, password) {
    // Enviar datos
    console.log('Login:', { email, password });
  }
}
```

## Validación en Tiempo Real

### Validación mientras se escribe

```javascript
function validacionTiempoReal() {
  const inputs = document.querySelectorAll('input[data-validate]');

  inputs.forEach(input => {
    // Debounce para evitar validación excesiva
    let timeoutId;

    input.addEventListener('input', function (e) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        validarCampoTiempoReal(e.target);
      }, 300);
    });

    // Validación al perder el foco
    input.addEventListener('blur', function (e) {
      validarCampoTiempoReal(e.target);
    });
  });
}

function validarCampoTiempoReal(campo) {
  const tipo = campo.dataset.validate;
  const valor = campo.value;

  let valido = true;
  let mensaje = '';

  switch (tipo) {
    case 'email':
      valido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
      mensaje = 'Email inválido';
      break;

    case 'telefono':
      valido = /^[0-9]{10}$/.test(valor);
      mensaje = 'Teléfono debe tener 10 dígitos';
      break;

    case 'password':
      valido = valor.length >= 8;
      mensaje = 'Mínimo 8 caracteres';
      break;
  }

  if (valido) {
    campo.classList.remove('error');
    campo.classList.add('valid');
    ocultarMensaje(campo);
  } else {
    campo.classList.remove('valid');
    campo.classList.add('error');
    mostrarMensaje(campo, mensaje);
  }
}
```

## Validación de Archivos

### Validación de subida de archivos

```javascript
function validarArchivos(input) {
  const archivos = input.files;
  const errores = [];

  // Validar cantidad
  if (archivos.length > 5) {
    errores.push('Máximo 5 archivos');
  }

  // Validar cada archivo
  for (let archivo of archivos) {
    // Validar tamaño (2MB máximo)
    if (archivo.size > 2 * 1024 * 1024) {
      errores.push(`${archivo.name} es muy grande (máximo 2MB)`);
    }

    // Validar tipo
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif'];
    if (!tiposPermitidos.includes(archivo.type)) {
      errores.push(`${archivo.name} no es un tipo válido`);
    }
  }

  return errores;
}

// Uso
document.getElementById('archivos').addEventListener('change', function (e) {
  const errores = validarArchivos(e.target);

  if (errores.length > 0) {
    mostrarErrores(errores);
    e.target.value = ''; // Limpiar selección
  }
});
```

## Validación de Formularios Complejos

### Validación condicional

```javascript
function validacionCondicional() {
  const tipoUsuario = document.getElementById('tipo-usuario');
  const camposEmpresa = document.querySelectorAll('.campo-empresa');

  tipoUsuario.addEventListener('change', function (e) {
    const esEmpresa = e.target.value === 'empresa';

    camposEmpresa.forEach(campo => {
      if (esEmpresa) {
        campo.style.display = 'block';
        campo.querySelector('input').required = true;
      } else {
        campo.style.display = 'none';
        campo.querySelector('input').required = false;
      }
    });
  });
}
```

### Validación de formulario paso a paso

```javascript
class FormularioPasos {
  constructor(formulario) {
    this.formulario = formulario;
    this.pasos = formulario.querySelectorAll('.paso');
    this.pasoActual = 0;
    this.inicializar();
  }

  inicializar() {
    this.mostrarPaso(0);

    // Botones de navegación
    this.formulario.addEventListener('click', e => {
      if (e.target.classList.contains('siguiente')) {
        this.siguientePaso();
      } else if (e.target.classList.contains('anterior')) {
        this.pasoAnterior();
      }
    });
  }

  siguientePaso() {
    if (this.validarPasoActual()) {
      this.pasoActual++;
      this.mostrarPaso(this.pasoActual);
    }
  }

  pasoAnterior() {
    this.pasoActual--;
    this.mostrarPaso(this.pasoActual);
  }

  validarPasoActual() {
    const paso = this.pasos[this.pasoActual];
    const campos = paso.querySelectorAll('input[required]');

    let valido = true;

    campos.forEach(campo => {
      if (!campo.value.trim()) {
        this.mostrarError(campo, 'Campo requerido');
        valido = false;
      }
    });

    return valido;
  }

  mostrarPaso(numero) {
    this.pasos.forEach((paso, index) => {
      paso.style.display = index === numero ? 'block' : 'none';
    });
  }
}
```

## Estilos CSS para Validación

### Clases de estado

```css
/* Estados de validación */
.form-field {
  margin-bottom: 1rem;
}

.form-field input {
  width: 100%;
  padding: 0.5rem;
  border: 2px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s;
}

.form-field input:focus {
  outline: none;
  border-color: #007bff;
}

.form-field input.valid {
  border-color: #28a745;
}

.form-field input.error {
  border-color: #dc3545;
}

/* Mensajes de error */
.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

/* Indicadores visuales */
.form-field.valid::after {
  content: '✓';
  color: #28a745;
  float: right;
  margin-top: -2rem;
  margin-right: 0.5rem;
}

.form-field.error::after {
  content: '✗';
  color: #dc3545;
  float: right;
  margin-top: -2rem;
  margin-right: 0.5rem;
}
```

## Utilidades y Funciones Helper

### Funciones utilitarias

```javascript
// Utilidades para validación
const Utils = {
  limpiarTexto: texto => texto.trim(),

  escaparHTML: texto => {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
  },

  formatearTelefono: telefono => {
    return telefono.replace(/\D/g, '');
  },

  validarCedula: cedula => {
    // Algoritmo de validación de cédula
    const digits = cedula.replace(/\D/g, '');
    if (digits.length !== 10) return false;

    // Implementar algoritmo específico
    return true;
  },

  validarRUT: rut => {
    // Validación de RUT (Colombia)
    // Implementar algoritmo específico
    return true;
  },
};
```

---

## 🎯 Mejores Prácticas WorldSkills

### 1. Validación Completa

- Validar en frontend Y backend
- Usar HTML5 + JavaScript personalizado
- Implementar validación en tiempo real
- Proporcionar feedback inmediato

### 2. Experiencia de Usuario

- Mensajes de error claros
- Indicadores visuales
- Enfocar campos con errores
- Mostrar progreso en formularios largos

### 3. Seguridad

- Sanitizar entrada de datos
- Escapar HTML
- Validar tipos de archivo
- Limitar tamaño de datos

### 4. Accesibilidad

- Usar atributos ARIA
- Asociar labels correctamente
- Navegación por teclado
- Lectores de pantalla

### 5. Rendimiento

- Debouncing para validación en tiempo real
- Validación eficiente
- Lazy loading de validadores
- Cleanup de event listeners

### Errores Comunes a Evitar

- Solo validar en frontend
- Mensajes de error confusos
- No limpiar entrada de usuario
- Validación inconsistente
- No considerar casos edge
