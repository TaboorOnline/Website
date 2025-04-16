// src/modules/dashboard/components/BlogPostFormModal.tsx
import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiCheck, 
  FiImage, 
  FiUpload, 
  FiTag, 
  FiCalendar, 
  FiX, 
  FiFileText, 
  FiLayers,
  FiLink,
  FiUser,
  FiEye,
  FiSave,
  FiPlusCircle,
  FiType,
  FiAlignLeft,
  FiGlobe
} from 'react-icons/fi';
import Modal from '../../../shared/components/Modal';
import Button from '../../../shared/components/Button';
import Input from '../../../shared/components/Input';
import { BlogPost } from '../../../shared/types/types';
import { useCreateBlogPost, useUpdateBlogPost, useGetAuthors } from '../services/blogService';
import { supabase } from '../../../app/supabaseClient';
import Select from '../../../shared/components/Select';
import { getCurrentUser } from '../../../app/supabaseClient';
import Image from '../../../shared/components/Image';

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
  const [activeTab, setActiveTab] = useState<'general' | 'content' | 'seo' | 'translations'>('general');
  const [newTag, setNewTag] = useState('');
  const newTagInputRef = useRef<HTMLInputElement>(null);
  
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
    formState: { errors, isSubmitting, isDirty },
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
  const watchedTitle = watch('title');
  const watchedContent = watch('content');
  const watchedExcerpt = watch('excerpt');

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

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 300);
    
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
      
      // Clear the progress indicator after 1 second
      setTimeout(() => {
        clearInterval(progressInterval);
      }, 1000);
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

  // Add a new tag
  const handleAddTag = () => {
    if (!newTag.trim()) return;
    
    const currentTags = watchedTags || [];
    if (!currentTags.includes(newTag.trim())) {
      setValue('tags', [...currentTags, newTag.trim()]);
      setTagsInput(prev => prev ? `${prev}, ${newTag.trim()}` : newTag.trim());
    }
    
    setNewTag('');
    newTagInputRef.current?.focus();
  };

  // Remove a tag
  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = watchedTags || [];
    const updatedTags = currentTags.filter(tag => tag !== tagToRemove);
    
    setValue('tags', updatedTags);
    setTagsInput(updatedTags.join(', '));
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

  // Tab animation variants
  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isUpdating ? t('blog.editPost') : t('blog.addPost')}
      size="2xl"
      noPadding
    >
      <div className="flex flex-col h-full max-h-[85vh]">
        {/* Header with tabs */}
        <div className="flex overflow-x-auto py-2 px-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 gap-2 min-h-[55px]">
          <button 
            onClick={() => setActiveTab('general')} 
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center ${
              activeTab === 'general' 
                ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-gray-300 dark:border-gray-600' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <FiFileText className="mr-2" />
            {t('blog.tabGeneral')}
          </button>
          <button 
            onClick={() => setActiveTab('content')} 
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center ${
              activeTab === 'content' 
                ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-gray-300 dark:border-gray-600' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <FiAlignLeft className="mr-2" />
            {t('blog.tabContent')}
          </button>
          <button 
            onClick={() => setActiveTab('translations')} 
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center ${
              activeTab === 'translations' 
                ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-gray-300 dark:border-gray-600' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <FiGlobe className="mr-2" />
            {t('blog.tabTranslations')}
          </button>
          <button 
            onClick={() => setActiveTab('seo')} 
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center ${
              activeTab === 'seo' 
                ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-gray-300 dark:border-gray-600' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <FiLayers className="mr-2" />
            {t('blog.tabSEO')}
          </button>
        </div>

        {/* Post preview (sticky at top) */}
        {(activeTab === 'content' || activeTab === 'general') && (
          <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Featured Image Preview */}
              <div className="sm:w-1/4">
                <div className="aspect-video rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 shadow-sm bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                  {featuredImage ? (
                      <Image 
                        src={featuredImage} 
                        alt={watchedTitle}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        customIcon={
                          <div className="flex flex-col items-center justify-center h-full bg-indigo-50 dark:bg-indigo-950/30">
                            <FiImage className="w-20 h-20 text-indigo-300 dark:text-indigo-700 mb-2" />
                          </div>
                        }
                      />
                  ) : (
                    <FiImage className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                  )}
                </div>
              </div>
              
              {/* Post Title and Excerpt preview */}
              <div className="sm:w-3/4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 mb-2">
                  {watchedTitle || t('blog.untitledPost')}
                </h3>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                  {watchedExcerpt || t('blog.noExcerpt')}
                </p>
                
                {/* Tags */}
                {watchedTags && watchedTags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {watchedTags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="mt-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    isPublished
                      ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-800'
                      : 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800'
                  }`}>
                    {isPublished ? t('blog.published') : t('blog.draft')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form id="blog-post-form" onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              {activeTab === 'general' && (
                <motion.div
                  key="general"
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        <div className="flex items-center">
                          <FiType className="mr-2 text-indigo-500" size={16} />
                          {t('blog.title')}
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
                          placeholder={t('blog.titlePlaceholder')}
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
                    
                    <div className="flex items-center space-x-2">
                      <div className="relative flex-grow">
                        <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          <div className="flex items-center">
                            <FiLink className="mr-2 text-indigo-500" size={16} />
                            {t('blog.slug')}
                          </div>
                        </label>
                        <input
                          id="slug"
                          type="text"
                          className={`block w-full px-4 py-2.5 bg-white dark:bg-gray-800 border ${
                            errors.slug
                              ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500'
                              : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'
                          } rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-colors`}
                          placeholder="my-post-slug"
                          {...register('slug')}
                        />
                        {errors.slug && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {errors.slug.message}
                          </p>
                        )}
                      </div>
                      
                      <div className="pt-7">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={generateSlug}
                          className="border border-gray-300 dark:border-gray-600"
                        >
                          {t('blog.generateSlug')}
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Featured Image */}
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      <div className="flex items-center">
                        <FiImage className="mr-2 text-indigo-500" size={16} />
                        {t('blog.featuredImage')}
                      </div>
                    </label>
                    <div className="flex flex-col md:flex-row gap-4 items-start">
                      <div className="md:w-1/3 w-full">
                        <div className="aspect-video rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900 flex items-center justify-center relative group">
                          {featuredImage ? (
                            <>
                              <Image 
                                src={featuredImage} 
                                alt={t("blog.preview")}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />

                              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                                <label className="cursor-pointer p-2 bg-white dark:bg-gray-800 rounded-full">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                  />
                                  <FiUpload className="text-gray-700 dark:text-gray-300" size={18} />
                                </label>
                              </div>
                            </>
                          ) : (
                            <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                              />
                              <FiImage className="w-10 h-10 text-gray-300 dark:text-gray-600 mb-2" />
                              <span className="text-sm text-gray-500 dark:text-gray-400 text-center px-4">
                                {t('blog.dropImageHere')}
                              </span>
                            </label>
                          )}
                        </div>
                      </div>
                      
                      <div className="md:w-2/3 w-full space-y-4">
                        <div className="relative">
                          <label htmlFor="featured_image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t('blog.imageUrl')}
                          </label>
                          <input
                            id="featured_image"
                            type="text"
                            className={`block w-full px-4 py-2.5 bg-white dark:bg-gray-800 border ${
                              errors.featured_image
                                ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500'
                                : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'
                            } rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-colors pl-10`}
                            placeholder="https://example.com/my-image.jpg"
                            {...register('featured_image')}
                          />
                          <div className="absolute left-3 top-9">
                            <FiImage className="text-gray-400" size={16} />
                          </div>
                          {errors.featured_image && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                              {errors.featured_image.message}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">
                            {t('common.or')}
                          </span>
                          <label className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 shadow-sm">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                            <FiUpload className="mr-2 text-gray-600 dark:text-gray-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('common.upload')}</span>
                          </label>
                        </div>
                        
                        {isUploading && (
                          <div className="mt-2">
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden border border-gray-300 dark:border-gray-600">
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
                  
                  {/* Tags */}
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      <div className="flex items-center">
                        <FiTag className="mr-2 text-indigo-500" size={16} />
                        {t('blog.tags')}
                      </div>
                    </label>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {(watchedTags || []).map((tag, index) => (
                        <div 
                          key={index} 
                          className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 text-sm flex items-center border border-indigo-200 dark:border-indigo-800"
                        >
                          <span>{tag}</span>
                          <button 
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-2 text-indigo-500 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-200"
                          >
                            <FiX size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="relative flex-grow">
                        <input
                          type="text"
                          ref={newTagInputRef}
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddTag();
                            }
                          }}
                          placeholder={t('blog.addTagPlaceholder')}
                          className="block w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors pl-10"
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <FiTag className="text-gray-400" size={16} />
                        </div>
                      </div>
                      
                      <Button
                        type="button"
                        onClick={handleAddTag}
                        variant="outline"
                        className="border border-gray-300 dark:border-gray-600"
                        disabled={!newTag.trim()}
                        icon={<FiPlusCircle className="mr-2" />}
                      >
                        {t('blog.addTag')}
                      </Button>
                    </div>
                    
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      {t('blog.tagsHelp')}
                    </p>
                  </div>
                  
                  {/* Author, Publication Status and Date */}
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          <div className="flex items-center">
                            <FiUser className="mr-2 text-indigo-500" size={16} />
                            {t('blog.author')}
                          </div>
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
                              className="border border-gray-300 dark:border-gray-600"
                            />
                          )}
                        />
                      </div>
                      
                      <div className="flex items-center">
                        <Controller
                          name="published"
                          control={control}
                          render={({ field }) => (
                            <div className="flex items-center">
                              <div className="relative inline-block w-12 h-6 cursor-pointer">
                                <input
                                  type="checkbox"
                                  id="published"
                                  className="sr-only"
                                  checked={field.value}
                                  onChange={(e) => field.onChange(e.target.checked)}
                                />
                                <div
                                  className={`block w-12 h-6 rounded-full ${
                                    field.value 
                                      ? 'bg-green-500 border-green-600' 
                                      : 'bg-gray-300 dark:bg-gray-600 border-gray-400 dark:border-gray-500'
                                  } border transition-colors duration-200`}
                                ></div>
                                <div
                                  className={`absolute left-0.5 top-0.5 bg-white border border-gray-300 w-5 h-5 rounded-full transition-transform duration-200 flex items-center justify-center ${
                                    field.value ? 'transform translate-x-6 border-green-500' : ''
                                  }`}
                                >
                                  {field.value && <FiCheck className="text-green-500" size={10} />}
                                </div>
                              </div>
                              <label htmlFor="published" className="ml-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                                {field.value ? t('blog.published') : t('blog.draft')}
                              </label>
                            </div>
                          )}
                        />
                      </div>
                      
                      {isPublished && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            <div className="flex items-center">
                              <FiCalendar className="mr-2 text-indigo-500" size={16} />
                              {t('blog.publishDate')}
                            </div>
                          </label>
                          <div className="relative">
                            <input
                              type="datetime-local"
                              className="block w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors pl-10"
                              {...register('published_at')}
                            />
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                              <FiCalendar className="text-gray-400" size={16} />
                            </div>
                            {errors.published_at && (
                              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                {errors.published_at.message}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'content' && (
                <motion.div
                  key="content"
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  {/* Excerpt */}
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm">
                    <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <div className="flex items-center">
                        <FiAlignLeft className="mr-2 text-indigo-500" size={16} />
                        {t('blog.excerpt')}
                      </div>
                    </label>
                    <div className="relative">
                      <textarea
                        id="excerpt"
                        rows={2}
                        className={`block w-full px-4 py-2.5 bg-white dark:bg-gray-800 border ${
                          errors.excerpt
                            ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'
                        } rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-colors`}
                        placeholder={t('blog.excerptPlaceholder')}
                        {...register('excerpt')}
                      ></textarea>
                      {errors.excerpt && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {errors.excerpt.message}
                        </p>
                      )}
                    </div>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      {t('blog.excerptHelp')}
                    </p>
                  </div>
                  
                  {/* Content */}
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm">
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <div className="flex items-center">
                        <FiFileText className="mr-2 text-indigo-500" size={16} />
                        {t('blog.content')}
                      </div>
                    </label>
                    <div className="flex mb-2">
                      <div className="flex space-x-1 p-1 bg-gray-100 dark:bg-gray-700 rounded">
                        <button type="button" className="p-1 rounded hover:bg-white dark:hover:bg-gray-600">B</button>
                        <button type="button" className="p-1 rounded hover:bg-white dark:hover:bg-gray-600 italic">I</button>
                        <button type="button" className="p-1 rounded hover:bg-white dark:hover:bg-gray-600 underline">U</button>
                        <span className="border-r border-gray-300 dark:border-gray-600 mx-1"></span>
                        <button type="button" className="p-1 rounded hover:bg-white dark:hover:bg-gray-600">
                          <FiLink size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="relative">
                      <textarea
                        id="content"
                        rows={12}
                        className={`block w-full px-4 py-2.5 bg-white dark:bg-gray-800 border ${
                          errors.content
                            ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'
                        } rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-colors font-mono text-sm`}
                        placeholder={t('blog.contentPlaceholder')}
                        {...register('content')}
                      ></textarea>
                      {errors.content && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {errors.content.message}
                        </p>
                      )}
                    </div>
                    <div className="flex justify-between mt-2">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t('blog.markdown')}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {watchedContent ? watchedContent.length : 0} {t('blog.characters')}
                      </p>
                    </div>
                  </div>
                  
                  {/* Preview */}
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        <div className="flex items-center">
                          <FiEye className="mr-2 text-indigo-500" size={16} />
                          {t('blog.preview')}
                        </div>
                      </label>
                      <button 
                        type="button"
                        onClick={() => window.open('/blog/preview', '_blank')}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <FiEye className="mr-1" size={14} />
                        {t('blog.openPreview')}
                      </button>
                    </div>
                    
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 h-64 p-4 overflow-y-auto prose dark:prose-invert max-w-none">
                      {watchedContent ? (
                        <div>
                          <h1>{watchedTitle}</h1>
                          <p>{watchedExcerpt}</p>
                          <div dangerouslySetInnerHTML={{ __html: watchedContent.replace(/\n/g, '<br>') }} />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                          <FiFileText className="w-8 h-8 mb-2 opacity-50" />
                          <p>{t('blog.noContentToPreview')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'translations' && (
                <motion.div
                  key="translations"
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  {/* English Translation */}
                  <div className={`bg-white dark:bg-gray-800 p-4 rounded-lg border ${
                    currentLanguage === 'en' 
                      ? 'border-blue-300 dark:border-blue-700' 
                      : 'border-gray-300 dark:border-gray-600'
                  } shadow-sm space-y-4`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3 font-medium">
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
                    
                    <div className="relative">
                      <label htmlFor="translations.en.title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('blog.title')}
                      </label>
                      <input
                        id="translations.en.title"
                        type="text"
                        className={`block w-full px-4 py-2.5 bg-white dark:bg-gray-800 border ${
                          errors.translations?.en?.title
                            ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'
                        } rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-colors`}
                        placeholder={t('blog.titlePlaceholder')}
                        {...register('translations.en.title')}
                      />
                      {errors.translations?.en?.title && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {errors.translations.en.title.message}
                        </p>
                      )}
                    </div>
                    
                    <div className="relative">
                      <label htmlFor="translations.en.excerpt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('blog.excerpt')}
                      </label>
                      <textarea
                        id="translations.en.excerpt"
                        rows={2}
                        className={`block w-full px-4 py-2.5 bg-white dark:bg-gray-800 border ${
                          errors.translations?.en?.excerpt
                            ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'
                        } rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-colors`}
                        placeholder={t('blog.excerptPlaceholder')}
                        {...register('translations.en.excerpt')}
                      ></textarea>
                      {errors.translations?.en?.excerpt && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {errors.translations.en.excerpt.message}
                        </p>
                      )}
                    </div>
                    
                    <div className="relative">
                      <label htmlFor="translations.en.content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('blog.content')}
                      </label>
                      <textarea
                        id="translations.en.content"
                        rows={8}
                        className={`block w-full px-4 py-2.5 bg-white dark:bg-gray-800 border ${
                          errors.translations?.en?.content
                            ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'
                        } rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-colors font-mono text-sm`}
                        placeholder={t('blog.contentPlaceholder')}
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
                  <div className={`bg-white dark:bg-gray-800 p-4 rounded-lg border ${
                    currentLanguage === 'ar' 
                      ? 'border-green-300 dark:border-green-700' 
                      : 'border-gray-300 dark:border-gray-600'
                  } shadow-sm space-y-4`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 flex items-center justify-center text-green-600 dark:text-green-400 mr-3 font-medium">
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
                    
                    <div className="relative">
                      <label htmlFor="translations.ar.title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('blog.title')}
                      </label>
                      <input
                        id="translations.ar.title"
                        dir="rtl"
                        type="text"
                        className={`block w-full px-4 py-2.5 bg-white dark:bg-gray-800 border font-arabic ${
                          errors.translations?.ar?.title
                            ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'
                        } rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-colors`}
                        placeholder={t('blog.titlePlaceholder')}
                        {...register('translations.ar.title')}
                      />
                      {errors.translations?.ar?.title && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400 text-right">
                          {errors.translations.ar.title.message}
                        </p>
                      )}
                    </div>
                    
                    <div className="relative">
                      <label htmlFor="translations.ar.excerpt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('blog.excerpt')}
                      </label>
                      <textarea
                        id="translations.ar.excerpt"
                        dir="rtl"
                        rows={2}
                        className={`block w-full px-4 py-2.5 bg-white dark:bg-gray-800 border font-arabic ${
                          errors.translations?.ar?.excerpt
                            ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'
                        } rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-colors`}
                        placeholder={t('blog.excerptPlaceholder')}
                        {...register('translations.ar.excerpt')}
                      ></textarea>
                      {errors.translations?.ar?.excerpt && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400 text-right">
                          {errors.translations.ar.excerpt.message}
                        </p>
                      )}
                    </div>
                    
                    <div className="relative">
                      <label htmlFor="translations.ar.content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('blog.content')}
                      </label>
                      <textarea
                        id="translations.ar.content"
                        dir="rtl"
                        rows={8}
                        className={`block w-full px-4 py-2.5 bg-white dark:bg-gray-800 border font-arabic ${
                          errors.translations?.ar?.content
                            ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'
                        } rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-colors font-mono text-sm`}
                        placeholder={t('blog.contentPlaceholder')}
                        {...register('translations.ar.content')}
                      ></textarea>
                      {errors.translations?.ar?.content && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400 text-right">
                          {errors.translations.ar.content.message}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'seo' && (
                <motion.div
                  key="seo"
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm"
                >
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      {t('blog.seoPreview')}
                    </h3>
                    <div className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900">
                      <div className="text-indigo-600 text-base font-medium mb-1 truncate">
                        {watchedTitle || t('blog.untitledPost')}
                      </div>
                      <div className="text-green-600 dark:text-green-400 text-sm mb-1 truncate">
                        https://yourdomain.com/blog/{watch('slug') || 'post-slug'}
                      </div>
                      <div className="text-gray-700 dark:text-gray-300 text-sm">
                        {watchedExcerpt || t('blog.noExcerpt')}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                    {t('blog.seoTip')}
                  </p>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {t('blog.seoOptimization')}
                    </h3>
                    
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-sm text-green-800 dark:text-green-200">
                      <div className="flex items-center mb-2">
                        <FiCheck className="text-green-600 dark:text-green-400 mr-2" size={18} />
                        <span className="font-medium">{t('blog.titleLength')}</span>
                      </div>
                      <p>{t('blog.titleLengthGood')}</p>
                    </div>
                    
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-sm text-green-800 dark:text-green-200">
                      <div className="flex items-center mb-2">
                        <FiCheck className="text-green-600 dark:text-green-400 mr-2" size={18} />
                        <span className="font-medium">{t('blog.slugFormat')}</span>
                      </div>
                      <p>{t('blog.slugFormatGood')}</p>
                    </div>
                    
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-sm text-green-800 dark:text-green-200">
                      <div className="flex items-center mb-2">
                        <FiCheck className="text-green-600 dark:text-green-400 mr-2" size={18} />
                        <span className="font-medium">{t('blog.excerptLength')}</span>
                      </div>
                      <p>{t('blog.excerptLengthGood')}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>

        {/* Footer with actions - fixed at the bottom */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center">
          <div>
            {isDirty && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {t('blog.unsavedChanges')}
              </span>
            )}
          </div>
          
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting || isUploading}
              className="border border-gray-300 dark:border-gray-600 shadow-sm"
              icon={<FiX className="mr-1" />}
            >
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              form="blog-post-form"
              isLoading={isSubmitting}
              disabled={isUploading}
              className="border border-gray-300 dark:border-gray-600 shadow-sm"
              icon={<FiSave className="mr-2" />}
            >
              {isUpdating ? t('common.update') : t('common.create')}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default BlogPostFormModal;