/**
 * 🎯 Ejercicio 4: Iteración sobre Objetos
 *
 * Objetivo: Dominar las diferentes formas de iterar sobre objetos en JavaScript
 *
 * Conceptos cubiertos:
 * - for...in loop
 * - Object.keys()
 * - Object.values()
 * - Object.entries()
 * - forEach con métodos de Object
 * - Combinación con destructuring
 * - Casos de uso prácticos
 */

console.log('🎯 Ejercicio 4: Iteración sobre Objetos');
console.log('=======================================');

// ================================================
// 1. FOR...IN LOOP
// ================================================

console.log('\n1. For...in Loop');
console.log('----------------');

const estudiante = {
  nombre: 'Ana García',
  edad: 22,
  carrera: 'Ingeniería de Software',
  semestre: 6,
  promedio: 4.3,
  activo: true,
};

// Iteración básica con for...in
console.log('Propiedades del estudiante:');
for (const propiedad in estudiante) {
  console.log(`${propiedad}: ${estudiante[propiedad]}`);
}

// Verificar propiedades propias (no heredadas)
console.log('\nSolo propiedades propias:');
for (const propiedad in estudiante) {
  if (estudiante.hasOwnProperty(propiedad)) {
    console.log(`${propiedad}: ${estudiante[propiedad]}`);
  }
}

// Filtrar por tipo de valor
console.log('\nSolo valores string:');
for (const propiedad in estudiante) {
  if (typeof estudiante[propiedad] === 'string') {
    console.log(`${propiedad}: ${estudiante[propiedad]}`);
  }
}

// ================================================
// 2. OBJECT.KEYS()
// ================================================

console.log('\n2. Object.keys()');
console.log('----------------');

const producto = {
  id: 1,
  nombre: 'Laptop Dell',
  precio: 2500000,
  categoria: 'Electrónicos',
  stock: 15,
  disponible: true,
};

// Obtener todas las claves
const claves = Object.keys(producto);
console.log('Claves del producto:', claves);

// Iterar sobre las claves
console.log('\nIterando con Object.keys():');
Object.keys(producto).forEach(clave => {
  console.log(`${clave}: ${producto[clave]}`);
});

// Filtrar claves específicas
const clavesNumericas = Object.keys(producto).filter(
  clave => typeof producto[clave] === 'number'
);
console.log('Claves numéricas:', clavesNumericas);

// Transformar claves
const clavesEnMayusculas = Object.keys(producto).map(clave =>
  clave.toUpperCase()
);
console.log('Claves en mayúsculas:', clavesEnMayusculas);

// ================================================
// 3. OBJECT.VALUES()
// ================================================

console.log('\n3. Object.values()');
console.log('------------------');

const empleado = {
  nombre: 'Carlos López',
  edad: 28,
  departamento: 'IT',
  salario: 3500000,
  experiencia: 5,
};

// Obtener todos los valores
const valores = Object.values(empleado);
console.log('Valores del empleado:', valores);

// Iterar sobre los valores
console.log('\nIterando con Object.values():');
Object.values(empleado).forEach((valor, indice) => {
  console.log(`Valor ${indice}: ${valor}`);
});

// Filtrar valores por tipo
const valoresNumericos = Object.values(empleado).filter(
  valor => typeof valor === 'number'
);
console.log('Valores numéricos:', valoresNumericos);

// Sumar valores numéricos
const sumaValoresNumericos = Object.values(empleado)
  .filter(valor => typeof valor === 'number')
  .reduce((suma, valor) => suma + valor, 0);
console.log('Suma de valores numéricos:', sumaValoresNumericos);

// ================================================
// 4. OBJECT.ENTRIES()
// ================================================

console.log('\n4. Object.entries()');
console.log('-------------------');

const configuracion = {
  tema: 'oscuro',
  idioma: 'es',
  notificaciones: true,
  autoGuardado: false,
  timeout: 5000,
};

// Obtener pares clave-valor
const entradas = Object.entries(configuracion);
console.log('Entradas de configuración:', entradas);

// Iterar sobre las entradas con destructuring
console.log('\nIterando con Object.entries():');
Object.entries(configuracion).forEach(([clave, valor]) => {
  console.log(`${clave}: ${valor}`);
});

// Filtrar entradas
const configuracionBooleana = Object.entries(configuracion).filter(
  ([clave, valor]) => typeof valor === 'boolean'
);
console.log('Configuración booleana:', configuracionBooleana);

// Transformar entradas
const configuracionEnMayusculas = Object.entries(configuracion).map(
  ([clave, valor]) => [clave.toUpperCase(), valor]
);
console.log('Configuración en mayúsculas:', configuracionEnMayusculas);

// ================================================
// 5. COMBINACIÓN CON DESTRUCTURING
// ================================================

console.log('\n5. Combinación con Destructuring');
console.log('--------------------------------');

const usuario = {
  id: 123,
  nombre: 'María Rodríguez',
  email: 'maria@email.com',
  perfil: {
    edad: 25,
    profesion: 'Desarrolladora',
    habilidades: ['JavaScript', 'React', 'Node.js'],
  },
  configuracion: {
    tema: 'claro',
    idioma: 'es',
  },
};

// Destructuring en forEach
console.log('Información del usuario:');
Object.entries(usuario).forEach(([clave, valor]) => {
  if (typeof valor === 'object' && valor !== null) {
    console.log(`${clave}: [objeto]`);
    Object.entries(valor).forEach(([subClave, subValor]) => {
      console.log(`  ${subClave}: ${subValor}`);
    });
  } else {
    console.log(`${clave}: ${valor}`);
  }
});

// Función para procesar objeto con destructuring
function procesarUsuario({ id, nombre, email, perfil: { edad, profesion } }) {
  return {
    identificacion: id,
    nombreCompleto: nombre,
    correoElectronico: email,
    informacionProfesional: {
      edad,
      profesion,
    },
  };
}

const usuarioProcesado = procesarUsuario(usuario);
console.log('Usuario procesado:', usuarioProcesado);

// ================================================
// 6. MÉTODOS AVANZADOS DE ITERACIÓN
// ================================================

console.log('\n6. Métodos Avanzados de Iteración');
console.log('---------------------------------');

const inventario = {
  laptops: 10,
  mouses: 25,
  teclados: 18,
  monitores: 8,
  impresoras: 5,
};

// Función para procesar inventario
function procesarInventario(inventario) {
  const procesado = {
    items: [],
    totalItems: 0,
    itemsBajoStock: [],
    itemsAltoStock: [],
  };

  Object.entries(inventario).forEach(([producto, cantidad]) => {
    // Agregar a lista de items
    procesado.items.push({ producto, cantidad });

    // Sumar al total
    procesado.totalItems += cantidad;

    // Clasificar por stock
    if (cantidad < 10) {
      procesado.itemsBajoStock.push(producto);
    } else if (cantidad > 20) {
      procesado.itemsAltoStock.push(producto);
    }
  });

  return procesado;
}

const inventarioProcesado = procesarInventario(inventario);
console.log('Inventario procesado:', inventarioProcesado);

// Función para crear reporte de inventario
function crearReporteInventario(inventario) {
  return Object.entries(inventario)
    .map(([producto, cantidad]) => ({
      producto,
      cantidad,
      estado:
        cantidad < 10 ? 'Bajo stock' : cantidad > 20 ? 'Alto stock' : 'Normal',
      necesitaReposicion: cantidad < 10,
    }))
    .sort((a, b) => a.cantidad - b.cantidad);
}

const reporteInventario = crearReporteInventario(inventario);
console.log('Reporte de inventario:', reporteInventario);

// ================================================
// 7. TRANSFORMACIÓN DE OBJETOS
// ================================================

console.log('\n7. Transformación de Objetos');
console.log('----------------------------');

const ventasMes = {
  enero: 1500000,
  febrero: 1800000,
  marzo: 1200000,
  abril: 2100000,
  mayo: 1900000,
};

// Transformar a array de objetos
const ventasArray = Object.entries(ventasMes).map(([mes, venta]) => ({
  mes,
  venta,
  ventaFormateada: `$${venta.toLocaleString('es-CO')}`,
}));

console.log('Ventas como array:', ventasArray);

// Calcular estadísticas
const estadisticasVentas = Object.values(ventasMes).reduce(
  (stats, venta) => ({
    total: stats.total + venta,
    maximo: Math.max(stats.maximo, venta),
    minimo: Math.min(stats.minimo, venta),
    count: stats.count + 1,
  }),
  { total: 0, maximo: 0, minimo: Infinity, count: 0 }
);

estadisticasVentas.promedio =
  estadisticasVentas.total / estadisticasVentas.count;

console.log('Estadísticas de ventas:', estadisticasVentas);

// Crear objeto con ventas filtradas
const ventasAltas = Object.fromEntries(
  Object.entries(ventasMes).filter(([mes, venta]) => venta > 1500000)
);

console.log('Ventas altas:', ventasAltas);

// ================================================
// 8. ITERACIÓN SOBRE OBJETOS ANIDADOS
// ================================================

console.log('\n8. Iteración sobre Objetos Anidados');
console.log('-----------------------------------');

const empresa = {
  nombre: 'TechCorp',
  departamentos: {
    desarrollo: {
      empleados: 15,
      presupuesto: 50000000,
      proyectos: ['App Mobile', 'Web Platform', 'API Gateway'],
    },
    marketing: {
      empleados: 8,
      presupuesto: 25000000,
      proyectos: ['Campaña Digital', 'SEO', 'Social Media'],
    },
    ventas: {
      empleados: 12,
      presupuesto: 35000000,
      proyectos: ['CRM', 'Lead Generation', 'Customer Success'],
    },
  },
};

// Función para iterar sobre estructura anidada
function analizarEmpresa(empresa) {
  const { nombre, departamentos } = empresa;

  console.log(`Análisis de ${nombre}:`);

  let totalEmpleados = 0;
  let totalPresupuesto = 0;
  let totalProyectos = 0;

  Object.entries(departamentos).forEach(([nombreDept, datosDepto]) => {
    const { empleados, presupuesto, proyectos } = datosDepto;

    console.log(`\n${nombreDept.toUpperCase()}:`);
    console.log(`  Empleados: ${empleados}`);
    console.log(`  Presupuesto: $${presupuesto.toLocaleString('es-CO')}`);
    console.log(`  Proyectos: ${proyectos.join(', ')}`);

    totalEmpleados += empleados;
    totalPresupuesto += presupuesto;
    totalProyectos += proyectos.length;
  });

  console.log('\nTOTALES:');
  console.log(`Total empleados: ${totalEmpleados}`);
  console.log(
    `Total presupuesto: $${totalPresupuesto.toLocaleString('es-CO')}`
  );
  console.log(`Total proyectos: ${totalProyectos}`);

  return {
    totalEmpleados,
    totalPresupuesto,
    totalProyectos,
    departamentos: Object.keys(departamentos).length,
  };
}

const resumenEmpresa = analizarEmpresa(empresa);
console.log('\nResumen final:', resumenEmpresa);

// ================================================
// 9. CASOS DE USO PRÁCTICOS
// ================================================

console.log('\n9. Casos de Uso Prácticos');
console.log('-------------------------');

// Caso 1: Validación de formulario
const formulario = {
  nombre: 'Juan Pérez',
  email: 'juan@email.com',
  telefono: '',
  edad: 25,
  acepta_terminos: true,
};

function validarFormulario(datos) {
  const errores = [];
  const camposRequeridos = ['nombre', 'email', 'telefono'];

  // Validar campos requeridos
  camposRequeridos.forEach(campo => {
    if (!datos[campo] || datos[campo].toString().trim() === '') {
      errores.push(`${campo} es requerido`);
    }
  });

  // Validar email
  if (datos.email && !datos.email.includes('@')) {
    errores.push('Email no válido');
  }

  // Validar edad
  if (datos.edad && (datos.edad < 18 || datos.edad > 100)) {
    errores.push('Edad debe estar entre 18 y 100 años');
  }

  // Validar términos
  if (!datos.acepta_terminos) {
    errores.push('Debe aceptar los términos y condiciones');
  }

  return {
    valido: errores.length === 0,
    errores,
  };
}

const validacion = validarFormulario(formulario);
console.log('Validación de formulario:', validacion);

// Caso 2: Procesamiento de datos de API
const respuestaAPI = {
  usuarios: [
    { id: 1, nombre: 'Ana', activo: true, rol: 'admin' },
    { id: 2, nombre: 'Carlos', activo: false, rol: 'user' },
    { id: 3, nombre: 'María', activo: true, rol: 'user' },
  ],
  configuracion: {
    paginacion: 10,
    orden: 'nombre',
    filtros: ['activo', 'rol'],
  },
};

function procesarRespuestaAPI(respuesta) {
  const { usuarios, configuracion } = respuesta;

  // Procesar usuarios
  const usuariosActivos = usuarios.filter(usuario => usuario.activo);
  const usuariosPorRol = usuarios.reduce((acc, usuario) => {
    acc[usuario.rol] = (acc[usuario.rol] || 0) + 1;
    return acc;
  }, {});

  // Procesar configuración
  const configuracionProcesada = Object.entries(configuracion).reduce(
    (acc, [clave, valor]) => {
      acc[clave] = valor;
      return acc;
    },
    {}
  );

  return {
    totalUsuarios: usuarios.length,
    usuariosActivos: usuariosActivos.length,
    usuariosPorRol,
    configuracion: configuracionProcesada,
  };
}

const datosAPI = procesarRespuestaAPI(respuestaAPI);
console.log('Datos de API procesados:', datosAPI);

// Caso 3: Generación de reportes
const datosVentas = {
  vendedores: {
    ana_garcia: { ventas: 15, monto: 2500000 },
    carlos_lopez: { ventas: 22, monto: 3100000 },
    maria_rodriguez: { ventas: 18, monto: 2800000 },
  },
  productos: {
    laptop: { cantidad: 30, precio: 2000000 },
    mouse: { cantidad: 155, precio: 45000 },
    teclado: { cantidad: 89, precio: 120000 },
  },
};

function generarReporteVentas(datos) {
  const { vendedores, productos } = datos;

  // Reporte de vendedores
  const reporteVendedores = Object.entries(vendedores)
    .map(([nombre, datos]) => ({
      vendedor: nombre.replace('_', ' ').toUpperCase(),
      ventas: datos.ventas,
      monto: datos.monto,
      promedioVenta: datos.monto / datos.ventas,
    }))
    .sort((a, b) => b.monto - a.monto);

  // Reporte de productos
  const reporteProductos = Object.entries(productos)
    .map(([nombre, datos]) => ({
      producto: nombre.toUpperCase(),
      cantidad: datos.cantidad,
      precio: datos.precio,
      ingresoTotal: datos.cantidad * datos.precio,
    }))
    .sort((a, b) => b.ingresoTotal - a.ingresoTotal);

  // Totales
  const totalVentas = Object.values(vendedores).reduce(
    (acc, vendedor) => acc + vendedor.ventas,
    0
  );

  const totalMonto = Object.values(vendedores).reduce(
    (acc, vendedor) => acc + vendedor.monto,
    0
  );

  return {
    vendedores: reporteVendedores,
    productos: reporteProductos,
    resumen: {
      totalVentas,
      totalMonto,
      promedioVenta: totalMonto / totalVentas,
    },
  };
}

const reporteVentas = generarReporteVentas(datosVentas);
console.log('Reporte de ventas:', reporteVentas);

// ================================================
// 10. EJERCICIOS PRÁCTICOS
// ================================================

console.log('\n10. Ejercicios Prácticos');
console.log('-----------------------');

// Ejercicio A: Contador de caracteres
function contarCaracteres(texto) {
  return texto.split('').reduce((contador, char) => {
    contador[char] = (contador[char] || 0) + 1;
    return contador;
  }, {});
}

const texto = 'javascript es genial';
const contadorChars = contarCaracteres(texto);
console.log('Contador de caracteres:', contadorChars);

// Mostrar estadísticas
Object.entries(contadorChars)
  .sort(([, a], [, b]) => b - a)
  .forEach(([char, count]) => {
    console.log(`'${char}': ${count} veces`);
  });

// Ejercicio B: Agrupador de datos
function agruparPor(array, propiedad) {
  return array.reduce((grupos, item) => {
    const clave = item[propiedad];
    grupos[clave] = grupos[clave] || [];
    grupos[clave].push(item);
    return grupos;
  }, {});
}

const estudiantes = [
  { nombre: 'Ana', carrera: 'Ingeniería', semestre: 6 },
  { nombre: 'Carlos', carrera: 'Medicina', semestre: 4 },
  { nombre: 'María', carrera: 'Ingeniería', semestre: 8 },
  { nombre: 'Luis', carrera: 'Derecho', semestre: 2 },
];

const estudiantesPorCarrera = agruparPor(estudiantes, 'carrera');
console.log('Estudiantes por carrera:', estudiantesPorCarrera);

// Mostrar estadísticas por carrera
Object.entries(estudiantesPorCarrera).forEach(([carrera, estudiantes]) => {
  console.log(`${carrera}: ${estudiantes.length} estudiantes`);
  estudiantes.forEach(estudiante => {
    console.log(`  - ${estudiante.nombre} (Semestre ${estudiante.semestre})`);
  });
});

console.log('\n✅ Ejercicio 4 completado exitosamente!');
console.log('📚 Conceptos aprendidos:');
console.log('   - for...in para iterar propiedades');
console.log('   - Object.keys() para obtener claves');
console.log('   - Object.values() para obtener valores');
console.log('   - Object.entries() para obtener pares clave-valor');
console.log('   - Combinación con destructuring');
console.log('   - Transformación de objetos');
console.log('   - Iteración sobre objetos anidados');
console.log('   - Casos de uso prácticos');

// ================================================
// 🎯 DESAFÍO EXTRA
// ================================================

console.log('\n🎯 Desafío Extra');
console.log('================');

// Sistema de análisis de logs
const logs = [
  {
    timestamp: '2024-01-15 10:30:00',
    level: 'INFO',
    message: 'Usuario logueado',
    user: 'ana@email.com',
  },
  {
    timestamp: '2024-01-15 10:31:00',
    level: 'WARNING',
    message: 'Intento de acceso',
    user: 'carlos@email.com',
  },
  {
    timestamp: '2024-01-15 10:32:00',
    level: 'ERROR',
    message: 'Fallo en conexión',
    user: 'maria@email.com',
  },
  {
    timestamp: '2024-01-15 10:33:00',
    level: 'INFO',
    message: 'Datos actualizados',
    user: 'ana@email.com',
  },
  {
    timestamp: '2024-01-15 10:34:00',
    level: 'ERROR',
    message: 'Error de validación',
    user: 'carlos@email.com',
  },
];

function analizarLogs(logs) {
  const analisis = {
    totalLogs: logs.length,
    porNivel: {},
    porUsuario: {},
    erroresPorUsuario: {},
    timeline: [],
  };

  logs.forEach(log => {
    const { level, user, timestamp, message } = log;

    // Contar por nivel
    analisis.porNivel[level] = (analisis.porNivel[level] || 0) + 1;

    // Contar por usuario
    if (!analisis.porUsuario[user]) {
      analisis.porUsuario[user] = { total: 0, info: 0, warning: 0, error: 0 };
    }
    analisis.porUsuario[user].total++;
    analisis.porUsuario[user][level.toLowerCase()]++;

    // Errores por usuario
    if (level === 'ERROR') {
      analisis.erroresPorUsuario[user] =
        (analisis.erroresPorUsuario[user] || 0) + 1;
    }

    // Timeline
    analisis.timeline.push({
      tiempo: timestamp,
      evento: `${level}: ${message} (${user})`,
    });
  });

  return analisis;
}

const analisisLogs = analizarLogs(logs);
console.log('Análisis de logs:', analisisLogs);

// Mostrar reporte detallado
console.log('\nReporte detallado:');
Object.entries(analisisLogs.porUsuario).forEach(([usuario, stats]) => {
  console.log(`Usuario: ${usuario}`);
  Object.entries(stats).forEach(([tipo, cantidad]) => {
    console.log(`  ${tipo}: ${cantidad}`);
  });
});

console.log(
  '\n🎉 ¡Fantástico! Has dominado completamente la iteración sobre objetos.'
);
