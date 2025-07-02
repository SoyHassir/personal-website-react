import React, { useState, useEffect, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLanguage } from '../../i18n/LanguageContext.jsx';

const BackToTop = memo(() => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const getScrollPosition = () => {
      // Detectar scroll universal - compatible con nuestros cambios móvil
      return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    };

    const handleScroll = () => {
      const scrollY = getScrollPosition();
      const shouldShow = scrollY > 300;
      setIsVisible(shouldShow);
      
      // Debug en desarrollo
      if (import.meta.env.DEV && shouldShow !== isVisible) {
        console.log(`🔝 BackToTop: ${shouldShow ? 'mostrar' : 'ocultar'} (scroll: ${scrollY}px)`);
      }
    };

    // Agregar event listeners múltiples para máxima compatibilidad
    const scrollElements = [window, document.body, document.documentElement];
    
    scrollElements.forEach(element => {
      element.addEventListener('scroll', handleScroll, { passive: true });
    });
    
    // Verificación inicial
    handleScroll();

    return () => {
      scrollElements.forEach(element => {
        element.removeEventListener('scroll', handleScroll);
      });
    };
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Scroll universal compatible con nuestros cambios móvil
    const scrollToTop = () => {
      // Priorizar window.scrollTo para desktop
      if (window.scrollTo) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
      
      // Fallback para móvil - scroll en body/documentElement
      if (document.body.scrollTo) {
        document.body.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
      
      if (document.documentElement.scrollTo) {
        document.documentElement.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
      
      // Fallback manual si smooth scroll no funciona
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    };
    
    scrollToTop();
  };

  return (
    <button 
      className={`back-to-top ${isVisible ? 'visible' : ''}`}
      onClick={handleClick}
      aria-label={t('aria-back-to-top')}
      aria-hidden={!isVisible}
      type="button"
      tabIndex={isVisible ? 0 : -1}
    >
      <FontAwesomeIcon icon={['fas', 'arrow-up']} aria-hidden="true" />
    </button>
  );
});

// Nombre para DevTools
BackToTop.displayName = 'BackToTop';

export default BackToTop; 