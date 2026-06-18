'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GoldDividerProps {
  className?: string;
  center?: boolean;
}

export function GoldDivider({ className, center = false }: GoldDividerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <div
      ref={ref}
      className={cn(
        'flex items-center gap-3 my-8 h-3 select-none',
        center ? 'justify-center mx-auto' : 'justify-start',
        className
      )}
    >
      {/* Left Line */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={inView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
        style={{ transformOrigin: center ? 'right' : 'left' }}
        className="w-12 h-px bg-gradient-to-r from-transparent to-gold"
      />

      {/* Diamond Center */}
      <motion.div
        initial={{ scale: 0, rotate: 0, opacity: 0 }}
        animate={inView ? { scale: 1, rotate: 45, opacity: 1 } : {}}
        transition={{ duration: 0.6, ease: [0.175, 0.885, 0.32, 1.275] }}
        className="w-1.5 h-1.5 bg-gold border border-gold"
      />

      {/* Right Line */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={inView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
        style={{ transformOrigin: 'left' }}
        className="w-12 h-px bg-gradient-to-l from-transparent to-gold"
      />
    </div>
  );
}