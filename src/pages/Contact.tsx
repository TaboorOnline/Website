import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiMapPin, FiMail, FiPhone, FiClock } from 'react-icons/fi';
import ContactForm from '../components/sections/ContactForm';

const Contact = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // Scroll to the top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
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
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div variants={itemVariants}>
              <span className="inline-block px-4 py-1 text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-6">
                {t('contact.getInTouch')}
              </span>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants} 
              className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
            >
              {t('contact.pageTitle')}
            </motion.h1>
            
            <motion.p 
              variants={itemVariants} 
              className="text-xl text-gray-600 dark:text-gray-400"
            >
              {t('contact.pageSubtitle')}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-16 h-16 mb-6 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <FiMapPin className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {t('contact.visitUs')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                123 Tech Street, Business Bay<br />
                Dubai, United Arab Emirates
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-16 h-16 mb-6 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <FiMail className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {t('contact.emailUs')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                info@helaltech.com<br />
                support@helaltech.com
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-16 h-16 mb-6 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <FiPhone className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {t('contact.callUs')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                +123 456 7890<br />
                +123 456 7891
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-16 h-16 mb-6 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <FiClock className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {t('contact.businessHours')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('contact.monFri')}: 9:00 AM - 6:00 PM<br />
                {t('contact.satSun')}: {t('contact.closed')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="rounded-xl overflow-hidden shadow-xl"
            >
              {/* This would be replaced with an actual map component or embed */}
              <div className="aspect-[16/9] bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                <div className="text-center">
                  <div className="bg-indigo-100 dark:bg-indigo-900/40 p-4 rounded-xl inline-block mb-4">
                    <FiMapPin className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-lg">
                    {t('contact.mapPlaceholder')}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact-form" className="bg-gray-50 dark:bg-gray-900">
        <ContactForm />
      </section>
    </div>
  );
};

export default Contact;