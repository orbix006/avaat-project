import type { Metadata } from 'next';
import { Contact } from '@/components/sections/Contact';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Start a project with AVAAT Design. Tell us about your vision and we\'ll get back to you within 24 hours.',
};

export default async function ContactPage() {
  return (
    <>
      {/* Hero banner */}
      <section className="relative pt-44 pb-0 bg-onyx overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-onyx via-warm-black/60 to-onyx" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="eyebrow block mb-5">Let&apos;s Talk</span>
          <h1 className="font-cormorant text-6xl md:text-8xl text-ivory leading-tight mb-6">
            Start a <em className="text-gold not-italic">Conversation</em>
          </h1>
          <div className="w-24 h-px bg-gold mx-auto mb-8" />
          <p className="font-jost text-muted text-lg max-w-xl mx-auto leading-relaxed">
            Every great project starts with a conversation. Share your vision and we&apos;ll tell
            you exactly how we can bring it to life.
          </p>
        </div>
      </section>

      {/* Full contact section */}
      <Contact />

      {/* FAQ */}
      <section className="section-pad bg-onyx border-t border-gold/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <div className="text-center mb-14">
            <span className="eyebrow block mb-4">FAQ</span>
            <h2 className="font-cormorant text-4xl md:text-5xl text-ivory">Common Questions</h2>
            <div className="w-20 h-px bg-gold mx-auto mt-8" />
          </div>
          <div className="space-y-0 divide-y divide-gold/10">
            {[
              {
                q: 'How long does a typical project take?',
                a: 'A website project usually takes 6–12 weeks from kickoff to launch, depending on scope and complexity. We provide a detailed timeline during the discovery phase.',
              },
              {
                q: 'Do you work with clients internationally?',
                a: 'Absolutely. We work with clients worldwide. Our process is fully remote-friendly with regular video calls, shared project dashboards, and clear written communication.',
              },
              {
                q: 'What does the process look like?',
                a: 'We follow a six-phase approach: Discovery → Strategy → Design → Development → Launch → Growth. You\'re involved and informed at every step.',
              },
              {
                q: 'Do you offer ongoing support after launch?',
                a: 'Yes — our Care & Maintenance plan covers security updates, performance monitoring, content updates, and priority support from $500/month.',
              },
              {
                q: 'How much does a project cost?',
                a: 'Every project is unique. Web design typically starts at $4,500, development at $6,000, and brand identity at $3,000. We provide a fixed-price proposal after the discovery call.',
              },
            ].map(({ q, a }) => (
              <details key={q} className="group py-6 cursor-pointer list-none">
                <summary className="flex items-center justify-between font-cormorant text-xl text-ivory group-open:text-gold transition-colors list-none">
                  {q}
                  <span className="text-gold text-2xl group-open:rotate-45 transition-transform duration-300 ml-4 flex-shrink-0">
                    +
                  </span>
                </summary>
                <p className="font-jost text-sm text-muted leading-relaxed mt-4 pr-8">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}