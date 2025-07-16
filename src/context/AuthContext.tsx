
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/firebase/config';
import { registerWithEmail, loginWithEmail, signInWithGoogle, logout as firebaseLogout } from '@/utils/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  register: typeof registerWithEmail;
  login: typeof loginWithEmail;
  googleSignIn: typeof signInWithGoogle;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  
  const logout = async () => {
    await firebaseLogout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    register: registerWithEmail,
    login: loginWithEmail,
    googleSignIn: signInWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
