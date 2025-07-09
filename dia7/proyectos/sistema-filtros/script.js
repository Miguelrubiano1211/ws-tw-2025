/**
 * Sistema de Filtros - Día 7
 * JavaScript Avanzado: Callbacks, Higher-Order Functions, Arrow Functions
 */

// Estado global de la aplicación
const estado = {
  productos: [],
  productosFiltrados: [],
  filtros: {
    busqueda: '',
    categoria: '',
    precioMin: 0,
    precioMax: 1000,
    disponible: true,
    rating: 0,
  },
  ordenamiento: 'nombre-asc',
  cargando: false,
};

// Elementos del DOM
const elementos = {
  // Filtros
  busqueda: document.getElementById('busqueda'),
  categoria: document.getElementById('categoria'),
  precioMin: document.getElementById('precio-min'),
  precioMax: document.getElementById('precio-max'),
  disponible: document.getElementById('disponible'),
  rating: document.getElementById('rating-min'),

  // Controles
  ordenar: document.getElementById('ordenar'),
  limpiarFiltros: document.getElementById('limpiar-filtros'),
  limpiarBusqueda: document.getElementById('limpiar-busqueda'),

  // Visualización
  productosGrid: document.getElementById('productos-grid'),
  loading: document.getElementById('loading'),
  noResults: document.getElementById('no-results'),

  // Información
  contadorResultados: document.getElementById('contador-resultados'),
  totalProductos: document.getElementById('total-productos'),
  productosMostrados: document.getElementById('productos-mostrados'),
  precioPromedio: document.getElementById('precio-promedio'),

  // Filtros activos
  filtrosActivos: document.getElementById('filtros-activos'),
  tagsFiltros: document.getElementById('tags-filtros'),

  // Breakdown
  breakdownCategorias: document.getElementById('breakdown-categorias'),

  // Precio display
  precioMinDisplay: document.getElementById('precio-min-display'),
  precioMaxDisplay: document.getElementById('precio-max-display'),
};

// Funciones de orden superior para filtros
const crearFiltro = (propiedad, comparador) => {
  return (productos, valor) => {
    if (!valor && valor !== 0) return productos;
    return productos.filter(producto => comparador(producto[propiedad], valor));
  };
};

// Filtros específicos usando higher-order functions
const filtros = {
  porBusqueda: crearFiltro('nombre', (nombre, busqueda) =>
    nombre.toLowerCase().includes(busqueda.toLowerCase())
  ),

  porCategoria: crearFiltro(
    'categoria',
    (categoria, filtroCategoria) => categoria === filtroCategoria
  ),

  porPrecioMin: crearFiltro(
    'precio',
    (precio, precioMin) => precio >= precioMin
  ),

  porPrecioMax: crearFiltro(
    'precio',
    (precio, precioMax) => precio <= precioMax
  ),

  porDisponibilidad: crearFiltro(
    'disponible',
    (disponible, filtroDisponible) => !filtroDisponible || disponible
  ),

  porRating: crearFiltro('rating', (rating, ratingMin) => rating >= ratingMin),
};

// Funciones de ordenamiento
const ordenamientos = {
  'nombre-asc': (a, b) => a.nombre.localeCompare(b.nombre),
  'nombre-desc': (a, b) => b.nombre.localeCompare(a.nombre),
  'precio-asc': (a, b) => a.precio - b.precio,
  'precio-desc': (a, b) => b.precio - a.precio,
  'rating-desc': (a, b) => b.rating - a.rating,
  'fecha-desc': (a, b) => new Date(b.fecha) - new Date(a.fecha),
};

// Utilidades con arrow functions
const formatearPrecio = precio => `$${precio.toLocaleString('es-CO')}`;

const formatearRating = rating => '⭐'.repeat(Math.floor(rating));

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Función para cargar datos
const cargarProductos = async () => {
  try {
    mostrarCargando(true);

    // Simular carga de datos
    await new Promise(resolve => setTimeout(resolve, 800));

    const response = await fetch('./data/productos.json');
    const datos = await response.json();

    estado.productos = datos;
    estado.productosFiltrados = [...datos];

    actualizarEstadisticas();
    renderizarProductos();
  } catch (error) {
    console.error('Error al cargar productos:', error);
    mostrarError('Error al cargar los productos');
  } finally {
    mostrarCargando(false);
  }
};

// Función principal de filtrado usando composición
const aplicarFiltros = () => {
  let productos = [...estado.productos];

  // Aplicar filtros en secuencia usando funciones de orden superior
  productos = filtros.porBusqueda(productos, estado.filtros.busqueda);
  productos = filtros.porCategoria(productos, estado.filtros.categoria);
  productos = filtros.porPrecioMin(productos, estado.filtros.precioMin);
  productos = filtros.porPrecioMax(productos, estado.filtros.precioMax);
  productos = filtros.porDisponibilidad(productos, estado.filtros.disponible);
  productos = filtros.porRating(productos, estado.filtros.rating);

  // Aplicar ordenamiento
  const funcionOrdenamiento = ordenamientos[estado.ordenamiento];
  if (funcionOrdenamiento) {
    productos.sort(funcionOrdenamiento);
  }

  estado.productosFiltrados = productos;

  // Actualizar UI
  actualizarEstadisticas();
  renderizarProductos();
  actualizarFiltrosActivos();
};

// Renderizado de productos
const renderizarProductos = () => {
  const grid = elementos.productosGrid;
  const productos = estado.productosFiltrados;

  if (productos.length === 0) {
    mostrarNoResultados(true);
    grid.innerHTML = '';
    return;
  }

  mostrarNoResultados(false);

  // Crear HTML usando template literals y map
  grid.innerHTML = productos
    .map(
      producto => `
        <div class="product-card fade-in">
            <div class="product-image">
                ${producto.icono}
            </div>
            <div class="product-info">
                <h3 class="product-name">${producto.nombre}</h3>
                <span class="product-category">${producto.categoria}</span>
                <div class="product-price">${formatearPrecio(
                  producto.precio
                )}</div>
                <div class="product-rating">
                    ${formatearRating(producto.rating)}
                    <span>(${producto.rating})</span>
                </div>
                <div class="product-status">
                    <span class="status-badge ${
                      producto.disponible
                        ? 'status-disponible'
                        : 'status-agotado'
                    }">
                        ${producto.disponible ? 'Disponible' : 'Agotado'}
                    </span>
                </div>
            </div>
        </div>
    `
    )
    .join('');

  // Agregar animaciones
  requestAnimationFrame(() => {
    const cards = grid.querySelectorAll('.product-card');
    cards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.05}s`;
    });
  });
};

// Actualizar estadísticas usando reduce y otras funciones de array
const actualizarEstadisticas = () => {
  const total = estado.productos.length;
  const mostrados = estado.productosFiltrados.length;

  // Calcular precio promedio usando reduce
  const precioPromedio =
    estado.productosFiltrados.length > 0
      ? estado.productosFiltrados.reduce(
          (acc, producto) => acc + producto.precio,
          0
        ) / estado.productosFiltrados.length
      : 0;

  // Actualizar displays
  elementos.contadorResultados.textContent = `${mostrados} productos encontrados`;
  elementos.totalProductos.textContent = total;
  elementos.productosMostrados.textContent = mostrados;
  elementos.precioPromedio.textContent = formatearPrecio(precioPromedio);

  // Breakdown por categorías usando reduce
  const categoriasCount = estado.productosFiltrados.reduce((acc, producto) => {
    acc[producto.categoria] = (acc[producto.categoria] || 0) + 1;
    return acc;
  }, {});

  // Renderizar breakdown
  elementos.breakdownCategorias.innerHTML = Object.entries(categoriasCount)
    .map(
      ([categoria, count]) => `
            <div class="category-item">
                <span class="category-name">${categoria}</span>
                <span class="category-count">${count}</span>
            </div>
        `
    )
    .join('');
};

// Mostrar filtros activos
const actualizarFiltrosActivos = () => {
  const tags = [];
  const filtrosEstado = estado.filtros;

  // Crear tags para filtros activos
  if (filtrosEstado.busqueda) {
    tags.push({
      tipo: 'busqueda',
      valor: filtrosEstado.busqueda,
      label: `Buscar: "${filtrosEstado.busqueda}"`,
    });
  }

  if (filtrosEstado.categoria) {
    tags.push({
      tipo: 'categoria',
      valor: filtrosEstado.categoria,
      label: `Categoría: ${filtrosEstado.categoria}`,
    });
  }

  if (filtrosEstado.precioMin > 0 || filtrosEstado.precioMax < 1000) {
    tags.push({
      tipo: 'precio',
      valor: null,
      label: `Precio: ${formatearPrecio(
        filtrosEstado.precioMin
      )} - ${formatearPrecio(filtrosEstado.precioMax)}`,
    });
  }

  if (!filtrosEstado.disponible) {
    tags.push({ tipo: 'disponible', valor: false, label: 'Incluir agotados' });
  }

  if (filtrosEstado.rating > 0) {
    tags.push({
      tipo: 'rating',
      valor: filtrosEstado.rating,
      label: `Rating: ${filtrosEstado.rating}+ estrellas`,
    });
  }

  // Renderizar tags
  elementos.tagsFiltros.innerHTML = tags
    .map(
      tag => `
        <span class="filter-tag">
            ${tag.label}
            <button onclick="eliminarFiltro('${tag.tipo}', '${tag.valor}')">&times;</button>
        </span>
    `
    )
    .join('');

  // Mostrar/ocultar sección de filtros activos
  elementos.filtrosActivos.style.display = tags.length > 0 ? 'block' : 'none';
};

// Eliminar filtro específico
const eliminarFiltro = (tipo, valor) => {
  switch (tipo) {
    case 'busqueda':
      estado.filtros.busqueda = '';
      elementos.busqueda.value = '';
      break;
    case 'categoria':
      estado.filtros.categoria = '';
      elementos.categoria.value = '';
      break;
    case 'precio':
      estado.filtros.precioMin = 0;
      estado.filtros.precioMax = 1000;
      elementos.precioMin.value = 0;
      elementos.precioMax.value = 1000;
      actualizarDisplayPrecio();
      break;
    case 'disponible':
      estado.filtros.disponible = true;
      elementos.disponible.checked = true;
      break;
    case 'rating':
      estado.filtros.rating = 0;
      elementos.rating.value = 0;
      break;
  }

  aplicarFiltros();
};

// Limpiar todos los filtros
const limpiarTodosFiltros = () => {
  estado.filtros = {
    busqueda: '',
    categoria: '',
    precioMin: 0,
    precioMax: 1000,
    disponible: true,
    rating: 0,
  };

  // Resetear controles
  elementos.busqueda.value = '';
  elementos.categoria.value = '';
  elementos.precioMin.value = 0;
  elementos.precioMax.value = 1000;
  elementos.disponible.checked = true;
  elementos.rating.value = 0;

  actualizarDisplayPrecio();
  aplicarFiltros();
};

// Actualizar display de precio
const actualizarDisplayPrecio = () => {
  elementos.precioMinDisplay.textContent = formatearPrecio(
    estado.filtros.precioMin
  );
  elementos.precioMaxDisplay.textContent = formatearPrecio(
    estado.filtros.precioMax
  );
};

// Funciones de UI
const mostrarCargando = mostrar => {
  elementos.loading.style.display = mostrar ? 'flex' : 'none';
  elementos.productosGrid.style.display = mostrar ? 'none' : 'grid';
};

const mostrarNoResultados = mostrar => {
  elementos.noResults.style.display = mostrar ? 'block' : 'none';
};

const mostrarError = mensaje => {
  elementos.productosGrid.innerHTML = `
        <div class="error-message">
            <div class="error-icon">⚠️</div>
            <h3>Error</h3>
            <p>${mensaje}</p>
        </div>
    `;
};

// Event listeners usando arrow functions
const configurarEventListeners = () => {
  // Búsqueda con debounce
  const busquedaDebounced = debounce(valor => {
    estado.filtros.busqueda = valor;
    aplicarFiltros();
  }, 300);

  elementos.busqueda.addEventListener('input', e => {
    busquedaDebounced(e.target.value);
  });

  // Filtros
  elementos.categoria.addEventListener('change', e => {
    estado.filtros.categoria = e.target.value;
    aplicarFiltros();
  });

  elementos.precioMin.addEventListener('input', e => {
    estado.filtros.precioMin = parseInt(e.target.value);
    actualizarDisplayPrecio();
    aplicarFiltros();
  });

  elementos.precioMax.addEventListener('input', e => {
    estado.filtros.precioMax = parseInt(e.target.value);
    actualizarDisplayPrecio();
    aplicarFiltros();
  });

  elementos.disponible.addEventListener('change', e => {
    estado.filtros.disponible = e.target.checked;
    aplicarFiltros();
  });

  elementos.rating.addEventListener('change', e => {
    estado.filtros.rating = parseInt(e.target.value);
    aplicarFiltros();
  });

  // Ordenamiento
  elementos.ordenar.addEventListener('change', e => {
    estado.ordenamiento = e.target.value;
    aplicarFiltros();
  });

  // Botones de limpieza
  elementos.limpiarFiltros.addEventListener('click', limpiarTodosFiltros);
  elementos.limpiarBusqueda.addEventListener('click', limpiarTodosFiltros);

  // Keyboard shortcuts
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 'k') {
      e.preventDefault();
      elementos.busqueda.focus();
    }

    if (e.key === 'Escape') {
      limpiarTodosFiltros();
    }
  });
};

// Inicialización de la aplicación
const inicializarApp = async () => {
  console.log('🚀 Iniciando Sistema de Filtros...');

  // Configurar event listeners
  configurarEventListeners();

  // Configurar display inicial de precio
  actualizarDisplayPrecio();

  // Cargar datos
  await cargarProductos();

  console.log('✅ Sistema de Filtros iniciado correctamente');
};

// Funciones auxiliares para debugging
const debug = {
  obtenerEstado: () => estado,
  obtenerProductos: () => estado.productos,
  obtenerFiltrados: () => estado.productosFiltrados,
  aplicarFiltroPersonalizado: filtroFn => {
    estado.productosFiltrados = estado.productos.filter(filtroFn);
    renderizarProductos();
    actualizarEstadisticas();
  },
};

// Exponer debug en desarrollo
if (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
) {
  window.debug = debug;
}

// Iniciar aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', inicializarApp);

// Manejo de errores globales
window.addEventListener('error', error => {
  console.error('Error global:', error);
  mostrarError('Ocurrió un error inesperado');
});

// Service Worker para PWA (opcional)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js')
    .then(registration => console.log('SW registrado:', registration))
    .catch(error => console.log('SW error:', error));
}
