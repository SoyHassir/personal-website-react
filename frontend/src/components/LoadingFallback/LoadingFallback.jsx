import React, { memo } from 'react';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import './LoadingFallback.css';

const LoadingFallback = memo(({ message }) => {
  // No mostrar nada - carga instantánea
  return null;
});

// Nombre para DevTools
LoadingFallback.displayName = 'LoadingFallback';

export default LoadingFallback; 