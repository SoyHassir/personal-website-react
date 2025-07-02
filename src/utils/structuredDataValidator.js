/**
 * Validador de Structured Data para desarrollo
 * Ayuda a verificar que los schemas JSON-LD sean válidos
 */

/**
 * Valida un schema individual
 */
export const validateSchema = (schema) => {
  const errors = [];
  const warnings = [];

  // Validaciones básicas requeridas
  if (!schema['@context']) {
    errors.push('Missing @context');
  }
  
  if (!schema['@type']) {
    errors.push('Missing @type');
  }

  // Validaciones específicas por tipo
  switch (schema['@type']) {
    case 'Person':
      if (!schema.name) errors.push('Person: Missing name');
      if (!schema.url) warnings.push('Person: Missing url');
      if (!schema.image) warnings.push('Person: Missing image');
      break;
      
    case 'Organization':
    case ['Organization', 'ProfessionalService']:
      if (!schema.name) errors.push('Organization: Missing name');
      if (!schema.url) errors.push('Organization: Missing url');
      if (!schema.logo) warnings.push('Organization: Missing logo');
      break;
      
    case 'Service':
      if (!schema.name) errors.push('Service: Missing name');
      if (!schema.description) errors.push('Service: Missing description');
      if (!schema.provider) warnings.push('Service: Missing provider');
      break;
      
    case 'WebSite':
      if (!schema.name) errors.push('WebSite: Missing name');
      if (!schema.url) errors.push('WebSite: Missing url');
      break;
  }

  return { errors, warnings, isValid: errors.length === 0 };
};

/**
 * Valida todos los schemas en la página
 */
export const validateAllSchemas = () => {
  if (import.meta.env.PROD) {
    return { message: 'Schema validation only available in development' };
  }

  const scripts = document.querySelectorAll('script[type="application/ld+json"]');
  const results = [];
  let totalErrors = 0;
  let totalWarnings = 0;

  scripts.forEach((script, index) => {
    try {
      const schema = JSON.parse(script.innerHTML);
      const validation = validateSchema(schema);
      
      results.push({
        index: index + 1,
        type: schema['@type'],
        name: schema.name || schema['@id'] || 'Unnamed',
        ...validation
      });

      totalErrors += validation.errors.length;
      totalWarnings += validation.warnings.length;

    } catch (error) {
      results.push({
        index: index + 1,
        type: 'Invalid JSON',
        name: 'Parse Error',
        errors: [`JSON Parse Error: ${error.message}`],
        warnings: [],
        isValid: false
      });
      totalErrors++;
    }
  });

  return {
    totalSchemas: scripts.length,
    totalErrors,
    totalWarnings,
    results,
    isAllValid: totalErrors === 0
  };
};

/**
 * Log detallado de validación en consola
 */
export const logValidationReport = () => {
  const report = validateAllSchemas();
  
  if (import.meta.env.PROD) {
    return;
  }

  console.group('🔍 Structured Data Validation Report');
  console.log(`📊 Total Schemas: ${report.totalSchemas}`);
  console.log(`❌ Total Errors: ${report.totalErrors}`);
  console.log(`⚠️ Total Warnings: ${report.totalWarnings}`);
  console.log(`✅ All Valid: ${report.isAllValid ? 'Yes' : 'No'}`);
  
  if (report.results) {
    report.results.forEach(result => {
      const icon = result.isValid ? '✅' : '❌';
      console.group(`${icon} ${result.index}. ${result.type} - ${result.name}`);
      
      if (result.errors.length > 0) {
        console.error('Errors:', result.errors);
      }
      
      if (result.warnings.length > 0) {
        console.warn('Warnings:', result.warnings);
      }
      
      if (result.isValid && result.errors.length === 0 && result.warnings.length === 0) {
        console.log('✨ Perfect!');
      }
      
      console.groupEnd();
    });
  }
  
  console.groupEnd();
  
  return report;
};

/**
 * URLs útiles para testing
 */
export const TESTING_URLS = {
  googleStructuredDataTesting: 'https://search.google.com/test/rich-results',
  schemaOrgValidator: 'https://validator.schema.org/',
  googleRichResultsTest: 'https://search.google.com/test/rich-results',
  yandexStructuredDataValidator: 'https://webmaster.yandex.com/tools/microformat/'
};

/**
 * Genera reporte para testing externo
 */
export const generateTestingReport = () => {
  const report = validateAllSchemas();
  
  return {
    ...report,
    testingInstructions: `
📋 Testing Instructions:

1. 🔗 Test with Google Rich Results:
   ${TESTING_URLS.googleRichResultsTest}
   
2. 🔗 Validate with Schema.org:
   ${TESTING_URLS.schemaOrgValidator}
   
3. 🔗 Test with Yandex:
   ${TESTING_URLS.yandexStructuredDataValidator}

📝 Tips:
- Copy the JSON-LD from DevTools → Elements → <head>
- Test each schema individually
- Check for Rich Snippet previews
- Verify mobile compatibility
    `
  };
};

// Auto-ejecutar validación en desarrollo
if (import.meta.env.DEV) {
  // Ejecutar validación después de que se cargue el DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(logValidationReport, 2000);
    });
  } else {
    setTimeout(logValidationReport, 2000);
  }
} 