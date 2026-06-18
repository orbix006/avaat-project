'use server';

import { createServerClient } from '../supabase/server';
import { format } from 'date-fns';

export interface ReportDateRange {
  from: string; // ISO string
  to: string;   // ISO string
}

export async function fetchReportData(dateRange: ReportDateRange, statusFilter?: string) {
  const supabase = createServerClient();

  // 1. Fetch data within range. Hard limiting to 5000 for safety as requested.
  let leadsQuery = supabase
    .from('consultation_requests')
    .select('*')
    .gte('created_at', dateRange.from)
    .lte('created_at', dateRange.to)
    .limit(5000);

  if (statusFilter && statusFilter !== 'All') {
    leadsQuery = leadsQuery.eq('status', statusFilter.toLowerCase());
  }

  const { data: rawLeads } = await leadsQuery;
  
  const { data: rawSubscribers } = await supabase
    .from('newsletter_subscribers')
    .select('*')
    .gte('created_at', dateRange.from)
    .lte('created_at', dateRange.to)
    .limit(5000);

  const leads = (rawLeads || []) as any[];
  const subscribers = (rawSubscribers || []) as any[];

  // --- LEAD REPORTS AGGREGATION ---
  const totalLeads = leads.length;
  
  // Calculate Volume Trend (Grouping by day for charts)
  const leadTrendMap = new Map<string, number>();
  // Project Type Distribution
  const projectTypeMap = new Map<string, number>();
  
  leads.forEach(lead => {
    const dayStr = format(new Date(lead.created_at), 'MMM dd');
    leadTrendMap.set(dayStr, (leadTrendMap.get(dayStr) || 0) + 1);

    const typeStr = lead.project_type || 'unspecified';
    projectTypeMap.set(typeStr, (projectTypeMap.get(typeStr) || 0) + 1);
  });

  const leadTrendChart = Array.from(leadTrendMap.entries())
    .map(([date, count]) => ({ date, value: count }))
    .reverse(); // Chronological if iteration was reverse, but date mapping usually isn't ordered safely, so we assume chronological from DB. Actually, we should ideally sort by date string.
  
  // To ensure chronological:
  leadTrendChart.sort((a, b) => new Date(`${a.date} ${new Date().getFullYear()}`).getTime() - new Date(`${b.date} ${new Date().getFullYear()}`).getTime());

  const projectTypeChart = Array.from(projectTypeMap.entries()).map(([name, value]) => ({
    name: name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value
  }));

  // --- CONVERSION REPORTS AGGREGATION ---
  const wonLeads = leads.filter(l => l.status === 'completed').length;
  const lostLeads = leads.filter(l => l.status === 'archived').length;
  const contactedLeads = leads.filter(l => l.status !== 'pending').length;
  
  const winRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : '0.0';

  const funnelChart = [
    { name: 'New Inquiries', value: totalLeads },
    { name: 'Contacted', value: contactedLeads },
    { name: 'Won Deals', value: wonLeads }
  ];

  // Win/Loss Trend
  const winLossMap = new Map<string, { won: number, lost: number }>();
  leads.forEach(lead => {
    if (lead.status === 'completed' || lead.status === 'archived') {
      const dayStr = format(new Date(lead.created_at), 'MMM dd');
      const current = winLossMap.get(dayStr) || { won: 0, lost: 0 };
      if (lead.status === 'completed') current.won++;
      if (lead.status === 'archived') current.lost++;
      winLossMap.set(dayStr, current);
    }
  });

  const winLossChart = Array.from(winLossMap.entries())
    .map(([date, stats]) => ({ date, ...stats }))
    .sort((a, b) => new Date(`${a.date} ${new Date().getFullYear()}`).getTime() - new Date(`${b.date} ${new Date().getFullYear()}`).getTime());


  // --- NEWSLETTER REPORTS AGGREGATION ---
  const totalSubscribers = subscribers.length;
  const activeSubscribers = subscribers.filter(s => s.is_active).length;
  const inactiveSubscribers = totalSubscribers - activeSubscribers;
  
  const subscriberTrendMap = new Map<string, number>();
  subscribers.forEach(sub => {
    const dayStr = format(new Date(sub.created_at), 'MMM dd');
    subscriberTrendMap.set(dayStr, (subscriberTrendMap.get(dayStr) || 0) + 1);
  });

  const subscriberGrowthChart = Array.from(subscriberTrendMap.entries())
    .map(([date, newSubs]) => ({ date, newSubs }))
    .sort((a, b) => new Date(`${a.date} ${new Date().getFullYear()}`).getTime() - new Date(`${b.date} ${new Date().getFullYear()}`).getTime());

  // Cumulative calculation
  let runningTotal = 0;
  subscriberGrowthChart.forEach(day => {
    runningTotal += day.newSubs;
    (day as any).cumulative = runningTotal;
  });

  return {
    rawLeads: leads, // Needed for CSV export
    rawSubscribers: subscribers, // Needed for CSV export
    leads: {
      total: totalLeads,
      trendChart: leadTrendChart,
      projectTypeChart: projectTypeChart
    },
    conversions: {
      winRate,
      wonTotal: wonLeads,
      lostTotal: lostLeads,
      funnelChart,
      winLossChart
    },
    newsletter: {
      total: totalSubscribers,
      active: activeSubscribers,
      inactive: inactiveSubscribers,
      growthChart: subscriberGrowthChart
    }
  };
}
