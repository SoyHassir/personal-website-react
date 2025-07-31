import React, { Suspense, useState, useEffect, createContext, useContext, useLayoutEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../Header/Header.jsx';

import StructuredData from '../StructuredData/StructuredData.jsx';
import LoadingFallback from '../LoadingFallback/LoadingFallback.jsx';
import SkipNavigation from '../SkipNavigation/SkipNavigation.jsx';
import FloatingButtons from '../FloatingButtons/FloatingButtons.jsx';
// import WebVitalsMonitor from '../WebVitalsMonitor/WebVitalsMonitor.jsx'; // Temporalmente desactivado
import { useDarkMode, usePreloader, useActiveSection } from '../ManagerToolkit/hooks';

// Lazy loading del Footer
const Footer = React.lazy(() => import('../Footer/Footer.jsx'));

// Contexto para visibilidad del footer
export const FooterVisibilityContext = createContext({ showFooter: true, setShowFooter: () => {} });

const Layout = () => {
  const [showFooter, setShowFooter] = useState(true);
  const [headerVisible, setHeaderVisible] = useState(false);
  const location = useLocation();
  
  // Hooks de funcionalidad transversal
  const { isLoading } = usePreloader();
  const { activeSection } = useActiveSection();
  
  // Detectar si es la primera carga o navegación interna
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Controlar visibilidad del header basado en el preloader Y navegación
  useEffect(() => {
    if (!isLoading || !isInitialLoad) {
      // Header aparece inmediatamente - PRIMERA PRIORIDAD
      setTimeout(() => {
        setHeaderVisible(true);
      }, isInitialLoad ? 10 : 0); // Sin delay en navegación interna
    } else {
      setHeaderVisible(false);
    }
  }, [isLoading, isInitialLoad]);
  
  // Marcar que ya no es la carga inicial después del primer preloader
  useEffect(() => {
    if (!isLoading && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [isLoading, isInitialLoad]);



  // Reiniciar scroll cuando cambia la ruta - MEJORADO para todas las páginas
  useLayoutEffect(() => {
    // Scroll reset inmediato y más agresivo para todas las rutas
    const resetScroll = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      // Asegurar que funcione en diferentes contextos
      if (document.scrollingElement) {
        document.scrollingElement.scrollTop = 0;
      }
      
      // Reset adicional con delay para asegurar efectividad
      setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }, 0);
    };

    resetScroll();
  }, [location.pathname]);

  return (
    <FooterVisibilityContext.Provider value={{ showFooter, setShowFooter }}>
    <>
      {/* Header compartido - siempre visible, fuera del sistema de preloader */}
      <Header headerVisible={headerVisible} />
      
      {/* Structured Data para SEO */}
      <StructuredData currentSection={activeSection} />
      
      {/* Skip Navigation para accesibilidad */}
      <SkipNavigation />
      
      {/* Contenido principal específico de cada página */}
      <main id="main-content" role="main">
        <Outlet />
      </main>
      
      {/* Footer compartido */}
      {showFooter && (
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      )}
      
      {/* Botones flotantes */}
      <FloatingButtons />

      {/* Web Vitals Monitor - TEMPORALMENTE DESACTIVADO */}
      {/* <WebVitalsMonitor /> */}
    </>
    </FooterVisibilityContext.Provider>
  );
};

export default Layout; 