// src/app/layout/components/NotificationDropdown.tsx
import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiBell, FiCheck, FiClock, FiAlertCircle, FiMessageSquare, FiRefreshCw } from 'react-icons/fi';
import { useClickOutside } from '../../../shared/hooks/useClickOutSide';

interface NotificationDropdownProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  notificationCount: number;
}

// Sample notification data - replace with real data in production
const sampleNotifications = [
  {
    id: 1,
    title: "New message received",
    description: "You have a new message from Sarah",
    time: "2 minutes ago",
    read: false,
    type: "message" // message, alert, task, system
  },
  {
    id: 2,
    title: "System update completed",
    description: "The system has been updated to version 2.3.0",
    time: "1 hour ago",
    read: false,
    type: "system"
  },
  {
    id: 3,
    title: "Task reminder",
    description: "Complete the project requirements document",
    time: "3 hours ago",
    read: true,
    type: "task"
  },
  {
    id: 4,
    title: "Security alert",
    description: "Unusual login attempt detected from a new device",
    time: "Yesterday",
    read: true,
    type: "alert"
  }
];

export const NotificationDropdown = ({ isOpen, setIsOpen, notificationCount }: NotificationDropdownProps) => {
  const { t } = useTranslation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setIsOpen(false));

  // Get icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <FiMessageSquare className="text-blue-500" />;
      case 'alert':
        return <FiAlertCircle className="text-red-500" />;
      case 'task':
        return <FiClock className="text-yellow-500" />;
      case 'system':
        return <FiRefreshCw className="text-green-500" />;
      default:
        return <FiBell className="text-gray-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 relative transition-colors duration-200"
        aria-label={t('notifications.title')}
        aria-expanded={isOpen}
      >
        <FiBell size={20} />
        {notificationCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-semibold shadow-sm animate-pulse">
            {notificationCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">{t('notifications.title')} ({notificationCount})</h3>
              <button className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium">
                {t('notifications.markAllRead')}
              </button>
            </div>

            {/* Notification Tabs (optional) */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
              <button className="flex-1 py-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500">
                {t('notifications.all')}
              </button>
              <button className="flex-1 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                {t('notifications.unread')}
              </button>
              <button className="flex-1 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                {t('notifications.mentions')}
              </button>
            </div>

            {/* Body */}
            <div className="max-h-72 overflow-y-auto">
              {sampleNotifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`px-4 py-3 border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150 ${notification.read ? 'opacity-75' : 'bg-blue-50/30 dark:bg-blue-900/10'}`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5 p-1 rounded-full bg-gray-100 dark:bg-gray-700">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="ml-3 flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <p className={`text-sm font-medium ${notification.read ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-gray-100'}`}>
                          {notification.title}
                        </p>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 whitespace-nowrap">
                          {notification.time}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {notification.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Empty state if needed */}
              {notificationCount === 0 && (
                <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                  <div className="rounded-full bg-gray-100 dark:bg-gray-700 p-3 mb-3">
                    <FiBell className="text-gray-500 dark:text-gray-400" size={24} />
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">{t('notifications.noNotifications')}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {t('notifications.emptyStateMessage')}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 flex justify-between items-center">
              <button className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                {t('notifications.settings')}
              </button>
              <button className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium">
                {t('notifications.viewAll')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};