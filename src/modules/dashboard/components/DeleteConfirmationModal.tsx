
// src/modules/dashboard/components/DeleteConfirmationModal.tsx
import { useTranslation } from 'react-i18next';
import Modal from '../../../shared/components/Modal';
import Button from '../../../shared/components/Button';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDeleting?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmationModal = ({
  isOpen,
  title,
  message,
  confirmLabel,
  cancelLabel,
  isDeleting = false,
  onConfirm,
  onCancel,
}: DeleteConfirmationModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={title || t('deleteModal.title')}
    >
      <div className="mb-6">
        <p className="text-gray-600 dark:text-gray-300">
          {message || t('deleteModal.message')}
        </p>
      </div>

      <div className="flex justify-end space-x-3">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isDeleting}
        >
          {cancelLabel || t('deleteModal.cancel')}
        </Button>
        <Button
          variant="danger"
          onClick={onConfirm}
          isLoading={isDeleting}
        >
          {confirmLabel || t('deleteModal.confirm')}
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;