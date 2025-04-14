// src/modules/dashboard/services/dashboardService.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../app/supabaseClient';

// Type for dashboard stats
interface DashboardStats {
  userCount: number;
  userTrend: number;
  serviceCount: number;
  pendingReviewCount: number;
  unreadMessageCount: number;
  messageTrend: number;
  // Additional statistics could be added here
}

export const useDashboardStats = () => {
  return useQuery<DashboardStats>({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      // Fetch stats from Supabase or your API
      const [usersResult, servicesResult, reviewsResult, messagesResult] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('services').select('*', { count: 'exact', head: true }),
        supabase.from('reviews').select('*', { count: 'exact' }).eq('approved', false),
        supabase.from('contact_messages').select('*', { count: 'exact' }).eq('read', false),
      ]);

      // Calculate some fake trends (in a real app, you would compute this from actual data)
      const userTrend = Math.floor(Math.random() * 30) - 10; // Random between -10% and +20%
      const messageTrend = Math.floor(Math.random() * 40) - 10; // Random between -10% and +30%

      return {
        userCount: usersResult.count || 0,
        userTrend,
        serviceCount: servicesResult.count || 0,
        pendingReviewCount: reviewsResult.count || 0,
        unreadMessageCount: messagesResult.count || 0,
        messageTrend,
      };
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};
