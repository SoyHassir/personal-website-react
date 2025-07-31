import React, { useEffect, useRef, useMemo, memo } from 'react';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import ServiceCard from './ServiceCard.jsx';
import './Services.css'; // Importa sus propios estilos modulares

const Services = memo(() => {
  const { t } = useLanguage();
  const sectionRef = useRef(null);

  // useEffect para manejar la animación de entrada de las tarjetas
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Si la sección es visible en la pantalla
          if (entry.isIntersecting) {
            // Añadimos la clase 'visible' a cada tarjeta para activar la animación
            entry.target.querySelectorAll('.service-card').forEach((card, index) => {
              setTimeout(() => {
                card.classList.add('visible');
              }, index * 150);
            });
            // Dejamos de observar para que la animación no se repita
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1, // La animación se dispara cuando el 10% de la sección es visible
      }
    );

    // Le decimos al observador que vigile nuestra sección
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    // Función de limpieza para cuando el componente se desmonte
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []); // El array vacío asegura que este efecto se ejecute solo una vez

  // Memoizar el array de services para evitar re-renders innecesarios
  const services = useMemo(() => [
    {
      icon: ['fas', 'chart-line'],
      titleKey: "service1-title",
      descKey: "service1-desc"
    },
    {
      icon: ['fas', 'chalkboard-teacher'], 
      titleKey: "service2-title",
      descKey: "service2-desc"
    },
    {
      icon: ['fas', 'database'],
      titleKey: "service3-title",
      descKey: "service3-desc"
    },
    {
      icon: ['fas', 'flask'],
      titleKey: "service4-title",
      descKey: "service4-desc"
    },
    {
      icon: ['fas', 'cogs'],
      titleKey: "service5-title",
      descKey: "service5-desc"
    },
    {
      icon: ['fas', 'laptop-code'],
      titleKey: "service6-title",
      descKey: "service6-desc"
    }
  ], []);

  return (
    <section id='servicios' aria-labelledby="services-title" ref={sectionRef}>
      <div className='services-header'>
        <h2 id="services-title">{t('services-title')}</h2>
        <p className='services-subtitle'>{t('services-subtitle')}</p>
      </div>
      
      <div className='services-grid' role="list" aria-label={t('services-subtitle')}>
        {services.map((service, index) => (
          <ServiceCard 
            key={index} 
            service={service} 
            index={index} 
          />
        ))}
      </div>
    </section>
  );
});

// Nombre para DevTools
Services.displayName = 'Services';

export default Services;