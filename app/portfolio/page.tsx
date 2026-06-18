import type { Metadata } from 'next';
import { Portfolio } from '@/components/sections/Portfolio';
import { SocialConnect } from '@/components/sections/SocialConnect';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Portfolio',
  description:
    "Explore AVAAT Design's portfolio of premium web design, development, branding, and e-commerce projects.",
};

export default function PortfolioPage() {
  return (
    <>
      {/* Hero banner */}
      <section className="relative pt-44 pb-24 bg-onyx overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-onyx via-warm-black/60 to-onyx" />
        <div
          className="absolute top-0 bottom-0 w-px"
          style={{ right: '7%', background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.15) 50%, transparent)' }}
        />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="eyebrow block mb-5">Our Work</span>
          <h1 className="font-cormorant text-6xl md:text-8xl text-ivory leading-tight mb-6">
            Selected <em className="text-gold not-italic">Projects</em>
          </h1>
          <div className="w-24 h-px bg-gold mx-auto mb-8" />
          <p className="font-jost text-muted text-lg max-w-xl mx-auto leading-relaxed">
            A curated collection of brands we&apos;ve elevated through exceptional design and
            purposeful development.
          </p>
        </div>
      </section>

      {/* Filterable portfolio grid */}
      <Portfolio />

      <SocialConnect />
    </>
  );
}