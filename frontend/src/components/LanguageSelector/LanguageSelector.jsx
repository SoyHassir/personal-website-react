import React, { memo } from 'react';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocation } from 'react-router-dom';

const LanguageSelector = memo(() => {
  const { currentLanguage, changeLanguage, t } = useLanguage();
  const location = useLocation();
  const isManagerPage = location.pathname === '/manager-toolkit';

  const toggleLanguage = () => {
    if (!isManagerPage) {
      const newLanguage = currentLanguage === 'es' ? 'en' : 'es';
      changeLanguage(newLanguage);
    }
  };

  return (
    <div className="lang-btn-container">
      <button 
        className={`lang-btn ${currentLanguage === 'en' ? 'lang-btn-active' : ''}`}
        aria-label={t('aria-language-selector')}
        onClick={toggleLanguage}
        disabled={isManagerPage}
      >
        <i className="fas fa-globe" aria-hidden="true"></i>
      </button>
      <div className="lang-indicator">
        {currentLanguage === 'es' ? 'ES' : 'EN'}
      </div>
    </div>
  );
});

LanguageSelector.displayName = 'LanguageSelector';

export default LanguageSelector; 