document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinksContainer = document.querySelector('.nav-links');
    const closeMenu = document.querySelector('.close-menu');

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Close mobile menu if open
                if (navLinksContainer.classList.contains('active')) {
                    navLinksContainer.classList.remove('active');
                }

                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Download CV button handler
    const downloadBtn = document.getElementById('download-cv-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const url = downloadBtn.getAttribute('href');
            const filename = "Rida_Al_Hajj_Ali_CV.pdf";

            fetch(url)
                .then(response => response.blob())
                .then(blob => {
                    const blobUrl = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.style.display = 'none';
                    link.href = blobUrl;
                    link.download = filename;
                    document.body.appendChild(link);
                    link.click();
                    window.URL.revokeObjectURL(blobUrl);
                    document.body.removeChild(link);
                })
                .catch(err => {
                    console.error("Download failed, opening in new tab", err);
                    window.open(url, '_blank');
                });
        });
    }

    // Active link highlighting on scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // Mobile Menu Toggle - Open
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinksContainer.classList.add('active');
        });
    }

    // Mobile Menu Toggle - Close
    if (closeMenu) {
        closeMenu.addEventListener('click', () => {
            navLinksContainer.classList.remove('active');
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinksContainer.classList.contains('active') &&
            !navLinksContainer.contains(e.target) &&
            !hamburger.contains(e.target)) {
            navLinksContainer.classList.remove('active');
        }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinksContainer.classList.contains('active')) {
            navLinksContainer.classList.remove('active');
            hamburger.focus();
        }
    });
});

// Contact form handler
document.getElementById('contactForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const button = this.querySelector('button[type="submit"]');
    button.textContent = 'Sending...';
    button.disabled = true;

    try {
        const response = await fetch(this.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            alert('Message sent successfully!');
            this.reset();
        } else {
            alert('Oops! There was a problem sending your message.');
        }
    } catch (error) {
        alert('Oops! There was a problem sending your message.');
    } finally {
        button.textContent = 'Send Message';
        button.disabled = false;
    }
});

// ===================================
// SCROLL REVEAL ANIMATIONS
// ===================================

/**
 * Initializes scroll-triggered reveal animations using IntersectionObserver API
 * - Observes elements with reveal classes
 * - Toggles 'visible' class when element enters/exits viewport
 * - Animations re-trigger on every scroll (repeatable animations)
 * - Respects prefers-reduced-motion setting
 */
(function initScrollReveal() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // If user prefers reduced motion, don't initialize animations
    if (prefersReducedMotion) {
        // Make all reveal elements immediately visible
        document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
            el.classList.add('visible');
        });
        return;
    }

    // Configure IntersectionObserver options
    const observerOptions = {
        root: null, // Use viewport as root
        rootMargin: '0px 0px -100px 0px', // Trigger 100px before element enters viewport
        threshold: 0.15 // Trigger when 15% of element is visible
    };

    // Create the IntersectionObserver
    // Fix: Removed unobserve() to enable repeatable animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Toggle visible class based on intersection state
            // Fix: When intersecting (entering viewport) -> add 'visible'
            // When not intersecting (leaving viewport) -> remove 'visible'
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                // Remove visible class when element leaves viewport
                // This allows animation to re-trigger when scrolling back
                entry.target.classList.remove('visible');
            }
        });
    }, observerOptions);

    // Select all elements with reveal classes
    const revealElements = document.querySelectorAll(
        '.reveal, .reveal-left, .reveal-right, .reveal-scale'
    );

    // Observe each reveal element
    revealElements.forEach(element => {
        observer.observe(element);
    });

    // Expose observer for potential dynamic content additions
    window.revealObserver = observer;
})();