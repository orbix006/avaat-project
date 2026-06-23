import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, Calendar, User, Tag, ShieldCheck, MapPin } from 'lucide-react';
import { getProjectBySlug, getPublishedProjects } from '@/lib/supabase/queries';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { PortfolioBeforeAfter } from '@/components/portfolio/PortfolioBeforeAfter';
import { SocialConnect } from '@/components/sections/SocialConnect';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

interface ProjectPageProps {
  params: {
    slug: string;
  };
}

const categoryLabels: Record<string, string> = {
  residential: 'Residential Design',
  commercial: 'Commercial Space',
  architecture: 'Architectural Design',
  hospitality: 'Hospitality Design',
  renovation: 'Renovation & Remodeling',
};

const getCategoryLabel = (category: string) => {
  if (!category) return 'Bespoke Design';
  return categoryLabels[category.toLowerCase()] || category.charAt(0).toUpperCase() + category.slice(1);
};

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  if (!project) {
    return {
      title: 'Project Not Found — AVAAT Design',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://avaat.design';
  const metaTitle = project.seoTitle || project.title;
  const metaDesc = project.seoDescription || project.shortDescription || project.overview || '';

  return {
    title: metaTitle,
    description: metaDesc,
    keywords: project.tags && project.tags.length > 0 ? project.tags : ['architecture case study', 'interior space styling', 'commercial design concept'],
    openGraph: {
      type: 'article',
      locale: 'en_US',
      url: `${siteUrl}/portfolio/${project.slug}`,
      siteName: 'AVAAT Design',
      title: `${metaTitle} — Case Study`,
      description: metaDesc,
      images: project.coverImage ? [{ url: project.coverImage, width: 800, height: 600, alt: project.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${metaTitle} — Case Study`,
      description: metaDesc,
      images: project.coverImage ? [project.coverImage] : [],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = await getProjectBySlug(params.slug);
  if (!project) {
    notFound();
  }

  // Fetch all published projects to find pagination & related list
  const allProjects = await getPublishedProjects();

  // Next project logic for dynamic pagination
  const currentIdx = allProjects.findIndex((p) => p.slug === project.slug);
  const nextProject =
    allProjects.length > 1 && currentIdx !== -1
      ? allProjects[(currentIdx + 1) % allProjects.length]
      : null;

  // Pick related projects: filter out current, prioritize same category
  const relatedProjects = allProjects
    .filter((p) => p.slug !== project.slug)
    .sort((a, b) => {
      if (a.category === project.category && b.category !== project.category) return -1;
      if (a.category !== project.category && b.category === project.category) return 1;
      return a.order - b.order;
    })
    .slice(0, 3);

  // Fallbacks
  const projectClient = project.client || 'AVAAT Curation';
  const projectCategory = getCategoryLabel(project.category);
  const projectYear = project.completionYear || project.year || 'Recent Showcase';
  const displayOverview = project.overview || project.shortDescription || project.description || '';

  return (
    <>
      <article className="min-h-screen bg-warm-black relative">
        {/* Subtle decorative vertical lines */}
        <div className="absolute inset-y-0 left-[10%] w-px bg-gold/5 pointer-events-none hidden md:block" />
        <div className="absolute inset-y-0 right-[10%] w-px bg-gold/5 pointer-events-none hidden md:block" />

        <div className="relative pt-36 pb-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 font-jost text-xs tracking-[0.2em] uppercase text-gold hover:text-gold-light transition-colors group mb-10"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Portfolio
            </Link>

            <div className="max-w-4xl">
              <span className="eyebrow block mb-4">Case Study</span>
              <h1 className="font-cormorant text-5xl md:text-7xl lg:text-8xl text-ivory leading-[1.1] mb-6">
                {project.title}
              </h1>
              <div className="w-20 h-0.5 bg-gold my-6" />
              <p className="font-jost text-muted text-lg md:text-xl leading-relaxed max-w-2xl font-light">
                {displayOverview}
              </p>
            </div>
          </div>
        </div>

        {/* Hero Cover Image */}
        <section className="relative w-full aspect-[16/9] md:aspect-[21/9] bg-onyx overflow-hidden border-y border-gold/10">
          {project.coverImage ? (
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-onyx via-warm-black to-gold/15 flex flex-col items-center justify-center p-6 text-center select-none">
              <span className="font-cormorant text-5xl text-gold tracking-[0.2em] uppercase mb-2">AVAAT</span>
              <span className="font-jost text-sm text-muted/50 tracking-[0.40em] uppercase">Bespoke Architectural Portfolio</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-warm-black via-transparent to-transparent" />
        </section>

        {/* Project Meta and Details */}
        <section className="section-pad relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
              {/* Project Meta Panel */}
              <div className="lg:col-span-4 lg:order-last">
                <div className="border border-gold/10 bg-onyx/95 p-8 md:p-10 sticky top-32">
                  <h3 className="font-cormorant text-2xl text-ivory mb-6">Project Details</h3>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <User className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-jost text-[10px] tracking-widest text-muted uppercase block">Client</span>
                        <span className="font-jost text-sm text-ivory">{projectClient}</span>
                      </div>
                    </div>

                    {(project.location || project.city) && (
                      <div className="flex items-start gap-4">
                        <MapPin className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-jost text-[10px] tracking-widest text-muted uppercase block">Location</span>
                          <span className="font-jost text-sm text-ivory">
                            {project.location}
                            {project.location && project.city ? `, ${project.city}` : project.city}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-4">
                      <Tag className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-jost text-[10px] tracking-widest text-muted uppercase block">Category</span>
                        <span className="font-jost text-sm text-ivory">{projectCategory}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Calendar className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-jost text-[10px] tracking-widest text-muted uppercase block">Year completed</span>
                        <span className="font-jost text-sm text-ivory">{projectYear}</span>
                      </div>
                    </div>
                  </div>

                  <div className="w-full h-px bg-gold/10 my-8" />

                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-8">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-jost text-[10px] tracking-widest text-muted border border-gold/20 px-3 py-1 bg-gold/5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {project.url ? (
                    <Button href={project.url} variant="primary" className="w-full justify-center">
                      Visit Live Project <ArrowUpRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <div className="text-center py-2.5 px-4 border border-gold/10 bg-warm-black/40 text-muted font-jost text-xs uppercase tracking-wider flex items-center justify-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-gold" /> Proprietary Curation
                    </div>
                  )}
                </div>
              </div>

              {/* Project Body Narrative */}
              <div className="lg:col-span-8 space-y-12">
                <div>
                  <h2 className="font-cormorant text-3xl md:text-4xl text-ivory mb-6">The Challenge</h2>
                  <p className="font-jost text-muted leading-relaxed text-base md:text-lg font-light">
                    Every luxury spatial design is a dialogue between constraints and imagination. For {projectClient}, we faced the critical task of transforming physical spacing and dimensions into a refined sanctuary, respecting the materials and context.
                  </p>
                </div>

                {project.designStory && (
                  <div>
                    <h2 className="font-cormorant text-3xl md:text-4xl text-ivory mb-6">Concept & Strategy</h2>
                    <p className="font-jost text-muted leading-relaxed text-base md:text-lg font-light">
                      {project.designStory}
                    </p>
                  </div>
                )}

                {project.designChallenges && (
                  <div>
                    <h2 className="font-cormorant text-3xl md:text-4xl text-ivory mb-6">Design Obstacles</h2>
                    <p className="font-jost text-muted leading-relaxed text-base md:text-lg font-light">
                      {project.designChallenges}
                    </p>
                  </div>
                )}

                {project.materialsFinishes && (
                  <div>
                    <h2 className="font-cormorant text-3xl md:text-4xl text-ivory mb-6">Materials & Finishes</h2>
                    <p className="font-jost text-muted leading-relaxed text-base md:text-lg font-light">
                      {project.materialsFinishes}
                    </p>
                  </div>
                )}

                {project.finalOutcome && (
                  <div>
                    <h2 className="font-cormorant text-3xl md:text-4xl text-ivory mb-6">Final Outcome</h2>
                    <p className="font-jost text-muted leading-relaxed text-base md:text-lg font-light">
                      {project.finalOutcome}
                    </p>
                  </div>
                )}

                {/* Decorative luxury callout block */}
                <div className="border-l-2 border-gold pl-6 py-4 my-8 bg-onyx/20">
                  <p className="font-cormorant text-xl md:text-2xl text-gold-light italic">
                    &ldquo;AVAAT did not just construct spaces; they shaped the atmosphere. The execution combined with visual poetry is pure artistry.&rdquo;
                  </p>
                  <span className="font-jost text-[10px] tracking-widest text-muted uppercase mt-3 block">
                    — Executive Stakeholder, {projectClient}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Before / After Slider Section */}
        {project.beforeAfter && project.beforeAfter.beforeImage && project.beforeAfter.afterImage && (
          <section className="section-pad bg-onyx/20 border-t border-gold/10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
              <div className="mb-16 text-center">
                <span className="eyebrow block mb-3">Transformation</span>
                <h2 className="font-cormorant text-4xl text-ivory">The AVAAT Effect</h2>
                <div className="w-16 h-px bg-gold mx-auto mt-4 mb-4" />
                <p className="font-jost text-muted text-sm max-w-md mx-auto leading-relaxed font-light">
                  Interact with the slider below to witness the spacing comparison from initial construction stages to finalized bespoke implementation.
                </p>
              </div>
              <div className="max-w-4xl mx-auto">
                <PortfolioBeforeAfter beforeAfter={project.beforeAfter} />
              </div>
            </div>
          </section>
        )}

        {/* Design Gallery Showcase */}
        {project.media && project.media.length > 0 && (
          <section className="section-pad border-t border-gold/10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-16 text-center">
                <span className="eyebrow block mb-3">Showcase</span>
                <h2 className="font-cormorant text-4xl md:text-5xl text-ivory">Design Media Gallery</h2>
                <div className="w-16 h-px bg-gold mx-auto mt-4" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                {project.media
                  .sort((a, b) => a.order - b.order)
                  .map((item, idx) => {
                    const isLarge = idx % 3 === 0;
                    return (
                      <div
                        key={item.id}
                        className={cn(
                          'relative bg-onyx border border-gold/5 overflow-hidden group shadow-lg',
                          isLarge ? 'md:col-span-2 aspect-[16/9] lg:aspect-[21/9]' : 'aspect-[4/3] md:aspect-square lg:aspect-[4/3]'
                        )}
                      >
                        <Image
                          src={item.url}
                          alt={item.caption || item.alt || project.title}
                          fill
                          className="object-cover group-hover:scale-103 transition-transform duration-[1200ms] ease-out"
                          sizes={isLarge ? '100vw' : '(max-width: 768px) 100vw, 50vw'}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-onyx/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        {item.caption && (
                          <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                            <p className="font-jost text-xs text-gold tracking-widest uppercase mb-1">Perspective View</p>
                            <p className="font-cormorant text-lg text-ivory font-light">{item.caption}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          </section>
        )}

        {/* Project Pagination / Next Project CTA */}
        {nextProject && (
          <section className="border-t border-gold/10 bg-onyx relative overflow-hidden group">
            <Link
              href={`/portfolio/${nextProject.slug}`}
              className="block w-full py-20 md:py-28 text-center relative z-10 hover:bg-warm-black/20 transition-colors duration-500"
            >
              <span className="font-jost text-[10px] tracking-[0.2em] uppercase text-gold block mb-4 group-hover:-translate-y-1 transition-transform duration-300">
                Up Next
              </span>
              <span className="font-cormorant text-4xl md:text-6xl text-ivory group-hover:text-gold-light transition-colors block mb-6">
                {nextProject.title}
              </span>
              <span className="inline-flex items-center gap-2 font-jost text-xs tracking-widest uppercase text-muted group-hover:text-gold transition-colors">
                View Case Study{' '}
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </span>
            </Link>
            {nextProject.coverImage && (
              <div className="absolute inset-0 opacity-10 group-hover:scale-105 transition-transform duration-1000 pointer-events-none">
                <Image
                  src={nextProject.coverImage}
                  alt={nextProject.title}
                  fill
                  className="object-cover blur-sm"
                  sizes="100vw"
                />
              </div>
            )}
          </section>
        )}

        {/* Related Projects Showcase */}
        {relatedProjects.length > 0 && (
          <section className="section-pad border-t border-gold/10 bg-onyx/20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
              <div className="mb-14 text-center">
                <span className="eyebrow block mb-3 font-light">Explore</span>
                <h3 className="font-cormorant text-3xl md:text-4xl text-ivory">Related Case Studies</h3>
                <div className="w-16 h-px bg-gold mx-auto mt-4" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedProjects.map((rProj, idx) => (
                  <ProjectCard key={rProj.id} project={rProj} index={idx} />
                ))}
              </div>
            </div>
          </section>
        )}
      </article>

      <SocialConnect />
    </>
  );
}