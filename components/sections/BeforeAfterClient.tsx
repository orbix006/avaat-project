'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactCompareImage from 'react-compare-image';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { PublishedProject } from '@/types/database';
import { cn } from '@/lib/utils';

interface BeforeAfterClientProps {
  projects: PublishedProject[];
}

export function BeforeAfterClient({ projects }: BeforeAfterClientProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeProject = projects[activeIndex];
  const beforeAfter = activeProject.beforeAfter!;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      {/* Selector Navigation if multiple projects exist */}
      {projects.length > 1 && (
        <div className="flex flex-wrap gap-2.5 justify-center mb-14 border-b border-gold/10 pb-6 max-w-2xl mx-auto">
          {projects.map((project, idx) => (
            <button
              key={project.id}
              onClick={() => setActiveIndex(idx)}
              aria-pressed={activeIndex === idx}
              aria-label={`View before/after for ${project.title}`}
              className={cn(
                'font-jost text-[10px] tracking-[0.25em] uppercase px-4 py-2 border transition-all duration-300 select-none',
                activeIndex === idx
                  ? 'border-gold text-gold font-medium bg-gold/5 shadow-md shadow-gold/5'
                  : 'border-transparent text-muted hover:text-ivory'
              )}
            >
              {project.title}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-center">
        
        {/* Left Column: Project Info & Details */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <SectionHeading
            eyebrow="Transformation"
            heading="Refined Spaces"
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeProject.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="space-y-6"
            >
              <div>
                <span className="font-jost text-[9px] tracking-[0.2em] uppercase text-gold">Project</span>
                <h3 className="font-cormorant text-3xl text-ivory mt-1">{activeProject.title}</h3>
                <p className="font-jost text-xs text-muted/75 mt-1.5 font-light">
                  {activeProject.location} {activeProject.city ? `\u00B7 ${activeProject.city}` : ''}
                </p>
              </div>

              {activeProject.shortDescription && (
                <p className="font-jost text-sm text-muted leading-relaxed font-light max-w-md">
                  {activeProject.shortDescription}
                </p>
              )}

              {/* Display custom metrics if they exist in the DB */}
              {beforeAfter.metrics && Array.isArray(beforeAfter.metrics) && beforeAfter.metrics.length > 0 && (
                <div className="border-t border-gold/10 pt-6">
                  <span className="font-jost text-[9px] tracking-[0.2em] uppercase text-muted block mb-4">Key Metrics</span>
                  <div className="grid grid-cols-2 gap-6">
                    {beforeAfter.metrics.map((m: any, idx: number) => {
                      const value = typeof m === 'object' ? m.value : m;
                      const label = typeof m === 'object' ? m.label : 'Result';
                      return (
                        <div key={idx}>
                          <p className="font-cormorant text-2xl text-gold">{value}</p>
                          <p className="font-jost text-[9px] text-muted/60 tracking-wider uppercase mt-1">{label}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Column: Comparative Slider */}
        <div className="lg:col-span-7">
          <div
            role="img"
            aria-label={`Before and after comparison for ${activeProject.title}`}
            className="relative aspect-[4/3] w-full bg-warm-black border border-gold/10 hover:border-gold/25 transition-colors duration-500 shadow-2xl overflow-hidden select-none"
          >
            <ReactCompareImage
              leftImage={beforeAfter.beforeImage}
              rightImage={beforeAfter.afterImage}
              leftImageLabel={beforeAfter.beforeLabel || 'Before'}
              rightImageLabel={beforeAfter.afterLabel || 'After'}
              sliderLineColor="#C9A84C"
              handle={
                <div className="w-10 h-10 rounded-full bg-gold border-2 border-ivory shadow-[0_0_20px_rgba(201,168,76,0.35)] flex items-center justify-center cursor-ew-resize">
                  <svg className="w-3.5 h-3.5 text-onyx" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5 4l-3 4 3 4M11 4l3 4-3 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                  </svg>
                </div>
              }
              sliderLineWidth={1.5}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
