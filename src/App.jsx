import React from 'react';
import Header from './components/Header/Header.jsx';
import Home from './components/Home/Home.jsx';
import About from './components/About/About.jsx';
import Services from './components/Services/Services.jsx';
import Contact from './components/Contact/Contact.jsx';
import Footer from './components/Footer/Footer.jsx';
import ThemeToggle from './components/ThemeToggle/ThemeToggle.jsx';
import LanguageSelector from './components/LanguageSelector/LanguageSelector.jsx';
import { LanguageProvider } from './i18n/LanguageContext.jsx';
import { useDarkMode, usePreloader, useBackToTop } from './hooks';

function App() {
  // Hooks de funcionalidad transversal
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { isLoading } = usePreloader();
  const { isVisible: isBackToTopVisible } = useBackToTop();

  return (
    <LanguageProvider>
      <Header />
      <main>
        <Home />
        <About />
        <Services />
        <Contact />
      </main>
      <Footer />
      
      {/* Botones flotantes transversales */}
      <ThemeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <LanguageSelector />
      {/* Back to top se maneja automáticamente por useBackToTop hook */}
    </LanguageProvider>
  );
}

export default App;