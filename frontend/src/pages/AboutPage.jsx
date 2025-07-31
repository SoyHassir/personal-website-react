import React, { Suspense, lazy } from 'react';
import About from '../components/About/About.jsx';
import LoadingFallback from '../components/LoadingFallback/LoadingFallback.jsx';
import './PageStyles.css';

const AboutPage = () => {
  return (
    <div className="about-page">
      <Suspense fallback={null}>
        <About />
      </Suspense>
    </div>
  );
};

export default AboutPage; 