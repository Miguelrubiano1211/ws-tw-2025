// 🚀 Desafío: Presentación Personal Interactiva
// Objetivo: Combinar todos los conceptos aprendidos

console.log('=== 🚀 DESAFÍO: PRESENTACIÓN PERSONAL ===');

// TODO: Completa tu información personal
const miNombre = ''; // Tu nombre completo
const miEdad = 0; // Tu edad
const miCiudad = ''; // Tu ciudad
const miProfesion = ''; // Estudiante, Desarrollador, etc.
const misHobbies = []; // Array con tus hobbies
const miExperiencia = 0; // Años de experiencia (puede ser 0)

// TODO: Información adicional
const miEmail = ''; // Tu email
const miTelefono = ''; // Tu teléfono
const misHabilidades = []; // Lenguajes de programación que conoces
const miObjetivo = ''; // Tu objetivo profesional

// 🎨 Función para crear separadores visuales
function mostrarSeparador(titulo) {
  console.log('\n' + '='.repeat(50));
  console.log(`📋 ${titulo.toUpperCase()}`);
  console.log('='.repeat(50));
}

// 🌟 Presentación principal
mostrarSeparador('Información Personal');

console.log(`👋 ¡Hola! Mi nombre es ${miNombre}`);
console.log(`📅 Tengo ${miEdad} años`);
console.log(`🏠 Vivo en ${miCiudad}`);
console.log(`💼 Actualmente soy ${miProfesion}`);

// 🎯 Mostrar experiencia
mostrarSeparador('Experiencia y Objetivos');

if (miExperiencia > 0) {
  console.log(`⭐ Tengo ${miExperiencia} años de experiencia`);
} else {
  console.log('🌱 Estoy comenzando mi carrera en programación');
}

console.log(`🎯 Mi objetivo es: ${miObjetivo}`);

// 🛠️ Mostrar habilidades
mostrarSeparador('Habilidades Técnicas');

if (misHabilidades.length > 0) {
  console.log('💻 Lenguajes que conozco:');
  misHabilidades.forEach((habilidad, index) => {
    console.log(`   ${index + 1}. ${habilidad}`);
  });
} else {
  console.log('📚 Estoy aprendiendo mis primeros lenguajes');
}

// 🎨 Mostrar hobbies
mostrarSeparador('Intereses Personales');

if (misHobbies.length > 0) {
  console.log('🎪 Mis hobbies son:');
  console.table(misHobbies);
} else {
  console.log('🔍 Aún explorando mis intereses');
}

// 📞 Información de contacto
mostrarSeparador('Contacto');

console.log(`📧 Email: ${miEmail}`);
console.log(`📱 Teléfono: ${miTelefono}`);

// 🎉 Mensaje final
mostrarSeparador('Mensaje Final');

console.log('🚀 ¡Gracias por conocer un poco sobre mí!');
console.log('💪 Estoy emocionado por aprender y crecer en el mundo de la programación');
console.log('🌟 ¡Sigamos aprendiendo juntos!');

// 📊 Estadísticas finales
mostrarSeparador('Estadísticas');

console.log(`📈 Total de habilidades: ${misHabilidades.length}`);
console.log(`🎯 Total de hobbies: ${misHobbies.length}`);
console.log(`⚡ Nivel de motivación: ${miExperiencia > 2 ? 'Experto' : miExperiencia > 0 ? 'Intermedio' : 'Principiante con ganas'}`);

// 🎵 Datos curiosos (opcional)
const datosCuriosos = [
  `Mi ciudad natal tiene ${miCiudad.length} letras`,
  `Mi nombre tiene ${miNombre.length} caracteres`,
  `Tengo ${miEdad} años, lo que equivale a ${miEdad * 365} días aproximadamente`
];

mostrarSeparador('Datos Curiosos');
datosCuriosos.forEach((dato, index) => {
  console.log(`${index + 1}. ${dato}`);
});

console.log('\n🎉 ¡Presentación completada! 🎉');

/* 
🏆 CRITERIOS DE EVALUACIÓN:
- [ ] Todas las variables están completas
- [ ] Uso correcto de let/const
- [ ] Comentarios descriptivos
- [ ] Salida organizada y atractiva
- [ ] Creatividad en la presentación
- [ ] Manejo de arrays y objetos
- [ ] Uso de template literals
- [ ] Funciones auxiliares (mostrarSeparador)
*/
