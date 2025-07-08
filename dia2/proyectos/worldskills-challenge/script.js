// WorldSkills Challenge - Portfolio JavaScript
document.addEventListener('DOMContentLoaded', function () {
  initializeNavbar();
  initializeAnimations();
  initializeSkillBars();
  initializeContactForm();
  initializeScrollEffects();
  initializeParticles();
  initializeTypewriter();
});

// Navbar functionality
function initializeNavbar() {
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');

  // Navbar scroll effect
  window.addEventListener('scroll', function () {
    if (window.scrollY > 100) {
      navbar.style.background = 'rgba(15, 23, 42, 0.98)';
      navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
      navbar.style.background = 'rgba(15, 23, 42, 0.95)';
      navbar.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
    }
  });

  // Smooth scroll for navigation links
  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        const offsetTop = targetElement.offsetTop - 70;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth',
        });
      }
    });
  });

  // Active link highlighting
  window.addEventListener('scroll', function () {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

// Animation system
function initializeAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');

        // Trigger specific animations
        if (entry.target.classList.contains('hero-content')) {
          animateHeroContent();
        }

        if (entry.target.classList.contains('skills-section')) {
          animateSkillBars();
        }

        if (entry.target.classList.contains('project-card')) {
          animateProjectCard(entry.target);
        }
      }
    });
  }, observerOptions);

  // Observe elements
  document
    .querySelectorAll(
      '.hero-content, .about-content, .skills-section, .project-card, .contact-item'
    )
    .forEach(el => {
      observer.observe(el);
    });
}

// Hero content animation
function animateHeroContent() {
  const heroTitle = document.querySelector('.hero-title');
  const heroDescription = document.querySelector('.hero-description');
  const heroButtons = document.querySelector('.hero-buttons');
  const heroStats = document.querySelector('.hero-stats');

  // Animate title
  if (heroTitle) {
    heroTitle.style.opacity = '0';
    heroTitle.style.transform = 'translateY(30px)';
    heroTitle.style.transition = 'all 0.8s ease-out';

    setTimeout(() => {
      heroTitle.style.opacity = '1';
      heroTitle.style.transform = 'translateY(0)';
    }, 200);
  }

  // Animate description
  if (heroDescription) {
    heroDescription.style.opacity = '0';
    heroDescription.style.transform = 'translateY(30px)';
    heroDescription.style.transition = 'all 0.8s ease-out';

    setTimeout(() => {
      heroDescription.style.opacity = '1';
      heroDescription.style.transform = 'translateY(0)';
    }, 400);
  }

  // Animate buttons
  if (heroButtons) {
    heroButtons.style.opacity = '0';
    heroButtons.style.transform = 'translateY(30px)';
    heroButtons.style.transition = 'all 0.8s ease-out';

    setTimeout(() => {
      heroButtons.style.opacity = '1';
      heroButtons.style.transform = 'translateY(0)';
    }, 600);
  }

  // Animate stats
  if (heroStats) {
    heroStats.style.opacity = '0';
    heroStats.style.transform = 'translateY(30px)';
    heroStats.style.transition = 'all 0.8s ease-out';

    setTimeout(() => {
      heroStats.style.opacity = '1';
      heroStats.style.transform = 'translateY(0)';
      animateCounters();
    }, 800);
  }
}

// Counter animation
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');

  counters.forEach(counter => {
    const target = parseInt(counter.textContent);
    const increment = target / 100;
    let current = 0;

    const updateCounter = () => {
      if (current < target) {
        current += increment;
        counter.textContent =
          Math.ceil(current) + (counter.textContent.includes('%') ? '%' : '+');
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent =
          target + (counter.textContent.includes('%') ? '%' : '+');
      }
    };

    updateCounter();
  });
}

// Skill bars animation
function initializeSkillBars() {
  const skillBars = document.querySelectorAll('.skill-progress');

  skillBars.forEach(bar => {
    bar.style.width = '0%';
  });
}

function animateSkillBars() {
  const skillBars = document.querySelectorAll('.skill-progress');

  skillBars.forEach((bar, index) => {
    const width = bar.getAttribute('data-width');

    setTimeout(() => {
      bar.style.width = width + '%';
    }, index * 200);
  });
}

// Project card animation
function animateProjectCard(card) {
  card.style.opacity = '0';
  card.style.transform = 'translateY(50px)';
  card.style.transition = 'all 0.6s ease-out';

  setTimeout(() => {
    card.style.opacity = '1';
    card.style.transform = 'translateY(0)';
  }, 100);
}

// Contact form functionality
function initializeContactForm() {
  const contactForm = document.querySelector('.contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const formData = new FormData(this);
      const submitButton = this.querySelector('button[type="submit"]');

      // Simulate form submission
      submitButton.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Enviando...';
      submitButton.disabled = true;

      setTimeout(() => {
        submitButton.innerHTML = '<i class="fas fa-check"></i> Mensaje Enviado';
        submitButton.classList.remove('btn-primary');
        submitButton.classList.add('btn-success');

        // Reset form
        setTimeout(() => {
          this.reset();
          submitButton.innerHTML =
            '<i class="fas fa-paper-plane"></i> Enviar Mensaje';
          submitButton.classList.remove('btn-success');
          submitButton.classList.add('btn-primary');
          submitButton.disabled = false;
        }, 3000);
      }, 2000);
    });

    // Form validation
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', function () {
        validateField(this);
      });

      input.addEventListener('input', function () {
        if (this.classList.contains('is-invalid')) {
          validateField(this);
        }
      });
    });
  }
}

function validateField(field) {
  const value = field.value.trim();
  let isValid = true;

  // Remove previous validation
  field.classList.remove('is-valid', 'is-invalid');

  if (field.hasAttribute('required') && value === '') {
    isValid = false;
  }

  if (field.type === 'email' && value !== '') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      isValid = false;
    }
  }

  field.classList.add(isValid ? 'is-valid' : 'is-invalid');
  return isValid;
}

// Scroll effects
function initializeScrollEffects() {
  let lastScrollTop = 0;

  window.addEventListener('scroll', function () {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Parallax effect for hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
      const scrolled = scrollTop * 0.5;
      heroSection.style.transform = `translateY(${scrolled}px)`;
    }

    // Update last scroll position
    lastScrollTop = scrollTop;
  });
}

// Particle system
function initializeParticles() {
  const particleContainer = document.querySelector('.hero-particles');

  if (particleContainer) {
    for (let i = 0; i < 50; i++) {
      createParticle(particleContainer);
    }
  }
}

function createParticle(container) {
  const particle = document.createElement('div');
  particle.className = 'particle';
  particle.style.cssText = `
        position: absolute;
        width: 2px;
        height: 2px;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        animation: particleFloat ${Math.random() * 3 + 2}s infinite ease-in-out;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation-delay: ${Math.random() * 2}s;
    `;

  container.appendChild(particle);
}

// Add particle animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes particleFloat {
        0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 1; }
        50% { transform: translateY(-20px) rotate(180deg); opacity: 0.5; }
    }
`;
document.head.appendChild(style);

// Typewriter effect
function initializeTypewriter() {
  const professionSpan = document.querySelector('.profession');

  if (professionSpan) {
    const professions = [
      'Full Stack',
      'Frontend',
      'Backend',
      'React.js',
      'Node.js',
    ];
    let currentIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeWriter() {
      const currentProfession = professions[currentIndex];

      if (isDeleting) {
        professionSpan.textContent = currentProfession.substring(
          0,
          charIndex - 1
        );
        charIndex--;

        if (charIndex === 0) {
          isDeleting = false;
          currentIndex = (currentIndex + 1) % professions.length;
          setTimeout(typeWriter, 500);
        } else {
          setTimeout(typeWriter, 50);
        }
      } else {
        professionSpan.textContent = currentProfession.substring(
          0,
          charIndex + 1
        );
        charIndex++;

        if (charIndex === currentProfession.length) {
          isDeleting = true;
          setTimeout(typeWriter, 2000);
        } else {
          setTimeout(typeWriter, 100);
        }
      }
    }

    setTimeout(typeWriter, 1000);
  }
}

// Utility functions
const utils = {
  // Smooth scroll to element
  scrollToElement: function (element, offset = 70) {
    const elementPosition = element.offsetTop - offset;
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth',
    });
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
};

// Performance optimizations
const performanceOptimizations = {
  // Lazy load images
  lazyLoadImages: function () {
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
  },

  // Optimize scroll events
  optimizeScrollEvents: function () {
    const scrollHandler = utils.throttle(() => {
      // Scroll event optimizations
    }, 16); // ~60fps

    window.addEventListener('scroll', scrollHandler);
  },
};

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', function () {
  performanceOptimizations.lazyLoadImages();
  performanceOptimizations.optimizeScrollEvents();
});

// Export functions for global use
window.PortfolioApp = {
  utils,
  scrollToElement: utils.scrollToElement,
  animateSkillBars,
  animateCounters,
};
