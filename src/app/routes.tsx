// src/app/routes.tsx
import { ReactNode, useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { getCurrentUser, getUserRole } from './supabaseClient';
import LandingLayout from './layout/LandingLayout';
import DashboardLayout from './layout/DashboardLayout';

// Landing pages
import Home from '../modules/landing/pages/Home';
import Services from '../modules/landing/pages/Services';
import About from '../modules/landing/pages/About';
import Blog from '../modules/landing/pages/Blog';
import Contact from '../modules/landing/pages/Contact';

// Auth pages
import Login from '../modules/auth/pages/Login';
import Register from '../modules/auth/pages/Register';
import ForgotPassword from '../modules/auth/pages/ForgotPassword';
import ResetPassword from '../modules/auth/pages/ResetPassword';

// Dashboard pages
import Dashboard from '../modules/dashboard/pages/Dashboard';
import DashboardUsers from '../modules/dashboard/pages/Users';
import DashboardServices from '../modules/dashboard/pages/Services';
import DashboardTeam from '../modules/dashboard/pages/Team';
import DashboardReviews from '../modules/dashboard/pages/Reviews';
import DashboardBlog from '../modules/dashboard/pages/Blog';
import DashboardInbox from '../modules/dashboard/pages/Inbox';
import DashboardTasks from '../modules/dashboard/pages/Tasks';
import DashboardStats from '../modules/dashboard/pages/Stats';
import Profile from '../modules/dashboard/pages/Profile';
import Settings from '../modules/dashboard/pages/Settings';

// 404 page
import NotFound from '../shared/components/NotFound';

// Auth guard
interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'editor' | 'viewer';
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        setIsAuthenticated(!!user);
        
        if (user && requiredRole) {
          const userRole = await getUserRole();
          
          if (requiredRole === 'admin') {
            setHasAccess(userRole === 'admin');
          } else if (requiredRole === 'editor') {
            setHasAccess(userRole === 'admin' || userRole === 'editor');
          } else {
            setHasAccess(true); // 'viewer' role or no specific role required
          }
        } else {
          setHasAccess(!!user);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
        setHasAccess(false);
      }
    };
    
    checkAuth();
  }, [requiredRole]);
  
  if (isAuthenticated === null || hasAccess === null) {
    // Loading state
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!hasAccess) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

// Page transitions
const PageTransition = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Landing pages */}
      <Route
        path="/"
        element={
          <LandingLayout>
            <PageTransition>
              <Home />
            </PageTransition>
          </LandingLayout>
        }
      />
      <Route
        path="/services"
        element={
          <LandingLayout>
            <PageTransition>
              <Services />
            </PageTransition>
          </LandingLayout>
        }
      />
      <Route
        path="/about"
        element={
          <LandingLayout>
            <PageTransition>
              <About />
            </PageTransition>
          </LandingLayout>
        }
      />
      <Route
        path="/blog"
        element={
          <LandingLayout>
            <PageTransition>
              <Blog />
            </PageTransition>
          </LandingLayout>
        }
      />
      <Route
        path="/contact"
        element={
          <LandingLayout>
            <PageTransition>
              <Contact />
            </PageTransition>
          </LandingLayout>
        }
      />
      
      {/* Auth pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      {/* Dashboard pages */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <PageTransition>
                <Dashboard />
              </PageTransition>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/users"
        element={
          <ProtectedRoute requiredRole="admin">
            <DashboardLayout>
              <PageTransition>
                <DashboardUsers />
              </PageTransition>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/services"
        element={
          <ProtectedRoute requiredRole="editor">
            <DashboardLayout>
              <PageTransition>
                <DashboardServices />
              </PageTransition>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/team"
        element={
          <ProtectedRoute requiredRole="editor">
            <DashboardLayout>
              <PageTransition>
                <DashboardTeam />
              </PageTransition>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/reviews"
        element={
          <ProtectedRoute requiredRole="editor">
            <DashboardLayout>
              <PageTransition>
                <DashboardReviews />
              </PageTransition>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/blog"
        element={
          <ProtectedRoute requiredRole="editor">
            <DashboardLayout>
              <PageTransition>
                <DashboardBlog />
              </PageTransition>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/inbox"
        element={
          <ProtectedRoute requiredRole="viewer">
            <DashboardLayout>
              <PageTransition>
                <DashboardInbox />
              </PageTransition>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/tasks"
        element={
          <ProtectedRoute requiredRole="viewer">
            <DashboardLayout>
              <PageTransition>
                <DashboardTasks />
              </PageTransition>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/stats"
        element={
          <ProtectedRoute requiredRole="viewer">
            <DashboardLayout>
              <PageTransition>
                <DashboardStats />
              </PageTransition>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/profile"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <PageTransition>
                <Profile />
              </PageTransition>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/settings"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <PageTransition>
                <Settings />
              </PageTransition>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      
      {/* 404 page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;