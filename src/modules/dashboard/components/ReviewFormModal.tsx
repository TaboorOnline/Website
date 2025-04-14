// src/modules/dashboard/components/ReviewFormModal.tsx
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FiStar, FiCheck } from 'react-icons/fi';
import Modal from '../../../shared/components/Modal';
import Button from '../../../shared/components/Button';
import Input from '../../../shared/components/Input';
import { Review } from '../../../shared/types/types';
import { useUpdateReview } from '../services/reviewService';

interface ReviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: Review | null;
}

// Define form schema type
interface ReviewFormValues {
  name: string;
  position: string;
  company: string;
  content: string;
  rating: number;
  approved: boolean;
  translations: {
    en: {
      name?: string;
      position?: string;
      company?: string;
      content: string;
    };
    ar: {
      name?: string;
      position?: string;
      company?: string;
      content: string;
    };
  };
}

const ReviewFormModal = ({ isOpen, onClose, review }: ReviewFormModalProps) => {
  const { t, i18n } = useTranslation();
  const updateReviewMutation = useUpdateReview();
  
  const isEditing = !!review;
  const currentLanguage = i18n.language as 'en' | 'ar';

  // Form validation schema
  const reviewSchema = yup.object({
    name: yup.string().required(t('validation.required')),
    position: yup.string().required(t('validation.required')),
    company: yup.string().required(t('validation.required')),
    content: yup.string().required(t('validation.required')),
    rating: yup.number().required(t('validation.required')).min(1, t('validation.minNumber', { min: 1 })).max(5, t('validation.maxNumber', { max: 5 })),
    approved: yup.boolean().default(false),
    translations: yup.object({
      en: yup.object({
        content: yup.string().required(t('validation.required')),
        name: yup.string(),
        position: yup.string(),
        company: yup.string(),
      }),
      ar: yup.object({
        content: yup.string().required(t('validation.required')),
        name: yup.string(),
        position: yup.string(),
        company: yup.string(),
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
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormValues>({
    resolver: yupResolver(reviewSchema),
    defaultValues: {
      name: '',
      position: '',
      company: '',
      content: '',
      rating: 5,
      approved: false,
      translations: {
        en: {
          content: '',
        },
        ar: {
          content: '',
        },
      },
    },
  });

  // Current rating value for the star UI
  const currentRating = watch('rating');

  // Populate form when editing
  useEffect(() => {
    if (review) {
      const translations = (typeof review.translations === 'object' && review.translations !== null)
        ? review.translations as ReviewFormValues['translations']
        : { en: { content: review.content }, ar: { content: '' } };
      
      reset({
        name: review.name,
        position: review.position,
        company: review.company,
        content: review.content,
        rating: review.rating,
        approved: review.approved,
        translations: {
          en: {
            name: translations.en?.name || review.name,
            position: translations.en?.position || review.position,
            company: translations.en?.company || review.company,
            content: translations.en?.content || review.content,
          },
          ar: {
            name: translations.ar?.name || '',
            position: translations.ar?.position || '',
            company: translations.ar?.company || '',
            content: translations.ar?.content || '',
          },
        },
      });
    } else {
      reset({
        name: '',
        position: '',
        company: '',
        content: '',
        rating: 5,
        approved: false,
        translations: {
          en: {
            content: '',
          },
          ar: {
            content: '',
          },
        },
      });
    }
  }, [review, reset]);

  // Handle form submission
  const onSubmit = async (data: ReviewFormValues) => {
    if (!isEditing || !review) {
      return; // We only support editing existing reviews
    }
    
    try {
      await updateReviewMutation.mutateAsync({
        id: review.id,
        ...data,
      });
      onClose();
    } catch (error) {
      console.error('Failed to update review:', error);
    }
  };

  // Star rating component
  const StarRating = () => {
    return (
      <div className="flex space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setValue('rating', star)}
            className={`p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              star <= currentRating
                ? 'text-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
            }`}
            aria-label={`${star} ${t('reviews.stars')}`}
          >
            <FiStar
              className={`w-6 h-6 ${
                star <= currentRating ? 'fill-current' : ''
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('reviews.editReview')}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          {/* Primary Language Fields */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {t('common.primaryInfo')}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={t('reviews.name')}
                error={errors.name?.message}
                {...register('name')}
              />
              
              <div className="flex space-x-4">
                <Controller
                  name="approved"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center mt-8">
                      <input
                        type="checkbox"
                        id="approved"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                      <label htmlFor="approved" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        {t('reviews.approved')}
                      </label>
                    </div>
                  )}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={t('reviews.position')}
                error={errors.position?.message}
                {...register('position')}
              />
              
              <Input
                label={t('reviews.company')}
                error={errors.company?.message}
                {...register('company')}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('reviews.rating')}
              </label>
              <StarRating />
              {errors.rating && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.rating.message}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('reviews.content')}
              </label>
              <textarea
                id="content"
                rows={4}
                className={`input w-full ${
                  errors.content
                    ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                    : ''
                }`}
                {...register('content')}
              ></textarea>
              {errors.content && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.content.message}
                </p>
              )}
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
            
            <div>
              <label htmlFor="translations.en.content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('reviews.content')}
              </label>
              <textarea
                id="translations.en.content"
                rows={4}
                className={`input w-full ${
                  errors.translations?.en?.content
                    ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                    : ''
                }`}
                {...register('translations.en.content')}
              ></textarea>
              {errors.translations?.en?.content && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.translations.en.content.message}
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
            
            <div>
              <label htmlFor="translations.ar.content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('reviews.content')}
              </label>
              <textarea
                id="translations.ar.content"
                rows={4}
                className={`input w-full font-arabic ${
                  errors.translations?.ar?.content
                    ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                    : ''
                }`}
                dir="rtl"
                {...register('translations.ar.content')}
              ></textarea>
              {errors.translations?.ar?.content && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.translations.ar.content.message}
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
            icon={<FiCheck className="mr-2" />}
          >
            {t('common.update')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ReviewFormModal;