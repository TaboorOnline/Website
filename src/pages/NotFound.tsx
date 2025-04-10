// src/pages/NotFound.tsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Home, Search, ArrowLeft, ArrowRight, AlertTriangle } from 'lucide-react';

import Button from '../components/ui/Button';
import { isRTL } from '../i18n';

const NotFound = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);
  const [isRedirecting, setIsRedirecting] = useState(true);
  const ArrowIcon = isRTL() ? ArrowLeft : ArrowRight;

  // العد التنازلي للتوجيه التلقائي للصفحة الرئيسية
  useEffect(() => {
    if (!isRedirecting) return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      navigate('/');
    }
  }, [countdown, navigate, isRedirecting]);

  // توقف العد التنازلي عند تحرك المؤشر
  const handleMouseMove = () => {
    if (countdown < 5) return; // لا تلغي العد التنازلي إذا كان قريباً من النهاية
    setIsRedirecting(false);
  };

  // روابط سريعة لمساعدة المستخدم
  const quickLinks = [
    { to: '/', label: t('nav.home'), icon: <Home size={16} /> },
    { to: '/services', label: t('nav.services'), icon: <ArrowIcon size={16} /> },
    { to: '/projects', label: t('nav.projects'), icon: <ArrowIcon size={16} /> },
    { to: '/contact', label: t('nav.contact'), icon: <ArrowIcon size={16} /> },
  ];

  // تأثيرات الحركة للصفحة
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-16"
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="max-w-2xl w-full text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* رمز الخطأ */}
        <motion.div 
          variants={itemVariants}
          className="mb-8"
        >
          <div className="flex justify-center items-center">
            <div className="text-9xl font-bold text-primary-600 dark:text-primary-400">4</div>
            <div className="mx-2 w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <AlertTriangle size={40} className="text-primary-600 dark:text-primary-400" />
            </div>
            <div className="text-9xl font-bold text-primary-600 dark:text-primary-400">4</div>
          </div>
        </motion.div>
        
        {/* عنوان الخطأ */}
        <motion.h1 
          variants={itemVariants}
          className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
        >
          {t('common.notFound')}
        </motion.h1>
        
        {/* رسالة الخطأ */}
        <motion.p 
          variants={itemVariants}
          className="text-xl text-gray-600 dark:text-gray-300 mb-8"
        >
          الصفحة التي تبحث عنها غير موجودة أو تم نقلها أو تغيير عنوانها.
        </motion.p>
        
        {/* روابط سريعة */}
        <motion.div 
          variants={itemVariants}
          className="mb-8"
        >
          <div className="mb-4 text-gray-600 dark:text-gray-400">
            قد تجد ما تبحث عنه في إحدى هذه الصفحات:
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            {quickLinks.map((link, index) => (
              <Link
                key={index}
                to={link.to}
                className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-gray-700 dark:text-gray-300 transition-colors"
              >
                <span className="mr-1.5 rtl:ml-1.5 rtl:mr-0">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>
        </motion.div>
        
        {/* مربع البحث */}
        <motion.div 
          variants={itemVariants}
          className="mb-8"
        >
          <div className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder={t('common.search')}
                className="w-full px-4 py-3 pl-10 rtl:pr-10 rtl:pl-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              />
              <div className="absolute inset-y-0 left-0 rtl:right-0 rtl:left-auto pl-3 rtl:pr-3 rtl:pl-0 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <button
                className="absolute inset-y-0 right-0 rtl:left-0 rtl:right-auto pr-3 rtl:pl-3 rtl:pr-0 flex items-center"
              >
                <span className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
                  {t('common.search')}
                </span>
              </button>
            </div>
          </div>
        </motion.div>
        
        {/* زر العودة للرئيسية */}
        <motion.div variants={itemVariants}>
          <Button
            variant="primary"
            size="lg"
            to="/"
            leftIcon={<Home size={18} />}
          >
            {t('common.goHome')}
          </Button>
          
          {/* رسالة العد التنازلي */}
          {isRedirecting && (
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              سيتم توجيهك تلقائياً إلى الصفحة الرئيسية خلال {countdown} ثواني...
              <button
                onClick={() => setIsRedirecting(false)}
                className="ml-1 rtl:mr-1 rtl:ml-0 text-primary-600 dark:text-primary-400 hover:underline"
              >
                إلغاء
              </button>
            </p>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;