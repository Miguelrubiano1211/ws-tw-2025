// config/jwt.js
// Configuración de JWT para autenticación y autorización

const jwt = require('jsonwebtoken');

/**
 * Configuración JWT
 * - Tiempos de expiración apropiados
 * - Secrets seguros
 * - Refresh token management
 */

class JWTConfig {
  constructor() {
    this.accessTokenSecret =
      process.env.JWT_ACCESS_SECRET ||
      'fallback-access-secret-change-in-production';
    this.refreshTokenSecret =
      process.env.JWT_REFRESH_SECRET ||
      'fallback-refresh-secret-change-in-production';
    this.accessTokenExpiry = process.env.JWT_ACCESS_EXPIRY || '15m';
    this.refreshTokenExpiry = process.env.JWT_REFRESH_EXPIRY || '7d';
    this.issuer = process.env.JWT_ISSUER || 'worldskills-api';
    this.audience = process.env.JWT_AUDIENCE || 'worldskills-users';
  }

  /**
   * Generar access token
   * @param {Object} payload - Datos del usuario
   * @returns {string} - Token JWT
   */
  generateAccessToken(payload) {
    const tokenPayload = {
      sub: payload.id,
      username: payload.username,
      email: payload.email,
      role: payload.role,
      iat: Math.floor(Date.now() / 1000),
      iss: this.issuer,
      aud: this.audience,
    };

    return jwt.sign(tokenPayload, this.accessTokenSecret, {
      expiresIn: this.accessTokenExpiry,
      algorithm: 'HS256',
    });
  }

  /**
   * Generar refresh token
   * @param {Object} payload - Datos del usuario
   * @returns {string} - Refresh token JWT
   */
  generateRefreshToken(payload) {
    const tokenPayload = {
      sub: payload.id,
      username: payload.username,
      type: 'refresh',
      iat: Math.floor(Date.now() / 1000),
      iss: this.issuer,
      aud: this.audience,
    };

    return jwt.sign(tokenPayload, this.refreshTokenSecret, {
      expiresIn: this.refreshTokenExpiry,
      algorithm: 'HS256',
    });
  }

  /**
   * Verificar access token
   * @param {string} token - Token a verificar
   * @returns {Object} - Payload decodificado
   */
  verifyAccessToken(token) {
    try {
      return jwt.verify(token, this.accessTokenSecret, {
        issuer: this.issuer,
        audience: this.audience,
        algorithms: ['HS256'],
      });
    } catch (error) {
      throw new Error(`Token inválido: ${error.message}`);
    }
  }

  /**
   * Verificar refresh token
   * @param {string} token - Refresh token a verificar
   * @returns {Object} - Payload decodificado
   */
  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, this.refreshTokenSecret, {
        issuer: this.issuer,
        audience: this.audience,
        algorithms: ['HS256'],
      });
    } catch (error) {
      throw new Error(`Refresh token inválido: ${error.message}`);
    }
  }

  /**
   * Generar par de tokens
   * @param {Object} userPayload - Datos del usuario
   * @returns {Object} - Access token y refresh token
   */
  generateTokenPair(userPayload) {
    const accessToken = this.generateAccessToken(userPayload);
    const refreshToken = this.generateRefreshToken(userPayload);

    return {
      accessToken,
      refreshToken,
      expiresIn: this.accessTokenExpiry,
      tokenType: 'Bearer',
    };
  }

  /**
   * Decodificar token sin verificar (para debugging)
   * @param {string} token - Token a decodificar
   * @returns {Object} - Payload decodificado
   */
  decodeToken(token) {
    try {
      return jwt.decode(token, { complete: true });
    } catch (error) {
      throw new Error(`Error al decodificar token: ${error.message}`);
    }
  }

  /**
   * Obtener tiempo de expiración de un token
   * @param {string} token - Token a verificar
   * @returns {number} - Timestamp de expiración
   */
  getTokenExpiration(token) {
    try {
      const decoded = jwt.decode(token);
      return decoded.exp * 1000; // Convertir a milisegundos
    } catch (error) {
      throw new Error(`Error al obtener expiración: ${error.message}`);
    }
  }

  /**
   * Verificar si un token está expirado
   * @param {string} token - Token a verificar
   * @returns {boolean} - True si está expirado
   */
  isTokenExpired(token) {
    try {
      const expiration = this.getTokenExpiration(token);
      return Date.now() >= expiration;
    } catch (error) {
      return true; // Si hay error, considerar expirado
    }
  }

  /**
   * Extraer el bearer token del header Authorization
   * @param {string} authHeader - Header Authorization
   * @returns {string|null} - Token extraído o null
   */
  extractBearerToken(authHeader) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    return authHeader.substring(7); // Remover 'Bearer '
  }

  /**
   * Generar token temporal para reset de contraseña
   * @param {Object} payload - Datos del usuario
   * @returns {string} - Token temporal
   */
  generateResetToken(payload) {
    const tokenPayload = {
      sub: payload.id,
      email: payload.email,
      type: 'password_reset',
      iat: Math.floor(Date.now() / 1000),
      iss: this.issuer,
      aud: this.audience,
    };

    return jwt.sign(tokenPayload, this.accessTokenSecret, {
      expiresIn: '1h', // Token de reset expira en 1 hora
      algorithm: 'HS256',
    });
  }

  /**
   * Verificar token de reset de contraseña
   * @param {string} token - Token de reset
   * @returns {Object} - Payload decodificado
   */
  verifyResetToken(token) {
    try {
      const decoded = this.verifyAccessToken(token);

      if (decoded.type !== 'password_reset') {
        throw new Error('Token no válido para reset de contraseña');
      }

      return decoded;
    } catch (error) {
      throw new Error(`Token de reset inválido: ${error.message}`);
    }
  }
}

// Crear instancia singleton
const jwtConfig = new JWTConfig();

module.exports = jwtConfig;
