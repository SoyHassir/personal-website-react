import React, { useState, cloneElement } from 'react';

const Tooltip = ({ children, content, position = 'left' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const showTooltip = () => setIsVisible(true);
  const hideTooltip = () => setIsVisible(false);

  // Clonar el hijo para aplicar position: relative
  const childWithRef = React.isValidElement(children)
    ? cloneElement(children, { style: { position: 'relative' } })
    : children;

  return (
    <div 
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
      tabIndex={0}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      {childWithRef}
      {isVisible && (
        <div
          className={`tooltip tooltip-${position}`}
          role="tooltip"
          style={{
            position: 'absolute',
            top: '50%',
            right: position === 'left' ? 'calc(100% + 12px)' : 'auto',
            transform: 'translateY(-50%)',
            zIndex: 10002,
            pointerEvents: 'none',
            opacity: 1
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip; 