// src/hooks/useAuth.tsx
import { useState, useEffect, createContext, useContext } from 'react';
import { Session } from '@supabase/supabase-js';
import { checkAuth, signIn, signOut } from '../lib/supabase';

interface AuthContextType {
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<Session | null>;
  logout: () => Promise<boolean>;
}

// إنشاء سياق المصادقة
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// مزود سياق المصادقة
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const currentSession = await checkAuth();
        setSession(currentSession);
      } catch (error) {
        console.error('Error loading session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, []);

  // دالة تسجيل الدخول
  const login = async (email: string, password: string) => {
    try {
      const newSession = await signIn(email, password);
      setSession(newSession);
      return newSession;
    } catch (error) {
      console.error('Error during sign in:', error);
      return null;
    }
  };

  // دالة تسجيل الخروج
  const logout = async () => {
    try {
      const success = await signOut();
      if (success) {
        setSession(null);
      }
      return success;
    } catch (error) {
      console.error('Error during sign out:', error);
      return false;
    }
  };

  const value = {
    session,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook لاستخدام سياق المصادقة
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};