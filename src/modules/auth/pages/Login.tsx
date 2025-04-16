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
import { FiSun, FiMoon, FiGlobe, FiMail, FiLock, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { changeLanguage } from '../../../shared/utils/i18n';
import { Language } from '../../../shared/types/types';

// Types
interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

// Animation variants
const animations = {
  container: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  },
  item: {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
  },
  error: {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  }
};

// Form schema
const loginSchema = yup.object({
  email: yup.string().email('auth.invalidEmail').required('auth.requiredEmail'),
  password: yup.string().required('auth.requiredPassword'),
  rememberMe: yup.boolean().default(false),
});

// Component for theme and language toggles
const SettingsToggle = ({ 
  theme, 
  toggleTheme, 
  language, 
  toggleLanguage 
}: { 
  theme: string; 
  toggleTheme: () => void; 
  language: string; 
  toggleLanguage: () => void; 
}) => {
  const { t } = useTranslation();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute top-4 right-4 flex space-x-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-1 rounded-full shadow-sm z-10"
    >
      <button
        onClick={toggleTheme}
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
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
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300 flex items-center"
        aria-label={language === 'en' ? t('language.arabic') : t('language.english')}
      >
        <FiGlobe className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        <span className="ml-1 text-sm font-medium text-gray-800 dark:text-gray-200">
          {language === 'en' ? 'AR' : 'EN'}
        </span>
      </button>
    </motion.div>
  );
};

// Reusable form input component
const FormInput = ({ 
  id, 
  label, 
  icon: Icon, 
  error, 
  register, 
  ...props 
}: {
  id: string;
  label: string;
  icon: React.ElementType;
  error?: string;
  register: any;
  [key: string]: any;
}) => {
  const { t } = useTranslation();
  
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          id={id}
          className={`block w-full pl-10 pr-3 py-2.5 border 
                    ${error ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'} 
                    rounded-lg shadow-sm outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200`}
          {...register(id)}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center">
          <FiAlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
          <span>{t(error)}</span>
        </p>
      )}
    </div>
  );
};

// Checkbox component
const Checkbox = ({ id, label, register }: { id: string; label: string; register: any }) => {
  return (
    <div className="flex items-center">
      <div className="relative inline-block cursor-pointer">
        <input
          id={id}
          type="checkbox"
          className="peer sr-only"
          {...register(id)}
        />
        <div className="h-4 w-4 border border-gray-300 dark:border-gray-600 rounded 
                      peer-checked:bg-indigo-500 peer-checked:border-indigo-500 
                      peer-focus:ring-2 peer-focus:ring-indigo-500/30
                      transition-colors flex items-center justify-center">
          <FiCheck className="h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
        </div>
      </div>
      <label htmlFor={id} className="ml-2 block text-sm text-gray-700 dark:text-gray-300 select-none cursor-pointer">
        {label}
      </label>
    </div>
  );
};

// Submit button component
const SubmitButton = ({ isLoading, text, loadingText }: { isLoading: boolean; text: string; loadingText: string }) => {
  return (
    <button
      type="submit"
      className={`
        w-full flex justify-center items-center py-3 px-4
        rounded-xl shadow-lg text-base font-semibold text-white
        bg-gradient-to-r from-indigo-600 to-indigo-500
        hover:from-indigo-700 hover:to-indigo-600
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-800
        disabled:opacity-70 disabled:cursor-not-allowed
        transition-all duration-300
        group
        relative
        overflow-hidden
      `}
      disabled={isLoading}
    >
      <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
      <span className="absolute inset-0 bg-black/5 opacity-0 group-active:opacity-100 transition-opacity duration-150"></span>
      
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" 
               xmlns="http://www.w3.org/2000/svg" 
               fill="none" 
               viewBox="0 0 24 24"
               aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{loadingText}</span>
        </>
      ) : (
        <>
          <span className="mr-2 flex items-center justify-center">
            <svg className="h-5 w-5 text-white opacity-80 group-hover:translate-x-1 transition-transform duration-200" 
                 fill="none" 
                 stroke="currentColor" 
                 strokeWidth={2} 
                 viewBox="0 0 24 24"
                 aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
          <span>{text}</span>
        </>
      )}
    </button>
  );
};

// Error alert component
const ErrorAlert = ({ message }: { message: string }) => {
  const { t } = useTranslation();
  
  return (
    <motion.div 
      variants={animations.error}
      initial="hidden"
      animate="visible"
      className="mb-6 p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm flex items-start"
    >
      <div className="flex-shrink-0 mr-2 mt-0.5">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      </div>
      <div>{t(message) || message}</div>
    </motion.div>
  );
};

// Background decorations component
const BackgroundDecoration = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-indigo-400/10 dark:bg-indigo-600/10 blur-3xl"></div>
    <div className="absolute -left-20 -bottom-20 w-96 h-96 rounded-full bg-indigo-400/10 dark:bg-indigo-600/10 blur-3xl"></div>
    <div className="absolute left-1/3 top-1/3 w-32 h-32 rounded-full bg-purple-400/10 dark:bg-purple-600/10 blur-2xl"></div>
  </div>
);

// Main Login component
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
      // Add subtle delay to show loading state
      setTimeout(() => {
        navigate('/dashboard');
      }, 300);
    } catch (error: any) {
      setError(error.message || t('auth.loginError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4" 
         dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Background decorations */}
      <BackgroundDecoration />
      
      {/* Theme and Language Toggles */}
      <SettingsToggle 
        theme={theme} 
        toggleTheme={toggleTheme} 
        language={i18n.language} 
        toggleLanguage={toggleLanguage} 
      />
      
      <motion.div
        initial="hidden"
        animate="visible"
        variants={animations.container}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo/Brand */}
        <motion.div variants={animations.item} className="text-center mb-6">
          <Link to="/" className="inline-block group focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg p-1">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent dark:from-indigo-400 dark:to-indigo-300 group-hover:scale-105 transition-transform">
              Hilal Tech
            </h2>
          </Link>
        </motion.div>

        {/* Main Card */}
        <div className="relative">
          <motion.div 
            variants={animations.item}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden backdrop-blur-sm border border-gray-100 dark:border-gray-700"
          >
            {/* Card Header */}
            <div className="px-8 pt-8 pb-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {t('auth.signIn')}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('auth.orSignUp')}{' '}
                <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 rounded">
                  {t('auth.signUpNow')}
                </Link>
              </p>
            </div>

            {/* Card Body - Form */}
            <div className="p-8 pt-6">
              {/* Error Message */}
              {error && <ErrorAlert message={error} />}

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Email Field */}
                <FormInput 
                  id="email"
                  label={t('auth.email')}
                  icon={FiMail}
                  type="email"
                  autoComplete="email" 
                  error={errors.email?.message}
                  register={register}
                  aria-invalid={errors.email ? "true" : "false"}
                />

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('auth.password')}
                    </label>
                    <Link 
                      to="/forgot-password" 
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
                    >
                      {t('auth.forgot')}
                    </Link>
                  </div>
                  <FormInput 
                    id="password"
                    label=""
                    icon={FiLock}
                    type="password"
                    autoComplete="current-password" 
                    error={errors.password?.message}
                    register={register}
                    aria-invalid={errors.password ? "true" : "false"}
                  />
                </div>

                {/* Remember Me Checkbox */}
                <Checkbox 
                  id="rememberMe" 
                  label={t('auth.rememberMe')} 
                  register={register} 
                />

                {/* Submit Button */}
                <SubmitButton 
                  isLoading={isLoading} 
                  text={t('auth.signIn')} 
                  loadingText={t('auth.signingIn')} 
                />
              </form>
            </div>
          </motion.div>

          {/* Back to Home Link */}
          <motion.div variants={animations.item} className="mt-6 text-center">
            <Link 
              to="/" 
              className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 inline-flex items-center group focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-lg px-2 py-1"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 mr-1.5 group-hover:-translate-x-1 transition-transform" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                aria-hidden="true"
              >
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