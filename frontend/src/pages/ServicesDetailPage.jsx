import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './PageStyles.css';

const ServicesDetailPage = () => {
  const { t } = useLanguage();
  const { serviceId } = useParams();

  // Datos de ejemplo para los servicios
  const servicesData = {
    1: {
      title: t('service1-title') || 'Consultoría Estratégica',
      description: t('service1-desc') || 'Gestión empresarial y estratégica respaldada por investigación certificada MinCiencias.',
      icon: 'chart-line',
      features: [
        'Análisis organizacional integral',
        'Diseño de estrategias personalizadas',
        'Implementación de mejores prácticas',
        'Seguimiento y optimización continua'
      ],
      benefits: [
        'Incremento en la eficiencia operacional',
        'Mejora en la toma de decisiones',
        'Optimización de recursos',
        'Ventaja competitiva sostenible'
      ]
    },
    2: {
      title: t('service2-title') || 'Formación Empresarial',
      description: t('service2-desc') || 'Cursos y talleres especializados en temas actuales de negocios y tecnología.',
      icon: 'graduation-cap',
      features: [
        'Programas de capacitación personalizados',
        'Metodologías de aprendizaje activo',
        'Certificaciones profesionales',
        'Seguimiento post-formación'
      ],
      benefits: [
        'Desarrollo de competencias clave',
        'Actualización tecnológica',
        'Mejora en productividad',
        'Crecimiento profesional del equipo'
      ]
    },
    3: {
      title: t('service3-title') || 'Análisis de Datos',
      description: t('service3-desc') || 'Business intelligence, data analytics y visualización de datos.',
      icon: 'chart-bar',
      features: [
        'Recolección y limpieza de datos',
        'Análisis estadístico avanzado',
        'Dashboards interactivos',
        'Modelos predictivos'
      ],
      benefits: [
        'Decisiones basadas en datos',
        'Identificación de oportunidades',
        'Reducción de riesgos',
        'Optimización de procesos'
      ]
    }
  };

  const service = servicesData[serviceId];

  if (!service) {
    return (
      <section className="page-section">
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <h1>Servicio no encontrado</h1>
            <Link to="/#servicios" className="btn-primary" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '15px 30px',
              background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '30px',
              fontWeight: '600',
              marginTop: '20px'
            }}>
              <FontAwesomeIcon icon={['fas', 'arrow-left']} />
              Volver a servicios
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="page-section">
      <div className="container">
        {/* Breadcrumb */}
        <nav style={{ marginBottom: '40px' }}>
          <Link to="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
            Inicio
          </Link>
          <span style={{ margin: '0 10px', color: 'var(--text-secondary)' }}>/</span>
          <Link to="/#servicios" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
            Servicios
          </Link>
          <span style={{ margin: '0 10px', color: 'var(--text-secondary)' }}>/</span>
          <span style={{ color: 'var(--primary-color)', fontWeight: '600' }}>
            {service.title}
          </span>
        </nav>

        {/* Header del servicio */}
        <header className="page-header">
          <div style={{ 
            fontSize: '4rem', 
            color: 'var(--primary-color)', 
            marginBottom: '20px' 
          }}>
            <FontAwesomeIcon icon={['fas', service.icon]} />
          </div>
          <h1>{service.title}</h1>
          <p className="page-subtitle">{service.description}</p>
        </header>

        {/* Contenido principal */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
          gap: '40px',
          marginTop: '60px'
        }}>
          {/* Características */}
          <div className="blog-card" style={{ height: 'fit-content' }}>
            <h3 style={{ 
              fontSize: '1.5rem', 
              marginBottom: '25px', 
              color: 'var(--primary-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <FontAwesomeIcon icon={['fas', 'cogs']} />
              ¿Qué incluye?
            </h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {service.features.map((feature, index) => (
                <li key={index} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '15px',
                  marginBottom: '15px',
                  color: 'var(--text-primary)'
                }}>
                  <FontAwesomeIcon 
                    icon={['fas', 'check-circle']} 
                    style={{ color: 'var(--primary-color)', fontSize: '1.2rem' }}
                  />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Beneficios */}
          <div className="blog-card" style={{ height: 'fit-content' }}>
            <h3 style={{ 
              fontSize: '1.5rem', 
              marginBottom: '25px', 
              color: 'var(--secondary-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <FontAwesomeIcon icon={['fas', 'trophy']} />
              Beneficios clave
            </h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {service.benefits.map((benefit, index) => (
                <li key={index} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '15px',
                  marginBottom: '15px',
                  color: 'var(--text-primary)'
                }}>
                  <FontAwesomeIcon 
                    icon={['fas', 'star']} 
                    style={{ color: 'var(--secondary-color)', fontSize: '1.2rem' }}
                  />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Call to Action */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '60px',
          padding: '40px',
          background: 'var(--card-background)',
          borderRadius: '16px',
          border: '1px solid var(--border-color)'
        }}>
          <h3 style={{ 
            fontSize: '2rem', 
            marginBottom: '20px', 
            color: 'var(--text-primary)' 
          }}>
            ¿Interesado en este servicio?
          </h3>
          <p style={{ 
            color: 'var(--text-secondary)', 
            marginBottom: '30px',
            fontSize: '1.1rem'
          }}>
            Conversemos sobre cómo puedo ayudarte a alcanzar tus objetivos
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link 
              to="/#contacto"
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
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <FontAwesomeIcon icon={['fas', 'envelope']} />
              Contactar ahora
            </Link>
            <Link 
              to="/#servicios"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '15px 30px',
                background: 'transparent',
                color: 'var(--primary-color)',
                border: '2px solid var(--primary-color)',
                textDecoration: 'none',
                borderRadius: '30px',
                fontWeight: '600',
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
              Ver otros servicios
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesDetailPage; 