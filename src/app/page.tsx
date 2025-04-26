'use client';

import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {Textarea} from '@/components/ui/textarea';
import {identifyIngredients} from '@/ai/flows/identify-ingredients';
import {generateRecipes} from '@/ai/flows/generate-recipes';
import {useToast} from '@/hooks/use-toast';
import {Icons} from '@/components/icons';
import { Toaster } from "@/components/ui/toaster"
import { Camera, ChefHat, UtensilsCrossed, ListPlus, PlusCircle } from 'lucide-react';

export default function Home() {
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [manualIngredient, setManualIngredient] = useState<string>('');
  const [recipes, setRecipes] = useState<
    {
      title: string;
      ingredients: string[];
      instructions: string;
    }[]
  >([]);
  const {toast} = useToast();
  const [isLoadingIdentify, setIsLoadingIdentify] = useState<boolean>(false);
  const [isLoadingGenerate, setIsLoadingGenerate] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('');

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
      const result = await identifyIngredients({photoUrl});
      setIngredients(result.ingredients);
      toast({
        title: 'Ingredients Identified!',
        description: `Found: ${result.ingredients.join(', ') || 'No ingredients found.'}`,
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error Identifying Ingredients',
        description: error.message || 'Failed to identify ingredients from the photo.',
      });
    } finally {
      setIsLoadingIdentify(false);
    }
  };

  const handleManualIngredientAdd = () => {
    const trimmedIngredient = manualIngredient.trim();
    if (trimmedIngredient !== '') {
      if (!ingredients.includes(trimmedIngredient)) {
          setIngredients([...ingredients, trimmedIngredient]);
          setManualIngredient('');
       } else {
         toast({
            variant: 'destructive',
            title: 'Duplicate Ingredient',
            description: `${trimmedIngredient} is already in the list.`,
          });
       }
    }
  };

   const handleRemoveIngredient = (ingredientToRemove: string) => {
    setIngredients(ingredients.filter(ingredient => ingredient !== ingredientToRemove));
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
      const result = await generateRecipes({ingredients});
      setRecipes(result.recipes);
      toast({
        title: 'Recipes Generated!',
        description: `Found ${result.recipes.length} recipe(s).`,
      });
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
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string); // Set the data URL
      };
      reader.readAsDataURL(file);
    } else {
      setPhotoUrl('');
      setFileName('');
    }
  };


  return (
    <>
    <div className="min-h-screen bg-background text-foreground">
       <header className="bg-primary text-primary-foreground p-4 shadow-md">
         <div className="container mx-auto flex items-center gap-2">
           <ChefHat className="h-8 w-8" />
           <h1 className="text-3xl font-bold">RecipeLens</h1>
         </div>
      </header>

      <main className="container mx-auto p-4 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Left Column: Input */}
        <div className="md:col-span-1 space-y-6">
           {/* Image Input */}
           <Card className="shadow-lg rounded-lg overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Camera /> Analyze Ingredients</CardTitle>
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
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
              />
              {fileName && <p className="text-sm text-muted-foreground">Selected: {fileName}</p>}
             </CardContent>
            <CardFooter>
               <Button onClick={handlePhotoAnalysis} disabled={isLoadingIdentify || !photoUrl} className="w-full">
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
          <Card className="shadow-lg rounded-lg overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ListPlus /> Your Ingredients</CardTitle>
              <CardDescription>
                Add or remove ingredients manually.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Enter ingredient"
                  value={manualIngredient}
                  onChange={e => setManualIngredient(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && handleManualIngredientAdd()}
                />
                <Button type="button" onClick={handleManualIngredientAdd} size="icon" aria-label="Add Ingredient">
                   <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
              <div>
                 {ingredients.length > 0 ? (
                  <ul className="space-y-2 mt-4">
                    {ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-center justify-between bg-secondary p-2 rounded-md">
                         <span>{ingredient}</span>
                         <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-destructive"
                           onClick={() => handleRemoveIngredient(ingredient)}
                           aria-label={`Remove ${ingredient}`}
                         >
                           <Icons.close className="h-4 w-4" />
                         </Button>
                       </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground text-center mt-4">Add ingredients via photo or manually.</p>
                )}
              </div>
            </CardContent>
             <CardFooter>
               <Button onClick={handleRecipeGeneration} disabled={isLoadingGenerate || ingredients.length === 0} className="w-full">
                {isLoadingGenerate ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                 <> <UtensilsCrossed className="mr-2 h-4 w-4" /> Generate Recipes </>
                )}
              </Button>
             </CardFooter>
          </Card>
        </div>

        {/* Right Column: Recipe Display */}
         <div className="md:col-span-2">
           {recipes.length > 0 ? (
            <Card className="shadow-lg rounded-lg overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><ChefHat /> Generated Recipes</CardTitle>
                <CardDescription>
                  Here are some ideas based on your ingredients.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {recipes.map((recipe, index) => (
                  <Card key={index} className="border-l-4 border-primary pl-4">
                    <CardHeader className="p-4 pb-2">
                       <CardTitle className="text-xl">{recipe.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 grid gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Ingredients:</h4>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          {recipe.ingredients.map((ingredient, i) => (
                            <li key={i}>{ingredient}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                         <h4 className="font-semibold mb-2">Instructions:</h4>
                         <Textarea readOnly value={recipe.instructions} className="mt-1 bg-background/50 text-sm h-auto" rows={Math.max(5, recipe.instructions.split('\n').length)} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          ) : (
             <Card className="shadow-lg rounded-lg overflow-hidden flex items-center justify-center min-h-[300px] border-dashed border-2">
                <div className="text-center text-muted-foreground">
                   <UtensilsCrossed className="mx-auto h-12 w-12 mb-4" />
                   <p className="text-lg">Recipes will appear here.</p>
                   <p>Add ingredients and click "Generate Recipes".</p>
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
