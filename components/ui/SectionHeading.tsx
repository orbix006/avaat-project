'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';
import { GoldDivider } from './GoldDivider';

interface SectionHeadingProps {
  eyebrow?: string;
  heading: string;
  subheading?: string; // Support existing usages
  subtext?: string;    // Support requested subtext prop
  center?: boolean;
  light?: boolean;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  heading,
  subheading,
  subtext,
  center = false,
  light = false,
  className,
}: SectionHeadingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const finalSubtext = subtext || subheading;

  // Split heading into words for staggered scroll reveal
  const words = heading.split(' ');

  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-col mb-10',
        center ? 'items-center text-center' : 'items-start',
        className
      )}
    >
      {eyebrow && (
        <div className="overflow-hidden mb-3">
          <motion.span
            initial={{ y: '100%', opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="eyebrow block"
          >
            {eyebrow}
          </motion.span>
        </div>
      )}

      <div className="overflow-hidden">
        <motion.h2
          className={cn(
            'font-cormorant text-4xl md:text-5xl lg:text-7xl leading-tight font-normal mb-0 tracking-wide',
            light ? 'text-onyx' : 'text-ivory'
          )}
        >
          {words.map((word, idx) => (
            <motion.span
              key={idx}
              className="inline-block mr-[0.25em] last:mr-0"
              initial={{ y: '80%', opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : {}}
              transition={{
                duration: 0.8,
                delay: idx * 0.05 + 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {word}
            </motion.span>
          ))}
        </motion.h2>
      </div>

      <GoldDivider center={center} className="my-6" />

      {finalSubtext && (
        <div className={cn('overflow-hidden', center ? 'mx-auto max-w-2xl' : 'max-w-2xl')}>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              'font-jost text-base md:text-lg leading-relaxed font-light',
              light ? 'text-onyx/75' : 'text-muted'
            )}
          >
            {finalSubtext}
          </motion.p>
        </div>
      )}
    </div>
  );
}