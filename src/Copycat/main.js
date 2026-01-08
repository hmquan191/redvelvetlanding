/**
 * Red Velvet - Cosmic Velvet
 * Main JavaScript
 */

// ============================================
// Initialize Lucide Icons
// ============================================
if (typeof lucide !== "undefined") {
  lucide.createIcons();
}

// ============================================
// Seamless Infinite Carousel
// ============================================
function setupCarousel() {
  const track = document.querySelector(".carousel-track");
  if (!track) return;

  const items = track.querySelectorAll(".carousel-item");
  if (items.length === 0) return;

  // Clone all items and append them for seamless loop
  items.forEach((item) => {
    const clone = item.cloneNode(true);
    track.appendChild(clone);
  });

  console.log("🎠 Carousel initialized with", items.length * 2, "items");
}

// ============================================
// Navigation Bar Functionality
// ============================================
function setupNavigation() {
  const navContainer = document.querySelector(".nav-container");
  const mobileToggle = document.querySelector(".nav-mobile-toggle");
  const mobileNav = document.querySelector(".nav-mobile");

  // Scroll effect for navigation bar
  if (navContainer) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        navContainer.classList.add("scrolled");
      } else {
        navContainer.classList.remove("scrolled");
      }
    });
  }

  // Mobile menu toggle
  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener("click", () => {
      mobileNav.classList.toggle("hidden");

      // Update aria-expanded
      const isExpanded = !mobileNav.classList.contains("hidden");
      mobileToggle.setAttribute("aria-expanded", isExpanded);

      // Animate hamburger icon
      const lines = mobileToggle.querySelectorAll("line");
      if (isExpanded) {
        lines[0].style.transform = "rotate(45deg) translate(5px, 5px)";
        lines[1].style.opacity = "0";
        lines[2].style.transform = "rotate(-45deg) translate(5px, -5px)";
      } else {
        lines[0].style.transform = "";
        lines[1].style.opacity = "1";
        lines[2].style.transform = "";
      }
    });

    // Close mobile menu when clicking a link
    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileNav.classList.add("hidden");
        mobileToggle.setAttribute("aria-expanded", "false");
      });
    });
  }
}

// ============================================
// Intersection Observer Configuration
// ============================================
const observerOptions = {
  threshold: 0.3,
  rootMargin: "0px 0px -50px 0px",
};

// ============================================
// Intersection Observer for Scroll Animations
// ============================================
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Animate elements inside the section
      const text = entry.target.querySelector(".section-text");
      const card = entry.target.querySelector(".section-card");

      if (text) {
        text.classList.remove("opacity-0", "translate-y-8");
      }
      if (card) {
        card.classList.remove("opacity-0", "translate-y-12");
      }

      // Update Navigation Dots
      updateNavigationDots(entry.target.id);
    }
  });
}, observerOptions);

// ============================================
// Update Navigation Dots Active State
// ============================================
function updateNavigationDots(activeId) {
  document.querySelectorAll(".nav-dot").forEach((dot) => {
    if (dot.dataset.target === activeId) {
      dot.classList.add("scale-150", "opacity-100");
      dot.classList.remove("bg-white/30");
      dot.style.opacity = "1";
    } else {
      dot.classList.remove("scale-150", "opacity-100");
      dot.classList.add("bg-white/30");
      dot.style.opacity = "0.5";
    }
  });
}

// ============================================
// Smooth Scroll Navigation
// ============================================
function setupSmoothScroll() {
  document.querySelectorAll(".nav-dot").forEach((dot) => {
    dot.addEventListener("click", (e) => {
      const targetId = e.target.dataset.target;
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

// ============================================
// Initialize Observers
// ============================================
function initializeObservers() {
  document.querySelectorAll(".section").forEach((section) => {
    observer.observe(section);
  });
}

// ============================================
// Performance: Preload Images
// ============================================
function preloadImages() {
  const images = document.querySelectorAll("img[data-src]");

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach((img) => imageObserver.observe(img));
  } else {
    // Fallback for older browsers
    images.forEach((img) => {
      img.src = img.dataset.src;
      img.removeAttribute("data-src");
    });
  }
}

// ============================================
// Initialize on DOM Ready
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  initializeObservers();
  setupSmoothScroll();
  preloadImages();
  setupCarousel();
  playIntro();

  // Log initialization
  console.log("🌟 Cosmic Velvet initialized");
  console.log("✨ Fairy tape recorder ready");
});

// ============================================
// Intro Sequence
// ============================================
function playIntro() {
  const introScreen = document.getElementById("intro-screen");
  const introText = document.getElementById("intro-text");
  const fanIntro = document.getElementById("fan-intro");
  const fanCards = document.querySelectorAll(".fan-card");
  
  if (!introScreen || !introText) return;

  // Fonts to cycle through
  const fonts = [
    "'Inter', sans-serif",
    "'Playfair Display', serif",
    "'Cinzel', serif",
    "'Dancing Script', cursive",
    "'Anton', sans-serif",
    "'Abril Fatface', cursive",
    "'Permanent Marker', cursive",
    "'Roboto Slab', serif",
    "'Pacifico', cursive",
    "'Oswald', sans-serif",
    "'Lobster', cursive",
    "'Shadows Into Light', cursive",
    "'Monoton', cursive",
    "'Righteous', cursive",
    "'Bangers', cursive",
    "'Creepster', cursive",
    "'Gloria Hallelujah', cursive",
    "'Courier New', monospace"
  ];

  let fontIndex = 0;
  const totalDuration = 2000; // 2 seconds (Slightly adjusted for sleekness)
  const intervalDuration = 150; // 150ms (Less dizzying, still fast)
  const steps = totalDuration / intervalDuration;
  let currentStep = 0;

  // Disable scrolling during intro
  document.body.style.overflow = "hidden";

  // Cycle fonts
  const fontInterval = setInterval(() => {
    introText.style.fontFamily = fonts[fontIndex % fonts.length];
    
    // Keep text white
    introText.style.color = "#ffffff";
    
    fontIndex++;
    currentStep++;
    // them comment rac'
    if (currentStep >= steps) {
      clearInterval(fontInterval);
      finishIntro();
    }
  }, intervalDuration);

  function finishIntro() {
    // Reset text style for final look before slide up
    introText.style.fontFamily = "'Playfair Display', serif";
    introText.style.color = "#ffffff";
    
    // Slide up intro screen
    setTimeout(() => {
      introScreen.classList.add("slide-up-reveal");
      
      // Hide intro screen completely after transition
      setTimeout(() => {
        introScreen.style.display = "none";
      }, 1000);

      // Show Fan Intro
      if (fanIntro) {
        fanIntro.classList.remove("hidden");
        
        // Trigger Fan Animation
        setTimeout(() => {
          fanCards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add("active");
            }, index * 80); // Faster stagger
          });
          
          // Enable scrolling
          setTimeout(() => {
             document.body.style.overflow = "";
          }, 800);

          // Interaction Logic: Pause on hover, wait 2s after leave, then fade
          let fadeTimer;
          let isHovering = false;
          const autoHideDelay = 3000; // Initial auto-hide delay if no interaction
          const hoverHideDelay = 2000; // Delay after leaving hover

          // Function to hide the fan intro
          const hideFanIntro = () => {
            if (isHovering) return; // Don't hide if still hovering
            
            fanIntro.style.transition = "opacity 0.8s ease-out";
            fanIntro.style.opacity = "0";
            setTimeout(() => {
              fanIntro.classList.add("hidden");
            }, 800);
          };

          // Start initial timer
          fadeTimer = setTimeout(hideFanIntro, autoHideDelay);

          // Add event listeners to cards
          fanCards.forEach(card => {
            card.addEventListener("mouseenter", () => {
              isHovering = true;
              clearTimeout(fadeTimer); // Stop any pending hide
              fanIntro.style.opacity = "1"; // Ensure it stays visible
            });

            card.addEventListener("mouseleave", () => {
              isHovering = false;
              // Restart timer with 2 seconds delay
              clearTimeout(fadeTimer);
              fadeTimer = setTimeout(hideFanIntro, hoverHideDelay);
            });
          });

          // Also handle mouse entering/leaving the container (for gaps)
          const fanContainer = fanIntro.querySelector(".perspective-1000");
          if (fanContainer) {
             fanContainer.addEventListener("mouseenter", () => {
                isHovering = true;
                clearTimeout(fadeTimer);
             });
             fanContainer.addEventListener("mouseleave", () => {
                isHovering = false;
                clearTimeout(fadeTimer);
                fadeTimer = setTimeout(hideFanIntro, hoverHideDelay);
             });
          }
          
        }, 500);
      } else {
         document.body.style.overflow = "";
      }
      
    }, 500);
  }
}

// ============================================
// Export functions for external use
// ============================================
window.CosmicVelvet = {
  setupNavigation,
  updateNavigationDots,
  setupSmoothScroll,
  initializeObservers,
  setupCarousel,
};
