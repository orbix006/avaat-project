'use client';
import { ReactNode } from 'react';

export function LenisProvider({ children }: { children: ReactNode }) {
  // Lenis smooth scrolling disabled to restore native scroll responsiveness
  return <>{children}</>;
}