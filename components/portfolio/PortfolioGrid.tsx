'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { PortfolioFilters, PortfolioFilterValue } from '@/components/portfolio/PortfolioFilters';
import { PublishedProject } from '@/types/database';
import { cn } from '@/lib/utils';

interface PortfolioGridProps {
  projects: PublishedProject[];
  heading?: string;
  eyebrow?: string;
  showFilters?: boolean;
  className?: string;
  /** When true renders fewer cards (for homepage preview) */
  preview?: boolean;
}

export function PortfolioGrid({
  projects,
  heading = 'Selected Projects',
  eyebrow = 'Our Work',
  showFilters = true,
  className,
  preview = false,
}: PortfolioGridProps) {
  const [activeFilter, setActiveFilter] = useState<PortfolioFilterValue>('all');

  const filtered =
    activeFilter === 'all'
      ? projects
      : projects.filter((p) => p.category?.toLowerCase() === activeFilter);

  const displayList = preview ? filtered.slice(0, 6) : filtered;

  return (
    <div className={cn('container mx-auto px-4 sm:px-6 lg:px-8', className)}>
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 mb-14">
        <SectionHeading eyebrow={eyebrow} heading={heading} />
        {showFilters && (
          <PortfolioFilters active={activeFilter} onChange={setActiveFilter} />
        )}
      </div>

      {displayList.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
        >
          <AnimatePresence mode="popLayout">
            {displayList.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
              >
                <ProjectCard project={project} index={i} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="text-center py-24 border border-dashed border-gold/10 bg-warm-black/20">
          <p className="font-jost text-sm text-muted tracking-wide">
            No projects in this category are available at the moment.
          </p>
        </div>
      )}
    </div>
  );
}