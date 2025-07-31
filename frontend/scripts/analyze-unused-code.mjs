#!/usr/bin/env node

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

console.log('🔍 Analizando código JavaScript no utilizado...');

// Configuración de análisis
const analysisConfig = {
  // Archivos a analizar
  entryPoints: [
    './src/main.jsx',
    './src/App.jsx'
  ],
  
  // Dependencias conocidas que pueden tener código no utilizado
  knownUnused: [
    'react-router-dom',
    'react-helmet-async',
    '@fortawesome/fontawesome-svg-core',
    '@fortawesome/free-solid-svg-icons',
    '@fortawesome/free-brands-svg-icons',
    'web-vitals',
    'typed.js',
    'mermaid',
    'react-mermaid2'
  ],
  
  // Patrones de código que indican uso
  usagePatterns: [
    /import.*from/,
    /require\(/,
    /use[A-Z]/,
    /<[A-Z][a-zA-Z]*/,
    /\.jsx?$/,
    /\.tsx?$/
  ]
};

// Función para analizar un archivo
const analyzeFile = (filePath) => {
  if (!existsSync(filePath)) {
    console.warn(`⚠️  Archivo no encontrado: ${filePath}`);
    return { unused: [], used: [] };
  }
  
  try {
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    
    const imports = [];
    const exports = [];
    const usage = [];
    
    lines.forEach((line, index) => {
      // Detectar imports
      if (line.includes('import')) {
        imports.push({ line: line.trim(), lineNumber: index + 1 });
      }
      
      // Detectar exports
      if (line.includes('export')) {
        exports.push({ line: line.trim(), lineNumber: index + 1 });
      }
      
      // Detectar uso de componentes/funciones
      analysisConfig.usagePatterns.forEach(pattern => {
        if (pattern.test(line)) {
          usage.push({ line: line.trim(), lineNumber: index + 1 });
        }
      });
    });
    
    return { imports, exports, usage };
  } catch (error) {
    console.error(`❌ Error analizando ${filePath}:`, error.message);
    return { imports: [], exports: [], usage: [] };
  }
};

// Función para generar reporte
const generateReport = (analysisResults) => {
  let report = '# 📊 Reporte de Código No Utilizado\n\n';
  
  analysisResults.forEach(({ file, imports, exports, usage }) => {
    report += `## 📁 ${file}\n\n`;
    
    report += `### 📥 Imports (${imports.length})\n`;
    imports.forEach(imp => {
      report += `- Línea ${imp.lineNumber}: ${imp.line}\n`;
    });
    
    report += `\n### 📤 Exports (${exports.length})\n`;
    exports.forEach(exp => {
      report += `- Línea ${exp.lineNumber}: ${exp.line}\n`;
    });
    
    report += `\n### 🔍 Uso Detectado (${usage.length})\n`;
    usage.forEach(use => {
      report += `- Línea ${use.lineNumber}: ${use.line}\n`;
    });
    
    report += '\n---\n\n';
  });
  
  return report;
};

// Función principal
const main = async () => {
  console.log('🔍 Iniciando análisis de código no utilizado...');
  
  const analysisResults = [];
  
  // Analizar archivos principales
  for (const entryPoint of analysisConfig.entryPoints) {
    console.log(`📁 Analizando: ${entryPoint}`);
    const result = analyzeFile(entryPoint);
    analysisResults.push({
      file: entryPoint,
      ...result
    });
  }
  
  // Generar reporte
  const report = generateReport(analysisResults);
  const reportPath = './unused-code-report.md';
  
  writeFileSync(reportPath, report, 'utf-8');
  console.log(`📄 Reporte generado: ${reportPath}`);
  
  // Estadísticas
  const totalImports = analysisResults.reduce((sum, r) => sum + r.imports.length, 0);
  const totalExports = analysisResults.reduce((sum, r) => sum + r.exports.length, 0);
  const totalUsage = analysisResults.reduce((sum, r) => sum + r.usage.length, 0);
  
  console.log('\n📊 Estadísticas:');
  console.log(`- Imports detectados: ${totalImports}`);
  console.log(`- Exports detectados: ${totalExports}`);
  console.log(`- Usos detectados: ${totalUsage}`);
  
  // Recomendaciones
  console.log('\n💡 Recomendaciones:');
  console.log('1. Revisar imports no utilizados');
  console.log('2. Implementar lazy loading para componentes grandes');
  console.log('3. Usar tree shaking más agresivo');
  console.log('4. Considerar code splitting por rutas');
  
  console.log('\n✅ Análisis completado');
};

main().catch(console.error); 