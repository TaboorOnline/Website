// src/shared/components/Card.tsx
import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  footer?: ReactNode;
  onClick?: () => void;
  clickable?: boolean;
  hoverable?: boolean;
}

const Card = ({
  title,
  subtitle,
  children,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  footer,
  onClick,
  clickable = false,
  hoverable = false,
}: CardProps) => {
  // Base card class
  const cardBaseClass = 'bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden';
  
  // Optional classes
  const hoverClass = hoverable ? 'hover:shadow-md transition-shadow duration-200' : '';
  const clickableClass = clickable ? 'cursor-pointer' : '';
  
  return (
    <motion.div
      className={`${cardBaseClass} ${hoverClass} ${clickableClass} ${className}`}
      onClick={onClick}
      whileHover={clickable || hoverable ? { y: -4 } : {}}
      transition={{ duration: 0.2 }}
    >
      {/* Card Header */}
      {(title || subtitle) && (
        <div className={`px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700 ${headerClassName}`}>
          {title && <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>}
          {subtitle && <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
        </div>
      )}
      
      {/* Card Body */}
      <div className={`px-4 py-5 sm:p-6 ${bodyClassName}`}>
        {children}
      </div>
      
      {/* Card Footer */}
      {footer && (
        <div className={`px-4 py-4 sm:px-6 border-t border-gray-200 dark:border-gray-700 ${footerClassName}`}>
          {footer}
        </div>
      )}
    </motion.div>
  );
};

export default Card;