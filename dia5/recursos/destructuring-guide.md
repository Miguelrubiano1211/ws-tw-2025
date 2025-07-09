# Guía Completa de Destructuring en JavaScript

## 🎯 ¿Qué es Destructuring?

Destructuring es una característica de ES6 que permite extraer valores de arrays y objetos de forma más concisa y legible. Es especialmente útil cuando trabajamos con objetos complejos en sistemas como inventarios.

## 📦 Destructuring de Objetos

### Sintaxis Básica
```javascript
const producto = {
  nombre: 'Laptop',
  precio: 1000000,
  categoria: 'Electrónicos',
  stock: 5
};

// Método tradicional
const nombre = producto.nombre;
const precio = producto.precio;

// Con destructuring
const { nombre, precio } = producto;
console.log(nombre); // 'Laptop'
console.log(precio); // 1000000
```

### Asignación con Nombres Diferentes
```javascript
const producto = {
  nombre: 'Tablet',
  precio: 500000,
  categoria: 'Electrónicos'
};

// Cambiar nombres de variables
const { nombre: nombreProducto, precio: precioVenta } = producto;
console.log(nombreProducto); // 'Tablet'
console.log(precioVenta); // 500000
```

### Valores por Defecto
```javascript
const producto = {
  nombre: 'Smartphone',
  precio: 800000
  // stock no está definido
};

// Asignar valores por defecto
const { nombre, precio, stock = 0, activo = true } = producto;
console.log(stock); // 0
console.log(activo); // true
```

### Destructuring Anidado
```javascript
const producto = {
  nombre: 'Laptop',
  precio: 1000000,
  especificaciones: {
    procesador: 'Intel Core i7',
    ram: '16GB',
    almacenamiento: '512GB SSD'
  },
  proveedor: {
    nombre: 'TechCorp',
    ciudad: 'Bogotá'
  }
};

// Destructuring anidado
const {
  nombre,
  especificaciones: { procesador, ram },
  proveedor: { nombre: nombreProveedor }
} = producto;

console.log(procesador); // 'Intel Core i7'
console.log(ram); // '16GB'
console.log(nombreProveedor); // 'TechCorp'
```

### Destructuring con Rest Operator
```javascript
const producto = {
  id: 'prod_001',
  nombre: 'Smartphone',
  precio: 800000,
  stock: 15,
  categoria: 'Electrónicos',
  proveedor: 'Samsung'
};

// Extraer algunas propiedades y agrupar el resto
const { id, nombre, ...detalles } = producto;
console.log(id); // 'prod_001'
console.log(nombre); // 'Smartphone'
console.log(detalles); 
// { precio: 800000, stock: 15, categoria: 'Electrónicos', proveedor: 'Samsung' }
```

## 🔄 Destructuring en Funciones

### Parámetros de Función
```javascript
// Función que recibe objeto completo
function crearProducto(datos) {
  const nombre = datos.nombre;
  const precio = datos.precio;
  const categoria = datos.categoria;
  // ...
}

// Con destructuring en parámetros
function crearProducto({ nombre, precio, categoria, stock = 0 }) {
  console.log(`Creando: ${nombre} - $${precio}`);
  return {
    id: Date.now().toString(),
    nombre,
    precio,
    categoria,
    stock,
    activo: true
  };
}

// Uso
const nuevoProducto = crearProducto({
  nombre: 'Tablet',
  precio: 500000,
  categoria: 'Electrónicos'
});
```

### Destructuring con Parámetros por Defecto
```javascript
function actualizarProducto(id, { 
  nombre = 'Sin nombre', 
  precio = 0, 
  stock = 0,
  activo = true 
} = {}) {
  // Si no se pasa el segundo parámetro, usa objeto vacío
  return {
    id,
    nombre,
    precio,
    stock,
    activo,
    fechaActualizacion: new Date()
  };
}

// Uso
const producto1 = actualizarProducto('prod_001', { nombre: 'Laptop' });
const producto2 = actualizarProducto('prod_002'); // Usa valores por defecto
```

### Retorno de Múltiples Valores
```javascript
function analizarInventario(productos) {
  const total = productos.length;
  const activos = productos.filter(p => p.activo).length;
  const valor = productos.reduce((sum, p) => sum + (p.precio * p.stock), 0);
  
  return { total, activos, valor };
}

// Destructuring del retorno
const { total, activos, valor } = analizarInventario(inventario);
console.log(`Total: ${total}, Activos: ${activos}, Valor: $${valor}`);
```

## 📋 Destructuring de Arrays

### Sintaxis Básica
```javascript
const categorias = ['Electrónicos', 'Ropa', 'Hogar', 'Deportes'];

// Método tradicional
const primera = categorias[0];
const segunda = categorias[1];

// Con destructuring
const [primera, segunda] = categorias;
console.log(primera); // 'Electrónicos'
console.log(segunda); // 'Ropa'
```

### Saltar Elementos
```javascript
const precios = [100000, 200000, 300000, 400000];

// Saltear elementos con comas
const [primero, , tercero] = precios;
console.log(primero); // 100000
console.log(tercero); // 300000
```

### Intercambiar Variables
```javascript
let categoria1 = 'Electrónicos';
let categoria2 = 'Ropa';

// Intercambiar valores sin variable temporal
[categoria1, categoria2] = [categoria2, categoria1];
console.log(categoria1); // 'Ropa'
console.log(categoria2); // 'Electrónicos'
```

### Destructuring con Rest
```javascript
const productos = ['Laptop', 'Tablet', 'Smartphone', 'Smartwatch'];

const [principal, ...otros] = productos;
console.log(principal); // 'Laptop'
console.log(otros); // ['Tablet', 'Smartphone', 'Smartwatch']
```

## 🔧 Ejemplos Prácticos para Sistema de Inventario

### 1. Procesamiento de Formularios
```javascript
function procesarFormularioProducto(formData) {
  const {
    nombre,
    precio,
    categoria,
    stock = 0,
    descripcion = '',
    proveedor = 'Sin especificar'
  } = formData;
  
  // Validaciones
  if (!nombre || nombre.trim().length < 2) {
    throw new Error('Nombre inválido');
  }
  
  if (!precio || precio <= 0) {
    throw new Error('Precio inválido');
  }
  
  return {
    id: generarId(),
    nombre: nombre.trim(),
    precio: parseFloat(precio),
    categoria,
    stock: parseInt(stock),
    descripcion: descripcion.trim(),
    proveedor: proveedor.trim(),
    fechaCreacion: new Date().toISOString(),
    activo: true
  };
}
```

### 2. Extracción de Datos de API
```javascript
async function obtenerProductosDesdeAPI() {
  const response = await fetch('/api/productos');
  const { data, metadata, pagination } = await response.json();
  
  // Destructuring del metadata
  const { total, totalPages, currentPage } = pagination;
  
  // Procesar productos
  const productos = data.map(({
    id,
    nombre,
    precio,
    stock,
    categoria,
    proveedor: { nombre: nombreProveedor } = {}
  }) => ({
    id,
    nombre,
    precio,
    stock,
    categoria,
    proveedor: nombreProveedor || 'Sin proveedor'
  }));
  
  return { productos, total, totalPages, currentPage };
}
```

### 3. Configuración de Componentes
```javascript
function crearComponenteProducto({
  producto,
  mostrarPrecio = true,
  mostrarStock = true,
  editable = false,
  onEdit = () => {},
  onDelete = () => {}
}) {
  const { nombre, precio, stock, categoria, imagen } = producto;
  
  return {
    render() {
      return `
        <div class="producto-card">
          <h3>${nombre}</h3>
          <p>Categoría: ${categoria}</p>
          ${mostrarPrecio ? `<p>Precio: $${precio}</p>` : ''}
          ${mostrarStock ? `<p>Stock: ${stock}</p>` : ''}
          ${editable ? `
            <button onclick="onEdit('${producto.id}')">Editar</button>
            <button onclick="onDelete('${producto.id}')">Eliminar</button>
          ` : ''}
        </div>
      `;
    }
  };
}
```

### 4. Filtrado y Transformación
```javascript
function filtrarYTransformarProductos(productos, filtros) {
  const {
    categoria = null,
    precioMin = 0,
    precioMax = Infinity,
    soloActivos = false,
    ordenPor = 'nombre'
  } = filtros;
  
  return productos
    .filter(({ categoria: cat, precio, activo }) => {
      if (categoria && cat !== categoria) return false;
      if (precio < precioMin || precio > precioMax) return false;
      if (soloActivos && !activo) return false;
      return true;
    })
    .sort((a, b) => {
      const [valorA, valorB] = [a[ordenPor], b[ordenPor]];
      return typeof valorA === 'string' 
        ? valorA.localeCompare(valorB)
        : valorA - valorB;
    })
    .map(({ nombre, precio, stock, categoria }) => ({
      nombre,
      precio,
      stock,
      categoria,
      disponible: stock > 0
    }));
}
```

### 5. Sistema de Notificaciones
```javascript
function crearNotificacion({
  tipo = 'info',
  titulo = 'Notificación',
  mensaje,
  duracion = 3000,
  acciones = []
}) {
  const tiposValidos = ['info', 'success', 'warning', 'error'];
  const tipoFinal = tiposValidos.includes(tipo) ? tipo : 'info';
  
  const notification = {
    id: Date.now(),
    tipo: tipoFinal,
    titulo,
    mensaje,
    timestamp: new Date(),
    
    mostrar() {
      const notificationElement = document.createElement('div');
      notificationElement.className = `notification ${tipoFinal}`;
      notificationElement.innerHTML = `
        <h4>${titulo}</h4>
        <p>${mensaje}</p>
        <div class="actions">
          ${acciones.map(({ texto, callback }) => 
            `<button onclick="${callback}">${texto}</button>`
          ).join('')}
        </div>
      `;
      
      document.body.appendChild(notificationElement);
      
      setTimeout(() => {
        notificationElement.remove();
      }, duracion);
    }
  };
  
  return notification;
}

// Uso
const notif = crearNotificacion({
  tipo: 'success',
  titulo: 'Producto Guardado',
  mensaje: 'El producto se ha guardado exitosamente',
  acciones: [
    { texto: 'Ver', callback: 'verProducto()' },
    { texto: 'Cerrar', callback: 'cerrarNotificacion()' }
  ]
});
```

## 📊 Destructuring Avanzado

### Destructuring Condicional
```javascript
function procesarProducto(producto) {
  const { 
    nombre, 
    precio, 
    stock,
    especificaciones: specs = {},
    proveedor = null
  } = producto;
  
  // Destructuring condicional del proveedor
  const proveedorInfo = proveedor ? {
    nombre: proveedor.nombre,
    ciudad: proveedor.ciudad,
    contacto: proveedor.contacto
  } : {
    nombre: 'Sin proveedor',
    ciudad: 'N/A',
    contacto: 'N/A'
  };
  
  return {
    nombre,
    precio,
    stock,
    procesador: specs.procesador || 'N/A',
    memoria: specs.memoria || 'N/A',
    ...proveedorInfo
  };
}
```

### Destructuring con Computed Properties
```javascript
function extraerPropiedadesDinamicas(producto, propiedades) {
  const resultado = {};
  
  propiedades.forEach(prop => {
    const { [prop]: valor = 'N/A' } = producto;
    resultado[prop] = valor;
  });
  
  return resultado;
}

// Uso
const producto = {
  nombre: 'Laptop',
  precio: 1000000,
  stock: 5,
  categoria: 'Electrónicos'
};

const propiedadesDeseadas = ['nombre', 'precio', 'marca']; // 'marca' no existe
const resultado = extraerPropiedadesDinamicas(producto, propiedadesDeseadas);
// { nombre: 'Laptop', precio: 1000000, marca: 'N/A' }
```

### Destructuring en Loops
```javascript
const productos = [
  { id: 1, nombre: 'Laptop', precio: 1000000, stock: 5 },
  { id: 2, nombre: 'Tablet', precio: 500000, stock: 10 },
  { id: 3, nombre: 'Smartphone', precio: 800000, stock: 3 }
];

// Destructuring en forEach
productos.forEach(({ nombre, precio, stock }) => {
  console.log(`${nombre}: $${precio} (Stock: ${stock})`);
});

// Destructuring en for...of
for (const { nombre, precio, stock } of productos) {
  if (stock < 5) {
    console.log(`⚠️ Stock bajo: ${nombre}`);
  }
}

// Destructuring en map
const resumen = productos.map(({ nombre, precio, stock }) => ({
  producto: nombre,
  valor: precio * stock,
  disponible: stock > 0
}));
```

## 💡 Mejores Prácticas

### 1. Usa Nombres Descriptivos
```javascript
// ❌ Poco claro
const { n, p, s } = producto;

// ✅ Claro y descriptivo
const { nombre, precio, stock } = producto;
```

### 2. Proporciona Valores por Defecto Apropiados
```javascript
// ❌ Valores por defecto inconsistentes
const { nombre = '', precio = 0, stock = null } = producto;

// ✅ Valores por defecto consistentes
const { nombre = 'Sin nombre', precio = 0, stock = 0 } = producto;
```

### 3. Evita Destructuring Muy Profundo
```javascript
// ❌ Muy profundo, difícil de leer
const { especificaciones: { hardware: { cpu: { marca } } } } = producto;

// ✅ Más legible
const { especificaciones } = producto;
const { hardware } = especificaciones || {};
const { cpu } = hardware || {};
const { marca } = cpu || {};
```

### 4. Combina con Validación
```javascript
function actualizarProducto(id, updates) {
  const {
    nombre,
    precio,
    stock,
    categoria,
    ...otrosUpdates
  } = updates;
  
  // Validar datos extraídos
  if (nombre && typeof nombre !== 'string') {
    throw new Error('Nombre debe ser string');
  }
  
  if (precio && (typeof precio !== 'number' || precio <= 0)) {
    throw new Error('Precio debe ser número positivo');
  }
  
  // Aplicar actualizaciones
  return {
    id,
    nombre,
    precio,
    stock,
    categoria,
    ...otrosUpdates,
    fechaActualizacion: new Date()
  };
}
```

## 🎯 Ejercicios Prácticos

1. **Extractor de Datos**: Crea una función que extraiga información específica de productos complejos
2. **Conversor de Formatos**: Transforma objetos de productos entre diferentes formatos usando destructuring
3. **Validador de Esquemas**: Valida que los objetos tengan las propiedades correctas usando destructuring
4. **Generador de Reportes**: Crea reportes extrayendo datos específicos de arrays de productos
5. **Sistema de Configuración**: Implementa un sistema que permita configurar componentes usando destructuring

---

*Esta guía forma parte del entrenamiento WorldSkills - Día 5: Objetos y Propiedades*
