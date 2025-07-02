import React, { useEffect, useRef } from 'react';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import './Services.css'; // Importa sus propios estilos modulares

const Services = () => {
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

  const services = [
    {
      icon: "fas fa-chart-line",
      titleKey: "service1-title",
      descKey: "service1-desc"
    },
    {
      icon: "fas fa-chalkboard-teacher", 
      titleKey: "service2-title",
      descKey: "service2-desc"
    },
    {
      icon: "fas fa-database",
      titleKey: "service3-title",
      descKey: "service3-desc"
    },
    {
      icon: "fas fa-flask",
      titleKey: "service4-title",
      descKey: "service4-desc"
    },
    {
      icon: "fas fa-digital-tachograph",
      titleKey: "service5-title",
      descKey: "service5-desc"
    },
    {
      icon: "fas fa-laptop-code",
      titleKey: "service6-title",
      descKey: "service6-desc"
    }
  ];

  return (
    <section id='servicios' aria-labelledby="services-title" ref={sectionRef}>
      <div className='services-header'>
        <h2 id="services-title">{t('services-title')}</h2>
        <p className='services-subtitle'>{t('services-subtitle')}</p>
      </div>
      
      <div className='services-grid'>
        {services.map((service, index) => (
          <div key={index} className='service-card'>
            <div className='service-icon'>
              <i className={service.icon}></i>
            </div>
            <h3 className='service-title'>{t(service.titleKey)}</h3>
            <p className='service-description'>{t(service.descKey)}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;