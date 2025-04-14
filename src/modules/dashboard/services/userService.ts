// src/modules/dashboard/services/userService.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../app/supabaseClient';
import { Role, Profile } from '../../../shared/types/types';

// Fetch all users with optional filter by role
export const useUsers = (role?: Role) => {
  return useQuery<Profile[]>({
    queryKey: ['users', { role }],
    queryFn: async () => {
      // Join auth.users to get email
      let query = supabase
        .from('profiles')
        .select(`
          id,
          email:auth_users(email),
          name,
          avatar_url,
          role,
          created_at,
          updated_at
        `)
        .order('created_at', { ascending: false });
      
      if (role) {
        query = query.eq('role', role);
      }
      
      const { data, error } = await query;
      
      if (error) throw new Error(error.message);
      
      // Transform the data to flatten the auth_users object
      return data.map(profile => ({
        ...profile,
        email: profile.email?.[0]?.email || '',
      }));
    },
  });
};

// Fetch a single user by ID
export const useUser = (id: string) => {
  return useQuery<Profile>({
    queryKey: ['users', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          email:auth_users(email),
          name,
          avatar_url,
          role,
          created_at,
          updated_at
        `)
        .eq('id', id)
        .single();
      
      if (error) throw new Error(error.message);
      
      return {
        ...data,
        email: data.email?.[0]?.email || '',
      };
    },
    enabled: !!id,
  });
};

// Create a new user
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ email, password, name, role, avatar_url }: {
      email: string;
      password: string;
      name: string;
      role: Role;
      avatar_url?: string;
    }) => {
      // First, create the user in Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
      
      if (authError) throw new Error(authError.message);
      
      if (!authData.user) {
        throw new Error('Failed to create user in Auth');
      }
      
      // Then, update the profile with additional info
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .update({
          name,
          role,
          avatar_url: avatar_url || null,
        })
        .eq('id', authData.user.id)
        .select()
        .single();
      
      if (profileError) throw new Error(profileError.message);
      
      return profileData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

// Update an existing user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, password, name, role, avatar_url }: {
      id: string;
      password?: string;
      name?: string;
      role?: Role;
      avatar_url?: string;
    }) => {
      // If password is provided, update it in Auth
      if (password) {
        const { error: authError } = await supabase.auth.admin.updateUserById(
          id,
          { password }
        );
        
        if (authError) throw new Error(authError.message);
      }
      
      // Update profile information
      const updates: any = {};
      if (name !== undefined) updates.name = name;
      if (role !== undefined) updates.role = role;
      if (avatar_url !== undefined) updates.avatar_url = avatar_url;
      
      if (Object.keys(updates).length > 0) {
        const { data, error } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw new Error(error.message);
        return data;
      }
      
      return { id };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', variables.id] });
    },
  });
};

// Delete a user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      // Delete the user in Auth (cascade delete will take care of profile)
      const { error } = await supabase.auth.admin.deleteUser(id);
      
      if (error) throw new Error(error.message);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

// Get current user profile
export const useCurrentUserProfile = () => {
  return useQuery<Profile>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('No authenticated user');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw new Error(error.message);
      return {
        ...data,
        email: user.email || '',
      };
    },
  });
};