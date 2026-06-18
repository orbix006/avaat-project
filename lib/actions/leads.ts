'use server';

import { createServerClient } from '../supabase/server';
import { Database } from '@/types/database';
import { mapUiToDbStatus, mapDbToUiStatus, UiStatus } from '../utils/leadStatusMapper';
import { logActivity } from '../logger';
export type LeadRow = Database['public']['Tables']['consultation_requests']['Row'];
export type LeadHistoryRow = Database['public']['Tables']['consultation_status_history']['Row'];

export interface LeadWithUiStatus extends Omit<LeadRow, 'status'> {
  uiStatus: UiStatus;
}

export async function fetchLeads(params: {
  search?: string;
  status?: UiStatus | 'All';
  page?: number;
  limit?: number;
  sortColumn?: string;
  sortOrder?: 'asc' | 'desc';
}) {
  const supabase = createServerClient();
  const page = params.page || 1;
  const limit = params.limit || 10;
  const offset = (page - 1) * limit;

  let query = supabase
    .from('consultation_requests')
    .select('*', { count: 'exact' });

  if (params.search) {
    query = query.or(`name.ilike.%${params.search}%,email.ilike.%${params.search}%,phone.ilike.%${params.search}%,message.ilike.%${params.search}%`);
  }

  if (params.status && params.status !== 'All') {
    if (params.status === 'Closed') {
      query = query.in('status', ['completed', 'in_progress', 'cancelled']);
    } else {
      const dbStatus = mapUiToDbStatus(params.status);
      query = query.eq('status', dbStatus);
    }
  }

  if (params.sortColumn) {
    query = query.order(params.sortColumn, { ascending: params.sortOrder === 'asc' });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  query = query.range(offset, offset + limit - 1);

  const { data, count, error } = await query;

  if (error) {
    return { success: false, error: error.message };
  }

  const leadsWithUiStatus: LeadWithUiStatus[] = ((data as LeadRow[]) || []).map((lead) => ({
    ...lead,
    uiStatus: mapDbToUiStatus(lead.status, lead.internal_notes),
  }));

  return {
    success: true,
    data: leadsWithUiStatus,
    count: count || 0,
    totalPages: Math.ceil((count || 0) / limit),
  };
}

export async function fetchLeadHistory(consultationId: string) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('consultation_status_history')
    .select('*')
    .eq('consultation_id', consultationId)
    .order('created_at', { ascending: false });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function updateLeadStatus(id: string, newUiStatus: UiStatus, note?: string) {
  const supabase = createServerClient();
  
  // Get current lead
  const { data: currentLeadRaw, error: fetchError } = await supabase
    .from('consultation_requests')
    .select('*')
    .eq('id', id)
    .single();
    
  if (fetchError || !currentLeadRaw) {
    return { success: false, error: fetchError?.message || 'Lead not found' };
  }

  const currentLead = currentLeadRaw as LeadRow;

  const currentUiStatus = mapDbToUiStatus(currentLead.status, currentLead.internal_notes);
  if (currentUiStatus === newUiStatus && !note) {
    return { success: true, data: currentLead }; // Nothing to update
  }

  const newDbStatus = mapUiToDbStatus(newUiStatus);
  
  // Update lead
  const { data: updatedLeadRaw, error: updateError } = await (supabase
    .from('consultation_requests') as any)
    .update({ 
      status: newDbStatus,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  const updatedLead = updatedLeadRaw as LeadRow;

  // Add history record
  const historyNotes = [];
  if (currentUiStatus !== newUiStatus) {
    historyNotes.push(`Status changed from ${currentUiStatus} to ${newUiStatus}`);
  }
  if (note) {
    historyNotes.push(note);
  }

  const { error: historyError } = await supabase
    .from('consultation_status_history')
    .insert({
      consultation_id: id,
      old_status: currentLead.status,
      new_status: newDbStatus,
      notes: historyNotes.join(' | '),
    } as any);

  if (historyError) {
    console.error('Failed to insert history record:', historyError);
    // Don't fail the whole operation if history insert fails, but log it
  }

  // Global Activity Log
  await logActivity({
    actionType: 'update',
    entityType: 'lead',
    description: `Updated lead status for ${currentLead.name || currentLead.email} to ${newUiStatus}`,
    entityId: id,
    metadata: { oldStatus: currentUiStatus, newStatus: newUiStatus, note }
  });

  return { 
    success: true, 
    data: {
      ...updatedLead,
      uiStatus: mapDbToUiStatus(updatedLead.status, updatedLead.internal_notes)
    } 
  };
}

export async function updateLeadNotes(id: string, notes: string) {
  const supabase = createServerClient();
  const { data: rawData, error } = await (supabase
    .from('consultation_requests') as any)
    .update({ 
      internal_notes: notes,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  await logActivity({
    actionType: 'update',
    entityType: 'lead',
    description: `Updated internal notes for lead ID ${id}`,
    entityId: id
  });

  return { success: true, data: rawData as LeadRow };
}

export async function deleteLead(id: string) {
  const supabase = createServerClient();
  
  // Get lead info for logging
  const { data: currentLead } = (await supabase
    .from('consultation_requests')
    .select('*')
    .eq('id', id)
    .maybeSingle()) as any;

  const { error } = await supabase
    .from('consultation_requests')
    .delete()
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  await logActivity({
    actionType: 'delete',
    entityType: 'lead',
    description: `Deleted lead for ${currentLead?.name || currentLead?.email || id}`,
    entityId: id
  });

  return { success: true };
}
