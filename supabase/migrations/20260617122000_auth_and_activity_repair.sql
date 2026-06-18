-- =====================================================================
-- Migration: Auth Trigger, Profiles, Activity Logs & Email Check RPC Helper Repair
-- Date: 2026-06-17
-- =====================================================================

-- 1. Create Enums if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE public.user_role AS ENUM ('user', 'admin', 'super_admin');
  END IF;
END
$$;

-- 2. Repair / Create public.profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name  TEXT NOT NULL DEFAULT '',
  email      TEXT NOT NULL DEFAULT '',
  role       public.user_role NOT NULL DEFAULT 'user',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Repair / Create public.activity_logs Table
DROP TABLE IF EXISTS public.activity_logs CASCADE;

CREATE TABLE public.activity_logs (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id    UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL,
  entity_type TEXT,
  entity_id   TEXT,
  description TEXT NOT NULL,
  metadata    JSONB,
  created_at  TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- 5. Helper Function: is_admin()
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role IN ('admin', 'super_admin')
  );
$$;

-- 6. Setup RLS Policies

-- Profiles
DROP POLICY IF EXISTS "profiles: users can read own" ON public.profiles;
CREATE POLICY "profiles: users can read own" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles: users can update own" ON public.profiles;
CREATE POLICY "profiles: users can update own" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles: admins can read all" ON public.profiles;
CREATE POLICY "profiles: admins can read all" ON public.profiles FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "profiles: admins can update all" ON public.profiles;
CREATE POLICY "profiles: admins can update all" ON public.profiles FOR UPDATE USING (public.is_admin());

DROP POLICY IF EXISTS "profiles: public can insert" ON public.profiles;
CREATE POLICY "profiles: public can insert" ON public.profiles FOR INSERT WITH CHECK (true);

-- Activity Logs
DROP POLICY IF EXISTS "activity_logs: admins can view" ON public.activity_logs;
CREATE POLICY "activity_logs: admins can view" ON public.activity_logs FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "activity_logs: system can insert" ON public.activity_logs;
CREATE POLICY "activity_logs: system can insert" ON public.activity_logs FOR INSERT WITH CHECK (true);

-- Consultation Requests
DROP POLICY IF EXISTS "consultation_requests: public can insert" ON public.consultation_requests;
CREATE POLICY "consultation_requests: public can insert" ON public.consultation_requests FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "consultation_requests: admins can view" ON public.consultation_requests;
CREATE POLICY "consultation_requests: admins can view" ON public.consultation_requests FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "consultation_requests: admins can update" ON public.consultation_requests;
CREATE POLICY "consultation_requests: admins can update" ON public.consultation_requests FOR UPDATE USING (public.is_admin());

-- Newsletter Subscribers
DROP POLICY IF EXISTS "newsletter_subscribers: public can insert" ON public.newsletter_subscribers;
CREATE POLICY "newsletter_subscribers: public can insert" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "newsletter_subscribers: admins can view" ON public.newsletter_subscribers;
CREATE POLICY "newsletter_subscribers: admins can view" ON public.newsletter_subscribers FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "newsletter_subscribers: admins can update" ON public.newsletter_subscribers;
CREATE POLICY "newsletter_subscribers: admins can update" ON public.newsletter_subscribers FOR UPDATE USING (public.is_admin());

-- 7. Fix User Creation Trigger Function (Non-blocking & Security Definer)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_full_name TEXT;
  v_email     TEXT;
BEGIN
  v_full_name := COALESCE(
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'name',
    split_part(NEW.email, '@', 1)
  );
  v_email := COALESCE(NEW.email, '');

  INSERT INTO public.profiles (id, full_name, email, role, created_at, updated_at)
  VALUES (
    NEW.id,
    v_full_name,
    v_email,
    'user',
    now(),
    now()
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'handle_new_user error: %', SQLERRM;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_handle_new_user ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER trg_handle_new_user
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 8. Add check_email_exists() RPC helper
CREATE OR REPLACE FUNCTION public.check_email_exists(email_to_check text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users WHERE email = email_to_check
  );
END;
$$;
