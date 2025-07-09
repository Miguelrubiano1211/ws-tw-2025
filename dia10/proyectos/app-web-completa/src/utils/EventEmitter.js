/**
 * EVENT EMITTER - Patrón Observer
 *
 * Implementación del patrón Observer para comunicación
 * entre componentes sin acoplamiento directo
 *
 * Características ES6+:
 * - Clases ES6 con métodos públicos y privados
 * - Map para almacenar listeners
 * - Spread operator para argumentos
 * - Arrow functions para callbacks
 * - Destructuring en parámetros
 * - Symbol para eventos privados
 * - WeakMap para metadatos
 */

export class EventEmitter {
  constructor() {
    // Map para almacenar listeners por evento
    this.listeners = new Map();

    // Map para almacenar listeners que solo se ejecutan una vez
    this.onceListeners = new Map();

    // WeakMap para metadatos de listeners
    this.listenerMetadata = new WeakMap();

    // Configuración
    this.config = {
      maxListeners: 100,
      captureRejections: true,
      enableWarnings: true,
    };

    // Estadísticas
    this.stats = {
      eventsEmitted: 0,
      listenersAdded: 0,
      listenersRemoved: 0,
    };
  }

  /**
   * Agrega un listener para un evento
   */
  on(event, listener, options = {}) {
    if (typeof listener !== 'function') {
      throw new TypeError('Listener must be a function');
    }

    // Verificar límite de listeners
    this.checkMaxListeners(event);

    // Crear conjunto de listeners si no existe
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    // Agregar listener
    this.listeners.get(event).add(listener);

    // Agregar metadatos
    this.listenerMetadata.set(listener, {
      event,
      added: Date.now(),
      callCount: 0,
      ...options,
    });

    // Actualizar estadísticas
    this.stats.listenersAdded++;

    // Emitir evento newListener
    this.emit('newListener', event, listener);

    return this;
  }

  /**
   * Agrega un listener que se ejecuta solo una vez
   */
  once(event, listener, options = {}) {
    if (typeof listener !== 'function') {
      throw new TypeError('Listener must be a function');
    }

    // Wrapper que se auto-remueve
    const onceWrapper = (...args) => {
      this.off(event, onceWrapper);
      listener.apply(this, args);
    };

    // Mantener referencia al listener original
    onceWrapper.original = listener;

    return this.on(event, onceWrapper, { ...options, once: true });
  }

  /**
   * Remueve un listener específico
   */
  off(event, listener) {
    if (!this.listeners.has(event)) {
      return this;
    }

    const eventListeners = this.listeners.get(event);

    // Buscar listener (incluyendo wrappers de once)
    for (const l of eventListeners) {
      if (l === listener || l.original === listener) {
        eventListeners.delete(l);
        this.listenerMetadata.delete(l);
        this.stats.listenersRemoved++;

        // Emitir evento removeListener
        this.emit('removeListener', event, l);
        break;
      }
    }

    // Limpiar conjunto vacío
    if (eventListeners.size === 0) {
      this.listeners.delete(event);
    }

    return this;
  }

  /**
   * Remueve todos los listeners de un evento
   */
  removeAllListeners(event) {
    if (event) {
      // Remover listeners de un evento específico
      if (this.listeners.has(event)) {
        const eventListeners = this.listeners.get(event);

        for (const listener of eventListeners) {
          this.listenerMetadata.delete(listener);
          this.stats.listenersRemoved++;
          this.emit('removeListener', event, listener);
        }

        this.listeners.delete(event);
      }
    } else {
      // Remover todos los listeners
      for (const [eventName, eventListeners] of this.listeners) {
        for (const listener of eventListeners) {
          this.listenerMetadata.delete(listener);
          this.stats.listenersRemoved++;
          this.emit('removeListener', eventName, listener);
        }
      }

      this.listeners.clear();
    }

    return this;
  }

  /**
   * Emite un evento
   */
  emit(event, ...args) {
    this.stats.eventsEmitted++;

    // Verificar si hay listeners
    if (!this.listeners.has(event)) {
      return false;
    }

    const eventListeners = this.listeners.get(event);

    if (eventListeners.size === 0) {
      return false;
    }

    // Crear copia para evitar modificaciones durante iteración
    const listenersArray = Array.from(eventListeners);

    // Ejecutar listeners
    for (const listener of listenersArray) {
      try {
        // Actualizar metadatos
        const metadata = this.listenerMetadata.get(listener);
        if (metadata) {
          metadata.callCount++;
          metadata.lastCall = Date.now();
        }

        // Ejecutar listener
        listener.apply(this, args);
      } catch (error) {
        if (this.config.captureRejections) {
          this.emit('error', error, event, listener);
        } else {
          throw error;
        }
      }
    }

    return true;
  }

  /**
   * Emite un evento de forma asíncrona
   */
  async emitAsync(event, ...args) {
    if (!this.listeners.has(event)) {
      return false;
    }

    const eventListeners = this.listeners.get(event);

    if (eventListeners.size === 0) {
      return false;
    }

    // Ejecutar listeners de forma asíncrona
    const promises = Array.from(eventListeners).map(async listener => {
      try {
        // Actualizar metadatos
        const metadata = this.listenerMetadata.get(listener);
        if (metadata) {
          metadata.callCount++;
          metadata.lastCall = Date.now();
        }

        // Ejecutar listener
        return await listener.apply(this, args);
      } catch (error) {
        if (this.config.captureRejections) {
          this.emit('error', error, event, listener);
        } else {
          throw error;
        }
      }
    });

    await Promise.all(promises);
    return true;
  }

  /**
   * Emite un evento con timeout
   */
  async emitWithTimeout(event, timeout, ...args) {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Event timeout')), timeout);
    });

    const emitPromise = this.emitAsync(event, ...args);

    return Promise.race([emitPromise, timeoutPromise]);
  }

  /**
   * Obtiene listeners de un evento
   */
  listeners(event) {
    if (!this.listeners.has(event)) {
      return [];
    }

    return Array.from(this.listeners.get(event));
  }

  /**
   * Obtiene número de listeners para un evento
   */
  listenerCount(event) {
    if (!this.listeners.has(event)) {
      return 0;
    }

    return this.listeners.get(event).size;
  }

  /**
   * Obtiene todos los nombres de eventos
   */
  eventNames() {
    return Array.from(this.listeners.keys());
  }

  /**
   * Verifica si tiene listeners para un evento
   */
  hasListeners(event) {
    return this.listeners.has(event) && this.listeners.get(event).size > 0;
  }

  /**
   * Antepone un listener (lo ejecuta primero)
   */
  prependListener(event, listener) {
    // Implementación que mantiene orden
    const currentListeners = this.listeners(event);
    this.removeAllListeners(event);

    this.on(event, listener);

    currentListeners.forEach(l => this.on(event, l));

    return this;
  }

  /**
   * Antepone un listener de una sola ejecución
   */
  prependOnceListener(event, listener) {
    const currentListeners = this.listeners(event);
    this.removeAllListeners(event);

    this.once(event, listener);

    currentListeners.forEach(l => this.on(event, l));

    return this;
  }

  /**
   * Pipe de eventos a otro EventEmitter
   */
  pipe(target, events = []) {
    if (!target || typeof target.emit !== 'function') {
      throw new TypeError('Target must be an EventEmitter');
    }

    const eventsToForward = events.length > 0 ? events : this.eventNames();

    eventsToForward.forEach(event => {
      this.on(event, (...args) => {
        target.emit(event, ...args);
      });
    });

    return target;
  }

  /**
   * Mixin de eventos con otro objeto
   */
  static mixin(target) {
    const emitter = new EventEmitter();

    // Copiar métodos al target
    Object.getOwnPropertyNames(EventEmitter.prototype).forEach(name => {
      if (name !== 'constructor') {
        target[name] = emitter[name].bind(emitter);
      }
    });

    return target;
  }

  /**
   * Crea un proxy que emite eventos en cambios
   */
  static proxy(target, emitter) {
    return new Proxy(target, {
      set(obj, prop, value) {
        const oldValue = obj[prop];
        obj[prop] = value;

        emitter.emit('change', prop, value, oldValue);
        emitter.emit(`change:${prop}`, value, oldValue);

        return true;
      },

      deleteProperty(obj, prop) {
        const oldValue = obj[prop];
        delete obj[prop];

        emitter.emit('delete', prop, oldValue);
        emitter.emit(`delete:${prop}`, oldValue);

        return true;
      },
    });
  }

  /**
   * Configuración
   */
  setMaxListeners(n) {
    this.config.maxListeners = n;
    return this;
  }

  getMaxListeners() {
    return this.config.maxListeners;
  }

  setCaptureRejections(capture) {
    this.config.captureRejections = capture;
    return this;
  }

  setWarnings(enabled) {
    this.config.enableWarnings = enabled;
    return this;
  }

  /**
   * Utilidades
   */
  checkMaxListeners(event) {
    const count = this.listenerCount(event);

    if (count >= this.config.maxListeners && this.config.enableWarnings) {
      console.warn(
        `MaxListenersExceededWarning: Possible EventEmitter memory leak detected. ${count} listeners added. Use emitter.setMaxListeners() to increase limit.`
      );
    }
  }

  /**
   * Información de debugging
   */
  debug() {
    const info = {
      events: this.eventNames().length,
      totalListeners: 0,
      stats: this.stats,
      eventDetails: {},
    };

    for (const [event, listeners] of this.listeners) {
      info.totalListeners += listeners.size;
      info.eventDetails[event] = {
        listenerCount: listeners.size,
        listeners: Array.from(listeners).map(l => {
          const metadata = this.listenerMetadata.get(l);
          return {
            name: l.name || 'anonymous',
            callCount: metadata?.callCount || 0,
            added: metadata?.added || 0,
            lastCall: metadata?.lastCall || 0,
          };
        }),
      };
    }

    return info;
  }

  /**
   * Obtiene estadísticas
   */
  getStats() {
    return {
      ...this.stats,
      events: this.eventNames().length,
      totalListeners: Array.from(this.listeners.values()).reduce(
        (sum, listeners) => sum + listeners.size,
        0
      ),
    };
  }

  /**
   * Limpia el EventEmitter
   */
  destroy() {
    this.removeAllListeners();
    this.listenerMetadata = new WeakMap();
    this.stats = {
      eventsEmitted: 0,
      listenersAdded: 0,
      listenersRemoved: 0,
    };
  }
}

/**
 * Instancia global para eventos de aplicación
 */
export const globalEmitter = new EventEmitter();

/**
 * Decorador para hacer una clase observable
 */
export function observable(target) {
  return EventEmitter.mixin(target);
}

/**
 * Función para crear listeners con limpieza automática
 */
export function autoCleanupListener(emitter, event, listener, cleanup) {
  emitter.on(event, listener);

  return () => {
    emitter.off(event, listener);
    if (cleanup) cleanup();
  };
}

/* 
📚 NOTAS PEDAGÓGICAS:

1. **Observer Pattern**: Implementación completa del patrón Observer
2. **Map/Set**: Uso de estructuras de datos modernas
3. **WeakMap**: Para metadatos sin interferir con garbage collection
4. **Spread Operator**: Para pasar argumentos dinámicos
5. **Arrow Functions**: Para mantener contexto en callbacks
6. **Async/Await**: Para emisión asíncrona de eventos
7. **Proxy**: Para crear objetos observables
8. **Decorators**: Patrón decorator para mixins
9. **Error Handling**: Manejo robusto de errores
10. **Memory Management**: Limpieza automática y detección de leaks

🎯 EJERCICIOS SUGERIDOS:
- Implementar namespace de eventos
- Agregar eventos con prioridad
- Crear sistema de eventos persistentes
- Implementar event sourcing básico
*/
