'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  Bell, 
  Search, 
  Menu
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

const headerTitles: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/projects': 'Projects Directory',
  '/admin/services': 'Studio Services',
  '/admin/leads': 'Consultation Leads',
};

interface AdminHeaderProps {
  setMobileSidebarOpen: (_open: boolean) => void;
}

export function AdminHeader({ setMobileSidebarOpen }: AdminHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const pathname = usePathname();

  const activeTitle = headerTitles[pathname] || 'Admin Panel';

  return (
    <>
      {/* Mobile Top bar header */}
      <header className="md:hidden w-full bg-warm-black border-b border-gold/10 px-4 py-3 flex items-center justify-between z-20 relative">
        <div className="flex items-center gap-2.5">
          <Image
            src="/images/logo.png"
            alt="Avaat Design Logo"
            width={24}
            height={24}
            className="h-6 w-auto object-contain"
            priority
          />
          <span className="font-cormorant text-sm tracking-wider text-ivory font-semibold uppercase">
            Avaat Design
          </span>
          <span className="text-[8px] bg-gold/10 text-gold px-1.5 py-0.5 border border-gold/20 tracking-wider uppercase rounded">Admin</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 text-ivory/80 hover:text-gold transition-colors focus:outline-none"
            aria-label="Open navigation drawer"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Desktop / Tablet Header */}
      <header className="hidden md:flex items-center justify-between h-20 px-8 border-b border-gold/10 bg-warm-black/95 sticky top-0 backdrop-blur-md z-20">
        {/* Dynamic page title */}
        <div>
          <h1 className="font-cormorant text-2xl font-bold tracking-wide text-ivory transition-all duration-300">
            {activeTitle}
          </h1>
          <p className="text-[11px] text-muted tracking-wider uppercase">Avaat Design Workspace</p>
        </div>

        {/* Right side operational widgets */}
        <div className="flex items-center gap-6">
          {/* Quick Search Input */}
          <div className="relative group">
            <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-gold transition-colors" />
            <input
              type="text"
              placeholder="Search resources..."
              className="bg-onyx border border-gold/15 text-xs text-ivory rounded-full pl-9 pr-4 py-2 w-56 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all duration-300 placeholder:text-muted/60"
            />
          </div>

          {/* Notification dropdown toggle */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-ivory/70 hover:text-gold rounded-full hover:bg-gold/5 transition-all focus:outline-none"
            >
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gold rounded-full ring-2 ring-warm-black animate-pulse" />
            </button>

            {showNotifications && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowNotifications(false)} />
                <div className="absolute right-0 mt-3 w-80 bg-warm-black border border-gold/20 rounded-lg shadow-xl py-2 z-40 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-gold/10 flex justify-between items-center">
                    <span className="text-xs font-semibold text-gold tracking-wider uppercase">Notifications</span>
                    <span className="text-[10px] bg-gold/10 text-gold px-1.5 py-0.5 rounded">2 New</span>
                  </div>
                  <div className="max-h-60 overflow-y-auto divide-y divide-gold/5">
                    <div className="px-4 py-3 hover:bg-gold/5 transition-colors cursor-pointer">
                      <p className="text-xs text-ivory font-medium">New lead inquiry from Sarah Jenkins</p>
                      <p className="text-[10px] text-muted mt-1">10 minutes ago • Projects Consultation</p>
                    </div>
                    <div className="px-4 py-3 hover:bg-gold/5 transition-colors cursor-pointer">
                      <p className="text-xs text-ivory font-medium">Newsletter sign-up: david@arc.io</p>
                      <p className="text-[10px] text-muted mt-1">2 hours ago • Marketing</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <ThemeToggle />

          {/* Site quick preview link */}
          <Link
            href="/"
            target="_blank"
            className="text-xs border border-gold/20 hover:border-gold px-4 py-2 text-gold hover:bg-gold/5 font-semibold tracking-wider uppercase rounded transition-all duration-200"
          >
            View Site
          </Link>
        </div>
      </header>
    </>
  );
}
