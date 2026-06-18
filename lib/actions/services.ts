'use server';

import { createServerClient } from '../supabase/server';
import { Database } from '@/types/database';

export type ServiceRow = Database['public']['Tables']['services']['Row'];

/**
 * Fetches all services ordered by sort_order
 */
export async function fetchServices(): Promise<{ data?: ServiceRow[]; error?: string }> {
  const supabase = createServerClient();
  try {
    const { data, error } = await (supabase
      .from('services' as any) as any)
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return { data: data || [] };
  } catch (err: any) {
    console.error('fetchServices error:', err);
    return { error: err?.message || 'Failed to fetch services.' };
  }
}

export async function createService(data: {
  title: string;
  slug: string;
  service_type: ServiceRow['service_type'];
  short_desc: string;
  long_desc: string | null;
  icon_name: string | null;
  cover_image: string | null;
  sort_order: number;
  is_active: boolean;
}): Promise<{ success?: boolean; data?: ServiceRow; error?: string }> {
  const supabase = createServerClient();
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { error: 'Not authenticated.' };

    const { data: newService, error } = await (supabase
      .from('services' as any) as any)
      .insert({
        title: data.title,
        slug: data.slug,
        service_type: data.service_type,
        short_desc: data.short_desc,
        long_desc: data.long_desc,
        icon_name: data.icon_name,
        cover_image: data.cover_image,
        is_active: data.is_active,
        sort_order: data.sort_order || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select('*')
      .single();

    if (error) throw error;
    return { success: true, data: newService };
  } catch (err: any) {
    console.error('createService error:', err);
    return { error: err?.message || 'Failed to create service.' };
  }
}

/**
 * Updates an existing service
 */
export async function updateService(id: string, data: {
  title: string;
  slug: string;
  service_type: ServiceRow['service_type'];
  short_desc: string;
  long_desc: string | null;
  icon_name: string | null;
  cover_image: string | null;
  sort_order: number;
  is_active: boolean;
}): Promise<{ success?: boolean; data?: ServiceRow; error?: string }> {
  const supabase = createServerClient();
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { error: 'Not authenticated.' };

    const { data: updatedService, error } = await (supabase
      .from('services' as any) as any)
      .update({
        title: data.title,
        slug: data.slug,
        service_type: data.service_type,
        short_desc: data.short_desc,
        long_desc: data.long_desc,
        icon_name: data.icon_name,
        cover_image: data.cover_image,
        is_active: data.is_active,
        sort_order: data.sort_order,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    return { success: true, data: updatedService };
  } catch (err: any) {
    console.error('updateService error:', err);
    return { error: err?.message || 'Failed to update service.' };
  }
}

/**
 * Deletes a service
 */
export async function deleteService(id: string): Promise<{ success?: boolean; error?: string }> {
  const supabase = createServerClient();
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { error: 'Not authenticated.' };

    const { error } = await (supabase
      .from('services' as any) as any)
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error('deleteService error:', err);
    return { error: err?.message || 'Failed to delete service.' };
  }
}

/**
 * Reorders services by updating their sort_order values
 */
export async function reorderServices(serviceOrders: { id: string; sort_order: number }[]): Promise<{ success?: boolean; error?: string }> {
  const supabase = createServerClient();
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { error: 'Not authenticated.' };

    for (const item of serviceOrders) {
      await (supabase
        .from('services' as any) as any)
        .update({ sort_order: item.sort_order })
        .eq('id', item.id);
    }

    return { success: true };
  } catch (err: any) {
    console.error('reorderServices error:', err);
    return { error: err?.message || 'Failed to save reorder changes.' };
  }
}
