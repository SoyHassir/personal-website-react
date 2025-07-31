import React, { memo, useState } from 'react';
import { useWebVitals } from '../ManagerToolkit/hooks/useWebVitals.js';
import { THRESHOLDS } from '../../utils/webVitals.js';
import './WebVitalsMonitor.css';

const WebVitalsMonitor = memo(() => {
  const { 
    metrics, 
    isTracking, 
    hasMetrics, 
    getOverallRating, 
    getCoreWebVitals, 
    getOtherVitals,
    clearAllMetrics 
  } = useWebVitals({ enableSummary: true });

  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Solo mostrar en desarrollo
  if (import.meta.env.PROD) {
    return null;
  }

  if (!isVisible) {
    return (
      <button 
        className="web-vitals-toggle"
        onClick={() => setIsVisible(true)}
        title="Mostrar Web Vitals Monitor"
      >
        📊
      </button>
    );
  }

  const overallRating = getOverallRating();
  const coreVitals = getCoreWebVitals();
  const otherVitals = getOtherVitals();

  const formatValue = (metric) => {
    return metric.name === 'CLS' 
      ? metric.value.toFixed(3) 
      : `${Math.round(metric.value)}ms`;
  };

  const getRatingColor = (rating) => {
    switch (rating) {
      case 'good': return '#0CCE6B';
      case 'needs-improvement': return '#FFA400';
      case 'poor': return '#FF4E42';
      default: return '#666';
    }
  };

  const getMetricIcon = (name) => {
    switch (name) {
      case 'LCP': return '🎯'; // Largest Contentful Paint
      case 'FID': return '⚡'; // First Input Delay
      case 'CLS': return '📐'; // Cumulative Layout Shift
      case 'FCP': return '🎨'; // First Contentful Paint
      case 'TTFB': return '🚀'; // Time to First Byte
      case 'INP': return '👆'; // Interaction to Next Paint
      default: return '📊';
    }
  };

  const getMetricDescription = (name) => {
    switch (name) {
      case 'LCP': return 'Largest Contentful Paint - Velocidad de carga';
      case 'FID': return 'First Input Delay - Interactividad';
      case 'CLS': return 'Cumulative Layout Shift - Estabilidad visual';
      case 'FCP': return 'First Contentful Paint - Primera renderización';
      case 'TTFB': return 'Time to First Byte - Respuesta del servidor';
      case 'INP': return 'Interaction to Next Paint - Responsividad';
      default: return name;
    }
  };

  return (
    <div className={`web-vitals-monitor ${isExpanded ? 'expanded' : 'collapsed'}`}>
      {/* Header */}
      <div className="web-vitals-header">
        <div className="web-vitals-title">
          <span className="web-vitals-icon">📊</span>
          <span>Web Vitals</span>
          {hasMetrics && (
            <span 
              className="web-vitals-status"
              style={{ color: getRatingColor(overallRating) }}
            >
              {overallRating}
            </span>
          )}
        </div>
        <div className="web-vitals-controls">
          <button 
            className="web-vitals-btn"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? "Contraer" : "Expandir"}
          >
            {isExpanded ? '−' : '+'}
          </button>
          <button 
            className="web-vitals-btn"
            onClick={() => setIsVisible(false)}
            title="Ocultar monitor"
          >
            ×
          </button>
        </div>
      </div>

      {/* Content expandido */}
      {isExpanded && (
        <div className="web-vitals-content">
          <div className="web-vitals-status-bar">
            <span className="web-vitals-tracking">
              {isTracking ? '🟢 Tracking activo' : '🔴 Tracking inactivo'}
            </span>
            <span className="web-vitals-count">
              {metrics.length} métricas
            </span>
          </div>

          {/* Core Web Vitals */}
          {coreVitals.length > 0 && (
            <div className="web-vitals-section">
              <h4 className="web-vitals-section-title">🎯 Core Web Vitals</h4>
              <div className="web-vitals-metrics">
                {coreVitals.map((metric) => (
                  <div key={metric.name} className="web-vitals-metric">
                    <div className="web-vitals-metric-header">
                      <span className="web-vitals-metric-icon">
                        {getMetricIcon(metric.name)}
                      </span>
                      <span className="web-vitals-metric-name">
                        {metric.name}
                      </span>
                      <span 
                        className="web-vitals-metric-value"
                        style={{ color: getRatingColor(metric.rating) }}
                      >
                        {formatValue(metric)}
                      </span>
                    </div>
                    <div className="web-vitals-metric-description">
                      {getMetricDescription(metric.name)}
                    </div>
                    <div className="web-vitals-metric-bar">
                      <div 
                        className="web-vitals-metric-fill"
                        style={{ 
                          backgroundColor: getRatingColor(metric.rating),
                          width: `${Math.min((metric.value / THRESHOLDS[metric.name]?.needsImprovement) * 100, 100)}%`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other Web Vitals */}
          {otherVitals.length > 0 && (
            <div className="web-vitals-section">
              <h4 className="web-vitals-section-title">📈 Other Web Vitals</h4>
              <div className="web-vitals-metrics">
                {otherVitals.map((metric) => (
                  <div key={metric.name} className="web-vitals-metric">
                    <div className="web-vitals-metric-header">
                      <span className="web-vitals-metric-icon">
                        {getMetricIcon(metric.name)}
                      </span>
                      <span className="web-vitals-metric-name">
                        {metric.name}
                      </span>
                      <span 
                        className="web-vitals-metric-value"
                        style={{ color: getRatingColor(metric.rating) }}
                      >
                        {formatValue(metric)}
                      </span>
                    </div>
                    <div className="web-vitals-metric-description">
                      {getMetricDescription(metric.name)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!hasMetrics && (
            <div className="web-vitals-empty">
              <p>⏳ Esperando métricas...</p>
              <small>Interactúa con la página para generar métricas</small>
            </div>
          )}

          {/* Acciones */}
          {hasMetrics && (
            <div className="web-vitals-actions">
              <button 
                className="web-vitals-clear-btn"
                onClick={clearAllMetrics}
              >
                🗑️ Limpiar métricas
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

WebVitalsMonitor.displayName = 'WebVitalsMonitor';

export default WebVitalsMonitor; 