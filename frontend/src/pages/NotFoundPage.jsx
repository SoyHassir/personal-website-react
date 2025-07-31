import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './PageStyles.css';

const NotFoundPage = () => {
  const { t } = useLanguage();

  return (
    <section className="page-section" style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      textAlign: 'center' 
    }}>
      <div className="container">
        <div className="not-found-content">
          <div className="not-found-icon">
            <FontAwesomeIcon icon={['fas', 'exclamation-triangle']} size="6x" />
          </div>
          <h1 style={{ fontSize: '4rem', marginBottom: '20px', color: 'var(--text-primary)' }}>
            404
          </h1>
          <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: 'var(--text-primary)' }}>
            {t('404-title') || 'Página no encontrada'}
          </h2>
          <p style={{ 
            fontSize: '1.2rem', 
            color: 'var(--text-secondary)', 
            marginBottom: '40px',
            maxWidth: '600px',
            margin: '0 auto 40px auto'
          }}>
            {t('404-message') || 'Lo sentimos, la página que buscas no existe o ha sido movida.'}
          </p>
          <div className="not-found-actions">
            <Link 
              to="/" 
              className="btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '15px 30px',
                background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '30px',
                fontWeight: '600',
                transition: 'transform 0.3s ease',
                marginRight: '20px'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <FontAwesomeIcon icon={['fas', 'home']} />
              {t('404-back-home') || 'Volver al inicio'}
            </Link>
            <button 
              onClick={() => window.history.back()}
              className="btn-secondary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '15px 30px',
                background: 'transparent',
                color: 'var(--primary-color)',
                border: '2px solid var(--primary-color)',
                borderRadius: '30px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'var(--primary-color)';
                e.target.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = 'var(--primary-color)';
              }}
            >
              <FontAwesomeIcon icon={['fas', 'arrow-left']} />
              {t('404-go-back') || 'Volver atrás'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFoundPage; 