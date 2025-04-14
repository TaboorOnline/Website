
// src/shared/store/useDashboardStore.ts
import { create } from 'zustand';
import { TaskStatus, TaskPriority } from '../types/types';

interface DashboardState {
  // UI state
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  
  // Filters and search
  taskStatusFilter: TaskStatus | 'all';
  taskPriorityFilter: TaskPriority | 'all';
  searchQuery: string;
  
  // Selected items
  selectedTask: string | null;
  selectedService: string | null;
  selectedTeamMember: string | null;
  selectedBlogPost: string | null;
  selectedReview: string | null;
  
  // Actions
  toggleSidebar: () => void;
  toggleMobileMenu: () => void;
  setTaskStatusFilter: (status: TaskStatus | 'all') => void;
  setTaskPriorityFilter: (priority: TaskPriority | 'all') => void;
  setSearchQuery: (query: string) => void;
  setSelectedTask: (id: string | null) => void;
  setSelectedService: (id: string | null) => void;
  setSelectedTeamMember: (id: string | null) => void;
  setSelectedBlogPost: (id: string | null) => void;
  setSelectedReview: (id: string | null) => void;
  clearSelections: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  // UI state
  sidebarOpen: true,
  mobileMenuOpen: false,
  
  // Filters and search
  taskStatusFilter: 'all',
  taskPriorityFilter: 'all',
  searchQuery: '',
  
  // Selected items
  selectedTask: null,
  selectedService: null,
  selectedTeamMember: null,
  selectedBlogPost: null,
  selectedReview: null,
  
  // Actions
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
  setTaskStatusFilter: (status) => set({ taskStatusFilter: status }),
  setTaskPriorityFilter: (priority) => set({ taskPriorityFilter: priority }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedTask: (id) => set({ selectedTask: id }),
  setSelectedService: (id) => set({ selectedService: id }),
  setSelectedTeamMember: (id) => set({ selectedTeamMember: id }),
  setSelectedBlogPost: (id) => set({ selectedBlogPost: id }),
  setSelectedReview: (id) => set({ selectedReview: id }),
  clearSelections: () => set({
    selectedTask: null,
    selectedService: null,
    selectedTeamMember: null,
    selectedBlogPost: null,
    selectedReview: null,
  }),
}));