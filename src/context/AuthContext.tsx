'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup } from 'firebase/auth';

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
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      // onAuthStateChanged will handle setting the user
    } catch (error) {
      console.error("Error signing in with Google: ", error);
      // Ensure loading is false on error, otherwise it might get stuck
      // if onAuthStateChanged doesn't fire immediately after error
      setLoading(false);
    }
    // setLoading will be set to false by onAuthStateChanged's effect after successful login
  };

  const signOut = async () => {
    setLoading(true); // Indicate loading state during sign out
    try {
      await firebaseSignOut(auth);
      setUser(null); // Explicitly set user to null on sign out
    } catch (error) {
      console.error("Error signing out: ", error);
    } finally {
        setLoading(false); // Ensure loading is false after sign out attempt
    }
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    signOut,
  };

  // Avoid rendering children until authentication state is determined,
  // unless you specifically want to show a loading state within children.
  // if (loading) {
  //   return <div>Loading authentication...</div>; // Or a spinner component
  // }

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
