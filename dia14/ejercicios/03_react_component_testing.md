# ⚛️ Ejercicio 3: React Component Testing

## 📝 Descripción

Dominar el testing de componentes React usando React Testing Library, incluyendo props, state, eventos, hooks, y componentes complejos.

## 🎯 Objetivos

- Testear componentes React con React Testing Library
- Verificar renderizado condicional
- Testear interacciones de usuario
- Mockear hooks y contextos
- Testear componentes con formularios
- Implementar testing de componentes conectados

## 📋 Instrucciones

### Paso 1: Crear componente Button básico

```jsx
// src/components/Button.jsx
import React from 'react';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  ...props
}) => {
  const baseClasses = 'btn focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variantClasses = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500',
    secondary: 'bg-gray-500 hover:bg-gray-600 text-white focus:ring-gray-500',
    success: 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-500',
    danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500',
  };

  const sizeClasses = {
    small: 'px-2 py-1 text-sm',
    medium: 'px-4 py-2',
    large: 'px-6 py-3 text-lg',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${
    sizeClasses[size]
  } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;

  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled || loading}
      className={classes}
      {...props}>
      {loading ? (
        <span className="flex items-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Cargando...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
```

### Paso 2: Crear componente Card

```jsx
// src/components/Card.jsx
import React from 'react';

const Card = ({
  title,
  children,
  footer,
  className = '',
  onClick,
  hover = false,
}) => {
  const baseClasses = 'bg-white rounded-lg shadow-md overflow-hidden';
  const hoverClasses = hover
    ? 'hover:shadow-lg transition-shadow cursor-pointer'
    : '';
  const classes = `${baseClasses} ${hoverClasses} ${className}`;

  return (
    <div
      className={classes}
      onClick={onClick}>
      {title && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
      )}
      <div className="px-6 py-4">{children}</div>
      {footer && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
```

### Paso 3: Crear componente Input

```jsx
// src/components/Input.jsx
import React, { useState } from 'react';

const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  required = false,
  disabled = false,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const inputClasses = `
    w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
    ${error ? 'border-red-500' : 'border-gray-300'}
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
  `;

  const handleFocus = () => setIsFocused(true);
  const handleBlur = e => {
    setIsFocused(false);
    onBlur && onBlur(e);
  };

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        className={inputClasses}
        aria-invalid={!!error}
        aria-describedby={
          error ? 'error-message' : helperText ? 'helper-text' : undefined
        }
        {...props}
      />
      {error && (
        <p
          id="error-message"
          className="mt-1 text-sm text-red-600"
          role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p
          id="helper-text"
          className="mt-1 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Input;
```

### Paso 4: Crear componente ProductCard

```jsx
// src/components/ProductCard.jsx
import React from 'react';
import Button from './Button';
import Card from './Card';

const ProductCard = ({
  product,
  onAddToCart,
  onViewDetails,
  isInCart = false,
  loading = false,
}) => {
  const handleAddToCart = () => {
    onAddToCart(product);
  };

  const handleViewDetails = () => {
    onViewDetails(product.id);
  };

  const formatPrice = price => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
    }).format(price);
  };

  return (
    <Card
      title={product.name}
      hover={true}
      onClick={handleViewDetails}
      className="h-full">
      <div className="space-y-3">
        {product.image && (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover rounded"
          />
        )}
        <p className="text-gray-600 text-sm">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-green-600">
            {formatPrice(product.price)}
          </span>
          {product.stock > 0 ? (
            <span className="text-sm text-gray-500">
              Stock: {product.stock}
            </span>
          ) : (
            <span className="text-sm text-red-500">Sin stock</span>
          )}
        </div>
        <Button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || isInCart}
          loading={loading}
          variant={isInCart ? 'secondary' : 'primary'}
          className="w-full">
          {isInCart ? 'En carrito' : 'Agregar al carrito'}
        </Button>
      </div>
    </Card>
  );
};

export default ProductCard;
```

### Paso 5: Crear hook personalizado

```jsx
// src/hooks/useCounter.js
import { useState, useCallback } from 'react';

export const useCounter = (
  initialValue = 0,
  { min = -Infinity, max = Infinity } = {}
) => {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => {
    setCount(prevCount => Math.min(prevCount + 1, max));
  }, [max]);

  const decrement = useCallback(() => {
    setCount(prevCount => Math.max(prevCount - 1, min));
  }, [min]);

  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);

  const setValue = useCallback(
    value => {
      if (typeof value === 'function') {
        setCount(prevCount => {
          const newValue = value(prevCount);
          return Math.max(min, Math.min(max, newValue));
        });
      } else {
        setCount(Math.max(min, Math.min(max, value)));
      }
    },
    [min, max]
  );

  return {
    count,
    increment,
    decrement,
    reset,
    setValue,
  };
};
```

### Paso 6: Crear componente Counter

```jsx
// src/components/Counter.jsx
import React from 'react';
import { useCounter } from '../hooks/useCounter';
import Button from './Button';

const Counter = ({ initialValue = 0, min, max, onChange }) => {
  const { count, increment, decrement, reset } = useCounter(initialValue, {
    min,
    max,
  });

  React.useEffect(() => {
    onChange && onChange(count);
  }, [count, onChange]);

  return (
    <div className="flex items-center space-x-4 p-4 border rounded-lg">
      <Button
        onClick={decrement}
        variant="secondary"
        disabled={count <= min}
        size="small">
        -
      </Button>
      <span className="text-2xl font-bold min-w-12 text-center">{count}</span>
      <Button
        onClick={increment}
        variant="secondary"
        disabled={count >= max}
        size="small">
        +
      </Button>
      <Button
        onClick={reset}
        variant="danger"
        size="small">
        Reset
      </Button>
    </div>
  );
};

export default Counter;
```

### Paso 7: Tests para componente Button

```jsx
// src/components/__tests__/Button.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../Button';

describe('Button Component', () => {
  test('debe renderizar correctamente', () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Click me');
  });

  test('debe llamar onClick cuando se hace clic', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole('button', { name: /click me/i });
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('debe aplicar clases correctas según variant', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-blue-500');

    rerender(<Button variant="danger">Danger</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-red-500');
  });

  test('debe aplicar clases correctas según size', () => {
    const { rerender } = render(<Button size="small">Small</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-2 py-1 text-sm');

    rerender(<Button size="large">Large</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-6 py-3 text-lg');
  });

  test('debe deshabilitar el botón cuando disabled es true', () => {
    render(<Button disabled>Disabled</Button>);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-50 cursor-not-allowed');
  });

  test('debe mostrar loading state', () => {
    render(<Button loading>Loading</Button>);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument(); // SVG spinner
  });

  test('no debe llamar onClick cuando está disabled', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(
      <Button
        onClick={handleClick}
        disabled>
        Disabled
      </Button>
    );

    const button = screen.getByRole('button');
    await user.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  test('debe pasar props adicionales', () => {
    render(<Button data-testid="custom-button">Custom</Button>);

    expect(screen.getByTestId('custom-button')).toBeInTheDocument();
  });

  test('debe tener tipo correcto', () => {
    const { rerender } = render(<Button>Default</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');

    rerender(<Button type="submit">Submit</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });
});
```

### Paso 8: Tests para componente Input

```jsx
// src/components/__tests__/Input.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from '../Input';

describe('Input Component', () => {
  test('debe renderizar correctamente', () => {
    render(<Input placeholder="Enter text" />);

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Enter text');
  });

  test('debe mostrar label cuando se proporciona', () => {
    render(<Input label="Email" />);

    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  test('debe mostrar indicador de requerido', () => {
    render(
      <Input
        label="Email"
        required
      />
    );

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  test('debe manejar cambios de valor', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(
      <Input
        value=""
        onChange={handleChange}
      />
    );

    const input = screen.getByRole('textbox');
    await user.type(input, 'test');

    expect(handleChange).toHaveBeenCalledTimes(4); // una vez por cada carácter
  });

  test('debe mostrar mensaje de error', () => {
    render(<Input error="Este campo es requerido" />);

    const errorMessage = screen.getByText('Este campo es requerido');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveAttribute('role', 'alert');

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveClass('border-red-500');
  });

  test('debe mostrar helper text', () => {
    render(<Input helperText="Ingrese su email" />);

    expect(screen.getByText('Ingrese su email')).toBeInTheDocument();
  });

  test('no debe mostrar helper text cuando hay error', () => {
    render(
      <Input
        error="Error"
        helperText="Helper"
      />
    );

    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.queryByText('Helper')).not.toBeInTheDocument();
  });

  test('debe deshabilitar input cuando disabled es true', () => {
    render(<Input disabled />);

    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('bg-gray-100 cursor-not-allowed');
  });

  test('debe manejar eventos de focus y blur', async () => {
    const user = userEvent.setup();
    const handleBlur = jest.fn();

    render(<Input onBlur={handleBlur} />);

    const input = screen.getByRole('textbox');
    await user.click(input);
    await user.tab();

    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  test('debe soportar diferentes tipos de input', () => {
    const { rerender } = render(<Input type="email" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');

    rerender(<Input type="password" />);
    expect(screen.getByLabelText(/password/i)).toHaveAttribute(
      'type',
      'password'
    );
  });
});
```

### Paso 9: Tests para componente ProductCard

```jsx
// src/components/__tests__/ProductCard.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductCard from '../ProductCard';

const mockProduct = {
  id: 1,
  name: 'Producto Test',
  description: 'Descripción del producto',
  price: 29.99,
  stock: 10,
  image: '/test-image.jpg',
};

describe('ProductCard Component', () => {
  test('debe renderizar información del producto', () => {
    render(
      <ProductCard
        product={mockProduct}
        onAddToCart={jest.fn()}
        onViewDetails={jest.fn()}
      />
    );

    expect(screen.getByText('Producto Test')).toBeInTheDocument();
    expect(screen.getByText('Descripción del producto')).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument(); // Formato simplificado para test
    expect(screen.getByText('Stock: 10')).toBeInTheDocument();
  });

  test('debe mostrar imagen del producto', () => {
    render(
      <ProductCard
        product={mockProduct}
        onAddToCart={jest.fn()}
        onViewDetails={jest.fn()}
      />
    );

    const image = screen.getByRole('img', { name: /producto test/i });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/test-image.jpg');
  });

  test('debe llamar onAddToCart cuando se hace clic en el botón', async () => {
    const user = userEvent.setup();
    const handleAddToCart = jest.fn();

    render(
      <ProductCard
        product={mockProduct}
        onAddToCart={handleAddToCart}
        onViewDetails={jest.fn()}
      />
    );

    const addButton = screen.getByRole('button', {
      name: /agregar al carrito/i,
    });
    await user.click(addButton);

    expect(handleAddToCart).toHaveBeenCalledWith(mockProduct);
  });

  test('debe llamar onViewDetails cuando se hace clic en la tarjeta', async () => {
    const user = userEvent.setup();
    const handleViewDetails = jest.fn();

    render(
      <ProductCard
        product={mockProduct}
        onAddToCart={jest.fn()}
        onViewDetails={handleViewDetails}
      />
    );

    const card = screen.getByRole('generic', { name: /producto test/i });
    await user.click(card);

    expect(handleViewDetails).toHaveBeenCalledWith(mockProduct.id);
  });

  test('debe mostrar estado sin stock', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 };

    render(
      <ProductCard
        product={outOfStockProduct}
        onAddToCart={jest.fn()}
        onViewDetails={jest.fn()}
      />
    );

    expect(screen.getByText('Sin stock')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /agregar al carrito/i })
    ).toBeDisabled();
  });

  test('debe mostrar estado en carrito', () => {
    render(
      <ProductCard
        product={mockProduct}
        onAddToCart={jest.fn()}
        onViewDetails={jest.fn()}
        isInCart={true}
      />
    );

    const button = screen.getByRole('button', { name: /en carrito/i });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  test('debe mostrar estado de carga', () => {
    render(
      <ProductCard
        product={mockProduct}
        onAddToCart={jest.fn()}
        onViewDetails={jest.fn()}
        loading={true}
      />
    );

    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  test('debe formatear precio correctamente', () => {
    const expensiveProduct = { ...mockProduct, price: 1234.56 };

    render(
      <ProductCard
        product={expensiveProduct}
        onAddToCart={jest.fn()}
        onViewDetails={jest.fn()}
      />
    );

    // Verificar que el precio se muestra (el formato exacto depende del navegador)
    expect(screen.getByText(/1.*234.*56/)).toBeInTheDocument();
  });
});
```

### Paso 10: Tests para hook personalizado

```jsx
// src/hooks/__tests__/useCounter.test.js
import { renderHook, act } from '@testing-library/react';
import { useCounter } from '../useCounter';

describe('useCounter Hook', () => {
  test('debe inicializar con valor por defecto', () => {
    const { result } = renderHook(() => useCounter());

    expect(result.current.count).toBe(0);
  });

  test('debe inicializar con valor personalizado', () => {
    const { result } = renderHook(() => useCounter(10));

    expect(result.current.count).toBe(10);
  });

  test('debe incrementar correctamente', () => {
    const { result } = renderHook(() => useCounter(5));

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(6);
  });

  test('debe decrementar correctamente', () => {
    const { result } = renderHook(() => useCounter(5));

    act(() => {
      result.current.decrement();
    });

    expect(result.current.count).toBe(4);
  });

  test('debe resetear al valor inicial', () => {
    const { result } = renderHook(() => useCounter(10));

    act(() => {
      result.current.increment();
      result.current.increment();
    });

    expect(result.current.count).toBe(12);

    act(() => {
      result.current.reset();
    });

    expect(result.current.count).toBe(10);
  });

  test('debe respetar valor mínimo', () => {
    const { result } = renderHook(() => useCounter(0, { min: 0 }));

    act(() => {
      result.current.decrement();
    });

    expect(result.current.count).toBe(0);
  });

  test('debe respetar valor máximo', () => {
    const { result } = renderHook(() => useCounter(10, { max: 10 }));

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(10);
  });

  test('debe establecer valor específico', () => {
    const { result } = renderHook(() => useCounter(0));

    act(() => {
      result.current.setValue(25);
    });

    expect(result.current.count).toBe(25);
  });

  test('debe establecer valor con función', () => {
    const { result } = renderHook(() => useCounter(10));

    act(() => {
      result.current.setValue(prev => prev * 2);
    });

    expect(result.current.count).toBe(20);
  });

  test('debe mantener límites al establecer valor', () => {
    const { result } = renderHook(() => useCounter(5, { min: 0, max: 10 }));

    act(() => {
      result.current.setValue(15);
    });

    expect(result.current.count).toBe(10);

    act(() => {
      result.current.setValue(-5);
    });

    expect(result.current.count).toBe(0);
  });
});
```

### Paso 11: Tests para componente Counter

```jsx
// src/components/__tests__/Counter.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Counter from '../Counter';

describe('Counter Component', () => {
  test('debe renderizar con valor inicial', () => {
    render(<Counter initialValue={5} />);

    expect(screen.getByText('5')).toBeInTheDocument();
  });

  test('debe incrementar cuando se hace clic en +', async () => {
    const user = userEvent.setup();
    render(<Counter initialValue={0} />);

    const incrementButton = screen.getByRole('button', { name: '+' });
    await user.click(incrementButton);

    expect(screen.getByText('1')).toBeInTheDocument();
  });

  test('debe decrementar cuando se hace clic en -', async () => {
    const user = userEvent.setup();
    render(<Counter initialValue={5} />);

    const decrementButton = screen.getByRole('button', { name: '-' });
    await user.click(decrementButton);

    expect(screen.getByText('4')).toBeInTheDocument();
  });

  test('debe resetear cuando se hace clic en Reset', async () => {
    const user = userEvent.setup();
    render(<Counter initialValue={10} />);

    // Incrementar primero
    const incrementButton = screen.getByRole('button', { name: '+' });
    await user.click(incrementButton);
    expect(screen.getByText('11')).toBeInTheDocument();

    // Luego resetear
    const resetButton = screen.getByRole('button', { name: 'Reset' });
    await user.click(resetButton);
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  test('debe deshabilitar botón - cuando llegue al mínimo', () => {
    render(
      <Counter
        initialValue={0}
        min={0}
      />
    );

    const decrementButton = screen.getByRole('button', { name: '-' });
    expect(decrementButton).toBeDisabled();
  });

  test('debe deshabilitar botón + cuando llegue al máximo', () => {
    render(
      <Counter
        initialValue={10}
        max={10}
      />
    );

    const incrementButton = screen.getByRole('button', { name: '+' });
    expect(incrementButton).toBeDisabled();
  });

  test('debe llamar onChange cuando el valor cambia', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(
      <Counter
        initialValue={0}
        onChange={handleChange}
      />
    );

    const incrementButton = screen.getByRole('button', { name: '+' });
    await user.click(incrementButton);

    expect(handleChange).toHaveBeenCalledWith(1);
  });

  test('debe llamar onChange al resetear', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(
      <Counter
        initialValue={5}
        onChange={handleChange}
      />
    );

    // Incrementar primero
    const incrementButton = screen.getByRole('button', { name: '+' });
    await user.click(incrementButton);

    // Resetear
    const resetButton = screen.getByRole('button', { name: 'Reset' });
    await user.click(resetButton);

    expect(handleChange).toHaveBeenLastCalledWith(5);
  });
});
```

## 📊 Verificación

### Ejecutar tests específicos de componentes

```bash
npm test -- --testPathPattern="components"
```

### Ejecutar tests de hooks

```bash
npm test -- --testPathPattern="hooks"
```

### Ejecutar con coverage para componentes

```bash
npm run test:coverage -- --testPathPattern="components"
```

### Ejecutar test específico

```bash
npm test -- --testNamePattern="Button"
```

## 🎯 Criterios de Evaluación

### Componentes Básicos (25 puntos)

- [ ] Tests de Button completos (8 pts)
- [ ] Tests de Input completos (8 pts)
- [ ] Tests de Card completos (9 pts)

### Componentes Avanzados (25 puntos)

- [ ] Tests de ProductCard completos (15 pts)
- [ ] Tests de Counter completos (10 pts)

### Hooks Testing (25 puntos)

- [ ] Tests de useCounter completos (25 pts)

### Calidad y Cobertura (25 puntos)

- [ ] Coverage > 90% en componentes (10 pts)
- [ ] Tests bien estructurados (8 pts)
- [ ] Uso correcto de matchers (7 pts)

## 📚 Recursos Adicionales

- [React Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [Common Testing Patterns](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Testing Hooks](https://react-hooks-testing-library.com/)
- [User Event Documentation](https://testing-library.com/docs/user-event/intro/)
