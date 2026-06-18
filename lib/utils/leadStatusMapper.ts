export type DbStatus = 'pending' | 'contacted' | 'in_progress' | 'completed' | 'cancelled';
export type UiStatus = 'New' | 'Contacted' | 'Closed';

export function mapUiToDbStatus(uiStatus: UiStatus): DbStatus {
  switch (uiStatus) {
    case 'New': return 'pending';
    case 'Contacted': return 'contacted';
    case 'Closed': return 'completed';
  }
}

export function mapDbToUiStatus(dbStatus: DbStatus, internalNotes?: string | null): UiStatus {
  if (dbStatus === 'pending') return 'New';
  if (dbStatus === 'contacted') return 'Contacted';
  return 'Closed';
}
