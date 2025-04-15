// src/app/layout/components/PageLoader.tsx
import { FiLoader } from 'react-icons/fi';

export const PageLoader = () => {
  return (
    <div className="flex items-center justify-center h-screen w-full bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <FiLoader className="mx-auto h-10 w-10 text-primary-600 dark:text-primary-400 animate-spin" />
        <h2 className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">Loading...</h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Please wait while we prepare your dashboard</p>
      </div>
    </div>
  );
};
