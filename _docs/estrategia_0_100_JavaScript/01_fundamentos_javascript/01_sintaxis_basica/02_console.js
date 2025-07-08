// 📝 Ejercicio 2: Usando Console.log
// Objetivo: Dominar diferentes formas de mostrar información en consola

console.log('=== EJERCICIO 2: CONSOLE.LOG ===');

// Datos para trabajar
const nombre = 'Ana García';
const edad = 22;
const ciudad = 'Bogotá';
const estudia = true;
const lenguajes = ['JavaScript', 'Python', 'Java'];

// TODO: Experimenta con diferentes formas de usar console.log

// 1. Mostrar un solo valor
console.log(nombre);

// 2. Mostrar múltiples valores separados por comas
console.log('Nombre:', nombre, 'Edad:', edad);

// 3. Usar template literals (plantillas de cadena)
console.log(`Hola, soy ${nombre} y tengo ${edad} años`);

// 4. Mostrar objetos y arrays
console.log('Lenguajes que conozco:', lenguajes);

// 5. Usar console.table para arrays (más visual)
console.table(lenguajes);

// 6. Otros métodos útiles de console
console.warn('Esto es una advertencia');
console.error('Esto es un error');
console.info('Esto es información');

// 🚀 Desafío: Crea un "perfil" completo usando console.log
// Incluye todos los datos de manera organizada y atractiva
