import type { Metadata } from 'next';


import { SERVICES } from '@/lib/constants/services';
import { ServiceCard } from '@/components/ui/ServiceCard';
import { getActiveServices } from '@/lib/supabase/queries';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Explore AVAAT Design\'s full suite of services: web design, development, brand identity, SEO, e-commerce, and ongoing maintenance.',
};

export default async function ServicesPage() {
  const dbServices = await getActiveServices();
  const services = dbServices && dbServices.length > 0 ? dbServices : SERVICES;

  return (
    <>
      {/* Hero banner */}
      <section className="relative pt-44 pb-24 bg-onyx overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-onyx via-warm-black/60 to-onyx" />
        <div
          className="absolute top-0 bottom-0 w-px"
          style={{ left: '7%', background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.15) 50%, transparent)' }}
        />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="eyebrow block mb-5">What We Offer</span>
          <h1 className="font-cormorant text-6xl md:text-8xl text-ivory leading-tight mb-6">
            Our <em className="text-gold not-italic">Services</em>
          </h1>
          <div className="w-24 h-px bg-gold mx-auto mb-8" />
          <p className="font-jost text-muted text-lg max-w-xl mx-auto leading-relaxed">
            A complete digital toolkit — from initial concept to post-launch growth — built
            around your ambitions.
          </p>
        </div>
      </section>

      {/* Services grid */}
      <section className="section-pad bg-warm-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gold/10">
            {services.map((service, i) => (
              <ServiceCard key={service.id} service={service} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Detailed service strips */}
      <section className="section-pad bg-onyx">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {services.map((service, i) => (
              <div
                key={service.id}
                id={service.slug}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center scroll-mt-24 ${
                  i % 2 === 1 ? 'lg:flex lg:flex-row-reverse' : ''
                }`}
              >


                {/* Text */}
                <div>
                  <span className="eyebrow block mb-4">{`0${i + 1}`}</span>
                  <h2 className="font-cormorant text-4xl text-ivory mb-4">{service.title}</h2>
                  <div className="w-16 h-px bg-gold mb-6" />
                  <p className="font-jost text-muted leading-relaxed mb-8">{service.description}</p>
                  {service.features && service.features.length > 0 && (
                    <ul className="space-y-3">
                      {service.features.map((f) => (
                        <li key={f} className="flex items-center gap-3 font-jost text-sm text-muted/80">
                          <span className="w-4 h-px bg-gold flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}