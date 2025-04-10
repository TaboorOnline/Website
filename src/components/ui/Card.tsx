// src/components/ui/Card.tsx
import React from 'react';
import { motion, Variants } from 'framer-motion';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
  initial?: 'hidden' | 'visible' | object;
  animate?: 'hidden' | 'visible' | object;
  transition?: object;
  whileHover?: object;
  whileTap?: object;
  variants?: Variants;
  viewport?: object;
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 } 
  }
};

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverEffect = false,
  initial = 'hidden',
  animate = 'visible',
  transition,
  whileHover = hoverEffect ? { y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' } : undefined,
  whileTap = { scale: 0.98 },
  variants = cardVariants,
  viewport = { once: true, amount: 0.25 },
}) => {
  // Base card style
  const cardClass = `
    bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md
    ${hoverEffect ? 'cursor-pointer transition-all duration-300' : ''}
    ${className}
  `;

  return (
    <motion.div
      className={cardClass}
      initial={initial}
      animate={animate}
      transition={transition}
      whileHover={whileHover}
      whileTap={onClick ? whileTap : undefined}
      variants={variants}
      viewport={viewport}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

// Sub-components for Card structure
Card.Header = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-4 border-b border-gray-100 dark:border-gray-700 ${className}`}>
    {children}
  </div>
);

Card.Body = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-4 ${className}`}>
    {children}
  </div>
);

Card.Footer = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-4 border-t border-gray-100 dark:border-gray-700 ${className}`}>
    {children}
  </div>
);

Card.Title = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <h3 className={`font-semibold text-lg text-gray-900 dark:text-white ${className}`}>
    {children}
  </h3>
);

Card.Subtitle = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <p className={`text-sm text-gray-500 dark:text-gray-400 ${className}`}>
    {children}
  </p>
);

Card.Image = ({ src, alt, className = '' }: { src: string; alt: string; className?: string }) => (
  <div className={`w-full ${className}`}>
    <img src={src} alt={alt} className="w-full h-auto object-cover" />
  </div>
);

export default Card;