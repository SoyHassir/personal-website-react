// Font loader optimizado - DESACTIVADO EN PREVIEW LOCAL
// Las fuentes se cargan desde HTML para evitar problemas de CORS

// Detectar si estamos en preview local
const isLocalPreview = () => {
  if (typeof window === 'undefined') return false;
  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
};

// Configuración de fuentes críticas
const criticalFonts = {
  'Poppins': {
    weights: ['300', '400', '500', '600', '700'],
    display: 'swap',
    preload: true
  },
  'Raleway': {
    weights: ['300', '400', '500', '600', '700'],
    display: 'swap',
    preload: true
  }
};

// Función para cargar fuentes de forma asíncrona
export const loadFontsAsync = () => {
  // En preview local, no cargar fuentes dinámicamente
  if (isLocalPreview()) {
    console.log('🛠️ Preview Local: Carga de fuentes desactivada para evitar errores de CORS');
    return Promise.resolve();
  }

  // Verificar si las fuentes ya están cargadas
  if (document.fonts && document.fonts.ready) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    // Solo en producción, crear link para cargar fuentes
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Raleway:wght@300;400;500;600;700&display=swap';
    
    // Cargar de forma asíncrona
    fontLink.onload = () => {
      console.log('✅ Fuentes cargadas asíncronamente');
      resolve();
    };
    
    fontLink.onerror = () => {
      console.warn('⚠️ Error cargando fuentes, usando fallback');
      resolve();
    };
    
    document.head.appendChild(fontLink);
  });
};

// Función para precargar fuentes críticas
export const preloadCriticalFonts = () => {
  // En preview local, no precargar dinámicamente
  if (isLocalPreview()) {
    return;
  }

  const fontFamilies = Object.keys(criticalFonts);
  
  fontFamilies.forEach(family => {
    const config = criticalFonts[family];
    
    // Crear preload link
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.as = 'font';
    preloadLink.type = 'font/woff2';
    preloadLink.crossOrigin = 'anonymous';
    
    // Construir URL de Google Fonts
    const weights = config.weights.join(';');
    preloadLink.href = `https://fonts.googleapis.com/css2?family=${family}:wght@${weights}&display=${config.display}`;
    
    document.head.appendChild(preloadLink);
  });
};

// Función para aplicar font-display: swap
export const applyFontDisplaySwap = () => {
  // Agregar CSS para font-display: swap
  const style = document.createElement('style');
  style.textContent = `
    @font-face {
      font-family: 'Poppins';
      font-display: swap;
    }
    @font-face {
      font-family: 'Raleway';
      font-display: swap;
    }
  `;
  document.head.appendChild(style);
};

// Función para detectar cuando las fuentes están listas
export const waitForFonts = () => {
  return new Promise((resolve) => {
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        console.log('✅ Todas las fuentes están listas');
        resolve();
      });
    } else {
      // Fallback para navegadores que no soportan Font Loading API
      setTimeout(resolve, 1000);
    }
  });
};

// Función para optimizar la carga de fuentes
export const optimizeFontLoading = () => {
  // En preview local, solo aplicar font-display
  if (isLocalPreview()) {
    applyFontDisplaySwap();
    document.documentElement.classList.add('fonts-loaded');
    return Promise.resolve();
  }

  // Aplicar font-display: swap
  applyFontDisplaySwap();
  
  // Precargar fuentes críticas
  preloadCriticalFonts();
  
  // Cargar fuentes de forma asíncrona
  loadFontsAsync().then(() => {
    // Marcar que las fuentes están listas
    document.documentElement.classList.add('fonts-loaded');
  });
  
  // Esperar a que las fuentes estén listas
  return waitForFonts();
};

// Configuración para diferentes estrategias de carga
export const fontLoadingStrategies = {
  // Estrategia 1: Carga asíncrona completa
  async: () => {
    if (isLocalPreview()) return;
    
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Raleway:wght@300;400;500;600;700&display=swap';
    link.media = 'print';
    link.onload = () => {
      link.media = 'all';
    };
    document.head.appendChild(link);
  },
  
  // Estrategia 2: Preload con font-display: swap
  preload: () => {
    if (isLocalPreview()) return;
    
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.as = 'style';
    preloadLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Raleway:wght@300;400;500;600;700&display=swap';
    document.head.appendChild(preloadLink);
    
    const styleLink = document.createElement('link');
    styleLink.rel = 'stylesheet';
    styleLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Raleway:wght@300;400;500;600;700&display=swap';
    document.head.appendChild(styleLink);
  },
  
  // Estrategia 3: Carga con fallback
  fallback: () => {
    if (isLocalPreview()) return;
    
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Raleway:wght@300;400;500;600;700&display=swap';
    link.onerror = () => {
      // Usar fuentes del sistema como fallback
      document.documentElement.style.setProperty('--font-heading', 'system-ui, sans-serif');
      document.documentElement.style.setProperty('--font-body', 'system-ui, sans-serif');
    };
    document.head.appendChild(link);
  }
};

// Inicializar optimización de fuentes
if (typeof window !== 'undefined') {
  // Aplicar optimización cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', optimizeFontLoading);
  } else {
    optimizeFontLoading();
  }
} 