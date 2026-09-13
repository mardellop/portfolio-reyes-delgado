document.addEventListener("DOMContentLoaded", () => {
    const counterElement = document.getElementById("preloader-counter");
    const preloader = document.getElementById("preloader");
    
    let progress = 0;
    
    // Intervalo para simular la carga (puedes ajustarlo según tus necesidades)
    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 10) + 1;
        
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            // Ocultar preloader cuando llega al 100%
            setTimeout(() => {
                preloader.classList.add("loaded");
            }, 300);
        }
        
        counterElement.textContent = `${progress}%`;
    }, 40);
});
