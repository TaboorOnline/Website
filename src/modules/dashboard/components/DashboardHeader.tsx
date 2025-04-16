// src/modules/dashboard/components/DashboardHeader.tsx
// import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

interface DashboardHeaderProps {
  title: string;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
}

const DashboardHeader = ({ title, subtitle, actions }: DashboardHeaderProps) => {
  // const { t } = useTranslation();

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
        {subtitle && (
          <p className="text-gray-600 dark:text-gray-400 mt-1">{subtitle}</p>
        )}
      </motion.div>

      {actions && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {actions}
        </motion.div>
      )}
    </div>
  );
};

export default DashboardHeader;
