// src/modules/dashboard/components/StatsCard.tsx
import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  isLoading?: boolean;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
}

const StatsCard = ({
  title,
  value,
  icon,
  trend,
  isLoading = false,
  color = 'primary',
}: StatsCardProps) => {
  const colorClasses = {
    primary: {
      bg: 'bg-primary-50 dark:bg-primary-900/20',
      text: 'text-primary-600 dark:text-primary-400',
    },
    secondary: {
      bg: 'bg-secondary-50 dark:bg-secondary-900/20',
      text: 'text-secondary-600 dark:text-secondary-400',
    },
    success: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      text: 'text-green-600 dark:text-green-400',
    },
    warning: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      text: 'text-yellow-600 dark:text-yellow-400',
    },
    danger: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      text: 'text-red-600 dark:text-red-400',
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      text: 'text-blue-600 dark:text-blue-400',
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
    >
      <div className="flex justify-between">
        <div className={`${colorClasses[color].bg} p-3 rounded-lg`}>
          <div className={`${colorClasses[color].text}`}>{icon}</div>
        </div>
        
        {trend && (
          <div className={`flex items-center ${trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 ${trend.isPositive ? '' : 'transform rotate-180'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <span className="text-sm font-medium ml-1">{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="mt-4 animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
        </div>
      ) : (
        <>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-4">
            {value}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{title}</p>
        </>
      )}
    </motion.div>
  );
};

export default StatsCard;