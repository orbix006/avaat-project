'use client';
import { Sparkles, Fingerprint, Eye, Hammer } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { FeatureCard } from '@/components/ui/FeatureCard';

const REASONS = [
  {
    icon: Sparkles,
    title: 'Design Excellence',
    description:
      'We craft award-winning spaces blending clean architectural lines, spatial functionality, and luxury aesthetics.',
  },
  {
    icon: Fingerprint,
    title: 'Personalized Approach',
    description:
      'We co-create your spaces, tailoring every design detail to reflect your personality, lifestyle, and unique choices.',
  },
  {
    icon: Eye,
    title: 'Transparent Process',
    description:
      'Complete transparency from the start: detailed material schedules, fixed project budgets, and routine client updates.',
  },
  {
    icon: Hammer,
    title: 'End-to-End Execution',
    description:
      'From preliminary sketches to structural engineering, artisan coordination, and styling handover.',
  },
];

export function WhyAvaat() {
  return (
    <section id="why-avaat" className="section-pad bg-onyx relative overflow-hidden">
      {/* Soft background luxury glow mapping */}
      <div className="absolute inset-0 bg-gradient-to-br from-onyx via-warm-black/40 to-onyx pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-gold/30 to-transparent pointer-events-none" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold/[0.008] blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <SectionHeading
            eyebrow="Why AVAAT"
            heading="The Standard You Deserve"
            subheading="What separates good from exceptional is discipline, process, and an unrelenting commitment to quality."
            center
          />
        </div>

        {/* Responsive 2x2 layout grid for Desktop/Tablet and Single Column for Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {REASONS.map((reason, i) => (
            <FeatureCard
              key={reason.title}
              icon={reason.icon}
              title={reason.title}
              description={reason.description}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}