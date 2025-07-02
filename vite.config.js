import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import critical from 'rollup-plugin-critical'
import { viteCSPPlugin } from './src/utils/viteCSPPlugin.js'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const isDevelopment = command === 'serve';
  
  return {
    plugins: [
      react(),
      // Solo aplicar CSP plugin en producción para evitar conflictos con HMR
      ...(isDevelopment ? [] : [viteCSPPlugin({
        isDevelopment: false,
        enableReporting: true,
        additionalHeaders: {
          'Cross-Origin-Opener-Policy': 'same-origin',
          'Cross-Origin-Embedder-Policy': 'require-corp'
        }
      })])
    ],
  
  // Optimizaciones de build
  build: {
    // Code splitting inteligente y estratégico
    rollupOptions: {
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
          if (id.includes('src/hooks/')) {
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

      // Configuración de Critical CSS
      plugins: [
        critical({
          criticalBase: 'dist/',
          criticalUrl: 'http://localhost:5174', // URL de tu servidor de desarrollo
          criticalPages: [
            { uri: '/', template: 'index' }
          ],
          criticalConfig: {
            // Configuración principal
            inline: true,          // Incluir CSS crítico inline
            extract: true,         // Extraer CSS no crítico
            base: 'dist/',
            // Dimensiones de viewport para determinar above-the-fold
            width: 1300,
            height: 900,
            // Configuración adicional
            timeout: 30000,
            ignore: {
              atrule: ['@font-face'],
              rule: [/some-regexp/],
              decl: (node, value) => /large-background/.test(value)
            },
            // Optimizaciones
            penthouse: {
              timeout: 60000,
              strict: false,
              maxEmbeddedBase64Length: 1000
            }
          }
        })
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
    
    // CSS Code Splitting
    cssCodeSplit: true
  },
  
  // Optimizaciones de servidor de desarrollo
  server: {
    // Preload de módulos críticos
    warmup: {
      clientFiles: [
        './src/App.jsx',
        './src/components/Home/Home.jsx',
        './src/components/Header/Header.jsx',
        './src/hooks/index.js',
        './src/i18n/LanguageContext.jsx'
      ]
    }
  },
  
  // Optimizaciones específicas para producción
  esbuild: {
    drop: ['console', 'debugger'], // Remover automáticamente en producción
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
      '@hooks': '/src/hooks',
      '@utils': '/src/utils',
      '@i18n': '/src/i18n'
    }
  }
  }; // Cerrar el objeto de configuración retornado
}); // Cerrar la función de configuración
