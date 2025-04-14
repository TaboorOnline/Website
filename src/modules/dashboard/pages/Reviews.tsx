// src/modules/dashboard/pages/Reviews.tsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiStar, FiCheck, FiEdit2, FiTrash2, FiFilter } from 'react-icons/fi';
import DashboardHeader from '../components/DashboardHeader';
import Button from '../../../shared/components/Button';
import DataTable from '../components/DataTable';
import EmptyState from '../components/EmptyState';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { useReviews, useApproveReview, useRejectReview } from '../services/reviewService';
import { Review } from '../../../shared/types/types';
import ReviewFormModal from '../components/ReviewFormModal';
import Select from '../../../shared/components/Select';

const Reviews = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language as 'en' | 'ar';
  
  // Filter state
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');
  
  // Get reviews based on filter
  const { data: reviews, isLoading, error } = useReviews(
    filter === 'all' ? undefined : filter === 'approved'
  );
  
  // Mutations
  const approveReviewMutation = useApproveReview();
  const rejectReviewMutation = useRejectReview();
  
  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  // Table columns
  const columns = [
    {
      header: t('reviews.name'),
      accessor: 'name' as const,
      sortable: true,
    },
    {
      header: t('reviews.company'),
      accessor: (review: Review) => `${review.position}, ${review.company}`,
    },
    {
      header: t('reviews.rating'),
      accessor: 'rating' as const,
      sortable: true,
      cell: (review: Review) => (
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <FiStar
              key={i}
              className={`${
                i < review.rating
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300 dark:text-gray-600'
              } w-5 h-5`}
            />
          ))}
        </div>
      ),
    },
    {
      header: t('reviews.content'),
      accessor: (review: Review) => {
        const translations = (review.translations as Record<'en' | 'ar', { content?: string }> | undefined)?.[currentLanguage] || {};
        const content = translations.content || review.content;
        return content.length > 100 ? content.substring(0, 100) + '...' : content;
      },
    },
    {
      header: t('reviews.status'),
      accessor: 'approved' as const,
      cell: (review: Review) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          review.approved
            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
            : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
        }`}>
          {review.approved ? t('reviews.approved') : t('reviews.pending')}
        </span>
      ),
    },
    {
      header: t('common.actions'),
      accessor: (review: Review) => (
        <div className="flex justify-end items-center space-x-2">
          {!review.approved && (
            <Button
              variant="primary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleApprove(review);
              }}
              aria-label={t('reviews.approve')}
            >
              <FiCheck className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(review);
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
              handleDelete(review);
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
  const handleEdit = (review: Review) => {
    setSelectedReview(review);
    setIsEditModalOpen(true);
  };

  const handleDelete = (review: Review) => {
    setSelectedReview(review);
    setIsDeleteModalOpen(true);
  };

  const handleApprove = async (review: Review) => {
    try {
      await approveReviewMutation.mutateAsync(review.id);
    } catch (error) {
      console.error('Failed to approve review:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedReview) return;
    
    try {
      await rejectReviewMutation.mutateAsync(selectedReview.id);
      setIsDeleteModalOpen(false);
      setSelectedReview(null);
    } catch (error) {
      console.error('Failed to delete review:', error);
    }
  };

  // Filter options
  const filterOptions = [
    { value: 'all', label: t('reviews.filterAll') },
    { value: 'pending', label: t('reviews.filterPending') },
    { value: 'approved', label: t('reviews.filterApproved') },
  ];

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t('errors.failedToLoadReviews')}
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
          onChange={(e) => setFilter(e.target.value as 'all' | 'pending' | 'approved')}
          icon={<FiFilter />}
        />
      </div>
    </div>
  );

  return (
    <div>
      <DashboardHeader
        title={t('reviews.manageReviews')}
        subtitle={t('reviews.manageReviewsDescription')}
      />

      {!isLoading && reviews && reviews.length === 0 ? (
        <EmptyState
          title={t('reviews.noReviews')}
          message={t('reviews.noReviewsDescription')}
          icon={<FiStar className="w-12 h-12 text-gray-400" />}
        />
      ) : (
        <DataTable
          columns={columns}
          data={reviews || []}
          isLoading={isLoading}
          searchable
          searchPlaceholder={t('reviews.searchReviews')}
          searchKey="name"
          noDataMessage={t('reviews.noReviewsFound')}
          onRowClick={(review) => handleEdit(review)}
          actions={filterActions}
        />
      )}

      {/* Edit Review Modal */}
      <ReviewFormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedReview(null);
        }}
        review={selectedReview}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setSelectedReview(null);
        }}
        onConfirm={handleDeleteConfirm}
        isDeleting={rejectReviewMutation.status === 'pending'}
        title={t('reviews.deleteReview')}
        message={t('reviews.deleteReviewConfirmation')}
      />
    </div>
  );
};

export default Reviews;