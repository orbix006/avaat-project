'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { PublishedProject } from '@/types/database';
import { Project as StaticProject } from '@/types/project';
import { cn } from '@/lib/utils';

type PortfolioProject = PublishedProject | StaticProject;

interface PortfolioClientProps {
  projects: PortfolioProject[];
}

type Filter = 'all' | 'residential' | 'commercial' | 'architecture' | 'hospitality' | 'renovation';

const FILTERS: { label: string; value: Filter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Residential', value: 'residential' },
  { label: 'Commercial', value: 'commercial' },
  { label: 'Architecture', value: 'architecture' },
  { label: 'Hospitality', value: 'hospitality' },
  { label: 'Renovation', value: 'renovation' },
];

export function PortfolioClient({ projects }: PortfolioClientProps) {
  const [activeFilter, setActiveFilter] = useState<Filter>('all');

  // Perform case-insensitive category filtering
  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter((p) => p.category?.toLowerCase() === activeFilter);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      {/* Row containing section heading and custom categorized tabs */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 mb-14">
        <SectionHeading eyebrow="Our Work" heading="Selected Projects" />

        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2.5">
          {FILTERS.map(({ label, value }) => (
            <button
              key={value}
              id={`portfolio-filter-${value}`}
              onClick={() => setActiveFilter(value)}
              className={cn(
                'font-jost text-[10px] tracking-[0.25em] uppercase px-5 py-3 border transition-all duration-300 select-none',
                activeFilter === value
                  ? 'border-gold bg-gold text-onyx font-medium shadow-md shadow-gold/5'
                  : 'border-gold/15 text-muted hover:border-gold/40 hover:text-ivory'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid wrapper with Framer Motion layout transitions */}
      {filteredProjects.length > 0 ? (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, i) => (
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
        /* Empty category state fallback */
        <div className="text-center py-24 border border-dashed border-gold/10 bg-warm-black/20">
          <p className="font-jost text-sm text-muted tracking-wide">
            No projects in this category are available at the moment.
          </p>
        </div>
      )}
    </div>
  );
}
