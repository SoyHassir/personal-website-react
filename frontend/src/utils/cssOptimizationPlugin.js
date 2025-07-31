// Plugin de optimización de CSS para Vite

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

// Configuración de optimización de CSS
const cssOptimizationConfig = {
  // Opciones de minificación
  minify: {
    removeComments: true,
    removeWhitespace: true,
    removeEmptyRules: true,
    removeEmptyAtRules: true,
    collapseWhitespace: true,
    normalizeWhitespace: true,
    mergeRules: true,
    mergeSelectors: true
  },
  
  // Opciones de purga
  purge: {
    enabled: true,
    content: [
      './src/**/*.{js,jsx,ts,tsx}',
      './public/**/*.html'
    ],
    safelist: [
      'html',
      'body',
      'root',
      /^dark$/,
      /^light$/,
      /^theme-/,
      /^loading/,
      /^error/,
      /^success/,
      /^warning/
    ]
  },
  
  // Optimizaciones específicas
  optimizations: {
    removeUnusedCSS: true,
    mergeDuplicateSelectors: true,
    optimizeSelectors: true,
    removeEmptySelectors: true,
    normalizeCSS: true
  }
};

// Función para minificar CSS
const minifyCSS = (css) => {
  return css
    // Remover comentarios
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Remover espacios en blanco extra
    .replace(/\s+/g, ' ')
    // Remover espacios alrededor de caracteres especiales
    .replace(/\s*([{}:;,>+~])\s*/g, '$1')
    // Remover espacios al final de líneas
    .replace(/\s*;\s*}/g, '}')
    // Remover espacios al inicio de líneas
    .replace(/{\s*/g, '{')
    // Remover líneas vacías
    .replace(/\n\s*\n/g, '\n')
    // Remover espacios al final
    .trim();
};

// Función para optimizar selectores CSS
const optimizeSelectors = (css) => {
  return css
    // Simplificar selectores redundantes
    .replace(/([.#][a-zA-Z0-9_-]+)\s+\1/g, '$1')
    // Remover selectores vacíos
    .replace(/[.#][a-zA-Z0-9_-]+\s*{\s*}/g, '')
    // Optimizar media queries
    .replace(/@media\s+([^{]+)\s*{\s*}/g, '')
    // Remover reglas duplicadas
    .replace(/([^{}]+{[^}]+})\s*\1/g, '$1');
};

// Función para purgar CSS no utilizado
const purgeUnusedCSS = (css, contentFiles) => {
  // Esta es una implementación básica
  // En producción, usarías herramientas como PurgeCSS
  const usedSelectors = new Set();
  
  // Extraer selectores del CSS
  const selectorRegex = /([.#][a-zA-Z0-9_-]+)/g;
  const selectors = css.match(selectorRegex) || [];
  
  // Simular detección de selectores usados
  selectors.forEach(selector => {
    if (selector.includes('html') || 
        selector.includes('body') || 
        selector.includes('root') ||
        selector.includes('theme') ||
        selector.includes('loading') ||
        selector.includes('error') ||
        selector.includes('success') ||
        selector.includes('warning')) {
      usedSelectors.add(selector);
    }
  });
  
  // Filtrar CSS basado en selectores usados
  const lines = css.split('\n');
  const filteredLines = lines.filter(line => {
    const lineSelectors = line.match(selectorRegex) || [];
    return lineSelectors.some(selector => usedSelectors.has(selector)) ||
           !line.includes('{') || // Mantener reglas sin selectores
           line.trim().startsWith('@'); // Mantener media queries
  });
  
  return filteredLines.join('\n');
};

// Plugin principal de optimización de CSS
export const cssOptimizationPlugin = () => {
  return {
    name: 'css-optimization',
    
    // Hook para procesar CSS después del build
    generateBundle(options, bundle) {
      const cssFiles = Object.keys(bundle).filter(key => key.endsWith('.css'));
      
      cssFiles.forEach(cssFileName => {
        const cssFile = bundle[cssFileName];
        
        if (cssFile && cssFile.type === 'asset') {
          let css = cssFile.source;
          
          // Aplicar optimizaciones
          if (cssOptimizationConfig.minify.removeComments) {
            css = css.replace(/\/\*[\s\S]*?\*\//g, '');
          }
          
          if (cssOptimizationConfig.minify.removeWhitespace) {
            css = minifyCSS(css);
          }
          
          if (cssOptimizationConfig.optimizations.optimizeSelectors) {
            css = optimizeSelectors(css);
          }
          
          if (cssOptimizationConfig.purge.enabled) {
            css = purgeUnusedCSS(css, cssOptimizationConfig.purge.content);
          }
          
          // Actualizar el archivo CSS optimizado
          cssFile.source = css;
          
          console.log(`✅ CSS optimizado: ${cssFileName}`);
        }
      });
    },
    
    // Hook para configurar PostCSS
    configResolved(config) {
      if (config.command === 'build') {
        // Configurar PostCSS para optimización
        config.css.postcss = {
          ...config.css.postcss,
          plugins: [
            ...(config.css.postcss?.plugins || []),
            // Plugin para remover comentarios
            {
              postcssPlugin: 'remove-css-comments',
              Comment: (comment) => {
                comment.remove();
              }
            },
            // Plugin para optimizar selectores
            {
              postcssPlugin: 'optimize-css-selectors',
              Rule: (rule) => {
                // Optimizar selectores
                if (rule.selector) {
                  rule.selector = rule.selector
                    .replace(/\s+/g, ' ')
                    .trim();
                }
              }
            }
          ]
        };
      }
    }
  };
};

// Función para generar reporte de optimización CSS
export const generateCSSOptimizationReport = (cssFiles) => {
  let report = '# 🎨 Reporte de Optimización CSS\n\n';
  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  
  cssFiles.forEach(file => {
    const originalSize = file.originalSize || 0;
    const optimizedSize = file.optimizedSize || 0;
    const savings = originalSize - optimizedSize;
    const savingsPercent = ((savings / originalSize) * 100).toFixed(1);
    
    totalOriginalSize += originalSize;
    totalOptimizedSize += optimizedSize;
    
    report += `## 📁 ${file.name}\n\n`;
    report += `- **Tamaño original:** ${originalSize} bytes\n`;
    report += `- **Tamaño optimizado:** ${optimizedSize} bytes\n`;
    report += `- **Ahorro:** ${savings} bytes (${savingsPercent}%)\n\n`;
  });
  
  const totalSavings = totalOriginalSize - totalOptimizedSize;
  const totalSavingsPercent = ((totalSavings / totalOriginalSize) * 100).toFixed(1);
  
  report += `## 📊 Resumen\n\n`;
  report += `- **Tamaño total original:** ${totalOriginalSize} bytes\n`;
  report += `- **Tamaño total optimizado:** ${totalOptimizedSize} bytes\n`;
  report += `- **Ahorro total:** ${totalSavings} bytes (${totalSavingsPercent}%)\n`;
  
  return report;
};

// Configuración para diferentes niveles de optimización
export const cssOptimizationLevels = {
  // Nivel básico - solo minificación
  basic: {
    minify: true,
    removeComments: true,
    removeWhitespace: true
  },
  
  // Nivel intermedio - optimización de selectores
  intermediate: {
    minify: true,
    removeComments: true,
    removeWhitespace: true,
    optimizeSelectors: true,
    mergeDuplicateSelectors: true
  },
  
  // Nivel avanzado - purga completa
  advanced: {
    minify: true,
    removeComments: true,
    removeWhitespace: true,
    optimizeSelectors: true,
    mergeDuplicateSelectors: true,
    removeUnusedCSS: true,
    purgeUnusedSelectors: true
  }
};

// Función para aplicar optimización según nivel
export const applyCSSOptimization = (css, level = 'intermediate') => {
  const config = cssOptimizationLevels[level];
  
  if (config.minify) {
    css = minifyCSS(css);
  }
  
  if (config.optimizeSelectors) {
    css = optimizeSelectors(css);
  }
  
  return css;
}; 