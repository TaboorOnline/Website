// src/modules/auth/pages/ForgotPassword.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { supabase } from "../../../app/supabaseClient";
import { useTheme } from '../../../shared/hooks/useTheme';
import { FiSun, FiMoon, FiGlobe, FiMail, FiCheck, FiAlertCircle, FiArrowLeft } from 'react-icons/fi';
import { changeLanguage } from '../../../shared/utils/i18n';
import { Language } from '../../../shared/types/types';

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
  alert: {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  }
};

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
  error, 
  ...props 
}: {
  id: string;
  label: string;
  error?: string;
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
          <FiMail className="h-5 w-5 text-gray-400" />
        </div>
        <input
          id={id}
          className={`block w-full pl-10 pr-3 py-2.5 border 
                    ${error ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'} 
                    rounded-lg shadow-sm outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200`}
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

// Alert component for messages
const Alert = ({ type, text }: { type: "success" | "error"; text: string }) => {
  return (
    <motion.div 
      variants={animations.alert}
      initial="hidden"
      animate="visible"
      className={`p-4 mb-6 rounded-lg flex items-start
                ${type === "success" 
                  ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300" 
                  : "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300"}`}
    >
      <div className="flex-shrink-0 mr-2 mt-0.5">
        {type === "success" ? (
          <FiCheck className="h-5 w-5" />
        ) : (
          <FiAlertCircle className="h-5 w-5" />
        )}
      </div>
      <span>{text}</span>
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

// Success state component
const SuccessState = ({ email }: { email: string }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center"
    >
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
          <FiCheck className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {t('auth.resetEmailSent')}
      </h3>
      
      <p className="mb-6 text-gray-600 dark:text-gray-400">
        {t('auth.resetInstructionsSent')} <span className="font-medium">{email}</span>
      </p>
      
      <div className="flex flex-col space-y-3">
        <button 
          onClick={() => navigate('/login')}
          className="w-full flex justify-center items-center py-3 px-4
                    rounded-xl shadow-md text-base font-semibold text-white
                    bg-indigo-600 hover:bg-indigo-700
                    focus:outline-none focus:ring-2 focus:ring-indigo-500
                    transition-all duration-200"
        >
          {t('auth.backToLogin')}
        </button>
        
        <button 
          onClick={() => window.location.reload()}
          className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 py-2"
        >
          {t('auth.didntReceiveEmail')}
        </button>
      </div>
    </motion.div>
  );
};

// Main ForgotPassword component
const ForgotPassword = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const toggleLanguage = () => {
    const newLang: Language = i18n.language === 'en' ? 'ar' : 'en';
    changeLanguage(newLang);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    if (!email) {
      setMessage({
        type: "error",
        text: t('auth.emailRequired'),
      });
      return;
    }

    // Simple email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage({
        type: "error",
        text: t('auth.invalidEmail'),
      });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      // Short delay to show loading state
      setTimeout(() => {
        setIsSuccess(true);
      }, 300);
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || t('auth.resetError'),
      });
    } finally {
      setLoading(false);
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
        <motion.div 
          variants={animations.item}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden backdrop-blur-sm border border-gray-100 dark:border-gray-700 p-8"
        >
          {!isSuccess ? (
            <>
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t('auth.resetPassword')}
                </h1>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {t('auth.resetInstructions')}
                </p>
              </div>

              {message && <Alert type={message.type} text={message.text} />}

              <form onSubmit={handleForgotPassword} className="space-y-6">
                <FormInput
                  id="email"
                  label={t('auth.email')}
                  type="email"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  placeholder={t('auth.enterEmail')}
                  autoComplete="email"
                  required
                  aria-required="true"
                />

                <SubmitButton 
                  isLoading={loading} 
                  text={t('auth.sendResetInstructions')} 
                  loadingText={t('auth.sending')} 
                />

                <div className="text-center mt-6">
                  <Link 
                    to="/login" 
                    className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg px-2 py-1 group"
                  >
                    <FiArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
                    {t('auth.backToLogin')}
                  </Link>
                </div>
              </form>
            </>
          ) : (
            <SuccessState email={email} />
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;