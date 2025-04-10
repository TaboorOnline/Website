// src/pages/admin/Login.tsx
import { useState, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LogIn } from 'lucide-react';

import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import { isRTL } from '../../i18n';

const AdminLogin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // استخراج المسار المطلوب إعادة التوجيه إليه بعد تسجيل الدخول
  const from = (location.state as { from?: string })?.from || '/admin';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // التحقق من البيانات
    if (!email) {
      setError(t('contact.form.validation.required'));
      return;
    }
    
    if (!password) {
      setError(t('contact.form.validation.required'));
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const session = await login(email, password);
      
      if (session) {
        // حفظ البريد الإلكتروني في تخزين المتصفح إذا تم تحديد "تذكرني"
        if (rememberMe) {
          localStorage.setItem('admin_email', email);
        } else {
          localStorage.removeItem('admin_email');
        }
        
        // التوجيه إلى صفحة لوحة التحكم أو المسار المطلوب
        navigate(from, { replace: true });
      } else {
        setError(t('admin.auth.login.error'));
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(t('admin.auth.login.error'));
    } finally {
      setIsLoading(false);
    }
  };

  // تأثيرات حركية
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };
  
  const formVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        delay: 0.3,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4" dir={isRTL() ? 'rtl' : 'ltr'}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <img src="/logo.svg" alt={t('site.name')} className="h-12 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('admin.auth.login.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            {t('site.name')} {t('admin.dashboard.title')}
          </p>
        </div>
        
        {/* Login Form */}
        <motion.div
          variants={formVariants}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden"
        >
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              {/* Email Field */}
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('admin.auth.login.email')}
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="name@company.com"
                  required
                />
              </div>
              
              {/* Password Field */}
              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('admin.auth.login.password')}
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 rtl:left-0 rtl:right-auto px-3 flex items-center text-gray-500 dark:text-gray-400"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="remember-me" className="ms-2 block text-sm text-gray-700 dark:text-gray-300">
                    {t('admin.auth.login.rememberMe')}
                  </label>
                </div>
                
                <div className="text-sm">
                  <a href="#" className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                    {t('admin.auth.login.forgotPassword')}
                  </a>
                </div>
              </div>
              
              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                leftIcon={<LogIn size={18} />}
                fullWidth
                className="justify-center"
              >
                {t('admin.auth.login.submit')}
              </Button>
            </form>
            
            {/* Return to Website */}
            <div className="mt-6 text-center">
              <a
                href="/"
                className="text-sm text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
              >
                {t('common.goHome')}
              </a>
            </div>
          </div>
          
          {/* Footer */}
          <div className="px-6 py-3 bg-gray-50 dark:bg-gray-900/50 text-center">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              &copy; {new Date().getFullYear()} {t('site.name')}. {t('footer.rights', { year: '' })}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;