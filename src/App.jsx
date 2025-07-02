import React, { Suspense, lazy, useCallback } from 'react';
import Header from './components/Header/Header.jsx';
import Home from './components/Home/Home.jsx';
import ThemeToggle from './components/ThemeToggle/ThemeToggle.jsx';
import LanguageSelector from './components/LanguageSelector/LanguageSelector.jsx';
import BackToTop from './components/BackToTop/BackToTop.jsx';
import StructuredData from './components/StructuredData/StructuredData.jsx';
import LoadingFallback from './components/LoadingFallback/LoadingFallback.jsx';
import SkipNavigation from './components/SkipNavigation/SkipNavigation.jsx';
// import WebVitalsMonitor from './components/WebVitalsMonitor/WebVitalsMonitor.jsx'; // Temporalmente desactivado
import { LanguageProvider } from './i18n/LanguageContext.jsx';
import { useDarkMode, usePreloader, useActiveSection } from './hooks';

// Lazy loading de componentes no críticos
const About = lazy(() => import('./components/About/About.jsx'));
const Services = lazy(() => import('./components/Services/Services.jsx'));
const Contact = lazy(() => import('./components/Contact/Contact.jsx'));
const Footer = lazy(() => import('./components/Footer/Footer.jsx'));

function App() {
  // Hooks de funcionalidad transversal
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { isLoading } = usePreloader();
  const { activeSection } = useActiveSection();

  return (
    <LanguageProvider>
      {/* Structured Data para SEO */}
      <StructuredData currentSection={activeSection} />
      
      {/* Skip Navigation para accesibilidad */}
      <SkipNavigation />
      
      <Header />
      <main id="main-content" role="main">
        <Home />
        <Suspense fallback={<LoadingFallback message="Cargando sección..." />}>
          <About />
        </Suspense>
        <Suspense fallback={<LoadingFallback message="Cargando servicios..." />}>
          <Services />
        </Suspense>
        <Suspense fallback={<LoadingFallback message="Cargando contacto..." />}>
          <Contact />
        </Suspense>
      </main>
      <Suspense fallback={<LoadingFallback message="Cargando..." />}>
        <Footer />
      </Suspense>
      
      {/* Botones flotantes transversales - mantener carga inmediata */}
      <ThemeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <LanguageSelector />
      <BackToTop />
      
      {/* Web Vitals Monitor - TEMPORALMENTE DESACTIVADO */}
      {/* <WebVitalsMonitor /> */}
    </LanguageProvider>
  );
}

export default App;