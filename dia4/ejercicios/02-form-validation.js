/**
 * 🎯 Ejercicio 2: Form Validation con RegExp
 * Día 4: Validaciones y Seguridad Frontend
 *
 * Objetivos:
 * - Implementar validaciones robustas en formularios
 * - Combinar HTML5 validation con JavaScript
 * - Crear feedback efectivo para usuarios
 * - Manejar errores de validación apropiadamente
 * - Optimizar UX con validaciones en tiempo real
 */

// =============================================================================
// 📚 TEORÍA: Validación de Formularios
// =============================================================================

/**
 * TIPOS DE VALIDACIÓN
 *
 * 1. Client-side validation:
 *    - Inmediata, mejor UX
 *    - No es segura por sí sola
 *    - Usar para feedback rápido
 *
 * 2. Server-side validation:
 *    - Segura, siempre necesaria
 *    - Última línea de defensa
 *    - Validar datos antes de procesarlos
 *
 * 3. Progressive enhancement:
 *    - Formulario funciona sin JavaScript
 *    - JavaScript mejora la experiencia
 *    - Accesible para todos los usuarios
 */

/**
 * HTML5 VALIDATION ATTRIBUTES
 *
 * required     - Campo obligatorio
 * pattern      - RegExp personalizada
 * type         - email, url, tel, number, etc.
 * min/max      - Valores mínimo/máximo
 * minlength/maxlength - Longitud de texto
 * step         - Incrementos para números
 */

// =============================================================================
// 🔧 EJEMPLOS PRÁCTICOS
// =============================================================================

// Importar patrones de validación del ejercicio anterior
const ValidationPatterns = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  password:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  phone: /^\+?[\d\s\-\(\)]{10,}$/,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  fullName: /^[A-Z][a-z]+(?: [A-Z][a-z]+)+$/,
  postalCode: /^\d{6}$/,
  cedula: /^\d{1,3}(?:\.?\d{3})*$/,
  date: /^(\d{4})-(\d{2})-(\d{2})$/,
  time: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
};

// =============================================================================
// 🎯 CLASE PRINCIPAL: FormValidator
// =============================================================================

class FormValidator {
  constructor(formElement) {
    this.form = formElement;
    this.fields = new Map();
    this.errors = new Map();
    this.realTimeValidation = true;

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadDefaultValidators();
  }

  setupEventListeners() {
    // Validación en tiempo real
    this.form.addEventListener('input', e => {
      if (this.realTimeValidation) {
        this.validateField(e.target);
      }
    });

    // Validación al perder foco
    this.form.addEventListener(
      'blur',
      e => {
        this.validateField(e.target);
      },
      true
    );

    // Validación al enviar
    this.form.addEventListener('submit', e => {
      e.preventDefault();
      this.validateForm();
    });
  }

  loadDefaultValidators() {
    // Cargar validadores predefinidos
    this.addValidator('email', value => {
      if (!value) return { isValid: false, message: 'Email is required' };
      if (!ValidationPatterns.email.test(value)) {
        return { isValid: false, message: 'Invalid email format' };
      }
      return { isValid: true, message: '' };
    });

    this.addValidator('password', value => {
      if (!value) return { isValid: false, message: 'Password is required' };
      if (value.length < 8) {
        return {
          isValid: false,
          message: 'Password must be at least 8 characters',
        };
      }
      if (!ValidationPatterns.password.test(value)) {
        return {
          isValid: false,
          message:
            'Password must contain uppercase, lowercase, number, and special character',
        };
      }
      return { isValid: true, message: '' };
    });

    this.addValidator('phone', value => {
      if (!value) return { isValid: false, message: 'Phone is required' };
      if (!ValidationPatterns.phone.test(value)) {
        return { isValid: false, message: 'Invalid phone format' };
      }
      return { isValid: true, message: '' };
    });

    this.addValidator('fullName', value => {
      if (!value) return { isValid: false, message: 'Full name is required' };
      if (!ValidationPatterns.fullName.test(value)) {
        return {
          isValid: false,
          message: 'Enter first and last name with proper capitalization',
        };
      }
      return { isValid: true, message: '' };
    });

    this.addValidator('confirmPassword', (value, formData) => {
      const password = formData.get('password');
      if (!value)
        return { isValid: false, message: 'Please confirm your password' };
      if (value !== password) {
        return { isValid: false, message: 'Passwords do not match' };
      }
      return { isValid: true, message: '' };
    });
  }

  addValidator(fieldName, validatorFunction) {
    this.fields.set(fieldName, validatorFunction);
  }

  validateField(field) {
    const fieldName = field.name;
    const fieldValue = field.value;

    // Limpiar errores previos
    this.clearFieldError(field);

    // Buscar validador
    const validator = this.fields.get(fieldName);
    if (!validator) return true;

    // Ejecutar validación
    const formData = new FormData(this.form);
    const result = validator(fieldValue, formData);

    if (!result.isValid) {
      this.showFieldError(field, result.message);
      this.errors.set(fieldName, result.message);
      return false;
    }

    this.showFieldSuccess(field);
    this.errors.delete(fieldName);
    return true;
  }

  validateForm() {
    let isValid = true;
    const formData = new FormData(this.form);

    // Validar todos los campos
    this.form.querySelectorAll('input, select, textarea').forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    if (isValid) {
      this.onSuccess(formData);
    } else {
      this.onError(this.errors);
    }

    return isValid;
  }

  showFieldError(field, message) {
    field.classList.add('error');
    field.classList.remove('success');

    // Crear o actualizar mensaje de error
    let errorElement = field.parentNode.querySelector('.error-message');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      field.parentNode.appendChild(errorElement);
    }
    errorElement.textContent = message;

    // Accessibility
    field.setAttribute('aria-invalid', 'true');
    field.setAttribute(
      'aria-describedby',
      errorElement.id || 'error-' + field.name
    );
  }

  showFieldSuccess(field) {
    field.classList.add('success');
    field.classList.remove('error');

    // Accessibility
    field.setAttribute('aria-invalid', 'false');
    field.removeAttribute('aria-describedby');
  }

  clearFieldError(field) {
    field.classList.remove('error', 'success');

    const errorElement = field.parentNode.querySelector('.error-message');
    if (errorElement) {
      errorElement.remove();
    }

    // Accessibility
    field.removeAttribute('aria-invalid');
    field.removeAttribute('aria-describedby');
  }

  onSuccess(formData) {
    console.log('✅ Form validation successful!');
    console.log('Form data:', Object.fromEntries(formData));

    // Mostrar mensaje de éxito
    this.showFormMessage('Form submitted successfully!', 'success');

    // Aquí enviarías los datos al servidor
    this.submitToServer(formData);
  }

  onError(errors) {
    console.log('❌ Form validation failed');
    console.log('Errors:', Object.fromEntries(errors));

    // Mostrar mensaje de error general
    this.showFormMessage('Please fix the errors below', 'error');
  }

  showFormMessage(message, type) {
    let messageElement = this.form.querySelector('.form-message');
    if (!messageElement) {
      messageElement = document.createElement('div');
      messageElement.className = 'form-message';
      this.form.insertBefore(messageElement, this.form.firstChild);
    }

    messageElement.textContent = message;
    messageElement.className = `form-message ${type}`;

    // Auto-hide después de 5 segundos
    setTimeout(() => {
      messageElement.remove();
    }, 5000);
  }

  async submitToServer(formData) {
    // Simular envío al servidor
    console.log('Submitting to server...');

    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('✅ Server response: Success');

      // Reset form después del éxito
      this.form.reset();
      this.errors.clear();
    } catch (error) {
      console.error('❌ Server error:', error);
      this.showFormMessage('Server error. Please try again.', 'error');
    }
  }

  // Métodos de utilidad
  enableRealTimeValidation() {
    this.realTimeValidation = true;
  }

  disableRealTimeValidation() {
    this.realTimeValidation = false;
  }

  reset() {
    this.form.reset();
    this.errors.clear();

    // Limpiar estados visuales
    this.form.querySelectorAll('.error, .success').forEach(field => {
      field.classList.remove('error', 'success');
    });

    // Limpiar mensajes de error
    this.form.querySelectorAll('.error-message').forEach(element => {
      element.remove();
    });

    // Limpiar mensaje del formulario
    const messageElement = this.form.querySelector('.form-message');
    if (messageElement) {
      messageElement.remove();
    }
  }
}

// =============================================================================
// 🎯 EJEMPLO PRÁCTICO: Formulario de Registro
// =============================================================================

console.log('='.repeat(50));
console.log('🎯 CREANDO FORMULARIO DE REGISTRO DE EJEMPLO');
console.log('='.repeat(50));

// Crear HTML del formulario dinámicamente
function createRegistrationForm() {
  const formHTML = `
        <form id="registrationForm" class="registration-form">
            <h2>Registro de Usuario</h2>
            
            <div class="form-group">
                <label for="fullName">Nombre Completo *</label>
                <input 
                    type="text" 
                    id="fullName" 
                    name="fullName" 
                    required 
                    placeholder="Juan Pérez"
                    autocomplete="name"
                >
            </div>
            
            <div class="form-group">
                <label for="email">Email *</label>
                <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    required 
                    placeholder="usuario@dominio.com"
                    autocomplete="email"
                >
            </div>
            
            <div class="form-group">
                <label for="phone">Teléfono *</label>
                <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    required 
                    placeholder="+57 300 123 4567"
                    autocomplete="tel"
                >
            </div>
            
            <div class="form-group">
                <label for="password">Contraseña *</label>
                <input 
                    type="password" 
                    id="password" 
                    name="password" 
                    required 
                    placeholder="Mínimo 8 caracteres"
                    autocomplete="new-password"
                >
                <div class="password-strength"></div>
            </div>
            
            <div class="form-group">
                <label for="confirmPassword">Confirmar Contraseña *</label>
                <input 
                    type="password" 
                    id="confirmPassword" 
                    name="confirmPassword" 
                    required 
                    placeholder="Repite la contraseña"
                    autocomplete="new-password"
                >
            </div>
            
            <div class="form-group">
                <label for="birthDate">Fecha de Nacimiento</label>
                <input 
                    type="date" 
                    id="birthDate" 
                    name="birthDate"
                    max="${new Date().toISOString().split('T')[0]}"
                >
            </div>
            
            <div class="form-group">
                <label for="website">Sitio Web</label>
                <input 
                    type="url" 
                    id="website" 
                    name="website" 
                    placeholder="https://www.ejemplo.com"
                >
            </div>
            
            <div class="form-group">
                <label>
                    <input type="checkbox" name="terms" required>
                    Acepto los términos y condiciones *
                </label>
            </div>
            
            <div class="form-group">
                <label>
                    <input type="checkbox" name="newsletter">
                    Suscribirse al boletín de noticias
                </label>
            </div>
            
            <button type="submit" class="submit-btn">Registrarse</button>
            <button type="button" class="reset-btn">Limpiar</button>
        </form>
    `;

  // Crear estilos CSS
  const cssStyles = `
        <style>
            .registration-form {
                max-width: 600px;
                margin: 20px auto;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 8px;
                font-family: Arial, sans-serif;
            }
            
            .form-group {
                margin-bottom: 15px;
            }
            
            label {
                display: block;
                margin-bottom: 5px;
                font-weight: bold;
            }
            
            input[type="text"],
            input[type="email"],
            input[type="tel"],
            input[type="password"],
            input[type="date"],
            input[type="url"] {
                width: 100%;
                padding: 8px 12px;
                border: 2px solid #ddd;
                border-radius: 4px;
                font-size: 14px;
                transition: border-color 0.3s;
            }
            
            input:focus {
                outline: none;
                border-color: #4CAF50;
            }
            
            input.error {
                border-color: #f44336;
                background-color: #ffebee;
            }
            
            input.success {
                border-color: #4CAF50;
                background-color: #e8f5e8;
            }
            
            .error-message {
                color: #f44336;
                font-size: 12px;
                margin-top: 5px;
            }
            
            .form-message {
                padding: 10px;
                border-radius: 4px;
                margin-bottom: 15px;
                text-align: center;
            }
            
            .form-message.success {
                background-color: #d4edda;
                color: #155724;
                border: 1px solid #c3e6cb;
            }
            
            .form-message.error {
                background-color: #f8d7da;
                color: #721c24;
                border: 1px solid #f5c6cb;
            }
            
            .password-strength {
                height: 4px;
                background-color: #eee;
                border-radius: 2px;
                margin-top: 5px;
                overflow: hidden;
            }
            
            .password-strength.weak {
                background-color: #f44336;
            }
            
            .password-strength.medium {
                background-color: #ff9800;
            }
            
            .password-strength.strong {
                background-color: #4CAF50;
            }
            
            .submit-btn,
            .reset-btn {
                padding: 12px 24px;
                border: none;
                border-radius: 4px;
                font-size: 16px;
                cursor: pointer;
                margin-right: 10px;
                transition: background-color 0.3s;
            }
            
            .submit-btn {
                background-color: #4CAF50;
                color: white;
            }
            
            .submit-btn:hover {
                background-color: #45a049;
            }
            
            .reset-btn {
                background-color: #f44336;
                color: white;
            }
            
            .reset-btn:hover {
                background-color: #da190b;
            }
        </style>
    `;

  // Insertar en el DOM (si estamos en un navegador)
  if (typeof document !== 'undefined') {
    document.head.insertAdjacentHTML('beforeend', cssStyles);
    document.body.innerHTML = formHTML;
  }

  return formHTML;
}

// =============================================================================
// 🎯 VALIDADORES PERSONALIZADOS
// =============================================================================

// Validador de edad mínima
function createAgeValidator(minAge = 18) {
  return value => {
    if (!value) return { isValid: true, message: '' }; // Campo opcional

    const birthDate = new Date(value);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    if (age < minAge) {
      return {
        isValid: false,
        message: `Must be at least ${minAge} years old`,
      };
    }

    return { isValid: true, message: '' };
  };
}

// Validador de checkbox requerido
function createRequiredCheckboxValidator(message = 'This field is required') {
  return value => {
    if (!value || value !== 'on') {
      return { isValid: false, message };
    }
    return { isValid: true, message: '' };
  };
}

// Validador de URL opcional
function createOptionalUrlValidator() {
  return value => {
    if (!value) return { isValid: true, message: '' }; // Campo opcional

    if (!ValidationPatterns.url.test(value)) {
      return { isValid: false, message: 'Invalid URL format' };
    }

    return { isValid: true, message: '' };
  };
}

// =============================================================================
// 🎯 FUNCIONALIDADES AVANZADAS
// =============================================================================

// Indicador de fortaleza de contraseña
function createPasswordStrengthIndicator() {
  return field => {
    const password = field.value;
    const strengthIndicator =
      field.parentNode.querySelector('.password-strength');

    if (!strengthIndicator) return;

    let strength = 0;
    let strengthText = '';

    // Criterios de fortaleza
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;

    // Determinar nivel
    if (strength === 0) {
      strengthText = '';
      strengthIndicator.className = 'password-strength';
    } else if (strength <= 2) {
      strengthText = 'Weak';
      strengthIndicator.className = 'password-strength weak';
    } else if (strength <= 4) {
      strengthText = 'Medium';
      strengthIndicator.className = 'password-strength medium';
    } else {
      strengthText = 'Strong';
      strengthIndicator.className = 'password-strength strong';
    }

    strengthIndicator.textContent = strengthText;
  };
}

// =============================================================================
// 🎯 INICIALIZACIÓN Y CONFIGURACIÓN
// =============================================================================

// Función para inicializar el formulario
function initializeForm() {
  // Crear formulario
  createRegistrationForm();

  // Obtener elemento del formulario
  const form = document.getElementById('registrationForm');
  if (!form) {
    console.log('📝 Formulario creado conceptualmente (no DOM disponible)');
    return null;
  }

  // Crear validador
  const validator = new FormValidator(form);

  // Agregar validadores personalizados
  validator.addValidator('birthDate', createAgeValidator(18));
  validator.addValidator('website', createOptionalUrlValidator());
  validator.addValidator(
    'terms',
    createRequiredCheckboxValidator('You must accept the terms and conditions')
  );

  // Agregar indicador de fortaleza de contraseña
  const passwordField = form.querySelector('#password');
  if (passwordField) {
    const strengthIndicator = createPasswordStrengthIndicator();
    passwordField.addEventListener('input', () =>
      strengthIndicator(passwordField)
    );
  }

  // Configurar botón de reset
  const resetButton = form.querySelector('.reset-btn');
  if (resetButton) {
    resetButton.addEventListener('click', () => {
      validator.reset();
    });
  }

  console.log('✅ Formulario inicializado con validaciones');
  return validator;
}

// =============================================================================
// 🎯 DESAFÍOS PRÁCTICOS
// =============================================================================

console.log('\n' + '='.repeat(50));
console.log('🎯 DESAFÍOS PRÁCTICOS');
console.log('='.repeat(50));

// DESAFÍO 1: Validador de dominio de email corporativo
function createCorporateEmailValidator(allowedDomains) {
  return value => {
    if (!value) return { isValid: false, message: 'Email is required' };

    if (!ValidationPatterns.email.test(value)) {
      return { isValid: false, message: 'Invalid email format' };
    }

    const domain = value.split('@')[1];
    if (!allowedDomains.includes(domain)) {
      return {
        isValid: false,
        message: `Only ${allowedDomains.join(', ')} domains are allowed`,
      };
    }

    return { isValid: true, message: '' };
  };
}

// Test del validador corporativo
console.log('\n=== DESAFÍO 1: EMAIL CORPORATIVO ===');
const corporateValidator = createCorporateEmailValidator([
  'empresa.com',
  'company.co',
]);
console.log(corporateValidator('juan@empresa.com')); // { isValid: true, message: '' }
console.log(corporateValidator('juan@gmail.com')); // { isValid: false, message: ... }

// DESAFÍO 2: Validador de formato de teléfono específico
function createPhoneFormatValidator(countryCode, pattern) {
  return value => {
    if (!value) return { isValid: false, message: 'Phone is required' };

    // Limpiar número (solo dígitos)
    const cleanPhone = value.replace(/\D/g, '');

    // Verificar código de país
    if (!cleanPhone.startsWith(countryCode)) {
      return {
        isValid: false,
        message: `Phone must start with ${countryCode}`,
      };
    }

    // Verificar longitud
    if (cleanPhone.length !== pattern.length) {
      return {
        isValid: false,
        message: `Phone must be ${pattern.length} digits`,
      };
    }

    return { isValid: true, message: '' };
  };
}

// Test del validador de teléfono
console.log('\n=== DESAFÍO 2: TELÉFONO ESPECÍFICO ===');
const colombianPhoneValidator = createPhoneFormatValidator(
  '57',
  '5730012345678'
); // +57 300 123 4567
console.log(colombianPhoneValidator('+57 300 123 4567')); // { isValid: true, message: '' }
console.log(colombianPhoneValidator('300 123 4567')); // { isValid: false, message: ... }

// DESAFÍO 3: Validador de contraseña con políticas personalizadas
function createPasswordPolicyValidator(policy) {
  return value => {
    if (!value) return { isValid: false, message: 'Password is required' };

    const errors = [];

    if (policy.minLength && value.length < policy.minLength) {
      errors.push(`at least ${policy.minLength} characters`);
    }

    if (policy.requireUppercase && !/[A-Z]/.test(value)) {
      errors.push('at least one uppercase letter');
    }

    if (policy.requireLowercase && !/[a-z]/.test(value)) {
      errors.push('at least one lowercase letter');
    }

    if (policy.requireNumbers && !/\d/.test(value)) {
      errors.push('at least one number');
    }

    if (policy.requireSpecialChars && !/[@$!%*?&]/.test(value)) {
      errors.push('at least one special character (@$!%*?&)');
    }

    if (
      policy.forbiddenWords &&
      policy.forbiddenWords.some(word => value.toLowerCase().includes(word))
    ) {
      errors.push('cannot contain common words');
    }

    if (errors.length > 0) {
      return {
        isValid: false,
        message: `Password must contain: ${errors.join(', ')}`,
      };
    }

    return { isValid: true, message: '' };
  };
}

// Test del validador de política
console.log('\n=== DESAFÍO 3: POLÍTICA DE CONTRASEÑA ===');
const strongPasswordValidator = createPasswordPolicyValidator({
  minLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  forbiddenWords: ['password', 'admin', '123456'],
});

console.log(strongPasswordValidator('MiSuperPassword123!'));
console.log(strongPasswordValidator('password123'));

// DESAFÍO 4: Validador de fecha con rangos
function createDateRangeValidator(minDate, maxDate) {
  return value => {
    if (!value) return { isValid: true, message: '' }; // Campo opcional

    const date = new Date(value);
    const min = new Date(minDate);
    const max = new Date(maxDate);

    if (date < min) {
      return { isValid: false, message: `Date must be after ${minDate}` };
    }

    if (date > max) {
      return { isValid: false, message: `Date must be before ${maxDate}` };
    }

    return { isValid: true, message: '' };
  };
}

// Test del validador de fecha
console.log('\n=== DESAFÍO 4: RANGO DE FECHAS ===');
const birthDateValidator = createDateRangeValidator(
  '1900-01-01',
  new Date().toISOString().split('T')[0]
);
console.log(birthDateValidator('1990-05-15')); // { isValid: true, message: '' }
console.log(birthDateValidator('2030-01-01')); // { isValid: false, message: ... }

// =============================================================================
// 🎯 SISTEMA DE VALIDACIÓN AVANZADO
// =============================================================================

class AdvancedFormValidator extends FormValidator {
  constructor(formElement, options = {}) {
    super(formElement);

    this.options = {
      showSuccessMessages: true,
      validateOnSubmit: true,
      validateOnInput: true,
      validateOnBlur: true,
      debounceTime: 300,
      ...options,
    };

    this.debounceTimers = new Map();
    this.customRules = new Map();

    this.enhanceValidation();
  }

  enhanceValidation() {
    // Mejorar validación con debouncing
    if (this.options.validateOnInput) {
      this.form.addEventListener('input', e => {
        this.debouncedValidation(e.target);
      });
    }

    // Validación condicional
    this.setupConditionalValidation();

    // Validación de dependencias
    this.setupDependencyValidation();
  }

  debouncedValidation(field) {
    const fieldName = field.name;

    // Limpiar timer anterior
    if (this.debounceTimers.has(fieldName)) {
      clearTimeout(this.debounceTimers.get(fieldName));
    }

    // Configurar nuevo timer
    const timer = setTimeout(() => {
      this.validateField(field);
    }, this.options.debounceTime);

    this.debounceTimers.set(fieldName, timer);
  }

  setupConditionalValidation() {
    // Ejemplo: validar teléfono solo si se selecciona "contacto por teléfono"
    const contactMethod = this.form.querySelector('[name="contactMethod"]');
    const phoneField = this.form.querySelector('[name="phone"]');

    if (contactMethod && phoneField) {
      contactMethod.addEventListener('change', () => {
        if (contactMethod.value === 'phone') {
          phoneField.required = true;
        } else {
          phoneField.required = false;
          this.clearFieldError(phoneField);
        }
      });
    }
  }

  setupDependencyValidation() {
    // Ejemplo: validar confirmación de contraseña cuando la contraseña cambia
    const passwordField = this.form.querySelector('[name="password"]');
    const confirmField = this.form.querySelector('[name="confirmPassword"]');

    if (passwordField && confirmField) {
      passwordField.addEventListener('input', () => {
        if (confirmField.value) {
          this.validateField(confirmField);
        }
      });
    }
  }

  addCustomRule(fieldName, ruleName, ruleFunction) {
    if (!this.customRules.has(fieldName)) {
      this.customRules.set(fieldName, new Map());
    }

    this.customRules.get(fieldName).set(ruleName, ruleFunction);
  }

  validateFieldWithCustomRules(field) {
    const fieldName = field.name;
    const fieldValue = field.value;

    // Validación base
    const baseValid = this.validateField(field);

    // Validaciones personalizadas
    const customRules = this.customRules.get(fieldName);
    if (customRules) {
      for (const [ruleName, ruleFunction] of customRules) {
        const result = ruleFunction(fieldValue, field, this.form);
        if (!result.isValid) {
          this.showFieldError(field, result.message);
          return false;
        }
      }
    }

    return baseValid;
  }
}

// =============================================================================
// 🎯 TESTING Y DEMOSTRACIÓN
// =============================================================================

console.log('\n' + '='.repeat(50));
console.log('🎯 TESTING DEL SISTEMA DE VALIDACIÓN');
console.log('='.repeat(50));

// Simular datos de formulario para testing
const testFormData = {
  fullName: 'Juan Pérez',
  email: 'juan@empresa.com',
  phone: '+57 300 123 4567',
  password: 'MiPassword123!',
  confirmPassword: 'MiPassword123!',
  birthDate: '1990-05-15',
  website: 'https://www.juan-perez.com',
  terms: 'on',
  newsletter: 'on',
};

// Función para simular validación
function simulateValidation(data) {
  const validator = new FormValidator(null); // Sin elemento DOM

  console.log('📋 Validando datos de formulario:');
  console.log(JSON.stringify(data, null, 2));

  let allValid = true;
  const results = {};

  // Validar cada campo
  for (const [fieldName, fieldValue] of Object.entries(data)) {
    const fieldValidator = validator.fields.get(fieldName);

    if (fieldValidator) {
      const result = fieldValidator(fieldValue, new Map(Object.entries(data)));
      results[fieldName] = result;

      if (!result.isValid) {
        allValid = false;
        console.log(`❌ ${fieldName}: ${result.message}`);
      } else {
        console.log(`✅ ${fieldName}: Valid`);
      }
    } else {
      console.log(`⚠️ ${fieldName}: No validator found`);
    }
  }

  console.log(`\n📊 Resultado general: ${allValid ? 'VÁLIDO' : 'INVÁLIDO'}`);
  return { allValid, results };
}

// Ejecutar simulación
const validationResult = simulateValidation(testFormData);

// Test con datos inválidos
console.log('\n=== TESTING CON DATOS INVÁLIDOS ===');
const invalidData = {
  fullName: 'juan',
  email: 'invalid-email',
  phone: '123',
  password: 'weak',
  confirmPassword: 'different',
  birthDate: '2030-01-01',
  website: 'not-a-url',
  terms: 'off',
};

simulateValidation(invalidData);

// =============================================================================
// 📋 RESUMEN Y MEJORES PRÁCTICAS
// =============================================================================

console.log('\n' + '='.repeat(50));
console.log('📋 RESUMEN Y MEJORES PRÁCTICAS');
console.log('='.repeat(50));

const bestPractices = [
  '✅ Siempre validar en cliente Y servidor',
  '✅ Usar progressive enhancement',
  '✅ Proporcionar feedback inmediato',
  '✅ Mensajes de error claros y útiles',
  '✅ Validación accesible (ARIA attributes)',
  '✅ Debouncing para validación en tiempo real',
  '✅ Validación condicional cuando sea apropiado',
  '✅ Sanitización de datos antes de validar',
  '✅ Testing exhaustivo con casos extremos',
  '✅ Documentar políticas de validación',
];

bestPractices.forEach(practice => console.log(practice));

// Inicializar formulario si DOM está disponible
if (typeof document !== 'undefined' && document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeForm);
} else if (typeof document !== 'undefined') {
  initializeForm();
}

console.log(`
🎯 FORM VALIDATION COMPLETADO!

Has dominado:
✅ Validación robusta de formularios
✅ HTML5 + JavaScript validation
✅ Feedback efectivo al usuario
✅ Validaciones personalizadas
✅ Sistema avanzado de validación
✅ Testing y mejores prácticas

Siguiente paso: Implementar prevención XSS!
`);

/**
 * 🎯 EJERCICIO COMPLETADO
 *
 * Has completado con éxito el Ejercicio 2: Form Validation
 *
 * Habilidades desarrolladas:
 * - Validación robusta de formularios
 * - Combinación HTML5 + JavaScript
 * - Feedback efectivo al usuario
 * - Validaciones personalizadas
 * - Sistema avanzado de validación
 * - Testing y mejores prácticas
 *
 * Siguiente paso: Proceder con el Ejercicio 3 (XSS Prevention)
 */
