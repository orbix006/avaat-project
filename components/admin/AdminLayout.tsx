'use client';

import React, { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-onyx text-ivory font-jost flex flex-col md:flex-row relative overflow-hidden">
      {/* Restores the standard system cursor for admin work area */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (pointer: fine) {
          body, a, button, input, select, textarea, iframe, [role="button"] {
            cursor: auto !important;
          }
        }
      `}} />

      {/* Premium ambient decorative gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold/2 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* Sidebar navigation */}
      <AdminSidebar
        mobileSidebarOpen={mobileSidebarOpen}
        setMobileSidebarOpen={setMobileSidebarOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* Workspace panel content wrapper */}
      <div className="flex-1 flex flex-col min-w-0 z-10 relative">
        <AdminHeader setMobileSidebarOpen={setMobileSidebarOpen} />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto relative">
          {children}
        </main>
      </div>
    </div>
  );
}
