// src/pages/Testimonials.tsx
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, User, X, Check } from 'lucide-react';

import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import SectionTitle from '../components/common/SectionTitle';
import { getApprovedTestimonials, addTestimonial, Testimonial } from '../lib/supabase';
import { isRTL } from '../i18n';

// مكون كارت الرأي
const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => {
  const { t } = useTranslation();
  const { name, company, position, rating, created_at } = testimonial;
  
  // تنسيق التاريخ
  const formattedDate = new Date(created_at).toLocaleDateString(
    isRTL() ? 'ar-SA' : 'en-US',
    { year: 'numeric', month: 'short', day: 'numeric' }
  );
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="h-full hover:shadow-lg transition-shadow duration-300">
        <Card.Body className="p-6">
          <div className="flex mb-4">
            {testimonial.image_url ? (
              <img 
                src={testimonial.image_url} 
                alt={name} 
                className="w-12 h-12 rounded-full object-cover mr-4 rtl:ml-4 rtl:mr-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 mr-4 rtl:ml-4 rtl:mr-0">
                <span className="text-lg font-medium">
                  {name.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {position}, {company}
              </p>
              <div className="flex mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i}
                    size={14}
                    className={`${
                      i < rating 
                        ? 'text-yellow-500 fill-yellow-500' 
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 italic mb-4">
            "{isRTL() ? testimonial.content_ar : testimonial.content_en}"
          </p>
          <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
            {formattedDate}
          </div>
        </Card.Body>
      </Card>
    </motion.div>
  );
};

// مكون نموذج إضافة رأي جديد
const TestimonialForm: React.FC<{ onClose: () => void, onSuccess: () => void }> = ({ onClose, onSuccess }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    position: '',
    content_ar: '',
    content_en: '',
    rating: 5
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const currentLanguage = isRTL() ? 'ar' : 'en';

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
    
    if (!formData.company.trim()) {
      newErrors.company = t('contact.form.validation.required');
    }
    
    if (!formData.position.trim()) {
      newErrors.position = t('contact.form.validation.required');
    }
    
    if (!formData[`content_${currentLanguage}`].trim()) {
      newErrors[`content_${currentLanguage}`] = t('contact.form.validation.required');
    } else if (formData[`content_${currentLanguage}`].length < 10) {
      newErrors[`content_${currentLanguage}`] = t('contact.form.validation.minLength', { min: 10 });
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // إغلاق النموذج عند النقر خارجه
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // تحديث البيانات
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

  // ضبط التقييم
  const handleRatingChange = (newRating: number) => {
    setFormData(prev => ({ ...prev, rating: newRating }));
  };

  // إرسال النموذج
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // التحقق من عدم تكرار الإرسال من نفس الجهاز في نفس اليوم
      const lastSubmission = localStorage.getItem('testimonial_submission_date');
      const today = new Date().toDateString();
      
      if (lastSubmission === today) {
        setErrors({
          form: t('testimonials.form.alreadySubmitted')
        });
        return;
      }
      
      // إذا كان المستخدم يستخدم لغة واحدة، قم بنسخ المحتوى للغة الأخرى
      if (!formData.content_ar && formData.content_en) {
        formData.content_ar = formData.content_en;
      } else if (!formData.content_en && formData.content_ar) {
        formData.content_en = formData.content_ar;
      }
      
      const testimonialData = {
        ...formData,
        is_approved: false
      };
      
      const result = await addTestimonial(testimonialData);
      
      if (result) {
        // تخزين تاريخ الإرسال لمنع التكرار
        localStorage.setItem('testimonial_submission_date', today);
        
        setHasSubmitted(true);
        setTimeout(() => {
          onSuccess();
        }, 3000);
      } else {
        throw new Error('Failed to submit testimonial');
      }
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      setErrors({
        form: t('testimonials.form.error')
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        ref={formRef}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden"
      >
        {!hasSubmitted ? (
          <>
            <div className="px-6 py-4 border-b dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t('testimonials.form.title')}
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={onClose}
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="px-6 py-4">
              {errors.form && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-md text-sm">
                  {errors.form}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* الاسم */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('testimonials.form.name')} *
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
                    {t('testimonials.form.email')} *
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
                
                {/* الشركة */}
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('testimonials.form.company')} *
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors.company ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white`}
                  />
                  {errors.company && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.company}</p>
                  )}
                </div>
                
                {/* المنصب */}
                <div>
                  <label htmlFor="position" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('testimonials.form.position')} *
                  </label>
                  <input
                    type="text"
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors.position ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white`}
                  />
                  {errors.position && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.position}</p>
                  )}
                </div>
              </div>
              
              {/* التقييم */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('testimonials.form.rating')} *
                </label>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingChange(star)}
                      className="p-1 focus:outline-none"
                    >
                      <Star 
                        size={24}
                        className={`${
                          star <= formData.rating 
                            ? 'text-yellow-500 fill-yellow-500' 
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {t('testimonials.form.ratingHint')}
                </p>
              </div>
              
              {/* الرسالة */}
              <div className="mb-6">
                <label 
                  htmlFor={`content_${currentLanguage}`} 
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  {t('testimonials.form.message')} *
                </label>
                <textarea
                  id={`content_${currentLanguage}`}
                  name={`content_${currentLanguage}`}
                  value={formData[`content_${currentLanguage}` as keyof typeof formData] as string}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-3 py-2 border ${
                    errors[`content_${currentLanguage}`] ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white`}
                ></textarea>
                {errors[`content_${currentLanguage}`] && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[`content_${currentLanguage}`]}</p>
                )}
              </div>
              
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="mr-2 rtl:ml-2 rtl:mr-0"
                >
                  {t('common.cancel')}
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSubmitting}
                >
                  {t('testimonials.form.submit')}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={32} className="text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {t('common.success')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {t('testimonials.form.success')}
            </p>
            <Button variant="primary" onClick={onClose}>
              {t('common.close')}
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

// الصفحة الرئيسية لآراء العملاء
const TestimonialsPage = () => {
  const { t } = useTranslation();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // التحقق من إمكانية إضافة رأي جديد
  const canAddTestimonial = () => {
    const lastSubmission = localStorage.getItem('testimonial_submission_date');
    const today = new Date().toDateString();
    return lastSubmission !== today;
  };
  
  // جلب التيستيمونيال
  const fetchTestimonials = async () => {
    setIsLoading(true);
    try {
      const data = await getApprovedTestimonials();
      setTestimonials(data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTestimonials();
  }, []);
  
  // فتح نموذج إضافة رأي جديد
  const handleAddTestimonial = () => {
    if (canAddTestimonial()) {
      setShowForm(true);
    } else {
      // يمكن إضافة رسالة تنبيه هنا
      alert(t('testimonials.form.alreadySubmitted'));
    }
  };
  
  // تأثيرات الحركة
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
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
              {t('testimonials.title')}
            </h1>
            <p className="text-xl text-gray-200">
              {t('testimonials.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* قسم آراء العملاء */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionTitle
            title={t('testimonials.title')}
            subtitle={t('testimonials.subtitle')}
            description={t('testimonials.description')}
          />
          
          <div className="flex justify-center mb-12">
            <Button
              variant="primary"
              size="lg"
              onClick={handleAddTestimonial}
              leftIcon={<MessageSquare size={20} />}
            >
              {t('testimonials.addTestimonial')}
            </Button>
          </div>
          
          {isLoading ? (
            // حالة التحميل
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
                  <div className="flex mb-4">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full mr-4"></div>
                    <div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-32"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 mt-1"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : testimonials.length > 0 ? (
            // عرض التيستيمونيال
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {testimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </motion.div>
          ) : (
            // حالة عدم وجود بيانات
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <MessageSquare size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                {t('testimonials.noTestimonials')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                {t('testimonials.emptyDescription')}
              </p>
              <Button
                variant="primary"
                onClick={handleAddTestimonial}
                leftIcon={<MessageSquare size={18} />}
              >
                {t('testimonials.addTestimonial')}
              </Button>
            </div>
          )}
        </div>
      </section>
      
      {/* نموذج إضافة رأي جديد */}
      <AnimatePresence>
        {showForm && (
          <TestimonialForm
            onClose={() => setShowForm(false)}
            onSuccess={() => {
              setShowForm(false);
              fetchTestimonials();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TestimonialsPage;