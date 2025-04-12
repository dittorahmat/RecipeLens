//The identify ingredients from photo AI agent.
//
//- identifyIngredients - A function that handles the ingredient identification process.
//- IdentifyIngredientsInput - The input type for the identifyIngredients function.
//- IdentifyIngredientsOutput - The return type for the identifyIngredients function.

'use server';

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const IdentifyIngredientsInputSchema = z.object({
  photoUrl: z.string().describe('The URL of the ingredient photo.'),
});
export type IdentifyIngredientsInput = z.infer<typeof IdentifyIngredientsInputSchema>;

const IdentifyIngredientsOutputSchema = z.object({
  ingredients: z.array(
    z.string().describe('A list of identified ingredients.')
  ).describe('A list of identified ingredients.'),
});
export type IdentifyIngredientsOutput = z.infer<typeof IdentifyIngredientsOutputSchema>;

export async function identifyIngredients(input: IdentifyIngredientsInput): Promise<IdentifyIngredientsOutput> {
  return identifyIngredientsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyIngredientsPrompt',
  input: {
    schema: z.object({
      photoUrl: z.string().describe('The URL of the ingredient photo.'),
    }),
  },
  output: {
    schema: z.object({
      ingredients: z.array(
        z.string().describe('A list of identified ingredients.')
      ).describe('A list of identified ingredients.'),
    }),
  },
  prompt: `You are an expert chef. You are great at identifying ingredients from a photo.

  Based on the photo, list all the ingredients that you can identify.

  Photo: {{media url=photoUrl}}

  List of ingredients:
  `,
});

const identifyIngredientsFlow = ai.defineFlow<
  typeof IdentifyIngredientsInputSchema,
  typeof IdentifyIngredientsOutputSchema
>(
  {
    name: 'identifyIngredientsFlow',
    inputSchema: IdentifyIngredientsInputSchema,
    outputSchema: IdentifyIngredientsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
