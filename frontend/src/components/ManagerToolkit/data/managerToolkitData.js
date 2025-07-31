import analisisDatos from './analisis-datos-pronosticos.js';
import descubrimientoCliente from './descubrimiento-cliente.js';
import disenoMejoraProcesos from './diseno-mejora-procesos.js';
import estrategiaPlaneacion from './estrategia-planeacion.js';
import finanzasEvaluacion from './finanzas-evaluacion.js';
import gestionProyectosRiesgos from './gestion-proyectos-riesgos.js';
import gestionTalentoCultura from './gestion-talento-cultura.js';
import ideacionValidacion from './ideacion-validacion.js';
import tecnologiaInfraestructura from './tecnologia-infraestructura.js';

// Índice de categorías (puedes editarlo si cambian los nombres)
export const toolkitIndex = {
  totalTools: 94,
  categories: [
    { fileName: 'estrategia-planeacion', originalCategory: 'Estrategia y Planeación' },
    { fileName: 'finanzas-evaluacion', originalCategory: 'Finanzas y Evaluación Económica' },
    { fileName: 'gestion-proyectos-riesgos', originalCategory: 'Gestión de Proyectos y Riesgos' },
    { fileName: 'descubrimiento-cliente', originalCategory: 'Descubrimiento y Comprensión del Cliente' },
    { fileName: 'analisis-datos-pronosticos', originalCategory: 'Análisis de Datos y Pronósticos' },
    { fileName: 'diseno-mejora-procesos', originalCategory: 'Diseño y Mejora de Procesos' },
    { fileName: 'ideacion-validacion', originalCategory: 'Ideación y Validación de Soluciones' },
    { fileName: 'gestion-talento-cultura', originalCategory: 'Gestión del Talento y Cultura Organizacional' },
    { fileName: 'tecnologia-infraestructura', originalCategory: 'Tecnología e Infraestructura Digital' },
  ]
};

// Mapa de datos por categoría
export const categoryDataMap = {
  'Estrategia y Planeación': estrategiaPlaneacion,
  'Finanzas y Evaluación Económica': finanzasEvaluacion,
  'Gestión de Proyectos y Riesgos': gestionProyectosRiesgos,
  'Descubrimiento y Comprensión del Cliente': descubrimientoCliente,
  'Análisis de Datos y Pronósticos': analisisDatos,
  'Diseño y Mejora de Procesos': disenoMejoraProcesos,
  'Ideación y Validación de Soluciones': ideacionValidacion,
  'Gestión del Talento y Cultura Organizacional': gestionTalentoCultura,
  'Tecnología e Infraestructura Digital': tecnologiaInfraestructura,
}; 