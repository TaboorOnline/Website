// src/modules/auth/pages/Register.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { signUp } from '../../../app/supabaseClient';
import { useTheme } from '../../../shared/hooks/useTheme';
import { FiSun, FiMoon, FiGlobe } from 'react-icons/fi';
import { changeLanguage } from '../../../shared/utils/i18n';
import { Language } from '../../../shared/types/types';

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

const registerSchema = yup.object({
  email: yup.string().email('auth.invalidEmail').required('auth.requiredEmail'),
  password: yup.string()
    .required('auth.requiredPassword')
    .min(8, 'auth.passwordLength'),
  confirmPassword: yup.string()
    .required('auth.confirmPassword')
    .oneOf([yup.ref('password')], 'auth.passwordMatch'),
  agreeTerms: yup.boolean()
    .required('auth.agreeTerms')
    .oneOf([true], 'auth.agreeTerms'),
});

const Register = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
  });

  const toggleLanguage = () => {
    const newLang: Language = i18n.language === 'en' ? 'ar' : 'en';
    changeLanguage(newLang);
  };

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError('');
    
    try {
      await signUp(data.email, data.password);
      setSuccess(true);
    } catch (error: any) {
      setError(error.message || t('auth.registerError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      {/* Theme and Language Toggles */}
      <div className="absolute top-4 right-4 flex space-x-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
          aria-label={theme === 'dark' ? t('theme.light') : t('theme.dark')}
        >
          {theme === 'dark' ? (
            <FiSun className="text-yellow-400" />
          ) : (
            <FiMoon className="text-gray-700" />
          )}
        </button>

        <button
          onClick={toggleLanguage}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 flex items-center"
          aria-label={i18n.language === 'en' ? t('language.arabic') : t('language.english')}
        >
          <FiGlobe className="mr-1" />
          <span className="text-sm font-medium">
            {i18n.language === 'en' ? 'AR' : 'EN'}
          </span>
        </button>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h2 className="text-3xl font-bold text-primary-600 dark:text-primary-400">Hilal Tech</h2>
          </Link>
          <h1 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            {t('auth.createAccount')}
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {t('auth.alreadyHaveAccount')}{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
              {t('auth.signInHere')}
            </Link>
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md text-sm">
              {t(error) || error}
            </div>
          )}

          {success ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md text-sm">
                {t('auth.registerSuccess')}
              </div>
              <p className="mb-4 text-gray-600 dark:text-gray-400">
                {t('auth.checkEmail')}
              </p>
              <button 
                onClick={() => navigate('/login')}
                className="btn btn-primary w-full"
              >
                {t('auth.goToLogin')}
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('auth.email')}
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className="input w-full"
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {t(errors.email.message || '')}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('auth.password')}
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    className="input w-full"
                    {...register('password')}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {t(errors.password.message || '')}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('auth.confirmPassword')}
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    className="input w-full"
                    {...register('confirmPassword')}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {t(errors.confirmPassword.message || '')}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="agreeTerms"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    {...register('agreeTerms')}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="agreeTerms" className="font-medium text-gray-700 dark:text-gray-300">
                    {t('auth.agreeToTerms')}{' '}
                    <Link to="/terms" className="text-primary-600 hover:text-primary-500 dark:text-primary-400">
                      {t('auth.termsOfService')}
                    </Link>
                    {' '}{t('auth.and')}{' '}
                    <Link to="/privacy" className="text-primary-600 hover:text-primary-500 dark:text-primary-400">
                      {t('auth.privacyPolicy')}
                    </Link>
                  </label>
                  {errors.agreeTerms && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {t(errors.agreeTerms.message || '')}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('auth.creatingAccount')}
                    </>
                  ) : (
                    t('auth.createAccount')
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="mt-8 text-center">
          <Link to="/" className="text-sm font-medium text-gray-600 hover:text-gray-500 dark:text-gray-400">
            &larr; {t('auth.backToHome')}
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;