'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useClientAuth, User } from './useClientAuth';

// Define types for our context
type AuthContextType = {
  user: User;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
};

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  clearError: () => {},
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading: authLoading, signIn, signUp, signOut } = useClientAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Clear error function
  const clearError = () => setError(null);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Attempting login...');
      const result = await signIn(email, password);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      console.log('Login successful, redirecting to dashboard...');
      router.push('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (email: string, password: string, name?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Starting registration in AuthContext...');
      const result = await signUp(email, password, name);
      
      if (!result.success) {
        console.error('Registration failed:', result.error);
        throw new Error(result.error);
      }
      
      console.log('Registration successful, attempting login...');
      // After registration, log the user in
      await login(email, password);
    } catch (err) {
      console.error('Registration error in AuthContext:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Attempting logout...');
      const result = await signOut();
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      console.log('Logout successful, redirecting to login...');
      router.push('/login');
    } catch (err) {
      console.error('Logout error:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading: loading || authLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 