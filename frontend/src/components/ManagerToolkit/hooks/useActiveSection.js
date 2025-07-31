import { useState, useEffect } from 'react';

/**
 * Hook para detectar la sección activa del sitio
 * Útil para structured data dinámico y navegación
 */
export const useActiveSection = () => {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    // Mapear IDs de secciones a nombres para structured data
    const sectionMap = {
      'inicio': 'home',
      'sobre-mi': 'about', 
      'servicios': 'services',
      'contacto': 'contact'
    };

    const sections = document.querySelectorAll('section[id]');
    
    if (sections.length === 0) {
      setActiveSection('home');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            const mappedSection = sectionMap[sectionId] || 'home';
            setActiveSection(mappedSection);
            
            // Log para desarrollo
            if (import.meta.env.DEV) {
              console.log(`📍 Active section changed: ${sectionId} -> ${mappedSection}`);
            }
          }
        });
      },
      {
        // Configuración para detectar cuando la sección está en el centro de la pantalla
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
      }
    );

    // Observar todas las secciones
    sections.forEach((section) => {
      observer.observe(section);
    });

    // Verificación inicial
    const initialSection = window.location.hash.replace('#', '') || 'inicio';
    const mappedInitial = sectionMap[initialSection] || 'home';
    setActiveSection(mappedInitial);

    // Cleanup
    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  return { activeSection };
}; 