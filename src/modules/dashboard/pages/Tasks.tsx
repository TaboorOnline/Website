// src/modules/dashboard/pages/Tasks.tsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiPlus, FiFilter, FiCheck, FiClock, FiClipboard, FiAlertCircle, FiEdit2, FiTrash2 } from 'react-icons/fi';
import DashboardHeader from '../components/DashboardHeader';
import Button from '../../../shared/components/Button';
import Card from '../../../shared/components/Card';
import Select from '../../../shared/components/Select';
import EmptyState from '../components/EmptyState';
import { useTasks, useUpdateTaskStatus, useDeleteTask } from '../services/taskService';
import { Task, TaskStatus, TaskPriority } from '../../../shared/types/types';
import TaskFormModal from '../components/TaskFormModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
// import { getCurrentUser } from '../../../app/supabaseClient';

const Tasks = () => {
  const { t } = useTranslation();
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<'all' | 'me' | 'unassigned'>('all');
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  // Fetch tasks
  const { data: tasks, isLoading, error } = useTasks({
    status: statusFilter !== 'all' ? statusFilter : undefined,
    priority: priorityFilter !== 'all' ? priorityFilter : undefined,
    assignee: assigneeFilter,
  });
  
  // Task mutations
  const updateTaskStatusMutation = useUpdateTaskStatus();
  const deleteTaskMutation = useDeleteTask();
  
  // Status filter options
  const statusOptions = [
    { value: 'all', label: t('tasks.allStatus') },
    { value: 'todo', label: t('tasks.statuses.todo') },
    { value: 'in_progress', label: t('tasks.statuses.in_progress') },
    { value: 'review', label: t('tasks.statuses.review') },
    { value: 'completed', label: t('tasks.statuses.completed') },
  ];
  
  // Priority filter options
  const priorityOptions = [
    { value: 'all', label: t('tasks.allPriorities') },
    { value: 'low', label: t('tasks.priorities.low') },
    { value: 'medium', label: t('tasks.priorities.medium') },
    { value: 'high', label: t('tasks.priorities.high') },
    { value: 'urgent', label: t('tasks.priorities.urgent') },
  ];
  
  // Assignee filter options
  const assigneeOptions = [
    { value: 'all', label: t('tasks.allAssignees') },
    { value: 'me', label: t('tasks.assignedToMe') },
    { value: 'unassigned', label: t('tasks.unassigned') },
  ];
  
  // Handle task creation
  const handleCreateTask = () => {
    setSelectedTask(null);
    setIsCreateModalOpen(true);
  };
  
  // Handle task editing
  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };
  
  // Handle task deletion
  const handleDeleteTask = (task: Task) => {
    setSelectedTask(task);
    setIsDeleteModalOpen(true);
  };
  
  // Confirm task deletion
  const handleDeleteConfirm = async () => {
    if (!selectedTask) return;
    
    try {
      await deleteTaskMutation.mutateAsync(selectedTask.id);
      setIsDeleteModalOpen(false);
      setSelectedTask(null);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };
  
  // Handle status change
  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    try {
      await updateTaskStatusMutation.mutateAsync({ id: taskId, status: newStatus });
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };
  
  // Format due date
  const formatDueDate = (dateString: string | null) => {
    if (!dateString) return null;
    
    const dueDate = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    const isToday = dueDate.toDateString() === today.toDateString();
    const isTomorrow = dueDate.toDateString() === tomorrow.toDateString();
    const isPast = dueDate < today;
    
    const formattedDate = dueDate.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
    
    if (isToday) {
      return { label: t('tasks.today'), isPast: false, className: 'text-blue-600 dark:text-blue-400' };
    } else if (isTomorrow) {
      return { label: t('tasks.tomorrow'), isPast: false, className: 'text-green-600 dark:text-green-400' };
    } else if (isPast) {
      return { label: formattedDate, isPast: true, className: 'text-red-600 dark:text-red-400' };
    }
    
    return { label: formattedDate, isPast: false, className: 'text-gray-600 dark:text-gray-400' };
  };
  
  // Get color for priority
  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'low':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400';
      case 'medium':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400';
      case 'high':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400';
      case 'urgent':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400';
    }
  };
  
  // Get icon for status
  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'todo':
        return <FiClipboard />;
      case 'in_progress':
        return <FiClock className="text-blue-600 dark:text-blue-400" />;
      case 'review':
        return <FiAlertCircle className="text-yellow-600 dark:text-yellow-400" />;
      case 'completed':
        return <FiCheck className="text-green-600 dark:text-green-400" />;
      default:
        return <FiClipboard />;
    }
  };
  
  // Group tasks by status
  const groupedTasks = {
    todo: tasks?.filter(task => task.status === 'todo') || [],
    in_progress: tasks?.filter(task => task.status === 'in_progress') || [],
    review: tasks?.filter(task => task.status === 'review') || [],
    completed: tasks?.filter(task => task.status === 'completed') || [],
  };
  
  // Check if no tasks match the filters
  const noTasksFound = !isLoading && tasks && tasks.length === 0;

  return (
    <div>
      <DashboardHeader
        title={t('tasks.title')}
        subtitle={t('tasks.subtitle')}
        actions={
          <Button
            onClick={handleCreateTask}
            icon={<FiPlus className="mr-2" />}
          >
            {t('tasks.addTask')}
          </Button>
        }
      />
      
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Select
          options={statusOptions}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as TaskStatus | 'all')}
          icon={<FiFilter />}
          label={t('tasks.filterByStatus')}
        />
        
        <Select
          options={priorityOptions}
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as TaskPriority | 'all')}
          icon={<FiFilter />}
          label={t('tasks.filterByPriority')}
        />
        
        <Select
          options={assigneeOptions}
          value={assigneeFilter}
          onChange={(e) => setAssigneeFilter(e.target.value as 'all' | 'me' | 'unassigned')}
          icon={<FiFilter />}
          label={t('tasks.filterByAssignee')}
        />
      </div>
      
      {error ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {t('errors.failedToLoadTasks')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {t('errors.tryAgainLater')}
          </p>
          <Button onClick={() => window.location.reload()}>
            {t('common.refresh')}
          </Button>
        </div>
      ) : noTasksFound ? (
        <EmptyState
          title={t('tasks.noTasks')}
          message={t('tasks.noTasksDescription')}
          icon={<FiClipboard className="w-12 h-12 text-gray-400" />}
          actionLabel={t('tasks.addTask')}
          onAction={handleCreateTask}
        />
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* To Do Column */}
          <Card
            title={`${t('tasks.statuses.todo')} (${groupedTasks.todo.length})`}
            className="overflow-hidden h-full"
          >
            <div className="max-h-[600px] overflow-y-auto">
              {isLoading ? (
                <div className="animate-pulse space-y-4 p-2">
                  {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 h-32"></div>
                  ))}
                </div>
              ) : groupedTasks.todo.length === 0 ? (
                <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                  {t('tasks.noTasksInStatus')}
                </div>
              ) : (
                <div className="space-y-4 p-2">
                  {groupedTasks.todo.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      formatDueDate={formatDueDate}
                      getPriorityColor={getPriorityColor}
                      onStatusChange={handleStatusChange}
                      onEdit={handleEditTask}
                      onDelete={handleDeleteTask}
                    />
                  ))}
                </div>
              )}
            </div>
          </Card>
          
          {/* In Progress Column */}
          <Card
            title={`${t('tasks.statuses.in_progress')} (${groupedTasks.in_progress.length})`}
            className="overflow-hidden h-full"
          >
            <div className="max-h-[600px] overflow-y-auto">
              {isLoading ? (
                <div className="animate-pulse space-y-4 p-2">
                  {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 h-32"></div>
                  ))}
                </div>
              ) : groupedTasks.in_progress.length === 0 ? (
                <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                  {t('tasks.noTasksInStatus')}
                </div>
              ) : (
                <div className="space-y-4 p-2">
                  {groupedTasks.in_progress.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      formatDueDate={formatDueDate}
                      getPriorityColor={getPriorityColor}
                      onStatusChange={handleStatusChange}
                      onEdit={handleEditTask}
                      onDelete={handleDeleteTask}
                    />
                  ))}
                </div>
              )}
            </div>
          </Card>
          
          {/* Review Column */}
          <Card
            title={`${t('tasks.statuses.review')} (${groupedTasks.review.length})`}
            className="overflow-hidden h-full"
          >
            <div className="max-h-[600px] overflow-y-auto">
              {isLoading ? (
                <div className="animate-pulse space-y-4 p-2">
                  {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 h-32"></div>
                  ))}
                </div>
              ) : groupedTasks.review.length === 0 ? (
                <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                  {t('tasks.noTasksInStatus')}
                </div>
              ) : (
                <div className="space-y-4 p-2">
                  {groupedTasks.review.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      formatDueDate={formatDueDate}
                      getPriorityColor={getPriorityColor}
                      onStatusChange={handleStatusChange}
                      onEdit={handleEditTask}
                      onDelete={handleDeleteTask}
                    />
                  ))}
                </div>
              )}
            </div>
          </Card>
          
          {/* Completed Column */}
          <Card
            title={`${t('tasks.statuses.completed')} (${groupedTasks.completed.length})`}
            className="overflow-hidden h-full"
          >
            <div className="max-h-[600px] overflow-y-auto">
              {isLoading ? (
                <div className="animate-pulse space-y-4 p-2">
                  {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 h-32"></div>
                  ))}
                </div>
              ) : groupedTasks.completed.length === 0 ? (
                <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                  {t('tasks.noTasksInStatus')}
                </div>
              ) : (
                <div className="space-y-4 p-2">
                  {groupedTasks.completed.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      formatDueDate={formatDueDate}
                      getPriorityColor={getPriorityColor}
                      onStatusChange={handleStatusChange}
                      onEdit={handleEditTask}
                      onDelete={handleDeleteTask}
                    />
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
      
      {/* Create/Edit Task Modals */}
      <TaskFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        task={null}
      />
      
      <TaskFormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
      />
      
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setSelectedTask(null);
        }}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteTaskMutation.status === 'pending'}
        title={t('tasks.deleteTask')}
        message={t('tasks.deleteTaskConfirmation', { title: selectedTask?.title })}
      />
    </div>
  );
};

// Task Card Component
interface TaskCardProps {
  task: Task;
  formatDueDate: (dateString: string | null) => { label: string; isPast: boolean; className: string } | null;
  getPriorityColor: (priority: TaskPriority) => string;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const TaskCard = ({ task, formatDueDate, getPriorityColor, onStatusChange, onEdit, onDelete }: TaskCardProps) => {
  const { t } = useTranslation();
  const { title, description, priority, due_date, assigned_to } = task;
  const dueDate = formatDueDate(due_date);
  
  // Status options based on current status
  const getNextStatus = (): TaskStatus => {
    switch (task.status) {
      case 'todo':
        return 'in_progress';
      case 'in_progress':
        return 'review';
      case 'review':
        return 'completed';
      case 'completed':
        return 'todo'; // Reset if already completed
      default:
        return 'in_progress';
    }
  };
  
  const getNextStatusLabel = (): string => {
    switch (task.status) {
      case 'todo':
        return t('tasks.markInProgress');
      case 'in_progress':
        return t('tasks.markInReview');
      case 'review':
        return t('tasks.markCompleted');
      case 'completed':
        return t('tasks.markTodo');
      default:
        return t('tasks.markInProgress');
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-medium text-gray-900 dark:text-white line-clamp-1">{title}</h3>
        <div className="flex space-x-1">
          <button
            onClick={() => onEdit(task)}
            className="p-1 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
            title={t('common.edit')}
          >
            <FiEdit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(task)}
            className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
            title={t('common.delete')}
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </div>
      
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">{description}</p>
      
      <div className="flex justify-between items-center mb-3">
        <span className={`px-2 py-0.5 text-xs rounded-full ${getPriorityColor(priority)}`}>
          {t(`tasks.priorities.${priority}`)}
        </span>
        
        {dueDate && (
          <div className="flex items-center">
            <FiClock size={14} className={dueDate.className} />
            <span className={`ml-1 text-xs ${dueDate.className} ${dueDate.isPast ? 'font-medium' : ''}`}>
              {dueDate.label}
            </span>
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {assigned_to ? 
            t('tasks.assignedTo', { name: 'User' }) : // Replace with actual user name when available
            t('tasks.unassigned')
          }
        </div>
        
        <button
          onClick={() => onStatusChange(task.id, getNextStatus())}
          className="text-xs bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
        >
          {getNextStatusLabel()}
        </button>
      </div>
    </div>
  );
};

export default Tasks;