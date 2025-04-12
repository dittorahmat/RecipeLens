# RecipeLens

RecipeLens is a Next.js application that helps you discover recipes based on the ingredients you have. It leverages AI to identify ingredients from a photo and generate a list of possible recipes.

## Core Features

- **Ingredient Identification:** Analyze a photo of ingredients using AI to identify them.
- **Recipe Generation:** Generate a list of possible recipes based on the identified ingredients.
- **Manual Ingredient Input:** Allow users to manually input additional ingredients.
- **Image Input:** User-friendly interface for uploading ingredient photos.

## Technologies Used

- Next.js
- TypeScript
- Tailwind CSS
- Shadcn/ui
- Genkit AI

## Getting Started

1.  Clone the repository:

    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Set up your environment variables:

    Create a `.env` file in the root directory and add your Google GenAI API key:

    ```
    GOOGLE_GENAI_API_KEY=YOUR_API_KEY
    ```

4.  Run the development server:

    ```bash
    npm run dev
    ```

    Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.
