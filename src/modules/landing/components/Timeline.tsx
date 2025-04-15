// src/modules/landing/components/Timeline.tsx
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiClock } from 'react-icons/fi';
import { useCompanyHistory } from '../services/landingService';
// import { useTheme } from '../../../shared/hooks/useTheme';
import Image from '../../../shared/components/Image';

const Timeline = () => {
  const { t, i18n } = useTranslation();
  // const { theme } = useTheme();
  const { data: history, isLoading, error } = useCompanyHistory();
  
  const currentLanguage = i18n.language as 'en' | 'ar';
  // const isRTL = currentLanguage === 'ar';

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12
      }
    }
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const renderTimelineItems = () => {
    if (isLoading) {
      return Array(4).fill(0).map((_, index) => (
        <div key={index} className="relative animate-pulse">
          {/* Year marker */}
          <div className="flex mb-6">
            <div className="w-20 h-10 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
          </div>

          {/* Content card */}
          <div className={`relative ${index !== 3 ? 'pb-16' : ''}`}>
            <div className="ml-5 relative">
              {/* Connector */}
              <div className="absolute top-0 left-0 h-full w-0.5 bg-indigo-200 dark:bg-indigo-900"></div>
              
              {/* Dot */}
              <div className="absolute top-2 left-0 w-5 h-5 rounded-full bg-indigo-200 dark:bg-indigo-900 -translate-x-2"></div>
              
              {/* Content */}
              <div className="pl-8">
                <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-lg w-3/4 mb-4"></div>
                <div className="space-y-3 mb-6">
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full w-5/6"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full w-4/6"></div>
                </div>
                <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded-xl w-full"></div>
              </div>
            </div>
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
          className="relative"
          dir="auto"
        >
          {/* Year marker */}
          <div className="flex mb-6">
            <div className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-bold rounded-lg">
              {item.year}
            </div>
          </div>

          {/* Content card */}
          <div className={`relative ${!isLast ? 'pb-16' : ''}`}>
            <div className="ml-5 relative">
              {/* Connector */}
              {!isLast && (
                <div className="absolute top-0 left-0 h-full w-0.5 bg-gradient-to-b from-indigo-400 via-indigo-300 to-indigo-200 dark:from-indigo-600 dark:via-indigo-700 dark:to-indigo-800"></div>
              )}
              
              {/* Dot */}
              <div className="absolute top-2 left-0 w-5 h-5 rounded-full bg-indigo-400 dark:bg-indigo-600 -translate-x-2"></div>
              
              {/* Content */}
              <div className="pl-8">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg shadow-indigo-500/5 dark:shadow-indigo-950/10 border border-indigo-100 dark:border-indigo-900/50 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-950/20">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{description}</p>
                  
                  {item.image_url && (
                    <div className="overflow-hidden rounded-lg">
                      <Image 
                        src={item.image_url} 
                        alt={title}
                        className="w-full max-h-56 object-cover transition-transform duration-700 hover:scale-105"
                        customIcon={
                          <div className="flex flex-col items-center justify-center h-40 bg-indigo-50 dark:bg-indigo-950/30">
                            <FiClock className="w-14 h-14 text-indigo-300 dark:text-indigo-700 mb-2" />
                            <div className="text-sm text-indigo-500 dark:text-indigo-400">
                              {t('timeline.imageNotAvailable')}
                            </div>
                          </div>
                        }
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      );
    });
  };

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-950" id="history">
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
              {t('timeline.badge')}
            </span>
          </motion.div>
          
          <motion.h2 
            variants={itemVariants} 
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
          >
            {t('timeline.title')}
          </motion.h2>
          
          <motion.p 
            variants={itemVariants} 
            className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
          >
            {t('timeline.subtitle')}
          </motion.p>
        </motion.div>

        {/* Main timeline content */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
          className="max-w-4xl mx-auto"
        >
          {renderTimelineItems()}
        </motion.div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-indigo-100 dark:bg-indigo-950 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-70 dark:opacity-50 -z-10"></div>
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-rose-100 dark:bg-rose-950 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-70 dark:opacity-50 -z-10"></div>
      </div>
    </section>
  );
};

export default Timeline;