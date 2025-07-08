# 🔍 Patrones de Validación para Formularios

## 📋 Índice

1. [Patrones de Validación con RegExp](#patrones-de-validación-con-regexp)
2. [Validación de Campos Específicos](#validación-de-campos-específicos)
3. [Validación en Tiempo Real](#validación-en-tiempo-real)
4. [Validación de Archivos](#validación-de-archivos)
5. [Mensajes de Error Personalizados](#mensajes-de-error-personalizados)
6. [Validación de Formularios Complejos](#validación-de-formularios-complejos)
7. [Herramientas y Librerías](#herramientas-y-librerías)

---

## 🎯 Patrones de Validación con RegExp

### **Email**

```javascript
// Patrón básico de email
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Patrón más estricto
const emailStrictPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Validación completa de email
const validarEmail = email => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return {
    esValido: pattern.test(email),
    mensaje: pattern.test(email) ? '' : 'Formato de email inválido',
  };
};
```

### **Contraseña Segura**

```javascript
// Contraseña fuerte: 8+ caracteres, mayúscula, minúscula, número, símbolo
const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Validación por niveles
const validarPassword = password => {
  const criterios = {
    longitud: password.length >= 8,
    mayuscula: /[A-Z]/.test(password),
    minuscula: /[a-z]/.test(password),
    numero: /\d/.test(password),
    simbolo: /[@$!%*?&]/.test(password),
  };

  const cumplidas = Object.values(criterios).filter(Boolean).length;
  const fortaleza =
    cumplidas < 3 ? 'débil' : cumplidas < 5 ? 'media' : 'fuerte';

  return {
    esValido: cumplidas === 5,
    fortaleza,
    criterios,
    mensaje:
      cumplidas === 5 ? '' : 'La contraseña debe cumplir todos los criterios',
  };
};
```

### **Teléfono**

```javascript
// Teléfono colombiano
const telefonoColombiano =
  /^(\+57|57)?[\s-]?[3][0-9]{2}[\s-]?[0-9]{3}[\s-]?[0-9]{4}$/;

// Teléfono internacional
const telefonoInternacional = /^\+?[1-9]\d{1,14}$/;

// Validación flexible de teléfono
const validarTelefono = telefono => {
  // Limpiar el número
  const numeroLimpio = telefono.replace(/[\s-()]/g, '');

  // Patrones para diferentes formatos
  const patrones = {
    colombiano: /^(\+57|57)?3[0-9]{9}$/,
    internacional: /^\+?[1-9]\d{1,14}$/,
  };

  return {
    esValido:
      patrones.colombiano.test(numeroLimpio) ||
      patrones.internacional.test(numeroLimpio),
    formato: patrones.colombiano.test(numeroLimpio)
      ? 'colombiano'
      : 'internacional',
    mensaje:
      patrones.colombiano.test(numeroLimpio) ||
      patrones.internacional.test(numeroLimpio)
        ? ''
        : 'Formato de teléfono inválido',
  };
};
```

### **Documento de Identidad**

```javascript
// Cédula colombiana
const cedulaPattern = /^[0-9]{6,10}$/;

// Validación de cédula con dígito verificador
const validarCedula = cedula => {
  const numero = cedula.replace(/\D/g, '');

  if (numero.length < 6 || numero.length > 10) {
    return {
      esValido: false,
      mensaje: 'La cédula debe tener entre 6 y 10 dígitos',
    };
  }

  // Algoritmo de validación de cédula colombiana
  const validarDigito = numero => {
    const secuencia = [3, 7, 13, 17, 19, 23, 29, 37, 41, 43];
    let suma = 0;

    for (let i = 0; i < numero.length - 1; i++) {
      suma += parseInt(numero[i]) * secuencia[i];
    }

    const residuo = suma % 11;
    const digitoVerificador = residuo < 2 ? residuo : 11 - residuo;

    return digitoVerificador === parseInt(numero[numero.length - 1]);
  };

  return {
    esValido: validarDigito(numero),
    mensaje: validarDigito(numero) ? '' : 'Número de cédula inválido',
  };
};
```

---

## 🎯 Validación de Campos Específicos

### **Nombre Completo**

```javascript
const validarNombre = nombre => {
  const patronNombre = /^[a-zA-ZÀ-ÿ\s]{2,50}$/;
  const palabras = nombre.trim().split(/\s+/);

  return {
    esValido: patronNombre.test(nombre) && palabras.length >= 2,
    mensaje:
      patronNombre.test(nombre) && palabras.length >= 2
        ? ''
        : 'Ingrese nombre y apellido completos (solo letras)',
  };
};
```

### **Edad**

```javascript
const validarEdad = edad => {
  const edadNum = parseInt(edad);

  return {
    esValido: edadNum >= 18 && edadNum <= 120,
    mensaje:
      edadNum >= 18 && edadNum <= 120
        ? ''
        : 'La edad debe estar entre 18 y 120 años',
  };
};
```

### **URL**

```javascript
const validarURL = url => {
  const patronURL =
    /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

  return {
    esValido: patronURL.test(url),
    mensaje: patronURL.test(url) ? '' : 'Ingrese una URL válida',
  };
};
```

### **Código Postal**

```javascript
const validarCodigoPostal = codigo => {
  const patronColombia = /^[0-9]{6}$/;

  return {
    esValido: patronColombia.test(codigo),
    mensaje: patronColombia.test(codigo)
      ? ''
      : 'Código postal debe tener 6 dígitos',
  };
};
```

---

## ⚡ Validación en Tiempo Real

### **Validador de Formulario Completo**

```javascript
class ValidadorFormulario {
  constructor(formulario) {
    this.formulario = formulario;
    this.reglas = new Map();
    this.errores = new Map();
    this.inicializar();
  }

  // Agregar regla de validación
  agregarRegla(campo, validador, mensaje) {
    if (!this.reglas.has(campo)) {
      this.reglas.set(campo, []);
    }
    this.reglas.get(campo).push({ validador, mensaje });
  }

  // Validar un campo específico
  validarCampo(campo) {
    const elemento = this.formulario.querySelector(`[name="${campo}"]`);
    if (!elemento) return true;

    const valor = elemento.value.trim();
    const reglasCampo = this.reglas.get(campo) || [];

    // Limpiar errores previos
    this.errores.delete(campo);

    // Aplicar validaciones
    for (const regla of reglasCampo) {
      if (!regla.validador(valor)) {
        this.errores.set(campo, regla.mensaje);
        this.mostrarError(campo, regla.mensaje);
        return false;
      }
    }

    this.limpiarError(campo);
    return true;
  }

  // Validar todo el formulario
  validar() {
    let formularioValido = true;

    for (const campo of this.reglas.keys()) {
      if (!this.validarCampo(campo)) {
        formularioValido = false;
      }
    }

    return formularioValido;
  }

  // Mostrar error en el campo
  mostrarError(campo, mensaje) {
    const elemento = this.formulario.querySelector(`[name="${campo}"]`);
    const contenedor = elemento.parentElement;

    // Remover error anterior
    const errorAnterior = contenedor.querySelector('.error-mensaje');
    if (errorAnterior) {
      errorAnterior.remove();
    }

    // Agregar clase de error
    elemento.classList.add('error');

    // Crear mensaje de error
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-mensaje';
    errorDiv.textContent = mensaje;
    contenedor.appendChild(errorDiv);
  }

  // Limpiar error del campo
  limpiarError(campo) {
    const elemento = this.formulario.querySelector(`[name="${campo}"]`);
    const contenedor = elemento.parentElement;

    elemento.classList.remove('error');
    const errorMsg = contenedor.querySelector('.error-mensaje');
    if (errorMsg) {
      errorMsg.remove();
    }
  }

  // Inicializar eventos
  inicializar() {
    // Validación en tiempo real
    this.formulario.addEventListener('input', e => {
      if (e.target.name) {
        this.validarCampo(e.target.name);
      }
    });

    // Validación al enviar
    this.formulario.addEventListener('submit', e => {
      if (!this.validar()) {
        e.preventDefault();
      }
    });
  }
}
```

### **Ejemplo de Uso**

```javascript
// Inicializar validador
const validador = new ValidadorFormulario(
  document.getElementById('miFormulario')
);

// Agregar reglas
validador.agregarRegla(
  'email',
  valor => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor),
  'Email inválido'
);
validador.agregarRegla(
  'email',
  valor => valor.length > 0,
  'El email es requerido'
);

validador.agregarRegla(
  'password',
  valor => valor.length >= 8,
  'Mínimo 8 caracteres'
);
validador.agregarRegla(
  'password',
  valor => /[A-Z]/.test(valor),
  'Debe contener mayúscula'
);
validador.agregarRegla(
  'password',
  valor => /[0-9]/.test(valor),
  'Debe contener número'
);

validador.agregarRegla(
  'telefono',
  valor => /^3[0-9]{9}$/.test(valor.replace(/\D/g, '')),
  'Teléfono inválido'
);
```

---

## 📁 Validación de Archivos

### **Validador de Archivos**

```javascript
class ValidadorArchivos {
  constructor(opciones = {}) {
    this.tiposPermitidos = opciones.tiposPermitidos || [
      'image/jpeg',
      'image/png',
      'image/gif',
    ];
    this.tamanoMaximo = opciones.tamanoMaximo || 5 * 1024 * 1024; // 5MB
    this.cantidadMaxima = opciones.cantidadMaxima || 5;
  }

  validar(archivos) {
    const errores = [];

    // Validar cantidad
    if (archivos.length > this.cantidadMaxima) {
      errores.push(`Máximo ${this.cantidadMaxima} archivos permitidos`);
    }

    // Validar cada archivo
    for (let i = 0; i < archivos.length; i++) {
      const archivo = archivos[i];

      // Validar tipo
      if (!this.tiposPermitidos.includes(archivo.type)) {
        errores.push(`Tipo de archivo no permitido: ${archivo.name}`);
      }

      // Validar tamaño
      if (archivo.size > this.tamanoMaximo) {
        errores.push(
          `Archivo muy grande: ${archivo.name} (${this.formatearTamano(
            archivo.size
          )})`
        );
      }
    }

    return {
      esValido: errores.length === 0,
      errores,
    };
  }

  formatearTamano(bytes) {
    const unidades = ['B', 'KB', 'MB', 'GB'];
    let unidadIndex = 0;

    while (bytes >= 1024 && unidadIndex < unidades.length - 1) {
      bytes /= 1024;
      unidadIndex++;
    }

    return `${bytes.toFixed(1)} ${unidades[unidadIndex]}`;
  }
}

// Uso
const validadorArchivos = new ValidadorArchivos({
  tiposPermitidos: ['image/jpeg', 'image/png', 'application/pdf'],
  tamanoMaximo: 10 * 1024 * 1024, // 10MB
  cantidadMaxima: 3,
});

document.getElementById('inputArchivos').addEventListener('change', e => {
  const resultado = validadorArchivos.validar(e.target.files);

  if (!resultado.esValido) {
    alert('Errores:\n' + resultado.errores.join('\n'));
    e.target.value = '';
  }
});
```

---

## 💬 Mensajes de Error Personalizados

### **Sistema de Mensajes**

```javascript
class SistemaMensajes {
  constructor() {
    this.mensajes = {
      requerido: 'Este campo es requerido',
      email: 'Ingrese un email válido',
      password: 'La contraseña debe tener al menos 8 caracteres',
      confirmPassword: 'Las contraseñas no coinciden',
      telefono: 'Ingrese un número de teléfono válido',
      url: 'Ingrese una URL válida',
      fecha: 'Ingrese una fecha válida',
      numero: 'Ingrese un número válido',
      longitud: 'La longitud no es válida',
      patron: 'El formato no es válido',
    };
  }

  obtener(tipo, parametros = {}) {
    let mensaje = this.mensajes[tipo] || 'Valor inválido';

    // Reemplazar parámetros
    Object.keys(parametros).forEach(key => {
      mensaje = mensaje.replace(`{${key}}`, parametros[key]);
    });

    return mensaje;
  }

  personalizar(tipo, mensaje) {
    this.mensajes[tipo] = mensaje;
  }
}

// Uso
const mensajes = new SistemaMensajes();

// Personalizar mensaje
mensajes.personalizar(
  'email',
  'Por favor, ingrese un correo electrónico válido'
);

// Obtener mensaje
const mensajeError = mensajes.obtener('email');
```

---

## 🏗️ Validación de Formularios Complejos

### **Formulario de Registro Completo**

```javascript
class ValidadorRegistro {
  constructor(formulario) {
    this.formulario = formulario;
    this.validaciones = new Map();
    this.configurarValidaciones();
    this.inicializar();
  }

  configurarValidaciones() {
    // Nombre
    this.validaciones.set('nombre', [
      { validador: v => v.length >= 2, mensaje: 'Mínimo 2 caracteres' },
      {
        validador: v => /^[a-zA-ZÀ-ÿ\s]+$/.test(v),
        mensaje: 'Solo letras y espacios',
      },
    ]);

    // Email
    this.validaciones.set('email', [
      { validador: v => v.length > 0, mensaje: 'Email requerido' },
      {
        validador: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        mensaje: 'Email inválido',
      },
    ]);

    // Contraseña
    this.validaciones.set('password', [
      { validador: v => v.length >= 8, mensaje: 'Mínimo 8 caracteres' },
      { validador: v => /[A-Z]/.test(v), mensaje: 'Debe contener mayúscula' },
      { validador: v => /[a-z]/.test(v), mensaje: 'Debe contener minúscula' },
      { validador: v => /[0-9]/.test(v), mensaje: 'Debe contener número' },
      {
        validador: v => /[!@#$%^&*]/.test(v),
        mensaje: 'Debe contener símbolo',
      },
    ]);

    // Confirmar contraseña
    this.validaciones.set('confirmPassword', [
      {
        validador: v => v === this.formulario.password.value,
        mensaje: 'Las contraseñas no coinciden',
      },
    ]);

    // Teléfono
    this.validaciones.set('telefono', [
      {
        validador: v => /^3[0-9]{9}$/.test(v.replace(/\D/g, '')),
        mensaje: 'Teléfono colombiano inválido',
      },
    ]);

    // Fecha nacimiento
    this.validaciones.set('fechaNacimiento', [
      {
        validador: v => new Date(v) < new Date(),
        mensaje: 'Fecha debe ser anterior a hoy',
      },
      {
        validador: v => this.calcularEdad(v) >= 18,
        mensaje: 'Debe ser mayor de 18 años',
      },
    ]);

    // Términos y condiciones
    this.validaciones.set('terminos', [
      { validador: v => v === true, mensaje: 'Debe aceptar los términos' },
    ]);
  }

  calcularEdad(fechaNacimiento) {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();

    if (
      hoy.getMonth() < nacimiento.getMonth() ||
      (hoy.getMonth() === nacimiento.getMonth() &&
        hoy.getDate() < nacimiento.getDate())
    ) {
      edad--;
    }

    return edad;
  }

  validarCampo(nombreCampo) {
    const elemento = this.formulario[nombreCampo];
    if (!elemento) return true;

    const valor =
      elemento.type === 'checkbox' ? elemento.checked : elemento.value.trim();
    const reglas = this.validaciones.get(nombreCampo) || [];

    for (const regla of reglas) {
      if (!regla.validador(valor)) {
        this.mostrarError(nombreCampo, regla.mensaje);
        return false;
      }
    }

    this.limpiarError(nombreCampo);
    return true;
  }

  validarFormulario() {
    let esValido = true;

    for (const campo of this.validaciones.keys()) {
      if (!this.validarCampo(campo)) {
        esValido = false;
      }
    }

    return esValido;
  }

  mostrarError(campo, mensaje) {
    const elemento = this.formulario[campo];
    const contenedor = elemento.closest('.campo-grupo');

    // Limpiar error anterior
    const errorAnterior = contenedor.querySelector('.error-mensaje');
    if (errorAnterior) {
      errorAnterior.remove();
    }

    // Agregar clase de error
    elemento.classList.add('error');

    // Crear mensaje de error
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-mensaje';
    errorDiv.textContent = mensaje;
    contenedor.appendChild(errorDiv);
  }

  limpiarError(campo) {
    const elemento = this.formulario[campo];
    const contenedor = elemento.closest('.campo-grupo');

    elemento.classList.remove('error');
    const errorMsg = contenedor.querySelector('.error-mensaje');
    if (errorMsg) {
      errorMsg.remove();
    }
  }

  inicializar() {
    // Validación en tiempo real
    this.formulario.addEventListener('input', e => {
      if (e.target.name && this.validaciones.has(e.target.name)) {
        this.validarCampo(e.target.name);
      }
    });

    // Validación de checkbox
    this.formulario.addEventListener('change', e => {
      if (
        e.target.type === 'checkbox' &&
        this.validaciones.has(e.target.name)
      ) {
        this.validarCampo(e.target.name);
      }
    });

    // Validación al enviar
    this.formulario.addEventListener('submit', e => {
      if (!this.validarFormulario()) {
        e.preventDefault();
      }
    });
  }
}
```

---

## 🛠️ Herramientas y Librerías

### **Librerías Recomendadas**

```javascript
// Validator.js - Validación de strings
import validator from 'validator';

const validarEmail = email => validator.isEmail(email);
const validarURL = url => validator.isURL(url);
const validarTelefono = tel => validator.isMobilePhone(tel, 'es-CO');

// Joi - Validación de objetos
import Joi from 'joi';

const esquemaUsuario = Joi.object({
  nombre: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  edad: Joi.number().integer().min(18).max(120),
  telefono: Joi.string().pattern(/^3[0-9]{9}$/),
});

// Yup - Validación para formularios
import * as yup from 'yup';

const esquemaFormulario = yup.object().shape({
  nombre: yup.string().min(2).max(50).required('Nombre requerido'),
  email: yup.string().email('Email inválido').required('Email requerido'),
  password: yup.string().min(8).required('Contraseña requerida'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Las contraseñas no coinciden')
    .required('Confirmación requerida'),
});
```

### **Integración con Frameworks**

```javascript
// React Hook Form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

const FormularioReact = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(esquemaFormulario),
  });

  const onSubmit = data => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}

      <input
        type="password"
        {...register('password')}
      />
      {errors.password && <span>{errors.password.message}</span>}

      <button type="submit">Enviar</button>
    </form>
  );
};
```

---

## 🎯 Casos de Uso Avanzados

### **Validación Condicional**

```javascript
class ValidadorCondicional {
  constructor() {
    this.reglas = [];
  }

  cuandoSea(campo, condicion, entonces) {
    this.reglas.push({ campo, condicion, entonces });
    return this;
  }

  validar(datos) {
    const errores = {};

    for (const regla of this.reglas) {
      if (regla.condicion(datos[regla.campo])) {
        const resultado = regla.entonces(datos);
        if (resultado && !resultado.esValido) {
          errores[regla.campo] = resultado.mensaje;
        }
      }
    }

    return {
      esValido: Object.keys(errores).length === 0,
      errores,
    };
  }
}

// Uso
const validador = new ValidadorCondicional();

validador
  .cuandoSea(
    'tipoUsuario',
    valor => valor === 'empresa',
    datos => {
      if (!datos.nit) {
        return { esValido: false, mensaje: 'NIT requerido para empresas' };
      }
      return { esValido: true };
    }
  )
  .cuandoSea(
    'tipoUsuario',
    valor => valor === 'persona',
    datos => {
      if (!datos.cedula) {
        return { esValido: false, mensaje: 'Cédula requerida para personas' };
      }
      return { esValido: true };
    }
  );
```

### **Validación Asíncrona**

```javascript
class ValidadorAsincrono {
  constructor() {
    this.validaciones = new Map();
  }

  agregarValidacion(campo, validador) {
    this.validaciones.set(campo, validador);
  }

  async validar(datos) {
    const resultados = await Promise.all(
      Array.from(this.validaciones.entries()).map(
        async ([campo, validador]) => {
          const resultado = await validador(datos[campo]);
          return { campo, resultado };
        }
      )
    );

    const errores = {};
    for (const { campo, resultado } of resultados) {
      if (!resultado.esValido) {
        errores[campo] = resultado.mensaje;
      }
    }

    return {
      esValido: Object.keys(errores).length === 0,
      errores,
    };
  }
}

// Uso
const validador = new ValidadorAsincrono();

// Validar que el email no esté registrado
validador.agregarValidacion('email', async email => {
  const response = await fetch(`/api/verificar-email?email=${email}`);
  const data = await response.json();

  return {
    esValido: !data.existe,
    mensaje: data.existe ? 'Email ya registrado' : '',
  };
});
```

---

## 📚 Mejores Prácticas

### **✅ Hacer**

- Validar en frontend Y backend
- Proporcionar feedback inmediato
- Usar mensajes de error claros
- Implementar validación progresiva
- Sanitizar datos antes de validar
- Usar patrones regex probados
- Validar archivos antes de subir

### **❌ Evitar**

- Confiar solo en validación frontend
- Mensajes de error genéricos
- Validación que bloquee la UI
- Regex complejos sin documentar
- Validar datos ya procesados
- Ignorar casos edge
- Validación inconsistente

---

## 🎓 Ejercicios Prácticos

### **Ejercicio 1: Validador de Formulario de Contacto**

Crear un validador completo para un formulario de contacto con:

- Nombre (requerido, solo letras)
- Email (requerido, formato válido)
- Teléfono (opcional, formato colombiano)
- Mensaje (requerido, 10-500 caracteres)

### **Ejercicio 2: Validador de Registro de Usuario**

Implementar validación en tiempo real para registro con:

- Verificación de email disponible (async)
- Validación de contraseña fuerte
- Confirmación de contraseña
- Aceptación de términos

### **Ejercicio 3: Validador de Subida de Archivos**

Crear validador para múltiples archivos con:

- Tipos permitidos configurables
- Límite de tamaño por archivo
- Límite de cantidad total
- Vista previa de imágenes

---

## 🔗 Referencias Útiles

- **MDN Web Docs**: Validación de formularios HTML5
- **Regex101**: Herramienta para probar expresiones regulares
- **Validator.js**: Librería de validación de strings
- **Yup**: Schema builder para validación de objetos
- **OWASP**: Guías de seguridad para validación de entrada

---

_Este documento es parte del programa de entrenamiento WorldSkills - Día 4: Validaciones y Seguridad Frontend_
