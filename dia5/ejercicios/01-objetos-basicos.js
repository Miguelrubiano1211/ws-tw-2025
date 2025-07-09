/**
 * 🎯 Ejercicio 1: Objetos Básicos
 *
 * Objetivo: Aprender a crear objetos con diferentes sintaxis y acceder a sus propiedades
 *
 * Conceptos cubiertos:
 * - Sintaxis literal {}
 * - Constructor new Object()
 * - Factory functions
 * - Object.create()
 * - Notación punto vs corchetes
 * - Propiedades dinámicas
 */

console.log('🎯 Ejercicio 1: Objetos Básicos');
console.log('================================');

// ================================================
// 1. CREACIÓN DE OBJETOS - SINTAXIS LITERAL
// ================================================

console.log('\n1. Sintaxis Literal');
console.log('-------------------');

// Crear un objeto estudiante usando sintaxis literal
const estudiante = {
  nombre: 'Ana García',
  edad: 20,
  carrera: 'Ingeniería de Software',
  activo: true,
  materias: ['JavaScript', 'HTML', 'CSS'],
  promedio: 4.5,
};

console.log('Estudiante creado:', estudiante);
console.log('Nombre:', estudiante.nombre);
console.log('Edad:', estudiante.edad);

// ================================================
// 2. CONSTRUCTOR NEW OBJECT()
// ================================================

console.log('\n2. Constructor new Object()');
console.log('---------------------------');

// Crear un objeto usando constructor
const producto = new Object();
producto.id = 1;
producto.nombre = 'Laptop';
producto.precio = 1200000;
producto.categoria = 'Electrónicos';
producto.disponible = true;

console.log('Producto creado:', producto);

// ================================================
// 3. FACTORY FUNCTIONS
// ================================================

console.log('\n3. Factory Functions');
console.log('--------------------');

// Función factory para crear empleados
function crearEmpleado(nombre, cargo, salario) {
  return {
    nombre: nombre,
    cargo: cargo,
    salario: salario,
    activo: true,
    fechaIngreso: new Date(),
  };
}

// Crear empleados usando factory function
const empleado1 = crearEmpleado('Carlos Ruiz', 'Desarrollador', 3500000);
const empleado2 = crearEmpleado('María López', 'Diseñadora', 3200000);

console.log('Empleado 1:', empleado1);
console.log('Empleado 2:', empleado2);

// ================================================
// 4. OBJECT.CREATE()
// ================================================

console.log('\n4. Object.create()');
console.log('------------------');

// Crear un prototipo base
const vehiculoPrototipo = {
  tipo: 'Vehículo',
  encender: function () {
    return `${this.marca} ${this.modelo} encendido`;
  },
  apagar: function () {
    return `${this.marca} ${this.modelo} apagado`;
  },
};

// Crear objeto usando Object.create()
const auto = Object.create(vehiculoPrototipo);
auto.marca = 'Toyota';
auto.modelo = 'Corolla';
auto.año = 2023;
auto.color = 'Rojo';

console.log('Auto creado:', auto);
console.log('Auto encendido:', auto.encender());

// ================================================
// 5. ACCESO A PROPIEDADES - NOTACIÓN PUNTO
// ================================================

console.log('\n5. Notación Punto');
console.log('-----------------');

const libro = {
  titulo: 'JavaScript: The Good Parts',
  autor: 'Douglas Crockford',
  paginas: 176,
  isbn: '978-0596517748',
  editorial: "O'Reilly Media",
};

// Acceso con notación punto
console.log('Título:', libro.titulo);
console.log('Autor:', libro.autor);
console.log('Páginas:', libro.paginas);

// Modificar propiedades
libro.disponible = true;
libro.precio = 45000;

console.log('Libro actualizado:', libro);

// ================================================
// 6. ACCESO A PROPIEDADES - NOTACIÓN CORCHETES
// ================================================

console.log('\n6. Notación Corchetes');
console.log('---------------------');

const usuario = {
  'nombre-completo': 'Juan Pérez',
  'edad-años': 25,
  'correo-electronico': 'juan.perez@email.com',
  'fecha-registro': '2024-01-15',
};

// Acceso con notación corchetes (necesario para propiedades con guiones)
console.log('Nombre completo:', usuario['nombre-completo']);
console.log('Edad en años:', usuario['edad-años']);
console.log('Correo:', usuario['correo-electronico']);

// Acceso usando variables
const propiedad = 'fecha-registro';
console.log('Fecha de registro:', usuario[propiedad]);

// ================================================
// 7. PROPIEDADES DINÁMICAS
// ================================================

console.log('\n7. Propiedades Dinámicas');
console.log('------------------------');

const configuracion = {};

// Agregar propiedades dinámicamente
const propiedades = ['tema', 'idioma', 'modo', 'notificaciones'];
const valores = ['oscuro', 'español', 'desarrollador', true];

for (let i = 0; i < propiedades.length; i++) {
  configuracion[propiedades[i]] = valores[i];
}

console.log('Configuración:', configuracion);

// Acceso dinámico
function obtenerConfiguracion(clave) {
  return configuracion[clave];
}

console.log('Tema actual:', obtenerConfiguracion('tema'));
console.log('Idioma actual:', obtenerConfiguracion('idioma'));

// ================================================
// 8. VERIFICACIÓN DE EXISTENCIA
// ================================================

console.log('\n8. Verificación de Existencia');
console.log('------------------------------');

const persona = {
  nombre: 'Laura Martínez',
  edad: 28,
  profesion: 'Doctora',
};

// Verificar si existe una propiedad
console.log('¿Tiene nombre?', 'nombre' in persona);
console.log('¿Tiene apellido?', 'apellido' in persona);

// Verificar con hasOwnProperty
console.log('¿Tiene edad propia?', persona.hasOwnProperty('edad'));
console.log('¿Tiene toString propia?', persona.hasOwnProperty('toString'));

// Verificar con undefined
console.log('¿Profesión es undefined?', persona.profesion === undefined);
console.log('¿Telefono es undefined?', persona.telefono === undefined);

// ================================================
// 9. PROPIEDADES COMPUTADAS
// ================================================

console.log('\n9. Propiedades Computadas');
console.log('-------------------------');

const prefijo = 'config';
const configuracionAvanzada = {
  [prefijo + 'General']: 'valor general',
  [prefijo + 'Usuario']: 'valor usuario',
  [prefijo + 'Sistema']: 'valor sistema',
};

console.log('Configuración avanzada:', configuracionAvanzada);

// Crear propiedades computadas dinámicamente
const datos = {};
const categorias = ['productos', 'usuarios', 'ventas'];

categorias.forEach(categoria => {
  datos[categoria + 'Total'] = 0;
  datos[categoria + 'Activos'] = 0;
});

console.log('Datos inicializados:', datos);

// ================================================
// 10. EJERCICIOS PRÁCTICOS
// ================================================

console.log('\n10. Ejercicios Prácticos');
console.log('------------------------');

// Ejercicio A: Crear un objeto curso
const curso = {
  nombre: 'JavaScript Avanzado',
  duracion: 40,
  instructor: 'Carlos Mendoza',
  estudiantes: ['Ana', 'Juan', 'María'],
  modalidad: 'Virtual',
  activo: true,
};

console.log('Curso creado:', curso);
console.log('Número de estudiantes:', curso.estudiantes.length);

// Ejercicio B: Usar factory function para crear productos
function crearProducto(nombre, precio, categoria) {
  return {
    id: Date.now(),
    nombre: nombre,
    precio: precio,
    categoria: categoria,
    fechaCreacion: new Date(),
    disponible: true,
  };
}

const producto1 = crearProducto('Mouse', 45000, 'Accesorios');
const producto2 = crearProducto('Teclado', 120000, 'Accesorios');

console.log('Producto 1:', producto1);
console.log('Producto 2:', producto2);

// Ejercicio C: Acceso dinámico a propiedades
const estadisticas = {
  visitasHoy: 150,
  visitasAyer: 200,
  visitasSemana: 1200,
  visitasMes: 5000,
};

function obtenerEstadistica(periodo) {
  const clave = 'visitas' + periodo.charAt(0).toUpperCase() + periodo.slice(1);
  return estadisticas[clave] || 'Período no válido';
}

console.log('Visitas hoy:', obtenerEstadistica('hoy'));
console.log('Visitas ayer:', obtenerEstadistica('ayer'));
console.log('Visitas semana:', obtenerEstadistica('semana'));

// ================================================
// 11. CASOS DE USO REALES
// ================================================

console.log('\n11. Casos de Uso Reales');
console.log('-----------------------');

// Caso 1: Configuración de aplicación
const appConfig = {
  nombreApp: 'Sistema de Inventario',
  version: '1.0.0',
  desarrollador: 'SENA WorldSkills',
  configuracion: {
    tema: 'claro',
    idioma: 'es',
    notificaciones: true,
  },
  apis: {
    productos: '/api/productos',
    usuarios: '/api/usuarios',
    reportes: '/api/reportes',
  },
};

console.log('Configuración de app:', appConfig);

// Caso 2: Datos de formulario
const formularioContacto = {};

// Simular datos del formulario
const camposFormulario = ['nombre', 'email', 'telefono', 'mensaje'];
const valoresFormulario = ['Ana García', 'ana@email.com', '123456789', 'Hola!'];

camposFormulario.forEach((campo, index) => {
  formularioContacto[campo] = valoresFormulario[index];
});

formularioContacto.fechaEnvio = new Date();
formularioContacto.procesado = false;

console.log('Datos del formulario:', formularioContacto);

// ================================================
// 12. BUENAS PRÁCTICAS
// ================================================

console.log('\n12. Buenas Prácticas');
console.log('--------------------');

// ✅ Usar nombres descriptivos
const cliente = {
  nombreCompleto: 'María Rodríguez',
  numeroDocumento: '12345678',
  emailPrincipal: 'maria@email.com',
  telefonoMovil: '3001234567',
  fechaNacimiento: '1990-05-15',
  estadoCivil: 'Soltero',
};

console.log('Cliente con propiedades descriptivas:', cliente);

// ✅ Agrupar propiedades relacionadas
const pedido = {
  id: 'PED-001',
  fecha: new Date(),
  cliente: {
    nombre: 'Juan Pérez',
    email: 'juan@email.com',
  },
  productos: [
    { id: 1, nombre: 'Laptop', precio: 1200000 },
    { id: 2, nombre: 'Mouse', precio: 45000 },
  ],
  totales: {
    subtotal: 1245000,
    impuestos: 236550,
    total: 1481550,
  },
  estado: 'Pendiente',
};

console.log('Pedido bien estructurado:', pedido);

console.log('\n✅ Ejercicio 1 completado exitosamente!');
console.log('📚 Conceptos aprendidos:');
console.log('   - Creación de objetos con 4 sintaxis');
console.log('   - Acceso a propiedades con punto y corchetes');
console.log('   - Propiedades dinámicas y computadas');
console.log('   - Verificación de existencia de propiedades');
console.log('   - Casos de uso reales y buenas prácticas');

// ================================================
// 🎯 DESAFÍO EXTRA
// ================================================

console.log('\n🎯 Desafío Extra');
console.log('================');

// Crear un sistema básico de gestión de biblioteca
function crearLibro(titulo, autor, isbn, año) {
  return {
    titulo: titulo,
    autor: autor,
    isbn: isbn,
    año: año,
    disponible: true,
    prestamos: [],
  };
}

const biblioteca = {
  nombre: 'Biblioteca Central',
  libros: [],
  usuarios: [],

  agregarLibro: function (libro) {
    this.libros.push(libro);
  },

  buscarLibro: function (titulo) {
    return this.libros.find(libro => libro.titulo === titulo);
  },
};

// Agregar libros
biblioteca.agregarLibro(
  crearLibro(
    'Cien años de soledad',
    'Gabriel García Márquez',
    '978-84-376-0495-5',
    1967
  )
);
biblioteca.agregarLibro(
  crearLibro(
    'El amor en los tiempos del cólera',
    'Gabriel García Márquez',
    '978-84-376-0496-2',
    1985
  )
);

console.log('Biblioteca creada:', biblioteca);
console.log(
  'Libro encontrado:',
  biblioteca.buscarLibro('Cien años de soledad')
);

console.log(
  '\n🎉 ¡Excelente trabajo! Has dominado los objetos básicos en JavaScript.'
);
