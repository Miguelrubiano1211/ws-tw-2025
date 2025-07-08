// 📝 Ejercicio 6: DOM Manipulation Moderna
// Día 3 - JavaScript ES6+ Fundamentals

console.log('🚀 Ejercicio 6: DOM Manipulation Moderna');

// ============================================
// Ejercicio 6.1: Selectors Modernos
// ============================================
console.log('\n--- Ejercicio 6.1: Selectors Modernos ---');

// Crear elementos HTML para las pruebas
const crearElementosPrueba = () => {
  const contenedor = document.createElement('div');
  contenedor.id = 'contenedor-pruebas';
  contenedor.innerHTML = `
        <h2>Pruebas de DOM</h2>
        <div class="productos">
            <div class="producto activo" data-id="1">
                <h3>Producto 1</h3>
                <p class="precio">$100</p>
                <button class="btn-comprar">Comprar</button>
            </div>
            <div class="producto" data-id="2">
                <h3>Producto 2</h3>
                <p class="precio">$200</p>
                <button class="btn-comprar">Comprar</button>
            </div>
            <div class="producto" data-id="3">
                <h3>Producto 3</h3>
                <p class="precio">$300</p>
                <button class="btn-comprar">Comprar</button>
            </div>
        </div>
        <form id="form-producto">
            <input type="text" id="nombre" placeholder="Nombre del producto">
            <input type="number" id="precio" placeholder="Precio">
            <button type="submit">Agregar Producto</button>
        </form>
        <div id="resultado"></div>
    `;

  // Solo agregar si no existe
  if (!document.getElementById('contenedor-pruebas')) {
    document.body.appendChild(contenedor);
  }

  return contenedor;
};

// Crear elementos para pruebas
const contenedor = crearElementosPrueba();

// Selectores modernos
const selectores = {
  // querySelector vs getElementById
  porId: document.querySelector('#contenedor-pruebas'),
  porIdOriginal: document.getElementById('contenedor-pruebas'),

  // Selectores de clase
  productos: document.querySelectorAll('.producto'),
  productoActivo: document.querySelector('.producto.activo'),

  // Selectores de atributo
  productoPorId: document.querySelector('[data-id="2"]'),
  botonesComprar: document.querySelectorAll('button[class*="btn"]'),

  // Selectores avanzados
  preciosPares: document.querySelectorAll('.producto:nth-child(even) .precio'),
  ultimoProducto: document.querySelector('.producto:last-child'),

  // Selectores de formulario
  camposFormulario: document.querySelectorAll('#form-producto input'),
  botonSubmit: document.querySelector('#form-producto button[type="submit"]'),
};

console.log('Selectores encontrados:', {
  totalProductos: selectores.productos.length,
  productoActivo: selectores.productoActivo?.dataset.id,
  productoPorId: selectores.productoPorId?.dataset.id,
  botonesComprar: selectores.botonesComprar.length,
});

// ============================================
// Ejercicio 6.2: Manipulación de Elementos
// ============================================
console.log('\n--- Ejercicio 6.2: Manipulación de Elementos ---');

// Función para crear nuevos productos
const crearProducto = (nombre, precio, id = Date.now()) => {
  const producto = document.createElement('div');
  producto.className = 'producto';
  producto.dataset.id = id;

  producto.innerHTML = `
        <h3>${nombre}</h3>
        <p class="precio">$${precio}</p>
        <button class="btn-comprar">Comprar</button>
        <button class="btn-eliminar">Eliminar</button>
    `;

  return producto;
};

// Agregar producto dinámicamente
const agregarProducto = (nombre, precio) => {
  const contenedorProductos = document.querySelector('.productos');
  const nuevoProducto = crearProducto(nombre, precio);

  contenedorProductos.appendChild(nuevoProducto);

  // Agregar animación
  nuevoProducto.style.opacity = '0';
  nuevoProducto.style.transform = 'translateY(20px)';

  setTimeout(() => {
    nuevoProducto.style.transition = 'all 0.3s ease';
    nuevoProducto.style.opacity = '1';
    nuevoProducto.style.transform = 'translateY(0)';
  }, 10);

  return nuevoProducto;
};

// TODO: Implementa una función para eliminar productos
const eliminarProducto = elemento => {
  elemento.style.transition = 'all 0.3s ease';
  elemento.style.opacity = '0';
  elemento.style.transform = 'translateX(-100%)';

  setTimeout(() => {
    elemento.remove();
  }, 300);
};

// Función para toggle de clase activa
const toggleProductoActivo = producto => {
  // Remover activo de todos
  document.querySelectorAll('.producto.activo').forEach(p => {
    p.classList.remove('activo');
  });

  // Agregar activo al seleccionado
  producto.classList.add('activo');
};

// ============================================
// Ejercicio 6.3: Event Delegation
// ============================================
console.log('\n--- Ejercicio 6.3: Event Delegation ---');

// Event delegation para manejar todos los clicks
document.addEventListener('click', event => {
  const { target } = event;

  // Manejar clicks en productos
  if (target.closest('.producto')) {
    const producto = target.closest('.producto');

    if (target.classList.contains('btn-comprar')) {
      const nombre = producto.querySelector('h3').textContent;
      const precio = producto.querySelector('.precio').textContent;
      mostrarResultado(`Comprando: ${nombre} - ${precio}`);
    }

    if (target.classList.contains('btn-eliminar')) {
      eliminarProducto(producto);
    }

    // Toggle activo al hacer click en el producto
    if (
      !target.classList.contains('btn-comprar') &&
      !target.classList.contains('btn-eliminar')
    ) {
      toggleProductoActivo(producto);
    }
  }
});

// ============================================
// Ejercicio 6.4: Formularios Modernos
// ============================================
console.log('\n--- Ejercicio 6.4: Formularios Modernos ---');

// Manejo de formulario con event delegation
document.addEventListener('submit', event => {
  if (event.target.id === 'form-producto') {
    event.preventDefault();

    const formData = new FormData(event.target);
    const nombre = document.getElementById('nombre').value;
    const precio = document.getElementById('precio').value;

    if (nombre && precio) {
      agregarProducto(nombre, precio);
      event.target.reset();
      mostrarResultado(`Producto "${nombre}" agregado exitosamente`);
    } else {
      mostrarResultado('Por favor completa todos los campos', 'error');
    }
  }
});

// Validación en tiempo real
document.addEventListener('input', event => {
  const { target } = event;

  if (target.id === 'precio') {
    const precio = parseFloat(target.value);
    const mensaje =
      document.querySelector('#mensaje-precio') ||
      document.createElement('div');
    mensaje.id = 'mensaje-precio';

    if (precio < 0) {
      mensaje.textContent = 'El precio no puede ser negativo';
      mensaje.style.color = 'red';
    } else if (precio > 10000) {
      mensaje.textContent = 'Precio muy alto';
      mensaje.style.color = 'orange';
    } else {
      mensaje.textContent = precio ? `Precio: $${precio.toFixed(2)}` : '';
      mensaje.style.color = 'green';
    }

    if (!target.nextSibling || target.nextSibling.id !== 'mensaje-precio') {
      target.insertAdjacentElement('afterend', mensaje);
    }
  }
});

// ============================================
// Ejercicio 6.5: Intersection Observer
// ============================================
console.log('\n--- Ejercicio 6.5: Intersection Observer ---');

// Observador para animaciones al hacer scroll
const observarElementos = () => {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        } else {
          entry.target.style.opacity = '0.3';
          entry.target.style.transform = 'translateY(20px)';
        }
      });
    },
    {
      threshold: 0.1,
    }
  );

  // Observar todos los productos
  document.querySelectorAll('.producto').forEach(producto => {
    producto.style.transition = 'all 0.3s ease';
    observer.observe(producto);
  });
};

// Inicializar observador
setTimeout(observarElementos, 100);

// ============================================
// Ejercicio 6.6: Local Storage
// ============================================
console.log('\n--- Ejercicio 6.6: Local Storage ---');

// Guardar estado de productos
const guardarEstado = () => {
  const productos = Array.from(document.querySelectorAll('.producto')).map(
    producto => ({
      id: producto.dataset.id,
      nombre: producto.querySelector('h3').textContent,
      precio: producto.querySelector('.precio').textContent,
      activo: producto.classList.contains('activo'),
    })
  );

  localStorage.setItem('productos', JSON.stringify(productos));
  console.log('Estado guardado:', productos);
};

// Cargar estado de productos
const cargarEstado = () => {
  const productosGuardados = localStorage.getItem('productos');
  if (productosGuardados) {
    const productos = JSON.parse(productosGuardados);
    console.log('Estado cargado:', productos);
    return productos;
  }
  return [];
};

// Función utilitaria para mostrar resultados
const mostrarResultado = (mensaje, tipo = 'success') => {
  const contenedorResultado = document.getElementById('resultado');
  contenedorResultado.innerHTML = `
        <div class="mensaje ${tipo}" style="
            padding: 10px;
            margin: 10px 0;
            border-radius: 5px;
            background: ${tipo === 'error' ? '#ffebee' : '#e8f5e8'};
            color: ${tipo === 'error' ? '#c62828' : '#2e7d32'};
            border: 1px solid ${tipo === 'error' ? '#ef5350' : '#4caf50'};
        ">
            ${mensaje}
        </div>
    `;

  setTimeout(() => {
    contenedorResultado.innerHTML = '';
  }, 3000);
};

// ============================================
// Desafío: Lista de Tareas Interactiva
// ============================================
console.log('\n--- 🎯 Desafío: Lista de Tareas Interactiva ---');

// Crear interfaz de tareas
const crearInterfazTareas = () => {
  const interfazTareas = document.createElement('div');
  interfazTareas.id = 'gestor-tareas';
  interfazTareas.innerHTML = `
        <h2>Gestor de Tareas</h2>
        <form id="form-tarea">
            <input type="text" id="nueva-tarea" placeholder="Nueva tarea...">
            <select id="prioridad">
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
            </select>
            <button type="submit">Agregar Tarea</button>
        </form>
        <div class="filtros">
            <button class="filtro activo" data-filtro="todas">Todas</button>
            <button class="filtro" data-filtro="pendientes">Pendientes</button>
            <button class="filtro" data-filtro="completadas">Completadas</button>
        </div>
        <div id="lista-tareas"></div>
        <div class="estadisticas">
            <span id="contador-pendientes">0 pendientes</span>
            <span id="contador-completadas">0 completadas</span>
        </div>
    `;

  document.body.appendChild(interfazTareas);
  return interfazTareas;
};

// Clase para gestionar tareas
class GestorTareasDOM {
  constructor() {
    this.tareas = this.cargarTareas();
    this.filtroActual = 'todas';
    this.crearInterfaz();
    this.configurarEventos();
    this.renderizarTareas();
  }

  crearInterfaz() {
    this.interfaz = crearInterfazTareas();
  }

  configurarEventos() {
    // Agregar tarea
    document.getElementById('form-tarea').addEventListener('submit', e => {
      e.preventDefault();
      this.agregarTarea();
    });

    // Filtros
    document.querySelectorAll('.filtro').forEach(filtro => {
      filtro.addEventListener('click', () => {
        this.cambiarFiltro(filtro.dataset.filtro);
      });
    });

    // Event delegation para tareas
    document.getElementById('lista-tareas').addEventListener('click', e => {
      const tarea = e.target.closest('.tarea');
      if (!tarea) return;

      const id = parseInt(tarea.dataset.id);

      if (e.target.classList.contains('btn-completar')) {
        this.toggleCompletarTarea(id);
      } else if (e.target.classList.contains('btn-eliminar')) {
        this.eliminarTarea(id);
      }
    });
  }

  agregarTarea() {
    const texto = document.getElementById('nueva-tarea').value.trim();
    const prioridad = document.getElementById('prioridad').value;

    if (!texto) return;

    const tarea = {
      id: Date.now(),
      texto,
      prioridad,
      completada: false,
      fecha: new Date().toISOString(),
    };

    this.tareas.push(tarea);
    this.guardarTareas();
    this.renderizarTareas();

    // Limpiar formulario
    document.getElementById('nueva-tarea').value = '';
    document.getElementById('prioridad').value = 'baja';
  }

  toggleCompletarTarea(id) {
    const tarea = this.tareas.find(t => t.id === id);
    if (tarea) {
      tarea.completada = !tarea.completada;
      this.guardarTareas();
      this.renderizarTareas();
    }
  }

  eliminarTarea(id) {
    this.tareas = this.tareas.filter(t => t.id !== id);
    this.guardarTareas();
    this.renderizarTareas();
  }

  cambiarFiltro(filtro) {
    this.filtroActual = filtro;

    // Actualizar botones
    document.querySelectorAll('.filtro').forEach(btn => {
      btn.classList.remove('activo');
    });
    document.querySelector(`[data-filtro="${filtro}"]`).classList.add('activo');

    this.renderizarTareas();
  }

  obtenerTareasFiltradas() {
    switch (this.filtroActual) {
      case 'pendientes':
        return this.tareas.filter(t => !t.completada);
      case 'completadas':
        return this.tareas.filter(t => t.completada);
      default:
        return this.tareas;
    }
  }

  renderizarTareas() {
    const container = document.getElementById('lista-tareas');
    const tareasFiltradas = this.obtenerTareasFiltradas();

    container.innerHTML = tareasFiltradas
      .map(
        tarea => `
            <div class="tarea ${
              tarea.completada ? 'completada' : ''
            } prioridad-${tarea.prioridad}" 
                 data-id="${tarea.id}">
                <span class="texto">${tarea.texto}</span>
                <span class="prioridad">${tarea.prioridad}</span>
                <button class="btn-completar">
                    ${tarea.completada ? '↩' : '✓'}
                </button>
                <button class="btn-eliminar">✕</button>
            </div>
        `
      )
      .join('');

    this.actualizarEstadisticas();
  }

  actualizarEstadisticas() {
    const pendientes = this.tareas.filter(t => !t.completada).length;
    const completadas = this.tareas.filter(t => t.completada).length;

    document.getElementById(
      'contador-pendientes'
    ).textContent = `${pendientes} pendientes`;
    document.getElementById(
      'contador-completadas'
    ).textContent = `${completadas} completadas`;
  }

  guardarTareas() {
    localStorage.setItem('tareas', JSON.stringify(this.tareas));
  }

  cargarTareas() {
    const tareas = localStorage.getItem('tareas');
    return tareas ? JSON.parse(tareas) : [];
  }
}

// Inicializar gestor de tareas
const gestorTareas = new GestorTareasDOM();

// Agregar estilos CSS
const estilos = document.createElement('style');
estilos.textContent = `
    .tarea {
        display: flex;
        align-items: center;
        padding: 10px;
        margin: 5px 0;
        border: 1px solid #ddd;
        border-radius: 5px;
        background: white;
    }
    
    .tarea.completada {
        opacity: 0.6;
        text-decoration: line-through;
    }
    
    .tarea.prioridad-alta {
        border-left: 5px solid #f44336;
    }
    
    .tarea.prioridad-media {
        border-left: 5px solid #ff9800;
    }
    
    .tarea.prioridad-baja {
        border-left: 5px solid #4caf50;
    }
    
    .tarea .texto {
        flex: 1;
    }
    
    .tarea .prioridad {
        margin: 0 10px;
        font-size: 12px;
        color: #666;
    }
    
    .tarea button {
        margin-left: 5px;
        padding: 5px 10px;
        border: none;
        border-radius: 3px;
        cursor: pointer;
    }
    
    .btn-completar {
        background: #4caf50;
        color: white;
    }
    
    .btn-eliminar {
        background: #f44336;
        color: white;
    }
    
    .filtros {
        margin: 20px 0;
    }
    
    .filtro {
        margin-right: 10px;
        padding: 5px 15px;
        border: 1px solid #ddd;
        background: white;
        cursor: pointer;
    }
    
    .filtro.activo {
        background: #2196f3;
        color: white;
    }
    
    .estadisticas {
        margin-top: 20px;
        padding: 10px;
        background: #f5f5f5;
        border-radius: 5px;
    }
`;
document.head.appendChild(estilos);

// ============================================
// 🎯 Puntos Clave para WorldSkills
// ============================================
console.log('\n🎯 Puntos Clave para WorldSkills:');
console.log('✅ querySelector es más flexible que getElementById');
console.log('✅ Event delegation mejora la performance');
console.log('✅ FormData simplifica el manejo de formularios');
console.log('✅ Intersection Observer es ideal para animaciones');
console.log('✅ Local Storage persiste datos entre sesiones');
console.log('✅ Manipulación del DOM debe ser eficiente');
console.log('✅ Separar lógica de presentación es fundamental');
