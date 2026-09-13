document.addEventListener('DOMContentLoaded', () => {
    // 1. Preloader con seguridad por si el elemento no existe
    const preloader = document.getElementById('preloader');
    const counterEl = document.getElementById('preloader-counter');

    if (preloader && counterEl) {
        function easeOutExpo(x) {
            return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
        }

        const startTime = performance.now();
        const duration = 1200; // Reducido ligeramente para mayor agilidad en móviles

        function updateCounter(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const value = Math.floor(easeOutExpo(progress) * 100);

            counterEl.textContent = value + '%';

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                setTimeout(() => {
                    preloader.classList.add('loaded');
                    document.body.classList.remove('loading');
                    document.querySelectorAll('.hero .reveal-up, .hero .reveal-text')
                        .forEach(el => el.classList.add('active'));
                }, 200);
            }
        }

        requestAnimationFrame(updateCounter);
    } else {
        // Si no hay preloader, desbloquea el body por seguridad
        document.body.classList.remove('loading');
        document.querySelectorAll('.hero .reveal-up, .hero .reveal-text')
            .forEach(el => el.classList.add('active'));
    }

    // 2. Control del Menú Hamburguesa en Móviles (¡Faltaba esto!)
    const navToggle = document.querySelector('.nav-toggle');
    const navList = document.querySelector('.nav-list');

    if (navToggle && navList) {
        navToggle.addEventListener('click', () => {
            navList.classList.toggle('active');
        });

        // Cierra el menú al hacer clic en cualquier enlace
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navList.classList.remove('active');
            });
        });
    }

    // 3. Intersection Observer para Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('section:not(.hero) .reveal-up, section:not(.hero) .reveal-text');
    revealElements.forEach(el => {
        observer.observe(el);
    });

    // 4. Header styling on scroll
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // 5. Duplicate ticker content for seamless loop
    const tickerMove = document.querySelector('.ticker-move');
    if (tickerMove) {
        const content = tickerMove.innerHTML;
        tickerMove.innerHTML = content + content;
    }
});
