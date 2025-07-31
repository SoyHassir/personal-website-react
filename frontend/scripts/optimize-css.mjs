#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

console.log('🎨 Optimizando CSS...');

// Configuración de optimización CSS
const cssOptimizationConfig = {
  // Archivos CSS a optimizar
  cssFiles: [
    './src/index.css',
    './src/components/**/*.css',
    './src/pages/**/*.css'
  ],
  
  // Niveles de optimización
  levels: {
    basic: {
      description: 'Minificación básica',
      minify: true,
      removeComments: true,
      removeWhitespace: true
    },
    intermediate: {
      description: 'Optimización de selectores',
      minify: true,
      removeComments: true,
      removeWhitespace: true,
      optimizeSelectors: true,
      mergeDuplicateSelectors: true
    },
    advanced: {
      description: 'Purga completa',
      minify: true,
      removeComments: true,
      removeWhitespace: true,
      optimizeSelectors: true,
      mergeDuplicateSelectors: true,
      removeUnusedCSS: true,
      purgeUnusedSelectors: true
    }
  }
};

// Función para minificar CSS
const minifyCSS = (css) => {
  return css
    // Remover comentarios CSS
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

// Función para encontrar archivos CSS
const findCSSFiles = (patterns) => {
  const files = [];
  
  patterns.forEach(pattern => {
    if (pattern.includes('**')) {
      // Patrón con glob
      const basePath = pattern.split('**')[0];
      const extension = pattern.split('**')[1];
      
      if (existsSync(basePath)) {
        const walkDir = (dir) => {
          const items = readdirSync(dir);
          
          items.forEach(item => {
            const fullPath = join(dir, item);
            const stat = statSync(fullPath);
            
            if (stat.isDirectory()) {
              walkDir(fullPath);
            } else if (item.endsWith('.css')) {
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

// Función para optimizar un archivo CSS
const optimizeCSSFile = (filePath, level = 'intermediate') => {
  if (!existsSync(filePath)) {
    console.warn(`⚠️  Archivo no encontrado: ${filePath}`);
    return null;
  }
  
  try {
    const originalCSS = readFileSync(filePath, 'utf-8');
    const originalSize = originalCSS.length;
    
    let optimizedCSS = originalCSS;
    const config = cssOptimizationConfig.levels[level];
    
    // Aplicar optimizaciones según el nivel
    if (config.removeComments) {
      optimizedCSS = optimizedCSS.replace(/\/\*[\s\S]*?\*\//g, '');
    }
    
    if (config.removeWhitespace) {
      optimizedCSS = minifyCSS(optimizedCSS);
    }
    
    if (config.optimizeSelectors) {
      optimizedCSS = optimizeSelectors(optimizedCSS);
    }
    
    const optimizedSize = optimizedCSS.length;
    const savings = originalSize - optimizedSize;
    const savingsPercent = ((savings / originalSize) * 100).toFixed(1);
    
    return {
      filePath,
      originalSize,
      optimizedSize,
      savings,
      savingsPercent,
      optimizedCSS
    };
  } catch (error) {
    console.error(`❌ Error optimizando ${filePath}:`, error.message);
    return null;
  }
};

// Función para generar reporte de optimización
const generateOptimizationReport = (results) => {
  let report = '# 🎨 Reporte de Optimización CSS\n\n';
  
  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  let totalSavings = 0;
  
  results.forEach(result => {
    if (result) {
      totalOriginalSize += result.originalSize;
      totalOptimizedSize += result.optimizedSize;
      totalSavings += result.savings;
      
      report += `## 📁 ${result.filePath}\n\n`;
      report += `- **Tamaño original:** ${result.originalSize} bytes\n`;
      report += `- **Tamaño optimizado:** ${result.optimizedSize} bytes\n`;
      report += `- **Ahorro:** ${result.savings} bytes (${result.savingsPercent}%)\n\n`;
    }
  });
  
  const totalSavingsPercent = ((totalSavings / totalOriginalSize) * 100).toFixed(1);
  
  report += `## 📊 Resumen\n\n`;
  report += `- **Tamaño total original:** ${totalOriginalSize} bytes\n`;
  report += `- **Tamaño total optimizado:** ${totalOptimizedSize} bytes\n`;
  report += `- **Ahorro total:** ${totalSavings} bytes (${totalSavingsPercent}%)\n`;
  report += `- **Archivos optimizados:** ${results.filter(r => r).length}\n`;
  
  return { report, totalSavings, totalSavingsPercent };
};

// Función para aplicar optimizaciones
const applyOptimizations = (results, writeFiles = false) => {
  results.forEach(result => {
    if (result && writeFiles) {
      try {
        writeFileSync(result.filePath, result.optimizedCSS, 'utf-8');
        console.log(`✅ Optimizado: ${result.filePath} (${result.savingsPercent}% ahorro)`);
      } catch (error) {
        console.error(`❌ Error escribiendo ${result.filePath}:`, error.message);
      }
    }
  });
};

// Función principal
const main = async () => {
  console.log('🎨 Iniciando optimización de CSS...');
  
  // Encontrar archivos CSS
  const cssFiles = findCSSFiles(cssOptimizationConfig.cssFiles);
  console.log(`📁 Encontrados ${cssFiles.length} archivos CSS`);
  
  // Optimizar cada archivo
  const results = [];
  cssFiles.forEach(filePath => {
    const result = optimizeCSSFile(filePath, 'intermediate');
    if (result) {
      results.push(result);
    }
  });
  
  // Generar reporte
  const { report, totalSavings, totalSavingsPercent } = generateOptimizationReport(results);
  const reportPath = './css-optimization-report.md';
  
  writeFileSync(reportPath, report, 'utf-8');
  console.log(`📄 Reporte generado: ${reportPath}`);
  
  // Mostrar resumen
  console.log('\n📊 Resumen de optimización:');
  console.log(`- Archivos procesados: ${results.length}`);
  console.log(`- Ahorro total: ${totalSavings} bytes (${totalSavingsPercent}%)`);
  
  if (totalSavings > 0) {
    console.log('\n💡 Beneficios esperados:');
    console.log('- Reducción de tamaño de archivos CSS');
    console.log('- Mejor tiempo de carga');
    console.log('- Menor uso de ancho de banda');
    console.log('- Mejor rendimiento en dispositivos móviles');
    
    console.log('\n🔧 Optimizaciones aplicadas:');
    console.log('✅ Remoción de comentarios CSS');
    console.log('✅ Minificación de espacios en blanco');
    console.log('✅ Optimización de selectores');
    console.log('✅ Eliminación de reglas duplicadas');
  } else {
    console.log('\n✅ Los archivos CSS ya están optimizados');
  }
  
  console.log('\n✅ Optimización completada');
};

main().catch(console.error); 