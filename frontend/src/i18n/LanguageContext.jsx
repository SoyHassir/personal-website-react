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
    // 1. Priorizar idioma guardado por el usuario
    const savedLang = localStorage.getItem('preferred-language');
    if (savedLang && TRANSLATIONS[savedLang]) {
      return savedLang;
    }
    
    // 2. Si no hay preferencia guardada, usar ESPAÑOL por defecto
    // (Independientemente del idioma del navegador)
    return 'es';
  });

  // Función para traducir usando una clave - memoizada
  const t = useCallback((key) => {
    return TRANSLATIONS[currentLanguage]?.[key] || key;
  }, [currentLanguage]);

  // Función para cambiar idioma - optimizada para evitar saltos
  const changeLanguage = useCallback((lang) => {
    if (TRANSLATIONS[lang] && lang !== currentLanguage) {
      // Agregar clase para transición suave
      document.body.classList.add('language-changing');
      
      // Cambiar idioma con un pequeño delay para permitir la transición
      setTimeout(() => {
        setCurrentLanguage(lang);
        // Guardar en localStorage para persistencia
        localStorage.setItem('preferred-language', lang);
        // Actualizar atributo lang del documento
        document.documentElement.setAttribute('lang', lang);
        
        // Remover clase después de la transición
        setTimeout(() => {
          document.body.classList.remove('language-changing');
        }, 300);
      }, 50);
    }
  }, [currentLanguage]);

  // Cargar idioma guardado al inicializar
  useEffect(() => {
    const savedLang = localStorage.getItem('preferred-language');
    if (savedLang && TRANSLATIONS[savedLang]) {
      setCurrentLanguage(savedLang);
    }
    // Siempre actualizar el atributo lang del documento
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