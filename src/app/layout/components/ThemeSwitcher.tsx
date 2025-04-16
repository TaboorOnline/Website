
// src/app/layout/components/ThemeSwitcher.tsx
import { useTheme } from '../../../shared/hooks/useTheme';
import { useTranslation } from 'react-i18next';
import { FiSun, FiMoon, FiMonitor } from 'react-icons/fi';

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <div className="flex items-center space-x-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
      <button
        onClick={() => setTheme('light')}
        className={`p-2 rounded-md transition-colors duration-200 ${
          theme === 'light' 
            ? 'bg-white text-yellow-500 shadow-sm' 
            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
        }`}
        aria-label={t('theme.light')}
        title={t('theme.light')}
      >
        <FiSun size={18} />
      </button>
      <button
        onClick={() => setTheme('system')}
        className={`p-2 rounded-md transition-colors duration-200 ${
          theme === 'system' 
            ? 'bg-white dark:bg-gray-800 text-indigo-500 shadow-sm' 
            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
        }`}
        aria-label={t('theme.system')}
        title={t('theme.system')}
      >
        <FiMonitor size={18} />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`p-2 rounded-md transition-colors duration-200 ${
          theme === 'dark' 
            ? 'bg-gray-800 text-blue-400 shadow-sm' 
            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
        }`}
        aria-label={t('theme.dark')}
        title={t('theme.dark')}
      >
        <FiMoon size={18} />
      </button>
    </div>
  );
};