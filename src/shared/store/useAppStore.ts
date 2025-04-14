// src/shared/store/useAppStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Language, Theme, Role } from '../types/types';

interface AppState {
  language: Language;
  theme: Theme;
  user: {
    id: string | null;
    email: string | null;
    role: Role | null;
  };
  isAuthenticated: boolean;
  notifications: {
    count: number;
    items: Array<{
      id: string;
      title: string;
      message: string;
      read: boolean;
      date: string;
    }>;
  };
  
  // Actions
  setLanguage: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  setUser: (user: AppState['user']) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  clearUser: () => void;
  addNotification: (notification: Omit<AppState['notifications']['items'][0], 'id' | 'read' | 'date'>) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      language: 'en',
      theme: 'light',
      user: {
        id: null,
        email: null,
        role: null,
      },
      isAuthenticated: false,
      notifications: {
        count: 0,
        items: [],
      },
      
      // Actions
      setLanguage: (lang) => set({ language: lang }),
      setTheme: (theme) => set({ theme }),
      setUser: (user) => set({ user, isAuthenticated: !!user.id }),
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      clearUser: () => set({ 
        user: { 
          id: null, 
          email: null, 
          role: null 
        },
        isAuthenticated: false
      }),
      addNotification: (notification) => 
        set((state) => ({
          notifications: {
            count: state.notifications.count + 1,
            items: [
              {
                id: crypto.randomUUID(),
                ...notification,
                read: false,
                date: new Date().toISOString(),
              },
              ...state.notifications.items,
            ],
          },
        })),
      markNotificationAsRead: (id) =>
        set((state) => ({
          notifications: {
            count: state.notifications.count - 1,
            items: state.notifications.items.map((item) =>
              item.id === id ? { ...item, read: true } : item
            ),
          },
        })),
      clearNotifications: () =>
        set({
          notifications: {
            count: 0,
            items: [],
          },
        }),
    }),
    {
      name: 'hilal-tech-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        language: state.language,
        theme: state.theme,
        // Don't persist sensitive information
        // user: state.user,
        // isAuthenticated: state.isAuthenticated,
        // notifications: state.notifications,
      }),
    }
  )
);
