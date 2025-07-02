import React, { useEffect, useRef } from 'react';
import Typed from 'typed.js';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import './Home.css'; // Asegúrate de importar sus estilos

const Home = () => {
  const { t, currentLanguage } = useLanguage();
  const typedElement = useRef(null);
  const typedInstance = useRef(null);

  // useEffect para el efecto de máquina de escribir que se actualiza con el idioma
  useEffect(() => {
    // Verificar que las traducciones estén disponibles antes de inicializar
    const strings = [
      t('home-typed-1'), 
      t('home-typed-2'), 
      t('home-typed-3'),
      t('home-typed-4')
    ];

    // Solo inicializar si todas las traducciones están disponibles (no son claves)
    const allTranslationsLoaded = strings.every(str => str && !str.startsWith('home-typed-'));
    
    if (!allTranslationsLoaded || !typedElement.current) {
      return;
    }

    // Destruir instancia anterior si existe
    if (typedInstance.current) {
      typedInstance.current.destroy();
    }

    // Pequeño delay para asegurar que el DOM esté listo
    const timeoutId = setTimeout(() => {
      if (typedElement.current) {
        const options = {
          strings: strings,
          typeSpeed: 75,
          backSpeed: 75,
          loop: true,
          smartBackspace: true,
          cursorChar: '|',
          contentType: 'html',
          // Asegurar que el cursor se posicione correctamente
          showCursor: true,
          autoInsertCss: false, // Usar nuestros propios estilos CSS
          bindInputFocusEvents: false,
          // Evitar problemas de redimensionado
          preStringTyped: function(arrayPos, self) {
            // Asegurar que el contenedor mantenga las propiedades de no-wrap
            if (typedElement.current) {
              typedElement.current.style.whiteSpace = 'nowrap';
            }
          }
        };
        
        typedInstance.current = new Typed(typedElement.current, options);
      }
    }, 100);
    
    return () => {
      clearTimeout(timeoutId);
      if (typedInstance.current) {
        typedInstance.current.destroy();
      }
    };
  }, [t, currentLanguage]); // Se ejecuta cuando cambia el idioma

  // ✨ useEffect QUE REPLICA EL EFECTO PARALLAX ✨
  useEffect(() => {
    const homeSection = document.querySelector('.home');
    if (!homeSection) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;

      // 1. Mueve el fondo principal
      homeSection.style.backgroundPositionY = `${scrollY * 0.3}px`;

      // 2. Mueve y escala la imagen de cubierta (::after) a través de variables CSS - LIMITADO
      const maxMovement = 100; // Limitar movimiento máximo a 100px
      const coverTranslateY = Math.min(scrollY * 0.2, maxMovement);
      homeSection.style.setProperty('--cover-translateY', `${coverTranslateY}px`);

      // 3. Efecto sutil de flotación - LIMITADO para evitar escape de sombras
      const profileImage = document.querySelector('.image');
      if (profileImage && scrollY < homeSection.offsetHeight) {
        const translateY = Math.sin(scrollY * 0.002) * 3; // Reducido movimiento
        profileImage.style.transform = `translateY(${translateY}px)`;
      }
    };

    // Añadimos el listener para el scroll
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Limpiamos el listener cuando el componente ya no es visible
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // El array vacío asegura que esto solo se configure una vez

  return (
    <section className='home' id='inicio'>
      <div className='hero-content'>
        <div className='hero-text'>
          <h1>{t('home-greeting')} <span className='typed' ref={typedElement}></span></h1>
          <p className='hero-description'>
            {t('home-subtitle')}
          </p>
          <div className='hero-buttons'>
            <a href='#sobre-mi' className='btn btn-outline'>{t('home-cta-button').toUpperCase()}</a>
          </div>
        </div>
        <div className='hero-image'>
          <picture>
            <source 
              srcSet='./img/optimized-profile/profile-small.avif 280w, ./img/optimized-profile/profile-medium.avif 350w, ./img/optimized-profile/profile-large.avif 440w' 
              sizes="(max-width: 767px) 280px, (max-width: 1199px) 350px, 440px"
              type='image/avif' />
            <source 
              srcSet='./img/optimized-profile/profile-small.webp 280w, ./img/optimized-profile/profile-medium.webp 350w, ./img/optimized-profile/profile-large.webp 440w' 
              sizes="(max-width: 767px) 280px, (max-width: 1199px) 350px, 440px"
              type='image/webp' />
            <img src='./img/originals/profile-image.webp' alt={t('about-title') + ', ' + t('home-typed-2')} width="350" height="350" loading="eager" fetchPriority="high" />
          </picture>
        </div>
      </div>
      
      <div className='scroll-indicator'>
        <a href='#sobre-mi' aria-label={`${t('nav-about')} section`}>
          <div className='scroll-arrow'></div>
        </a>
      </div>
    </section>
  );
};

export default Home;