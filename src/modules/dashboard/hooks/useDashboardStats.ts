// src/modules/dashboard/hooks/useDashboardStats.ts
import { useQuery } from '@tanstack/react-query';
// import { supabase } from '../../../app/supabaseClient';

interface StatsCount {
  total: number;
  trend: number; // percentage change
}

interface DashboardStats {
  visitors: StatsCount;
  reviews: StatsCount;
  messages: StatsCount;
  conversionRate: {
    value: number; // percentage
    trend: number; // percentage change
  };
  visitorsChart: Array<{
    name: string;
    visitors: number;
  }>;
  trafficSources: Array<{
    name: string;
    value: number;
  }>;
  popularPages: Array<{
    name: string;
    views: number;
  }>;
  recentReviews: Array<{
    name: string;
    rating: number;
    comment: string;
    date: string;
  }>;
  recentMessages: Array<{
    name: string;
    message: string;
    time: string;
  }>;
}

export const useDashboardStats = (timeRange: 'week' | 'month' | 'year' = 'month') => {
  return useQuery<DashboardStats, Error>({
    queryKey: ['dashboardStats', timeRange],
    queryFn: async () => {
      // In a real app, this would fetch from Supabase
      // Here we'll simulate the API call with mock data
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate random trend between -20 and 50
      const randomTrend = () => Math.floor(Math.random() * 70) - 20;
      
      // Generate chart data based on time range
      const generateChartData = () => {
        let labels: string[] = [];
        
        if (timeRange === 'week') {
          labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        } else if (timeRange === 'month') {
          labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        } else {
          labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        }
        
        return labels.map(name => ({
          name,
          visitors: Math.floor(Math.random() * 1000) + 500,
        }));
      };
      
      return {
        visitors: {
          total: Math.floor(Math.random() * 10000) + 5000,
          trend: randomTrend(),
        },
        reviews: {
          total: Math.floor(Math.random() * 100) + 50,
          trend: randomTrend(),
        },
        messages: {
          total: Math.floor(Math.random() * 50) + 10,
          trend: randomTrend(),
        },
        conversionRate: {
          value: Math.floor(Math.random() * 10) + 2,
          trend: randomTrend(),
        },
        visitorsChart: generateChartData(),
        trafficSources: [
          { name: 'Direct', value: Math.floor(Math.random() * 1000) + 500 },
          { name: 'Organic', value: Math.floor(Math.random() * 1000) + 500 },
          { name: 'Referral', value: Math.floor(Math.random() * 500) + 100 },
          { name: 'Social', value: Math.floor(Math.random() * 300) + 50 },
        ],
        popularPages: [
          { name: '/', views: Math.floor(Math.random() * 1000) + 500 },
          { name: '/services', views: Math.floor(Math.random() * 800) + 300 },
          { name: '/about', views: Math.floor(Math.random() * 600) + 200 },
          { name: '/blog/top-web-development-trends', views: Math.floor(Math.random() * 400) + 100 },
          { name: '/contact', views: Math.floor(Math.random() * 300) + 50 },
        ],
        recentReviews: [
          {
            name: 'John Doe',
            rating: 5,
            comment: 'Outstanding service and exceptional results. Very satisfied with the work!',
            date: '2 days ago',
          },
          {
            name: 'Sarah Smith',
            rating: 4,
            comment: 'Great team, responsive and professional. Would recommend.',
            date: '5 days ago',
          },
          {
            name: 'Mohammed Ali',
            rating: 5,
            comment: 'Excellent work on our website, it exceeded our expectations.',
            date: '1 week ago',
          },
        ],
        recentMessages: [
          {
            name: 'Alex Johnson',
            message: 'I would like to inquire about your custom web development services.',
            time: '2 hours ago',
          },
          {
            name: 'Fatima Al-Qasimi',
            message: 'Can you provide a quote for an e-commerce website?',
            time: 'Yesterday',
          },
          {
            name: 'Richard Miller',
            message: 'Thank you for the proposal. I have a few questions about the timeline.',
            time: '2 days ago',
          },
        ],
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};