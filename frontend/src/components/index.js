// 📁 Components Index
// Este archivo facilita las importaciones desde otros módulos

// ===== Páginas Principales =====
export { default as Home } from './Home/Home.jsx';
export { default as About } from './About/About.jsx';
export { default as Contact } from './Contact/Contact.jsx';
export { default as Services } from './Services/Services.jsx';

// ===== Layout y Navegación =====
export { default as Layout } from './Layout/Layout.jsx';
export { default as Header } from './Header/Header.jsx';
export { default as Footer } from './Footer/Footer.jsx';
export { default as SkipNavigation } from './SkipNavigation/SkipNavigation.jsx';

// ===== Componentes de UI =====
export { default as ThemeToggle } from './ThemeToggle/ThemeToggle.jsx';
export { default as LanguageSelector } from './LanguageSelector/LanguageSelector.jsx';
export { default as LoadingFallback } from './LoadingFallback/LoadingFallback.jsx';

// ===== Componentes de Servicios =====
export { default as ServiceCard } from './Services/ServiceCard.jsx';

// ===== SEO y Analytics =====
export { default as StructuredData } from './StructuredData/StructuredData.jsx';
export { default as WebVitalsMonitor } from './WebVitalsMonitor/WebVitalsMonitor.jsx';

// ===== Manager Toolkit (Feature Complejo) =====
export { 
  AIAdvisor, 
  ManagerToolkitCard, 
  ManagerToolkitModal 
} from './ManagerToolkit/index.js';

// ===== Datos del Manager Toolkit =====
export { 
  toolkitIndex, 
  categoryDataMap 
} from './ManagerToolkit/data/managerToolkitData.js';

// ===== Utilidades del Manager Toolkit =====
export { 
  ToolkitConfig, 
  getConfig, 
  updateConfig 
} from './ManagerToolkit/utils/managerToolkitConfig.js';
export { 
  initializeApp, 
  measurePerformance 
} from './ManagerToolkit/utils/managerToolkitLogic.js';

// ===== Estilos (para importación directa si es necesario) =====
export const styles = {
  // Componentes principales
  home: './Home/Home.css',
  about: './About/About.css',
  contact: './Contact/Contact.css',
  services: './Services/Services.css',
  
  // Layout y navegación
  header: './Header/Header.css',
  footer: './Footer/Footer.css',
  skipNavigation: './SkipNavigation/SkipNavigation.css',
  
  // UI Components
  themeToggle: './ThemeToggle/ThemeToggle.css',
  languageSelector: './LanguageSelector/LanguageSelector.css',
  loadingFallback: './LoadingFallback/LoadingFallback.css',
  
  // Manager Toolkit
  managerToolkit: './ManagerToolkit/styles/managerToolkit.css',
  managerToolkitModal: './ManagerToolkit/styles/ManagerToolkitModal.css',
  swotMatrix: './ManagerToolkit/styles/SwotMatrix.css',
  
  // Otros
  webVitalsMonitor: './WebVitalsMonitor/WebVitalsMonitor.css'
};

// ===== Grupos de Componentes =====
export const layoutComponents = {
  Layout,
  Header,
  Footer,
  SkipNavigation
};

export const uiComponents = {
  ThemeToggle,
  LanguageSelector,
  LoadingFallback
};

export const pageComponents = {
  Home,
  About,
  Contact,
  Services
};

export const featureComponents = {
  // Manager Toolkit
  AIAdvisor,
  ManagerToolkitCard,
  ManagerToolkitModal,
  
  // Services
  ServiceCard
};

export const utilityComponents = {
  StructuredData,
  WebVitalsMonitor
}; 