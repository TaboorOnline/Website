// src/shared/hooks/useSupabaseQuery.ts
import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '../../app/supabaseClient';

// Generic hook for querying data from Supabase
export function useSupabaseQuery<T = any>(
  key: string[],
  queryFn: () => Promise<{ data: T | null; error: PostgrestError | null }>,
  options?: Omit<UseQueryOptions<{ data: T | null; error: PostgrestError | null }, PostgrestError, T>, 'queryKey'>
) {
  return useQuery<{ data: T | null; error: PostgrestError | null }, PostgrestError, T>({
    queryKey: key,
    queryFn,
    select: (result: { data: T | null; error: PostgrestError | null }) => {
      if (result.error) {
        throw result.error;
      }
      return result.data as T;
    },
    ...options,
  });
}

// Generic hook for mutations with Supabase
export function useSupabaseMutation<TData = any, TVariables = any>(
  mutationFn: (variables: TVariables) => Promise<{ data: TData | null; error: PostgrestError | null }>,
  options?: UseMutationOptions<TData, PostgrestError, TVariables, unknown>
) {
  // const queryClient = useQueryClient();

  return useMutation<TData, PostgrestError, TVariables>({
    mutationFn: async (variables: TVariables) => {
      const result = await mutationFn(variables);
      if (result.error) {
        throw result.error;
      }
      return result.data as TData;
    },
    ...options,
  });
}

// Example of a more specific hook for a table
export function useServices(options?: UseQueryOptions<any, PostgrestError, any>) {
  return useSupabaseQuery(
    ['services'],
    async () => await supabase.from('services').select('*').order('order'),
    options
  );
}

export function useService(id: string, options?: UseQueryOptions<any, PostgrestError, any>) {
  return useSupabaseQuery(
    ['services', id],
    async () => await supabase.from('services').select('*').eq('id', id).single(),
    {
      enabled: !!id,
      ...options,
    }
  );
}

export function useCreateService() {
  const queryClient = useQueryClient();
  
  return useSupabaseMutation(
    async (newService) => await supabase.from('services').insert(newService),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['services'] });
      },
    }
  );
}

export function useUpdateService() {
  const queryClient = useQueryClient();
  
  return useSupabaseMutation(
    async ({ id, ...updates }: any) => await supabase.from('services').update(updates).eq('id', id),
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['services'] });
        queryClient.invalidateQueries({ queryKey: ['services', variables.id] });
      },
    }
  );
}

export function useDeleteService() {
  const queryClient = useQueryClient();
  
  return useSupabaseMutation(
    async (id: string) => await supabase.from('services').delete().eq('id', id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['services'] });
      },
    }
  );
}