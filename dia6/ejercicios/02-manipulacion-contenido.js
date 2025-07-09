/**
 * Día 6: DOM y Eventos - Ejercicio 2
 * Tema: Manipulación de contenido y atributos
 * Dificultad: Básica-Intermedia
 * Tiempo estimado: 20 minutos
 */

// ================================
// MANIPULACIÓN DE CONTENIDO
// ================================

console.log('=== Ejercicio 2: Manipulación de contenido y atributos ===');

// 1. Cambiar texto de elementos
function cambiarTexto() {
  console.log('\n1. Cambiando texto de elementos:');

  const titulo = document.getElementById('titulo');
  if (titulo) {
    const textoOriginal = titulo.textContent;
    titulo.textContent = 'Nuevo Título Dinámico';
    console.log(
      `Texto cambiado de: "${textoOriginal}" a: "${titulo.textContent}"`
    );
  }

  // Cambiar texto de múltiples elementos
  const botones = document.querySelectorAll('.btn');
  botones.forEach((boton, index) => {
    const textoOriginal = boton.textContent;
    boton.textContent = `Botón ${index + 1}`;
    console.log(
      `Botón ${index + 1} cambió de: "${textoOriginal}" a: "${
        boton.textContent
      }"`
    );
  });
}

// 2. Cambiar HTML interno
function cambiarHTML() {
  console.log('\n2. Cambiando HTML interno:');

  const contenedor = document.getElementById('contenido');
  if (contenedor) {
    const htmlOriginal = contenedor.innerHTML;
    contenedor.innerHTML = `
            <h3>Contenido Dinámico</h3>
            <p>Este contenido fue generado con JavaScript.</p>
            <ul>
                <li>Elemento 1</li>
                <li>Elemento 2</li>
                <li>Elemento 3</li>
            </ul>
        `;
    console.log('HTML interno cambiado exitosamente');
  }
}

// 3. Manipular atributos
function manipularAtributos() {
  console.log('\n3. Manipulando atributos:');

  // Cambiar atributos de imágenes
  const imagen = document.querySelector('img');
  if (imagen) {
    imagen.setAttribute('alt', 'Imagen modificada por JavaScript');
    imagen.setAttribute('title', 'Hover sobre mí');
    console.log('Atributos de imagen modificados');
  }

  // Cambiar atributos de enlaces
  const enlaces = document.querySelectorAll('a');
  enlaces.forEach((enlace, index) => {
    enlace.setAttribute('target', '_blank');
    enlace.setAttribute('rel', 'noopener noreferrer');
    console.log(`Enlace ${index + 1} configurado para abrir en nueva ventana`);
  });

  // Trabajar con data attributes
  const elemento = document.querySelector('.data-element');
  if (elemento) {
    elemento.setAttribute('data-id', '123');
    elemento.setAttribute('data-status', 'active');
    elemento.setAttribute('data-timestamp', Date.now());
    console.log('Data attributes añadidos');
  }
}

// 4. Trabajar con clases CSS
function manipularClases() {
  console.log('\n4. Manipulando clases CSS:');

  const tarjeta = document.querySelector('.card');
  if (tarjeta) {
    // Añadir clase
    tarjeta.classList.add('destacada');
    console.log('Clase "destacada" añadida');

    // Verificar si tiene clase
    if (tarjeta.classList.contains('card')) {
      console.log('La tarjeta tiene la clase "card"');
    }

    // Toggle clase
    tarjeta.classList.toggle('activa');
    console.log('Clase "activa" toggleada');

    // Mostrar todas las clases
    console.log('Clases actuales:', Array.from(tarjeta.classList));
  }
}

// ================================
// EJERCICIOS PRÁCTICOS
// ================================

console.log('\n=== EJERCICIOS PRÁCTICOS ===');

// Ejercicio 1: Crear una función para actualizar información de usuario
function actualizarPerfilUsuario(datos) {
  console.log('\n--- Actualizando perfil de usuario ---');

  // TODO: Implementa la actualización del perfil
  const nombreUsuario = document.getElementById('nombre-usuario');
  const emailUsuario = document.getElementById('email-usuario');
  const avatarUsuario = document.getElementById('avatar-usuario');

  if (nombreUsuario) {
    nombreUsuario.textContent = datos.nombre || 'Usuario Anónimo';
  }

  if (emailUsuario) {
    emailUsuario.textContent = datos.email || 'sin-email@ejemplo.com';
  }

  if (avatarUsuario) {
    avatarUsuario.src = datos.avatar || 'https://via.placeholder.com/100';
    avatarUsuario.alt = `Avatar de ${datos.nombre}`;
  }

  console.log('Perfil actualizado:', datos);
}

// Ejercicio 2: Crear una función para cambiar el tema de la página
function cambiarTema(tema) {
  console.log('\n--- Cambiando tema de la página ---');

  // TODO: Implementa el cambio de tema
  const body = document.body;

  // Remover temas anteriores
  body.classList.remove('tema-claro', 'tema-oscuro', 'tema-azul');

  // Añadir nuevo tema
  body.classList.add(`tema-${tema}`);

  // Actualizar atributo data-theme
  body.setAttribute('data-theme', tema);

  console.log(`Tema cambiado a: ${tema}`);
}

// Ejercicio 3: Crear una función para gestionar el estado de elementos
function gestionarEstado(selector, estado) {
  console.log('\n--- Gestionando estado de elementos ---');

  const elementos = document.querySelectorAll(selector);

  elementos.forEach(elemento => {
    // Remover estados anteriores
    elemento.classList.remove('activo', 'inactivo', 'pendiente', 'completado');

    // Añadir nuevo estado
    elemento.classList.add(estado);
    elemento.setAttribute('data-estado', estado);

    // Actualizar atributo aria-label para accesibilidad
    elemento.setAttribute('aria-label', `Estado: ${estado}`);

    console.log(`Estado "${estado}" aplicado a elemento`);
  });
}

// ================================
// FUNCIONES DE UTILIDAD
// ================================

// Función para cambiar múltiples atributos a la vez
function cambiarAtributos(selector, atributos) {
  const elemento = document.querySelector(selector);
  if (!elemento) {
    console.warn(`⚠️ No se encontró el elemento: ${selector}`);
    return;
  }

  Object.keys(atributos).forEach(atributo => {
    elemento.setAttribute(atributo, atributos[atributo]);
  });

  console.log(`Atributos cambiados para ${selector}:`, atributos);
}

// Función para obtener información completa de un elemento
function obtenerInfoElemento(selector) {
  const elemento = document.querySelector(selector);
  if (!elemento) return null;

  return {
    tag: elemento.tagName.toLowerCase(),
    id: elemento.id,
    clases: Array.from(elemento.classList),
    texto: elemento.textContent,
    html: elemento.innerHTML,
    atributos: Array.from(elemento.attributes).reduce((acc, attr) => {
      acc[attr.name] = attr.value;
      return acc;
    }, {}),
  };
}

// Función para validar cambios
function validarCambios(selector, cambiosEsperados) {
  const elemento = document.querySelector(selector);
  if (!elemento) return false;

  return Object.keys(cambiosEsperados).every(propiedad => {
    switch (propiedad) {
      case 'texto':
        return elemento.textContent === cambiosEsperados[propiedad];
      case 'clase':
        return elemento.classList.contains(cambiosEsperados[propiedad]);
      case 'atributo':
        return (
          elemento.getAttribute(cambiosEsperados.atributo) ===
          cambiosEsperados.valor
        );
      default:
        return false;
    }
  });
}

// ================================
// EJECUCIÓN DE EJERCICIOS
// ================================

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function () {
  console.log('\n🚀 DOM listo, ejecutando ejercicios de manipulación...');

  // Ejecutar ejercicios básicos
  setTimeout(() => {
    cambiarTexto();
  }, 1000);

  setTimeout(() => {
    cambiarHTML();
  }, 2000);

  setTimeout(() => {
    manipularAtributos();
  }, 3000);

  setTimeout(() => {
    manipularClases();
  }, 4000);

  // Ejecutar ejercicios prácticos
  setTimeout(() => {
    actualizarPerfilUsuario({
      nombre: 'Juan Pérez',
      email: 'juan.perez@ejemplo.com',
      avatar: 'https://via.placeholder.com/100/0066cc/ffffff?text=JP',
    });
  }, 5000);

  setTimeout(() => {
    cambiarTema('oscuro');
  }, 6000);

  setTimeout(() => {
    gestionarEstado('.btn', 'activo');
  }, 7000);

  console.log('\n✅ Ejercicios de manipulación programados!');
});

// ================================
// RETOS ADICIONALES
// ================================

/**
 * RETO 1: Crear una función que anime el cambio de texto
 */
function cambiarTextoAnimado(selector, nuevoTexto, duracion = 1000) {
  // TODO: Implementa animación de cambio de texto
  const elemento = document.querySelector(selector);
  if (!elemento) return;

  const textoOriginal = elemento.textContent;
  elemento.style.transition = `opacity ${duracion / 2}ms ease-in-out`;

  // Fade out
  elemento.style.opacity = '0';

  setTimeout(() => {
    elemento.textContent = nuevoTexto;
    elemento.style.opacity = '1';
  }, duracion / 2);
}

/**
 * RETO 2: Crear una función que clone y modifique elementos
 */
function clonarYModificar(selectorOriginal, selectorDestino, modificaciones) {
  // TODO: Implementa clonación y modificación
  const original = document.querySelector(selectorOriginal);
  const destino = document.querySelector(selectorDestino);

  if (!original || !destino) return;

  const clon = original.cloneNode(true);

  // Aplicar modificaciones
  Object.keys(modificaciones).forEach(propiedad => {
    switch (propiedad) {
      case 'texto':
        clon.textContent = modificaciones[propiedad];
        break;
      case 'clase':
        clon.className = modificaciones[propiedad];
        break;
      case 'id':
        clon.id = modificaciones[propiedad];
        break;
    }
  });

  destino.appendChild(clon);
}

/**
 * RETO 3: Crear una función para intercambiar contenido entre elementos
 */
function intercambiarContenido(selector1, selector2) {
  // TODO: Implementa intercambio de contenido
  const elemento1 = document.querySelector(selector1);
  const elemento2 = document.querySelector(selector2);

  if (!elemento1 || !elemento2) return;

  const contenido1 = elemento1.innerHTML;
  const contenido2 = elemento2.innerHTML;

  elemento1.innerHTML = contenido2;
  elemento2.innerHTML = contenido1;
}

// Ejemplos de uso de los retos:
// cambiarTextoAnimado('#titulo', 'Nuevo título animado', 2000);
// clonarYModificar('.card', '.container', { texto: 'Tarjeta clonada', clase: 'card clonada' });
// intercambiarContenido('#elemento1', '#elemento2');
