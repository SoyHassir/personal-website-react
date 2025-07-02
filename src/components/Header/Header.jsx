import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
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
      <nav className="topnav">
        <a href="#inicio" className="logo">
          <img src="/img/optimized-logo/logo-large.webp" alt="Hassir Lastre Logo" />
        </a>
        <button className="open-menu" aria-label={t('nav-menu-open') || 'Abrir menú'} onClick={toggleMenu}>
          <i className="fas fa-bars"></i>
        </button>
        <ul className={`menu ${isMenuOpen ? 'menu_opened' : ''}`}>
          <li>
            <button className="close-menu" aria-label={t('nav-menu-close') || 'Cerrar menú'} onClick={toggleMenu}>
              <i className="fas fa-times"></i>
            </button>
          </li>
          <li><a href="#inicio" onClick={toggleMenu} className={activeSection === 'inicio' ? 'selected' : ''}>{t('nav-home')}</a></li>
          <li><a href="#sobre-mi" onClick={toggleMenu} className={activeSection === 'sobre-mi' ? 'selected' : ''}>{t('nav-about')}</a></li>
          <li><a href="#servicios" onClick={toggleMenu} className={activeSection === 'servicios' ? 'selected' : ''}>{t('nav-services')}</a></li>
          <li><a href="#contacto" onClick={toggleMenu} className={activeSection === 'contacto' ? 'selected' : ''}>{t('nav-contact')}</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;