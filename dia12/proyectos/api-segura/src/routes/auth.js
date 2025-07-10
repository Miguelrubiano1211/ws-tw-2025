// routes/auth.js
// Rutas de autenticación con todas las medidas de seguridad

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { validateInput } = require('../middleware/validation');
const securityConfig = require('../config/security');

/**
 * Rutas de autenticación
 * - Registro de usuarios
 * - Login con rate limiting
 * - Refresh token
 * - Logout
 * - Perfil de usuario
 * - Cambio de contraseña
 */

// Aplicar rate limiting específico para autenticación
router.use(securityConfig.getAuthRateLimit());

/**
 * @route   POST /api/auth/register
 * @desc    Registrar nuevo usuario
 * @access  Public
 */
router.post(
  '/register',
  [
    validateInput([
      { field: 'username', type: 'string', required: true, min: 3, max: 50 },
      { field: 'email', type: 'email', required: true },
      { field: 'password', type: 'password', required: true },
    ]),
  ],
  authController.register
);

/**
 * @route   POST /api/auth/login
 * @desc    Login de usuario
 * @access  Public
 */
router.post(
  '/login',
  [
    validateInput([
      { field: 'username', type: 'string', required: true },
      { field: 'password', type: 'string', required: true },
    ]),
  ],
  authController.login
);

/**
 * @route   POST /api/auth/refresh
 * @desc    Renovar access token usando refresh token
 * @access  Public
 */
router.post(
  '/refresh',
  [validateInput([{ field: 'refreshToken', type: 'string', required: true }])],
  authController.refreshToken
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout de usuario
 * @access  Private
 */
router.post('/logout', authController.logout);

/**
 * @route   GET /api/auth/profile
 * @desc    Obtener perfil del usuario autenticado
 * @access  Private
 */
router.get('/profile', authenticateToken, authController.getProfile);

/**
 * @route   PUT /api/auth/change-password
 * @desc    Cambiar contraseña del usuario
 * @access  Private
 */
router.put(
  '/change-password',
  [
    authenticateToken,
    validateInput([
      { field: 'currentPassword', type: 'string', required: true },
      { field: 'newPassword', type: 'password', required: true },
    ]),
  ],
  authController.changePassword
);

/**
 * @route   GET /api/auth/verify
 * @desc    Verificar si el token es válido
 * @access  Private
 */
router.get('/verify', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Token válido',
    user: {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role,
    },
  });
});

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Solicitar reset de contraseña
 * @access  Public
 */
router.post(
  '/forgot-password',
  [validateInput([{ field: 'email', type: 'email', required: true }])],
  async (req, res) => {
    try {
      const { email } = req.body;

      // En una aplicación real, aquí se enviaría un email
      // Para este ejemplo, solo simulamos la respuesta
      res.json({
        success: true,
        message: 'Si el email existe, se enviará un enlace de recuperación',
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'Error al procesar solicitud de recuperación',
      });
    }
  }
);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Resetear contraseña con token
 * @access  Public
 */
router.post(
  '/reset-password',
  [
    validateInput([
      { field: 'token', type: 'string', required: true },
      { field: 'newPassword', type: 'password', required: true },
    ]),
  ],
  async (req, res) => {
    try {
      const { token, newPassword } = req.body;

      // En una aplicación real, aquí se verificaría el token de reset
      // Para este ejemplo, solo simulamos la respuesta
      res.json({
        success: true,
        message: 'Contraseña restablecida exitosamente',
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'Error al restablecer contraseña',
      });
    }
  }
);

module.exports = router;
