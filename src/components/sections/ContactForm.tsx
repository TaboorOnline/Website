import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiMail, FiUser, FiPhone, FiMessageSquare, FiMapPin, FiCheck } from 'react-icons/fi';
import Button from '../common/Button';
import emailjs from '@emailjs/browser';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const ContactForm = () => {
  const { t, i18n } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const isRTL = i18n.language === 'ar';
  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>();

  const onSubmit = async () => {
    setIsSubmitting(true);
    setError('');
    
    try {
      // Using formRef with emailjs for better template support
      if (formRef.current) {
        await emailjs.sendForm(
          'YOUR_SERVICE_ID', // Replace with your actual EmailJS service ID
          'YOUR_TEMPLATE_ID', // Replace with your actual EmailJS template ID
          formRef.current,
          'YOUR_PUBLIC_KEY' // Replace with your actual EmailJS public key
        );
        setIsSuccess(true);
        reset();
      }
    } catch (err: any) {
      setError(err.text || t('contact.errorSubmitting'));
      console.error('EmailJS error:', err);
    } finally {
      setIsSubmitting(false);
    }
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
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  // Contact information with icons
  const contactInfo = [
    {
      icon: <FiMail className="w-5 h-5" />,
      title: t('contact.email'),
      content: 'info@helaltech.com'
    },
    {
      icon: <FiPhone className="w-5 h-5" />,
      title: t('contact.phone'),
      content: '+123 456 7890'
    },
    {
      icon: <FiMapPin className="w-5 h-5" />,
      title: t('contact.address'),
      content: '123 Tech Street, Business Bay, Dubai, UAE'
    }
  ];

  return (
    <section 
      className="py-24 bg-white dark:bg-gray-950" 
      id="contact-form"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="container mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6"
          >
            {t('contact.title')}
          </motion.h2>
          
          <motion.p 
            variants={itemVariants} 
            className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
          >
            {t('contact.subtitle')}
          </motion.p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {/* Contact Information Cards */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          >
            {contactInfo.map((info, index) => (
              <motion.div key={index} variants={itemVariants}>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-8 text-center transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/5">
                  <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/40 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600 dark:text-indigo-400">
                    {info.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{info.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{info.content}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={containerVariants}
            className="max-w-3xl mx-auto relative"
          >
            <motion.div 
              variants={itemVariants}
              className="relative z-10"
            >
              {isSuccess ? (
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-10 text-center shadow-xl">
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 dark:text-green-400">
                    <FiCheck className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {t('contact.thankYou')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                    {t('contact.messageReceived')}
                  </p>
                  <Button 
                    onClick={() => setIsSuccess(false)}
                    className="px-6 py-3 text-white font-medium rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 transition-all duration-300"
                  >
                    {t('contact.sendAnother')}
                  </Button>
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 md:p-10 shadow-xl">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                    {t('contact.getInTouch')}
                  </h3>
                  
                  {error && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-xl text-sm border border-red-100 dark:border-red-800/50 mb-6">
                      {error}
                    </div>
                  )}
                  
                  <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('contact.name')}
                        </label>
                        <div className="relative">
                          <div className="absolute top-3.5 left-3.5 text-gray-500 dark:text-gray-400">
                            <FiUser className="w-5 h-5" />
                          </div>
                          <input
                            id="name"
                            type="text"
                            className={`w-full px-4 py-3 pl-11 rounded-xl border outline-none ${
                              errors.name
                                ? 'border-red-300 dark:border-red-800 text-red-900 dark:text-red-300 focus:ring-red-500 dark:focus:ring-red-700 focus:border-red-500 dark:focus:border-red-700'
                                : 'border-gray-300 dark:border-gray-700 focus:ring-indigo-500 dark:focus:ring-indigo-700 focus:border-indigo-500 dark:focus:border-indigo-700'
                            } bg-white dark:bg-gray-800 transition-colors duration-200`}
                            placeholder={t('contact.namePlaceholder')}
                            {...register('name')}
                          />
                        </div>
                        {errors.name && (
                          <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">
                            {errors.name.message}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('contact.email')}
                        </label>
                        <div className="relative">
                          <div className="absolute top-3.5 left-3.5 text-gray-500 dark:text-gray-400">
                            <FiMail className="w-5 h-5" />
                          </div>
                          <input
                            id="email"
                            type="email"
                            className={`w-full px-4 py-3 pl-11 rounded-xl border outline-none ${
                              errors.email
                                ? 'border-red-300 dark:border-red-800 text-red-900 dark:text-red-300 focus:ring-red-500 dark:focus:ring-red-700 focus:border-red-500 dark:focus:border-red-700'
                                : 'border-gray-300 dark:border-gray-700 focus:ring-indigo-500 dark:focus:ring-indigo-700 focus:border-indigo-500 dark:focus:border-indigo-700'
                            } bg-white dark:bg-gray-800 transition-colors duration-200`}
                            placeholder={t('contact.emailPlaceholder')}
                            {...register('email')}
                          />
                        </div>
                        {errors.email && (
                          <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('contact.phone')}
                      </label>
                      <div className="relative">
                        <div className="absolute top-3.5 left-3.5 text-gray-500 dark:text-gray-400">
                          <FiPhone className="w-5 h-5" />
                        </div>
                        <input
                          id="phone"
                          type="tel"
                          className={`w-full px-4 py-3 pl-11 rounded-xl border outline-none ${
                            errors.phone
                              ? 'border-red-300 dark:border-red-800 text-red-900 dark:text-red-300 focus:ring-red-500 dark:focus:ring-red-700 focus:border-red-500 dark:focus:border-red-700'
                              : 'border-gray-300 dark:border-gray-700 focus:ring-indigo-500 dark:focus:ring-indigo-700 focus:border-indigo-500 dark:focus:border-indigo-700'
                          } bg-white dark:bg-gray-800 transition-colors duration-200`}
                          placeholder={t('contact.phonePlaceholder')}
                          {...register('phone')}
                        />
                      </div>
                      {errors.phone && (
                        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('contact.message')}
                      </label>
                      <div className="relative">
                        <div className="absolute top-3.5 left-3.5 text-gray-500 dark:text-gray-400">
                          <FiMessageSquare className="w-5 h-5" />
                        </div>
                        <textarea
                          id="message"
                          rows={5}
                          className={`w-full px-4 py-3 pl-11 rounded-xl border outline-none ${
                            errors.message
                              ? 'border-red-300 dark:border-red-800 text-red-900 dark:text-red-300 focus:ring-red-500 dark:focus:ring-red-700 focus:border-red-500 dark:focus:border-red-700'
                              : 'border-gray-300 dark:border-gray-700 focus:ring-indigo-500 dark:focus:ring-indigo-700 focus:border-indigo-500 dark:focus:border-indigo-700'
                          } bg-white dark:bg-gray-800 transition-colors duration-200`}
                          placeholder={t('contact.messagePlaceholder')}
                          {...register('message')}
                        ></textarea>
                      </div>
                      {errors.message && (
                        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">
                          {errors.message.message}
                        </p>
                      )}
                    </div>
                    
                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full px-6 py-4 text-white font-medium rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 dark:shadow-indigo-800/20 transition-all duration-300 flex justify-center items-center"
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {t('contact.submitting')}
                          </>
                        ) : (
                          t('contact.submit')
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;