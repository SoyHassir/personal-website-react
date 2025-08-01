import { useState, useEffect } from 'react';

export const usePreloader = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [preloaderElement, setPreloaderElement] = useState(null);

  useEffect(() => {
    // Crear elemento preloader si no existe
    let preloader = document.querySelector('.preloader');
    if (!preloader) {
      preloader = document.createElement('div');
      preloader.className = 'preloader';
      preloader.innerHTML = `
        <div class="preloader-container">
          <div class="preloader-logo">
            <img class="preloader-logo-image" src="./img/optimized-logo/logo-large.webp" alt="Hassir Lastre Logo" />
          </div>
          <div class="preloader-indicator" role="progressbar" aria-label="Cargando página" aria-live="polite">
            <div class="preloader-progress"></div>
          </div>
        </div>
      `;
      document.body.appendChild(preloader);
    }
    setPreloaderElement(preloader);

    // Determinar tiempo mínimo de visualización basado en dispositivo
    const isMobile = window.innerWidth <= 768;
    const isSlowConnection = navigator.connection && 
                           navigator.connection.effectiveType && 
                           (navigator.connection.effectiveType === 'slow-2g' || 
                            navigator.connection.effectiveType === '2g');
    
    let minShowTime = 1200; // Tiempo base aumentado para apreciar la animación
    if (isMobile) minShowTime = 2000; // Tiempo aumentado a 2 segundos en móvil
    if (isSlowConnection) minShowTime = 1500; // Más tiempo en conexiones lentas
    
    const startTime = performance.now();
    
    const handleLoad = () => {
      const loadTime = performance.now() - startTime;
      const remainingTime = Math.max(0, minShowTime - loadTime);
      
      setTimeout(() => {
        if (preloader) {
          preloader.classList.add('hidden');
          setTimeout(() => {
            setIsLoading(false);
            // Delay adicional antes de remover el preloader para permitir transición suave
            setTimeout(() => {
              preloader.remove();
            }, 500);
          }, 600); // Transición de salida más rápida para sincronizar mejor
        }
      }, remainingTime);
    };

    // Si la página ya está cargada, ejecutar inmediatamente
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  return {
    isLoading,
    preloaderElement
  };
}; 