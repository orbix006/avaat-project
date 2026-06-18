import Link from 'next/link';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { PortfolioClient } from '@/components/sections/PortfolioClient';
import { getPublishedProjects } from '@/lib/supabase/queries';

// Project Card Skeleton UI
export function ProjectCardSkeleton() {
  return (
    <div className="relative aspect-[4/3] w-full bg-warm-black/50 border border-gold/5 overflow-hidden animate-pulse">
      {/* Category badge skeleton */}
      <div className="absolute top-4 left-4 w-20 h-6 bg-gold/10 z-10" />
      {/* Info overlay skeleton */}
      <div className="absolute bottom-4 left-4 right-4 h-12 bg-ivory/5" />
    </div>
  );
}

// Portfolio Section Skeleton UI
export function PortfolioSkeleton() {
  return (
    <section className="section-pad bg-warm-black relative select-none">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 mb-14">
          <div>
            <div className="h-4 w-20 bg-gold/5 mb-3 rounded animate-pulse" />
            <div className="h-10 w-64 bg-ivory/5 rounded animate-pulse" />
          </div>
          {/* Mock filters placeholder */}
          <div className="flex flex-wrap gap-2.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-20 h-9 bg-gold/5 border border-gold/5 rounded animate-pulse" />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {Array.from({ length: 3 }).map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Complete Portfolio Server Component
export async function Portfolio() {
  try {
    const projects = await getPublishedProjects();

    // Handle overall empty state gracefully
    if (!projects || projects.length === 0) {
      return (
        <section id="portfolio" className="section-pad bg-warm-black relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-onyx via-warm-black to-onyx" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center py-20">
            <SectionHeading eyebrow="Our Work" heading="Selected Projects" center />
            <p className="font-jost text-muted text-base max-w-lg mx-auto mb-10 leading-relaxed font-light">
              Our curated portfolio of bespoke interior styling and architectural designs is currently being archived. Please contact our design studio to explore past commissions.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-3.5 border border-gold text-gold font-jost text-[10px] tracking-[0.25em] uppercase hover:bg-gold hover:text-onyx transition-all duration-300 shadow-lg"
            >
              Enquire About Commissions
            </Link>
          </div>
        </section>
      );
    }

    // Sort:
    // 1. Featured projects first (featured === true comes first)
    // 2. Ordering sort order ascending
    // 3. Newest projects descending as fallback
    const sortedProjects = [...projects].sort((a, b) => {
      if (a.featured !== b.featured) {
        return a.featured ? -1 : 1;
      }
      if (a.order !== b.order) {
        return a.order - b.order;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return (
      <section id="portfolio" className="section-pad bg-warm-black relative overflow-hidden">
        {/* Soft background luxury glow mapping */}
        <div className="absolute right-0 top-1/3 w-[500px] h-[500px] rounded-full bg-gold/[0.012] blur-[120px] pointer-events-none" />
        
        <PortfolioClient projects={sortedProjects} />
      </section>
    );
  } catch (error) {
    console.error('Error rendering Portfolio section:', error);
    // Graceful error fallback state
    return (
      <section id="portfolio" className="section-pad bg-warm-black relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <SectionHeading eyebrow="Our Work" heading="Selected Projects" center />
          <p className="font-jost text-muted text-sm max-w-md mx-auto mb-8 mt-4">
            An error occurred while loading our projects catalog. Please contact our studio or try reloading the page.
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