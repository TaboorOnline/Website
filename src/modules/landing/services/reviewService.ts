// src/modules/landing/services/reviewService.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../app/supabaseClient';
import { Review } from '../../../shared/types/types';

// Get approved reviews
export const useReviews = () => {
  return useQuery({
    queryKey: ['reviews'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('approved', true)
        .order('created_at', { ascending: false });
      
      if (error) throw new Error(error.message);
      return data as Review[];
    },
  });
};

// Submit a new review
export const useSubmitReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (reviewData: Omit<Review, 'id' | 'created_at' | 'updated_at' | 'approved'>) => {
      const { data, error } = await supabase
        .from('reviews')
        .insert([{ ...reviewData, approved: false }]);
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
};