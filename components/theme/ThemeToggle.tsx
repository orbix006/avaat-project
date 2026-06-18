'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  // Ensure SSR safety to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder of matching size to prevent layout shift and keep SSR clean
    return (
      <div className="w-9 h-9 border border-gold/10 rounded-full" aria-hidden="true" />
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative p-2 rounded-full border border-gold-dark/20 dark:border-gold/20 hover:border-gold-dark/50 dark:hover:border-gold/50 bg-warm-black/5 dark:bg-warm-black/40 hover:bg-gold-dark/5 dark:hover:bg-gold/5 transition-all focus:outline-none focus:ring-2 focus:ring-gold-dark dark:focus:ring-gold focus:ring-offset-2 focus:ring-offset-warm-black w-9 h-9 flex items-center justify-center group"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {/* Sun Icon */}
        <Sun className="h-4.5 w-4.5 transition-all duration-500 text-gold-dark dark:text-gold transform rotate-0 scale-100 dark:-rotate-90 dark:scale-0 absolute" />
        
        {/* Moon Icon */}
        <Moon className="h-4.5 w-4.5 transition-all duration-500 text-gold-dark dark:text-gold transform rotate-90 scale-0 dark:rotate-0 dark:scale-100 absolute" />
      </div>
    </button>
  );
}
