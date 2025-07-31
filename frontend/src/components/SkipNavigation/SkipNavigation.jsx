import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import './SkipNavigation.css';

const SkipNavigation = () => {
  const { t } = useLanguage();

  return (
    <nav className="skip-navigation" aria-label={t('skip-nav-navigation') || 'Enlaces de navegación rápida'}>
      <a 
        href="#main-content" 
        className="skip-link"
        aria-label={t('skip-nav-main') || 'Saltar al contenido principal'}
      >
        {t('skip-nav-main')}
      </a>
      <a 
        href="#navigation" 
        className="skip-link"
        aria-label={t('skip-nav-navigation') || 'Saltar a la navegación'}
      >
        {t('skip-nav-navigation')}
      </a>
      <a 
        href="#sobre-mi" 
        className="skip-link"
        aria-label={t('skip-nav-about') || 'Saltar a Sobre mí'}
      >
        {t('skip-nav-about')}
      </a>
      <a 
        href="#servicios" 
        className="skip-link"
        aria-label={t('skip-nav-services') || 'Saltar a Servicios'}
      >
        {t('skip-nav-services')}
      </a>
      <a 
        href="#contacto" 
        className="skip-link"
        aria-label={t('skip-nav-contact') || 'Saltar a Contacto'}
      >
        {t('skip-nav-contact')}
      </a>
    </nav>
  );
};

export default SkipNavigation; 