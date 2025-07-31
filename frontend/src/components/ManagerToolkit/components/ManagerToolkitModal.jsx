import React, { useState } from 'react';
import { useEffect } from 'react';
import AIAdvisor from './AIAdvisor.jsx';
import '../styles/ManagerToolkitModal.css';
import { FontAwesomeIcon } from '../../../utils/fontawesome';

const overlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(30, 34, 90, 0.55)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 2000,
  backdropFilter: 'blur(6px)',
};

const closeBtnStyle = {
  position: 'absolute',
  top: 18,
  right: 18,
  background: 'rgba(255,255,255,0.7)',
  border: 'none',
  borderRadius: '50%',
  width: 36,
  height: 36,
  fontSize: 22,
  cursor: 'pointer',
  fontWeight: 700,
  color: '#6e8efb',
  boxShadow: '0 2px 8px rgba(110,142,251,0.08)'
};

const ManagerToolkitModal = ({ tool, onClose }) => {
  const [showAI, setShowAI] = useState(false);
  useEffect(() => {
    document.body.classList.add('modal-open');
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);
  if (!tool) return null;

  const hasKeyPoints = tool.keyPoints && Array.isArray(tool.keyPoints) && tool.keyPoints.length > 0;

  return (
    <div className="modal-overlay" style={overlayStyle} onClick={onClose}>
      <div className="modal-animate" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">{tool.title}</h2>
        <div className="modal-tabs" style={{gap: '1rem'}}>
          <span
            className={`asesoria-chip${!showAI ? ' active' : ''}`}
            style={{cursor: 'pointer'}}
            onClick={() => setShowAI(false)}
          >
            Información
          </span>
          <span
            className={`asesoria-chip${showAI ? ' active' : ''}`}
            style={{cursor: 'pointer'}}
            onClick={() => setShowAI(true)}
          >
            AsesorIA ✨
          </span>
        </div>
        {/* El botón volver ya no es necesario, se navega con los chips */}
        <div className="manager-toolkit-modal-content">
          {!showAI && (
            <div className="info-anim">
              {tool.definition && (
                <section>
                  <h3>Definición</h3>
                  <p className="modal-description">{tool.definition}</p>
                </section>
              )}
              {tool.insight && (
                <section>
                  <h3>Insight</h3>
                  <p className="modal-description">{tool.insight}</p>
                </section>
              )}
              {hasKeyPoints && (
                <section>
                  <h3>Puntos Clave</h3>
                  <ul className="modal-description custom-list">
                    {tool.keyPoints.map((kp, i) => (
                      <li key={i}><span className="custom-bullet">•</span>{kp}</li>
                    ))}
                  </ul>
                </section>
              )}
              {!hasKeyPoints && tool.useCases && tool.useCases.length > 0 && (
                <section>
                  <h3>Casos de Uso</h3>
                  <ul className="modal-description custom-list">
                    {tool.useCases.map((uc, i) => (
                      <li key={i}>
                        <span className="custom-bullet">•</span>
                        <div className="use-case-content">
                          <strong>{uc.title}:</strong> {uc.text}
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          )}
          {showAI && (
            <div className="asesoria-anim">
              <AIAdvisor tool={tool} />
            </div>
          )}
        </div>
        <button className="modal-close-btn" style={closeBtnStyle} aria-label="Cerrar" onClick={onClose}>&times;</button>
      </div>
    </div>
  );
};

export default ManagerToolkitModal; 