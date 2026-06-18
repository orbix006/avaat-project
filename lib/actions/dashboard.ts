'use server';

import { createServerClient } from '../supabase/server';
import { format, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, startOfDay, endOfDay } from 'date-fns';

export async function fetchDashboardData() {
  const supabase = createServerClient();

  // 1. Fetch total counts
  const [
    { count: totalVisitorsCount, error: visitorsError },
    { count: totalLeadsCount, error: leadsError },
    { count: totalUsersCount, error: usersError },
    { count: totalProjectsCount, error: projectsError },
    { count: publishedProjectsCount, error: publishedProjectsError }
  ] = await Promise.all([
    supabase.from('page_views').select('*', { count: 'exact', head: true }),
    supabase.from('consultation_requests').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'published')
  ]);

  if (visitorsError) console.error('Error fetching visitors count:', visitorsError);
  if (leadsError) console.error('Error fetching leads count:', leadsError);
  if (usersError) console.error('Error fetching users count:', usersError);
  if (projectsError) console.error('Error fetching projects count:', projectsError);
  if (publishedProjectsError) console.error('Error fetching published projects count:', publishedProjectsError);

  const totalVisitors = totalVisitorsCount || 0;
  const totalLeads = totalLeadsCount || 0;
  const totalUsers = totalUsersCount || 0;
  const totalProjects = totalProjectsCount || 0;
  const publishedProjects = publishedProjectsCount || 0;

  // 2. Fetch data for charts
  const now = new Date();
  const currentMonthStart = startOfMonth(now);
  const currentMonthEnd = endOfMonth(now);
  const sixMonthsAgo = startOfMonth(subMonths(now, 5));

  // Fetch page views for the last 6 months
  const { data: pageViewsRaw, error: pageViewsError } = await supabase
    .from('page_views')
    .select('created_at')
    .gte('created_at', sixMonthsAgo.toISOString());

  if (pageViewsError) console.error('Error fetching page views for chart:', pageViewsError);

  // Fetch leads this month
  const { data: leadsRaw, error: leadsFetchError } = await supabase
    .from('consultation_requests')
    .select('created_at')
    .gte('created_at', currentMonthStart.toISOString())
    .lte('created_at', currentMonthEnd.toISOString());

  if (leadsFetchError) console.error('Error fetching leads for chart:', leadsFetchError);

  // Fetch new users this month
  const { data: usersRaw, error: usersFetchError } = await supabase
    .from('profiles')
    .select('created_at')
    .gte('created_at', currentMonthStart.toISOString())
    .lte('created_at', currentMonthEnd.toISOString());

  if (usersFetchError) console.error('Error fetching new users for chart:', usersFetchError);

  const pageViews = (pageViewsRaw as any[]) || [];
  const leadsThisMonthData = (leadsRaw as any[]) || [];
  const usersThisMonthData = (usersRaw as any[]) || [];

  // Monthly Visitors Chart (last 6 months)
  const monthlyVisitors = [];
  for (let i = 5; i >= 0; i--) {
    const monthDate = subMonths(now, i);
    const mStart = startOfMonth(monthDate);
    const mEnd = endOfMonth(monthDate);
    const count = pageViews.filter(v => {
      const d = new Date(v.created_at);
      return d >= mStart && d <= mEnd;
    }).length;
    
    monthlyVisitors.push({
      name: format(monthDate, 'MMM'),
      visitors: count
    });
  }

  // Days interval for the current month up to today
  const daysInMonth = eachDayOfInterval({ start: currentMonthStart, end: now });

  // Leads This Month (daily breakdown)
  const leadsThisMonth = daysInMonth.map(day => {
    const dayStart = startOfDay(day);
    const dayEnd = endOfDay(day);
    const count = leadsThisMonthData.filter(l => {
      const d = new Date(l.created_at);
      return d >= dayStart && d <= dayEnd;
    }).length;
    return {
      name: format(day, 'dd MMM'),
      leads: count
    };
  });

  // New Users This Month (daily breakdown)
  const newUsersThisMonth = daysInMonth.map(day => {
    const dayStart = startOfDay(day);
    const dayEnd = endOfDay(day);
    const count = usersThisMonthData.filter(u => {
      const d = new Date(u.created_at);
      return d >= dayStart && d <= dayEnd;
    }).length;
    return {
      name: format(day, 'dd MMM'),
      users: count
    };
  });

  return {
    metrics: {
      totalVisitors,
      totalLeads,
      totalUsers,
      totalProjects,
      publishedProjects
    },
    charts: {
      monthlyVisitors,
      leadsThisMonth,
      newUsersThisMonth
    }
  };
}

