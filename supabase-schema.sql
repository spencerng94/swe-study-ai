-- Database schema for Salesforce Prep App
-- Run this in your Supabase SQL editor

-- Game States table
CREATE TABLE IF NOT EXISTS game_states (
  user_id TEXT PRIMARY KEY,
  state JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Saved Questions table
CREATE TABLE IF NOT EXISTS saved_questions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  summarized BOOLEAN DEFAULT FALSE,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Study Guide Progress table
CREATE TABLE IF NOT EXISTS study_guide_progress (
  user_id TEXT PRIMARY KEY,
  progress JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Saved Flashcards table
CREATE TABLE IF NOT EXISTS saved_flashcards (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  flashcard_id INTEGER NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, flashcard_id)
);

-- Saved Topics table
CREATE TABLE IF NOT EXISTS saved_topics (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  topic TEXT NOT NULL,
  lesson TEXT NOT NULL,
  conversation JSONB,
  summarized BOOLEAN DEFAULT FALSE,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_saved_questions_user_id ON saved_questions(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_questions_timestamp ON saved_questions(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_saved_questions_category ON saved_questions(category);
CREATE INDEX IF NOT EXISTS idx_saved_flashcards_user_id ON saved_flashcards(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_flashcards_flashcard_id ON saved_flashcards(flashcard_id);
CREATE INDEX IF NOT EXISTS idx_saved_flashcards_timestamp ON saved_flashcards(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_saved_topics_user_id ON saved_topics(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_topics_timestamp ON saved_topics(timestamp DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE game_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_guide_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_topics ENABLE ROW LEVEL SECURITY;

-- Create policies to allow users to only access their own data
-- Note: These policies use a function to get the current user_id
-- For now, we'll use a simple approach where users can access data by user_id
-- In production with authentication, you'd use auth.uid()

-- Policy for game_states
CREATE POLICY "Users can view their own game state"
  ON game_states FOR SELECT
  USING (true); -- For now, allow all reads (you can restrict this with auth.uid() when you add auth)

CREATE POLICY "Users can insert their own game state"
  ON game_states FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own game state"
  ON game_states FOR UPDATE
  USING (true);

-- Policy for saved_questions
CREATE POLICY "Users can view their own saved questions"
  ON saved_questions FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own saved questions"
  ON saved_questions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can delete their own saved questions"
  ON saved_questions FOR DELETE
  USING (true);

-- Policy for study_guide_progress
CREATE POLICY "Users can view their own study guide progress"
  ON study_guide_progress FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own study guide progress"
  ON study_guide_progress FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own study guide progress"
  ON study_guide_progress FOR UPDATE
  USING (true);

-- Policy for saved_flashcards
CREATE POLICY "Users can view their own saved flashcards"
  ON saved_flashcards FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own saved flashcards"
  ON saved_flashcards FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can delete their own saved flashcards"
  ON saved_flashcards FOR DELETE
  USING (true);

-- Policy for saved_topics
CREATE POLICY "Users can view their own saved topics"
  ON saved_topics FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own saved topics"
  ON saved_topics FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own saved topics"
  ON saved_topics FOR UPDATE
  USING (true);

CREATE POLICY "Users can delete their own saved topics"
  ON saved_topics FOR DELETE
  USING (true);
