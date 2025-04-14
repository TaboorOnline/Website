// src/modules/landing/components/Hero.tsx
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../../../shared/components/Button';
import useIntersectionObserver from '../../../shared/hooks/useIntersectionObserver';
import { useTheme } from '../../../shared/hooks/useTheme';

const Hero = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [heroRef, isVisible] = useIntersectionObserver({ threshold: 0.1, triggerOnce: true });

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

  return (
    <motion.section
      ref={heroRef as React.RefObject<HTMLElement>}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={containerVariants}
      className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 py-24 md:py-32"
    >
      {/* Modern background with subtle patterns */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-1/2 bg-gradient-to-br from-blue-50/30 to-transparent dark:from-blue-900/10 dark:to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-tr from-purple-50/20 to-transparent dark:from-purple-900/10 dark:to-transparent"></div>
        
        {/* Decorative grid patterns */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIgMCAyIC44IDIgMnYyMGMwIDEuMi0uOCAyLTIgMkgxOGMtMS4yIDAtMi0uOC0yLTJWMjBjMC0xLjIuOC0yIDItMmgxOHoiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')] dark:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIgMCAyIC44IDIgMnYyMGMwIDEuMi0uOCAyLTIgMkgxOGMtMS4yIDAtMi0uOC0yLTJWMjBjMC0xLjIuOC0yIDItMmgxOHoiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')]"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div variants={itemVariants}>
              <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100/80 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6 backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/50">
                {t('hero.badge')}
              </span>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants} 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
            >
              {t('hero.title')}{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                {t('hero.titleHighlight')}
              </span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants} 
              className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-xl leading-relaxed"
            >
              {t('hero.subtitle')}
            </motion.p>
            
            <motion.div 
              variants={itemVariants} 
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/contact" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto shadow-lg shadow-blue-500/20 dark:shadow-blue-800/30 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all duration-300 text-white"
                >
                  {t('hero.primaryCta')}
                </Button>
              </Link>
              <Link to="/services" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
                >
                  {t('hero.secondaryCta')}
                </Button>
              </Link>
            </motion.div>
            
            <motion.div variants={itemVariants} className="mt-16">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 font-medium">
                {t('hero.trustedBy')}
              </p>
              <div className="flex flex-wrap gap-8 items-center">
                {/* Modern client logos with subtle gradients */}
                <div className="h-7 w-24 rounded-md bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 opacity-70 dark:opacity-50 flex items-center justify-center"></div>
                <div className="h-7 w-20 rounded-md bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 opacity-70 dark:opacity-50 flex items-center justify-center"></div>
                <div className="h-7 w-28 rounded-md bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 opacity-70 dark:opacity-50 flex items-center justify-center"></div>
                <div className="h-7 w-24 rounded-md bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 opacity-70 dark:opacity-50 flex items-center justify-center"></div>
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            variants={itemVariants}
            className="relative mt-8 lg:mt-0"
          >
            {/* Modern glass card effect */}
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/90 to-purple-500/90 dark:from-blue-600/90 dark:to-purple-600/90 backdrop-blur-sm"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="w-4/5 h-4/5 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-white/20 dark:border-gray-700/30"
                >
                  {/* Modern app mockup */}
                  <div className="bg-gray-100 dark:bg-gray-700 h-8 flex items-center px-4 border-b border-gray-200 dark:border-gray-600">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-400 dark:bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-400 dark:bg-amber-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400 dark:bg-green-500"></div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded-lg mb-6 w-3/4"></div>
                    <div className="space-y-3">
                      <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded-full w-full"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded-full w-11/12"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded-full w-4/5"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-8">
                      <div className="h-28 bg-gray-200 dark:bg-gray-600 rounded-lg"></div>
                      <div className="h-28 bg-gray-200 dark:bg-gray-600 rounded-lg"></div>
                    </div>
                    <div className="h-9 bg-blue-100 dark:bg-blue-900/50 rounded-lg mt-8 w-1/3 flex items-center justify-center">
                      <div className="w-16 h-2.5 bg-blue-500/70 dark:bg-blue-400/70 rounded-full"></div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
            
            {/* Decorative elements with more modern styling */}
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -bottom-6 -right-6 w-28 h-28 bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 rounded-lg z-10 shadow-lg"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -top-6 -left-6 w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-full z-10 shadow-lg"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
            </motion.div>
            
            {/* Adding a small floating element for more depth */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-1/2 -right-3 w-6 h-6 bg-white dark:bg-gray-800 rounded-full z-10 shadow-lg border border-blue-200 dark:border-blue-800"
            />
            
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-1/4 -left-3 w-4 h-4 bg-purple-200 dark:bg-purple-800 rounded-full z-10 shadow-sm"
            />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default Hero;  