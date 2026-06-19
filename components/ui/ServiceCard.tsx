'use client';
import { motion } from 'framer-motion';

import {
  Sparkles,
  Compass,
  Hammer,
  Layout,
  Box,
  Layers,
  Palette,
  Shield,
  Building,
  Heart,
  Award,
  PenTool,
  Home,
} from 'lucide-react';
import { Service as DBService } from '@/types/database';
import { Service as StaticService } from '@/types/service';
import { cn } from '@/lib/utils';

const LucideIconMap: Record<string, any> = {
  Sparkles,
  Compass,
  Hammer,
  Layout,
  Box,
  Layers,
  Palette,
  Shield,
  Building,
  Heart,
  Award,
  PenTool,
  Home,
};

interface ServiceCardProps {
  service: DBService | StaticService;
  index?: number;
  className?: string;
}

// Dynamically retrieves and renders the appropriate icon based on name, inline SVG, or fallback
const renderServiceIcon = (iconName: string | null | undefined, iconSvg: string | null | undefined) => {
  // 1. If inline SVG is provided, render it safely
  if (iconSvg) {
    return (
      <div
        className="w-5 h-5 text-gold flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:stroke-current"
        dangerouslySetInnerHTML={{ __html: iconSvg }}
      />
    );
  }

  // 2. If icon name is provided, look it up in Lucide icons map
  if (iconName) {
    const LucideIconComponent = LucideIconMap[iconName];
    if (LucideIconComponent) {
      return <LucideIconComponent className="w-5 h-5 text-gold stroke-[1.5]" />;
    }
  }

  // 3. Fallback: Luxury themed Sparkles icon if no matching icon is found
  return <Sparkles className="w-5 h-5 text-gold stroke-[1.5]" />;
};

export function ServiceCard({ service, index = 0, className }: ServiceCardProps) {
  // Staggered reveal delay animation calculation
  const animationDelay = index * 0.08;

  // Fallback to description if shortDescription is missing, with a final luxury text fallback if both are empty
  const displayDescription =
    (('shortDescription' in service && service.shortDescription) || service.description) ||
    'Bespoke design curation and spatial execution services tailored to your aesthetic vision.';

  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, delay: animationDelay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
      className={cn(
        'group relative p-8 md:p-10 bg-warm-black border border-gold/10 hover:border-gold/30 hover:shadow-[0_20px_50px_rgba(201,168,76,0.06)] transition-all duration-500 flex flex-col h-full overflow-hidden',
        className
      )}
    >
      {/* Corner Bracket Accents (Top-Left & Bottom-Right) for high-end feel */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-gold/0 group-hover:border-gold/30 transition-all duration-500 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-gold/0 group-hover:border-gold/30 transition-all duration-500 pointer-events-none" />

      {/* Luxury gold glow sweep inside card on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Icon frame with micro-glow */}
      <div className="w-12 h-12 border border-gold/25 group-hover:border-gold/50 bg-onyx/50 flex items-center justify-center text-gold transition-colors duration-300 mb-8 flex-shrink-0 relative">
        <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <span className="relative z-10">
          {renderServiceIcon(service.iconName, 'iconSvg' in service ? service.iconSvg : undefined)}
        </span>
      </div>

      {/* Service Title */}
      <h3 className="font-cormorant text-2xl text-ivory group-hover:text-gold transition-colors duration-300 mb-3 font-normal tracking-wide">
        {service.title}
      </h3>

      {/* Description */}
      <p className="font-jost text-sm text-muted leading-relaxed mb-8 flex-grow font-light">
        {displayDescription}
      </p>

    </motion.div>
  );
}