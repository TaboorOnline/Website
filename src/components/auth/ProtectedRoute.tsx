// src/components/auth/ProtectedRoute.tsx
import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { checkAuth } from '../../lib/supabase';
import { useTranslation } from 'react-i18next';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = '/admin/login',
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const { t } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const session = await checkAuth();
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
      }
    };

    verifyAuth();
  }, []);

  // عرض حالة التحميل أثناء التحقق من المصادقة
  if (isAuthenticated === null) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-primary-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  // إذا لم يكن المستخدم مصادقًا، قم بإعادة توجيهه
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />;
  }

  // إذا كان المستخدم مصادقًا، اعرض المحتوى المحمي
  return <>{children}</>;
};

export default ProtectedRoute;