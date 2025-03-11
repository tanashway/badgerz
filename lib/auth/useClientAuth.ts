'use client';

import { useState, useEffect } from 'react';
import { createClientSupabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export type User = {
  id: string;
  email: string;
  name?: string;
} | null;

export function useClientAuth() {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientSupabase();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      console.log('Fetching initial session...');
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        console.log('Session found, setting user data');
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name,
        });
      } else {
        console.log('No session found');
      }
      
      setLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event);
        if (session?.user) {
          console.log('Setting user data from auth state change');
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name,
          });
        } else {
          console.log('Clearing user data from auth state change');
          setUser(null);
        }
        
        setLoading(false);
        router.refresh();
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting to sign in with Supabase...');
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Supabase sign in error:', error);
        throw error;
      }
      
      console.log('Supabase sign in successful');
      return { success: true };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to sign in' 
      };
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      console.log('Attempting to sign up with Supabase...', { email, name });
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });

      if (error) {
        console.error('Supabase sign up error:', error);
        throw error;
      }
      
      console.log('Supabase sign up successful');
      return { success: true };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to sign up' 
      };
    }
  };

  const signOut = async () => {
    try {
      console.log('Attempting to sign out with Supabase...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Supabase sign out error:', error);
        throw error;
      }
      
      console.log('Supabase sign out successful');
      return { success: true };
    } catch (error: any) {
      console.error('Sign out error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to sign out' 
      };
    }
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };
} 