// src/modules/dashboard/pages/Blog.tsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiFilter, FiFileText } from 'react-icons/fi';
import DashboardHeader from '../components/DashboardHeader';
import Button from '../../../shared/components/Button';
import DataTable from '../components/DataTable';
import EmptyState from '../components/EmptyState';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { useBlogPosts, useDeleteBlogPost } from '../services/blogService';
import { BlogPost } from '../../../shared/types/types';
import BlogPostFormModal from '../components/BlogPostFormModal';
import Select from '../../../shared/components/Select';

const Blog = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language as 'en' | 'ar';
  
  // Filter state
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  
  // Fetch blog posts
  const { data: posts, isLoading, error } = useBlogPosts(
    filter === 'all' ? undefined : filter === 'published'
  );
  
  const deletePostMutation = useDeleteBlogPost();
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Table columns
  const columns = [
    {
      header: t('blog.title'),
      accessor: (post: BlogPost) => {
        const translations = (post.translations as Record<'en' | 'ar', { content?: string, title?: string }> | undefined)?.[currentLanguage] || {};
        return translations.title || post.title;
      },
      sortable: true,
    },
    {
      header: t('blog.author'),
      accessor: 'author_id',
      cell: (post: BlogPost) => post.author?.name || post.author_id,
    },
    {
      header: t('blog.publishDate'),
      accessor: 'published_at',
      cell: (post: BlogPost) => formatDate(post.published_at),
      sortable: true,
    },
    {
      header: t('blog.status'),
      accessor: 'published',
      cell: (post: BlogPost) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          post.published
            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
            : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
        }`}>
          {post.published ? t('blog.published') : t('blog.draft')}
        </span>
      ),
    },
    {
      header: t('common.actions'),
      accessor: (post: BlogPost) => (
        <div className="flex justify-end items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              // Open preview in new tab
              window.open(`/blog/${post.slug}`, '_blank');
            }}
            aria-label={t('common.view')}
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
          >
            <FiEdit2 className="w-4 h-4" />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(post);
            }}
            aria-label={t('common.delete')}
          >
            <FiTrash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

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

  // Filter options
  const filterOptions = [
    { value: 'all', label: t('blog.filterAll') },
    { value: 'published', label: t('blog.filterPublished') },
    { value: 'draft', label: t('blog.filterDraft') },
  ];

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t('errors.failedToLoadBlogPosts')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {t('errors.tryAgainLater')}
          </p>
          <Button onClick={() => window.location.reload()}>
            {t('common.refresh')}
          </Button>
        </div>
      </div>
    );
  }

  // Filter actions for the DataTable
  const filterActions = (
    <div className="flex items-center">
      <div className="w-48">
        <Select
          options={filterOptions}
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'all' | 'published' | 'draft')}
          icon={<FiFilter />}
        />
      </div>
    </div>
  );

  return (
    <div>
      <DashboardHeader
        title={t('blog.manageBlog')}
        subtitle={t('blog.manageBlogDescription')}
        actions={
          <Button
            onClick={handleCreatePost}
            icon={<FiPlus className="mr-2" />}
          >
            {t('blog.addPost')}
          </Button>
        }
      />

      {!isLoading && posts && posts.length === 0 ? (
        <EmptyState
          title={t('blog.noPosts')}
          message={t('blog.noPostsDescription')}
          icon={<FiFileText className="w-12 h-12 text-gray-400" />}
          actionLabel={t('blog.addPost')}
          onAction={handleCreatePost}
        />
      ) : (
        <DataTable
          columns={columns}
          data={posts || []}
          isLoading={isLoading}
          searchable
          searchPlaceholder={t('blog.searchPosts')}
          searchKey="title"
          noDataMessage={t('blog.noPostsFound')}
          onRowClick={(post) => handleEditPost(post)}
          actions={filterActions}
        />
      )}

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