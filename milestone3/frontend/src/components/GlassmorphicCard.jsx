import React from 'react';

const GlassmorphicCard = ({ children, className = '', hoverEffect = true }) => {
  return (
    <div className={`${hoverEffect ? 'glass-card' : 'glass-panel rounded-xl shadow-sm'} p-6 bg-[var(--card)] text-[var(--text)] border border-[var(--border)] transition-all ${className}`}>
      {children}
    </div>
  );
};

export default GlassmorphicCard;
