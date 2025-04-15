// src/app/layout/components/Header.tsx
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../shared/hooks/useTheme'; // Adjust path
import { Language } from '../../../shared/types/types'; // Adjust path
import { changeLanguage } from '../../../shared/utils/i18n'; // Adjust path
import {
  FiSun,
  FiMoon,
  FiMenu,
  FiX,
  FiGlobe,
} from 'react-icons/fi';
import { NotificationDropdown } from './NotificationDropdown';
import { UserDropdown } from './UserDropdown';
import { Link } from 'react-router-dom';

interface HeaderProps {
  userEmail: string | undefined | null;
  handleLogout: () => void;
  toggleMobileSidebar: () => void;
  isMobileSidebarOpen: boolean;
  // Add states and setters for dropdowns if managed here, or pass them down
  isUserMenuOpen: boolean;
  setIsUserMenuOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  appName?: string; // Optional App Name for Logo area
}

export const Header = ({
  userEmail,
  handleLogout,
  toggleMobileSidebar,
  isMobileSidebarOpen,
  isUserMenuOpen,
  setIsUserMenuOpen,
  isNotificationsOpen,
  setIsNotificationsOpen,
  appName = "Hilal Tech"
}: HeaderProps) => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const toggleLanguage = () => {
    const newLang: Language = i18n.language === 'en' ? 'ar' : 'en';
    changeLanguage(newLang);
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-20 h-16 flex items-center">
      <div className="w-full px-4 sm:px-6 flex items-center justify-between">
        {/* Left side: Mobile Menu Toggle + Optional Desktop Logo/Name */}
        <div className="flex items-center">
           {/* Mobile Menu Button */}
           <button
             onClick={toggleMobileSidebar}
             className="lg:hidden mr-3 p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
             aria-label={isMobileSidebarOpen ? t('nav.closeMenu') : t('nav.openMenu')}
           >
             {isMobileSidebarOpen ? <FiX size={20}/> : <FiMenu size={20}/>}
           </button>

           {/* Desktop Logo/Brand (shown when sidebar is collapsed) */}
           {/* Consider removing this if the sidebar always shows the brand */}
           <Link to="/dashboard" className="hidden lg:block text-primary-600 dark:text-primary-400 text-xl font-bold">
             {appName}
           </Link>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100"
            aria-label={theme === 'dark' ? t('theme.switchToLight') : t('theme.switchToDark')}
            title={theme === 'dark' ? t('theme.switchToLight') : t('theme.switchToDark')}
          >
            {theme === 'dark' ? (
              <FiSun className="text-yellow-400" size={20}/>
            ) : (
              <FiMoon className="text-gray-700" size={20}/>
            )}
          </button>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 flex items-center space-x-1"
            aria-label={i18n.language === 'en' ? t('language.switchToArabic') : t('language.switchToEnglish')}
            title={i18n.language === 'en' ? t('language.switchToArabic') : t('language.switchToEnglish')}
          >
            <FiGlobe size={18} />
            <span className="text-xs font-bold">
              {i18n.language === 'en' ? 'AR' : 'EN'}
            </span>
          </button>

          {/* Notifications */}
          <NotificationDropdown
             isOpen={isNotificationsOpen}
             setIsOpen={setIsNotificationsOpen}
             notificationCount={3} // Example count
           />

          {/* User Menu */}
          <UserDropdown
            isOpen={isUserMenuOpen}
            setIsOpen={setIsUserMenuOpen}
            userEmail={userEmail}
            handleLogout={handleLogout}
          />
        </div>
      </div>
    </header>
  );
};