//  src/app/layout/components/QuickActions.tsx
import { useState } from 'react';
import { FiPlus, FiUserPlus, FiFileText, FiSettings, FiBox, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export const QuickActions = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        aria-label="Quick Actions"
      >
        {isOpen ? <FiX size={20} /> : <FiPlus size={20} />}
      </button>
      
      {/* Quick Action Buttons */}
      <AnimatePresence>
        {isOpen && (
          <div className="absolute bottom-16 right-0 flex flex-col space-y-2">
            {[
              { icon: <FiUserPlus />, label: 'Add User', color: 'bg-blue-500 hover:bg-blue-600' },
              { icon: <FiFileText />, label: 'New Post', color: 'bg-green-500 hover:bg-green-600' },
              { icon: <FiBox />, label: 'Add Product', color: 'bg-purple-500 hover:bg-purple-600' },
              { icon: <FiSettings />, label: 'Settings', color: 'bg-gray-700 hover:bg-gray-800' },
            ].map((action, index) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-white shadow-md ${action.color} transition-all duration-200`}
              >
                <span>{action.icon}</span>
                <span className="text-sm font-medium">{action.label}</span>
              </motion.button>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
