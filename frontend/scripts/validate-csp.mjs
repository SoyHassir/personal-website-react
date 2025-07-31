#!/usr/bin/env node

/**
 * Script de validación para CSP Headers
 * Verifica que los headers de seguridad estén configurados correctamente
 */

import { generateCSPHeader, validateCSP } from '../src/utils/cspConfig.js';
import fetch from 'node-fetch';

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

console.log(`${colors.cyan}${colors.bold}🛡️  Validación de CSP Headers${colors.reset}\n`);

/**
 * Valida configuración CSP generada
 */
function validateGeneratedCSP() {
  console.log(`${colors.blue}📋 Validando configuración CSP generada...${colors.reset}`);
  
  // Validar desarrollo
  const devCSP = generateCSPHeader(true);
  const devValidation = validateCSP(devCSP);
  
  console.log(`\n${colors.yellow}🛠️  Configuración de Desarrollo:${colors.reset}`);
  console.log(`CSP: ${devCSP.substring(0, 100)}...`);
  
  if (devValidation.isValid) {
    console.log(`${colors.green}✅ Configuración de desarrollo válida${colors.reset}`);
  } else {
    console.log(`${colors.red}❌ Problemas en desarrollo:${colors.reset}`);
    devValidation.issues.forEach(issue => console.log(`   - ${issue}`));
  }

  // Validar producción
  const prodCSP = generateCSPHeader(false);
  const prodValidation = validateCSP(prodCSP);
  
  console.log(`\n${colors.yellow}🚀 Configuración de Producción:${colors.reset}`);
  console.log(`CSP: ${prodCSP.substring(0, 100)}...`);
  
  if (prodValidation.isValid) {
    console.log(`${colors.green}✅ Configuración de producción válida${colors.reset}`);
  } else {
    console.log(`${colors.red}❌ Problemas en producción:${colors.reset}`);
    prodValidation.issues.forEach(issue => console.log(`   - ${issue}`));
  }

  return { devValidation, prodValidation };
}

/**
 * Prueba headers en servidor local
 */
async function testLocalServer(port = 5173) {
  console.log(`\n${colors.blue}🌐 Probando servidor local en puerto ${port}...${colors.reset}`);
  
  try {
    const response = await fetch(`http://localhost:${port}`, {
      method: 'HEAD',
      timeout: 5000
    });

    const headers = response.headers;
    
    // Verificar headers de seguridad
    const securityHeaders = [
      'content-security-policy',
      'x-frame-options',
      'x-content-type-options',
      'x-xss-protection',
      'referrer-policy'
    ];

    console.log(`\n${colors.magenta}🔍 Headers de seguridad encontrados:${colors.reset}`);
    
    securityHeaders.forEach(header => {
      const value = headers.get(header);
      if (value) {
        console.log(`${colors.green}✅ ${header}:${colors.reset} ${value.substring(0, 80)}${value.length > 80 ? '...' : ''}`);
      } else {
        console.log(`${colors.red}❌ ${header}: No encontrado${colors.reset}`);
      }
    });

    return true;
  } catch (error) {
    console.log(`${colors.red}❌ Error conectando al servidor local:${colors.reset} ${error.message}`);
    console.log(`${colors.yellow}💡 Asegúrate de que el servidor esté ejecutándose con: npm run dev${colors.reset}`);
    return false;
  }
}

/**
 * Analiza dominios permitidos
 */
function analyzeAllowedDomains() {
  console.log(`\n${colors.blue}🌍 Analizando dominios permitidos...${colors.reset}`);
  
  const devCSP = generateCSPHeader(true);
  const prodCSP = generateCSPHeader(false);
  
  // Extraer dominios únicos
  const devDomains = new Set();
  const prodDomains = new Set();
  
  const domainRegex = /https?:\/\/([^\/\s]+)/g;
  
  let match;
  while ((match = domainRegex.exec(devCSP)) !== null) {
    devDomains.add(match[1]);
  }
  
  while ((match = domainRegex.exec(prodCSP)) !== null) {
    prodDomains.add(match[1]);
  }

  console.log(`\n${colors.magenta}🛠️  Dominios en desarrollo (${devDomains.size}):${colors.reset}`);
  [...devDomains].sort().forEach(domain => {
    console.log(`   • ${domain}`);
  });

  console.log(`\n${colors.magenta}🚀 Dominios en producción (${prodDomains.size}):${colors.reset}`);
  [...prodDomains].sort().forEach(domain => {
    console.log(`   • ${domain}`);
  });

  // Mostrar diferencias
  const devOnly = [...devDomains].filter(d => !prodDomains.has(d));
  const prodOnly = [...prodDomains].filter(d => !devDomains.has(d));

  if (devOnly.length > 0) {
    console.log(`\n${colors.yellow}⚠️  Solo en desarrollo:${colors.reset}`);
    devOnly.forEach(domain => console.log(`   • ${domain}`));
  }

  if (prodOnly.length > 0) {
    console.log(`\n${colors.yellow}⚠️  Solo en producción:${colors.reset}`);
    prodOnly.forEach(domain => console.log(`   • ${domain}`));
  }
}

/**
 * Genera reporte de seguridad
 */
function generateSecurityReport(validations) {
  console.log(`\n${colors.blue}📊 Reporte de Seguridad${colors.reset}`);
  console.log(`${'='.repeat(50)}`);
  
  const { devValidation, prodValidation } = validations;
  
  console.log(`${colors.bold}Configuración de Desarrollo:${colors.reset}`);
  console.log(`  • Directivas: ${devValidation.directives}`);
  console.log(`  • Estado: ${devValidation.isValid ? `${colors.green}✅ Válido${colors.reset}` : `${colors.red}❌ Con problemas${colors.reset}`}`);
  console.log(`  • Problemas: ${devValidation.issues.length}`);

  console.log(`\n${colors.bold}Configuración de Producción:${colors.reset}`);
  console.log(`  • Directivas: ${prodValidation.directives}`);
  console.log(`  • Estado: ${prodValidation.isValid ? `${colors.green}✅ Válido${colors.reset}` : `${colors.red}❌ Con problemas${colors.reset}`}`);
  console.log(`  • Problemas: ${prodValidation.issues.length}`);

  console.log(`\n${colors.bold}Puntuación de Seguridad:${colors.reset}`);
  const score = calculateSecurityScore(devValidation, prodValidation);
  const scoreColor = score >= 90 ? colors.green : score >= 70 ? colors.yellow : colors.red;
  console.log(`  • ${scoreColor}${score}/100${colors.reset}`);

  console.log(`\n${colors.bold}Recomendaciones:${colors.reset}`);
  generateRecommendations(devValidation, prodValidation);
}

/**
 * Calcula puntuación de seguridad
 */
function calculateSecurityScore(devValidation, prodValidation) {
  let score = 100;
  
  // Penalizar problemas
  score -= devValidation.issues.length * 5;
  score -= prodValidation.issues.length * 10;
  
  // Bonus por configuración válida
  if (prodValidation.isValid) score += 10;
  if (devValidation.isValid) score += 5;
  
  return Math.max(0, Math.min(100, score));
}

/**
 * Genera recomendaciones de seguridad
 */
function generateRecommendations(devValidation, prodValidation) {
  const recommendations = [];
  
  if (!prodValidation.isValid) {
    recommendations.push("Revisar y corregir problemas en configuración de producción");
  }
  
  if (devValidation.issues.includes("Uso de 'unsafe-eval' detectado - riesgo de seguridad")) {
    recommendations.push("Considerar alternativas a 'unsafe-eval' en desarrollo");
  }
  
  if (prodValidation.issues.length === 0 && devValidation.issues.length === 0) {
    recommendations.push("✅ Configuración óptima - mantener monitoreo continuo");
  }
  
  recommendations.push("Probar con herramientas online: csp-evaluator.withgoogle.com");
  recommendations.push("Configurar CSP reporting para monitoreo en producción");
  
  recommendations.forEach((rec, index) => {
    console.log(`  ${index + 1}. ${rec}`);
  });
}

/**
 * Función principal
 */
async function main() {
  try {
    // Validar configuración generada
    const validations = validateGeneratedCSP();
    
    // Analizar dominios
    analyzeAllowedDomains();
    
    // Probar servidor local (opcional)
    await testLocalServer();
    
    // Generar reporte final
    generateSecurityReport(validations);
    
    console.log(`\n${colors.green}${colors.bold}🎉 Validación completada${colors.reset}`);
    console.log(`${colors.cyan}📖 Documentación: docs/csp-implementation.md${colors.reset}`);
    
  } catch (error) {
    console.error(`${colors.red}❌ Error durante la validación:${colors.reset}`, error.message);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
} 