import React, { memo, useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import Tooltip from './Tooltip.jsx';
import { useNavigate } from 'react-router-dom';

const ToolsButton = memo(() => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const toolsRef = useRef(null);
  const navigate = useNavigate();

  const handleClick = () => {
    console.log('🔧 ToolsButton: handleClick called, open state:', open);
    if (open) {
      // Iniciar animación de salida
      setIsClosing(true);
      setTimeout(() => {
        setOpen(false);
        setIsClosing(false);
      }, 300); // Duración de la animación de salida
    } else {
      setOpen(true);
    }
  };

  // Cerrar el menú al hacer clic fuera (con delay para permitir clicks internos)
  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event) {
      // Verificar si el click fue en un botón interno
      if (event.target.closest('.tools-menu-item')) {
        return; // No cerrar si es un click en un item del menú
      }
      
      if (toolsRef.current && !toolsRef.current.contains(event.target)) {
        // Iniciar animación de salida
        setIsClosing(true);
        setTimeout(() => {
          setOpen(false);
          setIsClosing(false);
        }, 300); // Duración de la animación de salida
      }
    }
    
    // Usar un pequeño delay para asegurar que otros handlers se ejecuten primero
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 10);
    
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  // Abrir Manager Toolkit - versión final funcionando
  const handleManagerToolkitClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🔧 ToolsButton: Navigating to Manager Toolkit');
    
    // Iniciar animación de salida
    setIsClosing(true);
    setTimeout(() => {
      setOpen(false);
      setIsClosing(false);
      // Usar setTimeout para asegurar que la navegación no se cancele
      setTimeout(() => {
        navigate('/manager-toolkit');
      }, 100);
    }, 300); // Duración de la animación de salida
  };

  return (
    <div ref={toolsRef}>
      {open ? (
        <button 
          onClick={handleClick}
          aria-label={t('aria-tools-button') || 'Herramientas'}
          aria-haspopup="menu"
          aria-expanded={open}
        >
          <FontAwesomeIcon 
            icon={["fas", "screwdriver-wrench"]} 
            aria-hidden="true"
          />
        </button>
      ) : (
        <Tooltip content={t('aria-tools-button') || 'Herramientas'} position="left">
          <button 
            onClick={handleClick}
            aria-label={t('aria-tools-button') || 'Herramientas'}
            aria-haspopup="menu"
            aria-expanded={open}
          >
            <FontAwesomeIcon 
              icon={["fas", "screwdriver-wrench"]} 
              aria-hidden="true"
            />
          </button>
        </Tooltip>
      )}
      {(open || isClosing) && (
        <div 
          role="menu"
          className={isClosing ? 'menu-closing' : ''}
          style={{
            position: 'absolute',
            top: '50%',
            right: 'calc(100% + 12px)',
            transform: 'translateY(-50%)',
            zIndex: 10001
          }}
        >
          <button 
            role="menuitem" 
            onClick={handleManagerToolkitClick}
          >
            <i className="fas fa-toolbox" aria-hidden="true"></i>
            <span style={{ marginLeft: '0.5rem' }}>Manager's Toolkit</span>
          </button>
        </div>
      )}
    </div>
  );
});

ToolsButton.displayName = 'ToolsButton';

export default ToolsButton; 