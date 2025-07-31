import React, { memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLanguage } from '../../i18n/LanguageContext.jsx';

const ThemeToggle = memo(({ isDarkMode, toggleDarkMode }) => {
  const { t } = useLanguage();
  
  const ariaLabel = isDarkMode ? t('aria-theme-toggle-dark') : t('aria-theme-toggle-light');
  const iconName = isDarkMode ? 'sun' : 'moon';
  
  return (
    <button 
      className={`theme-toggle ${isDarkMode ? 'theme-toggle-active' : ''}`}
      onClick={toggleDarkMode}
      aria-label={ariaLabel}
      aria-pressed={isDarkMode}
    >
      <i className={`fas fa-${iconName}`} aria-hidden="true"></i>
    </button>
  );
});

// Nombre para DevTools
ThemeToggle.displayName = 'ThemeToggle';

export default ThemeToggle; 