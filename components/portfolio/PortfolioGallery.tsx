'use client';
import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { ProjectMedia } from '@/types/database';
import { cn } from '@/lib/utils';

interface PortfolioGalleryProps {
  media: ProjectMedia[];
  projectTitle: string;
}

export function PortfolioGallery({ media, projectTitle }: PortfolioGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!media || media.length === 0) return null;

  const sorted = [...media].sort((a, b) => a.order - b.order);

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const prev = () => setLightboxIndex((i) => (i !== null ? Math.max(0, i - 1) : 0));
  const next = () => setLightboxIndex((i) => (i !== null ? Math.min(sorted.length - 1, i + 1) : 0));

  return (
    <>
      {/* Masonry-style grid gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        {sorted.map((item, idx) => {
          const isLarge = idx % 3 === 0;
          return (
            <div
              key={item.id}
              className={cn(
                'relative overflow-hidden bg-onyx border border-gold/5 hover:border-gold/25 transition-colors duration-500 group cursor-pointer shadow-lg',
                isLarge ? 'md:col-span-2 aspect-[16/9] lg:aspect-[21/9]' : 'aspect-[4/3]'
              )}
              onClick={() => openLightbox(idx)}
              role="button"
              aria-label={`View ${item.caption || projectTitle} at full size`}
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && openLightbox(idx)}
            >
              <Image
                src={item.url}
                alt={item.alt || item.caption || projectTitle}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                sizes={isLarge ? '100vw' : '(max-width: 768px) 100vw, 50vw'}
              />

              {/* Dark overlay on hover */}
              <div className="absolute inset-0 bg-onyx/0 group-hover:bg-onyx/50 transition-all duration-500 flex items-center justify-center">
                <ZoomIn className="w-6 h-6 text-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Caption */}
              {item.caption && (
                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 bg-gradient-to-t from-onyx/90 to-transparent">
                  <p className="font-jost text-xs text-muted tracking-widest uppercase mb-0.5">
                    Perspective
                  </p>
                  <p className="font-cormorant text-base text-ivory font-light">{item.caption}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] bg-onyx/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Close */}
            <button
              className="absolute top-4 right-4 w-10 h-10 rounded-full border border-gold/20 flex items-center justify-center text-muted hover:text-gold hover:border-gold transition-colors z-10"
              onClick={closeLightbox}
              aria-label="Close lightbox"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Prev */}
            {lightboxIndex > 0 && (
              <button
                className="absolute left-4 w-10 h-10 rounded-full border border-gold/20 flex items-center justify-center text-muted hover:text-gold hover:border-gold transition-colors z-10"
                onClick={(e) => { e.stopPropagation(); prev(); }}
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            {/* Next */}
            {lightboxIndex < sorted.length - 1 && (
              <button
                className="absolute right-4 w-10 h-10 rounded-full border border-gold/20 flex items-center justify-center text-muted hover:text-gold hover:border-gold transition-colors z-10"
                onClick={(e) => { e.stopPropagation(); next(); }}
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            {/* Image */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-5xl max-h-[85vh] w-full aspect-video"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={sorted[lightboxIndex].url}
                alt={sorted[lightboxIndex].alt || sorted[lightboxIndex].caption || projectTitle}
                fill
                className="object-contain"
                sizes="(max-width: 1280px) 100vw, 1280px"
                priority
              />
            </motion.div>

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-jost text-[10px] text-muted tracking-widest uppercase">
              {lightboxIndex + 1} / {sorted.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}