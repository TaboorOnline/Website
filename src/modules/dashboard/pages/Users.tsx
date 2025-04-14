// src/modules/dashboard/pages/Users.tsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiPlus, FiEdit2, FiTrash2, FiFilter, FiUsers } from 'react-icons/fi';
import DashboardHeader from '../components/DashboardHeader';
import Button from '../../../shared/components/Button';
import DataTable from '../components/DataTable';
import EmptyState from '../components/EmptyState';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { useUsers, useDeleteUser } from '../services/userService';
import { Profile, Role } from '../../../shared/types/types';
import UserFormModal from '../components/UserFormModal';
import Select from '../../../shared/components/Select';

const Users = () => {
  const { t } = useTranslation();
  
  // Filter state
  const [filter, setFilter] = useState<Role | 'all'>('all');
  
  // Fetch users
  const { data: users, isLoading, error } = useUsers(filter !== 'all' ? filter : undefined);
  const deleteUserMutation = useDeleteUser();
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);

  // Format date
  const formatDate = (dateString: string) => {
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
      header: '',
      accessor: (user: Profile) => (
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.name || 'User'}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40x40?text=User';
              }}
            />
          ) : (
            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
            </span>
          )}
        </div>
      ),
    },
    {
      header: t('users.name'),
      accessor: 'name',
      cell: (user: Profile) => user.name || '-',
      sortable: true,
    },
    {
      header: t('users.email'),
      accessor: 'email',
      sortable: true,
    },
    {
      header: t('users.role'),
      accessor: 'role',
      cell: (user: Profile) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          user.role === 'admin'
            ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
            : user.role === 'editor'
            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400'
            : 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400'
        }`}>
          {t(`users.roles.${user.role}`)}
        </span>
      ),
    },
    {
      header: t('users.createdAt'),
      accessor: 'created_at',
      cell: (user: Profile) => formatDate(user.created_at),
      sortable: true,
    },
    {
      header: t('common.actions'),
      accessor: (user: Profile) => (
        <div className="flex justify-end items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEditUser(user);
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
              handleDeleteClick(user);
            }}
            aria-label={t('common.delete')}
            disabled={user.role === 'admin'} // Prevent deleting admins
          >
            <FiTrash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  // Action handlers
  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsCreateModalOpen(true);
  };

  const handleEditUser = (user: Profile) => {
    setSelectedUser(user);
    setIsUpdateModalOpen(true);
  };

  const handleDeleteClick = (user: Profile) => {
    // Prevent deleting admins as a safety measure
    if (user.role === 'admin') return;
    
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;
    
    try {
      await deleteUserMutation.mutateAsync(selectedUser.id);
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  // Filter options
  const filterOptions = [
    { value: 'all', label: t('users.filterAll') },
    { value: 'admin', label: t('users.roles.admin') },
    { value: 'editor', label: t('users.roles.editor') },
    { value: 'viewer', label: t('users.roles.viewer') },
  ];

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t('errors.failedToLoadUsers')}
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
          onChange={(e) => setFilter(e.target.value as Role | 'all')}
          icon={<FiFilter />}
        />
      </div>
    </div>
  );

  return (
    <div>
      <DashboardHeader
        title={t('users.manageUsers')}
        subtitle={t('users.manageUsersDescription')}
        actions={
          <Button
            onClick={handleCreateUser}
            icon={<FiPlus className="mr-2" />}
          >
            {t('users.addUser')}
          </Button>
        }
      />

      {!isLoading && users && users.length === 0 ? (
        <EmptyState
          title={t('users.noUsers')}
          message={t('users.noUsersDescription')}
          icon={<FiUsers className="w-12 h-12 text-gray-400" />}
          actionLabel={t('users.addUser')}
          onAction={handleCreateUser}
        />
      ) : (
        <DataTable
          columns={columns}
          data={users || []}
          isLoading={isLoading}
          searchable
          searchPlaceholder={t('users.searchUsers')}
          searchKey="email"
          noDataMessage={t('users.noUsersFound')}
          onRowClick={(user) => handleEditUser(user)}
          actions={filterActions}
        />
      )}

      {/* Create/Edit User Modals */}
      <UserFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        user={null}
      />

      <UserFormModal
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteUserMutation.status === 'pending'}
        title={t('users.deleteUser')}
        message={t('users.deleteUserConfirmation', { name: selectedUser?.name || selectedUser?.email })}
      />
    </div>
  );
};

export default Users;