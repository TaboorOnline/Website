// src/app/layout/components/Sidebar.tsx
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLogOut, FiChevronLeft } from 'react-icons/fi';
import { SidebarLink } from './SidebarLink';

// Define NavLink structure with categories
interface NavItem {
  path: string;
  label: string;
  icon: ReactNode;
}

interface NavCategory {
  category: string;
  items: NavItem[];
}

interface SidebarProps {
  isDesktopOpen: boolean;
  isMobileOpen: boolean;
  closeMobileSidebar: () => void;
  toggleDesktopSidebar: () => void;
  navLinks: NavCategory[];
  handleLogout: () => void;
  appName?: string;
  user: any; // Replace with proper type
}

export const Sidebar = ({
  isDesktopOpen,
  isMobileOpen,
  closeMobileSidebar,
  toggleDesktopSidebar,
  navLinks,
  handleLogout,
  appName = "App",
  user
}: SidebarProps) => {
  const { t } = useTranslation();

  // Get user initial for the avatar
  const userInitial = user?.email?.charAt(0).toUpperCase() || '?';

  const sidebarContent = (isMobile = false) => (
    <div className="flex flex-col h-full">
      {/* Sidebar Header */}
      <div className={`flex items-center border-b border-gray-200 dark:border-gray-700 h-16 ${isDesktopOpen || isMobile ? 'justify-between px-4' : 'justify-center'}`}>
        {(isDesktopOpen || isMobile) && (
          <Link to="/dashboard" className="flex items-center space-x-2" onClick={isMobile ? closeMobileSidebar : undefined}>
            {/* Logo or Icon */}
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-md flex items-center justify-center text-white font-bold text-lg shadow-md">
              H
            </div>
            <span className="text-primary-600 dark:text-primary-400 text-xl font-bold whitespace-nowrap">
              {appName}
            </span>
          </Link>
        )}
        {/* Collapse button for Desktop Sidebar */}
        {!isMobile && (
          <button
            onClick={toggleDesktopSidebar}
            className={`p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400 ${!isDesktopOpen ? 'rotate-180' : ''} transition-all duration-300`}
            aria-label={isDesktopOpen ? t('sidebar.collapse') : t('sidebar.expand')}
            title={isDesktopOpen ? t('sidebar.collapse') : t('sidebar.expand')}
          >
            <FiChevronLeft size={18} />
          </button>
        )}
      </div>

      {/* User Profile Summary (only when expanded) */}
      {(isDesktopOpen || isMobile) && (
        <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white flex items-center justify-center text-sm font-semibold shadow-sm">
              {userInitial}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {user?.name || t('sidebar.welcome')}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.email || ''}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Links By Category */}
      <nav className="flex-1 px-2 py-4 space-y-6 overflow-y-auto">
        {navLinks.map((category, index) => (
          <div key={index} className="space-y-1">
            {/* Category Title (only when expanded) */}
            {(isDesktopOpen || isMobile) && (
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3 pb-1">
                {category.category}
              </h3>
            )}
            
            {category.items.map((link) => (
              <SidebarLink
                key={link.path}
                path={link.path}
                label={link.label}
                icon={link.icon}
                isSidebarOpen={isMobile || isDesktopOpen}
                onClick={isMobile ? closeMobileSidebar : undefined}
              />
            ))}
          </div>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="px-2 py-4 mt-auto border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleLogout}
          className={`flex items-center w-full py-2.5 text-sm rounded-md transition-all duration-200 group ${
            isDesktopOpen || isMobile ? 'justify-start px-4' : 'justify-center'
          } text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-700 dark:hover:text-red-300`}
          title={!(isDesktopOpen || isMobile) ? t('nav.logout') : undefined}
        >
          <span className={`${isDesktopOpen || isMobile ? 'mr-3' : ''}`}>
            <FiLogOut size={18} />
          </span>
          {(isDesktopOpen || isMobile) && <span className="whitespace-nowrap">{t('nav.logout')}</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-30 bg-gray-900/70 lg:hidden backdrop-blur-sm"
              onClick={closeMobileSidebar}
              aria-hidden="true"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30, duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-40 w-72 bg-white dark:bg-gray-800 shadow-xl lg:hidden"
              role="dialog"
              aria-modal="true"
            >
              {sidebarContent(true)}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex lg:flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out ${
          isDesktopOpen ? 'w-72' : 'w-20'
        }`}
      >
        {sidebarContent(false)}
      </aside>
    </>
  );
};