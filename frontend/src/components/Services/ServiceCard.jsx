import React, { memo } from 'react';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ServiceCard = memo(({ service, index }) => {
  const { t } = useLanguage();
  
  const titleId = `service-title-${index}`;
  const descId = `service-desc-${index}`;
  const serviceTitle = t(service.titleKey);
  
  return (
    <article 
      className='service-card'
      role="listitem"
      aria-labelledby={titleId}
      aria-describedby={descId}
    >
      <div className='service-icon' aria-hidden="true">
        <FontAwesomeIcon icon={service.icon} />
      </div>
      <h3 
        id={titleId}
        className='service-title'
      >
        {serviceTitle}
      </h3>
      <p 
        id={descId}
        className='service-description'
        aria-label={`${t('aria-service-card')} ${serviceTitle}`}
      >
        {t(service.descKey)}
      </p>
    </article>
  );
});

// Nombre para DevTools
ServiceCard.displayName = 'ServiceCard';

export default ServiceCard; 