// Versión simplificada y segura de Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

// Función simple para reportar métricas
export const reportWebVitals = (onPerfEntry) => {
  if (!onPerfEntry || typeof onPerfEntry !== 'function') {
    return;
  }

  try {
    // Medir Core Web Vitals básicos (sin onINP que es experimental)
    getCLS(onPerfEntry);   
    getFID(onPerfEntry);   
    getLCP(onPerfEntry);   
    getFCP(onPerfEntry);   
    getTTFB(onPerfEntry);  
  } catch (error) {
    console.error('Error initializing Web Vitals:', error);
  }
}; 