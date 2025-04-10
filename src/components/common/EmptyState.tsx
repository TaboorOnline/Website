// src/components/common/EmptyState.tsx
import React from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  actionOnClick?: () => void;
  actionTo?: string;
  secondaryActionLabel?: string;
  secondaryActionOnClick?: () => void;
  secondaryActionTo?: string;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionLabel,
  actionOnClick,
  actionTo,
  secondaryActionLabel,
  secondaryActionOnClick,
  secondaryActionTo,
  className = '',
}) => {
  // تأثيرات الحركة
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.2,
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {icon && (
        <motion.div
          className="mb-6 text-gray-400 dark:text-gray-500"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          {icon}
        </motion.div>
      )}

      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{title}</h3>

      {description && (
        <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">{description}</p>
      )}

      <div className="flex flex-wrap gap-3 justify-center">
        {actionLabel && (actionOnClick || actionTo) && (
          <Button
            variant="primary"
            onClick={actionOnClick}
            to={actionTo}
          >
            {actionLabel}
          </Button>
        )}

        {secondaryActionLabel && (secondaryActionOnClick || secondaryActionTo) && (
          <Button
            variant="outline"
            onClick={secondaryActionOnClick}
            to={secondaryActionTo}
          >
            {secondaryActionLabel}
          </Button>
        )}
      </div>
    </motion.div>
  );
};

// مكون مسبق الإعداد للمحتوى الفارغ
export const NoContentEmptyState: React.FC<{ message: string; actionLabel?: string; actionTo?: string }> = ({
  message,
  actionLabel,
  actionTo,
}) => {
  return (
    <EmptyState
      title={message}
      icon={
        <svg
          className="w-16 h-16"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      }
      actionLabel={actionLabel}
      actionTo={actionTo}
    />
  );
};

// مكون مسبق الإعداد لحالة الخطأ
export const ErrorEmptyState: React.FC<{ message: string; onRetry?: () => void }> = ({
  message,
  onRetry,
}) => {
  return (
    <EmptyState
      title="حدث خطأ ما"
      description={message}
      icon={
        <svg
          className="w-16 h-16"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      }
      actionLabel="إعادة المحاولة"
      actionOnClick={onRetry}
    />
  );
};

export default EmptyState;