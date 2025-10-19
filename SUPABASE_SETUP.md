# Supabase Setup Guide

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Name**: Portfolio Analyzer (or your choice)
   - **Database Password**: Choose a strong password
   - **Region**: Choose closest to you
5. Click "Create new project" and wait ~2 minutes

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** > **API**
2. You'll need two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (the long string under "Project API keys")

## Step 3: Create Database Tables

1. Go to **SQL Editor** in your Supabase dashboard
2. Click "New Query"
3. Copy and paste this SQL:

```sql
-- Create portfolios table
CREATE TABLE portfolios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Portfolio data
  total_value NUMERIC,
  total_cost_basis NUMERIC,
  unrealized_gain_loss NUMERIC,
  unrealized_gain_loss_percent NUMERIC,
  
  -- Metrics
  portfolio_return NUMERIC,
  portfolio_beta NUMERIC,
  portfolio_std_dev NUMERIC,
  sharpe_ratio NUMERIC,
  treynor_ratio NUMERIC,
  jensens_alpha NUMERIC,
  
  -- Holdings (stored as JSONB)
  holdings JSONB NOT NULL DEFAULT '[]',
  
  -- Statement data
  statement_url TEXT,
  account_info JSONB
);

-- Create index for faster queries
CREATE INDEX portfolios_user_id_idx ON portfolios(user_id);
CREATE INDEX portfolios_created_at_idx ON portfolios(created_at DESC);

-- Enable Row Level Security
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own portfolios"
  ON portfolios FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own portfolios"
  ON portfolios FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own portfolios"
  ON portfolios FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own portfolios"
  ON portfolios FOR DELETE
  USING (auth.uid() = user_id);
```

4. Click "Run" to execute the SQL

## Step 4: Configure Your App

1. Create a `.env` file in your project root (if it doesn't exist)
2. Add these lines:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

3. Replace `your_project_url_here` and `your_anon_key_here` with your actual values

## Step 5: Update .gitignore

Make sure your `.env` file is in `.gitignore` so you don't commit your keys!

## Done! 🎉

Your app is now ready to use Supabase authentication and database storage.

