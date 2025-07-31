import { useState, useEffect, useCallback } from 'react';
import { reportWebVitals, getMetricsSummary, clearMetrics } from '../utils/webVitals.js';
import { logger } from '../utils/logger.js';

export const useWebVitals = (options = {}) => {
  const { 
    enableTracking = true,
    enableSummary = false,
    onMetric = null 
  } = options;

  const [metrics, setMetrics] = useState([]);
  const [summary, setSummary] = useState(null);
  const [isTracking, setIsTracking] = useState(false);

  // Callback para manejar nuevas métricas
  const handleMetric = useCallback((metric) => {
    logger.log('New Web Vital metric:', metric);
    
    setMetrics(prevMetrics => {
      // Evitar duplicados basándose en el nombre de la métrica
      const filtered = prevMetrics.filter(m => m.name !== metric.name);
      return [...filtered, metric];
    });

    // Ejecutar callback personalizado si se proporciona
    if (onMetric && typeof onMetric === 'function') {
      onMetric(metric);
    }
  }, [onMetric]);

  // Función para refrescar el resumen
  const refreshSummary = useCallback(() => {
    if (enableSummary) {
      const currentSummary = getMetricsSummary();
      setSummary(currentSummary);
    }
  }, [enableSummary]);

  // Función para limpiar métricas
  const clearAllMetrics = useCallback(() => {
    clearMetrics();
    setMetrics([]);
    setSummary(null);
    logger.log('Web Vitals metrics cleared');
  }, []);

  // Función para iniciar tracking manualmente
  const startTracking = useCallback(() => {
    if (!isTracking) {
      reportWebVitals(handleMetric);
      setIsTracking(true);
      logger.log('Web Vitals tracking started');
    }
  }, [handleMetric, isTracking]);

  // Función para obtener métrica específica
  const getMetric = useCallback((name) => {
    return metrics.find(metric => metric.name === name) || null;
  }, [metrics]);

  // Efecto para inicializar tracking automático
  useEffect(() => {
    if (enableTracking && !isTracking) {
      startTracking();
    }
  }, [enableTracking, isTracking, startTracking]);

  // Efecto para escuchar eventos de métricas
  useEffect(() => {
    const handleMetricEvent = (event) => {
      handleMetric(event.detail);
    };

    window.addEventListener('web-vitals-metric', handleMetricEvent);
    
    return () => {
      window.removeEventListener('web-vitals-metric', handleMetricEvent);
    };
  }, [handleMetric]);

  // Efecto para actualizar resumen cuando cambian las métricas
  useEffect(() => {
    if (enableSummary && metrics.length > 0) {
      refreshSummary();
    }
  }, [metrics, enableSummary, refreshSummary]);

  // Funciones de utilidad para evaluar performance
  const getOverallRating = useCallback(() => {
    if (metrics.length === 0) return 'unknown';
    
    const goodMetrics = metrics.filter(m => m.rating === 'good').length;
    const totalMetrics = metrics.length;
    const percentage = (goodMetrics / totalMetrics) * 100;
    
    if (percentage >= 75) return 'good';
    if (percentage >= 50) return 'needs-improvement';
    return 'poor';
  }, [metrics]);

  const getCoreWebVitals = useCallback(() => {
    const coreVitals = ['LCP', 'FID', 'CLS'];
    return metrics.filter(metric => coreVitals.includes(metric.name));
  }, [metrics]);

  const getOtherVitals = useCallback(() => {
    const coreVitals = ['LCP', 'FID', 'CLS'];
    return metrics.filter(metric => !coreVitals.includes(metric.name));
  }, [metrics]);

  return {
    // Estado
    metrics,
    summary,
    isTracking,
    
    // Funciones de control
    startTracking,
    clearAllMetrics,
    refreshSummary,
    
    // Funciones de consulta
    getMetric,
    getOverallRating,
    getCoreWebVitals,
    getOtherVitals,
    
    // Utilidades
    hasMetrics: metrics.length > 0,
    coreWebVitalsCount: getCoreWebVitals().length,
    totalMetricsCount: metrics.length
  };
}; 