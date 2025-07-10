// tests/auth.test.js
// Tests para autenticación

const request = require('supertest');
const app = require('../src/app');
const database = require('../src/config/database');

describe('Authentication Tests', () => {
  beforeAll(async () => {
    // Conectar a la base de datos de pruebas
    await database.connect();
    await database.initTables();
  });

  afterAll(async () => {
    // Limpiar base de datos y cerrar conexión
    await database.run('DELETE FROM users');
    await database.run('DELETE FROM refresh_tokens');
    await database.close();
  });

  beforeEach(async () => {
    // Limpiar usuarios antes de cada test
    await database.run('DELETE FROM users');
    await database.run('DELETE FROM refresh_tokens');
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'TestPass123!',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.username).toBe('testuser');
      expect(response.body.user.email).toBe('test@example.com');
      expect(response.body.tokens).toBeDefined();
      expect(response.body.tokens.accessToken).toBeDefined();
      expect(response.body.tokens.refreshToken).toBeDefined();
    });

    it('should reject registration with invalid email', async () => {
      const userData = {
        username: 'testuser',
        email: 'invalid-email',
        password: 'TestPass123!',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBeFalsy();
      expect(response.body.error).toBe('Email inválido');
    });

    it('should reject registration with weak password', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: '123456',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBeFalsy();
      expect(response.body.error).toBe('Contraseña débil');
    });

    it('should reject duplicate username', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'TestPass123!',
      };

      // Registrar primera vez
      await request(app).post('/api/auth/register').send(userData).expect(201);

      // Intentar registrar con el mismo username
      const duplicateData = {
        username: 'testuser',
        email: 'different@example.com',
        password: 'TestPass123!',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(duplicateData)
        .expect(409);

      expect(response.body.success).toBeFalsy();
      expect(response.body.error).toBe('Usuario ya existe');
    });
  });

  describe('POST /api/auth/login', () => {
    let registeredUser;

    beforeEach(async () => {
      // Registrar usuario para tests de login
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'TestPass123!',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      registeredUser = response.body.user;
    });

    it('should login successfully with username', async () => {
      const loginData = {
        username: 'testuser',
        password: 'TestPass123!',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.username).toBe('testuser');
      expect(response.body.tokens).toBeDefined();
      expect(response.body.tokens.accessToken).toBeDefined();
      expect(response.body.tokens.refreshToken).toBeDefined();
    });

    it('should login successfully with email', async () => {
      const loginData = {
        username: 'test@example.com',
        password: 'TestPass123!',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should reject login with wrong password', async () => {
      const loginData = {
        username: 'testuser',
        password: 'wrongpassword',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBeFalsy();
      expect(response.body.error).toBe('Credenciales inválidas');
    });

    it('should reject login with non-existent user', async () => {
      const loginData = {
        username: 'nonexistent',
        password: 'TestPass123!',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBeFalsy();
      expect(response.body.error).toBe('Credenciales inválidas');
    });

    it('should block login after multiple failed attempts', async () => {
      const loginData = {
        username: 'testuser',
        password: 'wrongpassword',
      };

      // Hacer 5 intentos fallidos
      for (let i = 0; i < 5; i++) {
        await request(app).post('/api/auth/login').send(loginData).expect(401);
      }

      // El sexto intento debería ser bloqueado
      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(429);

      expect(response.body.error).toBe('Demasiados intentos');
    });
  });

  describe('POST /api/auth/refresh', () => {
    let refreshToken;

    beforeEach(async () => {
      // Registrar usuario y obtener refresh token
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'TestPass123!',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      refreshToken = response.body.tokens.refreshToken;
    });

    it('should refresh token successfully', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.accessToken).toBeDefined();
      expect(response.body.tokenType).toBe('Bearer');
    });

    it('should reject invalid refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'invalid-token' })
        .expect(401);

      expect(response.body.success).toBeFalsy();
      expect(response.body.error).toBe('Token inválido');
    });

    it('should reject missing refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({})
        .expect(400);

      expect(response.body.success).toBeFalsy();
      expect(response.body.error).toBe('Token requerido');
    });
  });

  describe('GET /api/auth/profile', () => {
    let accessToken;

    beforeEach(async () => {
      // Registrar usuario y obtener access token
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'TestPass123!',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      accessToken = response.body.tokens.accessToken;
    });

    it('should get profile successfully', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.username).toBe('testuser');
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should reject request without token', async () => {
      const response = await request(app).get('/api/auth/profile').expect(401);

      expect(response.body.success).toBeFalsy();
      expect(response.body.error).toBe('Token requerido');
    });

    it('should reject request with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBeFalsy();
      expect(response.body.error).toBe('Token inválido');
    });
  });

  describe('PUT /api/auth/change-password', () => {
    let accessToken;

    beforeEach(async () => {
      // Registrar usuario y obtener access token
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'TestPass123!',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      accessToken = response.body.tokens.accessToken;
    });

    it('should change password successfully', async () => {
      const changeData = {
        currentPassword: 'TestPass123!',
        newPassword: 'NewPass456!',
      };

      const response = await request(app)
        .put('/api/auth/change-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(changeData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Contraseña cambiada exitosamente');
    });

    it('should reject wrong current password', async () => {
      const changeData = {
        currentPassword: 'wrongpassword',
        newPassword: 'NewPass456!',
      };

      const response = await request(app)
        .put('/api/auth/change-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(changeData)
        .expect(401);

      expect(response.body.success).toBeFalsy();
      expect(response.body.error).toBe('Contraseña incorrecta');
    });

    it('should reject weak new password', async () => {
      const changeData = {
        currentPassword: 'TestPass123!',
        newPassword: '123456',
      };

      const response = await request(app)
        .put('/api/auth/change-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(changeData)
        .expect(400);

      expect(response.body.success).toBeFalsy();
      expect(response.body.error).toBe('Contraseña débil');
    });
  });

  describe('POST /api/auth/logout', () => {
    let accessToken;
    let refreshToken;

    beforeEach(async () => {
      // Registrar usuario y obtener tokens
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'TestPass123!',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      accessToken = response.body.tokens.accessToken;
      refreshToken = response.body.tokens.refreshToken;
    });

    it('should logout successfully', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .send({ refreshToken })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Logout exitoso');
    });

    it('should logout without refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .send({})
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Logout exitoso');
    });
  });

  describe('GET /api/auth/verify', () => {
    let accessToken;

    beforeEach(async () => {
      // Registrar usuario y obtener access token
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'TestPass123!',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      accessToken = response.body.tokens.accessToken;
    });

    it('should verify token successfully', async () => {
      const response = await request(app)
        .get('/api/auth/verify')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Token válido');
      expect(response.body.user).toBeDefined();
    });

    it('should reject invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/verify')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBeFalsy();
      expect(response.body.error).toBe('Token inválido');
    });
  });
});
