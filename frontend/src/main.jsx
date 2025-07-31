import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.jsx'
import { registerServiceWorker } from './utils/serviceWorkerRegistration.js'
import { reportWebVitals } from './utils/webVitals-stable.js'

// Configurar Font Awesome con tree shaking
import './utils/fontawesome.js'
import './utils/fontawesome.css'
// Importar CSS base de Font Awesome
import '@fortawesome/fontawesome-svg-core/styles.css'

// Forzar renderizado de iconos después de que el DOM esté listo
if (import.meta.env.PROD) {
  document.addEventListener('DOMContentLoaded', () => {
    // Trigger re-render de iconos Font Awesome
    const icons = document.querySelectorAll('svg[data-prefix]');
    icons.forEach(icon => {
      if (icon.style) {
        icon.style.display = icon.style.display || 'inline-block';
      }
    });
  });
}

// Optimizar carga de fuentes para eliminar render-blocking
import { optimizeFontLoading } from './utils/fontLoader.js'

// Structured Data validator (solo en desarrollo)
if (import.meta.env.DEV) {
  import('./utils/structuredDataValidator.js');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
)

// Registrar Service Worker después de que la app esté montada
if (import.meta.env.PROD) {
  registerServiceWorker();
}

// Inicializar Web Vitals tracking (versión estable)
(async () => {
  try {
    await reportWebVitals((metric) => {
      // Callback personalizado para métricas importantes
      if (import.meta.env.DEV) {
        console.group(`📊 Web Vital: ${metric.name}`);
        console.log(`Value: ${metric.value}${metric.name === 'CLS' ? '' : 'ms'}`);
        console.log(`ID: ${metric.id}`);
        if (metric.delta) console.log(`Delta: ${metric.delta}`);
        console.groupEnd();
      }
    });
    console.log('✅ Web Vitals tracking initialized successfully');
  } catch (error) {
    console.warn('❌ Web Vitals tracking failed to initialize:', error);
  }
})();
