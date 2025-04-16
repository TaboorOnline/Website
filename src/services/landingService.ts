import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Service, TeamMember } from '../types/types';
import servicesData from '../data/services.json';
import teamMembersData from '../data/team_members.json';
import projectsData from '../data/projects.json';


interface Project {
  slug: string | number;
  image_url: string | undefined;
  category: string;
  client: React.ReactNode | Iterable<React.ReactNode>;
  tags: boolean;
  title: string | undefined;
  translations: Record<"ar" | "en", { title?: string | undefined; description?: string | undefined; }>;
  id: number | string; 
  name: string;        
  year: number;
  description?: string;
}

export const useServices = () => {
  return useQuery({
    queryKey: ['services'],
    queryFn: () => {
      const services = (servicesData.services as unknown as Service[]) || [];
      return services.sort((a, b) => a.order - b.order);
    },
  });
};

export const useFeaturedServices = () => {
  return useQuery({
    queryKey: ['featuredServices'],
    queryFn: () => {
      const services = (servicesData.services as unknown as Service[]) || [];
      return services
        .filter(service => service.featured)
        .sort((a, b) => a.order - b.order);
    },
  });
};

export const useTeamMembers = () => {
  return useQuery({
    queryKey: ['team'],
    queryFn: () => {
      const members = (teamMembersData.team_members as unknown as TeamMember[]) || [];
      return members.sort((a, b) => a.order - b.order);
    },
  });
};

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: () => {
      const projects = (projectsData.projects as unknown as Project[]) || [];
      return projects.sort((a, b) => b.year - a.year);
    }
  });
};
