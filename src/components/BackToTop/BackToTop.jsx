import React, { useState, useEffect, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLanguage } from '../../i18n/LanguageContext.jsx';

const BackToTop = memo(() => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > 300);
    };

    // Agregar event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Verificación inicial
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
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