# 🕒 Proyecto: Reloj Digital Interactivo

## 📋 Descripción

Desarrolla un reloj digital completo con funcionalidades avanzadas usando JavaScript ES6+, manipulación del DOM y técnicas modernas de programación.

## 🎯 Objetivos de Aprendizaje

- Aplicar métodos de Date() y formateo de tiempo
- Implementar intervalos y timeouts
- Practicar manipulación del DOM moderna
- Usar clases ES6 para organizar código
- Implementar persistencia con localStorage
- Crear interfaces interactivas

## 🚀 Funcionalidades Requeridas

### ⚡ Funcionalidades Básicas

1. **Reloj Digital**

   - Mostrar hora actual (HH:MM:SS)
   - Actualización en tiempo real
   - Formato 12h/24h

2. **Fecha Actual**

   - Mostrar fecha completa
   - Día de la semana
   - Mes en texto

3. **Cronómetro**
   - Iniciar/Pausar/Reiniciar
   - Mostrar tiempo transcurrido
   - Precision de milisegundos

### 🎨 Funcionalidades Avanzadas

4. **Temporizador**

   - Configurar tiempo personalizado
   - Cuenta regresiva
   - Alerta al finalizar

5. **Zonas Horarias**

   - Selector de zona horaria
   - Mostrar múltiples relojes
   - Persistir zona seleccionada

6. **Alarmas**
   - Crear múltiples alarmas
   - Repetir alarmas
   - Sonido de notificación

### 🎯 Funcionalidades de Competencia

7. **Temas Personalizables**

   - Múltiples temas visuales
   - Modo oscuro/claro
   - Colores personalizados

8. **Configuraciones**
   - Persistir configuraciones
   - Exportar/Importar configuraciones
   - Resetear a valores por defecto

## 📁 Estructura de Archivos

```
reloj-digital/
├── index.html          # Estructura HTML
├── styles.css          # Estilos CSS
├── script.js           # Lógica principal
├── modules/
│   ├── reloj.js        # Clase Reloj
│   ├── cronometro.js   # Clase Cronómetro
│   ├── temporizador.js # Clase Temporizador
│   └── alarma.js       # Clase Alarma
└── README.md           # Este archivo
```

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Estilos y animaciones
- **JavaScript ES6+**: Lógica de aplicación
- **LocalStorage**: Persistencia de datos
- **Date API**: Manejo de fechas y tiempos
- **Notification API**: Notificaciones del navegador

## 🚀 Instrucciones de Desarrollo

### Paso 1: Configuración Inicial

```bash
# Abrir en VS Code
code .

# Crear estructura de archivos
# Los archivos base ya están creados
```

### Paso 2: Implementación Básica

1. Crear HTML básico con secciones principales
2. Implementar clase Reloj con tiempo actual
3. Agregar estilos CSS básicos
4. Probar funcionalidad básica

### Paso 3: Funcionalidades Avanzadas

1. Implementar cronómetro con precisión
2. Agregar temporizador con configuración
3. Crear sistema de alarmas
4. Implementar zonas horarias

### Paso 4: Perfeccionamiento

1. Agregar temas personalizables
2. Implementar configuraciones persistentes
3. Optimizar rendimiento
4. Probar en diferentes navegadores

## 🧪 Criterios de Evaluación

### Funcionalidad (40%)

- ✅ Reloj funciona correctamente
- ✅ Cronómetro preciso
- ✅ Temporizador configurable
- ✅ Alarmas múltiples
- ✅ Zonas horarias

### Código (30%)

- ✅ Uso de clases ES6
- ✅ Código modular
- ✅ Manejo de errores
- ✅ Código limpio y comentado
- ✅ Mejores prácticas

### Interfaz (20%)

- ✅ Diseño atractivo
- ✅ Responsive
- ✅ Temas personalizables
- ✅ Animaciones suaves
- ✅ Usabilidad

### Funcionalidades Extra (10%)

- ✅ Notificaciones del navegador
- ✅ Exportar/Importar configuraciones
- ✅ Sonidos personalizados
- ✅ Accesibilidad
- ✅ PWA features

## 💡 Tips para WorldSkills

1. **Modularidad**: Divide el código en clases separadas
2. **Precisión**: Usa requestAnimationFrame para animaciones
3. **Persistencia**: Guarda configuraciones en localStorage
4. **UX**: Agrega feedback visual para todas las acciones
5. **Performance**: Optimiza actualizaciones del DOM
6. **Accesibilidad**: Añade soporte para lectores de pantalla

## 🔧 Funciones Útiles

### Formateo de Tiempo

```javascript
const formatTime = time => {
  return time.toString().padStart(2, '0');
};

const formatDate = date => {
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
```

### Manejo de Intervalos

```javascript
class IntervalManager {
  constructor() {
    this.intervals = new Map();
  }

  set(id, callback, delay) {
    this.clear(id);
    this.intervals.set(id, setInterval(callback, delay));
  }

  clear(id) {
    if (this.intervals.has(id)) {
      clearInterval(this.intervals.get(id));
      this.intervals.delete(id);
    }
  }
}
```

## 🎯 Desafíos Adicionales

1. **Pomodoro Timer**: Integrar técnica Pomodoro
2. **Productividad**: Tracking de tiempo en tareas
3. **Clima**: Mostrar clima actual junto a la hora
4. **Eventos**: Calendario de eventos con recordatorios
5. **Estadísticas**: Análisis de uso del cronómetro

## 🔗 Recursos Adicionales

- [MDN Date API](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Date)
- [Notification API](https://developer.mozilla.org/es/docs/Web/API/Notification)
- [LocalStorage Guide](https://developer.mozilla.org/es/docs/Web/API/Window/localStorage)
- [CSS Animation Tips](https://developer.mozilla.org/es/docs/Web/CSS/CSS_Animations)

¡Demuestra tu dominio del JavaScript moderno creando un reloj digital completo y funcional! 🚀
