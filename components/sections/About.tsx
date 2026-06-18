'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';




export function About() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} id="about" className="section-pad bg-warm-black overflow-hidden relative">
      {/* Background soft lighting glow */}
      <div className="absolute right-0 top-1/4 w-[500px] h-[500px] rounded-full bg-gold/[0.015] blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          
          {/* Text Left Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col justify-center"
          >
            <SectionHeading
              eyebrow="Who We Are"
              heading="Designing Spaces That Tell Stories"
            />

            {/* Paragraph Content Blocks */}
            <div className="space-y-6 font-jost text-muted text-sm md:text-base leading-relaxed font-light max-w-2xl">
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                At AVAAT Design, we believe exceptional spaces are created through thoughtful design,
                purposeful planning, and a deep understanding of how people live and interact with
                their surroundings.
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Every project begins with listening. By understanding our clients’ aspirations,
                lifestyles, and functional needs, we create environments that are both visually
                compelling and practically efficient.
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Our approach combines architectural expertise, interior sophistication, and meticulous
                execution to ensure every project reflects individuality while maintaining timeless appeal.
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                From concept development to final styling, AVAAT remains committed to delivering
                excellence at every stage of the design journey.
              </motion.p>
            </div>



            {/* Call To Action */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-10"
            >
              <Link
                href="/contact"
                className="inline-flex items-center gap-2.5 font-jost text-xs tracking-[0.2em] uppercase text-gold hover:text-gold-light transition-colors group"
              >
                Book Consultation
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Images Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative mt-12 lg:mt-0"
          >
            {/* Outline Corner Brackets for Luxury Framing */}
            <div className="absolute -top-3 -left-3 w-16 h-16 border-t border-l border-gold/40 pointer-events-none" />
            <div className="absolute -bottom-3 -right-3 w-16 h-16 border-b border-r border-gold/40 pointer-events-none" />

            {/* Outer main image container with glass border wrapper */}
            <div className="relative aspect-[4/5] bg-gradient-to-b from-onyx to-warm-black border border-gold/10 overflow-hidden group shadow-2xl">
              <motion.div
                initial={{ scale: 1.1 }}
                animate={inView ? { scale: 1.0 } : {}}
                transition={{ duration: 1.6, ease: 'easeOut' }}
                className="w-full h-full relative"
              >
                <Image
                  src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80"
                  alt="Luxury living space with marble and gold accent detailing"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-103"
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-onyx/60 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Overlapping premium detail image */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -left-10 sm:-left-12 -bottom-10 w-1/2 aspect-square border border-gold/10 overflow-hidden shadow-2xl hidden sm:block"
            >
              <Image
                src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=500&q=80"
                alt="Detailed interior shot highlighting luxury design crafting"
                fill
                sizes="20vw"
                className="object-cover"
              />
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}