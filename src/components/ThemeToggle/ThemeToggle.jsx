import React, { memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLanguage } from '../../i18n/LanguageContext.jsx';

const ThemeToggle = memo(({ isDarkMode, toggleDarkMode }) => {
  const { t } = useLanguage();
  
  const ariaLabel = isDarkMode ? t('aria-theme-toggle-dark') : t('aria-theme-toggle-light');
  
  return (
    <button 
      className="theme-toggle" 
      onClick={toggleDarkMode}
      aria-label={ariaLabel}
      title={ariaLabel}
      aria-pressed={isDarkMode}
    >
      <FontAwesomeIcon 
        icon={['fas', isDarkMode ? 'sun' : 'moon']} 
        aria-hidden="true"
      />
    </button>
  );
});

// Nombre para DevTools
ThemeToggle.displayName = 'ThemeToggle';

export default ThemeToggle; 