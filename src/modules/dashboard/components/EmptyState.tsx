// src/modules/dashboard/components/EmptyState.tsx
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Button from '../../../shared/components/Button';

interface EmptyStateProps {
  title: string;
  message: string;
  icon: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const EmptyState = ({
  title,
  message,
  icon,
  actionLabel,
  onAction,
  className = '',
}: EmptyStateProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`py-12 flex flex-col items-center justify-center ${className}`}
    >
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6 shadow-inner"
      >
        <motion.div
          animate={{ 
            rotate: [0, 5, -5, 5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        >
          {icon}
        </motion.div>
      </motion.div>

      <motion.h2 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center"
      >
        {title}
      </motion.h2>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-6"
      >
        {message}
      </motion.p>

      {actionLabel && onAction && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Button onClick={onAction} size="lg" className="border border-gray-300 dark:border-gray-600 shadow-sm">
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmptyState;