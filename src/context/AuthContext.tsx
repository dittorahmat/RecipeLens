
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  signInWithPopup, // Import signInWithPopup
  UserCredential
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
// Removed signInWithRedirect and getRedirectResult imports as they are no longer used for the primary flow

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

  // Effect for the primary auth state listener remains the same
  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('Auth State Changed:', currentUser);
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Sign in function now uses signInWithPopup
  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      console.log('Attempting sign in with Google Popup...');
      const result: UserCredential = await signInWithPopup(auth, googleProvider);
      console.log('signInWithPopup successful:', result?.user);
      // onAuthStateChanged should automatically pick up the user state now
      // No need to setLoading(false) here, as onAuthStateChanged handles it
    } catch (error: any) {
      // Handle Errors here.
      console.error("Error during sign in with Google popup: ", error.code, error.message);
      // Check for specific popup errors
      if (error.code === 'auth/popup-closed-by-user') {
        console.log('Popup closed by user.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        console.log('Multiple popup requests cancelled.');
      }
      setLoading(false); // Set loading false only if there's an error
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      // onAuthStateChanged will set user to null and loading to false
    } catch (error) {
      console.error("Error signing out: ", error);
      setLoading(false);
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
