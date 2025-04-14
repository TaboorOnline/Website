// src/modules/dashboard/components/EmptyState.tsx
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Button from '../../../shared/components/Button';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState = ({
  title,
  message,
  icon,
  actionLabel,
  onAction,
}: EmptyStateProps) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center py-16 px-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
    >
      {icon && (
        <div className="flex justify-center mb-4">
          {icon}
        </div>
      )}
      
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title || t('emptyState.title')}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
        {message || t('emptyState.message')}
      </p>
      
      {onAction && (
        <Button onClick={onAction}>
          {actionLabel || t('emptyState.action')}
        </Button>
      )}
    </motion.div>
  );
};

export default EmptyState;