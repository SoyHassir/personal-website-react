import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ThemeToggle from '../ThemeToggle/ThemeToggle.jsx';
import LanguageSelector from '../LanguageSelector/LanguageSelector.jsx';
import { useDarkMode } from '../ManagerToolkit/hooks';
import './Header.css'; // Importa sus estilos locales

const Header = ({ headerVisible = true }) => {
  const { t } = useLanguage();
  const location = useLocation();
  const [isSolid, setIsSolid] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuClosing, setIsMenuClosing] = useState(false);
  
  // Hooks para tema e idioma
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  
  const isHomePage = location.pathname === '/';

  // Efecto para el fondo sólido al hacer scroll - igual que el sitio original
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      
      // Misma lógica que el sitio original: umbral de 50px
      if (scrollY > 50) {
        setIsSolid(true);
      } else {
        setIsSolid(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Efecto para el indicador de sección activa (solo en página de inicio)
  useEffect(() => {
    if (!isHomePage) {
      // Si no estamos en la página de inicio, establecer la sección activa basada en la ruta
      const path = location.pathname;
      if (path === '/manager-toolkit') setActiveSection('manager-toolkit');
      else setActiveSection('inicio');
      return;
    }

    // Solo observar secciones si estamos en la página de inicio
    const sections = document.querySelectorAll('section[id]');
    if (sections.length === 0) return;

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
  }, [isHomePage, location.pathname]);

  const toggleMenu = () => {
    if (isMenuOpen) {
      setIsMenuClosing(true);
      setTimeout(() => {
        setIsMenuOpen(false);
        setIsMenuClosing(false);
      }, 320); // igual a la duración de la animación de salida
    } else {
      setIsMenuOpen(true);
    }
  };

  // Función para manejar clics en navegación
  const handleNavClick = (sectionId) => {
    setIsMenuClosing(true);
    setTimeout(() => {
      setIsMenuOpen(false);
      setIsMenuClosing(false);
    }, 320); // igual a la duración de la animación de salida
    // El scroll se maneja en cada página individual
  };

  // Función para determinar si un enlace está activo
  const isActiveLink = (sectionId) => {
    if (isHomePage) {
      return activeSection === sectionId;
    } else {
          // Para otras páginas, comparar con la ruta actual
    const path = location.pathname;
    if (sectionId === 'manager-toolkit' && path === '/manager-toolkit') return true;
      if (sectionId === 'sobre-mi' && path === '/sobre-mi') return true;
      if (sectionId === 'servicios' && path === '/servicios') return true;
      if (sectionId === 'contacto' && path === '/contacto') return true;
    return false;
    }
  };

  return (
    <>
      {/* Overlay para efecto focus - igual que en modal */}
      {isMenuOpen && (
        <div 
          className="menu-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            background: document.body.classList.contains('dark-mode') 
              ? 'rgba(15, 23, 42, 0.75)' 
              : 'rgba(30, 34, 90, 0.55)',
            backdropFilter: document.body.classList.contains('dark-mode') 
              ? 'blur(8px)' 
              : 'blur(6px)',
            zIndex: 999,
            pointerEvents: 'none'
          }}
        />
      )}
      
      <header className={`topheader ${isSolid ? 'solid' : ''} ${headerVisible ? 'header-visible' : ''}`}>
        <nav className="topnav" id="navigation">
          {/* Logo */}
          <Link to="/" className="logo">
            <img src="/img/optimized-logo/logo-large.webp" alt="Hassir Lastre Logo" />
          </Link>

          {/* Navbar horizontal para desktop */}
          <div className="desktop-navbar">
            <ul className="desktop-menu">
              <li>
                <Link 
                  to="/" 
                  className={isActiveLink('inicio') ? 'selected' : ''}
                  role="menuitem"
                  aria-current={isActiveLink('inicio') ? 'page' : undefined}
                >
                  {t('nav-home')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/sobre-mi" 
                  onClick={() => handleNavClick('sobre-mi')} 
                  className={isActiveLink('sobre-mi') ? 'selected' : ''}
                  role="menuitem"
                  aria-current={isActiveLink('sobre-mi') ? 'page' : undefined}
                >
                  {t('nav-about')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/servicios" 
                  onClick={() => handleNavClick('servicios')} 
                  className={isActiveLink('servicios') ? 'selected' : ''}
                  role="menuitem"
                  aria-current={isActiveLink('servicios') ? 'page' : undefined}
                >
                  {t('nav-services')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/contacto" 
                  onClick={() => handleNavClick('contacto')} 
                  className={isActiveLink('contacto') ? 'selected' : ''}
                  role="menuitem"
                  aria-current={isActiveLink('contacto') ? 'page' : undefined}
                >
                  {t('nav-contact')}
                </Link>
              </li>
            </ul>

            {/* Controles de tema e idioma en desktop */}
            <div className="desktop-controls">
            </div>
          </div>

          {/* Botón hamburguesa solo para móvil */}
          {!isMenuOpen && (
          <button 
            className="open-menu" 
            aria-label={t('nav-menu-open')} 
            aria-expanded={isMenuOpen}
            aria-controls="main-navigation-menu"
            onClick={toggleMenu}
          >
            <FontAwesomeIcon icon={['fas', 'bars']} aria-hidden="true" />
          </button>
        )}
        {isMenuOpen && (
          <button 
            className="close-menu" 
            aria-label={t('nav-menu-close')} 
            onClick={toggleMenu}
          >
            <FontAwesomeIcon icon={['fas', 'times']} aria-hidden="true" style={{ color: '#fff' }} />
          </button>
        )}
        
        {/* Menú móvil */}
        <ul 
          id="main-navigation-menu"
          className={`menu${isMenuOpen ? ' menu_opened' : ''}${isMenuClosing ? ' menu_closing' : ''}`}
          role="menu"
          aria-label={t('nav-menu-open')}
          aria-hidden={!isMenuOpen}
          aria-expanded={isMenuOpen}
        >
          {/* Contenedor de enlaces de navegación */}
          <div className="nav-links">
            <li>
              <Link 
                to="/" 
                onClick={() => handleNavClick('inicio')} 
                className={isActiveLink('inicio') ? 'selected center-link' : 'center-link'}
                role="menuitem"
                aria-current={isActiveLink('inicio') ? 'page' : undefined}
              >
                {t('nav-home')}
              </Link>
            </li>
            <li>
              <Link 
                to="/sobre-mi" 
                  onClick={() => handleNavClick('sobre-mi')} 
                  className={isActiveLink('sobre-mi') ? 'selected center-link' : 'center-link'}
                  role="menuitem"
                  aria-current={isActiveLink('sobre-mi') ? 'page' : undefined}
                >
                  {t('nav-about')}
                </Link>
            </li>
            <li>
              <Link 
                to="/servicios" 
                  onClick={() => handleNavClick('servicios')} 
                  className={isActiveLink('servicios') ? 'selected center-link' : 'center-link'}
                  role="menuitem"
                  aria-current={isActiveLink('servicios') ? 'page' : undefined}
                >
                  {t('nav-services')}
                </Link>
            </li>

            <li>
              <Link 
                to="/manager-toolkit" 
                  onClick={() => handleNavClick('manager-toolkit')} 
                  className={isActiveLink('manager-toolkit') ? 'selected center-link' : 'center-link'}
                  role="menuitem"
                  aria-current={isActiveLink('manager-toolkit') ? 'page' : undefined}
                >
                  {t('nav-manager-toolkit')}
                </Link>
            </li>

            <li>
              <Link 
                to="/contacto" 
                  onClick={() => handleNavClick('contacto')} 
                  className={isActiveLink('contacto') ? 'selected center-link' : 'center-link'}
                  role="menuitem"
                  aria-current={isActiveLink('contacto') ? 'page' : undefined}
                >
                  {t('nav-contact')}
                </Link>
            </li>
            
            {/* Botones de Tema e Idioma para móvil - justo después del contacto */}
            <li className="mobile-controls">
              <div className="mobile-controls-container">
                <ThemeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
                <LanguageSelector />
              </div>
            </li>
          </div>
        </ul>
      </nav>
    </header>
    </>
  );
};

export default Header;