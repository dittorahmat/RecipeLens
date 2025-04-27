'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons'; // Use updated import path

export default function LoginPage() {
  const { signInWithGoogle, loading } = useAuth();

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary">
      <div className="p-8 bg-card rounded-lg shadow-lg w-full max-w-md text-center border border-border">
        <h1 className="text-2xl font-bold mb-6 text-card-foreground">Login to RecipeLens</h1>
        <Button
          onClick={signInWithGoogle}
          disabled={loading}
          className="w-full"
          variant="default" // Use default primary button style
        >
          {loading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.google className="mr-2 h-4 w-4" /> // Add Google Icon
          )}
          Sign in with Google
        </Button>
        {/* You can add more login options here if needed */}
      </div>
    </div>
  );
}
