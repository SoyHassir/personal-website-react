// Plugin para optimizar código para navegadores modernos

// Configuración de navegadores modernos
const modernBrowserConfig = {
  // Características soportadas por navegadores modernos
  supportedFeatures: {
    'arrow-functions': true,
    'const-and-let': true,
    'default-parameters': true,
    'destructuring': true,
    'for-of': true,
    'generator': true,
    'modules': true,
    'object-spread': true,
    'optional-catch-binding': true,
    'optional-chaining': true,
    'rest-parameters': true,
    'template-literals': true,
    'unicode-escapes': true,
    'async-await': true,
    'class-fields': true,
    'class-private-methods': true,
    'logical-assignment': true,
    'nullish-coalescing': true
  },
  
  // Polyfills que se pueden eliminar
  removablePolyfills: [
    '@babel/plugin-transform-spread',
    '@babel/plugin-transform-parameters',
    '@babel/plugin-transform-arrow-functions',
    '@babel/plugin-transform-destructuring',
    '@babel/plugin-transform-template-literals',
    '@babel/plugin-transform-classes',
    '@babel/plugin-transform-modules-commonjs',
    '@babel/plugin-transform-modules-amd',
    '@babel/plugin-transform-modules-umd',
    '@babel/plugin-transform-modules-systemjs',
    '@babel/plugin-transform-modules-json',
    '@babel/plugin-transform-async-to-generator',
    '@babel/plugin-transform-regenerator',
    '@babel/plugin-transform-runtime'
  ],
  
  // Librerías que pueden usar código moderno
  modernLibraries: [
    'react',
    'react-dom',
    '@fortawesome/react-fontawesome',
    '@fortawesome/fontawesome-svg-core',
    '@fortawesome/free-solid-svg-icons',
    '@fortawesome/free-brands-svg-icons',
    'react-router-dom',
    'react-helmet-async',
    'web-vitals',
    'typed.js'
  ]
};

// Función para detectar polyfills innecesarios
const detectUnnecessaryPolyfills = (code) => {
  const unnecessaryPolyfills = [];
  
  modernBrowserConfig.removablePolyfills.forEach(polyfill => {
    if (code.includes(polyfill)) {
      unnecessaryPolyfills.push(polyfill);
    }
  });
  
  return unnecessaryPolyfills;
};

// Función para optimizar código para navegadores modernos
const optimizeForModernBrowsers = (code) => {
  let optimizedCode = code;
  
  // Remover transformaciones innecesarias
  modernBrowserConfig.removablePolyfills.forEach(polyfill => {
    const regex = new RegExp(`require\\(['"]${polyfill}['"]\\)`, 'g');
    optimizedCode = optimizedCode.replace(regex, '');
  });
  
  // Optimizar imports de librerías modernas
  modernBrowserConfig.modernLibraries.forEach(library => {
    const importRegex = new RegExp(`import\\s+.*\\s+from\\s+['"]${library}['"]`, 'g');
    optimizedCode = optimizedCode.replace(importRegex, (match) => {
      // Mantener imports pero optimizar para navegadores modernos
      return match.replace(/['"]/g, '"');
    });
  });
  
  return optimizedCode;
};

// Plugin principal para navegadores modernos
export const modernBrowserPlugin = () => {
  return {
    name: 'modern-browser-optimization',
    
    // Hook para configurar esbuild
    configResolved(config) {
      if (config.command === 'build') {
        // Configurar esbuild para navegadores modernos
        config.esbuild = {
          ...config.esbuild,
          target: 'es2020',
          // Deshabilitar transformaciones innecesarias
          keepNames: false,
          minifyIdentifiers: true,
          minifySyntax: true,
          minifyWhitespace: true
        };
      }
    },
    
    // Hook para procesar código después del build
    generateBundle(options, bundle) {
      const jsFiles = Object.keys(bundle).filter(key => key.endsWith('.js'));
      
      jsFiles.forEach(jsFileName => {
        const jsFile = bundle[jsFileName];
        
        if (jsFile && jsFile.type === 'chunk') {
          let code = jsFile.code;
          
          // Detectar polyfills innecesarios
          const unnecessaryPolyfills = detectUnnecessaryPolyfills(code);
          
          if (unnecessaryPolyfills.length > 0) {
            console.log(`⚠️  Polyfills innecesarios detectados en ${jsFileName}:`, unnecessaryPolyfills);
          }
          
          // Optimizar código para navegadores modernos
          const optimizedCode = optimizeForModernBrowsers(code);
          
          // Actualizar el archivo optimizado
          jsFile.code = optimizedCode;
          
          const originalSize = code.length;
          const optimizedSize = optimizedCode.length;
          const savings = originalSize - optimizedSize;
          
          if (savings > 0) {
            console.log(`✅ Código optimizado para navegadores modernos: ${jsFileName} (${savings} bytes ahorrados)`);
          }
        }
      });
    },
    
    // Hook para transformar imports
    transform(code, id) {
      // Optimizar imports de librerías modernas
      if (id.includes('node_modules')) {
        const library = modernBrowserConfig.modernLibraries.find(lib => 
          id.includes(lib)
        );
        
        if (library) {
          // Optimizar imports para navegadores modernos
          code = code.replace(
            /import\s+(\w+)\s+from\s+['"]([^'"]+)['"]/g,
            'import $1 from "$2"'
          );
        }
      }
      
      return code;
    }
  };
};

// Función para generar reporte de optimización
export const generateModernBrowserReport = (files) => {
  let report = '# 🔧 Reporte de Optimización para Navegadores Modernos\n\n';
  
  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  let totalPolyfillsRemoved = 0;
  
  files.forEach(file => {
    const originalSize = file.originalSize || 0;
    const optimizedSize = file.optimizedSize || 0;
    const polyfillsRemoved = file.polyfillsRemoved || 0;
    const savings = originalSize - optimizedSize;
    
    totalOriginalSize += originalSize;
    totalOptimizedSize += optimizedSize;
    totalPolyfillsRemoved += polyfillsRemoved;
    
    report += `## 📁 ${file.name}\n\n`;
    report += `- **Tamaño original:** ${originalSize} bytes\n`;
    report += `- **Tamaño optimizado:** ${optimizedSize} bytes\n`;
    report += `- **Ahorro:** ${savings} bytes\n`;
    report += `- **Polyfills removidos:** ${polyfillsRemoved}\n\n`;
  });
  
  const totalSavings = totalOriginalSize - totalOptimizedSize;
  const totalSavingsPercent = ((totalSavings / totalOriginalSize) * 100).toFixed(1);
  
  report += `## 📊 Resumen\n\n`;
  report += `- **Tamaño total original:** ${totalOriginalSize} bytes\n`;
  report += `- **Tamaño total optimizado:** ${totalOptimizedSize} bytes\n`;
  report += `- **Ahorro total:** ${totalSavings} bytes (${totalSavingsPercent}%)\n`;
  report += `- **Polyfills removidos:** ${totalPolyfillsRemoved}\n`;
  
  return report;
};

// Configuración para diferentes niveles de optimización
export const modernBrowserLevels = {
  // Nivel básico - solo target moderno
  basic: {
    target: 'es2020',
    removeUnnecessaryPolyfills: false,
    optimizeImports: false
  },
  
  // Nivel intermedio - optimización de polyfills
  intermediate: {
    target: 'es2020',
    removeUnnecessaryPolyfills: true,
    optimizeImports: true
  },
  
  // Nivel avanzado - optimización completa
  advanced: {
    target: 'es2022',
    removeUnnecessaryPolyfills: true,
    optimizeImports: true,
    useModernFeatures: true
  }
};

// Función para aplicar optimización según nivel
export const applyModernBrowserOptimization = (code, level = 'intermediate') => {
  const config = modernBrowserLevels[level];
  
  if (config.removeUnnecessaryPolyfills) {
    code = optimizeForModernBrowsers(code);
  }
  
  return code;
}; 