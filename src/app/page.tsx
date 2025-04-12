'use client';

import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Textarea} from '@/components/ui/textarea';
import {identifyIngredients} from '@/ai/flows/identify-ingredients';
import {generateRecipes} from '@/ai/flows/generate-recipes';
import {useToast} from '@/hooks/use-toast';
import {Icons} from '@/components/icons';

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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handlePhotoAnalysis = async () => {
    setIsLoading(true);
    try {
      const result = await identifyIngredients({photoUrl});
      setIngredients(result.ingredients);
      toast({
        title: 'Ingredients Identified!',
        description: 'The AI has identified the ingredients from the photo.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to identify ingredients.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualIngredientAdd = () => {
    if (manualIngredient.trim() !== '') {
      setIngredients([...ingredients, manualIngredient.trim()]);
      setManualIngredient('');
    }
  };

  const handleRecipeGeneration = async () => {
    setIsLoading(true);
    try {
      const result = await generateRecipes({ingredients});
      setRecipes(result.recipes);
      toast({
        title: 'Recipes Generated!',
        description: 'The AI has generated recipes based on the ingredients.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to generate recipes.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">RecipeLens</h1>

      {/* Image Input */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Analyze Ingredients from Photo</CardTitle>
          <CardDescription>
            Upload a photo of your ingredients to identify them.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Input
            type="file"
            accept="image/*"
            onChange={e => {
              if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                // Handle the file here, e.g., convert it to a data URL
                const reader = new FileReader();
                reader.onloadend = () => {
                  setPhotoUrl(reader.result as string);
                };
                reader.readAsDataURL(file);
              }
            }}
          />
          <Button onClick={handlePhotoAnalysis} disabled={isLoading}>
            {isLoading ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze Photo'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Manual Ingredient Input */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Manually Add Ingredients</CardTitle>
          <CardDescription>
            Enter any additional ingredients you want to include.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter ingredient"
              value={manualIngredient}
              onChange={e => setManualIngredient(e.target.value)}
            />
            <Button type="button" onClick={handleManualIngredientAdd}>
              Add
            </Button>
          </div>
          <div>
            <p>Current Ingredients:</p>
            {ingredients.length > 0 ? (
              <ul className="list-disc pl-5">
                {ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No ingredients added yet.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recipe Generation */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Generate Recipes</CardTitle>
          <CardDescription>
            Generate recipes based on the identified ingredients.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleRecipeGeneration} disabled={isLoading}>
            {isLoading ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Recipes'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Recipe Display */}
      {recipes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Recipes</CardTitle>
            <CardDescription>
              Here are the recipes generated based on your ingredients.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {recipes.map((recipe, index) => (
              <div key={index} className="mb-4">
                <h3 className="text-lg font-semibold">{recipe.title}</h3>
                <p className="font-bold">Ingredients:</p>
                <ul className="list-disc pl-5">
                  {recipe.ingredients.map((ingredient, i) => (
                    <li key={i}>{ingredient}</li>
                  ))}
                </ul>
                <p className="font-bold">Instructions:</p>
                <Textarea readOnly value={recipe.instructions} className="mt-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
