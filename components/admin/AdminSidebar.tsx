'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FolderGit2,
  Briefcase,
  Inbox,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { signOut, getAdminProfile } from '@/lib/auth';

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const sidebarItems: SidebarItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Projects', href: '/admin/projects', icon: FolderGit2 },
  { label: 'Services', href: '/admin/services', icon: Briefcase },
  { label: 'Leads', href: '/admin/leads', icon: Inbox },
];

interface AdminSidebarProps {
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (_open: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (_collapsed: boolean) => void;
}

export function AdminSidebar({
  mobileSidebarOpen,
  setMobileSidebarOpen,
  isCollapsed,
  setIsCollapsed,
}: AdminSidebarProps) {
  const [fullName, setFullName] = useState<string>('Avaat Admin');
  const [role, setRole] = useState<string>('Super Admin');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const profile = await getAdminProfile();
      if (profile) {
        setFullName(profile.full_name || 'Avaat Admin');
        setRole(profile.role || 'Super Admin');
        setAvatarUrl(profile.avatar_url);
      }
    };

    fetchProfile();

    if (typeof window !== 'undefined') {
      window.addEventListener('admin-profile-updated', fetchProfile);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('admin-profile-updated', fetchProfile);
      }
    };
  }, []);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await signOut();
    router.push('/admin/login');
    router.refresh();
  };

  const sidebarWidthClass = isCollapsed ? 'md:w-20' : 'md:w-64';

  return (
    <>
      {/* Desktop Sidebar */}
      <aside 
        className={`hidden md:flex flex-col h-screen bg-warm-black border-r border-gold/15 shrink-0 z-30 relative justify-between transition-all duration-300 ${sidebarWidthClass}`}
      >
        {/* Toggle Collapse Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute top-7 -right-3.5 bg-onyx border border-gold/20 hover:border-gold text-gold p-1 rounded-full shadow-md z-40 transition-colors focus:outline-none"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>

        <div>
          {/* Logo Header */}
          <div className={`h-20 flex flex-col justify-center border-b border-gold/10 transition-all duration-300 ${isCollapsed ? 'px-4 items-center' : 'px-6'}`}>
            <Link href="/" className="flex items-center gap-2 group">
              <span className={`font-cormorant text-2xl tracking-widest text-gold font-semibold group-hover:text-gold-light transition-all duration-300 ${isCollapsed ? 'scale-75' : ''}`}>
                {isCollapsed ? 'A' : 'AVAAT'}
              </span>
              {!isCollapsed && (
                <span className="text-[9px] bg-gold/10 text-gold font-medium px-1.5 py-0.5 border border-gold/20 tracking-wider uppercase rounded transition-opacity duration-300">
                  Admin
                </span>
              )}
            </Link>
            {!isCollapsed && (
              <span className="text-[10px] text-muted tracking-widest uppercase mt-0.5 animate-in fade-in duration-300">
                Studio Management
              </span>
            )}
          </div>

          {/* Nav Items */}
          <nav className="p-4 space-y-1">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center rounded text-sm tracking-wide transition-all duration-200 group relative ${
                    isCollapsed ? 'justify-center p-3' : 'justify-between px-4 py-3'
                  } ${
                    isActive
                      ? 'bg-gold text-onyx font-semibold shadow-lg shadow-gold/15'
                      : 'text-ivory/70 hover:text-gold hover:bg-gold/5'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-onyx' : 'text-gold'}`} />
                    {!isCollapsed && <span className="animate-in fade-in duration-300">{item.label}</span>}
                  </div>
                  {!isCollapsed && isActive && <ChevronRight className="w-4 h-4 text-onyx animate-in fade-in duration-300" />}

                  {/* Tooltip on Hover in Collapsed Mode */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-3 px-3 py-1.5 bg-warm-black border border-gold/20 text-gold text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl">
                      {item.label}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer User Profile */}
        <div className={`p-4 border-t border-gold/10 bg-onyx/40 transition-all duration-300 ${isCollapsed ? 'flex justify-center' : ''}`}>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3 min-w-0">
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt={fullName} 
                  className="w-9 h-9 rounded-full object-cover border border-gold/30 shrink-0" 
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold font-bold shrink-0">
                  {fullName[0]?.toUpperCase() || 'A'}
                </div>
              )}
              {!isCollapsed && (
                <div className="flex flex-col min-w-0 animate-in fade-in duration-300">
                  <span className="text-xs font-semibold text-ivory truncate">{fullName}</span>
                  <span className="text-[10px] text-muted truncate">{role}</span>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <button
                onClick={handleLogout}
                className="p-2 text-ivory/50 hover:text-red-400 rounded hover:bg-red-500/5 transition-all animate-in fade-in duration-300"
                title="Secure Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
          {isCollapsed && (
            <button
              onClick={handleLogout}
              className="mt-4 p-2 text-ivory/50 hover:text-red-400 rounded hover:bg-red-500/5 transition-all"
              title="Secure Logout"
            >
              <LogOut className="w-4.5 h-4.5" />
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Drawer (Overlay and Menu) */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 md:hidden flex">
          <div className="w-64 bg-warm-black border-r border-gold/15 h-full flex flex-col justify-between p-4 animate-in slide-in-from-left duration-250">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-6 border-b border-gold/10">
                <div className="flex items-center gap-2">
                  <span className="font-cormorant text-2xl tracking-widest text-gold font-semibold">AVAAT</span>
                  <span className="text-[9px] bg-gold/10 text-gold px-1.5 py-0.5 border border-gold/20 tracking-wider uppercase rounded">Admin</span>
                </div>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-2 text-ivory/60 hover:text-gold hover:bg-gold/5 rounded-full focus:outline-none"
                  aria-label="Close drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="mt-6 space-y-1">
                {sidebarItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 rounded text-sm tracking-wide transition-all ${
                        isActive
                          ? 'bg-gold text-onyx font-semibold'
                          : 'text-ivory/70 hover:text-gold hover:bg-gold/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-onyx' : 'text-gold'}`} />
                        <span>{item.label}</span>
                      </div>
                      {isActive && <ChevronRight className="w-4 h-4 text-onyx" />}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Mobile Footer User Profile */}
            <div className="pt-4 border-t border-gold/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  {avatarUrl ? (
                    <img 
                      src={avatarUrl} 
                      alt={fullName} 
                      className="w-8 h-8 rounded-full object-cover border border-gold/30 shrink-0" 
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold font-bold shrink-0">
                      {fullName[0]?.toUpperCase() || 'A'}
                    </div>
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold truncate text-ivory">{fullName}</span>
                    <span className="text-[10px] text-muted truncate">{role}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-ivory/50 hover:text-red-400 rounded focus:outline-none"
                  title="Secure Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          {/* Dismiss Helper Area */}
          <div className="flex-1" onClick={() => setMobileSidebarOpen(false)} />
        </div>
      )}
    </>
  );
}
