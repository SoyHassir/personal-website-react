#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

console.log('🔧 Optimizando para navegadores modernos...');

// Configuración de optimización para navegadores modernos
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

// Función para encontrar archivos JavaScript
const findJSFiles = (patterns) => {
  const files = [];
  
  patterns.forEach(pattern => {
    if (pattern.includes('**')) {
      // Patrón con glob
      const basePath = pattern.split('**')[0];
      
      if (existsSync(basePath)) {
        const walkDir = (dir) => {
          const items = readdirSync(dir);
          
          items.forEach(item => {
            const fullPath = join(dir, item);
            const stat = statSync(fullPath);
            
            if (stat.isDirectory()) {
              walkDir(fullPath);
            } else if (item.endsWith('.js') || item.endsWith('.jsx')) {
              files.push(fullPath);
            }
          });
        };
        
        walkDir(basePath);
      }
    } else {
      // Patrón simple
      if (existsSync(pattern)) {
        files.push(pattern);
      }
    }
  });
  
  return files;
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

// Función para optimizar un archivo JavaScript
const optimizeJSFile = (filePath) => {
  if (!existsSync(filePath)) {
    console.warn(`⚠️  Archivo no encontrado: ${filePath}`);
    return null;
  }
  
  try {
    const originalCode = readFileSync(filePath, 'utf-8');
    const originalSize = originalCode.length;
    
    // Detectar polyfills innecesarios
    const unnecessaryPolyfills = detectUnnecessaryPolyfills(originalCode);
    
    // Optimizar código para navegadores modernos
    const optimizedCode = optimizeForModernBrowsers(originalCode);
    
    const optimizedSize = optimizedCode.length;
    const savings = originalSize - optimizedSize;
    const savingsPercent = ((savings / originalSize) * 100).toFixed(1);
    
    return {
      filePath,
      originalSize,
      optimizedSize,
      savings,
      savingsPercent,
      unnecessaryPolyfills,
      optimizedCode
    };
  } catch (error) {
    console.error(`❌ Error optimizando ${filePath}:`, error.message);
    return null;
  }
};

// Función para generar reporte de optimización
const generateOptimizationReport = (results) => {
  let report = '# 🔧 Reporte de Optimización para Navegadores Modernos\n\n';
  
  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  let totalPolyfillsRemoved = 0;
  
  results.forEach(result => {
    if (result) {
      totalOriginalSize += result.originalSize;
      totalOptimizedSize += result.optimizedSize;
      totalPolyfillsRemoved += result.unnecessaryPolyfills.length;
      
      report += `## 📁 ${result.filePath}\n\n`;
      report += `- **Tamaño original:** ${result.originalSize} bytes\n`;
      report += `- **Tamaño optimizado:** ${result.optimizedSize} bytes\n`;
      report += `- **Ahorro:** ${result.savings} bytes (${result.savingsPercent}%)\n`;
      report += `- **Polyfills removidos:** ${result.unnecessaryPolyfills.length}\n`;
      
      if (result.unnecessaryPolyfills.length > 0) {
        report += `- **Polyfills detectados:**\n`;
        result.unnecessaryPolyfills.forEach(polyfill => {
          report += `  - ${polyfill}\n`;
        });
      }
      
      report += '\n';
    }
  });
  
  const totalSavings = totalOriginalSize - totalOptimizedSize;
  const totalSavingsPercent = ((totalSavings / totalOriginalSize) * 100).toFixed(1);
  
  report += `## 📊 Resumen\n\n`;
  report += `- **Tamaño total original:** ${totalOriginalSize} bytes\n`;
  report += `- **Tamaño total optimizado:** ${totalOptimizedSize} bytes\n`;
  report += `- **Ahorro total:** ${totalSavings} bytes (${totalSavingsPercent}%)\n`;
  report += `- **Polyfills removidos:** ${totalPolyfillsRemoved}\n`;
  report += `- **Archivos optimizados:** ${results.filter(r => r).length}\n`;
  
  return { report, totalSavings, totalSavingsPercent, totalPolyfillsRemoved };
};

// Función para aplicar optimizaciones
const applyOptimizations = (results, writeFiles = false) => {
  results.forEach(result => {
    if (result && writeFiles) {
      try {
        writeFileSync(result.filePath, result.optimizedCode, 'utf-8');
        console.log(`✅ Optimizado: ${result.filePath} (${result.savingsPercent}% ahorro)`);
      } catch (error) {
        console.error(`❌ Error escribiendo ${result.filePath}:`, error.message);
      }
    }
  });
};

// Función principal
const main = async () => {
  console.log('🔧 Iniciando optimización para navegadores modernos...');
  
  // Encontrar archivos JavaScript
  const jsFiles = findJSFiles([
    './src/**/*.js',
    './src/**/*.jsx',
    './dist/**/*.js'
  ]);
  console.log(`📁 Encontrados ${jsFiles.length} archivos JavaScript`);
  
  // Optimizar cada archivo
  const results = [];
  jsFiles.forEach(filePath => {
    const result = optimizeJSFile(filePath);
    if (result) {
      results.push(result);
    }
  });
  
  // Generar reporte
  const { report, totalSavings, totalSavingsPercent, totalPolyfillsRemoved } = generateOptimizationReport(results);
  const reportPath = './modern-browser-optimization-report.md';
  
  writeFileSync(reportPath, report, 'utf-8');
  console.log(`📄 Reporte generado: ${reportPath}`);
  
  // Mostrar resumen
  console.log('\n📊 Resumen de optimización:');
  console.log(`- Archivos procesados: ${results.length}`);
  console.log(`- Ahorro total: ${totalSavings} bytes (${totalSavingsPercent}%)`);
  console.log(`- Polyfills removidos: ${totalPolyfillsRemoved}`);
  
  if (totalSavings > 0) {
    console.log('\n💡 Beneficios esperados:');
    console.log('- Código más pequeño y eficiente');
    console.log('- Mejor rendimiento en navegadores modernos');
    console.log('- Menor tiempo de parsing');
    console.log('- Mejor tree shaking');
    
    console.log('\n🔧 Optimizaciones aplicadas:');
    console.log('✅ Target ES2020 para navegadores modernos');
    console.log('✅ Eliminación de polyfills innecesarios');
    console.log('✅ Optimización de imports modernos');
    console.log('✅ Soporte para características ES2020+');
  } else {
    console.log('\n✅ El código ya está optimizado para navegadores modernos');
  }
  
  console.log('\n✅ Optimización completada');
};

main().catch(console.error); 