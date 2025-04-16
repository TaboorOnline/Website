// src/shared/components/Button.tsx
import { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref'> {
  variant?: 'indigo' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children: ReactNode;
}

const Button = ({
  variant = 'indigo',
  size = 'md',
  isLoading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) => {
  // Base classes
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  
  // Variant classes
  const variantClasses = {
    indigo: 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500',
    secondary: 'bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500',
    outline: 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500 dark:text-gray-200 dark:hover:bg-gray-800',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
  };
  
  // Loading and disabled state
  const stateClasses = (disabled || isLoading) ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer';
  
  // Full width
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // Combined classes
  const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${stateClasses} ${widthClasses} ${className}`;
  
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={combinedClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      {!isLoading && icon && iconPosition === 'left' && (
        <span className="mr-2">{icon}</span>
      )}
      
      {children}
      
      {!isLoading && icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
    </motion.button>
  );
};

export default Button;