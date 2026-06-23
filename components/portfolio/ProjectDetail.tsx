import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin, Tag, User } from 'lucide-react';
import { PublishedProject } from '@/types/database';
import { PortfolioGallery } from '@/components/portfolio/PortfolioGallery';
import { PortfolioBeforeAfter } from '@/components/portfolio/PortfolioBeforeAfter';

interface ProjectDetailProps {
  project: PublishedProject;
}

const categoryLabels: Record<string, string> = {
  residential: 'Residential Design',
  commercial: 'Commercial Space',
  architecture: 'Architectural Design',
  hospitality: 'Hospitality Design',
  renovation: 'Renovation & Remodeling',
};

export function ProjectDetail({ project }: ProjectDetailProps) {
  const categoryLabel =
    categoryLabels[project.category?.toLowerCase()] ||
    project.category ||
    'Bespoke Design';

  const displayOverview =
    project.overview || project.shortDescription || project.description || '';
  const projectYear = project.completionYear || project.year || null;

  return (
    <div className="min-h-screen bg-warm-black">
      {/* ── Hero Cover ── */}
      <section className="relative w-full aspect-[16/9] md:aspect-[21/9] bg-onyx overflow-hidden border-b border-gold/10">
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
          <div className="absolute inset-0 bg-gradient-to-br from-onyx via-warm-black to-gold/15 flex flex-col items-center justify-center">
            <span className="font-cormorant text-5xl text-gold tracking-[0.2em] uppercase">
              AVAAT
            </span>
            <span className="font-jost text-sm text-muted/50 tracking-[0.4em] uppercase mt-2">
              Bespoke Architectural Portfolio
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-warm-black/60 via-transparent to-transparent" />
      </section>

      {/* ── Title + Meta ── */}
      <section className="section-pad">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            {/* Sticky Meta Panel */}
            <div className="lg:col-span-4 lg:order-last">
              <div className="border border-gold/10 bg-onyx/95 p-8 sticky top-32">
                <h2 className="font-cormorant text-2xl text-ivory mb-6">Project Details</h2>
                <div className="space-y-5">
                  <DetailRow icon={<User className="w-4 h-4 text-gold" />} label="Client">
                    {project.client || 'AVAAT Curation'}
                  </DetailRow>
                  {(project.location || project.city) && (
                    <DetailRow icon={<MapPin className="w-4 h-4 text-gold" />} label="Location">
                      {[project.location, project.city].filter(Boolean).join(', ')}
                    </DetailRow>
                  )}
                  <DetailRow icon={<Tag className="w-4 h-4 text-gold" />} label="Category">
                    {categoryLabel}
                  </DetailRow>
                  {projectYear && (
                    <DetailRow icon={<Calendar className="w-4 h-4 text-gold" />} label="Year Completed">
                      {projectYear}
                    </DetailRow>
                  )}
                </div>

                {project.tags && project.tags.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gold/10">
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-jost text-[10px] tracking-widest text-muted border border-gold/20 px-3 py-1 bg-gold/5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-8">
                  <Link
                    href="/contact"
                    className="block text-center font-jost text-[10px] tracking-[0.2em] uppercase px-6 py-3.5 border border-gold text-gold hover:bg-gold hover:text-onyx transition-all duration-300"
                  >
                    Book a Consultation
                  </Link>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="lg:col-span-8 space-y-10">
              <div>
                <span className="eyebrow block mb-3">Case Study</span>
                <h1 className="font-cormorant text-5xl md:text-6xl lg:text-7xl text-ivory leading-tight">
                  {project.title}
                </h1>
                <div className="w-20 h-0.5 bg-gold mt-6 mb-8" />
                {displayOverview && (
                  <p className="font-jost text-lg text-muted leading-relaxed font-light">
                    {displayOverview}
                  </p>
                )}
              </div>

              {project.designStory && (
                <Narrative heading="Concept & Strategy" body={project.designStory} />
              )}
              {project.designChallenges && (
                <Narrative heading="Design Challenges" body={project.designChallenges} />
              )}
              {project.materialsFinishes && (
                <Narrative heading="Materials & Finishes" body={project.materialsFinishes} />
              )}
              {project.finalOutcome && (
                <Narrative heading="Final Outcome" body={project.finalOutcome} />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Before / After ── */}
      {project.beforeAfter?.beforeImage && project.beforeAfter?.afterImage && (
        <section className="section-pad bg-onyx/20 border-t border-gold/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <div className="text-center mb-14">
              <span className="eyebrow block mb-3">Transformation</span>
              <h2 className="font-cormorant text-4xl text-ivory">The AVAAT Effect</h2>
              <div className="w-16 h-px bg-gold mx-auto mt-4" />
            </div>
            <PortfolioBeforeAfter beforeAfter={project.beforeAfter} />
          </div>
        </section>
      )}

      {/* ── Media Gallery ── */}
      {project.media && project.media.length > 0 && (
        <section className="section-pad border-t border-gold/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="eyebrow block mb-3">Showcase</span>
              <h2 className="font-cormorant text-4xl md:text-5xl text-ivory">
                Design Gallery
              </h2>
              <div className="w-16 h-px bg-gold mx-auto mt-4" />
            </div>
            <PortfolioGallery media={project.media} projectTitle={project.title} />
          </div>
        </section>
      )}
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function DetailRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex-shrink-0">{icon}</span>
      <div>
        <span className="font-jost text-[10px] tracking-widest text-muted uppercase block mb-0.5">
          {label}
        </span>
        <span className="font-jost text-sm text-ivory">{children}</span>
      </div>
    </div>
  );
}

function Narrative({ heading, body }: { heading: string; body: string }) {
  return (
    <div>
      <h2 className="font-cormorant text-3xl md:text-4xl text-ivory mb-5">{heading}</h2>
      <p className="font-jost text-muted leading-relaxed text-base md:text-lg font-light">
        {body}
      </p>
    </div>
  );
}