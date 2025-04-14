// src/modules/dashboard/pages/Profile.tsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FiUser, FiMail, FiImage, FiUpload, FiSave, FiShield } from 'react-icons/fi';
import DashboardHeader from '../components/DashboardHeader';
import Card from '../../../shared/components/Card';
import Button from '../../../shared/components/Button';
import Input from '../../../shared/components/Input';
import { useCurrentUserProfile, useUpdateUser } from '../services/userService';
import { supabase } from '../../../app/supabaseClient';

interface ProfileFormData {
  name: string;
  avatar_url: string;
}

const Profile = () => {
  const { t } = useTranslation();
  const { data: profile, isLoading: profileLoading, refetch } = useCurrentUserProfile();
  const updateUserMutation = useUpdateUser();
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);
  
  // Form validation schema
  const profileSchema = yup.object({
    name: yup.string().required(t('validation.required')),
    avatar_url: yup.string().nullable(),
  });
  
  // Initialize form
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: '',
      avatar_url: '',
    },
  });
  
  // Watch avatar_url for preview
  const avatarUrl = watch('avatar_url');
  
  // Populate form with profile data when loaded
  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name || '',
        avatar_url: profile.avatar_url || '',
      });
    }
  }, [profile, reset]);
  
  // Handle avatar upload
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `avatars/${fileName}`;
    
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
      
      setValue('avatar_url', publicUrl);
      setUploadProgress(100);
    } catch (error: any) {
      setUploadError(error.message || t('errors.uploadFailed'));
    } finally {
      setIsUploading(false);
    }
  };
  
  // Handle form submission
  const onSubmit = async (data: ProfileFormData) => {
    if (!profile) return;
    
    try {
      await updateUserMutation.mutateAsync({
        id: profile.id,
        name: data.name,
        avatar_url: data.avatar_url,
      });
      
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
      
      // Refetch profile data
      refetch();
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <div>
      <DashboardHeader
        title={t('profile.title')}
        subtitle={t('profile.subtitle')}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card title={t('profile.personalInfo')}>
            {profileLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            ) : profile ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                  label={t('profile.name')}
                  error={errors.name?.message}
                  {...register('name')}
                  icon={<FiUser />}
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('profile.email')}
                  </label>
                  <Input
                    value={profile.email}
                    disabled
                    icon={<FiMail />}
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {t('profile.emailCannotBeChanged')}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('profile.role')}
                  </label>
                  <div className="flex items-center space-x-2">
                    <FiShield className="text-gray-400" />
                    <span className={`px-2 py-1 text-sm rounded-full ${
                      profile.role === 'admin'
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                        : profile.role === 'editor'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400'
                        : 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400'
                    }`}>
                      {t(`users.roles.${profile.role}`)}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('profile.avatar')}
                  </label>
                  <div className="flex flex-col md:flex-row gap-4 items-start">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={t('profile.preview')}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100?text=User';
                          }}
                        />
                      ) : (
                        <FiUser className="w-12 h-12 text-gray-400" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex flex-col space-y-2">
                        <Input
                          label={t('profile.avatarUrl')}
                          error={errors.avatar_url?.message}
                          {...register('avatar_url')}
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
                              onChange={handleAvatarUpload}
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
                                className="bg-primary-600 h-2.5 rounded-full transition-all duration-300"
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
                
                {updateSuccess && (
                  <div className="p-3 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md text-sm">
                    {t('profile.updateSuccess')}
                  </div>
                )}
                
                <div>
                  <Button
                    type="submit"
                    isLoading={isSubmitting || isUploading}
                    icon={<FiSave className="mr-2" />}
                  >
                    {t('profile.saveChanges')}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  {t('profile.profileNotFound')}
                </p>
                <Button
                  onClick={() => refetch()}
                  className="mt-4"
                >
                  {t('common.refresh')}
                </Button>
              </div>
            )}
          </Card>
        </div>
        
        <div className="space-y-8">
          <Card title={t('profile.accountSummary')}>
            <div className="space-y-4">
              {profileLoading ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                </div>
              ) : profile ? (
                <>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700">
                      {profile.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt={profile.name || 'User'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100?text=User';
                          }}
                        />
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400 text-2xl font-medium">
                          {profile.name?.charAt(0) || profile.email?.charAt(0) || 'U'}
                        </span>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {profile.name || 'Unnamed User'}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">{profile.email}</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">{t('profile.memberSince')}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {new Date(profile.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">{t('profile.accountStatus')}</span>
                      <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                        {t('profile.active')}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">{t('profile.lastUpdate')}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {new Date(profile.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  {t('profile.profileNotFound')}
                </p>
              )}
            </div>
          </Card>
          
          <Card title={t('profile.quickLinks')}>
            <div className="space-y-3">
              <Button
                variant="outline"
                fullWidth
                onClick={() => window.location.href = '/dashboard/settings'}
              >
                {t('profile.goToSettings')}
              </Button>
              
              <Button
                variant="outline"
                fullWidth
                onClick={() => window.location.href = '/dashboard/tasks?assignee=me'}
              >
                {t('profile.viewMyTasks')}
              </Button>
              
              <Button
                variant="outline"
                fullWidth
                onClick={() => window.location.href = '/dashboard'}
              >
                {t('profile.backToDashboard')}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;