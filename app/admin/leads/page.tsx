'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { 
  Inbox, 
  Search, 
  Mail, 
  Phone, 
  Calendar, 
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  Save,
  Clock,
  DollarSign,
  Globe,
  Trash2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { fetchLeads, updateLeadStatus, updateLeadNotes, deleteLead, LeadWithUiStatus } from '@/lib/actions/leads';
import { UiStatus } from '@/lib/utils/leadStatusMapper';
import LeadTimeline from '@/components/admin/leads/LeadTimeline';
import { format } from 'date-fns';

const STATUSES: (UiStatus | 'All')[] = ['All', 'New', 'Contacted', 'Closed'];

export default function LeadsAdminPage() {
  const [leads, setLeads] = useState<LeadWithUiStatus[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<UiStatus | 'All'>('All');
  const [page, setPage] = useState(1);
  
  // Selection & Details
  const [selectedLead, setSelectedLead] = useState<LeadWithUiStatus | null>(null);
  const [notes, setNotes] = useState('');
  const [isPending, startTransition] = useTransition();
  const [statusChangeNote, setStatusChangeNote] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset page on search
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Fetch leads
  const loadLeads = async () => {
    setLoading(true);
    const res = await fetchLeads({
      search: debouncedSearch,
      status: statusFilter,
      page,
      limit: 10,
    });
    if (res.success && res.data) {
      setLeads(res.data);
      setTotalCount(res.count);
      setTotalPages(res.totalPages);
      
      // Update selected lead if it's currently selected
      if (selectedLead) {
        const updated = res.data.find(l => l.id === selectedLead.id);
        if (updated) setSelectedLead(updated);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadLeads();
  }, [debouncedSearch, statusFilter, page]);

  const handleSelectLead = (lead: LeadWithUiStatus) => {
    setSelectedLead(lead);
    setNotes(lead.internal_notes || '');
    setStatusChangeNote('');
  };

  const handleStatusChange = (newStatus: UiStatus) => {
    if (!selectedLead) return;
    
    startTransition(async () => {
      const res = await updateLeadStatus(selectedLead.id, newStatus, statusChangeNote);
      if (res.success && res.data) {
        setStatusChangeNote('');
        loadLeads(); // reload list
        showNotification('success', 'Lead status updated successfully.');
        
        // Refresh notes in case they changed internally
        if (res.data.internal_notes) {
          setNotes(res.data.internal_notes);
        }
      } else {
        showNotification('error', 'Failed to update status: ' + res.error);
      }
    });
  };

  const handleSaveNotes = async () => {
    if (!selectedLead) return;
    startTransition(async () => {
      const res = await updateLeadNotes(selectedLead.id, notes);
      if (res.success) {
        loadLeads();
        showNotification('success', 'Internal notes saved successfully.');
      } else {
        showNotification('error', 'Failed to save notes: ' + res.error);
      }
    });
  };

  const handleDeleteLead = async (id: string) => {
    if (confirm('Are you sure you want to delete this lead?')) {
      startTransition(async () => {
        const res = await deleteLead(id);
        if (res.success) {
          if (selectedLead?.id === id) {
            setSelectedLead(null);
          }
          loadLeads();
          showNotification('success', 'Lead deleted successfully.');
        } else {
          showNotification('error', 'Failed to delete lead: ' + res.error);
        }
      });
    }
  };

  const getStatusColor = (status: UiStatus) => {
    switch (status) {
      case 'New': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'Contacted': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Closed': return 'bg-green-500/10 text-green-400 border-green-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 h-full flex flex-col">
      {/* Toast Notification HUD */}
      {notification && (
        <div className={`fixed top-6 right-6 z-50 p-4 rounded-xl border flex items-center gap-3 shadow-2xl animate-in slide-in-from-top-4 duration-300 ${
          notification.type === 'success' 
            ? 'bg-green-950/90 text-green-400 border-green-500/30' 
            : 'bg-red-950/90 text-red-400 border-red-500/30'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="text-xs font-semibold">{notification.message}</span>
        </div>
      )}

      {/* Header Panel */}
      <div className="flex justify-between items-end shrink-0">
        <div>
          <h2 className="font-cormorant text-2xl md:text-3xl font-bold text-ivory">Lead Management CRM</h2>
          <p className="text-xs text-muted mt-1">Track and manage consultation requests from prospective clients.</p>
        </div>
        <button 
          onClick={() => loadLeads()} 
          className="text-xs text-muted hover:text-gold flex items-center gap-1.5 transition-colors"
          disabled={loading}
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin text-gold' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Control Bar */}
      <div className="bg-warm-black border border-gold/10 rounded-xl p-4 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
        {/* Search */}
        <div className="relative w-full md:w-80 group">
          <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-gold transition-colors" />
          <input
            type="text"
            placeholder="Search leads by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-onyx border border-gold/15 text-xs text-ivory rounded pl-9 pr-4 py-2 w-full focus:outline-none focus:border-gold transition-all placeholder:text-muted/60"
          />
        </div>

        {/* Status Filters */}
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto scrollbar-none py-1">
          {STATUSES.map((status) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setPage(1);
              }}
              className={`text-[11px] px-4 py-1.5 rounded transition-all shrink-0 uppercase tracking-wider font-semibold border ${
                statusFilter === status
                  ? 'bg-gold text-onyx border-gold shadow-lg shadow-gold/20'
                  : 'bg-onyx text-ivory/60 hover:text-gold border-gold/10'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1 min-h-0">
        {/* LEFT PANEL: Leads List Table */}
        <div className="lg:col-span-8 bg-warm-black border border-gold/10 rounded-xl overflow-hidden flex flex-col h-[650px]">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-onyx/50 border-b border-gold/10 text-muted uppercase text-[10px] tracking-wider font-semibold">
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Email</th>
                  <th className="py-4 px-6">Phone</th>
                  <th className="py-4 px-6">Service Requested</th>
                  <th className="py-4 px-6">Message</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/5 text-xs relative">
                {loading && leads.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-20 text-center text-muted">
                      <Loader2 className="w-6 h-6 animate-spin text-gold mx-auto mb-2" />
                      Loading CRM data...
                    </td>
                  </tr>
                ) : leads.length > 0 ? (
                  leads.map((lead) => (
                    <tr 
                      key={lead.id} 
                      onClick={() => handleSelectLead(lead)}
                      className={`hover:bg-gold/5 transition-colors cursor-pointer ${
                        selectedLead?.id === lead.id ? 'bg-gold/5 border-l-2 border-l-gold' : ''
                      }`}
                    >
                      <td className="py-4 px-6 font-semibold text-ivory text-xs">{lead.name}</td>
                      <td className="py-4 px-6 text-muted text-xs">{lead.email}</td>
                      <td className="py-4 px-6 text-muted text-xs">{lead.phone}</td>
                      <td className="py-4 px-6 text-xs">
                        <span className="text-[10px] bg-gold/10 text-gold px-2 py-0.5 rounded border border-gold/15 w-fit font-medium capitalize">
                          {lead.project_type ? lead.project_type.replace(/_/g, ' ') : 'N/A'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-muted text-xs truncate max-w-[150px]" title={lead.message || ''}>
                        {lead.message || '—'}
                      </td>
                      <td className="py-4 px-6 text-muted text-xs">
                        <div className="flex items-center gap-1.5 whitespace-nowrap">
                          <Calendar className="w-3.5 h-3.5 text-gold shrink-0" />
                          <span>{format(new Date(lead.created_at), 'MMM d, yyyy')}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase border ${getStatusColor(lead.uiStatus)}`}>
                          {lead.uiStatus}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleSelectLead(lead)}
                            className="p-1 text-muted hover:text-gold hover:bg-gold/5 rounded transition-all"
                            title="View Lead Details"
                          >
                            <Inbox className="w-4 h-4" />
                          </button>
                          {lead.uiStatus === 'New' && (
                            <button
                              onClick={() => {
                                startTransition(async () => {
                                  const res = await updateLeadStatus(lead.id, 'Contacted', 'Marked as contacted from quick action');
                                  if (res.success) {
                                    loadLeads();
                                    showNotification('success', 'Lead marked as Contacted.');
                                  }
                                });
                              }}
                              className="p-1 text-muted hover:text-gold hover:bg-gold/5 rounded transition-all"
                              title="Mark Contacted"
                            >
                              <CheckCircle2 className="w-4 h-4 text-green-400" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteLead(lead.id)}
                            className="p-1 text-muted hover:text-red-400 hover:bg-red-500/5 rounded transition-all"
                            title="Delete Lead"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-muted">
                      No matching inquiry records found.
                    </td>
                  </tr>
                )}
                
                {/* Loading Overlay for pagination */}
                {loading && leads.length > 0 && (
                  <tr className="absolute inset-0 bg-warm-black/50 backdrop-blur-[1px] flex items-center justify-center z-10 w-full h-full">
                    <td>
                      <Loader2 className="w-6 h-6 animate-spin text-gold" />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="border-t border-gold/10 p-4 flex items-center justify-between bg-onyx/30 shrink-0">
              <span className="text-[11px] text-muted">
                Showing page <span className="text-ivory font-semibold">{page}</span> of {totalPages} ({totalCount} total)
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded border border-gold/20 text-ivory hover:text-gold hover:bg-gold/10 disabled:opacity-30 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-1.5 rounded border border-gold/20 text-ivory hover:text-gold hover:bg-gold/10 disabled:opacity-30 transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANEL: Lead Detailed Inspector Card */}
        <div className="lg:col-span-4 bg-warm-black border border-gold/10 rounded-xl p-6 h-[650px] overflow-y-auto custom-scrollbar flex flex-col justify-between">
          {selectedLead ? (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Header Info */}
              <div className="flex justify-between items-start pb-4 border-b border-gold/10">
                <div>
                  <h3 className="font-cormorant text-2xl font-bold text-gold line-clamp-1">{selectedLead.name}</h3>
                  <p className="text-[10px] text-muted tracking-wider uppercase mt-1">Lead ID: {selectedLead.id.split('-')[0]}</p>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(selectedLead.uiStatus)}`}>
                  {selectedLead.uiStatus}
                </span>
              </div>

              {/* CRM Contact Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] text-muted uppercase tracking-wider font-semibold">Email</span>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gold shrink-0" />
                    <a href={`mailto:${selectedLead.email}`} className="text-ivory hover:text-gold truncate" title={selectedLead.email}>
                      {selectedLead.email}
                    </a>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-muted uppercase tracking-wider font-semibold">Phone</span>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gold shrink-0" />
                    <a href={`tel:${selectedLead.phone}`} className="text-ivory hover:text-gold">
                      {selectedLead.phone}
                    </a>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-muted uppercase tracking-wider font-semibold">Location</span>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gold shrink-0" />
                    <span className="text-ivory">{selectedLead.project_location || 'Not provided'}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-muted uppercase tracking-wider font-semibold">Created</span>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gold shrink-0" />
                    <span className="text-ivory">{format(new Date(selectedLead.created_at), 'MMM d, yyyy')}</span>
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div className="bg-onyx/40 border border-gold/10 p-4 rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted uppercase tracking-wider font-semibold">Project Type</span>
                    <p className="text-ivory text-xs font-semibold capitalize">
                      {selectedLead.project_type ? selectedLead.project_type.replace(/_/g, ' ') : 'Unspecified'}
                    </p>
                  </div>
                  <div className="space-y-1 text-right">
                    <span className="text-[10px] text-muted uppercase tracking-wider font-semibold">Budget Range</span>
                    <p className="text-ivory text-xs flex items-center gap-1 justify-end">
                      <DollarSign className="w-3 h-3 text-gold" />
                      {selectedLead.budget_range ? selectedLead.budget_range.replace(/_/g, ' ').toUpperCase() : 'Unspecified'}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-1.5 pt-2 border-t border-gold/5">
                  <span className="text-[10px] text-muted uppercase tracking-wider font-semibold flex items-center gap-1">
                    <MessageSquare className="w-3 h-3 text-gold" />
                    Client Message
                  </span>
                  <div className="text-xs text-ivory/90 leading-relaxed bg-onyx p-3 rounded border border-gold/5 max-h-24 overflow-y-auto custom-scrollbar">
                    {selectedLead.message || <span className="text-muted italic">No message provided.</span>}
                  </div>
                </div>
              </div>

              {/* Workflow Status Editor */}
              <div className="space-y-3 pt-4 border-t border-gold/10">
                <span className="text-[10px] text-muted uppercase tracking-wider font-semibold">Change Workflow Status</span>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={statusChangeNote}
                    onChange={(e) => setStatusChangeNote(e.target.value)}
                    placeholder="Optional note for status change..."
                    className="flex-1 bg-onyx border border-gold/15 text-xs text-ivory rounded px-3 py-2 focus:outline-none focus:border-gold transition-all placeholder:text-muted/50"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {STATUSES.filter(s => s !== 'All').map((status) => (
                    <button 
                      key={status}
                      type="button"
                      onClick={() => handleStatusChange(status as UiStatus)}
                      disabled={isPending || selectedLead.uiStatus === status}
                      className={`px-2 py-2 text-[9px] font-bold uppercase tracking-wider rounded transition-all border ${
                        selectedLead.uiStatus === status
                          ? `${getStatusColor(status as UiStatus)} ring-1 ring-gold/30 opacity-100 cursor-default`
                          : 'bg-onyx text-muted border-transparent hover:border-gold/30 hover:text-ivory'
                      } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Internal Notes */}
              <div className="space-y-2 pt-4 border-t border-gold/10">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-muted uppercase tracking-wider font-semibold">Internal Notes</span>
                  <button 
                    onClick={handleSaveNotes}
                    disabled={isPending || notes === (selectedLead.internal_notes || '')}
                    className="text-[10px] bg-gold/10 hover:bg-gold/20 text-gold px-3 py-1 rounded border border-gold/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 font-semibold uppercase tracking-wider"
                  >
                    {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                    Save Notes
                  </button>
                </div>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Private notes about this lead..."
                  className="w-full bg-onyx border border-gold/15 text-xs text-ivory rounded p-3 min-h-[80px] focus:outline-none focus:border-gold transition-all placeholder:text-muted/40 custom-scrollbar"
                />
              </div>

              {/* Activity Timeline */}
              <div className="pt-4 border-t border-gold/10">
                <span className="text-[10px] text-muted uppercase tracking-wider font-semibold block mb-2">Lead Activity Timeline</span>
                <LeadTimeline consultationId={selectedLead.id} />
              </div>

            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-muted space-y-3 opacity-60">
              <div className="w-16 h-16 rounded-full bg-onyx border border-gold/10 flex items-center justify-center mb-2 mx-auto">
                <Inbox className="w-8 h-8 text-gold/30" />
              </div>
              <p className="text-sm font-semibold text-ivory">No Lead Selected</p>
              <p className="text-xs max-w-[250px] mx-auto">Select a lead from the table to view consultation details, update work status, and track history.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
