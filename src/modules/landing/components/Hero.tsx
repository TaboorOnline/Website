// src/modules/landing/components/Hero.tsx
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../../../shared/components/Button';
// import { useTheme } from '../../../shared/hooks/useTheme';

const Hero = () => {
  const { t, i18n } = useTranslation();
  // const { theme } = useTheme();
  const isRTL = i18n.language === 'ar';

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section 
      className="relative min-h-screen flex items-center bg-white dark:bg-gray-950 overflow-hidden"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Color accent */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-indigo-100 dark:bg-indigo-950 rounded-full"></div>
        <div className="absolute top-1/2 -left-24 w-48 h-48 bg-rose-100 dark:bg-rose-950 rounded-full"></div>
        <div className="absolute -bottom-32 right-1/2 w-80 h-80 bg-amber-100 dark:bg-amber-950 rounded-full"></div>
      </div>

      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="flex flex-col lg:flex-row items-center">
          {/* Left side content */}
          <motion.div 
            className="w-full lg:w-1/2 lg:pr-16 mb-12 lg:mb-0"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-6">
                {t('hero.badge')}
              </span>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants} 
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 text-gray-900 dark:text-white"
            >
              <span className="block">{t('hero.title')}</span>
              <span className="block mt-2 text-indigo-600 dark:text-indigo-400">{t('hero.titleHighlight')}</span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants} 
              className="text-lg sm:text-xl mb-8 text-gray-600 dark:text-gray-300 max-w-lg"
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
                  className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white"
                >
                  {t('hero.primaryCta')}
                </Button>
              </Link>
              <Link to="/services" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {t('hero.secondaryCta')}
                </Button>
              </Link>
            </motion.div>
            
            <motion.div variants={itemVariants} className="mt-16">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
                {t('hero.trustedBy')}
              </p>
              <div className="flex flex-wrap gap-8 items-center">
                {['ACME', 'Globex', 'Stark', 'Wayne'].map((name, index) => (
                  <div key={index} className="text-xl font-semibold text-gray-400 dark:text-gray-600">
                    {name}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
          
          {/* Right side image/illustration */}
          <motion.div 
            className="w-full lg:w-1/2 relative"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              duration: 0.8,
              delay: 0.4,
              ease: "easeOut"
            }}
          >
            {/* 3D-style UI mockup */}
            <div className="relative max-w-md mx-auto">
              {/* Main screen */}
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 rotate-3 z-10">
                {/* App UI */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-24 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-lg"></div>
                    <div className="flex space-x-2">
                      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full"></div>
                      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded-full w-full"></div>
                    <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded-full w-5/6"></div>
                    <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded-full w-4/6"></div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="h-32 mb-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg"></div>
                      <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded-full w-full"></div>
                      <div className="h-4 mt-2 bg-gray-100 dark:bg-gray-700 rounded-full w-4/5"></div>
                    </div>
                    <div>
                      <div className="h-32 mb-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg"></div>
                      <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded-full w-full"></div>
                      <div className="h-4 mt-2 bg-gray-100 dark:bg-gray-700 rounded-full w-4/5"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Background screens for 3D effect */}
              <div className="absolute top-6 left-6 right-6 bottom-6 bg-gray-100 dark:bg-gray-800 rounded-2xl -rotate-3 z-0"></div>
              <div className="absolute top-3 left-3 right-3 bottom-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl rotate-6 z-0"></div>
              
              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-rose-200 dark:bg-rose-900 rounded-xl -rotate-12 z-20 flex items-center justify-center shadow-lg">
                <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <svg className="w-8 h-8 text-rose-500 dark:text-rose-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-amber-200 dark:bg-amber-900 rounded-full z-20 flex items-center justify-center shadow-lg">
                <div className="w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-500 dark:text-amber-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 3V7M3 5H7M6 17V21M4 19H8M13 3L15.2857 9.85714L21 12L15.2857 14.1429L13 21L10.7143 14.1429L5 12L10.7143 9.85714L13 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;