
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged, signOut as firebaseSignOut, getRedirectResult, UserCredential } from 'firebase/auth'; // Added getRedirectResult
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

  // Effect to check redirect result explicitly
  useEffect(() => {
    getRedirectResult(auth)
      .then((result: UserCredential | null) => {
        console.log('getRedirectResult result:', result);
        // Although onAuthStateChanged should handle this,
        // we log here for diagnostics.
        // If result is not null, it means sign-in was successful.
        if (result && result.user) {
          console.log('User found via getRedirectResult:', result.user);
          // Note: Setting user state here might be redundant if onAuthStateChanged works correctly,
          // but useful if onAuthStateChanged is delayed or failing silently.
          // setUser(result.user);
        }
      })
      .catch((error) => {
        // Handle Errors here.
        console.error('getRedirectResult error:', error.code, error.message);
      })
      .finally(() => {
         // Potentially set loading to false here ONLY IF
         // onAuthStateChanged isn't reliably doing so.
         // For now, let onAuthStateChanged handle loading state.
      });
  }, []); // Run once on mount

  // Effect for the primary auth state listener
  useEffect(() => {
    setLoading(true); // Ensure loading is true initially
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('Auth State Changed:', currentUser);
      setUser(currentUser);
      setLoading(false); // Set loading false *after* auth state is determined
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (error) {
      console.error("Error initiating sign in with Google redirect: ", error);
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
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
