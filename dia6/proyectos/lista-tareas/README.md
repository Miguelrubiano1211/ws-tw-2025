# Lista de Tareas - Proyecto Principal Día 6

## 📋 Descripción del Proyecto

Este proyecto es una **aplicación completa de gestión de tareas** que integra todos los conceptos aprendidos en el Día 6 sobre DOM y Eventos. Es una aplicación web interactiva que permite a los usuarios crear, editar, eliminar y organizar sus tareas de manera eficiente.

## 🎯 Objetivos del Proyecto

### **Objetivos Técnicos**

- Implementar manipulación avanzada del DOM
- Configurar sistema completo de eventos
- Crear validación robusta de formularios
- Desarrollar una interfaz de usuario interactiva
- Aplicar persistencia de datos local

### **Objetivos WorldSkills**

- Desarrollar una aplicación funcional completa
- Implementar buenas prácticas de código
- Crear una experiencia de usuario intuitiva
- Aplicar principios de accesibilidad web
- Optimizar rendimiento y responsividad

## 🏗️ Estructura del Proyecto

```
lista-tareas/
├── index.html          # Estructura principal
├── styles.css          # Estilos personalizados
├── script.js           # Lógica de la aplicación
├── README.md           # Este archivo
└── assets/             # Recursos adicionales
    ├── icons/          # Iconos personalizados
    └── images/         # Imágenes del proyecto
```

## 📋 Funcionalidades Principales

### **1. Gestión de Tareas**

- ✅ Crear nuevas tareas
- ✅ Editar tareas existentes
- ✅ Eliminar tareas
- ✅ Marcar tareas como completadas
- ✅ Duplicar tareas

### **2. Organización**

- ✅ Categorización por prioridad (Alta, Media, Baja)
- ✅ Filtrado por estado (Todas, Pendientes, Completadas)
- ✅ Ordenamiento por fecha o prioridad
- ✅ Búsqueda de tareas

### **3. Interfaz de Usuario**

- ✅ Diseño responsive
- ✅ Animaciones suaves
- ✅ Feedback visual inmediato
- ✅ Temas claro y oscuro
- ✅ Accesibilidad completa

### **4. Funcionalidades Avanzadas**

- ✅ Persistencia en localStorage
- ✅ Exportar/importar tareas
- ✅ Atajos de teclado
- ✅ Drag and drop
- ✅ Notificaciones

## 🚀 Instrucciones de Uso

### **Instalación**

1. Clona o descarga el proyecto
2. Abre `index.html` en tu navegador
3. ¡Comienza a usar la aplicación!

### **Uso Básico**

1. **Crear tarea**: Escribe en el campo de texto y presiona Enter
2. **Completar tarea**: Haz clic en el checkbox
3. **Editar tarea**: Haz doble clic en el texto de la tarea
4. **Eliminar tarea**: Haz clic en el botón de eliminar (🗑️)
5. **Filtrar**: Usa los botones de filtro en la parte superior

### **Funcionalidades Avanzadas**

- **Arrastrar y soltar**: Reordena las tareas arrastrándolas
- **Atajos de teclado**:
  - `Ctrl + N`: Nueva tarea
  - `Ctrl + F`: Buscar
  - `Ctrl + T`: Cambiar tema
  - `Escape`: Cerrar modales
- **Categorías**: Usa # seguido de una categoría (ej: #trabajo)
- **Prioridad**: Usa ! seguido de alta, media o baja

## 🎨 Características de Diseño

### **Colores y Temas**

- **Tema Claro**: Fondo blanco, texto oscuro
- **Tema Oscuro**: Fondo oscuro, texto claro
- **Colores de Prioridad**:
  - 🔴 Alta: Rojo (#dc3545)
  - 🟡 Media: Amarillo (#ffc107)
  - 🟢 Baja: Verde (#28a745)

### **Tipografía**

- **Fuente Principal**: Inter, sans-serif
- **Fuente Monospace**: Fira Code, monospace
- **Tamaños**: 14px (normal), 16px (títulos), 12px (subtítulos)

### **Espaciado**

- **Margen Base**: 16px
- **Padding Base**: 12px
- **Border Radius**: 8px
- **Sombras**: box-shadow con transparencia

## 🔧 Detalles Técnicos

### **Tecnologías Utilizadas**

- **HTML5**: Estructura semántica
- **CSS3**: Estilos y animaciones
- **JavaScript ES6+**: Lógica de aplicación
- **LocalStorage**: Persistencia de datos
- **CSS Grid/Flexbox**: Layout responsive

### **Patrones de Diseño**

- **Module Pattern**: Organización del código
- **Observer Pattern**: Manejo de eventos
- **MVC Pattern**: Separación de responsabilidades
- **Singleton Pattern**: Gestión de estado

### **Optimizaciones**

- **Delegación de eventos**: Mejor rendimiento
- **Debouncing**: Búsqueda optimizada
- **Lazy loading**: Carga progresiva
- **Minimización**: Código compacto

## 📊 Criterios de Evaluación

### **Funcionalidad (40%)**

- [ ] Crear tareas correctamente
- [ ] Editar tareas sin errores
- [ ] Eliminar tareas funciona
- [ ] Filtros operativos
- [ ] Persistencia funcional

### **Código (30%)**

- [ ] JavaScript bien estructurado
- [ ] Uso correcto de eventos
- [ ] Validación implementada
- [ ] Manejo de errores
- [ ] Código comentado

### **Interfaz (20%)**

- [ ] Diseño responsive
- [ ] Animaciones suaves
- [ ] Feedback visual
- [ ] Accesibilidad básica
- [ ] Usabilidad intuitiva

### **Innovación (10%)**

- [ ] Funcionalidades adicionales
- [ ] Mejoras creativas
- [ ] Optimizaciones
- [ ] Características únicas

## 🛠️ Desarrollo y Personalización

### **Agregar Nuevas Funcionalidades**

1. **Identificar necesidad**: ¿Qué funcionalidad falta?
2. **Planificar implementación**: ¿Cómo integrarla?
3. **Desarrollar código**: JavaScript, HTML, CSS
4. **Probar funcionalidad**: Verificar que funcione
5. **Documentar cambios**: Actualizar README

### **Ejemplo: Agregar Recordatorios**

```javascript
// 1. Añadir campo de fecha en el formulario
// 2. Modificar la estructura de datos
// 3. Implementar notificaciones
// 4. Actualizar interfaz
// 5. Persistir configuración
```

### **Personalización de Estilos**

1. **Colores**: Modifica las variables CSS en `:root`
2. **Fuentes**: Cambia `font-family` en `body`
3. **Animaciones**: Ajusta `transition` y `animation`
4. **Layout**: Modifica Grid/Flexbox en `.container`

## 🐛 Solución de Problemas

### **Errores Comunes**

1. **Tareas no se guardan**

   - Verificar que localStorage esté habilitado
   - Revisar función `guardarTareas()`

2. **Filtros no funcionan**

   - Verificar eventos de los botones
   - Revisar función `filtrarTareas()`

3. **Drag and drop no funciona**
   - Verificar atributo `draggable="true"`
   - Revisar event listeners de drag

### **Debugging**

```javascript
// Verificar datos guardados
console.log(localStorage.getItem('tareas'));

// Verificar estado de la aplicación
console.log(estadoApp);

// Verificar eventos activos
console.log(getEventListeners(document.querySelector('.tarea')));
```

## 🚀 Extensiones Sugeridas

### **Nivel Básico**

- [ ] Contador de tareas pendientes
- [ ] Indicador de progreso
- [ ] Sonidos de notificación
- [ ] Más temas de color

### **Nivel Intermedio**

- [ ] Sincronización con servidor
- [ ] Compartir tareas
- [ ] Recordatorios con fecha
- [ ] Estadísticas de productividad

### **Nivel Avanzado**

- [ ] Colaboración en tiempo real
- [ ] Integración con calendarios
- [ ] Análisis de patrones
- [ ] Aplicación móvil (PWA)

## 📚 Recursos de Aprendizaje

### **Documentación**

- [LocalStorage MDN](https://developer.mozilla.org/es/docs/Web/API/Window/localStorage)
- [Drag and Drop API](https://developer.mozilla.org/es/docs/Web/API/HTML_Drag_and_Drop_API)
- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)

### **Tutoriales**

- [JavaScript Event Handling](https://javascript.info/events)
- [Modern CSS Layouts](https://1linelayouts.glitch.me/)
- [Web Accessibility](https://web.dev/accessibility/)

### **Herramientas**

- [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools)
- [VS Code](https://code.visualstudio.com/)
- [Can I Use](https://caniuse.com/)

## 🏆 Desafíos WorldSkills

### **Desafío 1: Velocidad de Desarrollo**

- Implementar todas las funcionalidades en 2 horas
- Código limpio y bien estructurado
- Sin errores en consola

### **Desafío 2: Funcionalidades Avanzadas**

- Implementar 3 funcionalidades adicionales
- Optimizar rendimiento
- Accesibilidad completa

### **Desafío 3: Creatividad**

- Diseño único y atractivo
- Animaciones creativas
- Funcionalidades innovadoras

## 📝 Entregables

### **Archivos Requeridos**

- [ ] `index.html` funcional
- [ ] `styles.css` completo
- [ ] `script.js` implementado
- [ ] `README.md` actualizado

### **Documentación**

- [ ] Explicación de funcionalidades
- [ ] Instrucciones de uso
- [ ] Código comentado
- [ ] Pruebas realizadas

### **Demostración**

- [ ] Video de 2 minutos mostrando funcionalidades
- [ ] Explicación técnica de 5 minutos
- [ ] Respuesta a preguntas del instructor

## 🎯 Siguiente Nivel

Una vez completado este proyecto, estarás listo para:

- **Proyectos más complejos** con múltiples páginas
- **Frameworks JavaScript** como React
- **APIs REST** y comunicación con servidor
- **Bases de datos** y persistencia real
- **Deployment** y producción

¡Excelente trabajo desarrollando tu Lista de Tareas! 🎉

---

**Tiempo estimado**: 3-4 horas  
**Dificultad**: ⭐⭐⭐⭐ (Intermedia-Avanzada)  
**Última actualización**: Día 6 - DOM y Eventos
