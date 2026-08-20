'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check active sessions and sets the user
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await fetchUserProfile(session.user);
      } else {
        setLoading(false);
      }
    };
    
    checkSession();

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        await fetchUserProfile(session.user);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('user');
        setLoading(false);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (authUser) => {
    try {
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profile) {
        const userData = { id: authUser.id, ...profile };
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        let role = 'parent';
        const lowerEmail = authUser.email.toLowerCase();
        if (lowerEmail.includes('admin')) role = 'admin';
        else if (lowerEmail.includes('teacher')) role = 'teacher';
        else if (lowerEmail.includes('student')) role = 'student';
        
        const defaultUser = { id: authUser.id, email: authUser.email, role };
        setUser(defaultUser);
        setIsAuthenticated(true);
      }
    } catch (e) {
      console.error("Error fetching user profile", e);
    } finally {
      setLoading(false);
    }
  };

  const login = useCallback(async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();
        
      let role = 'parent';
      const lowerEmail = data.user.email.toLowerCase();
      if (lowerEmail.includes('admin')) role = 'admin';
      else if (lowerEmail.includes('teacher')) role = 'teacher';
      else if (lowerEmail.includes('student')) role = 'student';

      let userData = { id: data.user.id, email: data.user.email, role };
      if (profile) {
        userData = { id: data.user.id, ...profile, role: profile.role || role };
      }
      
      setUser(userData);
      setIsAuthenticated(true);
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }, []);

  const register = useCallback(async (userData) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });
      
      if (error) throw error;
      if (!data.user) throw new Error("Registration failed");
      
      const newUser = {
        id: data.user.id,
        email: userData.email,
        name: userData.name,
        role: userData.role || 'parent',
        phone: userData.phone || '',
        created_at: new Date().toISOString()
      };

      const { error: insertError } = await supabase
        .from('users')
        .insert([newUser]);
        
      if (insertError && insertError.code !== '23505') {
        console.error("Error creating user profile", insertError);
      }
      
      setUser(newUser);
      setIsAuthenticated(true);
      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  }, []);

  const refreshUser = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await fetchUserProfile(session.user);
    }
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
