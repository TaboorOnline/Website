// src/modules/dashboard/pages/Blog.tsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiEye, 
  FiFilter, 
  FiFileText, 
  FiCalendar, 
  FiClock,
  FiSearch,
  FiRefreshCw,
  FiMoreHorizontal,
  FiX,
  FiGrid,
  FiList
} from 'react-icons/fi';
import DashboardHeader from '../components/DashboardHeader';
import Button from '../../../shared/components/Button';
import EmptyState from '../components/EmptyState';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { useBlogPosts, useDeleteBlogPost } from '../services/blogService';
import { BlogPost } from '../../../shared/types/types';
import BlogPostFormModal from '../components/BlogPostFormModal';
import Select from '../../../shared/components/Select';
import Image from '../../../shared/components/Image';


const Blog = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language as 'en' | 'ar';
  
  // Filter and view state
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Fetch blog posts
  const { data: posts, isLoading, error, refetch } = useBlogPosts(
    filter === 'all' ? undefined : filter === 'published'
  );
  
  const deletePostMutation = useDeleteBlogPost();
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: (custom: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: custom * 0.05,
        duration: 0.4,
        ease: "easeOut"
      }
    })
  };

  // Format date with relative time
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 1) {
      return t('blog.today');
    } else if (diffDays === 1) {
      return t('blog.yesterday');
    } else if (diffDays < 7) {
      return t('blog.daysAgo', { count: diffDays });
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return t('blog.weeksAgo', { count: weeks });
    } else {
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
  };

  // Action handlers
  const handleCreatePost = () => {
    setSelectedPost(null);
    setIsCreateModalOpen(true);
  };

  const handleEditPost = (post: BlogPost) => {
    setSelectedPost(post);
    setIsUpdateModalOpen(true);
  };

  const handleDeleteClick = (post: BlogPost) => {
    setSelectedPost(post);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPost) return;
    
    try {
      await deletePostMutation.mutateAsync(selectedPost.id);
      setIsDeleteModalOpen(false);
      setSelectedPost(null);
    } catch (error) {
      console.error('Failed to delete blog post:', error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  // Filter the posts
  const filteredPosts = posts
    ? posts.filter(post => {
        // Apply status filter
        const statusMatch = filter === 'all' || 
          (filter === 'published' && post.published) || 
          (filter === 'draft' && !post.published);
          
        // Apply search filter
        if (!searchQuery) return statusMatch;
        
        const title = ((post.translations as any)?.[currentLanguage]?.title || post.title || '').toLowerCase();
        const content = ((post.translations as any)?.[currentLanguage]?.content || post.content || '').toLowerCase();
        const query = searchQuery.toLowerCase();
        
        return statusMatch && (title.includes(query) || content.includes(query));
      })
    : [];

  // Filter options
  const filterOptions = [
    { value: 'all', label: t('blog.filterAll') },
    { value: 'published', label: t('blog.filterPublished') },
    { value: 'draft', label: t('blog.filterDraft') },
  ];

  if (error) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-300 dark:border-gray-600 shadow-lg max-w-lg"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center border border-red-200 dark:border-red-800">
            <FiAlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t('errors.failedToLoadBlogPosts')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {t('errors.tryAgainLater')}
          </p>
          <Button 
            onClick={handleRefresh} 
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
        title={t('blog.manageBlog')}
        subtitle={t('blog.manageBlogDescription')}
        actions={
          <Button
            onClick={handleCreatePost}
            icon={<FiPlus className="mr-2" />}
            className="border border-gray-300 dark:border-gray-600 shadow-sm"
          >
            {t('blog.addPost')}
          </Button>
        }
      />

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-300 dark:border-gray-600 p-4">
        <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder={t('blog.searchPosts')}
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
          
          <div className="flex items-center space-x-2">
            {/* Status Filter */}
            <div className="w-40">
              <Select
                options={filterOptions}
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'published' | 'draft')}
                icon={<FiFilter />}
                className="border border-gray-300 dark:border-gray-600 p-[5px] rounded-lg"
              />
            </div>
            
            {/* View Toggle */}
            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 ${
                  viewMode === 'grid' 
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400' 
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
                aria-label={t('blog.gridView')}
              >
                <FiGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 ${
                  viewMode === 'list' 
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400' 
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
                aria-label={t('blog.listView')}
              >
                <FiList size={18} />
              </button>
            </div>
            
            {/* Refresh Button */}
            <Button
              variant="outline"
              onClick={handleRefresh}
              isLoading={isRefreshing}
              className="border border-gray-300 dark:border-gray-600"
              icon={<FiRefreshCw />}
              aria-label={t('common.refresh')}
            >
              {t("common.refresh")}
            </Button>
          </div>
        </div>
      </div>

      {/* Blog Posts List/Grid */}
      <AnimatePresence>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-300 dark:border-gray-600 flex items-center">
              <svg className="animate-spin h-5 w-5 text-primary-600 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-gray-700 dark:text-gray-300">{t('common.loading')}</span>
            </div>
          </div>
        ) : !filteredPosts.length ? (
          <EmptyState
            title={searchQuery ? t('blog.noSearchResults') : t('blog.noPosts')}
            message={searchQuery ? t('blog.tryDifferentSearch') : t('blog.noPostsDescription')}
            icon={<FiFileText className="w-12 h-12 text-gray-400 dark:text-gray-500" />}
            actionLabel={searchQuery ? t('blog.clearSearch') : t('blog.addPost')}
            onAction={searchQuery ? () => setSearchQuery('') : handleCreatePost}
          />
        ) : (
          <>
            {/* Results Count */}
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {t('blog.showingResults', { count: filteredPosts.length })}
            </div>
            
            {viewMode === 'grid' ? (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
              >
                {filteredPosts.map((post, index) => {
                  const translations = (post.translations as Record<'en' | 'ar', { content?: string, title?: string, excerpt?: string }> | undefined)?.[currentLanguage] || {};
                  const title = translations.title || post.title;
                  const excerpt = translations.excerpt || post.excerpt || '';
                  
                  return (
                    <motion.div
                      custom={index}
                      variants={itemVariants}
                      key={post.id}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-300 dark:border-gray-600 overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer"
                      onClick={() => handleEditPost(post)}
                    >
                      {/* Featured Image */}
                      <div className="aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-900 relative">
                        {post.featured_image ? (
                          <Image 
                          src={post.featured_image} 
                          alt={title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          customIcon={
                            <div className="flex flex-col items-center justify-center h-full bg-indigo-50 dark:bg-indigo-950/30">
                              <FiFileText className="w-20 h-20 text-indigo-300 dark:text-indigo-700 mb-2" />
                            </div>
                          }
                        />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <FiFileText className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                          </div>
                        )}
                        
                        {/* Status Badge */}
                        <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
                          post.published
                            ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-800'
                            : 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800'
                        }`}>
                          {post.published ? t('blog.published') : t('blog.draft')}
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
                          {title}
                        </h3>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 h-10">
                          {excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center">
                            <FiCalendar className="mr-1" />
                            {formatDate(post.published_at)}
                          </div>
                          
                          {/* Tags */}
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex items-center space-x-1 overflow-hidden">
                              {post.tags.slice(0, 2).map((tag, tagIndex) => (
                                <span 
                                  key={tagIndex}
                                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                              {post.tags.length > 2 && (
                                <span className="text-gray-500 dark:text-gray-400">+{post.tags.length - 2}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="border-t border-gray-200 dark:border-gray-700 p-2 flex justify-end space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(`/blog/${post.slug}`, '_blank');
                          }}
                          aria-label={t('common.view')}
                          className="border border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        >
                          <FiEye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditPost(post);
                          }}
                          aria-label={t('common.edit')}
                          className="border border-green-300 dark:border-green-700 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(post);
                          }}
                          aria-label={t('common.delete')}
                          className="border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-300 dark:border-gray-600 shadow-sm overflow-x-scroll"
              >
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {t('blog.title')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {t('blog.status')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {t('blog.publishDate')}
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {t('common.actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredPosts.map((post, index) => {
                      const translations = (post.translations as Record<'en' | 'ar', { content?: string, title?: string }> | undefined)?.[currentLanguage] || {};
                      const title = translations.title || post.title;
                      
                      return (
                        <motion.tr 
                          custom={index}
                          variants={itemVariants}
                          key={post.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                          onClick={() => handleEditPost(post)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded overflow-hidden bg-gray-100 dark:bg-gray-700">
                                {post.featured_image ? (
                                  <Image 
                                    src={post.featured_image} 
                                    alt={title}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    customIcon={
                                      <div className="flex flex-col items-center justify-center h-full bg-indigo-50 dark:bg-indigo-950/30">
                                        <FiFileText className="w-20 h-20 text-indigo-300 dark:text-indigo-700 mb-2" />
                                      </div>
                                    }
                                  />
                                ) : (
                                  <div className="flex items-center justify-center h-full">
                                    <FiFileText className="text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {title}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {post.author?.name || post.author_id}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              post.published
                                ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-800'
                                : 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800'
                            }`}>
                              {post.published ? t('blog.published') : t('blog.draft')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(post.published_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(`/blog/${post.slug}`, '_blank');
                                }}
                                aria-label={t('common.view')}
                                className="border border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                              >
                                <FiEye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditPost(post);
                                }}
                                aria-label={t('common.edit')}
                                className="border border-green-300 dark:border-green-700 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
                              >
                                <FiEdit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteClick(post);
                                }}
                                aria-label={t('common.delete')}
                                className="border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>

      {/* Create/Edit Blog Post Modals */}
      <BlogPostFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        blogPost={null}
      />

      <BlogPostFormModal
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setSelectedPost(null);
        }}
        blogPost={selectedPost}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setSelectedPost(null);
        }}
        onConfirm={handleDeleteConfirm}
        isDeleting={deletePostMutation.status === 'pending'}
        title={t('blog.deletePost')}
        message={t('blog.deletePostConfirmation', { title: selectedPost?.title })}
      />
    </div>
  );
};

export default Blog;