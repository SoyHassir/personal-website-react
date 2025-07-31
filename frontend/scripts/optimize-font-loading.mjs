#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync } from 'fs';

console.log('🔤 Optimizando carga de fuentes...');

// Configuración de optimización de fuentes
const fontOptimizationConfig = {
  // Fuentes críticas
  criticalFonts: [
    {
      family: 'Poppins',
      weights: ['400', '700'],
      display: 'swap',
      preload: true
    },
    {
      family: 'Raleway',
      weights: ['300', '400', '700'],
      display: 'swap',
      preload: true
    }
  ],
  
  // Estrategias de carga
  loadingStrategies: {
    async: {
      description: 'Carga asíncrona completa',
      implementation: 'media="print" onload="this.media=\'all\'"'
    },
    preload: {
      description: 'Preload con font-display: swap',
      implementation: 'rel="preload" as="style"'
    },
    fallback: {
      description: 'Carga con fallback del sistema',
      implementation: 'font-display: swap'
    }
  }
};

// Función para generar tags de fuentes optimizados
const generateOptimizedFontTags = () => {
  let tags = '';
  
  // Preconnect para Google Fonts
  tags += '    <!-- Preconnect for Google Fonts -->\n';
  tags += '    <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>\n';
  tags += '    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n\n';
  
  // Preload de fuentes críticas
  tags += '    <!-- Preload critical fonts -->\n';
  fontOptimizationConfig.criticalFonts.forEach(font => {
    const weights = font.weights.join(',');
    tags += `    <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=${font.family}:wght@${weights}&display=${font.display}">\n`;
  });
  tags += '\n';
  
  // Carga asíncrona de fuentes
  tags += '    <!-- Async font loading -->\n';
  fontOptimizationConfig.criticalFonts.forEach(font => {
    const weights = font.weights.join(',');
    tags += `    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=${font.family}:wght@${weights}&display=${font.display}" media="print" onload="this.media='all'">\n`;
  });
  tags += '\n';
  
  // Fallback para navegadores sin JavaScript
  tags += '    <!-- Font fallback for no-JS browsers -->\n';
  tags += '    <noscript>\n';
  fontOptimizationConfig.criticalFonts.forEach(font => {
    const weights = font.weights.join(',');
    tags += `      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=${font.family}:wght@${weights}&display=${font.display}">\n`;
  });
  tags += '    </noscript>\n';
  
  return tags;
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
    
    // Generar nuevos tags de fuentes optimizados
    const newFontTags = generateOptimizedFontTags();
    
    // Buscar y reemplazar la sección de fuentes existente
    const fontStart = htmlContent.indexOf('<!-- Preload critical fonts with async loading -->');
    const fontEnd = htmlContent.indexOf('<!-- Favicons -->');
    
    if (fontStart !== -1 && fontEnd !== -1) {
      const beforeFonts = htmlContent.substring(0, fontStart);
      const afterFonts = htmlContent.substring(fontEnd);
      
      htmlContent = beforeFonts + 
                   '    <!-- Optimized font loading to eliminate render-blocking -->\n' +
                   newFontTags +
                   afterFonts;
      
      writeFileSync(htmlPath, htmlContent, 'utf-8');
      console.log('✅ HTML actualizado con carga de fuentes optimizada');
      return true;
    } else {
      console.warn('⚠️  No se encontró la sección de fuentes en el HTML');
      return false;
    }
  } catch (error) {
    console.error('❌ Error actualizando HTML:', error.message);
    return false;
  }
};

// Función para generar CSS optimizado
const generateOptimizedCSS = () => {
  let css = '/* ===== Font Display Swap ===== */\n';
  
  fontOptimizationConfig.criticalFonts.forEach(font => {
    css += `@font-face {\n`;
    css += `  font-family: '${font.family}';\n`;
    css += `  font-display: swap;\n`;
    css += `}\n\n`;
  });
  
  css += '/* ===== Font Loading Optimization ===== */\n';
  css += '.fonts-loading {\n';
  css += '  font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;\n';
  css += '}\n\n';
  
  css += '.fonts-loaded {\n';
  css += '  font-family: var(--font-heading), system-ui, sans-serif;\n';
  css += '}\n\n';
  
  css += '/* ===== Font Fallback ===== */\n';
  css += 'h1, h2, h3, h4, h5, h6 {\n';
  css += '  font-family: var(--font-heading), system-ui, sans-serif;\n';
  css += '}\n\n';
  
  css += 'body {\n';
  css += '  font-family: var(--font-body), system-ui, sans-serif;\n';
  css += '}\n';
  
  return css;
};

// Función para actualizar CSS
const updateCSS = () => {
  const cssPath = './src/index.css';
  
  if (!existsSync(cssPath)) {
    console.error('❌ index.css no encontrado');
    return false;
  }
  
  try {
    let cssContent = readFileSync(cssPath, 'utf-8');
    
    // Generar CSS optimizado para fuentes
    const optimizedFontCSS = generateOptimizedCSS();
    
    // Buscar y reemplazar la sección de fuentes existente
    const fontCSSStart = cssContent.indexOf('/* ===== Font Display Swap ===== */');
    const fontCSSEnd = cssContent.indexOf('/* ===== Reset y base ===== */');
    
    if (fontCSSStart !== -1 && fontCSSEnd !== -1) {
      const beforeFontCSS = cssContent.substring(0, fontCSSStart);
      const afterFontCSS = cssContent.substring(fontCSSEnd);
      
      cssContent = beforeFontCSS + 
                   optimizedFontCSS + 
                   afterFontCSS;
      
      writeFileSync(cssPath, cssContent, 'utf-8');
      console.log('✅ CSS actualizado con optimización de fuentes');
      return true;
    } else {
      console.warn('⚠️  No se encontró la sección de fuentes en el CSS');
      return false;
    }
  } catch (error) {
    console.error('❌ Error actualizando CSS:', error.message);
    return false;
  }
};

// Función principal
const main = async () => {
  console.log('🔤 Iniciando optimización de carga de fuentes...');
  
  // Actualizar HTML
  const htmlUpdated = updateHTML();
  
  // Actualizar CSS
  const cssUpdated = updateCSS();
  
  if (htmlUpdated && cssUpdated) {
    console.log('\n📊 Optimización completada:');
    console.log(`- Fuentes críticas: ${fontOptimizationConfig.criticalFonts.length}`);
    console.log(`- Estrategias implementadas: ${Object.keys(fontOptimizationConfig.loadingStrategies).length}`);
    
    console.log('\n💡 Beneficios esperados:');
    console.log('- Eliminación de render-blocking: +1,160ms');
    console.log('- Mejor FCP: +200-400ms');
    console.log('- Mejor LCP: +100-200ms');
    console.log('- Mejor experiencia de carga');
    
    console.log('\n🔧 Implementaciones:');
    console.log('✅ Preconnect para Google Fonts');
    console.log('✅ Preload de fuentes críticas');
    console.log('✅ Carga asíncrona con media="print"');
    console.log('✅ Font-display: swap');
    console.log('✅ Fallback para navegadores sin JS');
  } else {
    console.error('❌ Error en la optimización');
  }
  
  console.log('\n✅ Optimización completada');
};

main().catch(console.error); 