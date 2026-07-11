import React from 'react';

const GlassmorphicCard = ({ children, className = '', hoverEffect = true }) => {
  return (
    <div className={`${hoverEffect ? 'glass-card' : 'glass-panel rounded-2xl p-6 shadow-md border border-slate-200/60 dark:border-slate-800/40'} p-6 ${className}`}>
      {children}
    </div>
  );
};

export default GlassmorphicCard;
