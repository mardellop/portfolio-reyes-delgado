document.addEventListener('DOMContentLoaded', () => {
    // 1. Preloader ultra-seguro para móviles y PC
    const preloader = document.getElementById('preloader');
    const counterEl = document.getElementById('preloader-counter');

    function finalizarCarga() {
        if (preloader) {
            preloader.classList.add('loaded');
        }
        document.body.classList.remove('loading');
        document.querySelectorAll('.hero .reveal-up, .hero .reveal-text')
            .forEach(el => el.classList.add('active'));
    }

    if (preloader && counterEl) {
        let value = 0;
        const interval = setInterval(() => {
            value += 10;
            if (value > 100) value = 100;
            
            counterEl.textContent = value + '%';

            if (value === 100) {
                clearInterval(interval);
                setTimeout(finalizarCarga, 150);
            }
        }, 30);
    } else {
        finalizarCarga();
    }

    // 2. Menú móvil (Hamburguesa)
    const navToggle = document.querySelector('.nav-toggle');
    const navList = document.querySelector('.nav-list');

    if (navToggle && navList) {
        navToggle.addEventListener('click', () => {
            navList.classList.toggle('active');
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navList.classList.remove('active');
            });
        });
    }

    // 3. Animaciones al hacer scroll (Intersection Observer)
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

    document.querySelectorAll('section:not(.hero) .reveal-up, section:not(.hero) .reveal-text').forEach(el => {
        observer.observe(el);
    });

    // 4. Header al hacer scroll
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

    // 5. Ticker continuo
    const tickerMove = document.querySelector('.ticker-move');
    if (tickerMove) {
        const content = tickerMove.innerHTML;
        tickerMove.innerHTML = content + content;
    }
});
