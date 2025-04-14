// src/modules/landing/pages/Services.tsx
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { FiCheck, FiArrowRight } from 'react-icons/fi';
import { useServices } from '../services/landingService';
import Card from '../../../shared/components/Card';
import Button from '../../../shared/components/Button';

const ServicesPage = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { data: services, isLoading, error } = useServices();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  
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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        duration: 0.5
      }
    }
  };

  // Content for the service details section
  const selectedServiceContent = selectedService ? getServiceContent(selectedService) : null;

  return (
    <div>
      {/* Hero section */}
      <section className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block px-3 py-1 text-sm text-primary-700 dark:text-primary-300 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4">
              {t('services.ourServices')}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {t('services.pageTitle')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              {t('services.pageSubtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container-custom">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array(6).fill(0).map((_, index) => (
                <Card key={index} className="h-64 animate-pulse">
                  <div className="flex flex-col h-full">
                    <div className="w-12 h-12 mb-4 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-full"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-5/6"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center">
              <p className="text-red-500 dark:text-red-400 mb-4">{t('errors.servicesLoadFailed')}</p>
              <Button onClick={() => window.location.reload()}>
                {t('general.tryAgain')}
              </Button>
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {services?.map((service) => {
                const serviceTranslations = (service.translations as Record<'en' | 'ar', any> | undefined)?.[currentLanguage] || {};
                const title = serviceTranslations.title || service.title;
                const description = serviceTranslations.description || service.description;
                const isActive = selectedService === service.id;
                
                return (
                  <motion.div key={service.id} variants={itemVariants}>
                    <Card 
                      hoverable
                      clickable
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
                      className={`h-full transition-all duration-300 ${
                        isActive 
                          ? 'border-2 border-primary-500 dark:border-primary-600 shadow-lg transform -translate-y-1' 
                          : 'border border-transparent hover:border-primary-300 dark:hover:border-primary-700'
                      }`}
                    >
                      <div className="flex flex-col h-full">
                        <div className="text-primary-600 dark:text-primary-400 mb-4">
                          <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">{service.icon}</span>
                          </div>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4 flex-1 line-clamp-3">{description}</p>
                        <div className="flex items-center text-primary-600 dark:text-primary-400 font-medium group">
                          {t('services.learnMore')}
                          <FiArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                        </div>
                      </div>
                    </Card>
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
          className="py-20 bg-gray-50 dark:bg-gray-800"
        >
          <div className="container-custom">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedService}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto"
              >
                {selectedServiceContent && (
                  <>
                    <div className="flex items-center mb-8">
                      <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center text-primary-600 dark:text-primary-400 mr-6">
                        <span className="text-3xl">{selectedServiceContent.icon}</span>
                      </div>
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                        {selectedServiceContent.title}
                      </h2>
                    </div>

                    <div className="prose prose-lg max-w-none dark:prose-invert mb-12">
                      <p>{selectedServiceContent.description}</p>
                    </div>

                    {selectedServiceContent.features && selectedServiceContent.features.length > 0 && (
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                          {t('services.keyFeatures')}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedServiceContent.features.map((feature: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | Iterable<ReactNode> | null | undefined, index: Key | null | undefined) => (
                            <div 
                              key={index}
                              className="flex items-start p-4 rounded-lg bg-white dark:bg-gray-900 shadow-sm"
                            >
                              <div className="flex-shrink-0 text-primary-600 dark:text-primary-400 mt-0.5">
                                <FiCheck className="w-5 h-5" />
                              </div>
                              <div className="ml-3">
                                <p className="text-gray-700 dark:text-gray-300">{feature}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-12 text-center">
                      <p className="text-gray-600 dark:text-gray-300 mb-6">
                        {t('services.interestedInService')}
                      </p>
                      <Button 
                        size="lg"
                        onClick={() => {
                          // Scroll to contact form
                          const contactForm = document.getElementById('contact-form');
                          if (contactForm) {
                            contactForm.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                      >
                        {t('services.contactUs')}
                      </Button>
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      )}

      {/* Contact form */}
      <section id="contact-form" className="py-20 bg-white dark:bg-gray-900">
        <div className="container-custom">
          {/* We'll reuse the ContactForm component here */}
          {/* <ContactForm /> */}
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;