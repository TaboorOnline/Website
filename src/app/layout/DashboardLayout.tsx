// src/app/layout/DashboardLayout.tsx
import { ReactNode, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../shared/hooks/useTheme'; // Adjust path
import { signOut, getCurrentUser } from '../supabaseClient'; // Adjust path

// Import Icons (Consolidate if needed, or keep if specific icons are only here)
import {
  FiHome, FiUsers, FiSettings, FiBox, FiStar, FiFileText,
  FiMail, FiClipboard, FiBarChart2
} from 'react-icons/fi';

// Import Layout Components
import { Header } from './components/Header'; // Adjust path
import { Sidebar } from './components/Sidebar'; // Adjust path

// Define User type more specifically if possible
// interface User { id: string; email?: string; /* other fields */ }
type User = any; // Replace 'any' with a proper User interface/type if available

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme(); // Theme state from hook
  const location = useLocation();
  const navigate = useNavigate();

  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [user, setUser] = useState<User>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Define Navigation links (consider moving to a separate config file if large)
  const navLinks = [
    { path: '/dashboard', label: t('nav.dashboard'), icon: <FiHome /> },
    { path: '/dashboard/users', label: t('nav.users'), icon: <FiUsers /> },
    { path: '/dashboard/services', label: t('nav.services'), icon: <FiBox /> },
    { path: '/dashboard/team', label: t('nav.team'), icon: <FiUsers /> }, // Consider different icon if needed
    { path: '/dashboard/reviews', label: t('nav.reviews'), icon: <FiStar /> },
    { path: '/dashboard/blog', label: t('nav.blog'), icon: <FiFileText /> },
    { path: '/dashboard/inbox', label: t('nav.inbox'), icon: <FiMail /> },
    { path: '/dashboard/tasks', label: t('nav.tasks'), icon: <FiClipboard /> },
    { path: '/dashboard/stats', label: t('nav.stats'), icon: <FiBarChart2 /> },
    { path: '/dashboard/settings', label: t('nav.settings'), icon: <FiSettings /> },
  ];

  // --- Effects ---

  // Check user authentication status
  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        navigate('/login', { replace: true }); // Use replace to prevent going back to dashboard
      } else {
        setUser(currentUser);
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
        setIsDesktopSidebarOpen(false); // Collapse on small screens
      } else {
         // Optional: Restore default state on larger screens, or keep user preference
         // setIsDesktopSidebarOpen(true);
      }
    };

    handleResize(); // Check on initial load
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close dropdowns when one opens (optional UX enhancement)
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
      setUser(null); // Clear local user state
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      // Optionally: Show an error message to the user
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


  // --- Render ---

  // Optional: Show loading state while checking user
  // if (user === null) {
  //    return <div>Loading...</div>; // Or a spinner component
  // }

  return (
    // Apply theme class to the root element if useTheme manages it this way
    <div className={`flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 ${theme}`}>
      {/* Sidebar Component */}
      <Sidebar
        isDesktopOpen={isDesktopSidebarOpen}
        isMobileOpen={isMobileSidebarOpen}
        closeMobileSidebar={closeMobileSidebar}
        toggleDesktopSidebar={toggleDesktopSidebar}
        navLinks={navLinks}
        handleLogout={handleLogout}
        appName="Hilal Tech"
      />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header Component */}
        <Header
          userEmail={user?.email}
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
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4 md:p-6 lg:p-8">
          {/* Animate page transitions if desired */}
          {/* <AnimatePresence mode="wait"> */}
          {/* <motion.div key={location.pathname} ...> */}
                {children}
          {/* </motion.div> */}
          {/* </AnimatePresence> */}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;