# 🔢 Proyecto: Contador CSS Avanzado

## 🎯 Objetivo

Crear un contador interactivo usando CSS avanzado con validaciones y seguridad frontend, implementando técnicas de CSS moderno, animaciones y JavaScript seguro.

## 📋 Descripción del Proyecto

### **Funcionalidades Requeridas**

1. **Contador Visual**: Incrementar/decrementar con animaciones CSS
2. **Validaciones**: Límites mínimos y máximos configurables
3. **Persistencia**: Guardar estado en localStorage de forma segura
4. **Animaciones**: Transiciones suaves y feedback visual
5. **Accesibilidad**: Soporte para lectores de pantalla
6. **Seguridad**: Validación de entrada y sanitización

### **Características Técnicas**

- **CSS Grid/Flexbox**: Layout responsivo
- **CSS Variables**: Tema personalizable
- **CSS Animations**: Transiciones y efectos
- **JavaScript Seguro**: Validación robusta
- **LocalStorage**: Persistencia de datos
- **ARIA**: Accesibilidad web

## 🎨 Diseño Visual

### **Componentes del Contador**

```
┌─────────────────────────────────────┐
│           CONTADOR CSS              │
├─────────────────────────────────────┤
│  [-]     [  0000  ]     [+]        │
│                                     │
│  Min: [   0   ]  Max: [ 9999 ]     │
│                                     │
│  [ Reset ]  [ Tema ]  [ Guardar ]  │
│                                     │
│  Historial: 0 → 5 → 3 → 7          │
└─────────────────────────────────────┘
```

### **Estados Visuales**

- **Normal**: Contador en rango válido
- **Límite**: Alcanzado min/max con indicador visual
- **Error**: Entrada inválida con mensaje
- **Éxito**: Operación exitosa con confirmación

## 🔧 Estructura de Archivos

```
contador-css/
├── index.html          # Estructura HTML
├── styles.css          # Estilos CSS avanzados
├── script.js           # Lógica JavaScript
└── README.md           # Documentación
```

## 💻 Implementación Requerida

### **1. HTML Semántico**

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0" />
    <title>Contador CSS Avanzado</title>
    <link
      rel="stylesheet"
      href="styles.css" />
  </head>
  <body>
    <main class="contador-container">
      <header class="contador-header">
        <h1>Contador CSS Avanzado</h1>
      </header>

      <section class="contador-display">
        <button
          class="btn-decrement"
          aria-label="Decrementar">
          -
        </button>
        <div
          class="display-value"
          role="status"
          aria-live="polite">
          0
        </div>
        <button
          class="btn-increment"
          aria-label="Incrementar">
          +
        </button>
      </section>

      <section class="contador-config">
        <div class="config-item">
          <label for="min-value">Mínimo:</label>
          <input
            type="number"
            id="min-value"
            value="0"
            min="-999"
            max="999" />
        </div>
        <div class="config-item">
          <label for="max-value">Máximo:</label>
          <input
            type="number"
            id="max-value"
            value="100"
            min="1"
            max="9999" />
        </div>
      </section>

      <section class="contador-actions">
        <button class="btn-reset">Reset</button>
        <button class="btn-theme">Cambiar Tema</button>
        <button class="btn-save">Guardar</button>
      </section>

      <section class="contador-history">
        <h3>Historial</h3>
        <div class="history-list"></div>
      </section>
    </main>

    <script src="script.js"></script>
  </body>
</html>
```

### **2. CSS Avanzado**

```css
/* Variables CSS para temas */
:root {
  --primary-color: #3498db;
  --secondary-color: #2ecc71;
  --danger-color: #e74c3c;
  --warning-color: #f39c12;
  --dark-color: #2c3e50;
  --light-color: #ecf0f1;
  --border-radius: 8px;
  --transition: all 0.3s ease;
  --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Tema oscuro */
[data-theme='dark'] {
  --primary-color: #3498db;
  --secondary-color: #2ecc71;
  --danger-color: #e74c3c;
  --warning-color: #f39c12;
  --dark-color: #ecf0f1;
  --light-color: #2c3e50;
}

/* Layout principal */
.contador-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: var(--light-color);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  transition: var(--transition);
}

/* Display del contador */
.contador-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin: 2rem 0;
}

.display-value {
  font-size: 3rem;
  font-weight: bold;
  color: var(--primary-color);
  background: var(--dark-color);
  padding: 1rem 2rem;
  border-radius: var(--border-radius);
  min-width: 120px;
  text-align: center;
  font-family: 'Courier New', monospace;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
}

/* Animaciones del display */
.display-value::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: var(--transition);
}

.display-value.updating::before {
  left: 100%;
}

/* Botones del contador */
.btn-increment,
.btn-decrement {
  width: 60px;
  height: 60px;
  border: none;
  border-radius: 50%;
  font-size: 2rem;
  font-weight: bold;
  cursor: pointer;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
}

.btn-increment {
  background: var(--secondary-color);
  color: white;
}

.btn-decrement {
  background: var(--danger-color);
  color: white;
}

.btn-increment:hover,
.btn-decrement:hover {
  transform: scale(1.1);
  box-shadow: var(--shadow);
}

.btn-increment:active,
.btn-decrement:active {
  transform: scale(0.95);
}

/* Configuración */
.contador-config {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin: 1rem 0;
}

.config-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.config-item label {
  font-weight: bold;
  color: var(--dark-color);
}

.config-item input {
  padding: 0.5rem;
  border: 2px solid var(--primary-color);
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: var(--transition);
}

.config-item input:focus {
  outline: none;
  border-color: var(--secondary-color);
  box-shadow: 0 0 0 3px rgba(46, 204, 113, 0.2);
}

/* Acciones */
.contador-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin: 2rem 0;
}

.contador-actions button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-weight: bold;
  transition: var(--transition);
}

.btn-reset {
  background: var(--warning-color);
  color: white;
}

.btn-theme {
  background: var(--dark-color);
  color: var(--light-color);
}

.btn-save {
  background: var(--secondary-color);
  color: white;
}

.contador-actions button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

/* Historial */
.contador-history {
  margin-top: 2rem;
  padding: 1rem;
  background: var(--primary-color);
  border-radius: var(--border-radius);
  color: white;
}

.history-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}

.history-item {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
  animation: fadeIn 0.3s ease;
}

/* Animaciones */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.pulse {
  animation: pulse 0.3s ease;
}

/* Estados de error */
.error {
  border-color: var(--danger-color) !important;
  animation: shake 0.5s ease;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .contador-container {
    margin: 1rem;
    padding: 1rem;
  }

  .display-value {
    font-size: 2rem;
    padding: 0.75rem 1.5rem;
  }

  .contador-config {
    grid-template-columns: 1fr;
  }

  .contador-actions {
    flex-direction: column;
    align-items: center;
  }
}
```

### **3. JavaScript Seguro**

```javascript
class ContadorSeguro {
  constructor() {
    this.valor = 0;
    this.min = 0;
    this.max = 100;
    this.historia = [];
    this.tema = 'light';

    this.initElementos();
    this.initEventListeners();
    this.cargarEstado();
    this.actualizarDisplay();
  }

  initElementos() {
    this.displayElement = document.querySelector('.display-value');
    this.btnIncrement = document.querySelector('.btn-increment');
    this.btnDecrement = document.querySelector('.btn-decrement');
    this.btnReset = document.querySelector('.btn-reset');
    this.btnTheme = document.querySelector('.btn-theme');
    this.btnSave = document.querySelector('.btn-save');
    this.inputMin = document.getElementById('min-value');
    this.inputMax = document.getElementById('max-value');
    this.historyList = document.querySelector('.history-list');
  }

  initEventListeners() {
    this.btnIncrement.addEventListener('click', () => this.incrementar());
    this.btnDecrement.addEventListener('click', () => this.decrementar());
    this.btnReset.addEventListener('click', () => this.reset());
    this.btnTheme.addEventListener('click', () => this.cambiarTema());
    this.btnSave.addEventListener('click', () => this.guardarEstado());

    this.inputMin.addEventListener('change', e =>
      this.actualizarLimites('min', e.target.value)
    );
    this.inputMax.addEventListener('change', e =>
      this.actualizarLimites('max', e.target.value)
    );

    // Validación en tiempo real
    this.inputMin.addEventListener('input', e => this.validarEntrada(e.target));
    this.inputMax.addEventListener('input', e => this.validarEntrada(e.target));
  }

  validarEntrada(input) {
    const valor = parseInt(input.value);

    if (isNaN(valor)) {
      this.mostrarError(input, 'Debe ser un número válido');
      return false;
    }

    if (input.id === 'min-value' && valor >= this.max) {
      this.mostrarError(input, 'El mínimo debe ser menor que el máximo');
      return false;
    }

    if (input.id === 'max-value' && valor <= this.min) {
      this.mostrarError(input, 'El máximo debe ser mayor que el mínimo');
      return false;
    }

    this.limpiarError(input);
    return true;
  }

  mostrarError(input, mensaje) {
    input.classList.add('error');

    // Remover mensaje anterior
    const errorAnterior = input.parentNode.querySelector('.error-message');
    if (errorAnterior) {
      errorAnterior.remove();
    }

    // Agregar nuevo mensaje
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = mensaje;
    errorDiv.style.color = 'var(--danger-color)';
    errorDiv.style.fontSize = '0.8rem';
    errorDiv.style.marginTop = '0.25rem';

    input.parentNode.appendChild(errorDiv);
  }

  limpiarError(input) {
    input.classList.remove('error');
    const errorMessage = input.parentNode.querySelector('.error-message');
    if (errorMessage) {
      errorMessage.remove();
    }
  }

  actualizarLimites(tipo, valor) {
    const numeroLimpio = this.sanitizarNumero(valor);

    if (numeroLimpio === null) {
      this.mostrarNotificacion('Valor inválido', 'error');
      return;
    }

    if (tipo === 'min') {
      if (numeroLimpio >= this.max) {
        this.mostrarNotificacion(
          'El mínimo debe ser menor que el máximo',
          'error'
        );
        this.inputMin.value = this.min;
        return;
      }
      this.min = numeroLimpio;
    } else {
      if (numeroLimpio <= this.min) {
        this.mostrarNotificacion(
          'El máximo debe ser mayor que el mínimo',
          'error'
        );
        this.inputMax.value = this.max;
        return;
      }
      this.max = numeroLimpio;
    }

    // Ajustar valor actual si está fuera del rango
    if (this.valor < this.min) {
      this.valor = this.min;
    } else if (this.valor > this.max) {
      this.valor = this.max;
    }

    this.actualizarDisplay();
    this.mostrarNotificacion('Límites actualizados', 'success');
  }

  sanitizarNumero(valor) {
    // Limpiar entrada para prevenir inyección
    const numeroLimpio = parseInt(String(valor).replace(/[^-0-9]/g, ''));
    return isNaN(numeroLimpio) ? null : numeroLimpio;
  }

  incrementar() {
    if (this.valor < this.max) {
      this.valor++;
      this.agregarHistoria('incremento');
      this.actualizarDisplay();
      this.animarCambio();
    } else {
      this.mostrarNotificacion('Valor máximo alcanzado', 'warning');
      this.animarLimite();
    }
  }

  decrementar() {
    if (this.valor > this.min) {
      this.valor--;
      this.agregarHistoria('decremento');
      this.actualizarDisplay();
      this.animarCambio();
    } else {
      this.mostrarNotificacion('Valor mínimo alcanzado', 'warning');
      this.animarLimite();
    }
  }

  reset() {
    this.valor = Math.floor((this.min + this.max) / 2);
    this.agregarHistoria('reset');
    this.actualizarDisplay();
    this.animarCambio();
    this.mostrarNotificacion('Contador reiniciado', 'success');
  }

  cambiarTema() {
    this.tema = this.tema === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', this.tema);
    this.mostrarNotificacion(`Tema ${this.tema} activado`, 'success');
  }

  actualizarDisplay() {
    // Formatear número con ceros a la izquierda
    const valorFormateado = this.valor.toString().padStart(4, '0');
    this.displayElement.textContent = valorFormateado;

    // Actualizar estado de botones
    this.btnIncrement.disabled = this.valor >= this.max;
    this.btnDecrement.disabled = this.valor <= this.min;

    // Actualizar colores según estado
    if (this.valor >= this.max) {
      this.displayElement.style.color = 'var(--danger-color)';
    } else if (this.valor <= this.min) {
      this.displayElement.style.color = 'var(--warning-color)';
    } else {
      this.displayElement.style.color = 'var(--primary-color)';
    }
  }

  animarCambio() {
    this.displayElement.classList.add('updating');
    setTimeout(() => {
      this.displayElement.classList.remove('updating');
    }, 300);
  }

  animarLimite() {
    this.displayElement.classList.add('pulse');
    setTimeout(() => {
      this.displayElement.classList.remove('pulse');
    }, 300);
  }

  agregarHistoria(accion) {
    const timestamp = new Date().toLocaleTimeString();
    this.historia.push({
      accion,
      valor: this.valor,
      timestamp,
    });

    // Limitar historial a 10 elementos
    if (this.historia.length > 10) {
      this.historia.shift();
    }

    this.actualizarHistorial();
  }

  actualizarHistorial() {
    this.historyList.innerHTML = '';

    this.historia.forEach(item => {
      const historyItem = document.createElement('div');
      historyItem.className = 'history-item';
      historyItem.textContent = `${item.accion}: ${item.valor} (${item.timestamp})`;
      this.historyList.appendChild(historyItem);
    });
  }

  guardarEstado() {
    try {
      const estado = {
        valor: this.valor,
        min: this.min,
        max: this.max,
        tema: this.tema,
        historia: this.historia,
      };

      localStorage.setItem('contador-estado', JSON.stringify(estado));
      this.mostrarNotificacion('Estado guardado exitosamente', 'success');
    } catch (error) {
      console.error('Error guardando estado:', error);
      this.mostrarNotificacion('Error al guardar estado', 'error');
    }
  }

  cargarEstado() {
    try {
      const estadoGuardado = localStorage.getItem('contador-estado');
      if (estadoGuardado) {
        const estado = JSON.parse(estadoGuardado);

        // Validar datos cargados
        if (this.validarEstado(estado)) {
          this.valor = estado.valor;
          this.min = estado.min;
          this.max = estado.max;
          this.tema = estado.tema;
          this.historia = estado.historia || [];

          // Actualizar interfaz
          this.inputMin.value = this.min;
          this.inputMax.value = this.max;
          document.documentElement.setAttribute('data-theme', this.tema);
          this.actualizarHistorial();

          this.mostrarNotificacion('Estado cargado exitosamente', 'success');
        }
      }
    } catch (error) {
      console.error('Error cargando estado:', error);
      this.mostrarNotificacion('Error al cargar estado', 'error');
    }
  }

  validarEstado(estado) {
    return (
      typeof estado.valor === 'number' &&
      typeof estado.min === 'number' &&
      typeof estado.max === 'number' &&
      estado.min < estado.max &&
      estado.valor >= estado.min &&
      estado.valor <= estado.max &&
      ['light', 'dark'].includes(estado.tema)
    );
  }

  mostrarNotificacion(mensaje, tipo = 'info') {
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion ${tipo}`;
    notificacion.textContent = mensaje;

    // Estilos dinámicos
    Object.assign(notificacion.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '12px 24px',
      borderRadius: '8px',
      color: 'white',
      fontWeight: 'bold',
      zIndex: '1000',
      transform: 'translateX(100%)',
      transition: 'transform 0.3s ease',
      backgroundColor:
        tipo === 'error'
          ? 'var(--danger-color)'
          : tipo === 'warning'
          ? 'var(--warning-color)'
          : tipo === 'success'
          ? 'var(--secondary-color)'
          : 'var(--primary-color)',
    });

    document.body.appendChild(notificacion);

    // Animar entrada
    setTimeout(() => {
      notificacion.style.transform = 'translateX(0)';
    }, 100);

    // Remover después de 3 segundos
    setTimeout(() => {
      notificacion.style.transform = 'translateX(100%)';
      setTimeout(() => {
        document.body.removeChild(notificacion);
      }, 300);
    }, 3000);
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  new ContadorSeguro();
});
```

## 📊 Criterios de Evaluación

### **Funcionalidad (40 puntos)**

- [ ] Incremento/decremento funcionando (10 pts)
- [ ] Validación de límites (10 pts)
- [ ] Persistencia de datos (10 pts)
- [ ] Historial de cambios (10 pts)

### **Seguridad (30 puntos)**

- [ ] Validación de entrada (10 pts)
- [ ] Sanitización de datos (10 pts)
- [ ] Manejo seguro de localStorage (10 pts)

### **CSS/Diseño (20 puntos)**

- [ ] Uso de CSS Grid/Flexbox (5 pts)
- [ ] CSS Variables y temas (5 pts)
- [ ] Animaciones y transiciones (5 pts)
- [ ] Responsive design (5 pts)

### **Calidad de Código (10 puntos)**

- [ ] Código limpio y organizado (5 pts)
- [ ] Comentarios y documentación (5 pts)

## 🎯 Desafíos Adicionales

### **Nivel Intermedio**

- Agregar modo contador regresivo
- Implementar atajos de teclado
- Añadir sonidos para feedback

### **Nivel Avanzado**

- Múltiples contadores simultáneos
- Export/import de configuraciones
- Gráficos de historial con Chart.js

## 📚 Recursos de Apoyo

- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [CSS Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations)
- [LocalStorage Security](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [ARIA Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)

---

💡 **Nota**: Este proyecto combina técnicas avanzadas de CSS con JavaScript seguro, perfecto para demostrar habilidades frontend en competencias WorldSkills.
