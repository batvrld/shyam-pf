document.addEventListener('DOMContentLoaded', () => {
            const heroBg = document.getElementById('hero-bg');
            const sections = document.querySelectorAll('.section, .hero-section');
            const navLinks = document.querySelectorAll('.navigation-link');
            const navElements = []; // Store section data: { id: 'about', top: 100, bottom: 500 }

            // 1. Calculate section positions
            function calculateSectionPositions() {
                navElements.length = 0; // Clear array
                sections.forEach(section => {
                    if (section.id && section.id !== 'top') {
                        const rect = section.getBoundingClientRect();
                        const top = rect.top + window.scrollY;
                        const bottom = rect.bottom + window.scrollY;
                        navElements.push({ id: section.id, top: top, bottom: bottom });
                    }
                });
            }

            // 2. Hero Image Parallax/Scale Effect on Scroll
            function updateHeroParallax() {
                if (heroBg) {
                    const scrollY = window.scrollY;
                    const scaleFactor = 1.1 - (scrollY / 5000); 
                    heroBg.style.transform = `scale(${Math.max(1.0, scaleFactor)})`;
                }
            }

            // 3. Scrollspy - Highlight current section in fixed nav
            function updateScrollspy() {
                const scrollPosition = window.scrollY + 100;
                
                navLinks.forEach(link => link.classList.remove('active'));

                for (let i = 0; i < navElements.length; i++) {
                    const section = navElements[i];
                    if (scrollPosition >= section.top && scrollPosition < section.bottom) {
                        document.querySelector(`.navigation-link[data-section="${section.id}"]`).classList.add('active');
                        break;
                    }
                }
            }

            // 4. Combined Scroll Handler
            function handleScroll() {
                updateHeroParallax();
                updateScrollspy();
            }

            // 5. Siema Slider Initialization (Requires siema.min.js to be loaded)
            function initSiemaSliders() {
                // Check if the Siema constructor is available (i.e., if siema.min.js loaded)
                if (typeof Siema !== 'undefined') {
                    const sliderGroups = document.querySelectorAll('.slider-group');

                    sliderGroups.forEach(group => {
                        const sliderElement = group.querySelector('.siema');
                        const sliderId = sliderElement.getAttribute('data-slider');
                        const prevButton = group.querySelector('.prev');
                        const nextButton = group.querySelector('.next');

                        // Create Siema instance
                        const siemaInstance = new Siema({
                            selector: `[data-slider="${sliderId}"]`,
                            duration: 200,
                            easing: 'ease-out',
                            perPage: 1,
                            loop: true,
                        });

                        // Attach event listeners
                        if (prevButton) {
                             prevButton.addEventListener('click', () => siemaInstance.prev());
                        }
                        if (nextButton) {
                             nextButton.addEventListener('click', () => siemaInstance.next());
                        }
                    });
                } else {
                    console.warn("Siema library not loaded. Image sliders will not function.");
                }
            }


            // Initialization
            window.addEventListener('scroll', handleScroll);
            window.addEventListener('resize', () => {
                calculateSectionPositions();
                handleScroll();
            });
            
            // Wait a moment for layout to settle before calculating positions
            setTimeout(() => {
                calculateSectionPositions();
                handleScroll(); 
                initSiemaSliders(); // Initialize sliders after DOM is ready
            }, 100); 
            
            // 6. Initial Fade-in/Slide-up Animation
            // NOTE: We exclude the slider images and text from this animation, 
            // as they will be handled by the Siema carousel itself.
            const animatedElements = document.querySelectorAll('h1, h2:not(.slider-heading), p:not(.slider-heading + p), .caption-tag, .expertise-item, .about-image');
            
            const observerOptions = {
                root: null,
                rootMargin: '0px',
                threshold: 0.1
            };

            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.transition = 'opacity 1s ease-out, transform 0.8s ease-out';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            animatedElements.forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(50px)';
                observer.observe(el);
            });
        });
        // Enhanced Scroll Reveal Animation
const revealProjects = () => {
    const projectItems = document.querySelectorAll('.project-item');
    
    const observerOptions = {
        threshold: 0.2, // Trigger when 20% of the item is visible
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add a small delay based on index if multiple appear at once
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, 100); 
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    projectItems.forEach(item => {
        observer.observe(item);
    });
};

// Call this inside your DOMContentLoaded listener
document.addEventListener('DOMContentLoaded', () => {
    // ... your existing code ...
    revealProjects();
});