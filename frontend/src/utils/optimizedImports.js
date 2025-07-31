// Importaciones optimizadas para reducir JavaScript no utilizado

// React Router - importaciones específicas
export { BrowserRouter, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';

// React Helmet Async - solo lo necesario
export { Helmet, HelmetProvider } from 'react-helmet-async';

// Font Awesome - solo iconos específicos
export { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Formspree - solo el hook necesario
export { useForm } from '@formspree/react';

// Web Vitals - solo la función de reporte
export { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

// Typed.js - importación dinámica
export const loadTypedJS = () => import('typed.js');

// Mermaid - importación dinámica para Manager Toolkit
export const loadMermaid = () => import('mermaid');

// React Mermaid - importación dinámica
export const loadReactMermaid = () => import('react-mermaid2');

// Configuración para tree shaking más agresivo
export const treeShakingConfig = {
  // React Router - solo componentes necesarios
  router: {
    components: ['BrowserRouter', 'Routes', 'Route', 'Link', 'useNavigate', 'useParams'],
    exclude: ['MemoryRouter', 'HashRouter', 'StaticRouter']
  },
  
  // Font Awesome - solo iconos específicos
  fontawesome: {
    icons: [
      'faArrowDown', 'faArrowLeft', 'faMoon', 'faSun', 'faGlobe',
      'faBars', 'faTimes', 'faChevronDown', 'faChartLine',
      'faChalkboardTeacher', 'faDatabase', 'faFlask', 'faCogs',
      'faLaptopCode', 'faEnvelope', 'faSpinner', 'faCheck',
      'faExclamationTriangle', 'faGraduationCap', 'faUser',
      'faToolbox', 'faScrewdriverWrench', 'faClipboardList',
      'faSearch', 'faLink', 'faBolt'
    ],
    brands: ['faLinkedin', 'faGithub', 'faGoogle', 'faOrcid']
  },
  
  // React Helmet - solo funcionalidades básicas
  helmet: {
    components: ['Helmet', 'HelmetProvider'],
    exclude: ['FilledContext', 'HelmetData']
  }
};

// Función para cargar módulos dinámicamente
export const dynamicImport = (modulePath, fallback = null) => {
  return import(modulePath).catch(() => {
    console.warn(`Failed to load module: ${modulePath}`);
    return fallback;
  });
};

// Configuración de lazy loading optimizada
export const createLazyComponent = (importFn, fallback = null) => {
  return lazy(() => 
    importFn().catch(() => {
      console.warn('Failed to load lazy component');
      return { default: fallback || (() => {
        const React = require('react');
        return React.createElement('div', null, 'Error loading component');
      }) };
    })
  );
}; 