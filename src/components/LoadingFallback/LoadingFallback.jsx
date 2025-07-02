import React, { memo } from 'react';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import './LoadingFallback.css';

const LoadingFallback = memo(({ message }) => {
  const { t } = useLanguage();
  
  const loadingMessage = message || t('aria-loading');
  
  return (
    <div 
      className="loading-fallback" 
      role="status" 
      aria-live="polite"
      aria-label={loadingMessage}
    >
      <div className="loading-content">
        <div 
          className="loading-spinner"
          aria-hidden="true"
        >
          <div className="loading-ring"></div>
          <div className="loading-ring"></div>
          <div className="loading-ring"></div>
        </div>
        <p className="loading-message" id="loading-message">
          {loadingMessage}
        </p>
      </div>
    </div>
  );
});

// Nombre para DevTools
LoadingFallback.displayName = 'LoadingFallback';

export default LoadingFallback; 