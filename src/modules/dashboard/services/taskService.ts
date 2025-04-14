// src/modules/dashboard/services/taskService.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../app/supabaseClient';
import { Task, TaskStatus, TaskPriority } from '../../../shared/types/types';
import { getCurrentUser } from '../../../app/supabaseClient';

// Fetch tasks with filtering
export const useTasks = (filters?: {
  status?: TaskStatus;
  priority?: TaskPriority;
  assignee?: 'all' | 'me' | 'unassigned';
}) => {
  return useQuery<Task[]>({
    queryKey: ['tasks', filters],
    queryFn: async () => {
      let query = supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Apply status filter
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      
      // Apply priority filter
      if (filters?.priority) {
        query = query.eq('priority', filters.priority);
      }
      
      // Apply assignee filter
      if (filters?.assignee === 'me') {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          query = query.eq('assigned_to', currentUser.id);
        }
      } else if (filters?.assignee === 'unassigned') {
        query = query.is('assigned_to', null);
      }
      
      const { data, error } = await query;
      
      if (error) throw new Error(error.message);
      return data;
    },
  });
};

// Get a single task by ID
export const useTask = (id: string) => {
  return useQuery<Task>({
    queryKey: ['tasks', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!id,
  });
};

// Create a new task
export const useCreateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newTask: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('tasks')
        .insert([newTask])
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

// Update an existing task
export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Task> & { id: string }) => {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.id] });
    },
  });
};

// Update task status
export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: TaskStatus }) => {
      const { data, error } = await supabase
        .from('tasks')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

// Delete a task
export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
      
      if (error) throw new Error(error.message);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

// Get task statistics
export const useTaskStats = () => {
  return useQuery({
    queryKey: ['taskStats'],
    queryFn: async () => {
      const currentUser = await getCurrentUser();
      
      // Get counts for each status
      const [todoRes, inProgressRes, reviewRes, completedRes, assignedRes] = await Promise.all([
        supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('status', 'todo'),
        supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('status', 'in_progress'),
        supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('status', 'review'),
        supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
        currentUser
          ? supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('assigned_to', currentUser.id)
          : { count: 0 },
      ]);
      
      return {
        todoCount: todoRes.count || 0,
        inProgressCount: inProgressRes.count || 0,
        reviewCount: reviewRes.count || 0,
        completedCount: completedRes.count || 0,
        assignedToMeCount: assignedRes.count || 0,
        totalCount: (todoRes.count || 0) + (inProgressRes.count || 0) + (reviewRes.count || 0) + (completedRes.count || 0),
      };
    },
  });
};

// Get team members for task assignment
export const useTeamMembers = () => {
  return useQuery({
    queryKey: ['teamForTasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email, role')
        .order('name');
      
      if (error) throw new Error(error.message);
      return data;
    },
  });
};