// src/shared/utils/theme.ts
import { Theme } from '../types/types';

// Helper functions to handle theme
export const setTheme = (theme: Theme) => {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  
  // Store theme preference
  localStorage.setItem('theme', theme);
};

export const getTheme = (): Theme => {
  const storedTheme = localStorage.getItem('theme') as Theme | null;
  
  if (storedTheme) {
    return storedTheme;
  }
  
  // Check if the user has dark mode preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
};

export const initTheme = () => {
  const theme = getTheme();
  setTheme(theme);
};

// Toggle function for the theme
export const toggleTheme = () => {
  const currentTheme = getTheme();
  const newTheme: Theme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
  return newTheme;
};