'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HeroSlide, SiteSettings } from '@/types/database';

interface HeroProps {
  slides?: HeroSlide[];
  settings?: SiteSettings;
}

const fallbackSlides: HeroSlide[] = [
  {
    id: '1',
    heading: 'Luxury Spaces. Timeless Experiences.',
    subheading: 'AVAAT Design creates refined architectural and interior environments that balance beauty, functionality, and individuality.',
    ctaPrimaryLabel: 'View Portfolio',
    ctaPrimaryHref: '/portfolio',
    ctaSecondaryLabel: 'Book Consultation',
    ctaSecondaryHref: '/contact',
    backgroundImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1920&q=80',
    order: 1,
    active: true,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '2',
    heading: 'Refined Interiors. Crafted Artistry.',
    subheading: 'Curated architectural designs that combine high-end spatial aesthetics with modern functional elegance.',
    ctaPrimaryLabel: 'View Portfolio',
    ctaPrimaryHref: '/portfolio',
    ctaSecondaryLabel: 'Book Consultation',
    ctaSecondaryHref: '/contact',
    backgroundImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1920&q=80',
    order: 2,
    active: true,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '3',
    heading: 'Architectural Vision. Elevated Living.',
    subheading: 'Transforming premium properties into highly individualized homes tailored to your unique lifestyle.',
    ctaPrimaryLabel: 'View Portfolio',
    ctaPrimaryHref: '/portfolio',
    ctaSecondaryLabel: 'Book Consultation',
    ctaSecondaryHref: '/contact',
    backgroundImage: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1920&q=80',
    order: 3,
    active: true,
    createdAt: '',
    updatedAt: '',
  }
];

export function Hero({ slides = [], settings: _settings = {} }: HeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeSlides = slides && slides.length > 0 ? slides : fallbackSlides;
  const [current, setCurrent] = useState(0);

  // Auto-rotate slides every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % activeSlides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  // Floating gold particles canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      alpha: number;
    }> = [];

    // Check reduced motion setting before launching particle animation
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return;
    }

    let resizeTimeout: number;
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    const onResize = () => {
      cancelAnimationFrame(resizeTimeout);
      resizeTimeout = requestAnimationFrame(resizeCanvas);
    };

    window.addEventListener('resize', onResize, { passive: true });
    resizeCanvas();

    // Generate floating golden specks
    const particleCount = 45;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.4,
        speedY: -(Math.random() * 0.35 + 0.15),
        speedX: Math.random() * 0.2 - 0.1,
        alpha: Math.random() * 0.45 + 0.15,
      });
    }

    let isIntersecting = true;
    let observer: IntersectionObserver | null = null;

    const render = () => {
      if (!isIntersecting) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 168, 76, ${p.alpha})`;
        ctx.fill();

        // Update positions
        p.y += p.speedY;
        p.x += p.speedX;

        // Reset particle position if it goes above the screen
        if (p.y < 0) {
          p.y = canvas.height;
          p.x = Math.random() * canvas.width;
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      isIntersecting = false;
      observer = new IntersectionObserver(
        ([entry]) => {
          const wasIntersecting = isIntersecting;
          isIntersecting = entry.isIntersecting;
          if (isIntersecting && !wasIntersecting) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(render);
          }
        },
        { threshold: 0 }
      );
      observer.observe(canvas);
    } else {
      render();
    }

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(resizeTimeout);
      cancelAnimationFrame(animationFrameId);
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  const scrollDown = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  const activeSlide = activeSlides[current];

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-center overflow-hidden bg-onyx">
      {/* Background Slideshow Container */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.12 }}
            animate={{ opacity: 1, scale: 1.0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
            className="absolute inset-0 w-full h-full"
          >
            {activeSlide.backgroundImage && (
              <Image
                src={activeSlide.backgroundImage}
                alt={activeSlide.heading || 'Bespoke Luxury Architecture'}
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Luxury Gradient Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-onyx via-onyx/50 to-onyx/40 z-10 pointer-events-none" />

      {/* Floating Gold Particles Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 pointer-events-none mix-blend-screen opacity-70"
      />

      {/* Vertical Accent Grid Lines */}
      <div
        className="absolute top-0 bottom-0 w-px z-10 hidden md:block"
        style={{
          left: '8%',
          background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.08) 20%, rgba(201,168,76,0.08) 80%, transparent)',
        }}
      />
      <div
        className="absolute top-0 bottom-0 w-px z-10 hidden md:block"
        style={{
          right: '8%',
          background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.08) 20%, rgba(201,168,76,0.08) 80%, transparent)',
        }}
      />

      {/* Background Decorative Wordmark */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center pointer-events-none overflow-hidden select-none">
        <span 
          className="font-cormorant text-gold/5 font-bold tracking-[0.25em] uppercase whitespace-nowrap"
          style={{ fontSize: 'clamp(4rem, 18vw, 12rem)' }}
        >
          AVAAT
        </span>
      </div>

      {/* Content Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 pt-28 pb-16">
        <div className="max-w-4xl">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-8 h-px bg-gold" />
            <span className="font-jost text-[10px] text-gold tracking-[0.3em] uppercase">
              Architectural & Interior Design
            </span>
          </motion.div>

          {/* Heading with AnimatePresence for transitions on rotate */}
          <div className="min-h-0 md:min-h-[220px] h-auto">
            <AnimatePresence mode="wait">
              <motion.h1
                key={current}
                initial={{ opacity: 0, y: 35 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -25 }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                className="font-cormorant text-4xl md:text-6xl lg:text-[5.5rem] leading-[1.08] text-ivory tracking-wide font-light"
              >
                {/* Highlights the first part before the period if present */}
                {activeSlide.heading.includes('.') ? (
                  <>
                    <span>{activeSlide.heading.split('.')[0]}.</span>
                    <br />
                    <em className="text-gold not-italic block mt-1 font-light">
                      {activeSlide.heading.split('.')[1].trim()}
                    </em>
                  </>
                ) : (
                  activeSlide.heading
                )}
              </motion.h1>
            </AnimatePresence>
          </div>

          {/* Subtext description */}
          <div className="min-h-0 md:min-h-[90px] h-auto mt-8">
            <AnimatePresence mode="wait">
              <motion.p
                key={current}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
                className="font-jost text-sm md:text-base text-muted max-w-xl leading-relaxed"
              >
                {activeSlide.subheading}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
            className="flex flex-wrap gap-4 mt-10"
          >
            <Link
              href={activeSlide.ctaPrimaryHref || '/portfolio'}
              id="hero-cta-primary"
              className="inline-flex items-center justify-center px-7 py-3 bg-gold text-onyx font-jost text-[10px] tracking-[0.2em] uppercase hover:bg-gold-light hover:shadow-lg hover:shadow-gold/10 transition-all duration-300 group"
            >
              {activeSlide.ctaPrimaryLabel || 'View Portfolio'}
              <ArrowRight className="ml-2 w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href={activeSlide.ctaSecondaryHref || '/contact'}
              id="hero-cta-secondary"
              className="inline-flex items-center justify-center px-7 py-3 border border-gold/40 text-gold font-jost text-[10px] tracking-[0.2em] uppercase hover:bg-gold hover:text-onyx hover:border-gold transition-all duration-300"
            >
              {activeSlide.ctaSecondaryLabel || 'Book Consultation'}
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Slide indicators / dots */}
      <div className="absolute bottom-10 right-4 sm:right-8 lg:right-12 z-20 flex gap-2">
        {activeSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className="group relative flex items-center justify-center p-2"
            aria-label={`Go to slide ${index + 1}`}
          >
            <span
              className={cn(
                'h-1 rounded-full transition-all duration-500',
                current === index ? 'w-8 bg-gold' : 'w-2 bg-ivory/20 group-hover:bg-ivory/40'
              )}
            />
          </button>
        ))}
      </div>

      {/* Scroll down indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        onClick={scrollDown}
        aria-label="Scroll down"
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 text-muted hover:text-gold transition-colors"
      >
        <span className="font-jost text-[8px] tracking-[0.4em] uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-3.5 h-3.5 text-gold/80" />
        </motion.div>
      </motion.button>
    </section>
  );
}