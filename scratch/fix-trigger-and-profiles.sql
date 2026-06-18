-- ============================================================
-- FIX: handle_new_user trigger for profiles table
-- Run this in Supabase SQL Editor for project: znednuexxtwcoesygzlo
-- ============================================================
-- This script:
--   1. Creates the 'user_role' enum if not exists
--   2. Creates the 'profiles' table if not exists
--   3. Creates/replaces the handle_new_user() trigger function
--   4. Creates the trg_handle_new_user trigger on auth.users
--   5. Creates the is_admin() helper function
--   6. Sets up RLS policies on profiles
-- ============================================================

-- Step 1: Create user_role enum if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE public.user_role AS ENUM ('user', 'admin', 'super_admin');
  END IF;
END
$$;

-- Step 2: Create profiles table if not exists
CREATE TABLE IF NOT EXISTS public.profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name  TEXT NOT NULL DEFAULT '',
  email      TEXT NOT NULL DEFAULT '',
  role       public.user_role NOT NULL DEFAULT 'user',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Step 3: Create/replace handle_new_user trigger function
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
  -- Safely read metadata fields - NEW is typed on auth.users so direct access is fine here
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
  -- Log but don't block user creation
  RAISE LOG 'handle_new_user error: %', SQLERRM;
  RETURN NEW;
END;
$$;

-- Step 4: Drop old trigger if exists, then create fresh
DROP TRIGGER IF EXISTS trg_handle_new_user ON auth.users;

CREATE TRIGGER trg_handle_new_user
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Step 5: Create is_admin() helper
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

-- Step 6: Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid duplicates
DROP POLICY IF EXISTS "profiles: users can read own" ON public.profiles;
DROP POLICY IF EXISTS "profiles: users can update own" ON public.profiles;
DROP POLICY IF EXISTS "profiles: admins can read all" ON public.profiles;
DROP POLICY IF EXISTS "profiles: admins can update all" ON public.profiles;
DROP POLICY IF EXISTS "profiles: trigger can insert" ON public.profiles;

-- Users can read their own profile
CREATE POLICY "profiles: users can read own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "profiles: users can update own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins can read all profiles
CREATE POLICY "profiles: admins can read all"
  ON public.profiles FOR SELECT
  USING (public.is_admin());

-- Admins can update any profile
CREATE POLICY "profiles: admins can update all"
  ON public.profiles FOR UPDATE
  USING (public.is_admin());

-- Allow service role inserts (trigger runs as SECURITY DEFINER which bypasses RLS,
-- but explicit policy ensures future-proofing)
CREATE POLICY "profiles: trigger can insert"
  ON public.profiles FOR INSERT
  WITH CHECK (true);

-- Step 7: Add prevent_privilege_escalation to profiles
CREATE OR REPLACE FUNCTION public.prevent_privilege_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only admins and super_admins can change role
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    IF NOT public.is_admin() THEN
      RAISE EXCEPTION 'Only admins can change user roles';
    END IF;
    -- super_admin role can only be set by another super_admin
    IF NEW.role = 'super_admin' AND OLD.role != 'super_admin' THEN
      IF NOT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'super_admin'
      ) THEN
        RAISE EXCEPTION 'Only super admins can promote to super_admin';
      END IF;
    END IF;
  END IF;
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_privilege_escalation ON public.profiles;

CREATE TRIGGER trg_prevent_privilege_escalation
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_privilege_escalation();

-- ============================================================
-- DONE. Now test signup via your app or the test script.
-- ============================================================
