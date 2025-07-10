/**
 * 🔗 Día 13 - Ejercicio 1: Fetch API y Async Data Loading
 *
 * Objetivos:
 * - Implementar cliente REST con Fetch API
 * - Manejar peticiones asíncronas con async/await
 * - Procesar diferentes tipos de respuesta HTTP
 * - Aplicar patrones de carga de datos eficientes
 */

// Simulación de servidor (para testing local)
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Datos de ejemplo
let usuarios = [
  { id: 1, nombre: 'Juan Pérez', email: 'juan@ejemplo.com', activo: true },
  { id: 2, nombre: 'María García', email: 'maria@ejemplo.com', activo: true },
  { id: 3, nombre: 'Carlos López', email: 'carlos@ejemplo.com', activo: false },
];

// Rutas de ejemplo
app.get('/api/usuarios', (req, res) => {
  setTimeout(() => {
    res.json({
      success: true,
      data: usuarios,
      count: usuarios.length,
    });
  }, 1000); // Simular latencia
});

app.get('/api/usuarios/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const usuario = usuarios.find(u => u.id === id);

  if (!usuario) {
    return res.status(404).json({
      success: false,
      error: 'Usuario no encontrado',
    });
  }

  res.json({
    success: true,
    data: usuario,
  });
});

app.post('/api/usuarios', (req, res) => {
  const { nombre, email } = req.body;

  if (!nombre || !email) {
    return res.status(400).json({
      success: false,
      error: 'Nombre y email son requeridos',
    });
  }

  const nuevoUsuario = {
    id: usuarios.length + 1,
    nombre,
    email,
    activo: true,
  };

  usuarios.push(nuevoUsuario);

  res.status(201).json({
    success: true,
    data: nuevoUsuario,
  });
});

app.put('/api/usuarios/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const usuarioIndex = usuarios.findIndex(u => u.id === id);

  if (usuarioIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Usuario no encontrado',
    });
  }

  usuarios[usuarioIndex] = {
    ...usuarios[usuarioIndex],
    ...req.body,
  };

  res.json({
    success: true,
    data: usuarios[usuarioIndex],
  });
});

app.delete('/api/usuarios/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const usuarioIndex = usuarios.findIndex(u => u.id === id);

  if (usuarioIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Usuario no encontrado',
    });
  }

  usuarios.splice(usuarioIndex, 1);

  res.json({
    success: true,
    message: 'Usuario eliminado correctamente',
  });
});

// Iniciar servidor de prueba
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor de prueba ejecutándose en puerto ${PORT}`);
});

// ============================================================================
// CLIENTE FETCH API
// ============================================================================

/**
 * Cliente HTTP basado en Fetch API
 */
class FetchClient {
  constructor(baseURL = 'http://localhost:3001') {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
  }

  /**
   * Método genérico para hacer peticiones HTTP
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const config = {
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
      ...options,
    };

    console.log(`📡 ${config.method || 'GET'} ${url}`);

    try {
      const response = await fetch(url, config);

      // Obtener el cuerpo de la respuesta
      const contentType = response.headers.get('content-type');
      let data;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      // Verificar si la respuesta fue exitosa
      if (!response.ok) {
        const error = new Error(`HTTP Error: ${response.status}`);
        error.status = response.status;
        error.statusText = response.statusText;
        error.data = data;
        throw error;
      }

      console.log(`✅ Respuesta exitosa:`, data);
      return data;
    } catch (error) {
      console.error(`❌ Error en petición:`, error);
      throw error;
    }
  }

  /**
   * Método GET
   */
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;

    return this.request(url, {
      method: 'GET',
    });
  }

  /**
   * Método POST
   */
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Método PUT
   */
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Método DELETE
   */
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }
}

// ============================================================================
// SERVICIO DE USUARIOS
// ============================================================================

/**
 * Servicio para operaciones CRUD de usuarios
 */
class UsuarioService {
  constructor() {
    this.client = new FetchClient();
  }

  /**
   * Obtener todos los usuarios
   */
  async obtenerUsuarios() {
    return this.client.get('/api/usuarios');
  }

  /**
   * Obtener usuario por ID
   */
  async obtenerUsuario(id) {
    return this.client.get(`/api/usuarios/${id}`);
  }

  /**
   * Crear nuevo usuario
   */
  async crearUsuario(usuario) {
    return this.client.post('/api/usuarios', usuario);
  }

  /**
   * Actualizar usuario
   */
  async actualizarUsuario(id, usuario) {
    return this.client.put(`/api/usuarios/${id}`, usuario);
  }

  /**
   * Eliminar usuario
   */
  async eliminarUsuario(id) {
    return this.client.delete(`/api/usuarios/${id}`);
  }
}

// ============================================================================
// DEMOSTRACIONES PRÁCTICAS
// ============================================================================

/**
 * Demostración de uso del cliente Fetch
 */
async function demostrarFetchClient() {
  console.log('\n🔍 DEMOSTRACIÓN DE FETCH API CLIENT');
  console.log('=====================================');

  const usuarioService = new UsuarioService();

  try {
    // 1. Obtener todos los usuarios
    console.log('\n1. Obtener todos los usuarios:');
    const usuarios = await usuarioService.obtenerUsuarios();
    console.log('Usuarios obtenidos:', usuarios.data);

    // 2. Obtener un usuario específico
    console.log('\n2. Obtener usuario específico (ID: 1):');
    const usuario = await usuarioService.obtenerUsuario(1);
    console.log('Usuario obtenido:', usuario.data);

    // 3. Crear nuevo usuario
    console.log('\n3. Crear nuevo usuario:');
    const nuevoUsuario = {
      nombre: 'Ana Martínez',
      email: 'ana@ejemplo.com',
    };
    const usuarioCreado = await usuarioService.crearUsuario(nuevoUsuario);
    console.log('Usuario creado:', usuarioCreado.data);

    // 4. Actualizar usuario
    console.log('\n4. Actualizar usuario:');
    const usuarioActualizado = await usuarioService.actualizarUsuario(1, {
      nombre: 'Juan Carlos Pérez',
      email: 'juan.carlos@ejemplo.com',
    });
    console.log('Usuario actualizado:', usuarioActualizado.data);

    // 5. Eliminar usuario
    console.log('\n5. Eliminar usuario (ID: 3):');
    const respuestaEliminacion = await usuarioService.eliminarUsuario(3);
    console.log('Resultado eliminación:', respuestaEliminacion);
  } catch (error) {
    console.error('Error en demostración:', error.message);
  }
}

// ============================================================================
// PATRONES AVANZADOS DE FETCH
// ============================================================================

/**
 * Ejemplo de carga de datos paralela
 */
async function cargaParalela() {
  console.log('\n⚡ CARGA PARALELA DE DATOS');
  console.log('==========================');

  const usuarioService = new UsuarioService();

  try {
    // Cargar múltiples usuarios en paralelo
    const promesas = [
      usuarioService.obtenerUsuario(1),
      usuarioService.obtenerUsuario(2),
      usuarioService.obtenerUsuarios(),
    ];

    const [usuario1, usuario2, todosUsuarios] = await Promise.all(promesas);

    console.log('Usuario 1:', usuario1.data);
    console.log('Usuario 2:', usuario2.data);
    console.log('Total usuarios:', todosUsuarios.count);
  } catch (error) {
    console.error('Error en carga paralela:', error.message);
  }
}

/**
 * Ejemplo de carga secuencial con dependencias
 */
async function cargaSecuencial() {
  console.log('\n🔄 CARGA SECUENCIAL CON DEPENDENCIAS');
  console.log('====================================');

  const usuarioService = new UsuarioService();

  try {
    // 1. Obtener lista de usuarios
    const usuarios = await usuarioService.obtenerUsuarios();
    console.log(`Encontrados ${usuarios.count} usuarios`);

    // 2. Obtener detalles del primer usuario
    if (usuarios.data.length > 0) {
      const primerUsuario = usuarios.data[0];
      const detalleUsuario = await usuarioService.obtenerUsuario(
        primerUsuario.id
      );
      console.log('Detalle del primer usuario:', detalleUsuario.data);
    }
  } catch (error) {
    console.error('Error en carga secuencial:', error.message);
  }
}

/**
 * Ejemplo de manejo de respuestas condicionales
 */
async function manejoCondicional() {
  console.log('\n🎯 MANEJO CONDICIONAL DE RESPUESTAS');
  console.log('===================================');

  const usuarioService = new UsuarioService();

  try {
    // Intentar obtener usuario que no existe
    const usuario = await usuarioService.obtenerUsuario(999);
    console.log('Usuario encontrado:', usuario.data);
  } catch (error) {
    if (error.status === 404) {
      console.log('Usuario no encontrado, creando uno nuevo...');

      const nuevoUsuario = {
        nombre: 'Usuario Temporal',
        email: 'temporal@ejemplo.com',
      };

      const usuarioCreado = await usuarioService.crearUsuario(nuevoUsuario);
      console.log('Usuario creado:', usuarioCreado.data);
    } else {
      console.error('Error inesperado:', error.message);
    }
  }
}

// ============================================================================
// EJECUCIÓN DE DEMOSTRACIONES
// ============================================================================

/**
 * Función principal para ejecutar todas las demostraciones
 */
async function ejecutarDemostraciones() {
  console.log('🚀 INICIANDO DEMOSTRACIONES DE FETCH API');
  console.log('==========================================');

  // Esperar un poco para que el servidor se inicie
  await new Promise(resolve => setTimeout(resolve, 2000));

  try {
    await demostrarFetchClient();
    await cargaParalela();
    await cargaSecuencial();
    await manejoCondicional();

    console.log('\n🎉 TODAS LAS DEMOSTRACIONES COMPLETADAS');
  } catch (error) {
    console.error('Error en ejecución:', error);
  }
}

// Ejecutar demostraciones después de un delay
setTimeout(ejecutarDemostraciones, 3000);

/* 
🧪 INSTRUCCIONES DE PRUEBA:

1. Instalar dependencias:
   npm install express cors

2. Ejecutar el ejercicio:
   node 01-fetch-async-data.js

3. El servidor se iniciará en puerto 3001 y ejecutará las demostraciones automáticamente

4. Para probar manualmente con curl:
   curl http://localhost:3001/api/usuarios
   curl -X POST http://localhost:3001/api/usuarios \
     -H "Content-Type: application/json" \
     -d '{"nombre": "Test User", "email": "test@example.com"}'

5. Para usar en el navegador:
   Abrir http://localhost:3001/api/usuarios en el navegador

💡 CONCEPTOS CLAVE:
- Fetch API: Método moderno para peticiones HTTP
- async/await: Sintaxis limpia para código asíncrono
- Promise.all(): Carga paralela de datos
- Error handling: Manejo de errores HTTP y de red
- Response processing: Procesamiento de diferentes tipos de respuesta
- REST patterns: Implementación de patrones REST

🔧 PATRONES DE OPTIMIZACIÓN:
- Request configuration: Configuración centralizada
- Response parsing: Procesamiento automático de respuestas
- Error standardization: Estandarización de errores
- Service layer: Capa de servicio para operaciones CRUD
- Parallel loading: Carga paralela para mejor rendimiento
- Conditional handling: Manejo condicional de respuestas

📊 MÉTRICAS DE RENDIMIENTO:
- Request time: Tiempo de respuesta de peticiones
- Parallel efficiency: Eficiencia de carga paralela
- Error rate: Tasa de errores en peticiones
- Response size: Tamaño de respuestas HTTP
*/
