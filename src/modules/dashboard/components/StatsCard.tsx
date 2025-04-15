// src/modules/dashboard/components/StatsCard.tsx
import { ReactNode } from 'react';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface TrendData {
  value: number;
  isPositive: boolean;
}

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  trend?: TrendData;
  isLoading?: boolean;
  color?: 'blue' | 'purple' | 'emerald' | 'amber' | 'red' | 'gray';
  className?: string;
}

const StatsCard = ({
  title,
  value,
  icon,
  trend,
  isLoading = false,
  color = 'blue',
  className = '',
}: StatsCardProps) => {
  // Color mapping for different styles
  const colorStyles = {
    blue: {
      bgLight: 'bg-blue-50',
      bgDark: 'dark:bg-blue-900/20',
      textLight: 'text-blue-700',
      textDark: 'dark:text-blue-400',
      iconBg: 'bg-blue-100 dark:bg-blue-900/40',
      iconColor: 'text-blue-600 dark:text-blue-400',
      trendUp: 'text-emerald-600 dark:text-emerald-400',
      trendDown: 'text-red-600 dark:text-red-400',
    },
    purple: {
      bgLight: 'bg-purple-50',
      bgDark: 'dark:bg-purple-900/20',
      textLight: 'text-purple-700',
      textDark: 'dark:text-purple-400',
      iconBg: 'bg-purple-100 dark:bg-purple-900/40',
      iconColor: 'text-purple-600 dark:text-purple-400',
      trendUp: 'text-emerald-600 dark:text-emerald-400',
      trendDown: 'text-red-600 dark:text-red-400',
    },
    emerald: {
      bgLight: 'bg-emerald-50',
      bgDark: 'dark:bg-emerald-900/20',
      textLight: 'text-emerald-700',
      textDark: 'dark:text-emerald-400',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/40',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      trendUp: 'text-emerald-600 dark:text-emerald-400',
      trendDown: 'text-red-600 dark:text-red-400',
    },
    amber: {
      bgLight: 'bg-amber-50',
      bgDark: 'dark:bg-amber-900/20',
      textLight: 'text-amber-700',
      textDark: 'dark:text-amber-400',
      iconBg: 'bg-amber-100 dark:bg-amber-900/40',
      iconColor: 'text-amber-600 dark:text-amber-400',
      trendUp: 'text-emerald-600 dark:text-emerald-400',
      trendDown: 'text-red-600 dark:text-red-400',
    },
    red: {
      bgLight: 'bg-red-50',
      bgDark: 'dark:bg-red-900/20',
      textLight: 'text-red-700',
      textDark: 'dark:text-red-400',
      iconBg: 'bg-red-100 dark:bg-red-900/40',
      iconColor: 'text-red-600 dark:text-red-400',
      trendUp: 'text-emerald-600 dark:text-emerald-400',
      trendDown: 'text-red-600 dark:text-red-400',
    },
    gray: {
      bgLight: 'bg-gray-50',
      bgDark: 'dark:bg-gray-800',
      textLight: 'text-gray-700',
      textDark: 'dark:text-gray-300',
      iconBg: 'bg-gray-100 dark:bg-gray-700',
      iconColor: 'text-gray-600 dark:text-gray-400',
      trendUp: 'text-emerald-600 dark:text-emerald-400',
      trendDown: 'text-red-600 dark:text-red-400',
    },
  };
  
  const styles = colorStyles[color];

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm ${className}`}>
      <div className="p-6 relative">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 h-full w-1/2 overflow-hidden pointer-events-none">
          <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 ${
            color === 'gray' ? 'bg-gray-500' : `bg-${color}-500`
          }`}></div>
        </div>

        <div className="relative">
          {/* Header with title and icon */}
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
            <div className={`p-2 rounded-md ${styles.iconBg} ${styles.iconColor}`}>
              {icon}
            </div>
          </div>

          {/* Value */}
          {isLoading ? (
            <div className="animate-pulse mt-3 h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-baseline"
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                {typeof value === 'number' ? value.toLocaleString() : value}
              </h2>
            </motion.div>
          )}

          {/* Trend indicator */}
          {trend && !isLoading && (
            <div className="mt-3 flex items-center">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                trend.isPositive
                  ? `bg-emerald-100 dark:bg-emerald-900/30 ${styles.trendUp}`
                  : `bg-red-100 dark:bg-red-900/30 ${styles.trendDown}`
              }`}>
                {trend.isPositive ? (
                  <FiArrowUp className="mr-1" />
                ) : (
                  <FiArrowDown className="mr-1" />
                )}
                {Math.abs(trend.value)}%
              </span>
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">vs. last month</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;