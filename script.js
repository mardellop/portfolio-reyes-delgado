document.addEventListener('DOMContentLoaded', () => {
    // 1. Preloader — eased counter
    const preloader = document.getElementById('preloader');
    const counterEl = document.getElementById('preloader-counter');

    function easeOutExpo(x) {
        return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
    }

    const startTime = performance.now();
    const duration  = 1800;

    function updateCounter(now) {
        const elapsed  = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const value    = Math.floor(easeOutExpo(progress) * 100);

        if (counterEl) counterEl.textContent = value + '%';

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            setTimeout(() => {
                preloader.classList.add('loaded');
                document.body.classList.remove('loading');
                setTimeout(() => {
                    document.querySelectorAll('.hero .reveal-up, .hero .reveal-text')
                        .forEach(el => el.classList.add('active'));
                }, 200);
            }, 300);
        }
    }

    requestAnimationFrame(updateCounter);


    // 2. Intersection Observer for Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Select all elements to animate (excluding hero elements, they animate on load)
    const revealElements = document.querySelectorAll('section:not(.hero) .reveal-up, section:not(.hero) .reveal-text');
    revealElements.forEach(el => {
        observer.observe(el);
    });

    // 3. Header styling on scroll
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 4. Duplicate ticker content for seamless loop
    const tickerMove = document.querySelector('.ticker-move');
    if(tickerMove) {
        const content = tickerMove.innerHTML;
        tickerMove.innerHTML = content + content;
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.nav-toggle');
    const navList = document.querySelector('.nav-list');

    if (navToggle && navList) {
        navToggle.addEventListener('click', () => {
            navList.classList.toggle('active');
        });

        // Opcional: cierra el menú automáticamente al hacer clic en una opción
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navList.classList.remove('active');
            });
        });
    }
});
