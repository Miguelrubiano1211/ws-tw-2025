/**
 * Día 6: DOM y Eventos - Ejercicio 7
 * Tema: Validación de formularios con JavaScript
 * Dificultad: Intermedia-Avanzada
 * Tiempo estimado: 40 minutos
 */

// ================================
// VALIDACIÓN DE FORMULARIOS
// ================================

console.log('=== Ejercicio 7: Validación de formularios ===');

// 1. Validaciones básicas
const validaciones = {
  // Validación de email
  email: {
    patron: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    mensaje: 'Por favor ingresa un email válido',
    validar: function (valor) {
      return this.patron.test(valor);
    },
  },

  // Validación de contraseña
  password: {
    patron:
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    mensaje:
      'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial',
    validar: function (valor) {
      return this.patron.test(valor);
    },
  },

  // Validación de teléfono
  telefono: {
    patron: /^(\+57|57)?[0-9]{10}$/,
    mensaje: 'Ingresa un número de teléfono válido (10 dígitos)',
    validar: function (valor) {
      return this.patron.test(valor.replace(/\s/g, ''));
    },
  },

  // Validación de nombre
  nombre: {
    patron: /^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]{2,50}$/,
    mensaje: 'El nombre debe tener entre 2 y 50 caracteres, solo letras',
    validar: function (valor) {
      return this.patron.test(valor.trim());
    },
  },

  // Validación de edad
  edad: {
    validar: function (valor) {
      const edad = parseInt(valor);
      return edad >= 18 && edad <= 120;
    },
    mensaje: 'La edad debe estar entre 18 y 120 años',
  },

  // Validación de fecha
  fecha: {
    validar: function (valor) {
      const fecha = new Date(valor);
      const hoy = new Date();
      return fecha <= hoy;
    },
    mensaje: 'La fecha no puede ser futura',
  },
};

// 2. Validador personalizado
class ValidadorFormulario {
  constructor(formulario) {
    this.formulario = formulario;
    this.errores = {};
    this.configurarEventos();
  }

  configurarEventos() {
    // Validación en tiempo real
    this.formulario.addEventListener('input', e => {
      this.validarCampo(e.target);
    });

    // Validación al perder foco
    this.formulario.addEventListener(
      'blur',
      e => {
        this.validarCampo(e.target);
      },
      true
    );

    // Validación al enviar
    this.formulario.addEventListener('submit', e => {
      e.preventDefault();
      this.validarFormulario();
    });
  }

  validarCampo(campo) {
    const valor = campo.value.trim();
    const nombre = campo.name;
    const tipo = campo.type;
    const requerido = campo.required;

    // Limpiar errores previos
    this.limpiarError(campo);

    // Validar si es requerido
    if (requerido && !valor) {
      this.mostrarError(campo, 'Este campo es requerido');
      return false;
    }

    // Si está vacío y no es requerido, es válido
    if (!valor && !requerido) {
      return true;
    }

    // Validación por tipo
    let esValido = true;
    let mensaje = '';

    // Validación por tipo de input
    if (tipo === 'email') {
      esValido = validaciones.email.validar(valor);
      mensaje = validaciones.email.mensaje;
    } else if (tipo === 'password') {
      esValido = validaciones.password.validar(valor);
      mensaje = validaciones.password.mensaje;
    } else if (tipo === 'tel') {
      esValido = validaciones.telefono.validar(valor);
      mensaje = validaciones.telefono.mensaje;
    } else if (tipo === 'number') {
      if (nombre === 'edad') {
        esValido = validaciones.edad.validar(valor);
        mensaje = validaciones.edad.mensaje;
      }
    } else if (tipo === 'date') {
      esValido = validaciones.fecha.validar(valor);
      mensaje = validaciones.fecha.mensaje;
    } else if (tipo === 'text') {
      if (nombre === 'nombre') {
        esValido = validaciones.nombre.validar(valor);
        mensaje = validaciones.nombre.mensaje;
      }
    }

    // Validaciones personalizadas por atributo data
    const validacionPersonalizada = campo.dataset.validacion;
    if (validacionPersonalizada) {
      const resultado = this.validacionPersonalizada(
        valor,
        validacionPersonalizada
      );
      if (!resultado.valido) {
        esValido = false;
        mensaje = resultado.mensaje;
      }
    }

    // Mostrar error si es inválido
    if (!esValido) {
      this.mostrarError(campo, mensaje);
      return false;
    }

    // Mostrar como válido
    this.mostrarValido(campo);
    return true;
  }

  validacionPersonalizada(valor, tipo) {
    switch (tipo) {
      case 'confirmar-password':
        const password = this.formulario.querySelector(
          'input[type="password"]'
        ).value;
        return {
          valido: valor === password,
          mensaje: 'Las contraseñas no coinciden',
        };

      case 'cedula':
        return {
          valido: /^[0-9]{8,10}$/.test(valor),
          mensaje: 'La cédula debe tener entre 8 y 10 dígitos',
        };

      case 'url':
        return {
          valido: /^https?:\/\/.+$/.test(valor),
          mensaje: 'Ingresa una URL válida',
        };

      case 'codigo-postal':
        return {
          valido: /^[0-9]{5}$/.test(valor),
          mensaje: 'El código postal debe tener 5 dígitos',
        };

      default:
        return { valido: true, mensaje: '' };
    }
  }

  mostrarError(campo, mensaje) {
    const grupoFormulario = campo.closest('.form-group, .mb-3');
    const contenedorMensaje =
      grupoFormulario.querySelector('.mensaje-error') ||
      this.crearContenedorMensaje(grupoFormulario);

    campo.classList.add('is-invalid');
    campo.classList.remove('is-valid');

    contenedorMensaje.textContent = mensaje;
    contenedorMensaje.style.display = 'block';

    this.errores[campo.name] = mensaje;

    console.log(`❌ Error en ${campo.name}: ${mensaje}`);
  }

  mostrarValido(campo) {
    const grupoFormulario = campo.closest('.form-group, .mb-3');
    const contenedorMensaje = grupoFormulario.querySelector('.mensaje-error');

    campo.classList.add('is-valid');
    campo.classList.remove('is-invalid');

    if (contenedorMensaje) {
      contenedorMensaje.style.display = 'none';
    }

    delete this.errores[campo.name];

    console.log(`✅ Campo ${campo.name} es válido`);
  }

  limpiarError(campo) {
    const grupoFormulario = campo.closest('.form-group, .mb-3');
    const contenedorMensaje = grupoFormulario.querySelector('.mensaje-error');

    campo.classList.remove('is-invalid', 'is-valid');

    if (contenedorMensaje) {
      contenedorMensaje.style.display = 'none';
    }

    delete this.errores[campo.name];
  }

  crearContenedorMensaje(grupoFormulario) {
    const contenedorMensaje = document.createElement('div');
    contenedorMensaje.className = 'mensaje-error';
    contenedorMensaje.style.cssText = `
            color: #dc3545;
            font-size: 0.875rem;
            margin-top: 0.25rem;
            display: none;
        `;

    grupoFormulario.appendChild(contenedorMensaje);
    return contenedorMensaje;
  }

  validarFormulario() {
    console.log('\n--- Validando formulario completo ---');

    const campos = this.formulario.querySelectorAll('input, textarea, select');
    let formularioValido = true;

    // Validar todos los campos
    campos.forEach(campo => {
      if (!this.validarCampo(campo)) {
        formularioValido = false;
      }
    });

    // Verificar si hay errores
    const cantidadErrores = Object.keys(this.errores).length;

    if (formularioValido && cantidadErrores === 0) {
      console.log('✅ Formulario válido');
      this.onFormularioValido();
    } else {
      console.log(`❌ Formulario inválido: ${cantidadErrores} errores`);
      this.onFormularioInvalido();
    }

    return formularioValido;
  }

  onFormularioValido() {
    // Obtener datos del formulario
    const formData = new FormData(this.formulario);
    const datos = Object.fromEntries(formData);

    console.log('📋 Datos del formulario:', datos);

    // Simular envío
    this.mostrarMensajeExito('¡Formulario enviado exitosamente!');

    // Opcional: limpiar formulario
    // this.formulario.reset();
  }

  onFormularioInvalido() {
    // Enfocar el primer campo con error
    const primerCampoError = this.formulario.querySelector('.is-invalid');
    if (primerCampoError) {
      primerCampoError.focus();
    }

    // Mostrar resumen de errores
    const mensajesError = Object.values(this.errores);
    this.mostrarMensajeError(
      `Por favor corrige los siguientes errores:\n${mensajesError.join('\n')}`
    );
  }

  mostrarMensajeExito(mensaje) {
    this.mostrarMensajeGeneral(mensaje, 'success');
  }

  mostrarMensajeError(mensaje) {
    this.mostrarMensajeGeneral(mensaje, 'error');
  }

  mostrarMensajeGeneral(mensaje, tipo) {
    // Crear o actualizar mensaje global
    let mensajeGlobal = document.querySelector('.mensaje-global');

    if (!mensajeGlobal) {
      mensajeGlobal = document.createElement('div');
      mensajeGlobal.className = 'mensaje-global';
      mensajeGlobal.style.cssText = `
                padding: 15px;
                margin: 20px 0;
                border-radius: 8px;
                font-weight: bold;
                position: relative;
            `;

      this.formulario.insertBefore(mensajeGlobal, this.formulario.firstChild);
    }

    const colores = {
      success: { bg: '#d4edda', color: '#155724', border: '#c3e6cb' },
      error: { bg: '#f8d7da', color: '#721c24', border: '#f5c6cb' },
      warning: { bg: '#fff3cd', color: '#856404', border: '#ffeaa7' },
    };

    const color = colores[tipo];
    mensajeGlobal.style.backgroundColor = color.bg;
    mensajeGlobal.style.color = color.color;
    mensajeGlobal.style.border = `1px solid ${color.border}`;
    mensajeGlobal.textContent = mensaje;

    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
      if (mensajeGlobal.parentNode) {
        mensajeGlobal.remove();
      }
    }, 5000);
  }
}

// ================================
// EJERCICIOS PRÁCTICOS
// ================================

console.log('\n=== EJERCICIOS PRÁCTICOS ===');

// Ejercicio 1: Validación de formulario de registro
function configurarFormularioRegistro() {
  console.log('\n--- Configurando formulario de registro ---');

  const formularioRegistro = document.getElementById('form-registro');
  if (formularioRegistro) {
    const validador = new ValidadorFormulario(formularioRegistro);

    // Configurar validaciones específicas
    const inputPassword = formularioRegistro.querySelector('#password');
    const inputConfirmarPassword = formularioRegistro.querySelector(
      '#confirmar-password'
    );

    if (inputPassword && inputConfirmarPassword) {
      // Validar coincidencia de contraseñas
      inputConfirmarPassword.addEventListener('input', function () {
        if (this.value !== inputPassword.value) {
          validador.mostrarError(this, 'Las contraseñas no coinciden');
        } else {
          validador.mostrarValido(this);
        }
      });
    }

    // Indicador de fortaleza de contraseña
    if (inputPassword) {
      inputPassword.addEventListener('input', function () {
        mostrarFortalezaPassword(this.value);
      });
    }

    console.log('Formulario de registro configurado');
  }
}

// Ejercicio 2: Validación de formulario de contacto
function configurarFormularioContacto() {
  console.log('\n--- Configurando formulario de contacto ---');

  const formularioContacto = document.getElementById('form-contacto');
  if (formularioContacto) {
    const validador = new ValidadorFormulario(formularioContacto);

    // Contador de caracteres para textarea
    const textarea = formularioContacto.querySelector('textarea');
    if (textarea) {
      const contador = document.createElement('div');
      contador.className = 'contador-caracteres';
      contador.style.cssText = `
                text-align: right;
                font-size: 0.875rem;
                color: #6c757d;
                margin-top: 0.25rem;
            `;

      textarea.parentNode.appendChild(contador);

      textarea.addEventListener('input', function () {
        const longitud = this.value.length;
        const maximo = this.maxLength || 500;

        contador.textContent = `${longitud}/${maximo}`;
        contador.style.color = longitud > maximo * 0.8 ? '#dc3545' : '#6c757d';
      });
    }

    console.log('Formulario de contacto configurado');
  }
}

// Ejercicio 3: Validación de formulario de pago
function configurarFormularioPago() {
  console.log('\n--- Configurando formulario de pago ---');

  const formularioPago = document.getElementById('form-pago');
  if (formularioPago) {
    const validador = new ValidadorFormulario(formularioPago);

    // Formatear número de tarjeta
    const inputTarjeta = formularioPago.querySelector('#numero-tarjeta');
    if (inputTarjeta) {
      inputTarjeta.addEventListener('input', function () {
        let valor = this.value.replace(/\s/g, '');
        let valorFormateado = valor.replace(/(.{4})/g, '$1 ').trim();
        this.value = valorFormateado;

        // Validar número de tarjeta (algoritmo de Luhn simplificado)
        const esValido = validarNumeroTarjeta(valor);
        if (valor.length >= 16 && !esValido) {
          validador.mostrarError(this, 'Número de tarjeta inválido');
        } else if (esValido) {
          validador.mostrarValido(this);
        }
      });
    }

    // Validar fecha de vencimiento
    const inputVencimiento = formularioPago.querySelector('#fecha-vencimiento');
    if (inputVencimiento) {
      inputVencimiento.addEventListener('input', function () {
        let valor = this.value.replace(/\D/g, '');
        if (valor.length >= 2) {
          valor = valor.substring(0, 2) + '/' + valor.substring(2, 4);
        }
        this.value = valor;

        if (valor.length === 5) {
          const [mes, año] = valor.split('/');
          const fechaVencimiento = new Date(
            2000 + parseInt(año),
            parseInt(mes) - 1
          );
          const hoy = new Date();

          if (fechaVencimiento <= hoy) {
            validador.mostrarError(this, 'La tarjeta está vencida');
          } else {
            validador.mostrarValido(this);
          }
        }
      });
    }

    console.log('Formulario de pago configurado');
  }
}

// ================================
// FUNCIONES DE UTILIDAD
// ================================

// Función para mostrar fortaleza de contraseña
function mostrarFortalezaPassword(password) {
  const indicador = document.getElementById('fortaleza-password');
  if (!indicador) return;

  let puntuacion = 0;
  let mensaje = '';

  // Criterios de fortaleza
  if (password.length >= 8) puntuacion += 1;
  if (/[a-z]/.test(password)) puntuacion += 1;
  if (/[A-Z]/.test(password)) puntuacion += 1;
  if (/[0-9]/.test(password)) puntuacion += 1;
  if (/[^A-Za-z0-9]/.test(password)) puntuacion += 1;

  // Determinar nivel
  if (puntuacion <= 2) {
    mensaje = 'Débil';
    indicador.style.backgroundColor = '#dc3545';
  } else if (puntuacion <= 3) {
    mensaje = 'Media';
    indicador.style.backgroundColor = '#ffc107';
  } else if (puntuacion <= 4) {
    mensaje = 'Fuerte';
    indicador.style.backgroundColor = '#28a745';
  } else {
    mensaje = 'Muy fuerte';
    indicador.style.backgroundColor = '#20c997';
  }

  indicador.textContent = `Fortaleza: ${mensaje}`;
  indicador.style.width = `${(puntuacion / 5) * 100}%`;
}

// Función para validar número de tarjeta (algoritmo de Luhn)
function validarNumeroTarjeta(numero) {
  if (!/^\d{16}$/.test(numero)) return false;

  let suma = 0;
  let alternar = false;

  for (let i = numero.length - 1; i >= 0; i--) {
    let digito = parseInt(numero.charAt(i));

    if (alternar) {
      digito *= 2;
      if (digito > 9) {
        digito -= 9;
      }
    }

    suma += digito;
    alternar = !alternar;
  }

  return suma % 10 === 0;
}

// Función para sanitizar entrada
function sanitizarEntrada(valor) {
  return valor
    .replace(/[<>]/g, '') // Eliminar caracteres HTML
    .replace(/['"]/g, '') // Eliminar comillas
    .trim();
}

// Función para validar archivo subido
function validarArchivo(
  archivo,
  tiposPermitidos = [],
  tamañoMaximo = 5 * 1024 * 1024
) {
  if (!archivo) return { valido: false, mensaje: 'No se seleccionó archivo' };

  // Validar tipo
  if (tiposPermitidos.length > 0 && !tiposPermitidos.includes(archivo.type)) {
    return {
      valido: false,
      mensaje: `Tipo de archivo no permitido. Permitidos: ${tiposPermitidos.join(
        ', '
      )}`,
    };
  }

  // Validar tamaño
  if (archivo.size > tamañoMaximo) {
    return {
      valido: false,
      mensaje: `Archivo muy grande. Máximo: ${tamañoMaximo / (1024 * 1024)}MB`,
    };
  }

  return { valido: true, mensaje: 'Archivo válido' };
}

// ================================
// EJECUCIÓN DE EJERCICIOS
// ================================

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function () {
  console.log('\n🚀 DOM listo, configurando validación de formularios...');

  // Configurar formularios
  configurarFormularioRegistro();
  configurarFormularioContacto();
  configurarFormularioPago();

  // Configurar validación de archivos
  const inputsArchivo = document.querySelectorAll('input[type="file"]');
  inputsArchivo.forEach(input => {
    input.addEventListener('change', function () {
      const archivo = this.files[0];
      const tiposPermitidos = this.dataset.tipos
        ? this.dataset.tipos.split(',')
        : [];
      const tamañoMaximo = this.dataset.tamaño
        ? parseInt(this.dataset.tamaño)
        : 5 * 1024 * 1024;

      const resultado = validarArchivo(archivo, tiposPermitidos, tamañoMaximo);

      if (!resultado.valido) {
        alert(resultado.mensaje);
        this.value = '';
      } else {
        console.log(`✅ Archivo válido: ${archivo.name}`);
      }
    });
  });

  console.log('\n✅ Validación de formularios configurada!');
});

// ================================
// RETOS ADICIONALES
// ================================

/**
 * RETO 1: Crear un sistema de validación asíncrona
 */
async function validarAsincronamente(campo, valor) {
  // Simular verificación en servidor
  return new Promise(resolve => {
    setTimeout(() => {
      if (campo === 'email') {
        const emailExiste = ['admin@test.com', 'usuario@test.com'].includes(
          valor
        );
        resolve({
          valido: !emailExiste,
          mensaje: emailExiste
            ? 'Este email ya está registrado'
            : 'Email disponible',
        });
      } else if (campo === 'username') {
        const usuarioExiste = ['admin', 'usuario', 'test'].includes(valor);
        resolve({
          valido: !usuarioExiste,
          mensaje: usuarioExiste
            ? 'Nombre de usuario no disponible'
            : 'Nombre disponible',
        });
      } else {
        resolve({ valido: true, mensaje: 'Válido' });
      }
    }, 1000);
  });
}

/**
 * RETO 2: Crear validación con regex personalizadas
 */
const regexPersonalizadas = {
  codigoProducto: /^[A-Z]{3}-\d{4}$/,
  placaVehiculo: /^[A-Z]{3}-\d{3}$/,
  codigoBarras: /^\d{13}$/,
  ipAddress:
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
};

/**
 * RETO 3: Crear un sistema de validación condicional
 */
function validacionCondicional(formulario) {
  const tipoUsuario = formulario.querySelector('#tipo-usuario');
  const camposEmpresa = formulario.querySelectorAll('.campo-empresa');

  tipoUsuario.addEventListener('change', function () {
    const esEmpresa = this.value === 'empresa';

    camposEmpresa.forEach(campo => {
      campo.style.display = esEmpresa ? 'block' : 'none';
      const input = campo.querySelector('input, select, textarea');
      if (input) {
        input.required = esEmpresa;
      }
    });
  });
}

// Ejemplos de uso de los retos:
// validarAsincronamente('email', 'usuario@test.com').then(console.log);
// validacionCondicional(document.getElementById('form-registro'));
