import React, { Suspense, lazy } from 'react';
import Home from '../components/Home/Home.jsx';
import LoadingFallback from '../components/LoadingFallback/LoadingFallback.jsx';
import './PageStyles.css';

// Lazy loading de componentes no críticos de la página principal
const About = lazy(() => import('../components/About/About.jsx'));
const Services = lazy(() => import('../components/Services/Services.jsx'));
const Contact = lazy(() => import('../components/Contact/Contact.jsx'));

const HomePage = () => {
  return (
    <>
      <Home />
      <Suspense fallback={null}>
        <About />
      </Suspense>
      <Suspense fallback={null}>
        <Services />
      </Suspense>
      <Suspense fallback={null}>
        <Contact />
      </Suspense>
    </>
  );
};

export default HomePage; 