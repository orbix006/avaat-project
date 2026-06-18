-- Migration: Optimization Audit for Consultation, Newsletter, Activity, and Admin Profile Tables
-- Date: 2026-06-17

-- 1. Create missing activity_logs table
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.admin_profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id TEXT,
    details JSONB,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Add Indexes for Query Performance

-- consultation_requests
CREATE INDEX IF NOT EXISTS idx_consultation_requests_status ON public.consultation_requests(status);
CREATE INDEX IF NOT EXISTS idx_consultation_requests_email ON public.consultation_requests(email);
CREATE INDEX IF NOT EXISTS idx_consultation_requests_created_at ON public.consultation_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_consultation_requests_assigned_to ON public.consultation_requests(assigned_to);

-- newsletter_subscribers
CREATE UNIQUE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON public.newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_is_active ON public.newsletter_subscribers(is_active);

-- activity_logs
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);

-- admin_profiles
CREATE UNIQUE INDEX IF NOT EXISTS idx_admin_profiles_email ON public.admin_profiles(email);

-- 3. Enable RLS and add policies

ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Note: Assuming public.is_admin() exists as per types/database.ts

-- admin_profiles RLS
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.admin_profiles;
CREATE POLICY "Admins can read all profiles" ON public.admin_profiles FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Users can read own profile" ON public.admin_profiles;
CREATE POLICY "Users can read own profile" ON public.admin_profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can update profiles" ON public.admin_profiles;
CREATE POLICY "Admins can update profiles" ON public.admin_profiles FOR UPDATE USING (public.is_admin());

-- consultation_requests RLS
DROP POLICY IF EXISTS "Anyone can insert consultation requests" ON public.consultation_requests;
CREATE POLICY "Anyone can insert consultation requests" ON public.consultation_requests FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view consultation requests" ON public.consultation_requests;
CREATE POLICY "Admins can view consultation requests" ON public.consultation_requests FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update consultation requests" ON public.consultation_requests;
CREATE POLICY "Admins can update consultation requests" ON public.consultation_requests FOR UPDATE USING (public.is_admin());

-- newsletter_subscribers RLS
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;
CREATE POLICY "Anyone can subscribe to newsletter" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Admins can view subscribers" ON public.newsletter_subscribers FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Admins can update subscribers" ON public.newsletter_subscribers FOR UPDATE USING (public.is_admin());

-- activity_logs RLS
DROP POLICY IF EXISTS "Admins can view activity logs" ON public.activity_logs;
CREATE POLICY "Admins can view activity logs" ON public.activity_logs FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "System can insert activity logs" ON public.activity_logs;
CREATE POLICY "System can insert activity logs" ON public.activity_logs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
