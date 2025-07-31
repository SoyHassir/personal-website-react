import React, { Suspense, lazy } from 'react';
import Services from '../components/Services/Services.jsx';
import LoadingFallback from '../components/LoadingFallback/LoadingFallback.jsx';
import './PageStyles.css';

const ServicesPage = () => {
  return (
    <div className="services-page">
      <Suspense fallback={null}>
        <Services />
      </Suspense>
    </div>
  );
};

export default ServicesPage; 