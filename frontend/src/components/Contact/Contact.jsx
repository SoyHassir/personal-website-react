import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import { FORMSPREE_CONFIG } from '../../services/formspreeConfig.js';
import './Contact.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
    <section className='contact' id='contacto' aria-labelledby="contact-heading" ref={sectionRef}>
      <div className='contact-container'>
        {/* Header consistente con otras secciones */}
        <div className='contact-header'>
          <h2 id="contact-heading">{t('contact-title')}</h2>
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
            <div className='social-networks' role="list" aria-label="Enlaces a perfiles profesionales">
              <a href="http://www.linkedin.com/in/hassirlastresierra" target="_blank" rel="noopener" className="social-link" aria-label={`${t('aria-social-link')} LinkedIn`} role="listitem">
                <div className="social-icon" aria-hidden="true">
                  <FontAwesomeIcon icon={['fab', 'linkedin']} />
                </div>
                <span>LinkedIn</span>
              </a>
              <a href="https://scholar.google.es/citations?user=ZMTTnUoAAAAJ&hl=es" target="_blank" rel="noopener" className="social-link" aria-label={`${t('aria-social-link')} Google Scholar`} role="listitem">
                <div className="social-icon" aria-hidden="true">
                  <FontAwesomeIcon icon={['fab', 'google']} />
                </div>
                <span>Google Scholar</span>
              </a>
              <a href="https://scienti.minciencias.gov.co/cvlac/visualizador/generarCurriculoCv.do?cod_rh=0001630270" target="_blank" rel="noopener" className="social-link" aria-label={`${t('aria-social-link')} CvLAC`} role="listitem">
                <div className="social-icon" aria-hidden="true">
                  <FontAwesomeIcon icon={['fas', 'user']} />
                </div>
                <span>CvLAC</span>
              </a>
              <a href="https://orcid.org/0000-0002-7581-9331" target="_blank" rel="noopener" className="social-link" aria-label={`${t('aria-social-link')} ORCID`} role="listitem">
                <div className="social-icon" aria-hidden="true">
                  <FontAwesomeIcon icon={['fab', 'orcid']} />
                </div>
                <span>ORCID</span>
              </a>
              <a href="https://www.researchgate.net/profile/Hassir-Lastre-Sierra" target="_blank" rel="noopener" className="social-link" aria-label={`${t('aria-social-link')} ResearchGate`} role="listitem">
                <div className="social-icon" aria-hidden="true">
                  <FontAwesomeIcon icon={['fas', 'graduation-cap']} />
                </div>
                <span>ResearchGate</span>
              </a>
              <a href="https://github.com/SoyHassir" target="_blank" rel="noopener" className="social-link" aria-label={`${t('aria-social-link')} GitHub`} role="listitem">
                <div className="social-icon" aria-hidden="true">
                  <FontAwesomeIcon icon={['fab', 'github']} />
                </div>
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
            <h3 id="contact-form-title">{t('contact-form-title')}</h3>
            
            {!formspreeEndpoint && (
              <div className="form-message error">
                <span>Formulario en configuración. Por favor, contacta directamente por email: hola@hassirlastre.com</span>
              </div>
            )}
            
            <form onSubmit={onSubmit} className='contact-form' role="form" aria-labelledby="contact-form-title">
              <div className='form-row'>
                <input
                  type="text"
                  name="name"
                  placeholder={t('contact-form-name')}
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  disabled={!formspreeEndpoint}
                  aria-label={t('contact-form-name')}
                  aria-required="true"
                />
                <input
                  type="email"
                  name="email"
                  placeholder={t('contact-form-email')}
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={!formspreeEndpoint}
                  aria-label={t('contact-form-email')}
                  aria-required="true"
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
                aria-label={t('contact-form-subject')}
                aria-required="true"
              />

              <textarea
                name="message"
                placeholder={t('contact-form-message')}
                value={formData.message}
                onChange={handleInputChange}
                required
                rows="6"
                disabled={!formspreeEndpoint}
                aria-label={t('contact-form-message')}
                aria-required="true"
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
                <div 
                  className="form-message success"
                  role="status"
                  aria-live="polite"
                  aria-label={t('aria-form-success')}
                >
                  <svg className="message-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>¡Mensaje enviado exitosamente! Te responderé pronto.</span>
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div 
                  className="form-message error"
                  role="alert"
                  aria-live="assertive"
                  aria-label={t('aria-form-error')}
                >
                  <svg className="message-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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