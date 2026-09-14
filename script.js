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
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('section:not(.hero) .reveal-up, section:not(.hero) .reveal-text');
    revealElements.forEach(el => observer.observe(el));

    // 3. Header styling on scroll
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });

    // 4. Duplicate ticker content for seamless loop
    const tickerMove = document.querySelector('.ticker-move');
    if (tickerMove) {
        tickerMove.innerHTML += tickerMove.innerHTML;
    }
});

/* ============================================================
   CAROUSEL — SWIPEABLE STRIP (MULTIPLE DATASETS)
   ============================================================ */

const carruselesData = {
    pets: [
        { url: "post-1-petris-pets.jpg" },
        { url: "post-2-petris-pets.jpg" },
        { url: "reels-petris-pets.mp4" },
        { url: "post-3-petris-pets.jpg" },
        { url: "video-galguera.mp4" },
        { url: "post-4-petris-pets.jpg" }
    ],
    diansa: [
        { url: "post-1-cubiertas-diansa.png" },
        { url: "post-2-cubiertas-diansa.png" },
        { url: "reels-1-cubiertas-diansa.mp4" },
        { url: "post-3-cubiertas-diansa.png" },
        { url: "reels-2-cubiertas-diansa.mp4" }
    ]
};

let fotosActivas = [];
let indiceActual = 0;

const modal      = document.getElementById("miModal");
const captionEl  = document.getElementById("caption");
const counterEl2 = document.getElementById("carruselCounter");
const track      = document.getElementById("carruselTrack");

/* ── Build slides inside the track ── */
function construirCarrusel(idData) {
    track.innerHTML = ""; // Limpiar track anterior
    fotosActivas = carruselesData[idData] || [];
    
    fotosActivas.forEach((foto) => {
        const slide = document.createElement("div");
        slide.className = "carousel-slide";

        const esVideo = foto.url.endsWith('.mp4') || foto.url.endsWith('.webm');
        let elemento;

        if (esVideo) {
            elemento = document.createElement("video");
            elemento.src = foto.url;
            elemento.controls = true;     // Muestra controles de reproducción
            elemento.muted = true;        // Silenciado por defecto (evita bloqueos del navegador)
            elemento.playsInline = true;  // Vital para dispositivos móviles
            elemento.preload = "metadata";
        } else {
            elemento = document.createElement("img");
            elemento.src = foto.url;
            elemento.alt = foto.texto || "Imagen del carrusel";
            elemento.draggable = false;
        }

        slide.appendChild(elemento);
        track.appendChild(slide);
    });
}
/* ── Position helpers ── */
function offsetForIndex(idx) {
    return -(idx * 100); // % units
}

function setTrackPos(pct, animated) {
    track.style.transition = animated
        ? "transform 0.42s cubic-bezier(0.25, 1, 0.35, 1)"
        : "none";
    track.style.transform = `translateX(${pct}%)`;
}

/* ── Go to a specific slide ── */
function goToSlide(idx, animated = true) {
    if (fotosActivas.length === 0) return;
    
    indiceActual = ((idx % fotosActivas.length) + fotosActivas.length) % fotosActivas.length;
    setTrackPos(offsetForIndex(indiceActual), animated);
    
    // Update active class & manage videos playback
    Array.from(track.children).forEach((slide, i) => {
        const videoEl = slide.querySelector('video');

        if (i === indiceActual) {
            slide.classList.add("active");
            // Opcional: Reproducir automáticamente el video activo si lo deseas
            // if (videoEl) videoEl.play().catch(() => {});
        } else {
            slide.classList.remove("active");
            // Pausar y reiniciar el video si deja de estar visible
            if (videoEl) {
                videoEl.pause();
                videoEl.currentTime = 0;
            }
        }
    });

    updateCounter();
    updateCaption();
    updateDots();
}
/* ── Open / close modal ── */
function abrirModal(idData) {
    construirCarrusel(idData);
    modal.style.display = "block";
    goToSlide(0, false);
}

function cerrarModal() {
    modal.style.display = "none";
}

// Bind click events to all trigger images
document.querySelectorAll(".carrusel-trigger").forEach(img => {
    img.addEventListener("click", () => {
        const carouselId = img.getAttribute("data-carousel");
        abrirModal(carouselId);
    });
});

document.getElementsByClassName("cerrar")[0].onclick = cerrarModal;

window.onclick = function (e) {
    if (e.target === modal) cerrarModal();
};

/* ── Button navigation (called from HTML onclick) ── */
// Needs to be globally accessible if called inline from HTML
window.cambiarImagen = function(n) {
    goToSlide(indiceActual + n);
};

/* ── Keyboard ── */
document.addEventListener("keydown", (e) => {
    if (modal.style.display !== "block") return;
    if (e.key === "Escape")     cerrarModal();
    if (e.key === "ArrowLeft")  goToSlide(indiceActual - 1);
    if (e.key === "ArrowRight") goToSlide(indiceActual + 1);
});

/* ── Drag / Swipe ── */
const SWIPE_THRESHOLD = 8;   // px to start drag intent
const SNAP_THRESHOLD  = 18;  // % of container width to trigger slide change

let isDragging   = false;
let dragStartX   = 0;
let dragCurrentX = 0;
let baseOffset   = 0;

function pointerStart(clientX) {
    isDragging   = true;
    dragStartX   = clientX;
    dragCurrentX = clientX;
    baseOffset   = offsetForIndex(indiceActual);
    setTrackPos(baseOffset, false);
    track.style.cursor = "grabbing";
}

function pointerMove(clientX) {
    if (!isDragging) return;
    dragCurrentX = clientX;

    const containerW = track.parentElement.offsetWidth;
    const deltaPct   = ((clientX - dragStartX) / containerW) * 100;
    const raw        = baseOffset + deltaPct;
    const min        = offsetForIndex(fotosActivas.length - 1);
    const max        = 0;

    // Rubber-band resistance at the edges
    let clamped;
    if (raw > max)       clamped = max + (raw - max) * 0.22;
    else if (raw < min)  clamped = min + (raw - min) * 0.22;
    else                 clamped = raw;

    setTrackPos(clamped, false);
}

function pointerEnd() {
    if (!isDragging) return;
    isDragging = false;
    track.style.cursor = "grab";

    const containerW = track.parentElement.offsetWidth;
    const deltaPx    = dragCurrentX - dragStartX;
    const deltaPct   = (deltaPx / containerW) * 100;

    if (Math.abs(deltaPx) > SWIPE_THRESHOLD) {
        if      (deltaPct < -SNAP_THRESHOLD) goToSlide(indiceActual + 1);
        else if (deltaPct >  SNAP_THRESHOLD) goToSlide(indiceActual - 1);
        else                                  goToSlide(indiceActual);
    } else {
        goToSlide(indiceActual);
    }
}

// Touch
track.addEventListener("touchstart",  (e) => pointerStart(e.touches[0].clientX), { passive: true });
track.addEventListener("touchmove",   (e) => pointerMove(e.touches[0].clientX),  { passive: true });
track.addEventListener("touchend",    () => pointerEnd());
track.addEventListener("touchcancel", () => pointerEnd());

// Mouse
track.addEventListener("mousedown", (e) => { e.preventDefault(); pointerStart(e.clientX); });
window.addEventListener("mousemove", (e) => { if (isDragging) pointerMove(e.clientX); });
window.addEventListener("mouseup",   () => { if (isDragging) pointerEnd(); });
