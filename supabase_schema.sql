-- Supabase Schema for Paktum
-- Run this script in your Supabase project's SQL Editor

-- 1. Create contracts table
CREATE TABLE contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  job_title TEXT NOT NULL,
  years_of_experience INTEGER NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL, -- Supabase Storage path
  file_type TEXT NOT NULL, -- pdf | docx | txt | image
  status TEXT DEFAULT 'pending', -- pending | analyzing | done | error
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on contracts
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own contracts"
  ON contracts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own contracts"
  ON contracts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own contracts"
  ON contracts FOR UPDATE
  USING (auth.uid() = user_id);

-- 2. Create analyses table
CREATE TABLE analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
  summary TEXT,
  flagged_clauses JSONB, -- array of { clause: string, issue: string, severity: 'low'|'medium'|'high' }
  negotiation_messages JSONB, -- array of { clause: string, message: string }
  overall_score INTEGER, -- 1–100 contract quality score
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on analyses
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view analyses of their contracts"
  ON analyses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM contracts
      WHERE contracts.id = analyses.contract_id
      AND contracts.user_id = auth.uid()
    )
  );

CREATE POLICY "Service roles can insert analyses"
  ON analyses FOR INSERT
  WITH CHECK (true); -- Usually restricted to server-side, so authenticated/anon shouldn't hit this directly easily without rights, or handled via service role key

-- 3. Create messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
  role TEXT NOT NULL, -- 'user' | 'assistant'
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages of their contracts"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM contracts
      WHERE contracts.id = messages.contract_id
      AND contracts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages into their contracts"
  ON messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM contracts
      WHERE contracts.id = messages.contract_id
      AND contracts.user_id = auth.uid()
    )
  );

-- 4. Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('contracts', 'contracts', false)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Users can upload their own contracts"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'contracts' AND
    (auth.uid())::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can read their own contracts"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'contracts' AND
    (auth.uid())::text = (storage.foldername(name))[1]
  );
