/**
 * 🎯 Ejercicio 6: Validación de Objetos
 *
 * Objetivo: Implementar sistemas de validación robustos para objetos JavaScript
 *
 * Conceptos cubiertos:
 * - Validación de tipos de datos
 * - Validación de propiedades requeridas
 * - Validación de formatos (email, teléfono, etc.)
 * - Validación de rangos y longitudes
 * - Validación de objetos anidados
 * - Mensajes de error descriptivos
 * - Transformación y sanitización de datos
 */

console.log('🎯 Ejercicio 6: Validación de Objetos');
console.log('=====================================');

// ================================================
// 1. VALIDACIONES BÁSICAS
// ================================================

console.log('\n1. Validaciones Básicas');
console.log('-----------------------');

// Objeto de usuario para validar
const usuario = {
  nombre: 'Ana García',
  email: 'ana@email.com',
  edad: 25,
  telefono: '3001234567',
  activo: true,
};

// Validador básico de tipos
function validarTipos(obj, esquema) {
  const errores = [];

  Object.keys(esquema).forEach(campo => {
    const tipoEsperado = esquema[campo];
    const valorActual = obj[campo];
    const tipoActual = typeof valorActual;

    if (tipoActual !== tipoEsperado) {
      errores.push(
        `${campo} debe ser de tipo ${tipoEsperado}, recibido: ${tipoActual}`
      );
    }
  });

  return {
    valido: errores.length === 0,
    errores,
  };
}

const esquemaTipos = {
  nombre: 'string',
  email: 'string',
  edad: 'number',
  telefono: 'string',
  activo: 'boolean',
};

const resultadoTipos = validarTipos(usuario, esquemaTipos);
console.log('Validación de tipos:', resultadoTipos);

// Validador de propiedades requeridas
function validarRequeridos(obj, camposRequeridos) {
  const errores = [];

  camposRequeridos.forEach(campo => {
    if (!(campo in obj) || obj[campo] === undefined || obj[campo] === null) {
      errores.push(`${campo} es requerido`);
    }

    // Verificar strings vacías
    if (typeof obj[campo] === 'string' && obj[campo].trim() === '') {
      errores.push(`${campo} no puede estar vacío`);
    }
  });

  return {
    valido: errores.length === 0,
    errores,
  };
}

const camposRequeridos = ['nombre', 'email', 'edad'];
const resultadoRequeridos = validarRequeridos(usuario, camposRequeridos);
console.log('Validación de campos requeridos:', resultadoRequeridos);

// ================================================
// 2. VALIDACIONES DE FORMATO
// ================================================

console.log('\n2. Validaciones de Formato');
console.log('--------------------------');

// Validador de email
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Validador de teléfono colombiano
function validarTelefono(telefono) {
  const regex = /^3\d{9}$/;
  return regex.test(telefono);
}

// Validador de nombre (solo letras y espacios)
function validarNombre(nombre) {
  const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  return regex.test(nombre) && nombre.length >= 2 && nombre.length <= 50;
}

// Validador de edad
function validarEdad(edad) {
  return typeof edad === 'number' && edad >= 0 && edad <= 150;
}

// Sistema de validación de formatos
function validarFormatos(obj) {
  const errores = [];

  // Validar email
  if (obj.email && !validarEmail(obj.email)) {
    errores.push('Email no tiene un formato válido');
  }

  // Validar teléfono
  if (obj.telefono && !validarTelefono(obj.telefono)) {
    errores.push('Teléfono debe tener formato colombiano (3XXXXXXXXX)');
  }

  // Validar nombre
  if (obj.nombre && !validarNombre(obj.nombre)) {
    errores.push(
      'Nombre debe contener solo letras y tener entre 2 y 50 caracteres'
    );
  }

  // Validar edad
  if (obj.edad && !validarEdad(obj.edad)) {
    errores.push('Edad debe ser un número entre 0 y 150');
  }

  return {
    valido: errores.length === 0,
    errores,
  };
}

const resultadoFormatos = validarFormatos(usuario);
console.log('Validación de formatos:', resultadoFormatos);

// Probar con datos inválidos
const usuarioInvalido = {
  nombre: 'Ana123',
  email: 'email-invalido',
  edad: 200,
  telefono: '123456',
  activo: true,
};

const resultadoInvalido = validarFormatos(usuarioInvalido);
console.log('Validación de datos inválidos:', resultadoInvalido);

// ================================================
// 3. VALIDADOR COMPLETO DE OBJETOS
// ================================================

console.log('\n3. Validador Completo');
console.log('---------------------');

// Clase validadora completa
class ValidadorObjetos {
  constructor() {
    this.reglas = {};
  }

  // Definir reglas de validación
  definirReglas(campo, reglas) {
    this.reglas[campo] = reglas;
    return this;
  }

  // Validar objeto completo
  validar(obj) {
    const errores = [];

    Object.keys(this.reglas).forEach(campo => {
      const valor = obj[campo];
      const reglasDelCampo = this.reglas[campo];

      // Validar si es requerido
      if (
        reglasDelCampo.requerido &&
        (valor === undefined || valor === null || valor === '')
      ) {
        errores.push(`${campo} es requerido`);
        return;
      }

      // Si no es requerido y está vacío, saltar otras validaciones
      if (
        !reglasDelCampo.requerido &&
        (valor === undefined || valor === null || valor === '')
      ) {
        return;
      }

      // Validar tipo
      if (reglasDelCampo.tipo && typeof valor !== reglasDelCampo.tipo) {
        errores.push(`${campo} debe ser de tipo ${reglasDelCampo.tipo}`);
      }

      // Validar longitud mínima
      if (reglasDelCampo.minLength && valor.length < reglasDelCampo.minLength) {
        errores.push(
          `${campo} debe tener al menos ${reglasDelCampo.minLength} caracteres`
        );
      }

      // Validar longitud máxima
      if (reglasDelCampo.maxLength && valor.length > reglasDelCampo.maxLength) {
        errores.push(
          `${campo} no puede tener más de ${reglasDelCampo.maxLength} caracteres`
        );
      }

      // Validar valor mínimo
      if (reglasDelCampo.min && valor < reglasDelCampo.min) {
        errores.push(`${campo} debe ser mayor o igual a ${reglasDelCampo.min}`);
      }

      // Validar valor máximo
      if (reglasDelCampo.max && valor > reglasDelCampo.max) {
        errores.push(`${campo} debe ser menor o igual a ${reglasDelCampo.max}`);
      }

      // Validar patrón regex
      if (reglasDelCampo.patron && !reglasDelCampo.patron.test(valor)) {
        errores.push(`${campo} no tiene el formato correcto`);
      }

      // Validar función personalizada
      if (
        reglasDelCampo.customValidator &&
        !reglasDelCampo.customValidator(valor)
      ) {
        errores.push(reglasDelCampo.mensajeCustom || `${campo} no es válido`);
      }
    });

    return {
      valido: errores.length === 0,
      errores,
    };
  }
}

// Crear validador para usuario
const validadorUsuario = new ValidadorObjetos()
  .definirReglas('nombre', {
    requerido: true,
    tipo: 'string',
    minLength: 2,
    maxLength: 50,
    patron: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
  })
  .definirReglas('email', {
    requerido: true,
    tipo: 'string',
    patron: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  })
  .definirReglas('edad', {
    requerido: true,
    tipo: 'number',
    min: 0,
    max: 150,
  })
  .definirReglas('telefono', {
    requerido: false,
    tipo: 'string',
    patron: /^3\d{9}$/,
  })
  .definirReglas('password', {
    requerido: true,
    tipo: 'string',
    minLength: 8,
    customValidator: valor => {
      // Debe contener al menos una mayúscula, una minúscula, un número y un carácter especial
      const regex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
      return regex.test(valor);
    },
    mensajeCustom:
      'Password debe contener al menos una mayúscula, una minúscula, un número y un carácter especial',
  });

// Probar con diferentes usuarios
const usuarioValido = {
  nombre: 'Ana García',
  email: 'ana@email.com',
  edad: 25,
  telefono: '3001234567',
  password: 'MiPassword123!',
};

const usuarioInvalido2 = {
  nombre: 'A',
  email: 'email-invalido',
  edad: 200,
  telefono: '123',
  password: '123',
};

console.log('Usuario válido:', validadorUsuario.validar(usuarioValido));
console.log('Usuario inválido:', validadorUsuario.validar(usuarioInvalido2));

// ================================================
// 4. VALIDACIÓN DE OBJETOS ANIDADOS
// ================================================

console.log('\n4. Validación de Objetos Anidados');
console.log('---------------------------------');

// Validador para objetos anidados
function validarObjetoAnidado(obj, esquema) {
  const errores = [];

  function validarRecursivo(objeto, esquemaActual, ruta = '') {
    Object.keys(esquemaActual).forEach(campo => {
      const rutaCompleta = ruta ? `${ruta}.${campo}` : campo;
      const reglas = esquemaActual[campo];
      const valor = objeto[campo];

      // Validar si es requerido
      if (reglas.requerido && (valor === undefined || valor === null)) {
        errores.push(`${rutaCompleta} es requerido`);
        return;
      }

      // Si no existe y no es requerido, continuar
      if (valor === undefined || valor === null) {
        return;
      }

      // Validar tipo
      if (reglas.tipo && typeof valor !== reglas.tipo) {
        errores.push(`${rutaCompleta} debe ser de tipo ${reglas.tipo}`);
      }

      // Validar objeto anidado
      if (reglas.tipo === 'object' && reglas.propiedades) {
        validarRecursivo(valor, reglas.propiedades, rutaCompleta);
      }

      // Validar patrón
      if (reglas.patron && !reglas.patron.test(valor)) {
        errores.push(`${rutaCompleta} no tiene el formato correcto`);
      }

      // Validar longitud
      if (reglas.minLength && valor.length < reglas.minLength) {
        errores.push(
          `${rutaCompleta} debe tener al menos ${reglas.minLength} caracteres`
        );
      }

      // Validar array
      if (reglas.tipo === 'object' && Array.isArray(valor) && reglas.items) {
        valor.forEach((item, index) => {
          validarRecursivo(item, reglas.items, `${rutaCompleta}[${index}]`);
        });
      }
    });
  }

  validarRecursivo(obj, esquema);

  return {
    valido: errores.length === 0,
    errores,
  };
}

// Esquema para empleado con información anidada
const esquemaEmpleado = {
  nombre: { requerido: true, tipo: 'string', minLength: 2 },
  email: {
    requerido: true,
    tipo: 'string',
    patron: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  direccion: {
    requerido: true,
    tipo: 'object',
    propiedades: {
      calle: { requerido: true, tipo: 'string', minLength: 5 },
      ciudad: { requerido: true, tipo: 'string', minLength: 2 },
      codigoPostal: { requerido: true, tipo: 'string', patron: /^\d{6}$/ },
    },
  },
  contacto: {
    requerido: false,
    tipo: 'object',
    propiedades: {
      telefono: { requerido: false, tipo: 'string', patron: /^3\d{9}$/ },
      emergencia: { requerido: false, tipo: 'string', patron: /^3\d{9}$/ },
    },
  },
};

// Empleado válido
const empleadoValido = {
  nombre: 'Carlos López',
  email: 'carlos@empresa.com',
  direccion: {
    calle: 'Carrera 7 # 45-67',
    ciudad: 'Bogotá',
    codigoPostal: '110111',
  },
  contacto: {
    telefono: '3001234567',
    emergencia: '3009876543',
  },
};

// Empleado inválido
const empleadoInvalido = {
  nombre: 'C',
  email: 'email-invalido',
  direccion: {
    calle: 'C1',
    ciudad: 'B',
    codigoPostal: '123',
  },
  contacto: {
    telefono: '123',
    emergencia: '456',
  },
};

console.log(
  'Empleado válido:',
  validarObjetoAnidado(empleadoValido, esquemaEmpleado)
);
console.log(
  'Empleado inválido:',
  validarObjetoAnidado(empleadoInvalido, esquemaEmpleado)
);

// ================================================
// 5. SANITIZACIÓN DE DATOS
// ================================================

console.log('\n5. Sanitización de Datos');
console.log('------------------------');

// Función para sanitizar datos
function sanitizarDatos(obj) {
  const sanitizado = {};

  Object.keys(obj).forEach(campo => {
    let valor = obj[campo];

    if (typeof valor === 'string') {
      // Remover espacios al inicio y final
      valor = valor.trim();

      // Remover caracteres especiales peligrosos
      valor = valor.replace(/[<>]/g, '');

      // Capitalizar primera letra si es nombre
      if (campo === 'nombre') {
        valor = valor
          .split(' ')
          .map(
            palabra =>
              palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase()
          )
          .join(' ');
      }

      // Normalizar email a minúsculas
      if (campo === 'email') {
        valor = valor.toLowerCase();
      }

      // Remover espacios en teléfono
      if (campo === 'telefono') {
        valor = valor.replace(/\s/g, '');
      }
    }

    sanitizado[campo] = valor;
  });

  return sanitizado;
}

// Datos desordenados
const datosDesordenados = {
  nombre: '  ana   garcia  ',
  email: '  ANA@EMAIL.COM  ',
  telefono: '300 123 4567',
  comentario: 'Hola <script>alert("hack")</script> mundo',
};

const datosSanitizados = sanitizarDatos(datosDesordenados);
console.log('Datos originales:', datosDesordenados);
console.log('Datos sanitizados:', datosSanitizados);

// ================================================
// 6. VALIDADOR DE FORMULARIOS COMPLEJOS
// ================================================

console.log('\n6. Validador de Formularios Complejos');
console.log('-------------------------------------');

// Validador especializado para formularios
class ValidadorFormularios {
  constructor() {
    this.reglas = {};
    this.mensajes = {};
  }

  // Agregar regla de validación
  regla(campo, validaciones, mensaje = '') {
    this.reglas[campo] = validaciones;
    this.mensajes[campo] = mensaje;
    return this;
  }

  // Validar formulario completo
  validarFormulario(datos) {
    const errores = {};
    let valido = true;

    // Sanitizar datos primero
    const datosSanitizados = sanitizarDatos(datos);

    Object.keys(this.reglas).forEach(campo => {
      const valor = datosSanitizados[campo];
      const validaciones = this.reglas[campo];
      const erroresCampo = [];

      // Validar requerido
      if (validaciones.requerido && (!valor || valor === '')) {
        erroresCampo.push(`${campo} es requerido`);
      }

      // Si no hay valor y no es requerido, saltar validaciones
      if (!valor && !validaciones.requerido) {
        return;
      }

      // Validar longitud mínima
      if (validaciones.minLength && valor.length < validaciones.minLength) {
        erroresCampo.push(
          `${campo} debe tener al menos ${validaciones.minLength} caracteres`
        );
      }

      // Validar longitud máxima
      if (validaciones.maxLength && valor.length > validaciones.maxLength) {
        erroresCampo.push(
          `${campo} no puede tener más de ${validaciones.maxLength} caracteres`
        );
      }

      // Validar patrón
      if (validaciones.patron && !validaciones.patron.test(valor)) {
        erroresCampo.push(
          this.mensajes[campo] || `${campo} no tiene el formato correcto`
        );
      }

      // Validar confirmación de campo
      if (
        validaciones.confirmar &&
        valor !== datosSanitizados[validaciones.confirmar]
      ) {
        erroresCampo.push(`${campo} no coincide con ${validaciones.confirmar}`);
      }

      // Validar función personalizada
      if (
        validaciones.custom &&
        !validaciones.custom(valor, datosSanitizados)
      ) {
        erroresCampo.push(
          validaciones.mensajeCustom || `${campo} no es válido`
        );
      }

      // Si hay errores, agregarlos al resultado
      if (erroresCampo.length > 0) {
        errores[campo] = erroresCampo;
        valido = false;
      }
    });

    return {
      valido,
      errores,
      datosSanitizados,
    };
  }
}

// Crear validador para formulario de registro
const validadorRegistro = new ValidadorFormularios()
  .regla(
    'nombre',
    {
      requerido: true,
      minLength: 2,
      maxLength: 50,
      patron: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
    },
    'Nombre debe contener solo letras'
  )
  .regla(
    'email',
    {
      requerido: true,
      patron: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    'Email debe tener un formato válido'
  )
  .regla(
    'password',
    {
      requerido: true,
      minLength: 8,
      patron: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    },
    'Password debe contener al menos una mayúscula, una minúscula, un número y un carácter especial'
  )
  .regla('confirmarPassword', {
    requerido: true,
    confirmar: 'password',
  })
  .regla(
    'telefono',
    {
      requerido: false,
      patron: /^3\d{9}$/,
    },
    'Teléfono debe tener formato colombiano'
  )
  .regla('edad', {
    requerido: true,
    custom: valor => {
      const edad = parseInt(valor);
      return edad >= 18 && edad <= 120;
    },
    mensajeCustom: 'Edad debe estar entre 18 y 120 años',
  })
  .regla('terminos', {
    requerido: true,
    custom: valor => valor === 'true' || valor === true,
    mensajeCustom: 'Debe aceptar los términos y condiciones',
  });

// Datos de formulario válidos
const datosRegistroValidos = {
  nombre: '  ana garcia  ',
  email: '  ANA@EMAIL.COM  ',
  password: 'MiPassword123!',
  confirmarPassword: 'MiPassword123!',
  telefono: '300 123 4567',
  edad: '25',
  terminos: 'true',
};

// Datos de formulario inválidos
const datosRegistroInvalidos = {
  nombre: 'Ana123',
  email: 'email-invalido',
  password: '123',
  confirmarPassword: '456',
  telefono: '123',
  edad: '15',
  terminos: 'false',
};

console.log(
  'Formulario válido:',
  validadorRegistro.validarFormulario(datosRegistroValidos)
);
console.log(
  'Formulario inválido:',
  validadorRegistro.validarFormulario(datosRegistroInvalidos)
);

// ================================================
// 7. CASOS DE USO PRÁCTICOS
// ================================================

console.log('\n7. Casos de Uso Prácticos');
console.log('-------------------------');

// Validador para productos de e-commerce
const validadorProducto = new ValidadorFormularios()
  .regla('nombre', {
    requerido: true,
    minLength: 3,
    maxLength: 100,
  })
  .regla('precio', {
    requerido: true,
    custom: valor => {
      const precio = parseFloat(valor);
      return !isNaN(precio) && precio > 0;
    },
    mensajeCustom: 'Precio debe ser un número positivo',
  })
  .regla('categoria', {
    requerido: true,
    custom: valor => {
      const categoriasValidas = [
        'electrónicos',
        'ropa',
        'hogar',
        'deportes',
        'libros',
      ];
      return categoriasValidas.includes(valor.toLowerCase());
    },
    mensajeCustom: 'Categoría debe ser una de las opciones válidas',
  })
  .regla('descripcion', {
    requerido: true,
    minLength: 10,
    maxLength: 1000,
  })
  .regla('stock', {
    requerido: true,
    custom: valor => {
      const stock = parseInt(valor);
      return !isNaN(stock) && stock >= 0;
    },
    mensajeCustom: 'Stock debe ser un número entero no negativo',
  });

const productoEjemplo = {
  nombre: 'Laptop Gaming',
  precio: '2500000',
  categoria: 'electrónicos',
  descripcion: 'Laptop de alta gama para gaming con procesador Intel i7',
  stock: '10',
};

const validacionProducto = validadorProducto.validarFormulario(productoEjemplo);
console.log('Validación de producto:', validacionProducto);

// ================================================
// 8. EJERCICIOS PRÁCTICOS
// ================================================

console.log('\n8. Ejercicios Prácticos');
console.log('-----------------------');

// Ejercicio: Validador para citas médicas
const validadorCita = new ValidadorFormularios()
  .regla('paciente', {
    requerido: true,
    minLength: 2,
    maxLength: 100,
    patron: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
  })
  .regla(
    'cedula',
    {
      requerido: true,
      patron: /^\d{6,10}$/,
    },
    'Cédula debe tener entre 6 y 10 dígitos'
  )
  .regla('fecha', {
    requerido: true,
    custom: valor => {
      const fecha = new Date(valor);
      const ahora = new Date();
      return fecha > ahora;
    },
    mensajeCustom: 'La fecha debe ser futura',
  })
  .regla('especialidad', {
    requerido: true,
    custom: valor => {
      const especialidades = [
        'medicina general',
        'cardiología',
        'pediatría',
        'ginecología',
      ];
      return especialidades.includes(valor.toLowerCase());
    },
    mensajeCustom: 'Especialidad no válida',
  })
  .regla(
    'telefono',
    {
      requerido: true,
      patron: /^3\d{9}$/,
    },
    'Teléfono debe tener formato colombiano'
  )
  .regla(
    'email',
    {
      requerido: false,
      patron: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    'Email debe tener formato válido'
  );

const citaEjemplo = {
  paciente: 'Juan Pérez',
  cedula: '12345678',
  fecha: '2024-02-15',
  especialidad: 'medicina general',
  telefono: '3001234567',
  email: 'juan@email.com',
};

const validacionCita = validadorCita.validarFormulario(citaEjemplo);
console.log('Validación de cita médica:', validacionCita);

console.log('\n✅ Ejercicio 6 completado exitosamente!');
console.log('📚 Conceptos aprendidos:');
console.log('   - Validación de tipos de datos');
console.log('   - Validación de propiedades requeridas');
console.log('   - Validación de formatos con regex');
console.log('   - Validación de rangos y longitudes');
console.log('   - Validación de objetos anidados');
console.log('   - Mensajes de error descriptivos');
console.log('   - Sanitización de datos');
console.log('   - Validadores para formularios complejos');

// ================================================
// 🎯 DESAFÍO EXTRA
// ================================================

console.log('\n🎯 Desafío Extra');
console.log('================');

// Sistema de validación para reservas de hotel
const validadorReserva = new ValidadorFormularios()
  .regla('huesped', {
    requerido: true,
    minLength: 2,
    maxLength: 100,
    patron: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
  })
  .regla(
    'documento',
    {
      requerido: true,
      patron: /^[A-Z]{2}\d{8}$|^\d{6,10}$/,
    },
    'Documento debe ser cédula (6-10 dígitos) o pasaporte (2 letras + 8 dígitos)'
  )
  .regla('fechaEntrada', {
    requerido: true,
    custom: valor => {
      const fecha = new Date(valor);
      const ahora = new Date();
      return fecha >= ahora;
    },
    mensajeCustom: 'Fecha de entrada debe ser actual o futura',
  })
  .regla('fechaSalida', {
    requerido: true,
    custom: (valor, datos) => {
      const entrada = new Date(datos.fechaEntrada);
      const salida = new Date(valor);
      return salida > entrada;
    },
    mensajeCustom: 'Fecha de salida debe ser posterior a la entrada',
  })
  .regla('huespedes', {
    requerido: true,
    custom: valor => {
      const num = parseInt(valor);
      return !isNaN(num) && num >= 1 && num <= 6;
    },
    mensajeCustom: 'Número de huéspedes debe estar entre 1 y 6',
  })
  .regla('habitacion', {
    requerido: true,
    custom: valor => {
      const tipos = ['sencilla', 'doble', 'suite', 'familiar'];
      return tipos.includes(valor.toLowerCase());
    },
    mensajeCustom: 'Tipo de habitación no válido',
  })
  .regla('email', {
    requerido: true,
    patron: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  })
  .regla('telefono', {
    requerido: true,
    patron: /^3\d{9}$/,
  })
  .regla('solicitudesEspeciales', {
    requerido: false,
    maxLength: 500,
  });

const reservaEjemplo = {
  huesped: 'María González',
  documento: '98765432',
  fechaEntrada: '2024-03-15',
  fechaSalida: '2024-03-18',
  huespedes: '2',
  habitacion: 'doble',
  email: 'maria@email.com',
  telefono: '3009876543',
  solicitudesEspeciales: 'Habitación en piso alto con vista al mar',
};

const validacionReserva = validadorReserva.validarFormulario(reservaEjemplo);
console.log('Validación de reserva:', validacionReserva);

// Función para calcular precio de reserva
function calcularPrecioReserva(datosReserva) {
  const precios = {
    sencilla: 150000,
    doble: 200000,
    suite: 350000,
    familiar: 280000,
  };

  const entrada = new Date(datosReserva.fechaEntrada);
  const salida = new Date(datosReserva.fechaSalida);
  const noches = (salida - entrada) / (1000 * 60 * 60 * 24);

  const precioBase = precios[datosReserva.habitacion.toLowerCase()] || 0;
  const total = precioBase * noches;

  return {
    precioNoche: precioBase,
    noches: noches,
    subtotal: total,
    impuestos: total * 0.19,
    total: total * 1.19,
  };
}

if (validacionReserva.valido) {
  const precio = calcularPrecioReserva(validacionReserva.datosSanitizados);
  console.log('Precio de la reserva:', precio);
}

console.log(
  '\n🎉 ¡Impresionante! Has dominado completamente la validación de objetos en JavaScript.'
);
