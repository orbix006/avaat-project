import Link from 'next/link';
import dynamic from 'next/dynamic';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getPublishedProjects } from '@/lib/supabase/queries';

const BeforeAfterClient = dynamic(
  () => import('@/components/sections/BeforeAfterClient').then((mod) => mod.BeforeAfterClient),
  {
    ssr: false,
    loading: () => (
      <div className="aspect-[4/3] w-full bg-warm-black/50 border border-gold/5 animate-pulse" />
    ),
  }
);

// Before & After loading placeholder
export function BeforeAfterSkeleton() {
  return (
    <section className="section-pad bg-warm-black select-none">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-center">
          {/* Left Text Column Placeholder */}
          <div className="lg:col-span-5 flex flex-col justify-center animate-pulse">
            <div className="h-4 w-24 bg-gold/5 mb-3 rounded" />
            <div className="h-10 w-64 bg-ivory/5 mb-6 rounded" />
            <div className="space-y-2.5">
              <div className="h-4 w-full bg-muted/5 rounded" />
              <div className="h-4 w-5/6 bg-muted/5 rounded" />
              <div className="h-4 w-4/5 bg-muted/5 rounded" />
            </div>
          </div>
          {/* Right Slider Column Placeholder */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/3] w-full bg-warm-black/50 border border-gold/5 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}

// Complete BeforeAfter Server Component
export async function BeforeAfter() {
  try {
    const projects = await getPublishedProjects();

    // Filter projects containing valid before/after records
    const beforeAfterProjects = projects.filter(
      (p) => p.beforeAfter && p.beforeAfter.beforeImage && p.beforeAfter.afterImage
    );

    // Handle Empty State gracefully
    if (!beforeAfterProjects || beforeAfterProjects.length === 0) {
      return (
        <section id="before-after" className="section-pad bg-warm-black relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-onyx via-warm-black to-onyx pointer-events-none" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center py-20">
            <SectionHeading eyebrow="Transformation" heading="The AVAAT Effect" center />
            <p className="font-jost text-muted text-base max-w-lg mx-auto mb-10 leading-relaxed font-light">
              Our dynamic before-and-after space styling comparisons are currently being processed. Please contact our design studio to arrange a portfolio walkthrough.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-3.5 border border-gold text-gold font-jost text-[10px] tracking-[0.25em] uppercase hover:bg-gold hover:text-onyx transition-all duration-300 shadow-lg"
            >
              Request Design Tour
            </Link>
          </div>
        </section>
      );
    }

    return (
      <section id="before-after" className="section-pad bg-warm-black relative overflow-hidden">
        {/* Soft background luxury glow mapping */}
        <div className="absolute left-0 top-1/4 w-[400px] h-[400px] rounded-full bg-gold/[0.008] blur-[100px] pointer-events-none" />
        
        <BeforeAfterClient projects={beforeAfterProjects} />
      </section>
    );
  } catch (error) {
    console.error('Error rendering BeforeAfter section:', error);
    // Graceful error fallback state
    return (
      <section id="before-after" className="section-pad bg-warm-black relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <SectionHeading eyebrow="Transformation" heading="The AVAAT Effect" center />
          <p className="font-jost text-muted text-sm max-w-md mx-auto mb-8 mt-4">
            An error occurred while loading our comparisons showcase. Please contact our studio or try reloading the page.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-6 py-3 border border-gold text-gold font-jost text-xs tracking-[0.2em] uppercase hover:bg-gold hover:text-onyx transition-all duration-300"
          >
            Contact Support
          </Link>
        </div>
      </section>
    );
  }
}