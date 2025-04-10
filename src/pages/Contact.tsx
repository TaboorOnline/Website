// src/pages/Contact.tsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, MessageSquare, Check } from 'lucide-react';

import Button from '../components/ui/Button';
import SectionTitle from '../components/common/SectionTitle';
import { sendContactMessage } from '../lib/supabase';
import { isRTL } from '../i18n';

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // التحقق من صحة البيانات
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t('contact.form.validation.required');
    }
    
    if (!formData.email.trim()) {
      newErrors.email = t('contact.form.validation.required');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('contact.form.validation.email');
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = t('contact.form.validation.required');
    }
    
    if (!formData.message.trim()) {
      newErrors.message = t('contact.form.validation.required');
    } else if (formData.message.length < 10) {
      newErrors.message = t('contact.form.validation.minLength', { min: 10 });
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // تحديث بيانات النموذج
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // مسح رسالة الخطأ عند التعديل
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // إرسال النموذج
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await sendContactMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        subject: formData.subject,
        message: formData.message,
      });
      
      if (result) {
        setIsSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setErrors({
        form: t('contact.form.error')
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // مكون معلومات الاتصال
  const ContactInfo = () => {
    return (
      <div className="bg-primary-900 dark:bg-primary-950 text-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-8">
          <h3 className="text-2xl font-bold mb-6">{t('contact.info.title')}</h3>
          
          <div className="space-y-6">
            {/* العنوان */}
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-800 dark:bg-primary-900 text-primary-300">
                  <MapPin size={20} />
                </div>
              </div>
              <div className="ml-4 rtl:mr-4 rtl:ml-0">
                <p className="text-sm font-medium text-primary-300">{t('contact.info.address')}</p>
                <p className="mt-1 text-base">{t('contact.info.addressValue')}</p>
              </div>
            </div>
            
            {/* الهاتف */}
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-800 dark:bg-primary-900 text-primary-300">
                  <Phone size={20} />
                </div>
              </div>
              <div className="ml-4 rtl:mr-4 rtl:ml-0">
                <p className="text-sm font-medium text-primary-300">{t('contact.info.phone')}</p>
                <p className="mt-1 text-base">
                  <a href={`tel:${t('contact.info.phoneValue')}`} className="hover:text-primary-300 transition-colors">
                    {t('contact.info.phoneValue')}
                  </a>
                </p>
              </div>
            </div>
            
            {/* البريد الإلكتروني */}
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-800 dark:bg-primary-900 text-primary-300">
                  <Mail size={20} />
                </div>
              </div>
              <div className="ml-4 rtl:mr-4 rtl:ml-0">
                <p className="text-sm font-medium text-primary-300">{t('contact.info.email')}</p>
                <p className="mt-1 text-base">
                  <a href={`mailto:${t('contact.info.emailValue')}`} className="hover:text-primary-300 transition-colors">
                    {t('contact.info.emailValue')}
                  </a>
                </p>
              </div>
            </div>
            
            {/* ساعات العمل */}
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-800 dark:bg-primary-900 text-primary-300">
                  <Clock size={20} />
                </div>
              </div>
              <div className="ml-4 rtl:mr-4 rtl:ml-0">
                <p className="text-sm font-medium text-primary-300">{t('contact.info.hours')}</p>
                <p className="mt-1 text-base">{t('contact.info.hoursValue')}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* خريطة بسيطة (يمكن استبدالها بخريطة حقيقية لاحقاً) */}
        <div className="h-48 bg-primary-800 dark:bg-primary-900 relative overflow-hidden">
          {/* هنا يمكن إضافة خريطة جوجل أو خريطة أخرى */}
          <div className="absolute inset-0 flex items-center justify-center text-primary-300">
            <MapPin size={48} />
          </div>
        </div>
      </div>
    );
  };

  // تأثيرات الحركة
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.2
      }
    }
  };

  const infoVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.4
      }
    }
  };

  return (
    <div className="pt-16">
      {/* قسم العنوان */}
      <section className="bg-primary-900 dark:bg-primary-950 text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('contact.title')}
            </h1>
            <p className="text-xl text-gray-200">
              {t('contact.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* قسم نموذج الاتصال */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <SectionTitle
            title={t('contact.title')}
            subtitle={t('contact.subtitle')}
            description={t('contact.description')}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
            {/* نموذج الاتصال */}
            <motion.div
              variants={formVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    {isSubmitted ? t('contact.form.success') : t('contact.form.title')}
                  </h3>
                  
                  {isSubmitted ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check size={32} className="text-green-600 dark:text-green-400" />
                      </div>
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {t('contact.form.success')}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 mb-6">
                        {t('contact.form.successMessage')}
                      </p>
                      <Button 
                        variant="primary"
                        onClick={() => setIsSubmitted(false)}
                      >
                        {t('contact.form.sendAnother')}
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      {errors.form && (
                        <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-md text-sm">
                          {errors.form}
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* الاسم */}
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t('contact.form.name')} *
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border ${
                              errors.name ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                            } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white`}
                          />
                          {errors.name && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                          )}
                        </div>
                        
                        {/* البريد الإلكتروني */}
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t('contact.form.email')} *
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border ${
                              errors.email ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                            } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white`}
                          />
                          {errors.email && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                          )}
                        </div>
                        
                        {/* رقم الهاتف */}
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t('contact.form.phone')}
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        
                        {/* الموضوع */}
                        <div>
                          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t('contact.form.subject')} *
                          </label>
                          <input
                            type="text"
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border ${
                              errors.subject ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                            } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white`}
                          />
                          {errors.subject && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.subject}</p>
                          )}
                        </div>
                      </div>
                      
                      {/* الرسالة */}
                      <div className="mb-6">
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          {t('contact.form.message')} *
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows={5}
                          value={formData.message}
                          onChange={handleChange}
                          className={`w-full px-3 py-2 border ${
                            errors.message ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                          } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white`}
                        ></textarea>
                        {errors.message && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.message}</p>
                        )}
                      </div>
                      
                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          variant="primary"
                          size="lg"
                          isLoading={isSubmitting}
                          leftIcon={<MessageSquare size={20} />}
                          className="w-full sm:w-auto justify-center"
                        >
                          {t('contact.form.submit')}
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
            
            {/* معلومات الاتصال */}
            <motion.div
              variants={infoVariants}
              initial="hidden"
              animate="visible"
            >
              <ContactInfo />
            </motion.div>
          </div>
        </div>
      </section>

      {/* قسم الأسئلة الشائعة */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <SectionTitle
            title="الأسئلة الشائعة"
            subtitle="استفسارات متكررة"
            description="إجابات على أسئلة متكررة حول طرق التواصل وآلية العمل"
          />

          <div className="max-w-3xl mx-auto mt-12 space-y-6">
            {/* سؤال 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-700 rounded-lg shadow-sm overflow-hidden"
            >
              <details className="group">
                <summary className="flex justify-between items-center p-6 cursor-pointer">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">كم يستغرق الرد على استفساراتي؟</h3>
                  <span className="transform group-open:rotate-180 transition-transform duration-300">
                    <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </span>
                </summary>
                <div className="p-6 pt-0 text-gray-600 dark:text-gray-300">
                  <p>نحرص على الرد على جميع الاستفسارات في أسرع وقت ممكن. عادةً ما يكون الرد خلال 24 ساعة من استلام الرسالة. في حالات العطل الرسمية قد يستغرق الرد وقتاً أطول قليلاً.</p>
                </div>
              </details>
            </motion.div>

            {/* سؤال 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white dark:bg-gray-700 rounded-lg shadow-sm overflow-hidden"
            >
              <details className="group">
                <summary className="flex justify-between items-center p-6 cursor-pointer">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">هل يمكنني زيارة مقر الشركة لمناقشة مشروعي؟</h3>
                  <span className="transform group-open:rotate-180 transition-transform duration-300">
                    <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </span>
                </summary>
                <div className="p-6 pt-0 text-gray-600 dark:text-gray-300">
                  <p>نعم بالتأكيد! نرحب بزيارتك لمقر الشركة لمناقشة مشروعك بشكل مفصل. يرجى التواصل معنا مسبقاً لتحديد موعد مناسب لضمان تواجد الفريق المختص لاستقبالكم.</p>
                </div>
              </details>
            </motion.div>

            {/* سؤال 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-gray-700 rounded-lg shadow-sm overflow-hidden"
            >
              <details className="group">
                <summary className="flex justify-between items-center p-6 cursor-pointer">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">هل تقدمون خدمات الاستشارات عن بعد؟</h3>
                  <span className="transform group-open:rotate-180 transition-transform duration-300">
                    <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </span>
                </summary>
                <div className="p-6 pt-0 text-gray-600 dark:text-gray-300">
                  <p>نعم، نقدم خدمات الاستشارات التقنية والفنية عن بعد من خلال مكالمات الفيديو أو الهاتف. يمكنكم تحديد موعد للاستشارة من خلال التواصل معنا عبر البريد الإلكتروني أو الهاتف.</p>
                </div>
              </details>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;