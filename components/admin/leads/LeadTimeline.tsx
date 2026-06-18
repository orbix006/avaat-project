'use client';

import React, { useEffect, useState } from 'react';
import { fetchLeadHistory, LeadHistoryRow } from '@/lib/actions/leads';
import { Loader2, Activity, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function LeadTimeline({ consultationId }: { consultationId: string }) {
  const [history, setHistory] = useState<LeadHistoryRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadHistory() {
      setLoading(true);
      const res = await fetchLeadHistory(consultationId);
      if (res.success && res.data && isMounted) {
        setHistory(res.data);
      }
      if (isMounted) setLoading(false);
    }
    loadHistory();
    return () => { isMounted = false; };
  }, [consultationId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-6">
        <Loader2 className="w-5 h-5 text-gold animate-spin" />
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-6 text-muted text-xs">
        <Activity className="w-6 h-6 mx-auto mb-2 opacity-20" />
        No activity recorded yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {history.map((item, idx) => (
        <div key={item.id} className="relative pl-6 pb-4 last:pb-0">
          {/* Timeline Line */}
          {idx !== history.length - 1 && (
            <div className="absolute left-2.5 top-5 bottom-0 w-px bg-gold/15" />
          )}
          
          {/* Timeline Dot */}
          <div className="absolute left-1.5 top-1.5 w-2 h-2 rounded-full bg-gold shadow-[0_0_8px_rgba(212,175,55,0.4)]" />
          
          {/* Content */}
          <div className="bg-onyx/50 border border-gold/5 rounded p-3 text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-ivory">Activity Log</span>
              <span className="text-[10px] text-muted flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {format(new Date(item.created_at), 'MMM d, yyyy HH:mm')}
              </span>
            </div>
            {item.notes ? (
              <p className="text-muted leading-relaxed whitespace-pre-wrap">{item.notes}</p>
            ) : (
              <p className="text-muted italic">No notes provided.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
