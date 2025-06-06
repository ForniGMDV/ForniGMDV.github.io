// VARIABLES GLOBALES OPTIMIZADAS
const body = document.body;
let mouseX = 0, mouseY = 0;
let cursorTrails = [];
let isCustomCursor = true;
let animationId = null;
let clickScale = 1;
let isInitialized = false;

// FECHA DE NACIMIENTO (ajusta esta fecha con tu fecha de nacimiento exacta)
const birthDate = new Date('2004-05-27T18:00:00');

// SISTEMA DE CURSOR PERSONALIZADO CON VALIDACIONES
function initCursor() {
  try {
    // Limpiar cursores existentes
    document.querySelectorAll('.cursor, .cursor-trail').forEach(el => {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });
    cursorTrails = [];

    // Verificar si estamos en móvil
    if (window.innerWidth <= 768) {
      console.log('Móvil detectado - cursor personalizado deshabilitado');
      return;
    }

    // Crear elementos del trail
    for (let i = 0; i < 12; i++) {
      const trail = document.createElement("div");
      const isMainCursor = i === 0;
      
      if (isMainCursor) {
        // Cursor principal
        trail.className = "cursor";
        trail.style.cssText = `
          position: fixed;
          width: 16px;
          height: 16px;
          background: radial-gradient(circle, #ff69b4 0%, #ff1493 70%, #c71585 100%);
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          transform: translate(-50%, -50%);
          box-shadow: 
            0 0 20px rgba(255, 105, 180, 0.8),
            0 0 40px rgba(255, 105, 180, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.2);
          opacity: ${isCustomCursor ? '1' : '0'};
          left: 50%;
          top: 50%;
        `;
      } else {
        // Elementos del trail
        trail.className = "cursor-trail";
        trail.style.cssText = `
          position: fixed;
          width: 8px;
          height: 8px;
          background: rgba(255, 105, 180, 0.6);
          border-radius: 50%;
          pointer-events: none;
          z-index: 9998;
          transform: translate(-50%, -50%);
          transition: none;
          opacity: ${isCustomCursor ? '1' : '0'};
          left: 50%;
          top: 50%;
        `;
      }
      
      document.body.appendChild(trail);
      cursorTrails.push({
        element: trail,
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        targetX: window.innerWidth / 2,
        targetY: window.innerHeight / 2,
        isMain: isMainCursor
      });
    }
    
    // Asegurar que el body tenga la clase custom-cursor
    if (isCustomCursor) {
      body.classList.add('custom-cursor');
      // Iniciar animación
      if (!animationId) {
        updateCursor();
      }
    }
    
    console.log('✅ Cursor personalizado inicializado correctamente');
  } catch (error) {
    console.error('❌ Error inicializando cursor:', error);
    // Fallback: deshabilitar cursor personalizado
    isCustomCursor = false;
    body.classList.remove('custom-cursor');
  }
}

// Movimiento del cursor MEJORADO Y SEGURO
function updateCursor() {
  try {
    if (!isCustomCursor || cursorTrails.length === 0) {
      animationId = null;
      return;
    }

    cursorTrails.forEach((trail, index) => {
      if (!trail.element || !trail.element.parentNode) {
        return; // Skip elementos que ya no existen
      }

      if (index === 0) {
        // El cursor principal sigue al mouse
        trail.targetX = mouseX;
        trail.targetY = mouseY;
        trail.x = mouseX;
        trail.y = mouseY;
      } else {
        // Los trails siguen al elemento anterior
        const prevTrail = cursorTrails[index - 1];
        if (prevTrail) {
          trail.targetX = prevTrail.x;
          trail.targetY = prevTrail.y;
          
          const ease = 0.15 - (index * 0.005);
          trail.x += (trail.targetX - trail.x) * ease;
          trail.y += (trail.targetY - trail.y) * ease;
        }
      }

      // Aplicar posición de forma segura
      if (trail.element && trail.element.style) {
        trail.element.style.left = trail.x + "px";
        trail.element.style.top = trail.y + "px";

        // Efectos solo para trails
        if (!trail.isMain) {
          const scale = Math.max(0.2, 1 - index * 0.08);
          const opacity = Math.max(0.05, 0.7 - index * 0.06);
          
          trail.element.style.transform = `translate(-50%, -50%) scale(${scale})`;
          trail.element.style.opacity = opacity;
          
          const hue = 330 + (index * 3);
          const saturation = Math.max(50, 100 - index * 5);
          trail.element.style.background = `hsla(${hue}, ${saturation}%, 70%, ${opacity})`;
        }
      }
    });

    animationId = requestAnimationFrame(updateCursor);
  } catch (error) {
    console.error('❌ Error en updateCursor:', error);
    animationId = null;
  }
}

// CONTADOR DE EDAD SEGURO
function updateAgeCounter() {
  try {
    const ageElement = document.getElementById('ageCounter');
    if (ageElement) {
      const now = new Date();
      const ageInMilliseconds = now - birthDate;
      const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);
      ageElement.textContent = ageInYears.toFixed(9);
    }
  } catch (error) {
    console.error('❌ Error actualizando contador de edad:', error);
  }
}

// PARALLAX OPTIMIZADO CON VALIDACIONES
let ticking = false;

function updateParallax() {
  try {
    const parallaxBg = document.getElementById("parallaxBg");
    if (parallaxBg) {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.3;
      parallaxBg.style.transform = `translate3d(0, ${rate}px, 0)`;
    }
  } catch (error) {
    console.error('❌ Error en parallax:', error);
  }
  ticking = false;
}

function requestParallaxUpdate() {
  if (!ticking) {
    requestAnimationFrame(updateParallax);
    ticking = true;
  }
}

// SCROLL INDICATOR SEGURO
function updateScrollIndicator() {
  try {
    const scrollIndicator = document.getElementById("scrollIndicator");
    if (scrollIndicator) {
      const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      scrollIndicator.style.width = Math.min(Math.max(scrolled, 0), 100) + "%";
    }
  } catch (error) {
    console.error('❌ Error en scroll indicator:', error);
  }
}

// HEADER SCROLL EFFECT SEGURO
function updateHeader() {
  try {
    const header = document.getElementById("header");
    if (header) {
      if (window.scrollY > 50) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }
  } catch (error) {
    console.error('❌ Error en header:', error);
  }
}

// TYPEWRITER EFFECT SEGURO
function initTypewriter() {
  try {
    const typewriterText = document.getElementById("typewriterText");
    const typewriterCursor = document.getElementById("typewriterCursor");
    
    if (!typewriterText || !typewriterCursor) {
      console.warn('⚠️ Elementos typewriter no encontrados');
      return;
    }
    
    const texts = [
      "Desarrollador Full Stack especializado en experiencias digitales únicas",
      "Experto en React, Node.js y tecnologías modernas",
      "Creando el futuro con código limpio y eficiente",
      "Transformando ideas en realidades digitales",
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeWriter() {
      try {
        if (!typewriterText) return;
        
        const currentText = texts[textIndex];

        if (isDeleting) {
          typewriterText.textContent = currentText.substring(0, charIndex - 1);
          charIndex--;
        } else {
          typewriterText.textContent = currentText.substring(0, charIndex + 1);
          charIndex++;
        }

        let typeSpeed = isDeleting ? 30 : 60;

        if (!isDeleting && charIndex === currentText.length) {
          typeSpeed = 1500;
          isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
          isDeleting = false;
          textIndex = (textIndex + 1) % texts.length;
          typeSpeed = 300;
        }

        setTimeout(typeWriter, typeSpeed);
      } catch (error) {
        console.error('❌ Error en typewriter:', error);
      }
    }

    typeWriter();
    console.log('✅ Typewriter inicializado correctamente');
  } catch (error) {
    console.error('❌ Error inicializando typewriter:', error);
  }
}

// INTERSECTION OBSERVER SEGURO
function initObservers() {
  try {
    if (!window.IntersectionObserver) {
      console.warn('⚠️ IntersectionObserver no soportado, usando fallback');
      document.querySelectorAll(".fade-in-up, .reveal-title").forEach((el) => {
        el.classList.add("visible");
      });
      return;
    }

    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");

          if (entry.target.classList.contains("skill-item")) {
            const progressBar = entry.target.querySelector(".skill-progress");
            if (progressBar) {
              const width = progressBar.getAttribute("data-width");
              setTimeout(() => {
                if (progressBar.style) {
                  progressBar.style.width = width + "%";
                }
              }, 150);
            }
          }
        }
      });
    }, observerOptions);

    document.querySelectorAll(".fade-in-up, .reveal-title, .skill-item").forEach((el) => {
      observer.observe(el);
    });

    console.log('✅ Observers inicializados correctamente');
  } catch (error) {
    console.error('❌ Error inicializando observers:', error);
  }
}

// CONTADOR DE ESTADÍSTICAS SEGURO
function initStatsCounter() {
  try {
    const statsSection = document.querySelector(".stats");
    if (!statsSection) {
      console.warn('⚠️ Sección de estadísticas no encontrada');
      return;
    }

    function animateCounters() {
      try {
        const counters = document.querySelectorAll(".stat-number");
        counters.forEach((counter) => {
          const target = parseInt(counter.getAttribute("data-target"));
          if (isNaN(target)) return;
          
          const duration = 2000;
          const increment = target / (duration / 16);
          let current = 0;

          const updateCounter = () => {
            try {
              if (current < target && counter.textContent !== undefined) {
                current += increment;
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
              } else if (counter.textContent !== undefined) {
                counter.textContent = target;
              }
            } catch (error) {
              console.error('❌ Error actualizando contador:', error);
            }
          };

          requestAnimationFrame(updateCounter);
        });
      } catch (error) {
        console.error('❌ Error en animateCounters:', error);
      }
    }

    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounters();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statsObserver.observe(statsSection);
    console.log('✅ Stats counter inicializado correctamente');
  } catch (error) {
    console.error('❌ Error inicializando stats counter:', error);
  }
}

// SISTEMA DE DETALLES DE PROYECTOS SEGURO - SIN SCROLL AUTOMÁTICO
function showProjectDetails(projectId) {
  try {
    document.querySelectorAll('.project-details').forEach(detail => {
      detail.classList.remove('active');
    });
    
    const detailElement = document.getElementById(`details-${projectId}`);
    if (detailElement) {
      detailElement.classList.add('active');
      // ELIMINADO: scrollIntoView para que no se mueva la cámara
      // La sección simplemente se expande donde está
    }
  } catch (error) {
    console.error('❌ Error mostrando detalles del proyecto:', error);
  }
}

// DETECCIÓN MÓVIL MEJORADA
function handleMobileDetection() {
  try {
    if (window.innerWidth <= 768) {
      isCustomCursor = false;
      body.classList.remove("custom-cursor");
      
      cursorTrails.forEach(trail => {
        if (trail.element && trail.element.style) {
          trail.element.style.display = "none";
        }
      });
      
      const cursorToggle = document.getElementById("cursorToggle");
      if (cursorToggle) {
        cursorToggle.style.display = "none";
      }
      
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
      
      console.log('📱 Modo móvil activado');
    }
  } catch (error) {
    console.error('❌ Error en detección móvil:', error);
  }
}

// EVENT LISTENERS SEGUROS
function initEventListeners() {
  try {
    console.log('🔧 Inicializando event listeners...');

    // Mouse events
    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (isCustomCursor && !animationId) {
        updateCursor();
      }
    });

    document.addEventListener("mousedown", () => {
      if (isCustomCursor && cursorTrails.length > 0 && cursorTrails[0].element) {
        clickScale = 1.4;
        const mainCursor = cursorTrails[0].element;
        mainCursor.style.transform = 'translate(-50%, -50%) scale(1.4)';
        mainCursor.style.background = 'radial-gradient(circle, #ff1493 0%, #c71585 70%, #8b008b 100%)';
      }
    });

    document.addEventListener("mouseup", () => {
      if (isCustomCursor && cursorTrails.length > 0 && cursorTrails[0].element) {
        clickScale = 1;
        const mainCursor = cursorTrails[0].element;
        mainCursor.style.transform = 'translate(-50%, -50%) scale(1)';
        mainCursor.style.background = 'radial-gradient(circle, #ff69b4 0%, #ff1493 70%, #c71585 100%)';
      }
    });

    // Scroll events
    window.addEventListener("scroll", () => {
      requestParallaxUpdate();
      updateScrollIndicator();
      updateHeader();
    }, { passive: true });

    // Cursor toggle
    const cursorToggle = document.getElementById("cursorToggle");
    if (cursorToggle) {
      cursorToggle.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        isCustomCursor = !isCustomCursor;
        if (isCustomCursor) {
          body.classList.add("custom-cursor");
          cursorToggle.textContent = "🖱️";
          cursorToggle.title = "Cambiar a cursor normal";
          cursorTrails.forEach(trail => {
            if (trail.element) trail.element.style.opacity = "1";
          });
          if (!animationId) updateCursor();
        } else {
          body.classList.remove("custom-cursor");
          cursorToggle.textContent = "✨";
          cursorToggle.title = "Cambiar a cursor personalizado";
          cursorTrails.forEach(trail => {
            if (trail.element) trail.element.style.opacity = "0";
          });
          if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
          }
        }
      });
    }

    // Menu hamburguesa
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");
    if (menuToggle && navLinks) {
      menuToggle.addEventListener("click", () => {
        menuToggle.classList.toggle("active");
        navLinks.classList.toggle("active");
      });
    }

    // Smooth scrolling para navegación
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const href = this.getAttribute("href");
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          if (navLinks) navLinks.classList.remove("active");
          if (menuToggle) menuToggle.classList.remove("active");
        }
      });
    });

    // Hero button - MODIFICADO para eliminar scroll automático
    const heroBtn = document.getElementById("heroBtn");
    if (heroBtn) {
      heroBtn.addEventListener("click", function (e) {
        e.preventDefault();
        this.style.transform = "scale(0.95)";
        setTimeout(() => { this.style.transform = ""; }, 150);
        // ELIMINADO: scroll automático a proyectos
        // El botón solo tiene efecto visual ahora
      });
    }

    // Project buttons
    document.querySelectorAll('.project-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const projectCard = e.target.closest('.project-card');
        if (projectCard) {
          const projectId = projectCard.getAttribute('data-project');
          if (projectId) showProjectDetails(projectId);
        }
      });
    });

    // Close buttons
    document.querySelectorAll('.close-details').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const detailElement = e.target.closest('.project-details');
        if (detailElement) {
          detailElement.classList.remove('active');
        }
      });
    });

    // Hover effects - con delay para asegurar que los elementos existan
    setTimeout(() => {
      const interactiveElements = document.querySelectorAll(
        "a, button, .btn, .social-btn, .project-card, .skill-item, .stat-item, .menu-toggle, .close-details, .cursor-toggle"
      );

      interactiveElements.forEach((element) => {
        element.addEventListener("mouseenter", () => {
          if (isCustomCursor && cursorTrails.length > 0 && cursorTrails[0].element) {
            const mainCursor = cursorTrails[0].element;
            mainCursor.style.transform = `translate(-50%, -50%) scale(1.3)`;
            mainCursor.style.boxShadow = `0 0 30px rgba(255, 105, 180, 1), 0 0 60px rgba(255, 105, 180, 0.6)`;
          }
        });

        element.addEventListener("mouseleave", () => {
          if (isCustomCursor && cursorTrails.length > 0 && cursorTrails[0].element) {
            const mainCursor = cursorTrails[0].element;
            mainCursor.style.transform = `translate(-50%, -50%) scale(${clickScale})`;
            mainCursor.style.boxShadow = `0 0 20px rgba(255, 105, 180, 0.8), 0 0 40px rgba(255, 105, 180, 0.4)`;
          }
        }); 
      });
    }, 1000);

    console.log('✅ Event listeners inicializados correctamente');
  } catch (error) {
    console.error('❌ Error inicializando event listeners:', error);
  }
}

// Debounce utility
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// INICIALIZACIÓN PRINCIPAL SEGURA
document.addEventListener("DOMContentLoaded", () => {
  try {
    console.log('🚀 DOM Cargado - Iniciando portfolio...');
    handleMobileDetection();
    isInitialized = true;
  } catch (error) {
    console.error('❌ Error en DOMContentLoaded:', error);
  }
});

// INICIALIZACIÓN FINAL DESPUÉS DE LOAD
window.addEventListener("load", () => {
  try {
    console.log('🔄 Iniciando carga final...');
    
    const loadingScreen = document.getElementById("loadingScreen");
    
    // Función para completar la inicialización
    const completeInitialization = () => {
      try {
        console.log('⚡ Ejecutando inicialización completa...');
        
        // Inicializar todos los componentes en orden
        initTypewriter();
        initCursor();
        initEventListeners();
        initObservers();
        initStatsCounter();
        
        // Iniciar contador de edad
        updateAgeCounter();
        setInterval(updateAgeCounter, 50);
        
        console.log('✅ Portfolio completamente inicializado');
      } catch (error) {
        console.error('❌ Error en inicialización completa:', error);
      }
    };
    
    // Ocultar loading screen con timeout mínimo
    setTimeout(() => {
      if (loadingScreen) {
        loadingScreen.style.opacity = "0";
        setTimeout(() => {
          loadingScreen.style.display = "none";
          completeInitialization();
        }, 300);
      } else {
        // Si no hay loading screen, inicializar directamente
        completeInitialization();
      }
    }, 500); // Reducido de 800ms a 500ms
    
  } catch (error) {
    console.error('❌ Error crítico en window.load:', error);
    // Fallback: ocultar loading screen incluso si hay error
    const loadingScreen = document.getElementById("loadingScreen");
    if (loadingScreen) {
      loadingScreen.style.display = "none";
    }
  }
});

// CLEANUP SEGURO
window.addEventListener("beforeunload", () => {
  try {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    cursorTrails.forEach(trail => {
      if (trail.element && trail.element.parentNode) {
        trail.element.parentNode.removeChild(trail.element);
      }
    });
  } catch (error) {
    console.error('❌ Error en cleanup:', error);
  }
});

// RESIZE HANDLER
window.addEventListener('resize', debounce(() => {
  try {
    handleMobileDetection();
  } catch (error) {
    console.error('❌ Error en resize:', error);
  }
}, 250));