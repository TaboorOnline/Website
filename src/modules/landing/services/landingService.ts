// src/modules/landing/services/landingService.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../app/supabaseClient';
import { Service, TeamMember, Project, CompanyHistory } from '../../../shared/types/types';

// Get all services
export const useServices = () => {
  return useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('order');
      
      if (error) throw new Error(error.message);
      return data as Service[];
    },
  });
};

// Get featured services
export const useFeaturedServices = () => {
  return useQuery({
    queryKey: ['featuredServices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('featured', true)
        .order('order');
      
      if (error) throw new Error(error.message);
      return data as Service[];
    },
  });
};

// Get all team members
export const useTeamMembers = () => {
  return useQuery({
    queryKey: ['team'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('order');
      
      if (error) throw new Error(error.message);
      return data as TeamMember[];
    },
  });
};

// Get all projects
export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('year', { ascending: false });
      
      if (error) throw new Error(error.message);
      return data as Project[];
    },
  });
};

// Get company history
export const useCompanyHistory = () => {
  return useQuery({
    queryKey: ['companyHistory'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('company_history')
        .select('*')
        .order('year', { ascending: false });
      
      if (error) throw new Error(error.message);
      return data as CompanyHistory[];
    },
  });
};