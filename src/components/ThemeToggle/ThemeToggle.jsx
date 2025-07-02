import React from 'react';

const ThemeToggle = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <button 
      className="theme-toggle" 
      onClick={toggleDarkMode}
      aria-label={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      title={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      <i className={isDarkMode ? "fa-solid fa-sun" : "fa-solid fa-moon"}></i>
    </button>
  );
};

export default ThemeToggle; 