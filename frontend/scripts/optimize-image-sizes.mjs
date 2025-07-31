#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync, statSync } from 'fs';
import { join } from 'path';

console.log('📏 Optimizando tamaños de imágenes...');

// Configuración de optimización de imágenes
const imageOptimizationConfig = {
  // Configuración por componente
  components: {
    'Home': {
      targetSize: { width: 350, height: 350 },
      maxFileSize: 20, // KB
      preferredFormat: 'webp',
      fallbackFormat: 'avif'
    },
    'About': {
      targetSize: { width: 500, height: 500 },
      maxFileSize: 30, // KB
      preferredFormat: 'webp',
      fallbackFormat: 'avif'
    },
    'Contact': {
      targetSize: { width: 400, height: 400 },
      maxFileSize: 25, // KB
      preferredFormat: 'webp',
      fallbackFormat: 'avif'
    }
  },
  
  // Tamaños de imagen disponibles
  availableSizes: {
    'small': { width: 280, height: 280, fileSize: 12 }, // KB
    'medium': { width: 350, height: 350, fileSize: 14 }, // KB
    'large': { width: 440, height: 440, fileSize: 24 }  // KB
  },
  
  // Formatos disponibles
  formats: ['webp', 'avif']
};

// Función para analizar el uso de imágenes en componentes
const analyzeImageUsage = () => {
  const components = [
    './src/components/Home/Home.jsx',
    './src/components/About/About.jsx',
    './src/components/Contact/Contact.jsx'
  ];
  
  const usage = {};
  
  components.forEach(componentPath => {
    if (existsSync(componentPath)) {
      const content = readFileSync(componentPath, 'utf-8');
      const componentName = componentPath.split('/').pop().replace('.jsx', '');
      
      // Buscar atributos width y height
      const widthMatch = content.match(/width="(\d+)"/);
      const heightMatch = content.match(/height="(\d+)"/);
      
      if (widthMatch && heightMatch) {
        usage[componentName] = {
          width: parseInt(widthMatch[1]),
          height: parseInt(heightMatch[1]),
          path: componentPath
        };
      }
    }
  });
  
  return usage;
};

// Función para recomendar el tamaño óptimo
const recommendOptimalSize = (targetSize, availableSizes) => {
  const targetArea = targetSize.width * targetSize.height;
  
  // Encontrar el tamaño más cercano que sea suficiente
  let optimalSize = 'medium'; // default
  
  for (const [size, dimensions] of Object.entries(availableSizes)) {
    const sizeArea = dimensions.width * dimensions.height;
    if (sizeArea >= targetArea) {
      optimalSize = size;
      break;
    }
  }
  
  return optimalSize;
};

// Función para verificar tamaños de archivo
const checkFileSizes = () => {
  const imageDir = './public/img/optimized-profile';
  const sizes = {};
  
  if (existsSync(imageDir)) {
    const files = readdirSync(imageDir);
    
    files.forEach(file => {
      const filePath = join(imageDir, file);
      const stats = statSync(filePath);
      const sizeKB = Math.round(stats.size / 1024);
      
      // Extraer información del nombre del archivo
      const match = file.match(/profile-(\w+)\.(\w+)/);
      if (match) {
        const [, size, format] = match;
        if (!sizes[size]) sizes[size] = {};
        sizes[size][format] = sizeKB;
      }
    });
  }
  
  return sizes;
};

// Función para generar recomendaciones
const generateRecommendations = (usage, fileSizes) => {
  const recommendations = [];
  
  Object.entries(usage).forEach(([component, config]) => {
    const optimalSize = recommendOptimalSize(
      { width: config.width, height: config.height },
      imageOptimizationConfig.availableSizes
    );
    
    const currentFormats = fileSizes[optimalSize] || {};
    const webpSize = currentFormats.webp || 0;
    const avifSize = currentFormats.avif || 0;
    
    recommendations.push({
      component,
      targetSize: config,
      recommendedSize: optimalSize,
      currentSizes: currentFormats,
      savings: {
        webp: Math.max(0, webpSize - imageOptimizationConfig.components[component]?.maxFileSize || 20),
        avif: Math.max(0, avifSize - imageOptimizationConfig.components[component]?.maxFileSize || 20)
      }
    });
  });
  
  return recommendations;
};

// Función para generar reporte
const generateReport = (recommendations) => {
  let report = '# 📏 Reporte de Optimización de Tamaños de Imagen\n\n';
  
  let totalSavings = 0;
  
  recommendations.forEach(rec => {
    report += `## 📁 ${rec.component}\n\n`;
    report += `- **Tamaño objetivo:** ${rec.targetSize.width}x${rec.targetSize.height}px\n`;
    report += `- **Tamaño recomendado:** ${rec.recommendedSize}\n`;
    report += `- **Formatos actuales:**\n`;
    
    Object.entries(rec.currentSizes).forEach(([format, size]) => {
      report += `  - ${format.toUpperCase()}: ${size}KB\n`;
    });
    
    const savings = rec.savings.webp + rec.savings.avif;
    totalSavings += savings;
    
    if (savings > 0) {
      report += `- **Ahorro potencial:** ${savings}KB\n`;
    }
    
    report += '\n---\n\n';
  });
  
  report += `## 📊 Resumen\n\n`;
  report += `- **Ahorro total estimado:** ${totalSavings}KB\n`;
  report += `- **Componentes optimizados:** ${recommendations.length}\n`;
  
  return { report, totalSavings };
};

// Función principal
const main = async () => {
  console.log('📏 Iniciando análisis de tamaños de imagen...');
  
  // Analizar uso de imágenes
  const usage = analyzeImageUsage();
  console.log('✅ Análisis de uso completado');
  
  // Verificar tamaños de archivo
  const fileSizes = checkFileSizes();
  console.log('✅ Verificación de tamaños completada');
  
  // Generar recomendaciones
  const recommendations = generateRecommendations(usage, fileSizes);
  console.log('✅ Recomendaciones generadas');
  
  // Generar reporte
  const { report, totalSavings } = generateReport(recommendations);
  const reportPath = './image-size-optimization-report.md';
  
  writeFileSync(reportPath, report, 'utf-8');
  console.log(`📄 Reporte generado: ${reportPath}`);
  
  // Mostrar resumen
  console.log('\n📊 Resumen de optimización:');
  console.log(`- Componentes analizados: ${Object.keys(usage).length}`);
  console.log(`- Ahorro total estimado: ${totalSavings}KB`);
  
  if (totalSavings > 0) {
    console.log('\n💡 Recomendaciones:');
    console.log('1. Usar imágenes medium en lugar de large donde sea posible');
    console.log('2. Preferir WebP sobre AVIF para mejor compatibilidad');
    console.log('3. Implementar lazy loading para imágenes no críticas');
    console.log('4. Considerar compresión adicional para imágenes grandes');
  } else {
    console.log('\n✅ Las imágenes ya están optimizadas');
  }
  
  console.log('\n✅ Análisis completado');
};

main().catch(console.error); 