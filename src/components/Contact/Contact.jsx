import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import { FORMSPREE_CONFIG } from '../../services/formspreeConfig.js';
import './Contact.css';

const Contact = () => {
  const { t } = useLanguage();
  const sectionRef = useRef(null);
  
  // Verificar si Formspree está configurado
  const formspreeEndpoint = FORMSPREE_CONFIG.ENDPOINT && 
                           FORMSPREE_CONFIG.ENDPOINT !== 'TU_FORMSPREE_ENDPOINT' && 
                           FORMSPREE_CONFIG.ENDPOINT !== 'AQUI_TU_ENDPOINT_DE_FORMSPREE' &&
                           FORMSPREE_CONFIG.ENDPOINT.startsWith('https://formspree.io/')
    ? FORMSPREE_CONFIG.ENDPOINT 
    : null;
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  // Estados para el manejo del formulario
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', null
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    // Verificar configuración
    if (!formspreeEndpoint) {
      setSubmitStatus('error');
      setErrorMessage('El formulario no está configurado. Por favor, contacta directamente por email.');
      return;
    }

    setIsLoading(true);
    setSubmitStatus(null);
    setErrorMessage('');

    try {
      // Crear FormData con los datos del formulario
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('subject', formData.subject);
      formDataToSend.append('message', formData.message);
      formDataToSend.append('_subject', `${FORMSPREE_CONFIG.SETTINGS.subject_prefix} ${formData.subject}`);
      formDataToSend.append('_replyto', formData.email);

      // Enviar usando fetch directamente
      const response = await fetch(formspreeEndpoint, {
        method: 'POST',
        body: formDataToSend,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        // Éxito: limpiar formulario y mostrar mensaje
        setFormData({ name: '', email: '', subject: '', message: '' });
        setSubmitStatus('success');
        
        // Auto-ocultar mensaje de éxito después de 5 segundos
        setTimeout(() => {
          setSubmitStatus(null);
        }, 5000);
      } else {
        // Error del servidor
        setSubmitStatus('error');
        setErrorMessage('Error al enviar el mensaje. Intenta de nuevo más tarde.');
        
        // Auto-ocultar mensaje de error después de 8 segundos
        setTimeout(() => {
          setSubmitStatus(null);
          setErrorMessage('');
        }, 8000);
      }
    } catch (error) {
      console.error('Error enviando formulario:', error);
      setSubmitStatus('error');
      setErrorMessage('Error al enviar el mensaje. Intenta de nuevo más tarde.');
      
      // Auto-ocultar mensaje de error después de 8 segundos
      setTimeout(() => {
        setSubmitStatus(null);
        setErrorMessage('');
      }, 8000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className='contact' id='contacto' ref={sectionRef}>
      <div className='contact-container'>
        {/* Header consistente con otras secciones */}
        <div className='contact-header'>
          <h2>{t('contact-title')}</h2>
          <p className='contact-subtitle'>{t('contact-subtitle')}</p>
        </div>
        
        <div className='contact-content'>
          {/* Información de contacto y redes */}
          <div className='contact-info'>
            <h3>{t('contact-connect')}</h3>
            
            <div className='info-item'>
              <strong>{t('contact-email')}</strong>
              <p><a href="mailto:hola@hassirlastre.com">hola@hassirlastre.com</a></p>
            </div>

            {/* Redes sociales profesionales */}
            <div className='social-networks'>
              <a href="http://www.linkedin.com/in/hassirlastresierra" target="_blank" rel="noopener" className="social-link" aria-label="LinkedIn">
                <svg className="social-icon" viewBox="0 0 448 512" aria-hidden="true">
                  <path fill="currentColor" d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"/>
                </svg>
                <span>LinkedIn</span>
              </a>
              <a href="https://scholar.google.es/citations?user=ZMTTnUoAAAAJ&hl=es" target="_blank" rel="noopener" className="social-link" aria-label="Google Scholar">
                <svg className="social-icon" viewBox="0 0 640 512" aria-hidden="true">
                  <path fill="currentColor" d="M622.34 153.2L343.4 67.5c-15.2-4.67-31.6-4.67-46.79 0L17.66 153.2c-23.54 7.23-23.54 38.36 0 45.59l48.63 14.94c-10.67 13.19-17.23 29.28-17.23 46.9c0 35.3 29.69 64 66.3 64s66.3-28.7 66.3-64c0-17.62-6.56-33.71-17.23-46.9l116.4-35.78c30.5-9.39 62.7-9.39 93.2 0L622.34 198.8c23.54-7.23 23.54-38.36 0-45.59zM351.79 251.7c-15.1 4.65-31.5 4.65-46.59 0l-116.4-35.78c-7.56 9.31-12.56 21.05-12.56 34.08 0 26.47 21.53 48 48 48s48-21.53 48-48c0-13.03-5-24.77-12.56-34.08l91.67-28.22c.44 21.41.44 42.83 0 64.24z"/>
                </svg>
                <span>Google Scholar</span>
              </a>
              <a href="https://scienti.minciencias.gov.co/cvlac/visualizador/generarCurriculoCv.do?cod_rh=0001630270" target="_blank" rel="noopener" className="social-link" aria-label="CvLAC">
                <svg className="social-icon" viewBox="0 0 384 512" aria-hidden="true">
                  <path fill="currentColor" d="M336 0H48C21.5 0 0 21.5 0 48v416c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48V48c0-26.5-21.5-48-48-48zM144 32h96c8.8 0 16 7.2 16 16s-7.2 16-16 16h-96c-8.8 0-16-7.2-16-16s7.2-16 16-16zm48 128c35.3 0 64 28.7 64 64s-28.7 64-64 64-64-28.7-64-64 28.7-64 64-64zm112 236.8c0 10.6-10 19.2-22.4 19.2H102.4c-12.4 0-22.4-8.6-22.4-19.2v-19.2c0-31.8 30.1-57.6 67.2-57.6h5.6c11.6 5.4 24.7 8.4 38.4 8.4s26.7-3 38.4-8.4h5.6c37.1 0 67.2 25.8 67.2 57.6v19.2z"/>
                </svg>
                <span>CvLAC</span>
              </a>
              <a href="https://orcid.org/0000-0002-7581-9331" target="_blank" rel="noopener" className="social-link" aria-label="ORCID">
                <svg className="social-icon" viewBox="0 0 512 512" aria-hidden="true">
                  <path fill="currentColor" d="M294.75 188.19h-45.92V342h47.47c67.62 0 83.12-51.34 83.12-76.91 0-41.64-26.54-76.9-84.67-76.9zM256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm-80.79 360.76h-29.84v-207.5h29.84zm-14.92-231.14a19.57 19.57 0 1 1 19.57-19.57 19.64 19.64 0 0 1-19.57 19.57zM300 369h-81V161.26h80.6c76.73 0 110.44 54.83 110.44 103.85C410 318.39 368.38 369 300 369z"/>
                </svg>
                <span>ORCID</span>
              </a>
              <a href="https://www.researchgate.net/profile/Hassir-Lastre-Sierra" target="_blank" rel="noopener" className="social-link" aria-label="ResearchGate">
                <svg className="social-icon" viewBox="0 0 448 512" aria-hidden="true">
                  <path fill="currentColor" d="M0 32v448c0 17.69 14.31 32 32 32h384c17.69 0 32-14.31 32-32V32c0-17.69-14.31-32-32-32H32C14.31 0 0 14.31 0 32zm337.5 175.5c0-35.3-28.7-64-64-64s-64 28.7-64 64 28.7 64 64 64 64-28.7 64-64zm112 192c0 17.7-14.3 32-32 32s-32-14.3-32-32 14.3-32 32-32 32 14.3 32 32z"/>
                </svg>
                <span>ResearchGate</span>
              </a>
              <a href="https://github.com/SoyHassir" target="_blank" rel="noopener" className="social-link" aria-label="GitHub">
                <svg className="social-icon" viewBox="0 0 496 512" aria-hidden="true">
                  <path fill="currentColor" d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"/>
                </svg>
                <span>GitHub</span>
              </a>
            </div>

            {/* Botón email - solo visible en móvil */}
            <div className='email-button-mobile'>
              <a href="mailto:hola@hassirlastre.com" className='btn-email'>
                <span>hola@hassirlastre.com</span>
              </a>
            </div>
          </div>

          {/* Formulario moderno */}
          <div className='contact-form-wrapper'>
            <h3>{t('contact-form-title')}</h3>
            
            {!formspreeEndpoint && (
              <div className="form-message error">
                <span>Formulario en configuración. Por favor, contacta directamente por email: hola@hassirlastre.com</span>
              </div>
            )}
            
            <form onSubmit={onSubmit} className='contact-form'>
              <div className='form-row'>
                <input
                  type="text"
                  name="name"
                  placeholder={t('contact-form-name')}
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  disabled={!formspreeEndpoint}
                />
                <input
                  type="email"
                  name="email"
                  placeholder={t('contact-form-email')}
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={!formspreeEndpoint}
                />
              </div>

              <input
                type="text"
                name="subject"
                placeholder={t('contact-form-subject')}
                value={formData.subject}
                onChange={handleInputChange}
                required
                disabled={!formspreeEndpoint}
              />

              <textarea
                name="message"
                placeholder={t('contact-form-message')}
                value={formData.message}
                onChange={handleInputChange}
                required
                rows="6"
                disabled={!formspreeEndpoint}
              ></textarea>

              <button type="submit" disabled={isLoading || !formspreeEndpoint}>
                {isLoading ? (
                  <span>
                    <svg className="loading-spinner" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="31.416" strokeDashoffset="31.416">
                        <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
                        <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
                      </circle>
                    </svg>
                    Enviando...
                  </span>
                ) : (
                  <span>{formspreeEndpoint ? t('contact-form-send') : 'Formulario no disponible'}</span>
                )}
              </button>

              {/* Mensajes de feedback */}
              {submitStatus === 'success' && (
                <div className="form-message success">
                  <svg className="message-icon" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>¡Mensaje enviado exitosamente! Te responderé pronto.</span>
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="form-message error">
                  <svg className="message-icon" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{errorMessage || 'Error al enviar el mensaje. Intenta de nuevo.'}</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;