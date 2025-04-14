// src/modules/landing/components/Timeline.tsx
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiClock } from 'react-icons/fi';
import { useCompanyHistory } from '../services/landingService';
import useIntersectionObserver from '../../../shared/hooks/useIntersectionObserver';
import { useTheme } from '../../../shared/hooks/useTheme';
import Image from '../../../shared/components/Image';

const Timeline = () => {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const { data: history, isLoading, error } = useCompanyHistory();
  const [sectionRef, isVisible] = useIntersectionObserver({ threshold: 0.1, triggerOnce: true });
  
  const currentLanguage = i18n.language as 'en' | 'ar';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const renderTimelineItems = () => {
    if (isLoading) {
      return Array(4).fill(0).map((_, index) => (
        <div key={index} className="relative pl-12 pb-16 md:flex animate-pulse">
          <div className="absolute left-0 top-0 md:top-6 h-full">
            <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            {index !== 3 && <div className="h-full w-0.5 bg-gray-200 dark:bg-gray-700 ml-4"></div>}
          </div>
          <div className="md:w-32 text-lg font-semibold mb-3 md:mb-0 md:text-right md:mr-8">
            <div className="h-7 w-20 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          </div>
          <div className="md:flex-1 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="h-7 w-2/3 bg-gray-200 dark:bg-gray-700 rounded-md mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full mb-3 w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full mb-3 w-5/6"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-4/6"></div>
            <div className="mt-6 h-32 bg-gray-200 dark:bg-gray-700 rounded-lg w-full"></div>
          </div>
        </div>
      ));
    }

    if (error) {
      return (
        <div className="text-center py-8">
          <p className="text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 py-4 px-6 rounded-lg inline-block">
            {t('errors.historyLoadFailed')}
          </p>
        </div>
      );
    }

    return history?.map((item, index) => {
      const historyTranslations = (item.translations as Record<'en' | 'ar', any> | undefined)?.[currentLanguage] || {};
      const title = historyTranslations.title || item.title;
      const description = historyTranslations.description || item.description;
      const isLast = index === history.length - 1;
      
      return (
        <motion.div 
          key={item.id} 
          variants={itemVariants}
          className="relative pl-12 pb-16 md:flex group"
        >
          <div className="absolute left-0 top-0 md:top-6 h-full">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-500 shadow-md shadow-blue-500/20 dark:shadow-blue-800/30 flex items-center justify-center">
              <div className="h-2 w-2 bg-white rounded-full group-hover:scale-150 transition-transform duration-500"></div>
            </div>
            {!isLast && (
              <div className="h-full w-0.5 bg-gradient-to-b from-blue-500/80 via-blue-400/50 to-blue-300/20 dark:from-blue-600/80 dark:via-blue-500/50 dark:to-blue-400/20 ml-4"></div>
            )}
          </div>
          <div className="md:w-32 text-xl font-bold text-blue-600 dark:text-blue-400 mb-3 md:mb-0 md:text-right md:mr-8 transition-transform duration-300 transform group-hover:-translate-y-1">
            {item.year}
          </div>
          <div className="md:flex-1 bg-white dark:bg-gray-800 p-7 rounded-xl shadow-md hover:shadow-xl border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 transform group-hover:-translate-y-1">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">{title}</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{description}</p>
            {item.image_url && (
              <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                <Image 
                  src={item.image_url} 
                  alt={title}
                  className="w-full max-h-56 object-cover transition-transform duration-700 group-hover:scale-105"
                  customIcon={
                    <div className="flex flex-col items-center justify-center h-40 bg-gray-200 dark:bg-gray-700 w-full">
                      <FiClock className="w-12 h-12 text-gray-400 dark:text-gray-600 mb-2" />
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {t('timeline.imageNotAvailable')}
                      </div>
                    </div>
                  }
                />
              </div>
            )}
          </div>
        </motion.div>
      );
    });
  };

  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900" id="history">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/30 dark:bg-blue-900/10 rounded-full blur-3xl opacity-70 transform -translate-x-1/2"></div>
        <div className="absolute bottom-0 right-0 w-full h-1/3 bg-gradient-to-t from-purple-50/20 to-transparent dark:from-purple-900/10 dark:to-transparent"></div>
        
        {/* Decorative grid patterns */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIgMCAyIC44IDIgMnYyMGMwIDEuMi0uOCAyLTIgMkgxOGMtMS4yIDAtMi0uOC0yLTJWMjBjMC0xLjIuOC0yIDItMmgxOHoiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')] dark:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIgMCAyIC44IDIgMnYyMGMwIDEuMi0uOCAyLTIgMkgxOGMtMS4yIDAtMi0uOC0yLTJWMjBjMC0xLjIuOC0yIDItMmgxOHoiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')]"></div>
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          ref={sectionRef as React.RefObject<HTMLDivElement>}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.span 
            variants={itemVariants} 
            className="inline-block px-4 py-1.5 text-sm font-medium text-blue-700 dark:text-blue-300 bg-blue-100/80 dark:bg-blue-900/30 rounded-full mb-5 backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/50"
          >
            {t('timeline.badge')}
          </motion.span>
          <motion.h2 
            variants={itemVariants} 
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-5 leading-tight"
          >
            {t('timeline.title')}
          </motion.h2>
          <motion.p 
            variants={itemVariants} 
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            {t('timeline.subtitle')}
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={containerVariants}
          className="max-w-4xl mx-auto relative"
        >
          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-20 h-20 bg-purple-100/30 dark:bg-purple-900/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-10 left-1/4 w-32 h-32 bg-blue-100/30 dark:bg-blue-900/10 rounded-full blur-xl transform -translate-x-1/2"></div>
          
          {renderTimelineItems()}
        </motion.div>
      </div>
    </section>
  );
};

export default Timeline;