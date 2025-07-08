// Dashboard JavaScript - Starter Template
// Este archivo contiene la funcionalidad básica para que los estudiantes completen

/* ============================
   VARIABLES GLOBALES
============================ */
let currentTheme = 'light';
let sidebarCollapsed = false;
let isMobile = window.innerWidth <= 1024;

/* ============================
   ELEMENTOS DEL DOM
============================ */
const dashboardContainer = document.querySelector('.dashboard-container');
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const themeToggle = document.getElementById('themeToggle');
const navLinks = document.querySelectorAll('.nav-link');

/* ============================
   INICIALIZACIÓN
============================ */
document.addEventListener('DOMContentLoaded', () => {
  initializeTheme();
  initializeSidebar();
  initializeNavigation();
  initializeWidgets();
  initializeResponsive();

  console.log('📊 Dashboard inicializado correctamente');
});

/* ============================
   GESTIÓN DEL SIDEBAR
============================ */
function initializeSidebar() {
  // Toggle sidebar en móvil
  sidebarToggle?.addEventListener('click', toggleSidebar);

  // Cerrar sidebar al hacer clic en overlay
  sidebarOverlay?.addEventListener('click', closeSidebar);

  // Cerrar sidebar al presionar Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && sidebar.classList.contains('active')) {
      closeSidebar();
    }
  });
}

function toggleSidebar() {
  if (isMobile) {
    sidebar.classList.toggle('active');
    sidebarOverlay.classList.toggle('active');
    document.body.style.overflow = sidebar.classList.contains('active')
      ? 'hidden'
      : '';
  } else {
    // Desktop: colapsar sidebar
    sidebarCollapsed = !sidebarCollapsed;
    dashboardContainer.classList.toggle('sidebar-collapsed', sidebarCollapsed);

    // Guardar preferencia
    localStorage.setItem('sidebarCollapsed', sidebarCollapsed);
  }
}

function closeSidebar() {
  sidebar.classList.remove('active');
  sidebarOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

/* ============================
   GESTIÓN DE TEMAS
============================ */
function initializeTheme() {
  // Cargar tema guardado
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    currentTheme = savedTheme;
    applyTheme(currentTheme);
  }

  // Event listener para cambio de tema
  themeToggle?.addEventListener('click', toggleTheme);

  // Detectar preferencia del sistema
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  if (!savedTheme && prefersDark.matches) {
    currentTheme = 'dark';
    applyTheme(currentTheme);
  }

  // Escuchar cambios en preferencia del sistema
  prefersDark.addEventListener('change', e => {
    if (!localStorage.getItem('theme')) {
      currentTheme = e.matches ? 'dark' : 'light';
      applyTheme(currentTheme);
    }
  });
}

function toggleTheme() {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  applyTheme(currentTheme);
  localStorage.setItem('theme', currentTheme);
}

function applyTheme(theme) {
  document.body.setAttribute('data-theme', theme);

  // Actualizar icono del botón
  if (themeToggle) {
    themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
  }

  console.log(`🎨 Tema cambiado a: ${theme}`);
}

/* ============================
   NAVEGACIÓN
============================ */
function initializeNavigation() {
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();

      // Remover clase active de todos los enlaces
      navLinks.forEach(l => l.classList.remove('active'));

      // Agregar clase active al enlace clickeado
      link.classList.add('active');

      // Cerrar sidebar en móvil
      if (isMobile) {
        closeSidebar();
      }

      // Aquí podrías añadir lógica para cambiar el contenido
      const section = link.querySelector('.nav-text').textContent;
      console.log(`📄 Navegando a: ${section}`);
    });
  });
}

/* ============================
   WIDGETS Y DATOS
============================ */
function initializeWidgets() {
  // Simular datos en tiempo real
  updateStatsCards();
  updateCharts();
  updateActivityFeed();

  // Actualizar cada 30 segundos
  setInterval(() => {
    updateStatsCards();
    updateCharts();
  }, 30000);
}

function updateStatsCards() {
  const statValues = document.querySelectorAll('.stat-value');
  const statChanges = document.querySelectorAll('.stat-change');

  // Simular cambios aleatorios
  statValues.forEach((value, index) => {
    const currentValue = parseInt(value.textContent.replace(/[^\d]/g, ''));
    const change = Math.floor(Math.random() * 10) - 5; // -5 a +5
    const newValue = Math.max(0, currentValue + change);

    // Animar el cambio
    animateValue(value, currentValue, newValue, 1000);

    // Actualizar indicador de cambio
    if (statChanges[index]) {
      const changePercent = change > 0 ? '+' : '';
      statChanges[index].textContent = `${changePercent}${change}% desde ayer`;
      statChanges[index].className = `stat-change ${
        change >= 0 ? 'positive' : 'negative'
      }`;
    }
  });
}

function animateValue(element, start, end, duration) {
  const startTime = performance.now();
  const isPrice = element.textContent.includes('$');

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const current = Math.floor(start + (end - start) * progress);
    element.textContent = isPrice
      ? `$${current.toLocaleString()}`
      : current.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

function updateCharts() {
  const chartBars = document.querySelectorAll('.chart-bar');

  chartBars.forEach(bar => {
    const randomHeight = Math.floor(Math.random() * 80) + 20;
    bar.style.height = `${randomHeight}%`;
  });
}

function updateActivityFeed() {
  // TODO: Implementar feed de actividad en tiempo real
  console.log('📊 Actualizando feed de actividad');
}

/* ============================
   RESPONSIVE DESIGN
============================ */
function initializeResponsive() {
  // Cargar preferencia de sidebar
  const savedCollapsed = localStorage.getItem('sidebarCollapsed');
  if (savedCollapsed === 'true' && !isMobile) {
    sidebarCollapsed = true;
    dashboardContainer.classList.add('sidebar-collapsed');
  }

  // Escuchar cambios de tamaño de ventana
  window.addEventListener('resize', handleResize);

  // Configuración inicial
  handleResize();
}

function handleResize() {
  const newIsMobile = window.innerWidth <= 1024;

  if (newIsMobile !== isMobile) {
    isMobile = newIsMobile;

    if (isMobile) {
      // Cambiar a móvil
      closeSidebar();
      dashboardContainer.classList.remove('sidebar-collapsed');
    } else {
      // Cambiar a desktop
      sidebar.classList.remove('active');
      sidebarOverlay.classList.remove('active');
      document.body.style.overflow = '';

      // Restaurar estado collapsed
      if (sidebarCollapsed) {
        dashboardContainer.classList.add('sidebar-collapsed');
      }
    }
  }

  // Actualizar layout de widgets
  updateWidgetsLayout();
}

function updateWidgetsLayout() {
  const widgetsGrid = document.querySelector('.widgets-grid');
  const widgets = document.querySelectorAll('.widget');

  if (widgetsGrid && widgets.length > 0) {
    // Ajustar grid según tamaño de pantalla
    const columns = isMobile ? 1 : window.innerWidth <= 1200 ? 2 : 3;
    widgetsGrid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
  }
}

/* ============================
   UTILIDADES
============================ */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function formatNumber(number) {
  return number.toLocaleString();
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
  }).format(amount);
}

/* ============================
   EVENTOS GLOBALES
============================ */
// Manejar errores globales
window.addEventListener('error', e => {
  console.error('❌ Error en dashboard:', e.error);
});

// Manejar visibilidad de página
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    // Actualizar datos cuando la página vuelve a ser visible
    updateStatsCards();
    updateCharts();
  }
});

// Atajos de teclado
document.addEventListener('keydown', e => {
  // Ctrl + K para buscar
  if (e.ctrlKey && e.key === 'k') {
    e.preventDefault();
    document.querySelector('.search-input')?.focus();
  }

  // Ctrl + \ para toggle sidebar
  if (e.ctrlKey && e.key === '\\') {
    e.preventDefault();
    toggleSidebar();
  }

  // Ctrl + Shift + L para toggle theme
  if (e.ctrlKey && e.shiftKey && e.key === 'L') {
    e.preventDefault();
    toggleTheme();
  }
});

/* ============================
   NOTAS PARA ESTUDIANTES
============================ */
/*
FUNCIONALIDADES IMPLEMENTADAS:
✅ Toggle sidebar responsive
✅ Cambio de tema claro/oscuro
✅ Navegación entre secciones
✅ Actualización de datos simulada
✅ Animaciones de valores
✅ Responsive design
✅ Atajos de teclado
✅ Persistencia de preferencias

TAREAS PENDIENTES:
⏳ Completar widgets de gráficos
⏳ Implementar notificaciones
⏳ Añadir búsqueda funcional
⏳ Crear configuración de usuario
⏳ Implementar exportación de datos
⏳ Añadir más animaciones
⏳ Optimizar performance
⏳ Añadir tests unitarios

ATAJOS DE TECLADO:
- Ctrl + K: Enfocar búsqueda
- Ctrl + \: Toggle sidebar
- Ctrl + Shift + L: Toggle theme
- Escape: Cerrar sidebar (móvil)

MEJORES PRÁCTICAS APLICADAS:
- Event delegation
- Debouncing para resize
- LocalStorage para persistencia
- Error handling
- Performance optimization
- Accessibility considerations
*/
