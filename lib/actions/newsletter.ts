'use server';

import { createServerClient } from '../supabase/server';
import { Database } from '@/types/database';
import { logActivity } from '../logger';

export type NewsletterSubscriberRow = Database['public']['Tables']['newsletter_subscribers']['Row'];

export async function fetchSubscribers(params: {
  search?: string;
  status?: 'All' | 'Subscribed' | 'Unsubscribed';
  page?: number;
  limit?: number;
}) {
  const supabase = createServerClient();
  const page = params.page || 1;
  const limit = params.limit || 10;
  const offset = (page - 1) * limit;

  let query = supabase
    .from('newsletter_subscribers')
    .select('*', { count: 'exact' });

  if (params.search) {
    query = query.or(`email.ilike.%${params.search}%,source.ilike.%${params.search}%`);
  }

  if (params.status && params.status !== 'All') {
    query = query.eq('is_active', params.status === 'Subscribed');
  }

  query = query.order('created_at', { ascending: false });
  query = query.range(offset, offset + limit - 1);

  const { data, count, error } = await query;

  if (error) {
    return { success: false, error: error.message };
  }

  return {
    success: true,
    data: data as NewsletterSubscriberRow[],
    count: count || 0,
    totalPages: Math.ceil((count || 0) / limit),
  };
}

export async function fetchAllSubscribersForExport(params: {
  search?: string;
  status?: 'All' | 'Subscribed' | 'Unsubscribed';
}) {
  const supabase = createServerClient();

  let query = supabase
    .from('newsletter_subscribers')
    .select('*');

  if (params.search) {
    query = query.or(`email.ilike.%${params.search}%,source.ilike.%${params.search}%`);
  }

  if (params.status && params.status !== 'All') {
    query = query.eq('is_active', params.status === 'Subscribed');
  }

  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: data as NewsletterSubscriberRow[] };
}

export async function fetchNewsletterStats() {
  const supabase = createServerClient();

  // 1. Total Subscribers (Active)
  const { count: totalActive, error: err1 } = await supabase
    .from('newsletter_subscribers')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  if (err1) return { success: false, error: err1.message };

  const now = new Date();
  
  // Start of current month
  const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  
  // Start of previous month
  const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
  
  // End of previous month (which is startOfCurrentMonth essentially)

  // 2. New Subscribers This Month (Active)
  const { count: newThisMonth, error: err2 } = await supabase
    .from('newsletter_subscribers')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)
    .gte('created_at', startOfCurrentMonth);

  if (err2) return { success: false, error: err2.message };

  // 3. New Subscribers Last Month (Active)
  const { count: newLastMonth, error: err3 } = await supabase
    .from('newsletter_subscribers')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)
    .gte('created_at', startOfPrevMonth)
    .lt('created_at', startOfCurrentMonth);

  if (err3) return { success: false, error: err3.message };

  // 4. Growth Percentage Calculation
  let growthPercentage = 0;
  if (newLastMonth && newLastMonth > 0) {
    growthPercentage = ((newThisMonth || 0) - newLastMonth) / newLastMonth * 100;
  } else if ((newThisMonth || 0) > 0) {
    growthPercentage = 100; // Infinity essentially, but we represent as 100%
  }

  return {
    success: true,
    data: {
      totalSubscribers: totalActive || 0,
      newThisMonth: newThisMonth || 0,
      growthPercentage: Math.round(growthPercentage),
    }
  };
}

export async function deleteSubscribers(ids: string[]) {
  const supabase = createServerClient();
  const { error } = await supabase
    .from('newsletter_subscribers')
    .delete()
    .in('id', ids);

  if (error) {
    return { success: false, error: error.message };
  }

  await logActivity({
    actionType: 'delete',
    entityType: 'newsletter',
    description: `Deleted ${ids.length} newsletter subscriber(s).`
  });

  return { success: true };
}

export async function updateSubscriberStatus(id: string, isActive: boolean) {
  const supabase = createServerClient();
  const { error } = await (supabase
    .from('newsletter_subscribers') as any)
    .update({ 
      is_active: isActive,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  await logActivity({
    actionType: 'update',
    entityType: 'newsletter',
    description: `Updated subscriber status to ${isActive ? 'Active' : 'Inactive'}`,
    entityId: id
  });

  return { success: true };
}
