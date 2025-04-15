// src/modules/dashboard/components/DeleteConfirmationModal.tsx
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiAlertTriangle, FiXCircle, FiCheck } from 'react-icons/fi';
import Modal from '../../../shared/components/Modal';
import Button from '../../../shared/components/Button';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  title: string;
  message: string;
}

const DeleteConfirmationModal = ({
  isOpen,
  onCancel,
  onConfirm,
  isDeleting,
  title,
  message,
}: DeleteConfirmationModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={onCancel} size="md">
      <div className="text-center">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, type: "spring" }}
          className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-6"
        >
          <motion.div
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <FiAlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </motion.div>
        </motion.div>
        
        <motion.h3 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="text-xl font-medium text-gray-900 dark:text-white mb-2"
        >
          {title}
        </motion.h3>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mb-6"
        >
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {message}
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="mt-8 flex justify-center space-x-3"
        >
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isDeleting}
            icon={<FiXCircle className="mr-2" />}
          >
            {t('common.cancel')}
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={onConfirm}
            isLoading={isDeleting}
            icon={<FiCheck className="mr-2" />}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
          >
            {t('common.delete')}
          </Button>
        </motion.div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;