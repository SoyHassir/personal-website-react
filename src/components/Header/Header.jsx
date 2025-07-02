import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Header.css'; // Importa sus estilos locales

const Header = () => {
  const { t } = useLanguage();
  const [isSolid, setIsSolid] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Efecto para el fondo sólido al hacer scroll
  useEffect(() => {
    const handleScroll = () => setIsSolid(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Efecto para el indicador de sección activa
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-50% 0px -50% 0px' }
    );
    sections.forEach((section) => observer.observe(section));
    return () => sections.forEach((section) => observer.unobserve(section));
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`topheader ${isSolid ? 'solid' : ''}`}>
      <nav className="topnav" id="navigation">
        <a href="#inicio" className="logo">
          <img src="/img/optimized-logo/logo-large.webp" alt="Hassir Lastre Logo" />
        </a>
        <button 
          className="open-menu" 
          aria-label={t('nav-menu-open')} 
          aria-expanded={isMenuOpen}
          aria-controls="main-navigation-menu"
          onClick={toggleMenu}
        >
          <FontAwesomeIcon icon={['fas', 'bars']} aria-hidden="true" />
        </button>
        <ul 
          id="main-navigation-menu"
          className={`menu ${isMenuOpen ? 'menu_opened' : ''}`}
          role="menu"
          aria-label={t('nav-menu-open')}
          aria-hidden={!isMenuOpen}
        >
          <li>
            <button 
              className="close-menu" 
              aria-label={t('nav-menu-close')} 
              onClick={toggleMenu}
            >
              <FontAwesomeIcon icon={['fas', 'times']} aria-hidden="true" />
            </button>
          </li>
          <li>
            <a 
              href="#inicio" 
              onClick={toggleMenu} 
              className={activeSection === 'inicio' ? 'selected' : ''}
              role="menuitem"
              aria-current={activeSection === 'inicio' ? 'page' : undefined}
            >
              {t('nav-home')}
            </a>
          </li>
          <li>
            <a 
              href="#sobre-mi" 
              onClick={toggleMenu} 
              className={activeSection === 'sobre-mi' ? 'selected' : ''}
              role="menuitem"
              aria-current={activeSection === 'sobre-mi' ? 'page' : undefined}
            >
              {t('nav-about')}
            </a>
          </li>
          <li>
            <a 
              href="#servicios" 
              onClick={toggleMenu} 
              className={activeSection === 'servicios' ? 'selected' : ''}
              role="menuitem"
              aria-current={activeSection === 'servicios' ? 'page' : undefined}
            >
              {t('nav-services')}
            </a>
          </li>
          <li>
            <a 
              href="#contacto" 
              onClick={toggleMenu} 
              className={activeSection === 'contacto' ? 'selected' : ''}
              role="menuitem"
              aria-current={activeSection === 'contacto' ? 'page' : undefined}
            >
              {t('nav-contact')}
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;