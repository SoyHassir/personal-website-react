# Manager Toolkit - Estructura del Proyecto

## 📁 Estructura de Carpetas

```
ManagerToolkit/
├── components/           # Componentes React
│   ├── AIAdvisor.jsx
│   ├── ManagerToolkitCard.jsx
│   ├── ManagerToolkitModal.jsx
├── data/                # Datos de las herramientas
│   ├── analisis-datos-pronosticos.js
│   ├── descubrimiento-cliente.js
│   ├── diseno-mejora-procesos.js
│   ├── estrategia-planeacion.js
│   ├── finanzas-evaluacion.js
│   ├── gestion-proyectos-riesgos.js
│   ├── gestion-talento-cultura.js
│   ├── ideacion-validacion.js
│   ├── managerToolkitData.js
│   └── tecnologia-infraestructura.js
├── styles/              # Archivos CSS
│   ├── managerToolkit.css
│   ├── ManagerToolkitModal.css
├── utils/               # Lógica y configuración
│   ├── managerToolkitConfig.js
│   └── managerToolkitLogic.js
└── README.md
```

## 🎯 Organización por Categorías

### **components/**
Contiene todos los componentes React reutilizables:
- **AIAdvisor.jsx**: Componente del asesor de IA
- **ManagerToolkitCard.jsx**: Tarjeta individual de herramienta
- **ManagerToolkitModal.jsx**: Modal de detalles de herramienta

### **data/**
Contiene todos los datos de las herramientas organizados por categorías:
- **managerToolkitData.js**: Archivo principal que exporta el índice y mapa de datos
- Archivos de datos por categoría (ej: estrategia-planeacion.js, finanzas-evaluacion.js, etc.)

### **styles/**
Contiene todos los archivos CSS:
- **managerToolkit.css**: Estilos principales del toolkit
- **ManagerToolkitModal.css**: Estilos específicos del modal

### **utils/**
Contiene la lógica de negocio y configuración:
- **managerToolkitConfig.js**: Configuración del toolkit
- **managerToolkitLogic.js**: Lógica principal y funciones auxiliares

## 🔄 Flujo de Datos

1. **ManagerToolkitPage.jsx** (ubicado en `pages/`) importa datos desde `data/managerToolkitData.js`
2. Los componentes en `components/` se importan desde la página principal
3. Los estilos se importan desde `styles/`
4. La lógica se maneja desde `utils/`

## 📝 Convenciones de Nomenclatura

- **Componentes**: PascalCase (ej: ManagerToolkitCard.jsx)
- **Datos**: kebab-case (ej: estrategia-planeacion.js)
- **Estilos**: camelCase o kebab-case (ej: managerToolkit.css)
- **Utilidades**: camelCase (ej: managerToolkitConfig.js)

## 🚀 Beneficios de esta Estructura

1. **Separación de Responsabilidades**: Cada carpeta tiene un propósito específico
2. **Mantenibilidad**: Fácil localización de archivos
3. **Escalabilidad**: Estructura preparada para crecimiento
4. **Reutilización**: Componentes y utilidades bien organizados
5. **Claridad**: Estructura intuitiva para nuevos desarrolladores

## 🔧 Importaciones Actualizadas

Todas las importaciones han sido actualizadas para reflejar la nueva estructura:

```javascript
// Ejemplo de importación desde la página principal (pages/ManagerToolkitPage.jsx)
import { toolkitIndex, categoryDataMap } from '../components/ManagerToolkit/data/managerToolkitData.js';
import ManagerToolkitCard from '../components/ManagerToolkit/components/ManagerToolkitCard.jsx';
import '../components/ManagerToolkit/styles/managerToolkit.css';
```

## 📊 Estadísticas del Proyecto

- **Total de herramientas**: 94
- **Categorías**: 9
- **Componentes React**: 4
- **Archivos de datos**: 10
- **Archivos CSS**: 3
- **Archivos de utilidades**: 2 