import { toolkitIndex, categoryDataMap } from '../data/managerToolkitData.js';
import { ToolkitConfig, getConfig, log, measurePerformance, debounce, throttle, getGeminiApiUrl } from '../data/managerToolkitConfig.js';

// Datos y estado de la aplicación
let dataLoader;
let toolkitData = [];
let performanceOptimizations;

let appState = {
    activeCategory: 'Todos',
    currentTool: null,
    isLoading: false,
    startTime: performance.now(),
    currentTabIndex: 0,
    currentCardIndex: 0
};

let elements = {};

// ===== SISTEMA DE ANIMACIONES COHESIVO =====
class ToolkitAnimations {
    constructor() {
        this.observers = new Map();
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupAnimations());
        } else {
            this.setupAnimations();
        }
    }

    setupAnimations() {
        this.initStaggerAnimations();
        this.initSmoothAnimations();
        this.initMicroInteractions();
        this.initMobileOptimizations();
        this.initToolkitSpecificAnimations();
    }

    initStaggerAnimations() {
        const cards = document.querySelectorAll('.tool-card');
        if (cards.length > 0) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const index = Array.from(cards).indexOf(entry.target);
                        setTimeout(() => {
                            entry.target.classList.add('visible');
                        }, 100 * index);
                        observer.unobserve(entry.target);
                    }
                });
            }, { 
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            cards.forEach(card => {
                observer.observe(card);
            });
            this.observers.set('cards', observer);
        }

        const categoryFilters = document.querySelector('.category-filters');
        if (categoryFilters) {
            categoryFilters.classList.add('stagger-container');
            const buttons = categoryFilters.querySelectorAll('.category-button');
            buttons.forEach((button, index) => {
                button.classList.add('stagger-item');
                button.style.animationDelay = `${0.05 * (index + 1)}s`;
            });
        }
    }

    initSmoothAnimations() {
        const elements = document.querySelectorAll('.bounce-in, .elastic-in, .smooth-scale, .fade-in');
        if (elements.length > 0) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.classList.add('visible');
                        }, 100);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            elements.forEach(element => {
                observer.observe(element);
            });
            this.observers.set('smooth', observer);
        }
    }

    initMicroInteractions() {
        document.querySelectorAll('.tool-card:not(.micro-hover)').forEach(card => {
            card.classList.add('micro-hover');
        });

        document.querySelectorAll('.gemini-button:not(.micro-pulse)').forEach(button => {
            button.classList.add('micro-pulse');
        });

        document.querySelectorAll('.category-button.active:not(.micro-pulse)').forEach(button => {
            button.classList.add('micro-pulse');
        });
    }

    initMobileOptimizations() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.body.classList.add('reduced-motion');
        } else if (window.innerWidth <= 768 || 'ontouchstart' in window) {
            document.body.classList.add('mobile-optimized');
            const style = document.createElement('style');
            style.textContent = `
                .mobile-optimized .bounce-in,
                .mobile-optimized .elastic-in {
                    transition-duration: 0.4s !important;
                }
                .mobile-optimized .micro-hover:hover {
                    transform: translateY(-4px) scale(1.01) !important;
                }
                .mobile-optimized .tool-card:hover {
                    transform: translateY(-4px) scale(1.01) !important;
                }
            `;
            document.head.appendChild(style);
        }
    }

    initToolkitSpecificAnimations() {
        this.initModalAnimations();
        this.initTabAnimations();
        this.initLoadingStates();
    }

    initModalAnimations() {
        const modal = document.getElementById('modal-overlay');
        if (modal) {
            const showModal = () => {
                modal.hidden = false;
                modal.classList.add('show');
                document.body.style.overflow = 'hidden';
            };

            const hideModal = () => {
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.hidden = true;
                }, 300);
                document.body.style.overflow = '';
            };

            document.addEventListener('click', (e) => {
                if (e.target === modal || e.target.closest('.close-modal')) {
                    hideModal();
                }
            });

            window.showToolkitModal = showModal;
            window.hideToolkitModal = hideModal;
        }
    }

    initTabAnimations() {
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const tabContents = document.querySelectorAll('.tab-content');
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.dataset.tab === button.dataset.tab) {
                        content.classList.add('active');
                        content.style.animation = 'fadeInUp 0.3s ease-out';
                    }
                });
            });
        });
    }

    initLoadingStates() {
        const loadingElements = document.querySelectorAll('.loading');
        loadingElements.forEach(element => {
            element.innerHTML = `
                <div class="loading-dots">
                    <div class="loading-dot"></div>
                    <div class="loading-dot"></div>
                    <div class="loading-dot"></div>
                </div>
            `;
        });
    }

    initCardAnimations() {
        if (this.observers.has('cards')) {
            this.observers.get('cards').disconnect();
        }
        
        const cards = document.querySelectorAll('.tool-card');
        if (cards.length > 0) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const index = Array.from(cards).indexOf(entry.target);
                        setTimeout(() => {
                            entry.target.classList.add('visible');
                        }, 100 * index);
                        observer.unobserve(entry.target);
                    }
                });
            }, { 
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            cards.forEach(card => {
                observer.observe(card);
            });
            this.observers.set('cards', observer);
        }
    }

    destroy() {
        this.observers.forEach(observer => {
            observer.disconnect();
        });
        this.observers.clear();
    }
}

// ===== OPTIMIZACIONES DE RENDIMIENTO =====
class PerformanceOptimizations {
    constructor() {
        this.debounceTimers = new Map();
        this.intersectionObserver = null;
        this.eventDelegationHandlers = new Map();
        this.skeletonElements = new Set();
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupEventDelegation();
        this.setupDebouncing();
        // Eliminar métodos y llamadas relacionados con skeletons/loading
        // - createSkeletonCards
        // - setupSkeletonLoading
        // - observeDataLoading
        // - referencias a 'skeleton-card'
    }

    setupEventDelegation() {
        const cardsGrid = document.getElementById('cards-grid');
        if (!cardsGrid) return;

        cardsGrid.addEventListener('click', (e) => {
            const card = e.target.closest('.tool-card, .skeleton-card');
            if (card && !card.classList.contains('skeleton-card')) {
                this.handleCardClick(card, e);
            }
        });

        cardsGrid.addEventListener('keydown', (e) => {
            const card = e.target.closest('.tool-card, .skeleton-card');
            if (card && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                this.handleCardClick(card, e);
            }
        });
    }

    setupDebouncing() {
        this.setupScrollDebouncing();
    }

    setupScrollDebouncing() {
        const debouncedScroll = this.debounce(() => {
            this.handleScrollOptimized();
        }, 16, 'scroll');
        
        window.addEventListener('scroll', debouncedScroll, { passive: true });
    }

    debounce(func, delay, key = 'default') {
        return (...args) => {
            if (this.debounceTimers.has(key)) {
                clearTimeout(this.debounceTimers.get(key));
            }
            
            const timer = setTimeout(() => {
                func.apply(this, args);
                this.debounceTimers.delete(key);
            }, delay);
            
            this.debounceTimers.set(key, timer);
        };
    }

    handleCardClick(card, event) {
        const toolId = card.dataset.id;
        if (toolId) {
            openModal(toolId);
        }
    }

    handleScrollOptimized() {
        // Optimizaciones de scroll si son necesarias
    }

    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };

        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.handleIntersection(entry.target);
                }
            });
        }, options);

        this.observeLazyElements();
    }

    observeLazyElements() {
        const cards = document.querySelectorAll('.tool-card, .skeleton-card');
        cards.forEach(card => {
            this.intersectionObserver.observe(card);
        });
    }

    handleIntersection(element) {
        element.classList.add('lazy-load');
        element.offsetHeight;
        
        requestAnimationFrame(() => {
            element.classList.add('loaded');
        });

        if (element.classList.contains('loaded')) {
            this.intersectionObserver.unobserve(element);
        }
    }

    observeDataLoading() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('tool-card')) {
                            const skeletonCard = node.previousElementSibling;
                            if (skeletonCard && skeletonCard.classList.contains('skeleton-card')) {
                                skeletonCard.remove();
                                this.skeletonElements.delete(skeletonCard);
                            }
                        }
                    });
                }
            });
        });

        const cardsGrid = document.getElementById('cards-grid');
        if (cardsGrid) {
            observer.observe(cardsGrid, { childList: true, subtree: true });
        }
    }

    cleanup() {
        this.debounceTimers.forEach(timer => clearTimeout(timer));
        this.debounceTimers.clear();

        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
        }

        this.eventDelegationHandlers.clear();
    }
}

// ===== DATA LOADER CLASS =====
class ToolkitDataLoader {
    constructor() {
        this.data = [];
        this.categories = Object.keys(categoryDataMap);
        this.loadedCount = 0;
        this.totalFiles = this.categories.length;
        this.loadedCategories = new Set();
        this.loadingPromises = new Map();
    }

    async loadAllData() {
        try {
            log('info', '🔄 Iniciando carga de datos del Manager Toolkit...');
            
            const loadPromises = this.categories.map(category => 
                this.loadCategoryData(category)
            );

            const results = await Promise.all(loadPromises);
            
            this.data = results.flat();
            
            log('info', `✅ Datos cargados exitosamente: ${this.data.length} herramientas`);
            return this.data;
            
        } catch (error) {
            console.error('❌ Error cargando datos:', error);
            throw error;
        }
    }

    async loadCategoryOnDemand(categoryName) {
        if (this.loadedCategories.has(categoryName)) {
            return this.data.filter(tool => tool.category === categoryName);
        }

        if (this.loadingPromises.has(categoryName)) {
            return await this.loadingPromises.get(categoryName);
        }

        const loadPromise = this.loadCategoryData(categoryName);
        this.loadingPromises.set(categoryName, loadPromise);

        try {
            const categoryData = await loadPromise;
            this.loadedCategories.add(categoryName);
            this.loadingPromises.delete(categoryName);
            return categoryData;
        } catch (error) {
            this.loadingPromises.delete(categoryName);
            throw error;
        }
    }

    async loadCategoryData(category) {
        try {
            const data = categoryDataMap[category] || [];
            this.loadedCount++;
            
            log('info', `📁 Cargado: ${category}.json (${data.length} herramientas)`);
            
            return data;
            
        } catch (error) {
            console.error(`❌ Error cargando ${category}.json:`, error);
            return [];
        }
    }

    getAllTools() {
        return this.data;
    }

    async getToolsByCategory(categoryName) {
        if (categoryName === 'Todos') {
            if (this.loadedCategories.size < this.categories.length) {
                const missingCategories = this.categories.filter(cat => !this.loadedCategories.has(cat));
                await this.preloadCategories(missingCategories);
            }
            return this.data;
        }

        if (!this.loadedCategories.has(categoryName)) {
            await this.loadCategoryOnDemand(categoryName);
        }

        return this.data.filter(tool => tool.category === categoryName);
    }

    async preloadCategories(categoryNames) {
        const promises = categoryNames
            .filter(cat => !this.loadedCategories.has(cat))
            .map(cat => this.loadCategoryOnDemand(cat));
        
        if (promises.length > 0) {
            log('info', `🔄 Precargando categorías: ${categoryNames.join(', ')}`);
            await Promise.all(promises);
        }
    }

    getUniqueCategories() {
        const categories = [...new Set(this.data.map(item => item.category))];
        categories.sort();
        return ['Todos', ...categories];
    }

    getToolById(id) {
        return this.data.find(tool => tool.id === id);
    }

    isDataLoaded() {
        return this.data.length > 0;
    }

    isCategoryLoaded(categoryName) {
        return this.loadedCategories.has(categoryName);
    }

    getLoadStats() {
        return {
            totalTools: this.data.length,
            loadedFiles: this.loadedCount,
            totalFiles: this.totalFiles,
            categories: this.getUniqueCategories().length - 1,
            loadedCategories: this.loadedCategories.size,
            pendingLoads: this.loadingPromises.size
        };
    }
}

// ===== FUNCIONES PRINCIPALES =====

// Inicialización optimizada
export async function initializeApp() {
    try {
        const startTime = performance.now();
        
        // Inicializar optimizaciones de rendimiento
        performanceOptimizations = new PerformanceOptimizations();
        
        // Crear instancia del data loader
        dataLoader = new ToolkitDataLoader();
        
        // Mostrar skeleton loading mientras se cargan los datos
        // Eliminar métodos y llamadas relacionados con skeletons/loading
        // - createSkeletonCards
        // - setupSkeletonLoading
        // - observeDataLoading
        // - referencias a 'skeleton-card'
        
        // Cargar todos los datos inicialmente
        toolkitData = await dataLoader.loadAllData();
        
        // Inicializar la aplicación
        initializeElements();
        renderCategoryFilters();
        await renderCards();
        setupEventListeners();
        setupKeyboardNavigation();
        
        // Inicializar animaciones
        window.toolkitAnimations = new ToolkitAnimations();
        
        // Mostrar estadísticas
        const stats = dataLoader.getLoadStats();
        const loadTime = Math.round(performance.now() - startTime);
        
        log('info', `🎯 Manager Toolkit inicializado: ${stats.totalTools} herramientas en ${stats.loadedCategories} categorías cargadas en ${loadTime}ms`);
        
        announceToScreenReader(`Manager Toolkit cargado con ${stats.totalTools} herramientas disponibles`);
        
        // Actualizar indicadores de rendimiento
        updatePerformanceIndicators(stats, loadTime);
        
    } catch (error) {
        console.error('❌ Error inicializando la aplicación:', error);
        showErrorMessage('Error cargando las herramientas. Por favor, recarga la página.');
    }
}

function updatePerformanceIndicators(stats, loadTime) {
    const loadTimeElement = document.getElementById('load-time');
    const toolsLoadedElement = document.getElementById('tools-loaded');
    const categoriesLoadedElement = document.getElementById('categories-loaded');
    
    if (loadTimeElement) loadTimeElement.textContent = `${loadTime}ms`;
    if (toolsLoadedElement) toolsLoadedElement.textContent = `${stats.totalTools} herramientas`;
    if (categoriesLoadedElement) categoriesLoadedElement.textContent = `${stats.categories} categorías`;
    
    // Auto-ocultar después de unos segundos
    const indicator = document.getElementById('performance-indicator');
    if (indicator && getConfig('ui.autoHidePerformanceIndicator')) {
        setTimeout(() => {
            indicator.style.opacity = '0';
            setTimeout(() => {
                indicator.style.display = 'none';
            }, 300);
        }, getConfig('performance.indicatorTimeout') || 7000);
    }
}

function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        if (announcement.parentNode) {
            announcement.parentNode.removeChild(announcement);
        }
    }, 1000);
}

function showErrorMessage(message) {
    const errorHtml = `
        <div class="error-message" style="text-align: center; padding: 2rem; color: #e74c3c;">
            <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem;" aria-hidden="true"></i>
            <p>${message}</p>
            <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer;">
                Recargar página
            </button>
        </div>
    `;
    
    if (elements.cardsGrid) {
        elements.cardsGrid.innerHTML = errorHtml;
    } else {
        document.body.innerHTML = errorHtml;
    }
}

function initializeElements() {
    elements = {
        categoryFilters: document.getElementById('category-filters'),
        cardsGrid: document.getElementById('cards-grid'),
        modalOverlay: document.getElementById('modal-overlay'),
        modalContent: document.getElementById('modal-content'),
        closeModal: document.getElementById('close-modal'),
        modalTitle: document.getElementById('modal-title'),
        modalMotto: document.getElementById('modal-motto'),
        modalTabs: document.getElementById('modal-tabs'),
        modalBodyContent: document.getElementById('modal-body-content')
    };
}

function setupKeyboardNavigation() {
    if (elements.categoryFilters) {
        elements.categoryFilters.addEventListener('keydown', (e) => {
            const buttons = elements.categoryFilters.querySelectorAll('.category-button');
            const currentIndex = Array.from(buttons).findIndex(btn => btn === document.activeElement);
            
            switch (e.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                    e.preventDefault();
                    const nextIndex = (currentIndex + 1) % buttons.length;
                    buttons[nextIndex].focus();
                    break;
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    const prevIndex = currentIndex <= 0 ? buttons.length - 1 : currentIndex - 1;
                    buttons[prevIndex].focus();
                    break;
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    if (document.activeElement.classList.contains('category-button')) {
                        document.activeElement.click();
                    }
                    break;
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (elements.modalOverlay && elements.modalOverlay.hidden) return;
        
        switch (e.key) {
            case 'Escape':
                closeModal();
                break;
            case 'Tab':
                const focusableElements = elements.modalContent.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
                break;
        }
    });
}

function getUniqueCategories() {
    if (dataLoader && dataLoader.isDataLoaded()) {
        return dataLoader.getUniqueCategories();
    }
    return ['Todos'];
}

function renderCategoryFilters() {
    const categories = getUniqueCategories();
    if (elements.categoryFilters) {
        elements.categoryFilters.innerHTML = categories.map((category, index) => `
            <button 
                data-category="${category}" 
                class="category-button ${appState.activeCategory === category ? 'active' : ''}"
                role="tab"
                aria-selected="${appState.activeCategory === category}"
                aria-controls="cards-grid"
                tabindex="${appState.activeCategory === category ? '0' : '-1'}"
            >
                ${category}
                ${dataLoader && dataLoader.isCategoryLoaded && dataLoader.isCategoryLoaded(category) ? '<span class="loaded-indicator" aria-label="Categoría cargada">✓</span>' : ''}
            </button>
        `).join('');
    }
}

async function renderCards() {
    if (appState.isLoading) return;
    
    appState.isLoading = true;
    
    try {
        const filteredData = toolkitData.filter(item => {
            return appState.activeCategory === 'Todos' || item.category === appState.activeCategory;
        });
        
        if (filteredData.length === 0) {
            if (elements.cardsGrid) {
                elements.cardsGrid.innerHTML = `
                    <div class="no-results" role="status" aria-live="polite">
                        <p>No se encontraron herramientas en esta categoría.</p>
                    </div>
                `;
            }
            announceToScreenReader('No se encontraron herramientas en esta categoría');
            return;
        }

        // CLON EXACTO DE ServiceCard.jsx
        const cardsHTML = filteredData.map((item, index) => `
            <article 
                class="service-card"
                role="listitem"
                aria-labelledby="toolkit-title-${index}"
                aria-describedby="toolkit-desc-${index}"
                tabindex="0"
            >
                <div class="service-icon" aria-hidden="true">
                    <i class="fas fa-toolbox"></i>
                </div>
                <h3 id="toolkit-title-${index}" class="service-title">${item.title}</h3>
                <p id="toolkit-desc-${index}" class="service-description">${item.motto}</p>
            </article>
        `).join('');

        if (elements.cardsGrid) {
            elements.cardsGrid.innerHTML = cardsHTML;
        }

        announceToScreenReader(`${filteredData.length} herramientas encontradas en ${appState.activeCategory === 'Todos' ? 'todas las categorías' : appState.activeCategory}`);
        
    } catch (error) {
        console.error('Error rendering cards:', error);
        showErrorMessage('Error mostrando las herramientas.');
    } finally {
        appState.isLoading = false;
    }
}

function setupEventListeners() {
    if (elements.categoryFilters) {
        elements.categoryFilters.addEventListener('click', async (e) => {
            if (e.target.classList.contains('category-button')) {
                const category = e.target.dataset.category;
                
                // Actualizar botones activos
                elements.categoryFilters.querySelectorAll('.category-button').forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-selected', 'false');
                    btn.setAttribute('tabindex', '-1');
                });
                
                e.target.classList.add('active');
                e.target.setAttribute('aria-selected', 'true');
                e.target.setAttribute('tabindex', '0');
                
                // Actualizar estado y renderizar
                appState.activeCategory = category;
                await renderCards();
            }
        });
    }

    if (elements.closeModal) {
        elements.closeModal.addEventListener('click', closeModal);
    }

    if (elements.modalOverlay) {
        elements.modalOverlay.addEventListener('click', (e) => {
            if (e.target === elements.modalOverlay) {
                closeModal();
            }
        });
    }
}

function openModal(toolId) {
    const tool = dataLoader.getToolById(toolId);
    if (!tool) {
        console.error('Herramienta no encontrada:', toolId);
        return;
    }

    appState.currentTool = tool;
    
    if (elements.modalTitle) elements.modalTitle.textContent = tool.title;
    if (elements.modalMotto) elements.modalMotto.textContent = tool.motto;
    
    renderModalTabs();
    renderTabContent('definicion');
    
    if (elements.modalOverlay) {
        elements.modalOverlay.hidden = false;
        elements.modalOverlay.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Focus en el primer elemento interactivo
        const firstFocusable = elements.modalContent.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) {
            firstFocusable.focus();
        }
    }
    
    announceToScreenReader(`Modal abierto para ${tool.title}`);
}

function closeModal() {
    if (elements.modalOverlay) {
        elements.modalOverlay.classList.remove('show');
        setTimeout(() => {
            elements.modalOverlay.hidden = true;
        }, 300);
        document.body.style.overflow = '';
    }
    
    appState.currentTool = null;
    announceToScreenReader('Modal cerrado');
}

function renderModalTabs() {
    if (!appState.currentTool || !elements.modalTabs) return;

    const tabs = [
        { id: 'definicion', label: 'Definición', icon: 'fas fa-info-circle' },
        { id: 'insight', label: 'Insight', icon: 'fas fa-lightbulb' },
        { id: 'puntos-clave', label: 'Puntos Clave', icon: 'fas fa-key' },
        { id: 'asesor-ia', label: 'Asesor IA', icon: 'fas fa-robot' }
    ];

    const tabsHTML = tabs.map((tab, index) => `
        <button 
            class="tab-button ${index === 0 ? 'active' : ''}" 
            data-tab="${tab.id}"
            role="tab"
            aria-selected="${index === 0}"
            aria-controls="modal-body-content"
            tabindex="${index === 0 ? '0' : '-1'}"
        >
            <i class="${tab.icon}" aria-hidden="true"></i>
            <span>${tab.label}</span>
        </button>
    `).join('');

    elements.modalTabs.innerHTML = tabsHTML;

    // Agregar event listeners a los tabs
    elements.modalTabs.addEventListener('click', (e) => {
        if (e.target.closest('.tab-button')) {
            const button = e.target.closest('.tab-button');
            const tabId = button.dataset.tab;
            
            // Actualizar tabs activos
            elements.modalTabs.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
                btn.setAttribute('tabindex', '-1');
            });
            
            button.classList.add('active');
            button.setAttribute('aria-selected', 'true');
            button.setAttribute('tabindex', '0');
            
            renderTabContent(tabId);
        }
    });
}

function renderTabContent(tabId) {
    if (!appState.currentTool || !elements.modalBodyContent) return;

    const tool = appState.currentTool;
    let content = '';

    switch (tabId) {
        case 'definicion':
            content = `
                <div class="tab-content active" data-tab="definicion">
                    <h3>¿Qué es ${tool.title}?</h3>
                    <p>${tool.definition}</p>
                </div>
            `;
            break;

        case 'insight':
            content = `
                <div class="tab-content active" data-tab="insight">
                    <h3>Insight Estratégico</h3>
                    <p>${tool.insight}</p>
                </div>
            `;
            break;

        case 'puntos-clave':
            content = `
                <div class="tab-content active" data-tab="puntos-clave">
                    <h3>Puntos Clave</h3>
                    <ul class="key-points">
                        ${tool.keyPoints.map(point => `<li>${point}</li>`).join('')}
                    </ul>
                </div>
            `;
            break;

        case 'asesor-ia':
            content = `
                <div class="tab-content active" data-tab="asesor-ia">
                    <h3>Asesor de IA ✨</h3>
                    <p>Obtén recomendaciones personalizadas y casos de estudio generados por IA para ${tool.title}.</p>
                    
                    <div class="ai-actions">
                        <button id="generate-steps-btn" class="gemini-button">
                            <i class="fas fa-list-ol"></i>
                            Generar pasos de implementación
                        </button>
                        
                        <button id="generate-case-study-btn" class="gemini-button">
                            <i class="fas fa-file-alt"></i>
                            Generar caso de estudio
                        </button>
                    </div>
                    
                    <div id="ai-response" class="ai-response" style="display: none;">
                        <!-- Respuesta de IA aparece aquí -->
                    </div>
                </div>
            `;
            setupAIEventListeners();
            break;
    }

    elements.modalBodyContent.innerHTML = content;
    announceToScreenReader(`Contenido de ${tabId} cargado`);
}

function setupAIEventListeners() {
    setTimeout(() => {
        const generateStepsBtn = document.getElementById('generate-steps-btn');
        const generateCaseStudyBtn = document.getElementById('generate-case-study-btn');
        
        if (generateStepsBtn) {
            generateStepsBtn.addEventListener('click', handleGenerateSteps);
        }
        
        if (generateCaseStudyBtn) {
            generateCaseStudyBtn.addEventListener('click', handleGenerateCaseStudy);
        }
    }, 100);
}

function limpiarMarkdown(texto) {
    return texto.replace(/[*_#`]/g, '').replace(/\n/g, '<br>');
}

async function handleGenerateSteps() {
    if (!appState.currentTool) return;
    
    const button = document.getElementById('generate-steps-btn');
    const responseDiv = document.getElementById('ai-response');
    
    if (!button || !responseDiv) return;
    
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generando...';
    responseDiv.style.display = 'block';
    responseDiv.innerHTML = '<div class="loading">Generando pasos de implementación...</div>';
    
    try {
        const prompt = `Como consultor en estrategia con 10 años de experiencia implementando la metodología ${appState.currentTool.title} en empresas de diferentes sectores, elabora una guía paso a paso que incluya por cada paso:

Contexto: ${appState.currentTool.definition}

1. Descripción del paso (3–5 pasos en total).
2. Un KPI SMART (específico, medible, alcanzable, relevante y con plazo; indica unidad y fecha de revisión).
3. Un obstáculo común y su solución práctica.

Condiciones:
1. Titula la salida exactamente “Guía para Implementar la ${appState.currentTool.title}”.
2. Responde en español, sin saludo inicial, y limita el texto a 200 palabras.`;
        
        const response = await callGeminiAPI(prompt);
        
        responseDiv.innerHTML = `
            <div class="ai-result">
                <h4><i class="fas fa-robot"></i> Pasos de Implementación Generados</h4>
                <div class="ai-content">${limpiarMarkdown(response)}</div>
            </div>
        `;
        
    } catch (error) {
        console.error('Error generando pasos:', error);
        responseDiv.innerHTML = `
            <div class="ai-error">
                <i class="fas fa-exclamation-triangle"></i>
                Error generando contenido. Por favor, intenta de nuevo.
            </div>
        `;
    } finally {
        button.disabled = false;
        button.innerHTML = '<i class="fas fa-list-ol"></i> Generar pasos de implementación';
    }
}

async function handleGenerateCaseStudy() {
    if (!appState.currentTool) return;
    
    const button = document.getElementById('generate-case-study-btn');
    const responseDiv = document.getElementById('ai-response');
    
    if (!button || !responseDiv) return;
    
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generando...';
    responseDiv.style.display = 'block';
    responseDiv.innerHTML = '<div class="loading">Generando caso de estudio...</div>';
    
    try {
        const prompt = `Como experto en gestión empresarial, crea un caso de estudio detallado sobre la implementación exitosa de "${appState.currentTool.title}" en una empresa.

Contexto de la herramienta: ${appState.currentTool.definition}

El caso de estudio debe incluir:
1. Situación inicial de la empresa (desafíos/problemas)
2. Por qué se eligió esta herramienta específicamente
3. Proceso de implementación (timeline y pasos)
4. Resultados obtenidos (con datos cuantitativos si es posible)
5. Lecciones aprendidas
6. Recomendaciones para futuras implementaciones

Responde en español, creando un caso realista pero inspirador.`;
        
        const response = await callGeminiAPI(prompt);
        
        responseDiv.innerHTML = `
            <div class="ai-result">
                <h4><i class="fas fa-robot"></i> Caso de Estudio Generado</h4>
                <div class="ai-content">${limpiarMarkdown(response)}</div>
            </div>
        `;
        
    } catch (error) {
        console.error('Error generando caso de estudio:', error);
        responseDiv.innerHTML = `
            <div class="ai-error">
                <i class="fas fa-exclamation-triangle"></i>
                Error generando contenido. Por favor, intenta de nuevo.
            </div>
        `;
    } finally {
        button.disabled = false;
        button.innerHTML = '<i class="fas fa-file-alt"></i> Generar caso de estudio';
    }
}

async function callGeminiAPI(prompt) {
    try {
        const apiUrl = getGeminiApiUrl();
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                }
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            return data.candidates[0].content.parts[0].text;
        } else {
            throw new Error('Respuesta inválida de la API');
        }
        
    } catch (error) {
        console.error('Error llamando a Gemini API:', error);
        throw new Error('Error conectando con el servicio de IA. Por favor, intenta de nuevo más tarde.');
    }
} 