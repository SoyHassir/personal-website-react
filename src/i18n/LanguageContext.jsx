import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { TRANSLATIONS } from './translations.js';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    // Detectar idioma del navegador o usar español por defecto
    const browserLang = navigator.language.slice(0, 2);
    return TRANSLATIONS[browserLang] ? browserLang : 'es';
  });

  // Función para traducir usando una clave - memoizada
  const t = useCallback((key) => {
    return TRANSLATIONS[currentLanguage]?.[key] || key;
  }, [currentLanguage]);

  // Función para cambiar idioma - memoizada
  const changeLanguage = useCallback((lang) => {
    if (TRANSLATIONS[lang]) {
      setCurrentLanguage(lang);
      // Guardar en localStorage para persistencia
      localStorage.setItem('preferred-language', lang);
      // Actualizar atributo lang del documento
      document.documentElement.setAttribute('lang', lang);
    }
  }, []);

  // Cargar idioma guardado al inicializar
  useEffect(() => {
    const savedLang = localStorage.getItem('preferred-language');
    if (savedLang && TRANSLATIONS[savedLang]) {
      setCurrentLanguage(savedLang);
    }
    document.documentElement.setAttribute('lang', currentLanguage);
  }, [currentLanguage]);

  // Memoizar idiomas disponibles (no cambian)
  const availableLanguages = useMemo(() => Object.keys(TRANSLATIONS), []);

  // Memoizar el objeto value del contexto
  const value = useMemo(() => ({
    currentLanguage,
    changeLanguage,
    t,
    availableLanguages
  }), [currentLanguage, changeLanguage, t, availableLanguages]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}; 