// src/modules/dashboard/components/TaskFormModal.tsx
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FiCheck, FiAlertCircle, FiFlag, FiCalendar, FiUser } from 'react-icons/fi';
import Modal from '../../../shared/components/Modal';
import Button from '../../../shared/components/Button';
import Input from '../../../shared/components/Input';
import Select from '../../../shared/components/Select';
import { Task, TaskStatus, TaskPriority } from '../../../shared/types/types';
import { useCreateTask, useUpdateTask, useTeamMembers } from '../services/taskService';
import { getCurrentUser } from '../../../app/supabaseClient';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

// Define form schema type
interface TaskFormValues {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  assigned_to: string | null;
}

const TaskFormModal = ({ isOpen, onClose, task }: TaskFormModalProps) => {
  const { t } = useTranslation();
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const { data: teamMembers } = useTeamMembers();
  
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  const isUpdating = !!task;

  // Get current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          setCurrentUserId(user.id);
        }
      } catch (error) {
        console.error('Failed to get current user:', error);
      }
    };
    
    fetchCurrentUser();
  }, []);

  // Form validation schema
  const taskSchema = yup.object({
    title: yup.string().required(t('validation.required')),
    description: yup.string().required(t('validation.required')),
    status: yup.string().required(t('validation.required')),
    priority: yup.string().required(t('validation.required')),
    due_date: yup.string().nullable(),
    assigned_to: yup.string().nullable(),
  });

  // Initialize form
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: yupResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'todo' as TaskStatus,
      priority: 'medium' as TaskPriority,
      due_date: null,
      assigned_to: null,
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        due_date: task.due_date,
        assigned_to: task.assigned_to,
      });
    } else {
      reset({
        title: '',
        description: '',
        status: 'todo' as TaskStatus,
        priority: 'medium' as TaskPriority,
        due_date: null,
        assigned_to: null,
      });
    }
  }, [task, reset]);

  // Status options
  const statusOptions = [
    { value: 'todo', label: t('tasks.statuses.todo') },
    { value: 'in_progress', label: t('tasks.statuses.in_progress') },
    { value: 'review', label: t('tasks.statuses.review') },
    { value: 'completed', label: t('tasks.statuses.completed') },
  ];

  // Priority options
  const priorityOptions = [
    { value: 'low', label: t('tasks.priorities.low') },
    { value: 'medium', label: t('tasks.priorities.medium') },
    { value: 'high', label: t('tasks.priorities.high') },
    { value: 'urgent', label: t('tasks.priorities.urgent') },
  ];

  // Assignee options
  const assigneeOptions = [
    { value: '', label: t('tasks.unassigned') },
    ...(teamMembers?.map(member => ({
      value: member.id,
      label: member.name || member.email || 'Unknown User',
    })) || []),
  ];

  // Handle form submission
  const onSubmit = async (data: TaskFormValues) => {
    try {
      if (isUpdating && task) {
        await updateTaskMutation.mutateAsync({
          id: task.id,
          ...data,
        });
      } else {
        await createTaskMutation.mutateAsync({
          ...data,
          created_by: currentUserId || '',
        });
      }
      onClose();
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  };

  // Get today's date formatted for input[type="date"]
  const getFormattedToday = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isUpdating ? t('tasks.editTask') : t('tasks.addTask')}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <div className="space-y-4">
            <Input
              label={t('tasks.title')}
              error={errors.title?.message}
              {...register('title')}
            />
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('tasks.description')}
              </label>
              <textarea
                id="description"
                rows={4}
                className={`input w-full ${
                  errors.description
                    ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                    : ''
                }`}
                {...register('description')}
              ></textarea>
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.description.message}
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('tasks.status')}
                </label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select
                      options={statusOptions}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      error={errors.status?.message}
                      icon={<FiAlertCircle />}
                    />
                  )}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('tasks.priority')}
                </label>
                <Controller
                  name="priority"
                  control={control}
                  render={({ field }) => (
                    <Select
                      options={priorityOptions}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      error={errors.priority?.message}
                      icon={<FiFlag />}
                    />
                  )}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('tasks.dueDate')}
                </label>
                <Controller
                  name="due_date"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="date"
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value || null)}
                      min={getFormattedToday()}
                      icon={<FiCalendar />}
                      error={errors.due_date?.message}
                    />
                  )}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('tasks.assignedTo')}
                </label>
                <Controller
                  name="assigned_to"
                  control={control}
                  render={({ field }) => (
                    <Select
                      options={assigneeOptions}
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value || null)}
                      error={errors.assigned_to?.message}
                      icon={<FiUser />}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            {t('common.cancel')}
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
            icon={isUpdating ? <FiCheck className="mr-2" /> : undefined}
          >
            {isUpdating ? t('common.update') : t('common.create')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskFormModal;