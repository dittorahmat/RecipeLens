
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth'; // Removed getRedirectResult import
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithRedirect } from 'firebase/auth';

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Rely solely on onAuthStateChanged for auth state
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // <<< ADDED/MODIFIED LOGGING HERE >>>
      console.log('Auth State Changed:', currentUser); // Log the user object (or null)
      setUser(currentUser);
      setLoading(false); // Set loading false *after* auth state is determined
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []); // Empty dependency array ensures this runs once on mount

  const signInWithGoogle = async () => {
    // Set loading to true *before* initiating redirect
    // Note: The page will reload, so this loading state is short-lived
    // but might be useful if redirect initiation fails.
    setLoading(true);
    try {
      await signInWithRedirect(auth, googleProvider);
      // Redirect occurs; state updates are handled by onAuthStateChanged after redirect
    } catch (error) {
      console.error("Error initiating sign in with Google redirect: ", error);
      setLoading(false); // Reset loading state if redirect initiation fails
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      // onAuthStateChanged will set user to null and loading to false
    } catch (error) {
      console.error("Error signing out: ", error);
      setLoading(false); // Reset loading state on sign-out error
    }
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
