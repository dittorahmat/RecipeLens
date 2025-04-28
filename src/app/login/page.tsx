'use client';

import React, { useEffect } from 'react'; // Added useEffect
import { useRouter } from 'next/navigation'; // Added useRouter
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

export default function LoginPage() {
  const { user, signInWithGoogle, loading } = useAuth();
  const router = useRouter();

  // Redirect if user is logged in
  useEffect(() => {
    // Only redirect if loading is finished and user exists
    if (!loading && user) {
      console.log('User logged in, redirecting from login page...');
      router.push('/'); // Redirect to the home page (or dashboard)
    }
  }, [user, loading, router]); // Re-run effect if user, loading, or router changes

  // If still loading or already logged in (and about to redirect), show minimal UI
  if (loading || user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-secondary">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Show login button only if not loading and not logged in
  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary">
      <div className="p-8 bg-card rounded-lg shadow-lg w-full max-w-md text-center border border-border">
        <h1 className="text-2xl font-bold mb-6 text-card-foreground">Login to RecipeLens</h1>
        <Button
          onClick={signInWithGoogle}
          disabled={loading} // Technically loading should be false here, but keep for safety
          className="w-full"
          variant="default"
        >
          <Icons.google className="mr-2 h-4 w-4" />
          Sign in with Google
        </Button>
      </div>
    </div>
  );
}
