// src/shared/components/NotFound.tsx
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from './Button';

const NotFound = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gray-50 dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <h1 className="text-9xl font-bold text-primary-600 dark:text-primary-400">404</h1>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
            {t('notFound.title')}
          </h2>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            {t('notFound.description')}
          </p>
        </motion.div>
        
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button onClick={() => window.history.back()}>
            {t('notFound.goBack')}
          </Button>
          <Link to="/">
            <Button variant="outline">
              {t('notFound.goHome')}
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;