# RecipeLens

RecipeLens is a Next.js web application designed to help you find recipes using the ingredients you already have. Simply upload a photo of your ingredients or add them manually, and let our AI suggest delicious recipes you can make!

## Core Features

-   **Google Authentication:** Securely log in using your Google account via a welcoming landing page.
-   **Ingredient Identification via Photo:** Upload a photo of your ingredients, and the AI will identify them for you.
-   **Manual Ingredient Input:** Easily add or remove ingredients from your list.
-   **Recipe Generation:** Get recipe suggestions based on the ingredients you've listed.
-   **Modern User Interface:** Clean and user-friendly interface built with Shadcn/ui and Tailwind CSS.

## Technologies Used

-   Next.js (App Router)
-   TypeScript
-   Tailwind CSS
-   Shadcn/ui
-   Lucide React Icons
-   Firebase Authentication (Google Sign-In)
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

    Create a `.env.local` file in the **root directory** (the same level as `package.json`) and add your Google Generative AI API key and Firebase configuration:

    ```env
    # Genkit AI Key
    GOOGLE_GENAI_API_KEY=YOUR_GENAI_API_KEY

    # Firebase Configuration (Required for Authentication)
    # These MUST be prefixed with NEXT_PUBLIC_ for browser access
    NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_FIREBASE_AUTH_DOMAIN
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_FIREBASE_STORAGE_BUCKET
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_FIREBASE_MESSAGING_SENDER_ID
    NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_FIREBASE_APP_ID
    ```

    *Note: Ensure you have access to a Google AI model compatible with Genkit (like Gemini) and have set up Firebase Authentication with Google provider enabled in your Firebase project settings.*

4.  **Run the development server:**

    You need two terminals for development: one for the Next.js app and one for the Genkit AI flows.

    *Terminal 1: Run Next.js App*
    ```bash
    npm run dev
    ```
    *Important: Make sure you have stopped (`Ctrl+C`) and restarted the server after editing `.env.local`.*

    *Terminal 2: Run Genkit Dev Server (listens for AI flow calls)*
    ```bash
    npm run genkit:dev
    # Or use genkit:watch for auto-reloading on AI flow changes
    # npm run genkit:watch
    ```

    Open [http://localhost:9002](http://localhost:9002) (or the port specified in `package.json`) in your browser to see the application. The Genkit UI (for inspecting flows) usually runs on [http://localhost:4000](http://localhost:4000).

## How to Use

1.  **Visit the App:** Access the application at the development URL (e.g., http://localhost:9002). You will land on the RecipeLens information page.
2.  **Login:** Click the "Sign in with Google" button and follow the prompts in the Google popup window.
3.  **Upload a Photo (Optional):** Once logged in, you'll be redirected to the main app page. Click the file input under "Analyze Ingredients Photo" to select or take a photo of your ingredients using your device's camera or photo library.
4.  **Analyze Photo (If Uploaded):** After selecting a photo, click "Analyze Photo". The AI will identify ingredients from the image and add them to the "Your Ingredients" list.
5.  **Add/Remove Manually:** Type an ingredient in the input box under "Your Ingredients" and click the "+" button or press Enter. Remove ingredients by clicking the "X" next to them.
6.  **Generate Recipes:** Once you have your desired ingredients listed, click "Find Recipes".
7.  **View Recipes:** The AI-generated recipes will appear on the right side, including titles, ingredient lists, and instructions.
8.  **Sign Out:** Click the logout icon in the header to sign out of your account.
