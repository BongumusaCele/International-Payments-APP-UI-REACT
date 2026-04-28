import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title }) => {
  return (
    <div className={`card ${className}`}>
      {title && <h2 className="text-xl font-bold mb-4 text-blue-900">{title}</h2>}
      {children}
    </div>
  );
};
