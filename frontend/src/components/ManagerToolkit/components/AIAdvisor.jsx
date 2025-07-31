import React, { useState } from 'react';

// Configuración para entorno de desarrollo/producción
const USE_GEMINI_PROXY = true; // true = proxy (seguro para producción), false = API directa (solo para pruebas locales)
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

// Agregar función para llamar a la API de Gemini
async function callGeminiAPI(prompt) {
  // Detectar si estamos en modo preview local
  // const isLocalPreview = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  // Funcionalidad de IA habilitada en desarrollo - comentado para testing local
  // if (isLocalPreview) {
  //   // En preview local, mostrar mensaje informativo en lugar de hacer la llamada
  //   return `<p class='text-blue-600'><strong>🛠️ Modo Preview Local:</strong> La funcionalidad de IA está desactivada en el preview local para evitar errores de CORS. Esta función estará disponible en la versión desplegada.</p>`;
  // }
  
  // Usar siempre el proxy de producción para consistencia
  const apiUrl = import.meta.env.VITE_GEMINI_PROXY_URL || 'https://gemini-proxy-368279970472.southamerica-west1.run.app/api/gemini';
  
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    if (!response.ok) throw new Error(`Error de red: ${response.statusText}`);
    const result = await response.json();
    if (result.text) return result.text;
    throw new Error("Respuesta inválida del proxy de Gemini.");
  } catch (error) {
    console.error('Error en callGeminiAPI:', error);
    return `<p class='text-red-600'>Lo sentimos, ocurrió un error al contactar al Asesor de IA. Por favor, intente de nuevo más tarde.</p>`;
  }
}

// Función para limpiar y estandarizar el formato de la respuesta de la IA
function limpiarMarkdown(texto) {
  // Solo limpieza básica: remover markdown y caracteres extraños
  let limpio = texto.replace(/```html\n?|```\n?/g, '');
  limpio = limpio.replace(/^[\s\u200B\u200C\u200D\uFEFF]*/, '');
  limpio = limpio.replace(/^["""'']*/, '');
  
  // Limpiar markdown específico
  limpio = limpio.replace(/^##\s*/g, ''); // Remover ## al inicio
  limpio = limpio.replace(/\*\*/g, ''); // Remover **
  limpio = limpio.replace(/\*(\s*)/g, '$1'); // Remover * al inicio de líneas
  limpio = limpio.replace(/(\s*)\*$/g, '$1'); // Remover * al final de líneas
  
  // Formatear SOLO el título principal para que esté centrado y más grande
  limpio = limpio.replace(/TÍTULO PRINCIPAL\s*\n\s*Guía para la Implementación de\s*([^P]+?)(?=Paso\s*1:)/s, 
    '<h4 class="titulo-principal">TÍTULO PRINCIPAL</h4><p>Guía para la Implementación de $1</p>');
  
  // Si ya viene con formato HTML, solo limpiar
  if (limpio.includes('<h4>') || limpio.includes('<p>')) {
    return limpio;
  }
  
  // Si no viene con HTML, aplicar formato simple
  // Formatear títulos de pasos
  limpio = limpio.replace(/Paso\s*(\d+):\s*([^D]+?)Descripción:\s*/gi, '<h4>Paso $1: $2</h4><p>');
  
  // También manejar casos donde no hay "Descripción:"
  limpio = limpio.replace(/Paso\s*(\d+):\s*([^K]+?)(?=KPI:)/gi, '<h4>Paso $1: $2</h4><p>');
  
  // Formatear elementos KPI, Obstáculo, Solución
  limpio = limpio.replace(/KPI:\s*/gi, '</p><p><strong>KPI:</strong> ');
  limpio = limpio.replace(/Obstáculo:\s*/gi, '</p><p><strong>Obstáculo:</strong> ');
  limpio = limpio.replace(/Solución:\s*/gi, '</p><p><strong>Solución:</strong> ');
  
  // Cerrar párrafos abiertos
  limpio = limpio.replace(/(<strong>Solución:.*?)(<h4|$)/g, '$1</p>$2');
  
  // Limpiar espacios extra
  limpio = limpio.replace(/\s+/g, ' ');
  limpio = limpio.replace(/>\s+</g, '><');
  
  return limpio;
}

const AIAdvisor = ({ tool }) => {
  // Estado para pasos de acción
  const [stepsLoading, setStepsLoading] = useState(false);
  const [stepsOutput, setStepsOutput] = useState('');

  // Estado para caso de estudio
  const [industry, setIndustry] = useState('');
  const [caseLoading, setCaseLoading] = useState(false);
  const [caseOutput, setCaseOutput] = useState('');

  // Nueva función: Generar pasos de acción usando la API real
  const handleGenerateSteps = async () => {
    setStepsLoading(true);
    setStepsOutput('');
    const articulo = tool.gender || "la";
    const prompt = `Como consultor en estrategia con 10 años de experiencia implementando la metodología ${articulo} ${tool.title} en empresas de diferentes sectores, elabora una guía paso a paso.

Contexto: ${tool.definition}

Elabora una guía práctica con esta estructura EXACTA:

TÍTULO PRINCIPAL
Guía para la Implementación de ${articulo} ${tool.title}

Paso 1: [Título del primer paso]
Descripción: [Descripción del proceso]
KPI: [Indicador específico y medible]
Obstáculo: [Principal dificultad]
Solución: [Solución práctica]

Paso 2: [Título del segundo paso]
Descripción: [Descripción del proceso]
KPI: [Indicador específico y medible]
Obstáculo: [Principal dificultad]
Solución: [Solución práctica]

Paso 3: [Título del tercer paso]
Descripción: [Descripción del proceso]
KPI: [Indicador específico y medible]
Obstáculo: [Principal dificultad]
Solución: [Solución práctica]

[Continuar con Pasos 4 y 5 si es necesario, manteniendo el mismo formato]

IMPORTANTE:
- Usa EXACTAMENTE esta estructura
- Genera entre 3 y 5 pasos según la complejidad de la herramienta
- Cada elemento en línea separada
- NO uses markdown, NO uses asteriscos
- Limita cada descripción a 2-3 líneas máximo
- Responde en español sin saludo inicial
- La respuesta debe estar en formato HTML con un título <h4> y párrafos <p> para todas las descripciones, KPIs, obstáculos y soluciones
- Cada paso debe tener TODOS los elementos: Descripción, KPI, Obstáculo, Solución`;
    const result = await callGeminiAPI(prompt);
    setStepsOutput(limpiarMarkdown(result));
    setStepsLoading(false);
  };

  // Nueva función: Generar caso de estudio usando la API real
  const handleGenerateCase = async (e) => {
    e.preventDefault();
    if (!industry.trim()) return;
    setCaseLoading(true);
    setCaseOutput('');
    const articulo = tool.gender || "la";
    const prompt = `Escribe un caso de estudio breve y convincente (aproximadamente 150-200 palabras) sobre cómo una empresa ficticia en la industria de '${industry}' aplicó exitosamente ${articulo} ${tool.title}. 

Contexto de la herramienta: ${tool.definition}

El caso de estudio debe describir:
1. El problema inicial que enfrentaba la empresa
2. Por qué eligieron ${articulo} ${tool.title} específicamente
3. El proceso de implementación y los resultados obtenidos
4. Las lecciones aprendidas y recomendaciones

La respuesta debe estar en español y en formato HTML con un título <h4> y párrafos <p>.`;
    const result = await callGeminiAPI(prompt);
    setCaseOutput(limpiarMarkdown(result));
    setCaseLoading(false);
  };

  return (
    <div className="ai-advisor">
      <div className="ai-card ai-card-left">
        <div className="ai-card-header">
          <span className="ai-card-title">Guía de Implementación</span>
        </div>
        <p className="ai-card-desc">Pídele a la IA que genere los pasos para aplicar esta herramienta en una empresa.</p>
        <button
          className="gemini-button"
          onClick={handleGenerateSteps}
          disabled={stepsLoading}
          aria-describedby="steps-description"
        >
          {stepsLoading ? 'Generando...' : 'Generar Guía ✨'}
        </button>
        <div id="steps-description" className="sr-only">Botón para generar pasos de acción usando inteligencia artificial</div>
        <div className="ai-output" aria-live="polite">
          {stepsOutput && <div dangerouslySetInnerHTML={{ __html: stepsOutput }} />}
        </div>
      </div>
      <div className="ai-card ai-card-left">
        <div className="ai-card-header">
          <span className="ai-card-title">Generar Caso</span>
        </div>
        <p className="ai-card-desc">Escribe un sector (ej. salud, financiero, educativo) para generar un caso de estudio ficticio.</p>
        <form className="input-group" onSubmit={handleGenerateCase} autoComplete="off">
          <label htmlFor="industry-input" className="sr-only">Industria</label>
          <input
            type="text"
            id="industry-input"
            placeholder="Escribe un sector..."
            className="industry-input"
            aria-describedby="case-study-description"
            value={industry}
            onChange={e => setIndustry(e.target.value)}
            required
          />
          <button
            className="gemini-button"
            type="submit"
            disabled={caseLoading || !industry.trim()}
            aria-describedby="case-study-description"
          >
            {caseLoading ? 'Generando...' : 'Generar Caso ✨'}
          </button>
        </form>
        <div id="case-study-description" className="sr-only">Botón para generar caso de estudio usando inteligencia artificial</div>
        <div className="ai-output" aria-live="polite" dangerouslySetInnerHTML={{ __html: caseOutput }} />
      </div>
    </div>
  );
};

export default AIAdvisor;
