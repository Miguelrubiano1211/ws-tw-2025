// Galería Animada - JavaScript
document.addEventListener('DOMContentLoaded', function () {
  initializeGallery();
  initializeModal();
  initializeScrollEffects();
  initializeIntersectionObserver();
});

// Inicializar la galería
function initializeGallery() {
  const filterButtons = document.querySelectorAll('[data-filter]');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterButtons.forEach(button => {
    button.addEventListener('click', function () {
      const filter = this.getAttribute('data-filter');
      filterGallery(filter);
      updateActiveButton(this);
    });
  });

  // Animación inicial de los elementos
  setTimeout(() => {
    galleryItems.forEach((item, index) => {
      setTimeout(() => {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }, 300);
}

// Filtrar la galería
function filterGallery(filter) {
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach(item => {
    const category = item.getAttribute('data-category');

    if (filter === 'all' || category === filter) {
      item.classList.remove('hidden');
      item.style.animation = 'fadeInUp 0.5s ease-out';
    } else {
      item.classList.add('hidden');
    }
  });
}

// Actualizar botón activo
function updateActiveButton(activeButton) {
  const filterButtons = document.querySelectorAll('[data-filter]');

  filterButtons.forEach(button => {
    button.classList.remove('active');
  });

  activeButton.classList.add('active');
}

// Inicializar modal
function initializeModal() {
  const modal = new bootstrap.Modal(document.getElementById('imageModal'));
  window.galleryModal = modal;
}

// Abrir modal con imagen
function openModal(button) {
  const card = button.closest('.gallery-card');
  const img = card.querySelector('img');
  const title = card.querySelector('h3').textContent;
  const description = card.querySelector('p').textContent;

  // Actualizar contenido del modal
  document.getElementById('modalImage').src = img.src;
  document.getElementById('modalImage').alt = img.alt;
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalDescription').textContent = description;

  // Mostrar modal
  window.galleryModal.show();

  // Agregar efecto de zoom a la imagen del modal
  const modalImg = document.getElementById('modalImage');
  modalImg.style.transform = 'scale(0.8)';
  modalImg.style.transition = 'transform 0.3s ease-out';

  setTimeout(() => {
    modalImg.style.transform = 'scale(1)';
  }, 100);
}

// Scroll suave a la galería
function scrollToGallery() {
  const gallerySection = document.getElementById('galeria');
  gallerySection.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
}

// Efectos de scroll
function initializeScrollEffects() {
  let lastScrollTop = 0;
  const navbar = document.querySelector('.navbar');

  window.addEventListener('scroll', function () {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Navbar hiding effect
    if (scrollTop > lastScrollTop && scrollTop > 100) {
      navbar.style.transform = 'translateY(-100%)';
    } else {
      navbar.style.transform = 'translateY(0)';
    }

    lastScrollTop = scrollTop;

    // Parallax effect for hero background
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground && scrollTop < window.innerHeight) {
      const parallaxSpeed = scrollTop * 0.5;
      heroBackground.style.transform = `translateY(${parallaxSpeed}px)`;
    }
  });

  // Smooth transitions for navbar
  navbar.style.transition = 'transform 0.3s ease-in-out';
}

// Intersection Observer para animaciones
function initializeIntersectionObserver() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Animación especial para cards de galería
        if (entry.target.classList.contains('gallery-item')) {
          entry.target.style.animation = 'bounceIn 0.6s ease-out';
        }
      }
    });
  }, observerOptions);

  // Observar elementos con clase fade-in
  document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
  });

  // Observar elementos de galería
  document.querySelectorAll('.gallery-item').forEach(el => {
    observer.observe(el);
  });
}

// Efectos de hover adicionales
document.addEventListener('DOMContentLoaded', function () {
  const galleryCards = document.querySelectorAll('.gallery-card');

  galleryCards.forEach(card => {
    card.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-10px) scale(1.02)';
      this.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.3)';
    });

    card.addEventListener('mouseleave', function () {
      this.style.transform = 'translateY(0) scale(1)';
      this.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
    });
  });
});

// Lazy loading para imágenes
function initializeLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');

  const imageObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));
}

// Funciones de utilidad
const utils = {
  // Debounce function
  debounce: function (func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Throttle function
  throttle: function (func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  // Smooth scroll to element
  scrollToElement: function (element, offset = 0) {
    const elementPosition = element.offsetTop - offset;
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth',
    });
  },
};

// Optimización de performance
const performanceOptimizations = {
  // Optimizar scroll events
  optimizeScrollEvents: function () {
    const scrollHandler = utils.throttle(() => {
      // Scroll event logic here
    }, 16); // ~60fps

    window.addEventListener('scroll', scrollHandler);
  },

  // Preload images
  preloadImages: function () {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      const imagePreloader = new Image();
      imagePreloader.src = img.src;
    });
  },
};

// Inicializar optimizaciones
document.addEventListener('DOMContentLoaded', function () {
  performanceOptimizations.optimizeScrollEvents();
  initializeLazyLoading();
});

// Manejar errores de carga de imágenes
document.addEventListener(
  'error',
  function (e) {
    if (e.target.tagName === 'IMG') {
      e.target.src =
        'https://via.placeholder.com/400x300?text=Imagen+no+disponible';
      e.target.alt = 'Imagen no disponible';
    }
  },
  true
);

// Exportar funciones para uso global
window.GalleryApp = {
  openModal,
  scrollToGallery,
  filterGallery,
  utils,
};
