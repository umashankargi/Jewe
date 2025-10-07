// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initPageLoader();
    initCurrentTime();
    initNavbarToggler();
    initWishlistButtons();
    initAccordion();
    initBackToTop();
    initScrollAnimations();
    initToast();
    initMobileMenu();
    initGoldPrice();
});

// Page Loader
function initPageLoader() {
    const pageLoader = document.querySelector('.page-loader');
    
    if (pageLoader) {
        // Hide loader after page loads
        window.addEventListener('load', function() {
            setTimeout(function() {
                pageLoader.classList.add('fade-out');
                
                // Remove from DOM after animation completes
                setTimeout(function() {
                    pageLoader.style.display = 'none';
                }, 500);
            }, 1000); // Adjust timing as needed
        });
    }
}

// Current Time Updater
function initCurrentTime() {
    const currentTimeElement = document.getElementById('current-time');
    
    if (currentTimeElement) {
        function updateTime() {
            const now = new Date();
            const options = { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
            };
            currentTimeElement.textContent = now.toLocaleDateString('en-IN', options);
        }
        
        // Update immediately and then every minute
        updateTime();
        setInterval(updateTime, 60000);
    }
}

// Navbar Toggler (for desktop)
function initNavbarToggler() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', function() {
            this.classList.toggle('collapsed');
            navbarCollapse.classList.toggle('show');
        });
        
        // Close navbar when clicking on a nav link (mobile)
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth < 992) {
                    navbarToggler.classList.add('collapsed');
                    navbarCollapse.classList.remove('show');
                }
            });
        });
    }
}

// Mobile Menu
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileMenuPanel = document.querySelector('.mobile-menu-panel');
    
    if (mobileMenuBtn && mobileMenuOverlay && mobileMenuPanel) {
        // Open mobile menu
        mobileMenuBtn.addEventListener('click', function() {
            this.classList.add('active');
            mobileMenuOverlay.classList.add('active');
            mobileMenuPanel.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        // Close mobile menu
        function closeMobileMenu() {
            mobileMenuBtn.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
            mobileMenuPanel.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        mobileMenuClose.addEventListener('click', closeMobileMenu);
        mobileMenuOverlay.addEventListener('click', closeMobileMenu);
        
        // Close menu when clicking on a nav link
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                setTimeout(closeMobileMenu, 300);
            });
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileMenuPanel.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }
}

// Wishlist Buttons
function initWishlistButtons() {
    const wishlistButtons = document.querySelectorAll('.wishlist-btn');
    
    wishlistButtons.forEach(button => {
        button.addEventListener('click', function() {
            const icon = this.querySelector('i');
            
            // Toggle heart icon
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                this.classList.add('active');
                showToast('Item added to wishlist');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                this.classList.remove('active');
                showToast('Item removed from wishlist');
            }
        });
    });
}

// Accordion
function initAccordion() {
    const accordionButtons = document.querySelectorAll('.accordion-button');
    
    accordionButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Close all other accordion items
            accordionButtons.forEach(otherButton => {
                if (otherButton !== this) {
                    otherButton.classList.add('collapsed');
                    const target = document.querySelector(otherButton.getAttribute('data-bs-target'));
                    if (target) {
                        target.classList.remove('show');
                    }
                }
            });
            
            // Toggle current accordion item
            this.classList.toggle('collapsed');
            const target = document.querySelector(this.getAttribute('data-bs-target'));
            if (target) {
                target.classList.toggle('show');
            }
        });
    });
}

// Back to Top Button
function initBackToTop() {
    const backToTopButton = document.querySelector('.back-to-top');
    
    if (backToTopButton) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('active');
            } else {
                backToTopButton.classList.remove('active');
            }
        });
        
        // Scroll to top when clicked
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Scroll Animations
function initScrollAnimations() {
    // Simple scroll animation implementation
    const animatedElements = document.querySelectorAll('[data-aos]');
    
    if (animatedElements.length > 0) {
        function checkScroll() {
            animatedElements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const elementVisible = 150;
                
                if (elementTop < window.innerHeight - elementVisible) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
            });
        }
        
        // Set initial state
        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });
        
        // Check on scroll and resize
        window.addEventListener('scroll', checkScroll);
        window.addEventListener('resize', checkScroll);
        
        // Initial check
        checkScroll();
    }
}

// Toast Notifications
function initToast() {
    // Toast initialization - the toast HTML is already in the document
    // This function just makes it available for use
    window.showToast = function(message) {
        const toastElement = document.getElementById('liveToast');
        const toastMessage = document.getElementById('toastMessage');
        
        if (toastElement && toastMessage) {
            toastMessage.textContent = message;
            
            // Show the toast
            const toast = new bootstrap.Toast(toastElement);
            toast.show();
        }
    };
}




// Bootstrap Toast Compatibility (if Bootstrap is not fully loaded)
if (typeof bootstrap === 'undefined') {
    // Simple toast implementation if Bootstrap is not available
    window.bootstrap = {
        Toast: class {
            constructor(element) {
                this.element = element;
            }
            
            show() {
                this.element.classList.add('show');
                
                // Auto hide after 3 seconds
                setTimeout(() => {
                    this.hide();
                }, 3000);
            }
            
            hide() {
                this.element.classList.remove('show');
            }
        }
    };
}

// Utility Functions
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Add smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#') {
                const target = document.querySelector(href);
                
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});

// Add loading state for buttons
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.href && !this.href.startsWith('javascript:')) {
                this.classList.add('loading');
                setTimeout(() => {
                    this.classList.remove('loading');
                }, 1000);
            }
        });
    });
});

// Image lazy loading enhancement
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
});

// Add this CSS for loading states (you can add to your CSS file)
const loadingStyles = `
    .btn.loading {
        position: relative;
        color: transparent !important;
    }
    
    .btn.loading::after {
        content: '';
        position: absolute;
        width: 20px;
        height: 20px;
        top: 50%;
        left: 50%;
        margin-left: -10px;
        margin-top: -10px;
        border: 2px solid #ffffff;
        border-radius: 50%;
        border-top-color: transparent;
        animation: spin 1s ease-in-out infinite;
    }
    
    .btn-gold.loading::after {
        border: 2px solid var(--dark-bg);
        border-top-color: transparent;
    }
`;

// Inject loading styles
const styleSheet = document.createElement('style');
styleSheet.textContent = loadingStyles;
document.head.appendChild(styleSheet);