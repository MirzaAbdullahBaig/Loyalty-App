import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, User } from '../types/auth';
import * as api from '../services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app start
    checkAuthSession();
  }, []);

  const checkAuthSession = async () => {
    try {
      // TODO: Check Supabase session
      setIsLoading(false);
    } catch (error) {
      console.error('Session check error:', error);
      setIsLoading(false);
    }
  };

  const signInWithEmailOtp = async (email: string) => {
    await api.signInWithEmailOtp(email);
  };

  const signInWithPhoneOtp = async (phone: string) => {
    await api.signInWithPhoneOtp(phone);
  };

  const verifyOtp = async (otp: string) => {
    const userData = await api.verifyOtp(otp);
    setUser(userData);
  };

  const signOut = async () => {
    await api.signOut();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signInWithEmailOtp,
    signInWithPhoneOtp,
    verifyOtp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};