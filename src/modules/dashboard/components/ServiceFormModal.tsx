// src/modules/dashboard/components/ServiceFormModal.tsx
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { 
  FiCheck, 
  FiX, 
  FiAlertCircle, 
  FiGlobe, 
  FiStar, 
  FiHash, 
  FiType,
  FiSave
} from 'react-icons/fi';
import Modal from '../../../shared/components/Modal';
import Button from '../../../shared/components/Button';
import Input from '../../../shared/components/Input';
import { Service } from '../../../shared/types/types';
import { useCreateService, useUpdateService } from '../services/serviceService';

interface ServiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
}

// Define form schema type
interface ServiceFormValues {
  title: string;
  description: string;
  icon: string;
  featured: boolean;
  order: number;
  translations: {
    en: {
      title: string;
      description: string;
    };
    ar: {
      title: string;
      description: string;
    };
  };
}

const ServiceFormModal = ({ isOpen, onClose, service }: ServiceFormModalProps) => {
  const { t, i18n } = useTranslation();
  const createServiceMutation = useCreateService();
  const updateServiceMutation = useUpdateService();
  
  const isUpdating = !!service;
  const currentLanguage = i18n.language as 'en' | 'ar';

  // Form validation schema
  const serviceSchema = yup.object({
    title: yup.string().required(t('validation.required')),
    description: yup.string().required(t('validation.required')),
    icon: yup.string().required(t('validation.required')),
    featured: yup.boolean().default(false),
    order: yup.number().required(t('validation.required')).min(0, t('validation.minNumber', { min: 0 })),
    translations: yup.object({
      en: yup.object({
        title: yup.string().required(t('validation.required')),
        description: yup.string().required(t('validation.required')),
      }),
      ar: yup.object({
        title: yup.string().required(t('validation.required')),
        description: yup.string().required(t('validation.required')),
      }),
    }),
  });

  // Initialize form
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ServiceFormValues>({
    resolver: yupResolver(serviceSchema),
    defaultValues: {
      title: '',
      description: '',
      icon: '',
      featured: false,
      order: 0,
      translations: {
        en: {
          title: '',
          description: '',
        },
        ar: {
          title: '',
          description: '',
        },
      },
    },
  });

  // Watch values for preview
  const watchedIcon = watch('icon');
  const watchedFeatured = watch('featured');

  // Populate form when editing
  useEffect(() => {
    if (service) {
      const translations: ServiceFormValues['translations'] = (service.translations as ServiceFormValues['translations']) || {
        en: { title: service.title, description: service.description },
        ar: { title: '', description: '' },
      };
      
      reset({
        title: service.title,
        description: service.description,
        icon: service.icon,
        featured: service.featured,
        order: service.order,
        translations: {
          en: {
            title: translations.en?.title || service.title,
            description: translations.en?.description || service.description,
          },
          ar: {
            title: translations.ar?.title || '',
            description: translations.ar?.description || '',
          },
        },
      });
    } else {
      reset({
        title: '',
        description: '',
        icon: '',
        featured: false,
        order: 0,
        translations: {
          en: {
            title: '',
            description: '',
          },
          ar: {
            title: '',
            description: '',
          },
        },
      });
    }
  }, [service, reset]);

  // Handle form submission
  const onSubmit = async (data: ServiceFormValues) => {
    try {
      if (isUpdating && service) {
        await updateServiceMutation.mutateAsync({
          id: service.id,
          ...data,
        });
      } else {
        await createServiceMutation.mutateAsync(data);
      }
      onClose();
    } catch (error) {
      console.error('Failed to save service:', error);
    }
  };

  // When the language changes, update the indigo title/description fields
  useEffect(() => {
    const updateindigoFields = () => {
      if (currentLanguage === 'en' || currentLanguage === 'ar') {
        const title = (service?.translations as ServiceFormValues['translations'])?.[currentLanguage]?.title || '';
        const description = (service?.translations as ServiceFormValues['translations'])?.[currentLanguage]?.description || '';
        
        if (title) setValue('title', title);
        if (description) setValue('description', description);
      }
    };
    
    if (isUpdating) {
      updateindigoFields();
    }
  }, [currentLanguage, service, setValue, isUpdating]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isUpdating ? t('services.editService') : t('services.addService')}
      size="xl"
      noPadding
    >
      <div className="flex flex-col h-full max-h-[80vh]">
        {/* Icon Preview */}
        <div className="px-6 pt-4 pb-2 border-b border-gray-200 dark:border-gray-700">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center"
          >
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/30 dark:to-indigo-800/30 rounded-xl flex items-center justify-center text-4xl text-indigo-600 dark:text-indigo-400 shadow-md border border-indigo-200 dark:border-indigo-700">
                {watchedIcon || '🔍'}
              </div>
              {watchedFeatured && (
                <div className="absolute -top-2 -right-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full p-1 border border-amber-200 dark:border-amber-800">
                  <FiStar size={16} />
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form id="service-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-6">
              {/* indigo Language Fields */}
              <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-300 dark:border-gray-600 shadow-sm space-y-4">
                <div className="flex items-center mb-4">
                  <div className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mr-3 border border-indigo-200 dark:border-indigo-700">
                    <FiGlobe size={18} />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {t('common.indigoInfo')}
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="mb-4">
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        <div className="flex items-center">
                          <FiType className="mr-2 text-indigo-500" size={16} />
                          {t('services.title')}
                        </div>
                      </label>
                      <div className="relative">
                        <input
                          id="title"
                          type="text"
                          className={`block w-full px-4 py-2.5 bg-white dark:bg-gray-800 border ${
                            errors.title
                              ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500'
                              : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'
                          } rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-colors`}
                          placeholder={t('services.titlePlaceholder')}
                          {...register('title')}
                        />
                        {errors.title && (
                          <div className="absolute top-1/2 right-3 transform -translate-y-1/2">
                            <FiAlertCircle className="text-red-500" size={16} />
                          </div>
                        )}
                      </div>
                      {errors.title && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {errors.title.message}
                        </p>
                      )}
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="icon" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        <div className="flex items-center">
                          <span className="mr-2 text-indigo-500">🔍</span>
                          {t('services.icon')}
                        </div>
                      </label>
                      <div className="relative">
                        <input
                          id="icon"
                          type="text"
                          className={`block w-full px-4 py-2.5 bg-white dark:bg-gray-800 border ${
                            errors.icon
                              ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500'
                              : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'
                          } rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-colors`}
                          placeholder="🚀"
                          {...register('icon')}
                        />
                        {errors.icon && (
                          <div className="absolute top-1/2 right-3 transform -translate-y-1/2">
                            <FiAlertCircle className="text-red-500" size={16} />
                          </div>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {t('services.iconHelp')}
                      </p>
                      {errors.icon && (
                        <p className="text-sm text-red-600 dark:text-red-400">
                          {errors.icon.message}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="flex-1">
                        <label htmlFor="order" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          <div className="flex items-center">
                            <FiHash className="mr-2 text-indigo-500" size={16} />
                            {t('services.order')}
                          </div>
                        </label>
                        <div className="relative">
                          <input
                            id="order"
                            type="number"
                            className={`block w-full px-4 py-2.5 bg-white dark:bg-gray-800 border ${
                              errors.order
                                ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500'
                                : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'
                            } rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-colors`}
                            placeholder="0"
                            {...register('order', { valueAsNumber: true })}
                          />
                          {errors.order && (
                            <div className="absolute top-1/2 right-3 transform -translate-y-1/2">
                              <FiAlertCircle className="text-red-500" size={16} />
                            </div>
                          )}
                        </div>
                        {errors.order && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {errors.order.message}
                          </p>
                        )}
                      </div>
                      
                      <div className="pt-7">
                        <Controller
                          name="featured"
                          control={control}
                          render={({ field }) => (
                            <div className="flex items-center space-x-2">
                              <div className="relative inline-block w-12 h-6 cursor-pointer">
                                <input
                                  type="checkbox"
                                  id="featured"
                                  className="sr-only"
                                  checked={field.value}
                                  onChange={(e) => field.onChange(e.target.checked)}
                                />
                                <div
                                  className={`block w-12 h-6 rounded-full ${
                                    field.value 
                                      ? 'bg-amber-500 border-amber-600' 
                                      : 'bg-gray-300 dark:bg-gray-600 border-gray-400 dark:border-gray-500'
                                  } border transition-colors duration-200`}
                                ></div>
                                <div
                                  className={`absolute left-0.5 top-0.5 bg-white border border-gray-300 w-5 h-5 rounded-full transition-transform duration-200 flex items-center justify-center ${
                                    field.value ? 'transform translate-x-6 border-amber-500' : ''
                                  }`}
                                >
                                  {field.value && <FiStar className="text-amber-500" size={10} />}
                                </div>
                              </div>
                              <label htmlFor="featured" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                                {t('services.featured')}
                              </label>
                            </div>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('services.description')}
                    </label>
                    <div className="relative">
                      <textarea
                        id="description"
                        rows={7}
                        className={`block w-full px-4 py-2.5 bg-white dark:bg-gray-800 border ${
                          errors.description
                            ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'
                        } rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-colors`}
                        {...register('description')}
                        placeholder={t('services.descriptionPlaceholder')}
                      ></textarea>
                    </div>
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.description.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* English Translation */}
              <div className={`bg-white dark:bg-gray-800 p-5 rounded-xl border ${
                currentLanguage === 'en' 
                  ? 'border-blue-300 dark:border-blue-700' 
                  : 'border-gray-300 dark:border-gray-600'
              } shadow-sm space-y-4`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
                      EN
                    </span>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                      {t('languages.english')}
                    </h3>
                  </div>
                  
                  {currentLanguage === 'en' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800">
                      {t('common.current')}
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="translations.en.title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('services.title')}
                    </label>
                    <div className="relative">
                      <input
                        id="translations.en.title"
                        type="text"
                        className={`block w-full px-4 py-2.5 bg-white dark:bg-gray-800 border ${
                          errors.translations?.en?.title
                            ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'
                        } rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-colors`}
                        placeholder={t('services.titlePlaceholder')}
                        {...register('translations.en.title')}
                      />
                      {errors.translations?.en?.title && (
                        <div className="absolute top-1/2 right-3 transform -translate-y-1/2">
                          <FiAlertCircle className="text-red-500" size={16} />
                        </div>
                      )}
                    </div>
                    {errors.translations?.en?.title && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.translations.en.title.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="translations.en.description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('services.description')}
                    </label>
                    <div className="relative">
                      <textarea
                        id="translations.en.description"
                        rows={4}
                        className={`block w-full px-4 py-2.5 bg-white dark:bg-gray-800 border ${
                          errors.translations?.en?.description
                            ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'
                        } rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-colors`}
                        placeholder={t('services.descriptionPlaceholder')}
                        {...register('translations.en.description')}
                      ></textarea>
                    </div>
                    {errors.translations?.en?.description && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.translations.en.description.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Arabic Translation */}
              <div className={`bg-white dark:bg-gray-800 p-5 rounded-xl border ${
                currentLanguage === 'ar' 
                  ? 'border-green-300 dark:border-green-700' 
                  : 'border-gray-300 dark:border-gray-600'
              } shadow-sm space-y-4`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 flex items-center justify-center text-green-600 dark:text-green-400 mr-3">
                      AR
                    </span>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                      {t('languages.arabic')}
                    </h3>
                  </div>
                  
                  {currentLanguage === 'ar' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800">
                      {t('common.current')}
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="translations.ar.title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('services.title')}
                    </label>
                    <div className="relative">
                      <input
                        id="translations.ar.title"
                        dir="rtl"
                        type="text"
                        className={`block w-full px-4 py-2.5 bg-white dark:bg-gray-800 border font-arabic ${
                          errors.translations?.ar?.title
                            ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'
                        } rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-colors`}
                        placeholder={t('services.titlePlaceholder')}
                        {...register('translations.ar.title')}
                      />
                      {errors.translations?.ar?.title && (
                        <div className="absolute top-1/2 left-3 transform -translate-y-1/2">
                          <FiAlertCircle className="text-red-500" size={16} />
                        </div>
                      )}
                    </div>
                    {errors.translations?.ar?.title && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 text-right">
                        {errors.translations.ar.title.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="translations.ar.description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('services.description')}
                    </label>
                    <div className="relative">
                      <textarea
                        id="translations.ar.description"
                        dir="rtl"
                        rows={4}
                        className={`block w-full px-4 py-2.5 bg-white dark:bg-gray-800 border font-arabic ${
                          errors.translations?.ar?.description
                            ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'
                        } rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-colors`}
                        placeholder={t('services.descriptionPlaceholder')}
                        {...register('translations.ar.description')}
                      ></textarea>
                    </div>
                    {errors.translations?.ar?.description && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 text-right">
                        {errors.translations.ar.description.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer with actions - fixed at the bottom */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-b-lg flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            icon={<FiX className="mr-1" />}
            className="border border-gray-300 dark:border-gray-600 shadow-sm"
          >
            {t('common.cancel')}
          </Button>
          <Button
            type="submit"
            form="service-form"
            isLoading={isSubmitting}
            disabled={!isDirty}
            icon={<FiSave className="mr-2" />}
            className="border border-gray-300 dark:border-gray-600 shadow-sm"
          >
            {isUpdating ? t('common.update') : t('common.create')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ServiceFormModal;