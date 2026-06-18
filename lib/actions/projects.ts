'use server';

import { createServerClient } from '../supabase/server';
import { Database } from '@/types/database';
import { getUserRole } from '../auth';

export type ProjectRow = Database['public']['Tables']['projects']['Row'];
export type ProjectMediaRow = Database['public']['Tables']['project_media']['Row'];
export type ProjectBeforeAfterRow = Database['public']['Tables']['project_before_after']['Row'];

/**
 * Fetches all projects
 */
export async function fetchProjects(): Promise<{ data?: ProjectRow[]; error?: string }> {
  const supabase = createServerClient();
  try {
    const { data, error } = await (supabase
      .from('projects' as any) as any)
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data: data || [] };
  } catch (err: any) {
    console.error('fetchProjects error:', err);
    return { error: err?.message || 'Failed to fetch projects.' };
  }
}

/**
 * Fetches a single project with its media and before/after items
 */
export async function fetchProjectById(id: string): Promise<{
  data?: ProjectRow & { media: ProjectMediaRow[]; beforeAfter: ProjectBeforeAfterRow[] };
  error?: string;
}> {
  const supabase = createServerClient();
  try {
    const { data: project, error: projectError } = await (supabase
      .from('projects' as any) as any)
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (projectError) throw projectError;
    if (!project) return { error: 'Project not found.' };

    const { data: media, error: mediaError } = await (supabase
      .from('project_media' as any) as any)
      .select('*')
      .eq('project_id', id)
      .order('sort_order', { ascending: true });

    if (mediaError) throw mediaError;

    const { data: beforeAfter, error: beforeAfterError } = await (supabase
      .from('project_before_after' as any) as any)
      .select('*')
      .eq('project_id', id)
      .order('sort_order', { ascending: true });

    if (beforeAfterError) throw beforeAfterError;

    return {
      data: {
        ...project,
        media: media || [],
        beforeAfter: beforeAfter || []
      }
    };
  } catch (err: any) {
    console.error('fetchProjectById error:', err);
    return { error: err?.message || 'Failed to fetch project details.' };
  }
}

/**
 * Creates a new project
 */
export async function createProject(data: {
  title: string;
  slug: string;
  category: ProjectRow['category'];
  location: string;
  short_desc: string;
  featured_image: string | null;
  featured: boolean;
  display_order: number;
  completion_year: number | null;
  status: ProjectRow['status'];
  project_url: string | null;
  client_name: string | null;
  gallery_images?: string[] | null;
}): Promise<{ success?: boolean; data?: ProjectRow; error?: string }> {
  const supabase = createServerClient();
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { error: 'Not authenticated.' };

    const role = await getUserRole();
    if (role !== 'admin' && role !== 'super_admin') {
      return { error: 'Access denied. Only administrators can perform this action.' };
    }

    // Check slug uniqueness
    const { data: existing } = await (supabase
      .from('projects' as any) as any)
      .select('id')
      .eq('slug', data.slug)
      .maybeSingle();

    if (existing) {
      return { error: 'A project with this URL slug already exists.' };
    }

    // Log payload before insert
    const payload = {
      title: data.title,
      slug: data.slug,
      category: data.category,
      location: data.location,
      short_desc: data.short_desc,
      featured_image: data.featured_image,
      featured: data.featured,
      status: data.status,
      display_order: data.display_order || 0,
      completion_year: data.completion_year,
      project_url: data.project_url,
      client_name: data.client_name,
      gallery_images: data.gallery_images || null,
      created_by: user.id,
      view_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    console.log('INSERT PAYLOAD', JSON.stringify(payload, null, 2));
    const { data: newProject, error } = await (supabase
      .from('projects' as any) as any)
      .insert(payload)
      .select('*')
      .single();

    if (error) throw error;
    return { success: true, data: newProject };
  } catch (err: any) {
    console.error('createProject error:', err);
    return { error: err?.message || 'Failed to create project.' };
  }
}

/**
 * Updates an existing project
 */
export async function updateProject(id: string, data: {
  title: string;
  slug: string;
  category: ProjectRow['category'];
  location: string;
  short_desc: string;
  featured_image: string | null;
  featured: boolean;
  display_order: number;
  completion_year: number | null;
  status: ProjectRow['status'];
  project_url: string | null;
  client_name: string | null;
  gallery_images?: string[] | null;
}): Promise<{ success?: boolean; data?: ProjectRow; error?: string }> {
  const supabase = createServerClient();
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { error: 'Not authenticated.' };

    const role = await getUserRole();
    if (role !== 'admin' && role !== 'super_admin') {
      return { error: 'Access denied. Only administrators can perform this action.' };
    }

    // Check slug uniqueness (excluding current project)
    const { data: existing } = await (supabase
      .from('projects' as any) as any)
      .select('id')
      .eq('slug', data.slug)
      .neq('id', id)
      .maybeSingle();

    if (existing) {
      return { error: 'A project with this URL slug already exists.' };
    }

    // Log payload before update
    const payload = {
      title: data.title,
      slug: data.slug,
      category: data.category,
      location: data.location,
      short_desc: data.short_desc,
      featured_image: data.featured_image,
      featured: data.featured,
      status: data.status,
      display_order: data.display_order,
      completion_year: data.completion_year,
      project_url: data.project_url,
      client_name: data.client_name,
      gallery_images: data.gallery_images || null,
      updated_at: new Date().toISOString(),
    };
    console.log('UPDATE PAYLOAD', JSON.stringify(payload, null, 2));
    const { data: updatedProject, error } = await (supabase
      .from('projects' as any) as any)
      .update(payload)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    return { success: true, data: updatedProject };
  } catch (err: any) {
    console.error('updateProject error:', err);
    return { error: err?.message || 'Failed to update project.' };
  }
}

/**
 * Deletes a project along with its related media and comparison sets
 */
export async function deleteProject(id: string): Promise<{ success?: boolean; error?: string }> {
  const supabase = createServerClient();
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { error: 'Not authenticated.' };

    const role = await getUserRole();
    if (role !== 'admin' && role !== 'super_admin') {
      return { error: 'Access denied. Only administrators can perform this action.' };
    }

    // Cascading deletes for safety
    await (supabase.from('project_media' as any) as any).delete().eq('project_id', id);
    await (supabase.from('project_before_after' as any) as any).delete().eq('project_id', id);

    const { error } = await (supabase
      .from('projects' as any) as any)
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error('deleteProject error:', err);
    return { error: err?.message || 'Failed to delete project.' };
  }
}

/**
 * Adds an image/media item to a project's gallery
 */
export async function addProjectMedia(
  projectId: string, 
  url: string, 
  isCover: boolean = false
): Promise<{ success?: boolean; data?: ProjectMediaRow; error?: string }> {
  const supabase = createServerClient();
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { error: 'Not authenticated.' };

    const role = await getUserRole();
    if (role !== 'admin' && role !== 'super_admin') {
      return { error: 'Access denied. Only administrators can perform this action.' };
    }

    // Get the highest current sort_order to append correctly
    const { data: mediaItems } = await (supabase
      .from('project_media' as any) as any)
      .select('sort_order')
      .eq('project_id', projectId)
      .order('sort_order', { ascending: false })
      .limit(1);

    const nextSortOrder = mediaItems && mediaItems.length > 0 ? (mediaItems[0].sort_order + 1) : 0;

    // If setting this as cover, unset any existing cover
    if (isCover) {
      await (supabase
        .from('project_media' as any) as any)
        .update({ is_cover: false })
        .eq('project_id', projectId);
    }

    const { data: newMedia, error } = await (supabase
      .from('project_media' as any) as any)
      .insert({
        project_id: projectId,
        url,
        media_type: 'image',
        is_cover: isCover,
        sort_order: nextSortOrder,
        created_at: new Date().toISOString()
      })
      .select('*')
      .single();

    if (error) throw error;

    // If this is cover, also update the featured_image property on the projects table
    if (isCover) {
      await (supabase
        .from('projects' as any) as any)
        .update({ featured_image: url })
        .eq('id', projectId);
    }

    return { success: true, data: newMedia };
  } catch (err: any) {
    console.error('addProjectMedia error:', err);
    return { error: err?.message || 'Failed to add media to project.' };
  }
}

/**
 * Removes a media item from the project gallery
 */
export async function removeProjectMedia(mediaId: string): Promise<{ success?: boolean; error?: string }> {
  const supabase = createServerClient();
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { error: 'Not authenticated.' };

    const role = await getUserRole();
    if (role !== 'admin' && role !== 'super_admin') {
      return { error: 'Access denied. Only administrators can perform this action.' };
    }

    // Fetch the media details to check if it was the cover image
    const { data: mediaItem } = await (supabase
      .from('project_media' as any) as any)
      .select('*')
      .eq('id', mediaId)
      .maybeSingle();

    if (!mediaItem) return { error: 'Media item not found.' };

    const { error } = await (supabase
      .from('project_media' as any) as any)
      .delete()
      .eq('id', mediaId);

    if (error) throw error;

    // If the cover was deleted, update projects table cover_image to null or the next cover candidate
    if (mediaItem.is_cover) {
      const { data: nextCoverCandidates } = await (supabase
        .from('project_media' as any) as any)
        .select('url')
        .eq('project_id', mediaItem.project_id)
        .order('sort_order', { ascending: true })
        .limit(1);

      const nextCoverUrl = nextCoverCandidates && nextCoverCandidates.length > 0 ? nextCoverCandidates[0].url : null;
      
      if (nextCoverUrl) {
        await (supabase
          .from('project_media' as any) as any)
          .update({ is_cover: true })
          .eq('url', nextCoverUrl)
          .eq('project_id', mediaItem.project_id);
      }

      await (supabase
        .from('projects' as any) as any)
        .update({ featured_image: nextCoverUrl })
        .eq('id', mediaItem.project_id);
    }

    return { success: true };
  } catch (err: any) {
    console.error('removeProjectMedia error:', err);
    return { error: err?.message || 'Failed to remove media.' };
  }
}

/**
 * Reorders project gallery items
 */
export async function reorderProjectMedia(mediaOrders: { id: string; sort_order: number }[]): Promise<{ success?: boolean; error?: string }> {
  const supabase = createServerClient();
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { error: 'Not authenticated.' };

    const role = await getUserRole();
    if (role !== 'admin' && role !== 'super_admin') {
      return { error: 'Access denied. Only administrators can perform this action.' };
    }

    // Perform individual updates
    for (const item of mediaOrders) {
      await (supabase
        .from('project_media' as any) as any)
        .update({ sort_order: item.sort_order })
        .eq('id', item.id);
    }

    return { success: true };
  } catch (err: any) {
    console.error('reorderProjectMedia error:', err);
    return { error: err?.message || 'Failed to reorder media.' };
  }
}

/**
 * Adds a before/after image comparison set
 */
export async function addProjectBeforeAfter(data: {
  projectId: string;
  beforeUrl: string;
  afterUrl: string;
  label?: string;
}): Promise<{ success?: boolean; data?: ProjectBeforeAfterRow; error?: string }> {
  const supabase = createServerClient();
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { error: 'Not authenticated.' };

    const role = await getUserRole();
    if (role !== 'admin' && role !== 'super_admin') {
      return { error: 'Access denied. Only administrators can perform this action.' };
    }

    // Get the highest current sort_order to append correctly
    const { data: baItems } = await (supabase
      .from('project_before_after' as any) as any)
      .select('sort_order')
      .eq('project_id', data.projectId)
      .order('sort_order', { ascending: false })
      .limit(1);

    const nextSortOrder = baItems && baItems.length > 0 ? (baItems[0].sort_order + 1) : 0;

    const { data: newBA, error } = await (supabase
      .from('project_before_after' as any) as any)
      .insert({
        project_id: data.projectId,
        before_url: data.beforeUrl,
        after_url: data.afterUrl,
        label: data.label || null,
        sort_order: nextSortOrder,
        created_at: new Date().toISOString()
      })
      .select('*')
      .single();

    if (error) throw error;
    return { success: true, data: newBA };
  } catch (err: any) {
    console.error('addProjectBeforeAfter error:', err);
    return { error: err?.message || 'Failed to add comparison set.' };
  }
}

/**
 * Deletes a before/after comparison set
 */
export async function deleteProjectBeforeAfter(id: string): Promise<{ success?: boolean; error?: string }> {
  const supabase = createServerClient();
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { error: 'Not authenticated.' };

    const role = await getUserRole();
    if (role !== 'admin' && role !== 'super_admin') {
      return { error: 'Access denied. Only administrators can perform this action.' };
    }

    const { error } = await (supabase
      .from('project_before_after' as any) as any)
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error('deleteProjectBeforeAfter error:', err);
    return { error: err?.message || 'Failed to delete comparison set.' };
  }
}

/**
 * Bulk updates the status of multiple projects
 */
export async function bulkUpdateProjectsStatus(
  ids: string[],
  status: ProjectRow['status']
): Promise<{ success?: boolean; error?: string }> {
  const supabase = createServerClient();
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { error: 'Not authenticated.' };

    const role = await getUserRole();
    if (role !== 'admin' && role !== 'super_admin') {
      return { error: 'Access denied. Only administrators can perform this action.' };
    }

    const { error } = await (supabase
      .from('projects' as any) as any)
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .in('id', ids);

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error('bulkUpdateProjectsStatus error:', err);
    return { error: err?.message || 'Failed to bulk update projects status.' };
  }
}
