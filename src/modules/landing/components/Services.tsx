// src/modules/landing/components/Services.tsx
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { useServices } from '../../../shared/hooks/useSupabaseQuery';
import useIntersectionObserver from '../../../shared/hooks/useIntersectionObserver';
import { useTheme } from '../../../shared/hooks/useTheme';

const Services = () => {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const { data: services, isLoading, error } = useServices();
  const [sectionRef, isVisible] = useIntersectionObserver({ threshold: 0.1, triggerOnce: true });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const renderServices = () => {
    if (isLoading) {
      return Array(6).fill(0).map((_, index) => (
        <motion.div key={index} variants={itemVariants}>
          <div className="h-full bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 p-6 transition-all duration-300">
            <div className="flex flex-col h-full">
              <div className="w-14 h-14 mb-6 rounded-lg bg-blue-100/60 dark:bg-blue-900/30 animate-pulse"></div>
              <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded-md w-2/3 mb-5 animate-pulse"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full mb-3 w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full mb-3 w-5/6 animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full mb-3 w-4/6 animate-pulse"></div>
              </div>
              <div className="h-5 w-28 mt-4 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
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

    return services?.map((service) => {
      const serviceTranslations = service.translations?.[currentLanguage] || {};
      const title = serviceTranslations.title || service.title;
      const description = serviceTranslations.description || service.description;
      
      return (
        <motion.div key={service.id} variants={itemVariants}>
          <div 
            className="group h-full bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 p-6 transition-all duration-300"
          >
            <div className="flex flex-col h-full">
              <div className="text-blue-600 dark:text-blue-400 mb-6 transition-transform duration-300 group-hover:scale-110 transform-gpu">
                <div className="w-14 h-14 bg-blue-100/80 dark:bg-blue-900/40 rounded-lg flex items-center justify-center border border-blue-200/50 dark:border-blue-800/50 shadow-sm">
                  <span className="text-2xl">{service.icon || '✦'}</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">{title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-5 flex-1 leading-relaxed">{description}</p>
              
              <Link
                to={`/services#${service.id}`}
                className="text-blue-600 dark:text-blue-400 font-medium inline-flex items-center group/link"
              >
                {t('services.learnMore')}
                <FiArrowRight className="ml-2 w-4 h-4 transition-all duration-300 group-hover/link:translate-x-1" />
              </Link>
            </div>
          </div>
        </motion.div>
      );
    });
  };

  return (
    <section className="py-24 relative overflow-hidden bg-gray-50 dark:bg-gray-900" id="services">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-100/50 dark:bg-blue-900/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-full h-1/3 bg-gradient-to-t from-white/80 to-transparent dark:from-gray-900/80 dark:to-transparent"></div>
        
        {/* Decorative grid patterns */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIgMCAyIC44IDIgMnYyMGMwIDEuMi0uOCAyLTIgMkgxOGMtMS4yIDAtMi0uOC0yLTJWMjBjMC0xLjIuOC0yIDItMmgxOHoiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')] dark:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIgMCAyIC44IDIgMnYyMGMwIDEuMi0uOCAyLTIgMkgxOGMtMS4yIDAtMi0uOC0yLTJWMjBjMC0xLjIuOC0yIDItMmgxOHoiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')]"></div>
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          ref={sectionRef as React.RefObject<HTMLElement>}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.span 
            variants={itemVariants} 
            className="inline-block px-4 py-1.5 text-sm font-medium text-blue-700 dark:text-blue-300 bg-blue-100/80 dark:bg-blue-900/30 rounded-full mb-5 backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/50"
          >
            {t('services.badge')}
          </motion.span>
          
          <motion.h2 
            variants={itemVariants} 
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-5 leading-tight"
          >
            {t('services.title')}
          </motion.h2>
          
          <motion.p 
            variants={itemVariants} 
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            {t('services.subtitle')}
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative"
        >
          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-20 h-20 bg-purple-100/30 dark:bg-purple-900/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-10 left-1/3 w-32 h-32 bg-blue-100/30 dark:bg-blue-900/10 rounded-full blur-xl transform -translate-x-1/2"></div>
          
          {renderServices()}
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-16 text-center"
        >
          <Link to="/services">
            <button className="px-6 py-3 text-white font-medium rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 shadow-md hover:shadow-lg shadow-blue-500/20 dark:shadow-blue-800/30 transition-all duration-300">
              {t('services.viewAll')}
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;