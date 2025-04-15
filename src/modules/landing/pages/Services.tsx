// src/modules/landing/pages/Services.tsx
import { ReactElement, ReactNode, JSXElementConstructor, Key, ReactPortal, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { FiCheck, FiArrowRight, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { useServices } from '../services/landingService';
import ContactForm from '../components/ContactForm';
import { Link } from 'react-router-dom';

const ServicesPage = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { data: services, isLoading, error } = useServices();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  const isRTL = i18n.language === 'ar';
  
  // Check if there's a hash in the URL to auto-select a service
  useEffect(() => {
    if (location.hash) {
      const serviceId = location.hash.substring(1);
      setSelectedService(serviceId);
      
      // Scroll to the service details
      setTimeout(() => {
        const element = document.getElementById('service-details');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    } else {
      // If no hash, select the first service by default when data loads
      if (services && services.length > 0 && !selectedService) {
        setSelectedService(services[0].id);
      }
    }
  }, [location.hash, services, selectedService]);

  // Scroll to the top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Add scroll event listener for the scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
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

  const currentLanguage = i18n.language as 'en' | 'ar';

  const getServiceContent = (serviceId: string) => {
    if (!services) return null;
    
    const service = services.find(s => s.id === serviceId);
    if (!service) return null;
    
    const serviceTranslations = (service.translations as Record<'en' | 'ar', any> | undefined)?.[currentLanguage] || {};
    
    return {
      title: serviceTranslations.title || service.title,
      description: serviceTranslations.description || service.description,
      features: serviceTranslations.features || [],
      icon: service.icon
    };
  };

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
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  // Content for the service details section
  const selectedServiceContent = selectedService ? getServiceContent(selectedService) : null;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950" dir={isRTL ? "rtl" : "ltr"}>
      {/* Hero section */}
      <section className="relative py-24 bg-white dark:bg-gray-950">
        {/* Color accent */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-indigo-100 dark:bg-indigo-950 rounded-full"></div>
          <div className="absolute top-1/2 -left-24 w-48 h-48 bg-rose-100 dark:bg-rose-950 rounded-full"></div>
          <div className="absolute -bottom-32 right-1/2 w-80 h-80 bg-amber-100 dark:bg-amber-950 rounded-full"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block px-4 py-1 text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-6">
              {t('services.ourServices')}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {t('services.pageTitle')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10">
              {t('services.pageSubtitle')}
            </p>
            
            <Link
              to="#service-details"
              className="inline-flex items-center mt-6 px-8 py-4 text-white font-medium rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 dark:shadow-indigo-600/20 transition-all duration-300"
            >
              {t('services.exploreServices')}
              <FiArrowDown className={`${isRTL ? 'mr-2' : 'ml-2'}`} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              {t('services.whatWeOffer')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {t('services.offerDescription')}
            </p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array(6).fill(0).map((_, index) => (
                <div key={index} className="h-full bg-white dark:bg-gray-900 rounded-xl shadow-md p-8 animate-pulse">
                  <div className="flex flex-col h-full">
                    <div className="w-14 h-14 mb-6 rounded-xl bg-indigo-100 dark:bg-indigo-900/30"></div>
                    <div className="h-7 bg-gray-200 dark:bg-gray-800 rounded-md w-2/3 mb-5"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full mb-3 w-full"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full mb-3 w-5/6"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full mb-3 w-4/6"></div>
                    </div>
                    <div className="h-5 w-28 mt-4 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12 px-6 bg-red-50 dark:bg-red-900/20 rounded-xl max-w-xl mx-auto">
              <p className="text-red-500 dark:text-red-400 mb-4">{t('errors.servicesLoadFailed')}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-5 py-2 text-white font-medium rounded-lg bg-red-500 hover:bg-red-600 transition-all duration-300"
              >
                {t('general.tryAgain')}
              </button>
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {Array.isArray(services) && services.map((service) => {
                const serviceTranslations = (service.translations as Record<'en' | 'ar', any> | undefined)?.[currentLanguage] || {};
                const title = serviceTranslations.title || service.title;
                const description = serviceTranslations.description || service.description;
                const isActive = selectedService === service.id;
                
                return (
                  <motion.div key={service.id} variants={itemVariants}>
                    <div 
                      onClick={() => {
                        setSelectedService(service.id);
                        
                        // Scroll to the service details
                        setTimeout(() => {
                          const element = document.getElementById('service-details');
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth' });
                          }
                        }, 100);
                      }}
                      className={`group h-full bg-white dark:bg-gray-900 rounded-xl transition-all duration-300 cursor-pointer p-8 ${
                        isActive 
                          ? 'border-2 border-indigo-500 dark:border-indigo-400 shadow-lg shadow-indigo-500/10 dark:shadow-indigo-500/5 scale-[1.02]' 
                          : 'border border-gray-200 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/5 hover:-translate-y-1'
                      }`}
                    >
                      <div className="flex flex-col h-full">
                        <div className="text-indigo-600 dark:text-indigo-400 mb-6 transition-transform duration-300 group-hover:scale-110 transform-gpu">
                          <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">{!service.icon || '✦'}</span>
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">{title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 flex-1 line-clamp-3">{description}</p>
                        <div className="flex items-center text-indigo-600 dark:text-indigo-400 font-medium group/link">
                          {t('services.learnMore')}
                          <FiArrowRight className={`transition-transform duration-300 group-hover/link:translate-x-1 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>

      {/* Service details */}
      {selectedService && (
        <section 
          id="service-details" 
          className="py-24 bg-white dark:bg-gray-950 relative"
        >
          {/* Color accent */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 right-1/4 w-80 h-80 bg-indigo-100 dark:bg-indigo-950 rounded-full opacity-50"></div>
            <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-rose-100 dark:bg-rose-950 rounded-full opacity-30"></div>
          </div>
          
          <div className="container mx-auto px-6 relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedService}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="max-w-4xl mx-auto"
              >
                {selectedServiceContent && (
                  <>
                    <div className="flex flex-col md:flex-row md:items-center mb-12 gap-6">
                      <div className="w-20 h-20 bg-indigo-600 dark:bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <span className="text-3xl">{!selectedServiceContent.icon || '✦'}</span>
                      </div>
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                        {selectedServiceContent.title}
                      </h2>
                    </div>

                    <div className="prose prose-lg max-w-none dark:prose-invert mb-16 bg-gray-50 dark:bg-gray-900 rounded-xl p-8 shadow-md">
                      <p className="text-gray-600 dark:text-gray-400">{selectedServiceContent.description}</p>
                    </div>

                    {selectedServiceContent.features && selectedServiceContent.features.length > 0 && (
                      <div className="mt-16">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                          {t('services.keyFeatures')}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {selectedServiceContent.features.map((feature: string | number | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined, index: Key | null | undefined) => (
                            <motion.div 
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ 
                                duration: 0.5, 
                                delay: index as number * 0.1,
                                ease: "easeOut"
                              }}
                              className="flex items-start p-5 rounded-xl bg-gray-50 dark:bg-gray-900 shadow-md border border-gray-200 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
                            >
                              <div className={`flex-shrink-0 text-indigo-600 dark:text-indigo-400 mt-0.5 ${isRTL ? 'ml-4' : 'mr-4'}`}>
                                <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
                                  <FiCheck className="w-5 h-5" />
                                </div>
                              </div>
                              <p className="text-gray-700 dark:text-gray-300">{feature}</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-16 text-center">
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {t('services.interestedInService')}
                      </p>
                      <button 
                        onClick={() => {
                          // Scroll to contact form
                          const contactForm = document.getElementById('contact-form');
                          if (contactForm) {
                            contactForm.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                        className="px-8 py-4 text-white font-medium rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 dark:shadow-indigo-600/20 transition-all duration-300"
                      >
                        {t('services.contactUs')}
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      )}

      {/* Contact form */}
      <section id="contact-form" className=" bg-gray-50 dark:bg-gray-900">
        <ContactForm />
      </section>
      
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
    </div>
  );
};

export default ServicesPage;