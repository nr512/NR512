// Navigation functionality
class Navigation {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.hamburger = document.querySelector('.hamburger');
        this.mobileMenu = document.querySelector('.mobile-menu');
        this.mobileMenuContent = document.querySelector('.mobile-menu-content');
        this.navLinks = document.querySelector('.nav-links');
        this.lastScroll = 0;
        this.scrollThreshold = 100;
        
        this.init();
    }

    init() {
        // Clone navigation items for mobile menu
        this.cloneNavItems();
        
        // Event listeners
        this.hamburger.addEventListener('click', () => this.toggleMobileMenu());
        window.addEventListener('scroll', () => this.handleScroll());
        window.addEventListener('resize', () => this.handleResize());
        
        // Handle navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
        });

        // Add animation delays to mobile menu items
        document.querySelectorAll('.mobile-menu .nav-link').forEach((link, index) => {
            link.style.setProperty('--item-index', index);
        });

        // Handle dropdowns in mobile menu
        document.querySelectorAll('.mobile-menu .dropdown').forEach(dropdown => {
            const link = dropdown.querySelector('.nav-link');
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleDropdown(dropdown);
            });
        });
    }

    cloneNavItems() {
        const clone = this.navLinks.cloneNode(true);
        this.mobileMenuContent.appendChild(clone);
    }

    toggleMobileMenu() {
        this.hamburger.classList.toggle('active');
        this.mobileMenu.classList.toggle('active');
        document.body.style.overflow = this.mobileMenu.classList.contains('active') ? 'hidden' : '';
        
        // Reset all dropdowns when closing menu
        if (!this.mobileMenu.classList.contains('active')) {
            document.querySelectorAll('.mobile-menu .dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    }

    handleScroll() {
        const currentScroll = window.pageYOffset;
        
        // Scroll effects
        if (currentScroll <= 0) {
            this.navbar.classList.remove('scroll-up');
            return;
        }

        if (currentScroll > this.lastScroll && currentScroll > this.scrollThreshold) {
            // Scrolling down
            this.navbar.classList.remove('scroll-up');
            this.navbar.classList.add('scroll-down');
        } else if (currentScroll < this.lastScroll) {
            // Scrolling up
            this.navbar.classList.remove('scroll-down');
            this.navbar.classList.add('scroll-up');
        }

        this.lastScroll = currentScroll;
    }

    handleResize() {
        if (window.innerWidth > 768) {
            this.mobileMenu.classList.remove('active');
            this.hamburger.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    handleNavClick(e) {
        const link = e.currentTarget;
        
        // Remove active class from all links
        document.querySelectorAll('.nav-link').forEach(navLink => {
            navLink.classList.remove('active');
        });
        
        // Add active class to clicked link
        link.classList.add('active');

        // Close mobile menu if open
        if (window.innerWidth <= 768) {
            this.toggleMobileMenu();
        }
    }

    toggleDropdown(dropdown) {
        // Close all other dropdowns
        document.querySelectorAll('.mobile-menu .dropdown').forEach(otherDropdown => {
            if (otherDropdown !== dropdown) {
                otherDropdown.classList.remove('active');
            }
        });

        // Toggle current dropdown
        dropdown.classList.toggle('active');
    }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const navigation = new Navigation();
});

class ServicesShowcase {
    constructor() {
        this.cards = document.querySelectorAll('.service-card');
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupHoverEffects();
        this.setupParallaxEffect();
    }

    setupIntersectionObserver() {
        const options = {
            threshold: 0.2,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        this.cards.forEach(card => observer.observe(card));
    }

    setupHoverEffects() {
        this.cards.forEach(card => {
            const image = card.querySelector('.service-image');
            const info = card.querySelector('.service-info');

            card.addEventListener('mousemove', (e) => {
                this.handleHoverEffect(e, card, image);
            });

            card.addEventListener('mouseleave', () => {
                this.resetCardEffects(card, image);
            });

            // Explore button click handler
            const exploreBtn = card.querySelector('.explore-btn');
            exploreBtn.addEventListener('click', () => this.toggleDetails(card));
        });
    }

    handleHoverEffect(e, card, image) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Calculate rotation based on mouse position
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        // Apply transformations
        card.style.transform = `
            perspective(1000px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            scale3d(1.02, 1.02, 1.02)
        `;

        // Parallax effect for image
        image.style.transform = `
            translateX(${(x - centerX) / 10}px)
            translateY(${(y - centerY) / 10}px)
        `;
    }

    resetCardEffects(card, image) {
        card.style.transform = '';
        image.style.transform = '';
    }

    setupParallaxEffect() {
        window.addEventListener('scroll', () => {
            this.cards.forEach(card => {
                const scroll = window.scrollY;
                const cardTop = card.offsetTop;
                const cardHeight = card.offsetHeight;
                const windowHeight = window.innerHeight;

                if (scroll + windowHeight > cardTop && scroll < cardTop + cardHeight) {
                    const parallaxValue = (scroll + windowHeight - cardTop) / 20;
                    card.style.transform = `translateY(${parallaxValue}px)`;
                }
            });
        });
    }

    toggleDetails(card) {
        const content = card.querySelector('.service-content');
        const details = card.querySelector('.service-details');

        if (details.style.display === 'block') {
            card.style.transform = 'rotateY(0deg)';
            setTimeout(() => {
                details.style.display = 'none';
                content.style.display = 'block';
            }, 300);
        } else {
            card.style.transform = 'rotateY(180deg)';
            setTimeout(() => {
                content.style.display = 'none';
                details.style.display = 'block';
            }, 300);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const servicesShowcase = new ServicesShowcase();
});
 // Loading Screen Animation
        window.addEventListener('load', () => {
            setTimeout(() => {
                const loadingScreen = document.querySelector('.loading-screen');
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, 2000);
        });
