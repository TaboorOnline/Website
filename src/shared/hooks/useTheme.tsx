// src/shared/hooks/useTheme.ts
import { useState, useEffect } from 'react';
import  { Theme }  from '../types/types';
import { getTheme, setTheme, toggleTheme as toggleThemeUtil } from '../utils/theme';

export const useTheme = () => {
  const [theme, setThemeState] = useState<Theme>(getTheme());
  
  const toggleTheme = () => {
    const newTheme = toggleThemeUtil();
    setThemeState(newTheme);
  };
  
  const updateTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    setThemeState(newTheme);
  };
  
  // Initialize theme on component mount
  useEffect(() => {
    setThemeState(getTheme());
  }, []);
  
  return { theme, toggleTheme, updateTheme };
};