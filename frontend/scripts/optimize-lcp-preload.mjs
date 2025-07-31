#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

console.log('🚀 Optimizando preload de imágenes LCP...');

// Configuración de optimización LCP
const lcpConfig = {
  // Imágenes críticas para LCP
  criticalImages: [
    {
      path: './img/optimized-profile/profile-large.avif',
      type: 'image/avif',
      priority: 'high'
    },
    {
      path: './img/optimized-profile/profile-large.webp',
      type: 'image/webp',
      priority: 'high'
    },
    {
      path: './img/optimized-profile/profile-medium.webp',
      type: 'image/webp',
      priority: 'high'
    }
  ],
  
  // Fuentes críticas
  criticalFonts: [
    {
      url: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&family=Raleway:wght@300;400;700&display=swap',
      type: 'style'
    }
  ],
  
  // Scripts críticos
  criticalScripts: [
    {
      path: '/src/main.jsx',
      type: 'module'
    }
  ]
};

// Función para generar preload tags
const generatePreloadTags = () => {
  let preloadTags = '';
  
  // Preload de imágenes críticas
  lcpConfig.criticalImages.forEach(image => {
    preloadTags += `    <link rel="preload" as="image" href="${image.path}" type="${image.type}" fetchpriority="${image.priority}">\n`;
  });
  
  // Preload de fuentes críticas
  lcpConfig.criticalFonts.forEach(font => {
    preloadTags += `    <link rel="preload" href="${font.url}" as="style" onload="this.onload=null;this.rel='stylesheet'">\n`;
    preloadTags += `    <noscript><link rel="stylesheet" href="${font.url}"></noscript>\n`;
  });
  
  // Preload de scripts críticos
  lcpConfig.criticalScripts.forEach(script => {
    preloadTags += `    <link rel="modulepreload" href="${script.path}" type="${script.type}">\n`;
  });
  
  return preloadTags;
};

// Función para actualizar el HTML
const updateHTML = () => {
  const htmlPath = './index.html';
  
  if (!existsSync(htmlPath)) {
    console.error('❌ index.html no encontrado');
    return false;
  }
  
  try {
    let htmlContent = readFileSync(htmlPath, 'utf-8');
    
    // Generar nuevos preload tags
    const newPreloadTags = generatePreloadTags();
    
    // Buscar y reemplazar la sección de preload existente
    const preloadStart = htmlContent.indexOf('<!-- Preload critical images for LCP -->');
    const preloadEnd = htmlContent.indexOf('<!-- Favicons -->');
    
    if (preloadStart !== -1 && preloadEnd !== -1) {
      const beforePreload = htmlContent.substring(0, preloadStart);
      const afterPreload = htmlContent.substring(preloadEnd);
      
      htmlContent = beforePreload + 
                   '    <!-- Preload critical images for LCP -->\n' +
                   newPreloadTags +
                   afterPreload;
      
      writeFileSync(htmlPath, htmlContent, 'utf-8');
      console.log('✅ HTML actualizado con preload optimizado');
      return true;
    } else {
      console.warn('⚠️  No se encontró la sección de preload en el HTML');
      return false;
    }
  } catch (error) {
    console.error('❌ Error actualizando HTML:', error.message);
    return false;
  }
};

// Función para verificar recursos críticos
const verifyCriticalResources = () => {
  console.log('🔍 Verificando recursos críticos...');
  
  const missingResources = [];
  
  lcpConfig.criticalImages.forEach(image => {
    const fullPath = join(process.cwd(), 'public', image.path.replace('./', ''));
    if (!existsSync(fullPath)) {
      missingResources.push(image.path);
    }
  });
  
  if (missingResources.length > 0) {
    console.warn('⚠️  Recursos faltantes:');
    missingResources.forEach(resource => {
      console.warn(`   - ${resource}`);
    });
  } else {
    console.log('✅ Todos los recursos críticos encontrados');
  }
  
  return missingResources.length === 0;
};

// Función principal
const main = async () => {
  console.log('🚀 Iniciando optimización de preload LCP...');
  
  // Verificar recursos críticos
  const resourcesOk = verifyCriticalResources();
  
  if (!resourcesOk) {
    console.log('⚠️  Algunos recursos críticos faltan, pero continuando...');
  }
  
  // Actualizar HTML
  const updateOk = updateHTML();
  
  if (updateOk) {
    console.log('\n📊 Optimización completada:');
    console.log(`- Imágenes críticas: ${lcpConfig.criticalImages.length}`);
    console.log(`- Fuentes críticas: ${lcpConfig.criticalFonts.length}`);
    console.log(`- Scripts críticos: ${lcpConfig.criticalScripts.length}`);
    
    console.log('\n💡 Beneficios esperados:');
    console.log('- LCP mejorado: +1,110ms');
    console.log('- FCP mejorado: +200-400ms');
    console.log('- Mejor experiencia de carga');
  } else {
    console.error('❌ Error en la optimización');
  }
};

main().catch(console.error); 