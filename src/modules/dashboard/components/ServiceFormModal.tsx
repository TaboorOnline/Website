// src/modules/dashboard/components/ServiceFormModal.tsx
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FiCheck } from 'react-icons/fi';
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
    formState: { errors, isSubmitting },
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

  // When the language changes, update the primary title/description fields
  useEffect(() => {
    const updatePrimaryFields = () => {
      if (currentLanguage === 'en' || currentLanguage === 'ar') {
        const title = (service?.translations as ServiceFormValues['translations'])?.[currentLanguage]?.title || '';
        const description = (service?.translations as ServiceFormValues['translations'])?.[currentLanguage]?.description || '';
        
        if (title) setValue('title', title);
        if (description) setValue('description', description);
      }
    };
    
    if (isUpdating) {
      updatePrimaryFields();
    }
  }, [currentLanguage, service, setValue, isUpdating]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isUpdating ? t('services.editService') : t('services.addService')}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          {/* Primary Language Fields */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {t('common.primaryInfo')}
            </h3>
            
            <Input
              label={t('services.title')}
              error={errors.title?.message}
              {...register('title')}
            />
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('services.description')}
              </label>
              <textarea
                id="description"
                rows={3}
                className={`input w-full ${
                  errors.description
                    ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                    : ''
                }`}
                {...register('description')}
              ></textarea>
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.description.message}
                </p>
              )}
            </div>
            
            <Input
              label={t('services.icon')}
              error={errors.icon?.message}
              helperText={t('services.iconHelp')}
              {...register('icon')}
            />
            
            <Input
              label={t('services.order')}
              type="number"
              error={errors.order?.message}
              {...register('order', { valueAsNumber: true })}
            />
            
            <div className="flex items-center">
              <Controller
                name="featured"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="featured"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                    <label htmlFor="featured" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      {t('services.featured')}
                    </label>
                  </div>
                )}
              />
            </div>
          </div>

          {/* English Translation */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              {t('languages.english')}
              {currentLanguage === 'en' && (
                <span className="ml-2 text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 py-1 px-2 rounded-full">
                  {t('common.current')}
                </span>
              )}
            </h3>
            
            <Input
              label={t('services.title')}
              error={errors.translations?.en?.title?.message}
              {...register('translations.en.title')}
            />
            
            <div>
              <label htmlFor="translations.en.description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('services.description')}
              </label>
              <textarea
                id="translations.en.description"
                rows={3}
                className={`input w-full ${
                  errors.translations?.en?.description
                    ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                    : ''
                }`}
                {...register('translations.en.description')}
              ></textarea>
              {errors.translations?.en?.description && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.translations.en.description.message}
                </p>
              )}
            </div>
          </div>

          {/* Arabic Translation */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              {t('languages.arabic')}
              {currentLanguage === 'ar' && (
                <span className="ml-2 text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 py-1 px-2 rounded-full">
                  {t('common.current')}
                </span>
              )}
            </h3>
            
            <Input
              label={t('services.title')}
              error={errors.translations?.ar?.title?.message}
              {...register('translations.ar.title')}
              className="font-arabic"
              dir="rtl"
            />
            
            <div>
              <label htmlFor="translations.ar.description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('services.description')}
              </label>
              <textarea
                id="translations.ar.description"
                rows={3}
                className={`input w-full font-arabic ${
                  errors.translations?.ar?.description
                    ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                    : ''
                }`}
                dir="rtl"
                {...register('translations.ar.description')}
              ></textarea>
              {errors.translations?.ar?.description && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.translations.ar.description.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            {t('common.cancel')}
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
            icon={isUpdating ? <FiCheck className="mr-2" /> : undefined}
          >
            {isUpdating ? t('common.update') : t('common.create')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ServiceFormModal;