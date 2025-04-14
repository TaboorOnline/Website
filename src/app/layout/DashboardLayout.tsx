// src/app/layout/DashboardLayout.tsx
import { ReactNode, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../shared/hooks/useTheme';
import { changeLanguage } from '../../shared/utils/i18n';
import { Language } from '../../shared/types/types';
import { signOut, getCurrentUser } from '../supabaseClient';

// Import icons (you would need to install react-icons)
import {
  FiHome,
  FiUsers,
  FiSettings,
  FiBox,
  FiStar,
  FiFileText,
  FiMail,
  FiClipboard,
  FiBarChart2,
  FiSun,
  FiMoon,
  FiMenu,
  FiX,
  FiGlobe,
  FiLogOut,
  FiChevronDown,
  FiBell
} from 'react-icons/fi';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Navigation links with icons
  const navLinks = [
    { path: '/dashboard', label: t('nav.dashboard'), icon: <FiHome /> },
    { path: '/dashboard/users', label: t('nav.users'), icon: <FiUsers /> },
    { path: '/dashboard/services', label: t('nav.services'), icon: <FiBox /> },
    { path: '/dashboard/team', label: t('nav.team'), icon: <FiUsers /> },
    { path: '/dashboard/reviews', label: t('nav.reviews'), icon: <FiStar /> },
    { path: '/dashboard/blog', label: t('nav.blog'), icon: <FiFileText /> },
    { path: '/dashboard/inbox', label: t('nav.inbox'), icon: <FiMail /> },
    { path: '/dashboard/tasks', label: t('nav.tasks'), icon: <FiClipboard /> },
    { path: '/dashboard/stats', label: t('nav.stats'), icon: <FiBarChart2 /> },
    { path: '/dashboard/settings', label: t('nav.settings'), icon: <FiSettings /> },
  ];

  const toggleLanguage = () => {
    const newLang: Language = i18n.language === 'en' ? 'ar' : 'en';
    changeLanguage(newLang);
  };

  // Check if user is authenticated
  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        navigate('/login');
      } else {
        setUser(currentUser);
      }
    };
    
    checkUser();
  }, [navigate]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  // Responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40">
        <div className="px-4 py-4 flex items-center justify-between">
          {/* Logo and mobile menu toggle */}
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="lg:hidden mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label={isMobileSidebarOpen ? t('nav.close') : t('nav.menu')}
            >
              {isMobileSidebarOpen ? <FiX /> : <FiMenu />}
            </button>

            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden lg:flex p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label={isSidebarOpen ? t('sidebar.collapse') : t('sidebar.expand')}
            >
              <FiMenu />
            </button>
            
            <Link to="/dashboard" className="flex items-center ml-2">
              <span className={`${isSidebarOpen ? 'lg:hidden' : 'hidden lg:block'} text-primary-600 dark:text-primary-400 text-xl font-bold`}>
                Hilal Tech
              </span>
            </Link>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label={theme === 'dark' ? t('theme.light') : t('theme.dark')}
            >
              {theme === 'dark' ? (
                <FiSun className="text-yellow-400" />
              ) : (
                <FiMoon className="text-gray-700" />
              )}
            </button>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
              aria-label={i18n.language === 'en' ? t('language.arabic') : t('language.english')}
            >
              <FiGlobe className="mr-1" />
              <span className="text-sm font-medium">
                {i18n.language === 'en' ? 'AR' : 'EN'}
              </span>
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 relative"
                aria-label={t('notifications.title')}
              >
                <FiBell />
                <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  3
                </span>
              </button>

              {/* Notifications Dropdown */}
              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50"
                  >
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="text-sm font-semibold">{t('notifications.title')}</h3>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {/* Notification items would go here */}
                      <div className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700">
                        <p className="text-sm font-medium">New message received</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">2 minutes ago</p>
                      </div>
                      <div className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700">
                        <p className="text-sm font-medium">Review requires approval</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">1 hour ago</p>
                      </div>
                      <div className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                        <p className="text-sm font-medium">Task assigned to you</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Yesterday</p>
                      </div>
                    </div>
                    <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                      <button className="text-sm text-primary-600 dark:text-primary-400 hover:underline w-full text-center">
                        {t('notifications.viewAll')}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-full p-1 pr-3 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <div className="h-8 w-8 rounded-full bg-primary-500 text-white flex items-center justify-center">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="text-sm font-medium hidden sm:block">
                  {user?.email || 'User'}
                </span>
                <FiChevronDown className="hidden sm:block" />
              </button>

              {/* User Dropdown */}
              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50"
                  >
                    <Link
                      to="/dashboard/profile"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {t('nav.profile')}
                    </Link>
                    <Link
                      to="/dashboard/settings"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {t('nav.settings')}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {t('nav.logout')}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar for mobile */}
        <AnimatePresence>
          {isMobileSidebarOpen && (
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-30 lg:hidden"
            >
              <div className="absolute inset-0 bg-gray-900 bg-opacity-50" onClick={() => setIsMobileSidebarOpen(false)}></div>
              <div className="absolute inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg overflow-y-auto">
                {/* Sidebar content */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <Link to="/dashboard" className="flex items-center">
                    <span className="text-primary-600 dark:text-primary-400 text-xl font-bold">
                      Hilal Tech
                    </span>
                  </Link>
                </div>
                <nav className="mt-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`flex items-center space-x-3 px-4 py-3 text-sm ${
                        location.pathname === link.path
                          ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span className="text-lg">{link.icon}</span>
                      <span>{link.label}</span>
                    </Link>
                  ))}
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sidebar for desktop */}
        <aside
          className={`hidden lg:block bg-white dark:bg-gray-800 overflow-y-auto transition-all duration-300 ease-in-out ${
            isSidebarOpen ? 'w-64' : 'w-20'
          }`}
        >
          <div className={`py-4 ${isSidebarOpen ? 'px-4' : 'px-0'} flex justify-center border-b border-gray-200 dark:border-gray-700`}>
            {isSidebarOpen && (
              <Link to="/dashboard" className="flex items-center">
                <span className="text-primary-600 dark:text-primary-400 text-xl font-bold">
                  Hilal Tech
                </span>
              </Link>
            )}
          </div>
          <nav className="mt-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center ${isSidebarOpen ? 'justify-start px-4' : 'justify-center px-0'} py-3 text-sm ${
                  location.pathname === link.path
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                title={isSidebarOpen ? '' : link.label}
              >
                <span className="text-lg">{link.icon}</span>
                {isSidebarOpen && <span className="ml-3">{link.label}</span>}
              </Link>
            ))}
          </nav>
          {/* Logout button at bottom */}
          <div className="mt-auto py-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className={`flex items-center ${
                isSidebarOpen ? 'justify-start px-4 space-x-3' : 'justify-center px-0'
              } py-3 text-sm w-full text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700`}
              title={isSidebarOpen ? '' : t('nav.logout')}
            >
              <span className="text-lg"><FiLogOut /></span>
              {isSidebarOpen && <span>{t('nav.logout')}</span>}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;