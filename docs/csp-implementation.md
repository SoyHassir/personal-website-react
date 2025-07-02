# 🛡️ Content Security Policy (CSP) Implementation

## 📋 Resumen

Esta implementación de **Content Security Policy** protege el sitio web contra:
- **Cross-Site Scripting (XSS)**
- **Data injection attacks**
- **Clickjacking**
- **Mixed content vulnerabilities**

## 🔧 Arquitectura

### Archivos de configuración:
- `src/utils/cspConfig.js` - Configuración de políticas CSP
- `src/utils/viteCSPPlugin.js` - Plugin de Vite para aplicar headers
- `vite.config.js` - Integración del plugin

## 📐 Configuración por Ambiente

### 🛠️ Desarrollo
```javascript
// Más permisivo para permitir HMR y desarrollo
'script-src': [
  "'self'",
  "'unsafe-inline'",     // Necesario para Vite
  "'unsafe-eval'",       // Necesario para HMR
  'localhost:*',
  'https://www.googletagmanager.com'
]
```

### 🚀 Producción
```javascript
// Configuración estricta para máxima seguridad
'script-src': [
  "'self'",
  'https://www.googletagmanager.com',
  'https://www.google-analytics.com'
]
```

## 🌐 Recursos Externos Permitidos

### ✅ Google Fonts
- `fonts.googleapis.com` - CSS de fuentes
- `fonts.gstatic.com` - Archivos de fuentes

### ✅ Analytics
- `www.googletagmanager.com` - Google Tag Manager
- `www.google-analytics.com` - Google Analytics

### ✅ Formularios
- `formspree.io` - Servicio de formularios de contacto

### ✅ Imágenes
- `'self'` - Imágenes del dominio
- `data:` - Data URIs para iconos
- `hassirlastre.com` - Dominio principal

## 🚫 Restricciones de Seguridad

### Scripts
- ❌ `eval()` en producción
- ❌ Scripts inline sin hash en producción
- ❌ Scripts de dominios no autorizados

### Frames
- ❌ Iframes completamente bloqueados (`'none'`)
- ❌ Clickjacking prevention

### Objects
- ❌ Flash, Java, otros plugins (`'none'`)

## 🔍 Headers de Seguridad Adicionales

```javascript
'X-Frame-Options': 'DENY',                    // Anti-clickjacking
'X-Content-Type-Options': 'nosniff',          // Anti-MIME sniffing
'X-XSS-Protection': '1; mode=block',          // XSS protection
'Referrer-Policy': 'strict-origin-when-cross-origin',
'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
```

## 🛠️ Uso y Comandos

### Desarrollo
```bash
npm run dev
# CSP headers se aplican automáticamente con configuración permisiva
```

### Build de Producción
```bash
npm run build
# Genera archivo _security-headers.txt con configuración para servidores
```

### Validación
```javascript
import { validateCSP } from './src/utils/viteCSPPlugin.js';

const validation = validateCSP(cspString);
console.log(validation.isValid ? '✅ CSP válido' : '❌ Problemas encontrados');
```

## 📊 Configuración para Servidores

### Nginx
```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self' https://www.googletagmanager.com;" always;
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
```

### Apache
```apache
Header always set Content-Security-Policy "default-src 'self'; script-src 'self' https://www.googletagmanager.com;"
Header always set X-Frame-Options "DENY"
Header always set X-Content-Type-Options "nosniff"
```

### Cloudflare Workers
```javascript
response.headers.set('Content-Security-Policy', 'default-src \'self\'; script-src \'self\' https://www.googletagmanager.com;');
response.headers.set('X-Frame-Options', 'DENY');
```

## 🧪 Testing y Validación

### Herramientas de Testing
- [CSP Evaluator](https://csp-evaluator.withgoogle.com/)
- [Observatory by Mozilla](https://observatory.mozilla.org/)
- [Security Headers](https://securityheaders.com/)

### Verificación en Consola del Navegador
```javascript
// Verificar que CSP está activo
console.log(document.querySelector('meta[http-equiv="Content-Security-Policy"]'));

// Ver violations (si las hay)
document.addEventListener('securitypolicyviolation', (e) => {
  console.warn('CSP Violation:', e.violatedDirective, e.blockedURI);
});
```

## 🔄 Mantenimiento

### Agregar Nuevos Dominios
1. Editar `src/utils/cspConfig.js`
2. Agregar dominio a la directiva apropiada
3. Probar en desarrollo
4. Deploy a producción

### Debugging CSP Issues
1. Revisar consola del navegador
2. Verificar CSP violations
3. Usar CSP report-only mode si es necesario
4. Ajustar configuración gradualmente

## 🚀 Beneficios de Seguridad

### Protección XSS
- Bloquea inyección de scripts maliciosos
- Previene ejecución de código no autorizado

### Protección Data Injection
- Controla fuentes de recursos
- Previene carga de contenido malicioso

### Protección Clickjacking
- Bloquea embedding en iframes
- Previene ataques de UI redressing

### Compliance
- Cumple estándares de seguridad web
- Mejora puntuación en auditorías de seguridad

---

**Implementado el**: ${new Date().toLocaleDateString('es-ES')}
**Versión**: 1.0.0
**Compatibilidad**: Todos los navegadores modernos 