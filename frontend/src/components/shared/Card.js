import React from 'react';

/**
 * Responsive Card Component
 * 
 * Props:
 * - children: Card content
 * - className: Additional CSS classes
 * - onClick: Click handler
 * - hover: Enable hover effect (default: false)
 * - padding: Custom padding (default: uses CSS)
 * - fullWidth: Force full width (default: false)
 */
export default function Card({ 
  children, 
  className = '', 
  onClick, 
  hover = false,
  padding,
  fullWidth = false,
  ...props 
}) {
  const cardClasses = [
    'responsive-card',
    hover ? 'card-hover' : '',
    fullWidth ? 'card-full-width' : '',
    className
  ].filter(Boolean).join(' ');

  const style = padding ? { padding } : {};

  return (
    <div 
      className={cardClasses} 
      onClick={onClick}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Card Header Component
 */
export function CardHeader({ title, subtitle, icon, action, className = '' }) {
  return (
    <div className={`card-header ${className}`}>
      <div className="card-header-left">
        <h2>
          {icon && <span>{icon}</span>}
          {title}
        </h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action && <div className="card-header-right">{action}</div>}
    </div>
  );
}

/**
 * Card Body Component
 */
export function CardBody({ children, className = '' }) {
  return (
    <div className={`card-body ${className}`}>
      {children}
    </div>
  );
}

/**
 * Card Footer Component
 */
export function CardFooter({ children, className = '' }) {
  return (
    <div className={`card-footer ${className}`}>
      {children}
    </div>
  );
}

/**
 * Card Grid Container
 * For displaying multiple cards in a responsive grid
 * 
 * Props:
 * - columns: Number of columns (desktop: 3, tablet: 2, mobile: 1)
 * - gap: Gap between cards (default: 16px)
 * - minCardWidth: Minimum card width (default: 250px)
 */
export function CardGrid({ 
  children, 
  columns = 3, 
  gap = '16px',
  minCardWidth = '250px',
  className = '' 
}) {
  const style = {
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fit, minmax(${minCardWidth}, 1fr))`,
    gap: gap,
    width: '100%',
    maxWidth: '100%'
  };

  return (
    <div className={`card-grid ${className}`} style={style}>
      {children}
    </div>
  );
}
