// src/shared/components/NotFound.tsx
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiArrowLeft, FiAlertTriangle, FiSearch } from 'react-icons/fi';
import Button from './Button';

const NotFound = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-white dark:bg-gray-950 relative overflow-hidden">
      {/* Background color accents */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-indigo-100 dark:bg-indigo-950 rounded-full opacity-70"></div>
        <div className="absolute top-1/2 -left-24 w-48 h-48 bg-rose-100 dark:bg-rose-950 rounded-full opacity-70"></div>
        <div className="absolute -bottom-32 right-1/2 w-80 h-80 bg-amber-100 dark:bg-amber-950 rounded-full opacity-70"></div>
      </div>
      
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="text-center max-w-2xl relative z-10 bg-white/80 dark:bg-gray-900/80 p-10 rounded-2xl shadow-xl backdrop-blur-sm border border-gray-200 dark:border-gray-800"
      >
        <motion.div 
          variants={itemVariants}
          animate={floatingAnimation}
          className="mx-auto h-32 w-32 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-8 shadow-lg"
        >
          <span className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            4
          </span>
          <span className="text-9xl opacity-0 font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            0
          </span>
          <motion.div 
            animate={{ 
              rotate: [0, 10, -10, 10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="absolute"
          >
            <FiSearch className="text-8xl text-rose-500 dark:text-rose-400 opacity-80" />
          </motion.div>
          <span className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            4
          </span>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <span className="inline-block px-4 py-1 text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-4 bg-indigo-50 dark:bg-indigo-950/50 rounded-full">
            {t('notFound.badge') || 'Page Not Found'}
          </span>
        </motion.div>
        
        <motion.h2 
          variants={itemVariants} 
          className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
        >
          {t('notFound.title') || 'Oops! Page Not Found'}
        </motion.h2>
        
        <motion.p 
          variants={itemVariants} 
          className="text-lg text-gray-600 dark:text-gray-400 mb-8"
        >
          {t('notFound.description') || "We couldn't find the page you're looking for. The page might have been moved, deleted, or never existed."}
        </motion.p>
        
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button 
            onClick={() => window.history.back()} 
            icon={<FiArrowLeft />} 
            iconPosition="left"
            variant="indigo"
            size="lg"
            className="w-full sm:w-auto"
          >
            {t('notFound.goBack') || 'Go Back'}
          </Button>
          
          <Link to="/" className="w-full sm:w-auto">
            <Button 
              variant="outline" 
              icon={<FiHome />} 
              iconPosition="left"
              size="lg"
              className="w-full"
            >
              {t('notFound.goHome') || 'Go to Homepage'}
            </Button>
          </Link>
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          className="mt-10 text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center"
        >
          <FiAlertTriangle className="mr-2" />
          {t('notFound.help') || 'Need help? Contact our support team.'}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;