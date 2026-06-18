'use server';

import { createServerClient } from '../supabase/server';
import { ActionType, EntityType } from '../logger';

export async function fetchActivityLogs(params: {
  search?: string;
  actionType?: ActionType | 'All';
  entityType?: EntityType | 'All';
  page?: number;
  limit?: number;
}) {
  const supabase = createServerClient();
  const page = params.page || 1;
  const limit = params.limit || 50;
  const offset = (page - 1) * limit;

  let query = supabase
    .from('activity_logs')
    .select('*', { count: 'exact' });

  if (params.search) {
    query = query.ilike('description', `%${params.search}%`);
  }

  if (params.actionType && params.actionType !== 'All') {
    query = query.eq('action_type', params.actionType);
  }

  if (params.entityType && params.entityType !== 'All') {
    query = query.eq('entity_type', params.entityType);
  }

  query = query.order('created_at', { ascending: false });
  query = query.range(offset, offset + limit - 1);

  const { data, count, error } = await query;

  if (error) {
    return { success: false, error: error.message };
  }

  return {
    success: true,
    data: (data as any[]) || [],
    count: count || 0,
    totalPages: Math.ceil((count || 0) / limit),
  };
}
