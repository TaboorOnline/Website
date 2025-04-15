// src/app/layout/components/Sidebar.tsx
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLogOut, FiChevronLeft } from 'react-icons/fi'; // Added FiChevronLeft
import { SidebarLink } from './SidebarLink';

// Define NavLink structure if not already global
interface NavLink {
    path: string;
    label: string;
    icon: ReactNode;
}

interface SidebarProps {
  isDesktopOpen: boolean;
  isMobileOpen: boolean;
  closeMobileSidebar: () => void;
  toggleDesktopSidebar: () => void; // Add toggle for desktop collapse button
  navLinks: NavLink[];
  handleLogout: () => void;
  appName?: string;
}

export const Sidebar = ({
  isDesktopOpen,
  isMobileOpen,
  closeMobileSidebar,
  toggleDesktopSidebar,
  navLinks,
  handleLogout,
  appName = "App"
}: SidebarProps) => {
  const { t } = useTranslation();

  const sidebarContent = (isMobile = false) => (
    <div className="flex flex-col h-full">
      {/* Sidebar Header */}
      <div className={`flex items-center border-b border-gray-200 dark:border-gray-700 h-16 ${isDesktopOpen || isMobile ? 'justify-between px-4' : 'justify-center'}`}>
         {(isDesktopOpen || isMobile) && (
            <Link to="/dashboard" className="flex items-center" onClick={isMobile ? closeMobileSidebar : undefined}>
               {/* Consider adding a small logo icon here */}
               <span className="text-primary-600 dark:text-primary-400 text-xl font-bold whitespace-nowrap">
                 {appName}
               </span>
             </Link>
         )}
         {/* Collapse button for Desktop Sidebar */}
         {!isMobile && (
            <button
               onClick={toggleDesktopSidebar}
               className={`p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 ${!isDesktopOpen ? 'rotate-180' : ''} transition-transform duration-300`}
               aria-label={isDesktopOpen ? t('sidebar.collapse') : t('sidebar.expand')}
               title={isDesktopOpen ? t('sidebar.collapse') : t('sidebar.expand')}
            >
               <FiChevronLeft size={20} />
            </button>
          )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navLinks.map((link) => (
          <SidebarLink
            key={link.path}
            path={link.path}
            label={link.label}
            icon={link.icon}
            isSidebarOpen={isMobile || isDesktopOpen}
            onClick={isMobile ? closeMobileSidebar : undefined}
          />
        ))}
      </nav>

      {/* Logout Button */}
      <div className="px-2 py-3 mt-auto border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleLogout}
          className={`flex items-center w-full py-2 text-sm rounded-md transition-colors duration-150 ease-in-out group ${
            isDesktopOpen || isMobile ? 'justify-start px-4' : 'justify-center'
          } text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30`}
          title={!(isDesktopOpen || isMobile) ? t('nav.logout') : undefined}
        >
          <span className={`text-lg ${isDesktopOpen || isMobile ? 'mr-3' : ''}`}><FiLogOut /></span>
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
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-30 bg-gray-900/60 lg:hidden"
                onClick={closeMobileSidebar}
                aria-hidden="true"
              />
            {/* Drawer */}
             <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30, duration: 0.3 }}
                className="fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 shadow-lg lg:hidden"
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
          isDesktopOpen ? 'w-64' : 'w-20'
        }`}
      >
        {sidebarContent(false)}
      </aside>
    </>
  );
};