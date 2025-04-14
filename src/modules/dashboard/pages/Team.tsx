// src/modules/dashboard/pages/Team.tsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiPlus, FiEdit2, FiTrash2, FiUsers } from 'react-icons/fi';
import DashboardHeader from '../components/DashboardHeader';
import Button from '../../../shared/components/Button';
import DataTable from '../components/DataTable';
import EmptyState from '../components/EmptyState';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import TeamMemberFormModal from '../components/TeamMemberFormModal';
import { useTeamMembers, useDeleteTeamMember } from '../services/teamService';
import { TeamMember } from '../../../shared/types/types';

const Team = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language as 'en' | 'ar';
  
  const { data: teamMembers, isLoading, error } = useTeamMembers();
  const deleteTeamMemberMutation = useDeleteTeamMember();
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  // Table columns
  const columns = [
    {
      header: '',
      accessor: (member: TeamMember) => (
        <div className="w-12 h-12 rounded-full overflow-hidden">
          <img
            src={member.image_url}
            alt={member.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x200?text=Team+Member';
            }}
          />
        </div>
      ),
    },
    {
      header: t('team.name'),
      accessor: (member: TeamMember) => {
        const translations = (member.translations as Record<'en' | 'ar', { content?: string, name?: string }> | undefined)?.[currentLanguage] || {};
        return translations.name || member.name;
      },
      sortable: true,
    },
    {
      header: t('team.title'),
      accessor: (member: TeamMember) => {
        const translations = (member.translations as Record<'en' | 'ar', { content?: string, title?: string }> | undefined)?.[currentLanguage] || {};
        return translations.title || member.title;
      },
    },
    {
      header: t('team.order'),
      accessor: 'order' as const,
      sortable: true,
    },
    {
      header: t('common.actions'),
      accessor: (member: TeamMember) => (
        <div className="flex justify-end items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEditMember(member);
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
              handleDeleteClick(member);
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
  const handleCreateMember = () => {
    setSelectedMember(null);
    setIsCreateModalOpen(true);
  };

  const handleEditMember = (member: TeamMember) => {
    setSelectedMember(member);
    setIsUpdateModalOpen(true);
  };

  const handleDeleteClick = (member: TeamMember) => {
    setSelectedMember(member);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedMember) return;
    
    try {
      await deleteTeamMemberMutation.mutateAsync(selectedMember.id);
      setIsDeleteModalOpen(false);
      setSelectedMember(null);
    } catch (error) {
      console.error('Failed to delete team member:', error);
    }
  };

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t('errors.failedToLoadTeam')}
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

  return (
    <div>
      <DashboardHeader
        title={t('team.manageTeam')}
        subtitle={t('team.manageTeamDescription')}
        actions={
          <Button
            onClick={handleCreateMember}
            icon={<FiPlus className="mr-2" />}
          >
            {t('team.addMember')}
          </Button>
        }
      />

      {!isLoading && teamMembers && teamMembers.length === 0 ? (
        <EmptyState
          title={t('team.noMembers')}
          message={t('team.noMembersDescription')}
          icon={<FiUsers className="w-12 h-12 text-gray-400" />}
          actionLabel={t('team.addMember')}
          onAction={handleCreateMember}
        />
      ) : (
        <DataTable
          columns={columns}
          data={teamMembers || []}
          isLoading={isLoading}
          searchable
          searchPlaceholder={t('team.searchMembers')}
          searchKey="name"
          noDataMessage={t('team.noMembersFound')}
          onRowClick={(member) => handleEditMember(member)}
        />
      )}

      {/* Create/Edit Team Member Modals */}
      <TeamMemberFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        teamMember={null}
      />

      <TeamMemberFormModal
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setSelectedMember(null);
        }}
        teamMember={selectedMember}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setSelectedMember(null);
        }}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteTeamMemberMutation.status === 'pending'}
        title={t('team.deleteMember')}
        message={t('team.deleteMemberConfirmation', { name: selectedMember?.name })}
      />
    </div>
  );
};

export default Team;