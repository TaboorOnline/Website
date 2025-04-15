// src/app/layout/DashboardLayout.tsx
import { ReactNode, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../shared/hooks/useTheme'; 
import { signOut, getCurrentUser } from '../supabaseClient';
import "./dashboard.css";

// Import Icons
import {
  FiHome, FiUsers, FiSettings, FiBox, FiStar, FiFileText,
  FiMail, FiClipboard, FiBarChart2, FiCalendar, FiPieChart
} from 'react-icons/fi';

// Import Layout Components
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { PageLoader } from './components/PageLoader'; // New component for loading state
import { Breadcrumbs } from './components/Breadcrumbs'; // New breadcrumbs component

// Define User type more specifically if possible
type User = any; // Replace 'any' with a proper User interface/type if available

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [user, setUser] = useState<User>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // New state for loading

  // Refined navigation links with categories for better organization
  const navLinks = [
    { 
      category: t('nav.categories.main'),
      items: [
        { path: '/dashboard', label: t('nav.dashboard'), icon: <FiHome /> },
        { path: '/dashboard/stats', label: t('nav.stats'), icon: <FiBarChart2 /> },
        { path: '/dashboard/analytics', label: t('nav.analytics'), icon: <FiPieChart /> },
        { path: '/dashboard/calendar', label: t('nav.calendar'), icon: <FiCalendar /> },
      ]
    },
    {
      category: t('nav.categories.content'),
      items: [
        { path: '/dashboard/services', label: t('nav.services'), icon: <FiBox /> },
        { path: '/dashboard/blog', label: t('nav.blog'), icon: <FiFileText /> },
        { path: '/dashboard/reviews', label: t('nav.reviews'), icon: <FiStar /> },
      ]
    },
    {
      category: t('nav.categories.management'),
      items: [
        { path: '/dashboard/users', label: t('nav.users'), icon: <FiUsers /> },
        { path: '/dashboard/team', label: t('nav.team'), icon: <FiUsers className="text-indigo-500" /> },
        { path: '/dashboard/inbox', label: t('nav.inbox'), icon: <FiMail /> },
        { path: '/dashboard/tasks', label: t('nav.tasks'), icon: <FiClipboard /> },
      ]
    },
    {
      category: t('nav.categories.preferences'),
      items: [
        { path: '/dashboard/settings', label: t('nav.settings'), icon: <FiSettings /> },
      ]
    }
  ];

  // --- Effects ---

  // Check user authentication status
  useEffect(() => {
    const checkUser = async () => {
      setIsLoading(true);
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          navigate('/login', { replace: true });
        } else {
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Authentication error:', error);
        navigate('/login', { replace: true });
      } finally {
        setIsLoading(false);
      }
    };
    checkUser();
  }, [navigate]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  // Handle initial desktop sidebar state and resize events
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsDesktopSidebarOpen(false);
      } else if (window.innerWidth >= 1536) {
        // Always show sidebar on extra large screens
        setIsDesktopSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close dropdowns when one opens
  useEffect(() => {
    if (isUserMenuOpen) setIsNotificationsOpen(false);
  }, [isUserMenuOpen]);

  useEffect(() => {
    if (isNotificationsOpen) setIsUserMenuOpen(false);
  }, [isNotificationsOpen]);

  // --- Callbacks ---

  const handleLogout = useCallback(async () => {
    try {
      await signOut();
      setUser(null);
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [navigate]);

  const toggleMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(prev => !prev);
  }, []);

  const closeMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(false);
  }, []);

  const toggleDesktopSidebar = useCallback(() => {
    setIsDesktopSidebarOpen(prev => !prev);
  }, []);

  // Show loading state while checking user
  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className={`flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 ${theme}`}>
      {/* Sidebar Component */}
      <Sidebar
        isDesktopOpen={isDesktopSidebarOpen}
        isMobileOpen={isMobileSidebarOpen}
        closeMobileSidebar={closeMobileSidebar}
        toggleDesktopSidebar={toggleDesktopSidebar}
        navLinks={navLinks}
        handleLogout={handleLogout}
        appName="Hilal Tech"
        user={user}
      />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header Component */}
        <Header
          user={user}
          handleLogout={handleLogout}
          toggleMobileSidebar={toggleMobileSidebar}
          isMobileSidebarOpen={isMobileSidebarOpen}
          isUserMenuOpen={isUserMenuOpen}
          setIsUserMenuOpen={setIsUserMenuOpen}
          isNotificationsOpen={isNotificationsOpen}
          setIsNotificationsOpen={setIsNotificationsOpen}
          appName="Hilal Tech"
        />

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-800 p-4 md:p-6 lg:p-8">
          {/* Breadcrumbs navigation */}
          <Breadcrumbs currentPath={location.pathname} />
          
          {/* Page content container with subtle animation */}
          <div className="mt-4 transition-all duration-300 animate-fadeIn">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;