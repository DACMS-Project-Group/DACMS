import React from 'react';

const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl shadow-[0_2px_8px_rgba(108,61,145,0.08)] p-6 border border-dark ${className}`}>
      {children}
    </div>
  );
};

export default Card;  // ← Make sure this is here