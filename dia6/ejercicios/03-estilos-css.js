/**
 * Día 6: DOM y Eventos - Ejercicio 3
 * Tema: Manipulación de estilos CSS
 * Dificultad: Intermedia
 * Tiempo estimado: 25 minutos
 */

// ================================
// MANIPULACIÓN DE ESTILOS CSS
// ================================

console.log('=== Ejercicio 3: Manipulación de estilos CSS ===');

// 1. Cambiar estilos directamente
function cambiarEstilosDirectos() {
  console.log('\n1. Cambiando estilos directamente:');

  const titulo = document.getElementById('titulo');
  if (titulo) {
    titulo.style.color = '#ff6b6b';
    titulo.style.fontSize = '2.5rem';
    titulo.style.textAlign = 'center';
    titulo.style.textShadow = '2px 2px 4px rgba(0,0,0,0.3)';
    titulo.style.transition = 'all 0.3s ease';

    console.log('Estilos aplicados al título');
  }

  // Cambiar estilos de múltiples elementos
  const tarjetas = document.querySelectorAll('.card');
  tarjetas.forEach((tarjeta, index) => {
    tarjeta.style.backgroundColor = index % 2 === 0 ? '#f8f9fa' : '#e9ecef';
    tarjeta.style.border = '2px solid #dee2e6';
    tarjeta.style.borderRadius = '10px';
    tarjeta.style.padding = '20px';
    tarjeta.style.margin = '10px';
    tarjeta.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';

    console.log(`Estilos aplicados a tarjeta ${index + 1}`);
  });
}

// 2. Trabajar con CSS Custom Properties (variables)
function trabajarConVariablesCSS() {
  console.log('\n2. Trabajando con variables CSS:');

  const root = document.documentElement;

  // Definir variables CSS
  root.style.setProperty('--color-primario', '#007bff');
  root.style.setProperty('--color-secundario', '#6c757d');
  root.style.setProperty('--espaciado', '1rem');
  root.style.setProperty('--radio-borde', '8px');

  console.log('Variables CSS definidas');

  // Usar variables en elementos
  const botones = document.querySelectorAll('.btn');
  botones.forEach(boton => {
    boton.style.backgroundColor = 'var(--color-primario)';
    boton.style.padding = 'var(--espaciado)';
    boton.style.borderRadius = 'var(--radio-borde)';
    boton.style.border = 'none';
    boton.style.color = 'white';
    boton.style.cursor = 'pointer';
  });

  console.log('Variables CSS aplicadas a botones');
}

// 3. Obtener estilos computados
function obtenerEstilosComputados() {
  console.log('\n3. Obteniendo estilos computados:');

  const titulo = document.getElementById('titulo');
  if (titulo) {
    const estilos = window.getComputedStyle(titulo);

    console.log('Estilos computados del título:');
    console.log(`- Color: ${estilos.color}`);
    console.log(`- Font Size: ${estilos.fontSize}`);
    console.log(`- Font Weight: ${estilos.fontWeight}`);
    console.log(`- Margin: ${estilos.margin}`);
    console.log(`- Padding: ${estilos.padding}`);
  }

  // Obtener estilos de múltiples elementos
  const botones = document.querySelectorAll('.btn');
  botones.forEach((boton, index) => {
    const estilos = window.getComputedStyle(boton);
    console.log(`\nBotón ${index + 1}:`);
    console.log(`- Background: ${estilos.backgroundColor}`);
    console.log(`- Width: ${estilos.width}`);
    console.log(`- Height: ${estilos.height}`);
  });
}

// 4. Animaciones CSS con JavaScript
function crearAnimacionesCSS() {
  console.log('\n4. Creando animaciones CSS:');

  // Crear keyframes dinámicamente
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
        @keyframes pulso {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        
        @keyframes deslizar {
            0% { transform: translateX(-100%); opacity: 0; }
            100% { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes rotar {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .animacion-pulso {
            animation: pulso 2s infinite;
        }
        
        .animacion-deslizar {
            animation: deslizar 1s ease-out;
        }
        
        .animacion-rotar {
            animation: rotar 3s linear infinite;
        }
    `;

  document.head.appendChild(styleSheet);
  console.log('Animaciones CSS creadas');
}

// ================================
// EJERCICIOS PRÁCTICOS
// ================================

console.log('\n=== EJERCICIOS PRÁCTICOS ===');

// Ejercicio 1: Crear un sistema de temas dinámicos
function aplicarTema(nombreTema) {
  console.log('\n--- Aplicando tema dinámico ---');

  const temas = {
    claro: {
      '--bg-principal': '#ffffff',
      '--color-texto': '#333333',
      '--bg-secundario': '#f8f9fa',
      '--color-acento': '#007bff',
      '--sombra': '0 2px 4px rgba(0,0,0,0.1)',
    },
    oscuro: {
      '--bg-principal': '#1a1a1a',
      '--color-texto': '#e0e0e0',
      '--bg-secundario': '#2d2d2d',
      '--color-acento': '#4dabf7',
      '--sombra': '0 2px 4px rgba(255,255,255,0.1)',
    },
    azul: {
      '--bg-principal': '#e3f2fd',
      '--color-texto': '#1565c0',
      '--bg-secundario': '#bbdefb',
      '--color-acento': '#0d47a1',
      '--sombra': '0 2px 4px rgba(13,71,161,0.2)',
    },
  };

  const tema = temas[nombreTema];
  if (!tema) {
    console.warn(`⚠️ Tema "${nombreTema}" no encontrado`);
    return;
  }

  const root = document.documentElement;
  Object.keys(tema).forEach(variable => {
    root.style.setProperty(variable, tema[variable]);
  });

  // Guardar tema en localStorage
  localStorage.setItem('tema-preferido', nombreTema);

  console.log(`Tema "${nombreTema}" aplicado exitosamente`);
}

// Ejercicio 2: Crear efectos hover dinámicos
function crearEfectosHover() {
  console.log('\n--- Creando efectos hover dinámicos ---');

  const tarjetas = document.querySelectorAll('.card');

  tarjetas.forEach(tarjeta => {
    // Estilos base
    tarjeta.style.transition = 'all 0.3s ease';
    tarjeta.style.cursor = 'pointer';

    // Evento mouseenter
    tarjeta.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-5px) scale(1.02)';
      this.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
      this.style.borderColor = '#007bff';
    });

    // Evento mouseleave
    tarjeta.addEventListener('mouseleave', function () {
      this.style.transform = 'translateY(0) scale(1)';
      this.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
      this.style.borderColor = '#dee2e6';
    });
  });

  console.log('Efectos hover aplicados a las tarjetas');
}

// Ejercicio 3: Crear un sistema de progreso visual
function crearBarraProgreso(selector, progreso, duracion = 2000) {
  console.log('\n--- Creando barra de progreso ---');

  const contenedor = document.querySelector(selector);
  if (!contenedor) {
    console.warn(`⚠️ Contenedor "${selector}" no encontrado`);
    return;
  }

  // Crear elementos de la barra
  const barraFondo = document.createElement('div');
  const barraProgreso = document.createElement('div');
  const textoProgreso = document.createElement('span');

  // Estilos del contenedor
  barraFondo.style.cssText = `
        width: 100%;
        height: 30px;
        background-color: #e9ecef;
        border-radius: 15px;
        overflow: hidden;
        position: relative;
        margin: 10px 0;
    `;

  // Estilos de la barra de progreso
  barraProgreso.style.cssText = `
        width: 0%;
        height: 100%;
        background: linear-gradient(90deg, #007bff, #0056b3);
        transition: width ${duracion}ms ease-in-out;
        position: relative;
    `;

  // Estilos del texto
  textoProgreso.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-weight: bold;
        font-size: 14px;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        z-index: 1;
    `;

  // Ensamblar elementos
  barraFondo.appendChild(barraProgreso);
  barraFondo.appendChild(textoProgreso);
  contenedor.appendChild(barraFondo);

  // Animar progreso
  setTimeout(() => {
    barraProgreso.style.width = `${progreso}%`;
    textoProgreso.textContent = `${progreso}%`;
  }, 100);

  console.log(`Barra de progreso creada: ${progreso}%`);
}

// ================================
// FUNCIONES DE UTILIDAD
// ================================

// Función para aplicar estilos múltiples
function aplicarEstilos(selector, estilos) {
  const elemento = document.querySelector(selector);
  if (!elemento) {
    console.warn(`⚠️ Elemento "${selector}" no encontrado`);
    return;
  }

  Object.keys(estilos).forEach(propiedad => {
    elemento.style[propiedad] = estilos[propiedad];
  });

  console.log(`Estilos aplicados a "${selector}"`);
}

// Función para obtener valor de variable CSS
function obtenerVariableCSS(nombreVariable) {
  const root = document.documentElement;
  return getComputedStyle(root).getPropertyValue(nombreVariable).trim();
}

// Función para crear gradiente dinámico
function crearGradiente(elemento, colores, direccion = 'to right') {
  const gradiente = `linear-gradient(${direccion}, ${colores.join(', ')})`;
  elemento.style.background = gradiente;
  return gradiente;
}

// Función para animar elemento
function animarElemento(selector, animacion, duracion = '1s') {
  const elemento = document.querySelector(selector);
  if (!elemento) return;

  elemento.style.animation = `${animacion} ${duracion}`;

  // Remover animación al finalizar
  elemento.addEventListener(
    'animationend',
    function () {
      this.style.animation = '';
    },
    { once: true }
  );
}

// ================================
// EJECUCIÓN DE EJERCICIOS
// ================================

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function () {
  console.log('\n🚀 DOM listo, ejecutando ejercicios de estilos...');

  // Crear animaciones CSS
  crearAnimacionesCSS();

  // Ejecutar ejercicios con delay
  setTimeout(() => {
    cambiarEstilosDirectos();
  }, 1000);

  setTimeout(() => {
    trabajarConVariablesCSS();
  }, 2000);

  setTimeout(() => {
    obtenerEstilosComputados();
  }, 3000);

  // Ejercicios prácticos
  setTimeout(() => {
    aplicarTema('claro');
  }, 4000);

  setTimeout(() => {
    crearEfectosHover();
  }, 5000);

  setTimeout(() => {
    crearBarraProgreso('.container', 75, 3000);
  }, 6000);

  console.log('\n✅ Ejercicios de estilos programados!');
});

// ================================
// RETOS ADICIONALES
// ================================

/**
 * RETO 1: Crear un sistema de notificaciones con estilos dinámicos
 */
function crearNotificacion(mensaje, tipo = 'info', duracion = 3000) {
  // TODO: Implementa sistema de notificaciones
  const notificacion = document.createElement('div');

  const estilos = {
    info: { bg: '#d1ecf1', color: '#0c5460', border: '#bee5eb' },
    success: { bg: '#d4edda', color: '#155724', border: '#c3e6cb' },
    warning: { bg: '#fff3cd', color: '#856404', border: '#ffeaa7' },
    error: { bg: '#f8d7da', color: '#721c24', border: '#f5c6cb' },
  };

  const estilo = estilos[tipo];

  notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background-color: ${estilo.bg};
        color: ${estilo.color};
        border: 1px solid ${estilo.border};
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 1000;
        animation: deslizar 0.5s ease-out;
    `;

  notificacion.textContent = mensaje;
  document.body.appendChild(notificacion);

  setTimeout(() => {
    notificacion.remove();
  }, duracion);
}

/**
 * RETO 2: Crear un efecto de partículas
 */
function crearEfectoParticulas(contenedor, cantidad = 50) {
  // TODO: Implementa efecto de partículas
  const container = document.querySelector(contenedor);
  if (!container) return;

  for (let i = 0; i < cantidad; i++) {
    const particula = document.createElement('div');

    particula.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background-color: #007bff;
            border-radius: 50%;
            pointer-events: none;
            animation: float ${2 + Math.random() * 3}s linear infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            opacity: ${0.3 + Math.random() * 0.7};
        `;

    container.appendChild(particula);
  }
}

/**
 * RETO 3: Crear un modo de contraste alto
 */
function toggleContrasteAlto() {
  // TODO: Implementa modo de contraste alto
  const body = document.body;

  if (body.classList.contains('alto-contraste')) {
    body.classList.remove('alto-contraste');
    body.style.filter = '';
  } else {
    body.classList.add('alto-contraste');
    body.style.filter = 'contrast(150%) brightness(110%)';
  }
}

// Ejemplos de uso de los retos:
// crearNotificacion('¡Operación exitosa!', 'success');
// crearEfectoParticulas('.container', 30);
// toggleContrasteAlto();
