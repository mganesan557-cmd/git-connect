-- Student Skill Profiles
CREATE TABLE public.student_skill_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  skills JSONB NOT NULL DEFAULT '{
    "variables": 0.1,
    "loops": 0.1,
    "functions": 0.1,
    "arrays": 0.1,
    "recursion": 0.1,
    "sorting": 0.1,
    "trees": 0.1,
    "dynamic_programming": 0.1,
    "graphs": 0.1,
    "complexity": 0.1
  }',
  total_xp INTEGER NOT NULL DEFAULT 0,
  streak_days INTEGER NOT NULL DEFAULT 0,
  last_active_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.student_skill_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own skill profile"
  ON public.student_skill_profiles FOR SELECT
  TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users can insert own skill profile"
  ON public.student_skill_profiles FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own skill profile"
  ON public.student_skill_profiles FOR UPDATE
  TO authenticated USING (user_id = auth.uid());

-- Quiz Results (for skill model updates)
CREATE TABLE public.quiz_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL,
  topic_skill_key TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own quiz results"
  ON public.quiz_results FOR SELECT
  TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users can insert own quiz results"
  ON public.quiz_results FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.uid());

-- Practice Attempts
CREATE TABLE public.practice_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id TEXT NOT NULL,
  topic_skill_key TEXT NOT NULL,
  language TEXT NOT NULL,
  user_code TEXT NOT NULL,
  passed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.practice_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own practice attempts"
  ON public.practice_attempts FOR SELECT
  TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users can insert own practice attempts"
  ON public.practice_attempts FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.uid());
