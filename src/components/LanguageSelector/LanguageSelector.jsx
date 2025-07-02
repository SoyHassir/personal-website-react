import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import './LanguageSelector.css';

const LanguageSelector = () => {
  const { currentLanguage, changeLanguage } = useLanguage();
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const toggleLangMenu = () => {
    setIsLangMenuOpen(!isLangMenuOpen);
  };

  const selectLanguage = (lang) => {
    changeLanguage(lang);
    setIsLangMenuOpen(false);
  };



  return (
    <div className="lang-switcher">
      <button 
        className="lang-btn" 
        aria-haspopup="true" 
        aria-expanded={isLangMenuOpen} 
        aria-label="Seleccionar idioma"
        onClick={toggleLangMenu}
      >
        <i className="fas fa-globe"></i>
      </button>
      <div 
        className="lang-menu" 
        style={{ display: isLangMenuOpen ? 'flex' : 'none' }}
      >
        <button 
          className={`lang-option ${currentLanguage === 'es' ? 'active' : ''}`} 
          onClick={() => selectLanguage('es')}
        >
          Español
        </button>
        <span className="lang-divider">|</span>
        <button 
          className={`lang-option ${currentLanguage === 'en' ? 'active' : ''}`} 
          onClick={() => selectLanguage('en')}
        >
          English
        </button>
      </div>
    </div>
  );
};

export default LanguageSelector; 