import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from './utils/optimizedImports.jsx';
import { LanguageProvider } from './i18n/LanguageContext.jsx';
import Layout from './components/Layout/Layout.jsx';
import LoadingFallback from './components/LoadingFallback/LoadingFallback.jsx';

// Lazy loading de todas las páginas para reducir el bundle inicial
const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'));
const ServicesPage = lazy(() => import('./pages/ServicesPage.jsx'));
const ContactPage = lazy(() => import('./pages/ContactPage.jsx'));
const ServicesDetailPage = lazy(() => import('./pages/ServicesDetailPage.jsx'));
const ManagerToolkitPage = lazy(() => import('./pages/ManagerToolkitPage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={
              <Suspense fallback={<LoadingFallback />}>
                <HomePage />
              </Suspense>
            } />
            <Route path="sobre-mi" element={
              <Suspense fallback={<LoadingFallback />}>
                <AboutPage />
              </Suspense>
            } />
            <Route path="servicios" element={
              <Suspense fallback={<LoadingFallback />}>
                <ServicesPage />
              </Suspense>
            } />
            <Route path="contacto" element={
              <Suspense fallback={<LoadingFallback />}>
                <ContactPage />
              </Suspense>
            } />
            <Route path="servicios/:serviceId" element={
              <Suspense fallback={<LoadingFallback />}>
                <ServicesDetailPage />
              </Suspense>
            } />
            <Route path="/manager-toolkit" element={
              <Suspense fallback={<LoadingFallback />}>
                <ManagerToolkitPage />
              </Suspense>
            } />
            <Route path="*" element={
              <Suspense fallback={<LoadingFallback />}>
                <NotFoundPage />
              </Suspense>
            } />
          </Route>
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;