/**
 * CONFIGURACIÓN DE LA APLICACIÓN
 *
 * Este archivo contiene todas las configuraciones y constantes
 * utilizadas en la aplicación, organizadas de manera modular.
 */

// Configuración de la aplicación
export const APP_CONFIG = {
  name: 'Gestión de Productos',
  version: '1.0.0',
  description: 'Sistema de gestión de inventario con ES6+',
  author: 'Estudiante WorldSkills',
};

// Configuración de la API (simulada)
export const API_CONFIG = {
  baseUrl: '/api',
  timeout: 5000,
  retries: 3,
  endpoints: {
    products: '/products',
    categories: '/categories',
    stats: '/stats',
  },
};

// Configuración de la base de datos local
export const STORAGE_CONFIG = {
  prefix: 'products_app_',
  keys: {
    products: 'products',
    categories: 'categories',
    settings: 'settings',
    cache: 'cache',
  },
  version: '1.0',
};

// Configuración de paginación
export const PAGINATION_CONFIG = {
  itemsPerPage: 12,
  maxVisiblePages: 5,
  showSizeSelector: true,
  pageSizes: [6, 12, 24, 48],
};

// Configuración de búsqueda
export const SEARCH_CONFIG = {
  minLength: 2,
  debounceTime: 300,
  caseSensitive: false,
  searchFields: ['name', 'description', 'category', 'tags'],
};

// Configuración de validación
export const VALIDATION_CONFIG = {
  product: {
    name: {
      required: true,
      minLength: 3,
      maxLength: 100,
      pattern: /^[a-zA-Z0-9\s\-\.]+$/,
    },
    price: {
      required: true,
      min: 0,
      max: 999999,
      decimal: true,
    },
    stock: {
      required: true,
      min: 0,
      max: 99999,
      integer: true,
    },
    category: {
      required: true,
      minLength: 2,
      maxLength: 50,
    },
    description: {
      required: false,
      maxLength: 500,
    },
  },
};

// Configuración de notificaciones
export const NOTIFICATION_CONFIG = {
  duration: 4000,
  types: {
    success: {
      icon: '✅',
      className: 'success',
    },
    error: {
      icon: '❌',
      className: 'error',
    },
    warning: {
      icon: '⚠️',
      className: 'warning',
    },
    info: {
      icon: 'ℹ️',
      className: 'info',
    },
  },
};

// Configuración de tema
export const THEME_CONFIG = {
  default: 'light',
  available: ['light', 'dark'],
  colors: {
    light: {
      primary: '#3b82f6',
      secondary: '#64748b',
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#06b6d4',
    },
    dark: {
      primary: '#60a5fa',
      secondary: '#94a3b8',
      success: '#34d399',
      error: '#f87171',
      warning: '#fbbf24',
      info: '#22d3ee',
    },
  },
};

// Configuración de exportación
export const EXPORT_CONFIG = {
  formats: ['json', 'csv', 'xlsx'],
  filename: 'productos_export',
  dateFormat: 'YYYY-MM-DD_HH-mm-ss',
  includeHeaders: true,
};

// Configuración de animaciones
export const ANIMATION_CONFIG = {
  duration: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
};

// Configuración de desarrollo
export const DEV_CONFIG = {
  enableLogging: true,
  logLevel: 'debug', // debug, info, warn, error
  enableMocking: true,
  mockDelay: 500,
};

// Configuración de rendimiento
export const PERFORMANCE_CONFIG = {
  enableVirtualScrolling: true,
  lazyLoadImages: true,
  debounceSearch: true,
  cacheResults: true,
  maxCacheSize: 100,
};

// Mensajes de la aplicación
export const MESSAGES = {
  errors: {
    generic: 'Ha ocurrido un error inesperado',
    network: 'Error de conexión. Verifica tu conexión a internet',
    validation: 'Por favor, corrige los errores en el formulario',
    notFound: 'Producto no encontrado',
    unauthorized: 'No tienes permisos para esta acción',
    storage: 'Error al guardar los datos',
  },
  success: {
    created: 'Producto creado exitosamente',
    updated: 'Producto actualizado exitosamente',
    deleted: 'Producto eliminado exitosamente',
    exported: 'Datos exportados exitosamente',
    imported: 'Datos importados exitosamente',
  },
  confirmations: {
    delete: '¿Estás seguro de que quieres eliminar este producto?',
    deleteAll: '¿Estás seguro de que quieres eliminar todos los productos?',
    export: '¿Quieres exportar todos los productos?',
    import:
      '¿Quieres importar los productos? Esto sobrescribirá los datos existentes',
  },
};

// Categorías predefinidas
export const DEFAULT_CATEGORIES = [
  { id: 'electronics', name: 'Electrónicos', icon: '📱' },
  { id: 'clothing', name: 'Ropa y Accesorios', icon: '👕' },
  { id: 'books', name: 'Libros', icon: '📚' },
  { id: 'home', name: 'Hogar y Jardín', icon: '🏠' },
  { id: 'sports', name: 'Deportes', icon: '⚽' },
  { id: 'health', name: 'Salud y Belleza', icon: '💊' },
  { id: 'toys', name: 'Juguetes', icon: '🧸' },
  { id: 'automotive', name: 'Automotriz', icon: '🚗' },
  { id: 'food', name: 'Alimentos', icon: '🍕' },
  { id: 'other', name: 'Otros', icon: '📦' },
];

// Configuración de ordenamiento
export const SORT_OPTIONS = [
  { value: 'name', label: 'Nombre A-Z', direction: 'asc' },
  { value: 'name', label: 'Nombre Z-A', direction: 'desc' },
  { value: 'price', label: 'Precio menor a mayor', direction: 'asc' },
  { value: 'price', label: 'Precio mayor a menor', direction: 'desc' },
  { value: 'stock', label: 'Stock menor a mayor', direction: 'asc' },
  { value: 'stock', label: 'Stock mayor a menor', direction: 'desc' },
  { value: 'date', label: 'Más reciente', direction: 'desc' },
  { value: 'date', label: 'Más antiguo', direction: 'asc' },
];

// Atajos de teclado
export const KEYBOARD_SHORTCUTS = {
  'ctrl+n': 'newProduct',
  'ctrl+s': 'saveProduct',
  'ctrl+f': 'focusSearch',
  escape: 'closeModal',
  'ctrl+e': 'exportData',
  'ctrl+i': 'importData',
  delete: 'deleteSelected',
};

// Configuración responsive
export const RESPONSIVE_CONFIG = {
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1200px',
  },
  gridColumns: {
    mobile: 1,
    tablet: 2,
    desktop: 3,
  },
};

// Configuración de estado por defecto
export const DEFAULT_STATE = {
  products: [],
  categories: [...DEFAULT_CATEGORIES],
  filters: {
    search: '',
    category: '',
    sort: 'name',
    direction: 'asc',
  },
  pagination: {
    currentPage: 1,
    itemsPerPage: PAGINATION_CONFIG.itemsPerPage,
    totalItems: 0,
    totalPages: 0,
  },
  ui: {
    view: 'grid',
    theme: THEME_CONFIG.default,
    loading: false,
    modal: {
      open: false,
      type: null,
      data: null,
    },
  },
};

// Regex patterns útiles
export const PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^(\+\d{1,3}[- ]?)?\d{10}$/,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  decimal: /^\d+(\.\d{1,2})?$/,
  integer: /^\d+$/,
  alphanumeric: /^[a-zA-Z0-9\s]+$/,
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
};

// Configuración de accesibilidad
export const ACCESSIBILITY_CONFIG = {
  announcements: true,
  keyboardNavigation: true,
  screenReaderSupport: true,
  highContrast: false,
  reducedMotion: false,
};

// Configuración de métricas
export const METRICS_CONFIG = {
  enabled: true,
  events: [
    'product:created',
    'product:updated',
    'product:deleted',
    'search:performed',
    'filter:applied',
    'export:completed',
  ],
};

// Función para obtener configuración por entorno
export const getConfig = (environment = 'development') => {
  const baseConfig = {
    ...APP_CONFIG,
    ...API_CONFIG,
    ...STORAGE_CONFIG,
    ...PAGINATION_CONFIG,
    ...SEARCH_CONFIG,
    ...VALIDATION_CONFIG,
    ...NOTIFICATION_CONFIG,
    ...THEME_CONFIG,
    ...EXPORT_CONFIG,
    ...ANIMATION_CONFIG,
    ...PERFORMANCE_CONFIG,
    ...RESPONSIVE_CONFIG,
    ...ACCESSIBILITY_CONFIG,
    ...METRICS_CONFIG,
  };

  const environmentConfig = {
    development: {
      ...DEV_CONFIG,
      apiUrl: 'http://localhost:3000/api',
      enableLogging: true,
      enableMocking: true,
    },
    production: {
      enableLogging: false,
      logLevel: 'error',
      enableMocking: false,
      mockDelay: 0,
    },
  };

  return {
    ...baseConfig,
    ...environmentConfig[environment],
  };
};

// Exportar configuración por defecto
export default getConfig();
