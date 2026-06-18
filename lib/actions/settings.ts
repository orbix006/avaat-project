'use server';

import { createServerClient } from '../supabase/server';
import { Database } from '@/types/database';

export type SiteSettingRow = Database['public']['Tables']['site_settings']['Row'];

/**
 * Fetches all site settings from the database
 */
export async function fetchSiteSettings(): Promise<{ data?: SiteSettingRow[]; error?: string }> {
  const supabase = createServerClient();
  try {
    const { data, error } = await (supabase
      .from('site_settings' as any) as any)
      .select('*');

    if (error) throw error;
    return { data: data || [] };
  } catch (err: any) {
    console.error('fetchSiteSettings error:', err);
    return { error: err?.message || 'Failed to fetch site settings.' };
  }
}

/**
 * Batch updates (upserts) site settings keys
 */
export async function updateSiteSettings(
  settings: Record<string, string | null>
): Promise<{ success?: boolean; error?: string }> {
  const supabase = createServerClient();
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { error: 'Not authenticated.' };

    const payload = Object.entries(settings).map(([key, value]) => {
      // Determine group name based on key
      let group_name = 'general';
      let label = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

      if (['meta_title', 'meta_description', 'seo_keywords'].includes(key)) {
        group_name = 'seo';
        if (key === 'meta_title') label = 'Meta Title';
        if (key === 'meta_description') label = 'Meta Description';
        if (key === 'seo_keywords') label = 'Keywords';
      } else if (['social_instagram', 'social_facebook', 'social_linkedin', 'social_pinterest'].includes(key)) {
        group_name = 'social';
        if (key === 'social_instagram') label = 'Instagram';
        if (key === 'social_facebook') label = 'Facebook';
        if (key === 'social_linkedin') label = 'LinkedIn';
        if (key === 'social_pinterest') label = 'Pinterest';
      } else if (key === 'google_analytics_id') {
        group_name = 'analytics';
        label = 'Google Analytics ID';
      } else {
        if (key === 'site_name') label = 'Site Name';
        if (key === 'tagline') label = 'Tagline';
        if (key === 'contact_email') label = 'Contact Email';
        if (key === 'contact_phone') label = 'Phone';
        if (key === 'contact_address') label = 'Address';
      }

      return {
        key,
        value: value !== '' ? value : null,
        group_name,
        label,
        updated_by: user.id,
        updated_at: new Date().toISOString(),
      };
    });

    const { error } = await (supabase
      .from('site_settings' as any) as any)
      .upsert(payload);

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error('updateSiteSettings error:', err);
    return { error: err?.message || 'Failed to update site settings.' };
  }
}
