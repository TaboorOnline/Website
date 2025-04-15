// src/app/layout/components/UserDropdown.tsx
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiChevronDown, FiUser, FiSettings, FiLogOut } from 'react-icons/fi';
import { useClickOutside } from '../../../shared/hooks/useClickOutSide'; // Adjust path

interface UserDropdownProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  userEmail: string | undefined | null;
  handleLogout: () => void;
}

export const UserDropdown = ({ isOpen, setIsOpen, userEmail, handleLogout }: UserDropdownProps) => {
  const { t } = useTranslation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setIsOpen(false));

  const userInitial = userEmail?.charAt(0).toUpperCase() || '?';
  const displayEmail = userEmail || 'User';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 rounded-full p-1 pr-2 hover:bg-gray-100 dark:hover:bg-gray-700"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {/* Avatar */}
        <div className="h-8 w-8 rounded-full bg-primary-500 dark:bg-primary-600 text-white flex items-center justify-center text-sm font-semibold">
          {userInitial}
        </div>
        {/* Email (optional on smaller screens) */}
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block max-w-[100px] truncate" title={displayEmail}>
           {displayEmail}
        </span>
        <FiChevronDown className={`hidden sm:block text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50"
          >
            {/* Optional: User Info Header */}
            <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700 mb-1">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{displayEmail}</p>
                {/* <p className="text-xs text-gray-500 dark:text-gray-400">Admin Role</p> */}
            </div>
            <Link
              to="/dashboard/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
               <FiUser className="mr-2" /> {t('nav.profile')}
            </Link>
            <Link
              to="/dashboard/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
               <FiSettings className="mr-2" /> {t('nav.settings')}
            </Link>
            <div className="my-1 h-px bg-gray-100 dark:bg-gray-700"></div> {/* Separator */}
            <button
              onClick={() => { handleLogout(); setIsOpen(false); }}
              className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
            >
               <FiLogOut className="mr-2" /> {t('nav.logout')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};