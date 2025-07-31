import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import critical from 'rollup-plugin-critical'
import { viteCSPPlugin } from './src/utils/viteCSPPlugin.js'
import { compressionMiddleware } from './src/utils/compressionMiddleware.js'
import { minificationPlugin } from './src/utils/minificationPlugin.js'
import { cssOptimizationPlugin } from './src/utils/cssOptimizationPlugin.js'
import { modernBrowserPlugin } from './src/utils/modernBrowserPlugin.js'

// Polyfill para crypto.getRandomValues en Git Bash
if (typeof globalThis.crypto === 'undefined') {
  globalThis.crypto = {}
}

if (typeof globalThis.crypto.getRandomValues === 'undefined') {
  globalThis.crypto.getRandomValues = function(array) {
    const bytes = new Uint8Array(array.length)
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = Math.floor(Math.random() * 256)
    }
    array.set(bytes)
    return array
  }
}

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const isDevelopment = command === 'serve';
  
  return {
    // Configuración de minificación y tree shaking
    esbuild: {
      minify: !isDevelopment, // Minificar en producción
      minifyIdentifiers: !isDevelopment,
      minifySyntax: !isDevelopment,
      minifyWhitespace: !isDevelopment,
      drop: isDevelopment ? [] : ['console', 'debugger'],
      treeShaking: true
    },
    plugins: [
      react(),
      // Temporalmente deshabilitadas para debug de Font Awesome
      // minificationPlugin(),
      // cssOptimizationPlugin(),
      // modernBrowserPlugin(),
      // Solo aplicar CSP plugin en producción para evitar conflictos con HMR
      ...(isDevelopment ? [] : [])
    ],
  
  // Configuración específica para Windows/Git Bash
  define: {
    global: 'globalThis',
  },
  
      // Optimizaciones de build
    build: {
      // Configurar output para que vaya a la raíz del proyecto
      outDir: '../dist',
      
      // Tree shaking más agresivo - DESHABILITADO TEMPORALMENTE
      rollupOptions: {
        // treeshake: {
        //   moduleSideEffects: false,
        //   propertyReadSideEffects: false,
        //   unknownGlobalSideEffects: false
        // },
      output: {
        manualChunks: (id) => {
          // 1. Vendors principales - cache duradero
          if (id.includes('react') || id.includes('react-dom')) {
            return 'react-vendor';
          }
          
          // 2. Librerías de animación/UI
          if (id.includes('typed.js')) {
            return 'animation-vendor';
          }
          
          // 3. Sistema de internacionalización - chunk separado
          if (id.includes('src/i18n/') || id.includes('/translations.js')) {
            return 'i18n-system';
          }
          
          // 4. Hooks compartidos - reutilizables
          if (id.includes('src/components/ManagerToolkit/hooks/')) {
            return 'hooks-shared';
          }
          
          // 5. Utilidades y helpers
          if (id.includes('src/utils/') || id.includes('src/services/')) {
            return 'utils-shared';
          }
          
          // 6. CSS y estilos (si están importados como JS)
          if (id.includes('.css') || id.includes('index.css')) {
            return 'styles-shared';
          }
          
          // 7. Componentes críticos - bundle principal
          if (id.includes('src/components/Home/') || 
              id.includes('src/components/Header/') ||
              id.includes('src/components/ThemeToggle/') ||
              id.includes('src/components/LanguageSelector/') ||
              id.includes('src/components/LoadingFallback/')) {
            return 'critical-components';
          }
          
          // 8. Node modules restantes
          if (id.includes('node_modules')) {
            return 'vendor-libs';
          }
          
          // Todo lo demás va al chunk principal (más pequeño ahora)
          return 'index';
        }
      },

      // Configuración de Critical CSS - DESHABILITADO TEMPORALMENTE
      plugins: [
        // COMENTADO PARA DEBUG DE FONT AWESOME
        // critical({
        //   criticalBase: 'dist/',
        //   criticalUrl: 'http://localhost:5174',
        //   criticalPages: [
        //     { uri: '/', template: 'index' }
        //   ],
        //   criticalConfig: {
        //     inline: true,
        //     extract: true,
        //     base: 'dist/',
        //     width: 1300,
        //     height: 900,
        //     timeout: 30000,
        //     ignore: {
        //       atrule: ['@font-face'],
        //       rule: [/some-regexp/],
        //       decl: (node, value) => /large-background/.test(value)
        //     },
        //     penthouse: {
        //       timeout: 60000,
        //       strict: false,
        //       maxEmbeddedBase64Length: 1000
        //     }
        //   }
        // })
      ]
    },
    
    // Optimizaciones de minificación
    minify: 'esbuild',
    target: 'esnext',
    
    // Source maps solo en desarrollo
    sourcemap: false,
    
    // Optimizaciones adicionales de chunks
    chunkSizeWarningLimit: 1000,
    
    // Configuración avanzada de splitting
    assetsInlineLimit: 4096, // Inline assets < 4KB
    
    // CSS Code Splitting y optimización
    cssCodeSplit: true,
    
    // Optimización específica de CSS
    css: {
      // Minificar CSS en producción
      minify: !isDevelopment,
      // Remover comentarios en producción
      postcss: {
        plugins: [
          // Plugin para remover comentarios CSS
          ...(isDevelopment ? [] : [{
            postcssPlugin: 'remove-comments',
            AtRule: {
              comment: (atRule) => {
                if (atRule.type === 'comment') {
                  atRule.remove();
                }
              }
            },
            Comment: (comment) => {
              comment.remove();
            }
          }])
        ]
      }
    },
    
    // Optimización para navegadores modernos
    esbuild: {
      target: 'es2020' // Target moderno para navegadores actuales
    }
  },
  
  // Optimizaciones de servidor de desarrollo
  server: {
    // Preload de módulos críticos
    warmup: {
      clientFiles: [
        './src/App.jsx',
        './src/components/Home/Home.jsx',
        './src/components/Header/Header.jsx',
        './src/components/ManagerToolkit/hooks/index.js',
        './src/i18n/LanguageContext.jsx'
      ]
    },
    
    // Configuración de compresión para desarrollo
    compress: true,
    headers: {
      'Accept-Encoding': 'gzip, deflate, br'
    },
    
    // Middleware personalizado para compresión mejorada
    middleware: [
      compressionMiddleware
    ]
  },

  // Configuración de experimentales
  experimental: {
    renderBuiltUrl(filename) {
      // Optimizar URLs de assets para CDN futuro
      return filename;
    }
  },
  
  // Alias para imports más limpios
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@hooks': '/src/components/ManagerToolkit/hooks',
      '@utils': '/src/utils',
      '@i18n': '/src/i18n'
    }
  }
  }; // Cerrar el objeto de configuración retornado
}); // Cerrar la función de configuración
