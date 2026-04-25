# FridgeWise - Digital Kitchen

A web application for generating meal ideas and recipes using AI.

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see below)
4. Deploy to Vercel or run locally with `vercel dev`

## Environment Variables

Create a `.env.local` file for local development, or set in Vercel dashboard for production:

```
GOOGLE_AI_API_KEY=your_google_ai_api_key_here
```

Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey).

## Deployment to Vercel

1. Push your code to GitHub
2. Connect your repo to Vercel
3. Add the `GOOGLE_AI_API_KEY` environment variable in Vercel's dashboard
4. Deploy

The API routes in `/api` will be automatically deployed as serverless functions.

## Project Structure

- `index.html` - Landing page
- `maindashboard.html` - Main dashboard with ingredient-based search
- `secondarydashboard.html` - Direct meal search
- `api/generate.js` - Serverless function for AI content generation
- Other HTML files for user account management

## Technologies Used

- HTML/CSS/JavaScript
- Firebase (Authentication & Database)
- Google Gemini AI
- Vercel (Deployment)
- Tailwind CSS