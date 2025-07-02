import React, { useState, useCallback, memo } from 'react';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './LanguageSelector.css';

const LanguageSelector = memo(() => {
  const { currentLanguage, changeLanguage, t } = useLanguage();
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const toggleLangMenu = useCallback(() => {
    setIsLangMenuOpen(prev => !prev);
  }, []);

  const selectLanguage = useCallback((lang) => {
    changeLanguage(lang);
    setIsLangMenuOpen(false);
  }, [changeLanguage]);



  return (
    <div className="lang-switcher">
      <button 
        className="lang-btn" 
        aria-haspopup="menu" 
        aria-expanded={isLangMenuOpen} 
        aria-label={t('aria-language-selector')}
        aria-describedby="current-language"
        onClick={toggleLangMenu}
      >
        <FontAwesomeIcon icon={['fas', 'globe']} aria-hidden="true" />
        <span className="sr-only" id="current-language">
          {t('aria-current-language')}: {currentLanguage === 'es' ? 'Español' : 'English'}
        </span>
      </button>
      <div 
        className="lang-menu" 
        role="menu"
        aria-label={t('aria-language-selector')}
        style={{ display: isLangMenuOpen ? 'flex' : 'none' }}
        aria-hidden={!isLangMenuOpen}
      >
        <button 
          className={`lang-option ${currentLanguage === 'es' ? 'active' : ''}`} 
          role="menuitem"
          aria-current={currentLanguage === 'es' ? 'true' : 'false'}
          onClick={() => selectLanguage('es')}
        >
          Español
        </button>
        <span className="lang-divider" aria-hidden="true">|</span>
        <button 
          className={`lang-option ${currentLanguage === 'en' ? 'active' : ''}`} 
          role="menuitem"
          aria-current={currentLanguage === 'en' ? 'true' : 'false'}
          onClick={() => selectLanguage('en')}
        >
          English
        </button>
      </div>
    </div>
  );
});

// Nombre para DevTools
LanguageSelector.displayName = 'LanguageSelector';

export default LanguageSelector; 