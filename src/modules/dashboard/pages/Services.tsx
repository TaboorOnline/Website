// src/modules/dashboard/pages/Services.tsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiStar, 
  FiSearch, 
  FiRefreshCw, 
  FiAlertTriangle,
  FiChevronUp,
  FiChevronDown,
  FiFilter,
  FiSliders,
  FiX
} from 'react-icons/fi';
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
  
  const { data: services, isLoading, error, refetch } = useServices();
  const deleteServiceMutation = useDeleteService();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [sortField, setSortField] = useState<string>('order');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterFeatured, setFilterFeatured] = useState<boolean | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return <FiChevronUp className="opacity-30 w-4 h-4" />;
    return sortDirection === 'asc' ? 
      <FiChevronUp className="text-indigo-500 w-4 h-4" /> : 
      <FiChevronDown className="text-indigo-500 w-4 h-4" />;
  };

  const columns = [
    {
      header: (
        <div className="flex items-center cursor-pointer" onClick={() => handleSort('title')}>
          <span className="mr-1">{t('services.title')}</span>
          {getSortIcon('title')}
        </div>
      ),
      accessor: (service: Service) => {
        const translations = ((service.translations as { [key in 'en' | 'ar']?: { title: string } })?.[currentLanguage]) || {} as { title?: string };
        return translations.title || service.title;
      },
      cell: (service: Service) => {
        const translations = ((service.translations as { [key in 'en' | 'ar']?: { title: string } })?.[currentLanguage]) || {} as { title?: string };
        const title = translations.title || service.title;
        
        return (
          <div className="flex items-center">
            <div className="flex-shrink-0 w-10 h-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm">
              <span className="text-xl">{service.icon}</span>
            </div>
            <div className="ml-3">
              <p className="font-medium text-gray-900 dark:text-white">{title}</p>
              {service.featured && (
                <span className="inline-flex items-center text-xs font-medium text-amber-600 dark:text-amber-400">
                  <FiStar className="mr-1" size={12} />
                  {t('services.featured')}
                </span>
              )}
            </div>
          </div>
        );
      },
      sortable: true,
    },
    {
      header: (
        <div className="flex items-center cursor-pointer" onClick={() => handleSort('order')}>
          <span className="mr-1">{t('services.order')}</span>
          {getSortIcon('order')}
        </div>
      ),
      accessor: 'order' as const,
      cell: (service: Service) => (
        <div className="text-center">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium border border-gray-200 dark:border-gray-700">
            {service.order}
          </span>
        </div>
      ),
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
            className="border border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            <FiEdit2 className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(service);
            }}
            aria-label={t('common.delete')}
            className="border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
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

  const handleRefresh = () => {
    refetch();
  };

  const toggleFeaturedFilter = () => {
    if (filterFeatured === null) {
      setFilterFeatured(true);
    } else if (filterFeatured === true) {
      setFilterFeatured(false);
    } else {
      setFilterFeatured(null);
    }
  };

  // Filter services by search query
  const searchedServices = searchQuery
    ? (services || []).filter(service => {
        const title = ((service.translations as any)?.[currentLanguage]?.title || service.title).toLowerCase();
        const description = ((service.translations as any)?.[currentLanguage]?.description || service.description).toLowerCase();
        return title.includes(searchQuery.toLowerCase()) || description.includes(searchQuery.toLowerCase());
      })
    : services || [];

  // Filter services based on featured status
  const filteredServices = filterFeatured !== null
    ? searchedServices.filter(service => service.featured === filterFeatured)
    : searchedServices;

  // Sort services based on current sort field and direction
  const sortedServices = [...filteredServices].sort((a, b) => {
    let aValue = sortField === 'title' 
      ? ((a.translations as any)?.[currentLanguage]?.title || a.title).toLowerCase()
      : a[sortField as keyof Service];
    
    let bValue = sortField === 'title'
      ? ((b.translations as any)?.[currentLanguage]?.title || b.title).toLowerCase()
      : b[sortField as keyof Service];
    
    if (typeof aValue === 'string') aValue = aValue.toLowerCase();
    if (typeof bValue === 'string') bValue = bValue.toLowerCase();
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  if (error) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-300 dark:border-gray-600 max-w-lg"
        >
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-200 dark:border-red-800">
            <FiAlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t('errors.failedToLoadServices')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {t('errors.tryAgainLater')}
          </p>
          <Button 
            onClick={() => window.location.reload()} 
            icon={<FiRefreshCw className="mr-2" />}
            className="border border-gray-300 dark:border-gray-600 shadow-sm"
          >
            {t('common.refresh')}
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHeader
        title={t('services.manageServices')}
        subtitle={t('services.manageServicesDescription')}
        actions={
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              icon={<FiRefreshCw />}
              aria-label={t('common.refresh')}
              isLoading={isLoading}
              className="border border-gray-300 dark:border-gray-600 shadow-sm"
            >
              {t("common.refresh")}
            </Button>
            <Button
              variant="outline"
              onClick={toggleFeaturedFilter}
              className={`border shadow-sm ${
                filterFeatured !== null 
                  ? filterFeatured 
                    ? "border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300" 
                    : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800" 
                  : "border-gray-300 dark:border-gray-600"
              }`}
            >
              <div className="flex items-center">
                <FiFilter className="mr-2" />
                {filterFeatured === null 
                  ? t('services.filterAll')
                  : filterFeatured 
                    ? t('services.filterFeatured')
                    : t('services.filterNonFeatured')
                }
              </div>
            </Button>
            <Button
              onClick={handleCreateService}
              icon={<FiPlus className="mr-2" />}
              className="border border-gray-300 dark:border-gray-600 shadow-sm"
            >
              {t('services.addService')}
            </Button>
          </div>
        }
      />

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-300 dark:border-gray-600 overflow-hidden">
        {/* Search and Filter Bar */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-300 dark:border-gray-600 flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder={t('services.searchServices')}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <FiX className="h-5 w-5" />
              </button>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {t('common.showing')} <span className="font-medium text-gray-900 dark:text-white">{sortedServices.length}</span> {sortedServices.length === 1 ? t('common.item') : t('common.items')}
            </div>
            
            <div className="border-l border-gray-300 dark:border-gray-600 h-6 mx-1"></div>
            
            <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600 flex items-center focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <FiSliders size={16} className="mr-1" />
              <span className="text-sm font-medium">{t('common.options')}</span>
            </button>
          </div>
        </div>
        
        {/* Service List */}
        {!isLoading && sortedServices.length === 0 ? (
          <EmptyState
            title={searchQuery ? t('services.noSearchResults') : t('services.noServices')}
            message={searchQuery ? t('services.tryAnotherSearch') : t('services.noServicesDescription')}
            icon={<FiStar className="w-12 h-12 text-indigo-400 dark:text-indigo-600" />}
            actionLabel={searchQuery ? t('services.clearSearch') : t('services.addService')}
            onAction={searchQuery ? () => setSearchQuery('') : handleCreateService}
          />
        ) : (
          <div className="overflow-hidden">
            <div className="relative">
              <DataTable
                columns={columns}
                data={sortedServices}
                isLoading={isLoading}
                noDataMessage={t('services.noServicesFound')}
                onRowClick={(service) => handleEditService(service)}
                className="bg-transparent"
              />
              
              {/* Loading overlay */}
              <AnimatePresence>
                {isLoading && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm flex items-center justify-center"
                  >
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-300 dark:border-gray-600 flex items-center">
                      <svg className="animate-spin h-5 w-5 text-indigo-600 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300">{t('common.loading')}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

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