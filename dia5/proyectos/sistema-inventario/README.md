# 🏪 Sistema de Inventario - Proyecto del Día 5

## 📋 Descripción del Proyecto

Sistema completo de gestión de inventario desarrollado en JavaScript vanilla, que permite gestionar productos, categorías y proveedores utilizando objetos JavaScript y técnicas avanzadas de programación.

## 🎯 Objetivos del Proyecto

### Objetivos Educativos

- Aplicar todos los conceptos de objetos aprendidos en el día
- Crear una aplicación funcional usando JavaScript vanilla
- Implementar CRUD completo (Create, Read, Update, Delete)
- Practicar destructuring, métodos de objetos e iteración
- Desarrollar una interfaz web interactiva

### Objetivos Técnicos

- Gestión de productos con propiedades completas
- Sistema de categorías y proveedores
- Validación de datos robusta
- Persistencia en LocalStorage
- Interfaz responsiva con Bootstrap
- Funcionalidades de búsqueda y filtrado

## 🚀 Funcionalidades Principales

### ✅ Gestión de Productos

- [x] Crear nuevos productos
- [x] Editar productos existentes
- [x] Eliminar productos
- [x] Listar todos los productos
- [x] Buscar productos por nombre
- [x] Filtrar por categoría
- [x] Ordenar por diferentes criterios

### ✅ Gestión de Categorías

- [x] Crear categorías
- [x] Editar categorías
- [x] Eliminar categorías
- [x] Listar categorías

### ✅ Gestión de Proveedores

- [x] Crear proveedores
- [x] Editar proveedores
- [x] Eliminar proveedores
- [x] Listar proveedores

### ✅ Funcionalidades Avanzadas

- [x] Validación de datos
- [x] Persistencia en LocalStorage
- [x] Exportar datos a JSON
- [x] Importar datos desde JSON
- [x] Reportes y estadísticas
- [x] Interfaz responsiva

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Estilos y diseño responsivo
- **Bootstrap 5**: Framework CSS
- **JavaScript ES6+**: Lógica de la aplicación
- **LocalStorage**: Persistencia de datos
- **JSON**: Formato de datos

## 📁 Estructura del Proyecto

```
sistema-inventario/
├── index.html          # Página principal
├── styles.css          # Estilos personalizados
├── script.js           # Lógica de la aplicación
├── README.md           # Este archivo
└── data/
    └── sample-data.json # Datos de ejemplo
```

## 🎨 Interfaz de Usuario

### Secciones Principales

1. **Dashboard**: Resumen general con estadísticas
2. **Productos**: Gestión completa de productos
3. **Categorías**: Administración de categorías
4. **Proveedores**: Gestión de proveedores
5. **Reportes**: Estadísticas y análisis

### Características de la Interfaz

- **Diseño responsivo**: Adaptable a diferentes pantallas
- **Navegación intuitiva**: Menú fácil de usar
- **Formularios dinámicos**: Validación en tiempo real
- **Tablas interactivas**: Ordenamiento y filtrado
- **Modales**: Para crear y editar registros
- **Alertas**: Feedback visual para acciones

## 🔧 Instalación y Configuración

### Requisitos

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Editor de código (VS Code recomendado)
- Servidor local (opcional, para desarrollo)

### Pasos de Instalación

1. **Clonar o descargar** el proyecto
2. **Abrir** `index.html` en el navegador
3. **Opcional**: Usar Live Server para desarrollo

```bash
# Si usas VS Code con Live Server
# 1. Instalar extensión Live Server
# 2. Click derecho en index.html -> "Open with Live Server"
```

## 📊 Modelo de Datos

### Estructura de Producto

```javascript
{
  id: 1,
  nombre: "Laptop Dell",
  descripcion: "Laptop para trabajo y estudio",
  precio: 2500000,
  stock: 10,
  categoria: "Electrónicos",
  proveedor: "TechCorp",
  fechaCreacion: "2024-01-15T10:30:00Z",
  fechaActualizacion: "2024-01-15T10:30:00Z",
  activo: true,
  imagen: "laptop-dell.jpg"
}
```

### Estructura de Categoría

```javascript
{
  id: 1,
  nombre: "Electrónicos",
  descripcion: "Dispositivos electrónicos",
  activa: true,
  fechaCreacion: "2024-01-15T10:30:00Z"
}
```

### Estructura de Proveedor

```javascript
{
  id: 1,
  nombre: "TechCorp",
  contacto: "Juan Pérez",
  email: "contacto@techcorp.com",
  telefono: "3001234567",
  direccion: "Calle 123, Bogotá",
  activo: true,
  fechaCreacion: "2024-01-15T10:30:00Z"
}
```

## 💻 Conceptos de JavaScript Aplicados

### 1. Objetos y Propiedades

```javascript
// Factory function para crear productos
function crearProducto(datos) {
  return {
    id: Date.now(),
    nombre: datos.nombre,
    descripcion: datos.descripcion,
    precio: parseFloat(datos.precio),
    stock: parseInt(datos.stock),
    categoria: datos.categoria,
    proveedor: datos.proveedor,
    fechaCreacion: new Date().toISOString(),
    fechaActualizacion: new Date().toISOString(),
    activo: true,
  };
}
```

### 2. Métodos de Objetos

```javascript
// Clase para gestionar inventario
class GestorInventario {
  constructor() {
    this.productos = [];
    this.categorias = [];
    this.proveedores = [];
  }

  agregarProducto(datos) {
    const producto = crearProducto(datos);
    this.productos.push(producto);
    this.guardarEnStorage();
    return producto;
  }

  obtenerEstadisticas() {
    return {
      totalProductos: this.productos.length,
      totalCategorias: this.categorias.length,
      totalProveedores: this.proveedores.length,
      valorInventario: this.calcularValorTotal(),
    };
  }
}
```

### 3. Destructuring

```javascript
// Destructuring en procesamiento de datos
function procesarFormularioProducto(formData) {
  const { nombre, descripcion, precio, stock, categoria, proveedor } = formData;

  return {
    datosBasicos: { nombre, descripcion },
    datosComerciales: { precio, stock },
    relaciones: { categoria, proveedor },
  };
}
```

### 4. Iteración sobre Objetos

```javascript
// Generar reporte usando Object.entries
function generarReporteInventario(productos) {
  const reporte = {};

  productos.forEach(producto => {
    const { categoria, precio, stock } = producto;

    if (!reporte[categoria]) {
      reporte[categoria] = {
        cantidad: 0,
        valorTotal: 0,
      };
    }

    reporte[categoria].cantidad += 1;
    reporte[categoria].valorTotal += precio * stock;
  });

  return reporte;
}
```

### 5. Validación de Objetos

```javascript
// Validador para productos
function validarProducto(producto) {
  const errores = [];

  if (!producto.nombre || producto.nombre.trim().length < 3) {
    errores.push('Nombre debe tener al menos 3 caracteres');
  }

  if (!producto.precio || producto.precio <= 0) {
    errores.push('Precio debe ser mayor a 0');
  }

  if (!producto.stock || producto.stock < 0) {
    errores.push('Stock no puede ser negativo');
  }

  return {
    valido: errores.length === 0,
    errores,
  };
}
```

## 🎯 Funcionalidades Implementadas

### Dashboard

- Resumen de estadísticas generales
- Gráficos de distribución por categoría
- Productos con bajo stock
- Actividad reciente

### Gestión de Productos

- Formulario de creación con validación
- Tabla con ordenamiento y filtrado
- Edición inline y modal
- Eliminación con confirmación
- Búsqueda en tiempo real

### Gestión de Categorías

- CRUD completo de categorías
- Validación de nombres únicos
- Verificación de uso antes de eliminar
- Estadísticas por categoría

### Gestión de Proveedores

- CRUD completo de proveedores
- Validación de datos de contacto
- Productos asociados por proveedor
- Información de contacto completa

### Persistencia y Exportación

- Guardado automático en LocalStorage
- Exportación a JSON
- Importación desde JSON
- Backup y restauración

## 🔍 Casos de Uso

### Caso de Uso 1: Agregar Producto

1. Usuario hace clic en "Nuevo Producto"
2. Sistema muestra formulario modal
3. Usuario completa datos
4. Sistema valida información
5. Si es válido, crea producto y actualiza interfaz
6. Sistema muestra mensaje de confirmación

### Caso de Uso 2: Buscar Productos

1. Usuario escribe en campo de búsqueda
2. Sistema filtra productos en tiempo real
3. Muestra resultados coincidentes
4. Usuario puede aplicar filtros adicionales

### Caso de Uso 3: Generar Reporte

1. Usuario selecciona sección de reportes
2. Sistema calcula estadísticas
3. Muestra datos en formato tabular y gráfico
4. Usuario puede exportar reporte

## 🚀 Cómo Ejecutar el Proyecto

### Método 1: Directamente en el navegador

```bash
# Abrir el archivo index.html
open index.html
```

### Método 2: Con servidor local

```bash
# Usando Python (si está instalado)
python -m http.server 8000

# Usando Node.js (si tienes npx)
npx http-server

# Usando VS Code Live Server
# Instalar extensión y hacer clic derecho -> "Open with Live Server"
```

### Método 3: Usando Docker (opcional)

```bash
# Crear imagen simple con nginx
docker run -p 8080:80 -v $(pwd):/usr/share/nginx/html nginx
```

## 📱 Responsividad

### Breakpoints

- **xs**: < 576px (móviles)
- **sm**: 576px - 767px (tablets portrait)
- **md**: 768px - 991px (tablets landscape)
- **lg**: 992px - 1199px (desktop)
- **xl**: ≥ 1200px (desktop grande)

### Adaptaciones

- Navegación colapsible en móviles
- Tablas con scroll horizontal
- Formularios apilados en pantallas pequeñas
- Botones adaptados para touch

## 🎨 Personalización

### Colores Principales

```css
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --success-color: #28a745;
  --danger-color: #dc3545;
  --warning-color: #ffc107;
  --info-color: #17a2b8;
}
```

### Extensiones Posibles

- Integración con API backend
- Código de barras/QR
- Reportes PDF
- Sistema de usuarios
- Notificaciones push
- Sincronización en la nube

## 🔧 Debugging y Desarrollo

### Herramientas de Desarrollo

- **Console.log**: Para debugging general
- **DevTools**: Para inspección de DOM
- **LocalStorage Inspector**: Para verificar datos
- **Network Tab**: Para monitorear requests

### Debugging Común

```javascript
// Verificar datos en LocalStorage
console.log('Productos:', localStorage.getItem('productos'));

// Verificar instancia del gestor
console.log('Gestor:', window.gestorInventario);

// Verificar validación
console.log('Validación:', validarProducto(producto));
```

## 📚 Recursos Adicionales

### Documentación

- [MDN Web Docs - Objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects)
- [Bootstrap 5 Documentation](https://getbootstrap.com/docs/5.0/)
- [LocalStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

### Tutoriales Relacionados

- JavaScript Object-Oriented Programming
- Bootstrap Grid System
- LocalStorage Best Practices
- JSON Manipulation

## 🏆 Criterios de Evaluación

### Funcionalidad (40%)

- CRUD completo implementado
- Validación de datos funcional
- Persistencia correcta
- Interfaz responsiva

### Código (30%)

- Uso correcto de objetos JavaScript
- Aplicación de destructuring
- Métodos bien implementados
- Código limpio y comentado

### Usabilidad (20%)

- Interfaz intuitiva
- Feedback visual apropiado
- Navegación fluida
- Responsive design

### Innovación (10%)

- Funcionalidades extra
- Mejoras en la interfaz
- Optimizaciones de rendimiento
- Características creativas

## 🎯 Desafíos Extras

### Nivel Básico

- [ ] Agregar más campos al producto
- [ ] Implementar más filtros
- [ ] Mejorar la validación
- [ ] Personalizar estilos

### Nivel Intermedio

- [ ] Implementar sistema de usuarios
- [ ] Agregar gráficos con Chart.js
- [ ] Crear sistema de notificaciones
- [ ] Implementar drag and drop

### Nivel Avanzado

- [ ] Integrar con API externa
- [ ] Implementar offline support
- [ ] Crear PWA (Progressive Web App)
- [ ] Agregar tests unitarios

## 📞 Soporte

### Si encuentras problemas:

1. Revisa la consola del navegador
2. Verifica que los archivos estén en la ubicación correcta
3. Asegúrate de que el navegador soporte ES6+
4. Consulta la documentación de Bootstrap
5. Busca ayuda del instructor

---

**¡Buen trabajo desarrollando tu sistema de inventario!** 🎉

_Este proyecto demuestra la aplicación práctica de objetos JavaScript en un contexto real de desarrollo web._
