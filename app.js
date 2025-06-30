// Application data
const streetFoodData = [
    {
        title: "Top 5 Street Foods in Bangkok", 
        description: "Explore sizzling flavors and unforgettable bites",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400",
        location: "Thailand",
        foods: ["Pad Thai", "Som Tam", "Mango Sticky Rice", "Thai Fish Cakes", "Coconut Ice Cream"]
    },
    {
        title: "Volcano Trek and Tacos", 
        description: "Climb fire and feast on fiery food",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
        location: "Mexico", 
        foods: ["Street Tacos", "Elote", "Churros", "Quesadillas", "Tamales"]
    },
    {
        title: "Spice Trail Through Lava Lands", 
        description: "A journey through volcanic lands and spicy cuisines",
        image: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=400",
        location: "Indonesia",
        foods: ["Nasi Gudeg", "Rendang", "Sate", "Gado-gado", "Bakso"]
    }
];

// DOM Elements
let navToggle, navMenu, navClose, navLinks, contactForm, subscribeForm;

// Session storage for form data persistence
let formData = {
    contact: {},
    subscribe: {}
};

// Initialize application
window.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    initializeDOMElements();
    initializeNavigation();
    initializeScrollAnimations();
    initializeForms();
    initializeScrollToTop();
    initializeCardInteractions();
});

// Initialize DOM elements
function initializeDOMElements() {
    navToggle = document.getElementById('nav-toggle');
    navMenu = document.getElementById('nav-menu');
    navClose = document.getElementById('nav-close');
    navLinks = document.querySelectorAll('.nav__link');
    contactForm = document.getElementById('contact-form');
    subscribeForm = document.getElementById('subscribe-form');
    
    console.log('DOM Elements initialized:', {
        navToggle: !!navToggle,
        navMenu: !!navMenu,
        navClose: !!navClose,
        navLinks: navLinks.length,
        contactForm: !!contactForm,
        subscribeForm: !!subscribeForm
    });
}

// Navigation functionality
function initializeNavigation() {
    console.log('Initializing navigation...');
    
    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            console.log('Nav toggle clicked');
            navMenu.classList.add('show-menu');
        });
    }

    if (navClose) {
        navClose.addEventListener('click', () => {
            console.log('Nav close clicked');
            navMenu.classList.remove('show-menu');
        });
    }

    // Close menu when clicking on nav link
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            console.log('Nav link clicked:', link.getAttribute('href'));
            navMenu.classList.remove('show-menu');
            handleNavClick(e, link);
        });
    });

    // Header background on scroll
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (header) {
            if (window.scrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.15)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            }
        }
    });
}

// Handle navigation click
function handleNavClick(e, link) {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    console.log('Navigating to:', targetId);
    
    if (targetId && targetId.startsWith('#')) {
        scrollToSection(targetId.substring(1));
    }
}

// Scroll to section utility
function scrollToSection(sectionId) {
    console.log('Scrolling to section:', sectionId);
    const section = document.getElementById(sectionId);
    if (section) {
        const header = document.querySelector('.header');
        const headerHeight = header ? header.offsetHeight : 70;
        const targetPosition = section.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        console.log('Scrolled to:', sectionId);
    } else {
        console.warn('Section not found:', sectionId);
    }
}

// Scroll animations
function initializeScrollAnimations() {
    console.log('Initializing scroll animations...');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                console.log('Element became visible:', entry.target.className);
            }
        });
    }, observerOptions);

    // Observe all elements with fade-in class
    const fadeElements = document.querySelectorAll('.fade-in');
    console.log('Found fade-in elements:', fadeElements.length);
    fadeElements.forEach(el => {
        observer.observe(el);
    });
}

// Form initialization and handling
function initializeForms() {
    console.log('Initializing forms...');
    
    // Contact form
    if (contactForm) {
        console.log('Contact form found, initializing...');
        // Add input event listeners for real-time validation
        const contactInputs = contactForm.querySelectorAll('input, textarea');
        contactInputs.forEach(input => {
            input.addEventListener('input', () => {
                validateField(input);
                // Store form data in session
                formData.contact[input.name] = input.value;
            });

            input.addEventListener('blur', () => {
                validateField(input);
            });
        });

        contactForm.addEventListener('submit', handleContactSubmit);
    } else {
        console.warn('Contact form not found');
    }

    // Subscribe form
    if (subscribeForm) {
        console.log('Subscribe form found, initializing...');
        const subscribeInput = subscribeForm.querySelector('input[type="email"]');
        if (subscribeInput) {
            subscribeInput.addEventListener('input', () => {
                validateField(subscribeInput);
                formData.subscribe.email = subscribeInput.value;
            });

            subscribeInput.addEventListener('blur', () => {
                validateField(subscribeInput);
            });
        }

        subscribeForm.addEventListener('submit', handleSubscribeSubmit);
    } else {
        console.warn('Subscribe form not found');
    }
}

// Field validation
function validateField(field) {
    const fieldName = field.name || field.id;
    const errorElement = document.getElementById(`${fieldName}-error`) || document.getElementById(`${field.id}-error`);
    let isValid = true;
    let errorMessage = '';

    // Clear previous errors
    if (errorElement) {
        errorElement.textContent = '';
    }
    field.classList.remove('error');

    // Required field validation
    if (field.hasAttribute('required') && !field.value.trim()) {
        isValid = false;
        errorMessage = `${getFieldLabel(field)} is required`;
    }

    // Email validation
    if (field.type === 'email' && field.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value.trim())) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }

    // Phone validation (if provided)
    if (field.type === 'tel' && field.value.trim()) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(field.value.replace(/[\s\-\(\)]/g, ''))) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }

    // Name validation
    if (field.name === 'name' && field.value.trim()) {
        if (field.value.trim().length < 2) {
            isValid = false;
            errorMessage = 'Name must be at least 2 characters long';
        }
    }

    // Message validation
    if (field.name === 'message' && field.value.trim()) {
        if (field.value.trim().length < 10) {
            isValid = false;
            errorMessage = 'Message must be at least 10 characters long';
        }
    }

    if (!isValid) {
        if (errorElement) {
            errorElement.textContent = errorMessage;
        }
        field.classList.add('error');
    }

    return isValid;
}

// Get field label for error messages
function getFieldLabel(field) {
    const placeholder = field.placeholder;
    if (placeholder) {
        return placeholder.replace('Your ', '').replace('Enter your ', '');
    }
    return field.name.charAt(0).toUpperCase() + field.name.slice(1);
}

// Contact form submission
async function handleContactSubmit(e) {
    e.preventDefault();
    console.log('Contact form submitted');
    
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    const successMessage = document.getElementById('form-success');
    
    // Validate all fields
    const inputs = contactForm.querySelectorAll('input, textarea');
    let isFormValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });

    if (!isFormValid) {
        showFormError('Please correct the errors above');
        return;
    }

    // Show loading state
    submitBtn.disabled = true;
    if (btnText) btnText.classList.add('hidden');
    if (btnLoader) btnLoader.classList.remove('hidden');

    try {
        // Simulate API call
        await simulateApiCall();
        
        // Show success message
        if (successMessage) {
            successMessage.classList.remove('hidden');
        }
        contactForm.reset();
        
        // Clear form data
        formData.contact = {};
        
        console.log('Contact form submitted successfully');
        
        // Reset button state
        setTimeout(() => {
            submitBtn.disabled = false;
            if (btnText) btnText.classList.remove('hidden');
            if (btnLoader) btnLoader.classList.add('hidden');
            if (successMessage) successMessage.classList.add('hidden');
        }, 3000);

    } catch (error) {
        console.error('Contact form submission failed:', error);
        showFormError('Failed to send message. Please try again.');
        submitBtn.disabled = false;
        if (btnText) btnText.classList.remove('hidden');
        if (btnLoader) btnLoader.classList.add('hidden');
    }
}

// Subscribe form submission
async function handleSubscribeSubmit(e) {
    e.preventDefault();
    console.log('Subscribe form submitted');
    
    const emailInput = subscribeForm.querySelector('input[type="email"]');
    const submitBtn = subscribeForm.querySelector('button[type="submit"]');
    const successMessage = document.getElementById('subscribe-success');
    const errorElement = document.getElementById('subscribe-error');
    
    // Validate email
    if (!validateField(emailInput)) {
        return;
    }

    // Show loading state
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Subscribing...';

    try {
        // Simulate API call
        await simulateApiCall();
        
        // Show success message
        if (successMessage) {
            successMessage.classList.remove('hidden');
        }
        subscribeForm.reset();
        
        // Clear form data
        formData.subscribe = {};
        
        console.log('Subscribe form submitted successfully');
        
        // Reset button state
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            if (successMessage) successMessage.classList.add('hidden');
        }, 3000);

    } catch (error) {
        console.error('Subscribe form submission failed:', error);
        if (errorElement) {
            errorElement.textContent = 'Failed to subscribe. Please try again.';
        }
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

// Simulate API call
function simulateApiCall() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate 90% success rate
            if (Math.random() > 0.1) {
                resolve();
            } else {
                reject(new Error('API Error'));
            }
        }, 1500);
    });
}

// Show form error
function showFormError(message) {
    // Create temporary error display
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error-message';
    errorDiv.style.cssText = `
        background: rgba(255, 84, 89, 0.1);
        border: 1px solid #ff5459;
        color: #ff5459;
        padding: 12px 16px;
        border-radius: 8px;
        margin-top: 16px;
        text-align: center;
    `;
    errorDiv.textContent = message;
    
    // Insert after form
    if (contactForm && contactForm.parentNode) {
        contactForm.parentNode.insertBefore(errorDiv, contactForm.nextSibling);
    }
    
    // Remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
        }
    }, 5000);
}

// Scroll to top functionality
function initializeScrollToTop() {
    console.log('Initializing scroll to top...');
    
    // Create scroll to top button
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: #FF6B35;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(scrollTopBtn);
    
    // Show/hide scroll to top button
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollTopBtn.style.opacity = '1';
            scrollTopBtn.style.visibility = 'visible';
        } else {
            scrollTopBtn.style.opacity = '0';
            scrollTopBtn.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top on click
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Enhanced card interactions
function initializeCardInteractions() {
    console.log('Initializing card interactions...');
    
    // Adventure cards interaction
    const adventureCards = document.querySelectorAll('.adventure-card');
    console.log('Adventure cards found:', adventureCards.length);
    
    adventureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Dish cards interaction
    const dishCards = document.querySelectorAll('.dish-card');
    console.log('Dish cards found:', dishCards.length);
    
    dishCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) rotate(1deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotate(0deg)';
        });
    });
}

// Hero button functionality - make sure Subscribe Now button works
window.addEventListener('DOMContentLoaded', function() {
    const heroBtn = document.querySelector('.hero__btn');
    if (heroBtn) {
        console.log('Hero button found, adding click handler');
        heroBtn.addEventListener('click', function() {
            console.log('Hero Subscribe Now button clicked');
            scrollToSection('subscribe');
        });
    } else {
        console.warn('Hero button not found');
    }
});

// Enhanced form interactions
window.addEventListener('DOMContentLoaded', function() {
    // Add floating label effect
    const formControls = document.querySelectorAll('.form-control');
    formControls.forEach(control => {
        control.addEventListener('focus', function() {
            this.style.transform = 'scale(1.02)';
            this.style.borderWidth = '2px';
        });
        
        control.addEventListener('blur', function() {
            this.style.transform = 'scale(1)';
            this.style.borderWidth = '1px';
        });
    });
    
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn, .hero__btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.remove();
                }
            }, 600);
        });
    });
});

// Add CSS for ripple and error effects
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    .form-control.error {
        border-color: #ff5459 !important;
        background: rgba(255, 84, 89, 0.1) !important;
    }
    
    .form-error {
        color: #ff5459;
        font-size: 12px;
        margin-top: 4px;
        display: block;
    }
    
    .scroll-top-btn:hover {
        background: #E55A2B !important;
        transform: translateY(-2px);
    }
    
    @media (max-width: 768px) {
        .scroll-top-btn {
            bottom: 20px !important;
            right: 20px !important;
            width: 45px !important;
            height: 45px !important;
        }
    }
`;
document.head.appendChild(style);

// Initialize intersection observer for performance
window.addEventListener('DOMContentLoaded', function() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window && lazyImages.length > 0) {
        console.log('Initializing lazy loading for', lazyImages.length, 'images');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
});

// Debug function to check if all sections are present
window.addEventListener('DOMContentLoaded', function() {
    const sections = ['home', 'travel', 'food', 'subscribe'];
    console.log('Section check:');
    sections.forEach(id => {
        const section = document.getElementById(id);
        console.log(`${id}:`, section ? 'Found' : 'Missing');
    });
});

// Global function to handle hero button clicks (backup)
window.scrollToSection = scrollToSection;