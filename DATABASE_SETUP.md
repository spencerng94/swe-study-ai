# Database Setup Guide

This app uses Supabase for data persistence. Follow these steps to set up your database.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in your project details:
   - Name: `salesforce-prep` (or your preferred name)
   - Database Password: Choose a strong password
   - Region: Choose the closest region to your users
5. Click "Create new project"

## Step 2: Set Up the Database Schema

1. In your Supabase project dashboard, go to the **SQL Editor**
2. Click "New Query"
3. Copy and paste the contents of `supabase-schema.sql` into the editor
4. Click "Run" to execute the SQL

This will create:
- `game_states` table - Stores user XP, levels, streaks, achievements
- `saved_questions` table - Stores saved interview questions
- `study_guide_progress` table - Stores study guide checklist progress
- Row Level Security (RLS) policies for data access

## Step 3: Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys")

## Step 4: Configure Environment Variables

1. Create a `.env` file in the root of your project (copy from `.env.example`)
2. Add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

3. **Important**: Add `.env` to your `.gitignore` file to keep your keys secure

## Step 5: Deploy to Vercel

### Option A: Using Vercel Dashboard

1. Go to [https://vercel.com](https://vercel.com) and import your project
2. In the project settings, go to **Environment Variables**
3. Add the same environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Redeploy your application

### Option B: Using Vercel CLI

```bash
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel --prod
```

## How It Works

- **With Supabase**: Data is stored in the cloud and persists across devices/browsers
- **Without Supabase** (no env vars): The app falls back to localStorage (browser-only storage)

## Data Migration

If you've been using the app with localStorage and want to migrate your data:

1. Export your localStorage data (you can use browser DevTools)
2. The app will automatically sync data to Supabase when you save new items
3. Existing localStorage data will continue to work until you clear your browser cache

## Security Notes

- The `anon` key is safe to use in client-side code (it's public)
- Row Level Security (RLS) policies ensure users can only access their own data
- For production, consider implementing proper authentication (Supabase Auth)

## Troubleshooting

### Data not persisting?
- Check that your environment variables are set correctly
- Verify the database schema was created successfully
- Check browser console for errors

### Getting CORS errors?
- Make sure your Supabase project allows requests from your domain
- Check Supabase project settings → API → CORS configuration

### Need help?
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
