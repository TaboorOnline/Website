// src/modules/dashboard/pages/Services.tsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiPlus, FiEdit2, FiTrash2, FiStar } from 'react-icons/fi';
import DashboardHeader from '../components/DashboardHeader';
import Button from '../../../shared/components/Button';
import DataTable from '../components/DataTable';
import EmptyState from '../components/EmptyState';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { useServices, useDeleteService } from '../services/serviceService';
import ServiceFormModal from '../components/ServiceFormModal';
import { Service } from '../../../shared/types/types';

const Services = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language as 'en' | 'ar';
  
  const { data: services, isLoading, error } = useServices();
  const deleteServiceMutation = useDeleteService();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const columns = [
    {
      header: t('services.title'),
      accessor: (service: Service) => {
        const translations = ((service.translations as { [key in 'en' | 'ar']?: { title: string } })?.[currentLanguage]) || {} as { title?: string };
        return translations.title || service.title;
      },
      sortable: true,
    },
    {
      header: t('services.icon'),
      accessor: 'icon' as const,
      cell: (service: Service) => (
        <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center text-primary-600 dark:text-primary-400">
          <span className="text-xl">{service.icon}</span>
        </div>
      ),
    },
    {
      header: t('services.featured'),
      accessor: 'featured' as const,
      cell: (service: Service) => (
        <div className="flex justify-center">
          {service.featured ? (
            <FiStar className="text-yellow-500" />
          ) : (
            <FiStar className="text-gray-300 dark:text-gray-600" />
          )}
        </div>
      ),
    },
    {
      header: t('services.order'),
      accessor: 'order' as const,
      sortable: true,
    },
    {
      header: t('common.actions'),
      accessor: (service: Service) => (
        <div className="flex justify-end items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEditService(service);
            }}
            aria-label={t('common.edit')}
          >
            <FiEdit2 className="w-4 h-4" />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(service);
            }}
            aria-label={t('common.delete')}
          >
            <FiTrash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const handleCreateService = () => {
    setSelectedService(null);
    setIsCreateModalOpen(true);
  };

  const handleEditService = (service: Service) => {
    setSelectedService(service);
    setIsUpdateModalOpen(true);
  };

  const handleDeleteClick = (service: Service) => {
    setSelectedService(service);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedService) return;
    
    try {
      await deleteServiceMutation.mutateAsync(selectedService.id);
      setIsDeleteModalOpen(false);
      setSelectedService(null);
    } catch (error) {
      console.error('Failed to delete service:', error);
    }
  };

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t('errors.failedToLoadServices')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {t('errors.tryAgainLater')}
          </p>
          <Button onClick={() => window.location.reload()}>
            {t('common.refresh')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <DashboardHeader
        title={t('services.manageServices')}
        subtitle={t('services.manageServicesDescription')}
        actions={
          <Button
            onClick={handleCreateService}
            icon={<FiPlus className="mr-2" />}
          >
            {t('services.addService')}
          </Button>
        }
      />

      {!isLoading && services && services.length === 0 ? (
        <EmptyState
          title={t('services.noServices')}
          message={t('services.noServicesDescription')}
          icon={<FiStar className="w-12 h-12 text-gray-400" />}
          actionLabel={t('services.addService')}
          onAction={handleCreateService}
        />
      ) : (
        <DataTable
          columns={columns}
          data={services || []}
          isLoading={isLoading}
          searchable
          searchPlaceholder={t('services.searchServices')}
          searchKey="title"
          noDataMessage={t('services.noServicesFound')}
          onRowClick={(service) => handleEditService(service)}
        />
      )}

      {/* Create/Edit Service Modal */}
      <ServiceFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        service={null}
      />

      <ServiceFormModal
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setSelectedService(null);
        }}
        service={selectedService}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setSelectedService(null);
        }}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteServiceMutation.status === 'pending'}
        title={t('services.deleteService')}
        message={t('services.deleteServiceConfirmation', { title: selectedService?.title })}
      />
    </div>
  );
};

export default Services;