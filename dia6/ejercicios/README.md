# Ejercicios Día 6: DOM y Eventos

## 📋 Descripción

Este directorio contiene los ejercicios prácticos para el Día 6 del entrenamiento WorldSkills React/Express.js, enfocados en **DOM y Eventos**. Los ejercicios están diseñados para desarrollar competencias prácticas en manipulación del DOM, manejo de eventos y validación de formularios.

## 🗂️ Estructura de Ejercicios

### **Ejercicio 1: Selección de elementos del DOM**

- **Archivo**: `01-seleccion-dom.js`
- **Dificultad**: Básica
- **Tiempo**: 15 minutos
- **Conceptos**:
  - `getElementById()`, `getElementsByClassName()`, `getElementsByTagName()`
  - `querySelector()`, `querySelectorAll()`
  - Selecciones específicas con CSS selectors
  - Validación de existencia de elementos

### **Ejercicio 2: Manipulación de contenido y atributos**

- **Archivo**: `02-manipulacion-contenido.js`
- **Dificultad**: Básica-Intermedia
- **Tiempo**: 20 minutos
- **Conceptos**:
  - `textContent`, `innerHTML`
  - `setAttribute()`, `getAttribute()`
  - Manipulación de clases con `classList`
  - Trabajo con data attributes

### **Ejercicio 3: Manipulación de estilos CSS**

- **Archivo**: `03-estilos-css.js`
- **Dificultad**: Intermedia
- **Tiempo**: 25 minutos
- **Conceptos**:
  - Estilos inline con `style`
  - CSS Custom Properties (variables)
  - `getComputedStyle()`
  - Animaciones CSS dinámicas

### **Ejercicio 4: Creación y eliminación de elementos**

- **Archivo**: `04-creacion-eliminacion.js`
- **Dificultad**: Intermedia
- **Tiempo**: 30 minutos
- **Conceptos**:
  - `createElement()`, `appendChild()`, `removeChild()`
  - Creación de elementos complejos
  - Clonación de elementos
  - Generación dinámica de formularios, tablas y listas

### **Ejercicio 5: Eventos básicos del DOM**

- **Archivo**: `05-eventos-basicos.js`
- **Dificultad**: Básica-Intermedia
- **Tiempo**: 25 minutos
- **Conceptos**:
  - Eventos de mouse (click, dblclick, hover)
  - Eventos de teclado (keydown, keyup)
  - Eventos de formulario (submit, change, focus, blur)
  - Eventos de ventana (load, resize, scroll)

### **Ejercicio 6: Eventos avanzados y propagación**

- **Archivo**: `06-eventos-avanzados.js`
- **Dificultad**: Intermedia-Avanzada
- **Tiempo**: 35 minutos
- **Conceptos**:
  - Propagación de eventos (bubbling y capturing)
  - Delegación de eventos
  - Eventos personalizados
  - Eventos touch y media
  - Intersection Observer

### **Ejercicio 7: Validación de formularios**

- **Archivo**: `07-validacion-formularios.js`
- **Dificultad**: Intermedia-Avanzada
- **Tiempo**: 40 minutos
- **Conceptos**:
  - Validación en tiempo real
  - Patrones de validación (regex)
  - Mensajes de error dinámicos
  - Validación personalizada
  - Validación de archivos

## 🚀 Cómo Ejecutar los Ejercicios

### **Opción 1: Archivo HTML de Práctica**

Crea un archivo `index.html` en el directorio del día:

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0" />
    <title>Día 6: DOM y Eventos</title>
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
      rel="stylesheet" />
    <style>
      body {
        padding: 20px;
        font-family: Arial, sans-serif;
      }
      .container {
        max-width: 1200px;
        margin: 0 auto;
      }
      .ejercicio {
        margin-bottom: 30px;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 8px;
      }
      .item-lista {
        padding: 10px;
        margin: 5px 0;
        background: #f8f9fa;
        border-radius: 4px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .btn-eliminar,
      .btn-editar {
        margin-left: 10px;
        padding: 5px 10px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      .btn-eliminar {
        background: #dc3545;
        color: white;
      }
      .btn-editar {
        background: #ffc107;
        color: black;
      }
      .arrastrable {
        cursor: move;
        padding: 10px;
        margin: 5px;
        background: #e9ecef;
        border-radius: 4px;
      }
      .zona-destino {
        min-height: 100px;
        padding: 20px;
        border: 2px dashed #6c757d;
        border-radius: 8px;
        margin: 10px 0;
      }
      .observar-interseccion {
        height: 200px;
        margin: 20px 0;
        background: #f8f9fa;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
      }
      .navegable {
        padding: 10px;
        margin: 5px;
        background: #e9ecef;
        border-radius: 4px;
        cursor: pointer;
      }
      .mensaje-error {
        color: #dc3545;
        font-size: 0.875rem;
        margin-top: 0.25rem;
      }
      .is-invalid {
        border-color: #dc3545;
      }
      .is-valid {
        border-color: #28a745;
      }
      #fortaleza-password {
        height: 20px;
        background: #e9ecef;
        margin-top: 10px;
        border-radius: 10px;
        text-align: center;
        color: white;
        font-size: 12px;
        line-height: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Día 6: DOM y Eventos</h1>

      <!-- Ejercicio 1: Selección -->
      <div class="ejercicio">
        <h2 id="titulo">Ejercicio 1: Selección de Elementos</h2>
        <button class="btn btn-primary">Botón 1</button>
        <button class="btn btn-secondary">Botón 2</button>
        <p>Párrafo de ejemplo</p>
      </div>

      <!-- Ejercicio 2: Manipulación -->
      <div class="ejercicio">
        <h2>Ejercicio 2: Manipulación de Contenido</h2>
        <div id="contenido">
          <p>Contenido original</p>
        </div>
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Tarjeta de Ejemplo</h5>
            <p class="card-text">Contenido de la tarjeta</p>
          </div>
        </div>
      </div>

      <!-- Ejercicio 3: Estilos -->
      <div class="ejercicio">
        <h2>Ejercicio 3: Estilos CSS</h2>
        <div class="card">
          <div class="card-body">
            <p>Elemento para aplicar estilos</p>
          </div>
        </div>
      </div>

      <!-- Ejercicio 4: Creación -->
      <div class="ejercicio">
        <h2>Ejercicio 4: Creación de Elementos</h2>
        <div id="contenedor-dinamico"></div>
      </div>

      <!-- Ejercicio 5: Eventos Básicos -->
      <div class="ejercicio">
        <h2>Ejercicio 5: Eventos Básicos</h2>
        <button
          id="btn-click"
          class="btn btn-primary">
          Click
        </button>
        <button
          id="btn-doble-click"
          class="btn btn-secondary">
          Doble Click
        </button>
        <button
          id="btn-presionar"
          class="btn btn-info">
          Presionar
        </button>
        <div
          class="tarjeta-hover"
          style="padding: 20px; border: 1px solid #ddd; margin: 10px 0;">
          Pasa el mouse sobre mí
        </div>
        <input
          type="text"
          id="input-teclado"
          placeholder="Escribe aquí"
          class="form-control" />
        <div id="contador-caracteres">Caracteres: 0</div>
        <button
          id="btn-contador"
          class="btn btn-success">
          Contador
        </button>
        <span id="display-contador">0</span>
        <button
          id="btn-reset-contador"
          class="btn btn-warning">
          Reset
        </button>
        <div class="navegable">Elemento navegable 1</div>
        <div class="navegable">Elemento navegable 2</div>
        <div class="navegable">Elemento navegable 3</div>
      </div>

      <!-- Ejercicio 6: Eventos Avanzados -->
      <div class="ejercicio">
        <h2>Ejercicio 6: Eventos Avanzados</h2>
        <div
          class="contenedor-externo"
          style="padding: 20px; border: 2px solid #007bff;">
          <div
            class="contenedor-interno"
            style="padding: 15px; border: 2px solid #28a745;">
            <button
              id="btn-propagacion"
              class="btn btn-danger">
              Propagación
            </button>
          </div>
        </div>
        <button
          id="btn-limpiar-log"
          class="btn btn-secondary">
          Limpiar Log
        </button>
        <div
          id="info-propagacion"
          style="margin-top: 10px; font-family: monospace;"></div>

        <div
          id="lista-dinamica"
          style="margin-top: 20px;"></div>

        <div class="mt-4">
          <button
            data-evento="usuarioAutenticado"
            class="btn btn-success">
            Simular Login
          </button>
          <button
            data-evento="datosActualizados"
            class="btn btn-info">
            Simular Actualización
          </button>
          <button
            data-evento="errorRed"
            class="btn btn-danger">
            Simular Error
          </button>
        </div>
        <div
          id="info-usuario"
          style="margin-top: 10px;"></div>

        <div class="mt-4">
          <h4>Drag and Drop</h4>
          <div
            class="arrastrable"
            id="elemento1"
            draggable="true">
            Elemento Arrastrable 1
          </div>
          <div
            class="arrastrable"
            id="elemento2"
            draggable="true">
            Elemento Arrastrable 2
          </div>
          <div
            class="zona-destino"
            id="zona1">
            Zona de Destino 1
          </div>
          <div
            class="zona-destino"
            id="zona2">
            Zona de Destino 2
          </div>
        </div>

        <div class="mt-4">
          <h4>Área de Gestos</h4>
          <div
            id="area-gestos"
            style="height: 200px; background: #f8f9fa; border: 1px solid #ddd; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
            Haz gestos con el mouse aquí
          </div>
        </div>

        <div class="mt-4">
          <h4>Elementos Observados</h4>
          <div
            class="observar-interseccion"
            id="elemento-obs-1">
            Elemento Observado 1
          </div>
          <div
            class="observar-interseccion"
            id="elemento-obs-2">
            Elemento Observado 2
          </div>
          <div
            class="observar-interseccion"
            id="elemento-obs-3">
            Elemento Observado 3
          </div>
        </div>
      </div>

      <!-- Ejercicio 7: Validación -->
      <div class="ejercicio">
        <h2>Ejercicio 7: Validación de Formularios</h2>

        <form
          id="form-registro"
          class="needs-validation"
          novalidate>
          <div class="mb-3">
            <label
              for="nombre"
              class="form-label"
              >Nombre</label
            >
            <input
              type="text"
              class="form-control"
              id="nombre"
              name="nombre"
              required />
          </div>

          <div class="mb-3">
            <label
              for="email"
              class="form-label"
              >Email</label
            >
            <input
              type="email"
              class="form-control"
              id="email"
              name="email"
              required />
          </div>

          <div class="mb-3">
            <label
              for="telefono"
              class="form-label"
              >Teléfono</label
            >
            <input
              type="tel"
              class="form-control"
              id="telefono"
              name="telefono"
              required />
          </div>

          <div class="mb-3">
            <label
              for="edad"
              class="form-label"
              >Edad</label
            >
            <input
              type="number"
              class="form-control"
              id="edad"
              name="edad"
              min="18"
              max="120"
              required />
          </div>

          <div class="mb-3">
            <label
              for="password"
              class="form-label"
              >Contraseña</label
            >
            <input
              type="password"
              class="form-control"
              id="password"
              name="password"
              required />
            <div id="fortaleza-password"></div>
          </div>

          <div class="mb-3">
            <label
              for="confirmar-password"
              class="form-label"
              >Confirmar Contraseña</label
            >
            <input
              type="password"
              class="form-control"
              id="confirmar-password"
              name="confirmar-password"
              data-validacion="confirmar-password"
              required />
          </div>

          <div class="mb-3">
            <label
              for="cedula"
              class="form-label"
              >Cédula</label
            >
            <input
              type="text"
              class="form-control"
              id="cedula"
              name="cedula"
              data-validacion="cedula"
              required />
          </div>

          <button
            type="submit"
            class="btn btn-primary">
            Registrar
          </button>
          <button
            type="reset"
            class="btn btn-secondary">
            Limpiar
          </button>
        </form>
      </div>

      <div
        id="info-tamaño"
        style="position: fixed; top: 10px; right: 10px; background: #007bff; color: white; padding: 5px 10px; border-radius: 4px;"></div>

      <div
        class="barra-progreso"
        style="position: fixed; top: 0; left: 0; height: 3px; background: #007bff; z-index: 9999; width: 0%;"></div>
    </div>

    <!-- Scripts de ejercicios -->
    <script src="ejercicios/01-seleccion-dom.js"></script>
    <script src="ejercicios/02-manipulacion-contenido.js"></script>
    <script src="ejercicios/03-estilos-css.js"></script>
    <script src="ejercicios/04-creacion-eliminacion.js"></script>
    <script src="ejercicios/05-eventos-basicos.js"></script>
    <script src="ejercicios/06-eventos-avanzados.js"></script>
    <script src="ejercicios/07-validacion-formularios.js"></script>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
  </body>
</html>
```

### **Opción 2: Ejecutar Ejercicios Individuales**

1. **Crear archivo HTML para cada ejercicio**:

```bash
# Ejemplo para ejercicio 1
echo '<!DOCTYPE html>
<html>
<head>
    <title>Ejercicio 1</title>
</head>
<body>
    <h1 id="titulo">Ejercicio DOM</h1>
    <button class="btn">Botón</button>
    <script src="01-seleccion-dom.js"></script>
</body>
</html>' > ejercicio1.html
```

2. **Abrir en navegador**:

```bash
# Opción A: Con Live Server (VS Code)
# Instalar extensión Live Server y usar clic derecho > "Open with Live Server"

# Opción B: Con navegador directamente
open ejercicio1.html  # macOS
xdg-open ejercicio1.html  # Linux
start ejercicio1.html  # Windows
```

### **Opción 3: Ejecutar con Node.js (para algunos ejercicios)**

```bash
# Instalar jsdom para simulación de DOM
npm install jsdom

# Crear archivo de prueba
node ejercicio-test.js
```

## 🎯 Objetivos de Aprendizaje

### **Competencias Técnicas**

- ✅ Seleccionar elementos DOM eficientemente
- ✅ Manipular contenido y atributos dinámicamente
- ✅ Aplicar estilos CSS desde JavaScript
- ✅ Crear y eliminar elementos DOM
- ✅ Manejar eventos básicos y avanzados
- ✅ Implementar validación de formularios
- ✅ Usar propagación y delegación de eventos

### **Competencias WorldSkills**

- 🏆 Velocidad en manipulación DOM
- 🏆 Código limpio y mantenible
- 🏆 Manejo robusto de eventos
- 🏆 Validación completa de formularios
- 🏆 Optimización de rendimiento
- 🏆 Accesibilidad web

## 📊 Criterios de Evaluación

### **Funcionalidad (40%)**

- Selección correcta de elementos
- Manipulación efectiva del DOM
- Eventos funcionando correctamente
- Validación completa de formularios

### **Código (30%)**

- Sintaxis JavaScript correcta
- Uso de mejores prácticas
- Código limpio y legible
- Comentarios informativos

### **Experiencia de Usuario (20%)**

- Interfaz responsive
- Mensajes de error claros
- Feedback visual apropiado
- Accesibilidad básica

### **Rendimiento (10%)**

- Optimización de selectors
- Delegación de eventos
- Validación eficiente
- Uso de memoria adecuado

## 📚 Recursos Adicionales

### **Documentación**

- [MDN DOM API](https://developer.mozilla.org/es/docs/Web/API/Document_Object_Model)
- [MDN Event Reference](https://developer.mozilla.org/es/docs/Web/Events)
- [HTML5 Form Validation](https://developer.mozilla.org/es/docs/Learn/Forms/Form_validation)

### **Herramientas**

- Chrome DevTools (Elements, Console)
- VS Code con extensión Live Server
- Bootstrap para estilos rápidos

### **Ejemplos Avanzados**

- Intersection Observer API
- Mutation Observer API
- Custom Events
- Touch Events para móviles

## 🚨 Solución de Problemas

### **Errores Comunes**

1. **"Cannot read property of null"**

   - Verificar que el elemento existe antes de manipularlo
   - Usar `if (elemento)` antes de acceder a propiedades

2. **"addEventListener is not a function"**

   - Verificar que el elemento sea un nodo DOM válido
   - Usar `querySelector` correctamente

3. **"Uncaught TypeError: Cannot set property"**
   - Verificar permisos de escritura del elemento
   - Usar propiedades correctas (`textContent` vs `innerHTML`)

### **Debugging Tips**

```javascript
// Verificar elemento seleccionado
console.log(document.querySelector('#mi-elemento'));

// Verificar eventos activos
console.log(getEventListeners(document.querySelector('#mi-elemento')));

// Verificar estilos computados
console.log(window.getComputedStyle(elemento));
```

## 📋 Checklist de Finalización

- [ ] Todos los ejercicios ejecutan sin errores
- [ ] Selección de elementos funciona correctamente
- [ ] Manipulación de contenido y atributos implementada
- [ ] Estilos CSS aplicados dinámicamente
- [ ] Elementos creados y eliminados correctamente
- [ ] Eventos básicos configurados
- [ ] Eventos avanzados y propagación implementados
- [ ] Validación de formularios completamente funcional
- [ ] Código comentado y documentado
- [ ] Pruebas realizadas en diferentes navegadores

## 🎯 Próximos Pasos

Una vez completados estos ejercicios, estarás listo para:

- **Día 7**: Proyectos prácticos integradores
- **Día 8**: Introducción a frameworks (React básico)
- **Día 9**: APIs y comunicación con servidor
- **Día 10**: Proyectos WorldSkills reales

¡Excelente trabajo completando los ejercicios de DOM y Eventos! 🎉
