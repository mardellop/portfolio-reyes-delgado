document.addEventListener('DOMContentLoaded', () => {
    // 1. Ocultar preloader inmediatamente de forma segura
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 400);
    }
    document.body.classList.remove('loading');

    // 2. Activar animaciones del hero
    document.querySelectorAll('.hero .reveal-up, .hero .reveal-text')
        .forEach(el => el.classList.add('active'));

    // 3. Menú móvil (Hamburguesa)
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

    // 4. Scroll header
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
});
