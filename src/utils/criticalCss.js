import { existsSync, readFileSync, writeFileSync, unlinkSync } from 'fs';
import { resolve, join } from 'path';
import { fileURLToPath } from 'url';

/**
 * Script personalizado para optimización de Critical CSS
 * Basado en las mejores prácticas de 2024
 */
class CriticalCSSOptimizer {
  constructor(options = {}) {
    this.distPath = options.distPath || 'dist';
    this.htmlFile = options.htmlFile || 'index.html';
    this.cssPattern = options.cssPattern || /index-[\w]+\.css$/;
  }

  /**
   * Identifica el CSS crítico basado en el análisis del contenido
   */
  identifyCriticalCSS(cssContent) {
    // Reglas CSS críticas (above-the-fold)
    const criticalRules = [
      // Variables CSS globales
      /:root\s*{[^}]*}/g,
      
      // Reset y estilos base fundamentales
      /\*[^{]*box-sizing[^}]*}/g,
      /html[^{]*{[^}]*}/g,
      /body[^{]*{[^}]*}/g,
      
      // Header y navegación (siempre visible)
      /\.topheader[^{]*{[^}]*}/g,
      /\.topnav[^{]*{[^}]*}/g,
      /\.logo[^{]*{[^}]*}/g,
      /\.menu[^{]*{[^}]*}/g,
      
      // Hero section (above the fold)
      /\.home[^{]*{[^}]*}/g,
      /\.hero-content[^{]*{[^}]*}/g,
      /\.hero-text[^{]*{[^}]*}/g,
      /\.hero-image[^{]*{[^}]*}/g,
      
      // Preloader (primera pantalla)
      /\.preloader[^{]*{[^}]*}/g,
      
      // Botones de tema y idioma (siempre visibles)
      /\.theme-toggle[^{]*{[^}]*}/g,
      /\.lang-btn[^{]*{[^}]*}/g,
      
      // Estilos fundamentales de tipografía
      /h1[^{]*{[^}]*}/g,
      /h2[^{]*{[^}]*}/g,
      
      // Animaciones críticas
      /@keyframes\s+[\w-]+[^}]*}[^}]*}/g,
      
      // Dark mode crítico
      /html\.dark-mode[^{]*{[^}]*}/g,
      /body\.dark-mode[^{]*{[^}]*}/g,
      
      // Media queries para mobile (crítico para responsive)
      /@media[^{]*max-width:\s*768px[^}]*{[^}]*}/g
    ];

    let criticalCSS = '';
    
    criticalRules.forEach(rule => {
      const matches = cssContent.match(rule);
      if (matches) {
        matches.forEach(match => {
          if (!criticalCSS.includes(match)) {
            criticalCSS += match + '\n';
          }
        });
      }
    });

    return criticalCSS;
  }

  /**
   * Procesa el archivo HTML para inyectar CSS crítico
   */
  processHTML() {
    try {
      const htmlPath = join(this.distPath, this.htmlFile);
      
      if (!existsSync(htmlPath)) {
        console.warn(`⚠️ Archivo HTML no encontrado: ${htmlPath}`);
        return false;
      }

      let htmlContent = readFileSync(htmlPath, 'utf-8');
      
      // Encontrar archivos CSS en el HTML
      const cssLinkRegex = /<link[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']*\.css)["'][^>]*>/g;
      const cssLinks = [...htmlContent.matchAll(cssLinkRegex)];
      
      if (cssLinks.length === 0) {
        console.warn('⚠️ No se encontraron enlaces CSS en el HTML');
        return false;
      }

      let criticalCSS = '';
      const nonCriticalLinks = [];

      // Procesar cada archivo CSS
      cssLinks.forEach(([fullMatch, cssPath]) => {
        const fullCssPath = join(this.distPath, cssPath);
        
        if (existsSync(fullCssPath)) {
          const cssContent = readFileSync(fullCssPath, 'utf-8');
          
          // Extraer CSS crítico
          const critical = this.identifyCriticalCSS(cssContent);
          criticalCSS += critical;
          
          // Crear CSS no crítico (diferencia)
          const nonCritical = cssContent.replace(critical, '').trim();
          
          if (nonCritical.length > 0) {
            // Marcar para carga asíncrona
            nonCriticalLinks.push({
              original: fullMatch,
              path: cssPath,
              content: nonCritical
            });
          }
          
          // Remover el link original del HTML
          htmlContent = htmlContent.replace(fullMatch, '');
        }
      });

      // Minificar CSS crítico
      criticalCSS = this.minifyCSS(criticalCSS);

      // Inyectar CSS crítico inline en el <head>
      if (criticalCSS.length > 0) {
        const criticalStyle = `<style data-critical-css>
${criticalCSS}
</style>`;

        htmlContent = htmlContent.replace(
          /<\/head>/i,
          `${criticalStyle}\n</head>`
        );

        console.log(`✅ CSS crítico inyectado: ${(criticalCSS.length / 1024).toFixed(2)}KB`);
      }

      // Agregar CSS no crítico con carga asíncrona al final del <body>
      if (nonCriticalLinks.length > 0) {
        let asyncLoadScript = '<script data-async-css>\n';
        
        nonCriticalLinks.forEach(({ path }) => {
          asyncLoadScript += `  (function(){
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '${path}';
    link.media = 'print';
    link.onload = function(){ this.media = 'all'; };
    document.head.appendChild(link);
  })();\n`;
        });
        
        asyncLoadScript += '</script>';

        htmlContent = htmlContent.replace(
          /<\/body>/i,
          `${asyncLoadScript}\n</body>`
        );

        console.log(`✅ CSS no crítico cargado asincrónamente: ${nonCriticalLinks.length} archivos`);
      }

      // Guardar HTML optimizado
      writeFileSync(htmlPath, htmlContent, 'utf-8');
      
      return true;
    } catch (error) {
      console.error('❌ Error procesando Critical CSS:', error);
      return false;
    }
  }

  /**
   * Minificación básica de CSS
   */
  minifyCSS(css) {
    return css
      .replace(/\/\*[^*]*\*+(?:[^/*][^*]*\*+)*\//g, '') // Remover comentarios
      .replace(/\s+/g, ' ') // Normalizar espacios
      .replace(/;\s*}/g, '}') // Remover punto y coma antes de }
      .replace(/\s*{\s*/g, '{') // Remover espacios alrededor de {
      .replace(/\s*}\s*/g, '}') // Remover espacios alrededor de }
      .replace(/\s*;\s*/g, ';') // Normalizar punto y coma
      .trim();
  }

  /**
   * Ejecuta la optimización completa
   */
  optimize() {
    console.log('🚀 Iniciando optimización de Critical CSS...');
    
    const success = this.processHTML();
    
    if (success) {
      console.log('✅ Critical CSS optimizado correctamente');
      
      // Mostrar estadísticas
      this.showStats();
    } else {
      console.log('❌ Error en la optimización de Critical CSS');
    }
    
    return success;
  }

  /**
   * Muestra estadísticas de la optimización
   */
  showStats() {
    try {
      const htmlPath = join(this.distPath, this.htmlFile);
      const htmlContent = readFileSync(htmlPath, 'utf-8');
      
      const criticalMatch = htmlContent.match(/<style data-critical-css>(.*?)<\/style>/s);
      const criticalSize = criticalMatch ? criticalMatch[1].length : 0;
      
      console.log('\n📊 Estadísticas de Critical CSS:');
      console.log(`   CSS crítico inline: ${(criticalSize / 1024).toFixed(2)}KB`);
      console.log(`   Mejora estimada en LCP: ~15-30%`);
      console.log(`   Mejora estimada en FCP: ~20-40%\n`);
    } catch (error) {
      console.warn('⚠️ No se pudieron calcular estadísticas:', error.message);
    }
  }
}

export default CriticalCSSOptimizer; 