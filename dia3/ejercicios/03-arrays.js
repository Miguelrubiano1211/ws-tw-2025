// 📝 Ejercicio 3: Arrays y Métodos Modernos
// Día 3 - JavaScript ES6+ Fundamentals

console.log('🚀 Ejercicio 3: Arrays y Métodos Modernos');

// ============================================
// Ejercicio 3.1: map() - Transformar Arrays
// ============================================
console.log('\n--- Ejercicio 3.1: map() - Transformar Arrays ---');

const productos = [
  { id: 1, nombre: 'Laptop', precio: 1200 },
  { id: 2, nombre: 'Mouse', precio: 25 },
  { id: 3, nombre: 'Teclado', precio: 80 },
  { id: 4, nombre: 'Monitor', precio: 300 },
];

// Extraer solo los nombres
const nombres = productos.map(producto => producto.nombre);
console.log('Nombres:', nombres);

// Aplicar descuento del 10%
const productosConDescuento = productos.map(producto => ({
  ...producto,
  precio: producto.precio * 0.9,
  descuento: true,
}));
console.log('Con descuento:', productosConDescuento);

// TODO: Crea un array de números y usa map para:
// 1. Convertir cada número a su cuadrado
// 2. Convertir cada número a string con formato "Número: X"
// Tu solución aquí:
const numeros = [1, 2, 3, 4, 5];
const cuadrados = numeros.map(num => num ** 2);
const numerosFormateados = numeros.map(num => `Número: ${num}`);

console.log('Números originales:', numeros);
console.log('Cuadrados:', cuadrados);
console.log('Formateados:', numerosFormateados);

// ============================================
// Ejercicio 3.2: filter() - Filtrar Arrays
// ============================================
console.log('\n--- Ejercicio 3.2: filter() - Filtrar Arrays ---');

const estudiantes = [
  { nombre: 'Ana', edad: 22, nota: 85 },
  { nombre: 'Carlos', edad: 19, nota: 92 },
  { nombre: 'María', edad: 21, nota: 78 },
  { nombre: 'Pedro', edad: 20, nota: 95 },
  { nombre: 'Sofía', edad: 23, nota: 88 },
];

// Filtrar estudiantes aprobados (nota >= 80)
const aprobados = estudiantes.filter(estudiante => estudiante.nota >= 80);
console.log('Estudiantes aprobados:', aprobados);

// Filtrar estudiantes mayores de 20 años
const mayores20 = estudiantes.filter(estudiante => estudiante.edad > 20);
console.log('Mayores de 20:', mayores20);

// TODO: Filtra los productos que cuestan menos de $100
// Tu solución aquí:
const productosBaratos = productos.filter(producto => producto.precio < 100);
console.log('Productos baratos:', productosBaratos);

// ============================================
// Ejercicio 3.3: reduce() - Reducir Arrays
// ============================================
console.log('\n--- Ejercicio 3.3: reduce() - Reducir Arrays ---');

const ventas = [100, 250, 180, 300, 450];

// Suma total de ventas
const totalVentas = ventas.reduce((total, venta) => total + venta, 0);
console.log('Total de ventas:', totalVentas);

// Encontrar la venta máxima
const ventaMaxima = ventas.reduce(
  (max, venta) => (venta > max ? venta : max),
  0
);
console.log('Venta máxima:', ventaMaxima);

// Contar productos por categoría
const inventario = [
  { producto: 'Laptop', categoria: 'Electrónicos' },
  { producto: 'Mesa', categoria: 'Muebles' },
  { producto: 'Mouse', categoria: 'Electrónicos' },
  { producto: 'Silla', categoria: 'Muebles' },
  { producto: 'Teclado', categoria: 'Electrónicos' },
];

const conteoCategoria = inventario.reduce((contador, item) => {
  contador[item.categoria] = (contador[item.categoria] || 0) + 1;
  return contador;
}, {});

console.log('Conteo por categoría:', conteoCategoria);

// TODO: Usa reduce para calcular el precio total de todos los productos
// Tu solución aquí:
const precioTotal = productos.reduce(
  (total, producto) => total + producto.precio,
  0
);
console.log('Precio total de productos:', precioTotal);

// ============================================
// Ejercicio 3.4: find() y findIndex()
// ============================================
console.log('\n--- Ejercicio 3.4: find() y findIndex() ---');

// Buscar un producto específico
const laptopEncontrada = productos.find(
  producto => producto.nombre === 'Laptop'
);
console.log('Laptop encontrada:', laptopEncontrada);

// Buscar el índice de un producto
const indiceMonitor = productos.findIndex(
  producto => producto.nombre === 'Monitor'
);
console.log('Índice del monitor:', indiceMonitor);

// TODO: Encuentra el primer estudiante con nota superior a 90
// Tu solución aquí:
const estudianteExcelente = estudiantes.find(
  estudiante => estudiante.nota > 90
);
console.log('Estudiante excelente:', estudianteExcelente);

// ============================================
// Ejercicio 3.5: some() y every()
// ============================================
console.log('\n--- Ejercicio 3.5: some() y every() ---');

// Verificar si hay algún producto caro (> $500)
const hayProductoCaro = productos.some(producto => producto.precio > 500);
console.log('¿Hay algún producto caro?', hayProductoCaro);

// Verificar si todos los estudiantes aprobaron
const todosAprobaron = estudiantes.every(estudiante => estudiante.nota >= 70);
console.log('¿Todos los estudiantes aprobaron?', todosAprobaron);

// TODO: Verifica si hay algún producto que cueste exactamente $25
// Tu solución aquí:
const hayProducto25 = productos.some(producto => producto.precio === 25);
console.log('¿Hay algún producto de $25?', hayProducto25);

// ============================================
// Ejercicio 3.6: Combinando Métodos
// ============================================
console.log('\n--- Ejercicio 3.6: Combinando Métodos ---');

// Obtener nombres de productos caros (> $50) en mayúsculas
const productosCarosNombres = productos
  .filter(producto => producto.precio > 50)
  .map(producto => producto.nombre.toUpperCase());

console.log('Productos caros (nombres en mayúsculas):', productosCarosNombres);

// Calcular el promedio de notas de estudiantes mayores de 20 años
const promedioMayores20 = estudiantes
  .filter(estudiante => estudiante.edad > 20)
  .reduce((suma, estudiante, index, array) => {
    suma += estudiante.nota;
    return index === array.length - 1 ? suma / array.length : suma;
  }, 0);

console.log('Promedio de notas de mayores de 20:', promedioMayores20);

// TODO: Encuentra el producto más caro y devuelve su nombre en mayúsculas
// Tu solución aquí:
const productoMasCaro = productos
  .reduce((max, producto) => (producto.precio > max.precio ? producto : max))
  .nombre.toUpperCase();

console.log('Producto más caro:', productoMasCaro);

// ============================================
// Ejercicio 3.7: Métodos de Array Avanzados
// ============================================
console.log('\n--- Ejercicio 3.7: Métodos de Array Avanzados ---');

// Array.from() - Crear arrays
const arrayDesdeString = Array.from('Hello');
console.log('Array desde string:', arrayDesdeString);

const arrayNumeros = Array.from({ length: 5 }, (_, i) => i + 1);
console.log('Array de números:', arrayNumeros);

// includes() - Verificar si incluye un elemento
const frutas = ['manzana', 'banana', 'naranja'];
console.log('¿Incluye banana?', frutas.includes('banana'));

// indexOf() vs findIndex()
const indiceNaranja = frutas.indexOf('naranja');
const indiceNaranja2 = frutas.findIndex(fruta => fruta === 'naranja');
console.log('indexOf vs findIndex:', indiceNaranja, indiceNaranja2);

// TODO: Crea un array del 1 al 10 usando Array.from()
// Tu solución aquí:
const unoAlDiez = Array.from({ length: 10 }, (_, i) => i + 1);
console.log('Array del 1 al 10:', unoAlDiez);

// ============================================
// Desafío: Procesamiento de Datos
// ============================================
console.log('\n--- 🎯 Desafío: Procesamiento de Datos ---');

const transacciones = [
  {
    id: 1,
    tipo: 'ingreso',
    monto: 1200,
    fecha: '2024-01-15',
    categoria: 'salario',
  },
  {
    id: 2,
    tipo: 'gasto',
    monto: 300,
    fecha: '2024-01-16',
    categoria: 'comida',
  },
  {
    id: 3,
    tipo: 'gasto',
    monto: 150,
    fecha: '2024-01-17',
    categoria: 'transporte',
  },
  {
    id: 4,
    tipo: 'ingreso',
    monto: 500,
    fecha: '2024-01-18',
    categoria: 'freelance',
  },
  {
    id: 5,
    tipo: 'gasto',
    monto: 80,
    fecha: '2024-01-19',
    categoria: 'entretenimiento',
  },
  {
    id: 6,
    tipo: 'gasto',
    monto: 200,
    fecha: '2024-01-20',
    categoria: 'comida',
  },
];

// TODO: Implementa las siguientes funciones usando métodos de array:

// 1. Calcular balance total (ingresos - gastos)
const calcularBalance = transacciones => {
  return transacciones.reduce((balance, transaccion) => {
    return transaccion.tipo === 'ingreso'
      ? balance + transaccion.monto
      : balance - transaccion.monto;
  }, 0);
};

// 2. Obtener gastos por categoría
const gastosPorCategoria = transacciones => {
  return transacciones
    .filter(t => t.tipo === 'gasto')
    .reduce((gastos, transaccion) => {
      gastos[transaccion.categoria] =
        (gastos[transaccion.categoria] || 0) + transaccion.monto;
      return gastos;
    }, {});
};

// 3. Encontrar la transacción de mayor monto
const transaccionMayor = transacciones => {
  return transacciones.reduce((mayor, transaccion) =>
    transaccion.monto > mayor.monto ? transaccion : mayor
  );
};

// 4. Filtrar transacciones por tipo y ordenar por monto
const transaccionesPorTipo = (transacciones, tipo) => {
  return transacciones
    .filter(t => t.tipo === tipo)
    .sort((a, b) => b.monto - a.monto);
};

// 5. Crear resumen estadístico
const resumenEstadistico = transacciones => {
  const ingresos = transacciones.filter(t => t.tipo === 'ingreso');
  const gastos = transacciones.filter(t => t.tipo === 'gasto');

  const totalIngresos = ingresos.reduce((total, t) => total + t.monto, 0);
  const totalGastos = gastos.reduce((total, t) => total + t.monto, 0);

  return {
    totalTransacciones: transacciones.length,
    totalIngresos,
    totalGastos,
    balance: totalIngresos - totalGastos,
    promedioIngreso: totalIngresos / ingresos.length,
    promedioGasto: totalGastos / gastos.length,
    categoriasMayorGasto: gastosPorCategoria(transacciones),
  };
};

// Pruebas
console.log('Balance total:', calcularBalance(transacciones));
console.log('Gastos por categoría:', gastosPorCategoria(transacciones));
console.log('Transacción mayor:', transaccionMayor(transacciones));
console.log(
  'Ingresos ordenados:',
  transaccionesPorTipo(transacciones, 'ingreso')
);
console.log('Resumen estadístico:', resumenEstadistico(transacciones));

// ============================================
// 🎯 Puntos Clave para WorldSkills
// ============================================
console.log('\n🎯 Puntos Clave para WorldSkills:');
console.log('✅ map() transforma cada elemento del array');
console.log('✅ filter() selecciona elementos que cumplan una condición');
console.log('✅ reduce() es el método más poderoso para agregaciones');
console.log('✅ Combinar métodos permite procesamiento de datos complejo');
console.log('✅ find() y findIndex() son eficientes para búsquedas');
console.log('✅ some() y every() son útiles para validaciones');
console.log('✅ Usar métodos inmutables mantiene el array original intacto');
