-- Migration: Update projects table columns and view to match Portfolio Management requirements
-- Date: 2026-06-18

-- 1. Rename existing columns if they exist
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'projects' AND column_name = 'short_desc') THEN
    ALTER TABLE public.projects RENAME COLUMN short_desc TO short_description;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'projects' AND column_name = 'overview') THEN
    ALTER TABLE public.projects RENAME COLUMN overview TO full_description;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'projects' AND column_name = 'cover_image') THEN
    ALTER TABLE public.projects RENAME COLUMN cover_image TO featured_image;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'projects' AND column_name = 'is_featured') THEN
    ALTER TABLE public.projects RENAME COLUMN is_featured TO featured;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'projects' AND column_name = 'sort_order') THEN
    ALTER TABLE public.projects RENAME COLUMN sort_order TO display_order;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'projects' AND column_name = 'completion_year') THEN
    ALTER TABLE public.projects RENAME COLUMN completion_year TO completion_date;
    ALTER TABLE public.projects ALTER COLUMN completion_date TYPE TEXT;
  END IF;
END
$$;

-- 2. Add new columns if they do not exist
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS client_name TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS gallery_images TEXT[];

-- 3. Recreate the v_published_projects view with new columns
DROP VIEW IF EXISTS public.v_published_projects;

CREATE OR REPLACE VIEW public.v_published_projects AS
SELECT p.*,
       p.featured_image AS resolved_cover,
       ARRAY(SELECT t.name FROM public.tags t JOIN public.project_tags pt ON pt.tag_id = t.id WHERE pt.project_id = p.id) as tag_names
FROM public.projects p
WHERE p.status = 'published';
