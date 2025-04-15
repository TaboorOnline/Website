// src/app/layout/components/UserDropdown.tsx
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiChevronDown, FiUser, FiSettings, FiLogOut, FiCreditCard, FiHelpCircle, FiShield } from 'react-icons/fi';
import { useClickOutside } from '../../../shared/hooks/useClickOutSide';

interface UserDropdownProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  user: any; // Replace with proper User type
  handleLogout: () => void;
}

export const UserDropdown = ({ isOpen, setIsOpen, user, handleLogout }: UserDropdownProps) => {
  const { t } = useTranslation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setIsOpen(false));

  const userInitial = user?.email?.charAt(0).toUpperCase() || '?';
  const displayName = user?.name || user?.email || t('nav.user');
  const displayEmail = user?.email || '';
  const userRole = user?.role || 'Admin'; // Example role, replace with actual user role

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 p-1 pr-2 transition-all duration-200"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {/* Avatar with gradient background */}
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center text-sm font-medium shadow-sm">
          {userInitial}
        </div>
        
        {/* Name (optional on smaller screens) */}
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block max-w-[120px] truncate">
          {displayName}
        </span>
        
        {/* Down arrow with animation */}
        <FiChevronDown 
          className={`hidden sm:block text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          size={16} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50 overflow-hidden"
          >
            {/* User Info Header with improved styling */}
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center text-sm font-semibold shadow-sm">
                  {userInitial}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{displayName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{displayEmail}</p>
                  <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded text-xs font-medium bg-primary-100 dark:bg-primary-900/40 text-primary-800 dark:text-primary-300">
                    {userRole}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Menu Options */}
            <div className="py-1">
              <Link
                to="/dashboard/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors duration-150"
              >
                <FiUser className="mr-3 text-gray-500 dark:text-gray-400" size={16} /> 
                {t('nav.profile')}
              </Link>
              
              <Link
                to="/dashboard/billing"
                onClick={() => setIsOpen(false)}
                className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors duration-150"
              >
                <FiCreditCard className="mr-3 text-gray-500 dark:text-gray-400" size={16} /> 
                {t('nav.billing')}
              </Link>
              
              <Link
                to="/dashboard/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors duration-150"
              >
                <FiSettings className="mr-3 text-gray-500 dark:text-gray-400" size={16} /> 
                {t('nav.settings')}
              </Link>
              
              <Link
                to="/dashboard/security"
                onClick={() => setIsOpen(false)}
                className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors duration-150"
              >
                <FiShield className="mr-3 text-gray-500 dark:text-gray-400" size={16} /> 
                {t('nav.security')}
              </Link>
              
              <Link
                to="/dashboard/help"
                onClick={() => setIsOpen(false)}
                className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors duration-150 border-b border-gray-100 dark:border-gray-700"
              >
                <FiHelpCircle className="mr-3 text-gray-500 dark:text-gray-400" size={16} /> 
                {t('nav.help')}
              </Link>
            </div>
            
            {/* Logout Button */}
            <div className="py-1 bg-gray-50 dark:bg-gray-800/80">
              <button
                onClick={() => { handleLogout(); setIsOpen(false); }}
                className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors duration-150"
              >
                <FiLogOut className="mr-3" size={16} /> 
                {t('nav.logout')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};