// src/components/ui/Button.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  href?: string;
  to?: string;
  fullWidth?: boolean;
  className?: string;
  whileTapScale?: number;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  href,
  to,
  fullWidth = false,
  className = '',
  whileTapScale = 0.95,
  ...props
}) => {
  // Styles based on variant
  const variantStyles = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-sm',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100',
    outline: 'bg-transparent border border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/10',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-800 dark:hover:bg-gray-800 dark:text-gray-200',
    link: 'bg-transparent text-primary-600 hover:underline p-0 h-auto shadow-none',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm',
  };

  // Styles based on size
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm rounded',
    md: 'px-4 py-2 text-base rounded-md',
    lg: 'px-6 py-3 text-lg rounded-lg',
  };

  // Base button style
  const buttonClass = `
    inline-flex items-center justify-center font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-60 disabled:cursor-not-allowed
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;

  // Loading spinner
  const LoadingSpinner = () => (
    <svg
      className={`animate-spin ${leftIcon || rightIcon ? 'mx-2' : 'mr-2 rtl:ml-2 rtl:mr-0'} h-4 w-4`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );

  // Button content
  const content = (
    <>
      {isLoading && <LoadingSpinner />}
      {!isLoading && leftIcon && <span className="mr-2 rtl:ml-2 rtl:mr-0">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="ml-2 rtl:mr-2 rtl:ml-0">{rightIcon}</span>}
    </>
  );

  // If it's a link (href or to)
  if (href) {
    return (
      <motion.a
        href={href}
        className={buttonClass}
        whileTap={{ scale: whileTapScale }}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {content}
      </motion.a>
    );
  }

  if (to) {
    return (
      <motion.div whileTap={{ scale: whileTapScale }}>
        <Link to={to} className={buttonClass}>
          {content}
        </Link>
      </motion.div>
    );
  }

  // Regular button
  return (
    <motion.button
      type={type}
      className={buttonClass}
      disabled={disabled || isLoading}
      whileTap={{ scale: disabled ? 1 : whileTapScale }}
      {...props}
    >
      {content}
    </motion.button>
  );
};

export default Button;