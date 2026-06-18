'use client';
import { BlogCard } from './BlogCard';
import { PublishedBlogPost } from '@/types/database';

interface BlogGridProps {
  posts: PublishedBlogPost[];
}

export function BlogGrid({ posts }: BlogGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
      {posts.map((post, index) => (
        <BlogCard key={post.id} post={post} index={index} />
      ))}
    </div>
  );
}