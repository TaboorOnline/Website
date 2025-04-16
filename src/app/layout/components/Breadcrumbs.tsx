
// src/app/layout/components/Breadcrumbs.tsx
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiChevronRight, FiHome } from 'react-icons/fi';

interface BreadcrumbsProps {
  currentPath: string;
}

export const Breadcrumbs = ({ currentPath }: BreadcrumbsProps) => {
  const { t } = useTranslation();
  
  // Skip rendering breadcrumbs on main dashboard
  if (currentPath === '/dashboard') {
    return null;
  }

  // Parse path segments and create breadcrumb items
  const pathSegments = currentPath.split('/').filter((segment) => segment !== '');
  const breadcrumbs = pathSegments.map((segment, index) => {
    const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
    // Convert segment to readable title (e.g., 'user-management' -> 'User Management')
    const title = segment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    return { path, title, isLast: index === pathSegments.length - 1 };
  });

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        <li className="inline-flex items-center">
          <Link 
            to="/dashboard" 
            className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            <FiHome className="mr-1" size={16} />
            {t('nav.dashboard')}
          </Link>
        </li>
        
        {breadcrumbs.map((breadcrumb) => (
          <li key={breadcrumb.path} className="flex items-center">
            <FiChevronRight className="text-gray-400 mx-1" size={14} />
            {breadcrumb.isLast ? (
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t(`nav.${breadcrumb.title.toLowerCase()}`)}
              </span>
            ) : (
              <Link
                to={breadcrumb.path}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                {t(`nav.${breadcrumb.title.toLowerCase()}`)}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};