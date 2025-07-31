import React from 'react';
import ThemeToggle from '../ThemeToggle/ThemeToggle.jsx';
import LanguageSelector from '../LanguageSelector/LanguageSelector.jsx';
import ToolsButton from '../FloatingTools/ToolsButton.jsx';
import Tooltip from '../FloatingTools/Tooltip.jsx';
import { useDarkMode } from '../ManagerToolkit/hooks';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import './FloatingButtons.css';

const FloatingButtons = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { t } = useLanguage();

  return (
    <div className="floating-buttons-container">
      <ToolsButton />
      <Tooltip content={t('aria-language-selector') || 'Idioma'} position="left">
        <LanguageSelector />
      </Tooltip>
      <Tooltip content={isDarkMode ? (t('aria-theme-toggle-dark') || 'Modo claro') : (t('aria-theme-toggle-light') || 'Modo oscuro')} position="left">
        <ThemeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      </Tooltip>
    </div>
  );
};

export default FloatingButtons; 