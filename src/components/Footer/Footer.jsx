import React, { useEffect, useRef } from 'react';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import './Footer.css';

const Footer = () => {
  const { t } = useLanguage();
  const footerRef = useRef(null);

  // useEffect para manejar la animación de entrada del footer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current);
      }
    };
  }, []);

  return (
    <footer className="main-footer" id="main-footer-placeholder" role="contentinfo" ref={footerRef}>
      {/* Información principal del footer */}
      <div className="footer-content">
        <p id="footer-copyright">{t('footer-copyright')}</p>
        <p id="footer-designed">{t('footer-designed')}</p>
      </div>
    </footer>
  );
};

export default Footer;