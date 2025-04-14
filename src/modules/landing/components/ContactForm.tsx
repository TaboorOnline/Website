// src/modules/landing/components/ContactForm.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiMail, FiUser, FiPhone, FiMessageSquare, FiMapPin } from 'react-icons/fi';
import Button from '../../../shared/components/Button';
import Input from '../../../shared/components/Input';
import { sendContactMessage } from '../services/contactService';
import useIntersectionObserver from '../../../shared/hooks/useIntersectionObserver';
import { useTheme } from '../../../shared/hooks/useTheme';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const ContactForm = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formRef, isVisible] = useIntersectionObserver<HTMLDivElement>({ threshold: 0.1, triggerOnce: true });

  const contactSchema = yup.object({
    name: yup.string().required(t('validation.required')),
    email: yup.string().email(t('validation.email')).required(t('validation.required')),
    phone: yup.string().required(t('validation.required')),
    message: yup.string().required(t('validation.required')).min(10, t('validation.minLength', { count: 10 })),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: yupResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setError('');
    
    try {
      await sendContactMessage(data);
      setIsSuccess(true);
      reset();
    } catch (err: any) {
      setError(err.message || t('contact.errorSubmitting'));
    } finally {
      setIsSubmitting(false);
    }
  };

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
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950" id="contact-form">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-blue-50/20 to-transparent dark:from-blue-900/10 dark:to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-full h-1/3 bg-gradient-to-t from-purple-50/20 to-transparent dark:from-purple-900/10 dark:to-transparent"></div>
        
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-100/30 dark:bg-blue-900/10 rounded-full blur-3xl opacity-70"></div>
        <div className="absolute -bottom-40 left-1/4 w-96 h-96 bg-purple-100/30 dark:bg-purple-900/10 rounded-full blur-3xl opacity-70 transform -translate-x-1/2"></div>
        
        {/* Decorative grid patterns */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIgMCAyIC44IDIgMnYyMGMwIDEuMi0uOCAyLTIgMkgxOGMtMS4yIDAtMi0uOC0yLTJWMjBjMC0xLjIuOC0yIDItMmgxOHoiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')] dark:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIgMCAyIC44IDIgMnYyMGMwIDEuMi0uOCAyLTIgMkgxOGMtMS4yIDAtMi0uOC0yLTJWMjBjMC0xLjIuOC0yIDItMmgxOHoiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')]"></div>
      </div>
      
      <div className="container-custom relative z-10">
        <motion.div
          ref={formRef}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={containerVariants}
          className="max-w-5xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 text-sm font-medium text-blue-700 dark:text-blue-300 bg-blue-100/80 dark:bg-blue-900/30 rounded-full mb-5 backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/50">
              {t('contact.badge')}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-5 leading-tight">
              {t('contact.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {t('contact.subtitle')}
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 relative z-10"
          >
            <div className="grid grid-cols-1 md:grid-cols-5">
              <div className="md:col-span-2 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white p-8 md:p-12 relative overflow-hidden">
                {/* Decorative shapes */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-500/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/3"></div>
                
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-6">{t('contact.getInTouch')}</h3>
                  <p className="mb-10 text-blue-100/90 leading-relaxed">{t('contact.contactDescription')}</p>
                  
                  <div className="space-y-8">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1 w-10 h-10 bg-blue-500/30 rounded-lg flex items-center justify-center">
                        <FiMail className="w-5 h-5 text-white" />
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-semibold">{t('contact.email')}</h4>
                        <p className="text-blue-100">info@hilaltech.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1 w-10 h-10 bg-blue-500/30 rounded-lg flex items-center justify-center">
                        <FiPhone className="w-5 h-5 text-white" />
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-semibold">{t('contact.phone')}</h4>
                        <p className="text-blue-100">+123 456 7890</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1 w-10 h-10 bg-blue-500/30 rounded-lg flex items-center justify-center">
                        <FiMapPin className="w-5 h-5 text-white" />
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-semibold">{t('contact.address')}</h4>
                        <p className="text-blue-100">
                          123 Tech Street, Business Bay<br />
                          Dubai, United Arab Emirates
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-3 p-8 md:p-12">
                {isSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center py-8"
                  >
                    <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-8 shadow-md shadow-green-500/10 dark:shadow-green-800/30">
                      <svg className="w-12 h-12 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      {t('contact.thankYou')}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-10 max-w-md mx-auto leading-relaxed">
                      {t('contact.messageReceived')}
                    </p>
                    <button 
                      onClick={() => setIsSuccess(false)}
                      className="px-6 py-3 text-white font-medium rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 shadow-md hover:shadow-lg shadow-blue-500/20 dark:shadow-blue-800/30 transition-all duration-300"
                    >
                      {t('contact.sendAnother')}
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {error && (
                      <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg text-sm border border-red-100 dark:border-red-800/50">
                        {error}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          {t('contact.name')}
                        </label>
                        <div className="relative">
                          <div className="absolute top-3.5 left-3.5 text-gray-400">
                            <FiUser className="w-5 h-5" />
                          </div>
                          <input
                            id="name"
                            type="text"
                            className={`w-full px-4 py-3 pl-11 rounded-lg border outline-none ${
                              errors.name
                                ? 'border-red-300 dark:border-red-800 text-red-900 dark:text-red-300 placeholder-red-300 dark:placeholder-red-700 focus:ring-red-500 dark:focus:ring-red-700 focus:border-red-500 dark:focus:border-red-700'
                                : 'border-gray-300 dark:border-gray-700 focus:ring-blue-500 dark:focus:ring-blue-700 focus:border-blue-500 dark:focus:border-blue-700'
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
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          {t('contact.email')}
                        </label>
                        <div className="relative">
                          <div className="absolute top-3.5 left-3.5 text-gray-400">
                            <FiMail className="w-5 h-5" />
                          </div>
                          <input
                            id="email"
                            type="email"
                            className={`w-full px-4 py-3 pl-11 rounded-lg border outline-none ${
                              errors.email
                                ? 'border-red-300 dark:border-red-800 text-red-900 dark:text-red-300 placeholder-red-300 dark:placeholder-red-700 focus:ring-red-500 dark:focus:ring-red-700 focus:border-red-500 dark:focus:border-red-700'
                                : 'border-gray-300 dark:border-gray-700 focus:ring-blue-500 dark:focus:ring-blue-700 focus:border-blue-500 dark:focus:border-blue-700'
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
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        {t('contact.phone')}
                      </label>
                      <div className="relative">
                        <div className="absolute top-3.5 left-3.5 text-gray-400">
                          <FiPhone className="w-5 h-5" />
                        </div>
                        <input
                          id="phone"
                          type="tel"
                          className={`w-full px-4 py-3 pl-11 rounded-lg border outline-none ${
                            errors.phone
                              ? 'border-red-300 dark:border-red-800 text-red-900 dark:text-red-300 placeholder-red-300 dark:placeholder-red-700 focus:ring-red-500 dark:focus:ring-red-700 focus:border-red-500 dark:focus:border-red-700'
                              : 'border-gray-300 dark:border-gray-700 focus:ring-blue-500 dark:focus:ring-blue-700 focus:border-blue-500 dark:focus:border-blue-700'
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
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        {t('contact.message')}
                      </label>
                      <div className="relative">
                        <div className="absolute top-3.5 left-3.5 text-gray-400">
                          <FiMessageSquare className="w-5 h-5" />
                        </div>
                        <textarea
                          id="message"
                          rows={5}
                          className={`w-full px-4 py-3 pl-11 rounded-lg border outline-none ${
                            errors.message
                              ? 'border-red-300 dark:border-red-800 text-red-900 dark:text-red-300 placeholder-red-300 dark:placeholder-red-700 focus:ring-red-500 dark:focus:ring-red-700 focus:border-red-500 dark:focus:border-red-700'
                              : 'border-gray-300 dark:border-gray-700 focus:ring-blue-500 dark:focus:ring-blue-700 focus:border-blue-500 dark:focus:border-blue-700'
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
                    
                    <div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full px-6 py-3.5 text-white font-medium rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 shadow-md hover:shadow-lg shadow-blue-500/20 dark:shadow-blue-800/30 transition-all duration-300 flex justify-center items-center"
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
                )}
              </div>
            </div>
          </motion.div>
          
          {/* Decorative elements */}
          <div className="absolute -top-10 -left-10 w-20 h-20 bg-blue-100/30 dark:bg-blue-900/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-10 right-1/3 w-24 h-24 bg-purple-100/30 dark:bg-purple-900/10 rounded-full blur-xl transform translate-x-1/2"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactForm;