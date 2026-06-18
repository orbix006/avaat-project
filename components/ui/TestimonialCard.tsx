import { Star } from 'lucide-react';
import { FeaturedTestimonial, Testimonial as DBTestimonial } from '@/types/database';
import { Testimonial as StaticTestimonial } from '@/lib/constants/testimonials';
import { cn } from '@/lib/utils';

interface TestimonialCardProps {
  testimonial: FeaturedTestimonial | DBTestimonial | StaticTestimonial;
  className?: string;
}

export function TestimonialCard({ testimonial, className }: TestimonialCardProps) {
  // Resolve properties dynamically based on data schema type
  const clientName = 'clientName' in testimonial ? testimonial.clientName : testimonial.name;
  const quoteText = 'review' in testimonial ? testimonial.review : testimonial.quote;
  const rating = testimonial.rating ?? 5;

  // Resolve linked project information or location details
  const projectDetails = (() => {
    // 1. Check if linked to database project
    if ('project' in testimonial && testimonial.project) {
      const p = testimonial.project;
      const categoryLabel = p.category
        ? p.category.charAt(0).toUpperCase() + p.category.slice(1)
        : 'Interior';
      return `${p.title} (${categoryLabel})`;
    }
    // 2. Check location fallback
    if ('location' in testimonial && testimonial.location) {
      return testimonial.location;
    }
    // 3. Check static role/company fallback
    if ('role' in testimonial && testimonial.role && 'company' in testimonial && testimonial.company) {
      return `${testimonial.role}, ${testimonial.company}`;
    }
    if ('role' in testimonial && testimonial.role) {
      return testimonial.role;
    }
    return 'Bespoke Client';
  })();

  return (
    <div
      className={cn(
        'flex flex-col gap-6 p-8 md:p-10 border border-gold/10 hover:border-gold/25 bg-warm-black h-full relative overflow-hidden transition-colors duration-500',
        className
      )}
    >
      {/* Luxury gold glow sweep inside card on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.015] to-transparent pointer-events-none" />

      {/* Stars rating */}
      <div className="flex gap-1" aria-label={`${rating} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              'w-3.5 h-3.5',
              i < rating ? 'fill-gold text-gold stroke-gold' : 'text-muted/20'
            )}
          />
        ))}
      </div>

      {/* Quote Symbol */}
      <span className="font-cormorant text-6xl text-gold/25 leading-none -mb-6 select-none pointer-events-none">
        &ldquo;
      </span>

      {/* Testimonial Quote */}
      <blockquote className="font-cormorant text-xl md:text-2xl text-ivory leading-relaxed flex-1 relative z-10 italic">
        {quoteText}
      </blockquote>

      {/* Author profile summary block */}
      <div className="flex items-center gap-4 pt-6 border-t border-gold/5 relative z-10">
        <div className="w-10 h-10 bg-gold/5 border border-gold/20 flex items-center justify-center flex-shrink-0 rounded-full">
          <span className="font-cormorant text-gold text-base leading-none font-light uppercase">
            {clientName.charAt(0)}
          </span>
        </div>
        <div>
          <p className="font-jost text-sm font-medium text-ivory tracking-wide">
            {clientName}
          </p>
          <p className="font-jost text-[10px] text-muted tracking-wider uppercase mt-1 leading-snug">
            {projectDetails}
          </p>
        </div>
      </div>
    </div>
  );
}