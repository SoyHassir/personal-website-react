# 📁 Estructura de Componentes

Esta carpeta contiene todos los componentes React organizados de manera modular y escalable.

## 🏗️ Estructura General

```
components/
├── About/                    # Sección "Sobre mí"
│   ├── About.jsx
│   ├── About.css
│   ├── __tests__/           # Tests del componente
│   └── assets/              # Imágenes, iconos específicos
│
├── BackToTop/               # Botón "Volver arriba"
│   ├── BackToTop.jsx
│   ├── __tests__/
│   └── assets/
│
├── Contact/                 # Sección de contacto
│   ├── Contact.jsx
│   ├── Contact.css
│   ├── __tests__/
│   └── assets/
│
├── Footer/                  # Pie de página
│   ├── Footer.jsx
│   ├── Footer.css
│   ├── __tests__/
│   └── assets/
│
├── Header/                  # Navegación principal
│   ├── Header.jsx
│   ├── Header.css
│   ├── __tests__/
│   └── assets/
│
├── Home/                    # Página de inicio
│   ├── Home.jsx
│   ├── Home.css
│   ├── __tests__/
│   └── assets/
│
├── LanguageSelector/         # Selector de idioma
│   ├── LanguageSelector.jsx
│   ├── LanguageSelector.css
│   ├── __tests__/
│   └── assets/
│
├── Layout/                  # Layout principal
│   ├── Layout.jsx
│   ├── __tests__/
│   └── assets/
│
├── LoadingFallback/         # Componente de carga
│   ├── LoadingFallback.jsx
│   ├── LoadingFallback.css
│   ├── __tests__/
│   └── assets/
│
├── ManagerToolkit/          # 🎯 Feature complejo modularizado
│   ├── components/          # Subcomponentes específicos
│   │   ├── AIAdvisor.jsx
│   │   ├── ManagerToolkitCard.jsx
│   │   ├── ManagerToolkitModal.jsx
│   │   └── SwotMatrix.jsx
│   ├── data/               # Datos de las herramientas
│   │   ├── managerToolkitData.js
│   │   └── [archivos por categoría]
│   ├── styles/             # Estilos específicos
│   │   ├── managerToolkit.css
│   │   ├── ManagerToolkitModal.css
│   │   └── SwotMatrix.css
│   ├── utils/              # Lógica y configuración
│   │   ├── managerToolkitConfig.js
│   │   └── managerToolkitLogic.js
│   ├── __tests__/          # Tests del feature
│   ├── assets/             # Assets específicos
│   ├── index.js            # Archivo de índice
│   └── README.md           # Documentación específica
│
├── Services/               # Sección de servicios
│   ├── Services.jsx
│   ├── ServiceCard.jsx
│   ├── Services.css
│   ├── __tests__/
│   └── assets/
│
├── SkipNavigation/         # Navegación por teclado
│   ├── SkipNavigation.jsx
│   ├── SkipNavigation.css
│   ├── __tests__/
│   └── assets/
│
├── StructuredData/         # Datos estructurados SEO
│   ├── StructuredData.jsx
│   ├── __tests__/
│   └── assets/
│
├── ThemeToggle/            # Toggle de tema
│   ├── ThemeToggle.jsx
│   ├── __tests__/
│   └── assets/
│
└── WebVitalsMonitor/      # Monitor de métricas web
    ├── WebVitalsMonitor.jsx
    ├── WebVitalsMonitor.css
    ├── __tests__/
    └── assets/
```

## 🎯 Convenciones de Nomenclatura

### **Archivos**
- **Componentes**: PascalCase (ej: `About.jsx`)
- **Estilos**: PascalCase o camelCase (ej: `About.css`)
- **Tests**: `ComponentName.test.js` o `ComponentName.spec.js`
- **Assets**: kebab-case (ej: `hero-image.webp`)

### **Carpetas**
- **Componentes**: PascalCase (ej: `About/`)
- **Tests**: `__tests__/` (convención Jest)
- **Assets**: `assets/` (minúsculas)

## 📋 Reglas de Organización

### **1. Estructura por Componente**
Cada componente tiene su propia carpeta con:
- Archivo principal del componente (`.jsx`)
- Estilos específicos (`.css`)
- Tests (`__tests__/`)
- Assets locales (`assets/`)

### **2. Feature Complejo: ManagerToolkit**
El `ManagerToolkit` es un ejemplo de feature complejo que requiere:
- **Subcomponentes** en `components/`
- **Datos** en `data/`
- **Estilos** en `styles/`
- **Lógica** en `utils/`
- **Documentación** con `README.md`

### **3. Componentes Simples**
Componentes pequeños como `ThemeToggle` solo necesitan:
- Archivo principal (`.jsx`)
- Carpeta `__tests__/` (para futuros tests)
- Carpeta `assets/` (para assets específicos)

## 🚀 Beneficios de esta Estructura

### **Escalabilidad**
- Fácil agregar nuevos componentes
- Estructura preparada para features complejos
- Separación clara de responsabilidades

### **Mantenibilidad**
- Archivos relacionados están juntos
- Fácil localización de código
- Tests organizados por componente

### **Reutilización**
- Componentes aislados y modulares
- Assets específicos por componente
- Lógica separada de presentación

### **Colaboración**
- Estructura intuitiva para nuevos desarrolladores
- Convenciones claras y consistentes
- Documentación integrada

## 🔧 Próximos Pasos

### **Tests**
- Crear tests unitarios en cada `__tests__/`
- Usar Jest + React Testing Library
- Mantener cobertura de código alta

### **Assets**
- Mover imágenes específicas a `assets/`
- Optimizar imágenes para web
- Usar formatos modernos (WebP, AVIF)

### **Documentación**
- Agregar JSDoc a componentes
- Crear Storybook para componentes reutilizables
- Documentar props y eventos

## 📊 Estadísticas

- **Total de componentes**: 15
- **Features complejos**: 1 (ManagerToolkit)
- **Componentes con estilos**: 8
- **Componentes simples**: 7
- **Carpetas de tests**: 15 (preparadas)
- **Carpetas de assets**: 15 (preparadas)

---

*Esta estructura sigue las mejores prácticas de React y está diseñada para proyectos escalables y mantenibles.* 