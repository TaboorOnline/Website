import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Team from '../components/sections/Team';
import ContactForm from '../components/sections/ContactForm';
import Image from '../components/common/Image';
import { FiCommand } from 'react-icons/fi';

const About = () => {
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
                {t('about.badge')}
              </span>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants} 
              className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
            >
              {t('about.title')}
            </motion.h1>
            
            <motion.p 
              variants={itemVariants} 
              className="text-xl text-gray-600 dark:text-gray-400"
            >
              {t('about.subtitle')}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Company overview */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="relative">
                <div className="aspect-square rounded-2xl overflow-hidden shadow-xl">

                <Image 
                  src="/assets/images/about-company.jpg"
                  alt="about"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  customIcon={
                    <div className="flex flex-col items-center justify-center h-full bg-indigo-50 dark:bg-indigo-950/30">
                      <FiCommand className="w-20 h-20 text-indigo-300 dark:text-indigo-700 mb-2" />
                      <div className="text-sm text-indigo-500 dark:text-indigo-400">
                        {t('about.photoNotAvailable')}
                      </div>
                    </div>
                  }
                />




                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            >
              <span className="inline-block px-4 py-1 text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-6">
                {t('about.companyOverview')}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                {t('about.overviewTitle')}
              </h2>
              <div className="prose prose-lg text-gray-600 dark:text-gray-400">
                <p>{t('about.overviewParagraph1')}</p>
                <p>{t('about.overviewParagraph2')}</p>
              </div>

              <div className="grid grid-cols-2 gap-8 mt-10">
                <div>
                  <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">10+</p>
                  <p className="text-gray-600 dark:text-gray-400">{t('about.yearsExperience')}</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">100+</p>
                  <p className="text-gray-600 dark:text-gray-400">{t('about.projectsDelivered')}</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">25+</p>
                  <p className="text-gray-600 dark:text-gray-400">{t('about.teamMembers')}</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">50+</p>
                  <p className="text-gray-600 dark:text-gray-400">{t('about.happyClients')}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1 text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-6">
              {t('about.missionVision')}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              {t('about.purposeTitle')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {t('about.purposeSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="bg-gray-50 dark:bg-gray-900 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800"
            >
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t('about.missionTitle')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('about.missionText')}
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
              className="bg-gray-50 dark:bg-gray-900 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800"
            >
              <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/40 rounded-xl flex items-center justify-center text-rose-600 dark:text-rose-400 mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t('about.visionTitle')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('about.visionText')}
              </p>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
            className="bg-gray-50 dark:bg-gray-900 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 mt-8"
          >
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/40 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400 mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {t('about.valuesTitle')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  {t('about.value1Title')}
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('about.value1Text')}
                </p>
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  {t('about.value2Title')}
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('about.value2Text')}
                </p>
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  {t('about.value3Title')}
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('about.value3Text')}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team */}
      <Team />

      {/* Contact Form */}
      <ContactForm />
    </div>
  );
};

export default About;