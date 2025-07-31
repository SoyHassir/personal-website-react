import { minify } from 'terser';

// Plugin de minificación para desarrollo
export const minificationPlugin = () => {
  return {
    name: 'minification-plugin',
    
    // Minificar JavaScript en desarrollo
    transform(code, id) {
      // Solo procesar archivos JavaScript
      if (!id.endsWith('.js') && !id.endsWith('.jsx') && !id.endsWith('.ts') && !id.endsWith('.tsx')) {
        return null;
      }
      
      // Solo minificar en desarrollo para mejorar rendimiento
      if (process.env.NODE_ENV === 'development') {
        return {
          code: code, // Mantener código original en desarrollo para debugging
          map: null
        };
      }
      
      // Minificar en producción
      try {
        const result = minify(code, {
          compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log', 'console.info', 'console.debug']
          },
          mangle: {
            toplevel: true
          },
          format: {
            comments: false
          }
        });
        
        return {
          code: result.code,
          map: result.map
        };
      } catch (error) {
        console.warn('Error minificando:', error.message);
        return null;
      }
    },
    
    // Configuración de build
    configResolved(config) {
      if (config.command === 'build') {
        config.build.minify = 'esbuild';
        config.build.target = 'esnext';
      }
    }
  };
};

// Configuración de minificación para diferentes entornos
export const minificationConfig = {
  development: {
    minify: false,
    sourcemap: true,
    drop: []
  },
  production: {
    minify: true,
    sourcemap: false,
    drop: ['console', 'debugger']
  }
}; 