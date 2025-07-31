import React, { useEffect, useRef } from 'react';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import './About.css'; // Importa sus propios estilos modulares

const About = () => {
  const { t } = useLanguage();
  // useRef nos permite obtener una referencia al elemento <section>
  const sectionRef = useRef(null);

  // useEffect para manejar la animación de entrada cuando la sección es visible
  useEffect(() => {
    // Creamos un observador que vigila cuándo la sección entra en la pantalla
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Si la sección está visible
          if (entry.isIntersecting) {
            // Añadimos la clase 'content-visible' a la sección principal para activar el header
            entry.target.classList.add('content-visible');
            
            // Añadimos la clase 'visible' a los elementos hijos para activar la animación
            const aboutContent = entry.target.querySelector('.about-content');
            const aboutImage = entry.target.querySelector('.about-image-container');
            
            if (aboutContent) aboutContent.classList.add('visible');
            if (aboutImage) aboutImage.classList.add('visible');
            
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

  return (
    <section id='sobre-mi' aria-labelledby="about-title" ref={sectionRef}>
      <div className='about-container'>
        {/* Header de la sección */}
        <div className='about-header'>
          <h2 id="about-title">{t('about-title')}</h2>
          <p className='about-subtitle'>{t('about-subtitle')}</p>
        </div>

        {/* Contenido principal */}
        <div className='about-main'>
          <div className='about-content slide-in-left'>            
            <div className='about-description'>
              <p>
                {t('about-description-1')}
              </p>
              <p>
                {t('about-description-2')}
              </p>
              <p>
                {t('about-description-3')}
              </p>
            </div>
          </div>

          {/* Imagen */}
          <div className='about-image-container slide-in-right'>
            <div className='image-wrapper'>
              <picture>
                <source 
                  srcSet='./img/optimized-about/about-small.avif 400w, ./img/optimized-about/about-medium.avif 600w, ./img/optimized-about/about-large.avif 800w' 
                  sizes="(max-width: 767px) 350px, (max-width: 1199px) 450px, 500px"
                  type='image/avif' />
                <source 
                  srcSet='./img/optimized-about/about-small.webp 400w, ./img/optimized-about/about-medium.webp 600w, ./img/optimized-about/about-large.webp 800w' 
                  sizes="(max-width: 767px) 350px, (max-width: 1199px) 450px, 500px"
                  type='image/webp' />
                <img className='about-image' src='./img/originals/about-image.webp' alt={`${t('about-title')} - ${t('home-typed-2')}`} width="500" height="500" loading="lazy" />
              </picture>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;