'use server';

import { createServerClient } from './supabase/server';

export type ActionType = 'login' | 'create' | 'update' | 'delete' | 'export';
export type EntityType = 'lead' | 'blog' | 'project' | 'setting' | 'newsletter' | 'system';

interface LogPayload {
  actionType: ActionType;
  entityType: EntityType;
  description: string;
  entityId?: string;
  metadata?: Record<string, any>;
}

/**
 * Global utility for tracking admin actions in the system audit trail.
 */
export async function logActivity({
  actionType,
  entityType,
  description,
  entityId,
  metadata
}: LogPayload) {
  try {
    const supabase = createServerClient();
    
    // In a fully authenticated system, we'd pull the session user ID here.
    // For now, we'll leave admin_id null or hardcode it if auth isn't fully active.
    const { data: userData } = await supabase.auth.getUser();
    const adminId = userData?.user?.id || null;

    const { error } = await (supabase
      .from('activity_logs') as any)
      .insert({
        action_type: actionType,
        entity_type: entityType,
        description,
        entity_id: entityId || null,
        metadata: metadata || null,
        admin_id: adminId
      });

    if (error) {
      console.error('[Logger Error] Failed to insert activity log:', error);
    }
  } catch (err) {
    console.error('[Logger Error] Unexpected failure logging activity:', err);
  }
}
