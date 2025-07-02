import { getCLS, getFID, getFCP, getLCP, getTTFB, onINP } from 'web-vitals';
import { logger } from './logger.js';

// Configuración de umbrales para las métricas (valores en ms/score)
const THRESHOLDS = {
  // Core Web Vitals
  LCP: { good: 2500, needsImprovement: 4000 }, // Largest Contentful Paint
  FID: { good: 100, needsImprovement: 300 },   // First Input Delay  
  CLS: { good: 0.1, needsImprovement: 0.25 },  // Cumulative Layout Shift
  
  // Other Web Vitals
  FCP: { good: 1800, needsImprovement: 3000 }, // First Contentful Paint
  TTFB: { good: 800, needsImprovement: 1800 }, // Time to First Byte
  INP: { good: 200, needsImprovement: 500 }    // Interaction to Next Paint
};

// Función para evaluar el performance de una métrica
const evaluateMetric = (name, value) => {
  const threshold = THRESHOLDS[name];
  if (!threshold) return 'unknown';
  
  if (value <= threshold.good) return 'good';
  if (value <= threshold.needsImprovement) return 'needs-improvement';
  return 'poor';
};

// Función para formatear valores según el tipo de métrica
const formatValue = (name, value) => {
  if (name === 'CLS') {
    return value.toFixed(3); // CLS es un score sin unidad
  }
  return `${Math.round(value)}ms`; // Resto son tiempos en ms
};

// Colores para logging en consola
const getColorForRating = (rating) => {
  switch (rating) {
    case 'good': return 'color: #0CCE6B; font-weight: bold;';
    case 'needs-improvement': return 'color: #FFA400; font-weight: bold;';
    case 'poor': return 'color: #FF4E42; font-weight: bold;';
    default: return 'color: #666; font-weight: bold;';
  }
};

// Storage para métricas (útil para analytics)
const metricsStorage = {
  metrics: new Map(),
  
  // Almacenar métrica
  store(name, value, rating) {
    this.metrics.set(name, {
      name,
      value,
      rating,
      timestamp: Date.now(),
      url: window.location.pathname
    });
  },
  
  // Obtener todas las métricas
  getAll() {
    return Array.from(this.metrics.values());
  },
  
  // Obtener métrica específica
  get(name) {
    return this.metrics.get(name);
  },
  
  // Limpiar métricas
  clear() {
    this.metrics.clear();
  }
};

// Función para reportar métricas (extensible para analytics)
const reportMetric = ({ name, value, rating, delta, id }) => {
  const formattedValue = formatValue(name, value);
  const color = getColorForRating(rating);
  
  // Log en desarrollo
  if (import.meta.env.DEV) {
    logger.log(
      `%c${name}: ${formattedValue} (${rating})`,
      color,
      {
        value,
        delta,
        id,
        rating,
        timestamp: Date.now()
      }
    );
  }
  
  // Almacenar en storage interno
  metricsStorage.store(name, value, rating);
  
  // Enviar a analytics en producción (ejemplo)
  if (import.meta.env.PROD) {
    sendToAnalytics({ name, value, rating, delta, id });
  }
  
  // Disparar evento personalizado para otros listeners
  window.dispatchEvent(new CustomEvent('web-vitals-metric', {
    detail: { name, value, rating, delta, id, formattedValue }
  }));
};

// Función para enviar a analytics (placeholder - configurar según necesidades)
const sendToAnalytics = ({ name, value, rating, delta, id }) => {
  // Ejemplo para Google Analytics 4
  if (typeof gtag !== 'undefined') {
    gtag('event', 'web_vitals', {
      metric_name: name,
      metric_value: value,
      metric_rating: rating,
      metric_delta: delta,
      metric_id: id
    });
  }
  
  // Ejemplo para otras plataformas de analytics
  // if (typeof analytics !== 'undefined') {
  //   analytics.track('Web Vitals', { name, value, rating, delta, id });
  // }
  
  // Ejemplo para endpoint personalizado
  // fetch('/api/metrics', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ name, value, rating, delta, id, timestamp: Date.now() })
  // }).catch(err => logger.error('Error sending metrics:', err));
};

// Función principal para inicializar Web Vitals tracking
export const reportWebVitals = (onPerfEntry) => {
  const handleMetric = (metric) => {
    const rating = evaluateMetric(metric.name, metric.value);
    const enhancedMetric = { ...metric, rating };
    
    // Ejecutar callback personalizado si se proporciona
    if (onPerfEntry && typeof onPerfEntry === 'function') {
      onPerfEntry(enhancedMetric);
    }
    
    // Reportar usando nuestro sistema
    reportMetric(enhancedMetric);
  };

  // Medir Core Web Vitals
  getCLS(handleMetric);   // Cumulative Layout Shift
  getFID(handleMetric);   // First Input Delay
  getLCP(handleMetric);   // Largest Contentful Paint
  
  // Medir Other Web Vitals
  getFCP(handleMetric);   // First Contentful Paint
  getTTFB(handleMetric);  // Time to First Byte
  
  // Interaction to Next Paint (experimental)
  try {
    onINP(handleMetric);
  } catch (error) {
    logger.warn('INP metric not available:', error);
  }
};

// Función para obtener resumen de métricas
export const getMetricsSummary = () => {
  const metrics = metricsStorage.getAll();
  const summary = {
    total: metrics.length,
    good: metrics.filter(m => m.rating === 'good').length,
    needsImprovement: metrics.filter(m => m.rating === 'needs-improvement').length,
    poor: metrics.filter(m => m.rating === 'poor').length,
    metrics: metrics
  };
  
  // Calcular score general
  summary.overallScore = metrics.length > 0 
    ? Math.round((summary.good / summary.total) * 100)
    : 0;
    
  return summary;
};

// Función para limpiar métricas almacenadas
export const clearMetrics = () => {
  metricsStorage.clear();
};

// Exportar el storage para uso avanzado
export { metricsStorage };

// Exportar umbrales para referencia
export { THRESHOLDS }; 