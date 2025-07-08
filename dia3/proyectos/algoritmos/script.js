// 🧠 Algoritmos y Estructuras de Datos - JavaScript ES6+
// Día 3 - JavaScript ES6+ Fundamentals

class AlgorithmApp {
  constructor() {
    this.tema = 'light';
    this.estadisticas = {
      algoritmosEjecutados: 0,
      tiempoTotal: 0,
      algoritmoMasRapido: null,
      ultimoResultado: null,
    };
    this.historialRendimiento = [];

    this.inicializar();
  }

  inicializar() {
    this.configurarEventos();
    this.cargarEstadisticas();
    this.actualizarPanelEstadisticas();
    this.mostrarSeccion('palindromos');
  }

  // =============================================
  // Navegación y UI
  // =============================================

  configurarEventos() {
    // Navegación
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const categoria = e.target.dataset.category;
        this.mostrarSeccion(categoria);
      });
    });

    // Tema
    document
      .getElementById('toggle-theme')
      .addEventListener('click', () => this.toggleTema());

    // Reset
    document
      .getElementById('reset-all')
      .addEventListener('click', () => this.resetearTodo());

    // Eventos de Palíndromos
    document
      .getElementById('check-palindrome')
      .addEventListener('click', () => this.verificarPalindromo());
    document
      .getElementById('find-longest')
      .addEventListener('click', () => this.encontrarPalindromoMasLargo());
    document
      .getElementById('generate-palindromes')
      .addEventListener('click', () => this.generarCasosPalindromo());

    // Eventos de Ordenamiento
    document
      .getElementById('sort-array')
      .addEventListener('click', () => this.ordenarArray());
    document
      .getElementById('compare-sorts')
      .addEventListener('click', () => this.compararOrdenamientos());
    document
      .getElementById('generate-random')
      .addEventListener('click', () => this.generarArrayAleatorio());

    // Eventos de Búsqueda
    document
      .getElementById('linear-search')
      .addEventListener('click', () => this.busquedaLineal());
    document
      .getElementById('binary-search')
      .addEventListener('click', () => this.busquedaBinaria());
    document
      .getElementById('compare-search')
      .addEventListener('click', () => this.compararBusquedas());

    // Eventos Numéricos
    document
      .getElementById('check-prime')
      .addEventListener('click', () => this.verificarPrimo());
    document
      .getElementById('generate-fibonacci')
      .addEventListener('click', () => this.generarFibonacci());
    document
      .getElementById('calculate-factorial')
      .addEventListener('click', () => this.calcularFactorial());
    document
      .getElementById('find-primes')
      .addEventListener('click', () => this.encontrarPrimos());

    // Eventos de Cadenas
    document
      .getElementById('char-frequency')
      .addEventListener('click', () => this.frecuenciaCaracteres());
    document
      .getElementById('word-frequency')
      .addEventListener('click', () => this.frecuenciaPalabras());
    document
      .getElementById('find-anagrams')
      .addEventListener('click', () => this.encontrarAnagramas());
    document
      .getElementById('text-analysis')
      .addEventListener('click', () => this.analisisCompleto());

    // Eventos de Grafos
    document
      .getElementById('bfs-traversal')
      .addEventListener('click', () => this.recorridoBFS());
    document
      .getElementById('dfs-traversal')
      .addEventListener('click', () => this.recorridoDFS());
    document
      .getElementById('shortest-path')
      .addEventListener('click', () => this.caminoMasCorto());
    document
      .getElementById('generate-graph')
      .addEventListener('click', () => this.generarGrafo());

    // Modal
    document.querySelector('.close').addEventListener('click', () => {
      document.getElementById('comparison-modal').style.display = 'none';
    });

    document
      .getElementById('export-comparison')
      .addEventListener('click', () => this.exportarComparacion());
  }

  mostrarSeccion(categoria) {
    // Actualizar navegación
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document
      .querySelector(`[data-category="${categoria}"]`)
      .classList.add('active');

    // Actualizar contenido
    document.querySelectorAll('.algorithm-section').forEach(section => {
      section.classList.remove('active');
    });
    document.getElementById(categoria).classList.add('active');
  }

  toggleTema() {
    this.tema = this.tema === 'light' ? 'dark' : 'light';
    document.body.setAttribute('data-theme', this.tema);

    const iconoTema = document.getElementById('toggle-theme');
    iconoTema.textContent = this.tema === 'light' ? '🌙' : '☀️';

    localStorage.setItem('algorithm-tema', this.tema);
  }

  // =============================================
  // Utilidades de Medición
  // =============================================

  medirRendimiento(algoritmo, funcion, ...args) {
    const inicio = performance.now();
    const resultado = funcion(...args);
    const fin = performance.now();
    const tiempo = fin - inicio;

    this.estadisticas.algoritmosEjecutados++;
    this.estadisticas.tiempoTotal += tiempo;
    this.estadisticas.ultimoResultado = resultado;

    if (
      !this.estadisticas.algoritmoMasRapido ||
      tiempo < this.estadisticas.algoritmoMasRapido.tiempo
    ) {
      this.estadisticas.algoritmoMasRapido = { nombre: algoritmo, tiempo };
    }

    this.historialRendimiento.push({
      algoritmo,
      tiempo,
      fecha: new Date(),
      resultado: resultado,
    });

    this.actualizarPanelEstadisticas();

    return { resultado, tiempo };
  }

  actualizarPanelEstadisticas() {
    document.getElementById('algorithms-count').textContent =
      this.estadisticas.algoritmosEjecutados;
    document.getElementById(
      'total-time'
    ).textContent = `${this.estadisticas.tiempoTotal.toFixed(2)}ms`;
    document.getElementById('fastest-algorithm').textContent = this.estadisticas
      .algoritmoMasRapido
      ? this.estadisticas.algoritmoMasRapido.nombre
      : '-';
    document.getElementById('last-result').textContent = this.estadisticas
      .ultimoResultado
      ? typeof this.estadisticas.ultimoResultado === 'boolean'
        ? this.estadisticas.ultimoResultado
          ? 'Verdadero'
          : 'Falso'
        : this.estadisticas.ultimoResultado.toString().slice(0, 20) + '...'
      : '-';
  }

  // =============================================
  // Algoritmos de Palíndromos
  // =============================================

  verificarPalindromo() {
    const input = document.getElementById('palindrome-input').value;
    if (!input) {
      alert('Por favor ingresa una cadena');
      return;
    }

    const { resultado, tiempo } = this.medirRendimiento(
      'Verificar Palíndromo',
      this.esPalindromo,
      input
    );

    const resultadoElement = document.getElementById('palindrome-result');
    resultadoElement.innerHTML = `
            <div class="algorithm-step">
                <div class="algorithm-step-header">Resultado:</div>
                <div class="algorithm-step-content">
                    "${input}" ${resultado ? 'ES' : 'NO ES'} un palíndromo
                </div>
            </div>
            <div class="algorithm-step">
                <div class="algorithm-step-header">Tiempo de ejecución:</div>
                <div class="algorithm-step-content">${tiempo.toFixed(4)}ms</div>
            </div>
        `;

    this.visualizarPalindromo(input, resultado);
  }

  esPalindromo(str) {
    const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
    return cleaned === cleaned.split('').reverse().join('');
  }

  visualizarPalindromo(str, esPalindromo) {
    const visualization = document.getElementById('palindrome-visualization');
    const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
    const reversed = cleaned.split('').reverse().join('');

    let html = `
            <div class="algorithm-step">
                <div class="algorithm-step-header">Cadena original:</div>
                <div class="algorithm-step-content">"${str}"</div>
            </div>
            <div class="algorithm-step">
                <div class="algorithm-step-header">Cadena limpia:</div>
                <div class="algorithm-step-content">"${cleaned}"</div>
            </div>
            <div class="algorithm-step">
                <div class="algorithm-step-header">Cadena invertida:</div>
                <div class="algorithm-step-content">"${reversed}"</div>
            </div>
            <div class="algorithm-step">
                <div class="algorithm-step-header">Comparación:</div>
                <div class="algorithm-step-content">
        `;

    for (let i = 0; i < cleaned.length; i++) {
      const char = cleaned[i];
      const reverseChar = reversed[i];
      const isMatch = char === reverseChar;
      html += `<span class="${isMatch ? 'highlighted' : ''}">${char}</span>`;
    }

    html += `</div></div>`;
    visualization.innerHTML = html;
  }

  encontrarPalindromoMasLargo() {
    const input = document.getElementById('palindrome-input').value;
    if (!input) {
      alert('Por favor ingresa una cadena');
      return;
    }

    const { resultado, tiempo } = this.medirRendimiento(
      'Palíndromo Más Largo',
      this.palindromoMasLargo,
      input
    );

    const resultadoElement = document.getElementById('palindrome-result');
    resultadoElement.innerHTML = `
            <div class="algorithm-step">
                <div class="algorithm-step-header">Palíndromo más largo:</div>
                <div class="algorithm-step-content">"${resultado}"</div>
            </div>
            <div class="algorithm-step">
                <div class="algorithm-step-header">Longitud:</div>
                <div class="algorithm-step-content">${
                  resultado.length
                } caracteres</div>
            </div>
            <div class="algorithm-step">
                <div class="algorithm-step-header">Tiempo de ejecución:</div>
                <div class="algorithm-step-content">${tiempo.toFixed(4)}ms</div>
            </div>
        `;
  }

  palindromoMasLargo(str) {
    if (!str) return '';

    let inicio = 0;
    let longitudMaxima = 1;

    for (let i = 0; i < str.length; i++) {
      // Palíndromos impares
      let left = i;
      let right = i;
      while (left >= 0 && right < str.length && str[left] === str[right]) {
        if (right - left + 1 > longitudMaxima) {
          inicio = left;
          longitudMaxima = right - left + 1;
        }
        left--;
        right++;
      }

      // Palíndromos pares
      left = i;
      right = i + 1;
      while (left >= 0 && right < str.length && str[left] === str[right]) {
        if (right - left + 1 > longitudMaxima) {
          inicio = left;
          longitudMaxima = right - left + 1;
        }
        left--;
        right++;
      }
    }

    return str.substring(inicio, inicio + longitudMaxima);
  }

  generarCasosPalindromo() {
    const casos = [
      'racecar',
      'A man a plan a canal Panama',
      'race a car',
      'hello world',
      'madam',
      '12321',
      'Was it a car or a cat I saw?',
      'No lemon, no melon',
    ];

    const container = document.getElementById('palindrome-test-cases');
    container.innerHTML = '';

    casos.forEach(caso => {
      const esPalindromo = this.esPalindromo(caso);
      const elemento = document.createElement('div');
      elemento.className = 'test-case';
      elemento.innerHTML = `
                <div class="test-case-input">"${caso}"</div>
                <div class="test-case-result ${
                  esPalindromo ? 'success' : 'error'
                }">
                    ${esPalindromo ? '✓ Es palíndromo' : '✗ No es palíndromo'}
                </div>
            `;
      container.appendChild(elemento);
    });
  }

  // =============================================
  // Algoritmos de Ordenamiento
  // =============================================

  ordenarArray() {
    const input = document.getElementById('sort-input').value;
    const algoritmo = document.getElementById('sort-algorithm').value;

    if (!input) {
      alert('Por favor ingresa números separados por comas');
      return;
    }

    const array = input
      .split(',')
      .map(num => parseInt(num.trim()))
      .filter(num => !isNaN(num));

    if (array.length === 0) {
      alert('No se encontraron números válidos');
      return;
    }

    const algoritmos = {
      bubble: this.bubbleSort,
      selection: this.selectionSort,
      insertion: this.insertionSort,
      merge: this.mergeSort,
      quick: this.quickSort,
    };

    const { resultado, tiempo } = this.medirRendimiento(
      `${algoritmo} sort`,
      algoritmos[algoritmo].bind(this),
      [...array]
    );

    const resultadoElement = document.getElementById('sort-result');
    resultadoElement.innerHTML = `
            <div class="algorithm-step">
                <div class="algorithm-step-header">Array original:</div>
                <div class="algorithm-step-content">[${array.join(', ')}]</div>
            </div>
            <div class="algorithm-step">
                <div class="algorithm-step-header">Array ordenado:</div>
                <div class="algorithm-step-content">[${resultado.join(
                  ', '
                )}]</div>
            </div>
            <div class="algorithm-step">
                <div class="algorithm-step-header">Algoritmo:</div>
                <div class="algorithm-step-content">${
                  algoritmo.charAt(0).toUpperCase() + algoritmo.slice(1)
                } Sort</div>
            </div>
            <div class="algorithm-step">
                <div class="algorithm-step-header">Tiempo de ejecución:</div>
                <div class="algorithm-step-content">${tiempo.toFixed(4)}ms</div>
            </div>
        `;

    this.visualizarOrdenamiento(array, resultado);
  }

  bubbleSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        }
      }
    }
    return arr;
  }

  selectionSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      let minIndex = i;
      for (let j = i + 1; j < n; j++) {
        if (arr[j] < arr[minIndex]) {
          minIndex = j;
        }
      }
      if (minIndex !== i) {
        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
      }
    }
    return arr;
  }

  insertionSort(arr) {
    for (let i = 1; i < arr.length; i++) {
      const key = arr[i];
      let j = i - 1;

      while (j >= 0 && arr[j] > key) {
        arr[j + 1] = arr[j];
        j--;
      }
      arr[j + 1] = key;
    }
    return arr;
  }

  mergeSort(arr) {
    if (arr.length <= 1) return arr;

    const mid = Math.floor(arr.length / 2);
    const left = this.mergeSort(arr.slice(0, mid));
    const right = this.mergeSort(arr.slice(mid));

    return this.merge(left, right);
  }

  merge(left, right) {
    const result = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
      if (left[leftIndex] <= right[rightIndex]) {
        result.push(left[leftIndex]);
        leftIndex++;
      } else {
        result.push(right[rightIndex]);
        rightIndex++;
      }
    }

    return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
  }

  quickSort(arr) {
    if (arr.length <= 1) return arr;

    const pivot = arr[Math.floor(arr.length / 2)];
    const left = arr.filter(x => x < pivot);
    const middle = arr.filter(x => x === pivot);
    const right = arr.filter(x => x > pivot);

    return [...this.quickSort(left), ...middle, ...this.quickSort(right)];
  }

  visualizarOrdenamiento(original, ordenado) {
    const canvas = document.getElementById('sort-canvas');
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const barWidth = canvas.width / original.length;
    const maxValue = Math.max(...original);

    // Dibujar array original
    ctx.fillStyle = '#ef4444';
    original.forEach((value, index) => {
      const barHeight = (value / maxValue) * (canvas.height / 2 - 20);
      ctx.fillRect(
        index * barWidth,
        canvas.height / 2 - barHeight,
        barWidth - 2,
        barHeight
      );

      // Etiquetas
      ctx.fillStyle = '#1e293b';
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(
        value,
        index * barWidth + barWidth / 2,
        canvas.height / 2 + 15
      );
      ctx.fillStyle = '#ef4444';
    });

    // Dibujar array ordenado
    ctx.fillStyle = '#10b981';
    ordenado.forEach((value, index) => {
      const barHeight = (value / maxValue) * (canvas.height / 2 - 20);
      ctx.fillRect(
        index * barWidth,
        canvas.height / 2 + 40,
        barWidth - 2,
        barHeight
      );

      // Etiquetas
      ctx.fillStyle = '#1e293b';
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(value, index * barWidth + barWidth / 2, canvas.height - 5);
      ctx.fillStyle = '#10b981';
    });

    // Etiquetas de secciones
    ctx.fillStyle = '#1e293b';
    ctx.font = '14px bold';
    ctx.textAlign = 'left';
    ctx.fillText('Original', 10, 20);
    ctx.fillText('Ordenado', 10, canvas.height / 2 + 60);
  }

  compararOrdenamientos() {
    const input = document.getElementById('sort-input').value;
    if (!input) {
      alert('Por favor ingresa números separados por comas');
      return;
    }

    const array = input
      .split(',')
      .map(num => parseInt(num.trim()))
      .filter(num => !isNaN(num));

    const algoritmos = {
      'Bubble Sort': this.bubbleSort,
      'Selection Sort': this.selectionSort,
      'Insertion Sort': this.insertionSort,
      'Merge Sort': this.mergeSort,
      'Quick Sort': this.quickSort,
    };

    const resultados = {};

    Object.entries(algoritmos).forEach(([nombre, algoritmo]) => {
      const { resultado, tiempo } = this.medirRendimiento(
        nombre,
        algoritmo.bind(this),
        [...array]
      );
      resultados[nombre] = {
        tiempo: tiempo,
        resultado: resultado,
      };
    });

    this.mostrarComparacion(resultados);
  }

  mostrarComparacion(resultados) {
    const modal = document.getElementById('comparison-modal');
    const container = document.getElementById('comparison-results');

    container.innerHTML = '';

    Object.entries(resultados).forEach(([nombre, datos]) => {
      const elemento = document.createElement('div');
      elemento.className = 'comparison-item';
      elemento.innerHTML = `
                <h4>${nombre}</h4>
                <div class="comparison-metric">
                    <span class="comparison-metric-label">Tiempo:</span>
                    <span class="comparison-metric-value">${datos.tiempo.toFixed(
                      4
                    )}ms</span>
                </div>
                <div class="comparison-metric">
                    <span class="comparison-metric-label">Elementos:</span>
                    <span class="comparison-metric-value">${
                      datos.resultado.length
                    }</span>
                </div>
                <div class="comparison-metric">
                    <span class="comparison-metric-label">Primer elemento:</span>
                    <span class="comparison-metric-value">${
                      datos.resultado[0]
                    }</span>
                </div>
                <div class="comparison-metric">
                    <span class="comparison-metric-label">Último elemento:</span>
                    <span class="comparison-metric-value">${
                      datos.resultado[datos.resultado.length - 1]
                    }</span>
                </div>
            `;
      container.appendChild(elemento);
    });

    modal.style.display = 'block';
  }

  generarArrayAleatorio() {
    const sizes = [10, 20, 50];
    const size = sizes[Math.floor(Math.random() * sizes.length)];
    const array = Array.from(
      { length: size },
      () => Math.floor(Math.random() * 100) + 1
    );

    document.getElementById('sort-input').value = array.join(',');
  }

  // =============================================
  // Algoritmos de Búsqueda
  // =============================================

  busquedaLineal() {
    const arrayInput = document.getElementById('search-array').value;
    const target = parseInt(document.getElementById('search-target').value);

    if (!arrayInput || isNaN(target)) {
      alert('Por favor ingresa un array y un número a buscar');
      return;
    }

    const array = arrayInput
      .split(',')
      .map(num => parseInt(num.trim()))
      .filter(num => !isNaN(num));

    const { resultado, tiempo } = this.medirRendimiento(
      'Búsqueda Lineal',
      this.linearSearch,
      array,
      target
    );

    const resultadoElement = document.getElementById('search-result');
    resultadoElement.innerHTML = `
            <div class="algorithm-step">
                <div class="algorithm-step-header">Array:</div>
                <div class="algorithm-step-content">[${array.join(', ')}]</div>
            </div>
            <div class="algorithm-step">
                <div class="algorithm-step-header">Buscando:</div>
                <div class="algorithm-step-content">${target}</div>
            </div>
            <div class="algorithm-step">
                <div class="algorithm-step-header">Resultado:</div>
                <div class="algorithm-step-content">
                    ${
                      resultado.encontrado
                        ? `Encontrado en índice ${resultado.indice}`
                        : 'No encontrado'
                    }
                </div>
            </div>
            <div class="algorithm-step">
                <div class="algorithm-step-header">Comparaciones:</div>
                <div class="algorithm-step-content">${
                  resultado.comparaciones
                }</div>
            </div>
            <div class="algorithm-step">
                <div class="algorithm-step-header">Tiempo:</div>
                <div class="algorithm-step-content">${tiempo.toFixed(4)}ms</div>
            </div>
        `;

    this.visualizarBusqueda(array, target, resultado, 'lineal');
  }

  linearSearch(arr, target) {
    let comparaciones = 0;
    for (let i = 0; i < arr.length; i++) {
      comparaciones++;
      if (arr[i] === target) {
        return { encontrado: true, indice: i, comparaciones };
      }
    }
    return { encontrado: false, indice: -1, comparaciones };
  }

  busquedaBinaria() {
    const arrayInput = document.getElementById('search-array').value;
    const target = parseInt(document.getElementById('search-target').value);

    if (!arrayInput || isNaN(target)) {
      alert('Por favor ingresa un array y un número a buscar');
      return;
    }

    const array = arrayInput
      .split(',')
      .map(num => parseInt(num.trim()))
      .filter(num => !isNaN(num));

    // Verificar si el array está ordenado
    const estaOrdenado = array.every(
      (val, i) => i === 0 || array[i - 1] <= val
    );
    if (!estaOrdenado) {
      alert('El array debe estar ordenado para búsqueda binaria');
      return;
    }

    const { resultado, tiempo } = this.medirRendimiento(
      'Búsqueda Binaria',
      this.binarySearch,
      array,
      target
    );

    const resultadoElement = document.getElementById('search-result');
    resultadoElement.innerHTML = `
            <div class="algorithm-step">
                <div class="algorithm-step-header">Array:</div>
                <div class="algorithm-step-content">[${array.join(', ')}]</div>
            </div>
            <div class="algorithm-step">
                <div class="algorithm-step-header">Buscando:</div>
                <div class="algorithm-step-content">${target}</div>
            </div>
            <div class="algorithm-step">
                <div class="algorithm-step-header">Resultado:</div>
                <div class="algorithm-step-content">
                    ${
                      resultado.encontrado
                        ? `Encontrado en índice ${resultado.indice}`
                        : 'No encontrado'
                    }
                </div>
            </div>
            <div class="algorithm-step">
                <div class="algorithm-step-header">Comparaciones:</div>
                <div class="algorithm-step-content">${
                  resultado.comparaciones
                }</div>
            </div>
            <div class="algorithm-step">
                <div class="algorithm-step-header">Tiempo:</div>
                <div class="algorithm-step-content">${tiempo.toFixed(4)}ms</div>
            </div>
        `;

    this.visualizarBusqueda(array, target, resultado, 'binaria');
  }

  binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    let comparaciones = 0;

    while (left <= right) {
      comparaciones++;
      const mid = Math.floor((left + right) / 2);

      if (arr[mid] === target) {
        return { encontrado: true, indice: mid, comparaciones };
      } else if (arr[mid] < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return { encontrado: false, indice: -1, comparaciones };
  }

  visualizarBusqueda(array, target, resultado, tipo) {
    const visualization = document.getElementById('search-visualization');
    let html = `
            <div class="algorithm-step">
                <div class="algorithm-step-header">Algoritmo: ${
                  tipo === 'lineal' ? 'Búsqueda Lineal' : 'Búsqueda Binaria'
                }</div>
                <div class="algorithm-step-content">
                    Complejidad: ${tipo === 'lineal' ? 'O(n)' : 'O(log n)'}
                </div>
            </div>
            <div class="algorithm-step">
                <div class="algorithm-step-header">Visualización:</div>
                <div class="algorithm-step-content">
        `;

    array.forEach((value, index) => {
      let className = '';
      if (resultado.encontrado && index === resultado.indice) {
        className = 'highlighted';
      }
      html += `<span class="${className}">[${value}]</span> `;
    });

    html += '</div></div>';
    visualization.innerHTML = html;
  }

  compararBusquedas() {
    const arrayInput = document.getElementById('search-array').value;
    const target = parseInt(document.getElementById('search-target').value);

    if (!arrayInput || isNaN(target)) {
      alert('Por favor ingresa un array y un número a buscar');
      return;
    }

    const array = arrayInput
      .split(',')
      .map(num => parseInt(num.trim()))
      .filter(num => !isNaN(num));

    const lineal = this.medirRendimiento(
      'Búsqueda Lineal',
      this.linearSearch,
      array,
      target
    );
    const binaria = this.medirRendimiento(
      'Búsqueda Binaria',
      this.binarySearch,
      array,
      target
    );

    const resultados = {
      'Búsqueda Lineal': {
        tiempo: lineal.tiempo,
        resultado: lineal.resultado,
      },
      'Búsqueda Binaria': {
        tiempo: binaria.tiempo,
        resultado: binaria.resultado,
      },
    };

    this.mostrarComparacion(resultados);
  }

  // =============================================
  // Algoritmos Numéricos
  // =============================================

  verificarPrimo() {
    const numero = parseInt(document.getElementById('numeric-input').value);
    if (isNaN(numero) || numero < 2) {
      alert('Por favor ingresa un número mayor o igual a 2');
      return;
    }

    const { resultado, tiempo } = this.medirRendimiento(
      'Verificar Primo',
      this.isPrime,
      numero
    );

    const resultadoElement = document.getElementById('numeric-result');
    resultadoElement.innerHTML = `
            <div class="algorithm-step">
                <div class="algorithm-step-header">Número:</div>
                <div class="algorithm-step-content">${numero}</div>
            </div>
            <div class="algorithm-step">
                <div class="algorithm-step-header">Resultado:</div>
                <div class="algorithm-step-content">
                    ${resultado ? 'ES PRIMO' : 'NO ES PRIMO'}
                </div>
            </div>
            <div class="algorithm-step">
                <div class="algorithm-step-header">Tiempo:</div>
                <div class="algorithm-step-content">${tiempo.toFixed(4)}ms</div>
            </div>
        `;

    this.visualizarNumerico(numero, resultado, 'primo');
  }

  isPrime(n) {
    if (n < 2) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;

    for (let i = 3; i * i <= n; i += 2) {
      if (n % i === 0) return false;
    }
    return true;
  }

  generarFibonacci() {
    const numero = parseInt(document.getElementById('numeric-input').value);
    if (isNaN(numero) || numero < 0) {
      alert('Por favor ingresa un número mayor o igual a 0');
      return;
    }

    const { resultado, tiempo } = this.medirRendimiento(
      'Fibonacci',
      this.fibonacci,
      numero
    );

    const resultadoElement = document.getElementById('numeric-result');
    resultadoElement.innerHTML = `
            <div class="algorithm-step">
                <div class="algorithm-step-header">Secuencia Fibonacci hasta ${numero}:</div>
                <div class="algorithm-step-content">[${resultado.join(
                  ', '
                )}]</div>
            </div>
            <div class="algorithm-step">
                <div class="algorithm-step-header">Cantidad de números:</div>
                <div class="algorithm-step-content">${resultado.length}</div>
            </div>
            <div class="algorithm-step">
                <div class="algorithm-step-header">Tiempo:</div>
                <div class="algorithm-step-content">${tiempo.toFixed(4)}ms</div>
            </div>
        `;

    this.visualizarNumerico(numero, resultado, 'fibonacci');
  }

  fibonacci(n) {
    if (n <= 0) return [];
    if (n === 1) return [0];
    if (n === 2) return [0, 1];

    const sequence = [0, 1];
    for (let i = 2; i < n; i++) {
      sequence[i] = sequence[i - 1] + sequence[i - 2];
    }
    return sequence;
  }

  calcularFactorial() {
    const numero = parseInt(document.getElementById('numeric-input').value);
    if (isNaN(numero) || numero < 0) {
      alert('Por favor ingresa un número mayor o igual a 0');
      return;
    }

    const { resultado, tiempo } = this.medirRendimiento(
      'Factorial',
      this.factorial,
      numero
    );

    const resultadoElement = document.getElementById('numeric-result');
    resultadoElement.innerHTML = `
            <div class="algorithm-step">
                <div class="algorithm-step-header">Factorial de ${numero}:</div>
                <div class="algorithm-step-content">${resultado}</div>
            </div>
            <div class="algorithm-step">
                <div class="algorithm-step-header">Tiempo:</div>
                <div class="algorithm-step-content">${tiempo.toFixed(4)}ms</div>
            </div>
        `;
  }

  factorial(n) {
    if (n <= 1) return 1;
    return n * this.factorial(n - 1);
  }

  encontrarPrimos() {
    const numero = parseInt(document.getElementById('numeric-input').value);
    if (isNaN(numero) || numero < 2) {
      alert('Por favor ingresa un número mayor o igual a 2');
      return;
    }

    const { resultado, tiempo } = this.medirRendimiento(
      'Criba de Eratóstenes',
      this.sieveOfEratosthenes,
      numero
    );

    const resultadoElement = document.getElementById('numeric-result');
    resultadoElement.innerHTML = `
            <div class="algorithm-step">
                <div class="algorithm-step-header">Números primos hasta ${numero}:</div>
                <div class="algorithm-step-content">[${resultado.join(
                  ', '
                )}]</div>
            </div>
            <div class="algorithm-step">
                <div class="algorithm-step-header">Cantidad de primos:</div>
                <div class="algorithm-step-content">${resultado.length}</div>
            </div>
            <div class="algorithm-step">
                <div class="algorithm-step-header">Tiempo:</div>
                <div class="algorithm-step-content">${tiempo.toFixed(4)}ms</div>
            </div>
        `;
  }

  sieveOfEratosthenes(n) {
    const primes = [];
    const isPrime = new Array(n + 1).fill(true);
    isPrime[0] = isPrime[1] = false;

    for (let i = 2; i * i <= n; i++) {
      if (isPrime[i]) {
        for (let j = i * i; j <= n; j += i) {
          isPrime[j] = false;
        }
      }
    }

    for (let i = 2; i <= n; i++) {
      if (isPrime[i]) {
        primes.push(i);
      }
    }

    return primes;
  }

  visualizarNumerico(numero, resultado, tipo) {
    const visualization = document.getElementById('numeric-visualization');
    let html = '';

    switch (tipo) {
      case 'primo':
        html = `
                    <div class="algorithm-step">
                        <div class="algorithm-step-header">Verificación de Primalidad:</div>
                        <div class="algorithm-step-content">
                            ${numero} ${resultado ? 'es primo' : 'no es primo'}
                        </div>
                    </div>
                `;
        break;
      case 'fibonacci':
        html = `
                    <div class="algorithm-step">
                        <div class="algorithm-step-header">Secuencia Fibonacci:</div>
                        <div class="algorithm-step-content">
                            ${resultado
                              .map((num, index) => `F(${index}) = ${num}`)
                              .join('<br>')}
                        </div>
                    </div>
                `;
        break;
    }

    visualization.innerHTML = html;
  }

  // =============================================
  // Algoritmos de Cadenas
  // =============================================

  frecuenciaCaracteres() {
    const texto = document.getElementById('string-input').value;
    if (!texto) {
      alert('Por favor ingresa un texto');
      return;
    }

    const { resultado, tiempo } = this.medirRendimiento(
      'Frecuencia de Caracteres',
      this.characterFrequency,
      texto
    );

    const resultadoElement = document.getElementById('string-result');
    let html = `
            <div class="algorithm-step">
                <div class="algorithm-step-header">Frecuencia de Caracteres:</div>
                <div class="algorithm-step-content">
        `;

    Object.entries(resultado)
      .sort((a, b) => b[1] - a[1])
      .forEach(([char, count]) => {
        html += `'${char}': ${count}<br>`;
      });

    html += `</div></div>
            <div class="algorithm-step">
                <div class="algorithm-step-header">Tiempo:</div>
                <div class="algorithm-step-content">${tiempo.toFixed(4)}ms</div>
            </div>
        `;

    resultadoElement.innerHTML = html;
  }

  characterFrequency(str) {
    const frequency = {};
    for (const char of str) {
      frequency[char] = (frequency[char] || 0) + 1;
    }
    return frequency;
  }

  frecuenciaPalabras() {
    const texto = document.getElementById('string-input').value;
    if (!texto) {
      alert('Por favor ingresa un texto');
      return;
    }

    const { resultado, tiempo } = this.medirRendimiento(
      'Frecuencia de Palabras',
      this.wordFrequency,
      texto
    );

    const resultadoElement = document.getElementById('string-result');
    let html = `
            <div class="algorithm-step">
                <div class="algorithm-step-header">Frecuencia de Palabras:</div>
                <div class="algorithm-step-content">
        `;

    Object.entries(resultado)
      .sort((a, b) => b[1] - a[1])
      .forEach(([word, count]) => {
        html += `'${word}': ${count}<br>`;
      });

    html += `</div></div>
            <div class="algorithm-step">
                <div class="algorithm-step-header">Tiempo:</div>
                <div class="algorithm-step-content">${tiempo.toFixed(4)}ms</div>
            </div>
        `;

    resultadoElement.innerHTML = html;
  }

  wordFrequency(str) {
    const words = str.toLowerCase().match(/\b\w+\b/g) || [];
    const frequency = {};

    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });

    return frequency;
  }

  encontrarAnagramas() {
    const texto = document.getElementById('string-input').value;
    if (!texto) {
      alert('Por favor ingresa un texto');
      return;
    }

    const { resultado, tiempo } = this.medirRendimiento(
      'Encontrar Anagramas',
      this.findAnagrams,
      texto
    );

    const resultadoElement = document.getElementById('string-result');
    let html = `
            <div class="algorithm-step">
                <div class="algorithm-step-header">Grupos de Anagramas:</div>
                <div class="algorithm-step-content">
        `;

    resultado.forEach((group, index) => {
      if (group.length > 1) {
        html += `Grupo ${index + 1}: [${group.join(', ')}]<br>`;
      }
    });

    html += `</div></div>
            <div class="algorithm-step">
                <div class="algorithm-step-header">Tiempo:</div>
                <div class="algorithm-step-content">${tiempo.toFixed(4)}ms</div>
            </div>
        `;

    resultadoElement.innerHTML = html;
  }

  findAnagrams(str) {
    const words = str.toLowerCase().match(/\b\w+\b/g) || [];
    const anagramGroups = {};

    words.forEach(word => {
      const sorted = word.split('').sort().join('');
      if (!anagramGroups[sorted]) {
        anagramGroups[sorted] = [];
      }
      anagramGroups[sorted].push(word);
    });

    return Object.values(anagramGroups);
  }

  analisisCompleto() {
    const texto = document.getElementById('string-input').value;
    if (!texto) {
      alert('Por favor ingresa un texto');
      return;
    }

    const caracteresCount = this.characterFrequency(texto);
    const palabrasCount = this.wordFrequency(texto);
    const anagramas = this.findAnagrams(texto);

    const resultadoElement = document.getElementById('string-result');
    resultadoElement.innerHTML = `
            <div class="algorithm-step">
                <div class="algorithm-step-header">Análisis Completo del Texto:</div>
                <div class="algorithm-step-content">
                    Caracteres totales: ${texto.length}<br>
                    Palabras totales: ${Object.values(palabrasCount).reduce(
                      (a, b) => a + b,
                      0
                    )}<br>
                    Palabras únicas: ${Object.keys(palabrasCount).length}<br>
                    Caracteres únicos: ${
                      Object.keys(caracteresCount).length
                    }<br>
                    Grupos de anagramas: ${
                      anagramas.filter(group => group.length > 1).length
                    }
                </div>
            </div>
        `;
  }

  // =============================================
  // Algoritmos de Grafos
  // =============================================

  recorridoBFS() {
    const grafoInput = document.getElementById('graph-input').value;
    const nodoInicio = document.getElementById('start-node').value;

    if (!grafoInput || !nodoInicio) {
      alert('Por favor ingresa un grafo y un nodo de inicio');
      return;
    }

    const grafo = this.parseGraph(grafoInput);
    const { resultado, tiempo } = this.medirRendimiento(
      'BFS',
      this.bfs,
      grafo,
      nodoInicio
    );

    const resultadoElement = document.getElementById('graph-result');
    resultadoElement.innerHTML = `
            <div class="algorithm-step">
                <div class="algorithm-step-header">Recorrido BFS desde ${nodoInicio}:</div>
                <div class="algorithm-step-content">[${resultado.join(
                  ' → '
                )}]</div>
            </div>
            <div class="algorithm-step">
                <div class="algorithm-step-header">Nodos visitados:</div>
                <div class="algorithm-step-content">${resultado.length}</div>
            </div>
            <div class="algorithm-step">
                <div class="algorithm-step-header">Tiempo:</div>
                <div class="algorithm-step-content">${tiempo.toFixed(4)}ms</div>
            </div>
        `;

    this.visualizarGrafo(grafo, resultado, 'bfs');
  }

  bfs(graph, start) {
    const visited = new Set();
    const queue = [start];
    const result = [];

    while (queue.length > 0) {
      const node = queue.shift();

      if (!visited.has(node)) {
        visited.add(node);
        result.push(node);

        if (graph[node]) {
          graph[node].forEach(neighbor => {
            if (!visited.has(neighbor)) {
              queue.push(neighbor);
            }
          });
        }
      }
    }

    return result;
  }

  recorridoDFS() {
    const grafoInput = document.getElementById('graph-input').value;
    const nodoInicio = document.getElementById('start-node').value;

    if (!grafoInput || !nodoInicio) {
      alert('Por favor ingresa un grafo y un nodo de inicio');
      return;
    }

    const grafo = this.parseGraph(grafoInput);
    const { resultado, tiempo } = this.medirRendimiento(
      'DFS',
      this.dfs,
      grafo,
      nodoInicio
    );

    const resultadoElement = document.getElementById('graph-result');
    resultadoElement.innerHTML = `
            <div class="algorithm-step">
                <div class="algorithm-step-header">Recorrido DFS desde ${nodoInicio}:</div>
                <div class="algorithm-step-content">[${resultado.join(
                  ' → '
                )}]</div>
            </div>
            <div class="algorithm-step">
                <div class="algorithm-step-header">Nodos visitados:</div>
                <div class="algorithm-step-content">${resultado.length}</div>
            </div>
            <div class="algorithm-step">
                <div class="algorithm-step-header">Tiempo:</div>
                <div class="algorithm-step-content">${tiempo.toFixed(4)}ms</div>
            </div>
        `;

    this.visualizarGrafo(grafo, resultado, 'dfs');
  }

  dfs(graph, start, visited = new Set(), result = []) {
    visited.add(start);
    result.push(start);

    if (graph[start]) {
      graph[start].forEach(neighbor => {
        if (!visited.has(neighbor)) {
          this.dfs(graph, neighbor, visited, result);
        }
      });
    }

    return result;
  }

  parseGraph(input) {
    const graph = {};
    const edges = input.split(',').map(edge => edge.trim());

    edges.forEach(edge => {
      const [nodeA, nodeB] = edge.split('-').map(node => node.trim());

      if (!graph[nodeA]) graph[nodeA] = [];
      if (!graph[nodeB]) graph[nodeB] = [];

      graph[nodeA].push(nodeB);
      graph[nodeB].push(nodeA);
    });

    return graph;
  }

  visualizarGrafo(grafo, recorrido, tipo) {
    const canvas = document.getElementById('graph-canvas');
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const nodes = Object.keys(grafo);
    const nodePositions = {};

    // Posicionar nodos en círculo
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 50;

    nodes.forEach((node, index) => {
      const angle = (2 * Math.PI * index) / nodes.length;
      nodePositions[node] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });

    // Dibujar aristas
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;

    Object.entries(grafo).forEach(([node, neighbors]) => {
      neighbors.forEach(neighbor => {
        const startPos = nodePositions[node];
        const endPos = nodePositions[neighbor];

        ctx.beginPath();
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(endPos.x, endPos.y);
        ctx.stroke();
      });
    });

    // Dibujar nodos
    nodes.forEach((node, index) => {
      const pos = nodePositions[node];
      const visitOrder = recorrido.indexOf(node);

      // Color según orden de visita
      if (visitOrder !== -1) {
        const hue = (visitOrder * 60) % 360;
        ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;
      } else {
        ctx.fillStyle = '#e2e8f0';
      }

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 20, 0, 2 * Math.PI);
      ctx.fill();

      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Etiqueta del nodo
      ctx.fillStyle = '#1e293b';
      ctx.font = '14px bold';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node, pos.x, pos.y);

      // Número de orden
      if (visitOrder !== -1) {
        ctx.fillStyle = 'white';
        ctx.font = '10px bold';
        ctx.fillText((visitOrder + 1).toString(), pos.x, pos.y + 25);
      }
    });

    // Título
    ctx.fillStyle = '#1e293b';
    ctx.font = '16px bold';
    ctx.textAlign = 'center';
    ctx.fillText(`Recorrido ${tipo.toUpperCase()}`, canvas.width / 2, 20);
  }

  generarGrafo() {
    const nodes = ['A', 'B', 'C', 'D', 'E', 'F'];
    const edges = [];

    // Generar aristas aleatorias
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (Math.random() < 0.4) {
          edges.push(`${nodes[i]}-${nodes[j]}`);
        }
      }
    }

    // Asegurar que el grafo esté conectado
    for (let i = 0; i < nodes.length - 1; i++) {
      if (Math.random() < 0.6) {
        edges.push(`${nodes[i]}-${nodes[i + 1]}`);
      }
    }

    document.getElementById('graph-input').value = edges.join(',');
    document.getElementById('start-node').value = nodes[0];
  }

  // =============================================
  // Utilidades
  // =============================================

  exportarComparacion() {
    const data = {
      estadisticas: this.estadisticas,
      historial: this.historialRendimiento,
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'algoritmos-comparacion.json';
    a.click();

    URL.revokeObjectURL(url);
  }

  resetearTodo() {
    if (
      confirm('¿Estás seguro de que quieres resetear todas las estadísticas?')
    ) {
      this.estadisticas = {
        algoritmosEjecutados: 0,
        tiempoTotal: 0,
        algoritmoMasRapido: null,
        ultimoResultado: null,
      };
      this.historialRendimiento = [];
      this.actualizarPanelEstadisticas();

      // Limpiar todos los resultados
      document
        .querySelectorAll('.result-content, .visualization-content')
        .forEach(el => {
          el.innerHTML = '';
        });

      localStorage.removeItem('algorithm-stats');
    }
  }

  cargarEstadisticas() {
    const statsGuardadas = localStorage.getItem('algorithm-stats');
    if (statsGuardadas) {
      try {
        const datos = JSON.parse(statsGuardadas);
        this.estadisticas = { ...this.estadisticas, ...datos.estadisticas };
        this.historialRendimiento = datos.historial || [];
      } catch (e) {
        console.error('Error al cargar estadísticas:', e);
      }
    }

    const temaGuardado = localStorage.getItem('algorithm-tema');
    if (temaGuardado) {
      this.tema = temaGuardado;
      document.body.setAttribute('data-theme', this.tema);
      document.getElementById('toggle-theme').textContent =
        this.tema === 'light' ? '🌙' : '☀️';
    }
  }

  guardarEstadisticas() {
    const datos = {
      estadisticas: this.estadisticas,
      historial: this.historialRendimiento,
    };
    localStorage.setItem('algorithm-stats', JSON.stringify(datos));
  }
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
  const app = new AlgorithmApp();

  // Guardar estadísticas periódicamente
  setInterval(() => {
    app.guardarEstadisticas();
  }, 30000); // Cada 30 segundos

  // Guardar al salir
  window.addEventListener('beforeunload', () => {
    app.guardarEstadisticas();
  });
});

// Exponer la aplicación globalmente para debugging
window.algorithmApp = null;
document.addEventListener('DOMContentLoaded', () => {
  window.algorithmApp = new AlgorithmApp();
});
