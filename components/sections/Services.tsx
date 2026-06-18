import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ServiceCard } from '@/components/ui/ServiceCard';
import { getActiveServices } from '@/lib/supabase/queries';

// Refined Skeleton Loading component matching the exact luxury design system
export function ServiceCardSkeleton() {
  return (
    <div className="relative p-8 md:p-10 bg-warm-black/50 border border-gold/5 overflow-hidden flex flex-col h-full animate-pulse select-none">
      {/* Icon Frame Placeholder */}
      <div className="w-12 h-12 bg-gold/5 border border-gold/10 mb-8" />
      {/* Title Placeholder */}
      <div className="h-6 w-2/3 bg-ivory/5 mb-4 rounded" />
      {/* Description Line 1 Placeholder */}
      <div className="h-4 w-full bg-muted/5 mb-2 rounded" />
      {/* Description Line 2 Placeholder */}
      <div className="h-4 w-5/6 bg-muted/5 mb-8 rounded" />
      {/* CTA Placeholder */}
      <div className="h-4 w-24 bg-gold/5 mt-auto rounded" />
    </div>
  );
}

export function ServicesSkeleton() {
  return (
    <section className="section-pad bg-onyx relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="h-4 w-20 bg-gold/5 mx-auto mb-3 rounded animate-pulse" />
          <div className="h-10 w-80 bg-ivory/5 mx-auto mb-6 rounded animate-pulse" />
          <div className="h-4 w-[450px] bg-muted/5 mx-auto rounded animate-pulse hidden md:block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <ServiceCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Complete Services Server Component
export async function Services() {
  try {
    const services = await getActiveServices();

    // Handle Empty State gracefully with a premium luxury typography look and CTA
    if (!services || services.length === 0) {
      return (
        <section id="services" className="section-pad bg-onyx relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-onyx via-warm-black to-onyx" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center py-16">
            <SectionHeading
              eyebrow="What We Do"
              heading="Services Built for Excellence"
              center
            />
            <p className="font-jost text-muted text-base max-w-lg mx-auto mb-10 leading-relaxed font-light">
              Our curated collection of bespoke architecture and design services is currently being refined. Let us collaborate with you directly to realize your vision.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-3.5 border border-gold text-gold font-jost text-[10px] tracking-[0.25em] uppercase hover:bg-gold hover:text-onyx transition-all duration-300 shadow-lg"
            >
              Book Private Consultation
            </Link>
          </div>
        </section>
      );
    }

    return (
      <section id="services" className="section-pad bg-onyx relative overflow-hidden">
        {/* Soft background luxury glow mapping */}
        <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold/[0.012] blur-[150px] pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <SectionHeading
              eyebrow="What We Do"
              heading="Services Built for Excellence"
              subheading="From stunning spatial design identities to premium execution architectures, we offer a comprehensive suite of curated design services."
              center
            />
          </div>

          {/* Grid with luxury spacing */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {services.map((service, i) => (
              <ServiceCard key={service.id} service={service} index={i} />
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link
              href="/services"
              id="services-view-all"
              className="inline-flex items-center gap-3 font-jost text-xs tracking-[0.2em] uppercase text-gold hover:text-gold-light transition-all duration-300 group"
            >
              Explore All Services
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('Error rendering Services section:', error);
    // Render the empty/error fallback page state gracefully if database fetch fails completely
    return (
      <section id="services" className="section-pad bg-onyx relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
          <SectionHeading
            eyebrow="What We Do"
            heading="Services Built for Excellence"
            center
          />
          <p className="font-jost text-muted text-sm max-w-md mx-auto mb-8 mt-4">
            An error occurred while loading our services. Please contact our support team or try reloading the page.
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