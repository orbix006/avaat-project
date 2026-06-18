-- ============================================================
-- SQL Migration: Allow Anonymous Consultation Requests
-- Run this entire script in the Supabase SQL Editor for the active project
-- ============================================================

-- Allow public consultation submissions for anonymous users
DROP POLICY IF EXISTS "Allow public consultation submissions" ON public.consultation_requests;
DROP POLICY IF EXISTS "Anyone can insert consultation requests" ON public.consultation_requests;

CREATE POLICY "Allow public consultation submissions"
ON public.consultation_requests
FOR INSERT
TO anon
WITH CHECK (true);
