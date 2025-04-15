// src/app/layout/components/SidebarLink.tsx
import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarLinkProps {
  path: string;
  label: string;
  icon: ReactNode;
  isSidebarOpen: boolean; // Controls text visibility in desktop collapsed mode
  onClick?: () => void; // For closing mobile sidebar on click
}

export const SidebarLink = ({ path, label, icon, isSidebarOpen, onClick }: SidebarLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === path || (path !== '/dashboard' && location.pathname.startsWith(path));

  return (
    <Link
      to={path}
      onClick={onClick}
      className={`flex items-center py-2.5 text-sm rounded-md transition-all duration-200 group relative ${
        isSidebarOpen ? 'justify-start px-3' : 'justify-center px-0'
      } ${
        isActive
          ? 'bg-primary-50 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 font-medium'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/70 hover:text-primary-600 dark:hover:text-primary-400'
      }`}
      title={!isSidebarOpen ? label : undefined} // Tooltip when collapsed
    >
      {/* Active indicator bar */}
      {isActive && (
        <span className={`absolute ${isSidebarOpen ? 'left-0 top-0 bottom-0 w-1 my-1' : 'left-0 top-1/2 -translate-y-1/2 h-6 w-1'} bg-primary-500 dark:bg-primary-400 rounded-r-full transition-all duration-200`}></span>
      )}
      
      {/* Icon with animation on hover */}
      <span className={`flex-shrink-0 text-lg transition-transform duration-200 ${isSidebarOpen ? 'ml-2 mr-3' : 'mx-auto'} ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400'} group-hover:scale-110`}>
        {icon}
      </span>
      
      {/* Label with smooth transition */}
      {isSidebarOpen && (
        <span className="whitespace-nowrap transition-all duration-200 truncate">
          {label}
        </span>
      )}
      
      {/* Optional: Badge count (example for inbox/notifications) */}
      {isSidebarOpen && path === '/dashboard/inbox' && (
        <span className="ml-auto bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-medium rounded-full px-2 py-0.5">
          2
        </span>
      )}
    </Link>
  );
};