// Web Vitals implementation compatible with version 3.5.2
let webVitalsModule = null;

// Lazy load web-vitals to avoid startup issues
const loadWebVitals = async () => {
  if (webVitalsModule) return webVitalsModule;
  
  try {
    console.log('🔄 Loading Web Vitals module...');
    webVitalsModule = await import('web-vitals');
    console.log('✅ Web Vitals module loaded successfully');
    return webVitalsModule;
  } catch (error) {
    console.warn('❌ Web Vitals could not be loaded:', error);
    return null;
  }
};

// Simple logging function to avoid dependencies
const logMetric = (metric) => {
  if (import.meta.env.DEV) {
    const value = metric.name === 'CLS' 
      ? metric.value.toFixed(3) 
      : `${Math.round(metric.value)}ms`;
    
    console.log(`📊 ${metric.name}: ${value}`, metric);
  }
};

// Main function to initialize Web Vitals tracking
export const reportWebVitals = async (onPerfEntry) => {
  try {
    const webVitals = await loadWebVitals();
    if (!webVitals) {
      console.warn('❌ Web Vitals module not available');
      return;
    }

    const { getCLS, getFID, getFCP, getLCP, getTTFB } = webVitals;
    const availableMetrics = [];

    const handleMetric = (metric) => {
      console.log(`🎯 New Web Vital detected: ${metric.name}`);
      logMetric(metric);
      
      if (onPerfEntry && typeof onPerfEntry === 'function') {
        onPerfEntry(metric);
      }
    };

    // Initialize Core Web Vitals tracking
    if (getCLS) {
      getCLS(handleMetric);
      availableMetrics.push('CLS');
    }
    if (getFID) {
      getFID(handleMetric);
      availableMetrics.push('FID');
    }
    if (getLCP) {
      getLCP(handleMetric);
      availableMetrics.push('LCP');
    }
    if (getFCP) {
      getFCP(handleMetric);
      availableMetrics.push('FCP');
    }
    if (getTTFB) {
      getTTFB(handleMetric);
      availableMetrics.push('TTFB');
    }

    console.log(`📊 Web Vitals tracking started for: ${availableMetrics.join(', ')}`);
    console.log('💡 Tip: Interact with the page to generate FID metrics');
    
    // Test function available in global scope (development only)
    if (import.meta.env.DEV) {
      window.testWebVitals = () => {
        console.log('🧪 Testing Web Vitals with fake data...');
        handleMetric({
          name: 'TEST',
          value: 1234,
          id: 'test-123',
          delta: 1234
        });
      };
      console.log('🧪 Run window.testWebVitals() to test the system');
    }

  } catch (error) {
    console.warn('❌ Web Vitals tracking initialization failed:', error);
  }
}; 