/**
 * 📄 Día 13: Pagination y Infinite Scroll
 *
 * Implementación de paginación avanzada y scroll infinito
 * para manejar grandes volúmenes de datos de manera eficiente
 *
 * Conceptos clave:
 * - Pagination strategies
 * - Infinite scroll
 * - Virtual scrolling
 * - Performance optimization
 * - Loading states
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// 1. Hook para paginación básica
const usePagination = (data, itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return data.slice(start, end);
  }, [data, currentPage, itemsPerPage]);

  const goToPage = useCallback(
    page => {
      setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    },
    [totalPages]
  );

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  return {
    currentData,
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
  };
};

// 2. Hook para scroll infinito
const useInfiniteScroll = (fetchMore, hasMore) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const observerRef = useRef();
  const loadingRef = useRef();

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      setError(null);
      await fetchMore();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchMore, hasMore, loading]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMore, hasMore, loading]);

  return { loading, error, loadingRef };
};

// 3. Componente de paginación clásica
const PaginationComponent = ({
  currentPage,
  totalPages,
  onPageChange,
  showEllipsis = true,
  maxVisiblePages = 7,
}) => {
  const getVisiblePages = () => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(currentPage - half, 1);
    let end = Math.min(start + maxVisiblePages - 1, totalPages);

    // Ajustar si estamos cerca del final
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(end - maxVisiblePages + 1, 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();
  const showStartEllipsis = visiblePages[0] > 1;
  const showEndEllipsis = visiblePages[visiblePages.length - 1] < totalPages;

  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="pagination-button">
        ← Anterior
      </button>

      {showStartEllipsis && showEllipsis && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="pagination-button">
            1
          </button>
          {visiblePages[0] > 2 && <span className="ellipsis">...</span>}
        </>
      )}

      {visiblePages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`pagination-button ${
            currentPage === page ? 'active' : ''
          }`}>
          {page}
        </button>
      ))}

      {showEndEllipsis && showEllipsis && (
        <>
          {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
            <span className="ellipsis">...</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className="pagination-button">
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="pagination-button">
        Siguiente →
      </button>
    </div>
  );
};

// 4. Componente de lista paginada
const PaginatedList = ({ title, fetchData, itemsPerPage = 10 }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const loadPage = useCallback(
    async page => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetchData({
          page,
          limit: itemsPerPage,
          offset: (page - 1) * itemsPerPage,
        });

        setData(response.data);
        setTotalItems(response.total);
        setCurrentPage(page);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [fetchData, itemsPerPage]
  );

  useEffect(() => {
    loadPage(1);
  }, [loadPage]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (loading && data.length === 0) {
    return <div className="loading">Cargando...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <p>Error: {error}</p>
        <button onClick={() => loadPage(currentPage)}>Reintentar</button>
      </div>
    );
  }

  return (
    <div className="paginated-list">
      <div className="list-header">
        <h2>{title}</h2>
        <div className="list-info">
          Mostrando {Math.min(itemsPerPage, data.length)} de {totalItems}{' '}
          elementos
        </div>
      </div>

      <div className="list-content">
        {data.map(item => (
          <div
            key={item.id}
            className="list-item">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <div className="item-meta">
              <span>ID: {item.id}</span>
              <span>Fecha: {new Date(item.date).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={loadPage}
        />
      )}
    </div>
  );
};

// 5. Componente de scroll infinito
const InfiniteScrollList = ({ title, fetchData, itemsPerPage = 20 }) => {
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [initialLoading, setInitialLoading] = useState(true);

  const fetchMore = useCallback(async () => {
    const response = await fetchData({
      page,
      limit: itemsPerPage,
      offset: (page - 1) * itemsPerPage,
    });

    if (response.data.length === 0) {
      setHasMore(false);
    } else {
      setItems(prevItems => [...prevItems, ...response.data]);
      setPage(prevPage => prevPage + 1);
    }

    if (initialLoading) {
      setInitialLoading(false);
    }
  }, [fetchData, page, itemsPerPage, initialLoading]);

  const { loading, error, loadingRef } = useInfiniteScroll(fetchMore, hasMore);

  useEffect(() => {
    fetchMore();
  }, []);

  if (initialLoading) {
    return <div className="loading">Cargando contenido inicial...</div>;
  }

  return (
    <div className="infinite-scroll-list">
      <div className="list-header">
        <h2>{title}</h2>
        <div className="list-info">{items.length} elementos cargados</div>
      </div>

      <div className="list-content">
        {items.map(item => (
          <div
            key={item.id}
            className="list-item">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <div className="item-meta">
              <span>ID: {item.id}</span>
              <span>Fecha: {new Date(item.date).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Elemento observador para infinite scroll */}
      <div
        ref={loadingRef}
        className="loading-trigger">
        {loading && <div className="loading">Cargando más elementos...</div>}
        {error && (
          <div className="error">
            <p>Error: {error}</p>
            <button onClick={fetchMore}>Reintentar</button>
          </div>
        )}
        {!hasMore && !loading && (
          <div className="end-message">No hay más elementos para cargar</div>
        )}
      </div>
    </div>
  );
};

// 6. Virtual Scrolling para listas muy grandes
const VirtualizedList = ({
  items,
  itemHeight = 100,
  containerHeight = 400,
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [visibleStart, setVisibleStart] = useState(0);
  const [visibleEnd, setVisibleEnd] = useState(0);

  const containerRef = useRef();

  // Calcular elementos visibles
  useEffect(() => {
    const start = Math.floor(scrollTop / itemHeight);
    const end = Math.min(
      start + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );

    setVisibleStart(start);
    setVisibleEnd(end);
  }, [scrollTop, itemHeight, containerHeight, items.length]);

  const handleScroll = useCallback(e => {
    setScrollTop(e.target.scrollTop);
  }, []);

  const totalHeight = items.length * itemHeight;
  const offsetY = visibleStart * itemHeight;

  return (
    <div className="virtualized-list">
      <div
        ref={containerRef}
        className="virtual-container"
        style={{ height: containerHeight }}
        onScroll={handleScroll}>
        <div style={{ height: totalHeight, position: 'relative' }}>
          <div
            style={{
              transform: `translateY(${offsetY}px)`,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
            }}>
            {items.slice(visibleStart, visibleEnd).map((item, index) => (
              <div
                key={visibleStart + index}
                className="virtual-item"
                style={{ height: itemHeight }}>
                <div className="virtual-item-content">
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// 7. Componente principal de demostración
const PaginationDemo = () => {
  const [demoType, setDemoType] = useState('paginated');

  // Datos de ejemplo
  const sampleData = useMemo(
    () =>
      Array.from({ length: 1000 }, (_, i) => ({
        id: i + 1,
        title: `Elemento ${i + 1}`,
        description: `Descripción del elemento ${i + 1}`,
        date: new Date(
          Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
        ).toISOString(),
      })),
    []
  );

  // Simulación de API
  const fetchData = useCallback(
    async ({ page, limit, offset }) => {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 500));

      const start = offset;
      const end = start + limit;
      const data = sampleData.slice(start, end);

      return {
        data,
        total: sampleData.length,
        page,
        limit,
      };
    },
    [sampleData]
  );

  return (
    <div className="pagination-demo">
      <div className="demo-header">
        <h1>Demostración de Paginación</h1>
        <div className="demo-controls">
          <button
            onClick={() => setDemoType('paginated')}
            className={demoType === 'paginated' ? 'active' : ''}>
            Paginación Clásica
          </button>
          <button
            onClick={() => setDemoType('infinite')}
            className={demoType === 'infinite' ? 'active' : ''}>
            Scroll Infinito
          </button>
          <button
            onClick={() => setDemoType('virtualized')}
            className={demoType === 'virtualized' ? 'active' : ''}>
            Lista Virtualizada
          </button>
        </div>
      </div>

      <div className="demo-content">
        {demoType === 'paginated' && (
          <PaginatedList
            title="Lista Paginada"
            fetchData={fetchData}
            itemsPerPage={10}
          />
        )}

        {demoType === 'infinite' && (
          <InfiniteScrollList
            title="Lista con Scroll Infinito"
            fetchData={fetchData}
            itemsPerPage={20}
          />
        )}

        {demoType === 'virtualized' && (
          <VirtualizedList
            items={sampleData}
            itemHeight={80}
            containerHeight={400}
          />
        )}
      </div>
    </div>
  );
};

// 8. Estilos CSS
const paginationStyles = `
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin: 20px 0;
  }

  .pagination-button {
    padding: 8px 12px;
    border: 1px solid #ddd;
    background: white;
    cursor: pointer;
    border-radius: 4px;
    transition: all 0.2s;
  }

  .pagination-button:hover {
    background: #f8f9fa;
  }

  .pagination-button.active {
    background: #007bff;
    color: white;
    border-color: #007bff;
  }

  .pagination-button:disabled {
    background: #f8f9fa;
    color: #6c757d;
    cursor: not-allowed;
  }

  .ellipsis {
    padding: 8px 4px;
    color: #6c757d;
  }

  .list-item {
    padding: 16px;
    border-bottom: 1px solid #dee2e6;
  }

  .list-item h3 {
    margin: 0 0 8px 0;
    color: #333;
  }

  .list-item p {
    margin: 0 0 8px 0;
    color: #666;
  }

  .item-meta {
    display: flex;
    gap: 16px;
    font-size: 14px;
    color: #6c757d;
  }

  .loading {
    text-align: center;
    padding: 40px;
    color: #6c757d;
  }

  .error {
    text-align: center;
    padding: 40px;
    color: #dc3545;
  }

  .virtual-container {
    overflow-y: auto;
    border: 1px solid #ddd;
  }

  .virtual-item {
    display: flex;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid #eee;
  }

  .virtual-item-content {
    flex: 1;
  }

  .loading-trigger {
    padding: 20px;
    text-align: center;
  }

  .end-message {
    text-align: center;
    padding: 20px;
    color: #6c757d;
    font-style: italic;
  }
`;

// 9. Ejercicios prácticos
const ejerciciosPracticos = [
  {
    titulo: 'Paginación con Filtros',
    descripcion: 'Combinar paginación con filtros de búsqueda',
    codigo: `
      const useFilteredPagination = (fetchData, filters) => {
        const [data, setData] = useState([]);
        const [currentPage, setCurrentPage] = useState(1);
        
        const loadPage = useCallback(async (page) => {
          const response = await fetchData({
            page,
            filters,
            limit: 10
          });
          
          setData(response.data);
          setCurrentPage(page);
        }, [fetchData, filters]);
        
        // Resetear a página 1 cuando cambien los filtros
        useEffect(() => {
          loadPage(1);
        }, [filters, loadPage]);
        
        return { data, currentPage, loadPage };
      };
    `,
  },
  {
    titulo: 'Scroll Infinito con Caché',
    descripcion: 'Implementar caché para scroll infinito',
    codigo: `
      const useCachedInfiniteScroll = (fetchData) => {
        const [cache, setCache] = useState(new Map());
        
        const fetchPage = useCallback(async (page) => {
          if (cache.has(page)) {
            return cache.get(page);
          }
          
          const data = await fetchData({ page });
          setCache(prev => new Map(prev).set(page, data));
          
          return data;
        }, [fetchData, cache]);
        
        return { fetchPage };
      };
    `,
  },
];

console.log('📄 Ejercicio 8: Pagination y Infinite Scroll');
console.log('📝 Conceptos cubiertos:', [
  'Pagination strategies',
  'Infinite scroll',
  'Virtual scrolling',
  'Performance optimization',
  'Loading states',
]);

export {
  InfiniteScrollList,
  PaginatedList,
  PaginationComponent,
  useInfiniteScroll,
  usePagination,
  VirtualizedList,
};
export default PaginationDemo;
