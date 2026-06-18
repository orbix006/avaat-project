import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, Share2, Linkedin, ExternalLink } from 'lucide-react';
import { getBlogPostBySlug, getPublishedBlogPosts } from '@/lib/supabase/queries';
import { BlogCard } from '@/components/blog/BlogCard';
import { SocialConnect } from '@/components/sections/SocialConnect';

export const dynamic = 'force-dynamic';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) {
    return {
      title: 'Post Not Found — AVAAT Design Journal',
      description: 'The requested journal entry could not be found.',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://avaat.design';
  const metaTitle = post.seoTitle || post.title;
  const metaDesc = post.seoDescription || post.excerpt;

  return {
    title: metaTitle,
    description: metaDesc,
    keywords: post.tags && post.tags.length > 0 ? post.tags : ['design insight', 'architecture journal', 'luxury space planning'],
    openGraph: {
      type: 'article',
      locale: 'en_US',
      url: `${siteUrl}/blog/${post.slug}`,
      siteName: 'AVAAT Design',
      title: `${metaTitle} — AVAAT Design Journal`,
      description: metaDesc,
      publishedTime: post.publishedAt || undefined,
      authors: post.author?.name ? [post.author.name] : ['AVAAT Editorial'],
      images: post.featuredImage ? [{ url: post.featuredImage, width: 800, height: 500, alt: post.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${metaTitle} — AVAAT Design Journal`,
      description: metaDesc,
      images: post.featuredImage ? [post.featuredImage] : [],
    },
  };
}

function formatBlogContent(content: string) {
  if (!content) return null;

  // If it looks like HTML, render it directly
  if (/<[a-z][\s\S]*>/i.test(content)) {
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  }

  // Otherwise, split by double-newlines to form paragraphs
  return content
    .split(/\r?\n\r?\n/)
    .filter((p) => p.trim() !== '')
    .map((para, i) => (
      <p key={i} className="mb-6 font-jost text-muted leading-relaxed text-lg">
        {para.trim()}
      </p>
    ));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) {
    notFound();
  }

  // Fetch published blog posts and pick related posts (exclude current)
  const allPosts = await getPublishedBlogPosts();
  const relatedPosts = allPosts
    .filter((p) => p.slug !== post.slug)
    .slice(0, 2);

  // Format date elegantly
  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Recent Insights';

  const authorName = post.author?.name || 'AVAAT Editorial';
  const authorInitials = authorName.charAt(0).toUpperCase();

  return (
    <>
      <article className="min-h-screen bg-warm-black pt-36 pb-24">
        {/* Header container */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Back button */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-jost text-xs tracking-[0.2em] uppercase text-gold hover:text-gold-light transition-colors group mb-8"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Journal
          </Link>

          {/* Categories & Read Time */}
          <div className="flex items-center gap-4 mb-6">
            {post.tags && post.tags.length > 0 ? (
              post.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-jost text-[10px] text-gold tracking-[0.15em] uppercase border border-gold/20 px-2.5 py-1 bg-gold/5"
                >
                  {tag}
                </span>
              ))
            ) : (
              <span className="font-jost text-[10px] text-gold tracking-[0.15em] uppercase border border-gold/20 px-2.5 py-1 bg-gold/5">
                Insight
              </span>
            )}
            <span className="w-1.5 h-1.5 rounded-full bg-gold/30" />
            <span className="font-jost text-xs text-muted/60 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-gold" /> {post.readTime} min read
            </span>
          </div>

          {/* Title */}
          <h1 className="font-cormorant text-4xl md:text-5xl lg:text-6xl text-ivory leading-tight mb-8">
            {post.title}
          </h1>

          {/* Meta Author Info */}
          <div className="flex flex-wrap items-center justify-between gap-6 border-y border-gold/15 py-6 mb-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/25 flex items-center justify-center font-cormorant text-gold font-bold">
                {authorInitials}
              </div>
              <div>
                <span className="font-jost text-xs text-muted block">Written by</span>
                <span className="font-jost text-sm text-ivory font-medium">{authorName}</span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <span className="font-jost text-xs text-muted block">Published on</span>
                <span className="font-jost text-sm text-ivory flex items-center gap-1.5 justify-end">
                  <Calendar className="w-3.5 h-3.5 text-gold" /> {formattedDate}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl mb-12">
          <div className="relative aspect-[21/9] w-full mt-12 rounded-2xl overflow-hidden shadow-2xl">
            {post.featuredImage ? (
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 1200px"
                priority
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-onyx via-warm-black to-gold/10 flex flex-col items-center justify-center p-6 text-center select-none">
                <span className="font-cormorant text-5xl text-gold tracking-widest uppercase mb-2">AVAAT</span>
                <span className="font-jost text-xs text-muted/60 tracking-[0.4em] uppercase">Journal Curation</span>
              </div>
            )}
          </div>
        </div>

        {/* Editorial Body Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <div className="max-w-none [&>h2]:font-cormorant [&>h2]:text-3xl [&>h2]:text-ivory [&>h2]:mt-10 [&>h2]:mb-4 [&>p]:font-jost [&>p]:text-muted [&>p]:leading-relaxed [&>p]:mb-4 [&>div]:font-jost [&>div]:text-muted [&>div]:leading-relaxed [&>div]:mb-4">
            {formatBlogContent(post.content)}
          </div>

          {/* Social Share Footer */}
          <div className="border-t border-gold/10 mt-16 pt-8 flex items-center justify-between gap-4">
            <span className="font-jost text-xs text-muted flex items-center gap-2">
              <Share2 className="w-4 h-4 text-gold" /> Share Article
            </span>
            <div className="flex items-center gap-3">
              <button
                className="w-8 h-8 rounded-full border border-gold/15 flex items-center justify-center text-muted hover:text-gold hover:border-gold transition-colors"
                aria-label="Share on X"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
              <button
                className="w-8 h-8 rounded-full border border-gold/15 flex items-center justify-center text-muted hover:text-gold hover:border-gold transition-colors"
                aria-label="Share on social"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                className="w-8 h-8 rounded-full border border-gold/15 flex items-center justify-center text-muted hover:text-gold hover:border-gold transition-colors"
                aria-label="Share on LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Related Posts Section */}
        {relatedPosts.length > 0 && (
          <section className="border-t border-gold/10 mt-24 pt-20 bg-onyx/20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
              <h3 className="font-cormorant text-3xl text-ivory text-center mb-12">Related Journal Entries</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {relatedPosts.map((rPost, idx) => (
                  <BlogCard key={rPost.id} post={rPost} index={idx} />
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