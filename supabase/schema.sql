-- Engineering OS Supabase Database Schema

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  active_mode TEXT DEFAULT 'placement' CHECK (active_mode IN ('placement', 'builder')),
  placement_target_date DATE DEFAULT '2026-10-01',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  overview TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
  category TEXT DEFAULT 'core',
  goals JSONB DEFAULT '[]'::jsonb,
  milestones JSONB DEFAULT '[]'::jsonb,
  resources JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  progress INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Missions Table
CREATE TABLE IF NOT EXISTS missions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT DEFAULT 'P1' CHECK (priority IN ('P0', 'P1', 'P2', 'P3')),
  category TEXT NOT NULL,
  status TEXT DEFAULT 'backlog' CHECK (status IN ('backlog', 'in_progress', 'completed')),
  deadline DATE,
  estimated_hours NUMERIC(4, 1) DEFAULT 0,
  actual_hours NUMERIC(4, 1) DEFAULT 0,
  definition_of_done JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily Big Three Table
CREATE TABLE IF NOT EXISTS daily_big_three (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL UNIQUE,
  task1 TEXT NOT NULL,
  task2 TEXT NOT NULL,
  task3 TEXT NOT NULL,
  completed1 BOOLEAN DEFAULT FALSE,
  completed2 BOOLEAN DEFAULT FALSE,
  completed3 BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Knowledge Vault Notes Table
CREATE TABLE IF NOT EXISTS knowledge_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  backlinks TEXT[] DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deep Work Sessions Table
CREATE TABLE IF NOT EXISTS deep_work_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  mission_id UUID REFERENCES missions(id) ON DELETE SET NULL,
  mission_title TEXT,
  duration_minutes INT NOT NULL,
  accomplishments TEXT,
  interruptions INT DEFAULT 0,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Books Table
CREATE TABLE IF NOT EXISTS books (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  progress_percent INT DEFAULT 0,
  read_pages INT DEFAULT 0,
  total_pages INT DEFAULT 0,
  status TEXT DEFAULT 'reading' CHECK (status IN ('reading', 'completed', 'queued')),
  key_ideas JSONB DEFAULT '[]'::jsonb,
  quotes JSONB DEFAULT '[]'::jsonb,
  actionable_lessons JSONB DEFAULT '[]'::jsonb,
  related_project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Health Logs Table
CREATE TABLE IF NOT EXISTS health_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL UNIQUE,
  workout_done BOOLEAN DEFAULT FALSE,
  workout_notes TEXT,
  meditation_minutes INT DEFAULT 0,
  sleep_hours NUMERIC(3, 1) DEFAULT 0,
  sleep_quality TEXT DEFAULT 'good' CHECK (sleep_quality IN ('poor', 'fair', 'good', 'excellent')),
  water_liters NUMERIC(3, 1) DEFAULT 0,
  walking_steps INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Interview Questions Table
CREATE TABLE IF NOT EXISTS interview_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL,
  company TEXT,
  confidence_level INT DEFAULT 3 CHECK (confidence_level BETWEEN 1 AND 5),
  last_reviewed TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Placement Applications Table
CREATE TABLE IF NOT EXISTS placement_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  status TEXT DEFAULT 'Applied' CHECK (status IN ('Applied', 'OA', 'Interview', 'Offer', 'Rejected')),
  deadline DATE,
  oa_date DATE,
  interview_date DATE,
  notes TEXT,
  salary_location TEXT,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Weekly Reviews Table
CREATE TABLE IF NOT EXISTS weekly_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start_date DATE NOT NULL,
  deep_work_hours NUMERIC(4, 1) DEFAULT 0,
  missions_completed_pct INT DEFAULT 0,
  wins TEXT,
  bottlenecks TEXT,
  learnings TEXT,
  changes_next_week TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_big_three ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE deep_work_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE placement_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_reviews ENABLE ROW LEVEL SECURITY;

-- Security Policies (Users can only access their own records)
CREATE POLICY "Users view own profiles" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users view own projects" ON projects FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users view own missions" ON missions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users view own daily_big_three" ON daily_big_three FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users view own knowledge_notes" ON knowledge_notes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users view own deep_work_sessions" ON deep_work_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users view own books" ON books FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users view own health_logs" ON health_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users view own interview_questions" ON interview_questions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users view own placement_applications" ON placement_applications FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users view own weekly_reviews" ON weekly_reviews FOR ALL USING (auth.uid() = user_id);
