// controllers/authController.js
// Controlador de autenticación con todas las funciones de seguridad

const bcrypt = require('bcrypt');
const database = require('../config/database');
const jwtConfig = require('../config/jwt');
const { validateEmail, validatePassword } = require('../utils/validation');
const { logSecurityEvent } = require('../utils/logger');

/**
 * Controlador de autenticación
 * - Registro de usuarios
 * - Login con validaciones
 * - Refresh tokens
 * - Logout
 * - Reset de contraseña
 */

class AuthController {
  /**
   * Registrar nuevo usuario
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async register(req, res) {
    try {
      const { username, email, password } = req.body;

      // Validaciones básicas
      if (!username || !email || !password) {
        return res.status(400).json({
          error: 'Datos incompletos',
          message: 'Username, email y password son requeridos',
        });
      }

      // Validar formato de email
      if (!validateEmail(email)) {
        return res.status(400).json({
          error: 'Email inválido',
          message: 'El formato del email no es válido',
        });
      }

      // Validar fortaleza de contraseña
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        return res.status(400).json({
          error: 'Contraseña débil',
          message: 'La contraseña debe cumplir con los requisitos de seguridad',
          requirements: passwordValidation.requirements,
        });
      }

      // Verificar si el usuario ya existe
      const existingUser = await database.get(
        'SELECT id FROM users WHERE username = ? OR email = ?',
        [username, email]
      );

      if (existingUser) {
        return res.status(409).json({
          error: 'Usuario ya existe',
          message: 'El username o email ya están registrados',
        });
      }

      // Hash de la contraseña
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Crear usuario
      const result = await database.run(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email.toLowerCase(), hashedPassword]
      );

      // Obtener usuario creado
      const newUser = await database.get(
        'SELECT id, username, email, role, created_at FROM users WHERE id = ?',
        [result.id]
      );

      // Generar tokens
      const tokens = jwtConfig.generateTokenPair(newUser);

      // Guardar refresh token
      const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      await database.run(
        'INSERT INTO refresh_tokens (token, user_id, expires_at) VALUES (?, ?, ?)',
        [tokens.refreshToken, newUser.id, refreshTokenExpiry]
      );

      // Log del evento
      logSecurityEvent('USER_REGISTERED', {
        userId: newUser.id,
        username: newUser.username,
        ip: req.ip,
      });

      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
        },
        tokens,
      });
    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'Error al registrar usuario',
      });
    }
  }

  /**
   * Login de usuario
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async login(req, res) {
    try {
      const { username, password } = req.body;
      const clientIp = req.ip;

      // Validaciones básicas
      if (!username || !password) {
        return res.status(400).json({
          error: 'Datos incompletos',
          message: 'Username y password son requeridos',
        });
      }

      // Verificar intentos de login recientes
      const recentAttempts = await database.all(
        'SELECT * FROM login_attempts WHERE ip_address = ? AND attempted_at > datetime("now", "-15 minutes")',
        [clientIp]
      );

      if (recentAttempts.length >= 5) {
        logSecurityEvent('LOGIN_BLOCKED', {
          username,
          ip: clientIp,
          attempts: recentAttempts.length,
        });

        return res.status(429).json({
          error: 'Demasiados intentos',
          message:
            'Has excedido el límite de intentos de login. Intenta en 15 minutos.',
        });
      }

      // Buscar usuario
      const user = await database.get(
        'SELECT id, username, email, password, role, active FROM users WHERE username = ? OR email = ?',
        [username, username]
      );

      if (!user) {
        // Registrar intento fallido
        await database.run(
          'INSERT INTO login_attempts (ip_address, username, successful) VALUES (?, ?, ?)',
          [clientIp, username, false]
        );

        return res.status(401).json({
          error: 'Credenciales inválidas',
          message: 'Username o contraseña incorrectos',
        });
      }

      // Verificar si el usuario está activo
      if (!user.active) {
        return res.status(403).json({
          error: 'Cuenta desactivada',
          message: 'Tu cuenta ha sido desactivada. Contacta al administrador.',
        });
      }

      // Verificar contraseña
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        // Registrar intento fallido
        await database.run(
          'INSERT INTO login_attempts (ip_address, username, successful) VALUES (?, ?, ?)',
          [clientIp, username, false]
        );

        logSecurityEvent('LOGIN_FAILED', {
          userId: user.id,
          username: user.username,
          ip: clientIp,
        });

        return res.status(401).json({
          error: 'Credenciales inválidas',
          message: 'Username o contraseña incorrectos',
        });
      }

      // Generar tokens
      const userPayload = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      };

      const tokens = jwtConfig.generateTokenPair(userPayload);

      // Guardar refresh token
      const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      await database.run(
        'INSERT INTO refresh_tokens (token, user_id, expires_at) VALUES (?, ?, ?)',
        [tokens.refreshToken, user.id, refreshTokenExpiry]
      );

      // Registrar intento exitoso
      await database.run(
        'INSERT INTO login_attempts (ip_address, username, successful) VALUES (?, ?, ?)',
        [clientIp, username, true]
      );

      // Log del evento
      logSecurityEvent('LOGIN_SUCCESS', {
        userId: user.id,
        username: user.username,
        ip: clientIp,
      });

      res.json({
        success: true,
        message: 'Login exitoso',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        tokens,
      });
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'Error al procesar login',
      });
    }
  }

  /**
   * Refresh token
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          error: 'Token requerido',
          message: 'Refresh token es requerido',
        });
      }

      // Verificar refresh token
      let payload;
      try {
        payload = jwtConfig.verifyRefreshToken(refreshToken);
      } catch (error) {
        return res.status(401).json({
          error: 'Token inválido',
          message: 'Refresh token inválido o expirado',
        });
      }

      // Verificar si el token existe en la base de datos
      const storedToken = await database.get(
        'SELECT * FROM refresh_tokens WHERE token = ? AND user_id = ? AND expires_at > datetime("now")',
        [refreshToken, payload.sub]
      );

      if (!storedToken) {
        return res.status(401).json({
          error: 'Token no válido',
          message: 'Refresh token no encontrado o expirado',
        });
      }

      // Obtener usuario actualizado
      const user = await database.get(
        'SELECT id, username, email, role, active FROM users WHERE id = ?',
        [payload.sub]
      );

      if (!user || !user.active) {
        return res.status(401).json({
          error: 'Usuario no válido',
          message: 'Usuario no encontrado o desactivado',
        });
      }

      // Generar nuevo access token
      const newAccessToken = jwtConfig.generateAccessToken(user);

      res.json({
        success: true,
        accessToken: newAccessToken,
        expiresIn: jwtConfig.accessTokenExpiry,
        tokenType: 'Bearer',
      });
    } catch (error) {
      console.error('Error en refresh token:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'Error al procesar refresh token',
      });
    }
  }

  /**
   * Logout de usuario
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async logout(req, res) {
    try {
      const { refreshToken } = req.body;
      const userId = req.user?.id;

      if (refreshToken) {
        // Eliminar refresh token específico
        await database.run('DELETE FROM refresh_tokens WHERE token = ?', [
          refreshToken,
        ]);
      }

      if (userId) {
        // Eliminar todos los refresh tokens del usuario (logout de todos los dispositivos)
        await database.run('DELETE FROM refresh_tokens WHERE user_id = ?', [
          userId,
        ]);

        logSecurityEvent('LOGOUT', {
          userId: userId,
          ip: req.ip,
        });
      }

      res.json({
        success: true,
        message: 'Logout exitoso',
      });
    } catch (error) {
      console.error('Error en logout:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'Error al procesar logout',
      });
    }
  }

  /**
   * Obtener información del usuario actual
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async getProfile(req, res) {
    try {
      const userId = req.user.id;

      const user = await database.get(
        'SELECT id, username, email, role, created_at FROM users WHERE id = ?',
        [userId]
      );

      if (!user) {
        return res.status(404).json({
          error: 'Usuario no encontrado',
          message: 'El usuario no existe',
        });
      }

      res.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          createdAt: user.created_at,
        },
      });
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'Error al obtener perfil de usuario',
      });
    }
  }

  /**
   * Cambiar contraseña
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      // Validaciones
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          error: 'Datos incompletos',
          message: 'Contraseña actual y nueva son requeridas',
        });
      }

      // Validar fortaleza de nueva contraseña
      const passwordValidation = validatePassword(newPassword);
      if (!passwordValidation.isValid) {
        return res.status(400).json({
          error: 'Contraseña débil',
          message:
            'La nueva contraseña debe cumplir con los requisitos de seguridad',
          requirements: passwordValidation.requirements,
        });
      }

      // Obtener usuario
      const user = await database.get(
        'SELECT password FROM users WHERE id = ?',
        [userId]
      );

      // Verificar contraseña actual
      const passwordMatch = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!passwordMatch) {
        return res.status(401).json({
          error: 'Contraseña incorrecta',
          message: 'La contraseña actual es incorrecta',
        });
      }

      // Hash de la nueva contraseña
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      // Actualizar contraseña
      await database.run(
        'UPDATE users SET password = ?, updated_at = datetime("now") WHERE id = ?',
        [hashedPassword, userId]
      );

      // Invalidar todos los refresh tokens (forzar re-login)
      await database.run('DELETE FROM refresh_tokens WHERE user_id = ?', [
        userId,
      ]);

      logSecurityEvent('PASSWORD_CHANGED', {
        userId: userId,
        ip: req.ip,
      });

      res.json({
        success: true,
        message: 'Contraseña cambiada exitosamente',
      });
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'Error al cambiar contraseña',
      });
    }
  }
}

module.exports = new AuthController();
