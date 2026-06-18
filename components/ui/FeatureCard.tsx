'use client';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index?: number;
  className?: string;
}

export function FeatureCard({ icon: Icon, title, description, index = 0, className }: FeatureCardProps) {
  // Staggered delay for scroll-reveal animation
  const delay = index * 0.08;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      className={cn(
        'group relative p-8 md:p-10 bg-warm-black border border-gold/10 hover:border-gold/30 hover:shadow-[0_15px_40px_rgba(201,168,76,0.04)] transition-all duration-500 flex flex-col h-full overflow-hidden',
        className
      )}
    >
      {/* Top golden border stripe on hover */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gold/0 group-hover:bg-gold/30 transition-colors duration-500" />

      {/* Luxury corner highlight brackets on hover */}
      <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-gold/0 group-hover:border-gold/20 transition-all duration-500 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-gold/0 group-hover:border-gold/20 transition-all duration-500 pointer-events-none" />

      {/* Inner luxury radial gold gradient sweep */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Icon Frame with micro-glow */}
      <div className="w-12 h-12 border border-gold/20 group-hover:border-gold/45 bg-onyx flex items-center justify-center text-gold transition-colors duration-300 mb-8 flex-shrink-0 relative">
        <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        <Icon className="w-5 h-5 text-gold relative z-10 stroke-[1.5]" />
      </div>

      {/* Title */}
      <h3 className="font-cormorant text-2xl text-ivory group-hover:text-gold transition-colors duration-300 mb-4 font-normal tracking-wide">
        {title}
      </h3>

      {/* Description */}
      <p className="font-jost text-sm text-muted leading-relaxed flex-grow font-light">
        {description}
      </p>
    </motion.div>
  );
}
