// Manager Toolkit - Archivo de índice principal
// Este archivo facilita las importaciones desde otros componentes

// Exportar componentes
export { default as AIAdvisor } from './components/AIAdvisor.jsx';
export { default as ManagerToolkitCard } from './components/ManagerToolkitCard.jsx';
export { default as ManagerToolkitModal } from './components/ManagerToolkitModal.jsx';
export { default as SwotMatrix } from './components/SwotMatrix.jsx';

// Exportar datos
export { toolkitIndex, categoryDataMap } from './data/managerToolkitData.js';

// Exportar utilidades
export { default as ToolkitConfig, getConfig, updateConfig } from './utils/managerToolkitConfig.js';
export { initializeApp, measurePerformance } from './utils/managerToolkitLogic.js';

// Exportar estilos (para importación directa si es necesario)
export const styles = {
  main: './styles/managerToolkit.css',
  modal: './styles/ManagerToolkitModal.css',
  swot: './styles/SwotMatrix.css'
}; 