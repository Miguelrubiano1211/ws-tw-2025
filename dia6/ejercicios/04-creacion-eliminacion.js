/**
 * Día 6: DOM y Eventos - Ejercicio 4
 * Tema: Creación y eliminación de elementos DOM
 * Dificultad: Intermedia
 * Tiempo estimado: 30 minutos
 */

// ================================
// CREACIÓN DE ELEMENTOS DOM
// ================================

console.log('=== Ejercicio 4: Creación y eliminación de elementos DOM ===');

// 1. Crear elementos básicos
function crearElementosBasicos() {
  console.log('\n1. Creando elementos básicos:');

  // Crear párrafo
  const parrafo = document.createElement('p');
  parrafo.textContent = 'Este párrafo fue creado con JavaScript';
  parrafo.className = 'parrafo-dinamico';

  // Crear botón
  const boton = document.createElement('button');
  boton.textContent = 'Botón Dinámico';
  boton.className = 'btn btn-primary';
  boton.onclick = () => alert('¡Botón dinámico clickeado!');

  // Crear imagen
  const imagen = document.createElement('img');
  imagen.src =
    'https://via.placeholder.com/200x150/4dabf7/ffffff?text=Imagen+Dinámica';
  imagen.alt = 'Imagen creada dinámicamente';
  imagen.className = 'imagen-dinamica';

  // Añadir elementos al DOM
  const contenedor = document.querySelector('.container') || document.body;
  contenedor.appendChild(parrafo);
  contenedor.appendChild(boton);
  contenedor.appendChild(imagen);

  console.log('Elementos básicos creados y añadidos');
}

// 2. Crear elementos complejos con estructura
function crearElementosComplejos() {
  console.log('\n2. Creando elementos complejos:');

  // Crear tarjeta completa
  const tarjeta = document.createElement('div');
  tarjeta.className = 'card mb-3';
  tarjeta.style.maxWidth = '400px';

  // Header de la tarjeta
  const header = document.createElement('div');
  header.className = 'card-header';
  header.innerHTML = '<h5>Tarjeta Dinámica</h5>';

  // Cuerpo de la tarjeta
  const cuerpo = document.createElement('div');
  cuerpo.className = 'card-body';

  const titulo = document.createElement('h6');
  titulo.className = 'card-title';
  titulo.textContent = 'Título de la Tarjeta';

  const texto = document.createElement('p');
  texto.className = 'card-text';
  texto.textContent =
    'Este es el contenido de la tarjeta creada dinámicamente.';

  const botonAccion = document.createElement('button');
  botonAccion.className = 'btn btn-success';
  botonAccion.textContent = 'Acción';

  // Ensamblar tarjeta
  cuerpo.appendChild(titulo);
  cuerpo.appendChild(texto);
  cuerpo.appendChild(botonAccion);

  tarjeta.appendChild(header);
  tarjeta.appendChild(cuerpo);

  // Añadir al DOM
  const contenedor = document.querySelector('.container') || document.body;
  contenedor.appendChild(tarjeta);

  console.log('Tarjeta compleja creada');
}

// 3. Crear formulario dinámico
function crearFormulario() {
  console.log('\n3. Creando formulario dinámico:');

  const formulario = document.createElement('form');
  formulario.className = 'needs-validation';
  formulario.noValidate = true;

  // Campos del formulario
  const campos = [
    {
      tipo: 'text',
      nombre: 'nombre',
      placeholder: 'Nombre completo',
      requerido: true,
    },
    {
      tipo: 'email',
      nombre: 'email',
      placeholder: 'Correo electrónico',
      requerido: true,
    },
    {
      tipo: 'tel',
      nombre: 'telefono',
      placeholder: 'Teléfono',
      requerido: false,
    },
    {
      tipo: 'textarea',
      nombre: 'mensaje',
      placeholder: 'Mensaje',
      requerido: true,
    },
  ];

  campos.forEach(campo => {
    // Crear grupo de campo
    const grupo = document.createElement('div');
    grupo.className = 'mb-3';

    // Crear etiqueta
    const etiqueta = document.createElement('label');
    etiqueta.className = 'form-label';
    etiqueta.textContent = campo.placeholder;
    etiqueta.setAttribute('for', campo.nombre);

    // Crear input o textarea
    let input;
    if (campo.tipo === 'textarea') {
      input = document.createElement('textarea');
      input.rows = 3;
    } else {
      input = document.createElement('input');
      input.type = campo.tipo;
    }

    input.className = 'form-control';
    input.name = campo.nombre;
    input.id = campo.nombre;
    input.placeholder = campo.placeholder;
    input.required = campo.requerido;

    // Crear mensaje de validación
    const mensajeValidacion = document.createElement('div');
    mensajeValidacion.className = 'invalid-feedback';
    mensajeValidacion.textContent = `Por favor ingresa un ${campo.placeholder.toLowerCase()} válido.`;

    // Ensamblar grupo
    grupo.appendChild(etiqueta);
    grupo.appendChild(input);
    grupo.appendChild(mensajeValidacion);

    formulario.appendChild(grupo);
  });

  // Botón de envío
  const botonEnvio = document.createElement('button');
  botonEnvio.type = 'submit';
  botonEnvio.className = 'btn btn-primary';
  botonEnvio.textContent = 'Enviar';

  formulario.appendChild(botonEnvio);

  // Event listener para validación
  formulario.addEventListener('submit', function (e) {
    e.preventDefault();

    if (this.checkValidity()) {
      alert('¡Formulario válido!');
    } else {
      this.classList.add('was-validated');
    }
  });

  // Añadir al DOM
  const contenedor = document.querySelector('.container') || document.body;
  contenedor.appendChild(formulario);

  console.log('Formulario dinámico creado');
}

// ================================
// ELIMINACIÓN DE ELEMENTOS DOM
// ================================

// 4. Eliminar elementos de diferentes maneras
function eliminarElementos() {
  console.log('\n4. Eliminando elementos:');

  // Eliminar por selector
  const elementoParaEliminar = document.querySelector('.elemento-temporal');
  if (elementoParaEliminar) {
    elementoParaEliminar.remove();
    console.log('Elemento temporal eliminado');
  }

  // Eliminar todos los elementos con una clase
  const elementosTemporales = document.querySelectorAll('.temporal');
  elementosTemporales.forEach(elemento => {
    elemento.remove();
  });
  console.log(`${elementosTemporales.length} elementos temporales eliminados`);

  // Eliminar hijo específico
  const contenedor = document.querySelector('.container');
  if (contenedor && contenedor.lastElementChild) {
    contenedor.removeChild(contenedor.lastElementChild);
    console.log('Último hijo eliminado del contenedor');
  }

  // Limpiar contenido completo
  const contenedorLimpiar = document.querySelector('.contenido-temporal');
  if (contenedorLimpiar) {
    contenedorLimpiar.innerHTML = '';
    console.log('Contenido temporal limpiado');
  }
}

// ================================
// EJERCICIOS PRÁCTICOS
// ================================

console.log('\n=== EJERCICIOS PRÁCTICOS ===');

// Ejercicio 1: Crear lista dinámica
function crearListaDinamica(items, contenedor) {
  console.log('\n--- Creando lista dinámica ---');

  // Crear elemento ul
  const lista = document.createElement('ul');
  lista.className = 'list-group';

  items.forEach((item, index) => {
    const li = document.createElement('li');
    li.className =
      'list-group-item d-flex justify-content-between align-items-center';

    // Contenido del item
    const contenido = document.createElement('span');
    contenido.textContent = item;

    // Botón eliminar
    const botonEliminar = document.createElement('button');
    botonEliminar.className = 'btn btn-sm btn-danger';
    botonEliminar.textContent = '×';
    botonEliminar.onclick = () => {
      li.remove();
      console.log(`Item "${item}" eliminado`);
    };

    li.appendChild(contenido);
    li.appendChild(botonEliminar);
    lista.appendChild(li);
  });

  // Añadir al contenedor
  const contenedorDestino = document.querySelector(contenedor);
  if (contenedorDestino) {
    contenedorDestino.appendChild(lista);
    console.log(`Lista con ${items.length} items creada`);
  }
}

// Ejercicio 2: Crear tabla dinámica
function crearTablaDinamica(datos, contenedor) {
  console.log('\n--- Creando tabla dinámica ---');

  if (!datos || datos.length === 0) {
    console.warn('No hay datos para mostrar');
    return;
  }

  // Crear tabla
  const tabla = document.createElement('table');
  tabla.className = 'table table-striped table-hover';

  // Crear encabezado
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');

  const columnas = Object.keys(datos[0]);
  columnas.forEach(columna => {
    const th = document.createElement('th');
    th.textContent = columna.charAt(0).toUpperCase() + columna.slice(1);
    headerRow.appendChild(th);
  });

  // Añadir columna de acciones
  const thAcciones = document.createElement('th');
  thAcciones.textContent = 'Acciones';
  headerRow.appendChild(thAcciones);

  thead.appendChild(headerRow);
  tabla.appendChild(thead);

  // Crear cuerpo
  const tbody = document.createElement('tbody');

  datos.forEach((fila, index) => {
    const tr = document.createElement('tr');

    columnas.forEach(columna => {
      const td = document.createElement('td');
      td.textContent = fila[columna];
      tr.appendChild(td);
    });

    // Celda de acciones
    const tdAcciones = document.createElement('td');

    const botonEditar = document.createElement('button');
    botonEditar.className = 'btn btn-sm btn-warning me-2';
    botonEditar.textContent = 'Editar';
    botonEditar.onclick = () => {
      alert(`Editar fila ${index + 1}`);
    };

    const botonEliminar = document.createElement('button');
    botonEliminar.className = 'btn btn-sm btn-danger';
    botonEliminar.textContent = 'Eliminar';
    botonEliminar.onclick = () => {
      if (confirm('¿Confirmar eliminación?')) {
        tr.remove();
        console.log(`Fila ${index + 1} eliminada`);
      }
    };

    tdAcciones.appendChild(botonEditar);
    tdAcciones.appendChild(botonEliminar);
    tr.appendChild(tdAcciones);

    tbody.appendChild(tr);
  });

  tabla.appendChild(tbody);

  // Añadir al contenedor
  const contenedorDestino = document.querySelector(contenedor);
  if (contenedorDestino) {
    contenedorDestino.appendChild(tabla);
    console.log(`Tabla con ${datos.length} filas creada`);
  }
}

// Ejercicio 3: Crear sistema de pestañas
function crearSistemaPestañas(pestañas, contenedor) {
  console.log('\n--- Creando sistema de pestañas ---');

  // Crear contenedor principal
  const contenedorPestañas = document.createElement('div');
  contenedorPestañas.className = 'tabs-container';

  // Crear navegación de pestañas
  const nav = document.createElement('nav');
  nav.className = 'nav nav-tabs';

  // Crear contenedor de contenido
  const contenidoContainer = document.createElement('div');
  contenidoContainer.className = 'tab-content';

  pestañas.forEach((pestaña, index) => {
    // Crear botón de pestaña
    const botonPestaña = document.createElement('button');
    botonPestaña.className = `nav-link ${index === 0 ? 'active' : ''}`;
    botonPestaña.textContent = pestaña.titulo;
    botonPestaña.onclick = () => {
      // Desactivar todas las pestañas
      document.querySelectorAll('.nav-link').forEach(btn => {
        btn.classList.remove('active');
      });
      document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
      });

      // Activar pestaña actual
      botonPestaña.classList.add('active');
      document.getElementById(`tab-${index}`).classList.add('active');
    };

    nav.appendChild(botonPestaña);

    // Crear contenido de pestaña
    const contenidoPestaña = document.createElement('div');
    contenidoPestaña.className = `tab-pane ${index === 0 ? 'active' : ''}`;
    contenidoPestaña.id = `tab-${index}`;
    contenidoPestaña.innerHTML = pestaña.contenido;

    contenidoContainer.appendChild(contenidoPestaña);
  });

  // Ensamblar sistema
  contenedorPestañas.appendChild(nav);
  contenedorPestañas.appendChild(contenidoContainer);

  // Añadir al DOM
  const contenedorDestino = document.querySelector(contenedor);
  if (contenedorDestino) {
    contenedorDestino.appendChild(contenedorPestañas);
    console.log(`Sistema de pestañas con ${pestañas.length} pestañas creado`);
  }
}

// ================================
// FUNCIONES DE UTILIDAD
// ================================

// Función para crear elemento con atributos
function crearElemento(tag, atributos = {}, contenido = '') {
  const elemento = document.createElement(tag);

  Object.keys(atributos).forEach(attr => {
    if (attr === 'className') {
      elemento.className = atributos[attr];
    } else if (attr === 'innerHTML') {
      elemento.innerHTML = atributos[attr];
    } else if (attr === 'textContent') {
      elemento.textContent = atributos[attr];
    } else {
      elemento.setAttribute(attr, atributos[attr]);
    }
  });

  if (contenido) {
    elemento.textContent = contenido;
  }

  return elemento;
}

// Función para clonar elemento
function clonarElemento(selector, modificaciones = {}) {
  const original = document.querySelector(selector);
  if (!original) return null;

  const clon = original.cloneNode(true);

  // Aplicar modificaciones
  Object.keys(modificaciones).forEach(prop => {
    if (prop === 'id') {
      clon.id = modificaciones[prop];
    } else if (prop === 'className') {
      clon.className = modificaciones[prop];
    } else if (prop === 'textContent') {
      clon.textContent = modificaciones[prop];
    }
  });

  return clon;
}

// Función para limpiar contenedor
function limpiarContenedor(selector) {
  const contenedor = document.querySelector(selector);
  if (contenedor) {
    contenedor.innerHTML = '';
    console.log(`Contenedor "${selector}" limpiado`);
  }
}

// ================================
// EJECUCIÓN DE EJERCICIOS
// ================================

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function () {
  console.log(
    '\n🚀 DOM listo, ejecutando ejercicios de creación/eliminación...'
  );

  // Ejecutar ejercicios básicos
  setTimeout(() => {
    crearElementosBasicos();
  }, 1000);

  setTimeout(() => {
    crearElementosComplejos();
  }, 2000);

  setTimeout(() => {
    crearFormulario();
  }, 3000);

  // Ejercicios prácticos
  setTimeout(() => {
    const items = ['Elemento 1', 'Elemento 2', 'Elemento 3', 'Elemento 4'];
    crearListaDinamica(items, '.container');
  }, 4000);

  setTimeout(() => {
    const datos = [
      { nombre: 'Juan', edad: 25, ciudad: 'Madrid' },
      { nombre: 'Ana', edad: 30, ciudad: 'Barcelona' },
      { nombre: 'Carlos', edad: 28, ciudad: 'Valencia' },
    ];
    crearTablaDinamica(datos, '.container');
  }, 5000);

  setTimeout(() => {
    const pestañas = [
      {
        titulo: 'Inicio',
        contenido:
          '<h3>Página de Inicio</h3><p>Contenido de la pestaña inicio.</p>',
      },
      {
        titulo: 'Servicios',
        contenido: '<h3>Nuestros Servicios</h3><p>Contenido de servicios.</p>',
      },
      {
        titulo: 'Contacto',
        contenido: '<h3>Contacto</h3><p>Información de contacto.</p>',
      },
    ];
    crearSistemaPestañas(pestañas, '.container');
  }, 6000);

  console.log('\n✅ Ejercicios de creación/eliminación programados!');
});

// ================================
// RETOS ADICIONALES
// ================================

/**
 * RETO 1: Crear un constructor de elementos flexible
 */
function ElementBuilder(tag) {
  this.element = document.createElement(tag);

  this.addClass = function (className) {
    this.element.classList.add(className);
    return this;
  };

  this.setAttr = function (attr, value) {
    this.element.setAttribute(attr, value);
    return this;
  };

  this.setText = function (text) {
    this.element.textContent = text;
    return this;
  };

  this.setHTML = function (html) {
    this.element.innerHTML = html;
    return this;
  };

  this.appendTo = function (parent) {
    const parentElement =
      typeof parent === 'string' ? document.querySelector(parent) : parent;
    if (parentElement) {
      parentElement.appendChild(this.element);
    }
    return this;
  };

  this.build = function () {
    return this.element;
  };
}

/**
 * RETO 2: Crear un sistema de drag and drop para elementos
 */
function hacerArrastrable(selector) {
  const elementos = document.querySelectorAll(selector);

  elementos.forEach(elemento => {
    elemento.draggable = true;
    elemento.style.cursor = 'move';

    elemento.addEventListener('dragstart', function (e) {
      e.dataTransfer.setData('text/plain', this.outerHTML);
      e.dataTransfer.effectAllowed = 'move';
      this.style.opacity = '0.5';
    });

    elemento.addEventListener('dragend', function () {
      this.style.opacity = '1';
    });
  });
}

/**
 * RETO 3: Crear un sistema de templates
 */
function crearDesdeTemplate(templateId, datos) {
  const template = document.getElementById(templateId);
  if (!template) return null;

  const clon = template.content.cloneNode(true);

  // Reemplazar placeholders
  Object.keys(datos).forEach(clave => {
    const placeholder = `{{${clave}}}`;
    clon.querySelectorAll('*').forEach(elemento => {
      if (elemento.textContent.includes(placeholder)) {
        elemento.textContent = elemento.textContent.replace(
          placeholder,
          datos[clave]
        );
      }
    });
  });

  return clon;
}

// Ejemplos de uso de los retos:
// const boton = new ElementBuilder('button')
//     .addClass('btn btn-primary')
//     .setText('Botón Construido')
//     .setAttr('onclick', 'alert("¡Funciona!")')
//     .appendTo('.container')
//     .build();

// hacerArrastrable('.card');

// const elemento = crearDesdeTemplate('mi-template', { nombre: 'Juan', edad: 25 });
