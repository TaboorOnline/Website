// src/components/common/Footer.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Linkedin, Send, Heart } from 'lucide-react';
import { isRTL } from '../../i18n';

const Footer = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribeError, setSubscribeError] = useState(false);
  const currentYear = new Date().getFullYear();

  // محاكاة عملية الاشتراك في النشرة البريدية
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    
    // التحقق من صحة البريد الإلكتروني
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setSubscribeError(true);
      return;
    }
    
    // في الحالة الحقيقية، سيتم إرسال طلب إلى الخادم هنا
    setTimeout(() => {
      setIsSubscribed(true);
      setSubscribeError(false);
      setEmail('');
    }, 800);
  };

  // تأثيرات الحركة للأقسام
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-6" dir={isRTL() ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* القسم الأول - معلومات الشركة */}
          <motion.div variants={itemVariants}>
            <Link to="/" className="flex items-center mb-4">
              <img src="/logo-white.svg" alt={t('site.name')} className="h-10 w-auto" />
              <span className="text-xl font-bold ms-2 text-primary-400">
                {t('site.name')}
              </span>
            </Link>
            <p className="text-gray-400 mb-4">
              {t('site.description')}
            </p>
            <div className="flex space-x-4 rtl:space-x-reverse">
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
            </div>
          </motion.div>

          {/* القسم الثاني - روابط سريعة */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-4">{t('nav.home')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-primary-400 transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-primary-400 transition-colors">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-primary-400 transition-colors">
                  {t('nav.services')}
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-gray-400 hover:text-primary-400 transition-colors">
                  {t('nav.projects')}
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="text-gray-400 hover:text-primary-400 transition-colors">
                  {t('nav.testimonials')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-primary-400 transition-colors">
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* القسم الثالث - معلومات الاتصال */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-4">{t('contact.info.title')}</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-primary-400 mt-1 me-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                <div>
                  <p className="text-sm text-gray-200">{t('contact.info.address')}</p>
                  <p className="text-gray-400">{t('contact.info.addressValue')}</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-primary-400 mt-1 me-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </span>
                <div>
                  <p className="text-sm text-gray-200">{t('contact.info.phone')}</p>
                  <p className="text-gray-400 hover:text-primary-400 transition-colors">
                    <a href="tel:+966123456789">{t('contact.info.phoneValue')}</a>
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-primary-400 mt-1 me-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <div>
                  <p className="text-sm text-gray-200">{t('contact.info.email')}</p>
                  <p className="text-gray-400 hover:text-primary-400 transition-colors">
                    <a href="mailto:info@helaltech.com">{t('contact.info.emailValue')}</a>
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-primary-400 mt-1 me-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <div>
                  <p className="text-sm text-gray-200">{t('contact.info.hours')}</p>
                  <p className="text-gray-400">{t('contact.info.hoursValue')}</p>
                </div>
              </li>
            </ul>
          </motion.div>

          {/* القسم الرابع - النشرة البريدية */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-4">{t('footer.subscribe.title')}</h3>
            <p className="text-gray-400 mb-4">
              {t('site.tagline')}
            </p>
            {!isSubscribed ? (
              <form onSubmit={handleSubscribe} className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setSubscribeError(false);
                  }}
                  placeholder={t('footer.subscribe.placeholder')}
                  className={`w-full py-3 ps-4 pe-12 rounded-md bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    subscribeError ? 'border border-red-500' : ''
                  }`}
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 end-0 flex items-center px-4 text-primary-400 hover:text-primary-300 focus:outline-none"
                  aria-label={t('footer.subscribe.submit')}
                >
                  <Send size={18} />
                </button>
                {subscribeError && (
                  <p className="text-red-400 text-sm mt-1">
                    {t('contact.form.validation.email')}
                  </p>
                )}
              </form>
            ) : (
              <div className="bg-primary-500/20 text-primary-400 py-3 px-4 rounded-md text-center">
                {t('footer.subscribe.success')}
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* خط فاصل */}
        <div className="border-t border-gray-800 mt-12 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              {t('footer.rights', { year: currentYear })}
            </p>
            <div className="flex space-x-4 rtl:space-x-reverse text-sm">
              <Link to="/terms" className="text-gray-400 hover:text-primary-400 transition-colors">
                {t('footer.terms')}
              </Link>
              <Link to="/privacy" className="text-gray-400 hover:text-primary-400 transition-colors">
                {t('footer.privacy')}
              </Link>
              <div className="text-gray-400 flex items-center">
                <span>{t('common.language')}: </span>
                <button 
                  onClick={() => document.dispatchEvent(new CustomEvent('toggleLanguage'))}
                  className="ms-2 text-primary-400 hover:text-primary-300 focus:outline-none"
                >
                  {isRTL() ? 'English' : 'العربية'}
                </button>
              </div>
            </div>
          </div>
          
          {/* توقيع المطور */}
          <div className="text-center text-gray-500 text-xs mt-6 flex items-center justify-center">
            <span>
              {isRTL() ? 'تم التطوير بواسطة ' : 'Developed with '}
            </span>
            <Heart size={12} className="mx-1 text-red-500 animate-pulse" />
            <span>
              {isRTL() ? ' فريق هلال تك' : ' by Helal Tech Team'}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;