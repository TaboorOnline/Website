// src/modules/landing/pages/About.tsx
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Timeline from '../components/Timeline';
import Team from '../components/Team';
import ContactForm from '../components/ContactForm';

const About = () => {
  const { t } = useTranslation();

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
      transition: { duration: 0.5 }
    }
  };

  return (
    <div>
      {/* Hero section */}
      <section className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.span variants={itemVariants} className="inline-block px-3 py-1 text-sm text-primary-700 dark:text-primary-300 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4">
              {t('about.badge')}
            </motion.span>
            <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {t('about.title')}
            </motion.h1>
            <motion.p variants={itemVariants} className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              {t('about.subtitle')}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Company overview */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative">
                <div className="aspect-square rounded-lg overflow-hidden shadow-lg">
                  <img 
                    src="/assets/images/about-company.jpg" 
                    alt={t('about.companyOverview')}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback for broken images
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x800?text=Our+Company';
                    }}
                  />
                </div>
                {/* Decorative elements */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary-100 dark:bg-primary-900/30 rounded-lg -z-10"></div>
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-secondary-100 dark:bg-secondary-900/20 rounded-lg -z-10"></div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="inline-block px-3 py-1 text-sm text-primary-700 dark:text-primary-300 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4">
                {t('about.companyOverview')}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                {t('about.overviewTitle')}
              </h2>
              <div className="prose prose-lg dark:prose-invert">
                <p>{t('about.overviewParagraph1')}</p>
                <p>{t('about.overviewParagraph2')}</p>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-8">
                <div>
                  <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">10+</p>
                  <p className="text-gray-600 dark:text-gray-300">{t('about.yearsExperience')}</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">100+</p>
                  <p className="text-gray-600 dark:text-gray-300">{t('about.projectsDelivered')}</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">25+</p>
                  <p className="text-gray-600 dark:text-gray-300">{t('about.teamMembers')}</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">50+</p>
                  <p className="text-gray-600 dark:text-gray-300">{t('about.happyClients')}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 text-sm text-primary-700 dark:text-primary-300 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4">
              {t('about.missionVision')}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              {t('about.purposeTitle')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {t('about.purposeSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-sm"
            >
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center text-primary-600 dark:text-primary-400 mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t('about.missionTitle')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t('about.missionText')}
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-sm"
            >
              <div className="w-16 h-16 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg flex items-center justify-center text-secondary-600 dark:text-secondary-400 mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t('about.visionTitle')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t('about.visionText')}
              </p>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-sm mt-8"
          >
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-700 dark:text-gray-300 mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('about.valuesTitle')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {t('about.value1Title')}
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('about.value1Text')}
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {t('about.value2Title')}
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('about.value2Text')}
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {t('about.value3Title')}
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('about.value3Text')}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timeline / History */}
      <Timeline />

      {/* Team */}
      <Team />

      {/* Contact Form */}
      <ContactForm />
    </div>
  );
};

export default About;