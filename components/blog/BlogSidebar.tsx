import Link from 'next/link';
import { PublishedBlogPost } from '@/types/database';

interface BlogSidebarProps {
  posts?: PublishedBlogPost[];
  recentPosts?: PublishedBlogPost[];
}

const CATEGORIES = [
  { label: 'Interior Design', count: 0 },
  { label: 'Architecture', count: 0 },
  { label: 'Space Planning', count: 0 },
  { label: 'Materials & Finishes', count: 0 },
  { label: 'Design Trends', count: 0 },
];

export function BlogSidebar({ recentPosts = [] }: BlogSidebarProps) {
  return (
    <aside className="space-y-10">
      {/* Social Connect CTA */}
      <div className="border border-gold/15 bg-onyx/40 p-8 text-center">
        <span className="eyebrow block mb-3">Stay Inspired</span>
        <h3 className="font-cormorant text-2xl text-ivory mb-3">
          Connect With AVAAT
        </h3>
        <p className="font-jost text-xs text-muted leading-relaxed mb-6">
          Follow our latest projects, design insights, and studio updates.
        </p>
        <Link
          href="/#connect"
          className="inline-block font-jost text-[10px] tracking-[0.2em] uppercase px-6 py-3 border border-gold text-gold hover:bg-gold hover:text-onyx transition-all duration-300"
        >
          Connect
        </Link>
      </div>

      {/* Categories */}
      <div>
        <h3 className="font-cormorant text-xl text-ivory mb-5">Categories</h3>
        <div className="w-12 h-px bg-gold mb-6" />
        <ul className="space-y-3">
          {CATEGORIES.map(({ label }) => (
            <li key={label}>
              <span className="flex items-center gap-2 font-jost text-sm text-muted hover:text-gold transition-colors cursor-pointer">
                <span className="w-3 h-px bg-gold/40 flex-shrink-0" />
                {label}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <div>
          <h3 className="font-cormorant text-xl text-ivory mb-5">Recent Articles</h3>
          <div className="w-12 h-px bg-gold mb-6" />
          <ul className="space-y-6">
            {recentPosts.slice(0, 4).map((post) => (
              <li key={post.id}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block"
                >
                  <h4 className="font-cormorant text-base text-ivory group-hover:text-gold transition-colors leading-snug mb-1">
                    {post.title}
                  </h4>
                  {post.publishedAt && (
                    <time className="font-jost text-[10px] text-muted tracking-widest uppercase">
                      {new Date(post.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </time>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CTA block */}
      <div className="border-l-2 border-gold pl-5 py-2">
        <p className="font-cormorant text-lg text-ivory italic mb-2">
          Ready to transform your space?
        </p>
        <Link
          href="/contact"
          className="font-jost text-[10px] tracking-[0.2em] uppercase text-gold hover:text-gold-light transition-colors"
        >
          Book a Consultation →
        </Link>
      </div>
    </aside>
  );
}