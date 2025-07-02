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
          <div class="preloader-indicator">
            <div class="preloader-progress"></div>
          </div>
        </div>
      `;
      document.body.appendChild(preloader);
    }
    setPreloaderElement(preloader);

    // Determinar tiempo mínimo de visualización basado en dispositivo
    const isMobile = window.innerWidth <= 768;
    const isSlowConnection = navigator.connection && navigator.connection.effectiveType === 'slow-2g';
    
    let minShowTime = 300; // Tiempo base reducido
    if (isMobile) minShowTime = 400; // Menos tiempo en móvil
    if (isSlowConnection) minShowTime = 600; // Tiempo moderado en conexiones lentas
    
    const startTime = performance.now();
    
    const handleLoad = () => {
      const loadTime = performance.now() - startTime;
      const remainingTime = Math.max(0, minShowTime - loadTime);
      
      setTimeout(() => {
        if (preloader) {
          preloader.classList.add('hidden');
          setTimeout(() => {
            setIsLoading(false);
            preloader.remove();
          }, 500);
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