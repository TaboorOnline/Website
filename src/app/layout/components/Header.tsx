// src/app/layout/components/Header.tsx
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../shared/hooks/useTheme';
import { Language } from '../../../shared/types/types';
import { changeLanguage } from '../../../shared/utils/i18n';
import {
  FiSun,
  FiMoon,
  FiMenu,
  FiX,
  FiGlobe,
  FiSearch,
  FiHelpCircle
} from 'react-icons/fi';
import { NotificationDropdown } from './NotificationDropdown';
import { UserDropdown } from './UserDropdown';
import { Link } from 'react-router-dom';
import { useState } from 'react';

interface HeaderProps {
  user: any; // Replace 'any' with a proper User type if available
  handleLogout: () => void;
  toggleMobileSidebar: () => void;
  isMobileSidebarOpen: boolean;
  isUserMenuOpen: boolean;
  setIsUserMenuOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  appName?: string;
}

export const Header = ({
  user,
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
  const [searchQuery, setSearchQuery] = useState('');

  const toggleLanguage = () => {
    const newLang: Language = i18n.language === 'en' ? 'ar' : 'en';
    changeLanguage(newLang);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality here
    console.log('Searching for:', searchQuery);
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-20 h-16 flex items-center transition-colors duration-200">
      <div className="w-full px-4 sm:px-6 flex items-center justify-between">
        {/* Left side: Mobile Menu Toggle + Optional Desktop Logo/Name */}
        <div className="flex items-center">
          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileSidebar}
            className="lg:hidden p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-opacity-50 transition-colors duration-200"
            aria-label={isMobileSidebarOpen ? t('nav.closeMenu') : t('nav.openMenu')}
          >
            {isMobileSidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>

          {/* Desktop Logo/Brand */}
          <Link to="/dashboard" className="hidden lg:block text-primary-600 dark:text-primary-400 text-xl font-bold ml-2">
            {appName}
          </Link>
        </div>

        {/* Search Bar - Center */}
        <div className="hidden md:block mx-4 flex-1 max-w-xl">
          <form onSubmit={handleSearch} className="relative text-gray-600 dark:text-gray-300">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <FiSearch className="text-gray-400 dark:text-gray-500" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100 dark:bg-gray-700 h-10 pl-10 pr-4 py-1 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 border border-transparent focus:border-primary-500 dark:focus:border-primary-400 transition-colors duration-200"
              placeholder={t('header.searchPlaceholder')}
              aria-label={t('header.search')}
            />
            <button type="submit" className="absolute inset-y-0 right-0 flex items-center pr-3 text-primary-600 dark:text-primary-400">
              {/* Optional: Add a search button icon here */}
            </button>
          </form>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          {/* Help Button */}
          <button
            className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
            aria-label={t('header.help')}
            title={t('header.help')}
          >
            <FiHelpCircle size={20} />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
            aria-label={theme === 'dark' ? t('theme.switchToLight') : t('theme.switchToDark')}
            title={theme === 'dark' ? t('theme.switchToLight') : t('theme.switchToDark')}
          >
            {theme === 'dark' ? (
              <FiSun className="text-yellow-400" size={20} />
            ) : (
              <FiMoon className="text-gray-700" size={20} />
            )}
          </button>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 flex items-center space-x-1 transition-colors duration-200"
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
            user={user}
            handleLogout={handleLogout}
          />
        </div>
      </div>
    </header>
  );
};