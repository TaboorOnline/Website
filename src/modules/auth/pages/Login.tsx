// src/modules/auth/pages/Login.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { signIn } from '../../../app/supabaseClient';
import { useTheme } from '../../../shared/hooks/useTheme';
import { FiSun, FiMoon, FiGlobe, FiMail, FiLock, FiCheck } from 'react-icons/fi';
import { changeLanguage } from '../../../shared/utils/i18n';
import { Language } from '../../../shared/types/types';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const loginSchema = yup.object({
  email: yup.string().email('auth.invalidEmail').required('auth.requiredEmail'),
  password: yup.string().required('auth.requiredPassword'),
  rememberMe: yup.boolean().default(false),
});

const Login = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const toggleLanguage = () => {
    const newLang: Language = i18n.language === 'en' ? 'ar' : 'en';
    changeLanguage(newLang);
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError('');
    
    try {
      await signIn(data.email, data.password);
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.message || t('auth.loginError'));
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      {/* Background Design Element */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-primary-400/10 dark:bg-primary-600/10 blur-3xl"></div>
        <div className="absolute -left-20 -bottom-20 w-96 h-96 rounded-full bg-primary-400/10 dark:bg-primary-600/10 blur-3xl"></div>
      </div>
      
      {/* Theme and Language Toggles */}
      <div className="absolute top-4 right-4 flex space-x-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-1 rounded-full shadow-sm z-10">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label={theme === 'dark' ? t('theme.light') : t('theme.dark')}
        >
          {theme === 'dark' ? (
            <FiSun className="text-yellow-400 h-5 w-5" />
          ) : (
            <FiMoon className="text-gray-700 dark:text-gray-300 h-5 w-5" />
          )}
        </button>

        <div className="w-px h-5 bg-gray-300 dark:bg-gray-700 my-auto"></div>

        <button
          onClick={toggleLanguage}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center"
          aria-label={i18n.language === 'en' ? t('language.arabic') : t('language.english')}
        >
          <FiGlobe className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          <span className="ml-1 text-sm font-medium text-gray-800 dark:text-gray-200">
            {i18n.language === 'en' ? 'AR' : 'EN'}
          </span>
        </button>
      </div>
      
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md relative z-10"
      >
        <motion.div variants={itemVariants} className="text-center mb-6">
          <Link to="/" className="inline-block group">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent dark:from-primary-400 dark:to-primary-300 group-hover:scale-105 transition-transform">
              Hilal Tech
            </h2>
          </Link>
        </motion.div>

        <div className="relative">
          <motion.div 
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden backdrop-blur-sm border border-gray-100 dark:border-gray-700"
          >
            <div className="px-8 pt-8 pb-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {t('auth.signIn')}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('auth.orSignUp')}{' '}
                <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 hover:underline">
                  {t('auth.signUpNow')}
                </Link>
              </p>
            </div>

            <div className="p-8 pt-6">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm flex items-start"
                >
                  <div className="flex-shrink-0 mr-2 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>{t(error) || error}</div>
                </motion.div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('auth.email')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      className={`block w-full pl-10 pr-3 py-2.5 border ${errors.email ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'} rounded-lg shadow-sm outline-none focus:border-green-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                      {...register('email')}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {t(errors.email.message || '')}
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('auth.password')}
                    </label>
                    <Link to="/forgot-password" className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 hover:underline">
                      {t('auth.forgot')}
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      className={`block w-full pl-10 pr-3 py-2.5 border ${errors.password ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'} rounded-lg shadow-sm outline-none focus:border-green-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                      {...register('password')}
                    />
                  </div>
                  {errors.password && (
                    <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {t(errors.password.message || '')}
                    </p>
                  )}
                </div>

                <div className="flex items-center">
                  <div className="relative inline-block cursor-pointer">
                    <input
                      id="remember-me"
                      type="checkbox"
                      className="peer opacity-0 absolute h-4 w-4"
                      {...register('rememberMe')}
                    />
                    <div className="h-4 w-4 border border-gray-300 dark:border-gray-600 rounded peer-checked:bg-primary-500 peer-checked:border-primary-500 transition-colors flex items-center justify-center">
                      <FiCheck className="h-3 w-3 text-white hidden peer-checked:block" />
                    </div>
                  </div>
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300 select-none">
                    {t('auth.rememberMe')}
                  </label>
                </div>

                <div>
                    <button
                    type="submit"
                    className={`
                      w-full flex justify-center items-center py-3 px-4
                      rounded-xl shadow-lg text-base font-semibold
                      bg-gradient-to-r from-primary-600 to-primary-400
                      hover:from-primary-700 hover:to-primary-500
                      bg-green-700
                      disabled:opacity-60 disabled:cursor-not-allowed
                      transition-all duration-200
                      group
                      relative
                      overflow-hidden
                    `}
                    disabled={isLoading}
                    >
                    <span
                      className={`
                      absolute inset-0 opacity-0 group-hover:opacity-100
                      bg-white/10 pointer-events-none transition-opacity duration-300
                      `}
                    ></span>
                    {isLoading ? (
                      <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('auth.signingIn')}
                      </>
                    ) : (
                      <>
                      <span className="mr-2 flex items-center justify-center">
                        <svg className="h-5 w-5 text-white opacity-80 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </span>
                      {t('auth.signIn')}
                      </>
                    )}
                    </button>
                </div>
              </form>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-6 text-center">
            <Link to="/" className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 inline-flex items-center group">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {t('auth.backToHome')}
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;