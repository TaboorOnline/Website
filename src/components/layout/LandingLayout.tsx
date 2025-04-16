import React, { ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { changeLanguage } from '../../utils/i18n/i18n';
import { Language } from '../../types/types';

// Import icons
import { 
  FiSun, FiMoon, FiGlobe, FiMenu, FiX, FiTwitter, 
  FiLinkedin, FiFacebook, FiInstagram, FiMail, FiPhone, 
  FiMapPin, FiArrowUp, FiChevronRight
} from 'react-icons/fi';

interface LandingLayoutProps {
  children: ReactNode;
}

const LandingLayout = ({ children }: LandingLayoutProps) => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const isRTL = i18n.language === 'ar';

  // Navigation links
  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/services', label: t('nav.services') },
    { path: '/about', label: t('nav.about') },
    { path: '/contact', label: t('nav.contact') },
  ];

  const toggleLanguage = () => {
    const newLang: Language = i18n.language === 'en' ? 'ar' : 'en';
    changeLanguage(newLang);
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <header 
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/90 dark:bg-gray-950/90 backdrop-blur-md shadow-md' 
            : 'bg-white dark:bg-gray-950'
        }`}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="flex items-center"
              >
                <div className={`w-10 h-10 rounded-xl bg-indigo-600 dark:bg-indigo-500 ${isRTL ? "ml-3" : "mr-3"} flex items-center justify-center shadow-md`}>
                  <span className="text-white font-bold text-xl">H</span>
                </div>
                <span className="text-indigo-600 dark:text-indigo-400 text-2xl font-bold">
                  Helal Tech
                </span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 text-sm font-medium transition-all rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 ${
                    location.pathname === link.path
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {link.label}
                  {location.pathname === link.path && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 mx-4 bg-indigo-600 dark:bg-indigo-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                aria-label={theme === 'dark' ? t('theme.light') : t('theme.dark')}
              >
                {theme === 'dark' ? (
                  <FiSun className="text-amber-400 w-5 h-5" />
                ) : (
                  <FiMoon className="text-gray-700 w-5 h-5" />
                )}
              </button>

              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 flex items-center transition-colors"
                aria-label={i18n.language === 'en' ? t('language.arabic') : t('language.english')}
              >
                <FiGlobe className="w-5 h-5 mr-1 text-indigo-600 dark:text-indigo-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {i18n.language === 'en' ? 'AR' : 'EN'}
                </span>
              </button>

              {/* Contact Button (desktop only) */}
              <Link
                to="/contact"
                className="hidden md:flex px-5 py-2.5 text-sm font-medium text-white rounded-lg bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 transition-all duration-300 ml-2 shadow-lg shadow-indigo-500/20 dark:shadow-indigo-800/20"
              >
                {t('nav.getInTouch')}
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                aria-label={isMenuOpen ? t('nav.close') : t('nav.menu')}
              >
                {isMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            className="md:hidden fixed top-[72px] left-0 right-0 z-40 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-lg"
            style={{ maxHeight: 'calc(100vh - 72px)', overflowY: 'auto' }}
          >
            <div className="container mx-auto px-6 py-6">
              <nav className="flex flex-col space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-sm font-medium py-3 px-4 rounded-lg transition-all ${
                      location.pathname === link.path
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  to="/contact"
                  className="mt-4 text-sm font-medium py-3 px-4 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 transition-all duration-300 shadow-md text-center"
                >
                  {t('nav.getInTouch')}
                </Link>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 w-12 h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50"
            aria-label={t('common.scrollToTop')}
          >
            <FiArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-900">
        {/* Footer top section with color accent */}
        <div className="relative">
          
          <div className="container mx-auto px-6 py-16 relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {/* About */}
              <div>
                <div className="flex items-center mb-6">
                  <div className={`w-10 h-10 rounded-xl bg-indigo-600 dark:bg-indigo-500 ${isRTL ? "ml-3" : "mr-3"} flex items-center justify-center shadow-md`}>
                    <span className="text-white font-bold text-xl">H</span>
                  </div>
                  <span className="text-indigo-600 dark:text-indigo-400 text-2xl font-bold">
                    Helal Tech
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  {t('footer.aboutDescription')}
                </p>
                <div className="flex space-x-3">
                  {[FiTwitter, FiFacebook, FiLinkedin, FiInstagram].map((Icon, index) => (
                    <a 
                      key={index}
                      href="#" 
                      className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-indigo-100 hover:text-indigo-600 dark:hover:bg-indigo-900/40 dark:hover:text-indigo-400 transition-all duration-300"
                      aria-label={`Social media ${index + 1}`}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                  {t('footer.quickLinks')}
                </h3>
                <ul className="space-y-3">
                  {navLinks.map((link) => (
                    <li key={link.path}>
                      <Link
                        to={link.path}
                        className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300 flex items-center"
                      >
                        <FiChevronRight className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'} text-indigo-500/70 dark:text-indigo-400/70`} />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                  {t('footer.contact')}
                </h3>
                <ul className="space-y-4 text-gray-600 dark:text-gray-400">
                  <li className="flex items-start">
                    <div className={`flex-shrink-0 mt-1 w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 ${isRTL ? 'ml-3' : 'mr-3'}`}>
                      <FiMapPin className="w-5 h-5" />
                    </div>
                    <div>{t('footer.address')}</div>
                  </li>
                  <li className="flex items-center">
                    <div className={`flex-shrink-0 w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 ${isRTL ? 'ml-3' : 'mr-3'}`}>
                      <FiMail className="w-5 h-5" />
                    </div>
                    <a
                      href="mailto:info@helaltech.com"
                      className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300"
                    >
                      info@helaltech.com
                    </a>
                  </li>
                  <li className="flex items-center">
                    <div className={`flex-shrink-0 w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 ${isRTL ? 'ml-3' : 'mr-3'}`}>
                      <FiPhone className="w-5 h-5" />
                    </div>
                    <a
                      href="tel:+1234567890"
                      className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300"
                    >
                      +123 456 7890
                    </a>
                  </li>
                </ul>
              </div>

              {/* Newsletter */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                  {t('footer.newsletter')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {t('footer.newsletterDescription')}
                </p>
                <form className="flex">
                  <input 
                    type="email" 
                    placeholder={t('footer.emailPlaceholder')} 
                    className={`flex-1 px-4 py-3 ${isRTL ? "rounded-r-lg" : "rounded-l-lg"} border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400`}
                  />
                  <button 
                    type="submit"
                    className={`px-4 py-3 ${!isRTL ? "rounded-r-lg" : "rounded-l-lg"} bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-medium transition-all duration-300`}
                  >
                    {t('footer.subscribe')}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Footer bottom / copyright */}
        <div className="border-t border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
                &copy; {new Date().getFullYear()} Helal Tech. {t('footer.rights')}
              </p>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm">
                  {t('footer.privacy')}
                </a>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm">
                  {t('footer.terms')}
                </a>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm">
                  {t('footer.sitemap')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingLayout;