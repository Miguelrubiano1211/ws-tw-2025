/**
 * 🔄 Día 13: Loading States y UX Patterns
 *
 * Implementar estados de carga profesionales con React
 * para mejorar la experiencia del usuario durante las peticiones
 *
 * Conceptos clave:
 * - Loading states management
 * - Skeleton screens
 * - Optimistic UI updates
 * - Error boundaries
 * - User feedback patterns
 */

import { useEffect, useState } from 'react';

// 1. Hook personalizado para manejo de loading states
const useApiCall = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await apiFunction();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  return { data, loading, error };
};

// 2. Componente de Skeleton Screen
const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton-image"></div>
    <div className="skeleton-content">
      <div className="skeleton-title"></div>
      <div className="skeleton-text"></div>
      <div className="skeleton-text short"></div>
    </div>
  </div>
);

// 3. Componente principal con loading states
const ProductList = () => {
  const {
    data: products,
    loading,
    error,
  } = useApiCall(async () => {
    // Simulación de API call con delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    return [
      { id: 1, name: 'Producto 1', price: 29.99 },
      { id: 2, name: 'Producto 2', price: 49.99 },
      { id: 3, name: 'Producto 3', price: 19.99 },
    ];
  }, []);

  if (error) {
    return (
      <div className="error-state">
        <h3>¡Ups! Algo salió mal</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Intentar de nuevo
        </button>
      </div>
    );
  }

  return (
    <div className="product-list">
      <h2>Productos</h2>
      <div className="products-grid">
        {loading
          ? // Mostrar skeleton screens mientras carga
            Array(6)
              .fill(null)
              .map((_, index) => <SkeletonCard key={index} />)
          : products?.map(product => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
      </div>
    </div>
  );
};

// 4. Componente de producto individual
const ProductCard = ({ product }) => (
  <div className="product-card">
    <div className="product-image">
      <img
        src={`/api/images/${product.id}`}
        alt={product.name}
      />
    </div>
    <div className="product-info">
      <h3>{product.name}</h3>
      <p className="price">${product.price}</p>
      <button className="add-to-cart">Agregar al carrito</button>
    </div>
  </div>
);

// 5. Componente con Optimistic UI
const OptimisticCounter = () => {
  const [count, setCount] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  const updateCount = async newCount => {
    // Optimistic update (actualizar UI inmediatamente)
    setCount(newCount);
    setIsUpdating(true);

    try {
      // Simulación de API call
      await fetch('/api/counter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: newCount }),
      });
    } catch (error) {
      // Revertir el cambio en caso de error
      setCount(count);
      console.error('Error al actualizar contador:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="optimistic-counter">
      <h3>Contador Optimista</h3>
      <div className="counter-display">
        {count}
        {isUpdating && <span className="updating">⟳</span>}
      </div>
      <button
        onClick={() => updateCount(count + 1)}
        disabled={isUpdating}>
        Incrementar
      </button>
    </div>
  );
};

// 6. Componente principal de la aplicación
const App = () => {
  return (
    <div className="app">
      <header>
        <h1>Loading States Demo</h1>
      </header>
      <main>
        <ProductList />
        <OptimisticCounter />
      </main>
    </div>
  );
};

// 7. Estilos CSS para skeleton screens
const skeletonStyles = `
  .skeleton-card {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;
    animation: pulse 1.5s ease-in-out infinite;
  }

  .skeleton-image {
    width: 100%;
    height: 200px;
    background: #e9ecef;
    border-radius: 4px;
    margin-bottom: 12px;
  }

  .skeleton-title {
    width: 70%;
    height: 20px;
    background: #e9ecef;
    border-radius: 4px;
    margin-bottom: 8px;
  }

  .skeleton-text {
    width: 100%;
    height: 16px;
    background: #e9ecef;
    border-radius: 4px;
    margin-bottom: 8px;
  }

  .skeleton-text.short {
    width: 40%;
  }

  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.4; }
    100% { opacity: 1; }
  }

  .error-state {
    text-align: center;
    padding: 40px;
    background: #f8d7da;
    border-radius: 8px;
    color: #721c24;
  }

  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }

  .product-card {
    background: white;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .updating {
    color: #007bff;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

// 8. Ejercicios prácticos
const ejerciciosPracticos = [
  {
    titulo: 'Implementar Shimmer Effect',
    descripcion: 'Mejorar skeleton screens con efecto shimmer',
    codigo: `
      .skeleton-shimmer {
        position: relative;
        overflow: hidden;
      }
      
      .skeleton-shimmer::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.6),
          transparent
        );
        animation: shimmer 1.5s infinite;
      }
      
      @keyframes shimmer {
        0% { left: -100%; }
        100% { left: 100%; }
      }
    `,
  },
  {
    titulo: 'Progress Bar Personalizado',
    descripcion: 'Crear barra de progreso para uploads',
    codigo: `
      const ProgressBar = ({ progress, label }) => (
        <div className="progress-container">
          <div className="progress-label">{label}</div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: \`\${progress}%\` }}
            />
          </div>
          <div className="progress-text">{progress}%</div>
        </div>
      );
    `,
  },
  {
    titulo: 'Toast Notifications',
    descripcion: 'Sistema de notificaciones para feedback',
    codigo: `
      const useToast = () => {
        const [toasts, setToasts] = useState([]);
        
        const addToast = (message, type = 'info') => {
          const id = Date.now();
          setToasts(prev => [...prev, { id, message, type }]);
          
          setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id));
          }, 3000);
        };
        
        return { toasts, addToast };
      };
    `,
  },
];

console.log('🔄 Ejercicio 3: Loading States y UX Patterns');
console.log('📝 Conceptos cubiertos:', [
  'Loading states management',
  'Skeleton screens',
  'Optimistic UI updates',
  'Error boundaries',
  'User feedback patterns',
]);

export default App;
