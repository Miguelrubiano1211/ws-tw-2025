// middleware/auth.js
// Middleware de autenticación y autorización

const jwtConfig = require('../config/jwt');
const User = require('../models/User');
const { logSecurityEvent } = require('../utils/logger');

/**
 * Middleware de autenticación
 * - Verificar tokens JWT
 * - Validar usuarios
 * - Control de acceso por roles
 * - Logging de eventos de seguridad
 */

/**
 * Middleware para autenticar token JWT
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      return res.status(401).json({
        error: 'Token requerido',
        message: 'Se requiere un token de autenticación',
      });
    }

    const token = jwtConfig.extractBearerToken(authHeader);

    if (!token) {
      return res.status(401).json({
        error: 'Token inválido',
        message: 'Formato de token inválido',
      });
    }

    // Verificar token
    let payload;
    try {
      payload = jwtConfig.verifyAccessToken(token);
    } catch (error) {
      logSecurityEvent('TOKEN_INVALID', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        error: error.message,
      });

      return res.status(401).json({
        error: 'Token inválido',
        message: 'Token expirado o inválido',
      });
    }

    // Verificar que el usuario existe y está activo
    const user = await User.findById(payload.sub);

    if (!user) {
      logSecurityEvent('USER_NOT_FOUND', {
        userId: payload.sub,
        ip: req.ip,
      });

      return res.status(401).json({
        error: 'Usuario no encontrado',
        message: 'El usuario del token no existe',
      });
    }

    if (!user.isActive()) {
      logSecurityEvent('USER_INACTIVE', {
        userId: user.id,
        username: user.username,
        ip: req.ip,
      });

      return res.status(403).json({
        error: 'Usuario inactivo',
        message: 'Tu cuenta ha sido desactivada',
      });
    }

    // Agregar información del usuario al request
    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    console.error('Error en autenticación:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al procesar autenticación',
    });
  }
};

/**
 * Middleware para requerir un rol específico
 * @param {string} requiredRole - Rol requerido
 * @returns {Function} - Middleware function
 */
const requireRole = requiredRole => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'No autenticado',
        message: 'Se requiere autenticación',
      });
    }

    if (req.user.role !== requiredRole) {
      logSecurityEvent('UNAUTHORIZED_ACCESS', {
        userId: req.user.id,
        username: req.user.username,
        requiredRole: requiredRole,
        userRole: req.user.role,
        ip: req.ip,
        endpoint: req.originalUrl,
      });

      return res.status(403).json({
        error: 'Sin permisos',
        message: `Se requiere rol de ${requiredRole}`,
      });
    }

    next();
  };
};

/**
 * Middleware para requerir múltiples roles
 * @param {Array} allowedRoles - Roles permitidos
 * @returns {Function} - Middleware function
 */
const requireRoles = allowedRoles => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'No autenticado',
        message: 'Se requiere autenticación',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      logSecurityEvent('UNAUTHORIZED_ACCESS', {
        userId: req.user.id,
        username: req.user.username,
        allowedRoles: allowedRoles,
        userRole: req.user.role,
        ip: req.ip,
        endpoint: req.originalUrl,
      });

      return res.status(403).json({
        error: 'Sin permisos',
        message: `Se requiere uno de los siguientes roles: ${allowedRoles.join(
          ', '
        )}`,
      });
    }

    next();
  };
};

/**
 * Middleware para verificar propiedad de recurso
 * @param {string} resourceParam - Parámetro que contiene el ID del recurso
 * @param {string} resourceType - Tipo de recurso (product, user, etc.)
 * @returns {Function} - Middleware function
 */
const requireOwnership = (resourceParam, resourceType) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: 'No autenticado',
          message: 'Se requiere autenticación',
        });
      }

      const resourceId = req.params[resourceParam];

      if (!resourceId) {
        return res.status(400).json({
          error: 'ID requerido',
          message: `ID del ${resourceType} es requerido`,
        });
      }

      // Los admins pueden acceder a cualquier recurso
      if (req.user.role === 'admin') {
        return next();
      }

      // Verificar propiedad según el tipo de recurso
      const database = require('../config/database');
      let resource;

      switch (resourceType) {
        case 'product':
          resource = await database.get(
            'SELECT user_id FROM products WHERE id = ?',
            [resourceId]
          );
          break;
        case 'user':
          // Para recursos de usuario, verificar que es el mismo usuario
          if (parseInt(resourceId) !== req.user.id) {
            return res.status(403).json({
              error: 'Sin permisos',
              message: 'No puedes acceder a recursos de otro usuario',
            });
          }
          return next();
        default:
          return res.status(400).json({
            error: 'Tipo de recurso no válido',
            message: `Tipo de recurso ${resourceType} no soportado`,
          });
      }

      if (!resource) {
        return res.status(404).json({
          error: `${resourceType} no encontrado`,
          message: `No se encontró el ${resourceType} especificado`,
        });
      }

      if (resource.user_id !== req.user.id) {
        logSecurityEvent('UNAUTHORIZED_RESOURCE_ACCESS', {
          userId: req.user.id,
          username: req.user.username,
          resourceType: resourceType,
          resourceId: resourceId,
          ip: req.ip,
          endpoint: req.originalUrl,
        });

        return res.status(403).json({
          error: 'Sin permisos',
          message: `No tienes permisos para acceder a este ${resourceType}`,
        });
      }

      next();
    } catch (error) {
      console.error('Error en verificación de propiedad:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'Error al verificar permisos',
      });
    }
  };
};

/**
 * Middleware para verificar token opcional
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      return next(); // No hay token, continuar sin autenticación
    }

    const token = jwtConfig.extractBearerToken(authHeader);

    if (!token) {
      return next(); // Token inválido, continuar sin autenticación
    }

    try {
      const payload = jwtConfig.verifyAccessToken(token);
      const user = await User.findById(payload.sub);

      if (user && user.isActive()) {
        req.user = {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        };
      }
    } catch (error) {
      // Token inválido o expirado, continuar sin autenticación
      console.log('Token opcional inválido:', error.message);
    }

    next();
  } catch (error) {
    console.error('Error en autenticación opcional:', error);
    next(); // En caso de error, continuar sin autenticación
  }
};

/**
 * Middleware para verificar que el usuario es el propietario o admin
 * @param {string} userIdParam - Parámetro que contiene el ID del usuario
 * @returns {Function} - Middleware function
 */
const requireSelfOrAdmin = (userIdParam = 'userId') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'No autenticado',
        message: 'Se requiere autenticación',
      });
    }

    const targetUserId = req.params[userIdParam];

    // Admin puede acceder a cualquier usuario
    if (req.user.role === 'admin') {
      return next();
    }

    // El usuario solo puede acceder a sus propios recursos
    if (parseInt(targetUserId) !== req.user.id) {
      logSecurityEvent('UNAUTHORIZED_USER_ACCESS', {
        userId: req.user.id,
        username: req.user.username,
        targetUserId: targetUserId,
        ip: req.ip,
        endpoint: req.originalUrl,
      });

      return res.status(403).json({
        error: 'Sin permisos',
        message: 'No puedes acceder a recursos de otro usuario',
      });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  requireRole,
  requireRoles,
  requireOwnership,
  optionalAuth,
  requireSelfOrAdmin,
};
