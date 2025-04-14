
// src/modules/dashboard/services/messageService.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../app/supabaseClient';
import { ContactMessage } from '../../../shared/types/types';

// Fetch all messages
export const useMessages = (read?: boolean, archived?: boolean) => {
  return useQuery<ContactMessage[]>({
    queryKey: ['messages', { read, archived }],
    queryFn: async () => {
      let query = supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (read !== undefined) {
        query = query.eq('read', read);
      }
      
      if (archived !== undefined) {
        query = query.eq('archived', archived);
      }
      
      const { data, error } = await query;
      
      if (error) throw new Error(error.message);
      return data;
    },
  });
};

// Fetch recent messages
export const useRecentMessages = (limit?: number) => {
  return useQuery<ContactMessage[]>({
    queryKey: ['recentMessages', limit],
    queryFn: async () => {
      let query = supabase
        .from('contact_messages')
        .select('*')
        .eq('archived', false)
        .order('created_at', { ascending: false });
      
      if (limit) {
        query = query.limit(limit);
      }
      
      const { data, error } = await query;
      
      if (error) throw new Error(error.message);
      return data;
    },
  });
};

// Fetch a single message by ID
export const useMessage = (id: string) => {
  return useQuery<ContactMessage>({
    queryKey: ['messages', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!id,
  });
};

// Mark a message as read
export const useMarkMessageAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('contact_messages')
        .update({ read: true })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['recentMessages'] });
      queryClient.invalidateQueries({ queryKey: ['messages', variables] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
  });
};

// Archive a message
export const useArchiveMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('contact_messages')
        .update({ archived: true })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['recentMessages'] });
    },
  });
};

// Delete a message
export const useDeleteMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);
      
      if (error) throw new Error(error.message);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['recentMessages'] });
    },
  });
};