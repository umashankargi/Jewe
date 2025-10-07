// Preloader
window.addEventListener('load', function() {
    document.querySelector('.preloader').style.opacity = '0';
    setTimeout(function() {
        document.querySelector('.preloader').style.display = 'none';
    }, 500);
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
        document.querySelector('.navbar').classList.add('scrolled');
    } else {
        document.querySelector('.navbar').classList.remove('scrolled');
    }
});

// Hero Slider
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    slides[index].classList.add('active');
    currentSlide = index;
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(currentSlide);
}

// Initialize slider controls if they exist
const nextBtn = document.querySelector('.next-slide');
const prevBtn = document.querySelector('.prev-slide');

if (nextBtn) {
    nextBtn.addEventListener('click', nextSlide);
}

if (prevBtn) {
    prevBtn.addEventListener('click', prevSlide);
}

// Auto slide change every 5 seconds
let slideInterval = setInterval(nextSlide, 5000);

// Pause on hover
const slider = document.querySelector('.hero-slider');
if (slider) {
    slider.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    slider.addEventListener('mouseleave', () => {
        slideInterval = setInterval(nextSlide, 5000);
    });
}

// Initialize first slide
showSlide(0);

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});
// Add click event for WhatsApp CTA buttons
document.querySelectorAll('.highlight-whatsapp a, .whatsapp-float').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        window.open('https://wa.me/919912438836', '_blank');
    });
});

// Add click event for WhatsApp community buttons
document.querySelectorAll('.highlight-community a, .whatsapp-community-float, .whatsapp-community-alert').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        window.open('https://chat.whatsapp.com/HGePso072MEFnRHfrGXA16', '_blank');
    });
});

// Add click event for map link
document.querySelectorAll('.map-link, .highlight-link').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        window.open('https://maps.app.goo.gl/Zq5KPthJUn6sJwXc6', '_blank');
    });
});