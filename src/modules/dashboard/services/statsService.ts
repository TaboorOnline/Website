// src/modules/dashboard/services/statsService.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../app/supabaseClient';

// Page statistics interface
interface PageStats {
  path: string;
  pageViews: number;
  uniqueViews: number;
  avgTimeOnPage: number;
  bounceRate: number;
}

// Referrer interface
interface Referrer {
  source: string;
  visits: number;
  percentage: number;
}

// Statistics data interface
interface SiteStatisticsData {
  totalPageViews: number;
  totalUniqueVisitors: number;
  avgBounceRate: number;
  avgSessionDuration: number;
  pageViewsTrend: number;
  visitorsTrend: number;
  bounceRateTrend: number;
  sessionDurationTrend: number;
  topPages: PageStats[];
  referrers: Referrer[];
  dateRange: string;
}

// Fetch site statistics with date range filter
export const useSiteStatistics = (dateRange: '7days' | '30days' | '90days' | 'year' | 'all') => {
  return useQuery<SiteStatisticsData>({
    queryKey: ['siteStatistics', dateRange],
    queryFn: async () => {
      // Get the date for the start of the range
      const startDate = getStartDateForRange(dateRange);
      
      // In a real app, you would fetch data from your Supabase table based on the date range
      let query = supabase.from('site_statistics');
      
      if (dateRange !== 'all' && startDate) {
        query = query.gte('date', startDate.toISOString());
      }
      
      // This would fetch real data in a production environment
      // const { data, error } = await query.select('*').order('date', { ascending: false });
      // if (error) throw error;
      
      // Instead, we'll return mock data for demonstration
      return getMockStatisticsData(dateRange);
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Helper to get start date for a date range
const getStartDateForRange = (dateRange: '7days' | '30days' | '90days' | 'year' | 'all'): Date | null => {
  const now = new Date();
  
  switch (dateRange) {
    case '7days':
      return new Date(now.setDate(now.getDate() - 7));
    case '30days':
      return new Date(now.setDate(now.getDate() - 30));
    case '90days':
      return new Date(now.setDate(now.getDate() - 90));
    case 'year':
      return new Date(now.setFullYear(now.getFullYear() - 1));
    case 'all':
      return null;
    default:
      return new Date(now.setDate(now.getDate() - 30)); // Default to 30 days
  }
};

// Mock data generator for demonstration
const getMockStatisticsData = (dateRange: string): SiteStatisticsData => {
  // Generate random trends between -15% and +30%
  const randomTrend = () => Math.floor(Math.random() * 45) - 15;
  
  // Generate mock top pages
  const mockTopPages: PageStats[] = [
    {
      path: '/',
      pageViews: 12456,
      uniqueViews: 8734,
      avgTimeOnPage: 127, // seconds
      bounceRate: 42.3,
    },
    {
      path: '/services',
      pageViews: 8976,
      uniqueViews: 6543,
      avgTimeOnPage: 198,
      bounceRate: 38.7,
    },
    {
      path: '/about',
      pageViews: 5432,
      uniqueViews: 4321,
      avgTimeOnPage: 103,
      bounceRate: 51.2,
    },
    {
      path: '/blog',
      pageViews: 3987,
      uniqueViews: 2876,
      avgTimeOnPage: 234,
      bounceRate: 29.8,
    },
    {
      path: '/contact',
      pageViews: 2543,
      uniqueViews: 2098,
      avgTimeOnPage: 87,
      bounceRate: 61.4,
    },
  ];
  
  // Generate mock referrers
  const mockReferrers: Referrer[] = [
    {
      source: 'Google',
      visits: 15678,
      percentage: 42.3,
    },
    {
      source: 'Direct',
      visits: 9876,
      percentage: 26.7,
    },
    {
      source: 'Social Media',
      visits: 6543,
      percentage: 17.6,
    },
    {
      source: 'Referrals',
      visits: 3210,
      percentage: 8.7,
    },
    {
      source: 'Other',
      visits: 1765,
      percentage: 4.7,
    },
  ];
  
  // Return mock data
  return {
    totalPageViews: 45678,
    totalUniqueVisitors: 28765,
    avgBounceRate: 47.2,
    avgSessionDuration: 156, // seconds
    pageViewsTrend: randomTrend(),
    visitorsTrend: randomTrend(),
    bounceRateTrend: randomTrend(),
    sessionDurationTrend: randomTrend(),
    topPages: mockTopPages,
    referrers: mockReferrers,
    dateRange,
  };
};