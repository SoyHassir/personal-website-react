import { useEffect } from 'react';
import { getAllSchemas, getBreadcrumbData } from '../../data/structuredData.js';

/**
 * Componente para inyectar Structured Data (JSON-LD) en el head
 * Mejora SEO y habilita Rich Snippets en Google
 */
const StructuredData = ({ currentSection = 'home' }) => {
  
  useEffect(() => {
    // Limpiar scripts existentes de structured data
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
    existingScripts.forEach(script => {
      if (script.dataset.structuredData === 'true') {
        script.remove();
      }
    });

    // Obtener todos los schemas
    const schemas = getAllSchemas();
    
    // Agregar breadcrumb específico para la sección actual
    const breadcrumbSchema = getBreadcrumbData(currentSection);
    
    // Combinar todos los schemas
    const allSchemas = [...schemas, breadcrumbSchema];

    // Inyectar cada schema como script individual
    allSchemas.forEach((schema, index) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.dataset.structuredData = 'true';
      script.dataset.schemaIndex = index;
      script.innerHTML = JSON.stringify(schema, null, 0); // Minified JSON
      document.head.appendChild(script);
    });

    // Log para desarrollo
    if (import.meta.env.DEV) {
      console.group('🔍 Structured Data Injected');
      console.log(`📊 Total schemas: ${allSchemas.length}`);
      console.log(`📍 Current section: ${currentSection}`);
      allSchemas.forEach((schema, index) => {
        console.log(`${index + 1}. ${schema['@type']} - ${schema.name || schema['@id']}`);
      });
      console.groupEnd();
    }

    // Cleanup function
    return () => {
      const scripts = document.querySelectorAll('script[data-structured-data="true"]');
      scripts.forEach(script => script.remove());
    };
  }, [currentSection]);

  // Este componente no renderiza nada visible
  return null;
};

export default StructuredData; 