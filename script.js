document.addEventListener('DOMContentLoaded', () => {
    // 1. Preloader robusto para móviles
    const preloader = document.getElementById('preloader');
    const counterEl = document.getElementById('preloader-counter');

    if (preloader && counterEl) {
        let value = 0;
        const interval = setInterval(() => {
            value += 5;
            if (value > 100) value = 100;
            
            counterEl.textContent = value + '%';

            if (value === 100) {
                clearInterval(interval);
                setTimeout(() => {
                    preloader.classList.add('loaded');
                    document.body.classList.remove('loading');
                    document.querySelectorAll('.hero .reveal-up, .hero .reveal-text')
                        .forEach(el => el.classList.add('active'));
                }, 100);
            }
        }, 40); // Incrementa el porcentaje fluidamente cada 40 milisegundos
    }


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
