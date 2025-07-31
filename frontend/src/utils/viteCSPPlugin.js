/**
 * Plugin de Vite para Content Security Policy (CSP)
 * Aplica headers de seguridad durante desarrollo y build
 */

import { generateCSPHeader, SECURITY_HEADERS } from './cspConfig.js';

/**
 * Plugin de Vite para CSP y headers de seguridad
 */
export function viteCSPPlugin(options = {}) {
  const {
    isDevelopment = true,
    enableReporting = false,
    reportUri = null,
    additionalHeaders = {}
  } = options;

  return {
    name: 'vite-csp-plugin',
    
    configureServer(server) {
      // Solo aplicar headers CSP básicos en desarrollo para evitar conflictos con HMR
      server.middlewares.use((req, res, next) => {
        // Evitar aplicar CSP a archivos de Vite y HMR
        if (req.url?.includes('/@vite/') || 
            req.url?.includes('/@fs/') || 
            req.url?.includes('/node_modules/') ||
            req.url?.includes('/__vite_ping') ||
            req.url?.includes('/src/')) {
          return next();
        }

        // Headers básicos de seguridad para desarrollo (sin CSP restrictivo)
        const headers = {
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'SAMEORIGIN', // Más permisivo en desarrollo
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          ...additionalHeaders
        };

        // Aplicar headers
        Object.entries(headers).forEach(([key, value]) => {
          if (value && !res.headersSent) {
            res.setHeader(key, value);
          }
        });

        next();
      });
    },

    generateBundle(options, bundle) {
      // Para builds de producción, generar archivo de configuración
      if (!isDevelopment) {
        this.emitFile({
          type: 'asset',
          fileName: '_security-headers.txt',
          source: generateSecurityHeadersFile(false)
        });
      }
    },

    // Hook para modificar el HTML generado (solo en producción)
    transformIndexHtml(html, context) {
      // Solo agregar CSP meta tag en producción
      if (!isDevelopment) {
        const cspMeta = `<meta http-equiv="Content-Security-Policy" content="${generateCSPHeader(false)}">`;
        return html.replace('<head>', `<head>\n    ${cspMeta}`);
      }
      return html;
    }
  };
}

/**
 * Genera archivo de configuración para servidores web
 */
function generateSecurityHeadersFile(isDevelopment = false) {
  const cspHeader = generateCSPHeader(isDevelopment);
  
  return `
# Configuración de headers de seguridad
# Para usar con nginx, Apache, Cloudflare, etc.

## Content Security Policy
Content-Security-Policy: ${cspHeader}

## Headers de seguridad adicionales
${Object.entries(SECURITY_HEADERS)
  .map(([key, value]) => `${key}: ${value}`)
  .join('\n')}

## Configuración para Nginx (.conf)
# add_header Content-Security-Policy "${cspHeader}" always;
# add_header X-Frame-Options "DENY" always;
# add_header X-Content-Type-Options "nosniff" always;
# add_header X-XSS-Protection "1; mode=block" always;
# add_header Referrer-Policy "strict-origin-when-cross-origin" always;
# add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

## Configuración para Apache (.htaccess)
# Header always set Content-Security-Policy "${cspHeader}"
# Header always set X-Frame-Options "DENY"
# Header always set X-Content-Type-Options "nosniff"
# Header always set X-XSS-Protection "1; mode=block"
# Header always set Referrer-Policy "strict-origin-when-cross-origin"
# Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"

## Configuración para Cloudflare Workers
# response.headers.set('Content-Security-Policy', '${cspHeader}');
# response.headers.set('X-Frame-Options', 'DENY');
# response.headers.set('X-Content-Type-Options', 'nosniff');

Generado automáticamente el ${new Date().toISOString()}
`;
}

/**
 * Utilitad para validar CSP
 */
export function validateCSP(cspString) {
  const directives = cspString.split(';').map(d => d.trim());
  const issues = [];

  // Verificaciones básicas
  if (!directives.some(d => d.startsWith('default-src'))) {
    issues.push('Falta directiva default-src');
  }

  if (directives.some(d => d.includes("'unsafe-eval'"))) {
    issues.push("Uso de 'unsafe-eval' detectado - riesgo de seguridad");
  }

  if (directives.some(d => d.includes("'unsafe-inline'") && d.startsWith('script-src'))) {
    issues.push("Uso de 'unsafe-inline' en script-src - riesgo alto de XSS");
  }

  return {
    isValid: issues.length === 0,
    issues,
    directives: directives.length
  };
}

export default viteCSPPlugin; 