import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { SocialConnect } from '@/components/sections/SocialConnect';
import { BlogGrid } from '@/components/blog/BlogGrid';
import { getPublishedBlogPosts } from '@/lib/supabase/queries';
import { SectionHeading } from '@/components/ui/SectionHeading';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'The Journal | AVAAT Design Insights',
  description:
    'Design trends, architectural perspectives, and interior design deep-dives from the AVAAT Design team.',
};

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts();

  // Handle Empty State gracefully
  if (!posts || posts.length === 0) {
    return (
      <>
        {/* Hero */}
        <section className="relative pt-44 pb-24 bg-onyx overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-onyx via-warm-black/60 to-onyx" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <span className="eyebrow block mb-5">Insights</span>
            <h1 className="font-cormorant text-6xl md:text-8xl text-ivory leading-tight mb-6">
              The <em className="text-gold not-italic">Journal</em>
            </h1>
            <div className="w-24 h-px bg-gold mx-auto mb-8" />
            <p className="font-jost text-muted text-lg max-w-xl mx-auto leading-relaxed">
              Design trends, performance deep-dives, and business insights from our team.
            </p>
          </div>
        </section>

        {/* Empty State Showcase */}
        <section className="section-pad bg-warm-black text-center py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-md">
            <SectionHeading eyebrow="Journal" heading="Insights coming soon" center />
            <p className="font-jost text-muted text-sm leading-relaxed mb-8">
              We are currently drafting our inaugural edition of design publications. Connect with us on social media to receive updates as they are published.
            </p>
          </div>
        </section>

        <SocialConnect />
      </>
    );
  }

  const [featured, ...rest] = posts;

  const featuredDate = featured.publishedAt
    ? new Date(featured.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Recent Insights';

  const featuredAuthor = featured.author?.name || 'AVAAT Editorial';

  return (
    <>
      {/* Hero */}
      <section className="relative pt-44 pb-24 bg-onyx overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-onyx via-warm-black/60 to-onyx" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="eyebrow block mb-5">Insights</span>
          <h1 className="font-cormorant text-6xl md:text-8xl text-ivory leading-tight mb-6">
            The <em className="text-gold not-italic">Journal</em>
          </h1>
          <div className="w-24 h-px bg-gold mx-auto mb-8" />
          <p className="font-jost text-muted text-lg max-w-xl mx-auto leading-relaxed">
            Design trends, performance deep-dives, and business insights from our team.
          </p>
        </div>
      </section>

      <section className="section-pad bg-warm-black relative overflow-hidden">
        {/* Soft background luxury glow mapping */}
        <div className="absolute right-0 top-1/4 w-[400px] h-[400px] rounded-full bg-gold/[0.008] blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Featured post */}
          <Link
            href={`/blog/${featured.slug}`}
            className="group grid grid-cols-1 lg:grid-cols-2 gap-0 mb-24 border border-gold/10 hover:border-gold/25 transition-colors duration-500 overflow-hidden"
          >
            <div className="relative aspect-video lg:aspect-auto overflow-hidden bg-onyx">
              {featured.featuredImage ? (
                <Image
                  src={featured.featuredImage}
                  alt={featured.title}
                  fill
                  className="object-cover group-hover:scale-103 transition-transform duration-700"
                  priority
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-onyx via-warm-black to-gold/10 flex flex-col items-center justify-center p-6 text-center select-none">
                  <span className="font-cormorant text-3xl text-gold tracking-widest uppercase mb-2">AVAAT</span>
                  <span className="font-jost text-[10px] text-muted/60 tracking-[0.4em] uppercase">Featured Curation</span>
                </div>
              )}
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-gold text-onyx font-jost text-[9px] tracking-[0.2em] uppercase px-3.5 py-2 font-medium shadow-md">
                  Featured
                </span>
              </div>
            </div>

            <div className="p-10 md:p-14 flex flex-col justify-center bg-warm-black/40">
              <div className="flex items-center gap-4 text-muted/60 font-jost text-[10px] tracking-widest uppercase mb-5">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gold/60" />
                  {featuredDate}
                </span>
                <span>&bull;</span>
                <span>{featured.readTime} min read</span>
              </div>

              <h2 className="font-cormorant text-3xl md:text-4xl lg:text-5xl text-ivory group-hover:text-gold transition-colors duration-300 mb-5 font-normal tracking-wide leading-tight">
                {featured.title}
              </h2>

              <p className="font-jost text-sm text-muted leading-relaxed mb-8 max-w-xl font-light">
                {featured.excerpt || 'Bespoke design reviews and spatial philosophies compiled by our architectural team.'}
              </p>

              <div className="flex items-center justify-between pt-6 border-t border-gold/5 mt-auto">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gold/5 border border-gold/20 flex items-center justify-center rounded-full">
                    <User className="w-4 h-4 text-gold" />
                  </div>
                  <span className="font-jost text-xs text-ivory font-light tracking-wide">{featuredAuthor}</span>
                </div>

                <div className="flex items-center gap-2 font-jost text-[10px] tracking-[0.25em] uppercase text-gold group-hover:gap-3.5 transition-all duration-300">
                  Read Article <ArrowRight className="w-3.5 h-3.5 stroke-[1.5]" />
                </div>
              </div>
            </div>
          </Link>

          {/* Grid section */}
          {rest.length > 0 && (
            <div className="border-t border-gold/10 pt-20">
              <div className="mb-12">
                <span className="eyebrow block mb-3">Archive</span>
                <h2 className="font-cormorant text-4xl text-ivory">Recent Publications</h2>
              </div>
              <BlogGrid posts={rest} />
            </div>
          )}
        </div>
      </section>

      <SocialConnect />
    </>
  );
}