-- ==============================================================================
-- GRAND SURVEY HIMALKOM 2026: DATABASE SCHEMA & RLS POLICIES
-- Target: Mahasiswa Ilmu Komputer IPB University Angkatan 62
-- ==============================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. SURVEY VERSIONS TABLE
CREATE TABLE IF NOT EXISTS public.survey_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  questionnaire_schema JSONB NOT NULL DEFAULT '{}'::jsonb,
  scoring_version TEXT NOT NULL DEFAULT '1.0.0',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Seed initial version 2026.1
INSERT INTO public.survey_versions (version, title, scoring_version, is_active)
VALUES (
  '2026.1',
  'Grand Survey HIMALKOM 2026: Analisis Ketergantungan Mahasiswa Ilmu Komputer IPB Angkatan 62 terhadap AI',
  '1.0.0',
  true
)
ON CONFLICT (version) DO NOTHING;

-- 3. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  cohort TEXT DEFAULT 'Angkatan 62 (2025)',
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'respondent' CHECK (role IN ('respondent', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. SURVEY SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.survey_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  survey_version_id UUID NOT NULL REFERENCES public.survey_versions(id) ON DELETE RESTRICT,
  answers JSONB NOT NULL,
  dependency_score NUMERIC(5,2) NOT NULL CHECK (dependency_score >= 0 AND dependency_score <= 100),
  dependency_category TEXT NOT NULL CHECK (dependency_category IN ('RENDAH', 'SEDANG', 'TINGGI')),
  scoring_details JSONB NOT NULL DEFAULT '{}'::jsonb,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT unique_user_survey_version UNIQUE (user_id, survey_version_id)
);

-- 5. SPREADSHEET SYNC LOGS TABLE
CREATE TABLE IF NOT EXISTS public.spreadsheet_sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES public.survey_submissions(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'synced', 'failed')),
  attempt_count INT NOT NULL DEFAULT 0,
  last_error TEXT,
  last_attempt_at TIMESTAMPTZ,
  synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON public.survey_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_survey_version_id ON public.survey_submissions(survey_version_id);
CREATE INDEX IF NOT EXISTS idx_sync_logs_submission_id ON public.spreadsheet_sync_logs(submission_id);
CREATE INDEX IF NOT EXISTS idx_sync_logs_status ON public.spreadsheet_sync_logs(status);

-- ==============================================================================
-- DATABASE TRIGGER: ENFORCE IPB EMAIL DOMAIN ON SIGNUP
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.check_ipb_email_domain()
RETURNS TRIGGER AS $$
DECLARE
  v_domain TEXT;
BEGIN
  -- Extract domain from user email
  v_domain := lower(split_part(NEW.email, '@', 2));

  -- Validate against allowed IPB domains
  IF v_domain NOT IN ('apps.ipb.ac.id', 'ipb.ac.id') THEN
    RAISE EXCEPTION 'Akses ditolak: Pendaftaran hanya diizinkan untuk akun email resmi IPB University (@apps.ipb.ac.id atau @ipb.ac.id).';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if present
DROP TRIGGER IF EXISTS tr_check_ipb_email_domain ON auth.users;

-- Bind trigger before insert or update on auth.users
CREATE TRIGGER tr_check_ipb_email_domain
  BEFORE INSERT OR UPDATE OF email ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.check_ipb_email_domain();

-- ==============================================================================
-- DATABASE TRIGGER: AUTO CREATE PROFILE ON USER CONFIRMATION/SIGNUP
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, cohort, role)
  VALUES (
    NEW.id,
    lower(NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    'Angkatan 62 (2025)',
    CASE
      -- Admin check can also be synced via env or specific seed
      WHEN lower(NEW.email) IN ('admin.himalkom@apps.ipb.ac.id') THEN 'admin'
      ELSE 'respondent'
    END
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = timezone('utc'::text, now());

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.survey_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spreadsheet_sync_logs ENABLE ROW LEVEL SECURITY;

-- Helper function: is current user an admin?
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 1. SURVEY VERSIONS POLICIES
-- Anyone can view active survey versions
CREATE POLICY "Public read active survey versions"
  ON public.survey_versions FOR SELECT
  USING (is_active = true OR public.is_admin());

-- Only admin can modify survey versions
CREATE POLICY "Admin manage survey versions"
  ON public.survey_versions FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 2. PROFILES POLICIES
-- Users can view their own profile; admins can view all
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

-- Users can update only their own cohort/full_name (cannot change role)
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND (
      -- Prevent privilege escalation
      role = (SELECT role FROM public.profiles WHERE id = auth.uid())
      OR public.is_admin()
    )
  );

-- 3. SURVEY SUBMISSIONS POLICIES
-- Users can view ONLY their own submission; admins can view all
CREATE POLICY "Users can view own submission"
  ON public.survey_submissions FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

-- Users can insert their own submission once
CREATE POLICY "Users can insert own submission"
  ON public.survey_submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Submissions cannot be modified by users (immutable audit trail)
CREATE POLICY "Admin only update submissions"
  ON public.survey_submissions FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Submissions cannot be deleted by regular users
CREATE POLICY "Admin only delete submissions"
  ON public.survey_submissions FOR DELETE
  USING (public.is_admin());

-- 4. SPREADSHEET SYNC LOGS POLICIES
-- Only admins and service role can access sync logs
CREATE POLICY "Admin manage sync logs"
  ON public.spreadsheet_sync_logs FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
