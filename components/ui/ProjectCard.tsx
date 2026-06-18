'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { PublishedProject } from '@/types/database';
import { Project as StaticProject } from '@/types/project';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: PublishedProject | StaticProject;
  index?: number;
  className?: string;
}

// Map slug/category keys to customer-facing capitalised labels
const categoryLabels: Record<string, string> = {
  residential: 'Residential',
  commercial: 'Commercial',
  architecture: 'Architecture',
  hospitality: 'Hospitality',
  renovation: 'Renovation',
};

export function ProjectCard({ project, index = 0, className }: ProjectCardProps) {
  // Staggered delay logic for entry reveal animation
  const delay = index * 0.08;

  // Resolve category fallback
  const resolvedCategory = project.category
    ? categoryLabels[project.category.toLowerCase()] ||
      project.category.charAt(0).toUpperCase() + project.category.slice(1)
    : 'Bespoke Design';

  // Resolve location/city fallback text
  const locationText = (() => {
    const proj = project as any;
    if (proj.location && proj.city) {
      return `${proj.location}, ${proj.city}`;
    }
    if (proj.location) {
      return proj.location;
    }
    if (proj.client) {
      return proj.client;
    }
    return 'AVAAT Curation';
  })();

  const projectYear = 'completionYear' in project ? project.completionYear : project.year;

  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn('group flex flex-col h-full', className)}
    >
      <Link href={`/portfolio/${project.slug}`} className="flex flex-col h-full">
        {/* Main Cover Image Block with relative parent */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-onyx border border-gold/10 hover:border-gold/30 transition-colors duration-500">
          
          {project.coverImage ? (
            /* Next.js optimized Image loader */
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-105"
              priority={index < 3}
            />
          ) : (
            /* Premium design placeholder if coverImage is missing */
            <div className="absolute inset-0 bg-gradient-to-br from-onyx via-warm-black to-gold/15 flex flex-col items-center justify-center p-6 text-center select-none">
              <span className="font-cormorant text-2xl text-gold tracking-widest uppercase mb-2">AVAAT</span>
              <span className="font-jost text-[9px] text-muted/60 tracking-[0.40em] uppercase">Bespoke Concept</span>
            </div>
          )}

          {/* Luxury Hover Overlay Screen */}
          <div className="absolute inset-0 bg-onyx/0 group-hover:bg-onyx/65 transition-all duration-500 flex items-center justify-center">
            <span className="inline-flex items-center gap-2.5 border border-gold text-gold font-jost text-[10px] tracking-[0.25em] uppercase px-6 py-3 bg-onyx/20 backdrop-blur-sm translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-[450ms] ease-out">
              <span>View Project</span>
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[1.5]" />
            </span>
          </div>

          {/* Luxury Category Badge */}
          <div className="absolute top-4 left-4 z-10">
            <span className="font-jost text-[9px] tracking-[0.20em] uppercase bg-gold text-onyx px-3 py-1.5 font-medium shadow-md">
              {resolvedCategory}
            </span>
          </div>
        </div>

        {/* Project Meta Info Row */}
        <div className="pt-5 flex flex-col flex-grow">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <h3 className="font-cormorant text-2xl text-ivory group-hover:text-gold transition-colors duration-300 font-normal tracking-wide leading-tight">
                {project.title}
              </h3>
              <p className="font-jost text-xs text-muted/80 mt-1.5 font-light tracking-wide">
                {locationText} {projectYear ? `\u00B7 ${projectYear}` : ''}
              </p>
            </div>
            {/* Minimal Icon shortcut trigger */}
            <span className="w-8 h-8 rounded-full border border-gold/10 group-hover:border-gold/30 flex items-center justify-center text-muted group-hover:text-gold transition-all duration-300 flex-shrink-0 mt-1">
              <ArrowUpRight className="w-4 h-4 stroke-[1.5]" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}