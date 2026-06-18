-- Migration: Add project_url, github_url, and technologies to projects table
-- Date: 2026-06-18

ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS project_url TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS github_url TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS technologies TEXT[];
