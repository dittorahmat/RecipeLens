//The identify ingredients from photo AI agent.
//
//- identifyIngredients - A function that handles the ingredient identification process.
//- IdentifyIngredientsInput - The input type for the identifyIngredients function.
//- IdentifyIngredientsOutput - The return type for the identifyIngredients function.

'use server';

/**
 * @fileOverview Identifies ingredients from a photo using AI.
 *
 * - identifyIngredients - A function that handles the ingredient identification process.
 * - IdentifyIngredientsInput - The input type for the identifyIngredients function.
 * - IdentifyIngredientsOutput - The return type for the identifyIngredients function.
 */


import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const IdentifyIngredientsInputSchema = z.object({
  photoUrl: z
    .string()
    .describe(
      "A photo of ingredients, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
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
       photoUrl: z
        .string()
        .describe(
          "A photo of ingredients, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
        ),
    }),
  },
  output: {
    schema: z.object({
      ingredients: z.array(
        z.string().describe('A list of identified ingredients.')
      ).describe('A list of identified ingredients.'),
    }),
  },
  prompt: `You are an expert chef specializing in identifying food ingredients from photographs.

  Analyze the provided photo carefully. List all the distinct food ingredients you can clearly identify. Be specific (e.g., "red onion" instead of just "onion", "chicken breast" instead of just "chicken"). If an ingredient is unclear or ambiguous, omit it. Return only the list of identified ingredients.

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
    // Basic filtering to remove potential empty strings or placeholder text from the AI
    const filteredIngredients = output?.ingredients.filter(ing => ing && ing.trim().length > 0 && !ing.toLowerCase().includes("no ingredients identified")) || [];
    return { ingredients: filteredIngredients };
  }
);

