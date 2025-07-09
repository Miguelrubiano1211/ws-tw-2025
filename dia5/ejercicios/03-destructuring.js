/**
 * 🎯 Ejercicio 3: Destructuring
 *
 * Objetivo: Dominar el destructuring de objetos y arrays para extraer datos eficientemente
 *
 * Conceptos cubiertos:
 * - Destructuring básico de objetos
 * - Valores por defecto
 * - Renombrado de variables
 * - Destructuring anidado
 * - Destructuring en parámetros
 * - Rest pattern
 * - Destructuring de arrays
 */

console.log('🎯 Ejercicio 3: Destructuring');
console.log('=============================');

// ================================================
// 1. DESTRUCTURING BÁSICO DE OBJETOS
// ================================================

console.log('\n1. Destructuring Básico de Objetos');
console.log('----------------------------------');

// Objeto de ejemplo
const estudiante = {
  nombre: 'Ana García',
  edad: 22,
  carrera: 'Ingeniería de Software',
  universidad: 'Universidad Nacional',
  semestre: 6,
  promedio: 4.2,
};

// Forma tradicional (sin destructuring)
const nombreTradicional = estudiante.nombre;
const edadTradicional = estudiante.edad;
console.log('Forma tradicional:', nombreTradicional, edadTradicional);

// Destructuring básico
const { nombre, edad, carrera } = estudiante;
console.log('Con destructuring:', nombre, edad, carrera);

// Destructuring de múltiples propiedades
const { universidad, semestre, promedio } = estudiante;
console.log('Universidad:', universidad);
console.log('Semestre:', semestre);
console.log('Promedio:', promedio);

// ================================================
// 2. VALORES POR DEFECTO
// ================================================

console.log('\n2. Valores por Defecto');
console.log('----------------------');

const producto = {
  id: 1,
  nombre: 'Laptop',
  precio: 1200000,
  categoria: 'Electrónicos',
  // Nota: No tiene propiedades 'stock' ni 'disponible'
};

// Destructuring con valores por defecto
const {
  nombre: nombreProducto,
  precio,
  stock = 0,
  disponible = true,
} = producto;

console.log('Nombre:', nombreProducto);
console.log('Precio:', precio);
console.log('Stock (por defecto):', stock);
console.log('Disponible (por defecto):', disponible);

// Ejemplo con usuario
const usuario = {
  id: 123,
  email: 'usuario@email.com',
  // Faltan: nombre, activo, rol
};

const {
  email,
  nombre: nombreUsuario = 'Usuario Anónimo',
  activo = false,
  rol = 'invitado',
} = usuario;

console.log('Email:', email);
console.log('Nombre:', nombreUsuario);
console.log('Activo:', activo);
console.log('Rol:', rol);

// ================================================
// 3. RENOMBRADO DE VARIABLES
// ================================================

console.log('\n3. Renombrado de Variables');
console.log('--------------------------');

const configuracion = {
  theme: 'dark',
  language: 'es',
  notifications: true,
  autoSave: false,
};

// Renombrar variables durante destructuring
const {
  theme: tema,
  language: idioma,
  notifications: notificaciones,
  autoSave: guardadoAutomatico,
} = configuracion;

console.log('Tema:', tema);
console.log('Idioma:', idioma);
console.log('Notificaciones:', notificaciones);
console.log('Guardado automático:', guardadoAutomatico);

// Ejemplo con datos de API
const respuestaAPI = {
  status: 200,
  data: {
    user_id: 456,
    user_name: 'Carlos López',
    user_email: 'carlos@email.com',
  },
  message: 'Success',
};

// Destructuring con renombrado para mejor legibilidad
const {
  status: codigoEstado,
  message: mensaje,
  data: {
    user_id: idUsuario,
    user_name: nombreCompleto,
    user_email: correoElectronico,
  },
} = respuestaAPI;

console.log('Código:', codigoEstado);
console.log('Mensaje:', mensaje);
console.log('ID Usuario:', idUsuario);
console.log('Nombre completo:', nombreCompleto);
console.log('Correo:', correoElectronico);

// ================================================
// 4. DESTRUCTURING ANIDADO
// ================================================

console.log('\n4. Destructuring Anidado');
console.log('------------------------');

const empresa = {
  nombre: 'TechCorp',
  fundacion: 2020,
  direccion: {
    calle: 'Av. Principal 123',
    ciudad: 'Bogotá',
    pais: 'Colombia',
    codigoPostal: '110111',
  },
  contacto: {
    telefono: '3001234567',
    email: 'info@techcorp.com',
    web: 'www.techcorp.com',
  },
  empleados: {
    total: 50,
    desarrolladores: 30,
    diseñadores: 10,
    gerentes: 5,
    otros: 5,
  },
};

// Destructuring anidado simple
const {
  nombre: nombreEmpresa,
  direccion: { ciudad, pais },
  contacto: { email: emailEmpresa, telefono },
} = empresa;

console.log('Empresa:', nombreEmpresa);
console.log('Ubicación:', ciudad, pais);
console.log('Contacto:', emailEmpresa, telefono);

// Destructuring anidado complejo
const {
  fundacion,
  direccion: { calle, codigoPostal },
  empleados: { total: totalEmpleados, desarrolladores, diseñadores },
} = empresa;

console.log('Fundación:', fundacion);
console.log('Dirección:', calle, codigoPostal);
console.log(
  'Empleados:',
  totalEmpleados,
  'total,',
  desarrolladores,
  'desarrolladores,',
  diseñadores,
  'diseñadores'
);

// ================================================
// 5. DESTRUCTURING EN PARÁMETROS DE FUNCIÓN
// ================================================

console.log('\n5. Destructuring en Parámetros');
console.log('------------------------------');

// Función tradicional
function mostrarUsuarioTradicional(usuario) {
  console.log(
    `Usuario: ${usuario.nombre}, Email: ${usuario.email}, Edad: ${usuario.edad}`
  );
}

// Función con destructuring en parámetros
function mostrarUsuario({ nombre, email, edad = 'No especificada' }) {
  console.log(`Usuario: ${nombre}, Email: ${email}, Edad: ${edad}`);
}

// Función con destructuring anidado
function mostrarEmpleado({
  nombre,
  puesto,
  departamento: { nombre: nombreDept, ubicacion },
}) {
  console.log(
    `Empleado: ${nombre}, Puesto: ${puesto}, Departamento: ${nombreDept} en ${ubicacion}`
  );
}

// Datos de prueba
const datosUsuario = {
  nombre: 'María Rodríguez',
  email: 'maria@email.com',
  edad: 28,
};

const datosEmpleado = {
  nombre: 'Juan Pérez',
  puesto: 'Desarrollador Senior',
  departamento: {
    nombre: 'IT',
    ubicacion: 'Piso 3',
  },
};

// Usar las funciones
mostrarUsuarioTradicional(datosUsuario);
mostrarUsuario(datosUsuario);
mostrarEmpleado(datosEmpleado);

// Función con valores por defecto y destructuring
function crearReporte({
  titulo = 'Reporte Sin Título',
  autor = 'Autor Anónimo',
  fecha = new Date(),
  contenido = 'Sin contenido',
}) {
  return {
    titulo,
    autor,
    fecha,
    contenido,
    generado: new Date(),
  };
}

const reporteCompleto = crearReporte({
  titulo: 'Reporte de Ventas',
  autor: 'Ana García',
  contenido: 'Ventas del mes de enero',
});

const reporteMinimo = crearReporte({});

console.log('Reporte completo:', reporteCompleto);
console.log('Reporte mínimo:', reporteMinimo);

// ================================================
// 6. REST PATTERN EN OBJETOS
// ================================================

console.log('\n6. Rest Pattern en Objetos');
console.log('--------------------------');

const datosCompletos = {
  id: 1,
  nombre: 'Carlos Mendoza',
  email: 'carlos@email.com',
  edad: 30,
  telefono: '3001234567',
  direccion: 'Calle 123',
  ciudad: 'Medellín',
  pais: 'Colombia',
  activo: true,
};

// Extraer algunas propiedades y el resto en un objeto
const { id, nombre, email, ...restoInformacion } = datosCompletos;

console.log('ID:', id);
console.log('Nombre:', nombre);
console.log('Email:', email);
console.log('Resto de información:', restoInformacion);

// Función que separa datos esenciales de adicionales
function procesarDatosUsuario(usuario) {
  const { nombre, email, edad, ...datosAdicionales } = usuario;

  return {
    esenciales: { nombre, email, edad },
    adicionales: datosAdicionales,
  };
}

const resultado = procesarDatosUsuario(datosCompletos);
console.log('Datos procesados:', resultado);

// ================================================
// 7. DESTRUCTURING DE ARRAYS
// ================================================

console.log('\n7. Destructuring de Arrays');
console.log('--------------------------');

const colores = ['rojo', 'verde', 'azul', 'amarillo', 'morado'];

// Destructuring básico de array
const [primerColor, segundoColor, tercerColor] = colores;
console.log('Primeros tres colores:', primerColor, segundoColor, tercerColor);

// Saltar elementos
const [, , colorAzul, colorAmarillo] = colores;
console.log('Colores saltando:', colorAzul, colorAmarillo);

// Con rest pattern
const [primero, segundo, ...restantesColores] = colores;
console.log('Primero:', primero);
console.log('Segundo:', segundo);
console.log('Restantes:', restantesColores);

// Array de objetos
const estudiantes = [
  { nombre: 'Ana', nota: 4.5 },
  { nombre: 'Carlos', nota: 4.2 },
  { nombre: 'María', nota: 4.8 },
];

// Destructuring de array de objetos
const [
  { nombre: nombrePrimero, nota: notaPrimero },
  { nombre: nombreSegundo },
] = estudiantes;
console.log('Primer estudiante:', nombrePrimero, 'Nota:', notaPrimero);
console.log('Segundo estudiante:', nombreSegundo);

// ================================================
// 8. INTERCAMBIO DE VARIABLES
// ================================================

console.log('\n8. Intercambio de Variables');
console.log('---------------------------');

let a = 10;
let b = 20;

console.log('Antes del intercambio - a:', a, 'b:', b);

// Intercambio usando destructuring
[a, b] = [b, a];

console.log('Después del intercambio - a:', a, 'b:', b);

// Intercambio múltiple
let x = 1,
  y = 2,
  z = 3;
console.log('Antes - x:', x, 'y:', y, 'z:', z);

[x, y, z] = [z, x, y];
console.log('Después - x:', x, 'y:', y, 'z:', z);

// ================================================
// 9. DESTRUCTURING CON FUNCIONES QUE RETORNAN OBJETOS
// ================================================

console.log('\n9. Destructuring con Funciones');
console.log('------------------------------');

// Función que retorna un objeto
function obtenerInformacionUsuario() {
  return {
    nombre: 'Laura Sánchez',
    edad: 26,
    profesion: 'Ingeniera',
    habilidades: ['JavaScript', 'React', 'Node.js'],
    experiencia: 3,
  };
}

// Destructuring directo del resultado
const {
  nombre: nombreProf,
  profesion,
  habilidades,
} = obtenerInformacionUsuario();
console.log('Profesional:', nombreProf, 'Profesión:', profesion);
console.log('Habilidades:', habilidades);

// Función que retorna múltiples valores
function calcularEstadisticas(numeros) {
  const suma = numeros.reduce((acc, num) => acc + num, 0);
  const promedio = suma / numeros.length;
  const maximo = Math.max(...numeros);
  const minimo = Math.min(...numeros);

  return { suma, promedio, maximo, minimo };
}

const numeros = [10, 20, 30, 40, 50];
const { suma, promedio, maximo, minimo } = calcularEstadisticas(numeros);

console.log('Estadísticas:');
console.log('Suma:', suma);
console.log('Promedio:', promedio);
console.log('Máximo:', maximo);
console.log('Mínimo:', minimo);

// ================================================
// 10. CASOS DE USO PRÁCTICOS
// ================================================

console.log('\n10. Casos de Uso Prácticos');
console.log('--------------------------');

// Caso 1: Configuración de aplicación
const appConfig = {
  api: {
    baseUrl: 'https://api.example.com',
    timeout: 5000,
    retries: 3,
  },
  ui: {
    theme: 'light',
    language: 'es',
    animations: true,
  },
  features: {
    notifications: true,
    autoSave: true,
    offline: false,
  },
};

// Extraer configuración específica
const {
  api: { baseUrl, timeout },
  ui: { theme, language },
  features: { notifications, autoSave },
} = appConfig;

console.log('API URL:', baseUrl);
console.log('Timeout:', timeout);
console.log('Tema:', theme);
console.log('Idioma:', language);
console.log('Notificaciones:', notifications);
console.log('Auto-guardado:', autoSave);

// Caso 2: Procesamiento de datos de formulario
function procesarFormulario(datosFormulario) {
  const {
    nombre,
    email,
    telefono = 'No proporcionado',
    direccion: { calle, ciudad, codigoPostal } = {},
    preferencias: { newsletter = false, sms = false } = {},
  } = datosFormulario;

  return {
    informacionPersonal: { nombre, email, telefono },
    direccion: { calle, ciudad, codigoPostal },
    preferencias: { newsletter, sms },
  };
}

const formularioCompleto = {
  nombre: 'Pedro Ramírez',
  email: 'pedro@email.com',
  telefono: '3009876543',
  direccion: {
    calle: 'Carrera 7 # 45-67',
    ciudad: 'Bogotá',
    codigoPostal: '110221',
  },
  preferencias: {
    newsletter: true,
    sms: false,
  },
};

const formularioIncompleto = {
  nombre: 'Ana Torres',
  email: 'ana@email.com',
};

console.log('Formulario completo:', procesarFormulario(formularioCompleto));
console.log('Formulario incompleto:', procesarFormulario(formularioIncompleto));

// Caso 3: Manejo de respuestas de API
function manejarRespuestaAPI(respuesta) {
  const {
    status,
    data: {
      user: {
        id,
        profile: { firstName, lastName, email },
      },
      permissions = [],
    } = {},
    error = null,
  } = respuesta;

  if (status === 200) {
    return {
      exito: true,
      usuario: {
        id,
        nombre: `${firstName} ${lastName}`,
        email,
        permisos: permissions,
      },
    };
  } else {
    return {
      exito: false,
      error: error || 'Error desconocido',
    };
  }
}

const respuestaExitosa = {
  status: 200,
  data: {
    user: {
      id: 123,
      profile: {
        firstName: 'María',
        lastName: 'González',
        email: 'maria@email.com',
      },
    },
    permissions: ['read', 'write', 'delete'],
  },
};

const respuestaError = {
  status: 404,
  error: 'Usuario no encontrado',
};

console.log('Respuesta exitosa:', manejarRespuestaAPI(respuestaExitosa));
console.log('Respuesta con error:', manejarRespuestaAPI(respuestaError));

// ================================================
// 11. DESTRUCTURING DINÁMICO
// ================================================

console.log('\n11. Destructuring Dinámico');
console.log('--------------------------');

const configuracionDinamica = {
  modo: 'desarrollo',
  puerto: 3000,
  host: 'localhost',
  ssl: false,
  maxConexiones: 100,
};

// Función que extrae propiedades dinámicamente
function extraerPropiedades(objeto, propiedades) {
  const resultado = {};

  propiedades.forEach(prop => {
    if (objeto.hasOwnProperty(prop)) {
      resultado[prop] = objeto[prop];
    }
  });

  return resultado;
}

// Usar destructuring con propiedades dinámicas
const propiedadesNecesarias = ['modo', 'puerto', 'host'];
const configEsencial = extraerPropiedades(
  configuracionDinamica,
  propiedadesNecesarias
);

console.log('Configuración esencial:', configEsencial);

// Función que usa destructuring con propiedades calculadas
function crearObjetoSelectivo(origen, ...propiedades) {
  const resultado = {};

  propiedades.forEach(prop => {
    if (origen[prop] !== undefined) {
      resultado[prop] = origen[prop];
    }
  });

  return resultado;
}

const configSelectiva = crearObjetoSelectivo(
  configuracionDinamica,
  'modo',
  'puerto',
  'ssl',
  'propiedadInexistente'
);
console.log('Configuración selectiva:', configSelectiva);

// ================================================
// 12. EJERCICIOS PRÁCTICOS
// ================================================

console.log('\n12. Ejercicios Prácticos');
console.log('-----------------------');

// Ejercicio A: Sistema de productos
const productos = [
  {
    id: 1,
    nombre: 'Laptop Dell',
    precio: 2500000,
    especificaciones: {
      ram: '16GB',
      procesador: 'Intel i7',
      almacenamiento: '512GB SSD',
    },
    disponibilidad: {
      stock: 5,
      tienda: 'Bogotá Centro',
    },
  },
  {
    id: 2,
    nombre: 'iPhone 15',
    precio: 4200000,
    especificaciones: {
      ram: '8GB',
      procesador: 'A17 Pro',
      almacenamiento: '256GB',
    },
    disponibilidad: {
      stock: 2,
      tienda: 'Medellín Norte',
    },
  },
];

// Función para mostrar información del producto
function mostrarProducto({
  nombre,
  precio,
  especificaciones: { ram, procesador, almacenamiento },
  disponibilidad: { stock, tienda },
}) {
  return `
Producto: ${nombre}
Precio: $${precio.toLocaleString('es-CO')}
RAM: ${ram}
Procesador: ${procesador}
Almacenamiento: ${almacenamiento}
Stock: ${stock} unidades
Tienda: ${tienda}
    `.trim();
}

productos.forEach(producto => {
  console.log(mostrarProducto(producto));
  console.log('---');
});

// Ejercicio B: Procesamiento de datos de empleados
const empleados = [
  {
    id: 1,
    nombre: 'Ana García',
    departamento: { nombre: 'IT', piso: 3 },
    contacto: { email: 'ana@company.com', telefono: '3001234567' },
    salario: 3500000,
  },
  {
    id: 2,
    nombre: 'Carlos López',
    departamento: { nombre: 'Marketing', piso: 2 },
    contacto: { email: 'carlos@company.com' },
    salario: 3200000,
  },
];

// Función para crear reporte de empleado
function crearReporteEmpleado({
  nombre,
  departamento: { nombre: nombreDept, piso },
  contacto: { email, telefono = 'No registrado' },
  salario,
}) {
  return {
    empleado: nombre,
    departamento: nombreDept,
    ubicacion: `Piso ${piso}`,
    contacto: { email, telefono },
    salarioFormateado: `$${salario.toLocaleString('es-CO')}`,
  };
}

const reportesEmpleados = empleados.map(crearReporteEmpleado);
console.log('Reportes de empleados:', reportesEmpleados);

console.log('\n✅ Ejercicio 3 completado exitosamente!');
console.log('📚 Conceptos aprendidos:');
console.log('   - Destructuring básico de objetos');
console.log('   - Valores por defecto en destructuring');
console.log('   - Renombrado de variables');
console.log('   - Destructuring anidado');
console.log('   - Destructuring en parámetros de función');
console.log('   - Rest pattern en objetos');
console.log('   - Destructuring de arrays');
console.log('   - Intercambio de variables');
console.log('   - Casos de uso prácticos');

// ================================================
// 🎯 DESAFÍO EXTRA
// ================================================

console.log('\n🎯 Desafío Extra');
console.log('================');

// Sistema de gestión de pedidos con destructuring avanzado
const pedidos = [
  {
    id: 'P001',
    cliente: {
      nombre: 'Juan Pérez',
      contacto: { email: 'juan@email.com', telefono: '3001234567' },
      direccion: {
        calle: 'Calle 123',
        ciudad: 'Bogotá',
        codigoPostal: '110111',
      },
    },
    items: [
      { producto: 'Laptop', cantidad: 1, precio: 2500000 },
      { producto: 'Mouse', cantidad: 2, precio: 45000 },
    ],
    fechaPedido: '2024-01-15',
    estado: 'pendiente',
  },
  {
    id: 'P002',
    cliente: {
      nombre: 'María García',
      contacto: { email: 'maria@email.com' },
      direccion: { calle: 'Carrera 7', ciudad: 'Medellín' },
    },
    items: [{ producto: 'Teclado', cantidad: 1, precio: 120000 }],
    fechaPedido: '2024-01-16',
    estado: 'entregado',
  },
];

// Función para procesar pedidos usando destructuring
function procesarPedido({
  id,
  cliente: {
    nombre,
    contacto: { email, telefono = 'No registrado' },
    direccion: { calle, ciudad, codigoPostal = 'No especificado' },
  },
  items,
  fechaPedido,
  estado,
}) {
  // Calcular total usando destructuring
  const total = items.reduce(
    (acc, { cantidad, precio }) => acc + cantidad * precio,
    0
  );

  return {
    pedidoId: id,
    cliente: nombre,
    contacto: `${email} / ${telefono}`,
    direccionEntrega: `${calle}, ${ciudad} (${codigoPostal})`,
    totalItems: items.length,
    valorTotal: `$${total.toLocaleString('es-CO')}`,
    fecha: fechaPedido,
    estado: estado.toUpperCase(),
  };
}

// Procesar todos los pedidos
const pedidosProcesados = pedidos.map(procesarPedido);
console.log('Pedidos procesados:', pedidosProcesados);

// Función para extraer solo información de contacto
function extraerContactos(pedidos) {
  return pedidos.map(
    ({
      cliente: {
        nombre,
        contacto: { email, telefono = 'N/A' },
      },
    }) => ({
      nombre,
      email,
      telefono,
    })
  );
}

const contactos = extraerContactos(pedidos);
console.log('Contactos extraídos:', contactos);

console.log(
  '\n🎉 ¡Increíble! Has dominado completamente el destructuring en JavaScript.'
);
