import React from 'react';

const ManagerToolkitCard = ({ item, onSelect, className = '' }) => {
  return (
    <article 
      className={`service-card manager-toolkit-card ${className}`}
      tabIndex={0}
      role="listitem"
      style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', minHeight: 200 }}
    >
      <h3 className="service-title" style={{marginBottom: '1.2rem', fontSize: '1.65rem', fontWeight: 700, lineHeight: 1.25}}>
        {item.title}
      </h3>
      
      {item.motto && (
        <p className="service-description" style={{
          fontWeight: 400, 
          marginBottom: '1.7rem', 
          fontSize: '1.18rem',
          lineHeight: '1.6',
          color: 'rgba(255, 255, 255, 0.88)',
          flex: 1
        }}>
          {item.motto}
        </p>
      )}
      
      <button
        className="view-more-btn"
        type="button"
        onClick={e => { 
          e.stopPropagation(); 
          if (onSelect) onSelect(item);
        }}
        style={{ 
          marginTop: 'auto', 
          alignSelf: 'flex-end',
          padding: '0.75rem 1.5rem',
          fontSize: '1.13rem',
          fontWeight: 600
        }}
      >
        Explorar herramienta
      </button>
    </article>
  );
};

export default ManagerToolkitCard; 