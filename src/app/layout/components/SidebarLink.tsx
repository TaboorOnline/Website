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
  const isActive = location.pathname === path || (path !== '/dashboard' && location.pathname.startsWith(path)); // Basic active check

  return (
    <Link
      to={path}
      onClick={onClick}
      className={`flex items-center py-3 text-sm rounded-md transition-colors duration-150 ease-in-out group ${
        isSidebarOpen ? 'justify-start px-4' : 'justify-center px-0'
      } ${
        isActive
          ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-600 dark:text-primary-300 font-medium'
          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
      }`}
      title={!isSidebarOpen ? label : undefined} // Tooltip when collapsed
    >
      <span className={`text-lg ${isSidebarOpen ? 'mr-3' : ''}`}>{icon}</span>
      {isSidebarOpen && <span className="whitespace-nowrap">{label}</span>}
      {/* Optional: Add an active indicator */}
      {isActive && !isSidebarOpen && (
         <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-primary-500 rounded-r-full"></span>
      )}
    </Link>
  );
};