// src/modules/dashboard/services/teamService.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../app/supabaseClient';
import { TeamMember } from '../../../shared/types/types';

// Fetch all team members
export const useTeamMembers = () => {
  return useQuery<TeamMember[]>({
    queryKey: ['teamMembers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('order');
      
      if (error) throw new Error(error.message);
      return data;
    },
  });
};

// Fetch a single team member by ID
export const useTeamMember = (id: string) => {
  return useQuery<TeamMember>({
    queryKey: ['teamMembers', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!id,
  });
};

// Create a new team member
export const useCreateTeamMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newMember: Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('team_members')
        .insert([newMember])
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamMembers'] });
    },
  });
};

// Update an existing team member
export const useUpdateTeamMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<TeamMember> & { id: string }) => {
      const { data, error } = await supabase
        .from('team_members')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['teamMembers'] });
      queryClient.invalidateQueries({ queryKey: ['teamMembers', variables.id] });
    },
  });
};

// Delete a team member
export const useDeleteTeamMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);
      
      if (error) throw new Error(error.message);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamMembers'] });
    },
  });
};

// Update team member order (reordering)
export const useUpdateTeamOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (orderedMembers: { id: string; order: number }[]) => {
      // Use Promise.all to perform multiple updates
      const promises = orderedMembers.map(({ id, order }) => 
        supabase
          .from('team_members')
          .update({ order })
          .eq('id', id)
      );
      
      await Promise.all(promises);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamMembers'] });
    },
  });
};