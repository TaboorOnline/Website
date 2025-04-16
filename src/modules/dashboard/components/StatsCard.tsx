// src/modules/dashboard/components/StatsCard.tsx
import { ReactNode, useState } from 'react';
import { FiArrowUp, FiArrowDown, FiInfo } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

interface TrendData {
  value: number;
  isPositive: boolean;
  label?: string;
}

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  trend?: TrendData;
  subtitle?: string;
  isLoading?: boolean;
  color?: 'blue' | 'purple' | 'green' | 'amber' | 'red' | 'gray' | 'indigo' | 'teal';
  className?: string;
  tooltip?: string;
  onClick?: () => void;
  animateValue?: boolean;
}

const StatsCard = ({
  title,
  value,
  icon,
  trend,
  subtitle,
  isLoading = false,
  color = 'blue',
  className = '',
  tooltip,
  onClick,
  animateValue = true,
}: StatsCardProps) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const isClickable = !!onClick;

  // Enhanced color mapping with more sophisticated styles
  const colorStyles = {
    blue: {
      gradientFrom: 'from-blue-400/10',
      gradientTo: 'to-blue-500/5',
      bgLight: 'bg-blue-50',
      bgDark: 'dark:bg-blue-900/20',
      textLight: 'text-blue-700',
      textDark: 'dark:text-blue-400',
      iconBg: 'bg-blue-100 dark:bg-blue-900/40',
      iconColor: 'text-blue-600 dark:text-blue-400',
      borderLight: 'border-blue-100',
      borderDark: 'dark:border-blue-800/30',
      trendUp: 'text-green-600 dark:text-green-400',
      trendDown: 'text-red-600 dark:text-red-400',
      hoverBg: 'hover:bg-blue-50/50 dark:hover:bg-blue-900/10',
      focusRing: 'focus:ring-blue-500/30',
      iconGlow: 'blue',
      decorationColor: 'rgba(59, 130, 246, 0.1)',
    },
    purple: {
      gradientFrom: 'from-purple-400/10',
      gradientTo: 'to-purple-500/5',
      bgLight: 'bg-purple-50',
      bgDark: 'dark:bg-purple-900/20',
      textLight: 'text-purple-700',
      textDark: 'dark:text-purple-400',
      iconBg: 'bg-purple-100 dark:bg-purple-900/40',
      iconColor: 'text-purple-600 dark:text-purple-400',
      borderLight: 'border-purple-100',
      borderDark: 'dark:border-purple-800/30',
      trendUp: 'text-green-600 dark:text-green-400',
      trendDown: 'text-red-600 dark:text-red-400',
      hoverBg: 'hover:bg-purple-50/50 dark:hover:bg-purple-900/10',
      focusRing: 'focus:ring-purple-500/30',
      iconGlow: 'purple',
      decorationColor: 'rgba(147, 51, 234, 0.1)',
    },
    green: {
      gradientFrom: 'from-green-400/10',
      gradientTo: 'to-green-500/5',
      bgLight: 'bg-green-50',
      bgDark: 'dark:bg-green-900/20',
      textLight: 'text-green-700',
      textDark: 'dark:text-green-400',
      iconBg: 'bg-green-100 dark:bg-green-900/40',
      iconColor: 'text-green-600 dark:text-green-400',
      borderLight: 'border-green-100',
      borderDark: 'dark:border-green-800/30',
      trendUp: 'text-green-600 dark:text-green-400',
      trendDown: 'text-red-600 dark:text-red-400',
      hoverBg: 'hover:bg-green-50/50 dark:hover:bg-green-900/10',
      focusRing: 'focus:ring-green-500/30',
      iconGlow: 'green',
      decorationColor: 'rgba(34, 197, 94, 0.1)',
    },
    amber: {
      gradientFrom: 'from-amber-400/10',
      gradientTo: 'to-amber-500/5',
      bgLight: 'bg-amber-50',
      bgDark: 'dark:bg-amber-900/20',
      textLight: 'text-amber-700',
      textDark: 'dark:text-amber-400',
      iconBg: 'bg-amber-100 dark:bg-amber-900/40',
      iconColor: 'text-amber-600 dark:text-amber-400',
      borderLight: 'border-amber-100',
      borderDark: 'dark:border-amber-800/30',
      trendUp: 'text-green-600 dark:text-green-400',
      trendDown: 'text-red-600 dark:text-red-400',
      hoverBg: 'hover:bg-amber-50/50 dark:hover:bg-amber-900/10',
      focusRing: 'focus:ring-amber-500/30',
      iconGlow: 'amber',
      decorationColor: 'rgba(251, 191, 36, 0.1)',
    },
    red: {
      gradientFrom: 'from-red-400/10',
      gradientTo: 'to-red-500/5',
      bgLight: 'bg-red-50',
      bgDark: 'dark:bg-red-900/20',
      textLight: 'text-red-700',
      textDark: 'dark:text-red-400',
      iconBg: 'bg-red-100 dark:bg-red-900/40',
      iconColor: 'text-red-600 dark:text-red-400',
      borderLight: 'border-red-100',
      borderDark: 'dark:border-red-800/30',
      trendUp: 'text-green-600 dark:text-green-400',
      trendDown: 'text-red-600 dark:text-red-400',
      hoverBg: 'hover:bg-red-50/50 dark:hover:bg-red-900/10',
      focusRing: 'focus:ring-red-500/30',
      iconGlow: 'red',
      decorationColor: 'rgba(239, 68, 68, 0.1)',
    },
    indigo: {
      gradientFrom: 'from-indigo-400/10',
      gradientTo: 'to-indigo-500/5',
      bgLight: 'bg-indigo-50',
      bgDark: 'dark:bg-indigo-900/20',
      textLight: 'text-indigo-700',
      textDark: 'dark:text-indigo-400',
      iconBg: 'bg-indigo-100 dark:bg-indigo-900/40',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      borderLight: 'border-indigo-100',
      borderDark: 'dark:border-indigo-800/30',
      trendUp: 'text-green-600 dark:text-green-400',
      trendDown: 'text-red-600 dark:text-red-400',
      hoverBg: 'hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10',
      focusRing: 'focus:ring-indigo-500/30',
      iconGlow: 'indigo',
      decorationColor: 'rgba(99, 102, 241, 0.1)',
    },
    teal: {
      gradientFrom: 'from-teal-400/10',
      gradientTo: 'to-teal-500/5',
      bgLight: 'bg-teal-50',
      bgDark: 'dark:bg-teal-900/20',
      textLight: 'text-teal-700',
      textDark: 'dark:text-teal-400',
      iconBg: 'bg-teal-100 dark:bg-teal-900/40',
      iconColor: 'text-teal-600 dark:text-teal-400',
      borderLight: 'border-teal-100',
      borderDark: 'dark:border-teal-800/30',
      trendUp: 'text-green-600 dark:text-green-400',
      trendDown: 'text-red-600 dark:text-red-400',
      hoverBg: 'hover:bg-teal-50/50 dark:hover:bg-teal-900/10',
      focusRing: 'focus:ring-teal-500/30',
      iconGlow: 'teal',
      decorationColor: 'rgba(20, 184, 166, 0.1)',
    },
    gray: {
      gradientFrom: 'from-gray-400/10',
      gradientTo: 'to-gray-500/5',
      bgLight: 'bg-gray-50',
      bgDark: 'dark:bg-gray-800',
      textLight: 'text-gray-700',
      textDark: 'dark:text-gray-300',
      iconBg: 'bg-gray-100 dark:bg-gray-700',
      iconColor: 'text-gray-600 dark:text-gray-400',
      borderLight: 'border-gray-100',
      borderDark: 'dark:border-gray-700',
      trendUp: 'text-green-600 dark:text-green-400',
      trendDown: 'text-red-600 dark:text-red-400',
      hoverBg: 'hover:bg-gray-50/50 dark:hover:bg-gray-800/50',
      focusRing: 'focus:ring-gray-500/30',
      iconGlow: 'gray',
      decorationColor: 'rgba(156, 163, 175, 0.1)',
    },
  };
  
  const styles = colorStyles[color] || colorStyles['blue'];

  // Animation for the counter effect
  const CounterValue = ({ value: targetValue }: { value: number | string }) => {
    if (typeof targetValue !== 'number' || !animateValue) {
      return <span>{typeof targetValue === 'number' ? targetValue.toLocaleString() : targetValue}</span>;
    }

    return (
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        key={targetValue}
      >
        <CountUp target={targetValue} />
      </motion.span>
    );
  };

  // Simple counter component
  const CountUp = ({ target }: { target: number }) => {
    return <>{target.toLocaleString()}</>;
  };

  // Enhanced icon with glow effect
  const IconWithGlow = () => (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", duration: 0.5 }}
      className={`relative flex items-center justify-center p-2.5 rounded-xl ${styles.iconBg} ${styles.iconColor}`}
    >
      <div className="relative z-10">{icon}</div>
      {!isLoading && (
        <div
          className="absolute inset-0 rounded-xl opacity-60 blur-md"
          style={{
            background: `radial-gradient(circle at center, ${styles.decorationColor} 0%, transparent 70%)`,
            zIndex: 0
          }}
        ></div>
      )}
    </motion.div>
  );

  // Build the component
  const CardComponent = (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={isClickable ? { scale: 1.02, transition: { duration: 0.2 } } : undefined}
      whileTap={isClickable ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={`
        relative overflow-hidden 
        bg-white dark:bg-gray-800
        border ${styles.borderLight} ${styles.borderDark}
        rounded-xl shadow-sm 
        ${isClickable ? `cursor-pointer ${styles.hoverBg} transition-colors ${styles.focusRing} focus:outline-none focus:ring-2 focus-visible:ring-2` : ''}
        ${className}
      `}
      role={isClickable ? "button" : "region"}
      aria-label={isClickable ? `${title}: ${value}` : undefined}
      tabIndex={isClickable ? 0 : undefined}
    >
      <div className="p-6 relative">
        {/* Background decoration with subtle gradient */}
        <div 
          className={`absolute inset-0 bg-gradient-to-br ${styles.gradientFrom} ${styles.gradientTo} opacity-80`}
          aria-hidden="true"
        ></div>
        
        {/* Background pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(${styles.decorationColor} 2px, transparent 2px)`,
            backgroundSize: '20px 20px',
          }}
          aria-hidden="true"
        ></div>

        <div className="relative">
          {/* Header with title and icon */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {title}
                </h3>
                {tooltip && (
                  <div className="relative ml-1.5">
                    <button
                      type="button"
                      aria-label="Show information"
                      className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-gray-400 rounded-full"
                      onMouseEnter={() => setIsTooltipVisible(true)}
                      onMouseLeave={() => setIsTooltipVisible(false)}
                      onFocus={() => setIsTooltipVisible(true)}
                      onBlur={() => setIsTooltipVisible(false)}
                    >
                      <FiInfo size={14} />
                    </button>
                    <AnimatePresence>
                      {isTooltipVisible && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          transition={{ duration: 0.2 }}
                          className="absolute z-10 mt-1 -right-2 transform px-3 py-2 text-xs w-48 rounded-md shadow-lg bg-gray-900 text-white dark:bg-gray-700"
                          role="tooltip"
                        >
                          {tooltip}
                          <div className="absolute -top-1 right-2.5 w-2 h-2 rotate-45 bg-gray-900 dark:bg-gray-700"></div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
              {subtitle && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
            <IconWithGlow />
          </div>

          {/* Value with skeleton loading */}
          {isLoading ? (
            <div className="space-y-2">
              <div className="animate-pulse h-8 bg-gray-200 dark:bg-gray-700 rounded w-2/5"></div>
              {trend && <div className="animate-pulse h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mt-2"></div>}
            </div>
          ) : (
            <div>
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="flex items-baseline"
              >
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                  <CounterValue value={value} />
                </h2>
              </motion.div>

              {/* Trend indicator with improved design */}
              {trend && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="mt-3 flex items-center"
                >
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    trend.isPositive
                      ? `bg-green-100 dark:bg-green-900/30 ${styles.trendUp}`
                      : `bg-red-100 dark:bg-red-900/30 ${styles.trendDown}`
                  }`}>
                    {trend.isPositive ? (
                      <FiArrowUp className="mr-1 stroke-2" />
                    ) : (
                      <FiArrowDown className="mr-1 stroke-2" />
                    )}
                    {Math.abs(trend.value)}%
                  </span>
                  <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                    {trend.label || 'vs. last month'}
                  </span>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  return CardComponent;
};

export default StatsCard;