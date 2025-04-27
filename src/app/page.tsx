
'use client';

import { useState, useEffect } from 'react'; // Added useEffect
import { useRouter } from 'next/navigation'; // Added useRouter
import { useAuth } from '@/context/AuthContext'; // Added useAuth
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { identifyIngredients } from '@/ai/flows/identify-ingredients';
import { generateRecipes } from '@/ai/flows/generate-recipes';
import { useToast } from '@/hooks/use-toast';
import { Icons } from '@/components/icons'; // Use updated import path
import { Toaster } from '@/components/ui/toaster';
import {
  Camera,
  ChefHat,
  UtensilsCrossed,
  ListPlus,
  PlusCircle,
  LogOut, // Added LogOut icon
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar" // Import Avatar components


type Recipe = {
  title: string;
  ingredients: string[];
  instructions: string;
};

export default function Home() {
  const { user, loading: authLoading, signOut } = useAuth(); // Get user, loading state, and signOut from AuthContext
  const router = useRouter(); // Initialize router for redirection

  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [manualIngredient, setManualIngredient] = useState<string>('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const { toast } = useToast();
  const [isLoadingIdentify, setIsLoadingIdentify] = useState<boolean>(false);
  const [isLoadingGenerate, setIsLoadingGenerate] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('');

  // Effect to handle redirection based on auth state
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login'); // Redirect to login if not loading and no user
    }
  }, [user, authLoading, router]);

  const handlePhotoAnalysis = async () => {
    if (!photoUrl) {
      toast({
        variant: 'destructive',
        title: 'No Photo Selected',
        description: 'Please select a photo of your ingredients first.',
      });
      return;
    }
    setIsLoadingIdentify(true);
    setRecipes([]); // Clear previous recipes
    try {
      // Assuming identifyIngredients expects photoUrl as data URI
      const result = await identifyIngredients({ photoUrl });
      setIngredients((prevIngredients) => [...new Set([...prevIngredients, ...result.ingredients])]); // Add identified ingredients, avoid duplicates
      toast({
        title: 'Ingredients Identified!',
        description: `Found: ${
          result.ingredients.length > 0 ? result.ingredients.join(', ') : 'No new ingredients found.'
        }`,
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error Identifying Ingredients',
        description:
          error.message || 'Failed to identify ingredients from the photo.',
      });
    } finally {
      setIsLoadingIdentify(false);
    }
  };

  const handleManualIngredientAdd = () => {
    const trimmedIngredient = manualIngredient.trim().toLowerCase(); // Standardize case
    if (trimmedIngredient !== '') {
      // Check if ingredient (case-insensitive) already exists
      if (!ingredients.some(ing => ing.toLowerCase() === trimmedIngredient)) {
        setIngredients([...ingredients, manualIngredient.trim()]); // Add the original casing
        setManualIngredient('');
      } else {
        toast({
          variant: 'destructive',
          title: 'Duplicate Ingredient',
          description: `${manualIngredient.trim()} is already in the list.`,
        });
      }
    }
  };

  const handleRemoveIngredient = (ingredientToRemove: string) => {
    setIngredients(
      ingredients.filter((ingredient) => ingredient !== ingredientToRemove),
    );
  };

  const handleRecipeGeneration = async () => {
    if (ingredients.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No Ingredients',
        description: 'Please add some ingredients before generating recipes.',
      });
      return;
    }
    setIsLoadingGenerate(true);
    setRecipes([]); // Clear previous recipes before generating new ones
    try {
      const result = await generateRecipes({ ingredients });
       // Filter out recipes with missing titles or instructions
      const validRecipes = result.recipes.filter(
        (recipe) => recipe.title && recipe.title.trim() !== '' && recipe.instructions && recipe.instructions.trim() !== ''
      );
      setRecipes(validRecipes);
      toast({
        title: 'Recipes Generated!',
        description: `Found ${validRecipes.length} recipe(s).`,
      });
       if (validRecipes.length === 0 && result.recipes.length > 0) {
        toast({
          variant: 'destructive',
          title: 'Recipe Generation Issue',
          description: 'Some recipes were generated but lacked necessary details (title/instructions).',
        });
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error Generating Recipes',
        description: error.message || 'Failed to generate recipes.',
      });
    } finally {
      setIsLoadingGenerate(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name); // Store the file name

      // Basic file type validation
      if (!file.type.startsWith('image/')) {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please select an image file (e.g., JPG, PNG).',
        });
        setPhotoUrl('');
        setFileName('');
        e.target.value = ''; // Reset the file input
        return;
      }


      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string); // Set the data URL
      };
       reader.onerror = () => {
        toast({
          variant: 'destructive',
          title: 'Error Reading File',
          description: 'Could not read the selected file.',
        });
         setPhotoUrl('');
         setFileName('');
         e.target.value = ''; // Reset the file input
      };
      reader.readAsDataURL(file);
    } else {
      setPhotoUrl('');
      setFileName('');
    }
  };

   // Function to get initials from display name
   const getInitials = (name?: string | null): string => {
    if (!name) return '?';
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  // Show loading indicator while checking auth state
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Icons.spinner className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // If user is not authenticated (should be handled by redirect, but good safety check)
  if (!user) {
    // Optionally return a message or null while redirecting
    return null;
     // return <div className="flex items-center justify-center min-h-screen">Redirecting to login...</div>;
  }

  // Render the main application content if authenticated
  return (
    <>
      <div className="min-h-screen bg-background text-foreground">
        <header className="bg-card border-b border-border shadow-sm sticky top-0 z-40">
          <div className="container mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
             {/* Left side: Logo and App Name */}
            <div className="flex items-center gap-2">
              <ChefHat className="h-7 w-7 text-primary" />
              <h1 className="text-2xl font-semibold text-foreground">RecipeLens</h1>
            </div>

             {/* Right side: User Info and Sign Out */}
            <div className="flex items-center gap-4">
                <span className="hidden sm:inline text-sm font-medium text-muted-foreground">{user.displayName || user.email}</span>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName || 'User avatar'} />
                  <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                </Avatar>
              <Button variant="ghost" size="icon" onClick={signOut} aria-label="Sign Out" className="text-muted-foreground hover:text-foreground">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Input */}
          <div className="lg:col-span-1 space-y-6">
            {/* Image Input */}
            <Card className="shadow-md rounded-lg overflow-hidden border border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Camera className="text-primary"/> Analyze Ingredients Photo
                </CardTitle>
                <CardDescription>
                  Upload a photo of your ingredients.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  id="picture"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer text-muted-foreground"
                />
                 {photoUrl && (
                  <div className="mt-4 border rounded-md overflow-hidden aspect-video">
                    <img src={photoUrl} alt="Selected ingredients" className="w-full h-full object-cover" />
                  </div>
                )}
                {fileName && !photoUrl && ( // Show filename only if photo isn't displayed yet
                   <p className="text-sm text-muted-foreground">
                    Selected: {fileName}
                  </p>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handlePhotoAnalysis}
                  disabled={isLoadingIdentify || !photoUrl}
                  className="w-full"
                >
                  {isLoadingIdentify ? (
                    <>
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Analyze Photo'
                  )}
                </Button>
              </CardFooter>
            </Card>

            {/* Manual Ingredient Input & List */}
            <Card className="shadow-md rounded-lg overflow-hidden border border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ListPlus className="text-primary" /> Your Ingredients
                </CardTitle>
                <CardDescription>
                  Add or remove ingredients manually.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="e.g., Onion, Chicken Breast"
                    value={manualIngredient}
                    onChange={(e) => setManualIngredient(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === 'Enter' && handleManualIngredientAdd()
                    }
                    aria-label="Enter ingredient to add"
                  />
                  <Button
                    type="button"
                    onClick={handleManualIngredientAdd}
                    size="icon"
                    aria-label="Add Ingredient"
                    variant="outline"
                  >
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
                <div className="max-h-60 overflow-y-auto pr-2">
                  {ingredients.length > 0 ? (
                    <ul className="space-y-2 mt-4">
                      {ingredients.map((ingredient, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-between bg-secondary/50 p-2 rounded-md text-sm"
                        >
                          <span>{ingredient}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleRemoveIngredient(ingredient)}
                            aria-label={`Remove ${ingredient}`}
                          >
                            <Icons.close className="h-4 w-4" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground text-center mt-4 text-sm">
                      Add ingredients via photo or manually above.
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="border-t border-border pt-4">
                <Button
                  onClick={handleRecipeGeneration}
                  disabled={isLoadingGenerate || ingredients.length === 0}
                  className="w-full"
                >
                  {isLoadingGenerate ? (
                    <>
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      Generating Recipes...
                    </>
                  ) : (
                    <>
                      <UtensilsCrossed className="mr-2 h-4 w-4" /> Find Recipes
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Right Column: Recipe Display */}
          <div className="lg:col-span-2">
            {isLoadingGenerate ? (
              <Card className="shadow-md rounded-lg overflow-hidden border border-border flex items-center justify-center min-h-[300px] bg-secondary/30">
                <div className="text-center text-muted-foreground space-y-2">
                  <Icons.spinner className="mx-auto h-10 w-10 animate-spin text-primary" />
                  <p className="text-lg font-medium">Generating Recipes...</p>
                  <p className="text-sm">Searching for delicious ideas based on your ingredients.</p>
                </div>
              </Card>
            ) : recipes.length > 0 ? (
              <Card className="shadow-md rounded-lg overflow-hidden border border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <ChefHat className="text-primary"/> Generated Recipes ({recipes.length})
                  </CardTitle>
                  <CardDescription>
                    Here are some ideas based on your ingredients.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {recipes.map((recipe, index) => (
                    <Card key={index} className="border-l-4 border-primary overflow-hidden">
                      <CardHeader className="p-4 pb-2 bg-secondary/30">
                        <CardTitle className="text-lg font-medium">{recipe.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-2 grid gap-4">
                        <div>
                          <h4 className="font-semibold mb-2 text-sm">Ingredients:</h4>
                          <ul className="list-disc pl-5 text-sm space-y-1 text-muted-foreground">
                            {recipe.ingredients.map((ingredient, i) => (
                              <li key={i}>{ingredient}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2 text-sm">Instructions:</h4>
                           {/* Using a pre-wrap div for better formatting */}
                           <div className="whitespace-pre-wrap text-sm text-muted-foreground bg-background/50 p-3 rounded-md border border-input">
                            {recipe.instructions}
                           </div>
                           {/* Textarea kept for reference or if needed later
                          <Textarea
                            readOnly
                            value={recipe.instructions}
                            className="mt-1 bg-background/50 text-sm h-auto border-input text-muted-foreground"
                            rows={Math.max(
                              5,
                              (recipe.instructions.match(/\n/g) || []).length + 1 // Calculate rows based on newlines
                            )}
                          />
                           */}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-md rounded-lg overflow-hidden border-2 border-dashed border-border flex items-center justify-center min-h-[300px] bg-secondary/30">
                <div className="text-center text-muted-foreground space-y-2 px-6">
                  <UtensilsCrossed className="mx-auto h-12 w-12 mb-4 text-primary/70" />
                  <p className="text-lg font-medium">Ready to Cook?</p>
                  <p className="text-sm">Add some ingredients using the photo analyzer or manual input on the left, then click "Find Recipes" to get started!</p>
                </div>
              </Card>
            )}
          </div>
        </main>
      </div>
      <Toaster />
    </>
  );
}
