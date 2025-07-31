import React, { useEffect, useRef } from 'react';
import Typed from 'typed.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import './Home.css'; // Asegúrate de importar sus estilos

const Home = () => {
  const { t, currentLanguage } = useLanguage();
  const typedElement = useRef(null);
  const typedInstance = useRef(null);
  const sectionRef = useRef(null);

  // useEffect para activar las animaciones CSS - coordinado con header sin usar preloader duplicado
  useEffect(() => {
    // Detectar si es primera carga basándose en si hay elementos del preloader en el DOM
    const isFirstLoad = document.querySelector('.preloader') !== null;
    
    // Calcular delay apropiado para mantener orden: Header → Content
    const delay = isFirstLoad ? 550 : 520; // Primera carga: 550ms, navegación: 520ms (header completo + pequeño buffer)
    
    const timer = setTimeout(() => {
      if (sectionRef.current) {
        sectionRef.current.classList.add('content-visible');
      }
    }, delay);

    return () => clearTimeout(timer);
  }, []); // Sin dependencia del preloader pero mantiene coordinación

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

  // ✨ useEffect PARA ALTURA DINÁMICA Y PARALLAX ✨
  useEffect(() => {
    const homeSection = document.querySelector('.home');
    if (!homeSection) return;

    // Función para ajustar altura dinámica (especialmente útil en Samsung, iPhone Pro Max, etc.)
    const adjustDynamicHeight = () => {
      const vh = window.innerHeight * 0.01;
      homeSection.style.setProperty('--real-vh', `${vh}px`);
    };

    // Efecto parallax
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

    // Ajustar altura inicial
    adjustDynamicHeight();

    // Event listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', adjustDynamicHeight, { passive: true });
    window.addEventListener('orientationchange', adjustDynamicHeight, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', adjustDynamicHeight);
      window.removeEventListener('orientationchange', adjustDynamicHeight);
    };
  }, []); // El array vacío asegura que esto solo se configure una vez

  // Función para scroll smooth que respeta el CSS
  const handleScrollToSection = (e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      // Detectar si estamos en móvil (donde el scroll está en body)
      const isMobile = window.innerWidth <= 768;
      const scrollElement = isMobile ? document.body : window;
      
      // Usar scrollTo en lugar de scrollIntoView para respetar el CSS
      const navbarHeight = 80; // Altura del navbar
      const elementTop = element.offsetTop - navbarHeight; // Por - #px extra de separación
      
      if (isMobile && document.body.scrollTo) {
        document.body.scrollTo({
          top: elementTop,
          behavior: 'smooth'
        });
      } else {
        window.scrollTo({
          top: elementTop,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <section className='home' id='inicio' role="banner" aria-labelledby="hero-heading" ref={sectionRef}>
      <div className='hero-content'>
        <div className='hero-text'>
          <h1 id="hero-heading">
            {t('home-greeting')}<span 
              className='typed' 
              ref={typedElement}
              aria-live="polite"
              aria-atomic="true"
            ></span>
          </h1>
          <p className='hero-description' id="hero-description">
            {t('home-subtitle')}
          </p>
        </div>
        <div className='hero-image' role="img" aria-label={`${t('about-title')} - Foto de perfil profesional`}>
          <picture>
            <source 
              srcSet='./img/optimized-profile/profile-small.webp 280w, ./img/optimized-profile/profile-medium.webp 350w, ./img/optimized-profile/profile-medium.webp 440w' 
              sizes="(max-width: 767px) 280px, (max-width: 1199px) 350px, 440px"
              type='image/webp' />
            <source 
              srcSet='./img/optimized-profile/profile-small.avif 280w, ./img/optimized-profile/profile-medium.avif 350w, ./img/optimized-profile/profile-medium.avif 440w' 
              sizes="(max-width: 767px) 280px, (max-width: 1199px) 350px, 440px"
              type='image/avif' />
            <img 
              src='./img/optimized-profile/profile-medium.webp' 
              alt={`${t('about-title')}, ${t('home-typed-2')} - Foto de perfil profesional`}
              width="350" 
              height="350" 
              loading="eager" 
              fetchPriority="high" 
            />
          </picture>
        </div>
      </div>
      
      <a 
        href='#sobre-mi' 
        className='scroll-down'
        aria-label={t('aria-scroll-indicator')}
        title={t('nav-about')}
        onClick={(e) => handleScrollToSection(e, 'sobre-mi')}
      >
        <FontAwesomeIcon icon={['fas', 'chevron-down']} aria-hidden="true" />
      </a>
    </section>
  );
};

export default Home;