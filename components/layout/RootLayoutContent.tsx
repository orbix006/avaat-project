'use client';
import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface RootLayoutContentProps {
  children: ReactNode;
}

export function RootLayoutContent({ children }: RootLayoutContentProps) {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isAdmin = pathname?.startsWith('/admin');
  const isAuth = pathname?.startsWith('/auth');

  return (
    <>
      {!isHome && !isAdmin && !isAuth && <Navbar />}
      <main className="flex-1">{children}</main>
      {!isHome && !isAdmin && !isAuth && <Footer />}
    </>
  );
}
