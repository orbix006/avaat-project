'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { PublishedBlogPost } from '@/types/database';
import { cn } from '@/lib/utils';

interface BlogCardProps {
  post: PublishedBlogPost;
  index?: number;
  className?: string;
}

export function BlogCard({ post, index = 0, className }: BlogCardProps) {
  // Stagger reveal delay
  const delay = index * 0.08;

  // Format date elegantly
  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Recent Insights';

  // Fallbacks
  const authorName = post.author?.name || 'AVAAT Editorial';
  const displayExcerpt = post.excerpt || 'Bespoke architectural perspectives and interior design trends curated by the AVAAT editorial team.';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn('group flex flex-col h-full bg-warm-black/20 border border-gold/10 hover:border-gold/25 transition-all duration-500 overflow-hidden', className)}
    >
      <Link href={`/blog/${post.slug}`} className="flex flex-col h-full">
        {/* Cover Image Block */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-onyx">
          {post.featuredImage ? (
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-onyx via-warm-black to-gold/5 flex flex-col items-center justify-center p-6 text-center select-none">
              <span className="font-cormorant text-2xl text-gold tracking-[0.2em] uppercase mb-1">AVAAT</span>
              <span className="font-jost text-[8px] text-muted/50 tracking-[0.3em] uppercase">Journal Insight</span>
            </div>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-1.5">
              {post.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="font-jost text-[8px] tracking-widest uppercase bg-gold text-onyx px-2.5 py-1 font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="p-8 flex flex-col flex-grow">
          {/* Metadata Row (Date and Read Time) */}
          <div className="flex items-center gap-4 text-muted/60 font-jost text-[10px] tracking-widest uppercase mb-4">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-gold/60" />
              {formattedDate}
            </span>
            <span>&bull;</span>
            <span>{post.readTime} min read</span>
          </div>

          {/* Title */}
          <h3 className="font-cormorant text-2xl text-ivory group-hover:text-gold transition-colors duration-300 mb-3 font-normal tracking-wide leading-tight">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="font-jost text-sm text-muted leading-relaxed mb-6 flex-grow font-light line-clamp-3">
            {displayExcerpt}
          </p>

          {/* Footer Info (Author and CTA) */}
          <div className="pt-5 border-t border-gold/5 mt-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-gold/5 border border-gold/20 flex items-center justify-center rounded-full flex-shrink-0">
                <User className="w-3.5 h-3.5 text-gold" />
              </div>
              <span className="font-jost text-xs text-ivory tracking-wide font-light">
                {authorName}
              </span>
            </div>

            <span className="inline-flex items-center gap-2 font-jost text-[10px] tracking-[0.25em] uppercase text-gold group-hover:text-gold-light group-hover:gap-3.5 transition-all duration-300">
              Read <ArrowRight className="w-3 h-3 stroke-[1.5]" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}