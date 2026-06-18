'use server';

import { createServerClient } from '../supabase/server';
import { Database } from '@/types/database';

export type TestimonialRow = Database['public']['Tables']['testimonials']['Row'];

export interface TestimonialWithProject extends TestimonialRow {
  project: {
    id: string;
    title: string;
  } | null;
}

/**
 * Fetches all testimonials sorted by sort_order
 */
export async function fetchTestimonials(): Promise<{ data?: TestimonialWithProject[]; error?: string }> {
  const supabase = createServerClient();
  try {
    const { data, error } = await (supabase
      .from('testimonials' as any) as any)
      .select('*, project:projects(id, title)')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data: data || [] };
  } catch (err: any) {
    console.error('fetchTestimonials error:', err);
    return { error: err?.message || 'Failed to fetch testimonials.' };
  }
}

/**
 * Fetches a list of projects (ID and Title) for the select dropdown
 */
export async function fetchProjectsList(): Promise<{ data?: { id: string; title: string }[]; error?: string }> {
  const supabase = createServerClient();
  try {
    const { data, error } = await (supabase
      .from('projects' as any) as any)
      .select('id, title')
      .order('title', { ascending: true });

    if (error) throw error;
    return { data: data || [] };
  } catch (err: any) {
    console.error('fetchProjectsList error:', err);
    return { error: err?.message || 'Failed to fetch projects list.' };
  }
}

/**
 * Creates a new testimonial
 */
export async function createTestimonial(data: {
  client_name: string;
  location: string | null;
  client_image: string | null;
  rating: number;
  review: string;
  project_id: string | null;
  is_featured: boolean;
  is_published: boolean;
  sort_order?: number;
}): Promise<{ success?: boolean; data?: TestimonialRow; error?: string }> {
  const supabase = createServerClient();
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { error: 'Not authenticated.' };

    // Get next sort order
    let nextSortOrder = data.sort_order;
    if (nextSortOrder === undefined) {
      const { data: currentItems } = await (supabase
        .from('testimonials' as any) as any)
        .select('sort_order')
        .order('sort_order', { ascending: false })
        .limit(1);

      nextSortOrder = currentItems && currentItems.length > 0 ? (currentItems[0].sort_order + 1) : 0;
    }

    const { data: newTestimonial, error } = await (supabase
      .from('testimonials' as any) as any)
      .insert({
        client_name: data.client_name,
        location: data.location,
        client_image: data.client_image || null,
        rating: data.rating,
        review: data.review,
        project_id: data.project_id || null,
        is_featured: data.is_featured,
        is_published: data.is_published,
        sort_order: nextSortOrder,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select('*')
      .single();

    if (error) throw error;
    return { success: true, data: newTestimonial };
  } catch (err: any) {
    console.error('createTestimonial error:', err);
    return { error: err?.message || 'Failed to create testimonial.' };
  }
}

/**
 * Updates an existing testimonial
 */
export async function updateTestimonial(
  id: string,
  data: {
    client_name: string;
    location: string | null;
    client_image: string | null;
    rating: number;
    review: string;
    project_id: string | null;
    is_featured: boolean;
    is_published: boolean;
    sort_order?: number;
  }
): Promise<{ success?: boolean; data?: TestimonialRow; error?: string }> {
  const supabase = createServerClient();
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { error: 'Not authenticated.' };

    const updatePayload: any = {
      client_name: data.client_name,
      location: data.location,
      client_image: data.client_image || null,
      rating: data.rating,
      review: data.review,
      project_id: data.project_id || null,
      is_featured: data.is_featured,
      is_published: data.is_published,
      updated_at: new Date().toISOString(),
    };

    if (data.sort_order !== undefined) {
      updatePayload.sort_order = data.sort_order;
    }

    const { data: updatedTestimonial, error } = await (supabase
      .from('testimonials' as any) as any)
      .update(updatePayload)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    return { success: true, data: updatedTestimonial };
  } catch (err: any) {
    console.error('updateTestimonial error:', err);
    return { error: err?.message || 'Failed to update testimonial.' };
  }
}

/**
 * Deletes a testimonial
 */
export async function deleteTestimonial(id: string): Promise<{ success?: boolean; error?: string }> {
  const supabase = createServerClient();
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { error: 'Not authenticated.' };

    const { error } = await (supabase
      .from('testimonials' as any) as any)
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error('deleteTestimonial error:', err);
    return { error: err?.message || 'Failed to delete testimonial.' };
  }
}

/**
 * Bulk publishes multiple testimonials
 */
export async function bulkPublishTestimonials(ids: string[]): Promise<{ success?: boolean; error?: string }> {
  const supabase = createServerClient();
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { error: 'Not authenticated.' };

    for (const id of ids) {
      const { data: testimonial } = await (supabase.from('testimonials' as any) as any)
        .select('sort_order')
        .eq('id', id)
        .maybeSingle();

      const currentSortOrder = testimonial?.sort_order ?? 0;
      const newSortOrder = currentSortOrder < 0 ? 0 : currentSortOrder;

      const { error } = await (supabase.from('testimonials' as any) as any)
        .update({
          is_published: true,
          sort_order: newSortOrder,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;
    }

    return { success: true };
  } catch (err: any) {
    console.error('bulkPublishTestimonials error:', err);
    return { error: err?.message || 'Failed to bulk publish testimonials.' };
  }
}

/**
 * Bulk archives multiple testimonials
 */
export async function bulkArchiveTestimonials(ids: string[]): Promise<{ success?: boolean; error?: string }> {
  const supabase = createServerClient();
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { error: 'Not authenticated.' };

    const { error } = await (supabase.from('testimonials' as any) as any)
      .update({
        is_published: false,
        sort_order: -1,
        updated_at: new Date().toISOString(),
      })
      .in('id', ids);

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error('bulkArchiveTestimonials error:', err);
    return { error: err?.message || 'Failed to bulk archive testimonials.' };
  }
}
