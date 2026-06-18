-- ============================================================
-- SQL Migration: Auth Trigger & profiles RLS Policies Setup
-- Run this entire script in the Supabase SQL Editor for the active project
-- ============================================================

-- Step 1: Create handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    role
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'user'
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'handle_new_user trigger error: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 2: Drop existing triggers and set up the canonical trigger on auth.users
DROP TRIGGER IF EXISTS trg_handle_new_user ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- Step 3: RLS Audit on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles: users can read own" ON public.profiles;
DROP POLICY IF EXISTS "profiles: users can update own" ON public.profiles;
DROP POLICY IF EXISTS "profiles: trigger can insert" ON public.profiles;
DROP POLICY IF EXISTS "profiles: admins can read all" ON public.profiles;
DROP POLICY IF EXISTS "profiles: admins can update all" ON public.profiles;

-- SELECT: Authenticated users can read their own profile
CREATE POLICY "profiles: users can read own"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- UPDATE: Authenticated users can update their own profile
CREATE POLICY "profiles: users can update own"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- INSERT: Allow trigger-created records (trigger runs as SECURITY DEFINER bypassing RLS, but explicit policy ensures coverage)
CREATE POLICY "profiles: trigger can insert"
  ON public.profiles FOR INSERT
  WITH CHECK (true);
