import React, { createContext, useContext, useState, useEffect } from 'react';
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

  // Función para traducir usando una clave
  const t = (key) => {
    return TRANSLATIONS[currentLanguage]?.[key] || key;
  };

  // Función para cambiar idioma
  const changeLanguage = (lang) => {
    if (TRANSLATIONS[lang]) {
      setCurrentLanguage(lang);
      // Guardar en localStorage para persistencia
      localStorage.setItem('preferred-language', lang);
      // Actualizar atributo lang del documento
      document.documentElement.setAttribute('lang', lang);
    }
  };

  // Cargar idioma guardado al inicializar
  useEffect(() => {
    const savedLang = localStorage.getItem('preferred-language');
    if (savedLang && TRANSLATIONS[savedLang]) {
      setCurrentLanguage(savedLang);
    }
    document.documentElement.setAttribute('lang', currentLanguage);
  }, [currentLanguage]);

  const value = {
    currentLanguage,
    changeLanguage,
    t,
    availableLanguages: Object.keys(TRANSLATIONS)
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}; 