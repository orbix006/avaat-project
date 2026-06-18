import React, { Suspense } from 'react';
import Link from 'next/link';
import { fetchDashboardData } from '@/lib/actions/dashboard';
import { DashboardCharts } from '@/components/admin/dashboard/DashboardCharts';
import {
  FolderGit2,
  Inbox,
  TrendingUp,
  Users,
  CheckCircle2
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface KPICardProps {
  title: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  href: string;
}

function KPICard({ title, value, icon: Icon, description, href }: KPICardProps) {
  return (
    <Link href={href} className="bg-warm-black border border-gold/10 hover:border-gold/30 rounded-xl p-6 transition-all duration-300 relative group overflow-hidden block">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-bl-full pointer-events-none group-hover:bg-gold/10 transition-colors" />
      <div className="flex justify-between items-start">
        <div className="p-3 bg-gold/10 rounded-lg text-gold group-hover:bg-gold group-hover:text-onyx transition-colors duration-300">
          <Icon className="w-5 h-5" />
        </div>
        <div className="text-[10px] text-gold font-semibold tracking-wider uppercase border border-gold/20 px-2 py-0.5 rounded group-hover:bg-gold group-hover:text-onyx transition-colors duration-300">
          Manage
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-xs text-muted tracking-wider uppercase font-medium">{title}</h3>
        <p className="text-3xl font-cormorant font-bold text-ivory mt-1">{value}</p>
        <p className="text-[11px] text-muted/80 mt-2">{description}</p>
      </div>
    </Link>
  );
}

// Separate component for data fetching so we can wrap in Suspense
async function DashboardContent() {
  const { metrics, charts } = await fetchDashboardData();

  return (
    <>
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <KPICard
          title="Total Projects"
          value={metrics.totalProjects}
          icon={FolderGit2}
          description="Total design projects in database"
          href="/admin/projects"
        />
        <KPICard
          title="Published Projects"
          value={metrics.publishedProjects}
          icon={CheckCircle2}
          description="Projects visible on public site"
          href="/admin/projects"
        />
        <KPICard
          title="Total Leads"
          value={metrics.totalLeads}
          icon={Inbox}
          description="Total consultation inquiries"
          href="/admin/leads"
        />
        <KPICard
          title="Total Visitors"
          value={metrics.totalVisitors}
          icon={TrendingUp}
          description="Total page views recorded"
          href="/admin/dashboard"
        />
        <KPICard
          title="Total Registered Users"
          value={metrics.totalUsers}
          icon={Users}
          description="Total registered admin and user profiles"
          href="/admin/dashboard"
        />
      </div>

      {/* Recharts KPI Visualizations */}
      <DashboardCharts 
        monthlyVisitors={charts.monthlyVisitors}
        leadsThisMonth={charts.leadsThisMonth}
        newUsersThisMonth={charts.newUsersThisMonth}
      />
    </>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-warm-black border border-gold/10 rounded-xl p-6 h-40 animate-pulse">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 bg-gold/10 rounded-lg" />
              <div className="w-16 h-5 bg-gold/10 rounded" />
            </div>
            <div className="mt-4 space-y-2">
              <div className="w-24 h-4 bg-onyx rounded" />
              <div className="w-16 h-8 bg-gold/20 rounded" />
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-warm-black border border-gold/10 rounded-xl p-6 h-80 animate-pulse" />
        <div className="bg-warm-black border border-gold/10 rounded-xl p-6 h-80 animate-pulse" />
        <div className="bg-warm-black border border-gold/10 rounded-xl p-6 h-80 animate-pulse lg:col-span-2" />
      </div>
    </>
  );
}
