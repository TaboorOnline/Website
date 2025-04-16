// src/modules/dashboard/components/TeamMemberFormModal.tsx
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FiUser, FiCheck, FiImage, FiUpload, FiFacebook, FiTwitter, FiLinkedin, FiMail } from 'react-icons/fi';
import Modal from '../../../shared/components/Modal';
import Button from '../../../shared/components/Button';
import Input from '../../../shared/components/Input';
import { TeamMember } from '../../../shared/types/types';
import { useCreateTeamMember, useUpdateTeamMember } from '../services/teamService';
import { supabase } from '../../../app/supabaseClient';

interface TeamMemberFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamMember: TeamMember | null;
}

// Define form schema type
interface TeamMemberFormValues {
  name: string;
  title: string;
  bio: string;
  image_url: string;
  order: number;
  social_links: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    email?: string;
  };
  translations: {
    en: {
      name: string;
      title: string;
      bio: string;
    };
    ar: {
      name: string;
      title: string;
      bio: string;
    };
  };
}

const TeamMemberFormModal = ({ isOpen, onClose, teamMember }: TeamMemberFormModalProps) => {
  const { t, i18n } = useTranslation();
  const createTeamMemberMutation = useCreateTeamMember();
  const updateTeamMemberMutation = useUpdateTeamMember();
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  
  const isUpdating = !!teamMember;
  const currentLanguage = i18n.language as 'en' | 'ar';

  // Form validation schema
  const teamMemberSchema = yup.object({
    name: yup.string().required(t('validation.required')),
    title: yup.string().required(t('validation.required')),
    bio: yup.string().required(t('validation.required')),
    image_url: yup.string().required(t('validation.required')),
    order: yup.number().required(t('validation.required')).min(0, t('validation.minNumber', { min: 0 })),
    social_links: yup.object({
      linkedin: yup.string().url(t('validation.url')).nullable(),
      twitter: yup.string().url(t('validation.url')).nullable(),
      facebook: yup.string().url(t('validation.url')).nullable(),
      email: yup.string().email(t('validation.email')).nullable(),
    }),
    translations: yup.object({
      en: yup.object({
        name: yup.string().required(t('validation.required')),
        title: yup.string().required(t('validation.required')),
        bio: yup.string().required(t('validation.required')),
      }),
      ar: yup.object({
        name: yup.string().required(t('validation.required')),
        title: yup.string().required(t('validation.required')),
        bio: yup.string().required(t('validation.required')),
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
  } = useForm<TeamMemberFormValues>({
    resolver: yupResolver(teamMemberSchema),
    defaultValues: {
      name: '',
      title: '',
      bio: '',
      image_url: '',
      order: 0,
      social_links: {
        linkedin: '',
        twitter: '',
        facebook: '',
        email: '',
      },
      translations: {
        en: {
          name: '',
          title: '',
          bio: '',
        },
        ar: {
          name: '',
          title: '',
          bio: '',
        },
      },
    },
  });

  // Watch image for preview
  const imageUrl = watch('image_url');

  // Populate form when editing
  useEffect(() => {
    if (teamMember) {
      const translations = teamMember.translations || {
        en: { name: teamMember.name, title: teamMember.title, bio: teamMember.bio },
        ar: { name: '', title: '', bio: '' },
      };
      
      reset({
        name: teamMember.name,
        title: teamMember.title,
        bio: teamMember.bio,
        image_url: teamMember.image_url,
        order: teamMember.order,
        social_links: teamMember.social_links || {
          linkedin: '',
          twitter: '',
          facebook: '',
          email: '',
        },
        translations: {
          en: {
            name: translations.en?.name || teamMember.name,
            title: translations.en?.title || teamMember.title,
            bio: translations.en?.bio || teamMember.bio,
          },
          ar: {
            name: translations.ar?.name || '',
            title: translations.ar?.title || '',
            bio: translations.ar?.bio || '',
          },
        },
      });
    } else {
      reset({
        name: '',
        title: '',
        bio: '',
        image_url: '',
        order: 0,
        social_links: {
          linkedin: '',
          twitter: '',
          facebook: '',
          email: '',
        },
        translations: {
          en: {
            name: '',
            title: '',
            bio: '',
          },
          ar: {
            name: '',
            title: '',
            bio: '',
          },
        },
      });
    }
  }, [teamMember, reset]);

  // Handle image upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `team/${fileName}`;
    
    setIsUploading(true);
    setUploadProgress(0);
    setUploadError('');
    
    try {
      const { error: uploadError, data } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);
      
      setValue('image_url', publicUrl);
      setUploadProgress(100);
    } catch (error: any) {
      setUploadError(error.message || t('errors.uploadFailed'));
    } finally {
      setIsUploading(false);
    }
  };

  // Handle form submission
  const onSubmit = async (data: TeamMemberFormValues) => {
    try {
      if (isUpdating && teamMember) {
        await updateTeamMemberMutation.mutateAsync({
          id: teamMember.id,
          ...data,
        });
      } else {
        await createTeamMemberMutation.mutateAsync(data);
      }
      onClose();
    } catch (error) {
      console.error('Failed to save team member:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isUpdating ? t('team.editMember') : t('team.addMember')}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          {/* indigo Language Fields */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {t('common.indigoInfo')}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={t('team.name')}
                error={errors.name?.message}
                {...register('name')}
              />
              
              <Input
                label={t('team.title')}
                error={errors.title?.message}
                {...register('title')}
              />
            </div>
            
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('team.bio')}
              </label>
              <textarea
                id="bio"
                rows={4}
                className={`input w-full ${
                  errors.bio
                    ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                    : ''
                }`}
                {...register('bio')}
              ></textarea>
              {errors.bio && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.bio.message}
                </p>
              )}
            </div>
            
            <Input
              label={t('team.order')}
              type="number"
              error={errors.order?.message}
              {...register('order', { valueAsNumber: true })}
            />
            
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('team.photo')}
              </label>
              <div className="flex flex-col md:flex-row gap-4 items-start">
                <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={t('team.preview')}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x200?text=Team+Member';
                      }}
                    />
                  ) : (
                    <FiUser className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col space-y-2">
                    <Input
                      label={t('team.imageUrl')}
                      error={errors.image_url?.message}
                      {...register('image_url')}
                      icon={<FiImage />}
                    />
                    
                    <div className="flex items-center">
                      <span className="text-gray-500 dark:text-gray-400 text-sm mr-2">
                        {t('common.or')}
                      </span>
                      <label className="btn btn-outline">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <FiUpload className="mr-2" />
                        {t('common.upload')}
                      </label>
                    </div>
                    
                    {isUploading && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div
                            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {t('common.uploading')}: {uploadProgress}%
                        </p>
                      </div>
                    )}
                    
                    {uploadError && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                        {uploadError}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Social Links */}
            <div>
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">
                {t('team.socialLinks')}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label={t('team.linkedin')}
                  error={errors.social_links?.linkedin?.message}
                  {...register('social_links.linkedin')}
                  icon={<FiLinkedin />}
                />
                
                <Input
                  label={t('team.twitter')}
                  error={errors.social_links?.twitter?.message}
                  {...register('social_links.twitter')}
                  icon={<FiTwitter />}
                />
                
                <Input
                  label={t('team.facebook')}
                  error={errors.social_links?.facebook?.message}
                  {...register('social_links.facebook')}
                  icon={<FiFacebook />}
                />
                
                <Input
                  label={t('team.email')}
                  error={errors.social_links?.email?.message}
                  {...register('social_links.email')}
                  icon={<FiMail />}
                />
              </div>
            </div>
          </div>

          {/* English Translation */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              {t('languages.english')}
              {currentLanguage === 'en' && (
                <span className="ml-2 text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 py-1 px-2 rounded-full">
                  {t('common.current')}
                </span>
              )}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={t('team.name')}
                error={errors.translations?.en?.name?.message}
                {...register('translations.en.name')}
              />
              
              <Input
                label={t('team.title')}
                error={errors.translations?.en?.title?.message}
                {...register('translations.en.title')}
              />
            </div>
            
            <div>
              <label htmlFor="translations.en.bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('team.bio')}
              </label>
              <textarea
                id="translations.en.bio"
                rows={4}
                className={`input w-full ${
                  errors.translations?.en?.bio
                    ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                    : ''
                }`}
                {...register('translations.en.bio')}
              ></textarea>
              {errors.translations?.en?.bio && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.translations.en.bio.message}
                </p>
              )}
            </div>
          </div>

          {/* Arabic Translation */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              {t('languages.arabic')}
              {currentLanguage === 'ar' && (
                <span className="ml-2 text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 py-1 px-2 rounded-full">
                  {t('common.current')}
                </span>
              )}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={t('team.name')}
                error={errors.translations?.ar?.name?.message}
                {...register('translations.ar.name')}
                className="font-arabic"
                dir="rtl"
              />
              
              <Input
                label={t('team.title')}
                error={errors.translations?.ar?.title?.message}
                {...register('translations.ar.title')}
                className="font-arabic"
                dir="rtl"
              />
            </div>
            
            <div>
              <label htmlFor="translations.ar.bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('team.bio')}
              </label>
              <textarea
                id="translations.ar.bio"
                rows={4}
                className={`input w-full font-arabic ${
                  errors.translations?.ar?.bio
                    ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                    : ''
                }`}
                dir="rtl"
                {...register('translations.ar.bio')}
              ></textarea>
              {errors.translations?.ar?.bio && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.translations.ar.bio.message}
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
            disabled={isSubmitting || isUploading}
          >
            {t('common.cancel')}
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={isUploading}
            icon={isUpdating ? <FiCheck className="mr-2" /> : undefined}
          >
            {isUpdating ? t('common.update') : t('common.create')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TeamMemberFormModal;