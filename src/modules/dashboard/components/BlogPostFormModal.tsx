// src/modules/dashboard/components/BlogPostFormModal.tsx
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FiCheck, FiImage, FiUpload, FiTag, FiCalendar } from 'react-icons/fi';
import Modal from '../../../shared/components/Modal';
import Button from '../../../shared/components/Button';
import Input from '../../../shared/components/Input';
import { BlogPost } from '../../../shared/types/types';
import { useCreateBlogPost, useUpdateBlogPost, useGetAuthors } from '../services/blogService';
import { supabase } from '../../../app/supabaseClient';
import Select from '../../../shared/components/Select';
import { getCurrentUser } from '../../../app/supabaseClient';

interface BlogPostFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  blogPost: BlogPost | null;
}

// Define form schema type
interface BlogPostFormValues {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author_id: string;
  featured_image: string;
  published: boolean;
  published_at: string | null;
  tags: string[];
  translations: {
    en: {
      title: string;
      content: string;
      excerpt: string;
    };
    ar: {
      title: string;
      content: string;
      excerpt: string;
    };
  };
}

const BlogPostFormModal = ({ isOpen, onClose, blogPost }: BlogPostFormModalProps) => {
  const { t, i18n } = useTranslation();
  const createBlogPostMutation = useCreateBlogPost();
  const updateBlogPostMutation = useUpdateBlogPost();
  const { data: authors } = useGetAuthors();
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  
  const isUpdating = !!blogPost;
  const currentLanguage = i18n.language as 'en' | 'ar';

  // Form validation schema
  const blogPostSchema = yup.object({
    title: yup.string().required(t('validation.required')),
    slug: yup.string().required(t('validation.required')),
    content: yup.string().required(t('validation.required')),
    excerpt: yup.string().required(t('validation.required')),
    author_id: yup.string().required(t('validation.required')),
    featured_image: yup.string().required(t('validation.required')),
    published: yup.boolean().default(false),
    published_at: yup.string().nullable(),
    tags: yup.array().of(yup.string()),
    translations: yup.object({
      en: yup.object({
        title: yup.string().required(t('validation.required')),
        content: yup.string().required(t('validation.required')),
        excerpt: yup.string().required(t('validation.required')),
      }),
      ar: yup.object({
        title: yup.string().required(t('validation.required')),
        content: yup.string().required(t('validation.required')),
        excerpt: yup.string().required(t('validation.required')),
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
  } = useForm<BlogPostFormValues>({
    resolver: yupResolver(blogPostSchema),
    defaultValues: {
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      author_id: '',
      featured_image: '',
      published: false,
      published_at: null,
      tags: [],
      translations: {
        en: {
          title: '',
          content: '',
          excerpt: '',
        },
        ar: {
          title: '',
          content: '',
          excerpt: '',
        },
      },
    },
  });

  // Watch image and published status for UI updates
  const featuredImage = watch('featured_image');
  const isPublished = watch('published');
  const watchedTags = watch('tags');

  // Set current user as author when creating new post
  useEffect(() => {
    const setCurrentUserAsAuthor = async () => {
      if (!isUpdating) {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setValue('author_id', currentUser.id);
        }
      }
    };
    
    setCurrentUserAsAuthor();
  }, [isUpdating, setValue]);

  // Populate form when editing
  useEffect(() => {
    if (blogPost) {
      const translations = blogPost.translations || {
        en: { 
          title: blogPost.title, 
          content: blogPost.content,
          excerpt: blogPost.excerpt
        },
        ar: { 
          title: '', 
          content: '',
          excerpt: ''
        },
      };
      
      reset({
        title: blogPost.title,
        slug: blogPost.slug,
        content: blogPost.content,
        excerpt: blogPost.excerpt,
        author_id: blogPost.author_id,
        featured_image: blogPost.featured_image,
        published: blogPost.published,
        published_at: blogPost.published_at,
        tags: blogPost.tags || [],
        translations: {
          en: {
            title: translations.en?.title || blogPost.title,
            content: translations.en?.content || blogPost.content,
            excerpt: translations.en?.excerpt || blogPost.excerpt,
          },
          ar: {
            title: translations.ar?.title || '',
            content: translations.ar?.content || '',
            excerpt: translations.ar?.excerpt || '',
          },
        },
      });
      
      // Update the tags input field
      setTagsInput((blogPost.tags || []).join(', '));
    } else {
      reset({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        author_id: '',
        featured_image: '',
        published: false,
        published_at: null,
        tags: [],
        translations: {
          en: {
            title: '',
            content: '',
            excerpt: '',
          },
          ar: {
            title: '',
            content: '',
            excerpt: '',
          },
        },
      });
      setTagsInput('');
    }
  }, [blogPost, reset]);

  // Handle image upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `blog/${fileName}`;
    
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
      
      setValue('featured_image', publicUrl);
      setUploadProgress(100);
    } catch (error: any) {
      setUploadError(error.message || t('errors.uploadFailed'));
    } finally {
      setIsUploading(false);
    }
  };

  // Handle tags input
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagsInput(e.target.value);
    
    // Convert comma-separated string to array
    const tagsArray = e.target.value
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== '');
    
    setValue('tags', tagsArray);
  };

  // Generate slug from title
  const generateSlug = () => {
    const title = watch('title');
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-'); // Replace multiple hyphens with a single hyphen
    
    setValue('slug', slug);
  };

  // Handle form submission
  const onSubmit = async (data: BlogPostFormValues) => {
    // If published is true and published_at is null, set it to current date
    if (data.published && !data.published_at) {
      data.published_at = new Date().toISOString();
    }
    
    try {
      if (isUpdating && blogPost) {
        await updateBlogPostMutation.mutateAsync({
          id: blogPost.id,
          ...data,
        });
      } else {
        await createBlogPostMutation.mutateAsync(data);
      }
      onClose();
    } catch (error) {
      console.error('Failed to save blog post:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isUpdating ? t('blog.editPost') : t('blog.addPost')}
      size="xl"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          {/* Primary Language Fields */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {t('common.primaryInfo')}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Input
                  label={t('blog.title')}
                  error={errors.title?.message}
                  {...register('title')}
                />
              </div>
              
              <div className="flex items-end">
                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                  onClick={generateSlug}
                >
                  {t('blog.generateSlug')}
                </Button>
              </div>
            </div>
            
            <Input
              label={t('blog.slug')}
              error={errors.slug?.message}
              {...register('slug')}
            />
            
            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('blog.excerpt')}
              </label>
              <textarea
                id="excerpt"
                rows={2}
                className={`input w-full ${
                  errors.excerpt
                    ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                    : ''
                }`}
                {...register('excerpt')}
              ></textarea>
              {errors.excerpt && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.excerpt.message}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('blog.content')}
              </label>
              <textarea
                id="content"
                rows={8}
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
            
            {/* Author, Publication Status and Date */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('blog.author')}
                </label>
                <Controller
                  name="author_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      options={authors?.map(author => ({
                        value: author.id,
                        label: author.name || author.id,
                      })) || []}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      error={errors.author_id?.message}
                    />
                  )}
                />
              </div>
              
              <div className="flex items-center mt-6">
                <Controller
                  name="published"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="published"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                      <label htmlFor="published" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        {t('blog.published')}
                      </label>
                    </div>
                  )}
                />
              </div>
              
              {isPublished && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('blog.publishDate')}
                  </label>
                  <Input
                    type="datetime-local"
                    {...register('published_at')}
                    error={errors.published_at?.message}
                    icon={<FiCalendar />}
                  />
                </div>
              )}
            </div>
            
            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('blog.tags')}
              </label>
              <Input
                placeholder={t('blog.tagsPlaceholder')}
                value={tagsInput}
                onChange={handleTagsChange}
                icon={<FiTag />}
              />
              {watchedTags && watchedTags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {watchedTags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            {/* Featured Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('blog.featuredImage')}
              </label>
              <div className="flex flex-col md:flex-row gap-4 items-start">
                <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700">
                  {featuredImage ? (
                    <img
                      src={featuredImage}
                      alt={t('blog.preview')}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x200?text=Blog+Post';
                      }}
                    />
                  ) : (
                    <FiImage className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col space-y-2">
                    <Input
                      label={t('blog.imageUrl')}
                      error={errors.featured_image?.message}
                      {...register('featured_image')}
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
              label={t('blog.title')}
              error={errors.translations?.en?.title?.message}
              {...register('translations.en.title')}
            />
            
            <div>
              <label htmlFor="translations.en.excerpt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('blog.excerpt')}
              </label>
              <textarea
                id="translations.en.excerpt"
                rows={2}
                className={`input w-full ${
                  errors.translations?.en?.excerpt
                    ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                    : ''
                }`}
                {...register('translations.en.excerpt')}
              ></textarea>
              {errors.translations?.en?.excerpt && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.translations.en.excerpt.message}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="translations.en.content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('blog.content')}
              </label>
              <textarea
                id="translations.en.content"
                rows={6}
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
            
            <Input
              label={t('blog.title')}
              error={errors.translations?.ar?.title?.message}
              {...register('translations.ar.title')}
              className="font-arabic"
              dir="rtl"
            />
            
            <div>
              <label htmlFor="translations.ar.excerpt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('blog.excerpt')}
              </label>
              <textarea
                id="translations.ar.excerpt"
                rows={2}
                className={`input w-full font-arabic ${
                  errors.translations?.ar?.excerpt
                    ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                    : ''
                }`}
                dir="rtl"
                {...register('translations.ar.excerpt')}
              ></textarea>
              {errors.translations?.ar?.excerpt && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.translations.ar.excerpt.message}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="translations.ar.content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('blog.content')}
              </label>
              <textarea
                id="translations.ar.content"
                rows={6}
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

export default BlogPostFormModal;