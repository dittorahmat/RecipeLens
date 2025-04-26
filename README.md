# RecipeLens

RecipeLens is a Next.js web application inspired by Cookpad, designed to help you find recipes using the ingredients you already have. Simply take a photo of your ingredients or add them manually, and let our AI suggest delicious recipes you can make!

## Core Features

-   **Ingredient Identification via Photo:** Upload a photo of your ingredients, and the AI will identify them for you.
-   **Manual Ingredient Input:** Easily add or remove ingredients from your list.
-   **Recipe Generation:** Get recipe suggestions based on the ingredients you've listed.
-   **Cookpad-Inspired UI:** Clean and user-friendly interface reminiscent of popular recipe platforms.

## Technologies Used

-   Next.js (App Router)
-   TypeScript
-   Tailwind CSS
-   Shadcn/ui
-   Lucide React Icons
-   Genkit AI (for ingredient identification and recipe generation)
-   React Hook Form (Implicitly via Shadcn/ui)
-   Zod (for schema validation)

## Getting Started

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up your environment variables:**

    Create a `.env.local` file in the root directory and add your Google Generative AI API key:

    ```
    GOOGLE_GENAI_API_KEY=YOUR_API_KEY
    ```

    *Note: Ensure you have access to a Google AI model compatible with Genkit (like Gemini).*

4.  **Run the development server:**

    You need two terminals for development: one for the Next.js app and one for the Genkit AI flows.

    *Terminal 1: Run Next.js App*
    ```bash
    npm run dev
    ```

    *Terminal 2: Run Genkit Dev Server (listens for AI flow calls)*
    ```bash
    npm run genkit:dev
    # Or use genkit:watch for auto-reloading on AI flow changes
    # npm run genkit:watch
    ```

    Open [http://localhost:9002](http://localhost:9002) (or the port specified in `package.json`) in your browser to see the application. The Genkit UI (for inspecting flows) usually runs on [http://localhost:4000](http://localhost:4000).

## How to Use

1.  **Upload a Photo:** Click the file input under "Analyze Ingredients" to select or take a photo of your ingredients.
2.  **Analyze:** Click "Analyze Photo". The AI will identify ingredients and add them to the "Your Ingredients" list.
3.  **Add/Remove Manually:** Type an ingredient in the input box under "Your Ingredients" and click the "+" button or press Enter. Remove ingredients by clicking the "X" next to them.
4.  **Generate Recipes:** Once you have your desired ingredients listed, click "Generate Recipes".
5.  **View Recipes:** The AI-generated recipes will appear on the right side, including titles, ingredient lists, and instructions.
