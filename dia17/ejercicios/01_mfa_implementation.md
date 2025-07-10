# 🔐 Ejercicio 1: Multi-Factor Authentication (MFA) Implementation

## 📋 Información del Ejercicio

**Duración:** 45 minutos  
**Dificultad:** ⭐⭐⭐⭐  
**Prerequisitos:** Autenticación básica funcionando  
**Objetivos:** Implementar MFA con Google Authenticator y backup codes

---

## 🎯 Objetivos de Aprendizaje

Al completar este ejercicio, el estudiante será capaz de:

- Implementar TOTP (Time-based One-Time Password) authentication
- Configurar Google Authenticator integration
- Generar y validar QR codes para MFA setup
- Implementar backup codes para recovery
- Crear UX optimizada para MFA enrollment

---

## 📚 Conceptos Clave

### **Multi-Factor Authentication (MFA)**

MFA añade una capa adicional de seguridad requiriendo múltiples formas de verificación:

- **Something you know** (password)
- **Something you have** (mobile device/authenticator)
- **Something you are** (biometrics)

### **TOTP (Time-based One-Time Password)**

- Algoritmo que genera códigos temporales
- Códigos válidos por 30 segundos
- Sincronizado entre server y client
- Estándar RFC 6238

---

## 🛠️ Tecnologías Utilizadas

- **speakeasy** - TOTP generation y validation
- **qrcode** - QR code generation
- **crypto** - Backup codes generation
- **bcrypt** - Backup codes hashing
- **jsonwebtoken** - JWT tokens

---

## 📝 Instrucciones Paso a Paso

### **Paso 1: Instalación de Dependencias (5 minutos)**

```bash
# Instalar las dependencias necesarias
pnpm install speakeasy qrcode crypto

# Instalar tipos para TypeScript (opcional)
pnpm install -D @types/speakeasy @types/qrcode
```

### **Paso 2: Configuración del Backend (15 minutos)**

#### **2.1 Crear el modelo MFA**

```javascript
// models/User.js - Añadir campos MFA al esquema de usuario
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    // ...campos existentes...

    // Campos MFA
    mfaEnabled: {
      type: Boolean,
      default: false,
    },
    mfaSecret: {
      type: String,
      select: false, // No incluir por defecto en queries
    },
    backupCodes: [
      {
        code: {
          type: String,
          required: true,
        },
        used: {
          type: Boolean,
          default: false,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    mfaSetupCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Método para generar secret MFA
userSchema.methods.generateMFASecret = function () {
  const speakeasy = require('speakeasy');

  const secret = speakeasy.generateSecret({
    name: `TechStore (${this.email})`,
    issuer: 'TechStore',
    length: 32,
  });

  this.mfaSecret = secret.base32;
  return secret;
};

// Método para verificar token TOTP
userSchema.methods.verifyTOTP = function (token) {
  const speakeasy = require('speakeasy');

  return speakeasy.totp.verify({
    secret: this.mfaSecret,
    encoding: 'base32',
    token: token,
    window: 2, // Permitir 2 time steps de diferencia
  });
};

// Método para generar backup codes
userSchema.methods.generateBackupCodes = function () {
  const crypto = require('crypto');
  const bcrypt = require('bcrypt');

  const codes = [];
  const plainCodes = [];

  for (let i = 0; i < 10; i++) {
    const code = crypto.randomBytes(4).toString('hex').toUpperCase();
    plainCodes.push(code);
    codes.push({
      code: bcrypt.hashSync(code, 10),
      used: false,
    });
  }

  this.backupCodes = codes;
  return plainCodes;
};

// Método para verificar backup code
userSchema.methods.verifyBackupCode = function (inputCode) {
  const bcrypt = require('bcrypt');

  for (let backupCode of this.backupCodes) {
    if (!backupCode.used && bcrypt.compareSync(inputCode, backupCode.code)) {
      backupCode.used = true;
      this.save();
      return true;
    }
  }
  return false;
};

module.exports = mongoose.model('User', userSchema);
```

#### **2.2 Crear rutas MFA**

```javascript
// routes/mfa.js
const express = require('express');
const router = express.Router();
const qrcode = require('qrcode');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

// POST /api/mfa/setup - Iniciar setup de MFA
router.post('/setup', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('+mfaSecret');

    if (user.mfaEnabled) {
      return res.status(400).json({
        error: 'MFA ya está habilitado para este usuario',
      });
    }

    // Generar secret
    const secret = user.generateMFASecret();
    await user.save();

    // Generar QR code
    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);

    res.json({
      qrCode: qrCodeUrl,
      manualEntryKey: secret.base32,
      backupCodes: [], // Los generaremos después de confirmar
    });
  } catch (error) {
    console.error('Error setting up MFA:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/mfa/verify-setup - Confirmar setup de MFA
router.post('/verify-setup', authenticateToken, async (req, res) => {
  try {
    const { token } = req.body;

    if (!token || token.length !== 6) {
      return res.status(400).json({
        error: 'Token TOTP requerido (6 dígitos)',
      });
    }

    const user = await User.findById(req.user.id).select('+mfaSecret');

    if (!user.mfaSecret) {
      return res.status(400).json({
        error: 'MFA setup no iniciado',
      });
    }

    // Verificar token
    const isValid = user.verifyTOTP(token);

    if (!isValid) {
      return res.status(400).json({
        error: 'Token TOTP inválido',
      });
    }

    // Activar MFA y generar backup codes
    user.mfaEnabled = true;
    user.mfaSetupCompleted = true;
    const backupCodes = user.generateBackupCodes();
    await user.save();

    res.json({
      message: 'MFA configurado exitosamente',
      backupCodes: backupCodes,
    });
  } catch (error) {
    console.error('Error verifying MFA setup:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/mfa/verify - Verificar token MFA durante login
router.post('/verify', async (req, res) => {
  try {
    const { email, password, mfaToken, backupCode } = req.body;

    // Buscar usuario
    const user = await User.findOne({ email }).select('+password +mfaSecret');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    if (!user.mfaEnabled) {
      return res.status(400).json({ error: 'MFA no está habilitado' });
    }

    let mfaValid = false;

    // Verificar TOTP token
    if (mfaToken) {
      mfaValid = user.verifyTOTP(mfaToken);
    }

    // Verificar backup code si TOTP no es válido
    if (!mfaValid && backupCode) {
      mfaValid = user.verifyBackupCode(backupCode);
    }

    if (!mfaValid) {
      return res.status(401).json({
        error: 'Token MFA o código de respaldo inválido',
      });
    }

    // Generar JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login exitoso con MFA',
      token: token,
      user: {
        id: user._id,
        email: user.email,
        nombre: user.nombre,
      },
    });
  } catch (error) {
    console.error('Error verifying MFA:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/mfa/disable - Deshabilitar MFA
router.post('/disable', authenticateToken, async (req, res) => {
  try {
    const { password, mfaToken } = req.body;

    const user = await User.findById(req.user.id).select(
      '+password +mfaSecret'
    );

    // Verificar password
    if (!(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Password incorrecta' });
    }

    // Verificar MFA token
    if (!user.verifyTOTP(mfaToken)) {
      return res.status(401).json({ error: 'Token MFA inválido' });
    }

    // Deshabilitar MFA
    user.mfaEnabled = false;
    user.mfaSecret = undefined;
    user.backupCodes = [];
    user.mfaSetupCompleted = false;
    await user.save();

    res.json({ message: 'MFA deshabilitado exitosamente' });
  } catch (error) {
    console.error('Error disabling MFA:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/mfa/status - Obtener estado de MFA
router.get('/status', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.json({
      mfaEnabled: user.mfaEnabled,
      mfaSetupCompleted: user.mfaSetupCompleted,
      backupCodesRemaining: user.backupCodes.filter(code => !code.used).length,
    });
  } catch (error) {
    console.error('Error getting MFA status:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
```

### **Paso 3: Actualizar el Login para Soportar MFA (10 minutos)**

```javascript
// routes/auth.js - Actualizar ruta de login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email y password son requeridos',
      });
    }

    // Buscar usuario
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar si tiene MFA habilitado
    if (user.mfaEnabled) {
      return res.json({
        requiresMFA: true,
        message: 'Se requiere autenticación de segundo factor',
        userId: user._id, // Solo para identificar en el siguiente paso
      });
    }

    // Login normal sin MFA
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login exitoso',
      token: token,
      user: {
        id: user._id,
        email: user.email,
        nombre: user.nombre,
      },
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
```

### **Paso 4: Frontend - Componente MFA Setup (10 minutos)**

```jsx
// components/MFASetup.jsx
import React, { useState } from 'react';

const MFASetup = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [qrCode, setQrCode] = useState('');
  const [manualKey, setManualKey] = useState('');
  const [token, setToken] = useState('');
  const [backupCodes, setBackupCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const startMFASetup = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/mfa/setup', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setQrCode(data.qrCode);
      setManualKey(data.manualEntryKey);
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifySetup = async () => {
    if (!token || token.length !== 6) {
      setError('Ingresa un código de 6 dígitos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/mfa/verify-setup', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setBackupCodes(data.backupCodes);
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const completeMFASetup = () => {
    onComplete();
  };

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">
          🔐 Configurar Autenticación de Dos Factores
        </h5>

        {error && (
          <div
            className="alert alert-danger"
            role="alert">
            {error}
          </div>
        )}

        {step === 1 && (
          <div>
            <p>
              La autenticación de dos factores añade una capa extra de seguridad
              a tu cuenta requiriendo un código de tu teléfono además de tu
              contraseña.
            </p>
            <div className="d-grid">
              <button
                className="btn btn-primary"
                onClick={startMFASetup}
                disabled={loading}>
                {loading ? 'Configurando...' : 'Configurar MFA'}
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h6>Paso 1: Escanea el código QR</h6>
            <div className="text-center mb-3">
              <img
                src={qrCode}
                alt="QR Code"
                className="img-fluid"
              />
            </div>

            <div className="alert alert-info">
              <strong>Aplicaciones compatibles:</strong>
              <ul className="mb-0">
                <li>Google Authenticator</li>
                <li>Microsoft Authenticator</li>
                <li>Authy</li>
              </ul>
            </div>

            <div className="mb-3">
              <label className="form-label">
                O ingresa la clave manualmente:
              </label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  value={manualKey}
                  readOnly
                />
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => navigator.clipboard.writeText(manualKey)}>
                  Copiar
                </button>
              </div>
            </div>

            <h6>Paso 2: Ingresa el código de verificación</h6>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="000000"
                value={token}
                onChange={e =>
                  setToken(e.target.value.replace(/\D/g, '').slice(0, 6))
                }
                maxLength="6"
              />
            </div>

            <div className="d-grid">
              <button
                className="btn btn-success"
                onClick={verifySetup}
                disabled={loading || token.length !== 6}>
                {loading ? 'Verificando...' : 'Verificar y Activar'}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="alert alert-success">
              <strong>¡MFA configurado exitosamente!</strong>
            </div>

            <h6>Códigos de Respaldo</h6>
            <div className="alert alert-warning">
              <strong>Importante:</strong> Guarda estos códigos en un lugar
              seguro. Puedes usarlos para acceder a tu cuenta si pierdes tu
              dispositivo.
            </div>

            <div className="row">
              {backupCodes.map((code, index) => (
                <div
                  key={index}
                  className="col-6 col-md-4 mb-2">
                  <code className="d-block p-2 bg-light rounded text-center">
                    {code}
                  </code>
                </div>
              ))}
            </div>

            <div className="d-grid mt-3">
              <button
                className="btn btn-primary"
                onClick={completeMFASetup}>
                Completar Configuración
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MFASetup;
```

### **Paso 5: Frontend - Componente MFA Login (5 minutos)**

```jsx
// components/MFALogin.jsx
import React, { useState } from 'react';

const MFALogin = ({ userId, onSuccess, onBack }) => {
  const [mfaToken, setMfaToken] = useState('');
  const [backupCode, setBackupCode] = useState('');
  const [useBackupCode, setUseBackupCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleMFAVerification = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/mfa/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          mfaToken: useBackupCode ? '' : mfaToken,
          backupCode: useBackupCode ? backupCode : '',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      // Guardar token y usuario
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      onSuccess(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">🔐 Verificación de Dos Factores</h5>

        {error && (
          <div
            className="alert alert-danger"
            role="alert">
            {error}
          </div>
        )}

        {!useBackupCode ? (
          <div>
            <p>
              Ingresa el código de 6 dígitos de tu aplicación de autenticación.
            </p>
            <div className="mb-3">
              <label className="form-label">Código de Autenticación</label>
              <input
                type="text"
                className="form-control text-center"
                placeholder="000000"
                value={mfaToken}
                onChange={e =>
                  setMfaToken(e.target.value.replace(/\D/g, '').slice(0, 6))
                }
                maxLength="6"
                style={{ fontSize: '1.5rem', letterSpacing: '0.5rem' }}
              />
            </div>

            <div className="d-grid gap-2">
              <button
                className="btn btn-primary"
                onClick={handleMFAVerification}
                disabled={loading || mfaToken.length !== 6}>
                {loading ? 'Verificando...' : 'Verificar'}
              </button>

              <button
                className="btn btn-link"
                onClick={() => setUseBackupCode(true)}>
                Usar código de respaldo
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p>Ingresa uno de tus códigos de respaldo de 8 caracteres.</p>
            <div className="mb-3">
              <label className="form-label">Código de Respaldo</label>
              <input
                type="text"
                className="form-control text-center"
                placeholder="XXXXXXXX"
                value={backupCode}
                onChange={e =>
                  setBackupCode(e.target.value.toUpperCase().slice(0, 8))
                }
                maxLength="8"
                style={{ fontSize: '1.2rem', letterSpacing: '0.3rem' }}
              />
            </div>

            <div className="d-grid gap-2">
              <button
                className="btn btn-primary"
                onClick={handleMFAVerification}
                disabled={loading || backupCode.length !== 8}>
                {loading ? 'Verificando...' : 'Verificar Código de Respaldo'}
              </button>

              <button
                className="btn btn-link"
                onClick={() => setUseBackupCode(false)}>
                Usar aplicación de autenticación
              </button>
            </div>
          </div>
        )}

        <hr />

        <div className="text-center">
          <button
            className="btn btn-outline-secondary"
            onClick={onBack}>
            ← Volver al Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default MFALogin;
```

---

## ✅ Criterios de Validación

### **Funcionalidad Básica**

- ✅ MFA setup genera QR code válido
- ✅ TOTP tokens se verifican correctamente
- ✅ Backup codes se generan y funcionan
- ✅ Login requiere MFA cuando está habilitado
- ✅ Usuarios pueden deshabilitar MFA

### **Seguridad**

- ✅ Secret MFA se almacena de forma segura
- ✅ Backup codes están hasheados
- ✅ Tokens TOTP tienen ventana de tiempo apropiada
- ✅ Códigos de respaldo se marcan como usados
- ✅ Error messages no revelan información sensible

### **User Experience**

- ✅ Proceso de setup es claro y guiado
- ✅ QR code es fácil de escanear
- ✅ Fallback con clave manual funciona
- ✅ Backup codes son fáciles de guardar
- ✅ Error messages son informativos

---

## 🧪 Pruebas y Validación

### **Pruebas Funcionales**

```bash
# 1. Probar setup de MFA
curl -X POST http://localhost:3001/api/mfa/setup \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"

# 2. Probar verificación de setup
curl -X POST http://localhost:3001/api/mfa/verify-setup \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"token":"123456"}'

# 3. Probar login con MFA
curl -X POST http://localhost:3001/api/mfa/verify \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password","mfaToken":"123456"}'
```

### **Pruebas de Seguridad**

- Verificar que secrets no se exponen en responses
- Confirmar que backup codes están hasheados en DB
- Validar que tokens TOTP caducados no funcionan
- Probar que backup codes usados no se pueden reutilizar

---

## 📚 Recursos Adicionales

### **Documentación**

- [RFC 6238 - TOTP Algorithm](https://tools.ietf.org/html/rfc6238)
- [Speakeasy Documentation](https://github.com/speakeasyjs/speakeasy)
- [Google Authenticator Protocol](https://github.com/google/google-authenticator/wiki/Key-Uri-Format)

### **Mejores Prácticas**

- Usar secrets de al menos 160 bits
- Implementar rate limiting en verificación
- Proveer múltiples métodos de recovery
- Educar usuarios sobre seguridad de backup codes

---

## 🎯 Entregables

1. **Backend:** Rutas MFA funcionando completamente
2. **Frontend:** Componentes de setup y login MFA
3. **Database:** Modelo actualizado con campos MFA
4. **Testing:** Casos de prueba para todas las funcionalidades
5. **Documentation:** Guía de uso para usuarios

---

**¡Ejercicio completado! Los estudiantes ahora tienen MFA completamente funcional en su aplicación.**
