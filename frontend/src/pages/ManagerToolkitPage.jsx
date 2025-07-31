import React, { useState, useEffect, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import '../components/ManagerToolkit/styles/managerToolkit.css';
import '../components/Services/Services.css';
import { toolkitIndex, categoryDataMap } from '../components/ManagerToolkit/data/managerToolkitData.js';
import ManagerToolkitCard from '../components/ManagerToolkit/components/ManagerToolkitCard.jsx';
import ManagerToolkitModal from '../components/ManagerToolkit/components/ManagerToolkitModal.jsx';
import { FooterVisibilityContext } from '../components/Layout/Layout.jsx';

const getCardsPerPage = () => (typeof window !== 'undefined' && window.innerWidth <= 768 ? 4 : 6);
const getLoadMoreCount = () => (typeof window !== 'undefined' && window.innerWidth <= 768 ? 2 : 3);

let CARDS_PER_PAGE = getCardsPerPage();
let LOAD_MORE_COUNT = getLoadMoreCount();

// Actualizar valores en resize
if (typeof window !== 'undefined') {
  window.addEventListener('resize', () => {
    CARDS_PER_PAGE = getCardsPerPage();
    LOAD_MORE_COUNT = getLoadMoreCount();
  });
}

function getRandomFromArray(arr, n) {
  // Devuelve n elementos aleatorios únicos de arr
  const result = [];
  const used = new Set();
  while (result.length < n && used.size < arr.length) {
    const idx = Math.floor(Math.random() * arr.length);
    if (!used.has(idx)) {
      result.push(arr[idx]);
      used.add(idx);
    }
  }
  return result;
}

function getVariedToolsByCategory(categoryDataMap, alreadyShownIds, count) {
  // Devuelve hasta 'count' herramientas, una aleatoria por categoría, sin repetir ids
  const categories = Object.keys(categoryDataMap);
  const picked = [];
  const pickedIds = new Set(alreadyShownIds);
  for (let cat of categories) {
    const tools = categoryDataMap[cat].filter(tool => !pickedIds.has(tool.id));
    if (tools.length > 0) {
      const randomTool = tools[Math.floor(Math.random() * tools.length)];
      picked.push(randomTool);
      pickedIds.add(randomTool.id);
      if (picked.length === count) break;
    }
  }
  // Si faltan para llegar a 'count', completar con aleatorias del resto
  if (picked.length < count) {
    const allRest = Object.values(categoryDataMap).flat().filter(tool => !pickedIds.has(tool.id));
    picked.push(...getRandomFromArray(allRest, count - picked.length));
  }
  return picked;
}

const ManagerToolkitPage = () => {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [selectedTool, setSelectedTool] = useState(null);
  const [visibleCount, setVisibleCount] = useState(CARDS_PER_PAGE);
  const [shownIds, setShownIds] = useState([]); // Para evitar repeticiones en 'Todos'
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [newCardsCount, setNewCardsCount] = useState(0);
  const [showAnimations, setShowAnimations] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [showAllFilters, setShowAllFilters] = useState(false);
  const [firstBatchTools, setFirstBatchTools] = useState([]);
  const [showCards, setShowCards] = useState(false);
  const [showLoadMore, setShowLoadMore] = useState(false);
  const { setShowFooter } = useContext(FooterVisibilityContext);

  // Reiniciar scroll al montar la página - ELIMINADO, ahora centralizado en Layout
  
  useEffect(() => {
    setShowFooter(false);
    const timer = setTimeout(() => {
      setShowAnimations(true);
      setTimeout(() => setHasAnimated(true), 1200); // tiempo suficiente para todas las animaciones
      setTimeout(() => setShowCards(true), 1600); // mostrar cards después del contador
      // Mostrar el botón después de la última card (delay base + n*stagger + duración animación)
      const cardsCount = typeof window !== 'undefined' && window.innerWidth <= 768 ? 4 : 6;
      const lastCardDelay = 0.1 + (cardsCount - 1) * 0.12;
      const animDuration = 0.7; // segundos
      setTimeout(() => setShowLoadMore(true), (1600 + (lastCardDelay + animDuration) * 1000));
      setTimeout(() => setShowFooter(true), (1600 + (lastCardDelay + animDuration + 0.4) * 1000));
    }, 350);
    return () => clearTimeout(timer);
  }, []);

  // Obtener lista de categorías desde toolkitIndex
  const categories = [
    { fileName: 'Todos', originalCategory: 'Todos' },
    ...toolkitIndex.categories.map(cat => ({
      fileName: cat.fileName,
      originalCategory: cat.originalCategory
    }))
  ];

  // Obtener todas las herramientas (para la vista 'Todos')
  const allTools = Object.values(categoryDataMap).flat();

  // Guardar el primer lote aleatorio solo una vez al cambiar de categoría
  useEffect(() => {
    if (activeCategory === 'Todos') {
      setFirstBatchTools(getVariedToolsByCategory(categoryDataMap, [], getCardsPerPage()));
    }
  }, [activeCategory]);

  // Herramientas a mostrar según la categoría activa
  let toolsToShow = [];
  if (activeCategory === 'Todos') {
    if (visibleCount <= CARDS_PER_PAGE) {
      toolsToShow = firstBatchTools.slice(0, visibleCount);
    } else {
      // Primer lote fijo + el resto secuencial de allTools (sin repetir)
      const firstIds = new Set(firstBatchTools.map(t => t.id));
      const rest = allTools.filter(t => !firstIds.has(t.id));
      toolsToShow = [...firstBatchTools, ...rest.slice(0, visibleCount - CARDS_PER_PAGE)];
    }
  } else {
    toolsToShow = categoryDataMap[activeCategory]?.slice(0, visibleCount) || [];
  }

  // Resetear visibleCount y shownIds al cambiar de categoría
  React.useEffect(() => {
    setVisibleCount(getCardsPerPage());
    setShownIds([]);
    setNewCardsCount(0);
    setIsLoadingMore(false);
  }, [activeCategory]);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setNewCardsCount(getLoadMoreCount());
    // Simular un pequeño delay para que se vea la animación
    setTimeout(() => {
      setVisibleCount((prev) => prev + getLoadMoreCount());
      setIsLoadingMore(false);
      setNewCardsCount(0);
    }, 1000);
  };

  // Breadcrumbs
  const breadcrumbs = [
    { label: "Manager's Toolkit", active: activeCategory === 'Todos' },
    ...(activeCategory !== 'Todos' ? [{ label: activeCategory, active: true }] : [])
  ];

  // Contador de herramientas
  const totalGlobal = Object.values(categoryDataMap).flat().length;
  const totalInCategory = activeCategory === 'Todos'
    ? totalGlobal
    : (categoryDataMap[activeCategory]?.length || 0);
  const showingCount = Math.min(visibleCount, totalInCategory);

  // Calcular el total real de herramientas disponibles en la categoría
  const totalAvailable = activeCategory === 'Todos'
    ? Object.values(categoryDataMap).flat().length
    : (categoryDataMap[activeCategory]?.length || 0);

  const MAX_CHIPS_MOBILE = 5;
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  const visibleCategories = isMobile && !showAllFilters
    ? categories.slice(0, MAX_CHIPS_MOBILE)
    : categories;

  const showMoreButton = isMobile && categories.length > MAX_CHIPS_MOBILE;

  return (
    <>
      <Helmet>
        <title>Manager's Toolkit | Herramientas y técnicas para la gestión organizacional</title>
        <meta name="description" content="Compendio completo de 94 herramientas y metodologías de gestión moderna. Asesor de IA integrado para orientación personalizada." />
        <meta name="keywords" content="gestión empresarial, herramientas de gestión, metodologías, FODA, Lean, Six Sigma, estrategia, innovación" />
        <meta name="author" content="Hassir Lastre Sierra" />
        <meta property="og:title" content="Manager Toolkit - Compendio Completo de Gerencia Moderna" />
        <meta property="og:description" content="94 herramientas y metodologías de gestión moderna con asesor de IA integrado" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hassirlastre.com/manager-toolkit/" />
        <meta property="og:image" content="https://hassirlastre.com/img/cover-home-section.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Manager Toolkit - Compendio Completo de Gerencia Moderna" />
        <meta name="twitter:description" content="94 herramientas y metodologías de gestión moderna con asesor de IA integrado" />
        <meta name="twitter:image" content="https://hassirlastre.com/img/cover-home-section.webp" />
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" />
      </Helmet>

      {/* Breadcrumbs */}
      {/* Skip links para accesibilidad */}
      <a href="#main-content" className="skip-link">Saltar al contenido principal</a>
      <a href="#category-filters" className="skip-link">Saltar a los filtros</a>
      <a href="#cards-grid" className="skip-link">Saltar a las herramientas</a>

      {/* Contenido principal sin <main> duplicado */}
      <section className={`toolkit-header${showAnimations ? ' animated' : ' pre-animate'}`} aria-labelledby="toolkit-title" style={{animationDelay: showAnimations ? '0.1s' : undefined}}>
        <h1 id="toolkit-title">Manager's Toolkit</h1>
        <p className="services-subtitle">
          Manager's Toolkit es una guía interactiva con más de 90 herramientas, técnicas y tendencias para optimizar la gestión empresarial y facilitar la toma de decisiones. Esta colección está potenciada por un <span className="ai-advisor-text">Asesor de IA ✨</span> y está concebida para apoyar la implementación de estrategias efectivas, la mejora continua de procesos y la resolución de problemas dentro de las organizaciones.
        </p>
      </section>
      <section className="container" aria-labelledby="filters-title">
        <h2 id="filters-title" className="sr-only">Filtros de categorías</h2>
        <div id="category-filters" className={`services-grid${showAnimations ? ' animated' : ' pre-animate'}`} role="tablist" aria-label="Filtros de categorías de herramientas" style={{animationDelay: showAnimations ? '0.4s' : undefined}}>
          {visibleCategories.map((cat, i) => (
            <button
              key={cat.fileName}
              className={`category-button${activeCategory === cat.originalCategory ? ' active' : ''}${showAnimations ? ' animated' : ' pre-animate'}`}
              onClick={() => setActiveCategory(cat.originalCategory)}
              role="tab"
              aria-selected={activeCategory === cat.originalCategory}
              tabIndex={activeCategory === cat.originalCategory ? 0 : -1}
              style={{
                margin: '0.5rem',
                animationDelay: showAnimations && !hasAnimated ? `${0.55 + i * 0.13}s` : undefined
              }}
            >
              {cat.originalCategory}
            </button>
          ))}
          {showMoreButton && (
            <button
              className="category-button more"
              onClick={() => setShowAllFilters(v => !v)}
              aria-label={showAllFilters ? "Mostrar menos filtros" : "Mostrar más filtros"}
              style={{ margin: '0.5rem', animationDelay: showAnimations ? `${0.55 + visibleCategories.length * 0.13}s` : undefined }}
            >
              {showAllFilters ? "Menos" : "Más"}
            </button>
          )}
        </div>
      </section>
      <section className="container toolkit-tools-section" aria-labelledby="tools-title">
        <h2 id="tools-title" className="sr-only">Herramientas de gestión</h2>
        {/* Contador de herramientas */}
        <div
          className={`toolkit-counter${showAnimations ? ' animated' : ' pre-animate'}`}
          style={{
            margin: '0 0 1.2rem 0',
            textAlign: 'right',
            color: '#bfc6e6',
            fontSize: '1.08rem',
            fontWeight: 500,
            animationDelay: showAnimations ? '1.2s' : undefined
          }}
        >
          {activeCategory === 'Todos' ? (
            <>
              Mostrando <span style={{color: '#6e8efb', fontWeight: 700}}>{showingCount}</span> de <span style={{color: '#a777e3', fontWeight: 700}}>{totalGlobal}</span> herramientas
            </>
          ) : (
            <>
              Mostrando <span style={{color: '#6e8efb', fontWeight: 700}}>{showingCount}</span> de <span style={{color: '#a777e3', fontWeight: 700}}>{totalInCategory}</span> herramientas en: <span style={{color: '#6e8efb'}}>{activeCategory}</span>
            </>
          )}
        </div>
        <div id="cards-grid" className="cards-grid" role="list" aria-label="Herramientas de gestión disponibles">
          {showCards && hasAnimated && toolsToShow.length === 0 && (
            <div className="no-results">No hay herramientas en esta categoría.</div>
          )}
          {showCards && toolsToShow.length > 0 && (() => {
            let toolsToDisplay = toolsToShow;
            if (activeCategory === 'Todos') {
              toolsToDisplay = toolsToShow;
            }
            return toolsToDisplay.map((tool, index) => {
              const isNewCard = isLoadingMore && index >= visibleCount - newCardsCount;
              // Animación suave y escalonada al aparecer las cards
              let cardClass = '';
              let style = undefined;
              if (!showAnimations) {
                cardClass = 'pre-animate';
              } else if (showAnimations && !hasAnimated) {
                cardClass = isNewCard ? 'animated card-load-animation' : 'animated';
                style = { animationDelay: `${1.6 + index * 0.16}s` };
              } else if (showCards) {
                cardClass = 'animated';
                style = { animationDelay: `${0.1 + index * 0.12}s` };
              }
              return (
                <ManagerToolkitCard
                  key={`${tool.id}-${index}`}
                  item={tool}
                  onSelect={(tool) => setSelectedTool(tool)}
                  className={cardClass}
                  style={style}
                />
              );
            });
          })()}
        </div>
        {showLoadMore && visibleCount < totalAvailable && (
          <div style={{ textAlign: 'center', margin: '2.5rem 0' }}>
            <button
              className={`btn-load-more${showAnimations ? ' animated' : ' pre-animate'}${isLoadingMore ? ' loading' : ''}`}
              onClick={handleLoadMore}
              style={{
                fontSize: '1.22rem',
                fontWeight: 700,
                padding: '1.1rem 2.8rem',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #6e8efb, #a777e3)',
                color: '#fff',
                border: 'none',
                boxShadow: '0 8px 32px rgba(110, 142, 251, 0.18)',
                cursor: isLoadingMore ? 'wait' : 'pointer',
                position: 'relative',
                minWidth: 180,
                transition: 'background 0.3s, color 0.3s, box-shadow 0.3s',
                outline: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                animationDelay: showAnimations ? `${0.1 + (toolsToShow.length) * 0.12 + 0.3}s` : undefined
              }}
              disabled={isLoadingMore}
              aria-busy={isLoadingMore}
            >
              {isLoadingMore && (
                <span
                  className="spinner"
                  style={{
                    width: 22,
                    height: 22,
                    border: '3px solid #fff',
                    borderTop: '3px solid #a777e3',
                    borderRadius: '50%',
                    display: 'inline-block',
                    animation: 'spin 0.8s linear infinite',
                    marginRight: 10
                  }}
                  aria-hidden="true"
                />
              )}
              {!isLoadingMore && 'Cargar más'}
            </button>
          </div>
        )}
      </section>
      {/* Modal controlado por React */}
      {selectedTool && (
        <ManagerToolkitModal tool={selectedTool} onClose={() => setSelectedTool(null)} />
      )}
    </>
  );
};

export default ManagerToolkitPage; 