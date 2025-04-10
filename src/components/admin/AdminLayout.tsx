// src/components/admin/AdminLayout.tsx
import { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { 
  Menu, X, ChevronDown, ChevronLeft, ChevronRight, Home, 
  LayoutDashboard, FileText, Package, Users, MessageSquare, BarChart2, 
  LogOut, Settings, Bell, User, Sun, Moon
} from 'lucide-react';
import { isRTL } from '../../i18n';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isConfirmLogoutOpen, setIsConfirmLogoutOpen] = useState(false);

  // التبديل بين الوضع الداكن والوضع الفاتح
  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    document.documentElement.classList.toggle('dark', newDarkMode);
    localStorage.setItem('darkMode', String(newDarkMode));
  };

  const closeAllMenus = () => {
    setIsUserMenuOpen(false);
    setIsNotificationsOpen(false);
  };

  // إغلاق القوائم عند تغيير المسار
  useEffect(() => {
    closeAllMenus();
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      navigate('/admin/login');
    }
  };

  // عناصر القائمة الجانبية
  const sidebarItems = [
    {
      name: t('admin.dashboard.title'),
      path: '/admin',
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: t('admin.content.title'),
      path: '/admin/content',
      icon: <FileText size={20} />,
    },
    {
      name: t('admin.projects.title'),
      path: '/admin/projects',
      icon: <Package size={20} />,
    },
    {
      name: t('admin.services.title'),
      path: '/admin/services',
      icon: <Users size={20} />,
    },
    {
      name: t('admin.testimonials.title'),
      path: '/admin/testimonials',
      icon: <MessageSquare size={20} />,
    },
    {
      name: t('admin.messages.title'),
      path: '/admin/messages',
      icon: <MessageSquare size={20} />,
    },
    {
      name: t('admin.stats.title'),
      path: '/admin/stats',
      icon: <BarChart2 size={20} />,
    },
  ];

  // التحقق من المسار النشط
  const isActivePath = (path: string) => {
    if (path === '/admin' && location.pathname === '/admin') {
      return true;
    }
    return location.pathname.startsWith(path) && path !== '/admin';
  };

  // تأثيرات الحركة
  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { 
      x: isRTL() ? 300 : -300, 
      opacity: 0 
    },
  };

  const chevronDirection = isRTL() ? <ChevronLeft size={20} /> : <ChevronRight size={20} />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex" dir={isRTL() ? 'rtl' : 'ltr'}>
      {/* Sidebar - Desktop */}
      <motion.div
        className={`bg-white dark:bg-gray-800 shadow-lg fixed inset-y-0 ${
          isRTL() ? 'right-0' : 'left-0'
        } z-30 w-64 transition-all duration-300 ease-in-out hidden md:block`}
        initial={false}
        animate={isSidebarOpen ? 'open' : 'closed'}
        variants={sidebarVariants}
      >
        <div className="flex flex-col h-full">
          {/* Logo & App Name */}
          <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
            <Link to="/admin" className="flex items-center">
              <img src="/admin-logo.svg" alt="Admin" className="h-8 w-auto" />
              {isSidebarOpen && (
                <span className="ml-2 rtl:mr-2 rtl:ml-0 text-lg font-semibold text-gray-900 dark:text-white">
                  {t('site.name')} Admin
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1 rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none"
            >
              {chevronDirection}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-3">
              {sidebarItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActivePath(item.path)
                        ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                        : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/10'
                    }`}
                  >
                    <span className="mr-3 rtl:ml-3 rtl:mr-0">{item.icon}</span>
                    {isSidebarOpen && <span>{item.name}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t dark:border-gray-700">
            <Link
              to="/"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-colors duration-200"
            >
              <Home size={20} className="mr-3 rtl:ml-3 rtl:mr-0" />
              {isSidebarOpen && <span>{t('common.goHome')}</span>}
            </Link>
            <button
              onClick={() => setIsConfirmLogoutOpen(true)}
              className="w-full mt-2 flex items-center px-3 py-2 rounded-md text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors duration-200"
            >
              <LogOut size={20} className="mr-3 rtl:ml-3 rtl:mr-0" />
              {isSidebarOpen && <span>{t('admin.auth.logout.title')}</span>}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            className={`fixed inset-y-0 ${
              isRTL() ? 'right-0' : 'left-0'
            } z-50 w-64 bg-white dark:bg-gray-800 shadow-xl md:hidden`}
            initial={{ x: isRTL() ? 300 : -300 }}
            animate={{ x: 0 }}
            exit={{ x: isRTL() ? 300 : -300 }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                <Link to="/admin" className="flex items-center">
                  <img src="/admin-logo.svg" alt="Admin" className="h-8 w-auto" />
                  <span className="ml-2 rtl:mr-2 rtl:ml-0 text-lg font-semibold text-gray-900 dark:text-white">
                    {t('site.name')} Admin
                  </span>
                </Link>
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-1 rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1 px-3">
                  {sidebarItems.map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                          isActivePath(item.path)
                            ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                            : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/10'
                        }`}
                      >
                        <span className="mr-3 rtl:ml-3 rtl:mr-0">{item.icon}</span>
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Footer */}
              <div className="p-4 border-t dark:border-gray-700">
                <Link
                  to="/"
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-colors duration-200"
                >
                  <Home size={20} className="mr-3 rtl:ml-3 rtl:mr-0" />
                  <span>{t('common.goHome')}</span>
                </Link>
                <button
                  onClick={() => setIsConfirmLogoutOpen(true)}
                  className="w-full mt-2 flex items-center px-3 py-2 rounded-md text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors duration-200"
                >
                  <LogOut size={20} className="mr-3 rtl:ml-3 rtl:mr-0" />
                  <span>{t('admin.auth.logout.title')}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'md:ml-64 rtl:md:mr-64 rtl:md:ml-0' : ''}`}>
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-20">
          <div className="flex items-center justify-between px-4 py-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>

            {/* Desktop Toggle Button */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden md:block p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
              aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            >
              <Menu size={20} />
            </button>

            {/* Page Title */}
            <h1 className="text-lg font-medium text-gray-900 dark:text-white hidden sm:block">
              {sidebarItems.find((item) => isActivePath(item.path))?.name || t('admin.dashboard.title')}
            </h1>

            {/* Right Actions */}
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsNotificationsOpen(!isNotificationsOpen);
                    setIsUserMenuOpen(false);
                  }}
                  className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none relative"
                  aria-label="Notifications"
                >
                  <Bell size={20} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Notifications Dropdown */}
                <AnimatePresence>
                  {isNotificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className={`absolute ${
                        isRTL() ? 'right-0' : 'left-0'
                      } mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden z-10`}
                    >
                      <div className="p-3 border-b dark:border-gray-700">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          {t('admin.notifications')}
                        </h3>
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        <div className="p-4 text-gray-600 dark:text-gray-300 text-center">
                          {t('common.emptyState')}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsUserMenuOpen(!isUserMenuOpen);
                    setIsNotificationsOpen(false);
                  }}
                  className="flex items-center space-x-2 rtl:space-x-reverse p-1 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                  aria-label="User menu"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white">
                    <User size={16} />
                  </div>
                  <ChevronDown size={16} />
                </button>

                {/* User Dropdown */}
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className={`absolute ${
                        isRTL() ? 'right-0' : 'left-0'
                      } mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden z-10`}
                    >
                      <div className="py-1">
                        <Link
                          to="/admin/settings"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Settings size={16} className="mr-3 rtl:ml-3 rtl:mr-0" />
                          {t('admin.settings')}
                        </Link>
                        <button
                          onClick={() => setIsConfirmLogoutOpen(true)}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <LogOut size={16} className="mr-3 rtl:ml-3 rtl:mr-0" />
                          {t('admin.auth.logout.title')}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4 md:p-6 pb-16">
          {children}
        </main>
      </div>

      {/* Logout Confirmation Dialog */}
      <AnimatePresence>
        {isConfirmLogoutOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {t('admin.auth.logout.confirm')}
              </h3>
              <div className="flex justify-end space-x-3 rtl:space-x-reverse mt-6">
                <button
                  onClick={() => setIsConfirmLogoutOpen(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none"
                >
                  {t('admin.auth.logout.no')}
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-red-700 focus:outline-none"
                >
                  {t('admin.auth.logout.yes')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminLayout;