# 🎯 Evaluación Final - Día 14: Testing y Quality Assurance

## 📋 Guía de Evaluación

### **Información General**

- **Duración de evaluación**: 60 minutos
- **Tipo de evaluación**: Práctica + Teórica
- **Modalidad**: Individual con revisión de código
- **Herramientas**: VS Code, Terminal, Browser DevTools

---

## 🎯 Criterios de Evaluación

### **1. Unit Testing (25 puntos)**

#### **Criterios de Evaluación**

- **Cobertura de código**: 20% mínimo para aprobar, 85% para excelente
- **Calidad de tests**: Tests significativos y bien estructurados
- **Manejo de edge cases**: Casos límite y errores
- **Uso de mocks**: Mocking apropiado de dependencias

#### **Rúbrica Unit Testing**

| Nivel             | Cobertura | Calidad                                | Edge Cases                   | Mocks            | Puntos |
| ----------------- | --------- | -------------------------------------- | ---------------------------- | ---------------- | ------ |
| **Excelente**     | 85%+      | Tests bien estructurados, descriptivos | Cubre todos los casos límite | Mocks apropiados | 23-25  |
| **Bueno**         | 70-84%    | Tests claros, algunos casos            | Cubre casos principales      | Algunos mocks    | 18-22  |
| **Satisfactorio** | 50-69%    | Tests básicos funcionales              | Casos básicos                | Mocks básicos    | 13-17  |
| **Insuficiente**  | <50%      | Tests pobres o inexistentes            | Sin edge cases               | Sin mocks        | 0-12   |

#### **Ejemplo de Evaluación**

```javascript
// Función a testear
export const calculateTax = (amount, rate) => {
  if (amount < 0) throw new Error('Amount cannot be negative');
  if (rate < 0 || rate > 1) throw new Error('Rate must be between 0 and 1');
  return amount * rate;
};

// Test evaluado
describe('calculateTax', () => {
  test('should calculate tax correctly', () => {
    expect(calculateTax(100, 0.15)).toBe(15);
  });

  test('should handle zero amount', () => {
    expect(calculateTax(0, 0.15)).toBe(0);
  });

  test('should throw error for negative amount', () => {
    expect(() => calculateTax(-10, 0.15)).toThrow('Amount cannot be negative');
  });

  test('should throw error for invalid rate', () => {
    expect(() => calculateTax(100, 1.5)).toThrow(
      'Rate must be between 0 and 1'
    );
  });
});
```

### **2. Integration Testing (25 puntos)**

#### **Criterios de Evaluación**

- **API Testing**: Cobertura de endpoints principales
- **Database Testing**: Tests de persistencia
- **Error Handling**: Manejo de errores en integraciones
- **Realistic Scenarios**: Escenarios realistas de uso

#### **Rúbrica Integration Testing**

| Nivel             | API Coverage     | DB Tests          | Error Handling | Scenarios            | Puntos |
| ----------------- | ---------------- | ----------------- | -------------- | -------------------- | ------ |
| **Excelente**     | 90%+ endpoints   | Tests completos   | Manejo robusto | Escenarios realistas | 23-25  |
| **Bueno**         | 70-89% endpoints | Tests principales | Manejo básico  | Algunos escenarios   | 18-22  |
| **Satisfactorio** | 50-69% endpoints | Tests básicos     | Manejo mínimo  | Escenarios simples   | 13-17  |
| **Insuficiente**  | <50% endpoints   | Sin tests DB      | Sin manejo     | Sin escenarios       | 0-12   |

#### **Ejemplo de Evaluación**

```javascript
// Integration test evaluado
describe('Products API Integration', () => {
  test('should create and retrieve product', async () => {
    // Create product
    const newProduct = { name: 'Test Product', price: 99.99 };
    const createResponse = await request(app)
      .post('/api/products')
      .send(newProduct)
      .expect(201);

    // Retrieve product
    const retrieveResponse = await request(app)
      .get(`/api/products/${createResponse.body.id}`)
      .expect(200);

    expect(retrieveResponse.body.name).toBe(newProduct.name);
  });

  test('should handle database errors', async () => {
    // Mock database error
    jest.spyOn(Product, 'create').mockRejectedValue(new Error('DB Error'));

    await request(app).post('/api/products').send({ name: 'Test' }).expect(500);
  });
});
```

### **3. Component Testing (20 puntos)**

#### **Criterios de Evaluación**

- **React Testing Library**: Uso correcto de RTL
- **User Interactions**: Testing de eventos y interacciones
- **Props Testing**: Validación de props
- **State Management**: Testing de estado

#### **Rúbrica Component Testing**

| Nivel             | RTL Usage      | Interactions              | Props           | State           | Puntos |
| ----------------- | -------------- | ------------------------- | --------------- | --------------- | ------ |
| **Excelente**     | Best practices | Todas las interacciones   | Props completas | Estado completo | 18-20  |
| **Bueno**         | Uso correcto   | Principales interacciones | Props básicas   | Estado básico   | 14-17  |
| **Satisfactorio** | Uso básico     | Algunas interacciones     | Props mínimas   | Estado mínimo   | 10-13  |
| **Insuficiente**  | Uso incorrecto | Sin interacciones         | Sin props       | Sin estado      | 0-9    |

#### **Ejemplo de Evaluación**

```javascript
// Component test evaluado
describe('ProductCard', () => {
  const mockProduct = {
    id: '1',
    name: 'Test Product',
    price: 99.99,
  };

  test('should render product information', () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  test('should handle add to cart click', async () => {
    const user = userEvent.setup();
    const mockAddToCart = jest.fn();

    render(
      <ProductCard
        product={mockProduct}
        onAddToCart={mockAddToCart}
      />
    );

    await user.click(screen.getByText('Add to Cart'));

    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct);
  });
});
```

### **4. E2E Testing (15 puntos)**

#### **Criterios de Evaluación**

- **Critical Paths**: Tests de flujos críticos
- **User Journey**: Experiencia completa del usuario
- **Cross-browser**: Compatibilidad
- **Mobile Testing**: Responsive design

#### **Rúbrica E2E Testing**

| Nivel             | Critical Paths     | User Journey     | Cross-browser      | Mobile        | Puntos |
| ----------------- | ------------------ | ---------------- | ------------------ | ------------- | ------ |
| **Excelente**     | Todos los flujos   | Jornada completa | Múltiples browsers | Tests móviles | 14-15  |
| **Bueno**         | Flujos principales | Jornada básica   | 2+ browsers        | Básico móvil  | 11-13  |
| **Satisfactorio** | Flujo principal    | Jornada mínima   | 1 browser          | Sin móvil     | 8-10   |
| **Insuficiente**  | Sin flujos         | Sin jornada      | Sin tests          | Sin tests     | 0-7    |

### **5. Quality Assurance (15 puntos)**

#### **Criterios de Evaluación**

- **Linting Setup**: Configuración de ESLint
- **Code Formatting**: Configuración de Prettier
- **Pre-commit Hooks**: Configuración de Husky
- **CI/CD**: Pipeline básico

#### **Rúbrica Quality Assurance**

| Nivel             | Linting                | Formatting            | Hooks              | CI/CD             | Puntos |
| ----------------- | ---------------------- | --------------------- | ------------------ | ----------------- | ------ |
| **Excelente**     | Configuración completa | Formatting automático | Hooks funcionales  | Pipeline completo | 14-15  |
| **Bueno**         | Configuración básica   | Formatting manual     | Hooks básicos      | Pipeline básico   | 11-13  |
| **Satisfactorio** | Configuración mínima   | Sin formatting        | Sin hooks          | Sin pipeline      | 8-10   |
| **Insuficiente**  | Sin configuración      | Sin herramientas      | Sin automatización | Sin CI/CD         | 0-7    |

---

## 📝 Examen Práctico

### **Parte 1: Unit Testing (30 minutos)**

#### **Ejercicio 1: Testing de Utilidades**

```javascript
// Implementar tests para estas funciones
// src/utils/cart.js

export const addToCart = (cart, item) => {
  const existingItem = cart.find(cartItem => cartItem.id === item.id);

  if (existingItem) {
    return cart.map(cartItem =>
      cartItem.id === item.id
        ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
        : cartItem
    );
  }

  return [...cart, item];
};

export const removeFromCart = (cart, itemId) => {
  return cart.filter(item => item.id !== itemId);
};

export const calculateTotal = cart => {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
};

export const applyDiscount = (total, discountCode) => {
  const discounts = {
    SAVE10: 0.1,
    SAVE20: 0.2,
    WELCOME: 0.15,
  };

  const discount = discounts[discountCode];
  if (!discount) throw new Error('Invalid discount code');

  return total * (1 - discount);
};
```

**Instrucciones:**

1. Crear archivo `cart.test.js`
2. Implementar tests para todas las funciones
3. Incluir casos límite y manejo de errores
4. Alcanzar 100% de cobertura

#### **Ejercicio 2: Testing de Componente React**

```javascript
// Implementar tests para este componente
// src/components/ShoppingCart.jsx

import React, { useState } from 'react';
import { calculateTotal, removeFromCart } from '../utils/cart';

const ShoppingCart = ({ items, onUpdateCart, onCheckout }) => {
  const [loading, setLoading] = useState(false);

  const handleRemoveItem = itemId => {
    const updatedCart = removeFromCart(items, itemId);
    onUpdateCart(updatedCart);
  };

  const handleCheckout = async () => {
    setLoading(true);
    try {
      await onCheckout(items);
    } finally {
      setLoading(false);
    }
  };

  const total = calculateTotal(items);

  if (items.length === 0) {
    return <div data-testid="empty-cart">Your cart is empty</div>;
  }

  return (
    <div data-testid="shopping-cart">
      <h2>Shopping Cart</h2>
      {items.map(item => (
        <div
          key={item.id}
          data-testid="cart-item">
          <span>{item.name}</span>
          <span>${item.price}</span>
          <span>Qty: {item.quantity}</span>
          <button
            onClick={() => handleRemoveItem(item.id)}
            data-testid={`remove-${item.id}`}>
            Remove
          </button>
        </div>
      ))}
      <div data-testid="cart-total">Total: ${total.toFixed(2)}</div>
      <button
        onClick={handleCheckout}
        disabled={loading}
        data-testid="checkout-button">
        {loading ? 'Processing...' : 'Checkout'}
      </button>
    </div>
  );
};

export default ShoppingCart;
```

**Instrucciones:**

1. Crear archivo `ShoppingCart.test.jsx`
2. Testear renderizado con y sin items
3. Testear interacciones (remove, checkout)
4. Testear estados de loading
5. Usar React Testing Library

### **Parte 2: Integration Testing (15 minutos)**

#### **Ejercicio 3: API Integration Test**

```javascript
// Implementar integration test para esta API
// server/routes/orders.js

router.post('/orders', async (req, res) => {
  try {
    const { items, customerInfo } = req.body;

    // Validate items
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'No items provided' });
    }

    // Calculate total
    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Create order
    const order = await Order.create({
      items,
      customerInfo,
      total,
      status: 'pending',
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**Instrucciones:**

1. Crear archivo `orders.test.js`
2. Testear creación exitosa de orden
3. Testear validación de items
4. Testear manejo de errores
5. Usar Supertest

### **Parte 3: Quality Setup (15 minutos)**

#### **Ejercicio 4: Configuración de Quality Tools**

**Instrucciones:**

1. Configurar ESLint con reglas para React y Testing
2. Configurar Prettier con estilo del proyecto
3. Configurar pre-commit hooks con Husky
4. Crear script de CI básico

**Archivos requeridos:**

- `.eslintrc.js`
- `.prettierrc`
- `package.json` (scripts)
- `.github/workflows/ci.yml`

---

## 📊 Examen Teórico

### **Preguntas de Opción Múltiple (20 preguntas)**

#### **1. Testing Fundamentals**

¿Cuál es la diferencia principal entre TDD y BDD?

- A) TDD usa Jest, BDD usa Mocha
- B) TDD se enfoca en implementación, BDD en comportamiento
- C) TDD es para frontend, BDD para backend
- D) No hay diferencia

#### **2. React Testing Library**

¿Cuál es la filosofía principal de React Testing Library?

- A) Test implementation details
- B) Test components in isolation
- C) Test behavior as user would interact
- D) Test only props and state

#### **3. Coverage Metrics**

¿Qué tipo de coverage es más importante?

- A) Line coverage
- B) Branch coverage
- C) Function coverage
- D) Statement coverage

#### **4. Mocking**

¿Cuándo deberías usar mocks?

- A) Siempre que sea posible
- B) Solo para dependencias externas
- C) Nunca, prefiere tests reales
- D) Solo para APIs

#### **5. Accessibility Testing**

¿Qué herramienta es mejor para testing automático de accesibilidad?

- A) Lighthouse
- B) axe-core
- C) WAVE
- D) Todas las anteriores

### **Preguntas de Desarrollo (5 preguntas)**

#### **1. Estrategia de Testing**

Explica tu estrategia para testear una aplicación e-commerce completa. Incluye:

- Tipos de tests necesarios
- Herramientas a usar
- Métricas a medir
- Proceso de CI/CD

#### **2. Performance Testing**

¿Cómo implementarías performance testing en una aplicación React? Menciona:

- Métricas importantes
- Herramientas a usar
- Thresholds recomendados
- Integración con CI/CD

#### **3. Accessibility**

Describe el proceso para asegurar que una aplicación web sea accesible:

- Testing automático
- Testing manual
- Herramientas necesarias
- Estándares a seguir

#### **4. Quality Assurance**

¿Cómo establecerías quality gates en un proyecto?

- Herramientas de linting
- Pre-commit hooks
- CI/CD pipeline
- Code review process

#### **5. Debugging Tests**

¿Cómo debuggearías un test que falla intermitentemente?

- Estrategias de debugging
- Herramientas a usar
- Cómo identificar flaky tests
- Cómo solucionarlos

---

## 🎯 Evaluación Final

### **Puntuación Total: 100 puntos**

#### **Distribución de Puntos**

- **Examen Práctico**: 70 puntos
  - Unit Testing: 25 puntos
  - Integration Testing: 25 puntos
  - Component Testing: 20 puntos
- **Examen Teórico**: 30 puntos
  - Opción múltiple: 20 puntos
  - Desarrollo: 10 puntos

#### **Escala de Calificación**

- **90-100 puntos**: Excelente (A)
- **80-89 puntos**: Bueno (B)
- **70-79 puntos**: Satisfactorio (C)
- **60-69 puntos**: Insuficiente (D)
- **0-59 puntos**: Reprobado (F)

### **Criterios de Aprobación**

- **Mínimo para aprobar**: 70 puntos
- **Tiempo límite**: 90 minutos total
- **Requisitos adicionales**:
  - Código funcional
  - Tests que pasen
  - Configuración correcta

---

## 📋 Checklist de Entrega

### **Archivos Requeridos**

- [ ] `cart.test.js` - Tests de utilidades
- [ ] `ShoppingCart.test.jsx` - Tests de componente
- [ ] `orders.test.js` - Integration tests
- [ ] `.eslintrc.js` - Configuración ESLint
- [ ] `.prettierrc` - Configuración Prettier
- [ ] `package.json` - Scripts actualizados
- [ ] `.github/workflows/ci.yml` - CI/CD pipeline

### **Funcionalidades Requeridas**

- [ ] Tests unitarios con 85%+ coverage
- [ ] Tests de componentes con RTL
- [ ] Integration tests con Supertest
- [ ] Quality tools configuradas
- [ ] Pre-commit hooks funcionales
- [ ] CI/CD pipeline básico

### **Documentación**

- [ ] README con instrucciones de testing
- [ ] Comentarios en tests complejos
- [ ] Explicación de estrategia de testing

---

## 🏆 Competencias Evaluadas

### **Competencias Técnicas**

- **Testing Frameworks**: Jest, RTL, Playwright
- **Quality Tools**: ESLint, Prettier, Husky
- **CI/CD**: GitHub Actions, automatización
- **Performance**: Lighthouse, Web Vitals
- **Accessibility**: axe-core, WCAG compliance

### **Competencias Blandas**

- **Problem Solving**: Debugging y troubleshooting
- **Attention to Detail**: Calidad de código
- **Best Practices**: Siguiendo estándares
- **Documentation**: Documentación clara

### **Preparación WorldSkills**

- **Time Management**: Desarrollo eficiente
- **Quality Focus**: Código de calidad profesional
- **Testing Strategy**: Estrategia completa
- **Automation**: Herramientas automáticas

¡Esta evaluación asegura que los estudiantes dominen testing y quality assurance a nivel profesional!
