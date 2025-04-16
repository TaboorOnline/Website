import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCloud, FiCode, FiLayout, FiLifeBuoy, FiShoppingCart, FiSmartphone, FiTrendingUp } from 'react-icons/fi';
import { useServices } from '../../services/landingService';
// import { useTheme } from '../../../shared/hooks/useTheme';

const Services = () => {
  const { t, i18n } = useTranslation();
  // const { theme } = useTheme();
  const { data: services, isLoading, error } = useServices();
  const isRTL = i18n.language === 'ar';
  const iconMap = {
    'code': FiCode,
    'smartphone': FiSmartphone,
    'palette': FiLayout, // Using Layout as closest Feather icon for palette/design
    'cloud': FiCloud,
    'shopping-cart': FiShoppingCart,
    'trending-up': FiTrendingUp,
    'life-buoy': FiLifeBuoy
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
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

  const renderServices = () => {
    if (isLoading) {
      return Array(6).fill(0).map((_, index) => (
        <motion.div key={index} variants={itemVariants} className="animate-pulse">
          <div className="h-full bg-white dark:bg-gray-900 rounded-xl overflow-hidden">
            <div className="p-8">
              <div className="w-14 h-14 mb-6 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-2/3 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-4/6"></div>
              </div>
              <div className="h-6 w-28 mt-6 bg-gray-200 dark:bg-gray-800 rounded"></div>
            </div>
          </div>
        </motion.div>
      ));
    }

    if (error) {
      return (
        <div className="col-span-full text-center py-8">
          <p className="text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 py-4 px-6 rounded-lg inline-block">
            {t('errors.servicesLoadFailed')}
          </p>
        </div>
      );
    }

    const currentLanguage = i18n.language as 'en' | 'ar';

    return services?.map((service, index) => {
      // translations may be null, so cast or default to empty object
      const translations = (service.translations as Record<string, { title?: string; description?: string }> | null) || {};
      const serviceTranslations = translations[currentLanguage] || {};
      const title = serviceTranslations.title || service.title;
      const description = serviceTranslations.description || service.description;
      
      return (
        <motion.div key={index} variants={itemVariants}>
          <div 
            className="group h-full bg-white dark:bg-gray-900 rounded-xl overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/5"
            dir="auto"
          >
            <div className="p-8">
              <div className="text-indigo-600 dark:text-indigo-400 mb-6 transition-transform duration-300 transform group-hover:scale-110 group-hover:-rotate-12">
                <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl flex items-center justify-center">
                    {iconMap[service.icon] ? (
                    React.createElement(iconMap[service.icon], { className: "text-2xl" })
                    ) : (
                    <span className="text-2xl">✦</span>
                    )}
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300 z-4">{title}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{description}</p>
              
              <Link
                to={`/services#${service.id}`}
                className="inline-flex items-center font-medium text-indigo-600 dark:text-indigo-400 transition-all duration-300 hover:text-indigo-700 dark:hover:text-indigo-300 group/link"
              >
                {t('services.learnMore')}
                <FiArrowRight className={`w-4 h-4 transition-all duration-300 group-hover/link:translate-x-1 ${isRTL ? 'mr-2' : 'ml-2'}`} />
              </Link>
            </div>
          </div>
        </motion.div>
      );
    });
  };

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-950" id="services">
      <div className="container mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.div variants={itemVariants}>
            <span className="inline-block px-4 py-1 text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-5">
              {t('services.badge')}
            </span>
          </motion.div>
          
          <motion.h2 
            variants={itemVariants} 
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
          >
            {t('services.title')}
          </motion.h2>
          
          <motion.p 
            variants={itemVariants} 
            className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
          >
            {t('services.subtitle')}
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {renderServices()}
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="mt-16 text-center"
        >
          <motion.div variants={itemVariants}>
            <Link to="/services">
              <button className="px-8 py-4 text-white font-medium rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/30 dark:hover:shadow-indigo-500/20">
                {t('services.viewAll')}
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;