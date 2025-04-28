
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChefHat, Camera, ListPlus, UtensilsCrossed } from 'lucide-react'; // Import relevant icons

export default function LandingPage() {
  const { user, signInWithGoogle, loading } = useAuth();
  const router = useRouter();

  // Redirect if user is logged in
  useEffect(() => {
    if (!loading && user) {
      console.log('User logged in, redirecting from landing page...');
      router.push('/'); // Redirect to the main app page
    }
  }, [user, loading, router]);

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-secondary">
        <Icons.spinner className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // If user is logged in (and about to redirect), show minimal UI
  if (user) {
     return (
      <div className="flex items-center justify-center min-h-screen bg-secondary">
         <p className="text-muted-foreground">Redirecting...</p>
       </div>
     );
  }

  // Show Landing Page content if not loading and not logged in
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-background to-secondary p-4 sm:p-6 md:p-8">
      <Card className="w-full max-w-4xl shadow-xl border border-border overflow-hidden">
        <CardHeader className="bg-card p-6 text-center border-b border-border">
          <div className="flex justify-center items-center gap-3 mb-3">
            <ChefHat className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold text-foreground tracking-tight">
              Welcome to RecipeLens
            </h1>
          </div>
          <CardDescription className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Turn your ingredients into delicious meals! Snap a photo or list what you have, and let AI find the perfect recipes for you.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 md:p-8 space-y-8">
          {/* Features Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-center text-foreground">Features & Benefits</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="flex flex-col items-center text-center p-4 bg-background rounded-lg border border-input">
                <Camera className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-medium mb-1 text-card-foreground">Photo Analysis</h3>
                <p className="text-sm text-muted-foreground">Instantly identify ingredients from a photo.</p>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-background rounded-lg border border-input">
                <ListPlus className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-medium mb-1 text-card-foreground">Manual Input</h3>
                <p className="text-sm text-muted-foreground">Easily add or remove ingredients from your list.</p>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-background rounded-lg border border-input">
                <UtensilsCrossed className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-medium mb-1 text-card-foreground">Smart Recipes</h3>
                <p className="text-sm text-muted-foreground">Get AI-powered recipe suggestions based on your items.</p>
              </div>
            </div>
             <p className="text-center text-muted-foreground mt-4 text-sm">
               Reduce food waste, discover new dishes, and make cooking easier!
             </p>
          </section>

          {/* How to Use Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-center text-foreground">How It Works</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground text-center max-w-md mx-auto">
              <li><span className="font-medium text-card-foreground">Sign In:</span> Click the button below to log in with Google.</li>
              <li><span className="font-medium text-card-foreground">Add Ingredients:</span> Upload a photo or type them in manually.</li>
              <li><span className="font-medium text-card-foreground">Generate Recipes:</span> Click "Find Recipes".</li>
              <li><span className="font-medium text-card-foreground">Cook & Enjoy:</span> Follow the instructions and savor your meal!</li>
            </ol>
          </section>

          {/* Login Action */}
          <section className="text-center pt-4 border-t border-border">
             <h2 className="text-xl font-semibold mb-4 text-foreground">Ready to Get Started?</h2>
            <Button
              onClick={signInWithGoogle}
              disabled={loading}
              className="w-full max-w-xs mx-auto"
              size="lg"
              variant="default" // Use primary color for the main action
            >
              <Icons.google className="mr-2 h-5 w-5" />
              Sign in with Google
            </Button>
          </section>
        </CardContent>
      </Card>
       <footer className="mt-8 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} RecipeLens. All rights reserved.
       </footer>
    </div>
  );
}
