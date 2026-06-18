'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { SectionHeading } from '@/components/ui/SectionHeading';

const STEPS = [
  {
    number: '01',
    title: 'Discovery',
    description:
      'We explore your lifestyle, spatial needs, and design aspirations to establish a bespoke project brief.',
  },
  {
    number: '02',
    title: 'Concept Design',
    description:
      'We curate inspiration boards, material direction, and schematic layouts to capture the vision.',
  },
  {
    number: '03',
    title: 'Design Development',
    description:
      'We refine the direction with detailed 3D renderings, bespoke details, and technical layouts.',
  },
  {
    number: '04',
    title: 'Execution',
    description:
      'We manage precision procurement, coordinate artisans, and oversee site work to ensure flawless build quality.',
  },
  {
    number: '05',
    title: 'Final Delivery',
    description:
      'Curating final art, bespoke accessories, and custom details before presenting your completed space.',
  },
];

export function ProcessSkeleton() {
  return (
    <section className="section-pad bg-onyx relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 animate-pulse select-none">
        <div className="text-center mb-24">
          <div className="h-4 w-20 bg-gold/5 mx-auto mb-3 rounded" />
          <div className="h-10 w-80 bg-ivory/5 mx-auto mb-6 rounded" />
          <div className="h-4 w-[450px] bg-muted/5 mx-auto rounded hidden md:block" />
        </div>

        <div className="relative">
          {/* Horizontal Line track placeholder for desktop */}
          <div className="hidden lg:block absolute top-[28px] left-[10%] right-[10%] h-px bg-gold/5 z-0 pointer-events-none" />

          {/* Grid layout */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 relative z-10">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                {/* Node badge */}
                <div className="w-14 h-14 rounded-full border border-gold/10 bg-onyx/50 flex items-center justify-center mb-8" />
                {/* Title */}
                <div className="h-5 w-24 bg-ivory/5 mb-3 rounded" />
                {/* Description */}
                <div className="h-3 w-full bg-muted/5 mb-2 rounded" />
                <div className="h-3 w-4/5 bg-muted/5 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Process() {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: '-80px' });

  return (
    <section id="process" className="section-pad bg-onyx relative overflow-hidden">
      {/* Background Soft Glow */}
      <div className="absolute right-0 bottom-1/4 w-[400px] h-[400px] rounded-full bg-gold/[0.01] blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-24">
          <SectionHeading
            eyebrow="Our Journey"
            heading="The Design Process"
            subheading="A refined, bespoke methodology guiding your architectural project from blank canvas to completed masterpiece."
            center
          />
        </div>

        <div ref={containerRef} className="relative">
          {/* ─────────────────── DESKTOP HORIZONTAL TIMELINE ─────────────────── */}
          
          {/* Desktop Background line track */}
          <div className="hidden lg:block absolute top-[28px] left-[10%] right-[10%] h-px bg-gold/10 z-0 pointer-events-none" />
          
          {/* Desktop Animated gold progress line indicator */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: 'left' }}
            className="hidden lg:block absolute top-[28px] left-[10%] right-[10%] h-px bg-gradient-to-r from-gold/30 via-gold to-gold/30 z-0 pointer-events-none"
          />

          <div className="hidden lg:grid grid-cols-5 gap-8 relative z-10">
            {STEPS.map((step, idx) => (
              <div key={step.number} className="flex flex-col items-center text-center group">
                
                {/* Stage node circular number badge */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={inView ? { scale: 1, opacity: 1 } : {}}
                  transition={{
                    delay: idx * 0.15 + 0.25,
                    duration: 0.6,
                    ease: [0.34, 1.56, 0.64, 1], // bouncy visual pop
                  }}
                  className="w-14 h-14 rounded-full border border-gold/30 group-hover:border-gold bg-onyx flex items-center justify-center font-cormorant text-gold text-lg z-10 hover:shadow-[0_0_20px_rgba(201,168,76,0.25)] transition-all duration-500 cursor-default"
                >
                  {step.number}
                </motion.div>

                {/* Stage Text Content */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: idx * 0.15 + 0.45, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-8"
                >
                  <h3 className="font-cormorant text-xl text-ivory group-hover:text-gold transition-colors duration-300 mb-3 font-normal tracking-wide">
                    {step.title}
                  </h3>
                  <p className="font-jost text-xs text-muted leading-relaxed font-light px-2">
                    {step.description}
                  </p>
                </motion.div>

              </div>
            ))}
          </div>

          {/* ─────────────────── MOBILE VERTICAL TIMELINE ─────────────────── */}
          
          {/* Mobile Background line track */}
          <div className="lg:hidden absolute left-[27px] top-6 bottom-6 w-px bg-gold/10 z-0 pointer-events-none" />
          
          {/* Mobile Animated gold progress line indicator */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: 'top' }}
            className="lg:hidden absolute left-[27px] top-6 bottom-6 w-px bg-gradient-to-b from-gold/30 via-gold to-gold/30 z-0 pointer-events-none"
          />

          <div className="lg:hidden flex flex-col gap-10 relative z-10">
            {STEPS.map((step, idx) => (
              <div key={step.number} className="flex gap-6 items-start group">
                
                {/* Stage node circular number badge */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={inView ? { scale: 1, opacity: 1 } : {}}
                  transition={{
                    delay: idx * 0.12 + 0.2,
                    duration: 0.55,
                    ease: [0.34, 1.56, 0.64, 1],
                  }}
                  className="w-14 h-14 rounded-full border border-gold/30 group-hover:border-gold bg-onyx flex items-center justify-center font-cormorant text-gold text-lg z-10 flex-shrink-0 hover:shadow-[0_0_15px_rgba(201,168,76,0.2)] transition-all duration-300 cursor-default"
                >
                  {step.number}
                </motion.div>

                {/* Stage Text Content */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: idx * 0.12 + 0.35, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="pt-2"
                >
                  <h3 className="font-cormorant text-2xl text-ivory group-hover:text-gold transition-colors duration-300 mb-2 font-normal tracking-wide">
                    {step.title}
                  </h3>
                  <p className="font-jost text-sm text-muted leading-relaxed font-light max-w-md">
                    {step.description}
                  </p>
                </motion.div>

              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}