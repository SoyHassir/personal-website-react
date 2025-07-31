/**
 * Configuración de Content Security Policy (CSP)
 * Para proteger contra XSS, data injection y otros ataques
 */

export const CSP_CONFIG = {
  // Configuración para desarrollo
  development: {
    'default-src': [
      "'self'",
      'localhost:*',
      '127.0.0.1:*',
      'ws://localhost:*',  // WebSocket para Vite HMR
      'ws://127.0.0.1:*'   // WebSocket para Vite HMR
    ],
    
    'script-src': [
      "'self'",
      "'unsafe-inline'",     // Necesario para Vite en desarrollo
      "'unsafe-eval'",       // Necesario para Vite HMR
      'localhost:*',
      '127.0.0.1:*',
      'https://www.googletagmanager.com',
      'https://www.google-analytics.com'
    ],
    
    'style-src': [
      "'self'",
      "'unsafe-inline'",     // Necesario para estilos dinámicos
      'https://fonts.googleapis.com',
      'https://cdnjs.cloudflare.com'
    ],
    
    'font-src': [
      "'self'",
      'data:',
      'https://fonts.gstatic.com',
      'https://cdnjs.cloudflare.com'
    ],
    
    'img-src': [
      "'self'",
      'data:',
      'blob:',
      'https://hassirlastre.com'
    ],
    
    'connect-src': [
      "'self'",
      'localhost:*',
      '127.0.0.1:*',
      'ws://localhost:*',
      'ws://127.0.0.1:*',
      'https://formspree.io',
      'https://www.google-analytics.com',
      'https://www.googletagmanager.com'
    ],
    
    'frame-src': [
      "'none'"
    ],
    
    'object-src': [
      "'none'"
    ],
    
    'base-uri': [
      "'self'"
    ],
    
    'form-action': [
      "'self'",
      'https://formspree.io'
    ],
    
    'worker-src': [
      "'self'",
      'blob:' // Para service workers
    ]
  },

  // Configuración para producción (más estricta)
  production: {
    'default-src': [
      "'self'"
    ],
    
    'script-src': [
      "'self'",
      "'unsafe-inline'", // Necesario para service worker y scripts inline
      'https://www.googletagmanager.com',
      'https://www.google-analytics.com'
    ],
    
    'style-src': [
      "'self'",
      "'unsafe-inline'", // Necesario para estilos dinámicos de React
      'https://fonts.googleapis.com'
    ],
    
    'font-src': [
      "'self'",
      'data:',
      'https://fonts.gstatic.com'
    ],
    
    'img-src': [
      "'self'",
      'data:',
      'https://hassirlastre.com'
    ],
    
    'connect-src': [
      "'self'",
      'https://formspree.io',
      'https://www.google-analytics.com',
      'https://www.googletagmanager.com'
    ],
    
    'frame-src': [
      "'none'"
    ],
    
    'object-src': [
      "'none'"
    ],
    
    'base-uri': [
      "'self'"
    ],
    
    'form-action': [
      "'self'",
      'https://formspree.io'
    ],
    
    'worker-src': [
      "'self'",
      'blob:' // Para service workers
    ],
    
    'upgrade-insecure-requests': true,
    
    'block-all-mixed-content': true
  }
};

/**
 * Convierte la configuración CSP a string de header
 */
export function generateCSPHeader(isDevelopment = false) {
  const config = isDevelopment ? CSP_CONFIG.development : CSP_CONFIG.production;
  
  const directives = Object.entries(config)
    .map(([directive, values]) => {
      if (typeof values === 'boolean' && values) {
        return directive;
      }
      if (Array.isArray(values)) {
        return `${directive} ${values.join(' ')}`;
      }
      return null;
    })
    .filter(Boolean);
  
  return directives.join('; ');
}

/**
 * Headers de seguridad adicionales
 */
export const SECURITY_HEADERS = {
  // Prevenir clickjacking
  'X-Frame-Options': 'DENY',
  
  // Prevenir MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // XSS Protection (aunque CSP es más efectivo)
  'X-XSS-Protection': '1; mode=block',
  
  // Política de referrer
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Forzar HTTPS en producción
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  
  // Política de permisos
  'Permissions-Policy': [
    'geolocation=()',
    'microphone=()',
    'camera=()',
    'magnetometer=()',
    'gyroscope=()',
    'speaker=()',
    'vibrate=()',
    'fullscreen=(self)',
    'payment=()'
  ].join(', ')
};

/**
 * Valida una cadena CSP
 */
export function validateCSP(cspString) {
  const issues = [];
  const directives = cspString.split(';').length;
  
  // Validaciones básicas
  if (!cspString.includes('default-src')) {
    issues.push("Directiva 'default-src' requerida");
  }
  
  if (!cspString.includes('script-src')) {
    issues.push("Directiva 'script-src' requerida");
  }
  
  if (cspString.includes("'unsafe-eval'") && !cspString.includes('localhost')) {
    issues.push("Uso de 'unsafe-eval' detectado - riesgo de seguridad");
  }
  
  if (cspString.includes("'unsafe-inline'") && !cspString.includes('localhost')) {
    issues.push("Uso de 'unsafe-inline' detectado - considerar alternativas");
  }
  
  return {
    isValid: issues.length === 0,
    issues,
    directives
  };
} 