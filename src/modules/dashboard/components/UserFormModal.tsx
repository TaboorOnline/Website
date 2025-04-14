// src/modules/dashboard/components/UserFormModal.tsx
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FiCheck, FiImage, FiUpload, FiMail, FiUser, FiShield } from 'react-icons/fi';
import Modal from '../../../shared/components/Modal';
import Button from '../../../shared/components/Button';
import Input from '../../../shared/components/Input';
import Select from '../../../shared/components/Select';
import { Profile, Role } from '../../../shared/types/types';
import { useCreateUser, useUpdateUser } from '../services/userService';
import { supabase } from '../../../app/supabaseClient';
import { getCurrentUser } from '../../../app/supabaseClient';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: Profile | null;
}

// Define form schema type
interface UserFormValues {
  id?: string;
  name: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  role: Role;
  avatar_url: string;
}

const UserFormModal = ({ isOpen, onClose, user }: UserFormModalProps) => {
  const { t } = useTranslation();
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const [currentUserIsAdmin, setCurrentUserIsAdmin] = useState(false);
  
  const isUpdating = !!user;

  // Check if current user is admin
  useEffect(() => {
    const checkCurrentUser = async () => {
      try {
        const { data } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', (await getCurrentUser())?.id || '')
          .single();
        
        setCurrentUserIsAdmin(data?.role === 'admin');
      } catch (error) {
        console.error('Error checking current user role:', error);
        setCurrentUserIsAdmin(false);
      }
    };
    
    checkCurrentUser();
  }, []);

  // Form validation schema
  const userSchema = yup.object({
    name: yup.string().required(t('validation.required')),
    email: yup.string().email(t('validation.email')).required(t('validation.required')),
    password: isUpdating
      ? yup.string().nullable().notRequired()
      : yup.string().required(t('validation.required')).min(8, t('validation.passwordLength')),
    confirmPassword: isUpdating
      ? yup.string().nullable().notRequired()
      : yup.string()
          .required(t('validation.required'))
          .oneOf([yup.ref('password')], t('validation.passwordMatch')),
    role: yup.string().required(t('validation.required')),
    avatar_url: yup.string().nullable(),
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
  } = useForm<UserFormValues>({
    resolver: yupResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'viewer' as Role,
      avatar_url: '',
    },
  });

  // Watch avatar_url for preview
  const avatarUrl = watch('avatar_url');

  // Populate form when editing
  useEffect(() => {
    if (user) {
      reset({
        id: user.id,
        name: user.name || '',
        email: user.email || '',
        password: '',
        confirmPassword: '',
        role: user.role,
        avatar_url: user.avatar_url || '',
      });
    } else {
      reset({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'viewer' as Role,
        avatar_url: '',
      });
    }
  }, [user, reset]);

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

  // Role options
  const roleOptions = [
    { value: 'admin', label: t('users.roles.admin') },
    { value: 'editor', label: t('users.roles.editor') },
    { value: 'viewer', label: t('users.roles.viewer') },
  ];

  // Handle form submission
  const onSubmit = async (data: UserFormValues) => {
    try {
      if (isUpdating && user) {
        const updates: Partial<UserFormValues> = {
          name: data.name,
          role: data.role,
        };
        
        if (data.avatar_url) {
          updates.avatar_url = data.avatar_url;
        }
        
        // Only include password if it's changed
        if (data.password) {
          updates.password = data.password;
        }
        
        await updateUserMutation.mutateAsync({
          id: user.id,
          ...updates,
        });
      } else {
        await createUserMutation.mutateAsync({
          name: data.name,
          email: data.email,
          password: data.password!,
          role: data.role,
          avatar_url: data.avatar_url,
        });
      }
      onClose();
    } catch (error) {
      console.error('Failed to save user:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isUpdating ? t('users.editUser') : t('users.addUser')}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <div className="space-y-4">
            {/* Avatar Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('users.avatar')}
              </label>
              <div className="flex flex-col md:flex-row gap-4 items-start">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={t('users.preview')}
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
                      label={t('users.avatarUrl')}
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={t('users.name')}
                error={errors.name?.message}
                {...register('name')}
                icon={<FiUser />}
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('users.role')}
                </label>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <Select
                      options={roleOptions}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      error={errors.role?.message}
                      icon={<FiShield />}
                      disabled={isUpdating && !currentUserIsAdmin} // Only admins can change roles of existing users
                    />
                  )}
                />
              </div>
            </div>
            
            <Input
              label={t('users.email')}
              error={errors.email?.message}
              {...register('email')}
              icon={<FiMail />}
              disabled={isUpdating} // Can't change email for existing users
            />
            
            {/* Password fields - only required for new users */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="password"
                label={isUpdating ? t('users.newPassword') : t('users.password')}
                error={errors.password?.message}
                {...register('password')}
                helperText={isUpdating ? t('users.leaveBlankPassword') : undefined}
              />
              
              <Input
                type="password"
                label={t('users.confirmPassword')}
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />
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

export default UserFormModal;