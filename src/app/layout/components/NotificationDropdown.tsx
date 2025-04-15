// src/app/layout/components/NotificationDropdown.tsx
import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiBell } from 'react-icons/fi';
import { useClickOutside } from '../../../shared/hooks/useClickOutSide'; // Adjust path if needed

interface NotificationDropdownProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  notificationCount: number; // Example prop
}

export const NotificationDropdown = ({ isOpen, setIsOpen, notificationCount }: NotificationDropdownProps) => {
  const { t } = useTranslation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setIsOpen(false));

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 relative"
        aria-label={t('notifications.title')}
        aria-expanded={isOpen}
      >
        <FiBell />
        {notificationCount > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-semibold">
            {notificationCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">{t('notifications.title')}</h3>
            </div>

            {/* Body */}
            <div className="max-h-60 overflow-y-auto">
              {/* Replace with actual notification items */}
              <a href="#" className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700/50">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">New message received</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">2 minutes ago</p>
              </a>
              <a href="#" className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700/50">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Review requires approval</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">1 hour ago</p>
              </a>
              <a href="#" className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Task assigned to you</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Yesterday</p>
              </a>
              {/* Add a message if no notifications */}
              {/* <div className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">No new notifications</div> */}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <button className="text-sm text-primary-600 dark:text-primary-400 hover:underline w-full text-center font-medium">
                {t('notifications.viewAll')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};