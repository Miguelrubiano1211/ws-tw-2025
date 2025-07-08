# 🧠 Proyecto: Algoritmos y Estructuras de Datos

## 📋 Descripción

Desarrolla una aplicación interactiva que demuestre algoritmos fundamentales y estructuras de datos usando JavaScript ES6+. Este proyecto está diseñado para reforzar conceptos de programación competitiva y resolución de problemas.

## 🎯 Objetivos de Aprendizaje

- Implementar algoritmos clásicos con JavaScript moderno
- Visualizar el funcionamiento de algoritmos complejos
- Aplicar estructuras de datos eficientes
- Practicar análisis de complejidad temporal y espacial
- Desarrollar habilidades de programación competitiva

## 🚀 Algoritmos Implementados

### 🔍 Búsqueda y Ordenamiento

1. **Búsqueda Binaria**

   - Implementación iterativa y recursiva
   - Visualización paso a paso
   - Análisis de complejidad O(log n)

2. **Algoritmos de Ordenamiento**
   - Bubble Sort
   - Selection Sort
   - Insertion Sort
   - Merge Sort
   - Quick Sort
   - Comparación de rendimiento

### 🧮 Algoritmos de Cadenas

3. **Palindromos**

   - Verificación de palíndromos
   - Palíndromo más largo
   - Construcción de palíndromos

4. **Análisis de Texto**
   - Conteo de caracteres
   - Palabras más frecuentes
   - Anagramas

### 🔢 Algoritmos Numéricos

5. **Números Primos**

   - Verificación de primalidad
   - Criba de Eratóstenes
   - Factorización prima

6. **Secuencias Matemáticas**
   - Fibonacci
   - Factorial
   - Números perfectos

### 🌐 Algoritmos de Grafos

7. **Recorridos de Grafos**

   - BFS (Breadth-First Search)
   - DFS (Depth-First Search)
   - Camino más corto

8. **Árboles**
   - Árboles binarios
   - Recorridos (inorder, preorder, postorder)
   - Árbol de búsqueda binaria

## 📁 Estructura de Archivos

```
algoritmos/
├── index.html              # Interfaz principal
├── styles.css              # Estilos de la aplicación
├── script.js               # Lógica principal
├── algoritmos/
│   ├── busqueda.js         # Algoritmos de búsqueda
│   ├── ordenamiento.js     # Algoritmos de ordenamiento
│   ├── cadenas.js          # Algoritmos de cadenas
│   ├── numericos.js        # Algoritmos numéricos
│   └── grafos.js           # Algoritmos de grafos
├── utils/
│   ├── visualizacion.js    # Utilidades de visualización
│   ├── performance.js      # Medición de rendimiento
│   └── generadores.js      # Generadores de datos
└── README.md               # Este archivo
```

## 🛠️ Funcionalidades

### ⚡ Funcionalidades Básicas

- **Selección de Algoritmos**: Menú interactivo
- **Entrada de Datos**: Formularios dinámicos
- **Ejecución**: Botones de control
- **Resultados**: Visualización clara

### 🎨 Funcionalidades Avanzadas

- **Visualización**: Animaciones step-by-step
- **Comparación**: Múltiples algoritmos simultáneamente
- **Medición**: Tiempo de ejecución y complejidad
- **Exportación**: Resultados en JSON/CSV

### 🎯 Funcionalidades de Competencia

- **Generación Automática**: Casos de prueba
- **Validación**: Verificación de resultados
- **Benchmarking**: Comparación de rendimiento
- **Análisis**: Gráficos de complejidad

## 🧪 Casos de Uso

### Palindromos

```javascript
// Casos de prueba para palindromos
const casosPrueba = [
  'racecar',
  'A man a plan a canal Panama',
  'race a car',
  'hello world',
  'madam',
  '12321',
];
```

### Ordenamiento

```javascript
// Datasets para ordenamiento
const datasets = {
  pequeño: [64, 34, 25, 12, 22, 11, 90],
  mediano: Array.from({ length: 100 }, () => Math.floor(Math.random() * 1000)),
  grande: Array.from({ length: 1000 }, () => Math.floor(Math.random() * 10000)),
};
```

### Búsqueda

```javascript
// Arreglos para búsqueda binaria
const arregloOrdenado = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
const elementos = [7, 2, 15, 20];
```

## 🚀 Instrucciones de Desarrollo

### Paso 1: Configuración

1. Crear estructura de archivos
2. Configurar HTML base
3. Implementar estilos CSS
4. Crear sistema de navegación

### Paso 2: Implementación de Algoritmos

1. Comenzar con algoritmos básicos
2. Agregar visualización
3. Implementar medición de rendimiento
4. Crear casos de prueba

### Paso 3: Interfaz de Usuario

1. Formularios dinámicos
2. Controles de ejecución
3. Visualización de resultados
4. Sistema de comparación

### Paso 4: Optimización

1. Mejorar rendimiento
2. Agregar más algoritmos
3. Implementar exportación
4. Crear documentación

## 🧪 Criterios de Evaluación

### Algoritmos (40%)

- ✅ Implementación correcta
- ✅ Eficiencia temporal
- ✅ Manejo de casos edge
- ✅ Código limpio y comentado

### Visualización (25%)

- ✅ Animaciones claras
- ✅ Interfaz intuitiva
- ✅ Responsive design
- ✅ Accesibilidad

### Funcionalidad (25%)

- ✅ Casos de prueba
- ✅ Medición de rendimiento
- ✅ Comparación de algoritmos
- ✅ Exportación de datos

### Código (10%)

- ✅ Uso de ES6+
- ✅ Modularidad
- ✅ Documentación
- ✅ Mejores prácticas

## 💡 Tips para WorldSkills

1. **Eficiencia**: Implementa algoritmos optimizados
2. **Visualización**: Usa Canvas o SVG para animaciones
3. **Interactividad**: Controles intuitivos
4. **Documentación**: Explica la complejidad
5. **Testing**: Casos de prueba exhaustivos
6. **Performance**: Mide y compara tiempos

## 🔧 Herramientas Útiles

### Medición de Rendimiento

```javascript
class PerformanceMonitor {
  static measure(fn, ...args) {
    const start = performance.now();
    const result = fn(...args);
    const end = performance.now();

    return {
      result,
      time: end - start,
      iterations: 1,
    };
  }
}
```

### Generador de Datos

```javascript
class DataGenerator {
  static randomArray(size, min = 0, max = 1000) {
    return Array.from(
      { length: size },
      () => Math.floor(Math.random() * (max - min + 1)) + min
    );
  }

  static sortedArray(size, min = 0, max = 1000) {
    return this.randomArray(size, min, max).sort((a, b) => a - b);
  }
}
```

### Visualización

```javascript
class AlgorithmVisualizer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.animationSpeed = 100;
  }

  async drawArray(arr, highlighted = []) {
    // Implementar visualización de array
  }

  async animate(steps) {
    // Implementar animación paso a paso
  }
}
```

## 🎯 Desafíos Adicionales

1. **Algoritmos Avanzados**: Implementar algoritmos más complejos
2. **Estructuras de Datos**: Pilas, colas, hash tables
3. **Optimización**: Técnicas de optimización
4. **Análisis**: Gráficos de complejidad
5. **Competencia**: Problemas de programación competitiva

## 📚 Recursos de Referencia

- [Big O Notation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [Algorithms Visualization](https://visualgo.net/)
- [Time Complexity Analysis](https://www.bigocheatsheet.com/)
- [Competitive Programming](https://cp-algorithms.com/)

## 🔍 Algoritmos de Ejemplo

### Búsqueda Binaria

```javascript
function busquedaBinaria(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1;
}
```

### Verificación de Palíndromo

```javascript
function esPalindromo(str) {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
}
```

¡Demuestra tu dominio de algoritmos y programación competitiva! 🚀
