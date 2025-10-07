let currentProductIndex = 0;
let filteredProducts = [];

document.addEventListener('DOMContentLoaded', function() {
    initPageLoader();
    initCurrentTime();
    initNavbarToggler();
    initWishlistButtons();
    initBackToTop();
    initScrollAnimations();
    initToast();
    initMobileMenu();
    initGoldPrice();
    initWeightFilter();
    initImagePreview();
    renderProducts();
});

function initPageLoader() {
    const pageLoader = document.querySelector('.page-loader');
    if (pageLoader) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                pageLoader.classList.add('fade-out');
                setTimeout(function() {
                    pageLoader.style.display = 'none';
                }, 500);
            }, 1000);
        });
    }
}

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
        updateTime();
        setInterval(updateTime, 60000);
    }
}

function initNavbarToggler() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', function() {
            this.classList.toggle('collapsed');
            navbarCollapse.classList.toggle('show');
        });
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

function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileMenuPanel = document.querySelector('.mobile-menu-panel');
    if (mobileMenuBtn && mobileMenuOverlay && mobileMenuPanel) {
        mobileMenuBtn.addEventListener('click', function() {
            this.classList.add('active');
            mobileMenuOverlay.classList.add('active');
            mobileMenuPanel.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        function closeMobileMenu() {
            mobileMenuBtn.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
            mobileMenuPanel.classList.remove('active');
            document.body.style.overflow = '';
        }
        mobileMenuClose.addEventListener('click', closeMobileMenu);
        mobileMenuOverlay.addEventListener('click', closeMobileMenu);
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                setTimeout(closeMobileMenu, 300);
            });
        });
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileMenuPanel.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }
}

function initWishlistButtons() {
    const wishlistButtons = document.querySelectorAll('.wishlist-btn');
    wishlistButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const icon = this.querySelector('i');
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

function initBackToTop() {
    const backToTopButton = document.querySelector('.back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('active');
            } else {
                backToTopButton.classList.remove('active');
            }
        });
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

function initScrollAnimations() {
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
        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });
        window.addEventListener('scroll', checkScroll);
        window.addEventListener('resize', checkScroll);
        checkScroll();
    }
}

function initToast() {
    window.showToast = function(message) {
        const toastElement = document.getElementById('liveToast');
        const toastMessage = document.getElementById('toastMessage');
        if (toastElement && toastMessage) {
            toastMessage.textContent = message;
            const toast = new bootstrap.Toast(toastElement);
            toast.show();
        }
    };
}

function initGoldPrice() {
    console.log('Gold price functionality initialized');
}

function initWeightFilter() {
    const weightBtns = document.querySelectorAll('.weight-filter-btn:not(.reset-filter)');
    const resetBtn = document.querySelector('.reset-filter');
    if (weightBtns.length && resetBtn) {
        weightBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                weightBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                const minWeight = parseFloat(this.dataset.min) || 0;
                const maxWeight = parseFloat(this.dataset.max) || 999;
                renderProducts(minWeight, maxWeight);
            });
        });
        resetBtn.addEventListener('click', function() {
            weightBtns.forEach(b => b.classList.remove('active'));
            if (weightBtns.length > 0) {
                weightBtns[0].classList.add('active');
            }
            renderProducts();
        });
    }
}

function initImagePreview() {
    const previewModal = document.getElementById('imagePreviewModal');
    const previewImage = document.getElementById('previewImage');
    const closePreview = document.getElementById('closePreview');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const shareBtn = document.getElementById('shareBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    if (!previewModal || !previewImage) return;

    window.openPreview = function(imgSrc, productIndex) {
        try {
            currentProductIndex = productIndex;
            previewImage.src = imgSrc;
            previewModal.classList.add('show');
            document.body.style.overflow = 'hidden';
            updateNavButtons();
        } catch (error) {
            console.error('Error opening preview:', error);
        }
    };

    function closePreviewModal() {
        previewModal.classList.remove('show');
        document.body.style.overflow = '';
    }

    function showPreviousImage() {
        if (currentProductIndex > 0) {
            currentProductIndex--;
            previewImage.src = filteredProducts[currentProductIndex].img;
            updateNavButtons();
        }
    }

    function showNextImage() {
        if (currentProductIndex < filteredProducts.length - 1) {
            currentProductIndex++;
            previewImage.src = filteredProducts[currentProductIndex].img;
            updateNavButtons();
        }
    }

    function updateNavButtons() {
        if (prevBtn) {
            prevBtn.style.display = currentProductIndex > 0 ? 'flex' : 'none';
        }
        if (nextBtn) {
            nextBtn.style.display = currentProductIndex < filteredProducts.length - 1 ? 'flex' : 'none';
        }
    }

    function shareImage() {
        const imageUrl = previewImage.src;
        const productWeight = filteredProducts[currentProductIndex]?.weight || 'Gold Ornament';
        if (navigator.share) {
            navigator.share({
                title: `Gold Ornament - ${productWeight}g`,
                text: `Check out this beautiful ${productWeight}g gold ornament from Eshwar Jewelry`,
                url: imageUrl,
            })
            .then(() => showToast('Image shared successfully'))
            .catch((error) => {
                console.log('Error sharing:', error);
                copyImageUrl();
            });
        } else {
            copyImageUrl();
        }
    }

    function copyImageUrl() {
        const imageUrl = previewImage.src;
        navigator.clipboard.writeText(imageUrl)
            .then(() => showToast('Image URL copied to clipboard'))
            .catch(() => showToast('Failed to copy image URL'));
    }

    function downloadImage() {
        const imageUrl = previewImage.src;
        const productWeight = filteredProducts[currentProductIndex]?.weight || 'gold-necklace';
        const fileName = `eshwar-jewelry-${productWeight}g-necklace.jpg`;
        fetch(imageUrl)
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                showToast('Image download started');
            })
            .catch(() => showToast('Failed to download image'));
    }

    closePreview.addEventListener('click', closePreviewModal);
    prevBtn.addEventListener('click', showPreviousImage);
    nextBtn.addEventListener('click', showNextImage);
    shareBtn.addEventListener('click', shareImage);
    downloadBtn.addEventListener('click', downloadImage);

    previewModal.addEventListener('click', function(e) {
        if (e.target === previewModal) {
            closePreviewModal();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (previewModal.classList.contains('show')) {
            switch(e.key) {
                case 'Escape':
                    closePreviewModal();
                    break;
                case 'ArrowLeft':
                    showPreviousImage();
                    break;
                case 'ArrowRight':
                    showNextImage();
                    break;
            }
        }
    });

    let touchStartX = 0;
    let touchEndX = 0;

    previewModal.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });

    previewModal.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                showNextImage();
            } else {
                showPreviousImage();
            }
        }
    }
}

function renderProducts(minWeight = 0, maxWeight = 999) {
    const container = document.getElementById('necklace-gallery');
    if (!container) return;

    try {
        filteredProducts = products.filter(p => p.weight >= minWeight && p.weight <= maxWeight);

        if (filteredProducts.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fas fa-search fa-3x mb-3 text-muted"></i>
                    <h4>No necklaces found in this weight range</h4>
                    <p>Please try a different weight filter</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filteredProducts.map((product, index) => `
            <div class="col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="${(index % 3) * 100}">
                <div class="product-card" onclick="openPreview('${product.img}', ${index})">
                    <div class="product-img-container">
                        <img src="${product.img}" alt="Gold Ornament ${product.id}" class="product-img" loading="lazy">
                        <span class="product-badge">${product.weight}g</span>
                        <button class="wishlist-btn" aria-label="Add to Wishlist">
                            <i class="far fa-heart"></i>
                        </button>
                    </div>
                    <div class="product-body">
                        <h3 class="product-title">Gold Ornament ${product.id}</h3>
                        <p class="text-muted">Exquisite ${product.weight} gram gold ornament crafted with precision and elegance.</p>
                        <div class="product-actions">
                            <a href="https://wa.me/919912438836?text=Hi, I'm interested in Gold Ornament ${product.id} (${product.weight}g). Could you please provide more details?" 
                               class="btn btn-outline-primary" 
                               target="_blank" 
                               onclick="event.stopPropagation(); showToast('Opening WhatsApp for inquiry')">
                                <i class="fas fa-info-circle me-2"></i>Inquire
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `).join("\n");

        initWishlistButtons();

        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    } catch (error) {
        console.error('Error rendering products:', error);
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-exclamation-triangle fa-3x mb-3 text-danger"></i>
                <h4>Error loading necklaces</h4>
                <p>Please try again later</p>
            </div>
        `;
    }
}

if (typeof bootstrap === 'undefined') {
    window.bootstrap = {
        Toast: class {
            constructor(element) {
                this.element = element;
            }
            show() {
                this.element.classList.add('show');
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

const styleSheet = document.createElement('style');
styleSheet.textContent = loadingStyles;
document.head.appendChild(styleSheet);