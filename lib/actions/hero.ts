'use server';

import { createServerClient } from '../supabase/server';
import { Database } from '@/types/database';

export type HeroSlideRow = Database['public']['Tables']['hero_slides']['Row'];

/**
 * Fetches all hero slides ordered by sort_order
 */
export async function fetchHeroSlides(): Promise<{ data?: HeroSlideRow[]; error?: string }> {
  const supabase = createServerClient();
  try {
    const { data, error } = await (supabase
      .from('hero_slides' as any) as any)
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data: data || [] };
  } catch (err: any) {
    console.error('fetchHeroSlides error:', err);
    return { error: err?.message || 'Failed to fetch hero slides.' };
  }
}

/**
 * Creates a new hero slide
 */
export async function createHeroSlide(data: {
  heading_line1: string | null;
  heading_line2: string | null;
  media_url: string;
  media_type: 'image' | 'video';
  overlay_color: string;
  overlay_opacity: number;
  cta_text: string | null;
  cta_link: string | null;
  is_active: boolean;
}): Promise<{ success?: boolean; data?: HeroSlideRow; error?: string }> {
  const supabase = createServerClient();
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { error: 'Not authenticated.' };

    // Get the highest current sort_order to append correctly
    const { data: currentItems } = await (supabase
      .from('hero_slides' as any) as any)
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1);

    const nextSortOrder = currentItems && currentItems.length > 0 ? (currentItems[0].sort_order + 1) : 0;

    const { data: newSlide, error } = await (supabase
      .from('hero_slides' as any) as any)
      .insert({
        heading_line1: data.heading_line1,
        heading_line2: data.heading_line2,
        media_url: data.media_url,
        media_type: data.media_type,
        overlay_color: data.overlay_color,
        overlay_opacity: data.overlay_opacity,
        cta_text: data.cta_text,
        cta_link: data.cta_link,
        is_active: data.is_active,
        sort_order: nextSortOrder,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select('*')
      .single();

    if (error) throw error;
    return { success: true, data: newSlide };
  } catch (err: any) {
    console.error('createHeroSlide error:', err);
    return { error: err?.message || 'Failed to create hero slide.' };
  }
}

/**
 * Updates an existing hero slide
 */
export async function updateHeroSlide(
  id: string,
  data: {
    heading_line1: string | null;
    heading_line2: string | null;
    media_url: string;
    media_type: 'image' | 'video';
    overlay_color: string;
    overlay_opacity: number;
    cta_text: string | null;
    cta_link: string | null;
    is_active: boolean;
  }
): Promise<{ success?: boolean; data?: HeroSlideRow; error?: string }> {
  const supabase = createServerClient();
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { error: 'Not authenticated.' };

    const { data: updatedSlide, error } = await (supabase
      .from('hero_slides' as any) as any)
      .update({
        heading_line1: data.heading_line1,
        heading_line2: data.heading_line2,
        media_url: data.media_url,
        media_type: data.media_type,
        overlay_color: data.overlay_color,
        overlay_opacity: data.overlay_opacity,
        cta_text: data.cta_text,
        cta_link: data.cta_link,
        is_active: data.is_active,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    return { success: true, data: updatedSlide };
  } catch (err: any) {
    console.error('updateHeroSlide error:', err);
    return { error: err?.message || 'Failed to update hero slide.' };
  }
}

/**
 * Deletes a hero slide
 */
export async function deleteHeroSlide(id: string): Promise<{ success?: boolean; error?: string }> {
  const supabase = createServerClient();
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { error: 'Not authenticated.' };

    const { error } = await (supabase
      .from('hero_slides' as any) as any)
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error('deleteHeroSlide error:', err);
    return { error: err?.message || 'Failed to delete hero slide.' };
  }
}

/**
 * Reorders hero slides by updating their sort_order values
 */
export async function reorderHeroSlides(slideOrders: { id: string; sort_order: number }[]): Promise<{ success?: boolean; error?: string }> {
  const supabase = createServerClient();
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { error: 'Not authenticated.' };

    for (const item of slideOrders) {
      await (supabase
        .from('hero_slides' as any) as any)
        .update({ sort_order: item.sort_order })
        .eq('id', item.id);
    }

    return { success: true };
  } catch (err: any) {
    console.error('reorderHeroSlides error:', err);
    return { error: err?.message || 'Failed to save reorder changes.' };
  }
}
