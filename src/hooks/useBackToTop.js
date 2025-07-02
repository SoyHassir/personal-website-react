import { useState, useEffect } from 'react';

export const useBackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Crear botón back to top si no existe
    let backToTop = document.querySelector('.back-to-top');
    if (!backToTop) {
      backToTop = document.createElement('button');
      backToTop.className = 'back-to-top';
      backToTop.setAttribute('aria-label', 'Volver arriba');
      backToTop.setAttribute('type', 'button');
      backToTop.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
      document.body.appendChild(backToTop);
    }

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const shouldShow = scrollY > 300;
      
      setIsVisible(shouldShow);
      if (shouldShow) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    };

    const handleClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };

    // Limpiar event listeners existentes
    const existingHandler = backToTop.onclick;
    if (existingHandler) {
      backToTop.removeEventListener('click', existingHandler);
    }

    // Agregar event listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    backToTop.addEventListener('click', handleClick, { passive: false });

    // Verificación inicial
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (backToTop) {
        backToTop.removeEventListener('click', handleClick);
      }
    };
  }, []);

  return { isVisible };
}; 