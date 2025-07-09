/**
 * 🎯 Ejercicio 5: Objetos Anidados
 *
 * Objetivo: Trabajar con estructuras de datos complejas y objetos anidados
 *
 * Conceptos cubiertos:
 * - Objetos dentro de objetos
 * - Arrays de objetos
 * - Acceso a propiedades anidadas
 * - Modificación de estructuras anidadas
 * - Clonado profundo vs superficial
 * - Navegación en estructuras complejas
 */

console.log('🎯 Ejercicio 5: Objetos Anidados');
console.log('================================');

// ================================================
// 1. ESTRUCTURAS BÁSICAS ANIDADAS
// ================================================

console.log('\n1. Estructuras Básicas Anidadas');
console.log('-------------------------------');

// Objeto con múltiples niveles de anidación
const universidad = {
  nombre: 'Universidad Nacional',
  fundacion: 1867,
  ubicacion: {
    pais: 'Colombia',
    ciudad: 'Bogotá',
    direccion: {
      calle: 'Carrera 30 # 45-03',
      barrio: 'La Candelaria',
      codigoPostal: '111321',
    },
  },
  contacto: {
    telefono: '3165000',
    email: 'info@unal.edu.co',
    web: 'www.unal.edu.co',
    redesSociales: {
      facebook: 'UniversidadNacional',
      twitter: '@UNALOficial',
      instagram: 'unaloficial',
    },
  },
  estadisticas: {
    estudiantes: 53000,
    profesores: 3500,
    programas: 450,
    sedes: 8,
  },
};

// Acceso a propiedades anidadas
console.log('Nombre:', universidad.nombre);
console.log('Ciudad:', universidad.ubicacion.ciudad);
console.log('Dirección completa:', universidad.ubicacion.direccion.calle);
console.log('Email:', universidad.contacto.email);
console.log('Instagram:', universidad.contacto.redesSociales.instagram);
console.log('Total estudiantes:', universidad.estadisticas.estudiantes);

// Función para obtener información de contacto
function obtenerContacto(uni) {
  const { contacto } = uni;
  return {
    principal: {
      telefono: contacto.telefono,
      email: contacto.email,
      web: contacto.web,
    },
    redesSociales: contacto.redesSociales,
  };
}

console.log('Información de contacto:', obtenerContacto(universidad));

// ================================================
// 2. ARRAYS DE OBJETOS ANIDADOS
// ================================================

console.log('\n2. Arrays de Objetos Anidados');
console.log('-----------------------------');

const empresa = {
  nombre: 'TechCorp Solutions',
  fundacion: 2015,
  departamentos: [
    {
      nombre: 'Desarrollo',
      presupuesto: 50000000,
      empleados: [
        {
          id: 1,
          nombre: 'Ana García',
          cargo: 'Senior Developer',
          salario: 4200000,
          habilidades: ['JavaScript', 'React', 'Node.js'],
          proyectos: [
            { nombre: 'E-commerce', estado: 'completado', horas: 120 },
            { nombre: 'Mobile App', estado: 'en progreso', horas: 80 },
          ],
        },
        {
          id: 2,
          nombre: 'Carlos López',
          cargo: 'Frontend Developer',
          salario: 3800000,
          habilidades: ['HTML', 'CSS', 'Vue.js'],
          proyectos: [
            { nombre: 'Landing Page', estado: 'completado', horas: 40 },
            { nombre: 'Dashboard', estado: 'en progreso', horas: 60 },
          ],
        },
      ],
    },
    {
      nombre: 'Marketing',
      presupuesto: 30000000,
      empleados: [
        {
          id: 3,
          nombre: 'María Rodríguez',
          cargo: 'Marketing Manager',
          salario: 4000000,
          habilidades: ['SEO', 'Google Ads', 'Analytics'],
          proyectos: [
            { nombre: 'Campaña Digital', estado: 'completado', horas: 90 },
            { nombre: 'Social Media', estado: 'en progreso', horas: 50 },
          ],
        },
      ],
    },
  ],
};

// Acceder a información específica
console.log('Empresa:', empresa.nombre);
console.log('Primer departamento:', empresa.departamentos[0].nombre);
console.log('Primer empleado:', empresa.departamentos[0].empleados[0].nombre);
console.log(
  'Habilidades del primer empleado:',
  empresa.departamentos[0].empleados[0].habilidades
);

// Función para obtener todos los empleados
function obtenerTodosLosEmpleados(empresa) {
  const empleados = [];

  empresa.departamentos.forEach(departamento => {
    departamento.empleados.forEach(empleado => {
      empleados.push({
        ...empleado,
        departamento: departamento.nombre,
      });
    });
  });

  return empleados;
}

const todosEmpleados = obtenerTodosLosEmpleados(empresa);
console.log('Todos los empleados:', todosEmpleados);

// ================================================
// 3. NAVEGACIÓN Y BÚSQUEDA EN ESTRUCTURAS ANIDADAS
// ================================================

console.log('\n3. Navegación y Búsqueda');
console.log('------------------------');

// Función para buscar empleado por ID
function buscarEmpleadoPorId(empresa, id) {
  for (const departamento of empresa.departamentos) {
    for (const empleado of departamento.empleados) {
      if (empleado.id === id) {
        return {
          ...empleado,
          departamento: departamento.nombre,
        };
      }
    }
  }
  return null;
}

const empleadoEncontrado = buscarEmpleadoPorId(empresa, 2);
console.log('Empleado encontrado:', empleadoEncontrado);

// Función para buscar por habilidad
function buscarPorHabilidad(empresa, habilidad) {
  const empleadosConHabilidad = [];

  empresa.departamentos.forEach(departamento => {
    departamento.empleados.forEach(empleado => {
      if (empleado.habilidades.includes(habilidad)) {
        empleadosConHabilidad.push({
          nombre: empleado.nombre,
          cargo: empleado.cargo,
          departamento: departamento.nombre,
        });
      }
    });
  });

  return empleadosConHabilidad;
}

const expertosCss = buscarPorHabilidad(empresa, 'CSS');
console.log('Expertos en CSS:', expertosCss);

// Función para obtener estadísticas generales
function obtenerEstadisticasEmpresa(empresa) {
  let totalEmpleados = 0;
  let totalSalarios = 0;
  let totalPresupuesto = 0;
  let totalProyectos = 0;
  const habilidadesUnicas = new Set();

  empresa.departamentos.forEach(departamento => {
    totalPresupuesto += departamento.presupuesto;

    departamento.empleados.forEach(empleado => {
      totalEmpleados++;
      totalSalarios += empleado.salario;
      totalProyectos += empleado.proyectos.length;

      empleado.habilidades.forEach(habilidad => {
        habilidadesUnicas.add(habilidad);
      });
    });
  });

  return {
    totalEmpleados,
    salarioPromedio: totalSalarios / totalEmpleados,
    totalPresupuesto,
    totalProyectos,
    totalHabilidades: habilidadesUnicas.size,
    habilidadesUnicas: Array.from(habilidadesUnicas),
  };
}

const estadisticasEmpresa = obtenerEstadisticasEmpresa(empresa);
console.log('Estadísticas de la empresa:', estadisticasEmpresa);

// ================================================
// 4. MODIFICACIÓN DE ESTRUCTURAS ANIDADAS
// ================================================

console.log('\n4. Modificación de Estructuras Anidadas');
console.log('--------------------------------------');

// Crear una copia profunda para modificar
const empresaCopia = JSON.parse(JSON.stringify(empresa));

// Función para agregar un nuevo empleado
function agregarEmpleado(empresa, nombreDepartamento, nuevoEmpleado) {
  const departamento = empresa.departamentos.find(
    dept => dept.nombre === nombreDepartamento
  );

  if (departamento) {
    // Generar ID único
    const maxId = Math.max(
      ...empresa.departamentos.flatMap(dept =>
        dept.empleados.map(emp => emp.id)
      )
    );

    nuevoEmpleado.id = maxId + 1;
    departamento.empleados.push(nuevoEmpleado);
    return true;
  }

  return false;
}

// Agregar nuevo empleado
const nuevoEmpleado = {
  nombre: 'Luis Martínez',
  cargo: 'UX Designer',
  salario: 3500000,
  habilidades: ['Figma', 'Adobe XD', 'Sketch'],
  proyectos: [{ nombre: 'Rediseño Web', estado: 'en progreso', horas: 30 }],
};

const empleadoAgregado = agregarEmpleado(
  empresaCopia,
  'Desarrollo',
  nuevoEmpleado
);
console.log('Empleado agregado:', empleadoAgregado);

// Función para actualizar salario
function actualizarSalario(empresa, idEmpleado, nuevoSalario) {
  for (const departamento of empresa.departamentos) {
    for (const empleado of departamento.empleados) {
      if (empleado.id === idEmpleado) {
        empleado.salario = nuevoSalario;
        return empleado;
      }
    }
  }
  return null;
}

const empleadoActualizado = actualizarSalario(empresaCopia, 1, 4500000);
console.log('Empleado actualizado:', empleadoActualizado);

// Función para agregar proyecto a empleado
function agregarProyecto(empresa, idEmpleado, nuevoProyecto) {
  for (const departamento of empresa.departamentos) {
    for (const empleado of departamento.empleados) {
      if (empleado.id === idEmpleado) {
        empleado.proyectos.push(nuevoProyecto);
        return empleado;
      }
    }
  }
  return null;
}

const proyectoAgregado = agregarProyecto(empresaCopia, 2, {
  nombre: 'Componentes UI',
  estado: 'planificado',
  horas: 0,
});

console.log('Proyecto agregado a empleado:', proyectoAgregado);

// ================================================
// 5. CLONADO PROFUNDO VS SUPERFICIAL
// ================================================

console.log('\n5. Clonado Profundo vs Superficial');
console.log('----------------------------------');

const objetoOriginal = {
  nombre: 'Ana',
  edad: 25,
  direccion: {
    calle: 'Calle 123',
    ciudad: 'Bogotá',
  },
  hobbies: ['leer', 'correr', 'cocinar'],
};

// Clonado superficial (shallow copy)
const clonSuperficial = { ...objetoOriginal };
const clonSuperficial2 = Object.assign({}, objetoOriginal);

// Clonado profundo (deep copy)
const clonProfundo = JSON.parse(JSON.stringify(objetoOriginal));

// Función para clonado profundo más robusta
function clonarProfundo(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  if (obj instanceof Array) {
    return obj.map(item => clonarProfundo(item));
  }

  if (typeof obj === 'object') {
    const clonado = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonado[key] = clonarProfundo(obj[key]);
      }
    }
    return clonado;
  }
}

const clonRobusto = clonarProfundo(objetoOriginal);

// Modificar objetos para ver diferencias
console.log('Objeto original:', objetoOriginal);

// Modificar clon superficial
clonSuperficial.nombre = 'María';
clonSuperficial.direccion.ciudad = 'Medellín';

console.log('Después de modificar clon superficial:');
console.log('Original:', objetoOriginal);
console.log('Clon superficial:', clonSuperficial);

// Modificar clon profundo
clonProfundo.edad = 30;
clonProfundo.direccion.calle = 'Carrera 456';

console.log('Después de modificar clon profundo:');
console.log('Original:', objetoOriginal);
console.log('Clon profundo:', clonProfundo);

// ================================================
// 6. TRABAJANDO CON ESTRUCTURAS COMPLEJAS
// ================================================

console.log('\n6. Estructuras Complejas');
console.log('------------------------');

const sistemaEducativo = {
  nombre: 'Sistema Educativo Nacional',
  regiones: [
    {
      nombre: 'Región Andina',
      universidades: [
        {
          nombre: 'Universidad Nacional',
          facultades: [
            {
              nombre: 'Ingeniería',
              programas: [
                {
                  nombre: 'Ingeniería de Sistemas',
                  codigo: 'IS001',
                  duracion: 10,
                  creditos: 160,
                  estudiantes: [
                    {
                      id: 1,
                      nombre: 'Juan Pérez',
                      semestre: 8,
                      materias: [
                        { nombre: 'Bases de Datos', creditos: 4, nota: 4.2 },
                        { nombre: 'Desarrollo Web', creditos: 3, nota: 4.5 },
                      ],
                    },
                    {
                      id: 2,
                      nombre: 'Ana García',
                      semestre: 6,
                      materias: [
                        { nombre: 'Programación', creditos: 4, nota: 4.8 },
                        { nombre: 'Algoritmos', creditos: 3, nota: 4.3 },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

// Función para obtener estadísticas completas
function obtenerEstadisticasEducativas(sistema) {
  let totalUniversidades = 0;
  let totalFacultades = 0;
  let totalProgramas = 0;
  let totalEstudiantes = 0;
  let totalMaterias = 0;
  let sumaNotas = 0;
  let cantidadNotas = 0;

  sistema.regiones.forEach(region => {
    region.universidades.forEach(universidad => {
      totalUniversidades++;

      universidad.facultades.forEach(facultad => {
        totalFacultades++;

        facultad.programas.forEach(programa => {
          totalProgramas++;

          programa.estudiantes.forEach(estudiante => {
            totalEstudiantes++;

            estudiante.materias.forEach(materia => {
              totalMaterias++;
              sumaNotas += materia.nota;
              cantidadNotas++;
            });
          });
        });
      });
    });
  });

  return {
    totalUniversidades,
    totalFacultades,
    totalProgramas,
    totalEstudiantes,
    totalMaterias,
    promedioGeneral: sumaNotas / cantidadNotas,
  };
}

const estadisticasEducativas = obtenerEstadisticasEducativas(sistemaEducativo);
console.log('Estadísticas educativas:', estadisticasEducativas);

// Función para buscar estudiante por nombre
function buscarEstudiantePorNombre(sistema, nombre) {
  for (const region of sistema.regiones) {
    for (const universidad of region.universidades) {
      for (const facultad of universidad.facultades) {
        for (const programa of facultad.programas) {
          for (const estudiante of programa.estudiantes) {
            if (estudiante.nombre === nombre) {
              return {
                estudiante,
                ubicacion: {
                  region: region.nombre,
                  universidad: universidad.nombre,
                  facultad: facultad.nombre,
                  programa: programa.nombre,
                },
              };
            }
          }
        }
      }
    }
  }
  return null;
}

const estudianteEncontrado2 = buscarEstudiantePorNombre(
  sistemaEducativo,
  'Ana García'
);
console.log('Estudiante encontrado:', estudianteEncontrado2);

// ================================================
// 7. CASOS DE USO PRÁCTICOS
// ================================================

console.log('\n7. Casos de Uso Prácticos');
console.log('-------------------------');

// Caso 1: Sistema de e-commerce
const ecommerce = {
  nombre: 'TechStore',
  categorias: [
    {
      id: 1,
      nombre: 'Electrónicos',
      subcategorias: [
        {
          id: 11,
          nombre: 'Computadoras',
          productos: [
            {
              id: 101,
              nombre: 'Laptop Dell',
              precio: 2500000,
              especificaciones: {
                marca: 'Dell',
                modelo: 'Inspiron 15',
                procesador: 'Intel i7',
                ram: '16GB',
                almacenamiento: '512GB SSD',
              },
              inventario: {
                stock: 15,
                almacen: 'Bogotá',
                proveedor: 'Dell Colombia',
              },
              reviews: [
                {
                  usuario: 'Juan123',
                  rating: 5,
                  comentario: 'Excelente producto',
                },
                { usuario: 'Ana456', rating: 4, comentario: 'Buena calidad' },
              ],
            },
          ],
        },
      ],
    },
  ],
};

// Función para obtener producto por ID
function obtenerProductoPorId(ecommerce, idProducto) {
  for (const categoria of ecommerce.categorias) {
    for (const subcategoria of categoria.subcategorias) {
      for (const producto of subcategoria.productos) {
        if (producto.id === idProducto) {
          return {
            producto,
            categoria: categoria.nombre,
            subcategoria: subcategoria.nombre,
          };
        }
      }
    }
  }
  return null;
}

const producto = obtenerProductoPorId(ecommerce, 101);
console.log('Producto encontrado:', producto);

// Función para calcular rating promedio
function calcularRatingPromedio(producto) {
  if (!producto.reviews || producto.reviews.length === 0) {
    return 0;
  }

  const sumaRatings = producto.reviews.reduce(
    (suma, review) => suma + review.rating,
    0
  );
  return sumaRatings / producto.reviews.length;
}

const ratingPromedio = calcularRatingPromedio(
  ecommerce.categorias[0].subcategorias[0].productos[0]
);
console.log('Rating promedio:', ratingPromedio);

// ================================================
// 8. EJERCICIOS PRÁCTICOS
// ================================================

console.log('\n8. Ejercicios Prácticos');
console.log('-----------------------');

// Ejercicio A: Sistema de biblioteca
const biblioteca = {
  nombre: 'Biblioteca Central',
  secciones: [
    {
      nombre: 'Ficción',
      estantes: [
        {
          numero: 1,
          libros: [
            {
              isbn: '978-84-376-0495-5',
              titulo: 'Cien años de soledad',
              autor: 'Gabriel García Márquez',
              año: 1967,
              disponible: true,
              prestamos: [
                { usuario: 'user123', fecha: '2024-01-10', devuelto: true },
                { usuario: 'user456', fecha: '2024-01-15', devuelto: false },
              ],
            },
          ],
        },
      ],
    },
  ],
};

// Función para buscar libro por título
function buscarLibroPorTitulo(biblioteca, titulo) {
  for (const seccion of biblioteca.secciones) {
    for (const estante of seccion.estantes) {
      for (const libro of estante.libros) {
        if (libro.titulo.toLowerCase().includes(titulo.toLowerCase())) {
          return {
            libro,
            ubicacion: {
              seccion: seccion.nombre,
              estante: estante.numero,
            },
          };
        }
      }
    }
  }
  return null;
}

const libroEncontrado = buscarLibroPorTitulo(biblioteca, 'Cien años');
console.log('Libro encontrado:', libroEncontrado);

// Función para verificar disponibilidad
function verificarDisponibilidad(libro) {
  const prestamosActivos = libro.prestamos.filter(
    prestamo => !prestamo.devuelto
  );
  return prestamosActivos.length === 0;
}

const disponible = verificarDisponibilidad(
  biblioteca.secciones[0].estantes[0].libros[0]
);
console.log('Libro disponible:', disponible);

console.log('\n✅ Ejercicio 5 completado exitosamente!');
console.log('📚 Conceptos aprendidos:');
console.log('   - Trabajo con objetos anidados complejos');
console.log('   - Arrays de objetos anidados');
console.log('   - Navegación en estructuras profundas');
console.log('   - Búsqueda en estructuras anidadas');
console.log('   - Modificación de datos anidados');
console.log('   - Clonado profundo vs superficial');
console.log('   - Casos de uso con estructuras complejas');

// ================================================
// 🎯 DESAFÍO EXTRA
// ================================================

console.log('\n🎯 Desafío Extra');
console.log('================');

// Sistema de gestión hospitalaria
const hospital = {
  nombre: 'Hospital San Rafael',
  departamentos: [
    {
      nombre: 'Emergencias',
      medicos: [
        {
          id: 1,
          nombre: 'Dr. Carlos Mendoza',
          especialidad: 'Medicina General',
          pacientes: [
            {
              id: 101,
              nombre: 'Ana Rodríguez',
              edad: 35,
              historial: [
                {
                  fecha: '2024-01-15',
                  diagnostico: 'Gripe',
                  tratamiento: 'Reposo y medicamentos',
                  medicamentos: [
                    {
                      nombre: 'Paracetamol',
                      dosis: '500mg',
                      frecuencia: 'cada 8 horas',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

// Función para obtener historial completo de paciente
function obtenerHistorialPaciente(hospital, idPaciente) {
  for (const departamento of hospital.departamentos) {
    for (const medico of departamento.medicos) {
      for (const paciente of medico.pacientes) {
        if (paciente.id === idPaciente) {
          return {
            paciente: {
              nombre: paciente.nombre,
              edad: paciente.edad,
            },
            historial: paciente.historial,
            medicoTratante: medico.nombre,
            departamento: departamento.nombre,
          };
        }
      }
    }
  }
  return null;
}

const historialPaciente = obtenerHistorialPaciente(hospital, 101);
console.log('Historial del paciente:', historialPaciente);

// Función para obtener estadísticas del hospital
function obtenerEstadisticasHospital(hospital) {
  let totalMedicos = 0;
  let totalPacientes = 0;
  let totalConsultas = 0;
  const especialidades = new Set();

  hospital.departamentos.forEach(departamento => {
    departamento.medicos.forEach(medico => {
      totalMedicos++;
      especialidades.add(medico.especialidad);

      medico.pacientes.forEach(paciente => {
        totalPacientes++;
        totalConsultas += paciente.historial.length;
      });
    });
  });

  return {
    totalMedicos,
    totalPacientes,
    totalConsultas,
    especialidades: Array.from(especialidades),
    consultasPromedioPorPaciente: totalConsultas / totalPacientes,
  };
}

const estadisticasHospital = obtenerEstadisticasHospital(hospital);
console.log('Estadísticas del hospital:', estadisticasHospital);

console.log(
  '\n🎉 ¡Extraordinario! Has dominado completamente los objetos anidados en JavaScript.'
);
