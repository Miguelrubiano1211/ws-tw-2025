/**
 * 📚 EJERCICIO 2: Destructuring
 *
 * Objetivo: Dominar destructuring de arrays, objetos y parámetros
 * Nivel: Intermedio
 * Tiempo estimado: 45-60 minutos
 */

console.log('🎯 Ejercicio 2: Destructuring');
console.log('==============================');

// =====================================================
// 1. ARRAY DESTRUCTURING
// =====================================================

console.log('\n1. 📌 Array Destructuring');
console.log('-------------------------');

// EJERCICIO 1.1: Destructuring básico
function arrayBasico() {
  console.log('Array Destructuring Básico:');

  const colores = ['rojo', 'verde', 'azul', 'amarillo', 'naranja'];

  // TODO: Destructuring básico
  const [primero, segundo, tercero] = colores;
  console.log('Primeros tres:', { primero, segundo, tercero });

  // TODO: Saltar elementos
  const [, , tercer, , quinto] = colores;
  console.log('Tercero y quinto:', { tercer, quinto });

  // TODO: Con valores por defecto
  const [r, g, b, a = 'transparente'] = ['rojo', 'verde', 'azul'];
  console.log('Con default:', { r, g, b, a });

  // TODO: Más elementos que el array
  const [x, y, z, w = 'default'] = ['a', 'b'];
  console.log('Más elementos:', { x, y, z, w });
}

// EJERCICIO 1.2: Rest elements
function arrayRest() {
  console.log('\nArray Rest Elements:');

  const numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  // TODO: Rest elements
  const [primero, segundo, ...resto] = numeros;
  console.log('Primero:', primero);
  console.log('Segundo:', segundo);
  console.log('Resto:', resto);

  // TODO: Head y tail
  const [head, ...tail] = numeros;
  console.log('Head:', head);
  console.log('Tail:', tail);

  // TODO: Primeros y últimos
  const [first, , , ...ultimosTres] = numeros.slice(-6);
  console.log('Primeros y últimos:', { first, ultimosTres });
}

// EJERCICIO 1.3: Swapping variables
function arraySwapping() {
  console.log('\nVariable Swapping:');

  let a = 10;
  let b = 20;
  let c = 30;

  console.log('Antes del swap:', { a, b, c });

  // TODO: Swap usando destructuring
  [a, b] = [b, a];
  console.log('Después del swap a-b:', { a, b, c });

  // TODO: Rotation de múltiples variables
  [a, b, c] = [c, a, b];
  console.log('Después de rotation:', { a, b, c });
}

// EJERCICIO 1.4: Nested array destructuring
function arrayNested() {
  console.log('\nNested Array Destructuring:');

  const matriz = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ];

  // TODO: Destructuring nested
  const [[a, b], [c, d], [e, f, g]] = matriz;
  console.log('Elementos extraídos:', { a, b, c, d, e, f, g });

  // TODO: Combinado con rest
  const [primeraFila, ...otrasFilas] = matriz;
  const [primerElemento, ...restoPrimera] = primeraFila;

  console.log('Primera fila:', primeraFila);
  console.log('Otras filas:', otrasFilas);
  console.log('Primer elemento:', primerElemento);
  console.log('Resto primera fila:', restoPrimera);
}

// =====================================================
// 2. OBJECT DESTRUCTURING
// =====================================================

console.log('\n2. 📌 Object Destructuring');
console.log('---------------------------');

// EJERCICIO 2.1: Destructuring básico de objetos
function objectBasico() {
  console.log('Object Destructuring Básico:');

  const usuario = {
    nombre: 'Ana',
    edad: 28,
    email: 'ana@example.com',
    ciudad: 'Bogotá',
    pais: 'Colombia',
  };

  // TODO: Destructuring básico
  const { nombre, edad, email } = usuario;
  console.log('Datos básicos:', { nombre, edad, email });

  // TODO: Renaming variables
  const { nombre: userName, edad: userAge } = usuario;
  console.log('Renombrado:', { userName, userAge });

  // TODO: Con valores por defecto
  const { ciudad, pais, telefono = 'No disponible' } = usuario;
  console.log('Con defaults:', { ciudad, pais, telefono });
}

// EJERCICIO 2.2: Nested object destructuring
function objectNested() {
  console.log('\nNested Object Destructuring:');

  const empleado = {
    nombre: 'Carlos',
    puesto: 'Desarrollador',
    departamento: {
      nombre: 'IT',
      piso: 3,
      jefe: {
        nombre: 'María',
        email: 'maria@company.com',
      },
    },
    proyectos: [
      { nombre: 'Web App', estado: 'activo' },
      { nombre: 'Mobile App', estado: 'terminado' },
    ],
  };

  // TODO: Destructuring nested
  const {
    nombre,
    departamento: {
      nombre: nombreDep,
      piso,
      jefe: { nombre: nombreJefe, email: emailJefe },
    },
  } = empleado;

  console.log('Datos nested:', {
    nombre,
    nombreDep,
    piso,
    nombreJefe,
    emailJefe,
  });

  // TODO: Array dentro de objeto
  const {
    proyectos: [proyectoActual, ...otrosProyectos],
  } = empleado;
  console.log('Proyecto actual:', proyectoActual);
  console.log('Otros proyectos:', otrosProyectos);
}

// EJERCICIO 2.3: Rest properties
function objectRest() {
  console.log('\nObject Rest Properties:');

  const configuracion = {
    host: 'localhost',
    port: 3000,
    ssl: true,
    timeout: 5000,
    retries: 3,
    debug: false,
  };

  // TODO: Separar propiedades específicas del resto
  const { host, port, ...opcionesAvanzadas } = configuracion;
  console.log('Conexión:', { host, port });
  console.log('Opciones avanzadas:', opcionesAvanzadas);

  // TODO: Uso práctico - filtrar propiedades
  const usuario = {
    id: 1,
    nombre: 'Juan',
    email: 'juan@example.com',
    password: 'secreto123',
    createdAt: '2023-01-01',
    updatedAt: '2023-12-01',
  };

  const { password, createdAt, updatedAt, ...datosPublicos } = usuario;
  console.log('Datos públicos:', datosPublicos);
}

// EJERCICIO 2.4: Computed property names
function objectComputed() {
  console.log('\nComputed Property Names:');

  const datos = {
    'user-name': 'Pedro',
    'user-age': 35,
    'user-email': 'pedro@example.com',
    'is-active': true,
  };

  // TODO: Destructuring con computed properties
  const campo = 'user-name';
  const { [campo]: nombre } = datos;
  console.log('Nombre usando computed:', nombre);

  // TODO: Múltiples computed properties
  const campos = ['user-name', 'user-age', 'is-active'];
  const extraerCampos = (obj, campos) => {
    const resultado = {};
    campos.forEach(campo => {
      const { [campo]: valor } = obj;
      resultado[campo] = valor;
    });
    return resultado;
  };

  const datosExtraidos = extraerCampos(datos, campos);
  console.log('Datos extraídos:', datosExtraidos);
}

// =====================================================
// 3. FUNCTION PARAMETER DESTRUCTURING
// =====================================================

console.log('\n3. 📌 Function Parameter Destructuring');
console.log('---------------------------------------');

// EJERCICIO 3.1: Destructuring en parámetros
function parametrosBasicos() {
  console.log('Parameter Destructuring Básico:');

  // TODO: Función con object destructuring
  const crearUsuario = ({ nombre, email, edad = 18 }) => {
    return {
      id: Date.now(),
      nombre,
      email,
      edad,
      createdAt: new Date(),
    };
  };

  const nuevoUsuario = crearUsuario({
    nombre: 'Laura',
    email: 'laura@example.com',
    edad: 25,
  });

  console.log('Usuario creado:', nuevoUsuario);

  // TODO: Función con array destructuring
  const calcularDistancia = ([x1, y1], [x2, y2]) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const distancia = calcularDistancia([0, 0], [3, 4]);
  console.log('Distancia:', distancia);
}

// EJERCICIO 3.2: Destructuring con rest parameters
function parametrosRest() {
  console.log('\nParameter Destructuring with Rest:');

  // TODO: Función con mixed destructuring
  const procesarPedido = ({ cliente, total }, ...items) => {
    const resumen = {
      cliente,
      total,
      cantidad: items.length,
      items: items.map(item => ({
        nombre: item.nombre,
        precio: item.precio,
      })),
    };

    return resumen;
  };

  const pedido = procesarPedido(
    { cliente: 'Ana', total: 150 },
    { nombre: 'Laptop', precio: 100 },
    { nombre: 'Mouse', precio: 25 },
    { nombre: 'Teclado', precio: 25 }
  );

  console.log('Pedido procesado:', pedido);
}

// EJERCICIO 3.3: Destructuring con valores por defecto
function parametrosDefaults() {
  console.log('\nParameter Destructuring with Defaults:');

  // TODO: Función con defaults complejos
  const configurarAPI = ({
    host = 'localhost',
    port = 3000,
    ssl = false,
    timeout = 5000,
    headers = { 'Content-Type': 'application/json' },
  } = {}) => {
    const config = {
      baseURL: `${ssl ? 'https' : 'http'}://${host}:${port}`,
      timeout,
      headers,
    };

    return config;
  };

  // Diferentes formas de llamar
  console.log('Config por defecto:', configurarAPI());
  console.log(
    'Config personalizada:',
    configurarAPI({
      host: 'api.example.com',
      ssl: true,
      port: 443,
    })
  );
}

// =====================================================
// 4. DESTRUCTURING PATTERNS AVANZADOS
// =====================================================

console.log('\n4. 📌 Destructuring Patterns Avanzados');
console.log('---------------------------------------');

// EJERCICIO 4.1: Destructuring en loops
function destructuringLoops() {
  console.log('Destructuring in Loops:');

  const estudiantes = [
    { nombre: 'Ana', notas: [85, 92, 78] },
    { nombre: 'Carlos', notas: [90, 88, 95] },
    { nombre: 'María', notas: [87, 91, 89] },
  ];

  // TODO: for...of con destructuring
  for (const { nombre, notas } of estudiantes) {
    const promedio = notas.reduce((sum, nota) => sum + nota, 0) / notas.length;
    console.log(`${nombre}: promedio ${promedio.toFixed(2)}`);
  }

  // TODO: forEach con destructuring
  estudiantes.forEach(({ nombre, notas: [primera, ...resto] }) => {
    console.log(
      `${nombre}: primera nota ${primera}, resto: ${resto.join(', ')}`
    );
  });
}

// EJERCICIO 4.2: Destructuring con Array.map()
function destructuringMap() {
  console.log('\nDestructuring with Array.map():');

  const productos = [
    { id: 1, nombre: 'Laptop', precio: 1000, categoria: 'electronics' },
    { id: 2, nombre: 'Libro', precio: 20, categoria: 'books' },
    { id: 3, nombre: 'Auriculares', precio: 100, categoria: 'electronics' },
  ];

  // TODO: Map con destructuring
  const productosFormateados = productos.map(
    ({ nombre, precio, categoria }) => ({
      titulo: nombre.toUpperCase(),
      valor: `$${precio}`,
      tipo: categoria,
      descuento: precio > 500 ? precio * 0.1 : 0,
    })
  );

  console.log('Productos formateados:', productosFormateados);

  // TODO: Destructuring con índice
  const productosConIndice = productos.map((producto, index) => {
    const { nombre, precio } = producto;
    return `${index + 1}. ${nombre} - $${precio}`;
  });

  console.log('Productos con índice:', productosConIndice);
}

// EJERCICIO 4.3: Destructuring con Promise.all()
async function destructuringPromises() {
  console.log('\nDestructuring with Promises:');

  // TODO: Simular llamadas async
  const obtenerUsuario = () => Promise.resolve({ id: 1, nombre: 'Juan' });
  const obtenerPedidos = () =>
    Promise.resolve([
      { id: 1, total: 100 },
      { id: 2, total: 150 },
    ]);
  const obtenerConfiguracion = () =>
    Promise.resolve({ theme: 'dark', lang: 'es' });

  try {
    // TODO: Promise.all con destructuring
    const [usuario, pedidos, config] = await Promise.all([
      obtenerUsuario(),
      obtenerPedidos(),
      obtenerConfiguracion(),
    ]);

    console.log('Datos cargados:', { usuario, pedidos, config });

    // TODO: Destructuring nested en async
    const { nombre } = usuario;
    const [primerPedido, ...otrosPedidos] = pedidos;
    const { theme, lang } = config;

    console.log('Datos procesados:', {
      nombre,
      primerPedido,
      otrosPedidos,
      theme,
      lang,
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

// =====================================================
// 5. CASOS DE USO PRÁCTICOS
// =====================================================

console.log('\n5. 📌 Casos de Uso Prácticos');
console.log('-----------------------------');

// EJERCICIO 5.1: API Response handling
function apiResponseHandling() {
  console.log('API Response Handling:');

  // TODO: Simular respuesta de API
  const apiResponse = {
    data: {
      users: [
        { id: 1, name: 'Ana', email: 'ana@example.com' },
        { id: 2, name: 'Carlos', email: 'carlos@example.com' },
      ],
      pagination: {
        page: 1,
        totalPages: 5,
        totalItems: 50,
      },
    },
    status: 200,
    message: 'Success',
  };

  // TODO: Destructuring para extraer datos
  const {
    data: {
      users,
      pagination: { page, totalPages, totalItems },
    },
    status,
  } = apiResponse;

  console.log('Usuarios:', users);
  console.log('Paginación:', { page, totalPages, totalItems });
  console.log('Status:', status);
}

// EJERCICIO 5.2: Configuration merging
function configMerging() {
  console.log('\nConfiguration Merging:');

  const defaultConfig = {
    host: 'localhost',
    port: 3000,
    ssl: false,
    timeout: 5000,
    retries: 3,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  };

  const userConfig = {
    host: 'api.example.com',
    ssl: true,
    port: 443,
    headers: {
      Authorization: 'Bearer token123',
    },
  };

  // TODO: Merge configurations usando destructuring
  const mergeConfig = (defaultConf, userConf) => {
    const { headers: defaultHeaders, ...defaultRest } = defaultConf;
    const { headers: userHeaders = {}, ...userRest } = userConf;

    return {
      ...defaultRest,
      ...userRest,
      headers: {
        ...defaultHeaders,
        ...userHeaders,
      },
    };
  };

  const finalConfig = mergeConfig(defaultConfig, userConfig);
  console.log('Final config:', finalConfig);
}

// EJERCICIO 5.3: Form data processing
function formDataProcessing() {
  console.log('\nForm Data Processing:');

  // TODO: Simular datos de formulario
  const formData = {
    personalInfo: {
      firstName: 'Ana',
      lastName: 'García',
      email: 'ana@example.com',
      phone: '123-456-7890',
    },
    address: {
      street: 'Calle 123',
      city: 'Bogotá',
      country: 'Colombia',
      zipCode: '110111',
    },
    preferences: {
      newsletter: true,
      notifications: false,
      theme: 'dark',
    },
  };

  // TODO: Procesar datos del formulario
  const procesarFormulario = data => {
    const {
      personalInfo: { firstName, lastName, email },
      address: { city, country },
      preferences: { newsletter, theme },
    } = data;

    return {
      fullName: `${firstName} ${lastName}`,
      email,
      location: `${city}, ${country}`,
      settings: {
        newsletter,
        theme,
      },
    };
  };

  const datosProcessados = procesarFormulario(formData);
  console.log('Datos procesados:', datosProcessados);
}

// =====================================================
// 6. EJERCICIOS DESAFÍO
// =====================================================

console.log('\n6. 📌 Ejercicios Desafío');
console.log('------------------------');

// DESAFÍO 1: Deep destructuring utility
function deepDestructuringUtility() {
  console.log('Deep Destructuring Utility:');

  // TODO: Crear función para extractar valores nested
  const extraerValor = (objeto, path) => {
    const keys = path.split('.');
    let valor = objeto;

    for (const key of keys) {
      if (valor && typeof valor === 'object' && key in valor) {
        valor = valor[key];
      } else {
        return undefined;
      }
    }

    return valor;
  };

  const datos = {
    usuario: {
      perfil: {
        nombre: 'Carlos',
        contacto: {
          email: 'carlos@example.com',
          telefono: '123-456-7890',
        },
      },
    },
  };

  console.log('Nombre:', extraerValor(datos, 'usuario.perfil.nombre'));
  console.log('Email:', extraerValor(datos, 'usuario.perfil.contacto.email'));
  console.log('Inexistente:', extraerValor(datos, 'usuario.inexistente.campo'));
}

// DESAFÍO 2: Destructuring transformer
function destructuringTransformer() {
  console.log('\nDestructuring Transformer:');

  // TODO: Crear transformer que use destructuring
  const transformarDatos = datos => {
    return datos.map(item => {
      // Extraer campos específicos y transformar
      const {
        id,
        personal: { nombre, edad },
        trabajo: { empresa, salario },
        ...resto
      } = item;

      return {
        id,
        nombreCompleto: nombre.toUpperCase(),
        edadCategoria: edad < 30 ? 'joven' : edad < 50 ? 'adulto' : 'senior',
        trabajoInfo: `${empresa} - $${salario}`,
        metadatos: resto,
      };
    });
  };

  const empleados = [
    {
      id: 1,
      personal: { nombre: 'Ana García', edad: 28 },
      trabajo: { empresa: 'TechCorp', salario: 5000 },
      ubicacion: 'Bogotá',
      activo: true,
    },
    {
      id: 2,
      personal: { nombre: 'Carlos López', edad: 35 },
      trabajo: { empresa: 'StartupXYZ', salario: 6000 },
      ubicacion: 'Medellín',
      activo: false,
    },
  ];

  const empleadosTransformados = transformarDatos(empleados);
  console.log('Empleados transformados:', empleadosTransformados);
}

// DESAFÍO 3: Destructuring con validation
function destructuringValidation() {
  console.log('\nDestructuring with Validation:');

  // TODO: Crear función que valide mientras destructura
  const validarYExtraer = (datos, schema) => {
    const resultado = {};
    const errores = [];

    for (const [campo, validacion] of Object.entries(schema)) {
      const { [campo]: valor } = datos;

      if (validacion.required && valor === undefined) {
        errores.push(`${campo} es requerido`);
      } else if (valor !== undefined) {
        if (validacion.type && typeof valor !== validacion.type) {
          errores.push(`${campo} debe ser ${validacion.type}`);
        } else if (validacion.validate && !validacion.validate(valor)) {
          errores.push(`${campo} no es válido`);
        } else {
          resultado[campo] = validacion.transform
            ? validacion.transform(valor)
            : valor;
        }
      } else if (validacion.default !== undefined) {
        resultado[campo] = validacion.default;
      }
    }

    return { datos: resultado, errores };
  };

  const schema = {
    nombre: {
      required: true,
      type: 'string',
      transform: val => val.trim().toUpperCase(),
    },
    edad: {
      required: true,
      type: 'number',
      validate: val => val > 0 && val < 120,
    },
    email: {
      required: true,
      type: 'string',
      validate: val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
    },
    activo: {
      required: false,
      type: 'boolean',
      default: true,
    },
  };

  const datosValidos = {
    nombre: '  ana garcía  ',
    edad: 28,
    email: 'ana@example.com',
  };

  const datosInvalidos = {
    nombre: 'Carlos',
    edad: -5,
    email: 'email-invalido',
  };

  console.log('Validación exitosa:', validarYExtraer(datosValidos, schema));
  console.log('Validación fallida:', validarYExtraer(datosInvalidos, schema));
}

// =====================================================
// 7. EJECUCIÓN DE EJERCICIOS
// =====================================================

// Ejecutar todos los ejercicios
async function ejecutarEjercicios() {
  try {
    // Array destructuring
    arrayBasico();
    arrayRest();
    arraySwapping();
    arrayNested();

    // Object destructuring
    objectBasico();
    objectNested();
    objectRest();
    objectComputed();

    // Function parameters
    parametrosBasicos();
    parametrosRest();
    parametrosDefaults();

    // Advanced patterns
    destructuringLoops();
    destructuringMap();
    await destructuringPromises();

    // Practical cases
    apiResponseHandling();
    configMerging();
    formDataProcessing();

    // Challenges
    deepDestructuringUtility();
    destructuringTransformer();
    destructuringValidation();

    console.log('\n✅ Todos los ejercicios de destructuring completados!');
  } catch (error) {
    console.error('❌ Error en ejercicios:', error);
  }
}

// Ejecutar si es llamado directamente
if (typeof module === 'undefined') {
  ejecutarEjercicios();
}

// Exportar para testing
if (typeof module !== 'undefined') {
  module.exports = {
    arrayBasico,
    arrayRest,
    arraySwapping,
    objectBasico,
    objectNested,
    parametrosBasicos,
    destructuringLoops,
    apiResponseHandling,
    configMerging,
  };
}

// =====================================================
// 📝 NOTAS PARA EL ESTUDIANTE
// =====================================================

/*
🎯 OBJETIVOS DE APRENDIZAJE:

1. ARRAY DESTRUCTURING
   - Sintaxis básica
   - Skipping elements
   - Default values
   - Rest elements
   - Nested arrays

2. OBJECT DESTRUCTURING
   - Sintaxis básica
   - Renaming variables
   - Nested objects
   - Computed properties
   - Rest properties

3. FUNCTION PARAMETERS
   - Parameter destructuring
   - Default values
   - Rest parameters
   - Mixed destructuring

4. ADVANCED PATTERNS
   - Destructuring in loops
   - With array methods
   - Async operations
   - Validation patterns

🚀 CASOS DE USO:
- API response handling
- Configuration merging
- Form data processing
- State management
- Data transformation

💡 MEJORES PRÁCTICAS:
- Usa destructuring para código más limpio
- Combina con default values
- Aplica en function parameters
- Usa rest para flexibilidad
- Mantén patterns simples

🔧 PRÓXIMOS PASOS:
- Practica con datos reales
- Combina con spread operator
- Usa en React props
- Aplica en Express routes
*/
